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

      const category = Array.isArray(params?.name) ? params?.name[0] : params?.name;

      if (category === "all") {
        productsByCategory = await getAllProducts();
      } else if (category) {
        productsByCategory = await getAllProductsByCategory(category as string);
      }
      setProductList(productsByCategory);
    };

    if (params?.name) {
      getProductList();
    }
  }, [params?.name]);

  // Decode the category name to fix the appearance
  const categoryName = params?.name
    ? decodeURIComponent(Array.isArray(params?.name) ? params?.name[0] : params?.name)
    : "";

  return (
    <div className="mr-2 mt-2 md:mt-6">
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
      <ProductList productList={productList} title={categoryName} />
    </div>
  );
};

export default CategoriesPage;
