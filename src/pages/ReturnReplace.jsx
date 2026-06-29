import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import Loader from "../components/common/Loader";
import axios from "axios";
import {
  FaArrowLeft, FaBoxOpen, FaExchangeAlt, FaUndo, FaTruck,
  FaCheckCircle, FaTimesCircle, FaClock, FaEye
} from "react-icons/fa";

// API Endpoint
const RETURNS_API = "https://beauty.joyory.com/api/returns/my";

/* --- Helper Functions --- */
const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
};

const getStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case "requested": return "bg-warning text-dark";
    case "approved": return "bg-info text-white";
    case "pickup_scheduled": return "bg-primary text-white";
    case "picked_up": return "bg-primary text-white";
    case "in_transit": return "bg-info text-white";
    case "delivered": case "refunded": case "replaced": return "bg-success text-white";
    case "cancelled": case "rejected": return "bg-danger text-white";
    default: return "bg-secondary text-white";
  }
};

const getStatusIcon = (status) => {
  switch (status?.toLowerCase()) {
    case "requested": return <FaClock />;
    case "picked_up": case "in_transit": return <FaTruck />;
    case "delivered": case "refunded": return <FaCheckCircle />;
    case "cancelled": return <FaTimesCircle />;
    default: return <FaBoxOpen />;
  }
};

const ReturnReplace = () => {
  const navigate = useNavigate();
  const [requestList, setRequestList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    setLoading(true);
    try {
      const res = await axios.get(RETURNS_API, { withCredentials: true });
      if (res.data?.success) {
        // Your backend returns { success: true, data: flattenedArray }
        setRequestList(res.data.data || []);
      } else {
        setError("Failed to load return requests.");
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) navigate("/login");
      else setError("Something went wrong while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  /* --- NAVIGATION FUNCTION --- */
  // entry contains: { shipmentId, returnId, return: { ... } }
  const handleViewDetails = (entry) => {
    const shipmentId = entry.shipmentId;
    const returnId = entry.returnId;
    const returnData = entry.return;

    // Navigate to details page and pass the data in state to avoid re-fetching
    navigate(`/ReturnReplaceDetails/${shipmentId}/${returnId}`, {
      state: { returnData: returnData }
    });
  };

  if (loading)
    return (
      <>
        <Header />
        <div className="container py-5 text-center" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Loader text="Loading your requests..." height={150} />
        </div>
        <Footer />
      </>
    );

  return (
    <>
      <Header />
      <div className="container mt-4 mb-5" style={{ minHeight: "60vh" }}>
        <div className="d-flex align-items-center mb-4">
          <button className="btn btn-outline-secondary me-3" onClick={() => navigate("/profile")}>
            <FaArrowLeft />
          </button>
          <h4 className="mb-0 fw-bold page-title-main-name">My Returns & Replacements</h4>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {requestList.length === 0 && !error ? (
          <div className="text-center py-5 border rounded bg-light page-title-main-name">
            <FaBoxOpen size={50} className="text-muted mb-3" />
            <h5>No requests found</h5>
            <button className="btn btn-primary page-title-main-name" onClick={() => navigate("/orders")}>Go to Orders</button>
          </div>
        ) : (
          <div className="row">
            {requestList.map((entry, index) => {
              // DIRECT MAPPING TO YOUR BACKEND RESPONSE
              const returnData = entry.return;
              const isReplace = returnData.type === "replace";

              return (
                <div key={entry.returnId || index} className="col-12 mb-4">
                  <div className="card shadow-sm border-0">
                    <div className="card-header bg-white border-bottom py-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center">


                        <div className="ms-lg-4 ms-0 ms-md-4 mb-5 mt-4 mt-md-4 ">
                          {isReplace ? (
                            <span className="badge bg-primary p-2 page-title-main-name"><FaExchangeAlt /> Replacement ID: {returnData._id}</span>
                          ) : (
                            <span className="badge bg-warning text-dark p-2 page-title-main-name mt-1"><FaUndo /> Return ID: {returnData._id}</span>
                          )}
                        </div>



                      <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0 justify-content-start justify-md-content-end">
                        <span className={`${getStatusBadge(returnData.status)} d-flex align-items-center gap-1 px-3 py-2 rounded-pill`}>
                          {getStatusIcon(returnData.status)}
                          <span className="text-capitalize page-title-main-name">{returnData.status.replace("_", " ")}</span>
                        </span>

                        {/* --- VIEW DETAILS BUTTON --- */}
                        {/* We pass the whole 'entry' object which contains shipmentId */}
                      </div>

                    </div>

                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-8">
                          <h6 className="fw-bold text-secondary page-title-main-name">Items</h6>
                          {/* Display first item as preview */}
                          {returnData.items.slice(0, 1).map((item, i) => (
                            <div key={i} className="d-flex gap-2 align-items-center">
                              <img
                                src={item.images?.[0] || "https://via.placeholder.com/50"}
                                alt="Product"
                                style={{ width: 50, height: 50, objectFit: "cover" }}
                                className="rounded border"
                              />
                              <div>
                                <div className="small fw-bold page-title-main-name">Product ID: {item.productId}</div>
                                <div className="small text-muted page-title-main-name">Reason: {item.reason}</div>
                              </div>
                            </div>
                          ))}
                          {returnData.items.length > 1 && (
                            <small className="text-muted ms-1 page-title-main-name">
                              +{returnData.items.length - 1} more items
                            </small>
                          )}
                        </div>
                        <div className="col-md-4 text-md-end mt-3 mt-md-0">
                          <div className="small text-muted page-title-main-name">Created Date :- {formatDate(returnData.createdAt)}</div>
                          <div className="fw-bold page-title-main-name"></div>
                          {/* Display Shipment ID from the root entry object */}
                          <div className="small text-muted mt-2 page-title-main-name">Shipment Ref :- {entry.shipmentId}</div>
                          {/* <div className="text-monospace small page-title-main-name">{entry.shipmentId}</div> */}


                          <button
                            className="btn btn-sm btn-outline-primary ms-2 mt-3"
                            onClick={() => handleViewDetails(entry)}
                          >
                            <FaEye className="me-1" /> View Details
                          </button>


                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ReturnReplace;