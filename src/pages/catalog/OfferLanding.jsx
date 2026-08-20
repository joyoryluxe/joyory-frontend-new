import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { UserContext } from "../../context/UserContext.jsx";
import ProductCard from "../../components/common/ProductCard";
import useWishlist from "../../hooks/useWishlist";
import { getProductDisplayData } from "../../utils/productHelpers";
import OfferHeroBanner from "../../components/sections/catalog/OfferHeroBanner";
import "../../styles/OfferLanding.css";
import "../../styles/BestSellers.css";

// Import Swiper and its styles
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { getOffersPage } from "../../api/promotionApi";

// Custom Section Slider Component
const SectionSlider = ({
    children,
    slidesPerView = 4,
    spaceBetween = 20,
    breakpoints = {},
}) => {
    const swiperRef = useRef(null);

    const defaultBreakpoints = {
        320: { slidesPerView: 2, spaceBetween: 10 },
        576: { slidesPerView: 3, spaceBetween: 15 },
        768: { slidesPerView: Math.min(slidesPerView, 4), spaceBetween: 20 },
    };

    const baseBreakpoints = { ...defaultBreakpoints, ...breakpoints };
    const finalBreakpoints = {};

    Object.keys(baseBreakpoints).forEach((key) => {
        const width = parseInt(key, 10);
        const bp = baseBreakpoints[key];
        if (width >= 992) {
            finalBreakpoints[key] = {
                ...bp,
                slidesPerView: slidesPerView,
            };
        } else {
            finalBreakpoints[key] = {
                ...bp,
                slidesPerView: Math.min(bp.slidesPerView, slidesPerView),
            };
        }
    });

    return (
        <div className="position-relative margintop-sss py-2">
            <button
                onClick={() => swiperRef.current?.swiper?.slidePrev()}
                className="btn btn-light rounded-circle position-absolute start-0 top-50 translate-middle-y z-3 d-none d-md-flex align-items-center justify-content-center p-0"
                style={{
                    width: "40px",
                    height: "40px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    border: "1px solid #dee2e6",
                }}
            >
                <FaChevronLeft size={16} />
            </button>

            <button
                onClick={() => swiperRef.current?.swiper?.slideNext()}
                className="btn btn-light rounded-circle position-absolute end-0 top-50 translate-middle-y z-3 d-none d-md-flex align-items-center justify-content-center p-0"
                style={{
                    width: "40px",
                    height: "40px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    border: "1px solid #dee2e6",
                }}
            >
                <FaChevronRight size={16} />
            </button>

            <Swiper
                ref={swiperRef}
                slidesPerView={1}
                spaceBetween={spaceBetween}
                breakpoints={finalBreakpoints}
                navigation={false}
                className="section-slider px-1"
            >
                {children}
            </Swiper>
        </div>
    );
};

export default function OffersPage() {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    // State
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Wishlist (shared hook)
    const { wishlistData, wishlistLoading, toggleWishlist } = useWishlist(user);

    /* ========== FETCH OFFERS DATA ========== */
    useEffect(() => {
        const fetchOffersData = async () => {
            try {
                setLoading(true);
                const { data: resData } = await getOffersPage();
                setData(resData);
            } catch (err) {
                console.error("Failed to load offers page:", err);
                setError(err.response?.data?.message || "Failed to load offers page");
            } finally {
                setLoading(false);
            }
        };
        fetchOffersData();
    }, []);

    /* ========== LINK NAVIGATION HANDLER ========== */
    const handleLinkNavigation = (link) => {
        if (!link) return;
        try {
            const currentHost = window.location.host;
            const linkUrl = new URL(link, window.location.origin);
            if (linkUrl.host === currentHost) {
                navigate(linkUrl.pathname + linkUrl.search + linkUrl.hash);
            } else {
                window.location.href = link;
            }
        } catch (e) {
            navigate(link);
        }
    };

    if (loading)
        return (
            <div
                className="fullscreen-loader page-title-main-name"
                style={{
                    minHeight: "100vh",
                    width: "100%",
                }}
            >
                <div className="text-center">
                    <DotLottieReact
                        className="foryoulanding-css"
                        src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
                        loop
                        autoplay
                    />
                    <p className="text-muted mb-0">
                        Please wait while we prepare the best products for you...
                    </p>
                </div>
            </div>
        );

    if (error || !data)
        return (
            <>
                <Header />
                <div className="container text-center py-5">
                    <h3 className="text-danger">Error</h3>
                    <p className="text-muted">{error || "Failed to load"}</p>
                </div>
                <Footer />
            </>
        );

    const { banner, joyBanner, brandPromotions, categoryPromotions, cantMissThis, discountRanges, offerProducts } = data;

    return (
        <>
            <Header />
            <style>{`
        .cursor-pointer { cursor: pointer; }
        .hover-lift { transition: transform 0.3s ease; }
        .ticket-card { background: #E6EEF2; }
        .ticket-card:hover { background: #E6EEF2; }
      `}</style>

            {/* 1. Main Top Banner */}
            <OfferHeroBanner banner={banner} onLinkNavigation={handleLinkNavigation} />

            <div className="container-fluid px-md-5 pt-0 mt-0 bg-white">
                {/* 2. Manual Products Mapping (Offer Products) */}
                {offerProducts?.length > 0 &&
                    offerProducts.map((section) => (
                        <section key={section._id} className="pt-2 pb-lg-3 mb-3">
                            <h3 className="top-categories-title mb-lg-2 mb-3 p-0 ms-md-0 page-title-main-name fw-normal mt-4">
                                {section.title}
                            </h3>
                            <SectionSlider
                                slidesPerView={4}
                                spaceBetween={20}
                                breakpoints={{
                                    320: { slidesPerView: 2, spaceBetween: 10 },
                                    576: { slidesPerView: 2.5, spaceBetween: 15 },
                                    768: { slidesPerView: 3, spaceBetween: 20 },
                                    992: { slidesPerView: 4, spaceBetween: 20 },
                                    1200: { slidesPerView: 4, spaceBetween: 20 },
                                }}
                            >
                                {section.products?.map((prod) => {
                                    const displayData = getProductDisplayData(prod);
                                    if (!displayData) return null;
                                    return (
                                        <SwiperSlide key={prod._id} className="h-auto page-title-main-name">
                                            <ProductCard
                                                item={displayData}
                                                wishlistData={wishlistData}
                                                wishlistLoading={wishlistLoading}
                                                toggleWishlist={toggleWishlist}
                                            />
                                        </SwiperSlide>
                                    );
                                })}
                            </SectionSlider>
                        </section>
                    ))}

                {/* 3. Brand Promotions */}
                {brandPromotions?.items?.length > 0 && (
                    <section className="page-title-main-name">
                        <h3 className="top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal">
                            {brandPromotions.title}
                        </h3>
                        <SectionSlider
                            slidesPerView={4}
                            spaceBetween={20}
                            breakpoints={{
                                320: { slidesPerView: 1.2, spaceBetween: 15 },
                                576: { slidesPerView: 2, spaceBetween: 15 },
                                768: { slidesPerView: 3, spaceBetween: 20 },
                                992: { slidesPerView: 3, spaceBetween: 20 },
                            }}
                        >
                            {brandPromotions.items.map((promo) => (
                                <SwiperSlide key={promo._id}>
                                    <div
                                        className="h-100 cursor-pointer hover-lift rounded-3 overflow-hidden"
                                        onClick={() => navigate(`/brand/${promo.targetSlug}`)}
                                    >
                                        <img
                                            src={promo.image}
                                            alt={promo.title}
                                            className="card-img-top w-100 mt-lg-3 mt-2"
                                            style={{ height: "auto", objectFit: "cover" }}
                                        />
                                        <div className="pt-3 text-center">
                                            <h6 className="card-title text-start text-truncate m-0 mb-1">
                                                {promo.title}
                                            </h6>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </SectionSlider>
                    </section>
                )}

                {/* 4. Discount Ranges (Offers In Focus) */}
                {discountRanges?.items?.length > 0 && (
                    <section className="mb-lg-5 mb-4" style={{ height: "auto" }}>
                        <h3 className="top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal mt-lg-4 mt-3">
                            {discountRanges.title}
                        </h3>

                        <SectionSlider
                            slidesPerView={3}
                            spaceBetween={15}
                            breakpoints={{
                                320: { slidesPerView: 2, spaceBetween: 10 },
                                576: { slidesPerView: 2.5, spaceBetween: 12 },
                                768: { slidesPerView: 3, spaceBetween: 15 },
                                992: { slidesPerView: 3, spaceBetween: 18 },
                                1200: { slidesPerView: 3, spaceBetween: 20 },
                            }}
                        >
                            {discountRanges.items.map((range, index) => (
                                <SwiperSlide key={index}>
                                    <div
                                        className="mt-lg-3 mt-1 ticket-card p-4 text-center cursor-pointer hover-lift d-lg-flex flex-row justify-content-center gap-2 page-title-main-name align-items-center"
                                        style={{
                                            height: "120px",
                                            borderRadius: "0"
                                        }}
                                        onClick={() => {
                                            const discountPercent = parseInt(range.subLabel);
                                            if (!isNaN(discountPercent)) {
                                                navigate(`/products/category/?discountMin=${discountPercent}`);
                                            } else {
                                                navigate('/products');
                                            }
                                        }}
                                    >
                                        <span
                                            className="text-black pt-lg-0 pt-3 d-block text-uppercase offer-font-weight-500"
                                            style={{ fontSize: "16px", letterSpacing: "1px" }}
                                        >
                                            {range.label}
                                        </span>
                                        <h4 className="m-0 text-black offer-font-weight-500" style={{ fontSize: "16px" }}>
                                            {range.subLabel}
                                        </h4>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </SectionSlider>
                    </section>
                )}

                {/* 5. Category Promotions */}
                {categoryPromotions?.items?.length > 0 && (
                    <section className="mb-4 mt-lg-5">
                        <h3 className="top-categories-title mb-0 ms-lg-1 ms-1 ms-md-0 page-title-main-name fw-normal">
                            {categoryPromotions.title}
                        </h3>
                        <SectionSlider
                            slidesPerView={4}
                            spaceBetween={20}
                            breakpoints={{
                                320: { slidesPerView: 2, spaceBetween: 15 },
                                576: { slidesPerView: 2, spaceBetween: 15 },
                                768: { slidesPerView: 3, spaceBetween: 20 },
                                992: { slidesPerView: 3, spaceBetween: 20 },
                            }}
                        >
                            {categoryPromotions.items.map((promo) => (
                                <SwiperSlide key={promo._id}>
                                    <div
                                        className="h-100 cursor-pointer hover-lift overflow-hidden page-title-main-name mt-3 mb-3"
                                        onClick={() => navigate(`/Products/category/${promo.targetSlug}`)}
                                    >
                                        <img
                                            src={promo.image}
                                            alt={promo.title}
                                            className="card-img-top w-100"
                                            style={{ height: "200px", objectFit: "cover" }}
                                        />
                                        <div className="pt-3">
                                            <p className="text-start mobile-responsive-design-text text-truncate m-0">{promo.description}</p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </SectionSlider>
                    </section>
                )}

                {/* 6. Joy Rewards Banner */}
                {joyBanner && (
                    <div
                        className="page-title-main-name row overflow-hidden mb-lg-5 mb-3 ms-lg-0 align-items-center hover-lift cursor-pointer"
                        onClick={() => handleLinkNavigation(joyBanner.link)}
                    >
                        <div className="col-md-5 p-0">
                            <img
                                src={joyBanner.image?.[0]?.url || joyBanner.image}
                                alt={joyBanner.title}
                                className="img-fluid w-100 h-100 px-lg-0 px-3"
                                style={{ objectFit: "cover", minHeight: "250px" }}
                            />
                        </div>
                        <div className="col-md-7 p-2 mt-3 p-md-5 d-flex flex-column justify-content-center">
                            <h2 className="fw-bold mb-3 reword-heading-responsive page-title-main-name text-black">{joyBanner.title}</h2>
                            {joyBanner.description && (
                                <p
                                    className="page-title-main-name fs-6 offers-line-height"
                                    dangerouslySetInnerHTML={{ __html: joyBanner.description }}
                                />
                            )}
                            {joyBanner.buttonText && (
                                <button
                                    className="btn btn-dark btn-lg mt-lg-3 px-5 py-2 align-self-start start-shopping-btnsa"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const link = joyBanner.image?.[0]?.link || joyBanner.link;
                                        if (link) handleLinkNavigation(link);
                                    }}
                                >
                                    {joyBanner.buttonText}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* 7. Can't Miss This (Pricing & Combo Deals) */}
                {cantMissThis?.items?.length > 0 && (
                    <section className="mb-5">
                        <h3 className="top-categories-title mb-0 p-1 ms-md-0 mb-lg-3 mb-2 page-title-main-name fw-normal">
                            {cantMissThis.title}
                        </h3>
                        <SectionSlider
                            slidesPerView={3}
                            spaceBetween={15}
                            breakpoints={{
                                320: { slidesPerView: 2, spaceBetween: 10 },
                                576: { slidesPerView: 2.5, spaceBetween: 12 },
                                768: { slidesPerView: 3, spaceBetween: 15 },
                                992: { slidesPerView: 3, spaceBetween: 18 },
                                1200: { slidesPerView: 3, spaceBetween: 20 },
                            }}
                        >
                            {cantMissThis.items.map((item, index) => (
                                <SwiperSlide key={index}>
                                    <div
                                        className="offersss ticket-card text-white text-center border-0 shadow-sm cursor-pointer hover-lift py-4 px-2 rounded-3 d-lg-flex flex-lg-row justify-content-center align-items-center gap-2 page-title-main-name"
                                        style={{ height: "140px" }}
                                        onClick={() => {
                                            const discountPercent = parseInt(item.subLabel);
                                            if (!isNaN(discountPercent)) {
                                                navigate(`/products/category/?discountMin=${discountPercent}`);
                                            } else {
                                                navigate('/products');
                                            }
                                        }}
                                    >
                                        <span className="text-black d-block pt-lg-0 pt-3 offersssfonts offer-font-weight-500">
                                            {item.subLabel}
                                        </span>
                                        <h4 className="m-0 text-black offersssfonts offer-font-weight-500">
                                            {item.label}
                                        </h4>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </SectionSlider>
                    </section>
                )}
            </div>

            <Footer />
        </>
    );
}
