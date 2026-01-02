import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoMdCloseCircleOutline } from "react-icons/io";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaPhone, FaComment, FaCheckCircle, FaTimesCircle, FaReply, FaSave, FaFilter, FaClock, FaEye } from "react-icons/fa";

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
		<motion.div 
			className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
		>
			<div className="max-w-[1600px] mx-auto">
				{/* Header */}
				<motion.div 
					className="mb-8"
					initial={{ y: -20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.5 }}
				>
					<div className="flex items-center gap-4 mb-6">
						<div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
							<FaEnvelope className="text-white text-2xl" />
						</div>
						<div>
							<h1 className="text-4xl font-black text-gray-900">Customer Inquiries</h1>
							<p className="text-gray-600 text-lg font-semibold">Manage and respond to customer messages</p>
						</div>
					</div>

					{/* Filter Section */}
					<motion.div 
						className="bg-white rounded-xl shadow-md border-2 border-gray-200 p-4"
						initial={{ y: 10, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.2 }}
					>
						<div className="flex items-center gap-3">
							<FaFilter className="text-purple-500 text-lg" />
							<label className="font-bold text-gray-700">Filter by Status:</label>
							<select
								className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none font-semibold bg-white"
								value={filterStatus}
								onChange={(e) => setFilterStatus(e.target.value)}
							>
								<option value="all">All Inquiries</option>
								<option value="resolved">Resolved</option>
								<option value="unresolved">Unresolved</option>
							</select>
							<div className="ml-auto flex items-center gap-2 text-sm font-semibold">
								<span className="text-gray-600">Total:</span>
								<span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg">
									{filteredInquiries.length}
								</span>
							</div>
						</div>
					</motion.div>
				</motion.div>

				{loading ? (
					<div className="flex flex-col justify-center items-center h-64 gap-4">
						<div className="relative w-20 h-20">
							<div className="absolute inset-0 border-4 border-t-purple-500 border-r-indigo-500 border-b-purple-500 border-l-indigo-500 rounded-full animate-spin"></div>
						</div>
						<p className="text-gray-600 font-semibold text-lg">Loading inquiries...</p>
					</div>
				) : Object.keys(groupedByEmail).length > 0 ? (
					<div className="space-y-6">
						{Object.entries(groupedByEmail).map(([email, messages], groupIndex) => (
							<motion.div 
								key={email}
								className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-200"
								initial={{ y: 20, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ duration: 0.5, delay: 0.3 + groupIndex * 0.1 }}
							>
								{/* Email Header */}
								<div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4">
									<div className="flex items-center gap-3">
										<FaEnvelope className="text-white text-xl" />
										<h2 className="text-2xl font-black text-white">{email}</h2>
										<span className="ml-auto px-3 py-1 bg-white bg-opacity-20 text-white rounded-lg font-bold text-sm">
											{messages.length} {messages.length === 1 ? 'message' : 'messages'}
										</span>
									</div>
								</div>

								{/* Messages Table */}
								<div className="overflow-x-auto overflow-y-visible">
									<table className="min-w-full table-auto">
										<thead className="bg-gray-50 border-b-2 border-gray-200">
											<tr className="text-left text-gray-700">
												<th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">ID</th>
												<th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Phone</th>
												<th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Date</th>
												<th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Message</th>
												<th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Response</th>
												<th className="px-6 py-4 font-bold text-sm uppercase tracking-wider text-center">Status</th>
												<th className="px-6 py-4 font-bold text-sm uppercase tracking-wider text-center">Actions</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-gray-200">
											{messages.map((inq, i) => (
												<motion.tr
													key={inq.id}
													className="hover:bg-purple-50 transition-all group"
													initial={{ opacity: 0, x: -20 }}
													animate={{ opacity: 1, x: 0 }}
													transition={{ delay: i * 0.05 }}
												>
													<td className="px-6 py-4">
														<span className="font-bold text-purple-600">#{inq.id}</span>
													</td>
													<td className="px-6 py-4">
														<div className="flex items-center gap-2">
															<FaPhone className="text-gray-400 text-sm" />
															<span className="text-gray-700 font-semibold">{inq.phone}</span>
														</div>
													</td>
													<td className="px-6 py-4">
														<div className="flex items-center gap-2">
															<FaClock className="text-gray-400 text-sm" />
															<span className="text-gray-700 font-semibold text-sm">{formatDate(inq.date)}</span>
														</div>
													</td>
													<td className="px-6 py-4">
														<div className="flex items-start gap-2 max-w-md">
															<FaComment className="text-gray-400 text-sm mt-1 flex-shrink-0" />
															<p className="text-gray-700 font-semibold line-clamp-2" title={inq.message}>
																{inq.message}
															</p>
														</div>
													</td>
													<td className="px-6 py-4">
														<div className="flex items-start gap-2 max-w-md">
															<FaReply className="text-gray-400 text-sm mt-1 flex-shrink-0" />
															<p className="text-gray-600 font-semibold italic line-clamp-2" title={inq.response || "No response yet"}>
																{inq.response || "—"}
															</p>
														</div>
													</td>
													<td className="px-6 py-4">
														<div className="flex justify-center">
															{inq.isResolved ? (
																<span className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg inline-flex items-center gap-2">
																	<FaCheckCircle />
																	Resolved
																</span>
															) : (
																<span className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold text-sm shadow-lg inline-flex items-center gap-2">
																	<FaTimesCircle />
																	Pending
																</span>
															)}
														</div>
													</td>
													<td className="px-6 py-4">
														<div className="flex justify-center">
															<button
																onClick={() => openModal(inq)}
																className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 whitespace-nowrap"
															>
																<FaEye />
																View
															</button>
														</div>
													</td>
												</motion.tr>
											))}
										</tbody>
									</table>
								</div>
							</motion.div>
						))}
					</div>
				) : (
					<motion.div 
						className="bg-white rounded-2xl shadow-xl p-12 text-center border-2 border-gray-200"
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ duration: 0.5 }}
					>
						<div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<FaEnvelope className="text-purple-500 text-4xl" />
						</div>
						<h2 className="text-2xl font-bold text-gray-900 mb-2">No Inquiries Found</h2>
						<p className="text-gray-600">
							{filterStatus === "all" 
								? "There are no customer inquiries yet." 
								: `No ${filterStatus} inquiries found.`}
						</p>
					</motion.div>
				)}

				{/* Modal */}
				<AnimatePresence>
					{modalOpened && activeInquiry && (
						<motion.div 
							className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 overflow-y-auto"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setModalOpened(false)}
						>
							<motion.div 
								className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl relative my-8 max-h-[calc(100vh-4rem)] overflow-hidden flex flex-col"
								initial={{ scale: 0.9, y: 20 }}
								animate={{ scale: 1, y: 0 }}
								exit={{ scale: 0.9, y: 20 }}
								onClick={(e) => e.stopPropagation()}
							>
								{/* Modal Header */}
								<div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white flex-shrink-0">
									<IoMdCloseCircleOutline
										className="absolute top-4 right-4 text-4xl cursor-pointer hover:rotate-90 transition-transform duration-300 z-10"
										onClick={() => setModalOpened(false)}
									/>
									<div className="flex items-center gap-4">
										<div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
											<FaEnvelope className="text-3xl" />
										</div>
										<div>
											<h2 className="text-3xl font-black">Inquiry Details</h2>
											<p className="text-purple-100 font-semibold">ID #{activeInquiry.id}</p>
										</div>
									</div>
								</div>

								{/* Modal Body - Scrollable */}
								<div className="p-6 overflow-y-auto flex-1">
									<div className="space-y-4 mb-6">
										{/* Contact Info */}
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
												<p className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider flex items-center gap-2">
													<FaEnvelope className="text-blue-500" />
													Email
												</p>
												<p className="text-gray-900 font-bold text-lg">{activeInquiry.email}</p>
											</div>

											<div className="p-4 bg-green-50 rounded-xl border-2 border-green-200">
												<p className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider flex items-center gap-2">
													<FaPhone className="text-green-500" />
													Phone
												</p>
												<p className="text-gray-900 font-bold text-lg">{activeInquiry.phone}</p>
											</div>
										</div>

										{/* Date & Status */}
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div className="p-4 bg-orange-50 rounded-xl border-2 border-orange-200">
												<p className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider flex items-center gap-2">
													<FaClock className="text-orange-500" />
													Date & Time
												</p>
												<p className="text-gray-900 font-semibold">{formatDate(activeInquiry.date)}</p>
											</div>

											<div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
												<p className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider">Status</p>
												<div className="flex items-center gap-2">
													{activeInquiry.isResolved ? (
														<span className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg inline-flex items-center gap-2">
															<FaCheckCircle />
															Resolved
														</span>
													) : (
														<span className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold shadow-lg inline-flex items-center gap-2">
															<FaTimesCircle />
															Pending
														</span>
													)}
												</div>
											</div>
										</div>

										{/* Message */}
										<div className="p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
											<p className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider flex items-center gap-2">
												<FaComment className="text-purple-500" />
												Customer Message
											</p>
											<p className="text-gray-900 font-semibold leading-relaxed">{activeInquiry.message}</p>
										</div>

										{/* Response Section */}
										<div className="p-4 bg-indigo-50 rounded-xl border-2 border-indigo-200">
											<label className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider flex items-center gap-2">
												<FaReply className="text-indigo-500" />
												Your Response
											</label>
											<textarea
												value={responseText}
												onChange={(e) => setResponseText(e.target.value)}
												className="w-full mt-2 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none font-semibold resize-none"
												placeholder="Type your response here..."
												rows="5"
											></textarea>
										</div>
									</div>

									{/* Action Button */}
									<div className="flex justify-end pt-6 border-t-2 border-gray-200">
										<button
											onClick={handleSaveResponse}
											className="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
										>
											<FaSave />
											Save Response & Mark Resolved
										</button>
									</div>
								</div>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</motion.div>
	);
}
