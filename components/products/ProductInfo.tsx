"use client";

import { getProductById } from "@/app/_actions/_productsActions";
import { MapPin, Star, ShoppingCart, Heart } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState, useCallback } from "react";
import { useCart } from "@/contexts/CartContext";
import Swal from "sweetalert2";
import DisplayRatings from "./DisplayRatings";
import ProductRatings from "./ProductRating";
import SimilarProducts from "./SimilarProducts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductInfoSkeleton } from "../skeletons/ProductInfoSkeleton";
import { useWishlist } from "@/contexts/WishlistContext";
import { FaStar } from "react-icons/fa";

export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  ratings: number;
  ratingsCount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  features: string[];
  sizes: string[];
  colors: string[];
  images: string[];
};

const ProductInfo = ({ id }: { id: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null); // State for the main image
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlist();
  const [wishlistIds, setWishlistIds] = useState<string[]>(wishlist.map(item => item.id));
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Fetch product data by id
  const getProduct = useCallback(async () => {
    if (id) {
      const productById = await getProductById(id);

      if (!productById) {
        console.error(`Product with ID ${id} not found.`);
        setIsLoaded(true); // Ensure the loading skeleton disappears
        return;
      }

      const serializedProduct = {
        _id: productById._id || "",
        name: productById.name,
        description: productById.description,
        price: productById.price,
        category: productById.category,
        quantity: productById.quantity,
        ratings: productById.ratings,
        ratingsCount: productById.ratingsCount,
        status: productById.status,
        createdAt: productById.createdAt?.toString() || "",
        updatedAt: productById.updatedAt?.toString() || "",
        features: productById.features || [],
        colors: productById.colors || [],
        sizes: productById.sizes || [],
        images: productById.images || [],
      };

      setProduct(serializedProduct);
      setMainImage(serializedProduct.images[0] || "/placeholder-image.jpg"); // Set the first image as default
      setIsLoaded(true);
    }
  }, [id]);


  useEffect(() => {
    getProduct();
  }, [getProduct]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize || !selectedColor) {
      Swal.fire({
        title: "Error!",
        text: "Please select a size and a color before adding to the cart.",
        icon: "error",
        confirmButtonText: "OK",
        timer: 2000,
      });
      return;
    }

    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      size: selectedSize,
      color: selectedColor,
      image: product.images[0],
    });

    Swal.fire({
      title: "Success!",
      text: `${product.name} has been added to the cart`,
      icon: "success",
      confirmButtonText: "OK",
      timer: 2000,
    });
  };


  const handleToggleWishlist = (product: any) => {
    const isWished = wishlistIds.includes(product._id);

    if (isWished) {
      removeFromWishlist(product._id);
      setWishlistIds((prev) => prev.filter(id => id !== product._id));
      Swal.fire({
        title: "Removed!",
        text: `${product.name} has been removed from the wishlist`,
        icon: "info",
        confirmButtonText: "OK",
        timer: 2000,
      });
    } else {
      addToWishlist({
        id: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
      });
      setWishlistIds((prev) => [...prev, product._id]);
      Swal.fire({
        title: "Success!",
        text: `${product.name} has been added to the wishlist`,
        icon: "success",
        confirmButtonText: "OK",
        timer: 2000,
      });
    }
  };

  const handleImageChange = () => {

  }

  if (!isLoaded || !product) {
    return <ProductInfoSkeleton />;
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full md:w-1/2 px-4 mb-8">
            <img src={mainImage || ""} alt="Product"
              className="w-full h-auto rounded-lg shadow-md mb-4" id="mainImage" />
            <div className="flex gap-4 py-4 justify-center overflow-x-auto">
              {product.images?.map((img, index) => (
                <img
                  key={index + 1}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-16 sm:w-20 object-cover rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300"
                  onClick={() => setMainImage(img)} // Update main image when thumbnail clicked
                />
              ))}
            </div>
          </div>

          <div className="w-full md:w-1/2 px-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
              <p className="text-sm text-gray-500 mt-2 font-bold">
                Category: <span className="text-[#8C142A] font-normal">{product.category}</span>
              </p>
              <p className="text-sm text-gray-500 mt-2 font-bold">
                Availability: <span className="text-green-600 font-normal">{product.status}</span>
              </p>

              <hr className="my-6" />

              <div className="flex flex-col lg:flex-row gap-4">
                <div>
                  <p className="text-gray-800 text-3xl font-bold">M{product?.price}</p>
                </div>

                <div className="flex flex-wrap gap-4 lg:ml-auto">
                  <button
                    type="button"
                    className="px-2.5 py-1.5 bg-pink-100 text-xs text-pink-600 rounded-md flex items-center"
                  >
                    <Heart className="w-4 h-4 mr-1" />
                    {0}
                  </button>
                  <button
                    type="button"
                    className="px-2.5 py-1.5 bg-gray-100 text-xs text-gray-800 rounded-md flex items-center"
                  >
                    <Star className="w-4 h-4 mr-1" />
                    {product?.ratings || 0} ({product?.ratingsCount || 0} reviews)
                  </button>
                </div>
              </div>

              <hr className="my-6" />
              <div>
                <h3 className="text-xl font-bold text-gray-800">Choose A Size</h3>
                <div className="flex flex-wrap gap-4 mt-4">
                  {product.sizes?.map((size, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`w-10 h-10 border rounded-md text-sm font-semibold ${selectedSize === size ? "bg-gray-800 text-white" : "hover:border-gray-800"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {selectedSize && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected Size: <span className="font-semibold">{selectedSize}</span>
                  </p>
                )}
              </div>

              <hr className="my-6" />

              <div>
                <h3 className="text-xl font-bold text-gray-800">Choose A Color</h3>
                <div className="flex flex-wrap gap-4 mt-4">
                  {product.colors?.map((color, index) => {
                    const colorClass = ["black", "white"].includes(color.toLowerCase())
                      ? color.toLowerCase()
                      : `${color.toLowerCase()}-500`;

                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`w-10 h-10 border rounded-md ${selectedColor === color ? "border-gray-800" : "hover:border-gray-800"
                          } bg-${colorClass}`}
                      ></button>
                    );
                  })}
                </div>
                {selectedColor && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected Color: <span className="font-semibold">{selectedColor}</span>
                  </p>
                )}
              </div>

              <hr className="my-6" />

              <div>
                <h3 className="text-lg font-semibold mb-2">Key Features:</h3>
                <ul className="list-disc list-inside text-gray-700">
                  {product.features?.map((feature, index) => (

                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              <hr className="my-6" />

              <div>
                <p className="text-gray-800 text-sm py-3 cursor-pointer transition-all">
                  {product?.description}
                </p>
                <hr className="my-6" />
              </div>
              <div className="flex flex-col lg:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="bg-[#51358C] hover:bg-[#54329c] text-white text-sm leading-6 font-medium py-2 px-3 rounded-lg flex items-center justify-center w-full lg:w-auto"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </button>
                <button
                  onClick={handleAddToCart}
                  className="bg-[#51358C] hover:bg-[#54329c] text-white text-sm leading-6 font-medium py-2 px-3 rounded-lg flex items-center justify-center w-full lg:w-auto"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Tabs defaultValue="similar-products" className="text-[#0D0D0D] mt-8">
        <TabsList className="w-full border border-1 border-[#51358C]">
          <TabsTrigger value="similar-products" className="text-[#51358C]">Similar Products</TabsTrigger>
          <TabsTrigger value="ratings">Ratings</TabsTrigger>
        </TabsList>
        <TabsContent value="similar-products" className="w-full mt-4">
          <SimilarProducts category={product?.category} currentProductId={product._id} />
        </TabsContent>
        <TabsContent value="ratings" className="w-full mt-4">
          <div className="mx-4">
            <DisplayRatings productId={product._id} />
            <ProductRatings isReadOnly={false} isEnabled={true} product={product} />
          </div>
        </TabsContent>
      </Tabs>
    </div>

  );
};

export default ProductInfo;
