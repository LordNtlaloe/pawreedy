"use client";

import Hero from "@/components/root/Hero";


import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllProducts, getProductByName } from "@/app/_actions/_productsActions";
import ProductList from "@/components/products/ProductList";


export default function Home({ userInput }: any) {
  const [popularProducts, setPopularProducts] = useState([])
  const [searchText, setSearchText] = useState<string>("")
  
  const [title, setTitle] = useState("Popular Productes")

  const getProducts = async (_searchText: string) => {
    let results
    if (!searchText) {
      results = await getAllProducts()
      setTitle("Pupular Productes")
    } else {
      results = await getProductByName(_searchText)
      setTitle("Search Results")
    }
    setPopularProducts(results)

    return results
  }

  useEffect(() => {
    getProducts(searchText)
  }, [searchText])

  return (
    <main className="">
      <Hero  />
      <div className="px-6 md:mt-6 mt-3">
        <ProductList productList={popularProducts} title={title} />
      </div>
      <div className="flex items-center justify-center py-4">
        <Link
          href="/category/all"
          className="bg-blue-900 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-all hover:scale-105 "
        >
          More productes...
        </Link>
      </div>
    </main>
  );
}