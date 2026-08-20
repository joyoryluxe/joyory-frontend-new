import React from 'react';
import { FaTimes } from 'react-icons/fa';
import applyGif from '../../../assets/Apply.gif';

export default function CartCouponModal({
    show,
    onClose,
    activeCouponTab,
    setActiveCouponTab,
    applicableCoupons = [],
    inapplicableCoupons = [],
    appliedCouponCode = null,
    onCouponSubmit,
    applyingCoupon,
    showApplyAnimation,
    onShowDiscountProducts,
}) {
    if (!show) return null;

    const currentCoupons = activeCouponTab === "available" ? applicableCoupons : inapplicableCoupons;

    return (
        <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
            <div className="modal-dialog modal-lg modal-dialog-centered page-title-main-name" role="document">
                <div className="modal-content border-0 rounded-0">
                    <div className="modal-header border-bottom py-3 px-4">
                        <h5 className="modal-title fw-normal" style={{ color: "#444" }}>Apply Coupon</h5>
                        <button
                            type="button"
                            className="btn-close shadow-none mb-0"
                            onClick={onClose}
                            aria-label="Close"
                        >
                            <FaTimes />
                        </button>
                    </div>
                    <div className="modal-body p-4 bg-light">
                        <ul className="nav nav-tabs border-0 mb-4 justify-content-center">
                            <li className="nav-item">
                                <button
                                    className={`nav-link border-0 shadow-none ${activeCouponTab === "available" ? "active border-bottom border-dark text-dark fw-bold" : "text-muted"}`}
                                    onClick={() => setActiveCouponTab("available")}
                                >
                                    Available
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link border-0 shadow-none ${activeCouponTab === "inapplicable" ? "active border-bottom border-dark text-dark fw-bold" : "text-muted"}`}
                                    onClick={() => setActiveCouponTab("inapplicable")}
                                >
                                    Not Applicable
                                </button>
                            </li>
                        </ul>
                        <div className="row row-cols-1 row-cols-md-2 g-3">
                            {currentCoupons?.map((c) => {
                                const isAlreadyApplied = appliedCouponCode && appliedCouponCode.trim().toLowerCase() === c.code.trim().toLowerCase();

                                return (
                                    <div className="col-lg-6 col-md-12" key={c._id || c.code}>
                                        <div className={`coupon-ticket shadow-sm ${activeCouponTab === "inapplicable" ? "opacity-75" : ""}`}>
                                            <div className="ticket-sidebar">
                                                <div className="ticket-notch"></div>
                                                <span className="ticket-code-rotated">{c.code}</span>
                                            </div>
                                            <div className="ticket-body">
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <h6 className="mb-1 fw-bold text-secondary page-title-main-name">{c.label || "Offer"}</h6>
                                                    {activeCouponTab === "available" && (
                                                        <button
                                                            className="page-title-main-name border-0 bg-transparent btn-link text-decoration-none p-0 ticket-apply-btn d-flex align-items-center gap-2"
                                                            onClick={() => onCouponSubmit(c.code)}
                                                            disabled={applyingCoupon}
                                                            style={isAlreadyApplied ? { color: "#28a745", fontWeight: "bold" } : {}}
                                                        >
                                                            {applyingCoupon ? (
                                                                <>
                                                                    <span className="spinner-border spinner-border-sm"></span>
                                                                    Applying...
                                                                </>
                                                            ) : isAlreadyApplied ? (
                                                                "Applied"
                                                            ) : (
                                                                "Apply"
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="ticket-desc mb-2 text-muted page-title-main-name">
                                                    {c.description || "Enjoy discount on your order"}
                                                </p>
                                                <div className="ticket-divider"></div>
                                                <small
                                                    className="ticket-footer text-muted page-title-main-name"
                                                    style={{ cursor: "pointer", textDecoration: "underline" }}
                                                    onClick={() => onShowDiscountProducts(c)}
                                                >
                                                    Valid on select products
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {showApplyAnimation && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        zIndex: 9999,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                    }}
                >
                    <img
                        src={applyGif}
                        alt="Applying coupon"
                        style={{ width: "20%", marginBottom: "10px" }}
                    />
                </div>
            )}
        </div>
    );
}
