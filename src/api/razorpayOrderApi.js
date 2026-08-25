// src/api/razorpayOrderApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

export const createRazorpayOrder = async (
  orderId,
  paymentMethodKey,
  cartItems,
  shippingAddress,
  upiId = null
) => {
  try {
    const payload = {
      orderId,
      paymentMethodKey,
      cart: cartItems,
      shippingAddress,
      upiId,
    };

    const res = await axiosInstance.post(endpoints.payment.razorpayOrder, payload);
    return res.data; // { success: true, amount, razorpayOrderId, ... }
  } catch (err) {
    console.error("❌ Razorpay order creation error:", err);
    return { success: false, error: err };
  }
};

export default createRazorpayOrder;
