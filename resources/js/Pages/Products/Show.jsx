import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Show({ product, relatedProducts }) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this product?')) {
            router.delete(route('products.destroy', product.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Product Details
                    </h2>
                    <Link
                        href={route('products.index')}
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        ← Back to Products
                    </Link>
                </div>
            }
        >
            <Head title={product.name} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="grid gap-8 p-6 lg:grid-cols-2">
                            {/* Product Image */}
                            <div className="overflow-hidden rounded-lg bg-gray-100">
                                <img
                                    src={product.image_url || 'https://via.placeholder.com/800'}
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            {/* Product Details */}
                            <div className="flex flex-col">
                                <div className="mb-2 flex items-center gap-3">
                                    <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                                        {product.brand}
                                    </span>
                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                                        {product.category}
                                    </span>
                                </div>

                                <h1 className="mb-4 text-3xl font-bold text-gray-900">
                                    {product.name}
                                </h1>

                                <div className="mb-6 text-4xl font-bold text-gray-900">
                                    ₱{parseFloat(product.price).toFixed(2)}
                                </div>

                                {product.description && (
                                    <p className="mb-6 text-gray-600 leading-relaxed">
                                        {product.description}
                                    </p>
                                )}

                                <div className="mb-6 space-y-3 border-t border-gray-200 pt-6">
                                    {product.size && (
                                        <div className="flex items-center">
                                            <span className="w-24 text-sm font-medium text-gray-500">
                                                Size:
                                            </span>
                                            <span className="text-gray-900">{product.size}</span>
                                        </div>
                                    )}
                                    {product.color && (
                                        <div className="flex items-center">
                                            <span className="w-24 text-sm font-medium text-gray-500">
                                                Color:
                                            </span>
                                            <span className="text-gray-900">{product.color}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center">
                                        <span className="w-24 text-sm font-medium text-gray-500">
                                            Stock:
                                        </span>
                                        <span className={`font-medium ${
                                            product.stock > 10 ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {product.stock} available
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-auto flex gap-3">
                                    <Link
                                        href={route('products.edit', product.id)}
                                        className="flex-1 rounded-md bg-gray-800 px-6 py-3 text-center font-semibold text-white transition hover:bg-gray-700"
                                    >
                                        Edit Product
                                    </Link>
                                    <button
                                        onClick={handleDelete}
                                        className="rounded-md border border-red-300 px-6 py-3 font-semibold text-red-600 transition hover:bg-red-50"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-12">
                            <h2 className="mb-6 text-2xl font-bold text-gray-900">
                                Related Products
                            </h2>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {relatedProducts.map((relatedProduct) => (
                                    <Link
                                        key={relatedProduct.id}
                                        href={route('products.show', relatedProduct.id)}
                                        className="group overflow-hidden rounded-lg bg-white shadow-sm transition hover:shadow-lg"
                                    >
                                        <div className="aspect-square overflow-hidden bg-gray-200">
                                            <img
                                                src={relatedProduct.image_url || 'https://via.placeholder.com/400'}
                                                alt={relatedProduct.name}
                                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                {relatedProduct.brand}
                                            </span>
                                            <h3 className="mt-1 font-semibold text-gray-900">
                                                {relatedProduct.name}
                                            </h3>
                                            <p className="mt-2 text-lg font-bold text-gray-900">
                                                ₱{parseFloat(relatedProduct.price).toFixed(2)}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}