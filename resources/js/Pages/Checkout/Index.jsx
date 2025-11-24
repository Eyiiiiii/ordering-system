import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { CreditCard, Wallet, Truck, ArrowLeft } from 'lucide-react';

export default function Index({ product, size, color, quantity, total, userName }) {
    const { data, setData, post, processing, errors } = useForm({
        payment_method: 'credit_card',
        delivery_address: '',
        customer_name: userName || '',
        contact_number: '',
        total_amount: total,
        product_id: product.id,
        size: size,
        color: color,
        quantity: quantity,
    });

    const [showConfirm, setShowConfirm] = useState(false);
    const paymentMethods = [
        {
            id: 'credit_card',
            name: 'Credit Card',
            icon: CreditCard,
        },
        {
            id: 'e_wallet',
            name: 'E-Wallet (GCash, PayMaya)',
            icon: Wallet,
        },
        {
            id: 'cod',
            name: 'Cash on Delivery',
            icon: Truck,
        },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        // Open confirmation modal instead of immediate submit
        setShowConfirm(true);
    };

    const confirmOrder = () => {
        // Send the form using Inertia and close modal on success
        post(route('orders.store'), {
            onSuccess: () => setShowConfirm(false),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Checkout
                    </h2>
                    <Link
                        href={route('products.index')}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Products
                    </Link>
                </div>
            }
        >
            <Head title="Checkout" />

            <div className="py-12">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8 lg:grid-cols-5">
                        {/* Main Form - Left Side */}
                        <div className="lg:col-span-3">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Payment Method */}
                                <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                                    <h3 className="mb-4 text-base font-semibold text-gray-900">
                                        Payment Method
                                    </h3>
                                    <div className="space-y-2">
                                        {paymentMethods.map((method) => {
                                            const Icon = method.icon;
                                            return (
                                                <label
                                                    key={method.id}
                                                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                                                        data.payment_method === method.id
                                                            ? 'border-gray-900 bg-gray-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="payment_method"
                                                        value={method.id}
                                                        checked={data.payment_method === method.id}
                                                        onChange={(e) =>
                                                            setData('payment_method', e.target.value)
                                                        }
                                                        className="h-4 w-4 border-gray-300 text-gray-900 focus:ring-gray-900"
                                                    />
                                                    <Icon className="h-5 w-5 text-gray-600" />
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {method.name}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                    {errors.payment_method && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.payment_method}
                                        </p>
                                    )}
                                </div>

                                {/* Delivery Information */}
                                <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                                    <h3 className="mb-4 text-base font-semibold text-gray-900">
                                        Delivery Information
                                    </h3>
                                    <div className="space-y-4">
                                        {/* Customer Name */}
                                        <div>
                                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                                Customer Name
                                            </label>
                                            <input
                                                type="text"
                                                value={data.customer_name}
                                                onChange={(e) =>
                                                    setData('customer_name', e.target.value)
                                                }
                                                className="w-full rounded-lg border-gray-300 text-sm shadow-sm focus:border-gray-900 focus:ring-gray-900"
                                                placeholder="Enter your full name"
                                            />
                                            {errors.customer_name && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.customer_name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Contact Number */}
                                        <div>
                                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                                Contact Number
                                            </label>
                                            <input
                                                type="tel"
                                                value={data.contact_number}
                                                onChange={(e) =>
                                                    setData('contact_number', e.target.value)
                                                }
                                                className="w-full rounded-lg border-gray-300 text-sm shadow-sm focus:border-gray-900 focus:ring-gray-900"
                                                placeholder="+63 XXX XXX XXXX"
                                            />
                                            {errors.contact_number && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.contact_number}
                                                </p>
                                            )}
                                        </div>

                                        {/* Delivery Address */}
                                        <div>
                                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                                Delivery Address
                                            </label>
                                            <textarea
                                                value={data.delivery_address}
                                                onChange={(e) =>
                                                    setData('delivery_address', e.target.value)
                                                }
                                                rows="3"
                                                className="w-full rounded-lg border-gray-300 text-sm shadow-sm focus:border-gray-900 focus:ring-gray-900"
                                                placeholder="Enter your complete delivery address"
                                            />
                                            {errors.delivery_address && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.delivery_address}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Place Order Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing ? 'Processing...' : 'Place Order'}
                                </button>
                            </form>
                        </div>

                        {/* Order Summary - Right Side */}
                        <div className="lg:col-span-2">
                            <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                                <h3 className="mb-4 text-base font-semibold text-gray-900">
                                    Order Summary
                                </h3>

                                {/* Product Details */}
                                <div className="mb-4 flex gap-3">
                                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                        <img
                                            src={product.image_url || 'https://via.placeholder.com/200'}
                                            alt={product.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                                            {product.name}
                                        </h4>
                                        <p className="text-xs text-gray-500">{product.brand}</p>
                                        <div className="mt-1 flex gap-2 text-xs text-gray-600">
                                            <span>{size}</span>
                                            <span>•</span>
                                            <span>{color}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Details */}
                                <div className="space-y-2 border-t border-gray-200 pt-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Price</span>
                                        <span className="font-medium text-gray-900">
                                            ₱{parseFloat(product.price).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Quantity</span>
                                        <span className="font-medium text-gray-900">
                                            {quantity}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-gray-200 pt-2 text-base">
                                        <span className="font-semibold text-gray-900">Total</span>
                                        <span className="text-xl font-bold text-gray-900">
                                            ₱{parseFloat(total).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowConfirm(false)} />

                    <div className="relative z-10 w-full max-w-xl rounded-lg bg-white p-6 shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-900">Confirm Order</h3>
                        <p className="mt-2 text-sm text-gray-600">Please review your order details before confirming.</p>

                        <div className="mt-4 space-y-3">
                            <div>
                                <h4 className="text-sm font-medium text-gray-700">Payment Method</h4>
                                <p className="mt-1 text-sm text-gray-900">
                                    {data.payment_method === 'credit_card' ? 'Credit Card' : data.payment_method === 'e_wallet' ? 'E-Wallet' : 'Cash on Delivery'}
                                </p>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-gray-700">Delivery Information</h4>
                                <div className="mt-1 text-sm text-gray-900">
                                    <p><span className="font-medium">Name:</span> {data.customer_name}</p>
                                    <p><span className="font-medium">Contact:</span> {data.contact_number}</p>
                                    <p className="mt-1"><span className="font-medium">Address:</span> {data.delivery_address}</p>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Item</span>
                                    <span className="font-medium text-gray-900">{product.name}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Quantity</span>
                                    <span className="font-medium text-gray-900">{quantity}</span>
                                </div>
                                <div className="flex items-center justify-between text-base mt-2">
                                    <span className="font-semibold text-gray-900">Total</span>
                                    <span className="text-xl font-bold text-gray-900">₱{parseFloat(total).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowConfirm(false)}
                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmOrder}
                                disabled={processing}
                                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
                            >
                                {processing ? 'Processing...' : 'Confirm Order'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}