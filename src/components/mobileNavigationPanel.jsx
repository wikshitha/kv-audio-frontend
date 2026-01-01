import { FaHome, FaBoxOpen, FaCalendarCheck, FaUser } from "react-icons/fa";
import { MdContactMail } from "react-icons/md";
import { BsImages } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function MobileNavigationPanel({ isOpen, setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [userData, setUserData] = useState(null);

  const [animatePanel, setAnimatePanel] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);

  // Parse JWT to get user data
  const parseJWT = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (err) {
      console.error("Failed to parse token:", err);
      return null;
    }
  };

  // Get user data from token
  useEffect(() => {
    if (token) {
      const decoded = parseJWT(token);
      if (decoded) {
        setUserData({
          firstName: decoded.firstname || decoded.firstName || "User",
          profilePic: decoded.profilePic || "/user.png",
        });
      }
    }
  }, [token]);

  // Handle mounting/unmounting with animation
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Start slide-in animation
      setTimeout(() => setAnimatePanel(true), 10);
    } else {
      // Start slide-out animation
      setAnimatePanel(false);
      // After animation duration, unmount
      const timeoutId = setTimeout(() => setShouldRender(false), 300); // duration matches transition
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  function goTo(route) {
    navigate(route);
    closePanelWithAnimation();
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
    closePanelWithAnimation();
  }

  function closePanelWithAnimation() {
    // Trigger slide-out animation then close panel
    setAnimatePanel(false);
    setTimeout(() => setOpen(false), 300); // match animation duration
  }

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: "/", label: "Home", icon: <FaHome /> },
    { path: "/items", label: "Equipment", icon: <FaBoxOpen /> },
    { path: "/gallery", label: "Gallery", icon: <BsImages /> },
    { path: "/contact", label: "Contact", icon: <MdContactMail /> },
    { path: "/booking", label: "Cart", icon: <FaCalendarCheck /> },
  ];

  if (!shouldRender) return null;

  return (
    <div
      className="w-full h-screen bg-black/60 backdrop-blur-sm fixed top-0 left-0 z-50 transition-opacity duration-300 ease-in-out"
      onClick={closePanelWithAnimation}
    >
      <div
        className={`h-full bg-gradient-to-br from-white to-primary/30 w-[280px] flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out ${
          animatePanel ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-actiion via-secondary to-actiion p-6 relative">
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/logo.png"
              alt="KV-Audio Logo"
              className="w-14 h-14 object-contain drop-shadow-lg"
            />
            <div>
              <h2 className="text-white font-black text-xl tracking-tight">KV-Audio</h2>
              <p className="text-primary/90 text-xs font-medium">Premium Rentals</p>
            </div>
          </div>

          <button
            onClick={closePanelWithAnimation}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
          >
            <IoMdClose className="text-white text-2xl" />
          </button>

          {/* User Profile Section */}
          {token && userData && (
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center gap-3">
                <img
                  src={userData.profilePic || "/user.png"}
                  alt={userData.firstName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/user.png";
                  }}
                />
                <div>
                  <p className="text-white font-bold text-sm">Welcome!</p>
                  <p className="text-primary text-sm font-semibold">{userData.firstName}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {menuItems.map((item) => (
            <div
              key={item.path}
              onClick={() => goTo(item.path)}
              className={`flex items-center gap-4 px-4 py-3 my-1 rounded-xl cursor-pointer transition-all duration-300 ${
                isActive(item.path)
                  ? "bg-gradient-to-r from-actiion to-secondary text-white shadow-lg scale-105"
                  : "text-gray-700 hover:bg-primary/50 hover:text-actiion"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-semibold">{item.label}</span>
            </div>
          ))}
        </nav>

        {/* Bottom Action Button */}
        <div className="p-4 border-t border-gray-200">
          {token ? (
            <button
              onClick={handleLogout}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
            >
              <FaUser className="text-sm" />
              Logout
            </button>
          ) : (
            <button
              onClick={() => goTo("/login")}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-actiion to-secondary text-white font-bold hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              <FaUser className="text-sm" />
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
