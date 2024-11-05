"use client";
import { useState } from "react";
import { useCart } from "@/apis/CartContext";
import { useWishlist } from "@/apis/WishlistContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { ShoppingCart, Star, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type ProductProps = {
  productList: any[];
  title: string;
};

const MySwal = withReactContent(Swal);

export default function ProductList({ productList = [], title }: ProductProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlist();
  const [wishlistIds, setWishlistIds] = useState<string[]>(wishlist.map(item => item.id));

  const handleAddToCart = (product: any) => {
    try {
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
      });

      MySwal.fire({
        title: "Success!",
        text: `${product.name} has been added to the cart`,
        icon: "success",
        confirmButtonText: "OK",
        timer: 2000,
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to add the product to the cart",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  const handleToggleWishlist = (product: any) => {
    const isWished = wishlistIds.includes(product._id);

    if (isWished) {
      removeFromWishlist(product._id);
      setWishlistIds((prev) => prev.filter(id => id !== product._id));
      MySwal.fire({
        title: "Removed!",
        text: `${product.name} has been removed from the wishlist`,
        icon: "info",
        confirmButtonText: "OK",
        timer: 2000,
      });
    } else {
      addToWishlist({
        id: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
      });
      setWishlistIds((prev) => [...prev, product._id]);
      MySwal.fire({
        title: "Success!",
        text: `${product.name} has been added to the wishlist`,
        icon: "success",
        confirmButtonText: "OK",
        timer: 2000,
      });
    }
  };

  const uniqueProducts = productList.filter(
    (product: any, index: number, self: any[]) =>
      index === self.findIndex((p: any) => p._id === product._id)
  );

  return (
    <main className="py-8 bg-white rounded-lg">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="font-manrope font-bold text-2xl sm:text-4xl text-violet-900">
            {title}
          </h2>
        </div>
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          slidesPerView={4}
          spaceBetween={20}
          slidesPerGroup={1}
          loop={true}
          autoplay={true}
          navigation={{ nextEl: ".swiper-button-prev", prevEl: ".swiper-button-next" }}
          breakpoints={{
            640: { slidesPerView: 2, slidesPerGroup: 2 },
            768: { slidesPerView: 3, slidesPerGroup: 3 },
            1024: { slidesPerView: 4, slidesPerGroup: 4 },
          }}
          className="mySwiper p-5"
        >
          {uniqueProducts.map((product: any) => {
            const imageURL = product?.image !== "undefined" ? product.image : "./placeholder-image.jpg";
            const isWished = wishlistIds.includes(product._id);

            const isNew = new Date().getTime() - new Date(product.createdAt as string).getTime() < 30 * 24 * 60 * 60 * 1000;

            return (
              <SwiperSlide key={product._id} className="rounded-xl bg-white p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  {isNew && (
                    <span className="absolute z-10 top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                      New
                    </span>
                  )}
                  <Link href={`/products/${product._id}`}>
                    <div className="relative flex items-end overflow-hidden rounded-xl border-violet-200 border">
                      <Image
                        src={imageURL}
                        alt={product.name}
                        className="w-full h-64 object-cover rounded-xl"
                        width={250}
                        height={250}
                      />
                      <div className="absolute bottom-3 left-3 inline-flex items-center rounded-lg bg-white p-2 shadow-md">
                        <Star className="h-5 w-5 text-yellow-400" />
                        <span className="text-slate-400 ml-1 text-sm">{product.ratings}</span>
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={() => handleToggleWishlist(product)}
                    className="absolute top-3 right-3 rounded-full bg-white p-2 shadow-md hover:bg-red-200 transition duration-300"
                  >
                    <Heart className={`${isWished ? 'text-red-600' : 'text-red-500'} h-6 w-6`} fill={isWished ? "red" : "none"} />
                  </button>
                </div>

                <div className="mt-3 px-2">
                  <h2 className="text-slate-700 font-medium">{product.name}</h2>
                  <p className="text-slate-400 mt-1 text-sm">{product.category}</p>
                  <div className="mt-3 flex items-end justify-between">
                    <p>
                      <span className="text-lg font-bold text-violet-500">
                        M{product.price}
                      </span>
                    </p>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="group inline-flex rounded-xl bg-blue-100 p-2 hover:bg-blue-200 transition-colors duration-300"
                    >
                      <ShoppingCart className="group-hover:text-violet-700 h-4 w-4 text-violet-800" />
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </main>
  );
}
