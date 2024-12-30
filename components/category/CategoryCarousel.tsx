import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css'; // Import Swiper styles
import { getAllCategories } from '@/app/_actions/_categoryActions';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';  
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import CategoryCarouselSkeleton from '../skeletons/CategoryCarouselSkeleton';

export default function CategoryCarousel() {
    const [categoriesList, setCategoriesList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getCategoriesList();
    }, []);

    const getCategoriesList = async () => {
        try {
            const categories = await getAllCategories();
            setCategoriesList(categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full relative px-4 md:px-6 lg:px-8">
            <h1 className='my-6 py-8 text-2xl md:text-3xl lg:text-4xl text-center font-semibold'>Shop By Category</h1>
            {isLoading ? (
                <CategoryCarouselSkeleton />
            ) : (
                <Swiper
                    modules={[Autoplay, Pagination, Navigation]}
                    slidesPerView={3} // Default to 2 items on small screens
                    spaceBetween={5} // Spacing between slides
                    slidesPerGroup={4} // Slide 2 items at a time on small screens
                    loop={true} // Loop through the slides
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    navigation={false} // Enable navigation
                    pagination={false} // Enable pagination
                    breakpoints={{
                        // Breakpoints for responsive design
                        640: {
                            slidesPerView: 4, // 3 items on small screens
                            slidesPerGroup: 4,
                        },
                        768: {
                            slidesPerView: 5, // 4 items on medium screens
                            slidesPerGroup: 5,
                        },
                        980: {
                            slidesPerView: 6, // 5 items on large screens
                            slidesPerGroup: 6,
                        },
                        1024: {
                            slidesPerView: 7, // 5 items on large screens
                            slidesPerGroup: 7,
                        },
                    }}
                    className="mySwiper"
                >
                    {categoriesList.map((category: any) => (
                        <SwiperSlide key={category._id} className="flex flex-col items-center">
                            <div className="flex flex-col items-center">
                                <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 mb-2">
                                    <Image
                                        src={category.icon}
                                        layout="fill"
                                        objectFit="cover"
                                        alt={category.name}
                                        className="rounded-xl"
                                    />
                                </div>
                                <Link href={'/category/' + category.name} className="text-xs md:text-sm lg:text-md text-center font-semibold text-violet-700">
                                    {category.name}
                                </Link>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    );
}
