"use client";

import { deleteOneCategory } from '@/app/_actions/_categoryActions';
import { showToastMessage } from '@/lib/GeneralFunctions';
import { useCategoryStore } from '@/lib/stores/categoryStore';
import { revalidatePath } from 'next/cache';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const DeleteCategory = () => {
    const router = useRouter();
    const { showCategoryDeleteModal, setShowCategoryDeleteModal, categoryId, categoryName, setCategoryID, setCategoryName } = useCategoryStore();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams) { // Check if searchParams exists
            const id = searchParams.get('id') as string;
            const name = searchParams.get('name') as string;
            setCategoryID(id);
            setCategoryName(name);
            setShowCategoryDeleteModal(true);
        }
    }, [searchParams, setCategoryID, setCategoryName, setShowCategoryDeleteModal]);

    const deleteCategory = async () => {
        const deleted = await deleteOneCategory(categoryId);
        if (deleted) {
            showToastMessage("info", "Category was deleted from the system!");
            setCategoryID("");
            setCategoryName("");
            setShowCategoryDeleteModal(false);
            router.push('/dashboard/categories');
        }
    };

    return (
        <form action={deleteCategory} className='border rounded p-4'>
            <h1 className='text-center'>You are about to delete category: <span className='font-bold text-lg text-red-600'>{categoryName}</span></h1>
            <p className='bg-red-600 text-white p-3 text-center mt-4'>Please note that this action will affect all business with this category!!!</p>

            <h1 className='my-6 text-red-600'>Are you sure? Press delete button to confirm!</h1>

            <div className="flex items-center justify-end gap-4 py-3 border-t">
                <button type='button' className="bg-blue-600 px-6 text-white py-1" onClick={() => {
                    setCategoryID("");
                    setCategoryName("");
                    setShowCategoryDeleteModal(false);
                    router.push('/dashboard/categories');
                }}>Cancel</button>

                <button type='submit' className="bg-red-600 text-white px-6 rounded py-1">
                    Delete
                </button>
            </div>
        </form>
    );
};

export default DeleteCategory;
