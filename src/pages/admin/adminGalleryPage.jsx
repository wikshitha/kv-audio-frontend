import axios from "axios";
import { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function AdminGalleryPage() {
	const [gallery, setGallery] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchGallery = async () => {
			try {
				const token = localStorage.getItem("token");
				const res = await axios.get(
					`${import.meta.env.VITE_BACKEND_URL}/api/gallery`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				setGallery(res.data);
			} catch (error) {
				console.error("Error fetching gallery:", error);
			} finally {
				setLoading(false);
			}
		};
		if (loading) {
			fetchGallery();
		}
	}, [loading]);

	const handleDelete = async (key) => {
		if (window.confirm("Are you sure you want to delete this item?")) {
			try {
				const token = localStorage.getItem("token");
				await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/gallery/${key}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setLoading(true);
			} catch (error) {
				console.error("Error deleting gallery:", error);
			}
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 p-6">
			<h1 className="text-3xl font-bold text-gray-700 mb-6">Gallery Management</h1>

			{loading ? (
				<div className="flex justify-center items-center h-40">
					<div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
				</div>
			) : gallery.length > 0 ? (
				<div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
					<table className="min-w-full table-auto border-collapse border border-gray-300">
						<thead className="bg-blue-100">
							<tr className="text-left text-gray-700">
								<th className="px-6 py-3 font-medium">Image</th>
								<th className="px-6 py-3 font-medium">Key</th>
								<th className="px-6 py-3 font-medium">Description</th>
								<th className="px-6 py-3 font-medium text-center">Actions</th>
							</tr>
						</thead>
						<tbody>
							{gallery.map((item, index) => (
								<tr
									key={item.key}
									className={`${
										index % 2 === 0 ? "bg-gray-50" : "bg-white"
									} hover:bg-gray-100 transition-all`}
								>
									<td className="px-6 py-3">
										<img
											src={item.image}
											alt={item.description}
											className="w-20 h-20 object-cover rounded-lg shadow"
										/>
									</td>
									<td className="px-6 py-3">{item.key}</td>
									<td className="px-6 py-3">{item.description}</td>
									<td className="px-6 py-3 text-center">
										<button
											onClick={() => handleDelete(item.key)}
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
				<p className="text-gray-600 text-center">No gallery items found. Add a new one!</p>
			)}

			<Link
				to="/admin/gallery/add"
				className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all"
			>
				<CiCirclePlus className="text-4xl" />
			</Link>
		</div>
	);
}
