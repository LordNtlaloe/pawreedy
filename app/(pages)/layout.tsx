import type { Metadata } from "next";
import Navbar from "@/components/root/Navbar";
import SecondaryNav from "@/components/root/SecondaryNav";
import { cn } from "@/lib/utils";
import Footer from "@/components/root/Footer";
import "../globals.css"


export const metadata: Metadata = {
    title: "Pawreedy",
    description: "Your One Stop Online Petshop",
};

export default function PagesLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <body className={cn("flex min-h-full flex-col")}>
            <div>
                <Navbar />
                <SecondaryNav />
            </div>
            <main className="grow">{children}</main>
            <Footer />
        </body>
    );
}