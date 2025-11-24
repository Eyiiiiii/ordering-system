<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $brands = ['Uniqlo', 'Bench', 'H&M', 'Zara', 'Nike', 'Adidas'];
        $categories = ['T-Shirt', 'Pants', 'Skirt', 'Dress', 'Jacket', 'Shorts'];
        $sizes = ['S', 'M', 'L', 'XL'];
        $colors = ['Black', 'White', 'Blue', 'Red', 'Gray', 'Navy', 'Beige'];

        $images = [
            'T-Shirt' => 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
            'Pants' => 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400',
            'Skirt' => 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400',
            'Dress' => 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
            'Jacket' => 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
            'Shorts' => 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400',
        ];

        foreach ($brands as $brand) {
            foreach ($categories as $category) {
                // Create 6-8 products per category per brand
                $productCount = rand(6, 8);
                
                for ($i = 1; $i <= $productCount; $i++) {
                    Product::create([
                        'name' => $brand . ' ' . $category . ' ' . $i,
                        'brand' => $brand,
                        'category' => $category,
                        'description' => 'Premium quality ' . strtolower($category) . ' from ' . $brand . '. Perfect for everyday wear with comfort and style.',
                        'price' => rand(299, 2999),
                        'image_url' => $images[$category],
                        'size' => $sizes[array_rand($sizes)],
                        'color' => $colors[array_rand($colors)],
                        'stock' => rand(10, 100),
                    ]);
                }
            }
        }
    }
}