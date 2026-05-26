// import React, { useState, useRef, useEffect } from "react";
// import { FaAngleDown, FaTimes, FaArrowLeft, FaMicrophone, FaSearch } from "react-icons/fa";
// import { Link, useNavigate } from "react-router-dom";
// import logo from "../assets/logo.png";
// import Cart from "../assets/Cart.svg";
// import favourite from "../assets/favourite.svg";
// import users from "../assets/user.svg";
// import search from "../assets/search.svg";
// import menu from "../assets/menu.svg";
// import home from "../assets/home.svg";
// import "../css/Header/Header.css";
// import "../App.css";

// const Mobileheaderview = ({
//   isMobile,
//   isTablet,
//   menuOpen,
//   setMenuOpen,
//   closeMenu,
//   user,
//   logoutUser,
//   cartCount,
//   categories,
//   searchText,
//   setSearchText,
//   handleSearchSubmit,
//   startListening,
//   listening,
//   searchResults,
//   recentSearches,
//   popularSearches,
//   handleResultClick,
//   handleRecentSearchClick,
//   clearRecentSearches,
//   clearSearch,
//   searchInputRef
// }) => {
//   const navigate = useNavigate();

//   // ---------- local mobile state ----------
//   const [showMobileSearch, setShowMobileSearch] = useState(false);
//   const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState({});

//   const mobileMenuRef = useRef(null);

//   // ---------- close drawer when clicking outside ----------
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && menuOpen) {
//         setMenuOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [menuOpen, setMenuOpen]);

//   // ---------- category toggle ----------
//   const toggleMobileCategory = (id) => {
//     setMobileCategoriesOpen(prev => ({ ...prev, [id]: !prev[id] }));
//   };

//   // ---------- render subcategories recursively ----------
//   const renderMobileSubCategories = (subs, level = 1) => {
//     if (!subs?.length) return null;
//     return (
//       <div className={`mobile-subcategory mobile-subcategory-level-${level}`}>
//         {subs.map((sub) => (
//           <div key={sub._id} className="mobile-subcategory-item">
//             <Link to={`/category/${sub.slug}`} onClick={closeMenu} className="mobile-subcategory-link">
//               {sub.name}
//             </Link>
//             {sub.subCategories?.length > 0 && (
//               <>
//                 <FaAngleDown
//                   className={`mobile-category-toggle ${mobileCategoriesOpen[sub._id] ? 'open' : ''}`}
//                   onClick={(e) => {
//                     e.preventDefault();
//                     toggleMobileCategory(sub._id);
//                   }}
//                 />
//                 {mobileCategoriesOpen[sub._id] && renderMobileSubCategories(sub.subCategories, level + 1)}
//               </>
//             )}
//           </div>
//         ))}
//       </div>
//     );
//   };

//   // ---------- discount helper ----------
//   const getDiscount = (p) => {
//     if (p.originalPrice > p.price) {
//       return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
//     }
//     return 0;
//   };

//   // ---------- handle local mobile search overlay ----------
//   const handleMobileSearchBack = () => {
//     setShowMobileSearch(false);
//     setSearchText("");
//   };

//   return (
//     <>
//       {/* ---------- MOBILE SEARCH OVERLAY ---------- */}
//       {showMobileSearch && (
//         <div className="mobile-search-overlay">
//           <div className="mobile-search-header">
//             <FaArrowLeft className="mobile-search-back" onClick={handleMobileSearchBack} />
//             <form onSubmit={handleSearchSubmit} className="mobile-search-input-container">
//               <FaSearch className="mobile-search-icon" />
//               <input
//                 className="w-100 border-0 bg-transparent page-title-main-name"
//                 ref={searchInputRef}
//                 type="text"
//                 placeholder="Search products, brands..."
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 autoFocus
//               />
//               {searchText && <FaTimes className="mobile-search-clear" onClick={clearSearch} />}
//               <FaMicrophone className={`mobile-search-voice ${listening ? "listening" : ""}`} onClick={startListening} />
//             </form>
//             <button className="mobile-search-go page-title-main-name" onClick={handleSearchSubmit} disabled={!searchText.trim()}>
//               Go
//             </button>
//           </div>

//           <div className="mobile-search-results page-title-main-name">
//             {!searchText.trim() ? (
//               <div className="mobile-search-suggestions">
//                 {recentSearches.length > 0 && (
//                   <div className="mobile-search-section">
//                     <div className="mobile-search-section-header">
//                       <span>Recent Searches</span>
//                       <button onClick={clearRecentSearches} className="mobile-search-clear-btn page-title-main-name">Clear</button>
//                     </div>
//                     <div className="mobile-search-tags">
//                       {recentSearches.map((s, i) => (
//                         <div key={i} onClick={() => handleRecentSearchClick(s)} className="mobile-search-tag">
//                           {s}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//                 {popularSearches.length > 0 && (
//                   <div className="mobile-search-section">
//                     <div className="mobile-search-section-header">
//                       <span>Popular Searches</span>
//                     </div>
//                     <div className="mobile-search-tags">
//                       {popularSearches.map((s, i) => (
//                         <div key={i} onClick={() => handleRecentSearchClick(s)} className="mobile-search-tag popular">
//                           {s}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ) : searchResults.length > 0 ? (
//               <div className="mobile-search-products">
//                 {searchResults.map((item) => {
//                   const discount = getDiscount(item);
//                   return (
//                     <div key={item._id} onClick={() => handleResultClick(item)} className="mobile-search-product">
//                       <div className="mobile-search-product-image">
//                         <img src={item.image} alt={item.name} loading="lazy" />
//                         {discount > 0 && <div className="mobile-search-product-discount">-{discount}%</div>}
//                       </div>
//                       <div className="mobile-search-product-info">
//                         <div className="mobile-search-product-brand">{item.brand}</div>
//                         <div className="mobile-search-product-name">{item.name}</div>
//                         <div className="mobile-search-product-price-row">
//                           <span className="mobile-search-product-price">₹{item.price}</span>
//                           {discount > 0 && <span className="mobile-search-product-original">₹{item.originalPrice}</span>}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//                 <div className="mobile-search-view-all" onClick={handleSearchSubmit}>
//                   View all results for "{searchText}" →
//                 </div>
//               </div>
//             ) : (
//               <div className="mobile-search-empty">
//                 <div>No products found for "{searchText}"</div>
//                 <small>Try different keywords</small>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* ---------- MAIN MOBILE HEADER BAR ---------- */}
//       <header className="header d-block">
//         <div className="d-flex justify-content-between margin-padding-header align-items-center">
//           <Link to="/" className="logo" onClick={closeMenu}>
//             <img src={logo} className="ps-sm-0 ps-4 ms-sm-0" alt="JOYORY Logo" />
//           </Link>

//           {/* Menu Toggle */}
//           <div className="menu-toggle" onClick={() => setMenuOpen(true)}>
//             <img src={menu} alt="Menu" />
//           </div>

//           {/* Mobile Icons (search & cart) - hidden when search overlay is open */}
//           {!showMobileSearch && (
//             <div className="nav-icons user-dropdown gap-3 d-md-flex d-lg-none d-flex">
//               <div className="mobile-search-icon-wrapper" onClick={() => setShowMobileSearch(true)}>
//                 <img src={search} alt="Search" />
//               </div>
//               <Link to="/cartpage" className="mobile-cart-icon" onClick={closeMenu}>
//                 <img src={Cart} alt="Cart" />
//                 {cartCount > 0 && <span className="cart-count page-title-main-name">{cartCount > 99 ? '99+' : cartCount}</span>}
//               </Link>
//             </div>
//           )}
//         </div>

//         {/* ---------- MOBILE DRAWER (MENU) ---------- */}
//         <nav className={`nav-links ${menuOpen ? "active" : ""}`} ref={mobileMenuRef}>
//           <div className="mobile-menu-header">
//             <div className="mobile-menu-logo">
//               <img src={logo} alt="JOYORY Logo" />
//             </div>
//             <div className="menu-close" onClick={closeMenu}>
//               <FaTimes size={22} />
//             </div>
//           </div>

//           <div className="nav-links-container w-100">
//             {/* Home */}
//             <div className="border-top-bottom">
//               <Link to="/" onClick={closeMenu} className="nav-link d-flex ms-3 page-title-main-name margin-top-home">
//                 Home
//               </Link>
//             </div>

//             {/* Categories with nested toggle */}
//             <div className="mobile-categories border-top-bottom">
//               <div className="mobile-category-header page-title-main-name" onClick={() => toggleMobileCategory('all')}>
//                 Categories <FaAngleDown className={mobileCategoriesOpen['all'] ? 'open' : ''} />
//               </div>
//               {mobileCategoriesOpen['all'] && categories.map((cat) => (
//                 <div key={cat._id} className="mobile-category-item">
//                   <div className="mobile-category-main" onClick={() => toggleMobileCategory(cat._id)}>
//                     <Link to={`/category/${cat.slug}`} onClick={closeMenu} className="mobile-category-name page-title-main-name">
//                       {cat.name}
//                     </Link>
//                     {cat.subCategories?.length > 0 && <FaAngleDown className={mobileCategoriesOpen[cat._id] ? 'open' : ''} />}
//                   </div>
//                   {mobileCategoriesOpen[cat._id] && renderMobileSubCategories(cat.subCategories)}
//                 </div>
//               ))}
//             </div>

//             {/* Shade Finder */}
//             <div className="border-top-bottom mobile-category-header">
//               <Link to="/FoundationShadeFinder" onClick={closeMenu} className="mt-1 pb-1 page-title-main-name shadefinder-name-mobile-tabalte">
//                 Shade Finder
//               </Link>
//             </div>

//             {/* User links */}
//             <div className="border-top-bottom page-title-main-name">
//               <Link to="/useraccount" onClick={closeMenu} className="nav-link mobile-profile-link ms-3 d-flex mt-1 pb-1">
//                 My Account
//               </Link>
//             </div>
//             <div className="border-top-bottom page-title-main-name">
//               <Link to="/Myorders" onClick={closeMenu} className="nav-link ms-3 d-flex mt-1 pb-1">
//                 My Orders
//               </Link>
//             </div>
//             <div>
//               {user && !user.guest ? (
//                 <div onClick={() => { logoutUser(); closeMenu(); }} className="nav-link logout-link ms-3 d-flex mt-1 pb-1 page-title-main-name">
//                   Logout
//                 </div>
//               ) : (
//                 <Link to="/login" onClick={closeMenu} className="nav-link ms-3 d-flex mt-1 pb-1 page-title-main-name">
//                   Login
//                 </Link>
//               )}
//             </div>
//           </div>
//         </nav>
//       </header>

//       {/* ---------- MOBILE FOOTER NAVIGATION ---------- */}
//       {(isMobile || isTablet) && (
//         <div className="mobile-footer-navigation w-100">
//           <Link to="/" onClick={closeMenu} className="mobile-footer-nav-item">
//             <img src={home} alt="Home" />
//             <div className="mobile-footer-nav-label page-title-main-name">Home</div>
//           </Link>
//           <Link to="/wishlist" onClick={closeMenu} className="mobile-footer-nav-item">
//             <img src={favourite} alt="Wishlist" />
//             <div className="mobile-footer-nav-label page-title-main-name">Wishlist</div>
//           </Link>
//           <Link to="/cartpage" onClick={closeMenu} className="mobile-footer-nav-item">
//             <img src={Cart} alt="Cart" />
//             <div className="mobile-footer-nav-label page-title-main-name">Cart</div>
//             {cartCount > 0 && <div className="mobile-footer-cart-count">{cartCount > 9 ? '9+' : cartCount}</div>}
//           </Link>
//           <Link to="/useraccount" onClick={closeMenu} className="mobile-footer-nav-item">
//             <img src={users} alt="Profile" />
//             <div className="mobile-footer-nav-label page-title-main-name">Profile</div>
//           </Link>
//         </div>
//       )}
//     </>
//   );
// };

// export default Mobileheaderview;


















// import React, { useState, useRef, useEffect } from "react";
// import { FaAngleDown, FaTimes, FaArrowLeft, FaMicrophone, FaSearch } from "react-icons/fa";
// import { Link, useNavigate } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance.js";   // ✅ same as HeaderCategories
// import logo from "../assets/logo.png";
// import Cart from "../assets/Cart.svg";
// import favourite from "../assets/favourite.svg";
// import users from "../assets/user.svg";
// import search from "../assets/search.svg";
// import menu from "../assets/menu.svg";
// import home from "../assets/home.svg";
// import "../css/Header/Header.css";
// import "../App.css";

// // ✅ STATIC MENU ITEMS – exactly like HeaderCategories
// const STATIC_MENU_ITEMS = [
//   { label: "Brands", path: "/brands" },
//   { label: "Offers", path: "/offers" },
//   { label: "Virtual Try-on", path: "/virtual-try-on" },
//   { label: "Shade finder", path: "/shade-finder" },
//   { label: "For you", path: "/for-you" },
//   { label: "About us", path: "/about-us" }
// ];

// const Mobileheaderview = ({
//   isMobile,
//   isTablet,
//   menuOpen,
//   setMenuOpen,
//   closeMenu,
//   user,
//   logoutUser,
//   cartCount,
//   categories: propCategories,        // renamed to avoid conflict
//   searchText,
//   setSearchText,
//   handleSearchSubmit,
//   startListening,
//   listening,
//   searchResults,
//   recentSearches,
//   popularSearches,
//   handleResultClick,
//   handleRecentSearchClick,
//   clearRecentSearches,
//   clearSearch,
//   searchInputRef
// }) => {
//   const navigate = useNavigate();

//   // ---------- local mobile state ----------
//   const [showMobileSearch, setShowMobileSearch] = useState(false);
//   const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState({});

//   // ✅ fetch categories exactly like HeaderCategories
//   const [fetchedCategories, setFetchedCategories] = useState([]);
//   const [loadingCategories, setLoadingCategories] = useState(true);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await axiosInstance.get("/api/user/categories/tree");
//         // ✅ Direct array – same as your HeaderCategories
//         setFetchedCategories(Array.isArray(res.data) ? res.data : []);
//       } catch (err) {
//         console.error("Category fetch failed in Mobileheaderview", err);
//         setFetchedCategories([]);
//       } finally {
//         setLoadingCategories(false);
//       }
//     };
//     fetchCategories();
//   }, []);

//   const mobileMenuRef = useRef(null);

//   // ---------- close drawer when clicking outside ----------
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && menuOpen) {
//         setMenuOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [menuOpen, setMenuOpen]);

//   // ---------- category toggle ----------
//   const toggleMobileCategory = (id) => {
//     setMobileCategoriesOpen(prev => ({ ...prev, [id]: !prev[id] }));
//   };

//   // ---------- render subcategories recursively (exactly like HeaderCategories) ----------
//   const renderMobileSubCategories = (subs, level = 1) => {
//     if (!subs?.length) return null;
//     return (
//       <div className={`mobile-subcategory mobile-subcategory-level-${level}`}>
//         {subs.map((sub) => (
//           <div key={sub._id} className="mobile-subcategory-item ps-3 page-title-main-name">
//             <div>
//               <Link to={`/category/${sub.slug}`} onClick={closeMenu} className="mobile-subcategory-link p-0">
//                 {sub.name}
//               </Link>
//               <FaAngleDown
//                 className={`mobile-category-toggle ${mobileCategoriesOpen[sub._id] ? 'open' : ''}`}
//                 onClick={(e) => {
//                   e.preventDefault();
//                   toggleMobileCategory(sub._id);
//                 }}
//               />

//             </div>
//             {sub.subCategories?.length > 0 && (
//               <>

//                 {mobileCategoriesOpen[sub._id] && renderMobileSubCategories(sub.subCategories, level + 1)}
//               </>
//             )}
//           </div>
//         ))}
//       </div>
//     );
//   };

//   // ---------- discount helper ----------
//   const getDiscount = (p) => {
//     if (p.originalPrice > p.price) {
//       return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
//     }
//     return 0;
//   };

//   // ---------- handle local mobile search overlay ----------
//   const handleMobileSearchBack = () => {
//     setShowMobileSearch(false);
//     setSearchText("");
//   };

//   // ✅ Use fetched categories – fallback to propCategories while loading (optional)
//   const categoriesToRender = fetchedCategories.length > 0 ? fetchedCategories : propCategories;

//   return (
//     <>
//       {/* ---------- MOBILE SEARCH OVERLAY ---------- */}
//       {showMobileSearch && (
//         <div className="mobile-search-overlay">
//           <div className="mobile-search-header">
//             <FaArrowLeft className="mobile-search-back" onClick={handleMobileSearchBack} />
//             <form onSubmit={handleSearchSubmit} className="mobile-search-input-container">
//               <FaSearch className="mobile-search-icon" />
//               <input
//                 className="w-100 border-0 bg-transparent page-title-main-name"
//                 ref={searchInputRef}
//                 type="text"
//                 placeholder="Search products, brands..."
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 autoFocus
//               />
//               {searchText && <FaTimes className="mobile-search-clear" onClick={clearSearch} />}
//               <FaMicrophone className={`mobile-search-voice ${listening ? "listening" : ""}`} onClick={startListening} />
//             </form>
//             <button className="mobile-search-go page-title-main-name" onClick={handleSearchSubmit} disabled={!searchText.trim()}>
//               Go
//             </button>
//           </div>

//           <div className="mobile-search-results page-title-main-name">
//             {!searchText.trim() ? (
//               <div className="mobile-search-suggestions">
//                 {recentSearches.length > 0 && (
//                   <div className="mobile-search-section">
//                     <div className="mobile-search-section-header">
//                       <span>Recent Searches</span>
//                       <button onClick={clearRecentSearches} className="mobile-search-clear-btn page-title-main-name">Clear</button>
//                     </div>
//                     <div className="mobile-search-tags">
//                       {recentSearches.map((s, i) => (
//                         <div key={i} onClick={() => handleRecentSearchClick(s)} className="mobile-search-tag">
//                           {s}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//                 {popularSearches.length > 0 && (
//                   <div className="mobile-search-section">
//                     <div className="mobile-search-section-header">
//                       <span>Popular Searches</span>
//                     </div>
//                     <div className="mobile-search-tags">
//                       {popularSearches.map((s, i) => (
//                         <div key={i} onClick={() => handleRecentSearchClick(s)} className="mobile-search-tag popular">
//                           {s}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ) : searchResults.length > 0 ? (
//               <div className="mobile-search-products">
//                 {searchResults.map((item) => {
//                   const discount = getDiscount(item);
//                   return (
//                     <div key={item._id} onClick={() => handleResultClick(item)} className="mobile-search-product">
//                       <div className="mobile-search-product-image">
//                         <img src={item.image} alt={item.name} loading="lazy" />
//                         {discount > 0 && <div className="mobile-search-product-discount">-{discount}%</div>}
//                       </div>
//                       <div className="mobile-search-product-info">
//                         <div className="mobile-search-product-brand">{item.brand}</div>
//                         <div className="mobile-search-product-name">{item.name}</div>
//                         <div className="mobile-search-product-price-row">
//                           <span className="mobile-search-product-price">₹{item.price}</span>
//                           {discount > 0 && <span className="mobile-search-product-original">₹{item.originalPrice}</span>}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//                 <div className="mobile-search-view-all" onClick={handleSearchSubmit}>
//                   View all results for "{searchText}" →
//                 </div>
//               </div>
//             ) : (
//               <div className="mobile-search-empty">
//                 <div>No products found for "{searchText}"</div>
//                 <small>Try different keywords</small>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* ---------- MAIN MOBILE HEADER BAR ---------- */}
//       <header className="header d-block">
//         <div className="d-flex justify-content-between margin-padding-header align-items-center">
//           <Link to="/" className="logo" onClick={closeMenu}>
//             <img src={logo} className="ps-sm-0 ps-4 ms-sm-0" alt="JOYORY Logo" />
//           </Link>

//           {/* Menu Toggle */}
//           <div className="menu-toggle" onClick={() => setMenuOpen(true)}>
//             <img src={menu} alt="Menu" />
//           </div>

//           {/* Mobile Icons (search & cart) - hidden when search overlay is open */}
//           {!showMobileSearch && (
//             <div className="nav-icons user-dropdown gap-3 d-md-flex d-lg-none d-flex">
//               <div className="mobile-search-icon-wrapper" onClick={() => setShowMobileSearch(true)}>
//                 <img src={search} alt="Search" />
//               </div>
//               <Link to="/cartpage" className="mobile-cart-icon" onClick={closeMenu}>
//                 <img src={Cart} alt="Cart" />
//                 {cartCount > 0 && <span className="cart-count page-title-main-name">{cartCount > 99 ? '99+' : cartCount}</span>}
//               </Link>
//             </div>
//           )}
//         </div>

//         {/* ---------- MOBILE DRAWER (MENU) ---------- */}
//         <nav className={`nav-links ${menuOpen ? "active" : ""}`} ref={mobileMenuRef}>
//           <div className="mobile-menu-header">
//             <div className="mobile-menu-logo">
//               <img src={logo} alt="JOYORY Logo" />
//             </div>
//             <div className="menu-close" onClick={closeMenu}>
//               <FaTimes size={22} />
//             </div>
//           </div>

//           <div className="nav-links-container w-100">
//             {/* Home */}
//             <div className="border-top-bottom">
//               <Link to="/" onClick={closeMenu} className="nav-link d-flex ms-3 page-title-main-name margin-top-home">
//                 Home
//               </Link>
//             </div>

//             {/* ✅ DIRECT MAIN CATEGORIES – no "Categories" header, no 'all' toggle */}
//             <div className="border-top-bottom">
//               {!loadingCategories && categoriesToRender.map((cat) => (
//                 <div key={cat._id} className="mobile-category-item">
//                   <div className="mobile-category-main" onClick={() => toggleMobileCategory(cat._id)}>
//                     <Link to={`/category/${cat.slug}`} onClick={closeMenu} className="mobile-category-name page-title-main-name p-0">
//                       {cat.name}
//                     </Link>
//                     {cat.subCategories?.length > 0 && <FaAngleDown className={mobileCategoriesOpen[cat._id] ? 'open' : ''} />}
//                   </div>
//                   {mobileCategoriesOpen[cat._id] && renderMobileSubCategories(cat.subCategories)}
//                 </div>
//               ))}
//               {loadingCategories && (
//                 <div className="mobile-category-loading">Loading categories...</div>
//               )}
//             </div>

//             {/* Shade Finder (original) */}
//             <div className="border-top-bottom mobile-category-header">
//               <Link to="/FoundationShadeFinder" onClick={closeMenu} className="mt-1 pb-1 page-title-main-name shadefinder-name-mobile-tabalte">
//                 Shade Finder
//               </Link>
//             </div>

//             {/* ✅ Static menu items – Brands, Offers, Virtual Try-on, Shade finder, For you, About us */}
//             <div className="border-top-bottom">
//               {STATIC_MENU_ITEMS.map((item) => (
//                 <Link
//                   key={item.label}
//                   to={item.path}
//                   onClick={closeMenu}
//                   className="nav-link d-flex ms-3 page-title-main-name mt-1 pb-1"
//                 >
//                   {item.label}
//                 </Link>
//               ))}
//             </div>

//             {/* User links */}
//             <div className="border-top-bottom page-title-main-name">
//               <Link to="/useraccount" onClick={closeMenu} className="nav-link mobile-profile-link ms-3 d-flex mt-1 pb-1">
//                 My Account
//               </Link>
//             </div>
//             <div className="border-top-bottom page-title-main-name">
//               <Link to="/Myorders" onClick={closeMenu} className="nav-link ms-3 d-flex mt-1 pb-1">
//                 My Orders
//               </Link>
//             </div>
//             <div>
//               {user && !user.guest ? (
//                 <div onClick={() => { logoutUser(); closeMenu(); }} className="nav-link logout-link ms-3 d-flex mt-1 pb-1 page-title-main-name">
//                   Logout
//                 </div>
//               ) : (
//                 <Link to="/login" onClick={closeMenu} className="nav-link ms-3 d-flex mt-1 pb-1 page-title-main-name">
//                   Login
//                 </Link>
//               )}
//             </div>
//           </div>
//         </nav>
//       </header>

//       {/* ---------- MOBILE FOOTER NAVIGATION ---------- */}
//       {(isMobile || isTablet) && (
//         <div className="mobile-footer-navigation w-100">
//           <Link to="/" onClick={closeMenu} className="mobile-footer-nav-item">
//             <img src={home} alt="Home" />
//             <div className="mobile-footer-nav-label page-title-main-name">Home</div>
//           </Link>
//           <Link to="/wishlist" onClick={closeMenu} className="mobile-footer-nav-item">
//             <img src={favourite} alt="Wishlist" />
//             <div className="mobile-footer-nav-label page-title-main-name">Wishlist</div>
//           </Link>
//           <Link to="/cartpage" onClick={closeMenu} className="mobile-footer-nav-item">
//             <img src={Cart} alt="Cart" />
//             <div className="mobile-footer-nav-label page-title-main-name">Cart</div>
//             {cartCount > 0 && <div className="mobile-footer-cart-count">{cartCount > 9 ? '9+' : cartCount}</div>}
//           </Link>
//           <Link to="/useraccount" onClick={closeMenu} className="mobile-footer-nav-item">
//             <img src={users} alt="Profile" />
//             <div className="mobile-footer-nav-label page-title-main-name">Profile</div>
//           </Link>
//         </div>
//       )}
//     </>
//   );
// };

// export default Mobileheaderview;



















// import React, { useState, useRef, useEffect } from "react";
// import { FaAngleDown, FaTimes, FaArrowLeft, FaMicrophone, FaSearch } from "react-icons/fa";
// import { Link, useNavigate } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance.js";
// import logo from "../assets/logo.png";
// import Cart from "../assets/Cart.svg";
// import favourite from "../assets/favourite.svg";
// import users from "../assets/user.svg";
// import search from "../assets/search.svg";
// import menu from "../assets/menu.svg";
// import home from "../assets/home.svg";
// import "../css/Header/Header.css";
// import "../App.css";

// // ✅ STATIC MENU ITEMS – exactly like HeaderCategories
// const STATIC_MENU_ITEMS = [
//   { label: "Brands", path: "/brands" },
//   { label: "Offers", path: "/offers" },
//   { label: "Virtual Try-on", path: "/virtual-try-on" },
//   { label: "Shade finder", path: "/shade-finder" },
//   { label: "For you", path: "/for-you" },
//   { label: "About us", path: "/about-us" }
// ];

// const Mobileheaderview = ({
//   isMobile,
//   isTablet,
//   menuOpen,
//   setMenuOpen,
//   closeMenu,
//   user,
//   logoutUser,
//   cartCount,
//   categories: propCategories,
//   searchText,
//   setSearchText,
//   handleSearchSubmit,
//   startListening,
//   listening,
//   searchResults,
//   recentSearches,
//   popularSearches,
//   handleResultClick,
//   handleRecentSearchClick,
//   clearRecentSearches,
//   clearSearch,
//   searchInputRef
// }) => {
//   const navigate = useNavigate();

//   // ---------- local mobile state ----------
//   const [showMobileSearch, setShowMobileSearch] = useState(false);
//   const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState({});

//   // ✅ fetch categories exactly like HeaderCategories
//   const [fetchedCategories, setFetchedCategories] = useState([]);
//   const [loadingCategories, setLoadingCategories] = useState(true);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await axiosInstance.get("/api/user/categories/tree");
//         setFetchedCategories(Array.isArray(res.data) ? res.data : []);
//       } catch (err) {
//         console.error("Category fetch failed in Mobileheaderview", err);
//         setFetchedCategories([]);
//       } finally {
//         setLoadingCategories(false);
//       }
//     };
//     fetchCategories();
//   }, []);

//   const mobileMenuRef = useRef(null);

//   // ---------- close drawer when clicking outside ----------
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && menuOpen) {
//         setMenuOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [menuOpen, setMenuOpen]);

//   // ---------- category toggle ----------
//   const toggleMobileCategory = (id) => {
//     setMobileCategoriesOpen(prev => ({ ...prev, [id]: !prev[id] }));
//   };

//   // ---------- render subcategories – dropdown ONLY for level 1 (subcategories) ----------
//   const renderMobileSubCategories = (subs, level = 1) => {
//     if (!subs?.length) return null;
//     return (
//       <div className={`mobile-subcategory mobile-subcategory-level-${level}`}>
//         {subs.map((sub) => (
//           <div key={sub._id} className="mobile-subcategory-item ps-3 page-title-main-name">
//             <div className="d-flex align-items-center justify-content-between">
//               <Link to={`/category/${sub.slug}`} onClick={closeMenu} className="mobile-subcategory-link p-0 ">
//                 {sub.name}
//               </Link>
//               {/* ✅ Chevron only for level 1 (subcategories) – no deeper dropdowns */}
//               {sub.subCategories?.length > 0 && level === 1 && (
//                 <FaAngleDown
//                   className={`mobile-category-toggle ${mobileCategoriesOpen[sub._id] ? 'open' : ''}`}
//                   onClick={(e) => {
//                     e.preventDefault();
//                     toggleMobileCategory(sub._id);
//                   }}
//                 />
//               )}
//             </div>
//             {/* ✅ Only level 1 categories can expand further */}
//             {level === 1 && mobileCategoriesOpen[sub._id] && renderMobileSubCategories(sub.subCategories, level + 1)}
//           </div>
//         ))}
//       </div>
//     );
//   };

//   // ---------- discount helper ----------
//   const getDiscount = (p) => {
//     if (p.originalPrice > p.price) {
//       return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
//     }
//     return 0;
//   };

//   // ---------- handle local mobile search overlay ----------
//   const handleMobileSearchBack = () => {
//     setShowMobileSearch(false);
//     setSearchText("");
//   };

//   const categoriesToRender = fetchedCategories.length > 0 ? fetchedCategories : propCategories;

//   return (
//     <>
//       {/* ---------- MOBILE SEARCH OVERLAY ---------- */}
//       {showMobileSearch && (
//         <div className="mobile-search-overlay">
//           <div className="mobile-search-header">
//             <FaArrowLeft className="mobile-search-back" onClick={handleMobileSearchBack} />
//             <form onSubmit={handleSearchSubmit} className="mobile-search-input-container">
//               <FaSearch className="mobile-search-icon" />
//               <input
//                 className="w-100 border-0 bg-transparent page-title-main-name"
//                 ref={searchInputRef}
//                 type="text"
//                 placeholder="Search products, brands..."
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 autoFocus
//               />
//               {searchText && <FaTimes className="mobile-search-clear" onClick={clearSearch} />}
//               <FaMicrophone className={`mobile-search-voice ${listening ? "listening" : ""}`} onClick={startListening} />
//             </form>
//             <button className="mobile-search-go page-title-main-name" onClick={handleSearchSubmit} disabled={!searchText.trim()}>
//               Go
//             </button>
//           </div>

//           <div className="mobile-search-results page-title-main-name">
//             {!searchText.trim() ? (
//               <div className="mobile-search-suggestions">
//                 {recentSearches.length > 0 && (
//                   <div className="mobile-search-section">
//                     <div className="mobile-search-section-header">
//                       <span>Recent Searches</span>
//                       <button onClick={clearRecentSearches} className="mobile-search-clear-btn page-title-main-name">Clear</button>
//                     </div>
//                     <div className="mobile-search-tags">
//                       {recentSearches.map((s, i) => (
//                         <div key={i} onClick={() => handleRecentSearchClick(s)} className="mobile-search-tag">
//                           {s}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//                 {popularSearches.length > 0 && (
//                   <div className="mobile-search-section">
//                     <div className="mobile-search-section-header">
//                       <span>Popular Searches</span>
//                     </div>
//                     <div className="mobile-search-tags">
//                       {popularSearches.map((s, i) => (
//                         <div key={i} onClick={() => handleRecentSearchClick(s)} className="mobile-search-tag popular">
//                           {s}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ) : searchResults.length > 0 ? (
//               <div className="mobile-search-products">
//                 {searchResults.map((item) => {
//                   const discount = getDiscount(item);
//                   return (
//                     <div key={item._id} onClick={() => handleResultClick(item)} className="mobile-search-product">
//                       <div className="mobile-search-product-image">
//                         <img src={item.image} alt={item.name} loading="lazy" />
//                         {discount > 0 && <div className="mobile-search-product-discount">-{discount}%</div>}
//                       </div>
//                       <div className="mobile-search-product-info">
//                         <div className="mobile-search-product-brand">{item.brand}</div>
//                         <div className="mobile-search-product-name">{item.name}</div>
//                         <div className="mobile-search-product-price-row">
//                           <span className="mobile-search-product-price">₹{item.price}</span>
//                           {discount > 0 && <span className="mobile-search-product-original">₹{item.originalPrice}</span>}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//                 <div className="mobile-search-view-all" onClick={handleSearchSubmit}>
//                   View all results for "{searchText}" →
//                 </div>
//               </div>
//             ) : (
//               <div className="mobile-search-empty">
//                 <div>No products found for "{searchText}"</div>
//                 <small>Try different keywords</small>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* ---------- MAIN MOBILE HEADER BAR ---------- */}
//       <header className="header d-block">
//         <div className="d-flex justify-content-between margin-padding-header align-items-center">
//           <Link to="/" className="logo" onClick={closeMenu}>
//             <img src={logo} className="ps-sm-0 ps-4 ms-sm-0" alt="JOYORY Logo" />
//           </Link>
//           <div className="menu-toggle" onClick={() => setMenuOpen(true)}>
//             <img src={menu} alt="Menu" />
//           </div>
//           {!showMobileSearch && (
//             <div className="nav-icons user-dropdown gap-3 d-md-flex d-lg-none d-flex">
//               <div className="mobile-search-icon-wrapper" onClick={() => setShowMobileSearch(true)}>
//                 <img src={search} alt="Search" />
//               </div>
//               {/* <Link to="/cartpage" className="mobile-cart-icon" onClick={closeMenu}>
//                 <img src={Cart} alt="Cart" />
//                 {cartCount > 0 && <span className="cart-count page-title-main-name">{cartCount > 99 ? '99+' : cartCount}</span>}
//               </Link> */}


//               <Link to="/cartpage" className="mobile-cart-icon" onClick={closeMenu}>
//                 <img src={favourite} alt="Wishlist" />
//               </Link>
//             </div>
//           )}
//         </div>

//         {/* ---------- MOBILE DRAWER (MENU) ---------- */}
//         <nav className={`nav-links ${menuOpen ? "active" : ""}`} ref={mobileMenuRef}>
//           <div className="mobile-menu-header">
//             <div className="mobile-menu-logo">
//               <img src={logo} alt="JOYORY Logo" />
//             </div>
//             <div className="menu-close" onClick={closeMenu}>
//               <FaTimes size={22} />
//             </div>
//           </div>

//           <div className="nav-links-container w-100">
//             {/* Home */}
//             <div className="border-top-bottom">
//               <Link to="/" onClick={closeMenu} className="nav-link d-flex ms-3 page-title-main-name margin-top-home">
//                 Home
//               </Link>
//             </div>

//             {/* ✅ DIRECT MAIN CATEGORIES – no "Categories" header */}
//             <div className="border-top-bottom">
//               {!loadingCategories && categoriesToRender.map((cat) => (
//                 <div key={cat._id} className="mobile-category-item">
//                   <div className="mobile-category-main" onClick={() => toggleMobileCategory(cat._id)}>
//                     <Link to={`/category/${cat.slug}`} onClick={closeMenu} className="mobile-category-name page-title-main-name p-0">
//                       {cat.name}
//                     </Link>
//                     {cat.subCategories?.length > 0 && <FaAngleDown className={mobileCategoriesOpen[cat._id] ? 'open' : ''} />}
//                   </div>
//                   {mobileCategoriesOpen[cat._id] && renderMobileSubCategories(cat.subCategories)}
//                 </div>
//               ))}
//               {loadingCategories && (
//                 <div className="mobile-category-loading">Loading categories...</div>
//               )}
//             </div>

//             {/* Shade Finder (original) */}
//             <div className="border-top-bottom mobile-category-header">
//               <Link to="/FoundationShadeFinder" onClick={closeMenu} className="mt-1 pb-1 page-title-main-name shadefinder-name-mobile-tabalte">
//                 Shade Finder
//               </Link>
//             </div>

//             {/* ✅ Static menu items */}
//             <div className="border-top-bottom">
//               {STATIC_MENU_ITEMS.map((item) => (
//                 <Link
//                   key={item.label}
//                   to={item.path}
//                   onClick={closeMenu}
//                   className="nav-link d-flex ms-3 page-title-main-name mt-1 pb-1"
//                 >
//                   {item.label}
//                 </Link>
//               ))}
//             </div>

//             {/* User links */}
//             <div className="border-top-bottom page-title-main-name">
//               <Link to="/useraccount" onClick={closeMenu} className="nav-link mobile-profile-link ms-3 d-flex mt-1 pb-1">
//                 My Account
//               </Link>
//             </div>
//             <div className="border-top-bottom page-title-main-name">
//               <Link to="/Myorders" onClick={closeMenu} className="nav-link ms-3 d-flex mt-1 pb-1">
//                 My Orders
//               </Link>
//             </div>
//             <div>
//               {user && !user.guest ? (
//                 <div onClick={() => { logoutUser(); closeMenu(); }} className="nav-link logout-link ms-3 d-flex mt-1 pb-1 page-title-main-name">
//                   Logout
//                 </div>
//               ) : (
//                 <Link to="/login" onClick={closeMenu} className="nav-link ms-3 d-flex mt-1 pb-1 page-title-main-name">
//                   Login
//                 </Link>
//               )}
//             </div>
//           </div>
//         </nav>
//       </header>

//       {/* ---------- MOBILE FOOTER NAVIGATION ---------- */}
//       {(isMobile || isTablet) && (
//         <div className="mobile-footer-navigation w-100">
//           <Link to="/" onClick={closeMenu} className="mobile-footer-nav-item">
//             <img src={home} alt="Home" />
//             <div className="mobile-footer-nav-label page-title-main-name">Home</div>
//           </Link>
//           {/* <Link to="/wishlist" onClick={closeMenu} className="mobile-footer-nav-item">
//             <img src={favourite} alt="Wishlist" />
//             <div className="mobile-footer-nav-label page-title-main-name">Wishlist</div>
//           </Link> */}
//           <Link to="/cartpage" onClick={closeMenu} className="mobile-footer-nav-item">
//             <img src={Cart} alt="Cart" />
//             <div className="mobile-footer-nav-label page-title-main-name">Cart</div>
//             {cartCount > 0 && <div className="mobile-footer-cart-count">{cartCount > 9 ? '9+' : cartCount}</div>}
//           </Link>
//           <Link to="/useraccount" onClick={closeMenu} className="mobile-footer-nav-item">
//             <img src={users} alt="Profile" />
//             <div className="mobile-footer-nav-label page-title-main-name">Profile</div>
//           </Link>
//         </div>
//       )}
//     </>
//   );
// };

// export default Mobileheaderview;





















// import React, { useState, useRef, useEffect } from "react";
// import { FaAngleDown, FaTimes, FaArrowLeft, FaMicrophone, FaSearch } from "react-icons/fa";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance.js";
// import logo from "../assets/logo.png";
// import Cart from "../assets/Cart.svg";
// import favourite from "../assets/favourite.svg";
// import users from "../assets/user.svg";
// import search from "../assets/search.svg";
// import menu from "../assets/menu.svg";
// import home from "../assets/home.svg";

// // ✅ Active icons (add these files to your assets folder)
// import homeActive from "../assets/homeactive.svg";
// import cartActive from "../assets/Cartactive.svg";
// import userActive from "../assets/useractive.svg";
// // import favouriteActive from "../assets/favourite-active.svg"; // if you want to uncomment wishlist

// import "../css/Header/Header.css";
// import "../App.css";

// // ✅ STATIC MENU ITEMS – exactly like HeaderCategories
// const STATIC_MENU_ITEMS = [
//   { label: "Brands"},
//   { label: "Offers", path: "/offers" },
//   { label: "Virtual Try-on", path: "/virtualtryon" },
//   { label: "Shade finder", path: "/shadefinder" },
//   { label: "For you", path: "/foryoulanding" },
//   { label: "About us", path: "/aboutus" }
// ];

// const Mobileheaderview = ({
//   isMobile,
//   isTablet,
//   menuOpen,
//   setMenuOpen,
//   closeMenu,
//   user,
//   logoutUser,
//   cartCount,
//   categories: propCategories,
//   searchText,
//   setSearchText,
//   handleSearchSubmit,
//   startListening,
//   listening,
//   searchResults,
//   recentSearches,
//   popularSearches,
//   handleResultClick,
//   handleRecentSearchClick,
//   clearRecentSearches,
//   clearSearch,
//   searchInputRef
// }) => {
//   const navigate = useNavigate();
//   const location = useLocation();   // ← for active footer detection

//   // ---------- local mobile state ----------
//   const [showMobileSearch, setShowMobileSearch] = useState(false);
//   const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState({});

//   // ✅ fetch categories exactly like HeaderCategories
//   const [fetchedCategories, setFetchedCategories] = useState([]);
//   const [loadingCategories, setLoadingCategories] = useState(true);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await axiosInstance.get("/api/user/categories/tree");
//         setFetchedCategories(Array.isArray(res.data) ? res.data : []);
//       } catch (err) {
//         console.error("Category fetch failed in Mobileheaderview", err);
//         setFetchedCategories([]);
//       } finally {
//         setLoadingCategories(false);
//       }
//     };
//     fetchCategories();
//   }, []);

//   const mobileMenuRef = useRef(null);

//   // ---------- close drawer when clicking outside ----------
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && menuOpen) {
//         setMenuOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [menuOpen, setMenuOpen]);

//   // ---------- category toggle ----------
//   const toggleMobileCategory = (id) => {
//     setMobileCategoriesOpen(prev => ({ ...prev, [id]: !prev[id] }));
//   };

//   // ---------- render subcategories – dropdown ONLY for level 1 ----------
//   const renderMobileSubCategories = (subs, level = 1) => {
//     if (!subs?.length) return null;
//     return (
//       <div className={`mobile-subcategory mobile-subcategory-level-${level}`}>
//         {subs.map((sub) => (
//           <div key={sub._id} className="mobile-subcategory-item ps-3 page-title-main-name">
//             <div className="d-flex align-items-center justify-content-between">
//               <Link to={`/category/${sub.slug}`} onClick={closeMenu} className="mobile-subcategory-link p-0 ">
//                 {sub.name}
//               </Link>
//               {sub.subCategories?.length > 0 && level === 1 && (
//                 <FaAngleDown
//                   className={`mobile-category-toggle ${mobileCategoriesOpen[sub._id] ? 'open' : ''}`}
//                   onClick={(e) => {
//                     e.preventDefault();
//                     toggleMobileCategory(sub._id);
//                   }}
//                 />
//               )}
//             </div>
//             {level === 1 && mobileCategoriesOpen[sub._id] && renderMobileSubCategories(sub.subCategories, level + 1)}
//           </div>
//         ))}
//       </div>
//     );
//   };

//   // ---------- discount helper ----------
//   const getDiscount = (p) => {
//     if (p.originalPrice > p.price) {
//       return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
//     }
//     return 0;
//   };

//   // ---------- handle local mobile search overlay ----------
//   const handleMobileSearchBack = () => {
//     setShowMobileSearch(false);
//     setSearchText("");
//   };

//   const categoriesToRender = fetchedCategories.length > 0 ? fetchedCategories : propCategories;

//   // ---------- Footer Active Logic ----------
//   const isHomeActive = location.pathname === "/";
//   const isCartActive = location.pathname === "/cartpage";
//   const isProfileActive = location.pathname === "/useraccount";
//   // const isWishlistActive = location.pathname === "/wishlist"; // if you uncomment wishlist

//   return (
//     <>
//       {/* ---------- MOBILE SEARCH OVERLAY ---------- */}
//       {showMobileSearch && (
//         <div className="mobile-search-overlay">
//           {/* ... (unchanged) ... */}
//           <div className="mobile-search-header">
//             <FaArrowLeft className="mobile-search-back" onClick={handleMobileSearchBack} />
//             <form onSubmit={handleSearchSubmit} className="mobile-search-input-container">
//               <FaSearch className="mobile-search-icon" />
//               <input
//                 className="w-100 border-0 bg-transparent page-title-main-name"
//                 ref={searchInputRef}
//                 type="text"
//                 placeholder="Search products, brands..."
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 autoFocus
//               />
//               {searchText && <FaTimes className="mobile-search-clear" onClick={clearSearch} />}
//               <FaMicrophone className={`mobile-search-voice ${listening ? "listening" : ""}`} onClick={startListening} />
//             </form>
//             <button className="mobile-search-go page-title-main-name" onClick={handleSearchSubmit} disabled={!searchText.trim()}>
//               Go
//             </button>
//           </div>

//           <div className="mobile-search-results page-title-main-name">
//             {/* ... (search results code unchanged) ... */}
//             {!searchText.trim() ? (
//               <div className="mobile-search-suggestions">
//                 {recentSearches.length > 0 && (
//                   <div className="mobile-search-section">
//                     <div className="mobile-search-section-header">
//                       <span>Recent Searches</span>
//                       <button onClick={clearRecentSearches} className="mobile-search-clear-btn page-title-main-name">Clear</button>
//                     </div>
//                     <div className="mobile-search-tags">
//                       {recentSearches.map((s, i) => (
//                         <div key={i} onClick={() => handleRecentSearchClick(s)} className="mobile-search-tag">
//                           {s}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//                 {popularSearches.length > 0 && (
//                   <div className="mobile-search-section">
//                     <div className="mobile-search-section-header">
//                       <span>Popular Searches</span>
//                     </div>
//                     <div className="mobile-search-tags">
//                       {popularSearches.map((s, i) => (
//                         <div key={i} onClick={() => handleRecentSearchClick(s)} className="mobile-search-tag popular">
//                           {s}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ) : searchResults.length > 0 ? (
//               <div className="mobile-search-products">
//                 {searchResults.map((item) => {
//                   const discount = getDiscount(item);
//                   return (
//                     <div key={item._id} onClick={() => handleResultClick(item)} className="mobile-search-product">
//                       <div className="mobile-search-product-image">
//                         <img src={item.image} alt={item.name} loading="lazy" />
//                         {discount > 0 && <div className="mobile-search-product-discount">-{discount}%</div>}
//                       </div>
//                       <div className="mobile-search-product-info">
//                         <div className="mobile-search-product-brand">{item.brand}</div>
//                         <div className="mobile-search-product-name">{item.name}</div>
//                         <div className="mobile-search-product-price-row">
//                           <span className="mobile-search-product-price">₹{item.price}</span>
//                           {discount > 0 && <span className="mobile-search-product-original">₹{item.originalPrice}</span>}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//                 <div className="mobile-search-view-all" onClick={handleSearchSubmit}>
//                   View all results for "{searchText}" →
//                 </div>
//               </div>
//             ) : (
//               <div className="mobile-search-empty">
//                 <div>No products found for "{searchText}"</div>
//                 <small>Try different keywords</small>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* ---------- MAIN MOBILE HEADER BAR ---------- */}
//       <header className="header d-block">
//         <div className="d-flex justify-content-between margin-padding-header align-items-center">
//           <Link to="/" className="logo" onClick={closeMenu}>
//             <img src={logo} className="ps-sm-0 ps-4 ms-sm-0" alt="JOYORY Logo" />
//           </Link>
//           <div className="menu-toggle" onClick={() => setMenuOpen(true)}>
//             <img src={menu} alt="Menu" />
//           </div>
//           {!showMobileSearch && (
//             <div className="nav-icons user-dropdown gap-3 d-md-flex d-lg-none d-flex">
//               <div className="mobile-search-icon-wrapper" onClick={() => setShowMobileSearch(true)}>
//                 <img src={search} alt="Search" />
//               </div>
//               <Link to="/cartpage" className="mobile-cart-icon" onClick={closeMenu}>
//                 <img src={Cart} alt="Cart" />
//                 {cartCount > 0 && <span className="cart-count page-title-main-name">{cartCount > 99 ? '99+' : cartCount}</span>}
//               </Link>
//             </div>
//           )}
//         </div>

//         {/* ---------- MOBILE DRAWER (MENU) ---------- */}
//         <nav className={`nav-links ${menuOpen ? "active" : ""}`} ref={mobileMenuRef}>
//           <div className="mobile-menu-header">
//             <div className="mobile-menu-logo">
//               <img src={logo} alt="JOYORY Logo" />
//             </div>
//             <div className="menu-close" onClick={closeMenu}>
//               <FaTimes size={22} />
//             </div>
//           </div>

//           <div className="nav-links-container w-100">
//             {/* Home */}
//             <div className="border-top-bottom">
//               <Link to="/" onClick={closeMenu} className="nav-link d-flex ms-3 page-title-main-name margin-top-home">
//                 Home
//               </Link>
//             </div>

//             {/* ✅ DIRECT MAIN CATEGORIES – no "Categories" header */}
//             <div className="border-top-bottom">
//               {!loadingCategories && categoriesToRender.map((cat) => (
//                 <div key={cat._id} className="mobile-category-item">
//                   <div className="mobile-category-main" onClick={() => toggleMobileCategory(cat._id)}>
//                     <Link to={`/category/${cat.slug}`} onClick={closeMenu} className="mobile-category-name page-title-main-name p-0">
//                       {cat.name}
//                     </Link>
//                     {cat.subCategories?.length > 0 && <FaAngleDown className={mobileCategoriesOpen[cat._id] ? 'open' : ''} />}
//                   </div>
//                   {mobileCategoriesOpen[cat._id] && renderMobileSubCategories(cat.subCategories)}
//                 </div>
//               ))}
//               {loadingCategories && (
//                 <div className="mobile-category-loading">Loading categories...</div>
//               )}
//             </div>

//             {/* Shade Finder */}
//             <div className="border-top-bottom mobile-category-header">
//               <Link to="/FoundationShadeFinder" onClick={closeMenu} className="mt-1 pb-1 page-title-main-name shadefinder-name-mobile-tabalte">
//                 Shade Finder
//               </Link>
//             </div>

//             {/* Static menu items */}
//             <div className="border-top-bottom">
//               {STATIC_MENU_ITEMS.map((item) => (
//                 <Link
//                   key={item.label}
//                   to={item.path}
//                   onClick={closeMenu}
//                   className="nav-link d-flex ms-3 page-title-main-name mt-1 pb-1"
//                 >
//                   {item.label}
//                 </Link>
//               ))}
//             </div>

//             {/* User links */}
//             <div className="border-top-bottom page-title-main-name">
//               <Link to="/useraccount" onClick={closeMenu} className="nav-link mobile-profile-link ms-3 d-flex mt-1 pb-1">
//                 My Account
//               </Link>
//             </div>
//             <div className="border-top-bottom page-title-main-name">
//               <Link to="/Myorders" onClick={closeMenu} className="nav-link ms-3 d-flex mt-1 pb-1">
//                 My Orders
//               </Link>
//             </div>
//             <div>
//               {user && !user.guest ? (
//                 <div onClick={() => { logoutUser(); closeMenu(); }} className="nav-link logout-link ms-3 d-flex mt-1 pb-1 page-title-main-name">
//                   Logout
//                 </div>
//               ) : (
//                 <Link to="/login" onClick={closeMenu} className="nav-link ms-3 d-flex mt-1 pb-1 page-title-main-name">
//                   Login
//                 </Link>
//               )}
//             </div>
//           </div>
//         </nav>
//       </header>

//       {/* ========== MOBILE FOOTER NAVIGATION WITH ACTIVE STATE ========== */}
//       {/* {(isMobile || isTablet) && (
//         <div className="mobile-footer-navigation w-100">
//           <Link to="/" onClick={closeMenu} className={`mobile-footer-nav-item ${isHomeActive ? 'active' : ''}`}>
//             <img src={isHomeActive ? homeActive : home} alt="Home" />
//             <div className="mobile-footer-nav-label page-title-main-name">Home</div>
//           </Link>

//           <Link to="/wishlist" onClick={closeMenu} className={`mobile-footer-nav-item ${isWishlistActive ? 'active' : ''}`}>
//             <img src={isWishlistActive ? favouriteActive : favourite} alt="Wishlist" />
//             <div className="mobile-footer-nav-label page-title-main-name">Wishlist</div>
//           </Link>

//           <Link to="/cartpage" onClick={closeMenu} className={`mobile-footer-nav-item ${isCartActive ? 'active' : ''}`}>
//             <img src={isCartActive ? cartActive : Cart} alt="Cart" />
//             <div className="mobile-footer-nav-label page-title-main-name">Cart</div>
//             {cartCount > 0 && <div className="mobile-footer-cart-count">{cartCount > 9 ? '9+' : cartCount}</div>}
//           </Link>

//           <Link to="/useraccount" onClick={closeMenu} className={`mobile-footer-nav-item ${isProfileActive ? 'active' : ''}`}>
//             <img src={isProfileActive ? userActive : users} alt="Profile" />
//             <div className={`mobile-footer-nav-label page-title-main-name`}>Profile</div>
//           </Link>
//         </div>
//       )} */}

//       {/* ========== MOBILE FOOTER NAVIGATION WITH ACTIVE STATE ========== */}
//       {(isMobile || isTablet) && (
//         <div className="mobile-footer-navigation w-100">
//           <Link to="/" onClick={closeMenu} className={`mobile-footer-nav-item ${isHomeActive ? 'active' : ''}`}>
//             <img src={isHomeActive ? homeActive : home} alt="Home" />
//             <div className={`mobile-footer-nav-label page-title-main-name ${isHomeActive ? 'active' : ''}`}>
//               Home
//             </div>
//           </Link>

//           {/* Wishlist is commented – leave as is */}
//           {/* <Link to="/wishlist" ... /> */}

//           <Link to="/cartpage" onClick={closeMenu} className={`mobile-footer-nav-item ${isCartActive ? 'active' : ''}`}>
//             <img src={isCartActive ? cartActive : Cart} alt="Cart" />
//             <div className={`mobile-footer-nav-label page-title-main-name ${isCartActive ? 'active' : ''}`}>
//               Cart
//             </div>
//             {cartCount > 0 && <div className="mobile-footer-cart-count">{cartCount > 9 ? '9+' : cartCount}</div>}
//           </Link>

//           <Link to="/useraccount" onClick={closeMenu} className={`mobile-footer-nav-item ${isProfileActive ? 'active' : ''}`}>
//             <img src={isProfileActive ? userActive : users} alt="Profile" />
//             <div className={`mobile-footer-nav-label page-title-main-name ${isProfileActive ? 'active' : ''}`}>
//               Profile
//             </div>
//           </Link>
//         </div>
//       )}
//     </>
//   );
// };

// export default Mobileheaderview;



















// import React, { useState, useRef, useEffect } from "react";
// import { FaAngleDown, FaTimes, FaArrowLeft, FaMicrophone, FaSearch } from "react-icons/fa";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance.js";
// import logo from "../assets/logo.png";
// import Cart from "../assets/Cart.svg";
// import favourite from "../assets/favourite.svg";
// import users from "../assets/user.svg";
// import search from "../assets/search.svg";
// import menu from "../assets/menu.svg";
// import home from "../assets/home.svg";

// // ✅ Active icons (add these files to your assets folder)
// import homeActive from "../assets/homeactive.svg";
// import cartActive from "../assets/Cartactive.svg";
// import userActive from "../assets/useractive.svg";
// // import favouriteActive from "../assets/favourite-active.svg"; // if you want to uncomment wishlist

// import "../css/Header/Header.css";
// import "../App.css";

// // ✅ STATIC MENU ITEMS – exactly like HeaderCategories
// const STATIC_MENU_ITEMS = [
//   { label: "Brands"},
//   { label: "Offers", path: "/offers" },
//   { label: "Virtual Try-on", path: "/virtualtryon" },
//   { label: "Shade finder", path: "/shadefinder" },
//   { label: "For you", path: "/foryoulanding" },
//   { label: "About us", path: "/aboutus" }
// ];

// const Mobileheaderview = ({
//   isMobile,
//   isTablet,
//   menuOpen,
//   setMenuOpen,
//   closeMenu,
//   user,
//   logoutUser,
//   cartCount,
//   categories: propCategories,
//   searchText,
//   setSearchText,
//   handleSearchSubmit,
//   startListening,
//   listening,
//   searchResults,
//   recentSearches,
//   popularSearches,
//   handleResultClick,
//   handleRecentSearchClick,
//   clearRecentSearches,
//   clearSearch,
//   searchInputRef
// }) => {
//   const navigate = useNavigate();
//   const location = useLocation();   // ← for active footer detection

//   // ---------- local mobile state ----------
//   const [showMobileSearch, setShowMobileSearch] = useState(false);
//   const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState({});

//   // ✅ fetch categories exactly like HeaderCategories
//   const [fetchedCategories, setFetchedCategories] = useState([]);
//   const [loadingCategories, setLoadingCategories] = useState(true);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await axiosInstance.get("/api/user/categories/tree");
//         setFetchedCategories(Array.isArray(res.data) ? res.data : []);
//       } catch (err) {
//         console.error("Category fetch failed in Mobileheaderview", err);
//         setFetchedCategories([]);
//       } finally {
//         setLoadingCategories(false);
//       }
//     };
//     fetchCategories();
//   }, []);

//   const mobileMenuRef = useRef(null);

//   // ---------- close drawer when clicking outside ----------
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && menuOpen) {
//         setMenuOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [menuOpen, setMenuOpen]);

//   // ---------- category toggle ----------
//   const toggleMobileCategory = (id) => {
//     setMobileCategoriesOpen(prev => ({ ...prev, [id]: !prev[id] }));
//   };

//   // ---------- render subcategories – dropdown ONLY for level 1 ----------
//   const renderMobileSubCategories = (subs, level = 1) => {
//     if (!subs?.length) return null;
//     return (
//       <div className={`mobile-subcategory mobile-subcategory-level-${level}`}>
//         {subs.map((sub) => (
//           <div key={sub._id} className="mobile-subcategory-item ps-3 page-title-main-name">
//             <div className="d-flex align-items-center justify-content-between">
//               <Link to={`/category/${sub.slug}`} onClick={closeMenu} className="mobile-subcategory-link p-0 ">
//                 {sub.name}
//               </Link>
//               {sub.subCategories?.length > 0 && level === 1 && (
//                 <FaAngleDown
//                   className={`mobile-category-toggle ${mobileCategoriesOpen[sub._id] ? 'open' : ''}`}
//                   onClick={(e) => {
//                     e.preventDefault();
//                     toggleMobileCategory(sub._id);
//                   }}
//                 />
//               )}
//             </div>
//             {level === 1 && mobileCategoriesOpen[sub._id] && renderMobileSubCategories(sub.subCategories, level + 1)}
//           </div>
//         ))}
//       </div>
//     );
//   };

//   // ---------- discount helper ----------
//   const getDiscount = (p) => {
//     if (p.originalPrice > p.price) {
//       return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
//     }
//     return 0;
//   };

//   // ---------- handle local mobile search overlay ----------
//   const handleMobileSearchBack = () => {
//     setShowMobileSearch(false);
//     setSearchText("");
//   };

//   // ---------- 🔥 NEW: Logic for Static Menu Items (Login Check for "For you") ----------
//   const handleStaticItemClick = (e, item) => {
//     // Check if it is the "For you" link
//     if (item.label === "For you") {
//       // If user is not logged in or is a guest
//       if (!user || user.guest) {
//         e.preventDefault(); // Stop standard link navigation
//         closeMenu(); // Close mobile menu drawer
//         navigate("/login", { state: { from: "/foryoulanding" } }); // Redirect to login
//         return;
//       }
//     }

//     // Stop navigation if item has no path (like "Brands" which has no path in the array)
//     if (!item.path) {
//       e.preventDefault();
//     }

//     // Default close menu for all other valid links
//     closeMenu();
//   };

//   const categoriesToRender = fetchedCategories.length > 0 ? fetchedCategories : propCategories;

//   // ---------- Footer Active Logic ----------
//   const isHomeActive = location.pathname === "/";
//   const isCartActive = location.pathname === "/cartpage";
//   const isProfileActive = location.pathname === "/useraccount";
//   // const isWishlistActive = location.pathname === "/wishlist"; // if you uncomment wishlist

//   return (
//     <>
//       {/* ---------- MOBILE SEARCH OVERLAY ---------- */}
//       {showMobileSearch && (
//         <div className="mobile-search-overlay">
//           {/* ... (unchanged) ... */}
//           <div className="mobile-search-header">
//             <FaArrowLeft className="mobile-search-back" onClick={handleMobileSearchBack} />
//             <form onSubmit={handleSearchSubmit} className="mobile-search-input-container">
//               <FaSearch className="mobile-search-icon" />
//               <input
//                 className="w-100 border-0 bg-transparent page-title-main-name"
//                 ref={searchInputRef}
//                 type="text"
//                 placeholder="Search products, brands..."
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 autoFocus
//               />
//               {searchText && <FaTimes className="mobile-search-clear" onClick={clearSearch} />}
//               <FaMicrophone className={`mobile-search-voice ${listening ? "listening" : ""}`} onClick={startListening} />
//             </form>
//             <button className="mobile-search-go page-title-main-name" onClick={handleSearchSubmit} disabled={!searchText.trim()}>
//               Go
//             </button>
//           </div>

//           <div className="mobile-search-results page-title-main-name">
//             {/* ... (search results code unchanged) ... */}
//             {!searchText.trim() ? (
//               <div className="mobile-search-suggestions">
//                 {recentSearches.length > 0 && (
//                   <div className="mobile-search-section">
//                     <div className="mobile-search-section-header">
//                       <span>Recent Searches</span>
//                       <button onClick={clearRecentSearches} className="mobile-search-clear-btn page-title-main-name">Clear</button>
//                     </div>
//                     <div className="mobile-search-tags">
//                       {recentSearches.map((s, i) => (
//                         <div key={i} onClick={() => handleRecentSearchClick(s)} className="mobile-search-tag">
//                           {s}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//                 {popularSearches.length > 0 && (
//                   <div className="mobile-search-section">
//                     <div className="mobile-search-section-header">
//                       <span>Popular Searches</span>
//                     </div>
//                     <div className="mobile-search-tags">
//                       {popularSearches.map((s, i) => (
//                         <div key={i} onClick={() => handleRecentSearchClick(s)} className="mobile-search-tag popular">
//                           {s}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ) : searchResults.length > 0 ? (
//               <div className="mobile-search-products">
//                 {searchResults.map((item) => {
//                   const discount = getDiscount(item);
//                   return (
//                     <div key={item._id} onClick={() => handleResultClick(item)} className="mobile-search-product">
//                       <div className="mobile-search-product-image">
//                         <img src={item.image} alt={item.name} loading="lazy" />
//                         {discount > 0 && <div className="mobile-search-product-discount">-{discount}%</div>}
//                       </div>
//                       <div className="mobile-search-product-info">
//                         <div className="mobile-search-product-brand">{item.brand}</div>
//                         <div className="mobile-search-product-name">{item.name}</div>
//                         <div className="mobile-search-product-price-row">
//                           <span className="mobile-search-product-price">₹{item.price}</span>
//                           {discount > 0 && <span className="mobile-search-product-original">₹{item.originalPrice}</span>}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//                 <div className="mobile-search-view-all" onClick={handleSearchSubmit}>
//                   View all results for "{searchText}" →
//                 </div>
//               </div>
//             ) : (
//               <div className="mobile-search-empty">
//                 <div>No products found for "{searchText}"</div>
//                 <small>Try different keywords</small>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* ---------- MAIN MOBILE HEADER BAR ---------- */}
//       <header className="header d-block">
//         <div className="d-flex justify-content-between margin-padding-header align-items-center">
//           <Link to="/" className="logo" onClick={closeMenu}>
//             <img src={logo} className="ps-sm-0 ps-4 ms-sm-0" alt="JOYORY Logo" />
//           </Link>
//           <div className="menu-toggle" onClick={() => setMenuOpen(true)}>
//             <img src={menu} alt="Menu" />
//           </div>
//           {!showMobileSearch && (
//             <div className="nav-icons user-dropdown gap-3 d-md-flex d-lg-none d-flex">
//               <div className="mobile-search-icon-wrapper" onClick={() => setShowMobileSearch(true)}>
//                 <img src={search} alt="Search" />
//               </div>
//               <Link to="/cartpage" className="mobile-cart-icon" onClick={closeMenu}>
//                 <img src={Cart} alt="Cart" />
//                 {cartCount > 0 && <span className="cart-count page-title-main-name">{cartCount > 99 ? '99+' : cartCount}</span>}
//               </Link>
//             </div>
//           )}
//         </div>

//         {/* ---------- MOBILE DRAWER (MENU) ---------- */}
//         <nav className={`nav-links ${menuOpen ? "active" : ""}`} ref={mobileMenuRef}>
//           <div className="mobile-menu-header">
//             <div className="mobile-menu-logo">
//               <img src={logo} alt="JOYORY Logo" />
//             </div>
//             <div className="menu-close" onClick={closeMenu}>
//               <FaTimes size={22} />
//             </div>
//           </div>

//           <div className="nav-links-container w-100">
//             {/* Home */}
//             <div className="border-top-bottom">
//               <Link to="/" onClick={closeMenu} className="nav-link d-flex ms-3 page-title-main-name margin-top-home">
//                 Home
//               </Link>
//             </div>

//             {/* ✅ DIRECT MAIN CATEGORIES – no "Categories" header */}
//             <div className="border-top-bottom">
//               {!loadingCategories && categoriesToRender.map((cat) => (
//                 <div key={cat._id} className="mobile-category-item">
//                   <div className="mobile-category-main" onClick={() => toggleMobileCategory(cat._id)}>
//                     <Link to={`/category/${cat.slug}`} onClick={closeMenu} className="mobile-category-name page-title-main-name p-0">
//                       {cat.name}
//                     </Link>
//                     {cat.subCategories?.length > 0 && <FaAngleDown className={mobileCategoriesOpen[cat._id] ? 'open' : ''} />}
//                   </div>
//                   {mobileCategoriesOpen[cat._id] && renderMobileSubCategories(cat.subCategories)}
//                 </div>
//               ))}
//               {loadingCategories && (
//                 <div className="mobile-category-loading">Loading categories...</div>
//               )}
//             </div>

//             {/* Shade Finder */}
//             <div className="border-top-bottom mobile-category-header">
//               <Link to="/FoundationShadeFinder" onClick={closeMenu} className="mt-1 pb-1 page-title-main-name shadefinder-name-mobile-tabalte">
//                 Shade Finder
//               </Link>
//             </div>

//             {/* Static menu items */}
//             <div className="border-top-bottom">
//               {STATIC_MENU_ITEMS.map((item) => (
//                 <Link
//                   key={item.label}
//                   to={item.path || "#"}
//                   onClick={(e) => handleStaticItemClick(e, item)}
//                   className="nav-link d-flex ms-3 page-title-main-name mt-1 pb-1"
//                 >
//                   {item.label}
//                 </Link>
//               ))}
//             </div>

//             {/* User links */}
//             <div className="border-top-bottom page-title-main-name">
//               <Link to="/useraccount" onClick={closeMenu} className="nav-link mobile-profile-link ms-3 d-flex mt-1 pb-1">
//                 My Account
//               </Link>
//             </div>
//             <div className="border-top-bottom page-title-main-name">
//               <Link to="/Myorders" onClick={closeMenu} className="nav-link ms-3 d-flex mt-1 pb-1">
//                 My Orders
//               </Link>
//             </div>
//             <div>
//               {user && !user.guest ? (
//                 <div onClick={() => { logoutUser(); closeMenu(); }} className="nav-link logout-link ms-3 d-flex mt-1 pb-1 page-title-main-name">
//                   Logout
//                 </div>
//               ) : (
//                 <Link to="/login" onClick={closeMenu} className="nav-link ms-3 d-flex mt-1 pb-1 page-title-main-name">
//                   Login
//                 </Link>
//               )}
//             </div>
//           </div>
//         </nav>
//       </header>

//       {/* ========== MOBILE FOOTER NAVIGATION WITH ACTIVE STATE ========== */}
//       {(isMobile || isTablet) && (
//         <div className="mobile-footer-navigation w-100">
//           <Link to="/" onClick={closeMenu} className={`mobile-footer-nav-item ${isHomeActive ? 'active' : ''}`}>
//             <img src={isHomeActive ? homeActive : home} alt="Home" />
//             <div className={`mobile-footer-nav-label page-title-main-name ${isHomeActive ? 'active' : ''}`}>
//               Home
//             </div>
//           </Link>

//           {/* Wishlist is commented – leave as is */}
//           {/* <Link to="/wishlist" ... /> */}

//           <Link to="/cartpage" onClick={closeMenu} className={`mobile-footer-nav-item ${isCartActive ? 'active' : ''}`}>
//             <img src={isCartActive ? cartActive : Cart} alt="Cart" />
//             <div className={`mobile-footer-nav-label page-title-main-name ${isCartActive ? 'active' : ''}`}>
//               Cart
//             </div>
//             {cartCount > 0 && <div className="mobile-footer-cart-count">{cartCount > 9 ? '9+' : cartCount}</div>}
//           </Link>

//           <Link to="/useraccount" onClick={closeMenu} className={`mobile-footer-nav-item ${isProfileActive ? 'active' : ''}`}>
//             <img src={isProfileActive ? userActive : users} alt="Profile" />
//             <div className={`mobile-footer-nav-label page-title-main-name ${isProfileActive ? 'active' : ''}`}>
//               Profile
//             </div>
//           </Link>
//         </div>
//       )}
//     </>
//   );
// };

// export default Mobileheaderview;





















// // src/components/Mobileheaderview.jsx
// import React, { useState, useRef, useEffect } from "react";
// import { FaAngleDown, FaTimes, FaArrowLeft, FaMicrophone, FaSearch } from "react-icons/fa";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance.js";
// import logo from "../assets/logo.png";
// import Cart from "../assets/Cart.svg";
// import users from "../assets/user.svg";
// import search from "../assets/search.svg";
// import menu from "../assets/menu.svg";
// import home from "../assets/home.svg";

// // Active icons
// import homeActive from "../assets/homeactive.svg";
// import cartActive from "../assets/Cartactive.svg";
// import userActive from "../assets/useractive.svg";

// import "../css/Header/Header.css";
// import "../App.css";

// // Static Menu Items
// const STATIC_MENU_ITEMS = [
//   { label: "Brands" },
//   { label: "Offers", path: "/offers" },
//   { label: "Virtual Try-on", path: "/virtualtryon" },
//   { label: "Shade finder", path: "/shadefinder" },
//   { label: "For you", path: "/foryoulanding" },
//   { label: "About us", path: "/aboutus" }
// ];

// const Mobileheaderview = ({
//   isMobile,
//   isTablet,
//   menuOpen,
//   setMenuOpen,
//   closeMenu,
//   user,
//   logoutUser,
//   cartCount,
//   categories: propCategories,
//   searchText,
//   setSearchText,
//   handleSearchSubmit,
//   startListening,
//   listening,
//   searchResults,
//   recentSearches,
//   popularSearches,
//   handleResultClick,
//   handleRecentSearchClick,
//   clearRecentSearches,
//   clearSearch,
//   searchInputRef
// }) => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [showMobileSearch, setShowMobileSearch] = useState(false);
//   const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState({});

//   // Fetch categories
//   const [fetchedCategories, setFetchedCategories] = useState([]);
//   const [loadingCategories, setLoadingCategories] = useState(true);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await axiosInstance.get("/api/user/categories/tree");
//         setFetchedCategories(Array.isArray(res.data) ? res.data : []);
//       } catch (err) {
//         console.error("Category fetch failed in Mobileheaderview", err);
//         setFetchedCategories([]);
//       } finally {
//         setLoadingCategories(false);
//       }
//     };
//     fetchCategories();
//   }, []);

//   const mobileMenuRef = useRef(null);

//   // Close drawer when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && menuOpen) {
//         setMenuOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [menuOpen, setMenuOpen]);

//   // Toggle subcategory dropdown
//   const toggleMobileCategory = (id) => {
//     setMobileCategoriesOpen(prev => ({ ...prev, [id]: !prev[id] }));
//   };

//   // ==================== PROTECTED NAVIGATION ====================
//   const handleProtectedNavigation = (path, label) => {
//     if (!user || user.guest) {
//       navigate("/login", { 
//         state: { from: path, message: `Please login to access ${label}` } 
//       });
//       closeMenu();
//       return;
//     }
//     navigate(path);
//     closeMenu();
//   };


//   const handleMobileSearchBack = () => {
//     setShowMobileSearch(false);
//     setSearchText("");
//   };

//   // ==================== RENDER SUBCATEGORIES ====================
//   const renderMobileSubCategories = (subs, level = 1) => {
//     if (!subs?.length) return null;
//     return (
//       <div className={`mobile-subcategory mobile-subcategory-level-${level}`}>
//         {subs.map((sub) => (
//           <div key={sub._id} className="mobile-subcategory-item ps-3 page-title-main-name">
//             <div className="d-flex align-items-center justify-content-between">
//               {/* Sub Category → Product Listing Page */}
//               <Link 
//                 to={`/products/category/${sub.slug}`} 
//                 onClick={closeMenu} 
//                 className="mobile-subcategory-link p-0"
//               >
//                 {sub.name}
//               </Link>

//               {sub.subCategories?.length > 0 && level === 1 && (
//                 <FaAngleDown
//                   className={`mobile-category-toggle ${mobileCategoriesOpen[sub._id] ? 'open' : ''}`}
//                   onClick={(e) => {
//                     e.preventDefault();
//                     toggleMobileCategory(sub._id);
//                   }}
//                 />
//               )}
//             </div>
//             {level === 1 && mobileCategoriesOpen[sub._id] && renderMobileSubCategories(sub.subCategories, level + 1)}
//           </div>
//         ))}
//       </div>
//     );
//   };

//   const categoriesToRender = fetchedCategories.length > 0 ? fetchedCategories : propCategories;

//   // Footer Active States
//   const isHomeActive = location.pathname === "/";
//   const isCartActive = location.pathname === "/cartpage";
//   const isProfileActive = location.pathname === "/useraccount";

//   return (
//     <>
//       {/* Mobile Search Overlay - unchanged */}
//       {showMobileSearch && (
//         <div className="mobile-search-overlay">
//           <div className="mobile-search-header">
//              <FaArrowLeft className="mobile-search-back" onClick={handleMobileSearchBack} />
//              <form onSubmit={handleSearchSubmit} className="mobile-search-input-container">
//                <FaSearch className="mobile-search-icon" />
//                <input
//                 className="w-100 border-0 bg-transparent page-title-main-name"
//                 ref={searchInputRef}
//                 type="text"
//                 placeholder="Search products, brands..."
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 autoFocus
//               />
//               {searchText && <FaTimes className="mobile-search-clear" onClick={clearSearch} />}
//               <FaMicrophone className={`mobile-search-voice ${listening ? "listening" : ""}`} onClick={startListening} />
//             </form>
//             <button className="mobile-search-go page-title-main-name" onClick={handleSearchSubmit} disabled={!searchText.trim()}>
//               Go
//             </button>
//           </div>

//           <div className="mobile-search-results page-title-main-name">
//             {/* ... (search results code unchanged) ... */}
//             {!searchText.trim() ? (
//               <div className="mobile-search-suggestions">
//                 {recentSearches.length > 0 && (
//                   <div className="mobile-search-section">
//                     <div className="mobile-search-section-header">
//                       <span>Recent Searches</span>
//                       <button onClick={clearRecentSearches} className="mobile-search-clear-btn page-title-main-name">Clear</button>
//                     </div>
//                     <div className="mobile-search-tags">
//                       {recentSearches.map((s, i) => (
//                         <div key={i} onClick={() => handleRecentSearchClick(s)} className="mobile-search-tag">
//                           {s}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//                 {popularSearches.length > 0 && (
//                   <div className="mobile-search-section">
//                     <div className="mobile-search-section-header">
//                       <span>Popular Searches</span>
//                     </div>
//                     <div className="mobile-search-tags">
//                       {popularSearches.map((s, i) => (
//                         <div key={i} onClick={() => handleRecentSearchClick(s)} className="mobile-search-tag popular">
//                           {s}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ) : searchResults.length > 0 ? (
//               <div className="mobile-search-products">
//                 {searchResults.map((item) => {
//                   const discount = getDiscount(item);
//                   return (
//                     <div key={item._id} onClick={() => handleResultClick(item)} className="mobile-search-product">
//                       <div className="mobile-search-product-image">
//                         <img src={item.image} alt={item.name} loading="lazy" />
//                         {discount > 0 && <div className="mobile-search-product-discount">-{discount}%</div>}
//                       </div>
//                       <div className="mobile-search-product-info">
//                         <div className="mobile-search-product-brand">{item.brand}</div>
//                         <div className="mobile-search-product-name">{item.name}</div>
//                         <div className="mobile-search-product-price-row">
//                           <span className="mobile-search-product-price">₹{item.price}</span>
//                           {discount > 0 && <span className="mobile-search-product-original">₹{item.originalPrice}</span>}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//                 <div className="mobile-search-view-all" onClick={handleSearchSubmit}>
//                   View all results for "{searchText}" →
//                 </div>
//               </div>
//             ) : (
//               <div className="mobile-search-empty">
//                 <div>No products found for "{searchText}"</div>
//                 <small>Try different keywords</small>
//               </div>
//             )}
//            </div>
//         </div>
//       )}

//       {/* Main Mobile Header */}
//       <header className="header d-block">
//         <div className="d-flex justify-content-between margin-padding-header align-items-center">
//           <Link to="/" className="logo" onClick={closeMenu}>
//             <img src={logo} className="ps-sm-0 ps-4 ms-sm-0" alt="JOYORY Logo" />
//           </Link>

//           <div className="menu-toggle" onClick={() => setMenuOpen(true)}>
//             <img src={menu} alt="Menu" />
//           </div>

//           {!showMobileSearch && (
//             <div className="nav-icons user-dropdown gap-3 d-md-flex d-lg-none d-flex">
//               <div className="mobile-search-icon-wrapper" onClick={() => setShowMobileSearch(true)}>
//                 <img src={search} alt="Search" />
//               </div>
//               <Link to="/cartpage" className="mobile-cart-icon" onClick={closeMenu}>
//                 <img src={Cart} alt="Cart" />
//                 {cartCount > 0 && <span className="cart-count page-title-main-name">{cartCount > 99 ? '99+' : cartCount}</span>}
//               </Link>
//             </div>
//           )}
//         </div>

//         {/* Mobile Drawer Menu */}
//         <nav className={`nav-links ${menuOpen ? "active" : ""}`} ref={mobileMenuRef}>
//           <div className="mobile-menu-header">
//             <div className="mobile-menu-logo">
//               <img src={logo} alt="JOYORY Logo" />
//             </div>
//             <div className="menu-close" onClick={closeMenu}>
//               <FaTimes size={22} />
//             </div>
//           </div>

//           <div className="nav-links-container w-100">
//             {/* Home */}
//             <div className="border-top-bottom">
//               <Link to="/" onClick={closeMenu} className="nav-link d-flex ms-3 page-title-main-name margin-top-home">
//                 Home
//               </Link>
//             </div>

//             {/* Main Categories → Category Landing Page */}
//             <div className="border-top-bottom">
//               {!loadingCategories && categoriesToRender.map((cat) => (
//                 <div key={cat._id} className="mobile-category-item">
//                   <div className="mobile-category-main">
//                     {/* Main Category Click → Category Landing Page */}
//                     <Link 
//                       to={`/category/${cat.slug}`} 
//                       onClick={closeMenu} 
//                       className="mobile-category-name page-title-main-name p-0"
//                     >
//                       {cat.name}
//                     </Link>

//                     {cat.subCategories?.length > 0 && (
//                       <FaAngleDown
//                         className={`mobile-category-toggle ${mobileCategoriesOpen[cat._id] ? 'open' : ''}`}
//                         onClick={(e) => {
//                           e.preventDefault();
//                           toggleMobileCategory(cat._id);
//                         }}
//                       />
//                     )}
//                   </div>

//                   {/* Sub Categories → Product Listing Page */}
//                   {mobileCategoriesOpen[cat._id] && renderMobileSubCategories(cat.subCategories)}
//                 </div>
//               ))}

//               {loadingCategories && <div className="mobile-category-loading">Loading categories...</div>}
//             </div>

//             {/* Shade Finder */}
//             <div className="border-top-bottom mobile-category-header">
//               <Link to="/FoundationShadeFinder" onClick={closeMenu} className="mt-1 pb-1 page-title-main-name shadefinder-name-mobile-tabalte">
//                 Shade Finder
//               </Link>
//             </div>

//             {/* Static Menu Items with Protection */}
//             <div className="border-top-bottom">
//               {STATIC_MENU_ITEMS.map((item) => {
//                 const isForYou = item.path === "/foryoulanding";

//                 return (
//                   <div
//                     key={item.label}
//                     onClick={() => {
//                       if (isForYou) {
//                         if (!user || user.guest) {
//                           navigate("/login", { state: { from: "/foryoulanding" } });
//                         } else {
//                           navigate(item.path);
//                         }
//                       } else if (item.path) {
//                         navigate(item.path);
//                       }
//                       closeMenu();
//                     }}
//                     className="nav-link d-flex ms-3 page-title-main-name mt-1 pb-1 cursor-pointer"
//                   >
//                     {item.label}
//                   </div>
//                 );
//               })}
//             </div>

//             {/* User Links */}
//             <div className="border-top-bottom page-title-main-name">
//               <Link to="/useraccount" onClick={closeMenu} className="nav-link mobile-profile-link ms-3 d-flex mt-1 pb-1">
//                 My Account
//               </Link>
//             </div>
//             <div className="border-top-bottom page-title-main-name">
//               <Link to="/Myorders" onClick={closeMenu} className="nav-link ms-3 d-flex mt-1 pb-1">
//                 My Orders
//               </Link>
//             </div>

//             <div>
//               {user && !user.guest ? (
//                 <div onClick={() => { logoutUser(); closeMenu(); }} className="nav-link logout-link ms-3 d-flex mt-1 pb-1 page-title-main-name cursor-pointer">
//                   Logout
//                 </div>
//               ) : (
//                 <Link to="/login" onClick={closeMenu} className="nav-link ms-3 d-flex mt-1 pb-1 page-title-main-name">
//                   Login
//                 </Link>
//               )}
//             </div>
//           </div>
//         </nav>
//       </header>

//       {/* Mobile Footer Navigation */}
//       {(isMobile || isTablet) && (
//         <div className="mobile-footer-navigation w-100">
//           <Link to="/" onClick={closeMenu} className={`mobile-footer-nav-item ${isHomeActive ? 'active' : ''}`}>
//             <img src={isHomeActive ? homeActive : home} alt="Home" />
//             <div className={`mobile-footer-nav-label page-title-main-name ${isHomeActive ? 'active' : ''}`}>Home</div>
//           </Link>

//           <Link to="/cartpage" onClick={closeMenu} className={`mobile-footer-nav-item ${isCartActive ? 'active' : ''}`}>
//             <img src={isCartActive ? cartActive : Cart} alt="Cart" />
//             <div className={`mobile-footer-nav-label page-title-main-name ${isCartActive ? 'active' : ''}`}>Cart</div>
//             {cartCount > 0 && <div className="mobile-footer-cart-count">{cartCount > 9 ? '9+' : cartCount}</div>}
//           </Link>

//           <Link to="/useraccount" onClick={closeMenu} className={`mobile-footer-nav-item ${isProfileActive ? 'active' : ''}`}>
//             <img src={isProfileActive ? userActive : users} alt="Profile" />
//             <div className={`mobile-footer-nav-label page-title-main-name ${isProfileActive ? 'active' : ''}`}>Profile</div>
//           </Link>
//         </div>
//       )}
//     </>
//   );
// };

// export default Mobileheaderview;

























// src/components/Mobileheaderview.jsx
import React, { useState, useRef, useEffect } from "react";
import { FaAngleDown, FaTimes, FaArrowLeft, FaMicrophone, FaSearch } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance.js";
import logo from "../assets/logo.png";
import Cart from "../assets/Cart.svg";
import users from "../assets/user.svg";
import search from "../assets/search.svg";
import menu from "../assets/menu.svg";
import home from "../assets/home.svg";
import HeaderSearchbar from "./HeaderSearchbar";

// Active icons
import homeActive from "../assets/homeactive.svg";
import cartActive from "../assets/Cartactive.svg";
import userActive from "../assets/useractive.svg";

import wishlist from "../assets/favourite.svg";      // or .png
import wishlistActive from "../assets/favourite-active.svg";

import "../css/Header/Header.css";
import "../App.css";

// Static Menu Items
const STATIC_MENU_ITEMS = [
  { label: "Brands" , path: "/" },
  { label: "Offers", path: "/offerlanding" },
  { label: "Virtual Try-on", path: "/virtualtryon" },
  { label: "Shade finder", path: "/shadefinder" },
  { label: "For you", path: "/foryoulanding" },
  { label: "About us", path: "/aboutus" }
];

const Mobileheaderview = ({
  isMobile,
  isTablet,
  menuOpen,
  setMenuOpen,
  closeMenu,
  user,
  logoutUser,
  cartCount,
  categories: propCategories,
  searchText,
  setSearchText,
  handleSearchSubmit,
  startListening,
  listening,
  searchResults,
  recentSearches,
  popularSearches,
  handleResultClick,
  handleRecentSearchClick,
  clearRecentSearches,
  clearSearch,
  searchInputRef,
    wishlistCount,        // ← ADD THIS
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState({});
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const isWishlistActive = location.pathname === "/wishlist";

  

  // Fetch categories
  const [fetchedCategories, setFetchedCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/api/user/categories/tree");
        setFetchedCategories(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Category fetch failed in Mobileheaderview", err);
        setFetchedCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const mobileMenuRef = useRef(null);



//   const [wishlistCount, setWishlistCount] = useState(0);

// useEffect(() => {
//   const getWishlistCount = () => {
//     if (user && !user.guest) {
//       // Fetch from API or use context
//       // setWishlistCount(apiWishlistCount);
//     } else {
//       const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];
//       setWishlistCount(guestWishlist.length);
//     }
//   };
//   getWishlistCount();
// }, [user]);

  // Close drawer when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && menuOpen) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen, setMenuOpen]);

  // Toggle subcategory dropdown
  const toggleMobileCategory = (id) => {
    setMobileCategoriesOpen(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // ==================== PROTECTED NAVIGATION ====================
  const handleProtectedNavigation = (path, label) => {
    if (!user || user.guest) {
      navigate("/login", {
        state: { from: path, message: `Please login to access ${label}` }
      });
      closeMenu();
      return;
    }
    navigate(path);
    closeMenu();
  };

  const confirmLogout = () => {
    logoutUser();
    setShowLogoutModal(false);
    closeMenu();
    navigate("/login");
  };

  const handleMobileSearchBack = () => {
    setShowMobileSearch(false);
    setSearchText("");
  };

  // ==================== RENDER SUBCATEGORIES ====================
  const renderMobileSubCategories = (subs, level = 1) => {
    if (!subs?.length) return null;
    return (
      <div className={`mobile-subcategory mobile-subcategory-level-${level}`}>
        {subs.map((sub) => (
          <div key={sub._id} className="mobile-subcategory-item ps-3 page-title-main-name">
            <div className="d-flex align-items-center justify-content-between">
              {/* Sub Category → Product Listing Page */}
              <Link
                to={`/products/category/${sub.slug}`}
                onClick={closeMenu}
                className="mobile-subcategory-link p-0"
              >
                {sub.name}
              </Link>

              {sub.subCategories?.length > 0 && level === 1 && (
                <FaAngleDown
                  className={`mobile-category-toggle ${mobileCategoriesOpen[sub._id] ? 'open' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleMobileCategory(sub._id);
                  }}
                />
              )}
            </div>
            {level === 1 && mobileCategoriesOpen[sub._id] && renderMobileSubCategories(sub.subCategories, level + 1)}
          </div>
        ))}
      </div>
    );
  };

  const categoriesToRender = fetchedCategories.length > 0 ? fetchedCategories : propCategories;

  // Footer Active States
  const isHomeActive = location.pathname === "/";
  const isCartActive = location.pathname === "/cartpage";
  const isProfileActive = location.pathname === "/useraccount";


  const getDiscount = (p) => {
  if (!p?.originalPrice || !p?.price) return 0;

  if (p.originalPrice > p.price) {
    return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
  }
  return 0;
};

  return (
    <>
      {/* Mobile Search Overlay - unchanged */}
      {showMobileSearch && (
        <div className="mobile-search-overlay">
          <div className="mobile-search-header">
            <FaArrowLeft className="mobile-search-back" onClick={handleMobileSearchBack} />
            <form onSubmit={handleSearchSubmit} className="mobile-search-input-container">
              <FaSearch className="mobile-search-icon" />
              <input
                className="w-100 border-0 bg-transparent page-title-main-name"
                ref={searchInputRef}
                type="text"
                placeholder="Search products, brands..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                autoFocus
              />
              {searchText && <FaTimes className="mobile-search-clear" onClick={clearSearch} />}
              <FaMicrophone className={`mobile-search-voice ${listening ? "listening" : ""}`} onClick={startListening} />
            </form>
            <button className="mobile-search-go page-title-main-name" onClick={handleSearchSubmit} disabled={!searchText.trim()}>
              Go
            </button>
          </div>

          <div className="mobile-search-results page-title-main-name">
            {/* ... (search results code unchanged) ... */}
            {!searchText.trim() ? (
              <div className="mobile-search-suggestions">
                {recentSearches.length > 0 && (
                  <div className="mobile-search-section">
                    <div className="mobile-search-section-header">
                      <span>Recent Searches</span>
                      <button onClick={clearRecentSearches} className="mobile-search-clear-btn page-title-main-name">Clear</button>
                    </div>
                    <div className="mobile-search-tags">
                      {recentSearches.map((s, i) => (
                        <div key={i} onClick={() => handleRecentSearchClick(s)} className="mobile-search-tag">
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {popularSearches.length > 0 && (
                  <div className="mobile-search-section">
                    <div className="mobile-search-section-header">
                      <span>Popular Searches</span>
                    </div>
                    <div className="mobile-search-tags">
                      {popularSearches.map((s, i) => (
                        <div key={i} onClick={() => handleRecentSearchClick(s)} className="mobile-search-tag popular">
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : searchResults.length > 0 ? (
              <div className="mobile-search-products">
                {searchResults.map((item) => {
                  const discount = getDiscount(item);
                  return (
                    <div key={item._id} onClick={() => handleResultClick(item)} className="mobile-search-product">
                      <div className="mobile-search-product-image">
                        <img src={item.image} alt={item.name} loading="lazy" />
                        {discount > 0 && <div className="mobile-search-product-discount">-{discount}%</div>}
                      </div>
                      <div className="mobile-search-product-info">
                        <div className="mobile-search-product-brand">{item.brand}</div>
                        <div className="mobile-search-product-name">{item.name}</div>
                        <div className="mobile-search-product-price-row">
                          <span className="mobile-search-product-price">₹{item.price}</span>
                          {discount > 0 && <span className="mobile-search-product-original">₹{item.originalPrice}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="mobile-search-view-all" onClick={handleSearchSubmit}>
                  View all results for "{searchText}" →
                </div>
              </div>
            ) : (
              <div className="mobile-search-empty">
                <div>No products found for "{searchText}"</div>
                <small>Try different keywords</small>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Mobile Header */}
      <header className="header d-block">
        <div className="d-flex justify-content-between margin-padding-header align-items-center">
          <Link to="/" className="logo" onClick={closeMenu}>
            <img src={logo} className="ps-sm-0 ps-4 ms-sm-0" alt="JOYORY Logo" />
          </Link>

          <div className="menu-toggle" onClick={() => setMenuOpen(true)}>
            <img src={menu} alt="Menu" />
          </div>

          {!showMobileSearch && (
            <div className="nav-icons user-dropdown gap-3 d-md-flex d-lg-none d-flex">
              <div className="mobile-search-icon-wrapper" onClick={() => setShowMobileSearch(true)}>
                <img src={search} alt="Search" />
              </div>
              <Link to="/cartpage" className="mobile-cart-icon" onClick={closeMenu}>
                <img src={Cart} alt="Cart" />
                {cartCount > 0 && <span className="cart-count page-title-main-name">{cartCount > 99 ? '99+' : cartCount}</span>}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Drawer Menu */}
        <nav className={`nav-links ${menuOpen ? "active" : ""}`} ref={mobileMenuRef}>
          <div className="mobile-menu-header">
            <div className="mobile-menu-logo">
              <img src={logo} alt="JOYORY Logo" />
            </div>
            <div className="menu-close" onClick={closeMenu}>
              <FaTimes size={22} />
            </div>
          </div>

          <div className="nav-links-container w-100">
            {/* Home */}
            <div className="border-top-bottom">
              <Link to="/" onClick={closeMenu} className="nav-link d-flex ms-3 page-title-main-name margin-top-home">
                Home
              </Link>
            </div>

            {/* Main Categories → Category Landing Page */}
            <div className="border-top-bottom">
              {!loadingCategories && categoriesToRender.map((cat) => (
                <div key={cat._id} className="mobile-category-item">
                  <div className="mobile-category-main">
                    {/* Main Category Click → Category Landing Page */}
                    <Link
                      to={`/category/${cat.slug}`}
                      onClick={closeMenu}
                      className="mobile-category-name page-title-main-name p-0"
                    >
                      {cat.name}
                    </Link>

                    {cat.subCategories?.length > 0 && (
                      <FaAngleDown
                        className={`mobile-category-toggle ${mobileCategoriesOpen[cat._id] ? 'open' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          toggleMobileCategory(cat._id);
                        }}
                      />
                    )}
                  </div>

                  {/* Sub Categories → Product Listing Page */}
                  {mobileCategoriesOpen[cat._id] && renderMobileSubCategories(cat.subCategories)}
                </div>
              ))}

              {loadingCategories && <div className="mobile-category-loading">Loading categories...</div>}
            </div>

            {/* Shade Finder */}
            {/* <div className="border-top-bottom mobile-category-header">
              <Link to="/FoundationShadeFinder" onClick={closeMenu} className="mt-1 pb-1 page-title-main-name shadefinder-name-mobile-tabalte">
                Shade Finder
              </Link>
            </div> */}

            {/* Static Menu Items with Protection */}
            <div className="border-top-bottom">
              {STATIC_MENU_ITEMS.map((item) => {
                const isForYou = item.path === "/foryoulanding";

                return (
                  <div
                    key={item.label}
                    onClick={() => {
                      if (isForYou) {
                        if (!user || user.guest) {
                          navigate("/login", { state: { from: "/foryoulanding" } });
                        } else {
                          navigate(item.path);
                        }
                      } else if (item.path) {
                        navigate(item.path);
                      }
                      closeMenu();
                    }}
                    className="nav-link d-flex ms-3 page-title-main-name mt-1 pb-1 cursor-pointer"
                  >
                    {item.label}
                  </div>
                );
              })}
            </div>

            {/* User Links */}
            <div className="border-top-bottom page-title-main-name">
              <Link to="/useraccount" onClick={closeMenu} className="nav-link mobile-profile-link ms-3 d-flex mt-1 pb-1">
                My Account
              </Link>
            </div>
            <div className="border-top-bottom page-title-main-name">
              <Link to="/Myorders" onClick={closeMenu} className="nav-link ms-3 d-flex mt-1 pb-1">
                My Orders
              </Link>
            </div>

            <div>
              {user && !user.guest ? (
                <div onClick={() => setShowLogoutModal(true)} className="nav-link logout-link ms-3 d-flex mt-1 pb-1 page-title-main-name cursor-pointer">
                  Logout
                </div>
              ) : (
                <Link to="/login" onClick={closeMenu} className="nav-link ms-3 d-flex mt-1 pb-1 page-title-main-name">
                  Login
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Footer Navigation */}
      {/* {(isMobile || isTablet) && (
        <div className="mobile-footer-navigation w-100">
          <Link to="/" onClick={closeMenu} className={`mobile-footer-nav-item ${isHomeActive ? 'active' : ''}`}>
            <img src={isHomeActive ? homeActive : home} alt="Home" />
            <div className={`mobile-footer-nav-label page-title-main-name ${isHomeActive ? 'active' : ''}`}>Home</div>
          </Link>

          <Link to="/cartpage" onClick={closeMenu} className={`mobile-footer-nav-item ${isCartActive ? 'active' : ''}`}>
            <img src={isCartActive ? cartActive : Cart} alt="Cart" />
            <div className={`mobile-footer-nav-label page-title-main-name ${isCartActive ? 'active' : ''}`}>Cart</div>
            {cartCount > 0 && <div className="mobile-footer-cart-count">{cartCount > 9 ? '9+' : cartCount}</div>}
          </Link>

          <Link to="/useraccount" onClick={closeMenu} className={`mobile-footer-nav-item ${isProfileActive ? 'active' : ''}`}>
            <img src={isProfileActive ? userActive : users} alt="Profile" />
            <div className={`mobile-footer-nav-label page-title-main-name ${isProfileActive ? 'active' : ''}`}>Profile</div>
          </Link>
        </div>
      )} */}



      {(isMobile || isTablet) && (
        <div className="mobile-footer-navigation w-100">
          <Link to="/" onClick={closeMenu} className={`mobile-footer-nav-item ${isHomeActive ? 'active' : ''}`}>
            <img src={isHomeActive ? homeActive : home} alt="Home" />
            <div className={`mobile-footer-nav-label page-title-main-name ${isHomeActive ? 'active' : ''}`}>Home</div>
          </Link>

          <Link to="/cartpage" onClick={closeMenu} className={`mobile-footer-nav-item ${isCartActive ? 'active' : ''}`}>
            <img src={isCartActive ? cartActive : Cart} alt="Cart" />
            <div className={`mobile-footer-nav-label page-title-main-name ${isCartActive ? 'active' : ''}`}>Cart</div>
            {cartCount > 0 && <div className="mobile-footer-cart-count">{cartCount > 9 ? '9+' : cartCount}</div>}
          </Link> 


          <Link to="/wishlist" onClick={closeMenu} className={`mobile-footer-nav-item ${isWishlistActive ? 'active' : ''}`}>
    <img src={isWishlistActive ? wishlistActive : wishlist} alt="Wishlist" />
    <div className={`mobile-footer-nav-label page-title-main-name ${isWishlistActive ? 'active' : ''}`}>Wishlist</div>
    {wishlistCount > 0 && <div className="mobile-footer-cart-count">{wishlistCount > 9 ? '9+' : wishlistCount}</div>}
  </Link>


          <div
            onClick={() => {
              if (!user || user.guest) {
                navigate("/login", { state: { from: "/useraccount" } });
              } else {
                navigate("/useraccount");
              }
              closeMenu();
            }}
            className={`mobile-footer-nav-item ${isProfileActive ? 'active' : ''}`}
            style={{ cursor: 'pointer' }}
          >
            <img src={isProfileActive ? userActive : users} alt="Profile" />
            <div className={`mobile-footer-nav-label page-title-main-name ${isProfileActive ? 'active' : ''}`}>Profile</div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "10px",
              width: "320px",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ marginBottom: "10px", fontSize: "18px" }}>
              Confirm Logout
            </h3>

            <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>
              Are you sure you want to logout?
            </p>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setShowLogoutModal(false)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                  background: "#f5f5f5",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                onClick={confirmLogout}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#e63946",
                  color: "#fff",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Mobileheaderview;