
// // src/pages/Allsaleproduct.jsx
// import React, { useEffect, useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";
// import "../css/Allsaleproduct.css";

// const Allsaleproduct = () => {
//   const [offers, setOffers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOffers = async () => {
//       try {
//         const response = await fetch(
//           "https://beauty.joyory.com/api/user/promotions/active?section=offers"
//         );

//         const text = await response.text(); // debug step
//         console.log("Allsaleproduct API response:", text);

//         if (!response.ok) {
//           throw new Error(`Failed to fetch offers: ${response.status}`);
//         }

//         const data = JSON.parse(text);

//         // Ensure it's always an array
//         const list = Array.isArray(data) ? data : data.promotions || [];
//         setOffers(list);
//       } catch (err) {
//         console.error("Error fetching offers:", err);
//         setOffers([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOffers();
//   }, []);

//   return (
//     <div className="container my-4">
//       <h2 className="fw-bold mb-3">Special Offers</h2>

//       {loading ? (
//         <p className="text-center text-muted">Loading offers...</p>
//       ) : offers.length === 0 ? (
//         <p className="text-center text-muted">No offers found.</p>
//       ) : (
//         <Swiper
//           modules={[Autoplay, Pagination]}
//           pagination={{ clickable: true }}
//           autoplay={{ delay: 2500, disableOnInteraction: false }}
//           speed={800}
//           spaceBetween={15}
//           breakpoints={{
//             300: { slidesPerView: 1 },
//             576: { slidesPerView: 2 },
//             768: { slidesPerView: 2 },
//             992: { slidesPerView: 3 },
//             1200: { slidesPerView: 4 },
//           }}
//         >
//           {offers.map((offer, i) => (
//             <SwiperSlide key={offer._id || i}>
//               <div
//                 className="category-card"
//                 style={{
//                   background: offer.gradient || `linear-gradient(135deg, #${Math.floor(Math.random()*16777215).toString(16)}, #${Math.floor(Math.random()*16777215).toString(16)})`,
//                   cursor: "pointer",
//                 }}
//                 onClick={() => console.log("Clicked offer:", offer.title)}
//               >
//                 <span className="category-title">
//                   {offer.title || offer.name || "Untitled Offer"}
//                 </span>
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       )}
//     </div>
//   );
// };

// export default Allsaleproduct;












// // src/pages/Allsaleproduct.jsx
// import React, { useEffect, useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination } from "swiper/modules";
// import { useNavigate } from "react-router-dom";
// import "swiper/css";
// import "swiper/css/pagination";
// import "../css/Allsaleproduct.css";
// // import gradient from"../assets/gradient bg.png"

// const Allsaleproduct = () => {
//   const [offers, setOffers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchOffers = async () => {
//       try {
//         const response = await fetch(
//           "https://beauty.joyory.com/api/user/promotions/active?section=offers"
//         );

//         const text = await response.text();
//         console.log("Allsaleproduct API response:", text);

//         if (!response.ok) {
//           throw new Error(`Failed to fetch offers: ${response.status}`);
//         }

//         const data = JSON.parse(text);
//         const list = Array.isArray(data) ? data : data.promotions || [];
//         setOffers(list);
//       } catch (err) {
//         console.error("Error fetching offers:", err);
//         setOffers([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOffers();
//   }, []);

//   const handleOfferClick = (offerId) => {
//     // Navigate to ProductPage with promotion id
//     navigate(`/promotion/${offerId}`);
//   };

//   return (
//     <div className="container my-4">
//       <h2 className="fw-bold mb-3">Special Offers</h2>

//       {loading ? (
//         <p className="text-center text-muted">Loading offers...</p>
//       ) : offers.length === 0 ? (
//         <p className="text-center text-muted">No offers found.</p>
//       ) : (
//         <Swiper
//           modules={[Autoplay, Pagination]}
//           pagination={{ clickable: true }}
//           autoplay={{ delay: 2500, disableOnInteraction: false }}
//           speed={800}
//           spaceBetween={15}
//           breakpoints={{
//             300: { slidesPerView: 1 },
//             576: { slidesPerView: 2 },
//             768: { slidesPerView: 2 },
//             992: { slidesPerView: 3 },
//             1200: { slidesPerView: 4 },
//           }}
//         >
//           {offers.map((offer, i) => (
//             <SwiperSlide key={offer._id || i}>
//               <div
//                 className="category-card"
//                 style={{
//                   background:
//                     offer.gradient ||
//                     `linear-gradient(135deg, #${Math.floor(
//                       Math.random() * 16777215
//                     ).toString(16)}, #${Math.floor(
//                       Math.random() * 16777215
//                     ).toString(16)})`,
//                   cursor: "pointer",
//                 }}
//                 onClick={() => handleOfferClick(offer._id)}
//               >
//                 <span className="category-title">
//                   {offer.title || offer.name || "Untitled Offer"}
//                 </span>
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       )}
//     </div>
//   );
// };

// export default Allsaleproduct;























// src/pages/Allsaleproduct.jsx
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import "../css/Allsaleproduct.css";
import gradient from "../assets/gradient.png"; // ✅ Import your image

const Allsaleproduct = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch(
          "https://beauty.joyory.com/api/user/promotions/active?section=offers"
        );

        const text = await response.text();

        if (!response.ok) {
          throw new Error(`Failed to fetch offers: ${response.status}`);
        }

        const data = JSON.parse(text);
        const list = Array.isArray(data) ? data : data.promotions || [];
        setOffers(list);
      } catch (err) {
        console.error("Error fetching offers:", err);
        setOffers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const handleOfferClick = (offerId) => {
    navigate(`/promotion/${offerId}`);
  };

  return (
    <div className="container-fluid my-4 ">
      <h2 className="fw-bold mt-3 mb-4 mb-lg-5 mt-lg-5 font-family-Playfair text-center spacing">Special Offers</h2>

      {loading ? (
        <p className="text-center text-muted">Loading offers...</p>
      ) : offers.length === 0 ? (
        <p className="text-center text-muted">No offers found.</p>
      ) : (
         <div className="mobile-responsive-code">
        <Swiper
          modules={[Autoplay, Pagination]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          speed={800}
          spaceBetween={15}
          breakpoints={{
            300: { slidesPerView: 2 },
            576: { slidesPerView: 2 },
            768: { slidesPerView: 2 },
            992: { slidesPerView: 3 },
            1200: { slidesPerView: 4 },
          }}
        >
          {offers.map((offer, i) => (
            <SwiperSlide key={offer._id || i}>
              <div
                className="category-card"
                style={{
                  backgroundImage: `url(${gradient})`, // ✅ Image instead of gradient
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  cursor: "pointer",
                }}
                onClick={() => handleOfferClick(offer._id)}
              >
                <span className="category-title">
                  {offer.title || offer.name || "Untitled Offer"}
                </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        </div>
      )}
    </div>
  );
};

export default Allsaleproduct;
