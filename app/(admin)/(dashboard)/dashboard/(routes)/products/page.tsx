import { getAllProducts } from "@/app/_actions/_productsActions";
import { ProductsTable } from "@/components/products/ProductsTable/ProductsTable";
import { productTableColumns } from "@/components/products/ProductsTable/ProductColumns";


const getProducts = async () => {
  const data = await getAllProducts();
  return data;
};

const ProductsPage = async () => {
  const products = await getProducts();
  return (
    <section className="mx-1">
      <div className="">
        <div className="flex item-center justify-between mb-2">
          <h1 className="mb-3 md:text-3xl font-bold">Products</h1>
        </div>
        <div>
          <ProductsTable columns={productTableColumns} data={products} />
        </div>

      </div>

    </section>
  );
};

export default ProductsPage;