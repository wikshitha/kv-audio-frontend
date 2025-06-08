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
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/reviews`, {
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

    function handleReviewApproval(email) {
        const token = localStorage.getItem("token");
        axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/reviews/approve/${email}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(() => {
            console.log("Review approved successfully");
            setModalOpened(false);
            setLoading(true);
        })
        .catch((err) => {
            console.error("Error approving review:", err);
            setLoading(true);
        });
    }

    function handleReviewDeletion(email) {
        const token = localStorage.getItem("token");
        axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/reviews/${email}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(() => {
            console.log("Review deleted successfully");
            setModalOpened(false);
            setLoading(true);
        })
        .catch((err) => {
            console.error("Error deleting review:", err);
        });
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Admin Reviews</h1>
            {loading ? (
                <p className="text-center text-gray-600">Loading...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-2 text-left">Reviewer</th>
                                <th className="px-4 py-2 text-left">Email</th>
                                <th className="px-4 py-2 text-left">Comment</th>
                                <th className="px-4 py-2 text-left">Rating</th>
                                <th className="px-4 py-2 text-left">Approval Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.map((review) => (
                                <tr
                                    key={review._id}
                                    className="border-t hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        setActiveReview(review);
                                        setModalOpened(true);
                                    }}
                                >
                                    <td className="px-4 py-2">{review.name}</td>
                                    <td className="px-4 py-2">{review.email}</td>
                                    <td className="px-4 py-2">{review.coment}</td>
                                    <td className="px-4 py-2">{review.rating} Stars</td>
                                    <td className="px-4 py-2">{review.isApproved ? "Approved" : "Pending"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {modalOpened && (
                <div className="fixed top-0 left-0 w-full h-full bg-[#00000075] flex justify-center items-center">
                    <div className="w-[500px] bg-white p-4 rounded-lg shadow-lg relative">
                        <IoMdCloseCircleOutline
                            className="absolute top-2 right-2 text-3xl cursor-pointer hover:text-red-600"
                            onClick={() => setModalOpened(false)}
                        />
                        <h1 className="text-2xl font-semibold mb-4">Review Details</h1>
                        <div className="flex flex-col gap-2">
                            <p><span className="font-semibold">Reviewer:</span> {activeReview.name}</p>
                            <p><span className="font-semibold">Email:</span> {activeReview.email}</p>
                            <p><span className="font-semibold">Comment:</span> {activeReview.coment}</p>
                            <p><span className="font-semibold">Rating:</span> {activeReview.rating} Stars</p>
                            <p><span className="font-semibold">Approval Status:</span> {activeReview.isApproved ? "Approved" : "Pending"}</p>
                        </div>
                        <div className="mt-4 flex justify-center gap-4">
                            {!activeReview.isApproved && (
                                <button
                                    onClick={() => handleReviewApproval(activeReview.email)}
                                    className="bg-green-500 text-white px-4 py-1 rounded-md"
                                >
                                    Approve
                                </button>
                            )}
                            <button
                                onClick={() => handleReviewDeletion(activeReview.email)}
                                className="bg-red-500 text-white px-4 py-1 rounded-md"
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
