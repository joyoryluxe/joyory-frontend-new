

// // src/components/Giftcardinnersection.jsx
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { Card, Button, Row, Col } from "react-bootstrap";
// import api from "../api/axios";  // ✅ use axios instance
// import "../css/Giftcardinnersection.css";
// import Header from "./Header";
// import Footer from "./Footer";

// const Giftcardinnersection = () => {
//   const { id } = useParams();
//   const [giftcard, setGiftcard] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchGiftcard = async () => {
//       try {
//         const { data } = await api.get(`/user/giftcards/details/${id}`); // ✅ cookies auto included
//         setGiftcard(data.giftCard);
//       } catch (error) {
//         console.error("Error fetching giftcard:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchGiftcard();
//   }, [id]);

//   if (loading) {
//     // ✅ Skeleton shimmer effect
//     return (
//       <div className="container py-4">
//         <div className="skeleton-card"></div>
//       </div>
//     );
//   }

//   if (!giftcard) {
//     return (
//       <div className="text-center py-5">
//         <h5 className="text-danger">Gift Card not found</h5>
//       </div>
//     );
//   }

//   return (
//     <>
    
//     <Header />

    
//     <div className="container py-4 giftcard-inner">
//       <Row className="justify-content-center">
//         {/* Left Section */}
//         <Col lg={6} md={12} className="mb-3">
//           <Card className="shadow-sm giftcard-card">
//             <Card.Body>
//               <div className="giftcard-preview">
//                 <img
//                   src={
//                     giftcard.template?.image ||
//                     "https://via.placeholder.com/600x200"
//                   }
//                   alt="Gift Card"
//                   className="img-fluid rounded"
//                 />
//               </div>
//               <h5 className="text-center my-3 giftcard-title">
//                 {giftcard.template?.title || "Joyory Gift Card"}
//               </h5>
//               <p className="text-muted text-center">
//                 {giftcard.template?.description}
//               </p>
//               <p>
//                 <strong>From:</strong> {giftcard.sender?.name || "Anonymous"}
//               </p>
//               <Row>
//                 <Col xs={6}>
//                   <p>
//                     <strong>Initial Amount:</strong>
//                     <br />₹{giftcard.initialAmount}
//                   </p>
//                 </Col>
//                 <Col xs={6}>
//                   <p>
//                     <strong>Balance:</strong>
//                     <br />₹{giftcard.balance}
//                   </p>
//                 </Col>
//               </Row>
//               <Row>
//                 <Col xs={6}>
//                   <p>
//                     <strong>Card Code:</strong>
//                     <br />
//                     {giftcard.code}
//                   </p>
//                 </Col>
//                 <Col xs={6}>
//                   <p>
//                     <strong>PIN:</strong>
//                     <br />
//                     {giftcard.pin}
//                   </p>
//                 </Col>
//               </Row>
//               <Row>
//                 <Col xs={6}>
//                   <p>
//                     <strong>Expiry Date:</strong>
//                     <br />
//                     {new Date(giftcard.expiryDate).toLocaleDateString()}
//                   </p>
//                 </Col>
//                 <Col xs={6}>
//                   <p>
//                     <strong>Status:</strong>
//                     <br />
//                     {giftcard.statusMessage}
//                   </p>
//                 </Col>
//               </Row>
//               <Button variant="primary" className="w-100 mt-2">
//                 Redeem Now
//               </Button>
//             </Card.Body>
//           </Card>
//         </Col>

//         {/* Right Section */}
//         <Col lg={6} md={12} className="mb-3 details">
//           <Card className="shadow-sm giftcard-card">
//             <Card.Body>
//               <h5>How to Avail</h5>
//               <ul>
//                 <li>Click on the Redeem button and follow the process</li>
//                 <li>Add products to the cart and apply your gift card</li>
//                 <li>Register/login with your email or mobile number</li>
//               </ul>
//               <h5>Terms & Conditions</h5>
//               <ul>
//                 <li>Gift cards are non-refundable and non-transferable</li>
//                 <li>Balance cannot be redeemed for cash</li>
//                 <li>Expires on the mentioned expiry date</li>
//               </ul>
//               <h5>How To Use</h5>
//               <ul>
//                 <li>Enter the card code & PIN during checkout</li>
//                 <li>Remaining balance stays valid till expiry</li>
//                 <li>Use multiple gift cards if needed</li>
//               </ul>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </div>


//     <Footer />


//     </>
//   );
// };

// export default Giftcardinnersection;






// // src/components/Giftcardinnersection.jsx
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { Card, Button, Row, Col } from "react-bootstrap";
// import api from "../api/axios";  // ✅ use axios instance
// import "../css/Giftcardinnersection.css";
// import Header from "./Header";
// import Footer from "./Footer";

// const Giftcardinnersection = () => {
//   const { id } = useParams();
//   const [giftcard, setGiftcard] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchGiftcard = async () => {
//       try {
//         const { data } = await api.get(`/user/giftcards/details/${id}`); // ✅ cookies auto included
//         setGiftcard(data.giftCard);
//       } catch (error) {
//         console.error("Error fetching giftcard:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchGiftcard();
//   }, [id]);

//   if (loading) {
//     // ✅ Skeleton shimmer effect
//     return (
//       <div className="container py-4">
//         <div className="skeleton-card"></div>
//       </div>
//     );
//   }

//   if (!giftcard) {
//     return (
//       <div className="text-center py-5">
//         <h5 className="text-danger">Gift Card not found</h5>
//       </div>
//     );
//   }

//   return (
//     <>
    
//     <Header />

    
//     <div className="container py-4 giftcard-inner">
//       <Row className="justify-content-center">
//         {/* Left Section */}
//         <Col lg={6} md={12} className="mb-3">
//           <Card className="shadow-sm giftcard-card">
//             <Card.Body>
//               <div className="giftcard-preview">
//                 <img
//                   src={
//                     giftcard.template?.image ||
//                     "https://via.placeholder.com/600x200"
//                   }
//                   alt="Gift Card"
//                   className="img-fluid rounded"
//                 />
//               </div>
//               <h5 className="text-center my-3 giftcard-title">
//                 {giftcard.template?.title || "Joyory Gift Card"}
//               </h5>
//               <p className="text-muted text-center">
//                 {giftcard.template?.description}
//               </p>
//               <p>
//                 <strong>From:</strong> {giftcard.sender?.name || "Anonymous"}
//               </p>
//               <Row>
//                 <Col xs={6}>
//                   <p>
//                     <strong>Initial Amount:</strong>
//                     <br />₹{giftcard.initialAmount}
//                   </p>
//                 </Col>
//                 <Col xs={6}>
//                   <p>
//                     <strong>Balance:</strong>
//                     <br />₹{giftcard.balance}
//                   </p>
//                 </Col>
//               </Row>
//               <Row>
//                 <Col xs={6}>
//                   <p>
//                     <strong>Card Code:</strong>
//                     <br />
//                     {giftcard.code}
//                   </p>
//                 </Col>
//                 <Col xs={6}>
//                   <p>
//                     <strong>PIN:</strong>
//                     <br />
//                     {giftcard.pin}
//                   </p>
//                 </Col>
//               </Row>
//               <Row>
//                 <Col xs={6}>
//                   <p>
//                     <strong>Expiry Date:</strong>
//                     <br />
//                     {new Date(giftcard.expiryDate).toLocaleDateString()}
//                   </p>
//                 </Col>
//                 <Col xs={6}>
//                   <p>
//                     <strong>Status:</strong>
//                     <br />
//                     {giftcard.statusMessage}
//                   </p>
//                 </Col>
//               </Row>
//               <Button variant="primary" className="w-100 mt-2">
//                 Redeem Now
//               </Button>
//             </Card.Body>
//           </Card>
//         </Col>

//         {/* Right Section */}
//         <Col lg={6} md={12} className="mb-3 details">
//           <Card className="shadow-sm giftcard-card">
//             <Card.Body>
//               <h5>How to Avail</h5>
//               <ul>
//                 <li>Click on the Redeem button and follow the process</li>
//                 <li>Add products to the cart and apply your gift card</li>
//                 <li>Register/login with your email or mobile number</li>
//               </ul>
//               <h5>Terms & Conditions</h5>
//               <ul>
//                 <li>Gift cards are non-refundable and non-transferable</li>
//                 <li>Balance cannot be redeemed for cash</li>
//                 <li>Expires on the mentioned expiry date</li>
//               </ul>
//               <h5>How To Use</h5>
//               <ul>
//                 <li>Enter the card code & PIN during checkout</li>
//                 <li>Remaining balance stays valid till expiry</li>
//                 <li>Use multiple gift cards if needed</li>
//               </ul>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </div>


//     <Footer />


//     </>
//   );
// };

// export default Giftcardinnersection;













import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Row, Col } from "react-bootstrap";
import api from "../api/axios"; // axios instance
import "../css/Giftcardinnersection.css";
import Header from "./Header";
import Footer from "./Footer";

const Giftcardinnersection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [giftcard, setGiftcard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGiftcard = async () => {
      try {
        const { data } = await api.get(`/user/giftcards/details/${id}`);
        setGiftcard(data.giftCard);
      } catch (error) {
        console.error("Error fetching giftcard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGiftcard();
  }, [id]);

  const handleRedeem = async () => {
    if (!giftcard) return;

    try {
      // Save gift card info in localStorage or sessionStorage
      localStorage.setItem(
        "giftCardToApply",
        JSON.stringify({
          code: giftcard.code,
          pin: giftcard.pin,
          amount: giftcard.balance,
        })
      );

      // Redirect to Cart page
      navigate("/cartpage");
    } catch (err) {
      console.error("Error redeeming gift card:", err);
    }
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="skeleton-card"></div>
      </div>
    );
  }

  if (!giftcard) {
    return (
      <div className="text-center py-5">
        <h5 className="text-danger">Gift Card not found</h5>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="container py-4 giftcard-inner">
        <Row className="justify-content-center">
          {/* Left Section */}
          <Col lg={6} md={12} className="mb-3">
            <Card className="shadow-sm giftcard-card">
              <Card.Body>
                <div className="giftcard-preview">
                  <img
                    src={giftcard.template?.image || "https://via.placeholder.com/600x200"}
                    alt="Gift Card"
                    className="img-fluid rounded"
                  />
                </div>
                <h5 className="text-center my-3 giftcard-title">
                  {giftcard.template?.title || "Joyory Gift Card"}
                </h5>
                <p className="text-muted text-center">{giftcard.template?.description}</p>
                <p>
                  <strong>From:</strong> {giftcard.sender?.name || "Anonymous"}
                </p>
                <Row>
                  <Col xs={6}>
                    <p>
                      <strong>Initial Amount:</strong>
                      <br />₹{giftcard.initialAmount}
                    </p>
                  </Col>
                  <Col xs={6}>
                    <p>
                      <strong>Balance:</strong>
                      <br />₹{giftcard.balance}
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col xs={6}>
                    <p>
                      <strong>Card Code:</strong>
                      <br />
                      {giftcard.code}
                    </p>
                  </Col>
                  <Col xs={6}>
                    <p>
                      <strong>PIN:</strong>
                      <br />
                      {giftcard.pin}
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col xs={6}>
                    <p>
                      <strong>Expiry Date:</strong>
                      <br />
                      {new Date(giftcard.expiryDate).toLocaleDateString()}
                    </p>
                  </Col>
                  <Col xs={6}>
                    <p>
                      <strong>Status:</strong>
                      <br />
                      {giftcard.statusMessage}
                    </p>
                  </Col>
                </Row>
                <Button variant="primary" className="w-100 mt-2" onClick={handleRedeem}>
                  Redeem Now
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Right Section */}
          <Col lg={6} md={12} className="mb-3 details">
            <Card className="shadow-sm giftcard-card">
              <Card.Body>
                <h5>How to Avail</h5>
                <ul>
                  <li>Click on the Redeem button and follow the process</li>
                  <li>Add products to the cart and apply your gift card</li>
                  <li>Register/login with your email or mobile number</li>
                </ul>
                <h5>Terms & Conditions</h5>
                <ul>
                  <li>Gift cards are non-refundable and non-transferable</li>
                  <li>Balance cannot be redeemed for cash</li>
                  <li>Expires on the mentioned expiry date</li>
                </ul>
                <h5>How To Use</h5>
                <ul>
                  <li>Enter the card code & PIN during checkout</li>
                  <li>Remaining balance stays valid till expiry</li>
                  <li>Use multiple gift cards if needed</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      <Footer />
    </>
  );
};

export default Giftcardinnersection;
