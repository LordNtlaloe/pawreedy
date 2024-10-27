"use client";

import Hero from "@/components/root/Hero";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllProducts, getProductByName } from "@/app/_actions/_productsActions";
import ProductList from "@/components/products/ProductList";
import CategoryCarousel from "@/components/category/CategoryCarousel";

export default function Home({ userInput }: any) {
  const [popularProducts, setPopularProducts] = useState([]);
  const [searchText, setSearchText] = useState<string>("");
  const [title, setTitle] = useState("Popular Products");

  useEffect(() => {
    const getProducts = async (_searchText: string) => {
      let results;
      if (!searchText) {
        results = await getAllProducts();
        setTitle("Our Best Products");
      } else {
        results = await getProductByName(_searchText);
        setTitle("Search Results");
      }
      setPopularProducts(results);
    };

    getProducts(searchText);
  }, [searchText]);

  return (
    <main className="bg-violet-50">
      <Hero />
      <div className="my-8">
        <CategoryCarousel />
      </div>
      <div className="px-6 text-violet-700">
        <ProductList productList={popularProducts} title={title} />
      </div>
      <div className="flex items-center justify-center py-4">
        <Link
          href="/category/all"
          className="bg-[#51358C] text-white px-6 py-2 rounded-full hover:bg-[#633faf] transition-all hover:scale-105"
        >
          More products...
        </Link>
      </div>
    </main>
  );
}
