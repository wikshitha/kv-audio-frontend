import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload";
import { motion } from "framer-motion";
import { FaImage, FaKey, FaAlignLeft, FaUpload, FaSave, FaTimes } from "react-icons/fa";

export default function AddGalleriesPage() {
  const [galleryKey, setGalleryKey] = useState("");
  const [galleryDescription, setGalleryDescription] = useState("");
  const [galleryImage, setGalleryImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGalleryImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  async function handleAdd() {
    if (loading) return;
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      return;
    }

    if (!galleryKey.trim()) {
      toast.error("Event Name is required");
      return;
    }
    if (!galleryImage) {
      toast.error("Please select an image");
      return;
    }

    try {
      setLoading(true);
      const imageUrl = await mediaUpload(galleryImage);
      const result = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/gallery`,
        {
          key: galleryKey,
          description: galleryDescription,
          image: imageUrl,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      toast.success(result.data.message);
      navigate("/admin/gallery");
    } catch (err) {
      toast.error(err?.response?.data?.message || "An error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-xl">
              <FaImage className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900">Add Gallery Image</h1>
              <p className="text-gray-600 text-lg font-semibold">Upload a new image to the gallery</p>
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
            <div className="space-y-6">
              {/* Event Name */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <FaKey className="text-pink-500" />
                  Event Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Wedding Event, Corporate Show"
                  value={galleryKey}
                  onChange={(e) => setGalleryKey(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all outline-none font-semibold"
                />
              </motion.div>

              {/* Event Description */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <FaAlignLeft className="text-rose-500" />
                  Event Description
                </label>
                <textarea
                  placeholder="Enter event description and details..."
                  value={galleryDescription}
                  onChange={(e) => setGalleryDescription(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none font-semibold resize-none"
                  rows="4"
                />
              </motion.div>

              {/* Image Upload */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <FaImage className="text-purple-500" />
                  Event Image <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="gallery-image-upload"
                  />
                  <label
                    htmlFor="gallery-image-upload"
                    className="w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 bg-gray-50 hover:bg-purple-50 group"
                  >
                    <FaUpload className="text-3xl text-gray-400 group-hover:text-purple-500 transition-colors" />
                    <div className="text-center">
                      <p className="font-bold text-gray-700 group-hover:text-purple-600">
                        {galleryImage ? galleryImage.name : "Click to upload image"}
                      </p>
                      <p className="text-sm text-gray-500">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  </label>
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <motion.div
                    className="mt-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <p className="text-sm font-bold text-gray-600 mb-2">Preview:</p>
                    <div className="relative group">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-xl border-2 border-gray-200 shadow-md"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                          Selected Image
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t-2 border-gray-200"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <button
                onClick={handleAdd}
                disabled={loading}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Add to Gallery
                  </>
                )}
              </button>
              <button
                onClick={() => navigate("/admin/gallery")}
                disabled={loading}
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
