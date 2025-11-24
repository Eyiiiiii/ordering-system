<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::search($request->search)
            ->brand($request->brand)
            ->category($request->category)
            ->latest()
            ->paginate(12);

        // Get all unique brands and categories for filters
        $brands = Product::distinct()->pluck('brand')->sort()->values();
        $categories = Product::distinct()->pluck('category')->sort()->values();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'brands' => $brands,
            'categories' => $categories,
            'filters' => [
                'brand' => $request->brand,
                'category' => $request->category,
                'search' => $request->search,
            ],
        ]);
    }

    public function show(Product $product)
    {
        // Get related products (same category or brand, different products)
        $relatedProducts = Product::where(function($query) use ($product) {
                $query->where('category', $product->category)
                      ->orWhere('brand', $product->brand);
            })
            ->where('id', '!=', $product->id)
            ->inRandomOrder()
            ->limit(4)
            ->get();

        return Inertia::render('Products/Show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }

    public function create()
    {
        $brands = Product::distinct()->pluck('brand')->sort()->values();
        $categories = Product::distinct()->pluck('category')->sort()->values();

        return Inertia::render('Products/Create', [
            'brands' => $brands,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'image_url' => 'nullable|url',
            'size' => 'nullable|string|max:10',
            'color' => 'nullable|string|max:50',
            'stock' => 'required|integer|min:0',
        ]);

        Product::create($validated);

        return redirect()->route('products.index')
            ->with('success', 'Product created successfully.');
    }

    public function edit(Product $product)
    {
        $brands = Product::distinct()->pluck('brand')->sort()->values();
        $categories = Product::distinct()->pluck('category')->sort()->values();

        return Inertia::render('Products/Edit', [
            'product' => $product,
            'brands' => $brands,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'image_url' => 'nullable|url',
            'size' => 'nullable|string|max:10',
            'color' => 'nullable|string|max:50',
            'stock' => 'required|integer|min:0',
        ]);

        $product->update($validated);

        return redirect()->route('products.show', $product)
            ->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('products.index')
            ->with('success', 'Product deleted successfully.');
    }
}