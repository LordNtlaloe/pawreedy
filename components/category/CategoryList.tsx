"use client";

import { getAllCategories } from "@/app/_actions/_categoryActions";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

const CategoryList = () => {
  const [categoriesList, setCategoriesList] = useState([]);
  useEffect(() => {
    getCategoriesList();
  }, []);

  const getCategoriesList = async () => {
    const categories = await getAllCategories();
    setCategoriesList(categories);
  };
  return (
    <section className="bg-white w-full mb-1 flex flex-col items-center">
      <div className="mx-6 grid grid-cols-3 md:grid-cols-6 lg:grid-cols-6 gap-4 md:gap-10 my-4">
        {
          categoriesList?.map((category: any) => (
            <Link
              href={"/category/" + category.name}
              className={`flex flex-col items-center gap-2 bg-secondary/30 justify-center p-2 rounded cursor-pointer hover:scale-105 transition-all ease-in-out hover:shadow-lg hover:shadow-secondary`}
              key={category._id}
            >
              <Image
                src={category.icon}
                width={50}
                height={50}
                alt="Category"
              />
              <h1 className=" flex flex-1">{category.name}</h1>
            </Link>
          ))}
      </div>
      <div className="flex items-center justify-center py-4">
        <Link href='/category/all' className="bg-violet-700 text-white px-6 py-2 rounded-full hover:bg-violet-600 transition-all hover:scale-105 ">
          More...
        </Link>
      </div>
    </section>
  );
};

export default CategoryList;