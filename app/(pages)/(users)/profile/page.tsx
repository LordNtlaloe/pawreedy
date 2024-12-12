"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Image } from "antd";
import Wishlist from "@/components/products/wishlist/Wishlist";
import Orders from "../orders/page";
import { AiOutlineDown, AiOutlineCheckCircle } from 'react-icons/ai';
import { MdPerson, MdClose } from 'react-icons/md'
import { getOrdersByUserEmail } from "@/app/_actions/_orderActions";

export default function Profile() {
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState("Public Profile");
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
        // <div className="bg-white w-full flex flex-col gap-5 px-4 md:px-12 lg:px-20 md:flex-row text-[#161931]">
        //     <aside className="hidden py-6 md:w-1/4 lg:w-1/4 md:block">
        //         <div className="sticky flex flex-col gap-4 p-6 text-sm border-r border-indigo-100 top-12">
        //             <h2 className="pl-3 mb-5 text-2xl font-semibold text-indigo-900">Settings</h2>
        //             <button
        //                 onClick={() => handleTabClick("Public Profile")}
        //                 className={`flex items-center px-4 py-3 font-semibold ${activeTab === "Public Profile" ? "bg-indigo-100 text-indigo-900 rounded-lg" : "hover:bg-indigo-50 hover:text-indigo-900"} transition`}
        //             >
        //                 Profile
        //             </button>
        //             <button
        //                 onClick={() => handleTabClick("Account Settings")}
        //                 className={`flex items-center px-4 py-3 font-semibold ${activeTab === "Account Settings" ? "bg-indigo-100 text-indigo-900 rounded-lg" : "hover:bg-indigo-50 hover:text-indigo-900"} transition`}
        //             >
        //                 My Orders
        //             </button>
        //             <button
        //                 onClick={() => handleTabClick("Notifications")}
        //                 className={`flex items-center px-4 py-3 font-semibold ${activeTab === "Notifications" ? "bg-indigo-100 text-indigo-900 rounded-lg" : "hover:bg-indigo-50 hover:text-indigo-900"} transition`}
        //             >
        //                 My Wishlist
        //             </button>
        //             <button
        //                 onClick={() => handleTabClick("PRO Account")}
        //                 className={`flex items-center px-4 py-3 font-semibold ${activeTab === "PRO Account" ? "bg-indigo-100 text-indigo-900 rounded-lg" : "hover:bg-indigo-50 hover:text-indigo-900"} transition`}
        //             >
        //                 PRO Account
        //             </button>
        //         </div>
        //     </aside>

        //     <main className="w-full min-h-screen py-6 md:w-3/4 lg:w-4/5 bg-gray-50 rounded-lg shadow-md">
        //         <div className="px-8 py-6">
        //             {activeTab === "Public Profile" && (
        //                 <div>
        //                     <h2 className="text-2xl font-bold text-indigo-900">Profile</h2>
        //                     <div className="grid max-w-2xl mx-auto mt-8">
        //                         <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
        //                             <Image
        //                                 className="object-cover w-24 h-24 p-1 rounded-full ring-2 ring-indigo-300"
        //                                 src={user.imageUrl}
        //                                 width={80}
        //                                 height={80}
        //                                 alt="Bordered avatar"
        //                             />
        //                             <div className="flex flex-col space-y-4 sm:ml-8">
        //                                 <button
        //                                     type="button"
        //                                     className="py-3.5 px-7 text-base font-medium text-indigo-100 bg-indigo-600 rounded-lg border border-indigo-200 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200"
        //                                 >
        //                                     Change picture
        //                                 </button>
        //                             </div>
        //                         </div>
        //                         <div className="mt-6 text-[#202142]">
        //                             <div className="mb-4">
        //                                 <label
        //                                     htmlFor="email"
        //                                     className="block text-sm font-medium text-indigo-900"
        //                                 >
        //                                     Your email
        //                                 </label>
        //                                 <input
        //                                     type="email"
        //                                     id="email"
        //                                     className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
        //                                     placeholder="your.email@mail.com"
        //                                     defaultValue={user.emailAddresses[0]?.emailAddress || ""}
        //                                     readOnly
        //                                     required
        //                                 />
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //             )}
        //             {activeTab === "Account Settings" && (
        //                 <>
        //                     <h2 className="text-2xl font-bold text-indigo-900">Orders</h2>
        //                     <div className="w-full lg:w-[100%] xl:w-[100%] mx-auto">
        //                         <Orders orders={orders} />
        //                     </div>
        //                 </>
        //             )}
        //             {activeTab === "Notifications" && (
        //                 <div className="w-full">
        //                     <h2 className="text-2xl font-bold text-indigo-900">Wishlist Items</h2>
        //                     <div className="w-full mt-8">
        //                         <Wishlist />
        //                     </div>
        //                 </div>
        //             )}
        //             {activeTab === "PRO Account" && (
        //                 <>
        //                     <h2 className="text-2xl font-bold text-indigo-900">PRO Account</h2>
        //                     <div className="grid max-w-2xl mx-auto mt-8">
        //                         {/* PRO Account content goes here */}
        //                     </div>
        //                 </>
        //             )}
        //         </div>
        //     </main>
        // </div>


        <div className="mx-20 my-10 px-20 max-w-screen-xl sm:mx-8 xl:mx-auto">
            <h1 className="border-b py-6 text-4xl font-semibold">Settings</h1>
            <div className="grid grid-cols-8 pt-3 pb-10 sm:grid-cols-10">
                <div className="relative my-4 w-56 sm:hidden">
                    <input className="peer hidden" type="checkbox" name="select-1" id="select-1" />
                    <label htmlFor="select-1" className="flex w-full cursor-pointer select-none rounded-lg border p-2 px-3 text-sm text-gray-700 ring-blue-700 peer-checked:ring">
                        Teams
                    </label>
                    <AiOutlineDown className="pointer-events-none absolute right-0 top-3 ml-auto mr-5 h-4 text-slate-700 transition peer-checked:rotate-180" />
                    <ul className="max-h-0 select-none flex-col overflow-hidden rounded-b-lg shadow-md transition-all duration-300 peer-checked:max-h-56 peer-checked:py-3">
                        <li className="cursor-pointer px-3 py-2 text-sm text-slate-600 hover:bg-blue-700 hover:text-white">Teams</li>
                        <li className="cursor-pointer px-3 py-2 text-sm text-slate-600 hover:bg-blue-700 hover:text-white">Accounts</li>
                        <li className="cursor-pointer px-3 py-2 text-sm text-slate-600 hover:bg-blue-700 hover:text-white">Others</li>
                    </ul>
                </div>

                <div className="col-span-2 hidden sm:block">
                    <ul>
                        <li className="mt-5 cursor-pointer border-l-2 border-l-blue-700 px-2 py-2 font-semibold text-blue-700 transition hover:border-l-blue-700 hover:text-blue-700">
                            <button onClick={() => handleTabClick("Profile")} className="">Accounts</button>
                        </li>
                        <li className="mt-5 cursor-pointer border-l-2 border-transparent px-2 py-2 font-semibold transition hover:border-l-blue-700 hover:text-blue-700">
                            <button onClick={() => handleTabClick("Wishlist")} className="border-transparent hover:text-blue-700">Users</button>
                        </li>
                        <li className="mt-5 cursor-pointer border-l-2 border-transparent px-2 py-2 font-semibold transition hover:border-l-blue-700 hover:text-blue-700">
                            <button onClick={() => handleTabClick("Orders")} className="border-transparent hover:text-blue-700">Profile</button>
                        </li>
                    </ul>
                </div>

                {activeTab === "Profile" && (
                    <div className="col-span-8 overflow-hidden rounded-xl sm:bg-gray-50 sm:px-8 sm:shadow">
                        <div className="pt-4">
                            <h1 className="py-2 text-2xl font-semibold">Team settings</h1>
                            <p className="font- text-slate-600">Lorem ipsum dolor, sit amet consectetur adipisicing elit.</p>
                        </div>
                        <hr className="mt-4 mb-8" />
                        <p className="py-2 text-xl font-semibold">Teams</p>
                        <div className="space-y-2">
                            <div className="cursor-pointer rounded-md border bg-white px-6 py-2 text-2xl hover:bg-blue-50">Marketing</div>
                            <div className="cursor-pointer rounded-md border bg-blue-100 px-6 py-2 text-2xl">UI/UX Design</div>
                            <div className="cursor-pointer rounded-md border bg-white px-6 py-2 text-2xl hover:bg-blue-50">Engineering</div>
                        </div>
                        <hr className="mt-4 mb-8" />
                        <p className="py-2 text-xl font-semibold">Members</p>
                        <div className="space-y-1">
                            <div className="rounded-md border bg-white">
                                <div className="flex w-full items-center px-6 py-2">
                                    <MdPerson className="mr-2 h-5 w-5 text-gray-400" />
                                    <span>Shakir Ali</span>
                                    <MdClose className="ml-auto h-5 w-5 cursor-pointer text-gray-400 active:scale-95" />
                                </div>
                                <div className="flex flex-col space-y-3 px-4 py-6 sm:px-10">
                                    <label className="block" htmlFor="name">
                                        <p className="text-sm">Name</p>
                                        <input className="w-full rounded-md border py-2 px-2 bg-gray-50 outline-none ring-blue-600 focus:ring-1" type="text" value="Shakir Ali" />
                                    </label>
                                    <label className="block" htmlFor="email">
                                        <p className="text-sm">Email</p>
                                        <input className="w-full rounded-md border py-2 px-2 bg-gray-50 outline-none ring-blue-600 focus:ring-1" type="email" value="shakir.ali@company.com" />
                                    </label>
                                    <label className="block" htmlFor="team">
                                        <p className="text-sm">Team</p>
                                        <select className="w-full rounded-md border py-2 px-2 bg-gray-50 outline-none ring-blue-600 focus:ring-1" name="team" value="UI/UX Design">
                                            <option value="UI/UX Design">UI/UX Design</option>
                                            <option value="UI/UX Design">Marketing</option>
                                            <option value="UI/UX Design">Engineering</option>
                                        </select>
                                    </label>
                                    <button className="mt-4 ml-auto rounded-lg bg-blue-600 px-10 py-2 text-white">Save</button>
                                </div>
                            </div>
                            <div className="rounded-md border bg-white">
                                <div className="flex w-full items-center px-6 py-2">
                                    <MdPerson className="mr-2 h-5 w-5 text-gray-400" />
                                    <span>Ebbie James</span>
                                    <MdClose className="ml-auto h-5 w-5 cursor-pointer text-gray-400 active:scale-95" />
                                </div>
                            </div>
                            <div className="rounded-md border bg-white">
                                <div className="flex w-full items-center px-6 py-2">
                                    <MdPerson className="mr-2 h-5 w-5 text-gray-400" />
                                    <span>Mica Calister</span>
                                    <MdClose className="ml-auto h-5 w-5 cursor-pointer text-gray-400 active:scale-95" />
                                </div>
                            </div>
                        </div>

                        <hr className="mt-4 mb-8" />
                    </div>
                )}
                {activeTab === "Orders" && (
                    <div className="col-span-8 overflow-hidden rounded-xl sm:bg-gray-50 sm:px-8 sm:shadow">
                        <div className="pt-4">
                            <h1 className="py-2 text-2xl font-semibold">Team settings</h1>
                            <p className="font- text-slate-600">Lorem ipsum dolor, sit amet consectetur adipisicing elit.</p>
                        </div>
                        <div className="w-full lg:w-[100%] xl:w-[100%] mx-auto">
                            <Orders orders={orders} />
                        </div>
                    </div>
                )}
                {activeTab === "Profile" && (
                    <div className="col-span-8 overflow-hidden rounded-xl sm:bg-gray-50 sm:px-8 sm:shadow">
                        <div className="pt-4">
                            <h1 className="py-2 text-2xl font-semibold">Team settings</h1>
                            <p className="font- text-slate-600">Lorem ipsum dolor, sit amet consectetur adipisicing elit.</p>
                        </div>
                        <hr className="mt-4 mb-8" />
                        <p className="py-2 text-xl font-semibold">Teams</p>
                        <div className="space-y-2">
                            <div className="cursor-pointer rounded-md border bg-white px-6 py-2 text-2xl hover:bg-blue-50">Marketing</div>
                            <div className="cursor-pointer rounded-md border bg-blue-100 px-6 py-2 text-2xl">UI/UX Design</div>
                            <div className="cursor-pointer rounded-md border bg-white px-6 py-2 text-2xl hover:bg-blue-50">Engineering</div>
                        </div>
                        <hr className="mt-4 mb-8" />
                        <p className="py-2 text-xl font-semibold">Members</p>
                        <div className="space-y-1">
                            <div className="rounded-md border bg-white">
                                <div className="flex w-full items-center px-6 py-2">
                                    <MdPerson className="mr-2 h-5 w-5 text-gray-400" />
                                    <span>Shakir Ali</span>
                                    <MdClose className="ml-auto h-5 w-5 cursor-pointer text-gray-400 active:scale-95" />
                                </div>
                                <div className="flex flex-col space-y-3 px-4 py-6 sm:px-10">
                                    <label className="block" htmlFor="name">
                                        <p className="text-sm">Name</p>
                                        <input className="w-full rounded-md border py-2 px-2 bg-gray-50 outline-none ring-blue-600 focus:ring-1" type="text" value="Shakir Ali" />
                                    </label>
                                    <label className="block" htmlFor="email">
                                        <p className="text-sm">Email</p>
                                        <input className="w-full rounded-md border py-2 px-2 bg-gray-50 outline-none ring-blue-600 focus:ring-1" type="email" value="shakir.ali@company.com" />
                                    </label>
                                    <label className="block" htmlFor="team">
                                        <p className="text-sm">Team</p>
                                        <select className="w-full rounded-md border py-2 px-2 bg-gray-50 outline-none ring-blue-600 focus:ring-1" name="team" value="UI/UX Design">
                                            <option value="UI/UX Design">UI/UX Design</option>
                                            <option value="UI/UX Design">Marketing</option>
                                            <option value="UI/UX Design">Engineering</option>
                                        </select>
                                    </label>
                                    <button className="mt-4 ml-auto rounded-lg bg-blue-600 px-10 py-2 text-white">Save</button>
                                </div>
                            </div>
                            <div className="rounded-md border bg-white">
                                <div className="flex w-full items-center px-6 py-2">
                                    <MdPerson className="mr-2 h-5 w-5 text-gray-400" />
                                    <span>Ebbie James</span>
                                    <MdClose className="ml-auto h-5 w-5 cursor-pointer text-gray-400 active:scale-95" />
                                </div>
                            </div>
                            <div className="rounded-md border bg-white">
                                <div className="flex w-full items-center px-6 py-2">
                                    <MdPerson className="mr-2 h-5 w-5 text-gray-400" />
                                    <span>Mica Calister</span>
                                    <MdClose className="ml-auto h-5 w-5 cursor-pointer text-gray-400 active:scale-95" />
                                </div>
                            </div>
                        </div>

                        <hr className="mt-4 mb-8" />
                    </div>
                )}
            </div>
        </div>
    ) : null;
}
