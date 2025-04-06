import { useState } from "react";

export default function ImageSlider(props) {
    const images = props.images;
    const [selectedImage, setSelectedImage] = useState(images[0]);
    return (
        <div className="w-full h-full flex flex-col items-center">
            <img src={selectedImage} alt="product" className="w-full h-[300px] md:h-[400px] px-2 object-cover" />
            <div className="w-full mt-[20px] h-[90px] flex justify-center items-center">
                {
                    images.map((image, index) => {
                        return (
                            <img key={index} src={image} alt="product" className={`w-[60px] h-[60px] mr-[3px] object-cover cursor-pointer ${image == selectedImage && "border-2 border-green-500"}`}
                                onClick={() => { setSelectedImage(image) }} />
                        )
                    })
                }
            </div>
        </div>
    )
}