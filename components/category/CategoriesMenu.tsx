"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const CategoriesMenu = ({ categories }: { categories: any }) => {
  const [selectedItem, setSelectedItem] = useState("");
  const params = useParams();

  useEffect(() => {
    if (params && params.name) { // Check if params and params.name exist
      setSelectedItem(params.name as string);
    }
  }, [params]);

  return (
    <div>
      <div>
        <Link
          href={"/category/all"}
          className="font-bold text-center flex justify-start"
        >
          <h1
            className={`category_sidebar_menu w-full flex items-center justify-center ${
              selectedItem === "all"
                ? "text-violet-800"
                : "text-slate-900"
            }`}
            onClick={() => setSelectedItem("all")}
          >
            All
          </h1>
        </Link>
        {categories?.map((category: any) => (
          <Link
            href={"/category/" + category.name}
            key={category._id}
            className={`category_sidebar_menu ${
              selectedItem === category.name
                ? " md:bg-blue-100 bg-violet-700 shadow-md"
                : "flex flex-row text-slate-700"
            }`}
            onClick={() => setSelectedItem(category.name)}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesMenu;
