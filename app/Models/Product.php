<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'brand',
        'category',
        'description',
        'price',
        'image_url',
        'size',
        'color',
        'stock',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price' => 'decimal:2',
        'stock' => 'integer',
    ];

    /**
     * Scope a query to filter by brand.
     */
    public function scopeBrand($query, $brand)
    {
        return $query->when($brand, function ($query, $brand) {
            return $query->where('brand', $brand);
        });
    }

    /**
     * Scope a query to filter by category.
     */
    public function scopeCategory($query, $category)
    {
        return $query->when($category, function ($query, $category) {
            return $query->where('category', $category);
        });
    }

    /**
     * Scope a query to search products.
     */
    public function scopeSearch($query, $search)
    {
        return $query->when($search, function ($query, $search) {
            return $query->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%");
            });
        });
    }

    /**
     * Check if product is low on stock.
     */
    public function isLowStock()
    {
        return $this->stock <= 10;
    }

    /**
     * Check if product is out of stock.
     */
    public function isOutOfStock()
    {
        return $this->stock <= 0;
    }

    /**
     * Get formatted price with currency symbol.
     */
    public function getFormattedPriceAttribute()
    {
        return '₱' . number_format($this->price, 2);
    }
}