// import React, { useState, useRef, useEffect, useContext } from "react";
// import {
//   FaSearch,
//   FaMicrophone,
//   FaRegHeart,
//   FaUser,
//   FaBars,
//   FaTimes,
//   FaAngleDown,
//   FaArrowLeft,
// } from "react-icons/fa";
// import { FiCamera, FiShoppingCart } from "react-icons/fi";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import "../css/Header/Header.css";
// import "../App.css";
// import logo from "../assets/logo.png";
// import axiosInstance from "../utils/axiosInstance.js";
// import { UserContext } from "./UserContext";

// const Header = () => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [listening, setListening] = useState(false);
//   const [searchText, setSearchText] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [allProducts, setAllProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [cartCount, setCartCount] = useState(0);
//   const [userDropdown, setUserDropdown] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
//   const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024 && window.innerWidth > 768);
//   const [showSearchResults, setShowSearchResults] = useState(false);
//   const [isSearchLoading, setIsSearchLoading] = useState(false);
//   const [searchError, setSearchError] = useState(null);
//   const [recentSearches, setRecentSearches] = useState([]);
//   const [popularSearches, setPopularSearches] = useState([]);
//   const [showMobileSearch, setShowMobileSearch] = useState(false);
//   const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState({});

//   const { user, logoutUser } = useContext(UserContext);
//   const recognitionRef = useRef(null);
//   const searchRef = useRef(null);
//   const searchInputRef = useRef(null);
//   const mobileMenuRef = useRef(null);
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Initialize ref for timeout
//   if (!searchRef.current) {
//     searchRef.current = { timeout: null };
//   }

//   // Close menu function
//   const closeMenu = () => {
//     setMenuOpen(false);
//     setShowSearchResults(false);
//     setShowMobileSearch(false);
//     setMobileCategoriesOpen({});
//   };

//   // ✅ Handle screen resize for responsive detection
//   useEffect(() => {
//     const handleResize = () => {
//       const width = window.innerWidth;
//       setIsMobile(width <= 768);
//       setIsTablet(width <= 1024 && width > 768);
//       if (width > 768) {
//         setShowMobileSearch(false);
//       }
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Close mobile menu when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
//         if (menuOpen) closeMenu();
//       }
//       if (searchRef.current && !searchRef.current.contains(event.target)) {
//         setShowSearchResults(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [menuOpen]);

//   // ✅ Fetch categories dynamically
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axiosInstance.get("/api/user/categories/tree");
//         const data = response.data;
//         setCategories(Array.isArray(data) ? data : data.categories || []);
//       } catch (error) {
//         console.error("Category fetch error:", error);
//         try {
//           const fallbackResponse = await axiosInstance.get("/api/user/categories");
//           setCategories(fallbackResponse.data || []);
//         } catch (fallbackError) {
//           console.error("Fallback category fetch error:", fallbackError);
//         }
//       }
//     };

//     fetchCategories();
//   }, []);

//   // ✅ Fetch ALL products for search dynamically
//   useEffect(() => {
//     const fetchAllProducts = async () => {
//       try {
//         console.log("📥 Fetching ALL products for search from API...");
//         setIsSearchLoading(true);

//         const response = await axiosInstance.get("https://beauty.joyory.com/api/user/products/all");

//         console.log("API Response:", response.data);

//         let products = [];

//         if (response.data.products && Array.isArray(response.data.products)) {
//           products = response.data.products;
//         } else if (Array.isArray(response.data)) {
//           products = response.data;
//         } else if (response.data.items && Array.isArray(response.data.items)) {
//           products = response.data.items;
//         } else if (response.data.data && Array.isArray(response.data.data)) {
//           products = response.data.data;
//         }

//         const processedProducts = products.map(product => {
//           const productSlug = product.slugs && product.slugs.length > 0
//             ? product.slugs[0]
//             : product.slug
//               ? product.slug
//               : generateSlugFromName(product.name);

//           let productImage = "";
//           if (product.selectedVariant && product.selectedVariant.images && product.selectedVariant.images.length > 0) {
//             productImage = product.selectedVariant.images[0];
//           } else if (product.variants && product.variants.length > 0 && product.variants[0].images && product.variants[0].images.length > 0) {
//             productImage = product.variants[0].images[0];
//           } else if (product.images && product.images.length > 0) {
//             productImage = product.images[0];
//           } else if (product.image) {
//             productImage = product.image;
//           } else if (product.thumbnail) {
//             productImage = product.thumbnail;
//           } else {
//             productImage = "/placeholder.png";
//           }

//           let productPrice = 0;
//           let displayPrice = "";
//           let originalPrice = 0;

//           if (product.selectedVariant) {
//             productPrice = product.selectedVariant.price || product.selectedVariant.sellingPrice || 0;
//             displayPrice = product.selectedVariant.displayPrice || `₹${productPrice}`;
//             originalPrice = product.selectedVariant.originalPrice || product.selectedVariant.mrp || productPrice;
//           } else {
//             productPrice = product.price || product.sellingPrice || 0;
//             displayPrice = product.displayPrice || `₹${productPrice}`;
//             originalPrice = product.originalPrice || product.mrp || productPrice;
//           }

//           let brandName = "";
//           if (product.brand) {
//             if (typeof product.brand === 'string') {
//               brandName = product.brand;
//             } else if (product.brand.name) {
//               brandName = product.brand.name;
//             } else if (product.brand.title) {
//               brandName = product.brand.title;
//             }
//           }

//           let categoryName = "";
//           if (product.category) {
//             if (typeof product.category === 'string') {
//               categoryName = product.category;
//             } else if (product.category.name) {
//               categoryName = product.category.name;
//             } else if (product.category.title) {
//               categoryName = product.category.title;
//             }
//           }

//           const inStock = product.inStock !== undefined ? product.inStock :
//             (product.stockQuantity > 0 ? true : false);

//           const status = product.status || (inStock ? "active" : "out_of_stock");

//           return {
//             _id: product._id || product.id,
//             name: product.name || product.title || "Unnamed Product",
//             slug: productSlug,
//             price: productPrice,
//             displayPrice: displayPrice,
//             originalPrice: originalPrice,
//             brand: brandName,
//             brandObj: product.brand,
//             category: categoryName,
//             categoryObj: product.category,
//             images: product.images || [productImage],
//             image: productImage,
//             thumbnail: productImage,
//             variants: product.variants || [],
//             selectedVariant: product.selectedVariant,
//             slugs: product.slugs || [],
//             status: status,
//             inStock: inStock,
//             description: product.description || "",
//             shortDescription: product.shortDescription || "",
//             sku: product.sku || "",
//             rating: product.rating || 0,
//             reviewCount: product.reviewCount || 0
//           };
//         });

//         console.log("📊 Processed products loaded:", processedProducts.length);
//         setAllProducts(processedProducts);
//         setSearchError(null);

//         extractPopularSearches(processedProducts);

//         if (searchText.trim()) {
//           performInstantSearch(searchText, processedProducts);
//         }
//       } catch (error) {
//         console.error("❌ Error fetching products from API:", error);
//         setSearchError("Failed to load products from server.");
//         setAllProducts([]);

//         try {
//           const fallbackResponse = await axiosInstance.get("/api/user/products");
//           if (fallbackResponse.data) {
//             console.log("Using fallback products data");
//           }
//         } catch (fallbackError) {
//           console.error("Fallback products fetch error:", fallbackError);
//         }
//       } finally {
//         setIsSearchLoading(false);
//       }
//     };

//     fetchAllProducts();
//   }, []);

//   // ✅ Extract popular searches from products
//   const extractPopularSearches = (products) => {
//     try {
//       const categoryCounts = {};
//       const brandCounts = {};

//       products.forEach(product => {
//         if (product.category) {
//           categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
//         }
//         if (product.brand) {
//           brandCounts[product.brand] = (brandCounts[product.brand] || 0) + 1;
//         }
//       });

//       const topCategories = Object.entries(categoryCounts)
//         .sort((a, b) => b[1] - a[1])
//         .slice(0, 5)
//         .map(([category]) => category);

//       const topBrands = Object.entries(brandCounts)
//         .sort((a, b) => b[1] - a[1])
//         .slice(0, 5)
//         .map(([brand]) => brand);

//       const popular = [...topCategories, ...topBrands].slice(0, 8);
//       setPopularSearches(popular);

//     } catch (error) {
//       console.error("Error extracting popular searches:", error);
//       setPopularSearches(["Lipstick", "Foundation", "Mascara", "Skincare", "Perfume"]);
//     }
//   };

//   // ✅ Load recent searches from localStorage
//   useEffect(() => {
//     const savedSearches = localStorage.getItem("recentSearches");
//     if (savedSearches) {
//       try {
//         setRecentSearches(JSON.parse(savedSearches));
//       } catch (error) {
//         console.error("Error loading recent searches:", error);
//       }
//     }
//   }, []);

//   // ✅ Save search to recent searches
//   const saveToRecentSearches = (query) => {
//     if (!query.trim()) return;

//     const updatedSearches = [
//       query.trim(),
//       ...recentSearches.filter(search => search.toLowerCase() !== query.trim().toLowerCase())
//     ].slice(0, 5);

//     setRecentSearches(updatedSearches);
//     localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
//   };

//   // ✅ Helper function to generate slug from product name
//   const generateSlugFromName = (name) => {
//     if (!name) return "product";
//     return name
//       .toLowerCase()
//       .replace(/[^\w\s]/g, '')
//       .replace(/\s+/g, '-')
//       .replace(/--+/g, '-');
//   };

//   // ✅ Fetch cart count dynamically
//   useEffect(() => {
//     const fetchCartCount = async () => {
//       if (!user || user.guest) {
//         setCartCount(0);
//         return;
//       }

//       try {
//         const response = await axiosInstance.get("/api/user/cart/summary", { withCredentials: true });
//         const cartData = response.data;

//         if (cartData.cart && Array.isArray(cartData.cart)) {
//           setCartCount(cartData.cart.length);
//         } else if (cartData.items && Array.isArray(cartData.items)) {
//           setCartCount(cartData.items.length);
//         } else if (cartData.count !== undefined) {
//           setCartCount(cartData.count);
//         } else {
//           setCartCount(0);
//         }
//       } catch (error) {
//         console.error("Error fetching cart count:", error);
//         setCartCount(0);
//       }
//     };

//     fetchCartCount();

//     const intervalId = setInterval(fetchCartCount, 30000);
//     return () => clearInterval(intervalId);
//   }, [user]);

//   // ✅ Voice search
//   const startListening = () => {
//     if (listening) return;

//     if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
//       alert("Your browser doesn't support voice search. Try Chrome or Edge.");
//       return;
//     }

//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     recognitionRef.current = new SpeechRecognition();
//     recognitionRef.current.continuous = false;
//     recognitionRef.current.interimResults = false;
//     recognitionRef.current.lang = 'en-IN';

//     recognitionRef.current.onstart = () => {
//       console.log("🎤 Voice recognition started");
//       setListening(true);
//     };

//     recognitionRef.current.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       console.log("🎤 Voice result:", transcript);
//       setSearchText(transcript);
//       saveToRecentSearches(transcript);
//       performInstantSearch(transcript, allProducts);
//       setListening(false);
//     };

//     recognitionRef.current.onerror = (event) => {
//       console.error("Voice recognition error:", event.error);
//       setListening(false);
//       if (event.error === 'not-allowed') {
//         alert("Please allow microphone access for voice search.");
//       }
//     };

//     recognitionRef.current.onend = () => {
//       console.log("Voice recognition ended");
//       setListening(false);
//     };

//     try {
//       recognitionRef.current.start();
//     } catch (error) {
//       console.error("Failed to start voice recognition:", error);
//       setListening(false);
//     }
//   };

//   // ✅ INSTANT SEARCH
//   const performInstantSearch = (query, productsToSearch = allProducts) => {
//     if (!query || query.trim() === "") {
//       setSearchResults([]);
//       setShowSearchResults(false);
//       return;
//     }

//     const searchTerm = query.toLowerCase().trim();
//     console.log(`🔍 Searching for: "${searchTerm}" in ${productsToSearch.length} products`);

//     if (productsToSearch.length === 0) {
//       console.log("No products available to search");
//       setSearchResults([]);
//       return;
//     }

//     const results = productsToSearch.filter(product => {
//       if (!product || !product.name) return false;

//       const productName = product.name.toLowerCase();
//       const brandName = product.brand ? product.brand.toLowerCase() : "";
//       const categoryName = product.category ? product.category.toLowerCase() : "";
//       const description = product.description ? product.description.toLowerCase() : "";
//       const shortDescription = product.shortDescription ? product.shortDescription.toLowerCase() : "";

//       return productName.includes(searchTerm) ||
//         brandName.includes(searchTerm) ||
//         categoryName.includes(searchTerm) ||
//         description.includes(searchTerm) ||
//         shortDescription.includes(searchTerm);
//     });

//     results.sort((a, b) => {
//       const aName = a.name.toLowerCase();
//       const bName = b.name.toLowerCase();

//       if (aName.startsWith(searchTerm) && !bName.startsWith(searchTerm)) return -1;
//       if (!aName.startsWith(searchTerm) && bName.startsWith(searchTerm)) return 1;

//       if (a.inStock && !b.inStock) return -1;
//       if (!a.inStock && b.inStock) return 1;

//       return 0;
//     });

//     console.log(`✅ Found ${results.length} results`);
//     setSearchResults(results);
//     setShowSearchResults(true);
//   };

//   // ✅ Handle search input change with debounce
//   const handleSearchChange = (e) => {
//     const query = e.target.value;
//     setSearchText(query);

//     if (searchRef.current.timeout) {
//       clearTimeout(searchRef.current.timeout);
//     }

//     if (!query || query.trim() === "") {
//       setSearchResults([]);
//       setShowSearchResults(false);
//       return;
//     }

//     setIsSearchLoading(true);

//     searchRef.current.timeout = setTimeout(() => {
//       performInstantSearch(query);
//       setIsSearchLoading(false);
//     }, 300);
//   };

//   // ✅ Handle Enter key press
//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && searchText.trim()) {
//       e.preventDefault();
//       console.log("🚀 Enter pressed, navigating to search page");
//       saveToRecentSearches(searchText.trim());
//       setShowSearchResults(false);
//       setShowMobileSearch(false);

//       navigate(`/search?q=${encodeURIComponent(searchText.trim())}`);
//       closeMenu();
//     }
//   };

//   // ✅ Handle search result click
//   const handleSearchResultClick = (product) => {
//     console.log("🖱️ Product clicked:", product.name);
//     saveToRecentSearches(product.name);

//     setSearchText("");
//     setSearchResults([]);
//     setShowSearchResults(false);
//     setShowMobileSearch(false);

//     closeMenu();

//     if (product.slug) {
//       navigate(`/product/${product.slug}`);
//     } else {
//       const generatedSlug = generateSlugFromName(product.name);
//       navigate(`/product/${generatedSlug}`);
//     }
//   };

//   // ✅ Search submission handler
//   const handleSearchSubmit = () => {
//     if (searchText.trim()) {
//       saveToRecentSearches(searchText.trim());
//       setShowSearchResults(false);
//       setShowMobileSearch(false);

//       navigate(`/search?q=${encodeURIComponent(searchText.trim())}`);
//       closeMenu();
//     }
//   };

//   // ✅ Handle popular search click
//   const handlePopularSearchClick = (term) => {
//     setSearchText(term);
//     saveToRecentSearches(term);
//     performInstantSearch(term);
//     searchInputRef.current?.focus();
//   };

//   // ✅ Handle recent search click
//   const handleRecentSearchClick = (term) => {
//     setSearchText(term);
//     saveToRecentSearches(term);
//     performInstantSearch(term);
//     searchInputRef.current?.focus();
//   };

//   // ✅ Clear recent searches
//   const clearRecentSearches = () => {
//     setRecentSearches([]);
//     localStorage.removeItem("recentSearches");
//   };

//   // ✅ Logout
//   const handleLogout = async () => {
//     if (!user || user.guest) return;
//     try {
//       await axiosInstance.post("/api/user/logout", {}, { withCredentials: true });
//       logoutUser();
//       navigate("/");
//     } catch (err) {
//       console.error("Logout error:", err);
//     }
//   };

//   // ✅ Toggle mobile categories
//   const toggleMobileCategory = (categoryId) => {
//     setMobileCategoriesOpen(prev => ({
//       ...prev,
//       [categoryId]: !prev[categoryId]
//     }));
//   };

//   // ✅ Toggle mobile search
//   const toggleMobileSearch = () => {
//     setShowMobileSearch(!showMobileSearch);
//     if (!showMobileSearch) {
//       setTimeout(() => {
//         searchInputRef.current?.focus();
//       }, 100);
//     }
//   };

//   // ✅ Helper functions
//   const getProductImage = (product) => {
//     if (product.images && product.images.length > 0 && product.images[0]) {
//       return product.images[0];
//     }
//     if (product.image) return product.image;
//     if (product.thumbnail) return product.thumbnail;
//     if (product.selectedVariant && product.selectedVariant.images && product.selectedVariant.images.length > 0) {
//       return product.selectedVariant.images[0];
//     }
//     return "/placeholder.png";
//   };

//   const getProductPrice = (product) => {
//     if (product.displayPrice) {
//       return typeof product.displayPrice === 'string'
//         ? product.displayPrice
//         : `₹${product.displayPrice}`;
//     }
//     if (product.price) return `₹${product.price}`;
//     if (product.selectedVariant && product.selectedVariant.displayPrice) {
//       return product.selectedVariant.displayPrice;
//     }
//     return "₹N/A";
//   };

//   const getProductDiscount = (product) => {
//     if (product.originalPrice && product.price && product.originalPrice > product.price) {
//       const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
//       return `${discount}% OFF`;
//     }
//     return null;
//   };

//   // Render mobile subcategories
//   const renderMobileSubCategories = (subs, level = 1) => {
//     if (!subs || !subs.length) return null;
//     return (
//       <div className={`mobile-subcategory mobile-subcategory-level-${level}`}>
//         {subs.map((sub) => (
//           <div key={sub._id} className="mobile-subcategory-item">
//             <Link
//               to={`/category/${sub.slug}`}
//               onClick={closeMenu}
//               className="mobile-subcategory-link"
//             >
//               {sub.name}
//             </Link>
//             {sub.subCategories && sub.subCategories.length > 0 && (
//               <FaAngleDown
//                 className={`mobile-category-toggle ${mobileCategoriesOpen[sub._id] ? 'open' : ''}`}
//                 onClick={(e) => {
//                   e.preventDefault();
//                   e.stopPropagation();
//                   toggleMobileCategory(sub._id);
//                 }}
//               />
//             )}
//             {mobileCategoriesOpen[sub._id] && sub.subCategories && sub.subCategories.length > 0 && (
//               renderMobileSubCategories(sub.subCategories, level + 1)
//             )}
//           </div>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <>
//       {/* Mobile Search Overlay */}
//       {(isMobile || isTablet) && showMobileSearch && (
//         <div className="mobile-search-overlay">
//           <div className="mobile-search-header">
//             <FaArrowLeft
//               className="mobile-search-back"
//               onClick={() => setShowMobileSearch(false)}
//             />
//             <div className="mobile-search-input-container">
//               <FaSearch className="mobile-search-icon" />
//               <input
//                 ref={searchInputRef}
//                 type="text"
//                 placeholder="Search products by name, brand, category..."
//                 value={searchText}
//                 onChange={handleSearchChange}
//                 onKeyPress={handleKeyPress}
//                 className="mobile-search-input"
//                 autoFocus
//               />
//               {searchText && (
//                 <FaTimes
//                   className="mobile-search-clear"
//                   onClick={() => setSearchText("")}
//                 />
//               )}
//               <FaMicrophone
//                 className={`mobile-search-voice ${listening ? "listening" : ""}`}
//                 onClick={startListening}
//                 title="Voice search"
//               />
//             </div>
//             <button
//               className="mobile-search-go"
//               onClick={handleSearchSubmit}
//               disabled={!searchText.trim()}
//             >
//               Go
//             </button>
//           </div>

//           {/* Mobile Search Results */}
//           {showSearchResults && (
//             <div className="mobile-search-results">
//               {!searchText.trim() ? (
//                 <div className="mobile-search-suggestions">
//                   {recentSearches.length > 0 && (
//                     <div className="mobile-search-section">
//                       <div className="mobile-search-section-header">
//                         <span>Recent Searches</span>
//                         <button
//                           onClick={clearRecentSearches}
//                           className="mobile-search-clear-btn"
//                         >
//                           Clear
//                         </button>
//                       </div>
//                       <div className="mobile-search-tags">
//                         {recentSearches.map((search, index) => (
//                           <div
//                             key={index}
//                             onClick={() => handleRecentSearchClick(search)}
//                             className="mobile-search-tag"
//                           >
//                             {search}
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {popularSearches.length > 0 && (
//                     <div className="mobile-search-section">
//                       <div className="mobile-search-section-header">
//                         <span>Popular Searches</span>
//                       </div>
//                       <div className="mobile-search-tags">
//                         {popularSearches.map((search, index) => (
//                           <div
//                             key={index}
//                             onClick={() => handlePopularSearchClick(search)}
//                             className="mobile-search-tag popular"
//                           >
//                             {search}
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ) : isSearchLoading ? (
//                 <div className="mobile-search-loading">
//                   <div className="mobile-search-spinner"></div>
//                   <span>Searching products...</span>
//                 </div>
//               ) : searchError ? (
//                 <div className="mobile-search-error">
//                   {searchError}
//                 </div>
//               ) : searchResults.length > 0 ? (
//                 <div className="mobile-search-products">
//                   {searchResults.slice(0, 10).map((item) => {
//                     const discount = getProductDiscount(item);

//                     return (
//                       <div
//                         key={item._id || item.id || Math.random()}
//                         onClick={() => handleSearchResultClick(item)}
//                         className="mobile-search-product"
//                       >
//                         <div className="mobile-search-product-image">
//                           <img
//                             src={getProductImage(item)}
//                             alt={item.name}
//                             onError={(e) => {
//                               e.target.src = "/placeholder.png";
//                               e.target.onerror = null;
//                             }}
//                           />
//                           {discount && (
//                             <div className="mobile-search-product-discount">
//                               {discount}
//                             </div>
//                           )}
//                         </div>

//                         <div className="mobile-search-product-info">
//                           <div className="mobile-search-product-name">
//                             {item.name}
//                           </div>

//                           {item.brand && (
//                             <div className="mobile-search-product-brand">
//                               Brand: {item.brand}
//                             </div>
//                           )}

//                           <div className="mobile-search-product-price-row">
//                             <div className="mobile-search-product-price">
//                               {getProductPrice(item)}
//                               {discount && (
//                                 <span className="mobile-search-product-original">
//                                   ₹{item.originalPrice}
//                                 </span>
//                               )}
//                             </div>

//                             {item.category && (
//                               <span className="mobile-search-product-category">
//                                 {item.category}
//                               </span>
//                             )}
//                           </div>

//                           <div className="mobile-search-product-meta">
//                             <div className={`mobile-search-product-stock ${item.inStock ? 'in-stock' : 'out-stock'}`}>
//                               {item.inStock ? "✅ In Stock" : "❌ Out of Stock"}
//                             </div>

//                             {item.rating > 0 && (
//                               <div className="mobile-search-product-rating">
//                                 ⭐ {item.rating.toFixed(1)}
//                                 {item.reviewCount > 0 && ` (${item.reviewCount})`}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}

//                   {searchResults.length > 10 && (
//                     <div
//                       className="mobile-search-view-all"
//                       onClick={handleSearchSubmit}
//                     >
//                       View all {searchResults.length} products →
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className="mobile-search-empty">
//                   <div className="mobile-search-empty-title">
//                     No products found for "{searchText}"
//                   </div>
//                   <div className="mobile-search-empty-subtitle">
//                     Try different keywords
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       )}

//       <header className="header">
//         {/* Logo */}
//         <Link to="/" className="logo" onClick={() => { setShowMobileSearch(false); setMenuOpen(false); }}>
//           <img src={logo} alt="JOYORY Logo" />
//         </Link>

//         {/* Mobile Menu Toggle */}
//         {(isMobile || isTablet) && (
//           <div className="menu-toggle" onClick={() => setMenuOpen(true)}>
//             <FaBars size={22} />
//           </div>
//         )}

//         {/* Desktop Icons for mobile/tablet */}
//         {(isMobile || isTablet) && !showMobileSearch && (
//           <div className="nav-icons user-dropdown gap-3 d-md-flex d-lg-none d-flex">
//             {/* Mobile Search Icon */}
//             {(isMobile || isTablet) && !showMobileSearch && (
//               <div className="mobile-search-icon-wrapper" style={{marginright:'-15px'}} onClick={toggleMobileSearch}>
//                 <FaSearch className="mobile-search-toggle" />
//               </div>
//             )}


//             <Link to="/cartpage" className="mobile-cart-icon">
//               <FiShoppingCart className="icon" />
//               {cartCount > 0 && (
//                 <span className="cart-count">
//                   {cartCount > 99 ? '99+' : cartCount}
//                 </span>
//               )}
//             </Link>

//             <Link to="/wishlist" className="mobile-wishlist-icon">
//               <FaRegHeart className="icon" />
//             </Link>
//           </div>
//         )}

//         {/* Navigation - Desktop Version */}
//         <nav className={`nav-links ${menuOpen ? "active" : ""}`} ref={mobileMenuRef}>
//           {/* Mobile Menu Header */}
//           {(isMobile || isTablet) && (
//             <div className="mobile-menu-header">
//               <div className="mobile-menu-logo">
//                 <img src={logo} alt="JOYORY Logo" />
//               </div>
//               <div className="menu-close" onClick={closeMenu}>
//                 <FaTimes size={22} />
//               </div>
//             </div>
//           )}

//           {/* Desktop Close Button */}
//           {!isMobile && !isTablet && (
//             <div className="menu-close" onClick={closeMenu}>
//               <FaTimes size={22} />
//             </div>
//           )}

//           {/* Mobile User Info */}
//           {/* {(isMobile || isTablet) && user && !user.guest && (
//             <div className="mobile-user-info w-100">
//               <div className="mobile-user-avatar">
//                 <FaUser size={24} />
//               </div>
//               <div className="mobile-user-details">
//                 <div className="mobile-user-name">
//                   Hello, {user.name || user.email}
//                 </div>
//                 <div className="mobile-user-email">
//                   {user.email}
//                 </div>
//               </div>
//             </div>
//           )} */}

//           {/* Navigation Links Container */}
//           <div className="nav-links-container w-100 ">
//             <div className="border-top-bottom">
//             <Link to="/" onClick={closeMenu} className="nav-link d-flex ms-3 page-title-main-name">
//               Home
//             </Link>
//             </div>

//             {/* Category Dropdown - Desktop */}
//             {!isMobile && !isTablet && (
//               <div
//                 className="dropdown dropdowns"
//                 onMouseEnter={() => setDropdownOpen(true)}
//                 onMouseLeave={() => setDropdownOpen(false)}
//               >
//                 <div className="dropbtn page-title-main-name" onClick={() => setDropdownOpen(!dropdownOpen)}>
//                   Categories
//                   <FaAngleDown className="icon thin-icon" style={{ marginLeft: "5px" }} />
//                 </div>

//                 {dropdownOpen && (
//                   <div className="mega-menu">
//                     {categories.length > 0 ? (
//                       categories.map((cat) => (
//                         <div key={cat._id} className="mega-column">
//                           <h4>
//                             <Link
//                               to={`/category/${cat.slug}`}
//                               onClick={closeMenu}
//                               className="main-category-link page-title-main-name"
//                             >
//                               {cat.name}
//                             </Link>
//                           </h4>
//                           {cat.subCategories && cat.subCategories.length > 0 && (
//                             <div className="sub-category-list">
//                               {cat.subCategories.map((sub) => (
//                                 <div key={sub._id} className="sub-category-item">
//                                   <Link
//                                     to={`/category/${sub.slug}`}
//                                     onClick={closeMenu}
//                                     className="sub-category-link page-title-main-name"
//                                   >
//                                     {sub.name}
//                                   </Link>
//                                 </div>
//                               ))}
//                             </div>
//                           )}
//                         </div>
//                       ))
//                     ) : (
//                       <div style={{ padding: "10px", color: "gray" }}>
//                         Loading categories...
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Mobile Categories */}
//             {(isMobile || isTablet) && (
//               <div className="mobile-categories border-top-bottom">
//                 <div className="mobile-category-header page-title-main-name " onClick={() => toggleMobileCategory('all')}>
//                   Categories
//                   <FaAngleDown className={`mobile-category-arrow ${mobileCategoriesOpen['all'] ? 'open' : ''}`} />
//                 </div>

//                 {mobileCategoriesOpen['all'] && categories.length > 0 && (
//                   <div className="mobile-categories-list">
//                     {categories.map((cat) => (
//                       <div key={cat._id} className="mobile-category-item">
//                         <div
//                           className="mobile-category-main"
//                           onClick={() => toggleMobileCategory(cat._id)}
//                         >
//                           <Link
//                             to={`/category/${cat.slug}`}
//                             onClick={closeMenu}
//                             className="mobile-category-name page-title-main-name"
//                           >
//                             {cat.name}
//                           </Link>
//                           {cat.subCategories && cat.subCategories.length > 0 && (
//                             <FaAngleDown
//                               className={`mobile-category-toggle ${mobileCategoriesOpen[cat._id] ? 'open' : ''}`}
//                             />
//                           )}
//                         </div>

//                         {mobileCategoriesOpen[cat._id] && cat.subCategories && cat.subCategories.length > 0 && (
//                           <div className="mobile-subcategories">
//                             {cat.subCategories.map((sub) => (
//                               <div key={sub._id} className="mobile-subcategory-item">
//                                 <Link
//                                   to={`/category/${sub.slug}`}
//                                   onClick={closeMenu}
//                                   className="mobile-subcategory-link page-title-main-name"
//                                 >
//                                   {sub.name}
//                                 </Link>
//                                 {sub.subCategories && sub.subCategories.length > 0 && (
//                                   <FaAngleDown
//                                     className={`mobile-category-toggle ${mobileCategoriesOpen[sub._id] ? 'open' : ''}`}
//                                     onClick={(e) => {
//                                       e.preventDefault();
//                                       e.stopPropagation();
//                                       toggleMobileCategory(sub._id);
//                                     }}
//                                   />
//                                 )}
//                                 {mobileCategoriesOpen[sub._id] && sub.subCategories && sub.subCategories.length > 0 && (
//                                   renderMobileSubCategories(sub.subCategories)
//                                 )}
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}


//             <div className="border-top-bottom mobile-category-header">
//             <Link to="/FoundationShadeFinder" onClick={closeMenu} className="mt-1 pb-1 page-title-main-name shadefinder-name-mobile-tabalte">
//               Shade Finder
//             </Link>
//             </div>

//             {/* Mobile Profile & User Links */}
//             {(isMobile || isTablet) && (
//               <>

//               <div className="border-top-bottom page-title-main-name">

//                 <Link to="/useraccount" onClick={closeMenu} className="nav-link mobile-profile-link ms-3 d-flex mt-1 pb-1">
//                   {/* <FaUser className="mobile-profile-icon" /> */}
//                   My Account
//                 </Link>
//               </div>

//               <div className="border-top-bottom page-title-main-name"> 

//                 <Link to="/Myorders" onClick={closeMenu} className="nav-link ms-3 d-flex mt-1 pb-1">
//                   {/* <span className="mobile-link-icon">📦</span> */}
//                   My Orders
//                 </Link>
//               </div>

//               <div>

//                 {user && !user.guest ? (
//                   <div style={{fontWeight:'500'}} onClick={handleLogout} className="nav-link logout-link ms-3 d-flex mt-1 pb-1 page-title-main-name">
//                     {/* <span className="mobile-link-icon">🚪</span> */}
//                     Logout
//                   </div>
//                 ) : (
//                   <>
//                     <Link to="/login" onClick={closeMenu} className="nav-link ms-2">
//                       <span className="mobile-link-icon">🔑</span>
//                       Login
//                     </Link>
//                     <Link to="/Signup" onClick={closeMenu} className="nav-link">
//                       <span className="mobile-link-icon">📝</span>
//                       Register
//                     </Link>
//                   </>
//                 )}
//                 </div>
//               </>
//             )}

//             {/* Desktop Search Box */}
//             {!isMobile && !isTablet && (
//               <div
//                 className="search-box d-flex page-title-main-name"
//                 ref={searchRef}
//                 style={{
//                   position: "relative",
//                   alignItems: "center",
//                   backgroundColor: "#f5f5f5",
//                   padding: "8px 15px",
//                   margin: "0 15px",
//                   minWidth: "350px",
//                   zIndex: 999,
//                   boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
//                 }}
//               >
//                 <FaSearch
//                   className="icon"
//                   style={{
//                     color: "#666",
//                     marginRight: "10px",
//                     cursor: "pointer"
//                   }}
//                   onClick={handleSearchSubmit}
//                 />
//                 <input
//                   ref={searchInputRef}
//                   type="text"
//                   placeholder="Search products by name, brand, category..."
//                   value={searchText}
//                   onChange={handleSearchChange}
//                   onFocus={() => searchText.trim() && setShowSearchResults(true)}
//                   onKeyPress={handleKeyPress}
//                   style={{
//                     border: "none",
//                     outline: "none",
//                     backgroundColor: "transparent",
//                     width: "100%",
//                     fontSize: "14px",
//                     flex: 1
//                   }}
//                 />

//                 <div style={{ display: "flex", alignItems: "center", gap: "12px", marginLeft: "10px" }}>
//                   <FaMicrophone
//                     className={`icon ${listening ? "listening" : ""}`}
//                     onClick={startListening}
//                     title="Voice search"
//                     style={{
//                       cursor: "pointer",
//                       color: listening ? "#0077b6" : "#666",
//                       fontSize: "16px"
//                     }}
//                   />
//                   {/* <FiCamera
//                     className="icon"
//                     title="Image search"
//                     style={{
//                       cursor: "pointer",
//                       color: "#666",
//                       fontSize: "16px"
//                     }}
//                   /> */}
//                 </div>

//                 {/* Search Results Dropdown - Desktop */}
//                 {showSearchResults && (
//                   <div
//                     className="search-results-dropdown"
//                     style={{
//                       position: "absolute",
//                       top: "calc(100% + 5px)",
//                       left: 0,
//                       right: 0,
//                       backgroundColor: "white",
//                       border: "1px solid #ddd",
//                       borderRadius: "12px",
//                       boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
//                       maxHeight: "500px",
//                       overflowY: "auto",
//                       zIndex: 1002,
//                       display: "block",
//                       animation: "fadeIn 0.3s ease"
//                     }}
//                   >
//                     {/* Search Header */}
//                     <div style={{
//                       padding: "15px",
//                       borderBottom: "1px solid #eee",
//                       backgroundColor: "#f8f9fa",
//                       borderTopLeftRadius: "12px",
//                       borderTopRightRadius: "12px"
//                     }}>
//                       <div style={{
//                         fontSize: "14px",
//                         color: "#666",
//                         fontWeight: "600",
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "center"
//                       }}>
//                         <span>
//                           {searchText.trim() ? (
//                             isSearchLoading ? (
//                               "Searching..."
//                             ) : searchResults.length > 0 ? (
//                               `Found ${searchResults.length} products for "${searchText}"`
//                             ) : (
//                               `Search results for "${searchText}"`
//                             )
//                           ) : "Search for products, brands, categories"}
//                         </span>
//                         {searchText.trim() && searchResults.length > 0 && (
//                           <button
//                             onClick={handleSearchSubmit}
//                             style={{
//                               backgroundColor: "#0077b6",
//                               color: "white",
//                               border: "none",
//                               padding: "5px 12px",
//                               borderRadius: "4px",
//                               fontSize: "12px",
//                               cursor: "pointer",
//                               fontWeight: "500"
//                             }}
//                           >
//                             View All
//                           </button>
//                         )}
//                       </div>
//                     </div>

//                     {!searchText.trim() ? (
//                       <div style={{ padding: "15px" }}>
//                         {recentSearches.length > 0 && (
//                           <div style={{ marginBottom: "20px" }}>
//                             <div style={{
//                               fontSize: "13px",
//                               fontWeight: "600",
//                               color: "#555",
//                               marginBottom: "10px",
//                               display: "flex",
//                               justifyContent: "space-between",
//                               alignItems: "center"
//                             }}>
//                               <span>Recent Searches</span>
//                               <button
//                                 onClick={clearRecentSearches}
//                                 style={{
//                                   background: "none",
//                                   border: "none",
//                                   color: "#666",
//                                   fontSize: "11px",
//                                   cursor: "pointer",
//                                   textDecoration: "underline"
//                                 }}
//                               >
//                                 Clear
//                               </button>
//                             </div>
//                             <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
//                               {recentSearches.map((search, index) => (
//                                 <div
//                                   key={index}
//                                   onClick={() => handleRecentSearchClick(search)}
//                                   style={{
//                                     padding: "6px 12px",
//                                     backgroundColor: "#f0f0f0",
//                                     borderRadius: "20px",
//                                     fontSize: "12px",
//                                     cursor: "pointer",
//                                     color: "#333",
//                                     transition: "all 0.2s"
//                                   }}
//                                   onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e0e0e0"}
//                                   onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f0f0f0"}
//                                 >
//                                   {search}
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         )}

//                         {popularSearches.length > 0 && (
//                           <div>
//                             <div style={{
//                               fontSize: "13px",
//                               fontWeight: "600",
//                               color: "#555",
//                               marginBottom: "10px"
//                             }}>
//                               Popular Searches
//                             </div>
//                             <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
//                               {popularSearches.map((search, index) => (
//                                 <div
//                                   key={index}
//                                   onClick={() => handlePopularSearchClick(search)}
//                                   style={{
//                                     padding: "6px 12px",
//                                     backgroundColor: "#e6f7ff",
//                                     borderRadius: "20px",
//                                     fontSize: "12px",
//                                     cursor: "pointer",
//                                     color: "#0077b6",
//                                     transition: "all 0.2s"
//                                   }}
//                                   onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#cceeff"}
//                                   onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#e6f7ff"}
//                                 >
//                                   {search}
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     ) : isSearchLoading ? (
//                       <div style={{
//                         padding: "30px",
//                         textAlign: "center",
//                         color: "#666"
//                       }}>
//                         <div style={{
//                           width: "20px",
//                           height: "20px",
//                           border: "3px solid #f3f3f3",
//                           borderTop: "3px solid #0077b6",
//                           borderRadius: "50%",
//                           animation: "spin 1s linear infinite",
//                           margin: "0 auto 10px"
//                         }} />
//                         <style>
//                           {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
//                         </style>
//                         Searching products...
//                       </div>
//                     ) : searchError ? (
//                       <div style={{
//                         padding: "20px",
//                         textAlign: "center",
//                         color: "#dc3545"
//                       }}>
//                         {searchError}
//                       </div>
//                     ) : searchResults.length > 0 ? (
//                       <div style={{ maxHeight: "350px", overflowY: "auto" }}>
//                         {searchResults.slice(0, 10).map((item) => {
//                           const discount = getProductDiscount(item);

//                           return (
//                             <div
//                               key={item._id || item.id || Math.random()}
//                               onClick={() => handleSearchResultClick(item)}
//                               style={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 padding: "12px 15px",
//                                 borderBottom: "1px solid #f5f5f5",
//                                 cursor: "pointer",
//                                 transition: "all 0.2s ease",
//                                 backgroundColor: "white"
//                               }}
//                               onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
//                               onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
//                             >
//                               <div style={{
//                                 width: "60px",
//                                 height: "60px",
//                                 marginRight: "12px",
//                                 position: "relative"
//                               }}>
//                                 <img
//                                   src={getProductImage(item)}
//                                   alt={item.name}
//                                   style={{
//                                     width: "100%",
//                                     height: "100%",
//                                     objectFit: "cover",
//                                     borderRadius: "6px",
//                                     backgroundColor: "#f0f0f0"
//                                   }}
//                                   onError={(e) => {
//                                     e.target.src = "/placeholder.png";
//                                     e.target.onerror = null;
//                                   }}
//                                 />
//                                 {discount && (
//                                   <div style={{
//                                     position: "absolute",
//                                     top: "-5px",
//                                     right: "-5px",
//                                     backgroundColor: "#ff4444",
//                                     color: "white",
//                                     fontSize: "10px",
//                                     fontWeight: "bold",
//                                     padding: "2px 5px",
//                                     borderRadius: "3px"
//                                   }}>
//                                     {discount}
//                                   </div>
//                                 )}
//                               </div>

//                               <div style={{ flex: 1, minWidth: 0 }}>
//                                 <div style={{
//                                   fontWeight: "600",
//                                   color: "#333",
//                                   fontSize: "14px",
//                                   marginBottom: "4px",
//                                   lineHeight: "1.3",
//                                   display: "-webkit-box",
//                                   WebkitLineClamp: 2,
//                                   WebkitBoxOrient: "vertical",
//                                   overflow: "hidden"
//                                 }}>
//                                   {item.name}
//                                 </div>

//                                 {item.brand && (
//                                   <div style={{
//                                     fontSize: "12px",
//                                     color: "#666",
//                                     marginBottom: "4px"
//                                   }}>
//                                     Brand: {item.brand}
//                                   </div>
//                                 )}

//                                 <div style={{
//                                   display: "flex",
//                                   alignItems: "center",
//                                   justifyContent: "space-between",
//                                   marginTop: "4px"
//                                 }}>
//                                   <div style={{
//                                     fontWeight: "bold",
//                                     color: "#0077b6",
//                                     fontSize: "14px"
//                                   }}>
//                                     {getProductPrice(item)}
//                                     {discount && (
//                                       <span style={{
//                                         fontSize: "12px",
//                                         color: "#999",
//                                         textDecoration: "line-through",
//                                         marginLeft: "8px",
//                                         fontWeight: "normal"
//                                       }}>
//                                         ₹{item.originalPrice}
//                                       </span>
//                                     )}
//                                   </div>

//                                   {item.category && (
//                                     <span style={{
//                                       fontSize: "11px",
//                                       color: "#666",
//                                       backgroundColor: "#f0f0f0",
//                                       padding: "3px 8px",
//                                       borderRadius: "3px"
//                                     }}>
//                                       {item.category}
//                                     </span>
//                                   )}
//                                 </div>

//                                 <div style={{
//                                   display: "flex",
//                                   alignItems: "center",
//                                   justifyContent: "space-between",
//                                   marginTop: "4px"
//                                 }}>
//                                   <div style={{
//                                     fontSize: "11px",
//                                     color: item.inStock ? "#28a745" : "#dc3545",
//                                     fontWeight: "500"
//                                   }}>
//                                     {item.inStock ? "✅ In Stock" : "❌ Out of Stock"}
//                                   </div>

//                                   {item.rating > 0 && (
//                                     <div style={{
//                                       fontSize: "11px",
//                                       color: "#ff9800",
//                                       display: "flex",
//                                       alignItems: "center"
//                                     }}>
//                                       ⭐ {item.rating.toFixed(1)}
//                                       {item.reviewCount > 0 && ` (${item.reviewCount})`}
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>
//                             </div>
//                           );
//                         })}

//                         {searchResults.length > 10 && (
//                           <div
//                             style={{
//                               padding: "15px",
//                               textAlign: "center",
//                               borderTop: "1px solid #eee",
//                               backgroundColor: "#f8f9fa",
//                               cursor: "pointer",
//                               borderBottomLeftRadius: "12px",
//                               borderBottomRightRadius: "12px"
//                             }}
//                             onClick={handleSearchSubmit}
//                           >
//                             <div style={{
//                               color: "#0077b6",
//                               fontWeight: "600",
//                               fontSize: "14px"
//                             }}>
//                               View all {searchResults.length} products →
//                             </div>
//                             <div style={{
//                               fontSize: "12px",
//                               color: "#888",
//                               marginTop: "4px"
//                             }}>
//                               Click or press Enter to see complete results
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     ) : (
//                       <div style={{
//                         padding: "25px",
//                         textAlign: "center",
//                         color: "#666"
//                       }}>
//                         <div style={{
//                           fontSize: "16px",
//                           fontWeight: "500",
//                           marginBottom: "8px"
//                         }}>
//                           No products found for "{searchText}"
//                         </div>
//                         <div style={{ fontSize: "13px", color: "#888" }}>
//                           Try different keywords like "lipstick", "foundation", "mascara"
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Desktop Icons Section */}
//             {!isMobile && !isTablet && (
//               <div className="nav-icons user-dropdown gap-3 d-md-none d-none d-lg-flex page-title-main-name" style={{ alignItems: "center" }}>
//                 <Link to="/cartpage" style={{ position: "relative", textDecoration: "none" }}>
//                   <FiShoppingCart className="icon" style={{ fontSize: "20px", color: "#333" }} />
//                   {cartCount > 0 && (
//                     <span style={{
//                       position: "absolute",
//                       top: "-8px",
//                       right: "-8px",
//                       backgroundColor: "#0077b6",
//                       color: "white",
//                       borderRadius: "50%",
//                       width: "18px",
//                       height: "18px",
//                       fontSize: "10px",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       fontWeight: "bold"
//                     }}>
//                       {cartCount > 99 ? '99+' : cartCount}
//                     </span>
//                   )}
//                 </Link>

//                 <Link to="/wishlist" style={{ textDecoration: "none" }}>
//                   <FaRegHeart className="icon" style={{ fontSize: "18px", color: "#333" }} />
//                 </Link>

//                 <div
//                   className="user-icon-wrapper"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setUserDropdown(!userDropdown);
//                   }}
//                   style={{ position: "relative", cursor: "pointer" }}
//                 >
//                   <FaUser className="icon" style={{ fontSize: "18px", color: "#333" }} />

//                   {userDropdown && (
//                     <div
//                       style={{
//                         position: "absolute",
//                         top: "100%",
//                         right: 0,
//                         backgroundColor: "white",
//                         border: "1px solid #ddd",
//                         borderRadius: "8px",
//                         boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
//                         zIndex: 1000,
//                         minWidth: "180px",
//                         marginTop: "5px",
//                         overflow: "hidden"
//                       }}
//                     >
//                       {user && !user.guest ? (
//                         <>
//                           <div className="page-title-main-name" style={{
//                             padding: "12px 15px",
//                             backgroundColor: "#f8f9fa",
//                             borderBottom: "1px solid #eee",
//                             fontSize: "12px",
//                             color: "#666"
//                           }}>
//                             👋 Hello, {user.name || user.email}
//                           </div>
//                           <div className="page-title-main-name"
//                             onClick={() => {
//                               navigate("/useraccount");
//                               setUserDropdown(false);
//                             }}
//                             style={{
//                               display: "block",
//                               width: "100%",
//                               padding: "12px 15px",
//                               textAlign: "left",
//                               background: "none",
//                               border: "none",
//                               cursor: "pointer",
//                               color: "#333",
//                               fontSize: "14px",
//                               transition: "background-color 0.2s",
//                               borderBottom: "1px solid #eee"
//                             }}
//                             onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
//                             onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
//                           >
//                             👤 My Account
//                           </div>
//                           <div className="page-title-main-name"
//                             onClick={() => {
//                               navigate("/Myorders");
//                               setUserDropdown(false);
//                             }}
//                             style={{
//                               display: "block",
//                               width: "100%",
//                               padding: "12px 15px",
//                               textAlign: "left",
//                               background: "none",
//                               border: "none",
//                               cursor: "pointer",
//                               color: "#333",
//                               fontSize: "14px",
//                               transition: "background-color 0.2s",
//                               borderBottom: "1px solid #eee"
//                             }}
//                             onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
//                             onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
//                           >
//                             📦 My Orders
//                           </div>
//                           <div className="page-title-main-name"
//                             onClick={() => {
//                               handleLogout();
//                               setUserDropdown(false);
//                             }}
//                             style={{
//                               display: "block",
//                               width: "100%",
//                               padding: "12px 15px",
//                               textAlign: "left",
//                               background: "none",
//                               border: "none",
//                               cursor: "pointer",
//                               color: "#333",
//                               fontSize: "14px",
//                               transition: "background-color 0.2s"
//                             }}
//                             onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
//                             onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
//                           >
//                             🚪 Logout
//                           </div>
//                         </>
//                       ) : (
//                         <>
//                           <div
//                             onClick={() => {
//                               navigate("/login");
//                               setUserDropdown(false);
//                             }}
//                             style={{
//                               display: "block",
//                               width: "100%",
//                               padding: "12px 15px",
//                               textAlign: "left",
//                               background: "none",
//                               border: "none",
//                               cursor: "pointer",
//                               color: "#333",
//                               fontSize: "14px",
//                               transition: "background-color 0.2s",
//                               borderBottom: "1px solid #eee"
//                             }}
//                             onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
//                             onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
//                           >
//                             🔑 Login
//                           </div>
//                           <div
//                             onClick={() => {
//                               navigate("/Signup");
//                               setUserDropdown(false);
//                             }}
//                             style={{
//                               display: "block",
//                               width: "100%",
//                               padding: "12px 15px",
//                               textAlign: "left",
//                               background: "none",
//                               border: "none",
//                               cursor: "pointer",
//                               color: "#333",
//                               fontSize: "14px",
//                               transition: "background-color 0.2s"
//                             }}
//                             onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
//                             onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
//                           >
//                             📝 Register
//                           </div>
//                         </>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Mobile Footer Navigation */}
//           {(isMobile || isTablet) && (
//             <div className="mobile-footer-navigation w-100">
//               <Link to="/" onClick={closeMenu} className="mobile-footer-nav-item">
//                 <div className="mobile-footer-nav-icon">🏠</div>
//                 <div className="mobile-footer-nav-label page-title-main-name">Home</div>
//               </Link>
//               {/* <div className="mobile-footer-nav-item" onClick={toggleMobileSearch}>
//                 <div className="mobile-footer-nav-icon">🔍</div>
//                 <div className="mobile-footer-nav-label">Search</div>
//               </div> */}
//               <Link to="/wishlist" onClick={closeMenu} className="mobile-footer-nav-item">
//                 <div className="mobile-footer-nav-icon">❤️</div>
//                 <div className="mobile-footer-nav-label page-title-main-name">Wishlist</div>
//               </Link>
//               <Link to="/cartpage" onClick={closeMenu} className="mobile-footer-nav-item">
//                 <div className="mobile-footer-nav-icon">🛒</div>
//                 <div className="mobile-footer-nav-label page-title-main-name">Cart</div>
//                 {cartCount > 0 && (
//                   <div className="mobile-footer-cart-count">{cartCount > 9 ? '9+' : cartCount}</div>
//                 )}
//               </Link>
//               <Link to="/useraccount" onClick={closeMenu} className="mobile-footer-nav-item">
//                 <div className="mobile-footer-nav-icon">👤</div>
//                 <div className="mobile-footer-nav-label page-title-main-name">Profile</div>
//               </Link>
//             </div>
//           )}
//         </nav>
//       </header>
//     </>
//   );
// };

// export default Header;























//==============================================================Done-Code(Start)=====================================================================================


// import React, {
//   useState,
//   useEffect,
//   useMemo,
//   useRef,
//   useCallback,
//   useContext
// } from "react";
// import {
//   FaSearch,
//   FaMicrophone,
//   FaRegHeart,
//   FaUser,
//   FaBars,
//   FaTimes,
//   FaAngleDown,
//   FaArrowLeft,
// } from "react-icons/fa";
// import { FiCamera, FiShoppingCart } from "react-icons/fi";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import "../css/Header/Header.css";
// import "../App.css";
// import logo from "../assets/logo.png";
// import Cart from "../assets/Cart.svg";
// import favourite from "../assets/favourite.svg";
// import users from "../assets/user.svg";
// import mic from "../assets/mic.svg";
// import search from "../assets/search.svg";
// import menu from "../assets/menu.svg";
// import home from "../assets/home.svg";
// import axiosInstance from "../utils/axiosInstance.js";
// import { UserContext } from "./UserContext";

// const Header = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user, logoutUser } = useContext(UserContext);

//   // UI States
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [listening, setListening] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [cartCount, setCartCount] = useState(0);
//   const [userDropdown, setUserDropdown] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
//   const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024 && window.innerWidth > 768);
//   const [showMobileSearch, setShowMobileSearch] = useState(false);
//   const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState({});

//   // Search States
//   const [searchText, setSearchText] = useState("");
//   const [debouncedSearchText, setDebouncedSearchText] = useState("");
//   const [allProducts, setAllProducts] = useState([]);
//   const [searchIndex, setSearchIndex] = useState([]); // Pre-computed for speed
//   const [searchResults, setSearchResults] = useState([]);
//   const [showSearchResults, setShowSearchResults] = useState(false);
//   const [isSearchLoading, setIsSearchLoading] = useState(false);
//   const [recentSearches, setRecentSearches] = useState([]);
//   const [popularSearches, setPopularSearches] = useState([]);
//   const [categories, setCategories] = useState([]);

//   // Refs
//   const searchTimeoutRef = useRef(null);
//   const recognitionRef = useRef(null);
//   const searchInputRef = useRef(null);
//   const headerSearchRef = useRef(null);
//   const mobileMenuRef = useRef(null);
//   const hasFetchedProducts = useRef(false);

//   /* -------------------------------------------------------------------------- */
//   /* 1. INITIAL SETUP & RESPONSIVE HANDLING                                     */
//   /* -------------------------------------------------------------------------- */

//   useEffect(() => {
//     const handleResize = () => {
//       const width = window.innerWidth;
//       setIsMobile(width <= 768);
//       setIsTablet(width <= 1024 && width > 768);
//       if (width > 768) setShowMobileSearch(false);
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Close menus when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
//         if (menuOpen) closeMenu();
//       }
//       if (headerSearchRef.current && !headerSearchRef.current.contains(event.target)) {
//         setShowSearchResults(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [menuOpen]);

//   // Load recent searches
//   useEffect(() => {
//     const saved = localStorage.getItem("recentSearches");
//     if (saved) {
//       try {
//         setRecentSearches(JSON.parse(saved));
//       } catch (e) {
//         console.error("Error loading recent searches:", e);
//       }
//     }
//   }, []);

//   /* -------------------------------------------------------------------------- */
//   /* 2. DATA FETCHING (Products for Search Dropdown)                            */
//   /* -------------------------------------------------------------------------- */

//   useEffect(() => {
//     if (hasFetchedProducts.current) return;

//     const fetchData = async () => {
//       try {
//         setIsSearchLoading(true);

//         // Fetch categories
//         try {
//           const catRes = await axiosInstance.get("/api/user/categories/tree");
//           setCategories(Array.isArray(catRes.data) ? catRes.data : catRes.data.categories || []);
//         } catch (err) {
//           console.error("Category fetch error:", err);
//         }

//         // Fetch products
//         const res = await axiosInstance.get("/api/user/products/all");
//         let products = [];

//         if (res.data.products && Array.isArray(res.data.products)) {
//           products = res.data.products;
//         } else if (Array.isArray(res.data)) {
//           products = res.data;
//         }

//         // Process products
//         const processed = products.map(p => ({
//           _id: p._id || p.id,
//           name: p.name || p.title || "Unnamed Product",
//           slug: p.slugs?.[0] || p.slug || p._id,
//           brand: p.brand?.name || (typeof p.brand === 'string' ? p.brand : ""),
//           category: p.category?.name || (typeof p.category === 'string' ? p.category : ""),
//           price: p.selectedVariant?.displayPrice || p.price || 0,
//           originalPrice: p.selectedVariant?.originalPrice || p.originalPrice || 0,
//           discountPercent: p.selectedVariant?.discountPercent || 0,
//           image: p.selectedVariant?.images?.[0] || p.images?.[0] || "/placeholder.png",
//           inStock: p.inStock !== false && p.status !== "outOfStock",
//           rating: p.rating || 0,
//           reviewCount: p.reviewCount || 0,
//           description: p.description || "",
//           variants: p.variants || []
//         }));

//         setAllProducts(processed);

//         // Pre-compute search index for O(1) lookup speed
//         const index = processed.map(p => ({
//           product: p,
//           searchString: [
//             p.name,
//             p.brand,
//             p.category,
//             ...(p.variants?.map(v => v.shadeName) || [])
//           ].filter(Boolean).join(' ').toLowerCase()
//         }));

//         setSearchIndex(index);
//         hasFetchedProducts.current = true;

//         // Extract popular searches
//         extractPopularSearches(processed);

//       } catch (err) {
//         console.error("Error fetching products:", err);
//       } finally {
//         setIsSearchLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Fetch cart count
//   useEffect(() => {
//     const fetchCart = async () => {
//       if (!user || user.guest) {
//         setCartCount(0);
//         return;
//       }
//       try {
//         const res = await axiosInstance.get("/api/user/cart/summary", { withCredentials: true });
//         const count = res.data?.cart?.length || res.data?.items?.length || res.data?.count || 0;
//         setCartCount(count);
//       } catch (err) {
//         console.error("Cart fetch error:", err);
//         setCartCount(0);
//       }
//     };
//     fetchCart();
//     const interval = setInterval(fetchCart, 30000);
//     return () => clearInterval(interval);
//   }, [user]);

//   /* -------------------------------------------------------------------------- */
//   /* 3. SEARCH LOGIC (Optimized with Pre-computed Index)                        */
//   /* -------------------------------------------------------------------------- */

//   // Debounce search input (300ms for optimal UX)
//   useEffect(() => {
//     if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

//     searchTimeoutRef.current = setTimeout(() => {
//       setDebouncedSearchText(searchText);
//     }, 300);

//     return () => {
//       if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
//     };
//   }, [searchText]);

//   // Perform instant search using pre-computed index
//   useEffect(() => {
//     if (!debouncedSearchText.trim()) {
//       setSearchResults([]);
//       setShowSearchResults(!!searchText.trim()); // Show suggestions if empty but focused
//       return;
//     }

//     const term = debouncedSearchText.toLowerCase().trim();
//     const words = term.split(/\s+/);

//     // Fast filter using pre-computed index
//     const results = searchIndex
//       .filter(({ searchString }) => words.every(word => searchString.includes(word)))
//       .map(({ product }) => product)
//       .slice(0, 10); // Limit to 10 for dropdown performance

//     setSearchResults(results);
//     setShowSearchResults(true);
//   }, [debouncedSearchText, searchIndex]);

//   const extractPopularSearches = (products) => {
//     const catCounts = {};
//     const brandCounts = {};

//     products.forEach(p => {
//       if (p.category) catCounts[p.category] = (catCounts[p.category] || 0) + 1;
//       if (p.brand) brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
//     });

//     const topCats = Object.entries(catCounts).sort((a, b) => b[1] - a[1]).slice(0, 4).map(x => x[0]);
//     const topBrands = Object.entries(brandCounts).sort((a, b) => b[1] - a[1]).slice(0, 4).map(x => x[0]);

//     setPopularSearches([...topCats, ...topBrands]);
//   };

//   /* -------------------------------------------------------------------------- */
//   /* 4. HANDLERS                                                                */
//   /* -------------------------------------------------------------------------- */

//   const saveToRecentSearches = (query) => {
//     if (!query.trim()) return;
//     const updated = [
//       query.trim(),
//       ...recentSearches.filter(s => s.toLowerCase() !== query.trim().toLowerCase())
//     ].slice(0, 5);
//     setRecentSearches(updated);
//     localStorage.setItem("recentSearches", JSON.stringify(updated));
//   };

//   const handleInputChange = (e) => {
//     setSearchText(e.target.value);
//     setShowSearchResults(true);
//   };

//   const clearSearch = () => {
//     setSearchText("");
//     setDebouncedSearchText("");
//     setSearchResults([]);
//     searchInputRef.current?.focus();
//   };

//   const handleSearchSubmit = (e) => {
//     if (e) e.preventDefault();
//     if (!searchText.trim()) return;

//     saveToRecentSearches(searchText);
//     setShowSearchResults(false);
//     setShowMobileSearch(false);
//     closeMenu();
//     navigate(`/search?q=${encodeURIComponent(searchText.trim())}`);
//   };

//   const handleResultClick = (product) => {
//     saveToRecentSearches(product.name);
//     setSearchText("");
//     setShowSearchResults(false);
//     setShowMobileSearch(false);
//     closeMenu();
//     navigate(`/product/${product.slug}`);
//   };

//   const handleRecentSearchClick = (term) => {
//     setSearchText(term);
//     saveToRecentSearches(term);
//     navigate(`/search?q=${encodeURIComponent(term)}`);
//     setShowSearchResults(false);
//   };

//   const clearRecentSearches = () => {
//     setRecentSearches([]);
//     localStorage.removeItem("recentSearches");
//   };

//   const closeMenu = () => {
//     setMenuOpen(false);
//     setShowSearchResults(false);
//     setShowMobileSearch(false);
//     setMobileCategoriesOpen({});
//   };

//   const toggleMobileCategory = (id) => {
//     setMobileCategoriesOpen(prev => ({ ...prev, [id]: !prev[id] }));
//   };

//   const handleLogout = async () => {
//     try {
//       await axiosInstance.post("/api/user/logout", {}, { withCredentials: true });
//       logoutUser();
//       navigate("/");
//     } catch (err) {
//       console.error("Logout error:", err);
//     }
//   };

//   /* -------------------------------------------------------------------------- */
//   /* 5. VOICE SEARCH                                                            */
//   /* -------------------------------------------------------------------------- */

//   const startListening = () => {
//     if (!window.webkitSpeechRecognition && !window.SpeechRecognition) {
//       alert("Voice search not supported in this browser");
//       return;
//     }

//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     recognitionRef.current = new SpeechRecognition();
//     recognitionRef.current.continuous = false;
//     recognitionRef.current.interimResults = false;
//     recognitionRef.current.lang = 'en-IN';

//     recognitionRef.current.onstart = () => setListening(true);
//     recognitionRef.current.onresult = (e) => {
//       const transcript = e.results[0][0].transcript;
//       setSearchText(transcript);
//       saveToRecentSearches(transcript);
//       setListening(false);
//       // Auto submit after voice input
//       setTimeout(() => handleSearchSubmit(), 500);
//     };
//     recognitionRef.current.onerror = () => setListening(false);
//     recognitionRef.current.onend = () => setListening(false);

//     recognitionRef.current.start();
//   };

//   /* -------------------------------------------------------------------------- */
//   /* 6. RENDER HELPERS                                                          */
//   /* -------------------------------------------------------------------------- */

//   const getDiscount = (p) => {
//     if (p.originalPrice > p.price) {
//       return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
//     }
//     return 0;
//   };

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

//   /* -------------------------------------------------------------------------- */
//   /* 7. MAIN RENDER                                                             */
//   /* -------------------------------------------------------------------------- */

//   return (
//     <>
//       {/* Mobile Search Overlay */}
//       {(isMobile || isTablet) && showMobileSearch && (
//         <div className="mobile-search-overlay">
//           <div className="mobile-search-header">
//             <FaArrowLeft className="mobile-search-back" onClick={() => setShowMobileSearch(false)} />
//             <form onSubmit={handleSearchSubmit} className="mobile-search-input-container">
//               <FaSearch className="mobile-search-icon" />
//               <input className="w-100 border-0 bg-transparent page-title-main-name"
//                 ref={searchInputRef}
//                 type="text"
//                 placeholder="Search products, brands..."
//                 value={searchText}
//                 onChange={handleInputChange}
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
//                       {recentSearches.map((search, i) => (
//                         <div key={i} onClick={() => handleRecentSearchClick(search)} className="mobile-search-tag">
//                           {search}
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
//                       {popularSearches.map((search, i) => (
//                         <div key={i} onClick={() => handleRecentSearchClick(search)} className="mobile-search-tag popular">
//                           {search}
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

//       <header className="header">
//         {/* Logo */}
//         <Link to="/" className="logo" onClick={closeMenu}>
//           <img src={logo} className="ps-sm-0 ps-4 ms-sm-0" alt="JOYORY Logo" />
//         </Link>

//         {/* Mobile Menu Toggle */}
//         {(isMobile || isTablet) && (
//           <div className="menu-toggle" onClick={() => setMenuOpen(true)}>
//             {/* <FaBars size={22} /> */}


//             <img src={menu} alt="Image-Not-Found" />

//           </div>
//         )}

//         {/* Mobile Icons */}
//         {(isMobile || isTablet) && !showMobileSearch && (
//           <div className="nav-icons user-dropdown gap-3 d-md-flex d-lg-none d-flex">
//             <div className="mobile-search-icon-wrapper" onClick={() => setShowMobileSearch(true)}>
//               {/* <FaSearch className="mobile-search-toggle" /> */}
//               <img src={search} alt="Image-Not-Found" />
//             </div>
//             <Link to="/cartpage" className="mobile-cart-icon">
//               {/* <FiShoppingCart className="icon" /> */}
//               <img src={Cart} alt="Image-Not-Found" />
//               {cartCount > 0 && <span className="cart-count page-title-main-name">{cartCount > 99 ? '99+' : cartCount}</span>}
//             </Link>

//           </div>
//         )}

//         {/* Navigation */}
//         <nav className={`nav-links ${menuOpen ? "active" : ""}`} ref={mobileMenuRef}>
//           {(isMobile || isTablet) && (
//             <div className="mobile-menu-header">
//               <div className="mobile-menu-logo">
//                 <img src={logo} alt="JOYORY Logo" />
//               </div>
//               <div className="menu-close" onClick={closeMenu}>
//                 <FaTimes size={22} />
//               </div>
//             </div>
//           )}

//           <div className="nav-links-container w-100">
//             <div className="border-top-bottom">
//               <Link to="/" onClick={closeMenu} className="nav-link d-flex ms-3 page-title-main-name margin-top-home">
//                 Home
//               </Link>
//             </div>


//             {/* Categories Dropdown - Desktop */}
//             {!isMobile && !isTablet && (
//               <div className="dropdown dropdowns" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
//                 <div className="dropbtn page-title-main-name" onClick={() => setDropdownOpen(!dropdownOpen)}>
//                   Categories <FaAngleDown style={{ marginLeft: "5px" }} />
//                 </div>
//                 {dropdownOpen && (
//                   <div className="mega-menu">
//                     {categories.map((cat) => (
//                       <div key={cat._id} className="mega-column">
//                         <h4>
//                           <Link to={`/category/${cat.slug}`} onClick={closeMenu} className="main-category-link page-title-main-name">
//                             {cat.name}
//                           </Link>
//                         </h4>
//                         {cat.subCategories?.map((sub) => (
//                           <Link key={sub._id} to={`/category/${sub.slug}`} onClick={closeMenu} className="sub-category-link page-title-main-name">
//                             {sub.name}
//                           </Link>
//                         ))}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Mobile Categories */}
//             {(isMobile || isTablet) && (
//               <div className="mobile-categories border-top-bottom">
//                 <div className="mobile-category-header page-title-main-name" onClick={() => toggleMobileCategory('all')}>
//                   Categories <FaAngleDown className={mobileCategoriesOpen['all'] ? 'open' : ''} />
//                 </div>
//                 {mobileCategoriesOpen['all'] && categories.map((cat) => (
//                   <div key={cat._id} className="mobile-category-item">
//                     <div className="mobile-category-main" onClick={() => toggleMobileCategory(cat._id)}>
//                       <Link to={`/category/${cat.slug}`} onClick={closeMenu} className="mobile-category-name page-title-main-name">
//                         {cat.name}
//                       </Link>
//                       {cat.subCategories?.length > 0 && <FaAngleDown className={mobileCategoriesOpen[cat._id] ? 'open' : ''} />}
//                     </div>
//                     {mobileCategoriesOpen[cat._id] && renderMobileSubCategories(cat.subCategories)}
//                   </div>
//                 ))}
//               </div>
//             )}

//             <div className="border-top-bottom mobile-category-header">
//               <Link to="/FoundationShadeFinder" onClick={closeMenu} className="mt-1 pb-1 page-title-main-name shadefinder-name-mobile-tabalte">
//                 Shade Finder
//               </Link>
//             </div>

//             {/* Mobile User Links */}
//             {(isMobile || isTablet) && (
//               <>
//                 <div className="border-top-bottom page-title-main-name">
//                   <Link to="/useraccount" onClick={closeMenu} className="nav-link mobile-profile-link ms-3 d-flex mt-1 pb-1">
//                     My Account
//                   </Link>
//                 </div>
//                 <div className="border-top-bottom page-title-main-name">
//                   <Link to="/Myorders" onClick={closeMenu} className="nav-link ms-3 d-flex mt-1 pb-1">
//                     My Orders
//                   </Link>
//                 </div>
//                 <div>
//                   {user && !user.guest ? (
//                     <div onClick={handleLogout} className="nav-link logout-link ms-3 d-flex mt-1 pb-1 page-title-main-name">
//                       Logout
//                     </div>
//                   ) : (
//                     <Link to="/login" onClick={closeMenu} className="nav-link ms-3 d-flex mt-1 pb-1 page-title-main-name">
//                       Login
//                     </Link>
//                   )}
//                 </div>
//               </>
//             )}


//             {/* Desktop Search */}
//             {!isMobile && !isTablet && (
//               <div className="search-box d-flex page-title-main-name" ref={headerSearchRef} style={{ position: "relative", zIndex: 999 }}>
//                 <form onSubmit={handleSearchSubmit} style={{ display: "flex", width: "100%", alignItems: "center" }}>
//                   {/* <FaSearch className="icon" style={{ cursor: "pointer" }} onClick={handleSearchSubmit} /> */}
//                   <img src={search} alt="Image-Not-Found" onClick={handleSearchSubmit} />
//                   <input
//                     ref={searchInputRef}
//                     type="text"
//                     placeholder="Search products, brands, categories..."
//                     value={searchText}
//                     onChange={handleInputChange}
//                     onFocus={() => setShowSearchResults(true)}
//                     style={{ border: "none", outline: "none", background: "transparent", flex: 1, margin: "0 10px" }}
//                   />
//                   {searchText && <FaTimes style={{ cursor: "pointer", marginRight: "10px" }} onClick={clearSearch} />}
//                   {/* <FaMicrophone className={`icon ${listening ? "listening" : ""}`} onClick={startListening} style={{ color: listening ? "#0077b6" : "#666" }} /> */}
//                   <img src={mic} className={`icon ${listening ? "listening" : ""}`} onClick={startListening} alt="Image-Not-Found" />
//                 </form>

//                 {/* Desktop Search Dropdown */}
//                 {showSearchResults && (
//                   <div className="search-results-dropdown" style={{
//                     position: "absolute",
//                     top: "calc(100% + 5px)",
//                     left: 0,
//                     right: 0,
//                     background: "white",
//                     border: "1px solid #ddd",
//                     borderRadius: "8px",
//                     boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
//                     maxHeight: "500px",
//                     overflowY: "auto",
//                     zIndex: 1000
//                   }}>
//                     {!searchText.trim() ? (
//                       <div style={{ padding: "15px" }}>
//                         {recentSearches.length > 0 && (
//                           <div style={{ marginBottom: "15px" }}>
//                             <div style={{ fontSize: "12px", fontWeight: "600", color: "#666", marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
//                               <span>Recent Searches</span>
//                               <button onClick={clearRecentSearches} style={{ background: "none", border: "none", color: "#0077b6", cursor: "pointer", fontSize: "11px" }}>Clear</button>
//                             </div>
//                             <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
//                               {recentSearches.map((s, i) => (
//                                 <span key={i} onClick={() => handleRecentSearchClick(s)} style={{ padding: "4px 12px", background: "#f0f0f0", borderRadius: "15px", fontSize: "12px", cursor: "pointer" }}>
//                                   {s}
//                                 </span>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                         <div style={{ fontSize: "12px", fontWeight: "600", color: "#666", marginBottom: "8px" }}>Popular</div>
//                         <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
//                           {popularSearches.map((s, i) => (
//                             <span key={i} onClick={() => handleRecentSearchClick(s)} style={{ padding: "4px 12px", background: "#e6f7ff", color: "#0077b6", borderRadius: "15px", fontSize: "12px", cursor: "pointer" }}>
//                               {s}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     ) : searchResults.length > 0 ? (
//                       <div>
//                         {searchResults.map((item) => {
//                           const discount = getDiscount(item);
//                           return (
//                             <div key={item._id} onClick={() => handleResultClick(item)} style={{
//                               display: "flex",
//                               padding: "10px",
//                               borderBottom: "1px solid #f5f5f5",
//                               cursor: "pointer",
//                               hover: { background: "#f8f9fa" }
//                             }}>
//                               <img src={item.image} alt={item.name} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px", marginRight: "10px" }} />
//                               <div style={{ flex: 1 }}>
//                                 <div style={{ fontWeight: "600", fontSize: "13px" }}>{item.name}</div>
//                                 <div style={{ fontSize: "11px", color: "#666" }}>{item.brand}</div>
//                                 <div style={{ fontSize: "13px", color: "#0077b6", fontWeight: "600" }}>
//                                   ₹{item.price}
//                                   {discount > 0 && <span style={{ textDecoration: "line-through", color: "#999", marginLeft: "8px", fontSize: "11px" }}>₹{item.originalPrice}</span>}
//                                 </div>
//                               </div>
//                             </div>
//                           );
//                         })}
//                         <div onClick={handleSearchSubmit} style={{ padding: "12px", textAlign: "center", background: "#f8f9fa", cursor: "pointer", color: "#0077b6", fontWeight: "600", fontSize: "13px" }}>
//                           View all {searchResults.length} results →
//                         </div>
//                       </div>
//                     ) : (
//                       <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
//                         No results for "{searchText}"
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Desktop Icons */}
//             {!isMobile && !isTablet && (
//               <div className="nav-icons user-dropdown gap-3 d-none d-lg-flex page-title-main-name" style={{ alignItems: "center", marginLeft: "auto" }}>
//                 <Link to="/cartpage" style={{ position: "relative" }}>
//                   {/* <FiShoppingCart className="icon" style={{ fontSize: "20px" }} /> */}
//                   <img src={Cart} alt="Image-Not-Found" />
//                   {cartCount > 0 && <span style={{ position: "absolute", top: "-8px", right: "-8px", background: "#0077b6", color: "white", borderRadius: "50%", width: "18px", height: "18px", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>}
//                 </Link>
//                 <Link to="/wishlist">
//                   {/* <FaRegHeart className="icon" style={{ fontSize: "18px" }} /> */}
//                   <img src={favourite} alt="Image-Not-Found" />
//                 </Link>
//                 <div style={{ position: "relative", cursor: "pointer" }} onClick={() => setUserDropdown(!userDropdown)}>
//                   {/* <FaUser className="icon" style={{ fontSize: "18px" }} /> */}
//                   <img src={users} className="icon" alt="Image-Not-Found" />

//                   {userDropdown && (
//                     <div style={{ position: "absolute", top: "100%", right: 0, background: "white", border: "1px solid #ddd", borderRadius: "8px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", zIndex: 1000, minWidth: "180px", marginTop: "5px" }}>
//                       {user && !user.guest ? (
//                         <>
//                           <div onClick={() => { navigate("/useraccount"); setUserDropdown(false); }} style={{ padding: "10px 15px", borderBottom: "1px solid #eee", cursor: "pointer" }}>My Account</div>
//                           <div onClick={() => { navigate("/Myorders"); setUserDropdown(false); }} style={{ padding: "10px 15px", borderBottom: "1px solid #eee", cursor: "pointer" }}>My Orders</div>
//                           <div onClick={() => { handleLogout(); setUserDropdown(false); }} style={{ padding: "10px 15px", cursor: "pointer" }}>Logout</div>
//                         </>
//                       ) : (
//                         <>
//                           <div onClick={() => { navigate("/login"); setUserDropdown(false); }} style={{ padding: "10px 15px", borderBottom: "1px solid #eee", cursor: "pointer" }}>Login</div>
//                           <div onClick={() => { navigate("/Signup"); setUserDropdown(false); }} style={{ padding: "10px 15px", cursor: "pointer" }}>Register</div>
//                         </>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Mobile Footer Navigation */}
//           {(isMobile || isTablet) && (
//             <div className="mobile-footer-navigation w-100">
//               <Link to="/" onClick={closeMenu} className="mobile-footer-nav-item">
//                 {/* <div className="mobile-footer-nav-icon">🏠</div> */}
//                 <img src={home} alt="Home-Image-Not-Found" />
//                 <div className="mobile-footer-nav-label page-title-main-name">Home</div>
//               </Link>
//               <Link to="/wishlist" onClick={closeMenu} className="mobile-footer-nav-item">
//                 {/* <div className="mobile-footer-nav-icon">❤️</div> */}
//                 <img src={favourite} alt="Wishlist-Image-Not-Found" />
//                 <div className="mobile-footer-nav-label page-title-main-name">Wishlist</div>
//               </Link>
//               <Link to="/cartpage" onClick={closeMenu} className="mobile-footer-nav-item">
//                 {/* <div className="mobile-footer-nav-icon">🛒</div> */}
//                 <img src={Cart} alt="Cart-Image-Not-Found" />
//                 <div className="mobile-footer-nav-label page-title-main-name">Cart</div>
//                 {cartCount > 0 && <div className="mobile-footer-cart-count">{cartCount > 9 ? '9+' : cartCount}</div>}
//               </Link>
//               <Link to="/useraccount" onClick={closeMenu} className="mobile-footer-nav-item">
//                 {/* <div className="mobile-footer-nav-icon">👤</div> */}
//                 <img src={users} alt="Profile-Image-Not-Found" />
//                 <div className="mobile-footer-nav-label page-title-main-name">Profile</div>
//               </Link>
//             </div>
//           )}
//         </nav>
//       </header>
//     </>
//   );
// };

// export default Header;



















// import React, {
//   useState,
//   useEffect,
//   useMemo,
//   useRef,
//   useCallback,
//   useContext
// } from "react";
// import {
//   FaSearch,
//   FaMicrophone,
//   FaRegHeart,
//   FaUser,
//   FaBars,
//   FaTimes,
//   FaAngleDown,
//   FaArrowLeft,
// } from "react-icons/fa";
// import { FiCamera, FiShoppingCart } from "react-icons/fi";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import "../css/Header/Header.css";
// import "../App.css";
// import logo from "../assets/logo.png";
// import Cart from "../assets/Cart.svg";
// import favourite from "../assets/favourite.svg";
// import users from "../assets/user.svg";
// import mic from "../assets/mic.svg";
// import search from "../assets/search.svg";
// import menu from "../assets/menu.svg";
// import home from "../assets/home.svg";
// import axiosInstance from "../utils/axiosInstance.js";
// import { UserContext } from "./UserContext";
// import HeaderCategories from "../component/HeaderCategories";


// const Header = (props) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user, logoutUser } = useContext(UserContext);

//   // UI States
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [listening, setListening] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [cartCount, setCartCount] = useState(0);
//   const [userDropdown, setUserDropdown] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
//   const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024 && window.innerWidth > 768);
//   const [showMobileSearch, setShowMobileSearch] = useState(false);
//   const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState({});

//   // Search States
//   const [searchText, setSearchText] = useState("");
//   const [debouncedSearchText, setDebouncedSearchText] = useState("");
//   const [allProducts, setAllProducts] = useState([]);
//   const [searchIndex, setSearchIndex] = useState([]); // Pre-computed for speed
//   const [searchResults, setSearchResults] = useState([]);
//   const [showSearchResults, setShowSearchResults] = useState(false);
//   const [isSearchLoading, setIsSearchLoading] = useState(false);
//   const [recentSearches, setRecentSearches] = useState([]);
//   const [popularSearches, setPopularSearches] = useState([]);
//   const [categories, setCategories] = useState([]);

//   // Refs
//   const searchTimeoutRef = useRef(null);
//   const recognitionRef = useRef(null);
//   const searchInputRef = useRef(null);
//   const headerSearchRef = useRef(null);
//   const mobileMenuRef = useRef(null);
//   const hasFetchedProducts = useRef(false);

//   /* -------------------------------------------------------------------------- */
//   /* 1. INITIAL SETUP & RESPONSIVE HANDLING                                     */
//   /* -------------------------------------------------------------------------- */

//   useEffect(() => {
//     const handleResize = () => {
//       const width = window.innerWidth;
//       setIsMobile(width <= 768);
//       setIsTablet(width <= 1024 && width > 768);
//       if (width > 768) setShowMobileSearch(false);
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Close menus when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
//         if (menuOpen) closeMenu();
//       }
//       if (headerSearchRef.current && !headerSearchRef.current.contains(event.target)) {
//         setShowSearchResults(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [menuOpen]);

//   // Load recent searches
//   useEffect(() => {
//     const saved = localStorage.getItem("recentSearches");
//     if (saved) {
//       try {
//         setRecentSearches(JSON.parse(saved));
//       } catch (e) {
//         console.error("Error loading recent searches:", e);
//       }
//     }
//   }, []);

//   /* -------------------------------------------------------------------------- */
//   /* 2. DATA FETCHING (Products for Search Dropdown)                            */
//   /* -------------------------------------------------------------------------- */

//   useEffect(() => {
//     if (hasFetchedProducts.current) return;

//     const fetchData = async () => {
//       try {
//         setIsSearchLoading(true);

//         // Fetch categories
//         try {
//           const catRes = await axiosInstance.get("/api/user/categories/tree");
//           setCategories(Array.isArray(catRes.data) ? catRes.data : catRes.data.categories || []);
//         } catch (err) {
//           console.error("Category fetch error:", err);
//         }

//         // Fetch products
//         const res = await axiosInstance.get("/api/user/products/all");
//         let products = [];

//         if (res.data.products && Array.isArray(res.data.products)) {
//           products = res.data.products;
//         } else if (Array.isArray(res.data)) {
//           products = res.data;
//         }

//         // Process products
//         const processed = products.map(p => ({
//           _id: p._id || p.id,
//           name: p.name || p.title || "Unnamed Product",
//           slug: p.slugs?.[0] || p.slug || p._id,
//           brand: p.brand?.name || (typeof p.brand === 'string' ? p.brand : ""),
//           category: p.category?.name || (typeof p.category === 'string' ? p.category : ""),
//           price: p.selectedVariant?.displayPrice || p.price || 0,
//           originalPrice: p.selectedVariant?.originalPrice || p.originalPrice || 0,
//           discountPercent: p.selectedVariant?.discountPercent || 0,
//           image: p.selectedVariant?.images?.[0] || p.images?.[0] || "/placeholder.png",
//           inStock: p.inStock !== false && p.status !== "outOfStock",
//           rating: p.rating || 0,
//           reviewCount: p.reviewCount || 0,
//           description: p.description || "",
//           variants: p.variants || []
//         }));

//         setAllProducts(processed);

//         // Pre-compute search index for O(1) lookup speed
//         const index = processed.map(p => ({
//           product: p,
//           searchString: [
//             p.name,
//             p.brand,
//             p.category,
//             ...(p.variants?.map(v => v.shadeName) || [])
//           ].filter(Boolean).join(' ').toLowerCase()
//         }));

//         setSearchIndex(index);
//         hasFetchedProducts.current = true;

//         // Extract popular searches
//         extractPopularSearches(processed);

//       } catch (err) {
//         console.error("Error fetching products:", err);
//       } finally {
//         setIsSearchLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Fetch cart count
//   useEffect(() => {
//     const fetchCart = async () => {
//       if (!user || user.guest) {
//         setCartCount(0);
//         return;
//       }
//       try {
//         const res = await axiosInstance.get("/api/user/cart/summary", { withCredentials: true });
//         const count = res.data?.cart?.length || res.data?.items?.length || res.data?.count || 0;
//         setCartCount(count);
//       } catch (err) {
//         console.error("Cart fetch error:", err);
//         setCartCount(0);
//       }
//     };
//     fetchCart();
//     const interval = setInterval(fetchCart, 30000);
//     return () => clearInterval(interval);
//   }, [user]);

//   /* -------------------------------------------------------------------------- */
//   /* 3. SEARCH LOGIC (Optimized with Pre-computed Index)                        */
//   /* -------------------------------------------------------------------------- */

//   // Debounce search input (300ms for optimal UX)
//   useEffect(() => {
//     if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

//     searchTimeoutRef.current = setTimeout(() => {
//       setDebouncedSearchText(searchText);
//     }, 300);

//     return () => {
//       if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
//     };
//   }, [searchText]);

//   // Perform instant search using pre-computed index
//   useEffect(() => {
//     if (!debouncedSearchText.trim()) {
//       setSearchResults([]);
//       setShowSearchResults(!!searchText.trim()); // Show suggestions if empty but focused
//       return;
//     }

//     const term = debouncedSearchText.toLowerCase().trim();
//     const words = term.split(/\s+/);

//     // Fast filter using pre-computed index
//     const results = searchIndex
//       .filter(({ searchString }) => words.every(word => searchString.includes(word)))
//       .map(({ product }) => product)
//       .slice(0, 10); // Limit to 10 for dropdown performance

//     setSearchResults(results);
//     setShowSearchResults(true);
//   }, [debouncedSearchText, searchIndex]);

//   const extractPopularSearches = (products) => {
//     const catCounts = {};
//     const brandCounts = {};

//     products.forEach(p => {
//       if (p.category) catCounts[p.category] = (catCounts[p.category] || 0) + 1;
//       if (p.brand) brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
//     });

//     const topCats = Object.entries(catCounts).sort((a, b) => b[1] - a[1]).slice(0, 4).map(x => x[0]);
//     const topBrands = Object.entries(brandCounts).sort((a, b) => b[1] - a[1]).slice(0, 4).map(x => x[0]);

//     setPopularSearches([...topCats, ...topBrands]);
//   };

//   /* -------------------------------------------------------------------------- */
//   /* 4. HANDLERS                                                                */
//   /* -------------------------------------------------------------------------- */

//   const saveToRecentSearches = (query) => {
//     if (!query.trim()) return;
//     const updated = [
//       query.trim(),
//       ...recentSearches.filter(s => s.toLowerCase() !== query.trim().toLowerCase())
//     ].slice(0, 5);
//     setRecentSearches(updated);
//     localStorage.setItem("recentSearches", JSON.stringify(updated));
//   };

//   const handleInputChange = (e) => {
//     setSearchText(e.target.value);
//     setShowSearchResults(true);
//   };

//   const clearSearch = () => {
//     setSearchText("");
//     setDebouncedSearchText("");
//     setSearchResults([]);
//     searchInputRef.current?.focus();
//   };

//   const handleSearchSubmit = (e) => {
//     if (e) e.preventDefault();
//     if (!searchText.trim()) return;

//     saveToRecentSearches(searchText);
//     setShowSearchResults(false);
//     setShowMobileSearch(false);
//     closeMenu();
//     navigate(`/search?q=${encodeURIComponent(searchText.trim())}`);
//   };

//   const handleResultClick = (product) => {
//     saveToRecentSearches(product.name);
//     setSearchText("");
//     setShowSearchResults(false);
//     setShowMobileSearch(false);
//     closeMenu();
//     navigate(`/product/${product.slug}`);
//   };

//   const handleRecentSearchClick = (term) => {
//     setSearchText(term);
//     saveToRecentSearches(term);
//     navigate(`/search?q=${encodeURIComponent(term)}`);
//     setShowSearchResults(false);
//   };

//   const clearRecentSearches = () => {
//     setRecentSearches([]);
//     localStorage.removeItem("recentSearches");
//   };

//   const closeMenu = () => {
//     setMenuOpen(false);
//     setShowSearchResults(false);
//     setShowMobileSearch(false);
//     setMobileCategoriesOpen({});
//   };

//   const toggleMobileCategory = (id) => {
//     setMobileCategoriesOpen(prev => ({ ...prev, [id]: !prev[id] }));
//   };

//   const handleLogout = async () => {
//     try {
//       await axiosInstance.post("/api/user/logout", {}, { withCredentials: true });
//       logoutUser();
//       navigate("/");
//     } catch (err) {
//       console.error("Logout error:", err);
//     }
//   };

//   /* -------------------------------------------------------------------------- */
//   /* 5. VOICE SEARCH                                                            */
//   /* -------------------------------------------------------------------------- */

//   const startListening = () => {
//     if (!window.webkitSpeechRecognition && !window.SpeechRecognition) {
//       alert("Voice search not supported in this browser");
//       return;
//     }

//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     recognitionRef.current = new SpeechRecognition();
//     recognitionRef.current.continuous = false;
//     recognitionRef.current.interimResults = false;
//     recognitionRef.current.lang = 'en-IN';

//     recognitionRef.current.onstart = () => setListening(true);
//     recognitionRef.current.onresult = (e) => {
//       const transcript = e.results[0][0].transcript;
//       setSearchText(transcript);
//       saveToRecentSearches(transcript);
//       setListening(false);
//       // Auto submit after voice input
//       setTimeout(() => handleSearchSubmit(), 500);
//     };
//     recognitionRef.current.onerror = () => setListening(false);
//     recognitionRef.current.onend = () => setListening(false);

//     recognitionRef.current.start();
//   };

//   /* -------------------------------------------------------------------------- */
//   /* 6. RENDER HELPERS                                                          */
//   /* -------------------------------------------------------------------------- */

//   const getDiscount = (p) => {
//     if (p.originalPrice > p.price) {
//       return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
//     }
//     return 0;
//   };

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

//   /* -------------------------------------------------------------------------- */
//   /* 7. MAIN RENDER                                                             */
//   /* -------------------------------------------------------------------------- */

//   return (
//     <>
//       {/* Mobile Search Overlay */}
//       {(isMobile || isTablet) && showMobileSearch && (
//         <div className="mobile-search-overlay">
//           <div className="mobile-search-header">
//             <FaArrowLeft className="mobile-search-back" onClick={() => setShowMobileSearch(false)} />
//             <form onSubmit={handleSearchSubmit} className="mobile-search-input-container">
//               <FaSearch className="mobile-search-icon" />
//               <input className="w-100 border-0 bg-transparent page-title-main-name"
//                 ref={searchInputRef}
//                 type="text"
//                 placeholder="Search products, brands..."
//                 value={searchText}
//                 onChange={handleInputChange}
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
//                       {recentSearches.map((search, i) => (
//                         <div key={i} onClick={() => handleRecentSearchClick(search)} className="mobile-search-tag">
//                           {search}
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
//                       {popularSearches.map((search, i) => (
//                         <div key={i} onClick={() => handleRecentSearchClick(search)} className="mobile-search-tag popular">
//                           {search}
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

//       <header className="header d-block">
//         <div className="d-flex justify-content-between margin-padding-header">
//         {/* Logo */}
//         <Link to="/" className="logo" onClick={closeMenu}>
//           <img src={logo} className="ps-sm-0 ps-4 ms-sm-0" alt="JOYORY Logo" />
//         </Link>

//         {/* Mobile Menu Toggle */}
//         {(isMobile || isTablet) && (
//           <div className="menu-toggle" onClick={() => setMenuOpen(true)}>
//             {/* <FaBars size={22} /> */}


//             <img src={menu} alt="Image-Not-Found" />

//           </div>
//         )}

//         {/* Mobile Icons */}
//         {(isMobile || isTablet) && !showMobileSearch && (
//           <div className="nav-icons user-dropdown gap-3 d-md-flex d-lg-none d-flex">
//             <div className="mobile-search-icon-wrapper" onClick={() => setShowMobileSearch(true)}>
//               {/* <FaSearch className="mobile-search-toggle" /> */}
//               <img src={search} alt="Image-Not-Found" />
//             </div>
//             <Link to="/cartpage" className="mobile-cart-icon">
//               {/* <FiShoppingCart className="icon" /> */}
//               <img src={Cart} alt="Image-Not-Found" />
//               {cartCount > 0 && <span className="cart-count page-title-main-name">{cartCount > 99 ? '99+' : cartCount}</span>}
//             </Link>

//           </div>
//         )}

//         {/* Navigation */}
//         <nav className={`nav-links ${menuOpen ? "active" : ""}`} ref={mobileMenuRef}>
//           {(isMobile || isTablet) && (
//             <div className="mobile-menu-header">
//               <div className="mobile-menu-logo">
//                 <img src={logo} alt="JOYORY Logo" />
//               </div>
//               <div className="menu-close" onClick={closeMenu}>
//                 <FaTimes size={22} />
//               </div>
//             </div>
//           )}

//           <div className="nav-links-container w-100">
//             {/* <div className="border-top-bottom">
//               <Link to="/" onClick={closeMenu} className="nav-link d-flex ms-3 page-title-main-name margin-top-home">
//                 Home
//               </Link>
//             </div> */}


//             {/* Categories Dropdown - Desktop */}
//             {/* {!isMobile && !isTablet && (
//               <div className="dropdown dropdowns" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
//                 <div className="dropbtn page-title-main-name" onClick={() => setDropdownOpen(!dropdownOpen)}>
//                   Categories <FaAngleDown style={{ marginLeft: "5px" }} />
//                 </div>
//                 {dropdownOpen && (
//                   <div className="mega-menu">
//                     {categories.map((cat) => (
//                       <div key={cat._id} className="mega-column">
//                         <h4>
//                           <Link to={`/category/${cat.slug}`} onClick={closeMenu} className="main-category-link page-title-main-name">
//                             {cat.name}
//                           </Link>
//                         </h4>
//                         {cat.subCategories?.map((sub) => (
//                           <Link key={sub._id} to={`/category/${sub.slug}`} onClick={closeMenu} className="sub-category-link page-title-main-name">
//                             {sub.name}
//                           </Link>
//                         ))}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )} */}

//             {/* Mobile Categories */}
//             {/* {(isMobile || isTablet) && (
//               <div className="mobile-categories border-top-bottom">
//                 <div className="mobile-category-header page-title-main-name" onClick={() => toggleMobileCategory('all')}>
//                   Categories <FaAngleDown className={mobileCategoriesOpen['all'] ? 'open' : ''} />
//                 </div>
//                 {mobileCategoriesOpen['all'] && categories.map((cat) => (
//                   <div key={cat._id} className="mobile-category-item">
//                     <div className="mobile-category-main" onClick={() => toggleMobileCategory(cat._id)}>
//                       <Link to={`/category/${cat.slug}`} onClick={closeMenu} className="mobile-category-name page-title-main-name">
//                         {cat.name}
//                       </Link>
//                       {cat.subCategories?.length > 0 && <FaAngleDown className={mobileCategoriesOpen[cat._id] ? 'open' : ''} />}
//                     </div>
//                     {mobileCategoriesOpen[cat._id] && renderMobileSubCategories(cat.subCategories)}
//                   </div>
//                 ))}
//               </div>
//             )} */}

//             {/* <div className="border-top-bottom mobile-category-header">
//               <Link to="/FoundationShadeFinder" onClick={closeMenu} className="mt-1 pb-1 page-title-main-name shadefinder-name-mobile-tabalte">
//                 Shade Finder
//               </Link>
//             </div> */}

//             {/* Mobile User Links */}
//             {(isMobile || isTablet) && (
//               <>
//                 <div className="border-top-bottom page-title-main-name">
//                   <Link to="/useraccount" onClick={closeMenu} className="nav-link mobile-profile-link ms-3 d-flex mt-1 pb-1">
//                     My Account
//                   </Link>
//                 </div>
//                 <div className="border-top-bottom page-title-main-name">
//                   <Link to="/Myorders" onClick={closeMenu} className="nav-link ms-3 d-flex mt-1 pb-1">
//                     My Orders
//                   </Link>
//                 </div>
//                 <div>
//                   {user && !user.guest ? (
//                     <div onClick={handleLogout} className="nav-link logout-link ms-3 d-flex mt-1 pb-1 page-title-main-name">
//                       Logout
//                     </div>
//                   ) : (
//                     <Link to="/login" onClick={closeMenu} className="nav-link ms-3 d-flex mt-1 pb-1 page-title-main-name">
//                       Login
//                     </Link>
//                   )}
//                 </div>
//               </>
//             )}


//             {/* Desktop Search */}
//             {!isMobile && !isTablet && (
//               <div className="search-box d-flex page-title-main-name" ref={headerSearchRef} style={{ position: "relative", zIndex: 999 }}>
//                 <form onSubmit={handleSearchSubmit} style={{ display: "flex", width: "100%", alignItems: "center" }}>
//                   {/* <FaSearch className="icon" style={{ cursor: "pointer" }} onClick={handleSearchSubmit} /> */}
//                   <img src={search} alt="Image-Not-Found" onClick={handleSearchSubmit} />
//                   <input
//                     ref={searchInputRef}
//                     type="text"
//                     placeholder="Search products, brands, categories..."
//                     value={searchText}
//                     onChange={handleInputChange}
//                     onFocus={() => setShowSearchResults(true)}
//                     style={{ border: "none", outline: "none", background: "transparent", flex: 1, margin: "0 10px" }}
//                   />
//                   {searchText && <FaTimes style={{ cursor: "pointer", marginRight: "10px" }} onClick={clearSearch} />}
//                   {/* <FaMicrophone className={`icon ${listening ? "listening" : ""}`} onClick={startListening} style={{ color: listening ? "#0077b6" : "#666" }} /> */}
//                   <img src={mic} className={`icon ${listening ? "listening" : ""}`} onClick={startListening} alt="Image-Not-Found" />
//                 </form>

//                 {/* Desktop Search Dropdown */}
//                 {showSearchResults && (
//                   <div className="search-results-dropdown" style={{
//                     position: "absolute",
//                     top: "calc(100% + 5px)",
//                     left: 0,
//                     right: 0,
//                     background: "white",
//                     border: "1px solid #ddd",
//                     borderRadius: "8px",
//                     boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
//                     maxHeight: "500px",
//                     overflowY: "auto",
//                     zIndex: 1000
//                   }}>
//                     {!searchText.trim() ? (
//                       <div style={{ padding: "15px" }}>
//                         {recentSearches.length > 0 && (
//                           <div style={{ marginBottom: "15px" }}>
//                             <div style={{ fontSize: "12px", fontWeight: "600", color: "#666", marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
//                               <span>Recent Searches</span>
//                               <button onClick={clearRecentSearches} style={{ background: "none", border: "none", color: "#0077b6", cursor: "pointer", fontSize: "11px" }}>Clear</button>
//                             </div>
//                             <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
//                               {recentSearches.map((s, i) => (
//                                 <span key={i} onClick={() => handleRecentSearchClick(s)} style={{ padding: "4px 12px", background: "#f0f0f0", borderRadius: "15px", fontSize: "12px", cursor: "pointer" }}>
//                                   {s}
//                                 </span>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                         <div style={{ fontSize: "12px", fontWeight: "600", color: "#666", marginBottom: "8px" }}>Popular</div>
//                         <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
//                           {popularSearches.map((s, i) => (
//                             <span key={i} onClick={() => handleRecentSearchClick(s)} style={{ padding: "4px 12px", background: "#e6f7ff", color: "#0077b6", borderRadius: "15px", fontSize: "12px", cursor: "pointer" }}>
//                               {s}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     ) : searchResults.length > 0 ? (
//                       <div>
//                         {searchResults.map((item) => {
//                           const discount = getDiscount(item);
//                           return (
//                             <div key={item._id} onClick={() => handleResultClick(item)} style={{
//                               display: "flex",
//                               padding: "10px",
//                               borderBottom: "1px solid #f5f5f5",
//                               cursor: "pointer",
//                               hover: { background: "#f8f9fa" }
//                             }}>
//                               <img src={item.image} alt={item.name} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px", marginRight: "10px" }} />
//                               <div style={{ flex: 1 }}>
//                                 <div style={{ fontWeight: "600", fontSize: "13px" }}>{item.name}</div>
//                                 <div style={{ fontSize: "11px", color: "#666" }}>{item.brand}</div>
//                                 <div style={{ fontSize: "13px", color: "#0077b6", fontWeight: "600" }}>
//                                   ₹{item.price}
//                                   {discount > 0 && <span style={{ textDecoration: "line-through", color: "#999", marginLeft: "8px", fontSize: "11px" }}>₹{item.originalPrice}</span>}
//                                 </div>
//                               </div>
//                             </div>
//                           );
//                         })}
//                         <div onClick={handleSearchSubmit} style={{ padding: "12px", textAlign: "center", background: "#f8f9fa", cursor: "pointer", color: "#0077b6", fontWeight: "600", fontSize: "13px" }}>
//                           View all {searchResults.length} results →
//                         </div>
//                       </div>
//                     ) : (
//                       <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
//                         No results for "{searchText}"
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Desktop Icons */}
//             {!isMobile && !isTablet && (
//               <div className="nav-icons user-dropdown gap-3 d-none d-lg-flex page-title-main-name" style={{ alignItems: "center", marginLeft: "auto" }}>
//                 <Link to="/cartpage" style={{ position: "relative" }}>
//                   {/* <FiShoppingCart className="icon" style={{ fontSize: "20px" }} /> */}
//                   <img src={Cart} alt="Image-Not-Found" />
//                   {cartCount > 0 && <span style={{ position: "absolute", top: "-8px", right: "-8px", background: "#0077b6", color: "white", borderRadius: "50%", width: "18px", height: "18px", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>}
//                 </Link>
//                 <Link to="/wishlist">
//                   {/* <FaRegHeart className="icon" style={{ fontSize: "18px" }} /> */}
//                   <img src={favourite} alt="Image-Not-Found" />
//                 </Link>
//                 <div style={{ position: "relative", cursor: "pointer" }} onClick={() => setUserDropdown(!userDropdown)}>
//                   {/* <FaUser className="icon" style={{ fontSize: "18px" }} /> */}
//                   <img src={users} className="icon" alt="Image-Not-Found" />

//                   {userDropdown && (
//                     <div style={{ position: "absolute", top: "100%", right: 0, background: "white", border: "1px solid #ddd", borderRadius: "8px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", zIndex: 1000, minWidth: "180px", marginTop: "5px" }}>
//                       {user && !user.guest ? (
//                         <>
//                           <div onClick={() => { navigate("/useraccount"); setUserDropdown(false); }} style={{ padding: "10px 15px", borderBottom: "1px solid #eee", cursor: "pointer" }}>My Account</div>
//                           <div onClick={() => { navigate("/Myorders"); setUserDropdown(false); }} style={{ padding: "10px 15px", borderBottom: "1px solid #eee", cursor: "pointer" }}>My Orders</div>
//                           <div onClick={() => { handleLogout(); setUserDropdown(false); }} style={{ padding: "10px 15px", cursor: "pointer" }}>Logout</div>
//                         </>
//                       ) : (
//                         <>
//                           <div onClick={() => { navigate("/login"); setUserDropdown(false); }} style={{ padding: "10px 15px", borderBottom: "1px solid #eee", cursor: "pointer" }}>Login</div>
//                           <div onClick={() => { navigate("/Signup"); setUserDropdown(false); }} style={{ padding: "10px 15px", cursor: "pointer" }}>Register</div>
//                         </>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//           </div>

//           {/* Mobile Footer Navigation */}
//           {(isMobile || isTablet) && (
//             <div className="mobile-footer-navigation w-100">
//               <Link to="/" onClick={closeMenu} className="mobile-footer-nav-item">
//                 {/* <div className="mobile-footer-nav-icon">🏠</div> */}
//                 <img src={home} alt="Home-Image-Not-Found" />
//                 <div className="mobile-footer-nav-label page-title-main-name">Home</div>
//               </Link>
//               <Link to="/wishlist" onClick={closeMenu} className="mobile-footer-nav-item">
//                 {/* <div className="mobile-footer-nav-icon">❤️</div> */}
//                 <img src={favourite} alt="Wishlist-Image-Not-Found" />
//                 <div className="mobile-footer-nav-label page-title-main-name">Wishlist</div>
//               </Link>
//               <Link to="/cartpage" onClick={closeMenu} className="mobile-footer-nav-item">
//                 {/* <div className="mobile-footer-nav-icon">🛒</div> */}
//                 <img src={Cart} alt="Cart-Image-Not-Found" />
//                 <div className="mobile-footer-nav-label page-title-main-name">Cart</div>
//                 {cartCount > 0 && <div className="mobile-footer-cart-count">{cartCount > 9 ? '9+' : cartCount}</div>}
//               </Link>
//               <Link to="/useraccount" onClick={closeMenu} className="mobile-footer-nav-item">
//                 {/* <div className="mobile-footer-nav-icon">👤</div> */}
//                 <img src={users} alt="Profile-Image-Not-Found" />
//                 <div className="mobile-footer-nav-label page-title-main-name">Profile</div>
//               </Link>
//             </div>
//           )}
//         </nav>
//       </div>
//       <HeaderCategories />
//       </header>
//     </>
//   );
// };

// export default Header;























// import React, {
//   useState,
//   useEffect,
//   useMemo,
//   useRef,
//   useCallback,
//   useContext
// } from "react";
// import {
//   FaSearch,
//   FaMicrophone,
//   FaRegHeart,
//   FaUser,
//   FaBars,
//   FaTimes,
//   FaAngleDown,
//   FaArrowLeft,
// } from "react-icons/fa";
// import { FiCamera, FiShoppingCart } from "react-icons/fi";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import "../css/Header/Header.css";
// import "../App.css";
// import logo from "../assets/logo.png";
// import Cart from "../assets/Cart.svg";
// import favourite from "../assets/favourite.svg";
// import users from "../assets/user.svg";
// import mic from "../assets/mic.svg";
// import search from "../assets/search.svg";
// import menu from "../assets/menu.svg";
// import home from "../assets/home.svg";
// import axiosInstance from "../utils/axiosInstance.js";
// import { UserContext } from "./UserContext";
// import HeaderCategories from "../component/HeaderCategories";

// const Header = (props) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user, logoutUser } = useContext(UserContext);

//   // UI States
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [listening, setListening] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [cartCount, setCartCount] = useState(0);
//   const [userDropdown, setUserDropdown] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
//   const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024 && window.innerWidth > 768);
//   const [showMobileSearch, setShowMobileSearch] = useState(false);
//   const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState({});

//   // Search States
//   const [searchText, setSearchText] = useState("");
//   const [debouncedSearchText, setDebouncedSearchText] = useState("");
//   const [allProducts, setAllProducts] = useState([]);
//   const [searchIndex, setSearchIndex] = useState([]);
//   const [searchResults, setSearchResults] = useState([]);
//   const [showSearchResults, setShowSearchResults] = useState(false);
//   const [isSearchLoading, setIsSearchLoading] = useState(false);
//   const [recentSearches, setRecentSearches] = useState([]);
//   const [popularSearches, setPopularSearches] = useState([]);
//   const [categories, setCategories] = useState([]);

//   // Refs
//   const searchTimeoutRef = useRef(null);
//   const recognitionRef = useRef(null);
//   const searchInputRef = useRef(null);
//   const headerSearchRef = useRef(null);
//   const mobileMenuRef = useRef(null);
//   const hasFetchedProducts = useRef(false);

//   /* -------------------------------------------------------------------------- */
//   /* 1. INITIAL SETUP & RESPONSIVE HANDLING                                     */
//   /* -------------------------------------------------------------------------- */

//   useEffect(() => {
//     const handleResize = () => {
//       const width = window.innerWidth;
//       setIsMobile(width <= 768);
//       setIsTablet(width <= 1024 && width > 768);
//       if (width > 768) setShowMobileSearch(false);
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Close menus when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
//         if (menuOpen) closeMenu();
//       }
//       if (headerSearchRef.current && !headerSearchRef.current.contains(event.target)) {
//         setShowSearchResults(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [menuOpen]);

//   // Load recent searches
//   useEffect(() => {
//     const saved = localStorage.getItem("recentSearches");
//     if (saved) {
//       try {
//         setRecentSearches(JSON.parse(saved));
//       } catch (e) {
//         console.error("Error loading recent searches:", e);
//       }
//     }
//   }, []);

//   /* -------------------------------------------------------------------------- */
//   /* 2. DATA FETCHING (Products for Search Dropdown)                            */
//   /* -------------------------------------------------------------------------- */

//   useEffect(() => {
//     if (hasFetchedProducts.current) return;

//     const fetchData = async () => {
//       try {
//         setIsSearchLoading(true);

//         // Fetch categories
//         try {
//           const catRes = await axiosInstance.get("/api/user/categories/tree");
//           setCategories(Array.isArray(catRes.data) ? catRes.data : catRes.data.categories || []);
//         } catch (err) {
//           console.error("Category fetch error:", err);
//         }

//         // Fetch products
//         const res = await axiosInstance.get("/api/user/products/all");
//         let products = [];

//         if (res.data.products && Array.isArray(res.data.products)) {
//           products = res.data.products;
//         } else if (Array.isArray(res.data)) {
//           products = res.data;
//         }

//         // Process products
//         const processed = products.map(p => ({
//           _id: p._id || p.id,
//           name: p.name || p.title || "Unnamed Product",
//           slug: p.slugs?.[0] || p.slug || p._id,
//           brand: p.brand?.name || (typeof p.brand === 'string' ? p.brand : ""),
//           category: p.category?.name || (typeof p.category === 'string' ? p.category : ""),
//           price: p.selectedVariant?.displayPrice || p.price || 0,
//           originalPrice: p.selectedVariant?.originalPrice || p.originalPrice || 0,
//           discountPercent: p.selectedVariant?.discountPercent || 0,
//           image: p.selectedVariant?.images?.[0] || p.images?.[0] || "/placeholder.png",
//           inStock: p.inStock !== false && p.status !== "outOfStock",
//           rating: p.rating || 0,
//           reviewCount: p.reviewCount || 0,
//           description: p.description || "",
//           variants: p.variants || []
//         }));

//         setAllProducts(processed);

//         // Pre-compute search index for O(1) lookup speed
//         const index = processed.map(p => ({
//           product: p,
//           searchString: [
//             p.name,
//             p.brand,
//             p.category,
//             ...(p.variants?.map(v => v.shadeName) || [])
//           ].filter(Boolean).join(' ').toLowerCase()
//         }));

//         setSearchIndex(index);
//         hasFetchedProducts.current = true;

//         // Extract popular searches
//         extractPopularSearches(processed);

//       } catch (err) {
//         console.error("Error fetching products:", err);
//       } finally {
//         setIsSearchLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Fetch cart count
//   useEffect(() => {
//     const fetchCart = async () => {
//       if (!user || user.guest) {
//         setCartCount(0);
//         return;
//       }
//       try {
//         const res = await axiosInstance.get("/api/user/cart/summary", { withCredentials: true });
//         const count = res.data?.cart?.length || res.data?.items?.length || res.data?.count || 0;
//         setCartCount(count);
//       } catch (err) {
//         console.error("Cart fetch error:", err);
//         setCartCount(0);
//       }
//     };
//     fetchCart();
//     const interval = setInterval(fetchCart, 30000);
//     return () => clearInterval(interval);
//   }, [user]);

//   /* -------------------------------------------------------------------------- */
//   /* 3. SEARCH LOGIC (Optimized with Pre-computed Index)                        */
//   /* -------------------------------------------------------------------------- */

//   // Debounce search input (300ms)
//   useEffect(() => {
//     if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
//     searchTimeoutRef.current = setTimeout(() => {
//       setDebouncedSearchText(searchText);
//     }, 300);
//     return () => {
//       if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
//     };
//   }, [searchText]);

//   // Perform instant search using pre-computed index
//   useEffect(() => {
//     if (!debouncedSearchText.trim()) {
//       setSearchResults([]);
//       setShowSearchResults(!!searchText.trim());
//       return;
//     }

//     const term = debouncedSearchText.toLowerCase().trim();
//     const words = term.split(/\s+/);

//     const results = searchIndex
//       .filter(({ searchString }) => words.every(word => searchString.includes(word)))
//       .map(({ product }) => product)
//       .slice(0, 10);

//     setSearchResults(results);
//     setShowSearchResults(true);
//   }, [debouncedSearchText, searchIndex]);

//   const extractPopularSearches = (products) => {
//     const catCounts = {};
//     const brandCounts = {};

//     products.forEach(p => {
//       if (p.category) catCounts[p.category] = (catCounts[p.category] || 0) + 1;
//       if (p.brand) brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
//     });

//     const topCats = Object.entries(catCounts).sort((a, b) => b[1] - a[1]).slice(0, 4).map(x => x[0]);
//     const topBrands = Object.entries(brandCounts).sort((a, b) => b[1] - a[1]).slice(0, 4).map(x => x[0]);

//     setPopularSearches([...topCats, ...topBrands]);
//   };

//   /* -------------------------------------------------------------------------- */
//   /* 4. HANDLERS                                                                */
//   /* -------------------------------------------------------------------------- */

//   const saveToRecentSearches = (query) => {
//     if (!query.trim()) return;
//     const updated = [
//       query.trim(),
//       ...recentSearches.filter(s => s.toLowerCase() !== query.trim().toLowerCase())
//     ].slice(0, 5);
//     setRecentSearches(updated);
//     localStorage.setItem("recentSearches", JSON.stringify(updated));
//   };

//   const handleInputChange = (e) => {
//     setSearchText(e.target.value);
//     setShowSearchResults(true);
//   };

//   const clearSearch = () => {
//     setSearchText("");
//     setDebouncedSearchText("");
//     setSearchResults([]);
//     searchInputRef.current?.focus();
//   };

//   const handleSearchSubmit = (e) => {
//     if (e) e.preventDefault();
//     if (!searchText.trim()) return;

//     saveToRecentSearches(searchText);
//     setShowSearchResults(false);
//     setShowMobileSearch(false);
//     closeMenu();
//     navigate(`/search?q=${encodeURIComponent(searchText.trim())}`);
//   };

//   const handleResultClick = (product) => {
//     saveToRecentSearches(product.name);
//     setSearchText("");
//     setShowSearchResults(false);
//     setShowMobileSearch(false);
//     closeMenu();
//     navigate(`/product/${product.slug}`);
//   };

//   const handleRecentSearchClick = (term) => {
//     setSearchText(term);
//     saveToRecentSearches(term);
//     navigate(`/search?q=${encodeURIComponent(term)}`);
//     setShowSearchResults(false);
//   };

//   const clearRecentSearches = () => {
//     setRecentSearches([]);
//     localStorage.removeItem("recentSearches");
//   };

//   const closeMenu = () => {
//     setMenuOpen(false);
//     setShowSearchResults(false);
//     setShowMobileSearch(false);
//     setMobileCategoriesOpen({});
//   };

//   const toggleMobileCategory = (id) => {
//     setMobileCategoriesOpen(prev => ({ ...prev, [id]: !prev[id] }));
//   };

//   const handleLogout = async () => {
//     try {
//       await axiosInstance.post("/api/user/logout", {}, { withCredentials: true });
//       logoutUser();
//       navigate("/");
//     } catch (err) {
//       console.error("Logout error:", err);
//     }
//   };

//   /* -------------------------------------------------------------------------- */
//   /* 5. VOICE SEARCH                                                            */
//   /* -------------------------------------------------------------------------- */

//   const startListening = () => {
//     if (!window.webkitSpeechRecognition && !window.SpeechRecognition) {
//       alert("Voice search not supported in this browser");
//       return;
//     }

//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     recognitionRef.current = new SpeechRecognition();
//     recognitionRef.current.continuous = false;
//     recognitionRef.current.interimResults = false;
//     recognitionRef.current.lang = 'en-IN';

//     recognitionRef.current.onstart = () => setListening(true);
//     recognitionRef.current.onresult = (e) => {
//       const transcript = e.results[0][0].transcript;
//       setSearchText(transcript);
//       saveToRecentSearches(transcript);
//       setListening(false);
//       setTimeout(() => handleSearchSubmit(), 500);
//     };
//     recognitionRef.current.onerror = () => setListening(false);
//     recognitionRef.current.onend = () => setListening(false);

//     recognitionRef.current.start();
//   };

//   /* -------------------------------------------------------------------------- */
//   /* 6. RENDER HELPERS                                                          */
//   /* -------------------------------------------------------------------------- */

//   const getDiscount = (p) => {
//     if (p.originalPrice > p.price) {
//       return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
//     }
//     return 0;
//   };

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

//   /* -------------------------------------------------------------------------- */
//   /* 7. MAIN RENDER                                                             */
//   /* -------------------------------------------------------------------------- */

//   return (
//     <>
//       {/* Mobile Search Overlay */}
//       {(isMobile || isTablet) && showMobileSearch && (
//         <div className="mobile-search-overlay">
//           <div className="mobile-search-header">
//             <FaArrowLeft className="mobile-search-back" onClick={() => setShowMobileSearch(false)} />
//             <form onSubmit={handleSearchSubmit} className="mobile-search-input-container">
//               <FaSearch className="mobile-search-icon" />
//               <input className="w-100 border-0 bg-transparent page-title-main-name"
//                 ref={searchInputRef}
//                 type="text"
//                 placeholder="Search products, brands..."
//                 value={searchText}
//                 onChange={handleInputChange}
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
//                       {recentSearches.map((search, i) => (
//                         <div key={i} onClick={() => handleRecentSearchClick(search)} className="mobile-search-tag">
//                           {search}
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
//                       {popularSearches.map((search, i) => (
//                         <div key={i} onClick={() => handleRecentSearchClick(search)} className="mobile-search-tag popular">
//                           {search}
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

//       <header className="header d-block">
//         <div className="d-flex justify-content-between margin-padding-header align-items-center">
//           {/* Logo */}
//           <Link to="/" className="logo" onClick={closeMenu}>
//             <img src={logo} className="ps-sm-0 ps-4 ms-sm-0" alt="JOYORY Logo" />
//           </Link>

//           {/* Mobile Menu Toggle */}
//           {(isMobile || isTablet) && (
//             <div className="menu-toggle" onClick={() => setMenuOpen(true)}>
//               <img src={menu} alt="Image-Not-Found" />
//             </div>
//           )}

//           {/* Mobile Icons */}
//           {(isMobile || isTablet) && !showMobileSearch && (
//             <div className="nav-icons user-dropdown gap-3 d-md-flex d-lg-none d-flex">
//               <div className="mobile-search-icon-wrapper" onClick={() => setShowMobileSearch(true)}>
//                 <img src={search} alt="Image-Not-Found" />
//               </div>
//               <Link to="/cartpage" className="mobile-cart-icon">
//                 <img src={Cart} alt="Image-Not-Found" />
//                 {cartCount > 0 && <span className="cart-count page-title-main-name">{cartCount > 99 ? '99+' : cartCount}</span>}
//               </Link>
//             </div>
//           )}

//           {/* Navigation */}
//           <nav className={`nav-links ${menuOpen ? "active" : ""}`} ref={mobileMenuRef}>
//             {(isMobile || isTablet) && (
//               <div className="mobile-menu-header">
//                 <div className="mobile-menu-logo">
//                   <img src={logo} alt="JOYORY Logo" />
//                 </div>
//                 <div className="menu-close" onClick={closeMenu}>
//                   <FaTimes size={22} />
//                 </div>
//               </div>
//             )}

//             <div className="nav-links-container w-100">
//               {/* 🔥 UNCOMMENTED: HOME LINK (Mobile) */}
//               <div className="border-top-bottom">
//                 <Link to="/" onClick={closeMenu} className="nav-link d-flex ms-3 page-title-main-name margin-top-home">
//                   Home
//                 </Link>
//               </div>

//               {/* Desktop Categories Dropdown – commented out (using HeaderCategories component) */}
//               {/* {!isMobile && !isTablet && ( ... )} */}

//               {/* 🔥 UNCOMMENTED: MOBILE CATEGORIES (exactly as in top code) */}
//               {(isMobile || isTablet) && (
//                 <div className="mobile-categories border-top-bottom">
//                   <div className="mobile-category-header page-title-main-name" onClick={() => toggleMobileCategory('all')}>
//                     Categories <FaAngleDown className={mobileCategoriesOpen['all'] ? 'open' : ''} />
//                   </div>
//                   {mobileCategoriesOpen['all'] && categories.map((cat) => (
//                     <div key={cat._id} className="mobile-category-item">
//                       <div className="mobile-category-main" onClick={() => toggleMobileCategory(cat._id)}>
//                         <Link to={`/category/${cat.slug}`} onClick={closeMenu} className="mobile-category-name page-title-main-name">
//                           {cat.name}
//                         </Link>
//                         {cat.subCategories?.length > 0 && <FaAngleDown className={mobileCategoriesOpen[cat._id] ? 'open' : ''} />}
//                       </div>
//                       {mobileCategoriesOpen[cat._id] && renderMobileSubCategories(cat.subCategories)}
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* 🔥 UNCOMMENTED: SHADE FINDER LINK (Mobile) */}
//               <div className="border-top-bottom mobile-category-header">
//                 <Link to="/FoundationShadeFinder" onClick={closeMenu} className="mt-1 pb-1 page-title-main-name shadefinder-name-mobile-tabalte">
//                   Shade Finder
//                 </Link>
//               </div>

//               {/* Mobile User Links */}
//               {(isMobile || isTablet) && (
//                 <>
//                   <div className="border-top-bottom page-title-main-name">
//                     <Link to="/useraccount" onClick={closeMenu} className="nav-link mobile-profile-link ms-3 d-flex mt-1 pb-1">
//                       My Account
//                     </Link>
//                   </div>
//                   <div className="border-top-bottom page-title-main-name">
//                     <Link to="/Myorders" onClick={closeMenu} className="nav-link ms-3 d-flex mt-1 pb-1">
//                       My Orders
//                     </Link>
//                   </div>
//                   <div>
//                     {user && !user.guest ? (
//                       <div onClick={handleLogout} className="nav-link logout-link ms-3 d-flex mt-1 pb-1 page-title-main-name">
//                         Logout
//                       </div>
//                     ) : (
//                       <Link to="/login" onClick={closeMenu} className="nav-link ms-3 d-flex mt-1 pb-1 page-title-main-name">
//                         Login
//                       </Link>
//                     )}
//                   </div>
//                 </>
//               )}

//               {/* Desktop Search */}
//               {!isMobile && !isTablet && (
//                 <div className="search-box d-flex page-title-main-name" ref={headerSearchRef} style={{ position: "relative", zIndex: 999 }}>
//                   <form onSubmit={handleSearchSubmit} style={{ display: "flex", width: "100%", alignItems: "center" }}>
//                     <img src={search} alt="Image-Not-Found" onClick={handleSearchSubmit} />
//                     <input
//                       ref={searchInputRef}
//                       type="text"
//                       placeholder="Search products, brands, categories..."
//                       value={searchText}
//                       onChange={handleInputChange}
//                       onFocus={() => setShowSearchResults(true)}
//                       style={{ border: "none", outline: "none", background: "transparent", flex: 1, margin: "0 10px" }}
//                     />
//                     {searchText && <FaTimes style={{ cursor: "pointer", marginRight: "10px" }} onClick={clearSearch} />}
//                     <img src={mic} className={`icon ${listening ? "listening" : ""}`} onClick={startListening} alt="Image-Not-Found" />
//                   </form>

//                   {/* Desktop Search Dropdown */}
//                   {showSearchResults && (
//                     <div className="search-results-dropdown" style={{
//                       position: "absolute",
//                       top: "calc(100% + 5px)",
//                       left: 0,
//                       right: 0,
//                       background: "white",
//                       border: "1px solid #ddd",
//                       borderRadius: "8px",
//                       boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
//                       maxHeight: "500px",
//                       overflowY: "auto",
//                       zIndex: 1000
//                     }}>
//                       {/* ... (search results code unchanged) ... */}
//                       {!searchText.trim() ? (
//                         <div style={{ padding: "15px" }}>
//                           {recentSearches.length > 0 && (
//                             <div style={{ marginBottom: "15px" }}>
//                               <div style={{ fontSize: "12px", fontWeight: "600", color: "#666", marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
//                                 <span>Recent Searches</span>
//                                 <button onClick={clearRecentSearches} style={{ background: "none", border: "none", color: "#0077b6", cursor: "pointer", fontSize: "11px" }}>Clear</button>
//                               </div>
//                               <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
//                                 {recentSearches.map((s, i) => (
//                                   <span key={i} onClick={() => handleRecentSearchClick(s)} style={{ padding: "4px 12px", background: "#f0f0f0", borderRadius: "15px", fontSize: "12px", cursor: "pointer" }}>
//                                     {s}
//                                   </span>
//                                 ))}
//                               </div>
//                             </div>
//                           )}
//                           <div style={{ fontSize: "12px", fontWeight: "600", color: "#666", marginBottom: "8px" }}>Popular</div>
//                           <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
//                             {popularSearches.map((s, i) => (
//                               <span key={i} onClick={() => handleRecentSearchClick(s)} style={{ padding: "4px 12px", background: "#e6f7ff", color: "#0077b6", borderRadius: "15px", fontSize: "12px", cursor: "pointer" }}>
//                                 {s}
//                               </span>
//                             ))}
//                           </div>
//                         </div>
//                       ) : searchResults.length > 0 ? (
//                         <div>
//                           {searchResults.map((item) => {
//                             const discount = getDiscount(item);
//                             return (
//                               <div key={item._id} onClick={() => handleResultClick(item)} style={{
//                                 display: "flex",
//                                 padding: "10px",
//                                 borderBottom: "1px solid #f5f5f5",
//                                 cursor: "pointer",
//                                 hover: { background: "#f8f9fa" }
//                               }}>
//                                 <img src={item.image} alt={item.name} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px", marginRight: "10px" }} />
//                                 <div style={{ flex: 1 }}>
//                                   <div style={{ fontWeight: "600", fontSize: "13px" }}>{item.name}</div>
//                                   <div style={{ fontSize: "11px", color: "#666" }}>{item.brand}</div>
//                                   <div style={{ fontSize: "13px", color: "#0077b6", fontWeight: "600" }}>
//                                     ₹{item.price}
//                                     {discount > 0 && <span style={{ textDecoration: "line-through", color: "#999", marginLeft: "8px", fontSize: "11px" }}>₹{item.originalPrice}</span>}
//                                   </div>
//                                 </div>
//                               </div>
//                             );
//                           })}
//                           <div onClick={handleSearchSubmit} style={{ padding: "12px", textAlign: "center", background: "#f8f9fa", cursor: "pointer", color: "#0077b6", fontWeight: "600", fontSize: "13px" }}>
//                             View all {searchResults.length} results →
//                           </div>
//                         </div>
//                       ) : (
//                         <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
//                           No results for "{searchText}"
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Desktop Icons */}
//               {!isMobile && !isTablet && (
//                 <div className="nav-icons user-dropdown gap-3 d-none d-lg-flex page-title-main-name" style={{ alignItems: "center", marginLeft: "auto" }}>
//                   <Link to="/cartpage" style={{ position: "relative" }}>
//                     <img src={Cart} alt="Image-Not-Found" />
//                     {cartCount > 0 && <span style={{ position: "absolute", top: "-8px", right: "-8px", background: "#0077b6", color: "white", borderRadius: "50%", width: "18px", height: "18px", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>}
//                   </Link>
//                   <Link to="/wishlist">
//                     <img src={favourite} alt="Image-Not-Found" />
//                   </Link>
//                   <div style={{ position: "relative", cursor: "pointer" }} onClick={() => setUserDropdown(!userDropdown)}>
//                     <img src={users} className="icon" alt="Image-Not-Found" />
//                     {userDropdown && (
//                       <div style={{ position: "absolute", top: "100%", right: 0, background: "white", border: "1px solid #ddd", borderRadius: "8px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", zIndex: 1000, minWidth: "180px", marginTop: "5px" }}>
//                         {user && !user.guest ? (
//                           <>
//                             <div onClick={() => { navigate("/useraccount"); setUserDropdown(false); }} style={{ padding: "10px 15px", borderBottom: "1px solid #eee", cursor: "pointer" }}>My Account</div>
//                             <div onClick={() => { navigate("/Myorders"); setUserDropdown(false); }} style={{ padding: "10px 15px", borderBottom: "1px solid #eee", cursor: "pointer" }}>My Orders</div>
//                             <div onClick={() => { handleLogout(); setUserDropdown(false); }} style={{ padding: "10px 15px", cursor: "pointer" }}>Logout</div>
//                           </>
//                         ) : (
//                           <>
//                             <div onClick={() => { navigate("/login"); setUserDropdown(false); }} style={{ padding: "10px 15px", borderBottom: "1px solid #eee", cursor: "pointer" }}>Login</div>
//                             <div onClick={() => { navigate("/Signup"); setUserDropdown(false); }} style={{ padding: "10px 15px", cursor: "pointer" }}>Register</div>
//                           </>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </nav>
//         </div>















//         {/* Second Header – Desktop Categories */}
//         <HeaderCategories />


//       </header>



//               {/* Mobile Footer Navigation */}
//             {(isMobile || isTablet) && (
//               <div className="mobile-footer-navigation  w-100">
//                 <Link to="/" onClick={closeMenu} className="mobile-footer-nav-item">
//                   <img src={home} alt="Home-Image-Not-Found" />
//                   <div className="mobile-footer-nav-label page-title-main-name">Home</div>
//                 </Link>
//                 <Link to="/wishlist" onClick={closeMenu} className="mobile-footer-nav-item">
//                   <img src={favourite} alt="Wishlist-Image-Not-Found" />
//                   <div className="mobile-footer-nav-label page-title-main-name">Wishlist</div>
//                 </Link>
//                 <Link to="/cartpage" onClick={closeMenu} className="mobile-footer-nav-item">
//                   <img src={Cart} alt="Cart-Image-Not-Found" />
//                   <div className="mobile-footer-nav-label page-title-main-name">Cart</div>
//                   {cartCount > 0 && <div className="mobile-footer-cart-count">{cartCount > 9 ? '9+' : cartCount}</div>}
//                 </Link>
//                 <Link to="/useraccount" onClick={closeMenu} className="mobile-footer-nav-item">
//                   <img src={users} alt="Profile-Image-Not-Found" />
//                   <div className="mobile-footer-nav-label page-title-main-name">Profile</div>
//                 </Link>
//               </div>
//             )}
//     </>
//   );
// };

// export default Header;












// import React, { useState, useEffect, useMemo, useRef, useCallback, useContext } from "react";
// import { FaTimes, FaMicrophone } from "react-icons/fa";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import "../css/Header/Header.css";
// import "../App.css";
// import logo from "../assets/logo.png";
// import Cart from "../assets/Cart.svg";
// import favourite from "../assets/favourite.svg";
// import users from "../assets/user.svg";
// import mic from "../assets/mic.svg";
// import search from "../assets/search.svg";
// import axiosInstance from "../utils/axiosInstance.js";
// import { UserContext } from "./UserContext";
// import HeaderCategories from "../component/HeaderCategories";
// import MobileHeader from "./Mobileheaderview"; // 👈 new mobile component

// const Header = (props) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user, logoutUser } = useContext(UserContext);

//   // ---------- shared responsive state ----------
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
//   const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024 && window.innerWidth > 768);
//   const [menuOpen, setMenuOpen] = useState(false); // mobile drawer

//   // ---------- cart ----------
//   const [cartCount, setCartCount] = useState(0);

//   // ---------- search (used by both desktop & mobile) ----------
//   const [searchText, setSearchText] = useState("");
//   const [debouncedSearchText, setDebouncedSearchText] = useState("");
//   const [allProducts, setAllProducts] = useState([]);
//   const [searchIndex, setSearchIndex] = useState([]);
//   const [searchResults, setSearchResults] = useState([]);
//   const [showSearchResults, setShowSearchResults] = useState(false);
//   const [isSearchLoading, setIsSearchLoading] = useState(false);
//   const [recentSearches, setRecentSearches] = useState([]);
//   const [popularSearches, setPopularSearches] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [listening, setListening] = useState(false);
//   const [userDropdown, setUserDropdown] = useState(false);

//   const searchTimeoutRef = useRef(null);
//   const recognitionRef = useRef(null);
//   const searchInputRef = useRef(null);
//   const headerSearchRef = useRef(null);
//   const hasFetchedProducts = useRef(false);

//   // ---------- responsive resize ----------
//   useEffect(() => {
//     const handleResize = () => {
//       const width = window.innerWidth;
//       setIsMobile(width <= 768);
//       setIsTablet(width <= 1024 && width > 768);
//       if (width > 768) setMenuOpen(false);
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // ---------- load recent searches ----------
//   useEffect(() => {
//     const saved = localStorage.getItem("recentSearches");
//     if (saved) {
//       try {
//         setRecentSearches(JSON.parse(saved));
//       } catch (e) {
//         console.error("Error loading recent searches:", e);
//       }
//     }
//   }, []);

//   // ---------- fetch products & categories ----------
//   useEffect(() => {
//     if (hasFetchedProducts.current) return;

//     const fetchData = async () => {
//       try {
//         setIsSearchLoading(true);
//         const catRes = await axiosInstance.get("/api/user/categories/tree");
//         setCategories(Array.isArray(catRes.data) ? catRes.data : catRes.data.categories || []);

//         const res = await axiosInstance.get("/api/user/products/all");
//         let products = [];
//         if (res.data.products && Array.isArray(res.data.products)) products = res.data.products;
//         else if (Array.isArray(res.data)) products = res.data;

//         const processed = products.map(p => ({
//           _id: p._id || p.id,
//           name: p.name || p.title || "Unnamed Product",
//           slug: p.slugs?.[0] || p.slug || p._id,
//           brand: p.brand?.name || (typeof p.brand === 'string' ? p.brand : ""),
//           category: p.category?.name || (typeof p.category === 'string' ? p.category : ""),
//           price: p.selectedVariant?.displayPrice || p.price || 0,
//           originalPrice: p.selectedVariant?.originalPrice || p.originalPrice || 0,
//           discountPercent: p.selectedVariant?.discountPercent || 0,
//           image: p.selectedVariant?.images?.[0] || p.images?.[0] || "/placeholder.png",
//           inStock: p.inStock !== false && p.status !== "outOfStock",
//           rating: p.rating || 0,
//           reviewCount: p.reviewCount || 0,
//           description: p.description || "",
//           variants: p.variants || []
//         }));

//         setAllProducts(processed);
//         const index = processed.map(p => ({
//           product: p,
//           searchString: [p.name, p.brand, p.category, ...(p.variants?.map(v => v.shadeName) || [])]
//             .filter(Boolean).join(' ').toLowerCase()
//         }));
//         setSearchIndex(index);
//         hasFetchedProducts.current = true;
//         extractPopularSearches(processed);
//       } catch (err) {
//         console.error("Error fetching products:", err);
//       } finally {
//         setIsSearchLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   // ---------- cart count ----------
//   useEffect(() => {
//     const fetchCart = async () => {
//       if (!user || user.guest) { setCartCount(0); return; }
//       try {
//         const res = await axiosInstance.get("/api/user/cart/summary", { withCredentials: true });
//         const count = res.data?.cart?.length || res.data?.items?.length || res.data?.count || 0;
//         setCartCount(count);
//       } catch (err) {
//         console.error("Cart fetch error:", err);
//         setCartCount(0);
//       }
//     };
//     fetchCart();
//     const interval = setInterval(fetchCart, 30000);
//     return () => clearInterval(interval);
//   }, [user]);

//   // ---------- search logic ----------
//   useEffect(() => {
//     if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
//     searchTimeoutRef.current = setTimeout(() => setDebouncedSearchText(searchText), 300);
//     return () => clearTimeout(searchTimeoutRef.current);
//   }, [searchText]);

//   useEffect(() => {
//     if (!debouncedSearchText.trim()) {
//       setSearchResults([]);
//       setShowSearchResults(!!searchText.trim());
//       return;
//     }
//     const term = debouncedSearchText.toLowerCase().trim();
//     const words = term.split(/\s+/);
//     const results = searchIndex
//       .filter(({ searchString }) => words.every(word => searchString.includes(word)))
//       .map(({ product }) => product)
//       .slice(0, 10);
//     setSearchResults(results);
//     setShowSearchResults(true);
//   }, [debouncedSearchText, searchIndex]);

//   const extractPopularSearches = (products) => {
//     const catCounts = {}, brandCounts = {};
//     products.forEach(p => {
//       if (p.category) catCounts[p.category] = (catCounts[p.category] || 0) + 1;
//       if (p.brand) brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
//     });
//     const topCats = Object.entries(catCounts).sort((a,b)=>b[1]-a[1]).slice(0,4).map(x=>x[0]);
//     const topBrands = Object.entries(brandCounts).sort((a,b)=>b[1]-a[1]).slice(0,4).map(x=>x[0]);
//     setPopularSearches([...topCats, ...topBrands]);
//   };

//   // ---------- shared search handlers ----------
//   const saveToRecentSearches = (query) => {
//     if (!query.trim()) return;
//     const updated = [query.trim(), ...recentSearches.filter(s => s.toLowerCase() !== query.trim().toLowerCase())].slice(0,5);
//     setRecentSearches(updated);
//     localStorage.setItem("recentSearches", JSON.stringify(updated));
//   };

//   const handleSearchSubmit = (e) => {
//     e?.preventDefault();
//     if (!searchText.trim()) return;
//     saveToRecentSearches(searchText);
//     setShowSearchResults(false);
//     setMenuOpen(false);
//     navigate(`/search?q=${encodeURIComponent(searchText.trim())}`);
//   };

//   const handleResultClick = (product) => {
//     saveToRecentSearches(product.name);
//     setSearchText("");
//     setShowSearchResults(false);
//     setMenuOpen(false);
//     navigate(`/product/${product.slug}`);
//   };

//   const handleRecentSearchClick = (term) => {
//     setSearchText(term);
//     saveToRecentSearches(term);
//     navigate(`/search?q=${encodeURIComponent(term)}`);
//     setShowSearchResults(false);
//     setMenuOpen(false);
//   };

//   const clearRecentSearches = () => {
//     setRecentSearches([]);
//     localStorage.removeItem("recentSearches");
//   };

//   const clearSearch = () => {
//     setSearchText("");
//     setDebouncedSearchText("");
//     searchInputRef.current?.focus();
//   };

//   // ---------- voice search ----------
//   const startListening = () => {
//     if (!window.webkitSpeechRecognition && !window.SpeechRecognition) {
//       alert("Voice search not supported in this browser");
//       return;
//     }
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     recognitionRef.current = new SpeechRecognition();
//     recognitionRef.current.continuous = false;
//     recognitionRef.current.interimResults = false;
//     recognitionRef.current.lang = 'en-IN';
//     recognitionRef.current.onstart = () => setListening(true);
//     recognitionRef.current.onresult = (e) => {
//       const transcript = e.results[0][0].transcript;
//       setSearchText(transcript);
//       saveToRecentSearches(transcript);
//       setListening(false);
//       setTimeout(() => handleSearchSubmit(), 500);
//     };
//     recognitionRef.current.onerror = () => setListening(false);
//     recognitionRef.current.onend = () => setListening(false);
//     recognitionRef.current.start();
//   };

//   // ---------- close mobile drawer (used by both desktop & mobile) ----------
//   const closeMenu = useCallback(() => {
//     setMenuOpen(false);
//     setShowSearchResults(false);
//   }, []);

//   const getDiscount = (p) => p.originalPrice > p.price ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;

//   // ---------- RENDER ----------
//   if (isMobile || isTablet) {
//     return (
//       <MobileHeader
//         // responsive flags
//         isMobile={isMobile}
//         isTablet={isTablet}
//         // menu state
//         menuOpen={menuOpen}
//         setMenuOpen={setMenuOpen}
//         closeMenu={closeMenu}
//         // user & cart
//         user={user}
//         logoutUser={logoutUser}
//         cartCount={cartCount}
//         // categories for mobile menu
//         categories={categories}
//         // search related
//         searchText={searchText}
//         setSearchText={setSearchText}
//         handleSearchSubmit={handleSearchSubmit}
//         startListening={startListening}
//         listening={listening}
//         searchResults={searchResults}
//         recentSearches={recentSearches}
//         popularSearches={popularSearches}
//         handleResultClick={handleResultClick}
//         handleRecentSearchClick={handleRecentSearchClick}
//         clearRecentSearches={clearRecentSearches}
//         clearSearch={clearSearch}
//         searchInputRef={searchInputRef}
//       />
//     );
//   }

//   // ---------- DESKTOP VIEW ----------
//   return (
//     <>
//       <header className="header d-block">
//         <div className="d-flex justify-content-between margin-padding-header align-items-center">
//           {/* Logo */}
//           <Link to="/" className="logo" onClick={closeMenu}>
//             <img src={logo} className="ps-sm-0 ps-4 ms-sm-0" alt="JOYORY Logo" />
//           </Link>

//           {/* Desktop Search */}
//           <div className="search-box d-flex page-title-main-name ms-auto me-3" ref={headerSearchRef} style={{ position: "relative", zIndex: 999 }}>
//             <form onSubmit={handleSearchSubmit} style={{ display: "flex", width: "100%", alignItems: "center" }}>
//               <img src={search} alt="search" onClick={handleSearchSubmit} />
//               <input
//                 ref={searchInputRef}
//                 type="text"
//                 placeholder="Search products, brands, categories..."
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 onFocus={() => setShowSearchResults(true)}
//                 style={{ border: "none", outline: "none", background: "transparent", flex: 1, margin: "0 10px" }}
//               />
//               {searchText && <FaTimes style={{ cursor: "pointer", marginRight: "10px" }} onClick={clearSearch} />}
//               <img src={mic} className={`icon ${listening ? "listening" : ""}`} onClick={startListening} alt="mic" />
//             </form>

//             {/* Desktop search dropdown */}
//             {showSearchResults && (
//               <div className="search-results-dropdown" style={{ position: "absolute", top: "calc(100% + 5px)", left: 0, right: 0, background: "white", border: "1px solid #ddd", borderRadius: "8px", boxShadow: "0 10px 40px rgba(0,0,0,0.15)", maxHeight: "500px", overflowY: "auto", zIndex: 1000 }}>
//                 {!searchText.trim() ? (
//                   <div style={{ padding: "15px" }}>
//                     {recentSearches.length > 0 && (
//                       <div style={{ marginBottom: "15px" }}>
//                         <div style={{ fontSize: "12px", fontWeight: "600", color: "#666", marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
//                           <span>Recent Searches</span>
//                           <button onClick={clearRecentSearches} style={{ background: "none", border: "none", color: "#0077b6", cursor: "pointer", fontSize: "11px" }}>Clear</button>
//                         </div>
//                         <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
//                           {recentSearches.map((s, i) => (
//                             <span key={i} onClick={() => handleRecentSearchClick(s)} style={{ padding: "4px 12px", background: "#f0f0f0", borderRadius: "15px", fontSize: "12px", cursor: "pointer" }}>{s}</span>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                     <div style={{ fontSize: "12px", fontWeight: "600", color: "#666", marginBottom: "8px" }}>Popular</div>
//                     <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
//                       {popularSearches.map((s, i) => (
//                         <span key={i} onClick={() => handleRecentSearchClick(s)} style={{ padding: "4px 12px", background: "#e6f7ff", color: "#0077b6", borderRadius: "15px", fontSize: "12px", cursor: "pointer" }}>{s}</span>
//                       ))}
//                     </div>
//                   </div>
//                 ) : searchResults.length > 0 ? (
//                   <div>
//                     {searchResults.map((item) => {
//                       const discount = getDiscount(item);
//                       return (
//                         <div key={item._id} onClick={() => handleResultClick(item)} style={{ display: "flex", padding: "10px", borderBottom: "1px solid #f5f5f5", cursor: "pointer" }}>
//                           <img src={item.image} alt={item.name} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px", marginRight: "10px" }} />
//                           <div style={{ flex: 1 }}>
//                             <div style={{ fontWeight: "600", fontSize: "13px" }}>{item.name}</div>
//                             <div style={{ fontSize: "11px", color: "#666" }}>{item.brand}</div>
//                             <div style={{ fontSize: "13px", color: "#0077b6", fontWeight: "600" }}>
//                               ₹{item.price}
//                               {discount > 0 && <span style={{ textDecoration: "line-through", color: "#999", marginLeft: "8px", fontSize: "11px" }}>₹{item.originalPrice}</span>}
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                     <div onClick={handleSearchSubmit} style={{ padding: "12px", textAlign: "center", background: "#f8f9fa", cursor: "pointer", color: "#0077b6", fontWeight: "600", fontSize: "13px" }}>
//                       View all {searchResults.length} results →
//                     </div>
//                   </div>
//                 ) : (
//                   <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>No results for "{searchText}"</div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Desktop Icons */}
//           <div className="nav-icons user-dropdown gap-3 d-none d-lg-flex page-title-main-name" style={{ alignItems: "center"}}>
//             <Link to="/cartpage" style={{ position: "relative" }}>
//               <img src={Cart} alt="cart" />
//               {cartCount > 0 && <span style={{ position: "absolute", top: "-8px", right: "-8px", background: "#0077b6", color: "white", borderRadius: "50%", width: "18px", height: "18px", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>}
//             </Link>
//             <Link to="/wishlist">
//               <img src={favourite} alt="wishlist" />
//             </Link>
//             <div style={{ position: "relative", cursor: "pointer" }} onClick={() => setUserDropdown(!userDropdown)}>
//               <img src={users} className="icon" alt="user" />
//               {userDropdown && (
//                 <div style={{ position: "absolute", top: "100%", right: 0, background: "white", border: "1px solid #ddd", borderRadius: "8px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", zIndex: 1000, minWidth: "180px", marginTop: "5px" }}>
//                   {user && !user.guest ? (
//                     <>
//                       <div onClick={() => { navigate("/useraccount"); setUserDropdown(false); }} style={{ padding: "10px 15px", borderBottom: "1px solid #eee", cursor: "pointer" }}>My Account</div>
//                       <div onClick={() => { navigate("/Myorders"); setUserDropdown(false); }} style={{ padding: "10px 15px", borderBottom: "1px solid #eee", cursor: "pointer" }}>My Orders</div>
//                       <div onClick={() => { logoutUser(); setUserDropdown(false); }} style={{ padding: "10px 15px", cursor: "pointer" }}>Logout</div>
//                     </>
//                   ) : (
//                     <>
//                       <div onClick={() => { navigate("/login"); setUserDropdown(false); }} style={{ padding: "10px 15px", borderBottom: "1px solid #eee", cursor: "pointer" }}>Login</div>
//                       <div onClick={() => { navigate("/Signup"); setUserDropdown(false); }} style={{ padding: "10px 15px", cursor: "pointer" }}>Register</div>
//                     </>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Desktop Categories */}
//         <HeaderCategories />
//       </header>
//     </>
//   );
// };

// export default Header;
























// import React, { useState, useEffect, useRef, useCallback, useContext } from "react";
// import { FaTimes } from "react-icons/fa";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import "../css/Header/Header.css";
// import "../App.css";
// import logo from "../assets/logo.png";
// import Cart from "../assets/Cart.svg";
// import favourite from "../assets/favourite.svg";
// import users from "../assets/user.svg";
// import mic from "../assets/mic.svg";
// import search from "../assets/search.svg";
// import axiosInstance from "../utils/axiosInstance.js";
// import { UserContext } from "./UserContext";
// import HeaderCategories from "../component/HeaderCategories";
// import MobileHeader from "./Mobileheaderview";

// const Header = (props) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user, logoutUser } = useContext(UserContext);

//   // ---------- responsive ----------
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 800); // 👈 threshold changed to 800px
//   const [menuOpen, setMenuOpen] = useState(false);

//   // ---------- cart & wishlist ----------
//   const [cartCount, setCartCount] = useState(0);
//   const [wishlistCount, setWishlistCount] = useState(0);

//   // ---------- search ----------
//   const [searchText, setSearchText] = useState("");
//   const [debouncedSearchText, setDebouncedSearchText] = useState("");
//   const [allProducts, setAllProducts] = useState([]);
//   const [searchIndex, setSearchIndex] = useState([]);
//   const [searchResults, setSearchResults] = useState([]);
//   const [showSearchResults, setShowSearchResults] = useState(false);
//   const [isSearchLoading, setIsSearchLoading] = useState(false);
//   const [recentSearches, setRecentSearches] = useState([]);
//   const [popularSearches, setPopularSearches] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [listening, setListening] = useState(false);
//   const [userDropdown, setUserDropdown] = useState(false);

//   const searchTimeoutRef = useRef(null);
//   const recognitionRef = useRef(null);
//   const searchInputRef = useRef(null);
//   const headerSearchRef = useRef(null);
//   const hasFetchedProducts = useRef(false);

//   // ---------- responsive resize ----------
//   useEffect(() => {
//     const handleResize = () => {
//       const width = window.innerWidth;
//       setIsMobile(width <= 800); // 👈 updated breakpoint
//       if (width > 800) setMenuOpen(false); // close mobile menu when expanding
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // ---------- load recent searches ----------
//   useEffect(() => {
//     const saved = localStorage.getItem("recentSearches");
//     if (saved) {
//       try {
//         setRecentSearches(JSON.parse(saved));
//       } catch (e) {
//         console.error("Error loading recent searches:", e);
//       }
//     }
//   }, []);

//   // ---------- fetch products & categories ----------
//   useEffect(() => {
//     if (hasFetchedProducts.current) return;

//     const fetchData = async () => {
//       try {
//         setIsSearchLoading(true);
//         const catRes = await axiosInstance.get("/api/user/categories/tree");
//         setCategories(Array.isArray(catRes.data) ? catRes.data : catRes.data.categories || []);

//         const res = await axiosInstance.get("/api/user/products/all");
//         let products = [];
//         if (res.data.products && Array.isArray(res.data.products)) products = res.data.products;
//         else if (Array.isArray(res.data)) products = res.data;

//         const processed = products.map(p => ({
//           _id: p._id || p.id,
//           name: p.name || p.title || "Unnamed Product",
//           slug: p.slugs?.[0] || p.slug || p._id,
//           brand: p.brand?.name || (typeof p.brand === 'string' ? p.brand : ""),
//           category: p.category?.name || (typeof p.category === 'string' ? p.category : ""),
//           price: p.selectedVariant?.displayPrice || p.price || 0,
//           originalPrice: p.selectedVariant?.originalPrice || p.originalPrice || 0,
//           discountPercent: p.selectedVariant?.discountPercent || 0,
//           image: p.selectedVariant?.images?.[0] || p.images?.[0] || "/placeholder.png",
//           inStock: p.inStock !== false && p.status !== "outOfStock",
//           rating: p.rating || 0,
//           reviewCount: p.reviewCount || 0,
//           description: p.description || "",
//           variants: p.variants || []
//         }));

//         setAllProducts(processed);
//         const index = processed.map(p => ({
//           product: p,
//           searchString: [p.name, p.brand, p.category, ...(p.variants?.map(v => v.shadeName) || [])]
//             .filter(Boolean).join(' ').toLowerCase()
//         }));
//         setSearchIndex(index);
//         hasFetchedProducts.current = true;
//         extractPopularSearches(processed);
//       } catch (err) {
//         console.error("Error fetching products:", err);
//       } finally {
//         setIsSearchLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   // ---------- cart count ----------
//   useEffect(() => {
//     const fetchCart = async () => {
//       if (!user || user.guest) { setCartCount(0); return; }
//       try {
//         const res = await axiosInstance.get("/api/user/cart/summary", { withCredentials: true });
//         const count = res.data?.cart?.length || res.data?.items?.length || res.data?.count || 0;
//         setCartCount(count);
//       } catch (err) {
//         console.error("Cart fetch error:", err);
//         setCartCount(0);
//       }
//     };
//     fetchCart();
//     const interval = setInterval(fetchCart, 30000);
//     return () => clearInterval(interval);
//   }, [user]);

//   // ---------- wishlist count ----------
//   useEffect(() => {
//     const fetchWishlist = async () => {
//       if (!user || user.guest) {
//         setWishlistCount(0);
//         return;
//       }
//       try {
//         const res = await axiosInstance.get("/api/user/wishlist", { withCredentials: true });
//         let count = 0;
//         if (res.data?.count !== undefined) count = res.data.count;
//         else if (res.data?.items?.length !== undefined) count = res.data.items.length;
//         else if (Array.isArray(res.data)) count = res.data.length;
//         else if (res.data?.wishlist?.length !== undefined) count = res.data.wishlist.length;
//         setWishlistCount(count);
//       } catch (err) {
//         console.error("Wishlist fetch error:", err);
//         setWishlistCount(0);
//       }
//     };

//     fetchWishlist();
//     const interval = setInterval(fetchWishlist, 45000);
//     return () => clearInterval(interval);
//   }, [user]);

//   // ---------- search logic ----------
//   useEffect(() => {
//     if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
//     searchTimeoutRef.current = setTimeout(() => setDebouncedSearchText(searchText), 300);
//     return () => clearTimeout(searchTimeoutRef.current);
//   }, [searchText]);

//   useEffect(() => {
//     if (!debouncedSearchText.trim()) {
//       setSearchResults([]);
//       setShowSearchResults(!!searchText.trim());
//       return;
//     }
//     const term = debouncedSearchText.toLowerCase().trim();
//     const words = term.split(/\s+/);
//     const results = searchIndex
//       .filter(({ searchString }) => words.every(word => searchString.includes(word)))
//       .map(({ product }) => product)
//       .slice(0, 10);
//     setSearchResults(results);
//     setShowSearchResults(true);
//   }, [debouncedSearchText, searchIndex]);

//   const extractPopularSearches = (products) => {
//     const catCounts = {}, brandCounts = {};
//     products.forEach(p => {
//       if (p.category) catCounts[p.category] = (catCounts[p.category] || 0) + 1;
//       if (p.brand) brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
//     });
//     const topCats = Object.entries(catCounts).sort((a,b)=>b[1]-a[1]).slice(0,4).map(x=>x[0]);
//     const topBrands = Object.entries(brandCounts).sort((a,b)=>b[1]-a[1]).slice(0,4).map(x=>x[0]);
//     setPopularSearches([...topCats, ...topBrands]);
//   };

//   // ---------- shared search handlers ----------
//   const saveToRecentSearches = (query) => {
//     if (!query.trim()) return;
//     const updated = [query.trim(), ...recentSearches.filter(s => s.toLowerCase() !== query.trim().toLowerCase())].slice(0,5);
//     setRecentSearches(updated);
//     localStorage.setItem("recentSearches", JSON.stringify(updated));
//   };

//   const handleSearchSubmit = (e) => {
//     e?.preventDefault();
//     if (!searchText.trim()) return;
//     saveToRecentSearches(searchText);
//     setShowSearchResults(false);
//     setMenuOpen(false);
//     navigate(`/search?q=${encodeURIComponent(searchText.trim())}`);
//   };

//   const handleResultClick = (product) => {
//     saveToRecentSearches(product.name);
//     setSearchText("");
//     setShowSearchResults(false);
//     setMenuOpen(false);
//     navigate(`/product/${product.slug}`);
//   };

//   const handleRecentSearchClick = (term) => {
//     setSearchText(term);
//     saveToRecentSearches(term);
//     navigate(`/search?q=${encodeURIComponent(term)}`);
//     setShowSearchResults(false);
//     setMenuOpen(false);
//   };

//   const clearRecentSearches = () => {
//     setRecentSearches([]);
//     localStorage.removeItem("recentSearches");
//   };

//   const clearSearch = () => {
//     setSearchText("");
//     setDebouncedSearchText("");
//     searchInputRef.current?.focus();
//   };

//   // ---------- voice search ----------
//   const startListening = () => {
//     if (!window.webkitSpeechRecognition && !window.SpeechRecognition) {
//       alert("Voice search not supported in this browser");
//       return;
//     }
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     recognitionRef.current = new SpeechRecognition();
//     recognitionRef.current.continuous = false;
//     recognitionRef.current.interimResults = false;
//     recognitionRef.current.lang = 'en-IN';
//     recognitionRef.current.onstart = () => setListening(true);
//     recognitionRef.current.onresult = (e) => {
//       const transcript = e.results[0][0].transcript;
//       setSearchText(transcript);
//       saveToRecentSearches(transcript);
//       setListening(false);
//       setTimeout(() => handleSearchSubmit(), 500);
//     };
//     recognitionRef.current.onerror = () => setListening(false);
//     recognitionRef.current.onend = () => setListening(false);
//     recognitionRef.current.start();
//   };

//   // ---------- close mobile drawer ----------
//   const closeMenu = useCallback(() => {
//     setMenuOpen(false);
//     setShowSearchResults(false);
//   }, []);

//   const getDiscount = (p) => p.originalPrice > p.price ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;

//   // ---------- RENDER ----------
//   // Mobile view (≤800px) – use MobileHeader component
//   if (isMobile) {
//     return (
//       <MobileHeader
//         isMobile={isMobile}
//         isTablet={false}   // we don't need separate tablet state anymore
//         menuOpen={menuOpen}
//         setMenuOpen={setMenuOpen}
//         closeMenu={closeMenu}
//         user={user}
//         logoutUser={logoutUser}
//         cartCount={cartCount}
//         wishlistCount={wishlistCount}
//         categories={categories}
//         searchText={searchText}
//         setSearchText={setSearchText}
//         handleSearchSubmit={handleSearchSubmit}
//         startListening={startListening}
//         listening={listening}
//         searchResults={searchResults}
//         recentSearches={recentSearches}
//         popularSearches={popularSearches}
//         handleResultClick={handleResultClick}
//         handleRecentSearchClick={handleRecentSearchClick}
//         clearRecentSearches={clearRecentSearches}
//         clearSearch={clearSearch}
//         searchInputRef={searchInputRef}
//       />
//     );
//   }

//   // ---------- DESKTOP VIEW (>800px) ----------
//   return (
//     <>
//       <header className="header d-block">
//         <div className="d-flex justify-content-between margin-padding-header align-items-center">
//           {/* Logo */}
//           <Link to="/" className="logo" onClick={closeMenu}>
//             <img src={logo} className="ps-sm-0 ps-4 ms-sm-0" alt="JOYORY Logo" />
//           </Link>

//           {/* Desktop Search */}
//           <div
//             className="search-box d-flex page-title-main-name ms-auto me-3"
//             ref={headerSearchRef}
//             style={{ position: "relative", zIndex: 999 }}
//           >
//             <form onSubmit={handleSearchSubmit} style={{ display: "flex", width: "100%", alignItems: "center" }}>
//               <img src={search} alt="search" onClick={handleSearchSubmit} />
//               <input
//                 ref={searchInputRef}
//                 type="text"
//                 placeholder="Search products, brands, categories..."
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 onFocus={() => setShowSearchResults(true)}
//                 style={{ border: "none", outline: "none", background: "transparent", flex: 1, margin: "0 10px" }}
//               />
//               {searchText && <FaTimes style={{ cursor: "pointer", marginRight: "10px" }} onClick={clearSearch} />}
//               <img src={mic} className={`icon ${listening ? "listening" : ""}`} onClick={startListening} alt="mic" />
//             </form>

//             {/* Desktop search dropdown – unchanged */}
//             {showSearchResults && (
//               <div className="search-results-dropdown" style={{ position: "absolute", top: "calc(100% + 5px)", left: 0, right: 0, background: "white", border: "1px solid #ddd", borderRadius: "8px", boxShadow: "0 10px 40px rgba(0,0,0,0.15)", maxHeight: "500px", overflowY: "auto", zIndex: 1000 }}>
//                 {!searchText.trim() ? (
//                   <div style={{ padding: "15px" }}>
//                     {recentSearches.length > 0 && (
//                       <div style={{ marginBottom: "15px" }}>
//                         <div style={{ fontSize: "12px", fontWeight: "600", color: "#666", marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
//                           <span>Recent Searches</span>
//                           <button onClick={clearRecentSearches} style={{ background: "none", border: "none", color: "#0077b6", cursor: "pointer", fontSize: "11px" }}>Clear</button>
//                         </div>
//                         <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
//                           {recentSearches.map((s, i) => (
//                             <span key={i} onClick={() => handleRecentSearchClick(s)} style={{ padding: "4px 12px", background: "#f0f0f0", borderRadius: "15px", fontSize: "12px", cursor: "pointer" }}>{s}</span>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                     <div style={{ fontSize: "12px", fontWeight: "600", color: "#666", marginBottom: "8px" }}>Popular</div>
//                     <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
//                       {popularSearches.map((s, i) => (
//                         <span key={i} onClick={() => handleRecentSearchClick(s)} style={{ padding: "4px 12px", background: "#e6f7ff", color: "#0077b6", borderRadius: "15px", fontSize: "12px", cursor: "pointer" }}>{s}</span>
//                       ))}
//                     </div>
//                   </div>
//                 ) : searchResults.length > 0 ? (
//                   <div>
//                     {searchResults.map((item) => {
//                       const discount = getDiscount(item);
//                       return (
//                         <div key={item._id} onClick={() => handleResultClick(item)} style={{ display: "flex", padding: "10px", borderBottom: "1px solid #f5f5f5", cursor: "pointer" }}>
//                           <img src={item.image} alt={item.name} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px", marginRight: "10px" }} />
//                           <div style={{ flex: 1 }}>
//                             <div style={{ fontWeight: "600", fontSize: "13px" }}>{item.name}</div>
//                             <div style={{ fontSize: "11px", color: "#666" }}>{item.brand}</div>
//                             <div style={{ fontSize: "13px", color: "#0077b6", fontWeight: "600" }}>
//                               ₹{item.price}
//                               {discount > 0 && <span style={{ textDecoration: "line-through", color: "#999", marginLeft: "8px", fontSize: "11px" }}>₹{item.originalPrice}</span>}
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                     <div onClick={handleSearchSubmit} style={{ padding: "12px", textAlign: "center", background: "#f8f9fa", cursor: "pointer", color: "#0077b6", fontWeight: "600", fontSize: "13px" }}>
//                       View all {searchResults.length} results →
//                     </div>
//                   </div>
//                 ) : (
//                   <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>No results for "{searchText}"</div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Desktop Icons */}
//           <div className="nav-icons user-dropdown gap-3 d-none d-lg-flex page-title-main-name" style={{ alignItems: "center" }}>
//             <Link to="/cartpage" style={{ position: "relative" }}>
//               <img src={Cart} alt="cart" />
//               {cartCount > 0 && (
//                 <span style={{
//                   position: "absolute",
//                   top: "-8px",
//                   right: "-8px",
//                   background: "#0077b6",
//                   color: "white",
//                   borderRadius: "50%",
//                   width: "18px",
//                   height: "18px",
//                   fontSize: "10px",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center"
//                 }}>
//                   {cartCount}
//                 </span>
//               )}
//             </Link>

//             <Link to="/wishlist" style={{ position: "relative" }}>
//               <img src={favourite} alt="wishlist" />
//               {wishlistCount > 0 && (
//                 <span style={{
//                   position: "absolute",
//                   top: "-8px",
//                   right: "-8px",
//                   background: "#d81e5b",
//                   color: "white",
//                   borderRadius: "50%",
//                   width: "18px",
//                   height: "18px",
//                   fontSize: "10px",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center"
//                 }}>
//                   {wishlistCount}
//                 </span>
//               )}
//             </Link>

//             <div style={{ position: "relative", cursor: "pointer" }} onClick={() => setUserDropdown(!userDropdown)}>
//               <img src={users} className="icon" alt="user" />
//               {userDropdown && (
//                 <div style={{ position: "absolute", top: "100%", right: 0, background: "white", border: "1px solid #ddd", borderRadius: "8px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", zIndex: 1000, minWidth: "180px", marginTop: "5px" }}>
//                   {user && !user.guest ? (
//                     <>
//                       <div onClick={() => { navigate("/useraccount"); setUserDropdown(false); }} style={{ padding: "10px 15px", borderBottom: "1px solid #eee", cursor: "pointer" }}>My Account</div>
//                       <div onClick={() => { navigate("/Myorders"); setUserDropdown(false); }} style={{ padding: "10px 15px", borderBottom: "1px solid #eee", cursor: "pointer" }}>My Orders</div>
//                       <div onClick={() => { logoutUser(); setUserDropdown(false); }} style={{ padding: "10px 15px", cursor: "pointer" }}>Logout</div>
//                     </>
//                   ) : (
//                     <>
//                       <div onClick={() => { navigate("/login"); setUserDropdown(false); }} style={{ padding: "10px 15px", borderBottom: "1px solid #eee", cursor: "pointer" }}>Login</div>
//                       <div onClick={() => { navigate("/Signup"); setUserDropdown(false); }} style={{ padding: "10px 15px", cursor: "pointer" }}>Register</div>
//                     </>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Desktop Categories */}
//         <HeaderCategories />
//       </header>
//     </>
//   );
// };

// export default Header;
























// import React, { useState, useEffect, useRef, useCallback, useContext } from "react";
// import { FaTimes } from "react-icons/fa";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import "../css/Header/Header.css";
// import "../App.css";
// import logo from "../assets/logo.png";
// import Cart from "../assets/Cart.svg";
// import favourite from "../assets/favourite.svg";
// import users from "../assets/user.svg";
// import mic from "../assets/mic.svg";
// import search from "../assets/search.svg";
// import axiosInstance from "../utils/axiosInstance.js";
// import { UserContext } from "./UserContext";
// import HeaderCategories from "../component/HeaderCategories";
// import MobileHeader from "./Mobileheaderview";

// const Header = (props) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user, logoutUser } = useContext(UserContext);

//   // ---------- responsive ----------
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 800);
//   const [menuOpen, setMenuOpen] = useState(false);


//   const [showLogoutModal, setShowLogoutModal] = useState(false);

//   // ---------- search bar animation state ----------
//   const [showMobileSearch, setShowMobileSearch] = useState(false);

//   // ---------- cart & wishlist ----------
//   const [cartCount, setCartCount] = useState(0);
//   const [wishlistCount, setWishlistCount] = useState(0);

//   // ---------- search ----------
//   const [searchText, setSearchText] = useState("");
//   const [debouncedSearchText, setDebouncedSearchText] = useState("");
//   const [allProducts, setAllProducts] = useState([]);
//   const [searchIndex, setSearchIndex] = useState([]);
//   const [searchResults, setSearchResults] = useState([]);
//   const [showSearchResults, setShowSearchResults] = useState(false);
//   const [isSearchLoading, setIsSearchLoading] = useState(false);
//   const [recentSearches, setRecentSearches] = useState([]);
//   const [popularSearches, setPopularSearches] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [listening, setListening] = useState(false);
//   const [userDropdown, setUserDropdown] = useState(false);

//   const searchTimeoutRef = useRef(null);
//   const recognitionRef = useRef(null);
//   const searchInputRef = useRef(null);
//   const headerSearchRef = useRef(null);
//   const hasFetchedProducts = useRef(false);
//   const mobileSearchInputRef = useRef(null);



//   const confirmLogout = () => {
//     logoutUser();
//     setShowLogoutModal(false);
//     navigate("/login");
//   };


//   // ---------- responsive resize ----------
//   useEffect(() => {
//     const handleResize = () => {
//       const width = window.innerWidth;
//       setIsMobile(width <= 800);
//       if (width > 800) {
//         setMenuOpen(false);
//         setShowMobileSearch(false);
//       }
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Focus mobile search input when shown
//   useEffect(() => {
//     if (showMobileSearch && mobileSearchInputRef.current) {
//       setTimeout(() => mobileSearchInputRef.current.focus(), 300);
//     }
//   }, [showMobileSearch]);

//   // ---------- load recent searches ----------
//   useEffect(() => {
//     const saved = localStorage.getItem("recentSearches");
//     if (saved) {
//       try {
//         setRecentSearches(JSON.parse(saved));
//       } catch (e) {
//         console.error("Error loading recent searches:", e);
//       }
//     }
//   }, []);

//   // ---------- fetch products & categories ----------
//   useEffect(() => {
//     if (hasFetchedProducts.current) return;

//     const fetchData = async () => {
//       try {
//         setIsSearchLoading(true);
//         // const catRes = await axiosInstance.get("/api/user/categories/tree");
//         const catRes = await axiosInstance.get("/api/user/categories/tree");
//         setCategories(Array.isArray(catRes.data) ? catRes.data : catRes.data.categories || []);

//         const res = await axiosInstance.get("/api/user/products/all");
//         let products = [];
//         if (res.data.products && Array.isArray(res.data.products)) products = res.data.products;
//         else if (Array.isArray(res.data)) products = res.data;

//         const processed = products.map(p => ({
//           _id: p._id || p.id,
//           name: p.name || p.title || "Unnamed Product",
//           slug: p.slugs?.[0] || p.slug || p._id,
//           brand: p.brand?.name || (typeof p.brand === 'string' ? p.brand : ""),
//           category: p.category?.name || (typeof p.category === 'string' ? p.category : ""),
//           price: p.selectedVariant?.displayPrice || p.price || 0,
//           originalPrice: p.selectedVariant?.originalPrice || p.originalPrice || 0,
//           discountPercent: p.selectedVariant?.discountPercent || 0,
//           image: p.selectedVariant?.images?.[0] || p.images?.[0] || "/placeholder.png",
//           inStock: p.inStock !== false && p.status !== "outOfStock",
//           rating: p.rating || 0,
//           reviewCount: p.reviewCount || 0,
//           description: p.description || "",
//           variants: p.variants || []
//         }));

//         setAllProducts(processed);
//         const index = processed.map(p => ({
//           product: p,
//           searchString: [p.name, p.brand, p.category, ...(p.variants?.map(v => v.shadeName) || [])]
//             .filter(Boolean).join(' ').toLowerCase()
//         }));
//         setSearchIndex(index);
//         hasFetchedProducts.current = true;
//         extractPopularSearches(processed);
//       } catch (err) {
//         console.error("Error fetching products:", err);
//       } finally {
//         setIsSearchLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   // ---------- cart count ----------
//   useEffect(() => {
//     const fetchCart = async () => {
//       if (!user || user.guest) { setCartCount(0); return; }
//       try {
//         const res = await axiosInstance.get("/api/user/cart/summary", { withCredentials: true });
//         const count = res.data?.cart?.length || res.data?.items?.length || res.data?.count || 0;
//         setCartCount(count);
//       } catch (err) {
//         console.error("Cart fetch error:", err);
//         setCartCount(0);
//       }
//     };
//     fetchCart();
//     const interval = setInterval(fetchCart, 30000);
//     return () => clearInterval(interval);
//   }, [user]);

//   // ---------- wishlist count ----------
//   useEffect(() => {
//     const fetchWishlist = async () => {
//       if (!user || user.guest) {
//         setWishlistCount(0);
//         return;
//       }
//       try {
//         const res = await axiosInstance.get("/api/user/wishlist", { withCredentials: true });
//         let count = 0;
//         if (res.data?.count !== undefined) count = res.data.count;
//         else if (res.data?.items?.length !== undefined) count = res.data.items.length;
//         else if (Array.isArray(res.data)) count = res.data.length;
//         else if (res.data?.wishlist?.length !== undefined) count = res.data.wishlist.length;
//         setWishlistCount(count);
//       } catch (err) {
//         console.error("Wishlist fetch error:", err);
//         setWishlistCount(0);
//       }
//     };

//     fetchWishlist();
//     const interval = setInterval(fetchWishlist, 45000);
//     return () => clearInterval(interval);
//   }, [user]);

//   // ---------- search logic ----------
//   useEffect(() => {
//     if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
//     searchTimeoutRef.current = setTimeout(() => setDebouncedSearchText(searchText), 300);
//     return () => clearTimeout(searchTimeoutRef.current);
//   }, [searchText]);

//   useEffect(() => {
//     if (!debouncedSearchText.trim()) {
//       setSearchResults([]);
//       setShowSearchResults(!!searchText.trim());
//       return;
//     }
//     const term = debouncedSearchText.toLowerCase().trim();
//     const words = term.split(/\s+/);
//     const results = searchIndex
//       .filter(({ searchString }) => words.every(word => searchString.includes(word)))
//       .map(({ product }) => product)
//       .slice(0, 10);
//     setSearchResults(results);
//     setShowSearchResults(true);
//   }, [debouncedSearchText, searchIndex]);

//   const extractPopularSearches = (products) => {
//     const catCounts = {}, brandCounts = {};
//     products.forEach(p => {
//       if (p.category) catCounts[p.category] = (catCounts[p.category] || 0) + 1;
//       if (p.brand) brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
//     });
//     const topCats = Object.entries(catCounts).sort((a, b) => b[1] - a[1]).slice(0, 4).map(x => x[0]);
//     const topBrands = Object.entries(brandCounts).sort((a, b) => b[1] - a[1]).slice(0, 4).map(x => x[0]);
//     setPopularSearches([...topCats, ...topBrands]);
//   };

//   // ---------- shared search handlers ----------
//   const saveToRecentSearches = (query) => {
//     if (!query.trim()) return;
//     const updated = [query.trim(), ...recentSearches.filter(s => s.toLowerCase() !== query.trim().toLowerCase())].slice(0, 5);
//     setRecentSearches(updated);
//     localStorage.setItem("recentSearches", JSON.stringify(updated));
//   };

//   const handleSearchSubmit = (e) => {
//     e?.preventDefault();
//     if (!searchText.trim()) return;
//     saveToRecentSearches(searchText);
//     setShowSearchResults(false);
//     setMenuOpen(false);
//     setShowMobileSearch(false);
//     navigate(`/search?q=${encodeURIComponent(searchText.trim())}`);
//   };

//   const handleResultClick = (product) => {
//     saveToRecentSearches(product.name);
//     setSearchText("");
//     setShowSearchResults(false);
//     setMenuOpen(false);
//     setShowMobileSearch(false);
//     navigate(`/product/${product.slug}`);
//   };

//   const handleRecentSearchClick = (term) => {
//     setSearchText(term);
//     saveToRecentSearches(term);
//     navigate(`/search?q=${encodeURIComponent(term)}`);
//     setShowSearchResults(false);
//     setMenuOpen(false);
//     setShowMobileSearch(false);
//   };

//   const clearRecentSearches = () => {
//     setRecentSearches([]);
//     localStorage.removeItem("recentSearches");
//   };

//   const clearSearch = () => {
//     setSearchText("");
//     setDebouncedSearchText("");
//     searchInputRef.current?.focus();
//     mobileSearchInputRef.current?.focus();
//   };

//   // ---------- voice search ----------
//   const startListening = () => {
//     if (!window.webkitSpeechRecognition && !window.SpeechRecognition) {
//       alert("Voice search not supported in this browser");
//       return;
//     }
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     recognitionRef.current = new SpeechRecognition();
//     recognitionRef.current.continuous = false;
//     recognitionRef.current.interimResults = false;
//     recognitionRef.current.lang = 'en-IN';
//     recognitionRef.current.onstart = () => setListening(true);
//     recognitionRef.current.onresult = (e) => {
//       const transcript = e.results[0][0].transcript;
//       setSearchText(transcript);
//       saveToRecentSearches(transcript);
//       setListening(false);
//       setTimeout(() => handleSearchSubmit(), 500);
//     };
//     recognitionRef.current.onerror = () => setListening(false);
//     recognitionRef.current.onend = () => setListening(false);
//     recognitionRef.current.start();
//   };

//   // ---------- close mobile drawer ----------
//   const closeMenu = useCallback(() => {
//     setMenuOpen(false);
//     setShowSearchResults(false);
//   }, []);

//   const getDiscount = (p) => p.originalPrice > p.price ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;

//   // ---------- RENDER ----------
//   // Mobile view (≤800px) – use MobileHeader component with animated search
//   if (isMobile) {
//     return (
//       <>
//         {/* Animated Mobile Search Bar Overlay */}
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             right: 0,
//             background: "white",
//             zIndex: 9999,
//             transform: showMobileSearch ? "translateY(0)" : "translateY(-100%)",
//             opacity: showMobileSearch ? 1 : 0,
//             transition: "transform 0.3s ease-out, opacity 0.3s ease-out",
//             boxShadow: showMobileSearch ? "0 4px 20px rgba(0,0,0,0.15)" : "none",
//             padding: "12px 16px",
//             borderBottom: "1px solid #eee",
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//             <form
//               onSubmit={handleSearchSubmit}
//               style={{
//                 display: "flex",
//                 flex: 1,
//                 alignItems: "center",
//                 background: "#f5f5f5",
//                 borderRadius: "25px",
//                 padding: "0 16px",
//                 height: "44px",
//               }}
//             >
//               <img
//                 src={search}
//                 alt="search"
//                 style={{ width: "18px", height: "18px", marginRight: "10px", opacity: 0.6 }}
//               />
//               <input
//                 ref={mobileSearchInputRef}
//                 type="text"
//                 placeholder="Search products, brands..."
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 onFocus={() => setShowSearchResults(true)}
//                 style={{
//                   border: "none",
//                   outline: "none",
//                   background: "transparent",
//                   flex: 1,
//                   fontSize: "15px",
//                   color: "#333",
//                 }}
//               />
//               {searchText && (
//                 <FaTimes
//                   style={{
//                     cursor: "pointer",
//                     color: "#777",
//                     fontSize: "16px",
//                     marginRight: "10px",
//                   }}
//                   onClick={clearSearch}
//                 />
//               )}
//               <img
//                 src={mic}
//                 className={`icon ${listening ? "listening" : ""}`}
//                 onClick={startListening}
//                 alt="mic"
//                 style={{ width: "20px", height: "20px", cursor: "pointer" }}
//               />
//             </form>
//             <button
//               onClick={() => {
//                 setShowMobileSearch(false);
//                 setShowSearchResults(false);
//               }}
//               style={{
//                 background: "none",
//                 border: "none",
//                 color: "#0077b6",
//                 fontSize: "14px",
//                 fontWeight: "600",
//                 cursor: "pointer",
//                 whiteSpace: "nowrap",
//               }}
//             >
//               Cancel
//             </button>
//           </div>

//           {/* Mobile Search Results Dropdown */}
//           {showSearchResults && showMobileSearch && (
//             <div
//               style={{
//                 position: "absolute",
//                 top: "100%",
//                 left: 0,
//                 right: 0,
//                 background: "white",
//                 maxHeight: "calc(100vh - 70px)",
//                 overflowY: "auto",
//                 borderBottom: "1px solid #eee",
//               }}
//             >
//               {!searchText.trim() ? (
//                 <div style={{ padding: "16px" }}>
//                   {recentSearches.length > 0 && (
//                     <div style={{ marginBottom: "20px" }}>
//                       <div
//                         style={{
//                           fontSize: "12px",
//                           fontWeight: "600",
//                           color: "#666",
//                           marginBottom: "10px",
//                           display: "flex",
//                           justifyContent: "space-between",
//                         }}
//                       >
//                         <span>Recent Searches</span>
//                         <button
//                           onClick={clearRecentSearches}
//                           style={{
//                             background: "none",
//                             border: "none",
//                             color: "#0077b6",
//                             cursor: "pointer",
//                             fontSize: "11px",
//                           }}
//                         >
//                           Clear
//                         </button>
//                       </div>
//                       <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
//                         {recentSearches.map((s, i) => (
//                           <span
//                             key={i}
//                             onClick={() => handleRecentSearchClick(s)}
//                             style={{
//                               padding: "6px 12px",
//                               background: "#f0f0f0",
//                               borderRadius: "16px",
//                               fontSize: "13px",
//                               cursor: "pointer",
//                             }}
//                           >
//                             {s}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                   <div
//                     style={{
//                       fontSize: "12px",
//                       fontWeight: "600",
//                       color: "#666",
//                       marginBottom: "10px",
//                     }}
//                   >
//                     Popular
//                   </div>
//                   <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
//                     {popularSearches.map((s, i) => (
//                       <span
//                         key={i}
//                         onClick={() => handleRecentSearchClick(s)}
//                         style={{
//                           padding: "6px 12px",
//                           background: "#000",
//                           color: "#fff",
//                           borderRadius: "16px",
//                           fontSize: "13px",
//                           cursor: "pointer",
//                         }}
//                       >
//                         {s}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               ) : searchResults.length > 0 ? (
//                 <div>
//                   {searchResults.map((item) => {
//                     const discount = getDiscount(item);
//                     return (
//                       <div
//                         key={item._id}
//                         onClick={() => handleResultClick(item)}
//                         style={{
//                           display: "flex",
//                           padding: "12px 16px",
//                           borderBottom: "1px solid #f5f5f5",
//                           cursor: "pointer",
//                           alignItems: "center",
//                         }}
//                       >
//                         <img
//                           src={item.image}
//                           alt={item.name}
//                           style={{
//                             width: "50px",
//                             height: "50px",
//                             objectFit: "cover",
//                             borderRadius: "6px",
//                             marginRight: "12px",
//                           }}
//                         />
//                         <div style={{ flex: 1 }}>
//                           <div style={{ fontWeight: "600", fontSize: "14px" }}>
//                             {item.name}
//                           </div>
//                           <div style={{ fontSize: "12px", color: "#666" }}>
//                             {item.brand}
//                           </div>
//                           <div
//                             style={{
//                               fontSize: "14px",
//                               color: "#0077b6",
//                               fontWeight: "600",
//                               marginTop: "2px",
//                             }}
//                           >
//                             ₹{item.price}
//                             {discount > 0 && (
//                               <span
//                                 style={{
//                                   textDecoration: "line-through",
//                                   color: "#999",
//                                   marginLeft: "8px",
//                                   fontSize: "12px",
//                                 }}
//                               >
//                                 ₹{item.originalPrice}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                   <div
//                     onClick={handleSearchSubmit}
//                     style={{
//                       padding: "14px",
//                       textAlign: "center",
//                       background: "#f8f9fa",
//                       cursor: "pointer",
//                       color: "#0077b6",
//                       fontWeight: "600",
//                       fontSize: "14px",
//                     }}
//                   >
//                     View all results →
//                   </div>
//                 </div>
//               ) : (
//                 <div
//                   style={{
//                     padding: "30px",
//                     textAlign: "center",
//                     color: "#666",
//                     fontSize: "14px",
//                   }}
//                 >
//                   No results for "{searchText}"
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Backdrop when search is open */}
//         {showMobileSearch && (
//           <div
//             onClick={() => {
//               setShowMobileSearch(false);
//               setShowSearchResults(false);
//             }}
//             style={{
//               position: "fixed",
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               background: "rgba(0,0,0,0.5)",
//               zIndex: 9998,
//               opacity: showMobileSearch ? 1 : 0,
//               transition: "opacity 0.3s ease",
//             }}
//           />
//         )}

//         <MobileHeader
//           isMobile={isMobile}
//           isTablet={false}
//           menuOpen={menuOpen}
//           setMenuOpen={setMenuOpen}
//           closeMenu={closeMenu}
//           user={user}
//           logoutUser={logoutUser}
//           cartCount={cartCount}
//           wishlistCount={wishlistCount}
//           categories={categories}
//           searchText={searchText}
//           setSearchText={setSearchText}
//           handleSearchSubmit={handleSearchSubmit}
//           startListening={startListening}
//           listening={listening}
//           searchResults={searchResults}
//           recentSearches={recentSearches}
//           popularSearches={popularSearches}
//           handleResultClick={handleResultClick}
//           handleRecentSearchClick={handleRecentSearchClick}
//           clearRecentSearches={clearRecentSearches}
//           clearSearch={clearSearch}
//           searchInputRef={searchInputRef}
//           onSearchClick={() => setShowMobileSearch(true)}
//         />
//       </>
//     );
//   }

//   // ---------- DESKTOP VIEW (>800px) ----------
//   return (
//     <>
//       <header className="header d-block">
//         <div className="d-flex justify-content-between margin-padding-header align-items-center">
//           {/* Logo */}
//           <Link to="/" className="logo" onClick={closeMenu}>
//             <img src={logo} className="ps-sm-0 ps-4 ms-sm-0" alt="JOYORY Logo" />
//           </Link>

//           {/* Desktop Search */}
//           {/* <div
//             className="search-box d-flex page-title-main-name ms-auto me-3"
//             ref={headerSearchRef}
//             style={{ position: "relative", zIndex: 999 }}
//           >
//             <form onSubmit={handleSearchSubmit} style={{ display: "flex", width: "100%", alignItems: "center" }}>
//               <img src={search} alt="search" onClick={handleSearchSubmit} />
//               <input
//                 ref={searchInputRef}
//                 type="text"
//                 placeholder="Search products, brands, categories..."
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 onFocus={() => setShowSearchResults(true)}
//                 style={{ border: "none", outline: "none", background: "transparent", flex: 1, margin: "0 10px" }}
//               />
//               {searchText && <FaTimes style={{ cursor: "pointer", marginRight: "10px" }} onClick={clearSearch} />}
//               <img src={mic} className={`icon ${listening ? "listening" : ""}`} onClick={startListening} alt="mic" />
//             </form>

//             { Desktop search dropdown – unchanged }
//             {showSearchResults && (
//               <div className="search-results-dropdown" style={{ position: "absolute", top: "calc(100% + 5px)", left: 0, right: 0, background: "white", border: "1px solid #ddd", borderRadius: "8px", boxShadow: "0 10px 40px rgba(0,0,0,0.15)", maxHeight: "500px", overflowY: "auto", zIndex: 1000 }}>
//                 {!searchText.trim() ? (
//                   <div style={{ padding: "15px" }}>
//                     {recentSearches.length > 0 && (
//                       <div style={{ marginBottom: "15px" }}>
//                         <div style={{ fontSize: "12px", fontWeight: "600", color: "#666", marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
//                           <span>Recent Searches</span>
//                           <button onClick={clearRecentSearches} style={{ background: "none", border: "none", color: "#0077b6", cursor: "pointer", fontSize: "11px" }}>Clear</button>
//                         </div>
//                         <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
//                           {recentSearches.map((s, i) => (
//                             <span key={i} onClick={() => handleRecentSearchClick(s)} style={{ padding: "4px 12px", background: "#f0f0f0", borderRadius: "15px", fontSize: "12px", cursor: "pointer" }}>{s}</span>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                     <div style={{ fontSize: "12px", fontWeight: "600", color: "#666", marginBottom: "8px" }}>Popular</div>
//                     <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
//                       {popularSearches.map((s, i) => (
//                         <span key={i} onClick={() => handleRecentSearchClick(s)} style={{ padding: "4px 12px", background: "#e6f7ff", color: "#0077b6", borderRadius: "15px", fontSize: "12px", cursor: "pointer" }}>{s}</span>
//                       ))}
//                     </div>
//                   </div>
//                 ) : searchResults.length > 0 ? (
//                   <div>
//                     {searchResults.map((item) => {
//                       const discount = getDiscount(item);
//                       return (
//                         <div key={item._id} onClick={() => handleResultClick(item)} style={{ display: "flex", padding: "10px", borderBottom: "1px solid #f5f5f5", cursor: "pointer" }}>
//                           <img src={item.image} alt={item.name} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px", marginRight: "10px" }} />
//                           <div style={{ flex: 1 }}>
//                             <div style={{ fontWeight: "600", fontSize: "13px" }}>{item.name}</div>
//                             <div style={{ fontSize: "11px", color: "#666" }}>{item.brand}</div>
//                             <div style={{ fontSize: "13px", color: "#0077b6", fontWeight: "600" }}>
//                               ₹{item.price}
//                               {discount > 0 && <span style={{ textDecoration: "line-through", color: "#999", marginLeft: "8px", fontSize: "11px" }}>₹{item.originalPrice}</span>}
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                     <div onClick={handleSearchSubmit} style={{ padding: "12px", textAlign: "center", background: "#f8f9fa", cursor: "pointer", color: "#0077b6", fontWeight: "600", fontSize: "13px" }}>
//                       View all {searchResults.length} results →
//                     </div>
//                   </div>
//                 ) : (
//                   <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>No results for "{searchText}"</div>
//                 )}
//               </div>
//             )}
//           </div> */}







//           <div
//             className="search-box-expandable d-flex align-items-center page-title-main-name ms-auto me-3"
//             ref={headerSearchRef}
//           >
//             <form onSubmit={handleSearchSubmit} className="d-flex align-items-center w-100" style={{ margin: 0, padding: "0 10px" }}>
//               <img src={search} alt="search" onClick={handleSearchSubmit} style={{ cursor: "pointer", width: 20, height: 20 }} />
//               <input className="placeholder-colorchnage"
//                 ref={searchInputRef}
//                 type="text"
//                 placeholder="Search products, brands, categories..."
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 onFocus={() => setShowSearchResults(true)}
//                 style={{
//                   border: "none",
//                   outline: "none",
//                   background: "transparent",
//                   margin: "0 8px",
//                   fontSize: "16px",
//                 }}
//               />
//               {searchText && (
//                 <FaTimes
//                   style={{ cursor: "pointer", marginRight: "8px", width: 16, height: 16 }}
//                   onClick={clearSearch}
//                 />
//               )}
//               <img
//                 src={mic}
//                 className={`icon ${listening ? "listening" : ""}`}
//                 onClick={startListening}
//                 alt="mic"
//                 style={{ cursor: "pointer", width: 20, height: 20 }}
//               />
//             </form>

//             {/* Search results dropdown – full content restored */}
//             {showSearchResults && (
//               <div
//                 className="search-results-dropdown"
//                 style={{
//                   position: "absolute",
//                   top: "calc(100% + 5px)",
//                   left: 0,
//                   right: 0,
//                   background: "white",
//                   border: "1px solid #ddd",
//                   borderRadius: "8px",
//                   boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
//                   maxHeight: "500px",
//                   overflowY: "auto",
//                   zIndex: 1000,
//                 }}
//               >
//                 {!searchText.trim() ? (
//                   <div style={{ padding: "15px" }}>
//                     {recentSearches.length > 0 && (
//                       <div style={{ marginBottom: "15px" }}>
//                         <div
//                           style={{
//                             fontSize: "12px",
//                             fontWeight: "600",
//                             color: "#666",
//                             marginBottom: "8px",
//                             display: "flex",
//                             justifyContent: "space-between",
//                           }}
//                         >
//                           <span>Recent Searches</span>
//                           <button
//                             onClick={clearRecentSearches}
//                             style={{
//                               background: "none",
//                               border: "none",
//                               color: "#0077b6",
//                               cursor: "pointer",
//                               fontSize: "11px",
//                             }}
//                           >
//                             Clear
//                           </button>
//                         </div>
//                         <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
//                           {recentSearches.map((s, i) => (
//                             <span
//                               key={i}
//                               onClick={() => handleRecentSearchClick(s)}
//                               style={{
//                                 padding: "4px 12px",
//                                 background: "#f0f0f0",
//                                 borderRadius: "15px",
//                                 fontSize: "12px",
//                                 cursor: "pointer",
//                               }}
//                             >
//                               {s}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                     <div style={{ fontSize: "12px", fontWeight: "600", color: "#666", marginBottom: "8px" }}>
//                       Popular
//                     </div>
//                     <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
//                       {popularSearches.map((s, i) => (
//                         <span
//                           key={i}
//                           onClick={() => handleRecentSearchClick(s)}
//                           style={{
//                             padding: "4px 12px",
//                             background: "#000",
//                             color: "#fff",
//                             borderRadius: "15px",
//                             fontSize: "12px",
//                             cursor: "pointer",
//                           }}
//                         >
//                           {s}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 ) : searchResults.length > 0 ? (
//                   <div>
//                     {searchResults.map((item) => {
//                       const discount = getDiscount(item);
//                       return (
//                         <div
//                           key={item._id}
//                           onClick={() => handleResultClick(item)}
//                           style={{
//                             display: "flex",
//                             padding: "10px",
//                             borderBottom: "1px solid #f5f5f5",
//                             cursor: "pointer",
//                           }}
//                         >
//                           <img
//                             src={item.image}
//                             alt={item.name}
//                             style={{
//                               width: "50px",
//                               height: "50px",
//                               objectFit: "cover",
//                               borderRadius: "4px",
//                               marginRight: "10px",
//                             }}
//                           />
//                           <div style={{ flex: 1 }}>
//                             <div style={{ fontWeight: "600", fontSize: "13px" }}>{item.name}</div>
//                             <div style={{ fontSize: "11px", color: "#666" }}>{item.brand}</div>
//                             <div style={{ fontSize: "13px", color: "#0077b6", fontWeight: "600" }}>
//                               ₹{item.price}
//                               {discount > 0 && (
//                                 <span
//                                   style={{
//                                     textDecoration: "line-through",
//                                     color: "#999",
//                                     marginLeft: "8px",
//                                     fontSize: "11px",
//                                   }}
//                                 >
//                                   ₹{item.originalPrice}
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                     <div
//                       onClick={handleSearchSubmit}
//                       style={{
//                         padding: "12px",
//                         textAlign: "center",
//                         background: "#f8f9fa",
//                         cursor: "pointer",
//                         color: "#0077b6",
//                         fontWeight: "600",
//                         fontSize: "13px",
//                       }}
//                     >
//                       View all {searchResults.length} results →
//                     </div>
//                   </div>
//                 ) : (
//                   <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
//                     No results for "{searchText}"
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>




//           {/* Desktop Icons */}
//           <div className="nav-icons user-dropdown gap-3 d-none d-lg-flex page-title-main-name" style={{ alignItems: "center" }}>
//             <Link to="/cartpage" style={{ position: "relative" }}>
//               <img src={Cart} alt="cart" />
//               {cartCount > 0 && (
//                 <span style={{
//                   position: "absolute",
//                   top: "-8px",
//                   right: "-8px",
//                   background: "#000",
//                   color: "white",
//                   borderRadius: "50%",
//                   width: "18px",
//                   height: "18px",
//                   fontSize: "10px",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center"
//                 }}>
//                   {cartCount}
//                 </span>
//               )}
//             </Link>

//             <Link to="/wishlist" style={{ position: "relative" }}>
//               <img src={favourite} alt="wishlist" />
//               {wishlistCount > 0 && (
//                 <span style={{
//                   position: "absolute",
//                   top: "-8px",
//                   right: "-8px",
//                   background: "#c34242",
//                   color: "white",
//                   borderRadius: "50%",
//                   width: "18px",
//                   height: "18px",
//                   fontSize: "10px",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center"
//                 }}>
//                   {wishlistCount}
//                 </span>
//               )}
//             </Link>

//             <div style={{ position: "relative", cursor: "pointer" }} onClick={() => setUserDropdown(!userDropdown)}>
//               <img src={users} className="icon" alt="user" />
//               {userDropdown && (
//                 <div style={{ position: "absolute", top: "100%", right: 0, background: "white", border: "1px solid #ddd", borderRadius: "8px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", zIndex: 1000, minWidth: "180px", marginTop: "20px" }}>
//                   {user && !user.guest ? (
//                     <>
//                       <div onClick={() => { navigate("/useraccount"); setUserDropdown(false); }} style={{ padding: "10px 15px", borderBottom: "1px solid #eee", cursor: "pointer" }}>My Account</div>
//                       <div onClick={() => { navigate("/Myorders"); setUserDropdown(false); }} style={{ padding: "10px 15px", borderBottom: "1px solid #eee", cursor: "pointer" }}>My Orders</div>
//                       <div
//                         onClick={() => {
//                           setUserDropdown(false);
//                           setShowLogoutModal(true);
//                         }}
//                         style={{ padding: "10px 15px", cursor: "pointer" }}
//                       >
//                         Logout
//                       </div>
//                     </>
//                   ) : (
//                     <>
//                       <div onClick={() => { navigate("/login"); setUserDropdown(false); }} style={{ padding: "10px 15px", borderBottom: "1px solid #eee", cursor: "pointer" }}>Login</div>
//                       <div onClick={() => { navigate("/Signup"); setUserDropdown(false); }} style={{ padding: "10px 15px", cursor: "pointer" }}>Register</div>
//                     </>
//                   )}
//                 </div>
//               )}


//               {showLogoutModal && (
//                 <div
//                   style={{
//                     position: "fixed",
//                     top: 0,
//                     left: 0,
//                     width: "100%",
//                     height: "100%",
//                     background: "rgba(0,0,0,0.5)",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     zIndex: 9999,
//                   }}
//                 >
//                   <div
//                     style={{
//                       background: "#fff",
//                       padding: "25px",
//                       borderRadius: "10px",
//                       width: "320px",
//                       textAlign: "center",
//                       boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
//                     }}
//                   >
//                     <h3 style={{ marginBottom: "10px", fontSize: "18px" }}>
//                       Confirm Logout
//                     </h3>

//                     <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>
//                       Are you sure you want to logout?
//                     </p>

//                     <div style={{ display: "flex", gap: "10px" }}>
//                       <button
//                         onClick={() => setShowLogoutModal(false)}
//                         style={{
//                           flex: 1,
//                           padding: "10px",
//                           borderRadius: "6px",
//                           border: "1px solid #ddd",
//                           background: "#f5f5f5",
//                           cursor: "pointer",
//                         }}
//                       >
//                         Cancel
//                       </button>

//                       <button
//                         onClick={confirmLogout}
//                         style={{
//                           flex: 1,
//                           padding: "10px",
//                           borderRadius: "6px",
//                           border: "none",
//                           background: "#e63946",
//                           color: "#fff",
//                           fontWeight: "600",
//                           cursor: "pointer",
//                         }}
//                       >
//                         Logout
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Desktop Categories */}
//         <HeaderCategories />
//       </header>
//     </>
//   );
// };

// export default Header;
























import React, { useState, useEffect, useRef, useCallback, useContext } from "react";
import { FaTimes } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../css/Header/Header.css";
import "../App.css";
import logo from "../assets/logo.png";
import Cart from "../assets/Cart.svg";
import favourite from "../assets/favourite.svg";
import users from "../assets/user.svg";
import mic from "../assets/mic.svg";
import search from "../assets/search.svg";
import axiosInstance from "../utils/axiosInstance.js";
import { UserContext } from "./UserContext";
import HeaderCategories from "../component/HeaderCategories";
import MobileHeader from "./Mobileheaderview";

const getBrandName = (product) => {
  if (!product?.brand) return "Unknown Brand";
  if (typeof product.brand === "object" && product.brand.name) return product.brand.name;
  if (typeof product.brand === "string") return product.brand;
  return "Unknown Brand";
};

const getCategoryName = (product) => {
  if (!product?.category) return "Uncategorized";
  if (typeof product.category === "object" && product.category.name) return product.category.name;
  if (typeof product.category === "string") return product.category;
  return "Uncategorized";
};

const safeString = (val) => {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object") {
    if (val.name) return String(val.name);
    if (val.title) return String(val.title);
    if (val.label) return String(val.label);
    try {
      return JSON.stringify(val);
    } catch (e) {
      return "";
    }
  }
  return String(val);
};

const getCategoryAndDescendantSpecs = (categoriesList, searchSlugOrName) => {
  const term = searchSlugOrName.toLowerCase().trim();
  const collectedIds = new Set();
  const collectedNames = new Set();
  const collectedSlugs = new Set();

  const findCategory = (nodes) => {
    for (const node of nodes) {
      if (node.name?.toLowerCase().trim() === term || node.slug?.toLowerCase().trim() === term) {
        return node;
      }
      if (node.children?.length) {
        const found = findCategory(node.children);
        if (found) return found;
      }
    }
    return null;
  };

  const collectNode = (node) => {
    if (!node) return;
    if (node._id) collectedIds.add(String(node._id));
    if (node.name) collectedNames.add(node.name.toLowerCase().trim());
    if (node.slug) collectedSlugs.add(node.slug.toLowerCase().trim());
    if (node.children?.length) {
      node.children.forEach(child => collectNode(child));
    }
  };

  const targetCategory = findCategory(categoriesList);
  if (targetCategory) {
    collectNode(targetCategory);
  }
  return { ids: collectedIds, names: collectedNames, slugs: collectedSlugs };
};

const matchesCategory = (product, specs) => {
  if (!specs || !product) return false;

  const checkVal = (catVal) => {
    if (!catVal) return false;
    if (typeof catVal === 'object') {
      const idStr = String(catVal._id || catVal.id || "");
      const nameStr = String(catVal.name || "").toLowerCase().trim();
      const slugStr = String(catVal.slug || "").toLowerCase().trim();

      if (idStr && specs.ids.has(idStr)) return true;
      if (nameStr && specs.names.has(nameStr)) return true;
      if (slugStr && specs.slugs.has(slugStr)) return true;
    } else if (typeof catVal === 'string') {
      const term = catVal.toLowerCase().trim();
      if (specs.ids.has(catVal)) return true;
      if (specs.names.has(term)) return true;
      if (specs.slugs.has(term)) return true;
    }
    return false;
  };

  return checkVal(product.category) || checkVal(product.originalCategory);
};

const getSearchableString = (p) => {
  const productName = safeString(p.name || p.title).toLowerCase();
  const brandName = safeString(getBrandName(p)).toLowerCase();
  const categoryName = safeString(getCategoryName(p)).toLowerCase();
  const descriptionText = safeString(p.description).toLowerCase();

  // Variants details
  const variants = Array.isArray(p.variants) ? p.variants : [];
  const variantsText = variants.map(v =>
    `${safeString(v.shadeName)} ${safeString(v.name)} ${safeString(v.size)} ${safeString(v.ml)} ${safeString(v.weight)} ${safeString(v.sku)}`.toLowerCase()
  ).join(" ");

  // Additional product details
  const skinTypesText = Array.isArray(p.skinTypes)
    ? p.skinTypes.map(st => safeString(st)).join(" ").toLowerCase()
    : safeString(p.skinTypes).toLowerCase();

  const ingredientsText = Array.isArray(p.ingredients)
    ? p.ingredients.map(ing => safeString(ing)).join(" ").toLowerCase()
    : safeString(p.ingredients).toLowerCase();

  const formulationText = safeString(p.formulation).toLowerCase();
  const finishText = safeString(p.finish).toLowerCase();

  const tagsText = Array.isArray(p.tags)
    ? p.tags.map(t => safeString(t)).join(" ").toLowerCase()
    : safeString(p.tags).toLowerCase();

  return [
    productName,
    brandName,
    categoryName,
    descriptionText,
    variantsText,
    skinTypesText,
    ingredientsText,
    formulationText,
    finishText,
    tagsText
  ].filter(Boolean).join(" ");
};

const Header = ({ hideCategories = false }) => {
  const navigate = useNavigate();
  const _location = useLocation();
  const { user, logoutUser } = useContext(UserContext);

  // ---------- responsive ----------
  // const [isMobile, setIsMobile] = useState(window.innerWidth <= 800);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 991);
  const [menuOpen, setMenuOpen] = useState(false);


  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // ---------- search bar animation state ----------
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // ---------- cart & wishlist ----------
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  // ---------- search ----------
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [_allProducts, setAllProducts] = useState([]);
  const [searchIndex, setSearchIndex] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [_isSearchLoading, setIsSearchLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches, setPopularSearches] = useState(["Makeup", "Skin", "Eyes", "Minimalist", "Mars", "DOT & KEY"]);
  const [categories, setCategories] = useState([]);
  const [listening, setListening] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const searchTimeoutRef = useRef(null);
  const recognitionRef = useRef(null);
  const searchInputRef = useRef(null);
  const headerSearchRef = useRef(null);
  const hasFetchedProducts = useRef(false);
  const mobileSearchInputRef = useRef(null);



  const confirmLogout = () => {
    logoutUser();
    setShowLogoutModal(false);
    navigate("/login");
  };


  // ---------- responsive resize ----------
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      // setIsMobile(width <= 800);
      setIsMobile(width <= 991);
      if (width > 800) {
        setMenuOpen(false);
        setShowMobileSearch(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Focus mobile search input when shown
  useEffect(() => {
    if (showMobileSearch && mobileSearchInputRef.current) {
      setTimeout(() => mobileSearchInputRef.current.focus(), 300);
    }
  }, [showMobileSearch]);

  // ---------- CLICK OUTSIDE HANDLER FOR SEARCH DROPDOWN ----------
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close search results if clicking outside the search area
      if (
        headerSearchRef.current &&
        !headerSearchRef.current.contains(event.target) &&
        showSearchResults
      ) {
        setShowSearchResults(false);
        searchInputRef.current?.blur();
      }
    };

    // Add event listener when search results are shown
    if (showSearchResults) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearchResults]);

  // ---------- load recent searches ----------
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading recent searches:", e);
      }
    }
  }, []);

  // ---------- fetch products & categories ----------
  useEffect(() => {
    if (hasFetchedProducts.current) return;

    const fetchData = async () => {
      try {
        setIsSearchLoading(true);
        const catRes = await axiosInstance.get("/api/user/categories/tree");
        setCategories(Array.isArray(catRes.data) ? catRes.data : catRes.data.categories || []);

        let allFetchedProducts = [];
        let currentCursor = null;
        let hasMore = true;

        while (hasMore) {
          const res = await axiosInstance.get("/api/user/products/all", {
            params: { cursor: currentCursor, limit: 500 },
            withCredentials: true
          });

          let products = [];
          let pagination = {};

          if (res.data && Array.isArray(res.data.products)) {
            products = res.data.products;
            pagination = res.data.pagination || {};
          } else if (Array.isArray(res.data)) {
            products = res.data;
          }

          if (products.length > 0) {
            allFetchedProducts.push(...products);
          }

          if (pagination.hasMore === false || products.length === 0) {
            hasMore = false;
          } else if (pagination.nextCursor) {
            currentCursor = pagination.nextCursor;
          } else {
            hasMore = false;
          }
        }

        // Deduplicate products by _id to avoid any duplicate listings
        const productMap = new Map();
        allFetchedProducts.forEach(p => {
          const id = p._id || p.id;
          if (id) productMap.set(id, p);
        });
        const products = Array.from(productMap.values());

        const processed = products.map(p => ({
          _id: p._id || p.id,
          name: p.name || p.title || "Unnamed Product",
          slug: p.slugs?.[0] || p.slug || p._id,
          brand: getBrandName(p),
          category: getCategoryName(p),
          originalCategory: p.category,
          price: p.selectedVariant?.displayPrice || p.price || 0,
          originalPrice: p.selectedVariant?.originalPrice || p.originalPrice || 0,
          discountPercent: p.selectedVariant?.discountPercent || 0,
          image: p.selectedVariant?.images?.[0] || p.images?.[0] || "/placeholder.png",
          inStock: p.inStock !== false && p.status !== "outOfStock",
          rating: p.rating || 0,
          reviewCount: p.reviewCount || 0,
          description: p.description || "",
          variants: p.variants || []
        }));

        setAllProducts(processed);
        const index = processed.map(p => ({
          product: p,
          searchString: getSearchableString(p)
        }));
        setSearchIndex(index);
        hasFetchedProducts.current = true;
        extractPopularSearches(processed);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setIsSearchLoading(false);
      }
    };
    fetchData();
  }, []);

  // ---------- cart count ----------
  useEffect(() => {
    const fetchCart = async () => {
      if (!user || user.guest) { setCartCount(0); return; }
      try {
        const res = await axiosInstance.get("/api/user/cart/summary", { withCredentials: true });
        const count = res.data?.cart?.length || res.data?.items?.length || res.data?.count || 0;
        setCartCount(count);
      } catch (err) {
        console.error("Cart fetch error:", err);
        setCartCount(0);
      }
    };
    fetchCart();
    const interval = setInterval(fetchCart, 30000);
    return () => clearInterval(interval);
  }, [user]);

  // ---------- wishlist count ----------
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user || user.guest) {
        setWishlistCount(0);
        return;
      }
      try {
        const res = await axiosInstance.get("/api/user/wishlist", { withCredentials: true });
        let count = 0;
        if (res.data?.count !== undefined) count = res.data.count;
        else if (res.data?.items?.length !== undefined) count = res.data.items.length;
        else if (Array.isArray(res.data)) count = res.data.length;
        else if (res.data?.wishlist?.length !== undefined) count = res.data.wishlist.length;
        setWishlistCount(count);
      } catch (err) {
        console.error("Wishlist fetch error:", err);
        setWishlistCount(0);
      }
    };

    fetchWishlist();
    const interval = setInterval(fetchWishlist, 45000);
    return () => clearInterval(interval);
  }, [user]);

  // ---------- search logic ----------
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => setDebouncedSearchText(searchText), 300);
    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchText]);

  useEffect(() => {
    if (!debouncedSearchText.trim()) {
      setSearchResults([]);
      return;
    }
    const term = debouncedSearchText.toLowerCase().trim();

    // Check if the search term exactly matches any category in the tree hierarchically
    const specs = getCategoryAndDescendantSpecs(categories, term);

    let results;
    if (specs.ids.size > 0) {
      results = searchIndex
        .filter(({ product }) => matchesCategory(product, specs))
        .map(({ product }) => product);
    } else {
      const words = term.split(/\s+/);
      results = searchIndex
        .filter(({ searchString }) => words.every(word => searchString.includes(word)))
        .map(({ product }) => product);
    }

    setSearchResults(results.slice(0, 10));
    setShowSearchResults(true);
  }, [debouncedSearchText, searchIndex, categories]);

  const extractPopularSearches = (products) => {
    const catCounts = {}, brandCounts = {};
    products.forEach(p => {
      if (p.category) catCounts[p.category] = (catCounts[p.category] || 0) + 1;
      if (p.brand) brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
    });
    const topCats = Object.entries(catCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(x => x[0]);
    const topBrands = Object.entries(brandCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(x => x[0]);
    setPopularSearches([...topCats, ...topBrands]);
  };

  // ---------- shared search handlers ----------
  const saveToRecentSearches = (query) => {
    if (!query.trim()) return;
    const updated = [query.trim(), ...recentSearches.filter(s => s.toLowerCase() !== query.trim().toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (!searchText.trim()) return;
    saveToRecentSearches(searchText);
    setShowSearchResults(false);
    setMenuOpen(false);
    setShowMobileSearch(false);
    navigate(`/search?q=${encodeURIComponent(searchText.trim())}`);
  };

  const handleResultClick = (product) => {
    saveToRecentSearches(product.name);
    setSearchText("");
    setShowSearchResults(false);
    setMenuOpen(false);
    setShowMobileSearch(false);
    navigate(`/product/${product.slug}`);
  };

  const handleRecentSearchClick = (term) => {
    setSearchText(term);
    saveToRecentSearches(term);
    navigate(`/search?q=${encodeURIComponent(term)}`);
    setShowSearchResults(false);
    setMenuOpen(false);
    setShowMobileSearch(false);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const clearSearch = () => {
    setSearchText("");
    setDebouncedSearchText("");
    searchInputRef.current?.focus();
    mobileSearchInputRef.current?.focus();
  };

  // ---------- voice search ----------
  const startListening = () => {
    if (!window.webkitSpeechRecognition && !window.SpeechRecognition) {
      alert("Voice search not supported in this browser");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-IN';
    recognitionRef.current.onstart = () => setListening(true);
    recognitionRef.current.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setSearchText(transcript);
      saveToRecentSearches(transcript);
      setListening(false);
      setTimeout(() => handleSearchSubmit(), 500);
    };
    recognitionRef.current.onerror = () => setListening(false);
    recognitionRef.current.onend = () => setListening(false);
    recognitionRef.current.start();
  };

  // ---------- close mobile drawer ----------
  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    setShowSearchResults(false);
  }, []);

  const getDiscount = (p) => p.originalPrice > p.price ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;

  // ---------- RENDER ----------
  // Mobile view (≤800px) – use MobileHeader component with animated search
  if (isMobile) {
    return (
      <>
        {/* Animated Mobile Search Bar Overlay */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            background: "white",
            zIndex: 9999,
            transform: showMobileSearch ? "translateY(0)" : "translateY(-100%)",
            opacity: showMobileSearch ? 1 : 0,
            transition: "transform 0.3s ease-out, opacity 0.3s ease-out",
            boxShadow: showMobileSearch ? "0 4px 20px rgba(0,0,0,0.15)" : "none",
            padding: "12px 16px",
            borderBottom: "1px solid #eee",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <form
              onSubmit={handleSearchSubmit}
              style={{
                display: "flex",
                flex: 1,
                alignItems: "center",
                background: "#f5f5f5",
                borderRadius: "25px",
                padding: "0 16px",
                height: "44px",
              }}
            >
              <img
                src={search}
                alt="search"
                style={{ width: "18px", height: "18px", marginRight: "10px", opacity: 0.6 }}
              />
              <input
                ref={mobileSearchInputRef}
                type="text"
                placeholder="Search products, brands..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onFocus={() => setShowSearchResults(true)}
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  flex: 1,
                  fontSize: "15px",
                  color: "#333",
                }}
              />
              {searchText && (
                <FaTimes
                  style={{
                    cursor: "pointer",
                    color: "#777",
                    fontSize: "16px",
                    marginRight: "10px",
                  }}
                  onClick={clearSearch}
                />
              )}
              <img
                src={mic}
                className={`icon ${listening ? "listening" : ""}`}
                onClick={startListening}
                alt="mic"
                style={{ width: "20px", height: "20px", cursor: "pointer" }}
              />
            </form>
            <button
              onClick={() => {
                setShowMobileSearch(false);
                setShowSearchResults(false);
              }}
              style={{
                background: "none",
                border: "none",
                color: "#0077b6",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Cancel
            </button>
          </div>

          {/* Mobile Search Results Dropdown */}
          {showSearchResults && showMobileSearch && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "white",
                maxHeight: "calc(100vh - 70px)",
                overflowY: "auto",
                borderBottom: "1px solid #eee",
              }}
            >
              {!searchText.trim() ? (
                <div style={{ padding: "16px" }}>
                  {recentSearches.length > 0 && (
                    <div style={{ marginBottom: "20px" }}>
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: "600",
                          color: "#666",
                          marginBottom: "10px",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>Recent Searches</span>
                        <button
                          onClick={clearRecentSearches}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#0077b6",
                            cursor: "pointer",
                            fontSize: "11px",
                          }}
                        >
                          Clear
                        </button>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {recentSearches.map((s, i) => (
                          <span
                            key={i}
                            onClick={() => handleRecentSearchClick(s)}
                            style={{
                              padding: "6px 12px",
                              background: "#f0f0f0",
                              borderRadius: "16px",
                              fontSize: "13px",
                              cursor: "pointer",
                            }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#666",
                      marginBottom: "10px",
                    }}
                  >
                    Popular
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {popularSearches.map((s, i) => (
                      <span
                        key={i}
                        onClick={() => handleRecentSearchClick(s)}
                        style={{
                          padding: "6px 12px",
                          background: "#000",
                          color: "#fff",
                          borderRadius: "16px",
                          fontSize: "13px",
                          cursor: "pointer",
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ) : searchResults.length > 0 ? (
                <div>
                  {searchResults.map((item) => {
                    const discount = getDiscount(item);
                    return (
                      <div
                        key={item._id}
                        onClick={() => handleResultClick(item)}
                        style={{
                          display: "flex",
                          padding: "12px 16px",
                          borderBottom: "1px solid #f5f5f5",
                          cursor: "pointer",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "6px",
                            marginRight: "12px",
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: "600", fontSize: "14px" }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: "12px", color: "#666" }}>
                            {item.brand}
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              color: "#0077b6",
                              fontWeight: "600",
                              marginTop: "2px",
                            }}
                          >
                            ₹{item.price}
                            {discount > 0 && (
                              <span
                                style={{
                                  textDecoration: "line-through",
                                  color: "#999",
                                  marginLeft: "8px",
                                  fontSize: "12px",
                                }}
                              >
                                ₹{item.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div
                    onClick={handleSearchSubmit}
                    style={{
                      padding: "14px",
                      textAlign: "center",
                      background: "#f8f9fa",
                      cursor: "pointer",
                      color: "#0077b6",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    View all results →
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    padding: "30px",
                    textAlign: "center",
                    color: "#666",
                    fontSize: "14px",
                  }}
                >
                  No results for "{searchText}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Backdrop when search is open */}
        {showMobileSearch && (
          <div
            onClick={() => {
              setShowMobileSearch(false);
              setShowSearchResults(false);
            }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 9998,
              opacity: showMobileSearch ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          />
        )}

        <MobileHeader
          isMobile={isMobile}
          isTablet={false}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          closeMenu={closeMenu}
          user={user}
          logoutUser={logoutUser}
          cartCount={cartCount}
          wishlistCount={wishlistCount}
          categories={categories}
          searchText={searchText}
          setSearchText={setSearchText}
          handleSearchSubmit={handleSearchSubmit}
          startListening={startListening}
          listening={listening}
          searchResults={searchResults}
          recentSearches={recentSearches}
          popularSearches={popularSearches}
          handleResultClick={handleResultClick}
          handleRecentSearchClick={handleRecentSearchClick}
          clearRecentSearches={clearRecentSearches}
          clearSearch={clearSearch}
          searchInputRef={searchInputRef}
          onSearchClick={() => setShowMobileSearch(true)}
        />
      </>
    );
  }

  // ---------- DESKTOP VIEW (>800px) ----------
  return (
    <>
      <header className="header d-block header-container ">
        <div className="d-flex justify-content-between margin-padding-header align-items-center">
          {/* Logo */}
          <Link to="/" className="logo" onClick={closeMenu}>
            <img src={logo} className="ps-sm-0 ps-4 ms-sm-0" alt="JOYORY Logo" />
          </Link>

          {/* Desktop Search with Click-Outside Close */}
          <div
            className="search-box-expandable d-flex align-items-center page-title-main-name ms-auto me-3"
            ref={headerSearchRef}
          >
            <form onSubmit={handleSearchSubmit} className="d-flex align-items-center w-100" style={{ margin: 0, padding: "0 10px" }}>
              <img src={search} alt="search" onClick={handleSearchSubmit} style={{ cursor: "pointer", width: 20, height: 20 }} />
              <input className="placeholder-colorchnage"
                ref={searchInputRef}
                type="text"
                placeholder="Search products, brands, categories..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onFocus={() => setShowSearchResults(true)}
                onClick={() => setShowSearchResults(true)}
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  margin: "0 8px",
                  fontSize: "16px",
                }}
              />
              {searchText && (
                <FaTimes
                  style={{ cursor: "pointer", marginRight: "8px", width: 16, height: 16 }}
                  onClick={clearSearch}
                />
              )}
              <img
                src={mic}
                className={`icon ${listening ? "listening" : ""}`}
                onClick={startListening}
                alt="mic"
                style={{ cursor: "pointer", width: 20, height: 20 }}
              />
            </form>

            {/* Search results dropdown – full content restored */}
            {showSearchResults && (
              <div
                className="search-results-dropdown"
                style={{
                  position: "absolute",
                  top: "calc(100% + 5px)",
                  left: 0,
                  right: 0,
                  background: "white",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                  maxHeight: "500px",
                  overflowY: "auto",
                  zIndex: 1000,
                }}
              >
                {!searchText.trim() ? (
                  <div style={{ padding: "15px" }}>
                    {recentSearches.length > 0 && (
                      <div style={{ marginBottom: "15px" }}>
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: "600",
                            color: "#666",
                            marginBottom: "8px",
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <span>Recent Searches</span>
                          <button
                            onClick={clearRecentSearches}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#0077b6",
                              cursor: "pointer",
                              fontSize: "11px",
                            }}
                          >
                            Clear
                          </button>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                          {recentSearches.map((s, i) => (
                            <span
                              key={i}
                              onClick={() => handleRecentSearchClick(s)}
                              style={{
                                padding: "4px 12px",
                                background: "#f0f0f0",
                                borderRadius: "15px",
                                fontSize: "12px",
                                cursor: "pointer",
                              }}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div style={{ fontSize: "12px", fontWeight: "600", color: "#666", marginBottom: "8px" }}>
                      Popular
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {popularSearches.map((s, i) => (
                        <span
                          key={i}
                          onClick={() => handleRecentSearchClick(s)}

                          onMouseEnter={(e) => {
                            e.target.style.background = "#000";
                            e.target.style.color = "#fff";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = "#fff";
                            e.target.style.color = "#000";
                          }}

                          style={{
                            padding: "4px 12px",
                            background: "#fff",
                            color: "#000",
                            borderRadius: "15px",
                            fontSize: "12px",
                            cursor: "pointer",
                            border: "1px solid #000",

                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div>
                    {searchResults.map((item) => {
                      const discount = getDiscount(item);
                      return (
                        <div
                          key={item._id}
                          onClick={() => handleResultClick(item)}
                          style={{
                            display: "flex",
                            padding: "10px",
                            borderBottom: "1px solid #f5f5f5",
                            cursor: "pointer",
                          }}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                              borderRadius: "4px",
                              marginRight: "10px",
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: "600", fontSize: "13px" }}>{item.name}</div>
                            <div style={{ fontSize: "11px", color: "#666" }}>{item.brand}</div>
                            <div style={{ fontSize: "13px", color: "#0077b6", fontWeight: "600" }}>
                              ₹{item.price}
                              {discount > 0 && (
                                <span
                                  style={{
                                    textDecoration: "line-through",
                                    color: "#999",
                                    marginLeft: "8px",
                                    fontSize: "11px",
                                  }}
                                >
                                  ₹{item.originalPrice}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div
                      onClick={handleSearchSubmit}
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        background: "#f8f9fa",
                        cursor: "pointer",
                        color: "#0077b6",
                        fontWeight: "600",
                        fontSize: "13px",
                      }}
                    >
                      View all {searchResults.length} results →
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
                    No results for "{searchText}"
                  </div>
                )}
              </div>
            )}
          </div>




          {/* Desktop Icons */}
          <div className="nav-icons user-dropdown gap-3 d-none d-lg-flex page-title-main-name" style={{ alignItems: "center" }}>
            <Link to="/cartpage" style={{ position: "relative" }}>
              <img src={Cart} alt="cart" />
              {cartCount > 0 && (
                <span style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  background: "#000",
                  color: "white",
                  borderRadius: "50%",
                  width: "18px",
                  height: "18px",
                  fontSize: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  {cartCount}
                </span>
              )}
            </Link>

            <Link to="/wishlist" style={{ position: "relative" }}>
              <img src={favourite} alt="wishlist" />
              {wishlistCount > 0 && (
                <span style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  background: "#c34242",
                  color: "white",
                  borderRadius: "50%",
                  width: "18px",
                  height: "18px",
                  fontSize: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  {wishlistCount}
                </span>
              )}
            </Link>

            <div style={{ position: "relative", cursor: "pointer" }} onClick={() => setUserDropdown(!userDropdown)}>
              <img src={users} className="icon" alt="user" />
              {userDropdown && (
                <div style={{ position: "absolute", top: "100%", right: 0, background: "white", border: "1px solid #ddd", borderRadius: "8px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", zIndex: 1000, minWidth: "180px", marginTop: "20px" }}>
                  {user && !user.guest ? (
                    <>
                      <div onClick={() => { navigate("/useraccount"); setUserDropdown(false); }} style={{ padding: "10px 15px", borderBottom: "1px solid #eee", cursor: "pointer" }}>My Account</div>
                      <div onClick={() => { navigate("/Myorders"); setUserDropdown(false); }} style={{ padding: "10px 15px", borderBottom: "1px solid #eee", cursor: "pointer" }}>My Orders</div>
                      <div
                        onClick={() => {
                          setUserDropdown(false);
                          setShowLogoutModal(true);
                        }}
                        style={{ padding: "10px 15px", cursor: "pointer" }}
                      >
                        Logout
                      </div>
                    </>
                  ) : (
                    <>
                      <div onClick={() => { navigate("/login"); setUserDropdown(false); }} style={{ padding: "10px 15px", borderBottom: "1px solid #eee", cursor: "pointer" }}>Login</div>
                      <div onClick={() => { navigate("/Signup"); setUserDropdown(false); }} style={{ padding: "10px 15px", cursor: "pointer" }}>Register</div>
                    </>
                  )}
                </div>
              )}


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
            </div>
          </div>
        </div>

        {/* Desktop Categories */}
        {!hideCategories && <HeaderCategories />}
      </header>
    </>
  );
};

export default Header;

//==============================================================Done-Code(End)=====================================================================================









