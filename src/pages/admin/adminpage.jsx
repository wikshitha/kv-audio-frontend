import {
  FaRegBookmark,
  FaRegUser,
  FaRegStar,
} from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";
import { GoGraph } from "react-icons/go";
import { LuSpeaker } from "react-icons/lu";
import { MdPhotoLibrary } from "react-icons/md";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { GiHamburgerMenu } from "react-icons/gi";

import AdminItemspage from "./adminItemspage";
import AddItemPage from "./addItemPage";
import UpdateItemPage from "./updateItemPage";
import AdminUsersPage from "./adminUsersPage";
import AdminOrdersPage from "./adminOrdersPage";
import AdminReviewsPage from "./adminReviewsPage";
import AdminGalleryPage from "./adminGalleryPage";
import DashboardPage from "./dashboard";
import AddGalleriesPage from "./addGalleriesPage";
import AdminMessagesPage from "./adminmessages";

export default function Adminpage() {
  const [userValidated, setUserValidated] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/users/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const user = res.data;
        if (user.role !== "Admin") {
          window.location.href = "/";
        } else {
          setUserValidated(true);
        }
      })
      .catch(() => {
        setUserValidated(false);
      });
  }, []);

  // Auto-close sidebar on mobile when route changes
  useEffect(() => {
    setShowSidebar(false);
  }, [location.pathname]);

  return (
    <div className="w-full h-screen flex flex-col md:flex-row relative bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-green-300 flex items-center justify-between px-4 py-3 shadow-md">
        <span className="text-xl font-bold">Admin Panel</span>
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="text-2xl"
        >
          <GiHamburgerMenu />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed md:relative top-0 left-0 h-full z-40 bg-green-300 shadow-md transform transition-transform duration-300 ease-in-out
          ${showSidebar ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 w-[200px] md:block`}
      >
        <nav className="flex flex-col mt-16 md:mt-0">
          <SidebarLink to="/admin" icon={<GoGraph />} label="Dashboard" />
          <SidebarLink to="/admin/orders" icon={<FaRegBookmark />} label="Orders" />
          <SidebarLink to="/admin/items" icon={<LuSpeaker />} label="Items" />
          <SidebarLink to="/admin/users" icon={<FaRegUser />} label="Users" />
          <SidebarLink to="/admin/reviews" icon={<FaRegStar />} label="Reviews" />
          <SidebarLink to="/admin/gallery" icon={<MdPhotoLibrary />} label="Gallery" />
          <SidebarLink to="/admin/messages" icon={<FiMessageSquare />} label="Messages" />
        </nav>
      </div>

      {/* Overlay for mobile with lighter visible background */}
      <div
        className={`fixed inset-0 bg-black z-30 md:hidden transition-opacity duration-300 ${
          showSidebar ? "opacity-20 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setShowSidebar(false)}
        aria-hidden={!showSidebar}
      />

      {/* Main Content */}
      <div className="flex-1 h-full overflow-auto p-3 pt-4">
        {userValidated && (
          <Routes>
            <Route path="/orders" element={<AdminOrdersPage />} />
            <Route path="/users" element={<AdminUsersPage />} />
            <Route path="/items" element={<AdminItemspage />} />
            <Route path="/items/add" element={<AddItemPage />} />
            <Route path="/items/edit" element={<UpdateItemPage />} />
            <Route path="/reviews" element={<AdminReviewsPage />} />
            <Route path="/gallery" element={<AdminGalleryPage />} />
            <Route path="/gallery/add" element={<AddGalleriesPage />} />
            <Route path="/messages" element={<AdminMessagesPage />} />
            <Route path="/" element={<DashboardPage />} />
          </Routes>
        )}
      </div>
    </div>
  );
}

function SidebarLink({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="w-full h-[50px] flex items-center justify-start px-4 text-[18px] font-medium text-gray-700 hover:bg-green-400 transition-colors duration-200"
    >
      <span className="mr-3 text-[22px]">{icon}</span>
      {label}
    </Link>
  );
}
