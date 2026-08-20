import React from 'react';

export default function OrderSuccessBanner({
    onCancelOrder,
    onContinueShopping,
    isOrderCancelled,
}) {
    return (
        <div className="success-banner">
            <div className="success-banner-content">
                <div>
                    <h2>
                        <span className="success-title-text">Your Order Is Placed Successfully</span>{" "}
                        <span className="success-check">
                            <i className="bi bi-check-lg"></i>
                        </span>
                    </h2>
                    <p>
                        We’ve received your order and it’s now being processed.
                    </p>
                    <div className="success-banner-btns d-flex gap-3 flex-nowrap align-items-center justify-content-center justify-content-md-start">
                        <button
                            className="btn btn-light cancel-mini-btn"
                            onClick={onCancelOrder}
                            disabled={isOrderCancelled}
                        >
                            Cancel Order
                        </button>
                        <button
                            className="btn btn-light continue-shopping-btn"
                            onClick={onContinueShopping}
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
