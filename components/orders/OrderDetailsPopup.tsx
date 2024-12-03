"use client";
import { FC } from "react";

interface OrderDetailsPopupProps {
    orderDetails: any;
    onClose: () => void;
}

const OrderDetailsPopup: FC<OrderDetailsPopupProps> = ({ orderDetails, onClose }) => (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Order Details</h3>
            <div className="space-y-4">
                <p><strong>Order ID:</strong> {orderDetails._id}</p>
                <p><strong>Status:</strong> {orderDetails.orderStatus}</p>
                <p><strong>Customer Name:</strong> {orderDetails.shippingDetails?.name}</p>
                <p><strong>Email:</strong> {orderDetails.shippingDetails?.email}</p>
                <p><strong>Total Amount:</strong> R{orderDetails.cartSummary?.totalAmount}.00</p>
            </div>
            <button
                onClick={onClose}
                className="mt-4 w-full py-2 bg-red-500 text-white rounded-md"
            >
                Close
            </button>
        </div>
    </div>
);

export default OrderDetailsPopup;
