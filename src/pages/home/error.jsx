import { Link } from "react-router-dom";

export default function ErrorNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#FFDFEF] to-[#D69ADE] px-4">
      <div className="bg-black/20 backdrop-blur-md rounded-xl p-10 shadow-xl text-center max-w-md w-full">
        <h1 className="text-6xl font-extrabold text-[#aa1a1a] mb-2">404</h1>
        <h2 className="text-2xl text-white font-semibold mb-4">Page Not Found</h2>
        <p className="text-white/80 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 rounded-md bg-[#AA60C8] text-white font-semibold shadow-md hover:bg-[#934cb5] transition duration-300"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
