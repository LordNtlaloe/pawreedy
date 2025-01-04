"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { ChevronDown } from 'lucide-react';
import { Input } from '../ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import Image from 'next/image';
import { getAllCategories } from '@/app/_actions/_categoryActions';
import { getAllSizes } from '@/app/_actions/_sizeActions';
import { getAllColors } from '@/app/_actions/_colorActions'; // Assuming a method to fetch colors
import { showConfirmationMessage } from '@/lib/GeneralFunctions';
import { saveNewProduct } from '@/app/_actions/_productsActions';
import Swal from 'sweetalert2';
import LoadingDialog from '../general/LoadingDialog';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { FiChevronRight } from 'react-icons/fi';

interface Category {
  _id: string;
  name: string;
}

interface Size {
  _id: string;
  name: string;
}

interface Color {
  _id: string;
  name: string;
}

const AddNewProductForm: React.FC = () => {
  const [images, setImages] = useState<File[]>([]); // State to hold multiple images
  const [imagePreviews, setImagePreviews] = useState<string[]>([]); // Previews for multiple images
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [categoryList, setCategoryList] = useState<Category[]>([]);

  // States for category, sizes, colors, and features
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sizesList, setSizesList] = useState<Size[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [colorsList, setColorsList] = useState<Color[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [keyFeatures, setKeyFeatures] = useState<string[]>([]);

  // Fetch data functions
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
    getAllColorsList(); // Fetch colors list
  }, []);

  const handleColorChange = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleSizeChange = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...keyFeatures];
    newFeatures[index] = value;
    setKeyFeatures(newFeatures);
  };

  const handleAddFeature = () => {
    setKeyFeatures((prevFeatures) => [...prevFeatures, '']);
  };

  const handleRemoveFeature = (index: number) => {
    const newFeatures = keyFeatures.filter((_, i) => i !== index);
    setKeyFeatures(newFeatures);
  };

  // Handling Image Upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files);
      setImages((prevImages) => [...prevImages, ...newImages]);

      const newPreviews = newImages.map((file) => URL.createObjectURL(file));
      setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    }
  };

  const validateInputs = (formData: FormData): boolean => {
    if (!formData.get('name')) {
      showConfirmationMessage("Error: ", "Product Name Is Required");
      return false;
    }
    if (!formData.get('description')) {
      showConfirmationMessage("Error: ", "Product Description Is Required");
      return false;
    }
    if (!formData.get('price')) {
      showConfirmationMessage("Error: ", "Product Price Is Required");
      return false;
    }
    if (!selectedCategory) {
      showConfirmationMessage("Error: ", "Please Select A Category");
      return false;
    }
    if (selectedSizes.length === 0) {
      showConfirmationMessage("Error: ", "Please Select At Least One Size");
      return false;
    }
    if (selectedColors.length === 0) {
      showConfirmationMessage("Error: ", "Please Select At Least One Color");
      return false;
    }
    if (keyFeatures.length === 0) {
      showConfirmationMessage("Error: ", "Please Add At Least One Key Feature");
      return false;
    }
  
    formData.append("category", selectedCategory);
    formData.append("sizes", JSON.stringify(selectedSizes)); // Append sizes as JSON string
    formData.append("colors", JSON.stringify(selectedColors)); // Append colors as JSON string
    formData.append("features", JSON.stringify(keyFeatures)); // Append features as JSON string
  
    return true;
  };
  

  // Save product
  const saveProduct = async (formData: FormData) => {
    if (!validateInputs(formData)) return;

    Swal.fire({
      icon: "warning",
      title: "Adding Product",
      text: "You Are About To Add A New Product. Please Confirm",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Add Product",
      denyButtonText: "Cancel Action",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        const imageUrls = await uploadImages();
        if (!imageUrls || imageUrls.length === 0) {
          showConfirmationMessage("Error: ", "Failed To Upload Images!!");
          return;
        }
        imageUrls.forEach((url) => {
          formData.append("images", url); // Use [] to append multiple values for the same key
        });


        const newProduct = await saveNewProduct(formData);
        setIsLoading(false);

        if (newProduct) {
          showConfirmationMessage("Success: ", "A New Product Has Been Added Successfully!");
        } else {
          showConfirmationMessage("Error: ", "Failed to Add Product. Please Try Again.");
        }
      } else if (result.isDenied) {
        Swal.fire("Adding Product Failed. Please Try Again.", "", "info");
      }
    });
  };

  // Image upload function to handle Cloudinary
  const uploadImages = async (): Promise<string[] | null> => {
    if (images.length === 0) {
      showConfirmationMessage("Error: ", "At Least One Image Is Required");
      return null;
    }

    const uploadPromises = images.map(async (image) => {
      const imageData = new FormData();
      imageData.append("file", image);
      imageData.append("upload_preset", "pawreedy");

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/dvbcqdbfa/image/upload`,
          { method: "POST", body: imageData }
        );
        const uploadedImageData = await response.json();
        return uploadedImageData?.secure_url;
      } catch (error) {
        showConfirmationMessage("Error: ", `Error Uploading Image: ${(error as Error).message}`);
        return null;
      }
    });

    const uploadedUrls = await Promise.all(uploadPromises);
    return uploadedUrls.filter(Boolean) as string[]; // Remove null values from the array
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); saveProduct(new FormData(e.currentTarget)); }}>
      <div className="space-y-12">
        <div className="p-2">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full">
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Product Name</label>
              <div className="mt-2">
                <Input type="text" name="name" id="name" placeholder="Product Name" className="block w-full border-1 border-slate-400 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" required={false} />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">Description</label>
              <div className="mt-2">
                <textarea id="description" name="description" rows={3} className="block w-full rounded-md border-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></textarea>
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">Write A Few Sentences About The Product.</p>
            </div>

            <div className="col-span-full">
              <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">Select A Category</label>
              <div className="mt-2">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center">
                    <span className="outline-none">
                      <ChevronDown />
                    </span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white">
                    {categoryList.map((category) => (
                      <DropdownMenuItem key={category._id} onSelect={() => setSelectedCategory(category.name)}>
                        {category.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className='mt-2'>
                  {selectedCategory ? <h1 className="bg-green-500 text-white text-sm rounded px-2 py-4">{selectedCategory}</h1> : (
                    <h1 className="bg-red-500 rounded text-white text-sm px-2 py-4">Not Selected</h1>
                  )}
                </div>
              </div>
            </div>
            <div className="col-span-full">
              <label className="block text-sm font-medium leading-6 text-gray-900">Select Colors</label>
              <div className="mt-2">
                {colorsList.map((color) => (
                  <div key={color._id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`color-${color._id}`}
                      value={color.name}
                      checked={selectedColors.includes(color.name)}
                      onChange={() => handleColorChange(color.name)}
                      className="mr-2"
                    />
                    <label htmlFor={`color-${color._id}`} className="text-gray-900">{color.name}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Size selection */}
            <div className="col-span-full">
              <label className="block text-sm font-medium leading-6 text-gray-900">Select Sizes</label>
              <div className="mt-2">
                {sizesList.map((size) => (
                  <div key={size._id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`size-${size._id}`}
                      value={size.name}
                      checked={selectedSizes.includes(size.name)}
                      onChange={() => handleSizeChange(size.name)}
                      className="mr-2"
                    />
                    <label htmlFor={`size-${size._id}`} className="text-gray-900">{size.name}</label>
                  </div>
                ))}
              </div>
            </div>


            <div className="col-span-full">
              <label htmlFor="quantity" className="block text-sm font-medium leading-6 text-gray-900">Quantity</label>
              <div className="mt-2">
                <Input type="number" name="quantity" id="quantity" placeholder="Product Quantity" className="block w-full border-1 border-slate-400 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" required={false} />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">Price</label>
              <div className="mt-2">
                <Input type="number" name="price" id="price" placeholder="Product Price" className="block w-full border-1 border-slate-400 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" required={false} />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="keyFeatures" className="block text-sm font-medium leading-6 text-gray-900">Key Features</label>
              <div className="mt-2 space-y-2">
                {keyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className="block w-full border-1 py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder={`Feature ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="text-red-600"
                    >
                      &times;
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="text-indigo-600 mt-2"
                >
                  + Add Another Feature
                </button>
              </div>
            </div>

            <div className="col-span-full">
              <label className="block text-sm font-medium leading-6 text-gray-900">Product Images</label>
              <div className="mt-2 flex items-center space-x-3">
                <label className="cursor-pointer flex items-center space-x-2">
                  <FaCloudUploadAlt className="text-gray-600" />
                  <span className="text-gray-600">Upload Images</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <div className="flex space-x-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative w-32 h-32">
                      <img src={preview} alt={`Product Preview ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setImages(images.filter((_, i) => i !== index));
                          setImagePreviews(imagePreviews.filter((_, i) => i !== index));
                        }}
                        className="absolute top-0 right-0 text-white bg-black bg-opacity-50 p-1 rounded-full"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
          <Button className='mt-2 ml-2 bg-[#51358C] text-white hover:bg-[#6C548C]' disabled={isLoading} type='submit'>{isLoading ? "Adding Product" : "Add Product"}</Button>
          {isLoading && <LoadingDialog open={false} message={''} />}
        </div>
      </div>
    </form>
  );
};
export default AddNewProductForm;