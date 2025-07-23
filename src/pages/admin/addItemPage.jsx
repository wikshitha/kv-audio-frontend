
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload";

export default function AddItemPage() {
    const [productKey, setProductKey] = useState("");
    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState(0);
    const [productType, setProductType] = useState("");
    const [productDimentions, setProductDimentions] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [productImages, setProductImages] = useState([]);
    const navigate = useNavigate();

    async function handleAdd() {
        console.log(productImages)
        const promises = []
        for(let i = 0; i < productImages.length; i++) {
            const promise = mediaUpload(productImages[i])
            promises.push(promise)
            // if(i==5) {
            //     toast.error("You can only upload 5 images");
            //     break
            // }
        }

        console.log(productKey, productName, productPrice, productType, productDimentions, productDescription);

        const token = localStorage.getItem("token")
      
        if(token) {
            try{
                // Promise.all(promises).then((result)=>{
                //     console.log(result);
                // }).catch((err)=>{
                //     toast.error(err);
                // })
        
                const imageUrls = await Promise.all(promises)

           const result = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/products`,{
                key : productKey,
                name : productName,
                price : productPrice,
                category : productType,
                dimensions : productDimentions,
                description : productDescription,
                images : imageUrls
            },{
                headers : {
                    Authorization : "Bearer " + token
                }
            })
            toast.success(result.data.message);
            navigate("/admin/items");
        } catch (err) {
            toast.error(err.response.data.message);
        }
        }else {
            toast.error("Please login first");
        }
     }

    return (
        <div className="w-full h-full flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">Add Item</h1>
            <div className="w-[400px] border p-4 rounded-lg flex flex-col space-y-4">
                <input
                    type="text"
                    placeholder="Product Key"
                    value={productKey}
                    onChange={(e) => setProductKey(e.target.value)}
                    className="border p-2 rounded"
                />
                <input
                    type="text"
                    placeholder="Product Name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="border p-2 rounded"
                />
                <input
                    type="number"
                    placeholder="Product Price"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    className="border p-2 rounded"
                />
                <select
                    value={productType}
                    onChange={(e) => setProductType(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="" disabled>Select Product Type</option>
                    <option value="pa_speakers">PA Speakers</option>
                    <option value="monitor_speakers">Monitor Speakers</option>
                    <option value="bluetooth_speakers">Bluetooth Speakers</option>
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
                <input
                    type="text"
                    placeholder="Product Dimensions"
                    value={productDimentions}
                    onChange={(e) => setProductDimentions(e.target.value)}
                    className="border p-2 rounded"
                />
                <textarea
                    type="text"
                    placeholder="Product Description"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    className="border p-2 rounded"
                />
                <input
                    type="file"
                    multiple
                    placeholder="Product Images"
                    onChange={(e) => setProductImages(e.target.files)}
                    className="border p-2 rounded"
                />
                <button onClick={handleAdd} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    Add
                </button>
                <button onClick={() => navigate("/admin/items")} className="bg-red-500 text-white p-2 rounded hover:bg-red-600">
                    Cancel
                </button>
            </div>
        </div>
    );
}
