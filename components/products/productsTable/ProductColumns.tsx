'use client'

import { ColumnDef } from "@tanstack/react-table";
import ActionsField from "./ActionsField";

export type Product = {
    _id: string
    productName: string
    category: string
    contactPerson: string
    productEmail: string
    productPhoneNumber: string
    productAlternativeNumber: string
    productAddress: string
    aboutProduct: string
    productDetails: string
    status: string
};

export const productTableColumns: ColumnDef<Product>[] = [
    {
        accessorKey: "productName",
        header: "Product Name"
    },
    {
        accessorKey: "category",
        header: "Category"
    },
    {
        accessorKey: "aboutProduct",
        header: "About"
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <div className={status === 'pending' ? `bg-yellow-500 p-1` : status === 'active' ? "p-1 bg-green-700 text-white" : status === 'banned' ? "bg-red-700 text-white p-1" : "bg-white"}>
                    <p>{status}</p>
                </div>
            )
        }
    },

    {
        header: "ACTIONS",
        cell: ({ row }) => {
            const product = row.original
            return <ActionsField id={product._id} />
        }
    }
]