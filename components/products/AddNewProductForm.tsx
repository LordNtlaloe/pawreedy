"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";
import InputText from "../general/InputText";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Image from "next/image";
import { getAllCategories } from "@/app/_actions/_categoryActions";
import { getAllSizes } from "@/app/_actions/_sizeActions";
import { showConfirmationMessage } from "@/lib/GeneralFunctions";
import { saveNewProduct } from "@/app/_actions/_productsActions";
import Swal from "sweetalert2";
import LoadingDialog from "../general/LoadingDialog";
import { revalidatePath } from "next/cache";

// Types for category and size
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

  useEffect(() => {
    (async () => {
      setCategoryList(await getAllCategories());
      setSizesList(await getAllSizes());
    })();
  }, []);

  const validateInputs = (formData: FormData): boolean => {
    if (!formData.get("name")) {
      showConfirmationMessage("Error: ", "Product Name is required.");
      return false;
    }
    if (!formData.get("description")) {
      showConfirmationMessage("Error: ", "Product Description is required.");
      return false;
    }
    if (!formData.get("price")) {
      showConfirmationMessage("Error: ", "Product Price is required.");
      return false;
    }
    if (!selectedCategory) {
      showConfirmationMessage("Error: ", "Please select a category.");
      return false;
    }
    if (!selectedSize) {
      showConfirmationMessage("Error: ", "Please select a size.");
      return false;
    }
    formData.append("category", selectedCategory);
    formData.append("size", selectedSize);
    return true;
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!image) {
      showConfirmationMessage("Error: ", "An image is required.");
      return null;
    }

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "pawreedy");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dvbcqdbfa/image/upload",
        { method: "POST", body: formData }
      );
      const data = await response.json();
      return data.secure_url || null;
    } catch (error) {
      showConfirmationMessage(
        "Error: ",
        `Error uploading image: ${(error as Error).message}`
      );
      return null;
    }
  };

  const saveProduct = async (formData: FormData) => {
    if (!validateInputs(formData)) return;

    Swal.fire({
      icon: "warning",
      title: "Adding Product",
      text: "You are about to add a new product. Please confirm.",
      showDenyButton: true,
      confirmButtonText: "Add Product",
      denyButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        const imageUrl = await uploadImage();
        if (!imageUrl) {
          setIsLoading(false);
          return;
        }
        formData.append("imageUrl", imageUrl);
        const newProduct = await saveNewProduct(formData);
        setIsLoading(false);

        if (newProduct) {
          showConfirmationMessage(
            "Success: ",
            "A new product has been added successfully!"
          );
          revalidatePath("/dashboard/products")
        } else {
          showConfirmationMessage(
            "Error: ",
            "Failed to add product. Please try again."
          );
        }
      }
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
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
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {/* Product Name */}
            <div className="col-span-full">
              <InputText
                type="text"
                name="name"
                id="name"
                placeholder="Product Name"
                className="block w-full border-0 py-1.5 text-gray-900"
                text={""}
                required={false}
              />
            </div>
            {/* Product Description */}
            <div className="col-span-full">
              <InputText
                type="text"
                name="description"
                id="description"
                placeholder="Product Description"
                className="block w-full border-0 py-1.5 text-gray-900"
                text={""}
                required={false}
              />
            </div>
            {/* Product Price */}
            <div className="col-span-full">
              <InputText
                type="number"
                name="price"
                id="price"
                placeholder="Product Price"
                className="block w-full border-0 py-1.5 text-gray-900"
                text={""}
                required={false}
              />
            </div>
            {/* Category Dropdown */}
            <div className="col-span-full">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center">
                  <ChevronDown />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {categoryList.map((category) => (
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
            {/* Size Dropdown */}
            <div className="col-span-full">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center">
                  <ChevronDown />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {sizesList.map((size) => (
                    <DropdownMenuItem
                      key={size._id}
                      onSelect={() => setSelectedSize(size.name)}
                    >
                      {size.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {/* Image Upload */}
            <div className="col-span-full">
              <input type="file" onChange={handleImageChange} />
              {iconPreview && (
                <Image
                  src={iconPreview}
                  alt="Preview"
                  width={100}
                  height={100}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Button
        type="submit"
        className="mt-2 bg-[#51358C] text-white"
        disabled={isLoading}
      >
        {isLoading ? "Adding Product" : "Add Product"}
      </Button>
      {isLoading && <LoadingDialog open={true} message="Adding Product..." />}
    </form>
  );
};

export default AddNewProductForm;
