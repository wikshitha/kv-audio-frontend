import { useState } from "react";

export default function AddItemPage() {
    const [productKey, setProductKey] = useState("");
    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productType, setProductType] = useState("");
    const [productDimentions, setProductDimentions] = useState("");
    const [productDescription, setProductDescription] = useState("");

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
                <button
                    
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Add
                </button>
                <button className="bg-red-500 text-white p-2 rounded hover:bg-red-600">
                    Cancel
                </button>
            </div>
        </div>
    );
}
