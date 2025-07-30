import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload";

export default function AddGalleriesPage() {
  const [galleryKey, setGalleryKey] = useState("");
  const [galleryDescription, setGalleryDescription] = useState("");
  const [galleryImage, setGalleryImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    <div className="w-full min-h-screen flex flex-col items-center p-4 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-center">Add Galleries</h1>
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Event Name"
          value={galleryKey}
          onChange={(e) => setGalleryKey(e.target.value)}
          className="border p-3 rounded text-base w-full"
        />
        <textarea
          placeholder="Event Description"
          value={galleryDescription}
          onChange={(e) => setGalleryDescription(e.target.value)}
          className="border p-3 rounded text-base w-full resize-y min-h-[100px]"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setGalleryImage(e.target.files[0])}
          className="border p-3 rounded w-full cursor-pointer"
        />
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
          <button
            onClick={handleAdd}
            disabled={loading}
            className={`flex-1 flex items-center justify-center bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition ${
              loading && "cursor-not-allowed opacity-70"
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Add"
            )}
          </button>
          <button
            onClick={() => navigate("/admin/gallery")}
            className="flex-1 bg-red-500 text-white p-3 rounded hover:bg-red-600 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
