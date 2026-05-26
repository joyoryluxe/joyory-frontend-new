// src/pages/CategoryProducts.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CategoryProducts = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `https://beauty.joyory.com/api/user/products/category/${slug}/products`
        );

        const text = await response.text();
        console.log("CategoryProducts API response:", text);

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }

        const data = JSON.parse(text);
        const list = Array.isArray(data) ? data : data.products || [];
        setProducts(list);
      } catch (err) {
        console.error("Error fetching category products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug]);

  return (
    <div className="container my-4">
      <h2 className="fw-bold mb-3">Products in {slug}</h2>

      {loading ? (
        <p className="text-center text-muted page-title-main-name">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-muted">No products found.</p>
      ) : (
        <div className="row">
          {products.map((prod) => (
            <div key={prod._id} className="col-md-3 mb-4">
              <div className="card h-100 shadow-sm">
                <img
                  src={prod.image || "https://picsum.photos/300"}
                  alt={prod.name}
                  className="card-img-top"
                  onError={(e) =>
                    (e.currentTarget.src = "https://picsum.photos/300")
                  }
                />
                <div className="card-body text-center">
                  <h5 className="card-title">{prod.name}</h5>
                  <p className="card-text text-muted">₹{prod.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;
