import axios from "axios";

export const createRazorpayOrder = async (orderId, paymentMethodKey, cartItems, shippingAddress, upiId = null) => {
  try {
    const payload = {
      orderId,
      paymentMethodKey,
      cart: cartItems,
      shippingAddress,
      upiId,
    };

    const res = await axios.post(
      "https://beauty.joyory.com/api/payment/razorpay/order",
      payload,
      { withCredentials: true }
    );

    return res.data; // { success: true, amount, razorpayOrderId, ... }
  } catch (err) {
    console.error("❌ Razorpay order creation error:", err);
    return { success: false, error: err };
  }
};
