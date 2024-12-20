import React from 'react'
import Image from 'next/image'

export default function BannerGrid() {
    return (
        <div className="grid grid-rows-4 grid-flow-col gap-4 mx-10">
            <div className="row-span-4 gap-y-4">
                <div className="col-span-2">
                    <Image src='/images/bn1.jpg' className='object-fit' alt='image'/>
                </div>
                <div className="col-span-2 mt-7">
                    <Image src='/images/bn2.jpg' className='object-fit' alt='image'/>
                </div>
            </div>
            <div className="row-span-4 col-span-2">
                <Image src='/images/bn3.jpg' className='object-fit' alt='image'/>
            </div>
            <div className="row-span-4 gap-y-4">
                <div className="col-span-2">
                    <Image src='/images/bn4.jpg' className='object-fit' alt='image'/>
                </div>
                <div className="col-span-2 mt-7">
                    <Image src='/images/bn5.jpg' className='object-fit' alt='image'/>
                </div>
            </div>

        </div>
    )
}
