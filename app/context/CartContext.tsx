'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
    menuItemId: number;
    name: string;
    price: number;
    quantity: number;
    restaurantId: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (menuItemId: number) => void;
    decreaseQuantity: (menuItemId: number) => void;
    clearCart: () => void;
    total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    const addToCart = (newItem: CartItem) => {
        setItems((prev) => {
            // Check if item exists
            const existing = prev.find((i) => i.menuItemId === newItem.menuItemId);
            if (existing) {
                return prev.map((i) =>
                    i.menuItemId === newItem.menuItemId
                        ? { ...i, quantity: i.quantity + newItem.quantity }
                        : i
                );
            }
            return [...prev, newItem];
        });
    };

    const removeFromCart = (menuItemId: number) => {
        setItems((prev) => prev.filter((i) => i.menuItemId !== menuItemId));
    };

    const decreaseQuantity = (menuItemId: number) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.menuItemId === menuItemId);
            if (existing && existing.quantity > 1) {
                return prev.map((i) =>
                    i.menuItemId === menuItemId
                        ? { ...i, quantity: i.quantity - 1 }
                        : i
                );
            }
            return prev.filter((i) => i.menuItemId !== menuItemId);
        });
    };

    const clearCart = () => setItems([]);

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, decreaseQuantity, clearCart, total }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
