import React from 'react';
import { Alert } from 'react-bootstrap';

export default function CartPriceSummary({
    cartData,
    usePoints,
    onPointsToggle,
    onOpenCouponModal,
    onRemoveCoupon,
    onProceed,
    initiating,
    stockError,
}) {
    if (!cartData) return null;

    return (
        <div className="col-xxl-4 col-12 mt-4 mt-lg-0">
            <div className="border-color-width">
                <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
                    <div className="fw-600 ms-3 fs-5 page-title-main-name">Coupons & Bank Offers</div>
                    <i
                        className="bi bi-chevron-right margin-left-right"
                        onClick={onOpenCouponModal}
                        style={{ cursor: "pointer" }}
                    ></i>
                </div>
                <hr className="border-color-blacks" />

                <h5 className="ms-3 fs-5 fw-600 page-title-main-name">Order Summary</h5>
                <hr className="border-color-blacks" />

                {/* Reward Points Widget */}
                {cartData.wallet && cartData.wallet.rewardPoints > 0 && (
                    <>
                        <div className="reward-points-card">
                            <div className="reward-points-header">
                                <label
                                    htmlFor="useRewardPointsCheckbox"
                                    className="reward-points-title m-0"
                                    style={{
                                        cursor: (cartData.wallet.canUsePoints || (cartData.wallet.pointsUsed > 0))
                                            ? "pointer"
                                            : "not-allowed",
                                    }}
                                >
                                    <div className="reward-points-icon-wrapper">
                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="gold-coin-svg"
                                        >
                                            <circle cx="12" cy="12" r="10" fill="url(#goldGradient)" stroke="#D4AF37" strokeWidth="1.5" />
                                            <circle cx="12" cy="12" r="7" fill="none" stroke="#F3E5C8" strokeWidth="1" strokeDasharray="3 2" />
                                            <path d="M12 7.5 L13.35 10.65 L16.8 11.15 L14.3 13.6 L14.9 17.05 L12 15.4 L9.1 17.05 L9.7 13.6 L7.2 11.15 L10.65 10.65 Z" fill="#8A6D1C" />
                                            <defs>
                                                <linearGradient id="goldGradient" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                                                    <stop offset="0%" stopColor="#FFE082" />
                                                    <stop offset="50%" stopColor="#FFB300" />
                                                    <stop offset="100%" stopColor="#FFA000" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                    </div>
                                    <span className="reward-points-title-text">Joyory Reward Points</span>
                                </label>
                                <div className="reward-points-toggle-wrapper">
                                    <div
                                        className="form-check form-switch m-0"
                                        title={
                                            (!cartData.wallet.canUsePoints && !(cartData.wallet.pointsUsed > 0))
                                                ? "Reward points can only be used on orders ₹499 and above."
                                                : ""
                                        }
                                    >
                                        <input
                                            className="form-check-input reward-switch-input"
                                            type="checkbox"
                                            id="useRewardPointsCheckbox"
                                            checked={usePoints}
                                            disabled={!cartData.wallet.canUsePoints && !(cartData.wallet.pointsUsed > 0)}
                                            onChange={onPointsToggle}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="reward-points-body mt-3">
                                <div className="reward-points-balance-info d-flex align-items-center justify-content-between">
                                    <span className="reward-points-label">Available Balance</span>
                                    <div className="reward-points-badge">
                                        <span className="reward-points-count">{cartData.wallet.rewardPoints}</span>
                                        <span className="reward-points-unit">pts</span>
                                    </div>
                                </div>

                                <div className="reward-points-value-info mt-2">
                                    <span className="reward-points-value-text">
                                        Worth <strong className="reward-points-value-amount">₹{cartData.wallet.pointsValue.toFixed(2)}</strong>
                                    </span>
                                </div>

                                {!cartData.wallet.canUsePoints ? (
                                    <div className="reward-points-warning mt-3 d-flex align-items-start gap-2">
                                        <span className="warning-icon">⚠️</span>
                                        <span className="warning-text">
                                            {cartData.wallet.pointsMessage || "Reward points can only be used on orders ₹499 and above."}
                                        </span>
                                    </div>
                                ) : (
                                    usePoints && (cartData.wallet.pointsDiscount > 0 || cartData.wallet.pointsValue > 0) && (
                                        <div className="reward-points-message msg-success mt-3 p-2 rounded text-center fw-semibold">
                                            🎉 Applied ₹{(cartData.wallet.pointsDiscount || cartData.wallet.pointsValue || 0).toFixed(2)} from your points! Add more items to your cart to unlock even more point savings.
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                        <hr className="border-color-blacks" />
                    </>
                )}

                <div className="mb-3 page-title-main-name">
                    <div className="d-flex justify-content-between mb-1 margin-left-right-repert">
                        <span className="page-title-main-name">Bag MRP :</span>
                        <span className="page-title-main-name">₹{cartData.bagMrp?.toFixed(2) || "0.00"}</span>
                    </div>
                    {cartData.bagDiscount > 0 && (
                        <div className="d-flex justify-content-between mb-1 text-success margin-left-right-repert">
                            <span className="page-title-main-name text-black">Bag Discount :</span>
                            <span className="page-title-main-name">-₹{cartData.bagDiscount?.toFixed(2) || "0.00"}</span>
                        </div>
                    )}
                    <div className="d-flex justify-content-between mb-1 shipping-margin-left-right">
                        <div className="d-block">
                            <span className="page-title-main-name">Shipping :</span>
                            {cartData.shippingMessage && (
                                <div className="shipping-promo-message mb-2 page-title-main-name">
                                    <i className="bi bi-truck me-1"></i>{cartData.shippingMessage}
                                </div>
                            )}
                        </div>
                        <span className={cartData.shipping === 0 ? "text-success" : ""}>
                            {cartData.shipping === 0 ? "Free" : `₹${cartData.shipping?.toFixed(2) || "0.00"}`}
                        </span>
                    </div>
                    {cartData.couponDiscount > 0 && (
                        <div className="d-flex justify-content-between mb-1 text-success margin-left-right-repert pb-2 page-title-main-name">
                            <span>Coupon Discount:</span>
                            <span>-₹{cartData.couponDiscount?.toFixed(2) || "0.00"}</span>
                        </div>
                    )}

                    <hr className="border-color-blacks" />
                    <div className="d-flex justify-content-between mb-1 pt-2 margin-left-right-repert">
                        <span className="font-weight-in-tablable-amount page-title-main-name">Taxable Amount :</span>
                        <span className="fw-semibold page-title-main-name">₹{cartData.taxableAmount?.toFixed(2) || "0.00"}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-1 margin-left-right-repert page-title-main-name">
                        <span className="page-title-main-name">GST ({cartData.gstRate})</span>
                        <span className="page-title-main-name">+₹{cartData.gstAmount?.toFixed(2) || "0.00"}</span>
                    </div>
                    {usePoints && cartData.wallet?.pointsDiscount > 0 && (
                        <div className="d-flex justify-content-between mb-1 text-success margin-left-right-repert pb-2 page-title-main-name">
                            <span>Points Discount:</span>
                            <span>-₹{cartData.wallet.pointsDiscount.toFixed(2)}</span>
                        </div>
                    )}
                    <hr className="border-color-blacks" />
                    <div className="d-flex justify-content-between mb-3 pt-2 margin-left-right-repert align-items-center">
                        <span className="fw-semibold fs-6 page-title-main-name">Total Payable :</span>
                        <span className="fw-bold text-primary fs-5 page-title-main-name text-black">₹{cartData.payable?.toFixed(2) || "0.00"}</span>
                    </div>
                    <hr className="border-color-blacks" />
                    {cartData.savingsMessage && (
                        <div className="py-2 small margin-left-right-repert page-title-main-name">
                            {cartData.savingsMessage}
                        </div>
                    )}
                </div>

                {cartData.appliedCoupon?.code && (
                    <div className="applied-coupon-box">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <strong>Applied Coupon:</strong> <br /> {cartData.appliedCoupon.code}
                                {cartData.appliedCoupon.discount && (
                                    <span className="ms-2">- ₹{cartData.appliedCoupon.discount} off</span>
                                )}
                            </div>
                            <button className="applied-coupon-remove-btn" onClick={onRemoveCoupon}>
                                Remove
                            </button>
                        </div>
                    </div>
                )}

                {stockError && (
                    <Alert variant="warning" className="mb-2">
                        <strong>{(cartData.cart || []).find((i) => !i.canCheckout)?.name || "Item"}</strong>{" – "}{stockError}
                    </Alert>
                )}

                <button
                    className="page-title-main-name bg-black text-white checkout-button w-100 mt-3 py-2 fw-bold"
                    onClick={onProceed}
                    disabled={initiating || !!stockError}
                >
                    {initiating ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Processing...
                        </>
                    ) : (
                        <>
                            <i className="bi bi-lock-fill me-2"></i>
                            Proceed to Checkout (₹{cartData.payable?.toFixed(2)})
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
