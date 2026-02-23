'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChefHat } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('http://localhost:4000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                throw new Error('Invalid credentials');
            }

            const data = await res.json();
            login(data.access_token, data.user);
        } catch (err) {
            setError('Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
            {/* Left Side: Branding */}
            <div className="hidden lg:flex flex-col justify-center items-center bg-linear-to-br from-orange-600 to-red-600 p-12 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl -ml-48 -mb-48" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10 text-center"
                >
                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                        <ChefHat className="w-10 h-10 text-orange-600" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4 tracking-tight">Slooze Food</h1>
                    <p className="text-lg text-orange-100 font-medium max-w-sm mx-auto leading-relaxed">
                        Tasty food delivered to your doorstep. Experience the best in class food delivery service.
                    </p>
                </motion.div>

                <div className="absolute bottom-10 text-orange-200/50 text-xs font-medium">
                    &copy; 2026 Slooze Food Delivery
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="flex flex-col justify-center items-center p-8 md:p-12 bg-stone-50/50">
                <div className="w-full max-w-sm">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100"
                    >
                        <div className="text-center mb-8">
                            <div className="lg:hidden w-10 h-10 bg-linear-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                                <ChefHat className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-stone-900">Welcome Back</h2>
                            <p className="text-stone-500 mt-1 text-sm">Sign in to your account</p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center mb-5 border border-red-100"
                            >
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-stone-50 focus:bg-white text-stone-900 text-sm"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1.5">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-stone-50 focus:bg-white text-stone-900 text-sm"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm rounded-xl focus:outline-none transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-stone-100">
                            <p className="text-[10px] text-stone-400 text-center uppercase tracking-widest font-semibold mb-3">Demo Credentials</p>
                            <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-100 space-y-1.5 text-xs text-stone-600">
                                <div className="flex justify-between">
                                    <span className="font-semibold text-orange-600">Admin</span>
                                    <span className="text-stone-500 font-mono">nick@slooze.xyz</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold text-orange-600">Manager</span>
                                    <span className="text-stone-500 font-mono">marvel@slooze.xyz</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold text-orange-600">Member</span>
                                    <span className="text-stone-500 font-mono">thor@slooze.xyz</span>
                                </div>
                                <div className="pt-1.5 mt-1.5 border-t border-stone-100 flex justify-between">
                                    <span className="font-semibold text-stone-500">Password</span>
                                    <span className="text-stone-500 font-mono">password123</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
