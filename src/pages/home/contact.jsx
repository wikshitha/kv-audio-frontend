import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ContactUs() {
    const [inquiries, setInquiries] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    

    // Fetch inquiries on component mount
    useEffect(()=>{
            const token = localStorage.getItem("token");
             axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/inquiries`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((res)=>{
                console.log(res.data);
                setInquiries(res.data);
                setLoading(false);
            }).catch((err)=>{
                console.error(err);
                toast.error("Failed to fetch inquiries.");
            })
        
    },[])

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
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/inquiries`,
                { message }, // Data being sent
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include token in Authorization header
                    },
                }
            );
            setInquiries([...inquiries, response.data]); // Update state with new inquiry
            setMessage(""); // Clear the input field
            toast.success("Inquiry sent successfully.");
        } catch (err) {
            console.error(err);
            setError("Failed to add inquiry.");
        } finally {
            setLoading(false); // Reset loading state
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
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/inquiries/${id}`,
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
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/inquiries/${id}`, { message: updatedMessage },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setInquiries(
                inquiries.map((inquiry) =>
                    inquiry.id === id ? { ...inquiry, message: updatedMessage } : inquiry
                )
            );
            toast.success("Inquiry updated successfully.");
        } catch (err) {
            console.error(err);
            setError("Failed to update inquiry.");
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-start bg-gray-50 p-4">
            <h1 className="text-3xl font-bold mb-4">Contact Us</h1>

            {/* Inquiry Form */}
            <form
                onSubmit={handleAddInquiry}
                className="w-full max-w-md bg-white p-6 rounded shadow mb-6"
            >
                <label htmlFor="message" className="block mb-2 font-medium">
                    Your Inquiry
                </label>
                <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded"
                    placeholder="Type your message here"
                    required
                ></textarea>
                <button
                    type="submit"
                    className="mt-4 w-full py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
                    disabled={loading}
                >
                    {loading ? "Sending..." : "Send Inquiry"}
                </button>
            </form>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Display Existing Inquiries */}
            <h2 className="text-xl font-bold mb-2">Your Inquiries</h2>
            <ul className="w-full max-w-md space-y-4">
                {inquiries.map((inquiry) => (
                    <li key={inquiry.id} className="bg-white p-4 rounded shadow">
                        <p>
                            <strong>Message:</strong> {inquiry.message}
                        </p>
                        <p>
                            <strong>Response:</strong>{" "}
                            {inquiry.response || "No response yet"}
                        </p>
                        <p>
                            <strong>Status:</strong>{" "}
                            {inquiry.isResolved ? "Resolved" : "Pending"}
                        </p>
                        <textarea
                            className="mt-2 p-2 border border-gray-300 rounded w-full"
                            defaultValue={inquiry.message}
                            onBlur={(e) =>
                                handleUpdateInquiry(inquiry.id, e.target.value)
                            }
                        ></textarea>
                        <button
                            onClick={() => handleDeleteInquiry(inquiry.id)}
                            className="mt-2 w-full py-2 bg-red-500 text-white font-bold rounded hover:bg-red-600"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
