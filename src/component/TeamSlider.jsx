// // src/components/TeamSlider.jsx
// import React from "react";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import "../css/TeamSlider.css";
// import designersteam from "../assets/designers-team.png";
// import ourteamphoto from "../assets/our-team-photo.png";
// import socialmediateam from "../assets/social-media-team.png";


// const TeamSlider = () => {
//   const settings = {
//     dots: false,
//     infinite: true,
//     speed: 600,
//     slidesToShow: 3,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000,
//     responsive: [
//       {
//         breakpoint: 992, // tablets
//         settings: { slidesToShow: 2 },
//       },
//       {
//         breakpoint: 576, // mobile
//         settings: { slidesToShow: 1 },
//       },
//     ],
//   };

//   return (
//     <section className="team-section py-5">
//       <div className="container text-center">
//         <h2 className="team-title mb-4">Meet Our Team</h2>
//         <Slider {...settings}>
//           <div>
//             <img
//               src={designersteam}
//               alt="Team 1"
//               className="team-img img-fluid"
//             />
//           </div>
//           <div>
//             <img
//               src={ourteamphoto}
//               alt="Team 2"
//               className="team-img img-fluid"
//             />
//           </div>
//           <div>
//             <img
//               src={socialmediateam}
//               alt="Team 3"
//               className="team-img img-fluid"
//             />
//           </div>
//         </Slider>
//       </div>
//     </section>
//   );
// };

// export default TeamSlider;



// src/components/TeamSlider.jsx
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/TeamSlider.css";

import designersteam from "../assets/designers-team.png";
import ourteamphoto from "../assets/our-team-photo.png";
import socialmediateam from "../assets/social-media-team.png";

const TeamSlider = () => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Device-wise slidesToShow (ensures first render also respects device)
  const getSlidesToShow = () => {
    if (windowWidth < 576) return 1; // mobile
    if (windowWidth < 992) return 2; // tablet
    return 3; // desktop
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: getSlidesToShow(),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <section className="team-section py-5">
      <div className="container text-center">
        <h2 className="team-title mb-4">Meet Our Team</h2>
        {/* Force re-init on width change */}
        <Slider key={windowWidth} {...settings}>
          <div>
            <img src={designersteam} alt="Design Team" className="team-img img-fluid" />
          </div>
          <div>
            <img src={ourteamphoto} alt="Core Team" className="team-img img-fluid" />
          </div>
          <div>
            <img src={socialmediateam} alt="Social Media Team" className="team-img img-fluid" />
          </div>
        </Slider>
      </div>
    </section>
  );
};

export default TeamSlider;
