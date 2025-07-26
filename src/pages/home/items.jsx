import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import ProductCard from "../../components/productCard";
import Footer from "../../components/footer";

export default function Items() {
  const [state, setState] = useState("loading");
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch products
  useEffect(() => {
    if (state === "loading") {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/products`)
        .then((res) => {
          setItems(res.data);
          extractCategories(res.data);
          setState("success");
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message || "An error occurred");
          setState("error");
        });
    }
  }, []);

  // Extract unique categories
  const extractCategories = (data) => {
    const allCategories = Array.from(new Set(data.map((item) => item.category || "Uncategorized")));
    setCategories(allCategories);
  };

  // Clear filters
  const handleClearFilters = () => {
    setSelectedCategory("All");
    setSearchTerm("");
    setDebouncedSearchTerm("");
  };

  // Filtered & searched items memoized
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const categoryMatch = selectedCategory === "All" || item.category === selectedCategory;
      const searchMatch = item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [items, selectedCategory, debouncedSearchTerm]);

  // Highlight search term in product name
  const highlightText = (text, term) => {
    if (!term) return text;
    const parts = text.split(new RegExp(`(${term})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <span key={i} className="bg-yellow-200 font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      {/* Main content with padding */}
      <div className="flex-grow px-4 py-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Explore Our Audio Rental Collection
        </h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8 text-sm sm:text-base">
          Discover a wide range of high-quality audio equipment available for rent — from professional microphones and speakers to DJ gear and complete sound systems. Whether you're planning a small event or a major production, we have the tools to bring your sound to life.
        </p>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-10">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#AA60C8] text-gray-700 shadow-sm"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search by product name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 w-full md:w-[300px] rounded-md border border-gray-300 focus:ring-2 focus:ring-[#AA60C8] text-gray-700 shadow-sm"
          />

          <button
            onClick={handleClearFilters}
            className="px-4 py-2 bg-[#AA60C8] text-white rounded-md hover:bg-[#944eb3] transition"
          >
            Clear Filters
          </button>
        </div>

        {/* Loading */}
        {state === "loading" && (
          <div className="flex justify-center items-center h-60">
            <div className="w-12 h-12 border-4 border-t-green-500 border-gray-300 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error */}
        {state === "error" && (
          <div className="text-center text-red-500 mt-10 text-lg">
            Oops! Something went wrong while loading the items. Please check your connection and try refreshing the page.
          </div>
        )}

        {/* No results */}
        {state === "success" && filteredItems.length === 0 && (
          <div className="text-center text-gray-500 mt-10 text-lg">
            No items found matching your filters. Try changing the category or search term, or{" "}
            <button onClick={handleClearFilters} className="text-[#AA60C8] underline">
              reset filters
            </button>{" "}
            to browse everything.
          </div>
        )}

        {/* Product Grid */}
        {state === "success" && filteredItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {filteredItems.map((item) => (
              <ProductCard
                key={item._id}
                item={{
                  ...item,
                  nameHighlighted: highlightText(item.name, debouncedSearchTerm),
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Always pinned to bottom */}
      <Footer />
    </div>
  );
}
