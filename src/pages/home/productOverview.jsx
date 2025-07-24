import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ImageSlider from "../../components/imageSlider";
import { addToCart, loadCart } from "../../utils/cart.js";
import toast from "react-hot-toast";

export default function ProductOverview() {
  const { key } = useParams();
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
    <div className="min-h-screen w-full bg-[#FFDFEF] flex justify-center items-start py-12 px-6">
      {loadingStatus === "loading" && (
        <div className="flex justify-center items-center h-60 w-full max-w-7xl rounded-lg bg-white shadow-md p-10">
          <div className="w-14 h-14 border-4 border-t-[#8B5CF6] border-[#C4B5FD] rounded-full animate-spin"></div>
        </div>
      )}

      {loadingStatus === "error" && (
        <div className="max-w-7xl w-full rounded-lg bg-white shadow-md p-10 text-center text-red-600 text-lg font-semibold">
          Error occurred while loading the product. Please try again later.
        </div>
      )}

      {loadingStatus === "loaded" && (
        <div className="flex flex-col md:flex-row max-w-7xl w-full gap-12 bg-white rounded-lg shadow-lg p-10">
          {/* Image Slider */}
          <div className="w-full md:w-1/2 rounded-lg overflow-hidden">
            <ImageSlider images={product.images || []} />
          </div>

          {/* Product Info */}
          <div className="w-full md:w-1/2 flex flex-col justify-between">
            <div>
              {/* Product Name */}
              <h1
                className="text-5xl font-extrabold text-[#5B21B6] mb-4 text-center md:text-left
                  border-b-4 border-[#8B5CF6] inline-block pb-1 drop-shadow-sm"
              >
                {product.name}
              </h1>

              {/* Category */}
              <h2 className="text-lg text-[#7C3AED] font-semibold mb-2 capitalize text-center md:text-left">
                {product.category || "Uncategorized"} Category
              </h2>

              {/* Description */}
              <p className="text-gray-700 text-base md:text-lg mb-6 text-center md:text-left whitespace-pre-line">
                {product.description || "No description available."}
              </p>

              {/* Dimensions */}
              {product.dimensions && (
                <p className="text-sm text-[#7C3AED] font-semibold mb-6 text-center md:text-left">
                  <span className="font-medium">Dimensions:</span> {product.dimensions}
                </p>
              )}
            </div>

            {/* Price and Button */}
            <div className="text-center md:text-left">
              {/* Price */}
              <p
                className="inline-block text-3xl font-extrabold text-white px-4 py-1.5 rounded-lg
              bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] drop-shadow-lg mb-6"
              >
                LKR {product.price?.toFixed(2) ?? "0.00"}
              </p>
              <br />
              <button
                onClick={() => {
                  addToCart(product.key, 1);
                  toast.success("Added to cart");
                  console.log(loadCart());
                }}
                className="w-full md:w-auto px-8 py-3 bg-[#DB2777] text-white font-semibold rounded-lg shadow-md hover:bg-[#9D174D] transition duration-300"
                aria-label={`Add ${product.name} to cart`}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
