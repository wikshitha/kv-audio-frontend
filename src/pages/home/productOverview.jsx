import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ImageSlider from "../../components/imageSlider";
import { addToCart, loadCart } from "../../utils/cart.js";
import toast from "react-hot-toast";

export default function ProductOverview() {
    const params = useParams();
    const key = params.key
    const [loadingStatus, setLoadingStatus] = useState("loading")
    const [product, setProduct] = useState({})

    useEffect(()=>{
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${key}`).then((res)=>{
            setProduct(res.data)
            setLoadingStatus("loaded")
            console.log(res.data)
        }).catch((err)=>{
            console.log(err)
            setLoadingStatus("error")
        })
    },[])
    return (
        <div className="w-full h-full flex justify-center">
            {
                loadingStatus == "loading"&&
                <div className="w-full h-full  flex justify-center items-center">
                <div className="w-[50px] h-[50px] border-4 rounded-full border-t-green-500 animate-spin">
                </div>
              </div>
            }
            {
                loadingStatus == "loaded"&&
                <div className="w-full h-full flex justify-center items-center">
                    <div className="w-[49%] h-full">
                        <ImageSlider images={product.images} />
                    </div>
                    <div className="w-[49%] h-full flex flex-col items-center">
                        <h1 className="text-3xl font-bold">{product.name}</h1>
                        <h2 className="text-2xl font-bold">{product.catogory}</h2>
                        <p className="text-xl">{product.description}</p>
                        <p className="text-xl">{product.dimensions}</p>
                        <p className="text-xl">{product.price}</p>
                        <button className="mt-4 w-[100px] h-[40px] bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-200"
                        onClick={()=>{
                            addToCart(product.key,1)
                            toast.success("Added to cart")
                            console.log(loadCart())
                        }}
                        >Add to Cart</button>

                    </div>
                </div>
            }
            {
                loadingStatus == "error"&&
                <div className="w-full h-full  flex justify-center items-center">
                    Error Occured
                </div>
                
            }
        </div>
    )
}