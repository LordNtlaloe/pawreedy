'use client'

import { getProductById } from "@/app/_actions/_productsActions"
import ProductUpdateForm from "@/components/products/UpdateProductForm"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const ProductActionsPage = () => {
    const searchParams = useSearchParams()

    const id = searchParams.get('id') as string
    const action = searchParams.get('action') as string
    const [product, setProduct] = useState({})

    const getProduct = async () => {
        const result = await getProductById(id)
        if (!result) {
            return null
        }
        setProduct(result)
    }

    useEffect(() => {
        getProduct()
    }, [])

    return (
        <main>
            {action === 'update info' ? (<div className=" max-w-4xl mx-auto my-5">
                <ProductUpdateForm product={product} />
            </div>) : null}
        </main>
    )
}

export default ProductActionsPage