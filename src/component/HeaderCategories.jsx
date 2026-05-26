// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance.js";
// import "../css/Header/HeaderCategories.css";

// const HeaderCategories = () => {
//   const [categories, setCategories] = useState([]);
//   const [activeCategory, setActiveCategory] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const res = await axiosInstance.get("/api/user/categories/tree");
//       setCategories(res.data || []);
//     } catch (err) {
//       console.error("Category fetch failed", err);
//     }
//   };

//   return (
//     <div className="header-categories w-100">
//       <div className="container d-flex gap-4">
//         {categories.map(cat => (
//           <div
//             key={cat._id}
//             className="category-item"
//             onMouseEnter={() => setActiveCategory(cat)}
//             onMouseLeave={() => setActiveCategory(null)}
//           >
//             <span>{cat.name}</span>

//             {/* DROPDOWN */}
//             {activeCategory?._id === cat._id && (
//               <div className="category-dropdown">
//                 {cat.children?.map(sub => (
//                   <div key={sub._id} className="subcategory">
//                     <div
//                       className="subcategory-title"
//                       onClick={() =>
//                         navigate(`/category/${cat.slug}/${sub.slug}`)
//                       }
//                     >
//                       {sub.name}
//                     </div>

//                     <div className="subcategory-children">
//                       {sub.children?.map(child => (
//                         <div
//                           key={child._id}
//                           className="child-category"
//                           onClick={() =>
//                             navigate(
//                               `/category/${cat.slug}/${sub.slug}/${child.slug}`
//                             )
//                           }
//                         >
//                           {child.name}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default HeaderCategories;






























// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance.js";
// import "../css/Header/HeaderCategories.css";

// const STATIC_MENU_ITEMS = [
//   { label: "Brands", path: "/brands" },
//   { label: "Offers", path: "/offers" },
//   { label: "Virtual Try-on", path: "/virtual-try-on" },
//   { label: "Shade finder", path: "/shade-finder" },
//   { label: "For you", path: "/for-you" },
//   { label: "About us", path: "/about-us" }
// ];

// const HeaderCategories = () => {
//   const [categories, setCategories] = useState([]);
//   const [activeCategory, setActiveCategory] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const res = await axiosInstance.get("/api/user/categories/tree");
//       setCategories(res.data || []);
//     } catch (err) {
//       console.error("Category fetch failed", err);
//     }
//   };

//   return (
//     <div className="header-categories w-100">
//       <div className="container-fluid px-5 mx-5 d-flex align-items-center justify-content-evenly">

//         {/* 🔹 Dynamic Categories */}
//         {categories.map(cat => (
//           <div
//             key={cat._id}
//             className="category-item"
//             onMouseEnter={() => setActiveCategory(cat)}
//             onMouseLeave={() => setActiveCategory(null)}
//           >
//             <span>{cat.name}</span>

//             {activeCategory?._id === cat._id && (
//               <div className="category-dropdown">
//                 {cat.children?.map(sub => (
//                   <div key={sub._id} className="subcategory">
//                     <div
//                       className="subcategory-title"
//                       onClick={() =>
//                         navigate(`/category/${cat.slug}/${sub.slug}`)
//                       }
//                     >
//                       {sub.name}
//                     </div>

//                     <div className="subcategory-children">
//                       {sub.children?.map(child => (
//                         <div
//                           key={child._id}
//                           className="child-category"
//                           onClick={() =>
//                             navigate(
//                               `/category/${cat.slug}/${sub.slug}/${child.slug}`
//                             )
//                           }
//                         >
//                           {child.name}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}

//         {/* 🔹 Static Menu Items (After Categories) */}
//         {STATIC_MENU_ITEMS.map(item => (
//           <div
//             key={item.label}
//             className="category-item static-item"
//             onClick={() => navigate(item.path)}
//           >
//             <span>{item.label}</span>
//           </div>
//         ))}

//       </div>
//     </div>
//   );
// };

// export default HeaderCategories;





























// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance.js";
// import "../css/Header/HeaderCategories.css";

// const STATIC_MENU_ITEMS = [
//   { label: "Brands", path: "/brands" },
//   { label: "Offers", path: "/offers" },
//   { label: "Virtual Try-on", path: "/virtual-try-on" },
//   { label: "Shade finder", path: "/shade-finder" },
//   { label: "For you", path: "/for-you" },
//   { label: "About us", path: "/about-us" }
// ];

// const HeaderCategories = () => {
//   const [categories, setCategories] = useState([]);
//   const [activeCategoryId, setActiveCategoryId] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const res = await axiosInstance.get("/api/user/categories/tree");
//       // Ensure we always have an array
//       setCategories(Array.isArray(res.data) ? res.data : []);
//     } catch (err) {
//       console.error("Category fetch failed", err);
//       setCategories([]); // fallback
//     }
//   };

//   // Recursive rendering of subcategories (any depth)
//   const renderSubCategories = (children, parentSlug = "") => {
//     if (!Array.isArray(children) || children.length === 0) return null;

//     return (
//       <div className="subcategory-children">
//         {children.map((child) => {
//           // Build full path: parentSlug + child.slug
//           const path = parentSlug
//             ? `${parentSlug}/${child.slug}`
//             : child.slug;

//           return (
//             <div key={child._id} className="child-category-wrapper">
//               <div
//                 className="child-category"
//                 onClick={() => navigate(`/category/${path}`)}
//               >
//                 {child.name}
//               </div>
//               {/* Recursively render deeper levels */}
//               {renderSubCategories(child.children, path)}
//             </div>
//           );
//         })}
//       </div>
//     );
//   };

//   return (
//     <div className="header-categories w-100">
//       <div className="container-fluid px-5 mx-5 d-flex align-items-center justify-content-evenly">
//         {/* 🔹 Dynamic Categories with Hover Wrapper */}
//         {categories.map((cat) => (
//           <div
//             key={cat._id}
//             className="category-wrapper"
//             onMouseEnter={() => setActiveCategoryId(cat._id)}
//             onMouseLeave={() => setActiveCategoryId(null)}
//             style={{ position: "relative" }} // needed for absolute dropdown
//           >
//             {/* Category Name */}
//             <span
//               className="category-name"
//               onClick={() => navigate(`/category/${cat.slug}`)}
//             >
//               {cat.name}
//             </span>

//             {/* Dropdown – only shown when this category is active */}
//             {activeCategoryId === cat._id && (
//               <div className="category-dropdown">
//                 {Array.isArray(cat.children) && cat.children.length > 0 ? (
//                   cat.children.map((sub) => (
//                     <div key={sub._id} className="subcategory">
//                       {/* Subcategory Title (clickable) */}
//                       <div
//                         className="subcategory-title"
//                         onClick={() =>
//                           navigate(`/category/${cat.slug}/${sub.slug}`)
//                         }
//                       >
//                         {sub.name}
//                       </div>

//                       {/* Render deeper subcategories recursively */}
//                       {renderSubCategories(sub.children, `${cat.slug}/${sub.slug}`)}
//                     </div>
//                   ))
//                 ) : (
//                   // Optional: Show "No subcategories" message or nothing
//                   <div className="dropdown-empty">No subcategories</div>
//                 )}
//               </div>
//             )}
//           </div>
//         ))}

//         {/* 🔹 Static Menu Items (after dynamic categories) */}
//         {STATIC_MENU_ITEMS.map((item) => (
//           <div
//             key={item.label}
//             className="category-wrapper static-item"
//             onClick={() => navigate(item.path)}
//             style={{ cursor: "pointer" }}
//           >
//             <span className="category-name">{item.label}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default HeaderCategories;






















// import React, { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance.js";
// import "../css/Header/HeaderCategories.css";

// const STATIC_MENU_ITEMS = [
//   { label: "Brands", path: "/brands" },
//   { label: "Offers", path: "/offers" },
//   { label: "Virtual Try-on", path: "/virtual-try-on" },
//   { label: "Shade finder", path: "/shade-finder" },
//   { label: "For you", path: "/for-you" },
//   { label: "About us", path: "/aboutus" }
// ];

// const HeaderCategories = () => {
//   const [categories, setCategories] = useState([]);
//   const [activeCategoryId, setActiveCategoryId] = useState(null);
//   const navigate = useNavigate();
//   const hoverTimeoutRef = useRef(null);

//   useEffect(() => {
//     fetchCategories();
//     return () => {
//       if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
//     };
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const res = await axiosInstance.get("/api/user/categories/tree");
//       // ✅ Direct array – as shown in your API response
//       setCategories(Array.isArray(res.data) ? res.data : []);
//     } catch (err) {
//       console.error("Category fetch failed", err);
//       setCategories([]);
//     }
//   };

//   // ✅ Hover with grace period – dropdown stays open
//   const handleMouseEnter = (catId) => {
//     if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
//     setActiveCategoryId(catId);
//   };

//   const handleMouseLeave = () => {
//     hoverTimeoutRef.current = setTimeout(() => {
//       setActiveCategoryId(null);
//     }, 200);
//   };

//   // ✅ Recursive render using correct property name: subCategories
//   const renderSubCategories = (subCategories, parentSlug = "", level = 1) => {
//     if (!Array.isArray(subCategories) || subCategories.length === 0) return null;

//     return (
//       <div className={`subcategory-children page-title-main-name level-${level}`}>
//         {subCategories.map((child) => {
//           const path = parentSlug
//             ? `${parentSlug}/${child.slug}`
//             : child.slug;

//           return (
//             <div key={child._id} className="child-category-wrapper page-title-main-name">
//               <div
//                 className="child-category"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   navigate(`/category/${path}`);
//                   setActiveCategoryId(null);
//                 }}
//               >
//                 {child.name}
//               </div>
//               {/* ✅ Recursively render deeper levels */}
//               {renderSubCategories(child.subCategories, path, level + 1)}
//             </div>
//           );
//         })}
//       </div>
//     );
//   };

//   return (
//     <div className="header-categories w-100 page-title-main-name">
//       <div className="container-fluid px-5 mx-5 d-flex align-items-center justify-content-evenly">
//         {/* ✅ Dynamic Categories */}
//         {categories.map((cat) => (
//           <div
//             key={cat._id}
//             className="category-wrapper"
//             onMouseEnter={() => handleMouseEnter(cat._id)}
//             onMouseLeave={handleMouseLeave}
//           >
//             {/* Category Name */}
//             <span
//               className="category-name"
//               onClick={() => {
//                 navigate(`/category/${cat.slug}`);
//                 setActiveCategoryId(null);
//               }}
//             >
//               {cat.name}
//             </span>

//             {/* Dropdown – only when active */}
//             {activeCategoryId === cat._id && (
//               <div className="category-dropdown">
//                 {Array.isArray(cat.subCategories) && cat.subCategories.length > 0 ? (
//                   cat.subCategories.map((sub) => (
//                     <div key={sub._id} className="subcategory">
//                       {/* Subcategory Title */}
//                       <div
//                         className="subcategory-title"
//                         onClick={() => {
//                           navigate(`/category/${cat.slug}/${sub.slug}`);
//                           setActiveCategoryId(null);
//                         }}
//                       >
//                         {sub.name}
//                       </div>

//                       {/* ✅ Nested sub‑sub‑categories */}
//                       {renderSubCategories(
//                         sub.subCategories,
//                         `${cat.slug}/${sub.slug}`
//                       )}
//                     </div>
//                   ))
//                 ) : (
//                   <div className="dropdown-empty">No subcategories</div>
//                 )}
//               </div>
//             )}
//           </div>
//         ))}

//         {/* ✅ Static Menu Items */}
//         {STATIC_MENU_ITEMS.map((item) => (
//           <div
//             key={item.label}
//             className="category-wrapper static-item"
//             onClick={() => navigate(item.path)}
//           >
//             <span className="category-name">{item.label}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default HeaderCategories;





























// import React, { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance.js";
// import "../css/Header/HeaderCategories.css";

// const STATIC_MENU_ITEMS = [
//   { label: "Brands", path: "/brands" },
//   { label: "Offers", path: "/offers" },
//   { label: "Virtual Try-on", path: "/virtual-try-on" },
//   { label: "Shade finder", path: "/shade-finder" },
//   { label: "For you", path: "/for-you" },
//   { label: "About us", path: "/aboutus" }
// ];

// const HeaderCategories = () => {
//   const [categories, setCategories] = useState([]);
//   const [activeCategoryId, setActiveCategoryId] = useState(null);
//   const navigate = useNavigate();
//   const hoverTimeoutRef = useRef(null);

//   useEffect(() => {
//     fetchCategories();
//     return () => {
//       if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
//     };
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const res = await axiosInstance.get("/api/user/categories/tree");
//       // ✅ Direct array – as shown in your API response
//       setCategories(Array.isArray(res.data) ? res.data : []);
//     } catch (err) {
//       console.error("Category fetch failed", err);
//       setCategories([]);
//     }
//   };

//   // ✅ Hover with grace period – dropdown stays open
//   const handleMouseEnter = (catId) => {
//     if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
//     setActiveCategoryId(catId);
//   };

//   const handleMouseLeave = () => {
//     hoverTimeoutRef.current = setTimeout(() => {
//       setActiveCategoryId(null);
//     }, 200);
//   };

//   // ✅ Recursive render using correct property name: subCategories
//   const renderSubCategories = (subCategories, parentSlug = "", level = 1) => {
//     if (!Array.isArray(subCategories) || subCategories.length === 0) return null;

//     return (
//       <div className={`subcategory-children page-title-main-name level-${level}`}>
//         {subCategories.map((child) => {
//           const path = parentSlug ? `${parentSlug}/${child.slug}` : child.slug;

//           return (
//             <div key={child._id} className="child-category-wrapper page-title-main-name">
//               <div
//                 className="child-category"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   navigate(`/category/${path}`);
//                   setActiveCategoryId(null);
//                 }}
//               >
//                 {child.name}
//               </div>
//               {/* ✅ Recursively render deeper levels */}
//               {renderSubCategories(child.subCategories, path, level + 1)}
//             </div>
//           );
//         })}
//       </div>
//     );
//   };

//   return (
//     <div className="header-categories w-100 page-title-main-name">
//       <div className="container-fluid px-5 mx-5 d-flex align-items-center justify-content-evenly">

//         {/* ✅ Dynamic Categories */}
//         {categories.map((cat) => (
//           <div
//             key={cat._id}
//             className="category-wrapper"
//             onMouseEnter={() => handleMouseEnter(cat._id)}
//             onMouseLeave={handleMouseLeave}
//           >
//             {/* Category Name */}
//             <span
//               className="category-name"
//               onClick={() => {
//                 navigate(`/category/${cat.slug}`);
//                 setActiveCategoryId(null);
//               }}
//             >
//               {cat.name}
//             </span>

//             {/* ✅ Dropdown – Split into 2 Parts (Left: Subcategories, Right: Image) */}
//             {activeCategoryId === cat._id && (
//               <div className="category-dropdown d-flex">

//                 {/* 🔴 PART 1: LEFT SIDE (Subcategories) */}
//                 <div className="dropdown-left-side" style={{ flex: 1, paddingRight: "20px" }}>
//                   {Array.isArray(cat.subCategories) && cat.subCategories.length > 0 ? (
//                     cat.subCategories.map((sub) => (
//                       <div key={sub._id} className="subcategory">
//                         {/* Subcategory Title */}
//                         <div
//                           className="subcategory-title"
//                           onClick={() => {
//                             navigate(`/category/${cat.slug}/${sub.slug}`);
//                             setActiveCategoryId(null);
//                           }}
//                         >
//                           {sub.name}
//                         </div>

//                         {/* ✅ Nested sub‑sub‑categories */}
//                         {renderSubCategories(
//                           sub.subCategories,
//                           `${cat.slug}/${sub.slug}`
//                         )}
//                       </div>
//                     ))
//                   ) : (
//                     <div className="dropdown-empty">No subcategories</div>
//                   )}
//                 </div>

//                 {/* 🔴 PART 2: RIGHT SIDE (Category Image) */}
//                 <div className="dropdown-right-side" style={{ width: "30%", minWidth: "250px", paddingLeft: "20px", borderLeft: "1px solid #eee", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                   <img
//                     // Replace 'cat.image' with your actual API image field name if different (e.g., cat.headerImage?.[0])
//                     src={cat.image || cat.headerImage?.[0] || "https://via.placeholder.com/300x400?text=Shop+Now"}
//                     alt={cat.name}
//                     style={{
//                       width: "100%",
//                       height: "auto",
//                       maxHeight: "350px",
//                       objectFit: "cover",
//                       borderRadius: "8px",
//                       cursor: "pointer"
//                     }}
//                     onClick={() => {
//                       navigate(`/category/${cat.slug}`);
//                       setActiveCategoryId(null);
//                     }}
//                   />
//                 </div>

//               </div>
//             )}
//           </div>
//         ))}

//         {/* ✅ Static Menu Items */}
//         {STATIC_MENU_ITEMS.map((item) => (
//           <div
//             key={item.label}
//             className="category-wrapper static-item"
//             onClick={() => navigate(item.path)}
//           >
//             <span className="category-name">{item.label}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default HeaderCategories;























// import React, { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance.js";
// import "../css/Header/HeaderCategories.css";

// const STATIC_MENU_ITEMS = [
//   { label: "Brands", path: "/brands" },
//   { label: "Offers", path: "/offers" },
//   { label: "Virtual Try-on", path: "/virtual-try-on" },
//   { label: "Shade finder", path: "/shade-finder" },
//   { label: "For you", path: "/for-you" },
//   { label: "About us", path: "/aboutus" }
// ];

// const HeaderCategories = () => {
//   const [categories, setCategories] = useState([]);
//   const [activeCategoryId, setActiveCategoryId] = useState(null);
//   const navigate = useNavigate();
//   const hoverTimeoutRef = useRef(null);

//   useEffect(() => {
//     fetchCategories();
//     return () => {
//       if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
//     };
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const res = await axiosInstance.get("/api/user/categories/tree");
//       // ✅ Direct array – as shown in your API response
//       setCategories(Array.isArray(res.data) ? res.data : []);
//     } catch (err) {
//       console.error("Category fetch failed", err);
//       setCategories([]);
//     }
//   };

//   // ✅ Hover with grace period – dropdown stays open
//   const handleMouseEnter = (catId) => {
//     if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
//     setActiveCategoryId(catId);
//   };

//   const handleMouseLeave = () => {
//     hoverTimeoutRef.current = setTimeout(() => {
//       setActiveCategoryId(null);
//     }, 200);
//   };

//   // ✅ Recursive render using correct property name: subCategories
//   const renderSubCategories = (subCategories, parentSlug = "", level = 1) => {
//     if (!Array.isArray(subCategories) || subCategories.length === 0) return null;

//     return (
//       <div className={`subcategory-children page-title-main-name level-${level}`}>
//         {subCategories.map((child) => {
//           const path = parentSlug ? `${parentSlug}/${child.slug}` : child.slug;

//           return (
//             <div key={child._id} className="child-category-wrapper page-title-main-name">
//               <div
//                 className="child-category"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   navigate(`/category/${path}`);
//                   setActiveCategoryId(null);
//                 }}
//               >
//                 {child.name}
//               </div>
//               {/* ✅ Recursively render deeper levels */}
//               {renderSubCategories(child.subCategories, path, level + 1)}
//             </div>
//           );
//         })}
//       </div>
//     );
//   };

//   // ✅ Helper function to get the correct image URL
//   const getCategoryImage = (cat) => {
//     // Priority: headerImage (string) > bannerImage[0] (array) > thumbnailImage[0] (array) > placeholder
//     if (cat.headerImage && typeof cat.headerImage === 'string') {
//       return cat.headerImage;
//     }
//     if (Array.isArray(cat.bannerImage) && cat.bannerImage.length > 0) {
//       return cat.bannerImage[0];
//     }
//     if (Array.isArray(cat.thumbnailImage) && cat.thumbnailImage.length > 0) {
//       return cat.thumbnailImage[0];
//     }
//     return "https://via.placeholder.com/300x400?text=Shop+Now";
//   };

//   return (
//     <div className="header-categories w-100 page-title-main-name">
//       <div className="container-fluid px-5 mx-5 d-flex align-items-center justify-content-evenly">

//         {/* ✅ Dynamic Categories */}
//         {categories.map((cat) => (
//           <div
//             key={cat._id}
//             className="category-wrapper"
//             onMouseEnter={() => handleMouseEnter(cat._id)}
//             onMouseLeave={handleMouseLeave}
//           >
//             {/* Category Name */}
//             <span
//               className="category-name"
//               onClick={() => {
//                 navigate(`/category/${cat.slug}`);
//                 setActiveCategoryId(null);
//               }}
//             >
//               {cat.name}
//             </span>

//             {/* ✅ Dropdown – Split into 2 Parts (Left: Subcategories, Right: Image) */}
//             {activeCategoryId === cat._id && (
//               <div className="category-dropdown d-flex">

//                 {/* 🔴 PART 1: LEFT SIDE (Subcategories) */}
//                 <div className="dropdown-left-side" style={{ flex: 1, paddingRight: "20px" }}>
//                   {Array.isArray(cat.subCategories) && cat.subCategories.length > 0 ? (
//                     cat.subCategories.map((sub) => (
//                       <div key={sub._id} className="subcategory">
//                         {/* Subcategory Title */}
//                         <div
//                           className="subcategory-title"
//                           onClick={() => {
//                             navigate(`/category/${cat.slug}/${sub.slug}`);
//                             setActiveCategoryId(null);
//                           }}
//                         >
//                           {sub.name}
//                         </div>

//                         {/* ✅ Nested sub‑sub‑categories */}
//                         {renderSubCategories(
//                           sub.subCategories,
//                           `${cat.slug}/${sub.slug}`
//                         )}
//                       </div>
//                     ))
//                   ) : (
//                     <div className="dropdown-empty">No subcategories</div>
//                   )}
//                 </div>

//                 {/* 🔴 PART 2: RIGHT SIDE (Category Image) */}
//                 <div className="dropdown-right-side" style={{ width: "30%", minWidth: "250px", paddingLeft: "20px", borderLeft: "1px solid #eee", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                   <img
//                     src={getCategoryImage(cat)}
//                     alt={cat.name}
//                     style={{
//                       width: "100%",
//                       height: "auto",
//                       maxHeight: "350px",
//                       objectFit: "cover",
//                       borderRadius: "8px",
//                       cursor: "pointer"
//                     }}
//                     onClick={() => {
//                       navigate(`/category/${cat.slug}`);
//                       setActiveCategoryId(null);
//                     }}
//                   />
//                 </div>

//               </div>
//             )}
//           </div>
//         ))}

//         {/* ✅ Static Menu Items */}
//         {STATIC_MENU_ITEMS.map((item) => (
//           <div
//             key={item.label}
//             className="category-wrapper static-item"
//             onClick={() => navigate(item.path)}
//           >
//             <span className="category-name">{item.label}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default HeaderCategories;


















// import React, { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance.js";
// import "../css/Header/HeaderCategories.css";

// const STATIC_MENU_ITEMS = [
//   { label: "Brands", path: "/brands", hasDropdown: true },
//   { label: "Offers", path: "/offerlanding" },
//   { label: "Virtual Try-on", path: "/virtualtryon" },
//   { label: "Shade finder", path: "/shadefinder" },
//   { label: "For you", path: "/foryoulanding" },
//   { label: "About us", path: "/aboutus" }
// ];

// const HeaderCategories = () => {
//   const [categories, setCategories] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [activeCategoryId, setActiveCategoryId] = useState(null);
//   const [activeStaticItem, setActiveStaticItem] = useState(null);
//   const navigate = useNavigate();
//   const hoverTimeoutRef = useRef(null);

//   useEffect(() => {
//     fetchCategories();
//     fetchBrands();
//     return () => {
//       if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
//     };
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const res = await axiosInstance.get("/api/user/categories/tree");
//       setCategories(Array.isArray(res.data) ? res.data : []);
//     } catch (err) {
//       console.error("Category fetch failed", err);
//       setCategories([]);
//     }
//   };

//   // ✅ Fetch all brands for the dropdown
//   const fetchBrands = async () => {
//     try {
//       const res = await axiosInstance.get("/api/user/brands"); // Adjust endpoint as per your API
//       setBrands(Array.isArray(res.data) ? res.data : []);
//     } catch (err) {
//       console.error("Brands fetch failed", err);
//       setBrands([]);
//     }
//   };

//   // ✅ Hover with grace period – dropdown stays open
//   const handleMouseEnter = (catId) => {
//     if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
//     setActiveCategoryId(catId);
//     setActiveStaticItem(null);
//   };

//   const handleStaticItemEnter = (itemLabel) => {
//     if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
//     setActiveStaticItem(itemLabel);
//     setActiveCategoryId(null);
//   };

//   const handleMouseLeave = () => {
//     hoverTimeoutRef.current = setTimeout(() => {
//       setActiveCategoryId(null);
//       setActiveStaticItem(null);
//     }, 200);
//   };

//   // ✅ Recursive render using correct property name: subCategories
//   const renderSubCategories = (subCategories, parentSlug = "", level = 1) => {
//     if (!Array.isArray(subCategories) || subCategories.length === 0) return null;

//     return (
//       <div className={`subcategory-children page-title-main-name level-${level}`}>
//         {subCategories.map((child) => {
//           const path = parentSlug ? `${parentSlug}/${child.slug}` : child.slug;

//           return (
//             <div key={child._id} className="child-category-wrapper page-title-main-name">
//               <div
//                 className="child-category"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   navigate(`/category/${path}`);
//                   setActiveCategoryId(null);
//                 }}
//               >
//                 {child.name}
//               </div>
//               {renderSubCategories(child.subCategories, path, level + 1)}
//             </div>
//           );
//         })}
//       </div>
//     );
//   };

//   // ✅ Helper function to get the correct image URL
//   const getCategoryImage = (cat) => {
//     if (cat.headerImage && typeof cat.headerImage === 'string') {
//       return cat.headerImage;
//     }
//     if (Array.isArray(cat.bannerImage) && cat.bannerImage.length > 0) {
//       return cat.bannerImage[0];
//     }
//     if (Array.isArray(cat.thumbnailImage) && cat.thumbnailImage.length > 0) {
//       return cat.thumbnailImage[0];
//     }
//     return "https://via.placeholder.com/300x400?text=Shop+Now";
//   };

//   // ✅ Helper function to get brand image
//   const getBrandImage = (brand) => {
//     if (brand.logo && typeof brand.logo === 'string') {
//       return brand.logo;
//     }
//     if (brand.image && typeof brand.image === 'string') {
//       return brand.image;
//     }
//     if (Array.isArray(brand.images) && brand.images.length > 0) {
//       return brand.images[0];
//     }
//     return "https://via.placeholder.com/150x80?text=Brand";
//   };

//   // ✅ Render Brands Dropdown/Slider
//   const renderBrandsDropdown = () => {
//     return (
//       <div className="brands-dropdown">
//         <div className="brands-header">
//           <h3>All Brands</h3>
//           {/* <button
//             className="view-all-brands-btn"
//             onClick={() => {
//               navigate("/brands");
//               setActiveStaticItem(null);
//             }}
//           >
//             View All
//           </button> */}
//         </div>

//         {/* Brand Slider/Grid */}
//         <div className="brands-slider-container">
//           {brands.length > 0 ? (
//             <div className="brands-grid">
//               {brands.map((brand) => (
//                 <div
//                   key={brand._id}
//                   className="brand-item"
//                   onClick={() => {
//                     navigate(`/brand/${brand.slug || brand._id}`);
//                     setActiveStaticItem(null);
//                   }}
//                 >
//                   <div className="brand-image-wrapper">
//                     <img
//                       src={getBrandImage(brand)}
//                       alt={brand.name}
//                       className="brand-logo"
//                     />
//                   </div>
//                   <span className="brand-name">{brand.name}</span>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="no-brands">No brands available</div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="header-categories w-100 page-title-main-name">
//       {/* <div className="container-fluid px-5 mx-5 d-flex align-items-center justify-content-evenly"> */}
//       <div className="container-fluid d-flex align-items-center justify-content-evenly">

//         {/* ✅ Dynamic Categories */}
//         {categories.map((cat) => (
//           <div
//             key={cat._id}
//             className="category-wrapper"
//             onMouseEnter={() => handleMouseEnter(cat._id)}
//             onMouseLeave={handleMouseLeave}
//           >
//             {/* Category Name */}
//             <span
//               className="category-name fw-normal"
//               onClick={() => {
//                 navigate(`/category/${cat.slug}`);
//                 setActiveCategoryId(null);
//               }}
//             >
//               {cat.name}
//             </span>

//             {/* ✅ Category Dropdown */}
//             {activeCategoryId === cat._id && (
//               // <div className="category-dropdown d-flex">

//               <div className="category-dropdown d-flex">

//                 {/* LEFT SIDE: Subcategories */}
//                 {/* <div className="dropdown-left-side" style={{ flex: 1, paddingRight: "20px" }}> */}
//                 <div className="dropdown-left-side">
//                   {Array.isArray(cat.subCategories) && cat.subCategories.length > 0 ? (
//                     cat.subCategories.map((sub) => (
//                       <div key={sub._id} className="subcategory">
//                         <div
//                           className="subcategory-title"
//                           onClick={() => {
//                             navigate(`/category/${cat.slug}/${sub.slug}`);
//                             setActiveCategoryId(null);
//                           }}
//                         >
//                           {sub.name}
//                         </div>
//                         {renderSubCategories(
//                           sub.subCategories,
//                           `${cat.slug}/${sub.slug}`
//                         )}
//                       </div>
//                     ))
//                   ) : (
//                     <div className="dropdown-empty">No subcategories</div>
//                   )}
//                 </div>

//                 {/* RIGHT SIDE: Category Image */}
//                 {/* <div className="dropdown-right-side" style={{ width: "30%", minWidth: "250px", paddingLeft: "20px", borderLeft: "1px solid #eee", display: "flex", alignItems: "center", justifyContent: "center" }}> */}

//                 <div className="dropdown-right-side">
//                   <img
//                     src={getCategoryImage(cat)}
//                     alt={cat.name}
//                     style={{
//                       width: "100%",
//                       height: "auto",
//                       maxHeight: "350px",
//                       objectFit: "cover",
//                       borderRadius: "8px",
//                       cursor: "pointer"
//                     }}
//                     onClick={() => {
//                       navigate(`/category/${cat.slug}`);
//                       setActiveCategoryId(null);
//                     }}
//                   />
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}

//         {/* ✅ Static Menu Items with Brands Dropdown */}
//         {STATIC_MENU_ITEMS.map((item) => (
//           <div
//             key={item.label}
//             className={`category-wrapper static-item ${item.hasDropdown ? 'has-dropdown' : ''}`}
//             onMouseEnter={() => item.hasDropdown ? handleStaticItemEnter(item.label) : null}
//             onMouseLeave={handleMouseLeave}
//           >
//             <span
//               className="category-name fw-normal"
//               onClick={() => navigate(item.path)}
//             >
//               {item.label}
//             </span>

//             {/* 🔴 BRANDS DROPDOWN */}
//             {item.label === "Brands" && activeStaticItem === "Brands" && (
//               <div className="brands-dropdown-wrapper">
//                 {renderBrandsDropdown()}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default HeaderCategories;




























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