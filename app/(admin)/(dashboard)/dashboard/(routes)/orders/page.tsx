"use client";

import { getAllOrders } from "@/app/_actions/_orderActions";
import { OrdersTable } from "@/components/orders/OrdersTable/OrderTable";
import { columns } from "@/components/orders/OrdersTable/columns";
import { useEffect, useState } from "react";
import { Order } from "@/components/orders/OrdersTable/columns";

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getAllOrders();
        
        if (response.success) {
          const mappedOrders = response.orders.map((order: any) => ({
            _id: order._id, // Now _id is a string
            name: order.shippingDetails?.name || '',
            email: order.shippingDetails?.email || '',
            orderStatus: order.orderStatus,
            totalAmount: order.cartSummary?.totalAmount || 0,
          }));
          
          setOrders(mappedOrders);
        } else {
          setError("Failed to fetch orders");
        }
      } catch (err) {
        setError("Failed to fetch orders");
      }
    };

    fetchOrders();
  }, []);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <section className="mx-1">
      <div>
        <h1 className="mb-3 md:text-3xl font-bold">Orders</h1>
        {orders.length === 0 ? (
          <p>No orders available. Please check the data source.</p>
        ) : (
          <OrdersTable columns={columns} data={orders} />
        )}
      </div>
    </section>
  );
};


export default OrdersPage;

