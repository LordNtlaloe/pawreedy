"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import ActionsField from "./ActionsField";

export type Product = {
  _id: string;
  name: string;
  price: string;
  image: string;
  category: string;
  quantity: string;
  rating: string;
  status: string;
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Product Name",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const imageUrl = row.getValue("image") as string;
      return (
        <div className="flex justify-center items-center">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Product Image"
              width={50}
              height={50}
              className="rounded-md"
            />
          ) : (
            <p className="text-gray-500">No image</p>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "rating",
    header: "Ratings",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusClass =
        status === "Low Stock"
          ? "bg-yellow-500 text-black"
          : status === "In Stock"
          ? "bg-green-700 text-white"
          : status === "Out Of Stock"
          ? "bg-red-700 text-white"
          : "bg-gray-200 text-gray-700";

      return (
        <div className={`py-1 px-3 rounded-md text-center ${statusClass}`}>
          <p>{status}</p>
        </div>
      );
    },
  },
  {
    header: "ACTIONS",
    cell: ({ row }) => {
      const product = row.original;
      return <ActionsField id={product._id} />;
    },
  },
];
