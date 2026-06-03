// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useLocation } from "react-router-dom";

// const BrandFilter = ({ filters, setFilters, onClose, currentPage = "" }) => {
//   const [filterData, setFilterData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const location = useLocation();


//   useEffect(() => {
//   const fetchFilterData = async () => {
//     console.log("🟡 Fetching filter data..."); // Debug start log

//     try {
//       const res = await axios.get(
//         "https://beauty.joyory.com/api/user/products/filters"
//       );

//       console.log("🟢 Filter API response:", res); // full axios response
//       console.log("✅ Filter Data:", res.data); // clean data only
//       console.log("📂 Filters inside data:", res.data?.filters); // just filters

//       setFilterData(res.data);
//     } catch (err) {
//       console.error("❌ Error fetching filter data:", err);
//     } finally {
//       setLoading(false);
//       console.log("🔵 Filter data fetch complete.");
//     }
//   };

//   fetchFilterData();
// }, []);


//   if (loading) return <p>Loading filters...</p>;
//   if (!filterData) return <p>Unable to load filters.</p>;

//   const {
//     brands = [],
//     categories = [],
//     skinTypes = [],
//     formulations = [],
//     priceRanges = [],
//   } = filterData?.filters || {};

//   // Handle filter change
// const handleFilterChange = async (key, value) => {
//   setFilters({ ...filters, [key]: value });

//   if (key === "category") {
//     console.log("🟠 Category selected:", value);

//     try {
//       // const url = `https://beauty.joyory.com/api/user/products?category=${value}`;
//       const url = `https://beauty.joyory.com/api/user/products?categoryId=${value}`;
//       console.log("🌐 Fetching:", url);

//       const res = await axios.get(url);

//       console.log("🟢 API Response:", res.data);
//       console.log("📦 Product count:", res.data?.length || res.data?.products?.length || 0);
//     } catch (err) {
//       console.error("❌ Error fetching products:", err);
//     }
//   }
// };


//   const handleClearFilters = () => {
//     setFilters({
//       brand: "",
//       category: "",
//       skinType: "",
//       formulation: "",
//       priceRange: null,
//       minRating: "",
//       discountSort: "",
//     });
//   };

//   const hideBrandFilter = currentPage === "brand";
//   const hideCategoryFilter = location.pathname.includes("/category");
//   const hideSkinTypeFilter = location.pathname.includes("/skintype");

//   return (
//     <div className="p-3 border rounded bg-light">
//       <h5 className="fw-bold text-primary mb-3">Filters</h5>

//       {/* Brand */}
//       {!hideBrandFilter && (
//         <div className="mb-3">
//           <label className="form-label fw-bold">Brand</label>
//           <select
//             className="form-select"
//             value={filters.brand || ""}
//             onChange={(e) => handleFilterChange("brand", e.target.value)}
//           >
//             <option value="">All</option>
//             {brands.map((b) => (
//               <option key={b._id} value={b._id}>
//                 {b.name}
//               </option>
//             ))}
//           </select>
//         </div>
//       )}

//       {/* Category */}
//       {!hideCategoryFilter && (
//         <div className="mb-3">
//           <label className="form-label fw-bold">Category</label>
//           <select
//             className="form-select"
//             value={filters.category || ""}
//             onChange={(e) => handleFilterChange("category", e.target.value)}
//           >
//             <option value="">All</option>
//             {categories.map((c) => (
//               <option key={c._id} value={c._id}>
//                 {c.name}
//               </option>
//             ))}
//           </select>
//         </div>
//       )}

//       {/* Skin Type */}
//       {!hideSkinTypeFilter && (
//         <div className="mb-3">
//           <label className="form-label fw-bold">Skin Type</label>
//           <select
//             className="form-select"
//             value={filters.skinType || ""}
//             onChange={(e) => handleFilterChange("skinType", e.target.value)}
//           >
//             <option value="">All</option>
//             {skinTypes.map((st) => (
//               <option key={st._id} value={st._id}>
//                 {st.name}
//               </option>
//             ))}
//           </select>
//         </div>
//       )}

//       {/* Formulation */}
//       <div className="mb-3">
//         <label className="form-label fw-bold">Formulation</label>
//         <select
//           className="form-select"
//           value={filters.formulation || ""}
//           onChange={(e) => handleFilterChange("formulation", e.target.value)}
//         >
//           <option value="">All</option>
//           {formulations.map((f) => (
//             <option key={f._id} value={f._id}>
//               {f.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Price Range */}
//       <div className="mb-3">
//         <label className="form-label fw-bold">Price Range</label>
//         <select
//           className="form-select"
//           value={filters.priceRange ? JSON.stringify(filters.priceRange) : ""}
//           onChange={(e) => {
//             const value = e.target.value ? JSON.parse(e.target.value) : null;
//             handleFilterChange("priceRange", value);
//           }}
//         >
//           <option value="">All</option>
//           {priceRanges.map((pr, idx) => (
//             <option
//               key={idx}
//               value={JSON.stringify({ min: pr.min, max: pr.max })}
//             >
//               {pr.label}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Minimum Rating */}
//       <div className="mb-3">
//         <label className="form-label fw-bold">Minimum Rating</label>
//         <select
//           className="form-select"
//           value={filters.minRating || ""}
//           onChange={(e) => handleFilterChange("minRating", e.target.value)}
//         >
//           <option value="">All</option>
//           {[5, 4, 3, 2, 1].map((r) => (
//             <option key={r} value={r}>
//               {r}★ & up
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Discount Sort */}
//       <div className="mb-3">
//         <label className="form-label fw-bold">Sort by Discount</label>
//         <select
//           className="form-select"
//           value={filters.discountSort || ""}
//           onChange={(e) => handleFilterChange("discountSort", e.target.value)}
//         >
//           <option value="">Default</option>
//           <option value="high">Highest First</option>
//           <option value="low">Lowest First</option>
//         </select>
//       </div>

//       <div className="d-flex gap-2">
//         <button
//           className="btn btn-danger btn-sm w-50"
//           onClick={handleClearFilters}
//         >
//           Clear All
//         </button>
//         {onClose && (
//           <button className="btn btn-secondary btn-sm w-50" onClick={onClose}>
//             Close
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BrandFilter;















// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useLocation } from "react-router-dom";

// const BrandFilter = ({ filters, setFilters, onClose, currentPage = "" }) => {
//   const [filterData, setFilterData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const location = useLocation();


//   useEffect(() => {
//     const fetchFilterData = async () => {
//       console.log("🟡 Fetching filter data..."); // Debug start log

//       try {
//         const res = await axios.get(
//           "https://beauty.joyory.com/api/user/products/filters"
//         );

//         console.log("🟢 Filter API response:", res); // full axios response
//         console.log("✅ Filter Data:", res.data); // clean data only
//         console.log("📂 Filters inside data:", res.data?.filters); // just filters

//         setFilterData(res.data);
//       } catch (err) {
//         console.error("❌ Error fetching filter data:", err);
//       } finally {
//         setLoading(false);
//         console.log("🔵 Filter data fetch complete.");
//       }
//     };

//     fetchFilterData();
//   }, []);


//   if (loading) return <p>Loading filters...</p>;
//   if (!filterData) return <p>Unable to load filters.</p>;

//   const {
//     brands = [],
//     categories = [],
//     skinTypes = [],
//     formulations = [],
//     priceRanges = [],
//   } = filterData?.filters || {};

//   // Handle filter change
//   const handleFilterChange = async (key, value) => {
//     setFilters({ ...filters, [key]: value });

//     if (key === "category") {
//       console.log("🟠 Category selected:", value);

//       try {
//         // const url = `https://beauty.joyory.com/api/user/products?category=${value}`;
//         const url = `https://beauty.joyory.com/api/user/products?categoryId=${value}`;
//         console.log("🌐 Fetching:", url);

//         const res = await axios.get(url);

//         console.log("🟢 API Response:", res.data);
//         console.log("📦 Product count:", res.data?.length || res.data?.products?.length || 0);
//       } catch (err) {
//         console.error("❌ Error fetching products:", err);
//       }
//     }
//   };


//   const handleClearFilters = () => {
//     setFilters({
//       brand: "",
//       category: "",
//       skinType: "",
//       formulation: "",
//       priceRange: null,
//       minRating: "",
//       discountSort: "",
//     });
//   };

//   const hideBrandFilter = currentPage === "brand";
//   const hideCategoryFilter = location.pathname.includes("/category");
//   const hideSkinTypeFilter = location.pathname.includes("/skintype");

//   return (
//     <div className="p-3 rounded bg-light">
//       <h5 className="fw-bold text-primary mb-3">Filters</h5>



//       <div className="row">
//         {/* Brand */}
//         <div className="col-6 col-lg-12">
//           {!hideBrandFilter && (
//             <div className="mb-3">
//               <label className="form-label fw-bold">Brand</label>
//               <select
//                 className="form-select"
//                 value={filters.brand || ""}
//                 onChange={(e) => handleFilterChange("brand", e.target.value)}
//               >
//                 <option value="">All</option>
//                 {brands.map((b) => (
//                   <option key={b._id} value={b._id}>
//                     {b.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>



//         <div className="col-6 col-lg-12">
//           {/* Category */}
//           {!hideCategoryFilter && (
//             <div className="mb-3">
//               <label className="form-label fw-bold">Category</label>
//               <select
//                 className="form-select"
//                 value={filters.category || ""}
//                 onChange={(e) => handleFilterChange("category", e.target.value)}
//               >
//                 <option value="">All</option>
//                 {categories.map((c) => (
//                   <option key={c._id} value={c._id}>
//                     {c.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>



//         <div className="col-6 col-lg-12">
//           {/* Skin Type */}
//           {!hideSkinTypeFilter && (
//             <div className="mb-3">
//               <label className="form-label fw-bold">Skin Type</label>
//               <select
//                 className="form-select"
//                 value={filters.skinType || ""}
//                 onChange={(e) => handleFilterChange("skinType", e.target.value)}
//               >
//                 <option value="">All</option>
//                 {skinTypes.map((st) => (
//                   <option key={st._id} value={st._id}>
//                     {st.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>



//         <div className="col-6 col-lg-12">
//           {/* Formulation */}
//           <div className="mb-3">
//             <label className="form-label fw-bold">Formulation</label>
//             <select
//               className="form-select"
//               value={filters.formulation || ""}
//               onChange={(e) => handleFilterChange("formulation", e.target.value)}
//             >
//               <option value="">All</option>
//               {formulations.map((f) => (
//                 <option key={f._id} value={f._id}>
//                   {f.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>


//         <div className="col-6 col-lg-12">
//           {/* Price Range */}
//           <div className="mb-3">
//             <label className="form-label fw-bold">Price Range</label>
//             <select
//               className="form-select"
//               value={filters.priceRange ? JSON.stringify(filters.priceRange) : ""}
//               onChange={(e) => {
//                 const value = e.target.value ? JSON.parse(e.target.value) : null;
//                 handleFilterChange("priceRange", value);
//               }}
//             >
//               <option value="">All</option>
//               {priceRanges.map((pr, idx) => (
//                 <option
//                   key={idx}
//                   value={JSON.stringify({ min: pr.min, max: pr.max })}
//                 >
//                   {pr.label}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>



//         <div className="col-6 col-lg-12">

//           {/* Minimum Rating */}
//           <div className="mb-3">
//             <label className="form-label fw-bold">Minimum Rating</label>
//             <select
//               className="form-select"
//               value={filters.minRating || ""}
//               onChange={(e) => handleFilterChange("minRating", e.target.value)}
//             >
//               <option value="">All</option>
//               {[5, 4, 3, 2, 1].map((r) => (
//                 <option key={r} value={r}>
//                   {r}★ & up
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>


//         <div className="col-6 col-lg-12">
//           {/* Discount Sort */}
//           <div className="mb-3">
//             <label className="form-label fw-bold">Sort by Discount</label>
//             <select
//               className="form-select"
//               value={filters.discountSort || ""}
//               onChange={(e) => handleFilterChange("discountSort", e.target.value)}
//             >
//               <option value="">Default</option>
//               <option value="high">Highest First</option>
//               <option value="low">Lowest First</option>
//             </select>
//           </div>
//         </div>



//       </div>





//       <div className="d-flex gap-2">
//         <button
//           className="btn btn-danger btn-sm w-50"
//           onClick={handleClearFilters}
//         >
//           Clear All
//         </button>
//         {onClose && (
//           <button className="btn btn-secondary btn-sm w-50" onClick={onClose}>
//             Close
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BrandFilter;






















// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useLocation } from "react-router-dom";

// const BrandFilter = ({ filters, setFilters, onClose, currentPage = "" }) => {
//   const [filterData, setFilterData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const location = useLocation();

//   useEffect(() => {
//     const fetchFilterData = async () => {
//       try {
//         const res = await axios.get(
//           "https://beauty.joyory.com/api/user/products/filters"
//         );
//         setFilterData(res.data);
//       } catch (err) {
//         console.error("❌ Error fetching filter data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFilterData();
//   }, []);

//   if (loading) return <p>Loading filters...</p>;
//   if (!filterData) return <p>Unable to load filters.</p>;

//   const {
//     brands = [],
//     categories = [],
//     skinTypes = [],
//     formulations = [],
//     priceRanges = [],
//   } = filterData?.filters || {};

//   const handleFilterChange = (key, value) => {
//     setFilters({ ...filters, [key]: value });
//   };

//   const handleClearFilters = () => {
//     setFilters({
//       brand: "",
//       category: "",
//       skinType: "",
//       formulation: "",
//       priceRange: null,
//       minRating: "",
//       discountSort: "",
//     });
//   };

//   const hideBrandFilter = currentPage === "brand";
//   const hideCategoryFilter = location.pathname.includes("/category");
//   const hideSkinTypeFilter = location.pathname.includes("/skintype");

//   const isCartPage = location.pathname === "/cartpage";
//   const columnClass = isCartPage ? "d-none" : "col-0 col-lg-0";

//   return (
//     // <div className="p-3 rounded bg-light">
//     //   <h5 className="fw-bold text-primary mb-3">Filters</h5>

//     //   <div className="row">
//     //     {/* Brand */}
//     //     <div className={columnClass}>
//     //       {!hideBrandFilter && (
//     //         <div className="mb-3">
//     //           <label className="form-label fw-bold">Brand</label>
//     //           <select
//     //             className="form-select"
//     //             value={filters.brand || ""}
//     //             onChange={(e) => handleFilterChange("brand", e.target.value)}
//     //           >
//     //             <option value="">All</option>
//     //             {brands.map((b) => (
//     //               <option key={b._id} value={b._id}>
//     //                 {b.name}
//     //               </option>
//     //             ))}
//     //           </select>
//     //         </div>
//     //       )}
//     //     </div>

//     //     {/* Category */}
//     //     <div className={columnClass}>
//     //       {!hideCategoryFilter && (
//     //         <div className="mb-3">
//     //           <label className="form-label fw-bold">Category</label>
//     //           <select
//     //             className="form-select"
//     //             value={filters.category || ""}
//     //             onChange={(e) => handleFilterChange("category", e.target.value)}
//     //           >
//     //             <option value="">All</option>
//     //             {categories.map((c) => (
//     //               <option key={c._id} value={c._id}>
//     //                 {c.name}
//     //               </option>
//     //             ))}
//     //           </select>
//     //         </div>
//     //       )}
//     //     </div>

//     //     {/* Skin Type */}
//     //     <div className={columnClass}>
//     //       {!hideSkinTypeFilter && (
//     //         <div className="mb-3">
//     //           <label className="form-label fw-bold">Skin Type</label>
//     //           <select
//     //             className="form-select"
//     //             value={filters.skinType || ""}
//     //             onChange={(e) => handleFilterChange("skinType", e.target.value)}
//     //           >
//     //             <option value="">All</option>
//     //             {skinTypes.map((st) => (
//     //               <option key={st._id} value={st._id}>
//     //                 {st.name}
//     //               </option>
//     //             ))}
//     //           </select>
//     //         </div>
//     //       )}
//     //     </div>

//     //     {/* Formulation */}
//     //     <div className={columnClass}>
//     //       <div className="mb-3">
//     //         <label className="form-label fw-bold">Formulation</label>
//     //         <select
//     //           className="form-select"
//     //           value={filters.formulation || ""}
//     //           onChange={(e) => handleFilterChange("formulation", e.target.value)}
//     //         >
//     //           <option value="">All</option>
//     //           {formulations.map((f) => (
//     //             <option key={f._id} value={f._id}>
//     //               {f.name}
//     //             </option>
//     //           ))}
//     //         </select>
//     //       </div>
//     //     </div>

//     //     {/* Price Range */}
//     //     <div className={columnClass}>
//     //       <div className="mb-3">
//     //         <label className="form-label fw-bold">Price Range</label>
//     //         <select
//     //           className="form-select"
//     //           value={filters.priceRange ? JSON.stringify(filters.priceRange) : ""}
//     //           onChange={(e) => {
//     //             const value = e.target.value ? JSON.parse(e.target.value) : null;
//     //             handleFilterChange("priceRange", value);
//     //           }}
//     //         >
//     //           <option value="">All</option>
//     //           {priceRanges.map((pr, idx) => (
//     //             <option
//     //               key={idx}
//     //               value={JSON.stringify({ min: pr.min, max: pr.max })}
//     //             >
//     //               {pr.label}
//     //             </option>
//     //           ))}
//     //         </select>
//     //       </div>
//     //     </div>

//     //     {/* Minimum Rating */}
//     //     <div className={columnClass}>
//     //       <div className="mb-3">
//     //         <label className="form-label fw-bold">Minimum Rating</label>
//     //         <select
//     //           className="form-select"
//     //           value={filters.minRating || ""}
//     //           onChange={(e) => handleFilterChange("minRating", e.target.value)}
//     //         >
//     //           <option value="">All</option>
//     //           {[5, 4, 3, 2, 1].map((r) => (
//     //             <option key={r} value={r}>
//     //               {r}★ & up
//     //             </option>
//     //           ))}
//     //         </select>
//     //       </div>
//     //     </div>

//     //     {/* Discount Sort */}
//     //     <div className={columnClass}>
//     //       <div className="mb-3">
//     //         <label className="form-label fw-bold">Sort by Discount</label>
//     //         <select
//     //           className="form-select"
//     //           value={filters.discountSort || ""}
//     //           onChange={(e) => handleFilterChange("discountSort", e.target.value)}
//     //         >
//     //           <option value="">Default</option>
//     //           <option value="high">Highest First</option>
//     //           <option value="low">Lowest First</option>
//     //         </select>
//     //       </div>
//     //     </div>
//     //   </div>

//     //   <div className="d-flex gap-2">
//     //     <button
//     //       className="btn btn-danger btn-sm w-50"
//     //       onClick={handleClearFilters}
//     //     >
//     //       Clear All
//     //     </button>
//     //     {onClose && (
//     //       <button className="btn btn-secondary btn-sm w-50" onClick={onClose}>
//     //         Close
//     //       </button>
//     //     )}
//     //   </div>
//     // </div>

//     <div className="filter-wrapper border" style={{position:'sticky' , top:'10px'}}>
//   {/* Header */}
//   <div className="d-flex justify-content-between align-items-center p-3">
//     <h6 className="fw-bold mb-0">Filters</h6>
//     <button
//       className="btn btn-link text-decoration-none text-muted p-0"
//       onClick={handleClearFilters}
//     >
//       Reset
//     </button>
//   </div>

//   {/* Accordion */}
//   <div className="accordion mb-0 accordion-flush border-none" id="filterAccordion">

//     {/* Category */}
//     {!hideCategoryFilter && (
//       <div className="accordion-item">
//         <h2 className="accordion-header">
//           <button
//             className="accordion-button collapsed"
//             type="button"
//             data-bs-toggle="collapse"
//             data-bs-target="#filterCategory"
//           >
//             Category
//           </button>
//         </h2>
//         <div id="filterCategory" className="accordion-collapse collapse">
//           <div className="accordion-body">
//             <select
//               className="form-select"
//               value={filters.category || ""}
//               onChange={(e) =>
//                 handleFilterChange("category", e.target.value)
//               }
//             >
//               <option value="">All</option>
//               {categories.map((c) => (
//                 <option key={c._id} value={c._id}>
//                   {c.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>
//     )}

//     {/* Brand */}
//     {!hideBrandFilter && (
//       <div className="accordion-item">
//         <h2 className="accordion-header">
//           <button
//             className="accordion-button collapsed"
//             type="button"
//             data-bs-toggle="collapse"
//             data-bs-target="#filterBrand"
//           >
//             Brand
//           </button>
//         </h2>
//         <div id="filterBrand" className="accordion-collapse collapse">
//           <div className="accordion-body">
//             <select
//               className="form-select"
//               value={filters.brand || ""}
//               onChange={(e) =>
//                 handleFilterChange("brand", e.target.value)
//               }
//             >
//               <option value="">All</option>
//               {brands.map((b) => (
//                 <option key={b._id} value={b._id}>
//                   {b.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>
//     )}

//     {/* Skin Type */}
//     {!hideSkinTypeFilter && (
//       <div className="accordion-item">
//         <h2 className="accordion-header">
//           <button
//             className="accordion-button collapsed"
//             type="button"
//             data-bs-toggle="collapse"
//             data-bs-target="#filterSkinType"
//           >
//             Skin Type
//           </button>
//         </h2>
//         <div id="filterSkinType" className="accordion-collapse collapse">
//           <div className="accordion-body">
//             <select
//               className="form-select"
//               value={filters.skinType || ""}
//               onChange={(e) =>
//                 handleFilterChange("skinType", e.target.value)
//               }
//             >
//               <option value="">All</option>
//               {skinTypes.map((st) => (
//                 <option key={st._id} value={st._id}>
//                   {st.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>
//     )}

//     {/* Formulation */}
//     <div className="accordion-item">
//       <h2 className="accordion-header">
//         <button
//           className="accordion-button collapsed"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#filterFormulation"
//         >
//           Formulation
//         </button>
//       </h2>
//       <div id="filterFormulation" className="accordion-collapse collapse">
//         <div className="accordion-body">
//           <select
//             className="form-select"
//             value={filters.formulation || ""}
//             onChange={(e) =>
//               handleFilterChange("formulation", e.target.value)
//             }
//           >
//             <option value="">All</option>
//             {formulations.map((f) => (
//               <option key={f._id} value={f._id}>
//                 {f.name}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>
//     </div>

//     {/* Price Range */}
//     <div className="accordion-item">
//       <h2 className="accordion-header">
//         <button
//           className="accordion-button collapsed"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#filterPrice"
//         >
//           Price Range
//         </button>
//       </h2>
//       <div id="filterPrice" className="accordion-collapse collapse">
//         <div className="accordion-body">
//           <select
//             className="form-select"
//             value={
//               filters.priceRange
//                 ? JSON.stringify(filters.priceRange)
//                 : ""
//             }
//             onChange={(e) => {
//               const value = e.target.value
//                 ? JSON.parse(e.target.value)
//                 : null;
//               handleFilterChange("priceRange", value);
//             }}
//           >
//             <option value="">All</option>
//             {priceRanges.map((pr, idx) => (
//               <option
//                 key={idx}
//                 value={JSON.stringify({ min: pr.min, max: pr.max })}
//               >
//                 {pr.label}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>
//     </div>

//     {/* Minimum Rating */}
//     <div className="accordion-item">
//       <h2 className="accordion-header">
//         <button
//           className="accordion-button collapsed"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#filterRating"
//         >
//           Minimum Rating
//         </button>
//       </h2>
//       <div id="filterRating" className="accordion-collapse collapse">
//         <div className="accordion-body">
//           <select
//             className="form-select"
//             value={filters.minRating || ""}
//             onChange={(e) =>
//               handleFilterChange("minRating", e.target.value)
//             }
//           >
//             <option value="">All</option>
//             {[5, 4, 3, 2, 1].map((r) => (
//               <option key={r} value={r}>
//                 {r}★ & up
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>
//     </div>

//     {/* Discount */}
//     <div className="accordion-item">
//       <h2 className="accordion-header">
//         <button
//           className="accordion-button collapsed"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#filterDiscount"
//         >
//           Discount
//         </button>
//       </h2>
//       <div id="filterDiscount" className="accordion-collapse collapse">
//         <div className="accordion-body">
//           <select
//             className="form-select"
//             value={filters.discountSort || ""}
//             onChange={(e) =>
//               handleFilterChange("discountSort", e.target.value)
//             }
//           >
//             <option value="">Default</option>
//             <option value="high">Highest First</option>
//             <option value="low">Lowest First</option>
//           </select>
//         </div>
//       </div>
//     </div>

//   </div>
// </div>

//   );
// };

// export default BrandFilter;



































// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useLocation } from "react-router-dom";

// const BrandFilter = ({ filters, setFilters, onClose, currentPage = "" }) => {
//   const [filterData, setFilterData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const location = useLocation();

//   useEffect(() => {
//     const fetchFilterData = async () => {
//       try {
//         const res = await axios.get(
//           "https://beauty.joyory.com/api/user/products/filters"
//         );
//         setFilterData(res.data);
//       } catch (err) {
//         console.error("❌ Error fetching filter data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFilterData();
//   }, []);

//   if (loading) return <p>Loading filters...</p>;
//   if (!filterData) return <p>Unable to load filters.</p>;

//   const {
//     brands = [],
//     categories = [],
//     skinTypes = [],
//     formulations = [],
//     priceRanges = [],
//   } = filterData?.filters || {};

//   const handleFilterChange = (key, value) => {
//     setFilters({ ...filters, [key]: value });
//   };

//   const handleClearFilters = () => {
//     setFilters({
//       brand: "",
//       category: "",
//       skinType: "",
//       formulation: "",
//       priceRange: null,
//       minRating: "",
//       discountSort: "",
//     });
//   };

//   const hideBrandFilter = currentPage === "brand";
//   const hideCategoryFilter = location.pathname.includes("/category");
//   const hideSkinTypeFilter = location.pathname.includes("/skintype");

//   const isCartPage = location.pathname === "/cartpage";
//   const columnClass = isCartPage ? "d-none" : "col-0 col-lg-0";

//   return (

//     <div className="filter-wrapper border" style={{ position: 'sticky', top: '140px' }}>
//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center p-3">
//         <h6 className="fw-bold mb-0 page-title-main-name">Filters</h6>
//         <button
//           className="bg-transparent border-0 text-decoration-none text-muted p-0 page-title-main-name"
//           onClick={handleClearFilters}
//         >
//           Reset
//         </button>
//       </div>

//       {/* Accordion */}
//       <div className="accordion mb-0 accordion-flush border-none" id="filterAccordion">

//         {/* Category */}
//         {!hideCategoryFilter && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button
//                 className="accordion-button collapsed page-title-main-name"
//                 type="button"
//                 data-bs-toggle="collapse"
//                 data-bs-target="#filterCategory"
//               >
//                 Category
//               </button>
//             </h2>
//             <div id="filterCategory" className="accordion-collapse collapse">
//               <div className="accordion-body">
//                 <select
//                   className="form-select page-title-main-name"
//                   value={filters.category || ""}
//                   onChange={(e) =>
//                     handleFilterChange("category", e.target.value)
//                   }
//                 >
//                   <option className="page-title-main-name" value="">All</option>
//                   {categories.map((c) => (
//                     <option key={c._id} value={c._id}>
//                       {c.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Brand */}
//         {!hideBrandFilter && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button
//                 className="accordion-button collapsed page-title-main-name"
//                 type="button"
//                 data-bs-toggle="collapse"
//                 data-bs-target="#filterBrand"
//               >
//                 Brand
//               </button>
//             </h2>
//             <div id="filterBrand" className="accordion-collapse collapse">
//               <div className="accordion-body">
//                 <select
//                   className="form-select page-title-main-name"
//                   value={filters.brand || ""}
//                   onChange={(e) =>
//                     handleFilterChange("brand", e.target.value)
//                   }
//                 >
//                   <option value="">All</option>
//                   {brands.map((b) => (
//                     <option key={b._id} value={b._id}>
//                       {b.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Skin Type */}
//         {!hideSkinTypeFilter && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button
//                 className="accordion-button collapsed page-title-main-name"
//                 type="button"
//                 data-bs-toggle="collapse"
//                 data-bs-target="#filterSkinType"
//               >
//                 Skin Type
//               </button>
//             </h2>
//             <div id="filterSkinType" className="accordion-collapse collapse">
//               <div className="accordion-body">
//                 <select
//                   className="form-select page-title-main-name"
//                   value={filters.skinType || ""}
//                   onChange={(e) =>
//                     handleFilterChange("skinType", e.target.value)
//                   }
//                 >
//                   <option value="">All</option>
//                   {skinTypes.map((st) => (
//                     <option key={st._id} value={st._id}>
//                       {st.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Formulation */}
//         <div className="accordion-item">
//           <h2 className="accordion-header">
//             <button
//               className="accordion-button collapsed page-title-main-name"
//               type="button"
//               data-bs-toggle="collapse"
//               data-bs-target="#filterFormulation"
//             >
//               Formulation
//             </button>
//           </h2>
//           <div id="filterFormulation" className="accordion-collapse collapse">
//             <div className="accordion-body">
//               <select
//                 className="form-select page-title-main-name"
//                 value={filters.formulation || ""}
//                 onChange={(e) =>
//                   handleFilterChange("formulation", e.target.value)
//                 }
//               >
//                 <option value="">All</option>
//                 {formulations.map((f) => (
//                   <option key={f._id} value={f._id}>
//                     {f.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Price Range */}
//         <div className="accordion-item">
//           <h2 className="accordion-header">
//             <button
//               className="accordion-button collapsed page-title-main-name"
//               type="button"
//               data-bs-toggle="collapse"
//               data-bs-target="#filterPrice"
//             >
//               Price Range
//             </button>
//           </h2>
//           <div id="filterPrice" className="accordion-collapse collapse">
//             <div className="accordion-body">
//               <select
//                 className="form-select page-title-main-name"
//                 value={
//                   filters.priceRange
//                     ? JSON.stringify(filters.priceRange)
//                     : ""
//                 }
//                 onChange={(e) => {
//                   const value = e.target.value
//                     ? JSON.parse(e.target.value)
//                     : null;
//                   handleFilterChange("priceRange", value);
//                 }}
//               >
//                 <option value="">All</option>
//                 {priceRanges.map((pr, idx) => (
//                   <option
//                     key={idx}
//                     value={JSON.stringify({ min: pr.min, max: pr.max })}
//                   >
//                     {pr.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Minimum Rating */}
//         <div className="accordion-item">
//           <h2 className="accordion-header">
//             <button
//               className="accordion-button collapsed page-title-main-name"
//               type="button"
//               data-bs-toggle="collapse"
//               data-bs-target="#filterRating"
//             >
//               Minimum Rating
//             </button>
//           </h2>
//           <div id="filterRating" className="accordion-collapse collapse">
//             <div className="accordion-body">
//               <select
//                 className="form-select page-title-main-name"
//                 value={filters.minRating || ""}
//                 onChange={(e) =>
//                   handleFilterChange("minRating", e.target.value)
//                 }
//               >
//                 <option value="">All</option>
//                 {[5, 4, 3, 2, 1].map((r) => (
//                   <option key={r} value={r}>
//                     {r}★ & up
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Discount */}
//         <div className="accordion-item">
//           <h2 className="accordion-header">
//             <button
//               className="accordion-button collapsed page-title-main-name"
//               type="button"
//               data-bs-toggle="collapse"
//               data-bs-target="#filterDiscount"
//             >
//               Discount
//             </button>
//           </h2>
//           <div id="filterDiscount" className="accordion-collapse collapse">
//             <div className="accordion-body">
//               <select
//                 className="form-select page-title-main-name"
//                 value={filters.discountSort || ""}
//                 onChange={(e) =>
//                   handleFilterChange("discountSort", e.target.value)
//                 }
//               >
//                 <option value="">Default</option>
//                 <option value="high">Highest First</option>
//                 <option value="low">Lowest First</option>
//               </select>
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>

//   );
// };

// export default BrandFilter;















// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useLocation } from "react-router-dom";

// const BrandFilter = ({ filters, setFilters, onClose, currentPage = "" }) => {
//   const [filterData, setFilterData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const location = useLocation();

//   useEffect(() => {
//     const fetchFilterData = async () => {
//       try {
//         const res = await axios.get(
//           "https://beauty.joyory.com/api/user/products/filters"
//         );
//         setFilterData(res.data);
//       } catch (err) {
//         console.error("❌ Error fetching filter data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFilterData();
//   }, []);

//   if (loading) return <p>Loading filters...</p>;
//   if (!filterData) return <p>Unable to load filters.</p>;

//   // const {
//   //   brands = [],
//   //   categories = [],
//   //   skinTypes = [],
//   //   formulations = [],
//   //   priceRanges = [],
//   // } = filterData?.filters || {};




//   const {
//     brands = [],
//     categories = [],
//     skinTypes = [],
//     formulations = [],
//     finishes = [],
//     ingredients = [],
//     priceRanges = [],
//     discountRanges = [],
//     sortOptions = [],
//   } = filterData?.filters || {};

//   const handleFilterChange = (key, value) => {
//     setFilters({ ...filters, [key]: value });
//   };

//   // const handleClearFilters = () => {
//   //   setFilters({
//   //     brand: "",
//   //     category: "",
//   //     skinType: "",
//   //     formulation: "",
//   //     priceRange: null,
//   //     minRating: "",
//   //     discountSort: "",
//   //   });
//   // };



//   const handleClearFilters = () => {
//     setFilters({
//       brand: "",
//       category: "",
//       skinType: "",
//       formulation: "",
//       finish: "",
//       ingredient: "",
//       priceRange: null,
//       discountRange: null,
//       minRating: "",
//       sort: "recent",
//     });
//   };




//   const hideBrandFilter = currentPage === "brand";
//   const hideCategoryFilter = location.pathname.includes("/category");
//   const hideSkinTypeFilter = location.pathname.includes("/skintype");

//   const isCartPage = location.pathname === "/cartpage";
//   const columnClass = isCartPage ? "d-none" : "col-0 col-lg-0";

//   return (

//     <div className="filter-wrapper border" style={{ position: 'sticky', top: '140px' }}>
//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center p-3">
//         <h6 className="fw-bold mb-0 page-title-main-name">Filters</h6>
//         <button
//           className="bg-transparent border-0 text-decoration-none text-muted p-0 page-title-main-name"
//           onClick={handleClearFilters}
//         >
//           Reset
//         </button>
//       </div>

//       {/* Accordion */}
//       <div className="accordion mb-0 accordion-flush border-none" id="filterAccordion">

//         {/* Category */}
//         {!hideCategoryFilter && (
//           // <div className="accordion-item">
//           //   <h2 className="accordion-header">
//           //     <button
//           //       className="accordion-button collapsed page-title-main-name"
//           //       type="button"
//           //       data-bs-toggle="collapse"
//           //       data-bs-target="#filterCategory"
//           //     >
//           //       Category
//           //     </button>
//           //   </h2>
//           //   <div id="filterCategory" className="accordion-collapse collapse">
//           //     <div className="accordion-body">
//           //       <select
//           //         className="form-select page-title-main-name"
//           //         value={filters.category || ""}
//           //         onChange={(e) =>
//           //           handleFilterChange("category", e.target.value)
//           //         }
//           //       >
//           //         <option className="page-title-main-name" value="">All</option>
//           //         {categories.map((c) => (
//           //           <option key={c._id} value={c._id}>
//           //             {c.name}
//           //           </option>
//           //         ))}
//           //       </select>
//           //     </div>
//           //   </div>
//           // </div>




//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button
//                 className="accordion-button collapsed"
//                 type="button"
//                 data-bs-toggle="collapse"
//                 data-bs-target="#filterFinish"
//               >
//                 Finish
//               </button>
//             </h2>

//             <div id="filterFinish" className="accordion-collapse collapse">
//               <div className="accordion-body">
//                 <select
//                   className="form-select"
//                   value={filters.finish || ""}
//                   onChange={(e) => handleFilterChange("finish", e.target.value)}
//                 >
//                   <option value="">All</option>

//                   {finishes.map((f) => (
//                     <option key={f.slug} value={f.slug}>
//                       {f.name}
//                     </option>
//                   ))}

//                 </select>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Brand */}
//         {!hideBrandFilter && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button
//                 className="accordion-button collapsed page-title-main-name"
//                 type="button"
//                 data-bs-toggle="collapse"
//                 data-bs-target="#filterBrand"
//               >
//                 Brand
//               </button>
//             </h2>
//             <div id="filterBrand" className="accordion-collapse collapse">
//               <div className="accordion-body">
//                 <select
//                   className="form-select page-title-main-name"
//                   value={filters.brand || ""}
//                   onChange={(e) =>
//                     handleFilterChange("brand", e.target.value)
//                   }
//                 >
//                   <option value="">All</option>
//                   {brands.map((b) => (
//                     <option key={b._id} value={b._id}>
//                       {b.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Skin Type */}
//         {!hideSkinTypeFilter && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button
//                 className="accordion-button collapsed page-title-main-name"
//                 type="button"
//                 data-bs-toggle="collapse"
//                 data-bs-target="#filterSkinType"
//               >
//                 Skin Type
//               </button>
//             </h2>
//             <div id="filterSkinType" className="accordion-collapse collapse">
//               <div className="accordion-body">
//                 <select
//                   className="form-select page-title-main-name"
//                   value={filters.skinType || ""}
//                   onChange={(e) =>
//                     handleFilterChange("skinType", e.target.value)
//                   }
//                 >
//                   <option value="">All</option>
//                   {skinTypes.map((st) => (
//                     <option key={st._id} value={st._id}>
//                       {st.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Formulation */}
//         <div className="accordion-item">
//           <h2 className="accordion-header">
//             <button
//               className="accordion-button collapsed page-title-main-name"
//               type="button"
//               data-bs-toggle="collapse"
//               data-bs-target="#filterFormulation"
//             >
//               Formulation
//             </button>
//           </h2>
//           <div id="filterFormulation" className="accordion-collapse collapse">
//             <div className="accordion-body">
//               <select
//                 className="form-select page-title-main-name"
//                 value={filters.formulation || ""}
//                 onChange={(e) =>
//                   handleFilterChange("formulation", e.target.value)
//                 }
//               >
//                 <option value="">All</option>
//                 {formulations.map((f) => (
//                   <option key={f._id} value={f._id}>
//                     {f.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>



//         {/* Finish */}
//         <div className="accordion-item">
//           <h2 className="accordion-header">
//             <button
//               className="accordion-button collapsed"
//               type="button"
//               data-bs-toggle="collapse"
//               data-bs-target="#filterFinish"
//             >
//               Finish
//             </button>
//           </h2>

//           <div id="filterFinish" className="accordion-collapse collapse">
//             <div className="accordion-body">
//               <select
//                 className="form-select"
//                 value={filters.finish || ""}
//                 onChange={(e) => handleFilterChange("finish", e.target.value)}
//               >
//                 <option value="">All</option>

//                 {finishes.map((f) => (
//                   <option key={f.slug} value={f.slug}>
//                     {f.name}
//                   </option>
//                 ))}

//               </select>
//             </div>
//           </div>
//         </div>


//         {/* Ingredients */}
//         <div className="accordion-item">

//           <h2 className="accordion-header">
//             <button
//               className="accordion-button collapsed"
//               type="button"
//               data-bs-toggle="collapse"
//               data-bs-target="#filterIngredient"
//             >
//               Ingredients
//             </button>
//           </h2>

//           <div id="filterIngredient" className="accordion-collapse collapse">

//             <div className="accordion-body">

//               <select
//                 className="form-select"
//                 value={filters.ingredient || ""}
//                 onChange={(e) => handleFilterChange("ingredient", e.target.value)}
//               >

//                 <option value="">All</option>

//                 {ingredients.map((i) => (
//                   <option key={i.slug} value={i.slug}>
//                     {i.name}
//                   </option>
//                 ))}

//               </select>

//             </div>
//           </div>
//         </div>




//         {/* Discount Range */}
//         <div className="accordion-item">

//           <h2 className="accordion-header">
//             <button
//               className="accordion-button collapsed"
//               type="button"
//               data-bs-toggle="collapse"
//               data-bs-target="#filterDiscountRange"
//             >
//               Discount
//             </button>
//           </h2>

//           <div id="filterDiscountRange" className="accordion-collapse collapse">

//             <div className="accordion-body">

//               <select
//                 className="form-select"
//                 value={filters.discountRange ? JSON.stringify(filters.discountRange) : ""}
//                 onChange={(e) => {
//                   const val = e.target.value ? JSON.parse(e.target.value) : null;
//                   handleFilterChange("discountRange", val);
//                 }}
//               >

//                 <option value="">All</option>

//                 {discountRanges.map((d, idx) => (
//                   <option key={idx} value={JSON.stringify({ min: d.min })}>
//                     {d.label}
//                   </option>
//                 ))}

//               </select>

//             </div>
//           </div>
//         </div>











//         {/* Price Range */}
//         <div className="accordion-item">
//           <h2 className="accordion-header">
//             <button
//               className="accordion-button collapsed page-title-main-name"
//               type="button"
//               data-bs-toggle="collapse"
//               data-bs-target="#filterPrice"
//             >
//               Price Range
//             </button>
//           </h2>
//           <div id="filterPrice" className="accordion-collapse collapse">
//             <div className="accordion-body">
//               <select
//                 className="form-select page-title-main-name"
//                 value={
//                   filters.priceRange
//                     ? JSON.stringify(filters.priceRange)
//                     : ""
//                 }
//                 onChange={(e) => {
//                   const value = e.target.value
//                     ? JSON.parse(e.target.value)
//                     : null;
//                   handleFilterChange("priceRange", value);
//                 }}
//               >
//                 <option value="">All</option>
//                 {priceRanges.map((pr, idx) => (
//                   <option
//                     key={idx}
//                     value={JSON.stringify({ min: pr.min, max: pr.max })}
//                   >
//                     {pr.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Minimum Rating */}
//         <div className="accordion-item">
//           <h2 className="accordion-header">
//             <button
//               className="accordion-button collapsed page-title-main-name"
//               type="button"
//               data-bs-toggle="collapse"
//               data-bs-target="#filterRating"
//             >
//               Minimum Rating
//             </button>
//           </h2>
//           <div id="filterRating" className="accordion-collapse collapse">
//             <div className="accordion-body">
//               <select
//                 className="form-select page-title-main-name"
//                 value={filters.minRating || ""}
//                 onChange={(e) =>
//                   handleFilterChange("minRating", e.target.value)
//                 }
//               >
//                 <option value="">All</option>
//                 {[5, 4, 3, 2, 1].map((r) => (
//                   <option key={r} value={r}>
//                     {r}★ & up
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Discount */}
//         <div className="accordion-item">
//           <h2 className="accordion-header">
//             <button
//               className="accordion-button collapsed page-title-main-name"
//               type="button"
//               data-bs-toggle="collapse"
//               data-bs-target="#filterDiscount"
//             >
//               Discount
//             </button>
//           </h2>
//           <div id="filterDiscount" className="accordion-collapse collapse">
//             <div className="accordion-body">
//               <select
//                 className="form-select page-title-main-name"
//                 value={filters.discountSort || ""}
//                 onChange={(e) =>
//                   handleFilterChange("discountSort", e.target.value)
//                 }
//               >
//                 <option value="">Default</option>
//                 <option value="high">Highest First</option>
//                 <option value="low">Lowest First</option>
//               </select>
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>

//   );
// };

// export default BrandFilter;










// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useLocation } from "react-router-dom";
// import { FaTimes } from "react-icons/fa";

// const BrandFilter = ({ filters, setFilters, onClose, currentPage = "" }) => {
//   const [filterData, setFilterData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const location = useLocation();

//   useEffect(() => {
//     const fetchFilterData = async () => {
//       try {
//         const res = await axios.get(
//           "https://beauty.joyory.com/api/user/products/filters"
//         );
//         setFilterData(res.data);
//       } catch (err) {
//         console.error("❌ Error fetching filter data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFilterData();
//   }, []);

//   if (loading) return <p>Loading filters...</p>;
//   if (!filterData) return <p>Unable to load filters.</p>;

//   const {
//     brands = [],
//     categories = [],
//     skinTypes = [],
//     formulations = [],
//     finishes = [],
//     ingredients = [],
//     priceRanges = [],
//     discountRanges = [],
//     sortOptions = [],
//   } = filterData?.filters || {};

//   const handleFilterChange = (key, value) => {
//     setFilters({ ...filters, [key]: value });
//   };

//   const handleClearFilters = () => {
//     setFilters({
//       brand: "",
//       category: "",
//       skinType: "",
//       formulation: "",
//       finish: "",
//       ingredient: "",
//       priceRange: null,
//       discountRange: null,
//       minRating: "",
//       sort: "recent",
//       discountSort: "",
//     });
//   };

//   // Helper to remove individual filter
//   const removeFilter = (key) => {
//     const defaultValues = {
//       brand: "",
//       category: "",
//       skinType: "",
//       formulation: "",
//       finish: "",
//       ingredient: "",
//       priceRange: null,
//       discountRange: null,
//       minRating: "",
//       sort: "recent",
//       discountSort: "",
//     };
//     setFilters({ ...filters, [key]: defaultValues[key] });
//   };

//   // Helper to get display name for filter value
//   const getFilterDisplayName = (key, value) => {
//     if (!value || value === "") return null;

//     switch (key) {
//       case "brand":
//         const brand = brands.find(b => b._id === value);
//         return brand ? brand.name : value;
//       case "category":
//         const category = categories.find(c => c._id === value);
//         return category ? category.name : value;
//       case "skinType":
//         const skinType = skinTypes.find(st => st._id === value);
//         return skinType ? skinType.name : value;
//       case "formulation":
//         const formulation = formulations.find(f => f._id === value);
//         return formulation ? formulation.name : value;
//       case "finish":
//         const finish = finishes.find(f => f.slug === value);
//         return finish ? finish.name : value;
//       case "ingredient":
//         const ingredient = ingredients.find(i => i.slug === value);
//         return ingredient ? ingredient.name : value;
//       case "priceRange":
//         try {
//           const range = typeof value === 'string' ? JSON.parse(value) : value;
//           const priceRange = priceRanges.find(pr => pr.min === range?.min && pr.max === range?.max);
//           return priceRange ? priceRange.label : `₹${range?.min || 0} - ₹${range?.max || 'above'}`;
//         } catch {
//           return "Price Range";
//         }
//       case "discountRange":
//         try {
//           const range = typeof value === 'string' ? JSON.parse(value) : value;
//           const discountRange = discountRanges.find(dr => dr.min === range?.min);
//           return discountRange ? discountRange.label : `${range?.min}%+ Off`;
//         } catch {
//           return "Discount";
//         }
//       case "minRating":
//         return `${value}★ & up`;
//       case "discountSort":
//         return value === "high" ? "Highest Discount" : value === "low" ? "Lowest Discount" : null;
//       case "sort":
//         const sortOpt = sortOptions.find(s => s.value === value);
//         return sortOpt ? sortOpt.label : value;
//       default:
//         return value;
//     }
//   };

//   // Get all active filters
//   const getActiveFilters = () => {
//     const active = [];
//     Object.entries(filters).forEach(([key, value]) => {
//       if (value && value !== "" && value !== "recent" && value !== null) {
//         const displayName = getFilterDisplayName(key, value);
//         if (displayName) {
//           active.push({ key, label: key, displayName });
//         }
//       }
//     });
//     return active;
//   };

//   const activeFilters = getActiveFilters();

//   const hideBrandFilter = currentPage === "brand";
//   const hideCategoryFilter = location.pathname.includes("/category");
//   const hideSkinTypeFilter = location.pathname.includes("/skintype");

//   const isCartPage = location.pathname === "/cartpage";
//   const columnClass = isCartPage ? "d-none" : "col-0 col-lg-0";

//   return (
//     <div className="filter-wrapper border" style={{ position: 'sticky', top: '140px' }}>
//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center p-3">
//         <h6 className="fw-bold mb-0 page-title-main-name">Filters</h6>
//         <button
//           className="bg-transparent border-0 text-decoration-none text-muted p-0 page-title-main-name"
//           onClick={handleClearFilters}
//         >
//           Reset
//         </button>
//       </div>

//       {/* Selected Filters Section */}
//       {activeFilters.length > 0 && (
//         <div className="selected-filters-section px-3 pb-3 border-bottom">
//           <div className="d-flex justify-content-between align-items-center mb-2">
//             <small className="text-muted fw-semibold">Selected Filters</small>
//             <button
//               className="btn btn-link btn-sm p-0 text-danger"
//               onClick={handleClearFilters}
//               style={{ fontSize: '12px', textDecoration: 'none' }}
//             >
//               Clear All
//             </button>
//           </div>
//           <div className="selected-filters-container" style={{ 
//             display: 'flex', 
//             flexWrap: 'wrap', 
//             gap: '8px',
//             maxHeight: '150px',
//             overflowY: 'auto'
//           }}>
//             {activeFilters.map((filter) => (
//               <span
//                 key={filter.key}
//                 className="selected-filter-tag"
//                 style={{
//                   display: 'inline-flex',
//                   alignItems: 'center',
//                   gap: '6px',
//                   padding: '6px 12px',
//                   backgroundColor: '#000',
//                   color: '#fff',
//                   borderRadius: '20px',
//                   fontSize: '12px',
//                   fontWeight: '500',
//                   cursor: 'pointer',
//                   transition: 'all 0.2s ease'
//                 }}
//                 onClick={() => removeFilter(filter.key)}
//                 title={`Remove ${filter.label}`}
//               >
//                 {filter.displayName}
//                 <FaTimes size={10} style={{ marginLeft: '2px' }} />
//               </span>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Accordion */}
//       <div className="accordion mb-0 accordion-flush border-none" id="filterAccordion">

//         {/* Category */}
//         {!hideCategoryFilter && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button
//                 className="accordion-button collapsed"
//                 type="button"
//                 data-bs-toggle="collapse"
//                 data-bs-target="#filterFinish"
//               >
//                 Finish
//               </button>
//             </h2>

//             <div id="filterFinish" className="accordion-collapse collapse">
//               <div className="accordion-body">
//                 <select
//                   className="form-select"
//                   value={filters.finish || ""}
//                   onChange={(e) => handleFilterChange("finish", e.target.value)}
//                 >
//                   <option value="">All</option>

//                   {finishes.map((f) => (
//                     <option key={f.slug} value={f.slug}>
//                       {f.name}
//                     </option>
//                   ))}

//                 </select>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Brand */}
//         {!hideBrandFilter && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button
//                 className="accordion-button collapsed page-title-main-name"
//                 type="button"
//                 data-bs-toggle="collapse"
//                 data-bs-target="#filterBrand"
//               >
//                 Brand
//               </button>
//             </h2>
//             <div id="filterBrand" className="accordion-collapse collapse">
//               <div className="accordion-body">
//                 <select
//                   className="form-select page-title-main-name"
//                   value={filters.brand || ""}
//                   onChange={(e) =>
//                     handleFilterChange("brand", e.target.value)
//                   }
//                 >
//                   <option value="">All</option>
//                   {brands.map((b) => (
//                     <option key={b._id} value={b._id}>
//                       {b.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Skin Type */}
//         {!hideSkinTypeFilter && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button
//                 className="accordion-button collapsed page-title-main-name"
//                 type="button"
//                 data-bs-toggle="collapse"
//                 data-bs-target="#filterSkinType"
//               >
//                 Skin Type
//               </button>
//             </h2>
//             <div id="filterSkinType" className="accordion-collapse collapse">
//               <div className="accordion-body">
//                 <select
//                   className="form-select page-title-main-name"
//                   value={filters.skinType || ""}
//                   onChange={(e) =>
//                     handleFilterChange("skinType", e.target.value)
//                   }
//                 >
//                   <option value="">All</option>
//                   {skinTypes.map((st) => (
//                     <option key={st._id} value={st._id}>
//                       {st.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Formulation */}
//         <div className="accordion-item">
//           <h2 className="accordion-header">
//             <button
//               className="accordion-button collapsed page-title-main-name"
//               type="button"
//               data-bs-toggle="collapse"
//               data-bs-target="#filterFormulation"
//             >
//               Formulation
//             </button>
//           </h2>
//           <div id="filterFormulation" className="accordion-collapse collapse">
//             <div className="accordion-body">
//               <select
//                 className="form-select page-title-main-name"
//                 value={filters.formulation || ""}
//                 onChange={(e) =>
//                   handleFilterChange("formulation", e.target.value)
//                 }
//               >
//                 <option value="">All</option>
//                 {formulations.map((f) => (
//                   <option key={f._id} value={f._id}>
//                     {f.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Finish */}
//         <div className="accordion-item">
//           <h2 className="accordion-header">
//             <button
//               className="accordion-button collapsed"
//               type="button"
//               data-bs-toggle="collapse"
//               data-bs-target="#filterFinish"
//             >
//               Finish
//             </button>
//           </h2>

//           <div id="filterFinish" className="accordion-collapse collapse">
//             <div className="accordion-body">
//               <select
//                 className="form-select"
//                 value={filters.finish || ""}
//                 onChange={(e) => handleFilterChange("finish", e.target.value)}
//               >
//                 <option value="">All</option>

//                 {finishes.map((f) => (
//                   <option key={f.slug} value={f.slug}>
//                     {f.name}
//                   </option>
//                 ))}

//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Ingredients */}
//         <div className="accordion-item">

//           <h2 className="accordion-header">
//             <button
//               className="accordion-button collapsed"
//               type="button"
//               data-bs-toggle="collapse"
//               data-bs-target="#filterIngredient"
//             >
//               Ingredients
//             </button>
//           </h2>

//           <div id="filterIngredient" className="accordion-collapse collapse">

//             <div className="accordion-body">

//               <select
//                 className="form-select"
//                 value={filters.ingredient || ""}
//                 onChange={(e) => handleFilterChange("ingredient", e.target.value)}
//               >

//                 <option value="">All</option>

//                 {ingredients.map((i) => (
//                   <option key={i.slug} value={i.slug}>
//                     {i.name}
//                   </option>
//                 ))}

//               </select>

//             </div>
//           </div>
//         </div>

//         {/* Discount Range */}
//         <div className="accordion-item">

//           <h2 className="accordion-header">
//             <button
//               className="accordion-button collapsed"
//               type="button"
//               data-bs-toggle="collapse"
//               data-bs-target="#filterDiscountRange"
//             >
//               Discount
//             </button>
//           </h2>

//           <div id="filterDiscountRange" className="accordion-collapse collapse">

//             <div className="accordion-body">

//               <select
//                 className="form-select"
//                 value={filters.discountRange ? JSON.stringify(filters.discountRange) : ""}
//                 onChange={(e) => {
//                   const val = e.target.value ? JSON.parse(e.target.value) : null;
//                   handleFilterChange("discountRange", val);
//                 }}
//               >

//                 <option value="">All</option>

//                 {discountRanges.map((d, idx) => (
//                   <option key={idx} value={JSON.stringify({ min: d.min })}>
//                     {d.label}
//                   </option>
//                 ))}

//               </select>

//             </div>
//           </div>
//         </div>

//         {/* Price Range */}
//         <div className="accordion-item">
//           <h2 className="accordion-header">
//             <button
//               className="accordion-button collapsed page-title-main-name"
//               type="button"
//               data-bs-toggle="collapse"
//               data-bs-target="#filterPrice"
//             >
//               Price Range
//             </button>
//           </h2>
//           <div id="filterPrice" className="accordion-collapse collapse">
//             <div className="accordion-body">
//               <select
//                 className="form-select page-title-main-name"
//                 value={
//                   filters.priceRange
//                     ? JSON.stringify(filters.priceRange)
//                     : ""
//                 }
//                 onChange={(e) => {
//                   const value = e.target.value
//                     ? JSON.parse(e.target.value)
//                     : null;
//                   handleFilterChange("priceRange", value);
//                 }}
//               >
//                 <option value="">All</option>
//                 {priceRanges.map((pr, idx) => (
//                   <option
//                     key={idx}
//                     value={JSON.stringify({ min: pr.min, max: pr.max })}
//                   >
//                     {pr.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Minimum Rating */}
//         <div className="accordion-item">
//           <h2 className="accordion-header">
//             <button
//               className="accordion-button collapsed page-title-main-name"
//               type="button"
//               data-bs-toggle="collapse"
//               data-bs-target="#filterRating"
//             >
//               Minimum Rating
//             </button>
//           </h2>
//           <div id="filterRating" className="accordion-collapse collapse">
//             <div className="accordion-body">
//               <select
//                 className="form-select page-title-main-name"
//                 value={filters.minRating || ""}
//                 onChange={(e) =>
//                   handleFilterChange("minRating", e.target.value)
//                 }
//               >
//                 <option value="">All</option>
//                 {[5, 4, 3, 2, 1].map((r) => (
//                   <option key={r} value={r}>
//                     {r}★ & up
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Discount */}
//         <div className="accordion-item">
//           <h2 className="accordion-header">
//             <button
//               className="accordion-button collapsed page-title-main-name"
//               type="button"
//               data-bs-toggle="collapse"
//               data-bs-target="#filterDiscount"
//             >
//               Discount
//             </button>
//           </h2>
//           <div id="filterDiscount" className="accordion-collapse collapse">
//             <div className="accordion-body">
//               <select
//                 className="form-select page-title-main-name"
//                 value={filters.discountSort || ""}
//                 onChange={(e) =>
//                   handleFilterChange("discountSort", e.target.value)
//                 }
//               >
//                 <option value="">Default</option>
//                 <option value="high">Highest First</option>
//                 <option value="low">Lowest First</option>
//               </select>
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default BrandFilter;

















// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useLocation } from "react-router-dom";
// import { FaTimes } from "react-icons/fa";

// const BrandFilter = ({ filters, setFilters, onClose, currentPage = "" }) => {
//   const [filterData, setFilterData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const location = useLocation();

//   useEffect(() => {
//     const fetchFilterData = async () => {
//       try {
//         const res = await axios.get("https://beauty.joyory.com/api/user/products/filters");
//         setFilterData(res.data);
//       } catch (err) {
//         console.error("❌ Error fetching filter data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFilterData();
//   }, []);

//   if (loading) return <p>Loading filters...</p>;
//   if (!filterData) return <p>Unable to load filters.</p>;

//   const {
//     brands = [],
//     categories = [],
//     skinTypes = [],
//     formulations = [],
//     finishes = [],
//     ingredients = [],
//     priceRanges = [],
//     discountRanges = [],
//   } = filterData?.filters || {};

//   // ────────────────────────────────────────────────
//   //  Helpers
//   // ────────────────────────────────────────────────

//   const toggleInArray = (arr = [], value) =>
//     arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

//   const handleMultiChange = (key, value) => {
//     setFilters((prev) => ({
//       ...prev,
//       [key]: toggleInArray(prev[key] || [], value),
//     }));
//   };

//   const handleSingleChange = (key, value) => {
//     setFilters((prev) => ({ ...prev, [key]: value }));
//   };

//   const clearAll = () => {
//     setFilters({
//       brandIds: [],
//       categoryIds: [],
//       skinTypes: [],
//       formulations: [],
//       finishes: [],
//       ingredients: [],
//       priceRange: null,
//       discountRange: null,
//       minRating: "",
//       sort: "recent",
//       discountSort: "",
//     });
//   };

//   const removeSingleValue = (key, val) => {
//     setFilters((prev) => ({
//       ...prev,
//       [key]: (prev[key] || []).filter((v) => v !== val),
//     }));
//   };

//   const getDisplayName = (key, val) => {
//     if (!val) return "";

//     switch (key) {
//       case "brandIds":
//         return brands.find((b) => b._id === val)?.name || val;
//       case "skinTypes":
//         return skinTypes.find((s) => s._id === val)?.name || val;
//       case "formulations":
//         return formulations.find((f) => f._id === val)?.name || val;
//       case "finishes":
//         return finishes.find((f) => f.slug === val)?.name || val;
//       case "ingredients":
//         return ingredients.find((i) => i.slug === val)?.name || val;
//       case "priceRange":
//         try {
//           const r = val;
//           const match = priceRanges.find((p) => p.min === r.min && p.max === r.max);
//           return match?.label || `₹${r.min} - ₹${r.max || "above"}`;
//         } catch {
//           return "Price";
//         }
//       case "discountRange":
//         try {
//           const r = val;
//           const match = discountRanges.find((d) => d.min === r.min);
//           return match?.label || `${r.min}%+ Off`;
//         } catch {
//           return "Discount";
//         }
//       case "minRating":
//         return `${val}★ & up`;
//       case "sort":
//         return val === "recent" ? "" : val;
//       case "discountSort":
//         return val ? (val === "high" ? "Highest Discount" : "Lowest Discount") : "";
//       default:
//         return val;
//     }
//   };

//   const getActiveChips = () => {
//     const chips = [];

//     // Multi filters
//     (["brandIds", "skinTypes", "formulations", "finishes", "ingredients"]).forEach((k) => {
//       (filters[k] || []).forEach((v) => {
//         const label = getDisplayName(k, v);
//         if (label) chips.push({ group: k, value: v, label });
//       });
//     });

//     // Single filters
//     if (filters.priceRange) {
//       chips.push({ group: "priceRange", label: getDisplayName("priceRange", filters.priceRange) });
//     }
//     if (filters.discountRange) {
//       chips.push({ group: "discountRange", label: getDisplayName("discountRange", filters.discountRange) });
//     }
//     if (filters.minRating) {
//       chips.push({ group: "minRating", label: getDisplayName("minRating", filters.minRating) });
//     }
//     if (filters.sort && filters.sort !== "recent") {
//       chips.push({ group: "sort", label: getDisplayName("sort", filters.sort) });
//     }
//     if (filters.discountSort) {
//       chips.push({ group: "discountSort", label: getDisplayName("discountSort", filters.discountSort) });
//     }

//     return chips.filter((c) => c.label);
//   };

//   const activeChips = getActiveChips();

//   const hideBrand = currentPage === "brand";
//   const hideCategory = location.pathname.includes("/category");
//   const hideSkinType = location.pathname.includes("/skintype");

//   // ────────────────────────────────────────────────
//   //  Render
//   // ────────────────────────────────────────────────

//   return (
//     <div className="filter-wrapper border" style={{ position: "sticky", top: "140px" }}>
//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center p-3">
//         <h6 className="fw-bold mb-0">Filters</h6>
//         <button className="btn btn-link text-muted p-0" onClick={clearAll}>
//           Reset
//         </button>
//       </div>

//       {/* Selected filters */}
//       {activeChips.length > 0 && (
//         <div className="px-3 pb-3 border-bottom">
//           <div className="d-flex justify-content-between mb-2">
//             <small className="text-muted fw-semibold">Selected</small>
//             <button className="btn btn-link btn-sm text-danger p-0" onClick={clearAll}>
//               Clear All
//             </button>
//           </div>
//           <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", maxHeight: "140px", overflowY: "auto" , marginTop:"20px" , marginLeft:"20px" , marginRight:"20px"}}>
//             {activeChips.map((chip) => (
//               <span
//                 key={`${chip.group}-${chip.value || "s"}`}
//                 className="badge bg-dark text-white rounded-pill px-3 py-2 d-flex align-items-center gap-2"
//                 style={{ fontSize: "13px", cursor: "pointer" }}
//                 onClick={() =>
//                   chip.value
//                     ? removeSingleValue(chip.group, chip.value)
//                     : setFilters((prev) => ({ ...prev, [chip.group]: null }))
//                 }
//               >
//                 {chip.label}
//                 <FaTimes size={12} />
//               </span>
//             ))}
//           </div>
//         </div>
//       )}

//       <div className="accordion accordion-flush" id="filterAccordion">
//         {/* Brands */}
//         {!hideBrand && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#brands">
//                 Brand
//               </button>
//             </h2>
//             <div id="brands" className="accordion-collapse collapse">
//               <div className="accordion-body" style={{ maxHeight: "240px", overflowY: "auto" }}>
//                 {brands.map((b) => (
//                   <div key={b._id} className="form-check mb-1">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`brand-${b._id}`}
//                       checked={(filters.brandIds || []).includes(b._id)}
//                       onChange={() => handleMultiChange("brandIds", b._id)}
//                     />
//                     <label className="form-check-label" htmlFor={`brand-${b._id}`}>
//                       {b.name}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Skin Types */}
//         {!hideSkinType && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#skintypes">
//                 Skin Type
//               </button>
//             </h2>
//             <div id="skintypes" className="accordion-collapse collapse">
//               <div className="accordion-body" style={{ maxHeight: "240px", overflowY: "auto" }}>
//                 {skinTypes.map((st) => (
//                   <div key={st._id} className="form-check mb-1">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`st-${st._id}`}
//                       checked={(filters.skinTypes || []).includes(st._id)}
//                       onChange={() => handleMultiChange("skinTypes", st._id)}
//                     />
//                     <label className="form-check-label" htmlFor={`st-${st._id}`}>
//                       {st.name}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Formulations */}
//         <div className="accordion-item">
//           <h2 className="accordion-header">
//             <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#formulations">
//               Formulation
//             </button>
//           </h2>
//           <div id="formulations" className="accordion-collapse collapse">
//             <div className="accordion-body" style={{ maxHeight: "240px", overflowY: "auto" }}>
//               {formulations.map((f) => (
//                 <div key={f._id} className="form-check mb-1">
//                   <input
//                     className="form-check-input"
//                     type="checkbox"
//                     id={`form-${f._id}`}
//                     checked={(filters.formulations || []).includes(f._id)}
//                     onChange={() => handleMultiChange("formulations", f._id)}
//                   />
//                   <label className="form-check-label" htmlFor={`form-${f._id}`}>
//                     {f.name}
//                   </label>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Finishes */}
//         <div className="accordion-item">
//           <h2 className="accordion-header">
//             <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#finishes">
//               Finish
//             </button>
//           </h2>
//           <div id="finishes" className="accordion-collapse collapse">
//             <div className="accordion-body">
//               {finishes.map((f) => (
//                 <div key={f.slug} className="form-check mb-1">
//                   <input
//                     className="form-check-input"
//                     type="checkbox"
//                     id={`fin-${f.slug}`}
//                     checked={(filters.finishes || []).includes(f.slug)}
//                     onChange={() => handleMultiChange("finishes", f.slug)}
//                   />
//                   <label className="form-check-label" htmlFor={`fin-${f.slug}`}>
//                     {f.name}
//                   </label>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Ingredients */}
//         <div className="accordion-item">
//           <h2 className="accordion-header">
//             <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#ingredients">
//               Key Ingredient
//             </button>
//           </h2>
//           <div id="ingredients" className="accordion-collapse collapse">
//             <div className="accordion-body" style={{ maxHeight: "240px", overflowY: "auto" }}>
//               {ingredients.map((i) => (
//                 <div key={i.slug} className="form-check mb-1">
//                   <input
//                     className="form-check-input"
//                     type="checkbox"
//                     id={`ing-${i.slug}`}
//                     checked={(filters.ingredients || []).includes(i.slug)}
//                     onChange={() => handleMultiChange("ingredients", i.slug)}
//                   />
//                   <label className="form-check-label" htmlFor={`ing-${i.slug}`}>
//                     {i.name}
//                   </label>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Price Range (single select kept) */}
//         <div className="accordion-item">
//           <h2 className="accordion-header">
//             <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#price">
//               Price Range
//             </button>
//           </h2>
//           <div id="price" className="accordion-collapse collapse">
//             <div className="accordion-body">
//               <select
//                 className="form-select"
//                 value={filters.priceRange ? JSON.stringify(filters.priceRange) : ""}
//                 onChange={(e) => {
//                   handleSingleChange("priceRange", e.target.value ? JSON.parse(e.target.value) : null);
//                 }}
//               >
//                 <option value="">All prices</option>
//                 {priceRanges.map((p, i) => (
//                   <option key={i} value={JSON.stringify({ min: p.min, max: p.max })}>
//                     {p.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Discount Range */}
//         <div className="accordion-item">
//           <h2 className="accordion-header">
//             <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#discount">
//               Discount
//             </button>
//           </h2>
//           <div id="discount" className="accordion-collapse collapse">
//             <div className="accordion-body">
//               <select
//                 className="form-select"
//                 value={filters.discountRange ? JSON.stringify(filters.discountRange) : ""}
//                 onChange={(e) => {
//                   handleSingleChange("discountRange", e.target.value ? JSON.parse(e.target.value) : null);
//                 }}
//               >
//                 <option value="">Any discount</option>
//                 {discountRanges.map((d, i) => (
//                   <option key={i} value={JSON.stringify({ min: d.min })}>
//                     {d.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Min Rating */}
//         <div className="accordion-item">
//           <h2 className="accordion-header">
//             <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#rating">
//               Minimum Rating
//             </button>
//           </h2>
//           <div id="rating" className="accordion-collapse collapse">
//             <div className="accordion-body">
//               <select
//                 className="form-select"
//                 value={filters.minRating || ""}
//                 onChange={(e) => handleSingleChange("minRating", e.target.value)}
//               >
//                 <option value="">Any rating</option>
//                 {[4, 3, 2].map((r) => (
//                   <option key={r} value={r}>
//                     {r}+ Stars
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BrandFilter;





















// // BrandFilter code
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useLocation } from "react-router-dom";
// import { FaTimes } from "react-icons/fa";

// const BrandFilter = ({ filters, setFilters, onClose, currentPage = "" }) => {
//   const [filterData, setFilterData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const location = useLocation();

//   useEffect(() => {
//     const fetchFilterData = async () => {
//       try {
//         const res = await axios.get("https://beauty.joyory.com/api/user/products/filters");
//         setFilterData(res.data);
//       } catch (err) {
//         console.error("❌ Error fetching filter data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFilterData();
//   }, []);

//   if (loading) return <p>Loading filters...</p>;
//   if (!filterData) return <p>Unable to load filters.</p>;

//   const {
//     brands = [],
//     categories = [],
//     skinTypes = [],
//     formulations = [],
//     finishes = [],
//     ingredients = [],
//     priceRanges = [],
//     discountRanges = [],
//   } = filterData?.filters || {};

//   // ────────────────────────────────────────────────
//   //  Helpers
//   // ────────────────────────────────────────────────

//   const toggleInArray = (arr = [], value) =>
//     arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

//   const handleMultiChange = (key, value) => {
//     setFilters((prev) => ({
//       ...prev,
//       [key]: toggleInArray(prev[key] || [], value),
//     }));
//   };

//   const handleSingleChange = (key, value) => {
//     setFilters((prev) => ({ ...prev, [key]: value }));
//   };

//   const clearAll = () => {
//     setFilters({
//       brandIds: [],
//       categoryIds: [],
//       skinTypes: [],
//       formulations: [],
//       finishes: [],
//       ingredients: [],
//       priceRange: null,
//       discountRange: null,
//       minRating: "",
//       sort: "recent",
//     });
//   };

//   const removeSingleValue = (key, val) => {
//     setFilters((prev) => ({
//       ...prev,
//       [key]: (prev[key] || []).filter((v) => v !== val),
//     }));
//   };

//   const getDisplayName = (key, val) => {
//     if (!val) return "";

//     switch (key) {
//       case "brandIds":
//         return brands.find((b) => b._id === val || b.slug === val)?.name || val;
//       case "skinTypes":
//         return skinTypes.find((s) => s.name === val)?.name || val;
//       case "formulations":
//         return formulations.find((f) => f._id === val)?.name || val;
//       case "finishes":
//         return finishes.find((f) => f.slug === val)?.name || val;
//       case "ingredients":
//         return ingredients.find((i) => i.slug === val)?.name || val;
//       case "priceRange":
//         try {
//           const r = val;
//           const match = priceRanges.find((p) => p.min === r.min && p.max === r.max);
//           return match?.label || `₹${r.min} - ₹${r.max || "above"}`;
//         } catch {
//           return "Price";
//         }
//       case "discountRange":
//         try {
//           const r = val;
//           const match = discountRanges.find((d) => d.min === r.min);
//           return match?.label || `${r.min}%+ Off`;
//         } catch {
//           return "Discount";
//         }
//       case "minRating":
//         return `${val}★ & up`;
//       case "sort":
//         return val === "recent" ? "" : val;
//       default:
//         return val;
//     }
//   };

//   const getActiveChips = () => {
//     const chips = [];

//     (["brandIds", "skinTypes", "formulations", "finishes", "ingredients"]).forEach((k) => {
//       (filters[k] || []).forEach((v) => {
//         const label = getDisplayName(k, v);
//         if (label) chips.push({ group: k, value: v, label });
//       });
//     });

//     if (filters.priceRange) {
//       chips.push({ group: "priceRange", label: getDisplayName("priceRange", filters.priceRange) });
//     }
//     if (filters.discountRange) {
//       chips.push({ group: "discountRange", label: getDisplayName("discountRange", filters.discountRange) });
//     }
//     if (filters.minRating) {
//       chips.push({ group: "minRating", label: getDisplayName("minRating", filters.minRating) });
//     }
//     if (filters.sort && filters.sort !== "recent") {
//       chips.push({ group: "sort", label: getDisplayName("sort", filters.sort) });
//     }

//     return chips.filter((c) => c.label);
//   };

//   const activeChips = getActiveChips();

//   const hideBrand = currentPage === "brand";
//   const hideCategory = location.pathname.includes("/category");
//   const hideSkinType = location.pathname.includes("/skintype");

//   // ────────────────────────────────────────────────
//   //  Render
//   // ────────────────────────────────────────────────

//   return (
//     <div className="filter-wrapper border" style={{ position: "sticky", top: "140px" }}>
//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center p-3">
//         <h6 className="fw-bold mb-0">Filters</h6>
//         <button className="btn btn-link text-muted p-0" onClick={clearAll}>
//           Reset
//         </button>
//       </div>

//       {/* Selected filters */}
//       {activeChips.length > 0 && (
//         <div className="px-3 pb-3 border-bottom">
//           <div className="d-flex justify-content-between mb-2">
//             <small className="text-muted fw-semibold">Selected</small>
//             <button className="btn btn-link btn-sm text-danger p-0" onClick={clearAll}>
//               Clear All
//             </button>
//           </div>
//           <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", maxHeight: "140px", overflowY: "auto", marginTop: "20px", marginLeft: "20px", marginRight: "20px" }}>
//             {activeChips.map((chip) => (
//               <span
//                 key={`${chip.group}-${chip.value || "s"}`}
//                 className="badge bg-dark text-white rounded-pill px-3 py-2 d-flex align-items-center gap-2"
//                 style={{ fontSize: "13px", cursor: "pointer" }}
//                 onClick={() =>
//                   chip.value
//                     ? removeSingleValue(chip.group, chip.value)
//                     : setFilters((prev) => ({ ...prev, [chip.group]: null }))
//                 }
//               >
//                 {chip.label}
//                 <FaTimes size={12} />
//               </span>
//             ))}
//           </div>
//         </div>
//       )}

//       <div className="accordion accordion-flush" id="filterAccordion">
//         {/* Brands */}
//         {!hideBrand && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#brands">
//                 Brand
//               </button>
//             </h2>
//             <div id="brands" className="accordion-collapse collapse">
//               <div className="accordion-body" style={{ maxHeight: "240px", overflowY: "auto" }}>
//                 {brands.map((b) => (
//                   <div key={b._id} className="form-check mb-1">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`brand-${b._id}`}
//                       checked={(filters.brandIds || []).includes(b._id)}
//                       onChange={() => handleMultiChange("brandIds", b._id)}
//                     />
//                     <label className="form-check-label" htmlFor={`brand-${b._id}`}>
//                       {b.name} {b.count !== undefined && <span className="text-muted">({b.count})</span>}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Skin Types */}
//         {!hideSkinType && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#skintypes">
//                 Skin Type
//               </button>
//             </h2>
//             <div id="skintypes" className="accordion-collapse collapse">
//               <div className="accordion-body" style={{ maxHeight: "240px", overflowY: "auto" }}>
//                 {skinTypes.map((st) => (
//                   <div key={st._id} className="form-check mb-1">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`st-${st._id}`}
//                       checked={(filters.skinTypes || []).includes(st.name)}
//                       onChange={() => handleMultiChange("skinTypes", st.name)}
//                     />
//                     <label className="form-check-label" htmlFor={`st-${st._id}`}>
//                       {st.name} {st.count !== undefined && <span className="text-muted">({st.count})</span>}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Formulations */}
//         <div className="accordion-item">
//           <h2 className="accordion-header">
//             <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#formulations">
//               Formulation
//             </button>
//           </h2>
//           <div id="formulations" className="accordion-collapse collapse">
//             <div className="accordion-body" style={{ maxHeight: "240px", overflowY: "auto" }}>
//               {formulations.map((f) => (
//                 <div key={f._id} className="form-check mb-1">
//                   <input
//                     className="form-check-input"
//                     type="checkbox"
//                     id={`form-${f._id}`}
//                     checked={(filters.formulations || []).includes(f._id)}
//                     onChange={() => handleMultiChange("formulations", f._id)}
//                   />
//                   <label className="form-check-label" htmlFor={`form-${f._id}`}>
//                     {f.name} {f.count !== undefined && <span className="text-muted">({f.count})</span>}
//                   </label>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Finishes */}
//         <div className="accordion-item">
//           <h2 className="accordion-header">
//             <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#finishes">
//               Finish
//             </button>
//           </h2>
//           <div id="finishes" className="accordion-collapse collapse">
//             <div className="accordion-body">
//               {finishes.map((f) => (
//                 <div key={f.slug} className="form-check mb-1">
//                   <input
//                     className="form-check-input"
//                     type="checkbox"
//                     id={`fin-${f.slug}`}
//                     checked={(filters.finishes || []).includes(f.slug)}
//                     onChange={() => handleMultiChange("finishes", f.slug)}
//                   />
//                   <label className="form-check-label" htmlFor={`fin-${f.slug}`}>
//                     {f.name} {f.count !== undefined && <span className="text-muted">({f.count})</span>}
//                   </label>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Ingredients */}
//         <div className="accordion-item">
//           <h2 className="accordion-header">
//             <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#ingredients">
//               Key Ingredient
//             </button>
//           </h2>
//           <div id="ingredients" className="accordion-collapse collapse">
//             <div className="accordion-body" style={{ maxHeight: "240px", overflowY: "auto" }}>
//               {ingredients.map((i) => (
//                 <div key={i.slug} className="form-check mb-1">
//                   <input
//                     className="form-check-input"
//                     type="checkbox"
//                     id={`ing-${i.slug}`}
//                     checked={(filters.ingredients || []).includes(i.slug)}
//                     onChange={() => handleMultiChange("ingredients", i.slug)}
//                   />
//                   <label className="form-check-label" htmlFor={`ing-${i.slug}`}>
//                     {i.name} {i.count !== undefined && <span className="text-muted">({i.count})</span>}
//                   </label>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Price Range */}
//         <div className="accordion-item">
//           <h2 className="accordion-header">
//             <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#price">
//               Price Range
//             </button>
//           </h2>
//           <div id="price" className="accordion-collapse collapse">
//             <div className="accordion-body">
//               <select
//                 className="form-select"
//                 value={filters.priceRange ? JSON.stringify(filters.priceRange) : ""}
//                 onChange={(e) => {
//                   handleSingleChange("priceRange", e.target.value ? JSON.parse(e.target.value) : null);
//                 }}
//               >
//                 <option value="">All prices</option>
//                 {priceRanges.map((p, i) => (
//                   <option key={i} value={JSON.stringify({ min: p.min, max: p.max })}>
//                     {p.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Discount Range */}
//         <div className="accordion-item">
//           <h2 className="accordion-header">
//             <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#discount">
//               Discount
//             </button>
//           </h2>
//           <div id="discount" className="accordion-collapse collapse">
//             <div className="accordion-body">
//               <select
//                 className="form-select"
//                 value={filters.discountRange ? JSON.stringify(filters.discountRange) : ""}
//                 onChange={(e) => {
//                   handleSingleChange("discountRange", e.target.value ? JSON.parse(e.target.value) : null);
//                 }}
//               >
//                 <option value="">Any discount</option>
//                 {discountRanges.map((d, i) => (
//                   <option key={i} value={JSON.stringify({ min: d.min })}>
//                     {d.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Min Rating */}
//         <div className="accordion-item">
//           <h2 className="accordion-header">
//             <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#rating">
//               Minimum Rating
//             </button>
//           </h2>
//           <div id="rating" className="accordion-collapse collapse">
//             <div className="accordion-body">
//               <select
//                 className="form-select"
//                 value={filters.minRating || ""}
//                 onChange={(e) => handleSingleChange("minRating", e.target.value)}
//               >
//                 <option value="">Any rating</option>
//                 {[4, 3, 2].map((r) => (
//                   <option key={r} value={r}>
//                     {r}+ Stars
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BrandFilter;




















// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useLocation } from "react-router-dom";
// import { FaTimes } from "react-icons/fa";

// const BrandFilter = ({ filters, setFilters, onClose }) => {
//   const [filterData, setFilterData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const location = useLocation();

//   useEffect(() => {
//     const fetchFilterData = async () => {
//       try {
//         const res = await axios.get("https://beauty.joyory.com/api/user/products/filters");
//         setFilterData(res.data);
//       } catch (err) {
//         console.error("❌ Error fetching filter data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFilterData();
//   }, []);

//   if (loading) return <p>Loading filters...</p>;
//   if (!filterData) return <p>Unable to load filters.</p>;

//   const {
//     brands = [],
//     categories = [],
//     skinTypes = [],
//     formulations = [],
//     finishes = [],
//     ingredients = [],
//     priceRanges = [],
//     discountRanges = [],
//   } = filterData?.filters || {};

//   // ────────────────────────────────────────────────
//   //  Helpers
//   // ────────────────────────────────────────────────

//   const toggleInArray = (arr = [], value) =>
//     arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

//   const handleMultiChange = (key, value) => {
//     setFilters((prev) => ({
//       ...prev,
//       [key]: toggleInArray(prev[key] || [], value),
//     }));
//   };

//   const handleSingleChange = (key, value) => {
//     setFilters((prev) => ({ ...prev, [key]: value }));
//   };

//   const clearAll = () => {
//     setFilters({
//       brandIds: [],
//       categoryIds: [],
//       skinTypes: [],
//       formulations: [],
//       finishes: [],
//       ingredients: [],
//       priceRange: null,
//       discountRange: null,
//       minRating: "",
//       sort: "recent",
//     });
//   };

//   const removeSingleValue = (key, val) => {
//     setFilters((prev) => ({
//       ...prev,
//       [key]: (prev[key] || []).filter((v) => v !== val),
//     }));
//   };

//   const getDisplayName = (key, val) => {
//     if (!val) return "";

//     switch (key) {
//       case "brandIds":
//         return brands.find((b) => b._id === val || b.slug === val)?.name || val;
//       case "categoryIds":
//         return categories.find((c) => c._id === val || c.slug === val)?.name || val;
//       case "skinTypes":
//         return skinTypes.find((s) => s.name === val)?.name || val;
//       case "formulations":
//         return formulations.find((f) => f._id === val)?.name || val;
//       case "finishes":
//         return finishes.find((f) => f.slug === val)?.name || val;
//       case "ingredients":
//         return ingredients.find((i) => i.slug === val)?.name || val;
//       case "priceRange":
//         try {
//           const r = val;
//           const match = priceRanges.find((p) => p.min === r.min && p.max === r.max);
//           return match?.label || `₹${r.min} - ₹${r.max || "above"}`;
//         } catch {
//           return "Price";
//         }
//       case "discountRange":
//         try {
//           const r = val;
//           const match = discountRanges.find((d) => d.min === r.min);
//           return match?.label || `${r.min}%+ Off`;
//         } catch {
//           return "Discount";
//         }
//       case "minRating":
//         return `${val}★ & up`;
//       case "sort":
//         return val === "recent" ? "" : val;
//       default:
//         return val;
//     }
//   };

//   const getActiveChips = () => {
//     const chips = [];

//     ["brandIds", "categoryIds", "skinTypes", "formulations", "finishes", "ingredients"].forEach((k) => {
//       (filters[k] || []).forEach((v) => {
//         const label = getDisplayName(k, v);
//         if (label) chips.push({ group: k, value: v, label });
//       });
//     });

//     if (filters.priceRange) {
//       chips.push({ group: "priceRange", label: getDisplayName("priceRange", filters.priceRange) });
//     }
//     if (filters.discountRange) {
//       chips.push({ group: "discountRange", label: getDisplayName("discountRange", filters.discountRange) });
//     }
//     if (filters.minRating) {
//       chips.push({ group: "minRating", label: getDisplayName("minRating", filters.minRating) });
//     }
//     if (filters.sort && filters.sort !== "recent") {
//       chips.push({ group: "sort", label: getDisplayName("sort", filters.sort) });
//     }

//     return chips.filter((c) => c.label);
//   };

//   const activeChips = getActiveChips();

//   // Helper to safely render label with count
//   const renderLabel = (name, count) => (
//     <>
//       {name}
//       {count !== undefined && count !== null && <span className="text-muted small ms-1">({count})</span>}
//     </>
//   );

//   // ────────────────────────────────────────────────
//   //  Render – All sections always visible
//   // ────────────────────────────────────────────────

//   return (
//     <div className="filter-wrapper border" style={{ position: "sticky", top: "140px" }}>
//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center p-3">
//         <h6 className="fw-bold mb-0">Filters</h6>
//         <button className="btn btn-link text-muted p-0" onClick={clearAll}>
//           Reset
//         </button>
//       </div>

//       {/* Selected filters chips */}
//       {activeChips.length > 0 && (
//         <div className="px-3 pb-3 border-bottom">
//           <div className="d-flex justify-content-between mb-2">
//             <small className="text-muted fw-semibold">Selected</small>
//             <button className="btn btn-link btn-sm text-danger p-0" onClick={clearAll}>
//               Clear All
//             </button>
//           </div>
//           <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", maxHeight: "140px", overflowY: "auto", margin: "20px" }}>
//             {activeChips.map((chip) => (
//               <span
//                 key={`${chip.group}-${chip.value || "s"}`}
//                 className="badge bg-dark text-white rounded-pill px-3 py-2 d-flex align-items-center gap-2"
//                 style={{ fontSize: "13px", cursor: "pointer" }}
//                 onClick={() =>
//                   chip.value
//                     ? removeSingleValue(chip.group, chip.value)
//                     : setFilters((prev) => ({ ...prev, [chip.group]: null }))
//                 }
//               >
//                 {chip.label}
//                 <FaTimes size={12} />
//               </span>
//             ))}
//           </div>
//         </div>
//       )}

//       <div className="accordion accordion-flush" id="filterAccordion">
//         {/* Categories */}
//         {categories.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#categories">
//                 Category
//               </button>
//             </h2>
//             <div id="categories" className="accordion-collapse collapse">
//               <div className="accordion-body" style={{ maxHeight: "240px", overflowY: "auto" }}>
//                 {categories.map((c) => (
//                   <div key={c._id} className="form-check mb-1">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`cat-${c._id}`}
//                       checked={(filters.categoryIds || []).includes(c._id)}
//                       onChange={() => handleMultiChange("categoryIds", c._id)}
//                     />
//                     <label className="form-check-label" htmlFor={`cat-${c._id}`}>
//                       {renderLabel(c.name, c.count)}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Brands */}
//         {brands.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#brands">
//                 Brand
//               </button>
//             </h2>
//             <div id="brands" className="accordion-collapse collapse">
//               <div className="accordion-body" style={{ maxHeight: "240px", overflowY: "auto" }}>
//                 {brands.map((b) => (
//                   <div key={b._id} className="form-check mb-1">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`brand-${b._id}`}
//                       checked={(filters.brandIds || []).includes(b._id)}
//                       onChange={() => handleMultiChange("brandIds", b._id)}
//                     />
//                     <label className="form-check-label" htmlFor={`brand-${b._id}`}>
//                       {renderLabel(b.name, b.count)}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Skin Types */}
//         {skinTypes.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#skintypes">
//                 Skin Type
//               </button>
//             </h2>
//             <div id="skintypes" className="accordion-collapse collapse">
//               <div className="accordion-body" style={{ maxHeight: "240px", overflowY: "auto" }}>
//                 {skinTypes.map((st) => (
//                   <div key={st._id || st.name} className="form-check mb-1">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`st-${st._id || st.name}`}
//                       checked={(filters.skinTypes || []).includes(st.name)}
//                       onChange={() => handleMultiChange("skinTypes", st.name)}
//                     />
//                     <label className="form-check-label" htmlFor={`st-${st._id || st.name}`}>
//                       {renderLabel(st.name, st.count)}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Formulations */}
//         {formulations.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#formulations">
//                 Formulation
//               </button>
//             </h2>
//             <div id="formulations" className="accordion-collapse collapse">
//               <div className="accordion-body" style={{ maxHeight: "240px", overflowY: "auto" }}>
//                 {formulations.map((f) => (
//                   <div key={f._id} className="form-check mb-1">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`form-${f._id}`}
//                       checked={(filters.formulations || []).includes(f._id)}
//                       onChange={() => handleMultiChange("formulations", f._id)}
//                     />
//                     <label className="form-check-label" htmlFor={`form-${f._id}`}>
//                       {renderLabel(f.name, f.count)}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Finishes */}
//         {finishes.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#finishes">
//                 Finish
//               </button>
//             </h2>
//             <div id="finishes" className="accordion-collapse collapse">
//               <div className="accordion-body">
//                 {finishes.map((f) => (
//                   <div key={f.slug} className="form-check mb-1">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`fin-${f.slug}`}
//                       checked={(filters.finishes || []).includes(f.slug)}
//                       onChange={() => handleMultiChange("finishes", f.slug)}
//                     />
//                     <label className="form-check-label" htmlFor={`fin-${f.slug}`}>
//                       {renderLabel(f.name, f.count)}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Ingredients */}
//         {ingredients.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#ingredients">
//                 Key Ingredient
//               </button>
//             </h2>
//             <div id="ingredients" className="accordion-collapse collapse">
//               <div className="accordion-body" style={{ maxHeight: "240px", overflowY: "auto" }}>
//                 {ingredients.map((i) => (
//                   <div key={i.slug} className="form-check mb-1">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`ing-${i.slug}`}
//                       checked={(filters.ingredients || []).includes(i.slug)}
//                       onChange={() => handleMultiChange("ingredients", i.slug)}
//                     />
//                     <label className="form-check-label" htmlFor={`ing-${i.slug}`}>
//                       {renderLabel(i.name, i.count)}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Price Range */}
//         <div className="accordion-item">
//           <h2 className="accordion-header">
//             <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#price">
//               Price Range
//             </button>
//           </h2>
//           <div id="price" className="accordion-collapse collapse">
//             <div className="accordion-body">
//               <select
//                 className="form-select"
//                 value={filters.priceRange ? JSON.stringify(filters.priceRange) : ""}
//                 onChange={(e) => {
//                   handleSingleChange("priceRange", e.target.value ? JSON.parse(e.target.value) : null);
//                 }}
//               >
//                 <option value="">All prices</option>
//                 {priceRanges.map((p, i) => (
//                   <option key={i} value={JSON.stringify({ min: p.min, max: p.max })}>
//                     {p.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Discount Range */}
//         <div className="accordion-item">
//           <h2 className="accordion-header">
//             <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#discount">
//               Discount
//             </button>
//           </h2>
//           <div id="discount" className="accordion-collapse collapse">
//             <div className="accordion-body">
//               <select
//                 className="form-select"
//                 value={filters.discountRange ? JSON.stringify(filters.discountRange) : ""}
//                 onChange={(e) => {
//                   handleSingleChange("discountRange", e.target.value ? JSON.parse(e.target.value) : null);
//                 }}
//               >
//                 <option value="">Any discount</option>
//                 {discountRanges.map((d, i) => (
//                   <option key={i} value={JSON.stringify({ min: d.min })}>
//                     {d.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Minimum Rating */}
//         <div className="accordion-item">
//           <h2 className="accordion-header">
//             <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#rating">
//               Minimum Rating
//             </button>
//           </h2>
//           <div id="rating" className="accordion-collapse collapse">
//             <div className="accordion-body">
//               <select
//                 className="form-select"
//                 value={filters.minRating || ""}
//                 onChange={(e) => handleSingleChange("minRating", e.target.value)}
//               >
//                 <option value="">Any rating</option>
//                 {[4, 3, 2].map((r) => (
//                   <option key={r} value={r}>
//                     {r}+ Stars
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BrandFilter;











// import React from "react";
// import { FaTimes } from "react-icons/fa";

// /**
//  * BrandFilter
//  *
//  * Props:
//  *   filters             – current filter state
//  *   setFilters          – update filter state
//  *   onClose             – close mobile offcanvas (optional)
//  *   filterData          – data.filters from the product API response
//  *                         { brands, categories, skinTypes, formulations,
//  *                           finishes, ingredients, priceRanges, discountRanges }
//  *   trendingCategories  – data.trendingCategories from ProductPage.
//  *                         • No filter active  → root/parent categories
//  *                         • Category selected → direct children (sub-categories)
//  *                         • Leaf category     → [] (nothing to show)
//  *                         Shown as clickable pills inside the Category section.
//  *   activeCategorySlug  – currently selected category pill slug
//  *   activeCategoryName  – display name of the selected category (shown as chip)
//  *   onClearCategory     – called when the category chip × is clicked
//  *   onCategoryPillClick – called with { slug, name } when a sub-category pill is clicked
//  */
// const BrandFilter = ({
//   filters,
//   setFilters,
//   onClose,
//   filterData          = null,
//   trendingCategories  = [],
//   activeCategorySlug  = null,
//   activeCategoryName  = "",
//   onClearCategory,
//   onCategoryPillClick,
// }) => {

//   if (!filterData) return (
//     <div className="filter-wrapper border p-3" style={{ position: "sticky", top: "140px" }}>
//       <div className="d-flex align-items-center gap-2">
//         <div className="spinner-border spinner-border-sm text-secondary" role="status" />
//         <small className="text-muted">Loading filters...</small>
//       </div>
//     </div>
//   );

//   const {
//     brands         = [],
//     categories     = [],
//     skinTypes      = [],
//     formulations   = [],
//     finishes       = [],
//     ingredients    = [],
//     priceRanges    = [],
//     discountRanges = [],
//   } = filterData;

//   /* ─── helpers ─────────────────────────────────────────────────────────── */
//   const toggleInArray = (arr = [], value) =>
//     arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

//   const handleMultiChange = (key, value) =>
//     setFilters((prev) => ({ ...prev, [key]: toggleInArray(prev[key] || [], value) }));

//   const handleSingleChange = (key, value) =>
//     setFilters((prev) => ({ ...prev, [key]: value }));

//   const clearAll = () => {
//     setFilters({
//       brandIds: [], categoryIds: [], skinTypes: [], formulations: [],
//       finishes: [], ingredients: [], priceRange: null, discountRange: null,
//       minRating: "", sort: "recent",
//     });
//     if (onClearCategory) onClearCategory();
//   };

//   const removeSingleValue = (key, val) =>
//     setFilters((prev) => ({ ...prev, [key]: (prev[key] || []).filter((v) => v !== val) }));

//   const getDisplayName = (key, val) => {
//     if (!val) return "";
//     switch (key) {
//       case "brandIds":
//         return brands.find((b) => b._id === val || b.slug === val)?.name || val;
//       case "categoryIds":
//         return categories.find((c) => c._id === val || c.slug === val)?.name || val;
//       case "skinTypes":
//         return skinTypes.find((s) => s.name === val)?.name || val;
//       case "formulations":
//         return formulations.find((f) => f._id === val)?.name || val;
//       case "finishes":
//         return finishes.find((f) => f.slug === val)?.name || val;
//       case "ingredients":
//         return ingredients.find((i) => i.slug === val)?.name || val;
//       case "priceRange":
//         try {
//           const match = priceRanges.find((p) => p.min === val.min && p.max === val.max);
//           return match?.label || `₹${val.min} - ₹${val.max || "above"}`;
//         } catch { return "Price"; }
//       case "discountRange":
//         try {
//           const match = discountRanges.find((d) => d.min === val.min);
//           return match?.label || `${val.min}%+ Off`;
//         } catch { return "Discount"; }
//       case "minRating": return `${val}★ & up`;
//       case "sort":      return val === "recent" ? "" : val;
//       default:          return val;
//     }
//   };

//   /* ─── chips ───────────────────────────────────────────────────────────── */
//   const getActiveChips = () => {
//     const chips = [];

//     // Category pill chip (dark) always first
//     if (activeCategorySlug && activeCategoryName) {
//       chips.push({
//         group: "categoryPill",
//         value: activeCategorySlug,
//         label: activeCategoryName,
//         isPill: true,
//       });
//     }

//     ["brandIds", "categoryIds", "skinTypes", "formulations", "finishes", "ingredients"].forEach((k) => {
//       (filters[k] || []).forEach((v) => {
//         const label = getDisplayName(k, v);
//         if (label) chips.push({ group: k, value: v, label });
//       });
//     });

//     if (filters.priceRange)
//       chips.push({ group: "priceRange",    label: getDisplayName("priceRange",    filters.priceRange) });
//     if (filters.discountRange)
//       chips.push({ group: "discountRange", label: getDisplayName("discountRange", filters.discountRange) });
//     if (filters.minRating)
//       chips.push({ group: "minRating",     label: getDisplayName("minRating",     filters.minRating) });
//     if (filters.sort && filters.sort !== "recent")
//       chips.push({ group: "sort",          label: getDisplayName("sort",          filters.sort) });

//     return chips.filter((c) => c.label);
//   };

//   const activeChips = getActiveChips();

//   const renderLabel = (name, count) => (
//     <>
//       {name}
//       {count !== undefined && count !== null && (
//         <span className="text-muted small ms-1">({count})</span>
//       )}
//     </>
//   );

//   const hasActiveFilter =
//     activeCategorySlug ||
//     filters.brandIds?.length > 0 ||
//     filters.categoryIds?.length > 0;

//   /*
//    * Determine what to show in the Category accordion section.
//    *
//    * Backend trendingCategories behaviour (from your backend code):
//    *   • No filter active  → root/parent categories  (show as browseable pills)
//    *   • Category selected → direct children          (show as sub-category pills)
//    *   • Leaf category     → []                       (nothing to show)
//    *
//    * We show trendingCategories as clickable pills inside the Category section.
//    * If a category is active, we also show the "categories" list from filterData
//    * (which the backend already scopes) as checkboxes below the pills.
//    */
//   const subCategoryPills  = trendingCategories; // direct children when a cat is selected
//   const categoryCheckboxes = categories;         // already scoped by backend filterData

//   /* ─── render ──────────────────────────────────────────────────────────── */
//   return (
//     <div className="filter-wrapper border" style={{ position: "sticky", top: "140px" }}>

//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
//         <h6 className="fw-bold mb-0">Filters</h6>
//         {activeChips.length > 0 && (
//           <button className="btn btn-link text-muted p-0 small" onClick={clearAll}>
//             Reset
//           </button>
//         )}
//       </div>

//       {/* Selected chips */}
//       {activeChips.length > 0 && (
//         <div className="px-3 pb-3 pt-2 border-bottom">
//           <div className="d-flex justify-content-between mb-2">
//             <small className="text-muted fw-semibold">Selected</small>
//             <button className="btn btn-link btn-sm text-danger p-0" onClick={clearAll}>
//               Clear All
//             </button>
//           </div>
//           <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", maxHeight: "140px", overflowY: "auto" }}>
//             {activeChips.map((chip) => (
//               <span
//                 key={`${chip.group}-${chip.value || "s"}`}
//                 className={`badge rounded-pill px-3 py-2 d-flex align-items-center gap-1 ${
//                   chip.isPill ? "bg-dark text-white" : "bg-secondary text-white"
//                 }`}
//                 style={{ fontSize: "12px", cursor: "pointer", fontWeight: chip.isPill ? 600 : 400, maxWidth: "100%" }}
//                 title={chip.isPill ? "Remove category filter" : `Remove ${chip.label}`}
//                 onClick={() => {
//                   if (chip.isPill) {
//                     if (onClearCategory) onClearCategory();
//                   } else if (chip.group === "priceRange" || chip.group === "discountRange") {
//                     setFilters((prev) => ({ ...prev, [chip.group]: null }));
//                   } else {
//                     removeSingleValue(chip.group, chip.value);
//                   }
//                 }}
//               >
//                 {chip.isPill && (
//                   <span style={{ fontSize: 10, opacity: 0.75 }}>Category:&nbsp;</span>
//                 )}
//                 <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}>
//                   {chip.label}
//                 </span>
//                 <FaTimes size={10} style={{ flexShrink: 0 }} />
//               </span>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Context note */}
//       {hasActiveFilter && (
//         <div className="px-3 py-2 border-bottom"
//           style={{ background: "#f7f7f7", fontSize: 12, color: "#555", lineHeight: 1.5 }}>
//           Showing filters available for the selected {activeCategorySlug ? "category" : "brand"}
//         </div>
//       )}

//       <div className="accordion accordion-flush" id="filterAccordion">

//         {/* ══════════════════════════════════════════════════════════════════
//             CATEGORY SECTION
//             ─────────────────
//             Shows sub-category pills (trendingCategories) + category checkboxes.

//             State 1 — No category selected:
//               trendingCategories = root categories → shown as pills to browse
//               categoryCheckboxes = all categories  → shown as checkboxes

//             State 2 — Category selected (e.g. "Makeup"):
//               trendingCategories = direct children (e.g. "Lipstick", "Foundation")
//                                    → shown as clickable sub-category pills
//               categoryCheckboxes = already scoped by backend → shown as checkboxes

//             State 3 — Leaf category selected (no children):
//               trendingCategories = [] → pills section hidden
//               categoryCheckboxes = scoped → checkboxes still shown
//         ══════════════════════════════════════════════════════════════════ */}
//         {(subCategoryPills.length > 0 || categoryCheckboxes.length > 0) && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button
//                 className="accordion-button"   /* open by default — category is primary */
//                 type="button"
//                 data-bs-toggle="collapse"
//                 data-bs-target="#categories"
//                 aria-expanded="true"
//               >
//                 Category
//                 {activeCategorySlug && activeCategoryName && (
//                   <span
//                     className="ms-2 text-muted"
//                     style={{ fontSize: 11, fontWeight: 400 }}
//                   >
//                     › {activeCategoryName}
//                   </span>
//                 )}
//               </button>
//             </h2>
//             <div id="categories" className="accordion-collapse collapse show">
//               <div className="accordion-body p-0">

//                 {/* ── Sub-category pills ──────────────────────────────────────
//                     When a category is selected, backend returns its direct
//                     children in trendingCategories. Shown as a scrollable
//                     pill row so the user can drill into a sub-category.
//                     Active pill is highlighted dark.
//                 ─────────────────────────────────────────────────────────── */}
//                 {subCategoryPills.length > 0 && (
//                   <div className="px-3 py-2 border-bottom">
//                     <small className="text-muted d-block mb-2"
//                       style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.4px" }}>
//                       {activeCategorySlug ? "Sub-categories" : "Browse categories"}
//                     </small>
//                     <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
//                       {subCategoryPills.map((cat) => {
//                         const isActive = activeCategorySlug === cat.slug;
//                         return (
//                           <button
//                             key={cat.slug}
//                             type="button"
//                             onClick={() => onCategoryPillClick && onCategoryPillClick(cat)}
//                             className={`btn btn-sm rounded-pill px-3 py-1 page-title-main-name ${
//                               isActive ? "btn-dark" : "btn-outline-secondary"
//                             }`}
//                             style={{
//                               fontSize: 12,
//                               fontWeight: isActive ? 600 : 400,
//                               transition: "all 0.15s ease",
//                               transform: isActive ? "scale(1.04)" : "scale(1)",
//                             }}
//                             title={`Filter by ${cat.name}`}
//                           >
//                             {cat.name}
//                           </button>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 )}

//                 {/* ── Category checkboxes ─────────────────────────────────────
//                     Standard checkbox list from filterData.categories.
//                     Backend already scopes these to the current query context.
//                 ─────────────────────────────────────────────────────────── */}
//                 {categoryCheckboxes.length > 0 && (
//                   <div style={{ maxHeight: "200px", overflowY: "auto", padding: "8px 16px" }}>
//                     {categoryCheckboxes.map((c) => (
//                       <div key={c._id} className="form-check mb-1">
//                         <input
//                           className="form-check-input"
//                           type="checkbox"
//                           id={`cat-${c._id}`}
//                           checked={(filters.categoryIds || []).includes(c._id)}
//                           onChange={() => handleMultiChange("categoryIds", c._id)}
//                         />
//                         <label className="form-check-label page-title-main-name" htmlFor={`cat-${c._id}`}>
//                           {renderLabel(c.name, c.count)}
//                         </label>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//               </div>
//             </div>
//           </div>
//         )}

//         {/* Brands */}
//         {brands.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button"
//                 data-bs-toggle="collapse" data-bs-target="#brands">
//                 Brand
//               </button>
//             </h2>
//             <div id="brands" className="accordion-collapse collapse">
//               <div className="accordion-body" style={{ maxHeight: "240px", overflowY: "auto" }}>
//                 {brands.map((b) => (
//                   <div key={b._id} className="form-check mb-1">
//                     <input className="form-check-input" type="checkbox" id={`brand-${b._id}`}
//                       checked={(filters.brandIds || []).includes(b._id)}
//                       onChange={() => handleMultiChange("brandIds", b._id)} />
//                     <label className="form-check-label page-title-main-name" htmlFor={`brand-${b._id}`}>
//                       {renderLabel(b.name, b.count)}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Skin Types — backend-scoped */}
//         {skinTypes.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button"
//                 data-bs-toggle="collapse" data-bs-target="#skintypes">
//                 Skin Type
//                 {hasActiveFilter && (
//                   <span className="ms-2 badge bg-secondary" style={{ fontSize: 10, fontWeight: 400 }}>
//                     {skinTypes.length}
//                   </span>
//                 )}
//               </button>
//             </h2>
//             <div id="skintypes" className="accordion-collapse collapse">
//               <div className="accordion-body" style={{ maxHeight: "240px", overflowY: "auto" }}>
//                 {skinTypes.map((st) => (
//                   <div key={st._id || st.name} className="form-check mb-1">
//                     <input className="form-check-input" type="checkbox" id={`st-${st._id || st.name}`}
//                       checked={(filters.skinTypes || []).includes(st.name)}
//                       onChange={() => handleMultiChange("skinTypes", st.name)} />
//                     <label className="form-check-label page-title-main-name" htmlFor={`st-${st._id || st.name}`}>
//                       {renderLabel(st.name, st.count)}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Formulations — backend-scoped */}
//         {formulations.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button"
//                 data-bs-toggle="collapse" data-bs-target="#formulations">
//                 Formulation
//                 {hasActiveFilter && (
//                   <span className="ms-2 badge bg-secondary" style={{ fontSize: 10, fontWeight: 400 }}>
//                     {formulations.length}
//                   </span>
//                 )}
//               </button>
//             </h2>
//             <div id="formulations" className="accordion-collapse collapse">
//               <div className="accordion-body" style={{ maxHeight: "240px", overflowY: "auto" }}>
//                 {formulations.map((f) => (
//                   <div key={f._id} className="form-check mb-1">
//                     <input className="form-check-input" type="checkbox" id={`form-${f._id}`}
//                       checked={(filters.formulations || []).includes(f._id)}
//                       onChange={() => handleMultiChange("formulations", f._id)} />
//                     <label className="form-check-label page-title-main-name" htmlFor={`form-${f._id}`}>
//                       {renderLabel(f.name, f.count)}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Finishes — backend-scoped */}
//         {finishes.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button"
//                 data-bs-toggle="collapse" data-bs-target="#finishes">
//                 Finish
//                 {hasActiveFilter && (
//                   <span className="ms-2 badge bg-secondary" style={{ fontSize: 10, fontWeight: 400 }}>
//                     {finishes.length}
//                   </span>
//                 )}
//               </button>
//             </h2>
//             <div id="finishes" className="accordion-collapse collapse">
//               <div className="accordion-body">
//                 {finishes.map((f) => (
//                   <div key={f.slug} className="form-check mb-1">
//                     <input className="form-check-input" type="checkbox" id={`fin-${f.slug}`}
//                       checked={(filters.finishes || []).includes(f.slug)}
//                       onChange={() => handleMultiChange("finishes", f.slug)} />
//                     <label className="form-check-label page-title-main-name" htmlFor={`fin-${f.slug}`}>
//                       {renderLabel(f.name, f.count)}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Key Ingredients — backend-scoped */}
//         {ingredients.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button"
//                 data-bs-toggle="collapse" data-bs-target="#ingredients">
//                 Key Ingredient
//                 {hasActiveFilter && (
//                   <span className="ms-2 badge bg-secondary" style={{ fontSize: 10, fontWeight: 400 }}>
//                     {ingredients.length}
//                   </span>
//                 )}
//               </button>
//             </h2>
//             <div id="ingredients" className="accordion-collapse collapse">
//               <div className="accordion-body" style={{ maxHeight: "240px", overflowY: "auto" }}>
//                 {ingredients.map((i) => (
//                   <div key={i.slug} className="form-check mb-1">
//                     <input className="form-check-input" type="checkbox" id={`ing-${i.slug}`}
//                       checked={(filters.ingredients || []).includes(i.slug)}
//                       onChange={() => handleMultiChange("ingredients", i.slug)} />
//                     <label className="form-check-label page-title-main-name" htmlFor={`ing-${i.slug}`}>
//                       {renderLabel(i.name, i.count)}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Price Range */}
//         <div className="accordion-item">
//           <h2 className="accordion-header">
//             <button className="accordion-button collapsed" type="button"
//               data-bs-toggle="collapse" data-bs-target="#price">
//               Price Range
//             </button>
//           </h2>
//           <div id="price" className="accordion-collapse collapse">
//             <div className="accordion-body">
//               <select className="form-select"
//                 value={filters.priceRange ? JSON.stringify(filters.priceRange) : ""}
//                 onChange={(e) =>
//                   handleSingleChange("priceRange", e.target.value ? JSON.parse(e.target.value) : null)
//                 }>
//                 <option value="">All prices</option>
//                 {priceRanges.map((p, i) => (
//                   <option key={i} value={JSON.stringify({ min: p.min, max: p.max })}>{p.label}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Discount */}
//         <div className="accordion-item">
//           <h2 className="accordion-header">
//             <button className="accordion-button collapsed" type="button"
//               data-bs-toggle="collapse" data-bs-target="#discount">
//               Discount
//             </button>
//           </h2>
//           <div id="discount" className="accordion-collapse collapse">
//             <div className="accordion-body">
//               <select className="form-select"
//                 value={filters.discountRange ? JSON.stringify(filters.discountRange) : ""}
//                 onChange={(e) =>
//                   handleSingleChange("discountRange", e.target.value ? JSON.parse(e.target.value) : null)
//                 }>
//                 <option value="">Any discount</option>
//                 {discountRanges.map((d, i) => (
//                   <option key={i} value={JSON.stringify({ min: d.min })}>{d.label}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Minimum Rating */}
//         <div className="accordion-item">
//           <h2 className="accordion-header">
//             <button className="accordion-button collapsed" type="button"
//               data-bs-toggle="collapse" data-bs-target="#rating">
//               Minimum Rating
//             </button>
//           </h2>
//           <div id="rating" className="accordion-collapse collapse">
//             <div className="accordion-body">
//               <select className="form-select"
//                 value={filters.minRating || ""}
//                 onChange={(e) => handleSingleChange("minRating", e.target.value)}>
//                 <option value="">Any rating</option>
//                 {[4, 3, 2].map((r) => (
//                   <option key={r} value={r}>{r}+ Stars</option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default BrandFilter;













//=========================================================================Done-Code(Start)================================================================================








// // BrandFilter.jsx — Updated: Hide main category checkboxes when a sub-category level is active
// import React from "react";
// import { FaTimes } from "react-icons/fa";

// const BrandFilter = ({
//   filters,
//   setFilters,
//   onClose,
//   filterData = null,
//   trendingCategories = [],    // used as drill-down navigation pills
//   activeCategorySlug = null,
//   activeCategoryName = "",
//   onClearCategory,
//   onCategoryPillClick,
// }) => {
//   if (!filterData) {
//     return (
//       <div className="filter-wrapper border p-3" style={{ position: "sticky", top: "140px" }}>
//         <div className="d-flex align-items-center gap-2">
//           <div className="spinner-border spinner-border-sm text-secondary" role="status" />
//           <small className="text-muted">Loading filters...</small>
//         </div>
//       </div>
//     );
//   }

//   const {
//     brands = [],
//     categories = [],           // ← this will be main or sub depending on backend scoping
//     skinTypes = [],
//     formulations = [],
//     finishes = [],
//     ingredients = [],
//     priceRanges = [],
//     discountRanges = [],
//   } = filterData;

//   /* ─── Helpers ───────────────────────────────────────────────────────────── */
//   const toggleInArray = (arr = [], value) =>
//     arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

//   const handleMultiChange = (key, value) =>
//     setFilters((prev) => ({ ...prev, [key]: toggleInArray(prev[key] || [], value) }));

//   const handleSingleChange = (key, value) =>
//     setFilters((prev) => ({ ...prev, [key]: value }));

//   const clearAll = () => {
//     setFilters({
//       brandIds: [], categoryIds: [], skinTypes: [], formulations: [],
//       finishes: [], ingredients: [], priceRange: null, discountRange: null,
//       minRating: "", sort: "recent",
//     });
//     if (onClearCategory) onClearCategory();
//   };

//   const removeSingleValue = (key, val) =>
//     setFilters((prev) => ({ ...prev, [key]: (prev[key] || []).filter((v) => v !== val) }));

//   const getDisplayName = (key, val) => {
//     if (!val) return "";
//     switch (key) {
//       case "brandIds":
//         return brands.find((b) => b._id === val || b.slug === val)?.name || val;
//       case "categoryIds":
//         return categories.find((c) => c._id === val || c.slug === val)?.name || val;
//       case "skinTypes":
//         return skinTypes.find((s) => s.name === val)?.name || val;
//       case "formulations":
//         return formulations.find((f) => f._id === val)?.name || val;
//       case "finishes":
//         return finishes.find((f) => f.slug === val)?.name || val;
//       case "ingredients":
//         return ingredients.find((i) => i.slug === val)?.name || val;
//       case "priceRange":
//         try {
//           const match = priceRanges.find((p) => p.min === val.min && p.max === val.max);
//           return match?.label || `₹${val.min} — ₹${val.max || "above"}`;
//         } catch { return "Price"; }
//       case "discountRange":
//         try {
//           const match = discountRanges.find((d) => d.min === val.min);
//           return match?.label || `${val.min}%+ Off`;
//         } catch { return "Discount"; }
//       case "minRating": return `${val}★ & up`;
//       case "sort":
//         return val === "recent" ? "" : val.replace(/([A-Z])/g, " $1").trim();
//       default: return val;
//     }
//   };

//   /* ─── Active Chips ──────────────────────────────────────────────────────── */
//   const getActiveChips = () => {
//     const chips = [];
//     if (activeCategorySlug && activeCategoryName) {
//       chips.push({
//         group: "categoryPill",
//         value: activeCategorySlug,
//         label: activeCategoryName,
//         isPill: true,
//       });
//     }

//     ["brandIds", "categoryIds", "skinTypes", "formulations", "finishes", "ingredients"].forEach((k) => {
//       (filters[k] || []).forEach((v) => {
//         const label = getDisplayName(k, v);
//         if (label) chips.push({ group: k, value: v, label });
//       });
//     });

//     if (filters.priceRange) chips.push({ group: "priceRange", label: getDisplayName("priceRange", filters.priceRange) });
//     if (filters.discountRange) chips.push({ group: "discountRange", label: getDisplayName("discountRange", filters.discountRange) });
//     if (filters.minRating) chips.push({ group: "minRating", label: getDisplayName("minRating", filters.minRating) });
//     if (filters.sort && filters.sort !== "recent") chips.push({ group: "sort", label: getDisplayName("sort", filters.sort) });

//     return chips.filter((c) => c.label);
//   };

//   const activeChips = getActiveChips();

//   const renderLabel = (name, count) => (
//     <>
//       {name}
//       {count !== undefined && count !== null && <span className="text-muted small ms-1">({count})</span>}
//     </>
//   );

//   const hasActiveFilter = activeChips.length > 0;

//   /* ─── Category logic: hide main checkboxes when we are in sub-category view ── */
//   const isInSubCategoryView = !!activeCategorySlug; // true = user has drilled down
//   const showCategoryPills = trendingCategories.length > 0;
//   const showCategoryCheckboxes = categories.length > 0 && !isInSubCategoryView;

//   /* ─── Render ────────────────────────────────────────────────────────────── */
//   return (
//     <div className="filter-wrapper border" style={{ position: "sticky", top: "140px" }}>
//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
//         <h6 className="fw-bold mb-0">Filters</h6>
//         {hasActiveFilter && (
//           <button className="btn btn-link text-muted p-0 small" onClick={clearAll}>
//             Reset
//           </button>
//         )}
//       </div>

//       {/* Selected chips */}
//       {hasActiveFilter && (
//         <div className="px-3 pb-3 pt-2 border-bottom">
//           <div className="d-flex justify-content-between mb-2">
//             <small className="text-muted fw-semibold">Selected</small>
//             <button className="btn btn-link btn-sm text-danger p-0" onClick={clearAll}>
//               Clear All
//             </button>
//           </div>
//           <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", maxHeight: "140px", overflowY: "auto" }}>
//             {activeChips.map((chip) => (
//               <span
//                 key={`${chip.group}-${chip.value || "s"}`}
//                 className={`badge rounded-pill px-3 py-2 d-flex align-items-center gap-1 ${
//                   chip.isPill ? "bg-dark text-white" : "bg-secondary text-white"
//                 }`}
//                 style={{ fontSize: "12px", cursor: "pointer", fontWeight: chip.isPill ? 600 : 400, maxWidth: "100%" }}
//                 title={chip.isPill ? "Remove category filter" : `Remove ${chip.label}`}
//                 onClick={() => {
//                   if (chip.isPill) {
//                     if (onClearCategory) onClearCategory();
//                   } else if (chip.group === "priceRange" || chip.group === "discountRange") {
//                     setFilters((prev) => ({ ...prev, [chip.group]: null }));
//                   } else {
//                     removeSingleValue(chip.group, chip.value);
//                   }
//                 }}
//               >
//                 {chip.isPill && <span style={{ fontSize: 10, opacity: 0.75 }}>Category: </span>}
//                 <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}>
//                   {chip.label}
//                 </span>
//                 <FaTimes size={10} style={{ flexShrink: 0 }} />
//               </span>
//             ))}
//           </div>
//         </div>
//       )}

//       <div className="accordion accordion-flush" id="filterAccordion">
//         {/* ── CATEGORY SECTION ──────────────────────────────────────────────── */}
//         {showCategoryPills && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button
//                 className="accordion-button"
//                 type="button"
//                 data-bs-toggle="collapse"
//                 data-bs-target="#categories"
//                 aria-expanded="true"
//               >
//                 Category
//                 {activeCategoryName && (
//                   <span className="ms-2 text-muted" style={{ fontSize: 12 }}>
//                     › {activeCategoryName}
//                   </span>
//                 )}
//               </button>
//             </h2>

//             <div id="categories" className="accordion-collapse collapse show">
//               <div className="accordion-body p-0">
//                 {/* Pills - always shown when available (root or sub) */}
//                 {showCategoryPills && (
//                   <div className="px-3 py-3 border-bottom">
//                     <small
//                       className="text-uppercase text-muted d-block mb-2"
//                       style={{ fontSize: 11, letterSpacing: "0.4px" }}
//                     >
//                       {isInSubCategoryView ? "Sub-categories" : "Popular Categories"}
//                     </small>

//                     <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
//                       {trendingCategories.map((cat) => {
//                         const isActive = activeCategorySlug === cat.slug;
//                         return (
//                           <button
//                             key={cat.slug}
//                             type="button"
//                             onClick={() => onCategoryPillClick && onCategoryPillClick(cat)}
//                             className={`btn btn-sm rounded-pill px-3 py-1 ${
//                               isActive ? "btn-dark text-white" : "btn-outline-secondary"
//                             }`}
//                             style={{
//                               fontSize: 13,
//                               fontWeight: isActive ? 600 : 400,
//                               transition: "all 0.15s",
//                             }}
//                           >
//                             {cat.name}
//                           </button>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 )}

//                 {/* Checkboxes - only show when NOT in sub-category view */}
//                 {showCategoryCheckboxes && (
//                   <div style={{ maxHeight: "260px", overflowY: "auto", padding: "12px 16px" }}>
//                     {categories.map((c) => (
//                       <div key={c._id || c.slug} className="form-check mb-2">
//                         <input
//                           className="form-check-input"
//                           type="checkbox"
//                           id={`cat-${c._id || c.slug}`}
//                           checked={(filters.categoryIds || []).includes(c._id)}
//                           onChange={() => handleMultiChange("categoryIds", c._id)}
//                         />
//                         <label className="form-check-label" htmlFor={`cat-${c._id || c.slug}`}>
//                           {renderLabel(c.name, c.count)}
//                         </label>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {showCategoryPills && !showCategoryCheckboxes && categories.length === 0 && (
//                   <div className="p-4 text-center text-muted small">
//                     No further sub-categories available
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ── BRAND ─────────────────────────────────────────────────────────── */}
//         {brands.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#brands">
//                 Brand
//               </button>
//             </h2>
//             <div id="brands" className="accordion-collapse collapse">
//               <div className="accordion-body" style={{ maxHeight: "260px", overflowY: "auto" }}>
//                 {brands.map((b) => (
//                   <div key={b._id} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`brand-${b._id}`}
//                       checked={(filters.brandIds || []).includes(b._id)}
//                       onChange={() => handleMultiChange("brandIds", b._id)}
//                     />
//                     <label className="form-check-label" htmlFor={`brand-${b._id}`}>
//                       {renderLabel(b.name, b.count)}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Skin Type */}
//         {skinTypes.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#skintypes">
//                 Skin Type
//               </button>
//             </h2>
//             <div id="skintypes" className="accordion-collapse collapse">
//               <div className="accordion-body" style={{ maxHeight: "260px", overflowY: "auto" }}>
//                 {skinTypes.map((st) => (
//                   <div key={st.name} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`st-${st.name}`}
//                       checked={(filters.skinTypes || []).includes(st.name)}
//                       onChange={() => handleMultiChange("skinTypes", st.name)}
//                     />
//                     <label className="form-check-label" htmlFor={`st-${st.name}`}>
//                       {renderLabel(st.name, st.count)}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Formulation */}
//         {formulations.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#formulations">
//                 Formulation
//               </button>
//             </h2>
//             <div id="formulations" className="accordion-collapse collapse">
//               <div className="accordion-body" style={{ maxHeight: "260px", overflowY: "auto" }}>
//                 {formulations.map((f) => (
//                   <div key={f._id} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`form-${f._id}`}
//                       checked={(filters.formulations || []).includes(f._id)}
//                       onChange={() => handleMultiChange("formulations", f._id)}
//                     />
//                     <label className="form-check-label" htmlFor={`form-${f._id}`}>
//                       {renderLabel(f.name, f.count)}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Finish */}
//         {finishes.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#finishes">
//                 Finish
//               </button>
//             </h2>
//             <div id="finishes" className="accordion-collapse collapse">
//               <div className="accordion-body" style={{ maxHeight: "260px", overflowY: "auto" }}>
//                 {finishes.map((f) => (
//                   <div key={f.slug} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`fin-${f.slug}`}
//                       checked={(filters.finishes || []).includes(f.slug)}
//                       onChange={() => handleMultiChange("finishes", f.slug)}
//                     />
//                     <label className="form-check-label" htmlFor={`fin-${f.slug}`}>
//                       {renderLabel(f.name, f.count)}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Key Ingredient */}
//         {ingredients.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#ingredients">
//                 Key Ingredient
//               </button>
//             </h2>
//             <div id="ingredients" className="accordion-collapse collapse">
//               <div className="accordion-body" style={{ maxHeight: "260px", overflowY: "auto" }}>
//                 {ingredients.map((i) => (
//                   <div key={i.slug} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`ing-${i.slug}`}
//                       checked={(filters.ingredients || []).includes(i.slug)}
//                       onChange={() => handleMultiChange("ingredients", i.slug)}
//                     />
//                     <label className="form-check-label" htmlFor={`ing-${i.slug}`}>
//                       {renderLabel(i.name, i.count)}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Price Range */}
//         <div className="accordion-item">
//           <h2 className="accordion-header">
//             <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#price">
//               Price Range
//             </button>
//           </h2>
//           <div id="price" className="accordion-collapse collapse">
//             <div className="accordion-body">
//               <select
//                 className="form-select"
//                 value={filters.priceRange ? JSON.stringify(filters.priceRange) : ""}
//                 onChange={(e) => handleSingleChange("priceRange", e.target.value ? JSON.parse(e.target.value) : null)}
//               >
//                 <option value="">All prices</option>
//                 {priceRanges.map((p, i) => (
//                   <option key={i} value={JSON.stringify({ min: p.min, max: p.max })}>
//                     {p.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Discount */}
//         <div className="accordion-item">
//           <h2 className="accordion-header">
//             <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#discount">
//               Discount
//             </button>
//           </h2>
//           <div id="discount" className="accordion-collapse collapse">
//             <div className="accordion-body">
//               <select
//                 className="form-select"
//                 value={filters.discountRange ? JSON.stringify(filters.discountRange) : ""}
//                 onChange={(e) => handleSingleChange("discountRange", e.target.value ? JSON.parse(e.target.value) : null)}
//               >
//                 <option value="">Any discount</option>
//                 {discountRanges.map((d, i) => (
//                   <option key={i} value={JSON.stringify({ min: d.min })}>
//                     {d.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Minimum Rating */}
//         <div className="accordion-item">
//           <h2 className="accordion-header">
//             <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#rating">
//               Minimum Rating
//             </button>
//           </h2>
//           <div id="rating" className="accordion-collapse collapse">
//             <div className="accordion-body">
//               <select
//                 className="form-select"
//                 value={filters.minRating || ""}
//                 onChange={(e) => handleSingleChange("minRating", e.target.value)}
//               >
//                 <option value="">Any rating</option>
//                 {[4, 3, 2].map((r) => (
//                   <option key={r} value={r}>{r}+ Stars</option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>
//       </div>

//       {onClose && (
//         <div className="p-3 border-top d-lg-none">
//           <button className="btn btn-dark w-100" onClick={onClose}>
//             Show Results
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BrandFilter;


























// // BrandFilter.jsx — Updated: Hide sections when their filters are actively applied
// import React from "react";
// import { FaTimes } from "react-icons/fa";

// const BrandFilter = ({
//   filters,
//   setFilters,
//   onClose,
//   filterData = null,
//   trendingCategories = [],    // used as drill-down navigation pills
//   activeCategorySlug = null,
//   activeCategoryName = "",
//   onClearCategory,
//   onCategoryPillClick,
// }) => {
//   if (!filterData) {
//     return (
//       <div className="filter-wrapper border p-3" style={{ position: "sticky", top: "140px" }}>
//         <div className="d-flex align-items-center gap-2">
//           <div className="spinner-border spinner-border-sm text-secondary" role="status" />
//           <small className="text-muted">Loading filters...</small>
//         </div>
//       </div>
//     );
//   }

//   const {
//     brands = [],
//     categories = [],           // ← this will be main or sub depending on backend scoping
//     skinTypes = [],
//     formulations = [],
//     finishes = [],
//     ingredients = [],
//     priceRanges = [],
//     discountRanges = [],
//   } = filterData;

//   /* ─── Helpers ───────────────────────────────────────────────────────────── */
//   const toggleInArray = (arr = [], value) =>
//     arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

//   const handleMultiChange = (key, value) =>
//     setFilters((prev) => ({ ...prev, [key]: toggleInArray(prev[key] || [], value) }));

//   const handleSingleChange = (key, value) =>
//     setFilters((prev) => ({ ...prev, [key]: value }));

//   const clearAll = () => {
//     setFilters({
//       brandIds: [], categoryIds: [], skinTypes: [], formulations: [],
//       finishes: [], ingredients: [], priceRange: null, discountRange: null,
//       minRating: "", sort: "recent",
//     });
//     if (onClearCategory) onClearCategory();
//   };

//   const removeSingleValue = (key, val) =>
//     setFilters((prev) => ({ ...prev, [key]: (prev[key] || []).filter((v) => v !== val) }));

//   const getDisplayName = (key, val) => {
//     if (!val) return "";
//     switch (key) {
//       case "brandIds":
//         return brands.find((b) => b._id === val || b.slug === val)?.name || val;
//       case "categoryIds":
//         return categories.find((c) => c._id === val || c.slug === val)?.name || val;
//       case "skinTypes":
//         return skinTypes.find((s) => s.name === val)?.name || val;
//       case "formulations":
//         return formulations.find((f) => f._id === val)?.name || val;
//       case "finishes":
//         return finishes.find((f) => f.slug === val)?.name || val;
//       case "ingredients":
//         return ingredients.find((i) => i.slug === val)?.name || val;
//       case "priceRange":
//         try {
//           const match = priceRanges.find((p) => p.min === val.min && p.max === val.max);
//           return match?.label || `₹${val.min} — ₹${val.max || "above"}`;
//         } catch { return "Price"; }
//       case "discountRange":
//         try {
//           const match = discountRanges.find((d) => d.min === val.min);
//           return match?.label || `${val.min}%+ Off`;
//         } catch { return "Discount"; }
//       case "minRating": return `${val}★ & up`;
//       case "sort":
//         return val === "recent" ? "" : val.replace(/([A-Z])/g, " $1").trim();
//       default: return val;
//     }
//   };

//   /* ─── Active Chips ──────────────────────────────────────────────────────── */
//   // const getActiveChips = () => {
//   //   const chips = [];
//   //   if (activeCategorySlug && activeCategoryName) {
//   //     chips.push({
//   //       group: "categoryPill",
//   //       value: activeCategorySlug,
//   //       label: activeCategoryName,
//   //       isPill: true,
//   //     });
//   //   }



//   const getActiveChips = () => {
//   const chips = [];
//   if (activeCategorySlug) {
//     // Try to get the category name from trendingCategories if not provided
//     const categoryName = activeCategoryName || 
//       trendingCategories.find(c => c.slug === activeCategorySlug)?.name || 
//       activeCategorySlug;
//     chips.push({
//       group: "categoryPill",
//       value: activeCategorySlug,
//       label: categoryName,
//       isPill: true,
//     });
//   };

//     ["brandIds", "categoryIds", "skinTypes", "formulations", "finishes", "ingredients"].forEach((k) => {
//       (filters[k] || []).forEach((v) => {
//         const label = getDisplayName(k, v);
//         if (label) chips.push({ group: k, value: v, label });
//       });
//     });

//     if (filters.priceRange) chips.push({ group: "priceRange", label: getDisplayName("priceRange", filters.priceRange) });
//     if (filters.discountRange) chips.push({ group: "discountRange", label: getDisplayName("discountRange", filters.discountRange) });
//     if (filters.minRating) chips.push({ group: "minRating", label: getDisplayName("minRating", filters.minRating) });
//     if (filters.sort && filters.sort !== "recent") chips.push({ group: "sort", label: getDisplayName("sort", filters.sort) });

//     return chips.filter((c) => c.label);
//   };

//   const activeChips = getActiveChips();

//   const renderLabel = (name, count) => (
//     <>
//       {name}
//       {count !== undefined && count !== null && <span className="text-muted small ms-1">({count})</span>}
//     </>
//   );

//   const hasActiveFilter = activeChips.length > 0;

//   /* ─── Category logic: hide main checkboxes when we are in sub-category view ── */
//   const isInSubCategoryView = !!activeCategorySlug; // true = user has drilled down
//   const showCategoryPills = trendingCategories.length > 0;
//   const showCategoryCheckboxes = categories.length > 0 && !isInSubCategoryView;

//   /* ─── Logic: Hide sections when their filters are active ──────────────────── */
//   const hasActiveBrands = (filters.brandIds || []).length > 0;
//   const hasActiveCategories = (filters.categoryIds || []).length > 0;
//   const hasActiveSkinTypes = (filters.skinTypes || []).length > 0;
//   const hasActiveFormulations = (filters.formulations || []).length > 0;
//   const hasActiveFinishes = (filters.finishes || []).length > 0;
//   const hasActiveIngredients = (filters.ingredients || []).length > 0;
//   const hasActivePriceRange = !!filters.priceRange;
//   const hasActiveDiscountRange = !!filters.discountRange;
//   const hasActiveRating = !!filters.minRating;

//   /* ─── Render ────────────────────────────────────────────────────────────── */
//   return (
//     <div className="filter-wrapper border" style={{ position: "sticky", top: "140px" }}>
//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
//         <h6 className="fw-bold mb-0">Filters</h6>
//         {hasActiveFilter && (
//           <button className="btn btn-link text-muted p-0 small" onClick={clearAll}>
//             Reset
//           </button>
//         )}
//       </div>

//       {/* Selected chips */}
//       {hasActiveFilter && (
//         <div className="px-3 pb-3 pt-2 border-bottom">
//           <div className="d-flex justify-content-between mb-2">
//             <small className="text-muted fw-semibold">Selected</small>
//             <button className="btn btn-link btn-sm text-danger p-0" onClick={clearAll}>
//               Clear All
//             </button>
//           </div>
//           <div className="mb-5 overflow-y-scroll" style={{ display: "block", flexWrap: "wrap", gap: "6px", maxHeight: "140px"}}>
//             {activeChips.map((chip) => (
//               <span
//                 key={`${chip.group}-${chip.value || "s"}`}
//                 className={`badge rounded-pill px-3 py-2 d-flex align-items-center gap-1 mt-0 ms-0 ${
//                   chip.isPill ? "bg-dark text-white" : "bg-secondary text-white"
//                 }`}
//                 style={{ fontSize: "12px", cursor: "pointer", fontWeight: chip.isPill ? 600 : 400, maxWidth: "100%" }}
//                 title={chip.isPill ? "Remove category filter" : `Remove ${chip.label}`}
//                 onClick={() => {
//                   if (chip.isPill) {
//                     if (onClearCategory) onClearCategory();
//                   } else if (chip.group === "priceRange" || chip.group === "discountRange") {
//                     setFilters((prev) => ({ ...prev, [chip.group]: null }));
//                   } else {
//                     removeSingleValue(chip.group, chip.value);
//                   }
//                 }}
//               >
//                 {chip.isPill && <span style={{ fontSize: 10, opacity: 0.75 }}>Category: </span>}
//                 <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}>
//                   {chip.label}
//                 </span>
//                 <FaTimes size={10} style={{ flexShrink: 0 }} />
//               </span>
//             ))}
//           </div>
//         </div>
//       )}

//       <div className="accordion accordion-flush" id="filterAccordion">
//         {/* ── CATEGORY SECTION ──────────────────────────────────────────────── */}
//         {showCategoryPills && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button
//                 className="accordion-button"
//                 type="button"
//                 data-bs-toggle="collapse"
//                 data-bs-target="#categories"
//                 aria-expanded="true"
//               >
//                 Category
//                 {activeCategoryName && (
//                   <span className="ms-2 text-muted" style={{ fontSize: 12 }}>
//                     › {activeCategoryName}
//                   </span>
//                 )}
//               </button>
//             </h2>

//             <div id="categories" className="accordion-collapse collapse show">
//               <div className="accordion-body p-0">
//                 {/* Pills - always shown when available (root or sub) */}
//                 {/* {showCategoryPills && (
//                   <div className="px-3 py-3 border-bottom">
//                     <small
//                       className="text-uppercase text-muted d-block mb-2"
//                       style={{ fontSize: 11, letterSpacing: "0.4px" }}
//                     >
//                       {isInSubCategoryView ? "Sub-categories" : ""}
//                     </small>

//                     <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
//                       {trendingCategories.map((cat) => {
//                         const isActive = activeCategorySlug === cat.slug;
//                         return (
//                           <button
//                             key={cat.slug}
//                             type="button"
//                             onClick={() => onCategoryPillClick && onCategoryPillClick(cat)}
//                             className={`btn btn-sm rounded-pill px-3 py-1 ${
//                               isActive ? "btn-dark text-white" : "btn-outline-secondary"
//                             }`}
//                             style={{
//                               fontSize: 13,
//                               fontWeight: isActive ? 600 : 400,
//                               transition: "all 0.15s",
//                             }}
//                           >
//                             {cat.name}
//                           </button>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 )} */}

//                 {/* Checkboxes - only show when NOT in sub-category view */}
//                 {showCategoryCheckboxes && !hasActiveCategories && (
//                   <div style={{ maxHeight: "260px", overflowY: "auto", padding: "12px 16px" }}>
//                     {categories.map((c) => (
//                       <div key={c._id || c.slug} className="form-check mb-2">
//                         <input
//                           className="form-check-input"
//                           type="checkbox"
//                           id={`cat-${c._id || c.slug}`}
//                           checked={(filters.categoryIds || []).includes(c._id)}
//                           onChange={() => handleMultiChange("categoryIds", c._id)}
//                         />
//                         <label className="form-check-label" htmlFor={`cat-${c._id || c.slug}`}>
//                           {renderLabel(c.name, c.count)}
//                         </label>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {showCategoryPills && !showCategoryCheckboxes && categories.length === 0 && (
//                   <div className="p-4 text-center text-muted small">
//                     No further sub-categories available
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ── BRAND ─────────────────────────────────────────────────────────── */}
//         {brands.length > 0 && !hasActiveBrands && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#brands">
//                 Brand
//               </button>
//             </h2>
//             <div id="brands" className="accordion-collapse collapse">
//               <div className="accordion-body" style={{ maxHeight: "260px", overflowY: "auto" }}>
//                 {brands.map((b) => (
//                   <div key={b._id} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`brand-${b._id}`}
//                       checked={(filters.brandIds || []).includes(b._id)}
//                       onChange={() => handleMultiChange("brandIds", b._id)}
//                     />
//                     <label className="form-check-label" htmlFor={`brand-${b._id}`}>
//                       {renderLabel(b.name, b.count)}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Skin Type */}
//         {skinTypes.length > 0 && !hasActiveSkinTypes && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#skintypes">
//                 Skin Type
//               </button>
//             </h2>
//             <div id="skintypes" className="accordion-collapse collapse">
//               <div className="accordion-body" style={{ maxHeight: "260px", overflowY: "auto" }}>
//                 {skinTypes.map((st) => (
//                   <div key={st.name} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`st-${st.name}`}
//                       checked={(filters.skinTypes || []).includes(st.name)}
//                       onChange={() => handleMultiChange("skinTypes", st.name)}
//                     />
//                     <label className="form-check-label" htmlFor={`st-${st.name}`}>
//                       {renderLabel(st.name, st.count)}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Formulation */}
//         {formulations.length > 0 && !hasActiveFormulations && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#formulations">
//                 Formulation
//               </button>
//             </h2>
//             <div id="formulations" className="accordion-collapse collapse">
//               <div className="accordion-body" style={{ maxHeight: "260px", overflowY: "auto" }}>
//                 {formulations.map((f) => (
//                   <div key={f._id} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`form-${f._id}`}
//                       checked={(filters.formulations || []).includes(f._id)}
//                       onChange={() => handleMultiChange("formulations", f._id)}
//                     />
//                     <label className="form-check-label" htmlFor={`form-${f._id}`}>
//                       {renderLabel(f.name, f.count)}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Finish */}
//         {finishes.length > 0 && !hasActiveFinishes && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#finishes">
//                 Finish
//               </button>
//             </h2>
//             <div id="finishes" className="accordion-collapse collapse">
//               <div className="accordion-body" style={{ maxHeight: "260px", overflowY: "auto" }}>
//                 {finishes.map((f) => (
//                   <div key={f.slug} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`fin-${f.slug}`}
//                       checked={(filters.finishes || []).includes(f.slug)}
//                       onChange={() => handleMultiChange("finishes", f.slug)}
//                     />
//                     <label className="form-check-label" htmlFor={`fin-${f.slug}`}>
//                       {renderLabel(f.name, f.count)}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Key Ingredient */}
//         {ingredients.length > 0 && !hasActiveIngredients && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#ingredients">
//                 Key Ingredient
//               </button>
//             </h2>
//             <div id="ingredients" className="accordion-collapse collapse">
//               <div className="accordion-body" style={{ maxHeight: "260px", overflowY: "auto" }}>
//                 {ingredients.map((i) => (
//                   <div key={i.slug} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`ing-${i.slug}`}
//                       checked={(filters.ingredients || []).includes(i.slug)}
//                       onChange={() => handleMultiChange("ingredients", i.slug)}
//                     />
//                     <label className="form-check-label" htmlFor={`ing-${i.slug}`}>
//                       {renderLabel(i.name, i.count)}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Price Range */}
//         {!hasActivePriceRange && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#price">
//                 Price Range
//               </button>
//             </h2>
//             <div id="price" className="accordion-collapse collapse">
//               <div className="accordion-body">
//                 <select
//                   className="form-select"
//                   value={filters.priceRange ? JSON.stringify(filters.priceRange) : ""}
//                   onChange={(e) => handleSingleChange("priceRange", e.target.value ? JSON.parse(e.target.value) : null)}
//                 >
//                   <option value="">All prices</option>
//                   {priceRanges.map((p, i) => (
//                     <option key={i} value={JSON.stringify({ min: p.min, max: p.max })}>
//                       {p.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Discount */}
//         {!hasActiveDiscountRange && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#discount">
//                 Discount
//               </button>
//             </h2>
//             <div id="discount" className="accordion-collapse collapse">
//               <div className="accordion-body">
//                 <select
//                   className="form-select"
//                   value={filters.discountRange ? JSON.stringify(filters.discountRange) : ""}
//                   onChange={(e) => handleSingleChange("discountRange", e.target.value ? JSON.parse(e.target.value) : null)}
//                 >
//                   <option value="">Any discount</option>
//                   {discountRanges.map((d, i) => (
//                     <option key={i} value={JSON.stringify({ min: d.min })}>
//                       {d.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Minimum Rating */}
//         {!hasActiveRating && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#rating">
//                 Minimum Rating
//               </button>
//             </h2>
//             <div id="rating" className="accordion-collapse collapse">
//               <div className="accordion-body">
//                 <select
//                   className="form-select"
//                   value={filters.minRating || ""}
//                   onChange={(e) => handleSingleChange("minRating", e.target.value)}
//                 >
//                   <option value="">Any rating</option>
//                   {[4, 3, 2].map((r) => (
//                     <option key={r} value={r}>{r}+ Stars</option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {onClose && (
//         <div className="p-3 border-top d-lg-none">
//           <button className="btn btn-dark w-100" onClick={onClose}>
//             Show Results
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BrandFilter;














// // BrandFilter.jsx — Updated: Show skin type as selected chip when navigated from Skintypes
// import React from "react";
// import { FaTimes } from "react-icons/fa";
// import { useLocation } from "react-router-dom";

// const BrandFilter = ({
//   filters,
//   setFilters,
//   onClose,
//   filterData = null,
//   trendingCategories = [],
//   activeCategorySlug = null,
//   activeCategoryName = "",
//   onClearCategory,
//   onCategoryPillClick,
//   // New props for skin type support
//   activeSkinTypeSlug = null,
//   activeSkinTypeName = "",
//   onClearSkinType,
// }) => {
//   const location = useLocation();

//   // Get skin type from location state if not passed as prop
//   const locationSkinTypeSlug = location.state?.activeSkinTypeSlug;
//   const locationSkinTypeName = location.state?.activeSkinTypeName;

//   // Use props if provided, otherwise fall back to location state
//   const effectiveSkinTypeSlug = activeSkinTypeSlug || locationSkinTypeSlug;
//   const effectiveSkinTypeName = activeSkinTypeName || locationSkinTypeName;

//   if (!filterData) {
//     return (
//       <div className="filter-wrapper border p-3" style={{ position: "sticky", top: "140px" }}>
//         <div className="d-flex align-items-center gap-2">
//           <div className="spinner-border spinner-border-sm text-secondary" role="status" />
//           <small className="text-muted">Loading filters...</small>
//         </div>
//       </div>
//     );
//   }

//   const {
//     brands = [],
//     categories = [],
//     skinTypes = [],
//     formulations = [],
//     finishes = [],
//     ingredients = [],
//     priceRanges = [],
//     discountRanges = [],
//   } = filterData;

//   /* ─── Helpers ───────────────────────────────────────────────────────────── */
//   const toggleInArray = (arr = [], value) =>
//     arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

//   const handleMultiChange = (key, value) =>
//     setFilters((prev) => ({ ...prev, [key]: toggleInArray(prev[key] || [], value) }));

//   const handleSingleChange = (key, value) =>
//     setFilters((prev) => ({ ...prev, [key]: value }));

//   const clearAll = () => {
//     setFilters({
//       brandIds: [], categoryIds: [], skinTypes: [], formulations: [],
//       finishes: [], ingredients: [], priceRange: null, discountRange: null,
//       minRating: "", sort: "recent",
//     });
//     if (onClearCategory) onClearCategory();
//     if (onClearSkinType) onClearSkinType();
//   };

//   const removeSingleValue = (key, val) =>
//     setFilters((prev) => ({ ...prev, [key]: (prev[key] || []).filter((v) => v !== val) }));

//   const getDisplayName = (key, val) => {
//     if (!val) return "";
//     switch (key) {
//       case "brandIds":
//         return brands.find((b) => b._id === val || b.slug === val)?.name || val;
//       case "categoryIds":
//         return categories.find((c) => c._id === val || c.slug === val)?.name || val;
//       case "skinTypes":
//         return skinTypes.find((s) => s.name === val || s.slug === val)?.name || val;
//       case "formulations":
//         return formulations.find((f) => f._id === val)?.name || val;
//       case "finishes":
//         return finishes.find((f) => f.slug === val)?.name || val;
//       case "ingredients":
//         return ingredients.find((i) => i.slug === val)?.name || val;
//       case "priceRange":
//         try {
//           const match = priceRanges.find((p) => p.min === val.min && p.max === val.max);
//           return match?.label || `₹${val.min} — ₹${val.max || "above"}`;
//         } catch { return "Price"; }
//       case "discountRange":
//         try {
//           const match = discountRanges.find((d) => d.min === val.min);
//           return match?.label || `${val.min}%+ Off`;
//         } catch { return "Discount"; }
//       case "minRating": return `${val}★ & up`;
//       case "sort":
//         return val === "recent" ? "" : val.replace(/([A-Z])/g, " $1").trim();
//       default: return val;
//     }
//   };

//   /* ─── Active Chips ──────────────────────────────────────────────────────── */
//   const getActiveChips = () => {
//     const chips = [];

//     // Category pill
//     if (activeCategorySlug) {
//       const categoryName = activeCategoryName || 
//         trendingCategories.find(c => c.slug === activeCategorySlug)?.name || 
//         activeCategorySlug;
//       chips.push({
//         group: "categoryPill",
//         value: activeCategorySlug,
//         label: categoryName,
//         isPill: true,
//       });
//     }

//     // Skin Type pill (from Skintypes navigation)
//     if (effectiveSkinTypeSlug) {
//       const skinTypeName = effectiveSkinTypeName ||
//         skinTypes.find(s => s.slug === effectiveSkinTypeSlug)?.name ||
//         effectiveSkinTypeSlug;
//       chips.push({
//         group: "skinTypePill",
//         value: effectiveSkinTypeSlug,
//         label: skinTypeName,
//         isPill: true,
//         isSkinType: true,
//       });
//     }

//     ["brandIds", "categoryIds", "skinTypes", "formulations", "finishes", "ingredients"].forEach((k) => {
//       (filters[k] || []).forEach((v) => {
//         const label = getDisplayName(k, v);
//         if (label) chips.push({ group: k, value: v, label });
//       });
//     });

//     if (filters.priceRange) chips.push({ group: "priceRange", label: getDisplayName("priceRange", filters.priceRange) });
//     if (filters.discountRange) chips.push({ group: "discountRange", label: getDisplayName("discountRange", filters.discountRange) });
//     if (filters.minRating) chips.push({ group: "minRating", label: getDisplayName("minRating", filters.minRating) });
//     if (filters.sort && filters.sort !== "recent") chips.push({ group: "sort", label: getDisplayName("sort", filters.sort) });

//     return chips.filter((c) => c.label);
//   };

//   const activeChips = getActiveChips();

//   const renderLabel = (name, count) => (
//     <>
//       {name}
//       {count !== undefined && count !== null && <span className="text-muted small ms-1">({count})</span>}
//     </>
//   );

//   const hasActiveFilter = activeChips.length > 0;

//   /* ─── Category logic: hide main checkboxes when we are in sub-category view ── */
//   const isInSubCategoryView = !!activeCategorySlug;
//   const showCategoryPills = trendingCategories.length > 0;
//   const showCategoryCheckboxes = categories.length > 0 && !isInSubCategoryView;

//   /* ─── Logic: Hide sections when their filters are active ──────────────────── */
//   const hasActiveBrands = (filters.brandIds || []).length > 0;
//   const hasActiveCategories = (filters.categoryIds || []).length > 0;
//   const hasActiveSkinTypes = (filters.skinTypes || []).length > 0 || !!effectiveSkinTypeSlug;
//   const hasActiveFormulations = (filters.formulations || []).length > 0;
//   const hasActiveFinishes = (filters.finishes || []).length > 0;
//   const hasActiveIngredients = (filters.ingredients || []).length > 0;
//   const hasActivePriceRange = !!filters.priceRange;
//   const hasActiveDiscountRange = !!filters.discountRange;
//   const hasActiveRating = !!filters.minRating;

//   /* ─── Render ────────────────────────────────────────────────────────────── */
//   return (
//     <div className="filter-wrapper border" style={{ position: "sticky", top: "140px" }}>
//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
//         <h6 className="fw-bold mb-0">Filters</h6>
//         {hasActiveFilter && (
//           <button className="btn btn-link text-muted p-0 small" onClick={clearAll}>
//             Reset
//           </button>
//         )}
//       </div>

//       {/* Selected chips */}
//       {hasActiveFilter && (
//         <div className="px-3 pb-3 pt-2 border-bottom">
//           <div className="d-flex justify-content-between mb-2">
//             <small className="text-muted fw-semibold">Selected</small>
//             <button className="btn btn-link btn-sm text-danger p-0" onClick={clearAll}>
//               Clear All
//             </button>
//           </div>
//           <div className="mb-5 overflow-y-scroll" style={{ display: "block", flexWrap: "wrap", gap: "6px", maxHeight: "140px"}}>
//             {activeChips.map((chip) => (
//               <span
//                 key={`${chip.group}-${chip.value || "s"}`}
//                 className={`badge rounded-pill px-3 py-2 d-flex align-items-center gap-1 mt-0 ms-0 ${
//                   chip.isPill ? "bg-dark text-white" : "bg-secondary text-white"
//                 }`}
//                 style={{ fontSize: "12px", cursor: "pointer", fontWeight: chip.isPill ? 600 : 400, maxWidth: "100%" }}
//                 title={chip.isPill ? (chip.isSkinType ? "Remove skin type filter" : "Remove category filter") : `Remove ${chip.label}`}
//                 onClick={() => {
//                   if (chip.isPill && chip.isSkinType) {
//                     if (onClearSkinType) onClearSkinType();
//                   } else if (chip.isPill) {
//                     if (onClearCategory) onClearCategory();
//                   } else if (chip.group === "priceRange" || chip.group === "discountRange") {
//                     setFilters((prev) => ({ ...prev, [chip.group]: null }));
//                   } else {
//                     removeSingleValue(chip.group, chip.value);
//                   }
//                 }}
//               >
//                 {chip.isPill && <span style={{ fontSize: 10, opacity: 0.75 }}>{chip.isSkinType ? "Skin Type: " : "Category: "}</span>}
//                 <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}>
//                   {chip.label}
//                 </span>
//                 <FaTimes size={10} style={{ flexShrink: 0 }} />
//               </span>
//             ))}
//           </div>
//         </div>
//       )}

//       <div className="accordion accordion-flush" id="filterAccordion">
//         {/* ── CATEGORY SECTION ──────────────────────────────────────────────── */}
//         {showCategoryPills && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button
//                 className="accordion-button"
//                 type="button"
//                 data-bs-toggle="collapse"
//                 data-bs-target="#categories"
//                 aria-expanded="true"
//               >
//                 Category
//                 {activeCategoryName && (
//                   <span className="ms-2 text-muted" style={{ fontSize: 12 }}>
//                     › {activeCategoryName}
//                   </span>
//                 )}
//               </button>
//             </h2>

//             <div id="categories" className="accordion-collapse collapse show">
//               <div className="accordion-body p-0">
//                 {showCategoryCheckboxes && !hasActiveCategories && (
//                   <div style={{ maxHeight: "260px", overflowY: "auto", padding: "12px 16px" }}>
//                     {categories.map((c) => (
//                       <div key={c._id || c.slug} className="form-check mb-2">
//                         <input
//                           className="form-check-input"
//                           type="checkbox"
//                           id={`cat-${c._id || c.slug}`}
//                           checked={(filters.categoryIds || []).includes(c._id)}
//                           onChange={() => handleMultiChange("categoryIds", c._id)}
//                         />
//                         <label className="form-check-label" htmlFor={`cat-${c._id || c.slug}`}>
//                           {renderLabel(c.name, c.count)}
//                         </label>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {showCategoryPills && !showCategoryCheckboxes && categories.length === 0 && (
//                   <div className="p-4 text-center text-muted small">
//                     No further sub-categories available
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ── BRAND ─────────────────────────────────────────────────────────── */}
//         {brands.length > 0 && !hasActiveBrands && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#brands">
//                 Brand
//               </button>
//             </h2>
//             <div id="brands" className="accordion-collapse collapse">
//               <div className="accordion-body" style={{ maxHeight: "260px", overflowY: "auto" }}>
//                 {brands.map((b) => (
//                   <div key={b._id} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`brand-${b._id}`}
//                       checked={(filters.brandIds || []).includes(b._id)}
//                       onChange={() => handleMultiChange("brandIds", b._id)}
//                     />
//                     <label className="form-check-label" htmlFor={`brand-${b._id}`}>
//                       {renderLabel(b.name, b.count)}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Skin Type */}
//         {skinTypes.length > 0 && !hasActiveSkinTypes && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#skintypes">
//                 Skin Type
//                 {effectiveSkinTypeName && (
//                   <span className="ms-2 text-muted" style={{ fontSize: 12 }}>
//                     › {effectiveSkinTypeName}
//                   </span>
//                 )}
//               </button>
//             </h2>
//             <div id="skintypes" className="accordion-collapse collapse">
//               <div className="accordion-body" style={{ maxHeight: "260px", overflowY: "auto" }}>
//                 {skinTypes.map((st) => (
//                   <div key={st.name || st.slug} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`st-${st.name || st.slug}`}
//                       checked={(filters.skinTypes || []).includes(st.name) || effectiveSkinTypeSlug === st.slug}
//                       onChange={() => handleMultiChange("skinTypes", st.name)}
//                     />
//                     <label className="form-check-label" htmlFor={`st-${st.name || st.slug}`}>
//                       {renderLabel(st.name, st.count)}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Formulation */}
//         {formulations.length > 0 && !hasActiveFormulations && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#formulations">
//                 Formulation
//               </button>
//             </h2>
//             <div id="formulations" className="accordion-collapse collapse">
//               <div className="accordion-body" style={{ maxHeight: "260px", overflowY: "auto" }}>
//                 {formulations.map((f) => (
//                   <div key={f._id} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`form-${f._id}`}
//                       checked={(filters.formulations || []).includes(f._id)}
//                       onChange={() => handleMultiChange("formulations", f._id)}
//                     />
//                     <label className="form-check-label" htmlFor={`form-${f._id}`}>
//                       {renderLabel(f.name, f.count)}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Finish */}
//         {finishes.length > 0 && !hasActiveFinishes && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#finishes">
//                 Finish
//               </button>
//             </h2>
//             <div id="finishes" className="accordion-collapse collapse">
//               <div className="accordion-body" style={{ maxHeight: "260px", overflowY: "auto" }}>
//                 {finishes.map((f) => (
//                   <div key={f.slug} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`fin-${f.slug}`}
//                       checked={(filters.finishes || []).includes(f.slug)}
//                       onChange={() => handleMultiChange("finishes", f.slug)}
//                     />
//                     <label className="form-check-label" htmlFor={`fin-${f.slug}`}>
//                       {renderLabel(f.name, f.count)}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Key Ingredient */}
//         {ingredients.length > 0 && !hasActiveIngredients && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#ingredients">
//                 Key Ingredient
//               </button>
//             </h2>
//             <div id="ingredients" className="accordion-collapse collapse">
//               <div className="accordion-body" style={{ maxHeight: "260px", overflowY: "auto" }}>
//                 {ingredients.map((i) => (
//                   <div key={i.slug} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`ing-${i.slug}`}
//                       checked={(filters.ingredients || []).includes(i.slug)}
//                       onChange={() => handleMultiChange("ingredients", i.slug)}
//                     />
//                     <label className="form-check-label" htmlFor={`ing-${i.slug}`}>
//                       {renderLabel(i.name, i.count)}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Price Range */}
//         {!hasActivePriceRange && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#price">
//                 Price Range
//               </button>
//             </h2>
//             <div id="price" className="accordion-collapse collapse">
//               <div className="accordion-body">
//                 <select
//                   className="form-select"
//                   value={filters.priceRange ? JSON.stringify(filters.priceRange) : ""}
//                   onChange={(e) => handleSingleChange("priceRange", e.target.value ? JSON.parse(e.target.value) : null)}
//                 >
//                   <option value="">All prices</option>
//                   {priceRanges.map((p, i) => (
//                     <option key={i} value={JSON.stringify({ min: p.min, max: p.max })}>
//                       {p.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Discount */}
//         {!hasActiveDiscountRange && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#discount">
//                 Discount
//               </button>
//             </h2>
//             <div id="discount" className="accordion-collapse collapse">
//               <div className="accordion-body">
//                 <select
//                   className="form-select"
//                   value={filters.discountRange ? JSON.stringify(filters.discountRange) : ""}
//                   onChange={(e) => handleSingleChange("discountRange", e.target.value ? JSON.parse(e.target.value) : null)}
//                 >
//                   <option value="">Any discount</option>
//                   {discountRanges.map((d, i) => (
//                     <option key={i} value={JSON.stringify({ min: d.min })}>
//                       {d.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Minimum Rating */}
//         {!hasActiveRating && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#rating">
//                 Minimum Rating
//               </button>
//             </h2>
//             <div id="rating" className="accordion-collapse collapse">
//               <div className="accordion-body">
//                 <select
//                   className="form-select"
//                   value={filters.minRating || ""}
//                   onChange={(e) => handleSingleChange("minRating", e.target.value)}
//                 >
//                   <option value="">Any rating</option>
//                   {[4, 3, 2].map((r) => (
//                     <option key={r} value={r}>{r}+ Stars</option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {onClose && (
//         <div className="p-3 border-top d-lg-none">
//           <button className="btn btn-dark w-100" onClick={onClose}>
//             Show Results
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BrandFilter;























// // BrandFilter.jsx — FIXED: Now uses SLUGs instead of IDs for cleaner query params
// import React from "react";
// import { FaTimes } from "react-icons/fa";
// import { useLocation } from "react-router-dom";

// const BrandFilter = ({
//   filters,
//   setFilters,
//   onClose,
//   filterData = null,
//   trendingCategories = [],
//   activeCategorySlug = null,
//   activeCategoryName = "",
//   onClearCategory,
//   onCategoryPillClick,
//   // Skin type support (optional)
//   activeSkinTypeSlug = null,
//   activeSkinTypeName = "",
//   onClearSkinType,
// }) => {
//   const location = useLocation();

//   const locationSkinTypeSlug = location.state?.activeSkinTypeSlug;
//   const locationSkinTypeName = location.state?.activeSkinTypeName;

//   const effectiveSkinTypeSlug = activeSkinTypeSlug || locationSkinTypeSlug;
//   const effectiveSkinTypeName = activeSkinTypeName || locationSkinTypeName;

//   if (!filterData) {
//     return (
//       <div className="filter-wrapper border p-3" style={{ position: "sticky", top: "140px" }}>
//         <div className="d-flex align-items-center gap-2">
//           <div className="spinner-border spinner-border-sm text-secondary" role="status" />
//           <small className="text-muted">Loading filters...</small>
//         </div>
//       </div>
//     );
//   }

//   const {
//     brands = [],
//     categories = [],
//     skinTypes = [],
//     formulations = [],
//     finishes = [],
//     ingredients = [],
//     priceRanges = [],
//     discountRanges = [],
//   } = filterData;

//   /* ─── Helpers ───────────────────────────────────────────────────────────── */
//   const toggleInArray = (arr = [], value) =>
//     arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

//   const handleMultiChange = (key, value) =>
//     setFilters((prev) => ({ ...prev, [key]: toggleInArray(prev[key] || [], value) }));

//   const handleSingleChange = (key, value) =>
//     setFilters((prev) => ({ ...prev, [key]: value }));

//   const clearAll = () => {
//     setFilters({
//       brandIds: [], categoryIds: [], skinTypes: [], formulations: [],
//       finishes: [], ingredients: [], priceRange: null, discountRange: null,
//       minRating: "", sort: "recent",
//     });
//     if (onClearCategory) onClearCategory();
//     if (onClearSkinType) onClearSkinType();
//   };

//   const removeSingleValue = (key, val) =>
//     setFilters((prev) => ({ ...prev, [key]: (prev[key] || []).filter((v) => v !== val) }));

//   const getDisplayName = (key, val) => {
//     if (!val) return "";
//     switch (key) {
//       case "brandIds":
//         return brands.find((b) => b._id === val || b.slug === val)?.name || val;
//       case "categoryIds":
//         return categories.find((c) => c._id === val || c.slug === val)?.name || val;
//       case "skinTypes":
//         return skinTypes.find((s) => s.slug === val || s.name === val)?.name || val;
//       case "formulations":
//         return formulations.find((f) => f._id === val)?.name || val;
//       case "finishes":
//         return finishes.find((f) => f.slug === val)?.name || val;
//       case "ingredients":
//         return ingredients.find((i) => i.slug === val)?.name || val;
//       case "priceRange":
//         try {
//           const match = priceRanges.find((p) => p.min === val.min && p.max === val.max);
//           return match?.label || `₹${val.min} — ₹${val.max || "above"}`;
//         } catch { return "Price"; }
//       case "discountRange":
//         try {
//           const match = discountRanges.find((d) => d.min === val.min);
//           return match?.label || `${val.min}%+ Off`;
//         } catch { return "Discount"; }
//       case "minRating": return `${val}★ & up`;
//       case "sort":
//         return val === "recent" ? "" : val.replace(/([A-Z])/g, " $1").trim();
//       default: return val;
//     }
//   };

//   /* ─── Active Chips ──────────────────────────────────────────────────────── */
//   const getActiveChips = () => {
//     const chips = [];

//     // Category pill (from trending / category page)
//     if (activeCategorySlug) {
//       const categoryName = activeCategoryName ||
//         trendingCategories.find((c) => c.slug === activeCategorySlug)?.name ||
//         activeCategorySlug;
//       chips.push({
//         group: "categoryPill",
//         value: activeCategorySlug,
//         label: categoryName,
//         isPill: true,
//       });
//     }

//     // Skin Type pill (from direct /skintype/ navigation)
//     if (effectiveSkinTypeSlug) {
//       const skinTypeName = effectiveSkinTypeName ||
//         skinTypes.find((s) => s.slug === effectiveSkinTypeSlug)?.name ||
//         effectiveSkinTypeSlug;
//       chips.push({
//         group: "skinTypePill",
//         value: effectiveSkinTypeSlug,
//         label: skinTypeName,
//         isPill: true,
//         isSkinType: true,
//       });
//     }

//     // All normal filters
//     ["brandIds", "categoryIds", "skinTypes", "formulations", "finishes", "ingredients"].forEach((k) => {
//       (filters[k] || []).forEach((v) => {
//         const label = getDisplayName(k, v);
//         if (label) chips.push({ group: k, value: v, label });
//       });
//     });

//     if (filters.priceRange) chips.push({ group: "priceRange", label: getDisplayName("priceRange", filters.priceRange) });
//     if (filters.discountRange) chips.push({ group: "discountRange", label: getDisplayName("discountRange", filters.discountRange) });
//     if (filters.minRating) chips.push({ group: "minRating", label: getDisplayName("minRating", filters.minRating) });
//     if (filters.sort && filters.sort !== "recent") chips.push({ group: "sort", label: getDisplayName("sort", filters.sort) });

//     return chips.filter((c) => c.label);
//   };

//   const activeChips = getActiveChips();

//   const renderLabel = (name, count) => (
//     <>
//       {name}
//       {count !== undefined && count !== null && <span className="text-muted small ms-1">({count})</span>}
//     </>
//   );

//   const hasActiveFilter = activeChips.length > 0;

//   /* ─── Hide logic ────────────────────────────────────────────────────────── */
//   const isInSubCategoryView = !!activeCategorySlug;
//   const showCategoryPills = trendingCategories.length > 0;
//   const showCategoryCheckboxes = categories.length > 0 && !isInSubCategoryView;

//   const hasActiveBrands = (filters.brandIds || []).length > 0;
//   const hasActiveCategories = (filters.categoryIds || []).length > 0;
//   const hasActiveSkinTypes = (filters.skinTypes || []).length > 0 || !!effectiveSkinTypeSlug;
//   const hasActiveFormulations = (filters.formulations || []).length > 0;
//   const hasActiveFinishes = (filters.finishes || []).length > 0;
//   const hasActiveIngredients = (filters.ingredients || []).length > 0;
//   const hasActivePriceRange = !!filters.priceRange;
//   const hasActiveDiscountRange = !!filters.discountRange;
//   const hasActiveRating = !!filters.minRating;

//   /* ─── Render ────────────────────────────────────────────────────────────── */
//   return (
//     <div className="filter-wrapper border" style={{ position: "sticky", top: "140px" }}>
//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
//         <h6 className="fw-bold mb-0">Filters</h6>
//         {hasActiveFilter && (
//           <button className="btn btn-link text-muted p-0 small" onClick={clearAll}>
//             Reset
//           </button>
//         )}
//       </div>

//       {/* Selected chips */}
//       {hasActiveFilter && (
//         <div className="px-3 pb-3 pt-2 border-bottom">
//           <div className="d-flex justify-content-between mb-2">
//             <small className="text-muted fw-semibold">Selected</small>
//             <button className="btn btn-link btn-sm text-danger p-0" onClick={clearAll}>
//               Clear All
//             </button>
//           </div>
//           <div className="mb-5 overflow-y-scroll" style={{fontSize: 10, display: "flex", flexWrap: "wrap", gap: "6px", maxHeight: "140px" }}>
//             {activeChips.map((chip) => (
//               <span
//                 key={`${chip.group}-${chip.value || "s"}`}
//                 className={`filter-selected-code pt-2 pb-2 ps-2 px-2 ${
//                   chip.isPill ? "bg-dark text-white" : "bg-secondary text-white"
//                 }`}
//                 style={{fontWeight: chip.isPill ? 600 : 400, maxWidth: "100%" , borderRadius:'25px' }}
//                 title={chip.isPill ? (chip.isSkinType ? "Remove skin type filter" : "Remove category filter") : `Remove ${chip.label}`}
//                 onClick={() => {
//                   if (chip.isPill && chip.isSkinType) {
//                     if (onClearSkinType) onClearSkinType();
//                   } else if (chip.isPill) {
//                     if (onClearCategory) onClearCategory();
//                   } else if (chip.group === "priceRange" || chip.group === "discountRange") {
//                     setFilters((prev) => ({ ...prev, [chip.group]: null }));
//                   } else {
//                     removeSingleValue(chip.group, chip.value);
//                   }
//                 }}
//               >
//                 {chip.isPill && <span style={{ fontSize: 10, opacity: 0.75 }}>{chip.isSkinType ? "Skin Type: " : "Category: "}</span>}
//                 <span className="filter-selected-code" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}>
//                   {chip.label}
//                 </span>
//                 <FaTimes size={10} style={{ flexShrink: 0 }} />
//               </span>
//             ))}
//           </div>
//         </div>
//       )}

//       <div className="accordion accordion-flush" id="filterAccordion">
//         {/* CATEGORY */}
//         {showCategoryPills && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#categories" aria-expanded="true">
//                 Category
//                 {activeCategoryName && <span className="ms-2 text-muted" style={{ fontSize: 12 }}>› {activeCategoryName}</span>}
//               </button>
//             </h2>
//             <div id="categories" className="accordion-collapse collapse show">
//               <div className="accordion-body p-0">
//                 {showCategoryCheckboxes && !hasActiveCategories && (
//                   <div style={{ maxHeight: "260px", overflowY: "auto", padding: "12px 16px" }}>
//                     {categories.map((c) => (
//                       <div key={c.slug} className="form-check mb-2">
//                         <input
//                           className="form-check-input"
//                           type="checkbox"
//                           id={`cat-${c.slug}`}
//                           checked={(filters.categoryIds || []).includes(c.slug)}
//                           onChange={() => handleMultiChange("categoryIds", c.slug)}
//                         />
//                         <label className="form-check-label" htmlFor={`cat-${c.slug}`}>
//                           {renderLabel(c.name, c.count)}
//                         </label>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* BRAND - NOW USING SLUG */}
//         {brands.length > 0 && !hasActiveBrands && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#brands">
//                 Brand
//               </button>
//             </h2>
//             <div id="brands" className="accordion-collapse collapse">
//               <div className="accordion-body" style={{ maxHeight: "260px", overflowY: "auto" }}>
//                 {brands.map((b) => (
//                   <div key={b.slug} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`brand-${b.slug}`}
//                       checked={(filters.brandIds || []).includes(b.slug)}
//                       onChange={() => handleMultiChange("brandIds", b.slug)}
//                     />
//                     <label className="form-check-label" htmlFor={`brand-${b.slug}`}>
//                       {renderLabel(b.name, b.count)}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* SKIN TYPE - NOW CONSISTENTLY USING SLUG */}
//         {skinTypes.length > 0 && !hasActiveSkinTypes && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#skintypes">
//                 Skin Type
//                 {effectiveSkinTypeName && <span className="ms-2 text-muted" style={{ fontSize: 12 }}>› {effectiveSkinTypeName}</span>}
//               </button>
//             </h2>
//             <div id="skintypes" className="accordion-collapse collapse">
//               <div className="accordion-body" style={{ maxHeight: "260px", overflowY: "auto" }}>
//                 {skinTypes.map((st) => (
//                   <div key={st.slug} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`st-${st.slug}`}
//                       checked={(filters.skinTypes || []).includes(st.slug)}
//                       onChange={() => handleMultiChange("skinTypes", st.slug)}
//                     />
//                     <label className="form-check-label" htmlFor={`st-${st.slug}`}>
//                       {renderLabel(st.name, st.count)}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Rest of the filters (Formulation, Finish, Ingredient, Price, Discount, Rating) remain unchanged */}
//         {/* ... (same as your original code for formulations, finishes, ingredients, priceRange, discountRange, minRating) ... */}
//         {/* I kept them exactly as you had them because they were already correct. */}

//         {/* Formulation */}
//         {formulations.length > 0 && !hasActiveFormulations && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#formulations">
//                 Formulation
//               </button>
//             </h2>
//             <div id="formulations" className="accordion-collapse collapse">
//               <div className="accordion-body" style={{ maxHeight: "260px", overflowY: "auto" }}>
//                 {formulations.map((f) => (
//                   <div key={f._id} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`form-${f._id}`}
//                       checked={(filters.formulations || []).includes(f._id)}
//                       onChange={() => handleMultiChange("formulations", f._id)}
//                     />
//                     <label className="form-check-label" htmlFor={`form-${f._id}`}>
//                       {renderLabel(f.name, f.count)}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Finish */}
//         {finishes.length > 0 && !hasActiveFinishes && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#finishes">
//                 Finish
//               </button>
//             </h2>
//             <div id="finishes" className="accordion-collapse collapse">
//               <div className="accordion-body" style={{ maxHeight: "260px", overflowY: "auto" }}>
//                 {finishes.map((f) => (
//                   <div key={f.slug} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`fin-${f.slug}`}
//                       checked={(filters.finishes || []).includes(f.slug)}
//                       onChange={() => handleMultiChange("finishes", f.slug)}
//                     />
//                     <label className="form-check-label" htmlFor={`fin-${f.slug}`}>
//                       {renderLabel(f.name, f.count)}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Key Ingredient */}
//         {ingredients.length > 0 && !hasActiveIngredients && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#ingredients">
//                 Key Ingredient
//               </button>
//             </h2>
//             <div id="ingredients" className="accordion-collapse collapse">
//               <div className="accordion-body" style={{ maxHeight: "260px", overflowY: "auto" }}>
//                 {ingredients.map((i) => (
//                   <div key={i.slug} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`ing-${i.slug}`}
//                       checked={(filters.ingredients || []).includes(i.slug)}
//                       onChange={() => handleMultiChange("ingredients", i.slug)}
//                     />
//                     <label className="form-check-label" htmlFor={`ing-${i.slug}`}>
//                       {renderLabel(i.name, i.count)}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Price Range, Discount, Minimum Rating - unchanged */}
//         {!hasActivePriceRange && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#price">
//                 Price Range
//               </button>
//             </h2>
//             <div id="price" className="accordion-collapse collapse">
//               <div className="accordion-body">
//                 <select
//                   className="form-select"
//                   value={filters.priceRange ? JSON.stringify(filters.priceRange) : ""}
//                   onChange={(e) => handleSingleChange("priceRange", e.target.value ? JSON.parse(e.target.value) : null)}
//                 >
//                   <option value="">All prices</option>
//                   {priceRanges.map((p, i) => (
//                     <option key={i} value={JSON.stringify({ min: p.min, max: p.max })}>
//                       {p.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         )}

//         {!hasActiveDiscountRange && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#discount">
//                 Discount
//               </button>
//             </h2>
//             <div id="discount" className="accordion-collapse collapse">
//               <div className="accordion-body">
//                 <select
//                   className="form-select"
//                   value={filters.discountRange ? JSON.stringify(filters.discountRange) : ""}
//                   onChange={(e) => handleSingleChange("discountRange", e.target.value ? JSON.parse(e.target.value) : null)}
//                 >
//                   <option value="">Any discount</option>
//                   {discountRanges.map((d, i) => (
//                     <option key={i} value={JSON.stringify({ min: d.min })}>
//                       {d.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         )}

//         {!hasActiveRating && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#rating">
//                 Minimum Rating
//               </button>
//             </h2>
//             <div id="rating" className="accordion-collapse collapse">
//               <div className="accordion-body">
//                 <select
//                   className="form-select"
//                   value={filters.minRating || ""}
//                   onChange={(e) => handleSingleChange("minRating", e.target.value)}
//                 >
//                   <option value="">Any rating</option>
//                   {[4, 3, 2].map((r) => (
//                     <option key={r} value={r}>{r}+ Stars</option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {onClose && (
//         <div className="p-3 border-top d-lg-none">
//           <button className="btn btn-dark w-100" onClick={onClose}>
//             Show Results
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BrandFilter;














// // BrandFilter.jsx — FIXED: Now supports hierarchical categories + uses SLUGs where appropriate
// import React from "react";
// import { FaTimes } from "react-icons/fa";
// import { useLocation } from "react-router-dom";

// const BrandFilter = ({
//   filters,
//   setFilters,
//   onClose,
//   filterData = null,
//   trendingCategories = [],
//   activeCategorySlug = null,
//   activeCategoryName = "",
//   onClearCategory,
//   onCategoryPillClick,
//   // Skin type support (optional)
//   activeSkinTypeSlug = null,
//   activeSkinTypeName = "",
//   onClearSkinType,
// }) => {
//   const location = useLocation();
//   const locationSkinTypeSlug = location.state?.activeSkinTypeSlug;
//   const locationSkinTypeName = location.state?.activeSkinTypeName;

//   const effectiveSkinTypeSlug = activeSkinTypeSlug || locationSkinTypeSlug;
//   const effectiveSkinTypeName = activeSkinTypeName || locationSkinTypeName;

//   if (!filterData) {
//     return (
//       <div className="filter-wrapper border p-3" style={{ position: "sticky", top: "140px" }}>
//         <div className="d-flex align-items-center gap-2">
//           <div className="spinner-border spinner-border-sm text-secondary" role="status" />
//           <small className="text-muted">Loading filters...</small>
//         </div>
//       </div>
//     );
//   }

//   const {
//     brands = [],
//     categories = [],
//     skinTypes = [],
//     formulations = [],
//     finishes = [],
//     ingredients = [],
//     priceRanges = [],
//     discountRanges = [],
//   } = filterData;

//   /* ─── Helpers ───────────────────────────────────────────────────────────── */
//   const toggleInArray = (arr = [], value) =>
//     arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

//   const handleMultiChange = (key, value) =>
//     setFilters((prev) => ({ ...prev, [key]: toggleInArray(prev[key] || [], value) }));

//   const handleSingleChange = (key, value) =>
//     setFilters((prev) => ({ ...prev, [key]: value }));

//   const clearAll = () => {
//     setFilters({
//       brandIds: [], categoryIds: [], skinTypes: [], formulations: [],
//       finishes: [], ingredients: [], priceRange: null, discountRange: null,
//       minRating: "", sort: "recent",
//     });
//     if (onClearCategory) onClearCategory();
//     if (onClearSkinType) onClearSkinType();
//   };

//   const removeSingleValue = (key, val) =>
//     setFilters((prev) => ({ ...prev, [key]: (prev[key] || []).filter((v) => v !== val) }));

//   const getDisplayName = (key, val) => {
//     if (!val) return "";
//     switch (key) {
//       case "brandIds":
//         return brands.find((b) => b._id === val || b.slug === val)?.name || val;
//       case "categoryIds":
//         return categories.find((c) => c._id === val || c.slug === val)?.name || val;
//       case "skinTypes":
//         return skinTypes.find((s) => s.slug === val || s.name === val)?.name || val;
//       case "formulations":
//         return formulations.find((f) => f._id === val)?.name || val;
//       case "finishes":
//         return finishes.find((f) => f.slug === val)?.name || val;
//       case "ingredients":
//         return ingredients.find((i) => i.slug === val)?.name || val;
//       case "priceRange":
//         try {
//           const match = priceRanges.find((p) => p.min === val.min && p.max === val.max);
//           return match?.label || `₹${val.min} — ₹${val.max || "above"}`;
//         } catch { return "Price"; }
//       case "discountRange":
//         try {
//           const match = discountRanges.find((d) => d.min === val.min);
//           return match?.label || `${val.min}%+ Off`;
//         } catch { return "Discount"; }
//       case "minRating": return `${val}★ & up`;
//       case "sort":
//         return val === "recent" ? "" : val.replace(/([A-Z])/g, " $1").trim();
//       default: return val;
//     }
//   };

//   /* ─── Hierarchical Category Depth Helper ─────────────────────────────── */
//   const getCategoryDepth = (cat, allCats) => {
//     let depth = 0;
//     let current = cat;
//     while (current && current.parent) {
//       const parent = allCats.find((c) => c._id === current.parent);
//       if (parent) {
//         depth++;
//         current = parent;
//       } else {
//         break;
//       }
//     }
//     return depth;
//   };

//   /* ─── Active Chips ──────────────────────────────────────────────────────── */
//   const getActiveChips = () => {
//     const chips = [];

//     // Category pill (from trending / category page)
//     if (activeCategorySlug) {
//       const categoryName = activeCategoryName ||
//         trendingCategories.find((c) => c.slug === activeCategorySlug)?.name ||
//         activeCategorySlug;

//       chips.push({
//         group: "categoryPill",
//         value: activeCategorySlug,
//         label: categoryName,
//         isPill: true,
//       });
//     }

//     // Skin Type pill
//     if (effectiveSkinTypeSlug) {
//       const skinTypeName = effectiveSkinTypeName ||
//         skinTypes.find((s) => s.slug === effectiveSkinTypeSlug)?.name ||
//         effectiveSkinTypeSlug;

//       chips.push({
//         group: "skinTypePill",
//         value: effectiveSkinTypeSlug,
//         label: skinTypeName,
//         isPill: true,
//         isSkinType: true,
//       });
//     }

//     // Normal filters
//     ["brandIds", "categoryIds", "skinTypes", "formulations", "finishes", "ingredients"].forEach((k) => {
//       (filters[k] || []).forEach((v) => {
//         const label = getDisplayName(k, v);
//         if (label) chips.push({ group: k, value: v, label });
//       });
//     });

//     if (filters.priceRange) chips.push({ group: "priceRange", label: getDisplayName("priceRange", filters.priceRange) });
//     if (filters.discountRange) chips.push({ group: "discountRange", label: getDisplayName("discountRange", filters.discountRange) });
//     if (filters.minRating) chips.push({ group: "minRating", label: getDisplayName("minRating", filters.minRating) });
//     if (filters.sort && filters.sort !== "recent") chips.push({ group: "sort", label: getDisplayName("sort", filters.sort) });

//     return chips.filter((c) => c.label);
//   };

//   const activeChips = getActiveChips();
//   const hasActiveFilter = activeChips.length > 0;

//   const renderLabel = (name, count) => (
//     <>
//       {name}
//       {count !== undefined && count !== null && <span className="text-muted small ms-1">({count})</span>}
//     </>
//   );

//   /* ─── Hide/Show Logic ───────────────────────────────────────────────────── */
//   const isInSubCategoryView = !!activeCategorySlug;
//   const showCategoryPills = trendingCategories.length > 0;
//   const showCategoryCheckboxes = categories.length > 0;   // ← Changed as requested

//   const hasActiveBrands = (filters.brandIds || []).length > 0;
//   const hasActiveCategories = (filters.categoryIds || []).length > 0;
//   const hasActiveSkinTypes = (filters.skinTypes || []).length > 0 || !!effectiveSkinTypeSlug;
//   const hasActiveFormulations = (filters.formulations || []).length > 0;
//   const hasActiveFinishes = (filters.finishes || []).length > 0;
//   const hasActiveIngredients = (filters.ingredients || []).length > 0;
//   const hasActivePriceRange = !!filters.priceRange;
//   const hasActiveDiscountRange = !!filters.discountRange;
//   const hasActiveRating = !!filters.minRating;

//   /* ─── Render ────────────────────────────────────────────────────────────── */
//   return (
//     <div className="filter-wrapper border" style={{ position: "sticky", top: "140px" }}>
//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
//         <h6 className="fw-bold mb-0">Filters</h6>
//         {hasActiveFilter && (
//           <button className="btn btn-link text-muted p-0 small" onClick={clearAll}>
//             Reset
//           </button>
//         )}
//       </div>

//       {/* Selected Chips */}
//       {hasActiveFilter && (
//         <div className="px-3 pb-3 pt-2 border-bottom">
//           <div className="d-flex justify-content-between mb-2">
//             <small className="text-muted fw-semibold">Selected</small>
//             <button className="btn btn-link btn-sm text-danger p-0" onClick={clearAll}>
//               Clear All
//             </button>
//           </div>
//           <div 
//             className="mb-5 overflow-y-scroll" 
//             style={{ 
//               display: "block", 
//               flexWrap: "wrap", 
//               gap: "6px", 
//               maxHeight: "140px" 
//             }}
//           >
//             {activeChips.map((chip) => (
//               <span
//                 key={`${chip.group}-${chip.value || "s"}`}
//                 className={`badge rounded-pill px-3 py-2 d-flex align-items-center gap-1 mt-0 ms-0 ${
//                   chip.isPill ? "bg-dark text-white" : "bg-secondary text-white"
//                 }`}
//                 style={{ fontWeight: chip.isPill ? 600 : 400, maxWidth: "100%", borderRadius: '25px' }}
//                 title={chip.isPill ? (chip.isSkinType ? "Remove skin type filter" : "Remove category filter") : `Remove ${chip.label}`}
//                 onClick={() => {
//                   if (chip.isPill && chip.isSkinType) {
//                     if (onClearSkinType) onClearSkinType();
//                   } else if (chip.isPill) {
//                     if (onClearCategory) onClearCategory();
//                   } else if (chip.group === "priceRange" || chip.group === "discountRange") {
//                     setFilters((prev) => ({ ...prev, [chip.group]: null }));
//                   } else {
//                     removeSingleValue(chip.group, chip.value);
//                   }
//                 }}
//               >
//                 {chip.isPill && <span style={{ fontSize: 10, opacity: 0.75 }}>{chip.isSkinType ? "Skin Type: " : "Category: "}</span>}
//                 <span className="filter-selected-code" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}>
//                   {chip.label}
//                 </span>
//                 <FaTimes size={10} style={{ flexShrink: 0 }} />
//               </span>
//             ))}
//           </div>
//         </div>
//       )}

//       <div className="accordion accordion-flush" id="filterAccordion">
//         {/* CATEGORY - Updated with hierarchical support */}
//         {(showCategoryPills || showCategoryCheckboxes) && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#categories" aria-expanded="true">
//                 Category
//                 {activeCategoryName && <span className="ms-2 text-muted" style={{ fontSize: 12 }}>› {activeCategoryName}</span>}
//               </button>
//             </h2>
//             <div id="categories" className="accordion-collapse collapse show">
//               <div className="accordion-body p-0">
//                 {showCategoryCheckboxes && (
//                   <div style={{ maxHeight: "350px", overflowY: "auto", padding: "12px 16px" }}>
//                     {categories.map((c) => {
//                       const depth = getCategoryDepth(c, categories);
//                       return (
//                         <div
//                           key={c._id || c.slug}
//                           className="form-check mb-2"
//                           style={{ marginLeft: `${depth * 15}px` }}
//                         >
//                           <input
//                             className="form-check-input"
//                             type="checkbox"
//                             id={`cat-${c._id || c.slug}`}
//                             checked={(filters.categoryIds || []).includes(c._id)}
//                             onChange={() => {
//                               if (onCategoryPillClick) {
//                                 onCategoryPillClick(c);
//                               } else {
//                                 handleMultiChange("categoryIds", c._id);
//                               }
//                             }}
//                           />
//                           <label
//                             className="form-check-label"
//                             htmlFor={`cat-${c._id || c.slug}`}
//                             style={{ cursor: "pointer", fontWeight: depth === 0 ? "600" : "400" }}
//                             onClick={(e) => {
//                               if (onCategoryPillClick) {
//                                 e.preventDefault();
//                                 onCategoryPillClick(c);
//                               }
//                             }}
//                           >
//                             {renderLabel(c.name, c.count)}
//                           </label>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* BRAND */}
//         {brands.length > 0 && !hasActiveBrands && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#brands">
//                 Brand
//               </button>
//             </h2>
//             <div id="brands" className="accordion-collapse collapse">
//               <div className="accordion-body" style={{ maxHeight: "260px", overflowY: "auto" }}>
//                 {brands.map((b) => (
//                   <div key={b.slug} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`brand-${b.slug}`}
//                       checked={(filters.brandIds || []).includes(b.slug)}
//                       onChange={() => handleMultiChange("brandIds", b.slug)}
//                     />
//                     <label className="form-check-label" htmlFor={`brand-${b.slug}`}>
//                       {renderLabel(b.name, b.count)}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* SKIN TYPE */}
//         {skinTypes.length > 0 && !hasActiveSkinTypes && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#skintypes">
//                 Skin Type
//                 {effectiveSkinTypeName && <span className="ms-2 text-muted" style={{ fontSize: 12 }}>› {effectiveSkinTypeName}</span>}
//               </button>
//             </h2>
//             <div id="skintypes" className="accordion-collapse collapse">
//               <div className="accordion-body" style={{ maxHeight: "260px", overflowY: "auto" }}>
//                 {skinTypes.map((st) => (
//                   <div key={st.slug} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`st-${st.slug}`}
//                       checked={(filters.skinTypes || []).includes(st.slug)}
//                       onChange={() => handleMultiChange("skinTypes", st.slug)}
//                     />
//                     <label className="form-check-label" htmlFor={`st-${st.slug}`}>
//                       {renderLabel(st.name, st.count)}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Formulation, Finish, Ingredient, Price, Discount, Rating - Unchanged */}
//         {formulations.length > 0 && !hasActiveFormulations && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#formulations">
//                 Formulation
//               </button>
//             </h2>
//             <div id="formulations" className="accordion-collapse collapse">
//               <div className="accordion-body" style={{ maxHeight: "260px", overflowY: "auto" }}>
//                 {formulations.map((f) => (
//                   <div key={f._id} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`form-${f._id}`}
//                       checked={(filters.formulations || []).includes(f._id)}
//                       onChange={() => handleMultiChange("formulations", f._id)}
//                     />
//                     <label className="form-check-label" htmlFor={`form-${f._id}`}>
//                       {renderLabel(f.name, f.count)}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {finishes.length > 0 && !hasActiveFinishes && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#finishes">
//                 Finish
//               </button>
//             </h2>
//             <div id="finishes" className="accordion-collapse collapse">
//               <div className="accordion-body" style={{ maxHeight: "260px", overflowY: "auto" }}>
//                 {finishes.map((f) => (
//                   <div key={f.slug} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`fin-${f.slug}`}
//                       checked={(filters.finishes || []).includes(f.slug)}
//                       onChange={() => handleMultiChange("finishes", f.slug)}
//                     />
//                     <label className="form-check-label" htmlFor={`fin-${f.slug}`}>
//                       {renderLabel(f.name, f.count)}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {ingredients.length > 0 && !hasActiveIngredients && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#ingredients">
//                 Key Ingredient
//               </button>
//             </h2>
//             <div id="ingredients" className="accordion-collapse collapse">
//               <div className="accordion-body" style={{ maxHeight: "260px", overflowY: "auto" }}>
//                 {ingredients.map((i) => (
//                   <div key={i.slug} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`ing-${i.slug}`}
//                       checked={(filters.ingredients || []).includes(i.slug)}
//                       onChange={() => handleMultiChange("ingredients", i.slug)}
//                     />
//                     <label className="form-check-label" htmlFor={`ing-${i.slug}`}>
//                       {renderLabel(i.name, i.count)}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Price Range */}
//         {!hasActivePriceRange && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#price">
//                 Price Range
//               </button>
//             </h2>
//             <div id="price" className="accordion-collapse collapse">
//               <div className="accordion-body">
//                 <select
//                   className="form-select"
//                   value={filters.priceRange ? JSON.stringify(filters.priceRange) : ""}
//                   onChange={(e) => handleSingleChange("priceRange", e.target.value ? JSON.parse(e.target.value) : null)}
//                 >
//                   <option value="">All prices</option>
//                   {priceRanges.map((p, i) => (
//                     <option key={i} value={JSON.stringify({ min: p.min, max: p.max })}>
//                       {p.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Discount */}
//         {!hasActiveDiscountRange && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#discount">
//                 Discount
//               </button>
//             </h2>
//             <div id="discount" className="accordion-collapse collapse">
//               <div className="accordion-body">
//                 <select
//                   className="form-select"
//                   value={filters.discountRange ? JSON.stringify(filters.discountRange) : ""}
//                   onChange={(e) => handleSingleChange("discountRange", e.target.value ? JSON.parse(e.target.value) : null)}
//                 >
//                   <option value="">Any discount</option>
//                   {discountRanges.map((d, i) => (
//                     <option key={i} value={JSON.stringify({ min: d.min })}>
//                       {d.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Minimum Rating */}
//         {!hasActiveRating && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#rating">
//                 Minimum Rating
//               </button>
//             </h2>
//             <div id="rating" className="accordion-collapse collapse">
//               <div className="accordion-body">
//                 <select
//                   className="form-select"
//                   value={filters.minRating || ""}
//                   onChange={(e) => handleSingleChange("minRating", e.target.value)}
//                 >
//                   <option value="">Any rating</option>
//                   {[4, 3, 2].map((r) => (
//                     <option key={r} value={r}>{r}+ Stars</option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {onClose && (
//         <div className="p-3 border-top d-lg-none">
//           <button className="btn btn-dark w-100" onClick={onClose}>
//             Show Results
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BrandFilter;















// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import { FaTimes, FaChevronRight, FaChevronDown, FaFilter } from "react-icons/fa";

// const BrandFilter = ({
//   filters,
//   setFilters,
//   onClose,
//   filterData = null,
//   activeCategorySlug = null,
//   activeCategoryName = "",
//   onClearCategory,
//   onClearSkinType,
// }) => {
//   // State for Category Tree expansion
//   const [expandedIds, setExpandedIds] = useState(new Set());

//   const {
//     brands = [],
//     categories = [],
//     skinTypes = [],
//     formulations = [],
//     finishes = [],
//     ingredients = [],
//     priceRanges = [],
//     discountRanges = [],
//   } = filterData || {};

//   /* ─── MULTI-FILTER CORE LOGIC ──────────────────────────────────── */

//   // This handles multiple selections (ticking/unticking) for ANY section
//   const handleToggleFilter = (key, value) => {
//     setFilters((prev) => {
//       const currentList = prev[key] || [];
//       const isAlreadySelected = currentList.some(item => 
//         (typeof item === 'object' && item !== null) 
//           ? JSON.stringify(item) === JSON.stringify(value) 
//           : item === value
//       );

//       const newList = isAlreadySelected
//         ? currentList.filter((item) => 
//             (typeof item === 'object' && item !== null) 
//               ? JSON.stringify(item) !== JSON.stringify(value) 
//               : item !== value
//           )
//         : [...currentList, value];

//       return { ...prev, [key]: newList };
//     });
//   };

//   const handleSingleChange = (key, value) =>
//     setFilters((prev) => ({ ...prev, [key]: value }));

//   const clearAll = () => {
//     setFilters({
//       brandIds: [], categoryIds: [], skinTypes: [], formulations: [],
//       finishes: [], ingredients: [], discountRange: [], priceRange: null,
//       minRating: "", sort: "recent",
//     });
//     setExpandedIds(new Set());
//     if (onClearCategory) onClearCategory();
//     if (onClearSkinType) onClearSkinType();
//   };

//   /* ─── CATEGORY HIERARCHY HELPERS ────────────────────────────────── */

//   const childrenMap = useMemo(() => {
//     const map = {};
//     categories.forEach((cat) => {
//       const parentId = cat.parent || null;
//       if (!map[parentId]) map[parentId] = [];
//       map[parentId].push(cat);
//     });
//     return map;
//   }, [categories]);

//   const rootCategories = useMemo(() => {
//     return categories.filter((cat) => !cat.parent || !categories.some(c => c._id === cat.parent));
//   }, [categories]);

//   const toggleExpand = (catId) => {
//     setExpandedIds((prev) => {
//       const next = new Set(prev);
//       if (next.has(catId)) next.delete(catId);
//       else next.add(catId);
//       return next;
//     });
//   };

//   /* ─── ACTIVE CHIPS LOGIC ────────────────────────────────────────── */

//   const getActiveChips = () => {
//     const chips = [];
//     const findName = (list, val, keyField = "slug") => 
//       list.find(i => i[keyField] === val || i._id === val || i.slug === val)?.name || val;

//     // Map all array-based filters to chips
//     const multiSections = [
//       { key: "brandIds", list: brands, field: "slug" },
//       { key: "categoryIds", list: categories, field: "_id" },
//       { key: "skinTypes", list: skinTypes, field: "slug" },
//       { key: "formulations", list: formulations, field: "_id" },
//       { key: "finishes", list: finishes, field: "slug" },
//       { key: "ingredients", list: ingredients, field: "slug" }
//     ];

//     multiSections.forEach(sec => {
//       (filters[sec.key] || []).forEach(v => {
//         chips.push({ group: sec.key, val: v, label: findName(sec.list, v, sec.field) });
//       });
//     });

//     // Discount Chips (Object based)
//     (filters.discountRange || []).forEach(v => {
//       const match = discountRanges.find(d => d.min === v.min);
//       chips.push({ group: "discountRange", val: v, label: match?.label || `${v.min}% Off` });
//     });

//     if (filters.priceRange) chips.push({ group: "priceRange", val: null, label: filters.priceRange.label || "Price Filter" });

//     return chips;
//   };

//   const activeChips = getActiveChips();

//   /* ─── RECURSIVE CATEGORY RENDER ────────────────────────────────── */

//   const renderCategoryNode = (cat, depth = 0) => {
//     const children = childrenMap[cat._id] || [];
//     const hasChildren = children.length > 0;
//     const isExpanded = expandedIds.has(cat._id);
//     const isChecked = (filters.categoryIds || []).includes(cat._id);

//     return (
//       <div key={cat._id || cat.slug} className="mb-1">
//         <div className="d-flex align-items-center" style={{ marginLeft: `${depth * 12}px` }}>
//           <span onClick={() => toggleExpand(cat._id)} style={{ width: 20, cursor: "pointer", color: '#666' }}>
//             {hasChildren && (isExpanded ? <FaChevronDown size={10}/> : <FaChevronRight size={10}/>)}
//           </span>
//           <div className="form-check mb-0">
//             <input className="form-check-input" type="checkbox" id={`cat-${cat._id}`} checked={isChecked} onChange={() => handleToggleFilter("categoryIds", cat._id)} />
//             <label className={`form-check-label ${isChecked ? 'fw-bold text-primary' : ''}`} htmlFor={`cat-${cat._id}`} style={{ cursor: 'pointer', fontSize: '14px' }}>
//               {cat.name} {cat.count > 0 && <small className="text-muted">({cat.count})</small>}
//             </label>
//           </div>
//         </div>
//         {isExpanded && children.map(child => renderCategoryNode(child, depth + 1))}
//       </div>
//     );
//   };

//   if (!filterData) return <div className="p-4 text-center"><div className="spinner-border text-primary" /></div>;

//   return (
//     <div className="filter-sidebar border bg-white shadow-sm" style={{ position: "sticky", top: "100px", borderRadius: "12px", overflow: "hidden" }}>

//       {/* 1. Header */}
//       <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light">
//         <h6 className="mb-0 fw-bold"><FaFilter className="me-2"/>Filters</h6>
//         {activeChips.length > 0 && (
//           <button className="btn btn-sm btn-link text-danger text-decoration-none fw-bold p-0" onClick={clearAll}>Reset All</button>
//         )}
//       </div>

//       {/* 2. Selected Chips Area */}
//       {activeChips.length > 0 && (
//         <div className="p-2 border-bottom d-flex flex-wrap gap-1 bg-white">
//           {activeChips.map((chip, idx) => (
//             <span key={idx} className="badge bg-dark text-white rounded-pill px-2 py-1 d-flex align-items-center gap-1" style={{ fontSize: '11px', fontWeight: '400' }}>
//               {chip.label}
//               <FaTimes style={{ cursor: "pointer" }} onClick={() => {
//                 if(chip.group === "priceRange") handleSingleChange("priceRange", null);
//                 else handleToggleFilter(chip.group, chip.val);
//               }} />
//             </span>
//           ))}
//         </div>
//       )}

//       {/* 3. Multi-Select Accordions */}
//       <div className="accordion accordion-flush" id="mainFilterAccordion">

//         {/* BRAND SECTION (Multiple) */}
//         <div className="accordion-item">
//           <h2 className="accordion-header"><button className="accordion-button fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseBrands">Brands</button></h2>
//           <div id="collapseBrands" className="accordion-collapse collapse show">
//             <div className="accordion-body p-3" style={{ maxHeight: "250px", overflowY: "auto" }}>
//               {brands.map(b => (
//                 <div key={b.slug} className="form-check mb-2">
//                   <input className="form-check-input" type="checkbox" id={`brand-${b.slug}`} checked={(filters.brandIds || []).includes(b.slug)} onChange={() => handleToggleFilter("brandIds", b.slug)} />
//                   <label className={`form-check-label ${ (filters.brandIds || []).includes(b.slug) ? 'fw-bold text-primary' : '' }`} htmlFor={`brand-${b.slug}`} style={{ cursor: 'pointer' }}>{b.name}</label>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* CATEGORY SECTION (Hierarchical Multiple) */}
//         <div className="accordion-item">
//           <h2 className="accordion-header"><button className="accordion-button fw-semibold collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCats">Categories</button></h2>
//           <div id="collapseCats" className="accordion-collapse collapse">
//             <div className="accordion-body p-3" style={{ maxHeight: "300px", overflowY: "auto" }}>
//               {rootCategories.map(cat => renderCategoryNode(cat))}
//             </div>
//           </div>
//         </div>

//         {/* SKIN TYPE SECTION (Multiple) */}
//         <div className="accordion-item">
//           <h2 className="accordion-header"><button className="accordion-button fw-semibold collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSkin">Skin Type</button></h2>
//           <div id="collapseSkin" className="accordion-collapse collapse">
//             <div className="accordion-body p-3">
//               {skinTypes.map(st => (
//                 <div key={st.slug} className="form-check mb-2">
//                   <input className="form-check-input" type="checkbox" id={`st-${st.slug}`} checked={(filters.skinTypes || []).includes(st.slug)} onChange={() => handleToggleFilter("skinTypes", st.slug)} />
//                   <label className={`form-check-label ${ (filters.skinTypes || []).includes(st.slug) ? 'fw-bold text-primary' : '' }`} htmlFor={`st-${st.slug}`} style={{ cursor: 'pointer' }}>{st.name}</label>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* FINISH SECTION (Multiple) */}
//         {finishes.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header"><button className="accordion-button fw-semibold collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFinish">Finish</button></h2>
//             <div id="collapseFinish" className="accordion-collapse collapse">
//               <div className="accordion-body p-3">
//                 {finishes.map(f => (
//                   <div key={f.slug} className="form-check mb-2">
//                     <input className="form-check-input" type="checkbox" id={`fin-${f.slug}`} checked={(filters.finishes || []).includes(f.slug)} onChange={() => handleToggleFilter("finishes", f.slug)} />
//                     <label className={`form-check-label ${ (filters.finishes || []).includes(f.slug) ? 'fw-bold text-primary' : '' }`} htmlFor={`fin-${f.slug}`} style={{ cursor: 'pointer' }}>{f.name}</label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* DISCOUNT SECTION (Multiple) */}
//         {discountRanges.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header"><button className="accordion-button fw-semibold collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDiscount">Discount</button></h2>
//             <div id="collapseDiscount" className="accordion-collapse collapse">
//               <div className="accordion-body p-3">
//                 {discountRanges.map((d, i) => (
//                   <div key={i} className="form-check mb-2">
//                     <input className="form-check-input" type="checkbox" id={`disc-${i}`} checked={(filters.discountRange || []).some(v => v.min === d.min)} onChange={() => handleToggleFilter("discountRange", { min: d.min })} />
//                     <label className={`form-check-label ${ (filters.discountRange || []).some(v => v.min === d.min) ? 'fw-bold text-primary' : '' }`} htmlFor={`disc-${i}`} style={{ cursor: 'pointer' }}>{d.label}</label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* PRICE RANGE (Single Select Dropdown) */}
//         <div className="accordion-item">
//           <h2 className="accordion-header"><button className="accordion-button fw-semibold collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapsePrice">Price Range</button></h2>
//           <div id="collapsePrice" className="accordion-collapse collapse">
//             <div className="accordion-body p-3">
//               <select className="form-select form-select-sm" value={filters.priceRange ? JSON.stringify(filters.priceRange) : ""} onChange={(e) => handleSingleChange("priceRange", e.target.value ? JSON.parse(e.target.value) : null)}>
//                 <option value="">All Prices</option>
//                 {priceRanges.map((p, i) => <option key={i} value={JSON.stringify(p)}>{p.label}</option>)}
//               </select>
//             </div>
//           </div>
//         </div>
//       </div>

//       {onClose && (
//         <div className="p-3 d-lg-none bg-light border-top">
//           <button className="btn btn-dark w-100 fw-bold" onClick={onClose}>Show Results</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BrandFilter;



















// import React, { useState, useMemo } from "react";
// import { FaTimes, FaChevronRight, FaChevronDown, FaFilter } from "react-icons/fa";

// const BrandFilter = ({
//   filters,
//   setFilters,
//   onClose,
//   filterData = null,
//   onClearCategory,
// }) => {
//   const [expandedIds, setExpandedIds] = useState(new Set());

//   const {
//     brands = [],
//     categories = [],
//     skinTypes = [],
//     formulations = [],
//     finishes = [],
//     ingredients = [],
//     priceRanges = [],
//     discountRanges = [],
//   } = filterData || {};

//   /* ─── CORE SELECTION LOGIC ────────────────────────────────────── */

//   // Handles multiple selection for arrays (brands, categories, etc.)
//   const handleToggleFilter = (key, value) => {
//     setFilters((prev) => {
//       const currentList = prev[key] || [];
//       const isAlreadySelected = currentList.includes(value);

//       const newList = isAlreadySelected
//         ? currentList.filter((item) => item !== value)
//         : [...currentList, value];

//       return { ...prev, [key]: newList };
//     });
//   };

//   // Handles Price Selection (sets min/max separately for backend)
//   const handlePriceSelection = (range) => {
//     setFilters((prev) => ({
//       ...prev,
//       minPrice: range?.min,
//       maxPrice: range?.max,
//     }));
//   };

//   // Handles Discount Selection (sets discountMin for backend)
//   const handleDiscountSelection = (minVal) => {
//     setFilters((prev) => ({
//       ...prev,
//       discountMin: prev.discountMin === minVal ? undefined : minVal,
//     }));
//   };

//   const clearAll = () => {
//     setFilters({
//       brandIds: [],
//       categoryIds: [],
//       skinTypes: [],
//       formulations: [],
//       finishes: [],
//       ingredients: [],
//       minPrice: undefined,
//       maxPrice: undefined,
//       discountMin: undefined,
//       sort: "recent",
//     });
//     setExpandedIds(new Set());
//     if (onClearCategory) onClearCategory();
//   };

//   /* ─── CATEGORY HIERARCHY HELPERS ────────────────────────────────── */

//   const childrenMap = useMemo(() => {
//     const map = {};
//     categories.forEach((cat) => {
//       const parentId = cat.parent || null;
//       if (!map[parentId]) map[parentId] = [];
//       map[parentId].push(cat);
//     });
//     return map;
//   }, [categories]);

//   const rootCategories = useMemo(() => {
//     return categories.filter((cat) => !cat.parent || !categories.some((c) => c._id === cat.parent));
//   }, [categories]);

//   const toggleExpand = (catId) => {
//     setExpandedIds((prev) => {
//       const next = new Set(prev);
//       if (next.has(catId)) next.delete(catId);
//       else next.add(catId);
//       return next;
//     });
//   };

//   /* ─── ACTIVE CHIPS LOGIC ────────────────────────────────────────── */

//   const activeChips = useMemo(() => {
//     const chips = [];

//     const sections = [
//       { key: "brandIds", list: brands, field: "slug" },
//       { key: "categoryIds", list: categories, field: "_id" },
//       { key: "skinTypes", list: skinTypes, field: "slug" },
//       { key: "formulations", list: formulations, field: "slug" },
//       { key: "finishes", list: finishes, field: "slug" },
//       { key: "ingredients", list: ingredients, field: "slug" },
//     ];

//     sections.forEach((sec) => {
//       (filters[sec.key] || []).forEach((v) => {
//         const item = sec.list.find((i) => i[sec.field] === v);
//         chips.push({ group: sec.key, val: v, label: item?.name || v });
//       });
//     });

//     if (filters.discountMin) {
//       const d = discountRanges.find((dr) => dr.min === filters.discountMin);
//       chips.push({ group: "discountMin", val: filters.discountMin, label: d?.label || `${filters.discountMin}% Off` });
//     }

//     if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
//       const p = priceRanges.find((pr) => pr.min === filters.minPrice && pr.max === filters.maxPrice);
//       chips.push({ group: "price", val: null, label: p?.label || "Price Filter" });
//     }

//     return chips;
//   }, [filters, filterData]);

//   /* ─── RECURSIVE CATEGORY RENDER ────────────────────────────────── */

//   const renderCategoryNode = (cat, depth = 0) => {
//     const children = childrenMap[cat._id] || [];
//     const hasChildren = children.length > 0;
//     const isExpanded = expandedIds.has(cat._id);
//     const isChecked = (filters.categoryIds || []).includes(cat._id);

//     return (
//       <div key={cat._id} className="mb-1">
//         <div className="d-flex align-items-center" style={{ marginLeft: `${depth * 12}px` }}>
//           <span onClick={() => toggleExpand(cat._id)} style={{ width: 20, cursor: "pointer", color: "#666" }}>
//             {hasChildren && (isExpanded ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />)}
//           </span>
//           <div className="form-check mb-0 flex-grow-1">
//             <input
//               className="form-check-input"
//               type="checkbox"
//               id={`cat-${cat._id}`}
//               checked={isChecked}
//               onChange={() => handleToggleFilter("categoryIds", cat._id)}
//             />
//             <label
//               className={`form-check-label d-flex justify-content-between ${isChecked ? "fw-bold text-primary" : ""}`}
//               htmlFor={`cat-${cat._id}`}
//               style={{ cursor: "pointer", fontSize: "14px" }}
//             >
//               <span>{cat.name}</span>
//               {cat.count > 0 && <small className="text-muted">({cat.count})</small>}
//             </label>
//           </div>
//         </div>
//         {isExpanded && children.map((child) => renderCategoryNode(child, depth + 1))}
//       </div>
//     );
//   };

//   if (!filterData) return <div className="p-4 text-center"><div className="spinner-border text-primary" /></div>;

//   return (
//     <div className="filter-sidebar border bg-white shadow-sm page-title-main-name" style={{ position: "sticky", top: "140px", borderRadius: "12px", overflowY: "hidden" }}>
//       {/* 1. Header */}
//       <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light">
//         <h6 className="mb-0 fw-bold">Filters</h6>
//         {activeChips.length > 0 && (
//           <button className="btn btn-sm btn-link text-danger text-decoration-none fw-bold p-0" onClick={clearAll}>Reset All</button>
//         )}
//       </div>

//       {/* 2. Chips Area */}
//       {activeChips.length > 0 && (
//         <div className="height-selcted-section">
//           {activeChips.map((chip, idx) => (
//             <span key={idx} className="height-selcted-section-sub" style={{ fontSize: "11px", fontWeight: "400" }}>
//               {chip.label}
//               <FaTimes
//                 style={{ cursor: "pointer" }}
//                 onClick={() => {
//                   if (chip.group === "price") handlePriceSelection(null);
//                   else if (chip.group === "discountMin") handleDiscountSelection(null);
//                   else handleToggleFilter(chip.group, chip.val);
//                 }}
//               />
//             </span>
//           ))}
//         </div>
//       )}

//       {/* 3. Filter Accordions */}
//       <div className="accordion accordion-flush" id="mainFilterAccordion">

//         {/* Categories (Hierarchical) */}
//         <div className="accordion-item">
//           <h2 className="accordion-header pb-0 mb-0">
//             <button className="accordion-button text-black fw-normal" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCats">Categories</button>
//           </h2>
//           <div id="collapseCats" className="accordion-collapse collapse show">
//             <div className="accordion-body p-3" style={{ maxHeight: "300px", overflowY: "auto" }}>
//               {rootCategories.map((cat) => renderCategoryNode(cat))}
//             </div>
//           </div>
//         </div>

//         {/* Brands */}
//         <div className="accordion-item">
//           <h2 className="accordion-header">
//             <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseBrands">Brands</button>
//           </h2>
//           <div id="collapseBrands" className="accordion-collapse collapse">
//             <div className="accordion-body p-3" style={{ maxHeight: "250px", overflowY: "auto" }}>
//               {brands.map((b) => (
//                 <div key={b.slug} className="form-check mb-2">
//                   <input
//                     className="form-check-input"
//                     type="checkbox"
//                     id={`brand-${b.slug}`}
//                     checked={(filters.brandIds || []).includes(b.slug)}
//                     onChange={() => handleToggleFilter("brandIds", b.slug)}
//                   />
//                   <label className={`form-check-label d-flex justify-content-between w-100 ${(filters.brandIds || []).includes(b.slug) ? "fw-bold text-primary" : ""}`} htmlFor={`brand-${b.slug}`} style={{ cursor: "pointer" }}>
//                     <span>{b.name}</span>
//                     <small className="text-muted">({b.count})</small>
//                   </label>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Skin Type */}
//         <div className="accordion-item">
//           <h2 className="accordion-header">
//             <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSkin">Skin Type</button>
//           </h2>
//           <div id="collapseSkin" className="accordion-collapse collapse">
//             <div className="accordion-body p-3">
//               {skinTypes.map((st) => (
//                 <div key={st.slug} className="form-check mb-2">
//                   <input
//                     className="form-check-input"
//                     type="checkbox"
//                     id={`st-${st.slug}`}
//                     checked={(filters.skinTypes || []).includes(st.slug)}
//                     onChange={() => handleToggleFilter("skinTypes", st.slug)}
//                   />
//                   <label className={`form-check-label d-flex justify-content-between w-100 ${(filters.skinTypes || []).includes(st.slug) ? "fw-bold text-primary" : ""}`} htmlFor={`st-${st.slug}`} style={{ cursor: "pointer" }}>
//                     <span>{st.name}</span>
//                     <small className="text-muted">({st.count})</small>
//                   </label>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Discount (Based on discountMin) */}
//         {discountRanges.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDiscount">Discount</button>
//             </h2>
//             <div id="collapseDiscount" className="accordion-collapse collapse">
//               <div className="accordion-body p-3">
//                 {discountRanges.map((d, i) => (
//                   <div key={i} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`disc-${i}`}
//                       checked={filters.discountMin === d.min}
//                       onChange={() => handleDiscountSelection(d.min)}
//                     />
//                     <label className={`form-check-label d-flex justify-content-between w-100 ${filters.discountMin === d.min ? "fw-bold text-primary" : ""}`} htmlFor={`disc-${i}`} style={{ cursor: "pointer" }}>
//                       <span>{d.label}</span>
//                       <small className="text-muted">({d.count})</small>
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Price Range (Radio Select) */}
//         <div className="accordion-item">
//           <h2 className="accordion-header">
//             <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapsePrice">Price Range</button>
//           </h2>
//           <div id="collapsePrice" className="accordion-collapse collapse">
//             <div className="accordion-body p-3">
//               {priceRanges.map((p, i) => {
//                 const isSelected = filters.minPrice === p.min && filters.maxPrice === p.max;
//                 return (
//                   <div key={i} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="radio"
//                       name="priceRangeRadio"
//                       id={`price-${i}`}
//                       checked={isSelected}
//                       onChange={() => handlePriceSelection(p)}
//                     />
//                     <label className={`form-check-label ${isSelected ? "fw-bold text-primary" : ""}`} htmlFor={`price-${i}`} style={{ cursor: "pointer" }}>
//                       {p.label}
//                     </label>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>

//         {/* Dynamic Formulation/Finish/Ingredients */}
//         {[
//           { id: "collapseForm", title: "Formulation", key: "formulations", data: formulations },
//           { id: "collapseFinish", title: "Finish", key: "finishes", data: finishes },
//           { id: "collapseIng", title: "Ingredients", key: "ingredients", data: ingredients }
//         ].map(section => section.data.length > 0 && (
//           <div className="accordion-item" key={section.key}>
//             <h2 className="accordion-header">
//               <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#${section.id}`}>{section.title}</button>
//             </h2>
//             <div id={section.id} className="accordion-collapse collapse">
//               <div className="accordion-body p-3" style={{ maxHeight: "200px", overflowY: "auto" }}>
//                 {section.data.map((item) => (
//                   <div key={item.slug} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`${section.key}-${item.slug}`}
//                       checked={(filters[section.key] || []).includes(item.slug)}
//                       onChange={() => handleToggleFilter(section.key, item.slug)}
//                     />
//                     <label className={`form-check-label d-flex justify-content-between w-100 ${(filters[section.key] || []).includes(item.slug) ? "fw-bold text-primary" : ""}`} htmlFor={`${section.key}-${item.slug}`} style={{ cursor: "pointer" }}>
//                       <span>{item.name}</span>
//                       <small className="text-muted">({item.count})</small>
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         ))}

//       </div>

//       {onClose && (
//         <div className="p-3 d-lg-none bg-light border-top">
//           <button className="btn btn-dark w-100 fw-bold" onClick={onClose}>Show Results</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BrandFilter;












// import React, { useState, useMemo } from "react";
// import { FaTimes, FaChevronRight, FaChevronDown } from "react-icons/fa";

// const BrandFilter = ({
//   filters,
//   setFilters,
//   onClose,
//   filterData = null,
//   onClearCategory,
//   onCategoryPillClick, // 🔥 ADDED: was missing!
//   activeCategorySlug,  // 🔥 ADDED: to show active state
// }) => {
//   const [expandedIds, setExpandedIds] = useState(new Set());

//   const {
//     brands = [],
//     categories = [],
//     skinTypes = [],
//     formulations = [],
//     finishes = [],
//     ingredients = [],
//     priceRanges = [],
//     discountRanges = [],
//   } = filterData || {};

//   /* ─── CORE SELECTION LOGIC ────────────────────────────────────── */

//   const handleToggleFilter = (key, value) => {
//     setFilters((prev) => {
//       const currentList = prev[key] || [];
//       const isAlreadySelected = currentList.includes(value);
//       const newList = isAlreadySelected
//         ? currentList.filter((item) => item !== value)
//         : [...currentList, value];
//       return { ...prev, [key]: newList };
//     });
//   };

//   const handlePriceSelection = (range) => {
//     setFilters((prev) => ({
//       ...prev,
//       priceRange: range, // 🔥 FIXED: use priceRange object, not minPrice/maxPrice directly
//     }));
//   };

//   const handleDiscountSelection = (minVal) => {
//     setFilters((prev) => ({
//       ...prev,
//       discountMin: prev.discountMin === minVal ? null : minVal, // 🔥 FIXED: null not undefined
//     }));
//   };

//   const clearAll = () => {
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
//     setExpandedIds(new Set());
//     if (onClearCategory) onClearCategory();
//   };

//   /* ─── CATEGORY HIERARCHY HELPERS ────────────────────────────────── */

//   const childrenMap = useMemo(() => {
//     const map = {};
//     categories.forEach((cat) => {
//       const parentId = cat.parent || null;
//       if (!map[parentId]) map[parentId] = [];
//       map[parentId].push(cat);
//     });
//     return map;
//   }, [categories]);

//   const rootCategories = useMemo(() => {
//     return categories.filter((cat) => !cat.parent || !categories.some((c) => c._id === cat.parent));
//   }, [categories]);

//   const toggleExpand = (catId) => {
//     setExpandedIds((prev) => {
//       const next = new Set(prev);
//       if (next.has(catId)) next.delete(catId);
//       else next.add(catId);
//       return next;
//     });
//   };

//   /* ─── ACTIVE CHIPS LOGIC ────────────────────────────────────────── */

//   const activeChips = useMemo(() => {
//     const chips = [];

//     const sections = [
//       { key: "brandIds", list: brands, field: "slug" },
//       { key: "categoryIds", list: categories, field: "slug" }, // 🔥 FIXED: use slug, not _id
//       { key: "skinTypes", list: skinTypes, field: "slug" },
//       { key: "formulations", list: formulations, field: "slug" },
//       { key: "finishes", list: finishes, field: "slug" },
//       { key: "ingredients", list: ingredients, field: "slug" },
//     ];

//     sections.forEach((sec) => {
//       (filters[sec.key] || []).forEach((v) => {
//         const item = sec.list.find((i) => i[sec.field] === v);
//         chips.push({ group: sec.key, val: v, label: item?.name || v });
//       });
//     });

//     if (filters.discountMin) {
//       const d = discountRanges.find((dr) => dr.min === filters.discountMin);
//       chips.push({ group: "discountMin", val: filters.discountMin, label: d?.label || `${filters.discountMin}% Off` });
//     }

//     if (filters.priceRange) {
//       const p = priceRanges.find((pr) => pr.min === filters.priceRange.min && pr.max === filters.priceRange.max);
//       chips.push({ group: "priceRange", val: null, label: p?.label || "Price Filter" });
//     }

//     return chips;
//   }, [filters, filterData]);

//   /* ─── RECURSIVE CATEGORY RENDER ────────────────────────────────── */
//   // 🔥 FIXED: Use SLUG for selection, not _id
//   const renderCategoryNode = (cat, depth = 0) => {
//     const children = childrenMap[cat._id] || [];
//     const hasChildren = children.length > 0;
//     const isExpanded = expandedIds.has(cat._id);
//     const isChecked = (filters.categoryIds || []).includes(cat.slug) || activeCategorySlug === cat.slug; // 🔥 FIXED: check slug

//     return (
//       <div key={cat._id} className="mb-1">
//         <div className="d-flex align-items-center" style={{ marginLeft: `${depth * 12}px` }}>
//           <span onClick={() => toggleExpand(cat._id)} style={{ width: 20, cursor: "pointer", color: "#666" }}>
//             {hasChildren && (isExpanded ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />)}
//           </span>
//           <div className="form-check mb-0 flex-grow-1">
//             <input
//               className="form-check-input"
//               type="checkbox"
//               id={`cat-${cat._id}`}
//               checked={isChecked}
//               onChange={() => {
//                 if (onCategoryPillClick) {
//                   // 🔥 FIXED: Call pill click handler for navigation + filter
//                   onCategoryPillClick(cat);
//                 } else {
//                   handleToggleFilter("categoryIds", cat.slug); // 🔥 FIXED: use slug
//                 }
//               }}
//             />
//             <label
//               className={`form-check-label d-flex justify-content-between ${isChecked ? "fw-bold text-primary" : ""}`}
//               htmlFor={`cat-${cat._id}`}
//               style={{ cursor: "pointer", fontSize: "14px" }}
//             >
//               <span>{cat.name}</span>
//               {cat.count > 0 && <small className="text-muted">({cat.count})</small>}
//             </label>
//           </div>
//         </div>
//         {isExpanded && children.map((child) => renderCategoryNode(child, depth + 1))}
//       </div>
//     );
//   };

//   if (!filterData) return <div className="p-4 text-center"><div className="spinner-border text-primary" /></div>;

//   return (
//     <div className="filter-sidebar border bg-white shadow-sm page-title-main-name" style={{ position: "sticky", top: "140px", borderRadius: "12px", overflowY: "hidden" }}>
//       {/* Header */}
//       <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light">
//         <h6 className="mb-0 fw-bold">Filters</h6>
//         {activeChips.length > 0 && (
//           <button className="btn btn-sm btn-link text-danger text-decoration-none fw-bold p-0" onClick={clearAll}>Reset All</button>
//         )}
//       </div>

//       {/* Chips */}
//       {activeChips.length > 0 && (
//         <div className="height-selcted-section">
//           {activeChips.map((chip, idx) => (
//             <span key={idx} className="height-selcted-section-sub" style={{ fontSize: "11px", fontWeight: "400" }}>
//               {chip.label}
//               <FaTimes
//                 style={{ cursor: "pointer" }}
//                 onClick={() => {
//                   if (chip.group === "priceRange") handlePriceSelection(null);
//                   else if (chip.group === "discountMin") handleDiscountSelection(null);
//                   else handleToggleFilter(chip.group, chip.val);
//                 }}
//               />
//             </span>
//           ))}
//         </div>
//       )}

//       {/* Accordions */}
//       <div className="accordion accordion-flush" id="mainFilterAccordion">

//         {/* Categories */}
//         <div className="accordion-item">
//           <h2 className="accordion-header pb-0 mb-0">
//             <button className="accordion-button text-black fw-normal" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCats">Categories</button>
//           </h2>
//           <div id="collapseCats" className="accordion-collapse collapse show">
//             <div className="accordion-body p-3" style={{ maxHeight: "300px", overflowY: "auto" }}>
//               {rootCategories.map((cat) => renderCategoryNode(cat))}
//             </div>
//           </div>
//         </div>

//         {/* Brands */}
//         <div className="accordion-item">
//           <h2 className="accordion-header">
//             <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseBrands">Brands</button>
//           </h2>
//           <div id="collapseBrands" className="accordion-collapse collapse">
//             <div className="accordion-body p-3" style={{ maxHeight: "250px", overflowY: "auto" }}>
//               {brands.map((b) => (
//                 <div key={b.slug} className="form-check mb-2">
//                   <input
//                     className="form-check-input"
//                     type="checkbox"
//                     id={`brand-${b.slug}`}
//                     checked={(filters.brandIds || []).includes(b.slug)}
//                     onChange={() => handleToggleFilter("brandIds", b.slug)}
//                   />
//                   <label className={`form-check-label d-flex justify-content-between w-100 ${(filters.brandIds || []).includes(b.slug) ? "fw-bold text-primary" : ""}`} htmlFor={`brand-${b.slug}`} style={{ cursor: "pointer" }}>
//                     <span>{b.name}</span>
//                     <small className="text-muted">({b.count})</small>
//                   </label>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Skin Type */}
//         <div className="accordion-item">
//           <h2 className="accordion-header">
//             <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSkin">Skin Type</button>
//           </h2>
//           <div id="collapseSkin" className="accordion-collapse collapse">
//             <div className="accordion-body p-3">
//               {skinTypes.map((st) => (
//                 <div key={st.slug} className="form-check mb-2">
//                   <input
//                     className="form-check-input"
//                     type="checkbox"
//                     id={`st-${st.slug}`}
//                     checked={(filters.skinTypes || []).includes(st.slug)}
//                     onChange={() => handleToggleFilter("skinTypes", st.slug)}
//                   />
//                   <label className={`form-check-label d-flex justify-content-between w-100 ${(filters.skinTypes || []).includes(st.slug) ? "fw-bold text-primary" : ""}`} htmlFor={`st-${st.slug}`} style={{ cursor: "pointer" }}>
//                     <span>{st.name}</span>
//                     <small className="text-muted">({st.count})</small>
//                   </label>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Discount */}
//         {discountRanges.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDiscount">Discount</button>
//             </h2>
//             <div id="collapseDiscount" className="accordion-collapse collapse">
//               <div className="accordion-body p-3">
//                 {discountRanges.map((d, i) => (
//                   <div key={i} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`disc-${i}`}
//                       checked={filters.discountMin === d.min}
//                       onChange={() => handleDiscountSelection(d.min)}
//                     />
//                     <label className={`form-check-label d-flex justify-content-between w-100 ${filters.discountMin === d.min ? "fw-bold text-primary" : ""}`} htmlFor={`disc-${i}`} style={{ cursor: "pointer" }}>
//                       <span>{d.label}</span>
//                       <small className="text-muted">({d.count})</small>
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Price Range */}
//         <div className="accordion-item">
//           <h2 className="accordion-header">
//             <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapsePrice">Price Range</button>
//           </h2>
//           <div id="collapsePrice" className="accordion-collapse collapse">
//             <div className="accordion-body p-3">
//               {priceRanges.map((p, i) => {
//                 const isSelected = filters.priceRange?.min === p.min && filters.priceRange?.max === p.max;
//                 return (
//                   <div key={i} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="radio"
//                       name="priceRangeRadio"
//                       id={`price-${i}`}
//                       checked={isSelected}
//                       onChange={() => handlePriceSelection(p)}
//                     />
//                     <label className={`form-check-label ${isSelected ? "fw-bold text-primary" : ""}`} htmlFor={`price-${i}`} style={{ cursor: "pointer" }}>
//                       {p.label}
//                     </label>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>

//         {/* Dynamic sections */}
//         {[
//           { id: "collapseForm", title: "Formulation", key: "formulations", data: formulations },
//           { id: "collapseFinish", title: "Finish", key: "finishes", data: finishes },
//           { id: "collapseIng", title: "Ingredients", key: "ingredients", data: ingredients }
//         ].map(section => section.data.length > 0 && (
//           <div className="accordion-item" key={section.key}>
//             <h2 className="accordion-header">
//               <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#${section.id}`}>{section.title}</button>
//             </h2>
//             <div id={section.id} className="accordion-collapse collapse">
//               <div className="accordion-body p-3" style={{ maxHeight: "200px", overflowY: "auto" }}>
//                 {section.data.map((item) => (
//                   <div key={item.slug} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`${section.key}-${item.slug}`}
//                       checked={(filters[section.key] || []).includes(item.slug)}
//                       onChange={() => handleToggleFilter(section.key, item.slug)}
//                     />
//                     <label className={`form-check-label d-flex justify-content-between w-100 ${(filters[section.key] || []).includes(item.slug) ? "fw-bold text-primary" : ""}`} htmlFor={`${section.key}-${item.slug}`} style={{ cursor: "pointer" }}>
//                       <span>{item.name}</span>
//                       <small className="text-muted">({item.count})</small>
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         ))}

//       </div>

//       {onClose && (
//         <div className="p-3 d-lg-none bg-light border-top">
//           <button className="btn btn-dark w-100 fw-bold" onClick={onClose}>Show Results</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BrandFilter;














// import React, { useState, useMemo } from "react";
// import { FaTimes, FaChevronRight, FaChevronDown } from "react-icons/fa";

// const BrandFilter = ({
//   filters,
//   setFilters,
//   onClose,
//   filterData = null,
//   onClearCategory,
//   onCategoryPillClick,
//   activeCategorySlug,
// }) => {
//   const [expandedIds, setExpandedIds] = useState(new Set());

//   const {
//     brands = [],
//     categories = [],
//     skinTypes = [],
//     formulations = [],
//     finishes = [],
//     ingredients = [],
//     priceRanges = [],
//     discountRanges = [],
//   } = filterData || {};

//   /* ─── CORE SELECTION LOGIC ────────────────────────────────────── */

//   // ✅ FIXED: Robust toggle that properly removes items
//   const handleToggleFilter = (key, value) => {
//     console.log(`🔵 BrandFilter Toggle - key: ${key}, value: ${value}`);
//     console.log(`🔵 Current ${key}:`, filters[key]);

//     setFilters((prev) => {
//       const currentList = [...(prev[key] || [])];
//       const index = currentList.indexOf(value);

//       let newList;
//       if (index > -1) {
//         // Remove it
//         currentList.splice(index, 1);
//         newList = currentList;
//         console.log(`🔴 Removed "${value}" from ${key}. New:`, newList);
//       } else {
//         // Add it
//         newList = [...currentList, value];
//         console.log(`🟢 Added "${value}" to ${key}. New:`, newList);
//       }

//       return { ...prev, [key]: newList };
//     });
//   };

//   const handlePriceSelection = (range) => {
//     if (range === null || range === undefined) {
//       console.log("🔴 Clearing price range");
//       setFilters((prev) => ({ ...prev, priceRange: null }));
//     } else {
//       console.log("🟢 Setting price range:", range);
//       setFilters((prev) => ({
//         ...prev,
//         priceRange: { min: range.min, max: range.max },
//       }));
//     }
//   };

//   const handleDiscountSelection = (minVal) => {
//     setFilters((prev) => ({
//       ...prev,
//       discountMin: prev.discountMin === minVal ? null : minVal,
//     }));
//   };

//   const clearAll = () => {
//     console.log("🟡 Clearing all filters");
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
//     setExpandedIds(new Set());
//     if (onClearCategory) onClearCategory();
//   };

//   /* ─── CATEGORY HIERARCHY HELPERS ────────────────────────────────── */

//   const childrenMap = useMemo(() => {
//     const map = {};
//     categories.forEach((cat) => {
//       const parentId = cat.parent || null;
//       if (!map[parentId]) map[parentId] = [];
//       map[parentId].push(cat);
//     });
//     return map;
//   }, [categories]);

//   const rootCategories = useMemo(() => {
//     return categories.filter(
//       (cat) => !cat.parent || !categories.some((c) => c._id === cat.parent)
//     );
//   }, [categories]);

//   const toggleExpand = (catId) => {
//     setExpandedIds((prev) => {
//       const next = new Set(prev);
//       if (next.has(catId)) next.delete(catId);
//       else next.add(catId);
//       return next;
//     });
//   };

//   /* ─── ACTIVE CHIPS LOGIC ────────────────────────────────────────── */

//   const activeChips = useMemo(() => {
//     const chips = [];

//     const sections = [
//       { key: "brandIds", list: brands, field: "slug" },
//       { key: "categoryIds", list: categories, field: "slug" },
//       { key: "skinTypes", list: skinTypes, field: "slug" },
//       { key: "formulations", list: formulations, field: "slug" },
//       { key: "finishes", list: finishes, field: "slug" },
//       { key: "ingredients", list: ingredients, field: "slug" },
//     ];

//     sections.forEach((sec) => {
//       if (filters[sec.key] && Array.isArray(filters[sec.key])) {
//         filters[sec.key].forEach((v) => {
//           const item = sec.list.find((i) => i[sec.field] === v);
//           if (item) {
//             chips.push({ group: sec.key, val: v, label: item.name || v });
//           }
//         });
//       }
//     });

//     if (filters.discountMin) {
//       const d = discountRanges.find((dr) => dr.min === filters.discountMin);
//       chips.push({
//         group: "discountMin",
//         val: filters.discountMin,
//         label: d?.label || `${filters.discountMin}% Off`,
//       });
//     }

//     if (filters.priceRange) {
//       const p = priceRanges.find(
//         (pr) => pr.min === filters.priceRange.min && pr.max === filters.priceRange.max
//       );
//       chips.push({
//         group: "priceRange",
//         val: "price",
//         label: p?.label || "Price Filter",
//       });
//     }

//     return chips;
//   }, [filters, filterData, brands, categories, skinTypes, formulations, finishes, ingredients, discountRanges, priceRanges]);

//   /* ─── RECURSIVE CATEGORY RENDER ────────────────────────────────── */

//   const renderCategoryNode = (cat, depth = 0) => {
//     const children = childrenMap[cat._id] || [];
//     const hasChildren = children.length > 0;
//     const isExpanded = expandedIds.has(cat._id);

//     // Check if category is selected via sidebar filter or URL path
//     const isCheckedViaFilter = (filters.categoryIds || []).includes(cat.slug);
//     const isCheckedViaUrl = activeCategorySlug === cat.slug;
//     const isChecked = isCheckedViaFilter || isCheckedViaUrl;

//     return (
//       <div key={cat._id || cat.slug} className="mb-1">
//         <div
//           className="d-flex align-items-center"
//           style={{ marginLeft: `${depth * 12}px` }}
//         >
//           <span
//             onClick={() => toggleExpand(cat._id)}
//             style={{ width: 20, cursor: "pointer", color: "#666" }}
//           >
//             {hasChildren &&
//               (isExpanded ? (
//                 <FaChevronDown size={10} />
//               ) : (
//                 <FaChevronRight size={10} />
//               ))}
//           </span>
//           <div className="form-check mb-0 flex-grow-1">
//             <input
//               className="form-check-input"
//               type="checkbox"
//               id={`cat-${cat._id || cat.slug}`}
//               checked={isChecked}
//               onChange={() => {
//                 // ✅ FIXED: Always use handleToggleFilter for sidebar checkboxes
//                 // Only use onCategoryPillClick for top pill buttons (not here)
//                 handleToggleFilter("categoryIds", cat.slug);
//               }}
//             />
//             <label
//               className={`form-check-label d-flex justify-content-between ${
//                 isChecked ? "fw-bold text-primary" : ""
//               }`}
//               htmlFor={`cat-${cat._id || cat.slug}`}
//               style={{ cursor: "pointer", fontSize: "14px" }}
//             >
//               <span>{cat.name}</span>
//               {cat.count > 0 && (
//                 <small className="text-muted">({cat.count})</small>
//               )}
//             </label>
//           </div>
//         </div>
//         {isExpanded &&
//           children.map((child) => renderCategoryNode(child, depth + 1))}
//       </div>
//     );
//   };

//   if (!filterData)
//     return (
//       <div className="p-4 text-center">
//         <div className="spinner-border text-primary" />
//       </div>
//     );

//   return (
//     <div
//       className="filter-sidebar border bg-white shadow-sm page-title-main-name"
//       style={{
//         position: "sticky",
//         top: "140px",
//         borderRadius: "12px",
//         overflowY: "hidden",
//       }}
//     >
//       {/* Header */}
//       <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light">
//         <h6 className="mb-0 fw-bold">Filters</h6>
//         {activeChips.length > 0 && (
//           <button
//             className="btn btn-sm btn-link text-danger text-decoration-none fw-bold p-0"
//             onClick={clearAll}
//           >
//             Reset All
//           </button>
//         )}
//       </div>

//       {/* Active Filter Chips */}
//       {activeChips.length > 0 && (
//         <div className="height-selcted-section">
//           {activeChips.map((chip, idx) => (
//             <span
//               key={`${chip.group}-${chip.val}-${idx}`}
//               className="height-selcted-section-sub"
//               style={{ fontSize: "11px", fontWeight: "400" }}
//             >
//               {chip.label}
//               <FaTimes
//                 style={{ cursor: "pointer", marginLeft: "4px" }}
//                 onClick={() => {
//                   console.log("🔴 Removing chip:", chip);
//                   if (chip.group === "priceRange") {
//                     handlePriceSelection(null);
//                   } else if (chip.group === "discountMin") {
//                     handleDiscountSelection(null);
//                   } else {
//                     handleToggleFilter(chip.group, chip.val);
//                   }
//                 }}
//               />
//             </span>
//           ))}
//         </div>
//       )}

//       {/* Accordions */}
//       <div className="accordion accordion-flush" id="mainFilterAccordion">

//         {/* ==================== CATEGORIES ==================== */}
//         <div className="accordion-item">
//           <h2 className="accordion-header pb-0 mb-0">
//             <button
//               className="accordion-button text-black fw-normal"
//               type="button"
//               data-bs-toggle="collapse"
//               data-bs-target="#collapseCats"
//             >
//               Categories
//             </button>
//           </h2>
//           <div id="collapseCats" className="accordion-collapse collapse show">
//             <div
//               className="accordion-body p-3"
//               style={{ maxHeight: "300px", overflowY: "auto" }}
//             >
//               {rootCategories.length > 0 ? (
//                 rootCategories.map((cat) => renderCategoryNode(cat))
//               ) : (
//                 <p className="text-muted small">No categories available</p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* ==================== BRANDS ==================== */}
//         {brands.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button
//                 className="accordion-button fw-normal collapsed"
//                 type="button"
//                 data-bs-toggle="collapse"
//                 data-bs-target="#collapseBrands"
//               >
//                 Brands
//               </button>
//             </h2>
//             <div id="collapseBrands" className="accordion-collapse collapse">
//               <div
//                 className="accordion-body p-3"
//                 style={{ maxHeight: "250px", overflowY: "auto" }}
//               >
//                 {brands.map((b) => (
//                   <div key={b.slug} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`brand-${b.slug}`}
//                       checked={(filters.brandIds || []).includes(b.slug)}
//                       onChange={() => handleToggleFilter("brandIds", b.slug)}
//                     />
//                     <label
//                       className={`form-check-label d-flex justify-content-between w-100 ${
//                         (filters.brandIds || []).includes(b.slug)
//                           ? "fw-bold text-primary"
//                           : ""
//                       }`}
//                       htmlFor={`brand-${b.slug}`}
//                       style={{ cursor: "pointer" }}
//                     >
//                       <span>{b.name}</span>
//                       <small className="text-muted">({b.count})</small>
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ==================== SKIN TYPE ==================== */}
//         {skinTypes.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button
//                 className="accordion-button fw-normal collapsed"
//                 type="button"
//                 data-bs-toggle="collapse"
//                 data-bs-target="#collapseSkin"
//               >
//                 Skin Type
//               </button>
//             </h2>
//             <div id="collapseSkin" className="accordion-collapse collapse">
//               <div className="accordion-body p-3">
//                 {skinTypes.map((st) => (
//                   <div key={st.slug} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`st-${st.slug}`}
//                       checked={(filters.skinTypes || []).includes(st.slug)}
//                       onChange={() => handleToggleFilter("skinTypes", st.slug)}
//                     />
//                     <label
//                       className={`form-check-label d-flex justify-content-between w-100 ${
//                         (filters.skinTypes || []).includes(st.slug)
//                           ? "fw-bold text-primary"
//                           : ""
//                       }`}
//                       htmlFor={`st-${st.slug}`}
//                       style={{ cursor: "pointer" }}
//                     >
//                       <span>{st.name}</span>
//                       <small className="text-muted">({st.count})</small>
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ==================== DISCOUNT ==================== */}
//         {discountRanges.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button
//                 className="accordion-button fw-normal collapsed"
//                 type="button"
//                 data-bs-toggle="collapse"
//                 data-bs-target="#collapseDiscount"
//               >
//                 Discount
//               </button>
//             </h2>
//             <div id="collapseDiscount" className="accordion-collapse collapse">
//               <div className="accordion-body p-3">
//                 {discountRanges.map((d, i) => (
//                   <div key={i} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`disc-${i}`}
//                       checked={filters.discountMin === d.min}
//                       onChange={() => handleDiscountSelection(d.min)}
//                     />
//                     <label
//                       className={`form-check-label d-flex justify-content-between w-100 ${
//                         filters.discountMin === d.min
//                           ? "fw-bold text-primary"
//                           : ""
//                       }`}
//                       htmlFor={`disc-${i}`}
//                       style={{ cursor: "pointer" }}
//                     >
//                       <span>{d.label}</span>
//                       <small className="text-muted">({d.count})</small>
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ==================== PRICE RANGE ==================== */}
//         {priceRanges.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button
//                 className="accordion-button fw-normal collapsed"
//                 type="button"
//                 data-bs-toggle="collapse"
//                 data-bs-target="#collapsePrice"
//               >
//                 Price Range
//               </button>
//             </h2>
//             <div id="collapsePrice" className="accordion-collapse collapse">
//               <div className="accordion-body p-3">
//                 {priceRanges.map((p, i) => {
//                   const isSelected =
//                     filters.priceRange?.min === p.min &&
//                     filters.priceRange?.max === p.max;
//                   return (
//                     <div key={i} className="form-check mb-2">
//                       <input
//                         className="form-check-input"
//                         type="radio"
//                         name="priceRangeRadio"
//                         id={`price-${i}`}
//                         checked={isSelected}
//                         onChange={() => handlePriceSelection(p)}
//                       />
//                       <label
//                         className={`form-check-label ${
//                           isSelected ? "fw-bold text-primary" : ""
//                         }`}
//                         htmlFor={`price-${i}`}
//                         style={{ cursor: "pointer" }}
//                       >
//                         {p.label}
//                       </label>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ==================== FORMULATION (SAME AS BRAND STYLE) ==================== */}
//         {formulations.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button
//                 className="accordion-button fw-normal collapsed"
//                 type="button"
//                 data-bs-toggle="collapse"
//                 data-bs-target="#collapseForm"
//               >
//                 Formulation
//               </button>
//             </h2>
//             <div id="collapseForm" className="accordion-collapse collapse">
//               <div
//                 className="accordion-body p-3"
//                 style={{ maxHeight: "200px", overflowY: "auto" }}
//               >
//                 {formulations.map((item) => {
//                   const isChecked = (filters.formulations || []).includes(item.slug);
//                   return (
//                     <div key={item.slug} className="form-check mb-2">
//                       <input
//                         className="form-check-input"
//                         type="checkbox"
//                         id={`formulations-${item.slug}`}
//                         checked={isChecked}
//                         onChange={() => handleToggleFilter("formulations", item.slug)}
//                       />
//                       <label
//                         className={`form-check-label d-flex justify-content-between w-100 ${
//                           isChecked ? "fw-bold text-primary" : ""
//                         }`}
//                         htmlFor={`formulations-${item.slug}`}
//                         style={{ cursor: "pointer" }}
//                       >
//                         <span>{item.name}</span>
//                         <small className="text-muted">({item.count})</small>
//                       </label>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ==================== FINISH (SAME AS BRAND STYLE) ==================== */}
//         {finishes.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button
//                 className="accordion-button fw-normal collapsed"
//                 type="button"
//                 data-bs-toggle="collapse"
//                 data-bs-target="#collapseFinish"
//               >
//                 Finish
//               </button>
//             </h2>
//             <div id="collapseFinish" className="accordion-collapse collapse">
//               <div
//                 className="accordion-body p-3"
//                 style={{ maxHeight: "200px", overflowY: "auto" }}
//               >
//                 {finishes.map((item) => {
//                   const isChecked = (filters.finishes || []).includes(item.slug);
//                   return (
//                     <div key={item.slug} className="form-check mb-2">
//                       <input
//                         className="form-check-input"
//                         type="checkbox"
//                         id={`finishes-${item.slug}`}
//                         checked={isChecked}
//                         onChange={() => handleToggleFilter("finishes", item.slug)}
//                       />
//                       <label
//                         className={`form-check-label d-flex justify-content-between w-100 ${
//                           isChecked ? "fw-bold text-primary" : ""
//                         }`}
//                         htmlFor={`finishes-${item.slug}`}
//                         style={{ cursor: "pointer" }}
//                       >
//                         <span>{item.name}</span>
//                         <small className="text-muted">({item.count})</small>
//                       </label>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ==================== INGREDIENTS (SAME AS BRAND STYLE) ==================== */}
//         {ingredients.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button
//                 className="accordion-button fw-normal collapsed"
//                 type="button"
//                 data-bs-toggle="collapse"
//                 data-bs-target="#collapseIng"
//               >
//                 Ingredients
//               </button>
//             </h2>
//             <div id="collapseIng" className="accordion-collapse collapse">
//               <div
//                 className="accordion-body p-3"
//                 style={{ maxHeight: "200px", overflowY: "auto" }}
//               >
//                 {ingredients.map((item) => {
//                   const isChecked = (filters.ingredients || []).includes(item.slug);
//                   return (
//                     <div key={item.slug} className="form-check mb-2">
//                       <input
//                         className="form-check-input"
//                         type="checkbox"
//                         id={`ingredients-${item.slug}`}
//                         checked={isChecked}
//                         onChange={() => handleToggleFilter("ingredients", item.slug)}
//                       />
//                       <label
//                         className={`form-check-label d-flex justify-content-between w-100 ${
//                           isChecked ? "fw-bold text-primary" : ""
//                         }`}
//                         htmlFor={`ingredients-${item.slug}`}
//                         style={{ cursor: "pointer" }}
//                       >
//                         <span>{item.name}</span>
//                         <small className="text-muted">({item.count})</small>
//                       </label>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         )}

//       </div>

//       {/* Mobile Show Results Button */}
//       {onClose && (
//         <div className="p-3 d-lg-none bg-light border-top">
//           <button className="btn btn-dark w-100 fw-bold" onClick={onClose}>
//             Show Results
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BrandFilter;








// import React, { useState, useMemo } from "react";
// import { FaTimes, FaChevronRight, FaChevronDown } from "react-icons/fa";

// const BrandFilter = ({
//   filters,
//   setFilters,
//   onClose,
//   filterData = null,
//   onClearCategory,
//   onCategoryPillClick,
//   activeCategorySlug,
// }) => {
//   const [expandedIds, setExpandedIds] = useState(new Set());

//   const {
//     brands = [],
//     categories = [],
//     skinTypes = [],
//     formulations = [],
//     finishes = [],
//     ingredients = [],
//     priceRanges = [],
//     discountRanges = [],
//   } = filterData || {};

//   /* ─── CORE TOGGLE LOGIC ────────────────────────────────────── */
//   const handleToggleFilter = (key, value) => {
//     if (!value) return;
//     console.log(`Toggle ${key}:`, value);

//     setFilters((prev) => {
//       const currentList = [...(prev[key] || [])];
//       const index = currentList.indexOf(value);

//       let newList;
//       if (index > -1) {
//         newList = currentList.filter((item) => item !== value);
//       } else {
//         newList = [...currentList, value];
//       }

//       return { ...prev, [key]: newList };
//     });
//   };

//   const handlePriceSelection = (range) => {
//     setFilters((prev) => ({
//       ...prev,
//       priceRange: range ? { min: range.min, max: range.max } : null,
//     }));
//   };

//   const handleDiscountSelection = (minVal) => {
//     setFilters((prev) => ({
//       ...prev,
//       discountMin: prev.discountMin === minVal ? null : minVal,
//     }));
//   };

//   const clearAll = () => {
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
//     setExpandedIds(new Set());
//     if (onClearCategory) onClearCategory();
//   };

//   /* ─── CATEGORY HELPERS ─────────────────────────────────────── */
//   const childrenMap = useMemo(() => {
//     const map = {};
//     categories.forEach((cat) => {
//       const parentId = cat.parent || null;
//       if (!map[parentId]) map[parentId] = [];
//       map[parentId].push(cat);
//     });
//     return map;
//   }, [categories]);

//   const rootCategories = useMemo(() => {
//     return categories.filter((cat) => !cat.parent);
//   }, [categories]);

//   const toggleExpand = (catId) => {
//     setExpandedIds((prev) => {
//       const next = new Set(prev);
//       next.has(catId) ? next.delete(catId) : next.add(catId);
//       return next;
//     });
//   };

//   /* ─── ACTIVE CHIPS ─────────────────────────────────────────── */
//   const activeChips = useMemo(() => {
//     const chips = [];

//     const sections = [
//       { key: "brandIds", list: brands, field: "slug" },
//       { key: "categoryIds", list: categories, field: "slug" },
//       { key: "skinTypes", list: skinTypes, field: "slug" },
//       { key: "formulations", list: formulations, field: "name" },   // ← Use name for formulation
//       { key: "finishes", list: finishes, field: "slug" },
//       { key: "ingredients", list: ingredients, field: "slug" },
//     ];

//     sections.forEach((sec) => {
//       (filters[sec.key] || []).forEach((v) => {
//         const item = sec.list.find((i) => i[sec.field] === v);
//         if (item) {
//           chips.push({ group: sec.key, val: v, label: item.name || v });
//         }
//       });
//     });

//     if (filters.discountMin != null) {
//       const d = discountRanges.find((dr) => dr.min === filters.discountMin);
//       chips.push({ group: "discountMin", val: filters.discountMin, label: d?.label || `${filters.discountMin}% Off` });
//     }

//     if (filters.priceRange) {
//       const p = priceRanges.find((pr) => 
//         pr.min === filters.priceRange.min && pr.max === filters.priceRange.max
//       );
//       chips.push({ group: "priceRange", val: null, label: p?.label || "Price Filter" });
//     }

//     return chips;
//   }, [filters, filterData]);

//   /* ─── CATEGORY RENDER ──────────────────────────────────────── */
//   const renderCategoryNode = (cat, depth = 0) => {
//     const children = childrenMap[cat._id] || [];
//     const hasChildren = children.length > 0;
//     const isExpanded = expandedIds.has(cat._id);
//     const isChecked = (filters.categoryIds || []).includes(cat.slug) || activeCategorySlug === cat.slug;

//     return (
//       <div key={cat._id} className="mb-1">
//         <div className="d-flex align-items-center" style={{ marginLeft: `${depth * 12}px` }}>
//           <span onClick={() => toggleExpand(cat._id)} style={{ width: 20, cursor: "pointer", color: "#666" }}>
//             {hasChildren && (isExpanded ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />)}
//           </span>
//           <div className="form-check mb-0 flex-grow-1">
//             <input
//               className="form-check-input"
//               type="checkbox"
//               id={`cat-${cat.slug}`}
//               checked={isChecked}
//               onChange={() => handleToggleFilter("categoryIds", cat.slug)}
//             />
//             <label
//               className={`form-check-label d-flex justify-content-between ${isChecked ? "fw-bold text-primary" : ""}`}
//               htmlFor={`cat-${cat.slug}`}
//               style={{ cursor: "pointer", fontSize: "14px" }}
//             >
//               <span>{cat.name}</span>
//               {cat.count > 0 && <small className="text-muted">({cat.count})</small>}
//             </label>
//           </div>
//         </div>
//         {isExpanded && children.map((child) => renderCategoryNode(child, depth + 1))}
//       </div>
//     );
//   };

//   if (!filterData) return <div className="p-4 text-center"><div className="spinner-border text-primary" /></div>;

//   return (
//     <div className="filter-sidebar border bg-white shadow-sm page-title-main-name"
//          style={{ position: "sticky", top: "140px", borderRadius: "12px", overflowY: "hidden" }}>

//       {/* Header */}
//       <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light">
//         <h6 className="mb-0 fw-bold">Filters</h6>
//         {activeChips.length > 0 && (
//           <button className="btn btn-sm btn-link text-danger text-decoration-none fw-bold p-0" onClick={clearAll}>
//             Reset All
//           </button>
//         )}
//       </div>

//       {/* Active Chips */}
//       {activeChips.length > 0 && (
//         <div className="height-selcted-section p-2">
//           {activeChips.map((chip, idx) => (
//             <span key={idx} className="height-selcted-section-sub" style={{ fontSize: "11px" }}>
//               {chip.label}
//               <FaTimes
//                 style={{ cursor: "pointer", marginLeft: 6 }}
//                 onClick={() => {
//                   if (chip.group === "priceRange") handlePriceSelection(null);
//                   else if (chip.group === "discountMin") handleDiscountSelection(null);
//                   else handleToggleFilter(chip.group, chip.val);
//                 }}
//               />
//             </span>
//           ))}
//         </div>
//       )}

//       <div className="accordion accordion-flush" id="mainFilterAccordion">
//         {/* Categories */}
//         <div className="accordion-item">
//           <h2 className="accordion-header pb-0 mb-0">
//             <button className="accordion-button text-black fw-normal" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCats">
//               Categories
//             </button>
//           </h2>
//           <div id="collapseCats" className="accordion-collapse collapse show">
//             <div className="accordion-body p-3" style={{ maxHeight: "300px", overflowY: "auto" }}>
//               {rootCategories.map((cat) => renderCategoryNode(cat))}
//             </div>
//           </div>
//         </div>

//         {/* Brands */}
//         {brands.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseBrands">
//                 Brands
//               </button>
//             </h2>
//             <div id="collapseBrands" className="accordion-collapse collapse">
//               <div className="accordion-body p-3" style={{ maxHeight: "250px", overflowY: "auto" }}>
//                 {brands.map((b) => (
//                   <div key={b.slug} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`brand-${b.slug}`}
//                       checked={(filters.brandIds || []).includes(b.slug)}
//                       onChange={() => handleToggleFilter("brandIds", b.slug)}
//                     />
//                     <label className={`form-check-label d-flex justify-content-between w-100 ${(filters.brandIds || []).includes(b.slug) ? "fw-bold text-primary" : ""}`} htmlFor={`brand-${b.slug}`} style={{ cursor: "pointer" }}>
//                       <span>{b.name}</span>
//                       <small className="text-muted">({b.count})</small>
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Skin Type */}
//         {skinTypes.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSkin">
//                 Skin Type
//               </button>
//             </h2>
//             <div id="collapseSkin" className="accordion-collapse collapse">
//               <div className="accordion-body p-3">
//                 {skinTypes.map((st) => (
//                   <div key={st.slug} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`st-${st.slug}`}
//                       checked={(filters.skinTypes || []).includes(st.slug)}
//                       onChange={() => handleToggleFilter("skinTypes", st.slug)}
//                     />
//                     <label className={`form-check-label d-flex justify-content-between w-100 ${(filters.skinTypes || []).includes(st.slug) ? "fw-bold text-primary" : ""}`} htmlFor={`st-${st.slug}`} style={{ cursor: "pointer" }}>
//                       <span>{st.name}</span>
//                       <small className="text-muted">({st.count})</small>
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Formulation - Special handling because slug is null */}
//         {formulations.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseForm">
//                 Formulation
//               </button>
//             </h2>
//             <div id="collapseForm" className="accordion-collapse collapse">
//               <div className="accordion-body p-3" style={{ maxHeight: "200px", overflowY: "auto" }}>
//                 {formulations.map((item) => {
//                   const valueToUse = item.slug || item.name;   // ← Fallback to name
//                   const isChecked = (filters.formulations || []).includes(valueToUse);

//                   return (
//                     <div key={item._id || item.name} className="form-check mb-2">
//                       <input
//                         className="form-check-input"
//                         type="checkbox"
//                         id={`form-${item._id}`}
//                         checked={isChecked}
//                         onChange={() => handleToggleFilter("formulations", valueToUse)}
//                       />
//                       <label className={`form-check-label d-flex justify-content-between w-100 ${isChecked ? "fw-bold text-primary" : ""}`} htmlFor={`form-${item._id}`} style={{ cursor: "pointer" }}>
//                         <span>{item.name}</span>
//                         <small className="text-muted">({item.count || 0})</small>
//                       </label>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Finish & Ingredients (normal slug usage) */}
//         {finishes.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFinish">
//                 Finish
//               </button>
//             </h2>
//             <div id="collapseFinish" className="accordion-collapse collapse">
//               <div className="accordion-body p-3" style={{ maxHeight: "200px", overflowY: "auto" }}>
//                 {finishes.map((item) => (
//                   <div key={item.slug} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`fin-${item.slug}`}
//                       checked={(filters.finishes || []).includes(item.slug)}
//                       onChange={() => handleToggleFilter("finishes", item.slug)}
//                     />
//                     <label className={`form-check-label d-flex justify-content-between w-100 ${(filters.finishes || []).includes(item.slug) ? "fw-bold text-primary" : ""}`} htmlFor={`fin-${item.slug}`} style={{ cursor: "pointer" }}>
//                       <span>{item.name}</span>
//                       <small className="text-muted">({item.count})</small>
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {ingredients.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseIng">
//                 Ingredients
//               </button>
//             </h2>
//             <div id="collapseIng" className="accordion-collapse collapse">
//               <div className="accordion-body p-3" style={{ maxHeight: "200px", overflowY: "auto" }}>
//                 {ingredients.map((item) => (
//                   <div key={item.slug} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`ing-${item.slug}`}
//                       checked={(filters.ingredients || []).includes(item.slug)}
//                       onChange={() => handleToggleFilter("ingredients", item.slug)}
//                     />
//                     <label className={`form-check-label d-flex justify-content-between w-100 ${(filters.ingredients || []).includes(item.slug) ? "fw-bold text-primary" : ""}`} htmlFor={`ing-${item.slug}`} style={{ cursor: "pointer" }}>
//                       <span>{item.name}</span>
//                       <small className="text-muted">({item.count})</small>
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Discount and Price Range remain same */}
//         {/* ... (keep your existing discount and price range sections) */}
//       </div>

//       {onClose && (
//         <div className="p-3 d-lg-none bg-light border-top">
//           <button className="btn btn-dark w-100 fw-bold" onClick={onClose}>
//             Show Results
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BrandFilter;

















// import React, { useState, useMemo } from "react";
// import { FaTimes, FaChevronRight, FaChevronDown } from "react-icons/fa";

// const BrandFilter = ({
//   filters,
//   setFilters,
//   onClose,
//   filterData = null,
//   onClearCategory,
//   onCategoryPillClick,
//   activeCategorySlug,
// }) => {
//   const [expandedIds, setExpandedIds] = useState(new Set());

//   const {
//     brands = [],
//     categories = [],
//     skinTypes = [],
//     formulations = [],
//     finishes = [],
//     ingredients = [],
//     priceRanges = [],
//     discountRanges = [],
//   } = filterData || {};

//   /* ─── CORE TOGGLE LOGIC ────────────────────────────────────── */
//   const handleToggleFilter = (key, value) => {
//     if (!value) return;
//     console.log(`Toggle ${key}:`, value);

//     setFilters((prev) => {
//       const currentList = [...(prev[key] || [])];
//       const index = currentList.indexOf(value);

//       let newList;
//       if (index > -1) {
//         newList = currentList.filter((item) => item !== value);
//       } else {
//         newList = [...currentList, value];
//       }

//       return { ...prev, [key]: newList };
//     });
//   };

//   const handlePriceSelection = (range) => {
//     setFilters((prev) => ({
//       ...prev,
//       priceRange: range ? { min: range.min, max: range.max } : null,
//     }));
//   };

//   const handleDiscountSelection = (minVal) => {
//     setFilters((prev) => ({
//       ...prev,
//       discountMin: prev.discountMin === minVal ? null : minVal,
//     }));
//   };

//   const clearAll = () => {
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
//     setExpandedIds(new Set());
//     if (onClearCategory) onClearCategory();
//   };

//   /* ─── CATEGORY HELPERS (UPGRADED – FULL HIERARCHY) ────────── */
//   const childrenMap = useMemo(() => {
//     const map = {};
//     categories.forEach((cat) => {
//       const parentId = cat.parent || null;
//       if (!map[parentId]) map[parentId] = [];
//       map[parentId].push(cat);
//     });
//     return map;
//   }, [categories]);

//   const rootCategories = useMemo(() => {
//     return categories.filter(
//       (cat) => !cat.parent || !categories.some((c) => c._id === cat.parent)
//     );
//   }, [categories]);

//   const toggleExpand = (catId) => {
//     setExpandedIds((prev) => {
//       const next = new Set(prev);
//       next.has(catId) ? next.delete(catId) : next.add(catId);
//       return next;
//     });
//   };

//   /* ─── ACTIVE CHIPS (UNCHANGED) ────────────────────────────── */
//   const activeChips = useMemo(() => {
//     const chips = [];

//     const sections = [
//       { key: "brandIds", list: brands, field: "slug" },
//       { key: "categoryIds", list: categories, field: "slug" },
//       { key: "skinTypes", list: skinTypes, field: "slug" },
//       { key: "formulations", list: formulations, field: "name" },   // ← Use name for formulation
//       { key: "finishes", list: finishes, field: "slug" },
//       { key: "ingredients", list: ingredients, field: "slug" },
//     ];

//     sections.forEach((sec) => {
//       (filters[sec.key] || []).forEach((v) => {
//         const item = sec.list.find((i) => i[sec.field] === v);
//         if (item) {
//           chips.push({ group: sec.key, val: v, label: item.name || v });
//         }
//       });
//     });

//     if (filters.discountMin != null) {
//       const d = discountRanges.find((dr) => dr.min === filters.discountMin);
//       chips.push({ group: "discountMin", val: filters.discountMin, label: d?.label || `${filters.discountMin}% Off` });
//     }

//     if (filters.priceRange) {
//       const p = priceRanges.find((pr) =>
//         pr.min === filters.priceRange.min && pr.max === filters.priceRange.max
//       );
//       chips.push({ group: "priceRange", val: null, label: p?.label || "Price Filter" });
//     }

//     return chips;
//   }, [filters, filterData]);

//   /* ─── CATEGORY RENDER (NOW FULLY HIERARCHICAL) ────────────── */
//   const renderCategoryNode = (cat, depth = 0) => {
//     const children = childrenMap[cat._id] || [];
//     const hasChildren = children.length > 0;
//     const isExpanded = expandedIds.has(cat._id);
//     const isChecked = (filters.categoryIds || []).includes(cat.slug) || activeCategorySlug === cat.slug;

//     return (
//       <div key={cat._id} className="mb-1">
//         <div className="d-flex align-items-center" style={{ marginLeft: `${depth * 12}px` }}>
//           <span onClick={() => toggleExpand(cat._id)} style={{ width: 20, cursor: "pointer", color: "#666" }}>
//             {hasChildren && (isExpanded ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />)}
//           </span>
//           <div className="form-check mb-0 flex-grow-1">
//             <input
//               className="form-check-input"
//               type="checkbox"
//               id={`cat-${cat.slug}`}
//               checked={isChecked}
//               onChange={() => handleToggleFilter("categoryIds", cat.slug)}
//             />
//             <label
//               className={`form-check-label d-flex justify-content-between ${isChecked ? "fw-bold text-primary" : ""}`}
//               htmlFor={`cat-${cat.slug}`}
//               style={{ cursor: "pointer", fontSize: "14px" }}
//             >
//               <span>{cat.name}</span>
//               {cat.count > 0 && <small className="text-muted">({cat.count})</small>}
//             </label>
//           </div>
//         </div>
//         {isExpanded && children.map((child) => renderCategoryNode(child, depth + 1))}
//       </div>
//     );
//   };

//   if (!filterData) return <div className="p-4 text-center"><div className="spinner-border text-primary" /></div>;

//   return (
//     <div className="filter-sidebar border bg-white shadow-sm page-title-main-name"
//          style={{ position: "sticky", top: "140px", borderRadius: "12px", overflowY: "hidden" }}>

//       {/* Header */}
//       <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light">
//         <h6 className="mb-0 fw-bold">Filters</h6>
//         {activeChips.length > 0 && (
//           <button className="btn btn-sm btn-link text-danger text-decoration-none fw-bold p-0" onClick={clearAll}>
//             Reset All
//           </button>
//         )}
//       </div>

//       {/* Active Chips */}
//       {activeChips.length > 0 && (
//         <div className="height-selcted-section p-2">
//           {activeChips.map((chip, idx) => (
//             <span key={idx} className="height-selcted-section-sub" style={{ fontSize: "11px" }}>
//               {chip.label}
//               <FaTimes
//                 style={{ cursor: "pointer", marginLeft: 6 }}
//                 onClick={() => {
//                   if (chip.group === "priceRange") handlePriceSelection(null);
//                   else if (chip.group === "discountMin") handleDiscountSelection(null);
//                   else handleToggleFilter(chip.group, chip.val);
//                 }}
//               />
//             </span>
//           ))}
//         </div>
//       )}

//       <div className="accordion accordion-flush" id="mainFilterAccordion">
//         {/* ==================== CATEGORIES (HIERARCHICAL) ==================== */}
//         <div className="accordion-item">
//           <h2 className="accordion-header pb-0 mb-0">
//             <button className="accordion-button text-black fw-normal" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCats">
//               Categories
//             </button>
//           </h2>
//           <div id="collapseCats" className="accordion-collapse collapse show">
//             <div className="accordion-body p-3" style={{ maxHeight: "300px", overflowY: "auto" }}>
//               {rootCategories.map((cat) => renderCategoryNode(cat))}
//             </div>
//           </div>
//         </div>

//         {/* Brands */}
//         {brands.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseBrands">
//                 Brands
//               </button>
//             </h2>
//             <div id="collapseBrands" className="accordion-collapse collapse">
//               <div className="accordion-body p-3" style={{ maxHeight: "250px", overflowY: "auto" }}>
//                 {brands.map((b) => (
//                   <div key={b.slug} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`brand-${b.slug}`}
//                       checked={(filters.brandIds || []).includes(b.slug)}
//                       onChange={() => handleToggleFilter("brandIds", b.slug)}
//                     />
//                     <label className={`form-check-label d-flex justify-content-between w-100 ${(filters.brandIds || []).includes(b.slug) ? "fw-bold text-primary" : ""}`} htmlFor={`brand-${b.slug}`} style={{ cursor: "pointer" }}>
//                       <span>{b.name}</span>
//                       <small className="text-muted">({b.count})</small>
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Skin Type */}
//         {skinTypes.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSkin">
//                 Skin Type
//               </button>
//             </h2>
//             <div id="collapseSkin" className="accordion-collapse collapse">
//               <div className="accordion-body p-3">
//                 {skinTypes.map((st) => (
//                   <div key={st.slug} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`st-${st.slug}`}
//                       checked={(filters.skinTypes || []).includes(st.slug)}
//                       onChange={() => handleToggleFilter("skinTypes", st.slug)}
//                     />
//                     <label className={`form-check-label d-flex justify-content-between w-100 ${(filters.skinTypes || []).includes(st.slug) ? "fw-bold text-primary" : ""}`} htmlFor={`st-${st.slug}`} style={{ cursor: "pointer" }}>
//                       <span>{st.name}</span>
//                       <small className="text-muted">({st.count})</small>
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Formulation - Special handling because slug is null */}
//         {formulations.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseForm">
//                 Formulation
//               </button>
//             </h2>
//             <div id="collapseForm" className="accordion-collapse collapse">
//               <div className="accordion-body p-3" style={{ maxHeight: "200px", overflowY: "auto" }}>
//                 {formulations.map((item) => {
//                   const valueToUse = item.slug || item.name;   // ← Fallback to name
//                   const isChecked = (filters.formulations || []).includes(valueToUse);

//                   return (
//                     <div key={item._id || item.name} className="form-check mb-2">
//                       <input
//                         className="form-check-input"
//                         type="checkbox"
//                         id={`form-${item._id}`}
//                         checked={isChecked}
//                         onChange={() => handleToggleFilter("formulations", valueToUse)}
//                       />
//                       <label className={`form-check-label d-flex justify-content-between w-100 ${isChecked ? "fw-bold text-primary" : ""}`} htmlFor={`form-${item._id}`} style={{ cursor: "pointer" }}>
//                         <span>{item.name}</span>
//                         <small className="text-muted">({item.count || 0})</small>
//                       </label>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Finish & Ingredients (normal slug usage) */}
//         {finishes.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFinish">
//                 Finish
//               </button>
//             </h2>
//             <div id="collapseFinish" className="accordion-collapse collapse">
//               <div className="accordion-body p-3" style={{ maxHeight: "200px", overflowY: "auto" }}>
//                 {finishes.map((item) => (
//                   <div key={item.slug} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`fin-${item.slug}`}
//                       checked={(filters.finishes || []).includes(item.slug)}
//                       onChange={() => handleToggleFilter("finishes", item.slug)}
//                     />
//                     <label className={`form-check-label d-flex justify-content-between w-100 ${(filters.finishes || []).includes(item.slug) ? "fw-bold text-primary" : ""}`} htmlFor={`fin-${item.slug}`} style={{ cursor: "pointer" }}>
//                       <span>{item.name}</span>
//                       <small className="text-muted">({item.count})</small>
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {ingredients.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseIng">
//                 Ingredients
//               </button>
//             </h2>
//             <div id="collapseIng" className="accordion-collapse collapse">
//               <div className="accordion-body p-3" style={{ maxHeight: "200px", overflowY: "auto" }}>
//                 {ingredients.map((item) => (
//                   <div key={item.slug} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`ing-${item.slug}`}
//                       checked={(filters.ingredients || []).includes(item.slug)}
//                       onChange={() => handleToggleFilter("ingredients", item.slug)}
//                     />
//                     <label className={`form-check-label d-flex justify-content-between w-100 ${(filters.ingredients || []).includes(item.slug) ? "fw-bold text-primary" : ""}`} htmlFor={`ing-${item.slug}`} style={{ cursor: "pointer" }}>
//                       <span>{item.name}</span>
//                       <small className="text-muted">({item.count})</small>
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Discount */}
//         {discountRanges.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDiscount">
//                 Discount
//               </button>
//             </h2>
//             <div id="collapseDiscount" className="accordion-collapse collapse">
//               <div className="accordion-body p-3">
//                 {discountRanges.map((d, i) => (
//                   <div key={i} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`disc-${i}`}
//                       checked={filters.discountMin === d.min}
//                       onChange={() => handleDiscountSelection(d.min)}
//                     />
//                     <label className={`form-check-label d-flex justify-content-between w-100 ${filters.discountMin === d.min ? "fw-bold text-primary" : ""}`} htmlFor={`disc-${i}`} style={{ cursor: "pointer" }}>
//                       <span>{d.label}</span>
//                       <small className="text-muted">({d.count})</small>
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Price Range */}
//         {priceRanges.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapsePrice">
//                 Price Range
//               </button>
//             </h2>
//             <div id="collapsePrice" className="accordion-collapse collapse">
//               <div className="accordion-body p-3">
//                 {priceRanges.map((p, i) => {
//                   const isSelected =
//                     filters.priceRange?.min === p.min &&
//                     filters.priceRange?.max === p.max;
//                   return (
//                     <div key={i} className="form-check mb-2">
//                       <input
//                         className="form-check-input"
//                         type="radio"
//                         name="priceRangeRadio"
//                         id={`price-${i}`}
//                         checked={isSelected}
//                         onChange={() => handlePriceSelection(p)}
//                       />
//                       <label className={`form-check-label ${isSelected ? "fw-bold text-primary" : ""}`} htmlFor={`price-${i}`} style={{ cursor: "pointer" }}>
//                         {p.label}
//                       </label>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {onClose && (
//         <div className="p-3 d-lg-none bg-light border-top">
//           <button className="btn btn-dark w-100 fw-bold" onClick={onClose}>
//             Show Results
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BrandFilter;
















// import React, { useState, useMemo } from "react";
// import { FaTimes, FaChevronRight, FaChevronDown } from "react-icons/fa";

// const BrandFilter = ({
//   filters,
//   setFilters,
//   onClose,
//   filterData = null,
//   onClearCategory,
//   onCategoryPillClick,
//   activeCategorySlug,
//   activeCategoryName = "",
//   trendingCategories = [],
// }) => {
//   const [expandedIds, setExpandedIds] = useState(new Set());

//   const {
//     brands = [],
//     categories = [],
//     skinTypes = [],
//     formulations = [],
//     finishes = [],
//     ingredients = [],
//     priceRanges = [],
//     discountRanges = [],
//   } = filterData || {};

//   /* ─── CORE TOGGLE LOGIC ────────────────────────────────────── */
//   const handleToggleFilter = (key, value) => {
//     if (!value) return;
//     setFilters((prev) => {
//       const currentList = [...(prev[key] || [])];
//       const index = currentList.indexOf(value);
//       let newList;
//       if (index > -1) {
//         newList = currentList.filter((item) => item !== value);
//       } else {
//         newList = [...currentList, value];
//       }
//       return { ...prev, [key]: newList };
//     });
//   };

//   const handlePriceSelection = (range) => {
//     setFilters((prev) => ({
//       ...prev,
//       priceRange: range ? { min: range.min, max: range.max } : null,
//     }));
//   };

//   const handleDiscountSelection = (minVal) => {
//     setFilters((prev) => ({
//       ...prev,
//       discountMin: prev.discountMin === minVal ? null : minVal,
//     }));
//   };

//   // ✅ Reset EVERYTHING to original state
//   const clearAll = () => {
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
//     setExpandedIds(new Set()); // collapse all category tree nodes
//     if (onClearCategory) onClearCategory(); // tell parent to clear active category pill
//   };

//   /* ─── CATEGORY HELPERS (HIERARCHICAL) ─────────────────────── */
//   const childrenMap = useMemo(() => {
//     const map = {};
//     categories.forEach((cat) => {
//       const parentId = cat.parent || null;
//       if (!map[parentId]) map[parentId] = [];
//       map[parentId].push(cat);
//     });
//     return map;
//   }, [categories]);

//   const rootCategories = useMemo(() => {
//     return categories.filter(
//       (cat) => !cat.parent || !categories.some((c) => c._id === cat.parent)
//     );
//   }, [categories]);

//   const toggleExpand = (catId) => {
//     setExpandedIds((prev) => {
//       const next = new Set(prev);
//       next.has(catId) ? next.delete(catId) : next.add(catId);
//       return next;
//     });
//   };

//   /* ─── ACTIVE CHIPS ────────────────────────────────────────── */
//   const activeChips = useMemo(() => {
//     const chips = [];
//     const sections = [
//       { key: "brandIds", list: brands, field: "slug" },
//       { key: "categoryIds", list: categories, field: "_id" },
//       { key: "skinTypes", list: skinTypes, field: "slug" },
//       { key: "formulations", list: formulations, field: "name" },
//       { key: "finishes", list: finishes, field: "slug" },
//       { key: "ingredients", list: ingredients, field: "slug" },
//     ];

//     sections.forEach((sec) => {
//       (filters[sec.key] || []).forEach((v) => {
//         const item = sec.list.find((i) => i[sec.field] === v || i._id === v);
//         if (item) {
//           chips.push({ group: sec.key, val: v, label: item.name || v });
//         }
//       });
//     });

//     if (filters.discountMin != null) {
//       const d = discountRanges.find((dr) => dr.min === filters.discountMin);
//       chips.push({ group: "discountMin", val: filters.discountMin, label: d?.label || `${filters.discountMin}% Off` });
//     }
//     if (filters.priceRange) {
//       const p = priceRanges.find((pr) =>
//         pr.min === filters.priceRange.min && pr.max === filters.priceRange.max
//       );
//       chips.push({ group: "priceRange", val: null, label: p?.label || "Price Filter" });
//     }

//     // Category pill from navigation
//     if (activeCategorySlug) {
//       const catName = activeCategoryName ||
//         trendingCategories.find(c => c.slug === activeCategorySlug)?.name ||
//         activeCategorySlug;
//       chips.push({
//         group: "categoryPill",
//         val: activeCategorySlug,
//         label: catName,
//         isPill: true,
//       });
//     }

//     return chips;
//   }, [filters, filterData, activeCategorySlug, activeCategoryName, trendingCategories]);

//   /* ─── CATEGORY RENDER (HIERARCHICAL) ───────────────────────── */
//   const renderCategoryNode = (cat, depth = 0) => {
//     const children = childrenMap[cat._id] || [];
//     const hasChildren = children.length > 0;
//     const isExpanded = expandedIds.has(cat._id);
//     const isChecked = (filters.categoryIds || []).includes(cat._id) ||
//                       (filters.categoryIds || []).includes(cat.slug) ||
//                       activeCategorySlug === cat.slug;

//     return (
//       <div key={cat._id} className="mb-1">
//         <div className="d-flex align-items-center" style={{ marginLeft: `${depth * 16}px` }}>
//           <span
//             onClick={() => hasChildren && toggleExpand(cat._id)}
//             style={{ width: 24, cursor: hasChildren ? "pointer" : "default", color: "#666" }}
//           >
//             {hasChildren && (isExpanded ? <FaChevronDown size={11} /> : <FaChevronRight size={11} />)}
//           </span>

//           <div className="form-check mb-0 flex-grow-1">
//             <input
//               className="form-check-input"
//               type="checkbox"
//               id={`cat-${cat._id || cat.slug}`}
//               checked={isChecked}
//               onChange={() => {
//                 if (onCategoryPillClick) {
//                   onCategoryPillClick(cat);
//                 } else {
//                   handleToggleFilter("categoryIds", cat._id || cat.slug);
//                 }
//               }}
//             />
//             <label
//               className={`form-check-label d-flex justify-content-between ${isChecked ? "fw-bold text-primary" : ""}`}
//               htmlFor={`cat-${cat._id || cat.slug}`}
//               style={{ cursor: "pointer", fontSize: "14px", fontWeight: depth === 0 ? "600" : "400" }}
//               onClick={(e) => {
//                 if (onCategoryPillClick) {
//                   e.preventDefault();
//                   onCategoryPillClick(cat);
//                 }
//               }}
//             >
//               <span>{cat.name}</span>
//               {cat.count > 0 && <small className="text-muted">({cat.count})</small>}
//             </label>
//           </div>
//         </div>

//         {isExpanded && children.map((child) => renderCategoryNode(child, depth + 1))}
//       </div>
//     );
//   };

//   if (!filterData) {
//     return <div className="p-4 text-center"><div className="spinner-border text-primary" /></div>;
//   }

//   return (
//     <div className="filter-sidebar border bg-white shadow-sm page-title-main-name"
//          style={{ position: "sticky", top: "140px", borderRadius: "12px", overflowY: "hidden" }}>

//       {/* Header */}
//       <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light">
//         <h6 className="mb-0 fw-bold">Filters</h6>
//         {/* Show "Reset All" ONLY when at least one chip is active */}
//         {activeChips.length > 0 && (
//           <button className="btn btn-sm btn-link text-danger text-decoration-none fw-bold p-0" onClick={clearAll}>
//             Reset All
//           </button>
//         )}
//       </div>

//       {/* Active Chips */}
//       {activeChips.length > 0 && (
//         <div className="height-selcted-section p-2">
//           {activeChips.map((chip, idx) => (
//             <span key={idx} className="height-selcted-section-sub" style={{ fontSize: "11px" }}>
//               {chip.isPill && <span style={{ opacity: 0.75 }}>Category: </span>}
//               {chip.label}
//               <FaTimes
//                 style={{ cursor: "pointer", marginLeft: 6 }}
//                 onClick={() => {
//                   if (chip.group === "categoryPill") {
//                     if (onClearCategory) onClearCategory();
//                   } else if (chip.group === "priceRange") {
//                     handlePriceSelection(null);
//                   } else if (chip.group === "discountMin") {
//                     handleDiscountSelection(null);
//                   } else {
//                     handleToggleFilter(chip.group, chip.val);
//                   }
//                 }}
//               />
//             </span>
//           ))}
//         </div>
//       )}

//       <div className="accordion accordion-flush" id="mainFilterAccordion">
//         {/* ==================== CATEGORIES (HIERARCHICAL) ==================== */}
//         <div className="accordion-item">
//           <h2 className="accordion-header pb-0 mb-0">
//             <button className="accordion-button text-black fw-normal" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCats">
//               Categories
//               {activeCategoryName && (
//                 <span className="ms-2 text-muted" style={{ fontSize: 12 }}>
//                   › {activeCategoryName}
//                 </span>
//               )}
//             </button>
//           </h2>
//           <div id="collapseCats" className="accordion-collapse collapse show">
//             <div className="accordion-body p-3" style={{ maxHeight: "320px", overflowY: "auto" }}>
//               {rootCategories.length > 0 ? (
//                 rootCategories.map((cat) => renderCategoryNode(cat))
//               ) : (
//                 <div className="text-muted small text-center py-3">No categories available</div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Brands */}
//         {brands.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseBrands">
//                 Brands
//               </button>
//             </h2>
//             <div id="collapseBrands" className="accordion-collapse collapse">
//               <div className="accordion-body p-3" style={{ maxHeight: "250px", overflowY: "auto" }}>
//                 {brands.map((b) => (
//                   <div key={b.slug} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`brand-${b.slug}`}
//                       checked={(filters.brandIds || []).includes(b.slug)}
//                       onChange={() => handleToggleFilter("brandIds", b.slug)}
//                     />
//                     <label className={`form-check-label d-flex justify-content-between w-100 ${(filters.brandIds || []).includes(b.slug) ? "fw-bold text-primary" : ""}`} htmlFor={`brand-${b.slug}`} style={{ cursor: "pointer" }}>
//                       <span>{b.name}</span>
//                       <small className="text-muted">({b.count})</small>
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Skin Type */}
//         {skinTypes.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSkin">
//                 Skin Type
//               </button>
//             </h2>
//             <div id="collapseSkin" className="accordion-collapse collapse">
//               <div className="accordion-body p-3">
//                 {skinTypes.map((st) => (
//                   <div key={st.slug} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`st-${st.slug}`}
//                       checked={(filters.skinTypes || []).includes(st.slug)}
//                       onChange={() => handleToggleFilter("skinTypes", st.slug)}
//                     />
//                     <label className={`form-check-label d-flex justify-content-between w-100 ${(filters.skinTypes || []).includes(st.slug) ? "fw-bold text-primary" : ""}`} htmlFor={`st-${st.slug}`} style={{ cursor: "pointer" }}>
//                       <span>{st.name}</span>
//                       <small className="text-muted">({st.count})</small>
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Formulation */}
//         {formulations.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseForm">
//                 Formulation
//               </button>
//             </h2>
//             <div id="collapseForm" className="accordion-collapse collapse">
//               <div className="accordion-body p-3" style={{ maxHeight: "200px", overflowY: "auto" }}>
//                 {formulations.map((item) => {
//                   const valueToUse = item.slug || item.name;
//                   const isChecked = (filters.formulations || []).includes(valueToUse);
//                   return (
//                     <div key={item._id || item.name} className="form-check mb-2">
//                       <input
//                         className="form-check-input"
//                         type="checkbox"
//                         id={`form-${item._id}`}
//                         checked={isChecked}
//                         onChange={() => handleToggleFilter("formulations", valueToUse)}
//                       />
//                       <label className={`form-check-label d-flex justify-content-between w-100 ${isChecked ? "fw-bold text-primary" : ""}`} htmlFor={`form-${item._id}`} style={{ cursor: "pointer" }}>
//                         <span>{item.name}</span>
//                         <small className="text-muted">({item.count || 0})</small>
//                       </label>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Finish */}
//         {finishes.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFinish">
//                 Finish
//               </button>
//             </h2>
//             <div id="collapseFinish" className="accordion-collapse collapse">
//               <div className="accordion-body p-3" style={{ maxHeight: "200px", overflowY: "auto" }}>
//                 {finishes.map((item) => (
//                   <div key={item.slug} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`fin-${item.slug}`}
//                       checked={(filters.finishes || []).includes(item.slug)}
//                       onChange={() => handleToggleFilter("finishes", item.slug)}
//                     />
//                     <label className={`form-check-label d-flex justify-content-between w-100 ${(filters.finishes || []).includes(item.slug) ? "fw-bold text-primary" : ""}`} htmlFor={`fin-${item.slug}`} style={{ cursor: "pointer" }}>
//                       <span>{item.name}</span>
//                       <small className="text-muted">({item.count})</small>
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Ingredients */}
//         {ingredients.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseIng">
//                 Ingredients
//               </button>
//             </h2>
//             <div id="collapseIng" className="accordion-collapse collapse">
//               <div className="accordion-body p-3" style={{ maxHeight: "200px", overflowY: "auto" }}>
//                 {ingredients.map((item) => (
//                   <div key={item.slug} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`ing-${item.slug}`}
//                       checked={(filters.ingredients || []).includes(item.slug)}
//                       onChange={() => handleToggleFilter("ingredients", item.slug)}
//                     />
//                     <label className={`form-check-label d-flex justify-content-between w-100 ${(filters.ingredients || []).includes(item.slug) ? "fw-bold text-primary" : ""}`} htmlFor={`ing-${item.slug}`} style={{ cursor: "pointer" }}>
//                       <span>{item.name}</span>
//                       <small className="text-muted">({item.count})</small>
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Discount */}
//         {discountRanges.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDiscount">
//                 Discount
//               </button>
//             </h2>
//             <div id="collapseDiscount" className="accordion-collapse collapse">
//               <div className="accordion-body p-3">
//                 {discountRanges.map((d, i) => (
//                   <div key={i} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`disc-${i}`}
//                       checked={filters.discountMin === d.min}
//                       onChange={() => handleDiscountSelection(d.min)}
//                     />
//                     <label className={`form-check-label d-flex justify-content-between w-100 ${filters.discountMin === d.min ? "fw-bold text-primary" : ""}`} htmlFor={`disc-${i}`} style={{ cursor: "pointer" }}>
//                       <span>{d.label}</span>
//                       <small className="text-muted">({d.count})</small>
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Price Range */}
//         {priceRanges.length > 0 && (
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapsePrice">
//                 Price Range
//               </button>
//             </h2>
//             <div id="collapsePrice" className="accordion-collapse collapse">
//               <div className="accordion-body p-3">
//                 {priceRanges.map((p, i) => {
//                   const isSelected =
//                     filters.priceRange?.min === p.min &&
//                     filters.priceRange?.max === p.max;
//                   return (
//                     <div key={i} className="form-check mb-2">
//                       <input
//                         className="form-check-input"
//                         type="radio"
//                         name="priceRangeRadio"
//                         id={`price-${i}`}
//                         checked={isSelected}
//                         onChange={() => handlePriceSelection(p)}
//                       />
//                       <label className={`form-check-label ${isSelected ? "fw-bold text-primary" : ""}`} htmlFor={`price-${i}`} style={{ cursor: "pointer" }}>
//                         {p.label}
//                       </label>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {onClose && (
//         <div className="p-3 d-lg-none bg-light border-top">
//           <button className="btn btn-dark w-100 fw-bold" onClick={onClose}>
//             Show Results
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BrandFilter;











import React, { useState, useMemo } from "react";
import { FaTimes, FaChevronRight, FaChevronDown } from "react-icons/fa";

// Default empty filter shape used as fallback
const EMPTY_FILTERS = {
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
};

const BrandFilter = ({
    filters,
    setFilters,
    onClose,
    filterData = null,
    onClearCategory,
    onCategoryPillClick,
    activeCategorySlug,
    activeCategoryName = "",
    trendingCategories = [],
    // 👇 New prop – the filter state to reset to
    defaultFilters,
}) => {
    const [expandedIds, setExpandedIds] = useState(new Set());

    // Merge the passed defaultFilters with the empty shape
    const mergedDefault = useMemo(() => {
        if (!defaultFilters) return EMPTY_FILTERS;
        return { ...EMPTY_FILTERS, ...defaultFilters };
    }, [defaultFilters]);

    const {
        brands: rawBrands = [],
        categories: rawCategories = [],
        skinTypes: rawSkinTypes = [],
        formulations: rawFormulations = [],
        finishes: rawFinishes = [],
        ingredients: rawIngredients = [],
        priceRanges = [],
        discountRanges = [],
    } = filterData || {};

    const deduplicate = (arr) => {
        if (!Array.isArray(arr)) return [];
        const seen = new Set();
        return arr.filter((item) => {
            if (!item) return false;
            const k = item.slug || item._id || item.id || item.name || "";
            if (!k || seen.has(k)) return false;
            seen.add(k);
            return true;
        });
    };

    const brands = useMemo(() => deduplicate(rawBrands), [rawBrands]);
    const categories = useMemo(() => deduplicate(rawCategories), [rawCategories]);
    const skinTypes = useMemo(() => deduplicate(rawSkinTypes), [rawSkinTypes]);
    const formulations = useMemo(() => deduplicate(rawFormulations), [rawFormulations]);
    const finishes = useMemo(() => deduplicate(rawFinishes), [rawFinishes]);
    const ingredients = useMemo(() => deduplicate(rawIngredients), [rawIngredients]);

    /* ─── CORE TOGGLE LOGIC ────────────────────────────────────── */
    const handleToggleFilter = (key, value) => {
        if (!value) return;
        setFilters((prev) => {
            const currentList = [...(prev[key] || [])];
            const index = currentList.indexOf(value);
            let newList;
            if (index > -1) {
                newList = currentList.filter((item) => item !== value);
            } else {
                newList = [...currentList, value];
            }
            return { ...prev, [key]: newList };
        });
    };

    const handlePriceSelection = (range) => {
        setFilters((prev) => ({
            ...prev,
            priceRange: range ? { min: range.min, max: range.max } : null,
        }));
    };

    const handleDiscountSelection = (minVal) => {
        setFilters((prev) => ({
            ...prev,
            discountMin: prev.discountMin === minVal ? null : minVal,
        }));
    };

    // ✅ Reset to the default state (instead of empty)
    const clearAll = () => {
        setFilters(mergedDefault);
        setExpandedIds(new Set());
        if (onClearCategory) onClearCategory();
    };

    /* ─── CATEGORY HELPERS (HIERARCHICAL) ─────────────────────── */
    const childrenMap = useMemo(() => {
        const map = {};
        categories.forEach((cat) => {
            const parentId = cat.parent || null;
            if (!map[parentId]) map[parentId] = [];
            map[parentId].push(cat);
        });
        return map;
    }, [categories]);

    const rootCategories = useMemo(() => {
        return categories.filter(
            (cat) => !cat.parent || !categories.some((c) => c._id === cat.parent)
        );
    }, [categories]);

    const toggleExpand = (catId) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            next.has(catId) ? next.delete(catId) : next.add(catId);
            return next;
        });
    };

    /* ─── ACTIVE CHIPS ────────────────────────────────────────── */
    const activeChips = useMemo(() => {
        const chips = [];
        const sections = [
            { key: "brandIds", list: brands, field: "slug" },
            { key: "categoryIds", list: categories, field: "_id" },
            { key: "skinTypes", list: skinTypes, field: "slug" },
            { key: "formulations", list: formulations, field: "name" },
            { key: "finishes", list: finishes, field: "slug" },
            { key: "ingredients", list: ingredients, field: "slug" },
        ];

        sections.forEach((sec) => {
            (filters[sec.key] || []).forEach((v) => {
                const item = sec.list.find((i) => i[sec.field] === v || i._id === v);
                if (item) {
                    chips.push({ group: sec.key, val: v, label: item.name || v });
                }
            });
        });

        if (filters.discountMin != null) {
            const d = discountRanges.find((dr) => dr.min === filters.discountMin);
            chips.push({ group: "discountMin", val: filters.discountMin, label: d?.label || `${filters.discountMin}% Off` });
        }
        if (filters.priceRange) {
            const p = priceRanges.find((pr) =>
                pr.min === filters.priceRange.min && pr.max === filters.priceRange.max
            );
            chips.push({ group: "priceRange", val: null, label: p?.label || "Price Filter" });
        }

        // Category pill from navigation
        if (activeCategorySlug) {
            const catName = activeCategoryName ||
                trendingCategories.find(c => c.slug === activeCategorySlug)?.name ||
                activeCategorySlug;
            chips.push({
                group: "categoryPill",
                val: activeCategorySlug,
                label: catName,
                isPill: true,
            });
        }

        return chips;
    }, [filters, filterData, activeCategorySlug, activeCategoryName, trendingCategories]);

    // 👇 True when current filters exactly match the default state
    const isDefault = useMemo(() => {
        // Shallow compare the relevant keys (ignore dynamic keys we never use)
        const compareKeys = [
            "brandIds",
            "categoryIds",
            "skinTypes",
            "formulations",
            "finishes",
            "ingredients",
            "priceRange",
            "discountMin",
        ];
        for (let key of compareKeys) {
            const a = filters[key];
            const b = mergedDefault[key];
            if (key === "priceRange") {
                if (a && b) {
                    if (a.min !== b.min || a.max !== b.max) return false;
                } else if (a !== b) return false;
            } else if (key === "discountMin") {
                if (a !== b) return false;
            } else {
                if ((a || []).length !== (b || []).length) return false;
                if (a && b && !a.every(v => b.includes(v))) return false;
            }
        }
        return true;
    }, [filters, mergedDefault]);

    /* ─── CATEGORY RENDER (HIERARCHICAL) ───────────────────────── */
    const renderCategoryNode = (cat, depth = 0) => {
        const children = childrenMap[cat._id] || [];
        const hasChildren = children.length > 0;
        const isExpanded = expandedIds.has(cat._id);
        const isChecked = (filters.categoryIds || []).includes(cat._id) ||
            (filters.categoryIds || []).includes(cat.slug) ||
            activeCategorySlug === cat.slug;

        return (
            <div key={cat._id} className="mb-1">
                <div className="d-flex align-items-center" style={{ marginLeft: `${depth * 16}px` }}>
                    <span
                        onClick={() => hasChildren && toggleExpand(cat._id)}
                        style={{ width: 24, cursor: hasChildren ? "pointer" : "default", color: "#666" }}
                    >
                        {hasChildren && (isExpanded ? <FaChevronDown size={11} /> : <FaChevronRight size={11} />)}
                    </span>

                    <div className="form-check mb-0 flex-grow-1">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id={`cat-${cat._id || cat.slug}`}
                            checked={isChecked}
                            onChange={() => {
                                if (onCategoryPillClick) {
                                    onCategoryPillClick(cat);
                                } else {
                                    handleToggleFilter("categoryIds", cat._id || cat.slug);
                                }
                            }}
                        />
                        <label
                            className={`form-check-label d-flex justify-content-between ${isChecked ? "fw-bold text-primary" : ""}`}
                            htmlFor={`cat-${cat._id || cat.slug}`}
                            style={{ cursor: "pointer", fontSize: "14px", fontWeight: depth === 0 ? "600" : "400" }}
                            onClick={(e) => {
                                if (onCategoryPillClick) {
                                    e.preventDefault();
                                    onCategoryPillClick(cat);
                                }
                            }}
                        >
                            <span>{cat.name}</span>
                            {cat.count > 0 && <small className="text-muted">({cat.count})</small>}
                        </label>
                    </div>
                </div>

                {isExpanded && children.map((child) => renderCategoryNode(child, depth + 1))}
            </div>
        );
    };

    if (!filterData) {
        return <div className="p-4 text-center"><div className="spinner-border text-primary" /></div>;
    }

    return (
        <div className="filter-sidebar border bg-white shadow-sm page-title-main-name"
            style={{ position: "sticky", top: "140px", borderRadius: "12px", overflowY: "hidden" }}>

            {/* Header */}
            <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light">
                <h6 className="mb-0 fw-semibold">Filters</h6>
                {/* 👇 Button visible when chips exist, DISABLED if already at default state */}
                {activeChips.length > 0 && (
                    <button
                        className="btn btn-sm btn-link text-danger text-decoration-none fw-bold p-0"
                        onClick={clearAll}
                        disabled={isDefault}
                        style={{ opacity: isDefault ? 0.5 : 1, cursor: isDefault ? "not-allowed" : "pointer" }}
                    >
                        Reset All
                    </button>
                )}
            </div>

            {/* Active Chips */}
            {activeChips.length > 0 && (
                <div className="height-selcted-section p-2">
                    {activeChips.map((chip, idx) => (
                        <span key={idx} className="height-selcted-section-sub" style={{ fontSize: "11px" }}>
                            {chip.isPill && <span style={{ opacity: 0.75 }}>Category: </span>}
                            {chip.label}
                            <FaTimes
                                style={{ cursor: "pointer", marginLeft: 6 }}
                                onClick={() => {
                                    if (chip.group === "categoryPill") {
                                        if (onClearCategory) onClearCategory();
                                    } else if (chip.group === "priceRange") {
                                        handlePriceSelection(null);
                                    } else if (chip.group === "discountMin") {
                                        handleDiscountSelection(null);
                                    } else {
                                        handleToggleFilter(chip.group, chip.val);
                                    }
                                }}
                            />
                        </span>
                    ))}
                </div>
            )}

            <div className="accordion accordion-flush" id="mainFilterAccordion">
                {/* ==================== CATEGORIES (HIERARCHICAL) ==================== */}
                <div className="accordion-item">
                    <h2 className="accordion-header pb-0 mb-0">
                        <button className="accordion-button text-black fw-normal" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCats">
                            Categories
                            {activeCategoryName && (
                                <span className="ms-2 text-muted" style={{ fontSize: 12 }}>
                                    › {activeCategoryName}
                                </span>
                            )}
                        </button>
                    </h2>
                    <div id="collapseCats" className="accordion-collapse collapse show">
                        <div className="accordion-body p-3" style={{ maxHeight: "320px", overflowY: "auto" }}>
                            {rootCategories.length > 0 ? (
                                rootCategories.map((cat) => renderCategoryNode(cat))
                            ) : (
                                <div className="text-muted small text-center py-3">No categories available</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Brands */}
                {brands.length > 0 && (
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseBrands">
                                Brands
                            </button>
                        </h2>
                        <div id="collapseBrands" className="accordion-collapse collapse">
                            <div className="accordion-body p-3" style={{ maxHeight: "250px", overflowY: "auto" }}>
                                {brands.map((b) => (
                                    <div key={b.slug} className="form-check mb-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`brand-${b.slug}`}
                                            checked={(filters.brandIds || []).includes(b.slug)}
                                            onChange={() => handleToggleFilter("brandIds", b.slug)}
                                        />
                                        <label className={`form-check-label d-flex justify-content-between w-100 ${(filters.brandIds || []).includes(b.slug) ? "fw-bold text-primary" : ""}`} htmlFor={`brand-${b.slug}`} style={{ cursor: "pointer" }}>
                                            <span>{b.name}</span>
                                            <small className="text-muted">({b.count})</small>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Skin Type */}
                {skinTypes.length > 0 && (
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSkin">
                                Skin Type
                            </button>
                        </h2>
                        <div id="collapseSkin" className="accordion-collapse collapse">
                            <div className="accordion-body p-3">
                                {skinTypes.map((st) => (
                                    <div key={st.slug} className="form-check mb-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`st-${st.slug}`}
                                            checked={(filters.skinTypes || []).includes(st.slug)}
                                            onChange={() => handleToggleFilter("skinTypes", st.slug)}
                                        />
                                        <label className={`form-check-label d-flex justify-content-between w-100 ${(filters.skinTypes || []).includes(st.slug) ? "fw-bold text-primary" : ""}`} htmlFor={`st-${st.slug}`} style={{ cursor: "pointer" }}>
                                            <span>{st.name}</span>
                                            <small className="text-muted">({st.count})</small>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Formulation */}
                {formulations.length > 0 && (
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseForm">
                                Formulation
                            </button>
                        </h2>
                        <div id="collapseForm" className="accordion-collapse collapse">
                            <div className="accordion-body p-3" style={{ maxHeight: "200px", overflowY: "auto" }}>
                                {formulations.map((item) => {
                                    const valueToUse = item.slug || item.name;
                                    const isChecked = (filters.formulations || []).includes(valueToUse);
                                    return (
                                        <div key={item._id || item.name} className="form-check mb-2">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`form-${item._id}`}
                                                checked={isChecked}
                                                onChange={() => handleToggleFilter("formulations", valueToUse)}
                                            />
                                            <label className={`form-check-label d-flex justify-content-between w-100 ${isChecked ? "fw-bold text-primary" : ""}`} htmlFor={`form-${item._id}`} style={{ cursor: "pointer" }}>
                                                <span>{item.name}</span>
                                                <small className="text-muted">({item.count || 0})</small>
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Finish */}
                {finishes.length > 0 && (
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFinish">
                                Finish
                            </button>
                        </h2>
                        <div id="collapseFinish" className="accordion-collapse collapse">
                            <div className="accordion-body p-3" style={{ maxHeight: "200px", overflowY: "auto" }}>
                                {finishes.map((item) => (
                                    <div key={item.slug} className="form-check mb-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`fin-${item.slug}`}
                                            checked={(filters.finishes || []).includes(item.slug)}
                                            onChange={() => handleToggleFilter("finishes", item.slug)}
                                        />
                                        <label className={`form-check-label d-flex justify-content-between w-100 ${(filters.finishes || []).includes(item.slug) ? "fw-bold text-primary" : ""}`} htmlFor={`fin-${item.slug}`} style={{ cursor: "pointer" }}>
                                            <span>{item.name}</span>
                                            <small className="text-muted">({item.count})</small>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Ingredients */}
                {ingredients.length > 0 && (
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseIng">
                                Ingredients
                            </button>
                        </h2>
                        <div id="collapseIng" className="accordion-collapse collapse">
                            <div className="accordion-body p-3" style={{ maxHeight: "200px", overflowY: "auto" }}>
                                {ingredients.map((item) => (
                                    <div key={item.slug} className="form-check mb-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`ing-${item.slug}`}
                                            checked={(filters.ingredients || []).includes(item.slug)}
                                            onChange={() => handleToggleFilter("ingredients", item.slug)}
                                        />
                                        <label className={`form-check-label d-flex justify-content-between w-100 ${(filters.ingredients || []).includes(item.slug) ? "fw-bold text-primary" : ""}`} htmlFor={`ing-${item.slug}`} style={{ cursor: "pointer" }}>
                                            <span>{item.name}</span>
                                            <small className="text-muted">({item.count})</small>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Discount */}
                {discountRanges.length > 0 && (
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDiscount">
                                Discount
                            </button>
                        </h2>
                        <div id="collapseDiscount" className="accordion-collapse collapse">
                            <div className="accordion-body p-3">
                                {discountRanges.map((d, i) => (
                                    <div key={i} className="form-check mb-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`disc-${i}`}
                                            checked={filters.discountMin === d.min}
                                            onChange={() => handleDiscountSelection(d.min)}
                                        />
                                        <label className={`form-check-label d-flex justify-content-between w-100 ${filters.discountMin === d.min ? "fw-bold text-primary" : ""}`} htmlFor={`disc-${i}`} style={{ cursor: "pointer" }}>
                                            <span>{d.label}</span>
                                            <small className="text-muted">({d.count})</small>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Price Range */}
                {priceRanges.length > 0 && (
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapsePrice">
                                Price Range
                            </button>
                        </h2>
                        <div id="collapsePrice" className="accordion-collapse collapse">
                            <div className="accordion-body p-3">
                                {priceRanges.map((p, i) => {
                                    const isSelected =
                                        filters.priceRange?.min === p.min &&
                                        filters.priceRange?.max === p.max;
                                    return (
                                        <div key={i} className="form-check mb-2">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="priceRangeRadio"
                                                id={`price-${i}`}
                                                checked={isSelected}
                                                onChange={() => handlePriceSelection(p)}
                                            />
                                            <label className={`form-check-label ${isSelected ? "fw-bold text-primary" : ""}`} htmlFor={`price-${i}`} style={{ cursor: "pointer" }}>
                                                {p.label}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {onClose && (
                <div className="p-3 d-lg-none bg-light border-top">
                    <button className="btn btn-dark w-100 fw-bold" onClick={onClose}>
                        Show Results
                    </button>
                </div>
            )}
        </div>
    );
};

export default BrandFilter;





//=========================================================================Done-Code(End)================================================================================












