// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { UserProvider } from "./component/UserContext";
// import ProtectedRoute from "./component/ProtectedRoute";
// import CartProvider from "./context/CartContext";
// import Home from "./component/Home";
// import Login from "./component/Login";
// import Signup from "./component/Signup";
// import ForgotPassword from "./component/ForgotPassword";
// import Otp from "./component/Otp";
// import ResetPassword from "./component/ResetPassword";
// import VerifyOtp from "./component/VerifyOtp";
// import TopCategories from "./component/TopCategories";
// import ProductPage from "./component/ProductPage";
// import ProductDetail from "./component/ProductDetail";
// import BestSellers from "./component/BestSellers";
// import Foryou from "./component/Foryou";
// import Blog from "./component/Blog";
// import BlogDetails from "./component/BlogDetails";
// import SearchResults from "./component/SearchResults";
// import Wishlist from "./component/Wishlist";
// import AddressSelection from "./component/AddressSelection";
// import PaymentPage from "./component/PaymentPage";
// import Wallet from "./component/Wallet";
// import Myorders from "./component/Myorders";
// import OffersSlider from "./component/OffersSlider";
// import BrandsSlider from "./component/BrandsSlider";
// import BrandPage from "./component/BrandPage";
// import PromotionProductsPage from "./component/PromotionProductsPage";
// import Aboutus from "./component/Aboutus";
// import VideoSlider from "./component/VideoSlider";
// import MissionVisionSection from "./component/MissionVisionSection";
// import TeamSlider from "./component/TeamSlider";
// import FoundationShadeFinder from "./component/FoundationShadeFinder";
// import Shadefinder from "./component/shadefinder";
// import Shadefinderundertone from "./component/Shadefinderundertone";
// import Shadetone from "./component/Shadetone";
// import Foundation from "./component/Foundation";
// import Virtualtryon from "./component/Virtualtryon";
// import Detailspagetry from "./component/Detailspagetry";
// import Recommendations from "./component/Recommendations";
// import Skintypes from "./component/Skintypes";
// import Allsaleproduct from "./component/Allsaleproduct";
// import Referral from "./component/Referral";
// import Sidebarcomon from "./component/Sidebarcomon";
// import Gifting from "./component/Gifting";
// import RecommendationSlider from "./component/RecommendationSlider";
// import AboutusHero from "./component/AboutusHero";
// import MyGiftCard from "./component/MyGiftCard";
// import Giftcardinnersection from "./component/Giftcardinnersection";
// import Addtocard from "./component/Addtocard";
// import Ordersuccess from "./component/Ordersuccess";
// import TrackOrder from "./component/TrackOrder";
// import Affiliate from "./component/Affiliate";


// // Protected Pages
// import Useraccount from "./component/Useraccount";
// import CartPage from "./component/CartPage";
// import CancelOrder from "./component/CancelOrder";
// import PaymentProcess from "./component/PaymentProcess";
// import ShopProduct from "./component/ShopProduct";
// import OrderDetails from "./component/OrderDetails";
// import OrderTrack from "./component/OrderTrack";
// import Chatbot from "./component/Chatbot";
// import Virtualtryonhome from "./component/virtualtryonhome";
// import Help from "./component/help";
// import AffiliateSignup from "./component/Affiliatesignup";
// import Affiliatelogin from "./component/Affiliatelogin";
// import Affiliatedashboard from "./component/Affiliatedashboard";
// import VariantOverlay from "./component/VariantOverlay";
// // import SearchPage from "./component/SearchPage";
// import SearchPage from "./component/SearchPage";


// function App() {
//   return (
//     <UserProvider>
//       <Router>
//         <CartProvider>
//           <Routes>
//             {/* Public Routes */}
//             <Route path="/" element={<Home />} />
//             <Route path="/signup" element={<Signup />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/otp" element={<Otp />} />
//             <Route path="/forgotpassword" element={<ForgotPassword />} />
//             <Route path="/resetpassword" element={<ResetPassword />} />
//             <Route path="/verifyotp" element={<VerifyOtp />} />
//             <Route path="/topcategories" element={<TopCategories />} />
//             <Route path="/category/:slug" element={<ProductPage />} />
//             <Route path="/products/skintype/:slug" element={<ProductPage />} />
//             {/* <Route path="/product/:id" element={<ProductDetail />} /> */}
//             <Route path="/product/:slug" element={<ProductDetail />} />
//             <Route path="/bestsellers" element={<BestSellers />} />
//             <Route path="/foryou" element={<Foryou />} />
//             <Route path="/blog/:slug" element={<BlogDetails />} />
//             <Route path="/Blog" element={<Blog />} />
//             <Route path="/search" element={<SearchResults />} />
//             <Route path="/OffersSlider" element={<OffersSlider />} />
//             <Route path="/BrandsSlider" element={<BrandsSlider />} />
//             <Route path="/brand/:brandSlug" element={<BrandPage />} />
//             {/* <Route path="/promotion/:id" element={<PromotionProductsPage />} /> */}
//             <Route path="/promotion/:slug" element={<PromotionProductsPage />} />
//             <Route path="/TeamSlider" element={<TeamSlider />} />
//             <Route path="/Aboutus" element={<Aboutus />} />
//             <Route path="/VideoSlider" element={<VideoSlider />} />
//             <Route path="/MissionVisionSection" element={<MissionVisionSection />} />
//             <Route path="/FoundationShadeFinder" element={<FoundationShadeFinder />} />
//             <Route path="/shadefinder" element={<Shadefinder />} />
//             <Route path="/Shadefinderundertone" element={<Shadefinderundertone />} />
//             <Route path="/Shadetone" element={<Shadetone />} />
//             <Route path="/Foundation" element={<Foundation />} />
//             <Route path="/Virtualtryon" element={<Virtualtryon />} />
//             <Route path="/Detailspagetry" element={<Detailspagetry />} />
//             <Route path="/Recommendations" element={<Recommendations />} />
//             <Route path="/Skintypes" element={<Skintypes />} />
//             <Route path="/productpage/:slug" element={<PromotionProductsPage />} />
//             <Route path="/Allsaleproduct" element={<Allsaleproduct />} />
//             <Route path="/Referral" element={<Referral />} />
//             <Route path="/Sidebarcomon" element={<Sidebarcomon />} />
//             <Route path="/Gifting" element={<Gifting />} />
//             <Route path="/RecommendationSlider" element={<RecommendationSlider />} />
//             <Route path="/AboutusHero" element={<AboutusHero />} />
//             <Route path="/Giftcardinnersection/:id" element={<Giftcardinnersection />} />
//             <Route path="/Giftcardinnersection" element={<Giftcardinnersection />} />
//             <Route path="/CartPage" element={<CartPage />} />
//             <Route path="/Useraccount" element={<Useraccount />} />
//             <Route path="/Wishlist" element={<Wishlist />} />
//             <Route path="/Addtocard" element={<Addtocard />} />
//             <Route path="/Wallet" element={<Wallet />} />
//             <Route path="/AddressSelection" element={<AddressSelection />} />
//             <Route path="/PaymentPage" element={<PaymentPage />} />
//             <Route path="/PaymentProcess" element={<PaymentProcess />} />
//             <Route path="/Myorders" element={<Myorders />} />
//             <Route path="/Ordersuccess" element={<Ordersuccess />} />
//             <Route path="/TrackOrder" element={<TrackOrder />} />
//             <Route path="/CancelOrder" element={<CancelOrder />} />
//             <Route path="/ShopProduct" element={<ShopProduct />} />
//             <Route path="/order-details/:shipmentId" element={<OrderDetails />} />
//             <Route path="/orderTrack/:awb" element={<OrderTrack />} />
//             <Route path="/Chatbot" element={<Chatbot />} />
//             <Route path="/Virtualtryonhome" element={<Virtualtryonhome />} />
//             <Route path="/Help" element={<Help />} />
//             <Route path="/affiliate" element={<Affiliate />} />
//             <Route path="/Affiliatesignup" element={<AffiliateSignup />} />
//             <Route path="/Affiliatelogin" element={<Affiliatelogin />} />
//             <Route path="/Affiliatedashboard" element={<Affiliatedashboard />} />
//             <Route path="/VariantOverlay" element={<VariantOverlay />} />
//             <Route path="/search" element={<SearchPage />} /> 



//             {/* Protected Routes */}
//             {/* <Route
//               path="/Useraccount"
//               element={
//                 <ProtectedRoute>
//                   <Useraccount />
//                 </ProtectedRoute>
//               }
//             /> */}

//             {/* <Route path="*" element={<Navigate to="/" replace />} />
//           </Routes> */}


//             {/* <Route
//               path="/Useraccount"
//               element={
//                 <ProtectedRoute>
//                   <Useraccount />
//                 </ProtectedRoute>
//               }
//             /> */}
//             {/* <Route
//               path="/Wishlist"
//               element={
//                 <ProtectedRoute>
//                   <Wishlist />
//                 </ProtectedRoute>
//               }
//             /> */}
//             {/* <Route
//               path="/Myorders"
//               element={
//                 <ProtectedRoute>
//                   <Myorders />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/AddressSelection"
//               element={
//                 <ProtectedRoute>
//                   <AddressSelection />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/PaymentPage"
//               element={
//                 <ProtectedRoute>
//                   <PaymentPage />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/Wallet"
//               element={
//                 <ProtectedRoute>
//                   <Wallet />
//                 </ProtectedRoute>
//               }
//             /> */}



//             {/* 🔒 Protected Pages */}

//             <Route
//               path="/MyGiftCard"
//               element={
//                 <ProtectedRoute allowGuest={false}>
//                   <MyGiftCard />
//                 </ProtectedRoute>
//               }
//             />



//             {/* <Route
//               path="/skintype"
//               element={
//                 <ProtectedRoute>
//                   <Skintypes />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/wishlist"
//               element={
//                 <ProtectedRoute>
//                   <Wishlist />
//                 </ProtectedRoute>
//               }
//             /> */}



//             {/* Fallback */}
//             <Route path="*" element={<Navigate to="/" replace />} />
//           </Routes>
//         </CartProvider>
//       </Router>
//     </UserProvider >
//   );
// }

// export default App;




















// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { useEffect } from 'react';
// import { UserProvider } from "./component/UserContext";
// import ProtectedRoute from "./component/ProtectedRoute";
// import CartProvider from "./context/CartContext";
// import Home from "./component/Home";
// import Login from "./component/Login";
// import Signup from "./component/Signup";
// import ForgotPassword from "./component/ForgotPassword";
// import Otp from "./component/Otp";
// import ResetPassword from "./component/ResetPassword";
// import VerifyOtp from "./component/VerifyOtp";
// import TopCategories from "./component/TopCategories";
// import ProductPage from "./component/ProductPage";
// import ProductDetail from "./component/ProductDetail";
// import BestSellers from "./component/BestSellers";
// import Foryou from "./component/Foryou";
// import Blog from "./component/Blog";
// import BlogDetails from "./component/BlogDetails";
// // Remove this conflicting import: import SearchResults from "./component/SearchResults";
// import Wishlist from "./component/Wishlist";
// import AddressSelection from "./component/AddressSelection";
// import PaymentPage from "./component/PaymentPage";
// import Wallet from "./component/Wallet";
// import Myorders from "./component/Myorders";
// import OffersSlider from "./component/OffersSlider";
// import BrandsSlider from "./component/BrandsSlider";
// import BrandPage from "./component/BrandPage";
// import PromotionProductsPage from "./component/PromotionProductsPage";
// import Aboutus from "./component/Aboutus";
// import VideoSlider from "./component/VideoSlider";
// import MissionVisionSection from "./component/MissionVisionSection";
// import TeamSlider from "./component/TeamSlider";
// import FoundationShadeFinder from "./component/FoundationShadeFinder";
// import Shadefinder from "./component/shadefinder";
// import Shadefinderundertone from "./component/Shadefinderundertone";
// import Shadetone from "./component/Shadetone";
// import Foundation from "./component/Foundation";
// import Virtualtryon from "./component/Virtualtryon";
// import Detailspagetry from "./component/Detailspagetry";
// import Recommendations from "./component/Recommendations";
// import Skintypes from "./component/Skintypes";
// import Allsaleproduct from "./component/Allsaleproduct";
// import Referral from "./component/Referral";
// import Sidebarcomon from "./component/Sidebarcomon";
// import Gifting from "./component/Gifting";
// import RecommendationSlider from "./component/RecommendationSlider";
// import AboutusHero from "./component/AboutusHero";
// import MyGiftCard from "./component/MyGiftCard";
// import Giftcardinnersection from "./component/Giftcardinnersection";
// import Addtocard from "./component/Addtocard";
// import Ordersuccess from "./component/Ordersuccess";
// import TrackOrder from "./component/TrackOrder";
// import Affiliate from "./component/Affiliate";

// // Protected Pages
// import Useraccount from "./component/Useraccount";
// import CartPage from "./component/CartPage";
// import CancelOrder from "./component/CancelOrder";
// import PaymentProcess from "./component/PaymentProcess";
// import ShopProduct from "./component/ShopProduct";
// import OrderDetails from "./component/OrderDetails";
// import OrderTrack from "./component/OrderTrack";
// import Chatbot from "./component/Chatbot";
// import Virtualtryonhome from "./component/virtualtryonhome";
// import Help from "./component/help";
// import AffiliateSignup from "./component/Affiliatesignup";
// import Affiliatelogin from "./component/Affiliatelogin";
// import Affiliatedashboard from "./component/Affiliatedashboard";
// import VariantOverlay from "./component/VariantOverlay";
// import SearchPage from "./component/SearchPage"; // Your new SearchPage
// import Returnreplace from "./component/Returnreplace";
// import ReturnReplaceDetails from "./component/Returnreplacedetials";
// import Mainvirtualtryon from "./component/Mainvirtualtryon";
// import DiscountProductsPage from "./component/DiscountProductsPage";
// import HeaderSearchbar from "./component/HeaderSearchbar";
// import Bannerslider from "./component/Bannerslider";
// import ProductDetailDescription from "./component/ProductDetailDescription";
// import ProductDetailsHero from "./component/ProductDetailsHero";
// import CustomerReviews from "./component/CustomerReviews";
// import HeaderCategories from "./component/HeaderCategories";

// function App() {
//   //  useEffect(() => {
//   //   const handleContext = (e) => e.preventDefault();
//   //   const handleKey = (e) => {
//   //     if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && e.keyCode === 73) || (e.ctrlKey && e.keyCode === 85)) {
//   //       e.preventDefault();
//   //     }
//   //   };
//   //   document.addEventListener('contextmenu', handleContext);
//   //   document.addEventListener('keydown', handleKey);
//   //   return () => {
//   //     document.removeEventListener('contextmenu', handleContext);
//   //     document.removeEventListener('keydown', handleKey);
//   //   };
//   // }, []);
//   return (
//     <UserProvider>
//       <Router>
//         <CartProvider>
//           <Routes>
//             {/* Public Routes */}
//             <Route path="/" element={<Home />} />
//             <Route path="/signup" element={<Signup />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/otp" element={<Otp />} />
//             <Route path="/forgotpassword" element={<ForgotPassword />} />
//             <Route path="/resetpassword" element={<ResetPassword />} />
//             <Route path="/verifyotp" element={<VerifyOtp />} />
//             <Route path="/topcategories" element={<TopCategories />} />
//             <Route path="/category/:slug" element={<ProductPage />} />
//             <Route path="/products/skintype/:slug" element={<ProductPage />} />
//             <Route path="/product/:slug" element={<ProductDetail />} />
//             <Route path="/bestsellers" element={<BestSellers />} />
//             <Route path="/foryou" element={<Foryou />} />
//             <Route path="/blog/:slug" element={<BlogDetails />} />
//             <Route path="/Blog" element={<Blog />} />

//             {/* ⚠️ REMOVE THIS CONFLICTING ROUTE: */}
//             {/* <Route path="/search" element={<SearchResults />} /> */}

//             {/* ✅ ADD YOUR NEW SEARCH PAGE ROUTE HERE: */}
//             <Route path="/search" element={<SearchPage />} />

//             <Route path="/OffersSlider" element={<OffersSlider />} />
//             <Route path="/BrandsSlider" element={<BrandsSlider />} />
//             <Route path="/brand/:brandSlug" element={<BrandPage />} />
//             <Route path="/promotion/:slug" element={<PromotionProductsPage />} />
//             <Route path="/TeamSlider" element={<TeamSlider />} />
//             <Route path="/Aboutus" element={<Aboutus />} />
//             <Route path="/VideoSlider" element={<VideoSlider />} />
//             <Route path="/MissionVisionSection" element={<MissionVisionSection />} />
//             <Route path="/FoundationShadeFinder" element={<FoundationShadeFinder />} />
//             <Route path="/shadefinder" element={<Shadefinder />} />
//             <Route path="/Shadefinderundertone" element={<Shadefinderundertone />} />
//             <Route path="/Shadetone" element={<Shadetone />} />
//             <Route path="/Foundation" element={<Foundation />} />
//             <Route path="/Mainvirtualtryon" element={<Mainvirtualtryon />} />
//             <Route path="/Virtualtryon" element={<Virtualtryon />} />
//             <Route path="/Detailspagetry" element={<Detailspagetry />} />
//             <Route path="/Recommendations" element={<Recommendations />} />
//             <Route path="/Skintypes" element={<Skintypes />} />
//             <Route path="/productpage/:slug" element={<PromotionProductsPage />} />
//             <Route path="/Allsaleproduct" element={<Allsaleproduct />} />
//             <Route path="/Referral" element={<Referral />} />
//             <Route path="/Sidebarcomon" element={<Sidebarcomon />} />
//             <Route path="/Gifting" element={<Gifting />} />
//             <Route path="/RecommendationSlider" element={<RecommendationSlider />} />
//             <Route path="/AboutusHero" element={<AboutusHero />} />
//             <Route path="/Giftcardinnersection/:id" element={<Giftcardinnersection />} />
//             <Route path="/Giftcardinnersection" element={<Giftcardinnersection />} />
//             <Route path="/CartPage" element={<CartPage />} />
//             <Route path="/Useraccount" element={<Useraccount />} />
//             <Route path="/Wishlist" element={<Wishlist />} />
//             <Route path="/Addtocard" element={<Addtocard />} />
//             <Route path="/Wallet" element={<Wallet />} />
//             <Route path="/AddressSelection" element={<AddressSelection />} />
//             <Route path="/PaymentPage" element={<PaymentPage />} />
//             <Route path="/PaymentProcess" element={<PaymentProcess />} />
//             <Route path="/Myorders" element={<Myorders />} />
//             <Route path="/Ordersuccess/:orderId" element={<Ordersuccess />} />
//             <Route path="/TrackOrder" element={<TrackOrder />} />
//             <Route path="/CancelOrder/:orderId" element={<CancelOrder />} />
//             <Route path="/ShopProduct" element={<ShopProduct />} />
//             <Route path="/order-details/:shipmentId" element={<OrderDetails />} />
//             <Route path="/orderTrack/:awb" element={<OrderTrack />} />
//             <Route path="/Chatbot" element={<Chatbot />} />
//             <Route path="/Virtualtryonhome" element={<Virtualtryonhome />} />
//             <Route path="/Help" element={<Help />} />
//             <Route path="/affiliate" element={<Affiliate />} />
//             <Route path="/Affiliatesignup" element={<AffiliateSignup />} />
//             <Route path="/Affiliatelogin" element={<Affiliatelogin />} />
//             <Route path="/Affiliatedashboard" element={<Affiliatedashboard />} />
//             <Route path="/VariantOverlay" element={<VariantOverlay />} />
//             <Route path="/returnreplace" element={<Returnreplace />} />
//             <Route path="/ReturnReplaceDetails/:shipmentId/:returnId" element={<ReturnReplaceDetails />} />
//             <Route path="/DiscountProductsPage" element={<DiscountProductsPage />} />
//             <Route path="/HeaderSearchbar" element={<HeaderSearchbar />} />
//             <Route path="/Bannerslider" element={<Bannerslider />} />
//             <Route path="/ProductDetailDescription" element={<ProductDetailDescription />} />
//             <Route path="/ProductDetailsHero" element={<ProductDetailsHero />} />
//             <Route path="/CustomerReviews" element={<CustomerReviews />} />
//             <Route path="/HeaderCategories" element={<HeaderCategories />} />


//             {/* Protected Routes */}
//             <Route
//               path="/MyGiftCard"
//               element={
//                 <ProtectedRoute allowGuest={false}>
//                   <MyGiftCard />
//                 </ProtectedRoute>
//               }
//             />

//             {/* Fallback */}
//             <Route path="*" element={<Navigate to="/" replace />} />
//           </Routes>
//         </CartProvider>
//       </Router>
//     </UserProvider>
//   );
// }

// export default App;














import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./component/UserContext";
import ProtectedRoute from "./component/ProtectedRoute";
import CartProvider from "./context/CartContext";
import Home from "./component/Home";
import Login from "./component/Login";
import Signup from "./component/Signup";
import ForgotPassword from "./component/ForgotPassword";
import Otp from "./component/Otp";
import ResetPassword from "./component/ResetPassword";
import VerifyOtp from "./component/VerifyOtp";
import TopCategories from "./component/TopCategories";
import ProductPage from "./component/ProductPage";
import ProductDetail from "./component/ProductDetail";
import BestSellers from "./component/BestSellers";
import Foryou from "./component/Foryou";
import Blog from "./component/Blog";
import BlogDetails from "./component/BlogDetails";
import Wishlist from "./component/Wishlist";
import AddressSelection from "./component/AddressSelection";
import PaymentPage from "./component/PaymentPage";
import Wallet from "./component/Wallet";
import Myorders from "./component/Myorders";
import OffersSlider from "./component/OffersSlider";
import BrandsSlider from "./component/BrandsSlider";
import BrandPage from "./component/BrandPage";
import PromotionProductsPage from "./component/PromotionProductsPage";
import Aboutus from "./component/Aboutus";
import VideoSlider from "./component/VideoSlider";
import MissionVisionSection from "./component/MissionVisionSection";
import TeamSlider from "./component/TeamSlider";
import FoundationShadeFinder from "./component/FoundationShadeFinder";
import Shadefinder from "./component/shadefinder";
import Shadefinderundertone from "./component/Shadefinderundertone";
import Shadetone from "./component/Shadetone";
import Foundation from "./component/Foundation";
import Virtualtryon from "./component/Virtualtryon";
import Detailspagetry from "./component/Detailspagetry";
import Recommendations from "./component/Recommendations";
import Skintypes from "./component/Skintypes";
import Allsaleproduct from "./component/Allsaleproduct";
import Referral from "./component/Referral";
import Sidebarcomon from "./component/Sidebarcomon";
import Gifting from "./component/Gifting";
import RecommendationSlider from "./component/RecommendationSlider";
import AboutusHero from "./component/AboutusHero";
import MyGiftCard from "./component/MyGiftCard";
import Giftcardinnersection from "./component/Giftcardinnersection";
import Addtocard from "./component/Addtocard";
import Ordersuccess from "./component/Ordersuccess";
import TrackOrder from "./component/TrackOrder";
import Affiliate from "./component/Affiliate";

// Protected Pages
import Useraccount from "./component/Useraccount";
import CartPage from "./component/CartPage";
import CancelOrder from "./component/CancelOrder";
import PaymentProcess from "./component/PaymentProcess";
import ShopProduct from "./component/ShopProduct";
import OrderDetails from "./component/OrderDetails";
import OrderTrack from "./component/OrderTrack";
import Chatbot from "./component/Chatbot";
import Virtualtryonhome from "./component/virtualtryonhome";
import Help from "./component/help";
import AffiliateSignup from "./component/Affiliatesignup";
import Affiliatelogin from "./component/Affiliatelogin";
import Affiliatedashboard from "./component/Affiliatedashboard";
import VariantOverlay from "./component/VariantOverlay";
import SearchPage from "./component/SearchPage";
import Returnreplace from "./component/Returnreplace";
import ReturnReplaceDetails from "./component/Returnreplacedetials";
import Mainvirtualtryon from "./component/Mainvirtualtryon";
import DiscountProductsPage from "./component/DiscountProductsPage";
import HeaderSearchbar from "./component/HeaderSearchbar";
import Bannerslider from "./component/Bannerslider";
import ProductDetailDescription from "./component/ProductDetailDescription";
import ProductDetailsHero from "./component/ProductDetailsHero";
import CustomerReviews from "./component/CustomerReviews";
import HeaderCategories from "./component/HeaderCategories";
import Build from "./component/Build";
import Certificate from "./component/Certificate";
import Mobileheaderview from "./component/Mobileheaderview";
import CategoryLandingPage from "./component/CategoryLandingPage";
import Offerlanding from "./component/Offerlanding";
import Foryoulanding from "./component/Foryoulanding";
import Makeupquiz from "./component/Makeupquiz";
// import AddressSection from "./component/AddressSection";
import AddressSections from "./component/AddressSections";
import PageNotFound from "./component/PageNotFound";
import ComingSoon from "./component/ComingSoon";

function App() {
  return (
    <UserProvider>
      <Router>
        <CartProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/otp" element={<Otp />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
            <Route path="/verifyotp" element={<VerifyOtp />} />
            <Route path="/topcategories" element={<TopCategories />} />

            {/* ✅ FIXED: Wildcard route for all category depths */}
            <Route path="/category/*" element={<ProductPage />} />
            <Route path="/Products/category/:slug" element={<ProductPage />} />
            <Route path="/products/:filter?" element={<ProductPage />} />

            <Route path="/products/skintype/:slug" element={<ProductPage />} />
            <Route path="/products/ingredients/*" element={<ProductPage />} />
            <Route path="/products/Skintype/*" element={<ProductPage />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/bestsellers" element={<BestSellers />} />
            <Route path="/foryou" element={<Foryou />} />
            <Route path="/blog/:slug" element={<BlogDetails />} />
            <Route path="/Blog" element={<Blog />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/OffersSlider" element={<OffersSlider />} />
            <Route path="/BrandsSlider" element={<BrandsSlider />} />
            <Route path="/brand/:brandSlug" element={<BrandPage />} />
            {/* <Route path="/promotion/:slug" element={<PromotionProductsPage />} /> */}
            <Route path="/Products/promotion/:slug" element={<ProductPage />} />
            <Route path="/Products/:slug" element={<ProductPage />} />

            <Route path="/TeamSlider" element={<TeamSlider />} />
            <Route path="/Aboutus" element={<Aboutus />} />
            <Route path="/VideoSlider" element={<VideoSlider />} />
            <Route path="/MissionVisionSection" element={<MissionVisionSection />} />
            <Route path="/FoundationShadeFinder" element={<FoundationShadeFinder />} />
            <Route path="/shadefinder" element={<Shadefinder />} />
            <Route path="/Shadefinderundertone" element={<Shadefinderundertone />} />
            <Route path="/Shadetone" element={<Shadetone />} />
            <Route path="/Foundation" element={<Foundation />} />
            <Route path="/Mainvirtualtryon" element={<Mainvirtualtryon />} />
            <Route path="/Virtualtryon" element={<Virtualtryon />} />
            <Route path="/Detailspagetry" element={<Detailspagetry />} />
            <Route path="/Recommendations" element={<Recommendations />} />
            <Route path="/Skintypes" element={<Skintypes />} />
            <Route path="/productpage/:slug" element={<PromotionProductsPage />} />
            <Route path="/Allsaleproduct" element={<Allsaleproduct />} />
            <Route path="/Referral" element={<Referral />} />
            <Route path="/Sidebarcomon" element={<Sidebarcomon />} />
            <Route path="/Gifting" element={<Gifting />} />
            <Route path="/RecommendationSlider" element={<RecommendationSlider />} />
            <Route path="/AboutusHero" element={<AboutusHero />} />
            <Route path="/Giftcardinnersection/:id" element={<Giftcardinnersection />} />
            <Route path="/Giftcardinnersection" element={<Giftcardinnersection />} />
            <Route path="/CartPage" element={<CartPage />} />
            <Route path="/Useraccount" element={<Useraccount />} />
            <Route path="/AddressSections" element={<AddressSections />} />
            <Route path="/Wishlist" element={<Wishlist />} />
            <Route path="/Addtocard" element={<Addtocard />} />
            <Route path="/Wallet" element={<Wallet />} />
            <Route path="/AddressSelection" element={<AddressSelection />} />
            <Route path="/PaymentPage" element={<PaymentPage />} />
            <Route path="/PaymentProcess" element={<PaymentProcess />} />
            <Route path="/Myorders" element={<Myorders />} />
            <Route path="/Ordersuccess/:orderId" element={<Ordersuccess />} />
            <Route path="/TrackOrder" element={<TrackOrder />} />
            <Route path="/CancelOrder/:orderId" element={<CancelOrder />} />
            <Route path="/ShopProduct" element={<ShopProduct />} />
            <Route path="/order-details/:shipmentId" element={<OrderDetails />} />
            <Route path="/orderTrack/:awb" element={<OrderTrack />} />
            <Route path="/Chatbot" element={<Chatbot />} />
            <Route path="/Virtualtryonhome" element={<Virtualtryonhome />} />
            <Route path="/Help" element={<Help />} />
            <Route path="/affiliate" element={<Affiliate />} />
            <Route path="/Affiliatesignup" element={<AffiliateSignup />} />
            <Route path="/Affiliatelogin" element={<Affiliatelogin />} />
            <Route path="/Affiliatedashboard" element={<Affiliatedashboard />} />
            <Route path="/VariantOverlay" element={<VariantOverlay />} />
            <Route path="/returnreplace" element={<Returnreplace />} />
            <Route path="/ReturnReplaceDetails/:shipmentId/:returnId" element={<ReturnReplaceDetails />} />
            <Route path="/DiscountProductsPage" element={<DiscountProductsPage />} />
            <Route path="/HeaderSearchbar" element={<HeaderSearchbar />} />
            <Route path="/Bannerslider" element={<Bannerslider />} />
            <Route path="/ProductDetailDescription" element={<ProductDetailDescription />} />
            <Route path="/ProductDetailsHero" element={<ProductDetailsHero />} />
            <Route path="/CustomerReviews" element={<CustomerReviews />} />
            <Route path="/HeaderCategories" element={<HeaderCategories />} />
            <Route path="/Build" element={<Build />} />
            <Route path="/Certificate" element={<Certificate />} />
            <Route path="/Mobileheaderview" element={<Mobileheaderview />} />
            <Route path="/category/:slug" element={<CategoryLandingPage />} />
            <Route path="/Offerlanding" element={<Offerlanding />} />
            <Route path="/Foryoulanding" element={<Foryoulanding />} />
            <Route path="/Makeupquiz" element={<Makeupquiz />} />
            <Route path="*" element={<PageNotFound />} />
            <Route path="/coming-soon" element={<ComingSoon />} />

            {/* Protected Routes */}
            <Route
              path="/MyGiftCard"
              element={
                <ProtectedRoute allowGuest={false}>
                  <MyGiftCard />
                </ProtectedRoute>
              }
            />



            {/* <Route
              path="/foryoulanding"
              element={
                <ProtectedRoute allowGuest={false}>
                  <foryoulanding />
                </ProtectedRoute>
              }
            /> */}

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </Router>
    </UserProvider>
  );
}

export default App;