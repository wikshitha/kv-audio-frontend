import { FaHome, FaBoxOpen, FaCalendarCheck } from "react-icons/fa";
import { MdContactMail } from "react-icons/md";
import { BsImages } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export default function MobileNavigationPanel(props) {
    const isOpen = props.isOpen;
    const setOpen = props.setOpen;
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    function goTo(route) {
        navigate(route);
        setOpen(false);
    }

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/login");
        setOpen(false);
    }

    return (
        <>
            {isOpen && (
                <div className="w-full h-screen bg-[#00000080] fixed top-0 left-0 z-50">
                    <div className="h-full bg-white w-[250px] flex flex-col justify-between">
                        {/* Top Section */}
                        <div>
                            <div className="bg-actiion h-[70px] w-full flex justify-center items-center relative">
                                <img
                                    src="/logo.png"
                                    alt="logo"
                                    className="w-[60px] h-[60px] object-cover border -3 absolute left-2 rounded-full"
                                />
                                <IoMdClose
                                    className="absolute right-2 text-[30px] cursor-pointer"
                                    onClick={() => {
                                        setOpen(false);
                                    }}
                                />
                            </div>

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
                        </div>

                        {/* Bottom Section - Login / Logout */}
                        <div className="p-4 border-t">
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
            )}
        </>
    );
}
