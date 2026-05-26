// // src/pages/AddressSelection.jsx
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const PROFILE_API = "https://beauty.joyory.com/api/user/profile";
// const CART_API = "https://beauty.joyory.com/api/user/cart/summary";

// const AddressSelection = () => {
//   const navigate = useNavigate();

//   const [profile, setProfile] = useState({});
//   const [addresses, setAddresses] = useState([]);
//   const [selectedAddressId, setSelectedAddressId] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [editingAddressId, setEditingAddressId] = useState(null);
//   const [newAddress, setNewAddress] = useState({
//     name: "",
//     phone: "",
//     email: "",
//     addressLine1: "",
//     city: "",
//     state: "",
//     pincode: "",
//   });

//   const [cartData, setCartData] = useState([]);
//   const [priceDetails, setPriceDetails] = useState({
//     bagMrp: 0,
//     bagDiscount: 0,
//     autoDiscount: 0,
//     couponDiscount: 0,
//     shipping: 0,
//     payable: 0,
//     savingsMessage: "",
//   });

//   useEffect(() => {
//     loadProfileAndAddresses();
//     loadCart();
//   }, []);

//   const loadProfileAndAddresses = async () => {
//     try {
//       const res = await fetch(PROFILE_API, { credentials: "include" });
//       if (!res.ok) throw new Error("Failed to fetch profile");
//       const data = await res.json();

//       const prof = data.profile || {};
//       setProfile(prof);

//       // Prefill newAddress defaults
//       setNewAddress({
//         name: prof.name || "",
//         phone: prof.phone || "",
//         email: prof.email || "",
//         addressLine1: "",
//         city: "",
//         state: "",
//         pincode: "",
//       });

//       const addressesWithProfile = (data.addresses || []).map((addr) => ({
//         ...addr,
//         name: addr.name || prof.name || "",
//         phone: addr.phone || prof.phone || "",
//         email: addr.email || prof.email || "",
//       }));

//       setAddresses(addressesWithProfile);
//     } catch (err) {
//       console.error(err.message);
//       alert("Failed to load profile and addresses");
//     }
//   };

//   const loadCart = async () => {
//     try {
//       const res = await fetch(CART_API, { credentials: "include" });
//       if (!res.ok) throw new Error("Failed to fetch cart");
//       const data = await res.json();

//       setCartData(data.cart || data.items || []);
//       // setPriceDetails({
//       //   bagMrp: data.bagMrp || data.priceDetails?.bagMrp || 0,
//       //   bagDiscount: data.bagDiscount || data.priceDetails?.bagDiscount || 0,
//       //   autoDiscount: data.autoDiscount || data.priceDetails?.autoDiscount || 0,
//       //   couponDiscount: data.couponDiscount || data.priceDetails?.couponDiscount || 0,
//       //   // shipping: data.shipping ?? data.priceDetails?.shipping ?? 0,
//       //   shipping: data.shippingCharge ?? data.priceDetails?.shippingCharge ?? 0,
//       //   payable: data.payable || data.priceDetails?.payable || 0,
//       //   savingsMessage: data.savingsMessage || data.priceDetails?.savingsMessage || "",
//       // });

//       setPriceDetails({
//         bagMrp: data.bagMrp || data.priceDetails?.bagMrp || 0,
//         bagDiscount: data.bagDiscount || data.priceDetails?.bagDiscount || 0,
//         autoDiscount: data.autoDiscount || data.priceDetails?.autoDiscount || 0,
//         couponDiscount: data.couponDiscount || data.priceDetails?.couponDiscount || 0,
//         shipping: data.shippingCharge ?? data.priceDetails?.shippingCharge ?? 0,
//         payable: data.payable || data.priceDetails?.payable || 0,
//         savingsMessage: data.savingsMessage || data.priceDetails?.savingsMessage || "",
//         shippingMessage: data.shippingMessage || data.priceDetails?.shippingMessage || "",
//       });
//     } catch (err) {
//       console.error(err.message);
//       alert("Failed to load cart data");
//     }
//   };


//   // const saveAddress = async () => {
//   //   const { name, phone, email, addressLine1, city, state, pincode } = newAddress;

//   //   // 🧾 Basic validations
//   //   if (!name || !phone || !email || !addressLine1 || !city || !state || !pincode) {
//   //     return alert("Please fill all required fields");
//   //   }
//   //   if (!/^\d{10}$/.test(phone)) return alert("Phone number must be 10 digits");
//   //   if (!/^\S+@\S+\.\S+$/.test(email)) return alert("Please enter a valid email");
//   //   if (!/^\d{6}$/.test(pincode)) return alert("Please enter a valid 6-digit pincode");

//   //   console.log("📤 Sending to backend:", newAddress);

//   //   try {
//   //     let res;
//   //     if (editingAddressId) {
//   //       // Update existing address
//   //       res = await fetch(`${PROFILE_API}/address/${editingAddressId}`, {
//   //         method: "PATCH",
//   //         headers: { "Content-Type": "application/json" },
//   //         credentials: "include",
//   //         body: JSON.stringify(newAddress),
//   //       });
//   //     } else {
//   //       // Add new address
//   //       res = await fetch(`${PROFILE_API}/address`, {
//   //         method: "POST",
//   //         headers: { "Content-Type": "application/json" },
//   //         credentials: "include",
//   //         body: JSON.stringify(newAddress),
//   //       });
//   //     }

//   //     // 🧩 Handle pincode / validation response
//   //     const data = await res.json();
//   //     console.log("📥 Response:", data);

//   //     if (!res.ok) {
//   //       // ✅ Show backend validation message clearly
//   //       if (data.message && data.message.includes("🚫 Delivery not available")) {
//   //         return alert(data.message);
//   //       }
//   //       throw new Error(data.message || "Failed to save address");
//   //     }

//   //     // ✅ Successfully saved or updated
//   //     await loadProfileAndAddresses();

//   //     // ✅ Reset form
//   //     setEditingAddressId(null);
//   //     setShowForm(false);
//   //     setNewAddress({
//   //       name: profile.name || "",
//   //       phone: profile.phone || "",
//   //       email: profile.email || "",
//   //       addressLine1: "",
//   //       city: "",
//   //       state: "",
//   //       pincode: "",
//   //     });
//   //   } catch (err) {
//   //     console.error(err.message);
//   //     alert(err.message || "Failed to save address");
//   //   }
//   // };


//   const saveAddress = async () => {
//     const { name, phone, email, addressLine1, city, state, pincode } = newAddress;

//     // 🧾 Basic validations
//     if (!name || !phone || !email || !addressLine1 || !city || !state || !pincode) {
//       return alert("Please fill all required fields");
//     }
//     if (!/^\d{10}$/.test(phone)) return alert("Phone number must be 10 digits");
//     if (!/^\S+@\S+\.\S+$/.test(email)) return alert("Please enter a valid email");
//     if (!/^\d{6}$/.test(pincode)) return alert("Please enter a valid 6-digit pincode");

//     // 🚫 Check for duplicate address
//     const isDuplicate = addresses.some((addr) => {
//       if (editingAddressId && addr._id === editingAddressId) return false;
//       return (
//         addr.addressLine1.trim().toLowerCase() === addressLine1.trim().toLowerCase() &&
//         addr.city.trim().toLowerCase() === city.trim().toLowerCase() &&
//         addr.state.trim().toLowerCase() === state.trim().toLowerCase() &&
//         String(addr.pincode).trim() === String(pincode).trim()
//       );
//     });

//     if (isDuplicate) {
//       return alert("This address already exists. Please use or edit the existing one.");
//     }

//     console.log("📤 Sending to backend:", newAddress);

//     try {
//       let res;
//       if (editingAddressId) {
//         // Update existing address
//         res = await fetch(`${PROFILE_API}/address/${editingAddressId}`, {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify(newAddress),
//         });
//       } else {
//         // Add new address
//         res = await fetch(`${PROFILE_API}/address`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify(newAddress),
//         });
//       }

//       const data = await res.json();
//       console.log("📥 Response:", data);

//       // 🚫 Handle backend message for invalid pincode or other issues
//       if (!res.ok) {
//         if (data.message) {
//           // ✅ Show backend message (like delivery not available)
//           alert(data.message);
//           return;
//         }
//         throw new Error("Failed to save address");
//       }

//       // ✅ Successfully saved or updated
//       await loadProfileAndAddresses();

//       // ✅ Reset form
//       setEditingAddressId(null);
//       setShowForm(false);
//       setNewAddress({
//         name: profile.name || "",
//         phone: profile.phone || "",
//         email: profile.email || "",
//         addressLine1: "",
//         city: "",
//         state: "",
//         pincode: "",
//       });

//     } catch (err) {
//       console.error("❌ Error saving address:", err);
//       alert(err.message || "Failed to save address");
//     }
//   };


//   const editAddress = (addr) => {
//     setEditingAddressId(addr._id);
//     setNewAddress({
//       name: addr.name || "",
//       phone: addr.phone || "",
//       email: addr.email || "",
//       addressLine1: addr.addressLine1 || "",
//       city: addr.city || "",
//       state: addr.state || "",
//       pincode: addr.pincode || "",
//     });
//     setShowForm(true);
//   };

//   const deleteAddressHandler = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this address?")) return;
//     try {
//       const res = await fetch(`${PROFILE_API}/address/${id}`, {
//         method: "DELETE",
//         credentials: "include",
//       });
//       if (!res.ok) throw new Error("Failed to delete address");
//       const data = await res.json();
//       console.log("📥 DELETE Response:", data);
//       await loadProfileAndAddresses();
//       if (selectedAddressId === id) setSelectedAddressId(null);
//     } catch (err) {
//       console.error(err.message);
//       alert("Failed to delete address");
//     }
//   };


//   const proceedToPayment = async () => {
//     if (!selectedAddressId) return alert("Please select an address first!");
//     const selectedAddress = addresses.find((a) => a._id === selectedAddressId);

//     try {
//       const initiateRes = await fetch(
//         "https://beauty.joyory.com/api/user/cart/order/initiate",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({
//             discountCode: null,
//             pointsToUse: 0,
//             giftCardCode: null,
//             giftCardPin: null,
//             giftCardAmount: 0,
//           }),
//         }
//       );

//       const initiateData = await initiateRes.json();
//       console.log("🧾 initiateData from backend:", initiateData);

//       // 🧩 Safely extract orderId
//       const orderId =
//         initiateData.orderId ||
//         initiateData.order_id ||
//         initiateData.data?.orderId ||
//         initiateData.data?.id ||
//         initiateData.order?._id ||
//         null;

//       if (!initiateRes.ok || !orderId) {
//         return alert(initiateData.message || "Failed to initiate order");
//       }

//       console.log("✅ Using orderId:", orderId);

//       // ✅ Add orderType here for PaymentProcess.jsx
//       navigate("/PaymentProcess", {
//         state: {
//           orderId,
//           selectedAddress,
//           cartItems: cartData,
//           priceDetails,

//         },
//       });
//     } catch (error) {
//       console.error("Order initiation failed:", error);
//       alert("Could not start payment process.");
//     }
//   };



//   return (
//     <div style={pageWrapper} className="container">
//       {/* Stepper */}
//       <div style={stepperWrapper}>
//         <div style={{ ...stepStyle, background: "#1976d2", color: "#fff" }}>Sign up</div>
//         <div style={divider}></div>
//         <div style={stepStyle}>Address</div>
//         <div style={divider}></div>
//         <div style={stepStyle}>Payment</div>
//       </div>

//       <div style={mainContent}>
//         {/* Left Column */}
//         <div style={leftColumn}>
//           <h3 style={{ marginBottom: "15px" }}>Select Delivery Address</h3>

//           {!showForm ? (
//             <div
//               style={addCard}
//               onClick={() => {
//                 setNewAddress({
//                   name: profile.name || "",
//                   phone: profile.phone || "",
//                   email: profile.email || "",
//                   addressLine1: "",
//                   city: "",
//                   state: "",
//                   pincode: "",
//                 });
//                 setShowForm(true);
//               }}
//             >
//               <span style={{ fontSize: "28px", fontWeight: "500" }}>+</span>
//               <p style={{ margin: "10px 0 0", color: "#555" }}>Add New Address</p>
//             </div>
//           ) : (
//             <div style={formCard}>
//               <input style={input} type="text" placeholder="Full Name" value={newAddress.name} onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })} />
//               <input style={input} type="text" placeholder="Phone Number" value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} />
//               <input style={input} type="email" placeholder="Email" value={newAddress.email} onChange={(e) => setNewAddress({ ...newAddress, email: e.target.value })} />
//               <textarea style={{ ...input, height: "60px" }} placeholder="Address Line" value={newAddress.addressLine1} onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })} />
//               <input style={input} type="text" placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
//               <input style={input} type="text" placeholder="State" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
//               <input style={input} type="text" placeholder="Pincode" value={newAddress.pincode} onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} />
//               <div style={{ display: "flex", gap: "10px" }}>
//                 <button style={saveBtn} onClick={saveAddress}>{editingAddressId ? "Update" : "Save"}</button>
//                 <button style={cancelBtn} onClick={() => { setShowForm(false); setEditingAddressId(null); }}>Cancel</button>
//               </div>
//             </div>
//           )}

//           {addresses.map((addr) => (
//             <div key={addr._id} style={{ ...addressCard, border: selectedAddressId === addr._id ? "2px solid #1976d2" : "1px solid #ddd" }}>
//               <div onClick={() => setSelectedAddressId(addr._id)} style={{ cursor: "pointer" }}>
//                 <strong>{addr.name}</strong>, {addr.addressLine1}, {addr.city}, {addr.state} - {addr.pincode}
//                 <br />
//                 Phone: {addr.phone || "-"}, Email: {addr.email || "-"}
//               </div>
//               <div style={{ display: "flex", gap: "5px" }}>
//                 <button style={editBtn} onClick={() => editAddress(addr)}>Edit</button>
//                 <button style={deleteBtn} onClick={() => deleteAddressHandler(addr._id)}>Delete</button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Right Column */}
//         <div style={rightColumn}>
//           <h4 style={{ marginBottom: "15px" }}>Summary ({cartData.length} items)</h4>
//           <div style={priceRow}><span>Bag MRP:</span><span>₹{priceDetails.bagMrp}</span></div>
//           <div style={priceRow}><span>Bag Discount:</span><span style={{ color: "green" }}>-₹{priceDetails.bagDiscount}</span></div>
//           <div style={priceRow}><span>Auto Discount:</span><span style={{ color: "green" }}>-₹{priceDetails.autoDiscount}</span></div>
//           <div style={priceRow}><span>Coupon Discount:</span><span style={{ color: "green" }}>-₹{priceDetails.couponDiscount}</span></div>
//           {/* <div style={priceRow}><span>Shipping:</span><span>{priceDetails.shipping === 0 ? <span style={{ color: "green" }}>₹0</span> : `₹${priceDetails.shipping}`}</span></div> */}
//           <div style={priceRow}>
//             <span>Shipping:</span>
//             <span>
//               {priceDetails.shipping === 0 ? (
//                 <span style={{ color: "green" }}>Free Shipping</span>
//               ) : (
//                 <>
//                   ₹{priceDetails.shipping}
//                   {priceDetails.shippingMessage && (
//                     <span style={{ color: "#1976d2", fontSize: 12, marginLeft: 6 }}>
//                       {priceDetails.shippingMessage}
//                     </span>
//                   )}
//                 </>
//               )}
//             </span>
//           </div>
//           <hr style={{ margin: "12px 0" }} />
//           <div style={{ ...priceRow, fontWeight: "600" }}><span>Final Payable:</span><span>₹{priceDetails.payable}</span></div>
//           {priceDetails.savingsMessage && <div style={discountMsg}>{priceDetails.savingsMessage}</div>}
//           <button style={payBtn} onClick={proceedToPayment}>Proceed to Payment ₹{priceDetails.payable}</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* --- Styles --- */
// const pageWrapper = { fontFamily: "'Poppins', sans-serif", padding: "30px" };
// const stepperWrapper = { display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "30px" };
// const stepStyle = { padding: "10px 20px", borderRadius: "20px", border: "1px solid #ccc", background: "#f5f5f5", fontSize: "14px", fontWeight: "500" };
// const divider = { width: "50px", height: "2px", background: "#ccc" };
// const mainContent = { display: "grid", gridTemplateColumns: "2fr 1fr", gap: "40px" };
// const leftColumn = { background: "#fff" };
// const addCard = { border: "2px dashed #90caf9", background: "#e3f2fd", borderRadius: "8px", padding: "40px", textAlign: "center", cursor: "pointer", marginBottom: "20px" };
// const formCard = { border: "1px solid #ddd", background: "#fafafa", borderRadius: "8px", padding: "20px", marginBottom: "20px" };
// const input = { width: "100%", padding: "10px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "5px" };
// const saveBtn = { flex: 1, padding: "10px", background: "#1976d2", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" };
// const cancelBtn = { flex: 1, padding: "10px", background: "#ccc", color: "#000", border: "none", borderRadius: "5px", cursor: "pointer" };
// const addressCard = { padding: "15px", borderRadius: "8px", background: "#fff", marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" };
// const editBtn = { padding: "5px 10px", background: "#ffa000", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" };
// const deleteBtn = { padding: "5px 10px", background: "#e53935", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" };
// const rightColumn = { background: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" };
// const priceRow = { display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" };
// const discountMsg = { background: "#e8f5e9", color: "#388e3c", padding: "10px", borderRadius: "6px", marginTop: "15px", fontSize: "13px", textAlign: "center" };
// const payBtn = { marginTop: "20px", width: "100%", padding: "14px", background: "#1976d2", color: "#fff", border: "none", borderRadius: "6px", fontSize: "16px", fontWeight: "600", cursor: "pointer" };

// export default AddressSelection;
































// // src/pages/AddressSelection.jsx
// import React, { useEffect, useState  } from "react";
// import { useNavigate , useLocation } from "react-router-dom";

// const PROFILE_API = "https://beauty.joyory.com/api/user/profile";
// const CART_API = "https://beauty.joyory.com/api/user/cart/summary";

// const AddressSelection = () => {
//   const navigate = useNavigate();
//   const location = useLocation(); // ✅ to get CartPage state

//   const [profile, setProfile] = useState({});
//   const [addresses, setAddresses] = useState([]);
//   const [selectedAddressId, setSelectedAddressId] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [editingAddressId, setEditingAddressId] = useState(null);
//   const [newAddress, setNewAddress] = useState({
//     name: "",
//     phone: "",
//     email: "",
//     addressLine1: "",
//     city: "",
//     state: "",
//     pincode: "",
//   });


//   const [cartData, setCartData] = useState([]);
//   const [priceDetails, setPriceDetails] = useState({
//     bagMrp: 0,
//     bagDiscount: 0,
//     autoDiscount: 0,
//     couponDiscount: 0,
//     shipping: 0,
//     payable: 0,
//     savingsMessage: "",
//   });

//   useEffect(() => {
//     if (location.state?.priceDetails) {
//       setPriceDetails(location.state.priceDetails);
//       setCartData(location.state.cartItems || []);
//       console.log("🟢 Loaded price details from CartPage:", location.state.priceDetails);
//     } else {
//       loadCart(); // fallback to API
//     }

//     loadProfileAndAddresses();
//   }, []);

//   const loadProfileAndAddresses = async () => {
//     try {
//       const res = await fetch(PROFILE_API, { credentials: "include" });
//       if (!res.ok) throw new Error("Failed to fetch profile");
//       const data = await res.json();

//       const prof = data.profile || {};
//       setProfile(prof);

//       // Prefill newAddress defaults
//       setNewAddress({
//         name: prof.name || "",
//         phone: prof.phone || "",
//         email: prof.email || "",
//         addressLine1: "",
//         city: "",
//         state: "",
//         pincode: "",
//       });

//       const addressesWithProfile = (data.addresses || []).map((addr) => ({
//         ...addr,
//         name: addr.name || prof.name || "",
//         phone: addr.phone || prof.phone || "",
//         email: addr.email || prof.email || "",
//       }));

//       setAddresses(addressesWithProfile);
//     } catch (err) {
//       console.error(err.message);
//       alert("Failed to load profile and addresses");
//     }
//   };

//   const loadCart = async () => {
//     try {
//       const res = await fetch(CART_API, { credentials: "include" });
//       if (!res.ok) throw new Error("Failed to fetch cart");
//       const data = await res.json();

//       setCartData(data.cart || data.items || []);

//       setPriceDetails({
//         bagMrp: data.bagMrp || data.priceDetails?.bagMrp || 0,
//         bagDiscount: data.bagDiscount || data.priceDetails?.bagDiscount || 0,
//         autoDiscount: data.autoDiscount || data.priceDetails?.autoDiscount || 0,
//         couponDiscount: data.couponDiscount || data.priceDetails?.couponDiscount || 0,
//         shipping: data.shippingCharge ?? data.priceDetails?.shippingCharge ?? 0,
//         payable: data.payable || data.priceDetails?.payable || 0,
//         savingsMessage: data.savingsMessage || data.priceDetails?.savingsMessage || "",
//         shippingMessage: data.shippingMessage || data.priceDetails?.shippingMessage || "",
//       });
//     } catch (err) {
//       console.error(err.message);
//       alert("Failed to load cart data");
//     }
//   };


//   const saveAddress = async () => {
//     const { name, phone, email, addressLine1, city, state, pincode } = newAddress;

//     // 🧾 Basic validations
//     if (!name || !phone || !email || !addressLine1 || !city || !state || !pincode) {
//       return alert("Please fill all required fields");
//     }
//     if (!/^\d{10}$/.test(phone)) return alert("Phone number must be 10 digits");
//     if (!/^\S+@\S+\.\S+$/.test(email)) return alert("Please enter a valid email");
//     if (!/^\d{6}$/.test(pincode)) return alert("Please enter a valid 6-digit pincode");

//     // 🚫 Check for duplicate address
//     const isDuplicate = addresses.some((addr) => {
//       if (editingAddressId && addr._id === editingAddressId) return false;
//       return (
//         addr.addressLine1.trim().toLowerCase() === addressLine1.trim().toLowerCase() &&
//         addr.city.trim().toLowerCase() === city.trim().toLowerCase() &&
//         addr.state.trim().toLowerCase() === state.trim().toLowerCase() &&
//         String(addr.pincode).trim() === String(pincode).trim()
//       );
//     });

//     if (isDuplicate) {
//       return alert("This address already exists. Please use or edit the existing one.");
//     }

//     console.log("📤 Sending to backend:", newAddress);

//     try {
//       let res;
//       if (editingAddressId) {
//         // Update existing address
//         res = await fetch(`${PROFILE_API}/address/${editingAddressId}`, {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify(newAddress),
//         });
//       } else {
//         // Add new address
//         res = await fetch(`${PROFILE_API}/address`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify(newAddress),
//         });
//       }

//       const data = await res.json();
//       console.log("📥 Response:", data);

//       // 🚫 Handle backend message for invalid pincode or other issues
//       if (!res.ok) {
//         if (data.message) {
//           // ✅ Show backend message (like delivery not available)
//           alert(data.message);
//           return;
//         }
//         throw new Error("Failed to save address");
//       }

//       // ✅ Successfully saved or updated
//       await loadProfileAndAddresses();

//       // ✅ Reset form
//       setEditingAddressId(null);
//       setShowForm(false);
//       setNewAddress({
//         name: profile.name || "",
//         phone: profile.phone || "",
//         email: profile.email || "",
//         addressLine1: "",
//         city: "",
//         state: "",
//         pincode: "",
//       });

//     } catch (err) {
//       console.error("❌ Error saving address:", err);
//       alert(err.message || "Failed to save address");
//     }
//   };


//   const editAddress = (addr) => {
//     setEditingAddressId(addr._id);
//     setNewAddress({
//       name: addr.name || "",
//       phone: addr.phone || "",
//       email: addr.email || "",
//       addressLine1: addr.addressLine1 || "",
//       city: addr.city || "",
//       state: addr.state || "",
//       pincode: addr.pincode || "",
//     });
//     setShowForm(true);
//   };

//   const deleteAddressHandler = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this address?")) return;
//     try {
//       const res = await fetch(`${PROFILE_API}/address/${id}`, {
//         method: "DELETE",
//         credentials: "include",
//       });
//       if (!res.ok) throw new Error("Failed to delete address");
//       const data = await res.json();
//       console.log("📥 DELETE Response:", data);
//       await loadProfileAndAddresses();
//       if (selectedAddressId === id) setSelectedAddressId(null);
//     } catch (err) {
//       console.error(err.message);
//       alert("Failed to delete address");
//     }
//   };

//   const proceedToPayment = async () => {
//   if (!selectedAddressId) return alert("Please select an address first!");
//   const selectedAddress = addresses.find((a) => a._id === selectedAddressId);

//   try {
//     // 🧩 Build correct discount-aware payload
//     const payload = {
//       discountCode: priceDetails?.appliedCoupon?.code || null,
//       pointsToUse: priceDetails?.referralPointsUsed || 0,
//       giftCardCode: priceDetails?.giftCard?.code || null,
//       giftCardPin: priceDetails?.giftCard?.pin || null,
//       giftCardAmount: priceDetails?.giftCard?.amount || 0,
//       payable: priceDetails?.payable || 0, // ✅ Include final payable
//     };

//     console.log("📦 Sending Initiate Order Payload:", payload);

//     const initiateRes = await fetch(
//       "https://beauty.joyory.com/api/user/cart/order/initiate",
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify(payload),
//       }
//     );

//     const initiateData = await initiateRes.json();
//     console.log("🧾 initiateData from backend:", initiateData);

//     // 🧩 Extract orderId safely
//     const orderId =
//       initiateData.orderId ||
//       initiateData.order_id ||
//       initiateData.data?.orderId ||
//       initiateData.data?.id ||
//       initiateData.order?._id ||
//       null;

//     if (!initiateRes.ok || !orderId) {
//       return alert(initiateData.message || "Failed to initiate order");
//     }

//     console.log("✅ Using orderId:", orderId);
//     console.log("💰 Payable (with discounts):", priceDetails?.payable);

//     // ✅ Pass correct final payable details to PaymentProcess.jsx
//     navigate("/PaymentProcess", {
//       state: {
//         orderId,
//         selectedAddress,
//         cartItems: cartData,
//         priceDetails: {
//           ...priceDetails,
//           payable: priceDetails?.payable || 0,
//           bagDiscount: priceDetails?.bagDiscount || 0,
//           autoDiscount: priceDetails?.autoDiscount || 0,
//           couponDiscount: priceDetails?.couponDiscount || 0,
//           shipping: priceDetails?.shipping || 0,
//           appliedCoupon: priceDetails?.appliedCoupon || null,
//         },
//       },
//     });
//   } catch (error) {
//     console.error("❌ Order initiation failed:", error);
//     alert("Could not start payment process.");
//   }
// };



//   return (
//     <div style={pageWrapper} className="container">
//       {/* Stepper */}
//       <div style={stepperWrapper}>
//         <div style={{ ...stepStyle, background: "#1976d2", color: "#fff" }}>Sign up</div>
//         <div style={divider}></div>
//         <div style={stepStyle}>Address</div>
//         <div style={divider}></div>
//         <div style={stepStyle}>Payment</div>
//       </div>

//       <div style={mainContent}>
//         {/* Left Column */}
//         <div style={leftColumn}>
//           <h3 style={{ marginBottom: "15px" }}>Select Delivery Address</h3>

//           {!showForm ? (
//             <div
//               style={addCard}
//               onClick={() => {
//                 setNewAddress({
//                   name: profile.name || "",
//                   phone: profile.phone || "",
//                   email: profile.email || "",
//                   addressLine1: "",
//                   city: "",
//                   state: "",
//                   pincode: "",
//                 });
//                 setShowForm(true);
//               }}
//             >
//               <span style={{ fontSize: "28px", fontWeight: "500" }}>+</span>
//               <p style={{ margin: "10px 0 0", color: "#555" }}>Add New Address</p>
//             </div>
//           ) : (
//             <div style={formCard}>
//               <input style={input} type="text" placeholder="Full Name" value={newAddress.name} onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })} />
//               <input style={input} type="text" placeholder="Phone Number" value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} />
//               <input style={input} type="email" placeholder="Email" value={newAddress.email} onChange={(e) => setNewAddress({ ...newAddress, email: e.target.value })} />
//               <textarea style={{ ...input, height: "60px" }} placeholder="Address Line" value={newAddress.addressLine1} onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })} />
//               <input style={input} type="text" placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
//               <input style={input} type="text" placeholder="State" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
//               <input style={input} type="text" placeholder="Pincode" value={newAddress.pincode} onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} />
//               <div style={{ display: "flex", gap: "10px" }}>
//                 <button style={saveBtn} onClick={saveAddress}>{editingAddressId ? "Update" : "Save"}</button>
//                 <button style={cancelBtn} onClick={() => { setShowForm(false); setEditingAddressId(null); }}>Cancel</button>
//               </div>
//             </div>
//           )}

//           {addresses.map((addr) => (
//             <div key={addr._id} style={{ ...addressCard, border: selectedAddressId === addr._id ? "2px solid #1976d2" : "1px solid #ddd" }}>
//               <div onClick={() => setSelectedAddressId(addr._id)} style={{ cursor: "pointer" }}>
//                 <strong>{addr.name}</strong>, {addr.addressLine1}, {addr.city}, {addr.state} - {addr.pincode}
//                 <br />
//                 Phone: {addr.phone || "-"}, Email: {addr.email || "-"}
//               </div>
//               <div style={{ display: "flex", gap: "5px" }}>
//                 <button style={editBtn} onClick={() => editAddress(addr)}>Edit</button>
//                 <button style={deleteBtn} onClick={() => deleteAddressHandler(addr._id)}>Delete</button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Right Column */}
//         <div style={rightColumn}>
//           <h4 style={{ marginBottom: "15px" }}>
//             Summary ({cartData.length} items)
//           </h4>

//           <div style={priceRow}>
//             <span>Bag MRP:</span>
//             <span>₹{priceDetails.bagMrp}</span>
//           </div>

//           <div style={priceRow}>
//             <span>Bag Discount:</span>
//             <span style={{ color: "green" }}>-₹{priceDetails.bagDiscount}</span>
//           </div>

//           <div style={priceRow}>
//             <span>Auto Discount:</span>
//             <span style={{ color: "green" }}>-₹{priceDetails.autoDiscount}</span>
//           </div>

//           <div style={priceRow}>
//             <span>Coupon Discount:</span>
//             <span style={{ color: "green" }}>-₹{priceDetails.couponDiscount}</span>
//           </div>

//           <div style={priceRow}>
//             <span>Shipping:</span>
//             <span>
//               {priceDetails.shipping === 0 ? (
//                 <span style={{ color: "green" }}>Free Shipping</span>
//               ) : (
//                 <>
//                   ₹{priceDetails.shipping}
//                   {priceDetails.shippingMessage && (
//                     <span style={{ color: "#1976d2", fontSize: 12, marginLeft: 6 }}>
//                       {priceDetails.shippingMessage}
//                     </span>
//                   )}
//                 </>
//               )}
//             </span>
//           </div>

//           <hr style={{ margin: "12px 0" }} />

//           <div style={{ ...priceRow, fontWeight: "600" }}>
//             <span>Final Payable:</span>
//             <span>₹{priceDetails.payable}</span>
//           </div>

//           {priceDetails.savingsMessage && (
//             <div style={discountMsg}>{priceDetails.savingsMessage}</div>
//           )}

//           <button style={payBtn} onClick={proceedToPayment}>
//             Proceed to Payment ₹{priceDetails.payable}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* --- Styles --- */
// const pageWrapper = { fontFamily: "'Poppins', sans-serif", padding: "30px" };
// const stepperWrapper = { display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "30px" };
// const stepStyle = { padding: "10px 20px", borderRadius: "20px", border: "1px solid #ccc", background: "#f5f5f5", fontSize: "14px", fontWeight: "500" };
// const divider = { width: "50px", height: "2px", background: "#ccc" };
// const mainContent = { display: "grid", gridTemplateColumns: "2fr 1fr", gap: "40px" };
// const leftColumn = { background: "#fff" };
// const addCard = { border: "2px dashed #90caf9", background: "#e3f2fd", borderRadius: "8px", padding: "40px", textAlign: "center", cursor: "pointer", marginBottom: "20px" };
// const formCard = { border: "1px solid #ddd", background: "#fafafa", borderRadius: "8px", padding: "20px", marginBottom: "20px" };
// const input = { width: "100%", padding: "10px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "5px" };
// const saveBtn = { flex: 1, padding: "10px", background: "#1976d2", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" };
// const cancelBtn = { flex: 1, padding: "10px", background: "#ccc", color: "#000", border: "none", borderRadius: "5px", cursor: "pointer" };
// const addressCard = { padding: "15px", borderRadius: "8px", background: "#fff", marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" };
// const editBtn = { padding: "5px 10px", background: "#ffa000", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" };
// const deleteBtn = { padding: "5px 10px", background: "#e53935", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" };
// const rightColumn = { background: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" };
// const priceRow = { display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" };
// const discountMsg = { background: "#e8f5e9", color: "#388e3c", padding: "10px", borderRadius: "6px", marginTop: "15px", fontSize: "13px", textAlign: "center" };
// const payBtn = { marginTop: "20px", width: "100%", padding: "14px", background: "#1976d2", color: "#fff", border: "none", borderRadius: "6px", fontSize: "16px", fontWeight: "600", cursor: "pointer" };

// export default AddressSelection;

















// // src/pages/AddressSelection.jsx
// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import "../css/AddressSelection.css"; // Import the CSS file
// import Header from "./Header";

// const PROFILE_API = "https://beauty.joyory.com/api/user/profile";
// const CART_API = "https://beauty.joyory.com/api/user/cart/summary";

// const AddressSelection = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [profile, setProfile] = useState({});
//   const [addresses, setAddresses] = useState([]);
//   const [selectedAddressId, setSelectedAddressId] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [editingAddressId, setEditingAddressId] = useState(null);
//   const [newAddress, setNewAddress] = useState({
//     name: "",
//     phone: "",
//     email: "",
//     addressLine1: "",
//     city: "",
//     state: "",
//     pincode: "",
//   });

//   const [cartData, setCartData] = useState([]);
//   const [priceDetails, setPriceDetails] = useState({
//     bagMrp: 0,
//     bagDiscount: 0,
//     autoDiscount: 0,
//     couponDiscount: 0,
//     shipping: 0,
//     taxableAmount: 0,
//     gstRate: "0%",
//     gstAmount: 0,
//     gstMessage: "",
//     payable: 0,
//     totalSavings: 0,
//     savingsMessage: "",
//     shippingMessage: "",
//     appliedCoupon: null,
//   });

//   useEffect(() => {
//     if (location.state?.priceDetails) {
//       setPriceDetails({
//         bagMrp: location.state.priceDetails.bagMrp || 0,
//         bagDiscount: location.state.priceDetails.bagDiscount || 0,
//         autoDiscount: location.state.priceDetails.autoDiscount || 0,
//         couponDiscount: location.state.priceDetails.couponDiscount || 0,
//         shipping: location.state.priceDetails.shipping || 0,
//         taxableAmount: location.state.priceDetails.taxableAmount || 0,
//         gstRate: location.state.priceDetails.gstRate || "0%",
//         gstAmount: location.state.priceDetails.gstAmount || 0,
//         gstMessage: location.state.priceDetails.gstMessage || "",
//         payable: location.state.priceDetails.payable || 0,
//         totalSavings: location.state.priceDetails.totalSavings || 0,
//         savingsMessage: location.state.priceDetails.savingsMessage || "",
//         shippingMessage: location.state.priceDetails.shippingMessage || "",
//         appliedCoupon: location.state.priceDetails.appliedCoupon || null,
//       });
//       setCartData(location.state.cartItems || []);
//       console.log("🟢 Loaded price details from CartPage:", location.state.priceDetails);
//     } else {
//       loadCart();
//     }

//     loadProfileAndAddresses();
//   }, []);

//   const loadProfileAndAddresses = async () => {
//     try {
//       const res = await fetch(PROFILE_API, { credentials: "include" });
//       if (!res.ok) throw new Error("Failed to fetch profile");
//       const data = await res.json();

//       const prof = data.profile || {};
//       setProfile(prof);

//       setNewAddress({
//         name: prof.name || "",
//         phone: prof.phone || "",
//         email: prof.email || "",
//         addressLine1: "",
//         city: "",
//         state: "",
//         pincode: "",
//       });

//       const addressesWithProfile = (data.addresses || []).map((addr) => ({
//         ...addr,
//         name: addr.name || prof.name || "",
//         phone: addr.phone || prof.phone || "",
//         email: addr.email || prof.email || "",
//       }));

//       setAddresses(addressesWithProfile);
//     } catch (err) {
//       console.error(err.message);
//       alert("Failed to load profile and addresses");
//     }
//   };

//   const loadCart = async () => {
//     try {
//       const res = await fetch(CART_API, { credentials: "include" });
//       if (!res.ok) throw new Error("Failed to fetch cart");
//       const data = await res.json();

//       setCartData(data.cart || data.items || []);

//       const priceDetailsData = data.priceDetails || {};
//       setPriceDetails({
//         bagMrp: priceDetailsData.bagMrp || 0,
//         bagDiscount: priceDetailsData.bagDiscount || 0,
//         autoDiscount: priceDetailsData.autoDiscount || 0,
//         couponDiscount: priceDetailsData.couponDiscount || 0,
//         shipping: priceDetailsData.shippingCharge || 0,
//         taxableAmount: priceDetailsData.taxableAmount || 0,
//         gstRate: priceDetailsData.gstRate || "0%",
//         gstAmount: priceDetailsData.gstAmount || 0,
//         gstMessage: priceDetailsData.gstMessage || "",
//         payable: priceDetailsData.payable || 0,
//         totalSavings: priceDetailsData.totalSavings || priceDetailsData.bagDiscount || 0,
//         savingsMessage: priceDetailsData.savingsMessage || "",
//         shippingMessage: priceDetailsData.shippingMessage || "",
//         appliedCoupon: data.appliedCoupon || null,
//       });
//     } catch (err) {
//       console.error(err.message);
//       alert("Failed to load cart data");
//     }
//   };

//   const saveAddress = async () => {
//     const { name, phone, email, addressLine1, city, state, pincode } = newAddress;

//     if (!name || !phone || !email || !addressLine1 || !city || !state || !pincode) {
//       return alert("Please fill all required fields");
//     }
//     if (!/^\d{10}$/.test(phone)) return alert("Phone number must be 10 digits");
//     if (!/^\S+@\S+\.\S+$/.test(email)) return alert("Please enter a valid email");
//     if (!/^\d{6}$/.test(pincode)) return alert("Please enter a valid 6-digit pincode");

//     const isDuplicate = addresses.some((addr) => {
//       if (editingAddressId && addr._id === editingAddressId) return false;
//       return (
//         addr.addressLine1.trim().toLowerCase() === addressLine1.trim().toLowerCase() &&
//         addr.city.trim().toLowerCase() === city.trim().toLowerCase() &&
//         addr.state.trim().toLowerCase() === state.trim().toLowerCase() &&
//         String(addr.pincode).trim() === String(pincode).trim()
//       );
//     });

//     if (isDuplicate) {
//       return alert("This address already exists. Please use or edit the existing one.");
//     }

//     console.log("📤 Sending to backend:", newAddress);

//     try {
//       let res;
//       if (editingAddressId) {
//         res = await fetch(`${PROFILE_API}/address/${editingAddressId}`, {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify(newAddress),
//         });
//       } else {
//         res = await fetch(`${PROFILE_API}/address`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify(newAddress),
//         });
//       }

//       const data = await res.json();
//       console.log("📥 Response:", data);

//       if (!res.ok) {
//         if (data.message) {
//           alert(data.message);
//           return;
//         }
//         throw new Error("Failed to save address");
//       }

//       await loadProfileAndAddresses();

//       setEditingAddressId(null);
//       setShowForm(false);
//       setNewAddress({
//         name: profile.name || "",
//         phone: profile.phone || "",
//         email: profile.email || "",
//         addressLine1: "",
//         city: "",
//         state: "",
//         pincode: "",
//       });

//     } catch (err) {
//       console.error("❌ Error saving address:", err);
//       alert(err.message || "Failed to save address");
//     }
//   };

//   const editAddress = (addr) => {
//     setEditingAddressId(addr._id);
//     setNewAddress({
//       name: addr.name || "",
//       phone: addr.phone || "",
//       email: addr.email || "",
//       addressLine1: addr.addressLine1 || "",
//       city: addr.city || "",
//       state: addr.state || "",
//       pincode: addr.pincode || "",
//     });
//     setShowForm(true);
//   };

//   const deleteAddressHandler = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this address?")) return;
//     try {
//       const res = await fetch(`${PROFILE_API}/address/${id}`, {
//         method: "DELETE",
//         credentials: "include",
//       });
//       if (!res.ok) throw new Error("Failed to delete address");
//       const data = await res.json();
//       console.log("📥 DELETE Response:", data);
//       await loadProfileAndAddresses();
//       if (selectedAddressId === id) setSelectedAddressId(null);
//     } catch (err) {
//       console.error(err.message);
//       alert("Failed to delete address");
//     }
//   };

//   const proceedToPayment = async () => {
//     if (!selectedAddressId) return alert("Please select an address first!");
//     const selectedAddress = addresses.find((a) => a._id === selectedAddressId);

//     try {
//       const payload = {
//         discountCode: priceDetails?.appliedCoupon?.code || null,
//         pointsToUse: priceDetails?.referralPointsUsed || 0,
//         giftCardCode: priceDetails?.giftCard?.code || null,
//         giftCardPin: priceDetails?.giftCard?.pin || null,
//         giftCardAmount: priceDetails?.giftCard?.amount || 0,
//         payable: priceDetails?.payable || 0,
//         taxableAmount: priceDetails?.taxableAmount || 0,
//         gstAmount: priceDetails?.gstAmount || 0,
//         gstRate: priceDetails?.gstRate || "0%",
//       };

//       console.log("📦 Sending Initiate Order Payload:", payload);

//       const initiateRes = await fetch(
//         "https://beauty.joyory.com/api/user/cart/order/initiate",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify(payload),
//         }
//       );

//       const initiateData = await initiateRes.json();
//       console.log("🧾 initiateData from backend:", initiateData);

//       const orderId =
//         initiateData.orderId ||
//         initiateData.order_id ||
//         initiateData.data?.orderId ||
//         initiateData.data?.id ||
//         initiateData.order?._id ||
//         null;

//       if (!initiateRes.ok || !orderId) {
//         return alert(initiateData.message || "Failed to initiate order");
//       }

//       console.log("✅ Using orderId:", orderId);
//       console.log("💰 Final Payable Amount:", priceDetails?.payable);

//       navigate("/PaymentProcess", {
//         state: {
//           orderId,
//           selectedAddress,
//           cartItems: cartData,
//           priceDetails: {
//             ...priceDetails,
//             taxableAmount: priceDetails?.taxableAmount || 0,
//             gstRate: priceDetails?.gstRate || "0%",
//             gstAmount: priceDetails?.gstAmount || 0,
//             gstMessage: priceDetails?.gstMessage || "",
//             payable: priceDetails?.payable || 0,
//             bagDiscount: priceDetails?.bagDiscount || 0,
//             // autoDiscount: priceDetails?.autoDiscount || 0,
//             couponDiscount: priceDetails?.couponDiscount || 0,
//             shipping: priceDetails?.shipping || 0,
//             totalSavings: priceDetails?.totalSavings || 0,
//             savingsMessage: priceDetails?.savingsMessage || "",
//             appliedCoupon: priceDetails?.appliedCoupon || null,
//           },
//         },
//       });
//     } catch (error) {
//       console.error("❌ Order initiation failed:", error);
//       alert("Could not start payment process.");
//     }
//   };

//   const formatCurrency = (amount) => {
//     if (amount === null || amount === undefined) return "0.00";
//     return parseFloat(amount).toFixed(2);
//   };

//   return (


//     <>

//       <Header />

//       <div className="address-selection-container">
//         {/* Stepper */}
//         <div className="stepper-wrapper">
//           <div className="step step-active">Cart</div>
//           <div className="dividers"></div>
//           <div className="step step-active">Address</div>
//           <div className="dividers"></div>
//           <div className="step">Payment</div>
//         </div>

//         <div className="main-content">
//           {/* Left Column */}
//           <div className="left-column">
//             <h3 className="section-title">Select Delivery Address</h3>

//             {!showForm ? (
//               <div
//                 className="add-card"
//                 onClick={() => {
//                   setNewAddress({
//                     name: profile.name || "",
//                     phone: profile.phone || "",
//                     email: profile.email || "",
//                     addressLine1: "",
//                     city: "",
//                     state: "",
//                     pincode: "",
//                   });
//                   setShowForm(true);
//                 }}
//               >
//                 <span className="add-card-icon">+</span>
//                 <p className="add-card-text">Add New Address</p>
//               </div>
//             ) : (
//               <div className="form-card">
//                 <input
//                   className="form-input"
//                   type="text"
//                   placeholder="Full Name"
//                   value={newAddress.name}
//                   onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
//                 />
//                 <input
//                   className="form-input"
//                   type="text"
//                   placeholder="Phone Number"
//                   value={newAddress.phone}
//                   onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
//                 />
//                 <input
//                   className="form-input"
//                   type="email"
//                   placeholder="Email"
//                   value={newAddress.email}
//                   onChange={(e) => setNewAddress({ ...newAddress, email: e.target.value })}
//                 />
//                 <textarea
//                   className="form-input textarea-input"
//                   placeholder="Address Line"
//                   value={newAddress.addressLine1}
//                   onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
//                 />
//                 <input
//                   className="form-input"
//                   type="text"
//                   placeholder="City"
//                   value={newAddress.city}
//                   onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
//                 />
//                 <input
//                   className="form-input"
//                   type="text"
//                   placeholder="State"
//                   value={newAddress.state}
//                   onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
//                 />
//                 <input
//                   className="form-input"
//                   type="text"
//                   placeholder="Pincode"
//                   value={newAddress.pincode}
//                   onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
//                 />
//                 <div className="button-group">
//                   <button className="save-btn" onClick={saveAddress}>
//                     {editingAddressId ? "Update" : "Save"}
//                   </button>
//                   <button
//                     className="cancel-btn"
//                     onClick={() => {
//                       setShowForm(false);
//                       setEditingAddressId(null);
//                     }}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             )}

//             {addresses.map((addr) => (
//               <div
//                 key={addr._id}
//                 className={`address-card ${selectedAddressId === addr._id ? 'address-card-selected' : ''}`}
//               >
//                 <div
//                   className="address-content"
//                   onClick={() => setSelectedAddressId(addr._id)}
//                 >
//                   <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
//                     <strong className="address-name">{addr.name}</strong>
//                     {selectedAddressId === addr._id && (
//                       <span className="selected-badge">✓ Selected</span>
//                     )}
//                   </div>
//                   <p className="address-info">
//                     {addr.addressLine1}, {addr.city}, {addr.state} - {addr.pincode}
//                   </p>
//                   <div className="address-contact">
//                     <span>📱 {addr.phone || "-"}</span>
//                     {addr.email && <span style={{ marginLeft: "15px" }}>✉️ {addr.email}</span>}
//                   </div>
//                 </div>
//                 <div style={{ display: "flex", gap: "5px", flexShrink: 0 }}>
//                   <button className="edit-btn" onClick={() => editAddress(addr)}>Edit</button>
//                   <button className="delete-btn" onClick={() => deleteAddressHandler(addr._id)}>Delete</button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Right Column */}
//           <div className="right-column">
//             <h4 className="order-summary-title">
//               Order Summary ({cartData.length} {cartData.length === 1 ? 'item' : 'items'})
//             </h4>

//             <div className="price-row">
//               <span>Bag MRP:</span>
//               <span>₹{formatCurrency(priceDetails.bagMrp)}</span>
//             </div>

//             {priceDetails.bagDiscount > 0 && (
//               <div className="price-row">
//                 <span>Bag Discount:</span>
//                 <span className="discount-amount">-₹{formatCurrency(priceDetails.bagDiscount)}</span>
//               </div>
//             )}

//             {/* {priceDetails.autoDiscount > 0 && (
//               <div className="price-row">
//                 <span>Auto Discount:</span>
//                 <span className="discount-amount">-₹{formatCurrency(priceDetails.autoDiscount)}</span>
//               </div>
//             )} */}

//             {priceDetails.couponDiscount > 0 && (
//               <div className="price-row">
//                 <span>Coupon Discount:</span>
//                 <span className="discount-amount">-₹{formatCurrency(priceDetails.couponDiscount)}</span>
//               </div>
//             )}

//             {/* Taxable Amount Line */}
//             <div className="price-row taxable-amount-row">
//               <span>Taxable Amount:</span>
//               <span>₹{formatCurrency(priceDetails.taxableAmount)}</span>
//             </div>

//             {/* GST Display */}
//             <div className="price-row">
//               <span>GST ({priceDetails.gstRate || "0%"})</span>
//               <span>+₹{formatCurrency(priceDetails.gstAmount)}</span>
//             </div>

//             {priceDetails.gstMessage && (
//               <div className="gst-message">
//                 <span className="gst-note">💡 Note:</span> {priceDetails.gstMessage}
//               </div>
//             )}

//             <div className="price-row">
//               <span>Shipping:</span>
//               <span>
//                 {priceDetails.shipping === 0 ? (
//                   <span className="free-shipping">Free Shipping</span>
//                 ) : (
//                   <>
//                     ₹{formatCurrency(priceDetails.shipping)}
//                     {priceDetails.shippingMessage && (
//                       <span style={{ color: "#1976d2", fontSize: 12, marginLeft: 6 }}>
//                         ({priceDetails.shippingMessage})
//                       </span>
//                     )}
//                   </>
//                 )}
//               </span>
//             </div>

//             <hr className="section-divider" />

//             <div className="price-row total-payable-row">
//               <span>Total Payable:</span>
//               <span>₹{formatCurrency(priceDetails.payable)}</span>
//             </div>

//             {priceDetails.totalSavings > 0 && (
//               <div className="savings-card">
//                 <div className="savings-amount">
//                   🎉 You saved ₹{formatCurrency(priceDetails.totalSavings)}
//                 </div>
//                 {priceDetails.savingsMessage && (
//                   <div className="savings-message">
//                     {priceDetails.savingsMessage}
//                   </div>
//                 )}
//               </div>
//             )}

//             {priceDetails.appliedCoupon?.code && (
//               <div className="coupon-card">
//                 <span>
//                   <strong>Applied Coupon:</strong> {priceDetails.appliedCoupon.code}
//                   {priceDetails.appliedCoupon.discount && (
//                     <span style={{ marginLeft: "10px" }}>- ₹{priceDetails.appliedCoupon.discount} off</span>
//                   )}
//                 </span>
//               </div>
//             )}

//             <button
//               className={`pay-btn ${!selectedAddressId ? 'pay-btn-disabled' : ''}`}
//               onClick={proceedToPayment}
//               disabled={!selectedAddressId}
//             >
//               {selectedAddressId ? (
//                 `Proceed to Pay ₹${formatCurrency(priceDetails.payable)}`
//               ) : (
//                 "Select an address to continue"
//               )}
//             </button>

//             <div className="payment-note">
//               <span className="secure-badge">✓</span>
//               <span>GST Invoice Available • Secure Payment</span>
//             </div>
//           </div>
//         </div>
//       </div>

//     </>
//   );
// };

// export default AddressSelection;


















// // src/pages/AddressSelection.jsx
// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import "../css/AddressSelection.css"; // Import the CSS file
// import Header from "./Header";
// import { Spinner, Modal } from "react-bootstrap"; // Added Modal for loading overlay

// const PROFILE_API = "https://beauty.joyory.com/api/user/profile";
// const CART_API = "https://beauty.joyory.com/api/user/cart/summary";

// const AddressSelection = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [profile, setProfile] = useState({});
//   const [addresses, setAddresses] = useState([]);
//   const [selectedAddressId, setSelectedAddressId] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [editingAddressId, setEditingAddressId] = useState(null);
//   const [newAddress, setNewAddress] = useState({
//     name: "",
//     phone: "",
//     email: "",
//     addressLine1: "",
//     city: "",
//     state: "",
//     pincode: "",
//   });

//   const [cartData, setCartData] = useState([]);
//   const [priceDetails, setPriceDetails] = useState({
//     bagMrp: 0,
//     bagDiscount: 0,
//     autoDiscount: 0,
//     couponDiscount: 0,
//     shipping: 0,
//     taxableAmount: 0,
//     gstRate: "0%",
//     gstAmount: 0,
//     gstMessage: "",
//     payable: 0,
//     totalSavings: 0,
//     savingsMessage: "",
//     shippingMessage: "",
//     appliedCoupon: null,
//   });

//   // Enhanced loading states for payment processing
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [processingMessage, setProcessingMessage] = useState("");
//   const [showProcessingModal, setShowProcessingModal] = useState(false);

//   useEffect(() => {
//     if (location.state?.priceDetails) {
//       setPriceDetails({
//         bagMrp: location.state.priceDetails.bagMrp || 0,
//         bagDiscount: location.state.priceDetails.bagDiscount || 0,
//         autoDiscount: location.state.priceDetails.autoDiscount || 0,
//         couponDiscount: location.state.priceDetails.couponDiscount || 0,
//         shipping: location.state.priceDetails.shipping || 0,
//         taxableAmount: location.state.priceDetails.taxableAmount || 0,
//         gstRate: location.state.priceDetails.gstRate || "0%",
//         gstAmount: location.state.priceDetails.gstAmount || 0,
//         gstMessage: location.state.priceDetails.gstMessage || "",
//         payable: location.state.priceDetails.payable || 0,
//         totalSavings: location.state.priceDetails.totalSavings || 0,
//         savingsMessage: location.state.priceDetails.savingsMessage || "",
//         shippingMessage: location.state.priceDetails.shippingMessage || "",
//         appliedCoupon: location.state.priceDetails.appliedCoupon || null,
//       });
//       setCartData(location.state.cartItems || []);
//       console.log("🟢 Loaded price details from CartPage:", location.state.priceDetails);
//     } else {
//       loadCart();
//     }

//     loadProfileAndAddresses();
//   }, []);

//   const loadProfileAndAddresses = async () => {
//     try {
//       setProcessingMessage("Loading profile...");
//       const res = await fetch(PROFILE_API, { credentials: "include" });
//       if (!res.ok) throw new Error("Failed to fetch profile");
//       const data = await res.json();

//       const prof = data.profile || {};
//       setProfile(prof);

//       setNewAddress({
//         name: prof.name || "",
//         phone: prof.phone || "",
//         email: prof.email || "",
//         addressLine1: "",
//         city: "",
//         state: "",
//         pincode: "",
//       });

//       const addressesWithProfile = (data.addresses || []).map((addr) => ({
//         ...addr,
//         name: addr.name || prof.name || "",
//         phone: addr.phone || prof.phone || "",
//         email: addr.email || prof.email || "",
//       }));

//       setAddresses(addressesWithProfile);
//     } catch (err) {
//       console.error(err.message);
//       alert("Failed to load profile and addresses");
//     }
//   };

//   const loadCart = async () => {
//     try {
//       setProcessingMessage("Loading cart data...");
//       const res = await fetch(CART_API, { credentials: "include" });
//       if (!res.ok) throw new Error("Failed to fetch cart");
//       const data = await res.json();

//       setCartData(data.cart || data.items || []);

//       const priceDetailsData = data.priceDetails || {};
//       setPriceDetails({
//         bagMrp: priceDetailsData.bagMrp || 0,
//         bagDiscount: priceDetailsData.bagDiscount || 0,
//         autoDiscount: priceDetailsData.autoDiscount || 0,
//         couponDiscount: priceDetailsData.couponDiscount || 0,
//         shipping: priceDetailsData.shippingCharge || 0,
//         taxableAmount: priceDetailsData.taxableAmount || 0,
//         gstRate: priceDetailsData.gstRate || "0%",
//         gstAmount: priceDetailsData.gstAmount || 0,
//         gstMessage: priceDetailsData.gstMessage || "",
//         payable: priceDetailsData.payable || 0,
//         totalSavings: priceDetailsData.totalSavings || priceDetailsData.bagDiscount || 0,
//         savingsMessage: priceDetailsData.savingsMessage || "",
//         shippingMessage: priceDetailsData.shippingMessage || "",
//         appliedCoupon: data.appliedCoupon || null,
//       });
//     } catch (err) {
//       console.error(err.message);
//       alert("Failed to load cart data");
//     }
//   };

//   const saveAddress = async () => {
//     const { name, phone, email, addressLine1, city, state, pincode } = newAddress;

//     if (!name || !phone || !email || !addressLine1 || !city || !state || !pincode) {
//       return alert("Please fill all required fields");
//     }
//     if (!/^\d{10}$/.test(phone)) return alert("Phone number must be 10 digits");
//     if (!/^\S+@\S+\.\S+$/.test(email)) return alert("Please enter a valid email");
//     if (!/^\d{6}$/.test(pincode)) return alert("Please enter a valid 6-digit pincode");

//     const isDuplicate = addresses.some((addr) => {
//       if (editingAddressId && addr._id === editingAddressId) return false;
//       return (
//         addr.addressLine1.trim().toLowerCase() === addressLine1.trim().toLowerCase() &&
//         addr.city.trim().toLowerCase() === city.trim().toLowerCase() &&
//         addr.state.trim().toLowerCase() === state.trim().toLowerCase() &&
//         String(addr.pincode).trim() === String(pincode).trim()
//       );
//     });

//     if (isDuplicate) {
//       return alert("This address already exists. Please use or edit the existing one.");
//     }

//     console.log("📤 Sending to backend:", newAddress);

//     try {
//       let res;
//       if (editingAddressId) {
//         res = await fetch(`${PROFILE_API}/address/${editingAddressId}`, {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify(newAddress),
//         });
//       } else {
//         res = await fetch(`${PROFILE_API}/address`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify(newAddress),
//         });
//       }

//       const data = await res.json();
//       console.log("📥 Response:", data);

//       if (!res.ok) {
//         if (data.message) {
//           alert(data.message);
//           return;
//         }
//         throw new Error("Failed to save address");
//       }

//       await loadProfileAndAddresses();

//       setEditingAddressId(null);
//       setShowForm(false);
//       setNewAddress({
//         name: profile.name || "",
//         phone: profile.phone || "",
//         email: profile.email || "",
//         addressLine1: "",
//         city: "",
//         state: "",
//         pincode: "",
//       });

//     } catch (err) {
//       console.error("❌ Error saving address:", err);
//       alert(err.message || "Failed to save address");
//     }
//   };

//   const editAddress = (addr) => {
//     setEditingAddressId(addr._id);
//     setNewAddress({
//       name: addr.name || "",
//       phone: addr.phone || "",
//       email: addr.email || "",
//       addressLine1: addr.addressLine1 || "",
//       city: addr.city || "",
//       state: addr.state || "",
//       pincode: addr.pincode || "",
//     });
//     setShowForm(true);
//   };

//   const deleteAddressHandler = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this address?")) return;
//     try {
//       const res = await fetch(`${PROFILE_API}/address/${id}`, {
//         method: "DELETE",
//         credentials: "include",
//       });
//       if (!res.ok) throw new Error("Failed to delete address");
//       const data = await res.json();
//       console.log("📥 DELETE Response:", data);
//       await loadProfileAndAddresses();
//       if (selectedAddressId === id) setSelectedAddressId(null);
//     } catch (err) {
//       console.error(err.message);
//       alert("Failed to delete address");
//     }
//   };

//   // Enhanced proceedToPayment with loading states
//   const proceedToPayment = async () => {
//     if (!selectedAddressId) {
//       alert("Please select an address first!");
//       return;
//     }

//     const selectedAddress = addresses.find((a) => a._id === selectedAddressId);

//     try {
//       // Show loading overlay
//       setIsProcessing(true);
//       setShowProcessingModal(true);
//       setProcessingMessage("Preparing your order...");

//       const payload = {
//         discountCode: priceDetails?.appliedCoupon?.code || null,
//         pointsToUse: priceDetails?.referralPointsUsed || 0,
//         giftCardCode: priceDetails?.giftCard?.code || null,
//         giftCardPin: priceDetails?.giftCard?.pin || null,
//         giftCardAmount: priceDetails?.giftCard?.amount || 0,
//         payable: priceDetails?.payable || 0,
//         taxableAmount: priceDetails?.taxableAmount || 0,
//         gstAmount: priceDetails?.gstAmount || 0,
//         gstRate: priceDetails?.gstRate || "0%",
//       };

//       console.log("📦 Sending Initiate Order Payload:", payload);

//       // Simulate some processing time for better UX
//       setProcessingMessage("Validating payment details...");
//       await new Promise(resolve => setTimeout(resolve, 800));

//       setProcessingMessage("Creating your order...");

//       // ✅ FIXED: Removed space from API URL
//       const initiateRes = await fetch(
//         "https://beauty.joyory.com/api/user/cart/order/initiate",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify(payload),
//         }
//       );

//       // Check if response is JSON
//       const contentType = initiateRes.headers.get("content-type");
//       let initiateData;

//       if (contentType && contentType.includes("application/json")) {
//         initiateData = await initiateRes.json();
//       } else {
//         const text = await initiateRes.text();
//         console.error("❌ Non-JSON response:", text.substring(0, 200));
//         throw new Error(`Server error: Received ${contentType || 'HTML'} instead of JSON`);
//       }

//       console.log("🧾 initiateData from backend:", initiateData);

//       const orderId =
//         initiateData.orderId ||
//         initiateData.order_id ||
//         initiateData.data?.orderId ||
//         initiateData.data?.id ||
//         initiateData.order?._id ||
//         null;

//       if (!initiateRes.ok || !orderId) {
//         throw new Error(initiateData.message || "Failed to initiate order");
//       }

//       console.log("✅ Using orderId:", orderId);
//       console.log("💰 Final Payable Amount:", priceDetails?.payable);

//       // Success state
//       setProcessingMessage("Order created successfully!");

//       // Small delay for better UX before navigation
//       setTimeout(() => {
//         setIsProcessing(false);
//         setShowProcessingModal(false);

//         navigate("/PaymentProcess", {
//           state: {
//             orderId,
//             selectedAddress,
//             cartItems: cartData,
//             priceDetails: {
//               ...priceDetails,
//               taxableAmount: priceDetails?.taxableAmount || 0,
//               gstRate: priceDetails?.gstRate || "0%",
//               gstAmount: priceDetails?.gstAmount || 0,
//               gstMessage: priceDetails?.gstMessage || "",
//               payable: priceDetails?.payable || 0,
//               bagDiscount: priceDetails?.bagDiscount || 0,
//               couponDiscount: priceDetails?.couponDiscount || 0,
//               shipping: priceDetails?.shipping || 0,
//               totalSavings: priceDetails?.totalSavings || 0,
//               savingsMessage: priceDetails?.savingsMessage || "",
//               appliedCoupon: priceDetails?.appliedCoupon || null,
//             },
//           },
//         });
//       }, 500);

//     } catch (error) {
//       console.error("❌ Order initiation failed:", error);

//       // Show error state
//       setProcessingMessage(`Error: ${error.message || "Could not start payment process"}`);

//       // Reset after showing error
//       setTimeout(() => {
//         setIsProcessing(false);
//         setShowProcessingModal(false);
//         setProcessingMessage("");
//         alert(error.message || "Could not start payment process. Please try again.");
//       }, 2000);
//     }
//   };

//   const formatCurrency = (amount) => {
//     if (amount === null || amount === undefined) return "0.00";
//     return parseFloat(amount).toFixed(2);
//   };

//   // Loading Overlay Component
//   const ProcessingOverlay = () => (
//     <Modal show={showProcessingModal} backdrop="static" keyboard={false} centered>
//       <Modal.Body className="text-center py-5">
//         <Spinner animation="border" role="status" variant="primary" style={{ width: '3rem', height: '3rem' }}>
//           <span className="visually-hidden">Processing...</span>
//         </Spinner>
//         <div className="mt-3">
//           <h5 className="mb-2">{processingMessage || "Processing your order..."}</h5>
//           <p className="text-muted mb-0">Please wait while we prepare your payment</p>
//         </div>
//       </Modal.Body>
//     </Modal>
//   );

//   return (
//     <>
//       <Header />

//       {/* Processing Overlay */}
//       <ProcessingOverlay />

//       <div className="address-selection-container mt-lg-5 pt-lg-5 page-title-main-name">
//         {/* Stepper */}
//         <div className="stepper-wrapper pt-lg-5 mt-lg-4">
//           <div className="step step-active page-title-main-name">Cart</div>
//           <div className="dividers"></div>
//           <div className="step step-active page-title-main-name">Address</div>
//           <div className="dividers"></div>
//           <div className="step page-title-main-name">Payment</div>
//         </div>

//         <div className="main-content">
//           {/* Left Column */}
//           <div className="left-column">
//             <h3 className="section-title page-title-main-name">Select Delivery Address</h3>

//             {!showForm ? (
//               <div
//                 className="add-card"
//                 onClick={() => {
//                   setNewAddress({
//                     name: profile.name || "",
//                     phone: profile.phone || "",
//                     email: profile.email || "",
//                     addressLine1: "",
//                     city: "",
//                     state: "",
//                     pincode: "",
//                   });
//                   setShowForm(true);
//                 }}
//               >
//                 <span className="add-card-icon">+</span>
//                 <p className="add-card-text">Add New Address</p>
//               </div>
//             ) : (
//               <div className="form-card">
//                 <input
//                   className="form-input page-title-main-name"
//                   type="text"
//                   placeholder="Full Name"
//                   value={newAddress.name}
//                   onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
//                 />
//                 <input
//                   className="form-input page-title-main-name"
//                   type="text"
//                   placeholder="Phone Number"
//                   value={newAddress.phone}
//                   onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
//                 />
//                 <input
//                   className="form-input page-title-main-name"
//                   type="email"
//                   placeholder="Email"
//                   value={newAddress.email}
//                   onChange={(e) => setNewAddress({ ...newAddress, email: e.target.value })}
//                 />
//                 <textarea
//                   className="form-input page-title-main-name textarea-input"
//                   placeholder="Address Line"
//                   value={newAddress.addressLine1}
//                   onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
//                 />
//                 <input
//                   className="form-input page-title-main-name"
//                   type="text"
//                   placeholder="City"
//                   value={newAddress.city}
//                   onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
//                 />
//                 <input
//                   className="form-input page-title-main-name"
//                   type="text"
//                   placeholder="State"
//                   value={newAddress.state}
//                   onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
//                 />
//                 <input
//                   className="form-input page-title-main-name"
//                   type="text"
//                   placeholder="Pincode"
//                   value={newAddress.pincode}
//                   onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
//                 />
//                 <div className="button-group">
//                   <button className="save-btn page-title-main-name" onClick={saveAddress} disabled={isProcessing}>
//                     {isProcessing ? "Saving..." : (editingAddressId ? "Update" : "Save")}
//                   </button>
//                   <button
//                     className="cancel-btn page-title-main-name"
//                     onClick={() => {
//                       setShowForm(false);
//                       setEditingAddressId(null);
//                     }}
//                     disabled={isProcessing}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             )}

//             {addresses.map((addr) => (
//               <div
//                 key={addr._id}
//                 className={`address-card ${selectedAddressId === addr._id ? 'address-card-selected' : ''}`}
//               >
//                 <div
//                   className="address-content"
//                   onClick={() => setSelectedAddressId(addr._id)}
//                 >
//                   <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
//                     <strong className="address-name">{addr.name}</strong>
//                     {selectedAddressId === addr._id && (
//                       <span className="selected-badge">✓ Selected</span>
//                     )}
//                   </div>
//                   <p className="address-info">
//                     {addr.addressLine1}, {addr.city}, {addr.state} - {addr.pincode}
//                   </p>
//                   <div className="address-contact">
//                     <span>📱 {addr.phone || "-"}</span>
//                     {addr.email && <span style={{ marginLeft: "15px" }}>✉️ {addr.email}</span>}
//                   </div>
//                 </div>
//                 <div style={{ display: "flex", gap: "5px", flexShrink: 0 }}>
//                   <button className="edit-btn" onClick={() => editAddress(addr)} disabled={isProcessing}>
//                     {isProcessing ? "..." : "Edit"}
//                   </button>
//                   <button className="delete-btn" onClick={() => deleteAddressHandler(addr._id)} disabled={isProcessing}>
//                     {isProcessing ? "..." : "Delete"}
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Right Column */}
//           <div className="right-column">
//             <h4 className="order-summary-title">
//               Order Summary ({cartData.length} {cartData.length === 1 ? 'item' : 'items'})
//             </h4>

//             <div className="price-row">
//               <span>Bag MRP:</span>
//               <span>₹{formatCurrency(priceDetails.bagMrp)}</span>
//             </div>

//             {priceDetails.bagDiscount > 0 && (
//               <div className="price-row">
//                 <span>Bag Discount:</span>
//                 <span className="discount-amount">-₹{formatCurrency(priceDetails.bagDiscount)}</span>
//               </div>
//             )}


//             <div className="price-row">
//               <span>Shipping:</span>
//               <span>
//                 {priceDetails.shipping === 0 ? (
//                   <span className="free-shipping">Free Shipping</span>
//                 ) : (
//                   <>
//                     ₹{formatCurrency(priceDetails.shipping)}
//                     {priceDetails.shippingMessage && (
//                       <span style={{ color: "#1976d2", fontSize: 12, marginLeft: 6 }}>
//                         ({priceDetails.shippingMessage})
//                       </span>
//                     )}
//                   </>
//                 )}
//               </span>
//             </div>

//             {priceDetails.couponDiscount > 0 && (
//               <div className="price-row">
//                 <span>Coupon Discount:</span>
//                 <span className="discount-amount">-₹{formatCurrency(priceDetails.couponDiscount)}</span>
//               </div>
//             )}

//             {/* Taxable Amount Line */}
//             <div className="price-row taxable-amount-row">
//               <span>Taxable Amount:</span>
//               <span>₹{formatCurrency(priceDetails.taxableAmount)}</span>
//             </div>

//             {/* GST Display */}
//             <div className="price-row">
//               <span>GST ({priceDetails.gstRate || "0%"})</span>
//               <span>+₹{formatCurrency(priceDetails.gstAmount)}</span>
//             </div>

//             {priceDetails.gstMessage && (
//               <div className="gst-message">
//                 <span className="gst-note">💡 Note:</span> {priceDetails.gstMessage}
//               </div>
//             )}



//             <hr className="section-divider" />

//             <div className="price-row total-payable-row bg-white">
//               <span>Total Payable:</span>
//               <span>₹{formatCurrency(priceDetails.payable)}</span>
//             </div>

//             {priceDetails.totalSavings > 0 && (
//               <div className="savings-card">
//                 <div className="savings-amount">
//                   🎉 You saved ₹{formatCurrency(priceDetails.totalSavings)}
//                 </div>
//                 {priceDetails.savingsMessage && (
//                   <div className="savings-message">
//                     {priceDetails.savingsMessage}
//                   </div>
//                 )}
//               </div>
//             )}

//             {priceDetails.appliedCoupon?.code && (
//               <div className="coupon-card">
//                 <span>
//                   <strong>Applied Coupon:</strong> {priceDetails.appliedCoupon.code}
//                   {priceDetails.appliedCoupon.discount && (
//                     <span style={{ marginLeft: "10px" }}>- ₹{priceDetails.appliedCoupon.discount} off</span>
//                   )}
//                 </span>
//               </div>
//             )}

//             <button
//               className={`pay-btn ${!selectedAddressId || isProcessing ? 'pay-btn-disabled' : ''}`}
//               onClick={proceedToPayment}
//               disabled={!selectedAddressId || isProcessing}
//             >
//               {isProcessing ? (
//                 <>
//                   <Spinner
//                     animation="border"
//                     size="sm"
//                     className="me-2"
//                     style={{ width: '1rem', height: '1rem' }}
//                   />
//                   {processingMessage || "Processing..."}
//                 </>
//               ) : (
//                 `Proceed to Pay ₹${formatCurrency(priceDetails.payable)}`
//               )}
//             </button>

//             <div className="payment-note">
//               <span className="secure-badge">✓</span>
//               <span>GST Invoice Available • Secure Payment</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AddressSelection;















// src/pages/AddressSelection.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/AddressSelection.css";
import Header from "./Header";
import { Spinner, Modal } from "react-bootstrap";

const PROFILE_API = "https://beauty.joyory.com/api/user/profile";
const CART_API = "https://beauty.joyory.com/api/user/cart/summary";

const AddressSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [profile, setProfile] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    email: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [cartData, setCartData] = useState([]);
  const [priceDetails, setPriceDetails] = useState({
    bagMrp: 0,
    bagDiscount: 0,
    autoDiscount: 0,
    couponDiscount: 0,
    shipping: 0,
    taxableAmount: 0,
    gstRate: "0%",
    gstAmount: 0,
    gstMessage: "",
    payable: 0,
    totalSavings: 0,
    savingsMessage: "",
    shippingMessage: "",
    appliedCoupon: null,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("");
  const [showProcessingModal, setShowProcessingModal] = useState(false);

  // Optional state for inline error message
  const [addressError, setAddressError] = useState("");

  useEffect(() => {
    if (location.state?.priceDetails) {
      setPriceDetails({
        bagMrp: location.state.priceDetails.bagMrp || 0,
        bagDiscount: location.state.priceDetails.bagDiscount || 0,
        autoDiscount: location.state.priceDetails.autoDiscount || 0,
        couponDiscount: location.state.priceDetails.couponDiscount || 0,
        shipping: location.state.priceDetails.shipping || 0,
        taxableAmount: location.state.priceDetails.taxableAmount || 0,
        gstRate: location.state.priceDetails.gstRate || "0%",
        gstAmount: location.state.priceDetails.gstAmount || 0,
        gstMessage: location.state.priceDetails.gstMessage || "",
        payable: location.state.priceDetails.payable || 0,
        totalSavings: location.state.priceDetails.totalSavings || 0,
        savingsMessage: location.state.priceDetails.savingsMessage || "",
        shippingMessage: location.state.priceDetails.shippingMessage || "",
        appliedCoupon: location.state.priceDetails.appliedCoupon || null,
      });
      setCartData(location.state.cartItems || []);
      console.log("🟢 Loaded price details from CartPage:", location.state.priceDetails);
    } else {
      loadCart();
    }

    loadProfileAndAddresses();
  }, []);

  const loadProfileAndAddresses = async () => {
    try {
      setProcessingMessage("Loading profile...");
      const res = await fetch(PROFILE_API, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();

      const prof = data.profile || {};
      setProfile(prof);

      setNewAddress({
        name: prof.name || "",
        phone: prof.phone || "",
        email: prof.email || "",
        addressLine1: "",
        city: "",
        state: "",
        pincode: "",
      });

      const addressesWithProfile = (data.addresses || []).map((addr) => ({
        ...addr,
        name: addr.name || prof.name || "",
        phone: addr.phone || prof.phone || "",
        email: addr.email || prof.email || "",
      }));

      // setAddresses(addressesWithProfile);
      setAddresses(addressesWithProfile);

      // ✅ Auto-select first address if available
      if (addressesWithProfile.length > 0) {
        setSelectedAddressId(addressesWithProfile[0]._id);
      }
    } catch (err) {
      console.error(err.message);
      alert("Failed to load profile and addresses");
    }
  };

  const loadCart = async () => {
    try {
      setProcessingMessage("Loading cart data...");
      const res = await fetch(CART_API, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();

      setCartData(data.cart || data.items || []);

      const priceDetailsData = data.priceDetails || {};
      setPriceDetails({
        bagMrp: priceDetailsData.bagMrp || 0,
        bagDiscount: priceDetailsData.bagDiscount || 0,
        autoDiscount: priceDetailsData.autoDiscount || 0,
        couponDiscount: priceDetailsData.couponDiscount || 0,
        shipping: priceDetailsData.shippingCharge || 0,
        taxableAmount: priceDetailsData.taxableAmount || 0,
        gstRate: priceDetailsData.gstRate || "0%",
        gstAmount: priceDetailsData.gstAmount || 0,
        gstMessage: priceDetailsData.gstMessage || "",
        payable: priceDetailsData.payable || 0,
        totalSavings: priceDetailsData.totalSavings || priceDetailsData.bagDiscount || 0,
        savingsMessage: priceDetailsData.savingsMessage || "",
        shippingMessage: priceDetailsData.shippingMessage || "",
        appliedCoupon: data.appliedCoupon || null,
      });
    } catch (err) {
      console.error(err.message);
      alert("Failed to load cart data");
    }
  };

  const saveAddress = async () => {
    const { name, phone, email, addressLine1, city, state, pincode } = newAddress;

    if (!name || !phone || !email || !addressLine1 || !city || !state || !pincode) {
      return alert("Please fill all required fields");
    }
    if (!/^\d{10}$/.test(phone)) return alert("Phone number must be 10 digits");
    if (!/^\S+@\S+\.\S+$/.test(email)) return alert("Please enter a valid email");
    if (!/^\d{6}$/.test(pincode)) return alert("Please enter a valid 6-digit pincode");

    const isDuplicate = addresses.some((addr) => {
      if (editingAddressId && addr._id === editingAddressId) return false;
      return (
        addr.addressLine1.trim().toLowerCase() === addressLine1.trim().toLowerCase() &&
        addr.city.trim().toLowerCase() === city.trim().toLowerCase() &&
        addr.state.trim().toLowerCase() === state.trim().toLowerCase() &&
        String(addr.pincode).trim() === String(pincode).trim()
      );
    });

    if (isDuplicate) {
      return alert("This address already exists. Please use or edit the existing one.");
    }

    console.log("📤 Sending to backend:", newAddress);

    try {
      let res;
      if (editingAddressId) {
        res = await fetch(`${PROFILE_API}/address/${editingAddressId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(newAddress),
        });
      } else {
        res = await fetch(`${PROFILE_API}/address`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(newAddress),
        });
      }

      const data = await res.json();
      console.log("📥 Response:", data);

      if (!res.ok) {
        if (data.message) {
          alert(data.message);
          return;
        }
        throw new Error("Failed to save address");
      }

      await loadProfileAndAddresses();

      setEditingAddressId(null);
      setShowForm(false);
      setNewAddress({
        name: profile.name || "",
        phone: profile.phone || "",
        email: profile.email || "",
        addressLine1: "",
        city: "",
        state: "",
        pincode: "",
      });

    } catch (err) {
      console.error("❌ Error saving address:", err);
      alert(err.message || "Failed to save address");
    }
  };

  const editAddress = (addr) => {
    setEditingAddressId(addr._id);
    setNewAddress({
      name: addr.name || "",
      phone: addr.phone || "",
      email: addr.email || "",
      addressLine1: addr.addressLine1 || "",
      city: addr.city || "",
      state: addr.state || "",
      pincode: addr.pincode || "",
    });
    setShowForm(true);
  };

  const deleteAddressHandler = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await fetch(`${PROFILE_API}/address/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete address");
      const data = await res.json();
      console.log("📥 DELETE Response:", data);
      await loadProfileAndAddresses();
      if (selectedAddressId === id) setSelectedAddressId(null);
    } catch (err) {
      console.error(err.message);
      alert("Failed to delete address");
    }
  };

  // Modified proceedToPayment to show alert if no address selected
  const proceedToPayment = async () => {
    if (!selectedAddressId) {
      // Show alert popup as requested
      alert("Please select a delivery address before proceeding.");
      setAddressError("Please select a delivery address."); // Optional inline error
      return;
    }
    setAddressError(""); // Clear any previous error

    const selectedAddress = addresses.find((a) => a._id === selectedAddressId);

    try {
      setIsProcessing(true);
      setShowProcessingModal(true);
      setProcessingMessage("Preparing your order...");

      const payload = {
        discountCode: priceDetails?.appliedCoupon?.code || null,
        pointsToUse: priceDetails?.referralPointsUsed || 0,
        giftCardCode: priceDetails?.giftCard?.code || null,
        giftCardPin: priceDetails?.giftCard?.pin || null,
        giftCardAmount: priceDetails?.giftCard?.amount || 0,
        payable: priceDetails?.payable || 0,
        taxableAmount: priceDetails?.taxableAmount || 0,
        gstAmount: priceDetails?.gstAmount || 0,
        gstRate: priceDetails?.gstRate || "0%",
      };

      console.log("📦 Sending Initiate Order Payload:", payload);

      setProcessingMessage("Validating payment details...");
      await new Promise(resolve => setTimeout(resolve, 800));

      setProcessingMessage("Creating your order...");

      const initiateRes = await fetch(
        "https://beauty.joyory.com/api/user/cart/order/initiate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      const contentType = initiateRes.headers.get("content-type");
      let initiateData;

      if (contentType && contentType.includes("application/json")) {
        initiateData = await initiateRes.json();
      } else {
        const text = await initiateRes.text();
        console.error("❌ Non-JSON response:", text.substring(0, 200));
        throw new Error(`Server error: Received ${contentType || 'HTML'} instead of JSON`);
      }

      console.log("🧾 initiateData from backend:", initiateData);

      const orderId =
        initiateData.orderId ||
        initiateData.order_id ||
        initiateData.data?.orderId ||
        initiateData.data?.id ||
        initiateData.order?._id ||
        null;

      if (!initiateRes.ok || !orderId) {
        throw new Error(initiateData.message || "Failed to initiate order");
      }

      console.log("✅ Using orderId:", orderId);
      console.log("💰 Final Payable Amount:", priceDetails?.payable);

      setProcessingMessage("Order created successfully!");

      setTimeout(() => {
        setIsProcessing(false);
        setShowProcessingModal(false);

        navigate("/PaymentProcess", {
          state: {
            orderId,
            selectedAddress,
            cartItems: cartData,
            priceDetails: {
              ...priceDetails,
              taxableAmount: priceDetails?.taxableAmount || 0,
              gstRate: priceDetails?.gstRate || "0%",
              gstAmount: priceDetails?.gstAmount || 0,
              gstMessage: priceDetails?.gstMessage || "",
              payable: priceDetails?.payable || 0,
              bagDiscount: priceDetails?.bagDiscount || 0,
              couponDiscount: priceDetails?.couponDiscount || 0,
              shipping: priceDetails?.shipping || 0,
              totalSavings: priceDetails?.totalSavings || 0,
              savingsMessage: priceDetails?.savingsMessage || "",
              appliedCoupon: priceDetails?.appliedCoupon || null,
            },
          },
        });
      }, 500);

    } catch (error) {
      console.error("❌ Order initiation failed:", error);

      setProcessingMessage(`Error: ${error.message || "Could not start payment process"}`);

      setTimeout(() => {
        setIsProcessing(false);
        setShowProcessingModal(false);
        setProcessingMessage("");
        alert(error.message || "Could not start payment process. Please try again.");
      }, 2000);
    }
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "0.00";
    return parseFloat(amount).toFixed(2);
  };

  const ProcessingOverlay = () => (
    <Modal show={showProcessingModal} backdrop="static" keyboard={false} centered>
      <Modal.Body className="text-center py-5">
        <Spinner animation="border" role="status" variant="primary" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Processing...</span>
        </Spinner>
        <div className="mt-3">
          <h5 className="mb-2">{processingMessage || "Processing your order..."}</h5>
          <p className="text-muted mb-0">Please wait while we prepare your payment</p>
        </div>
      </Modal.Body>
    </Modal>
  );

  return (
    <>
      <Header />
      <ProcessingOverlay />

      <div className="address-selection-container mt-lg-5 pt-lg-5 page-title-main-name">
        {/* Stepper */}
        <div className="stepper-wrapper pt-lg-5 mt-lg-4 mt-5 pt-4">
          <div className="step step-active page-title-main-name">Cart</div>
          <div className="dividers"></div>
          <div className="step step-active page-title-main-name">Address</div>
          <div className="dividers"></div>
          <div className="step page-title-main-name">Payment</div>
        </div>

        <div className="main-content">
          {/* Left Column */}
          <div className="left-column">
            <h3 className="section-title page-title-main-name title-page-title">Select Delivery Address</h3>

            {!showForm ? (
              <div
                className="add-card"
                onClick={() => {
                  setNewAddress({
                    name: profile.name || "",
                    phone: profile.phone || "",
                    email: profile.email || "",
                    addressLine1: "",
                    city: "",
                    state: "",
                    pincode: "",
                  });
                  setShowForm(true);
                }}
              >
                <span className="add-card-icon">+</span>
                <p className="add-card-text">Add New Address</p>
              </div>
            ) : (
              <div className="form-card">
                <input
                  className="form-input page-title-main-name"
                  type="text"
                  placeholder="Full Name"
                  value={newAddress.name}
                  onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                />
                <input
                  className="form-input page-title-main-name"
                  type="text"
                  placeholder="Phone Number"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                />
                <input
                  className="form-input page-title-main-name"
                  type="email"
                  placeholder="Email"
                  value={newAddress.email}
                  onChange={(e) => setNewAddress({ ...newAddress, email: e.target.value })}
                />
                <textarea
                  className="form-input page-title-main-name textarea-input"
                  placeholder="Address Line"
                  value={newAddress.addressLine1}
                  onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                />
                <input
                  className="form-input page-title-main-name"
                  type="text"
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                />
                <input
                  className="form-input page-title-main-name"
                  type="text"
                  placeholder="State"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                />
                <input
                  className="form-input page-title-main-name"
                  type="text"
                  placeholder="Pincode"
                  value={newAddress.pincode}
                  onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                />
                <div className="button-group">
                  <button className="save-btn page-title-main-name" onClick={saveAddress} disabled={isProcessing}>
                    {isProcessing ? "Saving..." : (editingAddressId ? "Update" : "Save")}
                  </button>
                  <button
                    className="cancel-btn page-title-main-name"
                    onClick={() => {
                      setShowForm(false);
                      setEditingAddressId(null);
                    }}
                    disabled={isProcessing}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {addresses.map((addr) => (
              <div
                key={addr._id}
                className={`address-card ${selectedAddressId === addr._id ? 'address-card-selected' : ''}`}
              >
                <div
                  className="address-content"
                  onClick={() => {
                    setSelectedAddressId(addr._id);
                    setAddressError(""); // Clear error when an address is selected
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                    <strong className="address-name">{addr.name}</strong>
                    {selectedAddressId === addr._id && (
                      <span className="selected-badge">✓ Selected</span>
                    )}
                  </div>
                  <p className="address-info">
                    {addr.addressLine1}, {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <div className="address-contact">
                    <span>📱 {addr.phone || "-"}</span>
                    {addr.email && <span style={{ marginLeft: "15px" }}>✉️ {addr.email}</span>}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "5px", flexShrink: 0 }}>
                  <button className="edit-btn" onClick={() => editAddress(addr)} disabled={isProcessing}>
                    {isProcessing ? "..." : "Edit"}
                  </button>
                  <button className="delete-btn" onClick={() => deleteAddressHandler(addr._id)} disabled={isProcessing}>
                    {isProcessing ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="right-column">
            <h4 className="order-summary-title">
              Order Summary ({cartData.length} {cartData.length === 1 ? 'item' : 'items'})
            </h4>

            <div className="price-row">
              <span>Bag MRP:</span>
              <span>₹{formatCurrency(priceDetails.bagMrp)}</span>
            </div>

            {priceDetails.bagDiscount > 0 && (
              <div className="price-row">
                <span>Bag Discount:</span>
                <span className="discount-amount">-₹{formatCurrency(priceDetails.bagDiscount)}</span>
              </div>
            )}

            <div className="price-row">
              <span>Shipping:</span>
              <span>
                {priceDetails.shipping === 0 ? (
                  <span className="free-shipping">Free Shipping</span>
                ) : (
                  <>
                    ₹{formatCurrency(priceDetails.shipping)}
                    {priceDetails.shippingMessage && (
                      <span style={{ color: "#1976d2", fontSize: 12, marginLeft: 6 }}>
                        ({priceDetails.shippingMessage})
                      </span>
                    )}
                  </>
                )}
              </span>
            </div>

            {priceDetails.couponDiscount > 0 && (
              <div className="price-row">
                <span>Coupon Discount:</span>
                <span className="discount-amount">-₹{formatCurrency(priceDetails.couponDiscount)}</span>
              </div>
            )}

            <div className="price-row taxable-amount-row">
              <span>Taxable Amount:</span>
              <span>₹{formatCurrency(priceDetails.taxableAmount)}</span>
            </div>

            <div className="price-row">
              <span>GST ({priceDetails.gstRate || "0%"})</span>
              <span>+₹{formatCurrency(priceDetails.gstAmount)}</span>
            </div>

            {priceDetails.gstMessage && (
              <div className="gst-message">
                <span className="gst-note">💡 Note:</span> {priceDetails.gstMessage}
              </div>
            )}

            <hr className="section-divider" />

            <div className="price-row total-payable-row bg-white p-0">
              <span>Total Payable:</span>
              <span>₹{formatCurrency(priceDetails.payable)}</span>
            </div>

            {priceDetails.totalSavings > 0 && (
              <div className="savings-card m-0">
                {/* <div className="savings-amount">
                  🎉 You saved ₹{formatCurrency(priceDetails.totalSavings)}
                </div> */}
                {priceDetails.savingsMessage && (
                  <div className="savings-message m-0">
                    {priceDetails.savingsMessage}
                  </div>
                )}
              </div>
            )}

            {priceDetails.appliedCoupon?.code && (
              <div className="coupon-card">
                <span>
                  <strong>Applied Coupon:</strong> {priceDetails.appliedCoupon.code}
                  {priceDetails.appliedCoupon.discount && (
                    <span style={{ marginLeft: "10px" }}>- ₹{priceDetails.appliedCoupon.discount} off</span>
                  )}
                </span>
              </div>
            )}

            {/* Button is always clickable (disabled only during processing) */}
            <button
              className={`pay-btn ${isProcessing ? 'pay-btn-disabled' : ''}`}
              onClick={proceedToPayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Spinner
                    animation="border"
                    size="sm"
                    className="me-2"
                    style={{ width: '1rem', height: '1rem' }}
                  />
                  {processingMessage || "Processing..."}
                </>
              ) : (
                `Proceed to Pay ₹${formatCurrency(priceDetails.payable)}`
              )}
            </button>

            {/* Optional inline error message */}
            {addressError && (
              <div className="address-error-message">
                ⚠️ {addressError}
              </div>
            )}

            <div className="payment-note">
              <span className="secure-badge">✓</span>
              <span>GST Invoice Available • Secure Payment</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddressSelection;




//==============================================================Done-Code========================================================== 