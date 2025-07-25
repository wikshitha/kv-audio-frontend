import axios from "axios";
import { useState, useEffect } from "react";
import GalleryCard from "../../components/galleryCard";

export default function GalleryPage() {
  const [state, setState] = useState("loading");
  const [galleries, setGalleries] = useState([]);

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    setState("loading");
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/gallery`);
      setGalleries(res.data);
      setState("success");
    } catch (err) {
      console.error(err);
      setState("error");
    }
  };

  return (
    <div className="w-full min-h-screen bg-white px-6 py-12">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Gallery Showcase</h2>
        <p className="text-gray-600 text-lg">
          Browse through our beautiful collection of past events, special moments, and highlights from our journey. Each image tells a story — from vibrant audio setups and event decorations to unforgettable gatherings captured in time.
        </p>
      </div>

      {/* Loading Spinner */}
      {state === "loading" && (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-actiion border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error Message */}
      {state === "error" && (
        <div className="text-center mt-10 text-red-600 font-medium text-lg">
          Oops! We couldn't load the gallery. Please try refreshing the page or come back later.
        </div>
      )}

      {/* No Galleries */}
      {state === "success" && galleries.length === 0 && (
        <div className="text-center mt-10 text-gray-500 text-lg">
          No gallery entries available right now. Stay tuned for upcoming events!
        </div>
      )}

      {/* Gallery Grid */}
      {state === "success" && galleries.length > 0 && (
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {galleries.map((gallery) => (
            <GalleryCard key={gallery.key} gallery={gallery} />
          ))}
        </div>
      )}
    </div>
  );
}
