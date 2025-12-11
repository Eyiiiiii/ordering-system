import { useEffect, useMemo, useRef, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import {
    ResponsiveContainer,
    StackedCarousel,
} from 'react-stacked-center-carousel';
import Fab from '@mui/material/Fab';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FeaturedCategoriesCard from '@/Components/FeaturedCategoriesCard';
import FeaturedCategoriesModal from '@/Components/FeaturedCategoriesModal';

const featuredCapsule = [
    {
        name: 'Monochrome Essentials',
        brand: 'Calvin Klein',
        mood: 'Minimal street',
        image: 'https://images.unsplash.com/photo-1495121605193-b116b5b09d16?auto=format&fit=crop&w=600&q=80',
    },
    {
        name: 'Soft Neutrals',
        brand: 'Arket',
        mood: 'Studio comfort',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80',
    },
    {
        name: 'Modern Utility',
        brand: 'COS',
        mood: 'Weekday-ready',
        image: 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=600&q=80',
    },
    {
        name: 'Soft Tailoring',
        brand: 'Theory',
        mood: 'Boardroom calm',
        image: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=600&q=80',
    },
    {
        name: 'Sunlit Linen',
        brand: 'Uniqlo U',
        mood: 'Resort ease',
        image: 'https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=600&q=80',
    },
    {
        name: 'Evening Minimal',
        brand: 'Helmut Lang',
        mood: 'Gallery night',
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80',
    },
];

const stackDepth = 5;

const featuredCategories = [
    {
        id: 1,
        name: 'Cloth 1',
        brand: 'Premium Collection',
        description: 'High-quality fabric with modern design aesthetic.',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        colors: [
            { name: 'Black', hex: '#000000' },
            { name: 'White', hex: '#FFFFFF' },
            { name: 'Navy', hex: '#001F3F' },
            { name: 'Grey', hex: '#808080' },
        ],
    },
    {
        id: 2,
        name: 'Cloth 2',
        brand: 'Urban Wear',
        description: 'Comfortable everyday wear for casual occasions.',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: [
            { name: 'Red', hex: '#FF4136' },
            { name: 'Blue', hex: '#0074D9' },
            { name: 'Green', hex: '#2ECC40' },
            { name: 'Beige', hex: '#F0E68C' },
        ],
    },
    {
        id: 3,
        name: 'Cloth 3',
        brand: 'Elegance Line',
        description: 'Sophisticated style for professional settings.',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
            { name: 'Burgundy', hex: '#800020' },
            { name: 'Charcoal', hex: '#36454F' },
            { name: 'Cream', hex: '#FFFDD0' },
        ],
    },
    {
        id: 4,
        name: 'Kids',
        brand: 'Young Style',
        description: 'Playful and durable clothing for children.',
        sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-12Y'],
        colors: [
            { name: 'Rainbow', hex: '#FF6B9D' },
            { name: 'Sky Blue', hex: '#87CEEB' },
            { name: 'Lime', hex: '#32CD32' },
            { name: 'Sunny Yellow', hex: '#FFD700' },
            { name: 'Orange', hex: '#FF8C00' },
        ],
    },
    {
        id: 5,
        name: 'Women',
        brand: 'Feminine Collection',
        description: 'Stylish and comfortable wear designed for women.',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        colors: [
            { name: 'Blush', hex: '#FFB6C1' },
            { name: 'Mauve', hex: '#E0B0FF' },
            { name: 'Teal', hex: '#008080' },
            { name: 'Rose Gold', hex: '#B76E79' },
        ],
    },
    {
        id: 6,
        name: 'Men',
        brand: 'Classic Menswear',
        description: 'Timeless pieces for the modern man.',
        sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        colors: [
            { name: 'Black', hex: '#000000' },
            { name: 'Navy', hex: '#001F3F' },
            { name: 'Grey', hex: '#A9A9A9' },
            { name: 'Brown', hex: '#8B4513' },
        ],
    },
];


const Slide = ({ data, dataIndex }) => {
    const item = data[dataIndex];

    return (
        <div className="portrait-card group">
            <div
                className="portrait-card__image"
                style={{ backgroundImage: `url(${item.image})` }}
            >
                <div className="portrait-card__scrim" />
            </div>
            <div className="portrait-card__content">
                <p className="text-[11px] uppercase tracking-[0.5em] text-white/50">
                    {item.brand}
                </p>
                <h3 className="text-2xl font-semibold text-white">{item.name}</h3>
                <p className="text-sm text-white/70">{item.mood}</p>
            </div>
        </div>
    );
};

export default function Dashboard() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const carouselRef = useRef();

    const stackedCards = useMemo(() => {
        const cards = [];
        for (let i = 0; i < stackDepth; i += 1) {
            cards.push(featuredCapsule[(activeIndex + i) % featuredCapsule.length]);
        }
        return cards;
    }, [activeIndex]);

    const handleViewDetails = (category) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedCategory(null), 300);
    };

    const handleEditCategory = (category) => {
        // Placeholder: Replace with actual edit route when available
        // e.g., router.get(route('categories.edit', category.id));
        console.log('Edit category:', category);
        alert(`Edit feature for "${category.name}" - to be implemented`);
    };

    const handleDeleteCategory = (category) => {
        // Placeholder: Replace with actual delete route when available
        // e.g., router.delete(route('categories.destroy', category.id));
        console.log('Delete category:', category);
        alert(`Delete feature for "${category.name}" - to be implemented`);
    };

    const handleNext = () => {
        if (carouselRef.current) {
            carouselRef.current.goNext();
        }
    };

    const handlePrev = () => {
        if (carouselRef.current) {
            carouselRef.current.goBack();
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            handleNext();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    YOUNG KIDD
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl space-y-8 px-4 sm:px-6">
                    <div className="flex flex-col gap-2 text-center">
                        <p className="text-xs uppercase tracking-[0.4em] text-gray-400">
                            Featured Capsule
                        </p>
                        <h1 className="text-3xl font-semibold text-gray-900 sm:text-4xl">
                            Curated collections for the week ahead
                        </h1>
                    </div>

                    <div className="relative mx-auto max-w-4xl">
                        <ResponsiveContainer
                            className="portrait-carousel"
                            carouselRef={carouselRef}
                            render={(width, ref) => (
                                <StackedCarousel
                                    ref={ref}
                                    data={stackedCards}
                                    maxVisibleSlide={stackDepth}
                                    slideComponent={Slide}
                                    slideWidth={260}
                                    carouselWidth={width}
                                    customScales={[1, 0.92, 0.85, 0.78]}
                                    currentVisibleSlide={stackDepth}
                                    useGrabCursor
                                    transitionTime={500}
                                    onActiveSlideChange={(newIndex) => {
                                        setActiveIndex(
                                            (activeIndex + newIndex) % featuredCapsule.length
                                        );
                                    }}
                                />
                            )}
                        />

                        <Fab
                            color="default"
                            size="small"
                            className="carousel-control left"
                            onClick={handlePrev}
                        >
                            <ArrowBackIcon fontSize="small" />
                        </Fab>
                        <Fab
                            color="default"
                            size="small"
                            className="carousel-control right"
                            onClick={handleNext}
                        >
                            <ArrowForwardIcon fontSize="small" />
                        </Fab>

                        <div className="mt-6 flex justify-center gap-1.5">
                            {featuredCapsule.map((_, idx) => {
                                const isActive = idx === activeIndex % featuredCapsule.length;
                                return (
                                    <span
                                        key={`dot-${idx}`}
                                        className={`h-1 w-6 rounded-full transition-all ${
                                            isActive ? 'bg-gray-900' : 'bg-gray-200'
                                        }`}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    {/* Featured Categories Section */}
                    <div className="mt-16 space-y-6">
                        <div className="flex flex-col gap-2">
                            <p className="text-xs uppercase tracking-[0.4em] text-gray-400">
                                Featured Categories
                            </p>
                            <h2 className="text-2xl font-semibold text-gray-900">
                                Shop by Category
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {featuredCategories.map((category) => (
                                <FeaturedCategoriesCard
                                    key={category.id}
                                    category={category}
                                    onViewDetails={() => handleViewDetails(category)}
                                    onEdit={handleEditCategory}
                                    onDelete={handleDeleteCategory}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <FeaturedCategoriesModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                category={selectedCategory}
            />

            <style>{`
                .portrait-carousel {
                    padding: 1rem 0;
                }
                .portrait-card {
                    position: relative;
                    width: 220px;
                    height: 340px;
                    border-radius: 28px;
                    overflow: hidden;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 0 20px 35px rgba(15, 23, 42, 0.18);
                    background: #0f172a;
                }
                .portrait-card__image {
                    position: absolute;
                    inset: 0;
                    background-size: cover;
                    background-position: center;
                    transition: transform 500ms ease;
                }
                .portrait-card__scrim {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(180deg, rgba(15, 23, 42, 0) 42%, rgba(15, 23, 42, 0.85) 100%);
                }
                .portrait-card__content {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    padding: 1.75rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .portrait-card:hover .portrait-card__image {
                    transform: scale(1.04);
                }
                .carousel-control {
                    position: absolute !important;
                    top: 50%;
                    transform: translateY(-50%);
                    background-color: rgba(15, 23, 42, 0.85) !important;
                    color: #fff !important;
                }
                .carousel-control.left {
                    left: -1.5rem;
                }
                .carousel-control.right {
                    right: -1.5rem;
                }
                @media (max-width: 640px) {
                    .portrait-card {
                        width: 180px;
                        height: 300px;
                    }
                    .carousel-control.left {
                        left: -0.5rem;
                    }
                    .carousel-control.right {
                        right: -0.5rem;
                    }
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
