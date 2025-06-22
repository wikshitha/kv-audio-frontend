import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ContactUs() {
    const [inquiries, setInquiries] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch inquiries on component mount
    useEffect(() => {
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
                console.error(err);
                toast.error("Failed to fetch inquiries.");
            });
    }, []);

    // Handle form submission to add an inquiry
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
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setInquiries([...inquiries, response.data]);
            setMessage("");
            toast.success("Inquiry sent successfully.");
        } catch (err) {
            console.error(err);
            setError("Failed to add inquiry.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteInquiry = async (id) => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("You must be logged in to delete an inquiry.");
            setLoading(false);
            return;
        }

        try {
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/inquiries/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setInquiries(inquiries.filter((inquiry) => inquiry.id !== id));
            toast.success("Inquiry deleted successfully.");
        } catch (err) {
            console.error(err);
            setError("Failed to delete inquiry.");
        }
    };

    const handleUpdateInquiry = async (id, updatedMessage) => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("You must be logged in to update an inquiry.");
            setLoading(false);
            return;
        }

        try {
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/inquiries/${id}`,
                { message: updatedMessage },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setInquiries(
                inquiries.map((inquiry) =>
                    inquiry.id === id
                        ? { ...inquiry, message: updatedMessage }
                        : inquiry
                )
            );
            toast.success("Inquiry updated successfully.");
        } catch (err) {
            console.error(err);
            setError("Failed to update inquiry.");
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-start bg-gray-50 p-8">
            <div className="max-w-screen-lg w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Contact Information Section */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded shadow-lg text-white">
                    <h2 className="text-3xl font-bold mb-4">Contact Information</h2>
                    <p className="mb-2 text-lg"><strong>Email:</strong> contact@example.com</p>
                    <p className="mb-2 text-lg"><strong>Phone:</strong> +1 123-456-7890</p>
                    <p className="text-lg"><strong>Address:</strong> 123 Main St, City, Country</p>
                    <div className="mt-6">
                        <h3 className="text-2xl font-bold mb-2">Operating Hours</h3>
                        <p className="mb-2 text-lg"><strong>Monday - Friday:</strong> 9:00 AM - 5:00 PM</p>
                        <p className="text-lg"><strong>Saturday - Sunday:</strong> Closed</p>
                    </div>
                </div>

                {/* Inquiry Form */}
                <div className="col-span-2 flex flex-col space-y-6">
                    <form
                        onSubmit={handleAddInquiry}
                        className="bg-white p-8 rounded shadow-lg flex flex-col space-y-4"
                    >
                        <h2 className="text-3xl font-bold text-gray-800">Send Us a Message</h2>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Type your message here"
                            required
                        ></textarea>
                        <button
                            type="submit"
                            className="py-3 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send Message"}
                        </button>
                    </form>

                    {/* Display Existing Inquiries */}
                    <div className="bg-white p-8 rounded shadow-lg">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Messages</h2>
                        <ul className="space-y-6">
                            {inquiries.map((inquiry) => (
                                <li 
                                    key={inquiry.id} 
                                    className="bg-gray-50 p-6 rounded shadow"
                                >
                                    <p className="mb-2 text-lg">
                                        <strong>Message:</strong> {inquiry.message}
                                    </p>
                                    <p className="mb-2 text-lg">
                                        <strong>Response:</strong> {inquiry.response || "No response yet"}
                                    </p>
                                    <p className="mb-4 text-lg">
                                        <strong>Status:</strong> {inquiry.isResolved ? "Resolved" : "Pending"}
                                    </p>
                                    <textarea
                                        className="mb-4 p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        defaultValue={inquiry.message}
                                        onBlur={(e) =>
                                            handleUpdateInquiry(inquiry.id, e.target.value)
                                        }
                                    ></textarea>
                                    <button
                                        onClick={() => handleDeleteInquiry(inquiry.id)}
                                        className="w-full py-3 bg-red-500 text-white font-bold rounded hover:bg-red-600 transition"
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Footer Section */}
            <footer className="w-full bg-gray-800 text-white mt-8 p-6">
                <div className="max-w-screen-lg mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <h3 className="text-xl font-bold mb-2">About Us</h3>
                        <p className="text-sm">
                            We are committed to providing the best customer service. Feel free to contact us for any inquiries or support.
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
                            <a href="#" className="text-blue-400 hover:text-white">Facebook</a>
                            <a href="#" className="text-blue-400 hover:text-white">Twitter</a>
                            <a href="#" className="text-blue-400 hover:text-white">LinkedIn</a>
                        </div>
                    </div>
                </div>
                <div className="text-center text-sm mt-4">
                    © 2025 Your Company. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
