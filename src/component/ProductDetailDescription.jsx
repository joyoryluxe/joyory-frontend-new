// src/components/ProductDetailDescription.jsx
import React from "react";

const ProductDetailDescription = ({ product }) => {
  return (
    <section className="product-extra-section mt-5">
      <div className="details-section">
        <div className="accordion">
          <details>
            <summary>Description</summary>
            <p className="mt-3">{product.description || "No description available."}</p>
          </details>
          <details>
            <summary>Ingredients</summary>
            <p className="mt-3">{product.ingredients || "Ingredients not provided."}</p>
          </details>
          <details>
            <summary>How To Use</summary>
            <p className="mt-3">{product.howToUse || "Usage instructions not provided."}</p>
          </details>
          <details>
            <summary>Special Features</summary>
            <p className="mt-3">{product.features || "No special features listed."}</p>
          </details>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailDescription;