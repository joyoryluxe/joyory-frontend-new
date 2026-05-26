// import React, { useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Link } from "react-router-dom"; // If using React Router
// import loginImg from "../assets/login-image.png"; // Optional - add your own image
// import Logo from "../assets/Logo.png"; // Your logo
// import "../css/Affiliatelogin.css";




// const Affiliatelogin = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     rememberMe: false
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value
//     });
//   };

// const API_LOGIN_URL = "https://beauty.joyory.com/api/affiliate/login";

// // Inside handleSubmit function:
// const handleSubmit = async (e) => {
//   e.preventDefault();
  
//   try {
//     const response = await fetch(API_LOGIN_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         email: formData.email,
//         password: formData.password
//       })
//     });

//     const data = await response.json();
    
//     if (response.ok) {
//       // Store token in localStorage
//       localStorage.setItem("joyoryAffiliateToken", data.token);
//       localStorage.setItem("joyoryAffiliateUser", JSON.stringify(data.user));
      
//       // Redirect to dashboard
//       window.location.href = "/Affiliatedashboard";
//     } else {
//       alert(data.message || "Login failed");
//     }
//   } catch (error) {
//     console.error("Login error:", error);
//     alert("Network error. Please try again.");
//   }
// };

//   return (
//     <div className="container-fluid p-0">
//       <div className="row g-0 min-vh-100">
        
//         {/* LEFT SIDE - IMAGE (Optional, add if you have a login image) */}
//         <div className="col-12 col-lg-6 d-none d-lg-block">
//           <div 
//             className="h-100 w-100" 
//             style={{
//               backgroundColor: "#f0f8ff", // Light blue background as placeholder
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center"
//             }}
//           >
//             {loginImg ? (
//               <img
//                 src={loginImg}
//                 alt="Login Banner"
//                 className="img-fluid w-100 h-100"
//                 style={{ objectFit: "cover" }}
//               />
//             ) : (
//               <div className="text-center p-5">
//                 <h3 style={{ color: "#3c7aa2" }}>Affiliate Login</h3>
//                 <p className="text-muted">Access your affiliate dashboard</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* RIGHT SIDE - LOGIN FORM */}
//         <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center p-4 p-md-5">
//           <div className="w-100" style={{ maxWidth: "400px" }}>

//             {/* Logo */}
//             <div className="text-center mb-4">
//               <img
//                 src={Logo}
//                 alt="Joyory Logo"
//                 className="mb-3"
//                 style={{ width: "80px" }}
//               />
//             </div>

//             {/* Login Heading */}
//             <h1 className="text-center mb-4 fw-bold" style={{ 
//               fontSize: "28px",
//               color: "#000",
//               letterSpacing: "0.5px"
//             }}>
//               # Login
//             </h1>

//             {/* Form */}
//             <form onSubmit={handleSubmit}>
//               {/* Email Address */}
//               <div className="mb-4">
//                 <label 
//                   className="form-label fw-semibold mb-2" 
//                   style={{ fontSize: "14px", color: "#333" }}
//                 >
//                   Email address
//                 </label>
//                 <input 
//                   type="email" 
//                   className="form-control" 
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="Enter your email"
//                   style={{
//                     padding: "12px 16px",
//                     borderRadius: "8px",
//                     border: "1px solid #ddd",
//                     fontSize: "16px"
//                   }}
//                   required
//                 />
//               </div>

//               {/* Password */}
//               <div className="mb-4">
//                 <label 
//                   className="form-label fw-semibold mb-2" 
//                   style={{ fontSize: "14px", color: "#333" }}
//                 >
//                   Password
//                 </label>
//                 <input 
//                   type="password" 
//                   className="form-control" 
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   placeholder="Enter your password"
//                   style={{
//                     padding: "12px 16px",
//                     borderRadius: "8px",
//                     border: "1px solid #ddd",
//                     fontSize: "16px"
//                   }}
//                   required
//                 />
//               </div>

//               {/* Remember Me & Forgot Password */}
//               <div className="d-flex justify-content-between align-items-center mb-4">
//                 <div className="form-check">
//                   <input
//                     className="form-check-input"
//                     type="checkbox"
//                     name="rememberMe"
//                     id="rememberMe"
//                     checked={formData.rememberMe}
//                     onChange={handleChange}
//                     style={{
//                       width: "18px",
//                       height: "18px",
//                       marginRight: "8px",
//                       borderRadius: "4px"
//                     }}
//                   />
//                   <label 
//                     className="form-check-label" 
//                     htmlFor="rememberMe"
//                     style={{ fontSize: "14px", color: "#555" }}
//                   >
//                     Remember me
//                   </label>
//                 </div>
//                 <div>
//                   <a 
//                     href="#" 
//                     style={{
//                       fontSize: "14px",
//                       color: "#3c7aa2",
//                       textDecoration: "none",
//                       fontWeight: "500"
//                     }}
//                     onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
//                     onMouseLeave={(e) => e.target.style.textDecoration = "none"}
//                   >
//                     Forget password ?
//                   </a>
//                 </div>
//               </div>

//               {/* Login Button */}
//               <div className="mb-4">
//                 <button
//                   type="submit"
//                   className="btn w-100 text-white fw-bold"
//                   style={{ 
//                     background: "#3c7aa2",
//                     padding: "14px",
//                     fontSize: "16px",
//                     borderRadius: "8px",
//                     border: "none",
//                     transition: "background 0.3s"
//                   }}
//                   onMouseEnter={(e) => e.target.style.background = "#2c5a7a"}
//                   onMouseLeave={(e) => e.target.style.background = "#3c7aa2"}
//                 >
//                   Login
//                 </button>
//               </div>

//               {/* Register Link */}
//               <div className="text-center">
//                 <p className="mb-0" style={{ fontSize: "14px", color: "#666" }}>
//                   Don't have an account?{" "}
//                   <Link 
//                     to="/affiliate/signup" // Update this route as needed
//                     style={{
//                       color: "#3c7aa2",
//                       textDecoration: "none",
//                       fontWeight: "600"
//                     }}
//                     onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
//                     onMouseLeave={(e) => e.target.style.textDecoration = "none"}
//                   >
//                     Register
//                   </Link>
//                 </p>
//               </div>
//             </form>

//             {/* Divider (Optional) */}
//             {/* <div className="position-relative my-4">
//               <hr />
//               <div 
//                 className="position-absolute top-50 start-50 translate-middle px-2" 
//                 style={{ 
//                   backgroundColor: "#fff", 
//                   fontSize: "12px",
//                   color: "#999"
//                 }}
//               >
//                 or
//               </div>
//             </div> */}

//             {/* Social Login (Optional) */}
//             {/* <div className="text-center">
//               <p className="mb-3" style={{ fontSize: "14px", color: "#666" }}>
//                 Login with social accounts
//               </p>
//               <div className="d-flex justify-content-center gap-3">
//                 <button
//                   className="btn btn-outline-secondary"
//                   style={{ borderRadius: "50%", width: "44px", height: "44px" }}
//                 >
//                   <i className="fab fa-google"></i>
//                 </button>
//                 <button
//                   className="btn btn-outline-primary"
//                   style={{ borderRadius: "50%", width: "44px", height: "44px" }}
//                 >
//                   <i className="fab fa-facebook-f"></i>
//                 </button>
//                 <button
//                   className="btn btn-outline-info"
//                   style={{ borderRadius: "50%", width: "44px", height: "44px" }}
//                 >
//                   <i className="fab fa-twitter"></i>
//                 </button>
//               </div>
//             </div> */}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Affiliatelogin;



















// // src/pages/Affiliatelogin.jsx
// import React, { useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Link, useNavigate } from "react-router-dom";
// import loginImg from "../assets/login-image.png"; // Hand + bottle image
// import Logo from "../assets/Logo.png";

// const Affiliatelogin = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     rememberMe: false,
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const navigate = useNavigate();

//   // Auto-fill email if "Remember me" was checked before
//   useEffect(() => {
//     const rememberedEmail = localStorage.getItem("rememberedEmail");
//     if (rememberedEmail) {
//       setFormData(prev => ({ ...prev, email: rememberedEmail, rememberMe: true }));
//     }
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//     setError("");
//   };

//   const API_LOGIN_URL = "https://beauty.joyory.com/api/affiliate/login";

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const response = await fetch(API_LOGIN_URL, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: formData.email,
//           password: formData.password,
//         }),
//       });

//       const data = await response.json();

//       if (response.ok && data.success) {
//         // Save auth data
//         localStorage.setItem("joyoryAffiliateToken", data.token);
//         localStorage.setItem("joyoryAffiliateUser", JSON.stringify(data.user));

//         // Handle Remember Me
//         if (formData.rememberMe) {
//           localStorage.setItem("rememberedEmail", formData.email);
//         } else {
//           localStorage.removeItem("rememberedEmail");
//         }

//         // Success feedback
//         alert("Login Successful! Welcome back to Joyory Affiliates");

//         // 100% GUARANTEED REDIRECT (Best method)
//         window.location.href = "/Affiliatedashboard";

//       } else {
//         setError(data.message || "Invalid email or password");
//       }
//     } catch (err) {
//       setError("Network error. Please check your connection and try again.");
//       console.error("Login error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container-fluid p-0">
//       <div className="row g-0 min-vh-100">

//         {/* LEFT SIDE - IMAGE (Hidden on mobile) */}
//         <div className="col-12 col-lg-6 d-none d-lg-block">
//           <img
//             src={loginImg}
//             alt="Joyory Affiliate"
//             className="img-fluid w-100 h-100"
//             style={{ objectFit: "cover" }}
//           />
//         </div>

//         {/* RIGHT SIDE - LOGIN FORM */}
//         <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center bg-white p-4 p-md-5">
//           <div className="w-100" style={{ maxWidth: "420px" }}>

//             {/* Logo + Brand */}
//             <div className="text-center mb-5">
//               <img src={Logo} alt="Joyory" style={{ height: "60px" }} className="mb-3" />
//             </div>

//             <h2 className="text-center fw-bold mb-4" style={{ color: "#1e40af" }}>
//               Login
//             </h2>

//             {/* Error Message */}
//             {error && (
//               <div className="alert alert-danger text-center small py-2">
//                 {error}
//               </div>
//             )}

//             {/* Login Form */}
//             <form onSubmit={handleSubmit}>
//               <div className="mb-4">
//                 <label className="form-label fw-semibold text-primary">Email address</label>
//                 <input
//                   type="email"
//                   name="email"
//                   className="form-control form-control-lg border-0 border-bottom rounded-0 shadow-none"
//                   placeholder="Enter your email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                   style={{ borderBottom: "2px solid #ddd", paddingLeft: 0, fontSize: "16px" }}
//                 />
//               </div>

//               <div className="mb-3">
//                 <label className="form-label fw-semibold text-primary">Password</label>
//                 <input
//                   type="password"
//                   name="password"
//                   className="form-control form-control-lg border-0 border-bottom rounded-0 shadow-none"
//                   placeholder="Enter your password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                   style={{ borderBottom: "2px solid #ddd", paddingLeft: 0, fontSize: "16px" }}
//                 />
//               </div>

//               <div className="d-flex justify-content-between align-items-center mb-4">
//                 <div className="form-check">
//                   <input
//                     className="form-check-input"
//                     type="checkbox"
//                     name="rememberMe"
//                     id="rememberMe"
//                     checked={formData.rememberMe}
//                     onChange={handleChange}
//                   />
//                   <label className="form-check-label text-muted" htmlFor="rememberMe">
//                     Remember me
//                   </label>
//                 </div>
//                 <Link to="/forgot-password" className="text-danger text-decoration-none small fw-medium">
//                   Forgot password?
//                 </Link>
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="btn btn-primary w-100 rounded-pill py-3 fw-bold shadow-lg text-white"
//                 style={{ 
//                   backgroundColor: "#1e40af", 
//                   border: "none",
//                   fontSize: "17px"
//                 }}
//               >
//                 {loading ? (
//                   <>
//                     <span className="spinner-border spinner-border-sm me-2"></span>
//                     Logging in...
//                   </>
//                 ) : (
//                   "Login"
//                 )}
//               </button>
//             </form>

//             <p className="text-center mt-4 text-muted">
//               Don't have an account?{" "}
//               <Link 
//                 to="/affiliate/signup" 
//                 className="text-primary fw-bold text-decoration-none"
//               >
//                 Register
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Affiliatelogin;






























import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import loginImg from "../assets/login-image.png";
import Logo from "../assets/Logo.png";
import "../css/Affiliatelogin.css";

const Affiliatelogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const API_LOGIN_URL = "https://beauty.joyory.com/api/affiliate/login";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setLoading(true);

    try {
      const response = await fetch(API_LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("joyoryAffiliateToken", data.token);
        localStorage.setItem("joyoryAffiliateUser", JSON.stringify(data.user));

        navigate("/Affiliatedashboard");
      } else {
        setApiError(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setApiError("Network error. Try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="container-fluid p-0">
      <div className="row g-0 min-vh-100">

        {/* LEFT SIDE - IMAGE */}
        <div className="col-12 col-lg-6 d-none d-lg-block">
          <img
            src={loginImg}
            alt="Login Banner"
            className="img-fluid w-100 h-100"
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center p-4 p-md-5">
          <div className="w-100" style={{ maxWidth: "410px" }}>

            {/* LOGO */}
            <div className="text-center mb-3">
              <img src={Logo} alt="Joyory Logo" style={{ width: "90px" }} />
            </div>

            {/* TITLE */}
            <h2 className="fw-bold text-center mb-4" style={{ color: "#3c7aa2" }}>
              Login
            </h2>

            {/* ERROR MESSAGE */}
            {apiError && (
              <div className="alert alert-danger py-2 text-center">
                {apiError}
              </div>
            )}

            {/* LOGIN FORM */}
            <form onSubmit={handleSubmit}>
              <label className="form-label fw-semibold mb-1">Email address</label>
              <input
                type="email"
                className="form-control mb-3"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <label className="form-label fw-semibold mb-1">Password</label>
              <input
                type="password"
                className="form-control mb-2"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              {/* Remember + Forgot */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <input
                    type="checkbox"
                    name="rememberMe"
                    className="form-check-input me-2"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  Remember me
                </div>

                <Link className="text-danger" style={{ fontSize: "14px" }}>
                  Forgot password ?
                </Link>
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                className="btn w-100 text-white fw-bold"
                disabled={loading}
                style={{
                  background: "#3c7aa2",
                  padding: "12px",
                  fontSize: "18px",
                }}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* REGISTER */}
            <p className="text-center mt-3">
              Don’t have an account?{" "}
              <Link to="/affiliatesignup" className="fw-bold" style={{ color: "#3c7aa2" }}>
                Register
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Affiliatelogin;
