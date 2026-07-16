// src/components/TopCategories.jsx
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules"; // Added Navigation
import { useNavigate, useLocation } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation"; // Import navigation CSS
import "../../../styles/Home.css";
import "../../../App.css";

const TopCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resTop, resTree] = await Promise.all([
          fetch("https://beauty.joyory.com/api/user/products/top-categories"),
          fetch("https://beauty.joyory.com/api/user/categories/tree")
        ]);

        if (!resTop.ok) {
          throw new Error(`Failed to fetch top categories: ${resTop.status}`);
        }

        const topData = await resTop.json();
        const topList = Array.isArray(topData) ? topData : topData.categories || [];

        let treeList = [];
        if (resTree.ok) {
          const treeData = await resTree.json();
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
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    // <div className="top-categories-wrapper container responsive-container  my-4">
    <div className="top-categories-wrapper container-fluid  bg-white">
      <h2 className="top-categories-title mb-1 text-left ms-lg-3 ms-2 ps-lg-4 mb-2 mb-lg-4 fw-normal">Top Categories</h2>

      {loading ? (
        <p className="text-center text-muted page-title-main-name">Loading categories...</p>
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
                    <div className="top-cat-body text-center">
                      <h5 className="top-cat-title mb-0 mt-3 font-weightss top-category-name-font text-start">
                        {cat.name || "Unnamed"}
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mobile-responsive-code" >
          <Swiper
            modules={[Autoplay, Pagination, Navigation]} // Added Navigation
            pagination={{ clickable: true }}
            navigation={true} // Enable arrows
            autoplay={{ delay: 800, disableOnInteraction: false }}
            speed={800}

            breakpoints={{
              300: { slidesPerView: Math.min(categories.length, 2) },
              380: { slidesPerView: Math.min(categories.length, 2) },
              576: { slidesPerView: Math.min(categories.length, 3) },
              768: { slidesPerView: Math.min(categories.length, 3) },
              992: { slidesPerView: Math.min(categories.length, 4) },
              1024: { slidesPerView: Math.min(categories.length, 4) },
              1200: { slidesPerView: Math.min(categories.length, 4) },
              1400: { slidesPerView: Math.min(categories.length, 4) },
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
                    <div className="top-cat-body text-center">
                      <h5 className="top-cat-title mb-0 mt-3 font-weightss top-category-name-font text-start">
                        {cat.name || "Unnamed"}
                      </h5>
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


