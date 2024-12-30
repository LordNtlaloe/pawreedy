"use client";

import { getAllProductsByCategory } from "@/app/_actions/_productsActions";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "../general/LoadingSpinner";
import Link from "next/link";

const SimilarProducts = ({
  category,
  currentProductId,
}: {
  category: string;
  currentProductId: string;
}) => {
  const [products, setProducts] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (category) {
        const products = await getAllProductsByCategory(category);
        setProducts(products);
      }
      setIsLoading(false);
    };

    fetchProducts();
  }, [category]);

  const truncateDescription = (description: string, maxLength: number) => {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + "...";
    }
    return description;
  };

  const similarProducts = products.filter(
    (product: any) => product._id !== currentProductId
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {isLoading ? (
        <div className="col-span-full flex justify-center items-center">
          <LoadingSpinner />
        </div>
      ) : similarProducts.length > 0 ? (
        similarProducts.map((product: any) => {
          let imageURL = "/placeholder-image.jpg";
          if (product?.image !== "undefined") {
            imageURL = product.image;
          }
          return (
            <Link
              href={"/products/" + product._id}
              key={product._id}
              className="p-2 border rounded-md bg-gray-50"
            >
              <div className="p-2 cursor-pointer hover:scale-105 transition-all">
                <div className="flex flex-col gap-6">
                  <Image
                    src={imageURL}
                    height={120}
                    width={120}
                    alt="Image"
                    className="rounded-[5px] object-cover"
                  />
                  <div className="w-full">
                    <h2 className="font-bold flex-grow-0">{product.name}</h2>
                    <h2 className="text-sm text-gray-400">
                      {truncateDescription(product.category, 100)}
                    </h2>
                    <h2 className="text-lg text-gray-400 font-bold">
                      M{product.price}.00
                    </h2>
                  </div>
                </div>
              </div>
            </Link>
          );
        })
      ) : (
        <div className="col-span-full text-center text-gray-500">
          No similar products found.
        </div>
      )}
    </div>
  );
};

export default SimilarProducts;
