import axios from "axios";
import { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { FaTrashAlt, FaImage, FaPlus, FaKey, FaAlignLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

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
		if (window.confirm("Are you sure you want to delete this gallery item?")) {
			try {
				const token = localStorage.getItem("token");
				await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/gallery/${key}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				toast.success("Gallery item deleted successfully");
				setLoading(true);
			} catch (error) {
				console.error("Error deleting gallery:", error);
				toast.error("Failed to delete gallery item");
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
				<motion.div 
					className="mb-8 flex items-center justify-between"
					initial={{ y: -20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.5 }}
				>
					<div className="flex items-center gap-4">
						<div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-xl">
							<FaImage className="text-white text-2xl" />
						</div>
						<div>
							<h1 className="text-4xl font-black text-gray-900">Gallery Management</h1>
							<p className="text-gray-600 text-lg font-semibold">Manage your gallery images</p>
						</div>
					</div>
					
					{/* Desktop Add Button */}
					<Link
						to="/admin/gallery/add"
						className="hidden md:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
					>
						<FaPlus />
						Add New Image
					</Link>
				</motion.div>

				{loading ? (
					<div className="flex flex-col justify-center items-center h-64 gap-4">
						<div className="relative w-20 h-20">
							<div className="absolute inset-0 border-4 border-t-pink-500 border-r-rose-500 border-b-pink-500 border-l-rose-500 rounded-full animate-spin"></div>
						</div>
						<p className="text-gray-600 font-semibold text-lg">Loading gallery...</p>
					</div>
				) : gallery.length > 0 ? (
					<motion.div 
						className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-200"
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						<div className="overflow-x-auto overflow-y-visible">
							<table className="min-w-full table-auto">
								<thead className="bg-gradient-to-r from-pink-500 to-rose-600">
									<tr className="text-left text-white">
										<th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Image</th>
										<th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Key</th>
										<th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Description</th>
										<th className="px-6 py-4 font-bold text-sm uppercase tracking-wider text-center">Actions</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									{gallery.map((item, index) => (
										<motion.tr
											key={item.key}
											className="hover:bg-pink-50 transition-all group"
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: index * 0.05 }}
										>
											<td className="px-6 py-4">
												<img
													src={item.image}
													alt={item.description}
													className="w-24 h-24 object-cover rounded-xl border-2 border-pink-200 shadow-md group-hover:scale-110 transition-transform duration-300"
												/>
											</td>
											<td className="px-6 py-4">
												<div className="flex items-center gap-2">
													<FaKey className="text-pink-500" />
													<span className="font-bold text-gray-900">{item.key}</span>
												</div>
											</td>
											<td className="px-6 py-4">
												<div className="flex items-start gap-2 max-w-md">
													<FaAlignLeft className="text-gray-400 text-sm mt-1 flex-shrink-0" />
													<p className="text-gray-700 font-semibold line-clamp-2" title={item.description}>
														{item.description}
													</p>
												</div>
											</td>
											<td className="px-6 py-4">
												<div className="flex justify-center">
													<button
														onClick={() => handleDelete(item.key)}
														className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 whitespace-nowrap"
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
						<div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<FaImage className="text-pink-500 text-4xl" />
						</div>
						<h2 className="text-2xl font-bold text-gray-900 mb-2">No Gallery Items Found</h2>
						<p className="text-gray-600 mb-6">Start by adding your first gallery image!</p>
						<Link
							to="/admin/gallery/add"
							className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
						>
							<FaPlus />
							Add First Image
						</Link>
					</motion.div>
				)}

				{/* Floating Add Button (Mobile) */}
				<Link
					to="/admin/gallery/add"
					className="md:hidden fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center z-50"
					aria-label="Add new gallery image"
				>
					<FaPlus className="text-2xl" />
				</Link>
			</div>
		</motion.div>
	);
}
