import Link from 'next/link'
import React from 'react'
import Image from 'next/image'

export default function Banner() {
    return (

        <div className=" bg-gradient-to-r from-violet-900 to-violet-600 font-sans overflow-hidden">
            <div className="bg-[url('/images/h5-bg01.png')] grid md:grid-cols-3 gap-6 min-h-[164px] h-60 py-8 p-16">
                <div className="md:col-span-2">
                    <h1 className="text-3xl font-bold text-white">Welcome to ReadymadeUI!</h1>
                    <p className="text-base text-gray-200 mt-4">Best tailwind css readymade UI plateform</p>

                    <Link href="/products" className="">
                        <div className="bg-[url('/images/h5-lable1.png')] bg-no-repeat h-52 my-6">
                            <p
                                className="my-4 py-3 px-10 text-xl font-semibold text-white top-20">Get
                                Started</p>
                        </div>
                    </Link>
                </div>

                <div className="relative max-md:hidden left-20">
                    <Image src="/images/h5-banner9.png" alt="Banner Image"
                        className="md:absolute object-fit w-64" />
                </div>
            </div>
        </div>

    )
}
