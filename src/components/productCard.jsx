import { Link } from "react-router-dom";

export default function ProductCard({ item }) {
  return (
    <div className="w-[300px] bg-[#FFDFEF] rounded-2xl shadow-md overflow-hidden m-4 flex flex-col transition-transform hover:scale-105 duration-300">
      <img
        src={item.images[0]}
        alt={item.name}
        className="w-full h-48 object-cover"
      />

      <div className="p-4 flex flex-col flex-grow">
      <h2 className="text-xl font-bold text-gray-800">{item.nameHighlighted || item.name}</h2>
        <p className="text-sm text-[#AA60C8] mt-1">{item.category}</p>
        <p className="text-sm text-gray-700 mt-3 line-clamp-3">
          {item.description}
        </p>

        <div className="flex justify-between items-center mt-4">
          <span className="text-lg font-bold text-green-600">
            Rs. {item.price}
          </span>
          <span
            className={`px-3 py-1 text-xs rounded-full font-medium ${
              item.availability
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {item.availability ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        {item.dimensions && (
          <div className="mt-3 text-sm text-gray-600">
            <span className="font-medium">Dimensions:</span> {item.dimensions}
          </div>
        )}
      </div>

      <div className="p-4 pt-0 mt-auto">
        <Link
          to={`/product/${item.key}`}
          className="block w-full text-center py-2 bg-[#AA60C8] hover:bg-[#944eb3] text-white rounded-xl transition duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
