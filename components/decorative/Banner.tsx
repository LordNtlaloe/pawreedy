import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

export default function Banner() {
    return (
        <div className="bg-gradient-to-r from-violet-900 to-violet-600 overflow-hidden">
            <div className="bg-[url('/images/h5-bg01.png')] grid md:grid-cols-3 gap-6 min-h-[164px] h-60 py-8 p-16">
                <div className="md:col-span-2">
                    <h1 className="text-3xl font-bold text-white">Welcome to Pawreedy</h1>
                    <p className="text-base text-gray-200 mt-4">
                        Your one-stop shop for all your pet needs. Explore our range of pet supplies and accessories!
                    </p>

                    <Link href="/products" className="">
                        <div className="bg-[url('/images/h5-lable1.png')] bg-no-repeat my-6">
                            <p className="my-4 py-3 px-10 text-xl font-semibold text-white top-20">
                                Shop Now
                            </p>
                        </div>
                    </Link>
                </div>

                <div className="relative max-md:hidden left-20">
                    <Image
                        src="/images/h5-banner9.png"
                        alt="Banner Image"
                        className="md:absolute object-fit w-64"
                        width={1000}
                        height={250}
                    />
                </div>
            </div>
        </div>
    );
}
