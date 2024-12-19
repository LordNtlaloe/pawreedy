"use client"

import { useState, useEffect, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import the Select components
import { Filter } from "lucide-react";

type FilterProps = {
  categories: string[];
  colors: string[];
  sizes: string[];
  priceRange: { min: number; max: number };
  onFilterChange: (filters: { category: string; color: string; size: string; price: number[] }) => void;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductFilters({
  categories,
  colors,
  sizes,
  priceRange,
  onFilterChange,
}: FilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState([priceRange.min, priceRange.max]);
  const [isMobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const handleFilterChange = useCallback(() => {
    onFilterChange({
      category: selectedCategory,
      color: selectedColor,
      size: selectedSize,
      price: selectedPrice,
    });
  }, [selectedCategory, selectedColor, selectedSize, selectedPrice, onFilterChange]);

  useEffect(() => {
    setSelectedPrice([priceRange.min, priceRange.max]);
  }, [priceRange]);

  const handleCategoryChange = (value: string) => {
    const newValue = value === "all" ? "" : value;
    setSelectedCategory(newValue);
    onFilterChange({
      category: newValue,
      color: selectedColor,
      size: selectedSize,
      price: selectedPrice,
    });
  };

  const handleColorChange = (value: string) => {
    const newValue = value === "all" ? "" : value;
    setSelectedColor(newValue);
    handleFilterChange();
  };

  const handleSizeChange = (value: string) => {
    const newValue = value === "all" ? "" : value;
    setSelectedSize(newValue);
    handleFilterChange();
  };

  return (
    <div className="lg:block">
      <div className="block lg:hidden">
        <button
          onClick={() => setMobileFiltersOpen(!isMobileFiltersOpen)}
          className="w-full text-white bg-[#F20707] p-2 rounded-md flex items-center justify-center space-x-2"
        >
          <Filter className="h-5 w-5" />
          <span>{isMobileFiltersOpen ? "Close Filters" : "Filters"}</span>
        </button>
      </div>

      <div className={classNames("lg:block", isMobileFiltersOpen ? "block" : "hidden")}>
        <div className="bg-white p-6 rounded-md">
          <h2 className="text-xl font-bold mb-4 text-[#51358C]">Filter Products</h2>

          <form className="space-y-6">
            {/* Category Filter */}
            <div className=" pb-4">
              <label className="text-gray-900 font-medium mb-2">Category</label>
              <Select onValueChange={handleCategoryChange} value={selectedCategory || "all"}>
                <SelectTrigger className="w-full mt-1 p-2 rounded-md">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {/* <SelectLabel>Categories</SelectLabel> */}
                    <SelectItem value="all" className="hover:bg-[#51358C] ">All Categories</SelectItem>
                    {categories.map((category, index) => (
                      <SelectItem key={`category-${index}`} value={category} className="hover:bg-[#51358C] ">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Color Filter */}
            <div className=" pb-4">
              <label className="text-gray-900 font-medium mb-2">Color</label>
              <Select onValueChange={handleColorChange} value={selectedColor || "all"}>
                <SelectTrigger className="w-full mt-1 p-2 rounded-md">
                  <SelectValue placeholder="Select a color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {/* <SelectLabel>Colors</SelectLabel> */}
                    <SelectItem value="all">All Colors</SelectItem>
                    {colors.map((color, index) => (
                      <SelectItem key={`color-${index}`} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Size Filter */}
            <div className=" pb-4">
              <label className="text-gray-900 font-medium mb-2">Size</label>
              <Select onValueChange={handleSizeChange} value={selectedSize || "all"}>
                <SelectTrigger className="w-full mt-1 p-2 rounded-md">
                  <SelectValue placeholder="Select a size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {/* <SelectLabel>Sizes</SelectLabel> */}
                    <SelectItem value="all">All Sizes</SelectItem>
                    {sizes.map((size, index) => (
                      <SelectItem key={`size-${index}`} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div className=" pb-4">
              <label className="text-gray-900 font-medium mb-2">Price Range</label>
              <div className="flex space-x-4">
                <input
                  type="number"
                  value={selectedPrice[0]}
                  min={priceRange.min}
                  max={priceRange.max}
                  onChange={(e) => {
                    const newValue = Number(e.target.value);
                    setSelectedPrice((prev) => [newValue, prev[1]]);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <span>-</span>
                <input
                  type="number"
                  value={selectedPrice[1]}
                  min={priceRange.min}
                  max={priceRange.max}
                  onChange={(e) => {
                    const newValue = Number(e.target.value);
                    setSelectedPrice((prev) => [prev[0], newValue]);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
