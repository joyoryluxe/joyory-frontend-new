import React from 'react';

export default function OrderTrustFooter() {
    return (
        <>
            {/* Help section */}
            <div className="order-card help-card">
                <div className="help-grid">
                    <div className="help-item">
                        <i className="bi bi-headset"></i>
                        <div>
                            <h6>Need Help?</h6>
                            <p>We’re here for you</p>
                        </div>
                    </div>
                    <div className="help-item">
                        <i className="bi bi-chat-dots"></i>
                        <div>
                            <h6>Live Chat</h6>
                            <p>Chat with us</p>
                        </div>
                    </div>
                    <div className="help-item">
                        <i className="bi bi-telephone"></i>
                        <div>
                            <h6>Call Us</h6>
                            <p>+91 9601177701</p>
                        </div>
                    </div>
                    <div className="help-item">
                        <i className="bi bi-envelope"></i>
                        <div>
                            <h6>Email Us</h6>
                            <p>hello@joyory.com</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trust strip */}
            <div className="trust-banner">
                <div className="trust-left">
                    <i className="bi bi-shield-check"></i>
                    <div>
                        <h6>Thank you for shopping with Joyory.</h6>
                        <p>We hope you love your order!</p>
                    </div>
                </div>
                <div className="trust-items">
                    <span><i className="bi bi-shield-check me-2"></i> Secure Payments</span>
                    <span><i className="bi bi-people me-2"></i> Genuine Products</span>
                    <span><i className="bi bi-box-seam me-2"></i> Easy Returns</span>
                </div>
            </div>

            {/* Footer reassurance */}
            <div className="reassurance-grid">
                <div>
                    <i className="bi bi-shield-check"></i>
                    <h6>100% Authentic</h6>
                    <p>Sourced from trusted brands</p>
                </div>
                <div>
                    <i className="bi bi-arrow-counterclockwise"></i>
                    <h6>Easy Returns</h6>
                    <p>Hassle-free return policy</p>
                </div>
                <div>
                    <i className="bi bi-credit-card"></i>
                    <h6>Secure Payments</h6>
                    <p>Your payments are safe</p>
                </div>
                <div>
                    <i className="bi bi-headset"></i>
                    <h6>Customer Support</h6>
                    <p>9 AM - 6 PM, Mon - Sat</p>
                </div>
            </div>
        </>
    );
}
