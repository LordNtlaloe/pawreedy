import React from 'react';

export default function ThreeItemGrid() {
    return (
        <div className="flex flex-wrap gap-4 p-4 w-full">
            {/* Item 1 */}
            <div className="flex-1">
                <img
                    src="/images/h5-banner1.jpg"
                    alt="Image 1"
                    className="object-contain rounded-lg shadow-md w-full"
                />
                <div className="relative bottom-36 px-4">
                    <h4 className="text-violet-800 font-bold text-3xl font-sans">Large Space Cat Cage</h4>
                    <h6 className="font-medium text-slate-500">Discount</h6>
                    <h1 className="text-3xl font-semibold text-amber-700">20% Off</h1>
                </div>
            </div>

            {/* Item 2 */}
            <div className="flex-1">
                <img
                    src="/images/h5-banner2.jpg"
                    alt="Image 2"
                    className="object-contain rounded-lg shadow-md w-full"
                />
                <div className="relative bottom-36 px-4 text-white">
                    <h4 className="text-white font-bold text-4xl font-sans">Adult Food For Cats</h4>
                    <h6 className="font-medium">Discount</h6>
                    <h1 className="text-3xl font-semibold">20% Off</h1>
                </div>
            </div>
        </div>

    );
}
