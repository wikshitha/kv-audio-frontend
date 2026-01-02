import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelopeOpen, FaShieldAlt, FaCheckCircle } from "react-icons/fa";

export default function VerifyEmail() {
    const token =  localStorage.getItem("token");
    const[otp,setOtp] = useState("");
    const[isLoading, setIsLoading] = useState(false);
    const[otpSent, setOtpSent] = useState(false);
    const navigate = useNavigate();
    
    useEffect(()=>{
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/sendOTP`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        }).then((res)=>{
            console.log(res)
            setOtpSent(true);
            toast.success("OTP sent to your email!");
        }).catch((err)=>{
            console.log(err)
            toast.error("Failed to send OTP");
        })
    },[token])
    
    function handleVerifyEmail() {
        if(!otp || otp.length < 4) {
            toast.error("Please enter a valid OTP");
            return;
        }
        
        setIsLoading(true);
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/verifyEmail`,{
            code :parseInt(otp)
        },{
            headers:{
                Authorization:`Bearer ${token}`
            }
    }).then((res)=>{
        console.log(res)
        toast.success("Email Verified Successfully!")
        setTimeout(() => {
            navigate("/")
        }, 1000);
    }).catch((err)=>{
        console.log(err)
        toast.error(err.response?.data?.message || "Invalid OTP")
    }).finally(() => {
        setIsLoading(false);
    })
    }

    return (
        <div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
            <motion.div 
                className="w-full max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Card */}
                <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border-2 border-gray-200">
                    {/* Header with gradient */}
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-8 text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4"
                        >
                            <FaEnvelopeOpen className="text-white text-4xl" />
                        </motion.div>
                        <h1 className="text-3xl font-black text-white mb-2">Verify Your Email</h1>
                        <p className="text-purple-100 font-semibold">
                            We've sent a verification code to your email
                        </p>
                    </div>

                    {/* Body */}
                    <div className="p-8">
                        {/* Info Badge */}
                        <motion.div 
                            className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="flex items-center gap-3">
                                <FaShieldAlt className="text-blue-500 text-xl flex-shrink-0" />
                                <p className="text-sm text-gray-700 font-semibold">
                                    {otpSent 
                                        ? "Please check your email inbox for the verification code"
                                        : "Sending verification code..."}
                                </p>
                            </div>
                        </motion.div>

                        {/* OTP Input */}
                        <motion.div 
                            className="mb-6"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Enter Verification Code
                            </label>
                            <input 
                                type="text" 
                                placeholder="Enter 6-digit code" 
                                value={otp} 
                                onChange={(e)=>setOtp(e.target.value)}
                                maxLength="6"
                                className="w-full px-4 py-4 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all outline-none tracking-widest"
                            />
                        </motion.div>

                        {/* Verify Button */}
                        <motion.button 
                            onClick={handleVerifyEmail}
                            disabled={isLoading || !otpSent}
                            className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    <FaCheckCircle className="text-xl" />
                                    Verify Email
                                </>
                            )}
                        </motion.button>

                        {/* Help Text */}
                        <motion.div 
                            className="mt-6 text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <p className="text-sm text-gray-600">
                                Didn't receive the code?{" "}
                                <button 
                                    onClick={() => window.location.reload()}
                                    className="text-purple-600 font-bold hover:text-purple-700 hover:underline transition-colors"
                                >
                                    Resend Code
                                </button>
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Bottom Info */}
                <motion.div 
                    className="mt-6 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                >
                    <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
                        <FaShieldAlt className="text-gray-400" />
                        Your information is secure and encrypted
                    </p>
                </motion.div>
            </motion.div>
        </div>
    )
}