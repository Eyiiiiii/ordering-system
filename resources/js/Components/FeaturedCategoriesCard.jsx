import { usePage, router } from '@inertiajs/react';

export default function FeaturedCategoriesCard({ category, onViewDetails, onEdit, onDelete }) {
    const page = usePage();
    const user = page.props.auth?.user || null;
    const isAdmin = !!user && (user.roles || []).some(r => (r.name || '').toLowerCase() === 'admin');

    const handleEdit = (e) => {
        e.stopPropagation();
        onEdit?.(category);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
            onDelete?.(category);
        }
    };

    return (
        <div className="group relative h-48 overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-slate-900 to-slate-800 p-6 transition-all hover:shadow-lg hover:border-gray-300">
            {/* Gradient background with category theme */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Content */}
            <div className="relative flex h-full flex-col justify-between">
                <div>
                    {/* Brand with admin controls */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                            Collection
                        </p>
                        {isAdmin && (
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={handleEdit}
                                    className="rounded text-xs text-gray-400 hover:text-gray-200 transition"
                                    title="Edit"
                                >
                                    Edit
                                </button>
                                <span className="text-gray-600">•</span>
                                <button
                                    onClick={handleDelete}
                                    className="rounded text-xs text-gray-400 hover:text-gray-200 transition"
                                    title="Delete"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition">
                        {category.name}
                    </h3>
                </div>

                {/* View Details Button */}
                <button
                    onClick={onViewDetails}
                    className="inline-flex items-center gap-2 rounded-lg border border-blue-500/50 bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-300 hover:bg-blue-500/20 hover:border-blue-400 transition group-hover:translate-y-0 translate-y-1"
                >
                    View Details
                    <svg
                        className="h-4 w-4 transition group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}
