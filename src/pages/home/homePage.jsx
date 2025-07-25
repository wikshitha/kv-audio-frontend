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
    return (
        <>
            <Header />
            <div className="w-full min-h-screen bg-primary">
                <Routes path="/*">
                <Route path="/items" element={<Items/>}/>
                <Route path="/contact" element={<Contact/>}/>
                <Route path="/gallery" element={<Gallery/>}/>
                <Route path="/booking" element={<BookingPage/>}/>
                <Route path="/product/:key" element={<ProductOverview/>}/>
                <Route path="/" element={<Home/>}/>
                <Route path="/*" element={<ErrorNotFound/>}/>
                </Routes>
            </div>
        </>
    )
}