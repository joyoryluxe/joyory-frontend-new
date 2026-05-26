// // src/pages/UndertoneSlider.jsx
// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import Slider from "react-slick";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import Footer from "./Footer";
// import Header from "./Header";

// export default function UndertoneSlider() {
//   const [undertones, setUndertones] = useState([]);
//   const [selectedUndertone, setSelectedUndertone] = useState(null);
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);
//   const sliderRef = useRef(null);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const shade = location.state?.shade;
//   const toneKey = shade?.key || "";

//   useEffect(() => {
//     const fetchUndertones = async () => {
//       if (!toneKey) return;
//       try {
//         const res = await fetch(
//           `https://beauty.joyory.com/api/user/shadefinder/undertones?toneKey=${toneKey}`
//         );
//         const data = await res.json();
//         if (data.success && Array.isArray(data.undertones)) {
//           setUndertones(data.undertones);
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchUndertones();
//   }, [toneKey]);

//   useEffect(() => {
//     const handleResize = () => {
//       const newWidth = window.innerWidth;
//       const wasDesktop = windowWidth > 1024;
//       const wasTablet = windowWidth <= 1024 && windowWidth >= 768;
//       const wasMobile = windowWidth < 768;
//       const isDesktop = newWidth > 1024;
//       const isTablet = newWidth <= 1024 && newWidth >= 768;
//       const isMobile = newWidth < 768;

//       if (
//         (wasDesktop && !isDesktop) ||
//         (wasTablet && !isTablet) ||
//         (wasMobile && !isMobile)
//       ) {
//         window.location.reload();
//       }
//       setWindowWidth(newWidth);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [windowWidth]);

//   const sliderSettings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: windowWidth > 1199 ? 3 : windowWidth >= 768 ? 2 : 1,
//     slidesToScroll: 1,
//   };

//   const handleNext = async () => {
//     if (!selectedUndertone) return;
//     try {
//       const res = await fetch(
//         `https://beauty.joyory.com/api/user/shadefinder/families?toneKey=${toneKey}&undertoneKey=${selectedUndertone}`
//       );
//       const data = await res.json();
//       navigate("/shadetone", {
//         state: {
//           shade,
//           undertoneKey: selectedUndertone,
//           families: data.families || [],
//         },
//       });
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleBack = () => navigate(-1);

//   return (

//     <>

//     <Header />


//     <div className="container py-4">
//       <h5 className="text-center mb-4 fw-bold">
//         Know your correct undertone for {shade?.name}
//       </h5>

//       {undertones.length === 0 && <p className="text-center">Loading undertones...</p>}

//       {undertones.length > 0 && (
//         <Slider ref={sliderRef} {...sliderSettings}>
//           {undertones.map((tone) => (
//             <div key={tone._id} className="px-3">
//               <div
//                 className={`p-4 text-center rounded border ${
//                   selectedUndertone === tone.key ? "border-3 border-primary" : "border-light"
//                 }`}
//                 style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center" }}
//                 onClick={() => setSelectedUndertone(tone.key)}
//               >
//                 {tone.image ? (
//                   <img
//                     src={tone.image}
//                     alt={tone.name}
//                     className="img-fluid mb-3"
//                     style={{ maxHeight: "120px", objectFit: "contain" }}
//                   />
//                 ) : (
//                   <div
//                     style={{
//                       width: "100px",
//                       height: "100px",
//                       backgroundColor: "#eee",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       marginBottom: "10px",
//                     }}
//                   >
//                     No Image
//                   </div>
//                 )}
//                 <p className="fw-bold">{tone.name}</p>
//                 <p className="small">{tone.description}</p>
//               </div>
//             </div>
//           ))}
//         </Slider>
//       )}

//       <div className="d-flex justify-content-between mt-4">
//         <button className="btn btn-secondary" onClick={handleBack}>
//           Back
//         </button>
//         <button className="btn btn-primary" disabled={!selectedUndertone} onClick={handleNext}>
//           Next
//         </button>
//       </div>
//     </div>

//       <Footer />

//     </>
//   );
// }












import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./Footer";
import Header from "./Header";
import "../css/Shadefindshadetone.css"; // We will create this file below

export default function UndertoneSlider() {
  const [undertones, setUndertones] = useState([]);
  const [selectedUndertone, setSelectedUndertone] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const shade = location.state?.shade;
  const toneKey = shade?.key || "";

  useEffect(() => {
    const fetchUndertones = async () => {
      if (!toneKey) return;
      try {
        const res = await fetch(
          `https://beauty.joyory.com/api/user/shadefinder/undertones?toneKey=${toneKey}`
        );
        const data = await res.json();
        if (data.success && Array.isArray(data.undertones)) {
          setUndertones(data.undertones);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUndertones();
  }, [toneKey]);

  const handleNext = async () => {
    if (!selectedUndertone) return;
    try {
      const res = await fetch(
        `https://beauty.joyory.com/api/user/shadefinder/families?toneKey=${toneKey}&undertoneKey=${selectedUndertone}`
      );
      const data = await res.json();
      navigate("/shadetone", {
        state: {
          shade,
          undertoneKey: selectedUndertone,
          families: data.families || [],
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleBack = () => navigate(-1);

  // Helper to get bar colors based on undertone name
  const getBarColor = (name) => {
    const n = name.toLowerCase();
    if (n.includes("warm")) return "#E59E84"; // Terracotta
    if (n.includes("neutral")) return "#CCD9D7"; // Sage
    if (n.includes("cool")) return "#D4C1F4"; // Lavender
    return "#ddd";
  };

  return (
    <div className="undertone-page-wrapper">
      <Header />

      <main className="container undertone-main-content">
        <div className="undertone-header mt-2 mt-md-5 pt-1 pt-md-4">
          <h1 className="display-4 display-md-6 fw-normal undertone-title page-title-main-name">What’s Your Undertone</h1>
          <p className="text-muted undertone-subtitle page-title-main-name">
            Choose the group that best represents your skin tone.
          </p>
        </div>

        {undertones.length === 0 ? (
          <div className="text-center py-5">Loading undertones...</div>
        ) : (
          <div className="row g-4 mt-lg-5 mt-3 justify-content-center page-title-main-name">
            {undertones.map((tone) => (
              <div key={tone._id} className="col-6 col-md-3">
                <div 
                  className={`undertone-card ${selectedUndertone === tone.key ? "active" : ""}`}
                  onClick={() => setSelectedUndertone(tone.key)}
                >
                  {/* Top Color Bar */}
                  <div 
                    className="undertone-bar" 
                    style={{ backgroundColor: getBarColor(tone.name) }}
                  ></div>
                  
                  <div className="card-body-custom d-flex align-items-start mt-3">
                    {/* Custom Radio Circle */}
                    <div className={`custom-radio-circle me-3 ${selectedUndertone === tone.key ? "selected" : ""}`}>
                      {selectedUndertone === tone.key && <div className="inner-dot"></div>}
                    </div>
                    
                    <div>
                      <h3 className="h4 fw-normal mb-1">{tone.name}</h3>
                      <p className="text-muted small undertone-desc">
                        {tone.description || "On the pink, red and blue side"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="d-flex justify-content-between align-items-center mt-4 mt-md-5 undertone-actions position-relative">
          <button className="btn btn-previous btn-for-shadetones" onClick={handleBack}>
            <span className="me-2">←</span> Previous
          </button>
          <button 
            className="btn-next-black btn-for-back-buttons" 
            disabled={!selectedUndertone} 
            onClick={handleNext}
          >
            Next <span className="ms-2">→</span>
          </button>
        </div>
      </main>

      {/* Wavy Background at the bottom */}
      <div className="wavy-footer-bg">
        <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path 
            fill="#D6E3E9" 
            fillOpacity="1" 
            d="M0,224L80,202.7C160,181,320,139,480,144C640,149,800,203,960,213.3C1120,224,1280,192,1360,176L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* <Footer /> */}
    </div>
  );
}