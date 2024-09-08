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

  return (
    <section className="bg-violet-100">
      <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {productList.length > 0 ? (
            productList.map((product: any) => {
              let imageURL = "./placeholder-image.jpg";
              if (product?.image !== "undefined") {
                imageURL = product.image;
              }
              return (
                <div key={product._id} className="group relative bg-white p-4 border border-rounded rounded-md">
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md lg:aspect-none group-hover:opacity-75 lg:h-80">
                    <Image
                      src={imageURL} // Using imageURL to ensure fallback to placeholder image
                      alt={product.name}
                      height={240}
                      width={360}
                      className="h-auto w-auto object-cover object-center lg:h-75 lg:w-full"
                    />
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-sm text-gray-700">
                        <Link href={`/products/${product._id}`}>
                          <span aria-hidden="true" className="absolute inset-0" />
                          {product.name}
                        </Link>
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">M{product.price}</p>
                  </div>
                  <div className="flex justify-between gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="mt-2 bg-[#51358C] text-white text-sm p-1 py-2 rounded-md hover:bg-[#6943b9] transition-all ease-in-out w-full"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="mt-2 bg-[#51358C] text-white text-sm p-1 rounded-md hover:bg-[#6943b9] transition-all ease-in-out w-full"
                  >
                    Add to Wishlist
                  </button>
                  </div>
                  
                </div>
              );
            })
          ) : (
            <Loading />
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductList;
