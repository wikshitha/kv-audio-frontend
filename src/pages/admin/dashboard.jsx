import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Chart } from "chart.js/auto";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalOrders: "0",
    totalUsers: "0",
    totalItems: "0",
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const chartRef = useRef(null);
  const chartInstance = useRef(null); // Store chart instance

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchDashboardData = async () => {
      try {
        // Fetch stats
        const statsResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/stats`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStats(statsResponse.data);

        // Fetch recent activities
        const activitiesResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/recent-activities`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRecentActivities(activitiesResponse.data);

        // Handle chart rendering
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
        chartInstance.current = new Chart(chartRef.current, {
          type: "bar",
          data: {
            labels: ["Orders", "Users", "Items"],
            datasets: [
              {
                label: "Count",
                data: [
                  parseInt(statsResponse.data.totalOrders, 10),
                  parseInt(statsResponse.data.totalUsers, 10),
                  parseInt(statsResponse.data.totalItems, 10),
                ],
                backgroundColor: ["#4CAF50", "#2196F3", "#FF9800"],
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: false },
            },
          },
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();

    // Cleanup on component unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="w-full h-full p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6">
        <div className="p-6 bg-white shadow-lg rounded-xl text-center">
          <h2 className="text-xl font-bold">Total Orders</h2>
          <p className="text-2xl mt-4">{stats.totalOrders}</p>
        </div>
        <div className="p-6 bg-white shadow-lg rounded-xl text-center">
          <h2 className="text-xl font-bold">Total Users</h2>
          <p className="text-2xl mt-4">{stats.totalUsers}</p>
        </div>
        <div className="p-6 bg-white shadow-lg rounded-xl text-center">
          <h2 className="text-xl font-bold">Total Items</h2>
          <p className="text-2xl mt-4">{stats.totalItems}</p>
        </div>
      </div>

      {/* Graph */}
      <div className="mt-8 bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Overview Chart</h2>
        <canvas ref={chartRef} className="w-full h-64"></canvas>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8 bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <ul className="list-disc list-inside">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity, index) => (
              <li key={index}>
                {activity.message} -{" "}
                <span className="text-gray-500 text-sm">
                  {new Date(activity.timestamp).toLocaleString()}
                </span>
              </li>
            ))
          ) : (
            <li>No recent activities available.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
