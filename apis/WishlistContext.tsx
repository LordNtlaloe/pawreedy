"use client";
import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";

type WishlistItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type WishlistContextType = {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  updateWishlistQuantity: (id: string, quantity: number) => void; // Add this
  clearWishlist: () => void;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  // Load wishlist from localStorage when the component is mounted
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (wishlist.length > 0) {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    } else {
      localStorage.removeItem("wishlist");
    }
  }, [wishlist]);

  const addToWishlist = (item: WishlistItem) => {
    setWishlist((prevWishlist) => {
      const existingItemIndex = prevWishlist.findIndex((wishlistItem) => wishlistItem.id === item.id);
      if (existingItemIndex > -1) {
        const newWishlist = [...prevWishlist];
        newWishlist[existingItemIndex].quantity += item.quantity;
        return newWishlist;
      }
      return [...prevWishlist, item];
    });
  };

  const removeFromWishlist = (id: string) => {
    setWishlist((prevWishlist) => prevWishlist.filter((item) => item.id !== id));
  };

  const updateWishlistQuantity = (id: string, quantity: number) => {
    setWishlist((prevWishlist) => {
      const newWishlist = [...prevWishlist];
      const itemIndex = newWishlist.findIndex((item) => item.id === id);
      if (itemIndex > -1) {
        newWishlist[itemIndex].quantity = quantity;
      }
      return newWishlist;
    });
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, updateWishlistQuantity, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
