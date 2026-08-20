import React from 'react';
import { FaTimes } from 'react-icons/fa';
import Bag from "../../assets/Bag.svg";
import { formatPrice } from "../../utils/productHelpers";

export default function WishlistCard({
    item,
    isRemoving,
    onRemove,
    onMoveToCart,
    onProductClick,
}) {
    const variantText = (item.variantName || item.variant || "").trim().toUpperCase();
    const title = variantText && variantText !== "DEFAULT" ? `${item.name} - ${variantText}` : item.name;

    const discountPercent = item.discountPercent || (
        item.originalPrice && item.displayPrice && item.originalPrice > item.displayPrice
            ? Math.round(((item.originalPrice - item.displayPrice) / item.originalPrice) * 100)
            : 0
    );

    return (
        <div className="col-6 col-md-4 col-lg-3 px-2 mb-3">
            <div className="card h-100 shadow-sm-none border-0 position-relative">
                {/* Remove button */}
                <button
                    className="position-absolute top-0 end-0 m-2 bg-white border-0 rounded-circle p-1 shadow-sm"
                    style={{
                        zIndex: 10,
                        width: "32px",
                        height: "32px",
                        minWidth: "32px",
                        minHeight: "32px",
                        maxWidth: "32px",
                        maxHeight: "32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: isRemoving ? 0.5 : 1,
                        cursor: isRemoving ? "not-allowed" : "pointer"
                    }}
                    onClick={() => onRemove(item.productId, item.sku)}
                    disabled={isRemoving}
                    title="Remove from wishlist"
                >
                    {isRemoving
                        ? <div className="spinner-border spinner-border-sm" role="status" style={{ width: "12px", height: "12px" }} />
                        : <FaTimes size={16} color="#000" />
                    }
                </button>

                {/* Product Image */}
                <div
                    className="position-relative"
                    style={{ cursor: "pointer" }}
                    onClick={() => onProductClick(item)}
                >
                    <img
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        className="card-img-top"
                        style={{ height: "auto", objectFit: "cover", borderRadius: "8px 8px 0 0" }}
                        onError={(e) => (e.target.src = "/placeholder.png")}
                    />
                </div>

                <div className="card-body d-flex flex-column p-3">
                    <div className="product-card-title-wrap">
                        <h6
                            className="foryou-name m-0 p-0 mt-2"
                            style={{ cursor: "pointer" }}
                            onClick={() => onProductClick(item)}
                        >
                            {title}
                        </h6>
                    </div>

                    {/* Price Section */}
                    <div className="price-section mb-3">
                        <div className="d-flex align-items-baseline flex-wrap">
                            <span className="current-price fw-400 fs-5">
                                {formatPrice(item.displayPrice)}
                            </span>

                            {item.originalPrice > item.displayPrice && (
                                <>
                                    <span className="original-price text-muted text-decoration-line-through ms-2 fs-6">
                                        {formatPrice(item.originalPrice)}
                                    </span>
                                    <span className="discount-percent fw-bold ms-2">
                                        ({discountPercent}% OFF)
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {item.nextOrderDiscountMessage && (
                        <div
                            className="next-order-discount-tag"
                            title={item.nextOrderDiscountMessage}
                            onClick={(e) => {
                                e.stopPropagation();
                                window.showDiscountPopup && window.showDiscountPopup(item.nextOrderDiscountMessage, e.currentTarget);
                            }}
                        >
                            <span className="text-truncate">{item.nextOrderDiscountMessage}</span>
                        </div>
                    )}

                    {/* Move to Cart Action */}
                    <div className="mt-md-auto mt-0">
                        <button
                            className="btn w-100 addtocartbuttton d-flex align-items-center justify-content-center gap-2 btn-outline-dark"
                            style={{
                                transition: "background-color .3s ease, color .3s ease",
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onMoveToCart(item);
                            }}
                        >
                            {item.status === "outOfStock" ? "Out of Stock" : "Move to Cart"}
                            <img src={Bag} alt="Bag" style={{ height: 20 }} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
