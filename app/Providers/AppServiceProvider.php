<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        // Share cart count with all Inertia responses
        Inertia::share('cartCount', function () {
            $cart = session()->get('cart', []);
            $count = 0;
            foreach ($cart as $item) {
                $count += isset($item['quantity']) ? (int) $item['quantity'] : 0;
            }
            return $count;
        });
    }
}
