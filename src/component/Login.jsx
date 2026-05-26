// import React, { useState, useEffect, useContext } from "react";
// import "../css/Login.css";
// import { Link, useNavigate } from "react-router-dom";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import axiosInstance from "../utils/axiosInstance.js";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { UserContext } from "./UserContext";
// import Logo from "../assets/logos.webp";


// const Login = () => {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const [passwordType, setPasswordType] = useState("password");
//   const navigate = useNavigate();

//   const { loginUser } = useContext(UserContext);

//   const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

//   // ✅ Google Sign-In
//   useEffect(() => {
//     /* global google */
//     if (window.google) {
//       google.accounts.id.initialize({
//         client_id: GOOGLE_CLIENT_ID,
//         callback: handleGoogleResponse,
//       });
//       google.accounts.id.renderButton(
//         document.getElementById("google-login-btn"),
//         { theme: "outline", size: "large" }
//       );
//       google.accounts.id.prompt();
//     }
//   }, []);

//   const handleGoogleResponse = async (response) => {
//     try {
//       const googleToken = response.credential;
//       const res = await axiosInstance.post(
//         "/api/user/google-login",
//         { token: googleToken },
//         { withCredentials: true }
//       );

//       if (res.data?.user) {
//         loginUser(res.data.user);
//         toast.success("Google login successful 🎉");
//         navigate("/");
//       } else {
//         toast.error("Google login failed. Try again.");
//       }
//     } catch (err) {
//       console.error("Google login error:", err);
//       toast.error("Google login failed.");
//     }
//   };

//   // ✅ Password show/hide
//   const togglePassword = () => {
//     setPasswordType((prev) => (prev === "password" ? "text" : "password"));
//   };

//   // ✅ Input change handler
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };



  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const { email, password } = formData;

//     if (!email.trim() || !password.trim()) {
//       toast.error("Please enter both email and password");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await axiosInstance.post(
//         "/api/user/login",
//         {
//           email: email.trim().toLowerCase(),
//           password,
//         },
//         { withCredentials: true }
//       );

//       // ✅ If login successful
//       if (res.status === 200 && res.data?.user) {
//         loginUser(res.data.user);
//         toast.success("Welcome back! Redirecting to homepage...");

//         // Optional cookie for client-side fallback
//         const expiryDate = new Date();
//         expiryDate.setDate(expiryDate.getDate() + 7);
//         document.cookie = `token=1; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`;

//         setTimeout(() => {
//           navigate("/", { replace: true });
//         }, 800);
//       } else {
//         toast.error(res.data?.message || "Invalid login credentials");
//       }
//     } catch (err) {
//       console.error("❌ Login error:", err);

//       // ✅ Handle unverified email (from backend 403)
//       if (
//         err.response?.status === 403 &&
//         err.response?.data?.message?.includes("not verified")
//       ) {
//         toast.error("Your email is not verified yet. Redirecting to verification page...");

//         setTimeout(() => {
//           try {
//             navigate("/otp", {
//               state: { email: formData.email.trim().toLowerCase() },
//               replace: true,
//             });
//           } catch {
//             window.location.href = `/otp?email=${encodeURIComponent(
//               formData.email.trim().toLowerCase()
//             )}`;
//           }
//         }, 800);
//       } else {
//         toast.error(err.response?.data?.message || "Server error");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };



//   return (
//     <>
//     <div className="login-bg">
//       <div className="login-right">
//         <div className="login-card">
//           <div className="signup text-center">
//             {/* <h2>Sign In</h2> */}

//            <img src={Logo} alt="Login Background" className="img-fluid w-50" style={{marginTop:'-25px'}}/>
//           </div>

//           <form onSubmit={handleSubmit}>
//             <label className="mb-2 fs-5 fw-normal">User Name</label>
//             <input
//               type="email"
//               name="email"
//               placeholder="Enter your email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />

//             <label className="mt-4 mb-2 fs-5 fw-normal">Password</label>
//             <div className="password-field">
//               <input
//                 type={passwordType}
//                 name="password"
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//               />
//               <span onClick={togglePassword} className="password-toggle pt-2">
//                 {passwordType === "password" ? (
//                   <i className="bi bi-eye-slash"></i>
//                 ) : (
//                   <i className="bi bi-eye"></i>
//                 )}
//               </span>
//             </div>

//             <div className="forgot d-flex align-items-center justify-content-between">

//               <div className="d-flex align-items-center">
//                 <input type="checkbox" className="big-checkbox" />
//                 <div>
//                   <p className="p-0 mt-3 pt-1 fs-6 ms-1">Rememebr me</p>
//                 </div>
//               </div>
//               <Link to="/ForgotPassword" className="mt-1">Forgot Password?</Link>
//             </div>

//             <button className="login-Btn" type="submit" disabled={loading}>
//               {loading ? "Signing In..." : "Login"}
//             </button>
//           </form>

//           {/* <div className="social-icons">
            
//             <button
//               className="signup-btn "
//               onClick={() => navigate("/signup")}
//             >
//               Sign Up
//             </button>
//           </div> */}
//         </div>
//       </div>

//       <ToastContainer position="top-right" autoClose={3000} />

//     </div>
//     </>
//   );
// };

// export default Login;












  

import React, { useState, useEffect, useContext } from "react";
import "../css/Login.css";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import axiosInstance from "../utils/axiosInstance.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "./UserContext";
import Logo from "../assets/logos.webp";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const { loginUser } = useContext(UserContext);

  // Load saved credentials on component mount (only to pre-fill form)
  useEffect(() => {
    const savedCredentials = localStorage.getItem("userCredentials");
    if (savedCredentials) {
      try {
        const { email, password, remember } = JSON.parse(savedCredentials);
        if (remember) {
          setFormData({ email: email || "", password: password || "" });
          setRememberMe(true);
        }
      } catch (error) {
        console.error("Error loading saved credentials:", error);
        localStorage.removeItem("userCredentials");
      }
    }
  }, []);

  // Handle Google Sign-In
  useEffect(() => {
    /* global google */
    if (window.google) {
      const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });
      google.accounts.id.renderButton(
        document.getElementById("google-login-btn"),
        { theme: "outline", size: "large" }
      );
      google.accounts.id.prompt();
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      const googleToken = response.credential;
      const res = await axiosInstance.post(
        "/api/user/google-login",
        { token: googleToken },
        { withCredentials: true }
      );

      if (res.data?.user) {
        loginUser(res.data.user);
        toast.success("Google login successful 🎉");
        navigate("/");
      } else {
        toast.error("Google login failed. Try again.");
      }
    } catch (err) {
      console.error("Google login error:", err);
      toast.error("Google login failed.");
    }
  };

  // ✅ Password show/hide
  const togglePassword = () => {
    setPasswordType((prev) => (prev === "password" ? "text" : "password"));
  };

  // ✅ Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Remember me toggle handler
  const handleRememberMe = (e) => {
    const isChecked = e.target.checked;
    setRememberMe(isChecked);
    
    // Clear saved credentials if unchecked
    if (!isChecked) {
      localStorage.removeItem("userCredentials");
      toast.info("Credentials will not be saved for next time");
    } else {
      toast.info("Credentials will be saved for next time");
    }
  };

  // ✅ Save credentials to localStorage
  const saveCredentials = (email, password) => {
    if (rememberMe) {
      const credentials = {
        email: email.trim().toLowerCase(),
        password: password,
        remember: true,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem("userCredentials", JSON.stringify(credentials));
      toast.info("Credentials saved for next login");
    } else {
      // Clear if "Remember Me" is not checked
      localStorage.removeItem("userCredentials");
    }
  };

  // ✅ Clear saved credentials
  const clearSavedCredentials = () => {
    localStorage.removeItem("userCredentials");
    setRememberMe(false);
    setFormData({ email: "", password: "" });
    toast.info("Saved credentials cleared");
  };

  // ✅ Main login handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await axiosInstance.post(
        "/api/user/login",
        {
          email: email.trim().toLowerCase(),
          password,
        },
        { withCredentials: true }
      );

      // ✅ If login successful
      if (res.status === 200 && res.data?.user) {
        // Save credentials if "Remember Me" is checked
        saveCredentials(email, password);
        
        loginUser(res.data.user);
        toast.success("Welcome back! Redirecting to homepage...");

        // Optional cookie for client-side fallback
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);
        document.cookie = `token=1; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`;

        setTimeout(() => {
          navigate("/", { replace: true });
        }, 800);
      } else {
        toast.error(res.data?.message || "Invalid login credentials");
      }
    } 
    
    
    catch (err) {
      console.error("❌ Login error:", err);

      // ✅ Handle unverified email (from backend 403)
      if (
        err.response?.status === 403 &&
        err.response?.data?.message?.includes("not verified")
      ) {
        toast.error("Your email is not verified yet. Redirecting to verification page...");

        setTimeout(() => {
          try {
            navigate("/otp", {
              state: { email: formData.email.trim().toLowerCase() },
              replace: true,
            });
          } catch {
            window.location.href = `/otp?email=${encodeURIComponent(
              formData.email.trim().toLowerCase()
            )}`;
          }
        }, 800);
      } else {
        toast.error(err.response?.data?.message || "Server error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-bg page-title-main-name">
        <div className="login-right">
          <div className="login-card">
            <div className="signup text-center">
              <img 
                src={Logo} 
                alt="Login Background" 
                className="img-fluid w-50" 
                style={{marginTop:'-25px'}}
              />
            </div>

            <form onSubmit={handleSubmit}>
              <label className="mb-2 fs-5 fw-normal">User Name</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="username"
              />

              <label className="mt-4 mb-2 fs-5 fw-normal">Password</label>
              <div className="password-field">
                <input
                  type={passwordType}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />
                <span onClick={togglePassword} className="password-toggle pt-2">
                  {passwordType === "password" ? (
                    <i className="bi bi-eye-slash"></i>
                  ) : (
                    <i className="bi bi-eye"></i>
                  )}
                </span>
              </div>

              <div className="forgot d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <input 
                    type="checkbox" 
                    className="big-checkbox" 
                    checked={rememberMe}
                    onChange={handleRememberMe}
                    id="rememberMe"
                  />
                  <label htmlFor="rememberMe" className="p-0 mt-1 fs-6 ms-1 cursor-pointer">
                    Remember me
                  </label>
                </div>
                <Link to="/ForgotPassword" className="mt-1">Forgot Password?</Link>
              </div>

              <button className="login-Btn" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Signing In...
                  </>
                ) : (
                  "Login"
                )}
              </button>

              <Link to="/Signup" className="mt-4 text-center text-decoration-none text-white">Don’t have an account? Register </Link>

            </form>

            {/* Show clear credentials button only when there are saved credentials */}
            {/* {localStorage.getItem("userCredentials") && (
              <div className="text-center mt-3">
                <button 
                  className="btn btn-sm btn-outline-secondary"
                  onClick={clearSavedCredentials}
                  type="button"
                  style={{ 
                    fontSize: '12px', 
                    padding: '2px 8px',
                    borderColor: '#dc3545',
                    color: '#dc3545'
                  }}
                >
                  <i className="bi bi-trash me-1"></i>
                  Clear Saved Credentials
                </button>
              </div>
            )} */}

            {/* Optional: Show message when credentials are pre-filled */}
            {/* {rememberMe && formData.email && (
              <div className="text-center mt-2">
                <small className="text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  Credentials pre-filled from previous login
                </small>
              </div>
            )} */}
          </div>
        </div>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </>
  );
};

export default Login;