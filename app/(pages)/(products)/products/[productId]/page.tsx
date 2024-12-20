import ProductInfo from '@/components/products/ProductInfo';
import React from 'react';
import { headers as getHeaders } from 'next/headers';

type ProductPageProps = {
  params: { productId: string };
};

const ProductPage = async ({ params }: ProductPageProps) => {
  const { productId } = params;

  // Get headers if needed, you can remove this if not necessary for your logic
  const headers = await getHeaders();
  const contentSecurityPolicy = headers.get('Content-Security-Policy');

  return (
    <main>
      <h1 className="text-slate-800 my-4 text-center font-bold text-2xl mt-10">Product Info</h1>
      <ProductInfo id={productId} />
    </main>
  );
};

export default ProductPage;