import { FaRegBookmark, FaRegUser, FaRegStar } from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";
import { GoGraph } from "react-icons/go";
import { LuSpeaker } from "react-icons/lu";
import { MdPhotoLibrary } from "react-icons/md"; 
import { Link, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

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

  return (
    <div className="w-full h-screen flex">
      {/* Sidebar */}
      <div className="w-[200px] h-full bg-green-300 shadow-md">
        <nav className="flex flex-col">
          <SidebarLink to="/admin" icon={<GoGraph />} label="Dashboard" />
          <SidebarLink to="/admin/orders" icon={<FaRegBookmark />} label="Orders" />
          <SidebarLink to="/admin/items" icon={<LuSpeaker />} label="Items" />
          <SidebarLink to="/admin/users" icon={<FaRegUser />} label="Users" />
          <SidebarLink to="/admin/reviews" icon={<FaRegStar />} label="Reviews" />
          <SidebarLink to="/admin/gallery" icon={<MdPhotoLibrary />} label="Gallery" />
          <SidebarLink to="/admin/messages" icon={<FiMessageSquare />} label="Messages" />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 h-full overflow-auto">
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
