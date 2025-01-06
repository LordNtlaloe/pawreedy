'use client'

import { Plus } from 'lucide-react'
import React, { useState } from 'react'
import Modal from '../general/Modal'
import NewCategoryForm from './NewCategoryForm'
import { useCategoryStore } from '@/lib/stores/categoryStore'

const AddNewCategoryButton = () => {

    const { showAddNewCategoryModal, setShowNewCategoryModal } = useCategoryStore()
    return (
        <main>
            <div className="bg-violet-800 text-white flex p-1 px-3 rounded hover:cursor-pointer hover:bg-violet-950 items-center" onClick={() => setShowNewCategoryModal(true)}>
                <Plus /> add new
            </div>
            <Modal isVisible={showAddNewCategoryModal} onClose={() => setShowNewCategoryModal(false)}>
                <NewCategoryForm />
            </Modal>
        </main>
    )
}

export default AddNewCategoryButton