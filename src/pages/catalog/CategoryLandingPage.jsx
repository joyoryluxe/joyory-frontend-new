// CategoryLandingPage.jsx
import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { UserContext } from "../../context/UserContext.jsx";
import "../../styles/CategoryLandingPage.css";
import "../../styles/BestSellers.css";
import "../../styles/SkinTypes.css";
import vtoMobileBanner from "../../assets/vto_mobile_banner.png";
import shadeFinderMobileBanner from "../../assets/shade_finder_mobile_banner.png";
import quizMobileBanner from "../../assets/quiz_mobile_banner.png";
import SEOMeta from "../../components/common/SEOMeta";
import PageNotFound from "../content/PageNotFound";
import SectionError from "../../components/common/SectionError";
import ProductCard from "../../components/common/ProductCard";
import useWishlist from "../../hooks/useWishlist";
import { getProductDisplayData } from "../../utils/productHelpers";
import CategoryHeroBanner from "../../components/sections/catalog/CategoryHeroBanner";

// Import Swiper and its styles
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Certificate from "../../components/sections/home/Certificate.jsx";

import { getCategoryLanding } from "../../api/categoryApi";

/**
 * Custom Section Slider Component
 */
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
        768: { slidesPerView: Math.min(slidesPerView, 3), spaceBetween: 20 },
        1200: { slidesPerView: Math.min(slidesPerView, 4), spaceBetween: 20 },
        1600: { slidesPerView: Math.min(slidesPerView + 1, 5), spaceBetween: 24 },
        1920: { slidesPerView: Math.min(slidesPerView + 2, 6), spaceBetween: 24 },
        2560: { slidesPerView: Math.min(slidesPerView + 4, 8), spaceBetween: 30 },
        3840: { slidesPerView: Math.min(slidesPerView + 6, 10), spaceBetween: 30 }
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
        <div className="position-relative margintop-sss">
            <Swiper
                ref={swiperRef}
                slidesPerView={1}
                spaceBetween={spaceBetween}
                breakpoints={finalBreakpoints}
                navigation={false}
                className="section-slider"
            >
                {children}
            </Swiper>
        </div>
    );
};

export default function CategoryLandingPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    // Wishlist (shared hook)
    const { wishlistData, wishlistLoading, toggleWishlist } = useWishlist(user);

    // Effective slug for handling nested routes
    const effectiveSlug = slug?.includes("/")
        ? slug.split("/").pop()
        : slug;

    // State
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [show404, setShow404] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSlideChange = () => { };

    /* ========== FETCH LANDING DATA ========== */
    const fetchLandingData = async () => {
        try {
            setLoading(true);
            setError(null);
            setShow404(false);
            setErrorMessage("");

            const res = await getCategoryLanding(effectiveSlug);
            setData(res.data);
        } catch (err) {
            console.error("Failed to load category landing:", err);
            const status = err.response?.status;
            const message = err.response?.data?.message || err.message;

            if (status === 404) {
                setShow404(true);
            } else {
                setError(err);
                setErrorMessage(message || "Failed to load category landing page.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLandingData();
    }, [effectiveSlug]);

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

    /* ========== RENDER SECTIONS ========== */
    if (loading)
        return (
            <div
                className="d-flex flex-column align-items-center justify-content-center bg-white"
                style={{
                    minHeight: "100vh",
                    width: "100%",
                }}
            >
                <div className="text-center">
                    <DotLottieReact
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

    if (show404) {
        return <PageNotFound />;
    }

    if (error || (!data && !loading)) {
        return (
            <>
                <Header />
                <div className="container my-5 py-5">
                    <SectionError
                        error={error}
                        message={errorMessage || "Failed to load category."}
                        variant="full"
                        onRetry={fetchLandingData}
                    />
                </div>
                <Footer />
            </>
        );
    }

    const {
        category,
        subCategoriesTitle,
        subCategories,
        promotionsTitle,
        promotions,
        brandsTitle,
        brands,
        topSellersTitle,
        topSellers,
        skinTypesTitle,
        skinTypes,
        shopByIngredientsTitle,
        shopByIngredients,
        findsForYou,
        featureBanners,
        inFocusTitle,
        inFocus,
    } = data;

    return (
        <>
            <SEOMeta type="category" slug={effectiveSlug} />
            <Header />

            {/* Hero Banner Slider */}
            <CategoryHeroBanner
                category={category}
                onSlideChange={handleSlideChange}
                onLinkNavigation={handleLinkNavigation}
            />

            {/* Main Content Container */}
            <div className="container-fluid p-md-5 p-lg-2 py-lg-4 pt-lg-2">
                {/* Category Title */}
                <div
                    className="mb-0 cursor-pointer"
                    onClick={() => navigate(`/category/${category.slug}`)}
                />

                {/* Sub Categories (Top Category) - Slider */}
                {subCategories?.length > 0 && (
                    <section className="mb padding-left-right-sub-category">
                        <div className="mt-3 d-flex justify-content-between align-items-center">
                            <h2 className="top-categories-title mb-3 page-title-main-name fw-normal">
                                {subCategoriesTitle || "Top Categories"}
                            </h2>
                        </div>
                        <SectionSlider slidesPerView={3} spaceBetween={10}>
                            {subCategories.map((sub) => (
                                <SwiperSlide key={sub._id}>
                                    <div
                                        className="border-0 top-cat-card cursor-pointer mt-1"
                                        onClick={() => navigate(`/category/${slug}/${sub.slug}`)}
                                    >
                                        {sub.thumbnailImage?.[0] && (
                                            <img
                                                src={sub.thumbnailImage[0]}
                                                alt={sub.name}
                                                className="top-cat-img top-category-image img-fluid"
                                            />
                                        )}
                                        <div className="top-cat-body text-center">
                                            <h5 className="top-cat-title mb-0 mt-3 font-weightss top-category-name-font text-start">
                                                {sub.name}
                                            </h5>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </SectionSlider>
                    </section>
                )}

                {/* Quiz Banner Section */}
                {featureBanners?.filter((b) => b.type === "quiz").length > 0 && (
                    <section className="mb-5 padding-left-right-sub-category">
                        <h3 className="mb-3 top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal mt-lg-5 mt-3">
                            {featureBanners?.find((b) => b.type === "quiz")?.title ||
                                "Beauty Quiz"}
                        </h3>
                        <div>
                            {featureBanners
                                .filter((banner) => banner.type === "quiz")
                                .map((banner) => {
                                    const bannerImage = banner.image?.[0]?.url || banner.image;
                                    const bannerLink = banner.image?.[0]?.link || banner.link;
                                    return (
                                        <div key={banner._id} className="h-100 row mt-lg-4 mt-3">
                                            <div
                                                className="col-md-6 h-100 w-100 cursor-pointer"
                                                onClick={() => {
                                                    if (bannerLink) {
                                                        handleLinkNavigation(bannerLink);
                                                    } else {
                                                        navigate("/quiz");
                                                    }
                                                }}
                                            >
                                                {bannerImage && (
                                                    <div className="quiz-banner-image-wrapper d-flex justify-content-center">
                                                        <picture className="w-100 h-100">
                                                            <source media="(max-width: 768px)" srcSet={quizMobileBanner} />
                                                            <img
                                                                src={bannerImage}
                                                                alt={banner.title || "Beauty Quiz"}
                                                                className="img-fluid banner-image-quiz w-100 quiz-banner-image"
                                                                style={{ height: "auto", objectFit: "cover" }}
                                                            />
                                                        </picture>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </section>
                )}

                {/* Promotions (Offers for You) */}
                {promotions?.length > 0 && (
                    <section className="mb-lg-5 mb-3 padding-left-right-sub-category">
                        <div className="m-0 p-0">
                            <h3 className="top-categories-title p-0 m-0 page-title-main-name fw-normal mt-4" style={{
                                marginLeft: "-10px !important",
                            }}>
                                {promotionsTitle || "Offers For You"}
                            </h3>
                        </div>

                        <SectionSlider
                            slidesPerView={4}
                            spaceBetween={20}
                            breakpoints={{
                                320: { slidesPerView: 1, spaceBetween: 10 },
                                576: { slidesPerView: 2, spaceBetween: 15 },
                                768: { slidesPerView: 3, spaceBetween: 20 },
                                1024: { slidesPerView: 3, spaceBetween: 20 },
                                1280: { slidesPerView: 4, spaceBetween: 20 },
                                1600: { slidesPerView: 5, spaceBetween: 20 },
                                1920: { slidesPerView: 6, spaceBetween: 25 },
                                2560: { slidesPerView: 8, spaceBetween: 30 },
                                3840: { slidesPerView: 10, spaceBetween: 35 },
                            }}
                        >
                            {promotions.map((promo) => {
                                const isBrandPromo = promo.scope === "brand" && promo.targetSlug;
                                const isCategoryPromo = promo.scope === "category" && promo.targetSlug;

                                return (
                                    <SwiperSlide key={promo._id}>
                                        <div
                                            className="border-0 h-100 cursor-pointer mt-lg-4 mt-3"
                                            onClick={() => {
                                                if (isBrandPromo) {
                                                    navigate(`/brand/${promo.targetSlug}`);
                                                } else if (isCategoryPromo) {
                                                    navigate(`/category/${promo.targetSlug}`);
                                                } else {
                                                    navigate(`/promotion/${promo.slug}`);
                                                }
                                            }}
                                            style={{
                                                transition: "all 0.3s ease",
                                                overflow: "hidden",
                                            }}
                                        >
                                            {promo.images?.[0] && (
                                                <img
                                                    src={promo.images[0]}
                                                    alt={promo.title}
                                                    className="m-0 p-0 img-fluid mt-lg-0 mt-1"
                                                    style={{
                                                        height: "auto",
                                                        padding: "10px",
                                                    }}
                                                    onError={(e) => {
                                                        e.target.src = "/placeholder.png";
                                                    }}
                                                />
                                            )}

                                            <div className="pt-3 ps-0">
                                                <div className="page-title-main-name">
                                                    <p className="mb-3">{promo.title}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </SectionSlider>
                    </section>
                )}

                {/* Shade Finder Banner Section */}
                {featureBanners?.filter((b) => b.type === "shadeFinder").length > 0 && (
                    <section className="mb-5 padding-left-right-sub-category">
                        <h3 className="mb-3 top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal">
                            Shade Finder
                        </h3>
                        <div>
                            {featureBanners
                                .filter((banner) => banner.type === "shadeFinder")
                                .map((banner) => {
                                    const bannerImage = banner.image?.[0]?.url || banner.image;
                                    const bannerLink = banner.image?.[0]?.link || banner.link;
                                    return (
                                        <div
                                            key={banner._id}
                                            className="h-100 cursor-pointer"
                                            onClick={() => {
                                                if (bannerLink) {
                                                    handleLinkNavigation(bannerLink);
                                                } else {
                                                    navigate("/shade-finder");
                                                }
                                            }}
                                        >
                                            {bannerImage && (
                                                <div className="shade-banner-image-wrapper d-flex justify-content-center">
                                                    <picture className="w-100 h-100">
                                                        <source media="(max-width: 768px)" srcSet={shadeFinderMobileBanner} />
                                                        <img
                                                            src={bannerImage}
                                                            alt={banner.title || "Shade Finder"}
                                                            className="img-fluid w-100 shade-banner-image"
                                                        />
                                                    </picture>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                        </div>
                    </section>
                )}

                {/* Finds For You (For You From Joyory) - Slider with custom breakpoints */}
                {findsForYou?.map((section) => (
                    <section key={section._id} className="mb-lg-5 mb-4 padding-left-right-sub-category">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h3 className="mb-3 top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal">
                                {section.title}
                            </h3>
                            {section.products?.length > 4 && (
                                <button
                                    className="btn btn-link text-decoration-none text-dark page-title-main-name"
                                    onClick={() => navigate(`/section/${section._id}`)}
                                >
                                    View All
                                </button>
                            )}
                        </div>

                        <SectionSlider
                            slidesPerView={4}
                            spaceBetween={20}
                            breakpoints={{
                                320: { slidesPerView: 2, spaceBetween: 10 },
                                576: { slidesPerView: 3, spaceBetween: 15 },
                                768: { slidesPerView: 4, spaceBetween: 20 },
                                1024: { slidesPerView: 4, spaceBetween: 20 },
                                1280: { slidesPerView: 4, spaceBetween: 20 },
                                1600: { slidesPerView: 5, spaceBetween: 20 },
                                1920: { slidesPerView: 6, spaceBetween: 25 },
                                2560: { slidesPerView: 8, spaceBetween: 30 },
                                3840: { slidesPerView: 10, spaceBetween: 35 },
                            }}
                        >
                            {section.products?.map((prod) => {
                                const displayData = getProductDisplayData(prod);
                                if (!displayData) return null;
                                return (
                                    <SwiperSlide key={prod._id} className="page-title-main-name">
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

                {/* Virtual Try On Banner Section */}
                {featureBanners?.filter((b) => b.type === "virtualTryOn").length > 0 && (
                    <section className="mb-lg-5 mb-3 padding-left-right-sub-category">
                        <h3 className="mb-3 top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal">
                            Virtual Try On
                        </h3>

                        <Swiper
                            modules={[Autoplay, Pagination, Navigation]}
                            spaceBetween={20}
                            slidesPerView={1}
                            pagination={{
                                clickable: true,
                                bulletClass: 'custom-swiper-bullet',
                                bulletActiveClass: 'custom-swiper-bullet-active',
                            }}
                            navigation={true}
                            breakpoints={{
                                320: { slidesPerView: 1, spaceBetween: 10 },
                                480: { slidesPerView: 1, spaceBetween: 15 },
                                576: { slidesPerView: 1, spaceBetween: 15 },
                                768: { slidesPerView: 1, spaceBetween: 20 },
                                992: { slidesPerView: 1, spaceBetween: 20 },
                                1200: { slidesPerView: 1, spaceBetween: 25 },
                                1400: { slidesPerView: 1, spaceBetween: 30 },
                            }}
                            className="virtual-tryon-swiper"
                        >
                            {featureBanners
                                .filter((banner) => banner.type === "virtualTryOn")
                                .map((banner) => {
                                    const bannerImage = banner.image?.[0]?.url || banner.image;
                                    const bannerLink = banner.image?.[0]?.link || banner.link;
                                    return (
                                        <SwiperSlide key={banner._id}>
                                            <div
                                                className="card border-0 shadow-sm h-100 cursor-pointer mt-lg-3 mt-0"
                                                onClick={() => {
                                                    if (bannerLink) {
                                                        handleLinkNavigation(bannerLink);
                                                    } else {
                                                        navigate("/virtual-try-on");
                                                    }
                                                }}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {bannerImage && (
                                                    <div className="vto-banner-image-wrapper d-flex justify-content-center">
                                                        <picture className="w-100 h-100">
                                                            <source media="(max-width: 768px)" srcSet={vtoMobileBanner} />
                                                            <img
                                                                src={bannerImage}
                                                                alt={banner.title || "Virtual Try On"}
                                                                className="img-fluid w-100 vto-banner-image"
                                                                style={{
                                                                    height: "auto",
                                                                    borderRadius: '0px',
                                                                    objectFit: 'cover'
                                                                }}
                                                            />
                                                        </picture>
                                                    </div>
                                                )}
                                            </div>
                                        </SwiperSlide>
                                    );
                                })}
                        </Swiper>
                    </section>
                )}

                {/* shopByIngredients */}
                {shopByIngredients?.length > 0 && (
                    <section className="mb-lg-5 mb-4 padding-left-right-sub-category">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                            <h3 className="top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal mt-lg-0 mt-3">
                                {shopByIngredientsTitle || "Shop by Ingredients"}
                            </h3>
                        </div>

                        <SectionSlider
                            slidesPerView={4}
                            spaceBetween={15}
                            breakpoints={{
                                320: { slidesPerView: 2, spaceBetween: 12 },
                                576: { slidesPerView: 3, spaceBetween: 12 },
                                768: { slidesPerView: 3, spaceBetween: 12 },
                                1024: { slidesPerView: 4, spaceBetween: 10 },
                                1280: { slidesPerView: 4, spaceBetween: 12 },
                                1600: { slidesPerView: 4, spaceBetween: 15 },
                                1920: { slidesPerView: 4, spaceBetween: 20 },
                                2560: { slidesPerView: 4, spaceBetween: 25 },
                                3840: { slidesPerView: 4, spaceBetween: 30 },
                            }}
                        >
                            {shopByIngredients.map((ing) => {
                                if (!ing || !ing.slug) return null;

                                return (
                                    <SwiperSlide key={ing._id || ing.slug}>
                                        <div
                                            className="text-center cursor-pointer ingredient-card mt-3 p-0"
                                            onClick={() => {
                                                if (!ing.slug) return;
                                                navigate(`/products?ingredients=${encodeURIComponent(ing.slug)}`);
                                            }}
                                            style={{
                                                padding: "12px",
                                                borderRadius: "12px",
                                                transition: "all 0.3s ease",
                                            }}
                                        >
                                            {ing.image && (
                                                <img
                                                    src={ing.image}
                                                    alt={ing.name}
                                                    className="img-fluid"
                                                    style={{
                                                        width: "100%",
                                                        aspectRatio: "1 / 1",
                                                        objectFit: "cover",
                                                        borderRadius: "10px",
                                                    }}
                                                    onError={(e) => {
                                                        e.target.src = "/placeholder.png";
                                                    }}
                                                />
                                            )}
                                            <p className="mt-2 mb-0 small fw-medium page-title-main-name text-start ms-1 text-capitalize">
                                                {(ing.name || "Unknown").toLowerCase()}
                                            </p>
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </SectionSlider>
                    </section>
                )}

                {/* In Focus Section - Slider */}
                {inFocus?.length > 0 && (
                    <section className="in-focus-section padding-left-right-sub-category">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 className="top-categories-title p-1 mb-0 page-title-main-name fw-normal">
                                {inFocusTitle || "In Focus"}
                            </h3>
                        </div>

                        <div className="in-focus-wrapper">
                            {inFocus.map((product) => (
                                <div key={product._id} className="in-focus-card">
                                    <div className="in-focus-row">
                                        <div className="in-focus-image-col">
                                            <div className="in-focus-image-container">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="in-focus-image"
                                                    onClick={() => navigate(`/product/${product.slug}`)}
                                                />
                                            </div>
                                        </div>

                                        <div className="in-focus-content-col">
                                            <div className="in-focus-content">
                                                <span className="in-focus-subtitle">IN FOCUS</span>
                                                <h4 className="in-focus-title">
                                                    {product.brandName && (
                                                        <span className="brand-highlight">{product.brandName}</span>
                                                    )}
                                                    {product.brandName && product.name && " : "}
                                                    {product.name && (
                                                        <span className="product-name-highlight">{product.name}</span>
                                                    )}
                                                </h4>
                                                <button
                                                    onClick={() => navigate(`/product/${product.slug}`)}
                                                    className="in-focus-btn"
                                                >
                                                    Shop Now <span className="arrow">→</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Top Brands - Slider */}
                {brands?.length > 0 && (
                    <section className="mb-lg-5 mb-4 padding-left-right-sub-category">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h3 className="top-categories-title p-1 mb-0 page-title-main-name fw-normal">
                                {brandsTitle || "Top Brands"}
                            </h3>
                        </div>
                        <SectionSlider slidesPerView={4} spaceBetween={15}>
                            {brands.map((brand) => (
                                <SwiperSlide key={brand._id}>
                                    <div
                                        className="text-center cursor-pointer"
                                        onClick={() => navigate(`/brand/${brand.slug}`)}
                                    >
                                        {brand.thumbnailImage && (
                                            <img
                                                className="img-fluid"
                                                src={brand.thumbnailImage}
                                                alt={brand.name}
                                            />
                                        )}
                                        <div className="mt-2 text-start fs-6 page-title-main-name">
                                            {brand.name}
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </SectionSlider>
                    </section>
                )}

                {/* Skin Types - Slider */}
                {skinTypes?.length > 0 && (
                    <section className="mb-5 padding-left-right-sub-category">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h3 className="top-categories-title p-1 mb-0 page-title-main-name fw-normal">
                                {skinTypesTitle || "Shop By Skin Types"}
                            </h3>
                        </div>

                        <div className="mobile-responsive-code mb-5 m-0">
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
                                    1024: { slidesPerView: 3, spaceBetween: 0 },
                                    1200: { slidesPerView: 3, spaceBetween: 0 },
                                    1400: { slidesPerView: 3, spaceBetween: 0 },
                                }}
                            >
                                {skinTypes.map((st, index) => {
                                    if (!st || (!st.slug && !st._id)) return null;
                                    return (
                                        <SwiperSlide key={st._id || st.slug || index}>
                                            <div
                                                className="p-2"
                                                onClick={() => {
                                                    if (!st.slug) return;
                                                    navigate(`/products/skintype/${st.slug}`, {
                                                        state: {
                                                            activeSkinTypeSlug: st.slug,
                                                            activeSkinTypeName: st.name,
                                                            fromSkinTypes: true,
                                                        }
                                                    });
                                                }}
                                                style={{ cursor: "pointer" }}
                                            >
                                                <div className="skin-card">
                                                    <img
                                                        src={st.image || "https://via.placeholder.com/400x250"}
                                                        alt={st.name}
                                                        className="img-fluid"
                                                        style={{ objectFit: "cover", width: "100%", height: "100%" }}
                                                        onError={(e) => {
                                                            e.target.src = "https://via.placeholder.com/400x250";
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>
                        </div>
                    </section>
                )}

                {/* Top Sellers - Slider */}
                {topSellers?.length > 0 && (
                    <section className="mb-lg-5 mb-3 page-title-main-name padding-left-right-sub-category">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h3 className="top-categories-title p-1 mb-0 page-title-main-name fw-normal">
                                {topSellersTitle || "Top Sellers"}
                            </h3>
                        </div>

                        <SectionSlider
                            slidesPerView={4}
                            spaceBetween={20}
                            autoplay={5}
                            breakpoints={{
                                320: { slidesPerView: 2, spaceBetween: 10 },
                                576: { slidesPerView: 3, spaceBetween: 15 },
                                768: { slidesPerView: 4, spaceBetween: 20 },
                                1024: { slidesPerView: 4, spaceBetween: 20 },
                                1280: { slidesPerView: 4, spaceBetween: 20 },
                            }}
                        >
                            {topSellers.map((prod) => {
                                const displayData = getProductDisplayData(prod);
                                if (!displayData) return null;
                                return (
                                    <SwiperSlide key={prod._id}>
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
                )}
            </div>
            <Certificate />
            <Footer />
        </>
    );
}
