import { FaRegBookmark, FaRegUser } from "react-icons/fa";
import { GoGraph } from "react-icons/go";
import { LuSpeaker } from "react-icons/lu";
import { Link, Route, Routes } from "react-router-dom";
import AdminItemspage from "./adminItemspage";
import AddItemPage from "./addItemPage";
import UpdateItemPage from "./updateItemPage";
import AdminUsersPage from "./adminUsersPage";
import AdminOrdersPage from "./adminOrdersPage";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Adminpage() {
  const [userValidated, setUserValidated] = useState(false);

  useEffect(()=>{
    const token = localStorage.getItem("token");
    if(!token){
      window.location.href="/login";
    }

    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/`,{
      headers:{Authorization:`Bearer ${token}`}
    }).then((res)=>{
      console.log(res.data);
      const user = res.data
      if(user.role !== "Admin"){
        window.location.href="/";
      }
      else{
        setUserValidated(true);
      }
    }).catch((err)=>{
      setUserValidated(false);
    })
  },[])
   return(
    <div className="w-full h-screen flex">
    <div className="w-[200px] h-full bg-green-300" >
      <button className="w-full h-[40px] text-[25px] font-bold flex justify-center items-center">
        <GoGraph/>
        Dashboard
      </button>
      <Link to="/admin/orders" className="w-full h-[40px] text-[25px] font-bold flex justify-center items-center">
        <FaRegBookmark/>
        Orders
      </Link>
      <Link to="/admin/items" className="w-full h-[40px] text-[25px] font-bold flex justify-center items-center">
        <LuSpeaker/>
       Items
      </Link>
      <Link to="/admin/users" className="w-full h-[40px] text-[25px] font-bold flex justify-center items-center">
        <FaRegUser/>
        Users
      </Link>

    </div>
    <div className="w-[calc(100vw-200px)]">
      {userValidated &&<Routes path="/*">
        <Route path="/orders" element={<AdminOrdersPage/>}/>
        <Route path="/users" element={<AdminUsersPage/>}/>
        <Route path="/items" element={<AdminItemspage/>}/>
        <Route path="/items/add" element={<AddItemPage/>}/>
        <Route path="items/edit" element={<UpdateItemPage/>}/>
      </Routes>}
    </div>
    </div>
   )
}