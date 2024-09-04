"use client";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, SignOutButton } from "@clerk/nextjs";
import { ShoppingCart, Heart, User as UserIcon, Search } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import ShoppingCartModal from "@/components/products/cart/ShoppingCartModal"; // Adjust the import path as needed

const Menu = ({ userInput = () => {} }: any) => {
  const [searchText, setSearchText] = useState<string>("");
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <div className="flex justify-between gap-4 px-4 py-2 w-[75%]">
      {/* Search Bar on the left */}
      <div className="flex-1">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 border rounded-md w-full max-w-xs pr-10" // Add padding-right for the icon
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Search
            onClick={() => userInput(searchText)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={16}
          />
        </div>
      </div>

      {/* Icons on the right */}
      <div className="flex items-center gap-4">
        {/* Cart Icon */}
        <button onClick={openCart} className="hover:scale-105 transition-transform">
          <ShoppingCart size={24} />
        </button>

        {/* Wishlist Icon */}
        <Link href="/wishlist" className="hover:scale-105 transition-transform">
          <Heart size={24} />
        </Link>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2">
            <SignedIn>
              <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
            <SignedOut>
              <UserIcon size={24} className="cursor-pointer" />
            </SignedOut>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white shadow-md rounded p-2">
            <SignedIn>
              <DropdownMenuItem>
                <Link href="/dashboard">
                  <button className="w-full text-left">Dashboard</button>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <SignOutButton>
                  <button className="w-full text-left">Logout</button>
                </SignOutButton>
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

      {/* Cart Modal */}
      <ShoppingCartModal isOpen={isCartOpen} onClose={closeCart} />
    </div>
  );
};

export default Menu;
