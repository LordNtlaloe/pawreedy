"use client";


import { updateCategory } from "@/app/_actions/_categoryActions";
import { useState } from "react";

import InputText from "../general/InputText";
import { showConfirmationMessage, showToastMessage } from "@/lib/GeneralFunctions";
import { BeatLoader, ClipLoader } from "react-spinners";
import { useCategoryStore } from "@/lib/stores/categoryStore";
import { redirect, useRouter } from "next/navigation";

const UpdateCategoryForm = () => {

  const [isLoading, setIsLoading] = useState(false);
  const { showUpdateCategoryModal, setShowUpdateCategoryModal, categoryId, categoryName, setCategoryID, setCategoryName } = useCategoryStore()
  const router = useRouter()
 
  const saveCategoryUpdate = async (formData: FormData) => {

    const newName = formData.get("categoryName")
    if (!newName) {
      showConfirmationMessage("error", "Category name is required!")
      return
    }
    if (newName === categoryName) {
      showConfirmationMessage("warning", "Category name has not changed!")
      return
    }

    setIsLoading(true)

    const updatedCategory = await updateCategory(categoryId, newName as string)
    if (updatedCategory) {
      showToastMessage("success", "Category saved successfully updated...")
      setCategoryID("")
      setCategoryName("")
      setShowUpdateCategoryModal(false)
      router.push('/dashboard/categories')
    } else {
      setIsLoading(false)
      showConfirmationMessage("error", `An error occured updating category! ${updateCategory}`)
    }

    setIsLoading(false)

  };
  return (
    <main className="">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="font-bold">Saving Category</h1>
          <BeatLoader color="#0a09f5" size={30} />
          <p className="font-semibold text-sm">please wait...</p>
        </div>
      ) : (
        <form action={(formData: FormData) => {
          setIsLoading(true)
          saveCategoryUpdate(formData)
          setIsLoading(false)
        }

        } className="">

          <div className="flex flex-col">
            <h1 className="text-lg font-semibold py-4 border-b mb-4">UPDATE CATEGORY</h1>
            <div>
              <InputText
                text="Category Name"
                name="categoryName"
                placeholder=""
                required={false}
                type="text"
                defaultValue={categoryName}
              />

            </div>

          </div>

          {/* Image preview */}

          <div className="flex items-center justify-end gap-4 py-3 border-t">
            <button className="bg-blue-600 px-6 text-white py-1 ">
              Update
            </button>

            <button type="button" className="bg-red-600 text-white px-6 rounded py-1" onClick={() => {
              setShowUpdateCategoryModal(false)
              setCategoryID("")
              setCategoryName("")
              router.push('/dashboard/categories')
            }}>
              Cancel
            </button>

          </div>

        </form>
      )}
    </main>
  );
};

export default UpdateCategoryForm;