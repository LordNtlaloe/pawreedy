import React from 'react';
import 'swiper/swiper-bundle.css'; // Import Swiper styles
import { Skeleton } from "@/components/ui/skeleton"


export default function CategoryCarouselSkeleton() {

    return (
        <div className="grid grid-cols-3 gap-4 md:grid-cols-5 lg:grid-cols-7">
            {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="flex flex-col items-center">
                    <Skeleton className="relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 bg-gray-200 animate-pulse rounded-xl mb-2"></Skeleton>
                    <Skeleton className="w-16 h-4 bg-gray-200 animate-pulse rounded"></Skeleton>
                </Skeleton>
            ))}
        </div>
    );
}
