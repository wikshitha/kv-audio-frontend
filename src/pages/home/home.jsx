import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
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
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/reviews`,
        newReview,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
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

  return (
    <div className="w-full h-full flex flex-col">
      {/* Hero Section */}
      <section
        className="w-full h-[70vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/hero-audio.jpg')" }}
      >
        <div className="text-center text-white bg-black bg-opacity-50 p-8 rounded-lg">
          <h1 className="text-4xl font-bold mb-4">Rent Premium Audio Equipment</h1>
          <p className="mb-6">
            Affordable prices, flexible terms, and top-quality gear for all your audio needs.
          </p>
          <Link
            to="/items"
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg"
          >
            Explore Items
          </Link>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-12 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-4">About Us</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          At AudioRental, we aim to revolutionize the way you access high-quality audio equipment.
          Whether you're hosting an event, recording a session, or simply enjoying music, we have
          the perfect solution for you. Our mission is to provide exceptional service with a
          customer-first approach.
        </p>
      </section>

      {/* Services Section */}
      <section className="py-12 bg-white">
        <h2 className="text-3xl font-bold text-center mb-8">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold mb-4">Audio Equipment Rental</h3>
            <p className="text-gray-600">
              Rent top-notch audio equipment for events, studios, and personal use.
            </p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold mb-4">Event Support</h3>
            <p className="text-gray-600">
              Get professional assistance for your events to ensure flawless audio performance.
            </p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold mb-4">Custom Packages</h3>
            <p className="text-gray-600">
              Choose from flexible rental packages tailored to your specific needs.
            </p>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-12 bg-gray-50">
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
                  onChange={(e) =>
                    setNewReview({ ...newReview, coment: e.target.value })
                  }
                  required
                ></textarea>
                <select
                  name="rating"
                  className="w-full p-3 border rounded-lg mb-4"
                  value={newReview.rating}
                  onChange={(e) =>
                    setNewReview({ ...newReview, rating: e.target.value })
                  }
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
      </section>

      {/* Gallery Section */}
      <section className="py-12 bg-white">
        <h2 className="text-3xl font-bold text-center mb-8">Gallery</h2>
        <p className="text-center text-gray-600 mb-8">
          View our curated collection of audio equipment used by our satisfied customers.
        </p>
        <div className="flex justify-center">
          <Link
            to="/gallery"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg shadow-lg"
          >
            View Gallery
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-8">Contact Us</h2>
        <p className="text-center text-gray-600 mb-8">
          Have questions? Need assistance? We're here to help!
        </p>
        <div className="flex justify-center">
          <Link
            to="/contact"
            className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-6 rounded-lg shadow-lg"
          >
            Get in Touch
          </Link>
        </div>
      </section>

      {/* Subscription Section */}
      <section className="py-12 bg-blue-500 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
        <p className="mb-6">Stay updated with the latest deals and promotions.</p>
        <div className="flex justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="p-2 rounded-l-lg"
          />
          <button className="bg-green-500 hover:bg-green-600 py-2 px-4 rounded-r-lg">
            Subscribe
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-800 text-white py-8">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/items" className="hover:underline">
                  Items
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:underline">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg">Contact Info</h3>
            <p className="mt-4">Email: contact@audiorental.com</p>
            <p>Phone: +1 123-456-7890</p>
          </div>
          <div>
            <h3 className="font-bold text-lg">Follow Us</h3>
            <div className="flex mt-4 space-x-4">
              <a href="#" className="hover:underline">
                Facebook
              </a>
              <a href="#" className="hover:underline">
                Twitter
              </a>
              <a href="#" className="hover:underline">
                Instagram
              </a>
            </div>
          </div>
        </div>
        <div className="text-center mt-8">© 2025 AudioRental. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default Home;
