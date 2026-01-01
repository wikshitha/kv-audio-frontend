import axios from "axios";
import { useEffect, useState } from "react";
import { addToCart, removeFromCart } from "../utils/cart";
import { FaArrowDown, FaArrowUp, FaTrash, FaPlus, FaMinus } from "react-icons/fa";

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
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 animate-pulse">
        <div className="flex items-center gap-6">
          <div className="w-32 h-32 bg-gradient-to-br from-primary/30 to-secondary/20 rounded-xl"></div>
          <div className="flex-1 space-y-3">
            <div className="h-6 bg-gradient-to-r from-primary/30 to-secondary/20 rounded-lg w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="bg-red-50 rounded-2xl shadow-lg p-6 border border-red-200 text-center">
        <p className="text-red-600 font-bold">Failed to load product</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition-all duration-300 hover:shadow-xl group">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Product Image */}
        <div className="relative">
          <img
            src={item.images[0]}
            alt={item.name}
            className="w-full md:w-32 h-40 md:h-32 rounded-xl object-cover shadow-md border-2 border-gray-100 group-hover:border-secondary/50 transition-all duration-300"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col">
          {/* Name and Remove Button */}
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-900 pr-4">{item.name}</h3>
            <button
              onClick={() => {
                removeFromCart(itemKey);
                refresh();
              }}
              className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 transition-all duration-300 transform hover:scale-110"
              aria-label="Remove item"
            >
              <FaTrash className="text-lg" />
            </button>
          </div>

          {/* Price and Quantity Controls */}
          <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mt-auto">
            {/* Unit Price */}
            <div>
              <p className="text-sm text-gray-600 mb-1">Unit Price</p>
              <p className="text-lg font-bold text-gray-900">
                LKR {item.price.toFixed(2)}
              </p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl p-2">
                <button
                  onClick={() => {
                    if (qty === 1) {
                      removeFromCart(itemKey);
                      refresh();
                    } else {
                      addToCart(itemKey, -1);
                      refresh();
                    }
                  }}
                  className="w-8 h-8 rounded-lg bg-white shadow-md hover:shadow-lg flex items-center justify-center text-actiion hover:text-secondary transition-all duration-300 transform hover:scale-110"
                  aria-label="Decrease quantity"
                >
                  <FaMinus className="text-sm" />
                </button>

                <span className="text-xl font-bold text-gray-900 min-w-[2rem] text-center">
                  {qty}
                </span>

                <button
                  onClick={() => {
                    addToCart(itemKey, 1);
                    refresh();
                  }}
                  className="w-8 h-8 rounded-lg bg-white shadow-md hover:shadow-lg flex items-center justify-center text-actiion hover:text-secondary transition-all duration-300 transform hover:scale-110"
                  aria-label="Increase quantity"
                >
                  <FaPlus className="text-sm" />
                </button>
              </div>

              {/* Total Price */}
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Subtotal</p>
                <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-actiion to-secondary">
                  LKR {(item.price * qty).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
