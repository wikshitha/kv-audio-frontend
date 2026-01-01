import { useEffect, useState } from "react";
import { formatDate, loadCart } from "../../utils/cart";
import BookingItem from "../../components/bookingItem";
import axios from "axios";
import toast from "react-hot-toast";
import { FaCalendarAlt, FaShoppingCart, FaClock } from "react-icons/fa";

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
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-actiion via-secondary to-actiion py-16 px-4 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4 animate-fade-in-down">
            <FaShoppingCart className="text-white text-4xl" />
            <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-lg">
              Your Cart
            </h1>
          </div>
          <p className="text-lg md:text-xl text-primary/90 max-w-2xl mx-auto animate-fade-in-up">
            Review your selected items and complete your rental booking
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Date Selection Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 border border-gray-100 animate-fade-in">
          <div className="flex items-center gap-2 mb-6">
            <FaCalendarAlt className="text-actiion text-2xl" />
            <h2 className="text-2xl font-bold text-gray-900">Rental Period</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Starting Date */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Starting Date
              </label>
              <input
                type="date"
                value={startingDate}
                onChange={(e) => setStartingDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-actiion focus:ring-4 focus:ring-actiion/10 text-gray-700 font-semibold transition-all duration-300"
              />
            </div>

            {/* Ending Date */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Ending Date
              </label>
              <input
                type="date"
                value={endingDate}
                onChange={(e) => setEndingDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-actiion focus:ring-4 focus:ring-actiion/10 text-gray-700 font-semibold transition-all duration-300"
              />
            </div>
          </div>

          {/* Days Display */}
          <div className="bg-gradient-to-r from-actiion/10 to-secondary/10 rounded-xl p-4 flex items-center justify-center gap-3">
            <FaClock className="text-actiion text-2xl" />
            <p className="text-xl font-bold text-gray-900">
              Rental Duration: <span className="text-transparent bg-clip-text bg-gradient-to-r from-actiion to-secondary">{daysBetween} {daysBetween === 1 ? 'Day' : 'Days'}</span>
            </p>
          </div>
        </div>

        {/* Cart Items */}
        <div className="mb-8">
          {cart.orderedItems.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaShoppingCart className="text-actiion" />
                Cart Items ({cart.orderedItems.length})
              </h2>
              {cart.orderedItems.map((item, index) => (
                <div 
                  key={item.key}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <BookingItem
                    itemKey={item.key}
                    qty={item.qty}
                    refresh={reloadCart}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <div className="w-24 h-24 bg-gradient-to-br from-primary/30 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaShoppingCart className="text-5xl text-actiion" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Your Cart is Empty</h3>
              <p className="text-gray-600 mb-6">
                Add some equipment to your cart to create a booking
              </p>
              <a
                href="/items"
                className="inline-block px-8 py-3 bg-gradient-to-r from-actiion to-secondary text-white font-bold rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Browse Equipment
              </a>
            </div>
          )}
        </div>

        {/* Total and Checkout */}
        {cart.orderedItems.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 animate-fade-in">
            {/* Total Price */}
            <div className="flex justify-between items-center mb-6 pb-6 border-b-2 border-gray-100">
              <span className="text-2xl font-bold text-gray-900">Total Amount:</span>
              <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-actiion to-secondary">
                LKR {total.toFixed(2)}
              </span>
            </div>

            {/* Booking Details Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gradient-to-br from-primary/10 to-secondary/5 rounded-xl">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Items</p>
                <p className="text-xl font-bold text-gray-900">{cart.orderedItems.length}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Duration</p>
                <p className="text-xl font-bold text-gray-900">{daysBetween} Days</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Daily Rate</p>
                <p className="text-xl font-bold text-gray-900">LKR {(total / daysBetween).toFixed(2)}</p>
              </div>
            </div>

            {/* Create Booking Button */}
            <button
              onClick={handleBookingCreation}
              disabled={cart.orderedItems.length === 0}
              className="w-full py-4 px-8 bg-gradient-to-r from-actiion to-secondary text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
            >
              <FaShoppingCart />
              Create Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
