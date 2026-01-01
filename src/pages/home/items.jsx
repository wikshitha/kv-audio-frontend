import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import ProductCard from "../../components/productCard";
import Footer from "../../components/footer";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";

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
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-actiion via-secondary to-actiion py-16 px-4 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-lg animate-fade-in-down">
            Premium Audio Equipment
          </h1>
          <p className="text-lg md:text-xl text-primary/90 mb-6 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
            Discover professional-grade audio equipment available for rent — from microphones and speakers to DJ gear and complete sound systems.
          </p>
          <div className="flex justify-center gap-4 text-white/90 text-sm animate-fade-in-up animation-delay-200">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              Professional Quality
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              Affordable Rates
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              Quick Delivery
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow px-4 py-12 max-w-7xl mx-auto w-full">
        {/* Filters Section */}
        <div className="mb-10">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <FaFilter className="text-actiion text-xl" />
              <h3 className="text-lg font-bold text-gray-800">Filter & Search</h3>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
              {/* Category Filter */}
              <div className="flex-1 relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-actiion focus:ring-4 focus:ring-actiion/10 text-gray-700 font-semibold appearance-none bg-white cursor-pointer transition-all duration-300"
                >
                  <option value="All">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Search Input */}
              <div className="flex-1 relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search equipment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-actiion focus:ring-4 focus:ring-actiion/10 text-gray-700 font-medium transition-all duration-300"
                />
              </div>

              {/* Clear Button */}
              <button
                onClick={handleClearFilters}
                className="px-6 py-3 bg-gradient-to-r from-actiion to-secondary text-white font-bold rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 justify-center"
              >
                <FaTimes />
                <span className="hidden md:inline">Clear</span>
              </button>
            </div>

            {/* Active Filters Display */}
            {(selectedCategory !== "All" || debouncedSearchTerm) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedCategory !== "All" && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-actiion/10 text-actiion rounded-full text-sm font-semibold">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory("All")} className="hover:text-actiion/70">
                      <FaTimes className="text-xs" />
                    </button>
                  </span>
                )}
                {debouncedSearchTerm && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-semibold">
                    "{debouncedSearchTerm}"
                    <button onClick={() => { setSearchTerm(""); setDebouncedSearchTerm(""); }} className="hover:text-secondary/70">
                      <FaTimes className="text-xs" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Results Count */}
          {state === "success" && (
            <div className="mt-4 text-center">
              <p className="text-gray-600 font-medium">
                Showing <span className="text-actiion font-bold">{filteredItems.length}</span> of <span className="font-bold">{items.length}</span> items
              </p>
            </div>
          )}
        </div>

        {/* Loading */}
        {state === "loading" && (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="relative">
              <div className="w-20 h-20 border-8 border-primary rounded-full"></div>
              <div className="w-20 h-20 border-8 border-t-actiion border-r-secondary rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <p className="mt-6 text-gray-600 font-semibold text-lg">Loading equipment...</p>
          </div>
        )}

        {/* Error */}
        {state === "error" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-red-600 mb-2">Oops! Something went wrong</h3>
              <p className="text-red-600 mb-4">
                We couldn't load the items. Please check your connection and try refreshing the page.
              </p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all duration-300"
              >
                Refresh Page
              </button>
            </div>
          </div>
        )}

        {/* No results */}
        {state === "success" && filteredItems.length === 0 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-primary/30 to-secondary/20 rounded-2xl p-12 text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <FaSearch className="text-4xl text-actiion" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">No Items Found</h3>
              <p className="text-gray-600 mb-6">
                No equipment matches your search criteria. Try adjusting your filters or search term.
              </p>
              <button 
                onClick={handleClearFilters} 
                className="px-8 py-3 bg-gradient-to-r from-actiion to-secondary text-white font-bold rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}

        {/* Product Grid */}
        {state === "success" && filteredItems.length > 0 && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item, index) => (
                <div 
                  key={item._id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProductCard
                    item={{
                      ...item,
                      nameHighlighted: highlightText(item.name, debouncedSearchTerm),
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
