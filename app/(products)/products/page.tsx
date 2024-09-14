
'use client'

import { useState, useEffect, useCallback } from 'react'
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'
import { getAllCategories } from '@/app/_actions/_categoryActions'
import { getAllProducts, getAllProductsByCategory } from '@/app/_actions/_productsActions'
import Image from "next/image";
import { useCart } from "@/apis/CartContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Loading from '@/app/loading'
import { Link } from 'lucide-react'
import CategoriesMenu from '@/components/category/CategoriesMenu'

const sortOptions = [
    { name: 'Most Popular', href: '#', current: true },
    { name: 'Best Rating', href: '#', current: false },
    { name: 'Newest', href: '#', current: false },
    { name: 'Price: Low to High', href: '#', current: false },
    { name: 'Price: High to Low', href: '#', current: false },
]
const filters = [
    {
        id: 'color',
        name: 'Color',
        options: [
            { value: 'white', label: 'White', checked: false },
            { value: 'beige', label: 'Beige', checked: false },
            { value: 'blue', label: 'Blue', checked: true },
            { value: 'brown', label: 'Brown', checked: false },
            { value: 'green', label: 'Green', checked: false },
            { value: 'purple', label: 'Purple', checked: false },
        ],
    },
    {
        id: 'category',
        name: 'Category',
        options: [
            { value: 'new-arrivals', label: 'New Arrivals', checked: false },
            { value: 'sale', label: 'Sale', checked: false },
            { value: 'travel', label: 'Travel', checked: true },
            { value: 'organization', label: 'Organization', checked: false },
            { value: 'accessories', label: 'Accessories', checked: false },
        ],
    },
    {
        id: 'size',
        name: 'Size',
        options: [
            { value: '2l', label: '2L', checked: false },
            { value: '6l', label: '6L', checked: false },
            { value: '12l', label: '12L', checked: false },
            { value: '18l', label: '18L', checked: false },
            { value: '20l', label: '20L', checked: false },
            { value: '40l', label: '40L', checked: true },
        ],
    },
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

interface Product {
    _id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    createdAt: string;
    // Add any other necessary fields
}

const MySwal = withReactContent(Swal);

export default function Example() {
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [products, setProducts] = useState<Product[]>([]);
    const [sortedProducts, setSortedProducts] = useState<Product[]>([]);
    const [sortOption, setSortOption] = useState<string>('latest');
    const [loading, setLoading] = useState(true);


    const fetchProducts = async () => {
        const products = await getAllProducts();
        return products || []; // Return the products to use them in fetchProductsByCategory
    };

    const fetchCategories = async () => {
        const categoryData = await getAllCategories();
        setCategories(categoryData || []); // Fallback to an empty array if no categories
    };

    const fetchProductsByCategory = useCallback(async (category: string) => {
        setLoading(true);
        try {
            let fetchedProducts = category === 'All' ? await fetchProducts() : await getAllProductsByCategory(category);
            setProducts(fetchedProducts || []);
        } finally {
            setLoading(false);
        }
    }, []);
    

    useEffect(() => {
        fetchCategories();
        fetchProductsByCategory(selectedCategory);
    }, [selectedCategory, fetchProductsByCategory]);
        
    const handleSort = useCallback(() => {
        let sorted = [...products];
        if (sortOption === 'latest') {
            sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (sortOption === 'price-asc') {
            sorted.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'price-desc') {
            sorted.sort((a, b) => b.price - a.price);
        }
        setSortedProducts(sorted);
    }, [sortOption, products]);
    
    useEffect(() => {
        handleSort();
    }, [handleSort]);


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

            MySwal.fire({
                title: 'Success!',
                text: `${product.name} has been added to the cart`,
                icon: 'success',
                confirmButtonText: 'OK',
                timer: 2000,
            });
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'Failed to add the product to the cart',
                icon: 'error',
                confirmButtonText: 'Try Again',
            });
        }
    };

    return (
        <div className="bg-white">
            <div>
                {/* Mobile filter dialog */}
                <Dialog open={mobileFiltersOpen} onClose={setMobileFiltersOpen} className="relative z-40 lg:hidden">
                    <DialogBackdrop
                        transition
                        className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
                    />

                    <div className="fixed inset-0 z-40 flex">
                        <DialogPanel
                            transition
                            className="relative ml-auto flex h-full w-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full"
                        >
                            <div className="flex items-center justify-between px-4">
                                <h2 className="text-lg font-medium text-violet-900">Filters</h2>
                                <button
                                    type="button"
                                    onClick={() => setMobileFiltersOpen(false)}
                                    className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-violet-400"
                                >
                                    <span className="sr-only">Close menu</span>
                                    <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Filters */}
                            <form className="mt-2 border-t border-violet-200">
                                <h3 className="sr-only">Categories</h3>
                                <CategoriesMenu categories={categories} />
                                {filters.map((section) => (
                                    <Disclosure key={section.id} as="div" className="border-t border-violet-200 px-4 py-6">
                                        <h3 className="-mx-2 -my-3 flow-root">
                                            <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-violet-400 hover:text-gray-600">
                                                <span className="font-medium text-violet-900">{section.name}</span>
                                                <span className="ml-6 flex items-center">
                                                    <PlusIcon aria-hidden="true" className="h-5 w-5 group-data-[open]:hidden" />
                                                    <MinusIcon aria-hidden="true" className="h-5 w-5 [.group:not([data-open])_&]:hidden" />
                                                </span>
                                            </DisclosureButton>
                                        </h3>
                                        <DisclosurePanel className="pt-6">
                                            <div className="space-y-6">
                                                {section.options.map((option, optionIdx) => (
                                                    <div key={option.value} className="flex items-center">
                                                        <input
                                                            defaultValue={option.value}
                                                            defaultChecked={option.checked}
                                                            id={`filter-mobile-${section.id}-${optionIdx}`}
                                                            name={`${section.id}[]`}
                                                            type="checkbox"
                                                            className="h-4 w-4 rounded border-violet-300 text-indigo-600 focus:ring-indigo-500"
                                                        />
                                                        <label
                                                            htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                                            className="ml-3 min-w-0 flex-1 text-gray-600"
                                                        >
                                                            {option.label}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </DisclosurePanel>
                                    </Disclosure>
                                ))}
                            </form>
                        </DialogPanel>
                    </div>
                </Dialog>

                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-baseline justify-between border-b border-violet-200 pb-6 pt-24">
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900">Products</h1>

                        <div className="flex items-center">
                            <Menu as="div" className="relative inline-block text-left">
                                <div>
                                    <MenuButton className="group inline-flex justify-center text-sm font-medium text-slate-700 hover:text-violet-900">
                                        Sort
                                        <ChevronDownIcon
                                            aria-hidden="true"
                                            className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-gray-600"
                                        />
                                    </MenuButton>
                                </div>

                                <MenuItems
                                    transition
                                    className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                >
                                    <div className="py-1">
                                        {sortOptions.map((option) => (
                                            <MenuItem key={option.name}>
                                                <p
                                                    className={classNames(
                                                        option.current ? 'font-medium text-slate-900' : 'text-slate-600',
                                                        'block px-4 py-2 text-sm data-[focus]:bg-slate-100',
                                                    )}
                                                >
                                                    {option.name}
                                                </p>
                                            </MenuItem>
                                        ))}
                                    </div>
                                </MenuItems>
                            </Menu>

                            <button type="button" className="-m-2 ml-5 p-2 text-slate-400 hover:text-slate-600 sm:ml-7">
                                <span className="sr-only">View grid</span>
                                <Squares2X2Icon aria-hidden="true" className="h-5 w-5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setMobileFiltersOpen(true)}
                                className="-m-2 ml-4 p-2 text-violet-400 hover:text-gray-600 sm:ml-6 lg:hidden"
                            >
                                <span className="sr-only">Filters</span>
                                <FunnelIcon aria-hidden="true" className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <section aria-labelledby="products-heading" className="pb-24 pt-6">
                        <h2 id="products-heading" className="sr-only">
                            Products
                        </h2>

                        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                            {/* Filters */}
                            <form className="hidden lg:block">
                                <h3 className="sr-only">Categories</h3>
                                <CategoriesMenu categories={categories} />
                                {filters.map((section) => (
                                    <Disclosure key={section.id} as="div" className="border-b border-violet-200 py-6">
                                        <h3 className="-my-3 flow-root">
                                            <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-violet-400 hover:text-gray-600">
                                                <span className="font-medium text-violet-900">{section.name}</span>
                                                <span className="ml-6 flex items-center">
                                                    <PlusIcon aria-hidden="true" className="h-5 w-5 group-data-[open]:hidden" />
                                                    <MinusIcon aria-hidden="true" className="h-5 w-5 [.group:not([data-open])_&]:hidden" />
                                                </span>
                                            </DisclosureButton>
                                        </h3>
                                        <DisclosurePanel className="pt-6">
                                            <div className="space-y-4">
                                                {section.options.map((option, optionIdx) => (
                                                    <div key={option.value} className="flex items-center">
                                                        <input
                                                            defaultValue={option.value}
                                                            defaultChecked={option.checked}
                                                            id={`filter-${section.id}-${optionIdx}`}
                                                            name={`${section.id}[]`}
                                                            type="checkbox"
                                                            className="h-4 w-4 rounded border-violet-300 text-indigo-600 focus:ring-indigo-500"
                                                        />
                                                        <label htmlFor={`filter-${section.id}-${optionIdx}`} className="ml-3 text-sm text-violet-600">
                                                            {option.label}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </DisclosurePanel>
                                    </Disclosure>
                                ))}
                            </form>

                            {/* Product grid */}
                            <div className="mt-6 flex flex-row gap-x-6 gap-y-10 lg:col-span-2">
                                {sortedProducts.length > 0 ? (
                                    sortedProducts.map((product: any) => {
                                        let imageURL = "./placeholder-image.jpg";
                                        if (product?.image !== 'undefined') {
                                            imageURL = product.image;
                                        }
                                        return (
                                            <div key={product._id} className="group relative bg-white p-4 border border-rounded rounded-md">
                                                <div className="overflow-hidden rounded-md lg:aspect-none group-hover:opacity-75 lg:h-80">
                                                    <Image
                                                        src={imageURL}
                                                        alt={product.name}
                                                        height={240}
                                                        width={360}
                                                        className="h-auto w-auto object-cover object-center lg:h-75 lg:w-full"
                                                    />
                                                </div>
                                                <div className="mt-4 flex justify-between">
                                                    <div>
                                                        <h3 className="text-sm text-violet-700">
                                                            <Link href={`/products/${product._id}`}>
                                                                <a className="mt-1 text-sm text-gray-600">{product.name}</a>
                                                            </Link>
                                                        </h3>
                                                        <p className="mt-1 text-sm text-gray-600">{product.category}</p>
                                                    </div>
                                                    <p className="text-sm font-medium text-violet-900">M{product.price}</p>
                                                </div>
                                                <div className="flex justify-between gap-2">
                                                    <button
                                                        onClick={() => handleAddToCart(product)}
                                                        className="mt-2 bg-[#51358C] text-white text-sm p-1 py-2 rounded-md hover:bg-[#6943b9] transition-all ease-in-out w-full"
                                                    >
                                                        Add to Cart
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
                </main>
            </div>
        </div>
    )
}
