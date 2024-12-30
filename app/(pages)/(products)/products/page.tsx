"use client"
import { useEffect, useState } from "react";
import ProductFilters from "@/components/products/ProductFilters";
import Loading from "@/app/loading";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { ShoppingCart, Star, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getAllProducts } from "@/app/_actions/_productsActions";
import ProductListSkeleton from "@/components/skeletons/ProductListSkeleton";

const MySwal = withReactContent(Swal);

export default function ProductList() {
    const { addToCart } = useCart();
    const [filters, setFilters] = useState({
        category: "",
        color: "",
        size: "",
        price: [0, 0],
    });
    const [products, setProducts] = useState([]);
    const [title] = useState("Product List");
    const { addToWishlist, removeFromWishlist, wishlist } = useWishlist();
    const [wishlistIds, setWishlistIds] = useState<string[]>(
        wishlist.map((item) => item.id)
    );
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 6;

    const getProducts = async () => {
        const products = await getAllProducts();
        setProducts(products);
    };

    useEffect(() => {
        getProducts();
    }, []);

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

    const handleToggleWishlist = (product: any) => {
        const isWished = wishlistIds.includes(product._id);

        if (isWished) {
            removeFromWishlist(product._id);
            setWishlistIds((prev) =>
                prev.filter((id) => id !== product._id)
            );
            MySwal.fire({
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
            MySwal.fire({
                title: "Success!",
                text: `${product.name} has been added to the wishlist`,
                icon: "success",
                confirmButtonText: "OK",
                timer: 2000,
            });
        }
    };

    const handleFilterChange = (newFilters: {
        category: string;
        color: string;
        size: string;
        price: number[];
    }) => {
        setFilters(newFilters);
        setCurrentPage(1); // Reset to the first page on filter change
    };

    const minPrice = Math.min(...products.map((product: any) => product.price));
    const maxPrice = Math.max(...products.map((product: any) => product.price));

    const filteredProducts = products.filter((product: any) => {
        const matchesCategory =
            !filters.category || product.category === filters.category;
        const matchesColor = !filters.color || product.color === filters.color;
        const matchesSize = !filters.size || product.size === filters.size;
        const matchesPrice =
            (filters.price[0] === 0 && filters.price[1] === 0) ||
            (product.price >= filters.price[0] &&
                product.price <= filters.price[1]);

        return (
            matchesCategory &&
            matchesColor &&
            matchesSize &&
            matchesPrice
        );
    });

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const productsToDisplay = filteredProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page); // Update page number
    };

    const isNewProduct = (createdAt: string) => {
        const createdDate = new Date(createdAt);
        const currentDate = new Date();
        const differenceInTime = currentDate.getTime() - createdDate.getTime();
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);
        return differenceInDays <= 30;
    };

    return (
        <main className="py-8">
            <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
                <h2 className="font-bold text-2xl sm:text-4xl text-[#51358C] mb-8 text-center">
                    {title}
                </h2>
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="w-full lg:w-1/4">
                        <ProductFilters
                            categories={Array.from(
                                new Set(
                                    products.map((product: any) => product.category)
                                )
                            )}
                            colors={Array.from(
                                new Set(products.map((product: any) => product.color))
                            )}
                            priceRange={{ min: minPrice, max: maxPrice }}
                            sizes={Array.from(
                                new Set(products.map((product: any) => product.size))
                            )}
                            onFilterChange={handleFilterChange}
                        />
                    </div>

                    <div className="w-full lg:w-3/4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {productsToDisplay.length > 0 ? (
                                productsToDisplay.map((product: any) => {
                                    const imageURL =
                                        product?.image !== "undefined"
                                            ? product.image
                                            : "./placeholder-image.jpg";
                                    const isWished = wishlistIds.includes(product._id);

                                    return (
                                        <div
                                            key={product._id}
                                            className="rounded-xl bg-slate-50 p-4 hover:shadow-xl transition-shadow duration-300"
                                        >
                                            <div className="relative">
                                                {isNewProduct(product.createdAt) && (
                                                    <span className="absolute z-10 top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                        New
                                                    </span>
                                                )}
                                                <Link href={`/products/${product._id}`}>
                                                    <div className="relative flex items-end overflow-hidden rounded-xl border-violet-200 border">
                                                        <Image
                                                            src={imageURL}
                                                            alt={product.name}
                                                            className="w-full h-64 object-cover rounded-xl"
                                                            width={250}
                                                            height={250}
                                                        />
                                                    </div>
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleToggleWishlist(product)
                                                    }
                                                    className="absolute top-3 right-3 rounded-full bg-white p-2 shadow-md hover:bg-red-200 transition duration-300"
                                                >
                                                    <Heart
                                                        className={`${
                                                            isWished
                                                                ? "text-red-600"
                                                                : "text-red-500"
                                                        } h-6 w-6`}
                                                        fill={isWished ? "red" : "none"}
                                                    />
                                                </button>
                                            </div>

                                            <div className="mt-3 px-2">
                                                <div className="flex flex-col justify-between">
                                                    <h2 className="text-[#0D0D0D] font-medium">
                                                        {product.name}
                                                    </h2>
                                                    <div className="left-3 inline-flex items-center">
                                                        {product.ratings === 0 ? (
                                                            <div className="flex">
                                                                <Star className="h-5 w-5 text-yellow-400" />
                                                                <span className="text-slate-400 ml-1 text-sm">
                                                                    {product.ratings}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            Array.from({
                                                                length: Math.round(
                                                                    product.ratings
                                                                ),
                                                            }).map((_, index) => (
                                                                <Star
                                                                    key={index}
                                                                    className="h-5 w-5 text-yellow-400"
                                                                />
                                                            ))
                                                        )}
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <p className="font-bold text-lg text-[#4F4F4F]">
                                                            R{product.price}
                                                        </p>
                                                        <button
                                                            onClick={() =>
                                                                handleAddToCart(product)
                                                            }
                                                            className="p-2 rounded-full bg-[#51358C] text-white hover:bg-[#3C2966] transition duration-300"
                                                        >
                                                            <ShoppingCart className="h-6 w-6" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <ProductListSkeleton />
                            )}
                        </div>

                        <div className="flex justify-center mt-6">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                                className="bg-[#51358C] text-white py-2 px-4 rounded-full mr-2 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="self-center">{`Page ${currentPage} of ${totalPages}`}</span>
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => handlePageChange(currentPage + 1)}
                                className="bg-[#51358C] text-white py-2 px-4 rounded-full ml-2 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
