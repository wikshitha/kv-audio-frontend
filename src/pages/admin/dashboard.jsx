import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Chart } from "chart.js/auto";
import { motion } from "framer-motion";
import { FaShoppingCart, FaUsers, FaBoxOpen, FaImages, FaChartLine, FaClock } from "react-icons/fa";

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
                backgroundColor: [
                  "rgba(59, 130, 246, 0.8)",   // Blue
                  "rgba(34, 197, 94, 0.8)",    // Green
                  "rgba(249, 115, 22, 0.8)",   // Orange
                  "rgba(168, 85, 247, 0.8)",   // Purple
                ],
                borderColor: [
                  "rgba(59, 130, 246, 1)",
                  "rgba(34, 197, 94, 1)",
                  "rgba(249, 115, 22, 1)",
                  "rgba(168, 85, 247, 1)",
                ],
                borderWidth: 2,
                borderRadius: 8,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                padding: 12,
                cornerRadius: 8,
                titleFont: { size: 14, weight: "bold" },
                bodyFont: { size: 13 },
              },
            },
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: "rgba(0, 0, 0, 0.05)",
                },
              },
              x: {
                grid: {
                  display: false,
                },
              },
            },
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
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="mb-8">
        <motion.h1 
          className="text-4xl font-black text-gray-900 mb-2"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Dashboard Overview
        </motion.h1>
        <motion.p 
          className="text-gray-600 text-lg"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Welcome back! Here's what's happening with your platform.
        </motion.p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { 
            title: "Total Orders", 
            value: stats.totalOrders, 
            icon: <FaShoppingCart />,
            gradient: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-500",
            lightBg: "bg-blue-50",
          },
          { 
            title: "Total Users", 
            value: stats.totalUsers, 
            icon: <FaUsers />,
            gradient: "from-green-500 to-green-600",
            bgColor: "bg-green-500",
            lightBg: "bg-green-50",
          },
          { 
            title: "Total Items", 
            value: stats.totalItems, 
            icon: <FaBoxOpen />,
            gradient: "from-orange-500 to-orange-600",
            bgColor: "bg-orange-500",
            lightBg: "bg-orange-50",
          },
          { 
            title: "Total Galleries", 
            value: stats.totalGalleries, 
            icon: <FaImages />,
            gradient: "from-purple-500 to-purple-600",
            bgColor: "bg-purple-500",
            lightBg: "bg-purple-50",
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            className={`relative rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group ${stat.lightBg} border-2 border-transparent hover:border-${stat.bgColor.replace('bg-', '')}`}
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -5 }}
          >
            <div className="relative p-6">
              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl ${stat.bgColor} flex items-center justify-center mb-4 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-white text-3xl">{stat.icon}</span>
              </div>
              
              {/* Content */}
              <h3 className="text-gray-700 text-sm font-bold mb-2 uppercase tracking-wide">{stat.title}</h3>
              <p className={`text-5xl font-black ${stat.bgColor.replace('bg-', 'text-')}`}>
                {stat.value}
              </p>
              
              {/* Trend indicator */}
              <div className="mt-4 flex items-center gap-2">
                <div className={`px-3 py-1 ${stat.lightBg} rounded-full border-2 ${stat.bgColor.replace('bg-', 'border-')}`}>
                  <span className={`text-xs font-bold ${stat.bgColor.replace('bg-', 'text-')}`}>Active</span>
                </div>
              </div>
            </div>

            {/* Decorative Element */}
            <div className={`absolute -bottom-4 -right-4 w-32 h-32 ${stat.bgColor} opacity-10 rounded-full blur-2xl`}></div>
          </motion.div>
        ))}
      </div>

      {/* Graph Section */}
      <motion.div
        className="bg-white shadow-xl rounded-2xl p-6 md:p-8 mb-8 border-2 border-gray-200"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg">
            <FaChartLine className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-900">Analytics Overview</h2>
            <p className="text-gray-600 text-base font-semibold">Visual representation of your platform statistics</p>
          </div>
        </div>
        
        <div className="w-full h-[350px] sm:h-[400px] bg-gray-50 rounded-xl p-4">
          <canvas ref={chartRef} className="w-full h-full"></canvas>
        </div>
      </motion.div>

      {/* Recent Activity Section */}
      <motion.div
        className="bg-white shadow-xl rounded-2xl p-6 md:p-8 border-2 border-gray-200"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <FaClock className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-900">Recent Activity</h2>
            <p className="text-gray-600 text-base font-semibold">Latest updates and changes on your platform</p>
          </div>
        </div>
        
        {recentActivities.length > 0 ? (
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 group border-2 border-blue-200 hover:border-blue-400"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 mt-2 group-hover:scale-150 transition-transform duration-300 shadow-lg"></div>
                <div className="flex-1">
                  <p className="text-gray-900 font-bold text-base">{activity.message}</p>
                  <p className="text-gray-600 text-sm mt-2 flex items-center gap-2 font-semibold">
                    <FaClock className="text-blue-500" />
                    {activity.timestamp ? new Date(activity.timestamp).toLocaleString() : 'Recently'}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FaClock className="text-5xl text-blue-600" />
            </div>
            <p className="text-gray-700 text-xl font-bold">No recent activities available.</p>
          </div>
        )}
      </motion.div>

      {/* Footer */}
      <motion.footer 
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p className="text-gray-500 text-sm font-medium">
          © {new Date().getFullYear()} KV-Audio Admin Dashboard. All rights reserved.
        </p>
      </motion.footer>
    </motion.div>
  );
}
