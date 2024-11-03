'use client'

import { ColumnDef } from "@tanstack/react-table";
import ActionsField from "./ActionsField";

export type Product = {
    _id: string
    name: string
    description: string
    price: string
    image: string
    category: string
    quantity: string
    rating: string
    status: string
};

export const columns: ColumnDef<Product>[] = [
    {
        accessorKey: "name",
        header: "Product Name"
    },
    {
        accessorKey: "description",
        header: "Description"
    },
    {
        accessorKey: "price",
        header: "Price"
    },
    {
        accessorKey: "Image",
        header: "image"
    },
    {
        accessorKey: "Category",
        header: "category"
    },
    {
        accessorKey: "Rating",
        header: "rating"
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <div className={status === 'Low Stock' ? `bg-yellow-500 p-1` : status === 'In Stock' ? "p-1 bg-green-700 text-white" : status === 'Out Of Stock' ? "bg-red-700 text-white p-1" : "bg-white"}>
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