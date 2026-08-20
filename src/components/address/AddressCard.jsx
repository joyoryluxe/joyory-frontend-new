import React from 'react';
import { FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

export default function AddressCard({
    addr,
    isSelected,
    onSelect,
    onEdit,
    onDelete,
    isProcessing,
}) {
    return (
        <div
            className={`address-card ${isSelected ? 'address-card-selected' : ''}`}
        >
            <div
                className="address-content"
                onClick={() => onSelect(addr._id)}
            >
                <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                    <strong className="address-name">{addr.name}</strong>
                    {isSelected && (
                        <span className="selected-badge">✓ Selected</span>
                    )}
                </div>
                <p className="address-info">
                    {addr.addressLine1}, {addr.city}, {addr.state} - {addr.pincode}
                </p>
                <div className="address-contact" style={{ display: "flex", alignItems: "center", gap: "15px", flexWrap: "wrap" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <FaPhoneAlt style={{ color: "#6b7280" }} /> {addr.phone || "-"}
                    </span>
                    {addr.email && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                            <FaEnvelope style={{ color: "#6b7280" }} /> {addr.email}
                        </span>
                    )}
                </div>
            </div>
            <div style={{ display: "flex", gap: "5px", flexShrink: 0 }}>
                <button
                    className="edit-btn"
                    onClick={() => onEdit(addr)}
                    disabled={isProcessing}
                >
                    {isProcessing ? "..." : "Edit"}
                </button>
                <button
                    className="delete-btn"
                    onClick={() => onDelete(addr._id)}
                    disabled={isProcessing}
                >
                    {isProcessing ? "..." : "Delete"}
                </button>
            </div>
        </div>
    );
}
