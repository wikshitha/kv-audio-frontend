import axios from "axios";
import { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaBoxOpen, FaCheckCircle, FaTimesCircle, FaPlus, FaTag, FaRulerCombined } from "react-icons/fa";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function AdminItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(res.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };
    if (loading) fetchItems();
  }, [loading]);

  const handleDelete = async (key) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/products/${key}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Item deleted successfully!");
        setLoading(true);
      } catch (error) {
        console.error("Error deleting item:", error);
        toast.error("Failed to delete item");
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <motion.div 
          className="flex items-center justify-between mb-3"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
              <FaBoxOpen className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900">Manage Items</h1>
              <p className="text-gray-600 text-lg font-semibold">View and manage all equipment</p>
            </div>
          </div>
          <Link
            to="/admin/items/add"
            className="hidden md:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <FaPlus />
            Add New Item
          </Link>
        </motion.div>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-64 bg-white rounded-2xl shadow-xl">
          <div className="relative w-20 h-20 mb-4">
            <div className="absolute inset-0 border-4 border-purple-200 rounded-full animate-ping opacity-20"></div>
            <div className="absolute inset-0 border-4 border-t-purple-500 border-r-indigo-500 border-b-purple-500 border-l-indigo-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-semibold text-lg">Loading items...</p>
        </div>
      ) : items.length > 0 ? (
        <motion.div 
          className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-200"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="overflow-x-auto overflow-y-visible">
            <table className="min-w-full table-auto">
              <thead className="bg-gradient-to-r from-purple-500 to-indigo-600">
                <tr className="text-left text-white">
                  <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Image</th>
                  <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Item ID</th>
                  <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((product, index) => (
                  <motion.tr
                    key={product.key}
                    className="hover:bg-purple-50 transition-all group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="px-6 py-4">
                      <img
                        src={product.images?.[0] || "/placeholder.png"}
                        alt={product.name}
                        className="w-16 h-16 rounded-xl object-cover border-2 border-gray-200 shadow-md group-hover:scale-110 transition-transform duration-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-purple-600 group-hover:text-purple-700">
                        #{product.key}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900">{product.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaTag className="text-green-600" />
                        <span className="font-black text-green-600 text-lg">
                          LKR {product.price.toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {product.availability ? (
                        <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg inline-flex items-center gap-2">
                          <FaCheckCircle />
                          Available
                        </span>
                      ) : (
                        <span className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold text-sm shadow-lg inline-flex items-center gap-2">
                          <FaTimesCircle />
                          Unavailable
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => navigate(`/admin/items/edit`, { state: product })}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 whitespace-nowrap"
                          title="Edit item"
                        >
                          <FaEdit />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.key)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 whitespace-nowrap"
                          title="Delete item"
                        >
                          <FaTrashAlt />
                          Delete
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          className="bg-white rounded-2xl shadow-xl p-12 text-center border-2 border-gray-200"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaBoxOpen className="text-5xl text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Items Found</h3>
          <p className="text-gray-600 text-lg mb-6">Add new items to get started!</p>
          <Link
            to="/admin/items/add"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <FaPlus />
            Add New Item
          </Link>
        </motion.div>
      )}

      {/* Floating Add Button (Mobile) */}
      <Link
        to="/admin/items/add"
        className="md:hidden fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center z-50"
        aria-label="Add new item"
      >
        <FaPlus className="text-2xl" />
      </Link>
      </div>
    </motion.div>
  );
}
