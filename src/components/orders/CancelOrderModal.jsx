import React, { useState, useEffect } from 'react';
import { Modal, Form, Alert, Spinner, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getUserProfile } from '../../api/userApi.js';
import { cancelOrder } from '../../api/orderApi.js';

export default function CancelOrderModal({
    show,
    handleClose,
    order,
}) {
    const navigate = useNavigate();
    const [reason, setReason] = useState("");
    const [otherDetails, setOtherDetails] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const reasons = [
        "Applicable discount/offer was not applied",
        "Changed my mind. Don't need the product",
        "Bought it from somewhere else",
        "Wrong shade/size/colour ordered",
        "Forgot to apply coupon/reward points",
        "Wrong address/phone",
        "Other",
    ];

    const checkAuthentication = async () => {
        try {
            await getUserProfile();
            setIsAuthenticated(true);
            return true;
        } catch {
            setIsAuthenticated(false);
            return false;
        }
    };

    useEffect(() => {
        checkAuthentication();
    }, []);

    const getCancellableOrderId = () => order?._id || order?.orderId || order?.displayOrderId || null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const finalReason = reason === "Other" ? otherDetails.trim() : reason.trim();
        if (!finalReason) {
            setMessage({ type: "danger", text: "Cancellation reason is required" });
            return;
        }

        const isAuth = await checkAuthentication();
        if (!isAuth) {
            setMessage({ type: "warning", text: "Please login to cancel the order." });
            sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
            setTimeout(() => navigate("/login"), 1500);
            return;
        }

        const orderIdToCancel = getCancellableOrderId();
        if (!orderIdToCancel) {
            setMessage({ type: "danger", text: "Order ID not found" });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const res = await cancelOrder(orderIdToCancel, { reason: finalReason });
            const data = res.data;

            if (data?.success) {
                const updatedOrder = {
                    ...order,
                    orderStatus: "Cancelled",
                    status: "Cancelled",
                    cancellation: {
                        reason: finalReason,
                        cancelledBy: "Customer",
                        requestedAt: new Date().toISOString(),
                    },
                };

                sessionStorage.setItem(`cancelledOrder_${orderIdToCancel}`, JSON.stringify(updatedOrder));
                handleClose();
                window.handleCancelSuccess?.({ order: updatedOrder });
            } else {
                throw new Error(data.message || "Cancellation failed");
            }
        } catch (err) {
            setMessage({ type: "danger", text: err.message || "Something went wrong" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Cancel Order</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {message && (
                    <Alert variant={message.type} dismissible onClose={() => setMessage(null)}>
                        {message.text}
                    </Alert>
                )}

                {!isAuthenticated && (
                    <Alert variant="warning">
                        <strong>Authentication Required!</strong> You need to be logged in to cancel orders.
                    </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Reason for Cancellation*</Form.Label>
                        <Dropdown className="w-100" onSelect={(val) => setReason(val)}>
                            <Dropdown.Toggle
                                variant="outline-dark"
                                className="w-100 text-start d-flex justify-content-between align-items-center custom-select-black select-text"
                                disabled={loading || !isAuthenticated}
                            >
                                {reason || "Select a reason"}
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="w-100 custom-dropdown-menu">
                                <Dropdown.Item eventKey="">Select a reason</Dropdown.Item>
                                {reasons.map((r, i) => (
                                    <Dropdown.Item key={i} eventKey={r} active={reason === r}>
                                        {r}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Form.Group>

                    {reason === "Other" && (
                        <Form.Group className="mb-3">
                            <Form.Label>Other Details*</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={otherDetails}
                                onChange={(e) => setOtherDetails(e.target.value)}
                                maxLength={250}
                                required
                                className="custom-select-black"
                                disabled={loading || !isAuthenticated}
                            />
                        </Form.Group>
                    )}

                    <div className="d-flex gap-2 justify-content-between align-items-center mt-3" style={{ width: "100%" }}>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="w-50 btn-cancel-popup mt-0"
                            disabled={loading}
                        >
                            Close
                        </button>
                        <button
                            type="submit"
                            className="w-50 btn-cancel-popup mt-0"
                            disabled={loading || !isAuthenticated}
                        >
                            {loading ? <Spinner animation="border" size="sm" /> : "Confirm Cancellation"}
                        </button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
