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
          className="font-bold text-center flex justify-center"
        >
          <h1
            className={`category_sidebar_menu w-full flex items-center justify-center ${
              selectedItem === "all"
                ? " md:bg-blue-100 bg-blue-900 shadow-md shadow-sky-300"
                : ""
            }`}
            onClick={() => setSelectedItem("all")}
          >
            ALL
          </h1>
        </Link>
        {categories?.map((category: any) => (
          <Link
            href={"/category/" + category.name}
            key={category.id}
            className={`category_sidebar_menu ${
              selectedItem === category.name
                ? " md:bg-blue-100 bg-blue-900 shadow-md shadow-sky-400"
                : ""
            }`}
            onClick={() => setSelectedItem(category.name)}
          >
            <Image src={category.icon} alt="icon" width={30} height={30} />
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesMenu;
