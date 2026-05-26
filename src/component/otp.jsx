// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "../css/otp/otp.css";

// const Otp = () => {
//   const [otp, setOtp] = useState(["", "", "", ""]);
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [resendTimer, setResendTimer] = useState(0);
//   const [verified, setVerified] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);

//   const navigate = useNavigate();

//   // Handle OTP input changes
//   const handleChange = (value, index) => {
//     if (verified) return;
//     if (value.length <= 1) {
//       const newOtp = [...otp];
//       newOtp[index] = value;
//       setOtp(newOtp);
//       if (value && index < otp.length - 1) {
//         document.getElementById(`otp-${index + 1}`).focus();
//       }
//     }
//   };

//   // Countdown effect for resend
//   useEffect(() => {
//     let timer;
//     if (resendTimer > 0) {
//       timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
//     }
//     return () => clearTimeout(timer);
//   }, [resendTimer]);

//   // Send OTP
//   const sendOtp = async () => {
//     if (!email.trim()) {
//       setMessage("Please enter Email.");
//       return;
//     }

//     try {
//       setLoading(true);
//       setMessage("");
//       const response = await axios.post(
//         // "https://beauty.joyory.com/api/security/send-otp",
//         "https://beauty.joyory.com/api/security/send-otp",
//         {
//           //   email: email,
//           //   type: "user",
//           // }
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//           body: JSON.stringify({ email: formData.email }),
//         }
//       );
//       setMessage(response.data.message || "OTP sent successfully ✅");
//       setOtpSent(true);
//       setResendTimer(30);
//     } catch (error) {
//       setMessage(error.response?.data?.message || "Failed to send OTP ❌");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Verify OTP
//   const verifyOtp = async () => {
//     const enteredOtp = otp.join("");
//     if (enteredOtp.length !== 4) {
//       setMessage("Please enter the complete OTP.");
//       return;
//     }

//     try {
//       setLoading(true);
//       setMessage("");
//       const response = await axios.post(
//         "https://beauty.joyory.com/api/security/verify-otp",
//         {
//           email: email.trim(),
//           otp: enteredOtp,
//         }
//       );

//       // ✅ Redirect after success (don’t rely only on response.data.success)
//       if (response.status === 200) {
//         setMessage("OTP verified successfully ✅");
//         setVerified(true);
//         setTimeout(() => {
//           navigate("/login"); // redirect to login
//         }, 2000);
//       } else {
//         setMessage(response.data.message || "Invalid OTP ❌");
//       }
//     } catch (error) {
//       setMessage(error.response?.data?.message || "Failed to verify OTP ❌");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="otp-bg d-flex align-items-center justify-content-center min-vh-100 auth-bg">
//       <div className="otp-card text-center p-4">
//         <h3 className="fw-bold mb-3">OTP Verification</h3>
//         <p>Get started & grab best offers on top brands!</p>

//         {/* Email Input (show only before OTP is sent) */}
//         {!otpSent && (
//           <div className="mb-4 mt-3 otp-input-group">
//             <input
//               type="text"
//               className="form-control me-2 text-center mx-auto d-inline-block"
//               placeholder="Use Email Id"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               disabled={verified}
//             />
//             <button
//               className="mt-4 btn btn-primary rounded-pill px-4"
//               onClick={sendOtp}
//               disabled={loading || resendTimer > 0 || verified}
//             >
//               {loading
//                 ? "Sending..."
//                 : resendTimer > 0
//                   ? `Resend in ${resendTimer}s`
//                   : "Get OTP"}
//             </button>
//           </div>
//         )}

//         {/* OTP Section – show only after OTP is sent */}
//         {otpSent && (
//           <>
//             <h5 className="fw-bold">Enter OTP</h5>
//             <p>We have sent a one-time password to your email</p>

//             {/* OTP Input Fields */}
//             <div className="d-flex justify-content-center gap-2">
//               {otp.map((digit, index) => (
//                 <input
//                   key={index}
//                   id={`otp-${index}`}
//                   type="text"
//                   value={digit}
//                   onChange={(e) => handleChange(e.target.value, index)}
//                   className="otp-box text-center"
//                   maxLength="1"
//                   disabled={verified}
//                 />
//               ))}
//             </div>

//             {/* Resend OTP */}
//             <div className="mb-3 text-end">
//               <button
//                 className="btn btn-link p-0 text-white"
//                 onClick={sendOtp}
//                 disabled={resendTimer > 0 || verified}
//               >
//                 {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
//               </button>
//             </div>

//             {/* Verify OTP Button */}
//             <button
//               className="btn btn-success rounded-pill px-4"
//               onClick={verifyOtp}
//               disabled={loading || verified}
//             >
//               {loading ? "Verifying..." : "Verify OTP"}
//             </button>
//           </>
//         )}

//         {/* Message */}
//         {message && <p className="mt-3 text-info">{message}</p>}
//       </div>
//     </div>
//   );
// };

// export default Otp;










// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "../css/otp/otp.css";

// const Otp = () => {
//   const [otp, setOtp] = useState(["", "", "", ""]);
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [resendTimer, setResendTimer] = useState(0);
//   const [verified, setVerified] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);

//   const navigate = useNavigate();

//   // Handle OTP input changes
//   const handleChange = (value, index) => {
//     if (verified) return;
//     if (value.length <= 1) {
//       const newOtp = [...otp];
//       newOtp[index] = value;
//       setOtp(newOtp);
//       if (value && index < otp.length - 1) {
//         document.getElementById(`otp-${index + 1}`).focus();
//       }
//     }
//   };

//   // Countdown effect for resend
//   useEffect(() => {
//     let timer;
//     if (resendTimer > 0) {
//       timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
//     }
//     return () => clearTimeout(timer);
//   }, [resendTimer]);

//   // Send OTP
//   // const sendOtp = async () => {
//   //   if (!email.trim()) {
//   //     setMessage("Please enter your Email.");
//   //     return;
//   //   }

//   //   try {
//   //     setLoading(true);
//   //     setMessage("");

//   //     const response = await axios.post(
//   //       "https://beauty.joyory.com/api/security/send-otp",
//   //       { email: email.trim() }, // ✅ send email
//   //       { withCredentials: true } // ✅ send cookies
//   //     );

//   //     setMessage(response.data.message || "OTP sent successfully ✅");
//   //     setOtpSent(true);
//   //     setResendTimer(30);
//   //   } catch (error) {
//   //     console.error("Send OTP error:", error.response || error);
//   //     setMessage(
//   //       error.response?.data?.message || "Failed to send OTP ❌"
//   //     );
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };


//   const sendOtp = async () => {
//     if (!email.trim()) {
//       setMessage("Please enter your Email.");
//       return;
//     }

//     try {
//       setLoading(true);
//       setMessage("");

//       const response = await axios.post(
//         "https://beauty.joyory.com/api/security/send-otp",
//         { email: email.trim() },  // ✅ send email here
//         { withCredentials: true } // ✅ include HTTP-only cookies
//       );

//       setMessage(response.data.message || "OTP sent successfully ✅");
//       setOtpSent(true);
//       setResendTimer(30);
//     } catch (error) {
//       console.error("Send OTP error:", error.response || error);
//       setMessage(error.response?.data?.message || "Failed to send OTP ❌");
//     } finally {
//       setLoading(false);
//     }
//   };


//   // Verify OTP
//   const verifyOtp = async () => {
//     const enteredOtp = otp.join("");
//     if (enteredOtp.length !== 4) {
//       setMessage("Please enter the complete OTP.");
//       return;
//     }

//     try {
//       setLoading(true);
//       setMessage("");

//       const response = await axios.post(
//         "https://beauty.joyory.com/api/security/verify-otp",
//         { email: email.trim(), otp: enteredOtp },
//         { withCredentials: true }
//       );

//       if (response.status === 200) {
//         setMessage("OTP verified successfully ✅");
//         setVerified(true);
//         setTimeout(() => navigate("/login"), 2000);
//       } else {
//         setMessage(response.data.message || "Invalid OTP ❌");
//       }
//     } catch (error) {
//       console.error("Verify OTP error:", error.response || error);
//       setMessage(error.response?.data?.message || "Failed to verify OTP ❌");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="otp-bg d-flex align-items-center justify-content-center min-vh-100 auth-bg">
//       <div className="otp-card text-center p-4">
//         <h3 className="fw-bold mb-3">OTP Verification</h3>
//         <p>Get started & grab best offers on top brands!</p>

//         {/* Email Input */}
//         {!otpSent && (
//           <div className="mb-4 mt-3 otp-input-group">
//             <input
//               type="text"
//               className="form-control me-2 text-center mx-auto d-inline-block"
//               placeholder="Enter Email Id"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               disabled={verified}
//             />
//             <button
//               className="mt-4 btn btn-primary rounded-pill px-4"
//               onClick={sendOtp}
//               disabled={loading || resendTimer > 0 || verified}
//             >
//               {loading
//                 ? "Sending..."
//                 : resendTimer > 0
//                   ? `Resend in ${resendTimer}s`
//                   : "Get OTP"}
//             </button>
//           </div>
//         )}

//         {/* OTP Input Section */}
//         {otpSent && (
//           <>
//             <h5 className="fw-bold">Enter OTP</h5>
//             <p>We have sent a one-time password to your email</p>
//             <div className="d-flex justify-content-center gap-2">
//               {otp.map((digit, index) => (
//                 <input
//                   key={index}
//                   id={`otp-${index}`}
//                   type="text"
//                   value={digit}
//                   onChange={(e) => handleChange(e.target.value, index)}
//                   className="otp-box text-center"
//                   maxLength="1"
//                   disabled={verified}
//                 />
//               ))}
//             </div>

//             <div className="mb-3 text-end">
//               <button
//                 className="btn btn-link p-0 text-white"
//                 onClick={sendOtp}
//                 disabled={resendTimer > 0 || verified}
//               >
//                 {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
//               </button>
//             </div>

//             <button
//               className="btn btn-success rounded-pill px-4"
//               onClick={verifyOtp}
//               disabled={loading || verified}
//             >
//               {loading ? "Verifying..." : "Verify OTP"}
//             </button>
//           </>
//         )}

//         {message && <p className="mt-3 text-info">{message}</p>}
//       </div>
//     </div>
//   );
// };

// export default Otp;






// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "../css/otp/otp.css";

// const Otp = () => {
//   const [otp, setOtp] = useState(["", "", "", ""]);
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [resendTimer, setResendTimer] = useState(0);
//   const [verified, setVerified] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);
//   // const [sendOtp, setsendOtp] = useState(true);

//   const navigate = useNavigate();

//   // Countdown effect for resend
//   useEffect(() => {
//     let timer;
//     if (resendTimer > 0) {
//       timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
//     }
//     return () => clearTimeout(timer);
//   }, [resendTimer]);

//   // Handle OTP input changes
//   const handleChange = (value, index) => {
//     if (verified) return;
//     if (value.length <= 1) {
//       const newOtp = [...otp];
//       newOtp[index] = value;
//       setOtp(newOtp);
//       if (value && index < otp.length - 1) {
//         document.getElementById(`otp-${index + 1}`)?.focus();
//       }
//     }
//   };

//   // ✅ Send OTP
//   // const sendOtp = async () => {
//   //   if (!email.trim()) {
//   //     setMessage("Please enter your Email.");
//   //     return;
//   //   }
//   //   try {
//   //     setLoading(true);
//   //     setMessage("");
//   //     const response = await axios.post(
//   //       "https://beauty.joyory.com/api/security/send-otp",
//   //       { email: email.trim() },
//   //       { withCredentials: true }
//   //     );

//   //     setMessage(response.data.message || "OTP sent successfully ✅");
//   //     setOtpSent(true);
//   //     setResendTimer(30);
//   //   } catch (error) {
//   //     console.error("Send OTP error:", error.response || error);
//   //     setMessage(error.response?.data?.message || "Failed to send OTP ❌");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };


//   const sendOtp = async () => {
//     if (!email.trim()) {
//       setMessage("Please enter Email.");
//       return;
//     }

//     try {
//       setLoading(true);
//       setMessage("");

//       const response = await axios.post(
//         "https://beauty.joyory.com/api/security/send-otp",
//         { email, type: "user" }, // correct payload
//         { withCredentials: true } // send HTTP-only cookies
//       );

//       setMessage(response.data.message || "OTP sent successfully ✅");
//       setOtpSent(true);
//       setResendTimer(30);
//     } catch (error) {
//       console.error("Send OTP error:", error);
//       setMessage(error.response?.data?.message || "Failed to send OTP ❌");
//     } finally {
//       setLoading(false);
//     }
//   };


//   // ✅ Verify OTP
//   const verifyOtp = async () => {
//     const enteredOtp = otp.join("");
//     if (enteredOtp.length !== 4) {
//       setMessage("Please enter the complete OTP.");
//       return;
//     }
//     try {
//       setLoading(true);
//       setMessage("");
//       const response = await axios.post(
//         "https://beauty.joyory.com/api/security/verify-otp",
//         { email: email.trim(), otp: enteredOtp },
//         { withCredentials: true }
//       );

//       if (response.status === 200) {
//         setMessage("OTP verified successfully ✅");
//         setVerified(true);
//         setTimeout(() => navigate("/login"), 2000);
//       } else {
//         setMessage(response.data.message || "Invalid OTP ❌");
//       }
//     } catch (error) {
//       console.error("Verify OTP error:", error.response || error);
//       setMessage(error.response?.data?.message || "Failed to verify OTP ❌");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="otp-bg d-flex align-items-center justify-content-center min-vh-100 auth-bg">
//       <div className="otp-card text-center p-4">
//         <h3 className="fw-bold mb-3">OTP Verification</h3>
//         <p>Get started & grab best offers on top brands!</p>

//         {!otpSent && (
//           <div className="mb-4 mt-3 otp-input-group">
//             <input
//               type="text"
//               className="form-control me-2 text-center mx-auto d-inline-block"
//               placeholder="Use Email Id"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               disabled={verified}
//             />
//             <button
//               className="mt-4 btn btn-primary rounded-pill px-4"
//               onClick={sendOtp}
//               disabled={loading || resendTimer > 0 || verified}
//             >
//               {loading
//                 ? "Sending..."
//                 : resendTimer > 0
//                   ? `Resend in ${resendTimer}s`
//                   : "Get OTP"}
//             </button>
//           </div>
//         )}

//         {otpSent && (
//           <>
//             <h5 className="fw-bold">Enter OTP</h5>
//             <p>We have sent a one-time password to your email</p>
//             <div className="d-flex justify-content-center gap-2">
//               {otp.map((digit, index) => (
//                 <input
//                   key={index}
//                   id={`otp-${index}`}
//                   type="text"
//                   value={digit}
//                   onChange={(e) => handleChange(e.target.value, index)}
//                   className="otp-box text-center"
//                   maxLength="1"
//                   disabled={verified}
//                 />
//               ))}
//             </div>
//             <div className="mb-3 text-end">
//               <button
//                 className="btn btn-link p-0 text-white"
//                 onClick={sendOtp}
//                 disabled={resendTimer > 0 || verified}
//               >
//                 {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
//               </button>
//             </div>
//             <button
//               className="btn btn-success rounded-pill px-4"
//               onClick={verifyOtp}
//               disabled={loading || verified}
//             >
//               {loading ? "Verifying..." : "Verify OTP"}
//             </button>
//           </>
//         )}

//         {message && <p className="mt-3 text-info">{message}</p>}
//       </div>
//     </div>
//   );
// };

// export default Otp;








// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "../css/otp/otp.css";

// const Otp = () => {
//   const [otp, setOtp] = useState(["", "", "", ""]);
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [resendTimer, setResendTimer] = useState(0);
//   const [verified, setVerified] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);

//   const navigate = useNavigate();

//   // Handle OTP input changes
//   const handleChange = (value, index) => {
//     if (verified) return;
//     if (value.length <= 1) {
//       const newOtp = [...otp];
//       newOtp[index] = value;
//       setOtp(newOtp);
//       if (value && index < otp.length - 1) {
//         document.getElementById(`otp-${index + 1}`).focus();
//       }
//     }
//   };

//   // Countdown effect for resend
//   useEffect(() => {
//     let timer;
//     if (resendTimer > 0) {
//       timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
//     }
//     return () => clearTimeout(timer);
//   }, [resendTimer]);

//   // Send OTP
//   const sendOtp = async () => {
//     if (!email.trim()) {
//       setMessage("Please enter your email.");
//       return;
//     }

//     try {
//       setLoading(true);
//       setMessage("");

//       const response = await axios.post(
//         "https://beauty.joyory.com/api/security/send-otp",
//         { email, type: "user" }, // correct payload
//         { withCredentials: true } // send HTTP-only cookies
//       );

//       setMessage(response.data.message || "OTP sent successfully ✅");
//       setOtpSent(true);
//       setResendTimer(30);
//     } catch (error) {
//       console.error("Send OTP error:", error);
//       setMessage(
//         error.response?.data?.message || "Failed to send OTP. Please try again ❌"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Verify OTP
//   const verifyOtp = async () => {
//     const enteredOtp = otp.join("");
//     if (enteredOtp.length !== 4) {
//       setMessage("Please enter the complete OTP.");
//       return;
//     }

//     try {
//       setLoading(true);
//       setMessage("");

//       const response = await axios.post(
//         "https://beauty.joyory.com/api/security/verify-otp",
//         { email, otp: enteredOtp },
//         { withCredentials: true }
//       );

//       if (response.status === 200) {
//         setMessage("OTP verified successfully ✅");
//         setVerified(true);
//         setTimeout(() => navigate("/login"), 2000);
//       } else {
//         setMessage(response.data.message || "Invalid OTP ❌");
//       }
//     } catch (error) {
//       console.error("Verify OTP error:", error);
//       setMessage(error.response?.data?.message || "Failed to verify OTP ❌");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="otp-bg d-flex align-items-center justify-content-center min-vh-100 auth-bg">
//       <div className="otp-card text-center p-4">
//         <h3 className="fw-bold mb-3">OTP Verification</h3>
//         <p>Get started & grab best offers on top brands!</p>

//         {/* Email Input (show only before OTP is sent) */}
//         {!otpSent && (
//           <div className="mb-4 mt-3 otp-input-group">
//             <input
//               type="email"
//               className="form-control me-2 text-center mx-auto d-inline-block"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               disabled={verified}
//             />
//             <button
//               className="mt-4 btn btn-primary rounded-pill px-4"
//               onClick={sendOtp}
//               disabled={loading || resendTimer > 0 || verified}
//             >
//               {loading
//                 ? "Sending..."
//                 : resendTimer > 0
//                 ? `Resend in ${resendTimer}s`
//                 : "Get OTP"}
//             </button>
//           </div>
//         )}

//         {/* OTP Section – show only after OTP is sent */}
//         {otpSent && (
//           <>
//             <h5 className="fw-bold">Enter OTP</h5>
//             <p>We have sent a one-time password to your email</p>

//             {/* OTP Input Fields */}
//             <div className="d-flex justify-content-center gap-2">
//               {otp.map((digit, index) => (
//                 <input
//                   key={index}
//                   id={`otp-${index}`}
//                   type="text"
//                   value={digit}
//                   onChange={(e) => handleChange(e.target.value, index)}
//                   className="otp-box text-center"
//                   maxLength="1"
//                   disabled={verified}
//                 />
//               ))}
//             </div>

//             {/* Resend OTP */}
//             <div className="mb-3 text-end">
//               <button
//                 className="btn btn-link p-0 text-white"
//                 onClick={sendOtp}
//                 disabled={resendTimer > 0 || verified}
//               >
//                 {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
//               </button>
//             </div>

//             {/* Verify OTP Button */}
//             <button
//               className="btn btn-success rounded-pill px-4"
//               onClick={verifyOtp}
//               disabled={loading || verified}
//             >
//               {loading ? "Verifying..." : "Verify OTP"}
//             </button>
//           </>
//         )}

//         {/* Message */}
//         {message && <p className="mt-3 text-info">{message}</p>}
//       </div>
//     </div>
//   );
// };

// export default Otp;

















// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate, useLocation } from "react-router-dom";
// import "../css/otp/otp.css";

// const Otp = () => {
//   const [otp, setOtp] = useState(["", "", "", ""]);
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [resendTimer, setResendTimer] = useState(0);
//   const [verified, setVerified] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);

//   const navigate = useNavigate();
//   const location = useLocation();

//   // ✅ Auto-fill email if redirected from Login page
//   useEffect(() => {
//     if (location.state?.email) {
//       const redirectedEmail = location.state.email;
//       setEmail(redirectedEmail);
//       sendOtp(redirectedEmail); // Automatically send OTP
//     }
//   }, [location.state]);

//   // ✅ Countdown timer for resend button
//   useEffect(() => {
//     let timer;
//     if (resendTimer > 0) {
//       timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
//     }
//     return () => clearTimeout(timer);
//   }, [resendTimer]);

//   // ✅ Handle OTP input boxes
//   const handleChange = (value, index) => {
//     if (verified) return;
//     if (value.length <= 1) {
//       const newOtp = [...otp];
//       newOtp[index] = value;
//       setOtp(newOtp);
//       if (value && index < otp.length - 1) {
//         document.getElementById(`otp-${index + 1}`).focus();
//       }
//     }
//   };

//   // ✅ Send OTP function
//   const sendOtp = async (passedEmail) => {
//     const targetEmail = passedEmail || email;

//     if (!targetEmail.trim()) {
//       setMessage("Please enter your email.");
//       return;
//     }

//     try {
//       setLoading(true);
//       setMessage("");

//       const response = await axios.post(
//         "https://beauty.joyory.com/api/security/send-otp",
//         { email: targetEmail, type: "user" },
//         { withCredentials: true }
//       );

//       setMessage(response.data.message || "OTP sent successfully ✅");
//       setOtpSent(true);
//       setResendTimer(30);
//     } catch (error) {
//       console.error("Send OTP error:", error);
//       setMessage(error.response?.data?.message || "Failed to send OTP ❌");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Verify OTP
//   const verifyOtp = async () => {
//     const enteredOtp = otp.join("");
//     if (enteredOtp.length !== 4) {
//       setMessage("Please enter the complete OTP.");
//       return;
//     }

//     try {
//       setLoading(true);
//       setMessage("");

//       const response = await axios.post(
//         "https://beauty.joyory.com/api/security/verify-otp",
//         { email, otp: enteredOtp },
//         { withCredentials: true }
//       );

//       if (response.status === 200) {
//         setMessage("OTP verified successfully ✅");
//         setVerified(true);
//         setTimeout(() => navigate("/login"), 2000);
//       } else {
//         setMessage(response.data.message || "Invalid OTP ❌");
//       }
//     } catch (error) {
//       console.error("Verify OTP error:", error);
//       setMessage(error.response?.data?.message || "Failed to verify OTP ❌");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Auto-focus first OTP input when OTP is sent
//   useEffect(() => {
//     if (otpSent) {
//       document.getElementById("otp-0")?.focus();
//     }
//   }, [otpSent]);

//   return (
//     <div className="otp-bg d-flex align-items-center justify-content-center min-vh-100 auth-bg">
//       <div className="otp-card text-center p-4">
//         <h3 className="fw-bold mb-3">OTP Verification</h3>
//         <p>Get started & grab best offers on top brands!</p>

//         {/* Email Input (show only before OTP is sent) */}
//         {!otpSent && (
//           <div className="mb-4 mt-3 otp-input-group">
//             <input
//               type="email"
//               className="form-control me-2 text-center mx-auto d-inline-block"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               disabled={verified}
//             />
//             <button
//               className="mt-4 btn btn-primary rounded-pill px-4"
//               onClick={() => sendOtp()}
//               disabled={loading || resendTimer > 0 || verified}
//             >
//               {loading
//                 ? "Sending..."
//                 : resendTimer > 0
//                 ? `Resend in ${resendTimer}s`
//                 : "Get OTP"}
//             </button>
//           </div>
//         )}

//         {/* OTP Section – show only after OTP is sent */}
//         {otpSent && (
//           <>
//             <h5 className="fw-bold">Enter OTP</h5>
//             <p>We’ve sent a one-time password to your email</p>

//             {/* OTP Input Fields */}
//             <div className="d-flex justify-content-center gap-2">
//               {otp.map((digit, index) => (
//                 <input
//                   key={index}
//                   id={`otp-${index}`}
//                   type="text"
//                   value={digit}
//                   onChange={(e) => handleChange(e.target.value, index)}
//                   className="otp-box text-center"
//                   maxLength="1"
//                   disabled={verified}
//                 />
//               ))}
//             </div>

//             {/* Resend OTP */}
//             <div className="mb-3 text-end">
//               <button
//                 className="btn btn-link p-0 text-white"
//                 onClick={() => sendOtp()}
//                 disabled={resendTimer > 0 || verified}
//               >
//                 {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
//               </button>
//             </div>

//             {/* Verify OTP Button */}
//             <button
//               className="btn btn-success rounded-pill px-4"
//               onClick={verifyOtp}
//               disabled={loading || verified}
//             >
//               {loading ? "Verifying..." : "Verify OTP"}
//             </button>
//           </>
//         )}

//         {/* Message */}
//         {message && <p className="mt-3 text-info">{message}</p>}
//       </div>
//     </div>
//   );
// };

// export default Otp;




















import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/otp/otp.css";

const Otp = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [verified, setVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
  if (location.state?.email) {
    const redirectedEmail = location.state.email;
    setEmail(redirectedEmail);

    // OTP already sent by backend during signup
    setOtpSent(true);
    setResendTimer(30);
  }
}, [location.state]);

  // Countdown for resend button
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  // Handle OTP input boxes
  const handleChange = (value, index) => {
    if (verified) return;
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  // Send OTP function
  const sendOtp = async (passedEmail) => {
    const targetEmail = passedEmail || email;

    if (!targetEmail.trim()) {
      setMessage("Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await axios.post(
        "https://beauty.joyory.com/api/security/send-otp",
        { email: targetEmail, type: "user" },
        { withCredentials: true }
      );

      setMessage(response.data.message || "OTP sent successfully ✅");
      setOtpSent(true);
      setResendTimer(30);
    } catch (error) {
      console.error("Send OTP error:", error);
      const msg = error.response?.data?.message || "Failed to send OTP ❌";
      setMessage(msg.includes("NaN") ? msg.replace("NaN", "0") : msg);
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 4) {
      setMessage("Please enter the complete 4-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await axios.post(
        "https://beauty.joyory.com/api/security/verify-otp",
        { email, otp: enteredOtp },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setMessage("OTP verified successfully ✅");
        setVerified(true);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        let msg = response.data?.message || "Invalid OTP ❌";
        msg = msg.includes("NaN") ? msg.replace("NaN", "0") : msg;
        setMessage(msg);
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      let msg = error.response?.data?.message || "Failed to verify OTP ❌";
      msg = msg.includes("NaN") ? msg.replace("NaN", "0") : msg;
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // Auto-focus first OTP input when OTP is sent
  useEffect(() => {
    if (otpSent) {
      document.getElementById("otp-0")?.focus();
    }
  }, [otpSent]);

  return (
    <div className="otp-bg d-flex align-items-center justify-content-center min-vh-100 auth-bg page-title-main-name">
      <div className="otp-card text-center p-4">
        <h3 className="fw-bold mb-3">OTP Verification</h3>
        <p>Get started & grab best offers on top brands!</p>

        {/* Email Input – only before OTP is sent */}
        {!otpSent && (
          <div className="mb-4 mt-3 otp-input-group">
            <input
              type="email"
              className="form-control me-2 text-center mx-auto d-inline-block"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={verified}
            />
            <button
              className="mt-4 btn btn-primary rounded-pill px-4"
              onClick={() => sendOtp()}
              disabled={loading || resendTimer > 0 || verified}
            >
              {loading
                ? "Sending..."
                : resendTimer > 0
                ? `Resend in ${resendTimer}s`
                : "Get OTP"}
            </button>
          </div>
        )}

        {/* OTP Section – only after OTP is sent */}
        {otpSent && (
          <>
            <h5 className="fw-bold">Enter OTP</h5>
            <p>We’ve sent a one-time password to your email</p>

            <div className="d-flex justify-content-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  className="otp-box text-center"
                  maxLength="1"
                  disabled={verified}
                />
              ))}
            </div>

            {/* Resend OTP */}
            <div className="mb-3 text-end">
              <button
                className="btn btn-link p-0 text-white"
                onClick={() => sendOtp()}
                disabled={resendTimer > 0 || verified}
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
              </button>
            </div>

            {/* Verify OTP */}
            <button
              className="btn btn-success rounded-pill px-4"
              onClick={verifyOtp}
              disabled={loading || verified}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {/* Message */}
        {message && <p className="mt-3 text-info">{message}</p>}
      </div>
    </div>
  );
};

export default Otp;
