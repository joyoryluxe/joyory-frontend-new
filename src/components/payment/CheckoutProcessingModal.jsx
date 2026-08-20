import React from 'react';
import { Modal } from 'react-bootstrap';

export default function CheckoutProcessingModal({
    show,
    processingMessage,
}) {
    const steps = [
        { id: 1, title: "Verifying order info", desc: "Syncing bag items and pricing details" },
        { id: 2, title: "Securing gateway", desc: "Establishing secure transaction handshake" },
        { id: 3, title: "Finalizing order", desc: "Registering order details with inventory" },
    ];

    const isSuccess = processingMessage === "Order created successfully!";
    const isError = processingMessage.startsWith("Error");

    const getStepStatus = (stepIndex) => {
        if (isError) {
            if (processingMessage.includes("Preparing")) return stepIndex === 1 ? "error" : (stepIndex > 1 ? "pending" : "completed");
            if (processingMessage.includes("Validating") || processingMessage.includes("payment")) return stepIndex === 2 ? "error" : (stepIndex === 1 ? "completed" : "pending");
            if (processingMessage.includes("Creating") || processingMessage.includes("order")) return stepIndex === 3 ? "error" : (stepIndex < 3 ? "completed" : "pending");
            return "error";
        }

        if (processingMessage === "Preparing your order...") {
            if (stepIndex === 1) return "active";
            if (stepIndex > 1) return "pending";
        }
        if (processingMessage === "Validating payment details...") {
            if (stepIndex < 2) return "completed";
            if (stepIndex === 2) return "active";
            if (stepIndex > 2) return "pending";
        }
        if (processingMessage === "Creating your order...") {
            if (stepIndex < 3) return "completed";
            if (stepIndex === 3) return "active";
            if (stepIndex > 3) return "pending";
        }
        if (processingMessage === "Order created successfully!") {
            return "completed";
        }

        if (stepIndex === 1) return "active";
        return "pending";
    };

    return (
        <Modal
            show={show}
            backdrop="static"
            keyboard={false}
            centered
            dialogClassName="checkout-processing-modal"
        >
            <Modal.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                    <div className="checkout-badge-icon mb-3">
                        {isSuccess ? (
                            <svg className="success-checkmark-svg" viewBox="0 0 52 52">
                                <circle className="success-checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                                <path className="success-checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                            </svg>
                        ) : isError ? (
                            <div className="error-alert-icon">⚠️</div>
                        ) : (
                            <div className="secure-lock-container">
                                <svg className="secure-lock-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                            </div>
                        )}
                    </div>
                    <h4 className="checkout-modal-title">
                        {isSuccess ? "Order Confirmed!" : isError ? "Checkout Failed" : "Secure Checkout"}
                    </h4>
                    <p className="checkout-modal-subtitle text-muted">
                        {isSuccess
                            ? "Your order has been created successfully."
                            : isError
                                ? "Please review details and try again."
                                : "We are finalizing your payment process securely."}
                    </p>
                </div>

                {!isError && (
                    <div className="checkout-steps-list">
                        {steps.map((step, idx) => {
                            const status = getStepStatus(step.id);
                            return (
                                <div key={step.id} className={`checkout-step-item status-${status}`}>
                                    <div className="checkout-step-indicator">
                                        {status === "completed" ? (
                                            <div className="indicator-icon completed">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                            </div>
                                        ) : status === "active" ? (
                                            <div className="indicator-icon active">
                                                <span className="pulse-dot"></span>
                                            </div>
                                        ) : (
                                            <div className="indicator-icon pending">
                                                <span className="pending-dot"></span>
                                            </div>
                                        )}
                                        {idx < steps.length - 1 && (
                                            <div className={`indicator-line status-${status === "completed" ? "completed" : "pending"}`} />
                                        )}
                                    </div>
                                    <div className="checkout-step-content">
                                        <div className="checkout-step-title">{step.title}</div>
                                        <div className="checkout-step-desc">{step.desc}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {isError && (
                    <div className="checkout-error-box py-3 px-4 mb-3 text-center">
                        <p className="error-message-text mb-0">{processingMessage}</p>
                    </div>
                )}

                <div className="checkout-modal-footer text-center mt-4 pt-3 border-top">
                    <span className="text-muted small d-inline-flex align-items-center gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        PCI-DSS Compliant • 256-bit SSL Encryption
                    </span>
                </div>
            </Modal.Body>
        </Modal>
    );
}
