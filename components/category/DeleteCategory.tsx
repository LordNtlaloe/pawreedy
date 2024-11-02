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
        if (searchParams) {
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
        <form action={deleteCategory} className='bg-white shadow-md rounded-lg p-6 border border-gray-300'>
            <h1 className='text-xl font-semibold text-center text-gray-800'>
                You are about to delete category: 
                <span className='font-bold text-lg text-red-600'> {categoryName}</span>
            </h1>
            <p className='bg-red-600 text-white p-3 text-center mt-4 rounded'>
                Please note that this action will affect all businesses associated with this category!
            </p>

            <h2 className='my-6 text-lg text-red-600 text-center'>Are you sure? Press the delete button to confirm!</h2>

            <div className="flex items-center justify-end gap-4 py-3 border-t border-gray-300">
                <button 
                    type='button' 
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded transition duration-200"
                    onClick={() => {
                        setCategoryID("");
                        setCategoryName("");
                        setShowCategoryDeleteModal(false);
                        router.push('/dashboard/categories');
                    }}>
                    Cancel
                </button>

                <button 
                    type='submit' 
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded transition duration-200">
                    Delete
                </button>
            </div>
        </form>
    );
};

export default DeleteCategory;
