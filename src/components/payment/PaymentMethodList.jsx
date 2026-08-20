import React from 'react';
import creditcard from '../../assets/creditcard.svg';
import BhimUPI from '../../assets/BhimUPI.svg';
import cash from '../../assets/cash.svg';
import reminder from '../../assets/reminder.svg';
import giftcard from '../../assets/gift-card.svg';

export default function PaymentMethodList({
    methods = [],
    activeTab,
    onSelectMethod,
    onCashOnDelivery,
    onWalletPayment,
    onGiftCardPayment,
    onRazorpayPayment,
    isProcessing,
}) {
    const getMethodIcon = (m) => {
        if (m.key === "upi") {
            return (
                <img
                    src={BhimUPI}
                    alt="BHIM UPI"
                    className="img-fluid"
                    style={{ width: "45px", height: "auto" }}
                />
            );
        }
        if (m.key === "card") {
            return (
                <img
                    src={creditcard}
                    alt="Credit/Debit Card"
                    className="img-fluid"
                    style={{ width: "45px", height: "auto" }}
                />
            );
        }
        if (m.key === "cod") {
            return (
                <img
                    src={cash}
                    alt="Cash on Delivery"
                    className="img-fluid"
                    style={{ width: "45px", height: "auto" }}
                />
            );
        }
        if (m.key === "wallet") {
            return (
                <img
                    src={reminder}
                    alt="Wallet"
                    className="img-fluid"
                    style={{ width: "45px", height: "auto" }}
                />
            );
        }
        if (m.key === "giftcard") {
            return (
                <img
                    src={giftcard}
                    alt="Gift Card"
                    className="img-fluid"
                    style={{ width: "45px", height: "auto" }}
                />
            );
        }
        return m.icon;
    };

    return (
        <div className="flex-grow-1 col-lg-5">
            <div className="payment-method-card shadow-sm">
                {methods.map((m) => (
                    <div
                        key={m.key}
                        onClick={() => onSelectMethod(m.key)}
                        className={`payment-method-item ${activeTab === m.key ? "active" : ""}`}
                    >
                        <div className="d-flex align-items-center">
                            {/* Payment Icon */}
                            <div className="payment-method-icon me-3 d-flex align-items-center">
                                {getMethodIcon(m)}
                            </div>

                            {/* Payment Method Details */}
                            <div className="flex-grow-1 payment-method-font-size">
                                <h5 className="mb-1 fw-normal page-title-main-name">{m.name}</h5>
                                <p className="mb-0 text-muted small">{m.description}</p>
                            </div>

                            {/* Checkmark for active method */}
                            {activeTab === m.key && (
                                <i className="bi bi-check-circle-fill text-success fs-4 ms-3"></i>
                            )}
                        </div>

                        {/* Show button + inputs only when active */}
                        {activeTab === m.key && (
                            <div>
                                {m.key === "cod" ? (
                                    <button
                                        className="btn btn-dark w-100 py-3 fw-semibold page-title-main-name mt-3"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onCashOnDelivery();
                                        }}
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? "Processing..." : "Confirm Order (COD)"}
                                    </button>
                                ) : m.key === "wallet" ? (
                                    <button
                                        className="btn btn-dark w-100 py-3 fw-semibold page-title-main-name mt-3"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onWalletPayment();
                                        }}
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? "Processing..." : "Pay with Wallet"}
                                    </button>
                                ) : m.key === "giftcard" ? (
                                    <>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                placeholder="Gift Card Code"
                                                id="giftCardCode"
                                                className="form-control mb-2 gift-card-inputs"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Gift Card PIN"
                                                id="giftCardPin"
                                                className="form-control mb-3 gift-card-inputs"
                                            />
                                        </div>
                                        <button
                                            className="btn btn-dark w-100 py-3 fw-semibold page-title-main-name"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const code = document.getElementById("giftCardCode")?.value || "";
                                                const pin = document.getElementById("giftCardPin")?.value || "";
                                                onGiftCardPayment(code, pin);
                                            }}
                                            disabled={isProcessing}
                                        >
                                            {isProcessing ? "Processing..." : "Pay with Gift Card"}
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        className="pay-now-btn btn btn-primary w-100 py-3 fw-semibold page-title-main-name"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRazorpayPayment();
                                        }}
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? "Processing..." : "Pay Now"}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
