<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $this->authorize('View Roles');

        $roles = Role::with('permissions')->latest()->paginate(10);

        return Inertia::render('Roles/Index', [
            'roles' => $roles,
            'auth' => [
                'user' => auth()->user()->load('roles.permissions', 'permissions')
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $this->authorize('Create Roles');

        // Group permissions by resource name (dynamic, future-proof)
        $permissions = Permission::all()->groupBy(function ($permission) {
            return preg_replace('/^(View|Create|Update|Delete|Manage|Approve|Reject|Submit|Cancel)\s+/i', '', $permission->name);
        });

        return Inertia::render('Roles/Create', [
            'permissions' => $permissions,
            'auth' => [
                'user' => auth()->user()->load('roles.permissions', 'permissions')
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $this->authorize('Create Roles');

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role = Role::create(['name' => $validated['name']]);

        if (!empty($validated['permissions'])) {
            $permissions = Permission::whereIn('id', $validated['permissions'])->get();
            $role->syncPermissions($permissions);
        }

        return redirect()->route('roles.index')
            ->with('success', 'Role created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Role $role): Response
    {
        $this->authorize('View Roles');

        $role->load('permissions');

        return Inertia::render('Roles/Show', [
            'role' => $role,
            'auth' => [
                'user' => auth()->user()->load('roles.permissions', 'permissions')
            ]
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role): Response
    {
        $this->authorize('Update Roles');

        // Group permissions by resource name (dynamic, future-proof)
        $permissions = Permission::all()->groupBy(function ($permission) {
            return preg_replace('/^(View|Create|Update|Delete|Manage|Approve|Reject|Submit|Cancel)\s+/i', '', $permission->name);
        });

        $role->load('permissions');

        return Inertia::render('Roles/Edit', [
            'role' => $role,
            'permissions' => $permissions,
            'auth' => [
                'user' => auth()->user()->load('roles.permissions', 'permissions')
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Role $role): RedirectResponse
    {
        $this->authorize('Update Roles');

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('roles')->ignore($role->id),
            ],
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role->update(['name' => $validated['name']]);

        if (isset($validated['permissions'])) {
            $permissions = Permission::whereIn('id', $validated['permissions'])->get();
            $role->syncPermissions($permissions);
        }

        return redirect()->route('roles.index')
            ->with('success', 'Role updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role): RedirectResponse
    {
        $this->authorize('Delete Roles');

        $role->delete();

        return redirect()->route('roles.index')
            ->with('success', 'Role deleted successfully.');
    }
}