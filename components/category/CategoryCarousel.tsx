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

export default function CategoryCarousel() {
    const [categoriesList, setCategoriesList] = useState([]);

    useEffect(() => {
        getCategoriesList();
    }, []);

    const getCategoriesList = async () => {
        const categories = await getAllCategories();
        setCategoriesList(categories);
    };

    return (
        <div className="w-full relative px-4 md:px-6 lg:px-8">
            <h1 className='my-6 py-8 text-2xl md:text-3xl lg:text-4xl text-center font-semibold'>Shop By Category</h1>
            <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                slidesPerView={2} // Default to 2 items on small screens
                spaceBetween={5} // Spacing between slides
                slidesPerGroup={2} // Slide 2 items at a time on small screens
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
                        slidesPerView: 3, // 3 items on small screens
                        slidesPerGroup: 3,
                    },
                    768: {
                        slidesPerView: 4, // 4 items on medium screens
                        slidesPerGroup: 4,
                    },
                    1024: {
                        slidesPerView: 5, // 5 items on large screens
                        slidesPerGroup: 5,
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
        </div>
    );
}
