import { create } from "zustand";

interface productState {
    showProductChangeStatusModal: boolean;
    showProductUpdateModal: boolean
    showProductBookingModal: boolean

    setShowChangeProductStatusModal: (newStatus: boolean) => void;
    setShowProductUpdateModal: (newState: boolean) => void;
    setShowProductBookingModal: (newState: boolean) => void;
}

export const useProductStore = create<productState>()((set) => ({
    showProductChangeStatusModal: false,
    showProductUpdateModal: false,
    showProductBookingModal: false,

    setShowChangeProductStatusModal: (newStatus: boolean) => set({ showProductChangeStatusModal: newStatus }),
    setShowProductUpdateModal: (newState: boolean) => set({ showProductUpdateModal: newState }),
    setShowProductBookingModal: (newState: boolean) => set({ showProductBookingModal: newState })
}));
