"use client"
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Tooltip, PointElement } from "chart.js";
import { useState, useEffect } from "react";
import { getTotalRevenueByYear } from "@/app/_actions/_orderActions";

ChartJS.register(LineElement, CategoryScale, LinearScale, Tooltip, PointElement);

const SalesOverviewChart = () => {
  const [salesData, setSalesData] = useState<{ month: string, sales: number }[]>([]);

  // Fetch the total revenue by year and transform it for the chart
  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const result = await getTotalRevenueByYear();
        if (result.success) {
          const totalRevenue = result.totalRevenue || 0;
          // Mock data for the 12 months if it's not monthly-specific data
          setSalesData([
            { month: 'January', sales: totalRevenue },
            { month: 'February', sales: totalRevenue },
            { month: 'March', sales: totalRevenue },
            { month: 'April', sales: totalRevenue },
            { month: 'May', sales: totalRevenue },
            { month: 'June', sales: totalRevenue },
            { month: 'July', sales: totalRevenue },
            { month: 'August', sales: totalRevenue },
            { month: 'September', sales: totalRevenue },
            { month: 'October', sales: totalRevenue },
            { month: 'November', sales: totalRevenue },
            { month: 'December', sales: totalRevenue },
          ]);
        } else {
          console.error(result.error);
        }
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    };

    fetchRevenueData();
  }, []);

  // Prepare the data for the chart
  const data = {
    labels: salesData.map((data) => data.month),
    datasets: [
      {
        label: "Sales",
        data: salesData.map((data) => data.sales),
        borderColor: "#6366F1",
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        borderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 8,
      },
    ],
  };

  return (
    <motion.div
      className="bg-violet-200 bg-opacity-50 backdrop-blur-md shadow-sm shadow-violet-900 rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-lg font-medium mb-4 text-[#51358C]">Sales Overview</h2>
      <div className="h-80">
        <Line data={data} options={{ maintainAspectRatio: false, responsive: true }} />
      </div>
    </motion.div>
  );
};

export default SalesOverviewChart;
