import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ brands, categories }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        brand: '',
        category: '',
        description: '',
        price: '',
        image_url: '',
        size: '',
        color: '',
        stock: '',
    });

    const [useCustomBrand, setUseCustomBrand] = useState(false);
    const [useCustomCategory, setUseCustomCategory] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('products.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Add New Product
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
            <Head title="Add Product" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6">
                            {/* Product Name */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Product Name *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                                    placeholder="e.g., Classic Cotton T-Shirt"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>

                            {/* Brand */}
                            <div className="mb-6">
                                <div className="mb-2 flex items-center justify-between">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Brand *
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setUseCustomBrand(!useCustomBrand)}
                                        className="text-xs text-gray-600 hover:text-gray-900"
                                    >
                                        {useCustomBrand ? 'Select from list' : 'Add new brand'}
                                    </button>
                                </div>
                                {useCustomBrand ? (
                                    <input
                                        type="text"
                                        value={data.brand}
                                        onChange={(e) => setData('brand', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                                        placeholder="Enter brand name"
                                    />
                                ) : (
                                    <select
                                        value={data.brand}
                                        onChange={(e) => setData('brand', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                                    >
                                        <option value="">Select a brand</option>
                                        {brands.map((brand) => (
                                            <option key={brand} value={brand}>
                                                {brand}
                                            </option>
                                        ))}
                                    </select>
                                )}
                                {errors.brand && (
                                    <p className="mt-1 text-sm text-red-600">{errors.brand}</p>
                                )}
                            </div>

                            {/* Category */}
                            <div className="mb-6">
                                <div className="mb-2 flex items-center justify-between">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Category *
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setUseCustomCategory(!useCustomCategory)}
                                        className="text-xs text-gray-600 hover:text-gray-900"
                                    >
                                        {useCustomCategory ? 'Select from list' : 'Add new category'}
                                    </button>
                                </div>
                                {useCustomCategory ? (
                                    <input
                                        type="text"
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                                        placeholder="Enter category name"
                                    />
                                ) : (
                                    <select
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                )}
                                {errors.category && (
                                    <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows="4"
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                                    placeholder="Describe the product..."
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                )}
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Price (₱) *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                                    placeholder="0.00"
                                />
                                {errors.price && (
                                    <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                                )}
                            </div>

                            {/* Image URL */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Image URL
                                </label>
                                <input
                                    type="url"
                                    value={data.image_url}
                                    onChange={(e) => setData('image_url', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                                    placeholder="https://example.com/image.jpg"
                                />
                                {errors.image_url && (
                                    <p className="mt-1 text-sm text-red-600">{errors.image_url}</p>
                                )}
                            </div>

                            <div className="mb-6 grid gap-6 md:grid-cols-2">
                                {/* Size */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Size
                                    </label>
                                    <select
                                        value={data.size}
                                        onChange={(e) => setData('size', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                                    >
                                        <option value="">Select size</option>
                                        <option value="XS">XS</option>
                                        <option value="S">S</option>
                                        <option value="M">M</option>
                                        <option value="L">L</option>
                                        <option value="XL">XL</option>
                                        <option value="XXL">XXL</option>
                                    </select>
                                    {errors.size && (
                                        <p className="mt-1 text-sm text-red-600">{errors.size}</p>
                                    )}
                                </div>

                                {/* Color */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Color
                                    </label>
                                    <input
                                        type="text"
                                        value={data.color}
                                        onChange={(e) => setData('color', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                                        placeholder="e.g., Black, White"
                                    />
                                    {errors.color && (
                                        <p className="mt-1 text-sm text-red-600">{errors.color}</p>
                                    )}
                                </div>
                            </div>

                            {/* Stock */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Stock Quantity *
                                </label>
                                <input
                                    type="number"
                                    value={data.stock}
                                    onChange={(e) => setData('stock', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                                    placeholder="0"
                                />
                                {errors.stock && (
                                    <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
                                )}
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 rounded-md bg-gray-800 px-6 py-3 font-semibold text-white transition hover:bg-gray-700 disabled:opacity-50"
                                >
                                    {processing ? 'Creating...' : 'Create Product'}
                                </button>
                                <Link
                                    href={route('products.index')}
                                    className="rounded-md border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}