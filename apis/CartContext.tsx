// CartContext.tsx
"use client"
import React, { createContext, useState, useContext, ReactNode } from 'react';

type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
};

type CartContextType = {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart = (item: CartItem) => {
        setCart(prevCart => {
            const existingItemIndex = prevCart.findIndex(cartItem => cartItem.id === item.id);
            if (existingItemIndex > -1) {
                const newCart = [...prevCart];
                newCart[existingItemIndex].quantity += item.quantity;
                return newCart;
            }
            return [...prevCart, item];
        });
    };

    const removeFromCart = (id: string) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
