"use client";

import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  SignOutButton,
  useUser,
} from "@clerk/nextjs";
import { ShoppingCart, Heart, User as UserIcon, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import ShoppingCartModal from "@/components/products/cart/ShoppingCartModal";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { usePathname } from "next/navigation";

const Menu = ({ userInput = () => {} }: any) => {
  const [searchText, setSearchText] = useState<string>("");
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { user } = useUser();
  const userRole = user?.publicMetadata?.role;
  const pathname = usePathname(); // Get the current route

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const isActive = (href: string) => pathname === href; // Check if the link is active

  return (
    <div className="flex justify-between gap-4 px-4 py-2 w-[75%]">
      {/* Search Bar on the left */}
      <div className="relative flex">
        <input
          type="text"
          placeholder="Search..."
          className="px-4 py-2 rounded-full w-[800px] max-w-xs pr-10 bg-violet-100 text-slate-900 border-2 border-transparent focus:border-[#51358C] focus:outline-none"
          onChange={(e) => setSearchText(e.target.value)}
        />

        <Search
          onClick={() => userInput(searchText)}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white bg-[#51358C] p-2 rounded-full cursor-pointer"
          size={40}
        />
      </div>

      {/* Icons on the right */}
      <div className="flex items-center gap-4 relative">
        {/* Cart Icon */}
        <button onClick={openCart} className="relative transition-transform">
          <ShoppingCart size={24} />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </button>

        {/* Wishlist Icon */}
        <Link
          href="/wishlist"
          className={`relative hover:scale-105 transition-transform ${
            isActive("/wishlist") ? "text-violet-700 font-bold" : ""
          }`}
        >
          <Heart size={24} />
          {wishlist.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
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
              {userRole === "Admin" ? (
                <DropdownMenuItem>
                  <Link href="/dashboard">
                    <button
                      className={`w-full text-left ${
                        isActive("/dashboard") ? "text-violet-700 font-bold" : ""
                      }`}
                    >
                      Dashboard
                    </button>
                  </Link>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem>
                  <Link href="/profile">
                    <button
                      className={`w-full text-left ${
                        isActive("/profile") ? "text-violet-700 font-bold" : ""
                      }`}
                    >
                      Profile
                    </button>
                  </Link>
                </DropdownMenuItem>
              )}
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
