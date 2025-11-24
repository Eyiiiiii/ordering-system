<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {   
        $adminPermissions = [
            'View Orders',
            'Create Orders',
            'Update Orders',
            'Delete Orders',
        ];
        
        // Create hierarchical CRUD permissions for Orders
        $userPermissions = [
            'View Orders',
            'Create Orders',
            'Update Orders',
            'Delete Orders',
        ];

        $activityLogPermissions = [
            'View Activity Logs',
        ];

        $permissions = array_merge(
            $adminPermissions,
            $userPermissions,
            $activityLogPermissions,
        );

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        $roles = [
            // 'Dev',
            'Admin',
            'User',
        ];

        foreach ($roles as $roleName) {
            $role = Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);
            $role->syncPermissions($permissions);
        }
    }
}

