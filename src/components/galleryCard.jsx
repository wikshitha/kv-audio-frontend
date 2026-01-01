import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";

export default function GalleryCard({ gallery }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl shadow-lg bg-white border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:scale-105 h-full">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={gallery.image}
          alt={gallery.key}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* View Icon */}
        <div className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <FaEye className="text-white text-xl" />
        </div>

        {/* Hover Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <p className="text-white text-sm leading-relaxed line-clamp-3">
              {gallery.description}
            </p>
          </div>
        </div>
      </div>

      {/* Title Bar */}
      <div className="p-5 bg-gradient-to-br from-white to-gray-50">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-actiion group-hover:to-secondary transition-all duration-300 flex-1 line-clamp-1">
            {gallery.key}
          </h3>
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-actiion to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>

      {/* Decorative Border on Hover */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-secondary/50 transition-all duration-300 pointer-events-none"></div>
    </div>
  );
}
