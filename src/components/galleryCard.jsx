export default function GalleryCard({ gallery }) {
    return (
      <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-200 w-full max-w-xs mx-auto">
        <img
          src={gallery.image}
          alt={gallery.description}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <p className="text-lg font-bold truncate text-gray-800">{gallery.key}</p>
          <p className="text-gray-600 mt-2 truncate">{gallery.description}</p>
        </div>
      </div>
    );
  }
  