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
                console.log(res.data);
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

        // Retrieve token from local storage
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

    // Handle inquiry deletion
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

    // Handle inquiry update
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
            <div className="max-w-screen-lg w-full flex flex-col items-center">
                <h1 className="text-4xl font-bold mb-6 text-center">Contact Us</h1>

                {/* Contact Information Section */}
                <div className="w-full bg-gray-100 p-6 rounded shadow mb-8">
                    <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                    <p className="mb-2"><strong>Email:</strong> contact@example.com</p>
                    <p className="mb-2"><strong>Phone:</strong> +1 123-456-7890</p>
                    <p><strong>Address:</strong> 123 Main St, City, Country</p>
                </div>

                {/* Inquiry Form */}
                <form
                    onSubmit={handleAddInquiry}
                    className="w-full bg-white p-8 rounded shadow mb-8"
                >
                    <label htmlFor="message" className="block mb-4 font-medium text-lg">
                        Your Message
                    </label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full p-4 border border-gray-300 rounded mb-4"
                        placeholder="Type your message here"
                        required
                    ></textarea>
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send Message"}
                    </button>
                </form>

                {error && <p className="text-red-500 text-lg mb-4">{error}</p>}

                {/* Display Existing Inquiries */}
                <h2 className="text-2xl font-bold mb-4">Your Messages</h2>
                <ul className="w-full space-y-6">
                    {inquiries.map((inquiry) => (
                        <li key={inquiry.id} className="bg-white p-6 rounded shadow">
                            <p className="mb-2">
                                <strong>Message:</strong> {inquiry.message}
                            </p>
                            <p className="mb-2">
                                <strong>Response:</strong>{" "}
                                {inquiry.response || "No response yet"}
                            </p>
                            <p className="mb-4">
                                <strong>Status:</strong>{" "}
                                {inquiry.isResolved ? "Resolved" : "Pending"}
                            </p>
                            <textarea
                                className="mb-4 p-3 border border-gray-300 rounded w-full"
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
    );
}
