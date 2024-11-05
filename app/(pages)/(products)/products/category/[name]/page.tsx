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
    const fetchProducts = async () => {
      let productsByCategory;
      const category = Array.isArray(params?.name) ? params?.name[0] : params?.name;

      if (category === "all") {
        productsByCategory = await getAllProducts();
      } else if (category) {
        productsByCategory = await getAllProductsByCategory(category);
      }

      setProductList(productsByCategory);
    };

    if (params?.name) {
      fetchProducts();
    }
  }, [params?.name]);

  // Decode the category name for better presentation
  const categoryName = params?.name
    ? decodeURIComponent(Array.isArray(params?.name) ? params?.name[0] : params?.name)
    : "";

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="md:hidden mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Menu className="text-violet-700" size={30} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white text-violet-700 shadow-lg rounded-lg">
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <CategoriesSidebar />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">{categoryName}</h1>
      <ProductList productList={productList} title={`${categoryName} Products`} />
    </div>
  );
};

export default CategoriesPage;
