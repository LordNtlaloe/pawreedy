"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const CategoriesMenu = ({ categories }: { categories: any }) => {
  const [selectedItem, setSelectedItem] = useState("");
  const params = useParams();

  // Ensure categories are unique
  const uniqueCategories = categories.filter(
    (category: any, index: number, self: any[]) =>
      index === self.findIndex((c) => c.name === category.name)
  );

  useEffect(() => {
    if (params && params.name) {
      setSelectedItem(params.name as string);
    }
  }, [params]);

  return (
    <div>
      <div>
        <Link
          href={"/products/category/all"}
          className="font-bold text-center flex justify-start"
        >
          <h1
            className={`category_sidebar_menu w-full flex items-center justify-center ${
              selectedItem === "all" ? "text-violet-800" : "text-slate-900"
            }`}
            onClick={() => setSelectedItem("all")}
          >
            All
          </h1>
        </Link>
        {uniqueCategories?.map((category: any) => (
          <Link
            href={"/products/category/" + category.name}
            key={category._id}
            className={`category_sidebar_menu ${
              selectedItem === category.name
                ? " md:bg-blue-100 bg-violet-700 shadow-md"
                : "flex flex-row text-slate-700"
            }`}
            onClick={() => setSelectedItem(category.name)}
          >
            <p className="px-2 py-1">{category.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesMenu;
