// import { Link } from "react-router-dom";
// import Footer from "./Footer";
// import Header from "./Header";
// // import banner from "../assets/banner.jpg";
// import TopCategories from "./TopCategories";
// import BestSellers from "./BestSellers";
// import Foryou from "./Foryou";
// // MagicRoomBanner
// import MagicRoomBanner from "../assets/Home-main.png";
// import Sale from "../assets/Friday-Sale.png";
// import OffersSlider from "./OffersSlider";
// import BrandsSlider from "./BrandsSlider";
// import VideoSlider from "./VideoSlider";
// import SkinTypes from "./Skintypes";
// import ProductPramonation from "./ProductPramonation";
// import Allsaleproduct from "./Allsaleproduct";
// import bannerVideo from "../assets/banner.mp4";
// import Hero from "./hero";
// import "../css/Home.css";

// function Home() {
//   return (
//     <>
//       <Header />

//       {/* <div className='hero-section m-0 p-0'>
//         <img src={banner} alt="JOYORY Logo" className='w-100' />
//       </div> */}





//         {/* <Hero /> */}

//       <video
//         className="w-100" muted
//         controls autoPlay loop
//         controlsList="nodownload"
//         onContextMenu={(e) => e.preventDefault()}  // 🚫 disables right-click menu
//       >
//         <source src={bannerVideo} type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>






//       <TopCategories />

//       <OffersSlider />  

//       <div className="">
//         <Link to="#">
//           <img
//             src={MagicRoomBanner}
//             alt="Joyory Magic Room"
//             className="banner-img w-100"
//           />
//         </Link>

//         {/* <Link to="/virtual-try-on">
//           <img
//             src={MagicRoomBanner}
//             alt="Joyory Magic Room"
//             className="banner-img w-100"
//           />
//         </Link> */}

//       </div>

//       <BrandsSlider />

//       <div className="">
//         <Link to="#">
//           <img
//             src={Sale}
//             alt="Joyory Magic Room"
//             className="banner-img w-100"
//           />
//         </Link>
//       </div>


//       <Foryou />

//       <ProductPramonation />



//       <BestSellers />


//       <Allsaleproduct />


//       <SkinTypes />


//       <VideoSlider />





//       <Footer />
//     </>
//   );
// }

// export default Home;
















// // // src/component/Home.jsx
// import { Link } from "react-router-dom";
// import { useContext, useEffect } from "react";
// import { UserContext } from "./UserContext";
// import Header from "./Header";
// import Footer from "./Footer";
// import TopCategories from "./TopCategories";
// import ProductPramonation from "./ProductPramonation";
// import Allsaleproduct from "./Allsaleproduct";
// import BestSellers from "./BestSellers";
// import Foryou from "./Foryou";
// import BrandsSlider from "./BrandsSlider";
// import Hero from "./Hero";
// import OffersSlider from "./OffersSlider";
// import Chatbot from "./Chatbot";
// import SkinTypes from "./Skintypes";
// import VideoSlider from "./VideoSlider";
// import banner from "../assets/banner.jpg";
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';




// import Virtualtryonhome from "./virtualtryonhome";
// import BannerSlider from "./Bannerslider";
// import Build from "./Build";
// import Certificate from "./Certificate";

// function Home() {
//   const { user, guestLogin, loading } = useContext(UserContext);

//   useEffect(() => {
//     if (!user && !loading) guestLogin();
//   }, [user, guestLogin, loading]);

//   useEffect(() => {
//     window.scrollTo({ top: 0, left: 0, behavior: "instant" });
//   }, []);

//   // if (loading || !user) return <div className="page-title-main-name d-flex align-items-center justify-content-center" style={{marginTop:'50%'}}>Loading...</div>;


//   if (loading)
//     return (
//       <div
//         className="fullscreen-loader page-title-main-name"
//         style={{
//           minHeight: "100vh",
//           width: "100%",
//         }}
//       >
//         <div className="text-center">
//           <DotLottieReact
//             src="https:lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
//             loop
//             autoplay
//           />


//           <p className="text-muted mb-0">
//             Please wait while we prepare the best products for you...
//           </p>
//         </div>
//       </div>
//     );


//   return (
//     <>
//       <Header />

//       {/* <video
//         className="w-100"
//         muted
//         autoPlay
//         loop
//         controls
//         controlsList="nodownload"
//         onContextMenu={(e) => e.preventDefault()}
//       >
//         <source src={bannerVideo} type="video/mp4" />
//       </video> */}

//       <Hero />
//       <TopCategories />
//       <OffersSlider />
//       {/* <BrandsSlider /> */}
//       <Virtualtryonhome type="virtualTryOn" />
//       <Foryou />


//       {/* <img
//         src={banner}
//         alt="Joyory Magic Room"
//         className="w-100 img-fluid mt-lg-5"
//       /> */}


//       {/* <BannerSlider /> */}
//       <ProductPramonation />
//       <BestSellers />
//       {/* <Allsaleproduct /> */}
//       <BannerSlider />
//       <SkinTypes />
//       <Build />
//       <Certificate />
//       {/* <VideoSlider /> */}

//       <div>
//         <Chatbot />
//       </div>

//       <Footer />
//     </>
//   );
// }

// export default Home;

















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




