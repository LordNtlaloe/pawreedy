'use client'

import { useEffect, useState, useCallback } from 'react';
import ProductUpdateForm from '../UpdateProductForm';
import Modal from '@/components/general/Modal';
import { getProductById } from '@/app/_actions/_productsActions';
import { useProductStore } from '@/lib/stores/productStore';

const UpdateProduct = ({ id }: { id: string }) => {
    const [product, setProduct] = useState<any>({});
    const [isVisible, setIsVisible] = useState(true);
    const { showProductUpdateModal } = useProductStore();

    // Define getProduct inside useCallback to avoid unnecessary re-renders
    const getProduct = useCallback(async () => {
        const result = await getProductById(id);
        setProduct(result);
    }, [id]); // Dependency array includes `id`

    useEffect(() => {
        getProduct();
    }, [getProduct]); // Dependency array includes `getProduct`
    console.log(product)
    return (
        <div>
            {showProductUpdateModal &&
                <Modal isVisible={isVisible} onClose={() => setIsVisible(false)}>
                    <div className=''>
                        <ProductUpdateForm product={product} />
                    </div>
                </Modal>
            }
        </div>
    );
};

export default UpdateProduct;
