"use client";

import {
  getAllProducts,
  getAllProductsByCategory,
} from "@/app/_actions/_productsActions";
import ProductList from "@/components/products/ProductList";
import { Menu } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CategoriesSidebar from "@/components/category/CategoriesSideBar";

const CategoriesPage = () => {
  const params = useParams();
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    const getProductList = async () => {
      let productsByCategory;

      if (params?.name === "all") {
        productsByCategory = await getAllProducts();
      } else {
        productsByCategory = await getAllProductsByCategory(params?.name as string);
      }
      setProductList(productsByCategory);
    };

    if (params?.name) {
      getProductList();
    }
  }, [params?.name]);

  return (
    <div className="mr-2 mt-2 md:mt-6">
      <div className="font-bold text-[22px] bg-blue-600 text-primary px-2 uppercase text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2>CATEGORY: </h2>
          <h2 className="bg-purple-200 text-black my-1 px-4 rounded">
            {params?.name}
          </h2>
        </div>
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Menu className="font-bold text-lg" size={30} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white text-violet-700 mr-6">
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <CategoriesSidebar />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <ProductList productList={productList} title={params?.name as string} />
    </div>
  );
};

export default CategoriesPage;
