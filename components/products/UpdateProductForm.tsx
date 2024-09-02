"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown, X } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Image from "next/image";
import { getAllCategories } from "@/app/_actions/_categoryActions";
import { showConfirmationMessage, showToastMessage } from "@/lib/GeneralFunctions";
import { updateProduct } from "@/app/_actions/_productsActions";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import InputText from "@/components/general/InputText";
import { Button } from "@/components/ui/button";
import { useProductStore } from "@/lib/stores/productStore";



const ProductUpdateForm = ({ product }: { product: any }) => {
  const [icon, setIcon] = useState("");
  const [iconPreview, setIconPreview] = useState(null);
  const [categoriesList, setCategoriesList] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(product.category)
  const { setShowProductUpdateModal } = useProductStore()


  const getCategoriesList = async () => {
    const categories = await getAllCategories()
    setCategoriesList(categories)
    return categories
  }

  useEffect(() => {
    getCategoriesList()
    setSelectedCategory(product.category)
  }, [product])


  const validateInputs = (formData: FormData) => {
    if (!formData.get('productName')) {
      showConfirmationMessage("error", "REQUIRED: Product name is required!!")
      return false
    }
    if (!selectedCategory) {
      showConfirmationMessage("error", "REQUIRED: Please select category of your busness!!")
      return false
    }
    if (!formData.get('contactPerson')) {
      showConfirmationMessage("error", "REQUIRED: Please specify contact person.!!")
      return false
    }
    if (!formData.get('productEmail')) {
      showConfirmationMessage("error", "REQUIRED: Please specify product email!!")
      return false
    }
    if (!formData.get('productPhoneNumber')) {
      showConfirmationMessage("error", "REQUIRED: Please specify product phone number.!!")
      return false
    }
    if (!formData.get('productAddress')) {
      showConfirmationMessage("error", "REQUIRED: Please specify full product address!!")
      return false
    }
    if (!formData.get('aboutProduct')) {
      showConfirmationMessage("error", "REQUIRED: Please provide short product description.!!")
      return false
    }
    if (!formData.get('productDetails')) {
      showConfirmationMessage("error", "REQUIRED: Please specify in detail,product details/description!!")
      return false
    }
    formData.append("category", selectedCategory)

    return true
  }

  const saveProduct = async (formData: FormData) => {
    if (validateInputs(formData)) {

      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Update!"
      }).then(async (result) => {
        if (result.isConfirmed) {
          const updateResult = await updateProduct(product._id, formData)
          console.log(updateResult);
          showToastMessage("success", "Product was successfully updated...")
        }
      });


    }
  }


  const handleImageChange = (e: any) => {
    const image = e.target.files[0];
    if (image) {
      setIcon(image);
      setIconPreview(URL.createObjectURL(image) as any);
    } else {
      setIconPreview(null);
    }
  };

  const uploadIcon = (e: any) => {
    e.preventDefault();
  };

  return (
    <section className="max-h-[700px]">
      <div className="flex items-center justify-end">
        <button className="hover:text-red-500 hover:scale-110 transition-all" onClick={() => setShowProductUpdateModal(false)}>
          <X />
        </button>
      </div>
      <h1 className=" text-xl font-extrabold my-4 bg-blue-950 text-white p-10">BUSINESS UPDATE</h1>
      <div className="border rounded-md p-3 ">
        <form action={saveProduct} className="flex flex-col gap-3">
          <h1 className="font-bold underline">
            Product Identification <span className="text-red-600">*</span>
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <InputText
              text="Product Name*"
              name="productName"
              placeholder=""
              required={false}
              type="text"
              defaultValue={product.productName}
            />
            <div className="items-center flex border-b">
              <DropdownMenu>
                <h1>
                  {"Category"} <span className="text-red-600">*</span>{" "}
                </h1>
                <DropdownMenuTrigger className="flex items-center">
                  {" "}
                  <span className=" outline-none ">
                    <ChevronDown />
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white" >
                  {categoriesList && categoriesList.map((category: any) => (
                    <DropdownMenuItem key={category._id}
                      onSelect={() => setSelectedCategory(category.name)}
                      onLoad={() => setSelectedCategory(product.category)}>
                      {category.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <div>
                {selectedCategory ? <h1 className="bg-green-500 text-white text-sm p-1 rounded">{selectedCategory}</h1> : (
                  <h1 className="p-1 bg-red-500 rounded text-white text-sm hidden md:flex">not selected</h1>
                )}
              </div>
            </div>
            <InputText
              text="Contact Person*"
              name="contactPerson"
              placeholder=""
              required={false}
              type="text"
              defaultValue={product.contactPerson}
            />
          </div>
          <h1 className="font-bold underline">
            Product Contacts <span className="text-red-600">*</span>
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <InputText
              text="Product Email*"
              name="productEmail"
              placeholder=""
              required={false}
              type="email"
              defaultValue={product.productEmail}
            />
            <InputText
              text="Phone Number*"
              name="productPhoneNumber"
              placeholder=""
              required={false}
              type="text"
              defaultValue={product.productPhoneNumber}
            />
            <InputText
              text="Alternative Number"
              name="productAlternativeNumber"
              placeholder=""
              required={false}
              type="text"
              defaultValue={product.productAlternativeNumber}
            />
          </div>

          <h1 className="font-bold underline">
            Product Premises/Address <span className="text-red-600">*</span>
          </h1>
          <div className=" p-3 border-b">
            <textarea
              name="productAddress"
              placeholder="product address..."
              className="w-full outline-none"
              defaultValue={product.productAddress}
            />
          </div>
          <h1 className="font-bold">
            About/Short Description <span className="text-red-600">*</span>
          </h1>
          <div className=" p-3 border-b">
            <InputText
              text="About Product*"
              name="aboutProduct"
              placeholder=""
              required={false}
              type="text"
              defaultValue={product.aboutProduct}
            />
          </div>
          <h1 className="font-bold underline">
            Details/Full description <span className="text-red-600">*</span>
          </h1>
          <div className=" p-3 border-b">
            <textarea
              name="productDetails"
              placeholder="product details..."
              className="w-full outline-none"
              defaultValue={product.productDetails}
            />
          </div>

          <div>
            <h1 className="font-bold">
              {" "}
              Face Image <span className="text-red-600">*</span>
            </h1>
            <div className="grid grid-cols-3 mb-8 gap-3">
              <div className=" col-span-2">
                <label
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="file_input"
                >
                  Image Icon
                </label>
                <input
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  aria-describedby="file_input_help"
                  id="file_input"
                  type="file"
                  name="categoryIcon"
                  accept="image/png, image/jpg, image/jpeg"
                  onChange={handleImageChange}
                />
                <p
                  className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                  id="file_input_help"
                >
                  PNG, JPG or JPEG.
                </p>
              </div>
              <div className="h-20 flex items-center justify-center w-full border py-4 rounded bg-gray-300 ">
                {iconPreview && (
                  <Image
                    src={iconPreview && iconPreview}
                    height={60}
                    width={60}
                    alt="icon"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-start gap-6">
            <Button className=" w-[30%] bg-blue-600 text-white hover:bg-blue-800 transition-all hover:text-lg rounded-[5px]">
              Update Product
            </Button>
            <Button type="button" className=" w-[30%] bg-red-600 text-white hover:bg-red-800 transition-all hover:text-lg rounded-[5px]" onClick={() => setShowProductUpdateModal(false)}>
              Cancel
            </Button>
          </div>
        </form>

        <div className="flex items-center mt-3 text-sm border-t py-1">
          <p>* = required field</p>
        </div>
      </div>
    </section>
  );
};

export default ProductUpdateForm;