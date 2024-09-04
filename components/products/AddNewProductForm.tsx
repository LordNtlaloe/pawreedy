"use client"
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { ChevronDown } from 'lucide-react';
import InputText from '../general/InputText';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import Image from 'next/image';
import { getAllCategories } from '@/app/_actions/_categoryActions';
import { showConfirmationMessage, showToastMessage } from '@/lib/GeneralFunctions';
import { saveNewProduct } from '@/app/_actions/_productsActions';
import Swal from 'sweetalert2';
import LoadingDialog from '../general/LoadingDialog';

const AddNewProductForm = () => {
    // Update icon state to hold a File object instead of a string
    const [icon, setIcon] = useState<File | null>(null);
    const [iconPreview, setIconPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    const getCategoryList = async () => {
        const categories = await getAllCategories();
        setCategoryList(categories);
        return categories;
    }

    useEffect(() => {
        getCategoryList();
    }, []);

    const validateInputs = (formData: FormData) => {
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
        formData.append("category", selectedCategory);
        return true;
    }

    const uploadImage = async () => {
        if (!icon) {
            showConfirmationMessage("Error: ", "An Image Is Required");
            return;
        }

        const imageData = new FormData();
        imageData.append("file", icon);
        imageData.append("upload_preset", "pawreedy");

        try {
            const response = await fetch(
            `https://api.cloudinary.com/v1_1/dvbcqdbfa/image/upload`,
                { method: "POST", body: imageData }
            );
            const uploadedImageData = await response.json();
            return uploadedImageData.secure_url;
        } catch (error) {
            showConfirmationMessage("Error: ", `Error Uploading Image: ${error}. Please Verify You Have Internet Connection`);
            setIcon(null);
            setIconPreview(null);
            setIsLoading(false);
            return null;
        }
    }

    const saveProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        
        if (!validateInputs(formData)) return;

        const result = await Swal.fire({
            icon: "warning",
            title: "Adding Product", 
            text: "You Are About To Add A New Product. Please Confirm",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Add Product",
            denyButtonText: "Cancel Action",
        });

        if (result.isConfirmed) {
            setIsLoading(true);
            
            const imageUrl = await uploadImage();
            if (!imageUrl) {
                setIsLoading(false);
                return;
            }

            formData.append("image", imageUrl);

            const newProduct = await saveNewProduct(formData);
            setIsLoading(false);

            if (newProduct?.productId) {
                showConfirmationMessage("Success: ", "A New Product Has Been Added Successfully!");
            } else {
                showConfirmationMessage("Error: ", "Failed to Add Product. Please Try Again.");
            }
        } else if (result.isDenied) {
            Swal.fire("Adding Product Failed. Please Try Again.", "", "info");
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const image = e.target.files?.[0];
        if (image) {
            setIcon(image); // Updated to handle File object
            setIconPreview(URL.createObjectURL(image));
        } else {
            setIcon(null);
            setIconPreview(null);
        }
    }

    return (
        <form onSubmit={saveProduct}>
            <div className="space-y-12">
                <div className="p-2">
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="col-span-full">
                            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Product Name</label>
                            <div className="mt-2">
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                    <InputText type="text" name="name" id="name" placeholder="Product Name" required={false} className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" text={''} />
                                </div>
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">Description</label>
                            <div className="mt-2">
                                <textarea id="description" name="description" rows={3} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></textarea>
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
                                        {categoryList && categoryList.map((category: any) => (
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
                            <label htmlFor="file_input" className="block text-sm font-medium leading-6 text-gray-900">Image/Cover Photo</label>
                            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                <div className="text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-2.22-2.22a1.5 1.5 0 00-2.12 0l-4.44 4.44zm2.47 2.47a1.5 1.5 0 002.12 0l4.44-4.44a1.5 1.5 0 012.12 0l2.22 2.22a.75.75 0 001.06-1.06l-.97-.97a1.5 1.5 0 00-2.12 0l-.88-.88a1.5 1.5 0 00-2.12 0l-4.44 4.44z" clipRule="evenodd" />
                                    </svg>
                                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                        <label htmlFor="file_input" className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                                            <span>Upload an image</span>
                                            <input id="file_input" name="image" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            </div>
                            {iconPreview && (
                                <div className='p-4 w-full'>
                                    <Image src={iconPreview} width={100} height={100} className='rounded-lg' alt='product image' />
                                </div>
                            )}
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">Price</label>
                            <div className="mt-2">
                                <input type="text" name="price" id="price" autoComplete="price" className="block w-full rounded-md border-0 py-1.5 pl-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Product Price" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Button className='mt-2 ml-2 bg-[#51358C] text-white hover:bg-[#6C548C]' disabled={isLoading} type='submit'>{isLoading ? "Adding Product" : "Add Product"}</Button>
            {isLoading && <LoadingDialog open={false} message={''} />}
        </form>
    );
}

export default AddNewProductForm;
