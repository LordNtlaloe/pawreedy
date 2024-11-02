'use client'
import UpdateProductForm from '@/components/products/UpdateProductForm'
import Modal from '@/components/general/Modal'
import { useProductStore } from '@/lib/stores/productStore'
import { useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

const UpdateProductPage = () => {
    const {setShowProductUpdateModal, showProductUpdateModal} = useProductStore()
    const searchParams = useSearchParams()
    const id = searchParams?.get('id') as string | null
    const name = searchParams?.get('name') as string | null

    useEffect(() => {
        if (id && name) {
            setShowProductUpdateModal(true)
        }
    }, [setShowProductUpdateModal])

    return (
        <main className='h-20 flex items-center justify-center'>
            <h1 className='text-xl font-bold '>UPDATING CATEGORY...</h1>
            {id &&
                <div>
                    <Modal isVisible={showProductUpdateModal} onClose={() => setShowProductUpdateModal(false)}>
                        <UpdateProductForm />
                    </Modal>
                </div>
            }
        </main>
    )
}

export default UpdateProductPage
