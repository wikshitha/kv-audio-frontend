import { Link } from "react-router-dom";

export default function GalleryCard({ gallery }) {
  return (
    <div className="relative group overflow-hidden rounded-lg shadow-md border border-gray-200 bg-white">
      {/* Image */}
      <img
        src={gallery.image}
        alt={gallery.key}
        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Slide-Up Overlay */}
      <div className="absolute bottom-0 left-0 w-full h-full bg-black bg-opacity-60 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out flex flex-col justify-center items-center text-white px-4 text-center">
        <h2 className="text-xl font-bold mb-2">{gallery.key}</h2>
        <p className="text-sm">{gallery.description}</p>
      </div>

      {/* Title under image (optional) */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 text-center">{gallery.key}</h2>
      </div>
    </div>
  );
}
