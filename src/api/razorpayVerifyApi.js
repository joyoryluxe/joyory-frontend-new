// src/api/razorpayVerifyApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

export const verifyRazorpayPayment = async (
  orderId,
  paymentResponse,
  cartItems,
  shippingAddress,
  upiId = null
) => {
  try {
    const payload = {
      orderId,
      razorpay_order_id: paymentResponse?.razorpay_order_id,
      razorpay_payment_id: paymentResponse?.razorpay_payment_id,
      razorpay_signature: paymentResponse?.razorpay_signature,
      cart: cartItems,
      shippingAddress,
      upiId,
    };

    const res = await axiosInstance.post(endpoints.payment.razorpayVerify, payload);
    return res.data; // { success: true/false, message, ... }
  } catch (err) {
    console.error("❌ Razorpay verification error:", err);
    return { success: false, error: err };
  }
};

export default verifyRazorpayPayment;
