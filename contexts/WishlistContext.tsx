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
  // wishlistCounts: Record<string, number>;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  updateWishlistQuantity: (id: string, quantity: number) => void;
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
  const [wishlistCounts, setWishlistCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    try {
      const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      const savedCounts = JSON.parse(localStorage.getItem("wishlistCounts") || "{}");
      setWishlist(savedWishlist);
      setWishlistCounts(savedCounts);
    } catch (error) {
      console.error("Error loading wishlist from localStorage", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    if (Object.keys(wishlistCounts).length > 0) {
      localStorage.setItem("wishlistCounts", JSON.stringify(wishlistCounts));
    } else {
      localStorage.removeItem("wishlistCounts");
    }
  }, [wishlist, wishlistCounts]);

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

    setWishlistCounts((prevCounts) => ({
      ...prevCounts,
      [item.id]: (prevCounts[item.id] || 0) + 1,
    }));
  };

  const removeFromWishlist = (id: string) => {
    setWishlist((prevWishlist) => prevWishlist.filter((item) => item.id !== id));
    setWishlistCounts((prevCounts) => {
      const newCounts = { ...prevCounts };
      delete newCounts[id];
      return newCounts;
    });
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
    setWishlistCounts({});
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, updateWishlistQuantity, clearWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
