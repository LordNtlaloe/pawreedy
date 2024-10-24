import { useState } from "react";
import ProductFilters from "./ProductFilters";
import Loading from "@/app/loading";
import { useCart } from "@/apis/CartContext";
import { addToWishlist } from "@/lib/wishlist";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { ShoppingCart, Star, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type ProductProps = {
  productList: any[];
  title: string;
};

const MySwal = withReactContent(Swal);

export default function ProductList({ productList, title }: ProductProps) {
  const { addToCart } = useCart();
  const [filters, setFilters] = useState({ category: "", color: "", size: "", price: [0, 0] });

  const handleAddToCart = (product: any) => {
    try {
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
      });

      MySwal.fire({
        title: "Success!",
        text: `${product.name} has been added to the cart`,
        icon: "success",
        confirmButtonText: "OK",
        timer: 2000,
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to add the product to the cart",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  const handleFilterChange = (newFilters: { category: string; color: string; size: string; price: number[] }) => {
    setFilters(newFilters);
  };

  const filteredProducts = productList.filter((product: any) => {
    const matchesCategory = !filters.category || product.category === filters.category;
    const matchesColor = !filters.color || product.color === filters.color;
    const matchesSize = !filters.size || product.size === filters.size;
    const matchesPrice = (filters.price[0] === 0 && filters.price[1] === 0) ||
      (product.price >= filters.price[0] && product.price <= filters.price[1]);
  
    console.log({
      product,
      matchesCategory,
      matchesColor,
      matchesSize,
      matchesPrice,
    });
  
    return matchesCategory && matchesColor && matchesSize && matchesPrice;
  });
  
  console.log("Filtered Products:", filteredProducts);
  

  const uniqueProducts = filteredProducts.filter(
    (product: any, index: number, self: any[]) =>
      index === self.findIndex((p: any) => p._id === product._id)
  );
  console.log("Unique Products:", uniqueProducts);
  

  const categories = Array.from(new Set(productList.map((product: any) => product.category))) as string[];
  const colors = Array.from(new Set(productList.map((product: any) => product.color))) as string[];
  const sizes = Array.from(new Set(productList.map((product: any) => product.size))) as string[];
  const prices = Array.from(new Set(productList.map((product: any) => product.price))) as number[];

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return (
    <main className="py-8 bg-white rounded-lg">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <h2 className="font-manrope font-bold text-2xl sm:text-4xl text-violet-900 mb-8 text-center">
          {title}
        </h2>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-1/4">
            <ProductFilters
              categories={categories}
              colors={colors}
              priceRange={{ min: minPrice, max: maxPrice }}
              sizes={sizes}
              onFilterChange={handleFilterChange}
            />
          </div>

          <div className="w-full lg:w-3/4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {uniqueProducts.length > 0 ? (
                uniqueProducts.map((product: any) => {
                  const imageURL = product?.image !== "undefined" ? product.image : "./placeholder-image.jpg";
                  return (
                    <div key={product._id} className="rounded-xl bg-white p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <div className="relative">
                        <Link href={`/products/${product._id}`}>
                          <div className="relative flex items-end overflow-hidden rounded-xl border-violet-200 border">
                            <Image
                              src={imageURL}
                              alt={product.name}
                              className="w-full h-64 object-fit rounded-xl"
                              width={250}
                              height={250}
                            />
                            <div className="absolute bottom-3 left-3 inline-flex items-center rounded-lg bg-white p-2 shadow-md">
                              <Star className="h-5 w-5 text-yellow-400" />
                              <span className="text-slate-400 ml-1 text-sm">4.9</span>
                            </div>
                          </div>
                        </Link>
                        <button
                          onClick={() => addToWishlist(product)}
                          className="absolute top-3 right-3 rounded-full bg-white p-2 shadow-md hover:bg-red-200 transition duration-300"
                        >
                          <Heart className="h-6 w-6 text-red-500 hover:text-red-600" />
                        </button>
                      </div>

                      <div className="mt-3 px-2">
                        <h2 className="text-slate-700 font-medium">{product.name}</h2>
                        <p className="text-slate-400 mt-1 text-sm">{product.category}</p>
                        <div className="mt-3 flex items-end justify-between">
                          <p>
                            <span className="text-lg font-bold text-violet-500">
                              M{product.price}
                            </span>
                          </p>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="group inline-flex rounded-xl bg-blue-100 p-2 hover:bg-blue-200 transition-colors duration-300"
                          >
                            <ShoppingCart className="group-hover:text-violet-700 h-4 w-4 text-violet-800" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <Loading />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
