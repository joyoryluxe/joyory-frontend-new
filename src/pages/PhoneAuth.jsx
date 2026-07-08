// import React, { useState, useEffect, useRef, useContext } from "react";
// import { useNavigate, useSearchParams, Link, useLocation } from "react-router-dom";
// import { toast } from "react-toastify";
// import { motion, AnimatePresence } from "framer-motion";
// import { UserContext } from "../context/UserContext";
// import axiosInstance from "../utils/axiosInstance.js";
// import Logo from "../assets/logo.png";
// import "../styles/PhoneAuth.css";

// const PhoneAuth = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [searchParams] = useSearchParams();
//   const redirectUrl = searchParams.get("redirectUrl") || location.state?.from || "/";
//   const { loginUser } = useContext(UserContext);

//   // Flow steps: "phone" | "otp" | "profile"
//   const [step, setStep] = useState("phone");
//   const [loading, setLoading] = useState(false);

//   // Step 1: Phone input
//   const [phone, setPhone] = useState("");
//   const [termsAccepted, setTermsAccepted] = useState(false);

//   // Step 2: OTP input
//   const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
//   const otpInputsRef = useRef([]);
//   const [resendTimer, setResendTimer] = useState(0);

//   // Step 3: Profile form fields
//   const [profileData, setProfileData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     gender: "",
//     dob: "",
//     referralCode: "",
//   });
//   const [referralApplied, setReferralApplied] = useState(false);

//   // Animated header text taglines
//   const animatedTexts = [
//     "Personalised beauty recommendations",
//     "₹100 off your first order, T&C apply",
//     "Explore luxury cosmetics & skincare",
//     "Virtual try-on & shade finder tools"
//   ];
//   const [textIndex, setTextIndex] = useState(0);

//   useEffect(() => {
//     const textInterval = setInterval(() => {
//       setTextIndex((prev) => (prev + 1) % animatedTexts.length);
//     }, 3000);
//     return () => clearInterval(textInterval);
//   }, []);

//   // Pre-populate referral/promo code from URL query parameters
//   useEffect(() => {
//     const code = searchParams.get("ref") || searchParams.get("referralCode") || searchParams.get("promo") || searchParams.get("promoCode");
//     if (code) {
//       setProfileData((prev) => ({ ...prev, referralCode: code.toUpperCase() }));
//       setReferralApplied(true);
//     }
//   }, [searchParams]);

//   // Timer countdown handler
//   useEffect(() => {
//     let interval = null;
//     if (resendTimer > 0) {
//       interval = setInterval(() => {
//         setResendTimer((prev) => prev - 1);
//       }, 1000);
//     } else {
//       clearInterval(interval);
//     }
//     return () => clearInterval(interval);
//   }, [resendTimer]);

//   // Handler to send OTP (Step 1)
//   const handleSendOtp = async (e) => {
//     if (e) e.preventDefault();
//     if (!/^[6-9][0-9]{9}$/.test(phone)) {
//       toast.error("Please enter a valid 10-digit Indian phone number starting with 6-9.");
//       return;
//     }
//     if (!termsAccepted) {
//       toast.warn("You must agree to the Terms of Use and Privacy Policy.");
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await axiosInstance.post("/api/user/otp/send", { phone });
//       if (res.data?.success) {
//         toast.success(res.data.message || "OTP sent successfully via WhatsApp.");
//         setStep("otp");
//         setResendTimer(30); // 30 seconds countdown
//         // Reset OTP inputs
//         setOtpDigits(["", "", "", ""]);
//         setTimeout(() => {
//           if (otpInputsRef.current[0]) otpInputsRef.current[0].focus();
//         }, 100);
//       } else {
//         toast.error(res.data?.message || "Failed to send OTP. Please try again.");
//       }
//     } catch (err) {
//       console.error("Error sending OTP:", err);
//       toast.error(err.response?.data?.message || "Server error occurred. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Resend OTP action
//   const handleResendOtp = async () => {
//     if (resendTimer > 0) return;
//     try {
//       setLoading(true);
//       const res = await axiosInstance.post("/api/user/otp/send", { phone });
//       if (res.data?.success) {
//         toast.success("A new OTP has been sent.");
//         setResendTimer(30);
//         setOtpDigits(["", "", "", ""]);
//         if (otpInputsRef.current[0]) otpInputsRef.current[0].focus();
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to resend OTP.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // OTP inputs keyboard events handling
//   const handleOtpDigitChange = (index, value) => {
//     if (isNaN(value)) return; // Only allow digits

//     const newDigits = [...otpDigits];
//     newDigits[index] = value.substring(value.length - 1); // Get last typed character
//     setOtpDigits(newDigits);

//     // Auto focus next input if filled
//     if (value && index < 3) {
//       otpInputsRef.current[index + 1].focus();
//     }
//   };

//   const handleOtpKeyDown = (index, e) => {
//     // Backspace key shifts focus to previous field
//     if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
//       otpInputsRef.current[index - 1].focus();
//     }
//   };

//   const handleOtpPaste = (e) => {
//     e.preventDefault();
//     const pasteData = e.clipboardData.getData("text").trim();
//     if (!/^\d{4}$/.test(pasteData)) return;

//     const digits = pasteData.split("");
//     setOtpDigits(digits);
//     otpInputsRef.current[3].focus();
//   };

//   // Handler to verify OTP (Step 2)
//   const handleVerifyOtp = async (e) => {
//     if (e) e.preventDefault();
//     const otp = otpDigits.join("");
//     if (otp.length !== 4) {
//       toast.error("Please enter the 4-digit OTP.");
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await axiosInstance.post("/api/user/otp/verify", { phone, otp });
//       const data = res.data;

//       if (data.status === "new_user") {
//         toast.success(data.message || "OTP verified successfully!");
//         setStep("profile");
//       } else if (data.status === "existing_user") {
//         toast.success(data.message || "Login successful!");

//         // Persist token in cookie for UserContext
//         const expiryDate = new Date();
//         expiryDate.setDate(expiryDate.getDate() + 7);
//         document.cookie = `token=1; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`;

//         // Update Auth Context & Navigate
//         loginUser({ ...data.user, authenticated: true });
//         navigate(redirectUrl, { replace: true });
//       } else {
//         toast.error("Unexpected response from server.");
//       }
//     } catch (err) {
//       console.error("Error verifying OTP:", err);
//       toast.error(err.response?.data?.message || "Incorrect OTP. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Profile fields inputs change handler
//   const handleProfileChange = (e) => {
//     const { name, value } = e.target;
//     setProfileData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handler for referral/promo code apply action
//   const handleApplyReferral = (e) => {
//     e.preventDefault();
//     if (!profileData.referralCode.trim()) {
//       toast.warn("Please enter a referral code.");
//       return;
//     }
//     // We will validate it during the final profile completion submission,
//     // but we can show a success indicator to the user.
//     setReferralApplied(true);
//     toast.info(`Invitation code "${profileData.referralCode.toUpperCase()}" entered! It will be verified when you save.`);
//   };

//   const handleRemoveReferral = (e) => {
//     e.preventDefault();
//     setProfileData((prev) => ({ ...prev, referralCode: "" }));
//     setReferralApplied(false);
//     toast.info("Referral code removed.");
//   };

//   // Handler for final Profile Completion submission (Step 3)
//   const handleCompleteProfile = async (e) => {
//     if (e) e.preventDefault();
//     const { firstName, lastName, email, gender, dob, referralCode } = profileData;

//     if (!firstName.trim() || !lastName.trim()) {
//       toast.error("Please enter both First Name and Last Name.");
//       return;
//     }
//     if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       toast.error("Please enter a valid email address.");
//       return;
//     }

//     // Format fields for backend
//     const fullName = `${firstName.trim()} ${lastName.trim()}`;
//     let formattedDob = undefined;
//     if (dob) {
//       // Input date is YYYY-MM-DD, we need to convert it to DD/MM/YYYY
//       const parts = dob.split("-");
//       if (parts.length === 3) {
//         formattedDob = `${parts[2]}/${parts[1]}/${parts[0]}`;
//       }
//     }

//     try {
//       setLoading(true);
//       const code = referralCode.trim().toUpperCase();
//       const isHexReferral = /^[0-9A-F]{8}$/.test(code);

//       const payload = {
//         name: fullName,
//         email: email.trim().toLowerCase(),
//         gender: gender || undefined,
//         dob: formattedDob,
//         referralCode: (code && isHexReferral) ? code : undefined,
//         promo: (code && !isHexReferral) ? code : undefined
//       };

//       const res = await axiosInstance.post("/api/user/otp/complete-profile", payload);
//       const data = res.data;

//       if (data.success) {
//         toast.success(data.message || "Profile completed successfully!");

//         // Persist token in cookie for UserContext
//         const expiryDate = new Date();
//         expiryDate.setDate(expiryDate.getDate() + 7);
//         document.cookie = `token=1; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`;

//         // Update Auth Context & Navigate
//         loginUser({ ...data.user, authenticated: true });
//         navigate(redirectUrl, { replace: true });
//       } else {
//         toast.error(data.message || "Failed to complete profile.");
//       }
//     } catch (err) {
//       console.error("Error completing profile:", err);
//       toast.error(err.response?.data?.message || "Server error completing profile. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Animation settings for motion transitions
//   const animationVariants = {
//     hidden: { opacity: 0, x: 20 },
//     visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeInOut" } },
//     exit: { opacity: 0, x: -20, transition: { duration: 0.2, ease: "easeInOut" } }
//   };

//   return (
//     <div className="phone-auth-container">
//       <div className="phone-auth-backdrop" />

//       <div className="phone-auth-card">
//         {/* Close Button redirects back to homepage */}
//         <button className="phone-auth-close-btn" onClick={() => navigate("/")}>
//           &times;
//         </button>

//         {/* Branding header */}
//         <div className="phone-auth-header-sec">
//           <div className="phone-auth-logo">
//             <img src={Logo} alt="Joyory Luxe" className="phone-auth-logo-img" />
//           </div>
//           <div style={{ height: "28px", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "8px" }}>
//             <AnimatePresence mode="wait">
//               <motion.p
//                 key={textIndex}
//                 initial={{ opacity: 0, y: 8 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -8 }}
//                 transition={{ duration: 0.3 }}
//                 className="phone-auth-promo-text"
//               >
//                 {animatedTexts[textIndex]}
//               </motion.p>
//             </AnimatePresence>
//           </div>
//         </div>

//         {/* Step panels managed inside standard AnimatePresence */}
//         <div className="phone-auth-body-sec">
//           <AnimatePresence mode="wait">
//             {step === "phone" && (
//               <motion.div
//                 key="phone-step"
//                 variants={animationVariants}
//                 initial="hidden"
//                 animate="visible"
//                 exit="exit"
//               >
//                 {/* <h2 className="phone-auth-title">Log In Or Sign Up</h2> */}

//                 <h2 className="phone-auth-title">
//                   Welcome to Joyory
//                 </h2>

//                 <p className="phone-auth-subtitle">
//                   Discover luxury beauty curated for you
//                 </p>
//                 <form onSubmit={handleSendOtp}>
//                   <div className="phone-input-wrapper">
//                     <span className="phone-prefix">+91</span>
//                     <span className="phone-divider">|</span>
//                     <input
//                       type="tel"
//                       placeholder="Enter Phone Number"
//                       className="phone-text-input"
//                       value={phone}
//                       onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
//                       maxLength={10}
//                       disabled={loading}
//                       required
//                     />
//                   </div>

//                   <div className="terms-agreement-wrapper" onClick={() => setTermsAccepted(!termsAccepted)}>
//                     <input
//                       type="checkbox"
//                       className="terms-checkbox"
//                       checked={termsAccepted}
//                       onChange={() => { }} // Controlled via parent click
//                       disabled={loading}
//                     />
//                     <p className="terms-text">
//                       By continuing, you agree to Joyory's{" "}
//                       <Link to="/terms" className="terms-link" onClick={(e) => e.stopPropagation()}>
//                         Terms of Use
//                       </Link>{" "}
//                       and{" "}
//                       <Link to="/privacy-policy" className="terms-link" onClick={(e) => e.stopPropagation()}>
//                         Privacy Policy
//                       </Link>
//                       .
//                     </p>
//                   </div>

//                   <button
//                     type="submit"
//                     className="phone-auth-submit-btn"
//                     disabled={loading || phone.length !== 10 || !termsAccepted}
//                   >
//                     {loading ? (
//                       <>
//                         <span className="spinner-inline" /> Sending OTP...
//                       </>
//                     ) : (
//                       "Send OTP"
//                     )}
//                   </button>
//                 </form>
//               </motion.div>
//             )}

//             {step === "otp" && (
//               <motion.div
//                 key="otp-step"
//                 variants={animationVariants}
//                 initial="hidden"
//                 animate="visible"
//                 exit="exit"
//               >
//                 <h2 className="phone-auth-title">Verify OTP</h2>
//                 <p className="otp-subtitle-sec">
//                   OTP has been sent to <span className="otp-phone-highlight">+91 {phone}</span>
//                   <button className="otp-edit-phone-btn" onClick={() => setStep("phone")}>
//                     Edit Number
//                   </button>
//                 </p>

//                 <form onSubmit={handleVerifyOtp}>
//                   <div className="otp-inputs-row">
//                     {otpDigits.map((digit, idx) => (
//                       <input
//                         key={idx}
//                         ref={(el) => (otpInputsRef.current[idx] = el)}
//                         type="text"
//                         maxLength={1}
//                         className="otp-digit-field"
//                         value={digit}
//                         onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
//                         onKeyDown={(e) => handleOtpKeyDown(idx, e)}
//                         onPaste={idx === 0 ? handleOtpPaste : undefined}
//                         disabled={loading}
//                         autoFocus={idx === 0}
//                       />
//                     ))}
//                   </div>

//                   <div className="otp-timer-row">
//                     {resendTimer > 0 ? (
//                       <div>
//                         Resend OTP in <span className="otp-timer-count">00:{resendTimer < 10 ? `0${resendTimer}` : resendTimer}</span>
//                       </div>
//                     ) : (
//                       <button
//                         type="button"
//                         className="otp-resend-btn"
//                         onClick={handleResendOtp}
//                         disabled={loading}
//                       >
//                         Resend OTP
//                       </button>
//                     )}
//                   </div>

//                   <button
//                     type="submit"
//                     className="phone-auth-submit-btn"
//                     disabled={loading || otpDigits.some((d) => d === "")}
//                   >
//                     {loading ? (
//                       <>
//                         <span className="spinner-inline" /> Verifying...
//                       </>
//                     ) : (
//                       "Verify & Proceed"
//                     )}
//                   </button>
//                 </form>
//               </motion.div>
//             )}

//             {step === "profile" && (
//               <motion.div
//                 key="profile-step"
//                 variants={animationVariants}
//                 initial="hidden"
//                 animate="visible"
//                 exit="exit"
//               >
//                 <h2 className="phone-auth-title">One last step...</h2>
//                 <p className="profile-subtext">Complete your details to set up your profile.</p>

//                 <form onSubmit={handleCompleteProfile} className="profile-form-grid">
//                   <div className="profile-name-row">
//                     <div className="profile-field-group">
//                       <label className="profile-label profile-label-required">First Name</label>
//                       <input
//                         type="text"
//                         name="firstName"
//                         placeholder="Enter First Name"
//                         className="profile-input-control"
//                         value={profileData.firstName}
//                         onChange={handleProfileChange}
//                         disabled={loading}
//                         required
//                       />
//                     </div>
//                     <div className="profile-field-group">
//                       <label className="profile-label profile-label-required">Last Name</label>
//                       <input
//                         type="text"
//                         name="lastName"
//                         placeholder="Enter Last Name"
//                         className="profile-input-control"
//                         value={profileData.lastName}
//                         onChange={handleProfileChange}
//                         disabled={loading}
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div className="profile-field-group">
//                     <label className="profile-label profile-label-required">Email Address</label>
//                     <input
//                       type="email"
//                       name="email"
//                       placeholder="Enter Email Address"
//                       className="profile-input-control"
//                       value={profileData.email}
//                       onChange={handleProfileChange}
//                       disabled={loading}
//                       required
//                     />
//                   </div>

//                   <div className="profile-field-group">
//                     <label className="profile-label">Gender</label>
//                     <div className="profile-gender-row">
//                       {["female", "male", "other"].map((g) => (
//                         <div
//                           key={g}
//                           className={`profile-gender-card-btn ${profileData.gender === g ? "selected" : ""}`}
//                           onClick={() => !loading && setProfileData((prev) => ({ ...prev, gender: g }))}
//                         >
//                           {g === "other" ? "Non Binary" : g.charAt(0).toUpperCase() + g.slice(1)}
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="profile-field-group">
//                     <label className="profile-label">Date of Birth</label>
//                     <div className="date-input-container">
//                       <input
//                         type="date"
//                         name="dob"
//                         className="profile-input-control"
//                         value={profileData.dob}
//                         onChange={handleProfileChange}
//                         disabled={loading}
//                       />
//                     </div>
//                   </div>

//                   <div className="profile-field-group">
//                     <div className="referral-box-container">
//                       <div className="referral-subtext">Earn points & discounts</div>
//                       <label className="profile-label">Enter Referral Code</label>
//                       <div className="referral-input-wrapper">
//                         <input
//                           type="text"
//                           name="referralCode"
//                           placeholder="Paste referral / invite code here"
//                           className="profile-input-control"
//                           value={profileData.referralCode}
//                           onChange={handleProfileChange}
//                           disabled={loading || referralApplied}
//                         />
//                         {referralApplied ? (
//                           <button
//                             type="button"
//                             className="referral-apply-btn"
//                             onClick={handleRemoveReferral}
//                             disabled={loading}
//                             style={{ color: "#E23E3E" }}
//                           >
//                             Remove
//                           </button>
//                         ) : (
//                           <button
//                             type="button"
//                             className="referral-apply-btn"
//                             onClick={handleApplyReferral}
//                             disabled={loading || !profileData.referralCode.trim()}
//                           >
//                             Apply
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   <button
//                     type="submit"
//                     className="phone-auth-submit-btn"
//                     disabled={loading || !profileData.firstName.trim() || !profileData.lastName.trim() || !profileData.email.trim()}
//                     style={{ marginTop: "10px" }}
//                   >
//                     {loading ? (
//                       <>
//                         <span className="spinner-inline" /> Saving Profile...
//                       </>
//                     ) : (
//                       "Save"
//                     )}
//                   </button>
//                 </form>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PhoneAuth;












import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useSearchParams, Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { UserContext } from "../context/UserContext";
import axiosInstance from "../utils/axiosInstance.js";
import Logo from "../assets/logo.png";
import "../styles/PhoneAuth.css";

const PhoneAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirectUrl") || location.state?.from || "/";
  const { loginUser } = useContext(UserContext);

  // Flow steps: "phone" | "otp" | "profile"
  const [step, setStep] = useState("phone");
  const [loading, setLoading] = useState(false);

  // Step 1: Phone input
  const [phone, setPhone] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Step 2: OTP input
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const otpInputsRef = useRef([]);
  const [resendTimer, setResendTimer] = useState(0);

  // Step 3: Profile form fields
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    dob: "",
    referralCode: "",
  });
  const [referralApplied, setReferralApplied] = useState(false);

  // Animated header text taglines
  const animatedTexts = [
    "Personalised beauty recommendations",
    "₹100 off your first order, T&C apply",
    "Explore luxury cosmetics & skincare",
    "Virtual try-on & shade finder tools"
  ];
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % animatedTexts.length);
    }, 3000);
    return () => clearInterval(textInterval);
  }, []);

  // Pre-populate referral/promo code from URL query parameters
  useEffect(() => {
    const code = searchParams.get("ref") || searchParams.get("referralCode") || searchParams.get("promo") || searchParams.get("promoCode");
    if (code) {
      setProfileData((prev) => ({ ...prev, referralCode: code.toUpperCase() }));
      setReferralApplied(true);
    }
  }, [searchParams]);

  // Timer countdown handler
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Handler to send OTP (Step 1)
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!/^[6-9][0-9]{9}$/.test(phone)) {
      toast.error("Please enter a valid 10-digit Indian phone number starting with 6-9.");
      return;
    }
    if (!termsAccepted) {
      toast.warn("You must agree to the Terms of Use and Privacy Policy.");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.post("/api/user/otp/send", { phone });
      if (res.data?.success) {
        toast.success(res.data.message || "OTP sent successfully via WhatsApp.");
        setStep("otp");
        setResendTimer(30); // 30 seconds countdown
        // Reset OTP inputs
        setOtpDigits(["", "", "", ""]);
        setTimeout(() => {
          if (otpInputsRef.current[0]) otpInputsRef.current[0].focus();
        }, 100);
      } else {
        toast.error(res.data?.message || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      toast.error(err.response?.data?.message || "Server error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP action
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    try {
      setLoading(true);
      const res = await axiosInstance.post("/api/user/otp/send", { phone });
      if (res.data?.success) {
        toast.success("A new OTP has been sent.");
        setResendTimer(30);
        setOtpDigits(["", "", "", ""]);
        if (otpInputsRef.current[0]) otpInputsRef.current[0].focus();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  // OTP inputs keyboard events handling
  const handleOtpDigitChange = (index, value) => {
    if (isNaN(value)) return; // Only allow digits

    const newDigits = [...otpDigits];
    newDigits[index] = value.substring(value.length - 1); // Get last typed character
    setOtpDigits(newDigits);

    // Auto focus next input if filled
    if (value && index < 3) {
      otpInputsRef.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Backspace key shifts focus to previous field
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (!/^\d{4}$/.test(pasteData)) return;

    const digits = pasteData.split("");
    setOtpDigits(digits);
    otpInputsRef.current[3].focus();
  };

  // Handler to verify OTP (Step 2)
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    const otp = otpDigits.join("");
    if (otp.length !== 4) {
      toast.error("Please enter the 4-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.post("/api/user/otp/verify", { phone, otp });
      const data = res.data;

      if (data.status === "new_user") {
        toast.success(data.message || "OTP verified successfully!");
        setStep("profile");
      } else if (data.status === "existing_user") {
        toast.success(data.message || "Login successful!");

        // Persist token in cookie for UserContext
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);
        document.cookie = `token=1; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`;

        // Update Auth Context & Navigate
        loginUser({ ...data.user, authenticated: true });
        navigate(redirectUrl, { replace: true });
      } else {
        toast.error("Unexpected response from server.");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      toast.error(err.response?.data?.message || "Incorrect OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Profile fields inputs change handler
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for referral/promo code apply action
  const handleApplyReferral = (e) => {
    e.preventDefault();
    if (!profileData.referralCode.trim()) {
      toast.warn("Please enter a referral code.");
      return;
    }
    // We will validate it during the final profile completion submission,
    // but we can show a success indicator to the user.
    setReferralApplied(true);
    toast.info(`Invitation code "${profileData.referralCode.toUpperCase()}" entered! It will be verified when you save.`);
  };

  const handleRemoveReferral = (e) => {
    e.preventDefault();
    setProfileData((prev) => ({ ...prev, referralCode: "" }));
    setReferralApplied(false);
    toast.info("Referral code removed.");
  };

  // Handler for final Profile Completion submission (Step 3)
  const handleCompleteProfile = async (e) => {
    if (e) e.preventDefault();
    const { firstName, lastName, email, gender, dob, referralCode } = profileData;

    if (!firstName.trim() || !lastName.trim()) {
      toast.error("Please enter both First Name and Last Name.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Format fields for backend
    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    let formattedDob = undefined;
    if (dob) {
      // Input date is YYYY-MM-DD, we need to convert it to DD/MM/YYYY
      const parts = dob.split("-");
      if (parts.length === 3) {
        formattedDob = `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    }

    try {
      setLoading(true);
      const code = referralCode.trim().toUpperCase();
      const isUserReferral = /^[0-9A-F]{8}$/.test(code) || /^JOY/i.test(code);

      const payload = {
        name: fullName,
        email: email.trim().toLowerCase(),
        gender: gender || undefined,
        dob: formattedDob,
        referralCode: (code && isUserReferral) ? code : undefined,
        promo: (code && !isUserReferral) ? code : undefined
      };

      const res = await axiosInstance.post("/api/user/otp/complete-profile", payload);
      const data = res.data;

      if (data.success) {
        toast.success(data.message || "Profile completed successfully!");

        // Persist token in cookie for UserContext
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);
        document.cookie = `token=1; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`;

        // Update Auth Context & Navigate
        loginUser({ ...data.user, authenticated: true });
        navigate(redirectUrl, { replace: true });
      } else {
        toast.error(data.message || "Failed to complete profile.");
      }
    } catch (err) {
      console.error("Error completing profile:", err);
      toast.error(err.response?.data?.message || "Server error completing profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Animation settings for motion transitions
  const animationVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeInOut" } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2, ease: "easeInOut" } }
  };

  return (
    <div className="phone-auth-container">
      <div className="phone-auth-backdrop" />

      <div className="phone-auth-card">
        {/* Close Button redirects back to homepage */}
        <button className="phone-auth-close-btn" onClick={() => navigate("/")}>
          &times;
        </button>

        {/* Branding header */}
        <div className="phone-auth-header-sec">
          <div className="phone-auth-logo">
            <img src={Logo} alt="Joyory Luxe" className="phone-auth-logo-img" />
          </div>
          <div style={{ height: "28px", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "8px" }}>
            <AnimatePresence mode="wait">
              <motion.p
                key={textIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="phone-auth-promo-text"
              >
                {animatedTexts[textIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Step panels managed inside standard AnimatePresence */}
        <div className="phone-auth-body-sec">
          <AnimatePresence mode="wait">
            {step === "phone" && (
              <motion.div
                key="phone-step"
                variants={animationVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* <h2 className="phone-auth-title">Log In Or Sign Up</h2> */}

                <h2 className="phone-auth-title">
                  Welcome to Joyory
                </h2>

                <p className="phone-auth-subtitle">
                  Discover luxury beauty curated for you
                </p>
                <form onSubmit={handleSendOtp}>
                  <div className="phone-input-wrapper">
                    <span className="phone-prefix">+91</span>
                    <span className="phone-divider">|</span>
                    <input
                      type="tel"
                      placeholder="Enter Phone Number"
                      className="phone-text-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      maxLength={10}
                      disabled={loading}
                      required
                    />
                  </div>

                  <div className="terms-agreement-wrapper" onClick={() => setTermsAccepted(!termsAccepted)}>
                    <input
                      type="checkbox"
                      className="terms-checkbox"
                      checked={termsAccepted}
                      onChange={() => { }} // Controlled via parent click
                      disabled={loading}
                    />
                    <p className="terms-text">
                      By continuing, you agree to Joyory's{" "}
                      <Link to="/terms" className="terms-link" onClick={(e) => e.stopPropagation()}>
                        Terms of Use
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy-policy" className="terms-link" onClick={(e) => e.stopPropagation()}>
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="phone-auth-submit-btn"
                    disabled={loading || phone.length !== 10 || !termsAccepted}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-inline" /> Sending OTP...
                      </>
                    ) : (
                      "Send OTP"
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {step === "otp" && (
              <motion.div
                key="otp-step"
                variants={animationVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <h2 className="phone-auth-title">Verify OTP</h2>
                <p className="otp-subtitle-sec">
                  OTP has been sent to <span className="otp-phone-highlight">+91 {phone}</span>
                  <button className="otp-edit-phone-btn" onClick={() => setStep("phone")}>
                    Edit Number
                  </button>
                </p>

                <form onSubmit={handleVerifyOtp}>
                  <div className="otp-inputs-row">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (otpInputsRef.current[idx] = el)}
                        type="text"
                        maxLength={1}
                        className="otp-digit-field"
                        value={digit}
                        onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        onPaste={idx === 0 ? handleOtpPaste : undefined}
                        disabled={loading}
                        autoFocus={idx === 0}
                      />
                    ))}
                  </div>

                  <div className="otp-timer-row">
                    {resendTimer > 0 ? (
                      <div>
                        Resend OTP in <span className="otp-timer-count">00:{resendTimer < 10 ? `0${resendTimer}` : resendTimer}</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="otp-resend-btn"
                        onClick={handleResendOtp}
                        disabled={loading}
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="phone-auth-submit-btn"
                    disabled={loading || otpDigits.some((d) => d === "")}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-inline" /> Verifying...
                      </>
                    ) : (
                      "Verify & Proceed"
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {step === "profile" && (
              <motion.div
                key="profile-step"
                variants={animationVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <h2 className="phone-auth-title">One last step...</h2>
                <p className="profile-subtext">Complete your details to set up your profile.</p>

                <form onSubmit={handleCompleteProfile} className="profile-form-grid">
                  <div className="profile-name-row">
                    <div className="profile-field-group">
                      <label className="profile-label profile-label-required">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="Enter First Name"
                        className="profile-input-control"
                        value={profileData.firstName}
                        onChange={handleProfileChange}
                        disabled={loading}
                        required
                      />
                    </div>
                    <div className="profile-field-group">
                      <label className="profile-label profile-label-required">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Enter Last Name"
                        className="profile-input-control"
                        value={profileData.lastName}
                        onChange={handleProfileChange}
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>

                  <div className="profile-field-group">
                    <label className="profile-label profile-label-required">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter Email Address"
                      className="profile-input-control"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      disabled={loading}
                      required
                    />
                  </div>

                  <div className="profile-field-group">
                    <label className="profile-label">Gender</label>
                    <div className="profile-gender-row">
                      {["female", "male", "other"].map((g) => (
                        <div
                          key={g}
                          className={`profile-gender-card-btn ${profileData.gender === g ? "selected" : ""}`}
                          onClick={() => !loading && setProfileData((prev) => ({ ...prev, gender: g }))}
                        >
                          {g === "other" ? "Non Binary" : g.charAt(0).toUpperCase() + g.slice(1)}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="profile-field-group">
                    <label className="profile-label">Date of Birth</label>
                    <div className="date-input-container">
                      <input
                        type="date"
                        name="dob"
                        className="profile-input-control"
                        value={profileData.dob}
                        onChange={handleProfileChange}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="profile-field-group">
                    <div className="referral-box-container">
                      <div className="referral-subtext">Earn points & discounts</div>
                      <label className="profile-label">Enter Referral Code</label>
                      <div className="referral-input-wrapper">
                        <input
                          type="text"
                          name="referralCode"
                          placeholder="Paste referral / invite code here"
                          className="profile-input-control"
                          value={profileData.referralCode}
                          onChange={handleProfileChange}
                          disabled={loading || referralApplied}
                        />
                        {referralApplied ? (
                          <button
                            type="button"
                            className="referral-apply-btn"
                            onClick={handleRemoveReferral}
                            disabled={loading}
                            style={{ color: "#E23E3E" }}
                          >
                            Remove
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="referral-apply-btn"
                            onClick={handleApplyReferral}
                            disabled={loading || !profileData.referralCode.trim()}
                          >
                            Apply
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="phone-auth-submit-btn"
                    disabled={loading || !profileData.firstName.trim() || !profileData.lastName.trim() || !profileData.email.trim()}
                    style={{ marginTop: "10px" }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-inline" /> Saving Profile...
                      </>
                    ) : (
                      "Save"
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PhoneAuth;