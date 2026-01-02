import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FaShoppingCart, FaCheckCircle, FaTimesCircle, FaClock, FaCalendarAlt, FaUser, FaMoneyBillWave, FaBoxOpen } from "react-icons/fa";
import { motion } from "framer-motion";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeOrder, setActiveOrder] = useState(null);
  const [modalOpened, setModalOpened] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    if (loading) fetchOrders();
  }, [loading]);

  const handleOrderStatusChange = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/status/${orderId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`Order ${status}`);
      setModalOpened(false);
      setLoading(true);
    } catch (error) {
      toast.error("Error updating order status");
      console.error("Error updating order status:", error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: {
        bg: "bg-gradient-to-r from-green-500 to-green-600",
        icon: <FaCheckCircle className="inline mr-1" />,
        text: "Approved"
      },
      pending: {
        bg: "bg-gradient-to-r from-yellow-500 to-orange-500",
        icon: <FaClock className="inline mr-1" />,
        text: "Pending"
      },
      rejected: {
        bg: "bg-gradient-to-r from-red-500 to-red-600",
        icon: <FaTimesCircle className="inline mr-1" />,
        text: "Rejected"
      }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span className={`px-4 py-2 text-sm font-bold rounded-xl ${config.bg} text-white shadow-lg inline-flex items-center`}>
        {config.icon}
        {config.text}
      </span>
    );
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="mb-8">
        <motion.div 
          className="flex items-center gap-4 mb-3"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
            <FaShoppingCart className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-gray-900">Manage Orders</h1>
            <p className="text-gray-600 text-lg font-semibold">View and manage all customer orders</p>
          </div>
        </motion.div>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-64 bg-white rounded-2xl shadow-xl">
          <div className="relative w-20 h-20 mb-4">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-ping opacity-20"></div>
            <div className="absolute inset-0 border-4 border-t-blue-500 border-r-indigo-500 border-b-blue-500 border-l-indigo-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-semibold text-lg">Loading orders...</p>
        </div>
      ) : orders.length > 0 ? (
        <motion.div 
          className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-200"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-blue-500 to-indigo-600">
                <tr className="text-left text-white">
                  <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Rental Period</th>
                  <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Order Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order, index) => (
                  <motion.tr
                    key={order._id}
                    className="hover:bg-blue-50 transition-all cursor-pointer group"
                    onClick={() => {
                      setActiveOrder(order);
                      setModalOpened(true);
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <td className="px-6 py-4">
                      <span className="font-bold text-blue-600 group-hover:text-blue-700">
                        #{order.orderId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaUser className="text-gray-400" />
                        <span className="font-semibold text-gray-800">{order.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaClock className="text-orange-500" />
                        <span className="font-bold text-gray-900">{order.days} Days</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm">
                          <FaCalendarAlt className="text-green-500 text-xs" />
                          <span className="text-gray-700 font-semibold">
                            {new Date(order.startingDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <FaCalendarAlt className="text-red-500 text-xs" />
                          <span className="text-gray-700 font-semibold">
                            {new Date(order.endingDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaMoneyBillWave className="text-green-600" />
                        <span className="font-black text-green-600 text-lg">
                          LKR {order.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600 font-semibold">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </span>
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
            <FaShoppingCart className="text-5xl text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Orders Found</h3>
          <p className="text-gray-600 text-lg">There are no orders to display at the moment.</p>
        </motion.div>
      )}

      {modalOpened && activeOrder && (
        <motion.div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="bg-white rounded-3xl shadow-2xl relative max-w-4xl w-full max-h-[90vh] overflow-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-t-3xl z-10">
              <button
                onClick={() => setModalOpened(false)}
                className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-xl flex items-center justify-center transition-all duration-300 group"
              >
                <IoMdCloseCircleOutline className="text-white text-3xl group-hover:scale-110 transition-transform" />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                  <FaShoppingCart className="text-white text-3xl" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white">Order Details</h2>
                  <p className="text-white/80 font-semibold">Order #{activeOrder.orderId}</p>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              {/* Order Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border-2 border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <FaUser className="text-blue-600 text-xl" />
                    <span className="text-gray-600 font-bold text-sm">Customer</span>
                  </div>
                  <p className="text-gray-900 font-black text-lg">{activeOrder.email}</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-5 border-2 border-orange-200">
                  <div className="flex items-center gap-3 mb-2">
                    <FaClock className="text-orange-600 text-xl" />
                    <span className="text-gray-600 font-bold text-sm">Duration</span>
                  </div>
                  <p className="text-gray-900 font-black text-lg">{activeOrder.days} Days</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border-2 border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <FaCalendarAlt className="text-green-600 text-xl" />
                    <span className="text-gray-600 font-bold text-sm">Start Date</span>
                  </div>
                  <p className="text-gray-900 font-black text-lg">
                    {new Date(activeOrder.startingDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-5 border-2 border-red-200">
                  <div className="flex items-center gap-3 mb-2">
                    <FaCalendarAlt className="text-red-600 text-xl" />
                    <span className="text-gray-600 font-bold text-sm">End Date</span>
                  </div>
                  <p className="text-gray-900 font-black text-lg">
                    {new Date(activeOrder.endingDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-5 border-2 border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <FaMoneyBillWave className="text-purple-600 text-xl" />
                    <span className="text-gray-600 font-bold text-sm">Total Amount</span>
                  </div>
                  <p className="text-green-600 font-black text-2xl">LKR {activeOrder.totalAmount.toFixed(2)}</p>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-5 border-2 border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <FaClock className="text-gray-600 text-xl" />
                    <span className="text-gray-600 font-bold text-sm">Order Date</span>
                  </div>
                  <p className="text-gray-900 font-black text-lg">
                    {new Date(activeOrder.orderDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 mb-8 border-2 border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <p className="text-gray-600 font-bold text-sm mb-2">Current Status</p>
                    {getStatusBadge(activeOrder.status)}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <button
                      onClick={() => handleOrderStatusChange(activeOrder.orderId, "approved")}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <FaCheckCircle />
                      Approve Order
                    </button>
                    <button
                      onClick={() => handleOrderStatusChange(activeOrder.orderId, "rejected")}
                      className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <FaTimesCircle />
                      Reject Order
                    </button>
                  </div>
                </div>
              </div>

              {/* Ordered Items */}
              <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
                  <div className="flex items-center gap-3">
                    <FaBoxOpen className="text-white text-2xl" />
                    <h3 className="text-xl font-black text-white">Ordered Items</h3>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b-2 border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left font-bold text-gray-700 text-sm uppercase">Product</th>
                        <th className="px-6 py-4 text-center font-bold text-gray-700 text-sm uppercase">Quantity</th>
                        <th className="px-6 py-4 text-right font-bold text-gray-700 text-sm uppercase">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {activeOrder.orderedItems.map((item, index) => (
                        <tr key={item.product.key} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-16 h-16 rounded-xl object-cover border-2 border-gray-200 shadow-md"
                              />
                              <span className="font-bold text-gray-900">{item.product.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="px-4 py-2 bg-blue-100 text-blue-700 font-black rounded-xl">
                              {item.quantity}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="font-black text-green-600 text-lg">
                              LKR {item.product.price.toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
