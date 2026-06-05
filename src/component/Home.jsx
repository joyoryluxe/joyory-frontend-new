// src/component/Home.jsx
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import Header from "./Header";
import Footer from "./Footer";
import TopCategories from "./TopCategories";
import ProductPramonation from "./ProductPramonation";
import Allsaleproduct from "./Allsaleproduct";
import BestSellers from "./BestSellers";
import Foryou from "./Foryou";
import BrandsSlider from "./BrandsSlider";
import Hero from "./Hero";
import OffersSlider from "./OffersSlider";
import Chatbot from "./Chatbot";
import SkinTypes from "./Skintypes";
import VideoSlider from "./VideoSlider";
import Virtualtryonhome from "./virtualtryonhome";
import BannerSlider from "./Bannerslider";
import Build from "./Build";
import Certificate from "./Certificate";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

function Home() {
  const { user, guestLogin, loading: authLoading } = useContext(UserContext);

  // Local loading state for the entire homepage
  const [pageLoading, setPageLoading] = useState(true);

  // Guest login handling
  useEffect(() => {
    if (!user && !authLoading) {
      guestLogin();
    }
  }, [user, guestLogin, authLoading]);

  // Scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  // Simulate / wait for critical data to load before hiding loader
  useEffect(() => {
    // You can add real data fetching here if needed
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1200); // Adjust timing if needed (minimum pleasant loader time)

    return () => clearTimeout(timer);
  }, []);

  // Show loader while auth is loading OR page is initializing
  if (authLoading || pageLoading) {
    return (
      <div
        className="fullscreen-loader page-title-main-name"
        style={{
          minHeight: "100vh",
          width: "100%",
        }}
      >
        <div className="text-center">
          <DotLottieReact className="loader-responsive"
            src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
            loop
            autoplay
          />
          <p className="text-black mb-0 width-loader-content">
            Please wait while we prepare the best products for you...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />

      <Hero />
      <TopCategories />
      <OffersSlider />
      <Virtualtryonhome type="Mainvirtualtryon" />
      <Foryou />

      <ProductPramonation />
      <BestSellers />
      <BannerSlider />
      <SkinTypes />
      <Build />
      <Certificate />

      {/* <div>
        <Chatbot />
      </div> */}

      <Footer />
    </>
  );
}

export default Home;




