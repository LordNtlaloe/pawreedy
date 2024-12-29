'use client';

import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import LoadingDialog from '../general/LoadingDialog';
import Image from 'next/image';
import { getAllCategories } from '@/app/_actions/_categoryActions';
import { showConfirmationMessage, showToastMessage } from '@/lib/GeneralFunctions';
import { updateProduct } from '@/app/_actions/_productsActions';
import Swal from 'sweetalert2';
import { Button } from '@/components/ui/button';
import { getAllSizes } from '@/app/_actions/_sizeActions';
import { getAllColors } from '@/app/_actions/_colorActions';
import { Checkbox } from '@/components/ui/checkbox';

const UpdateProductForm = ({ product }: { product: any }) => {
  const [image, setImage] = useState<File | null>(null);
  const [iconPreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sizesList, setSizesList] = useState<any[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [colorsList, setColorsList] = useState<any[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const getCategoryList = async () => {
    const categories = await getAllCategories();
    setCategoryList(categories);
  };

  const getAllSizesList = async () => {
    const sizes = await getAllSizes();
    setSizesList(sizes);
  };

  const getAllColorsList = async () => {
    const colors = await getAllColors();
    setColorsList(colors);
  };

  useEffect(() => {
    getCategoryList();
    getAllSizesList();
    getAllColorsList();
  }, []);

  const validateInputs = (formData: FormData): boolean => {
    if (!formData.get('name')) {
      showConfirmationMessage('Error: ', 'Product Name Is Required');
      return false;
    }
    if (!formData.get('description')) {
      showConfirmationMessage('Error: ', 'Product Description Is Required');
      return false;
    }
    if (!formData.get('price')) {
      showConfirmationMessage('Error: ', 'Product Price Is Required');
      return false;
    }
    if (!selectedCategory) {
      showConfirmationMessage('Error: ', 'Please Select A Category');
      return false;
    }
    if (selectedSizes.length === 0) {
      showConfirmationMessage('Error: ', 'Please Select At Least One Size');
      return false;
    }
    formData.append('category', selectedCategory);
    formData.append('sizes', selectedSizes.join(','));
    return true;
  };

  const saveProduct = async (formData: FormData) => {
    if (validateInputs(formData)) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Update!',
      }).then(async (result) => {
        if (result.isConfirmed) {
          const updateResult = await updateProduct(product._id, formData);
          console.log(updateResult);
          showToastMessage('success', 'Product was successfully updated...');
        }
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setImage(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    } else {
      setImagePreview(null);
    }
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((item) => item !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((item) => item !== color) : [...prev, color]
    );
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        saveProduct(new FormData(e.currentTarget));
      }}
    >
      <div className="space-y-12">
        <div className="p-2">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Product Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  defaultValue={product?.name}
                  name="name"
                  id="name"
                  placeholder="Product Name"
                  className="block w-full border border-gray-300 bg-slate-100 py-1.5 px-2 text-gray-900 rounded-md"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="description"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Description
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  defaultValue={product?.description}
                  rows={3}
                  className="block w-full rounded-md py-1.5 px-2 bg-slate-100 text-gray-900"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="category"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Select A Category
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center bg-white border border-gray-300 rounded px-4 py-2">
                  {selectedCategory || 'Select a category'}
                  <ChevronDown className="ml-2" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white shadow-md rounded">
                  {categoryList.map((category: any) => (
                    <DropdownMenuItem
                      key={category._id}
                      onSelect={() => setSelectedCategory(category.name)}
                    >
                      {category.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Sizes */}
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-900">Sizes</label>
              <div className="flex flex-wrap gap-4 mt-2">
                {sizesList.map((size) => (
                  <div key={size._id} className="flex items-center">
                    <Checkbox
                      id={`size-${size._id}`}
                      checked={selectedSizes.includes(size.name)}
                      onCheckedChange={() => toggleSize(size.name)}
                    />
                    <label
                      htmlFor={`size-${size._id}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {size.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-900">Colors</label>
              <div className="flex flex-wrap gap-4 mt-2">
                {colorsList.map((color) => (
                  <div key={color._id} className="flex items-center">
                    <Checkbox
                      id={`color-${color._id}`}
                      checked={selectedColors.includes(color.name)}
                      onCheckedChange={() => toggleColor(color.name)}
                    />
                    <label
                      htmlFor={`color-${color._id}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {color.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="price"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Price
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  defaultValue={product?.price}
                  name="price"
                  id="price"
                  placeholder="Product Price"
                  className="block w-full border border-gray-300 py-1.5 px-2 rounded-md"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="image"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Product Image
              </label>
              <div className="mt-2">
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-900"
                />
                {iconPreview && (
                  <Image
                    src={iconPreview}
                    alt="Selected Product Image"
                    width={100}
                    height={100}
                    className="mt-4"
                  />
                )}
              </div>
            </div>

            <div className="col-span-full">
              <Button type="submit" className="mt-4" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Product'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default UpdateProductForm;
