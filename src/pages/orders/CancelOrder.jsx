import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Loader from "../../components/common/Loader";
import { Swiper, SwiperSlide } from "swiper/react";
import { UserContext } from "../../context/UserContext.jsx";
import { CartContext } from "../../context/CartContext.jsx";
import { getCartRecommendations } from "../../api/cartApi";
import { getOrderById } from "../../api/orderApi";
import { getRefundMethods, setRefundMethod as apiSetRefundMethod } from "../../api/paymentApi";
import ProductCard from "../../components/common/ProductCard";
import useWishlist from "../../hooks/useWishlist";
import { getProductDisplayData } from "../../utils/productHelpers";

const CancelOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = useParams();

  const { user } = useContext(UserContext);
  const { syncCartFromBackend } = useContext(CartContext);
  const { wishlistData, wishlistLoading, toggleWishlist } = useWishlist(user);

  const [recommendations, setRecommendations] = useState([]);
  const [recoLoading, setRecoLoading] = useState(false);

  // Fetch recommendations
  const fetchRecommendations = async () => {
    try {
      setRecoLoading(true);
      const res = await getCartRecommendations();
      const data = res.data;
      if (data?.success && Array.isArray(data.sections)) {
        setRecommendations(data.sections);
      }
    } catch (err) {
      console.error("Error fetching recommendations:", err);
    } finally {
      setRecoLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  // Get order from location state or fetch from sessionStorage
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [refundOptions, setRefundOptions] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [showRefundPopup, setShowRefundPopup] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  const orderIdToUse = order?._id || orderId;

  // Clear order success data from sessionStorage on mount
  useEffect(() => {
    sessionStorage.removeItem("orderSuccessData");
    sessionStorage.removeItem("lastOrderId");
  }, []);

  // Fetch order details if not in state
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!order && orderId) {
        try {
          setLoading(true);
          const storedOrder = sessionStorage.getItem(`cancelledOrder_${orderId}`);
          if (storedOrder) {
            setOrder(JSON.parse(storedOrder));
            setLoading(false);
            return;
          }

          const response = await getOrderById(orderId);
          const data = response.data;
          if (data?.success && data.order) {
            setOrder(data.order);
            sessionStorage.setItem(`cancelledOrder_${orderId}`, JSON.stringify(data.order));
          }
        } catch (err) {
          console.error("Error fetching order details:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrderDetails();
  }, [order, orderId]);

  // Fetch refund options
  useEffect(() => {
    const fetchRefundOptions = async () => {
      try {
        if (order?.refund?.availableMethods?.length > 0) {
          setRefundOptions(order.refund.availableMethods);
          return;
        }

        const res = await getRefundMethods();
        const data = res.data;

        if (data?.success && Array.isArray(data.methods)) {
          setRefundOptions(data.methods);
        } else {
          setRefundOptions([
            { key: "razorpay", label: "Original Payment Method" },
            { key: "wallet", label: "Joyory Wallet" },
          ]);
        }
      } catch (err) {
        console.error("❌ Error fetching refund methods:", err);
        setRefundOptions([
          { key: "razorpay", label: "Original Payment Method" },
          { key: "wallet", label: "Joyory Wallet" },
        ]);
      }
    };

    if (order) {
      fetchRefundOptions();
    }
  }, [order]);

  // Handle refund method selection
  const handleRefund = async () => {
    if (!selectedMethod) {
      alert("Please select a refund method!");
      return;
    }

    if (!orderIdToUse) {
      setError("Order ID not found");
      return;
    }

    setProcessing(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await apiSetRefundMethod({
        orderId: orderIdToUse,
        method: selectedMethod,
      });

      const data = res.data;

      if (data?.success) {
        setSuccessMsg(data.message || "✅ Refund method submitted successfully!");
        setShowRefundPopup(false);

        const updatedOrder = {
          ...order,
          refund: {
            ...order?.refund,
            selectedMethod: selectedMethod,
            selectedMethodLabel: refundOptions.find(opt => opt.key === selectedMethod)?.label,
            status: "processing",
          },
        };

        setOrder(updatedOrder);
        sessionStorage.setItem(`cancelledOrder_${orderIdToUse}`, JSON.stringify(updatedOrder));
      } else {
        setError(data.message || "Refund submission failed. Please try again later.");
      }
    } catch (err) {
      console.error("❌ Refund error:", err);
      setError("Something went wrong while processing your refund.");
    } finally {
      setProcessing(false);
    }
  };

  // Safe navigation function
  const safeNavigate = (path) => {
    window.onpopstate = null;
    navigate(path, { replace: true });
  };

  if (loading) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader text="Loading order details..." height={150} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-5 text-center">
        <h4 className="text-danger mb-3">No Cancel Order Details Found</h4>
        <button className="btn btn-primary" onClick={() => safeNavigate("/Myorders")}>
          Go to My Orders
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Premium Cancelled Banner */}
      <div className="cancel-banner">
        <div className="cancel-banner-title-wrap">
          <h2 className="cancel-banner-title">Your Order Is Cancelled Successfully</h2>
          <span className="cancel-banner-icon-container">
            <i className="bi bi-x-circle-fill text-danger ms-2" style={{ fontSize: "32px", verticalAlign: "middle" }}></i>
          </span>
        </div>
        <p className="cancel-banner-subtext">
          We've received your order and it's now being cancelled.
        </p>
        <button className="cancel-banner-btn" onClick={() => safeNavigate("/")}>
          Continue Shopping &rarr;
        </button>
      </div>

      {/* Recommendations Loader */}
      {recoLoading && (
        <div className="d-flex flex-column align-items-center justify-content-center py-5 w-100">
          <DotLottieReact
            className="loader-responsive"
            src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
            loop
            autoplay
            style={{ height: "200px" }}
          />
          <p className="text-muted mt-2">Loading recommendations...</p>
        </div>
      )}

      {/* Recommendations */}
      {!recoLoading && recommendations.length > 0 && (
        <div className="mt-5">
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
                <h3
                  className="text-start foryou-heading ms-0 mt-3 mb-4 fw-normal"
                  style={{ fontSize: "1.6rem" }}
                >
                  {section.title || "You May Also Like"}
                </h3>

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
  );
};

export default CancelOrder;
