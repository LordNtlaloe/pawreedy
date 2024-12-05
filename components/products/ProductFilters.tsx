import { useState, useEffect, useCallback } from "react";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { PlusIcon, Filter } from "lucide-react";

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

export default function ProductFilters({ categories, colors, sizes, priceRange, onFilterChange }: FilterProps) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
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
    handleFilterChange();
  }, [selectedCategory, selectedColor, selectedSize, selectedPrice]);

  useEffect(() => {
    // Reset selected price range on priceRange change
    setSelectedPrice([priceRange.min, priceRange.max]);
  }, [priceRange]);

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
          <h2 className="text-xl font-bold mb-4">Filter Products</h2>

          <form className="space-y-6">
            {/* Category Filter */}
            <Disclosure as="div" className="border-b border-gray-200 pb-4">
              <DisclosureButton className="flex justify-between w-full text-gray-900 font-medium">
                Category
                <span className="ml-6 flex items-center">
                  <PlusIcon className="h-5 w-5" aria-hidden="true" />
                </span>
              </DisclosureButton>
              <DisclosurePanel className="pt-4">
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
                >
                  <option value="">All Categories</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </DisclosurePanel>
            </Disclosure>

            {/* Color Filter */}
            <Disclosure as="div" className="border-b border-gray-200 pb-4">
              <DisclosureButton className="flex justify-between w-full text-gray-900 font-medium">
                Color
                <span className="ml-6 flex items-center">
                  <PlusIcon className="h-5 w-5" aria-hidden="true" />
                </span>
              </DisclosureButton>
              <DisclosurePanel className="pt-4">
                <select
                  id="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
                >
                  <option value="">All Colors</option>
                  {colors.map((color, index) => (
                    <option key={index} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </DisclosurePanel>
            </Disclosure>

            {/* Size Filter */}
            <Disclosure as="div" className="border-b border-gray-200 pb-4">
              <DisclosureButton className="flex justify-between w-full text-gray-900 font-medium">
                Size
                <span className="ml-6 flex items-center">
                  <PlusIcon className="h-5 w-5" aria-hidden="true" />
                </span>
              </DisclosureButton>
              <DisclosurePanel className="pt-4">
                <select
                  id="size"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
                >
                  <option value="">All Sizes</option>
                  {sizes.map((size, index) => (
                    <option key={index} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </DisclosurePanel>
            </Disclosure>

            {/* Price Range */}
            <Disclosure as="div" className="border-b border-gray-200 pb-4">
              <DisclosureButton className="flex justify-between w-full text-gray-900 font-medium">
                Price Range
                <span className="ml-6 flex items-center">
                  <PlusIcon className="h-5 w-5" aria-hidden="true" />
                </span>
              </DisclosureButton>
              <DisclosurePanel className="pt-4">
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
              </DisclosurePanel>
            </Disclosure>
          </form>
        </div>
      </div>
    </div>
  );
}
