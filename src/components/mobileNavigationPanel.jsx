import { FaHome, FaBoxOpen, FaCalendarCheck } from "react-icons/fa";
import { MdContactMail } from "react-icons/md";
import { BsImages } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function MobileNavigationPanel({ isOpen, setOpen }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [animatePanel, setAnimatePanel] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);

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

  if (!shouldRender) return null;

  return (
    <div
      className="w-full h-screen bg-[#00000080] fixed top-0 left-0 z-50 transition-opacity duration-300 ease-in-out"
      onClick={closePanelWithAnimation} // close on background click with animation
    >
      <div
        className={`h-full bg-white w-[250px] flex flex-col transform transition-transform duration-300 ease-in-out ${
          animatePanel ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()} // prevent close on panel click
      >
        <div className="bg-actiion h-[70px] w-full flex justify-center items-center relative">
          <img
            src="/logo.png"
            alt="logo"
            className="w-[60px] h-[60px] object-cover border -3 absolute left-2 rounded-full"
          />
          <IoMdClose
            className="absolute right-2 text-[30px] cursor-pointer"
            onClick={closePanelWithAnimation}
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          <div onClick={() => goTo("/")} className="text-[20px] text-actiion m-2 flex items-center gap-2 cursor-pointer">
            <FaHome /> Home
          </div>
          <div onClick={() => goTo("/contact")} className="text-[20px] text-actiion m-2 flex items-center gap-2 cursor-pointer">
            <MdContactMail /> Contact
          </div>
          <div onClick={() => goTo("/gallery")} className="text-[20px] text-actiion m-2 flex items-center gap-2 cursor-pointer">
            <BsImages /> Gallery
          </div>
          <div onClick={() => goTo("/items")} className="text-[20px] text-actiion m-2 flex items-center gap-2 cursor-pointer">
            <FaBoxOpen /> Items
          </div>
          <div onClick={() => goTo("/booking")} className="text-[20px] text-actiion m-2 flex items-center gap-2 cursor-pointer">
            <FaCalendarCheck /> Booking
          </div>

          <div className="p-4">
            {token ? (
              <button
                onClick={handleLogout}
                className="w-full py-2 rounded-md bg-black text-white hover:bg-gray-800 transition"
              >
                LogOut
              </button>
            ) : (
              <button
                onClick={() => goTo("/login")}
                className="w-full py-2 rounded-md bg-black text-white hover:bg-gray-800 transition"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
