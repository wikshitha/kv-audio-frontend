import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaStar, FaRegStar } from "react-icons/fa";
import Footer from "../../components/footer";

export default function Home() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState({ coment: "", rating: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);

  const parseJWT = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (err) {
      console.error("Failed to parse token:", err);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = parseJWT(token);
      if (decoded && decoded.email) {
        setCurrentUserEmail(decoded.email);
      }
    }

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/reviews`)
      .then((res) => {
        setReviews(res.data.filter((review) => review.isApproved));
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch reviews:", error);
        setError("Failed to fetch reviews. Please try again later.");
        setIsLoading(false);
      });
  }, []);

  const addReview = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to submit a review.");
      return;
    }

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/reviews`, newReview, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        alert(res.data.message);
        setNewReview({ coment: "", rating: "" });
        setIsModalOpen(false);
        setIsLoading(true);
        setReviews([...reviews, res.data.review]);
      })
      .catch((error) => {
        console.error("Failed to add review:", error);
        alert("Failed to add review. Please try again later.");
      });
  };

  const deleteReview = (email) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to delete a review.");
      return;
    }

    axios
      .delete(`${import.meta.env.VITE_BACKEND_URL}/api/reviews/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        console.log("Review deleted successfully");
        setReviews(reviews.filter((review) => review.email !== email));
        setIsLoading(true);
      })
      .catch((err) => {
        console.error("Error deleting review:", err);
      });
  };

  // Helper for star rating rendering
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="inline-block text-yellow-400" />
        ) : (
          <FaRegStar key={i} className="inline-block text-yellow-400" />
        )
      );
    }
    return stars;
  };

  return (
    <div className="w-full min-h-screen flex flex-col font-sans bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section
        className="relative w-full h-[75vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/bghome.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-70"></div>
        <div className="relative z-10 text-center max-w-3xl px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-6">
            Rent Premium Audio Equipment
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
            Affordable prices, flexible terms, and top-quality gear for all your audio needs.
          </p>
          <div className="flex justify-center gap-6">
            <Link
              to="/items"
              className="bg-green-500 hover:bg-green-600 transition duration-300 text-white py-3 px-8 rounded-lg font-semibold shadow-lg shadow-green-400/50"
            >
              Explore Items
            </Link>
            <a
              href="#reviews"
              className="border border-white text-white hover:bg-white hover:text-green-600 transition duration-300 py-3 px-8 rounded-lg font-semibold"
            >
              See Reviews
            </a>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 bg-white text-center max-w-5xl mx-auto px-6">
        <h2 className="text-4xl font-extrabold mb-6 text-gray-900">Why Choose Us</h2>
        <p className="text-gray-600 text-lg max-w-4xl mx-auto leading-relaxed">
          At AudioRental, we aim to revolutionize the way you access high-quality audio equipment.
          Whether you're hosting an event, recording a session, or simply enjoying music, we have the
          perfect solution for you. Our mission is to provide exceptional service with a customer-first
          approach. Our gear is maintained to the highest standards and ready to make your event sound
          spectacular.
        </p>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gradient-to-tr from-green-50 to-green-100">
        <h2 className="text-4xl font-extrabold text-center mb-12 text-green-900">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto px-6">
          {[
            {
              title: "Audio Equipment Rental",
              desc: "Rent top-notch audio equipment for events, studios, and personal use.",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto mb-4 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 17L6 13.5l3.75-3.75M16.5 7.5l3.75 3.75-3.75 3.75"
                  />
                </svg>
              ),
            },
            {
              title: "Event Support",
              desc: "Get professional assistance for your events to ensure flawless audio performance.",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto mb-4 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 8h10M7 12h8m-6 4h6"
                  />
                </svg>
              ),
            },
            {
              title: "Custom Packages",
              desc: "Choose from flexible rental packages tailored to your specific needs.",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto mb-4 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              ),
            },
          ].map(({ title, desc, icon }) => (
            <div
              key={title}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              {icon}
              <h3 className="text-xl font-semibold mb-3 text-green-900">{title}</h3>
              <p className="text-gray-700">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-16 bg-white max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-900">
          What Our Customers Say
        </h2>
        {isLoading ? (
          <p className="text-center text-gray-500">Loading reviews...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-8">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-green-50 p-6 rounded-xl shadow-md max-w-sm w-full flex flex-col items-center text-center"
                >
                  <img
                    src={review.profilePic || "/default-avatar.png"}
                    alt={`${review.name}'s profile`}
                    className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-green-400"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-avatar.png";
                    }}
                  />
                  <p className="italic text-gray-800 mb-4">"{review.coment}"</p>
                  <div className="text-yellow-500 mb-3">{renderStars(review.rating)}</div>
                  <h4 className="font-semibold text-green-900 mb-2">- {review.name}</h4>
                  {/* Optional: Show date or location if available */}
                  {review.date && (
                    <p className="text-sm text-gray-500 mb-4">
                      Reviewed on {new Date(review.date).toLocaleDateString()}
                    </p>
                  )}

                  {/* Delete button for review owner */}
                  {review.email === currentUserEmail && (
                    <button
                      onClick={() => deleteReview(review.email)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg mt-auto hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No reviews available yet.</p>
            )}
          </div>
        )}

        {/* Add Review Button */}
        <div className="w-full flex justify-center mt-12">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-lg shadow-lg font-semibold transition"
          >
            Add Your Review
          </button>
        </div>

        {/* Add Review Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 w-96 relative max-w-full mx-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-3xl font-bold leading-none"
              >
                &times;
              </button>
              <h2 className="text-3xl font-bold text-center mb-6">Add Your Review</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addReview();
                }}
              >
                <textarea
                  name="coment"
                  placeholder="Write your review here..."
                  className="w-full p-4 border border-gray-300 rounded-lg mb-5 resize-none focus:outline-green-500 focus:ring-2 focus:ring-green-300"
                  rows={5}
                  value={newReview.coment}
                  onChange={(e) => setNewReview({ ...newReview, coment: e.target.value })}
                  required
                ></textarea>
                <select
                  name="rating"
                  className="w-full p-3 border border-gray-300 rounded-lg mb-5 focus:outline-green-500 focus:ring-2 focus:ring-green-300"
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                  required
                >
                  <option value="">Select a rating</option>
                  {[...Array(5).keys()].map((num) => (
                    <option key={num + 1} value={num + 1}>
                      {num + 1} Star{num > 0 ? "s" : ""}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg w-full font-semibold shadow-md transition"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        )}
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-green-50">
        <h2 className="text-4xl font-extrabold text-center mb-8 text-green-900">Gallery</h2>
        <p className="text-center text-green-700 mb-10 max-w-3xl mx-auto px-4">
          View our curated collection of audio equipment used by our satisfied customers.
        </p>
        <div className="flex justify-center">
          <Link
            to="/gallery"
            className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-lg shadow-lg font-semibold transition"
          >
            View Gallery
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <h2 className="text-4xl font-extrabold text-center mb-8 text-gray-900">Contact Us</h2>
        <p className="text-center text-gray-700 mb-12 max-w-3xl mx-auto px-4">
          Have questions? Need assistance? We're here to help! Reach out anytime.
        </p>
        <div className="flex justify-center">
          <Link
            to="/contact"
            className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-8 rounded-lg shadow-lg font-semibold transition"
          >
            Get in Touch
          </Link>
        </div>
      </section>

      <Footer />
    </div>

   
  );
};


      