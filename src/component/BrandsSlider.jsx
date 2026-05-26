// // src/pages/BrandsSlider.jsx
// import React, { useEffect, useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination } from "swiper/modules";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "swiper/css";
// import "swiper/css/pagination";
// import "../css/BrandsSlider.css"; // custom css

// const BrandsSlider = () => {
//   const [brands, setBrands] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // ✅ Fetch brands
//   useEffect(() => {
//     const fetchBrands = async () => {
//       try {
//         const response = await axios.get(
//           "https://beauty.joyory.com/api/user/brands"
//         );
//         setBrands(response.data || []);
//       } catch (error) {
//         console.error("Error fetching brands:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBrands();
//   }, []);

//   if (loading) {
//     return <p>Loading brands...</p>;
//   }

//   if (!brands.length) {
//     return <p>No brands available.</p>;
//   }

//   return (
//     <div className="brands-slider-wrapper container my-4">
//       <h4 className="mb-3">SHOP BY BRANDS</h4>
//       <div className="brands-box">
//         <Swiper
//           modules={[Autoplay, Pagination]}
//           pagination={{ clickable: true }}
//           autoplay={{ delay: 2000, disableOnInteraction: false }}
//           speed={800}
//           spaceBetween={15}
//           breakpoints={{
//             300: { slidesPerView: 1 },
//             380: { slidesPerView: 1 },
//             576: { slidesPerView: 2 },
//             768: { slidesPerView: 3 },
//             992: { slidesPerView: 4 },
//             1200: { slidesPerView: 5 },
//           }}
//         >
//           {brands.map((brand, index) => (
//             <SwiperSlide key={index}>
//               <div
//                 className="brand-card text-center"
//                 onClick={() => navigate(`/brand/${brand.slug}`)}
//                 style={{ cursor: "pointer" }}
//               >
//                 <img
//                   src={brand.logo}
//                   alt={brand.name}
//                   className="brand-logo img-fluid"
//                   onError={(e) => {
//                     e.currentTarget.src = `https://picsum.photos/200/100?random=${index}`;
//                   }}
//                 />
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>
//     </div>
//   );
// };

// export default BrandsSlider;










// src/pages/BrandsSlider.jsx
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules"; // Added Navigation
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation"; // Import navigation CSS
import "../css/BrandsSlider.css"; // custom css
import "../css/Home.css";
import "../app.css";


const BrandsSlider = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(
          "https://beauty.joyory.com/api/user/brands"
        );
        setBrands(response.data || []);
      } catch (error) {
        console.error("Error fetching brands:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  if (loading) {
    return <p>Loading brands...</p>;
  }

  if (!brands.length) {
    return <p>No brands available.</p>;
  }

  return (
    <div className="brands-slider-wrapper container-fluid my-4" >
      {/* <h2 className="mb-3 text-center mt-3 mb-4 mb-lg-5 mt-lg-5 Shop-by-brand spacing">SHOP BY BRANDS</h2> */}
      <h3 className="mb-3 text-left ms-lg-5 ps-lg-4 mt-3 mb-2 mb-lg-4 mt-lg-5 Shop-by-brand spacing fw-normal">Shop By Brands</h3>
      <div className="brands-box mobile-responsive-code">
        <Swiper
          // modules={[Autoplay, Pagination, Navigation]} // Added Navigation
          modules={[Autoplay, Pagination]} // Added Navigation
          pagination={{ clickable: true }}
          navigation={false} // Enable arrows
          autoplay={{ delay: 1500, disableOnInteraction: false }}
          speed={800}
          spaceBetween={15}
          breakpoints={{
            300: { slidesPerView: 3 },
            380: { slidesPerView: 3 },
            576: { slidesPerView: 3 },
            768: { slidesPerView: 3 },
            992: { slidesPerView: 4 },
            1200:{ slidesPerView: 6 },
          }}
        >
          {brands.map((brand, index) => (
            <SwiperSlide key={index}>
              <div
                className="brand-card text-center"
                onClick={() => navigate(`/brand/${brand.slug}`)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="brand-logo img-fluid w-100"
                  onError={(e) => {
                    e.currentTarget.src = `https://picsum.photos/200/100?random=${index}`;
                  }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default BrandsSlider;
