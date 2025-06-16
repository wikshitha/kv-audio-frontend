import { FaRegBookmark, FaRegUser, FaRegStar } from "react-icons/fa";
import { GoGraph } from "react-icons/go";
import { LuSpeaker } from "react-icons/lu";
import { MdPhotoLibrary } from "react-icons/md"; // Icon for gallery
import { Link, Route, Routes } from "react-router-dom";
import AdminItemspage from "./adminItemspage";
import AddItemPage from "./addItemPage";
import UpdateItemPage from "./updateItemPage";
import AdminUsersPage from "./adminUsersPage";
import AdminOrdersPage from "./adminOrdersPage";
import AdminReviewsPage from "./adminReviewsPage";
import AdminGalleryPage from "./adminGalleryPage"; // Import the new page
import { useEffect, useState } from "react";
import axios from "axios";
import DashboardPage from "./dashboard";
import AddGalleriesPage from "./addGalleriesPage";

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
        console.log(res.data);
        const user = res.data;
        if (user.role !== "Admin") {
          window.location.href = "/";
        } else {
          setUserValidated(true);
        }
      })
      .catch((err) => {
        setUserValidated(false);
      });
  }, []);

  return (
    <div className="w-full h-screen flex">
      {/* Sidebar */}
      <div className="w-[200px] h-full bg-green-300 overflow-auto">
        <Link
          to="/admin"
          className="w-full h-[40px] text-[25px] font-bold flex justify-center items-center"
        >
          <GoGraph className="mr-2" />
          Dashboard
        </Link>
        <Link
          to="/admin/orders"
          className="w-full h-[40px] text-[25px] font-bold flex justify-center items-center"
        >
          <FaRegBookmark className="mr-2" />
          Orders
        </Link>
        <Link
          to="/admin/items"
          className="w-full h-[40px] text-[25px] font-bold flex justify-center items-center"
        >
          <LuSpeaker className="mr-2" />
          Items
        </Link>
        <Link
          to="/admin/users"
          className="w-full h-[40px] text-[25px] font-bold flex justify-center items-center"
        >
          <FaRegUser className="mr-2" />
          Users
        </Link>
        <Link
          to="/admin/reviews"
          className="w-full h-[40px] text-[25px] font-bold flex justify-center items-center"
        >
          <FaRegStar className="mr-2" />
          Reviews
        </Link>
        <Link
          to="/admin/gallery"
          className="w-full h-[40px] text-[25px] font-bold flex justify-center items-center"
        >
          <MdPhotoLibrary className="mr-2" />
          Gallery
        </Link>
      </div>

      {/* Main Content */}
      <div className="w-[calc(100vw-200px)] h-full overflow-auto">
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
            <Route path="/" element={<DashboardPage />} />
          </Routes>
        )}
      </div>
    </div>
  );
}
