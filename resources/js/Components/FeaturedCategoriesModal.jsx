import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const AVAILABLE_BRANDS = ['Adidas', 'Bench', 'H&M', 'Nike', 'Uniqlo', 'Zara'];
const AVAILABLE_COLORS = [
    { name: 'Blue', hex: '#0074D9' },
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Red', hex: '#FF4136' },
];

export default function FeaturedCategoriesModal({ isOpen, onClose, category }) {
    const page = usePage();
    const user = page.props.auth?.user || null;
    const isAdmin = !!user && (user.roles || []).some(r => (r.name || '').toLowerCase() === 'admin');

    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState(category ? { ...category } : {});
    const [showCustomColor, setShowCustomColor] = useState(false);
    const [customColor, setCustomColor] = useState({ name: '', hex: '#000000' });

    if (!isOpen || !category) return null;

    const handleEditClick = () => {
        setIsEditMode(true);
    };

    const handleDeleteClick = () => {
        if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
            router.delete(route('categories.destroy', category.id), {
                onSuccess: () => {
                    onClose();
                },
            });
        }
    };

    const handleSave = () => {
        // Prepare colors array with custom color if applicable
        const colorsToSave = showCustomColor
            ? [...(formData.colors || []), customColor]
            : formData.colors;

        router.put(route('categories.update', category.id), {
            name: formData.name,
            brand: formData.brand,
            sizes: formData.sizes,
            colors: colorsToSave,
            description: formData.description,
        }, {
            onSuccess: () => {
                setIsEditMode(false);
                onClose();
            },
        });
    };

    const handleCancel = () => {
        setIsEditMode(false);
        setFormData({ ...category });
        setShowCustomColor(false);
        setCustomColor({ name: '', hex: '#000000' });
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleColorToggle = (colorName) => {
        if (!formData.colors) {
            formData.colors = [];
        }
        const colorObj = AVAILABLE_COLORS.find(c => c.name === colorName);
        const exists = formData.colors.find(c => c.name === colorName);
        
        if (exists) {
            setFormData(prev => ({
                ...prev,
                colors: prev.colors.filter(c => c.name !== colorName),
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                colors: [...(prev.colors || []), colorObj],
            }));
        }
    };

    const handleSizeToggle = (size) => {
        const exists = (formData.sizes || []).includes(size);
        if (exists) {
            setFormData(prev => ({
                ...prev,
                sizes: prev.sizes.filter(s => s !== size),
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                sizes: [...(prev.sizes || []), size],
            }));
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="w-full max-w-md max-h-[90vh] overflow-y-auto transform rounded-2xl bg-white shadow-xl transition-all"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="relative h-48 overflow-hidden rounded-t-2xl bg-gradient-to-b from-slate-900 to-slate-800">
                        <div className="absolute inset-0 flex items-end p-6">
                            <div>
                                {isEditMode ? (
                                    <input
                                        type="text"
                                        value={formData.name || ''}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className="text-2xl font-bold text-white bg-slate-800/50 border-b-2 border-white/50 focus:outline-none focus:border-white px-2 py-1 rounded"
                                        placeholder="Enter category name"
                                    />
                                ) : (
                                    <h2 className="text-2xl font-bold text-white">
                                        {category.name}
                                    </h2>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 text-white hover:bg-white/20 rounded-full p-2 transition"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                        {/* Brand with admin controls */}
                        <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Brand
                                </p>
                                {isAdmin && !isEditMode && (
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={handleEditClick}
                                            className="text-xs text-gray-400 hover:text-gray-600 transition"
                                            title="Edit"
                                        >
                                            Edit
                                        </button>
                                        <span className="text-gray-300">•</span>
                                        <button
                                            onClick={handleDeleteClick}
                                            className="text-xs text-gray-400 hover:text-gray-600 transition"
                                            title="Delete"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                            {isEditMode ? (
                                <select
                                    value={formData.brand || ''}
                                    onChange={(e) => handleInputChange('brand', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="">Select a brand</option>
                                    {AVAILABLE_BRANDS.map(brand => (
                                        <option key={brand} value={brand}>{brand}</option>
                                    ))}
                                </select>
                            ) : (
                                <p className="mt-1 text-sm text-gray-800 font-medium">
                                    {category.brand || 'N/A'}
                                </p>
                            )}
                        </div>

                        {/* Sizes */}
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                                Available Sizes
                            </p>
                            {isEditMode ? (
                                <div className="flex flex-wrap gap-2">
                                    {AVAILABLE_SIZES.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => handleSizeToggle(size)}
                                            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                                                (formData.sizes || []).includes(size)
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {category.sizes?.map((size) => (
                                        <span
                                            key={size}
                                            className="inline-flex items-center rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 bg-gray-50"
                                        >
                                            {size}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Colors */}
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                                Available Colors
                            </p>
                            {isEditMode ? (
                                <div className="space-y-3">
                                    <div className="flex flex-wrap gap-3">
                                        {AVAILABLE_COLORS.map(color => {
                                            const isSelected = (formData.colors || []).some(c => c.name === color.name);
                                            return (
                                                <button
                                                    key={color.name}
                                                    onClick={() => handleColorToggle(color.name)}
                                                    className={`flex items-center gap-2 rounded-lg border-2 px-3 py-2 text-xs font-medium transition ${
                                                        isSelected
                                                            ? 'border-blue-500 bg-blue-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                >
                                                    <div
                                                        className="h-4 w-4 rounded-full border border-gray-300"
                                                        style={{ backgroundColor: color.hex }}
                                                    />
                                                    {color.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <button
                                        onClick={() => setShowCustomColor(!showCustomColor)}
                                        className="text-xs text-blue-600 hover:text-blue-700 underline"
                                    >
                                        {showCustomColor ? 'Hide' : 'Add Custom Color'}
                                    </button>

                                    {showCustomColor && (
                                        <div className="rounded-lg bg-gray-50 p-3 space-y-2">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    Color Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={customColor.name}
                                                    onChange={(e) => setCustomColor(prev => ({ ...prev, name: e.target.value }))}
                                                    className="w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                    placeholder="e.g., Navy Blue"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    Hex Code
                                                </label>
                                                <input
                                                    type="text"
                                                    value={customColor.hex}
                                                    onChange={(e) => setCustomColor(prev => ({ ...prev, hex: e.target.value }))}
                                                    className="w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                    placeholder="#000000"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="mt-2 flex flex-wrap gap-3">
                                    {category.colors?.map((color) => (
                                        <div key={color.name} className="flex items-center gap-2">
                                            <div
                                                className="h-6 w-6 rounded-full border-2 border-gray-300"
                                                style={{ backgroundColor: color.hex }}
                                            />
                                            <span className="text-xs text-gray-600">
                                                {color.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        {category.description && (
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                                    Description
                                </p>
                                {isEditMode ? (
                                    <textarea
                                        value={formData.description || ''}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        rows="3"
                                        placeholder="Enter description"
                                    />
                                ) : (
                                    <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                                        {category.description}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end gap-3">
                        {isEditMode ? (
                            <>
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                                >
                                    Save Changes
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
                                >
                                    Close
                                </button>

                                <Link
                                    href={route('products.index')}
                                    className="px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition inline-flex items-center"
                                >
                                    See in Products
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
