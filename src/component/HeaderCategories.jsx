import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance.js";
import "../css/Header/HeaderCategories.css";

const STATIC_MENU_ITEMS = [
  { label: "Brands", path: "/", hasDropdown: true },
  { label: "Offers", path: "/offerlanding" },
  { label: "Virtual Try-on", path: "/virtualtryon" },
  { label: "Shade finder", path: "/shadefinder" },
  { label: "For you", path: "/foryoulanding" },
  { label: "About us", path: "/aboutus" }
];

const HeaderCategories = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [activeStaticItem, setActiveStaticItem] = useState(null);
  const navigate = useNavigate();
  const hoverTimeoutRef = useRef(null);

  // Check if any dropdown is currently open to show the background overlay
  const isDropdownOpen = activeCategoryId !== null || activeStaticItem !== null;

  useEffect(() => {
    fetchCategories();
    fetchBrands();
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/api/user/categories/tree");
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Category fetch failed", err);
      setCategories([]);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await axiosInstance.get("/api/user/brands");
      setBrands(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Brands fetch failed", err);
      setBrands([]);
    }
  };

  const handleMouseEnter = (catId) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setActiveCategoryId(catId);
    setActiveStaticItem(null);
  };

  const handleStaticItemEnter = (itemLabel) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setActiveStaticItem(itemLabel);
    setActiveCategoryId(null);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveCategoryId(null);
      setActiveStaticItem(null);
    }, 200);
  };

  const renderSubCategories = (subCategories, parentSlug = "", level = 1) => {
    if (!Array.isArray(subCategories) || subCategories.length === 0) return null;

    return (
      <div className={`subcategory-children page-title-main-name level-${level}`}>
        {subCategories.map((child) => {
          const path = parentSlug ? `${parentSlug}/${child.slug}` : child.slug;

          return (
            <div key={child._id} className="child-category-wrapper page-title-main-name">
              <div
                className="child-category"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/category/${path}`);
                  setActiveCategoryId(null);
                }}
              >
                {child.name}
              </div>
              {renderSubCategories(child.subCategories, path, level + 1)}
            </div>
          );
        })}
      </div>
    );
  };

  const getCategoryImage = (cat) => {
    if (cat.headerImage && typeof cat.headerImage === 'string') return cat.headerImage;
    if (Array.isArray(cat.bannerImage) && cat.bannerImage.length > 0) return cat.bannerImage[0];
    if (Array.isArray(cat.thumbnailImage) && cat.thumbnailImage.length > 0) return cat.thumbnailImage[0];
    return "https://via.placeholder.com/300x400?text=Shop+Now";
  };

  const getBrandImage = (brand) => {
    if (brand.logo && typeof brand.logo === 'string') return brand.logo;
    if (brand.image && typeof brand.image === 'string') return brand.image;
    if (Array.isArray(brand.images) && brand.images.length > 0) return brand.images[0];
    return "https://via.placeholder.com/150x80?text=Brand";
  };

  const renderBrandsDropdown = () => {
    return (
      <div className="brands-dropdown">
        <div className="brands-header">
          <h3>All Brands</h3>
        </div>

        <div className="brands-slider-container">
          {brands.length > 0 ? (
            <div className="brands-grid">
              {brands.map((brand) => (
                <div
                  key={brand._id}
                  className="brand-item"
                  onClick={() => {
                    navigate(`/brand/${brand.slug || brand._id}`);
                    setActiveStaticItem(null);
                  }}
                >
                  <div className="brand-image-wrapper">
                    <img src={getBrandImage(brand)} alt={brand.name} className="w-100 img-fluid" />
                  </div>
                  {/* <span className="brand-name">{brand.name}</span> */}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-brands">No brands available</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* 🔥 NEW: FULL PAGE OVERLAY WHEN DROPDOWN IS OPEN */}
      {isDropdownOpen && <div className="mega-menu-overlay" onMouseEnter={handleMouseLeave}></div>}

      <div className="header-categories w-100 page-title-main-name">
        <div className="container-fluid d-flex align-items-center justify-content-evenly">

          {/* Dynamic Categories */}
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="category-wrapper"
              onMouseEnter={() => handleMouseEnter(cat._id)}
              onMouseLeave={handleMouseLeave}
            >
              <span
                className="category-name fw-normal"
                onClick={() => {
                  navigate(`/category/${cat.slug}`);
                  setActiveCategoryId(null);
                }}
              >
                {cat.name}
              </span>

              {activeCategoryId === cat._id && (
                <div className="category-dropdown d-flex">
                  <div className="dropdown-left-side">
                    {Array.isArray(cat.subCategories) && cat.subCategories.length > 0 ? (
                      cat.subCategories.map((sub) => (
                        <div key={sub._id} className="subcategory">
                          <div
                            className="subcategory-title"
                            onClick={() => {
                              navigate(`/category/${cat.slug}/${sub.slug}`);
                              setActiveCategoryId(null);
                            }}
                          >
                            {sub.name}
                          </div>
                          {renderSubCategories(sub.subCategories, `${cat.slug}/${sub.slug}`)}
                        </div>
                      ))
                    ) : (
                      <div className="dropdown-empty">No subcategories</div>
                    )}
                  </div>

                  <div className="dropdown-right-side">
                    <img
                      src={getCategoryImage(cat)}
                      alt={cat.name}
                      style={{
                        width: "100%",
                        height: "auto",
                        maxHeight: "350px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        cursor: "pointer"
                      }}
                      onClick={() => {
                        navigate(`/category/${cat.slug}`);
                        setActiveCategoryId(null);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Static Menu Items with Brands Dropdown */}
          {STATIC_MENU_ITEMS.map((item) => (
            <div
              key={item.label}
              className={`category-wrapper static-item ${item.hasDropdown ? 'has-dropdown' : ''}`}
              onMouseEnter={() => item.hasDropdown ? handleStaticItemEnter(item.label) : null}
              onMouseLeave={handleMouseLeave}
            >
              <span className="category-name fw-normal" onClick={() => navigate(item.path)}>
                {item.label}
              </span>

              {item.label === "Brands" && activeStaticItem === "Brands" && (
                <div className="brands-dropdown-wrapper">
                  {renderBrandsDropdown()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HeaderCategories;