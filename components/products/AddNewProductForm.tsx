"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ChevronDown, Image as ImageIcon } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Image from "next/image";
import { getAllCategories } from "@/app/_actions/_categoryActions";
import { showConfirmationMessage } from "@/lib/GeneralFunctions";
import { saveNewProduct } from "@/app/_actions/_productsActions";
import { useUser } from "@clerk/nextjs";
import Swal from "sweetalert2";
import LoadingDialog from "../general/LoadingDialog";
import InputText from "../general/InputText";

const AddNewProductForm = () => {
    const [icon, setIcon] = useState<File | null>(null);
    const [iconPreview, setIconPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [categoriesList, setCategoriesList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const { user } = useUser();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categories = await getAllCategories();
                setCategoriesList(categories);
            } catch (error) {
                showConfirmationMessage("error", "Failed to fetch categories.");
            }
        };
        fetchCategories();
    }, []);

    const validateInputs = (formData: FormData) => {
        const requiredFields = [
            { field: 'name', message: "REQUIRED: Product name is required!" },
            { field: 'description', message: "REQUIRED: Contact person is required!" },
            { field: 'productEmail', message: "REQUIRED: Product email is required!" },
            { field: 'productPhoneNumber', message: "REQUIRED: Product phone number is required!" },
            { field: 'productAddress', message: "REQUIRED: Product address is required!" },
            { field: 'aboutProduct', message: "REQUIRED: Short description is required!" },
            { field: 'productDetails', message: "REQUIRED: Detailed description is required!" },
        ];

        for (let { field, message } of requiredFields) {
            if (!formData.get(field)) {
                showConfirmationMessage("error", message);
                return false;
            }
        }

        if (!selectedCategory) {
            showConfirmationMessage("error", "REQUIRED: Please select a category!");
            return false;
        }

        formData.append("category", selectedCategory);
        return true;
    };

    const uploadImage = async (): Promise<string | undefined> => {
        if (!icon) {
            showConfirmationMessage("error", "Icon is required...");
            return;
        }

        const imageData = new FormData();
        imageData.append("file", icon);
        imageData.append("upload_preset", "experthub");

        try {
            const response = await fetch(
                "https://api.cloudinary.com/v1_1/moteteletsa/image/upload",
                { method: "POST", body: imageData }
            );
            const { secure_url } = await response.json();
            return secure_url;
        } catch (error) {
            showConfirmationMessage(
                "error",
                `Error uploading image: ${error}. Please verify you have internet connectivity.`
            );
            setIcon(null);
            setIconPreview(null);
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        if (validateInputs(formData)) {
            Swal.fire({
                icon: "warning",
                title: "Product Registration",
                text: "You are about to register a product with Uniserve. Please confirm.",
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: "Register",
                denyButtonText: "Abort",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    setIsLoading(true);

                    formData.append("userId", user?.id as string);
                    formData.append("fullNames", user?.fullName as string);

                    const imageURL = await uploadImage();
                    if (imageURL) {
                        formData.append("faceImage", imageURL);
                    }

                    const newProduct = await saveNewProduct(formData);

                    if (newProduct.productId) {
                        showConfirmationMessage(
                            "success",
                            "Your application has been submitted. You will receive communication from our team regarding the verification process. Thank you for your interest in using our services.",
                            "Product Registration"
                        );
                    } else if (newProduct.error) {
                        showConfirmationMessage("error", `Error: ${newProduct.error}`);
                    }
                    setIsLoading(false);
                } else if (result.isDenied) {
                    Swal.fire("Registration was aborted! Details not saved", "", "info");
                }
            });
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const image = e.target.files?.[0];
        if (image) {
            setIcon(image);
            setIconPreview(URL.createObjectURL(image));
        } else {
            setIcon(null);
            setIconPreview(null);
        }
    };

    return (
        <section className="max-w-4xl mx-auto p-6 bg-white rounded-md">
            <form method="POST" encType="multipart/form-data">
                <div className="mt-10 space-y-8">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                            Product Name
                        </label>
                        <div className="mt-2">
                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                                <InputText
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Product Name"
                                    className="block w-full bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                    text={""}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                            Product Description
                        </label>
                        <div className="mt-2">
                            <textarea
                                id="description"
                                name="description"
                                rows={3}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Product Description"
                                defaultValue=""
                            />
                        </div>
                        <p className="mt-3 text-sm leading-6 text-gray-600">
                            Write a few sentences about the product.
                        </p>
                    </div>

                    <div>
                        <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
                            Product Price
                        </label>
                        <div className="mt-2">
                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                                <InputText
                                    id="price"
                                    name="price"
                                    type="number"
                                    placeholder="Product Price"
                                    className="block w-full border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                    text={""}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">
                            Category
                        </label>
                        <div className="mt-2">
                            <select
                                id="category"
                                name="category"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="" disabled>
                                    Select a category
                                </option>
                                {categoriesList &&
                                    categoriesList.map((category: any) => (
                                        <option key={category._id} value={category.name}>
                                            {category.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="quantity" className="block text-sm font-medium leading-6 text-gray-900">
                            Product Quantity
                        </label>
                        <div className="mt-2">
                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                                <InputText
                                    id="quantity"
                                    name="quantity"
                                    type="number"
                                    placeholder="Product Quantity"
                                    className="block w-full border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                    text={""}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="image" className="block text-sm font-medium leading-6 text-gray-900">
                            Product Image URL
                        </label>
                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                            <div className="text-center">
                                <ImageIcon aria-hidden="true" className="mx-auto h-12 w-12 text-gray-300" />
                                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                    <label
                                        htmlFor="image-upload"
                                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                    >
                                        <span>Upload a file</span>
                                        <input
                                            id="image-upload"
                                            name="image-upload"
                                            type="file"
                                            className="sr-only"
                                            accept="image/*"
                                            onChange={(e) => handleImageChange(e)}
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    type="submit"
                    className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    Save Product
                </button>
            </form>

            <LoadingDialog open={isLoading} message="Saving product..." />
        </section>

    );
};

export default AddNewProductForm;
