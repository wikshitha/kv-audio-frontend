import axios from "axios";
import { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

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
				setLoading(true);
			} catch (error) {
				console.error("Error deleting item:", error);
			}
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 p-6">
			<h1 className="text-3xl font-bold text-gray-700 mb-6">Manage Items</h1>

			{loading ? (
				<div className="flex justify-center items-center h-40">
					<div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
				</div>
			) : items.length > 0 ? (
				<div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
					<table className="min-w-full table-auto border-collapse border border-gray-300">
						<thead className="bg-blue-100">
							<tr className="text-left text-gray-700">
								<th className="px-6 py-3 font-medium">Key</th>
								<th className="px-6 py-3 font-medium">Name</th>
								<th className="px-6 py-3 font-medium">Price</th>
								<th className="px-6 py-3 font-medium">Category</th>
								<th className="px-6 py-3 font-medium">Dimensions</th>
								<th className="px-6 py-3 font-medium">Availability</th>
								<th className="px-6 py-3 font-medium text-center">Actions</th>
							</tr>
						</thead>
						<tbody>
							{items.map((product, index) => (
								<tr
									key={product.key}
									className={`${
										index % 2 === 0 ? "bg-gray-50" : "bg-white"
									} hover:bg-gray-100 transition-all`}
								>
									<td className="px-6 py-3">{product.key}</td>
									<td className="px-6 py-3">{product.name}</td>
									<td className="px-6 py-3">${product.price.toFixed(2)}</td>
									<td className="px-6 py-3">{product.category}</td>
									<td className="px-6 py-3">{product.dimensions}</td>
									<td className="px-6 py-3">
										<span
											className={`px-2 py-1 rounded text-sm font-medium ${
												product.availability
													? "bg-green-100 text-green-700"
													: "bg-red-100 text-red-700"
											}`}
										>
											{product.availability ? "Available" : "Not Available"}
										</span>
									</td>
									<td className="px-6 py-3 flex justify-center gap-3">
										<button
											onClick={() => navigate(`/admin/items/edit`, { state: product })}
											className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-all"
										>
											<FaEdit className="inline mr-2" />
											Edit
										</button>
										<button
											onClick={() => handleDelete(product.key)}
											className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition-all"
										>
											<FaTrashAlt className="inline mr-2" />
											Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : (
				<p className="text-gray-600 text-center">No items found. Add new items to get started!</p>
			)}

			<Link
				to="/admin/items/add"
				className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all"
			>
				<CiCirclePlus className="text-4xl" />
			</Link>
		</div>
	);
}
