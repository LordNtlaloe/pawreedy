'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Slider } from '@/components/ui/slider';
import { Filter } from 'lucide-react';

type FilterProps = {
  categories: string[];
  colors: string[];
  sizes: string[];
  priceRange: { min: number; max: number };
  onFilterChange: (filters: { category: string; color: string; size: string; price: number[] }) => void;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function ProductFilters({
  categories,
  colors,
  sizes,
  priceRange,
  onFilterChange,
}: FilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [selectedColor, setSelectedColor] = useState<string>('All Colors');
  const [selectedSize, setSelectedSize] = useState<string>('All Sizes');
  const [selectedPrice, setSelectedPrice] = useState([priceRange.min, priceRange.max]);
  const [isMobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const handleFilterChange = useCallback(() => {
    onFilterChange({
      category: selectedCategory === 'All Categories' ? '' : selectedCategory,
      color: selectedColor === 'All Colors' ? '' : selectedColor,
      size: selectedSize === 'All Sizes' ? '' : selectedSize,
      price: selectedPrice,
    });
  }, [selectedCategory, selectedColor, selectedSize, selectedPrice, onFilterChange]);

  useEffect(() => {
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
          <span>{isMobileFiltersOpen ? 'Close Filters' : 'Filters'}</span>
        </button>
      </div>

      <div className={classNames('lg:block', isMobileFiltersOpen ? 'block' : 'hidden')}>
        <div className="bg-white p-6 rounded-md">
          <h2 className="text-xl font-bold mb-4 text-[#51358C]">Filter Products</h2>

          <form className="space-y-6">
            {/* Category Filter */}
            <div className="pb-4">
              <label className="text-gray-900 font-medium mb-2">Category</label>
              <DropdownMenu>
                <DropdownMenuTrigger className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white">
                  {selectedCategory}
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white text-gray-900">
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedCategory('All Categories');
                      handleFilterChange();
                    }}
                  >
                    All Categories
                  </DropdownMenuItem>
                  {categories.map((category, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => {
                        setSelectedCategory(category);
                        handleFilterChange();
                      }}
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Color Filter */}
            <div className="pb-4">
              <label className="text-gray-900 font-medium mb-2">Color</label>
              <DropdownMenu>
                <DropdownMenuTrigger className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white">
                  {selectedColor}
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white text-gray-900">
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedColor('All Colors');
                      handleFilterChange();
                    }}
                  >
                    All Colors
                  </DropdownMenuItem>
                  {colors.map((color, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => {
                        setSelectedColor(color);
                        handleFilterChange();
                      }}
                    >
                      {color}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Size Filter */}
            <div className="pb-4">
              <label className="text-gray-900 font-medium mb-2">Size</label>
              <DropdownMenu>
                <DropdownMenuTrigger className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white">
                  {selectedSize}
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white text-gray-900">
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedSize('All Sizes');
                      handleFilterChange();
                    }}
                  >
                    All Sizes
                  </DropdownMenuItem>
                  {sizes.map((size, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => {
                        setSelectedSize(size);
                        handleFilterChange();
                      }}
                    >
                      {size}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Price Range */}
            <div className="pb-4">
              <label className="text-gray-900 font-medium mb-2">Price Range</label>
              <Slider
                min={priceRange.min}
                max={priceRange.max}
                step={1}
                value={selectedPrice}
                onValueChange={(value) => {
                  setSelectedPrice(value);
                  handleFilterChange();
                }}
                className="w-full"
              />
              <div className="flex justify-between mt-2">
                <span>${selectedPrice[0]}</span>
                <span>${selectedPrice[1]}</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
