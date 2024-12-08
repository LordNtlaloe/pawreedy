import ProductInfo from '@/components/products/ProductInfo';
import React from 'react';
import { headers as getHeaders } from 'next/headers';

const ProductPage = async ({ params }: { params: { productId: string } }) => {
  const { productId } = params;
  const headers = await getHeaders(); // Rename the imported function
  const contentSecurityPolicy = headers.get('Content-Security-Policy');

  return (
    <main>
      <h1 className='text-slate-800 my-4 text-center font-bold text-2xl mt-10'>Product Info</h1>
      <ProductInfo id={productId} />
    </main>
  );
};

export default ProductPage;
