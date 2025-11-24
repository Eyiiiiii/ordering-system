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
        $orderPermissions = [
            'View Orders',
            'Create Orders',
            'Update Orders',
            'Delete Orders',
        ];
        
        $userPermissions = [
            'View Users',
            'Create Users',
            'Update Users',
            'Delete Users',
        ];

        $rolePermissions = [
            'View Roles',
            'Create Roles',
            'Update Roles',
            'Delete Roles',
        ];

        $activityLogPermissions = [
            'View Activity Logs',
        ];

        $permissions = array_merge(
            $orderPermissions,
            $userPermissions,
            $rolePermissions,
            $activityLogPermissions,
        );

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // Admin role gets all permissions
        $adminRole = Role::firstOrCreate(['name' => 'Admin', 'guard_name' => 'web']);
        $adminRole->syncPermissions($permissions);

        // User role gets limited permissions
        $userRole = Role::firstOrCreate(['name' => 'User', 'guard_name' => 'web']);
        $userRole->syncPermissions($orderPermissions);
    }
}