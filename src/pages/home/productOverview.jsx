import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ImageSlider from "../../components/imageSlider";
import { addToCart, loadCart } from "../../utils/cart.js";
import toast from "react-hot-toast";
import { FaShoppingCart, FaArrowLeft, FaTag, FaRuler, FaBoxOpen } from "react-icons/fa";

export default function ProductOverview() {
  const { key } = useParams();
  const navigate = useNavigate();
  const [loadingStatus, setLoadingStatus] = useState("loading");
  const [product, setProduct] = useState({});

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${key}`)
      .then((res) => {
        setProduct(res.data);
        setLoadingStatus("loaded");
      })
      .catch(() => {
        setLoadingStatus("error");
      });
  }, [key]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-actiion hover:text-secondary font-semibold transition-colors duration-300 group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
          Back to Items
        </button>
      </div>

      {/* Loading State */}
      {loadingStatus === "loading" && (
        <div className="flex flex-col justify-center items-center py-32">
          <div className="relative">
            <div className="w-20 h-20 border-8 border-primary rounded-full"></div>
            <div className="w-20 h-20 border-8 border-t-actiion border-r-secondary rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="mt-6 text-gray-600 font-semibold text-lg">Loading product details...</p>
        </div>
      )}

      {/* Error State */}
      {loadingStatus === "error" && (
        <div className="max-w-2xl mx-auto px-4 py-20">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-red-600 mb-2">Product Not Found</h3>
            <p className="text-red-600 mb-4">
              We couldn't load this product. It may have been removed or doesn't exist.
            </p>
            <button
              onClick={() => navigate("/items")}
              className="px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all duration-300"
            >
              Back to All Items
            </button>
          </div>
        </div>
      )}

      {/* Product Details */}
      {loadingStatus === "loaded" && (
        <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Image Section */}
              <div className="bg-gradient-to-br from-primary/20 to-secondary/10 p-8 lg:p-12">
                <div className="rounded-2xl overflow-hidden shadow-2xl bg-white">
                  <ImageSlider images={product.images || []} />
                </div>
              </div>

              {/* Product Info Section */}
              <div className="p-8 lg:p-12 flex flex-col justify-between">
                {/* Category Badge */}
                {product.category && (
                  <div className="mb-4">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-actiion/10 to-secondary/10 text-actiion rounded-full text-sm font-bold uppercase tracking-wide">
                      <FaTag />
                      {product.category}
                    </span>
                  </div>
                )}

                {/* Product Name */}
                <div className="mb-6">
                  <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-2 leading-tight">
                    {product.name}
                  </h1>
                  <div className="w-24 h-1.5 bg-gradient-to-r from-actiion to-secondary rounded-full"></div>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="inline-block">
                    <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide mb-1">
                      Rental Price
                    </p>
                    <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-actiion to-secondary">
                      LKR {product.price?.toFixed(2) ?? "0.00"}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8 flex-grow">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FaBoxOpen className="text-actiion" />
                    Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
                    {product.description || "No description available."}
                  </p>
                </div>

                {/* Dimensions */}
                {product.dimensions && (
                  <div className="mb-8 p-4 bg-gradient-to-r from-primary/20 to-secondary/10 rounded-xl">
                    <div className="flex items-center gap-2 text-actiion mb-1">
                      <FaRuler />
                      <span className="font-bold">Dimensions:</span>
                    </div>
                    <p className="text-gray-700 font-semibold ml-6">{product.dimensions}</p>
                  </div>
                )}

                {/* Add to Cart Button */}
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      addToCart(product.key, 1);
                      toast.success("Added to cart successfully!");
                      console.log(loadCart());
                    }}
                    className="w-full py-4 px-8 bg-gradient-to-r from-actiion to-secondary text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 group"
                  >
                    <FaShoppingCart className="text-xl group-hover:scale-110 transition-transform" />
                    Add to Cart
                  </button>

                  <button
                    onClick={() => navigate("/items")}
                    className="w-full py-4 px-8 border-2 border-actiion text-actiion text-lg font-bold rounded-xl hover:bg-actiion hover:text-white transition-all duration-300"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-actiion to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600 text-sm">All equipment is tested and maintained regularly</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg text-center transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-actiion to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Flexible Pricing</h3>
              <p className="text-gray-600 text-sm">Competitive rates with custom packages available</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg text-center transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-actiion to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600 text-sm">Round-the-clock assistance for all your needs</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
