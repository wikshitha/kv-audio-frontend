import { FaRegBookmark, FaRegUser } from "react-icons/fa";
import { GoGraph } from "react-icons/go";
import { LuSpeaker } from "react-icons/lu";

export default function Adminpage() {
   return(
    <div className="w-full h-screen flex">
    <div className="w-[300px] h-full bg-green-300" >
      <button className="w-full h-[40px] text-[25px] font-bold flex justify-center items-center">
        <GoGraph/>
        Dashboard
      </button>
      <button className="w-full h-[40px] text-[25px] font-bold flex justify-center items-center">
        <FaRegBookmark/>
        Booking
      </button>
      <button className="w-full h-[40px] text-[25px] font-bold flex justify-center items-center">
        <LuSpeaker/>
       Items
      </button>
      <button className="w-full h-[40px] text-[25px] font-bold flex justify-center items-center">
        <FaRegUser/>
        Users
      </button>

    </div>
    <div className="w-full bg-red-700">

    </div>
    </div>
   )
}