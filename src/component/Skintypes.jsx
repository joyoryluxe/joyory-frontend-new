// // src/components/Skintypes.jsx
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules"; // Added Navigation
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation"; // Import navigation CSS
// import "../css/SkinTypes.css";

// export default function Skintypes() {
//   const [skinTypes, setSkinTypes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   // Fetch skin types from the API
//   useEffect(() => {
//     const fetchSkinTypes = async () => {
//       try {
//         const response = await axios.get(
//           "https://beauty.joyory.com/api/user/products/skin-types"
//         );

//         const data =
//           response.data?.skinTypes ||
//           response.data?.data ||
//           response.data?.items ||
//           response.data ||
//           [];

//         setSkinTypes(data);
//         setLoading(false);
//       } catch (err) {
//         console.error("API error:", err);
//         setError("Failed to load skin types.");
//         setLoading(false);
//       }
//     };

//     fetchSkinTypes();
//   }, []);

//   return (
//     <div className="container-fluid mt-lg-5">
//       {/* <h2 className="text-center mt-3 mb-4 mb-lg-5 mt-lg-5 font-family-Playfair fw-bold spacing">SHOP BY SKIN TYPES</h2> */}
//       <h2 className="mb-3 text-left ms-lg-0 ps-lg-5 mt-3 mb-2 mb-lg-4 mt-lg-5 skintype-heading spacing fw-normal">Shop By Skin Types</h2>

//       {loading && <p className="text-center">Loading skin types...</p>}
//       {error && <p className="text-center text-danger">{error}</p>}

//       {!loading && !error && skinTypes.length > 0 ? (
//         <div className="mobile-responsive-code">
//           <Swiper
//             modules={[Autoplay, Pagination, Navigation]} // Added Navigation
//             pagination={{ clickable: true }}
//             navigation={true} // Enable arrows
//             autoplay={{ delay: 2500, disableOnInteraction: false }}
//             speed={800}
//             spaceBetween={15}
//             breakpoints={{
//               // 300: { slidesPerView: 2 , spaceBetween: 10  },
//               // 576: { slidesPerView: 2 , spaceBetween: 15  },
//               // 768: { slidesPerView: 3 , spaceBetween: 15  },
//               // 992: { slidesPerView: 4 , spaceBetween: 20  },
//               // 1200: { slidesPerView: 5, spaceBetween: 25  },


//               300: { slidesPerView: 2, spaceBetween: 0 },
//               380: { slidesPerView: 2, spaceBetween: 0 },
//               576: { slidesPerView: 3, spaceBetween: 0 },
//               768: { slidesPerView: 3, spaceBetween: 0 },
//               992: { slidesPerView: 3, spaceBetween: 0 },
//               1024: { slidesPerView: 4, spaceBetween: 0 },
//               1200: { slidesPerView: 5, spaceBetween: 0 },
//               1400: { slidesPerView: 5, spaceBetween: 0 },

//             }}
//           >
//             {skinTypes.map((type, index) => (
//               <SwiperSlide key={index} className="">
//                 <div
//                   className="p-2"
//                   onClick={() => navigate(`/products/skintype/${type.slug}`)}
//                   style={{ cursor: "pointer" }}
//                 >
//                   <div className="skin-card">
//                     <img
//                       src={type.image || "https://via.placeholder.com/400x250"}
//                       alt={type.name}
//                       className="img-fluid  "
//                       style={{ objectFit: "cover", width: "100%", height: "100%" }}
//                     />
//                     {/* <div className="overlay">
//                       <h5 className="main-skintype-heading m-0 p-0">{type.name}</h5>
//                     </div> */}
//                   </div>
//                 </div>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </div>
//       ) : (
//         !loading && <p className="text-center">No skin types found.</p>
//       )}
//     </div>
//   );
// }

















// src/components/Skintypes.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../css/SkinTypes.css";

export default function Skintypes() {
  const [skinTypes, setSkinTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch skin types from the API
  useEffect(() => {
    const fetchSkinTypes = async () => {
      try {
        const response = await axios.get(
          "https://beauty.joyory.com/api/user/products/skin-types"
        );

        const data =
          response.data?.skinTypes ||
          response.data?.data ||
          response.data?.items ||
          response.data ||
          [];

        setSkinTypes(data);
        setLoading(false);
      } catch (err) {
        console.error("API error:", err);
        setError("Failed to load skin types.");
        setLoading(false);
      }
    };

    fetchSkinTypes();
  }, []);

  // Handle skin type click - navigate with state for BrandFilter
  const handleSkinTypeClick = (type) => {
    // Navigate to products page with skin type filter
    // Pass state to indicate this is a skin type selection for BrandFilter
    navigate(`/products/skintype/${type.slug}`, {
      state: {
        activeSkinTypeSlug: type.slug,
        activeSkinTypeName: type.name,
        fromSkinTypes: true,
        // Preserve any existing location state
        ...location.state
      }
    });
  };

  return (
    <div className="container-fluid mt-lg-5">
      <h2 className="mb-3 text-left ms-lg-0 ps-lg-5 mt-3 mb-2 mb-lg-4 mt-lg-5 skintype-heading spacing fw-normal">Shop By Skin Types</h2>

      {loading && <p className="text-center">Loading skin types...</p>}
      {error && <p className="text-center text-danger">{error}</p>}

      {!loading && !error && skinTypes.length > 0 ? (
        <div className="mobile-responsive-code">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            pagination={{ clickable: true }}
            navigation={true}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            speed={800}
            spaceBetween={15}
            breakpoints={{
              300: { slidesPerView: 2, spaceBetween: 0 },
              380: { slidesPerView: 2, spaceBetween: 0 },
              576: { slidesPerView: 3, spaceBetween: 0 },
              768: { slidesPerView: 3, spaceBetween: 0 },
              992: { slidesPerView: 3, spaceBetween: 0 },
              1024: { slidesPerView: 4, spaceBetween: 0 },
              1200: { slidesPerView: 5, spaceBetween: 0 },
              1400: { slidesPerView: 5, spaceBetween: 0 },
            }}
          >
            {skinTypes.map((type, index) => (
              <SwiperSlide key={index} className="">
                <div
                  className="p-2"
                  onClick={() => handleSkinTypeClick(type)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="skin-card">
                    <img
                      src={type.image || "https://via.placeholder.com/400x250"}
                      alt={type.name}
                      className="img-fluid"
                      style={{ objectFit: "cover", width: "100%", height: "100%" }}
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        !loading && <p className="text-center">No skin types found.</p>
      )}
    </div>
  );
}






















