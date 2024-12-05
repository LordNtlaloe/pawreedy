"use client"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart, Heart, User, Search } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { menuItems } from "@/lib/constants";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext"; 
import { useState } from "react";
import ShoppingCartModal from "@/components/products/cart/ShoppingCartModal";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}


const MobileMenu = ({ userInput = () => { } }: any) => {
    const [searchText, setSearchText] = useState<string>("");
    const [isCartOpen, setIsCartOpen] = useState(false);

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const { cart } = useCart(); 

    return (
        <div>
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger>
                        <MenuIcon />
                    </SheetTrigger>
                    <SheetContent
                        className="bg-white h-full text-[#51358C] w-72"
                        side="left"
                    >
                        <SheetHeader>
                            <SheetTitle className="font-bold border-b border-white mt-3 flex justify-start relative -top-10 -left-15">
                                <Link href='/'>
                                    <Image src="/logo01.png" width={100} height={80} alt="Pawreedy Logo" className="rounded-[5px]" />
                                </Link>
                            </SheetTitle>
                        </SheetHeader>
                        <div className="absolute top-10 mt-5">
                            {menuItems.map((item) => (
                                <SheetClose asChild key={item.id}>
                                    <Link
                                        href={item.href}
                                        aria-current={item.current ? 'page' : undefined}
                                        className={classNames(
                                          item.current ? 'text-[#51358C]' : 'text-[#543791]  hover:text-[#51358C]',
                                          'rounded-md px-3 py-2 text-sm font-medium',
                                        )}>
                                        {/* <item.icon className="md:hidden flex justify-start" /> */}
                                        <p className="ml-3 md:ml-1">{item.label}</p>
                                    </Link>
                                </SheetClose>
                            ))}
                        </div>
                        <div className="absolute top-60 left-1 mx-4 mt-5">
                          <input
                            type="text"
                            placeholder="Search..."
                            className="px-4 py-2 border rounded-md w-full max-w-xs pr-10" 
                            onChange={(e) => setSearchText(e.target.value)}
                          />
                          <Search
                            onClick={() => userInput(searchText)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            size={16}
                          />
                        </div>
                        <SheetClose asChild>
                            <div className="mt-6 flex items-start gap-6 absolute top-[300px]">
                                {/* Cart Icon with Badge */}
                                <button onClick={openCart} className="transition-transform">
                                    <ShoppingCart size={24} />
                                    {cart.length > 0 && (
                                        <span className="relative -top-[30px] -right-4 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {cart.length}
                                        </span>
                                    )}
                                </button>
                                {/* Wishlist Icon */}
                                <Link href="/wishlist" className="hover:scale-105 transition-transform">
                                    <Heart size={24} />
                                </Link>
                                {/* User Dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center gap-2">
                                        <User size={24} className="cursor-pointer" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="bg-white shadow-md rounded p-2">
                                        <SignedIn>
                                            <DropdownMenuItem>
                                                <UserButton afterSignOutUrl="/" />
                                            </DropdownMenuItem>
                                        </SignedIn>
                                        <SignedOut>
                                            <DropdownMenuItem>
                                                <SignUpButton>
                                                    <button className="w-full text-left">Register</button>
                                                </SignUpButton>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <SignInButton>
                                                    <button className="w-full text-left">Sign-In</button>
                                                </SignInButton>
                                            </DropdownMenuItem>
                                        </SignedOut>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </SheetClose>
                    </SheetContent>
                </Sheet>
                <ShoppingCartModal isOpen={isCartOpen} onClose={closeCart} />
            </div>
        </div>
    );
};

export default MobileMenu;