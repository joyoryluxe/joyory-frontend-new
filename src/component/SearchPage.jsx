// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { FaSearch } from "react-icons/fa";
// import Header from "./Header";
// import axiosInstance from "../utils/axiosInstance.js";
// import "../css/SearchPage.css";

// const SearchPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const queryParams = new URLSearchParams(location.search);
//   const searchQuery = queryParams.get("q") || "";

//   const [searchResults, setSearchResults] = useState([]);
//   const [allProducts, setAllProducts] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState(searchQuery);

//   // Check if data was passed from Header
//   useEffect(() => {
//     console.log("📍 SearchPage location.state:", location.state);
//     console.log("🔍 Search query from URL:", searchQuery);

//     if (location.state?.searchResults && Array.isArray(location.state.searchResults)) {
//       console.log("📦 Using search results from Header state:", location.state.searchResults.length);
//       setSearchResults(location.state.searchResults);
//       setIsLoading(false);

//       // Also update allProducts if provided
//       if (location.state.allProducts && Array.isArray(location.state.allProducts)) {
//         setAllProducts(location.state.allProducts);
//       }
//     }
//   }, [location.state, searchQuery]);

//   // Fetch all products if not passed from Header OR if we need to search
//   useEffect(() => {
//     const fetchAllProducts = async () => {
//       // If we already have products and search results from state, don't fetch
//       if (searchResults.length > 0 && allProducts.length > 0) {
//         console.log("✅ Already have products and results from Header, skipping fetch");
//         return;
//       }

//       try {
//         setIsLoading(true);
//         console.log("📥 Fetching products for search page...");

//         const response = await axiosInstance.get("https://beauty.joyory.com/api/user/products/all");

//         let products = [];

//         if (response.data.products && Array.isArray(response.data.products)) {
//           products = response.data.products;
//         } else if (Array.isArray(response.data)) {
//           products = response.data;
//         } else if (response.data.items && Array.isArray(response.data.items)) {
//           products = response.data.items;
//         }

//         const processedProducts = products.map(product => {
//           const productSlug = product.slugs && product.slugs.length > 0
//             ? product.slugs[0]
//             : generateSlugFromName(product.name);

//           let productImage = "";
//           if (product.selectedVariant && product.selectedVariant.images && product.selectedVariant.images.length > 0) {
//             productImage = product.selectedVariant.images[0];
//           } else if (product.variants && product.variants.length > 0 && product.variants[0].images && product.variants[0].images.length > 0) {
//             productImage = product.variants[0].images[0];
//           } else if (product.images && product.images.length > 0) {
//             productImage = product.images[0];
//           } else {
//             productImage = "/placeholder.png";
//           }

//           let productPrice = "";
//           if (product.selectedVariant && product.selectedVariant.displayPrice) {
//             productPrice = product.selectedVariant.displayPrice;
//           } else if (product.selectedVariant && product.selectedVariant.price) {
//             productPrice = product.selectedVariant.price;
//           } else if (product.price) {
//             productPrice = product.price;
//           } else {
//             productPrice = 0;
//           }

//           let brandName = "";
//           if (product.brand) {
//             if (typeof product.brand === 'string') {
//               brandName = product.brand;
//             } else if (product.brand.name) {
//               brandName = product.brand.name;
//             }
//           }

//           let categoryName = "";
//           if (product.category) {
//             if (typeof product.category === 'string') {
//               categoryName = product.category;
//             } else if (product.category.name) {
//               categoryName = product.category.name;
//             }
//           }

//           return {
//             _id: product._id,
//             name: product.name || "Unnamed Product",
//             slug: productSlug,
//             price: productPrice,
//             displayPrice: productPrice,
//             originalPrice: product.selectedVariant?.originalPrice || product.price || 0,
//             brand: brandName,
//             brandObj: product.brand,
//             category: categoryName,
//             categoryObj: product.category,
//             images: [productImage],
//             image: productImage,
//             thumbnail: productImage,
//             variants: product.variants || [],
//             selectedVariant: product.selectedVariant,
//             slugs: product.slugs || [],
//             status: product.status || "unknown",
//             inStock: product.inStock || false
//           };
//         });

//         console.log("✅ Products loaded for search page:", processedProducts.length);
//         setAllProducts(processedProducts);
//         setError(null);

//         // If we have a search query but no results from Header, perform search
//         if (searchQuery.trim() && searchResults.length === 0) {
//           console.log("🔍 Performing search with loaded products...");
//           performSearch(searchQuery, processedProducts);
//         } else if (searchResults.length === 0 && !searchQuery.trim()) {
//           setIsLoading(false);
//         }
//       } catch (error) {
//         console.error("❌ Error fetching products:", error);
//         setError("Failed to load products from server.");
//         setIsLoading(false);
//       }
//     };

//     // Only fetch if we don't have results from Header
//     if (searchResults.length === 0 && allProducts.length === 0) {
//       fetchAllProducts();
//     } else if (searchResults.length > 0) {
//       setIsLoading(false);
//     }
//   }, [searchQuery, searchResults.length, allProducts.length]);

//   // Perform search when searchQuery changes
//   useEffect(() => {
//     if (searchQuery.trim() && allProducts.length > 0 && searchResults.length === 0) {
//       console.log("🔍 Performing search for query:", searchQuery);
//       performSearch(searchQuery, allProducts);
//     }
//   }, [searchQuery, allProducts]);

//   const generateSlugFromName = (name) => {
//     if (!name) return "product";
//     return name
//       .toLowerCase()
//       .replace(/[^\w\s]/g, '')
//       .replace(/\s+/g, '-')
//       .replace(/--+/g, '-');
//   };

//   const performSearch = (query, productsToSearch = allProducts) => {
//     if (!query || query.trim() === "" || productsToSearch.length === 0) {
//       setSearchResults([]);
//       setIsLoading(false);
//       return;
//     }

//     const searchTerm = query.toLowerCase().trim();
//     console.log(`🔍 Performing search for: "${searchTerm}" in ${productsToSearch.length} products`);

//     const results = productsToSearch.filter(product => {
//       if (!product || !product.name) return false;

//       const productName = product.name.toLowerCase();
//       const brandName = product.brand ? product.brand.toLowerCase() : "";
//       const categoryName = product.category ? product.category.toLowerCase() : "";

//       return productName.includes(searchTerm) ||
//              brandName.includes(searchTerm) ||
//              categoryName.includes(searchTerm);
//     });

//     console.log(`✅ Found ${results.length} results for "${searchTerm}"`);
//     setSearchResults(results);
//     setIsLoading(false);
//   };

//   const getProductImage = (product) => {
//     if (product.images && product.images.length > 0 && product.images[0]) {
//       return product.images[0];
//     }
//     if (product.image) return product.image;
//     if (product.thumbnail) return product.thumbnail;
//     return "/placeholder.png";
//   };

//   const getProductPrice = (product) => {
//     if (product.displayPrice) return product.displayPrice;
//     if (product.price) return product.price;
//     if (product.selectedVariant && product.selectedVariant.displayPrice) {
//       return product.selectedVariant.displayPrice;
//     }
//     return 0;
//   };

//   const handleProductClick = (product) => {
//     console.log("🖱️ Product clicked in SearchPage:", product.name);

//     if (product.slug) {
//       navigate(`/product/${product.slug}`);
//     } else {
//       const generatedSlug = generateSlugFromName(product.name);
//       navigate(`/product/${generatedSlug}`);
//     }
//   };

//   const handleNewSearch = (e) => {
//     if (e.key === 'Enter' && searchTerm.trim()) {
//       navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
//     }
//   };

//   const handleSearchSubmit = () => {
//     if (searchTerm.trim()) {
//       navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
//     }
//   };

//   return (
//     <div className="search-page-container">
//       <Header />

//       <div className="search-page-content">
//         <div className="search-page-header">
//           <h1 className="search-title">
//             {searchQuery ? `Search Results for "${searchQuery}"` : "Search Products"}
//           </h1>

//           <div className="search-page-input-container">
//             <div className="search-input-wrapper">
//               <input
//                 type="text"
//                 placeholder="Search products by name, brand, category..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 onKeyPress={handleNewSearch}
//                 className="search-page-input"
//               />
//               <button 
//                 className="search-page-btn"
//                 onClick={handleSearchSubmit}
//               >
//                 <FaSearch />
//               </button>
//             </div>

//             {!isLoading && searchQuery && (
//               <div className="result-count">
//                 Found {searchResults.length} {searchResults.length === 1 ? 'product' : 'products'} for "{searchQuery}"
//               </div>
//             )}
//           </div>
//         </div>

//         {isLoading ? (
//           <div className="loading-container">
//             <div className="spinner"></div>
//             <p>Loading search results...</p>
//           </div>
//         ) : error ? (
//           <div className="error-container">
//             <p className="error-message">{error}</p>
//             <button 
//               className="retry-btn"
//               onClick={() => window.location.reload()}
//             >
//               Retry
//             </button>
//           </div>
//         ) : searchQuery && searchResults.length === 0 ? (
//           <div className="no-results">
//             <div className="no-results-icon">🔍</div>
//             <h3>No products found for "{searchQuery}"</h3>
//             <p>Try different keywords or check the spelling.</p>
//             <div className="suggestions">
//               <p>Suggestions:</p>
//               <ul>
//                 <li>Try more general keywords</li>
//                 <li>Check your spelling</li>
//                 <li>Search by brand name</li>
//                 <li>Search by category</li>
//               </ul>
//             </div>
//           </div>
//         ) : searchResults.length > 0 ? (
//           <>
//             <div className="search-results-grid">
//               {searchResults.map((product) => (
//                 <div 
//                   key={product._id} 
//                   className="product-card"
//                   onClick={() => handleProductClick(product)}
//                 >
//                   <div className="product-image-container">
//                     <img 
//                       src={getProductImage(product)} 
//                       alt={product.name}
//                       className="product-image"
//                       onError={(e) => {
//                         e.target.src = "/placeholder.png";
//                         e.target.onerror = null;
//                       }}
//                     />
//                     {!product.inStock && (
//                       <span className="out-of-stock">Out of Stock</span>
//                     )}
//                   </div>
//                   <div className="product-info">
//                     <h3 className="product-name">{product.name}</h3>
//                     {product.brand && (
//                       <p className="product-brand">{product.brand}</p>
//                     )}
//                     <div className="product-price">
//                       <span className="current-price">₹{getProductPrice(product)}</span>
//                       {product.originalPrice > product.price && (
//                         <span className="original-price">₹{product.originalPrice}</span>
//                       )}
//                     </div>
//                     {product.category && (
//                       <span className="product-category">{product.category}</span>
//                     )}
//                     <button className="view-product-btn">
//                       View Product
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {searchResults.length > 0 && (
//               <div className="search-footer">
//                 <p>Showing {searchResults.length} of {searchResults.length} products</p>
//               </div>
//             )}
//           </>
//         ) : (
//           <div className="empty-search">
//             <div className="empty-search-icon">🔍</div>
//             <h3>Search for products</h3>
//             <p>Enter a keyword above to find products</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SearchPage;


















//================================================================================(Done-Code)-Start==============================================================================





// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { FaSearch } from "react-icons/fa";
// import Header from "./Header";
// import axiosInstance from "../utils/axiosInstance.js";
// import "../css/SearchPage.css";

// const SearchPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const query = new URLSearchParams(location.search).get("q") || "";

//   const [searchTerm, setSearchTerm] = useState(query);
//   const [allProducts, setAllProducts] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [hasMore, setHasMore] = useState(true);
//   const [nextCursor, setNextCursor] = useState(null);
//   const [error, setError] = useState(null);
//   const [totalProducts, setTotalProducts] = useState(0);

//   /* ---------- 1.  FETCH ALL PRODUCTS WITH PAGINATION ---------- */
//   useEffect(() => {
//     const fetchAllProducts = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);

//         let allProductsData = [];
//         let currentCursor = null;
//         let hasMorePages = true;
//         let pageCount = 0;

//         console.log("🔍 Starting to fetch all products with pagination...");

//         // Keep fetching until no more pages
//         while (hasMorePages && pageCount < 20) { // Limit to 20 pages to prevent infinite loops
//           pageCount++;
//           console.log(`📄 Fetching page ${pageCount}...`);

//           let url = "/api/user/products/all";
//           if (currentCursor) {
//             url += `?cursor=${currentCursor}`;
//           }

//           const res = await axiosInstance.get(url);
//           console.log(`✅ Page ${pageCount} response:`, res.data);

//           if (res.data && res.data.products && Array.isArray(res.data.products)) {
//             // Add products from this page
//             allProductsData = [...allProductsData, ...res.data.products];

//             // Update pagination info
//             hasMorePages = res.data.pagination?.hasMore || false;
//             currentCursor = res.data.pagination?.nextCursor || null;

//             console.log(`📊 Page ${pageCount}: Added ${res.data.products.length} products, Total: ${allProductsData.length}`);
//             console.log(`📊 Has more pages: ${hasMorePages}, Next cursor: ${currentCursor}`);

//             // If no more pages or cursor is null, break
//             if (!hasMorePages || !currentCursor) {
//               break;
//             }
//           } else {
//             console.warn("⚠️ Unexpected API response structure:", res.data);
//             break;
//           }

//           // Add a small delay between requests to avoid overwhelming the server
//           await new Promise(resolve => setTimeout(resolve, 100));
//         }

//         console.log(`🎉 Finished fetching all products. Total: ${allProductsData.length}`);

//         if (allProductsData.length === 0) {
//           setError("No products found in the database.");
//         }

//         setAllProducts(allProductsData);
//         setTotalProducts(allProductsData.length);
//         setHasMore(false);

//         // If we have a search query, filter the products
//         if (query.trim()) {
//           performSearch(query, allProductsData);
//         } else {
//           setFiltered(allProductsData);
//         }

//       } catch (err) {
//         console.error("❌ Error fetching products:", err);
//         setError(`Failed to load products: ${err.message}`);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchAllProducts();
//   }, []);

//   /* ---------- 2.  SEARCH FUNCTION ---------- */
//   const performSearch = (searchQuery, productsToSearch = allProducts) => {
//     if (!searchQuery || searchQuery.trim() === "") {
//       setFiltered(productsToSearch);
//       return;
//     }

//     const term = searchQuery.toLowerCase().trim();
//     console.log(`🔍 Searching for: "${term}" in ${productsToSearch.length} products`);

//     const results = productsToSearch.filter((p) => {
//       if (!p || !p.name) return false;

//       const name = p.name.toLowerCase();
//       const brand = p.brand?.name?.toLowerCase() || "";
//       const category = p.category?.name?.toLowerCase() || 
//                       (typeof p.category === 'string' ? p.category.toLowerCase() : "");

//       // Also search in variants if needed
//       const variantNames = p.variants?.map(v => v.shadeName?.toLowerCase() || "").join(" ") || "";

//       return (
//         name.includes(term) ||
//         brand.includes(term) ||
//         category.includes(term) ||
//         variantNames.includes(term)
//       );
//     });

//     console.log(`✅ Found ${results.length} matching products`);
//     setFiltered(results);
//   };

//   /* ---------- 3.  HANDLE SEARCH WHEN QUERY CHANGES ---------- */
//   useEffect(() => {
//     if (allProducts.length > 0) {
//       performSearch(query, allProducts);
//     }
//   }, [query, allProducts]);

//   /* ---------- 4.  OPEN PRODUCT ---------- */
//   const openProduct = (p) => {
//     if (p.slugs && p.slugs.length > 0) {
//       navigate(`/product/${p.slugs[0]}`);
//     } else if (p.selectedVariant && p.selectedVariant.slug) {
//       navigate(`/product/${p.selectedVariant.slug}`);
//     } else {
//       // Fallback to ID if no slug
//       navigate(`/product/${p._id}`);
//     }
//   };

//   /* ---------- 5.  HANDLE NEW SEARCH ---------- */
//   const handleSearchSubmit = () => {
//     if (searchTerm.trim()) {
//       navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
//     }
//   };

//   /* ---------- 6.  RENDER PRODUCT CARD ---------- */
//   const renderProductCard = (p) => {
//     const productImage = p.selectedVariant?.images?.[0] ||
//                         p.variants?.[0]?.images?.[0] ||
//                         "/placeholder.png";

//     const productPrice = p.selectedVariant?.displayPrice || 
//                         p.price || 
//                         "N/A";

//     const originalPrice = p.selectedVariant?.originalPrice;
//     const hasDiscount = originalPrice && originalPrice > productPrice;

//     const brandName = p.brand?.name || "Unknown Brand";
//     const categoryName = p.category?.name || 
//                         (typeof p.category === 'string' ? p.category : "Uncategorized");

//     const inStock = p.inStock !== false && p.status !== "outOfStock";

//     return (
//       <div
//         key={p._id}
//         className="product-card"
//         onClick={() => openProduct(p)}
//       >
//         <div className="product-image-container">
//           <img
//             src={productImage}
//             alt={p.name}
//             className="product-image"
//             onError={(e) => {
//               e.target.src = "/placeholder.png";
//               e.target.onerror = null;
//             }}
//           />
//           {!inStock && <span className="out-of-stock">Out of Stock</span>}
//           {hasDiscount && <span className="discount-badge">Sale</span>}
//         </div>

//         <div className="product-info">
//           <h3 className="product-name">{p.name}</h3>
//           <p className="product-brand">{brandName}</p>
//           <div className="product-price">
//             <span className="current-price">₹{productPrice}</span>
//             {hasDiscount && (
//               <span className="original-price">₹{originalPrice}</span>
//             )}
//           </div>
//           <p className="product-category">{categoryName}</p>
//           <p className="product-variants">
//             {p.variants?.length || 0} variant{p.variants?.length !== 1 ? 's' : ''}
//           </p>
//           <button className="view-product-btn">View Product</button>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="search-page-container">
//       <Header />

//       <div className="search-page-content">
//         <div className="search-page-header">
//           <h1 className="search-title">
//             {query ? `Search Results for "${query}"` : "All Products"}
//           </h1>

//           <div className="search-page-input-container">
//             <div className="search-input-wrapper">
//               <input
//                 type="text"
//                 placeholder="Search by product name, brand, category..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 onKeyPress={(e) =>
//                   e.key === "Enter" &&
//                   navigate(`/search?q=${encodeURIComponent(searchTerm)}`)
//                 }
//                 className="search-page-input"
//               />
//               <button
//                 className="search-page-btn"
//                 onClick={handleSearchSubmit}
//               >
//                 <FaSearch />
//               </button>
//             </div>

//             <div className="result-count">
//               {isLoading ? (
//                 "Loading products..."
//               ) : error ? (
//                 <span style={{ color: "#dc3545" }}>{error}</span>
//               ) : (
//                 <>
//                   {query ? (
//                     `Found ${filtered.length} of ${totalProducts} products for "${query}"`
//                   ) : (
//                     `Showing ${filtered.length} of ${totalProducts} total products`
//                   )}
//                 </>
//               )}
//             </div>
//           </div>
//         </div>

//         {isLoading ? (
//           <div className="loading-container">
//             <div className="spinner"></div>
//             <p>Loading all products...</p>
//             <p className="loading-subtext">
//               This may take a moment as we fetch all available products.
//             </p>
//           </div>
//         ) : error ? (
//           <div className="error-container">
//             <p className="error-message">{error}</p>
//             <button 
//               className="retry-btn"
//               onClick={() => window.location.reload()}
//             >
//               Retry
//             </button>
//             <p className="error-subtext">
//               Check your connection or try again later.
//             </p>
//           </div>
//         ) : filtered.length === 0 && query ? (
//           <div className="no-results">
//             <div className="no-results-icon">🔍</div>
//             <h3>No products found for "{query}"</h3>
//             <p>Try searching with different keywords:</p>
//             <div className="search-suggestions">
//               <button onClick={() => setSearchTerm("Plum")}>Plum</button>
//               <button onClick={() => setSearchTerm("Diwali")}>Diwali</button>
//               <button onClick={() => setSearchTerm("joyory")}>joyory</button>
//               <button onClick={() => setSearchTerm("Foundation")}>Foundation</button>
//               <button onClick={() => setSearchTerm("Face wash")}>Face wash</button>
//               <button onClick={() => setSearchTerm("Skin")}>Skin</button>
//             </div>
//             <p className="no-results-subtext">
//               We have {totalProducts} products in our database. Try browsing all products.
//             </p>
//           </div>
//         ) : filtered.length > 0 ? (
//           <>
//             <div className="search-results-grid">
//               {filtered.map((p) => renderProductCard(p))}
//             </div>

//             <div className="search-footer">
//               <p>
//                 Showing {filtered.length} of {totalProducts} products
//                 {query && ` for "${query}"`}
//               </p>
//               {hasMore && (
//                 <button 
//                   className="load-more-btn"
//                   onClick={() => {
//                     // Implement load more functionality if needed
//                     console.log("Load more clicked");
//                   }}
//                 >
//                   Load More Products
//                 </button>
//               )}
//             </div>
//           </>
//         ) : (
//           <div className="no-products">
//             <div className="no-products-icon">📦</div>
//             <h3>No products available</h3>
//             <p>Our product database is currently empty.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SearchPage;




















// import React, { useState, useEffect, useCallback } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { FaSearch } from "react-icons/fa";
// import Header from "./Header";
// import axiosInstance from "../utils/axiosInstance.js";
// import "../css/SearchPage.css";

// const SearchPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const query = new URLSearchParams(location.search).get("q") || "";

//   const [searchTerm, setSearchTerm] = useState(query);
//   const [allProducts, setAllProducts] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [hasMore, setHasMore] = useState(true);
//   const [nextCursor, setNextCursor] = useState(null);
//   const [error, setError] = useState(null);
//   const [totalProducts, setTotalProducts] = useState(0);
//   const [searchStats, setSearchStats] = useState({
//     foundInName: 0,
//     foundInBrand: 0,
//     foundInCategory: 0,
//     foundInVariants: 0,
//     foundInDescription: 0
//   });

//   /* ---------- 1.  FETCH ALL PRODUCTS WITH PAGINATION ---------- */
//   useEffect(() => {
//     const fetchAllProducts = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);

//         let allProductsData = [];
//         let currentCursor = null;
//         let hasMorePages = true;
//         let pageCount = 0;

//         console.log("🔍 Starting to fetch all products with pagination...");

//         // Keep fetching until no more pages
//         while (hasMorePages && pageCount < 20) {
//           pageCount++;

//           let url = "/api/user/products/all";
//           if (currentCursor) {
//             url += `?cursor=${currentCursor}`;
//           }

//           const res = await axiosInstance.get(url);

//           if (res.data && res.data.products && Array.isArray(res.data.products)) {
//             allProductsData = [...allProductsData, ...res.data.products];
//             hasMorePages = res.data.pagination?.hasMore || false;
//             currentCursor = res.data.pagination?.nextCursor || null;

//             if (!hasMorePages || !currentCursor) {
//               break;
//             }
//           } else {
//             console.warn("⚠️ Unexpected API response structure:", res.data);
//             break;
//           }

//           await new Promise(resolve => setTimeout(resolve, 100));
//         }

//         console.log(`🎉 Finished fetching all products. Total: ${allProductsData.length}`);

//         if (allProductsData.length === 0) {
//           setError("No products found in the database.");
//         }

//         setAllProducts(allProductsData);
//         setTotalProducts(allProductsData.length);
//         setHasMore(false);

//         // If we have a search query, filter the products
//         if (query.trim()) {
//           performSearch(query, allProductsData);
//         } else {
//           setFiltered(allProductsData);
//         }

//       } catch (err) {
//         console.error("❌ Error fetching products:", err);
//         setError(`Failed to load products: ${err.message}`);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchAllProducts();
//   }, []);

//   /* ---------- 2.  ENHANCED SEARCH FUNCTION ---------- */
//   const performSearch = useCallback((searchQuery, productsToSearch = allProducts) => {
//     if (!searchQuery || searchQuery.trim() === "") {
//       setFiltered(productsToSearch);
//       setSearchStats({
//         foundInName: 0,
//         foundInBrand: 0,
//         foundInCategory: 0,
//         foundInVariants: 0,
//         foundInDescription: 0
//       });
//       return;
//     }

//     const term = searchQuery.toLowerCase().trim();
//     console.log(`🔍 Searching for: "${term}" in ${productsToSearch.length} products`);

//     const stats = {
//       foundInName: 0,
//       foundInBrand: 0,
//       foundInCategory: 0,
//       foundInVariants: 0,
//       foundInDescription: 0
//     };

//     const results = productsToSearch.filter((p) => {
//       if (!p) return false;

//       let matches = false;

//       // Search in Product Name
//       if (p.name && p.name.toLowerCase().includes(term)) {
//         matches = true;
//         stats.foundInName++;
//       }

//       // Search in Brand Name
//       if (!matches && p.brand) {
//         const brandName = typeof p.brand === 'string' 
//           ? p.brand.toLowerCase()
//           : p.brand.name?.toLowerCase() || "";
//         if (brandName.includes(term)) {
//           matches = true;
//           stats.foundInBrand++;
//         }
//       }

//       // Search in Category
//       if (!matches && p.category) {
//         const categoryName = typeof p.category === 'string'
//           ? p.category.toLowerCase()
//           : p.category.name?.toLowerCase() || "";
//         if (categoryName.includes(term)) {
//           matches = true;
//           stats.foundInCategory++;
//         }
//       }

//       // Search in Product Description
//       if (!matches && p.description && p.description.toLowerCase().includes(term)) {
//         matches = true;
//         stats.foundInDescription++;
//       }

//       // Search in Variants
//       if (!matches && p.variants && Array.isArray(p.variants)) {
//         const variantMatch = p.variants.some(variant => {
//           // Search in variant shade name
//           if (variant.shadeName && variant.shadeName.toLowerCase().includes(term)) {
//             return true;
//           }
//           // Search in variant description
//           if (variant.description && variant.description.toLowerCase().includes(term)) {
//             return true;
//           }
//           // Search in variant color code
//           if (variant.colorCode && variant.colorCode.toLowerCase().includes(term)) {
//             return true;
//           }
//           return false;
//         });

//         if (variantMatch) {
//           matches = true;
//           stats.foundInVariants++;
//         }
//       }

//       // Search in Tags or Keywords
//       if (!matches && p.tags && Array.isArray(p.tags)) {
//         const tagMatch = p.tags.some(tag => 
//           tag && tag.toLowerCase().includes(term)
//         );
//         if (tagMatch) {
//           matches = true;
//         }
//       }

//       // Search in Product Type
//       if (!matches && p.productType && p.productType.toLowerCase().includes(term)) {
//         matches = true;
//       }

//       // Search in SKU or Product Code
//       if (!matches && p.sku && p.sku.toLowerCase().includes(term)) {
//         matches = true;
//       }

//       return matches;
//     });

//     console.log(`✅ Found ${results.length} matching products`);
//     console.log("📊 Search Statistics:", stats);

//     setSearchStats(stats);
//     setFiltered(results);

//     return results;
//   }, [allProducts]);

//   /* ---------- 3.  HANDLE SEARCH WHEN QUERY CHANGES ---------- */
//   useEffect(() => {
//     if (allProducts.length > 0) {
//       performSearch(query, allProducts);
//     }
//   }, [query, allProducts, performSearch]);

//   /* ---------- 4.  OPEN PRODUCT ---------- */
//   const openProduct = (p) => {
//     if (p.slugs && p.slugs.length > 0) {
//       navigate(`/product/${p.slugs[0]}`);
//     } else if (p.selectedVariant && p.selectedVariant.slug) {
//       navigate(`/product/${p.selectedVariant.slug}`);
//     } else {
//       navigate(`/product/${p._id}`);
//     }
//   };

//   /* ---------- 5.  HANDLE NEW SEARCH ---------- */
//   const handleSearchSubmit = () => {
//     if (searchTerm.trim()) {
//       navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
//     }
//   };

//   /* ---------- 6.  RENDER SEARCH STATISTICS ---------- */
//   const renderSearchStats = () => {
//     if (!query.trim() || isLoading || error || filtered.length === 0) return null;

//     return (
//       <div className="search-stats">
//         <p className="stats-title">Search Breakdown:</p>
//         <div className="stats-grid">
//           {searchStats.foundInName > 0 && (
//             <span className="stat-item">
//               <strong>Name:</strong> {searchStats.foundInName} products
//             </span>
//           )}
//           {searchStats.foundInBrand > 0 && (
//             <span className="stat-item">
//               <strong>Brand:</strong> {searchStats.foundInBrand} products
//             </span>
//           )}
//           {searchStats.foundInCategory > 0 && (
//             <span className="stat-item">
//               <strong>Category:</strong> {searchStats.foundInCategory} products
//             </span>
//           )}
//           {searchStats.foundInVariants > 0 && (
//             <span className="stat-item">
//               <strong>Variants:</strong> {searchStats.foundInVariants} products
//             </span>
//           )}
//           {searchStats.foundInDescription > 0 && (
//             <span className="stat-item">
//               <strong>Description:</strong> {searchStats.foundInDescription} products
//             </span>
//           )}
//         </div>
//       </div>
//     );
//   };

//   /* ---------- 7.  RENDER PRODUCT CARD ---------- */
//   const renderProductCard = (p) => {
//     const productImage = p.selectedVariant?.images?.[0] ||
//                         p.variants?.[0]?.images?.[0] ||
//                         "/placeholder.png";

//     const productPrice = p.selectedVariant?.displayPrice || 
//                         p.price || 
//                         "N/A";

//     const originalPrice = p.selectedVariant?.originalPrice;
//     const hasDiscount = originalPrice && originalPrice > productPrice;

//     const brandName = p.brand?.name || 
//                      (typeof p.brand === 'string' ? p.brand : "Unknown Brand");
//     const categoryName = p.category?.name || 
//                         (typeof p.category === 'string' ? p.category : "Uncategorized");

//     const inStock = p.inStock !== false && p.status !== "outOfStock";

//     // Highlight search term in product name
//     const highlightSearchTerm = (text) => {
//       if (!query || !text) return text;

//       const parts = text.split(new RegExp(`(${query})`, 'gi'));
//       return (
//         <span>
//           {parts.map((part, i) => 
//             part.toLowerCase() === query.toLowerCase() 
//               ? <mark key={i} className="search-highlight">{part}</mark>
//               : part
//           )}
//         </span>
//       );
//     };

//     return (
//       <div
//         key={p._id}
//         className="product-card"
//         onClick={() => openProduct(p)}
//       >
//         <div className="product-image-container">
//           <img
//             src={productImage}
//             alt={p.name}
//             className="product-image"
//             onError={(e) => {
//               e.target.src = "/placeholder.png";
//               e.target.onerror = null;
//             }}
//           />
//           {!inStock && <span className="out-of-stock">Out of Stock</span>}
//           {hasDiscount && <span className="discount-badge">Sale</span>}
//         </div>

//         <div className="product-info">
//           <h3 className="product-name">
//             {highlightSearchTerm(p.name)}
//           </h3>
//           <p className="product-brand">
//             <strong>Brand:</strong> {highlightSearchTerm(brandName)}
//           </p>
//           <div className="product-price">
//             <span className="current-price">₹{productPrice}</span>
//             {hasDiscount && (
//               <span className="original-price">₹{originalPrice}</span>
//             )}
//           </div>
//           <p className="product-category">
//             <strong>Category:</strong> {highlightSearchTerm(categoryName)}
//           </p>
//           {p.variants && p.variants.length > 0 && (
//             <p className="product-variants">
//               <strong>Variants:</strong> {p.variants.map(v => 
//                 v.shadeName || "Variant"
//               ).join(", ")}
//             </p>
//           )}
//           <button className="view-product-btn">View Product</button>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="search-page-container">
//       <Header />

//       <div className="search-page-content">
//         <div className="search-page-header">
//           <h1 className="search-title">
//             {query ? `Search Results for "${query}"` : "All Products"}
//           </h1>

//           <div className="search-page-input-container">
//             <div className="search-input-wrapper">
//               <input
//                 type="text"
//                 placeholder="Search by product name, brand, category, description, variants..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 onKeyPress={(e) =>
//                   e.key === "Enter" &&
//                   navigate(`/search?q=${encodeURIComponent(searchTerm)}`)
//                 }
//                 className="search-page-input"
//               />
//               <button
//                 className="search-page-btn"
//                 onClick={handleSearchSubmit}
//               >
//                 <FaSearch />
//               </button>
//             </div>

//             <div className="result-count">
//               {isLoading ? (
//                 "Loading products..."
//               ) : error ? (
//                 <span style={{ color: "#dc3545" }}>{error}</span>
//               ) : (
//                 <>
//                   {query ? (
//                     `Found ${filtered.length} of ${totalProducts} products for "${query}"`
//                   ) : (
//                     `Showing ${filtered.length} of ${totalProducts} total products`
//                   )}
//                 </>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Render Search Statistics */}
//         {renderSearchStats()}

//         {isLoading ? (
//           <div className="loading-container">
//             <div className="spinner"></div>
//             <p>Loading all products...</p>
//             <p className="loading-subtext">
//               This may take a moment as we fetch all available products.
//             </p>
//           </div>
//         ) : error ? (
//           <div className="error-container">
//             <p className="error-message">{error}</p>
//             <button 
//               className="retry-btn"
//               onClick={() => window.location.reload()}
//             >
//               Retry
//             </button>
//             <p className="error-subtext">
//               Check your connection or try again later.
//             </p>
//           </div>
//         ) : filtered.length === 0 && query ? (
//           <div className="no-results">
//             <div className="no-results-icon">🔍</div>
//             <h3>No products found for "{query}"</h3>
//             <p>Try searching with different keywords:</p>
//             <div className="search-suggestions">
//               <button onClick={() => setSearchTerm("Plum")}>Plum</button>
//               <button onClick={() => setSearchTerm("Diwali")}>Diwali</button>
//               <button onClick={() => setSearchTerm("joyory")}>joyory</button>
//               <button onClick={() => setSearchTerm("Foundation")}>Foundation</button>
//               <button onClick={() => setSearchTerm("Face wash")}>Face wash</button>
//               <button onClick={() => setSearchTerm("Skin")}>Skin</button>
//             </div>
//             <div className="search-tips">
//               <p><strong>Search Tips:</strong></p>
//               <ul>
//                 <li>Try searching by product name</li>
//                 <li>Try searching by brand name</li>
//                 <li>Try searching by category (e.g., Makeup, Skincare)</li>
//                 <li>Try searching by variant/shade name</li>
//                 <li>Check your spelling</li>
//               </ul>
//             </div>
//             <p className="no-results-subtext">
//               We have {totalProducts} products in our database. Try browsing all products.
//             </p>
//           </div>
//         ) : filtered.length > 0 ? (
//           <>
//             <div className="search-results-grid">
//               {filtered.map((p) => renderProductCard(p))}
//             </div>

//             <div className="search-footer">
//               <p>
//                 Showing {filtered.length} of {totalProducts} products
//                 {query && ` for "${query}"`}
//               </p>
//               {hasMore && (
//                 <button 
//                   className="load-more-btn"
//                   onClick={() => {
//                     console.log("Load more clicked");
//                   }}
//                 >
//                   Load More Products
//                 </button>
//               )}
//             </div>
//           </>
//         ) : (
//           <div className="no-products">
//             <div className="no-products-icon">📦</div>
//             <h3>No products available</h3>
//             <p>Our product database is currently empty.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SearchPage;









// import React, { useState, useEffect, useCallback } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { FaSearch } from "react-icons/fa";
// import Header from "./Header";
// import axiosInstance from "../utils/axiosInstance.js";
// import "../css/SearchPage.css";

// const SearchPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const query = new URLSearchParams(location.search).get("q") || "";

//   const [searchTerm, setSearchTerm] = useState(query);
//   const [allProducts, setAllProducts] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [totalProducts, setTotalProducts] = useState(0);
//   const [searchDebounce, setSearchDebounce] = useState(null);

//   /* ---------- 1.  FETCH ALL PRODUCTS (ONE-TIME) ---------- */
//   useEffect(() => {
//     const fetchAllProducts = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);

//         let allProductsData = [];
//         let currentCursor = null;
//         let hasMorePages = true;
//         let pageCount = 0;

//         console.log("🔍 Fetching all products...");

//         // Fetch all pages until done
//         while (hasMorePages && pageCount < 10) { // Reduced to 10 pages for faster initial load
//           pageCount++;

//           let url = "/api/user/products/all";
//           if (currentCursor) {
//             url += `?cursor=${currentCursor}`;
//           }

//           const res = await axiosInstance.get(url);

//           if (res.data?.products?.length > 0) {
//             allProductsData = [...allProductsData, ...res.data.products];
//             hasMorePages = res.data.pagination?.hasMore || false;
//             currentCursor = res.data.pagination?.nextCursor || null;

//             if (!hasMorePages || !currentCursor) {
//               break;
//             }
//           } else {
//             break;
//           }
//         }

//         console.log(`✅ Loaded ${allProductsData.length} products`);

//         if (allProductsData.length === 0) {
//           setError("No products found in the database.");
//         }

//         setAllProducts(allProductsData);
//         setTotalProducts(allProductsData.length);

//         // If search query exists, perform search immediately
//         if (query.trim()) {
//           performFastSearch(query, allProductsData);
//         } else {
//           setFiltered(allProductsData);
//         }

//       } catch (err) {
//         console.error("❌ Error fetching products:", err);
//         setError(`Failed to load products: ${err.message}`);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchAllProducts();
//   }, []);

//   /* ---------- 2.  FAST SEARCH FUNCTION (Name, Brand, Category only) ---------- */
//   const performFastSearch = useCallback((searchQuery, productsToSearch = allProducts) => {
//     if (!searchQuery || searchQuery.trim() === "") {
//       setFiltered(productsToSearch);
//       return;
//     }

//     const term = searchQuery.toLowerCase().trim();

//     // Early exit if no products
//     if (productsToSearch.length === 0) {
//       setFiltered([]);
//       return;
//     }

//     console.time("SearchTime");

//     // FAST FILTERING - Only search in 3 fields
//     const results = productsToSearch.filter((p) => {
//       if (!p) return false;

//       // 1. Check Product Name (highest priority)
//       if (p.name && p.name.toLowerCase().includes(term)) {
//         return true;
//       }

//       // 2. Check Brand Name
//       if (p.brand) {
//         const brandName = typeof p.brand === 'string' 
//           ? p.brand.toLowerCase()
//           : p.brand.name?.toLowerCase() || "";
//         if (brandName.includes(term)) {
//           return true;
//         }
//       }

//       // 3. Check Category
//       if (p.category) {
//         const categoryName = typeof p.category === 'string'
//           ? p.category.toLowerCase()
//           : p.category.name?.toLowerCase() || "";
//         if (categoryName.includes(term)) {
//           return true;
//         }
//       }

//       return false;
//     });

//     console.timeEnd("SearchTime");
//     console.log(`⚡ Found ${results.length} products for "${term}"`);

//     setFiltered(results);

//     return results;
//   }, [allProducts]);

//   /* ---------- 3.  DEBOUNCED SEARCH WHEN QUERY CHANGES ---------- */
//   useEffect(() => {
//     if (searchDebounce) {
//       clearTimeout(searchDebounce);
//     }

//     if (allProducts.length > 0 && query) {
//       // Debounce search for faster response
//       const timeoutId = setTimeout(() => {
//         performFastSearch(query, allProducts);
//       }, 50); // Reduced debounce time for faster response

//       setSearchDebounce(timeoutId);
//     } else if (allProducts.length > 0) {
//       setFiltered(allProducts);
//     }

//     return () => {
//       if (searchDebounce) {
//         clearTimeout(searchDebounce);
//       }
//     };
//   }, [query, allProducts]);

//   /* ---------- 4.  INSTANT SEARCH AS USER TYPES ---------- */
//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearchTerm(value);

//     if (searchDebounce) {
//       clearTimeout(searchDebounce);
//     }

//     // Instant search as user types (no debounce for better UX)
//     if (allProducts.length > 0) {
//       performFastSearch(value, allProducts);
//     }
//   };

//   /* ---------- 5.  OPEN PRODUCT ---------- */
//   const openProduct = (p) => {
//     if (p.slugs && p.slugs.length > 0) {
//       navigate(`/product/${p.slugs[0]}`);
//     } else if (p.selectedVariant && p.selectedVariant.slug) {
//       navigate(`/product/${p.selectedVariant.slug}`);
//     } else {
//       navigate(`/product/${p._id}`);
//     }
//   };

//   /* ---------- 6.  HANDLE SEARCH SUBMIT ---------- */
//   const handleSearchSubmit = () => {
//     if (searchTerm.trim()) {
//       navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
//     }
//   };

//   /* ---------- 7.  RENDER PRODUCT CARD ---------- */
//   const renderProductCard = (p) => {
//     const productImage = p.selectedVariant?.images?.[0] ||
//                         p.variants?.[0]?.images?.[0] ||
//                         "/placeholder.png";

//     const productPrice = p.selectedVariant?.displayPrice || 
//                         p.price || 
//                         "N/A";

//     const originalPrice = p.selectedVariant?.originalPrice;
//     const hasDiscount = originalPrice && originalPrice > productPrice;

//     const brandName = p.brand?.name || 
//                      (typeof p.brand === 'string' ? p.brand : "Brand");
//     const categoryName = p.category?.name || 
//                         (typeof p.category === 'string' ? p.category : "Category");

//     const inStock = p.inStock !== false && p.status !== "outOfStock";

//     // Get first 2 variants for display
//     const variantNames = p.variants?.slice(0, 2).map(v => v.shadeName).filter(Boolean);

//     return (
//       <div
//         key={p._id}
//         className="product-card"
//         onClick={() => openProduct(p)}
//       >
//         <div className="product-image-container">
//           <img
//             src={productImage}
//             alt={p.name}
//             className="product-image"
//             loading="lazy"
//             onError={(e) => {
//               e.target.src = "/placeholder.png";
//               e.target.onerror = null;
//             }}
//           />
//           {!inStock && <span className="out-of-stock">Out of Stock</span>}
//           {hasDiscount && <span className="discount-badge">Sale</span>}
//         </div>

//         <div className="product-info">
//           <h3 className="product-name">{p.name}</h3>
//           <div className="product-meta">
//             <span className="product-brand">{brandName}</span>
//             <span className="product-category">{categoryName}</span>
//           </div>
//           <div className="product-price">
//             <span className="current-price">₹{productPrice}</span>
//             {hasDiscount && (
//               <span className="original-price">₹{originalPrice}</span>
//             )}
//           </div>
//           {variantNames && variantNames.length > 0 && (
//             <p className="product-variants">
//               {variantNames.join(", ")}
//               {p.variants?.length > 2 && ` +${p.variants.length - 2} more`}
//             </p>
//           )}
//           <button className="view-product-btn">View Details</button>
//         </div>
//       </div>
//     );
//   };

//   /* ---------- 8.  RENDER SEARCH SUGGESTIONS ---------- */
//   const renderPopularSearches = () => {
//     const popularSearches = [
//       "Lipstick", "Foundation", "Face Wash", "Moisturizer", 
//       "Perfume", "Shampoo", "Serum", "Makeup", "Skincare", "Haircare"
//     ];

//     return (
//       <div className="popular-searches">
//         <h4>Popular Searches:</h4>
//         <div className="popular-search-tags">
//           {popularSearches.map((term) => (
//             <button
//               key={term}
//               className="popular-tag"
//               onClick={() => {
//                 setSearchTerm(term);
//                 navigate(`/search?q=${encodeURIComponent(term)}`);
//               }}
//             >
//               {term}
//             </button>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="search-page-container">
//       <Header />

//       <div className="search-page-content">
//         <div className="search-page-header">
//           <h1 className="search-title">
//             {query ? `Search Results for "${query}"` : "All Products"}
//           </h1>

//           <div className="search-page-input-container">
//             <div className="search-input-wrapper">
//               <input
//                 type="text"
//                 placeholder="Search by name, brand, or category..."
//                 value={searchTerm}
//                 onChange={handleSearchChange}
//                 onKeyPress={(e) =>
//                   e.key === "Enter" && handleSearchSubmit()
//                 }
//                 className="search-page-input"
//                 autoFocus
//               />
//               <button
//                 className="search-page-btn"
//                 onClick={handleSearchSubmit}
//               >
//                 <FaSearch />
//               </button>
//             </div>

//             <div className="result-count">
//               {isLoading ? (
//                 "Loading products..."
//               ) : error ? (
//                 <span className="error-text">{error}</span>
//               ) : (
//                 <>
//                   {query ? (
//                     `Found ${filtered.length} products for "${query}"`
//                   ) : (
//                     `Showing ${filtered.length} products`
//                   )}
//                 </>
//               )}
//             </div>
//           </div>
//         </div>

//         {isLoading ? (
//           <div className="loading-container">
//             <div className="spinner"></div>
//             <p>Loading products...</p>
//           </div>
//         ) : error ? (
//           <div className="error-container">
//             <p className="error-message">{error}</p>
//             <button 
//               className="retry-btn"
//               onClick={() => window.location.reload()}
//             >
//               Retry
//             </button>
//           </div>
//         ) : filtered.length === 0 && query ? (
//           <div className="no-results">
//             <div className="no-results-icon">🔍</div>
//             <h3>No products found for "{query}"</h3>
//             <p>Try searching with different keywords:</p>
//             {renderPopularSearches()}
//             <div className="search-suggestions">
//               <button onClick={() => {
//                 setSearchTerm("Lipstick");
//                 navigate(`/search?q=${encodeURIComponent("Lipstick")}`);
//               }}>Lipstick</button>
//               <button onClick={() => {
//                 setSearchTerm("Foundation");
//                 navigate(`/search?q=${encodeURIComponent("Foundation")}`);
//               }}>Foundation</button>
//               <button onClick={() => {
//                 setSearchTerm("Perfume");
//                 navigate(`/search?q=${encodeURIComponent("Perfume")}`);
//               }}>Perfume</button>
//               <button onClick={() => {
//                 setSearchTerm("Skincare");
//                 navigate(`/search?q=${encodeURIComponent("Skincare")}`);
//               }}>Skincare</button>
//             </div>
//             <p className="no-results-subtext">
//               Can't find what you're looking for? Try browsing all products.
//             </p>
//           </div>
//         ) : filtered.length > 0 ? (
//           <>
//             {/* Quick Filters */}
//             <div className="quick-filters">
//               <span className="filter-label">Quick Filter:</span>
//               <button 
//                 className="filter-btn"
//                 onClick={() => setFiltered(allProducts)}
//               >
//                 All ({allProducts.length})
//               </button>
//               <button 
//                 className="filter-btn"
//                 onClick={() => {
//                   const inStockProducts = allProducts.filter(p => 
//                     p.inStock !== false && p.status !== "outOfStock"
//                   );
//                   setFiltered(inStockProducts);
//                 }}
//               >
//                 In Stock
//               </button>
//               <button 
//                 className="filter-btn"
//                 onClick={() => {
//                   const discountedProducts = allProducts.filter(p => 
//                     p.selectedVariant?.originalPrice > p.selectedVariant?.displayPrice
//                   );
//                   setFiltered(discountedProducts);
//                 }}
//               >
//                 On Sale
//               </button>
//             </div>

//             <div className="search-results-grid">
//               {filtered.map((p) => renderProductCard(p))}
//             </div>

//             <div className="search-footer">
//               <p>
//                 Showing {filtered.length} products
//                 {query && ` for "${query}"`}
//               </p>
//               <div className="view-options">
//                 <button 
//                   className="view-all-btn"
//                   onClick={() => {
//                     setFiltered(allProducts);
//                     setSearchTerm("");
//                     navigate('/search');
//                   }}
//                 >
//                   View All Products
//                 </button>
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="no-products">
//             <div className="no-products-icon">📦</div>
//             <h3>No products available</h3>
//             <p>Check back soon for new arrivals.</p>
//             <button 
//               className="refresh-btn"
//               onClick={() => window.location.reload()}
//             >
//               Refresh Page
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SearchPage;

//================================================================================(Done-Code)-End==============================================================================









// import React, { useState, useEffect, useMemo, useRef } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { FaSearch, FaRegSadTear, FaShoppingCart, FaSpinner, FaSync, FaTimes } from "react-icons/fa";
// import Header from "./Header";
// import axiosInstance from "../utils/axiosInstance.js";
// import "../css/SearchPage.css";

// const SearchPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   // URL Syncing
//   const queryParams = new URLSearchParams(location.search);
//   const initialQuery = queryParams.get("q") || "";
//   const [searchTerm, setSearchTerm] = useState(initialQuery);

//   // Removed useDeferredValue because for 155 items, we want INSTANT results, not laggy ones.

//   const [allProducts, setAllProducts] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSyncing, setIsSyncing] = useState(false);
//   const [error, setError] = useState(null);

//   const hasFetched = useRef(false);

//   /* -------------------------------------------------------------------------- */
//   /* 1. ROBUST DATA FETCHING (Fixes "Not showing products")                      */
//   /* -------------------------------------------------------------------------- */
//   useEffect(() => {
//     if (hasFetched.current) return;

//     const fetchEverySingleProduct = async () => {
//       try {
//         setIsLoading(true);
//         setIsSyncing(true);

//         let currentCursor = null;
//         let hasMore = true;
//         const productMap = new Map(); // Prevents duplicates

//         while (hasMore) {
//           const response = await axiosInstance.get(`/api/user/products/all`, {
//             params: { cursor: currentCursor }
//           });

//           // --- FIX 1: Handle different API Response Formats ---
//           let products = [];
//           let pagination = {};

//           if (Array.isArray(response.data)) {
//             // Case A: API returns raw array [ ... ]
//             products = response.data;
//           } else if (response.data && Array.isArray(response.data.products)) {
//             // Case B: API returns object { products: [...], pagination: {...} }
//             products = response.data.products;
//             pagination = response.data.pagination;
//           } else {
//             // Case C: Unknown format, stop to prevent errors
//             console.warn("Unexpected API format:", response.data);
//             hasMore = false;
//             break;
//           }

//           // Process products if we have them
//           if (products.length > 0) {
//             products.forEach(p => productMap.set(p._id, p));
//             // Update state incrementally so user sees items appearing
//             setAllProducts(Array.from(productMap.values()));
//           }

//           // --- FIX 2: Robust Loop Logic ---
//           // Only stop if pagination explicitly says hasMore is false
//           if (pagination && pagination.hasMore === false) {
//             hasMore = false;
//           } else if (pagination && pagination.nextCursor) {
//             currentCursor = pagination.nextCursor;
//           } else {
//             // If no pagination info exists, assume we are done after this batch
//             hasMore = false;
//           }
//         }

//         hasFetched.current = true;
//       } catch (err) {
//         console.error("Fetch Error:", err);
//         setError("We couldn't load the inventory. Please try again.");
//       } finally {
//         setIsLoading(false);
//         setIsSyncing(false);
//       }
//     };

//     fetchEverySingleProduct();
//   }, []);

//   /* -------------------------------------------------------------------------- */
//   /* 2. INSTANT SEARCH LOGIC (Fixes "Search not working")                        */
//   /* -------------------------------------------------------------------------- */
//   const filteredProducts = useMemo(() => {
//     // If no search term, show everything
//     const cleanTerm = searchTerm.toLowerCase().trim();
//     if (!cleanTerm) return allProducts;

//     // Split search into words (e.g. "red lipstick" -> ["red", "lipstick"])
//     const searchWords = cleanTerm.split(/\s+/);

//     return allProducts.filter((p) => {
//       // Combine all searchable fields into one string
//       const productName = (p.name || "").toLowerCase();
//       const brandName = (p.brand?.name || "").toLowerCase();
//       const categoryName = (p.category?.name || "").toLowerCase();
//       const variants = p.variants?.map(v => (v.shadeName || "").toLowerCase()).join(" ") || "";

//       const searchableString = `${productName} ${brandName} ${categoryName} ${variants}`;

//       // Check if ALL search words exist in the product info
//       return searchWords.every(word => searchableString.includes(word));
//     });
//   }, [searchTerm, allProducts]);

//   /* -------------------------------------------------------------------------- */
//   /* 3. HANDLERS                                                                */
//   /* -------------------------------------------------------------------------- */
//   const handleInputChange = (e) => {
//     const val = e.target.value;
//     setSearchTerm(val);

//     // Update URL (Debounced slightly for performance)
//     const params = new URLSearchParams(window.location.search);
//     if (val) params.set("q", val);
//     else params.delete("q");
//     navigate({ search: params.toString() }, { replace: true });
//   };

//   const clearSearch = () => {
//     setSearchTerm("");
//   };

//   const getDisplayData = (p) => {
//     const v = p.selectedVariant || p.variants?.[0] || {};
//     return {
//       img: v.images?.[0] || "/placeholder.png",
//       name: p.name,
//       brand: p.brand?.name || "Premium",
//       price: v.displayPrice || p.price || 0,
//       mrp: v.originalPrice || 0,
//       discount: v.discountPercent || 0,
//       slug: v.slug || p.slugs?.[0] || p._id,
//       inStock: p.inStock && p.status === "inStock"
//     };
//   };

//   /* -------------------------------------------------------------------------- */
//   /* 4. RENDER                                                                  */
//   /* -------------------------------------------------------------------------- */
//   return (
//     <div className="search-page-container">
//       <Header />
//       <div className="search-main-wrapper">
//         {/* Top Search Bar */}
//         <div className="search-header-sticky">
//           <div className="search-input-container">
//             <FaSearch className="inner-search-icon" />
//             <input
//               type="text"
//               placeholder="Search products, brands, or categories..."
//               value={searchTerm}
//               onChange={handleInputChange}
//               autoFocus
//             />
//             {searchTerm && (
//               <FaTimes className="clear-icon" onClick={clearSearch} title="Clear search" />
//             )}
//             {isSyncing && <FaSync className="spin sync-icon" title="Syncing Inventory..." />}
//           </div>

//           <div className="search-results-meta">
//             {isLoading ? (
//               <span>Initializing catalog...</span>
//             ) : (
//               <p>
//                 Showing <b>{filteredProducts.length}</b> items
//                 {searchTerm && <> for "<b>{searchTerm}</b>"</>}
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Content Area */}
//         <div className="search-results-grid">
//           {isLoading && allProducts.length === 0 ? (
//             <div className="loading-state">
//               <FaSpinner className="spin large-spinner" />
//               <p>Loading your store...</p>
//             </div>
//           ) : error ? (
//             <div className="error-box">
//               <FaRegSadTear size={40} />
//               <p>{error}</p>
//               <button onClick={() => window.location.reload()}>Retry</button>
//             </div>
//           ) : filteredProducts.length === 0 ? (
//             <div className="no-results">
//               <h3>No matches found</h3>
//               <p>Try different keywords or check your spelling.</p>
//             </div>
//           ) : (
//             <div className="grid-layout">
//               {filteredProducts.map((p) => {
//                 const item = getDisplayData(p);
//                 return (
//                   <div key={p._id} className="product-card-modern" onClick={() => navigate(`/product/${item.slug}`)}>
//                     <div className="image-box">
//                       <img src={item.img} alt={item.name} loading="lazy" />
//                       {item.discount > 0 && <span className="discount-tag">-{item.discount}%</span>}
//                       {!item.inStock && <div className="oos-overlay">Sold Out</div>}
//                     </div>
//                     <div className="info-box">
//                       <span className="brand-name">{item.brand}</span>
//                       <h3 className="product-name">{item.name}</h3>
//                       <div className="price-box">
//                         <span className="current-price">₹{item.price}</span>
//                         {item.discount > 0 && <span className="old-price">₹{item.mrp}</span>}
//                         <button className="add-to-cart-small"><FaShoppingCart /></button>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SearchPage;






















// import React, { useState, useEffect, useMemo, useRef } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { FaSearch, FaRegSadTear, FaSpinner, FaSync, FaTimes, FaHeart, FaRegHeart } from "react-icons/fa";
// import Header from "./Header";
// import Footer from "./Footer"; // Assuming you have Footer, add if needed
// import axiosInstance from "../utils/axiosInstance.js";
// import "../css/SearchPage.css";
// import Bag from "../assets/Bag.svg"; // Same Bag icon as your original detailed design

// const CART_API_BASE = "/api/user/cart"; // Adjust if your axiosInstance already includes base

// // ==================== HELPER FUNCTIONS (Same as your detailed design) ====================
// const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || 'default'}`;
// const isValidHexColor = (hex) => {
//   if (!hex || typeof hex !== "string") return false;
//   const normalized = hex.trim().toLowerCase();
//   return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(normalized);
// };
// const getVariantDisplayText = (variant) => {
//   return (
//     variant.shadeName ||
//     variant.name ||
//     variant.size ||
//     variant.ml ||
//     variant.weight ||
//     "Default"
//   ).toUpperCase();
// };
// const groupVariantsByType = (variants) => {
//   const grouped = { color: [], text: [] };
//   variants.forEach((v) => {
//     if (!v) return;
//     if (v.hex && isValidHexColor(v.hex)) {
//       grouped.color.push(v);
//     } else {
//       grouped.text.push(v);
//     }
//   });
//   return grouped;
// };
// const getBrandName = (product) => {
//   if (!product?.brand) return "Unknown Brand";
//   if (typeof product.brand === "object" && product.brand.name) return product.brand.name;
//   if (typeof product.brand === "string") return product.brand;
//   return "Unknown Brand";
// };

// // ==================== MAIN COMPONENT ====================
// const SearchPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   // URL Syncing
//   const queryParams = new URLSearchParams(location.search);
//   const initialQuery = queryParams.get("q") || "";
//   const [searchTerm, setSearchTerm] = useState(initialQuery);

//   const [allProducts, setAllProducts] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSyncing, setIsSyncing] = useState(false);
//   const [error, setError] = useState(null);
//   const hasFetched = useRef(false);

//   // ==================== DETAILED CARD STATES ====================
//   const [selectedVariants, setSelectedVariants] = useState({});
//   const [addingToCart, setAddingToCart] = useState({});
//   const [wishlistLoading, setWishlistLoading] = useState({});
//   const [wishlistData, setWishlistData] = useState([]);
//   const [showVariantOverlay, setShowVariantOverlay] = useState(null);
//   const [selectedVariantType, setSelectedVariantType] = useState("all");

//   // Toast Utility (Same as detailed design)
//   const showToastMsg = (message, type = "error", duration = 3000) => {
//     const toast = document.createElement("div");
//     toast.className = `toast-notification toast-${type}`;
//     toast.style.cssText = `
//       position: fixed;
//       top: 20px;
//       right: 20px;
//       padding: 12px 20px;
//       border-radius: 8px;
//       color: #fff;
//       background-color: ${type === "error" ? "#f56565" : "#48bb78"};
//       z-index: 9999;
//       box-shadow: 0 4px 12px rgba(0,0,0,0.15);
//     `;
//     toast.textContent = message;
//     document.body.appendChild(toast);
//     setTimeout(() => toast.remove(), duration);
//   };

//   // ==================== GUEST WISHLIST (LocalStorage only) ====================
//   const isInWishlist = (productId, sku) => {
//     if (!productId || !sku) return false;
//     return wishlistData.some(item => item._id === productId && item.sku === sku);
//   };

//   const fetchWishlistData = () => {
//     const localWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];
//     setWishlistData(localWishlist);
//   };

//   const toggleWishlist = async (prod, variant) => {
//     if (!prod || !variant) {
//       showToastMsg("Please select a variant first", "error");
//       return;
//     }
//     const productId = prod._id;
//     const sku = getSku(variant);
//     setWishlistLoading(prev => ({ ...prev, [productId]: true }));

//     try {
//       const currentlyInWishlist = isInWishlist(productId, sku);
//       const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];

//       if (currentlyInWishlist) {
//         const updatedWishlist = guestWishlist.filter(item => !(item._id === productId && item.sku === sku));
//         localStorage.setItem("guestWishlist", JSON.stringify(updatedWishlist));
//         showToastMsg("Removed from wishlist!", "success");
//       } else {
//         const productData = {
//           _id: productId,
//           name: prod.name,
//           brand: getBrandName(prod),
//           price: variant.discountedPrice || variant.displayPrice || prod.price || 0,
//           originalPrice: variant.originalPrice || variant.mrp || prod.mrp || prod.price || 0,
//           displayPrice: variant.discountedPrice || variant.displayPrice || prod.price || 0,
//           image: variant.images?.[0] || prod.images?.[0] || "/placeholder.png",
//           slug: prod.slugs?.[0] || prod.slug || prod._id,
//           sku: sku,
//           variantName: variant.shadeName || variant.name || "Default",
//           stock: variant.stock || 0,
//           status: variant.stock > 0 ? "inStock" : "outOfStock",
//           avgRating: prod.avgRating || 0,
//           totalRatings: prod.totalRatings || 0,
//           discountPercent: variant.originalPrice && variant.discountedPrice && variant.originalPrice > variant.discountedPrice
//             ? Math.round(((variant.originalPrice - variant.discountedPrice) / variant.originalPrice) * 100)
//             : 0
//         };
//         guestWishlist.push(productData);
//         localStorage.setItem("guestWishlist", JSON.stringify(guestWishlist));
//         showToastMsg("Added to wishlist!", "success");
//       }
//       fetchWishlistData();
//     } catch (error) {
//       showToastMsg("Failed to update wishlist", "error");
//     } finally {
//       setWishlistLoading(prev => ({ ...prev, [productId]: false }));
//     }
//   };

//   useEffect(() => {
//     fetchWishlistData();
//   }, []);

//   // ==================== INITIAL VARIANT SELECTION ====================
//   useEffect(() => {
//     if (allProducts.length > 0) {
//       const newSelectedVariants = { ...selectedVariants };
//       allProducts.forEach((prod) => {
//         if (newSelectedVariants[prod._id]) return; // Already set
//         const variants = Array.isArray(prod.variants) ? prod.variants : [];
//         if (variants.length > 0) {
//           const firstInStockVariant = variants.find(v => v.stock > 0);
//           newSelectedVariants[prod._id] = firstInStockVariant || variants[0];
//         }
//       });
//       setSelectedVariants(newSelectedVariants);
//     }
//   }, [allProducts]);

//   // ==================== DATA FETCHING (All products, incremental) ====================
//   useEffect(() => {
//     if (hasFetched.current) return;

//     const fetchEverySingleProduct = async () => {
//       try {
//         setIsLoading(true);
//         setIsSyncing(true);

//         let currentCursor = null;
//         let hasMore = true;
//         const productMap = new Map();

//         while (hasMore) {
//           const response = await axiosInstance.get(`/api/user/products/all`, {
//             params: { cursor: currentCursor }
//           });

//           let products = [];
//           let pagination = {};
//           if (Array.isArray(response.data)) {
//             products = response.data;
//           } else if (response.data && Array.isArray(response.data.products)) {
//             products = response.data.products;
//             pagination = response.data.pagination || {};
//           }

//           if (products.length > 0) {
//             products.forEach(p => productMap.set(p._id, p));
//             setAllProducts(Array.from(productMap.values()));
//           }

//           if (pagination.hasMore === false) {
//             hasMore = false;
//           } else if (pagination.nextCursor) {
//             currentCursor = pagination.nextCursor;
//           } else {
//             hasMore = false;
//           }
//         }

//         hasFetched.current = true;
//       } catch (err) {
//         console.error("Fetch Error:", err);
//         setError("We couldn't load the inventory. Please try again.");
//       } finally {
//         setIsLoading(false);
//         setIsSyncing(false);
//       }
//     };

//     fetchEverySingleProduct();
//   }, []);

//   // ==================== CLIENT-SIDE SEARCH ====================
//   const filteredProducts = useMemo(() => {
//     const cleanTerm = searchTerm.toLowerCase().trim();
//     if (!cleanTerm) return allProducts;

//     const searchWords = cleanTerm.split(/\s+/);
//     return allProducts.filter((p) => {
//       const productName = (p.name || "").toLowerCase();
//       const brandName = (getBrandName(p) || "").toLowerCase();
//       const categoryName = (p.category?.name || "").toLowerCase();
//       const variantsText = p.variants?.map(v => (v.shadeName || v.name || "").toLowerCase()).join(" ") || "";
//       const searchable = `${productName} ${brandName} ${categoryName} ${variantsText}`;
//       return searchWords.every(word => searchable.includes(word));
//     });
//   }, [searchTerm, allProducts]);

//   // ==================== HANDLERS ====================
//   const handleInputChange = (e) => {
//     const val = e.target.value;
//     setSearchTerm(val);

//     const params = new URLSearchParams(window.location.search);
//     if (val) params.set("q", val);
//     else params.delete("q");
//     navigate({ search: params.toString() }, { replace: true });
//   };

//   const clearSearch = () => {
//     setSearchTerm("");
//     navigate("/search", { replace: true });
//   };

//   const handleVariantSelect = (productId, variant) => {
//     if (variant.stock <= 0) {
//       showToastMsg("This variant is out of stock", "error");
//       return;
//     }
//     setSelectedVariants(prev => ({ ...prev, [productId]: variant }));
//   };

//   const openVariantOverlay = (productId, type = "all") => {
//     setSelectedVariantType(type);
//     setShowVariantOverlay(productId);
//   };

//   const closeVariantOverlay = () => {
//     setShowVariantOverlay(null);
//     setSelectedVariantType("all");
//   };

//   const getProductSlug = (product) => {
//     return product.slugs?.[0] || product.slug || product._id;
//   };

//   const handleAddToCart = async (prod) => {
//     setAddingToCart(prev => ({ ...prev, [prod._id]: true }));
//     try {
//       const variants = Array.isArray(prod.variants) ? prod.variants : [];
//       const hasVariants = variants.length > 0;
//       let payload;

//       if (hasVariants) {
//         const selectedVariant = selectedVariants[prod._id];
//         if (!selectedVariant) {
//           showToastMsg("Please select a variant.", "error");
//           return;
//         }
//         if (selectedVariant.stock <= 0) {
//           showToastMsg("Selected variant is out of stock.", "error");
//           return;
//         }
//         payload = {
//           productId: prod._id,
//           variants: [{ variantSku: getSku(selectedVariant), quantity: 1 }],
//         };
//         const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
//         cache[prod._id] = selectedVariant;
//         localStorage.setItem("cartVariantCache", JSON.stringify(cache));
//       } else {
//         if (prod.stock <= 0) {
//           showToastMsg("Product is out of stock.", "error");
//           return;
//         }
//         payload = { productId: prod._id, quantity: 1 };
//         const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
//         delete cache[prod._id];
//         localStorage.setItem("cartVariantCache", JSON.stringify(cache));
//       }

//       await axiosInstance.post(`${CART_API_BASE}/add`, payload);
//       showToastMsg("Product added to cart!", "success");
//       navigate("/cartpage");
//     } catch (err) {
//       console.error("Add to Cart error:", err);
//       showToastMsg(err.response?.data?.message || "Failed to add to cart", "error");
//       if (err.response?.status === 401) {
//         navigate("/login");
//       }
//     } finally {
//       setAddingToCart(prev => ({ ...prev, [prod._id]: false }));
//     }
//   };

//   // ==================== DETAILED PRODUCT CARD (Exact same as your original design) ====================
//   const renderProductCard = (prod) => {
//     const variants = Array.isArray(prod.variants) ? prod.variants : [];
//     const hasVariants = variants.length > 0;
//     const selectedVariant = selectedVariants[prod._id];
//     const grouped = groupVariantsByType(variants);
//     const totalVariants = variants.length;

//     const selectedSku = selectedVariant ? getSku(selectedVariant) : null;
//     const isProductInWishlist = selectedSku ? isInWishlist(prod._id, selectedSku) : false;
//     const productSlug = getProductSlug(prod);
//     const imageUrl = selectedVariant?.images?.[0] || selectedVariant?.image || prod.images?.[0] || "/placeholder.png";

//     const initialColors = grouped.color.slice(0, 4);
//     const initialText = grouped.text.slice(0, 2);

//     const isAdding = addingToCart[prod._id];
//     const noVariantSelected = hasVariants && !selectedVariant;
//     const outOfStock = hasVariants ? (selectedVariant?.stock <= 0) : (prod.stock <= 0);
//     const buttonDisabled = isAdding || noVariantSelected || outOfStock;
//     const buttonText = isAdding ? "Adding..." : noVariantSelected ? "Select Variant" : outOfStock ? "Out of Stock" : "Add to Cart";

//     return (
//       <div key={prod._id} className="col-6 col-md-4 col-lg-4 position-relative page-title-main-name">
//         {/* Wishlist Heart */}
//         <button
//           onClick={() => (selectedVariant || !hasVariants) && toggleWishlist(prod, selectedVariant || {})}
//           disabled={wishlistLoading[prod._id]}
//           style={{
//             position: "absolute",
//             top: "8px",
//             right: "8px",
//             cursor: wishlistLoading[prod._id] ? "not-allowed" : "pointer",
//             color: isProductInWishlist ? "#dc3545" : "#ccc",
//             fontSize: "22px",
//             zIndex: 2,
//             backgroundColor: "rgba(255, 255, 255, 0.9)",
//             borderRadius: "50%",
//             width: "34px",
//             height: "34px",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//             transition: "all 0.3s ease",
//             border: "none",
//           }}
//         >
//           {wishlistLoading[prod._id] ? (
//             <div className="spinner-border spinner-border-sm" role="status"></div>
//           ) : isProductInWishlist ? (
//             <FaHeart />
//           ) : (
//             <FaRegHeart />
//           )}
//         </button>

//         {/* Image */}
//         <div style={{ position: "relative" }}>
//           <img
//             src={imageUrl}
//             alt={prod.name}
//             className="card-img-top"
//             style={{
//               height: "200px",
//               objectFit: "contain",
//               cursor: "pointer",
//               opacity: outOfStock ? 0.5 : 1,
//             }}
//             onClick={() => navigate(`/product/${productSlug}`)}
//           />
//           {outOfStock && (
//             <div style={{
//               position: "absolute",
//               top: 0,
//               left: 0,
//               width: "100%",
//               height: "200px",
//               backgroundColor: "rgba(0, 0, 0, 0.3)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               pointerEvents: "none",
//             }}>
//               <div style={{
//                 backgroundColor: "rgba(255, 0, 0, 0.8)",
//                 color: "white",
//                 padding: "8px 16px",
//                 borderRadius: "4px",
//                 fontWeight: "bold",
//                 fontSize: "14px",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "5px",
//               }}>
//                 <FaTimes />
//                 Out of Stock
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="card-body p-0 d-flex flex-column" style={{ height: "265px" }}>
//           <div className="brand-name text-muted small mb-1 fw-medium">{getBrandName(prod)}</div>
//           <h5
//             className="card-title mt-2 align-items-center gap-1 page-title-main-name"
//             style={{ cursor: "pointer", overflow: "visible" }}
//             onClick={() => navigate(`/product/${productSlug}`)}
//           >
//             {prod.name}
//             {selectedVariant && selectedVariant.shadeName && (
//               <div className="text-black fw-normal fs-6" style={{ marginTop: "-2px" }}>
//                 {getVariantDisplayText(selectedVariant)}
//               </div>
//             )}
//           </h5>

//           {/* Variant Selection */}
//           {hasVariants && (
//             <div className="variant-section mt-3">
//               {grouped.color.length > 0 && (
//                 <div className="d-flex flex-wrap gap-2 mb-2">
//                   {initialColors.map((v) => {
//                     const isSelected = selectedVariant?.sku === v.sku;
//                     const isOutOfStock = v.stock <= 0;
//                     return (
//                       <div
//                         key={v.sku || v._id}
//                         className="color-circle"
//                         style={{
//                           width: "28px",
//                           height: "28px",
//                           borderRadius: "20%",
//                           backgroundColor: v.hex || "#ccc",
//                           border: isSelected ? "3px solid #000" : "1px solid #ddd",
//                           cursor: isOutOfStock ? "not-allowed" : "pointer",
//                           opacity: isOutOfStock ? 0.3 : 1,
//                           position: "relative",
//                         }}
//                         onClick={() => handleVariantSelect(prod._id, v)}
//                         title={isOutOfStock ? "Out of Stock" : v.shadeName || v.name}
//                       >
//                         {isSelected && !isOutOfStock && (
//                           <span style={{
//                             position: "absolute",
//                             top: "50%",
//                             left: "50%",
//                             transform: "translate(-50%, -50%)",
//                             color: "#fff",
//                             fontSize: "14px",
//                             fontWeight: "bold",
//                           }}>✓</span>
//                         )}
//                         {isOutOfStock && (
//                           <span style={{
//                             position: "absolute",
//                             top: "50%",
//                             left: "50%",
//                             transform: "translate(-50%, -50%)",
//                             color: "#dc3545",
//                             fontSize: "16px",
//                             fontWeight: "bold",
//                           }}>✕</span>
//                         )}
//                       </div>
//                     );
//                   })}
//                   {grouped.color.length > 4 && (
//                     <button
//                       className="more-btn"
//                       onClick={() => openVariantOverlay(prod._id, "color")}
//                       style={{
//                         width: "28px",
//                         height: "28px",
//                         borderRadius: "6px",
//                         background: "#f5f5f5",
//                         border: "1px solid #ddd",
//                         fontSize: "10px",
//                         fontWeight: "bold",
//                       }}
//                     >
//                       +{grouped.color.length - 4}
//                     </button>
//                   )}
//                 </div>
//               )}

//               {grouped.text.length > 0 && (
//                 <div className="d-flex flex-wrap gap-2">
//                   {initialText.map((v) => {
//                     const isSelected = selectedVariant?.sku === v.sku;
//                     const isOutOfStock = v.stock <= 0;
//                     return (
//                       <div
//                         key={v.sku || v._id}
//                         className={`variant-text page-title-main-name ${isSelected ? "selected" : ""} ${isOutOfStock ? "out-of-stock" : ""}`}
//                         style={{
//                           padding: "6px 12px",
//                           borderRadius: "6px",
//                           border: isSelected ? "2px solid #000" : isOutOfStock ? "2px solid #dc3545" : "1px solid #ddd",
//                           background: isSelected ? "#000" : isOutOfStock ? "rgba(220, 53, 69, 0.1)" : "#fff",
//                           color: isSelected ? "#fff" : isOutOfStock ? "#dc3545" : "#000",
//                           fontSize: "13px",
//                           cursor: isOutOfStock ? "not-allowed" : "pointer",
//                           opacity: isOutOfStock ? 0.7 : 1,
//                           textTransform: "lowercase",
//                           position: "relative",
//                         }}
//                         onClick={() => handleVariantSelect(prod._id, v)}
//                       >
//                         {getVariantDisplayText(v)}
//                         {isOutOfStock && (
//                           <span style={{
//                             position: "absolute",
//                             top: "-5px",
//                             right: "-5px",
//                             color: "#dc3545",
//                             fontSize: "10px",
//                             fontWeight: "bold",
//                           }}>✕</span>
//                         )}
//                       </div>
//                     );
//                   })}
//                   {grouped.text.length > 2 && (
//                     <button
//                       className="more-btn page-title-main-name"
//                       onClick={() => openVariantOverlay(prod._id, "text")}
//                       style={{
//                         padding: "6px 12px",
//                         borderRadius: "6px",
//                         background: "#f5f5f5",
//                         border: "1px solid #ddd",
//                         fontSize: "12px",
//                       }}
//                     >
//                       +{grouped.text.length - 2}
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Price */}
//           <p className="fw-bold mb-3 mt-3 page-title-main-name" style={{ fontSize: "16px" }}>
//             {(() => {
//               const price = selectedVariant?.displayPrice || selectedVariant?.discountedPrice || prod.price || 0;
//               const original = selectedVariant?.originalPrice || selectedVariant?.mrp || prod.mrp || price;
//               const hasDiscount = original > price;
//               const percent = hasDiscount ? Math.round(((original - price) / original) * 100) : 0;
//               return hasDiscount ? (
//                 <>
//                   ₹{price}
//                   <span style={{ textDecoration: "line-through", color: "#888", marginLeft: "8px" }}>
//                     ₹{original}
//                   </span>
//                   <span style={{ color: "#e53e3e", marginLeft: "8px", fontWeight: "600" }}>
//                     ({percent}% OFF)
//                   </span>
//                 </>
//               ) : (
//                 <>₹{original}</>
//               );
//             })()}
//           </p>

//           {/* Add to Cart Button */}
//           <div className="mt-auto">
//             <button
//               className={`page-title-main-name add-to-cart-product-page w-100 d-flex align-items-center justify-content-center gap-2 ${isAdding ? "bg-black text-white" : ""} ${outOfStock ? "btn-out-of-stock" : ""}`}
//               onClick={() => handleAddToCart(prod)}
//               disabled={buttonDisabled}
//               style={{
//                 cursor: buttonDisabled ? "not-allowed" : "pointer",
//               }}
//             >
//               {isAdding ? (
//                 <>
//                   <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//                   Adding...
//                 </>
//               ) : (
//                 <>
//                   {buttonText}
//                   {!buttonDisabled && !isAdding && !outOfStock && <img src={Bag} alt="Bag" style={{ height: "20px" }} />}
//                   {outOfStock && <FaTimes style={{ marginLeft: "5px", fontSize: "14px" }} />}
//                 </>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Variant Overlay */}
//         {showVariantOverlay === prod._id && (
//           <div className="variant-overlay" onClick={closeVariantOverlay}>
//             <div
//               className="variant-overlay-content"
//               onClick={(e) => e.stopPropagation()}
//               style={{
//                 width: "100%",
//                 maxWidth: "500px",
//                 maxHeight: "80vh",
//                 background: "#fff",
//                 borderRadius: "12px",
//                 overflow: "hidden",
//                 display: "flex",
//                 flexDirection: "column",
//               }}
//             >
//               <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
//                 <h5 className="m-0">Select Variant ({totalVariants})</h5>
//                 <button onClick={closeVariantOverlay} style={{ background: "none", border: "none", fontSize: "24px" }}>×</button>
//               </div>
//               <div className="variant-tabs d-flex">
//                 <button className={`variant-tab flex-fill py-3 ${selectedVariantType === "all" ? "active" : ""}`} onClick={() => setSelectedVariantType("all")}>
//                   All ({totalVariants})
//                 </button>
//                 {grouped.color.length > 0 && (
//                   <button className={`variant-tab flex-fill py-3 ${selectedVariantType === "color" ? "active" : ""}`} onClick={() => setSelectedVariantType("color")}>
//                     Colors ({grouped.color.length})
//                   </button>
//                 )}
//                 {grouped.text.length > 0 && (
//                   <button className={`variant-tab flex-fill py-3 ${selectedVariantType === "text" ? "active" : ""}`} onClick={() => setSelectedVariantType("text")}>
//                     Sizes ({grouped.text.length})
//                   </button>
//                 )}
//               </div>
//               <div className="p-3 overflow-auto flex-grow-1">
//                 {/* Same overlay content as your original detailed code */}
//                 {(selectedVariantType === "all" || selectedVariantType === "color") && grouped.color.length > 0 && (
//                   <div className="row row-col-4 g-3 mb-4">
//                     {grouped.color.map((v) => {
//                       const isSelected = selectedVariant?.sku === v.sku;
//                       const isOutOfStock = v.stock <= 0;
//                       return (
//                         <div className="col" key={v.sku || v._id}>
//                           <div className="text-center" style={{ cursor: isOutOfStock ? "not-allowed" : "pointer" }} onClick={() => !isOutOfStock && (handleVariantSelect(prod._id, v), closeVariantOverlay())}>
//                             <div style={{
//                               width: "25px",
//                               height: "25px",
//                               borderRadius: "20%",
//                               backgroundColor: v.hex || "#ccc",
//                               margin: "0 auto",
//                               border: isSelected ? "2px solid #000" : "2px solid #ddd",
//                               opacity: isOutOfStock ? 0.4 : 1,
//                               position: "relative",
//                             }}>
//                               {isOutOfStock && <FaTimes style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "#dc3545", fontSize: "20px" }} />}
//                             </div>
//                             <div className="small mt-1">{getVariantDisplayText(v)}</div>
//                             {isOutOfStock && <div className="text-danger small">Out of Stock</div>}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//                 {(selectedVariantType === "all" || selectedVariantType === "text") && grouped.text.length > 0 && (
//                   <div className="row row-cols-3 g-3">
//                     {grouped.text.map((v) => {
//                       const isSelected = selectedVariant?.sku === v.sku;
//                       const isOutOfStock = v.stock <= 0;
//                       return (
//                         <div className="col" key={v.sku || v._id}>
//                           <div className="text-center" style={{ cursor: isOutOfStock ? "not-allowed" : "pointer" }} onClick={() => !isOutOfStock && (handleVariantSelect(prod._id, v), closeVariantOverlay())}>
//                             <div style={{
//                               padding: "12px",
//                               borderRadius: "8px",
//                               border: isSelected ? "3px solid #000" : isOutOfStock ? "2px solid #dc3545" : "1px solid #ddd",
//                               background: isSelected ? "#000" : isOutOfStock ? "rgba(220,53,69,0.1)" : "#fff",
//                               color: isSelected ? "#fff" : isOutOfStock ? "#dc3545" : "#000",
//                               minHeight: "50px",
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center",
//                             }}>
//                               {getVariantDisplayText(v)}
//                             </div>
//                             {isOutOfStock && <div className="text-danger small mt-1">Out of Stock</div>}
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

//   // ==================== RENDER ====================
//   return (
//     <div className="search-page-container">
//       <Header />
//       <div className="search-main-wrapper">
//         {/* Sticky Search Bar */}
//         <div className="search-header-sticky">
//           <div className="search-input-container">
//             <FaSearch className="inner-search-icon" />
//             <input className="page-title-main-name"
//               type="text"
//               placeholder="Search products, brands, or categories..."
//               value={searchTerm}
//               onChange={handleInputChange}
//               autoFocus
//             />
//             {searchTerm && <FaTimes className="clear-icon" onClick={clearSearch} />}
//             {isSyncing && <FaSync className="spin sync-icon" title="Syncing Inventory..." />}
//           </div>
//           <div className="search-results-meta page-title-main-name">
//             {isLoading ? (
//               <span>Initializing catalog...</span>
//             ) : (
//               <p>
//                 Showing <b>{filteredProducts.length}</b> items
//                 {searchTerm && <> for "<b>{searchTerm}</b>"</>}
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Results Grid */}
//         <div className="search-results-grid container-lg py-4">
//           {isLoading && allProducts.length === 0 ? (
//             <div className="loading-state">
//               <FaSpinner className="spin large-spinner" />
//               <p>Loading your store...</p>
//             </div>
//           ) : error ? (
//             <div className="error-box">
//               <FaRegSadTear size={40} />
//               <p>{error}</p>
//               <button onClick={() => window.location.reload()}>Retry</button>
//             </div>
//           ) : filteredProducts.length === 0 ? (
//             <div className="no-results text-center py-5">
//               <FaSearch size={64} className="text-muted mb-3" />
//               <h3>No matches found</h3>
//               <p className="text-muted">Try different keywords or check your spelling.</p>
//               {searchTerm && (
//                 <button className="btn btn-dark mt-3" onClick={clearSearch}>
//                   Clear Search
//                 </button>
//               )}
//             </div>
//           ) : (
//             <div className="row g-4">
//               {filteredProducts.map(renderProductCard)}
//             </div>
//           )}
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default SearchPage;










//==============================================================================Done-Code(Start)==========================================================================













// import React, { useState, useEffect, useMemo, useRef, useCallback, useContext } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { FaSearch, FaRegSadTear, FaSpinner, FaSync, FaTimes, FaHeart, FaRegHeart, FaChevronDown } from "react-icons/fa";
// import Header from "./Header";
// import Footer from "./Footer";
// import axiosInstance from "../utils/axiosInstance.js";
// import { CartContext } from "../context/CartContext";
// import { UserContext } from "./UserContext.jsx";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "../css/SearchPage.css";
// import Bag from "../assets/Bag.svg";

// const CART_API_BASE = "/api/user/cart";
// const WISHLIST_CACHE_KEY = "guestWishlist";

// // ==================== HELPER FUNCTIONS ====================
// const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || 'default'}`;

// const isValidHexColor = (hex) => {
//   if (!hex || typeof hex !== "string") return false;
//   const normalized = hex.trim().toLowerCase();
//   return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(normalized);
// };

// const getVariantDisplayText = (variant) => {
//   return (
//     variant.shadeName ||
//     variant.name ||
//     variant.size ||
//     variant.ml ||
//     variant.weight ||
//     "Default"
//   ).toUpperCase();
// };

// const groupVariantsByType = (variants) => {
//   const grouped = { color: [], text: [] };
//   variants.forEach((v) => {
//     if (!v) return;
//     if (v.hex && isValidHexColor(v.hex)) {
//       grouped.color.push(v);
//     } else {
//       grouped.text.push(v);
//     }
//   });
//   return grouped;
// };

// const getBrandName = (product) => {
//   if (!product?.brand) return "Unknown Brand";
//   if (typeof product.brand === "object" && product.brand.name) return product.brand.name;
//   if (typeof product.brand === "string") return product.brand;
//   return "Unknown Brand";
// };

// const getVariantName = (variant) => {
//   if (!variant) return "Default";
//   const nameSources = [
//     variant.shadeName,
//     variant.name,
//     variant.variantName,
//     variant.size,
//     variant.ml,
//     variant.weight
//   ];
//   for (const source of nameSources) {
//     if (source && typeof source === 'string') {
//       return source;
//     }
//   }
//   return "Default";
// };

// const getVariantType = (variant) => {
//   if (!variant) return 'default';
//   if (variant.hex && isValidHexColor(variant.hex)) return 'color';
//   if (variant.shadeName) return 'shade';
//   if (variant.size) return 'size';
//   if (variant.ml) return 'ml';
//   if (variant.weight) return 'weight';
//   return 'default';
// };

// // ==================== MAIN COMPONENT ====================
// const SearchPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { addToCart } = useContext(CartContext);
//   const { user } = useContext(UserContext);

//   // URL Syncing
//   const queryParams = new URLSearchParams(location.search);
//   const initialQuery = queryParams.get("q") || "";
//   const [searchTerm, setSearchTerm] = useState(initialQuery);

//   const [allProducts, setAllProducts] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSyncing, setIsSyncing] = useState(false);
//   const [error, setError] = useState(null);
//   const hasFetched = useRef(false);

//   // ==================== WISHLIST STATES ====================
//   const [wishlistLoading, setWishlistLoading] = useState({});
//   const [wishlistData, setWishlistData] = useState([]);

//   // ==================== VARIANT STATES ====================
//   const [selectedVariants, setSelectedVariants] = useState({});
//   const [addingToCart, setAddingToCart] = useState({});
//   const [showVariantOverlay, setShowVariantOverlay] = useState(null);
//   const [selectedVariantType, setSelectedVariantType] = useState("all");

//   // Toast Utility
//   const showToastMsg = (message, type = "error", duration = 3000) => {
//     if (type === "success") {
//       toast.success(message, { autoClose: duration });
//     } else if (type === "error") {
//       toast.error(message, { autoClose: duration });
//     } else {
//       toast.info(message, { autoClose: duration });
//     }
//   };

//   // ==================== WISHLIST FUNCTIONS (Same as Foryou) ====================
//   const isInWishlist = (productId, sku) => {
//     if (!productId || !sku) return false;
//     return wishlistData.some(item => 
//       (item.productId === productId || item._id === productId) && 
//       item.sku === sku
//     );
//   };

//   const fetchWishlistData = async () => {
//     try {
//       if (user && !user.guest) {
//         const response = await axiosInstance.get("/api/user/wishlist");
//         if (response.data.success) {
//           setWishlistData(response.data.wishlist || []);
//         }
//       } else {
//         const localWishlist = JSON.parse(localStorage.getItem(WISHLIST_CACHE_KEY)) || [];
//         const formattedWishlist = localWishlist.map(item => ({
//           productId: item._id,
//           _id: item._id,
//           sku: item.sku,
//           name: item.name,
//           variant: item.variantName,
//           image: item.image,
//           displayPrice: item.displayPrice,
//           originalPrice: item.originalPrice,
//           discountPercent: item.discountPercent,
//           status: item.status,
//           avgRating: item.avgRating,
//           totalRatings: item.totalRatings
//         }));
//         setWishlistData(formattedWishlist);
//       }
//     } catch (error) {
//       console.error("Error fetching wishlist data:", error);
//       setWishlistData([]);
//     }
//   };

//   const toggleWishlist = async (prod, variant) => {
//     if (!prod || !variant) {
//       showToastMsg("Please select a variant first", "error");
//       return;
//     }

//     const productId = prod._id;
//     const sku = getSku(variant);

//     setWishlistLoading(prev => ({ ...prev, [productId]: true }));

//     try {
//       const currentlyInWishlist = isInWishlist(productId, sku);

//       if (user && !user.guest) {
//         if (currentlyInWishlist) {
//           await axiosInstance.delete(`/api/user/wishlist/${productId}`, {
//             data: { sku: sku }
//           });
//           showToastMsg("Removed from wishlist!", "success");
//         } else {
//           await axiosInstance.post(`/api/user/wishlist/${productId}`, { sku: sku });
//           showToastMsg("Added to wishlist!", "success");
//         }
//         await fetchWishlistData();
//       } else {
//         const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];

//         if (currentlyInWishlist) {
//           const updatedWishlist = guestWishlist.filter(item =>
//             !(item._id === productId && item.sku === sku)
//           );
//           localStorage.setItem("guestWishlist", JSON.stringify(updatedWishlist));
//           showToastMsg("Removed from wishlist!", "success");
//         } else {
//           const productData = {
//             _id: productId,
//             name: prod.name,
//             brand: getBrandName(prod),
//             price: variant.discountedPrice || variant.displayPrice || prod.price || 0,
//             originalPrice: variant.originalPrice || variant.mrp || prod.mrp || prod.price || 0,
//             mrp: variant.originalPrice || variant.mrp || prod.mrp || prod.price || 0,
//             displayPrice: variant.discountedPrice || variant.displayPrice || prod.price || 0,
//             images: variant.images || prod.images || ["/placeholder.png"],
//             image: variant.images?.[0] || variant.image || prod.images?.[0] || "/placeholder.png",
//             slug: prod.slugs?.[0] || prod.slug || prod._id,
//             sku: sku,
//             variantSku: sku,
//             variantId: sku,
//             variantName: variant.shadeName || variant.name || "Default",
//             shadeName: variant.shadeName || variant.name || "Default",
//             variant: variant.shadeName || variant.name || "Default",
//             hex: variant.hex || "#cccccc",
//             stock: variant.stock || 0,
//             status: variant.stock > 0 ? "inStock" : "outOfStock",
//             avgRating: prod.avgRating || 0,
//             totalRatings: prod.totalRatings || 0,
//             commentsCount: prod.totalRatings || 0,
//             discountPercent: (variant.originalPrice && variant.discountedPrice && variant.originalPrice > variant.discountedPrice)
//               ? Math.round(((variant.originalPrice - variant.discountedPrice) / variant.originalPrice) * 100)
//               : 0
//           };
//           guestWishlist.push(productData);
//           localStorage.setItem("guestWishlist", JSON.stringify(guestWishlist));
//           showToastMsg("Added to wishlist!", "success");
//         }
//         await fetchWishlistData();
//       }
//     } catch (error) {
//       console.error("Wishlist toggle error:", error);
//       if (error.response?.status === 401) {
//         showToastMsg("Please login to use wishlist", "error");
//         navigate("/login");
//       } else {
//         showToastMsg(error.response?.data?.message || "Failed to update wishlist", "error");
//       }
//     } finally {
//       setWishlistLoading(prev => ({ ...prev, [productId]: false }));
//     }
//   };

//   useEffect(() => {
//     fetchWishlistData();
//   }, [user]);

//   // ==================== DATA FETCHING ====================
//   useEffect(() => {
//     if (hasFetched.current) return;

//     const fetchEverySingleProduct = async () => {
//       try {
//         setIsLoading(true);
//         setIsSyncing(true);

//         let currentCursor = null;
//         let hasMore = true;
//         const productMap = new Map();

//         while (hasMore) {
//           const response = await axiosInstance.get(`/api/user/products/all`, {
//             params: { cursor: currentCursor }
//           });

//           let products = [];
//           let pagination = {};
//           if (Array.isArray(response.data)) {
//             products = response.data;
//           } else if (response.data && Array.isArray(response.data.products)) {
//             products = response.data.products;
//             pagination = response.data.pagination || {};
//           }

//           if (products.length > 0) {
//             products.forEach(p => productMap.set(p._id, p));
//             setAllProducts(Array.from(productMap.values()));
//           }

//           if (pagination.hasMore === false) {
//             hasMore = false;
//           } else if (pagination.nextCursor) {
//             currentCursor = pagination.nextCursor;
//           } else {
//             hasMore = false;
//           }
//         }

//         hasFetched.current = true;
//       } catch (err) {
//         console.error("Fetch Error:", err);
//         setError("We couldn't load the inventory. Please try again.");
//       } finally {
//         setIsLoading(false);
//         setIsSyncing(false);
//       }
//     };

//     fetchEverySingleProduct();
//   }, []);

//   // ==================== CLIENT-SIDE SEARCH ====================
//   const filteredProducts = useMemo(() => {
//     const cleanTerm = searchTerm.toLowerCase().trim();
//     if (!cleanTerm) return allProducts;

//     const searchWords = cleanTerm.split(/\s+/);
//     return allProducts.filter((p) => {
//       const productName = (p.name || "").toLowerCase();
//       const brandName = (getBrandName(p) || "").toLowerCase();
//       const categoryName = (p.category?.name || "").toLowerCase();
//       const variantsText = p.variants?.map(v => (v.shadeName || v.name || "").toLowerCase()).join(" ") || "";
//       const searchable = `${productName} ${brandName} ${categoryName} ${variantsText}`;
//       return searchWords.every(word => searchable.includes(word));
//     });
//   }, [searchTerm, allProducts]);

//   // ==================== HANDLERS ====================
//   const handleInputChange = (e) => {
//     const val = e.target.value;
//     setSearchTerm(val);

//     const params = new URLSearchParams(window.location.search);
//     if (val) params.set("q", val);
//     else params.delete("q");
//     navigate({ search: params.toString() }, { replace: true });
//   };

//   const clearSearch = () => {
//     setSearchTerm("");
//     navigate("/search", { replace: true });
//   };

//   const handleVariantSelect = useCallback((productId, variant) => {
//     if (!productId || !variant) return;

//     setSelectedVariants(prev => ({
//       ...prev,
//       [productId]: variant
//     }));
//   }, []);

//   const openVariantOverlay = (productId, type = "all", e) => {
//     if (e) e.stopPropagation();
//     setSelectedVariantType(type);
//     setShowVariantOverlay(productId);
//   };

//   const closeVariantOverlay = () => {
//     setShowVariantOverlay(null);
//     setSelectedVariantType("all");
//   };

//   const getProductSlug = (product) => {
//     return product.slugs?.[0] || product.slug || product._id;
//   };

//   // ==================== ADD TO CART (Same as Foryou) ====================
//   const handleAddToCart = async (prod) => {
//     setAddingToCart(prev => ({ ...prev, [prod._id]: true }));
//     try {
//       const variants = Array.isArray(prod.variants) ? prod.variants : [];
//       const hasVariants = variants.length > 0;
//       let payload;

//       if (hasVariants) {
//         const selectedVariant = selectedVariants[prod._id];
//         if (!selectedVariant) {
//           showToastMsg("Please select a variant.", "error");
//           return;
//         }
//         if (selectedVariant.stock <= 0) {
//           showToastMsg("Selected variant is out of stock.", "error");
//           return;
//         }
//         payload = {
//           productId: prod._id,
//           variants: [{ variantSku: getSku(selectedVariant), quantity: 1 }],
//         };
//         const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
//         cache[prod._id] = selectedVariant;
//         localStorage.setItem("cartVariantCache", JSON.stringify(cache));
//       } else {
//         if (prod.stock <= 0) {
//           showToastMsg("Product is out of stock.", "error");
//           return;
//         }
//         payload = { productId: prod._id, quantity: 1 };
//         const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
//         delete cache[prod._id];
//         localStorage.setItem("cartVariantCache", JSON.stringify(cache));
//       }

//       const response = await axiosInstance.post(`${CART_API_BASE}/add`, payload);
//       if (!response.data.success) {
//         throw new Error(response.data.message || "Failed to add to cart");
//       }

//       showToastMsg("Product added to cart!", "success");
//       navigate("/cartpage");
//     } catch (err) {
//       console.error("Add to Cart error:", err);
//       showToastMsg(err.response?.data?.message || "Failed to add to cart", "error");
//       if (err.response?.status === 401) {
//         navigate("/login");
//       }
//     } finally {
//       setAddingToCart(prev => ({ ...prev, [prod._id]: false }));
//     }
//   };

//   const formatPrice = useCallback((price) => {
//     const numPrice = parseFloat(price || 0);
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0
//     }).format(numPrice);
//   }, []);

//   // ==================== PRODUCT CARD (Same design as Foryou) ====================
//   const renderProductCard = (prod) => {
//     const variants = Array.isArray(prod.variants) ? prod.variants : [];
//     const hasVariants = variants.length > 0;
//     const selectedVariant = selectedVariants[prod._id];
//     const grouped = groupVariantsByType(variants);
//     const totalVariants = variants.length;

//     const selectedSku = selectedVariant ? getSku(selectedVariant) : null;
//     const isProductInWishlist = selectedSku ? isInWishlist(prod._id, selectedSku) : false;
//     const productSlug = getProductSlug(prod);

//     // Get image with priority (same as Foryou)
//     let imageUrl = "https://placehold.co/400x300/ffffff/cccccc?text=Product";
//     const getVariantImage = (variant) => variant?.images?.[0] || variant?.image;

//     imageUrl = getVariantImage(selectedVariant) ||
//       getVariantImage(variants.find(v => v.stock > 0)) ||
//       getVariantImage(variants[0]) ||
//       prod.images?.[0] ||
//       "";

//     if (!imageUrl) {
//       imageUrl = "https://placehold.co/400x300/ffffff/cccccc?text=Product";
//     } else if (!imageUrl.startsWith("http")) {
//       imageUrl = `https://res.cloudinary.com/dekngswix/image/upload/${imageUrl}`;
//     }

//     // Check if a variant is selected for this product
//     const isVariantSelected = !!selectedVariants[prod._id];

//     // Button state logic - Same as Foryou
//     const isAdding = addingToCart[prod._id];
//     const outOfStock = hasVariants
//       ? (selectedVariant?.stock <= 0)
//       : (prod.stock <= 0);

//     // If product has variants and no variant is selected, show "Select Shade" button
//     const showSelectVariantButton = hasVariants && !isVariantSelected;

//     const buttonDisabled = isAdding || outOfStock;
//     const buttonText = isAdding
//       ? "Adding..."
//       : showSelectVariantButton
//         ? "Select Shade"
//         : outOfStock
//           ? "Out of Stock"
//           : "Add to Bag";

//     return (
//       <div key={prod._id} className="col-6 col-md-4 col-lg-3 mb-4 position-relative">
//         <div className="foryou-card-wrapper h-100">
//           <div className="foryou-card h-100">
//             {/* Product Image with Overlays */}
//             <div
//               className="foryou-img-wrapper"
//               onClick={() => navigate(`/product/${productSlug}`)}
//               style={{ cursor: 'pointer', position: 'relative' }}
//             >
//               <img
//                 src={imageUrl}
//                 alt={prod.name || "Product"}
//                 className="foryou-img img-fluid"
//                 loading="lazy"
//                 style={{ height: '200px', objectFit: 'contain' }}
//                 onError={(e) => {
//                   e.currentTarget.src = "https://placehold.co/400x300/ffffff/cccccc?text=Product";
//                 }}
//               />

//               {/* Wishlist Icon */}
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   if (selectedVariant || !hasVariants) {
//                     toggleWishlist(prod, selectedVariant || {});
//                   }
//                 }}
//                 disabled={wishlistLoading[prod._id]}
//                 style={{
//                   position: 'absolute',
//                   top: '10px',
//                   right: '10px',
//                   cursor: wishlistLoading[prod._id] ? 'not-allowed' : 'pointer',
//                   color: isProductInWishlist ? '#dc3545' : '#000000',
//                   fontSize: '22px',
//                   zIndex: 2,
//                   backgroundColor: 'rgba(255, 255, 255, 0.9)',
//                   borderRadius: '50%',
//                   width: '34px',
//                   height: '34px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//                   transition: 'all 0.3s ease',
//                   border: 'none',
//                   outline: 'none'
//                 }}
//                 title={isProductInWishlist ? "Remove from wishlist" : "Add to wishlist"}
//               >
//                 {wishlistLoading[prod._id] ? (
//                   <div className="spinner-border spinner-border-sm" role="status"></div>
//                 ) : isProductInWishlist ? (
//                   <FaHeart />
//                 ) : (
//                   <FaRegHeart />
//                 )}
//               </button>

//               {/* Promo Badge */}
//               {selectedVariant?.promoApplied && (
//                 <div className="promo-badge" style={{
//                   position: 'absolute',
//                   top: '10px',
//                   left: '10px',
//                   background: '#ff6b6b',
//                   color: 'white',
//                   padding: '4px 8px',
//                   borderRadius: '4px',
//                   fontSize: '12px',
//                   fontWeight: 'bold'
//                 }}>
//                   Promo
//                 </div>
//               )}
//             </div>

//             {/* Product Info */}
//             <div className="foryou-product-info w-100 ps-lg-0 p-0 pt-md-0 justify-content-end">
//               <div className="justify-content-between d-flex flex-column" style={{ height: 'auto', minHeight: '225px' }}>

//                 {/* Brand Name */}
//                 <div className="brand-name small text-muted mb-1 mt-2 text-start">
//                   {getBrandName(prod)}
//                 </div>

//                 {/* Product Name */}
//                 <h6
//                   className="foryou-name font-family-Poppins m-0 p-0"
//                   onClick={() => navigate(`/product/${productSlug}`)}
//                   style={{ cursor: 'pointer', fontSize: '14px', lineHeight: '1.4' }}
//                 >
//                   {prod.name || "Unnamed Product"}
//                 </h6>

//                 {/* Minimal Variant Display */}
//                 {hasVariants && (
//                   <div className="variant-section m-0 p-0 ms-0 mt-2 mb-2">
//                     {isVariantSelected ? (
//                       <div 
//                         className="selected-variant-display text-muted small" 
//                         style={{ cursor: 'pointer', display: 'inline-block' }}
//                         onClick={(e) => openVariantOverlay(prod._id, "all", e)}
//                         title="Click to change variant"
//                       >
//                         Variant: <span className="fw-bold text-dark">{getVariantDisplayText(selectedVariant)}</span>
//                         <FaChevronDown className="ms-1" style={{ fontSize: '10px' }} />
//                       </div>
//                     ) : (
//                       <div className="small text-muted" style={{ height: '20px' }}>
//                         {totalVariants} Variants Available
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Price Section */}
//                 <div className="price-section mb-3">
//                   <div className="d-flex align-items-baseline flex-wrap">
//                     <span className="current-price fw-400 fs-5" style={{ fontSize: '16px' }}>
//                       {formatPrice(selectedVariant?.displayPrice || selectedVariant?.discountedPrice || prod.price || 0)}
//                     </span>
//                     {(selectedVariant?.originalPrice || prod.mrp) > (selectedVariant?.displayPrice || selectedVariant?.discountedPrice || prod.price || 0) && (
//                       <>
//                         <span className="original-price text-muted text-decoration-line-through ms-2 fs-6" style={{ fontSize: '14px' }}>
//                           {formatPrice(selectedVariant?.originalPrice || selectedVariant?.mrp || prod.mrp || 0)}
//                         </span>
//                         <span className="discount-percent text-danger fw-bold ms-2" style={{ fontSize: '12px' }}>
//                           ({Math.round(((selectedVariant?.originalPrice || selectedVariant?.mrp || prod.mrp || 0) - (selectedVariant?.displayPrice || selectedVariant?.discountedPrice || prod.price || 0)) / (selectedVariant?.originalPrice || selectedVariant?.mrp || prod.mrp || 1) * 100)}% OFF)
//                         </span>
//                       </>
//                     )}
//                   </div>
//                 </div>

//                 {/* Add to Cart Button - Same as Foryou */}
//                 <div className="cart-section">
//                   <div className="d-flex align-items-center justify-content-between">
//                     <button
//                       className={`w-100 btn-add-cart ${buttonDisabled ? 'disabled' : ''}`}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         // If showing "Select Shade", open overlay instead of adding to cart
//                         if (showSelectVariantButton) {
//                           openVariantOverlay(prod._id, "all", e);
//                         } else {
//                           handleAddToCart(prod);
//                         }
//                       }}
//                       disabled={buttonDisabled}
//                       style={{
//                         transition: "background-color 0.3s ease, color 0.3s ease",
//                         padding: '10px 15px',
//                         borderRadius: '6px',
//                         border: '1px solid #000',
//                         backgroundColor: buttonDisabled ? '#ccc' : '#000',
//                         color: buttonDisabled ? '#666' : '#fff',
//                         fontSize: '14px',
//                         fontWeight: '500',
//                         cursor: buttonDisabled ? 'not-allowed' : 'pointer',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         gap: '8px'
//                       }}
//                     >
//                       {isAdding ? (
//                         <>
//                           <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//                           Adding...
//                         </>
//                       ) : (
//                         <>
//                           {buttonText}
//                           {/* Only show bag icon when NOT showing "Select Shade" */}
//                           {!buttonDisabled && !isAdding && !showSelectVariantButton && (
//                             <img src={Bag} alt="Bag" style={{ height: "18px" }} />
//                           )}
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Variant Overlay - Same as Foryou */}
//         {showVariantOverlay === prod._id && (
//           <div className="variant-overlay" onClick={closeVariantOverlay} style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             backgroundColor: 'rgba(0,0,0,0.5)',
//             zIndex: 1000,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center'
//           }}>
//             <div
//               className="variant-overlay-content p-0"
//               onClick={(e) => e.stopPropagation()}
//               style={{
//                 width: '100%',
//                 maxWidth: '500px',
//                 height: '100%',
//                 background: '#fff',
//                 borderRadius: '0px',
//                 overflow: 'hidden',
//                 display: 'flex',
//                 flexDirection: 'column'
//               }}
//             >
//               <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
//                 <h5 className="m-0 page-title-main-name">Select Variant ({totalVariants})</h5>
//                 <button
//                   onClick={closeVariantOverlay}
//                   style={{
//                     background: 'none',
//                     border: 'none',
//                     fontSize: '24px',
//                     cursor: 'pointer'
//                   }}
//                 >
//                   ×
//                 </button>
//               </div>

//               {/* Tabs */}
//               <div className="variant-tabs d-flex">
//                 <button
//                   className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "all" ? "active" : ""}`}
//                   onClick={() => setSelectedVariantType("all")}
//                   style={{
//                     border: 'none',
//                     background: selectedVariantType === "all" ? '#000' : '#f5f5f5',
//                     color: selectedVariantType === "all" ? '#fff' : '#000',
//                     fontWeight: '500'
//                   }}
//                 >
//                   All ({totalVariants})
//                 </button>
//                 {grouped.color.length > 0 && (
//                   <button
//                     className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "color" ? "active" : ""}`}
//                     onClick={() => setSelectedVariantType("color")}
//                     style={{
//                       border: 'none',
//                       background: selectedVariantType === "color" ? '#000' : '#f5f5f5',
//                       color: selectedVariantType === "color" ? '#fff' : '#000',
//                       fontWeight: '500'
//                     }}
//                   >
//                     Colors ({grouped.color.length})
//                   </button>
//                 )}
//                 {grouped.text.length > 0 && (
//                   <button
//                     className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "text" ? "active" : ""}`}
//                     onClick={() => setSelectedVariantType("text")}
//                     style={{
//                       border: 'none',
//                       background: selectedVariantType === "text" ? '#000' : '#f5f5f5',
//                       color: selectedVariantType === "text" ? '#fff' : '#000',
//                       fontWeight: '500'
//                     }}
//                   >
//                     Sizes ({grouped.text.length})
//                   </button>
//                 )}
//               </div>

//               {/* Content */}
//               <div className="p-3 overflow-auto flex-grow-1" style={{ maxHeight: '400px' }}>
//                 {(selectedVariantType === "all" || selectedVariantType === "color") && grouped.color.length > 0 && (
//                   <div className="row row-col-4 g-3">
//                     {grouped.color.map((v) => {
//                       const isSelected = selectedVariant?.sku === v.sku || (selectedVariant?._id && selectedVariant._id === v._id);
//                       const isOutOfStock = (v.stock ?? 0) <= 0;

//                       return (
//                         <div className="col-lg-6 col-6 mt-2" key={getSku(v) || v._id}>
//                           <div
//                             className="text-center"
//                             style={{
//                               cursor: isOutOfStock ? "not-allowed" : "pointer",
//                             }}
//                             onClick={() =>
//                               !isOutOfStock &&
//                               (handleVariantSelect(prod._id, v),
//                                 closeVariantOverlay())
//                             }
//                           >
//                             <div className="page-title-main-name"
//                               style={{
//                                 width: "28px",
//                                 height: "28px",
//                                 borderRadius: "20%",
//                                 backgroundColor: v.hex || "#ccc",
//                                 margin: "0 auto 8px",
//                                 border: isSelected ? "2px solid #000" : "1px solid #ddd",
//                                 opacity: isOutOfStock ? 0.5 : 1,
//                                 position: "relative",
//                               }}
//                             >
//                               {isSelected && (
//                                 <span
//                                   style={{
//                                     position: "absolute",
//                                     top: "50%",
//                                     left: "50%",
//                                     transform: "translate(-50%, -50%)",
//                                     color: "#fff",
//                                     fontWeight: "bold",
//                                   }}
//                                 >
//                                   ✓
//                                 </span>
//                               )}
//                             </div>
//                             <div className="small page-title-main-name" style={{fontSize:'12px'}}>
//                               {getVariantDisplayText(v)}
//                             </div>
//                             {isOutOfStock && (
//                               <div className="text-danger small">
//                                 Out of Stock
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}

//                 {(selectedVariantType === "all" || selectedVariantType === "text") && grouped.text.length > 0 && (
//                   <div className="row row-cols-3 g-0">
//                     {grouped.text.map((v) => {
//                       const isSelected = selectedVariant?.sku === v.sku || (selectedVariant?._id && selectedVariant._id === v._id);
//                       const isOutOfStock = (v.stock ?? 0) <= 0;

//                       return (
//                         <div className="col-lg-3 col-5" key={getSku(v) || v._id}>
//                           <div
//                             className="text-center"
//                             style={{
//                               cursor: isOutOfStock ? "not-allowed" : "pointer",
//                             }}
//                             onClick={() =>
//                               !isOutOfStock &&
//                               (handleVariantSelect(prod._id, v),
//                                 closeVariantOverlay())
//                             }
//                           >
//                             <div
//                               style={{
//                                 padding: "10px",
//                                 borderRadius: "8px",
//                                 border: isSelected ? "2px solid #000" : "1px solid #ddd",
//                                 background: isSelected ? "#f8f9fa" : "#fff",
//                                 minHeight: "50px",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 opacity: isOutOfStock ? 0.5 : 1,
//                               }}
//                             >
//                               {getVariantDisplayText(v)}
//                             </div>
//                             {isOutOfStock && (
//                               <div className="text-danger small mt-1">
//                                 Out of Stock
//                               </div>
//                             )}
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

//   // ==================== RENDER ====================
//   return (
//     <div className="search-page-container">
//       <ToastContainer position="top-right" autoClose={3000} />
//       <Header />
//       <div className="search-main-wrapper">
//         {/* Sticky Search Bar */}
//         <div className="search-header-sticky">
//           <div className="search-input-container">
//             <FaSearch className="inner-search-icon" />
//             <input className="page-title-main-name"
//               type="text"
//               placeholder="Search products, brands, or categories..."
//               value={searchTerm}
//               onChange={handleInputChange}
//               autoFocus
//             />
//             {searchTerm && <FaTimes className="clear-icon" onClick={clearSearch} />}
//             {isSyncing && <FaSync className="spin sync-icon" title="Syncing Inventory..." />}
//           </div>
//           <div className="search-results-meta page-title-main-name">
//             {isLoading ? (
//               <span>Initializing catalog...</span>
//             ) : (
//               <p>
//                 Showing <b>{filteredProducts.length}</b> items
//                 {searchTerm && <> for "<b>{searchTerm}</b>"</>}
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Results Grid */}
//         <div className="search-results-grid container-lg py-4">
//           {isLoading && allProducts.length === 0 ? (
//             <div className="loading-state">
//               <FaSpinner className="spin large-spinner" />
//               <p>Loading your store...</p>
//             </div>
//           ) : error ? (
//             <div className="error-box">
//               <FaRegSadTear size={40} />
//               <p>{error}</p>
//               <button onClick={() => window.location.reload()}>Retry</button>
//             </div>
//           ) : filteredProducts.length === 0 ? (
//             <div className="no-results text-center py-5">
//               <FaSearch size={64} className="text-muted mb-3" />
//               <h3>No matches found</h3>
//               <p className="text-muted">Try different keywords or check your spelling.</p>
//               {searchTerm && (
//                 <button className="btn btn-dark mt-3" onClick={clearSearch}>
//                   Clear Search
//                 </button>
//               )}
//             </div>
//           ) : (
//             <div className="row g-4">
//               {filteredProducts.map(renderProductCard)}
//             </div>
//           )}
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default SearchPage;













// import React, { useState, useEffect, useMemo, useRef, useCallback, useContext } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { FaSearch, FaRegSadTear, FaSpinner, FaSync, FaTimes, FaHeart, FaRegHeart, FaChevronDown } from "react-icons/fa";
// import Header from "./Header";
// import Footer from "./Footer";
// import axiosInstance from "../utils/axiosInstance.js";
// import { CartContext } from "../context/CartContext";
// import { UserContext } from "./UserContext.jsx";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "../css/SearchPage.css";
// import Bag from "../assets/Bag.svg";
// import updownarrow from "../assets/updownarrow.svg";
// import filtering from "../assets/filtering.svg";
// import BrandFilter from "./BrandFilter";

// const CART_API_BASE = "/api/user/cart";
// const WISHLIST_CACHE_KEY = "guestWishlist";
// const PRODUCT_ALL_API = "https://beauty.joyory.com/api/user/products/all";

// // ==================== HELPER FUNCTIONS ====================
// const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || 'default'}`;

// const isValidHexColor = (hex) => {
//   if (!hex || typeof hex !== "string") return false;
//   const normalized = hex.trim().toLowerCase();
//   return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(normalized);
// };

// const getVariantDisplayText = (variant) => {
//   return (
//     variant.shadeName ||
//     variant.name ||
//     variant.size ||
//     variant.ml ||
//     variant.weight ||
//     "Default"
//   ).toUpperCase();
// };

// const groupVariantsByType = (variants) => {
//   const grouped = { color: [], text: [] };
//   variants.forEach((v) => {
//     if (!v) return;
//     if (v.hex && isValidHexColor(v.hex)) {
//       grouped.color.push(v);
//     } else {
//       grouped.text.push(v);
//     }
//   });
//   return grouped;
// };

// const getBrandName = (product) => {
//   if (!product?.brand) return "Unknown Brand";
//   if (typeof product.brand === "object" && product.brand.name) return product.brand.name;
//   if (typeof product.brand === "string") return product.brand;
//   return "Unknown Brand";
// };

// const getVariantName = (variant) => {
//   if (!variant) return "Default";
//   const nameSources = [
//     variant.shadeName,
//     variant.name,
//     variant.variantName,
//     variant.size,
//     variant.ml,
//     variant.weight
//   ];
//   for (const source of nameSources) {
//     if (source && typeof source === 'string') {
//       return source;
//     }
//   }
//   return "Default";
// };

// const getVariantType = (variant) => {
//   if (!variant) return 'default';
//   if (variant.hex && isValidHexColor(variant.hex)) return 'color';
//   if (variant.shadeName) return 'shade';
//   if (variant.size) return 'size';
//   if (variant.ml) return 'ml';
//   if (variant.weight) return 'weight';
//   return 'default';
// };

// // ==================== MAIN COMPONENT ====================
// const SearchPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { addToCart } = useContext(CartContext);
//   const { user } = useContext(UserContext);

//   // URL Syncing
//   const queryParams = new URLSearchParams(location.search);
//   const initialQuery = queryParams.get("q") || "";
//   const [searchTerm, setSearchTerm] = useState(initialQuery);

//   const [allProducts, setAllProducts] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSyncing, setIsSyncing] = useState(false);
//   const [error, setError] = useState(null);
//   const hasFetched = useRef(false);

//   // ==================== FILTER STATES ====================
//   const [filterData, setFilterData] = useState(null);
//   const [trendingCategories, setTrendingCategories] = useState([]);
//   const [showFilterOffcanvas, setShowFilterOffcanvas] = useState(false);
//   const [showSortOffcanvas, setShowSortOffcanvas] = useState(false);

//   const [filters, setFilters] = useState({
//     brandIds: [],
//     categoryIds: [],
//     skinTypes: [],
//     formulations: [],
//     finishes: [],
//     ingredients: [],
//     priceRange: null,
//     discountMin: null,
//     minRating: "",
//     sort: "recent",
//   });

//   // ==================== WISHLIST STATES ====================
//   const [wishlistLoading, setWishlistLoading] = useState({});
//   const [wishlistData, setWishlistData] = useState([]);

//   // ==================== VARIANT STATES ====================
//   const [selectedVariants, setSelectedVariants] = useState({});
//   const [addingToCart, setAddingToCart] = useState({});
//   const [showVariantOverlay, setShowVariantOverlay] = useState(null);
//   const [selectedVariantType, setSelectedVariantType] = useState("all");

//   // Toast Utility
//   const showToastMsg = (message, type = "error", duration = 3000) => {
//     if (type === "success") {
//       toast.success(message, { autoClose: duration });
//     } else if (type === "error") {
//       toast.error(message, { autoClose: duration });
//     } else {
//       toast.info(message, { autoClose: duration });
//     }
//   };

//   // ==================== WISHLIST FUNCTIONS - FULLY UPDATED ====================

//   // 🔥 FIXED: Proper string comparison for IDs
//   const isInWishlist = useCallback((productId, sku) => {
//     if (!productId || !sku) return false;

//     // Normalize to strings for comparison
//     const normalizedProductId = String(productId);
//     const normalizedSku = String(sku);

//     return wishlistData.some(item => {
//       const itemProductId = String(item.productId || item._id);
//       const itemSku = String(item.sku);
//       return itemProductId === normalizedProductId && itemSku === normalizedSku;
//     });
//   }, [wishlistData]);

//   // 🔥 FIXED: Fetch with proper error handling and credentials
//   const fetchWishlistData = useCallback(async () => {
//     try {
//       if (user && !user.guest) {
//         const response = await axiosInstance.get("/api/user/wishlist", {
//           withCredentials: true // Ensure cookies are sent
//         });
//         if (response.data.success) {
//           setWishlistData(response.data.wishlist || []);
//         }
//       } else {
//         const localWishlist = JSON.parse(localStorage.getItem(WISHLIST_CACHE_KEY)) || [];
//         // Normalize local data to match API format
//         const formattedWishlist = localWishlist.map(item => ({
//           productId: String(item._id || item.productId),
//           _id: String(item._id),
//           sku: String(item.sku),
//           name: item.name,
//           variant: item.variantName || item.variant,
//           image: item.image,
//           displayPrice: item.displayPrice,
//           originalPrice: item.originalPrice,
//           discountPercent: item.discountPercent,
//           status: item.status,
//           avgRating: item.avgRating,
//           totalRatings: item.totalRatings
//         }));
//         setWishlistData(formattedWishlist);
//       }
//     } catch (error) {
//       console.error("Error fetching wishlist data:", error);
//       setWishlistData([]);
//     }
//   }, [user]);

//   // 🔥 FIXED: Toggle with proper string normalization and storage sync
//   const toggleWishlist = useCallback(async (prod, variant) => {
//     if (!user || user.guest) {
//       showToastMsg("Please login to use wishlist", "error");
//       navigate("/login", { state: { from: location.pathname } });
//       return;
//     }
//     // Handle case when no variant is passed (for products without variants)
//     if (!prod) {
//       showToastMsg("Product not found", "error");
//       return;
//     }

//     // Get effective variant (passed variant, selected variant, or first available)
//     const effectiveVariant = variant && Object.keys(variant).length > 0
//       ? variant
//       : selectedVariants[prod._id]
//         ? selectedVariants[prod._id]
//         : (prod.variants?.[0] || {});

//     if (!effectiveVariant || Object.keys(effectiveVariant).length === 0) {
//       showToastMsg("Please select a variant first", "error");
//       return;
//     }

//     const productId = String(prod._id);
//     const sku = String(getSku(effectiveVariant));

//     setWishlistLoading(prev => ({ ...prev, [productId]: true }));

//     try {
//       const currentlyInWishlist = isInWishlist(productId, sku);

//       if (user && !user.guest) {
//         // API call for logged-in users with credentials
//         if (currentlyInWishlist) {
//           await axiosInstance.delete(`/api/user/wishlist/${productId}`, {
//             data: { sku: sku },
//             withCredentials: true // 🔥 FIXED: Added credentials
//           });
//           showToastMsg("Removed from wishlist!", "success");
//         } else {
//           await axiosInstance.post(`/api/user/wishlist/${productId}`,
//             { sku: sku },
//             { withCredentials: true } // 🔥 FIXED: Added credentials
//           );
//           showToastMsg("Added to wishlist!", "success");
//         }
//         // Re-fetch to sync with server
//         await fetchWishlistData();
//       } else {
//         // LocalStorage for guests
//         let guestWishlist = JSON.parse(localStorage.getItem(WISHLIST_CACHE_KEY)) || [];

//         if (currentlyInWishlist) {
//           // Remove from wishlist
//           guestWishlist = guestWishlist.filter(item =>
//             !(String(item._id) === productId && String(item.sku) === sku)
//           );
//           localStorage.setItem(WISHLIST_CACHE_KEY, JSON.stringify(guestWishlist));
//           showToastMsg("Removed from wishlist!", "success");
//         } else {
//           // Add to wishlist with normalized data
//           const productData = {
//             _id: productId,
//             productId: productId,
//             name: prod.name,
//             brand: getBrandName(prod),
//             price: effectiveVariant.discountedPrice || effectiveVariant.displayPrice || prod.price || 0,
//             originalPrice: effectiveVariant.originalPrice || effectiveVariant.mrp || prod.mrp || prod.price || 0,
//             mrp: effectiveVariant.originalPrice || effectiveVariant.mrp || prod.mrp || prod.price || 0,
//             displayPrice: effectiveVariant.discountedPrice || effectiveVariant.displayPrice || prod.price || 0,
//             images: effectiveVariant.images || prod.images || ["/placeholder.png"],
//             image: effectiveVariant.images?.[0] || effectiveVariant.image || prod.images?.[0] || "/placeholder.png",
//             slug: prod.slugs?.[0] || prod.slug || productId,
//             sku: sku,
//             variantSku: sku,
//             variantId: sku,
//             variantName: effectiveVariant.shadeName || effectiveVariant.name || "Default",
//             shadeName: effectiveVariant.shadeName || effectiveVariant.name || "Default",
//             variant: effectiveVariant.shadeName || effectiveVariant.name || "Default",
//             hex: effectiveVariant.hex || "#cccccc",
//             stock: effectiveVariant.stock || 0,
//             status: effectiveVariant.stock > 0 ? "inStock" : "outOfStock",
//             avgRating: prod.avgRating || 0,
//             totalRatings: prod.totalRatings || 0,
//             commentsCount: prod.totalRatings || 0,
//             discountPercent: (effectiveVariant.originalPrice && effectiveVariant.discountedPrice && effectiveVariant.originalPrice > effectiveVariant.discountedPrice)
//               ? Math.round(((effectiveVariant.originalPrice - effectiveVariant.discountedPrice) / effectiveVariant.originalPrice) * 100)
//               : 0
//           };
//           guestWishlist.push(productData);
//           localStorage.setItem(WISHLIST_CACHE_KEY, JSON.stringify(guestWishlist));
//           showToastMsg("Added to wishlist!", "success");
//         }

//         // 🔥 FIXED: Dispatch storage event for cross-tab sync
//         window.dispatchEvent(new StorageEvent('storage', { key: WISHLIST_CACHE_KEY }));

//         // Update local state immediately
//         await fetchWishlistData();
//       }
//     } catch (error) {
//       console.error("Wishlist toggle error:", error);
//       if (error.response?.status === 401) {
//         showToastMsg("Please login to use wishlist", "error");
//         navigate("/login");
//       } else {
//         showToastMsg(error.response?.data?.message || "Failed to update wishlist", "error");
//       }
//     } finally {
//       setWishlistLoading(prev => ({ ...prev, [productId]: false }));
//     }
//   }, [user, isInWishlist, fetchWishlistData, selectedVariants, navigate]);

//   // 🔥 FIXED: Listen for storage changes (cross-tab sync)
//   useEffect(() => {
//     fetchWishlistData();
//   }, [fetchWishlistData]);

//   // 🔥 FIXED: Storage event listener for multi-tab sync
//   useEffect(() => {
//     const handleStorageChange = (e) => {
//       if (e.key === WISHLIST_CACHE_KEY) {
//         fetchWishlistData();
//       }
//     };

//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, [fetchWishlistData]);

//   // ==================== DATA FETCHING WITH FILTERS ====================
//   useEffect(() => {
//     if (hasFetched.current) return;

//     const fetchEverySingleProduct = async () => {
//       try {
//         setIsLoading(true);
//         setIsSyncing(true);

//         let currentCursor = null;
//         let hasMore = true;
//         const productMap = new Map();

//         while (hasMore) {
//           const response = await axiosInstance.get(PRODUCT_ALL_API, {
//             params: { cursor: currentCursor },
//             withCredentials: true
//           });

//           let products = [];
//           let pagination = {};
//           if (Array.isArray(response.data)) {
//             products = response.data;
//           } else if (response.data && Array.isArray(response.data.products)) {
//             products = response.data.products;
//             pagination = response.data.pagination || {};
//           }

//           if (response.data.filters && !filterData) {
//             setFilterData(response.data.filters);
//           }
//           if (response.data.trendingCategories && trendingCategories.length === 0) {
//             setTrendingCategories(response.data.trendingCategories);
//           }

//           if (products.length > 0) {
//             products.forEach(p => productMap.set(p._id, p));
//             setAllProducts(Array.from(productMap.values()));
//           }

//           if (pagination.hasMore === false) {
//             hasMore = false;
//           } else if (pagination.nextCursor) {
//             currentCursor = pagination.nextCursor;
//           } else {
//             hasMore = false;
//           }
//         }

//         hasFetched.current = true;
//       } catch (err) {
//         console.error("Fetch Error:", err);
//         setError("We couldn't load the inventory. Please try again.");
//       } finally {
//         setIsLoading(false);
//         setIsSyncing(false);
//       }
//     };

//     fetchEverySingleProduct();
//   }, []);

//   // ==================== CLIENT-SIDE SEARCH & FILTER ====================
//   const filteredProducts = useMemo(() => {
//     let result = allProducts;

//     const cleanTerm = searchTerm.toLowerCase().trim();
//     if (cleanTerm) {
//       const searchWords = cleanTerm.split(/\s+/);
//       result = result.filter((p) => {
//         const productName = (p.name || "").toLowerCase();
//         const brandName = (getBrandName(p) || "").toLowerCase();
//         const categoryName = (p.category?.name || "").toLowerCase();
//         const variantsText = p.variants?.map(v => (v.shadeName || v.name || "").toLowerCase()).join(" ") || "";
//         const searchable = `${productName} ${brandName} ${categoryName} ${variantsText}`;
//         return searchWords.every(word => searchable.includes(word));
//       });
//     }

//     if (filters.brandIds.length > 0) {
//       result = result.filter(p => {
//         const brandId = typeof p.brand === 'object' ? p.brand?._id : p.brand;
//         return filters.brandIds.includes(brandId);
//       });
//     }

//     if (filters.categoryIds.length > 0) {
//       result = result.filter(p => {
//         const catId = typeof p.category === 'object' ? p.category?._id : p.category;
//         return filters.categoryIds.includes(catId);
//       });
//     }

//     if (filters.skinTypes.length > 0) {
//       result = result.filter(p =>
//         filters.skinTypes.some(st => p.skinTypes?.includes(st))
//       );
//     }

//     if (filters.ingredients.length > 0) {
//       result = result.filter(p =>
//         filters.ingredients.some(ing => p.ingredients?.includes(ing))
//       );
//     }

//     if (filters.priceRange) {
//       result = result.filter(p => {
//         const price = p.price || 0;
//         const min = filters.priceRange.min || 0;
//         const max = filters.priceRange.max;
//         return price >= min && (max == null || price <= max);
//       });
//     }

//     if (filters.discountMin) {
//       result = result.filter(p => {
//         const discount = p.discountPercent || 0;
//         return discount >= filters.discountMin;
//       });
//     }

//     if (filters.minRating) {
//       result = result.filter(p => (p.avgRating || 0) >= parseFloat(filters.minRating));
//     }

//     if (filters.sort === "priceHighToLow") {
//       result = [...result].sort((a, b) => (b.price || 0) - (a.price || 0));
//     } else if (filters.sort === "priceLowToHigh") {
//       result = [...result].sort((a, b) => (a.price || 0) - (b.price || 0));
//     }

//     return result;
//   }, [searchTerm, allProducts, filters]);

//   // ==================== HANDLERS ====================
//   const handleInputChange = (e) => {
//     const val = e.target.value;
//     setSearchTerm(val);

//     const params = new URLSearchParams(window.location.search);
//     if (val) params.set("q", val);
//     else params.delete("q");
//     navigate({ search: params.toString() }, { replace: true });
//   };

//   const clearSearch = () => {
//     setSearchTerm("");
//     navigate("/search", { replace: true });
//   };

//   const handleVariantSelect = useCallback((productId, variant) => {
//     if (!productId || !variant) return;

//     setSelectedVariants(prev => ({
//       ...prev,
//       [productId]: variant
//     }));
//   }, []);

//   const openVariantOverlay = (productId, type = "all", e) => {
//     if (e) e.stopPropagation();
//     setSelectedVariantType(type);
//     setShowVariantOverlay(productId);
//   };

//   const closeVariantOverlay = () => {
//     setShowVariantOverlay(null);
//     setSelectedVariantType("all");
//   };

//   const getProductSlug = (product) => {
//     return product.slugs?.[0] || product.slug || product._id;
//   };

//   // ==================== ADD TO CART ====================
//   const handleAddToCart = async (prod) => {
//     setAddingToCart(prev => ({ ...prev, [prod._id]: true }));
//     try {
//       const variants = Array.isArray(prod.variants) ? prod.variants : [];
//       const hasVariants = variants.length > 0;
//       let payload;

//       if (hasVariants) {
//         const selectedVariant = selectedVariants[prod._id];
//         if (!selectedVariant) {
//           showToastMsg("Please select a variant.", "error");
//           return;
//         }
//         if (selectedVariant.stock <= 0) {
//           showToastMsg("Selected variant is out of stock.", "error");
//           return;
//         }
//         payload = {
//           productId: prod._id,
//           variants: [{ variantSku: getSku(selectedVariant), quantity: 1 }],
//         };
//         const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
//         cache[prod._id] = selectedVariant;
//         localStorage.setItem("cartVariantCache", JSON.stringify(cache));
//       } else {
//         if (prod.stock <= 0) {
//           showToastMsg("Product is out of stock.", "error");
//           return;
//         }
//         payload = { productId: prod._id, quantity: 1 };
//         const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
//         delete cache[prod._id];
//         localStorage.setItem("cartVariantCache", JSON.stringify(cache));
//       }

//       const response = await axiosInstance.post(`${CART_API_BASE}/add`, payload);
//       if (!response.data.success) {
//         throw new Error(response.data.message || "Failed to add to cart");
//       }

//       showToastMsg("Product added to cart!", "success");
//       navigate("/cartpage");
//     } catch (err) {
//       console.error("Add to Cart error:", err);
//       showToastMsg(err.response?.data?.message || "Failed to add to cart", "error");
//       if (err.response?.status === 401) {
//         navigate("/login");
//       }
//     } finally {
//       setAddingToCart(prev => ({ ...prev, [prod._id]: false }));
//     }
//   };

//   const formatPrice = useCallback((price) => {
//     const numPrice = parseFloat(price || 0);
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0
//     }).format(numPrice);
//   }, []);

//   // ==================== FILTER HELPERS ====================
//   const isAnyFilterActive = useMemo(() => {
//     return filters.brandIds.length > 0 ||
//       filters.categoryIds.length > 0 ||
//       filters.skinTypes.length > 0 ||
//       filters.formulations.length > 0 ||
//       filters.finishes.length > 0 ||
//       filters.ingredients.length > 0 ||
//       filters.priceRange ||
//       filters.discountMin ||
//       filters.minRating ||
//       filters.sort !== "recent";
//   }, [filters]);

//   const handleClearAllFilters = useCallback(() => {
//     setFilters({
//       brandIds: [],
//       categoryIds: [],
//       skinTypes: [],
//       formulations: [],
//       finishes: [],
//       ingredients: [],
//       priceRange: null,
//       discountMin: null,
//       minRating: "",
//       sort: "recent",
//     });
//   }, []);

//   const brandFilterProps = {
//     filters,
//     setFilters,
//     filterData,
//     trendingCategories,
//     activeCategorySlug: null,
//     activeCategoryName: "",
//     onClearCategory: handleClearAllFilters,
//     onCategoryPillClick: () => { },
//   };

//   // ==================== PRODUCT CARD ====================
//   const renderProductCard = (prod) => {
//     const variants = Array.isArray(prod.variants) ? prod.variants : [];
//     const hasVariants = variants.length > 0;
//     const selectedVariant = selectedVariants[prod._id];
//     const grouped = groupVariantsByType(variants);
//     const totalVariants = variants.length;

//     // 🔥 FIXED: Get effective variant for wishlist check
//     const effectiveVariant = selectedVariant || (hasVariants ? variants[0] : {});
//     const selectedSku = effectiveVariant ? getSku(effectiveVariant) : null;
//     const isProductInWishlist = selectedSku ? isInWishlist(prod._id, selectedSku) : false;
//     const productSlug = getProductSlug(prod);

//     let imageUrl = "https://placehold.co/400x300/ffffff/cccccc?text=Product";
//     const getVariantImage = (variant) => variant?.images?.[0] || variant?.image;

//     imageUrl = getVariantImage(selectedVariant) ||
//       getVariantImage(variants.find(v => v.stock > 0)) ||
//       getVariantImage(variants[0]) ||
//       prod.images?.[0] ||
//       "";

//     if (!imageUrl) {
//       imageUrl = "https://placehold.co/400x300/ffffff/cccccc?text=Product";
//     } else if (!imageUrl.startsWith("http")) {
//       imageUrl = `https://res.cloudinary.com/dekngswix/image/upload/${imageUrl}`;
//     }

//     const isVariantSelected = !!selectedVariants[prod._id];
//     const isAdding = addingToCart[prod._id];
//     const outOfStock = hasVariants
//       ? (selectedVariant?.stock <= 0)
//       : (prod.stock <= 0);

//     const showSelectVariantButton = hasVariants && !isVariantSelected;

//     const buttonDisabled = isAdding || outOfStock;
//     const buttonText = isAdding
//       ? "Adding..."
//       : showSelectVariantButton
//         ? "Select Shade"
//         : outOfStock
//           ? "Out of Stock"
//           : "Add to Bag";

//     return (
//       <div key={prod._id} className="col-6 col-sm-4 col-lg-4 mb-4 position-relative">
//         <div className="foryou-card-wrapper h-100">
//           <div className="foryou-card h-100">
//             <div
//               className="foryou-img-wrapper"
//               onClick={() => navigate(`/product/${productSlug}`)}
//               style={{ cursor: 'pointer', position: 'relative' }}
//             >
//               <img
//                 src={imageUrl}
//                 alt={prod.name || "Product"}
//                 className="foryou-img img-fluid"
//                 loading="lazy"
//                 style={{ height: '200px', objectFit: 'contain' }}
//                 onError={(e) => {
//                   e.currentTarget.src = "https://placehold.co/400x300/ffffff/cccccc?text=Product";
//                 }}
//               />

//               {/* 🔥 FIXED: Wishlist button with proper variant handling */}
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   // Pass effective variant to toggle
//                   toggleWishlist(prod, effectiveVariant);
//                 }}
//                 disabled={wishlistLoading[prod._id]}
//                 style={{
//                   position: 'absolute',
//                   top: '10px',
//                   right: '10px',
//                   cursor: wishlistLoading[prod._id] ? 'not-allowed' : 'pointer',
//                   color: isProductInWishlist ? '#dc3545' : '#000000',
//                   fontSize: '22px',
//                   zIndex: 2,
//                   backgroundColor: 'rgba(255, 255, 255, 0.9)',
//                   borderRadius: '50%',
//                   width: '34px',
//                   height: '34px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//                   transition: 'all 0.3s ease',
//                   border: 'none',
//                   outline: 'none'
//                 }}
//                 title={isProductInWishlist ? "Remove from wishlist" : "Add to wishlist"}
//               >
//                 {wishlistLoading[prod._id] ? (
//                   <div className="spinner-border spinner-border-sm" role="status"></div>
//                 ) : isProductInWishlist ? (
//                   <FaHeart />
//                 ) : (
//                   <FaRegHeart />
//                 )}
//               </button>

//               {selectedVariant?.promoApplied && (
//                 <div className="promo-badge" style={{
//                   position: 'absolute',
//                   top: '10px',
//                   left: '10px',
//                   background: '#ff6b6b',
//                   color: 'white',
//                   padding: '4px 8px',
//                   borderRadius: '4px',
//                   fontSize: '12px',
//                   fontWeight: 'bold'
//                 }}>
//                   Promo
//                 </div>
//               )}
//             </div>

//             <div className="foryou-product-info w-100 ps-lg-0 p-0 pt-md-0 justify-content-end">
//               <div className="justify-content-between d-flex flex-column" style={{ height: 'auto', minHeight: '225px' }}>

//                 <div className="brand-name small text-muted mb-1 mt-2 text-start">
//                   {getBrandName(prod)}
//                 </div>

//                 <h6
//                   className="foryou-name font-family-Poppins m-0 p-0"
//                   onClick={() => navigate(`/product/${productSlug}`)}
//                   style={{ cursor: 'pointer', fontSize: '14px', lineHeight: '1.4' }}
//                 >
//                   {prod.name || "Unnamed Product"}
//                 </h6>

//                 {hasVariants && (
//                   <div className="variant-section m-0 p-0 ms-0 mt-2 mb-2">
//                     {isVariantSelected ? (
//                       <div
//                         className="selected-variant-display text-muted small"
//                         style={{ cursor: 'pointer', display: 'inline-block' }}
//                         onClick={(e) => openVariantOverlay(prod._id, "all", e)}
//                         title="Click to change variant"
//                       >
//                         Variant: <span className="fw-bold text-dark">{getVariantDisplayText(selectedVariant)}</span>
//                         <FaChevronDown className="ms-1" style={{ fontSize: '10px' }} />
//                       </div>
//                     ) : (
//                       <div className="small text-muted" style={{ height: '20px' }}>
//                         {totalVariants} Variants Available
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 <div className="price-section mb-3">
//                   <div className="d-flex align-items-baseline flex-wrap">
//                     <span className="current-price fw-400 fs-5" style={{ fontSize: '16px' }}>
//                       {formatPrice(selectedVariant?.displayPrice || selectedVariant?.discountedPrice || prod.price || 0)}
//                     </span>
//                     {(selectedVariant?.originalPrice || prod.mrp) > (selectedVariant?.displayPrice || selectedVariant?.discountedPrice || prod.price || 0) && (
//                       <>
//                         <span className="original-price text-muted text-decoration-line-through ms-2 fs-6" style={{ fontSize: '14px' }}>
//                           {formatPrice(selectedVariant?.originalPrice || selectedVariant?.mrp || prod.mrp || 0)}
//                         </span>
//                         <span className="discount-percent text-danger fw-bold ms-2" style={{ fontSize: '12px' }}>
//                           ({Math.round(((selectedVariant?.originalPrice || selectedVariant?.mrp || prod.mrp || 0) - (selectedVariant?.displayPrice || selectedVariant?.discountedPrice || prod.price || 0)) / (selectedVariant?.originalPrice || selectedVariant?.mrp || prod.mrp || 1) * 100)}% OFF)
//                         </span>
//                       </>
//                     )}
//                   </div>
//                 </div>

//                 <div className="cart-section">
//                   <div className="d-flex align-items-center justify-content-between">
//                     <button
//                       className={`w-100 btn-add-cart ${buttonDisabled ? 'disabled' : ''}`}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         if (showSelectVariantButton) {
//                           openVariantOverlay(prod._id, "all", e);
//                         } else {
//                           handleAddToCart(prod);
//                         }
//                       }}
//                       disabled={buttonDisabled}
//                       style={{
//                         transition: "background-color 0.3s ease, color 0.3s ease",
//                         padding: '10px 15px',
//                         borderRadius: '6px',
//                         border: '1px solid #000',
//                         backgroundColor: buttonDisabled ? '#ccc' : '#000',
//                         color: buttonDisabled ? '#666' : '#fff',
//                         fontSize: '14px',
//                         fontWeight: '500',
//                         cursor: buttonDisabled ? 'not-allowed' : 'pointer',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         gap: '8px'
//                       }}
//                     >
//                       {isAdding ? (
//                         <>
//                           <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//                           Adding...
//                         </>
//                       ) : (
//                         <>
//                           {buttonText}
//                           {!buttonDisabled && !isAdding && !showSelectVariantButton && (
//                             <img src={Bag} alt="Bag" style={{ height: "18px" }} />
//                           )}
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Variant Overlay */}
//         {showVariantOverlay === prod._id && (
//           <div className="variant-overlay" onClick={closeVariantOverlay} style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             backgroundColor: 'rgba(0,0,0,0.5)',
//             zIndex: 1000,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center'
//           }}>
//             <div
//               className="variant-overlay-content p-0"
//               onClick={(e) => e.stopPropagation()}
//               style={{
//                 width: '100%',
//                 maxWidth: '500px',
//                 height: '100%',
//                 background: '#fff',
//                 borderRadius: '0px',
//                 overflow: 'hidden',
//                 display: 'flex',
//                 flexDirection: 'column'
//               }}
//             >
//               <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
//                 <h5 className="m-0 page-title-main-name">Select Variant ({totalVariants})</h5>
//                 <button
//                   onClick={closeVariantOverlay}
//                   style={{
//                     background: 'none',
//                     border: 'none',
//                     fontSize: '24px',
//                     cursor: 'pointer'
//                   }}
//                 >
//                   ×
//                 </button>
//               </div>

//               <div className="variant-tabs d-flex">
//                 <button
//                   className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "all" ? "active" : ""}`}
//                   onClick={() => setSelectedVariantType("all")}
//                   style={{
//                     border: 'none',
//                     background: selectedVariantType === "all" ? '#000' : '#f5f5f5',
//                     color: selectedVariantType === "all" ? '#fff' : '#000',
//                     fontWeight: '500'
//                   }}
//                 >
//                   All ({totalVariants})
//                 </button>
//                 {grouped.color.length > 0 && (
//                   <button
//                     className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "color" ? "active" : ""}`}
//                     onClick={() => setSelectedVariantType("color")}
//                     style={{
//                       border: 'none',
//                       background: selectedVariantType === "color" ? '#000' : '#f5f5f5',
//                       color: selectedVariantType === "color" ? '#fff' : '#000',
//                       fontWeight: '500'
//                     }}
//                   >
//                     Colors ({grouped.color.length})
//                   </button>
//                 )}
//                 {grouped.text.length > 0 && (
//                   <button
//                     className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "text" ? "active" : ""}`}
//                     onClick={() => setSelectedVariantType("text")}
//                     style={{
//                       border: 'none',
//                       background: selectedVariantType === "text" ? '#000' : '#f5f5f5',
//                       color: selectedVariantType === "text" ? '#fff' : '#000',
//                       fontWeight: '500'
//                     }}
//                   >
//                     Sizes ({grouped.text.length})
//                   </button>
//                 )}
//               </div>

//               <div className="p-3 overflow-auto flex-grow-1" style={{ maxHeight: '400px' }}>
//                 {(selectedVariantType === "all" || selectedVariantType === "color") && grouped.color.length > 0 && (
//                   <div className="row row-col-4 g-3">
//                     {grouped.color.map((v) => {
//                       const isSelected = selectedVariant?.sku === v.sku || (selectedVariant?._id && selectedVariant._id === v._id);
//                       const isOutOfStock = (v.stock ?? 0) <= 0;

//                       return (
//                         <div className="col-lg-6 col-6 mt-2" key={getSku(v) || v._id}>
//                           <div
//                             className="text-center"
//                             style={{
//                               cursor: isOutOfStock ? "not-allowed" : "pointer",
//                             }}
//                             onClick={() =>
//                               !isOutOfStock &&
//                               (handleVariantSelect(prod._id, v),
//                                 closeVariantOverlay())
//                             }
//                           >
//                             <div className="page-title-main-name"
//                               style={{
//                                 width: "28px",
//                                 height: "28px",
//                                 borderRadius: "20%",
//                                 backgroundColor: v.hex || "#ccc",
//                                 margin: "0 auto 8px",
//                                 border: isSelected ? "2px solid #000" : "1px solid #ddd",
//                                 opacity: isOutOfStock ? 0.5 : 1,
//                                 position: "relative",
//                               }}
//                             >
//                               {isSelected && (
//                                 <span
//                                   style={{
//                                     position: "absolute",
//                                     top: "50%",
//                                     left: "50%",
//                                     transform: "translate(-50%, -50%)",
//                                     color: "#fff",
//                                     fontWeight: "bold",
//                                   }}
//                                 >
//                                   ✓
//                                 </span>
//                               )}
//                             </div>
//                             <div className="small page-title-main-name" style={{ fontSize: '12px' }}>
//                               {getVariantDisplayText(v)}
//                             </div>
//                             {isOutOfStock && (
//                               <div className="text-danger small">
//                                 Out of Stock
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}

//                 {(selectedVariantType === "all" || selectedVariantType === "text") && grouped.text.length > 0 && (
//                   <div className="row row-cols-3 g-0">
//                     {grouped.text.map((v) => {
//                       const isSelected = selectedVariant?.sku === v.sku || (selectedVariant?._id && selectedVariant._id === v._id);
//                       const isOutOfStock = (v.stock ?? 0) <= 0;

//                       return (
//                         <div className="col-lg-3 col-5" key={getSku(v) || v._id}>
//                           <div
//                             className="text-center"
//                             style={{
//                               cursor: isOutOfStock ? "not-allowed" : "pointer",
//                             }}
//                             onClick={() =>
//                               !isOutOfStock &&
//                               (handleVariantSelect(prod._id, v),
//                                 closeVariantOverlay())
//                             }
//                           >
//                             <div
//                               style={{
//                                 padding: "10px",
//                                 borderRadius: "8px",
//                                 border: isSelected ? "2px solid #000" : "1px solid #ddd",
//                                 background: isSelected ? "#f8f9fa" : "#fff",
//                                 minHeight: "50px",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 opacity: isOutOfStock ? 0.5 : 1,
//                               }}
//                             >
//                               {getVariantDisplayText(v)}
//                             </div>
//                             {isOutOfStock && (
//                               <div className="text-danger small mt-1">
//                                 Out of Stock
//                               </div>
//                             )}
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

//   // ==================== RENDER ====================
//   return (
//     <div className="search-page-container">
//       <ToastContainer position="top-right" autoClose={3000} />
//       <Header />

//       {/* <div className="search-main-wrapper"> */}
//       <div className="container-lg-fluid px-lg-5 px-3">
//         {/* Sticky Search Bar */}
//         <div className="search-header-sticky">
//           <div className="search-input-container">
//             <FaSearch className="inner-search-icon" />
//             <input className="page-title-main-name"
//               type="text"
//               placeholder="Search products, brands, or categories..."
//               value={searchTerm}
//               onChange={handleInputChange}
//               autoFocus
//             />
//             {searchTerm && <FaTimes className="clear-icon" onClick={clearSearch} />}
//             {isSyncing && <FaSync className="spin sync-icon" title="Syncing Inventory..." />}
//           </div>
//           <div className="search-results-meta page-title-main-name">
//             {isLoading ? (
//               <span>Initializing catalog...</span>
//             ) : (
//               <p>
//                 Showing <b>{filteredProducts.length}</b> items
//                 {searchTerm && <> for "<b>{searchTerm}</b>"</>}
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Main Content with Sidebar */}
//         <div className="container-fluid py-4">
//           <div className="row">
//             {/* Desktop Sidebar Filter */}
//             <div className="d-none d-lg-block col-lg-3">
//               <BrandFilter {...brandFilterProps} />
//             </div>

//             {/* Mobile Filter Buttons */}
//             <div className="d-lg-none mb-3 col-12">
//               <div className="w-100 filter-responsive rounded shadow-sm">
//                 <div className="container-fluid p-0">
//                   <div className="row g-0" style={{ flexDirection: "row-reverse" }}>
//                     <div className="col-6">
//                       <button className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
//                         onClick={() => setShowFilterOffcanvas(true)} style={{ gap: 12 }}>
//                         <img src={filtering} alt="Filter" style={{ width: 25 }} />
//                         <div className="text-start">
//                           <p className="mb-0 fs-6 fw-semibold page-title-main-name">Filter</p>
//                           <span className="text-muted small page-title-main-name">Tap to apply</span>
//                         </div>
//                       </button>
//                     </div>
//                     <div className="col-6 border-end">
//                       <button className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
//                         onClick={() => setShowSortOffcanvas(true)} style={{ gap: 12 }}>
//                         <img src={updownarrow} alt="Sort" style={{ width: 25 }} />
//                         <div className="text-start">
//                           <p className="mb-0 fs-6 fw-semibold page-title-main-name">Sort by</p>
//                           <span className="text-muted small">
//                             {filters.sort === "recent" ? "Relevance" :
//                               filters.sort === "priceHighToLow" ? "Price High to Low" : "Price Low to High"}
//                           </span>
//                         </div>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Mobile Filter Offcanvas */}
//             {showFilterOffcanvas && (
//               <>
//                 <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
//                   style={{ opacity: 0.5, zIndex: 1040 }} onClick={() => setShowFilterOffcanvas(false)} />
//                 <div className="position-fixed start-0 bottom-0 w-100 bg-white"
//                   style={{ zIndex: 1050, borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: "85vh", boxShadow: "0 -4px 20px rgba(0,0,0,.2)" }}>
//                   <div className="text-center py-3 position-relative">
//                     <h5 className="mb-0 fw-bold">Filters</h5>
//                     <button className="btn-close position-absolute end-0 me-3"
//                       style={{ top: "50%", transform: "translateY(-50%)" }}
//                       onClick={() => setShowFilterOffcanvas(false)} />
//                     <div className="mx-auto mt-2 bg-secondary" style={{ height: 5, width: 50, borderRadius: 3 }} />
//                   </div>
//                   <div className="px-3 pb-4 overflow-auto" style={{ maxHeight: "70vh" }}>
//                     <BrandFilter
//                       {...brandFilterProps}
//                       onClose={() => setShowFilterOffcanvas(false)}
//                     />
//                   </div>
//                 </div>
//               </>
//             )}

//             {/* Mobile Sort Offcanvas */}
//             {showSortOffcanvas && (
//               <>
//                 <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
//                   style={{ opacity: 0.5, zIndex: 1040 }} onClick={() => setShowSortOffcanvas(false)} />
//                 <div className="position-fixed start-0 bottom-0 w-100 bg-white"
//                   style={{ zIndex: 1050, borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: "60vh", boxShadow: "0 -4px 12px rgba(0,0,0,.15)" }}>
//                   <div className="text-center py-3 position-relative">
//                     <h5 className="mb-0 fw-bold page-title-main-name">Sort by</h5>
//                     <button className="btn-close position-absolute end-0 me-3"
//                       style={{ top: "50%", transform: "translateY(-50%)" }}
//                       onClick={() => setShowSortOffcanvas(false)} />
//                     <div className="mx-auto mt-2 bg-secondary" style={{ height: 5, width: 50, borderRadius: 3 }} />
//                   </div>
//                   <div className="px-4 pb-4">
//                     <div className="list-group">
//                       {[
//                         { value: "recent", label: "Relevance" },
//                         { value: "priceHighToLow", label: "Price High to Low" },
//                         { value: "priceLowToHigh", label: "Price Low to High" },
//                       ].map(({ value, label }) => (
//                         <label key={value} className="list-group-item py-3 d-flex align-items-center">
//                           <input className="form-check-input me-3" type="radio" name="sort"
//                             checked={filters.sort === value}
//                             onChange={() => {
//                               setFilters(prev => ({ ...prev, sort: value }));
//                               setShowSortOffcanvas(false);
//                             }} />
//                           <span className="page-title-main-name">{label}</span>
//                         </label>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </>
//             )}

//             {/* Results Grid */}
//             <div className="col-12 col-lg-9">
//               <div className="mb-3 d-flex justify-content-between align-items-center">
//                 <span className="text-muted page-title-main-name">
//                   {filteredProducts.length > 0 ? `Showing ${filteredProducts.length} products` : "No products found"}
//                 </span>
//                 {isAnyFilterActive && (
//                   <button className="btn btn-sm btn-outline-danger" onClick={handleClearAllFilters}>
//                     Clear Filters
//                   </button>
//                 )}
//               </div>

//               {isLoading && allProducts.length === 0 ? (
//                 <div className="loading-state text-center py-5">
//                   <FaSpinner className="spin large-spinner" />
//                   <p>Loading your store...</p>
//                 </div>
//               ) : error ? (
//                 <div className="error-box text-center py-5">
//                   <FaRegSadTear size={40} />
//                   <p>{error}</p>
//                   <button onClick={() => window.location.reload()}>Retry</button>
//                 </div>
//               ) : filteredProducts.length === 0 ? (
//                 <div className="no-results text-center py-5">
//                   <FaSearch size={64} className="text-muted mb-3" />
//                   <h3>No matches found</h3>
//                   <p className="text-muted">Try different keywords or adjust your filters.</p>
//                   {(searchTerm || isAnyFilterActive) && (
//                     <button className="btn btn-dark mt-3" onClick={() => {
//                       clearSearch();
//                       handleClearAllFilters();
//                     }}>
//                       Clear All
//                     </button>
//                   )}
//                 </div>
//               ) : (
//                 <div className="row g-4">
//                   {filteredProducts.map(renderProductCard)}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default SearchPage;

















// import React, { useState, useEffect, useMemo, useRef, useCallback, useContext } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { FaSearch, FaRegSadTear, FaSpinner, FaSync, FaTimes, FaHeart, FaRegHeart, FaChevronDown } from "react-icons/fa";
// import Header from "./Header";
// import Footer from "./Footer";
// import axiosInstance from "../utils/axiosInstance.js";
// import { CartContext } from "../context/CartContext";
// import { UserContext } from "./UserContext.jsx";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "../css/SearchPage.css";
// import Bag from "../assets/Bag.svg";
// import updownarrow from "../assets/updownarrow.svg";
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// import filtering from "../assets/filtering.svg";
// import BrandFilter from "./BrandFilter";

// const CART_API_BASE = "/api/user/cart";
// const WISHLIST_CACHE_KEY = "guestWishlist";
// const PRODUCT_ALL_API = "https://beauty.joyory.com/api/user/products/all";

// // ==================== HELPER FUNCTIONS ====================
// const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || 'default'}`;

// const isValidHexColor = (hex) => {
//   if (!hex || typeof hex !== "string") return false;
//   const normalized = hex.trim().toLowerCase();
//   return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(normalized);
// };

// const getVariantDisplayText = (variant) => {
//   return (
//     variant.shadeName ||
//     variant.name ||
//     variant.size ||
//     variant.ml ||
//     variant.weight ||
//     "Default"
//   ).toUpperCase();
// };

// const groupVariantsByType = (variants) => {
//   const grouped = { color: [], text: [] };
//   variants.forEach((v) => {
//     if (!v) return;
//     if (v.hex && isValidHexColor(v.hex)) {
//       grouped.color.push(v);
//     } else {
//       grouped.text.push(v);
//     }
//   });
//   return grouped;
// };

// const getBrandName = (product) => {
//   if (!product?.brand) return "Unknown Brand";
//   if (typeof product.brand === "object" && product.brand.name) return product.brand.name;
//   if (typeof product.brand === "string") return product.brand;
//   return "Unknown Brand";
// };

// const getVariantName = (variant) => {
//   if (!variant) return "Default";
//   const nameSources = [
//     variant.shadeName,
//     variant.name,
//     variant.variantName,
//     variant.size,
//     variant.ml,
//     variant.weight
//   ];
//   for (const source of nameSources) {
//     if (source && typeof source === 'string') {
//       return source;
//     }
//   }
//   return "Default";
// };

// const getVariantType = (variant) => {
//   if (!variant) return 'default';
//   if (variant.hex && isValidHexColor(variant.hex)) return 'color';
//   if (variant.shadeName) return 'shade';
//   if (variant.size) return 'size';
//   if (variant.ml) return 'ml';
//   if (variant.weight) return 'weight';
//   return 'default';
// };

// // ==================== MAIN COMPONENT ====================
// const SearchPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { addToCart } = useContext(CartContext);
//   const { user } = useContext(UserContext);

//   // URL Syncing
//   const queryParams = new URLSearchParams(location.search);
//   const initialQuery = queryParams.get("q") || "";
//   const [searchTerm, setSearchTerm] = useState(initialQuery);

//   const [allProducts, setAllProducts] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSyncing, setIsSyncing] = useState(false);
//   const [error, setError] = useState(null);
//   const hasFetched = useRef(false);

//   // ==================== FILTER STATES ====================
//   const [filterData, setFilterData] = useState(null);
//   const [trendingCategories, setTrendingCategories] = useState([]);
//   const [showFilterOffcanvas, setShowFilterOffcanvas] = useState(false);
//   const [showSortOffcanvas, setShowSortOffcanvas] = useState(false);

//   const [filters, setFilters] = useState({
//     brandIds: [],
//     categoryIds: [],
//     skinTypes: [],
//     formulations: [],
//     finishes: [],
//     ingredients: [],
//     priceRange: null,
//     discountMin: null,
//     minRating: "",
//     sort: "recent",
//   });

//   // ==================== WISHLIST STATES ====================
//   const [wishlistLoading, setWishlistLoading] = useState({});
//   const [wishlistData, setWishlistData] = useState([]);

//   // ==================== VARIANT STATES ====================
//   const [selectedVariants, setSelectedVariants] = useState({});
//   const [addingToCart, setAddingToCart] = useState({});
//   const [showVariantOverlay, setShowVariantOverlay] = useState(null);
//   const [selectedVariantType, setSelectedVariantType] = useState("all");

//   // Toast Utility
//   const showToastMsg = (message, type = "error", duration = 3000) => {
//     if (type === "success") {
//       toast.success(message, { autoClose: duration });
//     } else if (type === "error") {
//       toast.error(message, { autoClose: duration });
//     } else {
//       toast.info(message, { autoClose: duration });
//     }
//   };

//   // ==================== WISHLIST FUNCTIONS - FULLY UPDATED ====================

//   // 🔥 FIXED: Proper string comparison for IDs
//   const isInWishlist = useCallback((productId, sku) => {
//     if (!productId || !sku) return false;

//     // Normalize to strings for comparison
//     const normalizedProductId = String(productId);
//     const normalizedSku = String(sku);

//     return wishlistData.some(item => {
//       const itemProductId = String(item.productId || item._id);
//       const itemSku = String(item.sku);
//       return itemProductId === normalizedProductId && itemSku === normalizedSku;
//     });
//   }, [wishlistData]);

//   // 🔥 FIXED: Fetch with proper error handling and credentials
//   const fetchWishlistData = useCallback(async () => {
//     try {
//       if (user && !user.guest) {
//         const response = await axiosInstance.get("/api/user/wishlist", {
//           withCredentials: true // Ensure cookies are sent
//         });
//         if (response.data.success) {
//           setWishlistData(response.data.wishlist || []);
//         }
//       } else {
//         const localWishlist = JSON.parse(localStorage.getItem(WISHLIST_CACHE_KEY)) || [];
//         // Normalize local data to match API format
//         const formattedWishlist = localWishlist.map(item => ({
//           productId: String(item._id || item.productId),
//           _id: String(item._id),
//           sku: String(item.sku),
//           name: item.name,
//           variant: item.variantName || item.variant,
//           image: item.image,
//           displayPrice: item.displayPrice,
//           originalPrice: item.originalPrice,
//           discountPercent: item.discountPercent,
//           status: item.status,
//           avgRating: item.avgRating,
//           totalRatings: item.totalRatings
//         }));
//         setWishlistData(formattedWishlist);
//       }
//     } catch (error) {
//       console.error("Error fetching wishlist data:", error);
//       setWishlistData([]);
//     }
//   }, [user]);

//   // 🔥 FIXED: Toggle with proper string normalization and storage sync
//   const toggleWishlist = useCallback(async (prod, variant) => {
//     if (!user || user.guest) {
//       showToastMsg("Please login to use wishlist", "error");
//       navigate("/login", { state: { from: location.pathname } });
//       return;
//     }
//     // Handle case when no variant is passed (for products without variants)
//     if (!prod) {
//       showToastMsg("Product not found", "error");
//       return;
//     }

//     // Get effective variant (passed variant, selected variant, or first available)
//     const effectiveVariant = variant && Object.keys(variant).length > 0
//       ? variant
//       : selectedVariants[prod._id]
//         ? selectedVariants[prod._id]
//         : (prod.variants?.[0] || {});

//     if (!effectiveVariant || Object.keys(effectiveVariant).length === 0) {
//       showToastMsg("Please select a variant first", "error");
//       return;
//     }

//     const productId = String(prod._id);
//     const sku = String(getSku(effectiveVariant));

//     setWishlistLoading(prev => ({ ...prev, [productId]: true }));

//     try {
//       const currentlyInWishlist = isInWishlist(productId, sku);

//       if (user && !user.guest) {
//         // API call for logged-in users with credentials
//         if (currentlyInWishlist) {
//           await axiosInstance.delete(`/api/user/wishlist/${productId}`, {
//             data: { sku: sku },
//             withCredentials: true // 🔥 FIXED: Added credentials
//           });
//           showToastMsg("Removed from wishlist!", "success");
//         } else {
//           await axiosInstance.post(`/api/user/wishlist/${productId}`,
//             { sku: sku },
//             { withCredentials: true } // 🔥 FIXED: Added credentials
//           );
//           showToastMsg("Added to wishlist!", "success");
//         }
//         // Re-fetch to sync with server
//         await fetchWishlistData();
//       } else {
//         // LocalStorage for guests
//         let guestWishlist = JSON.parse(localStorage.getItem(WISHLIST_CACHE_KEY)) || [];

//         if (currentlyInWishlist) {
//           // Remove from wishlist
//           guestWishlist = guestWishlist.filter(item =>
//             !(String(item._id) === productId && String(item.sku) === sku)
//           );
//           localStorage.setItem(WISHLIST_CACHE_KEY, JSON.stringify(guestWishlist));
//           showToastMsg("Removed from wishlist!", "success");
//         } else {
//           // Add to wishlist with normalized data
//           const productData = {
//             _id: productId,
//             productId: productId,
//             name: prod.name,
//             brand: getBrandName(prod),
//             price: effectiveVariant.discountedPrice || effectiveVariant.displayPrice || prod.price || 0,
//             originalPrice: effectiveVariant.originalPrice || effectiveVariant.mrp || prod.mrp || prod.price || 0,
//             mrp: effectiveVariant.originalPrice || effectiveVariant.mrp || prod.mrp || prod.price || 0,
//             displayPrice: effectiveVariant.discountedPrice || effectiveVariant.displayPrice || prod.price || 0,
//             images: effectiveVariant.images || prod.images || ["/placeholder.png"],
//             image: effectiveVariant.images?.[0] || effectiveVariant.image || prod.images?.[0] || "/placeholder.png",
//             slug: prod.slugs?.[0] || prod.slug || productId,
//             sku: sku,
//             variantSku: sku,
//             variantId: sku,
//             variantName: effectiveVariant.shadeName || effectiveVariant.name || "Default",
//             shadeName: effectiveVariant.shadeName || effectiveVariant.name || "Default",
//             variant: effectiveVariant.shadeName || effectiveVariant.name || "Default",
//             hex: effectiveVariant.hex || "#cccccc",
//             stock: effectiveVariant.stock || 0,
//             status: effectiveVariant.stock > 0 ? "inStock" : "outOfStock",
//             avgRating: prod.avgRating || 0,
//             totalRatings: prod.totalRatings || 0,
//             commentsCount: prod.totalRatings || 0,
//             discountPercent: (effectiveVariant.originalPrice && effectiveVariant.discountedPrice && effectiveVariant.originalPrice > effectiveVariant.discountedPrice)
//               ? Math.round(((effectiveVariant.originalPrice - effectiveVariant.discountedPrice) / effectiveVariant.originalPrice) * 100)
//               : 0
//           };
//           guestWishlist.push(productData);
//           localStorage.setItem(WISHLIST_CACHE_KEY, JSON.stringify(guestWishlist));
//           showToastMsg("Added to wishlist!", "success");
//         }

//         // 🔥 FIXED: Dispatch storage event for cross-tab sync
//         window.dispatchEvent(new StorageEvent('storage', { key: WISHLIST_CACHE_KEY }));

//         // Update local state immediately
//         await fetchWishlistData();
//       }
//     } catch (error) {
//       console.error("Wishlist toggle error:", error);
//       if (error.response?.status === 401) {
//         showToastMsg("Please login to use wishlist", "error");
//         navigate("/login");
//       } else {
//         showToastMsg(error.response?.data?.message || "Failed to update wishlist", "error");
//       }
//     } finally {
//       setWishlistLoading(prev => ({ ...prev, [productId]: false }));
//     }
//   }, [user, isInWishlist, fetchWishlistData, selectedVariants, navigate]);

//   // 🔥 FIXED: Listen for storage changes (cross-tab sync)
//   useEffect(() => {
//     fetchWishlistData();
//   }, [fetchWishlistData]);

//   // 🔥 FIXED: Storage event listener for multi-tab sync
//   useEffect(() => {
//     const handleStorageChange = (e) => {
//       if (e.key === WISHLIST_CACHE_KEY) {
//         fetchWishlistData();
//       }
//     };

//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, [fetchWishlistData]);

//   // ==================== DATA FETCHING WITH FILTERS ====================
//   useEffect(() => {
//     if (hasFetched.current) return;

//     const fetchEverySingleProduct = async () => {
//       try {
//         setIsLoading(true);
//         setIsSyncing(true);

//         let currentCursor = null;
//         let hasMore = true;
//         const productMap = new Map();

//         while (hasMore) {
//           const response = await axiosInstance.get(PRODUCT_ALL_API, {
//             params: { cursor: currentCursor },
//             withCredentials: true
//           });

//           let products = [];
//           let pagination = {};
//           if (Array.isArray(response.data)) {
//             products = response.data;
//           } else if (response.data && Array.isArray(response.data.products)) {
//             products = response.data.products;
//             pagination = response.data.pagination || {};
//           }

//           if (response.data.filters && !filterData) {
//             setFilterData(response.data.filters);
//           }
//           if (response.data.trendingCategories && trendingCategories.length === 0) {
//             setTrendingCategories(response.data.trendingCategories);
//           }

//           if (products.length > 0) {
//             products.forEach(p => productMap.set(p._id, p));
//             setAllProducts(Array.from(productMap.values()));
//           }

//           if (pagination.hasMore === false) {
//             hasMore = false;
//           } else if (pagination.nextCursor) {
//             currentCursor = pagination.nextCursor;
//           } else {
//             hasMore = false;
//           }
//         }

//         hasFetched.current = true;
//       } catch (err) {
//         console.error("Fetch Error:", err);
//         setError("We couldn't load the inventory. Please try again.");
//       } finally {
//         setIsLoading(false);
//         setIsSyncing(false);
//       }
//     };

//     fetchEverySingleProduct();
//   }, []);

//   // ==================== CLIENT-SIDE SEARCH & FILTER ====================
//   const filteredProducts = useMemo(() => {
//     let result = allProducts;

//     const cleanTerm = searchTerm.toLowerCase().trim();
//     if (cleanTerm) {
//       const searchWords = cleanTerm.split(/\s+/);
//       result = result.filter((p) => {
//         const productName = (p.name || "").toLowerCase();
//         const brandName = (getBrandName(p) || "").toLowerCase();
//         const categoryName = (p.category?.name || "").toLowerCase();
//         const variantsText = p.variants?.map(v => (v.shadeName || v.name || "").toLowerCase()).join(" ") || "";
//         const searchable = `${productName} ${brandName} ${categoryName} ${variantsText}`;
//         return searchWords.every(word => searchable.includes(word));
//       });
//     }

//     if (filters.brandIds.length > 0) {
//       result = result.filter(p => {
//         const brandId = typeof p.brand === 'object' ? p.brand?._id : p.brand;
//         return filters.brandIds.includes(brandId);
//       });
//     }

//     if (filters.categoryIds.length > 0) {
//       result = result.filter(p => {
//         const catId = typeof p.category === 'object' ? p.category?._id : p.category;
//         return filters.categoryIds.includes(catId);
//       });
//     }

//     if (filters.skinTypes.length > 0) {
//       result = result.filter(p =>
//         filters.skinTypes.some(st => p.skinTypes?.includes(st))
//       );
//     }

//     if (filters.ingredients.length > 0) {
//       result = result.filter(p =>
//         filters.ingredients.some(ing => p.ingredients?.includes(ing))
//       );
//     }

//     if (filters.priceRange) {
//       result = result.filter(p => {
//         const price = p.price || 0;
//         const min = filters.priceRange.min || 0;
//         const max = filters.priceRange.max;
//         return price >= min && (max == null || price <= max);
//       });
//     }

//     if (filters.discountMin) {
//       result = result.filter(p => {
//         const discount = p.discountPercent || 0;
//         return discount >= filters.discountMin;
//       });
//     }

//     if (filters.minRating) {
//       result = result.filter(p => (p.avgRating || 0) >= parseFloat(filters.minRating));
//     }

//     if (filters.sort === "priceHighToLow") {
//       result = [...result].sort((a, b) => (b.price || 0) - (a.price || 0));
//     } else if (filters.sort === "priceLowToHigh") {
//       result = [...result].sort((a, b) => (a.price || 0) - (b.price || 0));
//     }

//     return result;
//   }, [searchTerm, allProducts, filters]);

//   // ==================== HANDLERS ====================
//   const handleInputChange = (e) => {
//     const val = e.target.value;
//     setSearchTerm(val);

//     const params = new URLSearchParams(window.location.search);
//     if (val) params.set("q", val);
//     else params.delete("q");
//     navigate({ search: params.toString() }, { replace: true });
//   };

//   const clearSearch = () => {
//     setSearchTerm("");
//     navigate("/search", { replace: true });
//   };

//   const handleVariantSelect = useCallback((productId, variant) => {
//     if (!productId || !variant) return;

//     setSelectedVariants(prev => ({
//       ...prev,
//       [productId]: variant
//     }));
//   }, []);

//   const openVariantOverlay = (productId, type = "all", e) => {
//     if (e) e.stopPropagation();
//     setSelectedVariantType(type);
//     setShowVariantOverlay(productId);
//   };

//   const closeVariantOverlay = () => {
//     setShowVariantOverlay(null);
//     setSelectedVariantType("all");
//   };

//   const getProductSlug = (product) => {
//     return product.slugs?.[0] || product.slug || product._id;
//   };

//   // ==================== ADD TO CART ====================
//   const handleAddToCart = async (prod) => {
//     setAddingToCart(prev => ({ ...prev, [prod._id]: true }));
//     try {
//       const variants = Array.isArray(prod.variants) ? prod.variants : [];
//       const hasVariants = variants.length > 0;
//       let payload;

//       if (hasVariants) {
//         const selectedVariant = selectedVariants[prod._id];
//         if (!selectedVariant) {
//           showToastMsg("Please select a variant.", "error");
//           return;
//         }
//         if (selectedVariant.stock <= 0) {
//           showToastMsg("Selected variant is out of stock.", "error");
//           return;
//         }
//         payload = {
//           productId: prod._id,
//           variants: [{ variantSku: getSku(selectedVariant), quantity: 1 }],
//         };
//         const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
//         cache[prod._id] = selectedVariant;
//         localStorage.setItem("cartVariantCache", JSON.stringify(cache));
//       } else {
//         if (prod.stock <= 0) {
//           showToastMsg("Product is out of stock.", "error");
//           return;
//         }
//         payload = { productId: prod._id, quantity: 1 };
//         const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
//         delete cache[prod._id];
//         localStorage.setItem("cartVariantCache", JSON.stringify(cache));
//       }

//       const response = await axiosInstance.post(`${CART_API_BASE}/add`, payload);
//       if (!response.data.success) {
//         throw new Error(response.data.message || "Failed to add to cart");
//       }

//       showToastMsg("Product added to cart!", "success");
//       navigate("/cartpage");
//     } catch (err) {
//       console.error("Add to Cart error:", err);
//       showToastMsg(err.response?.data?.message || "Failed to add to cart", "error");
//       if (err.response?.status === 401) {
//         navigate("/login");
//       }
//     } finally {
//       setAddingToCart(prev => ({ ...prev, [prod._id]: false }));
//     }
//   };

//   const formatPrice = useCallback((price) => {
//     const numPrice = parseFloat(price || 0);
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0
//     }).format(numPrice);
//   }, []);

//   // ==================== FILTER HELPERS ====================
//   const isAnyFilterActive = useMemo(() => {
//     return filters.brandIds.length > 0 ||
//       filters.categoryIds.length > 0 ||
//       filters.skinTypes.length > 0 ||
//       filters.formulations.length > 0 ||
//       filters.finishes.length > 0 ||
//       filters.ingredients.length > 0 ||
//       filters.priceRange ||
//       filters.discountMin ||
//       filters.minRating ||
//       filters.sort !== "recent";
//   }, [filters]);

//   const handleClearAllFilters = useCallback(() => {
//     setFilters({
//       brandIds: [],
//       categoryIds: [],
//       skinTypes: [],
//       formulations: [],
//       finishes: [],
//       ingredients: [],
//       priceRange: null,
//       discountMin: null,
//       minRating: "",
//       sort: "recent",
//     });
//   }, []);

//   const brandFilterProps = {
//     filters,
//     setFilters,
//     filterData,
//     trendingCategories,
//     activeCategorySlug: null,
//     activeCategoryName: "",
//     onClearCategory: handleClearAllFilters,
//     onCategoryPillClick: () => { },
//   };

//   // ==================== PRODUCT CARD ====================
//   const renderProductCard = (prod) => {
//     const variants = Array.isArray(prod.variants) ? prod.variants : [];
//     const hasVariants = variants.length > 0;
//     const selectedVariant = selectedVariants[prod._id];
//     const grouped = groupVariantsByType(variants);
//     const totalVariants = variants.length;

//     // 🔥 FIXED: Get effective variant for wishlist check
//     const effectiveVariant = selectedVariant || (hasVariants ? variants[0] : {});
//     const selectedSku = effectiveVariant ? getSku(effectiveVariant) : null;
//     const isProductInWishlist = selectedSku ? isInWishlist(prod._id, selectedSku) : false;
//     const productSlug = getProductSlug(prod);

//     let imageUrl = "https://placehold.co/400x300/ffffff/cccccc?text=Product";
//     const getVariantImage = (variant) => variant?.images?.[0] || variant?.image;

//     imageUrl = getVariantImage(selectedVariant) ||
//       getVariantImage(variants.find(v => v.stock > 0)) ||
//       getVariantImage(variants[0]) ||
//       prod.images?.[0] ||
//       "";

//     if (!imageUrl) {
//       imageUrl = "https://placehold.co/400x300/ffffff/cccccc?text=Product";
//     } else if (!imageUrl.startsWith("http")) {
//       imageUrl = `https://res.cloudinary.com/dekngswix/image/upload/${imageUrl}`;
//     }

//     const isVariantSelected = !!selectedVariants[prod._id];
//     const isAdding = addingToCart[prod._id];
//     const outOfStock = hasVariants
//       ? (selectedVariant?.stock <= 0)
//       : (prod.stock <= 0);

//     const showSelectVariantButton = hasVariants && !isVariantSelected;

//     // Updated button styling to match CategoryLandingPage
//     const disabled = isAdding || (!showSelectVariantButton && outOfStock);

//     let btnText = "Add to Cart";
//     if (isAdding) btnText = "Adding...";
//     else if (showSelectVariantButton) btnText = "Select Variant";
//     else if (outOfStock) btnText = "Out of Stock";

//     return (
//       <div key={prod._id} className="col-6 col-sm-4 col-lg-4 mb-4 position-relative">
//         <div className="foryou-card-wrapper h-100">
//           <div className="foryou-card h-100">
//             <div
//               className="foryou-img-wrapper"
//               onClick={() => navigate(`/product/${productSlug}`)}
//               style={{ cursor: 'pointer', position: 'relative' }}
//             >
//               <img
//                 src={imageUrl}
//                 alt={prod.name || "Product"}
//                 className="foryou-img img-fluid"
//                 loading="lazy"
//                 style={{ height: '200px', objectFit: 'contain' }}
//                 onError={(e) => {
//                   e.currentTarget.src = "https://placehold.co/400x300/ffffff/cccccc?text=Product";
//                 }}
//               />

//               {/* 🔥 FIXED: Wishlist button with proper variant handling */}
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   // Pass effective variant to toggle
//                   toggleWishlist(prod, effectiveVariant);
//                 }}
//                 disabled={wishlistLoading[prod._id]}
//                 style={{
//                   position: 'absolute',
//                   top: '10px',
//                   right: '10px',
//                   cursor: wishlistLoading[prod._id] ? 'not-allowed' : 'pointer',
//                   color: isProductInWishlist ? '#dc3545' : '#000000',
//                   fontSize: '22px',
//                   zIndex: 2,
//                   backgroundColor: 'rgba(255, 255, 255, 0.9)',
//                   borderRadius: '50%',
//                   width: '34px',
//                   height: '34px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//                   transition: 'all 0.3s ease',
//                   border: 'none',
//                   outline: 'none'
//                 }}
//                 title={isProductInWishlist ? "Remove from wishlist" : "Add to wishlist"}
//               >
//                 {wishlistLoading[prod._id] ? (
//                   <div className="spinner-border spinner-border-sm" role="status"></div>
//                 ) : isProductInWishlist ? (
//                   <FaHeart />
//                 ) : (
//                   <FaRegHeart />
//                 )}
//               </button>

//               {selectedVariant?.promoApplied && (
//                 <div className="promo-badge" style={{
//                   position: 'absolute',
//                   top: '10px',
//                   left: '10px',
//                   background: '#ff6b6b',
//                   color: 'white',
//                   padding: '4px 8px',
//                   borderRadius: '4px',
//                   fontSize: '12px',
//                   fontWeight: 'bold'
//                 }}>
//                   Promo
//                 </div>
//               )}
//             </div>

//             <div className="foryou-product-info w-100 ps-lg-0 p-0 pt-md-0 justify-content-end">
//               <div className="justify-content-between d-flex flex-column" style={{ height: 'auto', minHeight: '225px' }}>

//                 <div className="brand-name small text-muted mb-1 mt-2 text-start">
//                   {getBrandName(prod)}
//                 </div>

//                 <h6
//                   className="foryou-name font-family-Poppins m-0 p-0"
//                   onClick={() => navigate(`/product/${productSlug}`)}
//                   style={{ cursor: 'pointer', fontSize: '14px', lineHeight: '1.4' }}
//                 >
//                   {prod.name || "Unnamed Product"}
//                 </h6>

//                 {hasVariants && (
//                   <div className="variant-section m-0 p-0 ms-0 mt-2 mb-2">
//                     {isVariantSelected ? (
//                       <div
//                         className="selected-variant-display text-muted small"
//                         style={{ cursor: 'pointer', display: 'inline-block' }}
//                         onClick={(e) => openVariantOverlay(prod._id, "all", e)}
//                         title="Click to change variant"
//                       >
//                         Variant: <span className="fw-bold text-dark">{getVariantDisplayText(selectedVariant)}</span>
//                         <FaChevronDown className="ms-1" style={{ fontSize: '10px' }} />
//                       </div>
//                     ) : (
//                       <div className="small text-muted" style={{ height: '20px' }}>
//                         {totalVariants} Variants Available
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 <div className="price-section mb-3">
//                   <div className="d-flex align-items-baseline flex-wrap">
//                     <span className="current-price fw-400 fs-5" style={{ fontSize: '16px' }}>
//                       {formatPrice(selectedVariant?.displayPrice || selectedVariant?.discountedPrice || prod.price || 0)}
//                     </span>
//                     {(selectedVariant?.originalPrice || prod.mrp) > (selectedVariant?.displayPrice || selectedVariant?.discountedPrice || prod.price || 0) && (
//                       <>
//                         <span className="original-price text-muted text-decoration-line-through ms-2 fs-6" style={{ fontSize: '14px' }}>
//                           {formatPrice(selectedVariant?.originalPrice || selectedVariant?.mrp || prod.mrp || 0)}
//                         </span>
//                         <span className="discount-percent text-danger fw-bold ms-2" style={{ fontSize: '12px' }}>
//                           ({Math.round(((selectedVariant?.originalPrice || selectedVariant?.mrp || prod.mrp || 0) - (selectedVariant?.displayPrice || selectedVariant?.discountedPrice || prod.price || 0)) / (selectedVariant?.originalPrice || selectedVariant?.mrp || prod.mrp || 1) * 100)}% OFF)
//                         </span>
//                       </>
//                     )}
//                   </div>
//                 </div>

//                 {/* Updated Add to Cart Button - Matches CategoryLandingPage Design */}
//                 <div className="mt-auto">
//                   <button
//                     className={`btn w-100 add-tocard-buttonss d-flex align-items-center justify-content-center gap-2 ${isAdding ? "" : "btn-outline-dark"
//                       }`}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       if (showSelectVariantButton) {
//                         openVariantOverlay(prod._id, "all", e);
//                       } else {
//                         handleAddToCart(prod);
//                       }
//                     }}
//                     disabled={disabled}
//                   >
//                     {isAdding ? (
//                       <>
//                         <span
//                           className="spinner-border spinner-border-sm me-2"
//                           role="status"
//                         />
//                         Adding...
//                       </>
//                     ) : (
//                       <>
//                         {btnText}
//                         {!disabled && !isAdding && !showSelectVariantButton && (
//                           <img src={Bag} alt="Bag" style={{ height: "20px" }} />
//                         )}
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Variant Overlay */}
//         {showVariantOverlay === prod._id && (
//           <div className="variant-overlay" onClick={closeVariantOverlay} style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             backgroundColor: 'rgba(0,0,0,0.5)',
//             zIndex: 9,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center'
//           }}>
//             <div
//               className="variant-overlay-content p-0"
//               onClick={(e) => e.stopPropagation()}
//               style={{
//                 width: '100%',
//                 maxWidth: '500px',
//                 height: '100%',
//                 background: '#fff',
//                 borderRadius: '0px',
//                 overflow: 'hidden',
//                 display: 'flex',
//                 flexDirection: 'column'
//               }}
//             >
//               <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
//                 <h5 className="m-0 page-title-main-name">Select Variant ({totalVariants})</h5>
//                 <button
//                   onClick={closeVariantOverlay}
//                   style={{
//                     background: 'none',
//                     border: 'none',
//                     fontSize: '24px',
//                     cursor: 'pointer'
//                   }}
//                 >
//                   ×
//                 </button>
//               </div>

//               <div className="variant-tabs d-flex">
//                 <button
//                   className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "all" ? "active" : ""}`}
//                   onClick={() => setSelectedVariantType("all")}
//                   style={{
//                     border: 'none',
//                     background: selectedVariantType === "all" ? '#000' : '#f5f5f5',
//                     color: selectedVariantType === "all" ? '#fff' : '#000',
//                     fontWeight: '500'
//                   }}
//                 >
//                   All ({totalVariants})
//                 </button>
//                 {grouped.color.length > 0 && (
//                   <button
//                     className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "color" ? "active" : ""}`}
//                     onClick={() => setSelectedVariantType("color")}
//                     style={{
//                       border: 'none',
//                       background: selectedVariantType === "color" ? '#000' : '#f5f5f5',
//                       color: selectedVariantType === "color" ? '#fff' : '#000',
//                       fontWeight: '500'
//                     }}
//                   >
//                     Colors ({grouped.color.length})
//                   </button>
//                 )}
//                 {grouped.text.length > 0 && (
//                   <button
//                     className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "text" ? "active" : ""}`}
//                     onClick={() => setSelectedVariantType("text")}
//                     style={{
//                       border: 'none',
//                       background: selectedVariantType === "text" ? '#000' : '#f5f5f5',
//                       color: selectedVariantType === "text" ? '#fff' : '#000',
//                       fontWeight: '500'
//                     }}
//                   >
//                     Sizes ({grouped.text.length})
//                   </button>
//                 )}
//               </div>

//               <div className="p-3 overflow-auto flex-grow-1" style={{ maxHeight: '400px' }}>
//                 {(selectedVariantType === "all" || selectedVariantType === "color") && grouped.color.length > 0 && (
//                   <div className="row row-col-4 g-3">
//                     {grouped.color.map((v) => {
//                       const isSelected = selectedVariant?.sku === v.sku || (selectedVariant?._id && selectedVariant._id === v._id);
//                       const isOutOfStock = (v.stock ?? 0) <= 0;

//                       return (
//                         <div className="col-lg-6 col-6 mt-2" key={getSku(v) || v._id}>
//                           <div
//                             className="text-center"
//                             style={{
//                               cursor: isOutOfStock ? "not-allowed" : "pointer",
//                             }}
//                             onClick={() =>
//                               !isOutOfStock &&
//                               (handleVariantSelect(prod._id, v),
//                                 closeVariantOverlay())
//                             }
//                           >
//                             <div className="page-title-main-name"
//                               style={{
//                                 width: "28px",
//                                 height: "28px",
//                                 borderRadius: "20%",
//                                 backgroundColor: v.hex || "#ccc",
//                                 margin: "0 auto 8px",
//                                 border: isSelected ? "2px solid #000" : "1px solid #ddd",
//                                 opacity: isOutOfStock ? 0.5 : 1,
//                                 position: "relative",
//                               }}
//                             >
//                               {isSelected && (
//                                 <span
//                                   style={{
//                                     position: "absolute",
//                                     top: "50%",
//                                     left: "50%",
//                                     transform: "translate(-50%, -50%)",
//                                     color: "#fff",
//                                     fontWeight: "bold",
//                                   }}
//                                 >
//                                   ✓
//                                 </span>
//                               )}
//                             </div>
//                             <div className="small page-title-main-name" style={{ fontSize: '12px' }}>
//                               {getVariantDisplayText(v)}
//                             </div>
//                             {isOutOfStock && (
//                               <div className="text-danger small">
//                                 Out of Stock
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}

//                 {(selectedVariantType === "all" || selectedVariantType === "text") && grouped.text.length > 0 && (
//                   <div className="row row-cols-3 g-0">
//                     {grouped.text.map((v) => {
//                       const isSelected = selectedVariant?.sku === v.sku || (selectedVariant?._id && selectedVariant._id === v._id);
//                       const isOutOfStock = (v.stock ?? 0) <= 0;

//                       return (
//                         <div className="col-lg-3 col-5" key={getSku(v) || v._id}>
//                           <div
//                             className="text-center"
//                             style={{
//                               cursor: isOutOfStock ? "not-allowed" : "pointer",
//                             }}
//                             onClick={() =>
//                               !isOutOfStock &&
//                               (handleVariantSelect(prod._id, v),
//                                 closeVariantOverlay())
//                             }
//                           >
//                             <div
//                               style={{
//                                 padding: "10px",
//                                 borderRadius: "8px",
//                                 border: isSelected ? "2px solid #000" : "1px solid #ddd",
//                                 background: isSelected ? "#f8f9fa" : "#fff",
//                                 minHeight: "50px",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 opacity: isOutOfStock ? 0.5 : 1,
//                               }}
//                             >
//                               {getVariantDisplayText(v)}
//                             </div>
//                             {isOutOfStock && (
//                               <div className="text-danger small mt-1">
//                                 Out of Stock
//                               </div>
//                             )}
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

//   // ==================== RENDER ====================
//   return (
//     <div className="search-page-container">
//       <ToastContainer position="top-right" autoClose={3000} />
//       <Header />

//       {/* <div className="search-main-wrapper"> */}
//       <div className="container-lg-fluid px-lg-5 px-3 pt-lg-5 mt-lg-5 mt-0 pt-0">
//         {/* Sticky Search Bar */}
//         <div className="search-header-sticky d-none">
//           <div className="search-input-container">
//             <FaSearch className="inner-search-icon" />
//             <input className="page-title-main-name"
//               type="text"
//               placeholder="Search products, brands, or categories..."
//               value={searchTerm}
//               onChange={handleInputChange}
//               autoFocus
//             />
//             {searchTerm && <FaTimes className="clear-icon" onClick={clearSearch} />}
//             {isSyncing && <FaSync className="spin sync-icon" title="Syncing Inventory..." />}
//           </div>
//           <div className="search-results-meta page-title-main-name">
//             {isLoading ? (
//               <span>Initializing catalog...</span>
//             ) : (
//               <p>
//                 Showing <b>{filteredProducts.length}</b> items
//                 {searchTerm && <> for "<b>{searchTerm}</b>"</>}
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Main Content with Sidebar */}
//         <div className="container-fluid py-4 pt-lg-4 mt-lg-5 mt-0 pt-0">
//           <div className="row">
//             {/* Desktop Sidebar Filter */}
//             <div className="d-none d-lg-block col-lg-3">
//               <BrandFilter {...brandFilterProps} />
//             </div>

//             {/* Mobile Filter Buttons */}
//             <div className="d-lg-none mb-3 col-12">
//               <div className="w-100 filter-responsive rounded shadow-sm">
//                 <div className="container-fluid p-0">
//                   <div className="row g-0" style={{ flexDirection: "row-reverse" }}>
//                     <div className="col-6">
//                       <button className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
//                         onClick={() => setShowFilterOffcanvas(true)} style={{ gap: 12 }}>
//                         <img src={filtering} alt="Filter" style={{ width: 25 }} />
//                         <div className="text-start">
//                           <p className="mb-0 fs-6 fw-semibold page-title-main-name">Filter</p>
//                           <span className="text-muted small page-title-main-name">Tap to apply</span>
//                         </div>
//                       </button>
//                     </div>
//                     <div className="col-6 border-end">
//                       <button className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
//                         onClick={() => setShowSortOffcanvas(true)} style={{ gap: 12 }}>
//                         <img src={updownarrow} alt="Sort" style={{ width: 25 }} />
//                         <div className="text-start">
//                           <p className="mb-0 fs-6 fw-semibold page-title-main-name">Sort by</p>
//                           <span className="text-muted small">
//                             {filters.sort === "recent" ? "Relevance" :
//                               filters.sort === "priceHighToLow" ? "Price High to Low" : "Price Low to High"}
//                           </span>
//                         </div>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Mobile Filter Offcanvas */}
//             {showFilterOffcanvas && (
//               <>
//                 <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
//                   style={{ opacity: 0.5, zIndex: 1040 }} onClick={() => setShowFilterOffcanvas(false)} />
//                 <div className="position-fixed start-0 bottom-0 w-100 bg-white"
//                   style={{ zIndex: 1050, borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: "85vh", boxShadow: "0 -4px 20px rgba(0,0,0,.2)" }}>
//                   <div className="text-center py-3 position-relative">
//                     <h5 className="mb-0 fw-bold">Filters</h5>
//                     <button className="btn-close position-absolute end-0 me-3"
//                       style={{ top: "50%", transform: "translateY(-50%)" }}
//                       onClick={() => setShowFilterOffcanvas(false)} />
//                     <div className="mx-auto mt-2 bg-secondary" style={{ height: 5, width: 50, borderRadius: 3 }} />
//                   </div>
//                   <div className="px-3 pb-4 overflow-auto" style={{ maxHeight: "70vh" }}>
//                     <BrandFilter
//                       {...brandFilterProps}
//                       onClose={() => setShowFilterOffcanvas(false)}
//                     />
//                   </div>
//                 </div>
//               </>
//             )}

//             {/* Mobile Sort Offcanvas */}
//             {showSortOffcanvas && (
//               <>
//                 <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
//                   style={{ opacity: 0.5, zIndex: 1040 }} onClick={() => setShowSortOffcanvas(false)} />
//                 <div className="position-fixed start-0 bottom-0 w-100 bg-white"
//                   style={{ zIndex: 1050, borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: "60vh", boxShadow: "0 -4px 12px rgba(0,0,0,.15)" }}>
//                   <div className="text-center py-3 position-relative">
//                     <h5 className="mb-0 fw-bold page-title-main-name">Sort by</h5>
//                     <button className="btn-close position-absolute end-0 me-3"
//                       style={{ top: "50%", transform: "translateY(-50%)" }}
//                       onClick={() => setShowSortOffcanvas(false)} />
//                     <div className="mx-auto mt-2 bg-secondary" style={{ height: 5, width: 50, borderRadius: 3 }} />
//                   </div>
//                   <div className="px-4 pb-4">
//                     <div className="list-group">
//                       {[
//                         { value: "recent", label: "Relevance" },
//                         { value: "priceHighToLow", label: "Price High to Low" },
//                         { value: "priceLowToHigh", label: "Price Low to High" },
//                       ].map(({ value, label }) => (
//                         <label key={value} className="list-group-item py-3 d-flex align-items-center">
//                           <input className="form-check-input me-3" type="radio" name="sort"
//                             checked={filters.sort === value}
//                             onChange={() => {
//                               setFilters(prev => ({ ...prev, sort: value }));
//                               setShowSortOffcanvas(false);
//                             }} />
//                           <span className="page-title-main-name">{label}</span>
//                         </label>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </>
//             )}

//             {/* Results Grid */}
//             <div className="col-12 col-lg-9">
//               <div className="mb-3 d-flex justify-content-between align-items-center">
//                 <span className="text-muted page-title-main-name">
//                   {filteredProducts.length > 0 ? `Showing ${filteredProducts.length} products` : "No products found"}
//                 </span>
//                 {isAnyFilterActive && (
//                   <button className="btn btn-sm btn-outline-danger" onClick={handleClearAllFilters}>
//                     Clear Filters
//                   </button>
//                 )}
//               </div>

//               {isLoading && allProducts.length === 0 ? (
//                 <div className="loading-state text-center py-5">
//                   <FaSpinner className="spin large-spinner" />
//                   if (loading)
//                   return (
//                   <div
//                     className="fullscreen-loader page-title-main-name"
//                     style={{
//                       minHeight: "100vh",
//                       width: "100%",
//                     }}
//                   >
//                     <div className="text-center">
//                       <DotLottieReact className='foryoulanding-css'
//                         src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
//                         loop
//                         autoplay
//                       />
//                       <p className="text-muted mb-0">
//                         Please wait while we prepare the best products for you...
//                       </p>
//                     </div>
//                   </div>
//                   );
//                 </div>
//               ) : error ? (
//                 <div className="error-box text-center py-5">
//                   <FaRegSadTear size={40} />
//                   <p>{error}</p>
//                   <button onClick={() => window.location.reload()}>Retry</button>
//                 </div>
//               ) : filteredProducts.length === 0 ? (
//                 <div className="no-results text-center py-5">
//                   <FaSearch size={64} className="text-muted mb-3" />
//                   <h3>No matches found</h3>
//                   <p className="text-muted">Try different keywords or adjust your filters.</p>
//                   {(searchTerm || isAnyFilterActive) && (
//                     <button className="btn btn-dark mt-3" onClick={() => {
//                       clearSearch();
//                       handleClearAllFilters();
//                     }}>
//                       Clear All
//                     </button>
//                   )}
//                 </div>
//               ) : (
//                 <div className="row g-4">
//                   {filteredProducts.map(renderProductCard)}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default SearchPage;




















import React, { useState, useEffect, useMemo, useRef, useCallback, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSearch, FaRegSadTear, FaSpinner, FaSync, FaTimes, FaHeart, FaRegHeart, FaChevronDown } from "react-icons/fa";
import Header from "./Header";
import Footer from "./Footer";
import axiosInstance from "../utils/axiosInstance.js";
import { CartContext } from "../context/CartContext";
import { UserContext } from "./UserContext.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/SearchPage.css";
import Bag from "../assets/Bag.svg";
import updownarrow from "../assets/updownarrow.svg";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import filtering from "../assets/filtering.svg";
import BrandFilter from "./BrandFilter";

const CART_API_BASE = "/api/user/cart";
const WISHLIST_CACHE_KEY = "guestWishlist";
const PRODUCT_ALL_API = "https://beauty.joyory.com/api/user/products/all";

// ==================== HELPER FUNCTIONS ====================
const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || 'default'}`;

const isValidHexColor = (hex) => {
  if (!hex || typeof hex !== "string") return false;
  const normalized = hex.trim().toLowerCase();
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(normalized);
};

const getVariantDisplayText = (variant) => {
  return (
    variant.shadeName ||
    variant.name ||
    variant.size ||
    variant.ml ||
    variant.weight ||
    "Default"
  ).toUpperCase();
};

const groupVariantsByType = (variants) => {
  const grouped = { color: [], text: [] };
  variants.forEach((v) => {
    if (!v) return;
    if (v.hex && isValidHexColor(v.hex)) {
      grouped.color.push(v);
    } else {
      grouped.text.push(v);
    }
  });
  return grouped;
};

const getBrandName = (product) => {
  if (!product?.brand) return "Unknown Brand";
  if (typeof product.brand === "object" && product.brand.name) return product.brand.name;
  if (typeof product.brand === "string") return product.brand;
  return "Unknown Brand";
};

const getVariantName = (variant) => {
  if (!variant) return "Default";
  const nameSources = [
    variant.shadeName,
    variant.name,
    variant.variantName,
    variant.size,
    variant.ml,
    variant.weight
  ];
  for (const source of nameSources) {
    if (source && typeof source === 'string') {
      return source;
    }
  }
  return "Default";
};

const getVariantType = (variant) => {
  if (!variant) return 'default';
  if (variant.hex && isValidHexColor(variant.hex)) return 'color';
  if (variant.shadeName) return 'shade';
  if (variant.size) return 'size';
  if (variant.ml) return 'ml';
  if (variant.weight) return 'weight';
  return 'default';
};

// ==================== MAIN COMPONENT ====================
const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(UserContext);

  // URL Syncing
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);




  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // ==================== FILTER STATES ====================
  const [filterData, setFilterData] = useState(null);
  const [trendingCategories, setTrendingCategories] = useState([]);
  const [showFilterOffcanvas, setShowFilterOffcanvas] = useState(false);
  const [showSortOffcanvas, setShowSortOffcanvas] = useState(false);

  const [filters, setFilters] = useState({
    brandIds: [],
    categoryIds: [],
    skinTypes: [],
    formulations: [],
    finishes: [],
    ingredients: [],
    priceRange: null,
    discountMin: null,
    minRating: "",
    sort: "recent",
  });



  const fetchMoreProducts = useCallback(async () => {
    if (isFetchingMore || !hasMore) return;

    try {
      setIsFetchingMore(true);

      const response = await axiosInstance.get(PRODUCT_ALL_API, {
        params: { cursor },
        withCredentials: true
      });

      let products = [];
      let pagination = {};

      if (response.data && Array.isArray(response.data.products)) {
        products = response.data.products;
        pagination = response.data.pagination || {};
      }

      if (products.length > 0) {
        setAllProducts(prev => [...prev, ...products]);
      }

      if (pagination.hasMore) {
        setCursor(pagination.nextCursor);
      } else {
        setHasMore(false);
      }

    } catch (err) {
      console.error("Infinite scroll error:", err);
    } finally {
      setIsFetchingMore(false);
    }
  }, [cursor, isFetchingMore, hasMore]);


  // ==================== WISHLIST STATES ====================
  const [wishlistLoading, setWishlistLoading] = useState({});
  const [wishlistData, setWishlistData] = useState([]);

  // ==================== VARIANT STATES ====================
  const [selectedVariants, setSelectedVariants] = useState({});
  const [addingToCart, setAddingToCart] = useState({});
  const [showVariantOverlay, setShowVariantOverlay] = useState(null);
  const [selectedVariantType, setSelectedVariantType] = useState("all");

  // Toast Utility
  const showToastMsg = (message, type = "error", duration = 3000) => {
    if (type === "success") {
      toast.success(message, { autoClose: duration });
    } else if (type === "error") {
      toast.error(message, { autoClose: duration });
    } else {
      toast.info(message, { autoClose: duration });
    }
  };

  // ==================== WISHLIST FUNCTIONS - FULLY UPDATED ====================

  // 🔥 FIXED: Proper string comparison for IDs
  const isInWishlist = useCallback((productId, sku) => {
    if (!productId || !sku) return false;

    // Normalize to strings for comparison
    const normalizedProductId = String(productId);
    const normalizedSku = String(sku);

    return wishlistData.some(item => {
      const itemProductId = String(item.productId || item._id);
      const itemSku = String(item.sku);
      return itemProductId === normalizedProductId && itemSku === normalizedSku;
    });
  }, [wishlistData]);

  // 🔥 FIXED: Fetch with proper error handling and credentials
  const fetchWishlistData = useCallback(async () => {
    try {
      if (user && !user.guest) {
        const response = await axiosInstance.get("/api/user/wishlist", {
          withCredentials: true // Ensure cookies are sent
        });
        if (response.data.success) {
          setWishlistData(response.data.wishlist || []);
        }
      } else {
        const localWishlist = JSON.parse(localStorage.getItem(WISHLIST_CACHE_KEY)) || [];
        // Normalize local data to match API format
        const formattedWishlist = localWishlist.map(item => ({
          productId: String(item._id || item.productId),
          _id: String(item._id),
          sku: String(item.sku),
          name: item.name,
          variant: item.variantName || item.variant,
          image: item.image,
          displayPrice: item.displayPrice,
          originalPrice: item.originalPrice,
          discountPercent: item.discountPercent,
          status: item.status,
          avgRating: item.avgRating,
          totalRatings: item.totalRatings
        }));
        setWishlistData(formattedWishlist);
      }
    } catch (error) {
      console.error("Error fetching wishlist data:", error);
      setWishlistData([]);
    }
  }, [user]);

  // 🔥 FIXED: Toggle with proper string normalization and storage sync
  const toggleWishlist = useCallback(async (prod, variant) => {
    if (!user || user.guest) {
      showToastMsg("Please login to use wishlist", "error");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    // Handle case when no variant is passed (for products without variants)
    if (!prod) {
      showToastMsg("Product not found", "error");
      return;
    }

    // Get effective variant (passed variant, selected variant, or first available)
    const effectiveVariant = variant && Object.keys(variant).length > 0
      ? variant
      : selectedVariants[prod._id]
        ? selectedVariants[prod._id]
        : (prod.variants?.[0] || {});

    if (!effectiveVariant || Object.keys(effectiveVariant).length === 0) {
      showToastMsg("Please select a variant first", "error");
      return;
    }

    const productId = String(prod._id);
    const sku = String(getSku(effectiveVariant));

    setWishlistLoading(prev => ({ ...prev, [productId]: true }));

    try {
      const currentlyInWishlist = isInWishlist(productId, sku);

      if (user && !user.guest) {
        // API call for logged-in users with credentials
        if (currentlyInWishlist) {
          await axiosInstance.delete(`/api/user/wishlist/${productId}`, {
            data: { sku: sku },
            withCredentials: true // 🔥 FIXED: Added credentials
          });
          showToastMsg("Removed from wishlist!", "success");
        } else {
          await axiosInstance.post(`/api/user/wishlist/${productId}`,
            { sku: sku },
            { withCredentials: true } // 🔥 FIXED: Added credentials
          );
          showToastMsg("Added to wishlist!", "success");
        }
        // Re-fetch to sync with server
        await fetchWishlistData();
      } else {
        // LocalStorage for guests
        let guestWishlist = JSON.parse(localStorage.getItem(WISHLIST_CACHE_KEY)) || [];

        if (currentlyInWishlist) {
          // Remove from wishlist
          guestWishlist = guestWishlist.filter(item =>
            !(String(item._id) === productId && String(item.sku) === sku)
          );
          localStorage.setItem(WISHLIST_CACHE_KEY, JSON.stringify(guestWishlist));
          showToastMsg("Removed from wishlist!", "success");
        } else {
          // Add to wishlist with normalized data
          const productData = {
            _id: productId,
            productId: productId,
            name: prod.name,
            brand: getBrandName(prod),
            price: effectiveVariant.discountedPrice || effectiveVariant.displayPrice || prod.price || 0,
            originalPrice: effectiveVariant.originalPrice || effectiveVariant.mrp || prod.mrp || prod.price || 0,
            mrp: effectiveVariant.originalPrice || effectiveVariant.mrp || prod.mrp || prod.price || 0,
            displayPrice: effectiveVariant.discountedPrice || effectiveVariant.displayPrice || prod.price || 0,
            images: effectiveVariant.images || prod.images || ["/placeholder.png"],
            image: effectiveVariant.images?.[0] || effectiveVariant.image || prod.images?.[0] || "/placeholder.png",
            slug: prod.slugs?.[0] || prod.slug || productId,
            sku: sku,
            variantSku: sku,
            variantId: sku,
            variantName: effectiveVariant.shadeName || effectiveVariant.name || "Default",
            shadeName: effectiveVariant.shadeName || effectiveVariant.name || "Default",
            variant: effectiveVariant.shadeName || effectiveVariant.name || "Default",
            hex: effectiveVariant.hex || "#cccccc",
            stock: effectiveVariant.stock || 0,
            status: effectiveVariant.stock > 0 ? "inStock" : "outOfStock",
            avgRating: prod.avgRating || 0,
            totalRatings: prod.totalRatings || 0,
            commentsCount: prod.totalRatings || 0,
            discountPercent: (effectiveVariant.originalPrice && effectiveVariant.discountedPrice && effectiveVariant.originalPrice > effectiveVariant.discountedPrice)
              ? Math.round(((effectiveVariant.originalPrice - effectiveVariant.discountedPrice) / effectiveVariant.originalPrice) * 100)
              : 0
          };
          guestWishlist.push(productData);
          localStorage.setItem(WISHLIST_CACHE_KEY, JSON.stringify(guestWishlist));
          showToastMsg("Added to wishlist!", "success");
        }

        // 🔥 FIXED: Dispatch storage event for cross-tab sync
        window.dispatchEvent(new StorageEvent('storage', { key: WISHLIST_CACHE_KEY }));

        // Update local state immediately
        await fetchWishlistData();
      }
    } catch (error) {
      console.error("Wishlist toggle error:", error);
      if (error.response?.status === 401) {
        showToastMsg("Please login to use wishlist", "error");
        navigate("/login");
      } else {
        showToastMsg(error.response?.data?.message || "Failed to update wishlist", "error");
      }
    } finally {
      setWishlistLoading(prev => ({ ...prev, [productId]: false }));
    }
  }, [user, isInWishlist, fetchWishlistData, selectedVariants, navigate]);

  // 🔥 FIXED: Listen for storage changes (cross-tab sync)
  useEffect(() => {
    fetchWishlistData();
  }, [fetchWishlistData]);

  // 🔥 FIXED: Storage event listener for multi-tab sync
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === WISHLIST_CACHE_KEY) {
        fetchWishlistData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [fetchWishlistData]);



  useEffect(() => {
    const handleScroll = () => {
      const isBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 150;

      if (isBottom) {
        fetchMoreProducts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchMoreProducts]);

  // ==================== DATA FETCHING WITH FILTERS ====================
  useEffect(() => {
    if (hasFetched.current) return;

    const fetchEverySingleProduct = async () => {
      try {
        setIsLoading(true);
        setIsSyncing(true);

        let currentCursor = null;
        let hasMore = true;
        const productMap = new Map();

        while (hasMore) {
          const response = await axiosInstance.get(PRODUCT_ALL_API, {
            params: { cursor: currentCursor },
            withCredentials: true
          });

          let products = [];
          let pagination = {};
          if (Array.isArray(response.data)) {
            products = response.data;
          } else if (response.data && Array.isArray(response.data.products)) {
            products = response.data.products;
            pagination = response.data.pagination || {};
          }

          if (response.data.filters && !filterData) {
            setFilterData(response.data.filters);
          }
          if (response.data.trendingCategories && trendingCategories.length === 0) {
            setTrendingCategories(response.data.trendingCategories);
          }

          if (products.length > 0) {
            products.forEach(p => productMap.set(p._id, p));
            setAllProducts(Array.from(productMap.values()));
          }

          if (pagination.hasMore === false) {
            hasMore = false;
          } else if (pagination.nextCursor) {
            currentCursor = pagination.nextCursor;
            setCursor(pagination.nextCursor); // 🔥 ADD THIS
          } else {
            setHasMore(false); // 🔥 ADD THIS
          }
        }

        hasFetched.current = true;
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("We couldn't load the inventory. Please try again.");
      } finally {
        setIsLoading(false);
        setIsSyncing(false);
      }
    };

    fetchEverySingleProduct();
  }, []);

  // ==================== CLIENT-SIDE SEARCH & FILTER ====================
  const filteredProducts = useMemo(() => {
    let result = allProducts;

    const cleanTerm = searchTerm.toLowerCase().trim();
    if (cleanTerm) {
      const searchWords = cleanTerm.split(/\s+/);
      result = result.filter((p) => {
        const productName = (p.name || "").toLowerCase();
        const brandName = (getBrandName(p) || "").toLowerCase();
        const categoryName = (p.category?.name || "").toLowerCase();
        const variantsText = p.variants?.map(v => (v.shadeName || v.name || "").toLowerCase()).join(" ") || "";
        const searchable = `${productName} ${brandName} ${categoryName} ${variantsText}`;
        return searchWords.every(word => searchable.includes(word));
      });
    }

    if (filters.brandIds.length > 0) {
      result = result.filter(p => {
        const brandId = typeof p.brand === 'object' ? p.brand?._id : p.brand;
        return filters.brandIds.includes(brandId);
      });
    }

    if (filters.categoryIds.length > 0) {
      result = result.filter(p => {
        const catId = typeof p.category === 'object' ? p.category?._id : p.category;
        return filters.categoryIds.includes(catId);
      });
    }

    if (filters.skinTypes.length > 0) {
      result = result.filter(p =>
        filters.skinTypes.some(st => p.skinTypes?.includes(st))
      );
    }

    if (filters.ingredients.length > 0) {
      result = result.filter(p =>
        filters.ingredients.some(ing => p.ingredients?.includes(ing))
      );
    }

    if (filters.priceRange) {
      result = result.filter(p => {
        const price = p.price || 0;
        const min = filters.priceRange.min || 0;
        const max = filters.priceRange.max;
        return price >= min && (max == null || price <= max);
      });
    }

    if (filters.discountMin) {
      result = result.filter(p => {
        const discount = p.discountPercent || 0;
        return discount >= filters.discountMin;
      });
    }

    if (filters.minRating) {
      result = result.filter(p => (p.avgRating || 0) >= parseFloat(filters.minRating));
    }

    if (filters.sort === "priceHighToLow") {
      result = [...result].sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (filters.sort === "priceLowToHigh") {
      result = [...result].sort((a, b) => (a.price || 0) - (b.price || 0));
    }

    return result;
  }, [searchTerm, allProducts, filters]);

  // ==================== HANDLERS ====================
  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);

    const params = new URLSearchParams(window.location.search);
    if (val) params.set("q", val);
    else params.delete("q");
    navigate({ search: params.toString() }, { replace: true });
  };

  const clearSearch = () => {
    setSearchTerm("");
    navigate("/search", { replace: true });
  };

  const handleVariantSelect = useCallback((productId, variant) => {
    if (!productId || !variant) return;

    setSelectedVariants(prev => ({
      ...prev,
      [productId]: variant
    }));
  }, []);

  const openVariantOverlay = (productId, type = "all", e) => {
    if (e) e.stopPropagation();
    setSelectedVariantType(type);
    setShowVariantOverlay(productId);
  };

  const closeVariantOverlay = () => {
    setShowVariantOverlay(null);
    setSelectedVariantType("all");
  };

  const getProductSlug = (product) => {
    return product.slugs?.[0] || product.slug || product._id;
  };

  // ==================== ADD TO CART ====================
  const handleAddToCart = async (prod) => {
    setAddingToCart(prev => ({ ...prev, [prod._id]: true }));
    try {
      const variants = Array.isArray(prod.variants) ? prod.variants : [];
      const hasVariants = variants.length > 0;
      let payload;

      if (hasVariants) {
        const selectedVariant = selectedVariants[prod._id];
        if (!selectedVariant) {
          showToastMsg("Please select a variant.", "error");
          return;
        }
        if (selectedVariant.stock <= 0) {
          showToastMsg("Selected variant is out of stock.", "error");
          return;
        }
        payload = {
          productId: prod._id,
          variants: [{ variantSku: getSku(selectedVariant), quantity: 1 }],
        };
        const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
        cache[prod._id] = selectedVariant;
        localStorage.setItem("cartVariantCache", JSON.stringify(cache));
      } else {
        if (prod.stock <= 0) {
          showToastMsg("Product is out of stock.", "error");
          return;
        }
        payload = { productId: prod._id, quantity: 1 };
        const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
        delete cache[prod._id];
        localStorage.setItem("cartVariantCache", JSON.stringify(cache));
      }

      const response = await axiosInstance.post(`${CART_API_BASE}/add`, payload);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to add to cart");
      }

      showToastMsg("Product added to cart!", "success");
      navigate("/cartpage");
    } catch (err) {
      console.error("Add to Cart error:", err);
      showToastMsg(err.response?.data?.message || "Failed to add to cart", "error");
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setAddingToCart(prev => ({ ...prev, [prod._id]: false }));
    }
  };

  const formatPrice = useCallback((price) => {
    const numPrice = parseFloat(price || 0);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(numPrice);
  }, []);

  // ==================== FILTER HELPERS ====================
  const isAnyFilterActive = useMemo(() => {
    return filters.brandIds.length > 0 ||
      filters.categoryIds.length > 0 ||
      filters.skinTypes.length > 0 ||
      filters.formulations.length > 0 ||
      filters.finishes.length > 0 ||
      filters.ingredients.length > 0 ||
      filters.priceRange ||
      filters.discountMin ||
      filters.minRating ||
      filters.sort !== "recent";
  }, [filters]);

  const handleClearAllFilters = useCallback(() => {
    setFilters({
      brandIds: [],
      categoryIds: [],
      skinTypes: [],
      formulations: [],
      finishes: [],
      ingredients: [],
      priceRange: null,
      discountMin: null,
      minRating: "",
      sort: "recent",
    });
  }, []);

  const brandFilterProps = {
    filters,
    setFilters,
    filterData,
    trendingCategories,
    activeCategorySlug: null,
    activeCategoryName: "",
    onClearCategory: handleClearAllFilters,
    onCategoryPillClick: () => { },
  };

  // ==================== PRODUCT CARD ====================
  const renderProductCard = (prod) => {
    const variants = Array.isArray(prod.variants) ? prod.variants : [];
    const hasVariants = variants.length > 0;
    const selectedVariant = selectedVariants[prod._id];
    const grouped = groupVariantsByType(variants);
    const totalVariants = variants.length;

    // 🔥 FIXED: Get effective variant for wishlist check
    const effectiveVariant = selectedVariant || (hasVariants ? variants[0] : {});
    const selectedSku = effectiveVariant ? getSku(effectiveVariant) : null;
    const isProductInWishlist = selectedSku ? isInWishlist(prod._id, selectedSku) : false;
    const productSlug = getProductSlug(prod);

    let imageUrl = "https://placehold.co/400x300/ffffff/cccccc?text=Product";
    const getVariantImage = (variant) => variant?.images?.[0] || variant?.image;

    imageUrl = getVariantImage(selectedVariant) ||
      getVariantImage(variants.find(v => v.stock > 0)) ||
      getVariantImage(variants[0]) ||
      prod.images?.[0] ||
      "";

    if (!imageUrl) {
      imageUrl = "https://placehold.co/400x300/ffffff/cccccc?text=Product";
    } else if (!imageUrl.startsWith("http")) {
      imageUrl = `https://res.cloudinary.com/dekngswix/image/upload/${imageUrl}`;
    }

    const isVariantSelected = !!selectedVariants[prod._id];
    const isAdding = addingToCart[prod._id];
    const outOfStock = hasVariants
      ? (selectedVariant?.stock <= 0)
      : (prod.stock <= 0);

    const showSelectVariantButton = hasVariants && !isVariantSelected;

    // Updated button styling to match CategoryLandingPage
    const disabled = isAdding || (!showSelectVariantButton && outOfStock);

    let btnText = "Add to Cart";
    if (isAdding) btnText = "Adding...";
    else if (showSelectVariantButton) btnText = "Select Variant";
    else if (outOfStock) btnText = "Out of Stock";

    return (
      <div key={prod._id} className="col-6 col-sm-4 col-lg-4 mb-4 position-relative">
        <div className="foryou-card-wrapper h-100">
          <div className="foryou-card h-100">
            <div
              className="foryou-img-wrapper"
              onClick={() => navigate(`/product/${productSlug}`)}
              style={{ cursor: 'pointer', position: 'relative' }}
            >
              <img
                src={imageUrl}
                alt={prod.name || "Product"}
                className="foryou-img img-fluid"
                loading="lazy"
                style={{ height: '200px', objectFit: 'contain' }}
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/400x300/ffffff/cccccc?text=Product";
                }}
              />

              {/* 🔥 FIXED: Wishlist button with proper variant handling */}
              <button className="bg-transparent"
                onClick={(e) => {
                  e.stopPropagation();
                  // Pass effective variant to toggle
                  toggleWishlist(prod, effectiveVariant);
                }}
                disabled={wishlistLoading[prod._id]}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  cursor: wishlistLoading[prod._id] ? 'not-allowed' : 'pointer',
                  color: isProductInWishlist ? '#dc3545' : '#ccc',
                  fontSize: '22px',
                  zIndex: 2,
                  // backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '50%',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  // boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  border: 'none',
                  outline: 'none'
                }}
                title={isProductInWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                {wishlistLoading[prod._id] ? (
                  <div className="spinner-border spinner-border-sm" role="status"></div>
                ) : isProductInWishlist ? (
                  <FaHeart />
                ) : (
                  <FaRegHeart />
                )}
              </button>

              {selectedVariant?.promoApplied && (
                <div className="promo-badge" style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  background: '#ff6b6b',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  Promo
                </div>
              )}
            </div>

            <div className="foryou-product-info w-100 ps-lg-0 p-0 pt-md-0 justify-content-end">
              <div className="justify-content-between d-flex flex-column" style={{ height: 'auto', minHeight: '225px' }}>

                <div className="brand-name small text-muted mb-1 mt-2 text-start">
                  {getBrandName(prod)}
                </div>

                <h6
                  className="foryou-name font-family-Poppins m-0 p-0"
                  onClick={() => navigate(`/product/${productSlug}`)}
                  style={{ cursor: 'pointer', fontSize: '14px', lineHeight: '1.4' }}
                >
                  {prod.name || "Unnamed Product"}
                </h6>

                {hasVariants && (
                  <div className="variant-section m-0 p-0 ms-0 mt-2 mb-2">
                    {isVariantSelected ? (
                      <div
                        className="selected-variant-display text-muted small"
                        style={{ cursor: 'pointer', display: 'inline-block' }}
                        onClick={(e) => openVariantOverlay(prod._id, "all", e)}
                        title="Click to change variant"
                      >
                        Variant: <span className="fw-bold text-dark">{getVariantDisplayText(selectedVariant)}</span>
                        <FaChevronDown className="ms-1" style={{ fontSize: '10px' }} />
                      </div>
                    ) : (
                      <div className="small text-muted" style={{ height: '20px' }}>
                        {totalVariants} Variants Available
                      </div>
                    )}
                  </div>
                )}

                <div className="price-section mb-3">
                  <div className="d-flex align-items-baseline flex-wrap">
                    <span className="current-price fw-400 fs-5" style={{ fontSize: '16px' }}>
                      {formatPrice(selectedVariant?.displayPrice || selectedVariant?.discountedPrice || prod.price || 0)}
                    </span>
                    {(selectedVariant?.originalPrice || prod.mrp) > (selectedVariant?.displayPrice || selectedVariant?.discountedPrice || prod.price || 0) && (
                      <>
                        <span className="original-price text-muted text-decoration-line-through ms-2 fs-6" style={{ fontSize: '14px' }}>
                          {formatPrice(selectedVariant?.originalPrice || selectedVariant?.mrp || prod.mrp || 0)}
                        </span>
                        <span className="discount-percent text-danger fw-bold ms-2" style={{ fontSize: '12px' }}>
                          ({Math.round(((selectedVariant?.originalPrice || selectedVariant?.mrp || prod.mrp || 0) - (selectedVariant?.displayPrice || selectedVariant?.discountedPrice || prod.price || 0)) / (selectedVariant?.originalPrice || selectedVariant?.mrp || prod.mrp || 1) * 100)}% OFF)
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Updated Add to Cart Button - Matches CategoryLandingPage Design */}
                <div className="mt-auto">
                  <button
                    className={`btn w-100 add-tocard-buttonss d-flex align-items-center justify-content-center gap-2 ${isAdding ? "" : "btn-outline-dark"
                      }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (showSelectVariantButton) {
                        openVariantOverlay(prod._id, "all", e);
                      } else {
                        handleAddToCart(prod);
                      }
                    }}
                    disabled={disabled}
                  >
                    {isAdding ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        />
                        Adding...
                      </>
                    ) : (
                      <>
                        {btnText}
                        {!disabled && !isAdding && !showSelectVariantButton && (
                          <img src={Bag} alt="Bag" style={{ height: "20px" }} />
                        )}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Variant Overlay */}
        {showVariantOverlay === prod._id && (
          <div className="variant-overlay" onClick={closeVariantOverlay} style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 9,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div
              className="variant-overlay-content p-0"
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '500px',
                height: '100%',
                background: '#fff',
                borderRadius: '0px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
                <h5 className="m-0 page-title-main-name">Select Variant ({totalVariants})</h5>
                <button
                  onClick={closeVariantOverlay}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
              </div>

              <div className="variant-tabs d-flex">
                <button
                  className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "all" ? "active" : ""}`}
                  onClick={() => setSelectedVariantType("all")}
                  style={{
                    border: 'none',
                    background: selectedVariantType === "all" ? '#000' : '#f5f5f5',
                    color: selectedVariantType === "all" ? '#fff' : '#000',
                    fontWeight: '500'
                  }}
                >
                  All ({totalVariants})
                </button>
                {grouped.color.length > 0 && (
                  <button
                    className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "color" ? "active" : ""}`}
                    onClick={() => setSelectedVariantType("color")}
                    style={{
                      border: 'none',
                      background: selectedVariantType === "color" ? '#000' : '#f5f5f5',
                      color: selectedVariantType === "color" ? '#fff' : '#000',
                      fontWeight: '500'
                    }}
                  >
                    Colors ({grouped.color.length})
                  </button>
                )}
                {grouped.text.length > 0 && (
                  <button
                    className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "text" ? "active" : ""}`}
                    onClick={() => setSelectedVariantType("text")}
                    style={{
                      border: 'none',
                      background: selectedVariantType === "text" ? '#000' : '#f5f5f5',
                      color: selectedVariantType === "text" ? '#fff' : '#000',
                      fontWeight: '500'
                    }}
                  >
                    Sizes ({grouped.text.length})
                  </button>
                )}
              </div>

              <div className="p-3 overflow-auto flex-grow-1" style={{ maxHeight: '400px' }}>
                {(selectedVariantType === "all" || selectedVariantType === "color") && grouped.color.length > 0 && (
                  <div className="row row-col-4 g-3">
                    {grouped.color.map((v) => {
                      const isSelected = selectedVariant?.sku === v.sku || (selectedVariant?._id && selectedVariant._id === v._id);
                      const isOutOfStock = (v.stock ?? 0) <= 0;

                      return (
                        <div className="col-lg-6 col-6 mt-2" key={getSku(v) || v._id}>
                          <div
                            className="text-center"
                            style={{
                              cursor: isOutOfStock ? "not-allowed" : "pointer",
                            }}
                            onClick={() =>
                              !isOutOfStock &&
                              (handleVariantSelect(prod._id, v),
                                closeVariantOverlay())
                            }
                          >
                            <div className="page-title-main-name"
                              style={{
                                width: "28px",
                                height: "28px",
                                borderRadius: "20%",
                                backgroundColor: v.hex || "#ccc",
                                margin: "0 auto 8px",
                                border: isSelected ? "2px solid #000" : "1px solid #ddd",
                                opacity: isOutOfStock ? 0.5 : 1,
                                position: "relative",
                              }}
                            >
                              {isSelected && (
                                <span
                                  style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    color: "#fff",
                                    fontWeight: "bold",
                                  }}
                                >
                                  ✓
                                </span>
                              )}
                            </div>
                            <div className="small page-title-main-name" style={{ fontSize: '12px' }}>
                              {getVariantDisplayText(v)}
                            </div>
                            {isOutOfStock && (
                              <div className="text-danger small">
                                Out of Stock
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {(selectedVariantType === "all" || selectedVariantType === "text") && grouped.text.length > 0 && (
                  <div className="row row-cols-3 g-0">
                    {grouped.text.map((v) => {
                      const isSelected = selectedVariant?.sku === v.sku || (selectedVariant?._id && selectedVariant._id === v._id);
                      const isOutOfStock = (v.stock ?? 0) <= 0;

                      return (
                        <div className="col-lg-3 col-5" key={getSku(v) || v._id}>
                          <div
                            className="text-center"
                            style={{
                              cursor: isOutOfStock ? "not-allowed" : "pointer",
                            }}
                            onClick={() =>
                              !isOutOfStock &&
                              (handleVariantSelect(prod._id, v),
                                closeVariantOverlay())
                            }
                          >
                            <div
                              style={{
                                padding: "10px",
                                borderRadius: "8px",
                                border: isSelected ? "2px solid #000" : "1px solid #ddd",
                                background: isSelected ? "#f8f9fa" : "#fff",
                                minHeight: "50px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                opacity: isOutOfStock ? 0.5 : 1,
                              }}
                            >
                              {getVariantDisplayText(v)}
                            </div>
                            {isOutOfStock && (
                              <div className="text-danger small mt-1">
                                Out of Stock
                              </div>
                            )}
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

  // ==================== RENDER ====================
  return (
    <div className="search-page-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <Header />

      {/* <div className="search-main-wrapper"> */}
      <div className="container-lg-fluid px-lg-5 px-3 pt-lg-5 mt-lg-5 mt-0 pt-0">
        {/* Sticky Search Bar */}
        <div className="search-header-sticky d-none">
          <div className="search-input-container">
            <FaSearch className="inner-search-icon" />
            <input className="page-title-main-name"
              type="text"
              placeholder="Search products, brands, or categories..."
              value={searchTerm}
              onChange={handleInputChange}
              autoFocus
            />
            {searchTerm && <FaTimes className="clear-icon" onClick={clearSearch} />}
            {isSyncing && <FaSync className="spin sync-icon" title="Syncing Inventory..." />}
          </div>
          <div className="search-results-meta page-title-main-name">
            {isLoading ? (
              <span>Initializing catalog...</span>
            ) : (
              <p>
                Showing <b>{filteredProducts.length}</b> items
                {searchTerm && <> for "<b>{searchTerm}</b>"</>}
              </p>
            )}
          </div>
        </div>

        {/* Main Content with Sidebar */}
        <div className="container-fluid py-4 pt-lg-4 mt-lg-5 mt-5 pt-5">
          <div className="row">
            {/* Desktop Sidebar Filter */}
            <div className="d-none d-lg-block col-lg-3">
              <BrandFilter {...brandFilterProps} />
            </div>

            {/* Mobile Filter Buttons */}
            <div className="d-lg-none mb-3 col-12">
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
                          <span className="text-muted small">
                            {filters.sort === "recent" ? "Relevance" :
                              filters.sort === "priceHighToLow" ? "Price High to Low" : "Price Low to High"}
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Filter Offcanvas */}
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
                    />
                  </div>
                </div>
              </>
            )}

            {/* Mobile Sort Offcanvas */}
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
                            onChange={() => {
                              setFilters(prev => ({ ...prev, sort: value }));
                              setShowSortOffcanvas(false);
                            }} />
                          <span className="page-title-main-name">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Results Grid */}
            <div className="col-12 col-lg-9">
              <div className="mb-3 d-flex justify-content-between align-items-center">
                <span className="text-muted page-title-main-name">
                  {filteredProducts.length > 0 ? `Showing ${filteredProducts.length} products` : "No products found"}
                </span>
                {isAnyFilterActive && (
                  <button className="btn btn-sm btn-outline-danger" onClick={handleClearAllFilters}>
                    Clear Filters
                  </button>
                )}
              </div>

              {isLoading && allProducts.length === 0 ? (
                <div className="loading-state text-center py-5">
                  <FaSpinner className="spin large-spinner" />
                  if (loading)
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
                </div>
              ) : error ? (
                <div className="error-box text-center py-5">
                  <FaRegSadTear size={40} />
                  <p>{error}</p>
                  <button onClick={() => window.location.reload()}>Retry</button>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="no-results text-center py-5">
                  <FaSearch size={64} className="text-muted mb-3" />
                  <h3>No matches found</h3>
                  <p className="text-muted">Try different keywords or adjust your filters.</p>
                  {(searchTerm || isAnyFilterActive) && (
                    <button className="btn btn-dark mt-3" onClick={() => {
                      clearSearch();
                      handleClearAllFilters();
                    }}>
                      Clear All
                    </button>
                  )}
                </div>
              ) : (
                // <div className="row g-4">
                //   {filteredProducts.map(renderProductCard)}
                // </div>

                <>
                  <div className="row g-4">
                    {filteredProducts.map(renderProductCard)}
                  </div>

                  {/* 🔥 Infinite Scroll Loader */}
                  {isFetchingMore && (
                    <div className="text-center py-4">
                      <div className="spinner-border text-dark" role="status"></div>
                      <p className="mt-2 text-muted">Loading more products...</p>
                    </div>
                  )}

                  {/* Optional End Message */}
                  {!hasMore && (
                    <div className="text-center py-4 text-muted">
                      No more products to show
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SearchPage;






//==============================================================================Done-Code(End)==========================================================================
