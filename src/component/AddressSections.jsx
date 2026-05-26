// // AddressSection.jsx
// import React from "react";

// const AddressSections= ({
//   addresses,
//   editMode,
//   handleAddressChange,
//   handleSaveAddress,
//   handleDeleteAddress,
//   handleAddNewAddress,
// }) => {
//   return (
//     <>
//       <h4 className="ua-subtitle mt-4 page-title-main-name">Addresses</h4>

//       {addresses.map((addr, i) => (
//         <div key={i} className="ua-address-row">
//           <div className="row">
//             <div className="col-lg-6 page-title-main-name">
//               <input
//                 className="fullname page-title-main-name"
//                 value={addr.name || ""}
//                 placeholder="Full Name"
//                 disabled={!editMode}
//                 onChange={(e) => handleAddressChange(i, "name", e.target.value)}
//               />
//             </div>
//             <div className="col-lg-6">
//               <input
//                 className="addressline page-title-main-name"
//                 value={addr.addressLine1 || ""}
//                 placeholder="Address Line 1"
//                 disabled={!editMode}
//                 onChange={(e) => handleAddressChange(i, "addressLine1", e.target.value)}
//               />
//             </div>
//           </div>

//           <div className="row">
//             <div className="col-lg-6">
//               <input
//                 className="city page-title-main-name"
//                 value={addr.city || ""}
//                 placeholder="City"
//                 disabled={!editMode}
//                 onChange={(e) => handleAddressChange(i, "city", e.target.value)}
//               />
//             </div>
//             <div className="col-lg-6">
//               <input
//                 className="state page-title-main-name"
//                 value={addr.state || ""}
//                 placeholder="State"
//                 disabled={!editMode}
//                 onChange={(e) => handleAddressChange(i, "state", e.target.value)}
//               />
//             </div>
//           </div>

//           <div className="row">
//             <div className="col-lg-6">
//               <input
//                 className="pincode page-title-main-name"
//                 value={addr.pincode || ""}
//                 placeholder="Pincode"
//                 disabled={!editMode}
//                 onChange={(e) => handleAddressChange(i, "pincode", e.target.value)}
//               />
//             </div>
//             <div className="col-lg-6">
//               <input
//                 className="phone page-title-main-name"
//                 value={addr.phone || ""}
//                 placeholder="Phone Number"
//                 disabled={!editMode}
//                 onChange={(e) => handleAddressChange(i, "phone", e.target.value)}
//               />
//             </div>
//           </div>

//           <div className="row">
//             <div className="col-lg-6">
//               <input
//                 className="email page-title-main-name"
//                 value={addr.email || ""}
//                 placeholder="Email ID"
//                 disabled={!editMode}
//                 onChange={(e) => handleAddressChange(i, "email", e.target.value)}
//               />
//             </div>
//           </div>

//           {editMode && (
//             <div className="adress-buttons page-title-main-name">
//               <button
//                 type="button"
//                 className="ua-btn ua-save"
//                 onClick={() => handleSaveAddress(i)}
//               >
//                 Save
//               </button>
//               <button
//                 type="button"
//                 className="ua-btn delete-button ua-delete ms-2"
//                 onClick={() => handleDeleteAddress(i)}
//               >
//                 Delete
//               </button>
//             </div>
//           )}
//         </div>
//       ))}

//       {editMode && (
//         <div className="mt-2 add-address-button page-title-main-name">
//           <button 
//             type="button" 
//             className="ua-btn" 
//             onClick={handleAddNewAddress}
//           >
//             + Add Address
//           </button>
//         </div>
//       )}
//     </>
//   );
// };

// export default AddressSections;















// AddressSections.jsx
import React, { useState } from "react";

const AddressSections = ({
  addresses,
  handleAddressChange,
  handleSaveAddress,
  handleDeleteAddress,
  handleAddNewAddress,
}) => {
  const [editingIndex, setEditingIndex] = useState(null); // Track which address is being edited

  const toggleEdit = (index) => {
    setEditingIndex(editingIndex === index ? null : index);
  };

  return (
    <>
      <h4 className="ua-subtitle mt-4 page-title-main-name">Addresses</h4>

      {addresses.map((addr, i) => {
        const isEditing = editingIndex === i;

        return (
          <div key={i} className="ua-address-row mb-4">
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
                    onClick={() => {
                      handleSaveAddress(i);
                      setEditingIndex(null); // Exit edit mode after save
                    }}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="ua-btn delete-button ua-delete ms-2"
                    onClick={() => handleDeleteAddress(i)}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="ua-btn ms-2"
                    onClick={() => setEditingIndex(null)}
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
          onClick={handleAddNewAddress}
        >
          + Add New Address
        </button>
      </div>
    </>
  );
};

export default AddressSections;