"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";




export type Category = {
  _id: string;
  name: string;
  icon: string
  options: "update" | "delete";
};


export const columns: ColumnDef<Category>[] = [


  {
    accessorKey: "name",
    header: "Name",
  },
  {

    accessorKey: "_id",
    header: "OPTIONS",
    cell: ({ row }) => {
      const category = row.original

      return (
        <div className="flex gap-2 items-center">
          <Link href={'/dashboard/categories/update/1/?id=' + category._id + '&name=' + category.name}>
            <button className="bg-blue-600 text-white px-3 p-1 rounded hover:bg-blue-800">
              Update
            </button>
          </Link>
          <Link href={'/dashboard/categories/delete/?id=' + category._id + '&name=' + category.name}>
            <button type="button" className="bg-red-600 text-white px-3  p-1 rounded hover:bg-red-800" >
              Delete
            </button>
          </Link>
        </div>
      )
    }
  },
];