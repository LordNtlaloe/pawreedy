
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart, Heart, User } from "lucide-react";

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

import { menuItems } from "@/lib/constants";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";



const MobileMenu = () => {

    return (
        <div>
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger>
                        <MenuIcon />
                    </SheetTrigger>
                    <SheetContent
                        className="bg-blue-950 h-full text-white w-72"
                        side="left"
                    >
                        <SheetHeader>
                            <SheetTitle className="font-bold border-b border-white mb-4 mt-3 py-4 flex justify-center">
                                <Link href='/'>
                                    <Image src="/logo.jpg" width={80} height={80} alt="UniServe" className="rounded-[5px]" />
                                </Link>
                            </SheetTitle>
                        </SheetHeader>
                        <div>
                            {menuItems.map((item) => (
                                <SheetClose asChild key={item.id}>
                                    <Link
                                        href={item.href}
                                        className="flex py-2 border-b border-white/30 md:border-none cursor-pointer hover:scale-105 hover:font-bold transition-all"
                                    >
                                        <item.icon className="md:hidden flex justify-start" />
                                        <p className="ml-3 md:ml-1">{item.label}</p>
                                    </Link>
                                </SheetClose>
                            ))}
                        </div>
                        <SheetClose asChild>
                            <div className="flex items-center gap-4">
                                {/* Cart Icon */}
                                <Link href="/cart" className="hover:scale-105 transition-transform">
                                    <ShoppingCart size={24} />
                                </Link>
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
            </div>
        </div>
    );
};

export default MobileMenu;