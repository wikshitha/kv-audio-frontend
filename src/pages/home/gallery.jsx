import axios from "axios";
import { useState, useEffect } from "react";
import GalleryCard from "../../components/galleryCard";
import Footer from "../../components/footer";
import { FaImages, FaCamera } from "react-icons/fa";

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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-actiion via-secondary to-actiion py-20 px-4 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-white rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6 animate-fade-in-down">
            <FaCamera className="text-white text-5xl" />
            <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-lg">
              Gallery Showcase
            </h1>
          </div>
          <p className="text-lg md:text-xl text-primary/90 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
            Browse through our beautiful collection of past events, special moments, and highlights from our journey.
            Each image tells a story — from vibrant audio setups and event decorations to unforgettable gatherings
            captured in time.
          </p>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-grow w-full px-4 md:px-6 py-12">
        {/* Loading State */}
        {state === "loading" && (
          <div className="flex flex-col justify-center items-center h-64 animate-fade-in">
            <div className="relative w-20 h-20 mb-4">
              <div className="absolute inset-0 border-4 border-primary rounded-full animate-ping opacity-20"></div>
              <div className="absolute inset-0 border-4 border-t-actiion border-r-secondary border-b-primary border-l-actiion rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600 font-semibold">Loading gallery...</p>
          </div>
        )}

        {/* Error Message */}
        {state === "error" && (
          <div className="max-w-2xl mx-auto mt-10 animate-fade-in">
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaImages className="text-3xl text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-red-600 mb-2">Oops! Something went wrong</h3>
              <p className="text-red-500">
                We couldn't load the gallery. Please try refreshing the page or come back later.
              </p>
              <button
                onClick={fetchGalleries}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* No Galleries */}
        {state === "success" && galleries.length === 0 && (
          <div className="max-w-2xl mx-auto mt-10 animate-fade-in">
            <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-primary/30 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaImages className="text-5xl text-actiion" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Gallery Entries Yet</h3>
              <p className="text-gray-600 text-lg">
                Stay tuned for upcoming events and beautiful moments!
              </p>
            </div>
          </div>
        )}

        {/* Gallery Grid */}
        {state === "success" && galleries.length > 0 && (
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-8">
              <FaImages className="text-2xl text-actiion" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Our Collection ({galleries.length})
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {galleries.map((gallery, index) => (
                <div
                  key={gallery.key}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <GalleryCard gallery={gallery} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
