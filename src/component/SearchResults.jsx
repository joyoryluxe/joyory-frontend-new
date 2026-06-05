import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const searchText = queryParams.get("query") || "";
  const category = queryParams.get("category") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      if (!searchText.trim()) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // 🔥 Check the correct API endpoint
        let url = `https://beauty.joyory.com/api/user/products/search?query=${encodeURIComponent(
          searchText
        )}`;
        if (category) url += `&category=${encodeURIComponent(category)}`;

        const res = await fetch(url);
        const data = await res.json();

        console.log("🔎 Search API response:", data);

        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("❌ Search error:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchText, category]);

  return (
    <div className="search-results">
      <h2>
        Results for "{searchText}" {category && `in ${category}`}
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="product-grid">
          {products.length > 0 ? (
            products.map((p) => {
              const imageUrl =
                p.image ||
                p.thumbnail ||
                (p.images && p.images[0]?.url) ||
                "https://via.placeholder.com/150";

              return (
                <div key={p._id || p.id} className="product-card">
                  <img src={imageUrl} alt={p.name || p.title} />
                  <h4>{p.name || p.title}</h4>
                  <p>${p.price || p.cost}</p>
                  <button>Add to Cart</button>
                </div>
              );
            })
          ) : (
            <p>No products found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
