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
    <div className="w-full h-full flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Add Galleries</h1>
      <div className="w-[400px] border p-4 rounded-lg flex flex-col space-y-4 bg-white shadow-md">
        <input
          type="text"
          placeholder="Event Name"
          value={galleryKey}
          onChange={(e) => setGalleryKey(e.target.value)}
          className="border p-2 rounded"
        />
        <textarea
          placeholder="Event Description"
          value={galleryDescription}
          onChange={(e) => setGalleryDescription(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="file"
          onChange={(e) => setGalleryImage(e.target.files[0])}
          className="border p-2 rounded"
        />
        <button
          onClick={handleAdd}
          disabled={loading}
          className={`flex items-center justify-center bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition ${
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
          className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
