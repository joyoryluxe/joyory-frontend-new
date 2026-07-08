import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance.js";
import "../../styles/HeaderCategories.css";
import { FaCommentDots, FaMagic, FaFlask, FaCamera, FaPalette, FaClipboardList } from "react-icons/fa";

const CATEGORY_PLACEHOLDER = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='400' viewBox='0 0 300 400'><rect width='100%' height='100%' fill='%23f3f4f6'/><text x='50%' y='50%' font-family='sans-serif' font-size='16' fill='%239ca3af' dominant-baseline='middle' text-anchor='middle'>Shop Now</text></svg>";

const BRAND_PLACEHOLDER = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='80' viewBox='0 0 150 80'><rect width='100%' height='100%' fill='%23f3f4f6'/><text x='50%' y='50%' font-family='sans-serif' font-size='14' fill='%239ca3af' dominant-baseline='middle' text-anchor='middle'>Brand</text></svg>";

const STATIC_MENU_ITEMS = [
  { label: "Brands", path: "/", hasDropdown: true },
  { label: "Offers", path: "/offerlanding" },
  { label: "AI Beauty Features", path: "/ai-beauty-lab", hasDropdown: true },
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

  const [isHoverDisabled, setIsHoverDisabled] = useState(false);

  const handleDropdownAction = (actionFn) => {
    setActiveCategoryId(null);
    setActiveStaticItem(null);
    setIsHoverDisabled(true);
    actionFn();
  };

  const handleMouseEnter = (catId) => {
    if (isHoverDisabled) return;
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setActiveCategoryId(catId);
    setActiveStaticItem(null);
  };

  const handleStaticItemEnter = (itemLabel) => {
    if (isHoverDisabled) return;
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setActiveStaticItem(itemLabel);
    setActiveCategoryId(null);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveCategoryId(null);
      setActiveStaticItem(null);
    }, 350);
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
                {child.name ? child.name.replace(/\s+And\s+/gi, " & ") : ""}
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
    return CATEGORY_PLACEHOLDER;
  };

  const getBrandImage = (brand) => {
    if (brand.logo && typeof brand.logo === 'string') return brand.logo;
    if (brand.image && typeof brand.image === 'string') return brand.image;
    if (Array.isArray(brand.images) && brand.images.length > 0) return brand.images[0];
    return BRAND_PLACEHOLDER;
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
                    <img
                      src={getBrandImage(brand)}
                      alt={brand.name}
                      className="w-100 img-fluid"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = BRAND_PLACEHOLDER;
                      }}
                    />
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

  const renderAiBeautyLabDropdown = () => {
    const aiItems = [
      {
        title: "AI Beauty Concierge",
        description: "Your 24/7 personal beauty chat advisor.",
        icon: <FaCommentDots />,
        // action: () => {
        //   document.getElementById("beauty-concierge-fab")?.click();
        //   setActiveStaticItem(null);
        // }
        action: () => {
          handleDropdownAction(() => {
            navigate("/ai-beauty-lab#ai-beauty-concierge");
            window.dispatchEvent(new CustomEvent("scroll-to-ai-tool", { detail: "ai-beauty-concierge" }));
          });
        }
      },
      {
        title: "Skincare Routine Builder",
        description: "Build a structured AM/PM skincare regimen.",
        icon: <FaMagic />,
        action: () => {
          handleDropdownAction(() => {
            navigate("/ai-beauty-lab#skincare-routine-builder");
            window.dispatchEvent(new CustomEvent("scroll-to-ai-tool", { detail: "skincare-routine-builder" }));
          });
        }
      },
      {
        title: "Ingredient Compatibility",
        description: "Scan ingredients for sensitivity & allergens.",
        icon: <FaFlask />,
        action: () => {
          handleDropdownAction(() => {
            navigate("/ai-beauty-lab#ingredient-compatibility");
            window.dispatchEvent(new CustomEvent("scroll-to-ai-tool", { detail: "ingredient-compatibility" }));
          });
        }
      },
      {
        title: "AI Virtual Try-On",
        description: "Try makeup shades instantly using your camera.",
        icon: <FaCamera />,
        action: () => {
          handleDropdownAction(() => {
            navigate("/ai-beauty-lab#ai-virtual-try-on");
            window.dispatchEvent(new CustomEvent("scroll-to-ai-tool", { detail: "ai-virtual-try-on" }));
          });
        }
      },
      {
        title: "Foundation Shade Finder",
        description: "Find your perfect shade matching your skin tone.",
        icon: <FaPalette />,
        action: () => {
          handleDropdownAction(() => {
            navigate("/ai-beauty-lab#foundation-shade-finder");
            window.dispatchEvent(new CustomEvent("scroll-to-ai-tool", { detail: "foundation-shade-finder" }));
          });
        }
      },
      {
        title: "Smart Beauty Quiz",
        description: "Take our quiz for skin type recommendations.",
        icon: <FaClipboardList />,
        action: () => {
          handleDropdownAction(() => {
            navigate("/ai-beauty-lab#smart-beauty-quiz");
            window.dispatchEvent(new CustomEvent("scroll-to-ai-tool", { detail: "smart-beauty-quiz" }));
          });
        }
      }
    ];

    return (
      <div className="ai-dropdown">
        <div className="ai-dropdown-header">
          <h3>AI Beauty Lab</h3>
          <p>Cutting-edge AI tools customized to your skincare & makeup needs.</p>
        </div>
        <div className="ai-dropdown-grid">
          {aiItems.map((item, idx) => (
            <div
              key={idx}
              className="ai-dropdown-item"
              onClick={(e) => {
                e.stopPropagation();
                item.action();
              }}
            >
              <div className="ai-dropdown-icon">{item.icon}</div>
              <div className="ai-dropdown-info">
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* 🔥 NEW: FULL PAGE OVERLAY WHEN DROPDOWN IS OPEN */}
      {isDropdownOpen && <div className="mega-menu-overlay" onMouseEnter={handleMouseLeave}></div>}

      <div
        className="header-categories w-100 page-title-main-name"
        onMouseLeave={() => {
          handleMouseLeave();
          setIsHoverDisabled(false);
        }}
      >
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
                {cat.name ? cat.name.replace(/\s+And\s+/gi, " & ") : ""}
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
                            {sub.name ? sub.name.replace(/\s+And\s+/gi, " & ") : ""}
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
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = CATEGORY_PLACEHOLDER;
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

              {item.label === "AI Beauty Features" && activeStaticItem === "AI Beauty Features" && (
                <div className="ai-dropdown-wrapper">
                  {renderAiBeautyLabDropdown()}
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