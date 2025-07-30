import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload";

export default function UpdateItemPage() {
  const location = useLocation();

  const [productKey, setProductKey] = useState(location.state.key);
  const [productName, setProductName] = useState(location.state.name);
  const [productPrice, setProductPrice] = useState(location.state.price);
  const [productType, setProductType] = useState(location.state.category);
  const [productDimentions, setProductDimentions] = useState(location.state.dimensions);
  const [productDescription, setProductDescription] = useState(location.state.description);
  const [productImages, setProductImages] = useState([]);

  const navigate = useNavigate();

  async function handleUpdateItem() {
    let updatingImages = location.state.images;

    if (productImages.length > 0) {
      const promises = [];
      for (let i = 0; i < productImages.length; i++) {
        const promise = mediaUpload(productImages[i]);
        promises.push(promise);
      }
      updatingImages = await Promise.all(promises);
    }

    const token = localStorage.getItem("token");

    if (token) {
      try {
        const result = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/${productKey}`,
          {
            name: productName,
            price: productPrice,
            category: productType,
            dimensions: productDimentions,
            description: productDescription,
            images: updatingImages,
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        toast.success(result.data.message);
        navigate("/admin/items");
      } catch (err) {
        console.log(err);
        toast.error(err.response?.data?.message || "Update failed");
      }
    } else {
      toast.error("Please login first");
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-4 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-center">Update Item</h1>
      <div className="w-full max-w-md bg-white border border-gray-300 p-6 rounded-lg shadow-md flex flex-col space-y-4">
        <input
          disabled
          type="text"
          placeholder="Product Key"
          value={productKey}
          onChange={(e) => setProductKey(e.target.value)}
          className="border p-3 rounded text-base w-full bg-gray-100 cursor-not-allowed"
        />
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="border p-3 rounded text-base w-full"
        />
        <input
          type="number"
          placeholder="Product Price"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
          className="border p-3 rounded text-base w-full"
        />
        <select
          value={productType}
          onChange={(e) => setProductType(e.target.value)}
          className="border p-3 rounded text-base w-full"
        >
          <option value="" disabled>
            Select Product Type
          </option>
          <option value="audio">Audio</option>
          <option value="lights">Lights</option>
        </select>
        <input
          type="text"
          placeholder="Product Dimensions"
          value={productDimentions}
          onChange={(e) => setProductDimentions(e.target.value)}
          className="border p-3 rounded text-base w-full"
        />
        <textarea
          placeholder="Product Description"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          className="border p-3 rounded text-base w-full resize-y min-h-[100px]"
        />
        <input
          type="file"
          multiple
          placeholder="Product Images"
          onChange={(e) => setProductImages(e.target.files)}
          className="border p-3 rounded w-full cursor-pointer"
        />
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
          <button
            onClick={handleUpdateItem}
            className="flex-1 bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition"
          >
            Update
          </button>
          <button
            onClick={() => navigate("/admin/items")}
            className="flex-1 bg-red-500 text-white p-3 rounded hover:bg-red-600 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
