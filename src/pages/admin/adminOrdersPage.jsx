import axios from "axios";
import { useEffect, useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";

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
            alert(`Order ${status}`);
            setModalOpened(false);
            setLoading(true);
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    const getStatusBadge = (status) => {
        let bgColor = "bg-gray-300";
        if (status === "approved") bgColor = "bg-green-500 text-white";
        else if (status === "pending") bgColor = "bg-yellow-500 text-white";
        else if (status === "rejected") bgColor = "bg-red-500 text-white";

        return (
            <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${bgColor}`}
            >
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-gray-700 mb-6">Manage Orders</h1>

            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : orders.length > 0 ? (
                <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
                    <table className="min-w-full table-auto border-collapse border border-gray-300">
                        <thead className="bg-blue-100">
                            <tr className="text-left text-gray-700">
                                <th className="px-6 py-3 font-medium">Order ID</th>
                                <th className="px-6 py-3 font-medium">Email</th>
                                <th className="px-6 py-3 font-medium">Days</th>
                                <th className="px-6 py-3 font-medium">Start Date</th>
                                <th className="px-6 py-3 font-medium">End Date</th>
                                <th className="px-6 py-3 font-medium">Total Amount</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium">Order Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => (
                                <tr
                                    key={order._id}
                                    className={`${
                                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                    } hover:bg-gray-100 transition-all cursor-pointer`}
                                    onClick={() => {
                                        setActiveOrder(order);
                                        setModalOpened(true);
                                    }}
                                >
                                    <td className="px-6 py-3">{order.orderId}</td>
                                    <td className="px-6 py-3">{order.email}</td>
                                    <td className="px-6 py-3">{order.days}</td>
                                    <td className="px-6 py-3">
                                        {new Date(order.startingDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-3">
                                        {new Date(order.endingDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-3">${order.totalAmount.toFixed(2)}</td>
                                    <td className="px-6 py-3">{getStatusBadge(order.status)}</td>
                                    <td className="px-6 py-3">
                                        {new Date(order.orderDate).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-600 text-center">No orders found.</p>
            )}

            {modalOpened && activeOrder && (
                <div className="fixed top-0 left-0 w-full h-full bg-[#00000075] flex justify-center items-center">
                    <div className="w-[600px] bg-white p-6 rounded-lg shadow-lg relative">
                        <IoMdCloseCircleOutline
                            className="absolute top-4 right-4 text-3xl text-gray-500 cursor-pointer hover:text-red-600"
                            onClick={() => setModalOpened(false)}
                        />
                        <h2 className="text-2xl font-semibold mb-4">Order Details</h2>
                        <div className="space-y-2 mb-6">
                            <p>
                                <strong>Order ID:</strong> {activeOrder.orderId}
                            </p>
                            <p>
                                <strong>Email:</strong> {activeOrder.email}
                            </p>
                            <p>
                                <strong>Days:</strong> {activeOrder.days}
                            </p>
                            <p>
                                <strong>Start Date:</strong>{" "}
                                {new Date(activeOrder.startingDate).toLocaleDateString()}
                            </p>
                            <p>
                                <strong>End Date:</strong>{" "}
                                {new Date(activeOrder.endingDate).toLocaleDateString()}
                            </p>
                            <p>
                                <strong>Total Amount:</strong> ${activeOrder.totalAmount.toFixed(2)}
                            </p>
                            <p>
                                <strong>Status:</strong> {activeOrder.status}
                            </p>
                            <p>
                                <strong>Order Date:</strong>{" "}
                                {new Date(activeOrder.orderDate).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex justify-end space-x-4 mb-4">
                            <button
                                onClick={() => handleOrderStatusChange(activeOrder.orderId, "approved")}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => handleOrderStatusChange(activeOrder.orderId, "rejected")}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                Reject
                            </button>
                        </div>
                        <table className="w-full border-collapse border border-gray-300">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-4 py-2">Product</th>
                                    <th className="px-4 py-2">Qty</th>
                                    <th className="px-4 py-2">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeOrder.orderedItems.map((item) => (
                                    <tr key={item.product.key}>
                                        <td className="px-4 py-2 flex items-center space-x-3">
                                            <img
                                                src={item.product.image}
                                                alt={item.product.name}
                                                className="w-10 h-10 rounded"
                                            />
                                            <span>{item.product.name}</span>
                                        </td>
                                        <td className="px-4 py-2">{item.quantity}</td>
                                        <td className="px-4 py-2">${item.product.price.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
