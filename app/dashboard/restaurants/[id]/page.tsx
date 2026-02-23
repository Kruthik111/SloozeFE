'use client';

import { useEffect, useState, use } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { ArrowLeft, Plus, Minus, ShoppingBag, ArrowRight, UtensilsCrossed, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface MenuItem {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
    restaurantId: number;
}

interface Restaurant {
    id: number;
    name: string;
    country: string;
    menuItems: MenuItem[];
}

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.06 },
    },
};

const card: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export default function MenuPage({ params }: { params: Promise<{ id: string }> }) {
    const { token } = useAuth();
    const { addToCart, decreaseQuantity, items } = useCart();
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const router = useRouter();

    const resolvedParams = use(params);
    const id = resolvedParams.id;

    useEffect(() => {
        if (token && id) {
            fetch(`http://localhost:4000/restaurants/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => {
                    if (!res.ok) throw new Error('Failed to fetch');
                    return res.json();
                })
                .then((data) => setRestaurant(data))
                .catch((err) => console.error(err));
        }
    }, [token, id]);

    const handleAddToCart = (item: MenuItem) => {
        addToCart({
            menuItemId: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
            restaurantId: item.restaurantId,
        });
        toast.success(`Added ${item.name} to cart`);
    };

    const isItemInCart = (itemId: number) => {
        return items.some(i => i.menuItemId === itemId);
    };

    const handleDecreaseQuantity = (item: MenuItem) => {
        const cartItem = items.find(i => i.menuItemId === item.id);
        if (cartItem) {
            decreaseQuantity(item.id);
            if (cartItem.quantity === 1) {
                toast.error(`Removed ${item.name} from cart`);
            }
        }
    };

    if (!restaurant) return (
        <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-[3px] border-orange-100 border-t-orange-600 rounded-full animate-spin" />
                <span className="text-sm text-stone-400 font-medium">Loading menu...</span>
            </div>
        </div>
    );

    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <div className="pb-28">
            <button
                onClick={() => router.back()}
                className="inline-flex items-center text-sm text-stone-400 hover:text-orange-600 mb-6 transition-colors font-medium group"
            >
                <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-0.5 transition-transform" />
                Back to Restaurants
            </button>

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-stone-900 mb-2">{restaurant.name}</h1>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">
                        {restaurant.country}
                    </span>
                    <span className="text-sm text-stone-400">{restaurant.menuItems.length} items</span>
                </div>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
                {restaurant.menuItems.map((item) => {
                    const added = isItemInCart(item.id);
                    const qty = items.find(i => i.menuItemId === item.id)?.quantity || 0;

                    return (
                        <motion.div
                            key={item.id}
                            variants={card}
                            className={`bg-white rounded-2xl overflow-hidden border flex flex-col transition-all duration-300 ${
                                added
                                    ? 'border-orange-200 shadow-md ring-1 ring-orange-100'
                                    : 'border-stone-100 shadow-sm hover:shadow-md hover:border-stone-200'
                            }`}
                        >
                            <div className="h-44 overflow-hidden bg-stone-100 relative group">
                                {item.imageUrl ? (
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-stone-50 to-stone-100">
                                        <UtensilsCrossed className="w-10 h-10 text-stone-300 mb-2" />
                                        <span className="text-xs text-stone-400 font-medium">No photo</span>
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-stone-800 shadow-sm border border-stone-100">
                                    ${item.price.toFixed(2)}
                                </div>
                            </div>

                            <div className="p-4 flex-1 flex flex-col">
                                <h3 className="text-base font-semibold text-stone-900 mb-1">{item.name}</h3>
                                <p className="text-xs text-stone-400 mb-4 line-clamp-2">Freshly prepared {item.name.toLowerCase()}</p>

                                <div className="mt-auto flex gap-2">
                                    {added ? (
                                        <div className="flex-1 flex items-center justify-between bg-orange-50 rounded-xl px-1 py-1 border border-orange-200">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDecreaseQuantity(item); }}
                                                className="w-9 h-9 flex items-center justify-center text-orange-700 hover:bg-orange-100 rounded-lg transition-colors"
                                                aria-label="Decrease quantity"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="font-bold text-orange-700 text-sm tabular-nums">{qty}</span>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleAddToCart(item); }}
                                                className="w-9 h-9 flex items-center justify-center text-orange-700 hover:bg-orange-100 rounded-lg transition-colors"
                                                aria-label="Increase quantity"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleAddToCart(item)}
                                            className="flex-1 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center justify-center bg-orange-600 hover:bg-orange-700 text-white active:scale-[0.97]"
                                        >
                                            <Plus className="w-4 h-4 mr-1.5" />
                                            Add to cart
                                        </button>
                                    )}

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const url = window.location.href;
                                            navigator.clipboard.writeText(`${url}#item-${item.id}`).then(() => toast.success('Link copied!'));
                                        }}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl border border-stone-100 hover:bg-orange-50 text-stone-400 hover:text-orange-600 transition-colors"
                                        aria-label="Share item"
                                    >
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Sticky Checkout Bar */}
            <AnimatePresence>
                {items.length > 0 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 z-40"
                    >
                        <div className="bg-stone-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-stone-700">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center">
                                    <ShoppingBag className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-stone-400 font-medium">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
                                    <span className="font-bold text-lg leading-tight">${items.reduce((sum, i) => sum + (i.price * i.quantity), 0).toFixed(2)}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => router.push('/dashboard/cart')}
                                className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center transition-colors active:scale-95"
                            >
                                Checkout
                                <ArrowRight className="w-4 h-4 ml-1.5" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
