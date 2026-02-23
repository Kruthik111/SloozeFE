'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Check, Clock, XCircle, CreditCard, ClipboardList, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface OrderItem {
    id: number;
    quantity: number;
    menuItem: {
        name: string;
        price: number;
    };
}

interface Order {
    id: number;
    totalAmount: number;
    status: string;
    createdAt: string;
    items: OrderItem[];
    user: {
        name: string;
        email: string;
    }
}

type StatusFilter = 'ALL' | 'PENDING' | 'PAID' | 'CANCELLED';

const statusConfig: Record<string, { icon: typeof Check; label: string; bg: string; text: string; border: string; dot: string }> = {
    PAID: { icon: Check, label: 'Paid', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
    PENDING: { icon: Clock, label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
    CANCELLED: { icon: XCircle, label: 'Cancelled', bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', dot: 'bg-red-500' },
};

export default function OrdersPage() {
    const { token, user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refresh, setRefresh] = useState(0);
    const [loadingAction, setLoadingAction] = useState<number | null>(null);
    const [filter, setFilter] = useState<StatusFilter>('ALL');

    useEffect(() => {
        if (token) {
            setIsLoading(true);
            fetch('http://localhost:4000/orders', {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => {
                    if (!res.ok) throw new Error('Failed to fetch orders');
                    return res.json();
                })
                .then((data) => {
                    setOrders(Array.isArray(data) ? data : []);
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setOrders([]);
                    setIsLoading(false);
                });
        }
    }, [token, refresh]);

    const handlePay = async (orderId: number) => {
        setLoadingAction(orderId);
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            const res = await fetch(`http://localhost:4000/orders/${orderId}/pay`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                toast.success(`Order #${orderId} Paid Successfully!`);
                setRefresh((p) => p + 1);
            } else {
                toast.error('Payment failed. You might not have permission.');
            }
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong');
        } finally {
            setLoadingAction(null);
        }
    };

    const handleCancel = async (orderId: number) => {
        try {
            const res = await fetch(`http://localhost:4000/orders/${orderId}/cancel`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                toast.info('Order Cancelled');
                setRefresh((p) => p + 1);
            } else {
                toast.error('Cancellation failed');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const canModify = user?.role === 'ADMIN' || user?.role === 'MANAGER';
    const canPay = user?.role === 'ADMIN';
    const isMember = user?.role === 'MEMBER';

    const filteredOrders = filter === 'ALL' ? orders : orders.filter(o => o.status === filter);
    const filters: { key: StatusFilter; label: string }[] = [
        { key: 'ALL', label: 'All' },
        { key: 'PENDING', label: 'Pending' },
        { key: 'PAID', label: 'Paid' },
        { key: 'CANCELLED', label: 'Cancelled' },
    ];

    const getFilterCount = (key: StatusFilter) => {
        if (key === 'ALL') return orders.length;
        return orders.filter(o => o.status === key).length;
    };

    if (isLoading) {
        return (
            <div className="max-w-3xl mx-auto">
                <div className="h-7 w-40 bg-stone-200 rounded-lg animate-pulse mb-6" />
                <div className="space-y-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="bg-white rounded-2xl h-48 animate-pulse border border-stone-100" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-stone-900">
                    {isMember ? 'My Orders' : 'Manage Orders'}
                </h2>
                <span className="text-sm text-stone-500 font-medium">{orders.length} total</span>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex gap-1 bg-stone-100 p-1 rounded-xl mb-6 overflow-x-auto">
                {filters.map(({ key, label }) => {
                    const count = getFilterCount(key);
                    return (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                                filter === key
                                    ? 'bg-white text-stone-900 shadow-sm'
                                    : 'text-stone-500 hover:text-stone-700'
                            }`}
                        >
                            {label}
                            {count > 0 && (
                                <span className={`text-xs tabular-nums ${
                                    filter === key ? 'text-orange-600' : 'text-stone-400'
                                }`}>
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {filteredOrders.map((order, idx) => {
                    const status = statusConfig[order.status] || statusConfig.PENDING;
                    const StatusIcon = status.icon;

                    return (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden hover:border-stone-200 transition-colors"
                        >
                            {/* Order Header */}
                            <div className="p-5 flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                    <div className={`w-9 h-9 ${status.bg} rounded-lg flex items-center justify-center shrink-0 mt-0.5`}>
                                        <StatusIcon className={`w-4 h-4 ${status.text}`} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h3 className="text-sm font-semibold text-stone-900">Order #{order.id}</h3>
                                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${status.bg} ${status.text} ${status.border} uppercase tracking-wide`}>
                                                {status.label}
                                            </span>
                                        </div>
                                        <p className="text-xs text-stone-400">{new Date(order.createdAt).toLocaleString()}</p>
                                        {order.user?.name && !isMember && (
                                            <p className="text-xs text-stone-400 mt-0.5">by {order.user.name}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-lg font-bold text-stone-900 tabular-nums">${order.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="mx-5 mb-4 bg-stone-50 rounded-xl p-3.5 border border-stone-100">
                                <ul className="space-y-2">
                                    {order.items.map((item) => (
                                        <li key={item.id} className="flex justify-between items-center text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${statusConfig[order.status]?.dot || 'bg-stone-300'}`} />
                                                <span className="text-stone-700 font-medium">{item.quantity}x {item.menuItem.name}</span>
                                            </div>
                                            <span className="text-stone-500 font-medium tabular-nums">${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Actions */}
                            {order.status === 'PENDING' && canModify && (
                                <div className="px-5 pb-4 flex justify-end items-center gap-2">
                                    <button
                                        onClick={() => handleCancel(order.id)}
                                        className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                    >
                                        Cancel
                                    </button>
                                    {canPay ? (
                                        <button
                                            onClick={() => handlePay(order.id)}
                                            disabled={loadingAction === order.id}
                                            className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center min-w-[120px] justify-center active:scale-95 disabled:opacity-60"
                                        >
                                            {loadingAction === order.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <CreditCard className="w-3.5 h-3.5 mr-1.5" />
                                                    Confirm Pay
                                                </>
                                            )}
                                        </button>
                                    ) : (
                                        <div className="flex items-center text-xs font-semibold text-amber-700 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
                                            <Clock className="w-3.5 h-3.5 mr-1.5" />
                                            Awaiting Payment
                                        </div>
                                    )}
                                </div>
                            )}

                            {order.status === 'PENDING' && !canModify && (
                                <div className="px-5 pb-4">
                                    <div className="flex items-center text-xs font-medium text-amber-700 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                                        <Clock className="w-3.5 h-3.5 mr-1.5" />
                                        Waiting for payment confirmation
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    );
                })}

                {filteredOrders.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone-200">
                        <div className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <ClipboardList className="w-7 h-7 text-stone-400" />
                        </div>
                        <h3 className="text-base font-semibold text-stone-800 mb-1">
                            {filter === 'ALL' ? 'No orders yet' : `No ${filter.toLowerCase()} orders`}
                        </h3>
                        <p className="text-stone-400 text-sm">
                            {filter === 'ALL'
                                ? 'Orders will appear here once placed.'
                                : 'Try selecting a different filter.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
