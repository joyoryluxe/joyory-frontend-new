import React, { useEffect, useState, useCallback, useContext, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { useNavigate, useLocation } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../../../styles/ForYou.css";
import "../../../styles/BestSellers.css";
import "../../../App.css";
import Loader from "../../common/Loader";
import { UserContext } from "../../../context/UserContext.jsx";
import axiosInstance from "../../../utils/axiosInstance";
import { endpoints } from "../../../utils/endpoints";
import useWishlist from "../../../hooks/useWishlist";
import OutOfStockPopup from "../../common/OutOfStockPopup";
import ProductCard from "../../common/ProductCard";
import {
  getProductDisplayData,
  getSku,
  groupVariantsByType,
  getVariantDisplayText,
} from "../../../utils/productHelpers";

// ─── API URL ─────────────────────────────────────────────────────────────────

const PERSONALIZED_API =
  endpoints?.recommendations?.personalized
  || "https://beauty.joyory.com/api/user/recommendations/personalized";

// ─── Component ───────────────────────────────────────────────────────────────

const Foryou = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Out-of-stock popup state
  const [showOutOfStockPopup, setShowOutOfStockPopup] = useState(false);
  const [outOfStockProductName, setOutOfStockProductName] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserContext);

  // Wishlist hook — replaces the 148-line wishlist block
  const { wishlistData, wishlistLoading, toggleWishlist, isInWishlist } = useWishlist(user);

  // ─── Out-of-stock popup handlers ─────────────────────────────────────────

  const handleOutOfStockClick = useCallback((productName) => {
    setOutOfStockProductName(productName || "This product");
    setShowOutOfStockPopup(true);
    setTimeout(() => setShowOutOfStockPopup(false), 3000);
  }, []);

  const closeOutOfStockPopup = useCallback(() => {
    setShowOutOfStockPopup(false);
  }, []);

  // ─── Product data transformation helpers ──────────────────────────────────

  const removeDuplicates = useCallback((productsArray) => {
    const seen = new Map();
    return productsArray.filter((product) => {
      if (!product?._id) return false;
      const productId = product._id;
      if (seen.has(productId)) {
        const existing = seen.get(productId);
        const existingDiscount = existing.variant?.discountPercent || 0;
        const currentDiscount = product.variant?.discountPercent || 0;
        if (currentDiscount > existingDiscount) {
          seen.set(productId, product);
        }
        return false;
      }
      seen.set(productId, product);
      return true;
    });
  }, []);

  const sortProducts = useCallback((productsArray) => {
    return [...productsArray].filter(Boolean).sort((a, b) => {
      if (a.variant?.status === "inStock" && b.variant?.status !== "inStock") return -1;
      if (a.variant?.status !== "inStock" && b.variant?.status === "inStock") return 1;
      const discountA = a.variant?.discountPercent || 0;
      const discountB = b.variant?.discountPercent || 0;
      if (discountB !== discountA) return discountB - discountA;
      return 0;
    });
  }, []);

  const transformProducts = useCallback((sectionsData) => {
    let allProducts = [];
    if (sectionsData?.success && Array.isArray(sectionsData.sections)) {
      sectionsData.sections.forEach((section, sectionIndex) => {
        if (Array.isArray(section.products)) {
          const productsWithSection = section.products
            .map((product, productIndex) => {
              const displayData = getProductDisplayData(product);
              if (!displayData) return null;
              return {
                ...displayData,
                sectionTitle:
                  typeof section.title === "string" ? section.title : section.name || "Featured",
                uniqueId: `${sectionIndex}-${productIndex}-${product._id || "noid"}`,
                sectionIndex,
                productIndex,
              };
            })
            .filter(Boolean);
          allProducts = [...allProducts, ...productsWithSection];
        }
      });
    } else if (Array.isArray(sectionsData?.products)) {
      sectionsData.products.forEach((product, index) => {
        const displayData = getProductDisplayData(product);
        if (displayData) {
          allProducts.push({
            ...displayData,
            sectionTitle:
              sectionsData?.type === "personalized"
                ? "Recommended For You"
                : sectionsData?.title || "Top Picks",
            uniqueId: `${sectionsData?.type || "default"}-${index}-${product?._id || "noid"}`,
            sectionIndex: 0,
            productIndex: index,
          });
        }
      });
    } else if (Array.isArray(sectionsData)) {
      sectionsData.forEach((product, index) => {
        const displayData = getProductDisplayData(product);
        if (displayData) {
          allProducts.push({
            ...displayData,
            sectionTitle: "Recommended",
            uniqueId: `default-${index}-${product?._id || "noid"}`,
            sectionIndex: 0,
            productIndex: index,
          });
        }
      });
    }
    return allProducts.filter(Boolean);
  }, []);

  // ─── Data fetching ────────────────────────────────────────────────────────

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = `${PERSONALIZED_API}?section=manual`;
      const res = await axiosInstance.get(apiUrl);
      const json = res.data;

      let data = [];
      const processData = (raw) => {
        let d = transformProducts(raw);
        d = removeDuplicates(d);
        d = sortProducts(d);
        return d.slice(0, 15);
      };

      if (json?.success && Array.isArray(json.sections)) {
        data = processData(json);
      } else if (Array.isArray(json?.products)) {
        data = processData(json);
      } else if (Array.isArray(json)) {
        data = processData(json);
      } else if (json?.data && Array.isArray(json.data)) {
        data = processData(json.data);
      }

      setProducts(data);
    } catch (err) {
      console.error("❌ Error fetching recommendations:", err);
      setError("Couldn't load recommendations. Please try again later.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [transformProducts, removeDuplicates, sortProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const memoizedProducts = useMemo(() => products, [products]);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="container-fluid my-4 position-relative margin-left-rights">

      {/* Out-of-stock popup (shared component) */}
      <OutOfStockPopup
        show={showOutOfStockPopup}
        productName={outOfStockProductName}
        onClose={closeOutOfStockPopup}
      />

      <h2 className="text-start foryou-heading ms-lg-3 ps-lg-4 ms-1 mt-3 mb-2 mb-lg-4 spacing fw-normal">
        Recommended For You
      </h2>

      {loading && (
        <div className="text-center">
          <Loader text="Loading recommendations..." height={120} />
        </div>
      )}

      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
          <button className="btn btn-sm btn-outline-danger ms-3" onClick={fetchProducts}>
            Retry
          </button>
        </div>
      )}

      {memoizedProducts.length > 0 ? (
        <div className="mobile-responsive-code position-relative">
          <Swiper
            modules={[Autoplay, Navigation]}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            breakpoints={{
              300: { slidesPerView: 2, spaceBetween: 10 },
              576: { slidesPerView: 2.5, spaceBetween: 15 },
              768: { slidesPerView: 3, spaceBetween: 15 },
              992: { slidesPerView: 4, spaceBetween: 20 },
              1200: { slidesPerView: 4, spaceBetween: 25 },
            }}
            className="foryou-swiper pb-0 mb-0"
          >
            {memoizedProducts.map((item) => {
              if (!item) return null;
              return (
                <SwiperSlide key={item.uniqueId}>
                  <ProductCard
                    item={item}
                    wishlistData={wishlistData}
                    wishlistLoading={wishlistLoading}
                    toggleWishlist={toggleWishlist}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      ) : !loading && !error ? (
        <div className="text-center py-5">
          <i className="bi bi-box-seam display-4 text-muted"></i>
          <p className="text-muted mt-3">No products available at the moment.</p>
          <button className="btn btn-primary mt-2" onClick={fetchProducts}>
            Refresh
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Foryou;

//===============================================================================================(Done-Code(End))====================================================== 
