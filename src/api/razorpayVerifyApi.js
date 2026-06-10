import axios from "axios";

export const verifyRazorpayPayment = async (orderId, paymentResponse, cartItems, shippingAddress, upiId = null) => {
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

    const res = await axios.post(
      "https://beauty.joyory.com/api/payment/razorpay/verify",
      payload,
      { withCredentials: true }
    );

    return res.data; // { success: true/false, message, ... }
  } catch (err) {
    console.error("❌ Razorpay verification error:", err);
    return { success: false, error: err };
  }
};
