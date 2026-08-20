import React from 'react';
import { FaInfoCircle, FaShippingFast } from 'react-icons/fa';

export default function ShipmentPriceBreakdown({
    priceDetails = {},
    shipmentData = {},
    formatCurrency,
}) {
    return (
        <div className="col-lg-4">
            {/* Price Summary Card */}
            <div className="od-card">
                <h5 className="od-card-title">
                    <FaInfoCircle className="me-2" /> Price Summary
                </h5>

                <div className="price-rows-wrap mt-3">
                    <div className="price-row-item">
                        <span>Total MRP</span>
                        <span>₹{formatCurrency(priceDetails.totalMRP)}</span>
                    </div>

                    {Number(priceDetails.totalDiscount) > 0 && (
                        <div className="price-row-item">
                            <span>Total Discount</span>
                            <span className="text-success">-₹{formatCurrency(priceDetails.totalDiscount)}</span>
                        </div>
                    )}

                    <div className="price-row-item">
                        <span>Subtotal</span>
                        <span>
                            ₹
                            {formatCurrency(
                                priceDetails.breakdown?.sellingPrice ||
                                priceDetails.shipmentTotal - priceDetails.otherCharges
                            )}
                        </span>
                    </div>

                    {/* Shipping Charge */}
                    {priceDetails.breakdown?.shippingCharge !== undefined &&
                        Number(priceDetails.breakdown?.shippingCharge) >= 0 && (
                            <div className="price-row-item">
                                <span>Shipping</span>
                                {priceDetails.isFreeShipping ||
                                    Number(priceDetails.breakdown?.shippingCharge) === 0 ? (
                                    <span className="text-success fw-bold">FREE</span>
                                ) : (
                                    <span className="text-info">
                                        +₹{formatCurrency(priceDetails.breakdown.shippingCharge)}
                                    </span>
                                )}
                            </div>
                        )}

                    {Number(priceDetails.breakdown?.gst) > 0 && (
                        <div className="price-row-item">
                            <span>GST</span>
                            <span>+₹{formatCurrency(priceDetails.breakdown.gst)}</span>
                        </div>
                    )}

                    {Number(priceDetails.breakdown?.couponDiscount) > 0 && (
                        <div className="price-row-item">
                            <span>Coupon Discount</span>
                            <span className="text-success">
                                -₹{formatCurrency(priceDetails.breakdown.couponDiscount)}
                            </span>
                        </div>
                    )}

                    {Number(priceDetails.breakdown?.pointsDiscount) > 0 && (
                        <div className="price-row-item">
                            <span>Points Discount</span>
                            <span className="text-success">
                                -₹{formatCurrency(priceDetails.breakdown.pointsDiscount)}
                            </span>
                        </div>
                    )}

                    {Number(priceDetails.breakdown?.giftCardDiscount) > 0 && (
                        <div className="price-row-item">
                            <span>Gift Card Discount</span>
                            <span className="text-success">
                                -₹{formatCurrency(priceDetails.breakdown.giftCardDiscount)}
                            </span>
                        </div>
                    )}

                    <div className="price-row-item total-row">
                        <span>Shipment Total</span>
                        <span>₹{formatCurrency(priceDetails.shipmentTotal)}</span>
                    </div>

                    {priceDetails.totalShipments > 1 && (
                        <div className="price-row-item text-muted small mt-2">
                            <span>Order Total ({priceDetails.totalShipments} shipments)</span>
                            <span>₹{formatCurrency(priceDetails.orderTotal)}</span>
                        </div>
                    )}

                    {Number(priceDetails.youSaved) > 0 && (
                        <div className="savings-highlight">
                            🎉 You saved ₹{formatCurrency(priceDetails.youSaved)} on this order!
                        </div>
                    )}

                    <div className="border-top pt-3 mt-4 small text-muted">
                        <div className="d-flex justify-content-between mb-2">
                            <span>Payment Mode:</span>
                            <strong className="text-dark">
                                {priceDetails.paymentMode || shipmentData.paymentMethod || "N/A"}
                            </strong>
                        </div>
                        <div className="d-flex justify-content-between">
                            <span>Order Type:</span>
                            <span className="text-dark">{shipmentData.orderType || "N/A"}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shipping Address Card */}
            <div className="od-card">
                <h5 className="od-card-title">
                    <FaShippingFast className="me-2" /> Shipping Address
                </h5>

                <div className="address-details mt-3">
                    <div className="contact-detail-row">
                        <div className="contact-text">
                            <strong className="text-dark d-block mb-1">
                                {shipmentData.shippingAddress?.name || "N/A"}
                            </strong>
                            <div>{shipmentData.shippingAddress?.addressLine1 || "N/A"}</div>
                            {shipmentData.shippingAddress?.addressLine2 && (
                                <div>{shipmentData.shippingAddress.addressLine2}</div>
                            )}
                            <div>
                                {shipmentData.shippingAddress?.city},{" "}
                                {shipmentData.shippingAddress?.state} -{" "}
                                {shipmentData.shippingAddress?.pincode}
                            </div>
                        </div>
                    </div>

                    <div className="border-top pt-3 mt-3">
                        <div className="contact-detail-row">
                            <i className="bi bi-telephone me-2"></i>
                            <span className="contact-text">
                                Phone: <strong>{shipmentData.shippingAddress?.phone || "N/A"}</strong>
                            </span>
                        </div>
                        {shipmentData.shippingAddress?.email && (
                            <div className="contact-detail-row mt-2">
                                <i className="bi bi-envelope me-2"></i>
                                <span className="contact-text">
                                    Email: <strong>{shipmentData.shippingAddress?.email || "N/A"}</strong>
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
