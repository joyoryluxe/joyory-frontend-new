// AddressSections.jsx
import React, { useState } from "react";

const AddressSections = ({
  addresses,
  handleAddressChange,
  handleSaveAddress,
  handleDeleteAddress,
  handleAddNewAddress,
  handleCancelNewAddress,
}) => {
  const [editingIndex, setEditingIndex] = useState(null); // Track which address is being edited
  const [savingIndex, setSavingIndex] = useState(null);

  const toggleEdit = (index) => {
    setEditingIndex(editingIndex === index ? null : index);
  };

  const onAddNewClick = () => {
    const newIndex = addresses.length;
    handleAddNewAddress();
    setEditingIndex(newIndex);
  };

  return (
    <>
      <h4 className="ua-subtitle mt-4 page-title-main-name">Addresses</h4>

      {addresses.map((addr, i) => {
        const isEditing = editingIndex === i || !addr._id;

        return (
          <div key={addr._id || `new-${i}`} className="ua-address-row mb-4">
            <div className="row">
              <div className="col-lg-6 page-title-main-name">
                <input
                  className="fullname page-title-main-name"
                  value={addr.name || ""}
                  placeholder="Full Name"
                  disabled={!isEditing}
                  onChange={(e) => handleAddressChange(i, "name", e.target.value)}
                />
              </div>
              <div className="col-lg-6">
                <input
                  className="addressline page-title-main-name"
                  value={addr.addressLine1 || ""}
                  placeholder="Address Line 1"
                  disabled={!isEditing}
                  onChange={(e) => handleAddressChange(i, "addressLine1", e.target.value)}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-lg-6">
                <input
                  className="city page-title-main-name"
                  value={addr.city || ""}
                  placeholder="City"
                  disabled={!isEditing}
                  onChange={(e) => handleAddressChange(i, "city", e.target.value)}
                />
              </div>
              <div className="col-lg-6">
                <input
                  className="state page-title-main-name"
                  value={addr.state || ""}
                  placeholder="State"
                  disabled={!isEditing}
                  onChange={(e) => handleAddressChange(i, "state", e.target.value)}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-lg-6">
                <input
                  className="pincode page-title-main-name"
                  value={addr.pincode || ""}
                  placeholder="Pincode"
                  disabled={!isEditing}
                  onChange={(e) => handleAddressChange(i, "pincode", e.target.value)}
                />
              </div>
              <div className="col-lg-6">
                <input
                  className="phone page-title-main-name"
                  value={addr.phone || ""}
                  placeholder="Phone Number"
                  disabled={!isEditing}
                  onChange={(e) => handleAddressChange(i, "phone", e.target.value)}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-lg-6">
                <input
                  className="email page-title-main-name"
                  value={addr.email || ""}
                  placeholder="Email ID"
                  disabled={!isEditing}
                  onChange={(e) => handleAddressChange(i, "email", e.target.value)}
                />
              </div>
            </div>

            {/* Action Buttons for each address */}
            <div className="adress-buttons page-title-main-name mt-3">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    className="ua-btn ua-save"
                    disabled={savingIndex === i}
                    onClick={async () => {
                      setSavingIndex(i);
                      try {
                        const saved = await handleSaveAddress(i);
                        if (saved !== false) {
                          setEditingIndex(null); // Exit edit mode after save
                        }
                      } finally {
                        setSavingIndex(null);
                      }
                    }}
                  >
                    {savingIndex === i ? "Saving..." : "Save"}
                  </button>
                  {addr._id && (
                    <button
                      type="button"
                      className="ua-btn delete-button ua-delete ms-2"
                      onClick={async () => {
                        const deleted = await handleDeleteAddress(i);
                        if (deleted !== false) {
                          setEditingIndex(null);
                        }
                      }}
                    >
                      Delete
                    </button>
                  )}
                  <button
                    type="button"
                    className="ua-btn ms-2"
                    onClick={() => {
                      if (!addr._id && handleCancelNewAddress) {
                        handleCancelNewAddress(i);
                      }
                      setEditingIndex(null);
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="ua-btn"
                  onClick={() => toggleEdit(i)}
                >
                  Edit Address
                </button>
              )}
            </div>
          </div>
        );
      })}

      {/* Add New Address Button */}
      <div className="mt-3 add-address-button page-title-main-name">
        <button 
          type="button" 
          className="ua-btn" 
          onClick={onAddNewClick}
        >
          + Add New Address
        </button>
      </div>
    </>
  );
};

export default AddressSections;