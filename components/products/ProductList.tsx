"use client";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/app/loading";
import { useCart } from "@/apis/CartContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content"; // Optional for using React components inside alerts

type productProps = {
  productList: any;
  title: string;
};

const MySwal = withReactContent(Swal); // Optional but useful for React components

const ProductList = ({ productList, title }: productProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (product: any) => {
    try {
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
      });

      // Show success alert
      MySwal.fire({
        title: "Success!",
        text: `${product.name} has been added to the cart`,
        icon: "success",
        confirmButtonText: "OK",
        timer: 2000,
      });
    } catch (error) {
      // Show error alert
      Swal.fire({
        title: "Error!",
        text: "Failed to add the product to the cart",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  // Filter out products with unique _id
  const uniqueProducts = productList.filter(
    (product: any, index: number, self: any[]) =>
      index === self.findIndex((p: any) => p._id === product._id)
  );

  return (
    <main className="my-8">
      <div className="container mx-auto px-6">
        <h3 className="text-gray-700 text-2xl font-medium">{title}</h3>
        <span className="mt-3 text-sm text-gray-500">
          {uniqueProducts.length} Products
        </span>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
          {uniqueProducts.length > 0 ? (
            uniqueProducts.map((product: any) => {
              let imageURL = "./placeholder-image.jpg";
              if (product?.image !== "undefined") {
                imageURL = product.image;
              }
              return (
                <div
                  key={product._id}
                  className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden"
                >
                  <div
                    className="flex items-end justify-end h-56 w-full bg-cover"
                    style={{ backgroundImage: `url(${imageURL})` }}
                  >
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="p-2 rounded-full bg-violet-700 text-white mx-5 -mb-4 hover:bg-violet-500 focus:outline-none focus:bg-blue-500"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                    </button>
                  </div>
                  <div className="px-5 py-3">
                    <h3 className="text-gray-700 uppercase">{product.name}</h3>
                    <span className="text-gray-500 mt-2">M{product.price}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <Loading />
          )}
        </div>
      </div>
    </main>
  );
};

export default ProductList;
