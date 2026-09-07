// src/pages/Home.jsx
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import PageLoader from "../components/common/PageLoader";
import SEOMeta from "../components/common/SEOMeta";

// Home Page Feature Sections (imported via central barrel export)
import {
  HeroSlider as Hero,
  TopCategories,
  OffersSlider,
  VirtualTryOnHome as Virtualtryonhome,
  ForYou as Foryou,
  ProductPromotion as ProductPramonation,
  BestSellers,
  BannerSlider,
  SkinTypes,
  Build,
  Certificate,
} from "../components/sections/home";

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
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Show loader while auth is loading OR page is initializing
  if (authLoading || pageLoading) {
    return (
      <PageLoader message="Please wait while we prepare the best products for you..." />
    );
  }

  return (
    <>
      <SEOMeta type="home" />
      <h1 style={{ display: "none" }}>
        Joyory - India's Premium Beauty & Cosmetics Store
      </h1>
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

      <Footer />
    </>
  );
}

export default Home;
