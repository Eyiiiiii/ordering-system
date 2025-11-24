import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FlashMessage from '@/Components/FlashMessage';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function Edit({ user }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
    });
    const { flash } = usePage().props;

    const submit = (e) => {
        e.preventDefault();
        put(route('users.update', user.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Edit User: ${user.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-8">
                            {/* Page Title */}
                            <div className="mb-8 flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-gray-800">Edit User</h2>
                                <Link
                                    href={route('users.index')}
                                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    ← Back to Users
                                </Link>
                            </div>

                            {/* Flash Messages */}
                            {flash?.success && (
                                <FlashMessage message={flash.success} type="success" />
                            )}
                            {flash?.error && (
                                <FlashMessage message={flash.error} type="error" />
                            )}

                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-4 py-2 border-b-2 border-gray-200 focus:border-gray-400 focus:outline-none transition-colors bg-transparent"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full px-4 py-2 border-b-2 border-gray-200 focus:border-gray-400 focus:outline-none transition-colors bg-transparent"
                                        required
                                    />
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <p className="text-sm text-gray-600 mb-4">Leave password fields blank to keep current password</p>
                                    
                                    <div className="space-y-6">
                                        <div>
                                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                                New Password
                                            </label>
                                            <input
                                                id="password"
                                                type="password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                className="w-full px-4 py-2 border-b-2 border-gray-200 focus:border-gray-400 focus:outline-none transition-colors bg-transparent"
                                            />
                                            {errors.password && (
                                                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                                                Confirm New Password
                                            </label>
                                            <input
                                                id="password_confirmation"
                                                type="password"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                className="w-full px-4 py-2 border-b-2 border-gray-200 focus:border-gray-400 focus:outline-none transition-colors bg-transparent"
                                            />
                                            {errors.password_confirmation && (
                                                <p className="mt-2 text-sm text-red-600">{errors.password_confirmation}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                                    <Link
                                        href={route('users.index')}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50"
                                        style={{ backgroundColor: '#FA7143' }}
                                        onMouseEnter={(e) => !processing && (e.target.style.backgroundColor = '#e96539')}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#FA7143'}
                                    >
                                        {processing ? 'Updating...' : 'Update User'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
