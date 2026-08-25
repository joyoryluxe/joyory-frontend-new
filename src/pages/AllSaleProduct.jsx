import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { getActivePromotions } from "../api/promotionApi";
import "swiper/css";
import "swiper/css/pagination";
import "../styles/AllSaleProduct.css";
import gradient from "../assets/gradient.png"; // ✅ Import your image
import SectionError from "../components/common/SectionError";
import { getErrorMessage } from "../utils/errorHandler";

const Allsaleproduct = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchOffers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getActivePromotions({ section: "offers" });
      const data = response.data;
      const list = Array.isArray(data) ? data : data.promotions || [];
      setOffers(list);
    } catch (err) {
      console.error("Error fetching offers:", err);
      setError(getErrorMessage(err, "Failed to load special offers."));
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleOfferClick = (offerId) => {
    navigate(`/promotion/${offerId}`);
  };

  return (
    <div className="container-fluid my-4 ">
      <h2 className="fw-bold mt-3 mb-4 mb-lg-5 mt-lg-5 text-center spacing">Special Offers</h2>

      {loading ? (
        <p className="text-center text-muted">Loading offers...</p>
      ) : error ? (
        <SectionError message={error} onRetry={fetchOffers} />
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
                  backgroundImage: `url(${gradient})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  cursor: "pointer",
                }}
                onClick={() => handleOfferClick(offer.slug || offer._id)}
              >
                <img
                  src={offer.bannerImage || offer.image || gradient}
                  alt={offer.title || "Offer"}
                  className="category-img"
                  onError={(e) => {
                    e.currentTarget.src = gradient;
                  }}
                />
                <div className="p-2 text-center text-dark fw-medium fs-6">
                  {offer.title || offer.campaignName || "Special Offer"}
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

export default Allsaleproduct;
