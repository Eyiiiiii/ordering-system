<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    protected function cartKey()
    {
        return 'cart';
    }

    public function add(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'size' => 'required|string',
            'color' => 'required|string',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($validated['product_id']);

        if ($product->stock < $validated['quantity']) {
            return back()->with('error', 'Not enough stock available for this product.');
        }

        $cart = session()->get($this->cartKey(), []);

        // Use composite key product|size|color to group same variants
        $key = $product->id . '|' . $validated['size'] . '|' . $validated['color'];

        if (isset($cart[$key])) {
            $cart[$key]['quantity'] += $validated['quantity'];
        } else {
            $cart[$key] = [
                'product_id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'image_url' => $product->image_url,
                'size' => $validated['size'],
                'color' => $validated['color'],
                'quantity' => $validated['quantity'],
            ];
        }

        session()->put($this->cartKey(), $cart);

        return back()->with('success', 'Product added to cart.');
    }

    public function index()
    {
        $cart = session()->get($this->cartKey(), []);

        // Include key for each item so frontend can reference it
        $items = [];
        foreach ($cart as $key => $item) {
            $item['key'] = $key;
            $items[] = $item;
        }

        $subtotal = array_reduce($items, function ($carry, $item) {
            return $carry + ($item['price'] * $item['quantity']);
        }, 0);

        return Inertia::render('Cart/Index', [
            'items' => $items,
            'subtotal' => (float) $subtotal,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'key' => 'required|string',
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = session()->get($this->cartKey(), []);

        if (!isset($cart[$validated['key']])) {
            return back()->with('error', 'Cart item not found.');
        }

        $productId = $cart[$validated['key']]['product_id'];
        $product = Product::findOrFail($productId);

        if ($product->stock < $validated['quantity']) {
            return back()->with('error', 'Not enough stock available for this product.');
        }

        $cart[$validated['key']]['quantity'] = $validated['quantity'];
        session()->put($this->cartKey(), $cart);

        return back()->with('success', 'Cart updated.');
    }

    public function remove(Request $request)
    {
        $validated = $request->validate([
            'key' => 'required|string',
        ]);

        $cart = session()->get($this->cartKey(), []);

        if (isset($cart[$validated['key']])) {
            unset($cart[$validated['key']]);
            session()->put($this->cartKey(), $cart);
        }

        return back()->with('success', 'Item removed from cart.');
    }

    public function checkout(Request $request)
    {
        // Validate delivery/payment details for cart checkout and optional selected keys
        $validated = $request->validate([
            'payment_method' => 'required|in:credit_card,e_wallet,cod',
            'delivery_address' => 'required|string',
            'customer_name' => 'required|string|max:255',
            'contact_number' => 'required|string|max:20',
            'keys' => 'nullable|array',
            'keys.*' => 'string',
        ]);

        $cart = session()->get($this->cartKey(), []);

        if (empty($cart)) {
            return back()->with('error', 'Your cart is empty.');
        }

        // Determine which keys to checkout (all or subset)
        $selectedKeys = $validated['keys'] ?? array_keys($cart);

        $selectedItems = [];
        foreach ($selectedKeys as $key) {
            if (isset($cart[$key])) {
                $selectedItems[$key] = $cart[$key];
            }
        }

        if (empty($selectedItems)) {
            return back()->with('error', 'No valid items selected for checkout.');
        }

        // Check stock for selected items
        foreach ($selectedItems as $key => $item) {
            $product = Product::find($item['product_id']);
            if (!$product || $product->stock < $item['quantity']) {
                return back()->with('error', 'One or more selected items do not have enough stock.');
            }
        }

        // Create orders for each selected cart item
        foreach ($selectedItems as $key => $item) {
            Order::create([
                'user_id' => auth()->id(),
                'product_id' => $item['product_id'],
                'payment_method' => $validated['payment_method'],
                'delivery_address' => $validated['delivery_address'],
                'customer_name' => $validated['customer_name'],
                'contact_number' => $validated['contact_number'],
                'total_amount' => $item['price'] * $item['quantity'],
                'size' => $item['size'],
                'color' => $item['color'],
                'quantity' => $item['quantity'],
                'status' => 'pending',
            ]);

            // Decrement stock
            $product = Product::find($item['product_id']);
            $product->decrement('stock', $item['quantity']);

            // Remove item from cart
            unset($cart[$key]);
        }

        // Save updated cart (remaining items)
        session()->put($this->cartKey(), $cart);

        return redirect()->route('products.index')->with('success', 'Order placed successfully for selected cart items.');
    }
}
