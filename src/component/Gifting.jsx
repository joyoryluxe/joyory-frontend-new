
// // src/components/GiftCards.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "../css/GiftCards.css";
// import Footer from "./Footer";
// import Header from "./Header";

// const API_BASE = "https://beauty.joyory.com/api/user/giftcards";

// export default function GiftCards() {
//     const [templates, setTemplates] = useState([]);
//     const [filteredTemplates, setFilteredTemplates] = useState([]);
//     const [selected, setSelected] = useState(null);
//     const [form, setForm] = useState({
//         recipientName: "",
//         recipientEmail: "",
//         message: "",
//         amount: "",
//     });
//     const [loading, setLoading] = useState(false);

//     // Filters
//     const [occasionFilter, setOccasionFilter] = useState("All");
//     const [valueFilter, setValueFilter] = useState("All");

//     // Options generated from API
//     const [occasionOptions, setOccasionOptions] = useState([]);
//     const [valueOptions, setValueOptions] = useState([]);

//     // ✅ Fetch templates
//     useEffect(() => {
//         axios
//             .get(`${API_BASE}/templates`)
//             .then((res) => {
//                 const data = res.data || [];
//                 setTemplates(data);
//                 setFilteredTemplates(data);

//                 // ✅ Auto-generate filters based on API data
//                 const occs = [...new Set(data.map((t) => t.occasion).filter(Boolean))];
//                 setOccasionOptions(occs);

//                 const values = [
//                     ...new Set(
//                         data
//                             .flatMap((t) => [t.minAmount, t.maxAmount])
//                             .filter(Boolean)
//                             .sort((a, b) => a - b)
//                     ),
//                 ];
//                 setValueOptions(values);
//             })
//             .catch((err) => console.error("Error fetching templates:", err));
//     }, []);

//     // ✅ Apply filters dynamically
//     useEffect(() => {
//         let data = [...templates];

//         if (occasionFilter !== "All") {
//             data = data.filter((tpl) => tpl.occasion === occasionFilter);
//         }
//         if (valueFilter !== "All") {
//             const val = parseInt(valueFilter);
//             data = data.filter(
//                 (tpl) => tpl.minAmount <= val && tpl.maxAmount >= val
//             );
//         }

//         setFilteredTemplates(data);
//     }, [occasionFilter, valueFilter, templates]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setForm((p) => ({ ...p, [name]: value }));
//     };

//     const handlePayment = async () => {
//         if (!selected) return alert("Please select a template first.");
//         const amount = Number(form.amount);

//         if (!form.recipientName || !form.recipientEmail) {
//             return alert("Please enter recipient name and email.");
//         }
//         if (!amount || isNaN(amount)) {
//             return alert("Please enter a valid amount.");
//         }
//         if (amount < selected.minAmount || amount > selected.maxAmount) {
//             return alert(
//                 `Amount must be between ₹${selected.minAmount} and ₹${selected.maxAmount}`
//             );
//         }

//         setLoading(true);
//         try {
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
//                     console.log("✅ Razorpay response:", response);
//                     try {
//                         await axios.post(
//                             `${API_BASE}/verify-payment`,
//                             response,
//                             { withCredentials: true }
//                         );

//                         alert("✅ Gift card issued & email sent to recipient!");
//                         setSelected(null);
//                         setForm({
//                             recipientName: "",
//                             recipientEmail: "",
//                             message: "",
//                             amount: "",
//                         });
//                     } catch (err) {
//                         console.error("Verification failed:", err);
//                         alert(
//                             err.response?.data?.message ||
//                                 "Payment verification failed"
//                         );
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
//             alert(
//                 err.response?.data?.message ||
//                     err.message ||
//                     "Error initiating payment"
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <>
//             <Header />
//             <div className="bg">
//                 <div className="background-colors-for-gifting">
//                     <h2 className="text-center mb-3">Gift Cards</h2>
//                     <p className="text-center text-muted mb-4">
//                         Choose a gift card for your loved ones and make their
//                         day special with Joyory's curated selection
//                     </p>
//                 </div>

//                 {/* 🔹 Filters */}
//                 <div className="filter-backenground">
//                     <div className="container d-flex justify-content-between align-items-center mb-4">
//                         <div>
//                             <label className="me-2 fw-bold">Filter by:</label>
//                             <select
//                                 className="form-select d-inline-block w-auto me-2"
//                                 value={occasionFilter}
//                                 onChange={(e) => setOccasionFilter(e.target.value)}
//                             >
//                                 <option value="All">All Occasions</option>
//                                 {occasionOptions.map((oc) => (
//                                     <option key={oc} value={oc}>
//                                         {oc}
//                                     </option>
//                                 ))}
//                             </select>

//                             <select
//                                 className="form-select d-inline-block w-auto"
//                                 value={valueFilter}
//                                 onChange={(e) => setValueFilter(e.target.value)}
//                             >
//                                 <option value="All">All Values</option>
//                                 {valueOptions.map((v) => (
//                                     <option key={v} value={v}>
//                                         ₹{v}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         <a
//                             href="/mygiftcard"
//                             className="text-primary fw-semibold text-decoration-none"
//                         >
//                             My Gift Card
//                         </a>
//                     </div>
//                 </div>

//                 <div className="container py-5">
//                     {!selected ? (
//                         <div className="row g-4">
//                             {filteredTemplates.map((tpl) => (
//                                 <div key={tpl._id} className="col-lg-4 col-md-5">
//                                     <div className="card h-100 shadow-sm gift-card">
//                                         <img
//                                             src={tpl.image}
//                                             alt={tpl.title}
//                                             className="card-img-top gift-card-img"
//                                         />
//                                         <div className="card-body d-flex flex-column">
//                                             <h5 className="card-title fw-bold">
//                                                 {tpl.title}
//                                             </h5>
//                                             <p className="card-text text-muted">
//                                                 {tpl.description}
//                                             </p>
//                                             <p className="text-primary fw-semibold mb-3">
//                                                 Starts at ₹{tpl.minAmount}
//                                             </p>
//                                             <button
//                                                 className="btn btn-primary mt-auto"
//                                                 onClick={() => setSelected(tpl)}
//                                             >
//                                                 Buy Now
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                             {filteredTemplates.length === 0 && (
//                                 <p className="text-center text-muted">
//                                     No gift cards found
//                                 </p>
//                             )}
//                         </div>
//                     ) : (
//                         // 🎁 Purchase form
//                         <div className="row g-4">
//                             <div className="col-md-6">
//                                 <div className="card shadow-sm p-4">
//                                     <h4 className="mb-4">Who is this for?</h4>
//                                     <div className="mb-3">
//                                         <label className="form-label">
//                                             Recipient Name
//                                         </label>
//                                         <input
//                                             type="text"
//                                             name="recipientName"
//                                             className="form-control"
//                                             value={form.recipientName}
//                                             onChange={handleChange}
//                                         />
//                                     </div>
//                                     <div className="mb-3">
//                                         <label className="form-label">
//                                             Recipient Email
//                                         </label>
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
//                                             placeholder={`Enter amount (₹${selected.minAmount} - ₹${selected.maxAmount})`}
//                                             value={form.amount}
//                                             onChange={handleChange}
//                                         />
//                                     </div>
//                                     <button
//                                         className="btn btn-success w-100"
//                                         onClick={handlePayment}
//                                         disabled={loading}
//                                     >
//                                         {loading ? "Processing..." : "Proceed to Pay"}
//                                     </button>
//                                     <button
//                                         className="btn btn-outline-secondary w-100 mt-2"
//                                         onClick={() => setSelected(null)}
//                                     >
//                                         Back to Templates
//                                     </button>
//                                 </div>
//                             </div>

//                             {/* Preview */}
//                             <div className="col-md-6">
//                                 <div className="card shadow-sm p-4 text-center gift-preview">
//                                     <h5 className="mb-3">Gift Card Preview</h5>
//                                     <img
//                                         src={selected.image}
//                                         alt={selected.title}
//                                         className="img-fluid rounded mb-3 gift-preview-img"
//                                     />
//                                     <p>
//                                         <strong>To:</strong>{" "}
//                                         {form.recipientName || "Recipient Name"}
//                                     </p>
//                                     <p>
//                                         <strong>Message:</strong>{" "}
//                                         {form.message || "Your personalized message..."}
//                                     </p>
//                                     <p>
//                                         <strong>Amount:</strong> ₹{form.amount || 0}
//                                     </p>
//                                     <p>
//                                         <strong>From:</strong> You
//                                     </p>
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














// src/components/GiftCards.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/GiftCards.css";
import Footer from "./Footer";
import Header from "./Header";

const API_BASE = "https://beauty.joyory.com/api/user/giftcards";

export default function GiftCards() {
    const [templates, setTemplates] = useState([]);
    const [filteredTemplates, setFilteredTemplates] = useState([]);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState({
        recipientName: "",
        recipientEmail: "",
        message: "",
        amount: "",
    });
    const [loading, setLoading] = useState(false);

    // Filters
    const [occasionFilter, setOccasionFilter] = useState("All");
    const [valueFilter, setValueFilter] = useState("All");

    // Options generated from API
    const [occasionOptions, setOccasionOptions] = useState([]);
    const [valueOptions, setValueOptions] = useState([]);

    // ✅ Fetch templates
    useEffect(() => {
        axios
            .get(`${API_BASE}/templates`)
            .then((res) => {
                const data = res.data || [];
                setTemplates(data);
                setFilteredTemplates(data);

                // ✅ Auto-generate filters based on API data
                const occs = [...new Set(data.map((t) => t.occasion).filter(Boolean))];
                setOccasionOptions(occs);

                const values = [
                    ...new Set(
                        data
                            .flatMap((t) => [t.minAmount, t.maxAmount])
                            .filter(Boolean)
                            .sort((a, b) => a - b)
                    ),
                ];
                setValueOptions(values);
            })
            .catch((err) => console.error("Error fetching templates:", err));
    }, []);

    // ✅ Apply filters dynamically
    useEffect(() => {
        let data = [...templates];

        if (occasionFilter !== "All") {
            data = data.filter((tpl) => tpl.occasion === occasionFilter);
        }
        if (valueFilter !== "All") {
            const val = parseInt(valueFilter);
            data = data.filter(
                (tpl) => tpl.minAmount <= val && tpl.maxAmount >= val
            );
        }

        setFilteredTemplates(data);
    }, [occasionFilter, valueFilter, templates]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
    };

    const handlePayment = async () => {
        if (!selected) return alert("Please select a template first.");
        const amount = Number(form.amount);

        if (!form.recipientName || !form.recipientEmail) {
            return alert("Please enter recipient name and email.");
        }
        if (!amount || isNaN(amount)) {
            return alert("Please enter a valid amount.");
        }
        if (amount < selected.minAmount || amount > selected.maxAmount) {
            return alert(
                `Amount must be between ₹${selected.minAmount} and ₹${selected.maxAmount}`
            );
        }

        setLoading(true);
        try {
            const createResp = await axios.post(
                `${API_BASE}/create-order`,
                {
                    templateId: selected._id,
                    amount,
                    recipient: {
                        name: form.recipientName,
                        email: form.recipientEmail,
                    },
                    message: form.message,
                },
                { withCredentials: true }
            );

            const order = createResp.data?.order;
            if (!order) throw new Error("Failed to create Razorpay order");

            const scriptLoaded = await new Promise((resolve) => {
                if (window.Razorpay) return resolve(true);
                const script = document.createElement("script");
                script.src = "https://checkout.razorpay.com/v1/checkout.js";
                script.onload = () => resolve(true);
                script.onerror = () => resolve(false);
                document.body.appendChild(script);
            });
            if (!scriptLoaded) return alert("Failed to load Razorpay SDK");

            const options = {
                key: "rzp_test_RHpYsCY6tqQ3TW",
                amount: order.amount,
                currency: order.currency || "INR",
                name: "Joyory",
                description: `Gift Card - ${selected.title}`,
                order_id: order.id,
                handler: async function (response) {
                    console.log("✅ Razorpay response:", response);
                    try {
                        await axios.post(
                            `${API_BASE}/verify-payment`,
                            response,
                            { withCredentials: true }
                        );

                        alert("✅ Gift card issued & email sent to recipient!");
                        setSelected(null);
                        setForm({
                            recipientName: "",
                            recipientEmail: "",
                            message: "",
                            amount: "",
                        });
                    } catch (err) {
                        console.error("Verification failed:", err);
                        alert(
                            err.response?.data?.message ||
                                "Payment verification failed"
                        );
                    }
                },
                prefill: {
                    name: form.recipientName,
                    email: form.recipientEmail,
                },
                theme: { color: "#0d6efd" },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error("Error initiating payment:", err);
            alert(
                err.response?.data?.message ||
                    err.message ||
                    "Error initiating payment"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div className="bg">
                <div className="background-colors-for-gifting">
                    <h2 className="text-center mb-3">Gift Cards</h2>
                    <p className="text-center text-muted mb-4">
                        Choose a gift card for your loved ones and make their
                        day special with Joyory's curated selection
                    </p>
                </div>

                {/* 🔹 Filters */}
                <div className="filter-backenground">
                    <div className="container d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <label className="me-2 fw-bold">Filter by:</label>
                            <select
                                className="form-select d-inline-block w-auto me-2"
                                value={occasionFilter}
                                onChange={(e) => setOccasionFilter(e.target.value)}
                            >
                                <option value="All">All Occasions</option>
                                {occasionOptions.map((oc) => (
                                    <option key={oc} value={oc}>
                                        {oc}
                                    </option>
                                ))}
                            </select>

                            <select
                                className="form-select d-inline-block w-auto"
                                value={valueFilter}
                                onChange={(e) => setValueFilter(e.target.value)}
                            >
                                <option value="All">All Values</option>
                                {valueOptions.map((v) => (
                                    <option key={v} value={v}>
                                        ₹{v}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <a
                            href="/mygiftcard"
                            className="text-primary fw-semibold text-decoration-none"
                        >
                            My Gift Card
                        </a>
                    </div>
                </div>

                <div className="container py-5">
                    {!selected ? (
                        <div className="row g-4">
                            {filteredTemplates.map((tpl) => (
                                <div key={tpl._id} className="col-lg-4 col-md-5">
                                    <div className="card h-100 shadow-sm gift-card">
                                        <img
                                            src={tpl.image}
                                            alt={tpl.title}
                                            className="card-img-top gift-card-img img-fluid"
                                        />
                                        <div className="card-body d-flex flex-column">
                                            <h5 className="card-title fw-bold">
                                                {tpl.title}
                                            </h5>
                                            <p className="card-text text-muted">
                                                {tpl.description}
                                            </p>
                                            <p className="text-primary fw-semibold mb-3">
                                                Starts at ₹{tpl.minAmount}
                                            </p>
                                            <button
                                                className="btn btn-primary mt-auto"
                                                onClick={() => setSelected(tpl)}
                                            >
                                                Buy Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {filteredTemplates.length === 0 && (
                                <p className="text-center text-muted">
                                    No gift cards found
                                </p>
                            )}
                        </div>
                    ) : (
                        // 🎁 Purchase form
                        <div className="row g-4">
                            <div className="col-md-6">
                                <div className="card shadow-sm p-4">
                                    <h4 className="mb-4">Who is this for?</h4>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Recipient Name
                                        </label>
                                        <input
                                            type="text"
                                            name="recipientName"
                                            className="form-control"
                                            value={form.recipientName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Recipient Email
                                        </label>
                                        <input
                                            type="email"
                                            name="recipientEmail"
                                            className="form-control"
                                            value={form.recipientEmail}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Message</label>
                                        <textarea
                                            name="message"
                                            className="form-control"
                                            rows="3"
                                            value={form.message}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Amount</label>
                                        <input
                                            type="number"
                                            name="amount"
                                            className="form-control"
                                            placeholder={`Enter amount (₹${selected.minAmount} - ₹${selected.maxAmount})`}
                                            value={form.amount}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <button
                                        className="btn btn-success w-100"
                                        onClick={handlePayment}
                                        disabled={loading}
                                    >
                                        {loading ? "Processing..." : "Proceed to Pay"}
                                    </button>
                                    <button
                                        className="btn btn-outline-secondary w-100 mt-2"
                                        onClick={() => setSelected(null)}
                                    >
                                        Back to Templates
                                    </button>
                                </div>
                            </div>

                            {/* Preview */}
                            <div className="col-md-6">
                                <div className="card shadow-sm p-4 text-center gift-preview">
                                    <h5 className="mb-3">Gift Card Preview</h5>
                                    <img
                                        src={selected.image}
                                        alt={selected.title}
                                        className="img-fluid rounded mb-3 gift-preview-img"
                                    />
                                    <p>
                                        <strong>To:</strong>{" "}
                                        {form.recipientName || "Recipient Name"}
                                    </p>
                                    <p>
                                        <strong>Message:</strong>{" "}
                                        {form.message || "Your personalized message..."}
                                    </p>
                                    <p>
                                        <strong>Amount:</strong> ₹{form.amount || 0}
                                    </p>
                                    <p>
                                        <strong>From:</strong> You
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}
