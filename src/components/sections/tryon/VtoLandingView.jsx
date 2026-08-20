import React from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import vtoHero from "../../../assets/Virtual-tryon-new.png";
import vtoFirst from '../../../assets/vto_new.png';
import vtoMobile from '../../../assets/vto_mobile.png';
import step1 from "../../../assets/step1.png";
import step2 from "../../../assets/step2.png";
import step3 from "../../../assets/step3.png";

export default function VtoLandingView({
    landingImages = {},
    onStartSelfie,
    onStartPhotoUpload,
    onClose,
}) {
    const getImageSrc = (backendUrl, localFallback) => backendUrl || localFallback;

    return (
        <div className="vto-landing-screen-integrated">
            {/* FULL VIRTUALTRYON PAGE UNDERLAY */}
            <div className="vto-bg-content-underlay">
                <div className="virtualtryon-container pt-5 mt-2">
                    <section className="hero-slider w-100">
                        <div className="position-relative w-100 h-100 mt-xl-4 mt-3 padding-left-rightss">
                            <img
                                src={vtoHero}
                                alt="Virtual Try-On"
                                className="slide-media pt-0"
                                style={{ width: "100%", objectFit: "cover" }}
                            />
                        </div>
                    </section>

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

            {/* CENTERED MODAL CARD */}
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

                    {/* Close Button at top right of image */}
                    <button
                        className="vto-landing-close-btn"
                        onClick={onClose}
                        aria-label="Close Virtual Try-On"
                    >
                        <FaTimes />
                    </button>

                    {/* Centered Brand Overlay */}
                    <div className="vto-landing-brand-overlay">
                        JOYORY
                    </div>

                    {/* Split Slider Line & Handle Overlay */}
                    <div className="vto-landing-slider-line">
                        <div className="vto-landing-slider-handle">
                            <FaChevronLeft size={8} style={{ marginRight: '-1px' }} />
                            <FaChevronRight size={8} style={{ marginLeft: '-1px' }} />
                        </div>
                    </div>
                </div>
                <div className="vto-landing-content-box">
                    <h1 className="vto-title-landing">VIRTUAL TRY ON</h1>
                    <p className="vto-subtitle-landing">
                        For the best Virtual Try-On experience, please use Safari on iOS and Chrome on Android.
                    </p>
                    <div className="vto-actions-landing">
                        <button
                            className="vto-btn-black"
                            onClick={onStartSelfie}
                        >
                            SELFIE MODE
                        </button>
                        <button
                            className="vto-btn-black"
                            onClick={onStartPhotoUpload}
                        >
                            UPLOAD PHOTO
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
