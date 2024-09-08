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

  useEffect(() => {
    const fetchProducts = async () => {
      if (category) {
        const products = await getAllProductsByCategory(category);
        setProducts(products);
      }
    };

    fetchProducts();
  }, [category]);

  const truncateDescription = (description: string, maxLength: number) => {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + "...";
    }
    return description;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.length > 0 ? (
        products
          .filter((product: any) => product._id !== currentProductId) // Filter out the current product
          .map((product: any) => {
            let imageURL = "/placeholder-image.jpg";
            if (product?.image !== "undefined") {
              imageURL = product.image;
            }
            return (
              <Link
                href={"/products/" + product._id}
                key={product._id}
                className="p-2 border-1 rounded-md shadow-sm shadow-violet-800"
              >
                <div className="p-2 cursor-pointer hover:scale-105 transition-all">
                  <div className="flex flex-col gap-2">
                    <Image
                      src={imageURL}
                      height={80}
                      width={80}
                      alt="Image"
                      className="rounded-[5px] object-cover"
                    />
                    <div>
                      <h2 className="font-bold">{product.name}</h2>
                      <h2 className="text-sm text-gray-400">
                        {truncateDescription(product.description, 100)}
                      </h2>
                      <h2 className="text-xs text-gray-400 font-bold">
                        {product.contactPerson}
                      </h2>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
      ) : (
        <div>
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default SimilarProducts;
