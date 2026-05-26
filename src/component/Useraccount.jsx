// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const API_BASE = "https://beauty.joyory.com/api/user/profile";
// const RESET_PASSWORD_API = "https://beauty.joyory.com/api/security";

// const toInputDate = (value) => {
//   if (!value) return "";
//   if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
//   const dmy = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value);
//   if (dmy) return `${dmy[3]}-${dmy[2]}-${dmy[1]}`;
//   const mdy = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value);
//   if (mdy) {
//     const [, mm, dd, yyyy] = mdy;
//     return `${yyyy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
//   }
//   const d = new Date(value);
//   if (!isNaN(d)) return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
//   return "";
// };

// const Useraccount = () => {
//   const navigate = useNavigate();
//   const [profile, setProfile] = useState(null);
//   const [addresses, setAddresses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [imageFile, setImageFile] = useState(null);

//   // Phone OTP
//   const [otpSent, setOtpSent] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [newPhone, setNewPhone] = useState("");
//   const [otpMsg, setOtpMsg] = useState("");

//   // Address
//   const [addressForm, setAddressForm] = useState({ addressLine1: "", city: "", state: "", pincode: "" });
//   const [editingAddressId, setEditingAddressId] = useState(null);

//   // Reset password
//   const [activeSection, setActiveSection] = useState("profile");
//   const [resetEmail, setResetEmail] = useState("");
//   const [resetOtpSent, setResetOtpSent] = useState(false);
//   const [otpForReset, setOtpForReset] = useState("");
//   const [resetPasswordForm, setResetPasswordForm] = useState({ newPassword: "", confirmPassword: "" });
//   const [resetMsg, setResetMsg] = useState("");

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) return navigate("/login");
//     fetchUserProfile(token);
//   }, [navigate]);

//   useEffect(() => {
//     if (editMode) setNewPhone(formData.phone || "");
//   }, [editMode, formData.phone]);

//   const fetchUserProfile = async (token) => {
//     try {
//       const res = await fetch(API_BASE, { headers: { Authorization: `Bearer ${token}` } });
//       if (!res.ok) throw new Error("Failed to fetch profile");
//       const data = await res.json();
//       const mappedProfile = {
//         fullName: data?.profile?.fullName || "",
//         email: data?.profile?.email || "",
//         phone: data?.profile?.phone || "",
//         gender: data?.profile?.gender || "",
//         dob: toInputDate(data?.profile?.dob),
//         profileImage: data?.profile?.profileImage || "",
//       };
//       setProfile(mappedProfile);
//       setFormData(mappedProfile);
//       setAddresses(data.addresses || []);
//       localStorage.setItem("user", JSON.stringify(mappedProfile));
//     } catch (err) {
//       console.error(err);
//       setError("Unable to load profile.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
//   const handleImageChange = (e) => setImageFile(e.target.files[0]);
//   const handleAddressChange = (e) => setAddressForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

//   const readError = async (res) => {
//     let msg = `${res.status} ${res.statusText}`;
//     try {
//       const data = await res.json();
//       if (data?.message) msg = data.message;
//       else if (data?.error) msg = data.error;
//     } catch {}
//     return msg;
//   };

//   // --- Phone OTP ---
//   const handleSendOtp = async () => {
//     setOtpMsg("");
//     const token = localStorage.getItem("token");
//     if (!newPhone.trim()) return alert("Enter phone number");
//     try {
//       const patchRes = await fetch(API_BASE, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ phone: newPhone.trim() }),
//       });
//       if (!patchRes.ok) throw new Error(await readError(patchRes));
//       const res = await fetch(`${API_BASE}/send-otp`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ method: "phone" }),
//       });
//       if (!res.ok) throw new Error(await readError(res));
//       setOtpSent(true);
//       alert(`OTP sent to ${newPhone}`);
//     } catch (err) {
//       console.error(err);
//       alert(err.message || "Failed to send OTP");
//     }
//   };

//   const handleVerifyOtp = async () => {
//     const token = localStorage.getItem("token");
//     if (!otp.trim()) return alert("Enter OTP");
//     try {
//       const res = await fetch(`${API_BASE}/verify-otp`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ otp: otp.trim() }),
//       });
//       if (!res.ok) throw new Error(await readError(res));
//       alert("Phone verified!");
//       await fetchUserProfile(token);
//       setOtpSent(false);
//       setOtp("");
//       setNewPhone("");
//     } catch (err) {
//       console.error(err);
//       alert(err.message || "OTP verification failed");
//     }
//   };

//   // --- Profile save ---
//   const handleSave = async () => {
//     const token = localStorage.getItem("token");
//     try {
//       const res = await fetch(API_BASE, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({
//           fullName: formData.fullName,
//           email: formData.email,
//           gender: formData.gender,
//           dob: formData.dob,
//         }),
//       });
//       if (!res.ok) throw new Error(await readError(res));
//       const updated = await res.json();
//       setProfile(prev => ({ ...prev, ...formData, ...updated.profile }));
//       localStorage.setItem("user", JSON.stringify({ ...profile, ...formData, ...updated.profile }));

//       if (imageFile) {
//         const formDataImg = new FormData();
//         formDataImg.append("image", imageFile);
//         const resImg = await fetch(`${API_BASE}/avatar`, {
//           method: "POST",
//           headers: { Authorization: `Bearer ${token}` },
//           body: formDataImg,
//         });
//         if (!resImg.ok) throw new Error(await readError(resImg));
//         const imgData = await resImg.json();
//         setProfile(prev => ({ ...prev, profileImage: imgData.profileImage || prev.profileImage }));
//       }
//       setEditMode(false);
//     } catch (err) {
//       console.error(err);
//       alert(err.message || "Update failed");
//     }
//   };

//   // --- Address ---
//   const handleAddOrUpdateAddress = async () => {
//     const token = localStorage.getItem("token");
//     if (!addressForm.addressLine1 || !addressForm.city || !addressForm.state || !addressForm.pincode) {
//       return alert("Please fill all address fields.");
//     }
//     const url = editingAddressId ? `${API_BASE}/address/${editingAddressId}` : `${API_BASE}/address`;
//     const method = editingAddressId ? "PATCH" : "POST";
//     try {
//       const res = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify(addressForm),
//       });
//       if (!res.ok) throw new Error(await readError(res));
//       const updated = await res.json();
//       setAddresses(updated.addresses || []);
//       setAddressForm({ addressLine1: "", city: "", state: "", pincode: "" });
//       setEditingAddressId(null);
//     } catch (err) {
//       console.error(err);
//       alert(err.message || "Failed to save address.");
//     }
//   };

//   const handleEditAddress = (addr) => {
//     setAddressForm({ ...addr });
//     setEditingAddressId(addr._id);
//   };

//   const handleDeleteAddress = async (id) => {
//     const token = localStorage.getItem("token");
//     try {
//       const res = await fetch(`${API_BASE}/address/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(await readError(res));
//       const updated = await res.json();
//       setAddresses(updated.addresses || []);
//     } catch (err) {
//       console.error(err);
//       alert(err.message || "Failed to delete address.");
//     }
//   };

//   // --- Reset password ---
//   const handleSendResetOtp = async () => {
//     if (!resetEmail.trim()) return alert("Enter email first");
//     try {
//       const res = await fetch(`${RESET_PASSWORD_API}/send-otp`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: resetEmail.trim() }),
//       });
//       if (!res.ok) throw new Error((await res.json()).message || "Failed to send OTP");
//       alert("✅ OTP sent to your email");
//       setResetOtpSent(true);
//     } catch (err) {
//       console.error(err);
//       alert(err.message || "Failed to send OTP");
//     }
//   };



//   const handleResetPassword = async () => {
//   if (!otpForReset || !resetPasswordForm.newPassword || !resetPasswordForm.confirmPassword) {
//     return alert("Fill all fields");
//   }
//   if (resetPasswordForm.newPassword !== resetPasswordForm.confirmPassword) {
//     return alert("Passwords do not match");
//   }

//   try {
//     const res = await fetch("https://beauty.joyory.com/api/security/reset-password", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         email: resetEmail,
//         otp: otpForReset,
//         newPassword: resetPasswordForm.newPassword,
//         confirmPassword: resetPasswordForm.confirmPassword
//       }),
//     });

//     // parse JSON safely
//     const data = await res.json().catch(() => null);
//     if (!res.ok) throw new Error(data?.message || "Password reset failed");

//     alert("✅ Password reset successfully!");
//     setResetOtpSent(false);
//     setResetEmail("");
//     setOtpForReset("");
//     setResetPasswordForm({ newPassword: "", confirmPassword: "" });
//   } catch (err) {
//     console.error(err);
//     alert(err.message || "Something went wrong");
//   }
// };




//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   if (loading) return <p>⏳ Loading...</p>;
//   if (error) return <p style={{ color: "red" }}>{error}</p>;
//   if (!profile) return null;

//   return (
//     <div style={{ padding: "30px" }}>
//       <h2>👤 My Account</h2>

//       {/* Profile Card */}
//       <div style={{ display: "flex", gap: "20px", padding: "20px", border: "1px solid #ddd", borderRadius: "10px", alignItems: "center", marginBottom: "20px" }}>
//         <img src={profile.profileImage || "/default-avatar.png"} alt="Profile" style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover", border: "2px solid #ccc" }} onError={(e) => e.currentTarget.src = "/default-avatar.png"} />
//         <div style={{ flex: 1 }}>
//           {editMode ? (
//             <>
//               <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%", maxWidth: "300px" }} />
//               <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%", maxWidth: "300px" }} />

//               {!otpSent ? (
//                 <>
//                   <input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="Phone" style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%", maxWidth: "300px" }} />
//                   <button onClick={handleSendOtp} style={{ padding: "8px 16px", marginTop: "10px", background: "#FF9800", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>📧 Send OTP</button>
//                 </>
//               ) : (
//                 <>
//                   <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%", maxWidth: "300px" }} />
//                   <button onClick={handleVerifyOtp} style={{ padding: "8px 16px", marginTop: "10px", background: "#FF9800", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>✅ Verify OTP</button>
//                 </>
//               )}

//               <select name="gender" value={formData.gender} onChange={handleChange} style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%", maxWidth: "300px" }}>
//                 <option value="">Select Gender</option>
//                 <option value="male">Male</option>
//                 <option value="female">Female</option>
//               </select>
//               <input type="date" name="dob" value={formData.dob} onChange={handleChange} style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%", maxWidth: "300px" }} />
//               <input type="file" onChange={handleImageChange} />
//               <button onClick={handleSave} style={{ padding: "10px 20px", marginTop: "10px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>💾 Save</button>
//             </>
//           ) : (
//             <>
//               <h3>{profile.fullName}</h3>
//               <p><strong>Email:</strong> {profile.email}</p>
//               <p><strong>Phone:</strong> {profile.phone || "N/A"}</p>
//               <p><strong>Gender:</strong> {profile.gender || "N/A"}</p>
//               <p><strong>DOB:</strong> {profile.dob || "N/A"}</p>
//               <button onClick={() => setEditMode(true)} style={{ padding: "8px 16px", background: "#2196F3", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", marginTop: "10px" }}>✏ Edit</button>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Quick Links */}
//       <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
//         <button onClick={() => setActiveSection("profile")} style={{ padding: "10px 20px", background: "#eee", borderRadius: "8px", cursor: "pointer", border: "1px solid #ccc" }}>👤 Profile</button>
//         <button onClick={() => setActiveSection("address")} style={{ padding: "10px 20px", background: "#eee", borderRadius: "8px", cursor: "pointer", border: "1px solid #ccc" }}>🏠 Addresses</button>
//         <button onClick={() => setActiveSection("reset")} style={{ padding: "10px 20px", background: "#eee", borderRadius: "8px", cursor: "pointer", border: "1px solid #ccc" }}>🔑 Reset Password</button>
//       </div>

//       {/* Address Section */}
//       {activeSection === "address" && (
//         <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "10px", marginBottom: "20px" }}>
//           <h3>🏠 Saved Addresses</h3>
//           {addresses.length ? addresses.map(addr => (
//             <div key={addr._id} style={{ marginBottom: "10px" }}>
//               <p><strong>{addr.addressLine1}</strong>, {addr.city}, {addr.state} - {addr.pincode}</p>
//               <button onClick={() => handleEditAddress(addr)} style={{ padding: "6px 12px", background: "#2196F3", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", marginRight: "5px" }}>✏ Edit</button>
//               <button onClick={() => handleDeleteAddress(addr._id)} style={{ padding: "6px 12px", background: "#f44336", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>🗑 Delete</button>
//             </div>
//           )) : <p>No addresses saved.</p>}

//           <h4>{editingAddressId ? "✏ Edit Address" : "➕ Add Address"}</h4>
//           <input name="addressLine1" placeholder="Address" value={addressForm.addressLine1} onChange={handleAddressChange} style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%", maxWidth: "400px" }} />
//           <input name="city" placeholder="City" value={addressForm.city} onChange={handleAddressChange} style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%", maxWidth: "400px" }} />
//           <input name="state" placeholder="State" value={addressForm.state} onChange={handleAddressChange} style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%", maxWidth: "400px" }} />
//           <input name="pincode" placeholder="Pincode" value={addressForm.pincode} onChange={handleAddressChange} style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%", maxWidth: "400px" }} />
//           <button onClick={handleAddOrUpdateAddress} style={{ padding: "8px 16px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>{editingAddressId ? "💾 Update" : "➕ Add"}</button>
//         </div>
//       )}

//       {/* Reset Password Section */}
//       {activeSection === "reset" && (
//         <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "10px", marginBottom: "20px" }}>
//           <h3>🔑 Reset Password</h3>
//           {!resetOtpSent ? (
//             <>
//               <input type="email" placeholder="Email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%", maxWidth: "300px" }} />
//               <button onClick={handleSendResetOtp} style={{ padding: "8px 16px", background: "#FF9800", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>📧 Send OTP</button>
//             </>
//           ) : (
//             <>
//               <input type="text" placeholder="OTP" value={otpForReset} onChange={(e) => setOtpForReset(e.target.value)} style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%", maxWidth: "300px" }} />
//               <input type="password" placeholder="New Password" value={resetPasswordForm.newPassword} onChange={(e) => setResetPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))} style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%", maxWidth: "300px" }} />
//               <input type="password" placeholder="Confirm Password" value={resetPasswordForm.confirmPassword} onChange={(e) => setResetPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))} style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%", maxWidth: "300px" }} />
//               <button onClick={handleResetPassword} style={{ padding: "8px 16px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>✅ Reset Password</button>
//             </>
//           )}
//         </div>
//       )}

//       <button onClick={handleLogout} style={{ padding: "10px 20px", background: "#f44336", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>🚪 Logout</button>
//     </div>
//   );
// };

// export default Useraccount;



















// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const API_BASE = "https://beauty.joyory.com/api/user/profile";
// const RESET_PASSWORD_API = "https://beauty.joyory.com/api/security";
// const ORDERS_API = "https://beauty.joyory.com/api/user/cart/orders";

// const toInputDate = (value) => {
//   if (!value) return "";
//   if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
//   const dmy = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value);
//   if (dmy) return `${dmy[3]}-${dmy[2]}-${dmy[1]}`;
//   const mdy = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value);
//   if (mdy) {
//     const [, mm, dd, yyyy] = mdy;
//     return `${yyyy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
//   }
//   const d = new Date(value);
//   if (!isNaN(d)) return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
//   return "";
// };

// const Useraccount = () => {
//   const navigate = useNavigate();
//   const [profile, setProfile] = useState(null);
//   const [addresses, setAddresses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [imageFile, setImageFile] = useState(null);

//   // Phone OTP
//   const [otpSent, setOtpSent] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [newPhone, setNewPhone] = useState("");
//   const [otpMsg, setOtpMsg] = useState("");

//   // Address
//   const [addressForm, setAddressForm] = useState({ addressLine1: "", city: "", state: "", pincode: "" });
//   const [editingAddressId, setEditingAddressId] = useState(null);

//   // Reset password
//   const [activeSection, setActiveSection] = useState("profile");
//   const [resetEmail, setResetEmail] = useState("");
//   const [resetOtpSent, setResetOtpSent] = useState(false);
//   const [otpForReset, setOtpForReset] = useState("");
//   const [resetPasswordForm, setResetPasswordForm] = useState({ newPassword: "", confirmPassword: "" });
//   const [resetMsg, setResetMsg] = useState("");

//   // Orders
//   const [orders, setOrders] = useState([]);
//   const [ordersLoading, setOrdersLoading] = useState(false);
//   const [ordersError, setOrdersError] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) return navigate("/login");
//     fetchUserProfile(token);
//   }, [navigate]);

//   useEffect(() => {
//     if (editMode) setNewPhone(formData.phone || "");
//   }, [editMode, formData.phone]);

//   const fetchUserProfile = async (token) => {
//     try {
//       const res = await fetch(API_BASE, { headers: { Authorization: `Bearer ${token}` } });
//       if (!res.ok) throw new Error("Failed to fetch profile");
//       const data = await res.json();
//       const mappedProfile = {
//         fullName: data?.profile?.fullName || "",
//         email: data?.profile?.email || "",
//         phone: data?.profile?.phone || "",
//         gender: data?.profile?.gender || "",
//         dob: toInputDate(data?.profile?.dob),
//         profileImage: data?.profile?.profileImage || "",
//       };
//       setProfile(mappedProfile);
//       setFormData(mappedProfile);
//       setAddresses(data.addresses || []);
//       localStorage.setItem("user", JSON.stringify(mappedProfile));
//     } catch (err) {
//       console.error(err);
//       setError("Unable to load profile.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
//   const handleImageChange = (e) => setImageFile(e.target.files[0]);
//   const handleAddressChange = (e) => setAddressForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

//   const readError = async (res) => {
//     let msg = `${res.status} ${res.statusText}`;
//     try {
//       const data = await res.json();
//       if (data?.message) msg = data.message;
//       else if (data?.error) msg = data.error;
//     } catch { }
//     return msg;
//   };

//   // --- Phone OTP ---
//   // const handleSendOtp = async () => {
//   //   setOtpMsg("");
//   //   const token = localStorage.getItem("token");
//   //   if (!newPhone.trim()) return alert("Enter phone number");
//   //   try {
//   //     const patchRes = await fetch(API_BASE, {
//   //       method: "PATCH",
//   //       headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//   //       body: JSON.stringify({ phone: newPhone.trim() }),
//   //     });
//   //     if (!patchRes.ok) throw new Error(await readError(patchRes));
//   //     const res = await fetch(`${API_BASE}/send-otp`, {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//   //       body: JSON.stringify({ method: "phone" }),
//   //     });
//   //     if (!res.ok) throw new Error(await readError(res));
//   //     setOtpSent(true);
//   //     alert(`OTP sent to ${newPhone}`);
//   //   } catch (err) {
//   //     console.error(err);
//   //     alert(err.message || "Failed to send OTP");
//   //   }
//   // };

//   // const handleVerifyOtp = async () => {
//   //   const token = localStorage.getItem("token");
//   //   if (!otp.trim()) return alert("Enter OTP");
//   //   try {
//   //     const res = await fetch(`${API_BASE}/verify-otp`, {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//   //       body: JSON.stringify({ otp: otp.trim() }),
//   //     });
//   //     if (!res.ok) throw new Error(await readError(res));
//   //     alert("Phone verified!");
//   //     await fetchUserProfile(token);
//   //     setOtpSent(false);
//   //     setOtp("");
//   //     setNewPhone("");
//   //   } catch (err) {
//   //     console.error(err);
//   //     alert(err.message || "OTP verification failed");
//   //   }
//   // };



//   // --- Phone OTP ---
//   const handleSendOtp = async () => {
//     setOtpMsg("");
//     const token = localStorage.getItem("token");
//     if (!newPhone.trim()) return alert("Enter phone number");

//     try {
//       // ✅ Step 1: Update phone temporarily (not verified yet)
//       const patchRes = await fetch(API_BASE, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ phone: newPhone.trim() }),
//       });
//       if (!patchRes.ok) throw new Error(await readError(patchRes));

//       // ✅ Step 2: Request OTP for phone
//       const res = await fetch(`${RESET_PASSWORD_API}/send-otp`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           method: "phone",
//           phone: newPhone.trim(), // ensure backend knows the target phone
//         }),
//       });

//       if (!res.ok) throw new Error(await readError(res));

//       setOtpSent(true);
//       alert(`✅ OTP sent to ${newPhone}`);
//     } catch (err) {
//       console.error(err);
//       alert(err.message || "❌ Failed to send SMS OTP");
//     }
//   };

//   const handleVerifyOtp = async () => {
//     const token = localStorage.getItem("token");
//     if (!otp.trim()) return alert("Enter OTP");

//     try {
//       const res = await fetch(`${RESET_PASSWORD_API}/verify-otp`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ otp: otp.trim(), method: "phone" }),
//       });

//       if (!res.ok) throw new Error(await readError(res));

//       alert("🎉 Phone verified successfully!");
//       await fetchUserProfile(token);
//       setOtpSent(false);
//       setOtp("");
//       setNewPhone("");
//     } catch (err) {
//       console.error(err);
//       alert(err.message || "❌ OTP verification failed");
//     }
//   };


//   // --- Profile save ---
//   const handleSave = async () => {
//     const token = localStorage.getItem("token");
//     try {
//       const res = await fetch(API_BASE, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({
//           fullName: formData.fullName,
//           email: formData.email,
//           gender: formData.gender,
//           dob: formData.dob,
//         }),
//       });
//       if (!res.ok) throw new Error(await readError(res));
//       const updated = await res.json();
//       setProfile(prev => ({ ...prev, ...formData, ...updated.profile }));
//       localStorage.setItem("user", JSON.stringify({ ...profile, ...formData, ...updated.profile }));

//       if (imageFile) {
//         const formDataImg = new FormData();
//         formDataImg.append("image", imageFile);
//         const resImg = await fetch(`${API_BASE}/avatar`, {
//           method: "POST",
//           headers: { Authorization: `Bearer ${token}` },
//           body: formDataImg,
//         });
//         if (!resImg.ok) throw new Error(await readError(resImg));
//         const imgData = await resImg.json();
//         setProfile(prev => ({ ...prev, profileImage: imgData.profileImage || prev.profileImage }));
//       }
//       setEditMode(false);
//     } catch (err) {
//       console.error(err);
//       alert(err.message || "Update failed");
//     }
//   };

//   // --- Address ---
//   const handleAddOrUpdateAddress = async () => {
//     const token = localStorage.getItem("token");
//     if (!addressForm.addressLine1 || !addressForm.city || !addressForm.state || !addressForm.pincode) {
//       return alert("Please fill all address fields.");
//     }
//     const url = editingAddressId ? `${API_BASE}/address/${editingAddressId}` : `${API_BASE}/address`;
//     const method = editingAddressId ? "PATCH" : "POST";
//     try {
//       const res = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify(addressForm),
//       });
//       if (!res.ok) throw new Error(await readError(res));
//       const updated = await res.json();
//       setAddresses(updated.addresses || []);
//       setAddressForm({ addressLine1: "", city: "", state: "", pincode: "" });
//       setEditingAddressId(null);
//     } catch (err) {
//       console.error(err);
//       alert(err.message || "Failed to save address.");
//     }
//   };

//   const handleEditAddress = (addr) => {
//     setAddressForm({ ...addr });
//     setEditingAddressId(addr._id);
//   };

//   const handleDeleteAddress = async (id) => {
//     const token = localStorage.getItem("token");
//     try {
//       const res = await fetch(`${API_BASE}/address/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(await readError(res));
//       const updated = await res.json();
//       setAddresses(updated.addresses || []);
//     } catch (err) {
//       console.error(err);
//       alert(err.message || "Failed to delete address.");
//     }
//   };

//   // --- Reset password ---
//   const handleSendResetOtp = async () => {
//     if (!resetEmail.trim()) return alert("Enter email first");
//     try {
//       const res = await fetch(`${RESET_PASSWORD_API}/send-otp`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: resetEmail.trim() }),
//       });
//       if (!res.ok) throw new Error((await res.json()).message || "Failed to send OTP");
//       alert("✅ OTP sent to your email");
//       setResetOtpSent(true);
//     } catch (err) {
//       console.error(err);
//       alert(err.message || "Failed to send OTP");
//     }
//   };

//   const handleResetPassword = async () => {
//     if (!otpForReset || !resetPasswordForm.newPassword || !resetPasswordForm.confirmPassword) {
//       return alert("Fill all fields");
//     }
//     if (resetPasswordForm.newPassword !== resetPasswordForm.confirmPassword) {
//       return alert("Passwords do not match");
//     }

//     try {
//       const res = await fetch(`${RESET_PASSWORD_API}/reset-password`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: resetEmail,
//           otp: otpForReset,
//           newPassword: resetPasswordForm.newPassword,
//           confirmPassword: resetPasswordForm.confirmPassword,
//         }),
//       });

//       const data = await res.json().catch(() => null);
//       if (!res.ok) throw new Error(data?.message || "Password reset failed");

//       alert("✅ Password reset successfully!");
//       setResetOtpSent(false);
//       setResetEmail("");
//       setOtpForReset("");
//       setResetPasswordForm({ newPassword: "", confirmPassword: "" });
//     } catch (err) {
//       console.error(err);
//       alert(err.message || "Something went wrong");
//     }
//   };

//   // --- Orders ---
//   const fetchOrders = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return alert("Please login");
//     setOrdersLoading(true);
//     setOrdersError(null);

//     try {
//       const res = await fetch(ORDERS_API, { headers: { Authorization: `Bearer ${token}` } });
//       if (!res.ok) throw new Error(`Failed to fetch orders: ${res.status}`);
//       const data = await res.json();
//       setOrders(data.orders || []);
//     } catch (err) {
//       console.error(err);
//       setOrdersError(err.message || "Something went wrong");
//     } finally {
//       setOrdersLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   if (loading) return <p>⏳ Loading...</p>;
//   if (error) return <p style={{ color: "red" }}>{error}</p>;
//   if (!profile) return null;

//   return (
//     <div style={{ padding: "30px" }}>
//       <h2>👤 My Account</h2>

//       {/* Profile Card */}
//       <div style={{ display: "flex", gap: "20px", padding: "20px", border: "1px solid #ddd", borderRadius: "10px", alignItems: "center", marginBottom: "20px" }}>
//         <img src={profile.profileImage || "/default-avatar.png"} alt="Profile" style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover", border: "2px solid #ccc" }} onError={(e) => e.currentTarget.src = "/default-avatar.png"} />
//         <div style={{ flex: 1 }}>
//           {editMode ? (
//             <>
//               <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%", maxWidth: "300px" }} />
//               <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%", maxWidth: "300px" }} />

//               {!otpSent ? (
//                 <>
//                   <input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="Phone" style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%", maxWidth: "300px" }} />
//                   <button onClick={handleSendOtp} style={{ padding: "8px 16px", marginTop: "10px", background: "#FF9800", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>📧 Send OTP</button>
//                 </>
//               ) : (
//                 <>
//                   <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%", maxWidth: "300px" }} />
//                   <button onClick={handleVerifyOtp} style={{ padding: "8px 16px", marginTop: "10px", background: "#FF9800", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>✅ Verify OTP</button>
//                 </>
//               )}

//               <select name="gender" value={formData.gender} onChange={handleChange} style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%", maxWidth: "300px" }}>
//                 <option value="">Select Gender</option>
//                 <option value="male">Male</option>
//                 <option value="female">Female</option>
//               </select>
//               <input type="date" name="dob" value={formData.dob} onChange={handleChange} style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%", maxWidth: "300px" }} />
//               <input type="file" onChange={handleImageChange} />
//               <button onClick={handleSave} style={{ padding: "10px 20px", marginTop: "10px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>💾 Save</button>
//             </>
//           ) : (
//             <>
//               <h3>{profile.fullName}</h3>
//               <p><strong>Email:</strong> {profile.email}</p>
//               <p><strong>Phone:</strong> {profile.phone || "N/A"}</p>
//               <p><strong>Gender:</strong> {profile.gender || "N/A"}</p>
//               <p><strong>DOB:</strong> {profile.dob || "N/A"}</p>
//               <button onClick={() => setEditMode(true)} style={{ padding: "8px 16px", background: "#2196F3", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", marginTop: "10px" }}>✏ Edit</button>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Quick Links */}
//       <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
//         {/* <button onClick={() => setActiveSection("profile")} style={{ padding: "10px 20px", background: "#eee", borderRadius: "8px", cursor: "pointer", border: "1px solid #ccc" }}>👤 Profile</button> */}
//         <button onClick={() => setActiveSection("address")} style={{ padding: "10px 20px", background: "#eee", borderRadius: "8px", cursor: "pointer", border: "1px solid #ccc" }}>🏠 Addresses</button>
//         <button onClick={() => setActiveSection("reset")} style={{ padding: "10px 20px", background: "#eee", borderRadius: "8px", cursor: "pointer", border: "1px solid #ccc" }}>🔑 Reset Password</button>
//         <button
//           onClick={() => navigate("/Myorders")}
//           style={{
//             padding: "10px 20px",
//             background: "#eee",
//             borderRadius: "8px",
//             cursor: "pointer",
//             border: "1px solid #ccc"
//           }}
//         >
//           🛒 My Orders
//         </button>      </div>

//       {/* Section */}
//       <div>
//         {/* Address Section */}
//         {activeSection === "address" && (
//           <div>
//             <h3>🏠 My Addresses</h3>
//             <div style={{ marginBottom: "20px" }}>
//               <input name="addressLine1" placeholder="Address Line 1" value={addressForm.addressLine1} onChange={handleAddressChange} />
//               <input name="city" placeholder="City" value={addressForm.city} onChange={handleAddressChange} />
//               <input name="state" placeholder="State" value={addressForm.state} onChange={handleAddressChange} />
//               <input name="pincode" placeholder="Pincode" value={addressForm.pincode} onChange={handleAddressChange} />
//               <button onClick={handleAddOrUpdateAddress}>{editingAddressId ? "Update" : "Add"} Address</button>
//             </div>
//             {addresses.length === 0 ? <p>No addresses found.</p> :
//               addresses.map(addr => (
//                 <div key={addr._id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px", borderRadius: "5px" }}>
//                   <p>{addr.addressLine1}, {addr.city}, {addr.state} - {addr.pincode}</p>
//                   <button onClick={() => handleEditAddress(addr)}>✏ Edit</button>
//                   <button onClick={() => handleDeleteAddress(addr._id)}>🗑 Delete</button>
//                 </div>
//               ))}
//           </div>
//         )}

//         {/* Reset Password Section */}
//         {activeSection === "reset" && (
//           <div>
//             <h3>🔑 Reset Password</h3>
//             {!resetOtpSent ? (
//               <>
//                 <input placeholder="Email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
//                 <button onClick={handleSendResetOtp}>📧 Send OTP</button>
//               </>
//             ) : (
//               <>
//                 <input placeholder="OTP" value={otpForReset} onChange={(e) => setOtpForReset(e.target.value)} />
//                 <input type="password" placeholder="New Password" value={resetPasswordForm.newPassword} onChange={(e) => setResetPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))} />
//                 <input type="password" placeholder="Confirm Password" value={resetPasswordForm.confirmPassword} onChange={(e) => setResetPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))} />
//                 <button onClick={handleResetPassword}>✅ Reset Password</button>
//               </>
//             )}
//           </div>
//         )}

//         {/* Orders Section */}
//         {activeSection === "orders" && (
//           <div>
//             <h3>🛒 My Orders</h3>
//             {ordersLoading && <p>⏳ Loading orders...</p>}
//             {ordersError && <p style={{ color: "red" }}>{ordersError}</p>}
//             {!ordersLoading && !ordersError && orders.length === 0 && <p>No orders found.</p>}
//             {!ordersLoading && !ordersError && orders.length > 0 && (
//               <ul>
//                 {orders.map(order => (
//                   <li key={order._id} style={{ marginBottom: "10px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
//                     <p><strong>Order ID:</strong> {order._id}</p>
//                     <p><strong>Status:</strong> {order.status}</p>
//                     <p><strong>Total:</strong> ₹{order.total}</p>
//                     <p><strong>Items:</strong> {order.items.map(item => `${item.name} x${item.quantity}`).join(", ")}</p>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         )}
//       </div>
//       <button onClick={handleLogout} style={{ padding: "10px 20px", background: "#f44336", color: "#fff", borderRadius: "8px", cursor: "pointer", border: "none" }}>🚪 Logout</button>

//     </div>
//   );
// };

// export default Useraccount;




















































// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../css/Useraccount.css"; // <-- new css file

// const API_BASE = "https://beauty.joyory.com/api/user/profile";
// const RESET_PASSWORD_API = "https://beauty.joyory.com/api/security";
// const ORDERS_API = "https://beauty.joyory.com/api/user/cart/orders";

// const toInputDate = (value) => {
//   if (!value) return "";
//   if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
//   const dmy = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value);
//   if (dmy) return `${dmy[3]}-${dmy[2]}-${dmy[1]}`;
//   const mdy = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value);
//   if (mdy) {
//     const [, mm, dd, yyyy] = mdy;
//     return `${yyyy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
//   }
//   const d = new Date(value);
//   if (!isNaN(d)) return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
//   return "";
// };

// const Useraccount = () => {
//   const navigate = useNavigate();
//   const [profile, setProfile] = useState(null);
//   const [addresses, setAddresses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [imageFile, setImageFile] = useState(null);

//   // Phone OTP
//   const [otpSent, setOtpSent] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [newPhone, setNewPhone] = useState("");
//   const [otpMsg, setOtpMsg] = useState("");

//   // Address
//   const [addressForm, setAddressForm] = useState({ addressLine1: "", city: "", state: "", pincode: "" });
//   const [editingAddressId, setEditingAddressId] = useState(null);

//   // Reset password
//   const [activeSection, setActiveSection] = useState("profile");
//   const [resetEmail, setResetEmail] = useState("");
//   const [resetOtpSent, setResetOtpSent] = useState(false);
//   const [otpForReset, setOtpForReset] = useState("");
//   const [resetPasswordForm, setResetPasswordForm] = useState({ newPassword: "", confirmPassword: "" });
//   const [resetMsg, setResetMsg] = useState("");

//   // Orders
//   const [orders, setOrders] = useState([]);
//   const [ordersLoading, setOrdersLoading] = useState(false);
//   const [ordersError, setOrdersError] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) return navigate("/login");
//     fetchUserProfile(token);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [navigate]);

//   useEffect(() => {
//     if (editMode) setNewPhone(formData.phone || "");
//   }, [editMode, formData.phone]);

//   const fetchUserProfile = async (token) => {
//     try {
//       const res = await fetch(API_BASE, { headers: { Authorization: `Bearer ${token}` } });
//       if (!res.ok) throw new Error("Failed to fetch profile");
//       const data = await res.json();
//       const mappedProfile = {
//         fullName: data?.profile?.fullName || "",
//         email: data?.profile?.email || "",
//         phone: data?.profile?.phone || "",
//         gender: data?.profile?.gender || "",
//         dob: toInputDate(data?.profile?.dob),
//         profileImage: data?.profile?.profileImage || "",
//       };
//       setProfile(mappedProfile);
//       setFormData(mappedProfile);
//       setAddresses(data.addresses || []);
//       localStorage.setItem("user", JSON.stringify(mappedProfile));
//     } catch (err) {
//       console.error(err);
//       setError("Unable to load profile.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
//   const handleImageChange = (e) => setImageFile(e.target.files[0]);
//   const handleAddressChange = (e) => setAddressForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

//   const readError = async (res) => {
//     let msg = `${res.status} ${res.statusText}`;
//     try {
//       const data = await res.json();
//       if (data?.message) msg = data.message;
//       else if (data?.error) msg = data.error;
//     } catch { }
//     return msg;
//   };

//   // --- Phone OTP ---
//   const handleSendOtp = async () => {
//     setOtpMsg("");
//     const token = localStorage.getItem("token");
//     if (!newPhone.trim()) return alert("Enter phone number");

//     try {
//       // Update phone temporarily
//       const patchRes = await fetch(API_BASE, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ phone: newPhone.trim() }),
//       });
//       if (!patchRes.ok) throw new Error(await readError(patchRes));

//       // Request OTP
//       const res = await fetch(`${RESET_PASSWORD_API}/send-otp`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           method: "phone",
//           phone: newPhone.trim(),
//         }),
//       });

//       if (!res.ok) throw new Error(await readError(res));

//       setOtpSent(true);
//       alert(`✅ OTP sent to ${newPhone}`);
//     } catch (err) {
//       console.error(err);
//       alert(err.message || "❌ Failed to send SMS OTP");
//     }
//   };

//   const handleVerifyOtp = async () => {
//     const token = localStorage.getItem("token");
//     if (!otp.trim()) return alert("Enter OTP");

//     try {
//       const res = await fetch(`${RESET_PASSWORD_API}/verify-otp`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ otp: otp.trim(), method: "phone" }),
//       });

//       if (!res.ok) throw new Error(await readError(res));

//       alert("🎉 Phone verified successfully!");
//       await fetchUserProfile(token);
//       setOtpSent(false);
//       setOtp("");
//       setNewPhone("");
//     } catch (err) {
//       console.error(err);
//       alert(err.message || "❌ OTP verification failed");
//     }
//   };

//   // --- Profile save ---
//   const handleSave = async () => {
//     const token = localStorage.getItem("token");
//     try {
//       const res = await fetch(API_BASE, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({
//           fullName: formData.fullName,
//           email: formData.email,
//           gender: formData.gender,
//           dob: formData.dob,
//         }),
//       });
//       if (!res.ok) throw new Error(await readError(res));
//       const updated = await res.json();
//       setProfile(prev => ({ ...prev, ...formData, ...updated.profile }));
//       localStorage.setItem("user", JSON.stringify({ ...profile, ...formData, ...updated.profile }));

//       if (imageFile) {
//         const formDataImg = new FormData();
//         formDataImg.append("image", imageFile);
//         const resImg = await fetch(`${API_BASE}/avatar`, {
//           method: "POST",
//           headers: { Authorization: `Bearer ${token}` },
//           body: formDataImg,
//         });
//         if (!resImg.ok) throw new Error(await readError(resImg));
//         const imgData = await resImg.json();
//         setProfile(prev => ({ ...prev, profileImage: imgData.profileImage || prev.profileImage }));
//       }
//       setEditMode(false);
//     } catch (err) {
//       console.error(err);
//       alert(err.message || "Update failed");
//     }
//   };

//   // --- Address ---
//   const handleAddOrUpdateAddress = async () => {
//     const token = localStorage.getItem("token");
//     if (!addressForm.addressLine1 || !addressForm.city || !addressForm.state || !addressForm.pincode) {
//       return alert("Please fill all address fields.");
//     }
//     const url = editingAddressId ? `${API_BASE}/address/${editingAddressId}` : `${API_BASE}/address`;
//     const method = editingAddressId ? "PATCH" : "POST";
//     try {
//       const res = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify(addressForm),
//       });
//       if (!res.ok) throw new Error(await readError(res));
//       const updated = await res.json();
//       setAddresses(updated.addresses || []);
//       setAddressForm({ addressLine1: "", city: "", state: "", pincode: "" });
//       setEditingAddressId(null);
//     } catch (err) {
//       console.error(err);
//       alert(err.message || "Failed to save address.");
//     }
//   };

//   const handleEditAddress = (addr) => {
//     setAddressForm({ ...addr });
//     setEditingAddressId(addr._id);
//   };

//   const handleDeleteAddress = async (id) => {
//     const token = localStorage.getItem("token");
//     try {
//       const res = await fetch(`${API_BASE}/address/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(await readError(res));
//       const updated = await res.json();
//       setAddresses(updated.addresses || []);
//     } catch (err) {
//       console.error(err);
//       alert(err.message || "Failed to delete address.");
//     }
//   };

//   // --- Reset password ---
//   const handleSendResetOtp = async () => {
//     if (!resetEmail.trim()) return alert("Enter email first");
//     try {
//       const res = await fetch(`${RESET_PASSWORD_API}/send-otp`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: resetEmail.trim() }),
//       });
//       if (!res.ok) throw new Error((await res.json()).message || "Failed to send OTP");
//       alert("✅ OTP sent to your email");
//       setResetOtpSent(true);
//     } catch (err) {
//       console.error(err);
//       alert(err.message || "Failed to send OTP");
//     }
//   };

//   const handleResetPassword = async () => {
//     if (!otpForReset || !resetPasswordForm.newPassword || !resetPasswordForm.confirmPassword) {
//       return alert("Fill all fields");
//     }
//     if (resetPasswordForm.newPassword !== resetPasswordForm.confirmPassword) {
//       return alert("Passwords do not match");
//     }

//     try {
//       const res = await fetch(`${RESET_PASSWORD_API}/reset-password`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: resetEmail,
//           otp: otpForReset,
//           newPassword: resetPasswordForm.newPassword,
//           confirmPassword: resetPasswordForm.confirmPassword,
//         }),
//       });

//       const data = await res.json().catch(() => null);
//       if (!res.ok) throw new Error(data?.message || "Password reset failed");

//       alert("✅ Password reset successfully!");
//       setResetOtpSent(false);
//       setResetEmail("");
//       setOtpForReset("");
//       setResetPasswordForm({ newPassword: "", confirmPassword: "" });
//     } catch (err) {
//       console.error(err);
//       alert(err.message || "Something went wrong");
//     }
//   };

//   // --- Orders ---
//   const fetchOrders = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return alert("Please login");
//     setOrdersLoading(true);
//     setOrdersError(null);

//     try {
//       const res = await fetch(ORDERS_API, { headers: { Authorization: `Bearer ${token}` } });
//       if (!res.ok) throw new Error(`Failed to fetch orders: ${res.status}`);
//       const data = await res.json();
//       setOrders(data.orders || []);
//     } catch (err) {
//       console.error(err);
//       setOrdersError(err.message || "Something went wrong");
//     } finally {
//       setOrdersLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   if (loading) return (
//     <div className="ua-loading">
//       <div className="ua-spinner" />
//     </div>
//   );
//   if (error) return <p className="ua-error">{error}</p>;
//   if (!profile) return null;

//   return (
//     <div className="ua-page">
//       {/* Sidebar */}
//       <aside className="ua-sidebar">
//         <ul>
//           <li className={activeSection === "orders" ? "active" : ""} onClick={() => { setActiveSection("orders"); fetchOrders(); }}>
//             <span className="ua-icon">🧾</span> Orders
//           </li>
//           <li className={activeSection === "profile" ? "active" : ""} onClick={() => setActiveSection("profile")}>
//             <span className="ua-icon">👤</span> Profile
//           </li>
//           <li className={activeSection === "wishlist" ? "active" : ""} onClick={() => setActiveSection("wishlist")}>
//             <span className="ua-icon">♥️</span> Wishlist
//           </li>
//           <li onClick={() => { setActiveSection("refer"); }}>
//             <span className="ua-icon">🎁</span> Refer & Earn
//           </li>
//           <li onClick={() => { setActiveSection("wallet"); }}>
//             <span className="ua-icon">👛</span> Joyory Wallet
//           </li>
//           <li onClick={() => { setActiveSection("help"); }}>
//             <span className="ua-icon">❓</span> Help & FAQs
//           </li>
//           <li onClick={() => { setActiveSection("sell"); }}>
//             <span className="ua-icon">🏬</span> Sell on Joyory
//           </li>
//           <li onClick={handleLogout}>
//             <span className="ua-icon">⎋</span> Logout
//           </li>
//         </ul>
//       </aside>

//       {/* Main content */}
//       <main className="ua-content">
//         {activeSection === "profile" && (
//           <section className="ua-card">
//             <h3 className="ua-title">Personal Details</h3>

//             {/* Avatar */}
//             <div className="ua-avatar-row">
//               <div className="ua-avatar">
//                 <img
//                   src={profile.profileImage || "/default-avatar.png"}
//                   alt="avatar"
//                   onError={(e) => e.currentTarget.src = "/default-avatar.png"}
//                 />
//                 <label className="ua-avatar-edit">
//                   <input type="file" onChange={handleImageChange} />
//                   ✎
//                 </label>
//               </div>
//             </div>

//             {/* Gender */}
//             <div className="ua-field-group">
//               <label className="ua-label">Gender</label>
//               <div className="ua-gender">
//                 <button
//                   type="button"
//                   className={formData.gender === "female" ? "active" : ""}
//                   onClick={() => setFormData(prev => ({ ...prev, gender: "female" }))}
//                 >
//                   Female
//                 </button>
//                 <button
//                   type="button"
//                   className={formData.gender === "male" ? "active" : ""}
//                   onClick={() => setFormData(prev => ({ ...prev, gender: "male" }))}
//                 >
//                   Male
//                 </button>
//                 <button
//                   type="button"
//                   className={formData.gender === "non-binary" ? "active" : ""}
//                   onClick={() => setFormData(prev => ({ ...prev, gender: "non-binary" }))}
//                 >
//                   Non Binary
//                 </button>
//                 <button
//                   type="button"
//                   className={formData.gender === "prefer-not" ? "active" : ""}
//                   onClick={() => setFormData(prev => ({ ...prev, gender: "prefer-not" }))}
//                 >
//                   Prefer not to say
//                 </button>
//               </div>
//             </div>

//             {/* Profile Form */}
//             <form
//               className="ua-form"
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 handleSave();
//               }}
//             >
//               <div className="ua-row">
//                 <div className="ua-field">
//                   <label className="ua-label">Full name</label>
//                   <input name="fullName" value={formData.fullName || ""} onChange={handleChange} placeholder="Full name" />
//                 </div>

//                 <div className="ua-field">
//                   <label className="ua-label">Email ID</label>
//                   <input name="email" value={formData.email || ""} onChange={handleChange} placeholder="Email" />
//                 </div>

//                 <div className="ua-field">
//                   <label className="ua-label">Phone Number</label>
//                   {!editMode ? (
//                     <input value={formData.phone || "N/A"} readOnly />
//                   ) : (
//                     <>
//                       {!otpSent ? (
//                         <div className="ua-otp-row">
//                           <input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="Enter new phone" />
//                           <button type="button" className="ua-btn orange" onClick={handleSendOtp}>Send OTP</button>
//                         </div>
//                       ) : (
//                         <div className="ua-otp-row">
//                           <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
//                           <button type="button" className="ua-btn orange" onClick={handleVerifyOtp}>Verify</button>
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </div>

//                 <div className="ua-field">
//                   <label className="ua-label">Birth Date</label>
//                   <input type="date" name="dob" value={formData.dob || ""} onChange={handleChange} />
//                 </div>

//                 <div className="ua-field ua-field-full">
//                   <label className="ua-label">Address</label>
//                   <textarea rows="3" value={addresses[0]?.addressLine1 || ""} readOnly />
//                   <div className="ua-address-actions">
//                     <button type="button" className="ua-link" onClick={() => setActiveSection("address")}>+ Add new Address</button>
//                     {addresses[0] && (
//                       <>
//                         <button type="button" className="ua-link" onClick={() => handleEditAddress(addresses[0])}>✎ Edit</button>
//                         <button type="button" className="ua-link remove" onClick={() => handleDeleteAddress(addresses[0]._id)}>🗑 Remove</button>
//                       </>
//                     )}
//                   </div>
//                 </div>

//                 <div className="ua-field ua-actions">
//                   {!editMode ? (
//                     <button type="button" className="ua-btn" onClick={() => setEditMode(true)}>Edit</button>
//                   ) : (
//                     <>
//                       <button type="submit" className="ua-btn primary">Save</button>
//                       <button type="button" className="ua-btn" onClick={() => { setEditMode(false); setOtpSent(false); setOtp(""); setNewPhone(""); }}>Cancel</button>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </form>

//             {/* Danger */}
//             <div className="ua-danger">
//               <button className="ua-delete">Delete Account</button>
//               <button className="ua-deactivate">Deactivate Account</button>
//             </div>
//           </section>
//         )}

//         {/* Address Section */}
//         {activeSection === "address" && (
//           <section className="ua-card">
//             <h3 className="ua-title">My Addresses</h3>

//             <div className="ua-address-form">
//               <input name="addressLine1" placeholder="Address Line 1" value={addressForm.addressLine1} onChange={handleAddressChange} />
//               <input name="city" placeholder="City" value={addressForm.city} onChange={handleAddressChange} />
//               <input name="state" placeholder="State" value={addressForm.state} onChange={handleAddressChange} />
//               <input name="pincode" placeholder="Pincode" value={addressForm.pincode} onChange={handleAddressChange} />
//               <div className="ua-address-actions-row">
//                 <button className="ua-btn" onClick={handleAddOrUpdateAddress}>{editingAddressId ? "Update" : "Add"} Address</button>
//                 <button className="ua-btn" onClick={() => { setAddressForm({ addressLine1: "", city: "", state: "", pincode: "" }); setEditingAddressId(null); }}>Clear</button>
//               </div>
//             </div>

//             <div className="ua-address-list">
//               {addresses.length === 0 ? <p>No addresses found.</p> : addresses.map(addr => (
//                 <div className="ua-address-card" key={addr._id}>
//                   <div>{addr.addressLine1}, {addr.city}, {addr.state} - {addr.pincode}</div>
//                   <div className="ua-address-card-actions">
//                     <button className="ua-link" onClick={() => handleEditAddress(addr)}>✎ Edit</button>
//                     <button className="ua-link remove" onClick={() => handleDeleteAddress(addr._id)}>🗑 Delete</button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}

//         {/* Reset Password Section */}
//         {activeSection === "reset" && (
//           <section className="ua-card">
//             <h3 className="ua-title">Reset Password</h3>
//             {!resetOtpSent ? (
//               <div className="ua-reset">
//                 <input placeholder="Email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
//                 <button className="ua-btn" onClick={handleSendResetOtp}>Send OTP</button>
//               </div>
//             ) : (
//               <div className="ua-reset">
//                 <input placeholder="OTP" value={otpForReset} onChange={(e) => setOtpForReset(e.target.value)} />
//                 <input type="password" placeholder="New Password" value={resetPasswordForm.newPassword} onChange={(e) => setResetPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))} />
//                 <input type="password" placeholder="Confirm Password" value={resetPasswordForm.confirmPassword} onChange={(e) => setResetPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))} />
//                 <button className="ua-btn" onClick={handleResetPassword}>Reset Password</button>
//               </div>
//             )}
//           </section>
//         )}

//         {/* Orders Section */}
//         {activeSection === "orders" && (
//           <section className="ua-card">
//             <h3 className="ua-title">My Orders</h3>
//             {ordersLoading && <p>Loading orders...</p>}
//             {ordersError && <p className="ua-error">{ordersError}</p>}
//             {!ordersLoading && !ordersError && orders.length === 0 && <p>No orders found.</p>}
//             {!ordersLoading && !ordersError && orders.length > 0 && (
//               <div className="ua-orders-list">
//                 {orders.map(order => (
//                   <div className="ua-order-card" key={order._id}>
//                     <div><strong>Order ID:</strong> {order._id}</div>
//                     <div><strong>Status:</strong> {order.status}</div>
//                     <div><strong>Total:</strong> ₹{order.total}</div>
//                     <div><strong>Items:</strong> {order.items.map(i => `${i.name} x${i.quantity}`).join(", ")}</div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </section>
//         )}

//         {/* Fallback other sections */}
//         {["wishlist", "refer", "wallet", "help", "sell"].includes(activeSection) && (
//           <section className="ua-card">
//             <h3 className="ua-title">{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h3>
//             <p>This section is kept as-is (UI only) — your original logic remains unchanged.</p>
//           </section>
//         )}
//       </main>
//     </div>
//   );
// };

// export default Useraccount;



















































// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import "../css/Useraccount.css";

// const API_BASE = "https://beauty.joyory.com/api/user/profile";
// const RESET_PASSWORD_API = "https://beauty.joyory.com/api/security";
// const ORDERS_API = "https://beauty.joyory.com/api/user/cart/orders";

// const toInputDate = (value) => {
//   if (!value) return "";
//   if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
//   const dmy = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value);
//   if (dmy) return `${dmy[3]}-${dmy[2]}-${dmy[1]}`;
//   const mdy = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value);
//   if (mdy) {
//     const [, mm, dd, yyyy] = mdy;
//     return `${yyyy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
//   }
//   const d = new Date(value);
//   if (!isNaN(d)) return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
//   return "";
// };

// const Useraccount = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [profile, setProfile] = useState(null);
//   const [addresses, setAddresses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [imageFile, setImageFile] = useState(null);

//   // Phone OTP
//   const [otpSent, setOtpSent] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [newPhone, setNewPhone] = useState("");

//   // Address
//   const [addressForm, setAddressForm] = useState({ addressLine1: "", city: "", state: "", pincode: "" });
//   const [editingAddressId, setEditingAddressId] = useState(null);

//   // Reset password
//   const [activeSection, setActiveSection] = useState("profile");
//   const [resetEmail, setResetEmail] = useState("");
//   const [resetOtpSent, setResetOtpSent] = useState(false);
//   const [otpForReset, setOtpForReset] = useState("");
//   const [resetPasswordForm, setResetPasswordForm] = useState({ newPassword: "", confirmPassword: "" });

//   // Orders
//   const [orders, setOrders] = useState([]);
//   const [ordersLoading, setOrdersLoading] = useState(false);
//   const [ordersError, setOrdersError] = useState(null);

//   // Load profile
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) return navigate("/login");
//     fetchUserProfile(token);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [navigate]);

//   // Update newPhone when entering edit mode
//   useEffect(() => {
//     if (editMode) setNewPhone(formData.phone || "");
//   }, [editMode, formData.phone]);

//   // Auto fetch orders when opening Orders tab
//   useEffect(() => {
//     if (activeSection === "orders") fetchOrders();
//   }, [activeSection]);

//   // Clear reset form when leaving Reset section
//   useEffect(() => {
//     if (activeSection !== "reset") {
//       setResetOtpSent(false);
//       setResetEmail("");
//       setOtpForReset("");
//       setResetPasswordForm({ newPassword: "", confirmPassword: "" });
//     }
//   }, [activeSection]);

//   const fetchUserProfile = async (token) => {
//     try {
//       const res = await fetch(API_BASE, { headers: { Authorization: `Bearer ${token}` } });
//       if (!res.ok) throw new Error("Failed to fetch profile");
//       const data = await res.json();
//       const mappedProfile = {
//         fullName: data?.profile?.fullName || "",
//         email: data?.profile?.email || "",
//         phone: data?.profile?.phone || "",
//         gender: data?.profile?.gender || "",
//         dob: toInputDate(data?.profile?.dob),
//         profileImage: data?.profile?.profileImage || "",
//       };
//       setProfile(mappedProfile);
//       setFormData(mappedProfile);
//       setAddresses(data.addresses || []);
//       localStorage.setItem("user", JSON.stringify(mappedProfile));
//     } catch (err) {
//       console.error(err);
//       setError("Unable to load profile.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNavigate = (path, section) => {
//     setActiveSection(section);
//     navigate(path);
//   };

//   const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
//   const handleImageChange = (e) => setImageFile(e.target.files[0]);
//   const handleAddressChange = (e) => setAddressForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

//   const readError = async (res) => {
//     let msg = `${res.status} ${res.statusText}`;
//     try {
//       const data = await res.json();
//       if (data?.message) msg = data.message;
//       else if (data?.error) msg = data.error;
//     } catch { }
//     return msg;
//   };




//   // Redirect wishlist to separate page
//   const handleWishlistClick = () => {
//     navigate("/wishlist"); // <-- change this to your actual wishlist route
//   };





//   const handlerefreearn = () => {
//     navigate("/Referral"); // <-- change this to your actual wishlist route
//   };

//   // --- Profile save ---
//   const handleSave = async () => {
//     const token = localStorage.getItem("token");
//     try {
//       const res = await fetch(API_BASE, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({
//           fullName: formData.fullName,
//           email: formData.email,
//           gender: formData.gender,
//           dob: formData.dob,
//         }),
//       });
//       if (!res.ok) throw new Error(await readError(res));
//       const updated = await res.json();
//       const newProfile = { ...profile, ...formData, ...updated.profile };
//       setProfile(newProfile);
//       localStorage.setItem("user", JSON.stringify(newProfile));

//       if (imageFile) {
//         try {
//           const formDataImg = new FormData();
//           formDataImg.append("image", imageFile);
//           const resImg = await fetch(`${API_BASE}/avatar`, {
//             method: "POST",
//             headers: { Authorization: `Bearer ${token}` },
//             body: formDataImg,
//           });
//           if (!resImg.ok) throw new Error(await readError(resImg));
//           const imgData = await resImg.json();
//           setProfile(prev => ({ ...prev, profileImage: imgData.profileImage || prev.profileImage }));
//         } catch (imgErr) {
//           alert("Profile updated but image upload failed: " + imgErr.message);
//         }
//       }
//       setEditMode(false);
//     } catch (err) {
//       console.error(err);
//       alert(err.message || "Update failed");
//     }
//   };

//   // --- Orders ---
//   const fetchOrders = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return alert("Please login");
//     setOrdersLoading(true);
//     setOrdersError(null);
//     try {
//       const res = await fetch(ORDERS_API, { headers: { Authorization: `Bearer ${token}` } });
//       if (!res.ok) throw new Error(`Failed to fetch orders: ${res.status}`);
//       const data = await res.json();
//       setOrders(data.orders || []);
//     } catch (err) {
//       console.error(err);
//       setOrdersError(err.message || "Something went wrong");
//     } finally {
//       setOrdersLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   if (loading) return <div className="ua-loading"><div className="ua-spinner" /></div>;
//   if (error) return <p className="ua-error">{error}</p>;
//   if (!profile) return null;

















//   return (
//     <div className="ua-page">
//       {/* Sidebar */}
//       <aside className="ua-sidebar">
//         <ul>
//           <li className={activeSection === "orders" ? "active" : ""} onClick={() => handleNavigate("/myorders", "orders")}>
//             <span className="ua-icon">🧾</span> Orders
//           </li>
//           <li className={activeSection === "profile" ? "active" : ""} onClick={() => setActiveSection("profile")}>
//             <span className="ua-icon">👤</span> Profile
//           </li>
//           {/* <li className={activeSection === "wishlist" ? "active" : ""} onClick={() => setActiveSection("wishlist")}>
//             <span className="ua-icon">♥️</span> Wishlist
//           </li> */}



//           <li className={activeSection === "wishlist" ? "active" : ""} onClick={handleWishlistClick}>
//             <span className="ua-icon">♥️</span> Wishlist
//           </li>



//           {/* <li onClick={() => { setActiveSection("refer"); }} onClick={handlerefreearn}>
//             <span className="ua-icon">🎁</span> Refer & Earn
//           </li> */}

//           <li className={() => { setActiveSection("refer"); }} onClick={handlerefreearn}>
//             <span className="ua-icon">🎁</span> Refer & Earn
//           </li>


//           <li onClick={() => { setActiveSection("wallet"); }}>
//             <span className="ua-icon">👛</span> Joyory Wallet
//           </li>
//           <li onClick={() => { setActiveSection("help"); }}>
//             <span className="ua-icon">❓</span> Help & FAQs
//           </li>
//           <li onClick={() => { setActiveSection("sell"); }}>
//             <span className="ua-icon">🏬</span> Sell on Joyory
//           </li>
//           <li onClick={handleLogout}>
//             <span className="ua-icon">⎋</span> Logout
//           </li>
//         </ul>
//       </aside>

//       {/* Main content */}
//       <main className="ua-content">
//         {activeSection === "profile" && (
//           <section className="ua-card">
//             <h3 className="ua-title">Personal Details</h3>

//             {/* Avatar */}
//             <div className="ua-avatar-row">
//               <div className="ua-avatar">
//                 <img
//                   src={profile.profileImage || "/default-avatar.png"}
//                   alt="avatar"
//                   onError={(e) => e.currentTarget.src = "/default-avatar.png"}
//                 />
//                 <label className="ua-avatar-edit">
//                   <input type="file" onChange={handleImageChange} />
//                   ✎
//                 </label>
//               </div>
//             </div>

//             {/* Gender */}
//             <div className="ua-field-group">
//               <label className="ua-label">Gender</label>
//               <div className="ua-gender">
//                 <button
//                   type="button"
//                   className={formData.gender === "female" ? "active" : ""}
//                   onClick={() => setFormData(prev => ({ ...prev, gender: "female" }))}
//                 >
//                   Female
//                 </button>
//                 <button
//                   type="button"
//                   className={formData.gender === "male" ? "active" : ""}
//                   onClick={() => setFormData(prev => ({ ...prev, gender: "male" }))}
//                 >
//                   Male
//                 </button>
//                 <button
//                   type="button"
//                   className={formData.gender === "non-binary" ? "active" : ""}
//                   onClick={() => setFormData(prev => ({ ...prev, gender: "non-binary" }))}
//                 >
//                   Non Binary
//                 </button>
//                 <button
//                   type="button"
//                   className={formData.gender === "prefer-not" ? "active" : ""}
//                   onClick={() => setFormData(prev => ({ ...prev, gender: "prefer-not" }))}
//                 >
//                   Prefer not to say
//                 </button>
//               </div>
//             </div>

//             {/* Profile Form */}
//             <form
//               className="ua-form"
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 handleSave();
//               }}
//             >
//               <div className="ua-row">
//                 <div className="ua-field">
//                   <label className="ua-label">Full name</label>
//                   <input name="fullName" value={formData.fullName || ""} onChange={handleChange} placeholder="Full name" />
//                 </div>

//                 <div className="ua-field">
//                   <label className="ua-label">Email ID</label>
//                   <input name="email" value={formData.email || ""} onChange={handleChange} placeholder="Email" />
//                 </div>

//                 <div className="ua-field">
//                   <label className="ua-label">Phone Number</label>
//                   {!editMode ? (
//                     <input value={formData.phone || "N/A"} readOnly />
//                   ) : (
//                     <>
//                       {!otpSent ? (
//                         <div className="ua-otp-row">
//                           <input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="Enter new phone" />
//                           <button type="button" className="ua-btn orange" onClick={handleSendOtp}>Send OTP</button>
//                         </div>
//                       ) : (
//                         <div className="ua-otp-row">
//                           <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
//                           <button type="button" className="ua-btn orange" onClick={handleVerifyOtp}>Verify</button>
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </div>

//                 <div className="ua-field">
//                   <label className="ua-label">Birth Date</label>
//                   <input type="date" name="dob" value={formData.dob || ""} onChange={handleChange} />
//                 </div>

//                 <div className="ua-field ua-field-full">
//                   <label className="ua-label">Address</label>
//                   <textarea rows="3" value={addresses[0]?.addressLine1 || ""} readOnly />
//                   <div className="ua-address-actions">
//                     <button type="button" className="ua-link" onClick={() => setActiveSection("address")}>+ Add new Address</button>
//                     {addresses[0] && (
//                       <>
//                         <button type="button" className="ua-link" onClick={() => handleEditAddress(addresses[0])}>✎ Edit</button>
//                         <button type="button" className="ua-link remove" onClick={() => handleDeleteAddress(addresses[0]._id)}>🗑 Remove</button>
//                       </>
//                     )}
//                   </div>
//                 </div>

//                 <div className="ua-field ua-actions">
//                   {!editMode ? (
//                     <button type="button" className="ua-btn" onClick={() => setEditMode(true)}>Edit</button>
//                   ) : (
//                     <>
//                       <button type="submit" className="ua-btn primary">Save</button>
//                       <button type="button" className="ua-btn" onClick={() => { setEditMode(false); setOtpSent(false); setOtp(""); setNewPhone(""); }}>Cancel</button>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </form>

//             {/* Danger */}
//             <div className="ua-danger">
//               <button className="ua-delete">Delete Account</button>
//               <button className="ua-deactivate">Deactivate Account</button>
//             </div>
//           </section>
//         )}

//         {/* Address Section */}
//         {activeSection === "address" && (
//           <section className="ua-card">
//             <h3 className="ua-title">My Addresses</h3>

//             <div className="ua-address-form">
//               <input name="addressLine1" placeholder="Address Line 1" value={addressForm.addressLine1} onChange={handleAddressChange} />
//               <input name="city" placeholder="City" value={addressForm.city} onChange={handleAddressChange} />
//               <input name="state" placeholder="State" value={addressForm.state} onChange={handleAddressChange} />
//               <input name="pincode" placeholder="Pincode" value={addressForm.pincode} onChange={handleAddressChange} />
//               <div className="ua-address-actions-row">
//                 <button className="ua-btn" onClick={handleAddOrUpdateAddress}>{editingAddressId ? "Update" : "Add"} Address</button>
//                 <button className="ua-btn" onClick={() => { setAddressForm({ addressLine1: "", city: "", state: "", pincode: "" }); setEditingAddressId(null); }}>Clear</button>
//               </div>
//             </div>

//             <div className="ua-address-list">
//               {addresses.length === 0 ? <p>No addresses found.</p> : addresses.map(addr => (
//                 <div className="ua-address-card" key={addr._id}>
//                   <div>{addr.addressLine1}, {addr.city}, {addr.state} - {addr.pincode}</div>
//                   <div className="ua-address-card-actions">
//                     <button className="ua-link" onClick={() => handleEditAddress(addr)}>✎ Edit</button>
//                     <button className="ua-link remove" onClick={() => handleDeleteAddress(addr._id)}>🗑 Delete</button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}

//         {/* Reset Password Section */}
//         {activeSection === "reset" && (
//           <section className="ua-card">
//             <h3 className="ua-title">Reset Password</h3>
//             {!resetOtpSent ? (
//               <div className="ua-reset">
//                 <input placeholder="Email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
//                 <button className="ua-btn" onClick={handleSendResetOtp}>Send OTP</button>
//               </div>
//             ) : (
//               <div className="ua-reset">
//                 <input placeholder="OTP" value={otpForReset} onChange={(e) => setOtpForReset(e.target.value)} />
//                 <input type="password" placeholder="New Password" value={resetPasswordForm.newPassword} onChange={(e) => setResetPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))} />
//                 <input type="password" placeholder="Confirm Password" value={resetPasswordForm.confirmPassword} onChange={(e) => setResetPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))} />
//                 <button className="ua-btn" onClick={handleResetPassword}>Reset Password</button>
//               </div>
//             )}
//           </section>
//         )}

//         {/* Orders Section */}
//         {activeSection === "orders" && (
//           <section className="ua-card">
//             <h3 className="ua-title">My Orders</h3>
//             {ordersLoading && <p>Loading orders...</p>}
//             {ordersError && <p className="ua-error">{ordersError}</p>}
//             {!ordersLoading && !ordersError && orders.length === 0 && <p>No orders found.</p>}
//             {!ordersLoading && !ordersError && orders.length > 0 && (
//               <div className="ua-orders-list">
//                 {orders.map(order => (
//                   <div className="ua-order-card" key={order._id}>
//                     <div><strong>Order ID:</strong> {order._id}</div>
//                     <div><strong>Status:</strong> {order.status}</div>
//                     <div><strong>Total:</strong> ₹{order.total}</div>
//                     <div><strong>Items:</strong> {order.items.map(i => `${i.name} x${i.quantity}`).join(", ")}</div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </section>
//         )}

//         {/* Fallback other sections */}
//         {["wishlist", "refer", "wallet", "help", "sell"].includes(activeSection) && (
//           <section className="ua-card">
//             <h3 className="ua-title">{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h3>
//             <p>This section is kept as-is (UI only) — your original logic remains unchanged.</p>
//           </section>
//         )}
//       </main>
//     </div>
//   );
// };

// export default Useraccount;


















// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import "../css/Useraccount.css";
// import Sidebarcomon from "./Sidebarcomon";

// const API_BASE = "https://beauty.joyory.com/api/user/profile";
// const RESET_PASSWORD_API = "https://beauty.joyory.com/api/security";
// const ORDERS_API = "https://beauty.joyory.com/api/user/cart/orders";

// const toInputDate = (value) => {
//   if (!value) return "";
//   if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
//   const dmy = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value);
//   if (dmy) return `${dmy[3]}-${dmy[2]}-${dmy[1]}`;
//   const mdy = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value);
//   if (mdy) {
//     const [, mm, dd, yyyy] = mdy;
//     return `${yyyy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
//   }
//   const d = new Date(value);
//   if (!isNaN(d)) return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
//   return "";
// };

// const Useraccount = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [profile, setProfile] = useState(null);
//   const [addresses, setAddresses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [imageFile, setImageFile] = useState(null);

//   // Phone OTP
//   const [otpSent, setOtpSent] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [newPhone, setNewPhone] = useState("");

//   // Address
//   const [addressForm, setAddressForm] = useState({ addressLine1: "", city: "", state: "", pincode: "" });
//   const [editingAddressId, setEditingAddressId] = useState(null);

//   // Reset password
//   const [activeSection, setActiveSection] = useState("profile");
//   const [resetEmail, setResetEmail] = useState("");
//   const [resetOtpSent, setResetOtpSent] = useState(false);
//   const [otpForReset, setOtpForReset] = useState("");
//   const [resetPasswordForm, setResetPasswordForm] = useState({ newPassword: "", confirmPassword: "" });

//   // Orders
//   const [orders, setOrders] = useState([]);
//   const [ordersLoading, setOrdersLoading] = useState(false);
//   const [ordersError, setOrdersError] = useState(null);

//   // Load profile
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) return navigate("/login");
//     fetchUserProfile(token);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [navigate]);

//   // Update newPhone when entering edit mode
//   useEffect(() => {
//     if (editMode) setNewPhone(formData.phone || "");
//   }, [editMode, formData.phone]);

//   // Auto fetch orders when opening Orders tab
//   useEffect(() => {
//     if (activeSection === "orders") fetchOrders();
//   }, [activeSection]);

//   // Clear reset form when leaving Reset section
//   useEffect(() => {
//     if (activeSection !== "reset") {
//       setResetOtpSent(false);
//       setResetEmail("");
//       setOtpForReset("");
//       setResetPasswordForm({ newPassword: "", confirmPassword: "" });
//     }
//   }, [activeSection]);

//   const fetchUserProfile = async (token) => {
//     try {
//       const res = await fetch(API_BASE, { headers: { Authorization: `Bearer ${token}` } });
//       if (!res.ok) throw new Error("Failed to fetch profile");
//       const data = await res.json();
//       const mappedProfile = {
//         fullName: data?.profile?.fullName || "",
//         email: data?.profile?.email || "",
//         phone: data?.profile?.phone || "",
//         gender: data?.profile?.gender || "",
//         dob: toInputDate(data?.profile?.dob),
//         profileImage: data?.profile?.profileImage || "",
//       };
//       setProfile(mappedProfile);
//       setFormData(mappedProfile);
//       setAddresses(data.addresses || []);
//       localStorage.setItem("user", JSON.stringify(mappedProfile));
//     } catch (err) {
//       console.error(err);
//       setError("Unable to load profile.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNavigate = (path, section) => {
//     setActiveSection(section);
//     navigate(path);
//   };

//   const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
//   const handleImageChange = (e) => setImageFile(e.target.files[0]);
//   const handleAddressChange = (e) => setAddressForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

//   const readError = async (res) => {
//     let msg = `${res.status} ${res.statusText}`;
//     try {
//       const data = await res.json();
//       if (data?.message) msg = data.message;
//       else if (data?.error) msg = data.error;
//     } catch { }
//     return msg;
//   };




//   // Redirect wishlist to separate page
//   const handleWishlistClick = () => {
//     navigate("/wishlist"); // <-- change this to your actual wishlist route
//   };





//   const handlerefreearn = () => {
//     navigate("/Referral"); // <-- change this to your actual wishlist route
//   };

//   // --- Profile save ---
//   const handleSave = async () => {
//     const token = localStorage.getItem("token");
//     try {
//       const res = await fetch(API_BASE, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({
//           fullName: formData.fullName,
//           email: formData.email,
//           gender: formData.gender,
//           dob: formData.dob,
//         }),
//       });
//       if (!res.ok) throw new Error(await readError(res));
//       const updated = await res.json();
//       const newProfile = { ...profile, ...formData, ...updated.profile };
//       setProfile(newProfile);
//       localStorage.setItem("user", JSON.stringify(newProfile));

//       if (imageFile) {
//         try {
//           const formDataImg = new FormData();
//           formDataImg.append("image", imageFile);
//           const resImg = await fetch(`${API_BASE}/avatar`, {
//             method: "POST",
//             headers: { Authorization: `Bearer ${token}` },
//             body: formDataImg,
//           });
//           if (!resImg.ok) throw new Error(await readError(resImg));
//           const imgData = await resImg.json();
//           setProfile(prev => ({ ...prev, profileImage: imgData.profileImage || prev.profileImage }));
//         } catch (imgErr) {
//           alert("Profile updated but image upload failed: " + imgErr.message);
//         }
//       }
//       setEditMode(false);
//     } catch (err) {
//       console.error(err);
//       alert(err.message || "Update failed");
//     }
//   };

//   // --- Orders ---
//   const fetchOrders = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return alert("Please login");
//     setOrdersLoading(true);
//     setOrdersError(null);
//     try {
//       const res = await fetch(ORDERS_API, { headers: { Authorization: `Bearer ${token}` } });
//       if (!res.ok) throw new Error(`Failed to fetch orders: ${res.status}`);
//       const data = await res.json();
//       setOrders(data.orders || []);
//     } catch (err) {
//       console.error(err);
//       setOrdersError(err.message || "Something went wrong");
//     } finally {
//       setOrdersLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   if (loading) return <div className="ua-loading"><div className="ua-spinner" /></div>;
//   if (error) return <p className="ua-error">{error}</p>;
//   if (!profile) return null;

















//   return (
//     <div className="ua-page">
//       {/* Sidebar */}


//       <section className="Heading-Name">
//             <h3 className="ua-title ms-4">Personal Details</h3>
//       <Sidebarcomon />
//             </section>



//       {/* Main content */}
//       <main className="ua-content">
//         {activeSection === "profile" && (
//           <section className="ua-card">
//             <h3 className="ua-title">Personal Details</h3>

//             {/* Avatar */}
//             <div className="ua-avatar-row">
//               <div className="ua-avatar">
//                 <img
//                   src={profile.profileImage || "/default-avatar.png"}
//                   alt="avatar"
//                   onError={(e) => e.currentTarget.src = "/default-avatar.png"}
//                 />
//                 <label className="ua-avatar-edit">
//                   <input type="file" onChange={handleImageChange} />
//                   ✎
//                 </label>
//               </div>
//             </div>

//             {/* Gender */}
//             <div className="ua-field-group">
//               <label className="ua-label">Gender</label>
//               <div className="ua-gender">
//                 <button
//                   type="button"
//                   className={formData.gender === "female" ? "active" : ""}
//                   onClick={() => setFormData(prev => ({ ...prev, gender: "female" }))}
//                 >
//                   Female
//                 </button>
//                 <button
//                   type="button"
//                   className={formData.gender === "male" ? "active" : ""}
//                   onClick={() => setFormData(prev => ({ ...prev, gender: "male" }))}
//                 >
//                   Male
//                 </button>
//                 <button
//                   type="button"
//                   className={formData.gender === "non-binary" ? "active" : ""}
//                   onClick={() => setFormData(prev => ({ ...prev, gender: "non-binary" }))}
//                 >
//                   Non Binary
//                 </button>
//                 <button
//                   type="button"
//                   className={formData.gender === "prefer-not" ? "active" : ""}
//                   onClick={() => setFormData(prev => ({ ...prev, gender: "prefer-not" }))}
//                 >
//                   Prefer not to say
//                 </button>
//               </div>
//             </div>

//             {/* Profile Form */}
//             <form
//               className="ua-form"
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 handleSave();
//               }}
//             >
//               <div className="ua-row">
//                 <div className="ua-field">
//                   <label className="ua-label">Full name</label>
//                   <input name="fullName" value={formData.fullName || ""} onChange={handleChange} placeholder="Full name" />
//                 </div>

//                 <div className="ua-field">
//                   <label className="ua-label">Email ID</label>
//                   <input name="email" value={formData.email || ""} onChange={handleChange} placeholder="Email" />
//                 </div>

//                 <div className="ua-field">
//                   <label className="ua-label">Phone Number</label>
//                   {!editMode ? (
//                     <input value={formData.phone || "N/A"} readOnly />
//                   ) : (
//                     <>
//                       {!otpSent ? (
//                         <div className="ua-otp-row">
//                           <input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="Enter new phone" />
//                           <button type="button" className="ua-btn orange" onClick={handleSendOtp}>Send OTP</button>
//                         </div>
//                       ) : (
//                         <div className="ua-otp-row">
//                           <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
//                           <button type="button" className="ua-btn orange" onClick={handleVerifyOtp}>Verify</button>
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </div>

//                 <div className="ua-field">
//                   <label className="ua-label">Birth Date</label>
//                   <input type="date" name="dob" value={formData.dob || ""} onChange={handleChange} />
//                 </div>

//                 <div className="ua-field ua-field-full">
//                   <label className="ua-label">Address</label>
//                   <textarea rows="3" value={addresses[0]?.addressLine1 || ""} readOnly />
//                   <div className="ua-address-actions">
//                     <button type="button" className="ua-link" onClick={() => setActiveSection("address")}>+ Add new Address</button>
//                     {addresses[0] && (
//                       <>
//                         <button type="button" className="ua-link" onClick={() => handleEditAddress(addresses[0])}>✎ Edit</button>
//                         <button type="button" className="ua-link remove" onClick={() => handleDeleteAddress(addresses[0]._id)}>🗑 Remove</button>
//                       </>
//                     )}
//                   </div>
//                 </div>

//                 <div className="ua-field ua-actions">
//                   {!editMode ? (
//                     <button type="button" className="ua-btn" onClick={() => setEditMode(true)}>Edit</button>
//                   ) : (
//                     <>
//                       <button type="submit" className="ua-btn primary">Save</button>
//                       <button type="button" className="ua-btn" onClick={() => { setEditMode(false); setOtpSent(false); setOtp(""); setNewPhone(""); }}>Cancel</button>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </form>

//             {/* Danger */}
//             <div className="ua-danger">
//               <button className="ua-delete">Delete Account</button>
//               <button className="ua-deactivate">Deactivate Account</button>
//             </div>
//           </section>
//         )}

//         {/* Address Section */}
//         {activeSection === "address" && (
//           <section className="ua-card">
//             <h3 className="ua-title">My Addresses</h3>

//             <div className="ua-address-form">
//               <input name="addressLine1" placeholder="Address Line 1" value={addressForm.addressLine1} onChange={handleAddressChange} />
//               <input name="city" placeholder="City" value={addressForm.city} onChange={handleAddressChange} />
//               <input name="state" placeholder="State" value={addressForm.state} onChange={handleAddressChange} />
//               <input name="pincode" placeholder="Pincode" value={addressForm.pincode} onChange={handleAddressChange} />
//               <div className="ua-address-actions-row">
//                 <button className="ua-btn" onClick={handleAddOrUpdateAddress}>{editingAddressId ? "Update" : "Add"} Address</button>
//                 <button className="ua-btn" onClick={() => { setAddressForm({ addressLine1: "", city: "", state: "", pincode: "" }); setEditingAddressId(null); }}>Clear</button>
//               </div>
//             </div>

//             <div className="ua-address-list">
//               {addresses.length === 0 ? <p>No addresses found.</p> : addresses.map(addr => (
//                 <div className="ua-address-card" key={addr._id}>
//                   <div>{addr.addressLine1}, {addr.city}, {addr.state} - {addr.pincode}</div>
//                   <div className="ua-address-card-actions">
//                     <button className="ua-link" onClick={() => handleEditAddress(addr)}>✎ Edit</button>
//                     <button className="ua-link remove" onClick={() => handleDeleteAddress(addr._id)}>🗑 Delete</button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}

//         {/* Reset Password Section */}
//         {activeSection === "reset" && (
//           <section className="ua-card">
//             <h3 className="ua-title">Reset Password</h3>
//             {!resetOtpSent ? (
//               <div className="ua-reset">
//                 <input placeholder="Email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
//                 <button className="ua-btn" onClick={handleSendResetOtp}>Send OTP</button>
//               </div>
//             ) : (
//               <div className="ua-reset">
//                 <input placeholder="OTP" value={otpForReset} onChange={(e) => setOtpForReset(e.target.value)} />
//                 <input type="password" placeholder="New Password" value={resetPasswordForm.newPassword} onChange={(e) => setResetPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))} />
//                 <input type="password" placeholder="Confirm Password" value={resetPasswordForm.confirmPassword} onChange={(e) => setResetPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))} />
//                 <button className="ua-btn" onClick={handleResetPassword}>Reset Password</button>
//               </div>
//             )}
//           </section>
//         )}

//         {/* Orders Section */}
//         {activeSection === "orders" && (
//           <section className="ua-card">
//             <h3 className="ua-title">My Orders</h3>
//             {ordersLoading && <p>Loading orders...</p>}
//             {ordersError && <p className="ua-error">{ordersError}</p>}
//             {!ordersLoading && !ordersError && orders.length === 0 && <p>No orders found.</p>}
//             {!ordersLoading && !ordersError && orders.length > 0 && (
//               <div className="ua-orders-list">
//                 {orders.map(order => (
//                   <div className="ua-order-card" key={order._id}>
//                     <div><strong>Order ID:</strong> {order._id}</div>
//                     <div><strong>Status:</strong> {order.status}</div>
//                     <div><strong>Total:</strong> ₹{order.total}</div>
//                     <div><strong>Items:</strong> {order.items.map(i => `${i.name} x${i.quantity}`).join(", ")}</div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </section>
//         )}

//         {/* Fallback other sections */}
//         {["wishlist", "refer", "wallet", "help", "sell"].includes(activeSection) && (
//           <section className="ua-card">
//             <h3 className="ua-title">{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h3>
//             <p>This section is kept as-is (UI only) — your original logic remains unchanged.</p>
//           </section>
//         )}
//       </main>
//     </div>
//   );
// };

// export default Useraccount;
















// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../css/Useraccount.css";
// import Sidebarcomon from "./Sidebarcomon";

// const API_BASE = "https://beauty.joyory.com/api/user/profile";

// // Convert DOB to yyyy-mm-dd for input[type="date"]
// const toInputDate = (value) => {
//   if (!value) return "";
//   if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
//   const d = new Date(value);
//   if (!isNaN(d)) {
//     return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
//       d.getDate()
//     ).padStart(2, "0")}`;
//   }
//   return "";
// };

// const Useraccount = () => {
//   const navigate = useNavigate();

//   const [profile, setProfile] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     gender: "",
//     dob: "",
//     profileImage: "",
//   });
//   const [addresses, setAddresses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     gender: "",
//     dob: "",
//     profileImage: "",
//   });
//   const [imageFile, setImageFile] = useState(null);

//   // useEffect(() => {
//   //   const token = localStorage.getItem("token");
//   //   if (!token) return navigate("/login");
//   //   fetchUserProfile(token);
//   // }, [navigate]);


//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await fetch("https://beauty.joyory.com/api/user/profile", {
//           credentials: "include", // ✅ send HTTP-only cookie
//         });
//         if (!res.ok) {
//           navigate("/login");
//           return;
//         }
//         const data = await res.json();
//         setProfile({
//           fullName: data.profile.fullName || "",
//           email: data.profile.email || "",
//           phone: data.profile.phone || "",
//           gender: data.profile.gender || "",
//           dob: toInputDate(data.profile.dob),
//           profileImage: data.profile.profileImage || "",
//         });
//         setAddresses(data.addresses || []);
//         setFormData({
//           fullName: data.profile.fullName || "",
//           email: data.profile.email || "",
//           phone: data.profile.phone || "",
//           gender: data.profile.gender || "",
//           dob: toInputDate(data.profile.dob),
//           profileImage: data.profile.profileImage || "",
//         });
//       } catch (err) {
//         console.error(err);
//         navigate("/login");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [navigate]);



//   const readError = async (res) => {
//     let msg = `${res.status} ${res.statusText}`;
//     try {
//       const data = await res.json();
//       if (data?.message) msg = data.message;
//       else if (data?.error) msg = data.error;
//     } catch { }
//     return msg;
//   };

//   // Fetch user profile including addresses
//   const fetchUserProfile = async (token) => {
//     try {
//       const res = await fetch(API_BASE, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error("Failed to fetch profile");
//       const data = await res.json();

//       const mappedProfile = {
//         fullName: data?.profile?.fullName || "",
//         email: data?.profile?.email || "",
//         phone: data?.profile?.phone || "",
//         gender: data?.profile?.gender || "",
//         dob: toInputDate(data?.profile?.dob),
//         profileImage: data?.profile?.profileImage || "",
//       };

//       setProfile(mappedProfile);
//       setFormData(mappedProfile);
//       setAddresses(data.addresses || []);
//       localStorage.setItem("user", JSON.stringify(mappedProfile));
//     } catch (err) {
//       console.error(err);
//       alert("Failed to load profile");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((p) => ({ ...p, [name]: value }));
//   };

//   const handleImageChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setImageFile(file);

//     const token = localStorage.getItem("token");
//     const formDataImg = new FormData();
//     formDataImg.append("image", file);

//     try {
//       const resImg = await fetch(`${API_BASE}/avatar`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formDataImg,
//       });

//       if (!resImg.ok) throw new Error(await readError(resImg));
//       const imgData = await resImg.json();

//       setProfile((prev) => ({
//         ...prev,
//         profileImage: imgData?.profileImage || prev.profileImage,
//       }));
//       setFormData((prev) => ({
//         ...prev,
//         profileImage: imgData?.profileImage || prev.profileImage,
//       }));

//       alert("Avatar updated successfully ✅");
//     } catch (err) {
//       console.error("Avatar upload error:", err);
//       alert("Failed to upload avatar");
//     }
//   };

//   const handleSaveProfile = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     try {
//       const payload = {
//         fullName: formData.fullName,
//         email: formData.email,
//         gender: formData.gender || undefined,
//         dob: formData.dob ? new Date(formData.dob).toISOString() : undefined,
//       };

//       const res = await fetch(API_BASE, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error(await readError(res));
//       const updated = await res.json();

//       const updatedProfile = updated.profile || updated;
//       const safeDOB = updatedProfile.dob ? toInputDate(updatedProfile.dob) : formData.dob || "";

//       const updatedData = {
//         fullName: updatedProfile.fullName || formData.fullName,
//         email: updatedProfile.email || formData.email,
//         gender: updatedProfile.gender || formData.gender,
//         dob: safeDOB,
//         phone: updatedProfile.phone || formData.phone,
//         profileImage: updatedProfile.profileImage || formData.profileImage,
//       };

//       setProfile(updatedData);
//       setFormData(updatedData);
//       setEditMode(false);
//       alert("Profile updated successfully ✅");
//     } catch (err) {
//       console.error("Save error:", err);
//       alert(err.message || "Failed to update profile");
//     }
//   };

//   // Address Handlers
//   const handleAddressChange = (index, field, value) => {
//     const newAddrs = [...addresses];
//     newAddrs[index][field] = value;
//     setAddresses(newAddrs);
//   };

//   const handleAddNewAddress = () => {
//     setAddresses((prev) => [
//       ...prev,
//       { addressLine1: "", city: "", state: "", pincode: "", _id: null },
//     ]);
//   };

//   const handleSaveAddress = async (index) => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     const addr = addresses[index];

//     try {
//       let res, data;

//       // New Address → POST
//       if (!addr._id) {
//         res = await fetch(`${API_BASE}/address`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             addressLine1: addr.addressLine1,
//             city: addr.city,
//             state: addr.state,
//             pincode: addr.pincode,
//           }),
//         });
//       } else {
//         // Existing Address → PATCH
//         res = await fetch(`${API_BASE}/address/${addr._id}`, {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             addressLine1: addr.addressLine1,
//             city: addr.city,
//             state: addr.state,
//             pincode: addr.pincode,
//           }),
//         });
//       }

//       if (!res.ok) throw new Error(await readError(res));
//       data = await res.json();

//       // Update address with ID returned from server
//       const updatedAddrs = [...addresses];
//       updatedAddrs[index] = {
//         addressLine1: data.addressLine1,
//         city: data.city,
//         state: data.state,
//         pincode: data.pincode,
//         _id: data._id,
//       };
//       setAddresses(updatedAddrs);
//       alert("Address saved successfully ✅");
//     } catch (err) {
//       console.error("Address save error:", err);
//       alert("Failed to save address: " + err.message);
//     }
//   };

//   const handleDeleteAddress = async (index) => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     const addr = addresses[index];

//     try {
//       if (addr._id) {
//         const res = await fetch(`${API_BASE}/address/${addr._id}`, {
//           method: "DELETE",
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (!res.ok) throw new Error(await readError(res));
//       }

//       // Remove from local state
//       setAddresses((prev) => prev.filter((_, i) => i !== index));
//       alert("Address deleted successfully ✅");
//     } catch (err) {
//       console.error("Delete address error:", err);
//       alert("Failed to delete address: " + err.message);
//     }
//   };

//   if (loading) return <div className="ua-loading"><div className="ua-spinner" /></div>;
//   if (!profile) return null;

//   return (
//     <div className="ua-page">
//       <section className="Heading-Name">
//         <h3 className="ua-title ms-4">Personal Details</h3>
//         <Sidebarcomon />
//       </section>

//       <main className="ua-content">
//         <section className="ua-card">
//           <h3 className="ua-title">Personal Details</h3>

//           {/* Avatar */}
//           <div className="ua-avatar-row">
//             <div className="ua-avatar">
//               <img
//                 src={profile.profileImage || "/default-avatar.png"}
//                 alt="avatar"
//                 onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
//               />
//               {editMode && (
//                 <label className="ua-avatar-edit">
//                   <input type="file" onChange={handleImageChange} />
//                   ✎
//                 </label>
//               )}
//             </div>
//           </div>

//           {/* Gender */}
//           <div className="ua-field-group">
//             <label className="ua-label">Gender</label>
//             <div className="ua-gender">
//               {["female", "male", "non-binary", "prefer-not"].map((g) => (
//                 <button
//                   key={g}
//                   type="button"
//                   className={formData.gender === g ? "active" : ""}
//                   disabled={!editMode}
//                   onClick={() => setFormData((p) => ({ ...p, gender: g }))}
//                 >
//                   {g === "prefer-not" ? "Prefer not to say" : g.charAt(0).toUpperCase() + g.slice(1)}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Profile Fields */}
//           <form className="ua-form" onSubmit={(e) => e.preventDefault()}>
//             <div className="ua-row">
//               <div className="ua-field">
//                 <label className="ua-label">Full Name</label>
//                 <input
//                   name="fullName"
//                   value={formData.fullName || ""}
//                   onChange={handleChange}
//                   disabled={!editMode}
//                 />
//               </div>
//               <div className="ua-field">
//                 <label className="ua-label">Email ID</label>
//                 <input
//                   name="email"
//                   value={formData.email || ""}
//                   onChange={handleChange}
//                   disabled={!editMode}
//                 />
//               </div>
//               <div className="ua-field">
//                 <label className="ua-label">Phone Number</label>
//                 <input value={formData.phone || "N/A"} readOnly />
//               </div>
//               <div className="ua-field">
//                 <label className="ua-label">Birth Date</label>
//                 <input
//                   type="date"
//                   name="dob"
//                   value={formData.dob || ""}
//                   onChange={handleChange}
//                   disabled={!editMode}
//                 />
//               </div>

//               <div className="ua-field ua-actions">
//                 {!editMode ? (
//                   <button type="button" className="ua-btn" onClick={() => setEditMode(true)}>Edit</button>
//                 ) : (
//                   <button type="button" className="ua-btn" onClick={handleSaveProfile}>Save</button>
//                 )}
//               </div>
//             </div>
//           </form>

//           {/* Addresses */}
//           <h4 className="ua-subtitle mt-4">Addresses</h4>
//           {addresses.map((addr, i) => (
//             <div key={i} className="ua-address-row">
//               <input className="addressline"
//                 value={addr.addressLine1 || ""}
//                 placeholder="Address Line 1"
//                 disabled={!editMode}
//                 onChange={(e) => handleAddressChange(i, "addressLine1", e.target.value)}
//               />
//               <input className="city"
//                 value={addr.city || ""}
//                 placeholder="City"
//                 disabled={!editMode}
//                 onChange={(e) => handleAddressChange(i, "city", e.target.value)}
//               />
//               <input className="state"
//                 value={addr.state || ""}
//                 placeholder="State"
//                 disabled={!editMode}
//                 onChange={(e) => handleAddressChange(i, "state", e.target.value)}
//               />
//               <input className="pincode"
//                 value={addr.pincode || ""}
//                 placeholder="Pincode"
//                 disabled={!editMode}
//                 onChange={(e) => handleAddressChange(i, "pincode", e.target.value)}
//               />
//               {editMode && (
//                 <>
//                   <div className="adress-buttons">
//                     <button
//                       type="button"
//                       className="ua-btn ua-save"
//                       onClick={() => handleSaveAddress(i)}
//                     >
//                       Save
//                     </button>
//                     <button
//                       type="button"
//                       className="ua-btn delete-button ua-delete ms-2"
//                       onClick={() => handleDeleteAddress(i)}
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           ))}

//           {editMode && (
//             <div className="mt-2 add-address-button">
//               <button type="button" className="ua-btn" onClick={handleAddNewAddress}>+ Add Address</button>
//             </div>
//           )}

//           <div className="ua-danger mt-4">
//             <button className="ua-delete">Delete Account</button>
//             <button className="ua-deactivate">Deactivate Account</button>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default Useraccount;















// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../css/Useraccount.css";
// import Sidebarcomon from "./Sidebarcomon";

// const API_BASE = "https://beauty.joyory.com/api/user/profile";

// // Convert DOB to yyyy-mm-dd for input[type="date"]
// const toInputDate = (value) => {
//   if (!value) return "";
//   if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
//   const d = new Date(value);
//   if (!isNaN(d)) {
//     return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
//       d.getDate()
//     ).padStart(2, "0")}`;
//   }
//   return "";
// };

// const Useraccount = () => {
//   const navigate = useNavigate();

//   const [profile, setProfile] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     gender: "",
//     dob: "",
//     profileImage: "",
//   });
//   const [addresses, setAddresses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     gender: "",
//     dob: "",
//     profileImage: "",
//   });
//   const [imageFile, setImageFile] = useState(null);

//   // useEffect(() => {
//   //   const fetchProfile = async () => {
//   //     try {
//   //       const res = await fetch(API_BASE, {
//   //         credentials: "include", // ✅ send secure cookie
//   //       });
//   //       if (!res.ok) {
//   //         navigate("/login");
//   //         return;
//   //       }
//   //       const data = await res.json();
//   //       setProfile({
//   //         fullName: data.profile.fullName || "",
//   //         email: data.profile.email || "",
//   //         phone: data.profile.phone || "",
//   //         gender: data.profile.gender || "",
//   //         dob: toInputDate(data.profile.dob),
//   //         profileImage: data.profile.profileImage || "",
//   //       });
//   //       setAddresses(data.addresses || []);
//   //       setFormData({
//   //         fullName: data.profile.fullName || "",
//   //         email: data.profile.email || "",
//   //         phone: data.profile.phone || "",
//   //         gender: data.profile.gender || "",
//   //         dob: toInputDate(data.profile.dob),
//   //         profileImage: data.profile.profileImage || "",
//   //       });
//   //     } catch (err) {
//   //       console.error(err);
//   //       navigate("/login");
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchProfile();
//   // }, [navigate]);

//   const API_BASE = "https://beauty.joyory.com/api/user/profile";

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await fetch(API_BASE, {
//           credentials: "include", // ✅ ensures HTTP-only cookies are sent
//         });

//         if (res.status === 401 || res.status === 403) {
//           // redirect only if unauthorized
//           navigate("/login");
//           return;
//         }

//         if (!res.ok) {
//           console.error("Profile fetch failed:", res.status, res.statusText);
//           return;
//         }

//         const data = await res.json();

//         setProfile({
//           fullName: data.profile.fullName || "",
//           email: data.profile.email || "",
//           phone: data.profile.phone || "",
//           gender: data.profile.gender || "",
//           dob: toInputDate(data.profile.dob),
//           profileImage: data.profile.profileImage || "",
//         });

//         setAddresses(data.addresses || []);

//         setFormData({
//           fullName: data.profile.fullName || "",
//           email: data.profile.email || "",
//           phone: data.profile.phone || "",
//           gender: data.profile.gender || "",
//           dob: toInputDate(data.profile.dob),
//           profileImage: data.profile.profileImage || "",
//         });
//       } catch (err) {
//         console.error("Error fetching profile:", err);
//         // don’t redirect on network issues
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [navigate]);

//   const readError = async (res) => {
//     let msg = `${res.status} ${res.statusText}`;
//     try {
//       const data = await res.json();
//       if (data?.message) msg = data.message;
//       else if (data?.error) msg = data.error;
//     } catch { }
//     return msg;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((p) => ({ ...p, [name]: value }));
//   };

//   const handleImageChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setImageFile(file);

//     const formDataImg = new FormData();
//     formDataImg.append("image", file);

//     try {
//       const resImg = await fetch(`${API_BASE}/avatar`, {
//         method: "POST",
//         credentials: "include", // ✅ cookie-based auth
//         body: formDataImg,
//       });

//       if (!resImg.ok) throw new Error(await readError(resImg));
//       const imgData = await resImg.json();

//       setProfile((prev) => ({
//         ...prev,
//         profileImage: imgData?.profileImage || prev.profileImage,
//       }));
//       setFormData((prev) => ({
//         ...prev,
//         profileImage: imgData?.profileImage || prev.profileImage,
//       }));

//       alert("Avatar updated successfully ✅");
//     } catch (err) {
//       console.error("Avatar upload error:", err);
//       alert("Failed to upload avatar");
//     }
//   };

//   const handleSaveProfile = async () => {
//     try {
//       const payload = {
//         fullName: formData.fullName,
//         email: formData.email,
//         gender: formData.gender || undefined,
//         dob: formData.dob ? new Date(formData.dob).toISOString() : undefined,
//       };

//       const res = await fetch(API_BASE, {
//         method: "PATCH",
//         credentials: "include", // ✅ cookie-based auth
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error(await readError(res));
//       const updated = await res.json();

//       const updatedProfile = updated.profile || updated;
//       const safeDOB = updatedProfile.dob ? toInputDate(updatedProfile.dob) : formData.dob || "";

//       const updatedData = {
//         fullName: updatedProfile.fullName || formData.fullName,
//         email: updatedProfile.email || formData.email,
//         gender: updatedProfile.gender || formData.gender,
//         dob: safeDOB,
//         phone: updatedProfile.phone || formData.phone,
//         profileImage: updatedProfile.profileImage || formData.profileImage,
//       };

//       setProfile(updatedData);
//       setFormData(updatedData);
//       setEditMode(false);
//       alert("Profile updated successfully ✅");
//     } catch (err) {
//       console.error("Save error:", err);
//       alert(err.message || "Failed to update profile");
//     }
//   };

//   // Address Handlers
//   const handleAddressChange = (index, field, value) => {
//     const newAddrs = [...addresses];
//     newAddrs[index][field] = value;
//     setAddresses(newAddrs);
//   };

//   const handleAddNewAddress = () => {
//     setAddresses((prev) => [
//       ...prev,
//       { addressLine1: "", city: "", state: "", pincode: "", _id: null },
//     ]);
//   };

//   const handleSaveAddress = async (index) => {
//     const addr = addresses[index];

//     try {
//       let res, data;

//       if (!addr._id) {
//         res = await fetch(`${API_BASE}/address`, {
//           method: "POST",
//           credentials: "include", // ✅ cookie-based auth
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(addr),
//         });
//       } else {
//         res = await fetch(`${API_BASE}/address/${addr._id}`, {
//           method: "PATCH",
//           credentials: "include", // ✅ cookie-based auth
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(addr),
//         });
//       }

//       if (!res.ok) throw new Error(await readError(res));
//       data = await res.json();

//       const updatedAddrs = [...addresses];
//       updatedAddrs[index] = { ...addr, _id: data._id };
//       setAddresses(updatedAddrs);
//       alert("Address saved successfully ✅");
//     } catch (err) {
//       console.error("Address save error:", err);
//       alert("Failed to save address: " + err.message);
//     }
//   };

//   const handleDeleteAddress = async (index) => {
//     const addr = addresses[index];
//     try {
//       if (addr._id) {
//         const res = await fetch(`${API_BASE}/address/${addr._id}`, {
//           method: "DELETE",
//           credentials: "include", // ✅ cookie-based auth
//         });
//         if (!res.ok) throw new Error(await readError(res));
//       }
//       setAddresses((prev) => prev.filter((_, i) => i !== index));
//       alert("Address deleted successfully ✅");
//     } catch (err) {
//       console.error("Delete address error:", err);
//       alert("Failed to delete address: " + err.message);
//     }
//   };

//   if (loading) return <div className="ua-loading"><div className="ua-spinner" /></div>;
//   if (!profile) return null;

//   return (
//     <div className="ua-page">
//       <section className="Heading-Name">
//         <h3 className="ua-title ms-4">Personal Details</h3>
//         <Sidebarcomon />
//       </section>

//       <main className="ua-content">
//         <section className="ua-card">
//           <h3 className="ua-title">Personal Details</h3>

//           {/* Avatar */}
//           <div className="ua-avatar-row">
//             <div className="ua-avatar">
//               <img
//                 src={profile.profileImage || "/default-avatar.png"}
//                 alt="avatar"
//                 onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
//               />
//               {editMode && (
//                 <label className="ua-avatar-edit">
//                   <input type="file" onChange={handleImageChange} />
//                   ✎
//                 </label>
//               )}
//             </div>
//           </div>

//           {/* Gender */}
//           <div className="ua-field-group">
//             <label className="ua-label">Gender</label>
//             <div className="ua-gender">
//               {["female", "male", "non-binary", "prefer-not"].map((g) => (
//                 <button
//                   key={g}
//                   type="button"
//                   className={formData.gender === g ? "active" : ""}
//                   disabled={!editMode}
//                   onClick={() => setFormData((p) => ({ ...p, gender: g }))}
//                 >
//                   {g === "prefer-not" ? "Prefer not to say" : g.charAt(0).toUpperCase() + g.slice(1)}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Profile Fields */}
//           <form className="ua-form" onSubmit={(e) => e.preventDefault()}>
//             <div className="ua-row">
//               <div className="ua-field">
//                 <label className="ua-label">Full Name</label>
//                 <input
//                   name="fullName"
//                   value={formData.fullName || ""}
//                   onChange={handleChange}
//                   disabled={!editMode}
//                 />
//               </div>
//               <div className="ua-field">
//                 <label className="ua-label">Email ID</label>
//                 <input
//                   name="email"
//                   value={formData.email || ""}
//                   onChange={handleChange}
//                   disabled={!editMode}
//                 />
//               </div>
//               <div className="ua-field">
//                 <label className="ua-label">Phone Number</label>
//                 <input value={formData.phone || "N/A"} readOnly />
//               </div>
//               <div className="ua-field">
//                 <label className="ua-label">Birth Date</label>
//                 <input
//                   type="date"
//                   name="dob"
//                   value={formData.dob || ""}
//                   onChange={handleChange}
//                   disabled={!editMode}
//                 />
//               </div>

//               <div className="ua-field ua-actions">
//                 {!editMode ? (
//                   <button type="button" className="ua-btn" onClick={() => setEditMode(true)}>Edit</button>
//                 ) : (
//                   <button type="button" className="ua-btn" onClick={handleSaveProfile}>Save</button>
//                 )}
//               </div>
//             </div>
//           </form>

//           {/* Addresses */}
//           <h4 className="ua-subtitle mt-4">Addresses</h4>
//           {addresses.map((addr, i) => (
//             <div key={i} className="ua-address-row">
//               <input className="addressline"
//                 value={addr.addressLine1 || ""}
//                 placeholder="Address Line 1"
//                 disabled={!editMode}
//                 onChange={(e) => handleAddressChange(i, "addressLine1", e.target.value)}
//               />
//               <input className="city"
//                 value={addr.city || ""}
//                 placeholder="City"
//                 disabled={!editMode}
//                 onChange={(e) => handleAddressChange(i, "city", e.target.value)}
//               />
//               <input className="state"
//                 value={addr.state || ""}
//                 placeholder="State"
//                 disabled={!editMode}
//                 onChange={(e) => handleAddressChange(i, "state", e.target.value)}
//               />
//               <input className="pincode"
//                 value={addr.pincode || ""}
//                 placeholder="Pincode"
//                 disabled={!editMode}
//                 onChange={(e) => handleAddressChange(i, "pincode", e.target.value)}
//               />
//               {editMode && (
//                 <>
//                   <div className="adress-buttons">
//                     <button
//                       type="button"
//                       className="ua-btn ua-save"
//                       onClick={() => handleSaveAddress(i)}
//                     >
//                       Save
//                     </button>
//                     <button
//                       type="button"
//                       className="ua-btn delete-button ua-delete ms-2"
//                       onClick={() => handleDeleteAddress(i)}
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           ))}

//           {editMode && (
//             <div className="mt-2 add-address-button">
//               <button type="button" className="ua-btn" onClick={handleAddNewAddress}>+ Add Address</button>
//             </div>
//           )}

//           <div className="ua-danger mt-4">
//             <button className="ua-delete">Delete Account</button>
//             {/* <button className="ua-deactivate">Deactivate Account</button> */}
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default Useraccount;


















// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../css/Useraccount.css";
// import "../App.css";
// import Sidebarcomon from "./Sidebarcomon";
// import Footer from "./Footer";
// import Header from "./Header";

// const API_BASE = "https://beauty.joyory.com/api/user/profile";

// // Convert DOB to yyyy-mm-dd for input[type="date"]
// const toInputDate = (value) => {
//   if (!value) return "";
//   if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
//   const d = new Date(value);
//   if (!isNaN(d)) {
//     return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
//       d.getDate()
//     ).padStart(2, "0")}`;
//   }
//   return "";
// };

// const Useraccount = () => {
//   const navigate = useNavigate();

//   const [profile, setProfile] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     gender: "",
//     dob: "",
//     profileImage: "",
//   });
//   const [addresses, setAddresses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     gender: "",
//     dob: "",
//     profileImage: "",
//   });
//   const [imageFile, setImageFile] = useState(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await fetch(API_BASE, {
//           credentials: "include",
//         });

//         if (res.status === 401 || res.status === 403) {
//           navigate("/login");
//           return;
//         }

//         if (!res.ok) {
//           console.error("Profile fetch failed:", res.status, res.statusText);
//           return;
//         }

//         const data = await res.json();

//         setProfile({
//           fullName: data.profile.fullName || "",
//           email: data.profile.email || "",
//           phone: data.profile.phone || "",
//           gender: data.profile.gender || "",
//           dob: toInputDate(data.profile.dob),
//           profileImage: data.profile.profileImage || "",
//         });

//         setAddresses(data.addresses || []);

//         setFormData({
//           fullName: data.profile.fullName || "",
//           email: data.profile.email || "",
//           phone: data.profile.phone || "",
//           gender: data.profile.gender || "",
//           dob: toInputDate(data.profile.dob),
//           profileImage: data.profile.profileImage || "",
//         });
//       } catch (err) {
//         console.error("Error fetching profile:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [navigate]);



//   // useEffect(() => {
//   //   const fetchProfile = async () => {
//   //     try {
//   //       const res = await fetch(API_BASE, { credentials: "include" });

//   //       if (!res.ok) {
//   //         setLoading(false);
//   //         return;
//   //       }

//   //       const data = await res.json();

//   //       setProfile({
//   //         fullName: data.profile.fullName || "",
//   //         email: data.profile.email || "",
//   //         phone: data.profile.phone || "",
//   //         gender: data.profile.gender || "",
//   //         dob: toInputDate(data.profile.dob),
//   //         profileImage: data.profile.profileImage || "",
//   //       });

//   //       setAddresses(data.addresses || []);

//   //       setFormData({
//   //         fullName: data.profile.fullName || "",
//   //         email: data.profile.email || "",
//   //         phone: data.profile.phone || "",
//   //         gender: data.profile.gender || "",
//   //         dob: toInputDate(data.profile.dob),
//   //         profileImage: data.profile.profileImage || "",
//   //       });
//   //     } catch (err) {
//   //       console.error("Error fetching profile:", err);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchProfile();
//   // }, []);


//   const readError = async (res) => {
//     let msg = `${res.status} ${res.statusText}`;
//     try {
//       const data = await res.json();
//       if (data?.message) msg = data.message;
//       else if (data?.error) msg = data.error;
//     } catch { }
//     return msg;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((p) => ({ ...p, [name]: value }));
//   };

//   const handleImageChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setImageFile(file);

//     const formDataImg = new FormData();
//     formDataImg.append("image", file);

//     try {
//       const resImg = await fetch(`${API_BASE}/avatar`, {
//         method: "POST",
//         credentials: "include",
//         body: formDataImg,
//       });

//       if (!resImg.ok) throw new Error(await readError(resImg));
//       const imgData = await resImg.json();

//       setProfile((prev) => ({
//         ...prev,
//         profileImage: imgData?.profileImage || prev.profileImage,
//       }));
//       setFormData((prev) => ({
//         ...prev,
//         profileImage: imgData?.profileImage || prev.profileImage,
//       }));

//       alert("Avatar updated successfully ✅");
//     } catch (err) {
//       console.error("Avatar upload error:", err);
//       alert("Failed to upload avatar");
//     }
//   };

//   // const handleSaveProfile = async () => {
//   //   try {
//   //     const payload = {
//   //       fullName: formData.fullName,
//   //       email: formData.email,
//   //       phone: formData.phone, // ✅ ADD THIS
//   //       gender: formData.gender || undefined,
//   //       // dob: formData.dob ? new Date(formData.dob).toISOString() : undefined,
//   //       dob: formData.dob
//   //         ? (() => {
//   //           const [year, month, day] = formData.dob.split("-");
//   //           return `${day}-${month}-${year}`; // ✅ DD-MM-YYYY
//   //         })()
//   //         : undefined,
//   //     };

//   //     const res = await fetch(API_BASE, {
//   //       method: "PATCH",
//   //       credentials: "include",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify(payload),
//   //     });

//   //     if (!res.ok) throw new Error(await readError(res));
//   //     const updated = await res.json();

//   //     const updatedProfile = updated.profile || updated;
//   //     const safeDOB = updatedProfile.dob ? toInputDate(updatedProfile.dob) : formData.dob || "";

//   //     const updatedData = {
//   //       fullName: updatedProfile.fullName || formData.fullName,
//   //       email: updatedProfile.email || formData.email,
//   //       gender: updatedProfile.gender || formData.gender,
//   //       dob: safeDOB,
//   //       phone: updatedProfile.phone || formData.phone,
//   //       profileImage: updatedProfile.profileImage || formData.profileImage,
//   //     };

//   //     setProfile(updatedData);
//   //     setFormData(updatedData);
//   //     setEditMode(false);
//   //     alert("Profile updated successfully ✅");
//   //   } catch (err) {
//   //     console.error("Save error:", err);
//   //     alert(err.message || "Failed to update profile");
//   //   }
//   // };

//   // Address Handlers




// const handleSaveProfile = async () => {
//   try {
//     const payload = {
//       fullName: formData.fullName,
//       email: formData.email,
//       phone: formData.phone, // ✅ FIXED
//       gender: formData.gender || undefined,
//       dob: formData.dob
//         ? (() => {
//             const [year, month, day] = formData.dob.split("-");
//             return `${day}-${month}-${year}`;
//           })()
//         : undefined,
//     };

//     const res = await fetch(API_BASE, {
//       method: "PATCH",
//       credentials: "include",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     if (!res.ok) throw new Error(await readError(res));

//     const updated = await res.json();

//     const updatedProfile = updated.profile || updated;

//     const updatedData = {
//       fullName: updatedProfile.fullName || formData.fullName,
//       email: updatedProfile.email || formData.email,
//       phone: updatedProfile.phone || formData.phone,
//       gender: updatedProfile.gender || formData.gender,
//       dob: updatedProfile.dob
//         ? toInputDate(updatedProfile.dob)
//         : formData.dob,
//       profileImage: updatedProfile.profileImage || formData.profileImage,
//     };

//     setProfile(updatedData);
//     setFormData(updatedData);
//     setEditMode(false);

//     alert("Profile updated successfully ✅");
//   } catch (err) {
//     console.error("Save error:", err);
//     alert(err.message || "Failed to update profile");
//   }
// };

//   const handleAddressChange = (index, field, value) => {
//     const newAddrs = [...addresses];
//     newAddrs[index][field] = value;
//     setAddresses(newAddrs);
//   };

//   const handleAddNewAddress = () => {
//     setAddresses((prev) => [
//       ...prev,
//       // { name: "", addressLine1: "", city: "", state: "", pincode: "", _id: null , },
//       { name: "", addressLine1: "", city: "", state: "", pincode: "", phone: "", email: "" },
//     ]);
//   };

//   const handleSaveAddress = async (index) => {
//     const addr = addresses[index];

//     try {
//       let res, data;

//       if (!addr._id) {
//         // New address
//         res = await fetch(`${API_BASE}/address`, {
//           method: "POST",
//           credentials: "include",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(addr),
//         });
//       } else {
//         // Existing address
//         const { _id, ...payload } = addr; // Remove _id
//         res = await fetch(`${API_BASE}/address/${_id}`, {
//           method: "PATCH",
//           credentials: "include",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         });
//       }

//       if (!res.ok) throw new Error(await readError(res));
//       data = await res.json();

//       // Update state with backend response
//       const updatedAddrs = [...addresses];
//       updatedAddrs[index] = data; // Use backend returned address
//       setAddresses(updatedAddrs);

//       alert("Address saved successfully ✅");
//     } catch (err) {
//       console.error("Address save error:", err);
//       alert("Failed to save address: " + err.message);
//     }
//   };

//   const handleDeleteAddress = async (index) => {
//     const addr = addresses[index];
//     try {
//       if (addr._id) {
//         const res = await fetch(`${API_BASE}/address/${addr._id}`, {
//           method: "DELETE",
//           credentials: "include",
//         });
//         if (!res.ok) throw new Error(await readError(res));
//       }
//       setAddresses((prev) => prev.filter((_, i) => i !== index));
//       alert("Address deleted successfully ✅");
//     } catch (err) {
//       console.error("Delete address error:", err);
//       alert("Failed to delete address: " + err.message);
//     }
//   };

//   // ✅ Delete Account API
//   const handleDeleteAccount = async () => {
//     const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
//     if (!confirmDelete) return;

//     try {
//       const res = await fetch("https://beauty.joyory.com/api/user/delete-account", {
//         method: "DELETE",
//         credentials: "include",
//       });

//       if (!res.ok) {
//         const errorText = await res.text();
//         throw new Error(`Delete account failed: ${res.status} ${errorText}`);
//       }

//       alert("Account deleted successfully ✅");
//       navigate("/login"); // redirect to login after deletion
//     } catch (err) {
//       console.error("Delete account error:", err);
//       alert("Failed to delete account. Please try again.");
//     }
//   };

//   if (loading) return <div className="ua-loading"><div className="ua-spinner" /></div>;
//   if (!profile) return null;

//   return (



//     <>

//       <Header />


//       <div className="ua-page mt-lg-5 pt-lg-5 mt-md-0 pt-md-5">
//         <section className="Heading-Name mt-lg-5 pt-lg-3 mt-md-0 pt-md-0">
//           <h3 className="ua-title ms-4 page-title-main-name">Personal Details</h3>
//           <Sidebarcomon />
//         </section>

//         <main className="ua-content mt-lg-5 pt-lg-3 mt-md-0 pt-md-0">
//           <section className="ua-card">
//             <h3 className="ua-title page-title-main-name">Personal Details</h3>

//             {/* Avatar */}
//             <div className="ua-avatar-row">
//               <div className="ua-avatar">
//                 <img
//                   src={profile.profileImage || "/default-avatar.png"}
//                   alt="avatar"
//                   onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
//                 />
//                 {editMode && (
//                   <label className="ua-avatar-edit">
//                     <input className="page-title-main-name" type="file" onChange={handleImageChange} />
//                     ✎
//                   </label>
//                 )}
//               </div>
//             </div>

//             {/* Gender */}
//             <div className="ua-field-group">
//               <label className="ua-label page-title-main-name">Gender</label>
//               <div className="ua-gender page-title-main-name">
//                 {["female", "male", "non-binary", "prefer-not"].map((g) => (
//                   <button
//                     key={g}
//                     type="button"
//                     className={formData.gender === g ? "active" : ""}
//                     disabled={!editMode}
//                     onClick={() => setFormData((p) => ({ ...p, gender: g }))}
//                   >
//                     {g === "prefer-not" ? "Prefer not to say" : g.charAt(0).toUpperCase() + g.slice(1)}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Profile Fields */}
//             <form className="ua-form" onSubmit={(e) => e.preventDefault()}>
//               <div className="ua-row">
//                 <div className="ua-field page-title-main-name">
//                   <label className="ua-label">Full Name</label>
//                   <input
//                     name="fullName"
//                     value={formData.fullName || ""}
//                     onChange={handleChange}
//                     disabled={!editMode}
//                   />
//                 </div>
//                 <div className="ua-field page-title-main-name">
//                   <label className="ua-label">Email ID</label>
//                   <input
//                     name="email"
//                     value={formData.email || ""}
//                     onChange={handleChange}
//                     disabled={!editMode}
//                   />
//                 </div>
//                 <div className="ua-field page-title-main-name">
//                   <label className="ua-label">Phone Number</label>
//                   {/* <input value={formData.call} /> */}

//                   <input
//                     name="phone"
//                     value={formData.phone || ""}
//                     onChange={handleChange}
//                     disabled={!editMode}
//                   />
//                 </div>
//                 <div className="ua-field page-title-main-name">
//                   <label className="ua-label">Birth Date</label>
//                   <input
//                     type="date"
//                     name="dob"
//                     value={formData.dob || ""}
//                     onChange={handleChange}
//                     disabled={!editMode}
//                   />
//                 </div>

//                 <div className="ua-field ua-actions page-title-main-name">
//                   {!editMode ? (
//                     <button type="button" className="ua-btn" onClick={() => setEditMode(true)}>Edit</button>
//                   ) : (
//                     <button type="button" className="ua-btn" onClick={handleSaveProfile}>Save</button>
//                   )}
//                 </div>
//               </div>
//             </form>

//             {/* Addresses */}
//             <h4 className="ua-subtitle mt-4 page-title-main-name">Addresses</h4>
//             {/* {addresses.map((addr, i) => (
//             <div key={i} className="ua-address-row">
//               <input className="addressline"
//                 value={addr.addressLine1 || ""}
//                 placeholder="Address Line 1"
//                 disabled={!editMode}
//                 onChange={(e) => handleAddressChange(i, "addressLine1", e.target.value)}
//               />
//               <input className="city"
//                 value={addr.city || ""}
//                 placeholder="City"
//                 disabled={!editMode}
//                 onChange={(e) => handleAddressChange(i, "city", e.target.value)}
//               />
//               <input className="state"
//                 value={addr.state || ""}
//                 placeholder="State"
//                 disabled={!editMode}
//                 onChange={(e) => handleAddressChange(i, "state", e.target.value)}
//               />
//               <input className="pincode"
//                 value={addr.pincode || ""}
//                 placeholder="Pincode"
//                 disabled={!editMode}
//                 onChange={(e) => handleAddressChange(i, "pincode", e.target.value)}
//               />
//               {editMode && (
//                 <>
//                   <div className="adress-buttons">
//                     <button
//                       type="button"
//                       className="ua-btn ua-save"
//                       onClick={() => handleSaveAddress(i)}
//                     >
//                       Save
//                     </button>
//                     <button
//                       type="button"
//                       className="ua-btn delete-button ua-delete ms-2"
//                       onClick={() => handleDeleteAddress(i)}
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           ))}

//           {editMode && (
//             <div className="mt-2 add-address-button">
//               <button type="button" className="ua-btn" onClick={handleAddNewAddress}>+ Add Address</button>
//             </div>
//           )} */}


//             {/* Addresses */}
//             {/* Addresses */}
//             {addresses.map((addr, i) => (
//               <div key={i} className="ua-address-row">
//                 <div className="row">
//                   <div className="col-lg-6 page-title-main-name">
//                     <input
//                       className="fullname page-title-main-name"
//                       value={addr.name || ""}
//                       placeholder="Full Name"
//                       disabled={!editMode}
//                       onChange={(e) => handleAddressChange(i, "name", e.target.value)}
//                     />
//                   </div>
//                   <div className="col-lg-6">


//                     <input
//                       className="addressline page-title-main-name"
//                       value={addr.addressLine1 || ""}
//                       placeholder="Address Line 1"
//                       disabled={!editMode}
//                       onChange={(e) => handleAddressChange(i, "addressLine1", e.target.value)}
//                     />
//                   </div>
//                 </div>

//                 <div className="row">
//                   <div className="col-lg-6">
//                     <input
//                       className="city page-title-main-name"
//                       value={addr.city || ""}
//                       placeholder="City"
//                       disabled={!editMode}
//                       onChange={(e) => handleAddressChange(i, "city", e.target.value)}
//                     />
//                   </div>

//                   <div className="col-lg-6">

//                     <input
//                       className="state page-title-main-name"
//                       value={addr.state || ""}
//                       placeholder="State"
//                       disabled={!editMode}
//                       onChange={(e) => handleAddressChange(i, "state", e.target.value)}
//                     />
//                   </div>
//                 </div>

//                 <div className="row">
//                   <div className="col-lg-6">
//                     <input
//                       className="pincode page-title-main-name"
//                       value={addr.pincode || ""}
//                       placeholder="Pincode"
//                       disabled={!editMode}
//                       onChange={(e) => handleAddressChange(i, "pincode", e.target.value)}
//                     />
//                   </div>

//                   <div className="col-lg-6">

//                     <input
//                       className="phone page-title-main-name"
//                       value={addr.phone || ""}
//                       placeholder="Phone Number"
//                       disabled={!editMode}
//                       onChange={(e) => handleAddressChange(i, "phone", e.target.value)}
//                     />
//                   </div>
//                 </div>


//                 <div className="row">
//                   <div className="col-lg-6">
//                     <input
//                       className="email page-title-main-name"
//                       value={addr.email || ""}
//                       placeholder="Email ID"
//                       disabled={!editMode}
//                       onChange={(e) => handleAddressChange(i, "email", e.target.value)}
//                     />
//                   </div>
//                 </div>



//                 {editMode && (
//                   <div className="adress-buttons page-title-main-name">
//                     <button
//                       type="button"
//                       className="ua-btn ua-save"
//                       onClick={() => handleSaveAddress(i)}
//                     >
//                       Save
//                     </button>
//                     <button
//                       type="button"
//                       className="ua-btn delete-button ua-delete ms-2"
//                       onClick={() => handleDeleteAddress(i)}
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ))}

//             {editMode && (
//               <div className="mt-2 add-address-button page-title-main-name">
//                 <button type="button" className="ua-btn page-title-main-name" onClick={handleAddNewAddress}>+ Add Address</button>
//               </div>
//             )}



//             <div className="ua-danger mt-4">
//               <button className="ua-delete page-title-main-name" onClick={handleDeleteAccount}>Delete Account</button>
//               {/* <button className="ua-deactivate">Deactivate Account</button> */}
//             </div>
//           </section>
//         </main>
//       </div>


//       <Footer />


//     </>
//   );
// };

// export default Useraccount;














// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../css/Useraccount.css";
// import "../App.css";
// import Sidebarcomon from "./Sidebarcomon";
// import Footer from "./Footer";
// import Header from "./Header";
// // import AddressSection from "./AddressSections";
// import AddressSections from "./AddressSections";

// const API_BASE = "https://beauty.joyory.com/api/user/profile";

// // Convert DOB to yyyy-mm-dd for input[type="date"]
// const toInputDate = (value) => {
//   if (!value) return "";
//   if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
//   const d = new Date(value);
//   if (!isNaN(d)) {
//     return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
//       d.getDate()
//     ).padStart(2, "0")}`;
//   }
//   return "";
// };

// const Useraccount = () => {
//   const navigate = useNavigate();

//   const [profile, setProfile] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     gender: "",
//     dob: "",
//     profileImage: "",
//   });

//   const [addresses, setAddresses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editMode, setEditMode] = useState(false);

//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     gender: "",
//     dob: "",
//     profileImage: "",
//   });

//   const [imageFile, setImageFile] = useState(null);

//   // Fetch Profile
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await fetch(API_BASE, { credentials: "include" });

//         if (res.status === 401 || res.status === 403) {
//           navigate("/login");
//           return;
//         }

//         if (!res.ok) throw new Error("Failed to fetch profile");

//         const data = await res.json();

//         const profileData = {
//           fullName: data.profile.fullName || "",
//           email: data.profile.email || "",
//           phone: data.profile.phone || "",
//           gender: data.profile.gender || "",
//           dob: toInputDate(data.profile.dob),
//           profileImage: data.profile.profileImage || "",
//         };

//         setProfile(profileData);
//         setAddresses(data.addresses || []);
//         setFormData({ ...profileData });
//       } catch (err) {
//         console.error("Error fetching profile:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [navigate]);

//   const readError = async (res) => {
//     let msg = `${res.status} ${res.statusText}`;
//     try {
//       const data = await res.json();
//       if (data?.message) msg = data.message;
//       else if (data?.error) msg = data.error;
//     } catch {}
//     return msg;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((p) => ({ ...p, [name]: value }));
//   };

//   const handleImageChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setImageFile(file);

//     const formDataImg = new FormData();
//     formDataImg.append("image", file);

//     try {
//       const resImg = await fetch(`${API_BASE}/avatar`, {
//         method: "POST",
//         credentials: "include",
//         body: formDataImg,
//       });

//       if (!resImg.ok) throw new Error(await readError(resImg));
//       const imgData = await resImg.json();

//       setProfile((prev) => ({
//         ...prev,
//         profileImage: imgData?.profileImage || prev.profileImage,
//       }));
//       setFormData((prev) => ({
//         ...prev,
//         profileImage: imgData?.profileImage || prev.profileImage,
//       }));

//       alert("Avatar updated successfully ✅");
//     } catch (err) {
//       console.error("Avatar upload error:", err);
//       alert("Failed to upload avatar");
//     }
//   };

//   const handleSaveProfile = async () => {
//     try {
//       const payload = {
//         fullName: formData.fullName,
//         email: formData.email,
//         phone: formData.phone,
//         gender: formData.gender || undefined,
//         dob: formData.dob
//           ? (() => {
//               const [year, month, day] = formData.dob.split("-");
//               return `${day}-${month}-${year}`;
//             })()
//           : undefined,
//       };

//       const res = await fetch(API_BASE, {
//         method: "PATCH",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error(await readError(res));

//       const updated = await res.json();
//       const updatedProfile = updated.profile || updated;

//       const updatedData = {
//         fullName: updatedProfile.fullName || formData.fullName,
//         email: updatedProfile.email || formData.email,
//         phone: updatedProfile.phone || formData.phone,
//         gender: updatedProfile.gender || formData.gender,
//         dob: updatedProfile.dob ? toInputDate(updatedProfile.dob) : formData.dob,
//         profileImage: updatedProfile.profileImage || formData.profileImage,
//       };

//       setProfile(updatedData);
//       setFormData(updatedData);
//       setEditMode(false);
//       alert("Profile updated successfully ✅");
//     } catch (err) {
//       console.error("Save error:", err);
//       alert(err.message || "Failed to update profile");
//     }
//   };

//   // Address Handlers
//   const handleAddressChange = (index, field, value) => {
//     const newAddrs = [...addresses];
//     newAddrs[index][field] = value;
//     setAddresses(newAddrs);
//   };

//   const handleAddNewAddress = () => {
//     setAddresses((prev) => [
//       ...prev,
//       { name: "", addressLine1: "", city: "", state: "", pincode: "", phone: "", email: "" },
//     ]);
//   };

//   const handleSaveAddress = async (index) => {
//     const addr = addresses[index];
//     try {
//       let res, data;
//       if (!addr._id) {
//         res = await fetch(`${API_BASE}/address`, {
//           method: "POST",
//           credentials: "include",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(addr),
//         });
//       } else {
//         const { _id, ...payload } = addr;
//         res = await fetch(`${API_BASE}/address/${_id}`, {
//           method: "PATCH",
//           credentials: "include",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         });
//       }

//       if (!res.ok) throw new Error(await readError(res));
//       data = await res.json();

//       const updatedAddrs = [...addresses];
//       updatedAddrs[index] = data;
//       setAddresses(updatedAddrs);
//       alert("Address saved successfully ✅");
//     } catch (err) {
//       console.error("Address save error:", err);
//       alert("Failed to save address: " + err.message);
//     }
//   };

//   const handleDeleteAddress = async (index) => {
//     const addr = addresses[index];
//     try {
//       if (addr._id) {
//         const res = await fetch(`${API_BASE}/address/${addr._id}`, {
//           method: "DELETE",
//           credentials: "include",
//         });
//         if (!res.ok) throw new Error(await readError(res));
//       }
//       setAddresses((prev) => prev.filter((_, i) => i !== index));
//       alert("Address deleted successfully ✅");
//     } catch (err) {
//       console.error("Delete address error:", err);
//       alert("Failed to delete address: " + err.message);
//     }
//   };

//   const handleDeleteAccount = async () => {
//     const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
//     if (!confirmDelete) return;

//     try {
//       const res = await fetch("https://beauty.joyory.com/api/user/delete-account", {
//         method: "DELETE",
//         credentials: "include",
//       });

//       if (!res.ok) {
//         const errorText = await res.text();
//         throw new Error(`Delete account failed: ${res.status} ${errorText}`);
//       }

//       alert("Account deleted successfully ✅");
//       navigate("/login");
//     } catch (err) {
//       console.error("Delete account error:", err);
//       alert("Failed to delete account. Please try again.");
//     }
//   };

//   if (loading) return <div className="ua-loading"><div className="ua-spinner" /></div>;
//   if (!profile) return null;

//   return (
//     <>
//       <Header />

//       <div className="ua-page mt-lg-5 pt-lg-5 mt-md-0 pt-md-5">
//         <section className="Heading-Name mt-lg-5 pt-lg-3 mt-md-0 pt-md-0">
//           <h3 className="ua-title ms-4 page-title-main-name">Personal Details</h3>
//           <Sidebarcomon />
//         </section>

//         <main className="ua-content mt-lg-5 pt-lg-3 mt-md-0 pt-md-0">
//           <section className="ua-card">
//             <h3 className="ua-title page-title-main-name">Personal Details</h3>

//             {/* Avatar */}
//             <div className="ua-avatar-row">
//               <div className="ua-avatar">
//                 <img
//                   src={profile.profileImage || "/default-avatar.png"}
//                   alt="avatar"
//                   onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
//                 />
//                 {editMode && (
//                   <label className="ua-avatar-edit">
//                     <input className="page-title-main-name" type="file" onChange={handleImageChange} />
//                     ✎
//                   </label>
//                 )}
//               </div>
//             </div>

//             {/* Gender */}
//             <div className="ua-field-group">
//               <label className="ua-label page-title-main-name">Gender</label>
//               <div className="ua-gender page-title-main-name">
//                 {["female", "male", "non-binary", "prefer-not"].map((g) => (
//                   <button
//                     key={g}
//                     type="button"
//                     className={formData.gender === g ? "active" : ""}
//                     disabled={!editMode}
//                     onClick={() => setFormData((p) => ({ ...p, gender: g }))}
//                   >
//                     {g === "prefer-not" ? "Prefer not to say" : g.charAt(0).toUpperCase() + g.slice(1)}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Profile Fields */}
//             <form className="ua-form" onSubmit={(e) => e.preventDefault()}>
//               <div className="ua-row">
//                 <div className="ua-field page-title-main-name">
//                   <label className="ua-label">Full Name</label>
//                   <input
//                     name="fullName"
//                     value={formData.fullName || ""}
//                     onChange={handleChange}
//                     disabled={!editMode}
//                   />
//                 </div>
//                 <div className="ua-field page-title-main-name">
//                   <label className="ua-label">Email ID</label>
//                   <input
//                     name="email"
//                     value={formData.email || ""}
//                     onChange={handleChange}
//                     disabled={!editMode}
//                   />
//                 </div>
//                 <div className="ua-field page-title-main-name">
//                   <label className="ua-label">Phone Number</label>
//                   <input
//                     name="phone"
//                     value={formData.phone || ""}
//                     onChange={handleChange}
//                     disabled={!editMode}
//                     placeholder="10 digit mobile number"
//                   />
//                 </div>
//                 <div className="ua-field page-title-main-name">
//                   <label className="ua-label">Birth Date</label>
//                   <input
//                     type="date"
//                     name="dob"
//                     value={formData.dob || ""}
//                     onChange={handleChange}
//                     disabled={!editMode}
//                   />
//                 </div>

//                 <div className="ua-field ua-actions page-title-main-name">
//                   {!editMode ? (
//                     <button type="button" className="ua-btn" onClick={() => setEditMode(true)}>Edit</button>
//                   ) : (
//                     <button type="button" className="ua-btn" onClick={handleSaveProfile}>Save</button>
//                   )}
//                 </div>
//               </div>
//             </form>

//             {/* Separated Address Section */}
//             <AddressSections
//               addresses={addresses}
//               editMode={editMode}
//               handleAddressChange={handleAddressChange}
//               handleSaveAddress={handleSaveAddress}
//               handleDeleteAddress={handleDeleteAddress}
//               handleAddNewAddress={handleAddNewAddress}
//             />

//             <div className="ua-danger mt-4">
//               <button className="ua-delete page-title-main-name" onClick={handleDeleteAccount}>
//                 Delete Account
//               </button>
//             </div>
//           </section>
//         </main>
//       </div>

//       <Footer />
//     </>
//   );
// };

// export default Useraccount;


















// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../css/Useraccount.css";
// import "../App.css";
// import Sidebarcomon from "./Sidebarcomon";
// import Footer from "./Footer";
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// import Header from "./Header";

// import AddressSections from "./AddressSections";

// const API_BASE = "https://beauty.joyory.com/api/user/profile";

// const toInputDate = (value) => {
//   if (!value) return "";
//   if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
//   const d = new Date(value);
//   if (!isNaN(d)) {
//     return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
//       d.getDate()
//     ).padStart(2, "0")}`;
//   }
//   return "";
// };

// const Useraccount = () => {
//   const navigate = useNavigate();

//   const [profile, setProfile] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     gender: "",
//     dob: "",
//     profileImage: "",
//   });

//   const [addresses, setAddresses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editMode, setEditMode] = useState(false);

//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     gender: "",
//     dob: "",
//     profileImage: "",
//   });

//   const [imageFile, setImageFile] = useState(null);

//   // Fetch Profile
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await fetch(API_BASE, { credentials: "include" });

//         if (res.status === 401 || res.status === 403) {
//           navigate("/login");
//           return;
//         }

//         if (!res.ok) throw new Error("Failed to fetch profile");

//         const data = await res.json();

//         const profileData = {
//           fullName: data.profile.fullName || "",
//           email: data.profile.email || "",
//           phone: data.profile.phone || "",
//           gender: data.profile.gender || "",
//           dob: toInputDate(data.profile.dob),
//           profileImage: data.profile.profileImage || "",
//         };

//         setProfile(profileData);
//         setAddresses(data.addresses || []);
//         setFormData({ ...profileData });
//       } catch (err) {
//         console.error("Error fetching profile:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [navigate]);

//   const readError = async (res) => {
//     let msg = `${res.status} ${res.statusText}`;
//     try {
//       const data = await res.json();
//       if (data?.message) msg = data.message;
//       else if (data?.error) msg = data.error;
//     } catch { }
//     return msg;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((p) => ({ ...p, [name]: value }));
//   };

//   const handleImageChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setImageFile(file);

//     const formDataImg = new FormData();
//     formDataImg.append("image", file);

//     try {
//       const resImg = await fetch(`${API_BASE}/avatar`, {
//         method: "POST",
//         credentials: "include",
//         body: formDataImg,
//       });

//       if (!resImg.ok) throw new Error(await readError(resImg));
//       const imgData = await resImg.json();

//       setProfile((prev) => ({
//         ...prev,
//         profileImage: imgData?.profileImage || prev.profileImage,
//       }));
//       setFormData((prev) => ({
//         ...prev,
//         profileImage: imgData?.profileImage || prev.profileImage,
//       }));

//       alert("Avatar updated successfully ✅");
//     } catch (err) {
//       console.error("Avatar upload error:", err);
//       alert("Failed to upload avatar");
//     }
//   };

//   const handleSaveProfile = async () => {
//     try {
//       const payload = {
//         fullName: formData.fullName,
//         email: formData.email,
//         phone: formData.phone,
//         gender: formData.gender || undefined,
//         dob: formData.dob
//           ? (() => {
//             const [year, month, day] = formData.dob.split("-");
//             return `${day}-${month}-${year}`;
//           })()
//           : undefined,
//       };

//       const res = await fetch(API_BASE, {
//         method: "PATCH",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error(await readError(res));

//       const updated = await res.json();
//       const updatedProfile = updated.profile || updated;

//       const updatedData = {
//         fullName: updatedProfile.fullName || formData.fullName,
//         email: updatedProfile.email || formData.email,
//         phone: updatedProfile.phone || formData.phone,
//         gender: updatedProfile.gender || formData.gender,
//         dob: updatedProfile.dob ? toInputDate(updatedProfile.dob) : formData.dob,
//         profileImage: updatedProfile.profileImage || formData.profileImage,
//       };

//       setProfile(updatedData);
//       setFormData(updatedData);
//       setEditMode(false);
//       alert("Profile updated successfully ✅");
//     } catch (err) {
//       console.error("Save error:", err);
//       alert(err.message || "Failed to update profile");
//     }
//   };

//   // Address Handlers (passed to AddressSections)
//   const handleAddressChange = (index, field, value) => {
//     const newAddrs = [...addresses];
//     newAddrs[index][field] = value;
//     setAddresses(newAddrs);
//   };

//   const handleAddNewAddress = () => {
//     setAddresses((prev) => [
//       ...prev,
//       { name: "", addressLine1: "", city: "", state: "", pincode: "", phone: "", email: "" },
//     ]);
//   };

//   const handleSaveAddress = async (index) => {
//     const addr = addresses[index];
//     try {
//       let res, data;
//       if (!addr._id) {
//         res = await fetch(`${API_BASE}/address`, {
//           method: "POST",
//           credentials: "include",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(addr),
//         });
//       } else {
//         const { _id, ...payload } = addr;
//         res = await fetch(`${API_BASE}/address/${_id}`, {
//           method: "PATCH",
//           credentials: "include",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         });
//       }

//       if (!res.ok) throw new Error(await readError(res));
//       data = await res.json();

//       const updatedAddrs = [...addresses];
//       updatedAddrs[index] = data;
//       setAddresses(updatedAddrs);
//       alert("Address saved successfully ✅");
//     } catch (err) {
//       console.error("Address save error:", err);
//       alert("Failed to save address: " + err.message);
//     }
//   };

//   const handleDeleteAddress = async (index) => {
//     const addr = addresses[index];
//     try {
//       if (addr._id) {
//         const res = await fetch(`${API_BASE}/address/${addr._id}`, {
//           method: "DELETE",
//           credentials: "include",
//         });
//         if (!res.ok) throw new Error(await readError(res));
//       }
//       setAddresses((prev) => prev.filter((_, i) => i !== index));
//       alert("Address deleted successfully ✅");
//     } catch (err) {
//       console.error("Delete address error:", err);
//       alert("Failed to delete address: " + err.message);
//     }
//   };

//   const handleDeleteAccount = async () => {
//     const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
//     if (!confirmDelete) return;

//     try {
//       const res = await fetch("https://beauty.joyory.com/api/user/delete-account", {
//         method: "DELETE",
//         credentials: "include",
//       });

//       if (!res.ok) {
//         const errorText = await res.text();
//         throw new Error(`Delete account failed: ${res.status} ${errorText}`);
//       }

//       alert("Account deleted successfully ✅");
//       navigate("/login");
//     } catch (err) {
//       console.error("Delete account error:", err);
//       alert("Failed to delete account. Please try again.");
//     }
//   };

//   // if (loading) return <div className="ua-loading"><div className="ua-spinner" /></div>;
//   if (loading)
//     return (
//       <div
//         className="fullscreen-loader page-title-main-name"
//         style={{
//           minHeight: "100vh",
//           width: "100%",
//         }}
//       >
//         <div className="text-center">
//           <DotLottieReact className='foryoulanding-css'
//             src="https:lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
//             loop
//             autoplay
//           />


//           <p className="text-muted mb-0">
//             Please wait while we prepare the best products for you...
//           </p>
//         </div>
//       </div>
//     );
//   if (!profile) return null;

//   return (
//     <>
//       <Header />

//       <div className="ua-page mt-lg-5 pt-lg-5 mt-md-0 pt-md-5">
//         <section className="Heading-Name mt-lg-5 pt-lg-3 mt-md-0 pt-md-0">
//           <h3 className="ua-title ms-4 page-title-main-name">Personal Details</h3>
//           <Sidebarcomon />
//         </section>

//         <main className="ua-content mt-lg-5 pt-lg-3 mt-md-0 pt-md-0">
//           <section className="ua-card">
//             <h3 className="ua-title page-title-main-name">Personal Details</h3>

//             {/* Avatar */}
//             <div className="ua-avatar-row">
//               <div className="ua-avatar">
//                 <img
//                   src={profile.profileImage || "/default-avatar.png"}
//                   alt="avatar"
//                   onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
//                 />
//                 {editMode && (
//                   <label className="ua-avatar-edit">
//                     <input className="page-title-main-name" type="file" onChange={handleImageChange} />
//                     ✎
//                   </label>
//                 )}
//               </div>
//             </div>

//             {/* Gender Selection */}
//             <div className="ua-field-group">
//               <label className="ua-label page-title-main-name">Gender</label>
//               <div className="ua-gender page-title-main-name">
//                 {["female", "male", "non-binary", "prefer-not"].map((g) => (
//                   <button
//                     key={g}
//                     type="button"
//                     className={formData.gender === g ? "active" : ""}
//                     disabled={!editMode}
//                     onClick={() => setFormData((p) => ({ ...p, gender: g }))}
//                   >
//                     {g === "prefer-not" ? "Prefer not to say" : g.charAt(0).toUpperCase() + g.slice(1)}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Personal Details Form */}
//             <form className="ua-form" onSubmit={(e) => e.preventDefault()}>
//               <div className="ua-row">
//                 <div className="ua-field page-title-main-name">
//                   <label className="ua-label">Full Name</label>
//                   <input
//                     name="fullName"
//                     value={formData.fullName || ""}
//                     onChange={handleChange}
//                     disabled={!editMode}
//                   />
//                 </div>
//                 <div className="ua-field page-title-main-name">
//                   <label className="ua-label">Email ID</label>
//                   <input
//                     name="email"
//                     value={formData.email || ""}
//                     onChange={handleChange}
//                     disabled={!editMode}
//                   />
//                 </div>
//                 <div className="ua-field page-title-main-name">
//                   <label className="ua-label">Phone Number</label>
//                   <input
//                     name="phone"
//                     value={formData.phone || ""}
//                     onChange={handleChange}
//                     disabled={!editMode}
//                     placeholder="10 digit mobile number"
//                   />
//                 </div>
//                 <div className="ua-field page-title-main-name">
//                   <label className="ua-label">Birth Date</label>
//                   <input
//                     type="date"
//                     name="dob"
//                     value={formData.dob || ""}
//                     onChange={handleChange}
//                     disabled={!editMode}
//                   />
//                 </div>

//                 <div className="ua-field ua-actions page-title-main-name">
//                   {!editMode ? (
//                     <button type="button" className="ua-btn edit-save-profile-button" onClick={() => setEditMode(true)}>
//                       Edit Profile
//                     </button>
//                   ) : (
//                     <button type="button" className="ua-btn  edit-save-profile-button" onClick={handleSaveProfile}>
//                       Save Profile
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </form>

//             {/* Separated Address Section with Per-Address Edit */}
//             <AddressSections
//               addresses={addresses}
//               handleAddressChange={handleAddressChange}
//               handleSaveAddress={handleSaveAddress}
//               handleDeleteAddress={handleDeleteAddress}
//               handleAddNewAddress={handleAddNewAddress}
//             />

//             <div className="ua-danger mt-4">
//               <button className="ua-delete page-title-main-name" onClick={handleDeleteAccount}>
//                 Delete Account
//               </button>
//             </div>
//           </section>
//         </main>
//       </div>

//       <Footer />
//     </>
//   );
// };

// export default Useraccount;

















import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Useraccount.css";
import "../App.css";
import Sidebarcomon from "./Sidebarcomon";
import Footer from "./Footer";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Header from "./Header";
import { FaTimes } from "react-icons/fa";
import AddressSections from "./AddressSections";

const API_BASE = "https://beauty.joyory.com/api/user/profile";

const toInputDate = (value) => {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  const d = new Date(value);
  if (!isNaN(d)) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
  }
  return "";
};

const Useraccount = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    profileImage: "",
  });

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    profileImage: "",
  });

  // Fetch Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(API_BASE, { credentials: "include" });

        if (res.status === 401 || res.status === 403) {
          navigate("/login");
          return;
        }

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();

        const profileData = {
          fullName: data.profile.fullName || "",
          email: data.profile.email || "",
          phone: data.profile.phone || "",
          gender: data.profile.gender || "",
          dob: toInputDate(data.profile.dob),
          profileImage: data.profile.profileImage || "",
        };

        setProfile(profileData);
        setAddresses(data.addresses || []);
        setFormData({ ...profileData });
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const readError = async (res) => {
    let msg = `${res.status} ${res.statusText}`;
    try {
      const data = await res.json();
      if (data?.message) msg = data.message;
      else if (data?.error) msg = data.error;
    } catch { }
    return msg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  // ✅ FIXED: Handle image upload with proper loading state
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert("Please select a valid image file (JPEG, PNG, GIF, WEBP)");
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setImageLoading(true);

    const formDataImg = new FormData();
    formDataImg.append("image", file);

    try {
      const resImg = await fetch(`${API_BASE}/avatar`, {
        method: "POST",
        credentials: "include",
        body: formDataImg,
      });

      if (!resImg.ok) throw new Error(await readError(resImg));
      const imgData = await resImg.json();

      const newImageUrl = imgData?.profileImage || imgData?.image || "";
      
      setProfile((prev) => ({
        ...prev,
        profileImage: newImageUrl,
      }));
      setFormData((prev) => ({
        ...prev,
        profileImage: newImageUrl,
      }));

      alert("Avatar updated successfully ✅");
    } catch (err) {
      console.error("Avatar upload error:", err);
      alert("Failed to upload avatar: " + err.message);
    } finally {
      setImageLoading(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // ✅ NEW: Remove profile image
  const handleRemoveImage = async () => {
    const confirmRemove = window.confirm("Are you sure you want to remove your profile picture?");
    if (!confirmRemove) return;

    setImageLoading(true);

    try {
      const res = await fetch(`${API_BASE}/avatar`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error(await readError(res));

      setProfile((prev) => ({
        ...prev,
        profileImage: "",
      }));
      setFormData((prev) => ({
        ...prev,
        profileImage: "",
      }));

      alert("Profile picture removed successfully ✅");
    } catch (err) {
      console.error("Remove avatar error:", err);
      alert("Failed to remove profile picture: " + err.message);
    } finally {
      setImageLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSaveProfile = async () => {
    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender || undefined,
        dob: formData.dob
          ? (() => {
            const [year, month, day] = formData.dob.split("-");
            return `${day}-${month}-${year}`;
          })()
          : undefined,
      };

      const res = await fetch(API_BASE, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await readError(res));

      const updated = await res.json();
      const updatedProfile = updated.profile || updated;

      const updatedData = {
        fullName: updatedProfile.fullName || formData.fullName,
        email: updatedProfile.email || formData.email,
        phone: updatedProfile.phone || formData.phone,
        gender: updatedProfile.gender || formData.gender,
        dob: updatedProfile.dob ? toInputDate(updatedProfile.dob) : formData.dob,
        profileImage: updatedProfile.profileImage || formData.profileImage,
      };

      setProfile(updatedData);
      setFormData(updatedData);
      setEditMode(false);
      alert("Profile updated successfully ✅");
    } catch (err) {
      console.error("Save error:", err);
      alert(err.message || "Failed to update profile");
    }
  };

  // Address Handlers (passed to AddressSections)
  const handleAddressChange = (index, field, value) => {
    const newAddrs = [...addresses];
    newAddrs[index][field] = value;
    setAddresses(newAddrs);
  };

  const handleAddNewAddress = () => {
    setAddresses((prev) => [
      ...prev,
      { name: "", addressLine1: "", city: "", state: "", pincode: "", phone: "", email: "" },
    ]);
  };

  const handleSaveAddress = async (index) => {
    const addr = addresses[index];
    try {
      let res, data;
      if (!addr._id) {
        res = await fetch(`${API_BASE}/address`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(addr),
        });
      } else {
        const { _id, ...payload } = addr;
        res = await fetch(`${API_BASE}/address/${_id}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error(await readError(res));
      data = await res.json();

      const updatedAddrs = [...addresses];
      updatedAddrs[index] = data;
      setAddresses(updatedAddrs);
      alert("Address saved successfully ✅");
    } catch (err) {
      console.error("Address save error:", err);
      alert("Failed to save address: " + err.message);
    }
  };

  const handleDeleteAddress = async (index) => {
    const addr = addresses[index];
    try {
      if (addr._id) {
        const res = await fetch(`${API_BASE}/address/${addr._id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (!res.ok) throw new Error(await readError(res));
      }
      setAddresses((prev) => prev.filter((_, i) => i !== index));
      alert("Address deleted successfully ✅");
    } catch (err) {
      console.error("Delete address error:", err);
      alert("Failed to delete address: " + err.message);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
      const res = await fetch("https://beauty.joyory.com/api/user/delete-account", {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Delete account failed: ${res.status} ${errorText}`);
      }

      alert("Account deleted successfully ✅");
      navigate("/login");
    } catch (err) {
      console.error("Delete account error:", err);
      alert("Failed to delete account. Please try again.");
    }
  };

  if (loading)
    return (
      <div
        className="fullscreen-loader page-title-main-name"
        style={{
          minHeight: "100vh",
          width: "100%",
        }}
      >
        <div className="text-center">
          <DotLottieReact className='foryoulanding-css'
            src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
            loop
            autoplay
          />
          <p className="text-muted mb-0">
            Please wait while we prepare the best products for you...
          </p>
        </div>
      </div>
    );
    
  if (!profile) return null;

  // ✅ Helper to get image URL with cache busting
  const getImageUrl = (url) => {
    if (!url) return "/default-avatar.png";
    // Add timestamp to prevent caching issues
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${Date.now()}`;
  };

  return (
    <>
      <Header />

      <div className="ua-page mt-lg-5 pt-lg-5 mt-md-0 pt-md-5">
        <section className="Heading-Name mt-lg-5 pt-lg-3 mt-md-0 pt-md-0">
          <h3 className="ua-title ms-4 page-title-main-name">Personal Details</h3>
          <Sidebarcomon />
        </section>

        <main className="ua-content mt-lg-5 pt-lg-3 mt-md-0 pt-md-0">
          <section className="ua-card">
            <h3 className="ua-title page-title-main-name">Personal Details</h3>

            {/* ✅ FIXED: Avatar with remove button and proper loading state */}
            <div className="ua-avatar-row">
              <div className="ua-avatar-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
                <div className="ua-avatar" style={{ position: 'relative' }}>
  {imageLoading ? (
    <div className="ua-avatar-loading" style={{
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5'
    }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  ) : profile.profileImage ? (
    <img
      src={getImageUrl(profile.profileImage)}
      alt="avatar"
      style={{
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '2px solid #e0e0e0'
      }}
      onError={(e) => {
        e.currentTarget.src = "/default-avatar.png";
        e.currentTarget.onerror = null;
      }}
    />
  ) : (
    <div style={{
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f0f0',
      border: '2px solid #e0e0e0'
    }}>
      <svg 
        width="60" 
        height="60" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.6 }}
      >
        <circle cx="12" cy="8" r="4" fill="#999999" />
        <path 
          d="M12 14C8.68629 14 6 16.6863 6 20H18C18 16.6863 15.3137 14 12 14Z" 
          fill="#999999" 
        />
      </svg>
    </div>
  )}
  
  {/* Remove image button - only show if image exists and in edit mode */}
  {editMode && profile.profileImage && !imageLoading && (
    <button
      className="ua-avatar-remove"
      onClick={handleRemoveImage}
      style={{
        position: 'absolute',
        top: '5px',
        right: '5px',
        background: '#ff4444',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '28px',
        height: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        transition: 'all 0.2s ease'
      }}
      title="Remove profile picture"
    >
      <FaTimes size={14} />
    </button>
  )}
</div>
                
                {editMode && (
                  <label 
                    className="ua-avatar-edit" 
                    style={{
                      position: 'absolute',
                      bottom: '5px',
                      right: '5px',
                      background: '#000',
                      color: 'white',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                  >
                    <input 
                      ref={fileInputRef}
                      className="page-title-main-name" 
                      type="file" 
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleImageChange} 
                      disabled={imageLoading}
                      style={{ display: 'none' }}
                    />
                    ✎
                  </label>
                )}
              </div>
            </div>

            {/* Gender Selection */}
            <div className="ua-field-group">
              <label className="ua-label page-title-main-name">Gender</label>
              <div className="ua-gender page-title-main-name">
                {["female", "male", "non-binary", "prefer-not"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    className={formData.gender === g ? "active" : ""}
                    disabled={!editMode}
                    onClick={() => setFormData((p) => ({ ...p, gender: g }))}
                  >
                    {g === "prefer-not" ? "Prefer not to say" : g.charAt(0).toUpperCase() + g.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Personal Details Form */}
            <form className="ua-form" onSubmit={(e) => e.preventDefault()}>
              <div className="ua-row">
                <div className="ua-field page-title-main-name">
                  <label className="ua-label">Full Name</label>
                  <input
                    name="fullName"
                    value={formData.fullName || ""}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </div>
                <div className="ua-field page-title-main-name">
                  <label className="ua-label">Email ID</label>
                  <input
                    name="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </div>
                <div className="ua-field page-title-main-name">
                  <label className="ua-label">Phone Number</label>
                  <input
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleChange}
                    disabled={!editMode}
                    placeholder="10 digit mobile number"
                  />
                </div>
                <div className="ua-field page-title-main-name">
                  <label className="ua-label">Birth Date</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob || ""}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </div>

                <div className="ua-field ua-actions page-title-main-name">
                  {!editMode ? (
                    <button type="button" className="ua-btn edit-save-profile-button" onClick={() => setEditMode(true)}>
                      Edit Profile
                    </button>
                  ) : (
                    <button type="button" className="ua-btn edit-save-profile-button" onClick={handleSaveProfile}>
                      Save Profile
                    </button>
                  )}
                </div>
              </div>
            </form>

            {/* Separated Address Section with Per-Address Edit */}
            <AddressSections
              addresses={addresses}
              handleAddressChange={handleAddressChange}
              handleSaveAddress={handleSaveAddress}
              handleDeleteAddress={handleDeleteAddress}
              handleAddNewAddress={handleAddNewAddress}
            />

            <div className="ua-danger mt-4">
              <button className="ua-delete page-title-main-name" onClick={handleDeleteAccount}>
                Delete Account
              </button>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </>
  );
};

export default Useraccount;
