
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AddItemPage() {
    const [productKey, setProductKey] = useState("");
    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState(0);
    const [productType, setProductType] = useState("");
    const [productDimentions, setProductDimentions] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const navigate = useNavigate();

    async function handleAdd() {
        console.log(productKey, productName, productPrice, productType, productDimentions, productDescription);

        const token = localStorage.getItem("token")
      
        if(token) {
            try{
           const result = await axios.post("http://localhost:3000/api/products",{
                key : productKey,
                name : productName,
                price : productPrice,
                category : productType,
                dimensions : productDimentions,
                description : productDescription
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
                    <option value="audio">Audio</option>
                    <option value="lights">Lights</option>
                </select>
                <input
                    type="text"
                    placeholder="Product Dimensions"
                    value={productDimentions}
                    onChange={(e) => setProductDimentions(e.target.value)}
                    className="border p-2 rounded"
                />
                <input
                    type="text"
                    placeholder="Product Description"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
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
