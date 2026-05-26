// import React from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import signupImg from "../assets/Signup-page.png"; // update path to your image
// import Logo from "../assets/Logo.png"; // update path to your image

// const AffiliateSignup = () => {
//   return (
//     <div className="container-fluid p-0">
//       <div className="row g-0 min-vh-100">

//         {/* LEFT SIDE IMAGE */}
//         <div className="col-12 col-lg-6">
//           <img
//             src={signupImg}
//             alt="Signup Banner"
//             className="img-fluid w-100"
//           />
//         </div>

//         {/* RIGHT SIDE FORM */}
//         <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center p-4 p-md-5">
//           <div className="w-100" style={{ maxWidth: "450px" }}>

//             {/* Logo */}
//             <div className="text-center mb-3">
//               <img
//                src={Logo}
//                 alt="Joyory Logo"
//                 style={{}}
//                 className="w-25"
//               />
//             </div>

//             {/* Heading */}
//             <h2 className="text-center mb-4 fw-bold" style={{ color: "#3c7aa2" }}>
//               Now Complete your signup
//             </h2>

//             {/* Form */}
//             <form>
//               <div className="mb-3">
//                 <label className="form-label fw-semibold">Full Name</label>
//                 <input type="text" className="form-control" placeholder="Enter your name" />
//               </div>

//               <div className="mb-3">
//                 <label className="form-label fw-semibold">Password</label>
//                 <input type="password" className="form-control" placeholder="Enter your password" />
//               </div>

//               <div className="mb-3">
//                 <label className="form-label fw-semibold">Email Address</label>
//                 <input type="email" className="form-control" placeholder="Enter your Email address" />
//               </div>

//               <div className="mb-4">
//                 <label className="form-label fw-semibold">Mobile Number</label>
//                 <input type="text" className="form-control" placeholder="Enter your Mobile number" />
//               </div>

//               {/* Button */}
//               <button
//                 type="submit"
//                 className="btn btn-lg w-100 text-white fw-bold"
//                 style={{ background: "#3c7aa2" }}
//               >
//                 Get Started
//               </button>
//             </form>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default AffiliateSignup;



















import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import signupImg from "../assets/Signup-page.png";
import Logo from "../assets/Logo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AffiliateSignup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    mobile: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.post(
        "https://beauty.joyory.com/api/affiliate/signup",
        formData
      );

      setMessage({ type: "success", text: "Signup Successful!" });

      // Store token if needed
      localStorage.setItem("affiliate_token", response.data.token);

      // Redirect after 1 second
      setTimeout(() => navigate("/affiliate-dashboard"), 1000);
    } catch (error) {
      const msg =
        error.response?.data?.message || "Something went wrong. Try again!";
      setMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="row g-0 min-vh-100">

        {/* LEFT SIDE IMAGE */}
        <div className="col-12 col-lg-6">
          <img src={signupImg} alt="Signup Banner" className="img-fluid w-100" />
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center p-4 p-md-5">
          <div className="w-100" style={{ maxWidth: "450px" }}>

            {/* Logo */}
            <div className="text-center mb-3">
              <img src={Logo} alt="Joyory Logo" className="w-25" />
            </div>

            {/* Heading */}
            <h2 className="text-center mb-4 fw-bold" style={{ color: "#3c7aa2" }}>
              Now Complete your signup
            </h2>

            {/* Alerts */}
            {message.text && (
              <div
                className={`alert ${
                  message.type === "success" ? "alert-success" : "alert-danger"
                } py-2`}
              >
                {message.text}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  className="form-control"
                  placeholder="Enter your name"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter your password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter your Email address"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Mobile Number</label>
                <input
                  type="text"
                  name="mobile"
                  className="form-control"
                  placeholder="Enter your Mobile number"
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-lg w-100 text-white fw-bold"
                style={{ background: "#3c7aa2" }}
              >
                {loading ? "Please wait..." : "Get Started"}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AffiliateSignup;
