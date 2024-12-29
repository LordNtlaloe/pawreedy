"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { updateOrderStatus } from "@/app/_actions/_orderActions";

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
      name: string;
      price: string;
      quantity: number;
      image: string;
      size?: string;
      status?: string;
      expectedDelivery?: string;
    }[];
  };
};

interface OrdersProps {
  orders: Order[];
}

const getStatusClass = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Processing":
      return "bg-blue-100 text-blue-800";
    case "Shipped":
      return "bg-indigo-100 text-indigo-800";
    case "Delivered":
      return "bg-green-100 text-green-800";
    case "Cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const statusStages = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const ProgressBar: React.FC<{ currentStatus: string }> = ({ currentStatus }) => {
  const currentStageIndex = statusStages.indexOf(currentStatus);

  return (
    <div className="w-full mt-4">
      <div className="relative flex items-center w-full h-3 bg-gray-200 rounded-full">
        {statusStages.map((status, index) => (
          <div
            key={status}
            className={`h-3 rounded-full ${
              index <= currentStageIndex ? "bg-green-500" : "bg-gray-300"
            }`}
            style={{
              width: `${100 / statusStages.length}%`,
            }}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs mt-2">
        {statusStages.map((status, index) => (
          <span
            key={status}
            className={`text-gray-600 ${index === currentStageIndex ? "font-semibold text-green-600" : ""}`}
          >
            {status}
          </span>
        ))}
      </div>
    </div>
  );
};

const OrderDetails: React.FC<{ order: Order }> = ({ order }) => (
  <div className="w-full p-4 bg-gray-50 rounded-lg">
    <h4 className="text-sm font-semibold text-gray-700">Order Information</h4>
    <dl className="mt-2 flex flex-row gap-10">
      <div className="mb-2">
        <dt className="text-sm font-medium text-gray-600">Order ID:</dt>
        <dd className="text-sm text-gray-700">
          <a href="#" className="hover:underline font-semibold">{`#${order._id}`}</a>
        </dd>
      </div>
      <div className="mb-2">
        <dt className="text-sm font-medium text-gray-600">Date:</dt>
        <dd className="text-sm text-gray-700">{order.createdAt}</dd>
      </div>
      <div className="mb-2">
        <dt className="text-sm font-medium text-gray-600">Price:</dt>
        <dd className="text-sm text-gray-700 font-semibold">R{order.cartSummary.totalAmount}.00</dd>
      </div>
      <div className="mb-2">
        <dt className="text-sm font-medium text-gray-600">Status:</dt>
        <dd
          className={`inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium ${getStatusClass(
            order.orderStatus
          )}`}
        >
          {order.orderStatus}
        </dd>
      </div>
    </dl>
  </div>
);

const ShippingInfo: React.FC<{ shippingDetails: Order["shippingDetails"] }> = ({ shippingDetails }) => (
  <div className="w-full p-4 bg-gray-50 rounded-lg">
    <h4 className="text-sm font-semibold text-gray-700">Shipping Information</h4>
    <p className="text-sm text-gray-600">{shippingDetails.name}</p>
    <p className="text-sm text-gray-600">{shippingDetails.email}</p>
    <p className="text-sm text-gray-600">
      {shippingDetails.address}, {shippingDetails.city}, {shippingDetails.country} - {shippingDetails.postalCode}
    </p>
  </div>
);

const CartSummary: React.FC<{ cartSummary: Order["cartSummary"] }> = ({ cartSummary }) => (
  <div className="w-full p-4 bg-gray-50 rounded-lg">
    <h4 className="text-sm font-semibold text-gray-700">Cart Summary</h4>
    <ul className="divide-y divide-gray-200">
      {cartSummary.items.map((item, idx) => (
        <li key={idx} className="py-2 flex items-center gap-4">
          <Image src={item.image} alt={item.name} width={50} height={50} className="rounded-md" />
          <div className="text-sm text-gray-600">
            <p>{item.name}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Price: R{item.price}.00</p>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

const Orders: React.FC<OrdersProps> = ({ orders = [] }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const handleCancelOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setOpenDialog(true); // Open the dialog
  };

  const handleConfirmCancel = async () => {
    if (selectedOrderId) {
      const response = await updateOrderStatus(selectedOrderId, "Cancelled");
      if (response.success) {
        console.log("Order successfully cancelled!");
      } else {
        console.error("Failed to cancel the order:", response.error);
      }
    }
    setOpenDialog(false);
  };

  return (
    <section className="flex h-full w-full flex-col items-start mobile:gap-0">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0 flex w-full flex-col items-start gap-6 mobile:w-full mobile:flex-col bg-white rounded-lg mt-2">
        <div className="mt-2 w-full flow-root sm:mt-4">
          {orders.length === 0 ? (
            <p className="text-sm font-medium text-gray-500">No orders found.</p>
          ) : (
            <div className="w-full divide-y divide-gray-300 dark:divide-gray-700">
              {orders.map((order) => (
                <div key={order._id} className="w-full flex flex-col gap-6 sm:mt-8 bg-white rounded-lg p-2 mb-2">
                  <OrderDetails order={order} />
                  <ShippingInfo shippingDetails={order.shippingDetails} />
                  <CartSummary cartSummary={order.cartSummary} />
                  <ProgressBar currentStatus={order.orderStatus} />
                  <div className="flex w-full gap-4 sm:justify-end">
                    <Button
                      variant="destructive"
                      className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white"
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={order.orderStatus === "Cancelled"}
                    >
                      Cancel order
                    </Button>
                    <Button variant="secondary" className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white">
                      View details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Confirm Cancel Order</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-600">Are you sure you want to cancel this order? This action cannot be undone.</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmCancel}>
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Orders;
