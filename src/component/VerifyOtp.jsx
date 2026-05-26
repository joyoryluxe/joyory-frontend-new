// import React, { useState } from "react";
// import axios from "axios";
// import { useLocation, useNavigate } from "react-router-dom";

// const VerifyOTP = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const email = state?.email || "";
//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleVerify = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!otp.trim()) {
//       setError("Please enter the OTP");
//       return;
//     }

//     try {
//       setLoading(true);
//       await axios.post("https://beauty.joyory.com/api/security/verify-otp", {
//         email,
//         otp
//       });
//       navigate("/reset-password", { state: { email, otp } });
//     } catch (err) {
//       setError(err.response?.data?.message || "Invalid OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
//       <div className="card p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
//         <h4>Verify OTP</h4>
//         <p className="text-muted">Enter the OTP sent to {email}</p>
//         <form onSubmit={handleVerify}>
//           <input
//             type="text"
//             className="form-control mb-3"
//             placeholder="Enter OTP"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             required
//           />
//           <button className="btn btn-success w-100" type="submit" disabled={loading}>
//             {loading ? "Verifying..." : "Verify OTP"}
//           </button>
//         </form>
//         {error && <p className="text-danger mt-2">{error}</p>}
//       </div>
//     </div>
//   );
// };

// export default VerifyOTP;





// import React, { useState } from "react";
// import axios from "axios";
// import { useLocation, useNavigate } from "react-router-dom";

// const VerifyOTP = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();

//   const [email, setEmail] = useState(state?.email || "");
//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleVerify = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!email.trim()) {
//       setError("Please enter your email");
//       return;
//     }
//     if (!otp.trim()) {
//       setError("Please enter the OTP");
//       return;
//     }

//     try {
//       setLoading(true);
//       await axios.post("https://beauty.joyory.com/api/security/verify-otp", {
//         email,
//         otp
//       });
//       navigate("/reset-password", { state: { email, otp } });
//     } catch (err) {
//       setError(err.response?.data?.message || "Invalid OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
//       <div className="card p-4 shadow w-100" style={{ maxWidth: "400px" }}>
//         <h4 className="mb-3">Verify OTP</h4>
//         <p className="text-muted">Enter your email and the OTP sent to you</p>
//         <form onSubmit={handleVerify}>
//           <input
//             type="email"
//             className="form-control mb-3"
//             placeholder="Enter Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//           <input
//             type="text"
//             className="form-control mb-3"
//             placeholder="Enter OTP"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             required
//           />
//           <button className="btn btn-success w-100" type="submit" disabled={loading}>
//             {loading ? "Verifying..." : "Verify OTP"}
//           </button>
//         </form>
//         {error && <p className="text-danger mt-2">{error}</p>}
//       </div>
//     </div>
//   );
// };

// export default VerifyOTP;






// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useLocation, useNavigate } from "react-router-dom";

// const VerifyOTP = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();

//   const [email, setEmail] = useState(state?.email || "");
//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);

//   useEffect(() => {
//     if (!state?.email) {
//       navigate("/forgot-password");
//     }
//   }, [state, navigate]);

//   // SEND OTP FUNCTION
//   const handleGetOTP = async () => {
//     setError("");
//     if (!email.trim()) {
//       setError("Please enter your email");
//       return;
//     }
//     try {
//       setLoading(true);
//       await axios.post(
//         "https://beauty.joyory.com/api/security/send-otp",
//         { email },
//         { headers: { "Content-Type": "application/json" } }
//       );
//       setOtpSent(true);
//     } catch (err) {
//       setError(err.response?.data?.message || "User not found");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // VERIFY OTP FUNCTION
//   const handleVerify = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!email.trim()) return setError("Please enter your email");
//     if (!otp.trim()) return setError("Please enter the OTP");

//     try {
//       setLoading(true);
//       await axios.post(
//         "https://beauty.joyory.com/api/security/verify-otp",
//         { email, otp },
//         { headers: { "Content-Type": "application/json" } }
//       );
//       navigate("/reset-password", { state: { email, otp } });
//     } catch (err) {
//       setError(err.response?.data?.message || "Invalid OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
//       <div className="card p-4 shadow w-100" style={{ maxWidth: "400px" }}>
//         <h4 className="mb-3">Verify OTP</h4>
//         <p className="text-muted">Enter your email and get the OTP</p>
        
//         {/* EMAIL INPUT */}
//         <input
//           type="email"
//           className="form-control mb-3"
//           placeholder="Enter Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />

//         {/* GET OTP BUTTON */}
//         <button
//           className="btn btn-primary w-100 mb-3"
//           onClick={handleGetOTP}
//           disabled={loading}
//         >
//           {loading ? "Sending OTP..." : "Get OTP"}
//         </button>

//         {/* SHOW OTP FIELD ONLY IF SENT */}
//         {otpSent && (
//           <form onSubmit={handleVerify}>
//             <input
//               type="text"
//               className="form-control mb-3"
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               required
//             />
//             <button
//               className="btn btn-success w-100"
//               type="submit"
//               disabled={loading}
//             >
//               {loading ? "Verifying..." : "Verify OTP"}
//             </button>
//           </form>
//         )}

//         {error && <p className="text-danger mt-2">{error}</p>}
//       </div>
//     </div>
//   );
// };

// export default VerifyOTP;



















// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useLocation, useNavigate } from "react-router-dom";

// const VerifyOTP = () => {
//   const { state } = useLocation();
//   // const navigate = useNavigate();

//   const navigate = useNavigate(); 

//   const [email, setEmail] = useState(state?.email || "");
//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);

//   useEffect(() => {
//     if (!state?.email) {
//       navigate("/forgot-password");
//     }
//   }, [state, navigate]);

//   // SEND OTP FUNCTION
//   const handleGetOTP = async () => {
//     setError("");
//     if (!email.trim()) {
//       setError("Please enter your email");
//       return;
//     }
//     try {
//       setLoading(true);
//       await axios.post(
//         "https://beauty.joyory.com/api/security/send-otp",
//         { email },
//         { headers: { "Content-Type": "application/json" } }
//       );
//       setOtpSent(true);
//     } catch (err) {
//       setError(err.response?.data?.message || "User not found");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // VERIFY OTP FUNCTION
//   const handleVerify = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!email.trim()) return setError("Please enter your email");
//     if (!otp.trim()) return setError("Please enter the OTP");

//     try {
//       setLoading(true);
//       await axios.post(
//         "https://beauty.joyory.com/api/security/verify-otp",
//         { email, otp },
//         { headers: { "Content-Type": "application/json" } }
//       );

//       // ✅ Instantly redirect to login after success
//       setOtp(""); // clear otp field before redirect
//       navigate("/Login");
//     } catch (err) {
//       setError(err.response?.data?.message || "Invalid OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
//       <div className="card p-4 shadow w-100" style={{ maxWidth: "400px" }}>
//         <h4 className="mb-3">Verify OTP</h4>
//         <p className="text-muted">Enter your email and get the OTP</p>

//         {/* EMAIL INPUT */}
//         <input
//           type="email"
//           className="form-control mb-3"
//           placeholder="Enter Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />

//         {/* GET OTP BUTTON */}
//         <button
//           className="btn btn-primary w-100 mb-3"
//           onClick={handleGetOTP}
//           disabled={loading}
//         >
//           {loading ? "Sending OTP..." : "Get OTP"}
//         </button>

//         {/* SHOW OTP FIELD ONLY IF SENT */}
//         {otpSent && (
//           <form onSubmit={handleVerify}>
//             <input
//               type="text"
//               className="form-control mb-3"
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               required
//             />
//             <button
//               className="btn btn-success w-100"
//               type="submit"
//               disabled={loading}
//             >
//               {loading ? "Verifying..." : "Verify OTP"}
//             </button>
//           </form>
//         )}

//         {error && <p className="text-danger mt-2">{error}</p>}
//       </div>
//     </div>
//   );
// };

// export default VerifyOTP;



























// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useLocation, useNavigate } from "react-router-dom";

// const VerifyOTP = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();

//   const [email, setEmail] = useState(state?.email || "");
//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);

//   useEffect(() => {
//     if (!state?.email) {
//       navigate("/forgot-password");
//     }
//   }, [state, navigate]);

//   // SEND OTP FUNCTION
//   const handleGetOTP = async () => {
//     setError("");
//     if (!email.trim()) {
//       setError("Please enter your email");
//       return;
//     }
//     try {
//       setLoading(true);
//       await axios.post(
//         "https://beauty.joyory.com/api/security/send-otp",
//         { email },
//         { headers: { "Content-Type": "application/json" } }
//       );
//       setOtpSent(true);
//     } catch (err) {
//       setError(err.response?.data?.message || "User not found");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // VERIFY OTP FUNCTION
//   const handleVerify = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!email.trim()) return setError("Please enter your email");
//     if (!otp.trim()) return setError("Please enter the OTP");

//     try {
//       setLoading(true);
//       await axios.post(
//         "https://beauty.joyory.com/api/security/verify-otp",
//         { email, otp },
//         { headers: { "Content-Type": "application/json" } }
//       );

//       // ✅ Instantly redirect to login after success
//       setOtp(""); // clear otp field before redirect
//       navigate("/login"); // fixed case
//     } catch (err) {
//       setError(err.response?.data?.message || "Invalid OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
//       <div className="card p-4 shadow w-100" style={{ maxWidth: "400px" }}>
//         <h4 className="mb-3">Verify OTP</h4>
//         <p className="text-muted">Enter your email and get the OTP</p>

//         {/* EMAIL INPUT */}
//         <input
//           type="email"
//           className="form-control mb-3"
//           placeholder="Enter Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />

//         {/* GET OTP BUTTON */}
//         <button
//           className="btn btn-primary w-100 mb-3"
//           onClick={handleGetOTP}
//           disabled={loading}
//         >
//           {loading ? "Sending OTP..." : "Get OTP"}
//         </button>

//         {/* SHOW OTP FIELD ONLY IF SENT */}
//         {otpSent && (
//           <form onSubmit={handleVerify}>
//             <input
//               type="text"
//               className="form-control mb-3"
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               required
//             />
//             <button
//               className="btn btn-success w-100"
//               type="submit"
//               disabled={loading}
//             >
//               {loading ? "Verifying..." : "Verify OTP"}
//             </button>
//           </form>
//         )}

//         {error && <p className="text-danger mt-2">{error}</p>}
//       </div>
//     </div>
//   );
// };

// export default VerifyOTP;


































// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useLocation, useNavigate } from "react-router-dom";

// const VerifyOTP = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();

//   const [email, setEmail] = useState(state?.email || "");
//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);

//   useEffect(() => {
//     if (!state?.email) {
//       navigate("/forgot-password");
//     }
//   }, [state, navigate]);

//   // SEND OTP FUNCTION
//   const handleGetOTP = async () => {
//     setError("");
//     if (!email.trim()) {
//       setError("Please enter your email");
//       return;
//     }
//     try {
//       setLoading(true);
//       await axios.post(
//         "https://beauty.joyory.com/api/security/send-otp",
//         { email },
//         { headers: { "Content-Type": "application/json" } }
//       );
//       setOtpSent(true);
//     } catch (err) {
//       setError(err.response?.data?.message || "User not found");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // VERIFY OTP FUNCTION
//   const handleVerify = async () => {
//     setError("");

//     if (!email.trim()) return setError("Please enter your email");
//     if (!otp.trim()) return setError("Please enter the OTP");

//     try {
//       setLoading(true);
//       await axios.post(
//         "https://beauty.joyory.com/api/security/verify-otp",
//         { email, otp },
//         { headers: { "Content-Type": "application/json" } }
//       );

//       // ✅ Instantly redirect to login after success
//       setOtp(""); // clear otp field before redirect
//       navigate("/login");
//     } catch (err) {
//       setError(err.response?.data?.message || "Invalid OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
//       <div className="card p-4 shadow w-100" style={{ maxWidth: "400px" }}>
//         <h4 className="mb-3">Verify OTP</h4>
//         <p className="text-muted">Enter your email and get the OTP</p>

//         {/* EMAIL INPUT */}
//         <input
//           type="email"
//           className="form-control mb-3"
//           placeholder="Enter Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />

//         {/* GET OTP BUTTON */}
//         <button
//           className="btn btn-primary w-100 mb-3"
//           onClick={handleGetOTP}
//           disabled={loading}
//         >
//           {loading ? "Sending OTP..." : "Get OTP"}
//         </button>

//         {/* SHOW OTP FIELD ONLY IF SENT */}
//         {otpSent && (
//           <>
//             <input
//               type="text"
//               className="form-control mb-3"
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               required
//             />
//             <button
//               className="btn btn-success w-100"
//               onClick={handleVerify} // ✅ changed from onSubmit form
//               disabled={loading}
//             >
//               {loading ? "Verifying..." : "Verify OTP"}
//             </button>
//           </>
//         )}

//         {error && <p className="text-danger mt-2">{error}</p>}
//       </div>
//     </div>
//   );
// };

// export default VerifyOTP;
















// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useLocation, useNavigate } from "react-router-dom";


// const VerifyOTP = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();
  

//   const [email, setEmail] = useState(state?.email || "");
//   console.log(email);

//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);
  

//   useEffect(() => {
//     if (!state?.email) {
//       navigate("/forgot-password");
//     }
//   }, [state, navigate]);

//   // SEND OTP FUNCTION
//   const handleGetOTP = async () => {
//     setError("");
//     if (!email.trim()) {
//       setError("Please enter your email");
//       return;
//     }
//     try {
//       setLoading(true);
//       await axios.post(
//         "https://beauty.joyory.com/api/security/send-otp",
//         { email },
//         { headers: { "Content-Type": "application/json" } }
//       );
//       setOtpSent(true); // ✅ switch to OTP screen
//     } catch (err) {
//       setError(err.response?.data?.message || "User not found");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // VERIFY OTP FUNCTION
//   const handleVerify = async () => {
//     setError("");

//     if (!otp.trim()) return setError("Please enter the OTP");

//     try {
//       setLoading(true);
//       await axios.post(
//         "https://beauty.joyory.com/api/security/verify-otp",
//         { email, otp },
//         { headers: { "Content-Type": "application/json" } }
//       );

//       // ✅ Redirect after success
//       setOtp("");
//       navigate("/login");
//     } catch (err) {
//       setError(err.response?.data?.message || "Invalid OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
//       <div className="card p-4 shadow w-100" style={{ maxWidth: "400px" }}>
//         <h4 className="mb-3">Verify OTP</h4>
//         <p className="text-muted">
//           {!otpSent ? "Enter your email to get the OTP" : "Enter the OTP sent to your email"}
//         </p>

//         {/* STEP 1: EMAIL INPUT + GET OTP */}
//         {!otpSent && (
//           <div>
//             <input
//               type="email"
//               className="form-control mb-3"
//               placeholder="Enter Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//             <button
//               className="btn btn-primary w-100 mb-3"
//               onClick={handleGetOTP}
//               disabled={loading}
//             >
//               {loading ? "Sending OTP..." : "Get OTP"}
//             </button>
//           </div>
//         )}

//         {/* STEP 2: OTP INPUT + VERIFY */}
//         {otpSent && (
//           <div>
//             <input
//               type="text"
//               className="form-control mb-3"
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               required
//             />
//             <button
//               className="btn btn-success w-100"
//               onClick={handleVerify}
//               disabled={loading}
//             >
//               {loading ? "Verifying..." : "Verify OTP"}
//             </button>
//           </div>
//         )}

//         {error && <p className="text-danger mt-2">{error}</p>}
//       </div>
//     </div>
//   );
// };

// export default VerifyOTP;





























import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyOTP = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(state?.email || "");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    // If no email found in state, go to ForgotPassword
    if (!state?.email) {
      navigate("/ForgotPassword");
    }
  }, [state, navigate]);

  // ✅ Send OTP
  const handleGetOTP = async () => {
    if (!email.trim()) return toast.error("Please enter your email");
    try {
      setLoading(true);
      await axios.post(
        "https://beauty.joyory.com/api/security/send-otp",
        { email },
        { headers: { "Content-Type": "application/json" } }
      );
      setOtpSent(true);
      toast.success("OTP sent successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "User not found");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify OTP
  const handleVerify = async () => {
    if (!otp.trim()) return toast.error("Please enter the OTP");

    try {
      setLoading(true);
      await axios.post(
        "https://beauty.joyory.com/api/security/verify-otp",
        { email, otp },
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("Email verified successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow w-100" style={{ maxWidth: "400px" }}>
        <h4 className="mb-3 text-center">Verify OTP</h4>
        <p className="text-muted text-center">
          {!otpSent
            ? "Enter your email to get the OTP"
            : `Enter the OTP sent to ${email}`}
        </p>

        {!otpSent ? (
          <>
            <input
              type="email"
              className="form-control mb-3"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              className="btn btn-primary w-100 mb-3"
              onClick={handleGetOTP}
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Get OTP"}
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button
              className="btn btn-success w-100"
              onClick={handleVerify}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default VerifyOTP;
