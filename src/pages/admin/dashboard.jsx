import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalItems: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/users/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.error("Error fetching dashboard stats:", err);
      });
  }, []);

  return (
    <div className="w-full h-full p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="p-6 bg-white shadow-lg rounded-xl flex flex-col items-center">
          <h2 className="text-xl font-bold">Total Orders</h2>
          <p className="text-2xl mt-4">{stats.totalOrders}</p>
        </div>
        <div className="p-6 bg-white shadow-lg rounded-xl flex flex-col items-center">
          <h2 className="text-xl font-bold">Total Users</h2>
          <p className="text-2xl mt-4">{stats.totalUsers}</p>
        </div>
        <div className="p-6 bg-white shadow-lg rounded-xl flex flex-col items-center">
          <h2 className="text-xl font-bold">Total Items</h2>
          <p className="text-2xl mt-4">{stats.totalItems}</p>
        </div>
      </div>
    </div>
  );
}
