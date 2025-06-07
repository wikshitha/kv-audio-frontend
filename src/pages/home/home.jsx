import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/reviews`)
      .then((res) => {
        setReviews(res.data.filter((review) => review.isApproved)); // Fetch only approved reviews
        console.log(res.data)
      })
      .catch((error) => {
        console.error("Failed to fetch reviews:", error);
      });
  }, []);

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

      {/* Features Section */}
      <section className="w-full py-12 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose AudioRental?</h2>
        <div className="flex flex-wrap justify-center gap-6 px-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center transition-transform duration-300 hover:scale-105">
            <h3 className="text-xl font-semibold mb-4">Top Quality Equipment</h3>
            <p>Our audio gear is maintained to ensure the best performance for your projects.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center transition-transform duration-300 hover:scale-105">
            <h3 className="text-xl font-semibold mb-4">Affordable Rates</h3>
            <p>We offer competitive pricing to suit both small and large-scale needs.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center transition-transform duration-300 hover:scale-105">
            <h3 className="text-xl font-semibold mb-4">Flexible Rentals</h3>
            <p>Rent by the day, week, or month. We're here to accommodate your schedule.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-12 bg-white">
        <h2 className="text-3xl font-bold text-center mb-8">What Our Customers Say</h2>
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
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No reviews available yet.</p>
          )}
        </div>
      </section>

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
