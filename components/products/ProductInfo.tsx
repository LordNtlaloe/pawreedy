"use client";
import { getProductById } from "@/app/_actions/_productsActions";
import { MapPin, Star, ShoppingCart, Heart } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useCart } from "@/apis/CartContext";
import Swal from "sweetalert2";
import DisplayRatings from "./DislayRatings";
import ProductRatings from "./ProductRating";
import SimilarProducts from "./SimilarProducts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


const ProductInfo = ({ id }: { id: string }) => {
const [isLoaded, setIsLoaded] = useState(false);
const [product, setProduct] = useState<any>({});
  const { addToCart } = useCart();
  let imageURL = "/placeholder-image.jpg";
  if (product?.image !== "undefined") {
  imageURL = product.image;
  }
  useEffect(() => {
  setIsLoaded(true);
  id && getProduct();
  }, [id]);

  const getProduct = async () => {
  const productById = await getProductById(id);
  setProduct(productById);
  };

  const handleAddToCart = () => {
  try {
  addToCart({
  id: product._id,
  name: product.name,
  price: product.price,
  quantity: 1,
  image: product.image,
  });

  Swal.fire({
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

  if (!isLoaded) return null;

  return (
  <div className="">
    <div className="mx-20 mt-10 mb-5">
      <div className="grid items-start grid-cols-1 lg:grid-cols-2 gap-8 max-lg:gap-16 mb-20 pb-20">
        <div className="w-full lg:sticky top-0 text-center">
          <div className="lg:h-[560px]">
            <Image src={imageURL} alt={product?.name || "Product Image" } width={800} height={120}
              className="lg:w-11/12 w-full h-full rounded-md object-cover object-top shadow-sm shadow-violet-700" />
          </div>

          <div className="flex flex-wrap gap-4 justify-center mx-auto mt-4">
            <Image src={imageURL} alt="Product thumbnail" width={64} height={64}
              className="w-16 cursor-pointer rounded-md shadow-sm shadow-violet-700" />
          </div>
        </div>

        <div>
          <div className="flex items-start gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
              <p className="text-sm text-gray-500 mt-2 w-100">Category: {product.category}</p>
              <p className="text-sm text-gray-500 mt-2 w-100">Availability: {product.status}</p>
            </div>
          </div>

          <hr className="my-8" />

          <div className="flex flex-wrap gap-4 items-start">
            <div>
              <p className="text-gray-800 text-4xl font-bold">M{product?.price}</p>
            </div>

            <div className="flex flex-wrap gap-4 ml-auto">
              <button type="button"
                className="px-2.5 py-1.5 bg-pink-100 text-xs text-pink-600 rounded-md flex items-center">
                <Heart className="w-4 h-4 mr-1" />
                {product?.wishlistCount || 100}
              </button>
              <button type="button"
                className="px-2.5 py-1.5 bg-gray-100 text-xs text-gray-800 rounded-md flex items-center">
                <Star className="w-4 h-4 mr-1" />
                {product?.ratingsAverage || 0} ({product?.ratingsCount || 0} reviews)
              </button>
            </div>
          </div>

          <hr className="my-8" />

          <div>
            <h3 className="text-xl font-bold text-gray-800">Choose A Size</h3>
            <div className="flex flex-wrap gap-4 mt-4">
              <button type="button"
                className="w-10 h-10 border hover:border-gray-800 font-semibold text-sm rounded-md flex items-center justify-center shrink-0">SM</button>
              <button type="button"
                className="w-10 h-10 border hover:border-gray-800 border-gray-800 font-semibold text-sm rounded-md flex items-center justify-center shrink-0">MD</button>
              <button type="button"
                className="w-10 h-10 border hover:border-gray-800 font-semibold text-sm rounded-md flex items-center justify-center shrink-0">LG</button>
              <button type="button"
                className="w-10 h-10 border hover:border-gray-800 font-semibold text-sm rounded-md flex items-center justify-center shrink-0">XL</button>
            </div>
          </div>

          <hr className="my-8" />

          <div>
            <h3 className="text-xl font-bold text-gray-800">Choose A Color</h3>
            <div className="flex flex-wrap gap-4 mt-4">
              <button type="button"
                className="w-10 h-10 bg-black border border-white hover:border-gray-800 rounded-md shrink-0"></button>
              <button type="button"
                className="w-10 h-10 bg-gray-400 border border-white hover:border-gray-800 rounded-md shrink-0"></button>
              <button type="button"
                className="w-10 h-10 bg-orange-400 border border-white hover:border-gray-800 rounded-md shrink-0"></button>
              <button type="button"
                className="w-10 h-10 bg-red-400 border border-white hover:border-gray-800 rounded-md shrink-0"></button>
            </div>
          </div>
          <hr className="my-8" />
          <div className="">
            <p>Description</p>
            <p className="text-gray-800 font-semibold text-sm py-3 cursor-pointer transition-all">
              {product?.description}</p>
            <hr className="my-8" />
          </div>

          <div className="flex flex-row gap-4">
            <button onClick={handleAddToCart}
              className="bg-[#51358C] hover:bg-[#6845b4] text-white text-sm leading-6 font-medium py-2 px-3 rounded-lg flex items-center justify-center w-full">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </button>
            <button onClick={handleAddToCart}
              className="bg-[#51358C] hover:bg-[#6845b4] text-white text-sm leading-6 font-medium py-2 px-3 rounded-lg flex items-center justify-center w-full">
              <Heart className="w-5 h-5 mr-2" />
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="similar-products" className="text-[#51358C] mt-4">

        <TabsList className="w-[100%] border border-1 border-[#51358C]">
          <TabsTrigger value="similar-products" className="text-[#51358C]">Similar Products</TabsTrigger>
          <TabsTrigger value="ratings">Ratings</TabsTrigger>
        </TabsList>
        <TabsContent value="similar-products" className="w-[100%]">
          <SimilarProducts />
        </TabsContent>
        <TabsContent value="ratings" className="w-[100%]">
          <DisplayRatings productId={product._id} />
          <ProductRatings isReadOnly={false} isEnabled={false} />
        </TabsContent>
      </Tabs>
    </div>
  </div>
  );
  };

  export default ProductInfo;