import { FaRegBookmark, FaRegUser } from "react-icons/fa";
import { GoGraph } from "react-icons/go";
import { LuSpeaker } from "react-icons/lu";
import { Link, Route, Routes } from "react-router-dom";
import AdminItemspage from "./adminItemspage";
import AddItemPage from "./addItemPage";

export default function Adminpage() {
   return(
    <div className="w-full h-screen flex">
    <div className="w-[200px] h-full bg-green-300" >
      <button className="w-full h-[40px] text-[25px] font-bold flex justify-center items-center">
        <GoGraph/>
        Dashboard
      </button>
      <Link to="/admin/booking" className="w-full h-[40px] text-[25px] font-bold flex justify-center items-center">
        <FaRegBookmark/>
        Booking
      </Link>
      <Link to="/admin/items" className="w-full h-[40px] text-[25px] font-bold flex justify-center items-center">
        <LuSpeaker/>
       Items
      </Link>
      <button className="w-full h-[40px] text-[25px] font-bold flex justify-center items-center">
        <FaRegUser/>
        Users
      </button>

    </div>
    <div className="w-[calc(100vw-200px)]">
      <Routes path="/*">
        <Route path="/booking" element={<h1>Booking</h1>}/>
        <Route path="/items" element={<AdminItemspage/>}/>
        <Route path="/items/add" element={<AddItemPage/>}/>
      </Routes>
    </div>
    </div>
   )
}