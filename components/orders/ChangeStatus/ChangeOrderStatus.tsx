"use client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { updateOrderStatus } from "@/app/_actions/_orderActions";
import { getOrderDetails } from "@/app/_actions/_orderActions"; // Add a function to fetch order details

interface ChangeStatusPopupProps {
  orderId: string;
  initialStatus: string;
  onClose: () => void;
  onSave: (newStatus: string) => void;
}

const ChangeStatusPopup: React.FC<ChangeStatusPopupProps> = ({
  orderId,
  initialStatus,
  onClose,
  onSave,
}) => {
  const [currentStatus, setCurrentStatus] = useState(initialStatus);
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // Fetch latest order details on mount
  useEffect(() => {
    const fetchOrderDetails = async () => {
      setIsFetching(true);
      try {
        const response = await getOrderDetails(orderId);
        if (response?.success && response.order?.status) {
          setCurrentStatus(response.order.status);
          setSelectedStatus(response.order.status); // Update dropdown to latest status
        } else {
          Swal.fire({
            icon: "error",
            title: "Failed to Fetch Status",
            text: response?.error || "Could not fetch the latest order status.",
          });
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]); // Ensure to fetch for the current orderId

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
  };

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      const response = await updateOrderStatus(orderId, selectedStatus);
      if (response?.success) {
        onSave(selectedStatus);
        Swal.fire({
          icon: "success",
          title: "Status Updated",
          text: `Order status has been changed to ${selectedStatus}`,
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: response?.error || "Failed to update the order status.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "An Error Occurred",
        text: "Unable to update the order status.",
      });
      console.error("An error occurred:", error);
    } finally {
      setIsUpdating(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg space-y-4 w-80">
        <h3 className="text-lg font-semibold">Change Order Status</h3>
        <p>Order ID: {orderId}</p>
        <p>
          Current Status:{" "}
          <span className="font-semibold">
            {isFetching ? "Loading..." : currentStatus}
          </span>
        </p>
        <select
          value={selectedStatus}
          onChange={handleStatusChange}
          className="border p-2 rounded-md w-full"
          disabled={isFetching}
        >
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-md"
            disabled={isFetching || isUpdating}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`px-4 py-2 ${
              isUpdating ? "bg-gray-400" : "bg-blue-500 text-white"
            } rounded-md`}
            disabled={isFetching || isUpdating}
          >
            {isUpdating ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeStatusPopup;
