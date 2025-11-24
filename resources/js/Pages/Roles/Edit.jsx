import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Edit({ auth, role, permissions }) {
    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
        permissions: role.permissions.map(p => p.id),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('roles.update', role.id));
    };

    const handlePermissionChange = (permissionId, checked) => {
        if (checked) {
            setData('permissions', [...data.permissions, permissionId]);
        } else {
            // If unchecking a "View" permission, also remove dependent permissions
            const allPermissions = Object.values(permissions).flat();
            const permission = allPermissions.find(p => p.id === permissionId);
            
            if (permission && permission.name.startsWith('View')) {
                const resource = permission.name.replace(/^View\s+/, '').trim();
                const dependentPermissions = allPermissions.filter(p => {
                    const permResource = p.name.replace(/^(View|Create|Update|Delete|Manage|Approve|Reject|Submit|Cancel)\s+/, '').trim();
                    return permResource === resource && !p.name.startsWith('View');
                });
                const dependentIds = dependentPermissions.map(p => p.id);
                setData('permissions', data.permissions.filter(id => 
                    id !== permissionId && !dependentIds.includes(id)
                ));
            } else {
                setData('permissions', data.permissions.filter(id => id !== permissionId));
            }
        }
    };

    let groupedPermissions = [];
    Object.entries(permissions).forEach(([groupKey, perms]) => {
        let resourceName = groupKey;
        if (perms.length > 0) {
            resourceName = perms[0].name.replace(/^(View|Create|Update|Delete|Manage|Approve|Reject|Submit|Cancel)\s+/, '').trim();
        }
        let groupName = resourceName;
        if (!groupName.toLowerCase().endsWith('management')) {
            groupName = `${groupName} Management`;
        }
        groupedPermissions.push({ group: groupName, permissions: perms });
    });

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Edit Role" />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-8">
                            {/* Page Title */}
                            <div className="mb-8 flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-gray-800">Edit Role</h2>
                                <Link
                                    href={route('roles.index')}
                                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    ← Back to Roles
                                </Link>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Role Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-4 py-2 border-b-2 border-gray-200 focus:border-gray-400 focus:outline-none transition-colors bg-transparent"
                                        placeholder="Enter role name"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-4">
                                        Permissions
                                    </label>
                                    <div className="space-y-4">
                                        {groupedPermissions.map(({ group, permissions }) => {
                                            const sortedPermissions = permissions.sort((a, b) => {
                                                if (a.name.startsWith('View')) return -1;
                                                if (b.name.startsWith('View')) return 1;
                                                return a.name.localeCompare(b.name);
                                            });
                                            
                                            return (
                                                <div key={group} className="border border-gray-200 rounded-lg p-6">
                                                    <h3 className="text-base font-semibold text-gray-800 mb-4">
                                                        {group}
                                                    </h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {sortedPermissions.map((permission) => {
                                                            const isViewPermission = permission.name.startsWith('View');
                                                            const resource = permission.name.replace(/^(View|Create|Update|Delete|Manage|Approve|Reject|Submit|Cancel)\s+/, '').trim();
                                                            const viewPermission = permissions.find(p => p.name === `View ${resource}`);
                                                            const isDisabled = !isViewPermission && viewPermission && !data.permissions.includes(viewPermission.id);
                                                            
                                                            return (
                                                                <label 
                                                                    key={permission.id} 
                                                                    className={`flex items-center p-3 rounded border transition-all cursor-pointer ${
                                                                        isDisabled 
                                                                            ? 'opacity-50 bg-gray-50 border-gray-200' 
                                                                            : 'hover:bg-gray-50 border-gray-200'
                                                                    }`}
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={data.permissions.includes(permission.id)}
                                                                        disabled={isDisabled}
                                                                        onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                                                                        className="rounded border-gray-300 text-gray-700 focus:ring-0 focus:ring-offset-0 disabled:opacity-50"
                                                                    />
                                                                    <div className="ml-3 flex-1">
                                                                        <span className="text-sm text-gray-700">
                                                                            {permission.name}
                                                                        </span>
                                                                        {isDisabled && (
                                                                            <div className="text-xs text-gray-500 mt-1">
                                                                                Requires "View {resource}"
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </label>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {errors.permissions && (
                                        <p className="mt-2 text-sm text-red-600">{errors.permissions}</p>
                                    )}
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                                    <Link
                                        href={route('roles.index')}
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
                                        {processing ? 'Updating...' : 'Update Role'}
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
