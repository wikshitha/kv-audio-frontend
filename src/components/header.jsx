import { FaCartShopping, FaUser } from "react-icons/fa6";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link, useLocation } from "react-router-dom";
import MobileNavigationPanel from "./mobileNavigationPanel";
import { useState, useEffect } from "react";

export default function Header() {
    const [navPanelOpen, setNavPanelOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [userData, setUserData] = useState(null);
    const token = localStorage.getItem("token");
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

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

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header 
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled 
                    ? "h-[70px] bg-white/95 backdrop-blur-xl shadow-lg" 
                    : "h-[80px] bg-gradient-to-r from-actiion/95 via-secondary/95 to-actiion/95 backdrop-blur-md shadow-md"
            }`}
        >
            <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 md:px-8">
                {/* Logo & Brand */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="relative">
                        <img
                            src="/logo.png"
                            alt="KV-Audio Logo"
                            className={`transition-all duration-300 object-contain ${
                                scrolled ? "w-[45px] h-[45px]" : "w-[55px] h-[55px]"
                            } drop-shadow-lg group-hover:scale-110`}
                        />
                        <div className="absolute inset-0 bg-secondary rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity"></div>
                    </div>
                    <div className="hidden sm:block">
                        <h1 className={`font-black tracking-tight transition-all duration-300 ${
                            scrolled 
                                ? "text-2xl text-transparent bg-clip-text bg-gradient-to-r from-actiion to-secondary" 
                                : "text-3xl text-white drop-shadow-lg"
                        }`}>
                            KV-Audio
                        </h1>
                        <p className={`text-xs font-medium transition-all duration-300 ${
                            scrolled ? "text-gray-600" : "text-primary/90"
                        }`}>
                            Premium Rentals
                        </p>
                    </div>
                </Link>

                {/* Navigation - Desktop */}
                <nav className="hidden md:flex items-center gap-1">
                    {[
                        { path: "/", label: "Home" },
                        { path: "/items", label: "Equipment" },
                        { path: "/gallery", label: "Gallery" },
                        { path: "/contact", label: "Contact" },
                    ].map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`relative px-4 py-2 font-semibold transition-all duration-300 rounded-lg ${
                                isActive(item.path)
                                    ? scrolled
                                        ? "text-white bg-gradient-to-r from-actiion to-secondary shadow-lg"
                                        : "text-actiion bg-white shadow-lg"
                                    : scrolled
                                        ? "text-gray-700 hover:text-actiion hover:bg-primary/30"
                                        : "text-white hover:bg-white/20"
                            }`}
                        >
                            {item.label}
                            {isActive(item.path) && (
                                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-current rounded-full"></span>
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Right Controls */}
                <div className="flex items-center gap-6">
                    {/* Booking / Cart */}
                    <Link
                        to="/booking"
                        className={`relative p-3 rounded-full transition-all duration-300 ${
                            isActive("/booking")
                                ? scrolled
                                    ? "bg-gradient-to-r from-actiion to-secondary text-white shadow-lg"
                                    : "bg-white text-actiion shadow-lg"
                                : scrolled
                                    ? "bg-gray-100 text-gray-700 hover:bg-primary/50 hover:text-actiion"
                                    : "bg-white/20 text-white hover:bg-white/30"
                        } group`}
                    >
                        <FaCartShopping className="text-xl group-hover:scale-110 transition-transform" />
                        {/* Cart badge - optional */}
                        {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">3</span> */}
                    </Link>

                    {/* Auth Buttons - Desktop */}
                    {token ? (
                        <div className="hidden md:flex items-center gap-6">
                            {/* User Profile */}
                            <div className="flex items-center gap-3">
                                <img
                                    src={userData?.profilePic || "/user.png"}
                                    alt={userData?.firstName || "User"}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-lg"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/user.png";
                                    }}
                                />
                                <span className={`font-semibold transition-colors duration-300 ${
                                    scrolled ? "text-gray-800" : "text-white"
                                }`}>
                                    Welcome, {userData?.firstName || "User"}
                                </span>
                            </div>

                            {/* Logout Button */}
                            <button
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-all duration-300 shadow-lg ${
                                    scrolled
                                        ? "bg-red-500 text-white hover:bg-red-600 hover:shadow-xl hover:scale-105"
                                        : "bg-white text-red-500 hover:bg-red-50 hover:scale-105"
                                }`}
                                onClick={() => {
                                    localStorage.removeItem("token");
                                    window.location.href = "/login";
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className={`hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-all duration-300 shadow-lg ${
                                scrolled
                                    ? "bg-gradient-to-r from-actiion to-secondary text-white hover:shadow-xl hover:scale-105"
                                    : "bg-white text-actiion hover:bg-primary hover:scale-105"
                            }`}
                        >
                            <FaUser className="text-sm" />
                            Login
                        </Link>
                    )}

                    {/* Hamburger - Mobile */}
                    <button
                        className={`md:hidden p-3 rounded-full transition-all duration-300 ${
                            scrolled
                                ? "bg-gray-100 text-gray-700 hover:bg-primary/50"
                                : "bg-white/20 text-white hover:bg-white/30"
                        }`}
                        onClick={() => setNavPanelOpen(true)}
                    >
                        <GiHamburgerMenu className="text-2xl" />
                    </button>
                </div>
            </div>

            {/* Mobile Side Panel */}
            <MobileNavigationPanel isOpen={navPanelOpen} setOpen={setNavPanelOpen} />
        </header>
    );
}
