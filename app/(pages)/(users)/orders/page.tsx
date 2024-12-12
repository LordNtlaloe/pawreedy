"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button"; // Ensure Button component is imported
import { Textarea } from "@/components/ui/textarea";

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
  orders?: Order[];
}

const Orders: React.FC<OrdersProps> = ({ orders = [] }) => {
  return (
    <section className="flex h-full w-full flex-col items-start mobile:gap-0 bg-gray-100">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0 flex w-full flex-col items-start gap-6 mobile:w-full mobile:flex-col bg-white rounded-lg shadow-lg mt-8">
        <div className="flex w-full flex-col items-start gap-4 sm:flex-row sm:justify-between sm:gap-4 mb-6 p-4">
          <span className="text-2xl font-semibold text-gray-800">My Orders</span>
          
          <div className="flex w-full sm:w-auto gap-4">
            <select
              id="order-type"
              className="block w-full rounded-lg border bg-gray-50 p-2.5 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:w-[10rem] hover:bg-gray-200"
            >
              <option>All orders</option>
              <option value="pre-order">Pre-order</option>
              <option value="transit">In transit</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <select
              id="duration"
              className="block w-full rounded-lg border bg-gray-50 p-2.5 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:w-[10rem] hover:bg-gray-200"
            >
              <option>this week</option>
              <option value="this month">this month</option>
              <option value="last 3 months">last 3 months</option>
              <option value="last 6 months">last 6 months</option>
              <option value="this year">this year</option>
            </select>
          </div>
        </div>

        <div className="mt-6 w-full flow-root sm:mt-8">
          {orders.length === 0 ? (
            <p className="text-lg font-medium text-gray-500">No orders found.</p>
          ) : (
            <div className="w-full divide-y divide-gray-300 dark:divide-gray-700">
              {orders.map((order) => (
                <div key={order._id} className="w-full flex flex-col gap-6 sm:mt-8 bg-white shadow-lg rounded-lg p-4 mb-4">
                  <div className="flex w-full flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4">
                    <dl className="flex flex-col w-full sm:w-1/4">
                      <dt className="text-sm font-medium text-gray-600">Order ID:</dt>
                      <dd className="mt-1.5 text-lg font-semibold text-gray-900">
                        <a href="#" className="hover:underline">{`#${order._id}`}</a>
                      </dd>
                    </dl>

                    <dl className="flex w-full flex-col sm:w-1/4">
                      <dt className="text-sm font-medium text-gray-600">Date:</dt>
                      <dd className="mt-1.5 text-lg font-semibold text-gray-900">
                        {order.createdAt}
                      </dd>
                    </dl>

                    <dl className="flex w-full sm:w-1/4">
                      <dt className="text-sm font-medium text-gray-600">Price:</dt>
                      <dd className="mt-1.5 text-lg font-semibold text-gray-900">
                        ${order.cartSummary.totalAmount}
                      </dd>
                    </dl>

                    <dl className="flex w-full sm:w-1/4">
                      <dt className="text-sm font-medium text-gray-600">Status:</dt>
                      <dd className="mt-1.5 inline-flex items-center rounded bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                        {order.orderStatus}
                      </dd>
                    </dl>
                  </div>

                  <div className="flex w-full gap-4 sm:justify-end">
                    <Button variant="destructive" className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white">
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

        <nav className="mt-6 flex items-center justify-center sm:mt-8" aria-label="Page navigation example">
          <ul className="flex h-8 items-center -space-x-px text-sm">
            {/* Pagination links here */}
          </ul>
        </nav>
      </div>
    </section>
  );
};

export default Orders;
