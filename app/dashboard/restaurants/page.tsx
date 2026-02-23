'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { MapPin, ArrowRight, UtensilsCrossed, Store } from 'lucide-react';

interface Restaurant {
    id: number;
    name: string;
    country: string;
}

const backgrounds = [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800',
];

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.08 },
    },
};

const card: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function RestaurantsPage() {
    const { token, user } = useAuth();
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetch('http://localhost:4000/restaurants', {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => {
                    if (!res.ok) throw new Error('Failed to fetch restaurants');
                    return res.json();
                })
                .then((data) => {
                    setRestaurants(Array.isArray(data) ? data : []);
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setRestaurants([]);
                    setIsLoading(false);
                });
        }
    }, [token]);

    if (isLoading) {
        return (
            <div>
                <div className="mb-8">
                    <div className="h-8 w-56 bg-stone-200 rounded-lg animate-pulse mb-2" />
                    <div className="h-5 w-72 bg-stone-100 rounded-lg animate-pulse" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse border border-stone-100">
                            <div className="h-48 bg-stone-100" />
                            <div className="p-5 space-y-3">
                                <div className="h-4 w-24 bg-stone-100 rounded" />
                                <div className="h-4 w-16 bg-stone-50 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-stone-900">
                    {user ? `Hey ${user.name.split(' ')[0]}, explore restaurants` : 'Explore Restaurants'}
                </h2>
                <p className="text-stone-500 mt-1 text-sm">Discover the best food in your region.</p>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {restaurants.map((rest, index) => (
                    <motion.div key={rest.id} variants={card}>
                        <Link href={`/dashboard/restaurants/${rest.id}`}>
                            <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-stone-100 hover:border-orange-200 group">
                                <div className="h-44 overflow-hidden relative">
                                    <img
                                        src={backgrounds[index % backgrounds.length]}
                                        alt={rest.name}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                                    <div className="absolute bottom-0 left-0 p-5">
                                        <h3 className="text-xl font-bold text-white leading-tight">{rest.name}</h3>
                                    </div>
                                </div>
                                <div className="px-5 py-4 flex items-center justify-between">
                                    <div className="flex items-center text-stone-500">
                                        <MapPin className="w-3.5 h-3.5 mr-1.5 text-stone-400" />
                                        <span className="text-sm font-medium">{rest.country}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-medium text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                        View Menu
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>

            {restaurants.length === 0 && (
                <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-stone-200">
                    <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Store className="w-8 h-8 text-stone-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-stone-800 mb-1">No restaurants found</h3>
                    <p className="text-stone-500 text-sm">There are no restaurants available in your region yet.</p>
                </div>
            )}
        </div>
    );
}
