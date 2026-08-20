import React from 'react';
import { FaTimes, FaHeart, FaRegHeart } from 'react-icons/fa';

export default function VtoShadePopup({
    activeProduct,
    activeShadeObj,
    getShadeThumbnail,
    onRemoveShade,
    isInWishlist,
    onToggleWishlist,
    onAddToCart,
    addingToCart,
}) {
    if (!activeShadeObj || !activeProduct) return null;

    const shadeSku = activeShadeObj.sku || activeShadeObj.variantSku || activeShadeObj._id;
    const inWishlist = isInWishlist(activeProduct._id, shadeSku);

    return (
        <div className="vto-shade-popup">
            <div className="vto-shade-popup-left">
                <img
                    className="vto-shade-popup-thumb"
                    src={getShadeThumbnail ? getShadeThumbnail() : (activeShadeObj.image || activeProduct.image || "/placeholder.png")}
                    alt={activeShadeObj.shadeName || activeProduct.name}
                />
            </div>
            <div className="vto-shade-popup-middle">
                <div className="vto-shade-popup-product-name">{activeProduct.name}</div>
                <div className="vto-shade-popup-shade-name">{activeShadeObj.shadeName}</div>
                <div className="vto-shade-popup-price">
                    ₹{activeShadeObj.displayPrice || activeShadeObj.price || activeProduct.price}
                </div>
            </div>
            <div className="vto-shade-popup-actions">
                <button
                    className="vto-shade-popup-btn vto-shade-popup-btn-clear"
                    onClick={onRemoveShade}
                    title="Remove Shade"
                >
                    <FaTimes />
                </button>
                <button
                    className={`vto-shade-popup-btn vto-shade-popup-btn-wishlist ${inWishlist ? 'active' : ''}`}
                    onClick={() => onToggleWishlist(activeProduct, activeShadeObj)}
                    title="Wishlist"
                >
                    {inWishlist ? <FaHeart /> : <FaRegHeart />}
                </button>
                <button
                    className="vto-shade-popup-btn-buy"
                    onClick={onAddToCart}
                    disabled={addingToCart}
                >
                    {addingToCart ? 'Adding...' : 'Add to Bag'}
                </button>
            </div>
        </div>
    );
}
