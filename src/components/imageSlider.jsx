import { useState } from "react";

export default function ImageSlider(props) {
    const images = props.images;
    const [selectedImage, setSelectedImage] = useState(images[0]);
    return (
        <div className="w-full h-full flex flex-col items-center">
            <img src={selectedImage} alt="product" className="w-full h-[400px] object-cover" />
            <div className="w-full mt-[20px] h-[150px] flex justify-center">
                {
                    images.map((image, index) => {
                        return (
                            <img key={index} src={image} alt="product" className={`w-[100px] h-[100px] mr-[5px] object-cover cursor-pointer ${image == selectedImage && "border-2 border-green-500"}`}
                                onClick={() => { setSelectedImage(image) }} />
                        )
                    })
                }
            </div>
        </div>
    )
}