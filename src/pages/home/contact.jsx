import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { MdEmail, MdPhone, MdLocationOn, MdAccessTime, MdSend, MdMessage, MdCheckCircle, MdPending } from "react-icons/md";
import { FaTrash, FaEdit } from "react-icons/fa";
import Footer from "../../components/footer";

export default function ContactUs() {
  const [inquiries, setInquiries] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    // Only fetch inquiries if user is logged in
    if (token) {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/inquiries`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setInquiries(res.data))
        .catch((err) => {
          // Only show error if it's not an auth issue
          if (err.response?.status !== 401 && err.response?.status !== 403) {
            toast.error("Failed to fetch inquiries.");
          }
        });
    }
  }, []);

  const handleAddInquiry = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to submit an inquiry.");
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/inquiries`,
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Refetch all inquiries to get the updated list
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/inquiries`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInquiries(response.data);
      setMessage("");
      toast.success("Inquiry sent successfully.");
    } catch (err) {
      toast.error("Failed to add inquiry.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInquiry = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/inquiries/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInquiries(inquiries.filter((inquiry) => inquiry.id !== id));
      toast.success("Inquiry deleted successfully.");
    } catch (err) {
      toast.error("Failed to delete inquiry.");
    }
  };

  const handleUpdateInquiry = async (id, updatedMessage) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/inquiries/${id}`,
        { message: updatedMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInquiries(
        inquiries.map((inquiry) =>
          inquiry.id === id ? { ...inquiry, message: updatedMessage } : inquiry
        )
      );
      toast.success("Inquiry updated successfully.");
    } catch (err) {
      toast.error("Failed to update inquiry.");
    }
  };

  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-actiion via-secondary to-actiion py-20 px-4 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-white rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6 animate-fade-in-down">
            <MdMessage className="text-white text-5xl" />
            <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-lg">
              Get in Touch
            </h1>
          </div>
          <p className="text-lg md:text-xl text-primary/90 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
            Have questions? Need assistance? We're here to help! Send us a message and our team will get back to you as soon as possible.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow w-full px-4 md:px-6 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 sticky top-24 animate-fade-in">
              <h2 className="text-3xl font-black text-gray-900 mb-6">Contact Info</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-actiion/20 to-secondary/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <MdEmail className="text-actiion text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">Email</p>
                    <p className="text-gray-900 font-bold">contact@example.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-actiion/20 to-secondary/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <MdPhone className="text-actiion text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">Phone</p>
                    <p className="text-gray-900 font-bold">+1 123-456-7890</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-actiion/20 to-secondary/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <MdLocationOn className="text-actiion text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">Address</p>
                    <p className="text-gray-900 font-bold">123 Main St, City, Country</p>
                  </div>
                </div>

                <div className="border-t-2 border-gray-100 pt-6 mt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <MdAccessTime className="text-actiion text-2xl" />
                    <h3 className="text-xl font-bold text-gray-900">Operating Hours</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-semibold">Mon - Fri:</span>
                      <span className="text-gray-900 font-bold">9:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-semibold">Sat - Sun:</span>
                      <span className="text-gray-900 font-bold">Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form and Messages Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 animate-fade-in animation-delay-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-actiion to-secondary rounded-xl flex items-center justify-center">
                  <MdSend className="text-white text-xl" />
                </div>
                <h2 className="text-3xl font-black text-gray-900">Send a Message</h2>
              </div>

              {!isLoggedIn && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4 mb-6 animate-fade-in">
                  <p className="text-blue-700 font-semibold flex items-center gap-2">
                    <span className="text-2xl">💡</span>
                    <span>Log in to track your inquiries and receive responses!</span>
                  </p>
                </div>
              )}

              <form onSubmit={handleAddInquiry} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Your Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:border-actiion focus:ring-4 focus:ring-actiion/10 transition-all duration-300 min-h-[180px]"
                    placeholder="Tell us how we can help you..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-actiion to-secondary text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
                >
                  <MdSend className={loading ? "animate-pulse" : ""} />
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>

            {/* User Messages Section */}
            {isLoggedIn && (
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 animate-fade-in animation-delay-400">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-actiion to-secondary rounded-xl flex items-center justify-center">
                    <MdMessage className="text-white text-xl" />
                  </div>
                  <h2 className="text-3xl font-black text-gray-900">Your Messages</h2>
                </div>

                {inquiries.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/30 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MdMessage className="text-5xl text-actiion" />
                    </div>
                    <p className="text-gray-500 text-lg">No messages yet.</p>
                    <p className="text-gray-400 text-sm mt-2">Your inquiries will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {inquiries.map((inquiry, index) => (
                      <div
                        key={inquiry.id}
                        className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border-2 border-gray-100 hover:border-secondary/50 shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {/* Status Badge */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            {inquiry.isResolved ? (
                              <>
                                <MdCheckCircle className="text-green-500 text-xl" />
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                                  Resolved
                                </span>
                              </>
                            ) : (
                              <>
                                <MdPending className="text-yellow-500 text-xl" />
                                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-bold">
                                  Pending
                                </span>
                              </>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteInquiry(inquiry.id)}
                            className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 transition-all duration-300 transform hover:scale-110"
                            title="Delete inquiry"
                          >
                            <FaTrash />
                          </button>
                        </div>

                        {/* Message */}
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 font-semibold mb-2">Your Message:</p>
                          <textarea
                            className="w-full p-3 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:border-actiion focus:ring-4 focus:ring-actiion/10 transition-all duration-300"
                            defaultValue={inquiry.message}
                            onBlur={(e) => handleUpdateInquiry(inquiry.id, e.target.value)}
                            rows={3}
                          ></textarea>
                        </div>

                        {/* Response */}
                        <div className="bg-gradient-to-r from-actiion/5 to-secondary/5 p-4 rounded-lg border border-actiion/20">
                          <p className="text-sm text-gray-600 font-semibold mb-2 flex items-center gap-2">
                            <MdMessage className="text-actiion" />
                            Admin Response:
                          </p>
                          <p className="text-gray-700 italic">
                            {inquiry.response || "No response yet. We'll get back to you soon!"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
