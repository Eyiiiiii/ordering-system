import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Show({ user }) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(route('users.destroy', user.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        User Details
                    </h2>
                    <div className="flex space-x-2">
                        <Link
                            href={route('users.edit', user.id)}
                            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Edit User
                        </Link>
                        <Link
                            href={route('users.index')}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Back to Users
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`User: ${user.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">User Information</h3>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Name</label>
                                            <p className="mt-1 text-sm text-gray-900">{user.name}</p>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Email</label>
                                            <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Email Verified</label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {user.email_verified_at ? (
                                                    <span className="text-green-600">Verified</span>
                                                ) : (
                                                    <span className="text-red-600">Not Verified</span>
                                                )}
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Created At</label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {new Date(user.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Updated At</label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {new Date(user.updated_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
                                    
                                    <div className="space-y-3">
                                        <Link
                                            href={route('users.edit', user.id)}
                                            className="block w-full bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded text-center"
                                        >
                                            Edit User
                                        </Link>
                                        
                                        <button
                                            onClick={handleDelete}
                                            className="block w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Delete User
                                        </button>
                                        
                                        <Link
                                            href={route('users.index')}
                                            className="block w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-center"
                                        >
                                            Back to Users List
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
