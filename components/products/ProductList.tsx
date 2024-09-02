import { MapPin, ShoppingCart, Heart, Eye } from "lucide-react"; // Added Eye icon
import Image from "next/image";
import Link from "next/link";
import Loading from "@/app/loading";

type ProductProps = {
  productList: any[];
  title: string;
};

const ProductList = ({ productList, title }: ProductProps) => {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">{title}</h2>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {productList.length > 0 ? (
            productList.map((product: any) => (
              <Link key={product._id} href={`/products/${product._id}`} className="group">
                <div className="relative aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                  <Image
                    alt={product.name}
                    src={product.image || '/placeholder-image.jpg'}
                    className="h-full w-full object-cover object-center transition duration-300 ease-in-out group-hover:brightness-50"
                    layout="responsive"
                    height={400}
                    width={400}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 m-2 bg-white rounded-full shadow-lg hover:bg-gray-100">
                      <ShoppingCart size={24} className="text-gray-800" />
                    </button>
                    <button className="p-2 m-2 bg-white rounded-full shadow-lg hover:bg-gray-100">
                      <Heart size={24} className="text-gray-800" />
                    </button>
                    <button className="p-2 m-2 bg-white rounded-full shadow-lg hover:bg-gray-100">
                      <Eye size={24} className="text-gray-800" />
                    </button>
                  </div>
                </div>
                <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">${product.price}</p>
              </Link>
            ))
          ) : (
            <div className="flex justify-center items-center h-64">
              <Loading />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
