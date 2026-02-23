'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, List, LogOut, X, ChefHat } from 'lucide-react';
import Header from '../components/Header';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (!user) {
        return (
            <div className="flex h-screen items-center justify-center bg-stone-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-[3px] border-orange-100 border-t-orange-600 rounded-full animate-spin" />
                    <span className="text-sm text-stone-400 font-medium">Loading...</span>
                </div>
            </div>
        );
    }

    const navItems = [
        { name: 'Restaurants', href: '/dashboard/restaurants', icon: Home, roles: ['ADMIN', 'MANAGER', 'MEMBER'] },
        { name: 'Manage Orders', href: '/dashboard/orders', icon: List, roles: ['ADMIN', 'MANAGER'] },
        { name: 'My Orders', href: '/dashboard/orders', icon: List, roles: ['MEMBER'] },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white">
            <div className="p-5 flex items-center justify-between lg:hidden shrink-0 border-b border-stone-100">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-linear-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-md shadow-orange-200/50">
                        <ChefHat className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-bold text-stone-800">Slooze Food</span>
                </div>
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
                >
                    <X className="w-5 h-5 text-stone-400" />
                </button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => {
                    if (!item.roles.includes(user.role)) return null;
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group relative ${isActive
                                ? 'bg-orange-50 text-orange-700'
                                : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="sidebar-indicator"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-orange-500 rounded-r-full"
                                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                />
                            )}
                            <item.icon className={`w-[18px] h-[18px] mr-3 transition-colors ${isActive ? 'text-orange-600' : 'text-stone-400 group-hover:text-stone-500'}`} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-3 border-t border-stone-100 mt-auto shrink-0">
                <button
                    onClick={logout}
                    className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                    <LogOut className="w-[18px] h-[18px] mr-3" />
                    Logout
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen font-sans">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-30 lg:hidden"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-stone-200/80 z-10 h-screen sticky top-0">
                <div className="h-16 flex items-center px-5 border-b border-stone-100 shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-linear-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-md shadow-orange-200/50">
                            <ChefHat className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-lg font-bold bg-linear-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                            Slooze Food
                        </span>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden">
                    <SidebarContent />
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden bg-stone-50">
                <Header toggleSidebar={() => setSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
