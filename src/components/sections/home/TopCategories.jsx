// // src/components/TopCategories.jsx
// import React, { useEffect, useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules"; // Added Navigation
// import { useNavigate } from "react-router-dom";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation"; // Import navigation CSS
// import "../../../styles/Home.css";
// import "../../../App.css";

// const TopCategories = () => {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // Fetch categories from API
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch(
//           // "https://beauty.joyory.com/api/user/products/top-categories"
//           "https://beauty.joyory.com/api/user/products/top-categories"
//         );

//         const text = await response.text();

//         if (!response.ok) {
//           throw new Error(`Failed to fetch top categories: ${response.status}`);
//         }

//         const data = JSON.parse(text);
//         const list = Array.isArray(data) ? data : data.categories || [];
//         setCategories(list);
//       } catch (err) {
//         setCategories([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCategories();
//   }, []);

//   return (
//     // <div className="top-categories-wrapper container responsive-container  my-4">
//     <div className="top-categories-wrapper container-fluid mt-3 mt-lg-5 bg-white">
//       <h2 className="top-categories-title mb-1 text-left ms-lg-3 ms-2 ps-lg-4 mb-2 mb-lg-4 fw-normal">Top Categories</h2>

//       {loading ? (
//         <p className="text-center text-muted page-title-main-name">Loading categories...</p>
//       ) : categories.length === 0 ? (
//         <p className="text-center text-muted page-title-main-name">No categories found.</p>
//       ) : (

//         <div className="mobile-responsive-code" >
//         <Swiper
//           modules={[Autoplay, Pagination, Navigation]} // Added Navigation
//           pagination={{ clickable: true }}
//           navigation={true} // Enable arrows
//           autoplay={{ delay: 800, disableOnInteraction: false }}
//           speed={800}

//           breakpoints={{
//             300: { slidesPerView: 2 },
//             380: { slidesPerView: 2 },
//             576: { slidesPerView: 3 },
//             768: { slidesPerView: 3 },
//             992: { slidesPerView: 3 },
//             1024: { slidesPerView: 3 },
//             1200: { slidesPerView: 3 },
//             1400: { slidesPerView: 3 },
//           }}
//         >
//           {categories.map((cat, i) => (
//             <SwiperSlide key={cat._id || i}>
//               <div
//                 className="slide-item"
//                 onClick={() => navigate(`/category/${cat.slug}`)}
//                 style={{ cursor: "pointer" }}
//               >
//                 <div className="border-0">
//                   <img
//                     src={cat.thumbnailImage || `https://picsum.photos/400/200?random=${i}`}
//                     alt={cat.name || "Category"}
//                     className="top-cat-img top-category-image responsive-imagesss"
//                     onError={(e) => {
//                       e.currentTarget.src = `https://picsum.photos/400/200?random=${i}`;
//                     }}
//                   />
//                   <div className="top-cat-body text-center">
//                     <h5 className="top-cat-title mb-0 mt-3 font-weightss top-category-name-font text-start">
//                       {cat.name || "Unnamed"}
//                     </h5>
//                   </div>
//                 </div>
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>

//         </div>
//       )}
//     </div>
//   );
// };

// export default TopCategories;













// src/components/TopCategories.jsx
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules"; // Added Navigation
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation"; // Import navigation CSS
import "../../../styles/Home.css";
import "../../../App.css";

const TopCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          // "https://beauty.joyory.com/api/user/products/top-categories"
          "https://beauty.joyory.com/api/user/products/top-categories"
        );

        const text = await response.text();

        if (!response.ok) {
          throw new Error(`Failed to fetch top categories: ${response.status}`);
        }

        const data = JSON.parse(text);
        const list = Array.isArray(data) ? data : data.categories || [];
        setCategories(list);
      } catch (err) {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    // <div className="top-categories-wrapper container responsive-container  my-4">
    <div className="top-categories-wrapper container-fluid mt-3 mt-lg-5 bg-white">
      <h2 className="top-categories-title mb-1 text-left ms-lg-3 ms-2 ps-lg-4 mb-2 mb-lg-4 fw-normal">Top Categories</h2>

      {loading ? (
        <p className="text-center text-muted page-title-main-name">Loading categories...</p>
      ) : categories.length === 0 ? (
        <p className="text-center text-muted page-title-main-name">No categories found.</p>
      ) : categories.length < 3 ? (
        <div className="container-fluid px-lg-5">
          <div className="row g-4 justify-content-center">
            {categories.map((cat, i) => (
              <div key={cat._id || i} className="col-6 col-md-5 col-lg-5">
                <div
                  className="slide-item"
                  onClick={() => navigate(`/category/${cat.slug}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="border-0 top-cat-card">
                    <img
                      src={cat.thumbnailImage || `https://picsum.photos/400/200?random=${i}`}
                      alt={cat.name || "Category"}
                      className="top-cat-img top-category-image responsive-imagesss"
                      onError={(e) => {
                        e.currentTarget.src = `https://picsum.photos/400/200?random=${i}`;
                      }}
                    />
                    <div className="top-cat-body text-start">
                      <h5 className="top-cat-title mb-0 mt-3 font-weightss top-category-name-font">
                        {cat.name || "Unnamed"}
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mobile-responsive-code" >
          <Swiper
            modules={[Autoplay, Pagination, Navigation]} // Added Navigation
            pagination={{ clickable: true }}
            navigation={true} // Enable arrows
            autoplay={{ delay: 800, disableOnInteraction: false }}
            speed={800}

            breakpoints={{
              300: { slidesPerView: 2 },
              380: { slidesPerView: 2 },
              576: { slidesPerView: 3 },
              768: { slidesPerView: 3 },
              992: { slidesPerView: 3 },
              1024: { slidesPerView: 3 },
              1200: { slidesPerView: 3 },
              1400: { slidesPerView: 3 },
            }}
          >
            {categories.map((cat, i) => (
              <SwiperSlide key={cat._id || i}>
                <div
                  className="slide-item"
                  onClick={() => navigate(`/category/${cat.slug}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="border-0 top-cat-card">
                    <img
                      src={cat.thumbnailImage || `https://picsum.photos/400/200?random=${i}`}
                      alt={cat.name || "Category"}
                      className="top-cat-img top-category-image responsive-imagesss"
                      onError={(e) => {
                        e.currentTarget.src = `https://picsum.photos/400/200?random=${i}`;
                      }}
                    />
                    <div className="top-cat-body text-center">
                      <h5 className="top-cat-title mb-0 mt-3 font-weightss top-category-name-font text-start">
                        {cat.name || "Unnamed"}
                      </h5>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

        </div>
      )}
    </div>
  );
};

export default TopCategories;


