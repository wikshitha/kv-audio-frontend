import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoMdCloseCircleOutline } from "react-icons/io";

export default function AdminReviewsPage() {
	const [reviews, setReviews] = useState([]);
	const [loading, setLoading] = useState(true);
	const [activeReview, setActiveReview] = useState(null);
	const [modalOpened, setModalOpened] = useState(false);

	useEffect(() => {
		if (loading) {
			const token = localStorage.getItem("token");
			axios
				.get(`${import.meta.env.VITE_BACKEND_URL}/api/reviews`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((res) => {
					setReviews(res.data);
					setLoading(false);
				})
				.catch((err) => {
					console.error("Error fetching reviews:", err);
				});
		}
	}, [loading]);

	const handleReviewApproval = (email) => {
		const token = localStorage.getItem("token");
		axios
			.put(`${import.meta.env.VITE_BACKEND_URL}/api/reviews/approve/${email}`, {}, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then(() => {
				alert("Review approved successfully");
				setModalOpened(false);
				setLoading(true);
			})
			.catch((err) => {
				console.error("Error approving review:", err);
			});
	};

	const handleReviewDeletion = (email) => {
		const token = localStorage.getItem("token");
		axios
			.delete(`${import.meta.env.VITE_BACKEND_URL}/api/reviews/${email}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then(() => {
				alert("Review deleted successfully");
				setModalOpened(false);
				setLoading(true);
			})
			.catch((err) => {
				console.error("Error deleting review:", err);
			});
	};

	return (
		<div className="min-h-screen bg-gray-100 p-6">
			<h1 className="text-3xl font-bold text-gray-700 mb-6">Manage Reviews</h1>

			{loading ? (
				<div className="flex justify-center items-center h-40">
					<div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
				</div>
			) : reviews.length > 0 ? (
				<div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
					<table className="min-w-full table-auto border-collapse border border-gray-300">
						<thead className="bg-blue-100">
							<tr className="text-left text-gray-700">
								<th className="px-6 py-3 font-medium">Reviewer</th>
								<th className="px-6 py-3 font-medium">Email</th>
								<th className="px-6 py-3 font-medium">Comment</th>
								<th className="px-6 py-3 font-medium">Rating</th>
								<th className="px-6 py-3 font-medium">Approval Status</th>
							</tr>
						</thead>
						<tbody>
							{reviews.map((review, index) => (
								<tr
									key={review._id}
									className={`${
										index % 2 === 0 ? "bg-gray-50" : "bg-white"
									} hover:bg-gray-100 transition-all cursor-pointer`}
									onClick={() => {
										setActiveReview(review);
										setModalOpened(true);
									}}
								>
									<td className="px-6 py-3">{review.name}</td>
									<td className="px-6 py-3">{review.email}</td>
									<td className="px-6 py-3 truncate max-w-xs">{review.comment}</td>
									<td className="px-6 py-3">{review.rating} Stars</td>
									<td className="px-6 py-3">{review.isApproved ? "Approved" : "Pending"}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : (
				<p className="text-gray-600 text-center">No reviews found.</p>
			)}

			{modalOpened && activeReview && (
				<div className="fixed top-0 left-0 w-full h-full bg-[#00000075] flex justify-center items-center">
					<div className="w-[600px] bg-white p-6 rounded-lg shadow-lg relative">
						<IoMdCloseCircleOutline
							className="absolute top-4 right-4 text-3xl text-gray-500 cursor-pointer hover:text-red-600"
							onClick={() => setModalOpened(false)}
						/>
						<h2 className="text-2xl font-semibold mb-4">Review Details</h2>
						<div className="space-y-2 mb-6">
							<p>
								<strong>Reviewer:</strong> {activeReview.name}
							</p>
							<p>
								<strong>Email:</strong> {activeReview.email}
							</p>
							<p>
								<strong>Comment:</strong> {activeReview.comment}
							</p>
							<p>
								<strong>Rating:</strong> {activeReview.rating} Stars
							</p>
							<p>
								<strong>Status:</strong> {activeReview.isApproved ? "Approved" : "Pending"}
							</p>
						</div>
						<div className="flex justify-end space-x-4">
							{!activeReview.isApproved && (
								<button
									onClick={() => handleReviewApproval(activeReview.email)}
									className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
								>
									Approve
								</button>
							)}
							<button
								onClick={() => handleReviewDeletion(activeReview.email)}
								className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
