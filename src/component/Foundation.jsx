// // src/pages/FoundationPage.jsx
// import React, { useEffect, useState, useRef } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Slider from "react-slick";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// export default function FoundationPage() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const sliderRef = useRef(null);

//   const { shade, undertoneKey, family } = location.state || {};

//   const [formulations, setFormulations] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [loadingNext, setLoadingNext] = useState(false);
//   const [selected, setSelected] = useState(null);
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);

//   const handleBack = () => navigate(-1);

//   useEffect(() => {
//     const fetchFormulations = async () => {
//       if (!shade?.key || !undertoneKey || !family?.key) {
//         setError("Missing required parameters to fetch formulations.");
//         return;
//       }
//       setLoading(true);
//       try {
//         const res = await fetch(
//           `https://beauty.joyory.com/api/shadefinder/formulations?familyKey=${family.key}&toneKey=${shade.key}&undertoneKey=${undertoneKey}`
//         );
//         const data = await res.json();
//         if (data.success && Array.isArray(data.formulations)) {
//           setFormulations(data.formulations);
//         } else {
//           setError("No formulations found.");
//         }
//       } catch (err) {
//         console.error("Error fetching formulations:", err);
//         setError("Failed to fetch formulations.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFormulations();
//   }, [shade, undertoneKey, family]);

//   // Resize listener
//   useEffect(() => {
//     const handleResize = () => setWindowWidth(window.innerWidth);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const handleNext = async () => {
//     if (!selected?._id) return;
//     setLoadingNext(true);
//     try {
//       const res = await fetch(
//         `https://beauty.joyory.com/api/user/shadefinder/recommendations?familyKey=${family.key}&toneKey=${shade.key}&undertoneKey=${undertoneKey}&formulation=${selected._id}`
//       );
//       const data = await res.json();

//       const recommendations = Array.isArray(data.products) ? data.products : [];
//       const suggestions = Array.isArray(data.suggestions)
//         ? data.suggestions
//         : [];

//       navigate("/recommendations", {
//         state: {
//           shade,
//           undertoneKey,
//           family,
//           formulation: selected,
//           recommendations,
//           suggestions,
//         },
//       });
//     } catch (err) {
//       console.error("Error fetching recommendations:", err);
//     } finally {
//       setLoadingNext(false);
//     }
//   };

//   // Slides responsive setup
//   const getSlidesToShow = () => {
//     if (windowWidth < 480) return 1; // Mobile
//     if (windowWidth < 768) return 2; // Small tablet
//     if (windowWidth < 992) return 3; // Large tablet
//     return 4; // Desktop
//   };

//   const sliderSettings = {
//     dots: true,
//     infinite: false,
//     speed: 500,
//     slidesToShow: getSlidesToShow(),
//     slidesToScroll: 1,
//     arrows: windowWidth >= 768, // hide arrows on small devices
//     adaptiveHeight: true,
//   };

//   return (
//     <div className="container py-5">
//       <h3 className="fw-bold text-primary mb-4 text-center">
//         Choose Your Foundation Type
//       </h3>

//       <div className="mb-4 text-center">
//         <p>
//           <strong>Shade:</strong> {shade?.name || "N/A"}
//         </p>
//         <p>
//           <strong>Undertone:</strong> {undertoneKey || "N/A"}
//         </p>
//         <p>
//           <strong>Family:</strong> {family?.name || "N/A"}
//         </p>
//       </div>

//       {loading && <p className="text-center">Loading formulations...</p>}
//       {error && <p className="text-center text-danger">{error}</p>}

//       {!loading && formulations.length > 0 && (
//         <Slider key={windowWidth} ref={sliderRef} {...sliderSettings} className="mt-4">
//           {formulations.map((item) => (
//             <div key={item?._id || item?.id} className="p-3">
//               <div
//                 className={`card h-100 shadow-sm text-center ${
//                   selected?._id === item?._id ? "border-primary border-3" : ""
//                 }`}
//                 style={{ cursor: "pointer", minHeight: "280px" }}
//                 onClick={() => setSelected(item)}
//               >
//                 {item?.image ? (
//                   <img
//                     src={item.image}
//                     alt={item?.name || "Formulation"}
//                     className="card-img-top p-3"
//                     style={{  objectFit: "contain" }}
//                   />
//                 ) : (
//                   <div
//                     className="d-flex align-items-center justify-content-center bg-light"
//                     style={{ height: "200px" }}
//                   >
//                     <span className="text-muted">No Image</span>
//                   </div>
//                 )}
//                 <div className="card-body">
//                   <h5 className="card-title">
//                     {item?.name?.trim() ? item.name : "Unnamed"}
//                   </h5>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </Slider>
//       )}

//       {!loading && formulations.length === 0 && !error && (
//         <p className="text-center">No formulations found.</p>
//       )}

//       <div className="text-center mt-4">
//         <button className="btn btn-secondary px-4" onClick={handleBack}>
//           Back
//         </button>
//         <button
//           className="btn btn-primary px-4 ms-3"
//           onClick={handleNext}
//           disabled={!selected || loadingNext}
//         >
//           {loadingNext ? "Loading..." : "Next"}
//         </button>
//       </div>
//     </div>
//   );
// }














// src/pages/FoundationPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "./Footer";
import Header from "./Header";
import Vector from "../assets/Vector.png";
import "../css/Foundation.css"; 


export default function FoundationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const sliderRef = useRef(null);

  const { shade, undertoneKey, family } = location.state || {};

  const [formulations, setFormulations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingNext, setLoadingNext] = useState(false);
  const [selected, setSelected] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleBack = () => navigate(-1);

  useEffect(() => {
    const fetchFormulations = async () => {
      if (!shade?.key || !undertoneKey || !family?.key) {
        setError("Missing required parameters to fetch formulations.");
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `https://beauty.joyory.com/api/shadefinder/formulations?familyKey=${family.key}&toneKey=${shade.key}&undertoneKey=${undertoneKey}`
        );
        const data = await res.json();
        if (data.success && Array.isArray(data.formulations)) {
          setFormulations(data.formulations);
        } else {
          setError("No formulations found.");
        }
      } catch (err) {
        console.error("Error fetching formulations:", err);
        setError("Failed to fetch formulations.");
      } finally {
        setLoading(false);
      }
    };

    fetchFormulations();
  }, [shade, undertoneKey, family]);

  // Resize listener
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNext = async () => {
    if (!selected?._id) return;
    setLoadingNext(true);
    try {
      const res = await fetch(
        `https://beauty.joyory.com/api/user/shadefinder/recommendations?familyKey=${family.key}&toneKey=${shade.key}&undertoneKey=${undertoneKey}&formulation=${selected._id}`
      );
      const data = await res.json();

      const recommendations = Array.isArray(data.products) ? data.products : [];
      const suggestions = Array.isArray(data.suggestions)
        ? data.suggestions
        : [];

      navigate("/recommendations", {
        state: {
          shade,
          undertoneKey,
          family,
          formulation: selected,
          recommendations,
          suggestions,
        },
      });
    } catch (err) {
      console.error("Error fetching recommendations:", err);
    } finally {
      setLoadingNext(false);
    }
  };

  // Slides responsive setup
  const getSlidesToShow = () => {
    if (windowWidth < 480) return 1; // Mobile
    if (windowWidth < 768) return 2; // Small tablet
    if (windowWidth < 992) return 3; // Large tablet
    return 4; // Desktop
  };

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: getSlidesToShow(),
    slidesToScroll: 1,
    arrows: windowWidth <= 768, // hide arrows on small devices
    adaptiveHeight: true,
  };

  return (
    <>
      <Header />
      
      <div className="container py-3 py-md-5 foundation-wrapper">
      <h3 className="fw-400 text-black mb-3 text-start page-title-main-name fs-2 margin-top-foundation">
        Choose Your Foundation Type
      </h3>

      <div className="mb-4 text-center font-size-of-Foundation d-flex gap-2 page-title-main-name flex-wrap">
        <p className="font-sizess">
          <strong>Shade:</strong> {shade?.name || "N/A"}
        </p>
        <p className="font-sizess">
          <strong>Undertone:</strong> {undertoneKey || "N/A"}
        </p>
        <p className="font-sizess">
          <strong>Family:</strong> {family?.name || "N/A"}
        </p>
      </div>

      {loading && <p className="text-center">Loading formulations...</p>}
      {error && <p className="text-center text-danger">{error}</p>}

      {!loading && formulations.length > 0 && (
        <Slider key={windowWidth} ref={sliderRef} {...sliderSettings} className="mt-4">
          {formulations.map((item) => (
            <div key={item?._id || item?.id} className="p-3">
              <div
                className={`h-100 text-center formulation-card ${
                  selected?._id === item?._id ? "selected" : ""
                }`}
                style={{ cursor: "pointer", minHeight: "280px" }}
                onClick={() => setSelected(item)}
              >
                {item?.image ? (
                  <img
                    src={item.image}
                    alt={item?.name || "Formulation"}
                    className="card-img-top p-3"
                    style={{  objectFit: "contain" }}
                  />
                ) : (
                  <div
                    className="d-flex align-items-center justify-content-center bg-light"
                    style={{ height: "200px" }}
                  >
                    <span className="text-muted">No Image</span>
                  </div>
                )}
                <div className="card-body">
                  <h5 className="card-title text-center">
                    {item?.name?.trim() ? item.name : "Unnamed"}
                  </h5>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      )}

      {!loading && formulations.length === 0 && !error && (
        <p className="text-center">No formulations found.</p>
      )}

      <div className="d-flex justify-content-between align-items-center mt-4 mb-lg-0 mb-5 px-2">
        <button className="btn btn-for-back-buttons px-4" onClick={handleBack}>
          Back
        </button>
        <button
          className="btn btn-for-shadetones px-4"
          onClick={handleNext}
          disabled={!selected || loadingNext}
        >
          {loadingNext ? "Loading..." : "Next"}
        </button>
      </div>
    </div>

     {/* <Footer /> */}

     <img src={Vector} className="img-fluid position-absolute bottom-0 top-100 d-lg-block d-none" alt="Image-not-found" />
    </>


  );
}
