import React, { useEffect, useState } from "react";
import { getTopCategories } from "../../../api/productApi";
import { getCategoryTree } from "../../../api/categoryApi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules"; // Added Navigation
import { useNavigate, useLocation } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation"; // Import navigation CSS
import "../../../styles/Home.css";
import "../../../App.css";
import SectionError from "../../common/SectionError";
import { getErrorMessage } from "../../../utils/errorHandler";

const TopCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Conditional SEO meta tag configuration to prevent Google sitelinks indexing
  useEffect(() => {
    if (location.pathname === "/topcategories") {
      let meta = document.querySelector('meta[name="robots"]');
      let isNew = false;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'robots';
        isNew = true;
      }
      const originalContent = meta.content;
      meta.content = 'noindex, nofollow';
      if (isNew) {
        document.head.appendChild(meta);
      }
      return () => {
        if (originalContent) {
          meta.content = originalContent;
        } else if (meta && meta.parentNode) {
          meta.parentNode.removeChild(meta);
        }
      };
    }
  }, [location.pathname]);

  // Fetch categories and category tree from API, then merge them
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [resTop, resTree] = await Promise.all([
        getTopCategories(),
        getCategoryTree()
      ]);

      const topData = resTop.data;
      const topList = Array.isArray(topData) ? topData : topData.categories || [];

      let treeList = [];
      if (resTree.data) {
        const treeData = resTree.data;
        treeList = Array.isArray(treeData) ? treeData : [];
      }

      // Map top categories to include subCategories from the tree (case-insensitive)
      const populatedList = topList.map(cat => {
        const matchedNode = treeList.find(node => node.slug?.toLowerCase() === cat.slug?.toLowerCase());
        return {
          ...cat,
          subCategories: matchedNode ? matchedNode.subCategories : []
        };
      });

      setCategories(populatedList);
    } catch (err) {
      console.error("Error loading categories in TopCategories:", err);
      setError(getErrorMessage(err, "Failed to load categories."));
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    // <div className="top-categories-wrapper container responsive-container  my-4">
    <div className="top-categories-wrapper container-fluid  bg-white mb-4">
      <h2 className="top-categories-title mb-1 text-left ms-lg-3 ms-2 ps-lg-4 mb-2 m-lg-4  fw-normal">Top Categories</h2>

      {loading ? (
        <p className="text-center text-muted page-title-main-name">Loading categories...</p>
      ) : error ? (
        <SectionError message={error} onRetry={fetchData} />
      ) : categories.length === 0 ? (
        <p className="text-center text-muted page-title-main-name">No categories found.</p>
      ) : categories.length < 3 ? (
        <div className="container-fluid px-lg-5">
          <div className="row g-4 justify-content-center">
            {categories.map((cat, i) => (
              <div key={cat._id || i} className="col-6 col-md-5 col-lg-5">
                <div
                  className="slide-item"
                  onClick={() => {
                    if (cat.subCategories && cat.subCategories.length > 0) {
                      navigate(`/category/${cat.slug}`);
                    } else {
                      navigate(`/Products/category/${cat.slug}`);
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <div className="border-0 top-cat-card">
                    <img
                      src={cat.thumbnailImage || `https://picsum.photos/400/200?random=${i}`}
                      alt={cat.name || "Category"}
                      className="top-cat-img top-category-image responsive-imagesss"
                      onError={(e) => {
                        e.currentTarget.src = `https://picsum.photos/400/200?random=${i}`;
                      }}
                    />
                    <div className="p-2 text-center text-dark fw-medium fs-6">
                      {cat.name}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mobile-responsive-code px-lg-5">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            navigation={true}
            pagination={{ clickable: true }}
            spaceBetween={0}
            breakpoints={{
              300: { slidesPerView: 2, spaceBetween: 0 },
              380: { slidesPerView: 2, spaceBetween: 0 },
              576: { slidesPerView: 3, spaceBetween: 0 },
              768: { slidesPerView: 3, spaceBetween: 0 },
              992: { slidesPerView: 4, spaceBetween: 0 },
              1200: { slidesPerView: 5, spaceBetween: 0 },
              1400: { slidesPerView: 6, spaceBetween: 0 },
            }}
          >
            {categories.map((cat, i) => (
              <SwiperSlide key={cat._id || i}>
                <div
                  className="slide-item"
                  onClick={() => {
                    if (cat.subCategories && cat.subCategories.length > 0) {
                      navigate(`/category/${cat.slug}`);
                    } else {
                      navigate(`/Products/category/${cat.slug}`);
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <div className="border-0 top-cat-card">
                    <img
                      src={cat.thumbnailImage || `https://picsum.photos/400/200?random=${i}`}
                      alt={cat.name || "Category"}
                      className="top-cat-img top-category-image responsive-imagesss"
                      onError={(e) => {
                        e.currentTarget.src = `https://picsum.photos/400/200?random=${i}`;
                      }}
                    />
                    <div className="p-2 text-center text-dark fw-medium fs-6">
                      {cat.name}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default TopCategories;
