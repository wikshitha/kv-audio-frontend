
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload";

export default function AddGalleriesPage() {
    const [galleryKey, setGalleryKey] = useState("");
    const [galleryDescription, setGalleryDescription] = useState("");
    const [galleryImage, setGalleryImage] = useState(null);
    const navigate = useNavigate();

    async function handleAdd() {
        console.log(galleryImage)

        console.log(galleryKey, galleryDescription);

        const token = localStorage.getItem("token")
      
        if(token) {
            try{
                // Promise.all(promises).then((result)=>{
                //     console.log(result);
                // }).catch((err)=>{
                //     toast.error(err);
                // })
                const imageUploadPromise = mediaUpload(galleryImage)
        
                const imageUrl = await imageUploadPromise

           const result = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/gallery`,{
                key : galleryKey,
                description : galleryDescription,
                image : imageUrl
            },{
                headers : {
                    Authorization : "Bearer " + token
                }
            })
            toast.success(result.data.message);
            navigate("/admin/gallery");
        } catch (err) {
            toast.error(err?.res?.data?.message || "An error occured");
            console.error(err);
        }
        }else {
            toast.error("Please login first");
        }
     }

    return (
        <div className="w-full h-full flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">Add Galleries</h1>
            <div className="w-[400px] border p-4 rounded-lg flex flex-col space-y-4">
                <input
                    type="text"
                    placeholder="Gallery Key"
                    value={galleryKey}
                    onChange={(e) => setGalleryKey(e.target.value)}
                    className="border p-2 rounded"
                />
                <textarea
                    type="text"
                    placeholder="Gallery Description"
                    value={galleryDescription}
                    onChange={(e) => setGalleryDescription(e.target.value)}
                    className="border p-2 rounded"
                />
                <input
                    type="file"
                    placeholder="Gallery Image"
                    onChange={(e) => setGalleryImage(e.target.files[0])}
                    className="border p-2 rounded"
                />
                <button onClick={handleAdd} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    Add
                </button>
                <button onClick={() => navigate("/admin/gallery")} className="bg-red-500 text-white p-2 rounded hover:bg-red-600">
                    Cancel
                </button>
            </div>
        </div>
    );
}
