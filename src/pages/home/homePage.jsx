import { Route, Routes } from "react-router-dom";
import Header from "../../components/header";
import Home from "./home";
import Gallery from "./gallery";
import Contact from "./contact";
import Items from "./items";
import ErrorNotFound from "./error";

export default function HomePage() {
    return (
        <>
            <Header />
            <div className="w-full h-[calc(100vh-100px)]">
                <Routes path="/*">
                <Route path="/items" element={<Items/>}/>
                <Route path="/contact" element={<Contact/>}/>
                <Route path="/gallery" element={<Gallery/>}/>
                <Route path="/" element={<Home/>}/>
                <Route path="/*" element={<ErrorNotFound/>}/>
                </Routes>
            </div>
        </>
    )
}