import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider, ClerkLoaded, ClerkLoading } from '@clerk/nextjs'
import Loading from "./loading";
import { CartProvider } from "@/apis/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pawreedy",
  description: "Your One Stop Online Petshop",
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <CartProvider>
      <html
        lang="en"
        className={cn("h-full scroll-smooth antialiased", inter.className)}
      >
        <body>
          {/* Navbar */}
          <ClerkLoading>
            <Loading />
          </ClerkLoading>
          <ClerkLoaded>
            <div>
            </div>
            <main className="grow">{children}</main>
          </ClerkLoaded>
        </body>
      </html>
      </CartProvider>
    </ClerkProvider>
  );
}