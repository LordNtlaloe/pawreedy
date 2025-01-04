import ProductInfo from '@/components/products/ProductInfo'
import React from 'react'

const ProductPage = ({ params }: any) => {
  const id = params.productId as string

  return (
    <main>
      <ProductInfo id={id} />
    </main>
  )
}

export default ProductPage
