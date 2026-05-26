// import React from 'react';
// import '../css/Affiliate.css'; // Optional for additional styling

// const Affiliate = () => {
//   return (
//     <div className="joycry-banner container-fluid py-5 px-4 px-md-5">
//       <div className="row justify-content-center">
//         <div className="col-12 col-lg-10 col-xl-9 text-center">

//           {/* Main Heading */}
//           <h1 className="display-4 fw-bold mb-4">
//             Join the Joycry Affiliate Program
//           </h1>

//           {/* Description Text */}
//           <div className="description mb-5 mx-auto">
//             <p className="lead mb-3">
//               Our service will offer long-term support and effective shopping experience. 
//               We also ensure that our ability to affiliate our customers is a good way 
//               for us to deliver our customers in order to make sure we can achieve our 
//               objectives, success or deliver customer-centric excellent support and
//             </p>

//             {/* Highlighted Text */}
//             <div className="highlight-text mt-4">
//               <span className="badge bg-light text-dark fs-4 fw-bold p-3">
//                 2 MINTS EXECUTION
//               </span>
//             </div>
//           </div>

//           {/* CTA Button */}
//           <div className="cta-section">
//             <button className="btn btn-primary btn-lg fw-bold px-5 py-3">
//               Get Started
//             </button>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Affiliate;














// import React from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../css/Affiliate.css"; // optional for extra styling
// import affiliatehero from "../assets/affiliate-hero.png"

// const Affiliate = () => {
//   return (
//     <>
//       <div className="mb-3">
//         <img
//           src={affiliatehero}  // change path if needed
//           alt="Affiliate Program"
//           className="img-fluid rounded affiliate-img"
//         />
//       </div>
//       <div className="affiliate-banner container-fluid py-5 px-4 px-md-5">
//         <div className="row justify-content-center">
//           <div className="col-12 col-lg-10 col-xl-9 text-center">

//             {/* Banner Image */}

//             {/* Main Heading */}
//             <h1 className="display-5 fw-bold mb-4">
//               Join the Joyory Affiliate Program
//             </h1>

//             {/* Description Text */}
//             <div className="description mb-4 mx-auto px-lg-5">
//               <p className="lead text-secondary">
//                 Our exclusive affiliate program is a great fit for publishers ,bloggers, media networks , Influencers and industry leaders with large audience. Sign up today and you’ll get industry-leading commisions, a 30-day cookie, real time, tracking and reporting. full access to Joyory’s creative library and a dedicated support staff
//               </p>
//             </div>

//             {/* Highlighted Text */}
//             <div className="mb-5" style={{ opacity: '0.5' }}>
//               <span className="badge bg-light text-dark fs-4 fw-bold shadow-sm" style={{ display: 'contents' }}>
//                 5 min to complete
//                 {/* ⏱ 2 MINUTES EXECUTION */}
//               </span>
//             </div>

//             {/* CTA Button */}
//             <button className="btn get-start-button btn-lg fw-bold px-5 py-3 w-50">
//               Get Started
//             </button>
//           </div>
//         </div>
//       </div>

//     </>
//   );
// };

// export default Affiliate;


























import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Affiliate.css";
import affiliatehero from "../assets/affiliate-hero.png";
import { useNavigate } from "react-router-dom";

const Affiliate = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/Affiliatelogin"); // redirect page
  };

  return (
    <>
      <div className="mb-3">
        <img
          src={affiliatehero}
          alt="Affiliate Program"
          className="img-fluid rounded affiliate-img"
        />
      </div>

      <div className="affiliate-banner container-fluid py-5 px-4 px-md-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-9 text-center">
            <h3 className="display-5 fw-bold mb-4">
              Join the Joyory Affiliate Program
            </h3>

            <div className="description mb-4 mx-auto px-lg-5">
              <p className="lead text-secondary">
                Our exclusive affiliate program is a great fit for publishers, bloggers, media networks, influencers and industry leaders with large audience. Sign up today and you’ll get industry-leading commissions, a 30-day cookie, real time tracking and reporting, full access to Joyory’s creative library and a dedicated support staff.
              </p>
            </div>

            <div className="mb-5" style={{ opacity: "0.5" }}>
              <span className="badge bg-light text-dark fs-4 fw-bold shadow-sm" style={{ display: "contents" }}>
                5 min to complete
              </span>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleGetStarted}
              className="btn get-start-button btn-lg fw-bold px-5 py-3 w-50"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Affiliate;
