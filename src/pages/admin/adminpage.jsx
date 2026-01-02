import {
  FaRegBookmark,
  FaRegUser,
  FaRegStar,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";
import { GoGraph } from "react-icons/go";
import { LuSpeaker } from "react-icons/lu";
import { MdPhotoLibrary, MdAdminPanelSettings } from "react-icons/md";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/users/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const user = res.data;
        if (user.role !== "Admin") {
          navigate("/");
        } else {
          setUserValidated(true);
        }
      })
      .catch(() => {
        setUserValidated(false);
      });
  }, [navigate]);

  // Auto-close sidebar on mobile when route changes
  useEffect(() => {
    setShowSidebar(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row relative bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-gradient-to-r from-actiion via-secondary to-actiion flex items-center justify-between px-6 py-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
            <MdAdminPanelSettings className="text-white text-2xl" />
          </div>
          <span className="text-xl font-black text-white drop-shadow-lg">Admin Panel</span>
        </div>
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="text-white text-2xl p-2 hover:bg-white/20 rounded-lg transition-all duration-300"
          aria-label="Toggle menu"
        >
          {showSidebar ? <FaTimes /> : <GiHamburgerMenu />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed md:relative top-0 left-0 h-full z-40 bg-white shadow-2xl transform transition-all duration-300 ease-in-out
          ${showSidebar ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 w-[280px] md:block border-r border-gray-200`}
      >
        {/* Sidebar Header */}
        <div className="bg-gradient-to-r from-actiion via-secondary to-actiion p-6 md:p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
              <MdAdminPanelSettings className="text-white text-3xl" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white drop-shadow-lg">KV-Audio</h2>
              <p className="text-primary/90 text-sm font-semibold">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col p-4 gap-2">
          <SidebarLink to="/admin" icon={<GoGraph />} label="Dashboard" />
          <SidebarLink to="/admin/orders" icon={<FaRegBookmark />} label="Orders" />
          <SidebarLink to="/admin/items" icon={<LuSpeaker />} label="Items" />
          <SidebarLink to="/admin/users" icon={<FaRegUser />} label="Users" />
          <SidebarLink to="/admin/reviews" icon={<FaRegStar />} label="Reviews" />
          <SidebarLink to="/admin/gallery" icon={<MdPhotoLibrary />} label="Gallery" />
          <SidebarLink to="/admin/messages" icon={<FiMessageSquare />} label="Messages" />

          {/* Logout Button */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full h-[52px] flex items-center justify-start px-4 text-[16px] font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 group"
            >
              <span className="mr-3 text-[20px] group-hover:scale-110 transition-transform duration-300">
                <FaSignOutAlt />
              </span>
              Logout
            </button>
          </div>
        </nav>
      </div>

      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300 ${
          showSidebar ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setShowSidebar(false)}
        aria-hidden={!showSidebar}
      />

      {/* Main Content */}
      <div className="flex-1 h-full overflow-auto p-4 md:p-8">
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
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`w-full h-[52px] flex items-center justify-start px-4 text-[16px] font-bold rounded-xl transition-all duration-300 group relative overflow-hidden
        ${
          isActive
            ? "bg-gradient-to-r from-actiion to-secondary text-white shadow-lg shadow-actiion/30"
            : "text-gray-700 hover:bg-gradient-to-r hover:from-primary/20 hover:to-secondary/20 hover:text-actiion"
        }`}
    >
      {/* Active indicator */}
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"></div>
      )}
      
      <span className={`mr-3 text-[20px] transition-transform duration-300 group-hover:scale-110 ${isActive ? "scale-110" : ""}`}>
        {icon}
      </span>
      {label}
      
      {/* Hover effect */}
      {!isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-actiion/0 to-secondary/0 group-hover:from-actiion/5 group-hover:to-secondary/5 transition-all duration-300 rounded-xl"></div>
      )}
    </Link>
  );
}
