import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { ShoppingCart, Heart, User, Search } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

const Menu = () => {
  return (
    <div className="flex justify-between gap-4 px-4 py-2 w-[100%]">
      {/* Search Bar on the left */}
      <div className="flex-1">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 border rounded-md w-full max-w-xs pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
        </div>
      </div>

      {/* Icons on the right */}
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
    </div>
  );
};

export default Menu;
