import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaStar, FaRegStar, FaMusic, FaHeadphones, FaMicrophone, FaGuitar } from "react-icons/fa";
import Footer from "../../components/footer";
import toast from "react-hot-toast";

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
        console.log("Reviews data:", res.data); // Debug log
        setReviews(res.data.filter((review) => review.isApproved));
        setIsLoading(false);
      })
      .catch((error) => {
        toast.error("Failed to fetch reviews. Please try again later.");
        console.error("Failed to fetch reviews:", error);
        setError("Failed to fetch reviews. Please try again later.");
        setIsLoading(false);
      });
  }, [newReview]);

  const addReview = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to submit a review.");
      return;
    }

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/reviews`, newReview, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        toast.success("Review submitted successfully! It will appear after admin approval.");
        setNewReview({ coment: "", rating: "" });
        setIsModalOpen(false);
        
        // Refresh reviews from server to get the latest data
        axios
          .get(`${import.meta.env.VITE_BACKEND_URL}/api/reviews`)
          .then((response) => {
            setReviews(response.data.filter((review) => review.isApproved));
          })
          .catch((error) => {
            console.error("Failed to refresh reviews:", error);
          });
      })
      .catch((error) => {
        console.error("Failed to add review:", error);
        toast.error("Failed to add review. Please try again later.");
      });
  };

  const deleteReview = (email) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to delete a review.");
      return;
    }

    axios
      .delete(`${import.meta.env.VITE_BACKEND_URL}/api/reviews/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast.success("Review deleted successfully");
        setReviews(reviews.filter((review) => review.email !== email));
        setIsLoading(true);
      })
      .catch((err) => {
        toast.error("Error deleting review");
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
    <div className="w-full min-h-screen flex flex-col font-sans bg-gradient-to-b from-gray-50 to-white text-gray-800">
      {/* Hero Section with Modern Design */}
      <section
        className="relative w-full min-h-screen flex items-center justify-center bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: "url('/bghome.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-black/70 to-pink-900/80"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 text-center max-w-5xl px-6 py-20">
          {/* Logo and Brand */}
          <div className="mb-8 flex items-center justify-center gap-4 animate-fade-in-down">
            <img src="/logo.png" alt="KV-Audio" className="w-20 h-20 drop-shadow-2xl" />
            <h1 className="text-6xl md:text-7xl font-black text-white drop-shadow-2xl tracking-tight">
              KV-Audio
            </h1>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-6 animate-fade-in">
            Premium Audio Equipment <span className="text-purple-300">Rentals</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-100 mb-10 leading-relaxed max-w-3xl mx-auto animate-fade-in-up">
            Experience professional-grade sound without the premium price. Flexible rentals for events, studios, and personal use.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 animate-fade-in-up animation-delay-200">
            <Link
              to="/items"
              className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 text-white py-4 px-10 rounded-full font-bold shadow-2xl shadow-purple-500/50 transform hover:scale-105 hover:shadow-purple-600/60 flex items-center gap-2"
            >
              <FaMusic className="group-hover:rotate-12 transition-transform" />
              Browse Equipment
            </Link>
            <a
              href="#reviews"
              className="border-2 border-white text-white hover:bg-white hover:text-purple-600 transition-all duration-300 py-4 px-10 rounded-full font-bold backdrop-blur-sm transform hover:scale-105"
            >
              Customer Reviews
            </a>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mt-12 animate-fade-in-up animation-delay-400">
            <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full text-white font-semibold border border-white/20">
              ✓ Premium Quality
            </div>
            <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full text-white font-semibold border border-white/20">
              ✓ Affordable Rates
            </div>
            <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full text-white font-semibold border border-white/20">
              ✓ 24/7 Support
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* About Us Section - Modern Card Design */}
      <section className="py-20 bg-gradient-to-b from-white to-purple-50 text-center max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <span className="text-purple-600 font-bold text-sm uppercase tracking-wider">About KV-Audio</span>
          <h2 className="text-5xl font-black mb-6 text-gray-900 mt-4">Why Choose Us</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-8"></div>
          <p className="text-gray-600 text-xl max-w-4xl mx-auto leading-relaxed">
            At KV-Audio, we revolutionize the way you access high-quality audio equipment.
            Whether you're hosting an event, recording a session, or simply enjoying music, we have the
            perfect solution for you. Our gear is maintained to the highest standards and ready to make your experience unforgettable.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {[
            { number: "500+", label: "Happy Clients" },
            { number: "1000+", label: "Events Covered" },
            { number: "50+", label: "Equipment Items" },
            { number: "24/7", label: "Support" },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section - Modern Cards with Icons */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute transform rotate-45 -top-20 -right-20 w-96 h-96 bg-purple-600 rounded-full"></div>
          <div className="absolute transform -rotate-45 -bottom-20 -left-20 w-96 h-96 bg-pink-600 rounded-full"></div>
        </div>

        <div className="relative z-10">
          <div className="text-center mb-16">
            <span className="text-purple-600 font-bold text-sm uppercase tracking-wider">What We Offer</span>
            <h2 className="text-5xl font-black text-gray-900 mt-4 mb-6">Our Services</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-6">
            {[
              {
                title: "Audio Equipment Rental",
                desc: "Rent top-notch audio equipment for events, studios, and personal use. From speakers to mixers, we have it all.",
                icon: <FaHeadphones className="w-16 h-16 text-purple-600" />,
                gradient: "from-purple-500 to-purple-700",
              },
              {
                title: "Event Support",
                desc: "Get professional assistance for your events to ensure flawless audio performance with expert technicians.",
                icon: <FaMicrophone className="w-16 h-16 text-pink-600" />,
                gradient: "from-pink-500 to-pink-700",
              },
              {
                title: "Custom Packages",
                desc: "Choose from flexible rental packages tailored to your specific needs and budget requirements.",
                icon: <FaGuitar className="w-16 h-16 text-blue-600" />,
                gradient: "from-blue-500 to-blue-700",
              },
            ].map(({ title, desc, icon, gradient }) => (
              <div
                key={title}
                className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className="mb-6 transform group-hover:scale-110 transition-transform duration-500 flex justify-center">
                    {icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                    {title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{desc}</p>
                  
                  <div className="mt-6 flex items-center text-purple-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Learn more →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section - Modern Card Grid */}
      <section id="reviews" className="py-20 bg-white max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-purple-600 font-bold text-sm uppercase tracking-wider">Testimonials</span>
          <h2 className="text-5xl font-black text-gray-900 mt-4 mb-6">
            What Our Customers Say
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl text-center max-w-2xl mx-auto">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div
                  key={review._id}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col transform hover:-translate-y-2 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center mb-6">
                    <img
                      src={review.profilePic || "/user.png"}
                      alt={`${review.name}'s profile`}
                      className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/user.png";
                      }}
                    />
                    <div className="ml-4">
                      <h4 className="font-bold text-gray-900 text-lg">{review.name}</h4>
                      <div className="flex text-yellow-400 mt-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 italic mb-4 flex-grow leading-relaxed">
                    "{review.coment}"
                  </p>

                  {review.date && (
                    <p className="text-sm text-gray-500 mb-4">
                      {new Date(review.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                  )}

                  {review.email === currentUserEmail && (
                    <button
                      onClick={() => deleteReview(review.email)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg mt-auto transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      Delete Review
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <div className="text-gray-400 mb-4">
                  <FaStar className="w-16 h-16 mx-auto" />
                </div>
                <p className="text-gray-500 text-lg">No reviews available yet. Be the first to review!</p>
              </div>
            )}
          </div>
        )}

        {/* Add Review Button */}
        <div className="w-full flex justify-center mt-16">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 px-10 rounded-full shadow-2xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-purple-500/50 flex items-center gap-2"
          >
            <FaStar />
            Share Your Experience
          </button>
        </div>

        {/* Add Review Modal - Modern Design */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg relative animate-scale-in">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-600 text-3xl font-bold leading-none transition-colors duration-300 w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-50"
              >
                ×
              </button>
              
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaStar className="text-white text-2xl" />
                </div>
                <h2 className="text-3xl font-black text-gray-900">Share Your Experience</h2>
                <p className="text-gray-600 mt-2">Your feedback helps us improve</p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addReview();
                }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Your Review</label>
                  <textarea
                    name="coment"
                    placeholder="Tell us about your experience..."
                    className="w-full p-4 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300"
                    rows={5}
                    value={newReview.coment}
                    onChange={(e) => setNewReview({ ...newReview, coment: e.target.value })}
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Rating</label>
                  <select
                    name="rating"
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 font-semibold"
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                    required
                  >
                    <option value="">Select a rating</option>
                    {[...Array(5).keys()].map((num) => (
                      <option key={num + 1} value={num + 1}>
                        {"⭐".repeat(num + 1)} {num + 1} Star{num > 0 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 px-6 rounded-xl w-full font-bold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        )}
      </section>

      {/* Gallery Section - Modern CTA */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-white rounded-full blur-3xl"></div>
          </div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h2 className="text-5xl font-black text-white mb-6">
            Explore Our Gallery
          </h2>
          <p className="text-xl text-purple-100 mb-10 leading-relaxed">
            View our curated collection of premium audio equipment and see the quality that sets us apart.
          </p>
          <Link
            to="/gallery"
            className="inline-block bg-white text-purple-600 hover:bg-gray-100 py-4 px-10 rounded-full shadow-2xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-white/30"
          >
            View Gallery →
          </Link>
        </div>
      </section>

      {/* Contact Section - Modern Design */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-purple-600 font-bold text-sm uppercase tracking-wider">Get In Touch</span>
          <h2 className="text-5xl font-black text-gray-900 mt-4 mb-6">
            Ready to Get Started?
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-8"></div>
          <p className="text-gray-600 text-xl mb-12 leading-relaxed max-w-2xl mx-auto">
            Have questions? Need assistance? We're here to help! Our team is ready to make your audio rental experience seamless.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              to="/contact"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 px-10 rounded-full shadow-2xl font-bold transition-all duration-300 transform hover:scale-105"
            >
              Contact Us
            </Link>
            <Link
              to="/items"
              className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white py-4 px-10 rounded-full font-bold transition-all duration-300 transform hover:scale-105"
            >
              Browse Equipment
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>

   
  );
};


      