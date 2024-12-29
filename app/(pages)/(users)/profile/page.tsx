"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Image } from "antd";
import Wishlist from "@/components/products/wishlist/Wishlist";
import Orders from "../_orders/page";
import { getOrdersByUserEmail } from "@/app/_actions/_orderActions";

export default function Profile() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("Profile");
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  const getOrders = async () => {
    try {
      const email = user?.emailAddresses[0]?.emailAddress;
      if (email) {
        const allOrders = await getOrdersByUserEmail(email);
        console.log("Fetched orders:", allOrders);
        setOrders(allOrders);
      }
    } catch (error) {
      console.error("Error getting orders from db", error);
      setOrders([]);
    }
  };

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  useEffect(() => {
    if (!user) {
      router.push("/");
    } else {
      getOrders();
    }
  }, [user, router]);

  return user ? (
    <div className="mx-10 my-10 px-10 max-w-screen sm:mx-8 xl:mx-auto">
      <h1 className="border-b py-6 text-4xl font-semibold">Profile</h1>
      <div className="grid grid-cols-8 pt-3 pb-10 sm:grid-cols-10">
        {/* Sidebar Tabs */}
        <div className="col-span-2 hidden sm:block">
          <ul>
            {["Profile", "Wishlist", "Orders"].map((tab) => (
              <li
                key={tab}
                className={`mt-5 cursor-pointer border-l-2 px-2 py-2 font-semibold transition ${
                  activeTab === tab
                    ? "border-l-violet-700 text-violet-700"
                    : "border-transparent hover:border-l-violet-700 hover:text-violet-700"
                }`}
              >
                <button onClick={() => handleTabClick(tab)}>{tab}</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Sidebar Tabs */}
        <div className="relative my-4 w-56 sm:hidden">
          <ul>
            {["Profile", "Wishlist", "Orders"].map((tab) => (
              <li
                key={tab}
                className={`mt-5 cursor-pointer border-l-2 px-2 py-2 font-semibold transition ${
                  activeTab === tab
                    ? "border-l-violet-800 text-violet-900"
                    : "border-transparent hover:border-l-violet-800 hover:text-violet-900"
                }`}
              >
                <button onClick={() => handleTabClick(tab)}>{tab}</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Active Tab Content */}
        <div className="col-span-8 overflow-hidden rounded-xl sm:px-8 sm:shadow">
          {activeTab === "Profile" && (
            <div>
              <div className="px-4 sm:px-0 mt-4">
                <h3 className="text-base/7 font-semibold text-gray-900">User Information</h3>
                <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">Personal details.</p>
              </div>
              <div className="mt-6 border-t border-gray-100">
                <dl className="divide-y divide-gray-100">
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <div className="flex flex-col items-between space-y-5 sm:flex-row sm:space-y-0">
                      <Image
                        className="object-cover w-24 h-24 p-1 rounded-full ring-2 ring-indigo-300"
                        src={user.imageUrl}
                        width={80}
                        height={80}
                        alt="Bordered avatar"
                      />
                    </div>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm/6 font-medium text-gray-900">Full name</dt>
                    <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{user.fullName}</dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm/6 font-medium text-gray-900">Email address</dt>
                    <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {user.emailAddresses[0]?.emailAddress || "Email not available"}
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <button
                      type="button"
                      className="py-3 px-4 text-base font-medium text-indigo-100 bg-violet-900 rounded-md border border-indigo-200 hover:bg-violet-950 focus:ring-4 focus:ring-violet-200"
                    >
                      Update Profile
                    </button>
                  </div>
                </dl>
              </div>
            </div>
          )}
          {activeTab === "Wishlist" && <Wishlist />}
          {activeTab === "Orders" && <Orders orders={orders} />}
        </div>
      </div>
    </div>
  ) : null;
}
