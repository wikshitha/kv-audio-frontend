import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoMdCloseCircleOutline } from "react-icons/io";
import toast from "react-hot-toast";

export default function AdminMessagesPage() {
	const [inquiries, setInquiries] = useState([]);
	const [loading, setLoading] = useState(true);
	const [activeInquiry, setActiveInquiry] = useState(null);
	const [modalOpened, setModalOpened] = useState(false);
	const [responseText, setResponseText] = useState("");
	const [filterStatus, setFilterStatus] = useState("all"); // all, resolved, unresolved

	useEffect(() => {
		if (loading) {
			const token = localStorage.getItem("token");
			axios
				.get(`${import.meta.env.VITE_BACKEND_URL}/api/inquiries`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((res) => {
					setInquiries(res.data);
					setLoading(false);
				})
				.catch((err) => {
					console.error("Error fetching inquiries:", err);
				});
		}
	}, [loading]);

	const filteredInquiries = inquiries.filter((msg) => {
		if (filterStatus === "resolved") return msg.isResolved;
		if (filterStatus === "unresolved") return !msg.isResolved;
		return true;
	});

	const groupedByEmail = filteredInquiries.reduce((acc, inquiry) => {
		if (!acc[inquiry.email]) acc[inquiry.email] = [];
		acc[inquiry.email].push(inquiry);
		return acc;
	}, {});

	const formatDate = (dateStr) => {
		const date = new Date(dateStr);

		const options = { year: "numeric", month: "long", day: "numeric" };
		const formattedDate = date.toLocaleDateString("en-US", options); // 25 July 2025

		let hours = date.getHours();
		const minutes = date.getMinutes().toString().padStart(2, "0");
		const ampm = hours >= 12 ? "PM" : "AM";
		hours = hours % 12 || 12;

		const formattedTime = `${hours}:${minutes} ${ampm}`;
		return `${formattedDate} – ${formattedTime}`;
	};

	const openModal = (inquiry) => {
		setActiveInquiry(inquiry);
		setResponseText(inquiry.response || "");
		setModalOpened(true);
	};

	const handleSaveResponse = () => {
		const token = localStorage.getItem("token");

		axios
			.put(
				`${import.meta.env.VITE_BACKEND_URL}/api/inquiries/${activeInquiry.id}`,
				{
					response: responseText,
					isResolved: true,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			.then(() => {
				toast.success("Response saved and inquiry marked as resolved.");
				setModalOpened(false);
				setLoading(true);
			})
			.catch((err) => {
				toast.error("Error updating inquiry.");
				console.error("Error updating inquiry:", err);
			});
	};

	return (
		<div className="min-h-screen bg-gray-100 p-6">
			<h1 className="text-3xl font-bold text-gray-700 mb-4">Customer Inquiries</h1>

			{/* Filter Dropdown */}
			<div className="mb-4">
				<label className="mr-2 font-medium">Filter:</label>
				<select
					className="border border-gray-300 rounded px-3 py-1"
					value={filterStatus}
					onChange={(e) => setFilterStatus(e.target.value)}
				>
					<option value="all">All</option>
					<option value="resolved">Resolved</option>
					<option value="unresolved">Unresolved</option>
				</select>
			</div>

			{loading ? (
				<div className="flex justify-center items-center h-40">
					<div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
				</div>
			) : Object.keys(groupedByEmail).length > 0 ? (
				<div className="bg-white rounded-lg shadow-md p-4 space-y-6">
					{Object.entries(groupedByEmail).map(([email, messages]) => (
						<div key={email}>
							<h2 className="text-xl font-semibold text-purple-700 border-b pb-2 mb-2">{email}</h2>
							<div className="overflow-x-auto">
								<table className="min-w-full table-auto border-collapse border border-gray-300">
									<thead className="bg-purple-100 text-gray-700">
										<tr>
											<th className="px-4 py-2 text-left">ID</th>
											<th className="px-4 py-2 text-left">Phone</th>
											<th className="px-4 py-2 text-left">Date</th>
											<th className="px-4 py-2 text-left">Message</th>
											<th className="px-4 py-2 text-left">Response</th>
											<th className="px-4 py-2 text-left">Resolved</th>
										</tr>
									</thead>
									<tbody>
										{messages.map((inq, i) => (
											<tr
												key={inq.id}
												className={`${i % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 cursor-pointer`}
												onClick={() => openModal(inq)}
											>
												<td className="px-4 py-2">{inq.id}</td>
												<td className="px-4 py-2">{inq.phone}</td>
												<td className="px-4 py-2">{formatDate(inq.date)}</td>
												<td className="px-4 py-2 max-w-xs truncate">{inq.message}</td>
												<td className="px-4 py-2 max-w-xs truncate italic">{inq.response || "—"}</td>
												<td className="px-4 py-2">{inq.isResolved ? "Yes" : "No"}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					))}
				</div>
			) : (
				<p className="text-gray-600 text-center">No inquiries match this filter.</p>
			)}

			{/* Modal */}
			{modalOpened && activeInquiry && (
				<div className="fixed top-0 left-0 w-full h-full bg-[#00000075] flex justify-center items-center">
					<div className="w-[650px] bg-white p-6 rounded-lg shadow-lg relative">
						<IoMdCloseCircleOutline
							className="absolute top-4 right-4 text-3xl text-gray-500 cursor-pointer hover:text-red-600"
							onClick={() => setModalOpened(false)}
						/>
						<h2 className="text-2xl font-semibold mb-4">Inquiry ID #{activeInquiry.id}</h2>
						<div className="space-y-2 mb-4">
							<p><strong>Email:</strong> {activeInquiry.email}</p>
							<p><strong>Phone:</strong> {activeInquiry.phone}</p>
							<p><strong>Message:</strong> {activeInquiry.message}</p>
							<p><strong>Resolved:</strong> {activeInquiry.isResolved ? "Yes" : "No"}</p>
							<p><strong>Date:</strong> {formatDate(activeInquiry.date)}</p>
						</div>
						<div className="mb-4">
							<label className="block font-semibold mb-1">Response</label>
							<textarea
								value={responseText}
								onChange={(e) => setResponseText(e.target.value)}
								className="w-full border border-gray-300 rounded p-2 resize-y min-h-[100px]"
								placeholder="Type your response here..."
							></textarea>
						</div>
						<div className="flex justify-end">
							<button
								onClick={handleSaveResponse}
								className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
							>
								Save Response & Mark Resolved
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
