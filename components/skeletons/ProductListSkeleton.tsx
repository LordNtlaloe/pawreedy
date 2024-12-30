import React from 'react'

export default function ProductListSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-lg animate-pulse">
                    <div className="w-32 h-32 bg-gray-300 rounded-xl mb-4"></div>
                    <div className="w-20 h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="w-16 h-4 bg-gray-300 rounded"></div>
                </div>
            ))}
        </div>)
}
