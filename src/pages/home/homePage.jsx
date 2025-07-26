import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "../../components/header";
import Home from "./home";
import Gallery from "./gallery";
import Contact from "./contact";
import Items from "./items";
import ErrorNotFound from "./error";
import ProductOverview from "./productOverview";
import { BookingPage } from "./bookingPage";

export default function HomePage() {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY) {
        setShowHeader(true); // scrolling up
      } else {
        setShowHeader(false); // scrolling down
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
          showHeader ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <Header />
      </div>

      <div className="pt-10 w-full min-h-screen bg-primary">
        <Routes>
          <Route path="/items" element={<Items />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/product/:key" element={<ProductOverview />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<ErrorNotFound />} />
        </Routes>
      </div>
    </>
  );
}
