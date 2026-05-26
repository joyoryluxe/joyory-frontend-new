// // src/components/VisionMission.jsx
// import React from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import "../css/VisionMission.css";
// import Eye from "../assets/eye.png";
// import Mission from "../assets/Mission.png";

// const VisionMission = () => {
//   return (
//     <section className="vision-mission-section container text-center my-5 position-relative">
//       {/* Decorative stars */}
//       <div className="decor decor-top-left">✦</div>
//       <div className="decor decor-top-right">✦</div>
//       <div className="decor decor-left">✦</div>
//       <div className="decor decor-right">✦</div>

//       {/* Heading */}
//       <h2 className="section-title mb-5">
//         Your satisfaction is our priority !!
//       </h2>

//       {/* Cards */}
//       <div className="row g-4 justify-content-center">
//         {/* Vision */}
//         <div className="col-lg-4 col-md-6">
//           <div className="info-card">
//             {/* <i className="bi bi-eye icon"></i> */}

//             <img src={Eye}  className="img-fluid w-25 mb-4" />



//             <h4 className="title">Our Vision</h4>
//             <p className="text">
//               "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
//               eiusmod tempor incididunt ut labore et dolore magna aliqua."
//             </p>
//           </div>
//         </div>

//         {/* Mission */}
//         <div className="col-lg-4 col-md-6">
//           <div className="info-card">
//           <img src={Mission}  className="img-fluid w-25" />

//             <h4 className="title">Our Mission</h4>
//             <p className="text">
//               "Ut enim ad minim veniam, quis nostrud exercitation ullamco
//               laboris nisi ut aliquip ex ea commodo consequat."
//             </p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default VisionMission;















// src/components/VisionMission.jsx
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../css/VisionMission.css";
import Eye from "../assets/eye.png";
import Mission from "../assets/Mission.png";

const VisionMission = () => {
  return (
    <section className="mission-vision-section page-title-main-name">
      <div className="mission-vision-container">

        {/* Mission */}
        <div className="mission-box">
          <h2>Mission</h2>
          <p>
            To become a trusted and leading online beauty platform that redefines how people discover, experience, and shop for beauty — by combining curation, convenience, and confidence in every choice.
          </p>
        </div>

        {/* Vision */}
        <div className="mission-box">
          <h2>Vision ?</h2>
          <p>
            To provide a carefully curated range of authentic skincare and makeup products that cater to diverse beauty needs, while delivering a seamless and enjoyable shopping experience.
          </p>
          
            <p>
            To empower customers with the right choices through simplicity, quality, and thoughtful recommendations — making beauty more accessible, reliable, and personal.
          </p>
        </div>

      </div>
    </section>
  );
};

export default VisionMission;