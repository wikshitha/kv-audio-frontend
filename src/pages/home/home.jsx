import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState({ coment: "", rating: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState(null); // State for storing user email

  const parseJWT = (token) => {
    try {
      const base64Url = token.split(".")[1]; // Get the payload part of the token
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // Fix Base64 encoding
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join("")
      );
      return JSON.parse(jsonPayload); // Parse JSON payload
    } catch (err) {
      console.error("Failed to parse token:", err);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token"); // Get the token from localStorage

    if (token) {
      const decoded = parseJWT(token); // Decode the token manually
      if (decoded && decoded.email) {
        setCurrentUserEmail(decoded.email); // Set the user's email from the decoded token
      }
    }

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/reviews`)
      .then((res) => {
        setReviews(res.data.filter((review) => review.isApproved)); // Fetch only approved reviews
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch reviews:", error);
        setError("Failed to fetch reviews. Please try again later.");
        setIsLoading(false);
      });
  }, []);

  const addReview = () => {
    const token = localStorage.getItem("token"); // Get the token from localStorage

    if (!token) {
      alert("You must be logged in to submit a review.");
      return;
    }

    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/reviews`,
        newReview,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to Authorization header
          },
        }
      )
      .then((res) => {
        alert(res.data.message);
        setNewReview({ coment: "", rating: "" });
        setIsModalOpen(false);
        setIsLoading(true);
        setReviews([...reviews, res.data.review]); // Update the UI with the new review
      })
      .catch((error) => {
        console.error("Failed to add review:", error);
        alert("Failed to add review. Please try again later.");
      });
  };

  function deleteReview(email) {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to delete a review.");
      return;
    }
    

    axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/reviews/${email}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    .then(() => {
        console.log("Review deleted successfully");
        setIsModalOpen(false);
        setReviews(reviews.filter((review) => review.email !== email)); // Update the UI after deletion
        setIsLoading(true);
    })
    .catch((err) => {
        console.error("Error deleting review:", err);
    });
}

  return (
    <div className="w-full h-full flex flex-col">
      {/* Hero Section */}
      <section
        className="w-full h-[70vh] flex items-center justify-center bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: "url('/assets/hero-audio.jpg')" }}
      >
        <div className="text-center text-white bg-black bg-opacity-50 p-8 rounded-lg animate-fade-in">
          <h1 className="text-4xl font-bold mb-4">Rent Premium Audio Equipment</h1>
          <p className="mb-6">Affordable prices, flexible terms, and top-quality gear for all your audio needs.</p>
          <Link
            to="/items"
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform"
          >
            Explore Items
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-12 bg-white">
        <h2 className="text-3xl font-bold text-center mb-8">What Our Customers Say</h2>
        {isLoading ? (
          <p className="text-center text-gray-500">Loading reviews...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-6 px-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-sm text-center"
                >
                  <img
                    src={review.profilePic}
                    alt={`${review.name}'s profile`}
                    className="w-16 h-16 rounded-full mx-auto mb-4"
                  />
                  <p className="italic">"{review.coment}"</p>
                  <div className="mt-2 text-yellow-500">
                    {"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}
                  </div>
                  <h4 className="font-bold mt-4">- {review.name}</h4>

                  {/* Delete button for review owner */}
                  {review.email === currentUserEmail && (
                    <button
                      onClick={() => deleteReview(review.email)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4"
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
      </section>

      {/* Add Review Button */}
      <div className="w-full flex justify-center py-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg"
        >
          Add Your Review
        </button>
      </div>

      {/* Add Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#00000075] bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-center mb-4">Add Your Review</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addReview();
              }}
            >
              <textarea
                name="coment"
                placeholder="Write your review here..."
                className="w-full p-3 border rounded-lg mb-4"
                value={newReview.coment}
                onChange={(e) => setNewReview({ ...newReview, coment: e.target.value })}
                required
              ></textarea>
              <select
                name="rating"
                className="w-full p-3 border rounded-lg mb-4"
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                required
              >
                <option value="">Select a rating</option>
                {[...Array(5).keys()].map((num) => (
                  <option key={num + 1} value={num + 1}>
                    {num + 1} Star{num > 0 && "s"}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg w-full"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}

      {/* How It Works Section */}
      <section className="w-full py-12 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
        <div className="flex flex-wrap justify-center gap-6 px-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
            <h3 className="text-xl font-semibold mb-4">1. Browse</h3>
            <p>Explore our wide range of audio equipment to find what you need.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
            <h3 className="text-xl font-semibold mb-4">2. Rent</h3>
            <p>Choose your items and rental period, then place your order.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
            <h3 className="text-xl font-semibold mb-4">3. Enjoy</h3>
            <p>Pick up or have your gear delivered, and make your event a success.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-800 text-white py-4 flex justify-center items-center">
        <p className="text-sm">&copy; 2025 AudioRental. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
