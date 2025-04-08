import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function VerifyEmail() {
    const token =  localStorage.getItem("token");
    const[otp,setOtp] = useState("");
    const navigate = useNavigate();
    useEffect(()=>{
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/sendOTP`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        }).then((res)=>{
            console.log(res)
        }).catch((err)=>{
            console.log(err)
        })
    })
    function handleVerifyEmail() {
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/verifyEmail`,{
            code :parseInt(otp)
        },{
            headers:{
                Authorization:`Bearer ${token}`
            }
    }).then((res)=>{
        console.log(res)
        toast.success("Email Verified")
        navigate("/")
    }).catch((err)=>{
        console.log(err)
        toast.error("Invalid OTP")
    })
    }

    return (
        <div className="w-full h-screen flex justify-center items-center">
            <div className="w-[400px] h-[300px] bg-white shadow-lg rounded-lg flex flex-col justify-center items-center">
                <h1 className="text-2xl font-bold">Verify Email</h1>
                <p className="text-gray-500">Please verify your email to continue</p>
                <input type="number" placeholder="OTP" value={otp} onChange={(e)=>setOtp(e.target.value)} className="border p-2 rounded-lg w-[80%]"/>
                <button onClick={handleVerifyEmail} className="bg-blue-500 text-white p-2 rounded-lg w-[80%]">Verify</button>
            </div>
        </div>
    )
}