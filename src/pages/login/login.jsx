import axios from "axios";
import "./login.css";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()
  const googleLogin = useGoogleLogin(
    {
      onSuccess : (res)=>{
        console.log(res)
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/google`,{
          accessToken : res.access_token
        }).then((res)=>{
          console.log(res)
          toast.success("Login Success")
          const user = res.data.user
          localStorage.setItem("token",res.data.token)
          
          if(user.role === "Admin"){
            navigate("/admin/")
          }else{
            navigate("/")
          }
          
        }).catch((err)=>{
          console.log(err)
        })
      }
    }
  )

  function handleOnSubmit(e){
    e.preventDefault()
    console.log(email , password)
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    axios.post(`${backendUrl}/api/users/login`,
      {
        email : email,
        password : password
      }
    ).then((res)=>{

      console.log(res.data.user)
      toast.success("Login Success")
      const user = res.data.user
      localStorage.setItem("token",res.data.token)
      
      if(user.role === "Admin"){
        navigate("/admin/")
      }else{
        navigate("/")
      }
      

    }).catch((err)=>{
      console.log(err)
      toast.error(err.response.data.error)
    })

  }

  return (
    <div className="bg-picture w-full h-screen  flex justify-center items-center">
      <form onSubmit={handleOnSubmit}>
        <div className="w-[400px] h-[400px] backdrop-blur-xl rounded-2xl flex justify-center items-center flex-col relative">
          <img
            src="/logo.png"
            alt="logo"
            className="w-[100px] h-[100px] object-cover "
          />

          <input
            type="email"
            placeholder="Email"
            className="mt-6 w-[300px] h-[30px] bg-transparent border-b-2 border-white text-white text-xl outline-none"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-[300px] h-[30px]
        mt-6 bg-transparent border-b-2 border-white text-white text-xl outline-none"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <button className="my-8 w-[300px] h-[50px] bg-[#efac38] text-2xl text-white rounded-lg">
            Login
          </button>
          <div className="my-8 w-[300px] h-[50px] bg-[#efac38] text-2xl text-white rounded-lg"
          onClick={googleLogin}>
            Login with Google
          </div>
        </div>
      </form>
    </div>
  );
}
