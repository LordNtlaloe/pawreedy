import ProductInfo from '@/components/products/ProductInfo';
import React from 'react';



const ProductPage = async ({ params } : { params: Promise<{ id: string }>}) => {
  const  productId  = (await params).id;

  return (
    <main>
      <h1 className="text-slate-800 my-4 text-center font-bold text-2xl mt-10">Product Info</h1>
      <ProductInfo id={productId} />
    </main>
  );
};

export default ProductPage;