"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ChangeStatusPopup from "../ChangeStatus/ChangeOrderStatus";
import OrderDetailsPopup from "../OrderDetailsPopup";
import React, { useState } from "react"

export type Order = {
  _id: string;
  shippingDetails: { name: string; email: string };
  orderStatus: string;
  cartSummary: { totalAmount: number };
  options: "update" | "delete";
};

export const columns: ColumnDef<Order>[] = [
  
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "orderStatus", header: "Status" },
  { accessorKey: "totalAmount", header: "Total Amount" },
  {
    accessorKey: "options",
    header: "Options",
    cell: ({ row }) => {
      const order = row.original;
      
      const [isPopupOpen, setIsPopupOpen] = useState(false);

      const handleClose = () => setIsPopupOpen(false);

      const handleSave = (newStatus: string) => {
        // Update the order status in the UI or state here as needed
        order.orderStatus = newStatus;
        setIsPopupOpen(false);
      };

      return (
        <div className="flex gap-2 items-center">
          <Dialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
            <DialogTrigger asChild>
              <button className="btn">Change Status</button>
            </DialogTrigger>
            <DialogContent>
              <ChangeStatusPopup
                orderId={order._id}
                currentStatus={order.orderStatus}
                onClose={handleClose}
                onSave={handleSave}
              />
            </DialogContent>
          </Dialog>
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
    },
  },
];

