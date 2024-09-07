"use client";

import { getAllProductsByCategory } from "@/app/_actions/_productsActions";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "../general/LoadingSpinner";
import Link from "next/link";

const SimilarProducts = (category: any) => {
  const [products, setProducts] = useState<any>([]);
  
  useEffect(() => {
    getSimilarProducts();
  }, [category]);

  const getSimilarProducts = async () => {
    const products = await getAllProductsByCategory(
      category.categoryName
    );
    setProducts(products);
  };

  return (
    <div className="grid grid-cols-2 gap-2 md:flex md:flex-col ">
      {products.length > 0 ? (
        products?.map((product: any) => {
            let imageURL = "/placeholder-image.jpg";
            if (product?.image !== "undefined") {
              imageURL = product.image;
            }
          <Link href={"/product/" + product._id} key={product._id}>
            <div className=" p-2 hover:border hover:shadow-md hover:shadow-sky-400 cursor-pointer hover:scale-105 transition-all">
              <div className="md:flex  gap-2">
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
                    {product.productAddress}
                  </h2>
                  <h2 className="text-xs text-gray-400 font-bold">
                    {product.contactPerson}
                  </h2>
                </div>
              </div>
            </div>
          </Link>
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