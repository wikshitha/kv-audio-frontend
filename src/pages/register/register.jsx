import { useState } from "react";
import "./register.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  function handleOnSubmit(e){
    e.preventDefault();
    console.log({ firstName, lastName, email, password, address, phone });
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    axios.post(`${backendUrl}/api/users`,{
        firstName:firstName,
        lastName:lastName,
        email:email,
        password:password,
        address:address,
        phone:phone
    } ).then((res)=>{
        console.log(res)
        toast.success("Registration Success")
        navigate("/login")
    }).catch((err)=>{
        toast.error(err?.response?.data?.message||"An error occured")
    })
  };

  return (
    <div className="bg-picture w-full h-screen flex justify-center items-center">
      <form onSubmit={handleOnSubmit}>
        <div className="w-[400px] min-h-[600px] backdrop-blur-xl rounded-2xl flex flex-col items-center py-10 relative">
          <img
            src="/logo.png"
            alt="logo"
            className="w-[100px] h-[100px] object-cover mb-6"
          />
          <input
            type="text"
            placeholder="First Name"
            className="input-field"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Last Name"
            className="input-field"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="text"
            placeholder="Address"
            className="input-field"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone"
            className="input-field"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button className="my-8 w-[300px] h-[50px] bg-[#efac38] text-2xl text-white rounded-lg">
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
