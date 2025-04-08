import { FaCartShopping } from "react-icons/fa6";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link } from "react-router-dom";
import MobileNavigationPanel from "./mobileNavigationPanel";
import { useState } from "react";

export default function Header() {
    const [navPanelOpen, setNavPanelOpen] = useState(false);
    const token = localStorage.getItem("token");
    return (
        <header className="w-full h-[70px] shadow-xl flex justify-center items-center relative bg-actiion">
            <img src="/logo.png" alt="logo" className="w-[60px] h-[60px] object-cover border -3 absolute right-2 md:left-2 rounded-full" />
            <div className="hidden w-[600px] md:flex justify-evenly items-center">
            <Link to ="/" className="hidden text-[22px] font-bold m-1 md:block">Home</Link>
            <Link to ="/contact" className="hidden text-[22px] font-bold m-1 md:block">Contact</Link>
            <Link to="/gallery" className="hidden text-[22px] font-bold m-1 md:block">Gallery</Link>
            <Link to ="/items" className="hidden text-[22px] font-bold m-1 md:block">Items</Link>
            </div>
            <Link to ="/booking" className="hidden text-[25px] font-bold m-1 absolute right-25 md:block"><FaCartShopping/></Link>
            
            <GiHamburgerMenu className="absolute left-3 text-[25px] md:hidden"
            onClick={() => {setNavPanelOpen(true)}}/> 
        {token!==null&&<button className="hidden md:block absolute right-5 text[25px]"
        onClick={()=>{
            localStorage.removeItem("token");
            window.location.href="/login";
        }}
        >LogOut</button>}
            <MobileNavigationPanel isOpen={navPanelOpen} setOpen={setNavPanelOpen}/>
        </header>
    )
}