// import React, { useRef, useState, useEffect } from "react";
// import Webcam from "react-webcam";
// import * as faceapi from "@vladmandic/face-api";
// import axios from "axios";
// import Slider from "react-slick";
// import "../css/VirtualTryOn.css"; // Assuming you have custom styles for the component

// export default function VirtualTryOn() {
//   const webcamRef = useRef(null);
//   const canvasRef = useRef(null);
//   const imageRef = useRef(null);

//   const [modelsLoaded, setModelsLoaded] = useState(false);
//   const [selectedShade, setSelectedShade] = useState(null);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [faceArea, setFaceArea] = useState(null);
//   const [uploadedImage, setUploadedImage] = useState(null);
//   const [products, setProducts] = useState([]);

//   // Fetch product data from the API
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get("https://beauty.joyory.com/api/user/products");
//         setProducts(response.data.products);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };
//     fetchProducts();
//   }, []);

//   // Load face-api models
//   useEffect(() => {
//     const loadModels = async () => {
//       const MODEL_URL = window.location.origin + "/models";
//       try {
//         await Promise.all([
//           faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
//           faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
//         ]);
//         setModelsLoaded(true);
//       } catch (err) {
//         console.error("Error loading models:", err);
//       }
//     };
//     loadModels();
//   }, []);

//   // Draw the shape (for lips or eyes)
//   const drawShape = (ctx, points, fillStyle) => {
//     ctx.beginPath();
//     ctx.moveTo(points[0].x, points[0].y);
//     for (let i = 1; i < points.length; i++) {
//       ctx.lineTo(points[i].x, points[i].y);
//     }
//     ctx.closePath();
//     ctx.fillStyle = fillStyle;
//     ctx.fill();
//   };

//   // Process webcam feed
//   useEffect(() => {
//     if (!modelsLoaded || uploadedImage) return;

//     const interval = setInterval(async () => {
//       if (webcamRef.current && webcamRef.current.video.readyState === 4) {
//         const video = webcamRef.current.video;
//         const detections = await faceapi
//           .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
//           .withFaceLandmarks();

//         if (detections) {
//           const dims = { width: video.videoWidth, height: video.videoHeight };
//           const canvas = canvasRef.current;
//           faceapi.matchDimensions(canvas, dims);

//           const resized = faceapi.resizeResults(detections, dims);
//           const ctx = canvas.getContext("2d");
//           ctx.clearRect(0, 0, canvas.width, canvas.height);

//           if (faceArea && selectedShade) {
//             if (faceArea === "lips") {
//               const lips = resized.landmarks.getMouth();
//               drawShape(ctx, lips, selectedShade.hex);
//             } else if (faceArea === "eyes") {
//               drawShape(ctx, resized.landmarks.getLeftEye(), selectedShade.hex);
//               drawShape(ctx, resized.landmarks.getRightEye(), selectedShade.hex);
//             }
//           }
//         }
//       }
//     }, 200);

//     return () => clearInterval(interval);
//   }, [modelsLoaded, faceArea, selectedShade, uploadedImage]);

//   // Handle image upload
//   const handleUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         setUploadedImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Slider settings
//   const sliderSettings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 3,
//     slidesToScroll: 1,
//     responsive: [
//       {
//         breakpoint: 1024,
//         settings: {
//           slidesToShow: 2,
//         },
//       },
//       {
//         breakpoint: 600,
//         settings: {
//           slidesToShow: 1,
//         },
//       },
//     ],
//   };

//   return (
//     <div className="container py-4">
//       <div className="row">
//         {/* LEFT SIDE: webcam or uploaded image */}
//         <div className="col-md-6 text-center">
//           <div style={{ position: "relative", display: "inline-block" }}>
//             {!uploadedImage ? (
//               <Webcam
//                 ref={webcamRef}
//                 audio={false}
//                 screenshotFormat="image/jpeg"
//                 className="w-100 rounded shadow"
//               />
//             ) : (
//               <img
//                 ref={imageRef}
//                 src={uploadedImage}
//                 alt="Uploaded"
//                 className="w-100 rounded shadow"
//                 onLoad={() => {
//                   if (modelsLoaded) {
//                     setTimeout(() => {
//                       if (faceArea && selectedShade) {
//                         setSelectedShade({ ...selectedShade });
//                       }
//                     }, 200);
//                   }
//                 }}
//               />
//             )}
//             <canvas ref={canvasRef} className="overlay-canvas" />
//           </div>
//           <div className="mt-3">
//             <input type="file" accept="image/*" onChange={handleUpload} />
//             {uploadedImage && (
//               <button
//                 className="btn btn-sm btn-outline-danger mt-2"
//                 onClick={() => setUploadedImage(null)}
//               >
//                 Remove Photo
//               </button>
//             )}
//           </div>
//         </div>

//         {/* RIGHT SIDE: Product Slider & Controls */}
//         <div className="col-md-6">
//           {/* Product Slider */}
//           <div>
//             <h5>Select Product</h5>
//             <Slider {...sliderSettings}>
//               {products.map((product) => (
//                 <div
//                   key={product._id}
//                   className="product-slider-item"
//                   onClick={() => {
//                     setSelectedProduct(product);
//                     setSelectedShade(null); // Reset selected shade when product changes
//                   }}
//                 >
//                   <img
//                     src={product.image} // Assuming `image` exists in product data
//                     alt={product.name}
//                     className="img-fluid rounded"
//                   />
//                   <h6>{product.name}</h6>
//                 </div>
//               ))}
//             </Slider>
//           </div>

//           {/* Shade selection */}
//           {selectedProduct && selectedProduct.shadeOptions && (
//             <div>
//               <h5>Select Shade</h5>
//               <div className="d-flex flex-wrap gap-2">
//                 {selectedProduct.shadeOptions.map((shade, index) => (
//                   <div
//                     key={index}
//                     className="shade-dot"
//                     style={{
//                       backgroundColor: selectedProduct.colorOptions[index],
//                       border:
//                         selectedShade === shade
//                           ? "3px solid #007bff"
//                           : "1px solid #ccc",
//                     }}
//                     onClick={() => setSelectedShade(shade)}
//                   />
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Select face area */}
//           {!faceArea && !selectedProduct && (
//             <div>
//               <h5>Select Face Area</h5>
//               <button
//                 className="btn btn-outline-primary m-2"
//                 onClick={() => setFaceArea("lips")}
//               >
//                 Lips
//               </button>
//               <button
//                 className="btn btn-outline-success m-2"
//                 onClick={() => setFaceArea("eyes")}
//               >
//                 Eyes
//               </button>
//             </div>
//           )}

//           {/* Reset button */}
//           <button
//             className="btn btn-secondary mt-3"
//             onClick={() => {
//               setFaceArea(null);
//               setSelectedShade(null);
//               setSelectedProduct(null);
//             }}
//           >
//             Reset
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }




















// import React, { useRef, useState, useEffect } from "react";
// import Webcam from "react-webcam";
// import * as faceapi from "@vladmandic/face-api";
// import axios from "axios";
// import Slider from "react-slick";
// import "../css/VirtualTryOn.css"; // Assuming you have custom styles for the component

// export default function VirtualTryOn() {
//   const webcamRef = useRef(null);
//   const canvasRef = useRef(null);
//   const imageRef = useRef(null);

//   const [modelsLoaded, setModelsLoaded] = useState(false);
//   const [selectedShade, setSelectedShade] = useState(null);  // Store selected shade
//   const [selectedProduct, setSelectedProduct] = useState(null); // Store selected product
//   const [faceArea, setFaceArea] = useState(null); // Face area (lips or eyes)
//   const [uploadedImage, setUploadedImage] = useState(null); // For uploaded photo
//   const [products, setProducts] = useState([]); // Store product data

//   // Fetch product data from the API
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get("https://beauty.joyory.com/api/user/products");
//         console.log("Fetched Products: ", response.data.products);  // Log products to check
//         setProducts(response.data.products);  // Update the state with the products data
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };
//     fetchProducts();
//   }, []);

//   // Load face-api models
//   useEffect(() => {
//     const loadModels = async () => {
//       const MODEL_URL = window.location.origin + "/models";
//       try {
//         await Promise.all([
//           faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
//           faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
//         ]);
//         setModelsLoaded(true);
//       } catch (err) {
//         console.error("Error loading models:", err);
//       }
//     };
//     loadModels();
//   }, []);

//   // Draw the shape (for lips or eyes) based on selected shade
//   const drawShape = (ctx, points, fillStyle) => {
//     ctx.beginPath();
//     ctx.moveTo(points[0].x, points[0].y);
//     for (let i = 1; i < points.length; i++) {
//       ctx.lineTo(points[i].x, points[i].y);
//     }
//     ctx.closePath();
//     ctx.fillStyle = fillStyle;
//     ctx.fill();
//   };

//   // Process webcam feed to detect face landmarks
//   useEffect(() => {
//     if (!modelsLoaded || uploadedImage) return;

//     const interval = setInterval(async () => {
//       if (webcamRef.current && webcamRef.current.video.readyState === 4) {
//         const video = webcamRef.current.video;
//         const detections = await faceapi
//           .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
//           .withFaceLandmarks();

//         if (detections) {
//           const dims = { width: video.videoWidth, height: video.videoHeight };
//           const canvas = canvasRef.current;
//           faceapi.matchDimensions(canvas, dims);

//           const resized = faceapi.resizeResults(detections, dims);
//           const ctx = canvas.getContext("2d");
//           ctx.clearRect(0, 0, canvas.width, canvas.height);

//           if (faceArea && selectedShade) {
//             if (faceArea === "lips") {
//               const lips = resized.landmarks.getMouth();
//               drawShape(ctx, lips, selectedShade);  // Apply selected shade color
//             } else if (faceArea === "eyes") {
//               drawShape(ctx, resized.landmarks.getLeftEye(), selectedShade);
//               drawShape(ctx, resized.landmarks.getRightEye(), selectedShade);
//             }
//           }
//         }
//       }
//     }, 200);

//     return () => clearInterval(interval);
//   }, [modelsLoaded, faceArea, selectedShade, uploadedImage]);

//   // Handle image upload
//   const handleUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         setUploadedImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Slider settings for the product carousel
//   const sliderSettings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 3,
//     slidesToScroll: 1,
//     responsive: [
//       {
//         breakpoint: 1024,
//         settings: {
//           slidesToShow: 2,
//         },
//       },
//       {
//         breakpoint: 600,
//         settings: {
//           slidesToShow: 1,
//         },
//       },
//     ],
//   };

//   return (
//     <div className="container py-4">
//       <div className="row">
//         {/* LEFT SIDE: webcam or uploaded image */}
//         <div className="col-md-6 text-center">
//           <div style={{ position: "relative", display: "inline-block" }}>
//             {!uploadedImage ? (
//               <Webcam
//                 ref={webcamRef}
//                 audio={false}
//                 screenshotFormat="image/jpeg"
//                 className="w-100 rounded shadow"
//               />
//             ) : (
//               <img
//                 ref={imageRef}
//                 src={uploadedImage}
//                 alt="Uploaded"
//                 className="w-100 rounded shadow"
//                 onLoad={() => {
//                   if (modelsLoaded) {
//                     setTimeout(() => {
//                       if (faceArea && selectedShade) {
//                         setSelectedShade({ ...selectedShade });
//                       }
//                     }, 200);
//                   }
//                 }}
//               />
//             )}
//             <canvas ref={canvasRef} className="overlay-canvas" />
//           </div>
//           <div className="mt-3">
//             <input type="file" accept="image/*" onChange={handleUpload} />
//             {uploadedImage && (
//               <button
//                 className="btn btn-sm btn-outline-danger mt-2"
//                 onClick={() => setUploadedImage(null)}
//               >
//                 Remove Photo
//               </button>
//             )}
//           </div>
//         </div>

//         {/* RIGHT SIDE: Product Slider & Controls */}
//         <div className="col-md-6">
//           {/* Product Slider */}
//           <div>
//             <h5>Select Product</h5>
//             {products.length > 0 ? (
//               <Slider {...sliderSettings}>
//                 {products.map((product) => (
//                   <div
//                     key={product._id}
//                     className="product-slider-item"
//                     onClick={() => {
//                       setSelectedProduct(product);
//                       setSelectedShade(null); // Reset selected shade when product changes
//                     }}
//                   >
//                     <img
//                       src={product.image} // Assuming `image` exists in product data
//                       alt={product.name}
//                       className="img-fluid rounded"
//                     />
//                     <h6>{product.name}</h6>
//                   </div>
//                 ))}
//               </Slider>
//             ) : (
//               <p>No products available.</p>
//             )}
//           </div>

//           {/* Shade selection */}
//           {selectedProduct && selectedProduct.shadeOptions && (
//             <div>
//               <h5>Select Shade</h5>
//               <div className="d-flex flex-wrap gap-2">
//                 {selectedProduct.shadeOptions.map((shade, index) => (
//                   <div
//                     key={index}
//                     className="shade-dot"
//                     style={{
//                       backgroundColor: selectedProduct.colorOptions[index],
//                       border:
//                         selectedShade === selectedProduct.colorOptions[index]
//                           ? "3px solid #007bff"
//                           : "1px solid #ccc",
//                     }}
//                     onClick={() => setSelectedShade(selectedProduct.colorOptions[index])} // Set the selected shade color dynamically
//                   />
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Select face area */}
//           {!faceArea && !selectedProduct && (
//             <div>
//               <h5>Select Face Area</h5>
//               <button
//                 className="btn btn-outline-primary m-2"
//                 onClick={() => setFaceArea("lips")}
//               >
//                 Lips
//               </button>
//               <button
//                 className="btn btn-outline-success m-2"
//                 onClick={() => setFaceArea("eyes")}
//               >
//                 Eyes
//               </button>
//             </div>
//           )}

//           {/* Reset button */}
//           <button
//             className="btn btn-secondary mt-3"
//             onClick={() => {
//               setFaceArea(null);
//               setSelectedShade(null);
//               setSelectedProduct(null);
//             }}
//           >
//             Reset
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }






















// import React, { useRef, useState, useEffect } from "react";
// import Webcam from "react-webcam";
// import * as faceapi from "@vladmandic/face-api";
// import axios from "axios";
// import Slider from "react-slick";
// import "../css/VirtualTryOn.css";

// export default function VirtualTryOn() {
//   const webcamRef = useRef(null);
//   const canvasRef = useRef(null);
//   const imageRef = useRef(null);

//   const [modelsLoaded, setModelsLoaded] = useState(false);
//   const [selectedShade, setSelectedShade] = useState(null);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [faceArea, setFaceArea] = useState(null);
//   const [uploadedImage, setUploadedImage] = useState(null);
//   const [products, setProducts] = useState([]);

//   // Fetch product data
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get(
//           "https://beauty.joyory.com/api/user/products"
//         );
//         console.log("Fetched Products:", response.data.products);
//         setProducts(response.data.products);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };
//     fetchProducts();
//   }, []);

//   // Load face-api models
//   useEffect(() => {
//     const loadModels = async () => {
//       const MODEL_URL = window.location.origin + "/models";
//       try {
//         await Promise.all([
//           faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
//           faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
//         ]);
//         setModelsLoaded(true);
//       } catch (err) {
//         console.error("Error loading models:", err);
//       }
//     };
//     loadModels();
//   }, []);

//   // Draw shade (lips/eyes)
//   const drawShape = (ctx, points, fillStyle) => {
//     ctx.beginPath();
//     ctx.moveTo(points[0].x, points[0].y);
//     for (let i = 1; i < points.length; i++) {
//       ctx.lineTo(points[i].x, points[i].y);
//     }
//     ctx.closePath();
//     ctx.fillStyle = fillStyle;
//     ctx.globalAlpha = 0.6; // Slight transparency for natural look
//     ctx.fill();
//     ctx.globalAlpha = 1.0;
//   };

//   // Detect face and apply shade
//   useEffect(() => {
//     if (!modelsLoaded || uploadedImage) return;

//     const interval = setInterval(async () => {
//       if (webcamRef.current && webcamRef.current.video.readyState === 4) {
//         const video = webcamRef.current.video;
//         const detections = await faceapi
//           .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
//           .withFaceLandmarks();

//         if (detections) {
//           const dims = { width: video.videoWidth, height: video.videoHeight };
//           const canvas = canvasRef.current;
//           faceapi.matchDimensions(canvas, dims);

//           const resized = faceapi.resizeResults(detections, dims);
//           const ctx = canvas.getContext("2d");
//           ctx.clearRect(0, 0, canvas.width, canvas.height);

//           if (faceArea && selectedShade) {
//             if (faceArea === "lips") {
//               drawShape(ctx, resized.landmarks.getMouth(), selectedShade);
//             } else if (faceArea === "eyes") {
//               drawShape(ctx, resized.landmarks.getLeftEye(), selectedShade);
//               drawShape(ctx, resized.landmarks.getRightEye(), selectedShade);
//             }
//           }
//         }
//       }
//     }, 200);

//     return () => clearInterval(interval);
//   }, [modelsLoaded, faceArea, selectedShade, uploadedImage]);

//   // Handle image upload
//   const handleUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => setUploadedImage(reader.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   // Slider configuration
//   const sliderSettings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 3,
//     slidesToScroll: 1,
//     responsive: [
//       { breakpoint: 992, settings: { slidesToShow: 2 } },
//       { breakpoint: 768, settings: { slidesToShow: 1 } },
//     ],
//   };

//   return (
//     <div className="virtual-tryon container py-4">
//       <div className="row align-items-start g-4">
//         {/* LEFT SIDE: Webcam or Uploaded Image */}
//         <div className="col-12 col-md-6 text-center">
//           <div className="tryon-camera-wrapper position-relative mx-auto">
//             {!uploadedImage ? (
//               <Webcam
//                 ref={webcamRef}
//                 audio={false}
//                 screenshotFormat="image/jpeg"
//                 className="tryon-video rounded shadow w-100"
//               />
//             ) : (
//               <img
//                 ref={imageRef}
//                 src={uploadedImage}
//                 alt="Uploaded Face"
//                 className="tryon-uploaded rounded shadow w-100"
//               />
//             )}
//             <canvas ref={canvasRef} className="overlay-canvas" />
//           </div>

//           <div className="mt-3">
//             <input
//               type="file"
//               accept="image/*"
//               className="form-control"
//               onChange={handleUpload}
//             />
//             {uploadedImage && (
//               <button
//                 className="btn btn-outline-danger btn-sm mt-2"
//                 onClick={() => setUploadedImage(null)}
//               >
//                 Remove Photo
//               </button>
//             )}
//           </div>
//         </div>

//         {/* RIGHT SIDE: Controls */}
//         <div className="col-12 col-md-6">
//           {/* Product Slider */}
//           <h5 className="fw-bold mb-3 text-center text-md-start">
//             Select Product
//           </h5>
//           {products.length > 0 ? (
//             <Slider {...sliderSettings}>
//               {products.map((product) => (
//                 <div
//                   key={product._id}
//                   className="product-slider-item text-center"
//                   onClick={() => {
//                     setSelectedProduct(product);
//                     setSelectedShade(null);
//                   }}
//                 >
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="img-fluid rounded mb-2"
//                   />
//                   <p className="small fw-semibold">{product.name}</p>
//                 </div>
//               ))}
//             </Slider>
//           ) : (
//             <p className="text-muted">No products available.</p>
//           )}

//           {/* Shade Selection */}
//           {selectedProduct?.shadeOptions && (
//             <div className="mt-4">
//               <h6 className="fw-semibold mb-2">Select Shade</h6>
//               <div className="d-flex flex-wrap gap-2">
//                 {selectedProduct.shadeOptions.map((shade, i) => (
//                   <div
//                     key={i}
//                     className="shade-dot"
//                     style={{
//                       backgroundColor: selectedProduct.colorOptions[i],
//                       border:
//                         selectedShade === selectedProduct.colorOptions[i]
//                           ? "3px solid #007bff"
//                           : "1px solid #ccc",
//                     }}
//                     onClick={() =>
//                       setSelectedShade(selectedProduct.colorOptions[i])
//                     }
//                   />
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Face Area Buttons */}
//           {!faceArea && (
//             <div className="mt-4 text-center text-md-start">
//               <h6 className="fw-semibold mb-2">Select Face Area</h6>
//               <button
//                 className="btn btn-outline-primary m-1"
//                 onClick={() => setFaceArea("lips")}
//               >
//                 Lips
//               </button>
//               <button
//                 className="btn btn-outline-success m-1"
//                 onClick={() => setFaceArea("eyes")}
//               >
//                 Eyes
//               </button>
//             </div>
//           )}

//           {/* Reset */}
//           <div className="mt-4 text-center text-md-start">
//             <button
//               className="btn btn-secondary"
//               onClick={() => {
//                 setFaceArea(null);
//                 setSelectedShade(null);
//                 setSelectedProduct(null);
//               }}
//             >
//               Reset
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }






















/* --------------  VirtualTryOn.jsx  -------------- */
// import React, { useRef, useState, useEffect, useCallback } from "react";
// import Webcam from "react-webcam";
// import * as faceapi from "@vladmandic/face-api";
// import axios from "axios";
// import Slider from "react-slick";
// import "../css/VirtualTryOn.css";

// /* ----------  tiny Nykaa-like UI helpers  ---------- */
// const IconCamera = () => (
//   <svg width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
//     <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.345a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z" />
//     <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
//   </svg>
// );

// const IconFlip = () => (
//   <svg width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
//     <path d="M7.5 3.5A1.5 1.5 0 0 0 6 5v6a1.5 1.5 0 0 0 3 0V5A1.5 1.5 0 0 0 7.5 3.5z" />
//     <path d="M9 5a1 1 0 0 1 1-1h4a1 1 0 0 1 0 2h-1.5v.5l.82.82a1 1 0 0 1-1.41 1.41L10 7.71V11a1 1 0 0 1-2 0V5a1 1 0 0 1 1-1zM2 11a1 1 0 0 1-1 1h4a1 1 0 0 1 0-2H3.5v-.5l-.82-.82A1 1 0 0 1 4.1 6.27L6 8.17V5a1 1 0 0 1 2 0v6a1 1 0 0 1-1 1z" />
//   </svg>
// );

// export default function VirtualTryOn() {
//   const webcamRef = useRef(null);
//   const canvasRef = useRef(null);
//   const imageRef = useRef(null);
//   const downloadAnchor = useRef(null);

//   const [modelsLoaded, setModelsLoaded] = useState(false);
//   const [products, setProducts] = useState([]);
//   const [selectedProd, setSelectedProd] = useState(null);
//   const [selectedShade, setSelectedShade] = useState(null);
//   const [faceArea, setFaceArea] = useState(null); // 'lips' | 'eyes'
//   const [uploaded, setUploaded] = useState(null); // data-url
//   const [mirrored, setMirrored] = useState(false);
//   const [capturing, setCapturing] = useState(false);

//   /* ------------------  DATA  ------------------ */
//   useEffect(() => {
//     axios
//       .get("https://beauty.joyory.com/api/user/products")
//       .then((res) => setProducts(res.data.products || []))
//       .catch((err) => console.error("products fetch", err));
//   }, []);

//   useEffect(() => {
//     const MODEL_URL = window.location.origin + "/models";
//     Promise.all([
//       faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
//       faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
//     ])
//       .then(() => setModelsLoaded(true))
//       .catch((err) => console.error("face-api load", err));
//   }, []);

//   /* --------------  DRAW HELPERS  -------------- */
//   const drawShape = (ctx, pts, fill) => {
//     ctx.beginPath();
//     ctx.moveTo(pts[0].x, pts[0].y);
//     for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
//     ctx.closePath();
//     ctx.fillStyle = fill;
//     ctx.globalAlpha = 0.65;
//     ctx.fill();
//     ctx.globalAlpha = 1;
//   };

//   /* --------------  FACE LOOP  -------------- */
//   useEffect(() => {
//     if (!modelsLoaded) return;
//     const id = setInterval(async () => {
//       const src = uploaded ? imageRef.current : webcamRef.current?.video;
//       if (!src || src.readyState !== 4) return;

//       const detect = await faceapi
//         .detectSingleFace(src, new faceapi.TinyFaceDetectorOptions())
//         .withFaceLandmarks();
//       if (!detect) return;

//       const dims = { width: src.videoWidth || src.naturalWidth, height: src.videoHeight || src.naturalHeight };
//       const canvas = canvasRef.current;
//       faceapi.matchDimensions(canvas, dims);
//       const resized = faceapi.resizeResults(detect, dims);
//       const ctx = canvas.getContext("2d");
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       if (!selectedShade || !faceArea) return;
//       if (faceArea === "lips") drawShape(ctx, resized.landmarks.getMouth(), selectedShade);
//       if (faceArea === "eyes") {
//         drawShape(ctx, resized.landmarks.getLeftEye(), selectedShade);
//         drawShape(ctx, resized.landmarks.getRightEye(), selectedShade);
//       }
//     }, 100);
//     return () => clearInterval(id);
//   }, [modelsLoaded, selectedShade, faceArea, uploaded]);

//   /* --------------  SCREENSHOT  -------------- */
//   const capture = useCallback(() => {
//     const canvas = document.createElement("canvas");
//     const vid = uploaded ? imageRef.current : webcamRef.current.video;
//     canvas.width = vid.videoWidth || vid.naturalWidth;
//     canvas.height = vid.videoHeight || vid.naturalHeight;
//     const ctx = canvas.getContext("2d");
//     ctx.save();
//     if (!uploaded && mirrored) {
//       ctx.scale(-1, 1);
//       ctx.drawImage(vid, -canvas.width, 0, canvas.width, canvas.height);
//     } else ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
//     ctx.restore();
//     // overlay
//     const overlay = canvasRef.current;
//     if (overlay) ctx.drawImage(overlay, 0, 0);
//     const data = canvas.toDataURL("image/jpeg");
//     downloadAnchor.current.href = data;
//     downloadAnchor.current.download = "joyory-tryon.jpg";
//     downloadAnchor.current.click();
//   }, [mirrored, uploaded]);

//   /* --------------  UI  -------------- */
//   const sliderSets = {
//     dots: false,
//     infinite: false,
//     speed: 300,
//     slidesToShow: 3,
//     slidesToScroll: 1,
//     responsive: [{ breakpoint: 768, settings: { slidesToShow: 2 } }],
//   };

//   return (
//     <div className="virtual-tryon-wrapper">
//       <div className="container py-4">
//         <div className="row gx-4 gy-4">
//           {/* -----  CAMERA / IMAGE  ----- */}
//           <div className="col-lg-6">
//             <div className="camera-card">
//               <div className="camera-box position-relative">
//                 {!uploaded ? (
//                   <Webcam
//                     ref={webcamRef}
//                     audio={false}
//                     mirrored={mirrored}
//                     screenshotFormat="image/jpeg"
//                     className="camera-feed"
//                   />
//                 ) : (
//                   <img ref={imageRef} src={uploaded} alt="uploaded" className="camera-feed" />
//                 )}
//                 <canvas ref={canvasRef} className="overlay-canvas" />
//               </div>

//               <div className="camera-toolbar">
//                 <label className="btn-upload">
//                   <input type="file" accept="image/*" onChange={(e) => setUploaded(e.target.files?.[0] ? URL.createObjectURL(e.target.files[0]) : null)} hidden />
//                   Upload Photo
//                 </label>
//                 <button className="btn-icon" onClick={() => setMirrored((m) => !m)} title="Mirror">
//                   <IconFlip />
//                 </button>
//                 <button className="btn-icon" onClick={capture} title="Capture">
//                   <IconCamera />
//                 </button>
//                 {uploaded && (
//                   <button className="btn-retake" onClick={() => setUploaded(null)}>
//                     Retake
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* -----  CONTROLS  ----- */}
//           <div className="col-lg-6 controls-column">
//             <h5 className="block-title">Choose Product</h5>
//             {products.length ? (
//               <Slider {...sliderSets}>
//                 {products.map((p) => (
//                   <div key={p._id} className="product-card" onClick={() => setSelectedProd(p)}>
//                     <img src={p.images?.[0]} alt={p.name} />
//                     <p className="small mb-0">{p.name}</p>
//                   </div>
//                 ))}
//               </Slider>
//             ) : (
//               <p className="text-muted small">No products found</p>
//             )}

//             {selectedProd?.shadeOptions?.length ? (
//               <>
//                 <h6 className="block-title mt-4">Pick Shade</h6>
//                 <div className="shade-palette">
//                   {selectedProd.shadeOptions.map((shade, i) => (
//                     <button
//                       key={i}
//                       className={`shade-swatch ${selectedShade === selectedProd.colorOptions[i] ? "active" : ""}`}
//                       style={{ backgroundColor: selectedProd.colorOptions[i] }}
//                       onClick={() => setSelectedShade(selectedProd.colorOptions[i])}
//                       title={shade}
//                     />
//                   ))}
//                 </div>
//               </>
//             ) : null}

//             {!faceArea ? (
//               <>
//                 <h6 className="block-title mt-4">Try on</h6>
//                 <div className="area-selector">
//                   <button className="btn-area" onClick={() => setFaceArea("lips")}>
//                     Lips
//                   </button>
//                   <button className="btn-area" onClick={() => setFaceArea("eyes")}>
//                     Eyes
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <div className="mt-3">
//                 <button className="btn-reset" onClick={() => setFaceArea(null)}>
//                   Change area
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <a ref={downloadAnchor} style={{ display: "none" }} />
//     </div>
//   );
// }
























// /* --------------  VirtualTryOn.jsx  -------------- */
// import React, { useRef, useState, useEffect, useCallback } from "react";
// import Webcam from "react-webcam";
// import * as faceapi from "@vladmandic/face-api";
// import axios from "axios";
// import Slider from "react-slick";
// import "../css/VirtualTryOn.css";

// /* ----------  tiny Nykaa-like UI helpers  ---------- */
// const IconCamera = () => (
//   <svg width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
//     <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.345a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z" />
//     <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
//   </svg>
// );

// const IconFlip = () => (
//   <svg width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
//     <path d="M7.5 3.5A1.5 1.5 0 0 0 6 5v6a1.5 1.5 0 0 0 3 0V5A1.5 1.5 0 0 0 7.5 3.5z" />
//     <path d="M9 5a1 1 0 0 1 1-1h4a1 1 0 0 1 0 2h-1.5v.5l.82.82a1 1 0 0 1-1.41 1.41L10 7.71V11a1 1 0 0 1-2 0V5a1 1 0 0 1 1-1zM2 11a1 1 0 0 1-1 1h4a1 1 0 0 1 0-2H3.5v-.5l-.82-.82A1 1 0 0 1 4.1 6.27L6 8.17V5a1 1 0 0 1 2 0v6a1 1 0 0 1-1 1z" />
//   </svg>
// );

// /* --------------  MAIN COMPONENT  -------------- */
// export default function VirtualTryOn() {
//   const webcamRef = useRef(null);
//   const canvasRef = useRef(null);
//   const imageRef = useRef(null);
//   const downloadAnchor = useRef(null);

//   const [modelsLoaded, setModelsLoaded] = useState(false);
//   const [categories, setCategories] = useState([]);        // NEW
//   const [activeCat, setActiveCat] = useState("");          // NEW
//   const [products, setProducts] = useState([]);            // now per category
//   const [selectedProd, setSelectedProd] = useState(null);
//   const [selectedShade, setSelectedShade] = useState(null);
//   const [faceArea, setFaceArea] = useState(null);
//   const [uploaded, setUploaded] = useState(null);
//   const [mirrored, setMirrored] = useState(false);

//   /* ----------  FETCH TOP-CATEGORIES  ---------- */
//   useEffect(() => {
//     axios
//       // .get("https://beauty.joyory.com/api/user/products/top-categories")
//       .get("https://beauty.joyory.com/api/user/products/top-categories")
//       .then((res) => setCategories(res.data?.categories || []))
//       .catch((err) => console.error("top-categories fetch", err));
//   }, []);

//   /* ----------  AUTO-SELECT FIRST CATEGORY  ---------- */
//   useEffect(() => {
//     if (categories.length && !activeCat) setActiveCat(categories[0].slug);
//   }, [categories, activeCat]);

//   /* ----------  FETCH PRODUCTS OF ACTIVE CATEGORY  ---------- */
//   useEffect(() => {
//     if (!activeCat) return;
//     axios
//       // .get(`https://beauty.joyory.com/api/user/products/category/${activeCat}`)
//       .get(`https://beauty.joyory.com/api/user/products/category/${activeCat}`)
//       .then((res) => setProducts(res.data?.products || []))
//       .catch((err) => console.error("category products fetch", err));
//   }, [activeCat]);

//   /* ----------  LOAD FACE-API MODELS  ---------- */
//   useEffect(() => {
//     const MODEL_URL = window.location.origin + "/models";
//     Promise.all([
//       faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
//       faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
//     ])
//       .then(() => setModelsLoaded(true))
//       .catch((err) => console.error("face-api load", err));
//   }, []);

//   /* ----------  DRAWING HELPERS  ---------- */
//   const drawShape = (ctx, pts, fill) => {
//     ctx.beginPath();
//     ctx.moveTo(pts[0].x, pts[0].y);
//     for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
//     ctx.closePath();
//     ctx.fillStyle = fill;
//     ctx.globalAlpha = 0.65;
//     ctx.fill();
//     ctx.globalAlpha = 1;
//   };

//   /* ----------  FACE DETECTION LOOP  ---------- */
//   useEffect(() => {
//     if (!modelsLoaded) return;
//     const id = setInterval(async () => {
//       const src = uploaded ? imageRef.current : webcamRef.current?.video;
//       if (!src || src.readyState !== 4) return;

//       const detect = await faceapi
//         .detectSingleFace(src, new faceapi.TinyFaceDetectorOptions())
//         .withFaceLandmarks();
//       if (!detect) return;

//       const dims = {
//         width: src.videoWidth || src.naturalWidth,
//         height: src.videoHeight || src.naturalHeight,
//       };
//       const canvas = canvasRef.current;
//       faceapi.matchDimensions(canvas, dims);
//       const resized = faceapi.resizeResults(detect, dims);
//       const ctx = canvas.getContext("2d");
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       if (selectedShade && faceArea) {
//         if (faceArea === "lips") drawShape(ctx, resized.landmarks.getMouth(), selectedShade);
//         if (faceArea === "eyes") {
//           drawShape(ctx, resized.landmarks.getLeftEye(), selectedShade);
//           drawShape(ctx, resized.landmarks.getRightEye(), selectedShade);
//         }
//       }
//     }, 100);
//     return () => clearInterval(id);
//   }, [modelsLoaded, selectedShade, faceArea, uploaded]);

//   /* ----------  CAPTURE SCREENSHOT  ---------- */
//   const capture = useCallback(() => {
//     const canvas = document.createElement("canvas");
//     const vid = uploaded ? imageRef.current : webcamRef.current.video;
//     canvas.width = vid.videoWidth || vid.naturalWidth;
//     canvas.height = vid.videoHeight || vid.naturalHeight;
//     const ctx = canvas.getContext("2d");
//     ctx.save();
//     if (!uploaded && mirrored) {
//       ctx.scale(-1, 1);
//       ctx.drawImage(vid, -canvas.width, 0, canvas.width, canvas.height);
//     } else ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
//     ctx.restore();
//     const overlay = canvasRef.current;
//     if (overlay) ctx.drawImage(overlay, 0, 0);
//     const data = canvas.toDataURL("image/jpeg");
//     downloadAnchor.current.href = data;
//     downloadAnchor.current.download = "joyory-tryon.jpg";
//     downloadAnchor.current.click();
//   }, [mirrored, uploaded]);

//   /* ----------  SLIDER SETTINGS  ---------- */
//   const sliderSets = {
//     dots: false,
//     infinite: false,
//     speed: 300,
//     slidesToShow: 3,
//     slidesToScroll: 1,
//     responsive: [{ breakpoint: 768, settings: { slidesToShow: 2 } }],
//   };

//   /* ----------  CATEGORY PILL BAR  ---------- */
//   const CategoryPills = () => (
//     <div className="category-pills">
//       {categories.map((cat) => (
//         <button
//           key={cat._id}
//           className={`pill ${activeCat === cat.slug ? "active" : ""}`}
//           onClick={() => setActiveCat(cat.slug)}
//         >
//           {cat.name}
//         </button>
//       ))}
//     </div>
//   );

//   /* ----------  RENDER  ---------- */
//   return (
//     <div className="virtual-tryon-wrapper">
//       <div className="container py-4">
//         <div className="row gx-4 gy-4">
//           {/* -----  CAMERA / IMAGE  ----- */}
//           <div className="col-lg-6">
//             <div className="camera-card">
//               <div className="camera-box position-relative">
//                 {!uploaded ? (
//                   <Webcam
//                     ref={webcamRef}
//                     audio={false}
//                     mirrored={mirrored}
//                     screenshotFormat="image/jpeg"
//                     className="camera-feed"
//                   />
//                 ) : (
//                   <img ref={imageRef} src={uploaded} alt="uploaded" className="camera-feed" />
//                 )}
//                 <canvas ref={canvasRef} className="overlay-canvas" />
//               </div>

//               <div className="camera-toolbar">
//                 <label className="btn-upload">
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) =>
//                       setUploaded(
//                         e.target.files?.[0] ? URL.createObjectURL(e.target.files[0]) : null
//                       )
//                     }
//                     hidden
//                   />
//                   Upload Photo
//                 </label>
//                 <button className="btn-icon" onClick={() => setMirrored((m) => !m)} title="Mirror">
//                   <IconFlip />
//                 </button>
//                 <button className="btn-icon" onClick={capture} title="Capture">
//                   <IconCamera />
//                 </button>
//                 {uploaded && (
//                   <button className="btn-retake" onClick={() => setUploaded(null)}>
//                     Retake
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* -----  CONTROLS  ----- */}
//           <div className="col-lg-6 controls-column">
//             {/* 1. categories */}
//             <h5 className="block-title">Categories</h5>
//             <CategoryPills />

//             {/* 2. products slider */}
//             <h6 className="block-title mt-4">Choose Product</h6>
//             {products.length ? (
//               <Slider {...sliderSets}>
//                 {products.map((p) => (
//                   <div
//                     key={p._id}
//                     className="product-card"
//                     onClick={() => setSelectedProd(p)}
//                   >
//                     <img src={p.images?.[0]} alt={p.name} />
//                     <p className="small mb-0">{p.name}</p>
//                   </div>
//                 ))}
//               </Slider>
//             ) : (
//               <p className="text-muted small">No products in this category</p>
//             )}

//             {/* 3. shades */}
//             {selectedProd?.shadeOptions?.length ? (
//               <>
//                 <h6 className="block-title mt-4">Pick Shade</h6>
//                 <div className="shade-palette">
//                   {selectedProd.shadeOptions.map((shade, i) => (
//                     <button
//                       key={i}
//                       className={`shade-swatch ${selectedShade === selectedProd.colorOptions[i] ? "active" : ""}`}
//                       style={{ backgroundColor: selectedProd.colorOptions[i] }}
//                       onClick={() => setSelectedShade(selectedProd.colorOptions[i])}
//                       title={shade}
//                     />
//                   ))}
//                 </div>
//               </>
//             ) : null}

//             {/* 4. face area */}
//             {!faceArea ? (
//               <>
//                 <h6 className="block-title mt-4">Try on</h6>
//                 <div className="area-selector">
//                   <button className="btn-area" onClick={() => setFaceArea("lips")}>
//                     Lips
//                   </button>
//                   <button className="btn-area" onClick={() => setFaceArea("eyes")}>
//                     Eyes
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <div className="mt-3">
//                 <button className="btn-reset" onClick={() => setFaceArea(null)}>
//                   Change area
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <a ref={downloadAnchor} style={{ display: "none" }} />
//     </div>
//   );
// }































































// import React, { useRef, useState, useEffect, useCallback } from "react";
// import { useSearchParams } from 'react-router-dom';
// import Webcam from "react-webcam";
// import * as faceapi from "@vladmandic/face-api";
// import axios from "axios";
// import Slider from "react-slick";
// import "../css/Mainvirtualtryon.css";

// // ... (keep your existing icons)

// export default function Mainvirtualtryon() {
//   const [searchParams] = useSearchParams();
//   const webcamRef = useRef(null);
//   const canvasRef = useRef(null);
//   const imageRef = useRef(null);
//   const downloadAnchor = useRef(null);

//   // 🔥 NEW STATES FOR API DATA
//   const [vtoProducts, setVtoProducts] = useState([]);
//   const [loadingProducts, setLoadingProducts] = useState(true);
//   const [selectedProd, setSelectedProd] = useState(null);
//   const [selectedShade, setSelectedShade] = useState(null);
//   const [faceArea, setFaceArea] = useState(null);
//   const [modelsLoaded, setModelsLoaded] = useState(false);
//   const [uploaded, setUploaded] = useState(null);
//   const [mirrored, setMirrored] = useState(false);

//   // 🔥 LOAD PRODUCTS FROM URL PARAMS OR API
//   useEffect(() => {
//     const loadProducts = async () => {
//       try {
//         // 🔥 FIRST CHECK URL PARAMS (from banner click)
//         const productsParam = searchParams.get('products');
//         if (productsParam) {
//           console.log('🔥 Loading products from URL params');
//           const parsedProducts = JSON.parse(decodeURIComponent(productsParam));
//           setVtoProducts(parsedProducts);
//           if (parsedProducts.length > 0) {
//             setSelectedProd(parsedProducts[0]); // Auto-select first
//           }
//         } else {
//           // 🔥 FALLBACK: CALL API DIRECTLY
//           console.log('🔥 Loading products from API');
//           const response = await axios.get('https://beauty.joyory.com/api/vto/enabled');
//           setVtoProducts(response.data.products);
//           if (response.data.products.length > 0) {
//             setSelectedProd(response.data.products[0]);
//           }
//         }
//       } catch (error) {
//         console.error('❌ Products load error:', error);
//       } finally {
//         setLoadingProducts(false);
//       }
//     };

//     loadProducts();
//   }, [searchParams]);

//   // 🔥 LOAD FACE-API MODELS (keep your existing code)
//   useEffect(() => {
//     const MODEL_URL = window.location.origin + "/models";
//     Promise.all([
//       faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
//       faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
//     ])
//       .then(() => setModelsLoaded(true))
//       .catch((err) => console.error("face-api load", err));
//   }, []);

//   // 🔥 YOUR EXISTING DRAWING & DETECTION CODE (keep as is)
//   const drawShape = (ctx, pts, fill) => {
//     ctx.beginPath();
//     ctx.moveTo(pts[0].x, pts[0].y);
//     for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
//     ctx.closePath();
//     ctx.fillStyle = fill;
//     ctx.globalAlpha = 0.65;
//     ctx.fill();
//     ctx.globalAlpha = 1;
//   };

//   useEffect(() => {
//     if (!modelsLoaded) return;
//     const id = setInterval(async () => {
//       const src = uploaded ? imageRef.current : webcamRef.current?.video;
//       if (!src || src.readyState !== 4) return;
//       const detect = await faceapi
//         .detectSingleFace(src, new faceapi.TinyFaceDetectorOptions())
//         .withFaceLandmarks();
//       if (!detect) return;
//       const dims = {
//         width: src.videoWidth || src.naturalWidth,
//         height: src.videoHeight || src.naturalHeight,
//       };
//       const canvas = canvasRef.current;
//       faceapi.matchDimensions(canvas, dims);
//       const resized = faceapi.resizeResults(detect, dims);
//       const ctx = canvas.getContext("2d");
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       if (selectedShade && faceArea) {
//         if (faceArea === "lips") drawShape(ctx, resized.landmarks.getMouth(), selectedShade.hex);
//         if (faceArea === "eyes") {
//           drawShape(ctx, resized.landmarks.getLeftEye(), selectedShade.hex);
//           drawShape(ctx, resized.landmarks.getRightEye(), selectedShade.hex);
//         }
//       }
//     }, 100);
//     return () => clearInterval(id);
//   }, [modelsLoaded, selectedShade, faceArea, uploaded]);

//   // 🔥 CAPTURE (keep your existing)
//   const capture = useCallback(() => {
//     const canvas = document.createElement("canvas");
//     const vid = uploaded ? imageRef.current : webcamRef.current.video;
//     canvas.width = vid.videoWidth || vid.naturalWidth;
//     canvas.height = vid.videoHeight || vid.naturalHeight;
//     const ctx = canvas.getContext("2d");
//     ctx.save();
//     if (!uploaded && mirrored) {
//       ctx.scale(-1, 1);
//       ctx.drawImage(vid, -canvas.width, 0, canvas.width, canvas.height);
//     } else ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
//     ctx.restore();
//     const overlay = canvasRef.current;
//     if (overlay) ctx.drawImage(overlay, 0, 0);
//     const data = canvas.toDataURL("image/jpeg");
//     downloadAnchor.current.href = data;
//     downloadAnchor.current.download = `joyory-tryon-${selectedProd?.name || 'makeup'}.jpg`;
//     downloadAnchor.current.click();
//   }, [mirrored, uploaded, selectedProd]);

//   // 🔥 SLIDER SETTINGS
//   const sliderSets = {
//     dots: false,
//     infinite: false,
//     speed: 300,
//     slidesToShow: 3,
//     slidesToScroll: 1,
//     responsive: [
//       { breakpoint: 1200, settings: { slidesToShow: 3 } },
//       { breakpoint: 768, settings: { slidesToShow: 2 } },
//       { breakpoint: 480, settings: { slidesToShow: 1 } }
//     ],
//   };

//   // 🔥 RENDER PRODUCTS SLIDER
//   const ProductsSlider = () => (
//     <Slider {...sliderSets}>
//       {vtoProducts.map((product) => (
//         <div
//           key={product._id}
//           className={`product-card ${selectedProd?._id === product._id ? 'active' : ''}`}
//           onClick={() => {
//             setSelectedProd(product);
//             setSelectedShade(null); // Reset shade
//           }}
//         >
//           <div className="product-image-wrapper">
//             <img 
//               src={product.images?.[0] || product.selectedVariant?.images?.[0]} 
//               alt={product.name} 
//               className="product-image"
//             />
//             {product.brand && (
//               <div className="brand-badge">
//                 {product.brand.name}
//               </div>
//             )}
//           </div>
//           <div className="product-info">
//             <h6 className="product-name">{product.name}</h6>
//             <div className="product-price">
//               <span className="current-price">₹{product.selectedVariant?.discountedPrice || product.price}</span>
//               {product.selectedVariant?.discountPercent > 0 && (
//                 <span className="original-price">₹{product.selectedVariant?.originalPrice}</span>
//               )}
//               {product.selectedVariant?.discountPercent > 0 && (
//                 <span className="discount-badge">{product.selectedVariant?.discountPercent}% OFF</span>
//               )}
//             </div>
//           </div>
//         </div>
//       ))}
//     </Slider>
//   );

//   // 🔥 RENDER SHADES
//   const ShadesPalette = () => {
//     if (!selectedProd?.variants?.length) return null;

//     return (
//       <div className="shade-palette mt-4">
//         {selectedProd.variants.map((variant, index) => (
//           <button
//             key={variant.sku}
//             className={`shade-swatch ${selectedShade?.sku === variant.sku ? 'active' : ''}`}
//             style={{ 
//               backgroundColor: variant.hex,
//               width: '40px',
//               height: '40px',
//               borderRadius: '50%',
//               border: '3px solid white',
//               boxShadow: selectedShade?.sku === variant.sku ? '0 0 0 3px #007bff' : 'none'
//             }}
//             onClick={() => setSelectedShade(variant)}
//             title={`${variant.shadeName} - ₹${variant.discountedPrice}`}
//           >
//             {selectedShade?.sku === variant.sku && (
//               <span className="shade-check">✓</span>
//             )}
//           </button>
//         ))}
//       </div>
//     );
//   };

//   if (loadingProducts) {
//     return (
//       <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
//         <div className="text-center">
//           <div className="spinner-border text-primary mb-4" style={{ width: '3rem', height: '3rem' }} />
//           <h4>Loading Virtual Try On...</h4>
//           <p className="text-muted">Fetching makeup products</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="virtual-tryon-wrapper">
//       <div className="container-fluid py-4">
//         {/* 🔥 HEADER */}
//         <div className="row mb-4">
//           <div className="col-12 text-center">
//             <h1 className="display-5 fw-bold text-primary mb-2">
//               <i className="bi bi-magic"></i> Virtual Try On
//             </h1>
//             <p className="lead text-muted mb-0">
//               Try {vtoProducts.length} makeup products instantly with AR
//             </p>
//           </div>
//         </div>

//         <div className="row g-4">
//           {/* ----- CAMERA ----- */}
//           <div className="col-lg-7">
//             <div className="camera-card shadow-lg">
//               <div className="camera-box position-relative">
//                 {!uploaded ? (
//                   <Webcam
//                     ref={webcamRef}
//                     audio={false}
//                     mirrored={mirrored}
//                     screenshotFormat="image/jpeg"
//                     className="camera-feed"
//                   />
//                 ) : (
//                   <img ref={imageRef} src={uploaded} alt="uploaded" className="camera-feed" />
//                 )}
//                 <canvas ref={canvasRef} className="overlay-canvas" />
//               </div>

//               {/* 🔥 TRY ON STATUS */}
//               {selectedShade && faceArea && (
//                 <div className="tryon-status position-absolute top-20px end-20px bg-primary bg-opacity-90 text-white rounded-pill px-3 py-2">
//                   <i className="bi bi-check-circle-fill me-2"></i>
//                   Trying {selectedShade.shadeName} on {faceArea}
//                 </div>
//               )}

//               <div className="camera-toolbar mt-3">
//                 <label className="btn btn-outline-primary me-2">
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) =>
//                       setUploaded(
//                         e.target.files?.[0] ? URL.createObjectURL(e.target.files[0]) : null
//                       )
//                     }
//                     hidden
//                   />
//                   📸 Upload Photo
//                 </label>
//                 <button 
//                   className="btn btn-outline-secondary btn-sm me-2" 
//                   onClick={() => setMirrored((m) => !m)}
//                 >
//                   <i className="bi bi-arrow-repeat"></i>
//                 </button>
//                 <button 
//                   className="btn btn-success" 
//                   onClick={capture} 
//                   disabled={!selectedShade || !faceArea}
//                 >
//                   <i className="bi bi-download"></i> Download Look
//                 </button>
//                 {uploaded && (
//                   <button className="btn btn-outline-danger ms-2" onClick={() => setUploaded(null)}>
//                     <i className="bi bi-camera-video"></i> Live Camera
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* ----- PRODUCTS & CONTROLS ----- */}
//           <div className="col-lg-5">
//             <div className="controls-card shadow-lg p-4 h-100">
//               {/* 🔥 PRODUCTS */}
//               <div className="mb-4">
//                 <h5 className="block-title mb-3">
//                   <i className="bi bi-bag-heart text-primary me-2"></i>
//                   Makeup Products ({vtoProducts.length})
//                 </h5>
//                 {vtoProducts.length ? (
//                   <ProductsSlider />
//                 ) : (
//                   <div className="text-center py-4">
//                     <i className="bi bi-heartbreak fs-1 text-muted mb-3"></i>
//                     <p className="text-muted">No VTO products available</p>
//                   </div>
//                 )}
//               </div>

//               {/* 🔥 SHADES */}
//               {selectedProd && <ShadesPalette />}

//               {/* 🔥 FACE AREA */}
//               {!faceArea ? (
//                 <div className="mt-4">
//                   <h6 className="block-title mb-3">
//                     <i className="bi bi-target me-2"></i>Try on Area
//                   </h6>
//                   <div className="d-flex gap-2">
//                     <button 
//                       className="btn btn-outline-danger btn-lg flex-fill" 
//                       onClick={() => setFaceArea("lips")}
//                       disabled={!selectedShade}
//                     >
//                       <i className="bi bi-lipstick"></i><br/>Lips
//                     </button>
//                     <button 
//                       className="btn btn-outline-primary btn-lg flex-fill" 
//                       onClick={() => setFaceArea("eyes")}
//                       disabled={!selectedShade}
//                     >
//                       <i className="bi bi-eye"></i><br/>Eyes
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="mt-4 text-center">
//                   <div className="alert alert-success">
//                     <i className="bi bi-check-circle"></i>
//                     Ready to try {selectedShade?.shadeName} on {faceArea}!
//                   </div>
//                   <button 
//                     className="btn btn-outline-secondary w-100" 
//                     onClick={() => { 
//                       setFaceArea(null); 
//                       setSelectedShade(null); 
//                     }}
//                   >
//                     <i className="bi bi-arrow-repeat"></i> Change Selection
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <a ref={downloadAnchor} style={{ display: "none" }} />
//     </div>
//   );
// }












// import React, { useRef, useState, useEffect, useCallback } from "react";
// import { useSearchParams } from 'react-router-dom';
// import Webcam from "react-webcam";
// import * as faceapi from "@vladmandic/face-api";
// import axios from "axios";
// import Slider from "react-slick";
// import "../css/Mainvirtualtryon.css";

// export default function Mainvirtualtryon() {
//   const [searchParams] = useSearchParams();
//   const webcamRef = useRef(null);
//   const canvasRef = useRef(null);
//   const imageRef = useRef(null);
//   const downloadAnchor = useRef(null);

//   const [vtoProducts, setVtoProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [loadingProducts, setLoadingProducts] = useState(true);
//   const [selectedProd, setSelectedProd] = useState(null);
//   const [selectedShade, setSelectedShade] = useState(null);
//   const [faceArea, setFaceArea] = useState(null); // "lips" or "eyes" — only this area gets shade
//   const [modelsLoaded, setModelsLoaded] = useState(false);
//   const [uploaded, setUploaded] = useState(null);
//   const [mirrored, setMirrored] = useState(false);

//   // Load products
//   useEffect(() => {
//     const loadProducts = async () => {
//       try {
//         const productsParam = searchParams.get('products');
//         let products = [];

//         if (productsParam) {
//           products = JSON.parse(decodeURIComponent(productsParam));
//         } else {
//           // const response = await axios.get('https://beauty.joyory.com/api/vto/enabled');
//           const response = await axios.get('https://beauty.joyory.com/api/user/products/all?supportsVTO=true');
//           products = response.data.products || [];
//         }

//         setVtoProducts(products);
//         setFilteredProducts(products);

//         if (products.length > 0) {
//           setSelectedProd(products[0]);
//         }
//       } catch (error) {
//         console.error('Products load error:', error);
//       } finally {
//         setLoadingProducts(false);
//       }
//     };

//     loadProducts();
//   }, [searchParams]);

//   // Filter products when faceArea changes (Lips/Eyes/All via reset)
//   useEffect(() => {
//     let filtered = [...vtoProducts];

//     if (faceArea === "lips") {
//       filtered = filtered.filter(p =>
//         p.category?.name?.toLowerCase() === "lips" ||
//         p.name?.toLowerCase().includes("lip") ||
//         p.name?.toLowerCase().includes("mousse")
//       );
//     } else if (faceArea === "eyes") {
//       filtered = filtered.filter(p =>
//         p.name?.toLowerCase().includes("kajal") ||
//         p.name?.toLowerCase().includes("eye")
//       );
//     }
//     // faceArea === null => show all

//     setFilteredProducts(filtered);

//     // Auto-select first product in filtered list (if exists)
//     if (filtered.length > 0) {
//       const firstProd = filtered[0];
//       setSelectedProd(firstProd);
//       setSelectedShade(null); // reset shade when category changes
//     } else {
//       setSelectedProd(null);
//       setSelectedShade(null);
//     }
//   }, [vtoProducts, faceArea]);

//   // Load face-api models
//   useEffect(() => {
//     const MODEL_URL = window.location.origin + "/models";
//     Promise.all([
//       faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
//       faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
//     ])
//       .then(() => setModelsLoaded(true))
//       .catch((err) => console.error("face-api load", err));
//   }, []);

//   // Drawing helper
//   const drawShape = (ctx, pts, fill) => {
//     ctx.beginPath();
//     ctx.moveTo(pts[0].x, pts[0].y);
//     for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
//     ctx.closePath();
//     ctx.fillStyle = fill;
//     ctx.globalAlpha = 0.65;
//     ctx.fill();
//     ctx.globalAlpha = 1;
//   };

//   // Face detection & overlay
//   useEffect(() => {
//     if (!modelsLoaded) return;

//     const id = setInterval(async () => {
//       const src = uploaded ? imageRef.current : webcamRef.current?.video;
//       if (!src || src.readyState !== 4) return;

//       const detect = await faceapi
//         .detectSingleFace(src, new faceapi.TinyFaceDetectorOptions())
//         .withFaceLandmarks();

//       if (!detect) {
//         const canvas = canvasRef.current;
//         if (canvas) canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
//         return;
//       }

//       const dims = {
//         width: src.videoWidth || src.naturalWidth,
//         height: src.videoHeight || src.naturalHeight,
//       };
//       const canvas = canvasRef.current;
//       faceapi.matchDimensions(canvas, dims);
//       const resized = faceapi.resizeResults(detect, dims);
//       const ctx = canvas.getContext("2d");
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       // Apply shade only if selected and faceArea matches
//       if (selectedShade && faceArea) {
//         if (faceArea === "lips") {
//           drawShape(ctx, resized.landmarks.getMouth(), selectedShade.hex);
//         } else if (faceArea === "eyes") {
//           drawShape(ctx, resized.landmarks.getLeftEye(), selectedShade.hex);
//           drawShape(ctx, resized.landmarks.getRightEye(), selectedShade.hex);
//         }
//       }
//     }, 100);

//     return () => clearInterval(id);
//   }, [modelsLoaded, selectedShade, faceArea, uploaded]);

//   // Capture
//   const capture = useCallback(() => {
//     const canvas = document.createElement("canvas");
//     const vid = uploaded ? imageRef.current : webcamRef.current.video;
//     canvas.width = vid.videoWidth || vid.naturalWidth;
//     canvas.height = vid.videoHeight || vid.naturalHeight;
//     const ctx = canvas.getContext("2d");
//     ctx.save();
//     if (!uploaded && mirrored) {
//       ctx.scale(-1, 1);
//       ctx.drawImage(vid, -canvas.width, 0, canvas.width, canvas.height);
//     } else {
//       ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
//     }
//     ctx.restore();
//     const overlay = canvasRef.current;
//     if (overlay) ctx.drawImage(overlay, 0, 0);
//     const data = canvas.toDataURL("image/jpeg");
//     downloadAnchor.current.href = data;
//     downloadAnchor.current.download = `joyory-tryon-${selectedProd?.name || 'makeup'}.jpg`;
//     downloadAnchor.current.click();
//   }, [mirrored, uploaded, selectedProd]);

//   // Slider settings
//   const sliderSets = {
//     dots: false,
//     infinite: false,
//     speed: 300,
//     slidesToShow: 3,
//     slidesToScroll: 1,
//     responsive: [
//       { breakpoint: 1200, settings: { slidesToShow: 3 } },
//       { breakpoint: 768, settings: { slidesToShow: 2 } },
//       { breakpoint: 480, settings: { slidesToShow: 1 } }
//     ],
//   };

//   // Products Slider
//   const ProductsSlider = () => (
//     <Slider {...sliderSets}>
//       {filteredProducts.map((product) => (
//         <div
//           key={product._id}
//           className={`product-card ${selectedProd?._id === product._id ? 'active' : ''}`}
//           onClick={() => {
//             setSelectedProd(product);
//             setSelectedShade(null);
//           }}
//         >
//           <div className="product-image-wrapper">
//             <img
//               src={product.images?.[0] || product.selectedVariant?.images?.[0]}
//               alt={product.name}
//               className="product-image"
//             />
//             {product.brand && (
//               <div className="brand-badge">
//                 {product.brand.name}
//               </div>
//             )}
//           </div>
//           <div className="product-info">
//             <h6 className="product-name">{product.name}</h6>
//             <div className="product-price">
//               <span className="current-price">₹{product.selectedVariant?.discountedPrice || product.price}</span>
//               {product.selectedVariant?.discountPercent > 0 && (
//                 <span className="original-price">₹{product.selectedVariant?.originalPrice}</span>
//               )}
//               {product.selectedVariant?.discountPercent > 0 && (
//                 <span className="discount-badge">{product.selectedVariant?.discountPercent}% OFF</span>
//               )}
//             </div>
//           </div>
//         </div>
//       ))}
//     </Slider>
//   );

//   // Shades Palette
//   const ShadesPalette = () => {
//     if (!selectedProd?.variants?.length) return null;

//     return (
//       <div className="shade-palette mt-4">
//         {selectedProd.variants.map((variant) => (
//           <button
//             key={variant.sku}
//             className={`shade-swatch ${selectedShade?.sku === variant.sku ? 'active' : ''}`}
//             style={{
//               backgroundColor: variant.hex,
//               width: '40px',
//               height: '40px',
//               borderRadius: '50%',
//               border: '3px solid white',
//               boxShadow: selectedShade?.sku === variant.sku ? '0 0 0 3px #007bff' : 'none'
//             }}
//             onClick={() => setSelectedShade(variant)}
//             title={`${variant.shadeName} - ₹${variant.discountedPrice}`}
//           >
//             {selectedShade?.sku === variant.sku && (
//               <span className="shade-check">✓</span>
//             )}
//           </button>
//         ))}
//       </div>
//     );
//   };

//   if (loadingProducts) {
//     return (
//       <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
//         <div className="text-center">
//           <div className="spinner-border text-primary mb-4" style={{ width: '3rem', height: '3rem' }} />
//           <h4>Loading Virtual Try On...</h4>
//           <p className="text-muted">Fetching makeup products</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="virtual-tryon-wrapper">
//       <div className="container-fluid py-4">
//         {/* HEADER */}
//         <div className="row mb-4">
//           <div className="col-12 text-center">
//             <h1 className="display-5 fw-bold text-primary mb-2">
//               Virtual Try On
//             </h1>
//             <p className="lead text-muted mb-0">
//               Try {filteredProducts.length} makeup products instantly with AR
//             </p>
//           </div>
//         </div>

//         <div className="row g-4">
//           {/* CAMERA */}
//           <div className="col-lg-7">
//             <div className="camera-card shadow-lg">
//               <div className="camera-box position-relative">
//                 {!uploaded ? (
//                   <Webcam
//                     ref={webcamRef}
//                     audio={false}
//                     mirrored={mirrored}
//                     screenshotFormat="image/jpeg"
//                     className="camera-feed"
//                   />
//                 ) : (
//                   <img ref={imageRef} src={uploaded} alt="uploaded" className="camera-feed" />
//                 )}
//                 <canvas ref={canvasRef} className="overlay-canvas" />
//               </div>

//               {/* TRY ON STATUS */}
//               {selectedShade && faceArea && (
//                 <div className="tryon-status position-absolute top-20px end-20px bg-primary bg-opacity-90 text-white rounded-pill px-3 py-2">
//                   Trying {selectedShade.shadeName} on {faceArea}
//                 </div>
//               )}

//               <div className="camera-toolbar mt-3">
//                 <label className="btn btn-outline-primary me-2">
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) =>
//                       setUploaded(
//                         e.target.files?.[0] ? URL.createObjectURL(e.target.files[0]) : null
//                       )
//                     }
//                     hidden
//                   />
//                   📸 Upload Photo
//                 </label>
//                 <button
//                   className="btn btn-outline-secondary btn-sm me-2"
//                   onClick={() => setMirrored((m) => !m)}
//                 >
//                   Flip
//                 </button>
//                 <button
//                   className="btn btn-success"
//                   onClick={capture}
//                   disabled={!selectedShade || !faceArea}
//                 >
//                   Download Look
//                 </button>
//                 {uploaded && (
//                   <button className="btn btn-outline-danger ms-2" onClick={() => setUploaded(null)}>
//                     Live Camera
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* PRODUCTS & CONTROLS */}
//           <div className="col-lg-5">
//             <div className="controls-card shadow-lg p-4 h-100">

//               <div className="mb-4">
//                 {!faceArea ? (
//                   <div className="mt-4">
//                     <h6 className="block-title mb-3">
//                       Try on Area
//                     </h6>
//                     <div className="d-flex gap-2">
//                       <button
//                         className="btn btn-outline-danger btn-lg flex-fill"
//                         onClick={() => {
//                           setFaceArea("lips"); // this will trigger filtering via useEffect
//                         }}
//                         disabled={!selectedShade && filteredProducts.length === 0}
//                       >
//                         Lips
//                       </button>
//                       <button
//                         className="btn btn-outline-primary btn-lg flex-fill"
//                         onClick={() => {
//                           setFaceArea("eyes"); // this will trigger filtering
//                         }}
//                         disabled={!selectedShade && filteredProducts.length === 0}
//                       >
//                         Eyes
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="mt-4 text-center">
//                     <div className="alert alert-success">
//                       Ready to try {selectedShade?.shadeName || "a shade"} on {faceArea}!
//                     </div>
//                     <button
//                       className="btn btn-outline-secondary w-100"
//                       onClick={() => {
//                         setFaceArea(null); // resets to show all products
//                         setSelectedShade(null);
//                       }}
//                     >
//                       Change Area / Product
//                     </button>
//                   </div>
//                 )}

//               </div>




//               {/* PRODUCTS */}
//               <div className="mb-4">
//                 <h5 className="block-title mb-3">
//                   Makeup Products ({filteredProducts.length})
//                 </h5>
//                 {filteredProducts.length ? (
//                   <ProductsSlider />
//                 ) : (
//                   <div className="text-center py-4">
//                     <p className="text-muted">No products available for selected area</p>
//                   </div>
//                 )}
//               </div>

//               {/* SHADES */}
//               {selectedProd && <ShadesPalette />}

//               {/* FACE AREA SELECTION (also filters products) */}

//             </div>
//           </div>
//         </div>
//       </div>

//       <a ref={downloadAnchor} style={{ display: "none" }} />
//     </div>
//   );
// }







// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import Webcam from 'react-webcam';
// import axios from 'axios';
// import {
//   FaCamera, FaImage, FaDownload, FaChevronLeft, FaChevronRight,
//   FaTimes, FaSpinner, FaHistory, FaCheckCircle
// } from 'react-icons/fa';
// import { FaceMesh } from '@mediapipe/face_mesh';
// import { Camera } from '@mediapipe/camera_utils';
// import '../css/Mainvirtualtryon.css';

// import Header from './Header';
// import vtoHero from "../assets/vto_hero.png";
// import vtoFirst from '../assets/VTO_FIRST.png';

// // ── Landmark indices ──────────────────────────────
// const LIP_OUTER = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17, 84, 181, 91, 146];
// const LIP_INNER = [78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95];
// const LEYE_UPPER = [33, 246, 161, 160, 159, 158, 157, 173, 133];
// const REYE_UPPER = [263, 466, 388, 387, 386, 385, 384, 398, 362];
// const LEYE_LOWER = [133, 155, 154, 153, 145, 144, 163, 7, 33];
// const REYE_LOWER = [362, 382, 381, 380, 374, 373, 390, 249, 263];

// const LBROW_TOP = [70, 63, 105, 66, 107];
// const LBROW_BOT = [46, 53, 52, 65, 55];
// const RBROW_TOP = [336, 296, 334, 293, 300];
// const RBROW_BOT = [276, 283, 282, 295, 285];
// const LBROW = [...LBROW_TOP, ...[...LBROW_BOT].reverse()];
// const RBROW = [...RBROW_TOP, ...[...RBROW_BOT].reverse()];

// const FACE = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];

// const LCHECK = [117, 118, 119, 120, 121, 123, 147, 213, 192, 234];
// const RCHECK = [346, 347, 348, 349, 350, 352, 376, 433, 416, 454];

// function pt(lms, i, w, h) { return { x: lms[i].x * w, y: lms[i].y * h }; }
// function hexRgb(h) {
//   if (!h || h === 'none') return [0, 0, 0];
//   const c = h.replace('#', '');
//   return [parseInt(c.slice(0, 2), 16) || 0, parseInt(c.slice(2, 4), 16) || 0, parseInt(c.slice(4, 6), 16) || 0];
// }

// function catmullSmooth(pts, steps = 14) {
//   const out = [];
//   for (let i = 0; i < pts.length - 1; i++) {
//     const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
//     for (let s = 0; s < steps; s++) {
//       const t = s / steps, t2 = t * t, t3 = t2 * t;
//       out.push({
//         x: .5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
//         y: .5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3)
//       });
//     }
//   }
//   out.push(pts[pts.length - 1]); return out;
// }

// function drawBrow(ctx, lms, browI, color, alpha, style, thickMul, w, h) {
//   if (!color || color === 'none') return;
//   const [r, g, b] = hexRgb(color);
//   const off = document.createElement('canvas'); off.width = w; off.height = h;
//   const ox = off.getContext('2d');
//   const half = Math.floor(browI.length / 2);
//   let tPts = browI.slice(0, half).map(i => pt(lms, i, w, h)).sort((a, b) => a.x - b.x);
//   let bPts = browI.slice(half).map(i => pt(lms, i, w, h)).sort((a, b) => a.x - b.x);
//   let pts = [...tPts, ...bPts.reverse()];
//   const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
//   const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
//   const scaleY = 0.90 + (thickMul * 0.45);
//   const scaleX = 1.00 + (thickMul * 0.08);
//   pts = pts.map(p => ({ x: cx + (p.x - cx) * scaleX, y: cy + (p.y - cy) * scaleY }));
//   ox.beginPath();
//   const last = pts[pts.length - 1];
//   ox.moveTo((pts[0].x + last.x) / 2, (pts[0].y + last.y) / 2);
//   for (let i = 0; i < pts.length; i++) {
//     const p1 = pts[i], p2 = pts[(i + 1) % pts.length];
//     ox.quadraticCurveTo(p1.x, p1.y, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
//   }
//   ox.closePath();
//   let opMul = 1.0, blurAmt = 1.6;
//   if (style === 'feathered') { opMul = 0.60; blurAmt = 1.4; }
//   else if (style === 'bold') { opMul = 0.95; blurAmt = 0.8; }
//   else if (style === 'defined') { opMul = 0.85; blurAmt = 0.7; }
//   else { opMul = 0.75; blurAmt = 1.8; }
//   ox.fillStyle = `rgb(${r},${g},${b})`; ox.fill();
//   ctx.save();
//   ctx.globalCompositeOperation = 'multiply'; ctx.filter = `blur(${blurAmt}px)`; ctx.globalAlpha = Math.min(alpha * opMul * 1.5, 0.95); ctx.drawImage(off, 0, 0);
//   ctx.globalCompositeOperation = 'source-over'; ctx.filter = `blur(${blurAmt * 0.35}px)`; ctx.globalAlpha = alpha * opMul * 0.4; ctx.drawImage(off, 0, 0);
//   ctx.restore();
// }

// function drawBlush(ctx, lms, checkI, color, alpha, w, h) {
//   if (!color || alpha <= 0) return;
//   const pts = checkI.map(i => pt(lms, i, w, h));
//   const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
//   const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
//   const faceL = pt(lms, 234, w, h), faceR = pt(lms, 454, w, h);
//   const faceW = Math.max(Math.abs(faceR.x - faceL.x), 60);
//   const isLeft = checkI.includes(234);
//   const templePt = isLeft ? faceL : faceR;
//   const sweepAngle = Math.atan2(templePt.y - cy, templePt.x - cx);
//   const rx = faceW * 0.28, ry = faceW * 0.12;
//   const [r, g, b] = hexRgb(color);
//   const off = document.createElement('canvas'); off.width = w; off.height = h;
//   const ox = off.getContext('2d');
//   ox.save(); ox.translate(cx, cy); ox.rotate(sweepAngle);
//   ox.filter = `blur(${rx * 0.20}px)`; ox.scale(1, ry / rx);
//   const gr = ox.createRadialGradient(-rx * 0.15, 0, 0, 0, 0, rx);
//   gr.addColorStop(0.00, `rgba(${r},${g},${b},${alpha * 1.8})`);
//   gr.addColorStop(0.40, `rgba(${r},${g},${b},${alpha * 0.7})`);
//   gr.addColorStop(1.00, `rgba(${r},${g},${b},0)`);
//   ox.fillStyle = gr; ox.beginPath(); ox.arc(0, 0, rx * 1.1, 0, Math.PI * 2); ox.fill(); ox.restore();
//   ox.globalCompositeOperation = 'destination-out'; ox.filter = 'blur(4px)';
//   const eyeHole = (isLeft ? LEYE_LOWER : REYE_LOWER).map(i => pt(lms, i, w, h));
//   ox.beginPath(); ox.ellipse(eyeHole[4].x, eyeHole[4].y - faceW * 0.015, faceW * 0.14, faceW * 0.06, 0, 0, Math.PI * 2); ox.fill();
//   const luma = (0.299 * r + 0.587 * g + 0.114 * b);
//   const isSuperDark = luma < 60;
//   ctx.save();
//   ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = isSuperDark ? 0.85 : 0.35; ctx.drawImage(off, 0, 0);
//   ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = isSuperDark ? 0.3 : 0.65; ctx.drawImage(off, 0, 0);
//   ctx.restore();
// }

// function drawEyeliner(ctx, lms, eyeUpperI, eyeLowerI, color, alpha, style, placement, w, h) {
//   if (!color || color === 'none' || style === 'none') return;
//   const [r, g, b] = hexRgb(color);
//   const isLeft = eyeUpperI.includes(33);
//   const innerCorner = isLeft ? 133 : 362;
//   let rawUp = eyeUpperI.map(i => pt(lms, i, w, h)), rawLo = eyeLowerI.map(i => pt(lms, i, w, h));
//   if (eyeUpperI[0] !== innerCorner) rawUp.reverse();
//   if (eyeLowerI[0] !== innerCorner) rawLo.reverse();
//   const smUp = catmullSmooth(rawUp, 18), smLo = catmullSmooth(rawLo, 18);
//   const allPts = [...smUp, ...smLo];
//   const cx = allPts.reduce((s, p) => s + p.x, 0) / allPts.length, cy = allPts.reduce((s, p) => s + p.y, 0) / allPts.length;
//   const eyeW = Math.sqrt(Math.pow(smUp[smUp.length - 1].x - smUp[0].x, 2) + Math.pow(smUp[smUp.length - 1].y - smUp[0].y, 2)) || 10;
//   const SP = {
//     thin: { th: 0.06, wingLen: 0, wingLift: 0, lo: false, smoky: false, tight: false },
//     cat: { th: 0.09, wingLen: 0.17, wingLift: 0.14, lo: false, smoky: false, tight: false },
//     medium: { th: 0.12, wingLen: 0.12, wingLift: 0.08, lo: false, smoky: false, tight: false },
//     dramatic: { th: 0.20, wingLen: 0.32, wingLift: 0.25, lo: true, smoky: false, tight: false },
//     smoky: { th: 0.20, wingLen: 0, wingLift: 0, lo: true, smoky: true, tight: false },
//     tightline: { th: 0.03, wingLen: 0, wingLift: 0, lo: false, smoky: false, tight: true }
//   };
//   const sp = SP[style] || SP.thin;
//   const linerThickMul = 1.0;
//   const baseThick = Math.max(eyeW * sp.th * linerThickMul, 1.2);

//   const drawLinerCurve = (curve, isUpper) => {
//     const sn = curve.length;
//     const pts = curve.map((p, i) => {
//       const prev = curve[Math.max(0, i - 1)], next = curve[Math.min(sn - 1, i + 1)];
//       const tx = next.x - prev.x, ty = next.y - prev.y;
//       const len = Math.sqrt(tx * tx + ty * ty) || 1;
//       const nx1 = -ty / len, ny1 = tx / len, nx2 = ty / len, ny2 = -tx / len;
//       const d1 = (p.x + nx1 - cx) ** 2 + (p.y + ny1 - cy) ** 2, d2 = (p.x + nx2 - cx) ** 2 + (p.y + ny2 - cy) ** 2;
//       const nx = d1 > d2 ? nx1 : nx2, ny = d1 > d2 ? ny1 : ny2;
//       const t = i / (sn - 1);
//       let tFct = isUpper ? (sp.smoky ? 0.1 + 0.9 * Math.pow(t, 0.8) : style === 'dramatic' ? 0.05 + 0.95 * Math.pow(t, 2.2) : style === 'cat' ? 0.05 + 0.95 * Math.pow(t, 1.5) : t < 0.25 ? Math.pow(t / 0.25, 1.5) : 1) : (sp.smoky ? 0.05 + 0.85 * t : style === 'dramatic' ? 0.02 + 0.55 * Math.pow(t, 1.5) : 0.02 + 0.4 * t);
//       if (!isUpper && t > 0.85) tFct *= (1 - ((t - 0.85) / 0.15) * 0.9);
//       const pxThick = baseThick * tFct * (isUpper ? 1 : 0.5);
//       return { x: p.x + nx * pxThick, y: p.y + ny * pxThick, nx, ny };
//     });
//     const off = document.createElement('canvas'); off.width = w; off.height = h; const ox = off.getContext('2d');
//     ox.fillStyle = `rgb(${r},${g},${b})`; ox.beginPath();
//     curve.forEach((p, i) => i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y));
//     if (isUpper && sp.wingLen > 0) {
//       const lookIdx = Math.max(0, sn - 4);
//       const wx = curve[sn - 1].x - curve[lookIdx].x, wy = curve[sn - 1].y - curve[lookIdx].y;
//       const wLen = Math.sqrt(wx * wx + wy * wy) || 1, uX = wx / wLen, uY = wy / wLen;
//       const outerTip = pts[sn - 1];
//       const targetX = curve[sn - 1].x + uX * eyeW * sp.wingLen + outerTip.nx * eyeW * sp.wingLift;
//       const targetY = curve[sn - 1].y + uY * eyeW * sp.wingLen + outerTip.ny * eyeW * sp.wingLift;
//       const cpX = curve[sn - 1].x + uX * eyeW * sp.wingLen * 0.4, cpY = curve[sn - 1].y + uY * eyeW * sp.wingLen * 0.4;
//       ox.quadraticCurveTo(cpX, cpY, targetX, targetY); ox.lineTo(outerTip.x, outerTip.y);
//     }
//     [...pts].reverse().forEach(p => ox.lineTo(p.x, p.y)); ox.closePath(); ox.fill();
//     ctx.save();
//     if (sp.smoky) {
//       ctx.globalCompositeOperation = 'multiply'; ctx.filter = `blur(${baseThick * 1.5}px)`; ctx.globalAlpha = Math.min(alpha * 1.2, 0.9); ctx.drawImage(off, 0, 0);
//       ctx.filter = `blur(${baseThick * 0.7}px)`; ctx.globalAlpha = Math.min(alpha * 0.8, 0.9); ctx.drawImage(off, 0, 0);
//       ctx.globalCompositeOperation = 'source-over'; ctx.filter = `blur(${baseThick * 0.2}px)`; ctx.globalAlpha = alpha * 0.4; ctx.drawImage(off, 0, 0);
//     } else {
//       ctx.globalCompositeOperation = 'multiply'; ctx.filter = 'blur(1.2px)'; ctx.globalAlpha = Math.min(alpha * 1.2, 0.95); ctx.drawImage(off, 0, 0);
//       ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'blur(0.4px)'; ctx.globalAlpha = alpha * 0.85; ctx.drawImage(off, 0, 0);
//     }
//     ctx.restore();
//   };

//   if (sp.tight) {
//     ctx.save(); ctx.strokeStyle = `rgba(${r},${g},${b},${alpha * 0.85})`; ctx.lineWidth = Math.max(eyeW * 0.025, 1.2);
//     ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.filter = 'blur(0.6px)'; ctx.beginPath();
//     smUp.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.stroke(); ctx.restore();
//     if (placement === 'both' || placement === 'lower') drawLinerCurve(smLo, false);
//     return;
//   }
//   if (placement === 'upper') { drawLinerCurve(smUp, true); if (sp.lo) drawLinerCurve(smLo, false); }
//   else if (placement === 'lower') drawLinerCurve(smLo, false);
//   else { drawLinerCurve(smUp, true); drawLinerCurve(smLo, false); }
// }

// function drawLips(ctx, lms, color, alpha, w, h) {
//   if (!color || color === 'none') return;
//   const [r, g, b] = hexRgb(color);
//   const off = document.createElement('canvas'); off.width = w; off.height = h; const ox = off.getContext('2d');
//   ox.beginPath();
//   LIP_OUTER.forEach((id, i) => { const p = pt(lms, id, w, h); i === 0 ? ox.moveTo(p.x, p.y) : ox.lineTo(p.x, p.y); });
//   ox.closePath();
//   [...LIP_INNER].reverse().forEach((id, i) => { const p = pt(lms, id, w, h); i === 0 ? ox.moveTo(p.x, p.y) : ox.lineTo(p.x, p.y); });
//   ox.closePath();
//   ox.fillStyle = `rgb(${r},${g},${b})`; ox.fill();
//   ctx.save();
//   ctx.globalCompositeOperation = 'multiply'; ctx.filter = 'blur(1.8px)'; ctx.globalAlpha = Math.min(alpha * 0.9, 0.85); ctx.drawImage(off, 0, 0);
//   ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'none'; ctx.globalAlpha = alpha * 0.35; ctx.drawImage(off, 0, 0);
//   ctx.restore();
// }

// function drawFoundation(ctx, lms, color, alpha, w, h) {
//   if (!color || color === 'none' || alpha <= 0) return;
//   const [r, g, b] = hexRgb(color);
//   const off = document.createElement('canvas'); off.width = w; off.height = h; const ox = off.getContext('2d');
//   ox.filter = 'blur(10px)'; ox.fillStyle = `rgb(${r},${g},${b})`; ox.beginPath();
//   FACE.forEach((id, i) => { const p = pt(lms, id, w, h); i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y); });
//   ox.closePath(); ox.fill();
//   ox.globalCompositeOperation = 'destination-out'; ox.fillStyle = '#fff'; ox.filter = 'blur(3.5px)'; ox.beginPath();
//   [...LEYE_UPPER, ...[...LEYE_LOWER].reverse()].forEach((id, i) => { const p = pt(lms, id, w, h); i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y); }); ox.closePath(); ox.fill();
//   ox.beginPath(); [...REYE_UPPER, ...[...REYE_LOWER].reverse()].forEach((id, i) => { const p = pt(lms, id, w, h); i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y); }); ox.closePath(); ox.fill();
//   ox.filter = 'blur(2px)'; ox.beginPath(); LIP_OUTER.forEach((id, i) => { const p = pt(lms, id, w, h); i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y); }); ox.closePath(); ox.fill();
//   ox.filter = 'blur(5px)'; ox.globalAlpha = 0.9; ox.beginPath(); LBROW.forEach((id, i) => { const p = pt(lms, id, w, h); i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y); }); ox.closePath(); ox.fill();
//   ox.beginPath(); RBROW.forEach((id, i) => { const p = pt(lms, id, w, h); i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y); }); ox.closePath(); ox.fill();
//   ctx.save();
//   ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = Math.min(alpha * 0.95, 0.85); ctx.drawImage(off, 0, 0);
//   ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = alpha * 0.55; ctx.drawImage(off, 0, 0);
//   ctx.restore();
// }

// function applyMakeup(ctx, lms, w, h, S) {
//   if (S.fOn) drawFoundation(ctx, lms, S.foundC, S.fOp, w, h);
//   if (S.blushC) { drawBlush(ctx, lms, LCHECK, S.blushC, S.blushOp, w, h); drawBlush(ctx, lms, RCHECK, S.blushC, S.blushOp, w, h); }
//   drawBrow(ctx, lms, LBROW, S.browC, S.browOp, S.browStyle, S.browThick, w, h);
//   drawBrow(ctx, lms, RBROW, S.browC, S.browOp, S.browStyle, S.browThick, w, h);
//   drawEyeliner(ctx, lms, LEYE_UPPER, LEYE_LOWER, S.linerC, S.linerOp, S.linerStyle, S.linerPlacement, w, h);
//   drawEyeliner(ctx, lms, REYE_UPPER, REYE_LOWER, S.linerC, S.linerOp, S.linerStyle, S.linerPlacement, w, h);
//   drawLips(ctx, lms, S.lipC, S.lOp, w, h);
// }

// function applyAdaptiveSmoothing(newLms, prevLms, w, h) {
//   if (!prevLms) return newLms.map(p => ({ ...p }));
//   let totalDist = 0;
//   const anchors = [4, 152, 33, 263, 61, 291];
//   anchors.forEach(idx => {
//     const dx = (newLms[idx].x - prevLms[idx].x) * w;
//     const dy = (newLms[idx].y - prevLms[idx].y) * h;
//     totalDist += Math.sqrt(dx * dx + dy * dy);
//   });
//   const avgDist = totalDist / anchors.length;
//   let dynFactor = 0.75;
//   if (avgDist > 8) dynFactor = 0.0;
//   else if (avgDist > 1) dynFactor = 0.75 * (1 - ((avgDist - 1) / 7));
//   return newLms.map((p, i) => ({
//     x: prevLms[i].x * dynFactor + p.x * (1 - dynFactor),
//     y: prevLms[i].y * dynFactor + p.y * (1 - dynFactor),
//     z: prevLms[i].z !== undefined ? (prevLms[i].z * dynFactor + p.z * (1 - dynFactor)) : p.z
//   }));
// }
// // ─────────────────────────────────────────────────────────────────────────────

// const MainVirtualTryon = () => {
//   const [vtoStep, setVtoStep] = useState('landing');
//   const [mode, setMode] = useState(null);
//   const [activeType, setActiveType] = useState(null);
//   const [activeProduct, setActiveProduct] = useState(null);
//   const [activeShade, setActiveShade] = useState(null);
//   const [intensity, setIntensity] = useState(80);
//   const [compareMode, setCompareMode] = useState(false);
//   const [baPos, setBaPos] = useState(0.5);
//   const [isDragging, setIsDragging] = useState(false);
//   const [statusMsg, setStatusMsg] = useState('Initializing...');

//   const [vtoTypes, setVtoTypes] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [shades, setShades] = useState([]);
//   const [loadingTypes, setLoadingTypes] = useState(false);
//   const [loadingProducts, setLoadingProducts] = useState(false);
//   const [loadingShades, setLoadingShades] = useState(false);

//   const webcamRef = useRef(null);
//   const canvasRef = useRef(null);
//   const imageRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const [sidePanel, setSidePanel] = useState('types');
//   const [uploadedImage, setUploadedImage] = useState(null);

//   const S = useRef({
//     lipC: 'none', lOp: 0.8,
//     linerC: 'none', linerStyle: 'thin', linerPlacement: 'upper', linerOp: 0.85, linerThick: 1.0,
//     browC: 'none', browStyle: 'natural', browOp: 0.55, browThick: 0.55,
//     foundC: '#fce9d8', fOn: false, fOp: 0.18,
//     blushC: null, blushOp: 0.8
//   });
//   const smoothedLms = useRef(null);
//   const faceMeshRef = useRef(null);
//   const cameraRef = useRef(null);

//   // Load types
//   useEffect(() => {
//     const fetchTypes = async () => {
//       setLoadingTypes(true);
//       try {
//         const res = await axios.get('https://beauty.joyory.com/api/vto/workflow');
//         setVtoTypes(res.data.types || []);
//       } catch (err) {
//         console.error("Error fetching types", err);
//       } finally {
//         setLoadingTypes(false);
//         setStatusMsg('Ready ✓');
//       }
//     };
//     fetchTypes();
//   }, []);


//   // Track previous step to avoid scrolling on initial mount
//   const prevStepRef = useRef(vtoStep);
//   useEffect(() => {
//     prevStepRef.current = vtoStep;
//   }, [vtoStep]);

//   // Scroll to the landing card every time we come BACK to landing
//   useEffect(() => {
//     if (vtoStep === 'landing' && prevStepRef.current !== 'landing') {
//       setTimeout(() => {
//         const el = document.getElementById('main-backe-2');
//         if (el) {
//           el.scrollIntoView({ behavior: 'smooth', block: 'center' });
//         }
//       }, 50);
//     }
//   }, [vtoStep]);


//   useEffect(() => {
//     const handlePopState = () => {
//       setVtoStep('landing');
//     };
//     window.addEventListener("popstate", handlePopState);
//     return () => window.removeEventListener("popstate", handlePopState);
//   }, []);



//   // Initialize MediaPipe FaceMesh
//   useEffect(() => {
//     if (vtoStep === 'engine') {
//       try {
//         const faceMesh = new FaceMesh({
//           locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`,
//         });
//         faceMesh.setOptions({
//           maxNumFaces: 1,
//           refineLandmarks: true,
//           minDetectionConfidence: 0.5,
//           minTrackingConfidence: 0.5
//         });

//         faceMesh.onResults((results) => {
//           const canvas = canvasRef.current;
//           if (!canvas) return;
//           const ctx = canvas.getContext('2d');
//           const videoWidth = results.image.width;
//           const videoHeight = results.image.height;
//           canvas.width = videoWidth;
//           canvas.height = videoHeight;
//           ctx.clearRect(0, 0, canvas.width, canvas.height);

//           ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

//           if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
//             let lms = results.multiFaceLandmarks[0];
//             if (mode === 'live') {
//               lms = applyAdaptiveSmoothing(lms, smoothedLms.current, canvas.width, canvas.height);
//               smoothedLms.current = lms;
//             }
//             applyMakeup(ctx, lms, canvas.width, canvas.height, S.current);
//           } else {
//             if (mode === 'live') smoothedLms.current = null;
//           }
//         });

//         faceMeshRef.current = faceMesh;

//         if (mode === 'live') {
//           if (webcamRef.current && webcamRef.current.video) {
//             const camera = new Camera(webcamRef.current.video, {
//               onFrame: async () => {
//                 if (webcamRef.current?.video && faceMeshRef.current) {
//                   await faceMeshRef.current.send({ image: webcamRef.current.video });
//                 }
//               },
//               width: 640,
//               height: 480
//             });
//             camera.start();
//             cameraRef.current = camera;
//             setStatusMsg('Live Mode Active');
//           } else {
//             setTimeout(() => {
//               if (webcamRef.current && webcamRef.current.video) {
//                 const camera = new Camera(webcamRef.current.video, {
//                   onFrame: async () => {
//                     if (webcamRef.current?.video && faceMeshRef.current) {
//                       await faceMeshRef.current.send({ image: webcamRef.current.video });
//                     }
//                   },
//                   width: 640,
//                   height: 480
//                 });
//                 camera.start();
//                 cameraRef.current = camera;
//                 setStatusMsg('Live Mode Active');
//               }
//             }, 1000);
//           }
//         }
//       } catch (err) {
//         console.error("FaceMesh initialization error", err);
//       }
//     } else {
//       if (cameraRef.current) { cameraRef.current.stop(); cameraRef.current = null; }
//       if (faceMeshRef.current) { faceMeshRef.current.close(); faceMeshRef.current = null; }
//     }
//     return () => {
//       if (cameraRef.current) cameraRef.current.stop();
//       if (faceMeshRef.current) faceMeshRef.current.close();
//     }
//   }, [vtoStep, mode]);



//   // Handle Photo Mode static analysis
//   useEffect(() => {
//     if (vtoStep === 'engine' && mode === 'photo' && uploadedImage && faceMeshRef.current) {
//       setStatusMsg('Processing Photo...');
//       const img = new Image();
//       img.onload = async () => {
//         try {
//           await faceMeshRef.current.send({ image: img });
//           setStatusMsg('Photo Ready!');
//         } catch (e) {
//           console.error(e);
//         }
//       };
//       img.src = uploadedImage;
//     }
//   }, [vtoStep, mode, uploadedImage]);


//   const handleTypeSelect = async (type) => {
//     setActiveType(type);
//     setSidePanel('products');
//     setLoadingProducts(true);
//     try {
//       const res = await axios.get(`https://beauty.joyory.com/api/vto/workflow?type=${type}`);
//       setProducts(res.data.products || []);
//     } catch (err) {
//       console.error("Error fetching products", err);
//     } finally {
//       setLoadingProducts(false);
//     }
//   };

//   const handleProductSelect = async (product) => {
//     setActiveProduct(product);
//     setSidePanel('shades');
//     setLoadingShades(true);
//     try {
//       const res = await axios.get(`https://beauty.joyory.com/api/vto/workflow?productId=${product._id}`);
//       setShades(res.data.product?.shades || []);
//     } catch (err) {
//       console.error("Error fetching shades", err);
//     } finally {
//       setLoadingShades(false);
//     }
//   };

//   const applyShade = (shade) => {
//     setActiveShade(shade.sku || shade._id || shade.name);
//     let hex = shade.hex || shade.color;
//     if (!hex) return;
//     if (!hex.startsWith('#')) hex = '#' + hex;

//     const type = (activeType || '').toLowerCase();
//     if (type.includes('lip')) { S.current.lipC = hex; }
//     else if (type.includes('eye') && !type.includes('brow')) { S.current.linerC = hex; }
//     else if (type.includes('found')) { S.current.foundC = hex; S.current.fOn = true; }
//     else if (type.includes('blush')) { S.current.blushC = hex; }
//     else if (type.includes('brow')) { S.current.browC = hex; }

//     if (mode === 'photo' && faceMeshRef.current && uploadedImage) {
//       const img = new Image();
//       img.onload = async () => { await faceMeshRef.current.send({ image: img }); };
//       img.src = uploadedImage;
//     }
//   };

//   const handleIntensityChange = (e) => {
//     const val = parseInt(e.target.value, 10);
//     setIntensity(val);
//     const alpha = val / 100;
//     const type = (activeType || '').toLowerCase();
//     if (type.includes('lip')) { S.current.lOp = alpha; }
//     else if (type.includes('eye') && !type.includes('brow')) { S.current.linerOp = alpha; }
//     else if (type.includes('found')) { S.current.fOp = alpha; }
//     else if (type.includes('blush')) { S.current.blushOp = alpha; }
//     else if (type.includes('brow')) { S.current.browOp = alpha; }

//     if (mode === 'photo' && faceMeshRef.current && uploadedImage) {
//       const img = new Image();
//       img.onload = async () => { await faceMeshRef.current.send({ image: img }); };
//       img.src = uploadedImage;
//     }
//   };

//   const handlePhotoUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const url = URL.createObjectURL(file);
//       setUploadedImage(url);
//       setMode('photo');
//       setVtoStep('engine');
//     }
//   };

//   const downloadImage = () => {
//     const canvas = canvasRef.current;
//     if (canvas) {
//       const link = document.createElement('a');
//       link.download = 'joyory-vto.png';
//       link.href = canvas.toDataURL();
//       link.click();
//     }
//   };

//   const labelFor = (type) => {
//     if (!type) return "";
//     return type.charAt(0).toUpperCase() + type.slice(1);
//   };

//   const handleBaDragStart = (e) => {
//     if (!compareMode) return;
//     setIsDragging(true);
//     handleBaDragCalc(e);
//   };

//   const handleBaDragEnd = () => {
//     if (!compareMode) return;
//     setIsDragging(false);
//   };

//   const handleBaDragMove = (e) => {
//     if (!compareMode || !isDragging) return;
//     handleBaDragCalc(e);
//   };

//   const handleBaDragCalc = (e) => {
//     const container = e.currentTarget;
//     const rect = container.getBoundingClientRect();
//     let clientX;
//     if (e.touches && e.touches.length > 0) {
//       clientX = e.touches[0].clientX;
//     } else if (e.clientX !== undefined) {
//       clientX = e.clientX;
//     } else {
//       return;
//     }
//     let newPos = (clientX - rect.left) / rect.width;
//     newPos = Math.max(0, Math.min(1, newPos));
//     setBaPos(newPos);
//   };


//   // const goBackToLandingWithScroll = () => {
//   //   setVtoStep('landing');

//   //   setTimeout(() => {
//   //     const el = document.getElementById('main-backe-2');
//   //     if (el) {
//   //       el.scrollIntoView({
//   //         behavior: 'smooth',
//   //         block: 'center'
//   //       });
//   //     }
//   //   }, 150);
//   // };



//   const goBackToLandingWithScroll = useCallback(() => {
//   // Stop camera first if in live mode to free resources
//   if (cameraRef.current) {
//     cameraRef.current.stop();
//     cameraRef.current = null;
//   }
//   if (faceMeshRef.current) {
//     faceMeshRef.current.close();
//     faceMeshRef.current = null;
//   }

//   // Reset state
//   setCompareMode(false);
//   setMode(null);
//   setActiveType(null);
//   setActiveProduct(null);
//   setActiveShade(null);
//   setSidePanel('types');

//   // Navigate to landing
//   setVtoStep('landing');

//   // Scroll after DOM update
//   setTimeout(() => {
//     const el = document.getElementById('main-backe-2');
//     if (el) {
//       el.scrollIntoView({
//         behavior: 'smooth',
//         block: 'center'
//       });
//     }
//   }, 300);
// }, []);


//   return (
//     <div className={`vto-main-wrapper d-flex ${vtoStep === 'landing' ? 'vto-landing-mode-wrapper' : ''}`}>
//       <div className={`vto-app-container ${vtoStep === 'landing' ? 'vto-landing-mode' : ''}`}>

//         {/* 1. LANDING SCREEN */}
//         {vtoStep === 'landing' && (
//           <>
//             <div className="vto-landing-header-container">
//               <Header />
//             </div>
//             <div className="vto-landing-screen-integrated">
//               <div className="vto-bg-layer">
//                 <div className="virtualtryon-container-bg">
//                   <header className="hero-section-vto-bg">
//                     <img src={vtoHero} alt="Virtual Try On Banner" className="hero-banner-img-bg" />
//                   </header>
//                   {/* <div className="how-it-works-section-bg ">
//                     <h2 className="section-title-vto-bg">TRY ON MAKEUP VIRTUALLY</h2>
//                     <div className="steps-container-bg">
//                       {[1, 2, 3].map(i => (
//                         <div key={i} className="step-card-bg">
//                           <div className="step-image-wrapper-bg"></div>
//                           <h3 className="step-number-bg">Step {i}</h3>
//                         </div>
//                       ))}
//                     </div>
//                   </div> */}
//                 </div>
//               </div>

//               <div className="vto-landing-card-container main-backe-2" id="main-backe-2">
//                 <div className="vto-landing-bg-box">
//                   <img src={vtoFirst} alt="VTO Background" className="vto-bg-img img-fluid" />
//                   <div className="vto-phone-overlay">
//                     <div className="vto-phone-frame">
//                       <img src={vtoFirst} alt="VTO Phone View" className="vto-phone-img-zoomed" />
//                       <div className="vto-phone-scan-corners"></div>
//                       <div className="vto-phone-bottom-strip">
//                         {[1, 2, 3].map(i => <div key={i} className="vto-mini-prod"></div>)}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="vto-landing-content-box">
//                   <h1 className="vto-title-landing">VIRTUAL TRY ON</h1>
//                   <p className="vto-subtitle-landing">For The Best Virtual Try-on Experience, Please Use Safari Or Chrome</p>
//                   <div className="vto-actions-landing">
//                     <button
//                       className="vto-btn-black"
//                       onClick={() => {
//                         window.history.pushState({ vto: true }, "");
//                         setMode('live');
//                         setVtoStep('engine');
//                       }}
//                     >SELFIE MODE</button>
//                     <button className="vto-btn-black" onClick={() => { setMode('photo'); setVtoStep('instructions'); }}>UPLOAD PHOTO</button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}

//         {/* 2. INSTRUCTIONS SCREEN */}
//         {vtoStep === 'instructions' && (
//           <div className="vto-instructions-screen">
//             <div className="vto-instr-card">
//               <div className="vto-instr-header">
//                 {/* ✅ CHANGED: Back arrow now uses goBackToLandingWithScroll */}
//                 <button className="vto-instr-icon-btn" onClick={goBackToLandingWithScroll}><FaChevronLeft /></button>
//                 <div className="vto-instr-brand">
//                   <div className="vto-instr-brand-text">JOYORY<span>BEAUTY</span></div>
//                 </div>
//                 {/* ✅ CHANGED: Close (×) button now uses goBackToLandingWithScroll */}
//                 <button className="vto-instr-icon-btn" onClick={goBackToLandingWithScroll}><FaTimes /></button>
//               </div>
//               <div className="vto-instr-content">
//                 <h2 className="vto-instr-title">PHOTO INSTRUCTIONS</h2>
//                 <div className="vto-instr-list">
//                   <div className="vto-instr-item"><div className="vto-instr-icon-box"></div><p>Use a Photo that is of the face straight on.</p></div>
//                   <div className="vto-instr-item"><div className="vto-instr-icon-box"></div><p>Make Sure Nothing Is Obstructing The Face.</p></div>
//                   <div className="vto-instr-item"><div className="vto-instr-icon-box"></div><p>Make Sure That The Lighting Is Not Too Dim Or Too Bright.</p></div>
//                 </div>
//               </div>
//               <div className="vto-instr-footer">
//                 <button className="vto-btn-black-rect" onClick={() => fileInputRef.current?.click()}>UPLOAD PHOTO</button>
//                 <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" style={{ display: 'none' }} />
//               </div>
//             </div>
//           </div>
//         )}

//         {/* 3. MAIN VTO ENGINE */}
//         {vtoStep === 'engine' && (
//           <div className="vto-workspace">
//             {!compareMode && (
//               <div className="vto-engine-sidebar">
//                 {sidePanel === 'types' && (
//                   <div className="vto-sidebar-items">
//                     {loadingTypes ? <div className="vto-spinner-wrap-small"><FaSpinner className="vto-spin" /></div> :
//                       vtoTypes.map((type, i) => (
//                         <div key={i} className={`vto-sidebar-item ${activeType === type ? 'active' : ''}`} onClick={() => handleTypeSelect(type)}>
//                           <div className="vto-sidebar-icon-box">
//                             <img src={type.includes('lip') ? "https://img.icons8.com/color/48/lipstick.png" : "https://img.icons8.com/color/48/makeup.png"} alt={type} className="vto-cat-thumb-img" />
//                           </div>
//                           <span className="vto-sidebar-label">{labelFor(type)}</span>
//                         </div>
//                       ))
//                     }
//                   </div>
//                 )}

//                 {sidePanel === 'products' && (
//                   <div className="vto-sidebar-items vto-sidebar-products">
//                     <div className="vto-sidebar-item" onClick={() => { setActiveType(null); setProducts([]); setSidePanel('types'); }}>
//                       <div className="vto-sidebar-icon-box" style={{ background: 'transparent', border: 'none', color: '#fff' }}><FaChevronLeft size={24} /></div>
//                     </div>
//                     {loadingProducts ? <div className="vto-spinner-wrap-small"><FaSpinner className="vto-spin" /></div> :
//                       products.map((p, i) => (
//                         <div key={p._id || i} className={`vto-sidebar-item ${activeProduct?._id === p._id ? 'active' : ''}`} onClick={() => handleProductSelect(p)}>
//                           <div className="vto-sidebar-icon-box">
//                             <img src={p.image || "https://via.placeholder.com/56"} alt={p.name} className="vto-cat-thumb-img" style={{ borderRadius: '8px' }} />
//                           </div>
//                           <span className="vto-sidebar-label">{p.name || p.brand}</span>
//                         </div>
//                       ))
//                     }
//                   </div>
//                 )}

//                 {sidePanel === 'shades' && (
//                   <div className="vto-sidebar-items vto-sidebar-shades">
//                     <div className="vto-sidebar-item" onClick={() => setSidePanel('products')}>
//                       <div className="vto-sidebar-icon-box" style={{ background: 'transparent', border: 'none', color: '#fff' }}><FaChevronLeft size={24} /></div>
//                     </div>
//                     {loadingShades ? <div className="vto-spinner-wrap-small"><FaSpinner className="vto-spin" /></div> :
//                       shades.map((shade, idx) => (
//                         <div key={shade.sku || idx} className={`vto-sidebar-item ${activeShade === shade.sku ? 'active' : ''}`} onClick={() => applyShade(shade)}>
//                           <div className="vto-sidebar-shade-square" style={{ backgroundColor: shade.hex.startsWith('#') ? shade.hex : '#' + shade.hex }} />
//                           <span className="vto-sidebar-label">{shade.shadeName}</span>
//                         </div>
//                       ))
//                     }
//                   </div>
//                 )}
//                 <div className="vto-sidebar-divider"></div>
//               </div>
//             )}

//             <div
//               className="vto-canvas-container"
//               onMouseDown={compareMode ? handleBaDragStart : undefined}
//               onMouseMove={compareMode ? handleBaDragMove : undefined}
//               onMouseUp={compareMode ? handleBaDragEnd : undefined}
//               onMouseLeave={compareMode ? handleBaDragEnd : undefined}
//               onTouchStart={compareMode ? handleBaDragStart : undefined}
//               onTouchMove={compareMode ? handleBaDragMove : undefined}
//               onTouchEnd={compareMode ? handleBaDragEnd : undefined}
//               style={{ position: 'relative', overflow: 'hidden', cursor: compareMode ? (isDragging ? 'ew-resize' : 'pointer') : 'default' }}
//             >

//               {/* Original Before Layer */}
//               <div className="vto-ba-before-layer" style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 1 }}>
//                 {mode === 'live' && <Webcam ref={webcamRef} audio={false} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} videoConstraints={{ facingMode: "user" }} />}
//                 {mode === 'photo' && uploadedImage && <img ref={imageRef} src={uploadedImage} alt="Uploaded" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
//               </div>

//               {/* Styled Canvas Layer */}
//               <canvas
//                 ref={canvasRef}
//                 className="vto-main-canvas"
//                 style={{
//                   position: 'absolute', inset: 0, width: '100%', height: '100%',
//                   objectFit: mode === 'photo' ? 'contain' : 'cover',
//                   transform: mode === 'live' ? 'scaleX(-1)' : 'none',
//                   clipPath: compareMode ? `inset(0 ${100 - (baPos * 100)}% 0 0)` : 'none',
//                   zIndex: 2,
//                   pointerEvents: compareMode ? 'none' : 'auto'
//                 }}
//               />

//               {compareMode && (
//                 <>
//                   <div className="vto-compare-labels">
//                     <button className="vto-compare-pill vto-pill-left" onClick={() => setCompareMode(false)}>BEFORE</button>
//                     <button className="vto-compare-pill vto-pill-right" onClick={() => setCompareMode(false)}>AFTER</button>
//                   </div>
//                   <div className="ba-divider" style={{ position: 'absolute', top: 0, bottom: 0, width: '2px', background: 'rgba(255,255,255,0.7)', left: `${baPos * 100}%`, zIndex: 10, transform: 'translateX(-50%)', pointerEvents: 'none' }}></div>
//                   <div className="ba-handle-bottom" style={{ position: 'absolute', bottom: '8%', left: `${baPos * 100}%`, transform: 'translateX(-50%)', zIndex: 11, display: 'flex', gap: '4px', pointerEvents: 'none' }}>
//                     <div style={{ width: '4px', height: '32px', background: 'rgba(255,255,255,0.9)', borderRadius: '2px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}></div>
//                     <div style={{ width: '4px', height: '32px', background: 'rgba(255,255,255,0.9)', borderRadius: '2px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}></div>
//                   </div>
//                 </>
//               )}

//               <div className="vto-status" style={{ zIndex: 20 }}>{statusMsg}</div>
//             </div>

//             {!compareMode && (
//               <div className="vto-intensity-slider-wrap">
//                 <div className="vto-slider-track-thin">
//                   <input type="range" className="vto-vertical-slider-thin" min="0" max="100" value={intensity} onChange={handleIntensityChange} />
//                 </div>
//                 <div className="vto-slider-icon">
//                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="white" />
//                   </svg>
//                 </div>
//               </div>
//             )}

//             {!compareMode && (
//               <div className="vto-top-controls-v2">
//                 <button className="vto-compare-btn" onClick={() => setCompareMode(true)}>COMPARE</button>
//                 {/* <button className="vto-close-btn-v2" onClick={goBackToLandingWithScroll}><FaTimes /></button> */}
//                 <button className="vto-instr-icon-btn vto-close-btn-v2" onClick={goBackToLandingWithScroll}><FaTimes /></button>
//               </div>
//             )}

//             <div className="vto-bottom-controls-v2">
//               <button className="vto-download-btn-v2" onClick={downloadImage}>
//                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M19 15V19H5V15H3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V15H19ZM13 12.67L15.59 10.09L17 11.5L12 16.5L7 11.5L8.41 10.09L11 12.67V3H13V12.67Z" fill="white" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MainVirtualTryon;












// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import Webcam from 'react-webcam';
// import axios from 'axios';
// import {
//   FaCamera, FaImage, FaDownload, FaChevronLeft, FaChevronRight,
//   FaTimes, FaSpinner, FaHistory, FaCheckCircle
// } from 'react-icons/fa';
// import { FaceMesh } from '@mediapipe/face_mesh';
// import { Camera } from '@mediapipe/camera_utils';
// import '../css/Mainvirtualtryon.css';

// import Header from './Header';
// import vtoHero from "../assets/vto_hero.png";
// import vtoFirst from '../assets/VTO_FIRST.png';

// // ── Landmark indices ──────────────────────────────
// const LIP_OUTER = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17, 84, 181, 91, 146];
// const LIP_INNER = [78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95];
// const LEYE_UPPER = [33, 246, 161, 160, 159, 158, 157, 173, 133];
// const REYE_UPPER = [263, 466, 388, 387, 386, 385, 384, 398, 362];
// const LEYE_LOWER = [133, 155, 154, 153, 145, 144, 163, 7, 33];
// const REYE_LOWER = [362, 382, 381, 380, 374, 373, 390, 249, 263];

// const LBROW_TOP = [70, 63, 105, 66, 107];
// const LBROW_BOT = [46, 53, 52, 65, 55];
// const RBROW_TOP = [336, 296, 334, 293, 300];
// const RBROW_BOT = [276, 283, 282, 295, 285];
// const LBROW = [...LBROW_TOP, ...[...LBROW_BOT].reverse()];
// const RBROW = [...RBROW_TOP, ...[...RBROW_BOT].reverse()];

// const FACE = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];

// const LCHECK = [117, 118, 119, 120, 121, 123, 147, 213, 192, 234];
// const RCHECK = [346, 347, 348, 349, 350, 352, 376, 433, 416, 454];

// function pt(lms, i, w, h) { return { x: lms[i].x * w, y: lms[i].y * h }; }
// function hexRgb(h) {
//   if (!h || h === 'none') return [0, 0, 0];
//   const c = h.replace('#', '');
//   return [parseInt(c.slice(0, 2), 16) || 0, parseInt(c.slice(2, 4), 16) || 0, parseInt(c.slice(4, 6), 16) || 0];
// }

// function catmullSmooth(pts, steps = 14) {
//   const out = [];
//   for (let i = 0; i < pts.length - 1; i++) {
//     const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
//     for (let s = 0; s < steps; s++) {
//       const t = s / steps, t2 = t * t, t3 = t2 * t;
//       out.push({
//         x: .5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
//         y: .5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3)
//       });
//     }
//   }
//   out.push(pts[pts.length - 1]); return out;
// }

// function drawBrow(ctx, lms, browI, color, alpha, style, thickMul, w, h) {
//   if (!color || color === 'none') return;
//   const [r, g, b] = hexRgb(color);
//   const off = document.createElement('canvas'); off.width = w; off.height = h;
//   const ox = off.getContext('2d');
//   const half = Math.floor(browI.length / 2);
//   let tPts = browI.slice(0, half).map(i => pt(lms, i, w, h)).sort((a, b) => a.x - b.x);
//   let bPts = browI.slice(half).map(i => pt(lms, i, w, h)).sort((a, b) => a.x - b.x);
//   let pts = [...tPts, ...bPts.reverse()];
//   const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
//   const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
//   const scaleY = 0.90 + (thickMul * 0.45);
//   const scaleX = 1.00 + (thickMul * 0.08);
//   pts = pts.map(p => ({ x: cx + (p.x - cx) * scaleX, y: cy + (p.y - cy) * scaleY }));
//   ox.beginPath();
//   const last = pts[pts.length - 1];
//   ox.moveTo((pts[0].x + last.x) / 2, (pts[0].y + last.y) / 2);
//   for (let i = 0; i < pts.length; i++) {
//     const p1 = pts[i], p2 = pts[(i + 1) % pts.length];
//     ox.quadraticCurveTo(p1.x, p1.y, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
//   }
//   ox.closePath();
//   let opMul = 1.0, blurAmt = 1.6;
//   if (style === 'feathered') { opMul = 0.60; blurAmt = 1.4; }
//   else if (style === 'bold') { opMul = 0.95; blurAmt = 0.8; }
//   else if (style === 'defined') { opMul = 0.85; blurAmt = 0.7; }
//   else { opMul = 0.75; blurAmt = 1.8; }
//   ox.fillStyle = `rgb(${r},${g},${b})`; ox.fill();
//   ctx.save();
//   ctx.globalCompositeOperation = 'multiply'; ctx.filter = `blur(${blurAmt}px)`; ctx.globalAlpha = Math.min(alpha * opMul * 1.5, 0.95); ctx.drawImage(off, 0, 0);
//   ctx.globalCompositeOperation = 'source-over'; ctx.filter = `blur(${blurAmt * 0.35}px)`; ctx.globalAlpha = alpha * opMul * 0.4; ctx.drawImage(off, 0, 0);
//   ctx.restore();
// }

// function drawBlush(ctx, lms, checkI, color, alpha, w, h) {
//   if (!color || alpha <= 0) return;
//   const pts = checkI.map(i => pt(lms, i, w, h));
//   const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
//   const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
//   const faceL = pt(lms, 234, w, h), faceR = pt(lms, 454, w, h);
//   const faceW = Math.max(Math.abs(faceR.x - faceL.x), 60);
//   const isLeft = checkI.includes(234);
//   const templePt = isLeft ? faceL : faceR;
//   const sweepAngle = Math.atan2(templePt.y - cy, templePt.x - cx);
//   const rx = faceW * 0.28, ry = faceW * 0.12;
//   const [r, g, b] = hexRgb(color);
//   const off = document.createElement('canvas'); off.width = w; off.height = h;
//   const ox = off.getContext('2d');
//   ox.save(); ox.translate(cx, cy); ox.rotate(sweepAngle);
//   ox.filter = `blur(${rx * 0.20}px)`; ox.scale(1, ry / rx);
//   const gr = ox.createRadialGradient(-rx * 0.15, 0, 0, 0, 0, rx);
//   gr.addColorStop(0.00, `rgba(${r},${g},${b},${alpha * 1.8})`);
//   gr.addColorStop(0.40, `rgba(${r},${g},${b},${alpha * 0.7})`);
//   gr.addColorStop(1.00, `rgba(${r},${g},${b},0)`);
//   ox.fillStyle = gr; ox.beginPath(); ox.arc(0, 0, rx * 1.1, 0, Math.PI * 2); ox.fill(); ox.restore();
//   ox.globalCompositeOperation = 'destination-out'; ox.filter = 'blur(4px)';
//   const eyeHole = (isLeft ? LEYE_LOWER : REYE_LOWER).map(i => pt(lms, i, w, h));
//   ox.beginPath(); ox.ellipse(eyeHole[4].x, eyeHole[4].y - faceW * 0.015, faceW * 0.14, faceW * 0.06, 0, 0, Math.PI * 2); ox.fill();
//   const luma = (0.299 * r + 0.587 * g + 0.114 * b);
//   const isSuperDark = luma < 60;
//   ctx.save();
//   ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = isSuperDark ? 0.85 : 0.35; ctx.drawImage(off, 0, 0);
//   ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = isSuperDark ? 0.3 : 0.65; ctx.drawImage(off, 0, 0);
//   ctx.restore();
// }

// function drawEyeliner(ctx, lms, eyeUpperI, eyeLowerI, color, alpha, style, placement, w, h) {
//   if (!color || color === 'none' || style === 'none') return;
//   const [r, g, b] = hexRgb(color);
//   const isLeft = eyeUpperI.includes(33);
//   const innerCorner = isLeft ? 133 : 362;
//   let rawUp = eyeUpperI.map(i => pt(lms, i, w, h)), rawLo = eyeLowerI.map(i => pt(lms, i, w, h));
//   if (eyeUpperI[0] !== innerCorner) rawUp.reverse();
//   if (eyeLowerI[0] !== innerCorner) rawLo.reverse();
//   const smUp = catmullSmooth(rawUp, 18), smLo = catmullSmooth(rawLo, 18);
//   const allPts = [...smUp, ...smLo];
//   const cx = allPts.reduce((s, p) => s + p.x, 0) / allPts.length, cy = allPts.reduce((s, p) => s + p.y, 0) / allPts.length;
//   const eyeW = Math.sqrt(Math.pow(smUp[smUp.length - 1].x - smUp[0].x, 2) + Math.pow(smUp[smUp.length - 1].y - smUp[0].y, 2)) || 10;
//   const SP = {
//     thin: { th: 0.06, wingLen: 0, wingLift: 0, lo: false, smoky: false, tight: false },
//     cat: { th: 0.09, wingLen: 0.17, wingLift: 0.14, lo: false, smoky: false, tight: false },
//     medium: { th: 0.12, wingLen: 0.12, wingLift: 0.08, lo: false, smoky: false, tight: false },
//     dramatic: { th: 0.20, wingLen: 0.32, wingLift: 0.25, lo: true, smoky: false, tight: false },
//     smoky: { th: 0.20, wingLen: 0, wingLift: 0, lo: true, smoky: true, tight: false },
//     tightline: { th: 0.03, wingLen: 0, wingLift: 0, lo: false, smoky: false, tight: true }
//   };
//   const sp = SP[style] || SP.thin;
//   const linerThickMul = 1.0;
//   const baseThick = Math.max(eyeW * sp.th * linerThickMul, 1.2);

//   const drawLinerCurve = (curve, isUpper) => {
//     const sn = curve.length;
//     const pts = curve.map((p, i) => {
//       const prev = curve[Math.max(0, i - 1)], next = curve[Math.min(sn - 1, i + 1)];
//       const tx = next.x - prev.x, ty = next.y - prev.y;
//       const len = Math.sqrt(tx * tx + ty * ty) || 1;
//       const nx1 = -ty / len, ny1 = tx / len, nx2 = ty / len, ny2 = -tx / len;
//       const d1 = (p.x + nx1 - cx) ** 2 + (p.y + ny1 - cy) ** 2, d2 = (p.x + nx2 - cx) ** 2 + (p.y + ny2 - cy) ** 2;
//       const nx = d1 > d2 ? nx1 : nx2, ny = d1 > d2 ? ny1 : ny2;
//       const t = i / (sn - 1);
//       let tFct = isUpper ? (sp.smoky ? 0.1 + 0.9 * Math.pow(t, 0.8) : style === 'dramatic' ? 0.05 + 0.95 * Math.pow(t, 2.2) : style === 'cat' ? 0.05 + 0.95 * Math.pow(t, 1.5) : t < 0.25 ? Math.pow(t / 0.25, 1.5) : 1) : (sp.smoky ? 0.05 + 0.85 * t : style === 'dramatic' ? 0.02 + 0.55 * Math.pow(t, 1.5) : 0.02 + 0.4 * t);
//       if (!isUpper && t > 0.85) tFct *= (1 - ((t - 0.85) / 0.15) * 0.9);
//       const pxThick = baseThick * tFct * (isUpper ? 1 : 0.5);
//       return { x: p.x + nx * pxThick, y: p.y + ny * pxThick, nx, ny };
//     });
//     const off = document.createElement('canvas'); off.width = w; off.height = h; const ox = off.getContext('2d');
//     ox.fillStyle = `rgb(${r},${g},${b})`; ox.beginPath();
//     curve.forEach((p, i) => i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y));
//     if (isUpper && sp.wingLen > 0) {
//       const lookIdx = Math.max(0, sn - 4);
//       const wx = curve[sn - 1].x - curve[lookIdx].x, wy = curve[sn - 1].y - curve[lookIdx].y;
//       const wLen = Math.sqrt(wx * wx + wy * wy) || 1, uX = wx / wLen, uY = wy / wLen;
//       const outerTip = pts[sn - 1];
//       const targetX = curve[sn - 1].x + uX * eyeW * sp.wingLen + outerTip.nx * eyeW * sp.wingLift;
//       const targetY = curve[sn - 1].y + uY * eyeW * sp.wingLen + outerTip.ny * eyeW * sp.wingLift;
//       const cpX = curve[sn - 1].x + uX * eyeW * sp.wingLen * 0.4, cpY = curve[sn - 1].y + uY * eyeW * sp.wingLen * 0.4;
//       ox.quadraticCurveTo(cpX, cpY, targetX, targetY); ox.lineTo(outerTip.x, outerTip.y);
//     }
//     [...pts].reverse().forEach(p => ox.lineTo(p.x, p.y)); ox.closePath(); ox.fill();
//     ctx.save();
//     if (sp.smoky) {
//       ctx.globalCompositeOperation = 'multiply'; ctx.filter = `blur(${baseThick * 1.5}px)`; ctx.globalAlpha = Math.min(alpha * 1.2, 0.9); ctx.drawImage(off, 0, 0);
//       ctx.filter = `blur(${baseThick * 0.7}px)`; ctx.globalAlpha = Math.min(alpha * 0.8, 0.9); ctx.drawImage(off, 0, 0);
//       ctx.globalCompositeOperation = 'source-over'; ctx.filter = `blur(${baseThick * 0.2}px)`; ctx.globalAlpha = alpha * 0.4; ctx.drawImage(off, 0, 0);
//     } else {
//       ctx.globalCompositeOperation = 'multiply'; ctx.filter = 'blur(1.2px)'; ctx.globalAlpha = Math.min(alpha * 1.2, 0.95); ctx.drawImage(off, 0, 0);
//       ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'blur(0.4px)'; ctx.globalAlpha = alpha * 0.85; ctx.drawImage(off, 0, 0);
//     }
//     ctx.restore();
//   };

//   if (sp.tight) {
//     ctx.save(); ctx.strokeStyle = `rgba(${r},${g},${b},${alpha * 0.85})`; ctx.lineWidth = Math.max(eyeW * 0.025, 1.2);
//     ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.filter = 'blur(0.6px)'; ctx.beginPath();
//     smUp.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.stroke(); ctx.restore();
//     if (placement === 'both' || placement === 'lower') drawLinerCurve(smLo, false);
//     return;
//   }
//   if (placement === 'upper') { drawLinerCurve(smUp, true); if (sp.lo) drawLinerCurve(smLo, false); }
//   else if (placement === 'lower') drawLinerCurve(smLo, false);
//   else { drawLinerCurve(smUp, true); drawLinerCurve(smLo, false); }
// }

// function drawLips(ctx, lms, color, alpha, w, h) {
//   if (!color || color === 'none') return;
//   const [r, g, b] = hexRgb(color);
//   const off = document.createElement('canvas'); off.width = w; off.height = h; const ox = off.getContext('2d');
//   ox.beginPath();
//   LIP_OUTER.forEach((id, i) => { const p = pt(lms, id, w, h); i === 0 ? ox.moveTo(p.x, p.y) : ox.lineTo(p.x, p.y); });
//   ox.closePath();
//   [...LIP_INNER].reverse().forEach((id, i) => { const p = pt(lms, id, w, h); i === 0 ? ox.moveTo(p.x, p.y) : ox.lineTo(p.x, p.y); });
//   ox.closePath();
//   ox.fillStyle = `rgb(${r},${g},${b})`; ox.fill();
//   ctx.save();
//   ctx.globalCompositeOperation = 'multiply'; ctx.filter = 'blur(1.8px)'; ctx.globalAlpha = Math.min(alpha * 0.9, 0.85); ctx.drawImage(off, 0, 0);
//   ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'none'; ctx.globalAlpha = alpha * 0.35; ctx.drawImage(off, 0, 0);
//   ctx.restore();
// }

// function drawFoundation(ctx, lms, color, alpha, w, h) {
//   if (!color || color === 'none' || alpha <= 0) return;
//   const [r, g, b] = hexRgb(color);
//   const off = document.createElement('canvas'); off.width = w; off.height = h; const ox = off.getContext('2d');
//   ox.filter = 'blur(10px)'; ox.fillStyle = `rgb(${r},${g},${b})`; ox.beginPath();
//   FACE.forEach((id, i) => { const p = pt(lms, id, w, h); i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y); });
//   ox.closePath(); ox.fill();
//   ox.globalCompositeOperation = 'destination-out'; ox.fillStyle = '#fff'; ox.filter = 'blur(3.5px)'; ox.beginPath();
//   [...LEYE_UPPER, ...[...LEYE_LOWER].reverse()].forEach((id, i) => { const p = pt(lms, id, w, h); i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y); }); ox.closePath(); ox.fill();
//   ox.beginPath(); [...REYE_UPPER, ...[...REYE_LOWER].reverse()].forEach((id, i) => { const p = pt(lms, id, w, h); i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y); }); ox.closePath(); ox.fill();
//   ox.filter = 'blur(2px)'; ox.beginPath(); LIP_OUTER.forEach((id, i) => { const p = pt(lms, id, w, h); i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y); }); ox.closePath(); ox.fill();
//   ox.filter = 'blur(5px)'; ox.globalAlpha = 0.9; ox.beginPath(); LBROW.forEach((id, i) => { const p = pt(lms, id, w, h); i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y); }); ox.closePath(); ox.fill();
//   ox.beginPath(); RBROW.forEach((id, i) => { const p = pt(lms, id, w, h); i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y); }); ox.closePath(); ox.fill();
//   ctx.save();
//   ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = Math.min(alpha * 0.95, 0.85); ctx.drawImage(off, 0, 0);
//   ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = alpha * 0.55; ctx.drawImage(off, 0, 0);
//   ctx.restore();
// }

// function applyMakeup(ctx, lms, w, h, S) {
//   if (S.fOn) drawFoundation(ctx, lms, S.foundC, S.fOp, w, h);
//   if (S.blushC) { drawBlush(ctx, lms, LCHECK, S.blushC, S.blushOp, w, h); drawBlush(ctx, lms, RCHECK, S.blushC, S.blushOp, w, h); }
//   drawBrow(ctx, lms, LBROW, S.browC, S.browOp, S.browStyle, S.browThick, w, h);
//   drawBrow(ctx, lms, RBROW, S.browC, S.browOp, S.browStyle, S.browThick, w, h);
//   drawEyeliner(ctx, lms, LEYE_UPPER, LEYE_LOWER, S.linerC, S.linerOp, S.linerStyle, S.linerPlacement, w, h);
//   drawEyeliner(ctx, lms, REYE_UPPER, REYE_LOWER, S.linerC, S.linerOp, S.linerStyle, S.linerPlacement, w, h);
//   drawLips(ctx, lms, S.lipC, S.lOp, w, h);
// }

// function applyAdaptiveSmoothing(newLms, prevLms, w, h) {
//   if (!prevLms) return newLms.map(p => ({ ...p }));
//   let totalDist = 0;
//   const anchors = [4, 152, 33, 263, 61, 291];
//   anchors.forEach(idx => {
//     const dx = (newLms[idx].x - prevLms[idx].x) * w;
//     const dy = (newLms[idx].y - prevLms[idx].y) * h;
//     totalDist += Math.sqrt(dx * dx + dy * dy);
//   });
//   const avgDist = totalDist / anchors.length;
//   let dynFactor = 0.75;
//   if (avgDist > 8) dynFactor = 0.0;
//   else if (avgDist > 1) dynFactor = 0.75 * (1 - ((avgDist - 1) / 7));
//   return newLms.map((p, i) => ({
//     x: prevLms[i].x * dynFactor + p.x * (1 - dynFactor),
//     y: prevLms[i].y * dynFactor + p.y * (1 - dynFactor),
//     z: prevLms[i].z !== undefined ? (prevLms[i].z * dynFactor + p.z * (1 - dynFactor)) : p.z
//   }));
// }
// // ─────────────────────────────────────────────────────────────────────────────

// const MainVirtualTryon = () => {
//   const [vtoStep, setVtoStep] = useState('landing');
//   const [mode, setMode] = useState(null);
//   const [activeType, setActiveType] = useState(null);
//   const [activeProduct, setActiveProduct] = useState(null);
//   const [activeShade, setActiveShade] = useState(null);
//   const [intensity, setIntensity] = useState(80);
//   const [compareMode, setCompareMode] = useState(false);
//   const [baPos, setBaPos] = useState(0.5);
//   const [isDragging, setIsDragging] = useState(false);
//   const [statusMsg, setStatusMsg] = useState('Initializing...');

//   const [vtoTypes, setVtoTypes] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [shades, setShades] = useState([]);
//   const [loadingTypes, setLoadingTypes] = useState(false);
//   const [loadingProducts, setLoadingProducts] = useState(false);
//   const [loadingShades, setLoadingShades] = useState(false);

//   // ── DYNAMIC LANDING IMAGES FROM BACKEND ─────────────────────────────
//   const [landingImages, setLandingImages] = useState({
//     heroBanner: null,      // vtoHero replacement
//     cardBackground: null,  // vtoFirst replacement
//     phoneView: null,       // phone frame image
//     stepImages: []         // step cards images [step1, step2, step3]
//   });
//   const [loadingLandingImages, setLoadingLandingImages] = useState(false);
//   // ────────────────────────────────────────────────────────────────────

//   const webcamRef = useRef(null);
//   const canvasRef = useRef(null);
//   const imageRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const [sidePanel, setSidePanel] = useState('types');
//   const [uploadedImage, setUploadedImage] = useState(null);

//   const S = useRef({
//     lipC: 'none', lOp: 0.8,
//     linerC: 'none', linerStyle: 'thin', linerPlacement: 'upper', linerOp: 0.85, linerThick: 1.0,
//     browC: 'none', browStyle: 'natural', browOp: 0.55, browThick: 0.55,
//     foundC: '#fce9d8', fOn: false, fOp: 0.18,
//     blushC: null, blushOp: 0.8
//   });
//   const smoothedLms = useRef(null);
//   const faceMeshRef = useRef(null);
//   const cameraRef = useRef(null);

//   // Load types
//   useEffect(() => {
//     const fetchTypes = async () => {
//       setLoadingTypes(true);
//       try {
//         const res = await axios.get('https://beauty.joyory.com/api/vto/workflow');
//         setVtoTypes(res.data.types || []);
//       } catch (err) {
//         console.error("Error fetching types", err);
//       } finally {
//         setLoadingTypes(false);
//         setStatusMsg('Ready ✓');
//       }
//     };
//     fetchTypes();
//   }, []);

//   // ── FETCH DYNAMIC LANDING IMAGES FROM BACKEND ───────────────────────
//   useEffect(() => {
//     const fetchLandingImages = async () => {
//       setLoadingLandingImages(true);
//       try {
//         // Option 1: If your backend has a dedicated landing images endpoint
//         // const res = await axios.get('https://beauty.joyory.com/api/vto/landing-images');

//         // Option 2: If images come from the same workflow endpoint with a flag
//         const res = await axios.get('https://beauty.joyory.com/api/vto/workflow?section=landing');

//         // Option 3: If images are in a general settings/config endpoint
//         // const res = await axios.get('https://beauty.joyory.com/api/settings/vto-landing');

//         const data = res.data;

//         setLandingImages({
//           heroBanner: data.heroBanner || data.landing?.heroBanner || null,
//           cardBackground: data.cardBackground || data.landing?.cardBackground || null,
//           phoneView: data.phoneView || data.landing?.phoneView || null,
//           stepImages: data.stepImages || data.landing?.stepImages || []
//         });
//       } catch (err) {
//         console.error("Error fetching landing images", err);
//         // Fallback: keep null so local images are used
//       } finally {
//         setLoadingLandingImages(false);
//       }
//     };
//     fetchLandingImages();
//   }, []);
//   // ────────────────────────────────────────────────────────────────────

//   // Track previous step to avoid scrolling on initial mount
//   const prevStepRef = useRef(vtoStep);
//   useEffect(() => {
//     prevStepRef.current = vtoStep;
//   }, [vtoStep]);

//   // Scroll to the landing card every time we come BACK to landing
//   useEffect(() => {
//     if (vtoStep === 'landing' && prevStepRef.current !== 'landing') {
//       setTimeout(() => {
//         const el = document.getElementById('main-backe-2');
//         if (el) {
//           el.scrollIntoView({ behavior: 'smooth', block: 'center' });
//         }
//       }, 50);
//     }
//   }, [vtoStep]);

//   useEffect(() => {
//     const handlePopState = () => {
//       setVtoStep('landing');
//     };
//     window.addEventListener("popstate", handlePopState);
//     return () => window.removeEventListener("popstate", handlePopState);
//   }, []);

//   // Initialize MediaPipe FaceMesh
//   useEffect(() => {
//     if (vtoStep === 'engine') {
//       try {
//         const faceMesh = new FaceMesh({
//           locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`,
//         });
//         faceMesh.setOptions({
//           maxNumFaces: 1,
//           refineLandmarks: true,
//           minDetectionConfidence: 0.5,
//           minTrackingConfidence: 0.5
//         });

//         faceMesh.onResults((results) => {
//           const canvas = canvasRef.current;
//           if (!canvas) return;
//           const ctx = canvas.getContext('2d');
//           const videoWidth = results.image.width;
//           const videoHeight = results.image.height;
//           canvas.width = videoWidth;
//           canvas.height = videoHeight;
//           ctx.clearRect(0, 0, canvas.width, canvas.height);

//           ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

//           if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
//             let lms = results.multiFaceLandmarks[0];
//             if (mode === 'live') {
//               lms = applyAdaptiveSmoothing(lms, smoothedLms.current, canvas.width, canvas.height);
//               smoothedLms.current = lms;
//             }
//             applyMakeup(ctx, lms, canvas.width, canvas.height, S.current);
//           } else {
//             if (mode === 'live') smoothedLms.current = null;
//           }
//         });

//         faceMeshRef.current = faceMesh;

//         if (mode === 'live') {
//           if (webcamRef.current && webcamRef.current.video) {
//             const camera = new Camera(webcamRef.current.video, {
//               onFrame: async () => {
//                 if (webcamRef.current?.video && faceMeshRef.current) {
//                   await faceMeshRef.current.send({ image: webcamRef.current.video });
//                 }
//               },
//               width: 640,
//               height: 480
//             });
//             camera.start();
//             cameraRef.current = camera;
//             setStatusMsg('Live Mode Active');
//           } else {
//             setTimeout(() => {
//               if (webcamRef.current && webcamRef.current.video) {
//                 const camera = new Camera(webcamRef.current.video, {
//                   onFrame: async () => {
//                     if (webcamRef.current?.video && faceMeshRef.current) {
//                       await faceMeshRef.current.send({ image: webcamRef.current.video });
//                     }
//                   },
//                   width: 640,
//                   height: 480
//                 });
//                 camera.start();
//                 cameraRef.current = camera;
//                 setStatusMsg('Live Mode Active');
//               }
//             }, 1000);
//           }
//         }
//       } catch (err) {
//         console.error("FaceMesh initialization error", err);
//       }
//     } else {
//       if (cameraRef.current) { cameraRef.current.stop(); cameraRef.current = null; }
//       if (faceMeshRef.current) { faceMeshRef.current.close(); faceMeshRef.current = null; }
//     }
//     return () => {
//       if (cameraRef.current) cameraRef.current.stop();
//       if (faceMeshRef.current) faceMeshRef.current.close();
//     }
//   }, [vtoStep, mode]);

//   // Handle Photo Mode static analysis
//   useEffect(() => {
//     if (vtoStep === 'engine' && mode === 'photo' && uploadedImage && faceMeshRef.current) {
//       setStatusMsg('Processing Photo...');
//       const img = new Image();
//       img.onload = async () => {
//         try {
//           await faceMeshRef.current.send({ image: img });
//           setStatusMsg('Photo Ready!');
//         } catch (e) {
//           console.error(e);
//         }
//       };
//       img.src = uploadedImage;
//     }
//   }, [vtoStep, mode, uploadedImage]);

//   const handleTypeSelect = async (type) => {
//     setActiveType(type);
//     setSidePanel('products');
//     setLoadingProducts(true);
//     try {
//       const res = await axios.get(`https://beauty.joyory.com/api/vto/workflow?type=${type}`);
//       setProducts(res.data.products || []);
//     } catch (err) {
//       console.error("Error fetching products", err);
//     } finally {
//       setLoadingProducts(false);
//     }
//   };

//   const handleProductSelect = async (product) => {
//     setActiveProduct(product);
//     setSidePanel('shades');
//     setLoadingShades(true);
//     try {
//       const res = await axios.get(`https://beauty.joyory.com/api/vto/workflow?productId=${product._id}`);
//       setShades(res.data.product?.shades || []);
//     } catch (err) {
//       console.error("Error fetching shades", err);
//     } finally {
//       setLoadingShades(false);
//     }
//   };

//   const applyShade = (shade) => {
//     setActiveShade(shade.sku || shade._id || shade.name);
//     let hex = shade.hex || shade.color;
//     if (!hex) return;
//     if (!hex.startsWith('#')) hex = '#' + hex;

//     const type = (activeType || '').toLowerCase();
//     if (type.includes('lip')) { S.current.lipC = hex; }
//     else if (type.includes('eye') && !type.includes('brow')) { S.current.linerC = hex; }
//     else if (type.includes('found')) { S.current.foundC = hex; S.current.fOn = true; }
//     else if (type.includes('blush')) { S.current.blushC = hex; }
//     else if (type.includes('brow')) { S.current.browC = hex; }

//     if (mode === 'photo' && faceMeshRef.current && uploadedImage) {
//       const img = new Image();
//       img.onload = async () => { await faceMeshRef.current.send({ image: img }); };
//       img.src = uploadedImage;
//     }
//   };

//   const handleIntensityChange = (e) => {
//     const val = parseInt(e.target.value, 10);
//     setIntensity(val);
//     const alpha = val / 100;
//     const type = (activeType || '').toLowerCase();
//     if (type.includes('lip')) { S.current.lOp = alpha; }
//     else if (type.includes('eye') && !type.includes('brow')) { S.current.linerOp = alpha; }
//     else if (type.includes('found')) { S.current.fOp = alpha; }
//     else if (type.includes('blush')) { S.current.blushOp = alpha; }
//     else if (type.includes('brow')) { S.current.browOp = alpha; }

//     if (mode === 'photo' && faceMeshRef.current && uploadedImage) {
//       const img = new Image();
//       img.onload = async () => { await faceMeshRef.current.send({ image: img }); };
//       img.src = uploadedImage;
//     }
//   };

//   const handlePhotoUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const url = URL.createObjectURL(file);
//       setUploadedImage(url);
//       setMode('photo');
//       setVtoStep('engine');
//     }
//   };

//   const downloadImage = () => {
//     const canvas = canvasRef.current;
//     if (canvas) {
//       const link = document.createElement('a');
//       link.download = 'joyory-vto.png';
//       link.href = canvas.toDataURL();
//       link.click();
//     }
//   };

//   const labelFor = (type) => {
//     if (!type) return "";
//     return type.charAt(0).toUpperCase() + type.slice(1);
//   };

//   const handleBaDragStart = (e) => {
//     if (!compareMode) return;
//     setIsDragging(true);
//     handleBaDragCalc(e);
//   };

//   const handleBaDragEnd = () => {
//     if (!compareMode) return;
//     setIsDragging(false);
//   };

//   const handleBaDragMove = (e) => {
//     if (!compareMode || !isDragging) return;
//     handleBaDragCalc(e);
//   };

//   const handleBaDragCalc = (e) => {
//     const container = e.currentTarget;
//     const rect = container.getBoundingClientRect();
//     let clientX;
//     if (e.touches && e.touches.length > 0) {
//       clientX = e.touches[0].clientX;
//     } else if (e.clientX !== undefined) {
//       clientX = e.clientX;
//     } else {
//       return;
//     }
//     let newPos = (clientX - rect.left) / rect.width;
//     newPos = Math.max(0, Math.min(1, newPos));
//     setBaPos(newPos);
//   };

//   const goBackToLandingWithScroll = useCallback(() => {
//     // Stop camera first if in live mode to free resources
//     if (cameraRef.current) {
//       cameraRef.current.stop();
//       cameraRef.current = null;
//     }
//     if (faceMeshRef.current) {
//       faceMeshRef.current.close();
//       faceMeshRef.current = null;
//     }

//     // Reset state
//     setCompareMode(false);
//     setMode(null);
//     setActiveType(null);
//     setActiveProduct(null);
//     setActiveShade(null);
//     setSidePanel('types');

//     // Navigate to landing
//     setVtoStep('landing');

//     // Scroll after DOM update
//     setTimeout(() => {
//       const el = document.getElementById('main-backe-2');
//       if (el) {
//         el.scrollIntoView({
//           behavior: 'smooth',
//           block: 'center'
//         });
//       }
//     }, 300);
//   }, []);

//   // ── HELPER: Get image source (backend first, fallback to local) ─────
//   const getImageSrc = (backendUrl, localFallback) => {
//     return backendUrl || localFallback;
//   };
//   // ────────────────────────────────────────────────────────────────────

//   return (
//     <div className={`vto-main-wrapper d-flex ${vtoStep === 'landing' ? 'vto-landing-mode-wrapper' : ''}`}>
//       <div className={`vto-app-container ${vtoStep === 'landing' ? 'vto-landing-mode' : ''}`}>

//         {/* 1. LANDING SCREEN */}
//         {vtoStep === 'landing' && (
//           <>
//             <div className="vto-landing-header-container">
//               <Header />
//             </div>
//             <div className="vto-landing-screen-integrated">
//               <div className="vto-bg-layer">
//                 <div className="virtualtryon-container-bg">
//                   <header className="hero-section-vto-bg">
//                     {/* ✅ DYNAMIC: Hero Banner - Backend image first, fallback to local */}
//                     <img 
//                       src={getImageSrc(landingImages.heroBanner, vtoHero)} 
//                       alt="Virtual Try On Banner" 
//                       className="hero-banner-img-bg" 
//                     />
//                   </header>

//                   {/* ✅ DYNAMIC: How it works section with backend step images */}
//                   <div className="how-it-works-section-bg">
//                     <h2 className="section-title-vto-bg">TRY ON MAKEUP VIRTUALLY</h2>
//                     <div className="steps-container-bg">
//                       {[1, 2, 3].map((i, idx) => (
//                         <div key={i} className="step-card-bg">
//                           <div className="step-image-wrapper-bg">
//                             {/* Dynamic step image from backend, fallback to empty */}
//                             {landingImages.stepImages[idx] && (
//                               <img 
//                                 src={landingImages.stepImages[idx]} 
//                                 alt={`Step ${i}`} 
//                                 className="step-image-bg"
//                               />
//                             )}
//                           </div>
//                           <h3 className="step-number-bg">Step {i}</h3>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="vto-landing-card-container main-backe-2" id="main-backe-2">
//                 <div className="vto-landing-bg-box">
//                   {/* ✅ DYNAMIC: Card Background - Backend image first, fallback to local */}
//                   <img 
//                     src={getImageSrc(landingImages.cardBackground, vtoFirst)} 
//                     alt="VTO Background" 
//                     className="vto-bg-img img-fluid" 
//                   />
//                   <div className="vto-phone-overlay">
//                     <div className="vto-phone-frame">
//                       {/* ✅ DYNAMIC: Phone View - Backend image first, fallback to local */}
//                       <img 
//                         src={getImageSrc(landingImages.phoneView, vtoFirst)} 
//                         alt="VTO Phone View" 
//                         className="vto-phone-img-zoomed" 
//                       />
//                       <div className="vto-phone-scan-corners"></div>
//                       <div className="vto-phone-bottom-strip">
//                         {[1, 2, 3].map(i => <div key={i} className="vto-mini-prod"></div>)}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="vto-landing-content-box">
//                   <h1 className="vto-title-landing">VIRTUAL TRY ON</h1>
//                   <p className="vto-subtitle-landing">For The Best Virtual Try-on Experience, Please Use Safari Or Chrome</p>
//                   <div className="vto-actions-landing">
//                     <button
//                       className="vto-btn-black"
//                       onClick={() => {
//                         window.history.pushState({ vto: true }, "");
//                         setMode('live');
//                         setVtoStep('engine');
//                       }}
//                     >SELFIE MODE</button>
//                     <button className="vto-btn-black" onClick={() => { setMode('photo'); setVtoStep('instructions'); }}>UPLOAD PHOTO</button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}

//         {/* 2. INSTRUCTIONS SCREEN */}
//         {vtoStep === 'instructions' && (
//           <div className="vto-instructions-screen">
//             <div className="vto-instr-card">
//               <div className="vto-instr-header">
//                 <button className="vto-instr-icon-btn" onClick={goBackToLandingWithScroll}><FaChevronLeft /></button>
//                 <div className="vto-instr-brand">
//                   <div className="vto-instr-brand-text">JOYORY<span>BEAUTY</span></div>
//                 </div>
//                 <button className="vto-instr-icon-btn" onClick={goBackToLandingWithScroll}><FaTimes /></button>
//               </div>
//               <div className="vto-instr-content">
//                 <h2 className="vto-instr-title">PHOTO INSTRUCTIONS</h2>
//                 <div className="vto-instr-list">
//                   <div className="vto-instr-item"><div className="vto-instr-icon-box"></div><p>Use a Photo that is of the face straight on.</p></div>
//                   <div className="vto-instr-item"><div className="vto-instr-icon-box"></div><p>Make Sure Nothing Is Obstructing The Face.</p></div>
//                   <div className="vto-instr-item"><div className="vto-instr-icon-box"></div><p>Make Sure That The Lighting Is Not Too Dim Or Too Bright.</p></div>
//                 </div>
//               </div>
//               <div className="vto-instr-footer">
//                 <button className="vto-btn-black-rect" onClick={() => fileInputRef.current?.click()}>UPLOAD PHOTO</button>
//                 <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" style={{ display: 'none' }} />
//               </div>
//             </div>
//           </div>
//         )}

//         {/* 3. MAIN VTO ENGINE */}
//         {vtoStep === 'engine' && (
//           <div className="vto-workspace">
//             {!compareMode && (
//               <div className="vto-engine-sidebar">
//                 {sidePanel === 'types' && (
//                   <div className="vto-sidebar-items">
//                     {loadingTypes ? <div className="vto-spinner-wrap-small"><FaSpinner className="vto-spin" /></div> :
//                       vtoTypes.map((type, i) => (
//                         <div key={i} className={`vto-sidebar-item ${activeType === type ? 'active' : ''}`} onClick={() => handleTypeSelect(type)}>
//                           <div className="vto-sidebar-icon-box">
//                             <img src={type.includes('lip') ? "https://img.icons8.com/color/48/lipstick.png" : "https://img.icons8.com/color/48/makeup.png"} alt={type} className="vto-cat-thumb-img" />
//                           </div>
//                           <span className="vto-sidebar-label">{labelFor(type)}</span>
//                         </div>
//                       ))
//                     }
//                   </div>
//                 )}

//                 {sidePanel === 'products' && (
//                   <div className="vto-sidebar-items vto-sidebar-products">
//                     <div className="vto-sidebar-item" onClick={() => { setActiveType(null); setProducts([]); setSidePanel('types'); }}>
//                       <div className="vto-sidebar-icon-box" style={{ background: 'transparent', border: 'none', color: '#fff' }}><FaChevronLeft size={24} /></div>
//                     </div>
//                     {loadingProducts ? <div className="vto-spinner-wrap-small"><FaSpinner className="vto-spin" /></div> :
//                       products.map((p, i) => (
//                         <div key={p._id || i} className={`vto-sidebar-item ${activeProduct?._id === p._id ? 'active' : ''}`} onClick={() => handleProductSelect(p)}>
//                           <div className="vto-sidebar-icon-box">
//                             <img src={p.image || "https://via.placeholder.com/56"} alt={p.name} className="vto-cat-thumb-img" style={{ borderRadius: '8px' }} />
//                           </div>
//                           <span className="vto-sidebar-label">{p.name || p.brand}</span>
//                         </div>
//                       ))
//                     }
//                   </div>
//                 )}

//                 {sidePanel === 'shades' && (
//                   <div className="vto-sidebar-items vto-sidebar-shades">
//                     <div className="vto-sidebar-item" onClick={() => setSidePanel('products')}>
//                       <div className="vto-sidebar-icon-box" style={{ background: 'transparent', border: 'none', color: '#fff' }}><FaChevronLeft size={24} /></div>
//                     </div>
//                     {loadingShades ? <div className="vto-spinner-wrap-small"><FaSpinner className="vto-spin" /></div> :
//                       shades.map((shade, idx) => (
//                         <div key={shade.sku || idx} className={`vto-sidebar-item ${activeShade === shade.sku ? 'active' : ''}`} onClick={() => applyShade(shade)}>
//                           <div className="vto-sidebar-shade-square" style={{ backgroundColor: shade.hex.startsWith('#') ? shade.hex : '#' + shade.hex }} />
//                           <span className="vto-sidebar-label">{shade.shadeName}</span>
//                         </div>
//                       ))
//                     }
//                   </div>
//                 )}
//                 <div className="vto-sidebar-divider"></div>
//               </div>
//             )}

//             <div
//               className="vto-canvas-container"
//               onMouseDown={compareMode ? handleBaDragStart : undefined}
//               onMouseMove={compareMode ? handleBaDragMove : undefined}
//               onMouseUp={compareMode ? handleBaDragEnd : undefined}
//               onMouseLeave={compareMode ? handleBaDragEnd : undefined}
//               onTouchStart={compareMode ? handleBaDragStart : undefined}
//               onTouchMove={compareMode ? handleBaDragMove : undefined}
//               onTouchEnd={compareMode ? handleBaDragEnd : undefined}
//               style={{ position: 'relative', overflow: 'hidden', cursor: compareMode ? (isDragging ? 'ew-resize' : 'pointer') : 'default' }}
//             >

//               {/* Original Before Layer */}
//               <div className="vto-ba-before-layer" style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 1 }}>
//                 {mode === 'live' && <Webcam ref={webcamRef} audio={false} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} videoConstraints={{ facingMode: "user" }} />}
//                 {mode === 'photo' && uploadedImage && <img ref={imageRef} src={uploadedImage} alt="Uploaded" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
//               </div>

//               {/* Styled Canvas Layer */}
//               <canvas
//                 ref={canvasRef}
//                 className="vto-main-canvas"
//                 style={{
//                   position: 'absolute', inset: 0, width: '100%', height: '100%',
//                   objectFit: mode === 'photo' ? 'contain' : 'cover',
//                   transform: mode === 'live' ? 'scaleX(-1)' : 'none',
//                   clipPath: compareMode ? `inset(0 ${100 - (baPos * 100)}% 0 0)` : 'none',
//                   zIndex: 2,
//                   pointerEvents: compareMode ? 'none' : 'auto'
//                 }}
//               />

//               {compareMode && (
//                 <>
//                   <div className="vto-compare-labels">
//                     <button className="vto-compare-pill vto-pill-left" onClick={() => setCompareMode(false)}>BEFORE</button>
//                     <button className="vto-compare-pill vto-pill-right" onClick={() => setCompareMode(false)}>AFTER</button>
//                   </div>
//                   <div className="ba-divider" style={{ position: 'absolute', top: 0, bottom: 0, width: '2px', background: 'rgba(255,255,255,0.7)', left: `${baPos * 100}%`, zIndex: 10, transform: 'translateX(-50%)', pointerEvents: 'none' }}></div>
//                   <div className="ba-handle-bottom" style={{ position: 'absolute', bottom: '8%', left: `${baPos * 100}%`, transform: 'translateX(-50%)', zIndex: 11, display: 'flex', gap: '4px', pointerEvents: 'none' }}>
//                     <div style={{ width: '4px', height: '32px', background: 'rgba(255,255,255,0.9)', borderRadius: '2px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}></div>
//                     <div style={{ width: '4px', height: '32px', background: 'rgba(255,255,255,0.9)', borderRadius: '2px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}></div>
//                   </div>
//                 </>
//               )}

//               <div className="vto-status" style={{ zIndex: 20 }}>{statusMsg}</div>
//             </div>

//             {!compareMode && (
//               <div className="vto-intensity-slider-wrap">
//                 <div className="vto-slider-track-thin">
//                   <input type="range" className="vto-vertical-slider-thin" min="0" max="100" value={intensity} onChange={handleIntensityChange} />
//                 </div>
//                 <div className="vto-slider-icon">
//                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="white" />
//                   </svg>
//                 </div>
//               </div>
//             )}

//             {!compareMode && (
//               <div className="vto-top-controls-v2">
//                 <button className="vto-compare-btn" onClick={() => setCompareMode(true)}>COMPARE</button>
//                 <button className="vto-instr-icon-btn vto-close-btn-v2" onClick={goBackToLandingWithScroll}><FaTimes /></button>
//               </div>
//             )}

//             <div className="vto-bottom-controls-v2">
//               <button className="vto-download-btn-v2" onClick={downloadImage}>
//                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M19 15V19H5V15H3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V15H19ZM13 12.67L15.59 10.09L17 11.5L12 16.5L7 11.5L8.41 10.09L11 12.67V3H13V12.67Z" fill="white" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MainVirtualTryon;
























// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import Webcam from 'react-webcam';
// import axios from 'axios';
// import {
//   FaCamera, FaImage, FaDownload, FaChevronLeft, FaChevronRight,
//   FaTimes, FaSpinner, FaHistory, FaCheckCircle
// } from 'react-icons/fa';
// import { FaceMesh } from '@mediapipe/face_mesh';
// import { Camera } from '@mediapipe/camera_utils';
// import '../css/Mainvirtualtryon.css';

// import Header from './Header';
// import vtoHero from "../assets/vto_hero.png";
// import vtoFirst from '../assets/VTO_FIRST.png';

// // ── Landmark indices (unchanged) ──────────────────────────────
// const LIP_OUTER = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17, 84, 181, 91, 146];
// const LIP_INNER = [78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95];
// const LEYE_UPPER = [33, 246, 161, 160, 159, 158, 157, 173, 133];
// const REYE_UPPER = [263, 466, 388, 387, 386, 385, 384, 398, 362];
// const LEYE_LOWER = [133, 155, 154, 153, 145, 144, 163, 7, 33];
// const REYE_LOWER = [362, 382, 381, 380, 374, 373, 390, 249, 263];

// const LBROW_TOP = [70, 63, 105, 66, 107];
// const LBROW_BOT = [46, 53, 52, 65, 55];
// const RBROW_TOP = [336, 296, 334, 293, 300];
// const RBROW_BOT = [276, 283, 282, 295, 285];
// const LBROW = [...LBROW_TOP, ...[...LBROW_BOT].reverse()];
// const RBROW = [...RBROW_TOP, ...[...RBROW_BOT].reverse()];

// const FACE = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];

// const LCHECK = [117, 118, 119, 120, 121, 123, 147, 213, 192, 234];
// const RCHECK = [346, 347, 348, 349, 350, 352, 376, 433, 416, 454];

// function pt(lms, i, w, h) { return { x: lms[i].x * w, y: lms[i].y * h }; }
// function hexRgb(h) {
//   if (!h || h === 'none') return [0, 0, 0];
//   const c = h.replace('#', '');
//   return [parseInt(c.slice(0, 2), 16) || 0, parseInt(c.slice(2, 4), 16) || 0, parseInt(c.slice(4, 6), 16) || 0];
// }

// function catmullSmooth(pts, steps = 14) {
//   const out = [];
//   for (let i = 0; i < pts.length - 1; i++) {
//     const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
//     for (let s = 0; s < steps; s++) {
//       const t = s / steps, t2 = t * t, t3 = t2 * t;
//       out.push({
//         x: .5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
//         y: .5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3)
//       });
//     }
//   }
//   out.push(pts[pts.length - 1]); return out;
// }

// function drawBrow(ctx, lms, browI, color, alpha, style, thickMul, w, h) {
//   if (!color || color === 'none') return;
//   const [r, g, b] = hexRgb(color);
//   const off = document.createElement('canvas'); off.width = w; off.height = h;
//   const ox = off.getContext('2d');
//   const half = Math.floor(browI.length / 2);
//   let tPts = browI.slice(0, half).map(i => pt(lms, i, w, h)).sort((a, b) => a.x - b.x);
//   let bPts = browI.slice(half).map(i => pt(lms, i, w, h)).sort((a, b) => a.x - b.x);
//   let pts = [...tPts, ...bPts.reverse()];
//   const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
//   const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
//   const scaleY = 0.90 + (thickMul * 0.45);
//   const scaleX = 1.00 + (thickMul * 0.08);
//   pts = pts.map(p => ({ x: cx + (p.x - cx) * scaleX, y: cy + (p.y - cy) * scaleY }));
//   ox.beginPath();
//   const last = pts[pts.length - 1];
//   ox.moveTo((pts[0].x + last.x) / 2, (pts[0].y + last.y) / 2);
//   for (let i = 0; i < pts.length; i++) {
//     const p1 = pts[i], p2 = pts[(i + 1) % pts.length];
//     ox.quadraticCurveTo(p1.x, p1.y, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
//   }
//   ox.closePath();
//   let opMul = 1.0, blurAmt = 1.6;
//   if (style === 'feathered') { opMul = 0.60; blurAmt = 1.4; }
//   else if (style === 'bold') { opMul = 0.95; blurAmt = 0.8; }
//   else if (style === 'defined') { opMul = 0.85; blurAmt = 0.7; }
//   else { opMul = 0.75; blurAmt = 1.8; }
//   ox.fillStyle = `rgb(${r},${g},${b})`; ox.fill();
//   ctx.save();
//   ctx.globalCompositeOperation = 'multiply'; ctx.filter = `blur(${blurAmt}px)`; ctx.globalAlpha = Math.min(alpha * opMul * 1.5, 0.95); ctx.drawImage(off, 0, 0);
//   ctx.globalCompositeOperation = 'source-over'; ctx.filter = `blur(${blurAmt * 0.35}px)`; ctx.globalAlpha = alpha * opMul * 0.4; ctx.drawImage(off, 0, 0);
//   ctx.restore();
// }

// function drawBlush(ctx, lms, checkI, color, alpha, w, h) {
//   if (!color || alpha <= 0) return;
//   const pts = checkI.map(i => pt(lms, i, w, h));
//   const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
//   const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
//   const faceL = pt(lms, 234, w, h), faceR = pt(lms, 454, w, h);
//   const faceW = Math.max(Math.abs(faceR.x - faceL.x), 60);
//   const isLeft = checkI.includes(234);
//   const templePt = isLeft ? faceL : faceR;
//   const sweepAngle = Math.atan2(templePt.y - cy, templePt.x - cx);
//   const rx = faceW * 0.28, ry = faceW * 0.12;
//   const [r, g, b] = hexRgb(color);
//   const off = document.createElement('canvas'); off.width = w; off.height = h;
//   const ox = off.getContext('2d');
//   ox.save(); ox.translate(cx, cy); ox.rotate(sweepAngle);
//   ox.filter = `blur(${rx * 0.20}px)`; ox.scale(1, ry / rx);
//   const gr = ox.createRadialGradient(-rx * 0.15, 0, 0, 0, 0, rx);
//   gr.addColorStop(0.00, `rgba(${r},${g},${b},${alpha * 1.8})`);
//   gr.addColorStop(0.40, `rgba(${r},${g},${b},${alpha * 0.7})`);
//   gr.addColorStop(1.00, `rgba(${r},${g},${b},0)`);
//   ox.fillStyle = gr; ox.beginPath(); ox.arc(0, 0, rx * 1.1, 0, Math.PI * 2); ox.fill(); ox.restore();
//   ox.globalCompositeOperation = 'destination-out'; ox.filter = 'blur(4px)';
//   const eyeHole = (isLeft ? LEYE_LOWER : REYE_LOWER).map(i => pt(lms, i, w, h));
//   ox.beginPath(); ox.ellipse(eyeHole[4].x, eyeHole[4].y - faceW * 0.015, faceW * 0.14, faceW * 0.06, 0, 0, Math.PI * 2); ox.fill();
//   const luma = (0.299 * r + 0.587 * g + 0.114 * b);
//   const isSuperDark = luma < 60;
//   ctx.save();
//   ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = isSuperDark ? 0.85 : 0.35; ctx.drawImage(off, 0, 0);
//   ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = isSuperDark ? 0.3 : 0.65; ctx.drawImage(off, 0, 0);
//   ctx.restore();
// }

// function drawEyeliner(ctx, lms, eyeUpperI, eyeLowerI, color, alpha, style, placement, w, h) {
//   if (!color || color === 'none' || style === 'none') return;
//   const [r, g, b] = hexRgb(color);
//   const isLeft = eyeUpperI.includes(33);
//   const innerCorner = isLeft ? 133 : 362;
//   let rawUp = eyeUpperI.map(i => pt(lms, i, w, h)), rawLo = eyeLowerI.map(i => pt(lms, i, w, h));
//   if (eyeUpperI[0] !== innerCorner) rawUp.reverse();
//   if (eyeLowerI[0] !== innerCorner) rawLo.reverse();
//   const smUp = catmullSmooth(rawUp, 18), smLo = catmullSmooth(rawLo, 18);
//   const allPts = [...smUp, ...smLo];
//   const cx = allPts.reduce((s, p) => s + p.x, 0) / allPts.length, cy = allPts.reduce((s, p) => s + p.y, 0) / allPts.length;
//   const eyeW = Math.sqrt(Math.pow(smUp[smUp.length - 1].x - smUp[0].x, 2) + Math.pow(smUp[smUp.length - 1].y - smUp[0].y, 2)) || 10;
//   const SP = {
//     thin: { th: 0.06, wingLen: 0, wingLift: 0, lo: false, smoky: false, tight: false },
//     cat: { th: 0.09, wingLen: 0.17, wingLift: 0.14, lo: false, smoky: false, tight: false },
//     medium: { th: 0.12, wingLen: 0.12, wingLift: 0.08, lo: false, smoky: false, tight: false },
//     dramatic: { th: 0.20, wingLen: 0.32, wingLift: 0.25, lo: true, smoky: false, tight: false },
//     smoky: { th: 0.20, wingLen: 0, wingLift: 0, lo: true, smoky: true, tight: false },
//     tightline: { th: 0.03, wingLen: 0, wingLift: 0, lo: false, smoky: false, tight: true }
//   };
//   const sp = SP[style] || SP.thin;
//   const linerThickMul = 1.0;
//   const baseThick = Math.max(eyeW * sp.th * linerThickMul, 1.2);

//   const drawLinerCurve = (curve, isUpper) => {
//     const sn = curve.length;
//     const pts = curve.map((p, i) => {
//       const prev = curve[Math.max(0, i - 1)], next = curve[Math.min(sn - 1, i + 1)];
//       const tx = next.x - prev.x, ty = next.y - prev.y;
//       const len = Math.sqrt(tx * tx + ty * ty) || 1;
//       const nx1 = -ty / len, ny1 = tx / len, nx2 = ty / len, ny2 = -tx / len;
//       const d1 = (p.x + nx1 - cx) ** 2 + (p.y + ny1 - cy) ** 2, d2 = (p.x + nx2 - cx) ** 2 + (p.y + ny2 - cy) ** 2;
//       const nx = d1 > d2 ? nx1 : nx2, ny = d1 > d2 ? ny1 : ny2;
//       const t = i / (sn - 1);
//       let tFct = isUpper ? (sp.smoky ? 0.1 + 0.9 * Math.pow(t, 0.8) : style === 'dramatic' ? 0.05 + 0.95 * Math.pow(t, 2.2) : style === 'cat' ? 0.05 + 0.95 * Math.pow(t, 1.5) : t < 0.25 ? Math.pow(t / 0.25, 1.5) : 1) : (sp.smoky ? 0.05 + 0.85 * t : style === 'dramatic' ? 0.02 + 0.55 * Math.pow(t, 1.5) : 0.02 + 0.4 * t);
//       if (!isUpper && t > 0.85) tFct *= (1 - ((t - 0.85) / 0.15) * 0.9);
//       const pxThick = baseThick * tFct * (isUpper ? 1 : 0.5);
//       return { x: p.x + nx * pxThick, y: p.y + ny * pxThick, nx, ny };
//     });
//     const off = document.createElement('canvas'); off.width = w; off.height = h; const ox = off.getContext('2d');
//     ox.fillStyle = `rgb(${r},${g},${b})`; ox.beginPath();
//     curve.forEach((p, i) => i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y));
//     if (isUpper && sp.wingLen > 0) {
//       const lookIdx = Math.max(0, sn - 4);
//       const wx = curve[sn - 1].x - curve[lookIdx].x, wy = curve[sn - 1].y - curve[lookIdx].y;
//       const wLen = Math.sqrt(wx * wx + wy * wy) || 1, uX = wx / wLen, uY = wy / wLen;
//       const outerTip = pts[sn - 1];
//       const targetX = curve[sn - 1].x + uX * eyeW * sp.wingLen + outerTip.nx * eyeW * sp.wingLift;
//       const targetY = curve[sn - 1].y + uY * eyeW * sp.wingLen + outerTip.ny * eyeW * sp.wingLift;
//       const cpX = curve[sn - 1].x + uX * eyeW * sp.wingLen * 0.4, cpY = curve[sn - 1].y + uY * eyeW * sp.wingLen * 0.4;
//       ox.quadraticCurveTo(cpX, cpY, targetX, targetY); ox.lineTo(outerTip.x, outerTip.y);
//     }
//     [...pts].reverse().forEach(p => ox.lineTo(p.x, p.y)); ox.closePath(); ox.fill();
//     ctx.save();
//     if (sp.smoky) {
//       ctx.globalCompositeOperation = 'multiply'; ctx.filter = `blur(${baseThick * 1.5}px)`; ctx.globalAlpha = Math.min(alpha * 1.2, 0.9); ctx.drawImage(off, 0, 0);
//       ctx.filter = `blur(${baseThick * 0.7}px)`; ctx.globalAlpha = Math.min(alpha * 0.8, 0.9); ctx.drawImage(off, 0, 0);
//       ctx.globalCompositeOperation = 'source-over'; ctx.filter = `blur(${baseThick * 0.2}px)`; ctx.globalAlpha = alpha * 0.4; ctx.drawImage(off, 0, 0);
//     } else {
//       ctx.globalCompositeOperation = 'multiply'; ctx.filter = 'blur(1.2px)'; ctx.globalAlpha = Math.min(alpha * 1.2, 0.95); ctx.drawImage(off, 0, 0);
//       ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'blur(0.4px)'; ctx.globalAlpha = alpha * 0.85; ctx.drawImage(off, 0, 0);
//     }
//     ctx.restore();
//   };

//   if (sp.tight) {
//     ctx.save(); ctx.strokeStyle = `rgba(${r},${g},${b},${alpha * 0.85})`; ctx.lineWidth = Math.max(eyeW * 0.025, 1.2);
//     ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.filter = 'blur(0.6px)'; ctx.beginPath();
//     smUp.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.stroke(); ctx.restore();
//     if (placement === 'both' || placement === 'lower') drawLinerCurve(smLo, false);
//     return;
//   }
//   if (placement === 'upper') { drawLinerCurve(smUp, true); if (sp.lo) drawLinerCurve(smLo, false); }
//   else if (placement === 'lower') drawLinerCurve(smLo, false);
//   else { drawLinerCurve(smUp, true); drawLinerCurve(smLo, false); }
// }

// function drawLips(ctx, lms, color, alpha, w, h) {
//   if (!color || color === 'none') return;
//   const [r, g, b] = hexRgb(color);
//   const off = document.createElement('canvas'); off.width = w; off.height = h; const ox = off.getContext('2d');
//   ox.beginPath();
//   LIP_OUTER.forEach((id, i) => { const p = pt(lms, id, w, h); i === 0 ? ox.moveTo(p.x, p.y) : ox.lineTo(p.x, p.y); });
//   ox.closePath();
//   [...LIP_INNER].reverse().forEach((id, i) => { const p = pt(lms, id, w, h); i === 0 ? ox.moveTo(p.x, p.y) : ox.lineTo(p.x, p.y); });
//   ox.closePath();
//   ox.fillStyle = `rgb(${r},${g},${b})`; ox.fill();
//   ctx.save();
//   ctx.globalCompositeOperation = 'multiply'; ctx.filter = 'blur(1.8px)'; ctx.globalAlpha = Math.min(alpha * 0.9, 0.85); ctx.drawImage(off, 0, 0);
//   ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'none'; ctx.globalAlpha = alpha * 0.35; ctx.drawImage(off, 0, 0);
//   ctx.restore();
// }

// function drawFoundation(ctx, lms, color, alpha, w, h) {
//   if (!color || color === 'none' || alpha <= 0) return;
//   const [r, g, b] = hexRgb(color);
//   const off = document.createElement('canvas'); off.width = w; off.height = h; const ox = off.getContext('2d');
//   ox.filter = 'blur(10px)'; ox.fillStyle = `rgb(${r},${g},${b})`; ox.beginPath();
//   FACE.forEach((id, i) => { const p = pt(lms, id, w, h); i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y); });
//   ox.closePath(); ox.fill();
//   ox.globalCompositeOperation = 'destination-out'; ox.fillStyle = '#fff'; ox.filter = 'blur(3.5px)'; ox.beginPath();
//   [...LEYE_UPPER, ...[...LEYE_LOWER].reverse()].forEach((id, i) => { const p = pt(lms, id, w, h); i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y); }); ox.closePath(); ox.fill();
//   ox.beginPath(); [...REYE_UPPER, ...[...REYE_LOWER].reverse()].forEach((id, i) => { const p = pt(lms, id, w, h); i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y); }); ox.closePath(); ox.fill();
//   ox.filter = 'blur(2px)'; ox.beginPath(); LIP_OUTER.forEach((id, i) => { const p = pt(lms, id, w, h); i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y); }); ox.closePath(); ox.fill();
//   ox.filter = 'blur(5px)'; ox.globalAlpha = 0.9; ox.beginPath(); LBROW.forEach((id, i) => { const p = pt(lms, id, w, h); i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y); }); ox.closePath(); ox.fill();
//   ox.beginPath(); RBROW.forEach((id, i) => { const p = pt(lms, id, w, h); i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y); }); ox.closePath(); ox.fill();
//   ctx.save();
//   ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = Math.min(alpha * 0.95, 0.85); ctx.drawImage(off, 0, 0);
//   ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = alpha * 0.55; ctx.drawImage(off, 0, 0);
//   ctx.restore();
// }

// function applyMakeup(ctx, lms, w, h, S) {
//   if (S.fOn) drawFoundation(ctx, lms, S.foundC, S.fOp, w, h);
//   if (S.blushC) { drawBlush(ctx, lms, LCHECK, S.blushC, S.blushOp, w, h); drawBlush(ctx, lms, RCHECK, S.blushC, S.blushOp, w, h); }
//   drawBrow(ctx, lms, LBROW, S.browC, S.browOp, S.browStyle, S.browThick, w, h);
//   drawBrow(ctx, lms, RBROW, S.browC, S.browOp, S.browStyle, S.browThick, w, h);
//   drawEyeliner(ctx, lms, LEYE_UPPER, LEYE_LOWER, S.linerC, S.linerOp, S.linerStyle, S.linerPlacement, w, h);
//   drawEyeliner(ctx, lms, REYE_UPPER, REYE_LOWER, S.linerC, S.linerOp, S.linerStyle, S.linerPlacement, w, h);
//   drawLips(ctx, lms, S.lipC, S.lOp, w, h);
// }

// function applyAdaptiveSmoothing(newLms, prevLms, w, h) {
//   if (!prevLms) return newLms.map(p => ({ ...p }));
//   let totalDist = 0;
//   const anchors = [4, 152, 33, 263, 61, 291];
//   anchors.forEach(idx => {
//     const dx = (newLms[idx].x - prevLms[idx].x) * w;
//     const dy = (newLms[idx].y - prevLms[idx].y) * h;
//     totalDist += Math.sqrt(dx * dx + dy * dy);
//   });
//   const avgDist = totalDist / anchors.length;
//   let dynFactor = 0.75;
//   if (avgDist > 8) dynFactor = 0.0;
//   else if (avgDist > 1) dynFactor = 0.75 * (1 - ((avgDist - 1) / 7));
//   return newLms.map((p, i) => ({
//     x: prevLms[i].x * dynFactor + p.x * (1 - dynFactor),
//     y: prevLms[i].y * dynFactor + p.y * (1 - dynFactor),
//     z: prevLms[i].z !== undefined ? (prevLms[i].z * dynFactor + p.z * (1 - dynFactor)) : p.z
//   }));
// }
// // ─────────────────────────────────────────────────────────────────────────────

// const MainVirtualTryon = () => {
//   const [vtoStep, setVtoStep] = useState('landing');
//   const [mode, setMode] = useState(null);
//   const [activeType, setActiveType] = useState(null);
//   const [activeProduct, setActiveProduct] = useState(null);
//   const [activeShade, setActiveShade] = useState(null);
//   const [intensity, setIntensity] = useState(80);
//   const [compareMode, setCompareMode] = useState(false);
//   const [baPos, setBaPos] = useState(0.5);
//   const [isDragging, setIsDragging] = useState(false);
//   const [statusMsg, setStatusMsg] = useState('Initializing...');

//   const [vtoTypes, setVtoTypes] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [shades, setShades] = useState([]);
//   const [loadingTypes, setLoadingTypes] = useState(false);
//   const [loadingProducts, setLoadingProducts] = useState(false);
//   const [loadingShades, setLoadingShades] = useState(false);

//   // ── DYNAMIC LANDING IMAGES FROM BACKEND ─────────────────────────────
//   const [landingImages, setLandingImages] = useState({
//     heroBanner: null,      // vtoHero replacement
//     cardBackground: null,  // vtoFirst replacement
//     phoneView: null,       // phone frame image
//     stepImages: []         // step cards images [step1, step2, step3]
//   });
//   const [loadingLandingImages, setLoadingLandingImages] = useState(false);
//   // ────────────────────────────────────────────────────────────────────

//   const webcamRef = useRef(null);
//   const canvasRef = useRef(null);
//   const imageRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const [sidePanel, setSidePanel] = useState('types');
//   const [uploadedImage, setUploadedImage] = useState(null);

//   const S = useRef({
//     lipC: 'none', lOp: 0.8,
//     linerC: 'none', linerStyle: 'thin', linerPlacement: 'upper', linerOp: 0.85, linerThick: 1.0,
//     browC: 'none', browStyle: 'natural', browOp: 0.55, browThick: 0.55,
//     foundC: '#fce9d8', fOn: false, fOp: 0.18,
//     blushC: null, blushOp: 0.8
//   });
//   const smoothedLms = useRef(null);
//   const faceMeshRef = useRef(null);
//   const cameraRef = useRef(null);

//   // Load types
//   useEffect(() => {
//     const fetchTypes = async () => {
//       setLoadingTypes(true);
//       try {
//         const res = await axios.get('https://beauty.joyory.com/api/vto/workflow');
//         setVtoTypes(res.data.types || []);
//       } catch (err) {
//         console.error("Error fetching types", err);
//       } finally {
//         setLoadingTypes(false);
//         setStatusMsg('Ready ✓');
//       }
//     };
//     fetchTypes();
//   }, []);

//   // ── FETCH DYNAMIC LANDING IMAGES FROM BACKEND ───────────────────────
//   useEffect(() => {
//     const fetchLandingImages = async () => {
//       setLoadingLandingImages(true);
//       try {
//         const res = await axios.get('https://beauty.joyory.com/api/vto/workflow?section=landing');
//         const data = res.data;
//         setLandingImages({
//           heroBanner: data.heroBanner || data.landing?.heroBanner || null,
//           cardBackground: data.cardBackground || data.landing?.cardBackground || null,
//           phoneView: data.phoneView || data.landing?.phoneView || null,
//           stepImages: data.stepImages || data.landing?.stepImages || []
//         });
//       } catch (err) {
//         console.error("Error fetching landing images", err);
//       } finally {
//         setLoadingLandingImages(false);
//       }
//     };
//     fetchLandingImages();
//   }, []);

//   // Track previous step to avoid scrolling on initial mount
//   const prevStepRef = useRef(vtoStep);
//   useEffect(() => {
//     prevStepRef.current = vtoStep;
//   }, [vtoStep]);

//   // Scroll to the landing card every time we come BACK to landing
//   useEffect(() => {
//     if (vtoStep === 'landing' && prevStepRef.current !== 'landing') {
//       setTimeout(() => {
//         const el = document.getElementById('main-backe-2');
//         if (el) {
//           el.scrollIntoView({ behavior: 'smooth', block: 'center' });
//         }
//       }, 50);
//     }
//   }, [vtoStep]);

//   useEffect(() => {
//     const handlePopState = () => {
//       setVtoStep('landing');
//     };
//     window.addEventListener("popstate", handlePopState);
//     return () => window.removeEventListener("popstate", handlePopState);
//   }, []);

//   // Initialize MediaPipe FaceMesh
//   useEffect(() => {
//     if (vtoStep === 'engine') {
//       try {
//         const faceMesh = new FaceMesh({
//           locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`,
//         });
//         faceMesh.setOptions({
//           maxNumFaces: 1,
//           refineLandmarks: true,
//           minDetectionConfidence: 0.5,
//           minTrackingConfidence: 0.5
//         });

//         faceMesh.onResults((results) => {
//           const canvas = canvasRef.current;
//           if (!canvas) return;
//           const ctx = canvas.getContext('2d');
//           const videoWidth = results.image.width;
//           const videoHeight = results.image.height;
//           canvas.width = videoWidth;
//           canvas.height = videoHeight;
//           ctx.clearRect(0, 0, canvas.width, canvas.height);

//           ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

//           if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
//             let lms = results.multiFaceLandmarks[0];
//             if (mode === 'live') {
//               lms = applyAdaptiveSmoothing(lms, smoothedLms.current, canvas.width, canvas.height);
//               smoothedLms.current = lms;
//             }
//             applyMakeup(ctx, lms, canvas.width, canvas.height, S.current);
//           } else {
//             if (mode === 'live') smoothedLms.current = null;
//           }
//         });

//         faceMeshRef.current = faceMesh;

//         if (mode === 'live') {
//           if (webcamRef.current && webcamRef.current.video) {
//             const camera = new Camera(webcamRef.current.video, {
//               onFrame: async () => {
//                 if (webcamRef.current?.video && faceMeshRef.current) {
//                   await faceMeshRef.current.send({ image: webcamRef.current.video });
//                 }
//               },
//               width: 640,
//               height: 480
//             });
//             camera.start();
//             cameraRef.current = camera;
//             setStatusMsg('Live Mode Active');
//           } else {
//             setTimeout(() => {
//               if (webcamRef.current && webcamRef.current.video) {
//                 const camera = new Camera(webcamRef.current.video, {
//                   onFrame: async () => {
//                     if (webcamRef.current?.video && faceMeshRef.current) {
//                       await faceMeshRef.current.send({ image: webcamRef.current.video });
//                     }
//                   },
//                   width: 640,
//                   height: 480
//                 });
//                 camera.start();
//                 cameraRef.current = camera;
//                 setStatusMsg('Live Mode Active');
//               }
//             }, 1000);
//           }
//         }
//       } catch (err) {
//         console.error("FaceMesh initialization error", err);
//       }
//     } else {
//       if (cameraRef.current) { cameraRef.current.stop(); cameraRef.current = null; }
//       if (faceMeshRef.current) { faceMeshRef.current.close(); faceMeshRef.current = null; }
//     }
//     return () => {
//       if (cameraRef.current) cameraRef.current.stop();
//       if (faceMeshRef.current) faceMeshRef.current.close();
//     }
//   }, [vtoStep, mode]);

//   // Handle Photo Mode static analysis
//   useEffect(() => {
//     if (vtoStep === 'engine' && mode === 'photo' && uploadedImage && faceMeshRef.current) {
//       setStatusMsg('Processing Photo...');
//       const img = new Image();
//       img.onload = async () => {
//         try {
//           await faceMeshRef.current.send({ image: img });
//           setStatusMsg('Photo Ready!');
//         } catch (e) {
//           console.error(e);
//         }
//       };
//       img.src = uploadedImage;
//     }
//   }, [vtoStep, mode, uploadedImage]);

//   const handleTypeSelect = async (type) => {
//     setActiveType(type);
//     setSidePanel('products');
//     setLoadingProducts(true);
//     try {
//       const res = await axios.get(`https://beauty.joyory.com/api/vto/workflow?type=${type}`);
//       setProducts(res.data.products || []);
//     } catch (err) {
//       console.error("Error fetching products", err);
//     } finally {
//       setLoadingProducts(false);
//     }
//   };

//   const handleProductSelect = async (product) => {
//     setActiveProduct(product);
//     setSidePanel('shades');
//     setLoadingShades(true);
//     try {
//       const res = await axios.get(`https://beauty.joyory.com/api/vto/workflow?productId=${product._id}`);
//       setShades(res.data.product?.shades || []);
//     } catch (err) {
//       console.error("Error fetching shades", err);
//     } finally {
//       setLoadingShades(false);
//     }
//   };

//   const applyShade = (shade) => {
//     setActiveShade(shade.sku || shade._id || shade.name);
//     let hex = shade.hex || shade.color;
//     if (!hex) return;
//     if (!hex.startsWith('#')) hex = '#' + hex;

//     const type = (activeType || '').toLowerCase();
//     if (type.includes('lip')) { S.current.lipC = hex; }
//     else if (type.includes('eye') && !type.includes('brow')) { S.current.linerC = hex; }
//     else if (type.includes('found')) { S.current.foundC = hex; S.current.fOn = true; }
//     else if (type.includes('blush')) { S.current.blushC = hex; }
//     else if (type.includes('brow')) { S.current.browC = hex; }

//     if (mode === 'photo' && faceMeshRef.current && uploadedImage) {
//       const img = new Image();
//       img.onload = async () => { await faceMeshRef.current.send({ image: img }); };
//       img.src = uploadedImage;
//     }
//   };

//   const handleIntensityChange = (e) => {
//     const val = parseInt(e.target.value, 10);
//     setIntensity(val);
//     const alpha = val / 100;
//     const type = (activeType || '').toLowerCase();
//     if (type.includes('lip')) { S.current.lOp = alpha; }
//     else if (type.includes('eye') && !type.includes('brow')) { S.current.linerOp = alpha; }
//     else if (type.includes('found')) { S.current.fOp = alpha; }
//     else if (type.includes('blush')) { S.current.blushOp = alpha; }
//     else if (type.includes('brow')) { S.current.browOp = alpha; }

//     if (mode === 'photo' && faceMeshRef.current && uploadedImage) {
//       const img = new Image();
//       img.onload = async () => { await faceMeshRef.current.send({ image: img }); };
//       img.src = uploadedImage;
//     }
//   };

//   const handlePhotoUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const url = URL.createObjectURL(file);
//       setUploadedImage(url);
//       setMode('photo');
//       setVtoStep('engine');
//     }
//   };

//   const downloadImage = () => {
//     const canvas = canvasRef.current;
//     if (canvas) {
//       const link = document.createElement('a');
//       link.download = 'joyory-vto.png';
//       link.href = canvas.toDataURL();
//       link.click();
//     }
//   };

//   const labelFor = (type) => {
//     if (!type) return "";
//     return type.charAt(0).toUpperCase() + type.slice(1);
//   };

//   const handleBaDragStart = (e) => {
//     if (!compareMode) return;
//     setIsDragging(true);
//     handleBaDragCalc(e);
//   };

//   const handleBaDragEnd = () => {
//     if (!compareMode) return;
//     setIsDragging(false);
//   };

//   const handleBaDragMove = (e) => {
//     if (!compareMode || !isDragging) return;
//     handleBaDragCalc(e);
//   };

//   const handleBaDragCalc = (e) => {
//     const container = e.currentTarget;
//     const rect = container.getBoundingClientRect();
//     let clientX;
//     if (e.touches && e.touches.length > 0) {
//       clientX = e.touches[0].clientX;
//     } else if (e.clientX !== undefined) {
//       clientX = e.clientX;
//     } else {
//       return;
//     }
//     let newPos = (clientX - rect.left) / rect.width;
//     newPos = Math.max(0, Math.min(1, newPos));
//     setBaPos(newPos);
//   };

//   const goBackToLandingWithScroll = useCallback(() => {
//     if (cameraRef.current) {
//       cameraRef.current.stop();
//       cameraRef.current = null;
//     }
//     if (faceMeshRef.current) {
//       faceMeshRef.current.close();
//       faceMeshRef.current = null;
//     }
//     setCompareMode(false);
//     setMode(null);
//     setActiveType(null);
//     setActiveProduct(null);
//     setActiveShade(null);
//     setSidePanel('types');
//     setVtoStep('landing');
//     setTimeout(() => {
//       const el = document.getElementById('main-backe-2');
//       if (el) {
//         el.scrollIntoView({ behavior: 'smooth', block: 'center' });
//       }
//     }, 300);
//   }, []);

//   const getImageSrc = (backendUrl, localFallback) => backendUrl || localFallback;

//   return (
//     <div className={`vto-main-wrapper d-flex ${vtoStep === 'landing' ? 'vto-landing-mode-wrapper' : ''}`}>
//       <div className={`vto-app-container ${vtoStep === 'landing' ? 'vto-landing-mode' : ''}`}>

//         {/* 🟢 HEADER – ALWAYS VISIBLE */}
//         <div className="vto-landing-header-container">
//           <Header />
//         </div>

//         {/* LANDING CONTENT – only when step === 'landing' */}
//         {vtoStep === 'landing' && (
//           <div className="vto-landing-screen-integrated">
//             <div className="vto-bg-layer">
//               <div className="virtualtryon-container-bg">
//                 <header className="hero-section-vto-bg">
//                   <img 
//                     src={getImageSrc(landingImages.heroBanner, vtoHero)} 
//                     alt="Virtual Try On Banner" 
//                     className="hero-banner-img-bg" 
//                   />
//                 </header>
//               </div>
//             </div>

//             <div className="vto-landing-card-container main-backe-2" id="main-backe-2">
//               <div className="vto-landing-bg-box">
//                 <img 
//                   src={getImageSrc(landingImages.cardBackground, vtoFirst)} 
//                   alt="VTO Background" 
//                   className="vto-bg-img img-fluid" 
//                 />
//                 <div className="vto-phone-overlay">
//                   <div className="vto-phone-frame">
//                     <img 
//                       src={getImageSrc(landingImages.phoneView, vtoFirst)} 
//                       alt="VTO Phone View" 
//                       className="vto-phone-img-zoomed" 
//                     />
//                     <div className="vto-phone-scan-corners"></div>
//                     <div className="vto-phone-bottom-strip">
//                       {[1, 2, 3].map(i => <div key={i} className="vto-mini-prod"></div>)}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="vto-landing-content-box">
//                 <h1 className="vto-title-landing">VIRTUAL TRY ON</h1>
//                 <p className="vto-subtitle-landing">For The Best Virtual Try-on Experience, Please Use Safari Or Chrome</p>
//                 <div className="vto-actions-landing">
//                   <button
//                     className="vto-btn-black"
//                     onClick={() => {
//                       window.history.pushState({ vto: true }, "");
//                       setMode('live');
//                       setVtoStep('engine');
//                     }}
//                   >SELFIE MODE</button>
//                   <button className="vto-btn-black" onClick={() => { setMode('photo'); setVtoStep('instructions'); }}>UPLOAD PHOTO</button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ENGINE – full screen below header, with hero background */}
//         {vtoStep === 'engine' && (
//           <div className='vto-engine-bg-wrapper'>
//             {/* Dark overlay for readability */}
//             <div style={{
//               position: 'absolute',
//               inset: 0,
//               backgroundColor: 'rgba(0,0,0,0.75)',
//               zIndex: 0
//             }} />
//             {/* The original engine workspace, now with transparent background */}
//             <div className="vto-workspace" style={{ background: 'transparent', position: 'relative', zIndex: 1 }}>
//               {!compareMode && (
//                 <div className="vto-engine-sidebar">
//                   {sidePanel === 'types' && (
//                     <div className="vto-sidebar-items">
//                       {loadingTypes ? <div className="vto-spinner-wrap-small"><FaSpinner className="vto-spin" /></div> :
//                         vtoTypes.map((type, i) => (
//                           <div key={i} className={`vto-sidebar-item ${activeType === type ? 'active' : ''}`} onClick={() => handleTypeSelect(type)}>
//                             <div className="vto-sidebar-icon-box">
//                               <img src={type.includes('lip') ? "https://img.icons8.com/color/48/lipstick.png" : "https://img.icons8.com/color/48/makeup.png"} alt={type} className="vto-cat-thumb-img" />
//                             </div>
//                             <span className="vto-sidebar-label">{labelFor(type)}</span>
//                           </div>
//                         ))
//                       }
//                     </div>
//                   )}

//                   {sidePanel === 'products' && (
//                     <div className="vto-sidebar-items vto-sidebar-products">
//                       <div className="vto-sidebar-item" onClick={() => { setActiveType(null); setProducts([]); setSidePanel('types'); }}>
//                         <div className="vto-sidebar-icon-box" style={{ background: 'transparent', border: 'none', color: '#fff' }}><FaChevronLeft size={24} /></div>
//                       </div>
//                       {loadingProducts ? <div className="vto-spinner-wrap-small"><FaSpinner className="vto-spin" /></div> :
//                         products.map((p, i) => (
//                           <div key={p._id || i} className={`vto-sidebar-item ${activeProduct?._id === p._id ? 'active' : ''}`} onClick={() => handleProductSelect(p)}>
//                             <div className="vto-sidebar-icon-box">
//                               <img src={p.image || "https://via.placeholder.com/56"} alt={p.name} className="vto-cat-thumb-img" style={{ borderRadius: '8px' }} />
//                             </div>
//                             <span className="vto-sidebar-label">{p.name || p.brand}</span>
//                           </div>
//                         ))
//                       }
//                     </div>
//                   )}

//                   {sidePanel === 'shades' && (
//                     <div className="vto-sidebar-items vto-sidebar-shades">
//                       <div className="vto-sidebar-item" onClick={() => setSidePanel('products')}>
//                         <div className="vto-sidebar-icon-box" style={{ background: 'transparent', border: 'none', color: '#fff' }}><FaChevronLeft size={24} /></div>
//                       </div>
//                       {loadingShades ? <div className="vto-spinner-wrap-small"><FaSpinner className="vto-spin" /></div> :
//                         shades.map((shade, idx) => (
//                           <div key={shade.sku || idx} className={`vto-sidebar-item ${activeShade === shade.sku ? 'active' : ''}`} onClick={() => applyShade(shade)}>
//                             <div className="vto-sidebar-shade-square" style={{ backgroundColor: shade.hex.startsWith('#') ? shade.hex : '#' + shade.hex }} />
//                             <span className="vto-sidebar-label">{shade.shadeName}</span>
//                           </div>
//                         ))
//                       }
//                     </div>
//                   )}
//                   <div className="vto-sidebar-divider"></div>
//                 </div>
//               )}

//               <div
//                 className="vto-canvas-container"
//                 onMouseDown={compareMode ? handleBaDragStart : undefined}
//                 onMouseMove={compareMode ? handleBaDragMove : undefined}
//                 onMouseUp={compareMode ? handleBaDragEnd : undefined}
//                 onMouseLeave={compareMode ? handleBaDragEnd : undefined}
//                 onTouchStart={compareMode ? handleBaDragStart : undefined}
//                 onTouchMove={compareMode ? handleBaDragMove : undefined}
//                 onTouchEnd={compareMode ? handleBaDragEnd : undefined}
//                 style={{ position: 'relative', overflow: 'hidden', cursor: compareMode ? (isDragging ? 'ew-resize' : 'pointer') : 'default' }}
//               >
//                 <div className="vto-ba-before-layer" style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 1 }}>
//                   {mode === 'live' && <Webcam ref={webcamRef} audio={false} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} videoConstraints={{ facingMode: "user" }} />}
//                   {mode === 'photo' && uploadedImage && <img ref={imageRef} src={uploadedImage} alt="Uploaded" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
//                 </div>
//                 <canvas
//                   ref={canvasRef}
//                   className="vto-main-canvas"
//                   style={{
//                     position: 'absolute', inset: 0, width: '100%', height: '100%',
//                     objectFit: mode === 'photo' ? 'contain' : 'cover',
//                     transform: mode === 'live' ? 'scaleX(-1)' : 'none',
//                     clipPath: compareMode ? `inset(0 ${100 - (baPos * 100)}% 0 0)` : 'none',
//                     zIndex: 2,
//                     pointerEvents: compareMode ? 'none' : 'auto'
//                   }}
//                 />
//                 {compareMode && (
//                   <>
//                     <div className="vto-compare-labels">
//                       <button className="vto-compare-pill vto-pill-left" onClick={() => setCompareMode(false)}>BEFORE</button>
//                       <button className="vto-compare-pill vto-pill-right" onClick={() => setCompareMode(false)}>AFTER</button>
//                     </div>
//                     <div className="ba-divider" style={{ position: 'absolute', top: 0, bottom: 0, width: '2px', background: 'rgba(255,255,255,0.7)', left: `${baPos * 100}%`, zIndex: 10, transform: 'translateX(-50%)', pointerEvents: 'none' }}></div>
//                     <div className="ba-handle-bottom" style={{ position: 'absolute', bottom: '8%', left: `${baPos * 100}%`, transform: 'translateX(-50%)', zIndex: 11, display: 'flex', gap: '4px', pointerEvents: 'none' }}>
//                       <div style={{ width: '4px', height: '32px', background: 'rgba(255,255,255,0.9)', borderRadius: '2px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}></div>
//                       <div style={{ width: '4px', height: '32px', background: 'rgba(255,255,255,0.9)', borderRadius: '2px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}></div>
//                     </div>
//                   </>
//                 )}
//                 <div className="vto-status" style={{ zIndex: 20 }}>{statusMsg}</div>
//               </div>

//               {!compareMode && (
//                 <div className="vto-intensity-slider-wrap">
//                   <div className="vto-slider-track-thin">
//                     <input type="range" className="vto-vertical-slider-thin" min="0" max="100" value={intensity} onChange={handleIntensityChange} />
//                   </div>
//                   <div className="vto-slider-icon">
//                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                       <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="white" />
//                     </svg>
//                   </div>
//                 </div>
//               )}

//               {!compareMode && (
//                 <div className="vto-top-controls-v2">
//                   <button className="vto-compare-btn" onClick={() => setCompareMode(true)}>COMPARE</button>
//                   <button className="vto-instr-icon-btn vto-close-btn-v2" onClick={goBackToLandingWithScroll}><FaTimes /></button>
//                 </div>
//               )}

//               <div className="vto-bottom-controls-v2">
//                 <button className="vto-download-btn-v2" onClick={downloadImage}>
//                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M19 15V19H5V15H3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V15H19ZM13 12.67L15.59 10.09L17 11.5L12 16.5L7 11.5L8.41 10.09L11 12.67V3H13V12.67Z" fill="white" />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* INSTRUCTIONS SCREEN – kept as a modal for consistency */}
//         {vtoStep === 'instructions' && (
//           <div className="vto-instructions-screen">
//             <div className="vto-instr-card">
//               <div className="vto-instr-header">
//                 <button className="vto-instr-icon-btn" onClick={goBackToLandingWithScroll}><FaChevronLeft /></button>
//                 <div className="vto-instr-brand">
//                   <div className="vto-instr-brand-text">JOYORY<span>BEAUTY</span></div>
//                 </div>
//                 <button className="vto-instr-icon-btn" onClick={goBackToLandingWithScroll}><FaTimes /></button>
//               </div>
//               <div className="vto-instr-content">
//                 <h2 className="vto-instr-title">PHOTO INSTRUCTIONS</h2>
//                 <div className="vto-instr-list">
//                   <div className="vto-instr-item"><div className="vto-instr-icon-box"></div><p>Use a Photo that is of the face straight on.</p></div>
//                   <div className="vto-instr-item"><div className="vto-instr-icon-box"></div><p>Make Sure Nothing Is Obstructing The Face.</p></div>
//                   <div className="vto-instr-item"><div className="vto-instr-icon-box"></div><p>Make Sure That The Lighting Is Not Too Dim Or Too Bright.</p></div>
//                 </div>
//               </div>
//               <div className="vto-instr-footer">
//                 <button className="vto-btn-black-rect" onClick={() => fileInputRef.current?.click()}>UPLOAD PHOTO</button>
//                 <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" style={{ display: 'none' }} />
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MainVirtualTryon;






































// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import Webcam from 'react-webcam';
// import axios from 'axios';
// import {
//   FaCamera, FaImage, FaDownload, FaChevronLeft, FaChevronRight,
//   FaTimes, FaSpinner, FaHistory, FaCheckCircle
// } from 'react-icons/fa';
// import { FaceMesh } from '@mediapipe/face_mesh';
// import { Camera } from '@mediapipe/camera_utils';
// import '../css/Mainvirtualtryon.css';

// import Header from './Header';
// import vtoHero from "../assets/vto_hero.png";
// import vtoFirst from '../assets/VTO_FIRST.png';

// // ── Landmark indices (unchanged) ──────────────────────────────
// const LIP_OUTER = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17, 84, 181, 91, 146];
// const LIP_INNER = [78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95];
// const LEYE_UPPER = [33, 246, 161, 160, 159, 158, 157, 173, 133];
// const REYE_UPPER = [263, 466, 388, 387, 386, 385, 384, 398, 362];
// const LEYE_LOWER = [133, 155, 154, 153, 145, 144, 163, 7, 33];
// const REYE_LOWER = [362, 382, 381, 380, 374, 373, 390, 249, 263];

// const LBROW_TOP = [70, 63, 105, 66, 107];
// const LBROW_BOT = [46, 53, 52, 65, 55];
// const RBROW_TOP = [336, 296, 334, 293, 300];
// const RBROW_BOT = [276, 283, 282, 295, 285];
// const LBROW = [...LBROW_TOP, ...[...LBROW_BOT].reverse()];
// const RBROW = [...RBROW_TOP, ...[...RBROW_BOT].reverse()];

// const FACE = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];

// const LCHECK = [117, 118, 119, 120, 121, 123, 147, 213, 192, 234];
// const RCHECK = [346, 347, 348, 349, 350, 352, 376, 433, 416, 454];

// function pt(lms, i, w, h) { return { x: lms[i].x * w, y: lms[i].y * h }; }
// function hexRgb(h) {
//   if (!h || h === 'none') return [0, 0, 0];
//   const c = h.replace('#', '');
//   return [parseInt(c.slice(0, 2), 16) || 0, parseInt(c.slice(2, 4), 16) || 0, parseInt(c.slice(4, 6), 16) || 0];
// }

// function catmullSmooth(pts, steps = 14) {
//   const out = [];
//   for (let i = 0; i < pts.length - 1; i++) {
//     const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
//     for (let s = 0; s < steps; s++) {
//       const t = s / steps, t2 = t * t, t3 = t2 * t;
//       out.push({
//         x: .5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
//         y: .5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3)
//       });
//     }
//   }
//   out.push(pts[pts.length - 1]); return out;
// }

// function drawBrow(ctx, lms, browI, color, alpha, style, thickMul, w, h) {
//   if (!color || color === 'none') return;
//   const [r, g, b] = hexRgb(color);
//   const off = document.createElement('canvas'); off.width = w; off.height = h;
//   const ox = off.getContext('2d');
//   const half = Math.floor(browI.length / 2);
//   let tPts = browI.slice(0, half).map(i => pt(lms, i, w, h)).sort((a, b) => a.x - b.x);
//   let bPts = browI.slice(half).map(i => pt(lms, i, w, h)).sort((a, b) => a.x - b.x);
//   let pts = [...tPts, ...bPts.reverse()];
//   const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
//   const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
//   const scaleY = 0.90 + (thickMul * 0.45);
//   const scaleX = 1.00 + (thickMul * 0.08);
//   pts = pts.map(p => ({ x: cx + (p.x - cx) * scaleX, y: cy + (p.y - cy) * scaleY }));
//   ox.beginPath();
//   const last = pts[pts.length - 1];
//   ox.moveTo((pts[0].x + last.x) / 2, (pts[0].y + last.y) / 2);
//   for (let i = 0; i < pts.length; i++) {
//     const p1 = pts[i], p2 = pts[(i + 1) % pts.length];
//     ox.quadraticCurveTo(p1.x, p1.y, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
//   }
//   ox.closePath();
//   let opMul = 1.0, blurAmt = 1.6;
//   if (style === 'feathered') { opMul = 0.60; blurAmt = 1.4; }
//   else if (style === 'bold') { opMul = 0.95; blurAmt = 0.8; }
//   else if (style === 'defined') { opMul = 0.85; blurAmt = 0.7; }
//   else { opMul = 0.75; blurAmt = 1.8; }
//   ox.fillStyle = `rgb(${r},${g},${b})`; ox.fill();
//   ctx.save();
//   ctx.globalCompositeOperation = 'multiply'; ctx.filter = `blur(${blurAmt}px)`; ctx.globalAlpha = Math.min(alpha * opMul * 1.5, 0.95); ctx.drawImage(off, 0, 0);
//   ctx.globalCompositeOperation = 'source-over'; ctx.filter = `blur(${blurAmt * 0.35}px)`; ctx.globalAlpha = alpha * opMul * 0.4; ctx.drawImage(off, 0, 0);
//   ctx.restore();
// }

// function drawBlush(ctx, lms, checkI, color, alpha, w, h) {
//   if (!color || alpha <= 0) return;
//   const pts = checkI.map(i => pt(lms, i, w, h));
//   const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
//   const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
//   const faceL = pt(lms, 234, w, h), faceR = pt(lms, 454, w, h);
//   const faceW = Math.max(Math.abs(faceR.x - faceL.x), 60);
//   const isLeft = checkI.includes(234);
//   const templePt = isLeft ? faceL : faceR;
//   const sweepAngle = Math.atan2(templePt.y - cy, templePt.x - cx);
//   const rx = faceW * 0.28, ry = faceW * 0.12;
//   const [r, g, b] = hexRgb(color);
//   const off = document.createElement('canvas'); off.width = w; off.height = h;
//   const ox = off.getContext('2d');
//   ox.save(); ox.translate(cx, cy); ox.rotate(sweepAngle);
//   ox.filter = `blur(${rx * 0.20}px)`; ox.scale(1, ry / rx);
//   const gr = ox.createRadialGradient(-rx * 0.15, 0, 0, 0, 0, rx);
//   gr.addColorStop(0.00, `rgba(${r},${g},${b},${alpha * 1.8})`);
//   gr.addColorStop(0.40, `rgba(${r},${g},${b},${alpha * 0.7})`);
//   gr.addColorStop(1.00, `rgba(${r},${g},${b},0)`);
//   ox.fillStyle = gr; ox.beginPath(); ox.arc(0, 0, rx * 1.1, 0, Math.PI * 2); ox.fill(); ox.restore();
//   ox.globalCompositeOperation = 'destination-out'; ox.filter = 'blur(4px)';
//   const eyeHole = (isLeft ? LEYE_LOWER : REYE_LOWER).map(i => pt(lms, i, w, h));
//   ox.beginPath(); ox.ellipse(eyeHole[4].x, eyeHole[4].y - faceW * 0.015, faceW * 0.14, faceW * 0.06, 0, 0, Math.PI * 2); ox.fill();
//   const luma = (0.299 * r + 0.587 * g + 0.114 * b);
//   const isSuperDark = luma < 60;
//   ctx.save();
//   ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = isSuperDark ? 0.85 : 0.35; ctx.drawImage(off, 0, 0);
//   ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = isSuperDark ? 0.3 : 0.65; ctx.drawImage(off, 0, 0);
//   ctx.restore();
// }

// function drawEyeliner(ctx, lms, eyeUpperI, eyeLowerI, color, alpha, style, placement, w, h) {
//   if (!color || color === 'none' || style === 'none') return;
//   const [r, g, b] = hexRgb(color);
//   const isLeft = eyeUpperI.includes(33);
//   const innerCorner = isLeft ? 133 : 362;
//   let rawUp = eyeUpperI.map(i => pt(lms, i, w, h)), rawLo = eyeLowerI.map(i => pt(lms, i, w, h));
//   if (eyeUpperI[0] !== innerCorner) rawUp.reverse();
//   if (eyeLowerI[0] !== innerCorner) rawLo.reverse();
//   const smUp = catmullSmooth(rawUp, 18), smLo = catmullSmooth(rawLo, 18);
//   const allPts = [...smUp, ...smLo];
//   const cx = allPts.reduce((s, p) => s + p.x, 0) / allPts.length, cy = allPts.reduce((s, p) => s + p.y, 0) / allPts.length;
//   const eyeW = Math.sqrt(Math.pow(smUp[smUp.length - 1].x - smUp[0].x, 2) + Math.pow(smUp[smUp.length - 1].y - smUp[0].y, 2)) || 10;
//   const SP = {
//     thin: { th: 0.06, wingLen: 0, wingLift: 0, lo: false, smoky: false, tight: false },
//     cat: { th: 0.09, wingLen: 0.17, wingLift: 0.14, lo: false, smoky: false, tight: false },
//     medium: { th: 0.12, wingLen: 0.12, wingLift: 0.08, lo: false, smoky: false, tight: false },
//     dramatic: { th: 0.20, wingLen: 0.32, wingLift: 0.25, lo: true, smoky: false, tight: false },
//     smoky: { th: 0.20, wingLen: 0, wingLift: 0, lo: true, smoky: true, tight: false },
//     tightline: { th: 0.03, wingLen: 0, wingLift: 0, lo: false, smoky: false, tight: true }
//   };
//   const sp = SP[style] || SP.thin;
//   const linerThickMul = 1.0;
//   const baseThick = Math.max(eyeW * sp.th * linerThickMul, 1.2);

//   const drawLinerCurve = (curve, isUpper) => {
//     const sn = curve.length;
//     const pts = curve.map((p, i) => {
//       const prev = curve[Math.max(0, i - 1)], next = curve[Math.min(sn - 1, i + 1)];
//       const tx = next.x - prev.x, ty = next.y - prev.y;
//       const len = Math.sqrt(tx * tx + ty * ty) || 1;
//       const nx1 = -ty / len, ny1 = tx / len, nx2 = ty / len, ny2 = -tx / len;
//       const d1 = (p.x + nx1 - cx) ** 2 + (p.y + ny1 - cy) ** 2, d2 = (p.x + nx2 - cx) ** 2 + (p.y + ny2 - cy) ** 2;
//       const nx = d1 > d2 ? nx1 : nx2, ny = d1 > d2 ? ny1 : ny2;
//       const t = i / (sn - 1);
//       let tFct = isUpper ? (sp.smoky ? 0.1 + 0.9 * Math.pow(t, 0.8) : style === 'dramatic' ? 0.05 + 0.95 * Math.pow(t, 2.2) : style === 'cat' ? 0.05 + 0.95 * Math.pow(t, 1.5) : t < 0.25 ? Math.pow(t / 0.25, 1.5) : 1) : (sp.smoky ? 0.05 + 0.85 * t : style === 'dramatic' ? 0.02 + 0.55 * Math.pow(t, 1.5) : 0.02 + 0.4 * t);
//       if (!isUpper && t > 0.85) tFct *= (1 - ((t - 0.85) / 0.15) * 0.9);
//       const pxThick = baseThick * tFct * (isUpper ? 1 : 0.5);
//       return { x: p.x + nx * pxThick, y: p.y + ny * pxThick, nx, ny };
//     });
//     const off = document.createElement('canvas'); off.width = w; off.height = h; const ox = off.getContext('2d');
//     ox.fillStyle = `rgb(${r},${g},${b})`; ox.beginPath();
//     curve.forEach((p, i) => i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y));
//     if (isUpper && sp.wingLen > 0) {
//       const lookIdx = Math.max(0, sn - 4);
//       const wx = curve[sn - 1].x - curve[lookIdx].x, wy = curve[sn - 1].y - curve[lookIdx].y;
//       const wLen = Math.sqrt(wx * wx + wy * wy) || 1, uX = wx / wLen, uY = wy / wLen;
//       const outerTip = pts[sn - 1];
//       const targetX = curve[sn - 1].x + uX * eyeW * sp.wingLen + outerTip.nx * eyeW * sp.wingLift;
//       const targetY = curve[sn - 1].y + uY * eyeW * sp.wingLen + outerTip.ny * eyeW * sp.wingLift;
//       const cpX = curve[sn - 1].x + uX * eyeW * sp.wingLen * 0.4, cpY = curve[sn - 1].y + uY * eyeW * sp.wingLen * 0.4;
//       ox.quadraticCurveTo(cpX, cpY, targetX, targetY); ox.lineTo(outerTip.x, outerTip.y);
//     }
//     [...pts].reverse().forEach(p => ox.lineTo(p.x, p.y)); ox.closePath(); ox.fill();
//     ctx.save();
//     if (sp.smoky) {
//       ctx.globalCompositeOperation = 'multiply'; ctx.filter = `blur(${baseThick * 1.5}px)`; ctx.globalAlpha = Math.min(alpha * 1.2, 0.9); ctx.drawImage(off, 0, 0);
//       ctx.filter = `blur(${baseThick * 0.7}px)`; ctx.globalAlpha = Math.min(alpha * 0.8, 0.9); ctx.drawImage(off, 0, 0);
//       ctx.globalCompositeOperation = 'source-over'; ctx.filter = `blur(${baseThick * 0.2}px)`; ctx.globalAlpha = alpha * 0.4; ctx.drawImage(off, 0, 0);
//     } else {
//       ctx.globalCompositeOperation = 'multiply'; ctx.filter = 'blur(1.2px)'; ctx.globalAlpha = Math.min(alpha * 1.2, 0.95); ctx.drawImage(off, 0, 0);
//       ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'blur(0.4px)'; ctx.globalAlpha = alpha * 0.85; ctx.drawImage(off, 0, 0);
//     }
//     ctx.restore();
//   };

//   if (sp.tight) {
//     ctx.save(); ctx.strokeStyle = `rgba(${r},${g},${b},${alpha * 0.85})`; ctx.lineWidth = Math.max(eyeW * 0.025, 1.2);
//     ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.filter = 'blur(0.6px)'; ctx.beginPath();
//     smUp.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.stroke(); ctx.restore();
//     if (placement === 'both' || placement === 'lower') drawLinerCurve(smLo, false);
//     return;
//   }
//   if (placement === 'upper') { drawLinerCurve(smUp, true); if (sp.lo) drawLinerCurve(smLo, false); }
//   else if (placement === 'lower') drawLinerCurve(smLo, false);
//   else { drawLinerCurve(smUp, true); drawLinerCurve(smLo, false); }
// }

// function drawLips(ctx, lms, color, alpha, w, h) {
//   if (!color || color === 'none') return;
//   const [r, g, b] = hexRgb(color);
//   const off = document.createElement('canvas'); off.width = w; off.height = h; const ox = off.getContext('2d');
//   ox.beginPath();
//   LIP_OUTER.forEach((id, i) => { const p = pt(lms, id, w, h); i === 0 ? ox.moveTo(p.x, p.y) : ox.lineTo(p.x, p.y); });
//   ox.closePath();
//   [...LIP_INNER].reverse().forEach((id, i) => { const p = pt(lms, id, w, h); i === 0 ? ox.moveTo(p.x, p.y) : ox.lineTo(p.x, p.y); });
//   ox.closePath();
//   ox.fillStyle = `rgb(${r},${g},${b})`; ox.fill();
//   ctx.save();
//   ctx.globalCompositeOperation = 'multiply'; ctx.filter = 'blur(1.8px)'; ctx.globalAlpha = Math.min(alpha * 0.9, 0.85); ctx.drawImage(off, 0, 0);
//   ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'none'; ctx.globalAlpha = alpha * 0.35; ctx.drawImage(off, 0, 0);
//   ctx.restore();
// }

// function drawFoundation(ctx, lms, color, alpha, w, h) {
//   if (!color || color === 'none' || alpha <= 0) return;
//   const [r, g, b] = hexRgb(color);
//   const off = document.createElement('canvas'); off.width = w; off.height = h; const ox = off.getContext('2d');
//   ox.filter = 'blur(10px)'; ox.fillStyle = `rgb(${r},${g},${b})`; ox.beginPath();
//   FACE.forEach((id, i) => { const p = pt(lms, id, w, h); i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y); });
//   ox.closePath(); ox.fill();
//   ox.globalCompositeOperation = 'destination-out'; ox.fillStyle = '#fff'; ox.filter = 'blur(3.5px)'; ox.beginPath();
//   [...LEYE_UPPER, ...[...LEYE_LOWER].reverse()].forEach((id, i) => { const p = pt(lms, id, w, h); i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y); }); ox.closePath(); ox.fill();
//   ox.beginPath(); [...REYE_UPPER, ...[...REYE_LOWER].reverse()].forEach((id, i) => { const p = pt(lms, id, w, h); i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y); }); ox.closePath(); ox.fill();
//   ox.filter = 'blur(2px)'; ox.beginPath(); LIP_OUTER.forEach((id, i) => { const p = pt(lms, id, w, h); i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y); }); ox.closePath(); ox.fill();
//   ox.filter = 'blur(5px)'; ox.globalAlpha = 0.9; ox.beginPath(); LBROW.forEach((id, i) => { const p = pt(lms, id, w, h); i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y); }); ox.closePath(); ox.fill();
//   ox.beginPath(); RBROW.forEach((id, i) => { const p = pt(lms, id, w, h); i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y); }); ox.closePath(); ox.fill();
//   ctx.save();
//   ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = Math.min(alpha * 0.95, 0.85); ctx.drawImage(off, 0, 0);
//   ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = alpha * 0.55; ctx.drawImage(off, 0, 0);
//   ctx.restore();
// }

// function applyMakeup(ctx, lms, w, h, S) {
//   if (S.fOn) drawFoundation(ctx, lms, S.foundC, S.fOp, w, h);
//   if (S.blushC) { drawBlush(ctx, lms, LCHECK, S.blushC, S.blushOp, w, h); drawBlush(ctx, lms, RCHECK, S.blushC, S.blushOp, w, h); }
//   drawBrow(ctx, lms, LBROW, S.browC, S.browOp, S.browStyle, S.browThick, w, h);
//   drawBrow(ctx, lms, RBROW, S.browC, S.browOp, S.browStyle, S.browThick, w, h);
//   drawEyeliner(ctx, lms, LEYE_UPPER, LEYE_LOWER, S.linerC, S.linerOp, S.linerStyle, S.linerPlacement, w, h);
//   drawEyeliner(ctx, lms, REYE_UPPER, REYE_LOWER, S.linerC, S.linerOp, S.linerStyle, S.linerPlacement, w, h);
//   drawLips(ctx, lms, S.lipC, S.lOp, w, h);
// }

// function applyAdaptiveSmoothing(newLms, prevLms, w, h) {
//   if (!prevLms) return newLms.map(p => ({ ...p }));
//   let totalDist = 0;
//   const anchors = [4, 152, 33, 263, 61, 291];
//   anchors.forEach(idx => {
//     const dx = (newLms[idx].x - prevLms[idx].x) * w;
//     const dy = (newLms[idx].y - prevLms[idx].y) * h;
//     totalDist += Math.sqrt(dx * dx + dy * dy);
//   });
//   const avgDist = totalDist / anchors.length;
//   let dynFactor = 0.75;
//   if (avgDist > 8) dynFactor = 0.0;
//   else if (avgDist > 1) dynFactor = 0.75 * (1 - ((avgDist - 1) / 7));
//   return newLms.map((p, i) => ({
//     x: prevLms[i].x * dynFactor + p.x * (1 - dynFactor),
//     y: prevLms[i].y * dynFactor + p.y * (1 - dynFactor),
//     z: prevLms[i].z !== undefined ? (prevLms[i].z * dynFactor + p.z * (1 - dynFactor)) : p.z
//   }));
// }
// // ─────────────────────────────────────────────────────────────────────────────

// const MainVirtualTryon = () => {
//   const [vtoStep, setVtoStep] = useState('landing');
//   const [mode, setMode] = useState(null);
//   const [activeType, setActiveType] = useState(null);
//   const [activeProduct, setActiveProduct] = useState(null);
//   const [activeShade, setActiveShade] = useState(null);
//   const [intensity, setIntensity] = useState(80);
//   const [compareMode, setCompareMode] = useState(false);
//   const [baPos, setBaPos] = useState(0.5);
//   const [isDragging, setIsDragging] = useState(false);
//   const [statusMsg, setStatusMsg] = useState('Initializing...');

//   const [vtoTypes, setVtoTypes] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [shades, setShades] = useState([]);
//   const [loadingTypes, setLoadingTypes] = useState(false);
//   const [loadingProducts, setLoadingProducts] = useState(false);
//   const [loadingShades, setLoadingShades] = useState(false);

//   // ── DYNAMIC LANDING IMAGES FROM BACKEND ─────────────────────────────
//   const [landingImages, setLandingImages] = useState({
//     heroBanner: null,      // vtoHero replacement
//     cardBackground: null,  // vtoFirst replacement
//     phoneView: null,       // phone frame image
//     stepImages: []         // step cards images [step1, step2, step3]
//   });
//   const [loadingLandingImages, setLoadingLandingImages] = useState(false);
//   // ────────────────────────────────────────────────────────────────────

//   const webcamRef = useRef(null);
//   const canvasRef = useRef(null);
//   const imageRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const [sidePanel, setSidePanel] = useState('types');
//   const [uploadedImage, setUploadedImage] = useState(null);

//   const S = useRef({
//     lipC: 'none', lOp: 0.8,
//     linerC: 'none', linerStyle: 'thin', linerPlacement: 'upper', linerOp: 0.85, linerThick: 1.0,
//     browC: 'none', browStyle: 'natural', browOp: 0.55, browThick: 0.55,
//     foundC: '#fce9d8', fOn: false, fOp: 0.18,
//     blushC: null, blushOp: 0.8
//   });
//   const smoothedLms = useRef(null);
//   const faceMeshRef = useRef(null);
//   const cameraRef = useRef(null);

//   // Load types
//   useEffect(() => {
//     const fetchTypes = async () => {
//       setLoadingTypes(true);
//       try {
//         const res = await axios.get('https://beauty.joyory.com/api/vto/workflow');
//         setVtoTypes(res.data.types || []);
//       } catch (err) {
//         console.error("Error fetching types", err);
//       } finally {
//         setLoadingTypes(false);
//         setStatusMsg('Ready ✓');
//       }
//     };
//     fetchTypes();
//   }, []);



//   useEffect(() => {
//   const handleResize = () => {
//     if (compareMode && canvasRef.current) {
//       // Force re-render of canvas
//       const canvas = canvasRef.current;
//       if (faceMeshRef.current && mode === 'photo' && uploadedImage) {
//         const img = new Image();
//         img.onload = () => faceMeshRef.current.send({ image: img });
//         img.src = uploadedImage;
//       }
//     }
//   };

//   window.addEventListener('resize', handleResize);
//   return () => window.removeEventListener('resize', handleResize);
// }, [compareMode, mode, uploadedImage]);

//   // ── FETCH DYNAMIC LANDING IMAGES FROM BACKEND ───────────────────────
//   useEffect(() => {
//     const fetchLandingImages = async () => {
//       setLoadingLandingImages(true);
//       try {
//         const res = await axios.get('https://beauty.joyory.com/api/vto/workflow?section=landing');
//         const data = res.data;
//         setLandingImages({
//           heroBanner: data.heroBanner || data.landing?.heroBanner || null,
//           cardBackground: data.cardBackground || data.landing?.cardBackground || null,
//           phoneView: data.phoneView || data.landing?.phoneView || null,
//           stepImages: data.stepImages || data.landing?.stepImages || []
//         });
//       } catch (err) {
//         console.error("Error fetching landing images", err);
//       } finally {
//         setLoadingLandingImages(false);
//       }
//     };
//     fetchLandingImages();
//   }, []);

//   // Track previous step to avoid scrolling on initial mount
//   const prevStepRef = useRef(vtoStep);
//   useEffect(() => {
//     prevStepRef.current = vtoStep;
//   }, [vtoStep]);

//   // Scroll to the landing card every time we come BACK to landing
//   useEffect(() => {
//     if (vtoStep === 'landing' && prevStepRef.current !== 'landing') {
//       setTimeout(() => {
//         const el = document.getElementById('main-backe-2');
//         if (el) {
//           el.scrollIntoView({ behavior: 'smooth', block: 'center' });
//         }
//       }, 50);
//     }
//   }, [vtoStep]);

//   useEffect(() => {
//     const handlePopState = () => {
//       setVtoStep('landing');
//     };
//     window.addEventListener("popstate", handlePopState);
//     return () => window.removeEventListener("popstate", handlePopState);
//   }, []);

//   // Initialize MediaPipe FaceMesh
//   useEffect(() => {
//     if (vtoStep === 'engine') {
//       try {
//         const faceMesh = new FaceMesh({
//           locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`,
//         });
//         faceMesh.setOptions({
//           maxNumFaces: 1,
//           refineLandmarks: true,
//           minDetectionConfidence: 0.5,
//           minTrackingConfidence: 0.5
//         });

//         faceMesh.onResults((results) => {
//           const canvas = canvasRef.current;
//           if (!canvas) return;
//           const ctx = canvas.getContext('2d');
//           const videoWidth = results.image.width;
//           const videoHeight = results.image.height;
//           canvas.width = videoWidth;
//           canvas.height = videoHeight;
//           ctx.clearRect(0, 0, canvas.width, canvas.height);

//           ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

//           if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
//             let lms = results.multiFaceLandmarks[0];
//             if (mode === 'live') {
//               lms = applyAdaptiveSmoothing(lms, smoothedLms.current, canvas.width, canvas.height);
//               smoothedLms.current = lms;
//             }
//             applyMakeup(ctx, lms, canvas.width, canvas.height, S.current);
//           } else {
//             if (mode === 'live') smoothedLms.current = null;
//           }
//         });

//         faceMeshRef.current = faceMesh;

//         if (mode === 'live') {
//           if (webcamRef.current && webcamRef.current.video) {
//             const camera = new Camera(webcamRef.current.video, {
//               onFrame: async () => {
//                 if (webcamRef.current?.video && faceMeshRef.current) {
//                   await faceMeshRef.current.send({ image: webcamRef.current.video });
//                 }
//               },
//               width: 640,
//               height: 480
//             });
//             camera.start();
//             cameraRef.current = camera;
//             setStatusMsg('Live Mode Active');
//           } else {
//             setTimeout(() => {
//               if (webcamRef.current && webcamRef.current.video) {
//                 const camera = new Camera(webcamRef.current.video, {
//                   onFrame: async () => {
//                     if (webcamRef.current?.video && faceMeshRef.current) {
//                       await faceMeshRef.current.send({ image: webcamRef.current.video });
//                     }
//                   },
//                   width: 640,
//                   height: 480
//                 });
//                 camera.start();
//                 cameraRef.current = camera;
//                 setStatusMsg('Live Mode Active');
//               }
//             }, 1000);
//           }
//         }
//       } catch (err) {
//         console.error("FaceMesh initialization error", err);
//       }
//     } else {
//       if (cameraRef.current) { cameraRef.current.stop(); cameraRef.current = null; }
//       if (faceMeshRef.current) { faceMeshRef.current.close(); faceMeshRef.current = null; }
//     }
//     return () => {
//       if (cameraRef.current) cameraRef.current.stop();
//       if (faceMeshRef.current) faceMeshRef.current.close();
//     }
//   }, [vtoStep, mode]);

//   // Handle Photo Mode static analysis
//   useEffect(() => {
//     if (vtoStep === 'engine' && mode === 'photo' && uploadedImage && faceMeshRef.current) {
//       setStatusMsg('Processing Photo...');
//       const img = new Image();
//       img.onload = async () => {
//         try {
//           await faceMeshRef.current.send({ image: img });
//           setStatusMsg('Photo Ready!');
//         } catch (e) {
//           console.error(e);
//         }
//       };
//       img.src = uploadedImage;
//     }
//   }, [vtoStep, mode, uploadedImage]);

//   const handleTypeSelect = async (type) => {
//     setActiveType(type);
//     setSidePanel('products');
//     setLoadingProducts(true);
//     try {
//       const res = await axios.get(`https://beauty.joyory.com/api/vto/workflow?type=${type}`);
//       setProducts(res.data.products || []);
//     } catch (err) {
//       console.error("Error fetching products", err);
//     } finally {
//       setLoadingProducts(false);
//     }
//   };

//   const handleProductSelect = async (product) => {
//     setActiveProduct(product);
//     setSidePanel('shades');
//     setLoadingShades(true);
//     try {
//       const res = await axios.get(`https://beauty.joyory.com/api/vto/workflow?productId=${product._id}`);
//       setShades(res.data.product?.shades || []);
//     } catch (err) {
//       console.error("Error fetching shades", err);
//     } finally {
//       setLoadingShades(false);
//     }
//   };

//   const applyShade = (shade) => {
//     setActiveShade(shade.sku || shade._id || shade.name);
//     let hex = shade.hex || shade.color;
//     if (!hex) return;
//     if (!hex.startsWith('#')) hex = '#' + hex;

//     const type = (activeType || '').toLowerCase();
//     if (type.includes('lip')) { S.current.lipC = hex; }
//     else if (type.includes('eye') && !type.includes('brow')) { S.current.linerC = hex; }
//     else if (type.includes('found')) { S.current.foundC = hex; S.current.fOn = true; }
//     else if (type.includes('blush')) { S.current.blushC = hex; }
//     else if (type.includes('brow')) { S.current.browC = hex; }

//     if (mode === 'photo' && faceMeshRef.current && uploadedImage) {
//       const img = new Image();
//       img.onload = async () => { await faceMeshRef.current.send({ image: img }); };
//       img.src = uploadedImage;
//     }
//   };

//   const handleIntensityChange = (e) => {
//     const val = parseInt(e.target.value, 10);
//     setIntensity(val);
//     const alpha = val / 100;
//     const type = (activeType || '').toLowerCase();
//     if (type.includes('lip')) { S.current.lOp = alpha; }
//     else if (type.includes('eye') && !type.includes('brow')) { S.current.linerOp = alpha; }
//     else if (type.includes('found')) { S.current.fOp = alpha; }
//     else if (type.includes('blush')) { S.current.blushOp = alpha; }
//     else if (type.includes('brow')) { S.current.browOp = alpha; }

//     if (mode === 'photo' && faceMeshRef.current && uploadedImage) {
//       const img = new Image();
//       img.onload = async () => { await faceMeshRef.current.send({ image: img }); };
//       img.src = uploadedImage;
//     }
//   };

//   const handlePhotoUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const url = URL.createObjectURL(file);
//       setUploadedImage(url);
//       setMode('photo');
//       setVtoStep('engine');
//     }
//   };

//   const downloadImage = () => {
//     const canvas = canvasRef.current;
//     if (canvas) {
//       const link = document.createElement('a');
//       link.download = 'joyory-vto.png';
//       link.href = canvas.toDataURL();
//       link.click();
//     }
//   };

//   const labelFor = (type) => {
//     if (!type) return "";
//     return type.charAt(0).toUpperCase() + type.slice(1);
//   };

//   const handleBaDragStart = (e) => {
//     if (!compareMode) return;
//     setIsDragging(true);
//     handleBaDragCalc(e);
//   };

//   const handleBaDragEnd = () => {
//     if (!compareMode) return;
//     setIsDragging(false);
//   };

//   const handleBaDragMove = (e) => {
//     if (!compareMode || !isDragging) return;
//     handleBaDragCalc(e);
//   };

//   // const handleBaDragCalc = (e) => {
//   //   const container = e.currentTarget;
//   //   const rect = container.getBoundingClientRect();
//   //   let clientX;
//   //   if (e.touches && e.touches.length > 0) {
//   //     clientX = e.touches[0].clientX;
//   //   } else if (e.clientX !== undefined) {
//   //     clientX = e.clientX;
//   //   } else {
//   //     return;
//   //   }
//   //   let newPos = (clientX - rect.left) / rect.width;
//   //   newPos = Math.max(0, Math.min(1, newPos));
//   //   setBaPos(newPos);
//   // };



//   const handleBaDragCalc = (e) => {
//   const container = e.currentTarget || document.querySelector('.vto-canvas-container');
//   if (!container) return;

//   const rect = container.getBoundingClientRect();
//   let clientX = e.clientX || (e.touches && e.touches[0].clientX);

//   if (clientX === undefined) return;

//   let newPos = (clientX - rect.left) / rect.width;
//   newPos = Math.max(0.05, Math.min(0.95, newPos)); // avoid edges
//   setBaPos(newPos);
// };


//   const goBackToLandingWithScroll = useCallback(() => {
//     if (cameraRef.current) {
//       cameraRef.current.stop();
//       cameraRef.current = null;
//     }
//     if (faceMeshRef.current) {
//       faceMeshRef.current.close();
//       faceMeshRef.current = null;
//     }
//     setCompareMode(false);
//     setMode(null);
//     setActiveType(null);
//     setActiveProduct(null);
//     setActiveShade(null);
//     setSidePanel('types');
//     setVtoStep('landing');
//     setTimeout(() => {
//       const el = document.getElementById('main-backe-2');
//       if (el) {
//         el.scrollIntoView({ behavior: 'smooth', block: 'center' });
//       }
//     }, 300);
//   }, []);

//   const getImageSrc = (backendUrl, localFallback) => backendUrl || localFallback;

//   return (
//     <div className={`vto-main-wrapper d-flex ${vtoStep === 'landing' ? 'vto-landing-mode-wrapper' : ''}`}>
//       <div className={`vto-app-container ${vtoStep === 'landing' ? 'vto-landing-mode' : ''}`}>

//         {/* 🟢 HEADER – ALWAYS VISIBLE */}
//         <div className="vto-landing-header-container">
//           <Header />
//         </div>

//         {/* LANDING CONTENT – only when step === 'landing' */}
//         {vtoStep === 'landing' && (
//           <div className="vto-landing-screen-integrated">
//             <div className="vto-bg-layer">
//               <div className="virtualtryon-container-bg">
//                 <header className="hero-section-vto-bg">
//                   <img 
//                     src={getImageSrc(landingImages.heroBanner, vtoHero)} 
//                     alt="Virtual Try On Banner" 
//                     className="hero-banner-img-bg" 
//                   />
//                 </header>
//               </div>
//             </div>

//             <div className="vto-landing-card-container main-backe-2" id="main-backe-2">
//               <div className="vto-landing-bg-box">
//                 <img 
//                   src={getImageSrc(landingImages.cardBackground, vtoFirst)} 
//                   alt="VTO Background" 
//                   className="vto-bg-img img-fluid" 
//                 />
//                 <div className="vto-phone-overlay">
//                   <div className="vto-phone-frame">
//                     <img 
//                       src={getImageSrc(landingImages.phoneView, vtoFirst)} 
//                       alt="VTO Phone View" 
//                       className="vto-phone-img-zoomed" 
//                     />
//                     <div className="vto-phone-scan-corners"></div>
//                     <div className="vto-phone-bottom-strip">
//                       {[1, 2, 3].map(i => <div key={i} className="vto-mini-prod"></div>)}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="vto-landing-content-box">
//                 <h1 className="vto-title-landing">VIRTUAL TRY ON</h1>
//                 <p className="vto-subtitle-landing">For The Best Virtual Try-on Experience, Please Use Safari Or Chrome</p>
//                 <div className="vto-actions-landing">
//                   <button
//                     className="vto-btn-black"
//                     onClick={() => {
//                       window.history.pushState({ vto: true }, "");
//                       setMode('live');
//                       setVtoStep('engine');
//                     }}
//                   >SELFIE MODE</button>
//                   <button className="vto-btn-black" onClick={() => { setMode('photo'); setVtoStep('instructions'); }}>UPLOAD PHOTO</button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ENGINE – full screen below header, with hero background */}
//         {vtoStep === 'engine' && (
//           <div className='vto-engine-bg-wrapper'>
//             {/* Dark overlay for readability */}
//             <div style={{
//               position: 'absolute',
//               inset: 0,
//               backgroundColor: 'rgba(0,0,0,0.75)',
//               zIndex: 0
//             }} />
//             {/* The original engine workspace, now with transparent background */}
//             <div className="vto-workspace" style={{ background: 'transparent', position: 'relative', zIndex: 1 }}>
//               {!compareMode && (
//                 <div className="vto-engine-sidebar">
//                   {sidePanel === 'types' && (
//                     <div className="vto-sidebar-items">
//                       {loadingTypes ? <div className="vto-spinner-wrap-small"><FaSpinner className="vto-spin" /></div> :
//                         vtoTypes.map((type, i) => (
//                           <div key={i} className={`vto-sidebar-item ${activeType === type ? 'active' : ''}`} onClick={() => handleTypeSelect(type)}>
//                             <div className="vto-sidebar-icon-box">
//                               <img src={type.includes('lip') ? "https://img.icons8.com/color/48/lipstick.png" : "https://img.icons8.com/color/48/makeup.png"} alt={type} className="vto-cat-thumb-img" />
//                             </div>
//                             <span className="vto-sidebar-label">{labelFor(type)}</span>
//                           </div>
//                         ))
//                       }
//                     </div>
//                   )}

//                   {sidePanel === 'products' && (
//                     <div className="vto-sidebar-items vto-sidebar-products">
//                       <div className="vto-sidebar-item" onClick={() => { setActiveType(null); setProducts([]); setSidePanel('types'); }}>
//                         <div className="vto-sidebar-icon-box" style={{ background: 'transparent', border: 'none', color: '#fff' }}><FaChevronLeft size={24} /></div>
//                       </div>
//                       {loadingProducts ? <div className="vto-spinner-wrap-small"><FaSpinner className="vto-spin" /></div> :
//                         products.map((p, i) => (
//                           <div key={p._id || i} className={`vto-sidebar-item ${activeProduct?._id === p._id ? 'active' : ''}`} onClick={() => handleProductSelect(p)}>
//                             <div className="vto-sidebar-icon-box">
//                               <img src={p.image || "https://via.placeholder.com/56"} alt={p.name} className="vto-cat-thumb-img" style={{ borderRadius: '8px' }} />
//                             </div>
//                             <span className="vto-sidebar-label">{p.name || p.brand}</span>
//                           </div>
//                         ))
//                       }
//                     </div>
//                   )}

//                   {sidePanel === 'shades' && (
//                     <div className="vto-sidebar-items vto-sidebar-shades">
//                       <div className="vto-sidebar-item" onClick={() => setSidePanel('products')}>
//                         <div className="vto-sidebar-icon-box" style={{ background: 'transparent', border: 'none', color: '#fff' }}><FaChevronLeft size={24} /></div>
//                       </div>
//                       {loadingShades ? <div className="vto-spinner-wrap-small"><FaSpinner className="vto-spin" /></div> :
//                         shades.map((shade, idx) => (
//                           <div key={shade.sku || idx} className={`vto-sidebar-item ${activeShade === shade.sku ? 'active' : ''}`} onClick={() => applyShade(shade)}>
//                             <div className="vto-sidebar-shade-square" style={{ backgroundColor: shade.hex.startsWith('#') ? shade.hex : '#' + shade.hex }} />
//                             <span className="vto-sidebar-label">{shade.shadeName}</span>
//                           </div>
//                         ))
//                       }
//                     </div>
//                   )}
//                   <div className="vto-sidebar-divider"></div>
//                 </div>
//               )}

//               {/* <div
//                 className="vto-canvas-container"
//                 onMouseDown={compareMode ? handleBaDragStart : undefined}
//                 onMouseMove={compareMode ? handleBaDragMove : undefined}
//                 onMouseUp={compareMode ? handleBaDragEnd : undefined}
//                 onMouseLeave={compareMode ? handleBaDragEnd : undefined}
//                 onTouchStart={compareMode ? handleBaDragStart : undefined}
//                 onTouchMove={compareMode ? handleBaDragMove : undefined}
//                 onTouchEnd={compareMode ? handleBaDragEnd : undefined}
//                 style={{ position: 'relative', overflow: 'hidden', cursor: compareMode ? (isDragging ? 'ew-resize' : 'pointer') : 'default' }}
//               >
//                 <div className="vto-ba-before-layer" style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 1 }}>
//                   {mode === 'live' && <Webcam ref={webcamRef} audio={false} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} videoConstraints={{ facingMode: "user" }} />}
//                   {mode === 'photo' && uploadedImage && <img ref={imageRef} src={uploadedImage} alt="Uploaded" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
//                 </div>
//                 <canvas
//                   ref={canvasRef}
//                   className="vto-main-canvas"
//                   style={{
//                     position: 'absolute', inset: 0, width: '100%', height: '100%',
//                     objectFit: mode === 'photo' ? 'contain' : 'cover',
//                     transform: mode === 'live' ? 'scaleX(-1)' : 'none',
//                     clipPath: compareMode ? `inset(0 ${100 - (baPos * 100)}% 0 0)` : 'none',
//                     zIndex: 2,
//                     pointerEvents: compareMode ? 'none' : 'auto'
//                   }}
//                 />
//                 {compareMode && (
//                   <>
//                     <div className="vto-compare-labels">
//                       <button className="vto-compare-pill vto-pill-left" onClick={() => setCompareMode(false)}>BEFORE</button>
//                       <button className="vto-compare-pill vto-pill-right" onClick={() => setCompareMode(false)}>AFTER</button>
//                     </div>
//                     <div className="ba-divider" style={{ position: 'absolute', top: 0, bottom: 0, width: '2px', background: 'rgba(255,255,255,0.7)', left: `${baPos * 100}%`, zIndex: 10, transform: 'translateX(-50%)', pointerEvents: 'none' }}></div>
//                     <div className="ba-handle-bottom" style={{ position: 'absolute', bottom: '8%', left: `${baPos * 100}%`, transform: 'translateX(-50%)', zIndex: 11, display: 'flex', gap: '4px', pointerEvents: 'none' }}>
//                       <div style={{ width: '4px', height: '32px', background: 'rgba(255,255,255,0.9)', borderRadius: '2px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}></div>
//                       <div style={{ width: '4px', height: '32px', background: 'rgba(255,255,255,0.9)', borderRadius: '2px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}></div>
//                     </div>
//                   </>
//                 )}
//                 <div className="vto-status" style={{ zIndex: 20 }}>{statusMsg}</div>
//               </div> */}


//               <div
//   className="vto-canvas-container"
//   onMouseDown={compareMode ? handleBaDragStart : undefined}
//   onMouseMove={compareMode ? handleBaDragMove : undefined}
//   onMouseUp={compareMode ? handleBaDragEnd : undefined}
//   onMouseLeave={compareMode ? handleBaDragEnd : undefined}
//   onTouchStart={compareMode ? handleBaDragStart : undefined}
//   onTouchMove={compareMode ? handleBaDragMove : undefined}
//   onTouchEnd={compareMode ? handleBaDragEnd : undefined}
//   style={{
//     position: 'relative',
//     overflow: 'hidden',
//     cursor: compareMode ? (isDragging ? 'ew-resize' : 'col-resize') : 'default',
//     width: '100%',
//     height: '100%',
//     aspectRatio: mode === 'photo' ? 'auto' : '4 / 3' // helps maintain ratio
//   }}
// >
//   {/* BEFORE Layer */}
//   <div
//     className="vto-ba-before-layer"
//     style={{
//       position: 'absolute',
//       inset: 0,
//       width: '100%',
//       height: '100%',
//       overflow: 'hidden',
//       zIndex: 1,
//     }}
//   >
//     {mode === 'live' && (
//       <Webcam
//         ref={webcamRef}
//         audio={false}
//         style={{
//           width: '100%',
//           height: '100%',
//           objectFit: 'cover',
//           transform: 'scaleX(-1)',
//         }}
//         videoConstraints={{ facingMode: "user" }}
//       />
//     )}

//     {mode === 'photo' && uploadedImage && (
//       <img
//         ref={imageRef}
//         src={uploadedImage}
//         alt="Uploaded"
//         style={{
//           width: '100%',
//           height: '100%',
//           objectFit: 'cover',   // changed from 'contain'
//         }}
//       />
//     )}
//   </div>

//   {/* AFTER Layer (Canvas with Makeup) */}
//   <canvas
//     ref={canvasRef}
//     className="vto-main-canvas"
//     style={{
//       position: 'absolute',
//       inset: 0,
//       width: '100%',
//       height: '100%',
//       objectFit: 'cover',
//       transform: mode === 'live' ? 'scaleX(-1)' : 'none',
//       clipPath: compareMode 
//         ? `inset(0 ${100 - (baPos * 100)}% 0 0)` 
//         : 'none',
//       zIndex: 2,
//       pointerEvents: compareMode ? 'none' : 'auto',
//     }}
//   />

//   {/* Compare UI Elements */}
//   {compareMode && (
//     <>
//       <div className="vto-compare-labels">
//         <div className="vto-compare-pill vto-pill-left">BEFORE</div>
//         <div className="vto-compare-pill vto-pill-right">AFTER</div>
//       </div>

//       {/* Divider */}
//       <div
//         className="ba-divider"
//         style={{
//           position: 'absolute',
//           top: 0,
//           bottom: 0,
//           left: `${baPos * 100}%`,
//           width: '3px',
//           background: 'rgba(255,255,255,0.85)',
//           boxShadow: '0 0 8px rgba(0,0,0,0.4)',
//           zIndex: 10,
//           transform: 'translateX(-50%)',
//           pointerEvents: 'none'
//         }}
//       />

//       {/* Handle */}
//       <div
//         className="ba-handle"
//         style={{
//           position: 'absolute',
//           top: '50%',
//           left: `${baPos * 100}%`,
//           transform: 'translate(-50%, -50%)',
//           zIndex: 11,
//           pointerEvents: 'none'
//         }}
//       >
//         <div style={{
//           width: '48px',
//           height: '48px',
//           borderRadius: '50%',
//           background: 'white',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
//           color: '#000'
//         }}>
//           ⇄
//         </div>
//       </div>
//     </>
//   )}

//   <div className="vto-status" style={{ zIndex: 20 }}>{statusMsg}</div>
// </div>

//               {!compareMode && (
//                 <div className="vto-intensity-slider-wrap">
//                   <div className="vto-slider-track-thin">
//                     <input type="range" className="vto-vertical-slider-thin" min="0" max="100" value={intensity} onChange={handleIntensityChange} />
//                   </div>
//                   <div className="vto-slider-icon">
//                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                       <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="white" />
//                     </svg>
//                   </div>
//                 </div>
//               )}

//               {!compareMode && (
//                 <div className="vto-top-controls-v2">
//                   <button className="vto-compare-btn" onClick={() => setCompareMode(true)}>COMPARE</button>
//                   <button className="vto-instr-icon-btn vto-close-btn-v2" onClick={goBackToLandingWithScroll}><FaTimes /></button>
//                 </div>
//               )}

//               <div className="vto-bottom-controls-v2">
//                 <button className="vto-download-btn-v2" onClick={downloadImage}>
//                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M19 15V19H5V15H3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V15H19ZM13 12.67L15.59 10.09L17 11.5L12 16.5L7 11.5L8.41 10.09L11 12.67V3H13V12.67Z" fill="white" />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* INSTRUCTIONS SCREEN – kept as a modal for consistency */}
//         {vtoStep === 'instructions' && (
//           <div className="vto-instructions-screen">
//             <div className="vto-instr-card">
//               <div className="vto-instr-header">
//                 <button className="vto-instr-icon-btn" onClick={goBackToLandingWithScroll}><FaChevronLeft /></button>
//                 <div className="vto-instr-brand">
//                   <div className="vto-instr-brand-text">JOYORY<span>BEAUTY</span></div>
//                 </div>
//                 <button className="vto-instr-icon-btn" onClick={goBackToLandingWithScroll}><FaTimes /></button>
//               </div>
//               <div className="vto-instr-content">
//                 <h2 className="vto-instr-title">PHOTO INSTRUCTIONS</h2>
//                 <div className="vto-instr-list">
//                   <div className="vto-instr-item"><div className="vto-instr-icon-box"></div><p>Use a Photo that is of the face straight on.</p></div>
//                   <div className="vto-instr-item"><div className="vto-instr-icon-box"></div><p>Make Sure Nothing Is Obstructing The Face.</p></div>
//                   <div className="vto-instr-item"><div className="vto-instr-icon-box"></div><p>Make Sure That The Lighting Is Not Too Dim Or Too Bright.</p></div>
//                 </div>
//               </div>
//               <div className="vto-instr-footer">
//                 <button className="vto-btn-black-rect" onClick={() => fileInputRef.current?.click()}>UPLOAD PHOTO</button>
//                 <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" style={{ display: 'none' }} />
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MainVirtualTryon;




























import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import axios from 'axios';
import {
  FaCamera, FaImage, FaDownload, FaChevronLeft, FaChevronRight,
  FaTimes, FaSpinner, FaHistory, FaCheckCircle, FaArrowLeft
} from 'react-icons/fa';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';
import '../css/Mainvirtualtryon.css';

import Header from './Header';
import vtoHero from "../assets/Virtual-tryon-new.png";
import vtoFirst from '../assets/vto_new.png';
import vtoMobile from '../assets/vto_mobile.png';
import step1 from "../assets/step1.png";
import step2 from "../assets/step2.png";
import step3 from "../assets/step3.png";
import joyoryLogo from "../assets/Logo.png";

// ── Landmark indices (unchanged) ──────────────────────────────
const LIP_OUTER = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17, 84, 181, 91, 146];
const LIP_INNER = [78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95];
const LEYE_UPPER = [33, 246, 161, 160, 159, 158, 157, 173, 133];
const REYE_UPPER = [263, 466, 388, 387, 386, 385, 384, 398, 362];
const LEYE_LOWER = [133, 155, 154, 153, 145, 144, 163, 7, 33];
const REYE_LOWER = [362, 382, 381, 380, 374, 373, 390, 249, 263];

const LBROW_TOP = [70, 63, 105, 66, 107];
const LBROW_BOT = [46, 53, 52, 65, 55];
const RBROW_TOP = [336, 296, 334, 293, 300];
const RBROW_BOT = [276, 283, 282, 295, 285];
const LBROW = [...LBROW_TOP, ...[...LBROW_BOT].reverse()];
const RBROW = [...RBROW_TOP, ...[...RBROW_BOT].reverse()];

const FACE = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];

const LCHECK = [117, 118, 119, 120, 121, 123, 147, 213, 192, 234];
const RCHECK = [346, 347, 348, 349, 350, 352, 376, 433, 416, 454];

function pt(lms, i, w, h) { return { x: lms[i].x * w, y: lms[i].y * h }; }
function hexRgb(h) {
  if (!h || h === 'none') return [0, 0, 0];
  const c = h.replace('#', '');
  return [parseInt(c.slice(0, 2), 16) || 0, parseInt(c.slice(2, 4), 16) || 0, parseInt(c.slice(4, 6), 16) || 0];
}

function catmullSmooth(pts, steps = 14) {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let s = 0; s < steps; s++) {
      const t = s / steps, t2 = t * t, t3 = t2 * t;
      out.push({
        x: .5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
        y: .5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3)
      });
    }
  }
  out.push(pts[pts.length - 1]); return out;
}

function drawBrow(ctx, lms, browI, color, alpha, style, thickMul, w, h) {
  if (!color || color === 'none') return;
  const [r, g, b] = hexRgb(color);
  const off = document.createElement('canvas'); off.width = w; off.height = h;
  const ox = off.getContext('2d');
  const half = Math.floor(browI.length / 2);
  let tPts = browI.slice(0, half).map(i => pt(lms, i, w, h)).sort((a, b) => a.x - b.x);
  let bPts = browI.slice(half).map(i => pt(lms, i, w, h)).sort((a, b) => a.x - b.x);
  let pts = [...tPts, ...bPts.reverse()];
  const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
  const scaleY = 0.90 + (thickMul * 0.45);
  const scaleX = 1.00 + (thickMul * 0.08);
  pts = pts.map(p => ({ x: cx + (p.x - cx) * scaleX, y: cy + (p.y - cy) * scaleY }));
  ox.beginPath();
  const last = pts[pts.length - 1];
  ox.moveTo((pts[0].x + last.x) / 2, (pts[0].y + last.y) / 2);
  for (let i = 0; i < pts.length; i++) {
    const p1 = pts[i], p2 = pts[(i + 1) % pts.length];
    ox.quadraticCurveTo(p1.x, p1.y, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
  }
  ox.closePath();
  let opMul = 1.0, blurAmt = 1.6;
  if (style === 'feathered') { opMul = 0.60; blurAmt = 1.4; }
  else if (style === 'bold') { opMul = 0.95; blurAmt = 0.8; }
  else if (style === 'defined') { opMul = 0.85; blurAmt = 0.7; }
  else { opMul = 0.75; blurAmt = 1.8; }
  ox.fillStyle = `rgb(${r},${g},${b})`; ox.fill();
  ctx.save();
  ctx.globalCompositeOperation = 'multiply'; ctx.filter = `blur(${blurAmt}px)`; ctx.globalAlpha = Math.min(alpha * opMul * 1.5, 0.95); ctx.drawImage(off, 0, 0);
  ctx.globalCompositeOperation = 'source-over'; ctx.filter = `blur(${blurAmt * 0.35}px)`; ctx.globalAlpha = alpha * opMul * 0.4; ctx.drawImage(off, 0, 0);
  ctx.restore();
}

function drawBlush(ctx, lms, checkI, color, alpha, w, h) {
  if (!color || alpha <= 0) return;
  const pts = checkI.map(i => pt(lms, i, w, h));
  const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
  const faceL = pt(lms, 234, w, h), faceR = pt(lms, 454, w, h);
  const faceW = Math.max(Math.abs(faceR.x - faceL.x), 60);
  const isLeft = checkI.includes(234);
  const templePt = isLeft ? faceL : faceR;
  const sweepAngle = Math.atan2(templePt.y - cy, templePt.x - cx);
  const rx = faceW * 0.28, ry = faceW * 0.12;
  const [r, g, b] = hexRgb(color);
  const off = document.createElement('canvas'); off.width = w; off.height = h;
  const ox = off.getContext('2d');
  ox.save(); ox.translate(cx, cy); ox.rotate(sweepAngle);
  ox.filter = `blur(${rx * 0.20}px)`; ox.scale(1, ry / rx);
  const gr = ox.createRadialGradient(-rx * 0.15, 0, 0, 0, 0, rx);
  gr.addColorStop(0.00, `rgba(${r},${g},${b},${alpha * 1.8})`);
  gr.addColorStop(0.40, `rgba(${r},${g},${b},${alpha * 0.7})`);
  gr.addColorStop(1.00, `rgba(${r},${g},${b},0)`);
  ox.fillStyle = gr; ox.beginPath(); ox.arc(0, 0, rx * 1.1, 0, Math.PI * 2); ox.fill(); ox.restore();
  ox.globalCompositeOperation = 'destination-out'; ox.filter = 'blur(4px)';
  const eyeHole = (isLeft ? LEYE_LOWER : REYE_LOWER).map(i => pt(lms, i, w, h));
  ox.beginPath(); ox.ellipse(eyeHole[4].x, eyeHole[4].y - faceW * 0.015, faceW * 0.14, faceW * 0.06, 0, 0, Math.PI * 2); ox.fill();
  const luma = (0.299 * r + 0.587 * g + 0.114 * b);
  const isSuperDark = luma < 60;
  ctx.save();
  ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = isSuperDark ? 0.85 : 0.35; ctx.drawImage(off, 0, 0);
  ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = isSuperDark ? 0.3 : 0.65; ctx.drawImage(off, 0, 0);
  ctx.restore();
}

function drawEyeliner(ctx, lms, eyeUpperI, eyeLowerI, color, alpha, style, placement, w, h) {
  if (!color || color === 'none' || style === 'none') return;
  const [r, g, b] = hexRgb(color);
  const isLeft = eyeUpperI.includes(33);
  const innerCorner = isLeft ? 133 : 362;
  let rawUp = eyeUpperI.map(i => pt(lms, i, w, h)), rawLo = eyeLowerI.map(i => pt(lms, i, w, h));
  if (eyeUpperI[0] !== innerCorner) rawUp.reverse();
  if (eyeLowerI[0] !== innerCorner) rawLo.reverse();
  const smUp = catmullSmooth(rawUp, 18), smLo = catmullSmooth(rawLo, 18);
  const allPts = [...smUp, ...smLo];
  const cx = allPts.reduce((s, p) => s + p.x, 0) / allPts.length, cy = allPts.reduce((s, p) => s + p.y, 0) / allPts.length;
  const eyeW = Math.sqrt(Math.pow(smUp[smUp.length - 1].x - smUp[0].x, 2) + Math.pow(smUp[smUp.length - 1].y - smUp[0].y, 2)) || 10;
  const SP = {
    thin: { th: 0.06, wingLen: 0, wingLift: 0, lo: false, smoky: false, tight: false },
    cat: { th: 0.09, wingLen: 0.17, wingLift: 0.14, lo: false, smoky: false, tight: false },
    medium: { th: 0.12, wingLen: 0.12, wingLift: 0.08, lo: false, smoky: false, tight: false },
    dramatic: { th: 0.20, wingLen: 0.32, wingLift: 0.25, lo: true, smoky: false, tight: false },
    smoky: { th: 0.20, wingLen: 0, wingLift: 0, lo: true, smoky: true, tight: false },
    tightline: { th: 0.03, wingLen: 0, wingLift: 0, lo: false, smoky: false, tight: true }
  };
  const sp = SP[style] || SP.thin;
  const linerThickMul = 1.0;
  const baseThick = Math.max(eyeW * sp.th * linerThickMul, 1.2);

  const drawLinerCurve = (curve, isUpper) => {
    const sn = curve.length;
    const pts = curve.map((p, i) => {
      const prev = curve[Math.max(0, i - 1)], next = curve[Math.min(sn - 1, i + 1)];
      const tx = next.x - prev.x, ty = next.y - prev.y;
      const len = Math.sqrt(tx * tx + ty * ty) || 1;
      const nx1 = -ty / len, ny1 = tx / len, nx2 = ty / len, ny2 = -tx / len;
      const d1 = (p.x + nx1 - cx) ** 2 + (p.y + ny1 - cy) ** 2, d2 = (p.x + nx2 - cx) ** 2 + (p.y + ny2 - cy) ** 2;
      const nx = d1 > d2 ? nx1 : nx2, ny = d1 > d2 ? ny1 : ny2;
      const t = i / (sn - 1);
      let tFct = isUpper ? (sp.smoky ? 0.1 + 0.9 * Math.pow(t, 0.8) : style === 'dramatic' ? 0.05 + 0.95 * Math.pow(t, 2.2) : style === 'cat' ? 0.05 + 0.95 * Math.pow(t, 1.5) : t < 0.25 ? Math.pow(t / 0.25, 1.5) : 1) : (sp.smoky ? 0.05 + 0.85 * t : style === 'dramatic' ? 0.02 + 0.55 * Math.pow(t, 1.5) : 0.02 + 0.4 * t);
      if (!isUpper && t > 0.85) tFct *= (1 - ((t - 0.85) / 0.15) * 0.9);
      const pxThick = baseThick * tFct * (isUpper ? 1 : 0.5);
      return { x: p.x + nx * pxThick, y: p.y + ny * pxThick, nx, ny };
    });
    const off = document.createElement('canvas'); off.width = w; off.height = h; const ox = off.getContext('2d');
    ox.fillStyle = `rgb(${r},${g},${b})`; ox.beginPath();
    curve.forEach((p, i) => i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y));
    if (isUpper && sp.wingLen > 0) {
      const lookIdx = Math.max(0, sn - 4);
      const wx = curve[sn - 1].x - curve[lookIdx].x, wy = curve[sn - 1].y - curve[lookIdx].y;
      const wLen = Math.sqrt(wx * wx + wy * wy) || 1, uX = wx / wLen, uY = wy / wLen;
      const outerTip = pts[sn - 1];
      const targetX = curve[sn - 1].x + uX * eyeW * sp.wingLen + outerTip.nx * eyeW * sp.wingLift;
      const targetY = curve[sn - 1].y + uY * eyeW * sp.wingLen + outerTip.ny * eyeW * sp.wingLift;
      const cpX = curve[sn - 1].x + uX * eyeW * sp.wingLen * 0.4, cpY = curve[sn - 1].y + uY * eyeW * sp.wingLen * 0.4;
      ox.quadraticCurveTo(cpX, cpY, targetX, targetY); ox.lineTo(outerTip.x, outerTip.y);
    }
    [...pts].reverse().forEach(p => ox.lineTo(p.x, p.y)); ox.closePath(); ox.fill();
    ctx.save();
    if (sp.smoky) {
      ctx.globalCompositeOperation = 'multiply'; ctx.filter = `blur(${baseThick * 1.5}px)`; ctx.globalAlpha = Math.min(alpha * 1.2, 0.9); ctx.drawImage(off, 0, 0);
      ctx.filter = `blur(${baseThick * 0.7}px)`; ctx.globalAlpha = Math.min(alpha * 0.8, 0.9); ctx.drawImage(off, 0, 0);
      ctx.globalCompositeOperation = 'source-over'; ctx.filter = `blur(${baseThick * 0.2}px)`; ctx.globalAlpha = alpha * 0.4; ctx.drawImage(off, 0, 0);
    } else {
      ctx.globalCompositeOperation = 'multiply'; ctx.filter = 'blur(1.2px)'; ctx.globalAlpha = Math.min(alpha * 1.2, 0.95); ctx.drawImage(off, 0, 0);
      ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'blur(0.4px)'; ctx.globalAlpha = alpha * 0.85; ctx.drawImage(off, 0, 0);
    }
    ctx.restore();
  };

  if (sp.tight) {
    ctx.save(); ctx.strokeStyle = `rgba(${r},${g},${b},${alpha * 0.85})`; ctx.lineWidth = Math.max(eyeW * 0.025, 1.2);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.filter = 'blur(0.6px)'; ctx.beginPath();
    smUp.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.stroke(); ctx.restore();
    if (placement === 'both' || placement === 'lower') drawLinerCurve(smLo, false);
    return;
  }
  if (placement === 'upper') { drawLinerCurve(smUp, true); if (sp.lo) drawLinerCurve(smLo, false); }
  else if (placement === 'lower') drawLinerCurve(smLo, false);
  else { drawLinerCurve(smUp, true); drawLinerCurve(smLo, false); }
}

function drawLips(ctx, lms, color, alpha, w, h) {
  if (!color || color === 'none') return;
  const [r, g, b] = hexRgb(color);
  const off = document.createElement('canvas'); off.width = w; off.height = h; const ox = off.getContext('2d');
  ox.beginPath();
  LIP_OUTER.forEach((id, i) => { const p = pt(lms, id, w, h); i === 0 ? ox.moveTo(p.x, p.y) : ox.lineTo(p.x, p.y); });
  ox.closePath();
  [...LIP_INNER].reverse().forEach((id, i) => { const p = pt(lms, id, w, h); i === 0 ? ox.moveTo(p.x, p.y) : ox.lineTo(p.x, p.y); });
  ox.closePath();
  ox.fillStyle = `rgb(${r},${g},${b})`; ox.fill();
  ctx.save();
  ctx.globalCompositeOperation = 'multiply'; ctx.filter = 'blur(1.8px)'; ctx.globalAlpha = Math.min(alpha * 0.9, 0.85); ctx.drawImage(off, 0, 0);
  ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'none'; ctx.globalAlpha = alpha * 0.35; ctx.drawImage(off, 0, 0);
  ctx.restore();
}

function drawFoundation(ctx, lms, color, alpha, w, h) {
  if (!color || color === 'none' || alpha <= 0) return;
  const [r, g, b] = hexRgb(color);
  const off = document.createElement('canvas'); off.width = w; off.height = h; const ox = off.getContext('2d');
  ox.filter = 'blur(10px)'; ox.fillStyle = `rgb(${r},${g},${b})`; ox.beginPath();
  FACE.forEach((id, i) => { const p = pt(lms, id, w, h); i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y); });
  ox.closePath(); ox.fill();
  ox.globalCompositeOperation = 'destination-out'; ox.fillStyle = '#fff'; ox.filter = 'blur(3.5px)'; ox.beginPath();
  [...LEYE_UPPER, ...[...LEYE_LOWER].reverse()].forEach((id, i) => { const p = pt(lms, id, w, h); i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y); }); ox.closePath(); ox.fill();
  ox.beginPath();[...REYE_UPPER, ...[...REYE_LOWER].reverse()].forEach((id, i) => { const p = pt(lms, id, w, h); i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y); }); ox.closePath(); ox.fill();
  ox.filter = 'blur(2px)'; ox.beginPath(); LIP_OUTER.forEach((id, i) => { const p = pt(lms, id, w, h); i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y); }); ox.closePath(); ox.fill();
  ox.filter = 'blur(5px)'; ox.globalAlpha = 0.9; ox.beginPath(); LBROW.forEach((id, i) => { const p = pt(lms, id, w, h); i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y); }); ox.closePath(); ox.fill();
  ox.beginPath(); RBROW.forEach((id, i) => { const p = pt(lms, id, w, h); i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y); }); ox.closePath(); ox.fill();
  ctx.save();
  ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = Math.min(alpha * 0.95, 0.85); ctx.drawImage(off, 0, 0);
  ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = alpha * 0.55; ctx.drawImage(off, 0, 0);
  ctx.restore();
}

function applyMakeup(ctx, lms, w, h, S) {
  if (S.fOn) drawFoundation(ctx, lms, S.foundC, S.fOp, w, h);
  if (S.blushC) { drawBlush(ctx, lms, LCHECK, S.blushC, S.blushOp, w, h); drawBlush(ctx, lms, RCHECK, S.blushC, S.blushOp, w, h); }
  drawBrow(ctx, lms, LBROW, S.browC, S.browOp, S.browStyle, S.browThick, w, h);
  drawBrow(ctx, lms, RBROW, S.browC, S.browOp, S.browStyle, S.browThick, w, h);
  drawEyeliner(ctx, lms, LEYE_UPPER, LEYE_LOWER, S.linerC, S.linerOp, S.linerStyle, S.linerPlacement, w, h);
  drawEyeliner(ctx, lms, REYE_UPPER, REYE_LOWER, S.linerC, S.linerOp, S.linerStyle, S.linerPlacement, w, h);
  drawLips(ctx, lms, S.lipC, S.lOp, w, h);
}

function applyAdaptiveSmoothing(newLms, prevLms, w, h) {
  if (!prevLms) return newLms.map(p => ({ ...p }));
  let totalDist = 0;
  const anchors = [4, 152, 33, 263, 61, 291];
  anchors.forEach(idx => {
    const dx = (newLms[idx].x - prevLms[idx].x) * w;
    const dy = (newLms[idx].y - prevLms[idx].y) * h;
    totalDist += Math.sqrt(dx * dx + dy * dy);
  });
  const avgDist = totalDist / anchors.length;
  let dynFactor = 0.75;
  if (avgDist > 8) dynFactor = 0.0;
  else if (avgDist > 1) dynFactor = 0.75 * (1 - ((avgDist - 1) / 7));
  return newLms.map((p, i) => ({
    x: prevLms[i].x * dynFactor + p.x * (1 - dynFactor),
    y: prevLms[i].y * dynFactor + p.y * (1 - dynFactor),
    z: prevLms[i].z !== undefined ? (prevLms[i].z * dynFactor + p.z * (1 - dynFactor)) : p.z
  }));
}
// ─────────────────────────────────────────────────────────────────────────────

const MainVirtualTryon = () => {
  const navigate = useNavigate();
  const [vtoStep, setVtoStep] = useState('landing');
  const [mode, setMode] = useState(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [activeType, setActiveType] = useState(null);
  const [activeProduct, setActiveProduct] = useState(null);
  const [activeShade, setActiveShade] = useState(null);
  const [intensity, setIntensity] = useState(80);
  const [compareMode, setCompareMode] = useState(false);
  const [baPos, setBaPos] = useState(0.5);
  const [isDragging, setIsDragging] = useState(false);
  const [statusMsg, setStatusMsg] = useState('Initializing...');

  const [vtoTypes, setVtoTypes] = useState([]);
  const [products, setProducts] = useState([]);
  const [shades, setShades] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingShades, setLoadingShades] = useState(false);

  // ── DYNAMIC LANDING IMAGES FROM BACKEND ─────────────────────────────
  const [landingImages, setLandingImages] = useState({
    heroBanner: null,
    cardBackground: null,
    phoneView: null,
    stepImages: []
  });
  const [_loadingLandingImages, setLoadingLandingImages] = useState(false);
  // ────────────────────────────────────────────────────────────────────

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);
  const [sidePanel, setSidePanel] = useState('types');
  const [uploadedImage, setUploadedImage] = useState(null);

  const S = useRef({
    lipC: 'none', lOp: 0.8,
    linerC: 'none', linerStyle: 'thin', linerPlacement: 'upper', linerOp: 0.85, linerThick: 1.0,
    browC: 'none', browStyle: 'natural', browOp: 0.55, browThick: 0.55,
    foundC: '#fce9d8', fOn: false, fOp: 0.18,
    blushC: null, blushOp: 0.8
  });
  const smoothedLms = useRef(null);
  const faceMeshRef = useRef(null);
  const cameraRef = useRef(null);

  // Load types
  useEffect(() => {
    const fetchTypes = async () => {
      setLoadingTypes(true);
      try {
        const res = await axios.get('https://beauty.joyory.com/api/vto/workflow');
        setVtoTypes(res.data.types || []);
      } catch (err) {
        console.error("Error fetching types", err);
      } finally {
        setLoadingTypes(false);
        setStatusMsg('Ready ✓');
      }
    };
    fetchTypes();
  }, []);

  // ── FETCH DYNAMIC LANDING IMAGES FROM BACKEND ───────────────────────
  useEffect(() => {
    const fetchLandingImages = async () => {
      setLoadingLandingImages(true);
      try {
        const res = await axios.get('https://beauty.joyory.com/api/vto/workflow?section=landing');
        const data = res.data;
        setLandingImages({
          heroBanner: data.heroBanner || data.landing?.heroBanner || null,
          cardBackground: data.cardBackground || data.landing?.cardBackground || null,
          phoneView: data.phoneView || data.landing?.phoneView || null,
          stepImages: data.stepImages || data.landing?.stepImages || []
        });
      } catch (err) {
        console.error("Error fetching landing images", err);
      } finally {
        setLoadingLandingImages(false);
      }
    };
    fetchLandingImages();
  }, []);

  // Track previous step to avoid scrolling on initial mount
  const prevStepRef = useRef(vtoStep);
  useEffect(() => {
    prevStepRef.current = vtoStep;
  }, [vtoStep]);

  // Scroll to the landing card every time we come BACK to landing
  useEffect(() => {
    if (vtoStep === 'landing' && prevStepRef.current !== 'landing') {
      setTimeout(() => {
        const el = document.getElementById('main-backe-2');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);
    }
  }, [vtoStep]);

  useEffect(() => {
    const handlePopState = () => {
      setVtoStep('landing');
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Handle window resize in compare mode
  useEffect(() => {
    const handleResize = () => {
      if (compareMode && canvasRef.current && faceMeshRef.current && mode === 'photo' && uploadedImage) {
        const img = new Image();
        img.onload = () => faceMeshRef.current.send({ image: img });
        img.src = uploadedImage;
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [compareMode, mode, uploadedImage]);

  // Initialize MediaPipe FaceMesh
  useEffect(() => {
    if (vtoStep === 'engine') {
      try {
        const faceMesh = new FaceMesh({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`,
        });
        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        faceMesh.onResults((results) => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext('2d');
          const videoWidth = results.image.width;
          const videoHeight = results.image.height;
          canvas.width = videoWidth;
          canvas.height = videoHeight;
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

          if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
            let lms = results.multiFaceLandmarks[0];
            if (mode === 'live') {
              lms = applyAdaptiveSmoothing(lms, smoothedLms.current, canvas.width, canvas.height);
              smoothedLms.current = lms;
            }
            applyMakeup(ctx, lms, canvas.width, canvas.height, S.current);
          } else {
            if (mode === 'live') smoothedLms.current = null;
          }
        });

        faceMeshRef.current = faceMesh;

        if (mode === 'live') {
          if (webcamRef.current && webcamRef.current.video) {
            const camera = new Camera(webcamRef.current.video, {
              onFrame: async () => {
                if (webcamRef.current?.video && faceMeshRef.current) {
                  await faceMeshRef.current.send({ image: webcamRef.current.video });
                }
              },
              width: 640,
              height: 480
            });
            camera.start();
            cameraRef.current = camera;
            setStatusMsg('Live Mode Active');
          } else {
            setTimeout(() => {
              if (webcamRef.current && webcamRef.current.video) {
                const camera = new Camera(webcamRef.current.video, {
                  onFrame: async () => {
                    if (webcamRef.current?.video && faceMeshRef.current) {
                      await faceMeshRef.current.send({ image: webcamRef.current.video });
                    }
                  },
                  width: 640,
                  height: 480
                });
                camera.start();
                cameraRef.current = camera;
                setStatusMsg('Live Mode Active');
              }
            }, 1000);
          }
        }
      } catch (err) {
        console.error("FaceMesh initialization error", err);
      }
    } else {
      if (cameraRef.current) { cameraRef.current.stop(); cameraRef.current = null; }
      if (faceMeshRef.current) { faceMeshRef.current.close(); faceMeshRef.current = null; }
    }
    return () => {
      if (cameraRef.current) cameraRef.current.stop();
      if (faceMeshRef.current) faceMeshRef.current.close();
    }
  }, [vtoStep, mode]);

  // Handle Photo Mode static analysis
  useEffect(() => {
    if (vtoStep === 'engine' && mode === 'photo' && uploadedImage && faceMeshRef.current) {
      setStatusMsg('Processing Photo...');
      const img = new Image();
      img.onload = async () => {
        try {
          await faceMeshRef.current.send({ image: img });
          setStatusMsg('Photo Ready!');
        } catch (e) {
          console.error(e);
        }
      };
      img.src = uploadedImage;
    }
  }, [vtoStep, mode, uploadedImage]);

  const handleTypeSelect = async (type) => {
    setActiveType(type);
    setSidePanel('products');
    setLoadingProducts(true);
    try {
      const res = await axios.get(`https://beauty.joyory.com/api/vto/workflow?type=${type}`);
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Error fetching products", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleProductSelect = async (product) => {
    setActiveProduct(product);
    setSidePanel('shades');
    setLoadingShades(true);
    try {
      const res = await axios.get(`https://beauty.joyory.com/api/vto/workflow?productId=${product._id}`);
      setShades(res.data.product?.shades || []);
    } catch (err) {
      console.error("Error fetching shades", err);
    } finally {
      setLoadingShades(false);
    }
  };

  const applyShade = (shade) => {
    setActiveShade(shade.sku || shade._id || shade.name);
    let hex = shade.hex || shade.color;
    if (!hex) return;
    if (!hex.startsWith('#')) hex = '#' + hex;

    const type = (activeType || '').toLowerCase();
    if (type.includes('lip')) { S.current.lipC = hex; }
    else if (type.includes('eye') && !type.includes('brow')) { S.current.linerC = hex; }
    else if (type.includes('found')) { S.current.foundC = hex; S.current.fOn = true; }
    else if (type.includes('blush')) { S.current.blushC = hex; }
    else if (type.includes('brow')) { S.current.browC = hex; }

    if (mode === 'photo' && faceMeshRef.current && uploadedImage) {
      const img = new Image();
      img.onload = async () => { await faceMeshRef.current.send({ image: img }); };
      img.src = uploadedImage;
    }
  };

  const handleIntensityChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setIntensity(val);
    const alpha = val / 100;
    const type = (activeType || '').toLowerCase();
    if (type.includes('lip')) { S.current.lOp = alpha; }
    else if (type.includes('eye') && !type.includes('brow')) { S.current.linerOp = alpha; }
    else if (type.includes('found')) { S.current.fOp = alpha; }
    else if (type.includes('blush')) { S.current.blushOp = alpha; }
    else if (type.includes('brow')) { S.current.browOp = alpha; }

    if (mode === 'photo' && faceMeshRef.current && uploadedImage) {
      const img = new Image();
      img.onload = async () => { await faceMeshRef.current.send({ image: img }); };
      img.src = uploadedImage;
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
      setMode('photo');
      setVtoStep('engine');
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'joyory-vto.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const labelFor = (type) => {
    if (!type) return "";
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getCategoryIcon = (type) => {
    const t = (type || '').toLowerCase();

    // All categories use highly logical, luxury vector SVG icons
    let svgIcon = null;

    if (t.includes('lip') || t.includes('lipstick')) {
      svgIcon = (
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Lipstick base container */}
          <rect x="8" y="13" width="8" height="8" rx="1" stroke="currentColor" />
          {/* Inner silver tube collar */}
          <rect x="9.5" y="9" width="5" height="4" stroke="currentColor" />
          {/* Slanted lipstick body */}
          <path d="M9.5 9V6.5L12 4.5l2.5 1.5V9H9.5z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" />
          {/* Decorative stripe on base */}
          <line x1="8" y1="17" x2="16" y2="17" stroke="currentColor" />
        </svg>
      );
    } else if (t.includes('blush') || t.includes('cheek')) {
      svgIcon = (
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="7" r="5" stroke="currentColor" />
          <ellipse cx="12" cy="17" rx="6" ry="4" stroke="currentColor" />
          <ellipse cx="12" cy="17" rx="4" ry="2.5" fill="currentColor" fillOpacity="0.2" />
          <path d="M19 8l1 1-1 1M5 9l1-1-1-1" strokeWidth="1" />
        </svg>
      );
    } else if (t.includes('eyeliner')) {
      svgIcon = (
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 13.5C16 11 19.5 11 22 13c-2-3-5.5-4.5-9-3" stroke="currentColor" strokeWidth="2.5" />
          <path d="M4 20L15 9l2 2L6 22H4v-2z" fill="currentColor" fillOpacity="0.15" />
          <path d="M14 10l1.5-1.5a1 1 0 0 1 1.4 0v0a1 1 0 0 1 0 1.4L15.5 11.5" />
          <path d="M13.5 10.5l-1-1" strokeWidth="2" />
        </svg>
      );
    } else if (t.includes('eye') || t.includes('shadow') || t.includes('eyes')) {
      svgIcon = (
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="13" rx="2" stroke="currentColor" />
          <circle cx="7.5" cy="8.5" r="2.2" fill="currentColor" fillOpacity="0.2" />
          <circle cx="16.5" cy="8.5" r="2.2" fill="currentColor" fillOpacity="0.2" />
          <circle cx="7.5" cy="12.5" r="2.2" fill="currentColor" fillOpacity="0.2" />
          <circle cx="16.5" cy="12.5" r="2.2" fill="currentColor" fillOpacity="0.2" />
          <line x1="5" y1="20" x2="19" y2="20" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="4.5" cy="20" r="1.2" fill="currentColor" />
          <circle cx="19.5" cy="20" r="1.2" fill="currentColor" />
        </svg>
      );
    } else if (t.includes('brow') || t.includes('eyebrow') || t.includes('brows')) {
      svgIcon = (
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 13.5c3.5-3 8.5-4.5 13-2 2.5 1.4 4 3 5 4-1.5-2.5-4.5-4.5-8-4.5-4 0-7.5 1.5-10 2.5z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1" />
          <line x1="6" y1="18" x2="16" y2="8" stroke="currentColor" strokeWidth="1.5" />
          <path d="M16 8l1.5-1.5a1 1 0 0 1 1.4 0v0a1 1 0 0 1 0 1.4L17.5 9.5" />
          <path d="M5 19l1.5-1.5" />
        </svg>
      );
    } else if (t.includes('found') || t.includes('face') || t.includes('concealer') || t.includes('foundation')) {
      svgIcon = (
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="7" y="10" width="10" height="11" rx="2" stroke="currentColor" />
          <rect x="8.5" y="12" width="7" height="7" fill="currentColor" fillOpacity="0.25" stroke="none" />
          <path d="M10 10V7h4v3" />
          <path d="M14 6H9.5a1 1 0 0 0-1 1v1h3" />
          <path d="M19 12c0 1.6-1.3 3-3 3s-3-1.4-3-3c0-1.5 2-4.5 3-4.5s3 3 3 4.5z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" />
        </svg>
      );
    } else {
      // Fallback eyeshadow palette style
      svgIcon = (
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="13" rx="2" stroke="currentColor" />
          <circle cx="7.5" cy="8.5" r="2.2" fill="currentColor" fillOpacity="0.2" />
          <circle cx="16.5" cy="8.5" r="2.2" fill="currentColor" fillOpacity="0.2" />
          <circle cx="7.5" cy="12.5" r="2.2" fill="currentColor" fillOpacity="0.2" />
          <circle cx="16.5" cy="12.5" r="2.2" fill="currentColor" fillOpacity="0.2" />
        </svg>
      );
    }

    return (
      <div
        className="vto-category-svg-wrapper"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          color: "inherit"
        }}
      >
        {svgIcon}
      </div>
    );
  };

  const handleBaDragStart = (e) => {
    if (!compareMode) return;
    setIsDragging(true);
    handleBaDragCalc(e);
  };

  const handleBaDragEnd = () => {
    if (!compareMode) return;
    setIsDragging(false);
  };

  const handleBaDragMove = (e) => {
    if (!compareMode || !isDragging) return;
    handleBaDragCalc(e);
  };

  // FIXED: Use containerRef instead of e.currentTarget for accurate positioning
  const handleBaDragCalc = useCallback((e) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    let clientX;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
    } else if (e.clientX !== undefined) {
      clientX = e.clientX;
    } else {
      return;
    }
    let newPos = (clientX - rect.left) / rect.width;
    newPos = Math.max(0.05, Math.min(0.95, newPos));
    setBaPos(newPos);
  }, []);

  const goBackToLandingWithScroll = useCallback(() => {
    if (cameraRef.current) {
      cameraRef.current.stop();
      cameraRef.current = null;
    }
    if (faceMeshRef.current) {
      faceMeshRef.current.close();
      faceMeshRef.current = null;
    }
    setCompareMode(false);
    setMode(null);
    setActiveType(null);
    setActiveProduct(null);
    setActiveShade(null);
    setSidePanel('types');
    setVtoStep('landing');
    setTimeout(() => {
      const el = document.getElementById('main-backe-2');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 300);
  }, []);

  // Back button: go one step back in the instructions flow
  const handleInstrBack = useCallback(() => {
    goBackToLandingWithScroll();
  }, [goBackToLandingWithScroll]);

  // Close button: show confirmation dialog
  const handleInstrClose = useCallback(() => {
    setShowExitConfirm(true);
  }, []);

  // Confirm exit → navigate to VirtualTryon page
  const handleConfirmExit = useCallback(() => {
    setShowExitConfirm(false);
    if (cameraRef.current) { cameraRef.current.stop(); cameraRef.current = null; }
    if (faceMeshRef.current) { faceMeshRef.current.close(); faceMeshRef.current = null; }
    navigate('/Virtualtryon');
  }, [navigate]);

  const handleCancelExit = useCallback(() => {
    setShowExitConfirm(false);
  }, []);

  // Back button handler - exits compare mode but stays in engine
  const handleBackFromCompare = useCallback(() => {
    setCompareMode(false);
    setBaPos(0.5);
  }, []);

  const getImageSrc = (backendUrl, localFallback) => backendUrl || localFallback;

  return (
    <div className={`vto-main-wrapper d-flex ${vtoStep === 'landing' ? 'vto-landing-mode-wrapper' : ''}`}>
      <div className={`vto-app-container ${vtoStep === 'landing' ? 'vto-landing-mode' : ''}`}>

        {/* 🟢 HEADER */}
        <div className="vto-landing-header-container">
          <Header hideCategories={true} />
        </div>

        {/* LANDING CONTENT – only when step === 'landing' */}
        {vtoStep === 'landing' && (
          <div className="vto-landing-screen-integrated">

            {/* 🟢 FULL VIRTUALTRYON PAGE UNDERLAY */}
            <div className="vto-bg-content-underlay">
              <div className="virtualtryon-container pt-5 mt-2">
                <header className="hero-sections mt-lg-5 pt-lg-5 mt-2 w-100">
                  <img
                    src={vtoHero}
                    alt="Virtual Try-On"
                    className="hero-image img-fluid"
                    style={{ width: "100%", maxHeight: "500px", objectFit: "cover" }}
                  />
                </header>

                {/* How It Works Section */}
                <section className="how-it-works-section container mt-5" style={{ paddingBottom: '120px' }}>
                  <h2 className="section-title page-title-main-name mb-4 text-start">How It Works</h2>
                  <div className="row g-4">
                    <div className="col-lg-4 col-md-6 col-12">
                      <img
                        src={step1}
                        alt="Step 1"
                        className="step-image img-fluid w-100"
                      />
                      <h3 className="step-number page-title-main-name mt-3 fw-semibold" style={{ fontSize: '1rem', color: '#222' }}>
                        Step <span style={{ color: '#b5845a' }}>1</span>
                      </h3>
                      <p className="step-description page-title-main-name text-muted" style={{ fontSize: '0.9rem', marginTop: '4px' }}>
                        Use the Live Camera, upload a photo, or select a model to begin.
                      </p>
                    </div>
                    <div className="col-lg-4 col-md-6 col-12">
                      <img
                        src={step2}
                        alt="Step 2"
                        className="step-image img-fluid w-100"
                      />
                      <h3 className="step-number page-title-main-name mt-3 fw-semibold" style={{ fontSize: '1rem', color: '#222' }}>
                        Step <span style={{ color: '#b5845a' }}>2</span>
                      </h3>
                      <p className="step-description page-title-main-name text-muted" style={{ fontSize: '0.9rem', marginTop: '4px' }}>
                        Browse makeup categories and select the products you'd like to try on.
                      </p>
                    </div>
                    <div className="col-lg-4 col-md-6 col-12">
                      <img
                        src={step3}
                        alt="Step 3"
                        className="step-image img-fluid w-100"
                      />
                      <h3 className="step-number page-title-main-name mt-3 fw-semibold" style={{ fontSize: '1rem', color: '#222' }}>
                        Step <span style={{ color: '#b5845a' }}>3</span>
                      </h3>
                      <p className="step-description page-title-main-name text-muted" style={{ fontSize: '0.9rem', marginTop: '4px' }}>
                        Use the slider to compare before and after to find your ideal combination.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            {/* Dark background overlay */}
            <div className="vto-bg-layer"></div>

            {/* 🟢 CENTERED MODAL CARD (looks exactly like second screenshot) */}
            <div className="vto-landing-card-container main-backe-2" id="main-backe-2">
              <div className="vto-landing-bg-box">
                <picture>
                  <source media="(max-width: 768px)" srcSet={vtoMobile} />
                  <img
                    src={getImageSrc(landingImages.cardBackground, vtoFirst)}
                    alt="VTO Background"
                    className="vto-bg-img img-fluid"
                  />
                </picture>
                {/* <div className="vto-phone-overlay">
                  <div className="vto-phone-frame">
                    <div className="vto-phone-notch"></div>
                    <img
                      src={getImageSrc(landingImages.phoneView, vtoFirst)}
                      alt="VTO Phone View"
                      className="vto-phone-img-zoomed"
                    />
                    <div className="vto-phone-scan-corners"></div>
                    <div className="vto-phone-bottom-strip">
                      <div className="vto-mini-prod vto-mini-prod-1"></div>
                      <div className="vto-mini-prod vto-mini-prod-2"></div>
                      <div className="vto-mini-prod vto-mini-prod-3"></div>
                      <div className="vto-mini-prod vto-mini-prod-4"></div>
                      <div className="vto-mini-prod vto-mini-prod-5"></div>
                    </div>
                  </div>
                </div> */}
              </div>
              <div className="vto-landing-content-box">
                <h1 className="vto-title-landing">VIRTUAL TRY ON</h1>
                <p className="vto-subtitle-landing">    Find the perfect match for your style with a realistic virtual beauty experience.

                </p>
                <div className="vto-actions-landing">
                  <button
                    className="vto-btn-black"
                    onClick={() => {
                      window.history.pushState({ vto: true }, "");
                      setMode('live');
                      setVtoStep('engine');
                    }}
                  >SELFIE MODE</button>
                  <button className="vto-btn-black" onClick={() => { setMode('photo'); setVtoStep('instructions'); }}>UPLOAD PHOTO</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ENGINE – full screen below header, with hero background */}
        {vtoStep === 'engine' && (
          <div className='vto-engine-bg-wrapper' style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {/* Dark overlay for readability */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.75)',
              zIndex: 0
            }} />
            {/* The original engine workspace, now with transparent background */}
            <div className="vto-workspace" style={{ background: 'transparent', position: 'relative', zIndex: 1, flex: 1, display: 'flex', minHeight: 0 }}>
              {!compareMode && (
                <div className="vto-engine-sidebar">
                  {sidePanel === 'types' && (
                    <div className="vto-sidebar-items">
                      {loadingTypes ? <div className="vto-spinner-wrap-small"><FaSpinner className="vto-spin" /></div> :
                        vtoTypes.map((type, i) => (
                          <div key={i} className={`vto-sidebar-item ${activeType === type ? 'active' : ''}`} onClick={() => handleTypeSelect(type)}>
                            <div className="vto-sidebar-icon-box">
                              {getCategoryIcon(type)}
                            </div>
                            <span className="vto-sidebar-label">{labelFor(type)}</span>
                          </div>
                        ))
                      }
                    </div>
                  )}

                  {sidePanel === 'products' && (
                    <div className="vto-sidebar-items vto-sidebar-products">
                      <div className="vto-sidebar-item" onClick={() => { setActiveType(null); setProducts([]); setSidePanel('types'); }}>
                        <div className="vto-sidebar-icon-box" style={{ background: 'transparent', border: 'none', color: '#fff' }}><FaChevronLeft size={24} /></div>
                      </div>
                      {loadingProducts ? <div className="vto-spinner-wrap-small"><FaSpinner className="vto-spin" /></div> :
                        products.map((p, i) => (
                          <div key={p._id || i} className={`vto-sidebar-item ${activeProduct?._id === p._id ? 'active' : ''}`} onClick={() => handleProductSelect(p)}>
                            <div className="vto-sidebar-icon-box">
                              <img src={p.image || "https://via.placeholder.com/56"} alt={p.name} className="vto-cat-thumb-img" style={{ borderRadius: '8px' }} />
                            </div>
                            <span className="vto-sidebar-label">{p.name || p.brand}</span>
                          </div>
                        ))
                      }
                    </div>
                  )}

                  {sidePanel === 'shades' && (
                    <div className="vto-sidebar-items vto-sidebar-shades">
                      <div className="vto-sidebar-item" onClick={() => setSidePanel('products')}>
                        <div className="vto-sidebar-icon-box" style={{ background: 'transparent', border: 'none', color: '#fff' }}><FaChevronLeft size={24} /></div>
                      </div>
                      {loadingShades ? <div className="vto-spinner-wrap-small"><FaSpinner className="vto-spin" /></div> :
                        shades.map((shade, idx) => (
                          <div key={shade.sku || idx} className={`vto-sidebar-item ${activeShade === shade.sku ? 'active' : ''}`} onClick={() => applyShade(shade)}>
                            <div className="vto-sidebar-shade-square" style={{ backgroundColor: shade.hex.startsWith('#') ? shade.hex : '#' + shade.hex }} />
                            <span className="vto-sidebar-label">{shade.shadeName}</span>
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>
              )}

              <div
                ref={containerRef}
                className="vto-canvas-container"
                onMouseDown={compareMode ? handleBaDragStart : undefined}
                onMouseMove={compareMode ? handleBaDragMove : undefined}
                onMouseUp={compareMode ? handleBaDragEnd : undefined}
                onMouseLeave={compareMode ? handleBaDragEnd : undefined}
                onTouchStart={compareMode ? handleBaDragStart : undefined}
                onTouchMove={compareMode ? handleBaDragMove : undefined}
                onTouchEnd={compareMode ? handleBaDragEnd : undefined}
                style={{ position: 'relative', overflow: 'hidden', cursor: compareMode ? (isDragging ? 'ew-resize' : 'col-resize') : 'default', flex: 1, minHeight: 0 }}
              >
                {/* BEFORE Layer – Original camera/image (no makeup) */}
                <div
                  className="vto-ba-before-layer"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    zIndex: 1,
                  }}
                >
                  {mode === 'live' && (
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: 'scaleX(-1)',
                      }}
                      videoConstraints={{ facingMode: "user" }}
                    />
                  )}

                  {mode === 'photo' && uploadedImage && (
                    <img
                      ref={imageRef}
                      src={uploadedImage}
                      alt="Uploaded"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  )}
                </div>

                {/* AFTER Layer (Canvas with Makeup) – Clipped to show only right side */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    zIndex: 2,
                    clipPath: compareMode
                      ? `inset(0 0 0 ${baPos * 100}%)`
                      : 'none',
                  }}
                >
                  <canvas
                    ref={canvasRef}
                    className="vto-main-canvas"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: mode === 'live' ? 'scaleX(-1)' : 'none',
                      pointerEvents: 'none',
                    }}
                  />
                </div>

                {/* Compare Mode UI Overlay */}
                {compareMode && (
                  <>
                    {/* BEFORE / AFTER Labels */}
                    <div className="vto-compare-pills-container" style={{
                      position: 'absolute',
                      top: '60px',
                      left: 0,
                      right: 0,
                      zIndex: 10,
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '0 16px',
                      pointerEvents: 'none',
                    }}>
                      <div style={{
                        background: 'rgba(0,0,0,0.6)',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.3)',
                        borderRadius: '20px',
                        padding: '8px 18px',
                        fontSize: '12px',
                        fontWeight: 700,
                        letterSpacing: '1px',
                        backdropFilter: 'blur(4px)',
                        WebkitBackdropFilter: 'blur(4px)',
                        marginTop: '15px'

                      }}>
                        BEFORE
                      </div>
                      <div style={{
                        background: 'rgba(0,0,0,0.6)',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.3)',
                        borderRadius: '20px',
                        padding: '8px 16px',
                        fontSize: '12px',
                        fontWeight: 700,
                        letterSpacing: '1px',
                        backdropFilter: 'blur(4px)',
                        WebkitBackdropFilter: 'blur(4px)',
                        marginTop: '15px'

                      }}>
                        AFTER
                      </div>
                    </div>

                    {/* Back Button in Compare Mode */}
                    <button
                      onClick={handleBackFromCompare}
                      className="vto-compare-back-btn"
                      style={{
                        position: 'absolute',
                        top: '24px',
                        left: '12px',
                        zIndex: 15,
                        background: 'rgba(0,0,0,0.65)',
                        border: '1px solid rgba(255,255,255,0.25)',
                        borderRadius: '8px',
                        color: '#fff',
                        padding: '8px 14px',
                        fontSize: '13px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        backdropFilter: 'blur(6px)',
                        WebkitBackdropFilter: 'blur(6px)',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(0,0,0,0.85)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(0,0,0,0.65)';
                      }}
                    >
                      <FaArrowLeft size={14} />
                      Back
                    </button>

                    {/* Divider Line */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: `${baPos * 100}%`,
                        width: '3px',
                        background: 'rgba(255,255,255,0.9)',
                        boxShadow: '0 0 12px rgba(0,0,0,0.5), 0 0 4px rgba(0,0,0,0.3)',
                        zIndex: 10,
                        transform: 'translateX(-50%)',
                        pointerEvents: 'none',
                      }}
                    />

                    {/* Draggable Handle */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: `${baPos * 100}%`,
                        transform: 'translate(-50%, -50%)',
                        zIndex: 11,
                        pointerEvents: 'none',
                      }}
                    >
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.95)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                        border: '2px solid rgba(0,0,0,0.1)',
                      }}>
                        <div style={{ display: 'flex', gap: '3px' }}>
                          <div style={{ width: '3px', height: '16px', background: '#333', borderRadius: '2px' }} />
                          <div style={{ width: '3px', height: '16px', background: '#333', borderRadius: '2px' }} />
                        </div>
                      </div>
                    </div>

                    {/* Invisible wide drag strip for easy mobile touch */}
                    <div
                      onMouseDown={handleBaDragStart}
                      onTouchStart={handleBaDragStart}
                      style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: `${baPos * 100}%`,
                        width: '60px',
                        transform: 'translateX(-50%)',
                        zIndex: 12,
                        cursor: 'ew-resize',
                      }}
                    />
                  </>
                )}

                {!compareMode && <div className="vto-status" style={{ zIndex: 20 }}>{statusMsg}</div>}
              </div>

              {!compareMode && (
                <div className="vto-intensity-slider-wrap">
                  <div className="vto-slider-track-thin">
                    <input type="range" className="vto-vertical-slider-thin" min="0" max="100" value={intensity} onChange={handleIntensityChange} />
                  </div>
                  <div className="vto-slider-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="white" />
                    </svg>
                  </div>
                </div>
              )}

              {!compareMode && (
                <div className="vto-top-left-controls">
                  <button className="vto-back-btn-v2" onClick={goBackToLandingWithScroll} title="Go Back">
                    <FaChevronLeft />
                  </button>
                </div>
              )}

              {!compareMode && (
                <div className="vto-top-controls-v2">
                  <button className="vto-compare-btn" onClick={() => setCompareMode(true)}>COMPARE</button>
                  <button className="vto-close-btn-v2" onClick={goBackToLandingWithScroll}><FaTimes /></button>
                </div>
              )}

              <div className="vto-bottom-controls-v2">
                <button className="vto-download-btn-v2" onClick={downloadImage}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 15V19H5V15H3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V15H19ZM13 12.67L15.59 10.09L17 11.5L12 16.5L7 11.5L8.41 10.09L11 12.67V3H13V12.67Z" fill="white" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* INSTRUCTIONS SCREEN – kept as a modal for consistency */}
        {vtoStep === 'instructions' && (
          <div className="vto-instructions-screen">
            <div className="vto-instr-card">
              {/* Confirm Exit Dialog */}
              {showExitConfirm && (
                <div className="vto-exit-confirm-overlay">
                  <div className="vto-exit-confirm-box">
                    <div className="vto-exit-confirm-icon">✕</div>
                    <h3 className="vto-exit-confirm-title">Leave Try-On?</h3>
                    <p className="vto-exit-confirm-msg">Are you sure you want to exit? Your current session will not be saved.</p>
                    <div className="vto-exit-confirm-actions">
                      <button className="vto-exit-btn-cancel" onClick={handleCancelExit}>Stay</button>
                      <button className="vto-exit-btn-confirm" onClick={handleConfirmExit}>Yes, Exit</button>
                    </div>
                  </div>
                </div>
              )}
              <div className="vto-instr-header">
                <button className="vto-instr-icon-btn vto-instr-back-btn" onClick={handleInstrBack} title="Go Back">
                  <FaChevronLeft />
                </button>
                <div className="vto-instr-brand">
                  <img src={joyoryLogo} alt="Joyory" className="vto-instr-logo" />
                </div>
                <button className="vto-instr-icon-btn vto-instr-close-btn" onClick={handleInstrClose} title="Exit">
                  <FaTimes />
                </button>
              </div>
              <div className="vto-instr-content">
                <h2 className="vto-instr-title">PHOTO INSTRUCTIONS</h2>
                <p className="vto-instr-subtitle">
                  For the best virtual try-on experience, please follow these simple guidelines when taking or selecting your photo.
                </p>
                <div className="vto-instr-list">
                  <div className="vto-instr-item">
                    <div className="vto-instr-icon-box">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "16px", height: "16px" }}>
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <p>Use a Photo that is of the face straight on.</p>
                  </div>
                  <div className="vto-instr-item">
                    <div className="vto-instr-icon-box">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "16px", height: "16px" }}>
                        <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </div>
                    <p>Make Sure Nothing Is Obstructing The Face.</p>
                  </div>
                  <div className="vto-instr-item">
                    <div className="vto-instr-icon-box">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "16px", height: "16px" }}>
                        <circle cx="12" cy="12" r="4" />
                        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                      </svg>
                    </div>
                    <p>Make Sure That The Lighting Is Not Too Dim Or Too Bright.</p>
                  </div>
                </div>
              </div>
              <div className="vto-instr-footer">
                <button className="vto-btn-black-rect" onClick={() => fileInputRef.current?.click()}>UPLOAD PHOTO</button>
                <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" style={{ display: 'none' }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainVirtualTryon;





