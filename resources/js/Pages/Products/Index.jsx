import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { X, CheckCircle } from 'lucide-react';

export default function Index({ products, brands, categories, filters }) {
    const page = usePage();
    const { flash } = page.props;
    const user = page.props.auth?.user || null;
    const isAdmin = !!user && (user.roles || []).some(r => (r.name || '').toLowerCase() === 'admin');
    const [showFlash, setShowFlash] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            setShowFlash(true);
            const timer = setTimeout(() => setShowFlash(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);
    
    const [search, setSearch] = useState(filters.search || '');
    const [selectedBrand, setSelectedBrand] = useState(filters.brand || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState('White');
    const [quantity, setQuantity] = useState(1);

    const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const availableColors = ['White', 'Black', 'Gray', 'Navy', 'Red', 'Blue', 'Green', 'Beige'];

    const colorClasses = {
        White: 'bg-white border-2 border-gray-300',
        Black: 'bg-black',
        Gray: 'bg-gray-500',
        Navy: 'bg-blue-900',
        Red: 'bg-red-500',
        Blue: 'bg-blue-500',
        Green: 'bg-green-500',
        Beige: 'bg-amber-100',
    };

    const handleFilter = (filterType, value) => {
        const params = { ...filters };
        
        if (filterType === 'brand') {
            params.brand = value === selectedBrand ? '' : value;
            setSelectedBrand(params.brand);
        } else if (filterType === 'category') {
            params.category = value === selectedCategory ? '' : value;
            setSelectedCategory(params.category);
        }
        
        router.get(route('products.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('products.index'), { ...filters, search }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setSelectedBrand('');
        setSelectedCategory('');
        router.get(route('products.index'));
    };

    const openModal = (product) => {
        setSelectedProduct(product);
        setSelectedSize(product.size || 'M');
        setSelectedColor(product.color || 'White');
        setQuantity(1);
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
        document.body.style.overflow = 'unset';
    };

    const handleAddToCart = () => {
        router.post(route('cart.add'), {
            product_id: selectedProduct.id,
            size: selectedSize,
            color: selectedColor,
            quantity: quantity,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
            },
        });
    };

    const handleCheckout = () => {
        const total = selectedProduct.price * quantity;
        router.visit(route('checkout.index'), {
            method: 'get',
            data: {
                product_id: selectedProduct.id,
                size: selectedSize,
                color: selectedColor,
                quantity: quantity,
                total: total,
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Products
                    </h2>
                    <Link
                        href={route('products.create')}
                        className="rounded-md bg-gray-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
                    >
                        Add Product
                    </Link>
                </div>
            }
        >
            <Head title="Products" />

            {/* Flash Message */}
            {showFlash && flash?.success && (
                <div className="fixed right-4 top-4 z-50 flex items-center gap-3 rounded-lg bg-green-50 px-6 py-4 shadow-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <p className="font-medium text-green-800">{flash.success}</p>
                </div>
            )}

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Search and Filters */}
                    <div className="mb-8 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Search Bar */}
                            <form onSubmit={handleSearch} className="mb-6">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search products..."
                                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                                    />
                                    <button
                                        type="submit"
                                        className="rounded-md bg-gray-800 px-6 py-2 text-white hover:bg-gray-700"
                                    >
                                        Search
                                    </button>
                                </div>
                            </form>

                            {/* Brand Filter */}
                            {brands && brands.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
                                        Brands
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {brands.map((brand) => (
                                            <button
                                                key={brand}
                                                onClick={() => handleFilter('brand', brand)}
                                                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                                    selectedBrand === brand
                                                        ? 'bg-gray-800 text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                {brand}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Category Filter */}
                            {categories && categories.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
                                        Categories
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {categories.map((category) => (
                                            <button
                                                key={category}
                                                onClick={() => handleFilter('category', category)}
                                                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                                    selectedCategory === category
                                                        ? 'bg-gray-800 text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Clear Filters */}
                            {(selectedBrand || selectedCategory || search) && (
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-gray-600 underline hover:text-gray-800"
                                >
                                    Clear all filters
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Products Grid */}
                    {products && products.data && products.data.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {products.data.map((product) => (
                                    <div
                                        key={product.id}
                                        onClick={() => openModal(product)}
                                        className="group relative cursor-pointer overflow-hidden rounded-lg bg-white shadow-sm transition hover:shadow-lg"
                                    >
                                        <div className="aspect-square overflow-hidden bg-gray-200">
                                            <img
                                                src={product.image_url || 'https://via.placeholder.com/400'}
                                                alt={product.name}
                                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <div className="mb-1 flex items-center justify-between">
                                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                    {product.brand}
                                                </span>
                                                {isAdmin && (
                                                    <div className="flex items-center gap-1 text-xs">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                router.get(route('products.edit', product.id));
                                                            }}
                                                            className="text-gray-400 hover:text-gray-600 transition"
                                                            title="Edit"
                                                        >
                                                            Edit
                                                        </button>
                                                        <span className="text-gray-300">•</span>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
                                                                    router.delete(route('products.destroy', product.id));
                                                                }
                                                            }}
                                                            className="text-gray-400 hover:text-gray-600 transition"
                                                            title="Delete"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                                                    {product.category}
                                                </span>
                                            </div>
                                            <h3 className="mb-2 font-semibold text-gray-900">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center justify-between">
                                                <p className="text-lg font-bold text-gray-900">
                                                    ₱{parseFloat(product.price).toFixed(2)}
                                                </p>
                                                <div className="flex gap-2 text-xs text-gray-500">
                                                    {product.size && <span>{product.size}</span>}
                                                    {product.color && <span>•</span>}
                                                    {product.color && <span>{product.color}</span>}
                                                </div>
                                            </div>
                                            <p className="mt-2 text-xs text-gray-500">
                                                Stock: {product.stock}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {products.links && products.links.length > 3 && (
                                <div className="mt-8 flex justify-center gap-2">
                                    {products.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            preserveState
                                            preserveScroll
                                            className={`rounded-md px-4 py-2 text-sm ${
                                                link.active
                                                    ? 'bg-gray-800 text-white'
                                                    : link.url
                                                    ? 'bg-white text-gray-700 hover:bg-gray-100'
                                                    : 'cursor-not-allowed bg-gray-100 text-gray-400'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="rounded-lg bg-white p-12 text-center shadow-sm">
                            <p className="text-gray-500">No products found.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Product Modal */}
            {isModalOpen && selectedProduct && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
                        onClick={closeModal}
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={closeModal}
                                className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-gray-600 shadow-lg transition hover:bg-white hover:text-gray-900"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <div className="grid gap-8 p-8 lg:grid-cols-2">
                                {/* Left Side - Product Image */}
                                <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
                                    <img
                                        src={selectedProduct.image_url || 'https://via.placeholder.com/600'}
                                        alt={selectedProduct.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                {/* Right Side - Product Details */}
                                <div className="flex flex-col">
                                    {/* Brand & Category */}
                                    <div className="mb-3 flex items-center gap-3">
                                        <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                                            {selectedProduct.brand}
                                        </span>
                                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                                            {selectedProduct.category}
                                        </span>
                                    </div>

                                    {/* Product Name */}
                                    <h2 className="mb-4 text-3xl font-bold text-gray-900">
                                        {selectedProduct.name}
                                    </h2>

                                    {/* Price */}
                                    <div className="mb-6 text-4xl font-bold text-gray-900">
                                        ₱{parseFloat(selectedProduct.price).toFixed(2)}
                                    </div>

                                    {/* Description */}
                                    {selectedProduct.description && (
                                        <p className="mb-6 text-gray-600 leading-relaxed">
                                            {selectedProduct.description}
                                        </p>
                                    )}

                                    {/* Size Selection */}
                                    <div className="mb-6">
                                        <label className="mb-3 block text-sm font-semibold text-gray-900">
                                            Select Size
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {availableSizes.map((size) => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={`min-w-[3rem] rounded-lg px-4 py-2 text-sm font-medium transition ${
                                                        selectedSize === size
                                                            ? 'bg-gray-900 text-white shadow-md'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Color Selection */}
                                    <div className="mb-8">
                                        <label className="mb-3 block text-sm font-semibold text-gray-900">
                                            Select Color
                                        </label>
                                        <div className="flex flex-wrap gap-3">
                                            {availableColors.map((color) => (
                                                <button
                                                    key={color}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`group relative flex items-center gap-2 rounded-lg px-4 py-2 transition ${
                                                        selectedColor === color
                                                            ? 'ring-2 ring-gray-900 ring-offset-2'
                                                            : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-2'
                                                    }`}
                                                >
                                                    <div className={`h-6 w-6 rounded-full shadow-sm ${colorClasses[color]}`} />
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {color}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Quantity */}
                                    <div className="mb-8">
                                        <label className="mb-3 block text-sm font-semibold text-gray-900">
                                            Quantity
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="rounded-lg bg-gray-100 px-4 py-2 font-semibold text-gray-700 transition hover:bg-gray-200"
                                            >
                                                -
                                            </button>
                                            <span className="min-w-[3rem] text-center text-lg font-semibold">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                                                className="rounded-lg bg-gray-100 px-4 py-2 font-semibold text-gray-700 transition hover:bg-gray-200"
                                            >
                                                +
                                            </button>
                                            <span className="ml-2 text-sm text-gray-500">
                                                {selectedProduct.stock} available
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-auto flex gap-3">
                                        <button
                                            onClick={handleAddToCart}
                                            className="flex-1 rounded-lg border-2 border-gray-900 bg-white px-6 py-4 font-semibold text-gray-900 transition hover:bg-gray-50"
                                        >
                                            Add to Cart
                                        </button>
                                        <button
                                            onClick={handleCheckout}
                                            className="flex-1 rounded-lg bg-gray-900 px-6 py-4 font-semibold text-white transition hover:bg-gray-800"
                                        >
                                            Proceed to Checkout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </AuthenticatedLayout>
    );
}