"use client"; // Ensure this component runs on the client side

import React from 'react';
import Image from 'next/image';
import { useWishlist } from '@/apis/WishlistContext';

export default function Wishlist() {
    const { wishlist, removeFromWishlist } = useWishlist();

    return (
        <div className="w-[100%] lg:grid grid-cols-1 items-start gap-6 pt-4 pb-16">
            <div className="col-span-9 mt-6 lg:mt-0">
                {wishlist.length === 0 ? (
                    <p className="text-center text-gray-600">Your wishlist is empty.</p>
                ) : (
                    <div className="space-y-4 w-[100%]">
                        {wishlist.map((item: any) => (
                            <div key={item.id} className="w-full flex items-center justify-between gap-4 p-4 border border-gray-200 rounded hover:shadow-md transition">
                                <div className="w-28 flex-shrink-0">
                                    <Image src={item.image} alt={item.name} className="w-full" width={50} height={50} />
                                </div>
                                <div className="md:w-1/3 w-full">
                                    <h2 className="text-gray-800 mb-1 xl:text-xl font-medium uppercase">{item.name}</h2>
                                    <p className="text-gray-500 text-sm">Availability: <span className={`font-semibold ${item.status === 'In Stock' ? 'text-green-600' : 'text-red-600'}`}>{item.status}</span></p>
                                </div>
                                <div className="w-full md:w-auto">
                                    <p className="text-primary text-lg font-semibold">M{item.price}</p>
                                </div>
                                <a 
                                    href="#"
                                    className={`ml-auto md:ml-0 block px-6 py-2 text-center text-sm text-white ${item.status === 'Out of Stock' ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-transparent hover:text-primary'} border border-primary rounded transition uppercase font-medium`}
                                    onClick={item.status === 'Out of Stock' ? (e) => e.preventDefault() : undefined}
                                >
                                    Add to cart
                                </a>
                                <button 
                                    className="text-gray-600 hover:text-red-600 cursor-pointer" 
                                    onClick={() => removeFromWishlist(item.id)}
                                >
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
