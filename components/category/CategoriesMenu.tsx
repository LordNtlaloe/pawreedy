"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";

interface Category {
  _id: string;
  name: string;
}

interface CategoriesMenuProps {
  categories: Category[];
}

const CategoriesMenu: React.FC<CategoriesMenuProps> = ({ categories }) => {
  const [selectedItem, setSelectedItem] = useState<string>("all");
  const params = useParams();

  // Ensure categories are unique
  const uniqueCategories = useMemo(() => {
    return categories.filter(
      (category, index, self) =>
        index === self.findIndex((c) => c.name === category.name)
    );
  }, [categories]);

  useEffect(() => {
    if (params?.name) {
      setSelectedItem(params.name as string);
    } else {
      setSelectedItem("all"); // Reset to "all" if no specific category is selected
    }
  }, [params]);



  return (
    <div className="bg-white shadow rounded-lg p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">Categories</h2>
      <div className="flex flex-col">
        {uniqueCategories.map((category) => (
          <Link
            href={`/products/category/${category.name}`}
            key={category._id}
            className={`rounded-lg p-2 transition-all duration-200`}
            onClick={() => setSelectedItem(category.name)}
            aria-current={selectedItem === category.name ? "page" : undefined}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesMenu;
