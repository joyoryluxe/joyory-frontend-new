import React from 'react';

export default function AddressForm({
    address,
    onChange,
    onSave,
    onCancel,
    isProcessing,
    isEditing,
}) {
    return (
        <div className="form-card">
            <input
                className="form-input page-title-main-name"
                type="text"
                placeholder="Full Name"
                value={address.name}
                onChange={(e) => onChange({ ...address, name: e.target.value })}
            />
            <input
                className="form-input page-title-main-name"
                type="text"
                placeholder="Phone Number"
                value={address.phone}
                onChange={(e) => onChange({ ...address, phone: e.target.value })}
            />
            <input
                className="form-input page-title-main-name"
                type="email"
                placeholder="Email"
                value={address.email}
                onChange={(e) => onChange({ ...address, email: e.target.value })}
            />
            <textarea
                className="form-input page-title-main-name textarea-input"
                placeholder="Address Line"
                value={address.addressLine1}
                onChange={(e) => onChange({ ...address, addressLine1: e.target.value })}
            />
            <input
                className="form-input page-title-main-name"
                type="text"
                placeholder="City"
                value={address.city}
                onChange={(e) => onChange({ ...address, city: e.target.value })}
            />
            <input
                className="form-input page-title-main-name"
                type="text"
                placeholder="State"
                value={address.state}
                onChange={(e) => onChange({ ...address, state: e.target.value })}
            />
            <input
                className="form-input page-title-main-name"
                type="text"
                placeholder="Pincode"
                value={address.pincode}
                onChange={(e) => onChange({ ...address, pincode: e.target.value })}
            />
            <div className="button-group">
                <button
                    className="save-btn page-title-main-name"
                    onClick={onSave}
                    disabled={isProcessing}
                >
                    {isProcessing ? "Saving..." : (isEditing ? "Update" : "Save")}
                </button>
                <button
                    className="cancel-btn page-title-main-name"
                    onClick={onCancel}
                    disabled={isProcessing}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
