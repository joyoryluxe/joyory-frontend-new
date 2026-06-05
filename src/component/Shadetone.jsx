import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Shadetone.css";
import Footer from "./Footer";
import Header from "./Header";

export default function Shadetone() {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedShadeFromPrev = location.state?.shade;
  const undertoneKey = location.state?.undertoneKey || "neutral";

  const [selectedShade] = useState(selectedShadeFromPrev || null);
  const [families, setFamilies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadingFamilies, setLoadingFamilies] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);

  // Fetch Families from API
  useEffect(() => {
    const fetchFamilies = async () => {
      if (!selectedShade) return;
      setLoadingFamilies(true);
      try {
        const res = await fetch(
          `https://beauty.joyory.com/api/user/shadefinder/families?toneKey=${selectedShade.key}&undertoneKey=${undertoneKey}`
        );
        const data = await res.json();
        const fetchedFamilies = data.families || [];
        setFamilies(fetchedFamilies);

        if (fetchedFamilies.length > 0) {
          setCurrentIndex(0);
        }
      } catch (err) {
        console.error("Error fetching families:", err);
        setFamilies([]);
      } finally {
        setLoadingFamilies(false);
      }
    };
    fetchFamilies();
  }, [selectedShade, undertoneKey]);

  // Logic to determine which 3D class to apply
  const getCardClass = (index) => {
    const total = families.length;
    const offset = (index - currentIndex + total) % total;

    if (offset === 0) return "card-3d center";
    if (offset === 1) return "card-3d right-1";
    if (offset === 2) return "card-3d right-2";
    if (offset === total - 1) return "card-3d left-1";
    if (offset === total - 2) return "card-3d left-2";
    return "card-3d hidden";
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + families.length) % families.length);
  };

  const handleNextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % families.length);
  };

  const handleBack = () => navigate(-1);

  const handleNextPage = async () => {
    const selectedFamily = families[currentIndex];
    if (!selectedShade || !selectedFamily) return;

    setLoadingNext(true);
    try {
      const res = await fetch(
        `https://beauty.joyory.com/api/user/shadefinder/formulations?familyKey=${selectedFamily.key}&toneKey=${selectedShade.key}&undertoneKey=${undertoneKey}`
      );
      const data = await res.json();
      navigate("/foundation", {
        state: {
          shade: selectedShade,
          undertoneKey,
          family: selectedFamily,
          formulations: data.formulations || [],
        },
      });
    } catch (err) {
      console.error("Error fetching formulations:", err);
    } finally {
      setLoadingNext(false);
    }
  };

  return (
    <>
      <Header />

      <div className="shadetone-wrapper" style={{ minHeight: "100vh" }}>
        <div className="container text-center pt-2 pt-md-5 margin-bottom-after-button">

          {/* 1. Header Title (Optional) */}
          <h1 className="mb-3 mt-0 text-start page-title-main-name" style={{ fontWeight: "normal", fontSize: "1.8rem" }}>Like Me, But Different</h1>
          <h5 className="mb-3 mb-md-4 text-start page-title-main-name" style={{ fontWeight: "400", fontSize: "0.9rem" }}>Swipe left/right to choose the skin tone closest to yours.</h5>

          {loadingFamilies ? (
            <div className="py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2">Finding your matches...</p>
            </div>
          ) : families.length > 0 ? (
            <>
              {/* 2. 3D Carousel Container */}
              <div className="carousel-container-3d">
                <button className="nav-arrow-3d left" onClick={handlePrev}>‹</button>

                <div className="carousel-track-3d mt-5">
                  {families.map((family, index) => (
                    <div
                      key={family._id}
                      className={getCardClass(index)}
                      onClick={() => setCurrentIndex(index)}
                    >
                      <img
                        src={family.sampleImages || "https://via.placeholder.com/280x380"}
                        alt={family.name}
                      />
                    </div>
                  ))}
                </div>

                <button className="nav-arrow-3d right" onClick={handleNextSlide}>›</button>
              </div>

              {/* 3. NEW POSITION: Selected Shade Info AFTER the Image */}
              <div className="member-info-3d page-title-main-name mt-5 ">
                <h2 className="member-name-3d">
                  {families[currentIndex]?.name}
                </h2>
                <p className="member-role-3d text-muted">
                  {families[currentIndex]?.description}
                </p>
              </div>
            </>
          ) : (
            <div className="py-5">
              <p>No matching families found for this selection.</p>
              <button className="btn btn-primary" onClick={handleBack}>Try Again</button>
            </div>
          )}

          {/* 5. Action Buttons */}
          <div className="d-flex justify-content-between align-items-center mt-2 mt-md-4 position-relative page-title-main-name w-100 px-2" style={{ zIndex: 10 }}>
            <button
              className="btn btn-for-back-buttons d-flex align-items-center justify-content-center"
              onClick={handleBack}
            >
              Back
            </button>
            <button
              className="btn btn-for-shadetones px-5 py-2"
              onClick={handleNextPage}
              disabled={families.length === 0 || loadingNext}
            >
              {loadingNext ? "Loading..." : "Confirm Selection"}
            </button>
          </div>

          {/* SVG Wave Background */}
          <div className="wavy-footer-bg main-ways top-sm-100 margin-topsssa">
            <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="#D6E3E9"
                fillOpacity="1"
                d="M0,224L80,202.7C160,181,320,139,480,144C640,149,800,203,960,213.3C1120,224,1280,192,1360,176L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}










// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../css/Shadetone.css"; // We will update this file next
// import Footer from "./Footer";
// import Header from "./Header";

// export default function Shadetone() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const selectedShadeFromPrev = location.state?.shade;
//   const undertoneKey = location.state?.undertoneKey || "neutral";

//   const [selectedShade, setSelectedShade] = useState(selectedShadeFromPrev || null);
//   const [families, setFamilies] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [loadingFamilies, setLoadingFamilies] = useState(false);
//   const [loadingNext, setLoadingNext] = useState(false);

//   // Fetch Families from API
//   useEffect(() => {
//     const fetchFamilies = async () => {
//       if (!selectedShade) return;
//       setLoadingFamilies(true);
//       try {
//         const res = await fetch(
//           `https://beauty.joyory.com/api/user/shadefinder/families?toneKey=${selectedShade.key}&undertoneKey=${undertoneKey}`
//         );
//         const data = await res.json();
//         const fetchedFamilies = data.families || [];
//         setFamilies(fetchedFamilies);

//         // Default select the first family
//         if (fetchedFamilies.length > 0) {
//           setCurrentIndex(0);
//         }
//       } catch (err) {
//         console.error("Error fetching families:", err);
//         setFamilies([]);
//       } finally {
//         setLoadingFamilies(false);
//       }
//     };
//     fetchFamilies();
//   }, [selectedShade, undertoneKey]);

//   // Helper function to calculate card classes based on index
//   const getCardClass = (index) => {
//     const total = families.length;
//     const offset = (index - currentIndex + total) % total;

//     if (offset === 0) return "card-3d center";
//     if (offset === 1) return "card-3d right-1";
//     if (offset === 2) return "card-3d right-2";
//     if (offset === total - 1) return "card-3d left-1";
//     if (offset === total - 2) return "card-3d left-2";
//     return "card-3d hidden";
//   };

//   const handlePrev = () => {
//     setCurrentIndex((prev) => (prev - 1 + families.length) % families.length);
//   };

//   const handleNextSlide = () => {
//     setCurrentIndex((prev) => (prev + 1) % families.length);
//   };

//   const handleBack = () => navigate(-1);

//   const handleNextPage = async () => {
//     const selectedFamily = families[currentIndex];
//     if (!selectedShade || !selectedFamily) return;

//     setLoadingNext(true);
//     try {
//       const res = await fetch(
//         `https://beauty.joyory.com/api/user/shadefinder/formulations?familyKey=${selectedFamily.key}&toneKey=${selectedShade.key}&undertoneKey=${undertoneKey}`
//       );
//       const data = await res.json();
//       navigate("/foundation", {
//         state: {
//           shade: selectedShade,
//           undertoneKey,
//           family: selectedFamily,
//           formulations: data.formulations || [],
//         },
//       });
//     } catch (err) {
//       console.error("Error fetching formulations:", err);
//     } finally {
//       setLoadingNext(false);
//     }
//   };

//   return (
//     <>
//       <Header />

//       <div className="shadetone-wrapper">
//         {/* <h1 className="about-title ">CHOOSE FAMILY</h1> */}

//         <div className="container text-center">


//           <div className="member-info-3d">
//             <h2 className="member-name-3d"> SelectedShade :- &nbsp;
//               {families[currentIndex]?.name}
//             </h2>
//           </div>


//           {loadingFamilies ? (
//             <div className="spinner-border text-primary" role="status"></div>
//           ) : families.length > 0 ? (
//             <>
//               {/* 3D Carousel Container */}
//               <div className="carousel-container-3d">
//                 <button className="nav-arrow-3d left" onClick={handlePrev}>‹</button>

//                 <div className="carousel-track-3d">
//                   {families.map((family, index) => (
//                     <div
//                       key={family._id}
//                       className={getCardClass(index)}
//                       onClick={() => setCurrentIndex(index)}
//                     >
//                       <img
//                         src={family.sampleImages || "https://via.placeholder.com/280x380"}
//                         alt={family.name}
//                       />
//                     </div>
//                   ))}
//                 </div>

//                 <button className="nav-arrow-3d right" onClick={handleNextSlide}>›</button>
//               </div>

//               {/* Family Details Info */}
//               {/* <div className="member-info-3d">
//                 <h2 className="member-name-3d">{families[currentIndex]?.name}</h2>
//                 <p className="member-role-3d">{families[currentIndex]?.description}</p>
//               </div> */}

//               {/* Navigation Dots */}
//               {/* <div className="dots-3d">
//                 {families.map((_, index) => (
//                   <div
//                     key={index}
//                     className={`dot-3d ${currentIndex === index ? "active" : ""}`}
//                     onClick={() => setCurrentIndex(index)}
//                   ></div>
//                 ))}
//               </div> */}
//             </>
//           ) : (
//             <p>No matching families found.</p>
//           )}

//           {/* Action Buttons */}
//           <div className="d-flex justify-content-center gap-3 mt-3">
//             <button className="btn btn-outline-secondary px-5 py-2" onClick={handleBack}>
//               Back
//             </button>
//             <button
//               className="btn btn-primary px-5 py-2"
//               onClick={handleNextPage}
//               disabled={families.length === 0 || loadingNext}
//             >
//               {loadingNext ? "Loading..." : "Confirm Selection"}
//             </button>
//           </div>




//         </div>
//       </div>
//       {/* <div className="wavy-footer-bg">
//             <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
//               <path
//                 fill="#D6E3E9"
//                 fillOpacity="1"
//                 d="M0,224L80,202.7C160,181,320,139,480,144C640,149,800,203,960,213.3C1120,224,1280,192,1360,176L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
//               ></path>
//             </svg>
//           </div> */}

//       {/* <Footer /> */}
//     </>
//   );
// }