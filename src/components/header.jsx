import { FaCartShopping } from "react-icons/fa6";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link, useLocation } from "react-router-dom";
import MobileNavigationPanel from "./mobileNavigationPanel";
import { useState } from "react";

export default function Header() {
    const [navPanelOpen, setNavPanelOpen] = useState(false);
    const token = localStorage.getItem("token");
    const location = useLocation();

    // Highlight style for current page
    const isActive = (path) => location.pathname === path;

    return (
        <header className="w-full h-[70px] flex items-center justify-between px-4 md:px-10 shadow-md backdrop-blur-md bg-actiion/90">
            {/* Logo */}
            <Link to="/">
                <img
                    src="/logo.png"
                    alt="logo"
                    className="w-[50px] h-[50px] object-cover rounded-full border-2 border-white shadow-md"
                />
            </Link>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex gap-6 font-semibold text-lg">
                <Link
                    to="/"
                    className={`${isActive("/") ? "text-white" : "text-black hover:text-white"} transition`}
                >
                    Home
                </Link>
                <Link
                    to="/items"
                    className={`${isActive("/items") ? "text-white" : "text-black hover:text-white"} transition`}
                >
                    Items
                </Link>
                <Link
                    to="/gallery"
                    className={`${isActive("/gallery") ? "text-white" : "text-black hover:text-white"} transition`}
                >
                    Gallery
                </Link>
                <Link
                    to="/contact"
                    className={`${isActive("/contact") ? "text-white" : "text-black hover:text-white"} transition`}
                >
                    Contact
                </Link>
            </nav>

            {/* Right Controls */}
            <div className="flex items-center gap-4">
                {/* Booking / Cart */}
                <Link
                    to="/booking"
                    className={`hidden md:flex items-center text-xl ${
                        isActive("/booking") ? "text-white" : "text-black hover:text-white"
                    } transition`}
                >
                    <FaCartShopping />
                </Link>

                {/* Logout Button */}
                {token !== null && (
                    <button
                        className="hidden md:inline-block text-sm px-3 py-1 rounded-md bg-white text-black hover:bg-gray-200 transition"
                        onClick={() => {
                            localStorage.removeItem("token");
                            window.location.href = "/login";
                        }}
                    >
                        LogOut
                    </button>
                )}

                {/* Hamburger - Mobile */}
                <GiHamburgerMenu
                    className="md:hidden text-2xl cursor-pointer"
                    onClick={() => setNavPanelOpen(true)}
                />
            </div>

            {/* Mobile Side Panel */}
            <MobileNavigationPanel isOpen={navPanelOpen} setOpen={setNavPanelOpen} />
        </header>
    );
}
