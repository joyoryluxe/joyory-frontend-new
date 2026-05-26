// // src/components/GiftCards.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "../css/GiftCards.css";
// import Footer from "./Footer";
// import Header from "./Header";
// const API_BASE = "https://beauty.joyory.com/api/user/giftcards";

// export default function MyGiftCard() {
//     const [templates, setTemplates] = useState([]);
//     const [selected, setSelected] = useState(null);
//     const [form, setForm] = useState({
//         recipientName: "",
//         recipientEmail: "",
//         message: "",
//         amount: "",
//     });
//     const [loading,] = useState(false);

//     // Fetch templates
//     useEffect(() => {
//         axios
//             .get(`${API_BASE}/templates`)
//             .then((res) => setTemplates(res.data || []))
//             .catch((err) => console.error("Error fetching templates:", err));
//     }, []);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setForm((p) => ({ ...p, [name]: value }));
//     };

//     const handlePayment = async () => {
//         if (!selected) return alert("Please select a template first.");
//         const amount = Number(form.amount);

//         // basic validations
//         if (!form.recipientName || !form.recipientEmail) {
//             return alert("Please enter recipient name and email.");
//         }
//         if (!amount || isNaN(amount)) {
//             return alert("Please enter a valid amount.");
//         }
//         if (amount < selected.minAmount || amount > selected.maxAmount) {
//             return alert(`Amount must be between ₹${selected.minAmount} and ₹${selected.maxAmount}`);
//         }

//         const token = localStorage.getItem("token");
//         if (!token) return alert("Please log in to buy a gift card.");

//         try {
//             // Step 1: Create order in backend
//             const createResp = await axios.post(
//                 `${API_BASE}/create-order`,
//                 {
//                     templateId: selected._id,
//                     amount,
//                     recipient: {
//                         name: form.recipientName,
//                         email: form.recipientEmail,
//                     },
//                     message: form.message,
//                 },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );

//             const order = createResp.data?.order;
//             if (!order) throw new Error("Failed to create Razorpay order");

//             // Step 2: Load Razorpay SDK dynamically
//             const scriptLoaded = await new Promise((resolve) => {
//                 if (window.Razorpay) return resolve(true);
//                 const script = document.createElement("script");
//                 script.src = "https://checkout.razorpay.com/v1/checkout.js";
//                 script.onload = () => resolve(true);
//                 script.onerror = () => resolve(false);
//                 document.body.appendChild(script);
//             });
//             if (!scriptLoaded) return alert("Failed to load Razorpay SDK");

//             // Step 3: Open Razorpay checkout
//             const options = {
//                 key: "rzp_test_YK2tGGnqcok3dj", // 🔑 replace with your Razorpay key
//                 amount: order.amount,
//                 currency: order.currency || "INR",
//                 name: "Joyory",
//                 description: `Gift Card - ${selected.title}`,
//                 order_id: order.id,
//                 handler: async function (response) {
//                     try {
//                         // Step 4: Verify payment
//                         await axios.post(
//                             `${API_BASE}/verify-payment`,
//                             {
//                                 razorpay_order_id: response.razorpay_order_id,
//                                 razorpay_payment_id: response.razorpay_payment_id,
//                                 razorpay_signature: response.razorpay_signature,
//                             },
//                             { headers: { Authorization: `Bearer ${token}` } }
//                         );

//                         alert("✅ Gift card issued & email sent to recipient!");
//                         setSelected(null);
//                         setForm({ recipientName: "", recipientEmail: "", message: "", amount: "" });
//                     } catch (err) {
//                         console.error("Verification failed:", err);
//                         alert(err.response?.data?.message || "Payment verification failed");
//                     }
//                 },
//                 prefill: {
//                     name: form.recipientName,
//                     email: form.recipientEmail,
//                 },
//                 theme: { color: "#0d6efd" }, // bootstrap primary
//             };

//             const rzp = new window.Razorpay(options);
//             rzp.open();
//         } catch (err) {
//             console.error("Error initiating payment:", err);
//             alert(err.response?.data?.message || err.message || "Error initiating payment");
//         }
//     };


//     return (

// <>

// <Header />

// <div className="background-colors-for-gifting">
//             <h2 className="text-center mb-3">My Gift Card</h2>
//             <p className="text-center text-muted mb-4">
//                 Choose a gift card for your loved ones and make their day special with Joyory's curated selection
//             </p>

//             </div>







//         <div className="container py-5">
//             {!selected ? (
//                 <div className="row g-4">
//                     {templates.map((tpl) => (
//                         <div key={tpl._id} className="col-md-4">
//                             <div className="card h-100 shadow-sm gift-card">
//                                 <img
//                                     src={tpl.image}
//                                     alt={tpl.title}
//                                     className="card-img-top gift-card-img"
//                                 />
//                                 <div className="card-body d-flex flex-column">
//                                     <h5 className="card-title fw-bold">{tpl.title}</h5>
//                                     <p className="card-text text-muted">{tpl.description}</p>
//                                     <p className="text-primary fw-semibold mb-3">
//                                         Starts at ₹{tpl.minAmount}
//                                     </p>
//                                     <button
//                                         className="btn btn-primary mt-auto"
//                                         onClick={() => setSelected(tpl)}
//                                     >
//                                         Buy Now
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             ) : (
//                 <div className="row g-4">
//                     {/* Left Form */}
//                     <div className="col-md-6">
//                         <div className="card shadow-sm p-4">
//                             <h4 className="mb-4">Who is this for?</h4>

//                             <div className="mb-3">
//                                 <label className="form-label">Recipient Name</label>
//                                 <input
//                                     type="text"
//                                     name="recipientName"
//                                     className="form-control"
//                                     value={form.recipientName}
//                                     onChange={handleChange}
//                                 />
//                             </div>

//                             <div className="mb-3">
//                                 <label className="form-label">Recipient Email</label>
//                                 <input
//                                     type="email"
//                                     name="recipientEmail"
//                                     className="form-control"
//                                     value={form.recipientEmail}
//                                     onChange={handleChange}
//                                 />
//                             </div>

//                             <div className="mb-3">
//                                 <label className="form-label">Message</label>
//                                 <textarea
//                                     name="message"
//                                     className="form-control"
//                                     rows="3"
//                                     value={form.message}
//                                     onChange={handleChange}
//                                 />
//                             </div>

//                             <div className="mb-3">
//                                 <label className="form-label">Amount</label>
//                                 <input
//                                     type="number"
//                                     name="amount"
//                                     className="form-control"
//                                     placeholder={`Enter amount (₹${selected.minAmount} - ₹${selected.maxAmount})`}
//                                     value={form.amount}
//                                     onChange={handleChange}
//                                 />
//                             </div>

//                             <button
//                                 className="btn btn-success w-100"
//                                 onClick={handlePayment}
//                                 disabled={loading}
//                             >
//                                 {loading ? "Processing..." : "Proceed to Pay"}
//                             </button>
//                             <button
//                                 className="btn btn-outline-secondary w-100 mt-2"
//                                 onClick={() => setSelected(null)}
//                             >
//                                 Back to Templates
//                             </button>
//                         </div>
//                     </div>

//                     {/* Right Preview */}
//                     <div className="col-md-6">
//                         <div className="card shadow-sm p-4 text-center gift-preview">
//                             <h5 className="mb-3">Gift Card Preview</h5>
//                             <img
//                                 src={selected.image}
//                                 alt={selected.title}
//                                 className="img-fluid rounded mb-3 gift-preview-img"
//                             />
//                             <p><strong>To:</strong> {form.recipientName || "Recipient Name"}</p>
//                             <p><strong>Message:</strong> {form.message || "Your personalized message..."}</p>
//                             <p><strong>Amount:</strong> ₹{form.amount || 0}</p>
//                             <p><strong>From:</strong> You</p>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>

//     <Footer />

//         </>
//     );
// }
















// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "../css/GiftCards.css";
// import Footer from "./Footer";
// import Header from "./Header";

// const API_BASE = "https://beauty.joyory.com/api/user/giftcards";

// export default function GiftCards() {
//     const [templates, setTemplates] = useState([]);
//     const [selected, setSelected] = useState(null);
//     const [form, setForm] = useState({
//         recipientName: "",
//         recipientEmail: "",
//         message: "",
//         amount: "",
//     });
//     const [loading, setLoading] = useState(false);

//     // ✅ New states for filters
//     const [voucherFilter, setVoucherFilter] = useState("all");
//     const [valueFilter, setValueFilter] = useState("all");

//     // Fetch templates
//     useEffect(() => {
//         axios
//             .get(`${API_BASE}/templates`)
//             .then((res) => setTemplates(res.data || []))
//             .catch((err) => console.error("Error fetching templates:", err));
//     }, []);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setForm((p) => ({ ...p, [name]: value }));
//     };

//     const handlePayment = async () => {
//         if (!selected) return alert("Please select a template first.");
//         const amount = Number(form.amount);

//         // basic validations
//         if (!form.recipientName || !form.recipientEmail) {
//             return alert("Please enter recipient name and email.");
//         }
//         if (!amount || isNaN(amount)) {
//             return alert("Please enter a valid amount.");
//         }
//         if (amount < selected.minAmount || amount > selected.maxAmount) {
//             return alert(`Amount must be between ₹${selected.minAmount} and ₹${selected.maxAmount}`);
//         }

//         setLoading(true);
//         try {
//             // Step 1: Create order in backend
//             const createResp = await axios.post(
//                 `${API_BASE}/create-order`,
//                 {
//                     templateId: selected._id,
//                     amount,
//                     recipient: {
//                         name: form.recipientName,
//                         email: form.recipientEmail,
//                     },
//                     message: form.message,
//                 },
//                 { withCredentials: true } // ✅ send HTTP-only cookie
//             );

//             const order = createResp.data?.order;
//             if (!order) throw new Error("Failed to create Razorpay order");

//             // Step 2: Load Razorpay SDK dynamically
//             const scriptLoaded = await new Promise((resolve) => {
//                 if (window.Razorpay) return resolve(true);
//                 const script = document.createElement("script");
//                 script.src = "https://checkout.razorpay.com/v1/checkout.js";
//                 script.onload = () => resolve(true);
//                 script.onerror = () => resolve(false);
//                 document.body.appendChild(script);
//             });
//             if (!scriptLoaded) return alert("Failed to load Razorpay SDK");

//             // Step 3: Open Razorpay checkout
//             const options = {
//                 key: "rzp_test_RHpYsCY6tqQ3TW", // 🔑 replace with your Razorpay key
//                 amount: order.amount,
//                 currency: order.currency || "INR",
//                 name: "Joyory",
//                 description: `Gift Card - ${selected.title}`,
//                 order_id: order.id,
//                 handler: async function (response) {
//                     // ✅ Show payment data in console
//                     console.log("✅ Razorpay Payment Response:");
//                     console.log("razorpay_order_id:", response.razorpay_order_id);
//                     console.log("razorpay_payment_id:", response.razorpay_payment_id);
//                     console.log("razorpay_signature:", response.razorpay_signature);

//                     try {
//                         // Step 4: Verify payment
//                         await axios.post(
//                             `${API_BASE}/verify-payment`,
//                             {
//                                 razorpay_order_id: response.razorpay_order_id,
//                                 razorpay_payment_id: response.razorpay_payment_id,
//                                 razorpay_signature: response.razorpay_signature,
//                             },
//                             { withCredentials: true } // ✅ send cookie
//                         );

//                         alert("✅ Gift card issued & email sent to recipient!");
//                         setSelected(null);
//                         setForm({ recipientName: "", recipientEmail: "", message: "", amount: "" });
//                     } catch (err) {
//                         console.error("Verification failed:", err);
//                         alert(err.response?.data?.message || "Payment verification failed");
//                     }
//                 },
//                 prefill: {
//                     name: form.recipientName,
//                     email: form.recipientEmail,
//                 },
//                 theme: { color: "#0d6efd" },
//             };

//             const rzp = new window.Razorpay(options);
//             rzp.open();
//         } catch (err) {
//             console.error("Error initiating payment:", err);
//             alert(err.response?.data?.message || err.message || "Error initiating payment");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ✅ Filter logic before rendering
//     const filteredTemplates = templates.filter((tpl) => {
//         if (voucherFilter !== "all" && tpl.category !== voucherFilter) return false;

//         if (valueFilter === "low" && tpl.minAmount >= 500) return false;
//         if (valueFilter === "mid" && (tpl.minAmount < 500 || tpl.minAmount > 1000)) return false;
//         if (valueFilter === "high" && tpl.minAmount <= 1000) return false;

//         return true;
//     });

//     return (
//         <>
//             <Header />

//             <div className="background-colors-for-gifting">
//                 <h2 className="text-center mb-3">My Gift Card</h2>
//                 <p className="text-center text-muted mb-4">
//                     Choose a gift card for your loved ones and make their day special with Joyory's curated selection
//                 </p>
//             </div>

//             <div className="bg">
//                 <div className="filter-backenground">
//                 <div className="container">
//                     {!selected && (
//                         <div className="">
//                             <div className="d-flex justify-content-end align-items-center mb-4 gap-3">
//                                 <div className="d-flex align-items-center gap-2">
//                                     <label className="fw-semibold">Filter by:</label>
//                                     <select
//                                         className="form-select"
//                                         style={{ width: "180px" }}
//                                         value={voucherFilter}
//                                         onChange={(e) => setVoucherFilter(e.target.value)}
//                                     >
//                                         <option value="all">All Vouchers</option>
//                                         <option value="birthday">Birthday</option>
//                                         <option value="anniversary">Anniversary</option>
//                                         <option value="special">Special</option>
//                                     </select>
//                                 </div>

//                                 <select
//                                     className="form-select"
//                                     style={{ width: "150px" }}
//                                     value={valueFilter}
//                                     onChange={(e) => setValueFilter(e.target.value)}
//                                 >
//                                     <option value="all">All Values</option>
//                                     <option value="low">Below ₹500</option>
//                                     <option value="mid">₹500 - ₹1000</option>
//                                     <option value="high">Above ₹1000</option>
//                                 </select>
//                             </div>
//                         </div>
//                     )}

//                        </div>
// </div>
//                     <div className="container py-5">
//                         {/* ✅ Filter bar added here */}


//                         {!selected ? (
//                             <div className="row g-4">
//                                 {filteredTemplates.map((tpl) => (
//                                     <div key={tpl._id} className="col-md-4">
//                                         <div className="card h-100 shadow-sm gift-card">
//                                             <img
//                                                 src={tpl.image}
//                                                 alt={tpl.title}
//                                                 className="card-img-top gift-card-img"
//                                             />
//                                             <div className="card-body d-flex flex-column">
//                                                 <h5 className="card-title fw-bold">{tpl.title}</h5>
//                                                 <p className="card-text text-muted">{tpl.description}</p>
//                                                 <p className="text-primary fw-semibold mb-3">
//                                                     Starts at ₹{tpl.minAmount}
//                                                 </p>
//                                                 <button
//                                                     className="btn btn-primary mt-auto"
//                                                     onClick={() => setSelected(tpl)}
//                                                 >
//                                                     Buy Now
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         ) : (
//                             <div className="row g-4">
//                                 {/* Left Form */}
//                                 <div className="col-md-6">
//                                     <div className="card shadow-sm p-4">
//                                         <h4 className="mb-4">Who is this for?</h4>

//                                         <div className="mb-3">
//                                             <label className="form-label">Recipient Name</label>
//                                             <input
//                                                 type="text"
//                                                 name="recipientName"
//                                                 className="form-control"
//                                                 value={form.recipientName}
//                                                 onChange={handleChange}
//                                             />
//                                         </div>

//                                         <div className="mb-3">
//                                             <label className="form-label">Recipient Email</label>
//                                             <input
//                                                 type="email"
//                                                 name="recipientEmail"
//                                                 className="form-control"
//                                                 value={form.recipientEmail}
//                                                 onChange={handleChange}
//                                             />
//                                         </div>

//                                         <div className="mb-3">
//                                             <label className="form-label">Message</label>
//                                             <textarea
//                                                 name="message"
//                                                 className="form-control"
//                                                 rows="3"
//                                                 value={form.message}
//                                                 onChange={handleChange}
//                                             />
//                                         </div>

//                                         <div className="mb-3">
//                                             <label className="form-label">Amount</label>
//                                             <input
//                                                 type="number"
//                                                 name="amount"
//                                                 className="form-control"
//                                                 placeholder={`Enter amount (₹${selected.minAmount} - ₹${selected.maxAmount})`}
//                                                 value={form.amount}
//                                                 onChange={handleChange}
//                                             />
//                                         </div>

//                                         <button
//                                             className="btn btn-success w-100"
//                                             onClick={handlePayment}
//                                             disabled={loading}
//                                         >
//                                             {loading ? "Processing..." : "Proceed to Pay"}
//                                         </button>
//                                         <button
//                                             className="btn btn-outline-secondary w-100 mt-2"
//                                             onClick={() => setSelected(null)}
//                                         >
//                                             Back to Templates
//                                         </button>
//                                     </div>
//                                 </div>

//                                 {/* Right Preview */}
//                                 <div className="col-md-6">
//                                     <div className="card shadow-sm p-4 text-center gift-preview">
//                                         <h5 className="mb-3">Gift Card Preview</h5>
//                                         <img
//                                             src={selected.image}
//                                             alt={selected.title}
//                                             className="img-fluid rounded mb-3 gift-preview-img"
//                                         />
//                                         <p><strong>To:</strong> {form.recipientName || "Recipient Name"}</p>
//                                         <p><strong>Message:</strong> {form.message || "Your personalized message..."}</p>
//                                         <p><strong>Amount:</strong> ₹{form.amount || 0}</p>
//                                         <p><strong>From:</strong> You</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>



//                 </div>


//             <Footer />
//         </>
//     );
// }















// // src/components/GiftCards.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "../css/GiftCards.css";
// import Footer from "./Footer";
// import Header from "./Header";

// const API_BASE = "https://beauty.joyory.com/api/user/giftcards";

// export default function GiftCards() {
//   const [templates, setTemplates] = useState([]);
//   const [selected, setSelected] = useState(null);
//   const [form, setForm] = useState({
//     recipientName: "",
//     recipientEmail: "",
//     message: "",
//     amount: "",
//   });
//   const [loading, setLoading] = useState(false);

//   // ✅ Filters (dynamic now)
//   const [categoryFilter, setCategoryFilter] = useState("all");
//   const [valueFilter, setValueFilter] = useState("all");
//   const [categories, setCategories] = useState([]);

//   // ✅ Fetch templates from API
//   useEffect(() => {
//     axios
//       .get(`${API_BASE}/templates`)
//       .then((res) => {
//         const data = res.data || [];
//         setTemplates(data);

//         // ✅ Extract unique categories dynamically
//         const uniqueCategories = [
//           ...new Set(data.map((tpl) => tpl.category || tpl.occasion || "Uncategorized")),
//         ];
//         setCategories(uniqueCategories);
//       })
//       .catch((err) => console.error("Error fetching templates:", err));
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((p) => ({ ...p, [name]: value }));
//   };

//   const handlePayment = async () => {
//     if (!selected) return alert("Please select a template first.");
//     const amount = Number(form.amount);

//     if (!form.recipientName || !form.recipientEmail) {
//       return alert("Please enter recipient name and email.");
//     }
//     if (!amount || isNaN(amount)) {
//       return alert("Please enter a valid amount.");
//     }
//     if (amount < selected.minAmount || amount > selected.maxAmount) {
//       return alert(`Amount must be between ₹${selected.minAmount} and ₹${selected.maxAmount}`);
//     }

//     setLoading(true);
//     try {
//       const createResp = await axios.post(
//         `${API_BASE}/create-order`,
//         {
//           templateId: selected._id,
//           amount,
//           recipient: {
//             name: form.recipientName,
//             email: form.recipientEmail,
//           },
//           message: form.message,
//         },
//         { withCredentials: true }
//       );

//       const order = createResp.data?.order;
//       if (!order) throw new Error("Failed to create Razorpay order");

//       const scriptLoaded = await new Promise((resolve) => {
//         if (window.Razorpay) return resolve(true);
//         const script = document.createElement("script");
//         script.src = "https://checkout.razorpay.com/v1/checkout.js";
//         script.onload = () => resolve(true);
//         script.onerror = () => resolve(false);
//         document.body.appendChild(script);
//       });
//       if (!scriptLoaded) return alert("Failed to load Razorpay SDK");

//       const options = {
//         key: "rzp_test_RHpYsCY6tqQ3TW",
//         amount: order.amount,
//         currency: order.currency || "INR",
//         name: "Joyory",
//         description: `Gift Card - ${selected.title}`,
//         order_id: order.id,
//         handler: async function (response) {
//           try {
//             await axios.post(
//               `${API_BASE}/verify-payment`,
//               {
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature: response.razorpay_signature,
//               },
//               { withCredentials: true }
//             );

//             alert("✅ Gift card issued & email sent to recipient!");
//             setSelected(null);
//             setForm({ recipientName: "", recipientEmail: "", message: "", amount: "" });
//           } catch (err) {
//             console.error("Verification failed:", err);
//             alert(err.response?.data?.message || "Payment verification failed");
//           }
//         },
//         prefill: {
//           name: form.recipientName,
//           email: form.recipientEmail,
//         },
//         theme: { color: "#0d6efd" },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (err) {
//       console.error("Error initiating payment:", err);
//       alert(err.response?.data?.message || err.message || "Error initiating payment");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Apply filters dynamically
//   const filteredTemplates = templates.filter((tpl) => {
//     const category = tpl.category || tpl.occasion || "Uncategorized";

//     if (categoryFilter !== "all" && category !== categoryFilter) return false;

//     if (valueFilter === "low" && tpl.minAmount >= 500) return false;
//     if (valueFilter === "mid" && (tpl.minAmount < 500 || tpl.minAmount > 1000)) return false;
//     if (valueFilter === "high" && tpl.minAmount <= 1000) return false;

//     return true;
//   });

//   return (
//     <>
//       <Header />

//       <div className="background-colors-for-gifting">
//         <h2 className="text-center mb-3">Gift Cards</h2>
//         <p className="text-center text-muted mb-4">
//           Choose a gift card for your loved ones and make their day special with Joyory's curated selection
//         </p>
//       </div>

//       <div className="bg">
//         <div className="filter-backenground">
//           <div className="container">
//             {!selected && (
//               <div className="d-flex justify-content-end align-items-center mb-4 gap-3">
//                 <div className="d-flex align-items-center gap-2">
//                   <label className="fw-semibold">Category:</label>
//                   <select
//                     className="form-select"
//                     style={{ width: "180px" }}
//                     value={categoryFilter}
//                     onChange={(e) => setCategoryFilter(e.target.value)}
//                   >
//                     <option value="all">All Categories</option>
//                     {categories.map((cat) => (
//                       <option key={cat} value={cat}>
//                         {cat}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="d-flex align-items-center gap-2">
//                   <label className="fw-semibold">Value:</label>
//                   <select
//                     className="form-select"
//                     style={{ width: "150px" }}
//                     value={valueFilter}
//                     onChange={(e) => setValueFilter(e.target.value)}
//                   >
//                     <option value="all">All Values</option>
//                     <option value="low">Below ₹500</option>
//                     <option value="mid">₹500 - ₹1000</option>
//                     <option value="high">Above ₹1000</option>
//                   </select>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="container py-5">
//           {!selected ? (
//             <div className="row g-4">
//               {filteredTemplates.map((tpl) => (
//                 <div key={tpl._id} className="col-md-4">
//                   <div className="card h-100 shadow-sm gift-card">
//                     <img src={tpl.image} alt={tpl.title} className="card-img-top gift-card-img" />
//                     <div className="card-body d-flex flex-column">
//                       <h5 className="card-title fw-bold">{tpl.title}</h5>
//                       <p className="card-text text-muted">{tpl.description}</p>
//                       <p className="text-primary fw-semibold mb-3">Starts at ₹{tpl.minAmount}</p>
//                       <button className="btn btn-primary mt-auto" onClick={() => setSelected(tpl)}>
//                         Buy Now
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               {filteredTemplates.length === 0 && (
//                 <p className="text-center text-muted">No gift cards found for the selected filters.</p>
//               )}
//             </div>
//           ) : (
//             <div className="row g-4">
//               <div className="col-md-6">
//                 <div className="card shadow-sm p-4">
//                   <h4 className="mb-4">Who is this for?</h4>
//                   <div className="mb-3">
//                     <label className="form-label">Recipient Name</label>
//                     <input
//                       type="text"
//                       name="recipientName"
//                       className="form-control"
//                       value={form.recipientName}
//                       onChange={handleChange}
//                     />
//                   </div>
//                   <div className="mb-3">
//                     <label className="form-label">Recipient Email</label>
//                     <input
//                       type="email"
//                       name="recipientEmail"
//                       className="form-control"
//                       value={form.recipientEmail}
//                       onChange={handleChange}
//                     />
//                   </div>
//                   <div className="mb-3">
//                     <label className="form-label">Message</label>
//                     <textarea
//                       name="message"
//                       className="form-control"
//                       rows="3"
//                       value={form.message}
//                       onChange={handleChange}
//                     />
//                   </div>
//                   <div className="mb-3">
//                     <label className="form-label">Amount</label>
//                     <input
//                       type="number"
//                       name="amount"
//                       className="form-control"
//                       placeholder={`Enter amount (₹${selected.minAmount} - ₹${selected.maxAmount})`}
//                       value={form.amount}
//                       onChange={handleChange}
//                     />
//                   </div>
//                   <button className="btn btn-success w-100" onClick={handlePayment} disabled={loading}>
//                     {loading ? "Processing..." : "Proceed to Pay"}
//                   </button>
//                   <button className="btn btn-outline-secondary w-100 mt-2" onClick={() => setSelected(null)}>
//                     Back to Templates
//                   </button>
//                 </div>
//               </div>

//               <div className="col-md-6">
//                 <div className="card shadow-sm p-4 text-center gift-preview">
//                   <h5 className="mb-3">Gift Card Preview</h5>
//                   <img src={selected.image} alt={selected.title} className="img-fluid rounded mb-3 gift-preview-img" />
//                   <p>
//                     <strong>To:</strong> {form.recipientName || "Recipient Name"}
//                   </p>
//                   <p>
//                     <strong>Message:</strong> {form.message || "Your personalized message..."}
//                   </p>
//                   <p>
//                     <strong>Amount:</strong> ₹{form.amount || 0}
//                   </p>
//                   <p>
//                     <strong>From:</strong> You
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// }















// // src/components/GiftCards.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "../css/GiftCards.css";
// import Footer from "./Footer";
// import Header from "./Header";

// const API_BASE = "https://beauty.joyory.com/api/user/giftcards";

// export default function MyGiftCard() {
//     const [giftCards, setGiftCards] = useState([]);
//     const [selected, setSelected] = useState(null);
//     const [form, setForm] = useState({
//         recipientName: "",
//         recipientEmail: "",
//         message: "",
//         amount: "",
//     });
//     const [loading, setLoading] = useState(false);

//     // ✅ Fetch gift cards from new backend response
//     //   useEffect(() => {
//     //     axios
//     //       .get(`${API_BASE}/list`)
//     //       .then((res) => {
//     //         if (res.data?.success) {
//     //           setGiftCards(res.data.giftCards || []);
//     //         } else {
//     //           console.error("Unexpected response:", res.data);
//     //         }
//     //       })
//     //       .catch((err) => console.error("Error fetching gift cards:", err));
//     //   }, []);


//     useEffect(() => {
//         axios
//             .get(`${API_BASE}/list`, { withCredentials: true }) // 👈 IMPORTANT
//             .then((res) => {
//                 if (res.data?.success) {
//                     setGiftCards(res.data.giftCards || []);
//                 } else {
//                     console.error("Unexpected response:", res.data);
//                 }
//             })
//             .catch((err) => {
//                 console.error("Error fetching gift cards:", err);
//                 if (err.response?.status === 401) {
//                     alert("⚠️ Please log in again. Your session might have expired.");
//                 }
//             });
//     }, []);


//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setForm((prev) => ({ ...prev, [name]: value }));
//     };

//     const handlePayment = async () => {
//         if (!selected) return alert("Please select a gift card first.");

//         if (!form.recipientName || !form.recipientEmail) {
//             return alert("Please enter recipient name and email.");
//         }

//         if (!form.amount || isNaN(form.amount)) {
//             return alert("Please enter a valid amount.");
//         }

//         setLoading(true);
//         try {
//             const createResp = await axios.post(
//                 `${API_BASE}/create-order`,
//                 {
//                     giftCardId: selected._id,
//                     amount: Number(form.amount),
//                     recipient: {
//                         name: form.recipientName,
//                         email: form.recipientEmail,
//                     },
//                     message: form.message,
//                 },
//                 { withCredentials: true }
//             );

//             const order = createResp.data?.order;
//             if (!order) throw new Error("Failed to create Razorpay order");

//             const scriptLoaded = await new Promise((resolve) => {
//                 if (window.Razorpay) return resolve(true);
//                 const script = document.createElement("script");
//                 script.src = "https://checkout.razorpay.com/v1/checkout.js";
//                 script.onload = () => resolve(true);
//                 script.onerror = () => resolve(false);
//                 document.body.appendChild(script);
//             });
//             if (!scriptLoaded) return alert("Failed to load Razorpay SDK");

//             const options = {
//                 key: "rzp_test_RHpYsCY6tqQ3TW",
//                 amount: order.amount,
//                 currency: order.currency || "INR",
//                 name: "Joyory",
//                 description: `Gift Card - ${selected.title}`,
//                 order_id: order.id,
//                 handler: async function (response) {
//                     try {
//                         await axios.post(
//                             `${API_BASE}/verify-payment`,
//                             {
//                                 razorpay_order_id: response.razorpay_order_id,
//                                 razorpay_payment_id: response.razorpay_payment_id,
//                                 razorpay_signature: response.razorpay_signature,
//                             },
//                             { withCredentials: true }
//                         );

//                         alert("✅ Gift card issued & email sent!");
//                         setSelected(null);
//                         setForm({ recipientName: "", recipientEmail: "", message: "", amount: "" });
//                     } catch (err) {
//                         console.error("Verification failed:", err);
//                         alert(err.response?.data?.message || "Payment verification failed");
//                     }
//                 },
//                 prefill: {
//                     name: form.recipientName,
//                     email: form.recipientEmail,
//                 },
//                 theme: { color: "#0d6efd" },
//             };

//             const rzp = new window.Razorpay(options);
//             rzp.open();
//         } catch (err) {
//             console.error("Error initiating payment:", err);
//             alert(err.response?.data?.message || err.message || "Error initiating payment");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <>
//             <Header />

//             <div className="background-colors-for-gifting">
//                 <h2 className="text-center mb-3">Gift Cards</h2>
//                 <p className="text-center text-muted mb-4">
//                     Choose a gift card for your loved ones and make their day special with Joyory's curated selection.
//                 </p>
//             </div>

//             <div className="container py-5">
//                 {!selected ? (
//                     <div className="row g-4">
//                         {giftCards.map((card) => (
//                             <div key={card._id} className="col-md-4">
//                                 <div className="card h-100 shadow-sm gift-card">
//                                     <img src={card.image} alt={card.title} className="card-img-top gift-card-img" />
//                                     <div className="card-body d-flex flex-column">
//                                         <h5 className="card-title fw-bold">{card.title}</h5>
//                                         <button className="btn btn-primary mt-auto" onClick={() => setSelected(card)}>
//                                             Buy Now
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                         {giftCards.length === 0 && (
//                             <p className="text-center text-muted">No gift cards available at the moment.</p>
//                         )}
//                     </div>
//                 ) : (
//                     <div className="row g-4">
//                         <div className="col-md-6">
//                             <div className="card shadow-sm p-4">
//                                 <h4 className="mb-4">Who is this for?</h4>
//                                 <div className="mb-3">
//                                     <label className="form-label">Recipient Name</label>
//                                     <input
//                                         type="text"
//                                         name="recipientName"
//                                         className="form-control"
//                                         value={form.recipientName}
//                                         onChange={handleChange}
//                                     />
//                                 </div>
//                                 <div className="mb-3">
//                                     <label className="form-label">Recipient Email</label>
//                                     <input
//                                         type="email"
//                                         name="recipientEmail"
//                                         className="form-control"
//                                         value={form.recipientEmail}
//                                         onChange={handleChange}
//                                     />
//                                 </div>
//                                 <div className="mb-3">
//                                     <label className="form-label">Message</label>
//                                     <textarea
//                                         name="message"
//                                         className="form-control"
//                                         rows="3"
//                                         value={form.message}
//                                         onChange={handleChange}
//                                     />
//                                 </div>
//                                 <div className="mb-3">
//                                     <label className="form-label">Amount</label>
//                                     <input
//                                         type="number"
//                                         name="amount"
//                                         className="form-control"
//                                         placeholder={`Enter amount`}
//                                         value={form.amount}
//                                         onChange={handleChange}
//                                     />
//                                 </div>
//                                 <button className="btn btn-success w-100" onClick={handlePayment} disabled={loading}>
//                                     {loading ? "Processing..." : "Proceed to Pay"}
//                                 </button>
//                                 <button className="btn btn-outline-secondary w-100 mt-2" onClick={() => setSelected(null)}>
//                                     Back to Gift Cards
//                                 </button>
//                             </div>
//                         </div>

//                         <div className="col-md-6">
//                             <div className="card shadow-sm p-4 text-center gift-preview">
//                                 <h5 className="mb-3">Gift Card Preview</h5>
//                                 <img src={selected.image} alt={selected.title} className="img-fluid rounded mb-3 gift-preview-img" />
//                                 <p>
//                                     <strong>To:</strong> {form.recipientName || "Recipient Name"}
//                                 </p>
//                                 <p>
//                                     <strong>Message:</strong> {form.message || "Your personalized message..."}
//                                 </p>
//                                 <p>
//                                     <strong>Amount:</strong> ₹{form.amount || 0}
//                                 </p>
//                                 <p>
//                                     <strong>From:</strong> You
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             <Footer />
//         </>
//     );
// }


























// // src/components/GiftCards.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "../css/GiftCards.css";
// import Footer from "./Footer";
// import Header from "./Header";

// const API_BASE = "https://beauty.joyory.com/api/user/giftcards";

// export default function MyGiftCard() {
//     const [giftCards, setGiftCards] = useState([]);
//     const [filteredCards, setFilteredCards] = useState([]);
//     const [selected, setSelected] = useState(null);
//     const [form, setForm] = useState({
//         recipientName: "",
//         recipientEmail: "",
//         message: "",
//         amount: "",
//     });
//     const [loading, setLoading] = useState(false);

//     // Filters
//     const [voucherFilter, setVoucherFilter] = useState("all");
//     const [valueFilter, setValueFilter] = useState("all");

//     useEffect(() => {
//         axios
//             .get(`${API_BASE}/list`, { withCredentials: true })
//             .then((res) => {
//                 if (res.data?.success) {
//                     setGiftCards(res.data.giftCards || []);
//                     setFilteredCards(res.data.giftCards || []);
//                 } else {
//                     console.error("Unexpected response:", res.data);
//                 }
//             })
//             .catch((err) => {
//                 console.error("Error fetching gift cards:", err);
//                 if (err.response?.status === 401) {
//                     alert("⚠️ Please log in again. Your session might have expired.");
//                 }
//             });
//     }, []);

//     // Apply filters whenever voucherFilter, valueFilter, or giftCards changes
//     useEffect(() => {
//         let filtered = [...giftCards];

//         if (voucherFilter !== "all") {
//             filtered = filtered.filter((card) => card.type === voucherFilter);
//         }

//         if (valueFilter !== "all") {
//             if (valueFilter === "low") {
//                 filtered = filtered.filter((card) => card.minAmount <= 500);
//             } else if (valueFilter === "mid") {
//                 filtered = filtered.filter(
//                     (card) => card.minAmount > 500 && card.minAmount <= 2000
//                 );
//             } else if (valueFilter === "high") {
//                 filtered = filtered.filter((card) => card.minAmount > 2000);
//             }
//         }

//         setFilteredCards(filtered);
//     }, [voucherFilter, valueFilter, giftCards]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setForm((prev) => ({ ...prev, [name]: value }));
//     };

//     const handlePayment = async () => {
//         if (!selected) return alert("Please select a gift card first.");

//         if (!form.recipientName || !form.recipientEmail) {
//             return alert("Please enter recipient name and email.");
//         }

//         if (!form.amount || isNaN(form.amount)) {
//             return alert("Please enter a valid amount.");
//         }

//         setLoading(true);
//         try {
//             const createResp = await axios.post(
//                 `${API_BASE}/create-order`,
//                 {
//                     giftCardId: selected._id,
//                     amount: Number(form.amount),
//                     recipient: {
//                         name: form.recipientName,
//                         email: form.recipientEmail,
//                     },
//                     message: form.message,
//                 },
//                 { withCredentials: true }
//             );

//             const order = createResp.data?.order;
//             if (!order) throw new Error("Failed to create Razorpay order");

//             const scriptLoaded = await new Promise((resolve) => {
//                 if (window.Razorpay) return resolve(true);
//                 const script = document.createElement("script");
//                 script.src = "https://checkout.razorpay.com/v1/checkout.js";
//                 script.onload = () => resolve(true);
//                 script.onerror = () => resolve(false);
//                 document.body.appendChild(script);
//             });
//             if (!scriptLoaded) return alert("Failed to load Razorpay SDK");

//             const options = {
//                 key: "rzp_test_RHpYsCY6tqQ3TW",
//                 amount: order.amount,
//                 currency: order.currency || "INR",
//                 name: "Joyory",
//                 description: `Gift Card - ${selected.title}`,
//                 order_id: order.id,
//                 handler: async function (response) {
//                     try {
//                         await axios.post(
//                             `${API_BASE}/verify-payment`,
//                             {
//                                 razorpay_order_id: response.razorpay_order_id,
//                                 razorpay_payment_id: response.razorpay_payment_id,
//                                 razorpay_signature: response.razorpay_signature,
//                             },
//                             { withCredentials: true }
//                         );

//                         alert("✅ Gift card issued & email sent!");
//                         setSelected(null);
//                         setForm({ recipientName: "", recipientEmail: "", message: "", amount: "" });
//                     } catch (err) {
//                         console.error("Verification failed:", err);
//                         alert(err.response?.data?.message || "Payment verification failed");
//                     }
//                 },
//                 prefill: {
//                     name: form.recipientName,
//                     email: form.recipientEmail,
//                 },
//                 theme: { color: "#0d6efd" },
//             };

//             const rzp = new window.Razorpay(options);
//             rzp.open();
//         } catch (err) {
//             console.error("Error initiating payment:", err);
//             alert(err.response?.data?.message || err.message || "Error initiating payment");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <>
//             <Header />

//             <div className="background-colors-for-gifting">
//                 <h2 className="text-center mb-3">Gift Cards</h2>
//                 <p className="text-center text-muted mb-4">
//                     Choose a gift card for your loved ones and make their day special with Joyory's curated selection.
//                 </p>
//             </div>

//             <div className="bg">
//                 <div className="filter-backenground">
//                     <div className="container">
//                         <div className="d-flex align-items-center mb-4">
//                             <label className="me-2 fw-semibold">Filter by:</label>
//                             <select
//                                 className="form-select me-3"
//                                 style={{ width: "200px" }}
//                                 value={voucherFilter}
//                                 onChange={(e) => setVoucherFilter(e.target.value)}
//                             >
//                                 <option value="all">All Vouchers</option>
//                                 <option value="discount">Discount Vouchers</option>
//                                 <option value="gift">Gift Vouchers</option>
//                             </select>

//                             <select
//                                 className="form-select"
//                                 style={{ width: "200px" }}
//                                 value={valueFilter}
//                                 onChange={(e) => setValueFilter(e.target.value)}
//                             >
//                                 <option value="all">All Values</option>
//                                 <option value="low">Below ₹500</option>
//                                 <option value="mid">₹500 - ₹2000</option>
//                                 <option value="high">Above ₹2000</option>
//                             </select>
//                         </div>
//                     </div>
//                 </div>


//                 <div className="container py-5">
//                     {!selected ? (
//                         <>
//                             {/* ✅ Filters */}


//                             <div className="row g-4">
//                                 {filteredCards.map((card) => (
//                                     <div key={card._id} className="col-md-4">
//                                         <div className="card h-100 shadow-sm gift-card">
//                                             <img src={card.image} alt={card.title} className="card-img-top gift-card-img" />
//                                             <div className="card-body d-flex flex-column">
//                                                 <h5 className="card-title fw-bold">{card.title}</h5>
//                                                 <p className="text-muted">Starts at ₹{card.minAmount}</p>
//                                                 <button
//                                                     className="btn btn-primary mt-auto"
//                                                     onClick={() => setSelected(card)}
//                                                 >
//                                                     Buy Now
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                                 {filteredCards.length === 0 && (
//                                     <p className="text-center text-muted">No gift cards match your filter.</p>
//                                 )}
//                             </div>
//                         </>
//                     ) : (
//                         <div className="row g-4">
//                             <div className="col-md-6">
//                                 <div className="card shadow-sm p-4">
//                                     <h4 className="mb-4">Who is this for?</h4>
//                                     <div className="mb-3">
//                                         <label className="form-label">Recipient Name</label>
//                                         <input
//                                             type="text"
//                                             name="recipientName"
//                                             className="form-control"
//                                             value={form.recipientName}
//                                             onChange={handleChange}
//                                         />
//                                     </div>
//                                     <div className="mb-3">
//                                         <label className="form-label">Recipient Email</label>
//                                         <input
//                                             type="email"
//                                             name="recipientEmail"
//                                             className="form-control"
//                                             value={form.recipientEmail}
//                                             onChange={handleChange}
//                                         />
//                                     </div>
//                                     <div className="mb-3">
//                                         <label className="form-label">Message</label>
//                                         <textarea
//                                             name="message"
//                                             className="form-control"
//                                             rows="3"
//                                             value={form.message}
//                                             onChange={handleChange}
//                                         />
//                                     </div>
//                                     <div className="mb-3">
//                                         <label className="form-label">Amount</label>
//                                         <input
//                                             type="number"
//                                             name="amount"
//                                             className="form-control"
//                                             placeholder={`Enter amount`}
//                                             value={form.amount}
//                                             onChange={handleChange}
//                                         />
//                                     </div>
//                                     <button className="btn btn-success w-100" onClick={handlePayment} disabled={loading}>
//                                         {loading ? "Processing..." : "Proceed to Pay"}
//                                     </button>
//                                     <button className="btn btn-outline-secondary w-100 mt-2" onClick={() => setSelected(null)}>
//                                         Back to Gift Cards
//                                     </button>
//                                 </div>
//                             </div>

//                             <div className="col-md-6">
//                                 <div className="card shadow-sm p-4 text-center gift-preview">
//                                     <h5 className="mb-3">Gift Card Preview</h5>
//                                     <img src={selected.image} alt={selected.title} className="img-fluid rounded mb-3 gift-preview-img" />
//                                     <p><strong>To:</strong> {form.recipientName || "Recipient Name"}</p>
//                                     <p><strong>Message:</strong> {form.message || "Your personalized message..."}</p>
//                                     <p><strong>Amount:</strong> ₹{form.amount || 0}</p>
//                                     <p><strong>From:</strong> You</p>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//             </div>

//             <Footer />
//         </>
//     );
// }




















// // src/components/GiftCards.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "../css/GiftCards.css";
// import Footer from "./Footer";
// import Header from "./Header";

// const API_BASE = "https://beauty.joyory.com/api/user/giftcards";

// export default function MyGiftCard() {
//   const [giftCards, setGiftCards] = useState([]);
//   const [filteredCards, setFilteredCards] = useState([]);
//   const [selected, setSelected] = useState(null);
//   const [form, setForm] = useState({
//     recipientName: "",
//     recipientEmail: "",
//     message: "",
//     amount: "",
//   });
//   const [loading, setLoading] = useState(false);

//   const [voucherFilter, setVoucherFilter] = useState("all");
//   const [valueFilter, setValueFilter] = useState("all");

//   // Dynamic filter options
//   const [voucherOptions, setVoucherOptions] = useState([]);
//   const [valueOptions, setValueOptions] = useState(["all", "low", "mid", "high"]);

//   // Fetch gift cards from API
//   useEffect(() => {
//     axios
//       .get(`${API_BASE}/list`, { withCredentials: true })
//       .then((res) => {
//         if (res.data?.success) {
//           const cards = res.data.giftCards || [];
//           setGiftCards(cards);
//           setFilteredCards(cards);

//           // Dynamically generate voucher types from API
//           const types = Array.from(new Set(cards.map((c) => c.type?.toLowerCase()))).filter(Boolean);
//           setVoucherOptions(["all", ...types]);
//         }
//       })
//       .catch((err) => {
//         console.error("Error fetching gift cards:", err);
//         if (err.response?.status === 401) {
//           alert("⚠️ Please log in again. Your session might have expired.");
//         }
//       });
//   }, []);

//   // Apply filters
//   useEffect(() => {
//     let filtered = [...giftCards];

//     if (voucherFilter !== "all") {
//       filtered = filtered.filter(
//         (card) => card.type?.toLowerCase() === voucherFilter.toLowerCase()
//       );
//     }

//     if (valueFilter !== "all") {
//       filtered = filtered.filter((card) => {
//         const amount = Number(card.minAmount || 0);
//         if (valueFilter === "low") return amount <= 500;
//         if (valueFilter === "mid") return amount > 500 && amount <= 2000;
//         if (valueFilter === "high") return amount > 2000;
//         return true;
//       });
//     }

//     setFilteredCards(filtered);
//   }, [voucherFilter, valueFilter, giftCards]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handlePayment = async () => {
//     if (!selected) return alert("Please select a gift card first.");
//     if (!form.recipientName || !form.recipientEmail)
//       return alert("Please enter recipient name and email.");
//     if (!form.amount || isNaN(form.amount))
//       return alert("Please enter a valid amount.");

//     setLoading(true);
//     try {
//       const createResp = await axios.post(
//         `${API_BASE}/create-order`,
//         {
//           giftCardId: selected._id,
//           amount: Number(form.amount),
//           recipient: {
//             name: form.recipientName,
//             email: form.recipientEmail,
//           },
//           message: form.message,
//         },
//         { withCredentials: true }
//       );

//       const order = createResp.data?.order;
//       if (!order) throw new Error("Failed to create Razorpay order");

//       const scriptLoaded = await new Promise((resolve) => {
//         if (window.Razorpay) return resolve(true);
//         const script = document.createElement("script");
//         script.src = "https://checkout.razorpay.com/v1/checkout.js";
//         script.onload = () => resolve(true);
//         script.onerror = () => resolve(false);
//         document.body.appendChild(script);
//       });
//       if (!scriptLoaded) return alert("Failed to load Razorpay SDK");

//       const options = {
//         key: "rzp_test_RHpYsCY6tqQ3TW",
//         amount: order.amount,
//         currency: order.currency || "INR",
//         name: "Joyory",
//         description: `Gift Card - ${selected.title}`,
//         order_id: order.id,
//         handler: async function (response) {
//           try {
//             await axios.post(
//               `${API_BASE}/verify-payment`,
//               {
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature: response.razorpay_signature,
//               },
//               { withCredentials: true }
//             );

//             alert("✅ Gift card issued & email sent!");
//             setSelected(null);
//             setForm({
//               recipientName: "",
//               recipientEmail: "",
//               message: "",
//               amount: "",
//             });
//           } catch (err) {
//             console.error("Verification failed:", err);
//             alert(err.response?.data?.message || "Payment verification failed");
//           }
//         },
//         prefill: {
//           name: form.recipientName,
//           email: form.recipientEmail,
//         },
//         theme: { color: "#0d6efd" },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (err) {
//       console.error("Error initiating payment:", err);
//       alert(err.response?.data?.message || err.message || "Error initiating payment");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Header />
//       <div className="background-colors-for-gifting">
//         <h2 className="text-center mb-3">Gift Cards</h2>
//         <p className="text-center text-muted mb-4">
//           Choose a gift card for your loved ones and make their day special with Joyory's curated selection.
//         </p>
//       </div>

//       <div className="bg">
//         <div className="filter-backenground">
//           <div className="container">
//             <div className="d-flex align-items-center mb-4">
//               <label className="me-2 fw-semibold">Filter by:</label>
//               <select
//                 className="form-select me-3"
//                 style={{ width: "200px" }}
//                 value={voucherFilter}
//                 onChange={(e) => setVoucherFilter(e.target.value)}
//               >
//                 {voucherOptions.map((type) => (
//                   <option key={type} value={type}>
//                     {type === "all" ? "All Vouchers" : type.charAt(0).toUpperCase() + type.slice(1) + " Vouchers"}
//                   </option>
//                 ))}
//               </select>

//               <select
//                 className="form-select"
//                 style={{ width: "200px" }}
//                 value={valueFilter}
//                 onChange={(e) => setValueFilter(e.target.value)}
//               >
//                 <option value="all">All Values</option>
//                 <option value="low">Below ₹500</option>
//                 <option value="mid">₹500 - ₹2000</option>
//                 <option value="high">Above ₹2000</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         <div className="container py-5">
//           {!selected ? (
//             <div className="row g-4">
//               {filteredCards.map((card) => (
//                 <div key={card._id} className="col-md-4">
//                   <div className="card h-100 shadow-sm gift-card">
//                     <img src={card.image} alt={card.title} className="card-img-top gift-card-img" />
//                     <div className="card-body d-flex flex-column">
//                       <h5 className="card-title fw-bold">{card.title}</h5>
//                       <p className="text-muted">Starts at ₹{card.minAmount}</p>
//                       <button className="btn btn-primary mt-auto" onClick={() => setSelected(card)}>
//                         Show Details
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               {filteredCards.length === 0 && (
//                 <p className="text-center text-muted">No gift cards match your filter.</p>
//               )}
//             </div>
//           ) : (
//             <div className="row g-4">
//               <div className="col-md-6">
//                 <div className="card shadow-sm p-4">
//                   <h4 className="mb-4">Who is this for?</h4>
//                   <div className="mb-3">
//                     <label className="form-label">Recipient Name</label>
//                     <input type="text" name="recipientName" className="form-control" value={form.recipientName} onChange={handleChange} />
//                   </div>
//                   <div className="mb-3">
//                     <label className="form-label">Recipient Email</label>
//                     <input type="email" name="recipientEmail" className="form-control" value={form.recipientEmail} onChange={handleChange} />
//                   </div>
//                   <div className="mb-3">
//                     <label className="form-label">Message</label>
//                     <textarea name="message" className="form-control" rows="3" value={form.message} onChange={handleChange} />
//                   </div>
//                   <div className="mb-3">
//                     <label className="form-label">Amount</label>
//                     <input type="number" name="amount" className="form-control" placeholder={`Enter amount`} value={form.amount} onChange={handleChange} />
//                   </div>
//                   <button className="btn btn-success w-100" onClick={handlePayment} disabled={loading}>
//                     {loading ? "Processing..." : "Proceed to Pay"}
//                   </button>
//                   <button className="btn btn-outline-secondary w-100 mt-2" onClick={() => setSelected(null)}>
//                     Back to Gift Cards
//                   </button>
//                 </div>
//               </div>

//               <div className="col-md-6">
//                 <div className="card shadow-sm p-4 text-center gift-preview">
//                   <h5 className="mb-3">Gift Card Preview</h5>
//                   <img src={selected.image} alt={selected.title} className="img-fluid rounded mb-3 gift-preview-img" />
//                   <p><strong>To:</strong> {form.recipientName || "Recipient Name"}</p>
//                   <p><strong>Message:</strong> {form.message || "Your personalized message..."}</p>
//                   <p><strong>Amount:</strong> ₹{form.amount || 0}</p>
//                   <p><strong>From:</strong> You</p>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// }


























// // src/components/GiftCards.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";   // ✅ import navigation
// import "../css/GiftCards.css";
// import Footer from "./Footer";
// import Header from "./Header";

// const API_BASE = "https://beauty.joyory.com/api/user/giftcards";

// export default function MyGiftCard() {
//   const [giftCards, setGiftCards] = useState([]);
//   const [filteredCards, setFilteredCards] = useState([]);
//   const [voucherFilter, setVoucherFilter] = useState("all");
//   const [valueFilter, setValueFilter] = useState("all");
//   const [voucherOptions, setVoucherOptions] = useState([]);
//   const navigate = useNavigate();  // ✅ navigation hook

//   // Fetch gift cards from API
//   useEffect(() => {
//     axios
//       .get(`${API_BASE}/list`, { withCredentials: true })
//       .then((res) => {
//         if (res.data?.success) {
//           const cards = res.data.giftCards || [];
//           setGiftCards(cards);
//           setFilteredCards(cards);

//           // Dynamic voucher options
//           const types = Array.from(new Set(cards.map((c) => c.type?.toLowerCase()))).filter(Boolean);
//           setVoucherOptions(["all", ...types]);
//         }
//       })
//       .catch((err) => {
//         console.error("Error fetching gift cards:", err);
//       });
//   }, []);

//   // Apply filters
//   useEffect(() => {
//     let filtered = [...giftCards];

//     if (voucherFilter !== "all") {
//       filtered = filtered.filter(
//         (card) => card.type?.toLowerCase() === voucherFilter.toLowerCase()
//       );
//     }

//     if (valueFilter !== "all") {
//       filtered = filtered.filter((card) => {
//         const amount = Number(card.minAmount || 0);
//         if (valueFilter === "low") return amount <= 500;
//         if (valueFilter === "mid") return amount > 500 && amount <= 2000;
//         if (valueFilter === "high") return amount > 2000;
//         return true;
//       });
//     }

//     setFilteredCards(filtered);
//   }, [voucherFilter, valueFilter, giftCards]);

//   return (
//     <>
//       <Header />
//       <div className="background-colors-for-gifting">
//         <h2 className="text-center mb-3">Gift Cards</h2>
//         <p className="text-center text-muted mb-4">
//           Choose a gift card for your loved ones and make their day special with Joyory's curated selection.
//         </p>
//       </div>

//       <div className="bg">
//         <div className="filter-backenground">
//           <div className="container">
//             <div className="d-flex align-items-center mb-4">
//               <label className="me-2 fw-semibold">Filter by:</label>
//               <select
//                 className="form-select me-3"
//                 style={{ width: "200px" }}
//                 value={voucherFilter}
//                 onChange={(e) => setVoucherFilter(e.target.value)}
//               >
//                 {voucherOptions.map((type) => (
//                   <option key={type} value={type}>
//                     {type === "all" ? "All Vouchers" : type.charAt(0).toUpperCase() + type.slice(1) + " Vouchers"}
//                   </option>
//                 ))}
//               </select>

//               <select
//                 className="form-select"
//                 style={{ width: "200px" }}
//                 value={valueFilter}
//                 onChange={(e) => setValueFilter(e.target.value)}
//               >
//                 <option value="all">All Values</option>
//                 <option value="low">Below ₹500</option>
//                 <option value="mid">₹500 - ₹2000</option>
//                 <option value="high">Above ₹2000</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         <div className="container py-5">
//           <div className="row g-4">
//             {filteredCards.map((card) => (
//               <div key={card._id} className="col-md-4">
//                 <div className="card h-100 shadow-sm gift-card">
//                   <img src={card.image} alt={card.title} className="card-img-top gift-card-img" />
//                   <div className="card-body d-flex flex-column">
//                     <h5 className="card-title fw-bold">{card.title}</h5>
//                     <p className="text-muted">Starts at ₹{card.minAmount}</p>

//                     {/* ✅ Navigate to Giftcardinnersection */}
//                     <button
//                       className="btn btn-primary mt-auto"
//                       onClick={() => navigate(`/Giftcardinnersection/${card._id}`)}
//                     >
//                       Show Details
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//             {filteredCards.length === 0 && (
//               <p className="text-center text-muted">No gift cards match your filter.</p>
//             )}
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// }















// src/components/GiftCards.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/GiftCards.css";
import Footer from "./Footer";
import Header from "./Header";

const API_BASE = "https://beauty.joyory.com/api/user/giftcards";

export default function MyGiftCard() {
  const [giftCards, setGiftCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [voucherFilter, setVoucherFilter] = useState("all");
  const [valueFilter, setValueFilter] = useState("all");
  const [voucherOptions, setVoucherOptions] = useState([]);
  const navigate = useNavigate();

  // Fetch gift cards
  useEffect(() => {
    axios
      .get(`${API_BASE}/list`, { withCredentials: true })
      .then((res) => {
        if (res.data?.success) {
          const cards = res.data.giftCards || [];
          setGiftCards(cards);
          setFilteredCards(cards);

          const types = Array.from(
            new Set(cards.map((c) => c.type?.toLowerCase()))
          ).filter(Boolean);
          setVoucherOptions(["all", ...types]);
        }
      })
      .catch((err) => {
        console.error("Error fetching gift cards:", err);
      });
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...giftCards];

    if (voucherFilter !== "all") {
      filtered = filtered.filter(
        (card) => card.type?.toLowerCase() === voucherFilter.toLowerCase()
      );
    }

    if (valueFilter !== "all") {
      filtered = filtered.filter((card) => {
        const amount = Number(card.minAmount || 0);
        if (valueFilter === "low") return amount <= 500;
        if (valueFilter === "mid") return amount > 500 && amount <= 2000;
        if (valueFilter === "high") return amount > 2000;
        return true;
      });
    }

    setFilteredCards(filtered);
  }, [voucherFilter, valueFilter, giftCards]);

  return (
    <>
      <Header />
      <div className="background-colors-for-gifting">
        <h2 className="text-center mb-3">My Gift Cards</h2>
        <p className="text-center text-muted mb-4">
          Choose a gift card for your loved ones and make their day special with Joyory's curated selection.
        </p>
      </div>

      <div className="bg">
        <div className="filter-backenground">
          <div className="container">
            <div className="d-flex align-items-center mb-4">
              <label className="me-2 fw-semibold">Filter by:</label>
              <select
                className="form-select me-3"
                style={{ width: "200px" }}
                value={voucherFilter}
                onChange={(e) => setVoucherFilter(e.target.value)}
              >
                {voucherOptions.map((type) => (
                  <option key={type} value={type}>
                    {type === "all"
                      ? "All Vouchers"
                      : type.charAt(0).toUpperCase() + type.slice(1) + " Vouchers"}
                  </option>
                ))}
              </select>

              <select
                className="form-select"
                style={{ width: "200px" }}
                value={valueFilter}
                onChange={(e) => setValueFilter(e.target.value)}
              >
                <option value="all">All Values</option>
                <option value="low">Below ₹500</option>
                <option value="mid">₹500 - ₹2000</option>
                <option value="high">Above ₹2000</option>
              </select>
            </div>
          </div>
        </div>

        <div className="container py-5">
          <div className="row g-4">
            {filteredCards.map((card) => (
              <div key={card._id} className="col-md-4">
                <div className="card h-100 shadow-sm gift-card">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="card-img-top gift-card-img"
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold">{card.title}</h5>
                    {/* <p className="text-muted">Starts at ₹{card.minAmount}</p> */}

                    {/* ✅ Navigate to details */}
                    <button
                      className="btn btn-primary mt-auto"
                      onClick={() => navigate(`/Giftcardinnersection/${card._id}`)}
                    >
                      Show Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredCards.length === 0 && (
              <p className="text-center text-muted">
                No gift cards match your filter.
              </p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
