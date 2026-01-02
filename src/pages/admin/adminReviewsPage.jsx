import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoMdCloseCircleOutline } from "react-icons/io";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaRegStar, FaUserCircle, FaEnvelope, FaComment, FaCheckCircle, FaClock, FaTrashAlt, FaEye } from "react-icons/fa";

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
      .put(
        `${import.meta.env.VITE_BACKEND_URL}/api/reviews/approve/${email}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        toast.success("Review approved successfully");
        setModalOpened(false);
        setLoading(true);
      })
      .catch((err) => {
        toast.error("approving review failed");
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
        toast.success("Review deleted successfully");
        setModalOpened(false);
        setLoading(true);
      })
      .catch((err) => {
        toast.error("deleting review failed");
        console.error("Error deleting review:", err);
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
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl">
              <FaStar className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900">Manage Reviews</h1>
              <p className="text-gray-600 text-lg font-semibold">View and moderate customer reviews</p>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-t-yellow-500 border-r-orange-500 border-b-yellow-500 border-l-orange-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600 font-semibold text-lg">Loading reviews...</p>
          </div>
        ) : reviews.length > 0 ? (
          <motion.div 
            className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-200"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="overflow-x-auto overflow-y-visible">
              <table className="min-w-full table-auto">
                <thead className="bg-gradient-to-r from-yellow-500 to-orange-600">
                  <tr className="text-left text-white">
                    <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Profile</th>
                    <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Reviewer</th>
                    <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Comment</th>
                    <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider text-center">Status</th>
                    <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reviews.map((review, index) => (
                    <motion.tr
                      key={review._id}
                      className="hover:bg-yellow-50 transition-all group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="px-6 py-4">
                        {review.profilePic ? (
                          <img
                            src={review.profilePic}
                            alt={review.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-yellow-200 shadow-md group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center border-2 border-yellow-200 shadow-md group-hover:scale-110 transition-transform duration-300">
                            <FaUserCircle className="text-white text-2xl" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900">{review.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FaEnvelope className="text-gray-400 text-sm" />
                          <span className="text-gray-700 font-semibold">{review.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-2 max-w-md">
                          <FaComment className="text-gray-400 text-sm mt-1 flex-shrink-0" />
                          <p className="text-gray-700 font-semibold line-clamp-2" title={review.coment}>
                            {review.coment}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            i < review.rating ? (
                              <FaStar key={i} className="text-yellow-500 text-lg" />
                            ) : (
                              <FaRegStar key={i} className="text-gray-300 text-lg" />
                            )
                          ))}
                          <span className="ml-2 font-bold text-gray-700">{review.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          {review.isApproved ? (
                            <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg inline-flex items-center gap-2">
                              <FaCheckCircle />
                              Approved
                            </span>
                          ) : (
                            <span className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold text-sm shadow-lg inline-flex items-center gap-2">
                              <FaClock />
                              Pending
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <button
                            onClick={() => {
                              setActiveReview(review);
                              setModalOpened(true);
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 whitespace-nowrap cursor-pointer"
                          >
                            <FaEye />
                            View Details
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
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaStar className="text-yellow-500 text-4xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Reviews Found</h2>
            <p className="text-gray-600">There are no customer reviews to display yet.</p>
          </motion.div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {modalOpened && activeReview && (
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpened(false)}
            >
              <motion.div 
                className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl relative overflow-hidden"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-6 text-white">
                  <IoMdCloseCircleOutline
                    className="absolute top-4 right-4 text-4xl cursor-pointer hover:rotate-90 transition-transform duration-300"
                    onClick={() => setModalOpened(false)}
                  />
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                      <FaStar className="text-3xl" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black">Review Details</h2>
                      <p className="text-yellow-100 font-semibold">Complete review information</p>
                    </div>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                  <div className="space-y-4">
                    {/* Reviewer Info */}
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                      {activeReview.profilePic ? (
                        <img
                          src={activeReview.profilePic}
                          alt={activeReview.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-yellow-400 shadow-md"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center border-2 border-yellow-400 shadow-md">
                          <FaUserCircle className="text-white text-3xl" />
                        </div>
                      )}
                      <div>
                        <p className="font-black text-xl text-gray-900">{activeReview.name}</p>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaEnvelope className="text-sm" />
                          <span className="font-semibold">{activeReview.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200">
                      <p className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider">Rating</p>
                      <div className="flex items-center gap-2">
                        {[...Array(5)].map((_, i) => (
                          i < activeReview.rating ? (
                            <FaStar key={i} className="text-yellow-500 text-2xl" />
                          ) : (
                            <FaRegStar key={i} className="text-gray-300 text-2xl" />
                          )
                        ))}
                        <span className="ml-2 font-black text-2xl text-gray-900">{activeReview.rating}/5</span>
                      </div>
                    </div>

                    {/* Comment */}
                    <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                      <p className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider flex items-center gap-2">
                        <FaComment />
                        Comment
                      </p>
                      <p className="text-gray-900 font-semibold leading-relaxed">{activeReview.coment}</p>
                    </div>

                    {/* Status */}
                    <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                      <p className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider">Approval Status</p>
                      <div className="flex items-center gap-2">
                        {activeReview.isApproved ? (
                          <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg inline-flex items-center gap-2">
                            <FaCheckCircle />
                            Approved
                          </span>
                        ) : (
                          <span className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold shadow-lg inline-flex items-center gap-2">
                            <FaClock />
                            Pending Approval
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-6 border-t-2 border-gray-200">
                    {!activeReview.isApproved && (
                      <button
                        onClick={() => handleReviewApproval(activeReview.email)}
                        className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <FaCheckCircle />
                        Approve Review
                      </button>
                    )}
                    <button
                      onClick={() => handleReviewDeletion(activeReview.email)}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FaTrashAlt />
                      Delete Review
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
