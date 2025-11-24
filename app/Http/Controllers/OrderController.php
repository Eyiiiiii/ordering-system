<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'payment_method' => 'required|in:credit_card,e_wallet,cod',
            'delivery_address' => 'required|string',
            'customer_name' => 'required|string|max:255',
            'contact_number' => 'required|string|max:20',
            'total_amount' => 'required|numeric|min:0',
            'product_id' => 'required|exists:products,id',
            'size' => 'required|string',
            'color' => 'required|string',
            'quantity' => 'required|integer|min:1',
        ]);

        // Check if product has enough stock
        $product = Product::find($validated['product_id']);
        
        if ($product->stock < $validated['quantity']) {
            return back()->withErrors([
                'quantity' => 'Not enough stock available.'
            ]);
        }

        // Create the order
        Order::create([
            'user_id' => auth()->id(),
            'product_id' => $validated['product_id'],
            'payment_method' => $validated['payment_method'],
            'delivery_address' => $validated['delivery_address'],
            'customer_name' => $validated['customer_name'],
            'contact_number' => $validated['contact_number'],
            'total_amount' => $validated['total_amount'],
            'size' => $validated['size'],
            'color' => $validated['color'],
            'quantity' => $validated['quantity'],
            'status' => 'pending',
        ]);

        // Update product stock
        $product->decrement('stock', $validated['quantity']);

        return redirect()->route('products.index')
            ->with('success', 'Order placed successfully!');
    }
}