import React, { useState } from 'react';

export default function OrderProductsSummaryCard({
    order,
    products = [],
}) {
    const [showPriceDetails, setShowPriceDetails] = useState(false);

    return (
        <div className="order-card">
            <div className="card-head">
                <div className="card-head-left">
                    <span className="card-icon">
                        <i className="bi bi-bag"></i>
                    </span>
                    <h5>Order Summary</h5>
                </div>
                <div className="order-id-text">
                    Order ID: {order?.displayOrderId || order?.orderId}
                    <i className="bi bi-clipboard ms-2"></i>
                </div>
            </div>

            <div className="order-products-list">
                {products.map((product, index) => (
                    <div key={index} className="order-product-row">
                        <div className="product-image-wrap">
                            <img src={product?.image || "/placeholder.png"} alt={product?.name} />
                        </div>

                        <div className="product-info info-success">
                            <h6>{product?.brand || product?.name || "Product"}</h6>
                            <p>{product?.name}</p>
                            <span>Quantity: {product?.quantity || 1}</span>
                        </div>

                        <div className="product-price price-success">
                            ₹{((product?.price || product?.variant?.discountedPrice || 0) || 0).toFixed(2)}
                        </div>
                    </div>
                ))}
            </div>

            {showPriceDetails && (
                <div className="price-details-dropdown">
                    <div className="price-detail-item">
                        <span>Subtotal:</span>
                        <span>₹{(order?.amount?.subtotal || 0).toFixed(2)}</span>
                    </div>
                    <div className="price-detail-item text-danger">
                        <span>Discount:</span>
                        <span>-₹{(order?.amount?.discount || 0).toFixed(2)}</span>
                    </div>
                    {order?.amount?.pointsDiscount > 0 && (
                        <div className="price-detail-item text-danger">
                            <span>Points Discount:</span>
                            <span>-₹{order.amount.pointsDiscount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="price-detail-item">
                        <span>GST:</span>
                        <span>₹{(order?.amount?.gst || 0).toFixed(2)}</span>
                    </div>
                    <div className="price-detail-item">
                        <span>Shipping:</span>
                        <span className="text-success">
                            {(order?.amount?.shipping || 0) === 0
                                ? "Free"
                                : `₹${(order?.amount?.shipping || 0).toFixed(2)}`}
                        </span>
                    </div>
                </div>
            )}

            <div
                className="paid-row"
                onClick={() => setShowPriceDetails(!showPriceDetails)}
                style={{ cursor: "pointer" }}
                title="Click to view payment details"
            >
                <div>
                    <h6 className="d-flex align-items-center">
                        Total Paid
                        <i className={`bi bi-chevron-${showPriceDetails ? "up" : "down"} ms-2`} style={{ fontSize: "0.85rem" }}></i>
                    </h6>
                    <p>Paid via {order?.payment?.method || "Cash on Delivery"}</p>
                </div>
                <div className="paid-amount">
                    ₹{(order?.amount?.grandTotal || 0).toFixed(2)}
                </div>
            </div>
        </div>
    );
}
