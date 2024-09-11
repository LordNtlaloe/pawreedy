'use client'

import { ColumnDef } from "@tanstack/react-table";
import ActionsField from "./ActionsField";

export type Product = {
    _id: string
    name: string
    category: string
    description: string
    status: string
};

export const productTableColumns: ColumnDef<Product>[] = [
    {
        accessorKey: "name",
        header: "Product Name"
    },
    {
        accessorKey: "category",
        header: "Category"
    },
    {
        accessorKey: "description",
        header: "Description"
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <div className={status === 'Low On Stock' ? `text-orange-500` : status === 'In Stock' ? "p-1 text-green-700 font-extrabold" : status === 'Out Of Stock' ? "text-red-700 p-1 font-extrabold" : "bg-white"}>
                    <p>{status}</p>
                </div>
            )
        }
    },

    {
        header: "Actions",
        cell: ({ row }) => {
            const product = row.original
            return <ActionsField id={product._id} />
        }
    }
]