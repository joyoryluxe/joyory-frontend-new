// /* ProductPage – Unified API & Full Feature Edition with Multi-Filter Support */
// import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
// import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";
// import { FaStar, FaHeart, FaRegHeart, FaChevronDown } from "react-icons/fa";
// import Header from "./Header";
// import Footer from "./Footer";
// import { CartContext } from "../Context/CartContext";
// import { UserContext } from "./UserContext.jsx";
// import BrandFilter from "./BrandFilter";
// import "../css/ProductPage.css";
// import axios from "axios";
// import updownarrow from "../assets/updownarrow.svg";
// import filtering from "../assets/filtering.svg";
// import Bag from "../assets/Bag.svg";

// const CART_API_BASE   = "https://beauty.joyory.com/api/user/cart";
// const PRODUCT_ALL_API = "https://beauty.joyory.com/api/user/products/all";

// /* ─── helpers ───────────────────────────────────────────────────────────── */
// const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || "default"}`;

// const isValidHexColor = (hex) => {
//   if (!hex || typeof hex !== "string") return false;
//   return /^#([a-f0-9]{6}|[a-f0-9]{3})$/.test(hex.trim().toLowerCase());
// };

// const getVariantDisplayText = (v) =>
//   (v.shadeName || v.name || v.size || v.ml || v.weight || "Default").toUpperCase();

// const groupVariantsByType = (variants) => {
//   const g = { color: [], text: [] };
//   (variants || []).forEach((v) => {
//     if (!v) return;
//     v.hex && isValidHexColor(v.hex) ? g.color.push(v) : g.text.push(v);
//   });
//   return g;
// };

// const getBrandName = (p) => {
//   if (!p?.brand) return "Unknown Brand";
//   if (typeof p.brand === "object" && p.brand.name) return p.brand.name;
//   if (typeof p.brand === "string") return p.brand;
//   return "Unknown Brand";
// };

// export default function ProductPage() {
//   const { slug }              = useParams();
//   const { "*": categoryPath } = useParams();
//   const navigate              = useNavigate();
//   const location              = useLocation();
//   const [searchParams, setSearchParams] = useSearchParams();  // <-- added for URL query handling

//   let effectiveSlug = slug;
//   if (location.pathname.startsWith("/category/") && categoryPath) {
//     const segments = categoryPath.split("/");
//     effectiveSlug  = segments[segments.length - 1];
//   }

//   /* ── state ──────────────────────────────────────────────────────────────── */
//   const [allProducts,        setAllProducts]        = useState([]);
//   const [pageTitle,          setPageTitle]          = useState("Products");
//   const [bannerImage,        setBannerImage]        = useState("");

//   const [trendingCategories, setTrendingCategories] = useState([]);
//   const [filterData, setFilterData] = useState(null);

//   const [activeCategorySlug, setActiveCategorySlug] = useState(() =>
//     location.pathname.includes("/category/") && effectiveSlug ? effectiveSlug : null
//   );
//   const [activeCategoryName, setActiveCategoryName] = useState("");

//   const [selectedVariants, setSelectedVariants] = useState({});
//   const [addingToCart,     setAddingToCart]     = useState({});
//   const [loading,          setLoading]          = useState(true);
//   const [loadingMore,      setLoadingMore]      = useState(false);
//   const [hasMore,          setHasMore]          = useState(true);
//   const [nextCursor,       setNextCursor]       = useState(null);

//   const [wishlistLoading, setWishlistLoading] = useState({});
//   const [wishlistData,    setWishlistData]    = useState([]);

//   const [filters, setFilters] = useState({
//     brandIds:      [],
//     categoryIds:   [],
//     skinTypes:     [],
//     formulations:  [],
//     finishes:      [],
//     ingredients:   [],
//     priceRange:    null,
//     discountRange: null,
//     minRating:     "",
//     sort:          "recent",
//   });

//   const [showFilterOffcanvas, setShowFilterOffcanvas] = useState(false);
//   const [showSortOffcanvas,   setShowSortOffcanvas]   = useState(false);
//   const [showVariantOverlay,  setShowVariantOverlay]  = useState(null);
//   const [selectedVariantType, setSelectedVariantType] = useState("all");

//   const { user }  = useContext(UserContext);
//   const loaderRef = useRef(null);

//   const getPageContext = () => {
//     if (location.pathname.includes("/brand/"))    return "brand";
//     if (location.pathname.includes("/category/")) return "category";
//     if (location.pathname.includes("/skintype/")) return "skintype";
//     return "general";
//   };
//   const pageContext = getPageContext();

//   /* ── toast ──────────────────────────────────────────────────────────────── */
//   const showToastMsg = (msg, type = "error", dur = 3000) => {
//     const t = document.createElement("div");
//     t.className = `toast-notification toast-${type}`;
//     t.style.cssText = `
//       position:fixed;top:20px;right:20px;padding:12px 20px;
//       border-radius:8px;color:#fff;z-index:9999;
//       background:${type === "error" ? "#f56565" : "#48bb78"};
//       box-shadow:0 4px 12px rgba(0,0,0,.15);
//     `;
//     t.textContent = msg;
//     document.body.appendChild(t);
//     setTimeout(() => t.remove(), dur);
//   };

//   /* ── wishlist ───────────────────────────────────────────────────────────── */
//   const isInWishlist = (pid, sku) => {
//     if (!pid || !sku) return false;
//     return wishlistData.some((it) => (it.productId === pid || it._id === pid) && it.sku === sku);
//   };

//   const fetchWishlistData = async () => {
//     try {
//       if (user && !user.guest) {
//         const { data } = await axios.get("https://beauty.joyory.com/api/user/wishlist", { withCredentials: true });
//         if (data.success) setWishlistData(data.wishlist || []);
//       } else {
//         const local = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
//         setWishlistData(local.map((it) => ({ ...it, productId: it._id })));
//       }
//     } catch (e) { console.error(e); }
//   };

//   useEffect(() => { fetchWishlistData(); }, [user]);

//   const toggleWishlist = async (prod, variant) => {
//     if (!prod || !variant) return showToastMsg("Select a variant first", "error");
//     const pid = prod._id;
//     const sku = getSku(variant);
//     setWishlistLoading((p) => ({ ...p, [pid]: true }));
//     try {
//       const inWl = isInWishlist(pid, sku);
//       if (user && !user.guest) {
//         if (inWl) {
//           await axios.delete(`https://beauty.joyory.com/api/user/wishlist/${pid}`, { withCredentials: true, data: { sku } });
//           showToastMsg("Removed from wishlist!", "success");
//         } else {
//           await axios.post(`https://beauty.joyory.com/api/user/wishlist/${pid}`, { sku }, { withCredentials: true });
//           showToastMsg("Added to wishlist!", "success");
//         }
//         await fetchWishlistData();
//       } else {
//         let g = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
//         if (inWl) {
//           g = g.filter((it) => !(it._id === pid && it.sku === sku));
//           showToastMsg("Removed from wishlist!", "success");
//         } else {
//           g.push({
//             _id: pid, name: prod.name, brand: getBrandName(prod),
//             displayPrice: variant.displayPrice || variant.discountedPrice || prod.price,
//             originalPrice: variant.originalPrice || variant.mrp || prod.price,
//             image: variant.images?.[0] || prod.images?.[0],
//             sku, variantName: variant.shadeName || "Default", stock: variant.stock,
//           });
//           showToastMsg("Added to wishlist!", "success");
//         }
//         localStorage.setItem("guestWishlist", JSON.stringify(g));
//         await fetchWishlistData();
//       }
//     } catch (e) {
//       showToastMsg(e.response?.data?.message || "Wishlist error", "error");
//     } finally {
//       setWishlistLoading((p) => ({ ...p, [pid]: false }));
//     }
//   };

//   /* ── fetch products ─────────────────────────────────────────────────────── */
//   const buildQueryParams = (cursor = null) => {
//     const p    = new URLSearchParams();
//     const path = location.pathname.toLowerCase();

//     if (activeCategorySlug) {
//       p.append("categoryIds", activeCategorySlug);
//     } else if (path.includes("/category/")) {
//       p.append("categoryIds", effectiveSlug);
//     } else if (path.includes("/skintype/")) {
//       p.append("skinTypes", effectiveSlug);
//     } else if (path.includes("/promotion/")) {
//       p.append("promoSlug", effectiveSlug);
//     }

//     filters.brandIds?.forEach((id)  => p.append("brandIds",     id));
//     filters.categoryIds?.forEach((id) => p.append("categoryIds", id));
//     filters.skinTypes?.forEach((n)  => p.append("skinTypes",    n));
//     filters.formulations?.forEach((id) => p.append("formulations", id));
//     filters.finishes?.forEach((s)   => p.append("finishes",     s));
//     filters.ingredients?.forEach((s) => p.append("ingredients", s));
//     if (filters.minRating)    p.append("minRating",   filters.minRating);
//     if (filters.priceRange) {
//       p.append("minPrice", filters.priceRange.min);
//       if (filters.priceRange.max != null) p.append("maxPrice", filters.priceRange.max);
//     }
//     if (filters.discountRange) p.append("minDiscount", filters.discountRange.min);
//     if (filters.sort)          p.append("sort",        filters.sort);
//     if (cursor)                p.append("cursor",      cursor);
//     p.append("limit", "9");

//     const queryString = p.toString();
//     console.log("API Query →", `${PRODUCT_ALL_API}?${queryString}`);
//     return queryString;
//   };

//   const fetchProducts = async (cursor = null, reset = false) => {
//     try {
//       if (reset) {
//         setLoading(true);
//         setAllProducts([]);
//         setNextCursor(null);
//         setHasMore(true);
//       } else {
//         setLoadingMore(true);
//       }

//       const { data } = await axios.get(
//         `${PRODUCT_ALL_API}?${buildQueryParams(cursor)}`,
//         { withCredentials: true }
//       );

//       // title
//       if (data.titleMessage)       setPageTitle(data.titleMessage);
//       else if (data.category?.name)  setPageTitle(data.category.name);
//       else if (data.promoMeta?.name) setPageTitle(data.promoMeta.name);
//       else if (data.skinType?.name)  setPageTitle(data.skinType.name);

//       // banner
//       if (data.bannerImage && Array.isArray(data.bannerImage)) {
//         setBannerImage(data.bannerImage[0]?.url || data.bannerImage[0] || "");
//       } else if (data.category?.bannerImage)  setBannerImage(data.category.bannerImage);
//       else if (data.promoMeta?.bannerImage)   setBannerImage(data.promoMeta.bannerImage);
//       else if (data.skinType?.bannerImage)    setBannerImage(data.skinType.bannerImage);

//       if (data.trendingCategories && Array.isArray(data.trendingCategories)) {
//         setTrendingCategories(data.trendingCategories);
//         if (effectiveSlug && !activeCategoryName) {
//           const found = data.trendingCategories.find((c) => c.slug === effectiveSlug);
//           if (found) setActiveCategoryName(found.name);
//         }
//       } else {
//         setTrendingCategories([]);
//       }

//       if (data.category?.name && !activeCategoryName && effectiveSlug) {
//         setActiveCategoryName(data.category.name);
//       }

//       if (reset && data.filters) {
//         setFilterData(data.filters);
//       }

//       const prods = data.products || [];
//       const pg    = data.pagination || {};

//       if (reset) setAllProducts(prods);
//       else        setAllProducts((prev) => [...prev, ...prods]);

//       setHasMore(pg.hasMore || false);
//       setNextCursor(pg.nextCursor || null);
//     } catch (e) {
//       console.error(e);
//       showToastMsg("Failed to fetch products", "error");
//     } finally {
//       setLoading(false);
//       setLoadingMore(false);
//     }
//   };

//   // Sync active category when URL changes
//   useEffect(() => {
//     if (location.pathname.includes("/category/") && effectiveSlug) {
//       setActiveCategorySlug(effectiveSlug);
//     } else {
//       setActiveCategorySlug(null);
//       setActiveCategoryName("");
//     }
//   }, [effectiveSlug, location.pathname]);

//   /* ── NEW: Parse URL query parameters on mount ────────────────────────────── */
//   useEffect(() => {
//     const initialFilters = { ...filters };
//     let changed = false;

//     // Helper to parse multi-value param (array from repeated keys, or comma-separated)
//     const getMultiParam = (key) => {
//       const values = searchParams.getAll(key);
//       if (values.length > 0) return values;
//       const comma = searchParams.get(key);
//       if (comma) return comma.split(',').map(s => s.trim()).filter(Boolean);
//       return [];
//     };

//     // Ingredients
//     const ingredientsParam = getMultiParam('ingredients');
//     if (ingredientsParam.length > 0) {
//       initialFilters.ingredients = ingredientsParam;
//       changed = true;
//     }

//     // Skin types
//     const skinTypesParam = getMultiParam('skinTypes');
//     if (skinTypesParam.length > 0) {
//       initialFilters.skinTypes = skinTypesParam;
//       changed = true;
//     }

//     // Brands
//     const brandsParam = getMultiParam('brandIds');
//     if (brandsParam.length > 0) {
//       initialFilters.brandIds = brandsParam;
//       changed = true;
//     }

//     // Categories (additional)
//     const categoriesParam = getMultiParam('categoryIds');
//     if (categoriesParam.length > 0) {
//       initialFilters.categoryIds = categoriesParam;
//       changed = true;
//     }

//     // Formulations
//     const formulationsParam = getMultiParam('formulations');
//     if (formulationsParam.length > 0) {
//       initialFilters.formulations = formulationsParam;
//       changed = true;
//     }

//     // Finishes
//     const finishesParam = getMultiParam('finishes');
//     if (finishesParam.length > 0) {
//       initialFilters.finishes = finishesParam;
//       changed = true;
//     }

//     // Price range (min and max)
//     const minPrice = searchParams.get('minPrice');
//     const maxPrice = searchParams.get('maxPrice');
//     if (minPrice !== null || maxPrice !== null) {
//       initialFilters.priceRange = {
//         min: minPrice ? parseFloat(minPrice) : 0,
//         max: maxPrice ? parseFloat(maxPrice) : null,
//       };
//       changed = true;
//     }

//     // Discount range
//     const minDiscount = searchParams.get('minDiscount');
//     if (minDiscount !== null) {
//       initialFilters.discountRange = { min: parseFloat(minDiscount) };
//       changed = true;
//     }

//     // Min rating
//     const minRating = searchParams.get('minRating');
//     if (minRating !== null) {
//       initialFilters.minRating = minRating;
//       changed = true;
//     }

//     // Sort
//     const sortParam = searchParams.get('sort');
//     if (sortParam !== null && ['recent', 'priceHighToLow', 'priceLowToHigh'].includes(sortParam)) {
//       initialFilters.sort = sortParam;
//       changed = true;
//     }

//     if (changed) {
//       setFilters(initialFilters);
//     }
//   }, []); // only once on mount

//   /* ── NEW: Sync URL query parameters when filters change ──────────────────── */
//   useEffect(() => {
//     const newParams = new URLSearchParams();

//     // Helper to add array parameters (each as separate key)
//     const addArrayParam = (key, arr) => {
//       if (arr && arr.length) {
//         arr.forEach(v => newParams.append(key, v));
//       }
//     };

//     addArrayParam('brandIds', filters.brandIds);
//     addArrayParam('categoryIds', filters.categoryIds);
//     addArrayParam('skinTypes', filters.skinTypes);
//     addArrayParam('formulations', filters.formulations);
//     addArrayParam('finishes', filters.finishes);
//     addArrayParam('ingredients', filters.ingredients);

//     if (filters.priceRange) {
//       if (filters.priceRange.min !== undefined) newParams.set('minPrice', filters.priceRange.min);
//       if (filters.priceRange.max !== null && filters.priceRange.max !== undefined) newParams.set('maxPrice', filters.priceRange.max);
//     }
//     if (filters.discountRange) newParams.set('minDiscount', filters.discountRange.min);
//     if (filters.minRating) newParams.set('minRating', filters.minRating);
//     if (filters.sort !== 'recent') newParams.set('sort', filters.sort);

//     // Only update if the URL actually changed to avoid infinite loop
//     const currentQuery = searchParams.toString();
//     const newQuery = newParams.toString();
//     if (currentQuery !== newQuery) {
//       setSearchParams(newParams, { replace: true }); // replace to avoid pushing multiple entries
//     }
//   }, [filters, setSearchParams, searchParams]);

//   // Existing effect to fetch products when filters change
//   useEffect(() => {
//     fetchProducts(null, true);
//   }, [effectiveSlug, location.pathname, filters, activeCategorySlug]);

//   /* ── helpers ────────────────────────────────────────────────────────────── */
//   const pageDefault = location.pathname.includes("/category/") ? effectiveSlug : null;

//   const makeEmptyFilters = () => ({
//     brandIds: [], categoryIds: [], skinTypes: [], formulations: [],
//     finishes: [], ingredients: [], priceRange: null, discountRange: null,
//     minRating: "", sort: "recent",
//   });

//   /* ── CATEGORY PILL CLICK ────────────────────────────────────────────────── */
//   const handleCategoryPillClick = useCallback(
//     (cat) => {
//       if (activeCategorySlug === cat.slug) {
//         setActiveCategorySlug(pageDefault);
//         setActiveCategoryName(
//           pageDefault ? trendingCategories.find((c) => c.slug === pageDefault)?.name || "" : ""
//         );
//       } else {
//         setActiveCategorySlug(cat.slug);
//         setActiveCategoryName(cat.name);
//         setFilters(makeEmptyFilters());
//       }
//     },
//     [activeCategorySlug, pageDefault, trendingCategories]
//   );

//   const handleClearCategory = useCallback(() => {
//     setActiveCategorySlug(pageDefault);
//     setActiveCategoryName(
//       pageDefault ? trendingCategories.find((c) => c.slug === pageDefault)?.name || "" : ""
//     );
//     setFilters(makeEmptyFilters());
//   }, [pageDefault, trendingCategories]);

//   /* ── infinite scroll ────────────────────────────────────────────────────── */
//   const loadMore = useCallback(() => {
//     if (nextCursor && hasMore && !loadingMore) fetchProducts(nextCursor, false);
//   }, [nextCursor, hasMore, loadingMore]);

//   useEffect(() => {
//     if (!hasMore || loadingMore) return;
//     const obs = new IntersectionObserver(
//       ([e]) => e.isIntersecting && loadMore(),
//       { root: null, rootMargin: "100px", threshold: 0.1 }
//     );
//     const el = loaderRef.current;
//     if (el) obs.observe(el);
//     return () => el && obs.unobserve(el);
//   }, [loadMore, hasMore, loadingMore]);

//   /* ── cart ───────────────────────────────────────────────────────────────── */
//   const handleAddToCart = async (prod) => {
//     setAddingToCart((p) => ({ ...p, [prod._id]: true }));
//     try {
//       const vars   = Array.isArray(prod.variants) ? prod.variants : [];
//       const hasVar = vars.length > 0;
//       let payload;
//       if (hasVar) {
//         const sel = selectedVariants[prod._id];
//         if (!sel || sel.stock <= 0) { showToastMsg("Please select an in-stock variant.", "error"); return; }
//         payload = { productId: prod._id, variants: [{ variantSku: getSku(sel), quantity: 1 }] };
//         const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
//         cache[prod._id] = sel;
//         localStorage.setItem("cartVariantCache", JSON.stringify(cache));
//       } else {
//         if (prod.stock <= 0) { showToastMsg("Product is out of stock.", "error"); return; }
//         payload = { productId: prod._id, quantity: 1 };
//       }
//       const { data } = await axios.post(`${CART_API_BASE}/add`, payload, { withCredentials: true });
//       if (!data.success) throw new Error(data.message || "Cart add failed");
//       showToastMsg("Product added to cart!", "success");
//       navigate("/cartpage");
//     } catch (e) {
//       const msg = e.response?.data?.message || e.message || "Failed to add to cart";
//       showToastMsg(msg, "error");
//       if (e.response?.status === 401) navigate("/login", { state: { from: location.pathname } });
//     } finally {
//       setAddingToCart((p) => ({ ...p, [prod._id]: false }));
//     }
//   };

//   /* ── ui handlers ────────────────────────────────────────────────────────── */
//   const handleVariantSelect = (pid, v) => setSelectedVariants((p) => ({ ...p, [pid]: v }));
//   const openVariantOverlay  = (pid, t = "all") => { setSelectedVariantType(t); setShowVariantOverlay(pid); };
//   const closeVariantOverlay = () => { setShowVariantOverlay(null); setSelectedVariantType("all"); };
//   const getProductSlug      = (pr) => (pr.slugs?.[0] ? pr.slugs[0] : pr._id);

//   const isAnyFilterActive =
//     filters.brandIds.length > 0 || filters.categoryIds.length > 0 ||
//     filters.skinTypes.length > 0 || filters.formulations.length > 0 ||
//     filters.finishes.length > 0 || filters.ingredients.length > 0 ||
//     filters.priceRange || filters.discountRange || filters.minRating ||
//     filters.sort !== "recent" ||
//     (activeCategorySlug && activeCategorySlug !== pageDefault);

//   const handleClearAllFilters = () => {
//     setFilters(makeEmptyFilters());
//     setActiveCategorySlug(pageDefault);
//     setActiveCategoryName(
//       pageDefault ? trendingCategories.find((c) => c.slug === pageDefault)?.name || "" : ""
//     );
//   };

//   /* ── product card ───────────────────────────────────────────────────────── */
//   const renderProductCard = (prod) => {
//     const vars   = Array.isArray(prod.variants) ? prod.variants : [];
//     const hasVar = vars.length > 0;
//     const isVariantSelected = !!selectedVariants[prod._id];
//     const displayVariant = selectedVariants[prod._id] || (hasVar ? (vars.find((v) => v.stock > 0) || vars[0]) : null);
//     const grouped   = groupVariantsByType(vars);
//     const totalVars = vars.length;
//     const sku       = displayVariant ? getSku(displayVariant) : null;
//     const inWl      = sku ? isInWishlist(prod._id, sku) : false;
//     const slugPr    = getProductSlug(prod);
//     const img       = displayVariant?.images?.[0] || displayVariant?.image || prod.images?.[0] || "/placeholder.png";
//     const isAdding  = addingToCart[prod._id];
//     const oos       = hasVar ? displayVariant?.stock <= 0 : prod.stock <= 0;
//     const showSelectVariantButton = hasVar && !isVariantSelected;
//     const disabled  = isAdding || (!showSelectVariantButton && oos);
//     let btnText = "Add to Cart";
//     if (isAdding)                    btnText = "Adding...";
//     else if (showSelectVariantButton) btnText = "Select Variant";
//     else if (oos)                    btnText = "Out of Stock";

//     return (
//       <div key={prod._id} className="col-6 col-md-4 col-lg-4 position-relative page-title-main-name">
//         <button
//           onClick={() => { if (displayVariant || !hasVar) toggleWishlist(prod, displayVariant || {}); }}
//           disabled={wishlistLoading[prod._id]}
//           style={{
//             position: "absolute", top: 8, right: 8,
//             cursor: wishlistLoading[prod._id] ? "not-allowed" : "pointer",
//             color: inWl ? "#dc3545" : "#ccc", fontSize: 22, zIndex: 2,
//             backgroundColor: "rgba(255,255,255,.9)", borderRadius: "50%",
//             width: 34, height: 34, display: "flex", alignItems: "center",
//             justifyContent: "center", boxShadow: "0 2px 4px rgba(0,0,0,.1)",
//             transition: "all .3s ease", border: "none",
//           }}
//           title={inWl ? "Remove from wishlist" : "Add to wishlist"}
//         >
//           {wishlistLoading[prod._id]
//             ? <div className="spinner-border spinner-border-sm" role="status" />
//             : inWl ? <FaHeart /> : <FaRegHeart />}
//         </button>

//         <img src={img} alt={prod.name} className="card-img-top"
//           style={{ height: 200, objectFit: "contain", cursor: "pointer" }}
//           onClick={() => navigate(`/product/${slugPr}`)} />

//         <div className="card-body p-0 d-flex flex-column" style={{ height: 265 }}>
//           <div className="brand-name text-muted small mb-1 fw-medium mt-2 text-start">{getBrandName(prod)}</div>
//           <h5 className="card-title mt-2 align-items-center gap-1 page-title-main-name"
//             style={{ cursor: "pointer" }} onClick={() => navigate(`/product/${slugPr}`)}>
//             {prod.name}
//           </h5>

//           {hasVar && (
//             <div className="m-0 p-0 ms-0">
//               {isVariantSelected ? (
//                 <div className="text-muted small" style={{ cursor: "pointer", display: "inline-block" }}
//                   onClick={(e) => { e.stopPropagation(); openVariantOverlay(prod._id, "all"); }}
//                   title="Click to change variant">
//                   Variant: <span className="fw-bold text-dark">{getVariantDisplayText(displayVariant)}</span>
//                   <FaChevronDown className="ms-1" style={{ fontSize: "10px" }} />
//                 </div>
//               ) : (
//                 <div className="small text-muted" style={{ height: "20px", cursor: "pointer", display: "inline-block" }}
//                   onClick={(e) => { e.stopPropagation(); openVariantOverlay(prod._id, "all"); }}>
//                   {vars.length} Variants Available
//                   <FaChevronDown className="ms-1" style={{ fontSize: "10px" }} />
//                 </div>
//               )}
//             </div>
//           )}

//           <p className="fw-bold mb-3 mt-2 page-title-main-name" style={{ fontSize: 16 }}>
//             {(() => {
//               const price = displayVariant?.displayPrice || displayVariant?.discountedPrice || prod.price || 0;
//               const orig  = displayVariant?.originalPrice || displayVariant?.mrp || prod.mrp || price;
//               const disc  = orig > price;
//               const pct   = disc ? Math.round(((orig - price) / orig) * 100) : 0;
//               return disc ? (
//                 <>₹{price}
//                   <span style={{ textDecoration: "line-through", color: "#888", marginLeft: 8 }}>₹{orig}</span>
//                   <span style={{ color: "#e53e3e", marginLeft: 8, fontWeight: 600 }}>({pct}% OFF)</span>
//                 </>
//               ) : <>₹{orig}</>;
//             })()}
//           </p>

//           <div className="mt-3">
//             <button
//               className={`page-title-main-name add-to-cart-product-page w-100 d-flex align-items-center justify-content-center gap-2 ${isAdding ? "bg-black text-white" : ""}`}
//               onClick={(e) => { e.stopPropagation(); showSelectVariantButton ? openVariantOverlay(prod._id, "all") : handleAddToCart(prod); }}
//               disabled={disabled}
//               style={{ transition: "background-color .3s ease, color .3s ease" }}
//             >
//               {isAdding
//                 ? <><span className="spinner-border spinner-border-sm me-2" role="status" />Adding...</>
//                 : <>{btnText}{!disabled && !isAdding && !showSelectVariantButton && <img src={Bag} alt="Bag" style={{ height: 20 }} />}</>}
//             </button>
//           </div>
//         </div>

//         {/* Variant Overlay */}
//         {showVariantOverlay === prod._id && (
//           <div className="variant-overlay" style={{position:'absolute'}} onClick={closeVariantOverlay}>
//             <div className="variant-overlay-content w-100 p-0" onClick={(e) => e.stopPropagation()}
//               style={{ width: "90%", maxWidth: 500, maxHeight: "80vh", background: "#fff",overflow: "hidden", display: "flex", flexDirection: "column" }}>
//               <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
//                 <h5 className="m-0 page-title-main-name">Select Variant ({totalVars})</h5>
//                 <button onClick={closeVariantOverlay} style={{ background: "none", border: "none", fontSize: 24 }}>×</button>
//               </div>
//               <div className="variant-tabs d-flex">
//                 <button className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "all" ? "active" : ""}`} onClick={() => setSelectedVariantType("all")}>All ({totalVars})</button>
//                 {grouped.color.length > 0 && <button className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "color" ? "active" : ""}`} onClick={() => setSelectedVariantType("color")}>Colors ({grouped.color.length})</button>}
//                 {grouped.text.length > 0 && <button className={`variant-tab flex-fill py-3 ${selectedVariantType === "text" ? "active" : ""}`} onClick={() => setSelectedVariantType("text")}>Sizes ({grouped.text.length})</button>}
//               </div>
//               <div className="p-3 overflow-auto flex-grow-1 page-title-main-name">
//                 {(selectedVariantType === "all" || selectedVariantType === "color") && grouped.color.length > 0 && (
//                   <div className="row row-cols-4 g-3 mb-4">
//                     {grouped.color.map((v) => {
//                       const sel = selectedVariants[prod._id]?.sku === v.sku; const oosV = v.stock <= 0;
//                       return (
//                         <div className="col" key={v.sku || v._id}>
//                           <div className="text-center" style={{ cursor: oosV ? "not-allowed" : "pointer" }}
//                             onClick={() => !oosV && (handleVariantSelect(prod._id, v), closeVariantOverlay())}>
//                             <div style={{ width: 28, height: 28, borderRadius: "20%", backgroundColor: v.hex || "#ccc", margin: "0 auto 8px", border: sel ? "3px solid #000" : "1px solid #ddd", opacity: oosV ? 0.5 : 1, position: "relative" }}>
//                               {sel && <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", color: "#fff", fontWeight: "bold" }}>✓</span>}
//                             </div>
//                             <div className="small page-title-main-name" style={{ fontSize: "14px !important" }}>{getVariantDisplayText(v)}</div>
//                             {oosV && <div className="text-danger small">Out of Stock</div>}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//                 {(selectedVariantType === "all" || selectedVariantType === "text") && grouped.text.length > 0 && (
//                   <div className="row row-cols-3 g-3">
//                     {grouped.text.map((v) => {
//                       const sel = selectedVariants[prod._id]?.sku === v.sku; const oosV = v.stock <= 0;
//                       return (
//                         <div className="col" key={v.sku || v._id}>
//                           <div className="text-center" style={{ cursor: oosV ? "not-allowed" : "pointer" }}
//                             onClick={() => !oosV && (handleVariantSelect(prod._id, v), closeVariantOverlay())}>
//                             <div style={{ padding: 10, borderRadius: 8, border: sel ? "3px solid #000" : "1px solid #ddd", background: sel ? "#f8f9fa" : "#fff", minHeight: 50, display: "flex", alignItems: "center", justifyContent: "center", opacity: oosV ? 0.5 : 1 }}>
//                               {getVariantDisplayText(v)}
//                             </div>
//                             {oosV && <div className="text-danger small mt-1">Out of Stock</div>}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   /* ── shared BrandFilter props ────────────────────────────────────────────── */
//   const brandFilterProps = {
//     filters,
//     setFilters,
//     filterData,
//     trendingCategories,
//     activeCategorySlug,
//     activeCategoryName,
//     onClearCategory:     handleClearCategory,
//     onCategoryPillClick: handleCategoryPillClick,
//   };

//   /* ── render ─────────────────────────────────────────────────────────────── */
//   return (
//     <>
//       {loading && (
//         <div className="fullscreen-loader page-title-main-name">
//           <div className="spinner" /><p className="text-black">Loading products...</p>
//         </div>
//       )}
//       <Header />

//       <div className="banner-images text-center mt-xl-5 pt-xl-4">
//         <img src={bannerImage || "/banner-placeholder.jpg"} alt="Banner"
//           className="w-100 hero-slider-image-responsive"
//           style={{ maxHeight: 400, objectFit: "cover" }} />
//       </div>

//       {trendingCategories.length > 0 && (
//         <div className="container-lg mt-4">
//           <div className="d-flex overflow-auto py-2"
//             style={{ gap: "0.75rem", whiteSpace: "nowrap", scrollbarWidth: "none" }}>
//             {trendingCategories.map((cat) => {
//               const isActive = activeCategorySlug === cat.slug;
//               return (
//                 <button key={cat.slug}
//                   onClick={() => handleCategoryPillClick(cat)}
//                   className={`btn rounded-pill px-4 py-2 page-title-main-name flex-shrink-0 ${isActive ? "btn-dark" : "btn-outline-secondary"}`}
//                   style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, transition: "all 0.18s ease", transform: isActive ? "scale(1.04)" : "scale(1)" }}
//                   title={`Filter by ${cat.name}`}
//                 >
//                   {cat.name}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       <div className="container-lg py-4">
//         <h2 className="mb-4 d-none d-lg-block page-title-main-name">{pageTitle}</h2>

//         <div className="row">

//           <div className="d-none d-lg-block col-lg-3">
//             <BrandFilter {...brandFilterProps} />
//           </div>

//           <div className="d-lg-none mb-3">
//             <h2 className="mb-4 text-center">{pageTitle}</h2>
//             <div className="w-100 filter-responsive rounded shadow-sm">
//               <div className="container-fluid p-0">
//                 <div className="row g-0" style={{ flexDirection: "row-reverse" }}>
//                   <div className="col-6">
//                     <button className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
//                       onClick={() => setShowFilterOffcanvas(true)} style={{ gap: 12 }}>
//                       <img src={filtering} alt="Filter" style={{ width: 25 }} />
//                       <div className="text-start">
//                         <p className="mb-0 fs-6 fw-semibold page-title-main-name">Filter</p>
//                         <span className="text-muted small page-title-main-name">Tap to apply</span>
//                       </div>
//                     </button>
//                   </div>
//                   <div className="col-6 border-end">
//                     <button className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
//                       onClick={() => setShowSortOffcanvas(true)} style={{ gap: 12 }}>
//                       <img src={updownarrow} alt="Sort" style={{ width: 25 }} />
//                       <div className="text-start">
//                         <p className="mb-0 fs-6 fw-semibold page-title-main-name">Sort by</p>
//                         <span className="text-muted small">{filters.sort === "recent" ? "Relevance" : filters.sort}</span>
//                       </div>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {showFilterOffcanvas && (
//             <>
//               <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
//                 style={{ opacity: 0.5, zIndex: 1040 }} onClick={() => setShowFilterOffcanvas(false)} />
//               <div className="position-fixed start-0 bottom-0 w-100 bg-white"
//                 style={{ zIndex: 1050, borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: "85vh", boxShadow: "0 -4px 20px rgba(0,0,0,.2)" }}>
//                 <div className="text-center py-3 position-relative">
//                   <h5 className="mb-0 fw-bold">Filters</h5>
//                   <button className="btn-close position-absolute end-0 me-3"
//                     style={{ top: "50%", transform: "translateY(-50%)" }}
//                     onClick={() => setShowFilterOffcanvas(false)} />
//                   <div className="mx-auto mt-2 bg-secondary" style={{ height: 5, width: 50, borderRadius: 3 }} />
//                 </div>
//                 <div className="px-3 pb-4 overflow-auto" style={{ maxHeight: "70vh" }}>
//                   <BrandFilter
//                     {...brandFilterProps}
//                     onClose={() => setShowFilterOffcanvas(false)}
//                     onClearCategory={() => { handleClearCategory(); setShowFilterOffcanvas(false); }}
//                     onCategoryPillClick={(cat) => {
//                       handleCategoryPillClick(cat);
//                       setShowFilterOffcanvas(false);
//                     }}
//                   />
//                 </div>
//               </div>
//             </>
//           )}

//           {showSortOffcanvas && (
//             <>
//               <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
//                 style={{ opacity: 0.5, zIndex: 1040 }} onClick={() => setShowSortOffcanvas(false)} />
//               <div className="position-fixed start-0 bottom-0 w-100 bg-white"
//                 style={{ zIndex: 1050, borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: "60vh", boxShadow: "0 -4px 12px rgba(0,0,0,.15)" }}>
//                 <div className="text-center py-3 position-relative">
//                   <h5 className="mb-0 fw-bold page-title-main-name">Sort by</h5>
//                   <button className="btn-close position-absolute end-0 me-3"
//                     style={{ top: "50%", transform: "translateY(-50%)" }}
//                     onClick={() => setShowSortOffcanvas(false)} />
//                   <div className="mx-auto mt-2 bg-secondary" style={{ height: 5, width: 50, borderRadius: 3 }} />
//                 </div>
//                 <div className="px-4 pb-4">
//                   <div className="list-group">
//                     {[
//                       { value: "recent",         label: "Relevance" },
//                       { value: "priceHighToLow",  label: "Price High to Low" },
//                       { value: "priceLowToHigh",  label: "Price Low to High" },
//                     ].map(({ value, label }) => (
//                       <label key={value} className="list-group-item py-3 d-flex align-items-center">
//                         <input className="form-check-input me-3" type="radio" name="sort"
//                           checked={filters.sort === value}
//                           onChange={() => { setFilters((p) => ({ ...p, sort: value })); setShowSortOffcanvas(false); }} />
//                         <span className="page-title-main-name">{label}</span>
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}

//           <div className="col-12 col-lg-9">
//             <div className="mb-3 d-flex justify-content-between align-items-center">
//               <span className="text-muted page-title-main-name">
//                 {pageTitle || `Showing ${allProducts.length} products`}
//                 {hasMore && pageTitle && " (Scroll for more)"}
//               </span>
//               {isAnyFilterActive && (
//                 <button className="btn btn-sm btn-outline-danger" onClick={handleClearAllFilters}>
//                   Clear Filters
//                 </button>
//               )}
//             </div>

//             <div className="row g-4">
//               {allProducts.length > 0
//                 ? allProducts.map(renderProductCard)
//                 : <div className="col-12 text-center py-5"><h4>No products found</h4><p className="text-muted">Try adjusting your filters.</p></div>}
//             </div>

//             {loadingMore && (
//               <div className="text-center mt-4 py-4">
//                 <div className="spinner-border text-primary" role="status">
//                   <span className="visually-hidden">Loading more products...</span>
//                 </div>
//                 <p className="mt-2">Loading more products...</p>
//               </div>
//             )}

//             <div ref={loaderRef} style={{ height: 20, marginTop: 20 }} />

//             {!hasMore && allProducts.length > 0 && (
//               <div className="text-center mt-4 py-4 border-top">
//                 <p className="text-muted">🎉 You've reached the end! No more products to show.</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// }







// /* ProductPage – Unified API & Full Feature Edition with Multi-Filter Support */
// import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
// import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";
// import { FaStar, FaHeart, FaRegHeart, FaChevronDown } from "react-icons/fa";
// import Header from "./Header";
// import Footer from "./Footer";
// import { CartContext } from "../Context/CartContext";
// import { UserContext } from "./UserContext.jsx";
// import BrandFilter from "./BrandFilter";
// import "../css/ProductPage.css";
// import axios from "axios";
// import updownarrow from "../assets/updownarrow.svg";
// import filtering from "../assets/filtering.svg";
// import Bag from "../assets/Bag.svg";

// const CART_API_BASE   = "https://beauty.joyory.com/api/user/cart";
// const PRODUCT_ALL_API = "https://beauty.joyory.com/api/user/products/all";

// /* ─── helpers ───────────────────────────────────────────────────────────── */
// const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || "default"}`;

// const isValidHexColor = (hex) => {
//   if (!hex || typeof hex !== "string") return false;
//   return /^#([a-f0-9]{6}|[a-f0-9]{3})$/.test(hex.trim().toLowerCase());
// };

// const getVariantDisplayText = (v) =>
//   (v.shadeName || v.name || v.size || v.ml || v.weight || "Default").toUpperCase();

// const groupVariantsByType = (variants) => {
//   const g = { color: [], text: [] };
//   (variants || []).forEach((v) => {
//     if (!v) return;
//     v.hex && isValidHexColor(v.hex) ? g.color.push(v) : g.text.push(v);
//   });
//   return g;
// };

// const getBrandName = (p) => {
//   if (!p?.brand) return "Unknown Brand";
//   if (typeof p.brand === "object" && p.brand.name) return p.brand.name;
//   if (typeof p.brand === "string") return p.brand;
//   return "Unknown Brand";
// };

// export default function ProductPage() {
//   const { slug }              = useParams();
//   const { "*": categoryPath } = useParams();
//   const navigate              = useNavigate();
//   const location              = useLocation();
//   const [searchParams, setSearchParams] = useSearchParams();

//   let effectiveSlug = slug;
//   if (location.pathname.startsWith("/category/") && categoryPath) {
//     const segments = categoryPath.split("/");
//     effectiveSlug  = segments[segments.length - 1];
//   }

//   /* ── state ──────────────────────────────────────────────────────────────── */
//   const [allProducts,        setAllProducts]        = useState([]);
//   const [pageTitle,          setPageTitle]          = useState("Products");
//   const [bannerImage,        setBannerImage]        = useState("");

//   const [trendingCategories, setTrendingCategories] = useState([]);
//   const [shopBySkinTypes,    setShopBySkinTypes]    = useState([]);     // NEW
//   const [shopByIngredients,  setShopByIngredients]  = useState([]);     // NEW

//   const [filterData, setFilterData] = useState(null);

//   const [activeCategorySlug, setActiveCategorySlug] = useState(() =>
//     location.pathname.includes("/category/") && effectiveSlug ? effectiveSlug : null
//   );
//   const [activeCategoryName, setActiveCategoryName] = useState("");

//   const [selectedVariants, setSelectedVariants] = useState({});
//   const [addingToCart,     setAddingToCart]     = useState({});
//   const [loading,          setLoading]          = useState(true);
//   const [loadingMore,      setLoadingMore]      = useState(false);
//   const [hasMore,          setHasMore]          = useState(true);
//   const [nextCursor,       setNextCursor]       = useState(null);

//   const [wishlistLoading, setWishlistLoading] = useState({});
//   const [wishlistData,    setWishlistData]    = useState([]);

//   const [filters, setFilters] = useState({
//     brandIds:      [],
//     categoryIds:   [],
//     skinTypes:     [],
//     formulations:  [],
//     finishes:      [],
//     ingredients:   [],
//     priceRange:    null,
//     discountRange: null,
//     minRating:     "",
//     sort:          "recent",
//   });

//   const [showFilterOffcanvas, setShowFilterOffcanvas] = useState(false);
//   const [showSortOffcanvas,   setShowSortOffcanvas]   = useState(false);
//   const [showVariantOverlay,  setShowVariantOverlay]  = useState(null);
//   const [selectedVariantType, setSelectedVariantType] = useState("all");

//   const { user }  = useContext(UserContext);
//   const loaderRef = useRef(null);

//   const getPageContext = () => {
//     if (location.pathname.includes("/brand/"))    return "brand";
//     if (location.pathname.includes("/category/")) return "category";
//     if (location.pathname.includes("/skintype/")) return "skintype";
//     return "general";
//   };
//   const pageContext = getPageContext();

//   /* ── toast ──────────────────────────────────────────────────────────────── */
//   const showToastMsg = (msg, type = "error", dur = 3000) => {
//     const t = document.createElement("div");
//     t.className = `toast-notification toast-${type}`;
//     t.style.cssText = `
//       position:fixed;top:20px;right:20px;padding:12px 20px;
//       border-radius:8px;color:#fff;z-index:9999;
//       background:${type === "error" ? "#f56565" : "#48bb78"};
//       box-shadow:0 4px 12px rgba(0,0,0,.15);
//     `;
//     t.textContent = msg;
//     document.body.appendChild(t);
//     setTimeout(() => t.remove(), dur);
//   };

//   /* ── wishlist ───────────────────────────────────────────────────────────── */
//   const isInWishlist = (pid, sku) => {
//     if (!pid || !sku) return false;
//     return wishlistData.some((it) => (it.productId === pid || it._id === pid) && it.sku === sku);
//   };

//   const fetchWishlistData = async () => {
//     try {
//       if (user && !user.guest) {
//         const { data } = await axios.get("https://beauty.joyory.com/api/user/wishlist", { withCredentials: true });
//         if (data.success) setWishlistData(data.wishlist || []);
//       } else {
//         const local = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
//         setWishlistData(local.map((it) => ({ ...it, productId: it._id })));
//       }
//     } catch (e) { console.error(e); }
//   };

//   useEffect(() => { fetchWishlistData(); }, [user]);

//   const toggleWishlist = async (prod, variant) => {
//     if (!prod || !variant) return showToastMsg("Select a variant first", "error");
//     const pid = prod._id;
//     const sku = getSku(variant);
//     setWishlistLoading((p) => ({ ...p, [pid]: true }));
//     try {
//       const inWl = isInWishlist(pid, sku);
//       if (user && !user.guest) {
//         if (inWl) {
//           await axios.delete(`https://beauty.joyory.com/api/user/wishlist/${pid}`, { withCredentials: true, data: { sku } });
//           showToastMsg("Removed from wishlist!", "success");
//         } else {
//           await axios.post(`https://beauty.joyory.com/api/user/wishlist/${pid}`, { sku }, { withCredentials: true });
//           showToastMsg("Added to wishlist!", "success");
//         }
//         await fetchWishlistData();
//       } else {
//         let g = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
//         if (inWl) {
//           g = g.filter((it) => !(it._id === pid && it.sku === sku));
//           showToastMsg("Removed from wishlist!", "success");
//         } else {
//           g.push({
//             _id: pid, name: prod.name, brand: getBrandName(prod),
//             displayPrice: variant.displayPrice || variant.discountedPrice || prod.price,
//             originalPrice: variant.originalPrice || variant.mrp || prod.price,
//             image: variant.images?.[0] || prod.images?.[0],
//             sku, variantName: variant.shadeName || "Default", stock: variant.stock,
//           });
//           showToastMsg("Added to wishlist!", "success");
//         }
//         localStorage.setItem("guestWishlist", JSON.stringify(g));
//         await fetchWishlistData();
//       }
//     } catch (e) {
//       showToastMsg(e.response?.data?.message || "Wishlist error", "error");
//     } finally {
//       setWishlistLoading((p) => ({ ...p, [pid]: false }));
//     }
//   };

//   /* ── fetch products ─────────────────────────────────────────────────────── */
//   const buildQueryParams = (cursor = null) => {
//     const p    = new URLSearchParams();
//     const path = location.pathname.toLowerCase();

//     if (activeCategorySlug) {
//       p.append("categoryIds", activeCategorySlug);
//     } else if (path.includes("/category/")) {
//       p.append("categoryIds", effectiveSlug);
//     } else if (path.includes("/skintype/")) {
//       p.append("skinTypes", effectiveSlug);
//     } else if (path.includes("/promotion/")) {
//       p.append("promoSlug", effectiveSlug);
//     }

//     filters.brandIds?.forEach((id)  => p.append("brandIds",     id));
//     filters.categoryIds?.forEach((id) => p.append("categoryIds", id));
//     filters.skinTypes?.forEach((n)  => p.append("skinTypes",    n));
//     filters.formulations?.forEach((id) => p.append("formulations", id));
//     filters.finishes?.forEach((s)   => p.append("finishes",     s));
//     filters.ingredients?.forEach((s) => p.append("ingredients", s));
//     if (filters.minRating)    p.append("minRating",   filters.minRating);
//     if (filters.priceRange) {
//       p.append("minPrice", filters.priceRange.min);
//       if (filters.priceRange.max != null) p.append("maxPrice", filters.priceRange.max);
//     }
//     if (filters.discountRange) p.append("minDiscount", filters.discountRange.min);
//     if (filters.sort)          p.append("sort",        filters.sort);
//     if (cursor)                p.append("cursor",      cursor);
//     p.append("limit", "9");

//     const queryString = p.toString();
//     console.log("API Query →", `${PRODUCT_ALL_API}?${queryString}`);
//     return queryString;
//   };

//   const fetchProducts = async (cursor = null, reset = false) => {
//     try {
//       if (reset) {
//         setLoading(true);
//         setAllProducts([]);
//         setNextCursor(null);
//         setHasMore(true);
//       } else {
//         setLoadingMore(true);
//       }

//       const { data } = await axios.get(
//         `${PRODUCT_ALL_API}?${buildQueryParams(cursor)}`,
//         { withCredentials: true }
//       );

//       // title & banner
//       if (data.titleMessage)       setPageTitle(data.titleMessage);
//       else if (data.category?.name)  setPageTitle(data.category.name);
//       else if (data.promoMeta?.name) setPageTitle(data.promoMeta.name);
//       else if (data.skinType?.name)  setPageTitle(data.skinType.name);

//       if (data.bannerImage && Array.isArray(data.bannerImage)) {
//         setBannerImage(data.bannerImage[0]?.url || data.bannerImage[0] || "");
//       } else if (data.category?.bannerImage)  setBannerImage(data.category.bannerImage);
//       else if (data.promoMeta?.bannerImage)   setBannerImage(data.promoMeta.bannerImage);
//       else if (data.skinType?.bannerImage)    setBannerImage(data.skinType.bannerImage);

//       // NEW: Shop By Skin Types & Ingredients
//       if (data.skinTypes && Array.isArray(data.skinTypes)) {
//         setShopBySkinTypes(data.skinTypes);
//       }
//       if (data.shopByIngredients && Array.isArray(data.shopByIngredients)) {
//         setShopByIngredients(data.shopByIngredients);
//       }

//       if (data.trendingCategories && Array.isArray(data.trendingCategories)) {
//         setTrendingCategories(data.trendingCategories);
//         if (effectiveSlug && !activeCategoryName) {
//           const found = data.trendingCategories.find((c) => c.slug === effectiveSlug);
//           if (found) setActiveCategoryName(found.name);
//         }
//       } else {
//         setTrendingCategories([]);
//       }

//       if (data.category?.name && !activeCategoryName && effectiveSlug) {
//         setActiveCategoryName(data.category.name);
//       }

//       if (reset && data.filters) {
//         setFilterData(data.filters);
//       }

//       const prods = data.products || [];
//       const pg    = data.pagination || {};

//       if (reset) setAllProducts(prods);
//       else        setAllProducts((prev) => [...prev, ...prods]);

//       setHasMore(pg.hasMore || false);
//       setNextCursor(pg.nextCursor || null);
//     } catch (e) {
//       console.error(e);
//       showToastMsg("Failed to fetch products", "error");
//     } finally {
//       setLoading(false);
//       setLoadingMore(false);
//     }
//   };

//   // Sync active category when URL changes
//   useEffect(() => {
//     if (location.pathname.includes("/category/") && effectiveSlug) {
//       setActiveCategorySlug(effectiveSlug);
//     } else {
//       setActiveCategorySlug(null);
//       setActiveCategoryName("");
//     }
//   }, [effectiveSlug, location.pathname]);

//   /* ── Parse URL query parameters on mount ────────────────────────────── */
//   useEffect(() => {
//     const initialFilters = { ...filters };
//     let changed = false;

//     const getMultiParam = (key) => {
//       const values = searchParams.getAll(key);
//       if (values.length > 0) return values;
//       const comma = searchParams.get(key);
//       if (comma) return comma.split(',').map(s => s.trim()).filter(Boolean);
//       return [];
//     };

//     // Existing + new filters
//     ['ingredients', 'skinTypes', 'brandIds', 'categoryIds', 'formulations', 'finishes'].forEach(key => {
//       const param = getMultiParam(key);
//       if (param.length > 0) {
//         initialFilters[key] = param;
//         changed = true;
//       }
//     });

//     const minPrice = searchParams.get('minPrice');
//     const maxPrice = searchParams.get('maxPrice');
//     if (minPrice !== null || maxPrice !== null) {
//       initialFilters.priceRange = {
//         min: minPrice ? parseFloat(minPrice) : 0,
//         max: maxPrice ? parseFloat(maxPrice) : null,
//       };
//       changed = true;
//     }

//     const minDiscount = searchParams.get('minDiscount');
//     if (minDiscount !== null) {
//       initialFilters.discountRange = { min: parseFloat(minDiscount) };
//       changed = true;
//     }

//     const minRating = searchParams.get('minRating');
//     if (minRating !== null) {
//       initialFilters.minRating = minRating;
//       changed = true;
//     }

//     const sortParam = searchParams.get('sort');
//     if (sortParam !== null && ['recent', 'priceHighToLow', 'priceLowToHigh'].includes(sortParam)) {
//       initialFilters.sort = sortParam;
//       changed = true;
//     }

//     if (changed) {
//       setFilters(initialFilters);
//     }
//   }, []); // only once on mount

//   /* ── Sync URL query parameters when filters change ──────────────────── */
//   useEffect(() => {
//     const newParams = new URLSearchParams();

//     const addArrayParam = (key, arr) => {
//       if (arr && arr.length) {
//         arr.forEach(v => newParams.append(key, v));
//       }
//     };

//     addArrayParam('brandIds', filters.brandIds);
//     addArrayParam('categoryIds', filters.categoryIds);
//     addArrayParam('skinTypes', filters.skinTypes);
//     addArrayParam('formulations', filters.formulations);
//     addArrayParam('finishes', filters.finishes);
//     addArrayParam('ingredients', filters.ingredients);

//     if (filters.priceRange) {
//       if (filters.priceRange.min !== undefined) newParams.set('minPrice', filters.priceRange.min);
//       if (filters.priceRange.max != null && filters.priceRange.max !== undefined) newParams.set('maxPrice', filters.priceRange.max);
//     }
//     if (filters.discountRange) newParams.set('minDiscount', filters.discountRange.min);
//     if (filters.minRating) newParams.set('minRating', filters.minRating);
//     if (filters.sort !== 'recent') newParams.set('sort', filters.sort);

//     const currentQuery = searchParams.toString();
//     const newQuery = newParams.toString();
//     if (currentQuery !== newQuery) {
//       setSearchParams(newParams, { replace: true });
//     }
//   }, [filters, setSearchParams, searchParams]);

//   // Fetch products when filters or page context change
//   useEffect(() => {
//     fetchProducts(null, true);
//   }, [effectiveSlug, location.pathname, filters, activeCategorySlug]);

//   /* ── helpers ────────────────────────────────────────────────────────────── */
//   const pageDefault = location.pathname.includes("/category/") ? effectiveSlug : null;

//   const makeEmptyFilters = () => ({
//     brandIds: [], categoryIds: [], skinTypes: [], formulations: [],
//     finishes: [], ingredients: [], priceRange: null, discountRange: null,
//     minRating: "", sort: "recent",
//   });

//   /* ── CATEGORY PILL CLICK ────────────────────────────────────────────────── */
//   const handleCategoryPillClick = useCallback(
//     (cat) => {
//       if (activeCategorySlug === cat.slug) {
//         setActiveCategorySlug(pageDefault);
//         setActiveCategoryName(
//           pageDefault ? trendingCategories.find((c) => c.slug === pageDefault)?.name || "" : ""
//         );
//       } else {
//         setActiveCategorySlug(cat.slug);
//         setActiveCategoryName(cat.name);
//         setFilters(makeEmptyFilters());
//       }
//     },
//     [activeCategorySlug, pageDefault, trendingCategories]
//   );

//   const handleClearCategory = useCallback(() => {
//     setActiveCategorySlug(pageDefault);
//     setActiveCategoryName(
//       pageDefault ? trendingCategories.find((c) => c.slug === pageDefault)?.name || "" : ""
//     );
//     setFilters(makeEmptyFilters());
//   }, [pageDefault, trendingCategories]);

//   /* ── NEW: Skin Type & Ingredient Click Handlers ─────────────────────────── */
//   const handleSkinTypeClick = useCallback((skin) => {
//     setFilters(prev => {
//       const current = prev.skinTypes || [];
//       const isActive = current.includes(skin.slug);
//       return {
//         ...prev,
//         skinTypes: isActive 
//           ? current.filter(s => s !== skin.slug)
//           : [...current, skin.slug]
//       };
//     });
//   }, []);

//   const handleIngredientClick = useCallback((ing) => {
//     setFilters(prev => {
//       const current = prev.ingredients || [];
//       const isActive = current.includes(ing.slug);
//       return {
//         ...prev,
//         ingredients: isActive 
//           ? current.filter(i => i !== ing.slug)
//           : [...current, ing.slug]
//       };
//     });
//   }, []);

//   /* ── infinite scroll ────────────────────────────────────────────────────── */
//   const loadMore = useCallback(() => {
//     if (nextCursor && hasMore && !loadingMore) fetchProducts(nextCursor, false);
//   }, [nextCursor, hasMore, loadingMore]);

//   useEffect(() => {
//     if (!hasMore || loadingMore) return;
//     const obs = new IntersectionObserver(
//       ([e]) => e.isIntersecting && loadMore(),
//       { root: null, rootMargin: "100px", threshold: 0.1 }
//     );
//     const el = loaderRef.current;
//     if (el) obs.observe(el);
//     return () => el && obs.unobserve(el);
//   }, [loadMore, hasMore, loadingMore]);

//   /* ── cart ───────────────────────────────────────────────────────────────── */
//   const handleAddToCart = async (prod) => {
//     setAddingToCart((p) => ({ ...p, [prod._id]: true }));
//     try {
//       const vars   = Array.isArray(prod.variants) ? prod.variants : [];
//       const hasVar = vars.length > 0;
//       let payload;
//       if (hasVar) {
//         const sel = selectedVariants[prod._id];
//         if (!sel || sel.stock <= 0) { showToastMsg("Please select an in-stock variant.", "error"); return; }
//         payload = { productId: prod._id, variants: [{ variantSku: getSku(sel), quantity: 1 }] };
//         const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
//         cache[prod._id] = sel;
//         localStorage.setItem("cartVariantCache", JSON.stringify(cache));
//       } else {
//         if (prod.stock <= 0) { showToastMsg("Product is out of stock.", "error"); return; }
//         payload = { productId: prod._id, quantity: 1 };
//       }
//       const { data } = await axios.post(`${CART_API_BASE}/add`, payload, { withCredentials: true });
//       if (!data.success) throw new Error(data.message || "Cart add failed");
//       showToastMsg("Product added to cart!", "success");
//       navigate("/cartpage");
//     } catch (e) {
//       const msg = e.response?.data?.message || e.message || "Failed to add to cart";
//       showToastMsg(msg, "error");
//       if (e.response?.status === 401) navigate("/login", { state: { from: location.pathname } });
//     } finally {
//       setAddingToCart((p) => ({ ...p, [prod._id]: false }));
//     }
//   };

//   /* ── ui handlers ────────────────────────────────────────────────────────── */
//   const handleVariantSelect = (pid, v) => setSelectedVariants((p) => ({ ...p, [pid]: v }));
//   const openVariantOverlay  = (pid, t = "all") => { setSelectedVariantType(t); setShowVariantOverlay(pid); };
//   const closeVariantOverlay = () => { setShowVariantOverlay(null); setSelectedVariantType("all"); };
//   const getProductSlug      = (pr) => (pr.slugs?.[0] ? pr.slugs[0] : pr._id);

//   const isAnyFilterActive =
//     filters.brandIds.length > 0 || filters.categoryIds.length > 0 ||
//     filters.skinTypes.length > 0 || filters.formulations.length > 0 ||
//     filters.finishes.length > 0 || filters.ingredients.length > 0 ||
//     filters.priceRange || filters.discountRange || filters.minRating ||
//     filters.sort !== "recent" ||
//     (activeCategorySlug && activeCategorySlug !== pageDefault);

//   const handleClearAllFilters = () => {
//     setFilters(makeEmptyFilters());
//     setActiveCategorySlug(pageDefault);
//     setActiveCategoryName(
//       pageDefault ? trendingCategories.find((c) => c.slug === pageDefault)?.name || "" : ""
//     );
//   };

//   /* ── product card (unchanged) ───────────────────────────────────────────── */
//   const renderProductCard = (prod) => {
//     // ... (your existing renderProductCard code remains 100% unchanged)
//     const vars   = Array.isArray(prod.variants) ? prod.variants : [];
//     const hasVar = vars.length > 0;
//     const isVariantSelected = !!selectedVariants[prod._id];
//     const displayVariant = selectedVariants[prod._id] || (hasVar ? (vars.find((v) => v.stock > 0) || vars[0]) : null);
//     const grouped   = groupVariantsByType(vars);
//     const totalVars = vars.length;
//     const sku       = displayVariant ? getSku(displayVariant) : null;
//     const inWl      = sku ? isInWishlist(prod._id, sku) : false;
//     const slugPr    = getProductSlug(prod);
//     const img       = displayVariant?.images?.[0] || displayVariant?.image || prod.images?.[0] || "/placeholder.png";
//     const isAdding  = addingToCart[prod._id];
//     const oos       = hasVar ? displayVariant?.stock <= 0 : prod.stock <= 0;
//     const showSelectVariantButton = hasVar && !isVariantSelected;
//     const disabled  = isAdding || (!showSelectVariantButton && oos);
//     let btnText = "Add to Cart";
//     if (isAdding)                    btnText = "Adding...";
//     else if (showSelectVariantButton) btnText = "Select Variant";
//     else if (oos)                    btnText = "Out of Stock";

//     return (
//       <div key={prod._id} className="col-6 col-md-4 col-lg-4 position-relative page-title-main-name">
//         {/* ... your full product card JSX (wishlist, image, name, price, button, variant overlay) ... */}
//         {/* (kept identical to your original) */}
//         <button
//           onClick={() => { if (displayVariant || !hasVar) toggleWishlist(prod, displayVariant || {}); }}
//           disabled={wishlistLoading[prod._id]}
//           style={{
//             position: "absolute", top: 8, right: 8,
//             cursor: wishlistLoading[prod._id] ? "not-allowed" : "pointer",
//             color: inWl ? "#dc3545" : "#ccc", fontSize: 22, zIndex: 2,
//             backgroundColor: "rgba(255,255,255,.9)", borderRadius: "50%",
//             width: 34, height: 34, display: "flex", alignItems: "center",
//             justifyContent: "center", boxShadow: "0 2px 4px rgba(0,0,0,.1)",
//             transition: "all .3s ease", border: "none",
//           }}
//           title={inWl ? "Remove from wishlist" : "Add to wishlist"}
//         >
//           {wishlistLoading[prod._id]
//             ? <div className="spinner-border spinner-border-sm" role="status" />
//             : inWl ? <FaHeart /> : <FaRegHeart />}
//         </button>

//         <img src={img} alt={prod.name} className="card-img-top"
//           style={{ height: 200, objectFit: "contain", cursor: "pointer" }}
//           onClick={() => navigate(`/product/${slugPr}`)} />

//         <div className="card-body p-0 d-flex flex-column" style={{ height: 265 }}>
//           <div className="brand-name text-muted small mb-1 fw-medium mt-2 text-start">{getBrandName(prod)}</div>
//           <h5 className="card-title mt-2 align-items-center gap-1 page-title-main-name"
//             style={{ cursor: "pointer" }} onClick={() => navigate(`/product/${slugPr}`)}>
//             {prod.name}
//           </h5>

//           {hasVar && (
//             <div className="m-0 p-0 ms-0">
//               {isVariantSelected ? (
//                 <div className="text-muted small" style={{ cursor: "pointer", display: "inline-block" }}
//                   onClick={(e) => { e.stopPropagation(); openVariantOverlay(prod._id, "all"); }}
//                   title="Click to change variant">
//                   Variant: <span className="fw-bold text-dark">{getVariantDisplayText(displayVariant)}</span>
//                   <FaChevronDown className="ms-1" style={{ fontSize: "10px" }} />
//                 </div>
//               ) : (
//                 <div className="small text-muted" style={{ height: "20px", cursor: "pointer", display: "inline-block" }}
//                   onClick={(e) => { e.stopPropagation(); openVariantOverlay(prod._id, "all"); }}>
//                   {vars.length} Variants Available
//                   <FaChevronDown className="ms-1" style={{ fontSize: "10px" }} />
//                 </div>
//               )}
//             </div>
//           )}

//           <p className="fw-bold mb-3 mt-2 page-title-main-name" style={{ fontSize: 16 }}>
//             {(() => {
//               const price = displayVariant?.displayPrice || displayVariant?.discountedPrice || prod.price || 0;
//               const orig  = displayVariant?.originalPrice || displayVariant?.mrp || prod.mrp || price;
//               const disc  = orig > price;
//               const pct   = disc ? Math.round(((orig - price) / orig) * 100) : 0;
//               return disc ? (
//                 <>₹{price}
//                   <span style={{ textDecoration: "line-through", color: "#888", marginLeft: 8 }}>₹{orig}</span>
//                   <span style={{ color: "#e53e3e", marginLeft: 8, fontWeight: 600 }}>({pct}% OFF)</span>
//                 </>
//               ) : <>₹{orig}</>;
//             })()}
//           </p>

//           <div className="mt-3">
//             <button
//               className={`page-title-main-name add-to-cart-product-page w-100 d-flex align-items-center justify-content-center gap-2 ${isAdding ? "bg-black text-white" : ""}`}
//               onClick={(e) => { e.stopPropagation(); showSelectVariantButton ? openVariantOverlay(prod._id, "all") : handleAddToCart(prod); }}
//               disabled={disabled}
//               style={{ transition: "background-color .3s ease, color .3s ease" }}
//             >
//               {isAdding
//                 ? <><span className="spinner-border spinner-border-sm me-2" role="status" />Adding...</>
//                 : <>{btnText}{!disabled && !isAdding && !showSelectVariantButton && <img src={Bag} alt="Bag" style={{ height: 20 }} />}</>}
//             </button>
//           </div>
//         </div>

//         {/* Variant Overlay - unchanged */}
//         {showVariantOverlay === prod._id && (
//           <div className="variant-overlay" style={{position:'absolute'}} onClick={closeVariantOverlay}>
//             <div className="variant-overlay-content w-100 p-0" onClick={(e) => e.stopPropagation()}
//               style={{ width: "90%", maxWidth: 500, maxHeight: "80vh", background: "#fff",overflow: "hidden", display: "flex", flexDirection: "column" }}>
//               <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
//                 <h5 className="m-0 page-title-main-name">Select Variant ({totalVars})</h5>
//                 <button onClick={closeVariantOverlay} style={{ background: "none", border: "none", fontSize: 24 }}>×</button>
//               </div>
//               <div className="variant-tabs d-flex">
//                 <button className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "all" ? "active" : ""}`} onClick={() => setSelectedVariantType("all")}>All ({totalVars})</button>
//                 {grouped.color.length > 0 && <button className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "color" ? "active" : ""}`} onClick={() => setSelectedVariantType("color")}>Colors ({grouped.color.length})</button>}
//                 {grouped.text.length > 0 && <button className={`variant-tab flex-fill py-3 ${selectedVariantType === "text" ? "active" : ""}`} onClick={() => setSelectedVariantType("text")}>Sizes ({grouped.text.length})</button>}
//               </div>
//               <div className="p-3 overflow-auto flex-grow-1 page-title-main-name">
//                 {(selectedVariantType === "all" || selectedVariantType === "color") && grouped.color.length > 0 && (
//                   <div className="row row-cols-4 g-3 mb-4">
//                     {grouped.color.map((v) => {
//                       const sel = selectedVariants[prod._id]?.sku === v.sku; const oosV = v.stock <= 0;
//                       return (
//                         <div className="col" key={v.sku || v._id}>
//                           <div className="text-center" style={{ cursor: oosV ? "not-allowed" : "pointer" }}
//                             onClick={() => !oosV && (handleVariantSelect(prod._id, v), closeVariantOverlay())}>
//                             <div style={{ width: 28, height: 28, borderRadius: "20%", backgroundColor: v.hex || "#ccc", margin: "0 auto 8px", border: sel ? "3px solid #000" : "1px solid #ddd", opacity: oosV ? 0.5 : 1, position: "relative" }}>
//                               {sel && <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", color: "#fff", fontWeight: "bold" }}>✓</span>}
//                             </div>
//                             <div className="small page-title-main-name" style={{ fontSize: "14px !important" }}>{getVariantDisplayText(v)}</div>
//                             {oosV && <div className="text-danger small">Out of Stock</div>}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//                 {(selectedVariantType === "all" || selectedVariantType === "text") && grouped.text.length > 0 && (
//                   <div className="row row-cols-3 g-3">
//                     {grouped.text.map((v) => {
//                       const sel = selectedVariants[prod._id]?.sku === v.sku; const oosV = v.stock <= 0;
//                       return (
//                         <div className="col" key={v.sku || v._id}>
//                           <div className="text-center" style={{ cursor: oosV ? "not-allowed" : "pointer" }}
//                             onClick={() => !oosV && (handleVariantSelect(prod._id, v), closeVariantOverlay())}>
//                             <div style={{ padding: 10, borderRadius: 8, border: sel ? "3px solid #000" : "1px solid #ddd", background: sel ? "#f8f9fa" : "#fff", minHeight: 50, display: "flex", alignItems: "center", justifyContent: "center", opacity: oosV ? 0.5 : 1 }}>
//                               {getVariantDisplayText(v)}
//                             </div>
//                             {oosV && <div className="text-danger small mt-1">Out of Stock</div>}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   const brandFilterProps = {
//     filters,
//     setFilters,
//     filterData,
//     trendingCategories,
//     activeCategorySlug,
//     activeCategoryName,
//     onClearCategory:     handleClearCategory,
//     onCategoryPillClick: handleCategoryPillClick,
//   };

//   /* ── render ─────────────────────────────────────────────────────────────── */
//   return (
//     <>
//       {loading && (
//         <div className="fullscreen-loader page-title-main-name">
//           <div className="spinner" /><p className="text-black">Loading products...</p>
//         </div>
//       )}
//       <Header />

//       <div className="banner-images text-center mt-xl-5 pt-xl-4">
//         <img src={bannerImage || "/banner-placeholder.jpg"} alt="Banner"
//           className="w-100 hero-slider-image-responsive"
//           style={{ maxHeight: 400, objectFit: "cover" }} />
//       </div>

//       {/* Existing Trending Categories */}
//       {trendingCategories.length > 0 && (
//         <div className="container-lg mt-4">
//           <div className="d-flex overflow-auto py-2"
//             style={{ gap: "0.75rem", whiteSpace: "nowrap", scrollbarWidth: "none" }}>
//             {trendingCategories.map((cat) => {
//               const isActive = activeCategorySlug === cat.slug;
//               return (
//                 <button key={cat.slug}
//                   onClick={() => handleCategoryPillClick(cat)}
//                   className={`btn rounded-pill px-4 py-2 page-title-main-name flex-shrink-0 ${isActive ? "btn-dark" : "btn-outline-secondary"}`}
//                   style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, transition: "all 0.18s ease", transform: isActive ? "scale(1.04)" : "scale(1)" }}
//                   title={`Filter by ${cat.name}`}
//                 >
//                   {cat.name}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {/* NEW: Shop By Skin Types */}
//       {shopBySkinTypes.length > 0 && (
//         <div className="container-lg mt-3">
//           <h5 className="mb-2 page-title-main-name">Shop by Skin Type</h5>
//           <div className="d-flex overflow-auto py-2"
//             style={{ gap: "0.75rem", whiteSpace: "nowrap", scrollbarWidth: "none" }}>
//             {shopBySkinTypes.map((skin) => {
//               const isActive = filters.skinTypes.includes(skin.slug);
//               return (
//                 <button
//                   key={skin.slug}
//                   onClick={() => handleSkinTypeClick(skin)}
//                   className={`btn rounded-pill px-4 py-2 page-title-main-name flex-shrink-0 ${isActive ? "btn-dark" : "btn-outline-secondary"}`}
//                   style={{ fontSize: 13, fontWeight: isActive ? 600 : 400 }}
//                 >
//                   {skin.name}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {/* NEW: Shop By Ingredients */}
//       {shopByIngredients.length > 0 && (
//         <div className="container-lg mt-3">
//           <h5 className="mb-2 page-title-main-name">Shop by Ingredients</h5>
//           <div className="d-flex overflow-auto py-2"
//             style={{ gap: "0.75rem", whiteSpace: "nowrap", scrollbarWidth: "none" }}>
//             {shopByIngredients.map((ing) => {
//               const isActive = filters.ingredients.includes(ing.slug);
//               return (
//                 <button
//                   key={ing.slug}
//                   onClick={() => handleIngredientClick(ing)}
//                   className={`btn rounded-pill px-4 py-2 page-title-main-name flex-shrink-0 ${isActive ? "btn-dark" : "btn-outline-secondary"}`}
//                   style={{ fontSize: 13, fontWeight: isActive ? 600 : 400 }}
//                 >
//                   {ing.name}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       <div className="container-lg py-4">
//         <h2 className="mb-4 d-none d-lg-block page-title-main-name">{pageTitle}</h2>

//         <div className="row">
//           {/* Sidebar & Mobile Offcanvas remain unchanged */}
//           <div className="d-none d-lg-block col-lg-3">
//             <BrandFilter {...brandFilterProps} />
//           </div>

//           {/* Mobile filter/sort buttons - unchanged */}
//           <div className="d-lg-none mb-3">
//             <h2 className="mb-4 text-center">{pageTitle}</h2>
//             <div className="w-100 filter-responsive rounded shadow-sm">
//               <div className="container-fluid p-0">
//                 <div className="row g-0" style={{ flexDirection: "row-reverse" }}>
//                   <div className="col-6">
//                     <button className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
//                       onClick={() => setShowFilterOffcanvas(true)} style={{ gap: 12 }}>
//                       <img src={filtering} alt="Filter" style={{ width: 25 }} />
//                       <div className="text-start">
//                         <p className="mb-0 fs-6 fw-semibold page-title-main-name">Filter</p>
//                         <span className="text-muted small page-title-main-name">Tap to apply</span>
//                       </div>
//                     </button>
//                   </div>
//                   <div className="col-6 border-end">
//                     <button className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
//                       onClick={() => setShowSortOffcanvas(true)} style={{ gap: 12 }}>
//                       <img src={updownarrow} alt="Sort" style={{ width: 25 }} />
//                       <div className="text-start">
//                         <p className="mb-0 fs-6 fw-semibold page-title-main-name">Sort by</p>
//                         <span className="text-muted small">{filters.sort === "recent" ? "Relevance" : filters.sort}</span>
//                       </div>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Offcanvas components remain unchanged */}
//           {showFilterOffcanvas && (
//             <>
//               <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
//                 style={{ opacity: 0.5, zIndex: 1040 }} onClick={() => setShowFilterOffcanvas(false)} />
//               <div className="position-fixed start-0 bottom-0 w-100 bg-white"
//                 style={{ zIndex: 1050, borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: "85vh", boxShadow: "0 -4px 20px rgba(0,0,0,.2)" }}>
//                 <div className="text-center py-3 position-relative">
//                   <h5 className="mb-0 fw-bold">Filters</h5>
//                   <button className="btn-close position-absolute end-0 me-3"
//                     style={{ top: "50%", transform: "translateY(-50%)" }}
//                     onClick={() => setShowFilterOffcanvas(false)} />
//                   <div className="mx-auto mt-2 bg-secondary" style={{ height: 5, width: 50, borderRadius: 3 }} />
//                 </div>
//                 <div className="px-3 pb-4 overflow-auto" style={{ maxHeight: "70vh" }}>
//                   <BrandFilter
//                     {...brandFilterProps}
//                     onClose={() => setShowFilterOffcanvas(false)}
//                     onClearCategory={() => { handleClearCategory(); setShowFilterOffcanvas(false); }}
//                     onCategoryPillClick={(cat) => {
//                       handleCategoryPillClick(cat);
//                       setShowFilterOffcanvas(false);
//                     }}
//                   />
//                 </div>
//               </div>
//             </>
//           )}

//           {showSortOffcanvas && (
//             <>
//               <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
//                 style={{ opacity: 0.5, zIndex: 1040 }} onClick={() => setShowSortOffcanvas(false)} />
//               <div className="position-fixed start-0 bottom-0 w-100 bg-white"
//                 style={{ zIndex: 1050, borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: "60vh", boxShadow: "0 -4px 12px rgba(0,0,0,.15)" }}>
//                 <div className="text-center py-3 position-relative">
//                   <h5 className="mb-0 fw-bold page-title-main-name">Sort by</h5>
//                   <button className="btn-close position-absolute end-0 me-3"
//                     style={{ top: "50%", transform: "translateY(-50%)" }}
//                     onClick={() => setShowSortOffcanvas(false)} />
//                   <div className="mx-auto mt-2 bg-secondary" style={{ height: 5, width: 50, borderRadius: 3 }} />
//                 </div>
//                 <div className="px-4 pb-4">
//                   <div className="list-group">
//                     {[
//                       { value: "recent",         label: "Relevance" },
//                       { value: "priceHighToLow",  label: "Price High to Low" },
//                       { value: "priceLowToHigh",  label: "Price Low to High" },
//                     ].map(({ value, label }) => (
//                       <label key={value} className="list-group-item py-3 d-flex align-items-center">
//                         <input className="form-check-input me-3" type="radio" name="sort"
//                           checked={filters.sort === value}
//                           onChange={() => { setFilters((p) => ({ ...p, sort: value })); setShowSortOffcanvas(false); }} />
//                         <span className="page-title-main-name">{label}</span>
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}

//           <div className="col-12 col-lg-9">
//             <div className="mb-3 d-flex justify-content-between align-items-center">
//               <span className="text-muted page-title-main-name">
//                 {pageTitle || `Showing ${allProducts.length} products`}
//                 {hasMore && pageTitle && " (Scroll for more)"}
//               </span>
//               {isAnyFilterActive && (
//                 <button className="btn btn-sm btn-outline-danger" onClick={handleClearAllFilters}>
//                   Clear Filters
//                 </button>
//               )}
//             </div>

//             <div className="row g-4">
//               {allProducts.length > 0
//                 ? allProducts.map(renderProductCard)
//                 : <div className="col-12 text-center py-5"><h4>No products found</h4><p className="text-muted">Try adjusting your filters.</p></div>}
//             </div>

//             {loadingMore && (
//               <div className="text-center mt-4 py-4">
//                 <div className="spinner-border text-primary" role="status">
//                   <span className="visually-hidden">Loading more products...</span>
//                 </div>
//                 <p className="mt-2">Loading more products...</p>
//               </div>
//             )}

//             <div ref={loaderRef} style={{ height: 20, marginTop: 20 }} />

//             {!hasMore && allProducts.length > 0 && (
//               <div className="text-center mt-4 py-4 border-top">
//                 <p className="text-muted">🎉 You've reached the end! No more products to show.</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// }














// /* ProductPage – Unified API & Full Feature Edition with Multi-Filter Support */
// import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
// import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";
// import { FaStar, FaHeart, FaRegHeart, FaChevronDown } from "react-icons/fa";
// import Header from "./Header";
// import Footer from "./Footer";
// import { CartContext } from "../Context/CartContext";
// import { UserContext } from "./UserContext.jsx";
// import BrandFilter from "./BrandFilter";
// import "../css/ProductPage.css";
// import axios from "axios";
// import updownarrow from "../assets/updownarrow.svg";
// import filtering from "../assets/filtering.svg";
// import Bag from "../assets/Bag.svg";

// const CART_API_BASE = "https://beauty.joyory.com/api/user/cart";
// const PRODUCT_ALL_API = "https://beauty.joyory.com/api/user/products/all";

// /* ─── helpers ───────────────────────────────────────────────────────────── */
// const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || "default"}`;

// const isValidHexColor = (hex) => {
//   if (!hex || typeof hex !== "string") return false;
//   return /^#([a-f0-9]{6}|[a-f0-9]{3})$/.test(hex.trim().toLowerCase());
// };

// const getVariantDisplayText = (v) =>
//   (v.shadeName || v.name || v.size || v.ml || v.weight || "Default").toUpperCase();

// const groupVariantsByType = (variants) => {
//   const g = { color: [], text: [] };
//   (variants || []).forEach((v) => {
//     if (!v) return;
//     v.hex && isValidHexColor(v.hex) ? g.color.push(v) : g.text.push(v);
//   });
//   return g;
// };

// const getBrandName = (p) => {
//   if (!p?.brand) return "Unknown Brand";
//   if (typeof p.brand === "object" && p.brand.name) return p.brand.name;
//   if (typeof p.brand === "string") return p.brand;
//   return "Unknown Brand";
// };

// export default function ProductPage() {
//   const { slug } = useParams();
//   const { "*": categoryPath } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [searchParams, setSearchParams] = useSearchParams();

//   let effectiveSlug = slug;
//   if (location.pathname.startsWith("/category/") && categoryPath) {
//     const segments = categoryPath.split("/");
//     effectiveSlug = segments[segments.length - 1];
//   }

//   /* ── state ──────────────────────────────────────────────────────────────── */
//   const [allProducts, setAllProducts] = useState([]);
//   const [pageTitle, setPageTitle] = useState("Products");
//   const [bannerImage, setBannerImage] = useState("");

//   const [trendingCategories, setTrendingCategories] = useState([]);
//   const [shopBySkinTypes, setShopBySkinTypes] = useState([]);
//   const [shopByIngredients, setShopByIngredients] = useState([]);
//   const [promotions, setPromotions] = useState([]);        // NEW: Promotions

//   const [filterData, setFilterData] = useState(null);

//   const [activeCategorySlug, setActiveCategorySlug] = useState(() =>
//     location.pathname.includes("/category/") && effectiveSlug ? effectiveSlug : null
//   );
//   const [activeCategoryName, setActiveCategoryName] = useState("");

//   const [selectedVariants, setSelectedVariants] = useState({});
//   const [addingToCart, setAddingToCart] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [nextCursor, setNextCursor] = useState(null);

//   const [wishlistLoading, setWishlistLoading] = useState({});
//   const [wishlistData, setWishlistData] = useState([]);

//   const [filters, setFilters] = useState({
//     brandIds: [],
//     categoryIds: [],
//     skinTypes: [],
//     formulations: [],
//     finishes: [],
//     ingredients: [],
//     priceRange: null,
//     discountRange: null,
//     minRating: "",
//     sort: "recent",
//   });

//   const [showFilterOffcanvas, setShowFilterOffcanvas] = useState(false);
//   const [showSortOffcanvas, setShowSortOffcanvas] = useState(false);
//   const [showVariantOverlay, setShowVariantOverlay] = useState(null);
//   const [selectedVariantType, setSelectedVariantType] = useState("all");

//   const { user } = useContext(UserContext);
//   const loaderRef = useRef(null);

//   /* ── toast ──────────────────────────────────────────────────────────────── */
//   const showToastMsg = (msg, type = "error", dur = 3000) => {
//     const t = document.createElement("div");
//     t.className = `toast-notification toast-${type}`;
//     t.style.cssText = `
//       position:fixed;top:20px;right:20px;padding:12px 20px;
//       border-radius:8px;color:#fff;z-index:9999;
//       background:${type === "error" ? "#f56565" : "#48bb78"};
//       box-shadow:0 4px 12px rgba(0,0,0,.15);
//     `;
//     t.textContent = msg;
//     document.body.appendChild(t);
//     setTimeout(() => t.remove(), dur);
//   };

//   /* ── wishlist ───────────────────────────────────────────────────────────── */
//   const isInWishlist = (pid, sku) => {
//     if (!pid || !sku) return false;
//     return wishlistData.some((it) => (it.productId === pid || it._id === pid) && it.sku === sku);
//   };

//   const fetchWishlistData = async () => {
//     try {
//       if (user && !user.guest) {
//         const { data } = await axios.get("https://beauty.joyory.com/api/user/wishlist", { withCredentials: true });
//         if (data.success) setWishlistData(data.wishlist || []);
//       } else {
//         const local = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
//         setWishlistData(local.map((it) => ({ ...it, productId: it._id })));
//       }
//     } catch (e) { console.error(e); }
//   };

//   useEffect(() => { fetchWishlistData(); }, [user]);

//   const toggleWishlist = async (prod, variant) => {
//     if (!prod || !variant) return showToastMsg("Select a variant first", "error");
//     const pid = prod._id;
//     const sku = getSku(variant);
//     setWishlistLoading((p) => ({ ...p, [pid]: true }));
//     try {
//       const inWl = isInWishlist(pid, sku);
//       if (user && !user.guest) {
//         if (inWl) {
//           await axios.delete(`https://beauty.joyory.com/api/user/wishlist/${pid}`, { withCredentials: true, data: { sku } });
//           showToastMsg("Removed from wishlist!", "success");
//         } else {
//           await axios.post(`https://beauty.joyory.com/api/user/wishlist/${pid}`, { sku }, { withCredentials: true });
//           showToastMsg("Added to wishlist!", "success");
//         }
//         await fetchWishlistData();
//       } else {
//         let g = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
//         if (inWl) {
//           g = g.filter((it) => !(it._id === pid && it.sku === sku));
//           showToastMsg("Removed from wishlist!", "success");
//         } else {
//           g.push({
//             _id: pid, name: prod.name, brand: getBrandName(prod),
//             displayPrice: variant.displayPrice || variant.discountedPrice || prod.price,
//             originalPrice: variant.originalPrice || variant.mrp || prod.price,
//             image: variant.images?.[0] || prod.images?.[0],
//             sku, variantName: variant.shadeName || "Default", stock: variant.stock,
//           });
//           showToastMsg("Added to wishlist!", "success");
//         }
//         localStorage.setItem("guestWishlist", JSON.stringify(g));
//         await fetchWishlistData();
//       }
//     } catch (e) {
//       showToastMsg(e.response?.data?.message || "Wishlist error", "error");
//     } finally {
//       setWishlistLoading((p) => ({ ...p, [pid]: false }));
//     }
//   };

//   /* ── fetch products ─────────────────────────────────────────────────────── */
//   const buildQueryParams = (cursor = null) => {
//     const p = new URLSearchParams();
//     const path = location.pathname.toLowerCase();

//     if (activeCategorySlug) {
//       p.append("categoryIds", activeCategorySlug);
//     } else if (path.includes("/category/")) {
//       p.append("categoryIds", effectiveSlug);
//     } else if (path.includes("/skintype/")) {
//       p.append("skinTypes", effectiveSlug);
//     } else if (path.includes("/promotion/")) {
//       p.append("promoSlug", effectiveSlug);
//     }

//     filters.brandIds?.forEach((id) => p.append("brandIds", id));
//     filters.categoryIds?.forEach((id) => p.append("categoryIds", id));
//     filters.skinTypes?.forEach((n) => p.append("skinTypes", n));
//     filters.formulations?.forEach((id) => p.append("formulations", id));
//     filters.finishes?.forEach((s) => p.append("finishes", s));
//     filters.ingredients?.forEach((s) => p.append("ingredients", s));
//     if (filters.minRating) p.append("minRating", filters.minRating);
//     if (filters.priceRange) {
//       p.append("minPrice", filters.priceRange.min);
//       if (filters.priceRange.max != null) p.append("maxPrice", filters.priceRange.max);
//     }
//     if (filters.discountRange) p.append("minDiscount", filters.discountRange.min);
//     if (filters.sort) p.append("sort", filters.sort);
//     if (cursor) p.append("cursor", cursor);
//     p.append("limit", "9");

//     const queryString = p.toString();
//     console.log("API Query →", `${PRODUCT_ALL_API}?${queryString}`);
//     return queryString;
//   };

//   const fetchProducts = async (cursor = null, reset = false) => {
//     try {
//       if (reset) {
//         setLoading(true);
//         setAllProducts([]);
//         setNextCursor(null);
//         setHasMore(true);
//       } else {
//         setLoadingMore(true);
//       }

//       const { data } = await axios.get(
//         `${PRODUCT_ALL_API}?${buildQueryParams(cursor)}`,
//         { withCredentials: true }
//       );

//       // title & banner
//       if (data.titleMessage) setPageTitle(data.titleMessage);
//       else if (data.category?.name) setPageTitle(data.category.name);
//       else if (data.promoMeta?.name) setPageTitle(data.promoMeta.name);
//       else if (data.skinType?.name) setPageTitle(data.skinType.name);

//       if (data.bannerImage && Array.isArray(data.bannerImage)) {
//         setBannerImage(data.bannerImage[0]?.url || data.bannerImage[0] || "");
//       } else if (data.category?.bannerImage) setBannerImage(data.category.bannerImage);
//       else if (data.promoMeta?.bannerImage) setBannerImage(data.promoMeta.bannerImage);
//       else if (data.skinType?.bannerImage) setBannerImage(data.skinType.bannerImage);

//       // Shop By Sections
//       if (data.skinTypes && Array.isArray(data.skinTypes)) {
//         setShopBySkinTypes(data.skinTypes);
//       }
//       if (data.shopByIngredients && Array.isArray(data.shopByIngredients)) {
//         setShopByIngredients(data.shopByIngredients);
//       }
//       if (data.promotions && Array.isArray(data.promotions)) {
//         setPromotions(data.promotions);
//       }

//       if (data.trendingCategories && Array.isArray(data.trendingCategories)) {
//         setTrendingCategories(data.trendingCategories);
//         if (effectiveSlug && !activeCategoryName) {
//           const found = data.trendingCategories.find((c) => c.slug === effectiveSlug);
//           if (found) setActiveCategoryName(found.name);
//         }
//       } else {
//         setTrendingCategories([]);
//       }

//       // if (data.category?.name && !activeCategoryName && effectiveSlug) {
//       //   setActiveCategoryName(data.category.name);
//       // }


//       if (data.category?.name && !activeCategoryName && effectiveSlug) {
//         setActiveCategoryName(data.category.name);
//       }

//       if (reset && data.filters) {
//         setFilterData(data.filters);
//       }

//       const prods = data.products || [];
//       const pg = data.pagination || {};

//       if (reset) setAllProducts(prods);
//       else setAllProducts((prev) => [...prev, ...prods]);

//       setHasMore(pg.hasMore || false);
//       setNextCursor(pg.nextCursor || null);
//     } catch (e) {
//       console.error(e);
//       showToastMsg("Failed to fetch products", "error");
//     } finally {
//       setLoading(false);
//       setLoadingMore(false);
//     }
//   };

//   // Sync active category when URL changes
//   // useEffect(() => {
//   //   if (location.pathname.includes("/category/") && effectiveSlug) {
//   //     setActiveCategorySlug(effectiveSlug);
//   //   } else {
//   //     setActiveCategorySlug(null);
//   //     setActiveCategoryName("");
//   //   }
//   // }, [effectiveSlug, location.pathname]);



//   useEffect(() => {
//     if (location.pathname.includes("/category/") && effectiveSlug) {
//       setActiveCategorySlug(effectiveSlug);
//       // Try to get the name from trendingCategories if already loaded
//       if (trendingCategories.length > 0) {
//         const found = trendingCategories.find(c => c.slug === effectiveSlug);
//         if (found) setActiveCategoryName(found.name);
//       }
//     } else {
//       setActiveCategorySlug(null);
//       setActiveCategoryName("");
//     }
//   }, [effectiveSlug, location.pathname, trendingCategories]);

//   /* ── Parse URL query parameters on mount ────────────────────────────── */
//   useEffect(() => {
//     const initialFilters = { ...filters };
//     let changed = false;

//     const getMultiParam = (key) => {
//       const values = searchParams.getAll(key);
//       if (values.length > 0) return values;
//       const comma = searchParams.get(key);
//       if (comma) return comma.split(',').map(s => s.trim()).filter(Boolean);
//       return [];
//     };

//     ['ingredients', 'skinTypes', 'brandIds', 'categoryIds', 'formulations', 'finishes'].forEach(key => {
//       const param = getMultiParam(key);
//       if (param.length > 0) {
//         initialFilters[key] = param;
//         changed = true;
//       }
//     });

//     const minPrice = searchParams.get('minPrice');
//     const maxPrice = searchParams.get('maxPrice');
//     if (minPrice !== null || maxPrice !== null) {
//       initialFilters.priceRange = {
//         min: minPrice ? parseFloat(minPrice) : 0,
//         max: maxPrice ? parseFloat(maxPrice) : null,
//       };
//       changed = true;
//     }

//     const minDiscount = searchParams.get('minDiscount');
//     if (minDiscount !== null) {
//       initialFilters.discountRange = { min: parseFloat(minDiscount) };
//       changed = true;
//     }

//     const minRating = searchParams.get('minRating');
//     if (minRating !== null) {
//       initialFilters.minRating = minRating;
//       changed = true;
//     }

//     const sortParam = searchParams.get('sort');
//     if (sortParam !== null && ['recent', 'priceHighToLow', 'priceLowToHigh'].includes(sortParam)) {
//       initialFilters.sort = sortParam;
//       changed = true;
//     }

//     if (changed) {
//       setFilters(initialFilters);
//     }
//   }, []);

//   /* ── Sync URL query parameters when filters change ──────────────────── */
//   useEffect(() => {
//     const newParams = new URLSearchParams();

//     const addArrayParam = (key, arr) => {
//       if (arr && arr.length) arr.forEach(v => newParams.append(key, v));
//     };

//     addArrayParam('brandIds', filters.brandIds);
//     addArrayParam('categoryIds', filters.categoryIds);
//     addArrayParam('skinTypes', filters.skinTypes);
//     addArrayParam('formulations', filters.formulations);
//     addArrayParam('finishes', filters.finishes);
//     addArrayParam('ingredients', filters.ingredients);

//     if (filters.priceRange) {
//       if (filters.priceRange.min !== undefined) newParams.set('minPrice', filters.priceRange.min);
//       if (filters.priceRange.max != null) newParams.set('maxPrice', filters.priceRange.max);
//     }
//     if (filters.discountRange) newParams.set('minDiscount', filters.discountRange.min);
//     if (filters.minRating) newParams.set('minRating', filters.minRating);
//     if (filters.sort !== 'recent') newParams.set('sort', filters.sort);

//     const currentQuery = searchParams.toString();
//     const newQuery = newParams.toString();
//     if (currentQuery !== newQuery) {
//       setSearchParams(newParams, { replace: true });
//     }
//   }, [filters, setSearchParams, searchParams]);

//   // Fetch products when filters or page context change
//   useEffect(() => {
//     fetchProducts(null, true);
//   }, [effectiveSlug, location.pathname, filters, activeCategorySlug]);

//   /* ── helpers ────────────────────────────────────────────────────────────── */
//   const pageDefault = location.pathname.includes("/category/") ? effectiveSlug : null;

//   const makeEmptyFilters = () => ({
//     brandIds: [], categoryIds: [], skinTypes: [], formulations: [],
//     finishes: [], ingredients: [], priceRange: null, discountRange: null,
//     minRating: "", sort: "recent",
//   });

//   /* ── CATEGORY PILL CLICK ────────────────────────────────────────────────── */
//   // const handleCategoryPillClick = useCallback((cat) => {
//   //   if (activeCategorySlug === cat.slug) {
//   //     setActiveCategorySlug(pageDefault);
//   //     setActiveCategoryName(pageDefault ? trendingCategories.find((c) => c.slug === pageDefault)?.name || "" : "");
//   //   } else {
//   //     setActiveCategorySlug(cat.slug);
//   //     setActiveCategoryName(cat.name);
//   //     setFilters(makeEmptyFilters());
//   //   }
//   // }, [activeCategorySlug, pageDefault, trendingCategories]);





//   const handleCategoryPillClick = useCallback((cat) => {
//     if (activeCategorySlug === cat.slug) {
//       setActiveCategorySlug(pageDefault);
//       setActiveCategoryName(pageDefault ? trendingCategories.find((c) => c.slug === pageDefault)?.name || "" : "");
//     } else {
//       setActiveCategorySlug(cat.slug);
//       setActiveCategoryName(cat.name); // Already correct
//       setFilters(makeEmptyFilters());
//     }
//   }, [activeCategorySlug, pageDefault, trendingCategories]);




//   const handleClearCategory = useCallback(() => {
//     setActiveCategorySlug(pageDefault);
//     setActiveCategoryName(pageDefault ? trendingCategories.find((c) => c.slug === pageDefault)?.name || "" : "");
//     setFilters(makeEmptyFilters());
//   }, [pageDefault, trendingCategories]);

//   /* ── Click Handlers ─────────────────────────────────────────────────────── */
//   const handleSkinTypeClick = useCallback((skin) => {
//     setFilters(prev => {
//       const current = prev.skinTypes || [];
//       const isActive = current.includes(skin.slug);
//       return {
//         ...prev,
//         skinTypes: isActive ? current.filter(s => s !== skin.slug) : [...current, skin.slug]
//       };
//     });
//   }, []);

//   const handleIngredientClick = useCallback((ing) => {
//     setFilters(prev => {
//       const current = prev.ingredients || [];
//       const isActive = current.includes(ing.slug);
//       return {
//         ...prev,
//         ingredients: isActive ? current.filter(i => i !== ing.slug) : [...current, ing.slug]
//       };
//     });
//   }, []);

//   const handlePromotionClick = useCallback((promo) => {
//     if (promo.scope === "brand" && promo.targetSlug) {
//       navigate(`/brand/${promo.targetSlug}`);
//     } else if (promo.scope === "category" && promo.targetSlug) {
//       navigate(`/category/${promo.targetSlug}`);
//     } else {
//       navigate(`/promotion/${promo.slug}`);
//     }
//   }, [navigate]);

//   /* ── infinite scroll ────────────────────────────────────────────────────── */
//   const loadMore = useCallback(() => {
//     if (nextCursor && hasMore && !loadingMore) fetchProducts(nextCursor, false);
//   }, [nextCursor, hasMore, loadingMore]);

//   useEffect(() => {
//     if (!hasMore || loadingMore) return;
//     const obs = new IntersectionObserver(
//       ([e]) => e.isIntersecting && loadMore(),
//       { root: null, rootMargin: "100px", threshold: 0.1 }
//     );
//     const el = loaderRef.current;
//     if (el) obs.observe(el);
//     return () => el && obs.unobserve(el);
//   }, [loadMore, hasMore, loadingMore]);

//   /* ── cart ───────────────────────────────────────────────────────────────── */
//   const handleAddToCart = async (prod) => {
//     setAddingToCart((p) => ({ ...p, [prod._id]: true }));
//     try {
//       const vars = Array.isArray(prod.variants) ? prod.variants : [];
//       const hasVar = vars.length > 0;
//       let payload;
//       if (hasVar) {
//         const sel = selectedVariants[prod._id];
//         if (!sel || sel.stock <= 0) { showToastMsg("Please select an in-stock variant.", "error"); return; }
//         payload = { productId: prod._id, variants: [{ variantSku: getSku(sel), quantity: 1 }] };
//         const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
//         cache[prod._id] = sel;
//         localStorage.setItem("cartVariantCache", JSON.stringify(cache));
//       } else {
//         if (prod.stock <= 0) { showToastMsg("Product is out of stock.", "error"); return; }
//         payload = { productId: prod._id, quantity: 1 };
//       }
//       const { data } = await axios.post(`${CART_API_BASE}/add`, payload, { withCredentials: true });
//       if (!data.success) throw new Error(data.message || "Cart add failed");
//       showToastMsg("Product added to cart!", "success");
//       navigate("/cartpage");
//     } catch (e) {
//       const msg = e.response?.data?.message || e.message || "Failed to add to cart";
//       showToastMsg(msg, "error");
//       if (e.response?.status === 401) navigate("/login", { state: { from: location.pathname } });
//     } finally {
//       setAddingToCart((p) => ({ ...p, [prod._id]: false }));
//     }
//   };

//   /* ── ui handlers ────────────────────────────────────────────────────────── */
//   const handleVariantSelect = (pid, v) => setSelectedVariants((p) => ({ ...p, [pid]: v }));
//   const openVariantOverlay = (pid, t = "all") => { setSelectedVariantType(t); setShowVariantOverlay(pid); };
//   const closeVariantOverlay = () => { setShowVariantOverlay(null); setSelectedVariantType("all"); };
//   const getProductSlug = (pr) => (pr.slugs?.[0] ? pr.slugs[0] : pr._id);

//   const isAnyFilterActive =
//     filters.brandIds.length > 0 || filters.categoryIds.length > 0 ||
//     filters.skinTypes.length > 0 || filters.formulations.length > 0 ||
//     filters.finishes.length > 0 || filters.ingredients.length > 0 ||
//     filters.priceRange || filters.discountRange || filters.minRating ||
//     filters.sort !== "recent" ||
//     (activeCategorySlug && activeCategorySlug !== pageDefault);

//   const handleClearAllFilters = () => {
//     setFilters(makeEmptyFilters());
//     setActiveCategorySlug(pageDefault);
//     setActiveCategoryName(
//       pageDefault ? trendingCategories.find((c) => c.slug === pageDefault)?.name || "" : ""
//     );
//   };

//   /* ── product card ───────────────────────────────────────────────────────── */
//   const renderProductCard = (prod) => {
//     const vars = Array.isArray(prod.variants) ? prod.variants : [];
//     const hasVar = vars.length > 0;
//     const isVariantSelected = !!selectedVariants[prod._id];
//     const displayVariant = selectedVariants[prod._id] || (hasVar ? (vars.find((v) => v.stock > 0) || vars[0]) : null);
//     const grouped = groupVariantsByType(vars);
//     const totalVars = vars.length;
//     const sku = displayVariant ? getSku(displayVariant) : null;
//     const inWl = sku ? isInWishlist(prod._id, sku) : false;
//     const slugPr = getProductSlug(prod);
//     const img = displayVariant?.images?.[0] || displayVariant?.image || prod.images?.[0] || "/placeholder.png";
//     const isAdding = addingToCart[prod._id];
//     const oos = hasVar ? displayVariant?.stock <= 0 : prod.stock <= 0;
//     const showSelectVariantButton = hasVar && !isVariantSelected;
//     const disabled = isAdding || (!showSelectVariantButton && oos);
//     let btnText = "Add to Cart";
//     if (isAdding) btnText = "Adding...";
//     else if (showSelectVariantButton) btnText = "Select Variant";
//     else if (oos) btnText = "Out of Stock";

//     return (
//       <div key={prod._id} className="col-6 col-md-4 col-lg-4 position-relative page-title-main-name">
//         <button
//           onClick={() => { if (displayVariant || !hasVar) toggleWishlist(prod, displayVariant || {}); }}
//           disabled={wishlistLoading[prod._id]}
//           style={{
//             position: "absolute", top: 8, right: 8,
//             cursor: wishlistLoading[prod._id] ? "not-allowed" : "pointer",
//             color: inWl ? "#dc3545" : "#ccc", fontSize: 22, zIndex: 2,
//             backgroundColor: "rgba(255,255,255,.9)", borderRadius: "50%",
//             width: 34, height: 34, display: "flex", alignItems: "center",
//             justifyContent: "center", boxShadow: "0 2px 4px rgba(0,0,0,.1)",
//             transition: "all .3s ease", border: "none",
//           }}
//           title={inWl ? "Remove from wishlist" : "Add to wishlist"}
//         >
//           {wishlistLoading[prod._id]
//             ? <div className="spinner-border spinner-border-sm" role="status" />
//             : inWl ? <FaHeart /> : <FaRegHeart />}
//         </button>

//         <img src={img} alt={prod.name} className="card-img-top"
//           style={{ height: 200, objectFit: "contain", cursor: "pointer" }}
//           onClick={() => navigate(`/product/${slugPr}`)} />

//         <div className="card-body p-0 d-flex flex-column" style={{ height: 265, justifyContent: 'space-between' }}>
//           <div className="brand-name text-muted small mb-1 fw-medium mt-2 text-start">{getBrandName(prod)}</div>
//           <h5 className="card-title mt-2 align-items-center gap-1 page-title-main-name"
//             style={{ cursor: "pointer" }} onClick={() => navigate(`/product/${slugPr}`)}>
//             {prod.name}
//           </h5>

//           {hasVar && (
//             <div className="m-0 p-0 ms-0">
//               {isVariantSelected ? (
//                 <div className="text-muted small" style={{ cursor: "pointer", display: "inline-block" }}
//                   onClick={(e) => { e.stopPropagation(); openVariantOverlay(prod._id, "all"); }}
//                   title="Click to change variant">
//                   Variant: <span className="fw-bold text-dark">{getVariantDisplayText(displayVariant)}</span>
//                   <FaChevronDown className="ms-1" style={{ fontSize: "10px" }} />
//                 </div>
//               ) : (
//                 <div className="small text-muted" style={{ height: "20px", cursor: "pointer", display: "inline-block" }}
//                   onClick={(e) => { e.stopPropagation(); openVariantOverlay(prod._id, "all"); }}>
//                   {vars.length} Variants Available
//                   <FaChevronDown className="ms-1" style={{ fontSize: "10px" }} />
//                 </div>
//               )}
//             </div>
//           )}

//           <p className="fw-bold mb-3 mt-2 page-title-main-name" style={{ fontSize: 16 }}>
//             {(() => {
//               const price = displayVariant?.displayPrice || displayVariant?.discountedPrice || prod.price || 0;
//               const orig = displayVariant?.originalPrice || displayVariant?.mrp || prod.mrp || price;
//               const disc = orig > price;
//               const pct = disc ? Math.round(((orig - price) / orig) * 100) : 0;
//               return disc ? (
//                 <>₹{price}
//                   <span style={{ textDecoration: "line-through", color: "#888", marginLeft: 8 }}>₹{orig}</span>
//                   <span style={{ color: "#e53e3e", marginLeft: 8, fontWeight: 600 }}>({pct}% OFF)</span>
//                 </>
//               ) : <>₹{orig}</>;
//             })()}
//           </p>

//           <div className="mt-3">
//             <button
//               // className={`page-title-main-name add-to-cart-product-page w-100 d-flex align-items-center justify-content-center gap-2 ${isAdding ? "bg-black text-white" : ""}`}

//               className={`btn w-100 d-flex align-items-center justify-content-center gap-2 addtocartbuttton page-title-main-name ${isAdding ? "btn-dark" : "btn-outline-dark"
//                 }`}
//               onClick={(e) => { e.stopPropagation(); showSelectVariantButton ? openVariantOverlay(prod._id, "all") : handleAddToCart(prod); }}
//               disabled={disabled}
//               style={{ transition: "background-color .3s ease, color .3s ease" }}
//             >
//               {isAdding
//                 ? <><span className="spinner-border spinner-border-sm me-2" role="status" />Adding...</>
//                 : <>{btnText}{!disabled && !isAdding && !showSelectVariantButton && <img src={Bag} alt="Bag" style={{ height: 20 }} />}</>}
//             </button>
//           </div>
//         </div>

//         {/* Variant Overlay */}
//         {showVariantOverlay === prod._id && (
//           <div className="variant-overlay" style={{ position: 'absolute' }} onClick={closeVariantOverlay}>
//             <div className="variant-overlay-content w-100 p-0" onClick={(e) => e.stopPropagation()}
//               style={{ width: "90%", maxWidth: 500, maxHeight: "80vh", background: "#fff", overflow: "hidden", display: "flex", flexDirection: "column" }}>
//               <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
//                 <h5 className="m-0 page-title-main-name">Select Variant ({totalVars})</h5>
//                 <button onClick={closeVariantOverlay} style={{ background: "none", border: "none", fontSize: 24 }}>×</button>
//               </div>
//               <div className="variant-tabs d-flex">
//                 <button className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "all" ? "active" : ""}`} onClick={() => setSelectedVariantType("all")}>All ({totalVars})</button>
//                 {grouped.color.length > 0 && <button className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "color" ? "active" : ""}`} onClick={() => setSelectedVariantType("color")}>Colors ({grouped.color.length})</button>}
//                 {grouped.text.length > 0 && <button className={`variant-tab flex-fill py-3 ${selectedVariantType === "text" ? "active" : ""}`} onClick={() => setSelectedVariantType("text")}>Sizes ({grouped.text.length})</button>}
//               </div>
//               <div className="p-3 overflow-auto flex-grow-1 page-title-main-name">
//                 {(selectedVariantType === "all" || selectedVariantType === "color") && grouped.color.length > 0 && (
//                   <div className="row row-cols-4 g-3">
//                     {grouped.color.map((v) => {
//                       const sel = selectedVariants[prod._id]?.sku === v.sku;
//                       const oosV = v.stock <= 0;
//                       return (
//                         <div className="col-lg-4 col-6" key={v.sku || v._id}>
//                           <div className="text-center" style={{ cursor: oosV ? "not-allowed" : "pointer" }}
//                             onClick={() => !oosV && (handleVariantSelect(prod._id, v), closeVariantOverlay())}>
//                             <div style={{ width: 28, height: 28, borderRadius: "20%", backgroundColor: v.hex || "#ccc", margin: "0 auto 8px", border: sel ? "3px solid #000" : "1px solid #ddd", opacity: oosV ? 0.5 : 1, position: "relative" }}>
//                               {sel && <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", color: "#fff", fontWeight: "bold" }}>✓</span>}
//                             </div>
//                             <div className="small page-title-main-name" style={{ fontSize: "14px !important" }}>{getVariantDisplayText(v)}</div>
//                             {oosV && <div className="text-danger small">Out of Stock</div>}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//                 {(selectedVariantType === "all" || selectedVariantType === "text") && grouped.text.length > 0 && (
//                   <div className="row row-cols-3 g-3">
//                     {grouped.text.map((v) => {
//                       const sel = selectedVariants[prod._id]?.sku === v.sku;
//                       const oosV = v.stock <= 0;
//                       return (
//                         <div className="col" key={v.sku || v._id}>
//                           <div className="text-center" style={{ cursor: oosV ? "not-allowed" : "pointer" }}
//                             onClick={() => !oosV && (handleVariantSelect(prod._id, v), closeVariantOverlay())}>
//                             <div style={{ padding: 10, borderRadius: 8, border: sel ? "3px solid #000" : "1px solid #ddd", background: sel ? "#f8f9fa" : "#fff", minHeight: 50, display: "flex", alignItems: "center", justifyContent: "center", opacity: oosV ? 0.5 : 1 }}>
//                               {getVariantDisplayText(v)}
//                             </div>
//                             {oosV && <div className="text-danger small mt-1">Out of Stock</div>}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   const brandFilterProps = {
//     filters,
//     setFilters,
//     filterData,
//     trendingCategories,
//     activeCategorySlug,
//     activeCategoryName,
//     onClearCategory: handleClearCategory,
//     onCategoryPillClick: handleCategoryPillClick,
//   };

//   /* ── render ─────────────────────────────────────────────────────────────── */
//   return (
//     <>
//       {loading && (
//         <div className="fullscreen-loader page-title-main-name">
//           <div className="spinner" /><p className="text-black">Loading products...</p>
//         </div>
//       )}
//       <Header />

//       <div className="banner-images text-center mt-xl-5 pt-xl-4">
//         <img src={bannerImage || "/banner-placeholder.jpg"} alt="Banner"
//           className="w-100 hero-slider-image-responsive"
//           style={{ maxHeight: 400, objectFit: "cover" }} />
//       </div>

//       {/* Trending Categories */}
//       {trendingCategories.length > 0 && (
//         <div className="container-lg mt-4">
//           <div className="d-flex overflow-auto py-2"
//             style={{ gap: "0.75rem", whiteSpace: "nowrap", scrollbarWidth: "none" }}>
//             {trendingCategories.map((cat) => {
//               const isActive = activeCategorySlug === cat.slug;
//               return (
//                 <button key={cat.slug}
//                   onClick={() => handleCategoryPillClick(cat)}
//                   className={`btn rounded-pill px-4 py-2 page-title-main-name flex-shrink-0 ${isActive ? "btn-dark" : "btn-outline-secondary"}`}
//                   style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, transition: "all 0.18s ease", transform: isActive ? "scale(1.04)" : "scale(1)" }}
//                   title={`Filter by ${cat.name}`}
//                 >
//                   {cat.name}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {/* Shop By Skin Types */}
//       {shopBySkinTypes.length > 0 && (
//         <div className="container-lg mt-3">
//           <h5 className="mb-2 page-title-main-name">Shop by Skin Type</h5>
//           <div className="d-flex overflow-auto py-2"
//             style={{ gap: "0.75rem", whiteSpace: "nowrap", scrollbarWidth: "none" }}>
//             {shopBySkinTypes.map((skin) => {
//               const isActive = filters.skinTypes.includes(skin.slug);
//               return (
//                 <button
//                   key={skin.slug}
//                   onClick={() => handleSkinTypeClick(skin)}
//                   className={`btn rounded-pill px-4 py-2 page-title-main-name flex-shrink-0 ${isActive ? "btn-dark" : "btn-outline-secondary"}`}
//                   style={{ fontSize: 13, fontWeight: isActive ? 600 : 400 }}
//                 >
//                   {skin.name}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {/* Shop By Ingredients */}
//       {shopByIngredients.length > 0 && (
//         <div className="container-lg mt-3">
//           <h5 className="mb-2 page-title-main-name">Shop by Ingredients</h5>
//           <div className="d-flex overflow-auto py-2"
//             style={{ gap: "0.75rem", whiteSpace: "nowrap", scrollbarWidth: "none" }}>
//             {shopByIngredients.map((ing) => {
//               const isActive = filters.ingredients.includes(ing.slug);
//               return (
//                 <button
//                   key={ing.slug}
//                   onClick={() => handleIngredientClick(ing)}
//                   className={`btn rounded-pill px-4 py-2 page-title-main-name flex-shrink-0 ${isActive ? "btn-dark" : "btn-outline-secondary"}`}
//                   style={{ fontSize: 13, fontWeight: isActive ? 600 : 400 }}
//                 >
//                   {ing.name}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {/* Special Offers / Promotions */}
//       {promotions.length > 0 && (
//         <div className="container-lg mt-3">
//           <h5 className="mb-2 page-title-main-name">Special Offers</h5>
//           <div className="d-flex overflow-auto py-2"
//             style={{ gap: "0.75rem", whiteSpace: "nowrap", scrollbarWidth: "none" }}>
//             {promotions.map((promo) => (
//               <button
//                 key={promo._id}
//                 onClick={() => handlePromotionClick(promo)}
//                 className="btn rounded-pill px-4 py-2 page-title-main-name flex-shrink-0 btn-outline-danger"
//                 style={{ fontSize: 13, fontWeight: 500 }}
//               >
//                 {promo.title} {promo.discountLabel && `(${promo.discountLabel})`}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       <div className="container-lg py-4">
//         <h2 className="mb-4 d-none d-lg-block page-title-main-name">{pageTitle}</h2>

//         <div className="row">
//           <div className="d-none d-lg-block col-lg-3">
//             <BrandFilter {...brandFilterProps} />
//           </div>

//           <div className="d-lg-none mb-3">
//             <h2 className="mb-4 text-center">{pageTitle}</h2>
//             <div className="w-100 filter-responsive rounded shadow-sm">
//               <div className="container-fluid p-0">
//                 <div className="row g-0" style={{ flexDirection: "row-reverse" }}>
//                   <div className="col-6">
//                     <button className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
//                       onClick={() => setShowFilterOffcanvas(true)} style={{ gap: 12 }}>
//                       <img src={filtering} alt="Filter" style={{ width: 25 }} />
//                       <div className="text-start">
//                         <p className="mb-0 fs-6 fw-semibold page-title-main-name">Filter</p>
//                         <span className="text-muted small page-title-main-name">Tap to apply</span>
//                       </div>
//                     </button>
//                   </div>
//                   <div className="col-6 border-end">
//                     <button className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
//                       onClick={() => setShowSortOffcanvas(true)} style={{ gap: 12 }}>
//                       <img src={updownarrow} alt="Sort" style={{ width: 25 }} />
//                       <div className="text-start">
//                         <p className="mb-0 fs-6 fw-semibold page-title-main-name">Sort by</p>
//                         <span className="text-muted small">{filters.sort === "recent" ? "Relevance" : filters.sort}</span>
//                       </div>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Filter & Sort Offcanvas - unchanged */}
//           {showFilterOffcanvas && (
//             <>
//               <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
//                 style={{ opacity: 0.5, zIndex: 1040 }} onClick={() => setShowFilterOffcanvas(false)} />
//               <div className="position-fixed start-0 bottom-0 w-100 bg-white"
//                 style={{ zIndex: 1050, borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: "85vh", boxShadow: "0 -4px 20px rgba(0,0,0,.2)" }}>
//                 <div className="text-center py-3 position-relative">
//                   <h5 className="mb-0 fw-bold">Filters</h5>
//                   <button className="btn-close position-absolute end-0 me-3"
//                     style={{ top: "50%", transform: "translateY(-50%)" }}
//                     onClick={() => setShowFilterOffcanvas(false)} />
//                   <div className="mx-auto mt-2 bg-secondary" style={{ height: 5, width: 50, borderRadius: 3 }} />
//                 </div>
//                 <div className="px-3 pb-4 overflow-auto" style={{ maxHeight: "70vh" }}>
//                   <BrandFilter
//                     {...brandFilterProps}
//                     onClose={() => setShowFilterOffcanvas(false)}
//                     onClearCategory={() => { handleClearCategory(); setShowFilterOffcanvas(false); }}
//                     onCategoryPillClick={(cat) => {
//                       handleCategoryPillClick(cat);
//                       setShowFilterOffcanvas(false);
//                     }}
//                   />
//                 </div>
//               </div>
//             </>
//           )}

//           {showSortOffcanvas && (
//             <>
//               <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
//                 style={{ opacity: 0.5, zIndex: 1040 }} onClick={() => setShowSortOffcanvas(false)} />
//               <div className="position-fixed start-0 bottom-0 w-100 bg-white"
//                 style={{ zIndex: 1050, borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: "60vh", boxShadow: "0 -4px 12px rgba(0,0,0,.15)" }}>
//                 <div className="text-center py-3 position-relative">
//                   <h5 className="mb-0 fw-bold page-title-main-name">Sort by</h5>
//                   <button className="btn-close position-absolute end-0 me-3"
//                     style={{ top: "50%", transform: "translateY(-50%)" }}
//                     onClick={() => setShowSortOffcanvas(false)} />
//                   <div className="mx-auto mt-2 bg-secondary" style={{ height: 5, width: 50, borderRadius: 3 }} />
//                 </div>
//                 <div className="px-4 pb-4">
//                   <div className="list-group">
//                     {[
//                       { value: "recent", label: "Relevance" },
//                       { value: "priceHighToLow", label: "Price High to Low" },
//                       { value: "priceLowToHigh", label: "Price Low to High" },
//                     ].map(({ value, label }) => (
//                       <label key={value} className="list-group-item py-3 d-flex align-items-center">
//                         <input className="form-check-input me-3" type="radio" name="sort"
//                           checked={filters.sort === value}
//                           onChange={() => { setFilters((p) => ({ ...p, sort: value })); setShowSortOffcanvas(false); }} />
//                         <span className="page-title-main-name">{label}</span>
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}

//           <div className="col-12 col-lg-9">
//             <div className="mb-3 d-flex justify-content-between align-items-center">
//               <span className="text-muted page-title-main-name">
//                 {pageTitle || `Showing ${allProducts.length} products`}
//                 {hasMore && pageTitle && " (Scroll for more)"}
//               </span>
//               {isAnyFilterActive && (
//                 <button className="btn btn-sm btn-outline-danger" onClick={handleClearAllFilters}>
//                   Clear Filters
//                 </button>
//               )}
//             </div>

//             <div className="row g-4">
//               {allProducts.length > 0
//                 ? allProducts.map(renderProductCard)
//                 : <div className="col-12 text-center py-5"><h4>No products found</h4><p className="text-muted">Try adjusting your filters.</p></div>}
//             </div>

//             {loadingMore && (
//               <div className="text-center mt-4 py-4">
//                 <div className="spinner-border text-primary" role="status">
//                   <span className="visually-hidden">Loading more products...</span>
//                 </div>
//                 <p className="mt-2">Loading more products...</p>
//               </div>
//             )}

//             <div ref={loaderRef} style={{ height: 20, marginTop: 20 }} />

//             {!hasMore && allProducts.length > 0 && (
//               <div className="text-center mt-4 py-4 border-top">
//                 <p className="text-muted">🎉 You've reached the end! No more products to show.</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// }




























// /* ProductPage – Unified API & Full Feature Edition with Multi-Filter Support */
// import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
// import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";
// import { FaStar, FaHeart, FaRegHeart, FaChevronDown } from "react-icons/fa";
// import Header from "./Header";
// import Footer from "./Footer";
// import { CartContext } from "../Context/CartContext";
// import { UserContext } from "./UserContext.jsx";
// import BrandFilter from "./BrandFilter";
// import "../css/ProductPage.css";
// import axios from "axios";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import updownarrow from "../assets/updownarrow.svg";
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// import filtering from "../assets/filtering.svg";
// import Bag from "../assets/Bag.svg";

// const CART_API_BASE = "https://beauty.joyory.com/api/user/cart";
// const PRODUCT_ALL_API = "https://beauty.joyory.com/api/user/products/all";

// /* ─── helpers ───────────────────────────────────────────────────────────── */
// const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || "default"}`;

// const isValidHexColor = (hex) => {
//     if (!hex || typeof hex !== "string") return false;
//     return /^#([a-f0-9]{6}|[a-f0-9]{3})$/.test(hex.trim().toLowerCase());
// };

// const getVariantDisplayText = (v) =>
//     (v.shadeName || v.name || v.size || v.ml || v.weight || "Default").toUpperCase();

// const groupVariantsByType = (variants) => {
//     const g = { color: [], text: [] };
//     (variants || []).forEach((v) => {
//         if (!v) return;
//         v.hex && isValidHexColor(v.hex) ? g.color.push(v) : g.text.push(v);
//     });
//     return g;
// };

// const getBrandName = (p) => {
//     if (!p?.brand) return "Unknown Brand";
//     if (typeof p.brand === "object" && p.brand.name) return p.brand.name;
//     if (typeof p.brand === "string") return p.brand;
//     return "Unknown Brand";
// };

// export default function ProductPage() {
//     const { slug } = useParams();
//     const { "*": categoryPath } = useParams();
//     const navigate = useNavigate();
//     const location = useLocation();
//     const [searchParams, setSearchParams] = useSearchParams();

//     let effectiveSlug = slug;
//     if (location.pathname.startsWith("/category/") && categoryPath) {
//         const segments = categoryPath.split("/");
//         effectiveSlug = segments[segments.length - 1];
//     }

//     /* ── state ──────────────────────────────────────────────────────────────── */
//     const [allProducts, setAllProducts] = useState([]);
//     const [pageTitle, setPageTitle] = useState("Products");
//     const [bannerImages, setBannerImages] = useState([]); // 🔥 Changed to array
//     const swiperRef = useRef(null); // 🔥 Added for Swiper

//     const [trendingCategories, setTrendingCategories] = useState([]);
//     const [shopBySkinTypes, setShopBySkinTypes] = useState([]);
//     const [shopByIngredients, setShopByIngredients] = useState([]);
//     const [promotions, setPromotions] = useState([]);

//     const [filterData, setFilterData] = useState(null);

//     const [activeCategorySlug, setActiveCategorySlug] = useState(() =>
//         location.pathname.includes("/category/") && effectiveSlug ? effectiveSlug : null
//     );
//     const [activeCategoryName, setActiveCategoryName] = useState("");

//     const [selectedVariants, setSelectedVariants] = useState({});
//     const [addingToCart, setAddingToCart] = useState({});
//     const [loading, setLoading] = useState(true);
//     const [loadingMore, setLoadingMore] = useState(false);
//     const [hasMore, setHasMore] = useState(true);
//     const [nextCursor, setNextCursor] = useState(null);

//     const [wishlistLoading, setWishlistLoading] = useState({});
//     const [wishlistData, setWishlistData] = useState([]);

//     const [filters, setFilters] = useState({
//         brandIds: [],
//         categoryIds: [],
//         skinTypes: [],
//         formulations: [],
//         finishes: [],
//         ingredients: [],
//         priceRange: null,
//         discountMin: null,  // Changed from discountRange to discountMin for API compatibility
//         minRating: "",
//         sort: "recent",
//     });

//     const [showFilterOffcanvas, setShowFilterOffcanvas] = useState(false);
//     const [showSortOffcanvas, setShowSortOffcanvas] = useState(false);
//     const [showVariantOverlay, setShowVariantOverlay] = useState(null);
//     const [selectedVariantType, setSelectedVariantType] = useState("all");

//     const { user } = useContext(UserContext);
//     const loaderRef = useRef(null);

//     /* ── toast ──────────────────────────────────────────────────────────────── */
//     const showToastMsg = (msg, type = "error", dur = 3000) => {
//         const t = document.createElement("div");
//         t.className = `toast-notification toast-${type}`;
//         t.style.cssText = `
//       position:fixed;top:20px;right:20px;padding:12px 20px;
//       border-radius:8px;color:#fff;z-index:9999;
//       background:${type === "error" ? "#f56565" : "#48bb78"};
//       box-shadow:0 4px 12px rgba(0,0,0,.15);
//     `;
//         t.textContent = msg;
//         document.body.appendChild(t);
//         setTimeout(() => t.remove(), dur);
//     };

//     /* ── wishlist ───────────────────────────────────────────────────────────── */
//     const isInWishlist = (pid, sku) => {
//         if (!pid || !sku) return false;
//         return wishlistData.some((it) => (it.productId === pid || it._id === pid) && it.sku === sku);
//     };

//     const fetchWishlistData = async () => {
//         try {
//             if (user && !user.guest) {
//                 const { data } = await axios.get("https://beauty.joyory.com/api/user/wishlist", { withCredentials: true });
//                 if (data.success) setWishlistData(data.wishlist || []);
//             } else {
//                 const local = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
//                 setWishlistData(local.map((it) => ({ ...it, productId: it._id })));
//             }
//         } catch (e) { console.error(e); }
//     };

//     useEffect(() => { fetchWishlistData(); }, [user]);

//     const toggleWishlist = async (prod, variant) => {
//         if (!user || user.guest) {
//             showToastMsg("Please login to use wishlist", "error");
//             navigate("/login", { state: { from: location.pathname } });
//             return;
//         }
//         if (!prod || !variant) return showToastMsg("Select a variant first", "error");
//         const pid = prod._id;
//         const sku = getSku(variant);
//         setWishlistLoading((p) => ({ ...p, [pid]: true }));
//         try {
//             const inWl = isInWishlist(pid, sku);
//             if (user && !user.guest) {
//                 if (inWl) {
//                     await axios.delete(`https://beauty.joyory.com/api/user/wishlist/${pid}`, { withCredentials: true, data: { sku } });
//                     showToastMsg("Removed from wishlist!", "success");
//                 } else {
//                     await axios.post(`https://beauty.joyory.com/api/user/wishlist/${pid}`, { sku }, { withCredentials: true });
//                     showToastMsg("Added to wishlist!", "success");
//                 }
//                 await fetchWishlistData();
//             } else {
//                 let g = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
//                 if (inWl) {
//                     g = g.filter((it) => !(it._id === pid && it.sku === sku));
//                     showToastMsg("Removed from wishlist!", "success");
//                 } else {
//                     g.push({
//                         _id: pid, name: prod.name, brand: getBrandName(prod),
//                         displayPrice: variant.displayPrice || variant.discountedPrice || prod.price,
//                         originalPrice: variant.originalPrice || variant.mrp || prod.price,
//                         image: variant.images?.[0] || prod.images?.[0],
//                         sku, variantName: variant.shadeName || "Default", stock: variant.stock,
//                     });
//                     showToastMsg("Added to wishlist!", "success");
//                 }
//                 localStorage.setItem("guestWishlist", JSON.stringify(g));
//                 await fetchWishlistData();
//             }
//         } catch (e) {
//             showToastMsg(e.response?.data?.message || "Wishlist error", "error");
//         } finally {
//             setWishlistLoading((p) => ({ ...p, [pid]: false }));
//         }
//     };

//     /* ── fetch products ─────────────────────────────────────────────────────── */
//     const buildQueryParams = (cursor = null) => {
//         const p = new URLSearchParams();
//         const path = location.pathname.toLowerCase();

//         if (activeCategorySlug) {
//             p.append("categoryIds", activeCategorySlug);
//         } else if (path.includes("/category/")) {
//             p.append("categoryIds", effectiveSlug);
//         } else if (path.includes("/skintype/")) {
//             p.append("skinTypes", effectiveSlug);
//         } else if (path.includes("/promotion/")) {
//             p.append("promoSlug", effectiveSlug);
//         }

//         filters.brandIds?.forEach((id) => p.append("brandIds", id));
//         filters.categoryIds?.forEach((id) => p.append("categoryIds", id));
//         filters.skinTypes?.forEach((n) => p.append("skinTypes", n));
//         filters.formulations?.forEach((id) => p.append("formulations", id));
//         filters.finishes?.forEach((s) => p.append("finishes", s));
//         filters.ingredients?.forEach((s) => p.append("ingredients", s));
//         if (filters.minRating) p.append("minRating", filters.minRating);

//         // Handle price range filter
//         if (filters.priceRange) {
//             p.append("minPrice", filters.priceRange.min);
//             if (filters.priceRange.max != null) p.append("maxPrice", filters.priceRange.max);
//         }

//         // Handle discount filter - using discountMin parameter
//         if (filters.discountMin && filters.discountMin > 0) {
//             p.append("discountMin", filters.discountMin);
//         }

//         if (filters.sort) p.append("sort", filters.sort);
//         if (cursor) p.append("cursor", cursor);
//         p.append("limit", "9");

//         const queryString = p.toString();
//         console.log("API Query →", `${PRODUCT_ALL_API}?${queryString}`);
//         return queryString;
//     };

//     const fetchProducts = async (cursor = null, reset = false) => {
//         try {
//             if (reset) {
//                 setLoading(true);
//                 setAllProducts([]);
//                 setNextCursor(null);
//                 setHasMore(true);
//             } else {
//                 setLoadingMore(true);
//             }

//             const { data } = await axios.get(
//                 `${PRODUCT_ALL_API}?${buildQueryParams(cursor)}`,
//                 { withCredentials: true }
//             );

//             // title & banner
//             if (data.titleMessage) setPageTitle(data.titleMessage);
//             else if (data.category?.name) setPageTitle(data.category.name);
//             else if (data.promoMeta?.name) setPageTitle(data.promoMeta.name);
//             else if (data.skinType?.name) setPageTitle(data.skinType.name);

//             // if (data.bannerImage && Array.isArray(data.bannerImage)) {
//             //     setBannerImage(data.bannerImage[0]?.url || data.bannerImage[0] || "");
//             // } else if (data.category?.bannerImage) setBannerImage(data.category.bannerImage);
//             // else if (data.promoMeta?.bannerImage) setBannerImage(data.promoMeta.bannerImage);
//             // else if (data.skinType?.bannerImage) setBannerImage(data.skinType.bannerImage);



//             // 🔥 CHANGED: Extract banner array
//             let extractedBanners = [];
//             if (data.bannerImage && Array.isArray(data.bannerImage)) {
//                 extractedBanners = data.bannerImage;
//             } else if (data.category?.bannerImage && Array.isArray(data.category.bannerImage)) {
//                 extractedBanners = data.category.bannerImage;
//             } else if (data.promoMeta?.bannerImage && Array.isArray(data.promoMeta.bannerImage)) {
//                 extractedBanners = data.promoMeta.bannerImage;
//             } else if (data.skinType?.bannerImage && Array.isArray(data.skinType.bannerImage)) {
//                 extractedBanners = data.skinType.bannerImage;
//             } else if (data.bannerImage) {
//                 extractedBanners = [data.bannerImage];
//             } else if (data.category?.bannerImage) {
//                 extractedBanners = [data.category.bannerImage];
//             } else if (data.promoMeta?.bannerImage) {
//                 extractedBanners = [data.promoMeta.bannerImage];
//             } else if (data.skinType?.bannerImage) {
//                 extractedBanners = [data.skinType.bannerImage];
//             }

//             setBannerImages(extractedBanners);

//             // Shop By Sections
//             if (data.skinTypes && Array.isArray(data.skinTypes)) {
//                 setShopBySkinTypes(data.skinTypes);
//             }
//             if (data.shopByIngredients && Array.isArray(data.shopByIngredients)) {
//                 setShopByIngredients(data.shopByIngredients);
//             }
//             if (data.promotions && Array.isArray(data.promotions)) {
//                 setPromotions(data.promotions);
//             }

//             if (data.trendingCategories && Array.isArray(data.trendingCategories)) {
//                 setTrendingCategories(data.trendingCategories);
//                 if (effectiveSlug && !activeCategoryName) {
//                     const found = data.trendingCategories.find((c) => c.slug === effectiveSlug);
//                     if (found) setActiveCategoryName(found.name);
//                 }
//             } else {
//                 setTrendingCategories([]);
//             }

//             if (data.category?.name && !activeCategoryName && effectiveSlug) {
//                 setActiveCategoryName(data.category.name);
//             }

//             if (reset && data.filters) {
//                 setFilterData(data.filters);
//             }

//             const prods = data.products || [];
//             const pg = data.pagination || {};

//             if (reset) setAllProducts(prods);
//             else setAllProducts((prev) => [...prev, ...prods]);

//             setHasMore(pg.hasMore || false);
//             setNextCursor(pg.nextCursor || null);
//         } catch (e) {
//             console.error(e);
//             showToastMsg("Failed to fetch products", "error");
//         } finally {
//             setLoading(false);
//             setLoadingMore(false);
//         }
//     };

//     useEffect(() => {
//         if (location.pathname.includes("/category/") && effectiveSlug) {
//             setActiveCategorySlug(effectiveSlug);
//             if (trendingCategories.length > 0) {
//                 const found = trendingCategories.find(c => c.slug === effectiveSlug);
//                 if (found) setActiveCategoryName(found.name);
//             }
//         } else {
//             setActiveCategorySlug(null);
//             setActiveCategoryName("");
//         }
//     }, [effectiveSlug, location.pathname, trendingCategories]);

//     /* ── Parse URL query parameters on mount ────────────────────────────── */
//     // useEffect(() => {
//     //     const initialFilters = { ...filters };
//     //     let changed = false;

//     //     const getMultiParam = (key) => {
//     //         const values = searchParams.getAll(key);
//     //         if (values.length > 0) return values;
//     //         const comma = searchParams.get(key);
//     //         if (comma) return comma.split(',').map(s => s.trim()).filter(Boolean);
//     //         return [];
//     //     };

//     //     ['ingredients', 'skinTypes', 'brandIds', 'categoryIds', 'formulations', 'finishes'].forEach(key => {
//     //         const param = getMultiParam(key);
//     //         if (param.length > 0) {
//     //             initialFilters[key] = param;
//     //             changed = true;
//     //         }
//     //     });

//     //     const minPrice = searchParams.get('minPrice');
//     //     const maxPrice = searchParams.get('maxPrice');
//     //     if (minPrice !== null || maxPrice !== null) {
//     //         initialFilters.priceRange = {
//     //             min: minPrice ? parseFloat(minPrice) : 0,
//     //             max: maxPrice ? parseFloat(maxPrice) : null,
//     //         };
//     //         changed = true;
//     //     }

//     //     // Handle discountMin parameter
//     //     const discountMin = searchParams.get('discountMin');
//     //     if (discountMin !== null) {
//     //         initialFilters.discountMin = parseFloat(discountMin);
//     //         changed = true;
//     //     }

//     //     const minRating = searchParams.get('minRating');
//     //     if (minRating !== null) {
//     //         initialFilters.minRating = minRating;
//     //         changed = true;
//     //     }

//     //     const sortParam = searchParams.get('sort');
//     //     if (sortParam !== null && ['recent', 'priceHighToLow', 'priceLowToHigh'].includes(sortParam)) {
//     //         initialFilters.sort = sortParam;
//     //         changed = true;
//     //     }

//     //     if (changed) {
//     //         setFilters(initialFilters);
//     //     }
//     // }, []);





//     /* ── Parse URL query parameters on mount (FIXED) ────────────────────────────── */
//     useEffect(() => {
//         const initialFilters = { ...filters };
//         let hasChanges = false;

//         const getMultiParam = (key) => {
//             const values = searchParams.getAll(key);
//             if (values.length > 0) return values;
//             const commaValue = searchParams.get(key);
//             if (commaValue) {
//                 return commaValue.split(',').map(s => s.trim()).filter(Boolean);
//             }
//             return [];
//         };

//         // Restore all array-based filters
//         const arrayKeys = ['ingredients', 'skinTypes', 'brandIds', 'categoryIds', 'formulations', 'finishes'];
//         arrayKeys.forEach(key => {
//             const values = getMultiParam(key);
//             if (values.length > 0) {
//                 initialFilters[key] = values;
//                 hasChanges = true;
//             }
//         });

//         // Restore price range
//         const minPrice = searchParams.get('minPrice');
//         const maxPrice = searchParams.get('maxPrice');
//         if (minPrice !== null || maxPrice !== null) {
//             initialFilters.priceRange = {
//                 min: minPrice ? parseFloat(minPrice) : 0,
//                 max: maxPrice ? parseFloat(maxPrice) : null,
//             };
//             hasChanges = true;
//         }

//         // Restore discountMin
//         const discountMin = searchParams.get('discountMin');
//         if (discountMin !== null) {
//             initialFilters.discountMin = parseFloat(discountMin);
//             hasChanges = true;
//         }

//         // Restore minRating
//         const minRating = searchParams.get('minRating');
//         if (minRating !== null) {
//             initialFilters.minRating = minRating;
//             hasChanges = true;
//         }

//         // Restore sort
//         const sortParam = searchParams.get('sort');
//         if (sortParam && ['recent', 'priceHighToLow', 'priceLowToHigh'].includes(sortParam)) {
//             initialFilters.sort = sortParam;
//             hasChanges = true;
//         }

//         if (hasChanges) {
//             setFilters(initialFilters);
//             console.log("✅ Filters restored from URL:", initialFilters);
//         }
//     }, [searchParams]);   // ← Important: depend on searchParams



//     /* ── Sync URL query parameters when filters change ──────────────────── */
//     useEffect(() => {
//         const newParams = new URLSearchParams();

//         const addArrayParam = (key, arr) => {
//             if (arr && arr.length) arr.forEach(v => newParams.append(key, v));
//         };

//         addArrayParam('brandIds', filters.brandIds);
//         addArrayParam('categoryIds', filters.categoryIds);
//         addArrayParam('skinTypes', filters.skinTypes);
//         addArrayParam('formulations', filters.formulations);
//         addArrayParam('finishes', filters.finishes);
//         addArrayParam('ingredients', filters.ingredients);

//         if (filters.priceRange) {
//             if (filters.priceRange.min !== undefined) newParams.set('minPrice', filters.priceRange.min);
//             if (filters.priceRange.max != null) newParams.set('maxPrice', filters.priceRange.max);
//         }

//         if (filters.discountMin) {
//             newParams.set('discountMin', filters.discountMin);
//         }

//         if (filters.minRating) newParams.set('minRating', filters.minRating);
//         if (filters.sort !== 'recent') newParams.set('sort', filters.sort);

//         const currentQuery = searchParams.toString();
//         const newQuery = newParams.toString();
//         if (currentQuery !== newQuery) {
//             setSearchParams(newParams, { replace: true });
//         }
//     }, [filters, setSearchParams, searchParams]);

//     // Fetch products when filters or page context change
//     useEffect(() => {
//         fetchProducts(null, true);
//     }, [effectiveSlug, location.pathname, filters, activeCategorySlug]);

//     /* ── helpers ────────────────────────────────────────────────────────────── */
//     const pageDefault = location.pathname.includes("/category/") ? effectiveSlug : null;

//     const makeEmptyFilters = () => ({
//         brandIds: [], categoryIds: [], skinTypes: [], formulations: [],
//         finishes: [], ingredients: [], priceRange: null, discountMin: null,
//         minRating: "", sort: "recent",
//     });

//     /* ── CATEGORY PILL CLICK ────────────────────────────────────────────────── */
//     const handleCategoryPillClick = useCallback((cat) => {
//         if (activeCategorySlug === cat.slug) {
//             setActiveCategorySlug(pageDefault);
//             setActiveCategoryName(pageDefault ? trendingCategories.find((c) => c.slug === pageDefault)?.name || "" : "");
//         } else {
//             setActiveCategorySlug(cat.slug);
//             setActiveCategoryName(cat.name);
//             setFilters(makeEmptyFilters());
//         }
//     }, [activeCategorySlug, pageDefault, trendingCategories]);

//     const handleClearCategory = useCallback(() => {
//         setActiveCategorySlug(pageDefault);
//         setActiveCategoryName(pageDefault ? trendingCategories.find((c) => c.slug === pageDefault)?.name || "" : "");
//         setFilters(makeEmptyFilters());
//     }, [pageDefault, trendingCategories]);

//     /* ── Click Handlers ─────────────────────────────────────────────────────── */
//     const handleSkinTypeClick = useCallback((skin) => {
//         setFilters(prev => {
//             const current = prev.skinTypes || [];
//             const isActive = current.includes(skin.slug);
//             return {
//                 ...prev,
//                 skinTypes: isActive ? current.filter(s => s !== skin.slug) : [...current, skin.slug]
//             };
//         });
//     }, []);

//     // const handleIngredientClick = useCallback((ing) => {
//     //     setFilters(prev => {
//     //         const current = prev.ingredients || [];
//     //         const isActive = current.includes(ing.slug);
//     //         return {
//     //             ...prev,
//     //             ingredients: isActive ? current.filter(i => i !== ing.slug) : [...current, ing.slug]
//     //         };
//     //     });
//     // }, []);



//     /* ── Sync URL when filters change ─────────────────────────────── */
//     useEffect(() => {
//         const newParams = new URLSearchParams();

//         const addArray = (key, arr) => {
//             if (Array.isArray(arr) && arr.length > 0) {
//                 arr.forEach(item => newParams.append(key, item));
//             }
//         };

//         addArray('ingredients', filters.ingredients);
//         addArray('skinTypes', filters.skinTypes);
//         addArray('brandIds', filters.brandIds);
//         addArray('categoryIds', filters.categoryIds);
//         addArray('formulations', filters.formulations);
//         addArray('finishes', filters.finishes);

//         if (filters.priceRange) {
//             if (filters.priceRange.min !== undefined) newParams.set('minPrice', filters.priceRange.min);
//             if (filters.priceRange.max !== null && filters.priceRange.max !== undefined) {
//                 newParams.set('maxPrice', filters.priceRange.max);
//             }
//         }

//         if (filters.discountMin != null) newParams.set('discountMin', filters.discountMin);
//         if (filters.minRating) newParams.set('minRating', filters.minRating);
//         if (filters.sort && filters.sort !== "recent") newParams.set('sort', filters.sort);

//         const newQuery = newParams.toString();
//         const currentQuery = searchParams.toString();

//         if (newQuery !== currentQuery) {
//             setSearchParams(newParams, { replace: true });
//         }
//     }, [filters, setSearchParams, searchParams]);


//     const handlePromotionClick = useCallback((promo) => {
//         if (promo.scope === "brand" && promo.targetSlug) {
//             navigate(`/brand/${promo.targetSlug}`);
//         } else if (promo.scope === "category" && promo.targetSlug) {
//             navigate(`/category/${promo.targetSlug}`);
//         } else {
//             navigate(`/promotion/${promo.slug}`);
//         }
//     }, [navigate]);

//     /* ── infinite scroll ────────────────────────────────────────────────────── */
//     const loadMore = useCallback(() => {
//         if (nextCursor && hasMore && !loadingMore) fetchProducts(nextCursor, false);
//     }, [nextCursor, hasMore, loadingMore]);

//     useEffect(() => {
//         if (!hasMore || loadingMore) return;
//         const obs = new IntersectionObserver(
//             ([e]) => e.isIntersecting && loadMore(),
//             { root: null, rootMargin: "100px", threshold: 0.1 }
//         );
//         const el = loaderRef.current;
//         if (el) obs.observe(el);
//         return () => el && obs.unobserve(el);
//     }, [loadMore, hasMore, loadingMore]);





//     useEffect(() => {
//         window.scrollTo({ top: 0, left: 0, behavior: "instant" });
//     }, []);



//     /* ── cart ───────────────────────────────────────────────────────────────── */
//     const handleAddToCart = async (prod) => {
//         setAddingToCart((p) => ({ ...p, [prod._id]: true }));
//         try {
//             const vars = Array.isArray(prod.variants) ? prod.variants : [];
//             const hasVar = vars.length > 0;
//             let payload;
//             if (hasVar) {
//                 const sel = selectedVariants[prod._id];
//                 if (!sel || sel.stock <= 0) { showToastMsg("Please select an in-stock variant.", "error"); return; }
//                 payload = { productId: prod._id, variants: [{ variantSku: getSku(sel), quantity: 1 }] };
//                 const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
//                 cache[prod._id] = sel;
//                 localStorage.setItem("cartVariantCache", JSON.stringify(cache));
//             } else {
//                 if (prod.stock <= 0) { showToastMsg("Product is out of stock.", "error"); return; }
//                 payload = { productId: prod._id, quantity: 1 };
//             }
//             const { data } = await axios.post(`${CART_API_BASE}/add`, payload, { withCredentials: true });
//             if (!data.success) throw new Error(data.message || "Cart add failed");
//             showToastMsg("Product added to cart!", "success");
//             navigate("/cartpage");
//         } catch (e) {
//             const msg = e.response?.data?.message || e.message || "Failed to add to cart";
//             showToastMsg(msg, "error");
//             if (e.response?.status === 401) navigate("/login", { state: { from: location.pathname } });
//         } finally {
//             setAddingToCart((p) => ({ ...p, [prod._id]: false }));
//         }
//     };

//     /* ── ui handlers ────────────────────────────────────────────────────────── */
//     const handleVariantSelect = (pid, v) => setSelectedVariants((p) => ({ ...p, [pid]: v }));
//     const openVariantOverlay = (pid, t = "all") => { setSelectedVariantType(t); setShowVariantOverlay(pid); };
//     const closeVariantOverlay = () => { setShowVariantOverlay(null); setSelectedVariantType("all"); };
//     const getProductSlug = (pr) => (pr.slugs?.[0] ? pr.slugs[0] : pr._id);

//     const isAnyFilterActive =
//         filters.brandIds.length > 0 || filters.categoryIds.length > 0 ||
//         filters.skinTypes.length > 0 || filters.formulations.length > 0 ||
//         filters.finishes.length > 0 || filters.ingredients.length > 0 ||
//         filters.priceRange || filters.discountMin || filters.minRating ||
//         filters.sort !== "recent" ||
//         (activeCategorySlug && activeCategorySlug !== pageDefault);

//     const handleClearAllFilters = () => {
//         setFilters(makeEmptyFilters());
//         setActiveCategorySlug(pageDefault);
//         setActiveCategoryName(
//             pageDefault ? trendingCategories.find((c) => c.slug === pageDefault)?.name || "" : ""
//         );
//     };

//     /* ── product card ───────────────────────────────────────────────────────── */
//     const renderProductCard = (prod) => {
//         const vars = Array.isArray(prod.variants) ? prod.variants : [];
//         const hasVar = vars.length > 0;
//         const isVariantSelected = !!selectedVariants[prod._id];
//         const displayVariant = selectedVariants[prod._id] || (hasVar ? (vars.find((v) => v.stock > 0) || vars[0]) : null);
//         const grouped = groupVariantsByType(vars);
//         const totalVars = vars.length;
//         const sku = displayVariant ? getSku(displayVariant) : null;
//         const inWl = sku ? isInWishlist(prod._id, sku) : false;
//         const slugPr = getProductSlug(prod);
//         const img = displayVariant?.images?.[0] || displayVariant?.image || prod.images?.[0] || "/placeholder.png";
//         const isAdding = addingToCart[prod._id];
//         const oos = hasVar ? displayVariant?.stock <= 0 : prod.stock <= 0;
//         const showSelectVariantButton = hasVar && !isVariantSelected;
//         const disabled = isAdding || (!showSelectVariantButton && oos);
//         let btnText = "Add to Cart";
//         if (isAdding) btnText = "Adding...";
//         else if (showSelectVariantButton) btnText = "Select Variant";
//         else if (oos) btnText = "Out of Stock";

//         return (
//             <div key={prod._id} className="col-6 col-md-4 col-lg-4 position-relative page-title-main-name">
//                 <button
//                     onClick={() => { if (displayVariant || !hasVar) toggleWishlist(prod, displayVariant || {}); }}
//                     disabled={wishlistLoading[prod._id]}
//                     style={{
//                         position: "absolute", top: 8, right: 8,
//                         cursor: wishlistLoading[prod._id] ? "not-allowed" : "pointer",
//                         color: inWl ? "#dc3545" : "#ccc", fontSize: 22, zIndex: 2,
//                         backgroundColor: "transparent",
//                         borderRadius: "50%",
//                         width: 34, height: 34, display: "flex", alignItems: "center",
//                         justifyContent: "center",
//                         // boxShadow: "0 2px 4px rgba(0,0,0,.1)",
//                         transition: "all .3s ease", border: "none",
//                     }}
//                     title={inWl ? "Remove from wishlist" : "Add to wishlist"}
//                 >
//                     {wishlistLoading[prod._id]
//                         ? <div className="spinner-border spinner-border-sm" role="status" />
//                         : inWl ? <FaHeart /> : <FaRegHeart />}
//                 </button>

//                 <img src={img} alt={prod.name} className="card-img-top"
//                     style={{ height: 200, objectFit: "contain", cursor: "pointer" }}
//                     onClick={() => navigate(`/product/${slugPr}`)} />

//                 <div className="card-body p-0 d-flex flex-column" style={{ height: 265, justifyContent: 'space-between' }}>
//                     <div className="brand-name text-muted small mb-1 fw-medium mt-2 text-start">{getBrandName(prod)}</div>
//                     <h5 className="card-title mt-2 align-items-center gap-1 page-title-main-name"
//                         style={{ cursor: "pointer" }} onClick={() => navigate(`/product/${slugPr}`)}>
//                         {prod.name}
//                     </h5>

//                     {hasVar && (
//                         <div className="m-0 p-0 ms-0">
//                             {isVariantSelected ? (
//                                 <div className="text-muted small" style={{ cursor: "pointer", display: "inline-block" }}
//                                     onClick={(e) => { e.stopPropagation(); openVariantOverlay(prod._id, "all"); }}
//                                     title="Click to change variant">
//                                     Variant: <span className="fw-bold text-dark">{getVariantDisplayText(displayVariant)}</span>
//                                     <FaChevronDown className="ms-1" style={{ fontSize: "10px" }} />
//                                 </div>
//                             ) : (
//                                 <div className="small text-muted" style={{ height: "20px", cursor: "pointer", display: "inline-block" }}
//                                     onClick={(e) => { e.stopPropagation(); openVariantOverlay(prod._id, "all"); }}>
//                                     {vars.length} Variants Available
//                                     <FaChevronDown className="ms-1" style={{ fontSize: "10px" }} />
//                                 </div>
//                             )}
//                         </div>
//                     )}

//                     <p className="fw-bold mb-3 mt-2 page-title-main-name" style={{ fontSize: 16 }}>
//                         {(() => {
//                             const price = displayVariant?.displayPrice || displayVariant?.discountedPrice || prod.price || 0;
//                             const orig = displayVariant?.originalPrice || displayVariant?.mrp || prod.mrp || price;
//                             const disc = orig > price;
//                             const pct = disc ? Math.round(((orig - price) / orig) * 100) : 0;
//                             return disc ? (
//                                 <>₹{price}
//                                     <span style={{ textDecoration: "line-through", color: "#888", marginLeft: 8 }}>₹{orig}</span>
//                                     <span style={{ color: "#e53e3e", marginLeft: 8, fontWeight: 600 }}>({pct}% OFF)</span>
//                                 </>
//                             ) : <>₹{orig}</>;
//                         })()}
//                     </p>

//                     <div className="mt-3">
//                         <button
//                             className={`btn w-100 d-flex align-items-center justify-content-center gap-2 addtocartbuttton page-title-main-name ${isAdding ? "btn-dark" : "btn-outline-dark"
//                                 }`}
//                             onClick={(e) => { e.stopPropagation(); showSelectVariantButton ? openVariantOverlay(prod._id, "all") : handleAddToCart(prod); }}
//                             disabled={disabled}
//                             style={{ transition: "background-color .3s ease, color .3s ease" }}
//                         >
//                             {isAdding
//                                 ? <><span className="spinner-border spinner-border-sm me-2" role="status" />Adding...</>
//                                 : <>{btnText}{!disabled && !isAdding && !showSelectVariantButton && <img src={Bag} alt="Bag" style={{ height: 20 }} />}</>}
//                         </button>
//                     </div>
//                 </div>

//                 {/* Variant Overlay */}
//                 {showVariantOverlay === prod._id && (
//                     <div className="variant-overlay" style={{ position: 'absolute' }} onClick={closeVariantOverlay}>
//                         <div className="variant-overlay-content w-100 p-0" onClick={(e) => e.stopPropagation()}
//                             style={{ width: "90%", maxWidth: 500, maxHeight: "80vh", background: "#fff", overflow: "hidden", display: "flex", flexDirection: "column" }}>
//                             <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
//                                 <h5 className="m-0 page-title-main-name">Select Variant ({totalVars})</h5>
//                                 <button onClick={closeVariantOverlay} style={{ background: "none", border: "none", fontSize: 24 }}>×</button>
//                             </div>
//                             <div className="variant-tabs d-flex">
//                                 <button className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "all" ? "active" : ""}`} onClick={() => setSelectedVariantType("all")}>All ({totalVars})</button>
//                                 {grouped.color.length > 0 && <button className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "color" ? "active" : ""}`} onClick={() => setSelectedVariantType("color")}>Colors ({grouped.color.length})</button>}
//                                 {grouped.text.length > 0 && <button className={`variant-tab flex-fill py-3 ${selectedVariantType === "text" ? "active" : ""}`} onClick={() => setSelectedVariantType("text")}>Sizes ({grouped.text.length})</button>}
//                             </div>
//                             <div className="p-3 overflow-auto flex-grow-1 page-title-main-name">
//                                 {(selectedVariantType === "all" || selectedVariantType === "color") && grouped.color.length > 0 && (
//                                     <div className="row row-cols-4 g-3">
//                                         {grouped.color.map((v) => {
//                                             const sel = selectedVariants[prod._id]?.sku === v.sku;
//                                             const oosV = v.stock <= 0;
//                                             return (
//                                                 <div className="col-lg-4 col-6" key={v.sku || v._id}>
//                                                     <div className="text-center" style={{ cursor: oosV ? "not-allowed" : "pointer" }}
//                                                         onClick={() => !oosV && (handleVariantSelect(prod._id, v), closeVariantOverlay())}>
//                                                         <div style={{ width: 28, height: 28, borderRadius: "20%", backgroundColor: v.hex || "#ccc", margin: "0 auto 8px", border: sel ? "3px solid #000" : "1px solid #ddd", opacity: oosV ? 0.5 : 1, position: "relative" }}>
//                                                             {sel && <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", color: "#fff", fontWeight: "bold" }}>✓</span>}
//                                                         </div>
//                                                         <div className="small page-title-main-name" style={{ fontSize: "14px !important" }}>{getVariantDisplayText(v)}</div>
//                                                         {oosV && <div className="text-danger small">Out of Stock</div>}
//                                                     </div>
//                                                 </div>
//                                             );
//                                         })}
//                                     </div>
//                                 )}
//                                 {(selectedVariantType === "all" || selectedVariantType === "text") && grouped.text.length > 0 && (
//                                     <div className="row row-cols-3 g-3">
//                                         {grouped.text.map((v) => {
//                                             const sel = selectedVariants[prod._id]?.sku === v.sku;
//                                             const oosV = v.stock <= 0;
//                                             return (
//                                                 <div className="col" key={v.sku || v._id}>
//                                                     <div className="text-center" style={{ cursor: oosV ? "not-allowed" : "pointer" }}
//                                                         onClick={() => !oosV && (handleVariantSelect(prod._id, v), closeVariantOverlay())}>
//                                                         <div style={{ padding: 10, borderRadius: 8, border: sel ? "3px solid #000" : "1px solid #ddd", background: sel ? "#f8f9fa" : "#fff", minHeight: 50, display: "flex", alignItems: "center", justifyContent: "center", opacity: oosV ? 0.5 : 1 }}>
//                                                             {getVariantDisplayText(v)}
//                                                         </div>
//                                                         {oosV && <div className="text-danger small mt-1">Out of Stock</div>}
//                                                     </div>
//                                                 </div>
//                                             );
//                                         })}
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         );
//     };

//     const brandFilterProps = {
//         filters,
//         setFilters,
//         filterData,
//         trendingCategories,
//         activeCategorySlug,
//         activeCategoryName,
//         onClearCategory: handleClearCategory,
//         onCategoryPillClick: handleCategoryPillClick,
//     };


//     if (loading)
//         return (
//             <div
//                 className="fullscreen-loader page-title-main-name"
//                 style={{
//                     minHeight: "100vh",
//                     width: "100%",
//                 }}
//             >
//                 <div className="text-center">
//                     <DotLottieReact className='foryoulanding-css'
//                         src="https:lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
//                         loop
//                         autoplay
//                     />


//                     <p className="text-muted mb-0">
//                         Please wait while we prepare the best products for you...
//                     </p>
//                 </div>
//             </div>
//         );


//     /* ── render ─────────────────────────────────────────────────────────────── */
//     return (
//         <>
//             {/* {loading && (
//                 <div className="fullscreen-loader page-title-main-name">
//                     <div className="spinner" /><p className="text-black">Loading products...</p>
//                 </div>
//             )} */}


//             <Header />

//             {/* <div className="banner-images text-center mt-xl-5 pt-xl-4">
//                 <img src={bannerImage || "/banner-placeholder.jpg"} alt="Banner"
//                     className="w-100 hero-slider-image-responsive"
//                     style={{ maxHeight: 400, objectFit: "cover" }} />
//             </div> */}


//             {/* 🔥 UPDATED: HERO BANNER REPLACED WITH SWIPER SLIDER 🔥 */}
//             {bannerImages?.length > 0 && (
//                 <section className="hero-slider text-center mt-xl-5 pt-xl-4 padding-left-rightss">
//                     <Swiper
//                         ref={swiperRef}
//                         modules={[Autoplay, Pagination, Navigation]}
//                         onSlideChange={() => {
//                             const swiper = swiperRef.current?.swiper;
//                             if (!swiper) return;
//                             document.querySelectorAll(".slide-video").forEach((v) => v.pause());
//                             const activeSlide = swiper.slides[swiper.activeIndex];
//                             const video = activeSlide?.querySelector("video");
//                             if (video) video.play().catch(() => { });
//                         }}
//                         loop={bannerImages.length > 1}
//                         autoplay={{ delay: 5000, disableOnInteraction: false }}
//                         pagination={{
//                             clickable: true,
//                             bulletClass: 'custom-swiper-bullet',
//                             bulletActiveClass: 'custom-swiper-bullet-active',
//                         }}
//                         navigation={bannerImages.length > 1}
//                         speed={800}
//                         style={{ height: "auto", width: "100%" }}
//                     >
//                         {bannerImages.map((banner, index) => {
//                             const imgUrl = typeof banner === "string" ? banner : banner.url;
//                             const targetLink = typeof banner === "object" ? banner.link : null;

//                             return (
//                                 <SwiperSlide key={index}>
//                                     <div
//                                         className="position-relative w-100 h-100 mt-5 pt-4 hero-slider-image-responsive"
//                                         style={{ cursor: targetLink ? "pointer" : "default" }}
//                                         onClick={() => {
//                                             if (!targetLink) return;
//                                             if (targetLink.startsWith("http")) window.open(targetLink, "_blank");
//                                             else navigate(targetLink);
//                                         }}
//                                     >
//                                         <img
//                                             src={imgUrl}
//                                             alt={pageTitle || `Banner ${index + 1}`}
//                                             className="w-100 h-100"
//                                             style={{ maxHeight: 400, objectFit: "cover" }}
//                                             onError={(e) => { e.currentTarget.src = "/banner-placeholder.jpg"; }}
//                                         />
//                                     </div>
//                                 </SwiperSlide>
//                             );
//                         })}
//                     </Swiper>
//                 </section>
//             )}

//             {/* Trending Categories */}
//             {/* {trendingCategories.length > 0 && (
//                 <div className="container-lg mt-4">
//                     <div className="d-flex overflow-auto py-2"
//                         style={{ gap: "0.75rem", whiteSpace: "nowrap", scrollbarWidth: "none" }}>
//                         {trendingCategories.map((cat) => {
//                             const isActive = activeCategorySlug === cat.slug;
//                             return (
//                                 <button key={cat.slug}
//                                     onClick={() => handleCategoryPillClick(cat)}
//                                     className={`btn px-4 mb-4 mx-auto  py-2 page-title-main-name flex-shrink-0 ${isActive ? "btn-dark" : "btn-outline-secondary"}`}
//                                     style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, transition: "all 0.18s ease", transform: isActive ? "scale(1.04)" : "scale(1)" }}
//                                     title={`Filter by ${cat.name}`}
//                                 >
//                                     {cat.name}
//                                 </button>
//                             );
//                         })}
//                     </div>
//                 </div>
//             )} */}


//             {trendingCategories.length > 0 && (
//                 <div className="container-lg mt-4 mb-4">
//                     <Swiper
//                         modules={[Navigation]}
//                         spaceBetween={10}
//                         slidesPerView="auto"
//                         navigation
//                         style={{ padding: "5px 0" }}
//                     >
//                         {trendingCategories.map((cat) => {
//                             const isActive = activeCategorySlug === cat.slug;

//                             return (
//                                 <SwiperSlide key={cat.slug} className="mx-auto" style={{ width: "auto" }}>
//                                     <button
//                                         onClick={() => handleCategoryPillClick(cat)}
//                                         className={`btn px-4 py-2 page-title-main-name ${isActive ? "btn-dark" : "btn-outline-secondary"
//                                             }`}
//                                         style={{
//                                             fontSize: 13,
//                                             fontWeight: isActive ? 600 : 400,
//                                             transition: "all 0.18s ease",
//                                             transform: isActive ? "scale(1.04)" : "scale(1)",
//                                             whiteSpace: "nowrap",
//                                         }}
//                                         title={`Filter by ${cat.name}`}
//                                     >
//                                         {cat.name}
//                                     </button>
//                                 </SwiperSlide>
//                             );
//                         })}
//                     </Swiper>
//                 </div>
//             )}

//             {/* Shop By Skin Types */}
//             {shopBySkinTypes.length > 0 && (
//                 <div className="container-lg mt-3">
//                     <h5 className="mb-2 page-title-main-name">Shop by Skin Type</h5>
//                     <div className="d-flex overflow-auto py-2"
//                         style={{ gap: "0.75rem", whiteSpace: "nowrap", scrollbarWidth: "none" }}>
//                         {shopBySkinTypes.map((skin) => {
//                             const isActive = filters.skinTypes.includes(skin.slug);
//                             return (
//                                 <button
//                                     key={skin.slug}
//                                     onClick={() => handleSkinTypeClick(skin)}
//                                     className={`btn rounded-pill px-4 py-2 page-title-main-name flex-shrink-0 ${isActive ? "btn-dark" : "btn-outline-secondary"}`}
//                                     style={{ fontSize: 13, fontWeight: isActive ? 600 : 400 }}
//                                 >
//                                     {skin.name}
//                                 </button>
//                             );
//                         })}
//                     </div>
//                 </div>
//             )}

//             {/* Shop By Ingredients */}
//             {shopByIngredients.length > 0 && (
//                 <div className="container-lg mt-3">
//                     <h5 className="mb-2 page-title-main-name">Shop by Ingredients</h5>
//                     <div className="d-flex overflow-auto py-2"
//                         style={{ gap: "0.75rem", whiteSpace: "nowrap", scrollbarWidth: "none" }}>
//                         {shopByIngredients.map((ing) => {
//                             const isActive = filters.ingredients.includes(ing.slug);
//                             return (
//                                 <button
//                                     key={ing.slug}
//                                     onClick={() => handleIngredientClick(ing)}
//                                     className={`btn rounded-pill px-4 py-2 page-title-main-name flex-shrink-0 ${isActive ? "btn-dark" : "btn-outline-secondary"}`}
//                                     style={{ fontSize: 13, fontWeight: isActive ? 600 : 400 }}
//                                 >
//                                     {ing.name}
//                                 </button>
//                             );
//                         })}
//                     </div>
//                 </div>
//             )}

//             {/* Special Offers / Promotions */}
//             {promotions.length > 0 && (
//                 <div className="container-lg mt-3">
//                     <h5 className="mb-2 page-title-main-name">Special Offers</h5>
//                     <div className="d-flex overflow-auto py-2"
//                         style={{ gap: "0.75rem", whiteSpace: "nowrap", scrollbarWidth: "none" }}>
//                         {promotions.map((promo) => (
//                             <button
//                                 key={promo._id}
//                                 onClick={() => handlePromotionClick(promo)}
//                                 className="btn px-4 py-2 page-title-main-name flex-shrink-0 btn-outline-danger"
//                                 style={{ fontSize: 13, fontWeight: 500 }}
//                             >
//                                 {promo.title} {promo.discountLabel && `(${promo.discountLabel})`}
//                             </button>
//                         ))}
//                     </div>
//                 </div>
//             )}

//             <div className="padding-left-rightss ms-lg-0 mx-lg-0 ms-3 mx-3">
//                 <h2 className="mb-4 d-none d-lg-block page-title-main-name">{pageTitle}</h2>

//                 <div className="row">
//                     <div className="d-none d-lg-block col-lg-3">
//                         <BrandFilter {...brandFilterProps} />
//                     </div>

//                     <div className="d-lg-none mb-3">
//                         <h2 className="mb-4 text-center">{pageTitle}</h2>
//                         <div className="w-100 filter-responsive rounded shadow-sm">
//                             <div className="container-fluid p-0">
//                                 <div className="row g-0" style={{ flexDirection: "row-reverse" }}>
//                                     <div className="col-6">
//                                         <button className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
//                                             onClick={() => setShowFilterOffcanvas(true)} style={{ gap: 12 }}>
//                                             <img src={filtering} alt="Filter" style={{ width: 25 }} />
//                                             <div className="text-start">
//                                                 <p className="mb-0 fs-6 fw-semibold page-title-main-name">Filter</p>
//                                                 <span className="text-muted small page-title-main-name">Tap to apply</span>
//                                             </div>
//                                         </button>
//                                     </div>
//                                     <div className="col-6 border-end">
//                                         <button className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
//                                             onClick={() => setShowSortOffcanvas(true)} style={{ gap: 12 }}>
//                                             <img src={updownarrow} alt="Sort" style={{ width: 25 }} />
//                                             <div className="text-start">
//                                                 <p className="mb-0 fs-6 fw-semibold page-title-main-name">Sort by</p>
//                                                 <span className="text-muted small">{filters.sort === "recent" ? "Relevance" : filters.sort}</span>
//                                             </div>
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Filter & Sort Offcanvas */}
//                     {showFilterOffcanvas && (
//                         <>
//                             <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
//                                 style={{ opacity: 0.5, zIndex: 1040 }} onClick={() => setShowFilterOffcanvas(false)} />
//                             <div className="position-fixed start-0 bottom-0 w-100 bg-white"
//                                 style={{ zIndex: 1050, borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: "85vh", boxShadow: "0 -4px 20px rgba(0,0,0,.2)" }}>
//                                 <div className="text-center py-3 position-relative">
//                                     <h5 className="mb-0 fw-bold">Filters</h5>
//                                     <button className="btn-close position-absolute end-0 me-3"
//                                         style={{ top: "50%", transform: "translateY(-50%)" }}
//                                         onClick={() => setShowFilterOffcanvas(false)} />
//                                     <div className="mx-auto mt-2 bg-secondary" style={{ height: 5, width: 50, borderRadius: 3 }} />
//                                 </div>
//                                 <div className="px-3 pb-4 overflow-auto" style={{ maxHeight: "70vh" }}>
//                                     <BrandFilter
//                                         {...brandFilterProps}
//                                         onClose={() => setShowFilterOffcanvas(false)}
//                                         onClearCategory={() => { handleClearCategory(); setShowFilterOffcanvas(false); }}
//                                         onCategoryPillClick={(cat) => {
//                                             handleCategoryPillClick(cat);
//                                             setShowFilterOffcanvas(false);
//                                         }}
//                                     />
//                                 </div>
//                             </div>
//                         </>
//                     )}

//                     {showSortOffcanvas && (
//                         <>
//                             <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
//                                 style={{ opacity: 0.5, zIndex: 1040 }} onClick={() => setShowSortOffcanvas(false)} />
//                             <div className="position-fixed start-0 bottom-0 w-100 bg-white"
//                                 style={{ zIndex: 1050, borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: "60vh", boxShadow: "0 -4px 12px rgba(0,0,0,.15)" }}>
//                                 <div className="text-center py-3 position-relative">
//                                     <h5 className="mb-0 fw-bold page-title-main-name">Sort by</h5>
//                                     <button className="btn-close position-absolute end-0 me-3"
//                                         style={{ top: "50%", transform: "translateY(-50%)" }}
//                                         onClick={() => setShowSortOffcanvas(false)} />
//                                     <div className="mx-auto mt-2 bg-secondary" style={{ height: 5, width: 50, borderRadius: 3 }} />
//                                 </div>
//                                 <div className="px-4 pb-4">
//                                     <div className="list-group">
//                                         {[
//                                             { value: "recent", label: "Relevance" },
//                                             { value: "priceHighToLow", label: "Price High to Low" },
//                                             { value: "priceLowToHigh", label: "Price Low to High" },
//                                         ].map(({ value, label }) => (
//                                             <label key={value} className="list-group-item py-3 d-flex align-items-center">
//                                                 <input className="form-check-input me-3" type="radio" name="sort"
//                                                     checked={filters.sort === value}
//                                                     onChange={() => { setFilters((p) => ({ ...p, sort: value })); setShowSortOffcanvas(false); }} />
//                                                 <span className="page-title-main-name">{label}</span>
//                                             </label>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         </>
//                     )}

//                     <div className="col-12 col-lg-9">
//                         <div className="mb-3 d-flex justify-content-between align-items-center">
//                             <span className="text-muted page-title-main-name">
//                                 {pageTitle || `Showing ${allProducts.length} products`}
//                                 {hasMore && pageTitle && " (Scroll for more)"}
//                             </span>
//                             {/* {isAnyFilterActive && (
//                                 <button className="btn btn-sm btn-outline-danger" onClick={handleClearAllFilters}>
//                                     Clear Filters
//                                 </button>
//                             )} */}
//                         </div>

//                         <div className="row g-4">
//                             {allProducts.length > 0
//                                 ? allProducts.map(renderProductCard)
//                                 : <div className="col-12 text-center py-5"><h4>No products found</h4><p className="text-muted">Try adjusting your filters.</p></div>}
//                         </div>

//                         {loadingMore && (
//                             <div className="text-center mt-4 py-4">
//                                 <div className="spinner-border text-primary" role="status">
//                                     <span className="visually-hidden">Loading more products...</span>
//                                 </div>
//                                 <p className="mt-2">Loading more products...</p>
//                             </div>
//                         )}

//                         <div ref={loaderRef} style={{ height: 20, marginTop: 20 }} />

//                         {!hasMore && allProducts.length > 0 && (
//                             <div className="text-center mt-4 py-4 border-top">
//                                 <p className="text-muted">🎉 You've reached the end! No more products to show.</p>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//             <Footer />
//         </>
//     );
// }












/* ProductPage – Unified API & Full Feature Edition with Multi-Filter Support */
import React, { useState, useEffect, useContext, useRef, useCallback, useMemo } from "react";
import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { FaStar, FaHeart, FaRegHeart, FaChevronDown } from "react-icons/fa";
import Header from "./Header";
import Footer from "./Footer";
import { CartContext } from "../Context/CartContext";
import { UserContext } from "./UserContext.jsx";
import BrandFilter from "./BrandFilter";
import "../css/ProductPage.css";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import updownarrow from "../assets/updownarrow.svg";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import filtering from "../assets/filtering.svg";
import Bag from "../assets/Bag.svg";

const CART_API_BASE = "https://beauty.joyory.com/api/user/cart";
const PRODUCT_ALL_API = "https://beauty.joyory.com/api/user/products/all";

/* ─── helpers ───────────────────────────────────────────────────────────── */
const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || "default"}`;

const isValidHexColor = (hex) => {
    if (!hex || typeof hex !== "string") return false;
    return /^#([a-f0-9]{6}|[a-f0-9]{3})$/.test(hex.trim().toLowerCase());
};

const getVariantDisplayText = (v) =>
    (v.shadeName || v.name || v.size || v.ml || v.weight || "Default").toUpperCase();

const groupVariantsByType = (variants) => {
    const g = { color: [], text: [] };
    (variants || []).forEach((v) => {
        if (!v) return;
        v.hex && isValidHexColor(v.hex) ? g.color.push(v) : g.text.push(v);
    });
    return g;
};

const getBrandName = (p) => {
    if (!p?.brand) return "Unknown Brand";
    if (typeof p.brand === "object" && p.brand.name) return p.brand.name;
    if (typeof p.brand === "string") return p.brand;
    return "Unknown Brand";
};

export default function ProductPage() {
    const params = useParams();
    const slug = params.slug || params["*"];
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    let effectiveSlug = slug;
    if (slug && slug.includes("/")) {
        const segments = slug.split("/");
        effectiveSlug = segments[segments.length - 1];
    }

    /* ── state ──────────────────────────────────────────────────────────────── */
    const [allProducts, setAllProducts] = useState([]);
    const [pageTitle, setPageTitle] = useState("Products");
    const [bannerImages, setBannerImages] = useState([]); // 🔥 Changed to array
    const swiperRef = useRef(null); // 🔥 Added for Swiper

    const [trendingCategories, setTrendingCategories] = useState([]);
    const [shopBySkinTypes, setShopBySkinTypes] = useState([]);
    const [shopByIngredients, setShopByIngredients] = useState([]);
    const [promotions, setPromotions] = useState([]);

    const [filterData, setFilterData] = useState(null);

    const activeCategorySlug = useMemo(() => {
        return location.pathname.includes("/category/") && effectiveSlug ? effectiveSlug : null;
    }, [location.pathname, effectiveSlug]);
    const [activeCategoryName, setActiveCategoryName] = useState("");

    const [selectedVariants, setSelectedVariants] = useState({});
    const [addingToCart, setAddingToCart] = useState({});
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [nextCursor, setNextCursor] = useState(null);

    const [wishlistLoading, setWishlistLoading] = useState({});
    const [wishlistData, setWishlistData] = useState([]);

    const [filters, setFilters] = useState(() => {
        const initial = {
            brandIds: [], categoryIds: [], skinTypes: [], formulations: [],
            finishes: [], ingredients: [], priceRange: null, discountMin: null,
            minRating: "", sort: "recent"
        };
        const getMultiParam = (key) => {
            const values = searchParams.getAll(key);
            if (values.length > 0) return values;
            const commaValue = searchParams.get(key);
            if (commaValue) return commaValue.split(',').map(s => s.trim()).filter(Boolean);
            return [];
        };
        ['ingredients', 'skinTypes', 'brandIds', 'categoryIds', 'formulations', 'finishes'].forEach(key => {
            initial[key] = getMultiParam(key);
        });
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        if (minPrice !== null || maxPrice !== null) {
            initial.priceRange = {
                min: minPrice ? parseFloat(minPrice) : 0,
                max: maxPrice ? parseFloat(maxPrice) : null,
            };
        }
        const discountMin = searchParams.get('discountMin');
        if (discountMin !== null) initial.discountMin = parseFloat(discountMin);
        const minRating = searchParams.get('minRating');
        if (minRating !== null) initial.minRating = minRating;
        const sortParam = searchParams.get('sort');
        if (sortParam !== null && ['recent', 'priceHighToLow', 'priceLowToHigh'].includes(sortParam)) {
            initial.sort = sortParam;
        }
        return initial;
    });

    const [showFilterOffcanvas, setShowFilterOffcanvas] = useState(false);
    const [showSortOffcanvas, setShowSortOffcanvas] = useState(false);
    const [showVariantOverlay, setShowVariantOverlay] = useState(null);
    const [selectedVariantType, setSelectedVariantType] = useState("all");

    const { user } = useContext(UserContext);
    const loaderRef = useRef(null);

    /* ── toast ──────────────────────────────────────────────────────────────── */
    const showToastMsg = (msg, type = "error", dur = 3000) => {
        const t = document.createElement("div");
        t.className = `toast-notification toast-${type}`;
        t.style.cssText = `
      position:fixed;top:20px;right:20px;padding:12px 20px;
      border-radius:8px;color:#fff;z-index:9999;
      background:${type === "error" ? "#f56565" : "#48bb78"};
      box-shadow:0 4px 12px rgba(0,0,0,.15);
    `;
        t.textContent = msg;
        document.body.appendChild(t);
        setTimeout(() => t.remove(), dur);
    };

    /* ── wishlist ───────────────────────────────────────────────────────────── */
    const isInWishlist = (pid, sku) => {
        if (!pid || !sku) return false;
        return wishlistData.some((it) => (it.productId === pid || it._id === pid) && it.sku === sku);
    };

    const fetchWishlistData = async () => {
        try {
            if (user && !user.guest) {
                const { data } = await axios.get("https://beauty.joyory.com/api/user/wishlist", { withCredentials: true });
                if (data.success) setWishlistData(data.wishlist || []);
            } else {
                const local = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
                setWishlistData(local.map((it) => ({ ...it, productId: it._id })));
            }
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchWishlistData(); }, [user]);

    const toggleWishlist = async (prod, variant) => {
        if (!user || user.guest) {
            showToastMsg("Please login to use wishlist", "error");
            navigate("/login", { state: { from: location.pathname } });
            return;
        }
        if (!prod || !variant) return showToastMsg("Select a variant first", "error");
        const pid = prod._id;
        const sku = getSku(variant);
        setWishlistLoading((p) => ({ ...p, [pid]: true }));
        try {
            const inWl = isInWishlist(pid, sku);
            if (user && !user.guest) {
                if (inWl) {
                    await axios.delete(`https://beauty.joyory.com/api/user/wishlist/${pid}`, { withCredentials: true, data: { sku } });
                    showToastMsg("Removed from wishlist!", "success");
                } else {
                    await axios.post(`https://beauty.joyory.com/api/user/wishlist/${pid}`, { sku }, { withCredentials: true });
                    showToastMsg("Added to wishlist!", "success");
                }
                await fetchWishlistData();
            } else {
                let g = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
                if (inWl) {
                    g = g.filter((it) => !(it._id === pid && it.sku === sku));
                    showToastMsg("Removed from wishlist!", "success");
                } else {
                    g.push({
                        _id: pid, name: prod.name, brand: getBrandName(prod),
                        displayPrice: variant.displayPrice || variant.discountedPrice || prod.price,
                        originalPrice: variant.originalPrice || variant.mrp || prod.price,
                        image: variant.images?.[0] || prod.images?.[0],
                        sku, variantName: variant.shadeName || "Default", stock: variant.stock,
                    });
                    showToastMsg("Added to wishlist!", "success");
                }
                localStorage.setItem("guestWishlist", JSON.stringify(g));
                await fetchWishlistData();
            }
        } catch (e) {
            showToastMsg(e.response?.data?.message || "Wishlist error", "error");
        } finally {
            setWishlistLoading((p) => ({ ...p, [pid]: false }));
        }
    };

    /* ── fetch products ─────────────────────────────────────────────────────── */
    const buildQueryParams = (cursor = null) => {
        const p = new URLSearchParams();
        const path = location.pathname.toLowerCase();

        if (activeCategorySlug) {
            p.append("categoryIds", activeCategorySlug);
        } else if (path.includes("/category/")) {
            p.append("categoryIds", effectiveSlug);
        } else if (path.includes("/skintype/")) {
            p.append("skinTypes", effectiveSlug);
        } else if (path.includes("/ingredients/")) {
            p.append("ingredients", effectiveSlug);
        } else if (path.includes("/promotion/")) {
            p.append("promoSlug", effectiveSlug);
        }

        const q = searchParams.get("q") || searchParams.get("search");
        if (q) p.append("q", q);

        filters.brandIds?.forEach((id) => p.append("brandIds", id));
        filters.categoryIds?.forEach((id) => p.append("categoryIds", id));
        filters.skinTypes?.forEach((n) => p.append("skinTypes", n));
        filters.formulations?.forEach((id) => p.append("formulations", id));
        filters.finishes?.forEach((s) => p.append("finishes", s));
        filters.ingredients?.forEach((s) => p.append("ingredients", s));
        if (filters.minRating) p.append("minRating", filters.minRating);

        // Handle price range filter
        if (filters.priceRange) {
            p.append("minPrice", filters.priceRange.min);
            if (filters.priceRange.max != null) p.append("maxPrice", filters.priceRange.max);
        }

        // Handle discount filter - using discountMin parameter
        if (filters.discountMin && filters.discountMin > 0) {
            p.append("discountMin", filters.discountMin);
        }

        if (filters.sort) p.append("sort", filters.sort);
        if (cursor) p.append("cursor", cursor);
        p.append("limit", "9");

        const queryString = p.toString();
        console.log("API Query →", `${PRODUCT_ALL_API}?${queryString}`);
        return queryString;
    };

    const fetchProducts = async (cursor = null, reset = false) => {
        try {
            if (reset) {
                setLoading(true);
                // Keep allProducts as is until fetch completes for a smoother feel
                setNextCursor(null);
                setHasMore(true);
            } else {
                setLoadingMore(true);
            }

            const { data } = await axios.get(
                `${PRODUCT_ALL_API}?${buildQueryParams(cursor)}`,
                { withCredentials: true }
            );

            // title & banner
            const q = searchParams.get("q") || searchParams.get("search");
            if (q) setPageTitle(`Search Results for "${q}"`);
            else if (data.titleMessage) setPageTitle(data.titleMessage);
            else if (data.category?.name) setPageTitle(data.category.name);
            else if (data.promoMeta?.name) setPageTitle(data.promoMeta.name);
            else if (data.skinType?.name) setPageTitle(data.skinType.name);
            else setPageTitle("Products");

            // 🔥 CHANGED: Extract banner array
            let extractedBanners = [];
            if (data.bannerImage && Array.isArray(data.bannerImage)) {
                extractedBanners = data.bannerImage;
            } else if (data.category?.bannerImage && Array.isArray(data.category.bannerImage)) {
                extractedBanners = data.category.bannerImage;
            } else if (data.promoMeta?.bannerImage && Array.isArray(data.promoMeta.bannerImage)) {
                extractedBanners = data.promoMeta.bannerImage;
            } else if (data.skinType?.bannerImage && Array.isArray(data.skinType.bannerImage)) {
                extractedBanners = data.skinType.bannerImage;
            } else if (data.bannerImage) {
                extractedBanners = [data.bannerImage];
            } else if (data.category?.bannerImage) {
                extractedBanners = [data.category.bannerImage];
            } else if (data.promoMeta?.bannerImage) {
                extractedBanners = [data.promoMeta.bannerImage];
            } else if (data.skinType?.bannerImage) {
                extractedBanners = [data.skinType.bannerImage];
            }

            setBannerImages(extractedBanners);

            // Shop By Sections
            if (data.skinTypes && Array.isArray(data.skinTypes)) {
                setShopBySkinTypes(data.skinTypes);
            }
            if (data.shopByIngredients && Array.isArray(data.shopByIngredients)) {
                setShopByIngredients(data.shopByIngredients);
            }
            if (data.promotions && Array.isArray(data.promotions)) {
                setPromotions(data.promotions);
            }

            if (data.trendingCategories && Array.isArray(data.trendingCategories)) {
                setTrendingCategories(data.trendingCategories);
                if (effectiveSlug && !activeCategoryName) {
                    const found = data.trendingCategories.find((c) => c.slug === effectiveSlug);
                    if (found) setActiveCategoryName(found.name);
                }
            } else {
                setTrendingCategories([]);
            }

            if (data.category?.name && !activeCategoryName && effectiveSlug) {
                setActiveCategoryName(data.category.name);
            }

            if (reset && data.filters) {
                setFilterData(data.filters);
            }

            const prods = data.products || [];
            const pg = data.pagination || {};

            if (reset) setAllProducts(prods);
            else setAllProducts((prev) => [...prev, ...prods]);

            setHasMore(pg.hasMore || false);
            setNextCursor(pg.nextCursor || null);
        } catch (e) {
            console.error(e);
            showToastMsg("Failed to fetch products", "error");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        if (location.pathname.includes("/category/") && effectiveSlug) {
            if (trendingCategories.length > 0) {
                const found = trendingCategories.find(c => c.slug === effectiveSlug);
                if (found) setActiveCategoryName(found.name);
            }
        } else {
            setActiveCategoryName("");
        }
    }, [effectiveSlug, location.pathname, trendingCategories]);

    /* ── Parse URL query parameters on mount (FIXED) ────────────────────────────── */
    useEffect(() => {
        const initialFilters = {
            brandIds: [], categoryIds: [], skinTypes: [], formulations: [],
            finishes: [], ingredients: [], priceRange: null, discountMin: null,
            minRating: "", sort: "recent"
        };

        const getMultiParam = (key) => {
            const values = searchParams.getAll(key);
            if (values.length > 0) return values;
            const commaValue = searchParams.get(key);
            if (commaValue) return commaValue.split(',').map(s => s.trim()).filter(Boolean);
            return [];
        };

        ['ingredients', 'skinTypes', 'brandIds', 'categoryIds', 'formulations', 'finishes'].forEach(key => {
            initialFilters[key] = getMultiParam(key);
        });

        // Restore price range
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        if (minPrice !== null || maxPrice !== null) {
            initialFilters.priceRange = {
                min: minPrice ? parseFloat(minPrice) : 0,
                max: maxPrice ? parseFloat(maxPrice) : null,
            };
        }

        // Restore discountMin
        const discountMin = searchParams.get('discountMin');
        if (discountMin !== null) initialFilters.discountMin = parseFloat(discountMin);

        // Restore minRating
        const minRating = searchParams.get('minRating');
        if (minRating !== null) initialFilters.minRating = minRating;

        // Restore sort
        const sortParam = searchParams.get('sort');
        if (sortParam !== null && ['recent', 'priceHighToLow', 'priceLowToHigh'].includes(sortParam)) {
            initialFilters.sort = sortParam;
        }

        setFilters(prev => {
            if (JSON.stringify(prev) !== JSON.stringify(initialFilters)) {
                console.log("✅ Filters restored from URL:", initialFilters);
                return initialFilters;
            }
            return prev;
        });
    }, [searchParams]);   // ← Important: depend on searchParams

    /* ── Sync URL query parameters when filters change ──────────────────── */
    useEffect(() => {
        const newParams = new URLSearchParams();

        const addArrayParam = (key, arr) => {
            if (arr && arr.length) arr.forEach(v => newParams.append(key, v));
        };

        addArrayParam('brandIds', filters.brandIds);
        addArrayParam('categoryIds', filters.categoryIds);
        addArrayParam('skinTypes', filters.skinTypes);
        addArrayParam('formulations', filters.formulations);
        addArrayParam('finishes', filters.finishes);
        addArrayParam('ingredients', filters.ingredients);

        if (filters.priceRange) {
            if (filters.priceRange.min !== undefined) newParams.set('minPrice', filters.priceRange.min);
            if (filters.priceRange.max != null) newParams.set('maxPrice', filters.priceRange.max);
        }

        if (filters.discountMin) {
            newParams.set('discountMin', filters.discountMin);
        }

        if (filters.minRating) newParams.set('minRating', filters.minRating);
        if (filters.sort !== 'recent') newParams.set('sort', filters.sort);

        const currentQuery = searchParams.toString();
        const newQuery = newParams.toString();
        if (currentQuery !== newQuery) {
            setSearchParams(newParams, { replace: true });
        }
    }, [filters, setSearchParams, searchParams]);

    // Fetch products when filters or page context change
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProducts(null, true);
        }, 400); // 400ms debounce for efficiency

        return () => clearTimeout(timer);
    }, [effectiveSlug, location.pathname, filters, activeCategorySlug]);

    /* ── helpers ────────────────────────────────────────────────────────────── */
    const pageDefault = location.pathname.includes("/category/") ? effectiveSlug : null;

    const makeEmptyFilters = () => ({
        brandIds: [], categoryIds: [], skinTypes: [], formulations: [],
        finishes: [], ingredients: [], priceRange: null, discountMin: null,
        minRating: "", sort: "recent",
    });

    /* ── CATEGORY PILL CLICK ────────────────────────────────────────────────── */
    const handleCategoryPillClick = useCallback((cat) => {
        if (slug && slug.includes("/")) {
            const segments = slug.split("/");
            // Replace the last segment with the new category slug
            segments[segments.length - 1] = cat.slug;
            navigate(`/category/${segments.join("/")}`);
        } else if (slug) {
            // If we are at /category/skin, append the subcategory to make it hierarchical
            navigate(`/category/${slug}/${cat.slug}`);
        } else {
            navigate(`/category/${cat.slug}`);
        }
    }, [navigate, slug]);

    const handleClearCategory = useCallback(() => {
        if (slug && slug.includes("/")) {
            const segments = slug.split("/");
            segments.pop(); // Go up one level
            const newPath = segments.join("/");
            if (newPath) {
                navigate(`/category/${newPath}`);
            } else {
                navigate("/products");
            }
        } else {
            navigate("/products");
        }
    }, [navigate, slug]);

    /* ── Click Handlers ─────────────────────────────────────────────────────── */
    const handleSkinTypeClick = useCallback((skin) => {
        setFilters(prev => {
            const current = prev.skinTypes || [];
            const isActive = current.includes(skin.slug);
            return {
                ...prev,
                skinTypes: isActive ? current.filter(s => s !== skin.slug) : [...current, skin.slug]
            };
        });
    }, []);

    const handleIngredientClick = useCallback((ing) => {
        setFilters(prev => {
            const current = prev.ingredients || [];
            const isActive = current.includes(ing.slug);
            return {
                ...prev,
                ingredients: isActive ? current.filter(i => i !== ing.slug) : [...current, ing.slug]
            };
        });
    }, []);

    /* ── Sync URL when filters change ─────────────────────────────── */
    useEffect(() => {
        const newParams = new URLSearchParams();

        const addArray = (key, arr) => {
            if (Array.isArray(arr) && arr.length > 0) {
                arr.forEach(item => newParams.append(key, item));
            }
        };

        addArray('ingredients', filters.ingredients);
        addArray('skinTypes', filters.skinTypes);
        addArray('brandIds', filters.brandIds);
        addArray('categoryIds', filters.categoryIds);
        addArray('formulations', filters.formulations);
        addArray('finishes', filters.finishes);

        if (filters.priceRange) {
            if (filters.priceRange.min !== undefined) newParams.set('minPrice', filters.priceRange.min);
            if (filters.priceRange.max !== null && filters.priceRange.max !== undefined) {
                newParams.set('maxPrice', filters.priceRange.max);
            }
        }

        if (filters.discountMin != null) newParams.set('discountMin', filters.discountMin);
        if (filters.minRating) newParams.set('minRating', filters.minRating);
        if (filters.sort && filters.sort !== "recent") newParams.set('sort', filters.sort);

        const newQuery = newParams.toString();
        const currentQuery = searchParams.toString();

        if (newQuery !== currentQuery) {
            setSearchParams(newParams, { replace: true });
        }
    }, [filters, setSearchParams, searchParams]);

    const handlePromotionClick = useCallback((promo) => {
        if (promo.scope === "brand" && promo.targetSlug) {
            navigate(`/brand/${promo.targetSlug}`);
        } else if (promo.scope === "category" && promo.targetSlug) {
            navigate(`/category/${promo.targetSlug}`);
        } else {
            navigate(`/promotion/${promo.slug}`);
        }
    }, [navigate]);

    /* ── infinite scroll ────────────────────────────────────────────────────── */
    const loadMore = useCallback(() => {
        if (nextCursor && hasMore && !loadingMore) fetchProducts(nextCursor, false);
    }, [nextCursor, hasMore, loadingMore]);

    useEffect(() => {
        if (!hasMore || loadingMore) return;
        const obs = new IntersectionObserver(
            ([e]) => e.isIntersecting && loadMore(),
            { root: null, rootMargin: "100px", threshold: 0.1 }
        );
        const el = loaderRef.current;
        if (el) obs.observe(el);
        return () => el && obs.unobserve(el);
    }, [loadMore, hasMore, loadingMore]);

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, []);

    /* ── cart ───────────────────────────────────────────────────────────────── */
    const handleAddToCart = async (prod) => {
        setAddingToCart((p) => ({ ...p, [prod._id]: true }));
        try {
            const vars = Array.isArray(prod.variants) ? prod.variants : [];
            const hasVar = vars.length > 0;
            let payload;
            if (hasVar) {
                const sel = selectedVariants[prod._id];
                if (!sel || sel.stock <= 0) { showToastMsg("Please select an in-stock variant.", "error"); return; }
                payload = { productId: prod._id, variants: [{ variantSku: getSku(sel), quantity: 1 }] };
                const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
                cache[prod._id] = sel;
                localStorage.setItem("cartVariantCache", JSON.stringify(cache));
            } else {
                if (prod.stock <= 0) { showToastMsg("Product is out of stock.", "error"); return; }
                payload = { productId: prod._id, quantity: 1 };
            }
            const { data } = await axios.post(`${CART_API_BASE}/add`, payload, { withCredentials: true });
            if (!data.success) throw new Error(data.message || "Cart add failed");
            showToastMsg("Product added to cart!", "success");
            navigate("/cartpage");
        } catch (e) {
            const msg = e.response?.data?.message || e.message || "Failed to add to cart";
            showToastMsg(msg, "error");
            if (e.response?.status === 401) navigate("/login", { state: { from: location.pathname } });
        } finally {
            setAddingToCart((p) => ({ ...p, [prod._id]: false }));
        }
    };

    /* ── ui handlers ────────────────────────────────────────────────────────── */
    const handleVariantSelect = (pid, v) => setSelectedVariants((p) => ({ ...p, [pid]: v }));
    const openVariantOverlay = (pid, t = "all") => { setSelectedVariantType(t); setShowVariantOverlay(pid); };
    const closeVariantOverlay = () => { setShowVariantOverlay(null); setSelectedVariantType("all"); };
    const getProductSlug = (pr) => (pr.slugs?.[0] ? pr.slugs[0] : pr._id);

    const isAnyFilterActive =
        filters.brandIds.length > 0 || filters.categoryIds.length > 0 ||
        filters.skinTypes.length > 0 || filters.formulations.length > 0 ||
        filters.finishes.length > 0 || filters.ingredients.length > 0 ||
        filters.priceRange || filters.discountMin || filters.minRating ||
        filters.sort !== "recent" ||
        (activeCategorySlug && activeCategorySlug !== pageDefault);

    const handleClearAllFilters = () => {
        setFilters(makeEmptyFilters());
        if (slug && slug.includes("/")) {
            const segments = slug.split("/");
            segments.pop(); // Go up one level
            const newPath = segments.join("/");
            if (newPath) {
                navigate(`/category/${newPath}`);
            } else {
                navigate("/products");
            }
        } else {
            navigate("/products");
        }
    };

    /* ── product card ───────────────────────────────────────────────────────── */
    const renderProductCard = (prod) => {
        const vars = Array.isArray(prod.variants) ? prod.variants : [];
        const hasVar = vars.length > 0;
        const isVariantSelected = !!selectedVariants[prod._id];
        const displayVariant = selectedVariants[prod._id] || (hasVar ? (vars.find((v) => v.stock > 0) || vars[0]) : null);
        const grouped = groupVariantsByType(vars);
        const totalVars = vars.length;
        const sku = displayVariant ? getSku(displayVariant) : null;
        const inWl = sku ? isInWishlist(prod._id, sku) : false;
        const slugPr = getProductSlug(prod);
        const img = displayVariant?.images?.[0] || displayVariant?.image || prod.images?.[0] || "/placeholder.png";
        const isAdding = addingToCart[prod._id];
        const oos = hasVar ? displayVariant?.stock <= 0 : prod.stock <= 0;
        const showSelectVariantButton = hasVar && !isVariantSelected;
        const disabled = isAdding || (!showSelectVariantButton && oos);
        let btnText = "Add to Cart";
        if (isAdding) btnText = "Adding...";
        else if (showSelectVariantButton) btnText = "Select Variant";
        else if (oos) btnText = "Out of Stock";

        return (
            <div key={prod._id} className="col-6 col-md-4 col-lg-4 position-relative page-title-main-name">
                <button
                    onClick={() => { if (displayVariant || !hasVar) toggleWishlist(prod, displayVariant || {}); }}
                    disabled={wishlistLoading[prod._id]}
                    style={{
                        position: "absolute", top: 8, right: 8,
                        cursor: wishlistLoading[prod._id] ? "not-allowed" : "pointer",
                        color: inWl ? "#dc3545" : "#ccc", fontSize: 22, zIndex: 2,
                        backgroundColor: "transparent",
                        borderRadius: "50%",
                        width: 34, height: 34, display: "flex", alignItems: "center",
                        justifyContent: "center",
                        transition: "all .3s ease", border: "none",
                    }}
                    title={inWl ? "Remove from wishlist" : "Add to wishlist"}
                >
                    {wishlistLoading[prod._id]
                        ? <div className="spinner-border spinner-border-sm" role="status" />
                        : inWl ? <FaHeart /> : <FaRegHeart />}
                </button>

                <img src={img} alt={prod.name} className="card-img-top"
                    style={{ height: 200, objectFit: "contain", cursor: "pointer" }}
                    onClick={() => navigate(`/product/${slugPr}`)} />

                <div className="card-body p-0 d-flex flex-column" style={{ height: 265, justifyContent: 'space-between' }}>
                    <div className="brand-name text-muted small mb-1 fw-medium mt-2 text-start">{getBrandName(prod)}</div>
                    <h5 className="card-title mt-2 align-items-center gap-1 page-title-main-name"
                        style={{ cursor: "pointer" }} onClick={() => navigate(`/product/${slugPr}`)}>
                        {prod.name}
                    </h5>

                    {hasVar && (
                        <div className="m-0 p-0 ms-0">
                            {isVariantSelected ? (
                                <div className="text-muted small" style={{ cursor: "pointer", display: "inline-block" }}
                                    onClick={(e) => { e.stopPropagation(); openVariantOverlay(prod._id, "all"); }}
                                    title="Click to change variant">
                                    Variant: <span className="fw-bold text-dark">{getVariantDisplayText(displayVariant)}</span>
                                    <FaChevronDown className="ms-1" style={{ fontSize: "10px" }} />
                                </div>
                            ) : (
                                <div className="small text-muted" style={{ height: "20px", cursor: "pointer", display: "inline-block" }}
                                    onClick={(e) => { e.stopPropagation(); openVariantOverlay(prod._id, "all"); }}>
                                    {vars.length} Variants Available
                                    <FaChevronDown className="ms-1" style={{ fontSize: "10px" }} />
                                </div>
                            )}
                        </div>
                    )}

                    <p className="fw-bold mb-3 mt-2 page-title-main-name" style={{ fontSize: 16 }}>
                        {(() => {
                            const price = displayVariant?.displayPrice || displayVariant?.discountedPrice || prod.price || 0;
                            const orig = displayVariant?.originalPrice || displayVariant?.mrp || prod.mrp || price;
                            const disc = orig > price;
                            const pct = disc ? Math.round(((orig - price) / orig) * 100) : 0;
                            return disc ? (
                                <>₹{price}
                                    <span style={{ textDecoration: "line-through", color: "#888", marginLeft: 8 }}>₹{orig}</span>
                                    <span style={{ color: "#e53e3e", marginLeft: 8, fontWeight: 600 }}>({pct}% OFF)</span>
                                </>
                            ) : <>₹{orig}</>;
                        })()}
                    </p>

                    <div className="mt-3">
                        <button
                            className={`btn w-100 d-flex align-items-center justify-content-center gap-2 addtocartbuttton page-title-main-name ${isAdding ? "btn-dark" : "btn-outline-dark"
                                }`}
                            onClick={(e) => { e.stopPropagation(); showSelectVariantButton ? openVariantOverlay(prod._id, "all") : handleAddToCart(prod); }}
                            disabled={disabled}
                            style={{ transition: "background-color .3s ease, color .3s ease" }}
                        >
                            {isAdding
                                ? <><span className="spinner-border spinner-border-sm me-2" role="status" />Adding...</>
                                : <>{btnText}{!disabled && !isAdding && !showSelectVariantButton && <img src={Bag} alt="Bag" style={{ height: 20 }} />}</>}
                        </button>
                    </div>
                </div>

                {/* Variant Overlay */}
                {showVariantOverlay === prod._id && (
                    <div className="variant-overlay" style={{ position: 'absolute' }} onClick={closeVariantOverlay}>
                        <div className="variant-overlay-content w-100 p-0" onClick={(e) => e.stopPropagation()}
                            style={{ width: "90%", maxWidth: 500, maxHeight: "80vh", background: "#fff", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                            <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
                                <h5 className="m-0 page-title-main-name">Select Variant ({totalVars})</h5>
                                <button onClick={closeVariantOverlay} style={{ background: "none", border: "none", fontSize: 24 }}>×</button>
                            </div>
                            <div className="variant-tabs d-flex">
                                <button className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "all" ? "active" : ""}`} onClick={() => setSelectedVariantType("all")}>All ({totalVars})</button>
                                {grouped.color.length > 0 && <button className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "color" ? "active" : ""}`} onClick={() => setSelectedVariantType("color")}>Colors ({grouped.color.length})</button>}
                                {grouped.text.length > 0 && <button className={`variant-tab flex-fill py-3 ${selectedVariantType === "text" ? "active" : ""}`} onClick={() => setSelectedVariantType("text")}>Sizes ({grouped.text.length})</button>}
                            </div>
                            <div className="p-3 overflow-auto flex-grow-1 page-title-main-name">
                                {(selectedVariantType === "all" || selectedVariantType === "color") && grouped.color.length > 0 && (
                                    <div className="row row-cols-4 g-3">
                                        {grouped.color.map((v) => {
                                            const sel = selectedVariants[prod._id]?.sku === v.sku;
                                            const oosV = v.stock <= 0;
                                            return (
                                                <div className="col-lg-4 col-6" key={v.sku || v._id}>
                                                    <div className="text-center" style={{ cursor: oosV ? "not-allowed" : "pointer" }}
                                                        onClick={() => !oosV && (handleVariantSelect(prod._id, v), closeVariantOverlay())}>
                                                        <div style={{ width: 28, height: 28, borderRadius: "20%", backgroundColor: v.hex || "#ccc", margin: "0 auto 8px", border: sel ? "3px solid #000" : "1px solid #ddd", opacity: oosV ? 0.5 : 1, position: "relative" }}>
                                                            {sel && <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", color: "#fff", fontWeight: "bold" }}>✓</span>}
                                                        </div>
                                                        <div className="small page-title-main-name" style={{ fontSize: "14px !important" }}>{getVariantDisplayText(v)}</div>
                                                        {oosV && <div className="text-danger small">Out of Stock</div>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                                {(selectedVariantType === "all" || selectedVariantType === "text") && grouped.text.length > 0 && (
                                    <div className="row row-cols-3 g-3">
                                        {grouped.text.map((v) => {
                                            const sel = selectedVariants[prod._id]?.sku === v.sku;
                                            const oosV = v.stock <= 0;
                                            return (
                                                <div className="col" key={v.sku || v._id}>
                                                    <div className="text-center" style={{ cursor: oosV ? "not-allowed" : "pointer" }}
                                                        onClick={() => !oosV && (handleVariantSelect(prod._id, v), closeVariantOverlay())}>
                                                        <div style={{ padding: 10, borderRadius: 8, border: sel ? "3px solid #000" : "1px solid #ddd", background: sel ? "#f8f9fa" : "#fff", minHeight: 50, display: "flex", alignItems: "center", justifyContent: "center", opacity: oosV ? 0.5 : 1 }}>
                                                            {getVariantDisplayText(v)}
                                                        </div>
                                                        {oosV && <div className="text-danger small mt-1">Out of Stock</div>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const brandFilterProps = {
        filters,
        setFilters,
        filterData,
        trendingCategories,
        activeCategorySlug,
        activeCategoryName,
        onClearCategory: handleClearCategory,
        onCategoryPillClick: handleCategoryPillClick,
    };

    // Keep your OLD loader for initial loading
    if (loading && allProducts.length === 0)
        return (
            <div
                className="fullscreen-loader page-title-main-name"
                style={{
                    minHeight: "100vh",
                    width: "100%",
                }}
            >
                <div className="text-center">
                    <DotLottieReact className='foryoulanding-css'
                        src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
                        loop
                        autoplay
                    />


                    <p className="text-muted mb-0">
                        Please wait while we prepare the best products for you...
                    </p>
                </div>
            </div>
        );

    /* ── render ─────────────────────────────────────────────────────────────── */
    return (
        <>
            <Header />

            {/* 🔥 UPDATED: HERO BANNER REPLACED WITH SWIPER SLIDER 🔥 */}
            {bannerImages?.length > 0 && (
                <section className="hero-slider text-center mt-xl-5 pt-xl-4 padding-left-rightss">
                    <Swiper
                        ref={swiperRef}
                        modules={[Autoplay, Pagination, Navigation]}
                        onSlideChange={() => {
                            const swiper = swiperRef.current?.swiper;
                            if (!swiper) return;
                            document.querySelectorAll(".slide-video").forEach((v) => v.pause());
                            const activeSlide = swiper.slides[swiper.activeIndex];
                            const video = activeSlide?.querySelector("video");
                            if (video) video.play().catch(() => { });
                        }}
                        loop={bannerImages.length > 1}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        pagination={{
                            clickable: true,
                            bulletClass: 'custom-swiper-bullet',
                            bulletActiveClass: 'custom-swiper-bullet-active',
                        }}
                        navigation={bannerImages.length > 1}
                        speed={800}
                        style={{ height: "auto", width: "100%" }}
                    >
                        {bannerImages.map((banner, index) => {
                            const imgUrl = typeof banner === "string" ? banner : banner.url;
                            const targetLink = typeof banner === "object" ? banner.link : null;

                            return (
                                <SwiperSlide key={index}>
                                    <div
                                        className="position-relative w-100 h-100 mt-5 pt-4 hero-slider-image-responsive"
                                        style={{ cursor: targetLink ? "pointer" : "default" }}
                                        onClick={() => {
                                            if (!targetLink) return;
                                            if (targetLink.startsWith("http")) window.open(targetLink, "_blank");
                                            else navigate(targetLink);
                                        }}
                                    >
                                        <img
                                            src={imgUrl}
                                            alt={pageTitle || `Banner ${index + 1}`}
                                            className="w-100 h-100"
                                            style={{ maxHeight: "100%" }}
                                            onError={(e) => { e.currentTarget.src = "/banner-placeholder.jpg"; }}
                                        />
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </section>
            )}

            {/* Trending Categories */}
            {trendingCategories.length > 0 && (
                <div className="container-lg mt-4 mb-4">
                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={10}
                        slidesPerView="auto"
                        navigation
                        style={{ padding: "5px 0" }}
                    >
                        {trendingCategories.map((cat) => {
                            const isActive = activeCategorySlug === cat.slug;

                            return (
                                <SwiperSlide key={cat.slug} className="mx-auto" style={{ width: "auto" }}>
                                    {/* <button
                                        onClick={() => handleCategoryPillClick(cat)}
                                        className={`btn px-4 py-2 page-title-main-name ${isActive ? "btn-dark" : "btn-outline-secondary"
                                            }`}
                                        style={{
                                            fontSize: 13,
                                            fontWeight: isActive ? 600 : 400,
                                            transition: "all 0.18s ease",
                                            transform: isActive ? "scale(1.04)" : "scale(1)",
                                            whiteSpace: "nowrap",
                                        }}
                                        title={`Filter by ${cat.name}`}
                                    >
                                        {cat.name}
                                    </button> */}

                                    <button
                                        onClick={() => handleCategoryPillClick(cat)}
                                        className={`btn px-4 py-2 page-title-main-name ${isActive ? "btn-dark custom-pill" : "custom-pill"}`}
                                        style={{
                                            fontSize: 13,
                                            fontWeight: isActive ? 600 : 400,
                                            transition: "all 0.18s ease",
                                            transform: isActive ? "scale(1.04)" : "scale(1)",
                                            whiteSpace: "nowrap",
                                        }}
                                        title={`Filter by ${cat.name}`}
                                    >
                                        {cat.name}
                                    </button>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
            )}

            {/* Shop By Skin Types */}
            {shopBySkinTypes.length > 0 && (
                <div className="container-lg mt-3">
                    <h5 className="mb-2 page-title-main-name">Shop by Skin Type</h5>
                    <div className="d-flex overflow-auto py-2"
                        style={{ gap: "0.75rem", whiteSpace: "nowrap", scrollbarWidth: "none" }}>
                        {shopBySkinTypes.map((skin) => {
                            const isActive = filters.skinTypes.includes(skin.slug);
                            return (
                                <button
                                    key={skin.slug}
                                    onClick={() => handleSkinTypeClick(skin)}
                                    className={`btn rounded-pill px-4 py-2 page-title-main-name flex-shrink-0 ${isActive ? "btn-dark" : "btn-outline-secondary"}`}
                                    style={{ fontSize: 13, fontWeight: isActive ? 600 : 400 }}
                                >
                                    {skin.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Shop By Ingredients */}
            {shopByIngredients.length > 0 && (
                <div className="container-lg mt-3">
                    <h5 className="mb-2 page-title-main-name">Shop by Ingredients</h5>
                    <div className="d-flex overflow-auto py-2"
                        style={{ gap: "0.75rem", whiteSpace: "nowrap", scrollbarWidth: "none" }}>
                        {shopByIngredients.map((ing) => {
                            const isActive = filters.ingredients.includes(ing.slug);
                            return (
                                <button
                                    key={ing.slug}
                                    onClick={() => handleIngredientClick(ing)}
                                    className={`btn rounded-pill px-4 py-2 page-title-main-name flex-shrink-0 ${isActive ? "btn-dark" : "btn-outline-secondary"}`}
                                    style={{ fontSize: 13, fontWeight: isActive ? 600 : 400 }}
                                >
                                    {ing.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Special Offers / Promotions */}
            {promotions.length > 0 && (
                <div className="container-lg mt-3">
                    <h5 className="mb-2 page-title-main-name">Special Offers</h5>
                    <div className="d-flex overflow-auto py-2"
                        style={{ gap: "0.75rem", whiteSpace: "nowrap", scrollbarWidth: "none" }}>
                        {promotions.map((promo) => (
                            <button
                                key={promo._id}
                                onClick={() => handlePromotionClick(promo)}
                                className="btn px-4 py-2 page-title-main-name flex-shrink-0 btn-outline-danger"
                                style={{ fontSize: 13, fontWeight: 500 }}
                            >
                                {promo.title} {promo.discountLabel && `(${promo.discountLabel})`}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="padding-left-rightss ms-lg-0 ms-3 mx-3">
                <h2 className="mb-4 d-none d-lg-block page-title-main-name page-upper-case-first">{pageTitle}</h2>

                <div className="row">
                    <div className="d-none d-lg-block col-lg-3">
                        <BrandFilter {...brandFilterProps} />
                    </div>

                    <div className="d-lg-none mb-lg-3">
                        <h2 className="mb-4 text-center mt-lg-0 mt-3 page-upper-case-first">{pageTitle}</h2>
                        <div className="w-100 filter-responsive rounded shadow-sm">
                            <div className="container-fluid p-0">
                                <div className="row g-0" style={{ flexDirection: "row-reverse" }}>
                                    <div className="col-6">
                                        <button className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
                                            onClick={() => setShowFilterOffcanvas(true)} style={{ gap: 12 }}>
                                            <img src={filtering} alt="Filter" style={{ width: 25 }} />
                                            <div className="text-start">
                                                <p className="mb-0 fs-6 fw-semibold page-title-main-name">Filter</p>
                                                <span className="text-muted small page-title-main-name">Tap to apply</span>
                                            </div>
                                        </button>
                                    </div>
                                    <div className="col-6 border-end">
                                        <button className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
                                            onClick={() => setShowSortOffcanvas(true)} style={{ gap: 12 }}>
                                            <img src={updownarrow} alt="Sort" style={{ width: 25 }} />
                                            <div className="text-start">
                                                <p className="mb-0 fs-6 fw-semibold page-title-main-name">Sort by</p>
                                                <span className="text-muted small">{filters.sort === "recent" ? "Relevance" : filters.sort}</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filter & Sort Offcanvas */}
                    {showFilterOffcanvas && (
                        <>
                            <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
                                style={{ opacity: 0.5, zIndex: 1040 }} onClick={() => setShowFilterOffcanvas(false)} />
                            <div className="position-fixed start-0 bottom-0 w-100 bg-white"
                                style={{ zIndex: 1050, borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: "85vh", boxShadow: "0 -4px 20px rgba(0,0,0,.2)" }}>
                                <div className="text-center py-3 position-relative">
                                    <h5 className="mb-0 fw-bold">Filters</h5>
                                    <button className="btn-close position-absolute end-0 me-3"
                                        style={{ top: "50%", transform: "translateY(-50%)" }}
                                        onClick={() => setShowFilterOffcanvas(false)} />
                                    <div className="mx-auto mt-2 bg-secondary" style={{ height: 5, width: 50, borderRadius: 3 }} />
                                </div>
                                <div className="px-3 pb-4 overflow-auto" style={{ maxHeight: "70vh" }}>
                                    <BrandFilter
                                        {...brandFilterProps}
                                        onClose={() => setShowFilterOffcanvas(false)}
                                        onClearCategory={() => { handleClearCategory(); setShowFilterOffcanvas(false); }}
                                        onCategoryPillClick={(cat) => {
                                            handleCategoryPillClick(cat);
                                            setShowFilterOffcanvas(false);
                                        }}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {showSortOffcanvas && (
                        <>
                            <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
                                style={{ opacity: 0.5, zIndex: 1040 }} onClick={() => setShowSortOffcanvas(false)} />
                            <div className="position-fixed start-0 bottom-0 w-100 bg-white"
                                style={{ zIndex: 1050, borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: "60vh", boxShadow: "0 -4px 12px rgba(0,0,0,.15)" }}>
                                <div className="text-center py-3 position-relative">
                                    <h5 className="mb-0 fw-bold page-title-main-name">Sort by</h5>
                                    <button className="btn-close position-absolute end-0 me-3"
                                        style={{ top: "50%", transform: "translateY(-50%)" }}
                                        onClick={() => setShowSortOffcanvas(false)} />
                                    <div className="mx-auto mt-2 bg-secondary" style={{ height: 5, width: 50, borderRadius: 3 }} />
                                </div>
                                <div className="px-4 pb-4">
                                    <div className="list-group">
                                        {[
                                            { value: "recent", label: "Relevance" },
                                            { value: "priceHighToLow", label: "Price High to Low" },
                                            { value: "priceLowToHigh", label: "Price Low to High" },
                                        ].map(({ value, label }) => (
                                            <label key={value} className="list-group-item py-3 d-flex align-items-center">
                                                <input className="form-check-input me-3" type="radio" name="sort"
                                                    checked={filters.sort === value}
                                                    onChange={() => { setFilters((p) => ({ ...p, sort: value })); setShowSortOffcanvas(false); }} />
                                                <span className="page-title-main-name">{label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="col-12 col-lg-9">
                        <div className="mb-3 d-flex justify-content-between align-items-center">
                            <span className="text-muted page-title-main-name d-lg-block d-none">
                                {pageTitle || `Showing ${allProducts.length} products`}
                                {hasMore && pageTitle && " (Scroll for more)"}
                            </span>
                        </div>

                        <div className="row g-4 position-relative">
                            {/* NEW Loading Overlay - shown when loading but products exist */}
                            {/* {loading && allProducts.length > 0 && (
                                <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-start pt-5"
                                    style={{ background: 'rgba(255,255,255,0.6)', zIndex: 10, borderRadius: '15px' }}>
                                    <div className="text-center sticky-top" style={{ top: '200px' }}>
                                        <DotLottieReact className='foryoulanding-css'
                                            src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
                                            loop
                                            autoplay
                                            style={{ width: '150px', height: '150px' }}
                                        />
                                        <p className="page-title-main-name fw-bold">Refining selection...</p>
                                    </div>
                                </div>
                            )} */}


                            {loading && (
                                <div
                                    className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center"
                                    style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.97)',
                                        zIndex: 9999,
                                        backdropFilter: 'blur(10px)',
                                    }}
                                >
                                    <div className="text-center">
                                        <DotLottieReact
                                            className="mb-4"
                                            src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
                                            loop
                                            autoplay
                                            style={{ width: '200px', height: '200px' }}
                                        />

                                        <p className="text-muted mb-0">
                                            Finding the perfect products just for you
                                        </p>

                                        {/* Optional loading dots */}
                                        <div className="d-flex justify-content-center gap-1 mt-4">
                                            <div className="dot-pulse"></div>
                                            <div className="dot-pulse"></div>
                                            <div className="dot-pulse"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {allProducts.length > 0
                                ? allProducts.map(renderProductCard)
                                : loading
                                    ? (
                                        // NEW Loading state when no products yet
                                        <div className="col-12 text-center py-5">
                                            <DotLottieReact className='foryoulanding-css'
                                                src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
                                                loop
                                                autoplay
                                                style={{ width: '200px', height: '200px', margin: '0 auto' }}
                                            />
                                            <p className="text-muted">Loading products...</p>
                                        </div>
                                    )
                                    : <div className="col-12 text-center py-5"><h4>No products found</h4><p className="text-muted">Try adjusting your filters.</p></div>
                            }
                        </div>

                        {loadingMore && (
                            <div className="text-center mt-4 py-4">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading more products...</span>
                                </div>
                                <p className="mt-2">Loading more products...</p>
                            </div>
                        )}

                        <div ref={loaderRef} style={{ height: 20, marginTop: 20 }} />

                        {!hasMore && allProducts.length > 0 && (
                            <div className="text-center mt-4 py-4 border-top">
                                <p className="text-muted">🎉 You've reached the end! No more products to show.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}


//===========================================================================Done-Code(End)========================================================================================== 
