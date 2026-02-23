'use client';

import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Menu, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import UserAvatar from './UserAvatar';
import { usePathname } from 'next/navigation';

interface HeaderProps {
    toggleSidebar: () => void;
}

const getPageTitle = (pathname: string) => {
    if (pathname.includes('/restaurants/')) return 'Menu';
    if (pathname.includes('/restaurants')) return 'Restaurants';
    if (pathname.includes('/cart')) return 'My Cart';
    if (pathname.includes('/orders')) return 'Orders';
    return 'Dashboard';
};

export default function Header({ toggleSidebar }: HeaderProps) {
    const { user } = useAuth();
    const { items } = useCart();
    const pathname = usePathname();
    const title = getPageTitle(pathname);
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <header className="bg-white/90 backdrop-blur-md h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-10 border-b border-stone-200/60">
            <div className="flex items-center gap-3">
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg hover:bg-stone-100 lg:hidden transition-colors"
                    aria-label="Toggle sidebar"
                >
                    <Menu className="w-5 h-5 text-stone-600" />
                </button>
                <div className="lg:hidden w-7 h-7 bg-linear-to-br from-orange-500 to-red-600 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold text-sm">S</span>
                </div>
                <h1 className="text-lg font-semibold text-stone-800">
                    {title}
                </h1>
            </div>

            <div className="flex items-center gap-3">
                {user && (
                    <div className="hidden md:flex items-center gap-2 mr-1">
                        <span className="text-sm font-medium text-stone-700">{user.name}</span>
                        <span className="text-[10px] font-semibold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 uppercase tracking-wide">
                            {user.role}
                        </span>
                        <span className="text-[10px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full uppercase tracking-wide">
                            {user.country}
                        </span>
                    </div>
                )}

                <Link
                    href="/dashboard/cart"
                    className="relative p-2 hover:bg-orange-50 rounded-lg transition-colors group"
                    aria-label="Cart"
                >
                    <ShoppingBag className="w-5 h-5 text-stone-500 group-hover:text-orange-600 transition-colors" />
                    {totalItems > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-orange-600 rounded-full shadow-sm">
                            {totalItems}
                        </span>
                    )}
                </Link>

                <UserAvatar name={user?.name || 'User'} />
            </div>
        </header>
    );
}
