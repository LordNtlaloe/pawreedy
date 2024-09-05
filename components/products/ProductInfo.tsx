"use client"
import { getProductById } from "@/app/_actions/_productsActions";
import { MapPin, Star, ShoppingCart } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useCart } from "@/apis/CartContext";
import Swal from "sweetalert2";

const ProductInfo = ({ id }: { id: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [product, setProduct] = useState<any>({});
  const { addToCart } = useCart();

  useEffect(() => {
    setIsLoaded(true);
    id && getProduct();
  }, [id]);

  const getProduct = async () => {
    const productById = await getProductById(id);
    setProduct(productById);
  };

  if (!isLoaded) return null;

  const handleAddToCart = () => {
    try {
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
      });

      // Show success alert
      Swal.fire({
        title: "Success!",
        text: `${product.name} has been added to the cart`,
        icon: "success",
        confirmButtonText: "OK",
        timer: 2000,
      });
    } catch (error) {
      // Show error alert
      Swal.fire({
        title: "Error!",
        text: "Failed to add the product to the cart",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  return (
    <main className="py-6 px-4 sm:p-6 md:py-10 md:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:max-w-5xl lg:gap-x-20 lg:grid-cols-2">
        {/* Image Section */}
        <div className="grid gap-4 col-start-1 col-end-3 row-start-1 sm:mb-6 sm:grid-cols-4 lg:gap-6 lg:col-start-2 lg:row-end-6 lg:row-span-6 lg:mb-0">
          <Image
            src={product?.image || "/placeholder-image.jpg"}
            alt={product?.name || "Product Image"}
            width={150}
            height={200}
            className="w-full h-60 object-cover rounded-lg sm:h-52 sm:col-span-2 lg:col-span-full"
            loading="lazy"
          />
        </div>

        {/* Title and Category */}
        <div className="relative p-3 col-start-1 row-start-1 flex flex-col-reverse rounded-lg bg-gradient-to-t from-black/75 via-black/0 sm:bg-none sm:row-start-2 sm:p-0 lg:row-start-1">
          <h1 className="mt-1 text-lg font-semibold text-white sm:text-gray-900 md:text-2xl dark:sm:text-white">
            {product?.name}
          </h1>
          <p className="text-sm leading-4 font-medium text-white sm:text-gray-500 dark:sm:text-gray-400">
            {product?.category}
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-4 col-start-1 row-start-3 self-center sm:mt-0 sm:col-start-2 sm:row-start-2 sm:row-span-2 lg:mt-6 lg:col-start-1 lg:row-start-3 lg:row-end-4">
          <button
            onClick={handleAddToCart}
            className="bg-indigo-600 text-white text-sm leading-6 font-medium py-2 px-3 rounded-lg flex items-center justify-center w-full"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Add to Cart
          </button>
        </div>

        {/* Description */}
        <p className="mt-4 text-sm leading-6 col-start-1 sm:col-span-2 lg:mt-6 lg:row-start-4 lg:col-span-1 dark:text-gray-400">
          {product?.description}
        </p>
      </div>
    </main>
  );
};

export default ProductInfo;
