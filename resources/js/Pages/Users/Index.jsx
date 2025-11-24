import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FlashMessage from '@/Components/FlashMessage';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ users }) {
    const [searchTerm, setSearchTerm] = useState('');
    const { flash } = usePage().props;

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(route('users.destroy', id));
        }
    };

    const filteredUsers = users.data.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.roles && user.roles.some(role => 
            role.name.toLowerCase().includes(searchTerm.toLowerCase())
        ))
    );

    return (
        <AuthenticatedLayout>
            <Head title="Users" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Page Title */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Users</h2>
                                <p className="text-sm text-gray-600 mt-1">Manage application users, roles, and access.</p>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Flash Messages */}
                            {flash?.success && (
                                <FlashMessage message={flash.success} type="success" />
                            )}
                            {flash?.error && (
                                <FlashMessage message={flash.error} type="error" />
                            )}

                            {/* Search and Actions */}
                            <div className="flex justify-between items-center mb-8">
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="px-4 py-2 border-b-2 border-gray-200 focus:border-gray-400 focus:outline-none transition-colors bg-transparent"
                                    style={{ width: '300px' }}
                                />
                                <Link
                                    href={route('users.create')}
                                    className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
                                    style={{ backgroundColor: '#FA7143' }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#e96539'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#FA7143'}
                                >
                                    Add New User
                                </Link>
                            </div>

                            {/* Users Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                                Name
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                                Email
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                                Role
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                                Created
                                            </th>
                                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((user) => (
                                            <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-4 text-sm font-medium text-gray-900">
                                                    {user.name}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-600">
                                                    {user.email}
                                                </td>
                                                <td className="px-4 py-4">
                                                    {user.roles && user.roles.length > 0 ? (
                                                        <div className="flex flex-wrap gap-1">
                                                            {user.roles.map((role) => (
                                                                <span
                                                                    key={role.id}
                                                                    className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded"
                                                                >
                                                                    {role.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">—</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-600">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-right">
                                                    <div className="flex justify-end gap-3">
                                                        <Link
                                                            href={route('users.show', user.id)}
                                                            className="text-gray-600 hover:text-gray-900 transition-colors"
                                                        >
                                                            View
                                                        </Link>
                                                        <Link
                                                            href={route('users.edit', user.id)}
                                                            className="text-gray-600 hover:text-gray-900 transition-colors"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(user.id)}
                                                            className="text-red-500 hover:text-red-700 transition-colors"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                
                                {/* Empty State */}
                                {filteredUsers.length === 0 && (
                                    <div className="text-center py-12 text-gray-500">
                                        No users found
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            {users.links && (
                                <div className="mt-8 flex items-center justify-between text-sm text-gray-600">
                                    <div>
                                        Showing {users.from} to {users.to} of {users.total} results
                                    </div>
                                    <div className="flex gap-2">
                                        {users.links.prev && (
                                            <Link
                                                href={users.links.prev}
                                                className="px-3 py-1 hover:bg-gray-100 rounded transition-colors"
                                            >
                                                Previous
                                            </Link>
                                        )}
                                        {users.links.next && (
                                            <Link
                                                href={users.links.next}
                                                className="px-3 py-1 hover:bg-gray-100 rounded transition-colors"
                                            >
                                                Next
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
