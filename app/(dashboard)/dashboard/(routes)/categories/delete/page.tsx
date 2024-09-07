'use client'

import DeleteCategory from '@/components/category/DeleteCategory'
import Modal from '@/components/general/Modal'
import { useCategoryStore } from '@/lib/Stores/categoryStore'
import { useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

const DeleteCategoryPage = () => {

    const { showCategoryDeleteModal, setShowCategoryDeleteModal, setCategoryID, setCategoryName } = useCategoryStore()
    const seachParams = useSearchParams()
    const id = seachParams.get('id') as string
    const name = seachParams.get('name') as string


    useEffect(() => {
        setCategoryID(id)
        setCategoryName(name)
        setShowCategoryDeleteModal(true)
    }, [])
    return (
        <main>
            {id && (
                <Modal isVisible={showCategoryDeleteModal} onClose={() => setShowCategoryDeleteModal(false)} >
                    <DeleteCategory />
                </Modal>
            )}
        </main>
    )
}

export default DeleteCategoryPage