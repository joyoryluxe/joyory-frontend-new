import React from 'react';

export default function PaymentOrderSummary({
    priceDetails = {},
    pointsDiscount = 0,
    gstRate = "0%",
    gstAmount = 0,
}) {
    return (
        <div className="col-lg-7 col-md-12 mt-lg-0 mt-4 order-1 order-lg-2">
            <div className="summary-card">
                {/* Header */}
                <div className="summary-header">
                    <div className="summary-header-left">Order Summary</div>
                    <div className="summary-header-right">Total</div>
                </div>

                {/* Body */}
                <div className="summary-body">
                    <div className="summary-row p-0">
                        <span className="summary-header-left fw-normal">Bag MRP</span>
                        <span className="summary-value">Rs {priceDetails.bagMrp}/-</span>
                    </div>
                    <div className="summary-row p-0">
                        <span className="summary-header-left fw-normal">Bag Discount</span>
                        <span className="summary-value">Rs {priceDetails.bagDiscount}/-</span>
                    </div>
                    <div className="summary-row p-0">
                        <span className="summary-header-left fw-normal">Coupon Discount</span>
                        <span className="summary-value">Rs {priceDetails.couponDiscount}/-</span>
                    </div>
                    {pointsDiscount > 0 && (
                        <div className="summary-row p-0">
                            <span className="summary-header-left fw-normal">Points Discount</span>
                            <span className="summary-value">Rs {pointsDiscount}/-</span>
                        </div>
                    )}

                    <div className="taxable-section p-0">
                        <div className="summary-row p-0">
                            <span className="summary-header-left fw-normal">GST {gstRate}</span>
                            <span className="summary-value">Rs {gstAmount}/-</span>
                        </div>
                        <div className="summary-row p-0">
                            <span className="summary-header-left fw-normal">Shipping</span>
                            <span className="summary-value">Rs {priceDetails.shipping}/-</span>
                        </div>
                    </div>
                </div>

                {/* Footer - Total Payable */}
                <div className="summary-footer">
                    <div className="total-label">Total Payable</div>
                    <div className="total-value">Rs {priceDetails.payable}</div>
                </div>
            </div>

            {/* Savings Message */}
            {priceDetails.savingsMessage && (
                <p className="savings-message">
                    {priceDetails.savingsMessage}
                </p>
            )}
        </div>
    );
}
