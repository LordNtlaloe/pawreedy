import { FC } from "react";
import { Order } from "./OrdersTable/columns";

interface OrderDetailsPopupProps {
    orderDetails: Order;
    onClose: () => void;
}


export default function OrderDetailsPopup({ orderDetails, onClose }: OrderDetailsPopupProps) {
    console.log(orderDetails)
    return (
        <div className="">
            <div className="bg-white p-8 rounded-lg flex flex-col justify-center items-center w-96">
                <h3 className="text-xl font-semibold mb-4">Order Details</h3>
                <div className="space-y-4">
                    <p><strong>Order ID:</strong> {orderDetails._id}</p>
                    <p><strong>Status:</strong> {orderDetails.orderStatus}</p>
                    <h5 className="text-xl font-semibold mb-4">Shipping Details</h5>
                    <p><strong>Customer Name:</strong> {orderDetails.shippingDetails?.name}</p>
                    <p><strong>Email:</strong> {orderDetails.shippingDetails?.email}</p>
                    <p><strong>Address:</strong> {orderDetails.shippingDetails?.address}</p>
                    <p><strong>City:</strong> {orderDetails.shippingDetails?.city}</p>
                    <p><strong>Country:</strong> {orderDetails.shippingDetails?.country}</p>
                    <p><strong>Postal Code:</strong> {orderDetails.shippingDetails?.postalCode}</p>
                    <h5 className="text-xl font-semibold mb-4">Cart Summary</h5>
                    <p><strong>Total Amount:</strong> R{orderDetails.cartSummary?.totalAmount}</p>
                    <h5 className="text-lg font-semibold mb-2">Items:</h5>
                    <ul className="list-disc pl-5">
                        {orderDetails.cartSummary?.items?.map((item, index) => (
                            <li key={index}>
                                {item.name} - R{item.price} x {item.quantity}
                            </li>
                        )) || <li>No items in cart</li>}
                    </ul>
                </div>
                <button
                    onClick={onClose}
                    className="mt-4 w-full py-2 bg-red-500 text-white rounded-md"
                >
                    Close
                </button>
            </div>
        </div>
    )
}
