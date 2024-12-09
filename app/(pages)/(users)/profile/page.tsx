"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Image } from "antd";
import Wishlist from "@/components/products/wishlist/Wishlist";
import Orders from "../orders/page";
import { getOrdersByUserEmail } from "@/app/_actions/_orderActions";

export default function Profile() {
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState("Public Profile");
    const [orders, setOrders] = useState([]); // Change to Order[] | undefined
    const router = useRouter();

    const getOrders = async () => {
        try {
            const email = user?.emailAddresses[0]?.emailAddress; // Extract user email
            if (email) {
                const allOrders = await getOrdersByUserEmail(email); // Fetch orders
                console.log("Fetched orders:", allOrders); // Debug fetched orders
                setOrders(allOrders);
            }
        } catch (error) {
            console.error("Error getting orders from db", error);
            setOrders([]); // Handle errors gracefully
        }
    };
     

    const handleTabClick = (tabName: string) => {
        setActiveTab(tabName);
    };

    // Redirect to home if no user is logged in
    useEffect(() => {
        if (!user) {
            router.push("/"); // Redirect if user is not logged in
        } else {
            getOrders(); // Call getOrders when the component mounts
        }
    }, [user, router]);

    return user ? (
        <div className="bg-white w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#161931]">
            <aside className="hidden py-4 md:w-1/4 lg:w-1/4 md:block">
                <div className="sticky flex flex-col gap-2 p-4 text-sm border-r border-indigo-100 top-12">
                    <h2 className="pl-3 mb-4 text-2xl font-semibold">Settings</h2>
                    <button
                        onClick={() => handleTabClick("Public Profile")}
                        className={`flex items-center px-3 py-2.5 font-bold ${activeTab === "Public Profile" ? "bg-white text-indigo-900 border rounded-full" : ""}`}
                    >
                        Profile
                    </button>
                    <button
                        onClick={() => handleTabClick("Account Settings")}
                        className={`flex items-center px-3 py-2.5 font-semibold hover:text-indigo-900 hover:border hover:rounded-full ${activeTab === "Account Settings" ? "bg-white text-indigo-900 border rounded-full" : ""}`}
                    >
                        My Orders
                    </button>
                    <button
                        onClick={() => handleTabClick("Notifications")}
                        className={`flex items-center px-3 py-2.5 font-semibold hover:text-indigo-900 hover:border hover:rounded-full ${activeTab === "Notifications" ? "bg-white text-indigo-900 border rounded-full" : ""}`}
                    >
                        My Wishlist
                    </button>
                    <button
                        onClick={() => handleTabClick("PRO Account")}
                        className={`flex items-center px-3 py-2.5 font-semibold hover:text-indigo-900 hover:border hover:rounded-full ${activeTab === "PRO Account" ? "bg-white text-indigo-900 border rounded-full" : ""}`}
                    >
                        PRO Account
                    </button>
                </div>
            </aside>

            <main className="w-[100%] min-h-screen py-1 md:w-3/4">
                <div className="p-2 md:p-4">
                    <div className="w-[1200px] px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
                        {activeTab === "Public Profile" && (
                            <div>
                                <h2 className="pl-6 text-2xl font-bold sm:text-xl">Profile</h2>
                                <div className="grid max-w-2xl mx-auto mt-8">
                                    <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
                                        <Image
                                            className="object-cover w-20 h-20 p-1 rounded-full ring-2 ring-indigo-300 dark:ring-indigo-500"
                                            src={user.imageUrl} width={80} height={80}
                                            alt="Bordered avatar"
                                        />
                                        <div className="flex flex-col space-y-5 sm:ml-8">
                                            <button
                                                type="button"
                                                className="py-3.5 px-7 text-base font-medium text-indigo-100 focus:outline-none bg-[#202142] rounded-lg border border-indigo-200 hover:bg-indigo-900 focus:z-10 focus:ring-4 focus:ring-indigo-200"
                                            >
                                                Change picture
                                            </button>
                                        </div>
                                    </div>
                                    <div className="items-center mt-8 sm:mt-14 text-[#202142]">
                                        <div className="mb-2 sm:mb-6">
                                            <label
                                                htmlFor="email"
                                                className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white"
                                            >
                                                Your email
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                                                placeholder="your.email@mail.com"
                                                defaultValue={user.emailAddresses[0]?.emailAddress || ""}
                                                readOnly
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === "Account Settings" && (
                            <>
                                <h2 className="pl-6 text-2xl font-bold sm:text-xl">Orders</h2>
                                <Orders orders={orders} />
                            </>
                        )}
                        {activeTab === "Notifications" && (
                            <div className="w-[100%]">
                                <h2 className="pl-6 text-2xl font-bold sm:text-xl">Wishlist Items</h2>
                                <div className="w-[100%] mt-8">
                                    <Wishlist />
                                </div>
                            </div>
                        )}
                        {activeTab === "PRO Account" && (
                            <>
                                <h2 className="pl-6 text-2xl font-bold sm:text-xl">PRO Account</h2>
                                <div className="grid max-w-2xl mx-auto mt-8">
                                    {/* PRO Account content goes here */}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    ) : null;
}
