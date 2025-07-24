import { useEffect, useState } from "react";
import { formatDate, loadCart } from "../../utils/cart";
import BookingItem from "../../components/bookingItem";
import axios from "axios";
import toast from "react-hot-toast";

export function BookingPage() {
  const [cart, setCart] = useState(loadCart());
  const [startingDate, setStartingDate] = useState(formatDate(new Date()));
  const [endingDate, setEndingDate] = useState(
    formatDate(new Date(Date.now() + 24 * 60 * 60 * 1000))
  );
  const [total, setTotal] = useState(0);

  const daysBetween = Math.max(
    (new Date(endingDate) - new Date(startingDate)) / (1000 * 60 * 60 * 24),
    1
  );

  function reloadCart() {
    setCart(loadCart());
    calculateTotal();
  }

  function calculateTotal() {
    const cartInfo = loadCart();
    cartInfo.startingDate = startingDate;
    cartInfo.endingDate = endingDate;
    cartInfo.days = daysBetween;
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/orders/quote`, cartInfo)
      .then((res) => {
        setTotal(res.data.order);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(() => {
    calculateTotal();
  }, [startingDate, endingDate]);

  function handleBookingCreation() {
    const cart = loadCart();
    cart.startingDate = startingDate;
    cart.endingDate = endingDate;
    cart.days = daysBetween;

    const token = localStorage.getItem("token");
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, cart, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        localStorage.removeItem("cart");
        toast.success("Booking Created");
        setCart(loadCart());
      })
      .catch(() => {
        toast.error("Failed to create booking");
      });
  }

  return (
    <div className="min-h-screen w-full bg-white max-w-5xl mx-auto px-6 py-10 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold mb-6 text-[#AA60C8] text-center">
        Create Booking
      </h1>

      {/* Date selectors */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl justify-center mb-8">
        <label className="flex flex-col flex-1">
          <span className="text-[#AA60C8] font-semibold mb-2">Starting Date</span>
          <input
            type="date"
            value={startingDate}
            onChange={(e) => setStartingDate(e.target.value)}
            className="border border-[#D69ADE] rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#AA60C8] transition"
          />
        </label>

        <label className="flex flex-col flex-1">
          <span className="text-[#AA60C8] font-semibold mb-2">Ending Date</span>
          <input
            type="date"
            value={endingDate}
            onChange={(e) => setEndingDate(e.target.value)}
            className="border border-[#D69ADE] rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#AA60C8] transition"
          />
        </label>
      </div>

      <p className="text-[#AA60C8] font-semibold mb-8 text-lg">
        Total Days: <span className="font-bold">{daysBetween}</span>
      </p>

      {/* Booking Items List */}
      <div className="w-full max-w-3xl flex flex-col">
        {cart.orderedItems.length > 0 ? (
          cart.orderedItems.map((item) => (
            <BookingItem
              itemKey={item.key}
              key={item.key}
              qty={item.qty}
              refresh={reloadCart}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 py-10">
            Your cart is empty. Add some items to book.
          </p>
        )}
      </div>

      {/* Total Price */}
      <div className="w-full max-w-3xl mt-8 flex justify-end">
        <p className="text-[#7C3AED] font-extrabold text-2xl">
          Total: LKR {total.toFixed(2)}
        </p>
      </div>

      {/* Create Booking Button */}
      <button
        onClick={handleBookingCreation}
        disabled={cart.orderedItems.length === 0}
        className={`mt-8 px-8 py-3 rounded-md font-semibold transition ${
          cart.orderedItems.length === 0
            ? "bg-[#D69ADE]/50 cursor-not-allowed text-white"
            : "bg-[#AA60C8] hover:bg-[#7C3AED] text-white shadow-lg"
        }`}
      >
        Create Booking
      </button>
    </div>
  );
}
