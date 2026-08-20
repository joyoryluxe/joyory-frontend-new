import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/common/ScrollToTop";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserProvider } from "./context/UserContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import CartProvider from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import Home from "./pages/catalog/Home";
import Signup from "./pages/auth/Signup";
import PhoneAuth from "./pages/auth/PhoneAuth";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Otp from "./pages/auth/Otp";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyOtp from "./pages/auth/VerifyOtp";
import TopCategories from "./components/sections/home/TopCategories";
import ProductPage from "./pages/catalog/ProductPage";
import ProductDetail from "./pages/catalog/ProductDetail";
import BestSellers from "./components/sections/home/BestSellers";
import Foryou from "./components/sections/home/ForYou";
import Blog from "./pages/content/Blog";
import BlogDetails from "./pages/content/BlogDetails";
import Wishlist from "./pages/cart-checkout/Wishlist";
import AddressSelection from "./pages/cart-checkout/AddressSelection";
import PaymentPage from "./pages/cart-checkout/PaymentPage";
import Wallet from "./pages/rewards/Wallet";
import Myorders from "./pages/orders/MyOrders";
import OffersSlider from "./components/sections/home/OffersSlider";
import BrandsSlider from "./components/sections/home/BrandsSlider";
import BrandPage from "./pages/catalog/BrandPage";
import PromotionProductsPage from "./pages/catalog/PromotionProductsPage";
import Aboutus from "./pages/content/AboutUs";
import VideoSlider from "./components/sections/home/VideoSlider";
import FoundationShadeFinder from "./pages/vto/FoundationShadeFinder";
import Shadefinder from "./pages/vto/ShadeFinder";
import Shadefinderundertone from "./pages/vto/ShadeFinderUndertone";
import Shadetone from "./pages/vto/ShadeTone";
import Foundation from "./pages/vto/Foundation";
import Virtualtryon from "./pages/vto/VirtualTryOn";
import VtoProducts from "./pages/vto/VtoProducts";
import Recommendations from "./pages/catalog/Recommendations";
import Skintypes from "./components/sections/home/SkinTypes";
import Allsaleproduct from "./pages/catalog/AllSaleProduct";
import Referral from "./pages/rewards/Referral";
import Sidebarcomon from "./components/common/SidebarCommon";
import Gifting from "./pages/rewards/Gifting";
import RecommendationSlider from "./components/common/RecommendationSlider";
import MyGiftCard from "./pages/rewards/MyGiftCard";
import Giftcardinnersection from "./pages/rewards/Giftcardinnersection";
import Addtocard from "./components/common/AddToCard";
import Ordersuccess from "./pages/orders/OrderSuccess";
import TrackOrder from "./pages/orders/TrackOrder";
import Affiliate from "./pages/rewards/Affiliate";

// Protected Pages
import Useraccount from "./pages/auth/UserAccount";
import CartPage from "./pages/cart-checkout/CartPage";
import CancelOrder from "./pages/orders/CancelOrder";
import PaymentProcess from "./pages/cart-checkout/PaymentProcess";
import ShopProduct from "./pages/catalog/ShopProduct";
import OrderDetails from "./pages/orders/OrderDetails";
import OrderTrack from "./pages/orders/OrderTrack";
import Chatbot from "./components/common/Chatbot";
import Virtualtryonhome from "./components/sections/home/VirtualTryOnHome";
import Help from "./pages/content/Help";
import AffiliateSignup from "./pages/rewards/AffiliateSignup";
import Affiliatelogin from "./pages/rewards/AffiliateLogin";
import Affiliatedashboard from "./pages/rewards/AffiliateDashboard";
import VariantOverlay from "./components/common/VariantOverlay";
import SearchPage from "./pages/catalog/SearchPage";
import Returnreplace from "./pages/orders/ReturnReplace";
import ReturnReplaceDetails from "./pages/orders/ReturnReplaceDetails";
import Mainvirtualtryon from "./pages/vto/MainVirtualTryOn";
import DiscountProductsPage from "./pages/catalog/DiscountProductsPage";
import HeaderSearchbar from "./components/common/HeaderSearchbar";
import Bannerslider from "./components/sections/home/BannerSlider";
import ProductDetailDescription from "./components/sections/product/ProductDetailDescription";
import ProductDetailsHero from "./components/sections/product/ProductDetailsHero";
import CustomerReviews from "./components/common/CustomerReviews";
import HeaderCategories from "./components/common/HeaderCategories";
import Build from "./components/sections/home/Build";
import Certificate from "./components/sections/home/Certificate";
import Mobileheaderview from "./components/common/MobileHeaderView";
import CategoryLandingPage from "./pages/catalog/CategoryLandingPage";
import Offerlanding from "./pages/catalog/OfferLanding";
import Foryoulanding from "./pages/catalog/ForYouLanding";
import AiBeautyLab from "./pages/ai-beauty/AiBeautyLab";
// import SkinDiagnosis from "./pages/ai-beauty/SkinDiagnosis";
// import AddressSection from "./component/AddressSection";
import AddressSections from "./pages/cart-checkout/AddressSections";
import PageNotFound from "./pages/content/PageNotFound";
import ComingSoon from "./pages/content/ComingSoon";
import BeautyConcierge from "./pages/ai-beauty/BeautyConcierge";
import IngredientCompatibility from "./pages/ai-beauty/IngredientCompatibility";
import IngredientDetail from "./pages/ai-beauty/IngredientDetail";
import Terms from "./pages/content/Terms";
import Privacy from "./pages/content/Privacy";
import RoutineBuilder from "./pages/ai-beauty/RoutineBuilder";
import MetaPixelTracker from "./components/common/MetaPixelTracker";
import DiscountPopup from "./components/common/DiscountPopup";

import CookieConsentBanner from "./components/common/CookieConsentBanner";

function App() {
  useEffect(() => {
    let isDown = false;
    let startX;
    let scrollLeft;
    let moved = false;
    let activeContainer = null;

    const handleMouseDown = (e) => {
      const container = e.target.closest('.cat-wrap');
      if (!container) return;

      isDown = true;
      activeContainer = container;
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
      moved = false;

      // Temporarily disable smooth scroll behavior to track drag responsively
      container.style.scrollBehavior = 'auto';
      container.style.cursor = 'grabbing';
      container.style.userSelect = 'none';
    };

    const handleMouseMove = (e) => {
      if (!isDown || !activeContainer) return;
      const x = e.pageX - activeContainer.offsetLeft;
      const walk = (x - startX);
      if (Math.abs(walk) > 5) {
        moved = true;
        activeContainer.scrollLeft = scrollLeft - walk;
      }
    };

    const handleMouseUp = () => {
      if (activeContainer) {
        activeContainer.style.scrollBehavior = 'smooth';
        activeContainer.style.cursor = '';
        activeContainer.style.userSelect = '';
      }
      isDown = false;
    };

    const handleMouseLeave = () => {
      if (activeContainer) {
        activeContainer.style.scrollBehavior = 'smooth';
        activeContainer.style.cursor = '';
        activeContainer.style.userSelect = '';
      }
      isDown = false;
    };

    const handleClickCapture = (e) => {
      if (moved && activeContainer && e.target.closest('.cat-wrap') === activeContainer) {
        e.stopPropagation();
        e.preventDefault();
        moved = false;
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('click', handleClickCapture, true);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('click', handleClickCapture, true);
    };
  }, []);

  return (
    <UserProvider>
      <Router>
        <ScrollToTop />
        <MetaPixelTracker />
        <CookieConsentBanner />
        <CartProvider>
          <WishlistProvider>
            <ToastContainer position="top-right" autoClose={3000} />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<PhoneAuth />} />
              <Route path="/login" element={<PhoneAuth />} />
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

              <Route path="/Aboutus" element={<Aboutus />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy-policy" element={<Privacy />} />
              <Route path="/VideoSlider" element={<VideoSlider />} />
              <Route path="/FoundationShadeFinder" element={<FoundationShadeFinder />} />
              <Route path="/shadefinder" element={<Shadefinder />} />
              <Route path="/Shadefinderundertone" element={<Shadefinderundertone />} />
              <Route path="/Shadetone" element={<Shadetone />} />
              <Route path="/Foundation" element={<Foundation />} />
              <Route path="/Mainvirtualtryon" element={<Mainvirtualtryon />} />
              <Route path="/Virtualtryon" element={<Virtualtryon />} />
              <Route path="/vto-products" element={<VtoProducts />} />
              <Route path="/Recommendations" element={<Recommendations />} />
              <Route path="/Skintypes" element={<Skintypes />} />
              <Route path="/productpage/:slug" element={<PromotionProductsPage />} />
              <Route path="/Allsaleproduct" element={<Allsaleproduct />} />
              <Route path="/Referral" element={<Referral />} />
              <Route path="/Sidebarcomon" element={<Sidebarcomon />} />
              <Route path="/Gifting" element={<Gifting />} />
              <Route path="/RecommendationSlider" element={<RecommendationSlider />} />
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
              <Route path="/Help/category/:categoryId" element={<Help />} />
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
              <Route path="/ai-beauty-lab" element={<AiBeautyLab />} />
              {/* <Route path="/skin-diagnosis" element={<SkinDiagnosis />} /> */}
              <Route path="/routines" element={<RoutineBuilder />} />
              <Route path="/routines/:shareToken" element={<RoutineBuilder />} />
              <Route path="/ingredient-compatibility" element={<IngredientCompatibility />} />
              <Route path="/ingredient/:name" element={<IngredientDetail />} />
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

              {/* 404 & Catch-All Fallback Routes */}
              <Route path="/404" element={<PageNotFound />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>

            {/* ── AI Beauty Concierge (global floating widget) ── */}
            <BeautyConcierge />
            <DiscountPopup />
          </WishlistProvider>
        </CartProvider>
      </Router>
    </UserProvider>
  );
}

export default App;