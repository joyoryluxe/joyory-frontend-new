// src/components/VideoSlider.jsx
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules"; // Include Navigation
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "bootstrap/dist/css/bootstrap.min.css";

const VideoSlider = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(
          "https://beauty.joyory.com/api/user/videos"
        );
        const data = await response.json();
        // console.log("API Response:", data); // Removed

        if (Array.isArray(data.items)) {
          setVideos(data.items);
        } else {
          setVideos([]);
        }
      } catch (err) {
        console.error("Error fetching videos:", err);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <p className="text-center">Loading videos...</p>;
  }

  return (
    <section className="container-fluid my-5 px-3">
      <h2 className="text-center mt-3 mb-4 mb-lg-5 mt-lg-5 text-center font-family-Playfair fw-bold spacing">BEAUTY ADVICE</h2>

      {videos.length > 0 ? (
        <div className="mobile-responsive-code">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]} // Add Navigation here
          pagination={{ clickable: true }}
          navigation={true} // Enable next/prev arrows
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          speed={800}
          spaceBetween={15}
          breakpoints={{
            300: { slidesPerView: 2 },
            576: { slidesPerView: 2 },
            768: { slidesPerView: 2 },
            992: { slidesPerView: 3 },
            1200: { slidesPerView: 6 },
          }}
        >
          {videos.map((video, i) => (
            <SwiperSlide key={video._id || i}>
              <div className="px-2">
                <div className="position-relative">
                  {/* Responsive video wrapper */}
                  <div
                    style={{
                      position: "relative",
                      paddingBottom: "56.25%", // 16:9 aspect ratio
                      height: 0,
                      overflow: "hidden",
                    }}
                  >
                    <iframe
                      src={video.embedUrl}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        border: "none",
                      }}
                    ></iframe>
                  </div>
                  <div className="text-center mt-2" style={{
                    lineHeight: "15px"
                  }}>
                    <small className="font-family-Poppins">{video.title}</small>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        </div>
      ) : (
        <p className="text-center">No videos found.</p>
      )}
    </section>
  );
};

export default VideoSlider;
