import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/common/ScrollToTop";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserProvider } from "./context/UserContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import CartProvider from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import PhoneAuth from "./pages/PhoneAuth";
import ForgotPassword from "./pages/ForgotPassword";
import Otp from "./pages/Otp";
import ResetPassword from "./pages/ResetPassword";
import VerifyOtp from "./pages/VerifyOtp";
import TopCategories from "./components/sections/home/TopCategories";
import ProductPage from "./pages/ProductPage";
import ProductDetail from "./pages/ProductDetail";
import BestSellers from "./components/sections/home/BestSellers";
import Foryou from "./components/sections/home/ForYou";
import Blog from "./pages/Blog";
import BlogDetails from "./pages/BlogDetails";
import Wishlist from "./pages/Wishlist";
import AddressSelection from "./pages/AddressSelection";
import PaymentPage from "./pages/PaymentPage";
import Wallet from "./pages/Wallet";
import Myorders from "./pages/MyOrders";
import OffersSlider from "./components/sections/home/OffersSlider";
import BrandsSlider from "./components/sections/home/BrandsSlider";
import BrandPage from "./pages/BrandPage";
import PromotionProductsPage from "./pages/PromotionProductsPage";
import Aboutus from "./pages/AboutUs";
import VideoSlider from "./components/sections/home/VideoSlider";
import MissionVisionSection from "./components/sections/about/MissionVisionSection";
import TeamSlider from "./components/sections/about/TeamSlider";
import FoundationShadeFinder from "./pages/FoundationShadeFinder";
import Shadefinder from "./pages/ShadeFinder";
import Shadefinderundertone from "./pages/ShadeFinderUndertone";
import Shadetone from "./pages/ShadeTone";
import Foundation from "./pages/Foundation";
import Virtualtryon from "./pages/VirtualTryOn";
import VtoProducts from "./pages/VtoProducts";
import Recommendations from "./pages/Recommendations";
import Skintypes from "./components/sections/home/SkinTypes";
import Allsaleproduct from "./pages/AllSaleProduct";
import Referral from "./pages/Referral";
import Sidebarcomon from "./components/common/SidebarCommon";
import Gifting from "./pages/Gifting";
import RecommendationSlider from "./components/common/RecommendationSlider";
import AboutusHero from "./components/sections/about/AboutUsHero";
import MyGiftCard from "./pages/MyGiftCard";
import Giftcardinnersection from "./pages/Giftcardinnersection";
import Addtocard from "./components/common/AddToCard";
import Ordersuccess from "./pages/OrderSuccess";
import TrackOrder from "./pages/TrackOrder";
import Affiliate from "./pages/Affiliate";

// Protected Pages
import Useraccount from "./pages/UserAccount";
import CartPage from "./pages/CartPage";
import CancelOrder from "./pages/CancelOrder";
import PaymentProcess from "./pages/PaymentProcess";
import ShopProduct from "./pages/ShopProduct";
import OrderDetails from "./pages/OrderDetails";
import OrderTrack from "./pages/OrderTrack";
import Chatbot from "./components/common/Chatbot";
import Virtualtryonhome from "./components/sections/home/VirtualTryOnHome";
import Help from "./pages/Help";
import AffiliateSignup from "./pages/AffiliateSignup";
import Affiliatelogin from "./pages/AffiliateLogin";
import Affiliatedashboard from "./pages/AffiliateDashboard";
import VariantOverlay from "./components/common/VariantOverlay";
import SearchPage from "./pages/SearchPage";
import Returnreplace from "./pages/ReturnReplace";
import ReturnReplaceDetails from "./pages/ReturnReplaceDetails";
import Mainvirtualtryon from "./pages/MainVirtualTryOn";
import DiscountProductsPage from "./pages/DiscountProductsPage";
import HeaderSearchbar from "./components/common/HeaderSearchbar";
import Bannerslider from "./components/sections/home/BannerSlider";
import ProductDetailDescription from "./components/sections/product/ProductDetailDescription";
import ProductDetailsHero from "./components/sections/product/ProductDetailsHero";
import CustomerReviews from "./components/common/CustomerReviews";
import HeaderCategories from "./components/common/HeaderCategories";
import Build from "./components/sections/home/Build";
import Certificate from "./components/sections/home/Certificate";
import Mobileheaderview from "./components/common/MobileHeaderView";
import CategoryLandingPage from "./pages/CategoryLandingPage";
import Offerlanding from "./pages/OfferLanding";
import Foryoulanding from "./pages/ForYouLanding";
import Makeupquiz from "./pages/MakeupQuiz";
// import AddressSection from "./component/AddressSection";
import AddressSections from "./pages/AddressSections";
import PageNotFound from "./pages/PageNotFound";
import ComingSoon from "./pages/ComingSoon";
import BeautyConcierge from "./pages/BeautyConcierge";
import IngredientCompatibility from "./pages/IngredientCompatibility";
import IngredientDetail from "./pages/IngredientDetail";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import RoutineBuilder from "./pages/RoutineBuilder";

function App() {
  return (
    <UserProvider>
      <Router>
        <ScrollToTop />
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

            <Route path="/TeamSlider" element={<TeamSlider />} />
            <Route path="/Aboutus" element={<Aboutus />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy-policy" element={<Privacy />} />
            <Route path="/VideoSlider" element={<VideoSlider />} />
            <Route path="/MissionVisionSection" element={<MissionVisionSection />} />
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
            <Route path="/Makeupquiz" element={<Makeupquiz />} />
            <Route path="/routines" element={<RoutineBuilder />} />
            <Route path="/routines/:shareToken" element={<RoutineBuilder />} />
            <Route path="/ingredient-compatibility" element={<IngredientCompatibility />} />
            <Route path="/ingredient/:name" element={<IngredientDetail />} />
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

          {/* ── AI Beauty Concierge (global floating widget) ── */}
          <BeautyConcierge />
          </WishlistProvider>
        </CartProvider>
      </Router>
    </UserProvider>
  );
}

export default App;