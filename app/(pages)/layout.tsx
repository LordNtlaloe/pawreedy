import type { Metadata } from "next";
import Navbar from "@/components/root/Navbar";
import SecondaryNav from "@/components/root/SecondaryNav";
import { cn } from "@/lib/utils";
import Footer from "@/components/root/Footer";
import "../globals.css"
import dynamic from "next/dynamic";


export const metadata: Metadata = {
    title: "Pawreedy - Online Store",
    description: "Your One Stop Online Petshop",
};


export default function PagesLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="">
            <main className={cn("flex min-h-full flex-col")}>
                <div>
                    <Navbar />
                    <SecondaryNav />
                </div>
                <main className="grow">{children}</main>
            </main>
            <Footer />
        </div>
        
    );
}