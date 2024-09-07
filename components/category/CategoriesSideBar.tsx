"use client";

import { getAllCategories } from "@/app/_actions/_categoryActions";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import CategoriesMenu from "./CategoriesMenu";
import LoadingSpinner from "../general/LoadingSpinner";

const CategoriesSidebar = () => {
  const [listOfCategories, setListOfCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    setIsLoading(true);
    const categories = await getAllCategories();
    setListOfCategories(categories);
    setIsLoading(false);
  };
  return (
    <div className="p-4">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <h2 className="font-bold mb-3 text-lg">CATEGORIES</h2>
          <CategoriesMenu categories={listOfCategories} />
        </div>
      )}
    </div>
  );
};

export default CategoriesSidebar;