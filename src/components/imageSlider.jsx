import { useState, useEffect } from "react";

export default function ImageSlider({ images }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Auto-play effect: move to next image every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval); // cleanup on unmount
  }, [images.length]);

  // Update selected image based on index
  const selectedImage = images[selectedIndex];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Main image with smooth fade transition */}
      <div className="w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-lg">
        <img
          src={selectedImage}
          alt="product"
          className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
        />
      </div>

      {/* Thumbnails */}
      <div className="w-full mt-6 flex justify-center gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-[#AA60C8]/60 scrollbar-track-transparent">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`flex-shrink-0 rounded-md overflow-hidden border-2 transition-shadow duration-300
              ${
                index === selectedIndex
                  ? "border-[#AA60C8] shadow-lg"
                  : "border-transparent hover:shadow-md"
              }`}
            aria-label={`View image ${index + 1}`}
          >
            <img
              src={image}
              alt={`product thumbnail ${index + 1}`}
              className="w-[70px] h-[70px] object-cover"
              loading="lazy"
              draggable={false}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
