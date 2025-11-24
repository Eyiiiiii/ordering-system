<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function index(Request $request)
    {
        // Validate that required parameters are present
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'size' => 'required|string',
            'color' => 'required|string',
            'quantity' => 'required|integer|min:1',
            'total' => 'required|numeric|min:0',
        ]);

        $product = Product::findOrFail($request->product_id);
        
        // Check if product has enough stock
        if ($product->stock < $request->quantity) {
            return redirect()->route('products.index')
                ->with('error', 'Not enough stock available for this product.');
        }
        
        return Inertia::render('Checkout/Index', [
            'product' => $product,
            'size' => $request->size,
            'color' => $request->color,
            'quantity' => (int) $request->quantity,
            'total' => (float) $request->total,
            'userName' => auth()->user()->name,
        ]);
    }
}