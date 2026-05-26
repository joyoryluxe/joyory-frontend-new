// // src/pages/Recommendations.jsx
// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../css/Recommendations.css";

// export default function Recommendations() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const { shade, undertoneKey, family, formulation, products = [] } = location.state || {};

//   const handleBack = () => navigate(-1);

//   return (
//     <div className="container py-5 text-center">
//       <h3 className="fw-bold text-primary mb-3">
//         {shade ? `Shade: ${shade.name}` : "No Shade Selected"}
//       </h3>
//       {undertoneKey && <p className="text-muted mb-2">Undertone: {undertoneKey}</p>}
//       {family && <p className="text-muted mb-2">Family: {family.name}</p>}
//       {formulation && <p className="text-muted mb-4">Formulation: {formulation}</p>}

//       {products.length > 0 ? (
//         <div className="row">
//           {products.map((product) => (
//             <div key={product._id} className="col-md-4 mb-4">
//               <div className="border rounded p-3 text-center h-100">
//                 <h5>{product.name}</h5>
//                 <p>{product.variant} - ₹{product.price}</p>
//                 <p>Status: {product.status}</p>
//                 {product.image ? (
//                   <img src={product.image} alt={product.name} className="img-fluid mt-2" />
//                 ) : (
//                   <div
//                     style={{
//                       width: "100%",
//                       height: "150px",
//                       backgroundColor: "#f0f0f0",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       marginTop: "10px",
//                     }}
//                   >
//                     No Image
//                   </div>
//                 )}
//                 {product.shadeOptions && (
//                   <div className="mt-2">
//                     <p className="mb-1">Shades:</p>
//                     <div className="d-flex flex-wrap justify-content-center gap-2">
//                       {product.shadeOptions.map((shadeOption, i) => (
//                         <span
//                           key={i}
//                           style={{
//                             backgroundColor: product.colorOptions[i] || "#ccc",
//                             padding: "5px 10px",
//                             borderRadius: "5px",
//                             color: "#000",
//                             fontSize: "0.85rem",
//                           }}
//                         >
//                           {shadeOption}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p>No recommendations available for this selection.</p>
//       )}

//       <div className="d-flex justify-content-center gap-3 mt-4">
//         <button className="btn btn-secondary px-4" onClick={handleBack}>
//           Back
//         </button>
//       </div>
//     </div>
//   );
// }





// // src/pages/RecommendationsPage.jsx
// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";

// export default function recommendations() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const { shade, undertoneKey, family, formulation, recommendations } =
//     location.state || {};

//   const handleBack = () => navigate(-1);

//   return (
//     <div className="container py-5">
//       <h3 className="fw-bold text-primary mb-4 text-center">
//         Your Recommended Products
//       </h3>

//       <div className="mb-4 text-center">
//         <p><strong>Shade:</strong> {shade?.name || "N/A"}</p>
//         <p><strong>Undertone:</strong> {undertoneKey || "N/A"}</p>
//         <p><strong>Family:</strong> {family?.name || "N/A"}</p>
//         {/* ✅ show human name if available, fallback to _id */}
//         <p>
//           <strong>Formulation:</strong> {formulation?.name || formulation?._id || "N/A"}
//         </p>
//       </div>

//       {(!recommendations || recommendations.length === 0) ? (
//         <p className="text-center text-danger">
//           No recommendations found. Please try again.
//         </p>
//       ) : (
//         <div className="row">
//           {recommendations.map((product) => (
//             <div
//               key={product._id}
//               className="col-md-4 mb-4"
//             >
//               <div className="card h-100 shadow-sm">
//                 {product.image ? (
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="card-img-top p-3"
//                     style={{ maxHeight: "250px", objectFit: "contain" }}
//                   />
//                 ) : (
//                   <div
//                     className="d-flex align-items-center justify-content-center bg-light"
//                     style={{ height: "250px" }}
//                   >
//                     <span className="text-muted">No Image</span>
//                   </div>
//                 )}
//                 <div className="card-body">
//                   <h5 className="card-title">{product.name}</h5>
//                   {product.description && (
//                     <p className="card-text text-muted">{product.description}</p>
//                   )}
//                   {product.price && (
//                     <p className="fw-bold">₹{product.price}</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       <div className="text-center mt-4">
//         <button className="btn btn-secondary px-4" onClick={handleBack}>
//           Back
//         </button>
//       </div>
//     </div>
//   );
// }


















// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";

// export default function RecommendationsPage() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const { shade, undertoneKey, family, formulation, recommendations } =
//     location.state || {};

//   const handleBack = () => navigate(-1);

//   return (
//     <div className="container py-5">
//       <h3 className="fw-bold text-primary mb-4 text-center">
//         Your Recommended Products
//       </h3>

//       <div className="mb-4 text-center">
//         <p><strong>Shade:</strong> {shade?.name || "N/A"}</p>
//         <p><strong>Undertone:</strong> {undertoneKey || "N/A"}</p>
//         <p><strong>Family:</strong> {family?.name || "N/A"}</p>
//         <p>
//           <strong>Formulation:</strong>{" "}
//           {formulation?.name || formulation?._id || "N/A"}
//         </p>
//       </div>

//       {!recommendations || recommendations.length === 0 ? (
//         <p className="text-center text-danger">
//           No recommendations found. Please try again.
//         </p>
//       ) : (
//         <div className="row">
//           {recommendations.map((product) => (
//             <div key={product._id} className="col-md-4 mb-4">
//               <div className="card h-100 shadow-sm">
//                 {product.image ? (
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="card-img-top p-3"
//                     style={{ maxHeight: "250px", objectFit: "contain" }}
//                   />
//                 ) : (
//                   <div
//                     className="d-flex align-items-center justify-content-center bg-light"
//                     style={{ height: "250px" }}
//                   >
//                     <span className="text-muted">No Image</span>
//                   </div>
//                 )}
//                 <div className="card-body">
//                   <h5 className="card-title">{product.name}</h5>
//                   {product.variant && (
//                     <p className="text-muted">Variant: {product.variant}</p>
//                   )}
//                   {product.category?.name && (
//                     <p className="text-muted">
//                       Category: {product.category.name}
//                     </p>
//                   )}
//                   {product.price && (
//                     <p className="fw-bold">₹{product.price}</p>
//                   )}
//                   {product.status && (
//                     <p className="badge bg-success">{product.status}</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       <div className="text-center mt-4">
//         <button className="btn btn-secondary px-4" onClick={handleBack}>
//           Back
//         </button>
//       </div>
//     </div>
//   );
// }


















// // src/pages/RecommendationsPage.jsx
// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";

// export default function recommendations() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   // ✅ Extract backend data
//   const {
//     shade,
//     undertoneKey,
//     family,
//     formulation,
//     recommendations,
//     suggestions,
//   } = location.state || {};

//   const handleBack = () => navigate(-1);

//   // ✅ Pick main data first, fallback to suggestions if empty
//   const displayProducts =
//     recommendations && recommendations.length > 0
//       ? recommendations
//       : suggestions || [];

//   const hasRecommendations =
//     recommendations && recommendations.length > 0;

//   return (
//     <div className="container py-5">
//       <h3 className="fw-bold text-primary mb-4 text-center">
//         {hasRecommendations
//           ? "Your Recommended Products"
//           : "No Exact Match Found – Related Products"}
//       </h3>

//       <div className="mb-4 text-center">
//         <p><strong>Shade:</strong> {shade?.name || "N/A"}</p>
//         <p><strong>Undertone:</strong> {undertoneKey || "N/A"}</p>
//         <p><strong>Family:</strong> {family?.name || "N/A"}</p>
//         <p>
//           <strong>Formulation:</strong>{" "}
//           {formulation?.name || formulation?._id || "N/A"}
//         </p>
//       </div>

//       {displayProducts.length === 0 ? (
//         <p className="text-center text-danger">
//           No recommendations or related products found. Please try again.
//         </p>
//       ) : (
//         <div className="row">
//           {displayProducts.map((product) => (
//             <div key={product._id} className="col-md-4 mb-4">
//               <div className="card h-100 shadow-sm">
//                 {product.image ? (
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="card-img-top p-3"
//                     style={{ maxHeight: "250px", objectFit: "contain" }}
//                   />
//                 ) : (
//                   <div
//                     className="d-flex align-items-center justify-content-center bg-light"
//                     style={{ height: "250px" }}
//                   >
//                     <span className="text-muted">No Image</span>
//                   </div>
//                 )}
//                 <div className="card-body">
//                   <h5 className="card-title">{product.name}</h5>
//                   {product.variant && (
//                     <p className="card-text text-muted">Variant: {product.variant}</p>
//                   )}
//                   {product.description && (
//                     <p className="card-text text-muted">{product.description}</p>
//                   )}
//                   {product.price && (
//                     <p className="fw-bold">₹{product.price}</p>
//                   )}
//                   {product.status && (
//                     <p className="text-success">{product.status}</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       <div className="text-center mt-4">
//         <button className="btn btn-secondary px-4" onClick={handleBack}>
//           Back
//         </button>
//       </div>
//     </div>
//   );
// }















// // src/pages/RecommendationsPage.jsx
// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";

// export default function Recommendations() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const {
//     shade,
//     undertoneKey,
//     family,
//     formulation,
//     recommendations,
//     suggestions,
//   } = location.state || {};

//   const handleBack = () => navigate(-1);

//   // ✅ Main recommendations first, fallback to related products
//   const displayProducts =
//     recommendations && recommendations.length > 0
//       ? recommendations
//       : suggestions || [];

//   const hasRecommendations = recommendations && recommendations.length > 0;

//   return (
//     <div className="container py-5">
//       <h3 className="fw-bold text-primary mb-4 text-center">
//         {hasRecommendations
//           ? "Your Recommended Products"
//           : "No Exact Match Found – Related Products"}
//       </h3>

//       <div className="mb-4 text-center">
//         <p><strong>Shade:</strong> {shade?.name || "N/A"}</p>
//         <p><strong>Undertone:</strong> {undertoneKey || "N/A"}</p>
//         <p><strong>Family:</strong> {family?.name || "N/A"}</p>
//         <p>
//           <strong>Formulation:</strong>{" "}
//           {formulation?.name || formulation?._id || "N/A"}
//         </p>
//       </div>

//       {displayProducts.length === 0 ? (
//         <p className="text-center text-danger">
//           No recommendations or related products found. Please try again.
//         </p>
//       ) : (
//         <div className="row">
//           {displayProducts.map((product) => (
//             <div key={product._id} className="col-md-4 mb-4">
//               <div className="card h-100 shadow-sm">
//                 {product.image ? (
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="card-img-top p-3"
//                     style={{ maxHeight: "250px", objectFit: "contain" }}
//                   />
//                 ) : (
//                   <div
//                     className="d-flex align-items-center justify-content-center bg-light"
//                     style={{ height: "250px" }}
//                   >
//                     <span className="text-muted">No Image</span>
//                   </div>
//                 )}
//                 <div className="card-body">
//                   <h5 className="card-title">{product.name}</h5>
//                   {product.variant && (
//                     <p className="card-text text-muted">
//                       Variant: {product.variant}
//                     </p>
//                   )}
//                   {product.description && (
//                     <p className="card-text text-muted">{product.description}</p>
//                   )}
//                   {product.price && (
//                     <p className="fw-bold">₹{product.price}</p>
//                   )}
//                   {product.status && (
//                     <p className="text-success">{product.status}</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       <div className="text-center mt-4">
//         <button className="btn btn-secondary px-4" onClick={handleBack}>
//           Back
//         </button>
//       </div>
//     </div>
//   );
// }




















// export default function Recommendations() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const {
//     shade,
//     undertoneKey,
//     family,
//     formulation,
//     recommendations = [],
//     suggestions = [],
//   } = location.state || {};

//   const handleBack = () => navigate(-1);

//   // ✅ Prioritize recommendations, fallback to suggestions
//   const displayProducts =
//     recommendations.length > 0 ? recommendations : suggestions;

//   const hasRecommendations = recommendations.length > 0;
//   const hasSuggestions = suggestions.length > 0;

//   return (
//     <div className="container py-5">
//       <h3 className="fw-bold text-primary mb-4 text-center">
//         {hasRecommendations
//           ? "Your Recommended Products"
//           : hasSuggestions
//           ? "No Exact Match Found – Related Products"
//           : "No Products Found"}
//       </h3>

//       <div className="mb-4 text-center">
//         <p><strong>Shade:</strong> {shade?.name || "N/A"}</p>
//         <p><strong>Undertone:</strong> {undertoneKey || "N/A"}</p>
//         <p><strong>Family:</strong> {family?.name || "N/A"}</p>
//         <p>
//           <strong>Formulation:</strong>{" "}
//           {formulation?.name || formulation?._id || "N/A"}
//         </p>
//       </div>

//       {displayProducts.length === 0 ? (
//         <p className="text-center text-danger">
//           No recommendations or related products found. Please try again.
//         </p>
//       ) : (
//         <div className="row">
//           {displayProducts.map((product) => (
//             <div key={product._id} className="col-md-4 mb-4">
//               <div className="card h-100 shadow-sm">
//                 {product.image ? (
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="card-img-top p-3"
//                     style={{ maxHeight: "250px", objectFit: "contain" }}
//                   />
//                 ) : (
//                   <div
//                     className="d-flex align-items-center justify-content-center bg-light"
//                     style={{ height: "250px" }}
//                   >
//                     <span className="text-muted">No Image</span>
//                   </div>
//                 )}
//                 <div className="card-body">
//                   <h5 className="card-title">{product.name}</h5>
//                   {product.variant && (
//                     <p className="card-text text-muted">Variant: {product.variant}</p>
//                   )}
//                   {product.description && (
//                     <p className="card-text text-muted">{product.description}</p>
//                   )}
//                   {product.price && (
//                     <p className="fw-bold">₹{product.price}</p>
//                   )}
//                   {product.status && (
//                     <p className="text-success">{product.status}</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       <div className="text-center mt-4">
//         <button className="btn btn-secondary px-4" onClick={handleBack}>
//           Back
//         </button>
//       </div>
//     </div>
//   );
// }










// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// export default function Recommendations() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   // ✅ Defensive defaults to avoid crash
//   const {
//     shade = null,
//     undertoneKey = null,
//     family = null,
//     formulation = null,
//     recommendations = [],
//     suggestions = [],
//   } = location.state || {};

//   const handleBack = () => navigate(-1);

//   // ✅ Decide what to show
//   const hasRecommendations = Array.isArray(recommendations) && recommendations.length > 0;
//   const hasSuggestions = Array.isArray(suggestions) && suggestions.length > 0;

//   const displayProducts = hasRecommendations ? recommendations : hasSuggestions ? suggestions : [];

//   return (
//     <div className="container py-5">
//       <h3 className="fw-bold text-primary mb-4 text-center">
//         {hasRecommendations
//           ? "Your Recommended Products"
//           : hasSuggestions
//           ? "No Exact Match Found – Related Products"
//           : "No Products Found"}
//       </h3>

//       <div className="mb-4 text-center">
//         <p><strong>Shade:</strong> {shade?.name || "N/A"}</p>
//         <p><strong>Undertone:</strong> {undertoneKey || "N/A"}</p>
//         <p><strong>Family:</strong> {family?.name || "N/A"}</p>
//         <p>
//           <strong>Formulation:</strong>{" "}
//           {formulation?.name || formulation?._id || "N/A"}
//         </p>
//       </div>

//       {displayProducts.length === 0 ? (
//         <p className="text-center text-danger">
//           No recommendations or related products found. Please try again.
//         </p>
//       ) : (
//         <div className="row">
//           {displayProducts.map((product, idx) => (
//             <div key={product._id || idx} className="col-md-4 mb-4">
//               <div className="card h-100 shadow-sm">
//                 {product.image ? (
//                   <img
//                     src={product.image}
//                     alt={product.name || "Product"}
//                     className="card-img-top p-3"
//                     style={{ maxHeight: "250px", objectFit: "contain" }}
//                   />
//                 ) : (
//                   <div
//                     className="d-flex align-items-center justify-content-center bg-light"
//                     style={{ height: "250px" }}
//                   >
//                     <span className="text-muted">No Image</span>
//                   </div>
//                 )}
//                 <div className="card-body">
//                   <h5 className="card-title">{product.name || "Unnamed"}</h5>
//                   {product.variant && (
//                     <p className="card-text text-muted">Variant: {product.variant}</p>
//                   )}
//                   {product.description && (
//                     <p className="card-text text-muted">{product.description}</p>
//                   )}
//                   {product.price && (
//                     <p className="fw-bold">₹{product.price}</p>
//                   )}
//                   {product.status && (
//                     <p className="text-success">{product.status}</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       <div className="text-center mt-4">
//         <button className="btn btn-secondary px-4" onClick={handleBack}>
//           Back
//         </button>
//       </div>
//     </div>
//   );
// }









// // src/pages/RecommendationsPage.jsx
// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// export default function Recommendations() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Defensive defaults to avoid crash when visiting directly
//   const {
//     shade = null,
//     undertoneKey = null,
//     family = null,
//     formulation = null,
//     recommendations = [],
//     suggestions = [],
//   } = location.state || {};

//   const handleBack = () => navigate(-1);

//   // Decide what to show
//   const hasRecommendations = Array.isArray(recommendations) && recommendations.length > 0;
//   const hasSuggestions = Array.isArray(suggestions) && suggestions.length > 0;

//   // If recommendations not found, fall back to suggestions
//   const displayProducts =
//     hasRecommendations ? recommendations : hasSuggestions ? suggestions : [];

//   return (
//     <div className="container py-5">
//       {/* Title */}
//       <h3 className="fw-bold text-primary mb-4 text-center">
//         {hasRecommendations
//           ? "Your Recommended Products"
//           : hasSuggestions
//           ? "No Exact Match Found – Showing Related Products"
//           : "No Products Found"}
//       </h3>

//       {/* User selections summary */}
//       <div className="mb-4 text-center">
//         <p><strong>Shade:</strong> {shade?.name || "N/A"}</p>
//         <p><strong>Undertone:</strong> {undertoneKey || "N/A"}</p>
//         <p><strong>Family:</strong> {family?.name || "N/A"}</p>
//         <p>
//           <strong>Formulation:</strong>{" "}
//           {formulation?.name || formulation?._id || "N/A"}
//         </p>
//       </div>

//       {/* Product cards */}
//       {displayProducts.length === 0 ? (
//         <p className="text-center text-danger">
//           No recommendations or related products found. Please try again.
//         </p>
//       ) : (
//         <div className="row">
//           {displayProducts.map((product, idx) => (
//             <div key={product._id || idx} className="col-md-4 mb-4">
//               <div className="card h-100 shadow-sm">
//                 {/* Image */}
//                 {product.image ? (
//                   <img
//                     src={product.image}
//                     alt={product.name || "Product"}
//                     className="card-img-top p-3"
//                     style={{ maxHeight: "250px", objectFit: "contain" }}
//                   />
//                 ) : (
//                   <div
//                     className="d-flex align-items-center justify-content-center bg-light"
//                     style={{ height: "250px" }}
//                   >
//                     <span className="text-muted">No Image</span>
//                   </div>
//                 )}

//                 {/* Details */}
//                 <div className="card-body">
//                   {product.name && (
//                     <h5 className="card-title">{product.name}</h5>
//                   )}
//                   {product.variant && (
//                     <p className="card-text text-muted">Variant: {product.variant}</p>
//                   )}
//                   {product.description && (
//                     <p className="card-text text-muted">{product.description}</p>
//                   )}
//                   {product.price && (
//                     <p className="fw-bold">₹{product.price}</p>
//                   )}
//                   {product.status && (
//                     <p className="text-success">{product.status}</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Back button */}
//       <div className="text-center mt-4">
//         <button className="btn btn-secondary px-4" onClick={handleBack}>
//           Back
//         </button>
//       </div>
//     </div>
//   );
// }











// // src/pages/RecommendationsPage.jsx
// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// export default function Recommendations() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const {
//     shade = null,
//     undertoneKey = null,
//     family = null,
//     formulation = null,
//     recommendations = [],
//     suggestions = [],
//   } = location.state || {};

//   const handleBack = () => navigate(-1);

//   // Check recommendations
//   const hasRecommendations = Array.isArray(recommendations) && recommendations.length > 0;

//   // Suggestions may contain nested products
//   const hasSuggestions =
//     Array.isArray(suggestions) &&
//     suggestions.some((s) => Array.isArray(s.products) && s.products.length > 0);

//   // Flatten products
//   const displayProducts = hasRecommendations
//     ? recommendations
//     : hasSuggestions
//     ? suggestions.flatMap((s) => s.products || [])
//     : [];

//   return (
//     <div className="container py-5">
//       {/* Title */}
//       <h3 className="fw-bold text-primary mb-4 text-center">
//         {hasRecommendations
//           ? "Your Recommended Products"
//           : hasSuggestions
//           ? "No Exact Match Found – Showing Related Products"
//           : "No Products Found"}
//       </h3>

//       {/* User selections summary */}
//       <div className="mb-4 text-center">
//         <p><strong>Shade:</strong> {shade?.name || "N/A"}</p>
//         <p><strong>Undertone:</strong> {undertoneKey || "N/A"}</p>
//         <p><strong>Family:</strong> {family?.name || "N/A"}</p>
//         <p>
//           <strong>Formulation:</strong>{" "}
//           {formulation?.name || formulation?._id || "N/A"}
//         </p>
//       </div>

//       {/* Product cards */}
//       {displayProducts.length === 0 ? (
//         <p className="text-center text-danger">
//           No recommendations or related products found. Please try again.
//         </p>
//       ) : (
//         <div className="row">
//           {displayProducts.map((product, idx) => (
//             <div key={product._id || idx} className="col-md-4 mb-4">
//               <div className="card h-100 shadow-sm">
//                 {/* Image */}
//                 {product.image ? (
//                   <img
//                     src={product.image}
//                     alt={product.name || "Product"}
//                     className="card-img-top p-3"
//                     style={{ maxHeight: "250px", objectFit: "contain" }}
//                   />
//                 ) : (
//                   <div
//                     className="d-flex align-items-center justify-content-center bg-light"
//                     style={{ height: "250px" }}
//                   >
//                     <span className="text-muted">No Image</span>
//                   </div>
//                 )}

//                 {/* Details */}
//                 <div className="card-body">
//                   {product.name && <h5 className="card-title">{product.name}</h5>}
//                   {product.variant && (
//                     <p className="card-text text-muted">Variant: {product.variant}</p>
//                   )}
//                   {product.summary && (
//                     <p className="card-text text-muted">{product.summary}</p>
//                   )}
//                   {product.price && (
//                     <p className="fw-bold">₹{product.price}</p>
//                   )}
//                   {product.status && (
//                     <p className="text-success">{product.status}</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Back button */}
//       <div className="text-center mt-4">
//         <button className="btn btn-secondary px-4" onClick={handleBack}>
//           Back
//         </button>
//       </div>
//     </div>
//   );
// }











// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// export default function Recommendations() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const {
//     shade = null,
//     undertoneKey = null,
//     family = null,
//     formulation = null,
//     recommendations = [],
//     suggestions = [],
//   } = location.state || {};

//   const handleBack = () => navigate(-1);

//   // Check recommendations
//   const hasRecommendations = Array.isArray(recommendations) && recommendations.length > 0;

//   // Suggestions may contain nested products
//   const hasSuggestions =
//     Array.isArray(suggestions) &&
//     suggestions.some((s) => Array.isArray(s.products) && s.products.length > 0);

//   // Flatten products
//   const displayProducts = hasRecommendations
//     ? recommendations
//     : hasSuggestions
//     ? suggestions.flatMap((s) => s.products || [])
//     : [];

//   const handleProductClick = (productId) => {
//     // Navigate to product detail page by id
//     navigate(`/product/${productId}`);
//   };

//   return (
//     <div className="container py-5">
//       <h3 className="fw-bold text-primary mb-4 text-center">
//         {hasRecommendations
//           ? "Your Recommended Products"
//           : hasSuggestions
//           ? "No Exact Match Found – Showing Related Products"
//           : "No Products Found"}
//       </h3>

//       {/* User selections summary */}
//       <div className="mb-4 text-center">
//         <p><strong>Shade:</strong> {shade?.name || "N/A"}</p>
//         <p><strong>Undertone:</strong> {undertoneKey || "N/A"}</p>
//         <p><strong>Family:</strong> {family?.name || "N/A"}</p>
//         <p>
//           <strong>Formulation:</strong>{" "}
//           {formulation?.name || formulation?._id || "N/A"}
//         </p>
//       </div>

//       {/* Product cards */}
//       {displayProducts.length === 0 ? (
//         <p className="text-center text-danger">
//           No recommendations or related products found. Please try again.
//         </p>
//       ) : (
//         <div className="row">
//           {displayProducts.map((product, idx) => (
//             <div
//               key={product._id || idx}
//               className="col-md-4 mb-4"
//               style={{ cursor: "pointer" }}
//               onClick={() => handleProductClick(product._id)}
//             >
//               <div className="card h-100 shadow-sm">
//                 {/* Image */}
//                 {product.image ? (
//                   <img
//                     src={product.image}
//                     alt={product.name || "Product"}
//                     className="card-img-top p-3"
//                     style={{ maxHeight: "250px", objectFit: "contain" }}
//                   />
//                 ) : (
//                   <div
//                     className="d-flex align-items-center justify-content-center bg-light"
//                     style={{ height: "250px" }}
//                   >
//                     <span className="text-muted">No Image</span>
//                   </div>
//                 )}

//                 {/* Details */}
//                 <div className="card-body">
//                   {product.name && <h5 className="card-title">{product.name}</h5>}
//                   {product.variant && (
//                     <p className="card-text text-muted">Variant: {product.variant}</p>
//                   )}
//                   {product.summary && (
//                     <p className="card-text text-muted">{product.summary}</p>
//                   )}
//                   {product.price && (
//                     <p className="fw-bold">₹{product.price}</p>
//                   )}
//                   {product.status && (
//                     <p className="text-success">{product.status}</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Back button */}
//       <div className="text-center mt-4">
//         <button className="btn btn-secondary px-4" onClick={handleBack}>
//           Back
//         </button>
//       </div>
//     </div>
//   );
// }























// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// export default function Recommendations() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const {
//     shade = null,
//     undertoneKey = null,
//     family = null,
//     formulation = null,
//     recommendations = [],
//     suggestions = [],
//   } = location.state || {};

//   const handleBack = () => navigate(-1);

//   // Check recommendations
//   const hasRecommendations = Array.isArray(recommendations) && recommendations.length > 0;

//   // Suggestions may contain nested products
//   const hasSuggestions =
//     Array.isArray(suggestions) &&
//     suggestions.some((s) => Array.isArray(s.products) && s.products.length > 0);

//   // Flatten products
//   const displayProducts = hasRecommendations
//     ? recommendations
//     : hasSuggestions
//     ? suggestions.flatMap((s) => s.products || [])
//     : [];

//   const handleProductClick = (productId) => {
//     // Navigate to product detail page by id
//     navigate(`/product/${productId}`);
//   };

//   return (
//     <div className="container py-5">
//       <h3 className="fw-bold text-primary mb-4 text-center">
//         {hasRecommendations
//           ? "Your Recommended Products"
//           : hasSuggestions
//           ? "No Exact Match Found – Showing Related Products"
//           : "No Products Found"}
//       </h3>

//       {/* User selections summary */}
//       <div className="mb-4 text-center">
//         <p><strong>Shade:</strong> {shade?.name || "N/A"}</p>
//         <p><strong>Undertone:</strong> {undertoneKey || "N/A"}</p>
//         <p><strong>Family:</strong> {family?.name || "N/A"}</p>
//         <p>
//           <strong>Formulation:</strong>{" "}
//           {formulation?.name || formulation?._id || "N/A"}
//         </p>
//       </div>

//       {/* Product cards */}
//       {displayProducts.length === 0 ? (
//         <p className="text-center text-danger">
//           No recommendations or related products found. Please try again.
//         </p>
//       ) : (
//         <div className="row">
//           {displayProducts.map((product, idx) => (
//             <div
//               key={product._id || idx}
//               className="col-md-4 mb-4"
//               style={{ cursor: "pointer" }}
//               onClick={() => handleProductClick(product._id)}
//             >
//               <div className="card h-100 shadow-sm">
//                 {/* Image */}
//                 {product.image ? (
//                   <img
//                     src={product.image}
//                     alt={product.name || "Product"}
//                     className="card-img-top p-3"
//                     style={{ maxHeight: "250px", objectFit: "contain" }}
//                   />
//                 ) : (
//                   <div
//                     className="d-flex align-items-center justify-content-center bg-light"
//                     style={{ height: "250px" }}
//                   >
//                     <span className="text-muted">No Image</span>
//                   </div>
//                 )}

//                 {/* Details */}
//                 <div className="card-body">
//                   {product.name && <h5 className="card-title">{product.name}</h5>}
//                   {product.variant && (
//                     <p className="card-text text-muted">Variant: {product.variant}</p>
//                   )}
//                   {product.summary && (
//                     <p className="card-text text-muted">{product.summary}</p>
//                   )}
//                   {product.price && (
//                     <p className="fw-bold">₹{product.price}</p>
//                   )}
//                   {product.status && (
//                     <p className="text-success">{product.status}</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Back button */}
//       <div className="text-center mt-4">
//         <button className="btn btn-secondary px-4" onClick={handleBack}>
//           Back
//         </button>
//       </div>
//     </div>
//   );
// }














// import React, { useState, useContext } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { CartContext } from "../Context/CartContext";
// import axiosInstance from "../utils/axiosInstance.js";
// import Footer from "./Footer";
// import Header from "./Header";

// export default function Recommendations() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { addToCart } = useContext(CartContext);

//   const {
//     shade = null,
//     undertoneKey = null,
//     family = null,
//     formulation = null,
//     recommendations = [],
//     suggestions = [],
//   } = location.state || {};

//   const [selectedShades, setSelectedShades] = useState({});

//   const handleBack = () => navigate(-1);

//   const hasRecommendations = Array.isArray(recommendations) && recommendations.length > 0;
//   const hasSuggestions =
//     Array.isArray(suggestions) &&
//     suggestions.some((s) => Array.isArray(s.products) && s.products.length > 0);

//   const displayProducts = hasRecommendations
//     ? recommendations
//     : hasSuggestions
//     ? suggestions.flatMap((s) => s.products || [])
//     : [];

//   const handleProductClick = (productId) => navigate(`/product/${productId}`);

//   // ===================== Shade Select =====================
//   const handleShadeSelect = (productId, shadeItem) => {
//     setSelectedShades((prev) => ({
//       ...prev,
//       [productId]: shadeItem,
//     }));
//   };

//   // ===================== Add to Cart =====================
//   const handleAddToCart = async (product) => {
//     try {
//       const selectedShade = selectedShades[product._id];

//       if (!selectedShade) {
//         alert("Please select a shade first!");
//         return;
//       }

//       const cartPayload = {
//         productId: product._id,
//         variants: [{ variantSku: selectedShade.sku, quantity: 1 }],
//       };

//       const res = await axiosInstance.post("/api/user/cart/add", cartPayload);

//       if (res.data.success) {
//         addToCart(product, selectedShade);
//         alert("✅ Product added to cart!");
//         navigate("/cartpage", { state: { refresh: true } });
//       } else {
//         alert(res.data.message || "❌ Failed to add product");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("❌ Something went wrong. Please try again!");
//     }
//   };

//   return (

//         <>

//     <Header />


//     <div className="container py-5">
//       <h3 className="fw-bold text-primary mb-4 text-center">
//         {hasRecommendations
//           ? "Your Recommended Products"
//           : hasSuggestions
//           ? "No Exact Match Found – Showing Related Products"
//           : "No Products Found"}
//       </h3>

//       {/* User selections summary */}
//       <div className="mb-4 text-center">
//         <p><strong>Shade:</strong> {shade?.name || "N/A"}</p>
//         <p><strong>Undertone:</strong> {undertoneKey || "N/A"}</p>
//         <p><strong>Family:</strong> {family?.name || "N/A"}</p>
//         <p>
//           <strong>Formulation:</strong>{" "}
//           {formulation?.name || formulation?._id || "N/A"}
//         </p>
//       </div>

//       {/* Product cards */}
//       {displayProducts.length === 0 ? (
//         <p className="text-center text-danger">
//           No recommendations or related products found. Please try again.
//         </p>
//       ) : (
//         <div className="row">
//           {displayProducts.map((product, idx) => {
//             const selectedShade = selectedShades[product._id];
//             return (
//               <div key={product._id || idx} className="col-md-4 mb-4">
//                 <div className="card h-100 shadow-sm">
//                   {/* Image */}
//                   <img
//                     src={selectedShade?.image || product.image || "/placeholder.png"}
//                     alt={product.name || "Product"}
//                     className="card-img-top p-3"
//                     style={{ maxHeight: "250px", objectFit: "contain" }}
//                     onClick={() => handleProductClick(product._id)}
//                   />

//                   {/* Details */}
//                   <div className="card-body d-flex flex-column">
//                     <h5
//                       className="card-title"
//                       style={{ cursor: "pointer" }}
//                       onClick={() => handleProductClick(product._id)}
//                     >
//                       {product.name}
//                     </h5>
//                     {product.summary && (
//                       <p className="card-text text-muted">{product.summary}</p>
//                     )}
//                     {product.price && <p className="fw-bold">₹{product.price}</p>}

//                     {/* Shades */}
//                     {Array.isArray(product.shades) && product.shades.length > 0 ? (
//                       <div className="mt-2">
//                         <strong>Shades:</strong>
//                         <div className="d-flex flex-wrap mt-1">
//                           {product.shades.map((shadeItem, sIdx) => {
//                             const isSelected =
//                               selectedShade?.sku === shadeItem.sku ||
//                               selectedShade?.name === shadeItem.name;
//                             return (
//                               <div
//                                 key={sIdx}
//                                 className="me-3 mb-1 d-flex align-items-center"
//                                 style={{
//                                   cursor: "pointer",
//                                   fontWeight: isSelected ? "bold" : "normal",
//                                 }}
//                                 onClick={() => handleShadeSelect(product._id, shadeItem)}
//                               >
//                                 {shadeItem.colorCode && (
//                                   <span
//                                     style={{
//                                       display: "inline-block",
//                                       width: "20px",
//                                       height: "20px",
//                                       borderRadius: "50%",
//                                       backgroundColor: shadeItem.colorCode,
//                                       border: isSelected ? "2px solid black" : "1px solid #ccc",
//                                       marginRight: "5px",
//                                     }}
//                                   ></span>
//                                 )}
//                                 <span className="text-muted" style={{ fontSize: "0.9rem" }}>
//                                   {shadeItem.name}
//                                 </span>
//                               </div>
//                             );
//                           })}
//                         </div>
//                       </div>
//                     ) : (
//                       <p className="text-muted mt-2" style={{ fontSize: "0.9rem" }}>
//                         No shades available
//                       </p>
//                     )}

//                     {selectedShade && (
//                       <div className="mt-2 text-primary fw-bold">
//                         Selected: {selectedShade.name}
//                       </div>
//                     )}

//                     <button
//                       className="btn btn-primary mt-auto"
//                       style={{ marginTop: "10px" }}
//                       onClick={() => handleAddToCart(product)}
//                       disabled={!selectedShade}
//                     >
//                       Add to Cart
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Back button */}
//       <div className="text-center mt-4">
//         <button className="btn btn-secondary px-4" onClick={handleBack}>
//           Back
//         </button>
//       </div>
//     </div>


//          <Footer />

//     </>

//   );
// }











// import React, { useState, useEffect, useContext } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { CartContext } from "../Context/CartContext";
// import axiosInstance from "../utils/axiosInstance.js";
// import Footer from "./Footer";
// import Header from "./Header";
// import "../css/Recommendations.css";

// export default function Recommendations() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { addToCart } = useContext(CartContext);

//   const {
//     shade = null,
//     undertoneKey = null,
//     family = null,
//     formulation = null,
//     recommendations = [],
//     suggestions = [],
//   } = location.state || {};

//   const [selectedShades, setSelectedShades] = useState({});

//   const handleBack = () => navigate(-1);

//   const hasRecommendations = Array.isArray(recommendations) && recommendations.length > 0;
//   const hasSuggestions =
//     Array.isArray(suggestions) &&
//     suggestions.some((s) => Array.isArray(s.products) && s.products.length > 0);

//   const displayProducts = hasRecommendations
//     ? recommendations
//     : hasSuggestions
//     ? suggestions.flatMap((s) => s.products || [])
//     : [];

//   // ===================== Shade / Variant Selection =====================
//   useEffect(() => {
//     const defaultShades = {};
//     displayProducts.forEach((product) => {
//       const firstVariant = product.variants?.find(v => v.stock > 0) || product.variants?.[0];
//       if (firstVariant) defaultShades[product._id] = firstVariant;
//     });
//     setSelectedShades(defaultShades);
//   }, [displayProducts]);

//   const handleShadeSelect = (productId, shadeItem) => {
//     setSelectedShades((prev) => ({
//       ...prev,
//       [productId]: shadeItem,
//     }));
//   };

//   // ===================== Add to Cart =====================
//   const handleAddToCart = async (product) => {
//     try {
//       const selectedShade = selectedShades[product._id];
//       if (!selectedShade) {
//         alert("Please select a shade first!");
//         return;
//       }

//       const cartPayload = {
//         productId: product._id,
//         variants: [{ variantSku: selectedShade.sku, quantity: 1 }],
//       };

//       const res = await axiosInstance.post("/api/user/cart/add", cartPayload);

//       if (res.data.success) {
//         addToCart(product, selectedShade);
//         alert("✅ Product added to cart!");
//         navigate("/cartpage", { state: { refresh: true } });
//       } else {
//         alert(res.data.message || "❌ Failed to add product");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("❌ Something went wrong. Please try again!");
//     }
//   };

//   const handleProductClick = (productId) => navigate(`/product/${productId}`);

//   return (
//     <>
//       <Header />

//       <div className="container py-5">
//         <h3 className="fw-bold text-primary mb-4 text-center">
//           {hasRecommendations
//             ? "Your Recommended Products"
//             : hasSuggestions
//             ? "No Exact Match Found – Showing Related Products"
//             : "No Products Found"}
//         </h3>

//         {/* User selections summary */}
//         <div className="mb-4 text-center">
//           <p><strong>Shade:</strong> {shade?.name || "N/A"}</p>
//           <p><strong>Undertone:</strong> {undertoneKey || "N/A"}</p>
//           <p><strong>Family:</strong> {family?.name || "N/A"}</p>
//           <p><strong>Formulation:</strong> {formulation?.name || formulation?._id || "N/A"}</p>
//         </div>

//         {/* Product cards */}
//         {displayProducts.length === 0 ? (
//           <p className="text-center text-danger">
//             No recommendations or related products found. Please try again.
//           </p>
//         ) : (
//           <div className="row">
//             {displayProducts.map((product, idx) => {
//               const selectedShade = selectedShades[product._id];
//               const productImage = selectedShade?.images?.[0] || product.images?.[0] || "/placeholder.png";

//               const shadesToShow = product.shades?.length > 0 ? product.shades : product.variants || [];

//               return (
//                 <div key={product._id || idx} className="col-sm-6 col-lg-4 mb-4">
//                   <div className="card h-100 shadow-sm">
//                     {/* Image */}
//                     <img
//                       src={productImage}
//                       alt={product.name || "Product"}
//                       className="card-img-top p-3"
//                       style={{ maxHeight: "250px", objectFit: "contain", cursor: "pointer" }}
//                       onClick={() => handleProductClick(product._id)}
//                     />

//                     <div className="card-body d-flex flex-column">
//                       {/* Name */}
//                       <h5
//                         className="card-title"
//                         style={{ cursor: "pointer" }}
//                         onClick={() => handleProductClick(product._id)}
//                       >
//                         {product.name}
//                       </h5>

//                       {product.summary && <p className="card-text text-muted">{product.summary}</p>}
//                       {product.price && <p className="fw-bold">₹{product.price}</p>}

//                       {/* Shades / Variants */}
//                       {shadesToShow.length > 0 ? (
//                         <div className="mt-2">
//                           <strong>Shades:</strong>
//                           <div className="d-flex flex-wrap mt-1">
//                             {shadesToShow.map((shadeItem, sIdx) => {
//                               const isSelected =
//                                 selectedShade?.sku === shadeItem.sku ||
//                                 selectedShade?.name === shadeItem.name;
//                               return (
//                                 <div
//                                   key={sIdx}
//                                   className="me-2 mb-2 d-flex align-items-center"
//                                   style={{ cursor: "pointer" }}
//                                 >
//                                   {/* Hex Circle */}
//                                   {shadeItem.hex && (
//                                     <button
//                                       onClick={() => handleShadeSelect(product._id, shadeItem)}
//                                       className={`btn p-0 me-1 ${isSelected ? "border border-dark" : "border border-secondary"}`}
//                                       style={{
//                                         backgroundColor: shadeItem.hex,
//                                         width: "25px",
//                                         height: "25px",
//                                         borderRadius: "50%",
//                                       }}
//                                       title={shadeItem.shadeName || shadeItem.name}
//                                     />
//                                   )}
//                                   {/* Size / Shade Name */}
//                                   <button
//                                     onClick={() => handleShadeSelect(product._id, shadeItem)}
//                                     className={`btn btn-outline-primary btn-sm ${isSelected ? "active" : ""}`}
//                                   >
//                                     {shadeItem.shadeName || shadeItem.name || shadeItem.familyKey}
//                                   </button>
//                                 </div>
//                               );
//                             })}
//                           </div>
//                         </div>
//                       ) : (
//                         <p className="text-muted mt-2" style={{ fontSize: "0.9rem" }}>
//                           No shades available
//                         </p>
//                       )}

//                       {selectedShade && (
//                         <div className="mt-2 text-primary fw-bold">
//                           Selected: {selectedShade.shadeName || selectedShade.name} — ₹
//                           {selectedShade.discountedPrice || selectedShade.price || product.price}
//                         </div>
//                       )}

//                       {/* Add to Cart */}
//                       <button
//                         className="btn btn-primary mt-auto"
//                         style={{ marginTop: "10px" }}
//                         onClick={() => handleAddToCart(product)}
//                         disabled={!selectedShade}
//                       >
//                         Add to Cart
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* Back button */}
//         <div className="text-center mt-4">
//           <button className="btn btn-secondary px-4" onClick={handleBack}>
//             Back
//           </button>
//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// }



















// import React, { useState, useEffect, useContext } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { CartContext } from "../Context/CartContext";
// import axiosInstance from "../utils/axiosInstance.js";
// import Footer from "./Footer";
// import Header from "./Header";
// import "../css/Recommendations.css";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function Recommendations() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { addToCart } = useContext(CartContext);

//   const {
//     shade = null,
//     undertoneKey = null,
//     family = null,
//     formulation = null,
//     recommendations = [],
//     suggestions = [],
//   } = location.state || {};

//   const [selectedShades, setSelectedShades] = useState({});

//   const handleBack = () => navigate(-1);

//   const hasRecommendations = Array.isArray(recommendations) && recommendations.length > 0;
//   const hasSuggestions =
//     Array.isArray(suggestions) &&
//     suggestions.some((s) => Array.isArray(s.products) && s.products.length > 0);

//   const displayProducts = hasRecommendations
//     ? recommendations
//     : hasSuggestions
//     ? suggestions.flatMap((s) => s.products || [])
//     : [];

//   // Auto-select first variant/shade
//   useEffect(() => {
//     const defaultShades = {};
//     displayProducts.forEach((product) => {
//       const firstVariant = product.variants?.find(v => v.stock > 0) || product.variants?.[0];
//       if (firstVariant) defaultShades[product._id] = firstVariant;
//     });
//     setSelectedShades(defaultShades);
//   }, [displayProducts]);

//   const handleShadeSelect = (productId, shadeItem) => {
//     setSelectedShades((prev) => ({
//       ...prev,
//       [productId]: shadeItem,
//     }));
//   };

//   const handleAddToCart = async (product) => {
//     try {
//       const selectedShade = selectedShades[product._id];
//       if (!selectedShade) {
//         alert("Please select a shade first!");
//         return;
//       }

//       const cartPayload = {
//         productId: product._id,
//         variants: [{ variantSku: selectedShade.sku, quantity: 1 }],
//       };

//       const res = await axiosInstance.post("/api/user/cart/add", cartPayload);

//       if (res.data.success) {
//         addToCart(product, selectedShade);
//         alert("✅ Product added to cart!");
//         navigate("/cartpage", { state: { refresh: true } });
//       } else {
//         alert(res.data.message || "❌ Failed to add product");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("❌ Something went wrong. Please try again!");
//     }
//   };

//   const handleProductClick = (productId) => navigate(`/product/${productId}`);

//   return (
//     <>
//       <Header />

//       <div className="container py-5">
//         <h3 className="fw-bold text-primary mb-4 text-center">
//           {hasRecommendations
//             ? "Your Recommended Products"
//             : hasSuggestions
//             ? "No Exact Match Found – Showing Related Products"
//             : "No Products Found"}
//         </h3>

//         {/* User selections summary */}
//         <div className="mb-4 text-center">
//           <p><strong>Shade:</strong> {shade?.name || "N/A"}</p>
//           <p><strong>Undertone:</strong> {undertoneKey || "N/A"}</p>
//           <p><strong>Family:</strong> {family?.name || "N/A"}</p>
//           <p><strong>Formulation:</strong> {formulation?.name || formulation?._id || "N/A"}</p>
//         </div>

//         {/* Product cards */}
//         {displayProducts.length === 0 ? (
//           <p className="text-center text-danger">
//             No recommendations or related products found. Please try again.
//           </p>
//         ) : (
//           <div className="row">
//             {displayProducts.map((product, idx) => {
//               const selectedShade = selectedShades[product._id];
//               const productImage = selectedShade?.images?.[0] || product.images?.[0] || "/placeholder.png";
//               const shadesToShow = product.shades?.length > 0 ? product.shades : product.variants || [];

//               return (
//                 <div key={product._id || idx} className="col-sm-6 col-lg-4 mb-4">
//                   <div className="card h-100 shadow-sm">
//                     {/* Image */}
//                     <img
//                       src={productImage}
//                       alt={product.name || "Product"}
//                       className="card-img-top p-3"
//                       style={{ maxHeight: "250px", objectFit: "contain", cursor: "pointer" }}
//                       onClick={() => handleProductClick(product._id)}
//                     />

//                     <div className="card-body d-flex flex-column">
//                       {/* Name */}
//                       <h5
//                         className="card-title"
//                         style={{ cursor: "pointer" }}
//                         onClick={() => handleProductClick(product._id)}
//                       >
//                         {product.name}
//                       </h5>

//                       {product.summary && <p className="card-text text-muted">{product.summary}</p>}
//                       {product.price && <p className="fw-bold mb-1">₹{product.price}</p>}

//                       {/* Shades / Variants */}
//                       {shadesToShow.length > 0 ? (

//                         <div className="">
//   <strong>Shades:</strong>
//   <div className="shade-container">
//     {shadesToShow.map((shadeItem, sIdx) => {
//       const isSelected =
//         selectedShade?.sku === shadeItem.sku ||
//         selectedShade?.name === shadeItem.name;

//       return (
//         <button
//           key={sIdx}
//           onClick={() => handleShadeSelect(product._id, shadeItem)}
//           className={`shade-btn ${isSelected ? "selected" : ""}`}
//         >
//           {shadeItem.shadeName || shadeItem.name || shadeItem.familyKey}
//         </button>

//       );
//     })}
//   </div>
// </div>

//                       ) : (
//                         <p className="text-muted mt-2" style={{ fontSize: "0.9rem" }}>
//                           No shades available
//                         </p>
//                       )}

//                       {selectedShade && (
//                         <div className="mt-2 text-primary fw-bold mb-3 mt-3">
//                           Selected: {selectedShade.shadeName || selectedShade.name} — ₹
//                           {selectedShade.discountedPrice || selectedShade.price || product.price}
//                         </div>
//                       )}

//                       {/* Add to Cart */}
//                       <button
//                         className="btn btn-gradient mt-auto"
//                         onClick={() => handleAddToCart(product)}
//                         disabled={!selectedShade}
//                       >
//                         Add to Cart
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* Back button */}
//         <div className="text-center mt-4">
//           <button className="btn btn-secondary px-4" onClick={handleBack}>
//             Back
//           </button>
//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// }




















// import React, { useState, useEffect, useContext } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { CartContext } from "../Context/CartContext";
// import axiosInstance from "../utils/axiosInstance.js";
// import Footer from "./Footer";
// import Header from "./Header";
// import "../css/Recommendations.css";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function Recommendations() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { addToCart } = useContext(CartContext);

//   const {
//     shade = null,
//     undertoneKey = null,
//     family = null,
//     formulation = null,
//     recommendations = [],
//     suggestions = [],
//   } = location.state || {};

//   const [selectedShades, setSelectedShades] = useState({});

//   const handleBack = () => navigate(-1);

//   const hasRecommendations = Array.isArray(recommendations) && recommendations.length > 0;
//   const hasSuggestions =
//     Array.isArray(suggestions) &&
//     suggestions.some((s) => Array.isArray(s.products) && s.products.length > 0);

//   const displayProducts = hasRecommendations
//     ? recommendations
//     : hasSuggestions
//     ? suggestions.flatMap((s) => s.products || [])
//     : [];

//   // Auto-select first variant/shade
//   useEffect(() => {
//     const defaultShades = {};
//     displayProducts.forEach((product) => {
//       const firstVariant = product.variants?.find(v => v.stock > 0) || product.variants?.[0];
//       if (firstVariant) defaultShades[product._id] = firstVariant;
//     });
//     setSelectedShades(defaultShades);
//   }, [displayProducts]);

//   const handleShadeSelect = (productId, shadeItem) => {
//     setSelectedShades((prev) => ({
//       ...prev,
//       [productId]: shadeItem,
//     }));
//   };

//   // const handleAddToCart = async (product) => {
//   //   try {
//   //     const selectedShade = selectedShades[product._id];
//   //     if (!selectedShade) {
//   //       toast.warning("Please select a shade first!");
//   //       return;
//   //     }

//   //     const cartPayload = {
//   //       productId: product._id,
//   //       variants: [{ variantSku: selectedShade.sku, quantity: 1 }],
//   //     };

//   //     const res = await axiosInstance.post("/api/user/cart/add", cartPayload);

//   //     if (res.data.success) {
//   //       addToCart(product, selectedShade);
//   //       toast.success("✅ Product added to cart!");
//   //       navigate("/cartpage", { state: { refresh: true } });
//   //     } else {
//   //       toast.error(res.data.message || "❌ Failed to add product");
//   //     }
//   //   } catch (err) {
//   //     console.error(err);
//   //     toast.error("❌ Something went wrong. Please try again!");
//   //   }
//   // };

//   const handleAddToCart = async (product) => {
//   try {
//     // ✅ Ensure shade selected
//     const selectedShade = selectedShades[product._id];
//     if (!selectedShade) {
//       toast.warning("Please select a shade first!");
//       return;
//     }

//     // ✅ Ensure user logged in
//     await axiosInstance.get("/api/user/profile");

//     // ✅ Use CartContext to handle backend + state update
//     await addToCart(product, selectedShade);

//     toast.success("✅ Product added to cart!");
//     navigate("/cartpage", { state: { refresh: true } });
//   } catch (err) {
//     console.error("Add to Cart error:", err);
//     if (err.response?.status === 401) {
//       toast.info("⚠️ Please log in first");
//       navigate("/login");
//     } else {
//       toast.error("❌ Something went wrong. Please try again!");
//     }
//   }
// };

//   const handleProductClick = (productId) => navigate(`/product/${productId}`);

//   return (
//     <>
//       <Header />

//       <div className="container py-5">
//         <h3 className="fw-bold text-primary mb-4 text-center">
//           {hasRecommendations
//             ? "Your Recommended Products"
//             : hasSuggestions
//             ? "No Exact Match Found – Showing Related Products"
//             : "No Products Found"}
//         </h3>

//         {/* User selections summary */}
//         <div className="mb-4 text-center">
//           <p><strong>Shade:</strong> {shade?.name || "N/A"}</p>
//           <p><strong>Undertone:</strong> {undertoneKey || "N/A"}</p>
//           <p><strong>Family:</strong> {family?.name || "N/A"}</p>
//           <p><strong>Formulation:</strong> {formulation?.name || formulation?._id || "N/A"}</p>
//         </div>

//         {/* Product cards */}
//         {displayProducts.length === 0 ? (
//           <p className="text-center text-danger">
//             No recommendations or related products found. Please try again.
//           </p>
//         ) : (
//           <div className="row">
//             {displayProducts.map((product, idx) => {
//               const selectedShade = selectedShades[product._id];
//               const productImage = selectedShade?.images?.[0] || product.images?.[0] || "/placeholder.png";
//               const shadesToShow = product.shades?.length > 0 ? product.shades : product.variants || [];

//               return (
//                 <div key={product._id || idx} className="col-sm-6 col-lg-4 mb-4">
//                   <div className="card h-100 shadow-sm">
//                     {/* Image */}
//                     <img
//                       src={productImage}
//                       alt={product.name || "Product"}
//                       className="card-img-top p-3"
//                       style={{ maxHeight: "250px", objectFit: "contain", cursor: "pointer" }}
//                       onClick={() => handleProductClick(product._id)}
//                     />

//                     <div className="card-body d-flex flex-column">
//                       {/* Name */}
//                       <h5
//                         className="card-title"
//                         style={{ cursor: "pointer" }}
//                         onClick={() => handleProductClick(product._id)}
//                       >
//                         {product.name}
//                       </h5>

//                       {product.summary && <p className="card-text text-muted">{product.summary}</p>}
//                       {product.price && <p className="fw-bold mb-1">₹{product.price}</p>}

//                       {/* Shades / Variants */}
//                       {shadesToShow.length > 0 ? (
//                         <div className="">
//                           <strong>Shades:</strong>
//                           <div className="shade-container">
//                             {shadesToShow.map((shadeItem, sIdx) => {
//                               const isSelected =
//                                 selectedShade?.sku === shadeItem.sku ||
//                                 selectedShade?.name === shadeItem.name;

//                               return (
//                                 <button
//                                   key={sIdx}
//                                   onClick={() => handleShadeSelect(product._id, shadeItem)}
//                                   className={`shade-btn ${isSelected ? "selected" : ""}`}
//                                 >
//                                   {shadeItem.shadeName || shadeItem.name || shadeItem.familyKey}
//                                 </button>
//                               );
//                             })}
//                           </div>
//                         </div>
//                       ) : (
//                         <p className="text-muted mt-2" style={{ fontSize: "0.9rem" }}>
//                           No shades available
//                         </p>
//                       )}

//                       {selectedShade && (
//                         <div className="mt-2 text-primary fw-bold mb-3 mt-3">
//                           Selected: {selectedShade.shadeName || selectedShade.name} — ₹
//                           {selectedShade.discountedPrice || selectedShade.price || product.price}
//                         </div>
//                       )}

//                       {/* Add to Cart */}
//                       <button
//                         className="btn btn-gradient mt-auto"
//                         onClick={() => handleAddToCart(product)}
//                         disabled={!selectedShade}
//                       >
//                         Add to Cart
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* Back button */}
//         <div className="text-center mt-4">
//           <button className="btn btn-secondary px-4" onClick={handleBack}>
//             Back
//           </button>
//         </div>
//       </div>

//       <Footer />

//       {/* Toast Container */}
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="colored"
//       />
//     </>
//   );
// }













// import React, { useState, useEffect, useContext } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { CartContext } from "../Context/CartContext";
// import { UserContext } from "./UserContext.jsx";
// import axiosInstance from "../utils/axiosInstance.js";
// import Footer from "./Footer";
// import Header from "./Header";
// import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
// import "../css/Recommendations.css";
// import Bag from "../assets/Bag.svg";

// export default function Recommendations() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { addToCart } = useContext(CartContext);
//   const { user } = useContext(UserContext);

//   const {
//     shade = null,
//     undertoneKey = null,
//     family = null,
//     formulation = null,
//     recommendations = [],
//     suggestions = [],
//   } = location.state || {};

//   // States for product functionality
//   const [selectedVariants, setSelectedVariants] = useState({});
//   const [addingToCart, setAddingToCart] = useState({});
//   const [wishlistData, setWishlistData] = useState([]);
//   const [wishlistLoading, setWishlistLoading] = useState({});
//   const [showVariantOverlay, setShowVariantOverlay] = useState(null);
//   const [selectedVariantType, setSelectedVariantType] = useState("all");

//   // Helper functions from ProductPage
//   const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || 'default'}`;

//   const isValidHexColor = (hex) => {
//     if (!hex || typeof hex !== "string") return false;
//     const normalized = hex.trim().toLowerCase();
//     return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(normalized);
//   };

//   const getVariantDisplayText = (variant) => {
//     return (
//       variant.shadeName ||
//       variant.name ||
//       variant.size ||
//       variant.ml ||
//       variant.weight ||
//       "Default"
//     ).toUpperCase();
//   };

//   const groupVariantsByType = (variants) => {
//     const grouped = { color: [], text: [], default: [] };
//     variants?.forEach((v) => {
//       if (!v) return;
//       if (v.hex && isValidHexColor(v.hex)) {
//         grouped.color.push(v);
//       } else {
//         grouped.text.push(v);
//       }
//     });
//     return grouped;
//   };

//   const getBrandName = (product) => {
//     if (!product?.brand) return "Unknown Brand";
//     if (typeof product.brand === "object" && product.brand.name) return product.brand.name;
//     if (typeof product.brand === "string") return product.brand;
//     return "Unknown Brand";
//   };

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
//     setTimeout(() => {
//       toast.remove();
//     }, duration);
//   };

//   // Wishlist functions
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
//         const localWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];
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

//   // Handle variant selection
//   const handleVariantSelect = (productId, variant) => {
//     setSelectedVariants((prev) => ({
//       ...prev,
//       [productId]: variant,
//     }));
//   };

//   // Handle product navigation
//   const handleProductClick = (product) => {
//     const productSlug = product.slugs?.[0] || product.slug || product._id;
//     navigate(`/product/${productSlug}`);
//   };

//   // Handle Add to Cart
//   const handleAddToCart = async (prod) => {
//     setAddingToCart((prev) => ({ ...prev, [prod._id]: true }));

//     try {
//       const variants = Array.isArray(prod.variants) ? prod.variants : [];
//       const hasVariants = variants.length > 0;
//       let selectedVariant;

//       if (hasVariants) {
//         selectedVariant = selectedVariants[prod._id];
//         if (!selectedVariant || selectedVariant.stock <= 0) {
//           showToastMsg("Please select an in-stock variant.", "error");
//           return;
//         }
//       } else {
//         if (prod.stock <= 0) {
//           showToastMsg("Product is out of stock.", "error");
//           return;
//         }
//       }

//       // Use CartContext to handle backend + state update
//       await addToCart(prod, selectedVariant);
//       showToastMsg("Product added to cart!", "success");
//       navigate("/cartpage", { state: { refresh: true } });

//     } catch (err) {
//       console.error("Add to Cart error:", err);
//       if (err.response?.status === 401) {
//         showToastMsg("Please log in first", "info");
//         navigate("/login");
//       } else {
//         showToastMsg("Failed to add product to cart", "error");
//       }
//     } finally {
//       setAddingToCart((prev) => ({ ...prev, [prod._id]: false }));
//     }
//   };

//   // Initialize selected variants
//   useEffect(() => {
//     const displayProducts = hasRecommendations
//       ? recommendations
//       : hasSuggestions
//       ? suggestions.flatMap((s) => s.products || [])
//       : [];

//     const defaultVariants = {};
//     displayProducts.forEach((product) => {
//       const firstVariant = product.variants?.find(v => v.stock > 0) || product.variants?.[0] || product.shades?.[0];
//       if (firstVariant) {
//         defaultVariants[product._id] = firstVariant;
//       }
//     });
//     setSelectedVariants(defaultVariants);
//   }, [recommendations, suggestions]);

//   // Fetch wishlist data
//   useEffect(() => {
//     fetchWishlistData();
//   }, [user]);

//   const handleBack = () => navigate(-1);

//   const hasRecommendations = Array.isArray(recommendations) && recommendations.length > 0;
//   const hasSuggestions = Array.isArray(suggestions) && suggestions.some((s) => Array.isArray(s.products) && s.products.length > 0);

//   const displayProducts = hasRecommendations
//     ? recommendations
//     : hasSuggestions
//     ? suggestions.flatMap((s) => s.products || [])
//     : [];

//   // Render stars
//   const renderStars = (rating) =>
//     Array.from({ length: 5 }, (_, i) => (
//       <FaStar
//         key={i}
//         size={16}
//         color={i < Math.round(rating) ? "#2b6cb0" : "#ccc"}
//         style={{ marginRight: "2px" }}
//       />
//     ));

//   // Render product card (same as ProductPage)
//   const renderProductCard = (prod) => {
//     const variants = Array.isArray(prod.variants) ? prod.variants : (Array.isArray(prod.shades) ? prod.shades : []);
//     const hasVariants = variants.length > 0;
//     const selectedVariant = selectedVariants[prod._id] || (hasVariants ? variants[0] : null);
//     const grouped = groupVariantsByType(variants);
//     const totalVariants = variants.length;

//     // Check wishlist status
//     const selectedSku = selectedVariant ? getSku(selectedVariant) : null;
//     const isProductInWishlist = selectedSku ? isInWishlist(prod._id, selectedSku) : false;

//     const productSlug = prod.slugs?.[0] || prod.slug || prod._id;
//     const imageUrl =
//       selectedVariant?.images?.[0] ||
//       selectedVariant?.image ||
//       prod.images?.[0] ||
//       "/placeholder.png";

//     // Initial display variants
//     const initialColors = grouped.color.slice(0, 4);
//     const initialText = grouped.text.slice(0, 2);

//     // Button state logic
//     const isAdding = addingToCart[prod._id];
//     const noVariantSelected = hasVariants && !selectedVariant;
//     const outOfStock = hasVariants
//       ? (selectedVariant?.stock <= 0)
//       : (prod.stock <= 0);
//     const buttonDisabled = isAdding || noVariantSelected || outOfStock;
//     const buttonText = isAdding
//       ? "Adding..."
//       : noVariantSelected
//         ? "Select Variant"
//         : outOfStock
//           ? "Out of Stock"
//           : "Add to Cart";

//     return (
//       <div
//         key={prod._id}
//         className="col-6 col-md-4 col-lg-4 position-relative page-title-main-name "
//       >
//         {/* Wishlist Heart */}
//         <button
//           onClick={() => {
//             if (selectedVariant || !hasVariants) {
//               toggleWishlist(prod, selectedVariant || {});
//             }
//           }}
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
//             outline: "none"
//           }}
//           title={isProductInWishlist ? "Remove from wishlist" : "Add to wishlist"}
//         >
//           {wishlistLoading[prod._id] ? (
//             <div className="spinner-border spinner-border-sm" role="status"></div>
//           ) : isProductInWishlist ? (
//             <FaHeart />
//           ) : (
//             <FaRegHeart />
//           )}
//         </button>

//         {/* Product Image */}
//         <img
//           src={imageUrl}
//           alt={prod.name}
//           className="card-img-top"
//           style={{
//             height: "200px",
//             objectFit: "contain",
//             cursor: "pointer",
//           }}
//           onClick={() => handleProductClick(prod)}
//         />

//         {/* Rating */}
//         <div className="d-flex align-items-center mt-2">
//           {renderStars(prod.avgRating || 0)}
//           <span className="ms-2 text-muted small">
//             ({prod.totalRatings || 0})
//           </span>
//         </div>

//         <div className="card-body p-0 d-flex flex-column" style={{ height: "285px" }}>
//           {/* Brand */}
//           <div className="brand-name text-muted small mb-1 fw-medium">
//             {getBrandName(prod)}
//           </div>

//           {/* Product Name */}
//           <h5
//             className="card-title mt-2 align-items-center gap-1 page-title-main-name"
//             style={{ cursor: "pointer" }}
//             onClick={() => handleProductClick(prod)}
//           >
//             {prod.name}
//             {selectedVariant && selectedVariant.shadeName && (
//               <div
//                 className="text-black fw-normal fs-6"
//                 style={{ marginTop: "-2px" }}
//               >
//                 {getVariantDisplayText(selectedVariant)}
//               </div>
//             )}
//           </h5>

//           {/* Variant Selection */}
//           {hasVariants && (
//             <div className="variant-section mt-3">
//               {/* Color Circles */}
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
//                           border: isSelected
//                             ? "3px solid #000"
//                             : "1px solid #ddd",
//                           cursor: isOutOfStock
//                             ? "not-allowed"
//                             : "pointer",
//                           opacity: isOutOfStock ? 0.5 : 1,
//                           position: "relative",
//                         }}
//                         onClick={() =>
//                           !isOutOfStock &&
//                           handleVariantSelect(prod._id, v)
//                         }
//                       >
//                         {isSelected && (
//                           <span
//                             style={{
//                               position: "absolute",
//                               top: "50%",
//                               left: "50%",
//                               transform: "translate(-50%, -50%)",
//                               color: "#fff",
//                               fontSize: "14px",
//                               fontWeight: "bold",
//                             }}
//                           >
//                             ✓
//                           </span>
//                         )}
//                       </div>
//                     );
//                   })}
//                   {grouped.color.length > 4 && (
//                     <button
//                       className="more-btn"
//                       onClick={() => {
//                         setSelectedVariantType("color");
//                         setShowVariantOverlay(prod._id);
//                       }}
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

//               {/* Text Variants */}
//               {grouped.text.length > 0 && (
//                 <div className="d-flex flex-wrap gap-2">
//                   {initialText.map((v) => {
//                     const isSelected = selectedVariant?.sku === v.sku;
//                     const isOutOfStock = v.stock <= 0;
//                     return (
//                       <div
//                         key={v.sku || v._id}
//                         className={`variant-text page-title-main-name ${isSelected ? "selected" : ""}`}
//                         style={{
//                           padding: "6px 12px",
//                           borderRadius: "6px",
//                           border: isSelected
//                             ? "2px solid #000"
//                             : "1px solid #ddd",
//                           background: isSelected
//                             ? "#000"
//                             : "#fff",
//                           color: isSelected ? "#fff" : "#000",
//                           fontSize: "13px",
//                           cursor: isOutOfStock
//                             ? "not-allowed"
//                             : "pointer",
//                           opacity: isOutOfStock ? 0.5 : 1,
//                           textTransform: 'lowercase'
//                         }}
//                         onClick={() =>
//                           !isOutOfStock &&
//                           handleVariantSelect(prod._id, v)
//                         }
//                       >
//                         {getVariantDisplayText(v)}
//                       </div>
//                     );
//                   })}
//                   {grouped.text.length > 2 && (
//                     <button
//                       className="more-btn page-title-main-name"
//                       onClick={() => {
//                         setSelectedVariantType("text");
//                         setShowVariantOverlay(prod._id);
//                       }}
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
//           <p
//             className="fw-bold mb-3 mt-3 page-title-main-name"
//             style={{ fontSize: "16px" }}
//           >
//             {(() => {
//               const price =
//                 selectedVariant?.displayPrice ||
//                 selectedVariant?.discountedPrice ||
//                 selectedVariant?.price ||
//                 prod.price ||
//                 0;
//               const original =
//                 selectedVariant?.originalPrice ||
//                 selectedVariant?.mrp ||
//                 prod.mrp ||
//                 price;
//               const hasDiscount = original > price;
//               const percent = hasDiscount
//                 ? Math.round(
//                   ((original - price) / original) * 100
//                 )
//                 : 0;
//               return hasDiscount ? (
//                 <>
//                   ₹{price}
//                   <span
//                     style={{
//                       textDecoration: "line-through",
//                       color: "#888",
//                       marginLeft: "8px",
//                     }}
//                   >
//                     ₹{original}
//                   </span>
//                   <span
//                     style={{
//                       color: "#e53e3e",
//                       marginLeft: "8px",
//                       fontWeight: "600",
//                     }}
//                   >
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
//               className={`page-title-main-name add-to-cart-product-page w-100 d-flex align-items-center justify-content-center gap-2 ${isAdding ? "bg-black text-white" : ""}`}
//               onClick={() => handleAddToCart(prod)}
//               disabled={buttonDisabled}
//               style={{
//                 transition: "background-color 0.3s ease, color 0.3s ease",
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
//                   {!buttonDisabled && !isAdding && (
//                     <img src={Bag} alt="Bag" style={{ height: "20px" }} />
//                   )}
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <>
//       <Header />

//       <div className="container-lg py-4 page-title-main-name ">
//         {/* Header Section */}
//         <div className="text-center mb-5">
//           <h1 className="recommendations-title mb-3 ">
//             {hasRecommendations
//               ? "Your Recommended Products"
//               : hasSuggestions
//               ? "No Exact Match Found – Showing Related Products"
//               : "No Products Found"}
//           </h1>

//           {/* User Selections Summary */}
//           {(shade || undertoneKey || family || formulation) && (
//             <div className="selection-summary">
//               {shade?.name && (
//                 <div className="selection-item">
//                   <span className="selection-label">Shade</span>
//                   <span className="selection-value">- {shade.name}</span>
//                 </div>
//               )}
//               {undertoneKey && (
//                 <div className="selection-item">
//                   <span className="selection-label">Undertone</span>
//                   <span className="selection-value">- {undertoneKey}</span>
//                 </div>
//               )}
//               {family?.name && (
//                 <div className="selection-item">
//                   <span className="selection-label">Family</span>
//                   <span className="selection-value">- {family.name}</span>
//                 </div>
//               )}
//               {formulation?.name && (
//                 <div className="selection-item">
//                   <span className="selection-label">Formulation</span>
//                   <span className="selection-value">- {formulation.name}</span>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Product Grid */}
//         {displayProducts.length === 0 ? (
//           <div className="text-center py-5">
//             <div className="no-products-icon mb-3">😔</div>
//             <h3 className="mb-3">No products found</h3>
//             <p className="text-muted mb-4">
//               We couldn't find any products matching your selection. Please try different options.
//             </p>
//             <button className="btn btn-secondary" onClick={handleBack}>
//               Go Back
//             </button>
//           </div>
//         ) : (
//           <>
//             <div className="row g-4">
//               {displayProducts.map(renderProductCard)}
//             </div>

//             {/* Back Button */}
//             <div className="text-center mt-5 pt-4 border-top">
//               <button className="btn btn-secondary px-5 py-2" onClick={handleBack}>
//                 ← Back to Foundation Type
//               </button>
//             </div>
//           </>
//         )}
//       </div>

//       <Footer />

//       {/* Variant Overlay (same as ProductPage) */}
//       {showVariantOverlay && (
//         <div className="variant-overlay" onClick={() => setShowVariantOverlay(null)}>
//           <div
//             className="variant-overlay-content"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Overlay content from ProductPage */}
//           </div>
//         </div>
//       )}
//     </>
//   );
// }












// import React, { useState, useEffect, useContext } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { CartContext } from "../Context/CartContext";
// import { UserContext } from "./UserContext.jsx";
// import axiosInstance from "../utils/axiosInstance.js";
// import Footer from "./Footer";
// import Header from "./Header";
// import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
// import "../css/Recommendations.css";
// import Bag from "../assets/Bag.svg";

// export default function Recommendations() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { addToCart } = useContext(CartContext);
//   const { user } = useContext(UserContext);

//   const {
//     shade = null,
//     undertoneKey = null,
//     family = null,
//     formulation = null,
//     recommendations = [],
//     suggestions = [],
//   } = location.state || {};

//   // States for product functionality
//   const [selectedVariants, setSelectedVariants] = useState({});
//   const [addingToCart, setAddingToCart] = useState({});
//   const [wishlistData, setWishlistData] = useState([]);
//   const [wishlistLoading, setWishlistLoading] = useState({});
//   const [showVariantOverlay, setShowVariantOverlay] = useState(null);
//   const [selectedVariantType, setSelectedVariantType] = useState("all");

//   // Helper functions (exact same as ProductPage)
//   const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || 'default'}`;

//   const isValidHexColor = (hex) => {
//     if (!hex || typeof hex !== "string") return false;
//     const normalized = hex.trim().toLowerCase();
//     return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(normalized);
//   };

//   const getVariantDisplayText = (variant) => {
//     return (
//       variant.shadeName ||
//       variant.name ||
//       variant.size ||
//       variant.ml ||
//       variant.weight ||
//       "Default"
//     ).toUpperCase();
//   };

//   const groupVariantsByType = (variants) => {
//     const grouped = { color: [], text: [] };
//     variants?.forEach((v) => {
//       if (!v) return;
//       if (v.hex && isValidHexColor(v.hex)) {
//         grouped.color.push(v);
//       } else {
//         grouped.text.push(v);
//       }
//     });
//     return grouped;
//   };

//   const getBrandName = (product) => {
//     if (!product?.brand) return "Unknown Brand";
//     if (typeof product.brand === "object" && product.brand.name) return product.brand.name;
//     if (typeof product.brand === "string") return product.brand;
//     return "Unknown Brand";
//   };

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
//     setTimeout(() => {
//       toast.remove();
//     }, duration);
//   };

//   // Wishlist functions (exact same as ProductPage)
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
//         const localWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];
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

//   // Variant overlay helpers
//   const openVariantOverlay = (productId, type = "all") => {
//     setSelectedVariantType(type);
//     setShowVariantOverlay(productId);
//   };

//   const closeVariantOverlay = () => {
//     setShowVariantOverlay(null);
//     setSelectedVariantType("all");
//   };

//   // Variant selection
//   const handleVariantSelect = (productId, variant) => {
//     setSelectedVariants((prev) => ({
//       ...prev,
//       [productId]: variant,
//     }));
//   };

//   // Product navigation
//   const handleProductClick = (product) => {
//     const productSlug = product.slugs?.[0] || product.slug || product._id;
//     navigate(`/product/${productSlug}`);
//   };

//   // Add to Cart
//   const handleAddToCart = async (prod) => {
//     setAddingToCart((prev) => ({ ...prev, [prod._id]: true }));

//     try {
//       const variants = Array.isArray(prod.variants) ? prod.variants : (Array.isArray(prod.shades) ? prod.shades : []);
//       const hasVariants = variants.length > 0;
//       let selectedVariant;

//       if (hasVariants) {
//         selectedVariant = selectedVariants[prod._id];
//         if (!selectedVariant || selectedVariant.stock <= 0) {
//           showToastMsg("Please select an in-stock variant.", "error");
//           return;
//         }
//       } else {
//         if (prod.stock <= 0) {
//           showToastMsg("Product is out of stock.", "error");
//           return;
//         }
//       }

//       await addToCart(prod, selectedVariant);
//       showToastMsg("Product added to cart!", "success");
//       navigate("/cartpage", { state: { refresh: true } });
//     } catch (err) {
//       console.error("Add to Cart error:", err);
//       if (err.response?.status === 401) {
//         showToastMsg("Please log in first", "info");
//         navigate("/login");
//       } else {
//         showToastMsg("Failed to add product to cart", "error");
//       }
//     } finally {
//       setAddingToCart((prev) => ({ ...prev, [prod._id]: false }));
//     }
//   };

//   // Set default selected variants (first in-stock)
//   useEffect(() => {
//     const displayProducts = hasRecommendations
//       ? recommendations
//       : hasSuggestions
//       ? suggestions.flatMap((s) => s.products || [])
//       : [];

//     const defaultVariants = {};
//     displayProducts.forEach((product) => {
//       const vars = Array.isArray(product.variants) ? product.variants : (Array.isArray(product.shades) ? product.shades : []);
//       const firstVariant = vars.find(v => v.stock > 0) || vars[0];
//       if (firstVariant) {
//         defaultVariants[product._id] = firstVariant;
//       }
//     });
//     setSelectedVariants(defaultVariants);
//   }, [recommendations, suggestions]);

//   // Fetch wishlist
//   useEffect(() => {
//     fetchWishlistData();
//   }, [user]);

//   const handleBack = () => navigate(-1);

//   const hasRecommendations = Array.isArray(recommendations) && recommendations.length > 0;
//   const hasSuggestions = Array.isArray(suggestions) && suggestions.some((s) => Array.isArray(s.products) && s.products.length > 0);

//   const displayProducts = hasRecommendations
//     ? recommendations
//     : hasSuggestions
//     ? suggestions.flatMap((s) => s.products || [])
//     : [];

//   // Render stars
//   const renderStars = (rating) =>
//     Array.from({ length: 5 }, (_, i) => (
//       <FaStar
//         key={i}
//         size={16}
//         color={i < Math.round(rating) ? "#2b6cb0" : "#ccc"}
//         style={{ marginRight: "2px" }}
//       />
//     ));

//   // Exact same product card as ProductPage (including full variant overlay)
//   const renderProductCard = (prod) => {
//     const variants = Array.isArray(prod.variants) ? prod.variants : (Array.isArray(prod.shades) ? prod.shades : []);
//     const hasVariants = variants.length > 0;
//     const selectedVariant = selectedVariants[prod._id] || (hasVariants ? variants[0] : null);
//     const grouped = groupVariantsByType(variants);
//     const totalVariants = variants.length;

//     const selectedSku = selectedVariant ? getSku(selectedVariant) : null;
//     const isProductInWishlist = selectedSku ? isInWishlist(prod._id, selectedSku) : false;

//     const productSlug = prod.slugs?.[0] || prod.slug || prod._id;
//     const imageUrl =
//       selectedVariant?.images?.[0] ||
//       selectedVariant?.image ||
//       prod.images?.[0] ||
//       "/placeholder.png";

//     const initialColors = grouped.color.slice(0, 4);
//     const initialText = grouped.text.slice(0, 2);

//     const isAdding = addingToCart[prod._id];
//     const noVariantSelected = hasVariants && !selectedVariant;
//     const outOfStock = hasVariants
//       ? (selectedVariant?.stock <= 0)
//       : (prod.stock <= 0);
//     const buttonDisabled = isAdding || noVariantSelected || outOfStock;
//     const buttonText = isAdding
//       ? "Adding..."
//       : noVariantSelected
//         ? "Select Variant"
//         : outOfStock
//           ? "Out of Stock"
//           : "Add to Cart";

//     return (
//       <div key={prod._id} className="col-6 col-md-4 col-lg-3 position-relative">
//         {/* Wishlist Heart */}
//         <button
//           onClick={() => {
//             if (selectedVariant || !hasVariants) {
//               toggleWishlist(prod, selectedVariant || {});
//             }
//           }}
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
//             outline: "none"
//           }}
//           title={isProductInWishlist ? "Remove from wishlist" : "Add to wishlist"}
//         >
//           {wishlistLoading[prod._id] ? (
//             <div className="spinner-border spinner-border-sm" role="status"></div>
//           ) : isProductInWishlist ? (
//             <FaHeart />
//           ) : (
//             <FaRegHeart />
//           )}
//         </button>

//         {/* Product Image */}
//         <img
//           src={imageUrl}
//           alt={prod.name}
//           className="card-img-top"
//           style={{
//             height: "200px",
//             objectFit: "contain",
//             cursor: "pointer",
//           }}
//           onClick={() => handleProductClick(prod)}
//         />

//         {/* Rating */}
//         <div className="d-flex align-items-center mt-2">
//           {renderStars(prod.avgRating || 0)}
//           <span className="ms-2 text-muted small">
//             ({prod.totalRatings || 0})
//           </span>
//         </div>

//         <div className="card-body p-0 d-flex flex-column" style={{ height: "285px" }}>
//           {/* Brand */}
//           <div className="brand-name text-muted small mb-1 fw-medium">
//             {getBrandName(prod)}
//           </div>

//           {/* Name + Selected Shade */}
//           <h5
//             className="card-title mt-2 align-items-center gap-1 page-title-main-name"
//             style={{ cursor: "pointer" }}
//             onClick={() => handleProductClick(prod)}
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
//               {/* Colors */}
//               {grouped.color.length > 0 && (
//                 <div className="d-flex flex-wrap gap-2 mb-2">
//                   {initialColors.map((v) => {
//                     const isSelected = selectedVariant && getSku(selectedVariant) === getSku(v);
//                     const isOutOfStock = v.stock <= 0;
//                     return (
//                       <div
//                         key={getSku(v)}
//                         className="color-circle"
//                         style={{
//                           width: "28px",
//                           height: "28px",
//                           borderRadius: "20%",
//                           backgroundColor: v.hex || "#ccc",
//                           border: isSelected ? "3px solid #000" : "1px solid #ddd",
//                           cursor: isOutOfStock ? "not-allowed" : "pointer",
//                           opacity: isOutOfStock ? 0.5 : 1,
//                           position: "relative",
//                         }}
//                         onClick={() => !isOutOfStock && handleVariantSelect(prod._id, v)}
//                       >
//                         {isSelected && (
//                           <span
//                             style={{
//                               position: "absolute",
//                               top: "50%",
//                               left: "50%",
//                               transform: "translate(-50%, -50%)",
//                               color: "#fff",
//                               fontSize: "14px",
//                               fontWeight: "bold",
//                             }}
//                           >
//                             ✓
//                           </span>
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

//               {/* Text Variants */}
//               {grouped.text.length > 0 && (
//                 <div className="d-flex flex-wrap gap-2">
//                   {initialText.map((v) => {
//                     const isSelected = selectedVariant && getSku(selectedVariant) === getSku(v);
//                     const isOutOfStock = v.stock <= 0;
//                     return (
//                       <div
//                         key={getSku(v)}
//                         className={`variant-text page-title-main-name ${isSelected ? "selected" : ""}`}
//                         style={{
//                           padding: "6px 12px",
//                           borderRadius: "6px",
//                           border: isSelected ? "2px solid #000" : "1px solid #ddd",
//                           background: isSelected ? "#000" : "#fff",
//                           color: isSelected ? "#fff" : "#000",
//                           fontSize: "13px",
//                           cursor: isOutOfStock ? "not-allowed" : "pointer",
//                           opacity: isOutOfStock ? 0.5 : 1,
//                           textTransform: "lowercase"
//                         }}
//                         onClick={() => !isOutOfStock && handleVariantSelect(prod._id, v)}
//                       >
//                         {getVariantDisplayText(v)}
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
//               const price = selectedVariant?.displayPrice || selectedVariant?.discountedPrice || selectedVariant?.price || prod.price || 0;
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
//               className={`page-title-main-name add-to-cart-product-page w-100 d-flex align-items-center justify-content-center gap-2 ${isAdding ? "bg-black text-white" : ""}`}
//               onClick={() => handleAddToCart(prod)}
//               disabled={buttonDisabled}
//               style={{ transition: "background-color 0.3s ease, color 0.3s ease" }}
//             >
//               {isAdding ? (
//                 <>
//                   <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//                   Adding...
//                 </>
//               ) : (
//                 <>
//                   {buttonText}
//                   {!buttonDisabled && !isAdding && <img src={Bag} alt="Bag" style={{ height: "20px" }} />}
//                 </>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Variant Overlay - exact same as ProductPage */}
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
//                 <button onClick={closeVariantOverlay} style={{ background: "none", border: "none", fontSize: "24px" }}>
//                   ×
//                 </button>
//               </div>

//               <div className="variant-tabs d-flex">
//                 <button
//                   className={`variant-tab flex-fill py-3 ${selectedVariantType === "all" ? "active" : ""}`}
//                   onClick={() => setSelectedVariantType("all")}
//                 >
//                   All ({totalVariants})
//                 </button>
//                 {grouped.color.length > 0 && (
//                   <button
//                     className={`variant-tab flex-fill py-3 ${selectedVariantType === "color" ? "active" : ""}`}
//                     onClick={() => setSelectedVariantType("color")}
//                   >
//                     Colors ({grouped.color.length})
//                   </button>
//                 )}
//                 {grouped.text.length > 0 && (
//                   <button
//                     className={`variant-tab flex-fill py-3 ${selectedVariantType === "text" ? "active" : ""}`}
//                     onClick={() => setSelectedVariantType("text")}
//                   >
//                     Sizes ({grouped.text.length})
//                   </button>
//                 )}
//               </div>

//               <div className="p-3 overflow-auto flex-grow-1">
//                 {(selectedVariantType === "all" || selectedVariantType === "color") && grouped.color.length > 0 && (
//                   <div className="row row-col-4 g-3 mb-4">
//                     {grouped.color.map((v) => {
//                       const isSelected = selectedVariant && getSku(selectedVariant) === getSku(v);
//                       const isOutOfStock = v.stock <= 0;
//                       return (
//                         <div className="col" key={getSku(v)}>
//                           <div
//                             className="text-center"
//                             style={{ cursor: isOutOfStock ? "not-allowed" : "pointer" }}
//                             onClick={() => !isOutOfStock && (handleVariantSelect(prod._id, v), closeVariantOverlay())}
//                           >
//                             <div
//                               style={{
//                                 width: "28px",
//                                 height: "28px",
//                                 borderRadius: "20%",
//                                 backgroundColor: v.hex || "#ccc",
//                                 margin: "0 auto 8px",
//                                 border: isSelected ? "3px solid #000" : "1px solid #ddd",
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
//                             <div className="small">{getVariantDisplayText(v)}</div>
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
//                       const isSelected = selectedVariant && getSku(selectedVariant) === getSku(v);
//                       const isOutOfStock = v.stock <= 0;
//                       return (
//                         <div className="col" key={getSku(v)}>
//                           <div
//                             className="text-center"
//                             style={{ cursor: isOutOfStock ? "not-allowed" : "pointer" }}
//                             onClick={() => !isOutOfStock && (handleVariantSelect(prod._id, v), closeVariantOverlay())}
//                           >
//                             <div
//                               style={{
//                                 padding: "10px",
//                                 borderRadius: "8px",
//                                 border: isSelected ? "3px solid #000" : "1px solid #ddd",
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

//   return (
//     <>
//       <Header />

//       <div className="container-lg py-4 page-title-main-name">
//         {/* Header Section */}
//         <div className="text-center mb-5">
//           <h1 className="recommendations-title mb-3">
//             {hasRecommendations
//               ? "Your Recommended Products"
//               : hasSuggestions
//               ? "No Exact Match Found – Showing Related Products"
//               : "No Products Found"}
//           </h1>

//           {/* User Selections Summary */}
//           {(shade || undertoneKey || family || formulation) && (
//             <div className="selection-summary">
//               {shade?.name && (
//                 <div className="selection-item">
//                   <span className="selection-label">Shade</span>
//                   <span className="selection-value">- {shade.name}</span>
//                 </div>
//               )}
//               {undertoneKey && (
//                 <div className="selection-item">
//                   <span className="selection-label">Undertone</span>
//                   <span className="selection-value">- {undertoneKey}</span>
//                 </div>
//               )}
//               {family?.name && (
//                 <div className="selection-item">
//                   <span className="selection-label">Family</span>
//                   <span className="selection-value">- {family.name}</span>
//                 </div>
//               )}
//               {formulation?.name && (
//                 <div className="selection-item">
//                   <span className="selection-label">Formulation</span>
//                   <span className="selection-value">- {formulation.name}</span>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Product Grid */}
//         {displayProducts.length === 0 ? (
//           <div className="text-center py-5">
//             <div className="no-products-icon mb-3">😔</div>
//             <h3 className="mb-3">No products found</h3>
//             <p className="text-muted mb-4">
//               We couldn't find any products matching your selection. Please try different options.
//             </p>
//             <button className="btn btn-secondary" onClick={handleBack}>
//               Go Back
//             </button>
//           </div>
//         ) : (
//           <>
//             <div className="row g-4">
//               {displayProducts.map(renderProductCard)}
//             </div>

//             <div className="text-center mt-5 pt-4 border-top">
//               <button className="btn btn-secondary px-5 py-2" onClick={handleBack}>
//                 ← Back to Foundation Type
//               </button>
//             </div>
//           </>
//         )}
//       </div>

//       <Footer />
//     </>
//   );
// }



















//==============================================================Done_code(Start)=========================================================================================







// import React, { useState, useEffect, useContext, useCallback } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { CartContext } from "../Context/CartContext";
// import { UserContext } from "./UserContext.jsx";
// import axiosInstance from "../utils/axiosInstance.js";
// import Footer from "./Footer";
// import Header from "./Header";
// import { FaStar, FaHeart, FaRegHeart, FaChevronDown } from "react-icons/fa";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "../css/Recommendations.css";
// import bagIcon from "../assets/bag.svg";

// // Helper functions (same as Foryou)
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
//   const grouped = { color: [], text: [], default: [] };
//   variants?.forEach((v) => {
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

// export default function Recommendations() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { addToCart } = useContext(CartContext);
//   const { user } = useContext(UserContext);

//   const {
//     shade = null,
//     undertoneKey = null,
//     family = null,
//     formulation = null,
//     recommendations = [],
//     suggestions = [],
//   } = location.state || {};

//   // States for product functionality
//   const [selectedVariants, setSelectedVariants] = useState({});
//   const [addingToCart, setAddingToCart] = useState({});
//   const [wishlistData, setWishlistData] = useState([]);
//   const [wishlistLoading, setWishlistLoading] = useState({});
//   const [showVariantOverlay, setShowVariantOverlay] = useState(null);
//   const [selectedVariantType, setSelectedVariantType] = useState("all");

//   // NEW: Track which products have been explicitly selected by user
//   const [explicitlySelected, setExplicitlySelected] = useState({});

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

//   // Wishlist functions
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
//         const localWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];
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
//     if (!user || user.guest) {
//       showToastMsg("Please login to use wishlist", "error");
//       navigate("/login", { state: { from: location.pathname } });
//       return;
//     }
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

//   // Variant overlay helpers
//   const openVariantOverlay = (productId, type = "all", e) => {
//     if (e) e.stopPropagation();
//     setSelectedVariantType(type);
//     setShowVariantOverlay(productId);
//   };

//   const closeVariantOverlay = () => {
//     setShowVariantOverlay(null);
//     setSelectedVariantType("all");
//   };

//   // UPDATED: Variant selection - mark as explicitly selected
//   const handleVariantSelect = useCallback((productId, variant) => {
//     if (!productId || !variant) return;

//     setSelectedVariants(prev => ({
//       ...prev,
//       [productId]: variant
//     }));

//     // NEW: Mark this product as explicitly selected by user
//     setExplicitlySelected(prev => ({
//       ...prev,
//       [productId]: true
//     }));
//   }, []);

//   // Product navigation
//   const handleProductClick = (product) => {
//     const productSlug = product.slugs?.[0] || product.slug || product._id;
//     navigate(`/product/${productSlug}`);
//   };

//   // UPDATED: Add to Cart with better variant checking
//   const handleAddToCart = async (prod) => {
//     setAddingToCart((prev) => ({ ...prev, [prod._id]: true }));

//     try {
//       const variants = Array.isArray(prod.variants) ? prod.variants : (Array.isArray(prod.shades) ? prod.shades : []);
//       const hasVariants = variants.length > 0;

//       if (hasVariants) {
//         const selectedVariant = selectedVariants[prod._id];

//         // Check if user has explicitly selected a variant
//         if (!explicitlySelected[prod._id] || !selectedVariant || selectedVariant.stock <= 0) {
//           showToastMsg("Please select a variant first.", "error");
//           setAddingToCart((prev) => ({ ...prev, [prod._id]: false }));
//           return;
//         }

//         const payload = {
//           productId: prod._id,
//           variants: [{ variantSku: getSku(selectedVariant), quantity: 1 }],
//         };

//         const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
//         cache[prod._id] = selectedVariant;
//         localStorage.setItem("cartVariantCache", JSON.stringify(cache));

//         const response = await axiosInstance.post("/api/user/cart/add", payload);
//         if (!response.data.success) throw new Error(response.data.message || "Failed to add to cart");
//       } else {
//         if (prod.stock <= 0) {
//           showToastMsg("Product is out of stock.", "error");
//           setAddingToCart((prev) => ({ ...prev, [prod._id]: false }));
//           return;
//         }

//         const payload = { productId: prod._id, quantity: 1 };
//         const response = await axiosInstance.post("/api/user/cart/add", payload);
//         if (!response.data.success) throw new Error(response.data.message || "Failed to add to cart");
//       }

//       showToastMsg("Product added to cart!", "success");
//       navigate("/cartpage");
//     } catch (err) {
//       console.error("Add to Cart error:", err);
//       const msg = err.response?.data?.message || err.message || "Failed to add product to cart";
//       showToastMsg(msg, "error");

//       if (err.response?.status === 401) {
//         navigate("/login", { state: { from: location.pathname } });
//       }
//     } finally {
//       setAddingToCart((prev) => ({ ...prev, [prod._id]: false }));
//     }
//   };

//   // Format price
//   const formatPrice = useCallback((price) => {
//     const numPrice = parseFloat(price || 0);
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0
//     }).format(numPrice);
//   }, []);

//   // Set default selected variants (but DON'T mark as explicitly selected)
//   useEffect(() => {
//     const displayProducts = hasRecommendations
//       ? recommendations
//       : hasSuggestions
//         ? suggestions.flatMap((s) => s.products || [])
//         : [];

//     const defaultVariants = {};
//     displayProducts.forEach((product) => {
//       const vars = Array.isArray(product.variants) ? product.variants : (Array.isArray(product.shades) ? product.shades : []);
//       const firstVariant = vars.find(v => v.stock > 0) || vars[0];
//       if (firstVariant) {
//         defaultVariants[product._id] = firstVariant;
//       }
//     });
//     setSelectedVariants(defaultVariants);
//     // Note: We DON'T set explicitlySelected here - that only happens when user clicks
//   }, [recommendations, suggestions]);

//   // Fetch wishlist
//   useEffect(() => {
//     fetchWishlistData();
//   }, [user]);

//   const handleBack = () => navigate(-1);

//   const hasRecommendations = Array.isArray(recommendations) && recommendations.length > 0;
//   const hasSuggestions = Array.isArray(suggestions) && suggestions.some((s) => Array.isArray(s.products) && s.products.length > 0);

//   const displayProducts = hasRecommendations
//     ? recommendations
//     : hasSuggestions
//       ? suggestions.flatMap((s) => s.products || [])
//       : [];

//   // FIXED: Render product card with correct "Select Variant" logic
//   const renderProductCard = (item) => {
//     const variants = Array.isArray(item.variants) ? item.variants : (Array.isArray(item.shades) ? item.shades : []);
//     const hasVariants = variants.length > 0;

//     // Get the currently selected variant (could be default or user-selected)
//     const currentVariant = selectedVariants[item._id] || variants[0] || {};

//     // Check if user has EXPLICITLY selected this variant (not just default)
//     const hasExplicitlySelected = !!explicitlySelected[item._id];

//     const groupedVariants = groupVariantsByType(variants);
//     const totalVariants = variants.length;

//     const selectedSku = getSku(currentVariant);
//     const isProductInWishlist = isInWishlist(item._id, selectedSku);

//     const isAdding = addingToCart[item._id];
//     const outOfStock = hasVariants ? (currentVariant?.stock <= 0) : (item.stock <= 0);

//     // KEY FIX: Show "Select Variant" button if:
//     // 1. Product has variants AND
//     // 2. User has NOT explicitly selected a variant yet
//     const showSelectVariantButton = hasVariants && !hasExplicitlySelected;

//     const buttonDisabled = isAdding || (outOfStock && !showSelectVariantButton);

//     const buttonText = isAdding
//       ? "Adding..."
//       : showSelectVariantButton
//         ? "Select Variant"
//         : outOfStock
//           ? "Out of Stock"
//           : "Add to Bag";

//     // Get image
//     let imageUrl = "https://placehold.co/400x300/ffffff/cccccc?text=Product";
//     if (item.image || currentVariant.images?.[0] || currentVariant.image) {
//       const img = currentVariant.images?.[0] || currentVariant.image || item.image;
//       imageUrl = img.startsWith("http") ? img : `https://res.cloudinary.com/dekngswix/image/upload/${img}`;
//     }

//     return (
//       <div key={item._id} className="col-6 col-md-4 col-lg-3 mb-4">
//         <div className="foryou-card-wrapper recommendations-card">
//           <div className="foryou-card">
//             {/* Product Image */}
//             <div
//               className="foryou-img-wrapper"
//               onClick={() => handleProductClick(item)}
//               style={{ cursor: 'pointer', position: 'relative' }}
//             >
//               <img
//                 src={imageUrl}
//                 alt={item.name || "Product"}
//                 className="foryou-img img-fluid"
//                 loading="lazy"
//                 onError={(e) => {
//                   e.currentTarget.src = "https://placehold.co/400x300/ffffff/cccccc?text=Product";
//                 }}
//               />

//               {/* Wishlist Icon */}
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   toggleWishlist(item, currentVariant);
//                 }}
//                 disabled={wishlistLoading[item._id]}
//                 style={{
//                   position: 'absolute',
//                   top: '10px',
//                   right: '10px',
//                   cursor: wishlistLoading[item._id] ? 'not-allowed' : 'pointer',
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
//                 {wishlistLoading[item._id] ? (
//                   <div className="spinner-border spinner-border-sm" role="status"></div>
//                 ) : isProductInWishlist ? (
//                   <FaHeart />
//                 ) : (
//                   <FaRegHeart />
//                 )}
//               </button>
//             </div>

//             {/* Product Info */}
//             <div className="foryou-product-info w-100 ps-lg-0 p-0 pt-md-0">
//               <div className="justify-content-between d-flex flex-column" style={{ height: '260px' }}>

//                 {/* Brand Name */}
//                 <div className="brand-name small text-muted mb-1 mt-2 text-start">
//                   {getBrandName(item)}
//                 </div>

//                 {/* Product Name */}
//                 <h6
//                   className="foryou-name font-family-Poppins m-0 p-0"
//                   onClick={() => handleProductClick(item)}
//                   style={{ cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
//                 >
//                   {item.name || "Unnamed Product"}
//                 </h6>

//                 {/* FIXED: Variant Display - Show "Select Variant" prompt when not explicitly selected */}
//                 {hasVariants && (
//                   <div className="variant-section m-0 p-0 ms-0 mt-2 mb-2">
//                     {hasExplicitlySelected ? (
//                       // User has selected - show the selected variant with dropdown indicator
//                       <div
//                         className="selected-variant-display text-muted small p-0 m-0"
//                         style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', background: 'transparent', border: 'none' }}
//                         onClick={(e) => openVariantOverlay(item._id, "all", e)}
//                         title="Click to change variant"
//                       >
//                         <span>Variant: <span className="fw-bold text-dark">{getVariantDisplayText(currentVariant)}</span></span>
//                         <FaChevronDown className="ms-1" style={{ fontSize: '10px' }} />
//                       </div>
//                     ) : (
//                       // No explicit selection - show "Select Variant" prompt
//                       <div
//                         className="select-variant-prompt small"
//                         onClick={(e) => openVariantOverlay(item._id, "all", e)}
//                       >
//                         <span>Select Variant</span>
//                         <FaChevronDown className="ms-1" style={{ fontSize: '10px' }} />
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Price Section */}
//                 <div className="price-section mb-3">
//                   <div className="d-flex align-items-baseline flex-wrap">
//                     <span className="current-price fw-400 fs-5" style={{ fontSize: '16px', fontWeight: '600' }}>
//                       {formatPrice(currentVariant.displayPrice || item.price || 0)}
//                     </span>
//                     {(currentVariant.originalPrice || item.mrp) > (currentVariant.displayPrice || item.price || 0) && (
//                       <>
//                         <span className="original-price text-muted text-decoration-line-through ms-2 fs-6" style={{ fontSize: '13px' }}>
//                           {formatPrice(currentVariant.originalPrice || item.mrp || 0)}
//                         </span>
//                         <span className="discount-percent text-danger fw-bold ms-2" style={{ fontSize: '13px' }}>
//                           ({Math.round(((currentVariant.originalPrice || item.mrp || 0) - (currentVariant.displayPrice || item.price || 0)) / (currentVariant.originalPrice || item.mrp || 1) * 100)}% OFF)
//                         </span>
//                       </>
//                     )}
//                   </div>
//                 </div>

//                 {/* FIXED: Add to Cart Button */}
//                 <div className="cart-section">
//                   <div className="d-flex align-items-center justify-content-between">
//                     <button
//                       className={`w-100 btn-add-cart addtocartbuttton ${isAdding ? "bg-black text-white" : ""}`}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         if (showSelectVariantButton) {
//                           // Open overlay to select variant first
//                           openVariantOverlay(item._id, "all", e);
//                         } else {
//                           // Add to cart directly
//                           handleAddToCart(item);
//                         }
//                       }}
//                       disabled={buttonDisabled}
//                       style={{
//                         transition: "all 0.3s ease",
//                         border: showSelectVariantButton ? '2px solid #fff' : '1px solid #000',
//                         background: isAdding ? '#000' : showSelectVariantButton ? '#e6f7ff' : '#fff',
//                         color: isAdding ? '#fff' : showSelectVariantButton ? '#0077b6' : '#000',
//                         padding: '8px 16px',
//                         borderRadius: '4px',
//                         fontSize: '14px',
//                         fontWeight: '500',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         gap: '8px'
//                       }}
//                     >
//                       {isAdding ? (
//                         <>
//                           <span className="spinner-border spinner-border-sm" role="status" style={{ width: '16px', height: '16px' }}></span>
//                           Adding...
//                         </>
//                       ) : (
//                         <>
//                           {buttonText}
//                           {!buttonDisabled && !isAdding && !showSelectVariantButton && (
//                             <img src={bagIcon} className="img-fluid" style={{ height: "18px" }} alt="Bag-icon" />
//                           )}
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Variant Overlay */}
//           {showVariantOverlay === item._id && (
//             <div className="variant-overlay" onClick={closeVariantOverlay} style={{
//               position: 'absolute',
//             }}>
//               <div
//                 className="variant-overlay-content p-0"
//                 onClick={(e) => e.stopPropagation()}
//                 style={{
//                   width: '100%',
//                   maxWidth: '500px',
//                   maxHeight: 'auto',
//                   background: '#fff',
//                   borderRadius: '0px',
//                   overflow: 'hidden',
//                   display: 'flex',
//                   flexDirection: 'column'
//                 }}
//               >
//                 <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
//                   <h5 className="m-0 page-title-main-name">Select Variant ({totalVariants})</h5>
//                   <button
//                     onClick={closeVariantOverlay}
//                     style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
//                   >
//                     ×
//                   </button>
//                 </div>

//                 {/* Tabs */}
//                 <div className="variant-tabs d-flex" style={{ borderBottom: '1px solid #eee' }}>
//                   <button
//                     className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "all" ? "active" : ""}`}
//                     onClick={() => setSelectedVariantType("all")}
//                     style={{
//                       background: selectedVariantType === "all" ? '#000' : '#fff',
//                       border: 'none',
//                       borderBottom: selectedVariantType === "all" ? '2px solid #000' : '2px solid transparent',
//                       fontWeight: selectedVariantType === "all" ? '600' : '400'
//                     }}
//                   >
//                     All ({totalVariants})
//                   </button>
//                   {groupedVariants.color.length > 0 && (
//                     <button
//                       className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "color" ? "active" : ""}`}
//                       onClick={() => setSelectedVariantType("color")}
//                       style={{
//                         background: selectedVariantType === "color" ? '#000' : '#fff',
//                         border: 'none',
//                         borderBottom: selectedVariantType === "color" ? '2px solid #000' : '2px solid transparent',
//                         fontWeight: selectedVariantType === "color" ? '600' : '400'
//                       }}
//                     >
//                       Colors ({groupedVariants.color.length})
//                     </button>
//                   )}
//                   {groupedVariants.text.length > 0 && (
//                     <button
//                       className={`variant-tab flex-fill py-3 ${selectedVariantType === "text" ? "active" : ""}`}
//                       onClick={() => setSelectedVariantType("text")}
//                       style={{
//                         background: selectedVariantType === "text" ? '#f8f9fa' : '#fff',
//                         border: 'none',
//                         borderBottom: selectedVariantType === "text" ? '2px solid #000' : '2px solid transparent',
//                         fontWeight: selectedVariantType === "text" ? '600' : '400'
//                       }}
//                     >
//                       Sizes ({groupedVariants.text.length})
//                     </button>
//                   )}
//                 </div>

//                 {/* Content */}
//                 <div className="p-3 overflow-auto flex-grow-1">
//                   {(selectedVariantType === "all" || selectedVariantType === "color") && groupedVariants.color.length > 0 && (
//                     <div className="row row-cols-4 g-3 mb-4">
//                       {groupedVariants.color.map((v) => {
//                         const isSelected = currentVariant.sku === v.sku || (currentVariant._id && currentVariant._id === v._id);
//                         const isOutOfStock = (v.stock ?? 0) <= 0;

//                         return (
//                           <div className="col" key={getSku(v) || v._id}>
//                             <div
//                               className="text-center"
//                               style={{ cursor: isOutOfStock ? "not-allowed" : "pointer" }}
//                               onClick={() => !isOutOfStock && (handleVariantSelect(item._id, v), closeVariantOverlay())}
//                             >
//                               <div
//                                 className="page-title-main-name"
//                                 style={{
//                                   width: "28px",
//                                   height: "28px",
//                                   borderRadius: "20%",
//                                   backgroundColor: v.hex || "#ccc",
//                                   margin: "0 auto 8px",
//                                   border: isSelected ? "3px solid #000" : "1px solid #ddd",
//                                   opacity: isOutOfStock ? 0.5 : 1,
//                                   position: "relative",
//                                 }}
//                               >
//                                 {isSelected && (
//                                   <span
//                                     style={{
//                                       position: "absolute",
//                                       top: "50%",
//                                       left: "50%",
//                                       transform: "translate(-50%, -50%)",
//                                       color: "#fff",
//                                       fontWeight: "bold",
//                                       fontSize: '12px'
//                                     }}
//                                   >
//                                     ✓
//                                   </span>
//                                 )}
//                               </div>
//                               <div className="small page-title-main-name" style={{ fontSize: '11px' }}>
//                                 {getVariantDisplayText(v)}
//                               </div>
//                               {isOutOfStock && (
//                                 <div className="text-danger small" style={{ fontSize: '10px' }}>Out of Stock</div>
//                               )}
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}

//                   {(selectedVariantType === "all" || selectedVariantType === "text") && groupedVariants.text.length > 0 && (
//                     <div className="row row-cols-3 g-3">
//                       {groupedVariants.text.map((v) => {
//                         const isSelected = currentVariant.sku === v.sku || (currentVariant._id && currentVariant._id === v._id);
//                         const isOutOfStock = (v.stock ?? 0) <= 0;

//                         return (
//                           <div className="col" key={getSku(v) || v._id}>
//                             <div
//                               className="text-center"
//                               style={{ cursor: isOutOfStock ? "not-allowed" : "pointer" }}
//                               onClick={() => !isOutOfStock && (handleVariantSelect(item._id, v), closeVariantOverlay())}
//                             >
//                               <div
//                                 style={{
//                                   padding: "10px",
//                                   borderRadius: "8px",
//                                   border: isSelected ? "3px solid #000" : "1px solid #ddd",
//                                   background: isSelected ? "#f8f9fa" : "#fff",
//                                   minHeight: "50px",
//                                   display: "flex",
//                                   alignItems: "center",
//                                   justifyContent: "center",
//                                   opacity: isOutOfStock ? 0.5 : 1,
//                                   fontSize: '12px',
//                                   fontWeight: isSelected ? '600' : '400'
//                                 }}
//                               >
//                                 {getVariantDisplayText(v)}
//                               </div>
//                               {isOutOfStock && (
//                                 <div className="text-danger small mt-1" style={{ fontSize: '10px' }}>Out of Stock</div>
//                               )}
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <>
//       <Header />

//       <div className="container-lg py-4 page-title-main-name">
//         {/* Header Section */}
//         <div className="text-center mb-5">
//           <h1 className="recommendations-title mb-3" style={{ fontSize: '28px', fontWeight: '400' }}>
//             {hasRecommendations
//               ? "Your Recommended Products"
//               : hasSuggestions
//                 ? "No Exact Match Found – Showing Related Products"
//                 : "No Products Found"}
//           </h1>

//           {/* User Selections Summary */}
//           {(shade || undertoneKey || family || formulation) && (
//             <div className="selection-summary" style={{
//               display: 'flex',
//               justifyContent: 'center',
//               gap: '20px',
//               flexWrap: 'wrap',
//               marginTop: '100px'
//             }}>
//               {shade?.name && (
//                 <div className="selection-item" style={{ textAlign: 'center' }}>
//                   <span className="selection-label" style={{ display: 'block', fontSize: '12px', color: '#666' }}>Shade</span>
//                   <span className="selection-value" style={{ fontWeight: '500' }}>- {shade.name}</span>
//                 </div>
//               )}
//               {undertoneKey && (
//                 <div className="selection-item" style={{ textAlign: 'center' }}>
//                   <span className="selection-label" style={{ display: 'block', fontSize: '12px', color: '#666' }}>Undertone</span>
//                   <span className="selection-value" style={{ fontWeight: '500' }}>- {undertoneKey}</span>
//                 </div>
//               )}
//               {family?.name && (
//                 <div className="selection-item" style={{ textAlign: 'center' }}>
//                   <span className="selection-label" style={{ display: 'block', fontSize: '12px', color: '#666' }}>Family</span>
//                   <span className="selection-value" style={{ fontWeight: '500' }}>- {family.name}</span>
//                 </div>
//               )}
//               {formulation?.name && (
//                 <div className="selection-item" style={{ textAlign: 'center' }}>
//                   <span className="selection-label" style={{ display: 'block', fontSize: '12px', color: '#666' }}>Formulation</span>
//                   <span className="selection-value" style={{ fontWeight: '500' }}>- {formulation.name}</span>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Product Grid */}
//         {displayProducts.length === 0 ? (
//           <div className="text-center py-5">
//             <div className="no-products-icon mb-3" style={{ fontSize: '48px' }}>😔</div>
//             <h3 className="mb-3">No products found</h3>
//             <p className="text-muted mb-4">
//               We couldn't find any products matching your selection. Please try different options.
//             </p>
//             <button className="btn btn-secondary" onClick={handleBack}>
//               Go Back
//             </button>
//           </div>
//         ) : (
//           <>
//             <div className="row g-4">
//               {displayProducts.map(renderProductCard)}
//             </div>

//             <div className="text-center mt-5 pt-4 border-top">
//               <button className="btn btn-for-shadetones rounded-pill px-5 py-2" onClick={handleBack}>
//                 ← Back to Foundation Type
//               </button>
//             </div>
//           </>
//         )}
//       </div>

//       <Footer />
//     </>
//   );
// }









import React, { useState, useEffect, useContext, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../Context/CartContext";
import { UserContext } from "./UserContext.jsx";
import axiosInstance from "../utils/axiosInstance.js";
import Footer from "./Footer";
import Header from "./Header";
import { FaStar, FaHeart, FaRegHeart, FaChevronDown } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/Recommendations.css";
import bagIcon from "../assets/bag.svg";

// Helper functions (same as Foryou)
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
  const grouped = { color: [], text: [], default: [] };
  variants?.forEach((v) => {
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

export default function Recommendations() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(UserContext);

  const {
    shade = null,
    undertoneKey = null,
    family = null,
    formulation = null,
    recommendations = [],
    suggestions = [],
  } = location.state || {};

  // States for product functionality
  const [selectedVariants, setSelectedVariants] = useState({});
  const [addingToCart, setAddingToCart] = useState({});
  const [wishlistData, setWishlistData] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState({});
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

  // Wishlist functions
  const isInWishlist = (productId, sku) => {
    if (!productId || !sku) return false;
    return wishlistData.some(item =>
      (item.productId === productId || item._id === productId) &&
      item.sku === sku
    );
  };

  const fetchWishlistData = async () => {
    try {
      if (user && !user.guest) {
        const response = await axiosInstance.get("/api/user/wishlist");
        if (response.data.success) {
          setWishlistData(response.data.wishlist || []);
        }
      } else {
        const localWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];
        const formattedWishlist = localWishlist.map(item => ({
          productId: item._id,
          _id: item._id,
          sku: item.sku,
          name: item.name,
          variant: item.variantName,
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
  };

  const toggleWishlist = async (prod, variant) => {
    if (!user || user.guest) {
      showToastMsg("Please login to use wishlist", "error");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    if (!prod || !variant) {
      showToastMsg("Please select a variant first", "error");
      return;
    }

    const productId = prod._id;
    const sku = getSku(variant);
    setWishlistLoading(prev => ({ ...prev, [productId]: true }));

    try {
      const currentlyInWishlist = isInWishlist(productId, sku);

      if (user && !user.guest) {
        if (currentlyInWishlist) {
          await axiosInstance.delete(`/api/user/wishlist/${productId}`, {
            data: { sku: sku }
          });
          showToastMsg("Removed from wishlist!", "success");
        } else {
          await axiosInstance.post(`/api/user/wishlist/${productId}`, { sku: sku });
          showToastMsg("Added to wishlist!", "success");
        }
        await fetchWishlistData();
      } else {
        const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];
        if (currentlyInWishlist) {
          const updatedWishlist = guestWishlist.filter(item =>
            !(item._id === productId && item.sku === sku)
          );
          localStorage.setItem("guestWishlist", JSON.stringify(updatedWishlist));
          showToastMsg("Removed from wishlist!", "success");
        } else {
          const productData = {
            _id: productId,
            name: prod.name,
            brand: getBrandName(prod),
            price: variant.discountedPrice || variant.displayPrice || prod.price || 0,
            originalPrice: variant.originalPrice || variant.mrp || prod.mrp || prod.price || 0,
            mrp: variant.originalPrice || variant.mrp || prod.mrp || prod.price || 0,
            displayPrice: variant.discountedPrice || variant.displayPrice || prod.price || 0,
            images: variant.images || prod.images || ["/placeholder.png"],
            image: variant.images?.[0] || variant.image || prod.images?.[0] || "/placeholder.png",
            slug: prod.slugs?.[0] || prod.slug || prod._id,
            sku: sku,
            variantSku: sku,
            variantId: sku,
            variantName: variant.shadeName || variant.name || "Default",
            shadeName: variant.shadeName || variant.name || "Default",
            variant: variant.shadeName || variant.name || "Default",
            hex: variant.hex || "#cccccc",
            stock: variant.stock || 0,
            status: variant.stock > 0 ? "inStock" : "outOfStock",
            avgRating: prod.avgRating || 0,
            totalRatings: prod.totalRatings || 0,
            commentsCount: prod.totalRatings || 0,
            discountPercent: (variant.originalPrice && variant.discountedPrice && variant.originalPrice > variant.discountedPrice)
              ? Math.round(((variant.originalPrice - variant.discountedPrice) / variant.originalPrice) * 100)
              : 0
          };

          guestWishlist.push(productData);
          localStorage.setItem("guestWishlist", JSON.stringify(guestWishlist));
          showToastMsg("Added to wishlist!", "success");
        }
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
  };

  // Variant overlay helpers
  const openVariantOverlay = (productId, type = "all", e) => {
    if (e) e.stopPropagation();
    setSelectedVariantType(type);
    setShowVariantOverlay(productId);
  };

  const closeVariantOverlay = () => {
    setShowVariantOverlay(null);
    setSelectedVariantType("all");
  };

  // UPDATED: Variant selection - same as ProductPage
  const handleVariantSelect = useCallback((pid, v) => {
    setSelectedVariants((p) => ({ ...p, [pid]: v }));
    closeVariantOverlay();
  }, []);

  // Product navigation
  const handleProductClick = (product) => {
    const productSlug = product.slugs?.[0] || product.slug || product._id;
    navigate(`/product/${productSlug}`);
  };

  // UPDATED: Add to Cart - same logic as ProductPage
  const handleAddToCart = async (prod) => {
    setAddingToCart((p) => ({ ...p, [prod._id]: true }));
    try {
      const vars = Array.isArray(prod.variants) ? prod.variants : (Array.isArray(prod.shades) ? prod.shades : []);
      const hasVar = vars.length > 0;
      let payload;

      if (hasVar) {
        const sel = selectedVariants[prod._id];
        if (!sel || sel.stock <= 0) {
          showToastMsg("Please select an in-stock variant.", "error");
          return;
        }
        payload = {
          productId: prod._id,
          variants: [{ variantSku: getSku(sel), quantity: 1 }],
        };
        const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
        cache[prod._id] = sel;
        localStorage.setItem("cartVariantCache", JSON.stringify(cache));
      } else {
        if (prod.stock <= 0) {
          showToastMsg("Product is out of stock.", "error");
          return;
        }
        payload = { productId: prod._id, quantity: 1 };
      }

      const response = await axiosInstance.post("/api/user/cart/add", payload);
      if (!response.data.success) throw new Error(response.data.message || "Cart add failed");

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

  // Format price
  const formatPrice = useCallback((price) => {
    const numPrice = parseFloat(price || 0);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(numPrice);
  }, []);

  // Fetch wishlist
  useEffect(() => {
    fetchWishlistData();
  }, [user]);

  const handleBack = () => navigate(-1);

  const hasRecommendations = Array.isArray(recommendations) && recommendations.length > 0;
  const hasSuggestions = Array.isArray(suggestions) && suggestions.some((s) => Array.isArray(s.products) && s.products.length > 0);

  const displayProducts = hasRecommendations
    ? recommendations
    : hasSuggestions
      ? suggestions.flatMap((s) => s.products || [])
      : [];

  // UPDATED: Render product card - same logic as ProductPage
  const renderProductCard = (prod) => {
    const vars = Array.isArray(prod.variants) ? prod.variants : (Array.isArray(prod.shades) ? prod.shades : []);
    const hasVar = vars.length > 0;

    // Check if variant is selected (same as ProductPage)
    const isVariantSelected = !!selectedVariants[prod._id];
    const displayVariant = selectedVariants[prod._id] || (hasVar ? (vars.find((v) => v.stock > 0) || vars[0]) : null);

    const grouped = groupVariantsByType(vars);
    const totalVars = vars.length;
    const sku = displayVariant ? getSku(displayVariant) : null;
    const inWl = sku ? isInWishlist(prod._id, sku) : false;
    const slugPr = prod.slugs?.[0] || prod.slug || prod._id;
    const img = displayVariant?.images?.[0] || displayVariant?.image || prod.images?.[0] || "/placeholder.png";
    const isAdding = addingToCart[prod._id];
    const oos = hasVar ? displayVariant?.stock <= 0 : prod.stock <= 0;

    // KEY LOGIC: Show "Select Variant" button if has variants but not selected yet
    const showSelectVariantButton = hasVar && !isVariantSelected;
    const disabled = isAdding || (!showSelectVariantButton && oos);

    let btnText = "Add to Bag";
    if (isAdding) btnText = "Adding...";
    else if (showSelectVariantButton) btnText = "Select Variant";
    else if (oos) btnText = "Out of Stock";

    return (
      <div key={prod._id} className="col-6 col-md-4 col-lg-3 mb-4">
        <div className="foryou-card-wrapper recommendations-card">
          <div className="foryou-card">
            {/* Product Image */}
            <div
              className="foryou-img-wrapper"
              onClick={() => handleProductClick(prod)}
              style={{ cursor: 'pointer', position: 'relative' }}
            >
              <img
                src={img}
                alt={prod.name || "Product"}
                className="foryou-img img-fluid"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.png";
                }}
              />

              {/* Wishlist Icon */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (displayVariant || !hasVar) toggleWishlist(prod, displayVariant || {});
                }}
                disabled={wishlistLoading[prod._id]}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  cursor: wishlistLoading[prod._id] ? 'not-allowed' : 'pointer',
                  color: inWl ? '#dc3545' : '#000000',
                  fontSize: '22px',
                  zIndex: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '50%',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  border: 'none',
                  outline: 'none'
                }}
                title={inWl ? "Remove from wishlist" : "Add to wishlist"}
              >
                {wishlistLoading[prod._id] ? (
                  <div className="spinner-border spinner-border-sm" role="status"></div>
                ) : inWl ? (
                  <FaHeart />
                ) : (
                  <FaRegHeart />
                )}
              </button>
            </div>

            {/* Product Info */}
            <div className="foryou-product-info w-100 ps-lg-0 p-0 pt-md-0">
              <div className="justify-content-between d-flex flex-column" style={{ height: '260px' }}>

                {/* Brand Name */}
                <div className="brand-name small text-muted mb-1 mt-2 text-start">
                  {getBrandName(prod)}
                </div>

                {/* Product Name */}
                <h6
                  className="foryou-name font-family-Poppins m-0 p-0"
                  onClick={() => handleProductClick(prod)}
                  style={{ cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
                >
                  {prod.name || "Unnamed Product"}
                </h6>

                {/* UPDATED: Variant Display - same as ProductPage */}
                {hasVar && (
                  <div className="m-0 p-0 ms-0 mt-2 mb-2">
                    {isVariantSelected ? (
                      <div
                        className="text-muted small"
                        style={{ cursor: "pointer", display: "inline-block" }}
                        onClick={(e) => { e.stopPropagation(); openVariantOverlay(prod._id, "all"); }}
                        title="Click to change variant"
                      >
                        Variant: <span className="fw-bold text-dark">{getVariantDisplayText(displayVariant)}</span>
                        <FaChevronDown className="ms-1" style={{ fontSize: "10px" }} />
                      </div>
                    ) : (
                      <div
                        className="small text-muted"
                        style={{ height: "20px", cursor: "pointer", display: "inline-block" }}
                        onClick={(e) => { e.stopPropagation(); openVariantOverlay(prod._id, "all"); }}
                      >
                        {vars.length} Variants Available
                        <FaChevronDown className="ms-1" style={{ fontSize: "10px" }} />
                      </div>
                    )}
                  </div>
                )}

                {/* Price Section */}
                <div className="price-section mb-3">
                  <div className="d-flex align-items-baseline flex-wrap">
                    <span className="current-price fw-400 fs-5" style={{ fontSize: '16px', fontWeight: '600' }}>
                      {formatPrice(displayVariant?.displayPrice || prod.price || 0)}
                    </span>
                    {(displayVariant?.originalPrice || prod.mrp) > (displayVariant?.displayPrice || prod.price || 0) && (
                      <>
                        <span className="original-price text-muted text-decoration-line-through ms-2 fs-6" style={{ fontSize: '13px' }}>
                          {formatPrice(displayVariant?.originalPrice || prod.mrp || 0)}
                        </span>
                        <span className="discount-percent text-danger fw-bold ms-2" style={{ fontSize: '13px' }}>
                          ({Math.round(((displayVariant?.originalPrice || prod.mrp || 0) - (displayVariant?.displayPrice || prod.price || 0)) / (displayVariant?.originalPrice || prod.mrp || 1) * 100)}% OFF)
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* UPDATED: Add to Cart Button - same as ProductPage */}
                <div className="mt-3">
                  <button
                    className={`btn w-100 d-flex align-items-center justify-content-center gap-2 addtocartbuttton page-title-main-name ${isAdding ? "btn-dark" : "btn-outline-dark"}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      showSelectVariantButton ? openVariantOverlay(prod._id, "all") : handleAddToCart(prod);
                    }}
                    disabled={disabled}
                    style={{ transition: "background-color .3s ease, color .3s ease" }}
                  >
                    {isAdding
                      ? <><span className="spinner-border spinner-border-sm me-2" role="status" />Adding...</>
                      : <>{btnText}{!disabled && !isAdding && !showSelectVariantButton && <img src={bagIcon} alt="Bag" style={{ height: 20 }} />}</>}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Variant Overlay - same as ProductPage */}
          {showVariantOverlay === prod._id && (
            <div className="variant-overlay" style={{ position: 'absolute' }} onClick={closeVariantOverlay}>
              <div
                className="variant-overlay-content w-100 p-0"
                onClick={(e) => e.stopPropagation()}
                style={{ width: "90%", maxWidth: 500, maxHeight: "80vh", background: "#fff", overflow: "hidden", display: "flex", flexDirection: "column" }}
              >
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
      </div>
    );
  };

  return (
    <>
      <Header />

      <div className="container-lg py-4 page-title-main-name">
        {/* Header Section */}
        <div className="text-center mb-5">
          <h1 className="recommendations-title mb-3 " style={{ fontSize: '28px', fontWeight: '400' }}>
            {hasRecommendations
              ? "Your Recommended Products"
              : hasSuggestions
                ? "No Exact Match Found – Showing Related Products"
                : "No Products Found"}
          </h1>

          {/* User Selections Summary */}
          {(shade || undertoneKey || family || formulation) && (
            <div className="selection-summary selection-summary-content">
              {shade?.name && (
                <div className="selection-item" style={{ textAlign: 'center' }}>
                  <span className="selection-label" style={{ display: 'block', fontSize: '12px', color: '#666' }}>Shade</span>
                  <span className="selection-value" style={{ fontWeight: '500' }}>- {shade.name}</span>
                </div>
              )}
              {undertoneKey && (
                <div className="selection-item" style={{ textAlign: 'center' }}>
                  <span className="selection-label" style={{ display: 'block', fontSize: '12px', color: '#666' }}>Undertone</span>
                  <span className="selection-value" style={{ fontWeight: '500' }}>- {undertoneKey}</span>
                </div>
              )}
              {family?.name && (
                <div className="selection-item" style={{ textAlign: 'center' }}>
                  <span className="selection-label" style={{ display: 'block', fontSize: '12px', color: '#666' }}>Family</span>
                  <span className="selection-value" style={{ fontWeight: '500' }}>- {family.name}</span>
                </div>
              )}
              {formulation?.name && (
                <div className="selection-item" style={{ textAlign: 'center' }}>
                  <span className="selection-label" style={{ display: 'block', fontSize: '12px', color: '#666' }}>Formulation</span>
                  <span className="selection-value" style={{ fontWeight: '500' }}>- {formulation.name}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Product Grid */}
        {displayProducts.length === 0 ? (
          <div className="text-center py-5">
            <div className="no-products-icon mb-3" style={{ fontSize: '48px' }}>😔</div>
            <h3 className="mb-3">No products found</h3>
            <p className="text-muted mb-4">
              We couldn't find any products matching your selection. Please try different options.
            </p>
            <button className="btn btn-secondary" onClick={handleBack}>
              Go Back
            </button>
          </div>
        ) : (
          <>
            <div className="row g-4">
              {displayProducts.map(renderProductCard)}
            </div>

            <div className="text-center mt-5 pt-4 border-top">
              <button className="btn btn-for-shadetones rounded-pill px-5 py-2" onClick={handleBack}>
                ← Back to Foundation Type
              </button>
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
}




//==============================================================Done_code(Start)=========================================================================================
