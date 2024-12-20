"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import ChangeStatusPopup from "../ChangeStatus/ChangeOrderStatus";
import OrderDetailsPopup from "../OrderDetailsPopup";
import { TableCell } from "@/components/ui/table";

export type Order = {
  createdAt: string;
  _id: string;
  shippingDetails: { 
    name: string; 
    email: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
  orderStatus: string;
  cartSummary: { 
    totalAmount: number;
    items: {
      [x: string]: any;
      name: string;
      price: string;
      quantity: number;
      image: string;
    }[];
  };
};

// Component to handle options cell
type OptionsCellProps = {
  order: Order;
};

const OptionsCell: React.FC<OptionsCellProps> = ({ order }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleClose = () => setIsPopupOpen(false);

  const handleSave = (newStatus: string) => {
    order.orderStatus = newStatus; // Update the status locally
    setIsPopupOpen(false);
  };

  return (
    <div className="flex gap-2 items-center">
      {/* Change Status Dialog */}
      <Dialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
        <DialogTrigger asChild>
          <button className="btn">Change Status</button>
        </DialogTrigger>
        <DialogContent>
          <ChangeStatusPopup
            orderId={order._id}
            initialStatus={order.orderStatus}
            onClose={handleClose}
            onSave={handleSave}
          />
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <button className="btn">View Details</button>
        </DialogTrigger>
        <DialogContent>
          <OrderDetailsPopup
            orderDetails={order}
            onClose={() => setIsPopupOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Column Definitions
export const columns: ColumnDef<Order>[] = [
  { accessorKey: "_id", header: "Order ID" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "orderStatus",
    header: "Status",
    cell: ({ row }) => {
      const orderStatus = row.original.orderStatus;

      const getStatusClass = (status: string) => {
        switch (status) {
          case "Pending":
            return "bg-yellow-200 text-yellow-700";
          case "Processing":
            return "bg-blue-200 text-blue-700";
          case "Shipped":
            return "bg-green-200 text-green-700";
          case "Delivered":
            return "bg-purple-200 text-purple-700";
          case "Cancelled":
            return "bg-red-200 text-red-700";
          default:
            return "bg-gray-200 text-gray-700";
        }
      };

      return (
        <TableCell
          className={`px-4 py-2 rounded-md whitespace-nowrap text-sm font-semibold ${getStatusClass(orderStatus)}`}
        >
          {orderStatus}
        </TableCell>
      );
    },
  },
  { accessorKey: "totalAmount", header: "Total Amount" },
  {
    accessorKey: "options",
    header: "Options",
    cell: ({ row }) => {
      const order = row.original;
      return <OptionsCell order={order} />;
    },
  },
];
