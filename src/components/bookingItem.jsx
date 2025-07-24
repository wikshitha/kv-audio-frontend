import axios from "axios";
import { useEffect, useState } from "react";
import { addToCart, removeFromCart } from "../utils/cart";
import { FaArrowDown, FaArrowUp, FaTrash } from "react-icons/fa";

export default function BookingItem({ itemKey, qty, refresh }) {
  const [item, setItem] = useState(null);
  const [status, setStatus] = useState("loading"); // loading, success, error

  useEffect(() => {
    if (status === "loading") {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${itemKey}`)
        .then((res) => {
          setItem(res.data);
          setStatus("success");
        })
        .catch(() => {
          setStatus("error");
          removeFromCart(itemKey);
          refresh();
        });
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="text-[#AA60C8] font-medium animate-pulse text-center py-6">
        Loading...
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="text-red-500 font-semibold text-center py-6">
        Failed to load product.
      </div>
    );
  }

  return (
    <div className="flex items-center gap-6 p-5 bg-white rounded-xl shadow-md border border-[#D69ADE] max-w-[700px] w-full relative mb-6">
      {/* Remove Button */}
      <button
        aria-label="Remove item"
        onClick={() => {
          removeFromCart(itemKey);
          refresh();
        }}
        className="absolute -right-4 -top-4 bg-[#AA60C8] text-white p-2 rounded-full shadow-md hover:bg-[#924d9e] transition"
      >
        <FaTrash size={16} />
      </button>

      {/* Product Image */}
      <img
        src={item.images[0]}
        alt={item.name}
        className="w-24 h-24 rounded-lg object-cover border-2 border-[#D69ADE] shadow-sm flex-shrink-0"
      />

      {/* Product Info & Controls */}
      <div className="flex flex-col flex-grow min-w-0">
        {/* Product Name */}
        <h3 className="text-xl font-bold text-[#AA60C8] truncate">{item.name}</h3>

        {/* Quantity and Pricing */}
        <div className="flex items-center justify-between mt-4 gap-4 flex-wrap">
          {/* Unit Price */}
          <p className="text-[#7C3AED] font-semibold text-lg whitespace-nowrap">
            LKR {item.price.toFixed(2)}
          </p>

          {/* Quantity Controls */}
          <div className="flex flex-col items-center gap-1 bg-[#D69ADE]/30 rounded-md p-2 min-w-[70px]">
            <button
              aria-label="Increase quantity"
              onClick={() => {
                addToCart(itemKey, 1);
                refresh();
              }}
              className="text-[#AA60C8] hover:text-[#7C3AED] transition"
            >
              <FaArrowUp size={18} />
            </button>

            <span className="font-semibold text-[#5B21B6] text-lg">{qty}</span>

            <button
              aria-label="Decrease quantity"
              onClick={() => {
                if (qty === 1) {
                  removeFromCart(itemKey);
                  refresh();
                } else {
                  addToCart(itemKey, -1);
                  refresh();
                }
              }}
              className="text-[#AA60C8] hover:text-[#7C3AED] transition"
            >
              <FaArrowDown size={18} />
            </button>
          </div>

          {/* Total Price */}
          <p className="text-[#5B21B6] font-extrabold text-lg whitespace-nowrap">
            LKR {(item.price * qty).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
