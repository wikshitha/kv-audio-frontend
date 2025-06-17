import axios from "axios";
import { useState, useEffect } from "react";
import GalleryCard from "../../components/galleryCard";

export default function GalleryPage() {
  const [state, setState] = useState("loading"); // loading, success, error
  const [galleries, setGalleries] = useState([]);

  // Fetch Galleries
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
    <div className="w-full p-6">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-blue-600">Gallery Showcase</h1>
      <p className="text-center text-gray-600 mb-8">
        Explore our curated collection of images and descriptions from our gallery. Discover the beauty and uniqueness captured in each piece.
      </p>

      {/* State Handling */}
      {state === "loading" && (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {state === "error" && (
        <p className="text-center text-red-500">
          Failed to load galleries. Please refresh the page or try again later.
        </p>
      )}

      {/* Display Galleries */}
      {state === "success" && (
        <>
          {galleries.length === 0 ? (
            <p className="text-center text-gray-500">No galleries available at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleries.map((gallery) => (
                <GalleryCard key={gallery.key} gallery={gallery} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
