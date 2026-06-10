// src/component/IngredientDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { getIngredientByName, getProductsByIngredient } from "../api/ingredientApi";
import { FaSun, FaMoon, FaCheckCircle, FaExclamationTriangle, FaHourglassHalf, FaExternalLinkAlt } from "react-icons/fa";
import "../styles/IngredientDetail.css";

// Lottie loader
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function IngredientDetail() {
  const { name } = useParams();
  const navigate = useNavigate();
  
  const [ingredient, setIngredient] = useState(null);
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [prodPage, setProdPage] = useState(1);
  const [prodPages, setProdPages] = useState(1);
  const [prodLoading, setProdLoading] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // Load details
        const detailRes = await getIngredientByName(name);
        if (detailRes.data.success) {
          setIngredient(detailRes.data.ingredient);
        }
        
        // Load catalog products containing this ingredient
        setProdLoading(true);
        const prodRes = await getProductsByIngredient(name, 1, 8);
        if (prodRes.data.success) {
          setProducts(prodRes.data.products || []);
          setTotalProducts(prodRes.data.total || 0);
          setProdPages(prodRes.data.pages || 1);
        }
      } catch (err) {
        console.error("Error fetching ingredient data:", err);
        navigate("/404");
      } finally {
        setLoading(false);
        setProdLoading(false);
      }
    };
    if (name) {
      fetchAllData();
      setProdPage(1);
    }
  }, [name, navigate]);

  const loadMoreProducts = async () => {
    if (prodPage >= prodPages || prodLoading) return;
    const nextPage = prodPage + 1;
    setProdLoading(true);
    try {
      const prodRes = await getProductsByIngredient(name, nextPage, 8);
      if (prodRes.data.success) {
        setProducts(prev => [...prev, ...(prodRes.data.products || [])]);
        setProdPage(nextPage);
      }
    } catch (err) {
      console.error("Error fetching more products:", err);
    } finally {
      setProdLoading(false);
    }
  };

  if (loading || !ingredient) {
    return (
      <div 
        className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center"
        style={{ backgroundColor: "rgba(255,255,255,0.97)", zIndex: 9999, backdropFilter: "blur(10px)" }}
      >
        <div className="text-center">
          <DotLottieReact
            className="mb-4"
            src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
            loop
            autoplay
            style={{ width: "100px", height: "100px" }}
          />
          <p className="text-muted mb-0 page-title-main-name">Fetching Ingredient Analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      
      <div className="ing-detail-page page-title-main-name">
        {/* Ingredient Header Hero */}
        <section className="ing-hero-card mb-5">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div>
              <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 mb-2 px-3 py-1 text-uppercase" style={{ fontSize: "11px", letterSpacing: "1px" }}>
                {typeof ingredient.category === "string" ? ingredient.category : (ingredient.category?.name || "Active")}
              </span>
              <h1 className="fw-bold text-dark mb-1 page-title-main-name">{ingredient.name}</h1>
              {ingredient.aliases?.length > 0 && (
                <p className="text-muted small mb-0">Also known as: {ingredient.aliases.join(", ")}</p>
              )}
            </div>

            {/* Quick Profile Badges */}
            <div className="d-flex gap-3">
              {ingredient.timeOfDay && (
                <div className="ing-profile-badge">
                  <div className="ing-badge-icon">
                    {ingredient.timeOfDay.includes("AM") && <FaSun className="text-warning me-1" />}
                    {ingredient.timeOfDay.includes("PM") && <FaMoon className="text-primary" />}
                  </div>
                  <div className="ing-badge-info">
                    <span className="small text-muted d-block">Best Used At</span>
                    <strong className="small text-dark">{ingredient.timeOfDay}</strong>
                  </div>
                </div>
              )}
              {ingredient.concentration && (
                <div className="ing-profile-badge">
                  <div className="ing-badge-icon text-danger">🧬</div>
                  <div className="ing-badge-info">
                    <span className="small text-muted d-block">Recommended Conc.</span>
                    <strong className="small text-dark">{ingredient.concentration}</strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Detailed Analysis Grid */}
        <div className="row g-4 text-start mb-5">
          
          {/* Left Column: Properties & Safety */}
          <div className="col-lg-7">
            <div className="ing-card p-4 h-100">
              
              {/* Description */}
              <div className="mb-4">
                <h4 className="fw-bold text-dark border-bottom pb-2 mb-2" style={{ fontSize: "16px" }}>What is {ingredient.name}?</h4>
                <p className="text-muted" style={{ fontSize: "14px", lineHeight: "1.7" }}>
                  {ingredient.description || "A premium active cosmetic ingredient featured in upscale skincare and cosmetics. It is widely recognized for its clinical effectiveness and capability to deliver targeted skin improvements."}
                </p>
              </div>

              {/* Benefits */}
              {ingredient.benefits?.length > 0 && (
                <div className="mb-4">
                  <h4 className="fw-bold text-dark border-bottom pb-2 mb-2" style={{ fontSize: "16px" }}>Skin Benefits</h4>
                  <ul className="ps-3 text-muted" style={{ fontSize: "14px", lineHeight: "1.7" }}>
                    {ingredient.benefits.map((benefit, idx) => (
                      <li key={idx} className="mb-1">{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suitability */}
              <div className="mb-2 row">
                <div className="col-md-6 mb-3">
                  <h5 className="fw-bold text-dark border-bottom pb-2 mb-2" style={{ fontSize: "15px" }}>Good For Skin Types</h5>
                  {ingredient.goodForSkinTypes?.length > 0 ? (
                    <div className="d-flex flex-wrap gap-2">
                      {ingredient.goodForSkinTypes.map((t, idx) => (
                        <span key={idx} className="badge bg-success bg-opacity-10  border border-success border-opacity-25 px-2 py-1 text-capitalize">
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted small">All Skin Types</span>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <h5 className="fw-bold text-dark border-bottom pb-2 mb-2" style={{ fontSize: "15px" }}>Avoid For Skin Types</h5>
                  {ingredient.avoidForSkinTypes?.length > 0 ? (
                    <div className="d-flex flex-wrap gap-2">
                      {ingredient.avoidForSkinTypes.map((t, idx) => (
                        <span key={idx} className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-2 py-1 text-capitalize">
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted small">No specific skins to avoid.</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Layering & Pairing */}
          <div className="col-lg-5">
            <div className="ing-card p-4 h-100 bg-light bg-opacity-50">
              
              {/* Incompatible Layers (Conflicts) */}
              <div className="mb-4">
                <h4 className="fw-bold text-dark border-bottom pb-2 mb-2" style={{ fontSize: "16px" }}>Avoid Direct Layering (Conflicts)</h4>
                {ingredient.incompatibleWith?.length > 0 ? (
                  <div className="d-flex flex-column gap-2 mt-2">
                    {ingredient.incompatibleWith.map((conflict, idx) => (
                      <div key={idx} className="p-3 border rounded bg-white shadow-sm" style={{ fontSize: "13px" }}>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <strong className="text-danger">+{conflict.ingredient}</strong>
                          <span className={`badge ${conflict.severity === "high" ? "bg-danger" : conflict.severity === "medium" ? "bg-warning text-dark" : "bg-info text-dark"}`} style={{ fontSize: "9px" }}>
                            {conflict.severity?.toUpperCase()} RISK
                          </span>
                        </div>
                        <span className="text-muted d-block mb-2" style={{ lineHeight: "1.35" }}>
                          {conflict.reason}
                        </span>
                        <div className="bg-light p-2 rounded small fw-medium" style={{ fontSize: "12px", borderLeft: "3px solid #dc3545" }}>
                          <strong>Advice:</strong> {conflict.severity === "high" ? "❌ Avoid mixing together" : "⚠️ Alternate usage times"}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted small p-2 bg-white rounded border">No severe direct layering conflicts documented. Safe to use with caution.</div>
                )}
              </div>

              {/* Compatible pairings */}
              {ingredient.compatibleWith?.length > 0 && (
                <div className="mb-4">
                  <h4 className="fw-bold text-dark border-bottom pb-2 mb-2" style={{ fontSize: "16px" }}>Pairs Perfectly With</h4>
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {ingredient.compatibleWith.map((c, idx) => (
                      <span key={idx} className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-2" style={{ borderRadius: "20px", fontSize: "12.5px" }}>
                        +{c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Usage Tips */}
              {ingredient.usageTips?.length > 0 && (
                <div>
                  <h4 className="fw-bold text-dark border-bottom pb-2 mb-2" style={{ fontSize: "16px" }}>Usage Guidelines</h4>
                  <ul className="ps-3 text-muted small" style={{ lineHeight: "1.6" }}>
                    {ingredient.usageTips.map((tip, idx) => (
                      <li key={idx} className="mb-1">{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Catalog Products shelf containing this ingredient */}
        <section className="catalog-shelf mt-5">
          <div className="border-bottom pb-2 mb-4 text-start">
            <h3 className="fw-bold text-dark mb-1">Catalog Products containing {ingredient.name}</h3>
            <p className="text-muted small mb-0">Shop Joyory products formulated with active {ingredient.name} ({totalProducts} match{totalProducts !== 1 && "es"} found)</p>
          </div>

          {products.length === 0 ? (
            <div className="p-5 border rounded text-center text-muted bg-light">
              🧴 Currently, no products in our catalog match this specific ingredient. Check back soon!
            </div>
          ) : (
            <>
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 text-start">
                {products.map((prod) => {
                  const hasDiscount = prod.discountedPrice && prod.discountedPrice < prod.price;
                  return (
                    <div key={prod._id} className="col">
                      <div 
                        className="card h-100 border shadow-sm cursor-pointer hover-card" 
                        onClick={() => navigate(`/product/${prod.slug || prod.slugs?.[0]}`)}
                        style={{ cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s", borderRadius: "16px", overflow: "hidden" }}
                      >
                        <img 
                          src={prod.image || prod.images?.[0] || "/placeholder.png"} 
                          alt={prod.name}
                          className="card-img-top"
                          style={{ height: "200px", objectFit: "cover", backgroundColor: "#fffafb" }}
                          onError={(e) => { e.target.src = "/placeholder.png"; }}
                        />
                        <div className="card-body d-flex flex-column justify-content-between p-3">
                          <div>
                            <span className="text-muted small text-capitalize mb-1 d-block">{prod.category?.name || "Beauty"}</span>
                            <h6 className="card-title fw-bold text-dark mb-2 limit-2-lines" style={{ fontSize: "13.5px", lineHeight: "1.4" }}>
                              {prod.name}
                            </h6>
                          </div>
                          <div className="mt-2">
                            <span className="fw-bold text-danger me-2">
                              ₹{hasDiscount ? prod.discountedPrice : prod.price}
                            </span>
                            {hasDiscount && (
                              <del className="text-muted small">₹{prod.price}</del>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Load More Button */}
              {prodPage < prodPages && (
                <div className="mt-4 text-center">
                  <button 
                    className="btn btn-outline-dark px-4 py-2"
                    onClick={loadMoreProducts}
                    disabled={prodLoading}
                    style={{ borderRadius: "24px", fontSize: "13px" }}
                  >
                    {prodLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Loading more products...
                      </>
                    ) : (
                      "Load More Products"
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
      
      <Footer />
    </>
  );
}
