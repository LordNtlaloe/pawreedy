"use client";

import Hero from "@/components/root/Hero";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllProducts, getProductByName, getLatestProducts } from "@/app/_actions/_productsActions";
import ProductList from "@/components/products/ProductList";
// import CategoryCarousel from "@/components/category/CategoryCarousel";
import LatestProducts from "@/components/products/LatestProducts";
import CTA from "@/components/general/CTA";
import CookieConsentBanner from "@/components/general/Cookies";
import CategoryCarousel from "@/components/category/CategoryCarousel";
import ThreeItemGrid from "@/components/decorative/ThreeItemGrid";
import BannerGrid from "@/components/decorative/BannerGrid";
import Banner from "@/components/decorative/Banner";

export default function Home({ userInput }: any) {
  const [popularProducts, setPopularProducts] = useState([]);
  const [searchText, setSearchText] = useState<string>("");
  const [title, setTitle] = useState("Popular Products");
  const [latestProducts, setLatestProducts] = useState([]);

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

  useEffect(() => {

    const latestProduct = async () => {
      const product = await getLatestProducts();
      setLatestProducts(product)
    }
    latestProduct();
  }, [])
  return (
    <main className="bg-white">
      <Hero />
      <div className="my-8 bg-[url('/images/h5-bg01.png')]">
        <CategoryCarousel />
      </div>
      <div className="px-6 text-violet-700 my-2">
        <ProductList productList={popularProducts} title={title} />
      </div>
      <div className="my-8">
        <BannerGrid />
      </div>
      <div className="px-6 text-violet-700 my-2">
        <LatestProducts latestProductsList={latestProducts} title="Latest Products" />
      </div>
      <div className="flex items-center justify-center py-4">
        <Link
          href="/products"
          className="bg-violet-700 text-white px-6 py-2 rounded-full hover:bg-[#633faf] transition-all hover:scale-105"
        >
          More
        </Link>
      </div>
      <div className="my-4">
        <Banner />
      </div>
      <div className="">
        <CTA />
      </div>
      <CookieConsentBanner />
    </main>
  );
}
