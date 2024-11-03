'use client'

import React, { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import LoadingDialog from '../general/LoadingDialog'
import Image from 'next/image'
import { getAllCategories } from '@/app/_actions/_categoryActions'
import { showConfirmationMessage, showToastMessage } from '@/lib/GeneralFunctions'
import { updateProduct } from '@/app/_actions/_productsActions'
import Swal from 'sweetalert2'
import InputText from '@/components/general/InputText'
import { Button } from '@/components/ui/button'
import { getAllSizes } from '@/app/_actions/_sizeActions'

const UpdateProductForm = ({ product }: { product: any }) => {
  const [image, setImage] = useState(null)
  const [iconPreview, setImagePreview] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [categoryList, setCategoryList] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sizesList, setSizesList] = useState([])
  const [selectedSize, setSelectedSize] = useState('')

  const getCategoryList = async () => {
    const categories = await getAllCategories()
    setCategoryList(categories)
  }

  const getAllSizesList = async () => {
    const sizes = await getAllSizes()
    setSizesList(sizes)
  }

  useEffect(() => {
    getCategoryList()
    getAllSizesList()
  }, [])

  const validateInputs = (formData: FormData): boolean => {
    if (!formData.get('name')) {
      showConfirmationMessage('Error: ', 'Product Name Is Required')
      return false
    }
    if (!formData.get('description')) {
      showConfirmationMessage('Error: ', 'Product Description Is Required')
      return false
    }
    if (!formData.get('price')) {
      showConfirmationMessage('Error: ', 'Product Price Is Required')
      return false
    }
    if (!selectedCategory) {
      showConfirmationMessage('Error: ', 'Please Select A Category')
      return false
    }
    if (!selectedSize) {
      showConfirmationMessage('Error: ', 'Please Select A Size')
      return false
    }
    formData.append('category', selectedCategory)
    formData.append('size', selectedSize)
    return true
  }

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
          const updateResult = await updateProduct(product._id, formData)
          console.log(updateResult)
          showToastMessage('success', 'Product was successfully updated...')
        }
      })
    }
  }

  const handleImageChange = (e: any) => {
    const image = e.target.files[0]
    if (image) {
      setImage(image)
      setImagePreview(image)
    } else {
      setImagePreview(null)
    }
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); saveProduct(new FormData(e.currentTarget)) }}>
      <div className="space-y-12">
        <div className="p-2">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full">
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Product Name</label>
              <div className="mt-2">
                <InputText type="text" defaultValue={product?.name} name="name" id="name" placeholder="Product Name" className="block w-full border-1 border-violet-50 bg-transparent py-1.5 pl-1 text-gray-900" text={''} required={false} />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">Description</label>
              <div className="mt-2">
                <textarea id="description" name="description" defaultValue={product?.description} rows={3} className="block w-full rounded-md py-1.5 text-gray-900"></textarea>
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">Select A Category</label>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center">
                  <ChevronDown />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white">
                  {categoryList.map((category: any) => (
                    <DropdownMenuItem key={category._id} onSelect={() => setSelectedCategory(category.name)}>
                      {category.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="col-span-full">
              <label htmlFor="size" className="block text-sm font-medium leading-6 text-gray-900">Select A Size</label>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center">
                <span>{selectedSize}</span>
                <ChevronDown />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white">
                  {sizesList.map((size: any) => (
                    <DropdownMenuItem key={size._id} onSelect={() => setSelectedSize(size.name)}>
                      {size.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="col-span-full">
              <label htmlFor="quantity" className="block text-sm font-medium leading-6 text-gray-900">Quantity</label>
              <div className="mt-2">
                <InputText type="text" defaultValue={product?.quantity} name="quantity" id="quantity" placeholder="Product Quantity" className="block w-full border-0 bg-transparent py-1.5 pl-1 text-gray-900" text={''} required={false} />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">Price</label>
              <div className="mt-2">
                <InputText type="number" defaultValue={product?.price} name="price" id="price" placeholder="Product Price" className="block w-full border-0 bg-transparent py-1.5 pl-1 text-gray-900" text={''} required={false} />
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
      <Button className="mt-2 ml-2 bg-[#51358C] text-white hover:bg-[#6C548C]" disabled={isLoading} type="submit">
        {isLoading ? 'Updating Product' : 'Update Product'}
      </Button>
      {isLoading && <LoadingDialog open={false} message={''} />}
    </form>
  )
}

export default UpdateProductForm
