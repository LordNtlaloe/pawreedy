// ChangeStatusPopup.tsx
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { updateOrderStatus } from "@/app/_actions/_orderActions"; 
// import { Order } from "../OrdersTable/OrderTable";

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
  const [currentStatus, setCurrentStatus] = useState<string>(initialStatus);
  const [selectedStatus, setSelectedStatus] = useState<string>(initialStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      const response = await updateOrderStatus(orderId, selectedStatus);
      if (response) {
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
          text: "Failed to update the order status.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "An Error Occurred",
        text: "Unable to update the order status.",
      });
      console.error("Error:", error);
    } finally {
      setIsUpdating(false);
      onClose();
    }
  };

  return (
    <div className="">
      <div className="bg-white p-6 rounded-lg space-y-4 w-80">
        <h3 className="text-lg font-semibold">Change Order Status</h3>
        <p>Order ID: {orderId}</p>
        <p>Order Status: {currentStatus}</p>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border p-2 rounded-md w-full"
        >
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`px-4 py-2 ${isUpdating ? "bg-gray-400" : "bg-blue-500 text-white"} rounded-md`}
            disabled={isUpdating}
          >
            {isUpdating ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeStatusPopup;
