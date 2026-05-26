
// // import React, { useState, useEffect, useRef } from "react";
// // import { useNavigate } from "react-router-dom";
// // import Slider from "react-slick";
// // import "bootstrap/dist/css/bootstrap.min.css";
// // import "slick-carousel/slick/slick.css";
// // import "slick-carousel/slick/slick-theme.css";
// // import Header from "./Header";
// // import Footer from "./Footer";


// // export default function SkinToneSelector() {
// //   const [tones, setTones] = useState([]);
// //   const [selectedShade, setSelectedShade] = useState(null);
// //   const [selectedImage, setSelectedImage] = useState(null);
// //   const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Track screen size
// //   const sliderRef = useRef(null);
// //   const navigate = useNavigate();

// //   // Fetch tones
// //   useEffect(() => {
// //     const fetchTones = async () => {
// //       try {
// //         const res = await fetch(
// //           "https://beauty.joyory.com/api/user/shadefinder/tones"
// //         );
// //         const data = await res.json();
// //         if (data.success && Array.isArray(data.tones)) {
// //           setTones(data.tones);
// //         }
// //       } catch (err) {
// //         console.error("Error fetching tones:", err);
// //       }
// //     };
// //     fetchTones();
// //   }, []);

// //   // Track window resize for responsive behavior
// //   useEffect(() => {
// //     const handleResize = () => setWindowWidth(window.innerWidth);
// //     window.addEventListener("resize", handleResize);
// //     return () => window.removeEventListener("resize", handleResize);
// //   }, []);

// //   // Handle shade click
// //   const handleShadeClick = (tone) => {
// //     setSelectedShade(tone);
// //     setSelectedImage(tone.name);
// //     const index = tones.findIndex((t) => t.name === tone.name);
// //     if (sliderRef.current && index >= 0) sliderRef.current.slickGoTo(index);
// //   };

// //   // Handle Next click → fetch undertones and navigate
// //   const handleNext = async () => {
// //     if (!selectedShade) return;

// //     try {
// //       const res = await fetch(
// //         `https://beauty.joyory.com/api/user/shadefinder/undertones?toneKey=${selectedShade.key}`
// //       );
// //       const data = await res.json();

// //       navigate("/shadefinderundertone", {
// //         state: {
// //           shade: selectedShade,
// //           undertones: data.undertones || [],
// //         },
// //       });
// //     } catch (err) {
// //       console.error("Error fetching undertones:", err);
// //     }
// //   };

// //   // Dynamic slider settings
// //   const getSlidesToShow = () => {
// //     if (windowWidth < 480) return 1; // Mobile
// //     if (windowWidth < 767) return 2; // Small tablet
// //     if (windowWidth < 992) return 3; // Large tablet
// //     return 4; // Desktop
// //   };

// //   const settings = {
// //     dots: true,
// //     infinite: false,
// //     speed: 500,
// //     slidesToShow: getSlidesToShow(),
// //     slidesToScroll: 1,
// //     adaptiveHeight: true,
// //     arrows: windowWidth >= 768, // Hide arrows on small screens
// //   };

// //   return (
// //     <>
// //     <Header />

// //     <div className="container py-4">
// //       <h5 className="text-center mb-4">
// //         Select the shade range closest to your skin tone
// //       </h5>

// //       {/* Shade Selector */}
// //       <div className="d-flex justify-content-center mb-4 flex-wrap">
// //         {tones.map((tone) => (
// //           <div
// //             key={tone._id}
// //             className="m-2 p-2 text-center"
// //             style={{ cursor: "pointer" }}
// //             onClick={() => handleShadeClick(tone)}
// //           >
// //             <div
// //               className={`border ${
// //                 selectedShade?.name === tone.name
// //                   ? "border-3 border-primary"
// //                   : "border-light"
// //               }`}
// //               style={{
// //                 backgroundColor: tone.swatchHex || "#ddd",
// //                 width: "60px",
// //                 height: "40px",
// //                 borderRadius: "6px",
// //               }}
// //             />
// //             <p style={{ marginTop: "5px", fontSize: "0.8rem" }}>{tone.name}</p>
// //           </div>
// //         ))}
// //       </div>

// //       {/* Image Slider */}
// //       {tones.length > 0 && (
// //         <Slider key={windowWidth} ref={sliderRef} {...settings}>
// //           {tones.map((tone) => (
// //             <div key={tone._id} className="p-3">
// //               <div
// //                 className={`p-2 rounded border ${
// //                   selectedImage === tone.name
// //                     ? "border-3 border-primary"
// //                     : "border-light"
// //                 }`}
// //                 style={{ cursor: "pointer" }}
// //                 onClick={() => setSelectedImage(tone.name)}
// //               >
// //                 <img
// //                   src={
// //                     tone.heroImage ||
// //                     "https://via.placeholder.com/200x200?text=No+Image"
// //                   }
// //                   alt={tone.name}
// //                   className="img-fluid mx-auto d-block"
// //                   style={{
// //                     maxHeight: "300px",
// //                     objectFit: "cover",
// //                     width: "100%",
// //                   }}
// //                 />
// //                 <p className="mt-2 text-center">{tone.name}</p>
// //               </div>
// //             </div>
// //           ))}
// //         </Slider>
// //       )}

// //       {/* Next Button */}
// //       <div className="d-flex justify-content-center mt-4">
// //         <button
// //           className="btn btn-primary"
// //           disabled={!selectedShade}
// //           onClick={handleNext}
// //         >
// //           Next
// //         </button>
// //       </div>
// //     </div>

// //     <Footer />
// // </>
// //   );
// // }








// // import React, { useState, useEffect, useRef } from "react";
// // import { useNavigate } from "react-router-dom";
// // import Slider from "react-slick";
// // import "bootstrap/dist/css/bootstrap.min.css";
// // import "slick-carousel/slick/slick.css";
// // import "slick-carousel/slick/slick-theme.css";
// // import Header from "./Header";
// // import Footer from "./Footer";


// // export default function SkinToneSelector() {
// //   const [tones, setTones] = useState([]);
// //   const [selectedShade, setSelectedShade] = useState(null);
// //   const [selectedImage, setSelectedImage] = useState(null);
// //   const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Track screen size
// //   const sliderRef = useRef(null);
// //   const navigate = useNavigate();

// //   // Fetch tones
// //   useEffect(() => {
// //     const fetchTones = async () => {
// //       try {
// //         const res = await fetch(
// //           "https://beauty.joyory.com/api/user/shadefinder/tones"
// //         );
// //         const data = await res.json();
// //         if (data.success && Array.isArray(data.tones)) {
// //           setTones(data.tones);
// //         }
// //       } catch (err) {
// //         console.error("Error fetching tones:", err);
// //       }
// //     };
// //     fetchTones();
// //   }, []);

// //   // Track window resize for responsive behavior
// //   useEffect(() => {
// //     const handleResize = () => setWindowWidth(window.innerWidth);
// //     window.addEventListener("resize", handleResize);
// //     return () => window.removeEventListener("resize", handleResize);
// //   }, []);

// //   // Handle shade click
// //   const handleShadeClick = (tone) => {
// //     setSelectedShade(tone);
// //     setSelectedImage(tone.name);
// //     const index = tones.findIndex((t) => t.name === tone.name);
// //     if (sliderRef.current && index >= 0) sliderRef.current.slickGoTo(index);
// //   };

// //   // Handle Next click → fetch undertones and navigate
// //   const handleNext = async () => {
// //     if (!selectedShade) return;

// //     try {
// //       const res = await fetch(
// //         `https://beauty.joyory.com/api/user/shadefinder/undertones?toneKey=${selectedShade.key}`
// //       );
// //       const data = await res.json();

// //       navigate("/shadefinderundertone", {
// //         state: {
// //           shade: selectedShade,
// //           undertones: data.undertones || [],
// //         },
// //       });
// //     } catch (err) {
// //       console.error("Error fetching undertones:", err);
// //     }
// //   };

// //   // Dynamic slider settings
// //   const getSlidesToShow = () => {
// //     if (windowWidth < 480) return 1; // Mobile
// //     if (windowWidth < 767) return 2; // Small tablet
// //     if (windowWidth < 992) return 3; // Large tablet
// //     return 4; // Desktop
// //   };

// //   const settings = {
// //     dots: true,
// //     infinite: false,
// //     speed: 500,
// //     slidesToShow: getSlidesToShow(),
// //     slidesToScroll: 1,
// //     adaptiveHeight: true,
// //     arrows: windowWidth >= 768, // Hide arrows on small screens
// //   };

// //   return (
// //     <>
// //     <Header />

// //     <div className="container py-4">
// //       <h5 className="text-center mb-4">
// //         Select the shade range closest to your skin tone
// //       </h5>

// //       {/* Shade Selector */}
// //       <div className="d-flex justify-content-center mb-4 flex-wrap">
// //         {tones.map((tone) => (
// //           <div
// //             key={tone._id}
// //             className="m-2 p-2 text-center"
// //             style={{ cursor: "pointer" }}
// //             onClick={() => handleShadeClick(tone)}
// //           >
// //             <div
// //               className={`border ${
// //                 selectedShade?.name === tone.name
// //                   ? "border-3 border-primary"
// //                   : "border-light"
// //               }`}
// //               style={{
// //                 backgroundColor: tone.swatchHex || "#ddd",
// //                 width: "60px",
// //                 height: "40px",
// //                 borderRadius: "6px",
// //               }}
// //             />
// //             <p style={{ marginTop: "5px", fontSize: "0.8rem" }}>{tone.name}</p>
// //           </div>
// //         ))}
// //       </div>

// //       {/* Image Slider */}
// //       {tones.length > 0 && (
// //         <Slider key={windowWidth} ref={sliderRef} {...settings}>
// //           {tones.map((tone) => (
// //             <div key={tone._id} className="p-3">
// //               <div
// //                 className={`p-2 rounded border ${
// //                   selectedImage === tone.name
// //                     ? "border-3 border-primary"
// //                     : "border-light"
// //                 }`}
// //                 style={{ cursor: "pointer" }}
// //                 onClick={() => setSelectedImage(tone.name)}
// //               >
// //                 <img
// //                   src={
// //                     tone.heroImages ||
// //                     "https://via.placeholder.com/200x200?text=No+Image"
// //                   }
// //                   alt={tone.name}
// //                   className="img-fluid mx-auto d-block"
// //                   style={{
// //                     maxHeight: "300px",
// //                     objectFit: "cover",
// //                     width: "100%",
// //                   }}
// //                 />
// //                 <p className="mt-2 text-center">{tone.name}</p>
// //               </div>
// //             </div>
// //           ))}
// //         </Slider>
// //       )}

// //       {/* Next Button */}
// //       <div className="d-flex justify-content-center mt-4">
// //         <button
// //           className="btn btn-primary"
// //           disabled={!selectedShade}
// //           onClick={handleNext}
// //         >
// //           Next
// //         </button>
// //       </div>
// //     </div>

// //     <Footer />
// // </>
// //   );
// // }























// // import React, { useState, useEffect, useRef } from "react";
// // import { useNavigate } from "react-router-dom";
// // import "bootstrap/dist/css/bootstrap.min.css";
// // import Header from "./Header";
// // import Footer from "./Footer";
// // import "../css/shadefinder.css"; // Create this CSS file

// // export default function SkinToneSelector() {
// //   const [tones, setTones] = useState([]);
// //   const [selectedShade, setSelectedShade] = useState(null);
// //   const [windowWidth, setWindowWidth] = useState(window.innerWidth);
// //   const navigate = useNavigate();

// //   // Fetch tones
// //   useEffect(() => {
// //     const fetchTones = async () => {
// //       try {
// //         const res = await fetch(
// //           "https://beauty.joyory.com/api/user/shadefinder/tones"
// //         );
// //         const data = await res.json();
// //         if (data.success && Array.isArray(data.tones)) {
// //           setTones(data.tones);
// //           // Optionally select first tone by default
// //           if (data.tones.length > 0) {
// //             setSelectedShade(data.tones[0]);
// //           }
// //         }
// //       } catch (err) {
// //         console.error("Error fetching tones:", err);
// //       }
// //     };
// //     fetchTones();
// //   }, []);

// //   // Track window resize
// //   useEffect(() => {
// //     const handleResize = () => setWindowWidth(window.innerWidth);
// //     window.addEventListener("resize", handleResize);
// //     return () => window.removeEventListener("resize", handleResize);
// //   }, []);

// //   // Handle shade/category click
// //   const handleShadeClick = (tone) => {
// //     setSelectedShade(tone);
// //   };

// //   // Handle Next click
// //   const handleNext = async () => {
// //     if (!selectedShade) return;

// //     try {
// //       const res = await fetch(
// //         `https://beauty.joyory.com/api/user/shadefinder/undertones?toneKey=${selectedShade.key}`
// //       );
// //       const data = await res.json();

// //       navigate("/shadefinderundertone", {
// //         state: {
// //           shade: selectedShade,
// //           undertones: data.undertones || [],
// //         },
// //       });
// //     } catch (err) {
// //       console.error("Error fetching undertones:", err);
// //     }
// //   };

// //   // Calculate indicator position based on selected shade index
// //   const getIndicatorPosition = () => {
// //     if (!selectedShade || tones.length === 0) return 0;
// //     const index = tones.findIndex(t => t._id === selectedShade._id);
// //     return (index / (tones.length - 1)) * 100;
// //   };

// //   // Generate gradient from tone swatches
// //   const getGradientColors = () => {
// //     if (tones.length === 0) return 'linear-gradient(to bottom, #f5d5c8, #4a3728)';
// //     const colors = tones.map(t => t.swatchHex || '#ddd').join(', ');
// //     return `linear-gradient(to bottom, ${colors})`;
// //   };

// //   // Determine grid columns based on screen width
// //   const getGridCols = () => {
// //     if (windowWidth < 576) return 2; // Mobile
// //     if (windowWidth < 768) return 3; // Small tablet
// //     if (windowWidth < 1200) return 4; // Tablet
// //     return 5; // Desktop
// //   };

// //   return (
// //     <>
// //       <Header />

// //       <div className="skin-tone-selector" style={{ backgroundColor: "#1a1a1a", minHeight: "100vh" }}>
// //         {/* Header Section */}
// //         <div className="text-center pt-5 pb-4 px-3">
// //           <h2 className="text-white fw-normal mb-2" style={{ fontSize: "28px", letterSpacing: "0.5px" }}>
// //             Find your Shade Range
// //           </h2>
// //           <p className="text-secondary mb-0" style={{ fontSize: "16px", fontWeight: "300" }}>
// //             Choose the group that best represents your skin tone
// //           </p>
// //         </div>

// //         {/* Main Content */}
// //         <div className="container-fluid px-4 px-lg-5 pb-5">
// //           <div className="row g-0">

// //             {/* Left Side - Gradient Bar & Categories */}
// //             <div className="col-auto d-flex flex-row ps-lg-4">
// //               {/* Vertical Gradient Bar */}
// //               <div 
// //                 className="gradient-bar me-3 me-lg-4 position-relative"
// //                 style={{
// //                   width: "4px",
// //                   height: "500px",
// //                   background: getGradientColors(),
// //                   borderRadius: "2px",
// //                 }}
// //               >
// //                 {/* Indicator Circle */}
// //                 {selectedShade && (
// //                   <div 
// //                     className="position-absolute"
// //                     style={{
// //                       width: "16px",
// //                       height: "16px",
// //                       backgroundColor: selectedShade.swatchHex || '#fff',
// //                       border: "2px solid #fff",
// //                       borderRadius: "50%",
// //                       left: "-6px",
// //                       top: `${getIndicatorPosition()}%`,
// //                       transform: "translateY(-50%)",
// //                       transition: "top 0.3s ease",
// //                       boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
// //                     }}
// //                   />
// //                 )}
// //               </div>

// //               {/* Category Labels */}
// //               <div 
// //                 className="category-labels d-flex flex-column justify-content-between" 
// //                 style={{ height: "500px" }}
// //               >
// //                 {tones.map((tone) => (
// //                   <div 
// //                     key={tone._id}
// //                     className={`category-label py-2 ${selectedShade?._id === tone._id ? 'text-white' : 'text-secondary'}`}
// //                     style={{
// //                       fontSize: windowWidth < 768 ? "12px" : "14px",
// //                       fontWeight: selectedShade?._id === tone._id ? "500" : "400",
// //                       cursor: "pointer",
// //                       transition: "all 0.3s ease",
// //                       opacity: selectedShade?._id === tone._id ? 1 : 0.6,
// //                       whiteSpace: "nowrap"
// //                     }}
// //                     onClick={() => handleShadeClick(tone)}
// //                   >
// //                     {tone.name}
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>

// //             {/* Right Side - Image Grid */}
// //             <div className="col ps-3 ps-lg-5">
// //               <div className="shade-grid">
// //                 <div 
// //                   className="row g-3"
// //                   style={{
// //                     display: 'grid',
// //                     gridTemplateColumns: `repeat(${getGridCols()}, 1fr)`,
// //                     gap: '15px'
// //                   }}
// //                 >
// //                   {tones.map((tone, index) => {
// //                     const isSelected = selectedShade?._id === tone._id;

// //                     return (
// //                       <div 
// //                         key={tone._id}
// //                         className="shade-card-wrapper"
// //                         onClick={() => handleShadeClick(tone)}
// //                       >
// //                         <div 
// //                           className="shade-card position-relative"
// //                           style={{
// //                             cursor: "pointer",
// //                             borderRadius: "8px",
// //                             overflow: "hidden",
// //                             border: isSelected ? "3px solid #007bff" : "3px solid transparent",
// //                             transition: "all 0.3s ease",
// //                             backgroundColor: "#2a2a2a",
// //                             boxShadow: isSelected 
// //                               ? "0 0 0 2px #007bff, 0 4px 12px rgba(0,0,0,0.4)" 
// //                               : "0 4px 6px rgba(0,0,0,0.3)",
// //                             transform: isSelected ? "scale(1.02)" : "scale(1)"
// //                           }}
// //                         >
// //                           <img 
// //                             src={tone.Images || "https://via.placeholder.com/300x400?text=No+Image"}
// //                             alt={tone.name}
// //                             className="img-fluid w-100"
// //                             style={{
// //                               aspectRatio: "3/4",
// //                               objectFit: "cover",
// //                               display: "block"
// //                             }}
// //                           />

// //                           {/* Selection Badge (Blue Circle with Letter) */}
// //                           {isSelected && (
// //                             <div 
// //                               className="position-absolute d-flex align-items-center justify-content-center"
// //                               style={{
// //                                 top: "10px",
// //                                 right: "10px",
// //                                 width: "32px",
// //                                 height: "32px",
// //                                 backgroundColor: "#007bff",
// //                                 borderRadius: "50%",
// //                                 border: "2px solid #fff",
// //                                 boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
// //                                 zIndex: 10
// //                               }}
// //                             >
// //                               <span className="text-white fw-bold" style={{ fontSize: "14px" }}>
// //                                 {String.fromCharCode(65 + index)} {/* A, B, C, etc. */}
// //                               </span>
// //                             </div>
// //                           )}

// //                           {/* Shade Name Overlay */}
// //                           <div 
// //                             className="position-absolute bottom-0 start-0 w-100 p-2"
// //                             style={{
// //                               background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
// //                               color: "#fff",
// //                               fontSize: "12px",
// //                               textAlign: "center",
// //                               fontWeight: "500"
// //                             }}
// //                           >
// //                             {tone.name}
// //                           </div>
// //                         </div>
// //                       </div>
// //                     );
// //                   })}
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Next Button */}
// //         <div 
// //           className="position-fixed bottom-0 end-0 p-4 p-lg-5"
// //           style={{ zIndex: 1000 }}
// //         >
// //           <button 
// //             onClick={handleNext}
// //             disabled={!selectedShade}
// //             className="btn btn-link text-white text-decoration-none d-flex align-items-center gap-2"
// //             style={{
// //               fontSize: "16px",
// //               opacity: selectedShade ? 1 : 0.5,
// //               cursor: selectedShade ? "pointer" : "not-allowed",
// //               transition: "all 0.3s ease",
// //               background: "none",
// //               border: "none"
// //             }}
// //           >
// //             Next <span style={{ fontSize: "20px" }}>→</span>
// //           </button>
// //         </div>
// //       </div>

// //       <Footer />
// //     </>
// //   );
// // }





















// // import React, { useState, useEffect, useRef } from "react";
// // import { useNavigate } from "react-router-dom";
// // import "bootstrap/dist/css/bootstrap.min.css";
// // import Header from "./Header";
// // import Footer from "./Footer";
// // import "../css/shadefinder.css";

// // export default function SkinToneSelector() {
// //   const [tones, setTones] = useState([]);
// //   const [selectedShade, setSelectedShade] = useState(null);
// //   const [windowWidth, setWindowWidth] = useState(window.innerWidth);
// //   const gradientBarRef = useRef(null);
// //   const navigate = useNavigate();

// //   // Fetch tones
// //   useEffect(() => {
// //     const fetchTones = async () => {
// //       try {
// //         const res = await fetch(
// //           "https://beauty.joyory.com/api/user/shadefinder/tones"
// //         );
// //         const data = await res.json();
// //         if (data.success && Array.isArray(data.tones)) {
// //           setTones(data.tones);
// //           // Select first tone that has images by default
// //           const firstWithImages = data.tones.find(t => t.heroImages && t.heroImages.length > 0);
// //           if (firstWithImages) {
// //             setSelectedShade(firstWithImages);
// //           } else if (data.tones.length > 0) {
// //             setSelectedShade(data.tones[0]);
// //           }
// //         }
// //       } catch (err) {
// //         console.error("Error fetching tones:", err);
// //       }
// //     };
// //     fetchTones();
// //   }, []);

// //   // Track window resize
// //   useEffect(() => {
// //     const handleResize = () => setWindowWidth(window.innerWidth);
// //     window.addEventListener("resize", handleResize);
// //     return () => window.removeEventListener("resize", handleResize);
// //   }, []);

// //   // Handle shade/category click (from sidebar or dots)
// //   const handleShadeClick = (tone) => {
// //     setSelectedShade(tone);
// //   };

// //   // Handle Next click
// //   const handleNext = async () => {
// //     if (!selectedShade) return;

// //     try {
// //       const res = await fetch(
// //         `https://beauty.joyory.com/api/user/shadefinder/undertones?toneKey=${selectedShade.key}`
// //       );
// //       const data = await res.json();

// //       navigate("/shadefinderundertone", {
// //         state: {
// //           shade: selectedShade,
// //           undertones: data.undertones || [],
// //         },
// //       });
// //     } catch (err) {
// //       console.error("Error fetching undertones:", err);
// //     }
// //   };

// //   // Calculate indicator position based on selected shade index
// //   const getIndicatorPosition = () => {
// //     if (!selectedShade || tones.length === 0) return 0;
// //     const index = tones.findIndex(t => t._id === selectedShade._id);
// //     return (index / (tones.length - 1)) * 100;
// //   };

// //   // Generate gradient from tone swatches
// //   const getGradientColors = () => {
// //     if (tones.length === 0) return 'linear-gradient(to bottom, #f5d5c8, #4a3728)';
// //     const colors = tones.map(t => t.swatchHex || '#ddd').join(', ');
// //     return `linear-gradient(to bottom, ${colors})`;
// //   };

// //   // Handle clicking on the gradient bar to select nearest tone
// //   const handleGradientClick = (e) => {
// //     if (!gradientBarRef.current || tones.length === 0) return;

// //     const rect = gradientBarRef.current.getBoundingClientRect();
// //     const clickY = e.clientY - rect.top;
// //     const percentage = clickY / rect.height;

// //     // Calculate nearest tone index
// //     const index = Math.round(percentage * (tones.length - 1));
// //     const clampedIndex = Math.max(0, Math.min(index, tones.length - 1));

// //     setSelectedShade(tones[clampedIndex]);
// //   };

// //   // Handle dot button click
// //   const handleDotClick = (e, tone) => {
// //     e.stopPropagation(); // Prevent gradient click
// //     setSelectedShade(tone);
// //   };

// //   // ✅ UPDATED: Get only images for the selected tone
// //   const getSelectedToneImages = () => {
// //     if (!selectedShade) return [];

// //     const images = [];
// //     if (selectedShade.heroImages && Array.isArray(selectedShade.heroImages) && selectedShade.heroImages.length > 0) {
// //       selectedShade.heroImages.forEach((imageUrl, imgIndex) => {
// //         images.push({
// //           id: `${selectedShade._id}-${imgIndex}`,
// //           imageUrl: imageUrl,
// //           tone: selectedShade,
// //           imageIndex: imgIndex
// //         });
// //       });
// //     } else {
// //       // Add placeholder if no images
// //       images.push({
// //         id: `${selectedShade._id}-placeholder`,
// //         imageUrl: "https://via.placeholder.com/300x400?text=No+Image",
// //         tone: selectedShade,
// //         imageIndex: 0,
// //         isPlaceholder: true
// //       });
// //     }
// //     return images;
// //   };

// //   // Get tone index for letter badge (A, B, C, etc.)
// //   const getSelectedToneIndex = () => {
// //     if (!selectedShade) return 0;
// //     return tones.findIndex(t => t._id === selectedShade._id);
// //   };

// //   // Determine grid columns based on screen width and image count
// //   const getGridCols = () => {
// //     const imageCount = getSelectedToneImages().length;

// //     // If only 1-2 images, show fewer columns
// //     if (imageCount === 1) return 1;
// //     if (imageCount === 2) return 2;

// //     // Otherwise use responsive breakpoints
// //     if (windowWidth < 576) return 2;
// //     if (windowWidth < 768) return 3;
// //     if (windowWidth < 1200) return 4;
// //     return 5;
// //   };

// //   const selectedImages = getSelectedToneImages();
// //   const selectedToneIndex = getSelectedToneIndex();

// //   return (
// //     <>
// //       <Header />

// //       <div className="skin-tone-selector" style={{ backgroundColor: "#1a1a1a", minHeight: "100vh" }}>
// //         {/* Header Section */}
// //         <div className="text-center pt-5 pb-4 px-3">
// //           <h2 className="text-white fw-normal mb-2" style={{ fontSize: "28px", letterSpacing: "0.5px" }}>
// //             Find your Shade Range
// //           </h2>
// //           <p className="text-secondary mb-0" style={{ fontSize: "16px", fontWeight: "300" }}>
// //             Choose the group that best represents your skin tone
// //           </p>
// //         </div>

// //         {/* Main Content */}
// //         <div className="container-fluid px-4 px-lg-5 pb-5">
// //           <div className="row g-0">

// //             {/* Left Side - Gradient Bar & Categories */}
// //             <div className="col-lg-2 col-3 d-flex flex-row ps-lg-4">
// //               {/* Vertical Gradient Bar with Clickable Dots */}
// //               <div className="position-relative me-3 me-lg-4">
// //                 {/* The Gradient Bar */}
// //                 <div 
// //                   ref={gradientBarRef}
// //                   className="gradient-bar"
// //                   onClick={handleGradientClick}
// //                   style={{
// //                     width: "4px",
// //                     height: "500px",
// //                     background: getGradientColors(),
// //                     borderRadius: "2px",
// //                     cursor: "pointer",
// //                     position: "relative",
// //                   }}
// //                 >
// //                   {/* Clickable Dot Buttons along the bar */}
// //                   {tones.map((tone, index) => {
// //                     const position = (index / (tones.length - 1)) * 100;
// //                     const isSelected = selectedShade?._id === tone._id;

// //                     return (
// //                       <button
// //                         key={tone._id}
// //                         className="gradient-dot-btn shadefinder-doot"
// //                         onClick={(e) => handleDotClick(e, tone)}
// //                         title={tone.name}
// //                         style={{
// //                           position: "absolute",
// //                           left: "50%",
// //                           top: `${position}%`,
// //                           transform: "translate(-50%, -50%)",
// //                           width: isSelected ? "28px" : "28px",
// //                           height: isSelected ? "15px" : "28px",
// //                           // width: isSelected ? "0" : "0",
// //                           // height: isSelected ? "0" : "0",
// //                           borderRadius: "50%",
// //                           border: "2px solid #fff",
// //                           backgroundColor: tone.swatchHex || "#ddd",
// //                           cursor: "pointer",
// //                           zIndex: 10,
// //                           transition: "all 0.3s ease",
// //                           boxShadow: isSelected 
// //                             ? "0 0 0 4px rgba(255,255,255,0.3), 0 4px 12px rgba(0,0,0,0.4)" 
// //                             : "0 2px 8px rgba(0,0,0,0.3)",
// //                           padding: 0,
// //                           outline: "none",
// //                         }}
// //                         onMouseEnter={(e) => {
// //                           e.target.style.transform = "translate(-50%, -50%) scale(1.2)";
// //                         }}
// //                         onMouseLeave={(e) => {
// //                           e.target.style.transform = "translate(-50%, -50%) scale(1)";
// //                         }}
// //                       />
// //                     );
// //                   })}

// //                   {/* Animated Indicator Circle (slides to selected position) */}
// //                   {selectedShade && (
// //                     <div 
// //                       className="position-absolute"
// //                       style={{
// //                         width: "20px",
// //                         height: "20px",
// //                         backgroundColor: "#fff",
// //                         border: `3px solid ${selectedShade.swatchHex || '#007bff'}`,
// //                         borderRadius: "50%",
// //                         left: "-8px",
// //                         top: `${getIndicatorPosition()}%`,
// //                         transform: "translateY(-50%)",
// //                         transition: "top 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
// //                         boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
// //                         zIndex: 20,
// //                         pointerEvents: "none", // Let clicks pass through to dots
// //                       }}
// //                     />
// //                   )}
// //                 </div>
// //               </div>

// //               {/* Category Labels - Also clickable */}
// //               <div 
// //                 className="category-labels d-flex flex-column justify-content-between" 
// //                 style={{ height: "500px" }}
// //               >
// //                 {tones.map((tone) => (
// //                   <div 
// //                     key={tone._id}
// //                     className={`category-label py-2 ms-3 ${selectedShade?._id === tone._id ? 'text-white' : 'text-secondary'}`}
// //                     style={{
// //                       fontSize: windowWidth < 768 ? "12px" : "14px",
// //                       fontWeight: selectedShade?._id === tone._id ? "500" : "400",
// //                       cursor: "pointer",
// //                       transition: "all 0.3s ease",
// //                       opacity: selectedShade?._id === tone._id ? 1 : 0.6,
// //                       whiteSpace: "nowrap",
// //                       userSelect: "none"
// //                     }}
// //                     onClick={() => handleShadeClick(tone)}
// //                     onMouseEnter={(e) => {
// //                       if (selectedShade?._id !== tone._id) {
// //                         e.target.style.opacity = "0.8";
// //                       }
// //                     }}
// //                     onMouseLeave={(e) => {
// //                       if (selectedShade?._id !== tone._id) {
// //                         e.target.style.opacity = "0.6";
// //                       }
// //                     }}
// //                   >
// //                     {tone.name}
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>

// //             {/* Right Side - Image Grid (Shows ONLY selected tone's images) */}
// //             <div className="col-lg-10 col-9 ps-3">
// //               <div className="shade-grid">
// //                 {/* Show selected tone name as heading */}
// //                 <div className="mb-3">
// //                   <h4 className="text-white fw-normal mb-2">
// //                     {selectedShade?.name || 'Select a Shade'}
// //                     {selectedImages.length > 0 && !selectedImages[0].isPlaceholder && (
// //                       <span className="text-secondary ms-2" style={{ fontSize: "14px" }}>
// //                         ({selectedImages.length} {selectedImages.length === 1 ? 'photo' : 'photos'})
// //                       </span>
// //                     )}
// //                   </h4>
// //                 </div>

// //                 <div 
// //                   className=" g-3"
// //                   style={{
// //                     display: 'grid',
// //                     gridTemplateColumns: `repeat(${getGridCols()}, 1fr)`,
// //                     gap: '15px'
// //                   }}
// //                 >
// //                   {selectedImages.map((item, index) => {
// //                     const isSelected = true; // All visible images belong to selected tone

// //                     return (


// //                       // <div className="col-md-">

// //                       <div 
// //                         key={item.id}
// //                         className="shade-card-wrapper"
// //                         style={{
// //                           opacity: item.isPlaceholder ? 0.5 : 1,
// //                         }}
// //                       >
// //                         <div 
// //                           className="shade-card position-relative"
// //                           style={{
// //                             cursor: item.isPlaceholder ? "not-allowed" : "pointer",
// //                             borderRadius: "8px",
// //                             overflow: "hidden",
// //                             border: "none", // Always highlighted since these are selected tone images
// //                             transition: "all 0.3s ease",
// //                             backgroundColor: "#2a2a2a",
// //                             boxShadow: "none",
// //                           }}
// //                         >
// //                           <img 
// //                             src={item.imageUrl}
// //                             alt={`${item.tone.name} - ${item.imageIndex + 1}`}
// //                             className="img-fluid"
// //                             style={{
// //                               aspectRatio: "3/4",
// //                               objectFit: "cover",
// //                               display: "block",
// //                               minHeight: "250px",
// //                             }}
// //                             onError={(e) => {
// //                               e.target.src = "https://via.placeholder.com/300x400?text=Image+Error";
// //                             }}
// //                           />

// //                           {/* Image Counter Badge (shows 1/6, 2/6 etc if multiple) */}
// //                           {!item.isPlaceholder && selectedImages.length > 1 && (
// //                             <div 
// //                               className="position-absolute top-0 start-0 m-2 px-2 py-1 rounded"
// //                               style={{
// //                                 backgroundColor: "rgba(0,0,0,0.6)",
// //                                 color: "#fff",
// //                                 fontSize: "10px",
// //                                 fontWeight: "500"
// //                               }}
// //                             >
// //                               {item.imageIndex + 1}/{selectedImages.length}
// //                             </div>
// //                           )}

// //                           {/* Selection Badge (Blue Circle with Letter) - Only on first image */}
// //                           {item.imageIndex === 0 && (
// //                             <div 
// //                               className="position-absolute d-flex align-items-center justify-content-center"
// //                               style={{
// //                                 top: "10px",
// //                                 right: "10px",
// //                                 width: "32px",
// //                                 height: "32px",
// //                                 backgroundColor: "#007bff",
// //                                 borderRadius: "50%",
// //                                 border: "2px solid #fff",
// //                                 boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
// //                                 zIndex: 10
// //                               }}
// //                             >
// //                               <span className="text-white fw-bold" style={{ fontSize: "14px" }}>
// //                                 {String.fromCharCode(65 + selectedToneIndex)}
// //                               </span>
// //                             </div>
// //                           )}

// //                           {/* Shade Name Overlay - Only on first image */}
// //                           {item.imageIndex === 0 && (
// //                             <div 
// //                               className="position-absolute bottom-0 start-0 w-100 p-2"
// //                               style={{
// //                                 background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
// //                                 color: "#fff",
// //                                 fontSize: "12px",
// //                                 textAlign: "center",
// //                                 fontWeight: "500"
// //                               }}
// //                             >
// //                               {item.tone.name}
// //                             </div>
// //                           )}
// //                         </div>
// //                       </div>


// //                         // </div>


// //                     );
// //                   })}
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Next Button */}
// //         <div 
// //           className="position-fixed bottom-0 end-0 p-4 p-lg-5"
// //           style={{ zIndex: 1000 }}
// //         >
// //           <button 
// //             onClick={handleNext}
// //             disabled={!selectedShade}
// //             className="btn btn-link text-white text-decoration-none d-flex align-items-center gap-2"
// //             style={{
// //               fontSize: "16px",
// //               opacity: selectedShade ? 1 : 0.5,
// //               cursor: selectedShade ? "pointer" : "not-allowed",
// //               transition: "all 0.3s ease",
// //               background: "none",
// //               border: "none"
// //             }}
// //           >
// //             Next <span style={{ fontSize: "20px" }}>→</span>
// //           </button>
// //         </div>
// //       </div>

// //       <Footer />
// //     </>
// //   );
// // }
















// // import React, { useState } from 'react';
// // import { ArrowRight } from 'lucide-react';
// // // import { motion, AnimatePresence } from 'motion/react';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import { Container, Row, Col } from 'react-bootstrap';

// // const SHADES = [
// //   { id: 'light', label: 'Light', color: '#F9E4D4' },
// //   { id: 'light-medium', label: 'Light Medium', color: '#E8C1A0' },
// //   { id: 'medium', label: 'Medium', color: '#D4A373' },
// //   { id: 'medium-tan', label: 'Medium Tan', color: '#A67C52' },
// //   { id: 'medium-deep', label: 'Medium Deep', color: '#7B4B2A' },
// //   { id: 'deep', label: 'Deep', color: '#3D1D11' },
// // ];

// // const MODEL_IMAGES = {
// //   'light': [
// //     'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=500',
// //     'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400&h=500',
// //     'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=400&h=500',
// //     'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400&h=500',
// //     'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=500',
// //     'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=500',
// //   ],
// //   'light-medium': [
// //     'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=400&h=500',
// //     'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&q=80&w=400&h=500',
// //     'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400&h=500',
// //     'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&q=80&w=400&h=500',
// //     'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400&h=500',
// //     'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400&h=500',
// //   ],
// //   'medium': [
// //     'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=400&h=500',
// //     'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&q=80&w=400&h=500',
// //     'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400&h=500',
// //     'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&q=80&w=400&h=500',
// //     'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400&h=500',
// //     'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400&h=500',
// //   ],
// //   'medium-tan': [
// //     'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=400&h=500',
// //     'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&q=80&w=400&h=500',
// //     'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400&h=500',
// //     'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&q=80&w=400&h=500',
// //     'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400&h=500',
// //     'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400&h=500',
// //   ],
// //   'medium-deep': [
// //     'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=400&h=500',
// //     'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&q=80&w=400&h=500',
// //     'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400&h=500',
// //     'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&q=80&w=400&h=500',
// //     'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400&h=500',
// //     'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400&h=500',
// //   ],
// //   'deep': [
// //     'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=400&h=500',
// //     'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&q=80&w=400&h=500',
// //     'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400&h=500',
// //     'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&q=80&w=400&h=500',
// //     'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400&h=500',
// //     'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400&h=500',
// //   ],
// // };

// // export default function Shadefinder() {
// //   const [activeShade, setActiveShade] = useState(SHADES[0]);

// //   const handleSliderChange = (e) => {
// //     const index = parseInt(e.target.value);
// //     setActiveShade(SHADES[index]);
// //   };

// //   return (
// //     <div className="bg-white py-5 px-3">
// //       <Container className="d-flex flex-column align-items-center">
// //         {/* Header Section */}
// //         <header className="text-center mb-5">
// //           <h1 className="display-5 fw-light mb-2">
// //             Find your Shade Range
// //           </h1>
// //           <p className="text-secondary small">
// //             Choose the group that best represents your skin tone
// //           </p>
// //         </header>

// //         {/* Slider Section */}
// //         <div className="w-100 mb-5 position-relative" style={{ maxWidth: '800px' }}>
// //           {/* Labels */}
// //           <div className="d-flex justify-content-between mb-3 px-1">
// //             {SHADES.map((shade) => (
// //               <button
// //                 key={shade.id}
// //                 onClick={() => setActiveShade(shade)}
// //                 className={`btn btn-link p-0 text-decoration-none transition-colors ${
// //                   activeShade.id === shade.id ? 'text-dark fw-bold' : 'text-muted'
// //                 }`}
// //                 style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}
// //               >
// //                 {shade.label}
// //               </button>
// //             ))}
// //           </div>

// //           {/* Custom Slider Track */}
// //           <div className="position-relative mb-5" style={{ height: '8px' }}>
// //             <div 
// //               className="position-absolute top-0 start-0 w-100 h-100 rounded-pill"
// //               style={{
// //                 background: `linear-gradient(to right, ${SHADES.map(s => s.color).join(', ')})`
// //               }}
// //             />

// //             {/* Actual Input Slider */}
// //             <input
// //               type="range"
// //               min="0"
// //               max={SHADES.length - 1}
// //               step="1"
// //               value={SHADES.findIndex(s => s.id === activeShade.id)}
// //               onChange={handleSliderChange}
// //               className="position-absolute top-0 start-0 w-100 h-100 opacity-0 cursor-pointer"
// //               style={{ zIndex: 20 }}
// //             />

// //             {/* Custom Thumb */}
// //             <motion.div
// //               className="position-absolute rounded-circle border border-2 border-white shadow-sm"
// //               animate={{
// //                 left: `${(SHADES.findIndex(s => s.id === activeShade.id) / (SHADES.length - 1)) * 100}%`,
// //                 backgroundColor: activeShade.color,
// //               }}
// //               transition={{ type: 'spring', stiffness: 300, damping: 30 }}
// //               style={{ 
// //                 width: '24px', 
// //                 height: '24px', 
// //                 top: '50%', 
// //                 transform: 'translate(-50%, -50%)',
// //                 zIndex: 10,
// //                 pointerEvents: 'none'
// //               }}
// //             />
// //           </div>
// //         </div>

// //         {/* Image Scroll Section */}
// //         <div className="w-100" style={{ maxWidth: '1000px' }}>
// //           <AnimatePresence mode="wait">
// //             <motion.div
// //               key={activeShade.id}
// //               initial={{ opacity: 0, x: 50 }}
// //               animate={{ opacity: 1, x: 0 }}
// //               exit={{ opacity: 0, x: -50 }}
// //               transition={{ duration: 0.4 }}
// //               className="d-flex flex-nowrap overflow-auto no-scrollbar gap-3 pb-3"
// //               style={{ cursor: 'grab' }}
// //             >
// //               {(MODEL_IMAGES[activeShade.id] || []).map((src, index) => (
// //                 <div 
// //                   key={`${activeShade.id}-${index}`}
// //                   className="flex-shrink-0"
// //                   style={{ width: '280px' }}
// //                 >
// //                   <div 
// //                     className="ratio ratio-4x5 overflow-hidden bg-light rounded-1 position-relative"
// //                   >
// //                     <img
// //                       src={src}
// //                       alt={`Model ${index + 1}`}
// //                       className="object-fit-cover w-100 h-100 transition-transform"
// //                       referrerPolicy="no-referrer"
// //                       style={{ transition: 'transform 0.5s ease' }}
// //                       onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
// //                       onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
// //                     />
// //                     <div className="position-absolute inset-0 bg-dark opacity-0 transition-opacity" style={{ pointerEvents: 'none' }} />
// //                   </div>
// //                 </div>
// //               ))}
// //             </motion.div>
// //           </AnimatePresence>
// //         </div>

// //         {/* Footer Section */}
// //         <footer className="w-100 mt-5 d-flex justify-content-end" style={{ maxWidth: '1000px' }}>
// //           <button className="btn btn-link text-dark text-decoration-none d-flex align-items-center gap-2 p-0">
// //             <span className="small fw-bold">Next</span>
// //             <ArrowRight size={16} />
// //           </button>
// //         </footer>
// //       </Container>
// //     </div>
// //   );
// // }













// // import React, { useState, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { ArrowRight } from 'lucide-react';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import { Container } from 'react-bootstrap';
// // import "bootstrap/dist/css/bootstrap.min.css";
// // import Header from "./Header";
// // import Footer from "./Footer";
// // import "../css/shadefinder.css";

// // export default function SkinToneSelector() {
// //   const [tones, setTones] = useState([]);
// //   const [selectedShade, setSelectedShade] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const navigate = useNavigate();

// //   // Fetch tones from API
// //   useEffect(() => {
// //     const fetchTones = async () => {
// //       try {
// //         const res = await fetch(
// //           "https://beauty.joyory.com/api/user/shadefinder/tones"
// //         );

// //         if (!res.ok) {
// //           throw new Error(`HTTP error! status: ${res.status}`);
// //         }

// //         const data = await res.json();

// //         if (data.success && Array.isArray(data.tones)) {
// //           // Clean up the data - trim spaces from URLs
// //           const cleanedTones = data.tones.map(tone => ({
// //             ...tone,
// //             heroImages: (tone.heroImages || []).map(url => url.trim()).filter(url => url)
// //           }));

// //           setTones(cleanedTones);

// //           // Select first tone that has images by default
// //           const firstWithImages = cleanedTones.find(t =>
// //             t.heroImages && t.heroImages.length > 0
// //           );

// //           if (firstWithImages) {
// //             setSelectedShade(firstWithImages);
// //           } else if (cleanedTones.length > 0) {
// //             setSelectedShade(cleanedTones[0]);
// //           }
// //         } else {
// //           throw new Error("Invalid data structure from API");
// //         }
// //       } catch (err) {
// //         console.error("Error fetching tones:", err);
// //         setError(err.message);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchTones();
// //   }, []);

// //   // Handle slider change
// //   const handleSliderChange = (e) => {
// //     const index = parseInt(e.target.value);
// //     if (tones[index]) {
// //       setSelectedShade(tones[index]);
// //     }
// //   };

// //   // Handle label click
// //   const handleLabelClick = (tone) => {
// //     setSelectedShade(tone);
// //   };

// //   // Handle Next click - Fetch undertones and navigate
// //   const handleNext = async () => {
// //     if (!selectedShade) return;

// //     try {
// //       const res = await fetch(
// //         `https://beauty.joyory.com/api/user/shadefinder/undertones?toneKey=${selectedShade.key}`
// //       );
// //       const data = await res.json();

// //       navigate("/shadefinderundertone", {
// //         state: {
// //           shade: selectedShade,
// //           undertones: data.undertones || [],
// //         },
// //       });
// //     } catch (err) {
// //       console.error("Error fetching undertones:", err);
// //     }
// //   };

// //   // Get images for selected tone
// //   const getSelectedToneImages = () => {
// //     if (!selectedShade) return [];

// //     const images = [];

// //     if (selectedShade.heroImages && Array.isArray(selectedShade.heroImages)) {
// //       selectedShade.heroImages.forEach((imageUrl, imgIndex) => {
// //         if (imageUrl && typeof imageUrl === 'string') {
// //           images.push({
// //             id: `${selectedShade._id}-${imgIndex}`,
// //             imageUrl: imageUrl, // lowercase 'i' here
// //             tone: selectedShade,
// //             imageIndex: imgIndex
// //           });
// //         }
// //       });
// //     }

// //     return images;
// //   };

// //   // Get current slider index
// //   const getCurrentIndex = () => {
// //     if (!selectedShade || tones.length === 0) return 0;
// //     return tones.findIndex(t => t._id === selectedShade._id);
// //   };

// //   // Generate gradient from tone swatches
// //   const getGradientColors = () => {
// //     if (tones.length === 0) return 'linear-gradient(to right, #f5d5c8, #4a3728)';
// //     const colors = tones.map(t => t.swatchHex || '#ddd').join(', ');
// //     return `linear-gradient(to right, ${colors})`;
// //   };

// //   const selectedImages = getSelectedToneImages();
// //   const currentIndex = getCurrentIndex();

// //   if (loading) {
// //     return (
// //       <>
// //         <Header />
// //         <div className="bg-white py-5" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
// //           <div className="text-center">
// //             <div className="spinner-border text-primary" role="status">
// //               <span className="visually-hidden">Loading...</span>
// //             </div>
// //             <p className="mt-3 text-secondary">Loading shades...</p>
// //           </div>
// //         </div>
// //         <Footer />
// //       </>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <>
// //         <Header />
// //         <div className="bg-white py-5" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
// //           <div className="text-center text-danger">
// //             <h4>Error Loading Shades</h4>
// //             <p>{error}</p>
// //             <button
// //               className="btn btn-primary mt-3"
// //               onClick={() => window.location.reload()}
// //             >
// //               Retry
// //             </button>
// //           </div>
// //         </div>
// //         <Footer />
// //       </>
// //     );
// //   }

// //   return (
// //     <>
// //       <Header />

// //       <div className="bg-white py-5 px-3" style={{ minHeight: "100vh" }}>
// //         <Container className="d-flex flex-column align-items-center">
// //           {/* Header Section */}
// //           <header className="text-center mb-5">
// //             <h1 className="display-5 fw-light mb-2" style={{ color: "#1a1a1a" }}>
// //               Find your Shade Range
// //             </h1>
// //             <p className="text-secondary small">
// //               Choose the group that best represents your skin tone
// //             </p>
// //           </header>

// //           {/* Slider Section */}
// //           {tones.length > 0 && (
// //             <div className="w-100 mb-5 position-relative" style={{ maxWidth: '800px' }}>
// //               {/* Labels */}
// //               <div className="d-flex justify-content-between mb-3 px-1">
// //                 {tones.map((tone) => (
// //                   <button
// //                     key={tone._id}
// //                     onClick={() => handleLabelClick(tone)}
// //                     className={`btn btn-link p-0 text-decoration-none transition-colors ${selectedShade?._id === tone._id ? 'text-dark fw-bold' : 'text-muted'
// //                       }`}
// //                     style={{
// //                       fontSize: window.innerWidth < 768 ? '9px' : '11px',
// //                       textTransform: 'uppercase',
// //                       letterSpacing: '1px',
// //                       transition: 'all 0.3s ease'
// //                     }}
// //                   >
// //                     {tone.name}
// //                   </button>
// //                 ))}
// //               </div>

// //               <div class="position-relative mb-5" style="height: 8px;"><div class="position-absolute top-0 start-0 w-100 h-100 rounded-pill" style="background: linear-gradient(to right, rgb(249, 228, 212), rgb(232, 193, 160), rgb(212, 163, 115), rgb(166, 124, 82), rgb(123, 75, 42), rgb(61, 29, 17));"></div><input min="0" max="5" step="1" class="position-absolute top-0 start-0 w-100 h-100 opacity-0 cursor-pointer" type="range" value="0" style="z-index: 20;"><div class="position-absolute rounded-circle border border-2 border-white shadow-sm" style="width: 24px; height: 24px; top: 50%; transform: translate(-50%, -50%); z-index: 10; pointer-events: none; left: 0%; background-color: rgb(249, 228, 212);"></div></div>

// //               {/* Custom Slider Track */}
// //               <div className="position-relative mb-5" style={{ height: '8px' }}>
// //                 <div
// //                   className="position-absolute top-0 start-0 w-100 h-100 rounded-pill"
// //                   style={{
// //                     background: getGradientColors()
// //                   }}
// //                 />

// //                 {/* Actual Input Slider */}
// //                 <input
// //                   type="range"
// //                   min="0"
// //                   max={tones.length - 1}
// //                   step="1"
// //                   value={currentIndex}
// //                   onChange={handleSliderChange}
// //                   className="position-absolute top-0 start-0 w-100 h-100 opacity-0 cursor-pointer"
// //                   style={{ zIndex: 20 }}
// //                 />

// //                 {/* Custom Thumb */}
// //                 <motion.div
// //                   className="position-absolute rounded-circle border border-2 border-white shadow-sm"
// //                   animate={{
// //                     left: `${(currentIndex / (tones.length - 1)) * 100}%`,
// //                     backgroundColor: selectedShade?.swatchHex || '#ddd',
// //                   }}
// //                   transition={{ type: 'spring', stiffness: 300, damping: 30 }}
// //                   style={{
// //                     width: '24px',
// //                     height: '24px',
// //                     top: '50%',
// //                     transform: 'translate(-50%, -50%)',
// //                     zIndex: 10,
// //                     pointerEvents: 'none'
// //                   }}
// //                 />
// //               </div>
// //             </div>
// //           )}

// //           {/* Selected Tone Info */}
// //           {selectedShade && (
// //             <div className="text-center mb-4">
// //               <h4 className="fw-normal mb-1" style={{ color: "#1a1a1a" }}>
// //                 {selectedShade.name}
// //               </h4>
// //               {selectedImages.length > 0 ? (
// //                 <span className="text-secondary" style={{ fontSize: "14px" }}>
// //                   {selectedImages.length} {selectedImages.length === 1 ? 'photo' : 'photos'}
// //                 </span>
// //               ) : (
// //                 <span className="text-warning" style={{ fontSize: "14px" }}>
// //                   No images available
// //                 </span>
// //               )}
// //             </div>
// //           )}

// //           {/* Image Scroll Section */}
// //           <div className="w-100" style={{ maxWidth: '1000px' }}>
// //             <AnimatePresence mode="wait">
// //               <motion.div
// //                 key={selectedShade?._id || 'empty'}
// //                 initial={{ opacity: 0, x: 50 }}
// //                 animate={{ opacity: 1, x: 0 }}
// //                 exit={{ opacity: 0, x: -50 }}
// //                 transition={{ duration: 0.4 }}
// //                 className="d-flex flex-nowrap overflow-auto gap-3 pb-3"
// //                 style={{
// //                   cursor: 'grab',
// //                   scrollbarWidth: 'none',
// //                   msOverflowStyle: 'none',
// //                   minHeight: '400px'
// //                 }}
// //               >
// //                 <style>{`
// //                     .d-flex.flex-nowrap.overflow-auto::-webkit-scrollbar {
// //                       display: none;
// //                     }
// //                   `}</style>

// //                 {selectedImages.length > 0 ? (
// //                   selectedImages.map((item) => (
// //                     <div
// //                       key={item.id}
// //                       className="col-6 col-sm-6 col-md-4 col-lg-3"
// //                     >
// //                       <div
// //                         className="ratio ratio-4x5 overflow-hidden bg-light rounded-1 position-relative h-100"
// //                         style={{
// //                           backgroundColor: "#f8f9fa",
// //                           border: "1px solid #dee2e6"
// //                         }}
// //                       >
// //                         <img
// //                           src={item.imageUrl}
// //                           alt={`${item.tone.name} - ${item.imageIndex + 1}`}
// //                           className="object-fit-cover w-100 h-100"
// //                           referrerPolicy="no-referrer"
// //                           crossOrigin="anonymous"
// //                           style={{
// //                             transition: "transform 0.4s ease",
// //                             objectFit: "cover"
// //                           }}
// //                           onError={(e) => {
// //                             console.error(`Image failed: ${item.imageUrl}`);
// //                             e.target.src =
// //                               "https://via.placeholder.com/300x400?text=Image+Error";
// //                           }}
// //                           onMouseOver={(e) =>
// //                             (e.currentTarget.style.transform = "scale(1.05)")
// //                           }
// //                           onMouseOut={(e) =>
// //                             (e.currentTarget.style.transform = "scale(1)")
// //                           }
// //                         />

// //                         {/* Image Counter */}
// //                         {/* {selectedImages.length > 1 && (
// //                             <div
// //                               className="position-absolute top-0 start-0 m-2 px-2 py-1 rounded"
// //                               style={{
// //                                 backgroundColor: "rgba(0,0,0,0.6)",
// //                                 color: "#fff",
// //                                 fontSize: "10px"
// //                               }}
// //                             >
// //                               {item.imageIndex + 1}/{selectedImages.length}
// //                             </div>
// //                           )} */}

// //                         {/* Shade Letter */}
// //                         {/* {item.imageIndex === 0 && (
// //                             <div
// //                               className="position-absolute d-flex align-items-center justify-content-center"
// //                               style={{
// //                                 top: "10px",
// //                                 right: "10px",
// //                                 width: "30px",
// //                                 height: "30px",
// //                                 backgroundColor: "#007bff",
// //                                 borderRadius: "50%",
// //                                 color: "#fff",
// //                                 fontWeight: "bold"
// //                               }}
// //                             >
// //                               {String.fromCharCode(65 + currentIndex)}
// //                             </div>
// //                           )} */}

// //                         {/* Shade Name */}
// //                         {/* {item.imageIndex === 0 && (
// //                             <div
// //                               className="position-absolute bottom-0 start-0 w-100 text-center p-2"
// //                               style={{
// //                                 background:
// //                                   "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
// //                                 color: "#fff",
// //                                 fontSize: "12px"
// //                               }}
// //                             >
// //                               {item.tone.name}
// //                             </div>
// //                           )} */}
// //                       </div>
// //                     </div>
// //                   ))
// //                 ) : (
// //                   /* No Images State */
// //                   <div className="d-flex align-items-center justify-content-center w-100" style={{ height: '400px' }}>
// //                     <div className="text-center text-secondary">
// //                       <div className="mb-3">
// //                         <svg width="64" height="64" fill="currentColor" className="opacity-25" viewBox="0 0 16 16">
// //                           <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
// //                           <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z" />
// //                         </svg>
// //                       </div>
// //                       <h5>No Images Available</h5>
// //                       <p className="small">This shade doesn't have any images yet.</p>
// //                     </div>
// //                   </div>
// //                 )}
// //               </motion.div>
// //             </AnimatePresence>
// //           </div>

// //           {/* Footer Section with Next Button */}
// //           <footer className="w-100 mt-5 d-flex justify-content-end" style={{ maxWidth: '1000px' }}>
// //             <button
// //               onClick={handleNext}
// //               disabled={!selectedShade}
// //               className="btn btn-link text-dark text-decoration-none d-flex align-items-center gap-2 p-0"
// //               style={{
// //                 opacity: selectedShade ? 1 : 0.5,
// //                 cursor: selectedShade ? "pointer" : "not-allowed",
// //                 transition: "all 0.3s ease",
// //                 background: "none",
// //                 border: "none"
// //               }}
// //             >
// //               <span className="small fw-bold">Next</span>
// //               <ArrowRight size={16} />
// //             </button>
// //           </footer>
// //         </Container>
// //       </div>

// //       <Footer />
// //     </>
// //   );
// // }







































// // import React, { useState, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { ArrowRight } from 'lucide-react';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import { Container } from 'react-bootstrap';
// // import "bootstrap/dist/css/bootstrap.min.css";
// // import Header from "./Header";
// // import Footer from "./Footer";
// // import "../css/shadefinder.css";

// // export default function SkinToneSelector() {
// //   const [tones, setTones] = useState([]);
// //   const [selectedShade, setSelectedShade] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const navigate = useNavigate();

// //   // Fetch tones from API
// //   useEffect(() => {
// //     const fetchTones = async () => {
// //       try {
// //         const res = await fetch(
// //           "https://beauty.joyory.com/api/user/shadefinder/tones"
// //         );

// //         if (!res.ok) {
// //           throw new Error(`HTTP error! status: ${res.status}`);
// //         }

// //         const data = await res.json();

// //         if (data.success && Array.isArray(data.tones)) {
// //           // Clean up the data - trim spaces from URLs
// //           const cleanedTones = data.tones.map(tone => ({
// //             ...tone,
// //             heroImages: (tone.heroImages || []).map(url => url.trim()).filter(url => url)
// //           }));

// //           setTones(cleanedTones);

// //           // Select first tone that has images by default
// //           const firstWithImages = cleanedTones.find(t =>
// //             t.heroImages && t.heroImages.length > 0
// //           );

// //           if (firstWithImages) {
// //             setSelectedShade(firstWithImages);
// //           } else if (cleanedTones.length > 0) {
// //             setSelectedShade(cleanedTones[0]);
// //           }
// //         } else {
// //           throw new Error("Invalid data structure from API");
// //         }
// //       } catch (err) {
// //         console.error("Error fetching tones:", err);
// //         setError(err.message);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchTones();
// //   }, []);

// //   // Handle slider change
// //   const handleSliderChange = (e) => {
// //     const index = parseInt(e.target.value);
// //     if (tones[index]) {
// //       setSelectedShade(tones[index]);
// //     }
// //   };

// //   // Handle label click
// //   const handleLabelClick = (tone) => {
// //     setSelectedShade(tone);
// //   };

// //   // Handle Next click - Fetch undertones and navigate
// //   const handleNext = async () => {
// //     if (!selectedShade) return;

// //     try {
// //       const res = await fetch(
// //         `https://beauty.joyory.com/api/user/shadefinder/undertones?toneKey=${selectedShade.key}`
// //       );
// //       const data = await res.json();

// //       navigate("/shadefinderundertone", {
// //         state: {
// //           shade: selectedShade,
// //           undertones: data.undertones || [],
// //         },
// //       });
// //     } catch (err) {
// //       console.error("Error fetching undertones:", err);
// //     }
// //   };

// //   // Get images for selected tone
// //   const getSelectedToneImages = () => {
// //     if (!selectedShade) return [];

// //     const images = [];

// //     if (selectedShade.heroImages && Array.isArray(selectedShade.heroImages)) {
// //       selectedShade.heroImages.forEach((imageUrl, imgIndex) => {
// //         if (imageUrl && typeof imageUrl === 'string') {
// //           images.push({
// //             id: `${selectedShade._id}-${imgIndex}`,
// //             imageUrl: imageUrl,
// //             tone: selectedShade,
// //             imageIndex: imgIndex
// //           });
// //         }
// //       });
// //     }

// //     return images;
// //   };

// //   // Get current slider index
// //   const getCurrentIndex = () => {
// //     if (!selectedShade || tones.length === 0) return 0;
// //     return tones.findIndex(t => t._id === selectedShade._id);
// //   };

// //   const selectedImages = getSelectedToneImages();
// //   const currentIndex = getCurrentIndex();

// //   if (loading) {
// //     return (
// //       <>
// //         <Header />
// //         <div className="bg-white py-5" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
// //           <div className="text-center">
// //             <div className="spinner-border text-primary" role="status">
// //               <span className="visually-hidden">Loading...</span>
// //             </div>
// //             <p className="mt-3 text-secondary">Loading shades...</p>
// //           </div>
// //         </div>
// //         <Footer />
// //       </>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <>
// //         <Header />
// //         <div className="bg-white py-5" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
// //           <div className="text-center text-danger">
// //             <h4>Error Loading Shades</h4>
// //             <p>{error}</p>
// //             <button
// //               className="btn btn-primary mt-3"
// //               onClick={() => window.location.reload()}
// //             >
// //               Retry
// //             </button>
// //           </div>
// //         </div>
// //         <Footer />
// //       </>
// //     );
// //   }

// //   return (
// //     <>
// //       <Header />

// //       <div className="bg-white py-5 px-3" style={{ minHeight: "100vh" }}>
// //         <Container className="d-flex flex-column align-items-center">
// //           {/* Header Section */}
// //           <header className="text-center mb-5">
// //             <h1 className="display-5 fw-light mb-2" style={{ color: "#1a1a1a" }}>
// //               Find your Shade Range
// //             </h1>
// //             <p className="text-secondary small">
// //               Choose the group that best represents your skin tone
// //             </p>
// //           </header>

// //           {/* Slider Section */}
// //           {tones.length > 0 && (
// //             <div className="w-100 mb-5 position-relative" style={{ maxWidth: '800px' }}>
// //               {/* Labels */}
// //               <div className="d-flex justify-content-between mb-3 px-1">
// //                 {tones.map((tone) => (
// //                   <button
// //                     key={tone._id}
// //                     onClick={() => handleLabelClick(tone)}
// //                     className={`btn btn-link p-0 text-decoration-none transition-colors ${selectedShade?._id === tone._id ? 'text-dark fw-bold' : 'text-muted'
// //                       }`}
// //                     style={{
// //                       fontSize: window.innerWidth < 768 ? '9px' : '11px',
// //                       textTransform: 'uppercase',
// //                       letterSpacing: '1px',
// //                       transition: 'all 0.3s ease'
// //                     }}
// //                   >
// //                     {tone.name}
// //                   </button>
// //                 ))}
// //               </div>

// //               {/* Your Custom Slider with Hardcoded Gradient */}
// //               <div className="position-relative mb-5" style={{ height: '8px' }}>
// //                 {/* Hardcoded Gradient Background */}
// //                 <div 
// //                   className="position-absolute top-0 start-0 w-100 h-100 rounded-pill"
// //                   style={{
// //                     background: 'linear-gradient(to right, rgb(249, 228, 212), rgb(232, 193, 160), rgb(212, 163, 115), rgb(166, 124, 82), rgb(123, 75, 42), rgb(61, 29, 17))'
// //                   }}
// //                 />

// //                 {/* Range Input */}
// //                 <input 
// //                   type="range"
// //                   min="0" 
// //                   max={tones.length - 1} 
// //                   step="1" 
// //                   value={currentIndex}
// //                   onChange={handleSliderChange}
// //                   className="position-absolute top-0 start-0 w-100 h-100 opacity-0 cursor-pointer"
// //                   style={{ zIndex: 20 }}
// //                 />

// //                 {/* Animated Thumb */}
// //                 <motion.div
// //                   className="position-absolute rounded-circle border border-2 border-white shadow-sm"
// //                   animate={{
// //                     left: `${(currentIndex / (tones.length - 1)) * 100}%`,
// //                   }}
// //                   transition={{ type: 'spring', stiffness: 300, damping: 30 }}
// //                   style={{
// //                     width: '24px',
// //                     height: '24px',
// //                     top: '50%',
// //                     transform: 'translate(-50%, -50%)',
// //                     zIndex: 10,
// //                     pointerEvents: 'none',
// //                     backgroundColor: 'rgb(249, 228, 212)'
// //                   }}
// //                 />
// //               </div>
// //             </div>
// //           )}

// //           {/* Selected Tone Info */}
// //           {selectedShade && (
// //             <div className="text-center mb-4">
// //               <h4 className="fw-normal mb-1" style={{ color: "#1a1a1a" }}>
// //                 {selectedShade.name}
// //               </h4>
// //               {selectedImages.length > 0 ? (
// //                 <span className="text-secondary" style={{ fontSize: "14px" }}>
// //                   {selectedImages.length} {selectedImages.length === 1 ? 'photo' : 'photos'}
// //                 </span>
// //               ) : (
// //                 <span className="text-warning" style={{ fontSize: "14px" }}>
// //                   No images available
// //                 </span>
// //               )}
// //             </div>
// //           )}

// //           {/* Image Scroll Section */}
// //           <div className="w-100" style={{ maxWidth: '1000px' }}>
// //             <AnimatePresence mode="wait">
// //               <motion.div
// //                 key={selectedShade?._id || 'empty'}
// //                 initial={{ opacity: 0, x: 50 }}
// //                 animate={{ opacity: 1, x: 0 }}
// //                 exit={{ opacity: 0, x: -50 }}
// //                 transition={{ duration: 0.4 }}
// //                 className="d-flex flex-nowrap overflow-auto gap-3 pb-3"
// //                 style={{
// //                   cursor: 'grab',
// //                   scrollbarWidth: 'none',
// //                   msOverflowStyle: 'none',
// //                   minHeight: '400px'
// //                 }}
// //               >
// //                 <style>{`
// //                     .d-flex.flex-nowrap.overflow-auto::-webkit-scrollbar {
// //                       display: none;
// //                     }
// //                   `}</style>

// //                 {selectedImages.length > 0 ? (
// //                   selectedImages.map((item) => (
// //                     <div
// //                       key={item.id}
// //                       className="col-6 col-sm-6 col-md-4 col-lg-3"
// //                     >
// //                       <div
// //                         className="ratio ratio-4x5 overflow-hidden bg-light rounded-1 position-relative h-100"
// //                         style={{
// //                           backgroundColor: "#f8f9fa",
// //                           border: "1px solid #dee2e6"
// //                         }}
// //                       >
// //                         <img
// //                           src={item.imageUrl}
// //                           alt={`${item.tone.name} - ${item.imageIndex + 1}`}
// //                           className="object-fit-cover w-100 h-100"
// //                           referrerPolicy="no-referrer"
// //                           crossOrigin="anonymous"
// //                           style={{
// //                             transition: "transform 0.4s ease",
// //                             objectFit: "cover"
// //                           }}
// //                           onError={(e) => {
// //                             console.error(`Image failed: ${item.imageUrl}`);
// //                             e.target.src =
// //                               "https://via.placeholder.com/300x400?text=Image+Error";
// //                           }}
// //                           onMouseOver={(e) =>
// //                             (e.currentTarget.style.transform = "scale(1.05)")
// //                           }
// //                           onMouseOut={(e) =>
// //                             (e.currentTarget.style.transform = "scale(1)")
// //                           }
// //                         />
// //                       </div>
// //                     </div>
// //                   ))
// //                 ) : (
// //                   /* No Images State */
// //                   <div className="d-flex align-items-center justify-content-center w-100" style={{ height: '400px' }}>
// //                     <div className="text-center text-secondary">
// //                       <div className="mb-3">
// //                         <svg width="64" height="64" fill="currentColor" className="opacity-25" viewBox="0 0 16 16">
// //                           <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
// //                           <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z" />
// //                         </svg>
// //                       </div>
// //                       <h5>No Images Available</h5>
// //                       <p className="small">This shade doesn't have any images yet.</p>
// //                     </div>
// //                   </div>
// //                 )}
// //               </motion.div>
// //             </AnimatePresence>
// //           </div>

// //           {/* Footer Section with Next Button */}
// //           <footer className="w-100 mt-5 d-flex justify-content-end" style={{ maxWidth: '1000px' }}>
// //             <button
// //               onClick={handleNext}
// //               disabled={!selectedShade}
// //               className="btn btn-link text-dark text-decoration-none d-flex align-items-center gap-2 p-0"
// //               style={{
// //                 opacity: selectedShade ? 1 : 0.5,
// //                 cursor: selectedShade ? "pointer" : "not-allowed",
// //                 transition: "all 0.3s ease",
// //                 background: "none",
// //                 border: "none"
// //               }}
// //             >
// //               <span className="small fw-bold">Next</span>
// //               <ArrowRight size={16} />
// //             </button>
// //           </footer>
// //         </Container>
// //       </div>

// //       <Footer />
// //     </>
// //   );
// // }



















// // import React, { useState, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { ArrowRight } from 'lucide-react';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import { Container } from 'react-bootstrap';
// // import "bootstrap/dist/css/bootstrap.min.css";
// // import Header from "./Header";
// // import Footer from "./Footer";
// // import "../css/shadefinder.css";

// // export default function SkinToneSelector() {
// //   const [tones, setTones] = useState([]);
// //   const [selectedShade, setSelectedShade] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const navigate = useNavigate();

// //   // Fetch tones from API
// //   useEffect(() => {
// //     const fetchTones = async () => {
// //       try {
// //         const res = await fetch(
// //           "https://beauty.joyory.com/api/user/shadefinder/tones"
// //         );

// //         if (!res.ok) {
// //           throw new Error(`HTTP error! status: ${res.status}`);
// //         }

// //         const data = await res.json();

// //         if (data.success && Array.isArray(data.tones)) {
// //           // Clean up the data - trim spaces from URLs
// //           const cleanedTones = data.tones.map(tone => ({
// //             ...tone,
// //             heroImages: (tone.heroImages || []).map(url => url.trim()).filter(url => url)
// //           }));

// //           setTones(cleanedTones);

// //           // Select first tone that has images by default
// //           const firstWithImages = cleanedTones.find(t =>
// //             t.heroImages && t.heroImages.length > 0
// //           );

// //           if (firstWithImages) {
// //             setSelectedShade(firstWithImages);
// //           } else if (cleanedTones.length > 0) {
// //             setSelectedShade(cleanedTones[0]);
// //           }
// //         } else {
// //           throw new Error("Invalid data structure from API");
// //         }
// //       } catch (err) {
// //         console.error("Error fetching tones:", err);
// //         setError(err.message);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchTones();
// //   }, []);

// //   // Handle slider change
// //   const handleSliderChange = (e) => {
// //     const index = parseInt(e.target.value);
// //     if (tones[index]) {
// //       setSelectedShade(tones[index]);
// //     }
// //   };

// //   // Handle label click
// //   const handleLabelClick = (tone) => {
// //     setSelectedShade(tone);
// //   };

// //   // Handle Next click - Fetch undertones and navigate
// //   const handleNext = async () => {
// //     if (!selectedShade) return;

// //     try {
// //       const res = await fetch(
// //         `https://beauty.joyory.com/api/user/shadefinder/undertones?toneKey=${selectedShade.key}`
// //       );
// //       const data = await res.json();

// //       navigate("/shadefinderundertone", {
// //         state: {
// //           shade: selectedShade,
// //           undertones: data.undertones || [],
// //         },
// //       });
// //     } catch (err) {
// //       console.error("Error fetching undertones:", err);
// //     }
// //   };

// //   // Get images for selected tone
// //   const getSelectedToneImages = () => {
// //     if (!selectedShade) return [];

// //     const images = [];

// //     if (selectedShade.heroImages && Array.isArray(selectedShade.heroImages)) {
// //       selectedShade.heroImages.forEach((imageUrl, imgIndex) => {
// //         if (imageUrl && typeof imageUrl === 'string') {
// //           images.push({
// //             id: `${selectedShade._id}-${imgIndex}`,
// //             imageUrl: imageUrl,
// //             tone: selectedShade,
// //             imageIndex: imgIndex
// //           });
// //         }
// //       });
// //     }

// //     return images;
// //   };

// //   // Get current slider index
// //   const getCurrentIndex = () => {
// //     if (!selectedShade || tones.length === 0) return 0;
// //     return tones.findIndex(t => t._id === selectedShade._id);
// //   };

// //   const selectedImages = getSelectedToneImages();
// //   const currentIndex = getCurrentIndex();

// //   if (loading) {
// //     return (
// //       <>
// //         <Header />
// //         <div className="bg-white py-5" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
// //           <div className="text-center">
// //             <div className="spinner-border text-primary" role="status">
// //               <span className="visually-hidden">Loading...</span>
// //             </div>
// //             <p className="mt-3 text-secondary">Loading shades...</p>
// //           </div>
// //         </div>
// //         <Footer />
// //       </>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <>
// //         <Header />
// //         <div className="bg-white py-5" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
// //           <div className="text-center text-danger">
// //             <h4>Error Loading Shades</h4>
// //             <p>{error}</p>
// //             <button
// //               className="btn btn-primary mt-3"
// //               onClick={() => window.location.reload()}
// //             >
// //               Retry
// //             </button>
// //           </div>
// //         </div>
// //         <Footer />
// //       </>
// //     );
// //   }

// //   return (
// //     <>
// //       <Header />

// //       <div className="bg-white py-5 px-3" style={{ minHeight: "100vh" , marginTop:"100px" }}>
// //         <Container className="d-flex flex-column align-items-center">
// //           {/* Header Section */}
// //           <header className="text-center mb-5">
// //             <h1 className="display-5 fw-light mb-2" style={{ color: "#1a1a1a" }}>
// //               Find your Shade Range
// //             </h1>
// //             <p className="text-secondary small">
// //               Choose the group that best represents your skin tone
// //             </p>
// //           </header>

// //           {/* Slider Section */}
// //           {tones.length > 0 && (
// //             <div className="w-100 mb-5 position-relative" style={{ maxWidth: '800px' }}>
// //               {/* Labels */}
// //               <div className="d-flex justify-content-between mb-3 px-1">
// //                 {tones.map((tone) => (
// //                   <button
// //                     key={tone._id}
// //                     onClick={() => handleLabelClick(tone)}
// //                     className={`btn btn-link p-0 text-decoration-none transition-colors ${selectedShade?._id === tone._id ? 'text-dark fw-bold' : 'text-muted'
// //                       }`}
// //                     style={{
// //                       fontSize: window.innerWidth < 768 ? '9px' : '11px',
// //                       textTransform: 'uppercase',
// //                       letterSpacing: '1px',
// //                       transition: 'all 0.3s ease'
// //                     }}
// //                   >
// //                     {tone.name}
// //                   </button>
// //                 ))}
// //               </div>

// //               {/* Your Custom Slider with Hardcoded Gradient */}
// //               <div className="position-relative mb-5" style={{ height: '8px' }}>
// //                 {/* Hardcoded Gradient Background */}
// //                 <div
// //                   className="position-absolute top-0 start-0 w-100 h-100 rounded-pill"
// //                   style={{
// //                     background: 'linear-gradient(to right, rgb(249, 228, 212), rgb(232, 193, 160), rgb(212, 163, 115), rgb(166, 124, 82), rgb(123, 75, 42), rgb(61, 29, 17))'
// //                   }}
// //                 />

// //                 {/* Range Input */}
// //                 <input
// //                   type="range"
// //                   min="0"
// //                   max={tones.length - 1}
// //                   step="1"
// //                   value={currentIndex}
// //                   onChange={handleSliderChange}
// //                   className="position-absolute top-0 start-0 w-100 h-100 opacity-0 cursor-pointer"
// //                   style={{ zIndex: 20 }}
// //                 />

// //                 {/* Animated Thumb */}
// //                 <motion.div
// //                   className="position-absolute rounded-circle border border-2 border-white shadow-sm"
// //                   animate={{
// //                     left: `${(currentIndex / (tones.length - 1)) * 100}%`,
// //                   }}
// //                   transition={{ type: 'spring', stiffness: 300, damping: 30 }}
// //                   style={{
// //                     width: '24px',
// //                     height: '24px',
// //                     top: '50%',
// //                     transform: 'translate(-50%, -50%)',
// //                     zIndex: 10,
// //                     pointerEvents: 'none',
// //                     backgroundColor: 'rgb(249, 228, 212)'
// //                   }}
// //                 />
// //               </div>
// //             </div>
// //           )}

// //           {/* Image Grid Section */}
// //           <div className="w-100" style={{ maxWidth: "1000px" }}>
// //             <AnimatePresence mode="wait">
// //               <motion.div
// //                 key={selectedShade?._id || "empty"}
// //                 initial={{ opacity: 0, y: 40 }}
// //                 animate={{ opacity: 1, y: 0 }}
// //                 exit={{ opacity: 0, y: -40 }}
// //                 transition={{ duration: 0.4 }}
// //                 className="row g-3"
// //                 style={{ minHeight: "400px" }}
// //               >
// //                 {selectedImages.length > 0 ? (
// //                   selectedImages.map((item) => (
// //                     <div
// //                       key={item.id}
// //                       className="col-6 col-sm-5 col-md-4 col-lg-3"
// //                     >
// //                       <div className="h-100">
// //                         <img
// //                           src={item.imageUrl}
// //                           alt={`${item.tone.name} - ${item.imageIndex + 1}`}
// //                           className="w-100 h-100"
// //                           style={{
// //                             objectFit: "contain",
// //                             transition: "transform 0.4s ease"
// //                           }}
// //                           referrerPolicy="no-referrer"
// //                           crossOrigin="anonymous"
// //                           loading="lazy"
// //                           onError={(e) => {
// //                             console.error(`Image failed: ${item.imageUrl}`);
// //                             e.target.src =
// //                               "https://via.placeholder.com/300x400?text=Image+Error";
// //                           }}
// //                           onMouseOver={(e) =>
// //                             (e.currentTarget.style.transform = "scale(1.05)")
// //                           }
// //                           onMouseOut={(e) =>
// //                             (e.currentTarget.style.transform = "scale(1)")
// //                           }
// //                         />

// //                         {/* Image Counter */}
// //                         {/* {selectedImages.length > 1 && (
// //                           <div
// //                             className="position-absolute top-0 start-0 m-2 px-2 py-1 rounded"
// //                             style={{
// //                               background: "rgba(0,0,0,0.6)",
// //                               color: "#fff",
// //                               fontSize: "10px"
// //                             }}
// //                           >
// //                             {item.imageIndex + 1}/{selectedImages.length}
// //                           </div>
// //                         )} */}

// //                         {/* Shade Name */}
// //                         {/* {item.imageIndex === 0 && (
// //                           <div
// //                             className="position-absolute bottom-0 start-0 w-100 p-2 text-center"
// //                             style={{
// //                               background:
// //                                 "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
// //                               color: "#fff",
// //                               fontSize: "12px",
// //                               fontWeight: "500"
// //                             }}
// //                           >
// //                             {item.tone.name}
// //                           </div>
// //                         )} */}
// //                       </div>
// //                     </div>
// //                   ))
// //                 ) : (
// //                   <div className="col-12 d-flex align-items-center justify-content-center">
// //                     <div className="text-center text-secondary">
// //                       <h5>No Images Available</h5>
// //                       <p className="small">This shade doesn't have any images yet.</p>
// //                     </div>
// //                   </div>
// //                 )}
// //               </motion.div>
// //             </AnimatePresence>
// //           </div>

// //           {/* Footer Section with Next Button */}
// //           <footer className="w-100 mt-5 d-flex justify-content-end" style={{ maxWidth: '1000px' }}>
// //             <button
// //               onClick={handleNext}
// //               disabled={!selectedShade}
// //               className="btn btn-link text-dark text-decoration-none d-flex align-items-center gap-2 p-0"
// //               style={{
// //                 opacity: selectedShade ? 1 : 0.5,
// //                 cursor: selectedShade ? "pointer" : "not-allowed",
// //                 transition: "all 0.3s ease",
// //                 background: "none",
// //                 border: "none"
// //               }}
// //             >
// //               <span className="small fw-bold">Next</span>
// //               <ArrowRight size={16} />
// //             </button>
// //           </footer>
// //         </Container>
// //       </div>

// //       <Footer />
// //     </>
// //   );
// // }















// // import React, { useState, useRef, useEffect } from 'react';
// // import 'bootstrap/dist/css/bootstrap.min.css';
// // import "../css/shadefinder.css";

// // const SkinToneSlider = () => {
// //   const [shadeIndex, setShadeIndex] = useState(3);
// //   const galleryRef = useRef(null);

// //   const shades = [
// //     { id: 1, label: 'LIGHT' },
// //     { id: 2, label: 'LIGHT MEDIUM' },
// //     { id: 3, label: 'MEDIUM' },
// //     { id: 4, label: 'MEDIUM TAN' },
// //     { id: 5, label: 'MEDIUM DEEP' },
// //     { id: 6, label: 'DEEP' }
// //   ];

// //   // Placeholder images (Top and Bottom rows for each shade column)
// //   const images = Array.from({ length: 6 }).map((_, index) => ({
// //     top: `https://picsum.photos/seed/top${index}/400/400`,
// //     bottom: `https://picsum.photos/seed/bottom${index}/400/400`
// //   }));

// //   // Auto-scroll the gallery to center the selected shade
// //   useEffect(() => {
// //     if (galleryRef.current) {
// //       const container = galleryRef.current;
// //       const columnWidth = container.scrollWidth / 6;
// //       const scrollPosition = (shadeIndex - 1) * columnWidth - (container.clientWidth / 2) + (columnWidth / 2);

// //       container.scrollTo({
// //         left: scrollPosition,
// //         behavior: 'smooth'
// //       });
// //     }
// //   }, [shadeIndex]);

// //   return (
// //     <div className="container py-5">

// //       {/* Labels Row */}
// //       <div className="d-flex justify-content-between mb-2 px-2 shade-labels">
// //         {shades.map((shade) => (
// //           <div 
// //             key={shade.id} 
// //             className={`text-center fw-bold ${shadeIndex === shade.id ? 'text-dark' : 'text-muted'}`}
// //             style={{ width: '16.66%', fontSize: '0.75rem', letterSpacing: '1px' }}
// //             onClick={() => setShadeIndex(shade.id)}
// //             role="button"
// //           >
// //             {shade.label}
// //           </div>
// //         ))}
// //       </div>

// //       {/* Custom Slider */}
// //       <div className="mb-4 position-relative">
// //         <input
// //           type="range"
// //           className="form-range custom-skin-slider w-100"
// //           min="1"
// //           max="6"
// //           step="1"
// //           value={shadeIndex}
// //           onChange={(e) => setShadeIndex(parseInt(e.target.value))}
// //         />
// //       </div>

// //       {/* Image Gallery with Edge Fade Mask */}
// //       <div className="gallery-wrapper position-relative">
// //         <div 
// //           className="d-flex flex-nowrap overflow-hidden image-gallery" 
// //           ref={galleryRef}
// //         >
// //           {images.map((imgGroup, idx) => (
// //             <div key={idx} className="flex-shrink-0 px-1 image-column">
// //               <img 
// //                 src={imgGroup.top} 
// //                 alt={`Shade ${idx + 1} Top`} 
// //                 className="img-fluid mb-2"
// //               />
// //               <img 
// //                 src={imgGroup.bottom} 
// //                 alt={`Shade ${idx + 1} Bottom`} 
// //                 className="img-fluid"
// //               />
// //             </div>
// //           ))}
// //         </div>
// //       </div>

// //     </div>
// //   );
// // };

// // export default SkinToneSlider;

















// // import React, { useState, useRef, useEffect } from 'react';
// // import 'bootstrap/dist/css/bootstrap.min.css';
// // import Header from "./Header";
// // import Footer from "./Footer";
// // import "../css/shadefinder.css";

// // const SkinToneSlider = () => {
// //   const [shadeIndex, setShadeIndex] = useState(3);
// //   const galleryRef = useRef(null);

// //   const shades = [
// //     { id: 1, label: 'LIGHT' },
// //     { id: 2, label: 'LIGHT MEDIUM' },
// //     { id: 3, label: 'MEDIUM' },
// //     { id: 4, label: 'MEDIUM TAN' },
// //     { id: 5, label: 'MEDIUM DEEP' },
// //     { id: 6, label: 'DEEP' }
// //   ];

// //   const images = Array.from({ length: 6 }).map((_, index) => ({
// //     top: `https://picsum.photos/seed/top${index}/600/600`,
// //     bottom: `https://picsum.photos/seed/bottom${index}/600/600`
// //   }));

// //   useEffect(() => {
// //     if (galleryRef.current) {
// //       const container = galleryRef.current;
// //       const columnWidth = container.scrollWidth / 6;
// //       // Scroll to perfectly center the selected column
// //       const scrollPosition = (shadeIndex - 1) * columnWidth - (container.clientWidth / 2) + (columnWidth / 2);

// //       container.scrollTo({
// //         left: scrollPosition,
// //         behavior: 'smooth'
// //       });
// //     }
// //   }, [shadeIndex]);

// //   return (
// //     // container-fluid px-0 makes it full width edge-to-edge
// //     // min-vh-100 d-flex flex-column justify-content-center makes it full height
// //  <>
// //  <Header />
// //      <div className="container-fluid px-0 min-vh-100 d-flex flex-column justify-content-center bg-light overflow-hidden">

// //       {/* Wrapper to add some padding to just the slider/labels, not the images */}
// //       <div className="w-100 px-4 px-md-5 mb-5 mx-auto" style={{ maxWidth: '1200px' }}>

// //         {/* Labels Row */}
// //         <div className="d-flex justify-content-between mb-3 px-2 shade-labels">
// //           {shades.map((shade) => (
// //             <div 
// //               key={shade.id} 
// //               className={`text-center fw-bold ${shadeIndex === shade.id ? 'text-dark' : 'text-muted'}`}
// //               style={{ width: '16.66%', fontSize: '0.85rem', letterSpacing: '1.5px' }}
// //               onClick={() => setShadeIndex(shade.id)}
// //               role="button"
// //             >
// //               {shade.label}
// //             </div>
// //           ))}
// //         </div>

// //         {/* Custom Slider */}
// //         <div className="position-relative">
// //           <input
// //             type="range"
// //             className="form-range custom-skin-slider w-100"
// //             min="1"
// //             max="6"
// //             step="1"
// //             value={shadeIndex}
// //             onChange={(e) => setShadeIndex(parseInt(e.target.value))}
// //           />
// //         </div>
// //       </div>

// //       {/* Image Gallery - Touches the very edges of the screen */}
// //       <div className="gallery-wrapper position-relative w-100">
// //         <div 
// //           className="d-flex flex-nowrap overflow-hidden image-gallery" 
// //           ref={galleryRef}
// //         >
// //           {images.map((imgGroup, idx) => (
// //             <div key={idx} className="flex-shrink-0 px-1 image-column">
// //               <img 
// //                 src={imgGroup.top} 
// //                 alt={`Shade ${idx + 1} Top`} 
// //                 className="img-fluid mb-2"
// //               />
// //               <img 
// //                 src={imgGroup.bottom} 
// //                 alt={`Shade ${idx + 1} Bottom`} 
// //                 className="img-fluid"
// //               />
// //             </div>
// //           ))}
// //         </div>
// //       </div>

// //     </div>

// //     <Footer />
// // </>
// //   );
// // };


// // export default SkinToneSlider;









// // import React, { useState, useRef, useEffect } from 'react';
// // import { useNavigate } from "react-router-dom";
// // import 'bootstrap/dist/css/bootstrap.min.css';
// // import Header from "./Header";
// // import Footer from "./Footer";
// // import "../css/shadefinder.css";

// // const API_BASE_URL = "https://beauty.joyory.com/api/user/shadefinder";

// // const SkinToneSlider = () => {
// //   const [tones, setTones] = useState([]);
// //   const [selectedShade, setSelectedShade] = useState(null);
// //   const [shadeIndex, setShadeIndex] = useState(0);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const galleryRef = useRef(null);
// //   const navigate = useNavigate();

// //   // ✅ Fetch tones from API (same pattern as first component)
// //   useEffect(() => {
// //     const fetchTones = async () => {
// //       try {
// //         setLoading(true);
// //         const res = await fetch(`${API_BASE_URL}/tones`);

// //         if (!res.ok) {
// //           throw new Error(`HTTP error! status: ${res.status}`);
// //         }

// //         const data = await res.json();

// //         if (data.success && Array.isArray(data.tones)) {
// //           // Clean up the data - trim spaces from URLs
// //           const cleanedTones = data.tones.map(tone => ({
// //             ...tone,
// //             heroImages: (tone.heroImages || []).map(url => url.trim()).filter(url => url)
// //           }));

// //           setTones(cleanedTones);

// //           // Select first tone that has images by default
// //           const firstWithImages = cleanedTones.find(t =>
// //             t.heroImages && t.heroImages.length > 0
// //           );

// //           if (firstWithImages) {
// //             setSelectedShade(firstWithImages);
// //             setShadeIndex(cleanedTones.indexOf(firstWithImages));
// //           } else if (cleanedTones.length > 0) {
// //             setSelectedShade(cleanedTones[0]);
// //             setShadeIndex(0);
// //           }
// //         } else {
// //           throw new Error("Invalid data structure from API");
// //         }
// //       } catch (err) {
// //         console.error("Error fetching tones:", err);
// //         setError(err.message);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchTones();
// //   }, []);

// //   // ✅ Scroll gallery to selected shade
// //   useEffect(() => {
// //     if (galleryRef.current && tones.length > 0) {
// //       const container = galleryRef.current;
// //       const columnWidth = container.scrollWidth / tones.length;
// //       const scrollPosition = (shadeIndex * columnWidth) - (container.clientWidth / 2) + (columnWidth / 2);

// //       container.scrollTo({
// //         left: scrollPosition,
// //         behavior: 'smooth'
// //       });
// //     }
// //   }, [shadeIndex, tones.length]);

// //   // ✅ Handle slider change
// //   const handleSliderChange = (e) => {
// //     const index = parseInt(e.target.value);
// //     setShadeIndex(index);
// //     if (tones[index]) {
// //       setSelectedShade(tones[index]);
// //     }
// //   };

// //   // ✅ Handle label click
// //   const handleLabelClick = (index) => {
// //     setShadeIndex(index);
// //     if (tones[index]) {
// //       setSelectedShade(tones[index]);
// //     }
// //   };

// //   // ✅ Handle Next click - Fetch undertones and navigate (same pattern)
// //   const handleNext = async () => {
// //     if (!selectedShade) return;

// //     try {
// //       const res = await fetch(
// //         `${API_BASE_URL}/undertones?toneKey=${selectedShade.key}`
// //       );

// //       if (!res.ok) {
// //         throw new Error(`HTTP error! status: ${res.status}`);
// //       }

// //       const data = await res.json();

// //       navigate("/shadefinderundertone", {
// //         state: {
// //           shade: selectedShade,
// //           undertones: data.undertones || [],
// //         },
// //       });
// //     } catch (err) {
// //       console.error("Error fetching undertones:", err);
// //       alert("Failed to load undertones. Please try again.");
// //     }
// //   };

// //   // Get images for selected tone
// //   const getSelectedToneImages = () => {
// //     if (!selectedShade) return [];

// //     const images = [];

// //     if (selectedShade.heroImages && Array.isArray(selectedShade.heroImages)) {
// //       selectedShade.heroImages.forEach((imageUrl, imgIndex) => {
// //         if (imageUrl && typeof imageUrl === 'string') {
// //           images.push({
// //             id: `${selectedShade._id}-${imgIndex}`,
// //             top: imageUrl,
// //             bottom: imageUrl, // Using same image for both if only one exists
// //             tone: selectedShade,
// //             imageIndex: imgIndex
// //           });
// //         }
// //       });
// //     }

// //     // If only one image, duplicate for top/bottom layout
// //     if (images.length === 1) {
// //       return [{
// //         ...images[0],
// //         top: images[0].top,
// //         bottom: images[0].top
// //       }];
// //     }

// //     return images;
// //   };

// //   // Loading state
// //   if (loading) {
// //     return (
// //       <>
// //         <Header />
// //         <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
// //           <div className="text-center">
// //             <div className="spinner-border text-primary" role="status">
// //               <span className="visually-hidden">Loading...</span>
// //             </div>
// //             <p className="mt-3 text-secondary">Loading shades...</p>
// //           </div>
// //         </div>
// //         <Footer />
// //       </>
// //     );
// //   }

// //   // Error state
// //   if (error) {
// //     return (
// //       <>
// //         <Header />
// //         <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
// //           <div className="text-center text-danger">
// //             <h4>Error Loading Shades</h4>
// //             <p>{error}</p>
// //             <button
// //               className="btn btn-primary mt-3"
// //               onClick={() => window.location.reload()}
// //             >
// //               Retry
// //             </button>
// //           </div>
// //         </div>
// //         <Footer />
// //       </>
// //     );
// //   }

// //   const selectedImages = getSelectedToneImages();

// //   return (
// //     <>
// //       <Header />
// //       <div className="container-fluid px-0 min-vh-100 d-flex flex-column justify-content-center bg-light overflow-hidden">

// //         {/* Wrapper to add some padding to just the slider/labels, not the images */}
// //         <div className="w-100 px-4 px-md-5 mb-5 mx-auto" style={{ maxWidth: '1200px' }}>

// //           {/* Header */}
// //           <header className="text-center mb-4">
// //             <h1 className="display-5 fw-light mb-2" style={{ color: "#1a1a1a" }}>
// //               Find your Shade Range
// //             </h1>
// //             <p className="text-secondary small">
// //               Choose the group that best represents your skin tone
// //             </p>
// //           </header>

// //           {/* Labels Row */}
// //           <div className="d-flex justify-content-between mb-3 px-2 shade-labels">
// //             {tones.map((tone, index) => (
// //               <div 
// //                 key={tone._id} 
// //                 className={`text-center fw-bold ${shadeIndex === index ? 'text-dark' : 'text-muted'}`}
// //                 style={{ width: `${100 / tones.length}%`, fontSize: '0.85rem', letterSpacing: '1.5px' }}
// //                 onClick={() => handleLabelClick(index)}
// //                 role="button"
// //               >
// //                 {tone.name}
// //               </div>
// //             ))}
// //           </div>

// //           {/* Custom Slider */}
// //           <div className="position-relative">
// //             <input
// //               type="range"
// //               className="form-range custom-skin-slider w-100"
// //               min="0"
// //               max={tones.length - 1}
// //               step="1"
// //               value={shadeIndex}
// //               onChange={handleSliderChange}
// //             />
// //           </div>
// //         </div>

// //         {/* Image Gallery - Touches the very edges of the screen */}
// //         <div className="gallery-wrapper position-relative w-100">
// //           <div 
// //             className="d-flex flex-nowrap overflow-hidden image-gallery" 
// //             ref={galleryRef}
// //           >
// //             {tones.map((tone, idx) => (
// //               <div 
// //                 key={tone._id} 
// //                 className={`flex-shrink-0 px-1 image-column ${shadeIndex === idx ? 'active' : ''}`}
// //                 style={{ 
// //                   opacity: shadeIndex === idx ? 1 : 0.5,
// //                   transition: 'opacity 0.3s ease'
// //                 }}
// //               >
// //                 {tone.heroImages && tone.heroImages[0] ? (
// //                   <>
// //                     <img 
// //                       src={tone.heroImages[0]} 
// //                       alt={`${tone.name} - 1`} 
// //                       className="img-fluid mb-2"
// //                       style={{ objectFit: 'cover' }}
// //                       onError={(e) => {
// //                         e.target.src = "https://via.placeholder.com/600x600?text=No+Image";
// //                       }}
// //                     />
// //                     {tone.heroImages[1] && (
// //                       <img 
// //                         src={tone.heroImages[1]} 
// //                         alt={`${tone.name} - 2`} 
// //                         className="img-fluid"
// //                         style={{ objectFit: 'cover' }}
// //                         onError={(e) => {
// //                           e.target.src = "https://via.placeholder.com/600x600?text=No+Image";
// //                         }}
// //                       />
// //                     )}
// //                   </>
// //                 ) : (
// //                   <div className="bg-secondary text-white d-flex align-items-center justify-content-center" style={{ height: '300px' }}>
// //                     No Images
// //                   </div>
// //                 )}
// //               </div>
// //             ))}
// //           </div>
// //         </div>

// //         {/* Next Button */}
// //         <div className="w-100 px-4 px-md-5 mt-4 mx-auto d-flex justify-content-end" style={{ maxWidth: '1200px' }}>
// //           <button
// //             onClick={handleNext}
// //             disabled={!selectedShade}
// //             className="btn btn-dark d-flex align-items-center gap-2"
// //             style={{
// //               opacity: selectedShade ? 1 : 0.5,
// //               cursor: selectedShade ? "pointer" : "not-allowed"
// //             }}
// //           >
// //             <span className="fw-bold">Next</span>
// //             <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
// //               <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
// //             </svg>
// //           </button>
// //         </div>

// //       </div>
// //       <Footer />
// //     </>
// //   );
// // };

// // export default SkinToneSlider;







// // import React, { useState, useRef, useEffect } from 'react';
// // import { useNavigate } from "react-router-dom";
// // import 'bootstrap/dist/css/bootstrap.min.css';
// // import Header from "./Header";
// // import Footer from "./Footer";
// // import "../css/shadefinder.css";

// // const API_BASE_URL = "https://beauty.joyory.com/api/user/shadefinder";

// // const SkinToneSlider = () => {
// //   const [tones, setTones] = useState([]);
// //   const [selectedShade, setSelectedShade] = useState(null);
// //   const [selectedImageIndex, setSelectedImageIndex] = useState(null); // ✅ Track selected image
// //   const [shadeIndex, setShadeIndex] = useState(0);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const galleryRef = useRef(null);
// //   const navigate = useNavigate();

// //   // Fetch tones from API
// //   useEffect(() => {
// //     const fetchTones = async () => {
// //       try {
// //         setLoading(true);
// //         const res = await fetch(`${API_BASE_URL}/tones`);

// //         if (!res.ok) {
// //           throw new Error(`HTTP error! status: ${res.status}`);
// //         }

// //         const data = await res.json();

// //         if (data.success && Array.isArray(data.tones)) {
// //           const cleanedTones = data.tones.map(tone => ({
// //             ...tone,
// //             heroImages: (tone.heroImages || []).map(url => url.trim()).filter(url => url)
// //           }));

// //           setTones(cleanedTones);

// //           const firstWithImages = cleanedTones.find(t =>
// //             t.heroImages && t.heroImages.length > 0
// //           );

// //           if (firstWithImages) {
// //             setSelectedShade(firstWithImages);
// //             setShadeIndex(cleanedTones.indexOf(firstWithImages));
// //           } else if (cleanedTones.length > 0) {
// //             setSelectedShade(cleanedTones[0]);
// //             setShadeIndex(0);
// //           }
// //         } else {
// //           throw new Error("Invalid data structure from API");
// //         }
// //       } catch (err) {
// //         console.error("Error fetching tones:", err);
// //         setError(err.message);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchTones();
// //   }, []);

// //   // Scroll gallery to selected shade
// //   useEffect(() => {
// //     if (galleryRef.current && tones.length > 0) {
// //       const container = galleryRef.current;
// //       const columnWidth = container.scrollWidth / tones.length;
// //       const scrollPosition = (shadeIndex * columnWidth) - (container.clientWidth / 2) + (columnWidth / 2);

// //       container.scrollTo({
// //         left: scrollPosition,
// //         behavior: 'smooth'
// //       });
// //     }
// //   }, [shadeIndex, tones.length]);

// //   // Handle slider change
// //   const handleSliderChange = (e) => {
// //     const index = parseInt(e.target.value);
// //     setShadeIndex(index);
// //     if (tones[index]) {
// //       setSelectedShade(tones[index]);
// //       setSelectedImageIndex(null); // ✅ Reset image selection when shade changes
// //     }
// //   };

// //   // Handle label click
// //   const handleLabelClick = (index) => {
// //     setShadeIndex(index);
// //     if (tones[index]) {
// //       setSelectedShade(tones[index]);
// //       setSelectedImageIndex(null); // ✅ Reset image selection when shade changes
// //     }
// //   };

// //   // ✅ Handle image click - select specific image
// //   const handleImageClick = (imgIndex) => {
// //     setSelectedImageIndex(imgIndex);
// //   };

// //   // ✅ Handle Next click - Pass selected image info
// //   const handleNext = async () => {
// //     if (!selectedShade) return;

// //     try {
// //       const res = await fetch(
// //         `${API_BASE_URL}/undertones?toneKey=${selectedShade.key}`
// //       );

// //       if (!res.ok) {
// //         throw new Error(`HTTP error! status: ${res.status}`);
// //       }

// //       const data = await res.json();

// //       navigate("/shadefinderundertone", {
// //         state: {
// //           shade: selectedShade,
// //           undertones: data.undertones || [],
// //           selectedImageIndex: selectedImageIndex, // ✅ Pass selected image index
// //           selectedImageUrl: selectedImageIndex !== null ? selectedShade.heroImages[selectedImageIndex] : null,
// //         },
// //       });
// //     } catch (err) {
// //       console.error("Error fetching undertones:", err);
// //       alert("Failed to load undertones. Please try again.");
// //     }
// //   };

// //   // Loading state
// //   if (loading) {
// //     return (
// //       <>
// //         <Header />
// //         <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
// //           <div className="text-center">
// //             <div className="spinner-border text-primary" role="status">
// //               <span className="visually-hidden">Loading...</span>
// //             </div>
// //             <p className="mt-3 text-secondary">Loading shades...</p>
// //           </div>
// //         </div>
// //         <Footer />
// //       </>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <>
// //         <Header />
// //         <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
// //           <div className="text-center text-danger">
// //             <h4>Error Loading Shades</h4>
// //             <p>{error}</p>
// //             <button className="btn btn-primary mt-3" onClick={() => window.location.reload()}>
// //               Retry
// //             </button>
// //           </div>
// //         </div>
// //         <Footer />
// //       </>
// //     );
// //   }

// //   return (
// //     <>
// //       <Header />
// //       <div className="container-fluid px-0 min-vh-100 d-flex flex-column justify-content-center bg-light overflow-hidden">

// //         {/* Wrapper */}
// //         <div className="w-100 px-4 px-md-5 mb-5 mx-auto" style={{ maxWidth: '1200px' }}>

// //           {/* Header */}
// //           <header className="text-center mb-4">
// //             <h1 className="display-5 fw-light mb-2" style={{ color: "#1a1a1a" }}>
// //               Find your Shade Range
// //             </h1>
// //             <p className="text-secondary small">
// //               Choose the group that best represents your skin tone
// //             </p>
// //             {/* ✅ Selection indicator - minimal text */}
// //             {selectedImageIndex !== null && selectedShade && (
// //               <p className="text-success small fw-bold mt-1 mb-0">
// //                 ✓ {selectedShade.name} - Image {selectedImageIndex + 1} selected
// //               </p>
// //             )}
// //           </header>

// //           {/* Labels Row */}
// //           <div className="d-flex justify-content-between mb-3 px-2 shade-labels">
// //             {tones.map((tone, index) => (
// //               <div 
// //                 key={tone._id} 
// //                 className={`text-center fw-bold ${shadeIndex === index ? 'text-dark' : 'text-muted'}`}
// //                 style={{ width: `${100 / tones.length}%`, fontSize: '0.85rem', letterSpacing: '1.5px' }}
// //                 onClick={() => handleLabelClick(index)}
// //                 role="button"
// //               >
// //                 {tone.name}
// //               </div>
// //             ))}
// //           </div>

// //           {/* Custom Slider */}
// //           <div className="position-relative">
// //             <input
// //               type="range"
// //               className="form-range custom-skin-slider w-100"
// //               min="0"
// //               max={tones.length - 1}
// //               step="1"
// //               value={shadeIndex}
// //               onChange={handleSliderChange}
// //             />
// //           </div>
// //         </div>

// //         {/* Image Gallery - Design unchanged, only added click & selection overlay */}
// //         <div className="gallery-wrapper position-relative w-100">
// //           <div 
// //             className="d-flex flex-nowrap overflow-hidden image-gallery" 
// //             ref={galleryRef}
// //           >
// //             {tones.map((tone, idx) => (
// //               <div 
// //                 key={tone._id} 
// //                 className={`flex-shrink-0 px-1 image-column ${shadeIndex === idx ? 'active' : ''}`}
// //                 style={{ 
// //                   opacity: shadeIndex === idx ? 1 : 0.5,
// //                   transition: 'opacity 0.3s ease'
// //                 }}
// //               >
// //                 {tone.heroImages && tone.heroImages.map((imgUrl, imgIndex) => {
// //                   const isSelected = shadeIndex === idx && selectedImageIndex === imgIndex;

// //                   return (
// //                     <div
// //                       key={imgIndex}
// //                       className="position-relative mb-2"
// //                       onClick={() => shadeIndex === idx && handleImageClick(imgIndex)}
// //                       style={{
// //                         cursor: shadeIndex === idx ? 'pointer' : 'default',
// //                       }}
// //                     >
// //                       <img 
// //                         src={imgUrl} 
// //                         alt={`${tone.name} - ${imgIndex + 1}`} 
// //                         className="img-fluid"
// //                         style={{ 
// //                           objectFit: 'cover',
// //                           display: 'block'
// //                         }}
// //                         onError={(e) => {
// //                           e.target.src = "https://via.placeholder.com/600x600?text=No+Image";
// //                         }}
// //                       />

// //                       {/* ✅ Selection overlay - minimal, doesn't change layout */}
// //                       {isSelected && (
// //                         <>
// //                           {/* Green border overlay */}
// //                           <div
// //                             className="position-absolute top-0 start-0 w-100 h-100"
// //                             style={{
// //                               border: '3px solid #28a745',
// //                               borderRadius: '4px',
// //                               pointerEvents: 'none',
// //                               zIndex: 2
// //                             }}
// //                           />
// //                           {/* Checkmark */}
// //                           <div
// //                             className="position-absolute top-0 end-0 m-2 d-flex align-items-center justify-content-center"
// //                             style={{
// //                               width: '24px',
// //                               height: '24px',
// //                               backgroundColor: '#28a745',
// //                               borderRadius: '50%',
// //                               color: 'white',
// //                               zIndex: 3,
// //                               fontSize: '14px'
// //                             }}
// //                           >
// //                             ✓
// //                           </div>
// //                         </>
// //                       )}
// //                     </div>
// //                   );
// //                 })}
// //               </div>
// //             ))}
// //           </div>
// //         </div>

// //         {/* Next Button */}
// //         <div className="w-100 px-4 px-md-5 mt-4 mx-auto d-flex justify-content-end align-items-center gap-3" style={{ maxWidth: '1200px' }}>
// //           <button
// //             onClick={handleNext}
// //             disabled={!selectedShade}
// //             className="btn btn-dark d-flex align-items-center gap-2"
// //             style={{
// //               opacity: selectedShade ? 1 : 0.5,
// //               cursor: selectedShade ? "pointer" : "not-allowed"
// //             }}
// //           >
// //             <span className="fw-bold">Next</span>
// //             <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
// //               <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
// //             </svg>
// //           </button>
// //         </div>

// //       </div>
// //       <Footer />
// //     </>
// //   );
// // };

// // export default SkinToneSlider;




















// import React, { useState, useRef, useEffect } from 'react';
// import { useNavigate } from "react-router-dom";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Header from "./Header";
// import Footer from "./Footer";
// import "../css/shadefinder.css";

// const API_BASE_URL = "https://beauty.joyory.com/api/user/shadefinder";

// const SkinToneSlider = () => {
//   const [tones, setTones] = useState([]);
//   const [selectedShade, setSelectedShade] = useState(null);
//   const [selectedImageIndex, setSelectedImageIndex] = useState(null);
//   const [shadeIndex, setShadeIndex] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const galleryRef = useRef(null);
//   const navigate = useNavigate();

//   // Fetch tones from API
//   useEffect(() => {
//     const fetchTones = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`${API_BASE_URL}/tones`);

//         if (!res.ok) {
//           throw new Error(`HTTP error! status: ${res.status}`);
//         }

//         const data = await res.json();

//         if (data.success && Array.isArray(data.tones)) {
//           const cleanedTones = data.tones.map(tone => ({
//             ...tone,
//             heroImages: (tone.heroImages || []).map(url => url.trim()).filter(url => url)
//           }));

//           setTones(cleanedTones);

//           const firstWithImages = cleanedTones.find(t =>
//             t.heroImages && t.heroImages.length > 0
//           );

//           if (firstWithImages) {
//             setSelectedShade(firstWithImages);
//             setShadeIndex(cleanedTones.indexOf(firstWithImages));
//           } else if (cleanedTones.length > 0) {
//             setSelectedShade(cleanedTones[0]);
//             setShadeIndex(0);
//           }
//         } else {
//           throw new Error("Invalid data structure from API");
//         }
//       } catch (err) {
//         console.error("Error fetching tones:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTones();
//   }, []);

//   // Scroll gallery to selected shade
//   useEffect(() => {
//     if (galleryRef.current && tones.length > 0) {
//       const container = galleryRef.current;
//       const columnWidth = container.scrollWidth / tones.length;
//       const scrollPosition = (shadeIndex * columnWidth) - (container.clientWidth / 2) + (columnWidth / 2);

//       container.scrollTo({
//         left: scrollPosition,
//         behavior: 'smooth'
//       });
//     }
//   }, [shadeIndex, tones.length]);

//   // Handle slider change
//   const handleSliderChange = (e) => {
//     const index = parseInt(e.target.value);
//     setShadeIndex(index);
//     if (tones[index]) {
//       setSelectedShade(tones[index]);
//       setSelectedImageIndex(null);
//     }
//   };

//   // Handle label click
//   const handleLabelClick = (index) => {
//     setShadeIndex(index);
//     if (tones[index]) {
//       setSelectedShade(tones[index]);
//       setSelectedImageIndex(null);
//     }
//   };

//   // Handle image click
//   const handleImageClick = (imgIndex) => {
//     setSelectedImageIndex(imgIndex);
//   };

//   // Handle Next click
//   const handleNext = async () => {
//     if (!selectedShade) return;

//     try {
//       const res = await fetch(
//         `${API_BASE_URL}/undertones?toneKey=${selectedShade.key}`
//       );

//       if (!res.ok) {
//         throw new Error(`HTTP error! status: ${res.status}`);
//       }

//       const data = await res.json();

//       navigate("/shadefinderundertone", {
//         state: {
//           shade: selectedShade,
//           undertones: data.undertones || [],
//           selectedImageIndex: selectedImageIndex,
//           selectedImageUrl: selectedImageIndex !== null ? selectedShade.heroImages[selectedImageIndex] : null,
//         },
//       });
//     } catch (err) {
//       console.error("Error fetching undertones:", err);
//       alert("Failed to load undertones. Please try again.");
//     }
//   };

//   // Split images into 2 rows (4 per row)
//   const getImageRows = (images) => {
//     return {
//       row1: images.slice(0, 4),
//       row2: images.slice(4, 8)
//     };
//   };

//   if (loading) {
//     return (
//       <>
//         <Header />
//         <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
//           <div className="text-center">
//             <div className="spinner-border text-primary" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </div>
//             <p className="mt-3 text-secondary">Loading shades...</p>
//           </div>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   if (error) {
//     return (
//       <>
//         <Header />
//         <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
//           <div className="text-center text-danger">
//             <h4>Error Loading Shades</h4>
//             <p>{error}</p>
//             <button className="btn btn-primary mt-3" onClick={() => window.location.reload()}>
//               Retry
//             </button>
//           </div>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   return (
//     <>
//       <Header />
//       <div className="container-fluid px-0 min-vh-100 d-flex flex-column justify-content-center bg-light overflow-hidden">

//         {/* Wrapper */}
//         <div className="w-100 px-4 px-md-5 mb-5 mx-auto shadfinder-margin-topss" style={{ maxWidth: '1200px' }}>

//           {/* Header */}
//           <header className="text-center mb-4">
//             <h1 className="display-5 fw-light mb-2" style={{ color: "#1a1a1a" }}>
//               Find your Shade Range
//             </h1>
//             <p className="text-secondary small">
//               Choose the group that best represents your skin tone
//             </p>
//             {selectedImageIndex !== null && selectedShade && (
//               <p className="text-success small fw-bold mt-1 mb-0">
//                 ✓ {selectedShade.name} - Image {selectedImageIndex + 1} selected
//               </p>
//             )}
//           </header>

//           {/* Labels Row */}
//           <div className="d-flex justify-content-between mb-3 px-2 shade-labels">
//             {tones.map((tone, index) => (
//               <div 
//                 key={tone._id} 
//                 className={`text-center fw-bold ${shadeIndex === index ? 'text-dark' : 'text-muted'}`}
//                 style={{ width: `${100 / tones.length}%`, fontSize: '0.85rem', letterSpacing: '1.5px' }}
//                 onClick={() => handleLabelClick(index)}
//                 role="button"
//               >
//                 {tone.name}
//               </div>
//             ))}
//           </div>

//           {/* Custom Slider */}
//           <div className="position-relative">
//             <input
//               type="range"
//               className="custom-skin-slider w-100"
//     //            style={{
//     //   background:
//     //     "linear-gradient(to right, rgb(249, 228, 212), rgb(232, 193, 160), rgb(212, 163, 115), rgb(166, 124, 82), rgb(123, 75, 42), rgb(61, 29, 17))",
//     // }}
//               min="0"
//               max={tones.length - 1}
//               step="1"
//               value={shadeIndex}
//               onChange={handleSliderChange}
//             />
//           </div>
//         </div>

//         {/* ✅ 2-ROW HORIZONTAL SCROLLING GALLERY - Same structure as original */}
//         <div className="gallery-wrapper position-relative w-100">
//           <div 
//             className="d-flex flex-nowrap overflow-hidden image-gallery" 
//             ref={galleryRef}
//           >
//             {tones.map((tone, idx) => {
//               const { row1, row2 } = getImageRows(tone.heroImages || []);
//               const isActive = shadeIndex === idx;

//               return (
//                 <div 
//                   key={tone._id} 
//                   className={`flex-shrink-0 px-2 image-column ${isActive ? 'active' : ''}`}
//                   style={{ 
//                     opacity: isActive ? 1 : 0.5,
//                     transition: 'opacity 0.3s ease',
//                     width: '100%',
//                     maxWidth: '1200px',
//                     minWidth: '300px'
//                   }}
//                 >
//                   {/* ✅ Row 1 */}
//                   <div className="d-flex flex-row gap-2 mb-2">
//                     {row1.map((imgUrl, imgIndex) => {
//                       const isSelected = isActive && selectedImageIndex === imgIndex;
//                       return (
//                         <div
//                           key={imgIndex}
//                           className="position-relative flex-fill"
//                           onClick={() => isActive && handleImageClick(imgIndex)}
//                           style={{
//                             cursor: isActive ? 'pointer' : 'default',
//                             flex: '1 1 23%',
//                             maxWidth: '25%'
//                           }}
//                         >
//                           <div style={{
//                             border: isSelected ? '3px solid #28a745' : '3px solid transparent',
//                             borderRadius: '4px',
//                             overflow: 'hidden',
//                             transition: 'all 0.3s ease'
//                           }}>
//                             <img 
//                               src={imgUrl} 
//                               alt={`${tone.name} - ${imgIndex + 1}`} 
//                               className="img-fluid"
//                               style={{ 
//                                 objectFit: 'cover',
//                                 display: 'block',
//                                 width: '100%',
//                                 height: '160px'
//                               }}
//                               onError={(e) => {
//                                 e.target.src = "https://via.placeholder.com/400x160?text=No+Image";
//                               }}
//                             />
//                           </div>

//                           {isSelected && (
//                             <>
//                               <div
//                                 className="position-absolute top-0 end-0 m-1 d-flex align-items-center justify-content-center"
//                                 style={{
//                                   width: '20px',
//                                   height: '20px',
//                                   backgroundColor: '#28a745',
//                                   borderRadius: '50%',
//                                   color: 'white',
//                                   zIndex: 3,
//                                   fontSize: '11px'
//                                 }}
//                               >
//                                 ✓
//                               </div>
//                             </>
//                           )}
//                         </div>
//                       );
//                     })}

//                     {/* Fill empty slots in row 1 */}
//                     {row1.length < 4 && Array.from({ length: 4 - row1.length }).map((_, i) => (
//                       <div key={`r1-empty-${i}`} className="flex-fill" style={{ flex: '1 1 23%', maxWidth: '25%' }}>
//                         <div style={{ 
//                           height: '160px',
//                           backgroundColor: '#f8f9fa',
//                           borderRadius: '4px',
//                           border: '2px dashed #dee2e6'
//                         }} />
//                       </div>
//                     ))}
//                   </div>

//                   {/* ✅ Row 2 */}
//                   <div className="d-flex flex-row gap-2">
//                     {row2.map((imgUrl, imgIndex) => {
//                       const actualIndex = imgIndex + 4;
//                       const isSelected = isActive && selectedImageIndex === actualIndex;
//                       return (
//                         <div
//                           key={imgIndex}
//                           className="position-relative flex-fill"
//                           onClick={() => isActive && handleImageClick(actualIndex)}
//                           style={{
//                             cursor: isActive ? 'pointer' : 'default',
//                             flex: '1 1 23%',
//                             maxWidth: '25%'
//                           }}
//                         >
//                           <div style={{
//                             border: isSelected ? '3px solid #28a745' : '3px solid transparent',
//                             borderRadius: '4px',
//                             overflow: 'hidden',
//                             transition: 'all 0.3s ease'
//                           }}>
//                             <img 
//                               src={imgUrl} 
//                               alt={`${tone.name} - ${actualIndex + 1}`} 
//                               className="img-fluid"
//                               style={{ 
//                                 objectFit: 'cover',
//                                 display: 'block',
//                                 width: '100%',
//                                 height: '160px'
//                               }}
//                               onError={(e) => {
//                                 e.target.src = "https://via.placeholder.com/400x160?text=No+Image";
//                               }}
//                             />
//                           </div>

//                           {isSelected && (
//                             <div
//                               className="position-absolute top-0 end-0 m-1 d-flex align-items-center justify-content-center"
//                               style={{
//                                 width: '20px',
//                                 height: '20px',
//                                 backgroundColor: '#28a745',
//                                 borderRadius: '50%',
//                                 color: 'white',
//                                 zIndex: 3,
//                                 fontSize: '11px'
//                               }}
//                             >
//                               ✓
//                             </div>
//                           )}
//                         </div>
//                       );
//                     })}

//                     {/* Fill empty slots in row 2 */}
//                     {row2.length < 4 && Array.from({ length: 4 - row2.length }).map((_, i) => (
//                       <div key={`r2-empty-${i}`} className="flex-fill" style={{ flex: '1 1 23%', maxWidth: '25%' }}>
//                         <div style={{ 
//                           height: '160px',
//                           backgroundColor: '#f8f9fa',
//                           borderRadius: '4px',
//                           border: '2px dashed #dee2e6'
//                         }} />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Next Button */}
//         <div className="w-100 px-4 px-md-5 mt-4 mx-auto d-flex justify-content-end align-items-center gap-3" style={{ maxWidth: '1200px' }}>
//           <button
//             onClick={handleNext}
//             disabled={!selectedShade}
//             className="btn btn-dark d-flex align-items-center gap-2"
//             style={{
//               opacity: selectedShade ? 1 : 0.5,
//               cursor: selectedShade ? "pointer" : "not-allowed"
//             }}
//           >
//             <span className="fw-bold">Next</span>
//             <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
//               <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
//             </svg>
//           </button>
//         </div>

//       </div>
//       <Footer />
//     </>
//   );
// };

// export default SkinToneSlider;














































import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import { Container } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header";
import Footer from "./Footer";
import "../css/shadefinder.css";

export default function SkinToneSelector() {
  const [tones, setTones] = useState([]);
  const [selectedShade, setSelectedShade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // Fetch tones from API
  useEffect(() => {
    const fetchTones = async () => {
      try {
        const res = await fetch(
          "https://beauty.joyory.com/api/user/shadefinder/tones"
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (data.success && Array.isArray(data.tones)) {
          // Clean up the data - trim spaces from URLs
          const cleanedTones = data.tones.map(tone => ({
            ...tone,
            heroImages: (tone.heroImages || []).map(url => url.trim()).filter(url => url)
          }));

          setTones(cleanedTones);

          // Find first tone index with images
          const firstWithImagesIdx = cleanedTones.findIndex(t =>
            t.heroImages && t.heroImages.length > 0
          );

          if (firstWithImagesIdx >= 0) {
            setCurrentIndex(firstWithImagesIdx);
            setSelectedShade(cleanedTones[firstWithImagesIdx]);
          } else if (cleanedTones.length > 0) {
            setCurrentIndex(0);
            setSelectedShade(cleanedTones[0]);
          }
        } else {
          throw new Error("Invalid data structure from API");
        }
      } catch (err) {
        console.error("Error fetching tones:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTones();
  }, []);

  // Update selectedShade when currentIndex changes
  useEffect(() => {
    if (tones.length > 0 && tones[currentIndex]) {
      setSelectedShade(tones[currentIndex]);
    }
  }, [currentIndex, tones]);

  // Handle Label Click
  const handleLabelClick = (index) => {
    setCurrentIndex(index);
  };

  // Handle Slider Change
  const handleSliderChange = (e) => {
    setCurrentIndex(parseInt(e.target.value));
  };

  const handleNext = async () => {
    if (!selectedShade) return;

    try {
      const res = await fetch(
        `https://beauty.joyory.com/api/user/shadefinder/undertones?toneKey=${selectedShade.key}`
      );
      const data = await res.json();

      navigate("/shadefinderundertone", {
        state: {
          shade: selectedShade,
          undertones: data.undertones || [],
        },
      });
    } catch (err) {
      console.error("Error fetching undertones:", err);
    }
  };


  if (loading) {
    return (
      <>
        <Header />
        <div className="bg-white py-5" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-secondary">Loading shades...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="bg-white py-5" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="text-center text-danger">
            <h4>Error Loading Shades</h4>
            <p>{error}</p>
            <button
              className="btn btn-primary mt-3"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="shadefinder-wrapper bg-white" style={{ minHeight: "100vh" }}>
        <Container className="d-flex flex-column align-items-center">
          {/* Header Section */}
          <header className="text-center mb-4 mb-md-5">
            <h1 className="display-6 fw-normal mb-2" style={{ color: "#333" }}>
              Find your Shade Range
            </h1>
            <p className="text-secondary small">
              Choose the group that best represents your skin tone
            </p>
          </header>

          {/* Slider & Labels Section */}
          <div className="slider-labels-container w-100 mb-4 mb-md-5">
            <div className="d-flex align-items-end mb-2 mb-md-3 px-1" style={{ width: '100%' }}>
              {tones.map((tone, idx) => (
                <div
                  key={tone._id}
                  style={{ width: `${100 / tones.length}%` }}
                  className="text-center"
                >
                  <button
                    onClick={() => handleLabelClick(idx)}
                    className={`slider-label-btn ${currentIndex === idx ? 'active' : ''}`}
                  >
                    {tone.name}
                  </button>
                </div>
              ))}
            </div>

            <div
              className="position-relative"
              style={{
                height: '5px',
                left: `${100 / (2 * (tones.length || 1))}%`,
                width: `${100 * ((tones.length || 1) - 1) / (tones.length || 1)}%`
              }}
            >
              <div
                className="position-absolute top-0 start-0 w-100 h-100 rounded-pill"
                style={{
                  background: 'linear-gradient(to right, #f9e4d4, #e8c1a0, #d4a373, #a67c52, #7b4b2a, #3d1d11)'
                }}
              />
              <input
                type="range"
                min="0"
                max={tones.length > 0 ? tones.length - 1 : 0}
                value={currentIndex}
                onChange={handleSliderChange}
                className="position-absolute top-0 start-0 w-100 h-100 opacity-0 cursor-pointer"
                style={{ zIndex: 10 }}
              />
              <Motion.div
                className="position-absolute rounded-circle shadow-sm"
                animate={{
                  left: `${tones.length > 1 ? (currentIndex / (tones.length - 1)) * 100 : 0}%`,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{
                  width: '24px',
                  height: '24px',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: '#000',
                  border: '2px solid #fff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
              />
            </div>
          </div>

          {/* Horizontal Scroll Grid Section */}
          <div className="tones-horizontal-scroll-container">
            <div
              className="tones-scroll-track"
              style={{ transform: `translateX(calc(25% - ${currentIndex * 50}%))` }}
            >
              {tones.map((tone, toneIdx) => (
                <div
                  key={tone._id}
                  className={`tone-section ${currentIndex !== toneIdx ? 'inactive' : ''}`}
                >
                  <div className="tone-images-grid">
                    {(tone.heroImages || []).slice(0, 6).map((imgUrl, imgIdx) => (
                      <div key={imgIdx} className="tone-image-item shadow-sm">
                        <img
                          src={imgUrl}
                          alt={`${tone.name} focus ${imgIdx + 1}`}
                          loading="lazy"
                        />
                      </div>
                    ))}
                    {/* Placeholder images if less than 6 */}
                    {[...Array(Math.max(0, 6 - (tone.heroImages?.length || 0)))].map((_, i) => (
                      <div key={`placeholder-${i}`} className="tone-image-item opacity-25"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="slider-labels-container w-100 position-relative d-flex justify-content-center align-items-center mt-3 mt-md-4 action-footer">
            {/* Pagination Dots (Optional, matching Rare Beauty) */}
            <div className="d-flex gap-2">
              {tones.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className="p-2 border-0 bg-transparent d-flex align-items-center justify-content-center"
                  style={{
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                  aria-label={`Go to shade ${idx + 1}`}
                >
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: currentIndex === idx ? '#000' : '#ddd',
                      transition: 'all 0.3s ease'
                    }}
                  />
                </button>
              ))}
            </div>

            <button
              className="btn-next-rectangular position-absolute end-0"
              onClick={handleNext}
            >
              Next <ArrowRight size={14} />
            </button>
          </div>
        </Container>
      </div>

      <Footer />
    </>
  );
}