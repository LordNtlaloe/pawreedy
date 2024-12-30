import React from 'react';
import Image from 'next/image';

export default function BannerGrid() {
    return (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 mx-10">
            {/* Image 1 */}
            <div className="relative w-full h-52">
                <Image 
                    src="/images/1.png" 
                    alt="Image 1" 
                    layout="fill" 
                    objectFit="contain" 
                    className="rounded-md shadow-lg" 
                />
            </div>

            {/* Image 2 */}
            <div className="relative w-full h-52">
                <Image 
                    src="/images/2.png" 
                    alt="Image 2" 
                    layout="fill" 
                    objectFit="contain" 
                    className="rounded-md shadow-lg" 
                />
            </div>

            {/* Image 3 */}
            <div className="relative w-full h-52">
                <Image 
                    src="/images/3.png" 
                    alt="Image 3" 
                    layout="fill" 
                    objectFit="contain" 
                    className="rounded-md shadow-lg" 
                />
            </div>
        </div>
    );
}
