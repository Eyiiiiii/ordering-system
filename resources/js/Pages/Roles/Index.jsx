import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';

export default function Index({ auth, roles }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredRoles = roles.data.filter(role =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (role) => {
        if (confirm('Are you sure you want to delete this role?')) {
            router.delete(route('roles.destroy', role.id));
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Roles and Permissions" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Page Title */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Roles</h2>
                                <p className="text-sm text-gray-600 mt-1">Define roles and assign permissions for access control.</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">

                            {/* Search and Actions */}
                            <div className="flex justify-between items-center mb-8">
                                <input
                                    type="text"
                                    placeholder="Search roles..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="px-4 py-2 border-b-2 border-gray-200 focus:border-gray-400 focus:outline-none transition-colors bg-transparent"
                                    style={{ width: '300px' }}
                                />
                                <Link
                                    href={route('roles.create')}
                                    className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
                                    style={{ backgroundColor: '#FA7143' }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#e96539'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#FA7143'}
                                >
                                    Create Role
                                </Link>
                            </div>

                            {/* Roles Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                                Name
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                                Permissions
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
                                        {filteredRoles.map((role) => (
                                            <tr key={role.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-4 text-sm font-medium text-gray-900">
                                                    {role.name}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="text-sm text-gray-900">
                                                        {role.permissions.length} permissions
                                                    </div>
                                                    {role.permissions.length > 0 && (
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            {role.permissions.slice(0, 3).map(p => p.name).join(', ')}
                                                            {role.permissions.length > 3 && '...'}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-600">
                                                    {new Date(role.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-right">
                                                    <div className="flex justify-end gap-3">
                                                        <Link
                                                            href={route('roles.show', role.id)}
                                                            className="text-gray-600 hover:text-gray-900 transition-colors"
                                                        >
                                                            View
                                                        </Link>
                                                        <Link
                                                            href={route('roles.edit', role.id)}
                                                            className="text-gray-600 hover:text-gray-900 transition-colors"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(role)}
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
                                {filteredRoles.length === 0 && (
                                    <div className="text-center py-12 text-gray-500">
                                        No roles found
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            {roles.links && (
                                <div className="mt-8 flex items-center justify-between text-sm text-gray-600">
                                    <div>
                                        Showing {roles.from} to {roles.to} of {roles.total} results
                                    </div>
                                    <div className="flex gap-2">
                                        {roles.prev_page_url && (
                                            <Link
                                                href={roles.prev_page_url}
                                                className="px-3 py-1 hover:bg-gray-100 rounded transition-colors"
                                            >
                                                Previous
                                            </Link>
                                        )}
                                        {roles.next_page_url && (
                                            <Link
                                                href={roles.next_page_url}
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
