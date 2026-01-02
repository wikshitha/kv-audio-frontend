import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload";
import { motion } from "framer-motion";
import { FaEdit, FaTag, FaBoxOpen, FaRulerCombined, FaAlignLeft, FaLayerGroup, FaImage, FaUpload, FaSave, FaTimes, FaLock } from "react-icons/fa";

export default function UpdateItemPage() {
  const location = useLocation();

  const [productKey, setProductKey] = useState(location.state.key);
  const [productName, setProductName] = useState(location.state.name);
  const [productPrice, setProductPrice] = useState(location.state.price);
  const [productType, setProductType] = useState(location.state.category);
  const [productDimentions, setProductDimentions] = useState(location.state.dimensions);
  const [productDescription, setProductDescription] = useState(location.state.description);
  const [productImages, setProductImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const files = e.target.files;
    setProductImages(files);
    
    // Create preview URLs
    const previews = [];
    for (let i = 0; i < files.length; i++) {
      previews.push(URL.createObjectURL(files[i]));
    }
    setImagePreview(previews);
  };

  async function handleUpdateItem() {
    setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Please login first");
      setIsLoading(false);
    }
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
              <FaEdit className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900">Update Item</h1>
              <p className="text-gray-600 text-lg font-semibold">Edit equipment details</p>
            </div>
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Key (Disabled) */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <FaLock className="text-gray-400" />
                  Product Key (Cannot be changed)
                </label>
                <input
                  disabled
                  type="text"
                  value={productKey}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-100 cursor-not-allowed font-semibold text-gray-600"
                />
              </motion.div>

              {/* Product Name */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <FaBoxOpen className="text-blue-500" />
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none font-semibold"
                />
              </motion.div>

              {/* Product Price */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <FaTag className="text-green-500" />
                  Product Price (LKR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none font-semibold"
                />
              </motion.div>

              {/* Product Type */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <FaLayerGroup className="text-orange-500" />
                  Product Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none font-semibold bg-white"
                >
                  <option value="" disabled>
                    Select Product Type
                  </option>
                  <option value="pa_speakers">PA Speakers</option>
                  <option value="monitor_speakers">Monitor Speakers</option>
                  <option value="bluetooth_speakers">Bluetooth Speakers</option>
                  <option value="subwoofer">Subwoofer</option>
                  <option value="wired_microphone">Wired Microphone</option>
                  <option value="wireless_microphone">Wireless Microphone</option>
                  <option value="mixer">Audio Mixer</option>
                  <option value="dj_mixer">DJ Mixer</option>
                  <option value="power_cables">Power Cables</option>
                  <option value="adaptor">Adaptors & Converters</option>
                  <option value="mic_stands">Mic Stands</option>
                  <option value="studio_headphones">Studio Headphones</option>
                  <option value="dj_headphones">DJ Headphones</option>
                  <option value="stage_lights">Stage Lights</option>
                  <option value="fog_machine">Smoke/Fog Machines</option>
                  <option value="laser_lights">Laser Lights</option>
                </select>
              </motion.div>

              {/* Product Dimensions */}
              <motion.div
                className="md:col-span-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <FaRulerCombined className="text-indigo-500" />
                  Product Dimensions
                </label>
                <input
                  type="text"
                  placeholder="e.g., 15 x 5 inches"
                  value={productDimentions}
                  onChange={(e) => setProductDimentions(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none font-semibold"
                />
              </motion.div>

              {/* Product Description */}
              <motion.div
                className="md:col-span-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.45 }}
              >
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <FaAlignLeft className="text-pink-500" />
                  Product Description
                </label>
                <textarea
                  placeholder="Enter product description and features..."
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all outline-none font-semibold resize-none"
                  rows="4"
                />
              </motion.div>

              {/* Current Images Preview */}
              {location.state.images && location.state.images.length > 0 && (
                <motion.div
                  className="md:col-span-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <FaImage className="text-purple-500" />
                    Current Product Images
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {location.state.images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Current ${index + 1}`}
                          className="w-full h-24 object-cover rounded-xl border-2 border-gray-200 shadow-md group-hover:shadow-xl transition-all"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                            Current {index + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Product Images Upload */}
              <motion.div
                className="md:col-span-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.55 }}
              >
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <FaImage className="text-cyan-500" />
                  Update Product Images (Optional)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-cyan-500 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 bg-gray-50 hover:bg-cyan-50 group"
                  >
                    <FaUpload className="text-3xl text-gray-400 group-hover:text-cyan-500 transition-colors" />
                    <div className="text-center">
                      <p className="font-bold text-gray-700 group-hover:text-cyan-600">
                        Click to upload new images
                      </p>
                      <p className="text-sm text-gray-500">
                        PNG, JPG up to 10MB (Will replace current images)
                      </p>
                    </div>
                  </label>
                </div>

                {/* New Images Preview */}
                {imagePreview.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {imagePreview.map((preview, index) => (
                      <motion.div
                        key={index}
                        className="relative group"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-xl border-2 border-cyan-300 shadow-md group-hover:shadow-xl transition-all"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                            New {index + 1}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t-2 border-gray-200"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <button
                onClick={handleUpdateItem}
                disabled={isLoading}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Update Item
                  </>
                )}
              </button>
              <button
                onClick={() => navigate("/admin/items")}
                disabled={isLoading}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <FaTimes />
                Cancel
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
