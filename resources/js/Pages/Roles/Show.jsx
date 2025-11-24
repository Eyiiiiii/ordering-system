import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ auth, role }) {
    const groupedPermissions = role.permissions.reduce((groups, permission) => {
        const group = permission.name.split('.')[0];
        if (!groups[group]) {
            groups[group] = [];
        }
        groups[group].push(permission);
        return groups;
    }, {});

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Role Details</h2>}
        >
            <Head title={`Role: ${role.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6">
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">{role.name}</h1>
                                <p className="text-gray-600">
                                    Created on {new Date(role.created_at).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Permissions</h2>
                                {Object.keys(groupedPermissions).length > 0 ? (
                                    <div className="space-y-4">
                                        {Object.entries(groupedPermissions).map(([group, permissions]) => (
                                            <div key={group} className="border rounded-lg p-4">
                                                <h3 className="text-md font-medium text-gray-900 mb-3 capitalize">
                                                    {group} Permissions ({permissions.length})
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                                    {permissions.map((permission) => (
                                                        <div key={permission.id} className="flex items-center">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                {permission.name}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No permissions assigned to this role.</p>
                                )}
                            </div>

                            <div className="flex items-center justify-end space-x-4">
                                <Link
                                    href={route('roles.index')}
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Back to Roles
                                </Link>
                                <Link
                                    href={route('roles.edit', role.id)}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Edit Role
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
