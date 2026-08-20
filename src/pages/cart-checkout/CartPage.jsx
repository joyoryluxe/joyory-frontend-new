import React, { useEffect, useState, useContext, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import "../../styles/CartPage.css";
import "../../styles/ForYou.css";
import "../../App.css";
import "../../styles/Foundation.css";
import { CartContext } from "../../context/CartContext";
import { WishlistContext } from "../../context/WishlistContext";
import { UserContext } from "../../context/UserContext.jsx";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import {
  getCartSummary,
  updateCartQuantity,
  removeFromCart,
  moveCartItemToWishlist,
  initiateOrder,
  getCartRecommendations,
} from "../../api/cartApi";
import ProductCard from "../../components/common/ProductCard";
import useWishlist from "../../hooks/useWishlist";
import { getProductDisplayData } from "../../utils/productHelpers";
import CartItemsList from "../../components/sections/cart/CartItemsList";
import CartPriceSummary from "../../components/sections/cart/CartPriceSummary";
import CartCouponModal from "../../components/sections/cart/CartCouponModal";

// ─── Confetti Particle Burst ──────────────────────────────────────────────────
const ConfettiBurst = ({ active }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (active) {
      const colors = ['#D4AF37', '#FFD700', '#FFA500', '#FF6347', '#4CAF50', '#2196F3', '#9C27B0'];
      const newParticles = Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
        width: `${Math.random() * 8 + 6}px`,
        height: `${Math.random() * 8 + 6}px`,
        left: `${Math.random() * 80 + 10}%`,
        top: `${Math.random() * 40 + 20}%`,
        delay: `${Math.random() * 0.2}s`,
        duration: `${Math.random() * 1.5 + 2.5}s`,
        shootX: `${(Math.random() - 0.5) * 400}px`,
        shootY: `${-(Math.random() * 300 + 150)}px`,
        rotateDeg: `${(Math.random() - 0.5) * 720}deg`,
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
      }, 4000);
      return () => clearTimeout(timer);
    } else {
      setParticles([]);
    }
  }, [active]);

  if (particles.length === 0) return null;

  return (
    <div className="confetti-container">
      {particles.map((p) => (
        <span
          key={p.id}
          className="confetti-particle"
          style={{
            backgroundColor: p.color,
            borderRadius: p.borderRadius,
            width: p.width,
            height: p.height,
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
            animationDuration: p.duration,
            '--shoot-x': p.shootX,
            '--shoot-y': p.shootY,
            '--rotate-deg': p.rotateDeg,
          }}
        />
      ))}
    </div>
  );
};

// ─── Main CartPage ────────────────────────────────────────────────────────────
const CartPage = () => {
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [showApplyAnimation, setShowApplyAnimation] = useState(false);
  const [movingToWishlist, setMovingToWishlist] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { syncCartFromBackend } = useContext(CartContext);
  const { syncWishlist } = useContext(WishlistContext);
  const { user } = useContext(UserContext);

  // Shared wishlist hook
  const { wishlistData, wishlistLoading, toggleWishlist } = useWishlist(user);

  const getCleanProductSlug = (item) => {
    try {
      const slugMap = JSON.parse(localStorage.getItem("productSlugMap") || "{}");
      return slugMap[item.productId] || item.productSlug || item.productId;
    } catch {
      return item.productSlug || item.productId;
    }
  };

  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initiating, setInitiating] = useState(false);
  const [stockError, setStockError] = useState("");
  const [usePoints, setUsePoints] = useState(() => localStorage.getItem("useRewardPoints") === "true");
  const [showPointsConfetti, setShowPointsConfetti] = useState(false);
  const cartCallRef = useRef(0);

  // Recommendations
  const [recommendations, setRecommendations] = useState([]);
  const [recoLoading, setRecoLoading] = useState(false);

  // Confirm remove modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  const handleShowConfirm = (item) => { setItemToRemove(item); setShowConfirm(true); };
  const handleCloseConfirm = () => { setShowConfirm(false); setItemToRemove(null); };

  const handleConfirmRemove = () => {
    setShowPointsConfetti(false);
    setCouponMessage("");
    if (itemToRemove) handleRemoveByProductId(itemToRemove.productId, itemToRemove.selectedVariant?.sku || null);
    handleCloseConfirm();
  };

  const handleMoveToWishlist = async () => {
    if (!itemToRemove) return;
    setShowPointsConfetti(false);
    setCouponMessage("");
    setMovingToWishlist(true);
    try {
      const productId = itemToRemove.productId;
      const variantSku = itemToRemove.selectedVariant?.sku || null;

      if (user && !user.guest) {
        await moveCartItemToWishlist(productId, { sku: variantSku });
      } else {
        localStorage.setItem("pendingCartAction", JSON.stringify({
          type: "move-to-wishlist",
          productId,
          sku: variantSku
        }));
        handleCloseConfirm();
        toast.info("Please login to move items to your wishlist");
        navigate("/login", { state: { from: "/cartpage" } });
        return;
      }

      handleCloseConfirm();
      syncCartFromBackend();
      navigate("/Wishlist");
    } catch (err) {
      console.error("Error moving item to wishlist:", err);
      alert("Failed to move item to wishlist. Please try again.");
    } finally {
      setMovingToWishlist(false);
    }
  };

  const [couponMessage, setCouponMessage] = useState("");
  const [couponMessageColor, setCouponMessageColor] = useState("info");
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [activeCouponTab, setActiveCouponTab] = useState("available");

  // ── fetch cart ──────────────────────────────────────────────────────────────
  const fetchCart = async (discountCode = null, silent = false, pointsVal = null) => {
    cartCallRef.current++;
    const currentCallId = cartCallRef.current;
    try {
      if (!silent) setLoading(true);

      const queryParams = new URLSearchParams();
      queryParams.append("t", Date.now().toString());

      const finalDiscount = discountCode !== null
        ? discountCode
        : (localStorage.getItem("appliedCoupon") || "");
      queryParams.append("discount", finalDiscount);

      let finalPoints = 0;
      if (pointsVal !== null) {
        finalPoints = Number(pointsVal);
      } else {
        const wantPoints = localStorage.getItem("useRewardPoints") === "true";
        if (wantPoints) {
          const savedAmount = localStorage.getItem("rewardPointsAmount");
          finalPoints = savedAmount ? Number(savedAmount) : 99999999;
        }
      }

      queryParams.append("pointsToUse", finalPoints);

      const res = await getCartSummary(Object.fromEntries(queryParams.entries()));
      const data = res.data;
      if (currentCallId !== cartCallRef.current) return;
      const normalizedCart = (data.cart || []).map((item) => {
        const variant = item.variant || {};
        const price = variant.displayPrice || variant.discountedPrice || 0;
        const originalPrice = variant.originalPrice || price;
        const discountPercent = variant.discountPercent || (originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0);
        const discounts = discountPercent > 0 ? [{ type: "Discount", amount: originalPrice - price, note: `${discountPercent}% Off` }] : [];
        return {
          cartItemId: item._id || `${item.product}-${variant.sku || "default"}`,
          productId: item.product || item.productId,
          productSlug: item.slug || (item.product && typeof item.product === 'object' ? item.product.slugs?.[0] || item.product.slug : null) || null,
          name: item.name || "Unnamed Product",
          image: variant.image || "/placeholder.png",
          brand: item.brand || "",
          selectedVariant: variant,
          quantity: item.quantity || 1,
          price,
          subTotal: item.itemTotal || price * (item.quantity || 1),
          discounts,
          stockStatus: item.stockStatus || (variant.stock > 0 ? "in_stock" : "out_of_stock"),
          stockMessage: item.stockMessage || "",
          canCheckout: item.canCheckout !== false,
        };
      });

      const p = data.priceDetails || {};
      const mappedWallet = data.wallet ? {
        ...data.wallet,
        pointsValue: data.wallet.pointsValue !== undefined && data.wallet.pointsValue !== null
          ? Number(data.wallet.pointsValue)
          : ((Number(data.wallet.rewardPoints) || 0) * 0.1),
        pointsDiscount: data.wallet.pointsDiscount !== undefined && data.wallet.pointsDiscount !== null
          ? Number(data.wallet.pointsDiscount)
          : ((Number(data.wallet.pointsUsed) || 0) * 0.1),
      } : null;

      setCartData({
        cart: normalizedCart,
        freebies: data.freebies || [],
        bagMrp: p.bagMrp || 0, bagDiscount: p.bagDiscount || 0, autoDiscount: p.autoDiscount || 0,
        couponDiscount: p.couponDiscount || 0, shipping: p.shippingCharge || 0,
        taxableAmount: p.taxableAmount || 0, gstRate: p.gstRate || "0%",
        gstAmount: p.gstAmount || 0, gstMessage: p.gstMessage || "",
        payable: p.payable || 0, appliedCoupon: data.appliedCoupon || null,
        applicableCoupons: data.applicableCoupons || [], inapplicableCoupons: data.inapplicableCoupons || [],
        promotions: data.appliedPromotions || [], totalSavings: p.totalSavings || 0,
        savingsMessage: p.savingsMessage || "", grandTotal: data.grandTotal || p.payable || 0,
        shippingMessage: p.shippingMessage || "",
        wallet: mappedWallet,
      });

      if (mappedWallet) {
        const canUsePoints = mappedWallet.canUsePoints;
        const pointsUsed = mappedWallet.pointsUsed || 0;
        const wantPoints = localStorage.getItem("useRewardPoints") === "true";

        const isEligibleOrUsing = canUsePoints || (pointsUsed > 0);
        const shouldBeActive = isEligibleOrUsing && wantPoints;

        if (shouldBeActive) {
          setUsePoints(true);
          localStorage.setItem("useRewardPoints", "true");
        } else {
          setUsePoints(false);
          localStorage.setItem("useRewardPoints", "false");
        }
      } else {
        setUsePoints(false);
      }
      const offender = (data.cart || []).find((i) => !i.canCheckout);
      setStockError(offender ? offender.stockMessage : "");
    } catch (err) {
      console.error("Error fetching cart:", err);
      if (currentCallId !== cartCallRef.current) return;
      const isGuest = !user || user.guest;
      if (isGuest) {
        try {
          const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
          const normalizedCart = guestCart.map((item) => ({
            cartItemId: item.cartItemId || `${item.productId}-${item.selectedVariant?.sku || "default"}`,
            productId: item.productId,
            productSlug: item.selectedVariant?.slug || (item.product ? item.product.slugs?.[0] || item.product.slug : null) || null,
            name: item.name || "Unnamed Product",
            image: item.image || "/placeholder.png",
            brand: item.brand || "",
            selectedVariant: item.selectedVariant || {},
            quantity: item.quantity || 1,
            price: item.price || 0,
            subTotal: (item.price || 0) * (item.quantity || 1),
            discounts: [],
            stockStatus: "in_stock",
            stockMessage: "",
            canCheckout: true,
          }));

          const totalAmount = normalizedCart.reduce((sum, item) => sum + item.subTotal, 0);

          setCartData({
            cart: normalizedCart,
            freebies: [],
            bagMrp: totalAmount,
            bagDiscount: 0,
            autoDiscount: 0,
            couponDiscount: 0,
            shipping: 0,
            taxableAmount: totalAmount,
            gstRate: "12%",
            gstAmount: Math.round(totalAmount * 0.12 * 100) / 100,
            gstMessage: "",
            payable: totalAmount,
            appliedCoupon: null,
            applicableCoupons: [],
            inapplicableCoupons: [],
            promotions: [],
            totalSavings: 0,
            savingsMessage: "",
            grandTotal: totalAmount,
            shippingMessage: "",
          });
          setStockError("");
        } catch (localErr) {
          console.error("Error parsing guestCart from localStorage:", localErr);
          setCartData(null);
        }
      } else {
        setCartData(null);
      }
    } finally {
      if (currentCallId === cartCallRef.current) {
        if (!silent) setLoading(false);
      }
    }
  };

  // ── fetch recommendations ───────────────────────────────────────────────────
  const fetchRecommendations = async () => {
    try {
      const res = await getCartRecommendations();
      const data = res.data;
      if (data.success && Array.isArray(data.sections)) {
        setRecommendations(data.sections);
      }
    } catch (err) {
      console.error("Error fetching recommendations:", err);
    } finally {
      setRecoLoading(false);
    }
  };

  // ── quantity change ─────────────────────────────────────────────────────────
  const handleQuantityChange = async (cartItemId, newQty) => {
    if (newQty < 1) return;
    if (newQty > 6) return alert("Max 6 units allowed.");
    setShowPointsConfetti(false);
    setCouponMessage("");
    const item = cartData?.cart?.find((i) => i.cartItemId === cartItemId);
    if (!item) return;
    try {
      const appliedCoupon = cartData?.appliedCoupon?.code || null;
      await updateCartQuantity({ productId: item.productId, variantSku: item.selectedVariant?.sku || null, quantity: newQty, discount: appliedCoupon });
      sessionStorage.setItem("cartPendingToast", JSON.stringify({ message: "Cart updated successfully!", type: "success" }));
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to update quantity. Please try again.");
      window.location.reload();
    }
  };

  // ── remove item ─────────────────────────────────────────────────────────────
  const handleRemoveByProductId = async (productId, variantSku = null) => {
    if (!productId) return;
    setShowPointsConfetti(false);
    setCouponMessage("");
    try {
      await removeFromCart(productId, variantSku ? { variantSku } : {});
      sessionStorage.setItem("cartPendingToast", JSON.stringify({ message: "Item removed from cart.", type: "success" }));
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to remove item from cart.");
      window.location.reload();
    }
  };

  // ── coupon handlers ─────────────────────────────────────────────────────────
  const handleCouponSubmit = async (code) => {
    setShowPointsConfetti(false);
    if (!code) {
      setCouponMessage("Please enter a coupon code.");
      setCouponMessageColor("warning");
      return;
    }

    const trimmedCode = code.trim().toLowerCase();
    if (cartData?.appliedCoupon?.code && cartData.appliedCoupon.code.trim().toLowerCase() === trimmedCode) {
      setCouponMessage("Coupon already applied!");
      setCouponMessageColor("warning");
      return;
    }

    try {
      setApplyingCoupon(true);
      setShowApplyAnimation(true);

      await new Promise((res) => setTimeout(res, 1500));

      await fetchCart(code);
      await syncCartFromBackend();
      localStorage.setItem("appliedCoupon", code);

      setShowApplyAnimation(false);
      setShowCouponModal(false);

      sessionStorage.setItem("cartPendingToast", JSON.stringify({ message: `Coupon ${code} applied successfully!`, type: "success" }));
      window.location.reload();
    } catch {
      setCouponMessage("Failed to apply coupon.");
      setCouponMessageColor("danger");
      setShowApplyAnimation(false);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = async () => {
    setShowPointsConfetti(false);
    localStorage.removeItem("appliedCoupon");
    sessionStorage.setItem("cartPendingToast", JSON.stringify({ message: "Coupon removed.", type: "info" }));
    window.location.reload();
  };

  const handleShowDiscountProducts = (coupon) => {
    navigate("/DiscountProductsPage", { state: { coupon, activeCouponTab } });
  };

  // ── points toggle ───────────────────────────────────────────────────────────
  const handlePointsToggle = async (e) => {
    const checked = e.target.checked;
    localStorage.setItem("useRewardPoints", checked ? "true" : "false");
    setUsePoints(checked);

    const savedCoupon = localStorage.getItem("appliedCoupon");
    const pointsToUse = checked ? cartData.wallet.rewardPoints : 0;

    if (checked) {
      localStorage.setItem("rewardPointsAmount", String(pointsToUse));
      localStorage.setItem("showPointsConfetti", "true");
    } else {
      localStorage.removeItem("rewardPointsAmount");
      localStorage.removeItem("showPointsConfetti");
    }

    try {
      await fetchCart(savedCoupon, true, pointsToUse);
      await syncCartFromBackend();
    } catch (err) {
      console.error("Error updating cart points:", err);
    }

    window.location.reload();
  };

  // ── checkout ────────────────────────────────────────────────────────────────
  const handleProceed = async () => {
    try {
      setInitiating(true);

      if (!document.cookie.includes("token=")) {
        setTimeout(() => {
          navigate("/login", {
            state: {
              from: "/cartpage",
              message: "Please login to proceed with checkout",
            },
          });
        }, 1200);
        return;
      }

      const body = {
        discountCode: cartData?.appliedCoupon?.code || null,
        pointsToUse: cartData?.wallet?.pointsUsed || 0,
        giftCardCode: cartData?.giftCardApplied?.code || null,
        giftCardPin: cartData?.giftCardApplied?.pin || null,
        giftCardAmount: cartData?.giftCardApplied?.amount || 0,
        taxableAmount: cartData?.taxableAmount || 0,
        gstAmount: cartData?.gstAmount || 0,
        gstRate: cartData?.gstRate || "0%",
      };

      const res = await initiateOrder(body);
      const orderData = res.data;

      setTimeout(() => {
        navigate("/AddressSelection", {
          state: {
            orderId: orderData.orderId,
            cartItems: cartData.cart,
            priceDetails: {
              bagMrp: cartData.bagMrp,
              bagDiscount: cartData.bagDiscount,
              autoDiscount: cartData.autoDiscount,
              couponDiscount: cartData.couponDiscount,
              pointsDiscount: cartData?.wallet?.pointsDiscount || 0,
              pointsUsed: cartData?.wallet?.pointsUsed || 0,
              referralPointsUsed: cartData?.wallet?.pointsUsed || 0,
              shipping: cartData.shipping,
              taxableAmount: cartData.taxableAmount,
              gstRate: cartData.gstRate,
              gstAmount: cartData.gstAmount,
              gstMessage: cartData.gstMessage,
              payable: cartData.payable,
              appliedCoupon: cartData.appliedCoupon,
              totalSavings: cartData.totalSavings,
              savingsMessage: cartData.savingsMessage,
            },
          },
        });
      }, 1500);

    } catch (err) {
      console.error("Checkout Error:", err);
      alert(err.message || "Something went wrong during checkout.");
      setInitiating(false);
    }
  };

  // ── Pending toast check on mount ─────────────────────────────────────────────
  useEffect(() => {
    const pendingToast = sessionStorage.getItem("cartPendingToast");
    if (pendingToast) {
      try {
        const { message, type } = JSON.parse(pendingToast);
        if (type === "success") {
          toast.success(message);
        } else if (type === "error") {
          toast.error(message);
        } else if (type === "info") {
          toast.info(message);
        } else if (type === "warning") {
          toast.warn(message);
        }
      } catch (e) {
        console.error("Error showing pending toast:", e);
      }
      sessionStorage.removeItem("cartPendingToast");
    }
  }, []);

  // ── mount ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      const applyCode = location.state?.applyCouponCode;
      const savedCoupon = localStorage.getItem("appliedCoupon");
      if (applyCode) await fetchCart(applyCode);
      else if (savedCoupon) await fetchCart(savedCoupon);
      else await fetchCart();
      await syncCartFromBackend();
    };
    load();
    fetchRecommendations();
  }, []);

  // ── Handle pending cart action after login ───────────────────────────────────
  useEffect(() => {
    const handlePendingCartAction = async () => {
      if (!user || user.guest) return;

      const pendingActionStr = localStorage.getItem("pendingCartAction");
      if (pendingActionStr) {
        try {
          const { type, productId, sku } = JSON.parse(pendingActionStr);
          localStorage.removeItem("pendingCartAction");

          if (type === "move-to-wishlist") {
            await moveCartItemToWishlist(productId, { sku });
            sessionStorage.setItem("cartPendingToast", JSON.stringify({ message: "Product moved to wishlist successfully!", type: "success" }));
            window.location.reload();
          }
        } catch (e) {
          console.error("Error executing pending cart action:", e);
        }
      }
    };
    handlePendingCartAction();
  }, [user, syncWishlist]);

  // ── Auto-clear coupon message ──────────────────────────────────────────────
  useEffect(() => {
    if (couponMessage) {
      const timer = setTimeout(() => {
        setCouponMessage("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [couponMessage]);

  // ── Clear reward points from localStorage if cart is empty ─────────────────
  useEffect(() => {
    if (cartData && cartData.cart.length === 0 && cartData.freebies?.length === 0) {
      localStorage.removeItem("useRewardPoints");
      localStorage.removeItem("rewardPointsAmount");
      localStorage.removeItem("appliedCoupon");
      setUsePoints(false);
    }
  }, [cartData]);

  // ── Clean up showPointsConfetti localStorage key ───────────────────────────
  useEffect(() => {
    if (localStorage.getItem("showPointsConfetti") === "true") {
      setShowPointsConfetti(true);
      const timer = setTimeout(() => {
        setShowPointsConfetti(false);
      }, 3000);
      localStorage.removeItem("showPointsConfetti");
      return () => clearTimeout(timer);
    }
  }, []);

  // ── loading / empty states ──────────────────────────────────────────────────
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
            className='foryoulanding-css'
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

  if (!cartData || (cartData.cart.length === 0 && cartData.freebies?.length === 0)) {
    return (
      <>
        <Header />
        <div className="container mt-0 pt-xl-5">
          <div className="p-4 text-center mt-5 cartpage-empty-Main-section">
            <h2 className="page-title-main-name cartpage-titles playfair-font-bold">Oops!</h2>
            <h5 className="mb-2 page-title-main-name empty-cart-message">Your cart is empty 🛒</h5>
            <button
              className="page-title-main-name Shop-now-Button"
              onClick={() => navigate("/")}
            >
              Shop Now
            </button>
          </div>

          <div className="container mt-4">
            {!recoLoading && recommendations.length > 0 && (
              <div className="mt-4">
                {recommendations.map((section) => {
                  const filteredProducts = (section.products || []).filter((product) => {
                    if (!product) return false;
                    const variants = product.variants || [];
                    if (variants.length > 0) {
                      return variants.some((v) => (v.stock ?? 0) > 0);
                    }
                    return (product.stock ?? 0) > 0;
                  });

                  if (filteredProducts.length === 0) return null;

                  return (
                    <div key={section.key} className="mb-5">
                      <h2
                        className="text-start foryou-heading ms-0 mt-3 mb-3 fw-normal"
                        style={{ fontSize: "1.4rem" }}
                      >
                        {section.title || "Trending Products"}
                      </h2>

                      <Swiper
                        spaceBetween={20}
                        slidesPerView={2}
                        breakpoints={{
                          576: { slidesPerView: 2 },
                          768: { slidesPerView: 3 },
                          992: { slidesPerView: 4 },
                          1200: { slidesPerView: 4 },
                          1400: { slidesPerView: 4 },
                        }}
                      >
                        {filteredProducts.map((product) => {
                          const displayData = getProductDisplayData(product);
                          if (!displayData) return null;
                          return (
                            <SwiperSlide key={`${section.key}-${product._id}`}>
                              <ProductCard
                                item={displayData}
                                wishlistData={wishlistData}
                                wishlistLoading={wishlistLoading}
                                toggleWishlist={toggleWishlist}
                              />
                            </SwiperSlide>
                          );
                        })}
                      </Swiper>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <>
      {initiating && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "#fff",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <DotLottieReact
            src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
            loop
            autoplay
            style={{ width: "250px" }}
          />
          <p className="mt-3 text-muted">Preparing your checkout...</p>
        </div>
      )}
      <Header />
      <div className="container-lg Conatiner-fluid mt-0 pt-xl-5">
        <h2 className="page-title-main-name mb-4 cartpage-titlesss pt-lg-3 mt-0 mt-md-4 pt-5">Your Cart</h2>
        <div className="row">
          {/* ── Left column: cart items + freebies ── */}
          <CartItemsList
            cart={cartData.cart}
            freebies={cartData.freebies}
            onQuantityChange={handleQuantityChange}
            onShowConfirm={handleShowConfirm}
            onNavigateToProduct={(item) => navigate(`/product/${getCleanProductSlug(item)}`)}
          />

          {/* ── Right column: Order Summary ── */}
          <CartPriceSummary
            cartData={cartData}
            usePoints={usePoints}
            onPointsToggle={handlePointsToggle}
            onOpenCouponModal={() => setShowCouponModal(true)}
            onRemoveCoupon={handleRemoveCoupon}
            onProceed={handleProceed}
            initiating={initiating}
            stockError={stockError}
          />
        </div>
      </div>

      {/* ── Recommendations + From Your Wishlist ── */}
      <div className="container">
        {!recoLoading && recommendations.length > 0 && (
          <div className="mt-5">
            {recommendations.map((section) => {
              const isWishlistSection =
                section.key === "wishlist" ||
                section.title?.toLowerCase().includes("wishlist");

              const filteredProducts = (section.products || []).filter((product) => {
                if (!product) return false;
                const variants = product.variants || [];
                if (variants.length > 0) {
                  return variants.some((v) => (v.stock ?? 0) > 0);
                }
                return (product.stock ?? 0) > 0;
              });

              if (isWishlistSection && filteredProducts.length === 0) {
                return null;
              }

              const productsToRender = isWishlistSection ? filteredProducts : (section.products || []);

              return (
                <div key={section.key} className="mb-5">
                  <h2
                    className="text-start foryou-heading ms-0 mt-3 mb-3 fw-normal"
                    style={{ fontSize: "1.4rem" }}
                  >
                    {section.title}
                  </h2>

                  <Swiper
                    spaceBetween={20}
                    slidesPerView={2}
                    breakpoints={{
                      576: { slidesPerView: 2 },
                      768: { slidesPerView: 3 },
                      992: { slidesPerView: 4 },
                      1200: { slidesPerView: 4 },
                      1400: { slidesPerView: 4 },
                    }}
                  >
                    {productsToRender.map((product) => {
                      const displayData = getProductDisplayData(product);
                      if (!displayData) return null;
                      return (
                        <SwiperSlide key={`${section.key}-${product._id}`}>
                          <ProductCard
                            item={displayData}
                            wishlistData={wishlistData}
                            wishlistLoading={wishlistLoading}
                            toggleWishlist={toggleWishlist}
                          />
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirm Remove Modal */}
      <Modal className="page-title-main-name" show={showConfirm} onHide={handleCloseConfirm} centered>
        <Modal.Header style={{ position: 'relative' }}>
          <Modal.Title>Confirm Removal</Modal.Title>
          <button
            type="button"
            onClick={handleCloseConfirm}
            style={{
              position: 'absolute',
              right: '20px',
              top: '12px',
              background: 'none',
              border: 'none',
              fontSize: '28px',
              color: '#000',
              cursor: 'pointer',
              lineHeight: '1',
              padding: '0',
              opacity: '0.8',
              transition: 'opacity 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}
            className="removel-cross-btn"
          >
            &times;
          </button>
        </Modal.Header>
        <Modal.Body className="page-title-main-name">Are you sure you want to remove "{itemToRemove?.name}" from your cart?</Modal.Body>
        <Modal.Footer>
          <button
            className="modal-footer-btn"
            onClick={handleConfirmRemove}
            disabled={movingToWishlist}
          >
            Remove
          </button>
          <button
            className="modal-footer-btn"
            onClick={handleMoveToWishlist}
            disabled={movingToWishlist}
          >
            {movingToWishlist ? "Moving..." : "Move to Wishlist"}
          </button>
        </Modal.Footer>
      </Modal>

      {/* Coupon Modal */}
      <CartCouponModal
        show={showCouponModal}
        onClose={() => setShowCouponModal(false)}
        activeCouponTab={activeCouponTab}
        setActiveCouponTab={setActiveCouponTab}
        applicableCoupons={cartData.applicableCoupons}
        inapplicableCoupons={cartData.inapplicableCoupons}
        appliedCouponCode={cartData.appliedCoupon?.code}
        onCouponSubmit={handleCouponSubmit}
        applyingCoupon={applyingCoupon}
        showApplyAnimation={showApplyAnimation}
        onShowDiscountProducts={handleShowDiscountProducts}
      />

      {/* Celebratory Confetti Burst */}
      <ConfettiBurst active={showPointsConfetti || (couponMessageColor === "success" && couponMessage.includes("applied successfully"))} />

      {/* Floating Animated Coupon Toast */}
      {couponMessage && (
        <div className="coupon-toast-container">
          <div className={`coupon-toast ${couponMessageColor}`}>
            <span className={`coupon-toast-icon ${couponMessageColor}`}>
              {couponMessageColor === "success" && <i className="bi bi-check-circle-fill text-success"></i>}
              {couponMessageColor === "danger" && <i className="bi bi-x-circle-fill text-danger"></i>}
              {couponMessageColor === "warning" && <i className="bi bi-exclamation-circle-fill text-warning"></i>}
              {couponMessageColor === "info" && <i className="bi bi-info-circle-fill text-info"></i>}
            </span>
            <div className="coupon-toast-content">
              {couponMessage}
            </div>
            <button
              onClick={() => setCouponMessage("")}
              style={{
                background: "none",
                border: "none",
                fontSize: "18px",
                cursor: "pointer",
                padding: "0 0 0 10px",
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
                color: "#666",
                lineHeight: "1"
              }}
            >
              &times;
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default CartPage;
