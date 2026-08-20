import React, { useEffect, useState, useCallback, useContext, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { useNavigate, useLocation } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../../../styles/BestSellers.css";
import "../../../App.css";
import Loader from "../../common/Loader";
import { toast } from "react-toastify";
import { UserContext } from "../../../context/UserContext";
import { addToCart as apiAddToCart } from "../../../api/cartApi";
import { getErrorMessage } from "../../../utils/errorHandler";
import axiosInstance from "../../../utils/axiosInstance";
import { endpoints } from "../../../utils/endpoints";
import useWishlist from "../../../hooks/useWishlist";
import OutOfStockPopup from "../../common/OutOfStockPopup";
import ProductCard from "../../common/ProductCard";
import {
  getSku,
  getProductDisplayData,
  getVariantDisplayText,
  groupVariantsByType,
  getBrandName,
  getProductSlug,
  getVariantName,
  getVariantType,
  formatPrice,
} from "../../../utils/productHelpers";
import bagIcon from "../../../assets/bag.svg";

// ─── Constants ──────────────────────────────────────────────────────────────

const API_LIST = endpoints?.products?.topSellers
  || "https://beauty.joyory.com/api/user/products/top-sellers";

// ─── Component ───────────────────────────────────────────────────────────────

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Out-of-stock popup state
  const [showOutOfStockPopup, setShowOutOfStockPopup] = useState(false);
  const [outOfStockProductName, setOutOfStockProductName] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserContext);

  // Wishlist hook — replaces the 140-line wishlist block
  const { wishlistData, wishlistLoading, toggleWishlist, isInWishlist } = useWishlist(user);

  // Prevent Google sitelinks indexing on the debug /bestsellers route
  useEffect(() => {
    if (location.pathname === "/bestsellers") {
      let meta = document.querySelector('meta[name="robots"]');
      let isNew = false;
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "robots";
        isNew = true;
      }
      const originalContent = meta.content;
      meta.content = "noindex, nofollow";
      if (isNew) document.head.appendChild(meta);
      return () => {
        if (originalContent) {
          meta.content = originalContent;
        } else if (meta && meta.parentNode) {
          meta.parentNode.removeChild(meta);
        }
      };
    }
  }, [location.pathname]);

  // ─── Out-of-stock popup handlers ────────────────────────────────────────

  const handleOutOfStockClick = useCallback((productName) => {
    setOutOfStockProductName(productName || "This product");
    setShowOutOfStockPopup(true);
    setTimeout(() => setShowOutOfStockPopup(false), 3000);
  }, []);

  const closeOutOfStockPopup = useCallback(() => {
    setShowOutOfStockPopup(false);
  }, []);

  // ─── Data fetching ───────────────────────────────────────────────────────

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get(API_LIST);
      const json = res.data;
      let data = [];

      const normalize = (arr) =>
        arr
          .map((product, index) => {
            const displayData = getProductDisplayData(product, selectedVariants);
            if (displayData)
              return { ...displayData, uniqueId: `best-${index}-${product._id || "noid"}` };
            return null;
          })
          .filter(Boolean);

      if (Array.isArray(json)) {
        data = normalize(json);
      } else if (Array.isArray(json?.products)) {
        data = normalize(json.products);
      } else if (json?.data && Array.isArray(json.data)) {
        data = normalize(json.data);
      }

      setProducts(data);
    } catch (err) {
      console.error("❌ Error fetching best sellers:", err);
      setError("Couldn't load best sellers. Please try again later.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []); // selectedVariants intentionally not in deps — initial fetch only

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="container-fluid my-4 position-relative margin-left-rights pb-0 mb-0">

      {/* Out-of-stock popup (shared component) */}
      <OutOfStockPopup
        show={showOutOfStockPopup}
        productName={outOfStockProductName}
        onClose={closeOutOfStockPopup}
      />

      <h2 className="mb-3 text-left ms-lg-3 ps-lg-4 mb-2 mb-lg-4 best-seller-headings spacing fw-normal">
        Best Sellers
      </h2>

      {loading && (
        <div className="text-center">
          <Loader text="Loading best sellers..." height={120} />
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

      {products.length > 0 ? (
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
            {products.map((item) => {
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

export default BestSellers;

//===============================================================================================(Done-Code(End))====================================================== 
