"use client";
import { motion } from "framer-motion";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";
import { getMostOrderedProductsByCategory } from "@/app/_actions/_orderActions";

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryDistributionChart = () => {
    const [categoryData, setCategoryData] = useState<{ category: string, value: number }[]>([]);

    useEffect(() => {
        // Fetch the most ordered products by category
        const fetchCategoryData = async () => {
            try {
                const response = await getMostOrderedProductsByCategory();
                if (response.success) {
                    // Map the response to the needed format
                    const formattedData = response.categories.map((category: { category: string, products: { name: string, count: number }[] }) => ({
                        category: category.category,
                        value: category.products.reduce((sum: number, product: { count: number }) => sum + product.count, 0), // Sum of all product counts in the category
                    }));
                    setCategoryData(formattedData);
                } else {
                    console.error("Error fetching category data:", response.error);
                }
            } catch (error) {
                console.error("Error fetching category data:", error);
            }
        };

        fetchCategoryData();
    }, []);

    // Check if categoryData is empty and provide fallback data
    const data = categoryData.length > 0 ? {
        labels: categoryData.map((data) => data.category),
        datasets: [
            {
                label: "Category Distribution",
                data: categoryData.map((data) => data.value),
                backgroundColor: ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"],
                hoverOffset: 10,
            },
        ],
    } : {
        labels: ["No Data"],
        datasets: [
            {
                label: "Category Distribution",
                data: [1], // Single empty section to render the circle
                backgroundColor: ["#E5E7EB"], // Light gray color for empty state
                hoverOffset: 10,
            },
        ],
    };

    return (
        <motion.div
            className="bg-violet-200 bg-opacity-50 text-[#51358C] backdrop-blur-md shadow-sm shadow-violet-900 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <h2 className="text-lg font-medium mb-4 text-[#51358C]">Category Distribution</h2>
            <div className="h-80">
                <Pie data={data} options={{ maintainAspectRatio: false, responsive: true }} />
            </div>
        </motion.div>
    );
};

export default CategoryDistributionChart;
