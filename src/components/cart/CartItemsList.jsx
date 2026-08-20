import React from 'react';

export default function CartItemsList({
    cart = [],
    freebies = [],
    onQuantityChange,
    onShowConfirm,
    onNavigateToProduct,
}) {
    return (
        <div className="col-xxl-8 col-12">
            <ul className="list-group">
                {cart.map((item) => {
                    const variant = item.selectedVariant || {};
                    return (
                        <li
                            key={item.cartItemId}
                            className="list-group-item d-flex justify-content-between align-items-end border-black"
                        >
                            <div
                                className="d-flex align-items-center gap-2"
                                style={{ cursor: "pointer" }}
                                onClick={() => onNavigateToProduct(item)}
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                    }}
                                />
                                <div className="w-75">
                                    <strong className="page-title-main-name">{item.name}</strong>
                                    {item.brand && (
                                        <div className="text-muted small page-title-main-name">
                                            {item.brand}
                                        </div>
                                    )}
                                    {item.stockStatus !== "in_stock" && (
                                        <div className="small text-danger fw-semibold page-title-main-name">
                                            {item.stockMessage || "Out of stock"}
                                        </div>
                                    )}
                                    <div className="small d-flex align-items-center page-title-main-name">
                                        {variant.originalPrice && variant.originalPrice > item.price ? (
                                            <>
                                                <span className="fw-bold me-1">₹{item.price}</span>
                                                <span className="text-muted text-decoration-line-through">
                                                    ₹{variant.originalPrice}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="fw-400 page-title-main-name">₹{item.price}</span>
                                        )}
                                        <div className="ms-2">
                                            {item.discounts?.length > 0 && (
                                                <ul
                                                    className="mt-1 small text-success p-0 m-0 page-title-main-name"
                                                    type="none"
                                                >
                                                    {item.discounts.map((d) => (
                                                        <li
                                                            key={`${item.cartItemId}-${d.type}-${d.note}`}
                                                            className="backgound-colors-discount page-title-main-name"
                                                        >
                                                            <i className="bi bi-tag page-title-main-name"></i>&nbsp;
                                                            {d.note || `${d.type} - ₹${d.amount} off`}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="d-flex align-items-center gap-2 page-title-main-name justify-content-between"
                                style={{ margin: "5px 0" }}
                            >
                                <div className="border-for-minu-plush">
                                    <button
                                        className="btn btn-sm btn-outline-secondary page-title-main-name"
                                        style={{ border: "none", background: "#FFF", boxShadow: "none" }}
                                        onClick={() => onQuantityChange(item.cartItemId, item.quantity - 1)}
                                        disabled={item.stockStatus === "out_of_stock"}
                                    >
                                        −
                                    </button>
                                    <span
                                        className={`px-2 ${item.stockStatus === "out_of_stock" ? "text-muted text-decoration-line-through" : ""} page-title-main-name`}
                                    >
                                        {item.quantity}
                                    </span>
                                    <button
                                        className="btn btn-sm btn-outline-secondary page-title-main-name"
                                        style={{ border: "none", background: "#FFF", boxShadow: "none" }}
                                        onClick={() => onQuantityChange(item.cartItemId, item.quantity + 1)}
                                        disabled={item.stockStatus === "out_of_stock"}
                                    >
                                        +
                                    </button>
                                </div>
                                <span
                                    className={`fw-bold page-title-main-name ${item.stockStatus === "out_of_stock" ? "text-muted" : ""}`}
                                >
                                    ₹{item.subTotal.toFixed(2)}
                                </span>
                                <button
                                    onClick={() => onShowConfirm(item)}
                                    className="btn btn-outline-danger"
                                    title="Remove item from cart"
                                >
                                    <i className="bi bi-trash3"></i>
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>

            {/* Free Gifts */}
            {freebies?.length > 0 && (
                <div className="mt-4">
                    <h5 className="ms-3 page-title-main-name">Free Gifts 🎁</h5>
                    <ul className="list-group">
                        {freebies.map((freebie, idx) => {
                            const fv = freebie.variant || {};
                            const img = fv.images?.[0] || fv.image || "/placeholder.png";
                            return (
                                <li key={idx} className="list-group-item d-flex align-items-center gap-3">
                                    <img
                                        src={img}
                                        alt={freebie.name}
                                        style={{
                                            width: "80px",
                                            height: "80px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                        }}
                                    />
                                    <div>
                                        <strong className="page-title-main-name">{freebie.name}</strong>
                                        {freebie.qty > 1 && (
                                            <div className="small page-title-main-name">
                                                Quantity: {freebie.qty}
                                            </div>
                                        )}
                                        <div className="text-success fw-bold page-title-main-name">FREE</div>
                                        {freebie.message && (
                                            <div className="small text-muted page-title-main-name">
                                                {freebie.message}
                                            </div>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}
