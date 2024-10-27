"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { ChevronDown } from 'lucide-react';
import InputText from '../general/InputText';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import Image from 'next/image';
import { getAllCategories } from '@/app/_actions/_categoryActions';
import { getAllSizes } from '@/app/_actions/_sizeActions';
import { showConfirmationMessage } from '@/lib/GeneralFunctions';
import { saveNewProduct } from '@/app/_actions/_productsActions';
import Swal from 'sweetalert2';
import LoadingDialog from '../general/LoadingDialog';

interface Category {
    _id: string;
    name: string;
}

interface Size {
    _id: string;
    name: string;
}

const AddNewProductForm: React.FC = () => {
    const [image, setImage] = useState<File | null>(null);
    const [iconPreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [categoryList, setCategoryList] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [sizesList, setSizesList] = useState<Size[]>([]);
    const [selectedSize, setSelectedSize] = useState<string>("");

    const getCategoryList = async () => {
        const categories = await getAllCategories();
        setCategoryList(categories);
    };

    const getAllSizesList = async () => {
        const sizes = await getAllSizes();
        setSizesList(sizes);
    };

    useEffect(() => {
        getCategoryList();
        getAllSizesList();
    }, []);

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
        if (!selectedSize) {
            showConfirmationMessage("Error: ", "Please Select A Size");
            return false;
        }
        formData.append("category", selectedCategory);
        formData.append("size", selectedSize);
        return true;
    };

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
                const imageUrl = await uploadImage();
                if (!imageUrl) {
                    showConfirmationMessage("Error: ", "Failed To Upload Image!!");
                    return;
                }
                formData.append("imageUrl", imageUrl);

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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImage(file);
        setImagePreview(file ? URL.createObjectURL(file) : null);
    };

    const uploadImage = async (): Promise<string | null> => {
        if (!image) {
            showConfirmationMessage("Error: ", "An Image Is Required");
            return null;
        }

        const imageData = new FormData();
        imageData.append("file", image);
        imageData.append("upload_preset", "pawreedy");

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/dvbcqdbfa/image/upload`,
                { method: "POST", body: imageData }
            );
            const uploadedImageData = await response.json();
            return uploadedImageData?.secure_url || null;
        } catch (error) {
            showConfirmationMessage("Error: ", `Error Uploading Image: ${(error as Error).message}`);
            setImage(null);
            setImagePreview(null);
            setIsLoading(false);
            return null;
        }
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); saveProduct(new FormData(e.currentTarget)); }}>
            <div className="space-y-12">
                <div className="p-2">
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="col-span-full">
                            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Product Name</label>
                            <div className="mt-2">
                                <InputText type="text" name="name" id="name" placeholder="Product Name" className="block w-full border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" text={''} required={false} />
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
                            <label htmlFor="size" className="block text-sm font-medium leading-6 text-gray-900">Select A Size</label>
                            <div className="mt-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center">
                                        <span className="outline-none">
                                            <ChevronDown />
                                        </span>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="bg-white">
                                        {sizesList.map((size) => (
                                            <DropdownMenuItem key={size._id} onSelect={() => setSelectedSize(size.name)}>
                                                {size.name}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <div className='mt-2'>
                                    {selectedSize ? <h1 className="bg-green-500 text-white text-sm rounded px-2 py-4">{selectedSize}</h1> : (
                                        <h1 className="bg-red-500 rounded text-white text-sm px-2 py-4">Not Selected</h1>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="quantity" className="block text-sm font-medium leading-6 text-gray-900">Quantity</label>
                            <div className="mt-2">
                                <InputText type="number" name="quantity" id="quantity" placeholder="Product Quantity" className="block w-full border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" text={''} required={false} />
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">Price</label>
                            <div className="mt-2">
                                <InputText type="number" name="price" id="price" placeholder="Product Price" className="block w-full border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" text={''} required={false} />
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="image" className="block text-sm font-medium leading-6 text-gray-900">Product Image</label>
                            <div className="mt-2">
                                <input type="file" id="image" name="image" onChange={handleImageChange} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md" />
                                {iconPreview && <Image src={iconPreview} alt="Image Preview" width={100} height={100} className="mt-2" />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Button className='mt-2 ml-2 bg-[#51358C] text-white hover:bg-[#6C548C]' disabled={isLoading} type='submit'>{isLoading ? "Adding Product" : "Add Product"}</Button>
            {isLoading && <LoadingDialog open={false} message={''} />}
        </form>
    );
};

export default AddNewProductForm;
