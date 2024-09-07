'use client'

import { useEffect, useState } from 'react'
import ProductUpdateForm from '../UpdateProductForm'
import Modal from '@/components/general/Modal'
import { getProductById } from '@/app/_actions/_productsActions'
import { useProductStore } from '@/lib/stores/productStore'


const UpdateProduct = ({ id }: { id: string }) => {
    const [product, setProduct] = useState({})
    const [isVisible, setIsVisible] = useState(true)
    const { showProductUpdateModal } = useProductStore()

    const getProduct = async () => {
        const result = await getProductById(id)
        setProduct(result)
    }
    useEffect(() => {
        getProduct()
    }, [id])
    return (
        <div>
            {showProductUpdateModal &&
                <Modal isVisible={isVisible} onClose={() => { }}>
                    <div className=''>
                        <ProductUpdateForm product={product} />
                    </div>
                </Modal>
            }
        </div>
    )
}

export default UpdateProduct