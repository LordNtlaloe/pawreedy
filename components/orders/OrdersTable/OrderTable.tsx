"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion"; // Ensure you have framer-motion installed
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function OrdersTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  console.log("Table data:", data);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (!isLoaded) return null;

  // Filter data based on the search term
  const filteredData = data.filter((item: any) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Create an array of the rows that match the filtered data
  const filteredRows = table.getRowModel().rows.filter((row) =>
    filteredData.some((item: any) => item.name === row.getValue("name")) // Adjust this condition if your data structure is different
  );

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search Orders..."
          className="border rounded px-4 py-2 focus:outline-none focus:ring"
          onChange={handleSearch}
          value={searchTerm}
        />
      </div>
      <Table className="w-full border-collapse border">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="border py-2 px-4">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {filteredRows.length ? (
            filteredRows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="border py-2 px-4">
                    {/* Ensure that flexRender does not return a <td> */}
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-4">
                No Orders Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>

  );
}
