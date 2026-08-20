import React from 'react';
import { Spinner } from 'react-bootstrap';

export default function CheckoutPriceSidebar({
    cartCount = 0,
    priceDetails = {},
    isProcessing = false,
    processingMessage = "",
    onProceed,
    addressError = "",
    formatCurrency,
}) {
    const defaultFormat = (amount) => {
        if (amount === null || amount === undefined) return "0.00";
        return parseFloat(amount).toFixed(2);
    };

    const fmt = formatCurrency || defaultFormat;

    return (
        <div className="right-column">
            <h4 className="order-summary-title">
                Order Summary ({cartCount} {cartCount === 1 ? 'item' : 'items'})
            </h4>

            <div className="price-row">
                <span>Bag MRP:</span>
                <span>₹{fmt(priceDetails.bagMrp)}</span>
            </div>

            {priceDetails.bagDiscount > 0 && (
                <div className="price-row">
                    <span>Bag Discount:</span>
                    <span className="discount-amount">-₹{fmt(priceDetails.bagDiscount)}</span>
                </div>
            )}

            <div className="price-row">
                <span>Shipping:</span>
                <span>
                    {priceDetails.shipping === 0 ? (
                        <span className="free-shipping">Free Shipping</span>
                    ) : (
                        <>
                            ₹{fmt(priceDetails.shipping)}
                            {priceDetails.shippingMessage && (
                                <span style={{ color: "#1976d2", fontSize: 12, marginLeft: 6 }}>
                                    ({priceDetails.shippingMessage})
                                </span>
                            )}
                        </>
                    )}
                </span>
            </div>

            {priceDetails.couponDiscount > 0 && (
                <div className="price-row">
                    <span>Coupon Discount:</span>
                    <span className="discount-amount">-₹{fmt(priceDetails.couponDiscount)}</span>
                </div>
            )}

            {priceDetails.pointsDiscount > 0 && (
                <div className="price-row">
                    <span>Points Discount:</span>
                    <span className="discount-amount">-₹{fmt(priceDetails.pointsDiscount)}</span>
                </div>
            )}

            <div className="price-row taxable-amount-row">
                <span>Taxable Amount:</span>
                <span>₹{fmt(priceDetails.taxableAmount)}</span>
            </div>

            <div className="price-row">
                <span>GST ({priceDetails.gstRate || "0%"})</span>
                <span>+₹{fmt(priceDetails.gstAmount)}</span>
            </div>

            <hr className="section-divider" />

            <div className="price-row total-payable-row bg-white p-0">
                <span>Total Payable:</span>
                <span>₹{fmt(priceDetails.payable)}</span>
            </div>

            {priceDetails.totalSavings > 0 && (
                <div className="savings-card m-0">
                    {priceDetails.savingsMessage && (
                        <div className="savings-message m-0">
                            {priceDetails.savingsMessage}
                        </div>
                    )}
                </div>
            )}

            {priceDetails.appliedCoupon?.code && (
                <div className="coupon-card">
                    <span>
                        <strong>Applied Coupon:</strong> {priceDetails.appliedCoupon.code}
                        {priceDetails.appliedCoupon.discount && (
                            <span style={{ marginLeft: "10px" }}>- ₹{priceDetails.appliedCoupon.discount} off</span>
                        )}
                    </span>
                </div>
            )}

            <button
                className={`pay-btn ${isProcessing ? 'pay-btn-disabled' : ''}`}
                onClick={onProceed}
                disabled={isProcessing}
            >
                {isProcessing ? (
                    <>
                        <Spinner
                            animation="border"
                            size="sm"
                            className="me-2"
                            style={{ width: '1rem', height: '1rem' }}
                        />
                        {processingMessage || "Processing..."}
                    </>
                ) : (
                    `Proceed to Pay ₹${fmt(priceDetails.payable)}`
                )}
            </button>

            {addressError && (
                <div className="address-error-message">
                    ⚠️ {addressError}
                </div>
            )}

            <div className="payment-note">
                <span className="secure-badge">✓</span>
                <span>GST Invoice Available • Secure Payment</span>
            </div>
        </div>
    );
}
