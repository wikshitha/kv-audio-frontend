import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { MdEmail, MdPhone, MdLocationOn, MdAccessTime } from "react-icons/md";

export default function ContactUs() {
  const [inquiries, setInquiries] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/inquiries`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setInquiries(res.data))
      .catch((err) => toast.error("Failed to fetch inquiries."));
  }, []);

  const handleAddInquiry = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to submit an inquiry.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/inquiries`,
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInquiries([...inquiries, response.data]);
      setMessage("");
      toast.success("Inquiry sent successfully.");
    } catch (err) {
      setError("Failed to add inquiry.");
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
      setError("Failed to delete inquiry.");
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
      setError("Failed to update inquiry.");
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start bg-[#FFDFEF] p-8">
      <div className="max-w-screen-xl w-full grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="bg-gradient-to-br from-[#D69ADE] to-[#AA60C8] text-white p-8 rounded-3xl shadow-xl">
          <h2 className="text-4xl font-bold  text-gray-800 mb-6">Get in Touch</h2>
          <p className="mb-4 text-lg flex items-center gap-2"><MdEmail className="w-5 h-5" /> contact@example.com</p>
          <p className="mb-4 text-lg flex items-center gap-2"><MdPhone className="w-5 h-5" /> +1 123-456-7890</p>
          <p className="mb-6 text-lg flex items-center gap-2"><MdLocationOn className="w-5 h-5" /> 123 Main St, City, Country</p>
          <div className="border-t border-white/50 pt-4">
            <h3 className="text-2xl font-semibold  text-gray-800 mb-2 flex items-center gap-2"><MdAccessTime className="w-5 h-5" /> Operating Hours</h3>
            <p><strong>Mon - Fri:</strong> 9:00 AM - 5:00 PM</p>
            <p><strong>Sat - Sun:</strong> Closed</p>
          </div>
        </div>

        <div className="col-span-2 space-y-10">
          <form
            onSubmit={handleAddInquiry}
            className="bg-white p-8 rounded-3xl shadow-xl space-y-6 transition-transform duration-300 hover:scale-[1.01]"
          >
            <h2 className="text-3xl font-bold  text-gray-800">Send Us a Message</h2>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#AA60C8] min-h-[150px]"
              placeholder="Your message..."
              required
            ></textarea>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#AA60C8] text-white text-lg font-semibold rounded-lg hover:bg-[#933cc2] transition duration-200 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </form>

          <div className="bg-white p-8 rounded-3xl shadow-xl transition-transform duration-300 hover:scale-[1.01]">
            <h2 className="text-2xl font-bold  text-gray-800 mb-4">Your Messages</h2>
            {inquiries.length === 0 ? (
              <p className="text-gray-500">No messages yet.</p>
            ) : (
              <ul className="space-y-6">
                {inquiries.map((inquiry) => (
                  <li
                    key={inquiry.id}
                    className="p-6 bg-[#f9f9f9] rounded-xl border border-[#D69ADE] shadow transition duration-300 hover:shadow-lg"
                  >
                    <p className="mb-2"><strong>Message:</strong> {inquiry.message}</p>
                    <p className="mb-2"><strong>Response:</strong> {inquiry.response || "No response yet"}</p>
                    <p className="mb-4"><strong>Status:</strong> {inquiry.isResolved ? "Resolved" : "Pending"}</p>
                    <textarea
                      className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AA60C8]"
                      defaultValue={inquiry.message}
                      onBlur={(e) => handleUpdateInquiry(inquiry.id, e.target.value)}
                    ></textarea>
                    <button
                      onClick={() => handleDeleteInquiry(inquiry.id)}
                      className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <footer className="w-full bg-[#AA60C8] text-white mt-16 py-8 rounded-t-3xl">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          <div>
            <h3 className="text-xl font-bold mb-2">About Us</h3>
            <p className="text-sm">
              We’re committed to providing the best customer service. Contact us for any support or inquiries.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Quick Links</h3>
            <ul className="text-sm space-y-1">
              <li><a href="#" className="hover:underline">Home</a></li>
              <li><a href="#" className="hover:underline">Services</a></li>
              <li><a href="#" className="hover:underline">Contact Us</a></li>
              <li><a href="#" className="hover:underline">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-gray-300">Facebook</a>
              <a href="#" className="hover:text-gray-300">Twitter</a>
              <a href="#" className="hover:text-gray-300">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="text-center text-sm mt-6">© 2025 Your Company. All rights reserved.</div>
      </footer>
    </div>
  );
}
