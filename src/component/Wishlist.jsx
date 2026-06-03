// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Header from "./Header";
// import Footer from "./Footer";
// import { FaStar, FaHeart, FaShoppingCart } from "react-icons/fa";

// const Wishlist = () => {
//   const [wishlistItems, setWishlistItems] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchWishlist = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/login");
//         return;
//       }

//       try {
//         const response = await fetch(
//           "https://beauty.joyory.com/api/user/wishlist",
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         if (!response.ok) throw new Error("Failed to fetch wishlist");
//         const data = await response.json();
//         setWishlistItems(data.wishlist || []);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchWishlist();
//   }, [navigate]);

//   // Remove item from wishlist using DELETE
//   const removeFromWishlist = async (productId) => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     try {
//       const response = await fetch(
//         `https://beauty.joyory.com/api/user/wishlist/${productId}`,
//         {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.ok) throw new Error("Failed to remove item");

//       setWishlistItems((prev) => prev.filter((item) => item._id !== productId));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Move item to cart
//   const moveToCart = async (productId) => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     try {
//       const response = await fetch(
//         `https://beauty.joyory.com/api/user/wishlist/${productId}/move-to-cart`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.ok) throw new Error("Failed to move item to cart");

//       // Remove from wishlist in UI
//       setWishlistItems((prev) => prev.filter((item) => item._id !== productId));

//       // Optional: show a message or navigate to cart page
//       alert("Product moved to cart successfully!");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const renderStars = (rating) => {
//     const stars = [];
//     for (let i = 1; i <= 5; i++) {
//       stars.push(
//         <FaStar key={i} size={16} color={i <= rating ? "#2b6cb0" : "#ccc"} />
//       );
//     }
//     return stars;
//   };

//   return (
//     <>
//       <Header />
//       <div className="container py-4">
//         <h2 className="mb-4">My Wishlist</h2>
//         {wishlistItems.length === 0 ? (
//           <p>Your wishlist is empty.</p>
//         ) : (
//           <div className="row g-4">
//             {wishlistItems.map((prod) => (
//               <div key={prod._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
//                 <div className="card h-100 shadow-sm">
//                   <img
//                     src={prod.images || "/placeholder.png"}
//                     alt={prod.name}
//                     className="card-img-top"
//                     style={{ height: "200px", objectFit: "cover", cursor: "pointer" }}
//                     onClick={() => navigate(`/product/${prod._id}`)}
//                   />
//                   <div className="card-body d-flex flex-column">
//                     <h5
//                       className="card-title"
//                       style={{ cursor: "pointer" }}
//                       onClick={() => navigate(`/product/${prod._id}`)}
//                     >
//                       {prod.name}
//                     </h5>
//                     <p className="text-muted small mb-2">{prod.summary}</p>
//                     <div className="d-flex align-items-center mb-2">
//                       {renderStars(prod.avgRating || 0)}
//                       <span className="ms-2 text-muted small">
//                         ({prod.commentsCount || 0})
//                       </span>
//                     </div>
//                     <p className="fw-bold mb-2">₹{prod.price}</p>

//                     <div className="d-flex gap-2 mt-auto">
//                       <button
//                         className="btn btn-outline-danger flex-grow-1"
//                         onClick={() => removeFromWishlist(prod._id)}
//                       >
//                         <FaHeart /> Remove
//                       </button>
//                       <button
//                         className="btn btn-primary flex-grow-1"
//                         onClick={() => moveToCart(prod._id)}
//                       >
//                         <FaShoppingCart /> Move to Cart
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Wishlist;

































// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Header from "./Header";
// import Footer from "./Footer";
// import { FaStar, FaHeart, FaShoppingCart } from "react-icons/fa";

// const Wishlist = () => {
//   const [wishlistItems, setWishlistItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchWishlist = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/login");
//         return;
//       }

//       try {
//         setLoading(true);
//         const response = await fetch(
//           "https://beauty.joyory.com/api/user/wishlist",
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         if (!response.ok) throw new Error("Failed to fetch wishlist");
//         const data = await response.json();
//         setWishlistItems(data.wishlist || []);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchWishlist();
//   }, [navigate]);

//   // Remove item from wishlist
//   const removeFromWishlist = async (productId) => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     try {
//       const response = await fetch(
//         `https://beauty.joyory.com/api/user/wishlist/${productId}`,
//         {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.ok) throw new Error("Failed to remove item");

//       setWishlistItems((prev) => prev.filter((item) => item._id !== productId));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Move item to cart
//   const moveToCart = async (productId) => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     try {
//       const response = await fetch(
//         `https://beauty.joyory.com/api/user/wishlist/${productId}/move-to-cart`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.ok) throw new Error("Failed to move item to cart");

//       setWishlistItems((prev) => prev.filter((item) => item._id !== productId));
//       alert("Product moved to cart successfully!");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const renderStars = (rating) => {
//     const stars = [];
//     for (let i = 1; i <= 5; i++) {
//       stars.push(
//         <FaStar key={i} size={16} color={i <= rating ? "#2b6cb0" : "#ccc"} />
//       );
//     }
//     return stars;
//   };

//   return (
//     <>
//       <Header />

//       {loading ? (
//         // Fullscreen Loader
//         <div
//           style={{
//             height: "60vh",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             flexDirection: "column",
//           }}
//         >
//           <div className="spinner-border text-primary mb-3" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p>Loading your wishlist...</p>
//         </div>
//       ) : (
//         <div className="container py-4">
//           <h2 className="mb-4">My Wishlist</h2>
//           {wishlistItems.length === 0 ? (
//             <p>Your wishlist is empty.</p>
//           ) : (
//             <div className="row g-4">
//               {wishlistItems.map((prod) => (
//                 <div
//                   key={prod._id}
//                   className="col-12 col-sm-6 col-md-4 col-lg-3"
//                 >
//                   <div className="card h-100 shadow-sm">
//                     <img
//                       src={
//                         Array.isArray(prod.images)
//                           ? prod.images[0]
//                           : prod.image || "/placeholder.png"
//                       }
//                       alt={prod.name}
//                       className="card-img-top"
//                       style={{
//                         height: "200px",
//                         objectFit: "cover",
//                         cursor: "pointer",
//                       }}
//                       onClick={() => navigate(`/product/${prod._id}`)}
//                     />
//                     <div className="card-body d-flex flex-column">
//                       <h5
//                         className="card-title"
//                         style={{ cursor: "pointer" }}
//                         onClick={() => navigate(`/product/${prod._id}`)}
//                       >
//                         {prod.name}
//                       </h5>
//                       <p className="text-muted small mb-2">{prod.summary}</p>
//                       <div className="d-flex align-items-center mb-2">
//                         {renderStars(prod.avgRating || 0)}
//                         <span className="ms-2 text-muted small">
//                           ({prod.commentsCount || 0})
//                         </span>
//                       </div>
//                       <p className="fw-bold mb-2">₹{prod.price}</p>

//                       <div className="d-flex gap-2 mt-auto">
//                         <button
//                           className="btn btn-outline-danger flex-grow-1"
//                           onClick={() => removeFromWishlist(prod._id)}
//                         >
//                           <FaHeart /> Remove
//                         </button>
//                         <button
//                           className="btn btn-primary flex-grow-1"
//                           onClick={() => moveToCart(prod._id)}
//                         >
//                           <FaShoppingCart /> Move to Cart
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       <Footer />
//     </>
//   );
// };

// export default Wishlist;








// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Header from "./Header";
// import Footer from "./Footer";
// import { FaStar, FaHeart, FaShoppingCart } from "react-icons/fa";

// const Wishlist = () => {
//   const [wishlistItems, setWishlistItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(
//           "https://beauty.joyory.com/api/user/wishlist",
//           {
//             method: "GET",
//             credentials: "include", // ✅ send cookies automatically
//           }
//         );

//         if (response.status === 401) {
//           navigate("/login");
//           return;
//         }

//         if (!response.ok) throw new Error("Failed to fetch wishlist");
//         const data = await response.json();
//         setWishlistItems(data.wishlist || []);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchWishlist();
//   }, [navigate]);

//   // Remove item from wishlist
//   const removeFromWishlist = async (productId) => {
//     try {
//       const response = await fetch(
//         `https://beauty.joyory.com/api/user/wishlist/${productId}`,
//         {
//           method: "DELETE",
//           credentials: "include", // ✅ cookies handled automatically
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.status === 401) {
//         navigate("/login");
//         return;
//       }

//       if (!response.ok) throw new Error("Failed to remove item");

//       setWishlistItems((prev) => prev.filter((item) => item._id !== productId));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Move item to cart
//   const moveToCart = async (productId) => {
//     try {
//       const response = await fetch(
//         `https://beauty.joyory.com/api/user/wishlist/${productId}/move-to-cart`,
//         {
//           method: "POST",
//           credentials: "include", // ✅ cookies sent
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.status === 401) {
//         navigate("/login");
//         return;
//       }

//       if (!response.ok) throw new Error("Failed to move item to cart");

//       setWishlistItems((prev) => prev.filter((item) => item._id !== productId));
//       alert("Product moved to cart successfully!");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const renderStars = (rating) => {
//     const stars = [];
//     for (let i = 1; i <= 5; i++) {
//       stars.push(
//         <FaStar key={i} size={16} color={i <= rating ? "#2b6cb0" : "#ccc"} />
//       );
//     }
//     return stars;
//   };

//   return (
//     <>
//       <Header />

//       {loading ? (
//         // Fullscreen Loader
//         <div
//           style={{
//             height: "60vh",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             flexDirection: "column",
//           }}
//         >
//           <div className="spinner-border text-primary mb-3" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p>Loading your wishlist...</p>
//         </div>
//       ) : (
//         <div className="container py-4">
//           <h2 className="mb-4">My Wishlist</h2>
//           {wishlistItems.length === 0 ? (
//             <p>Your wishlist is empty.</p>
//           ) : (
//             <div className="row g-4">
//               {wishlistItems.map((prod) => (
//                 <div
//                   key={prod._id}
//                   className="col-12 col-sm-6 col-md-4 col-lg-3"
//                 >
//                   <div className="card h-100 shadow-sm">
//                     <img
//                       src={
//                         Array.isArray(prod.images)
//                           ? prod.images[0]
//                           : prod.image || "/placeholder.png"
//                       }
//                       alt={prod.name}
//                       className="card-img-top"
//                       style={{
//                         height: "200px",
//                         objectFit: "cover",
//                         cursor: "pointer",
//                       }}
//                       onClick={() => navigate(`/product/${prod._id}`)}
//                     />
//                     <div className="card-body d-flex flex-column">
//                       <h5
//                         className="card-title"
//                         style={{ cursor: "pointer" }}
//                         onClick={() => navigate(`/product/${prod._id}`)}
//                       >
//                         {prod.name}
//                       </h5>
//                       <p className="text-muted small mb-2">{prod.summary}</p>
//                       <div className="d-flex align-items-center mb-2">
//                         {renderStars(prod.avgRating || 0)}
//                         <span className="ms-2 text-muted small">
//                           ({prod.commentsCount || 0})
//                         </span>
//                       </div>
//                       <p className="fw-bold mb-2">₹{prod.price}</p>

//                       <div className="d-flex gap-2 mt-auto">
//                         <button
//                           className="btn btn-outline-danger flex-grow-1"
//                           onClick={() => removeFromWishlist(prod._id)}
//                         >
//                           <FaHeart /> Remove
//                         </button>
//                         <button
//                           className="btn btn-primary flex-grow-1"
//                           onClick={() => moveToCart(prod._id)}
//                         >
//                           <FaShoppingCart /> Move to Cart
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       <Footer />
//     </>
//   );
// };

// export default Wishlist;






















// import React, { useEffect, useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import Header from "./Header";
// import Footer from "./Footer";
// import { FaStar, FaHeart, FaShoppingCart } from "react-icons/fa";
// import { UserContext } from "./UserContext"; // ✅ detect if guest or logged-in

// const Wishlist = () => {
//   const [wishlistItems, setWishlistItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const { user } = useContext(UserContext); // ✅ access user data

//   // ✅ Load wishlist based on user type
//   useEffect(() => {
//     const fetchWishlist = async () => {
//       setLoading(true);
//       try {
//         if (user && user.guest) {
//           // 🟢 Guest user → Load from localStorage
//           const localWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];
//           setWishlistItems(localWishlist);
//         } else {
//           // 🟢 Logged-in user → Fetch from backend
//           const response = await fetch(
//             "https://beauty.joyory.com/api/user/wishlist",
//             {
//               method: "GET",
//               credentials: "include",
//             }
//           );

//           if (response.status === 401) {
//             // If token expired, treat as guest
//             const localWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];
//             setWishlistItems(localWishlist);
//             return;
//           }

//           if (!response.ok) throw new Error("Failed to fetch wishlist");
//           const data = await response.json();
//           setWishlistItems(data.wishlist || []);
//         }
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchWishlist();
//   }, [user]);

//   // ✅ Remove item
//   const removeFromWishlist = async (productId) => {
//     if (user && user.guest) {
//       // 🟢 Guest user → remove locally
//       const updated = wishlistItems.filter((item) => item._id !== productId);
//       setWishlistItems(updated);
//       localStorage.setItem("guestWishlist", JSON.stringify(updated));
//       return;
//     }

//     // 🟢 Logged-in user → API call
//     try {
//       const response = await fetch(
//         `https://beauty.joyory.com/api/user/wishlist/${productId}`,
//         {
//           method: "DELETE",
//           credentials: "include",
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       if (!response.ok) throw new Error("Failed to remove item");
//       setWishlistItems((prev) => prev.filter((item) => item._id !== productId));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // ✅ Move to Cart
//   const moveToCart = async (productId) => {
//     if (user && user.guest) {
//       // 🟢 Guest user → simulate move to cart locally
//       const product = wishlistItems.find((item) => item._id === productId);
//       if (product) {
//         const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
//         guestCart.push(product);
//         localStorage.setItem("guestCart", JSON.stringify(guestCart));

//         // Remove from wishlist
//         const updated = wishlistItems.filter((item) => item._id !== productId);
//         setWishlistItems(updated);
//         localStorage.setItem("guestWishlist", JSON.stringify(updated));
//         alert("Added to cart successfully!");
//       }
//       return;
//     }

//     // 🟢 Logged-in user → API move to cart
//     try {
//       const response = await fetch(
//         `https://beauty.joyory.com/api/user/wishlist/${productId}/move-to-cart`,
//         {
//           method: "POST",
//           credentials: "include",
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       if (!response.ok) throw new Error("Failed to move item to cart");

//       setWishlistItems((prev) => prev.filter((item) => item._id !== productId));
//       alert("Product moved to cart successfully!");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // ✅ Rating Stars
//   const renderStars = (rating) => {
//     return Array.from({ length: 5 }, (_, i) => (
//       <FaStar key={i} size={16} color={i < rating ? "#2b6cb0" : "#ccc"} />
//     ));
//   };

//   return (
//     <>
//       <Header />

//       {loading ? (
//         <div
//           style={{
//             height: "60vh",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             flexDirection: "column",
//           }}
//         >
//           <div className="spinner-border text-primary mb-3" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p>Loading your wishlist...</p>
//         </div>
//       ) : (
//         <div className="container py-4">
//           <h2 className="mb-4">My Wishlist</h2>
//           {wishlistItems.length === 0 ? (
//             <p>Your wishlist is empty.</p>
//           ) : (
//             <div className="row g-4">
//               {wishlistItems.map((prod) => (
//                 <div
//                   key={prod._id}
//                   className="col-12 col-sm-6 col-md-4 col-lg-3"
//                 >
//                   <div className="card h-100 shadow-sm">
//                     <img
//                       src={
//                         Array.isArray(prod.images)
//                           ? prod.images[0]
//                           : prod.image || "/placeholder.png"
//                       }
//                       alt={prod.name}
//                       className="card-img-top"
//                       style={{
//                         height: "200px",
//                         objectFit: "cover",
//                         cursor: "pointer",
//                       }}
//                       onClick={() => navigate(`/product/${prod._id}`)}
//                     />
//                     <div className="card-body d-flex flex-column">
//                       <h5
//                         className="card-title"
//                         style={{ cursor: "pointer" }}
//                         onClick={() => navigate(`/product/${prod._id}`)}
//                       >
//                         {prod.name}
//                       </h5>
//                       <p className="text-muted small mb-2">{prod.summary}</p>
//                       <div className="d-flex align-items-center mb-2">
//                         {renderStars(prod.avgRating || 0)}
//                         <span className="ms-2 text-muted small">
//                           ({prod.commentsCount || 0})
//                         </span>
//                       </div>
//                       <p className="fw-bold mb-2">₹{prod.price}</p>

//                       <div className="d-flex gap-2 mt-auto">
//                         <button
//                           className="btn btn-outline-danger flex-grow-1"
//                           onClick={() => removeFromWishlist(prod._id)}
//                         >
//                           <FaHeart /> Remove
//                         </button>
//                         <button
//                           className="btn btn-primary flex-grow-1"
//                           onClick={() => moveToCart(prod._id)}
//                         >
//                           <FaShoppingCart /> Move to Cart
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       <Footer />
//     </>
//   );
// };

// export default Wishlist;



















// import React, { useEffect, useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import Header from "./Header";
// import Footer from "./Footer";
// import { FaStar, FaHeart, FaShoppingCart } from "react-icons/fa";
// import { UserContext } from "./UserContext";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Wishlist = () => {
//   const [wishlistItems, setWishlistItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const { user } = useContext(UserContext);

//   // ✅ Load wishlist based on user type
//   useEffect(() => {
//     const fetchWishlist = async () => {
//       setLoading(true);
//       try {
//         if (user && user.guest) {
//           // Guest user → Load from localStorage
//           const localWishlist = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
//           setWishlistItems(localWishlist);
//         } else {
//           // Logged-in user → Fetch from backend
//           const response = await fetch(
//             "https://beauty.joyory.com/api/user/wishlist",
//             {
//               method: "GET",
//               credentials: "include",
//             }
//           );

//           if (response.status === 401) {
//             // Token expired → fallback to guest
//             const localWishlist = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
//             setWishlistItems(localWishlist);
//             toast.info("Session expired. Showing guest wishlist.");
//             return;
//           }

//           if (!response.ok) throw new Error("Failed to fetch wishlist");

//           const data = await response.json();
//           if (data.success && Array.isArray(data.wishlist)) {
//             setWishlistItems(data.wishlist);
//           } else {
//             setWishlistItems([]);
//           }
//         }
//       } catch (err) {
//         console.error("Wishlist fetch error:", err);
//         toast.error("Failed to load wishlist");
//         setWishlistItems([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchWishlist();
//   }, [user]);

//   // ✅ Remove item from wishlist
//   const removeFromWishlist = async (productId) => {
//     try {
//       if (user && user.guest) {
//         // Guest: remove from localStorage
//         const updated = wishlistItems.filter((item) => item.productId !== productId);
//         setWishlistItems(updated);
//         localStorage.setItem("guestWishlist", JSON.stringify(updated));
//         toast.success("Removed from wishlist");
//         return;
//       }

//       // Logged-in: call backend
//       const response = await fetch(
//         `https://beauty.joyory.com/api/user/wishlist/${productId}`,
//         {
//           method: "DELETE",
//           credentials: "include",
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       if (!response.ok) throw new Error("Failed to remove");

//       setWishlistItems((prev) => prev.filter((item) => item.productId !== productId));
//       toast.success("Removed from wishlist");
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to remove item");
//     }
//   };

//   // ✅ Move to Cart
//   const moveToCart = async (item) => {
//     try {
//       if (user && user.guest) {
//         // Guest: add to local cart
//         let guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");

//         const cartItem = {
//           productId: item.productId,
//           productName: item.name,
//           variant: item.variant,
//           sku: item.sku,
//           image: item.image,
//           price: item.displayPrice,
//           originalPrice: item.originalPrice,
//           quantity: 1,
//           totalPrice: item.displayPrice,
//         };

//         guestCart.push(cartItem);
//         localStorage.setItem("guestCart", JSON.stringify(guestCart));

//         // Remove from wishlist
//         const updatedWishlist = wishlistItems.filter((w) => w.productId !== item.productId);
//         setWishlistItems(updatedWishlist);
//         localStorage.setItem("guestWishlist", JSON.stringify(updatedWishlist));

//         toast.success("Added to cart!");
//         return;
//       }

//       // Logged-in: call backend move-to-cart endpoint
//       const response = await fetch(
//         `https://beauty.joyory.com/api/user/wishlist/${item.productId}/move-to-cart`,
//         {
//           method: "POST",
//           credentials: "include",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ sku: item.sku }), // if backend needs sku
//         }
//       );

//       if (!response.ok) throw new Error("Failed to move to cart");

//       setWishlistItems((prev) => prev.filter((w) => w.productId !== item.productId));
//       toast.success("Moved to cart successfully!");
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to add to cart");
//     }
//   };

//   // ✅ Render Rating Stars
//   const renderStars = (rating) => {
//     const fullStars = Math.floor(rating || 0);
//     return Array.from({ length: 5 }, (_, i) => (
//       <FaStar
//         key={i}
//         size={16}
//         color={i < fullStars ? "#ffc107" : "#e0e0e0"}
//         style={{ marginRight: "2px" }}
//       />
//     ));
//   };

//   return (
//     <>
//       <Header />
//       <ToastContainer position="top-right" autoClose={3000} />

//       {loading ? (
//         <div
//           style={{
//             height: "60vh",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             flexDirection: "column",
//           }}
//         >
//           <div className="spinner-border text-primary mb-3" role="status">
//             <span className="visually-hidden page-title-main-name">Loading...</span>
//           </div>
//           <p className="page-title-main-name">Loading your wishlist...</p>
//         </div>
//       ) : (
//         <div className="container py-4 mt-xl-5 pt-xl-4">
//           <h2 className="mb-4 fw-bold page-title-main-name">My Wishlist ({wishlistItems.length})</h2>

//           {wishlistItems.length === 0 ? (
//             <div className="text-center py-5 page-title-main-name">
//               <p className="text-muted fs-5 page-title-main-name">Your wishlist is empty.</p>
//               <button
//                 className="btn btn-primary page-title-main-name"
//                 onClick={() => navigate("/")}
//               >
//                 Continue Shopping
//               </button>
//             </div>
//           ) : (
//             <div className="row g-4">
//               {wishlistItems.map((item) => (
//                 <div
//                   key={item.productId}
//                   className="col-12 col-sm-6 col-md-4 col-lg-3"
//                 >
//                   <div className="card h-100 shadow-sm border-0 mt-xl-3">
//                     {/* Product Image */}
//                     <div
//                       className="position-relative"
//                       style={{ cursor: "pointer" }}
//                       onClick={() => navigate(`/product/${item.productId}`)}
//                     >
//                       <img
//                         src={item.image || "/placeholder.png"}
//                         alt={item.name}
//                         className="card-img-top"
//                         style={{
//                           height: "220px",
//                           objectFit: "cover",
//                           borderRadius: "8px 8px 0 0",
//                         }}
//                         onError={(e) => (e.target.src = "/placeholder.png")}
//                       />

//                       {/* Discount Badge */}
//                       {item.discountPercent > 0 && (
//                         <div
//                           className="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 m-2 rounded page-title-main-name"
//                           style={{ fontSize: "12px", fontWeight: "bold" }}
//                         >
//                           {item.discountPercent}% OFF
//                         </div>
//                       )}
//                     </div>

//                     <div className="card-body d-flex flex-column p-3">
//                       {/* Product Name */}
//                       <h6
//                         className="card-title mb-2 page-title-main-name"
//                         style={{
//                           cursor: "pointer",
//                           fontWeight: "600",
//                           fontSize: "15px",
//                         }}
//                         onClick={() => navigate(`/product/${item.productId}`)}
//                       >
//                         {item.name}
//                       </h6>

//                       {/* Variant */}
//                       {item.variant && (
//                         <p className="text-muted small mb-2 page-title-main-name">
//                           Variant: <strong>{item.variant}</strong>
//                         </p>
//                       )}

//                       {/* Rating */}
//                       <div className="d-flex align-items-center mb-2">
//                         {renderStars(item.avgRating)}
//                         <span className="ms-2 text-muted small page-title-main-name">
//                           ({item.totalRatings || 0})
//                         </span>
//                       </div>

//                       {/* Price */}
//                       <div className="d-flex align-items-center gap-2 mb-3">
//                         <span className="fw-bold fs-5 text-success page-title-main-name">
//                           ₹{item.displayPrice}
//                         </span>
//                         {item.originalPrice > item.displayPrice && (
//                           <del className="text-muted page-title-main-name">₹{item.originalPrice}</del>
//                         )}
//                       </div>

//                       {/* Stock Status */}
//                       {item.status === "outOfStock" && (
//                         <p className="text-danger small mb-2 page-title-main-name">Out of Stock</p>
//                       )}

//                       {/* Action Buttons */}
//                       <div className="d-flex gap-2 mt-auto page-title-main-name">
//                         <button
//                           className="btn btn-outline-danger flex-grow-1 d-flex align-items-center justify-content-center gap-2 page-title-main-name"
//                           onClick={() => removeFromWishlist(item.productId)}
//                         >
//                           <FaHeart /> Remove
//                         </button>

//                         <button
//                           className="page-title-main-name border-0 text-white btn-primary flex-grow-1 d-flex align-items-center justify-content-center gap-2"
//                           onClick={() => moveToCart(item)}
//                           disabled={item.status === "outOfStock"}
//                         >
//                           <FaShoppingCart /> Move to Cart
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       <Footer />
//     </>
//   );
// };

// export default Wishlist;














import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { FaStar, FaHeart, FaShoppingCart, FaTimes } from "react-icons/fa";
import { UserContext } from "./UserContext";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Bag from "../assets/Bag.svg";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingItems, setRemovingItems] = useState({});
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  // Fetch Wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      try {
        if (user && !user.guest) {
          // Logged-in user
          const response = await fetch("https://beauty.joyory.com/api/user/wishlist", {
            method: "GET",
            credentials: "include",
          });

          if (response.status === 401) {
            const localWishlist = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
            setWishlistItems(localWishlist);
            toast.info("Session expired. Showing guest wishlist.");
            return;
          }

          if (!response.ok) throw new Error("Failed to fetch wishlist");

          const data = await response.json();
          setWishlistItems(data.success && Array.isArray(data.wishlist) ? data.wishlist : []);
        } else {
          // Guest user
          const localWishlist = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
          setWishlistItems(localWishlist);
        }
      } catch (err) {
        console.error("Wishlist fetch error:", err);
        toast.error("Failed to load wishlist");
        setWishlistItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user]);

  // Remove from Wishlist
  const removeFromWishlist = async (productId, sku) => {
    const itemKey = `${productId}-${sku}`;
    if (removingItems[itemKey]) return; // debounce double click triggers
    setRemovingItems((prev) => ({ ...prev, [itemKey]: true }));

    try {
      if (user && !user.guest) {
        const response = await fetch(`https://beauty.joyory.com/api/user/wishlist/${productId}`, {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sku }),
        });
        if (!response.ok) throw new Error("Failed to remove item");
      } else {
        // Guest
        const updated = wishlistItems.filter((item) => !(item.productId === productId && item.sku === sku));
        localStorage.setItem("guestWishlist", JSON.stringify(updated));
      }

      setWishlistItems((prev) => prev.filter((item) => !(item.productId === productId && item.sku === sku)));
      toast.success("Removed from wishlist");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item");
    } finally {
      setRemovingItems((prev) => {
        const copy = { ...prev };
        delete copy[itemKey];
        return copy;
      });
    }
  };

  // Move to Cart
  const moveToCart = async (item) => {
    try {
      if (user && !user.guest) {
        const response = await fetch(
          `https://beauty.joyory.com/api/user/wishlist/${item.productId}/move-to-cart`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sku: item.sku }),
          }
        );

        if (!response.ok) throw new Error("Failed to move to cart");
      } else {
        // Guest - Add to local cart
        let guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
        const cartItem = {
          productId: item.productId,
          productName: item.name,
          variant: item.variantName || item.variant,
          sku: item.sku,
          image: item.image,
          price: item.displayPrice,
          originalPrice: item.originalPrice,
          quantity: 1,
        };
        guestCart.push(cartItem);
        localStorage.setItem("guestCart", JSON.stringify(guestCart));
      }

      // Remove from wishlist after moving
      setWishlistItems((prev) => prev.filter((w) => w.productId !== item.productId));
      toast.success("Moved to cart successfully!");
      navigate("/cartpage");
    } catch (err) {
      console.error(err);
      toast.error("Failed to move to cart");
    }
  };

  // Render Stars
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating || 0);
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        size={16}
        color={i < fullStars ? "#ffc107" : "#e0e0e0"}
        style={{ marginRight: "2px" }}
      />
    ));
  };

  // if (loading) {
  //   return (
  //     <div style={{ height: "60vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
  //       <div className="spinner-border text-primary mb-3" role="status" />
  //       <p className="page-title-main-name">Loading your wishlist...</p>
  //     </div>
  //   );
  // }






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
            src="https:lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
            loop
            autoplay
          />


          <p className="text-muted mb-0">
            Please wait while we prepare the best products for you...
          </p>
        </div>
      </div>
    );

  return (
    <>
      <Header />

      <div className="container py-4 mt-xl-5 pt-xl-5 mt-5 pt-5">
        <h2 className="mb-4 fw-bold page-title-main-name mt-5">
          My Wishlist ({wishlistItems.length})
        </h2>

        {wishlistItems.length === 0 ? (
          // <div className="text-center py-5 page-title-main-name">
          //   <p className="text-muted fs-5">Your wishlist is empty.</p>
          //   <button className="btn btn-primary page-title-main-name" onClick={() => navigate("/")}>
          //     Continue Shopping
          //   </button>
          // </div>

          <div className="container mt-xl-5">
            <div className="p-4 text-center mt-5 cartpage-empty-Main-section">
              <h2 className="page-title-main-name cartpage-titles playfair-font-bold">Oops!</h2>
              <h5 className="mb-2 page-title-main-name">Your wishlist is empty</h5>
              <button className="page-title-main-name Shop-now-Button" onClick={() => navigate("/")}>
                Add to wishlist
              </button>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {wishlistItems.map((item) => (
              <div key={`${item.productId}-${item.sku}`} className="col-6 col-md-4 col-lg-3 px-2 mb-3">
                <div className="card h-100 shadow-sm-none border-0 position-relative">
                  {/* Cross (Remove) Button - Top Right */}
                  <button
                    className="position-absolute top-0 end-0 m-2 bg-white border-0 rounded-circle p-1 shadow-sm"
                    style={{
                      zIndex: 10,
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: removingItems[`${item.productId}-${item.sku}`] ? 0.5 : 1,
                      cursor: removingItems[`${item.productId}-${item.sku}`] ? "not-allowed" : "pointer"
                    }}
                    onClick={() => removeFromWishlist(item.productId, item.sku)}
                    disabled={removingItems[`${item.productId}-${item.sku}`]}
                  >
                    {removingItems[`${item.productId}-${item.sku}`]
                      ? <div className="spinner-border spinner-border-sm" role="status" style={{ width: "12px", height: "12px" }} />
                      : <FaTimes size={16} color="#000" />
                    }
                  </button>

                  {/* Product Image */}
                  <div
                    className="position-relative"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/product/${item.productId}`)}
                  >
                    <img
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover", borderRadius: "8px 8px 0 0" }}
                      onError={(e) => (e.target.src = "/placeholder.png")}
                    />

                    {/* {item.discountPercent > 0 && (
                      <div className="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 m-2 rounded" style={{ fontSize: "12px", fontWeight: "bold" }}>
                        {item.discountPercent}% OFF
                      </div>
                    )} */}
                  </div>

                  <div className="card-body d-flex flex-column p-3">
                    <h6
                      className="card-title mb-2 page-title-main-name mt-3"
                      style={{ cursor: "pointer", fontWeight: "600", fontSize: "14px" }}
                      onClick={() => navigate(`/product/${item.productId}`)}
                    >
                      {(() => {
                        const variantText = (item.variantName || item.variant || "").trim();
                        return variantText && variantText.toUpperCase() !== "DEFAULT" ? `${item.name} - ${item.variantName || item.variant}` : item.name;
                      })()}
                    </h6>

                    {/* Rating */}
                    <div className="d-flex align-items-center mb-2">
                      {renderStars(item.avgRating)}
                      <span className="ms-2 text-muted small">
                        ({item.totalRatings || 0})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="fw-bold fs-5 text-success">
                        ₹{item.displayPrice}
                      </span>
                      {item.originalPrice > item.displayPrice && (
                        <del className="text-muted">₹{item.originalPrice}</del>
                      )}
                    </div>

                    {/* Stock Status */}
                    {item.status === "outOfStock" && (
                      <p className="text-danger small mb-2">Out of Stock</p>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-auto">
                      <button
                        className="btn w-100 addtocartbuttton d-flex align-items-center justify-content-center gap-2 btn-outline-dark"
                        style={{
                          transition: "background-color .3s ease, color .3s ease",
                        }}
                        onClick={() => moveToCart(item)}
                        disabled={item.status === "outOfStock"}
                      >
                        Move to Cart
                        {item.status !== "outOfStock" && (
                          <img src={Bag} alt="Bag" style={{ height: 20 }} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Wishlist;