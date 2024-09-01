import { create } from "zustand";

interface categoryState {
    showAddNewCategoryModal: boolean;
    showUpdateCategoryModal: boolean;
    showCategoryDeleteModal: boolean
    categoryId: string;
    categoryName: string;

    setShowNewCategoryModal: (newStatus: boolean) => void;
    setShowUpdateCategoryModal: (newStatus: boolean) => void;
    setShowCategoryDeleteModal: (newStatus: boolean) => void;
    setCategoryID: (id: string) => void;
    setCategoryName: (name: string) => void;
}

export const useCategoryStore = create<categoryState>()((set) => ({
    showAddNewCategoryModal: false,
    showUpdateCategoryModal: false,
    showCategoryDeleteModal: false,
    categoryId: "",
    categoryName: "",
    setShowNewCategoryModal: (newStatus) => set({ showAddNewCategoryModal: newStatus }),
    setShowUpdateCategoryModal: (newStatus) => set({ showUpdateCategoryModal: newStatus }),
    setShowCategoryDeleteModal: (newStatus) => set({ showCategoryDeleteModal: newStatus }),
    setCategoryID: (id) => set({ categoryId: id }),
    setCategoryName: (name) => set({ categoryName: name })
}));