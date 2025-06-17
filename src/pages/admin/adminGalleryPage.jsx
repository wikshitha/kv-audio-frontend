import axios from "axios";
import { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { Link } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";



export default function AdminGalleryPage() {
	const [gallery, setgallery] = useState([]);
	const [galleryLoaded, setgalleryLoaded] = useState(false);

	useEffect(() => {
		if (!galleryLoaded) {
			const token = localStorage.getItem("token");
			axios
				.get(`${import.meta.env.VITE_BACKEND_URL}/api/gallery`, {
					headers: { Authorization: `Bearer ${token}` },
				})
				.then((res) => {
					console.log(res.data);
					setgallery(res.data);
					setgalleryLoaded(true);
				})
				.catch((err) => {
					console.error(err);
				});
		}
	}, [galleryLoaded]);

	const handleDelete = (key) => {
		if (window.confirm("Are you sure you want to delete this item?")) {
			setgallery(gallery.filter((gallery) => gallery.key !== key));
			const token = localStorage.getItem("token");
			axios
				.delete(`${import.meta.env.VITE_BACKEND_URL}/api/gallery/${key}`, {
					headers: { Authorization: `Bearer ${token}` },
				})
				.then((res) => {
					console.log(res.data);
					setgalleryLoaded(false);
				})
				.catch((err) => {
					console.error(err);
				});
		}
	};

	return (
		<div className="w-full h-full p-4 relative flex items-center flex-col">
			{!galleryLoaded && (
				<div className="border-4 my-4 border-b-green-500 rounded-full animate-spin bg-0 w-[100px] h-[100px] "></div>
			)}
			{galleryLoaded && (
				<div className="overflow-x-auto ">
					<table className="w-full max-w-full border border-gray-300 rounded-lg shadow-md bg-white">
						<thead className="bg-gray-100">
							<tr className="text-left text-gray-700">
								<th className="p-3 border">Key</th>
								<th className="p-3 border">Description</th>
								<th className="p-3 border text-center">Actions</th>
							</tr>
						</thead>
						<tbody>
							{gallery.map((gallery, index) => (
								<tr
									key={gallery.key}
									className={`border ${
										index % 2 === 0 ? "bg-gray-50" : "bg-white"
									} hover:bg-gray-200 transition-all`}
								>
									<td className="p-3 border">{gallery.key}</td>
									<td className="p-3 border">{gallery.description}</td>
									<td className="p-3 border flex justify-center gap-3">
										<button
											onClick={() => handleDelete(gallery.key)}
											className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
										>
											<FaTrashAlt className="inline mr-1" /> Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			<Link to="/admin/gallery/add" className="fixed bottom-6 right-6">
				<CiCirclePlus className="text-[70px] text-blue-600 hover:text-red-900 transition duration-200 cursor-pointer" />
			</Link>
		</div>
	);
}
