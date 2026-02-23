'use client';

import { useState } from 'react';
import { useCart as useCartContext } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Trash2, ArrowRight, ShoppingBag, Loader2, UtensilsCrossed, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function CartPage() {
    const { items, removeFromCart, clearCart, total } = useCartContext();
    const { token, user } = useAuth();
    const router = useRouter();

    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const handleCheckout = async () => {
        if (!token) return;

        if (user?.role === 'MEMBER') {
            toast.error("Members are not allowed to place orders (Checkout & Pay).");
            return;
        }

        if (items.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        setIsCheckingOut(true);

        await new Promise(resolve => setTimeout(resolve, 2000));

        const orderItems = items.map((i) => ({
            menuItemId: i.menuItemId,
            quantity: i.quantity,
        }));

        try {
            const res = await fetch('http://localhost:4000/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ items: orderItems }),
            });

            if (res.ok) {
                toast.success('Order placed successfully!');

                if (Notification.permission === 'granted') {
                    new Notification('Order Placed!', {
                        body: `Your order of $${items.reduce((acc, i) => acc + i.price * i.quantity, 0).toFixed(2)} has been confirmed.`,
                    });
                } else if (Notification.permission !== 'denied') {
                    Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                            new Notification('Order Placed!', {
                                body: 'Your order has been confirmed.',
                            });
                        }
                    });
                }

                clearCart();
                router.push('/dashboard/orders');
            } else {
                toast.error('Failed to place order');
                setIsCheckingOut(false);
            }
        } catch (err) {
            console.error(err);
            toast.error('Error placing order');
            setIsCheckingOut(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="max-w-lg mx-auto text-center py-20">
                <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <ShoppingBag className="w-8 h-8 text-stone-400" />
                </div>
                <h2 className="text-xl font-bold text-stone-900 mb-2">Your Cart is Empty</h2>
                <p className="text-stone-500 text-sm mb-8 max-w-xs mx-auto">
                    Explore our restaurants and add some delicious items to get started.
                </p>
                <button
                    onClick={() => router.push('/dashboard/restaurants')}
                    className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold text-sm transition-colors inline-flex items-center active:scale-95"
                >
                    Browse Restaurants
                    <ArrowRight className="w-4 h-4 ml-2" />
                </button>
            </div>
        );
    }

    const isMember = user?.role === 'MEMBER';
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-stone-900">Your Cart</h2>
                <p className="text-stone-500 text-sm mt-1">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
            </div>

            {/* Cart Items */}
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden mb-6">
                {items.map((item, idx) => (
                    <motion.div
                        key={item.menuItemId}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`p-4 md:p-5 flex items-center gap-4 ${idx < items.length - 1 ? 'border-b border-stone-50' : ''}`}
                    >
                        <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                            <UtensilsCrossed className="w-5 h-5 text-orange-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-stone-900 text-sm truncate">{item.name}</h3>
                            <p className="text-xs text-stone-400 mt-0.5">
                                ${item.price.toFixed(2)} x {item.quantity}
                            </p>
                        </div>
                        <span className="font-semibold text-stone-800 text-sm tabular-nums">
                            ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                            onClick={() => removeFromCart(item.menuItemId)}
                            className="p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label={`Remove ${item.name}`}
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 mb-6">
                <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">Order Summary</h3>
                <div className="flex justify-between items-center text-sm text-stone-600 mb-2">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-stone-600 mb-3">
                    <span>Delivery</span>
                    <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="border-t border-stone-100 pt-3 flex justify-between items-center">
                    <span className="font-semibold text-stone-900">Total</span>
                    <span className="font-bold text-xl text-stone-900">${total.toFixed(2)}</span>
                </div>
            </div>

            {/* Action */}
            <div className="flex justify-end">
                {isMember ? (
                    <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-3">
                        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-amber-800">Checkout restricted</p>
                            <p className="text-xs text-amber-600">Members cannot place orders. Contact an Admin or Manager.</p>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={handleCheckout}
                        disabled={isCheckingOut}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3.5 rounded-xl font-semibold text-sm flex items-center transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
                    >
                        {isCheckingOut ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Placing Order...
                            </>
                        ) : (
                            <>
                                Place Order
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
