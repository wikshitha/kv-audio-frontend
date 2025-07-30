import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Chart } from "chart.js/auto";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalOrders: "0",
    totalUsers: "0",
    totalItems: "0",
    totalGalleries: "0",
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchDashboardData = async () => {
      try {
        const statsResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/stats`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStats((prev) => ({
          ...prev,
          ...statsResponse.data,
        }));

        const activitiesResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/recent-activities`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRecentActivities(activitiesResponse.data);

        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
        chartInstance.current = new Chart(chartRef.current, {
          type: "bar",
          data: {
            labels: ["Orders", "Users", "Items", "Galleries"],
            datasets: [
              {
                label: "Count",
                data: [
                  parseInt(statsResponse.data.totalOrders, 10),
                  parseInt(statsResponse.data.totalUsers, 10),
                  parseInt(statsResponse.data.totalItems, 10),
                  parseInt(statsResponse.data.totalGalleries, 10),
                ],
                backgroundColor: ["#4CAF50", "#2196F3", "#FF9800", "#9C27B0"],
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: false },
            },
            maintainAspectRatio: false,
          },
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <motion.div
      className="w-full h-full px-4 py-6 md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        Admin Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Orders", value: stats.totalOrders, color: "bg-green-500" },
          { title: "Total Users", value: stats.totalUsers, color: "bg-blue-500" },
          { title: "Total Items", value: stats.totalItems, color: "bg-orange-500" },
          { title: "Total Galleries", value: stats.totalGalleries, color: "bg-purple-500" },
        ].map((stat, index) => (
          <motion.div
            key={index}
            className={`p-4 md:p-6 ${stat.color} text-white shadow-lg rounded-xl text-center`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.2 }}
          >
            <h2 className="text-lg md:text-xl font-bold">{stat.title}</h2>
            <p className="text-xl md:text-2xl mt-2 md:mt-4">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Graph */}
      <motion.div
        className="mt-8 bg-white shadow-lg rounded-xl p-4 md:p-6"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl md:text-2xl font-bold mb-4">Overview Chart</h2>
        <div className="w-full h-[300px] sm:h-[400px]">
          <canvas ref={chartRef} className="w-full h-full"></canvas>
        </div>
      </motion.div>

      {/* Recent Activity Section */}
      <motion.div
        className="mt-8 bg-white shadow-lg rounded-xl p-4 md:p-6"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-xl md:text-2xl font-bold mb-4">Recent Activity</h2>
        <ul className="list-disc list-inside space-y-2 text-sm md:text-base">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity, index) => (
              <li key={index} className="text-gray-700">
                {activity.message} -{" "}
                <span className="text-gray-500 text-sm">
                  {new Date(activity.timestamp).toLocaleString()}
                </span>
              </li>
            ))
          ) : (
            <li className="text-gray-700">No recent activities available.</li>
          )}
        </ul>
      </motion.div>

      {/* Footer */}
      <footer className="mt-8 text-center text-gray-600 text-sm">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          © {new Date().getFullYear()} Admin Dashboard
        </motion.p>
      </footer>
    </motion.div>
  );
}
