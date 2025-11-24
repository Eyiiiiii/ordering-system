import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';

export default function Index({ items, subtotal, auth }) {
    const { data, setData, post, processing, errors } = useForm({
        payment_method: 'credit_card',
        delivery_address: '',
        customer_name: auth.user.name || '',
        contact_number: '',
    });

    const [selectedKeys, setSelectedKeys] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        const q = {};
        const keys = [];
        (items || []).forEach((item) => {
            q[item.key] = item.quantity;
            keys.push(item.key);
        });
        setQuantities(q);
        setSelectedKeys(keys);
    }, [items]);

    const toggleKey = (key) => {
        setSelectedKeys((prev) => {
            if (prev.includes(key)) return prev.filter((k) => k !== key);
            return [...prev, key];
        });
    };

    const selectAll = () => {
        if (!items || items.length === 0) return;
        if (selectedKeys.length === items.length) {
            setSelectedKeys([]);
        } else {
            setSelectedKeys(items.map((i) => i.key));
        }
    };

    const subtotalSelected = (items || []).reduce((acc, item) => {
        return selectedKeys.includes(item.key) ? acc + item.price * (quantities[item.key] || item.quantity) : acc;
    }, 0);

    const handleUpdate = (key) => {
        const qty = parseInt(quantities[key], 10) || 1;
        router.post(route('cart.update'), { key, quantity: qty }, { preserveScroll: true });
    };

    const handleRemove = (key) => {
        router.post(route('cart.remove'), { key }, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Shopping Cart
                    </h2>
                    <Link
                        href={route('products.index')}
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        Continue Shopping
                    </Link>
                </div>
            }
        >
            <Head title="Cart" />

            <div className="py-12">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                                <h3 className="mb-4 text-base font-semibold text-gray-900">Items</h3>

                                {items && items.length > 0 ? (
                                    <div className="space-y-4">
                                        <div className="mb-3 flex items-center gap-3">
                                            <label className="inline-flex items-center gap-2">
                                                <input type="checkbox" className="h-4 w-4" checked={selectedKeys.length === items.length} onChange={selectAll} />
                                                <span className="text-sm text-gray-700">Select All</span>
                                            </label>
                                        </div>
                                        {items.map((item) => (
                                            <div key={item.key} className="flex items-center gap-4">
                                                <div>
                                                    <input type="checkbox" className="h-4 w-4" checked={selectedKeys.includes(item.key)} onChange={() => toggleKey(item.key)} />
                                                </div>
                                                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                                    <img src={item.image_url || 'https://via.placeholder.com/200'} alt={item.name} className="h-full w-full object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h4 className="text-sm font-semibold text-gray-900">{item.name}</h4>
                                                            <p className="text-xs text-gray-500">{item.size} • {item.color}</p>
                                                        </div>
                                                        <div className="text-sm font-medium text-gray-900">₱{parseFloat(item.price).toFixed(2)}</div>
                                                    </div>

                                                    <div className="mt-2 flex items-center gap-3">
                                                        <div className="flex items-center gap-2">
                                                            <input type="number" value={quantities[item.key] ?? item.quantity} min="1" onChange={(e) => setQuantities((q) => ({ ...q, [item.key]: e.target.value }))} className="w-20 rounded-md border-gray-300 text-sm shadow-sm" />
                                                            <button type="button" onClick={() => handleUpdate(item.key)} className="ml-2 rounded-md bg-gray-100 px-3 py-1 text-sm">Update</button>
                                                        </div>

                                                        <button type="button" onClick={() => handleRemove(item.key)} className="ml-2 rounded-md bg-red-50 px-3 py-1 text-sm text-red-700">Remove</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-lg bg-white p-12 text-center shadow-sm">
                                        <p className="text-gray-500">Your cart is empty.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                                <h3 className="mb-4 text-base font-semibold text-gray-900">Summary</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium text-gray-900">₱{parseFloat(subtotal).toFixed(2)}</span>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Selected</span>
                                            <span className="font-medium text-gray-900">{selectedKeys.length} item(s)</span>
                                        </div>

                                        <div className="mt-4">
                                            <button type="button" onClick={() => setShowConfirm(true)} disabled={selectedKeys.length === 0 || processing} className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50">Checkout Selected ({selectedKeys.length})</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Confirmation Modal for selected items */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowConfirm(false)} />

                    <div className="relative z-10 w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-900">Confirm Checkout</h3>
                        <p className="mt-2 text-sm text-gray-600">Review selected items before confirming checkout.</p>

                        <div className="mt-4 space-y-3 max-h-60 overflow-y-auto">
                            {(items || []).filter(i => selectedKeys.includes(i.key)).map((item) => (
                                <div key={item.key} className="flex items-start justify-between gap-4">
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900">{item.name}</h4>
                                        <p className="text-xs text-gray-500">{item.size} • {item.color} • Qty: {quantities[item.key] ?? item.quantity}</p>
                                    </div>
                                    <div className="text-sm font-semibold text-gray-900">₱{((item.price * (quantities[item.key] ?? item.quantity))).toFixed(2)}</div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 border-t border-gray-200 pt-3 space-y-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">Payment Method</label>
                                <select value={data.payment_method} onChange={(e) => setData('payment_method', e.target.value)} className="w-full rounded-lg border-gray-300 text-sm shadow-sm focus:border-gray-900 focus:ring-gray-900">
                                    <option value="credit_card">Credit Card</option>
                                    <option value="e_wallet">E-Wallet</option>
                                    <option value="cod">Cash on Delivery</option>
                                </select>
                                {errors.payment_method && <p className="mt-1 text-sm text-red-600">{errors.payment_method}</p>}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">Customer Name</label>
                                <input type="text" value={data.customer_name} onChange={(e) => setData('customer_name', e.target.value)} className="w-full rounded-lg border-gray-300 text-sm shadow-sm" />
                                {errors.customer_name && <p className="mt-1 text-sm text-red-600">{errors.customer_name}</p>}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">Contact Number</label>
                                <input type="tel" value={data.contact_number} onChange={(e) => setData('contact_number', e.target.value)} className="w-full rounded-lg border-gray-300 text-sm shadow-sm" />
                                {errors.contact_number && <p className="mt-1 text-sm text-red-600">{errors.contact_number}</p>}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">Delivery Address</label>
                                <textarea value={data.delivery_address} onChange={(e) => setData('delivery_address', e.target.value)} rows="3" className="w-full rounded-lg border-gray-300 text-sm shadow-sm" />
                                {errors.delivery_address && <p className="mt-1 text-sm text-red-600">{errors.delivery_address}</p>}
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3">
                            <div className="text-sm text-gray-600">Total for selected</div>
                            <div className="text-lg font-bold text-gray-900">₱{subtotalSelected.toFixed(2)}</div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button type="button" onClick={() => setShowConfirm(false)} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">Cancel</button>
                            <button type="button" onClick={() => post(route('cart.checkout'), { data: { ...data, keys: selectedKeys }, onSuccess: () => setShowConfirm(false) })} disabled={processing} className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50">{processing ? 'Processing...' : 'Confirm Checkout'}</button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
