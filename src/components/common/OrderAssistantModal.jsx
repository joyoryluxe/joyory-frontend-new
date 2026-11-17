import React, { useState, useEffect, useRef, useCallback } from "react";
import axiosInstance from "../../utils/axiosInstance";
import {
  FaTimes,
  FaPaperPlane,
  FaHeadset,
  FaTruck,
  FaUndo,
  FaTimesCircle,
  FaCreditCard,
  FaWhatsapp,
  FaPhoneAlt,
  FaTicketAlt,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaInfoCircle
} from "react-icons/fa";
import { Sparkles, HelpCircle } from "lucide-react";
import "../../styles/OrderAssistantModal.css";

// ─── Swiggy-Style Quick Help Template Prompts ─────────────────────────────────
const SWIGGY_TEMPLATES = [
  { id: "status", label: "📍 Where is my order?", prompt: "Where is my order and what is its current status?" },
  { id: "track", label: "🚚 Track Package", prompt: "How do I track my package on Delhivery?" },
  { id: "cancel", label: "❌ Can I cancel this order?", prompt: "Can I cancel this order? How do I cancel it?" },
  { id: "return", label: "🔄 Return & Replacement", prompt: "What is your return and replacement policy for this order?" },
  { id: "refund", label: "💸 Refund Status", prompt: "How and when will I get my refund for this order?" },
  { id: "contact", label: "📞 Contact Support", prompt: "How can I speak with a human support agent?" },
  { id: "ticket", label: "🎫 Raise a Ticket", isSpecial: "ticket" }
];

export const OrderAssistantModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const orderId = order.orderId || order._id;
  const chatBottomRef = useRef(null);

  // ---------- States ----------
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedActions, setSuggestedActions] = useState([]);
  const [orderContext, setOrderContext] = useState(null);

  // Ticket sub-drawer state
  const [showTicketDrawer, setShowTicketDrawer] = useState(false);
  const [ticketType, setTicketType] = useState("Shipping");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketSubmitting, setTicketSubmitting] = useState(false);
  const [createdTicketId, setCreatedTicketId] = useState(null);

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // ---------- Initialize Context & Greeting ----------
  useEffect(() => {
    let isMounted = true;

    const initAssistant = async () => {
      // Default initial welcome message
      const effectiveStatus = order.orderStatus || order.status || "Awaiting Admin Confirmation";
      const total = order.totalAmount || order.amount || 0;
      const initialGreeting = `Hello! 👋 I am your **Joyory Order Assistant** for order **#${orderId}**.\n\nYour order is currently **${effectiveStatus}** (Total: **₹${total}**).\nHow can I help you today? Choose from the quick options below or ask me anything!`;

      setMessages([
        {
          id: "welcome",
          role: "assistant",
          text: initialGreeting,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);

      try {
        const res = await axiosInstance.get(`/api/user/order-assistant/context/${orderId}`);
        if (isMounted && res.data?.success) {
          setOrderContext(res.data.orderData);
          if (res.data.suggestedActions?.length) {
            setSuggestedActions(res.data.suggestedActions);
          }
        }
      } catch (err) {
        console.warn("Could not load backend order context, using local order snapshot:", err.message);
      }
    };

    initAssistant();

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  // ---------- Send Message to Backend Assistant ----------
  const handleSendMessage = useCallback(async (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      role: "user",
      text: text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    // Prepare conversation history (last 4 turns)
    const historyPayload = messages.slice(-4).map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.text
    }));

    try {
      const res = await axiosInstance.post("/api/user/order-assistant/chat", {
        orderId,
        message: text,
        history: historyPayload
      });

      if (res.data?.success) {
        const aiMsg = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          text: res.data.reply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          context: res.data.orderContext,
          source: res.data.source
        };
        setMessages((prev) => [...prev, aiMsg]);

        if (res.data.suggestedActions?.length) {
          setSuggestedActions(res.data.suggestedActions);
        }
        if (res.data.orderContext) {
          setOrderContext((prev) => ({ ...prev, ...res.data.orderContext }));
        }
      } else {
        throw new Error(res.data?.message || "Failed to fetch response");
      }
    } catch (err) {
      console.error("Order Assistant error:", err);
      const fallbackMsg = {
        id: `ai-err-${Date.now()}`,
        role: "assistant",
        text: "I am having trouble reaching our AI servers right now. For immediate support, please connect directly with our 24×7 customer care on WhatsApp/Call at **+91 9601177701** or email **hello@joyory.com**.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading, messages, orderId]);

  // ---------- Handle Template Click ----------
  const handleTemplateClick = (item) => {
    if (item.isSpecial === "ticket") {
      setShowTicketDrawer(true);
      return;
    }
    handleSendMessage(item.prompt || item.label);
  };

  // ---------- Submit Support Ticket ----------
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!ticketMessage.trim() || ticketSubmitting) return;

    setTicketSubmitting(true);
    try {
      const res = await axiosInstance.post("/api/user/order-assistant/ticket", {
        orderId,
        issueType: ticketType,
        message: ticketMessage.trim()
      });

      if (res.data?.success) {
        setCreatedTicketId(res.data.ticketId);
        // Post confirmation into chat
        const confMsg = {
          id: `ai-ticket-${Date.now()}`,
          role: "assistant",
          text: `✅ **Support Ticket Created Successfully!**\n\nTicket ID: **${res.data.ticketId}**\nIssue Type: **${ticketType}**\n\nOur customer support team has received your request and will contact you via phone or email shortly.`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        };
        setMessages((prev) => [...prev, confMsg]);
        setTimeout(() => {
          setShowTicketDrawer(false);
          setCreatedTicketId(null);
          setTicketMessage("");
        }, 1500);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create support ticket. Please try again.");
    } finally {
      setTicketSubmitting(false);
    }
  };

  // ---------- Markdown Formatter ----------
  const renderFormattedText = (rawText) => {
    if (!rawText) return null;
    const lines = rawText.split("\n");

    return lines.map((line, idx) => {
      // Bold formatter: **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      return (
        <React.Fragment key={idx}>
          {formattedParts}
          {idx < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  // Status badge styling
  const getStatusClass = (statusStr) => {
    const s = String(statusStr || "").toLowerCase();
    if (s.includes("await") || s.includes("pending")) return "status-awaiting";
    if (s.includes("ship") || s.includes("transit")) return "status-shipped";
    if (s.includes("deliv")) return "status-delivered";
    if (s.includes("cancel")) return "status-cancelled";
    return "status-pending";
  };

  const currentStatus = orderContext?.orderStatus || order.orderStatus || order.status || "Awaiting Admin Confirmation";
  const firstShipment = orderContext?.shipments?.[0] || order.shipments?.[0];
  const delhiveryTrackingUrl = firstShipment?.tracking_url || (firstShipment?.waybill ? `https://www.delhivery.com/track/package/${firstShipment.waybill}` : null);

  return (
    <div className="order-assistant-overlay" onClick={onClose}>
      <div className="order-assistant-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="oa-header">
          <div className="oa-header-left">
            <div className="oa-brand-icon-wrap">
              <Sparkles size={20} />
            </div>
            <div className="oa-title-box">
              <h5>
                Joyory Order Assistant <span className="oa-ai-pill">AI</span>
              </h5>
              <p className="oa-subtitle">Instant order help & Joyory policies</p>
            </div>
          </div>
          <button className="oa-close-btn" onClick={onClose} aria-label="Close assistant">
            <FaTimes size={16} />
          </button>
        </div>

        {/* Order Quick Details Bar */}
        <div className="oa-order-banner">
          <div className="oa-order-pill">
            <span>Order ID:</span>
            <strong>{orderId}</strong>
          </div>
          <span className={`oa-status-badge ${getStatusClass(currentStatus)}`}>
            {currentStatus}
          </span>
        </div>

        {/* Swiggy-Style Quick Help Action Templates */}
        <div className="oa-templates-section">
          <div className="oa-templates-label">
            <HelpCircle size={13} /> Quick Help Options:
          </div>
          <div className="oa-templates-scroll">
            {SWIGGY_TEMPLATES.map((item) => (
              <button
                key={item.id}
                type="button"
                className="oa-chip-btn"
                onClick={() => handleTemplateClick(item)}
                disabled={isLoading}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages Stream */}
        <div className="oa-chat-body">
          {messages.map((m) => {
            const isUser = m.role === "user";
            return (
              <div key={m.id} className={`oa-message-row ${isUser ? "user-row" : "ai-row"}`}>
                {!isUser && (
                  <div className="oa-avatar-small">
                    <FaHeadset />
                  </div>
                )}
                <div className={`oa-bubble ${isUser ? "user-bubble" : "ai-bubble"}`}>
                  <div>{renderFormattedText(m.text)}</div>

                  {/* Contextual Action Buttons in AI bubble */}
                  {!isUser && (
                    <div className="oa-bubble-actions">
                      {delhiveryTrackingUrl && (
                        <a
                          href={delhiveryTrackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="oa-action-link-btn btn-delhivery"
                        >
                          <FaTruck /> Delhivery Tracking <FaExternalLinkAlt size={10} />
                        </a>
                      )}
                      <a
                        href={`https://wa.me/919601177701?text=Hi%20Joyory%20Support,%20I%20need%20help%20with%20Order%20%23${orderId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="oa-action-link-btn btn-whatsapp"
                      >
                        <FaWhatsapp /> WhatsApp Support
                      </a>
                      <a href="tel:9601177701" className="oa-action-link-btn btn-call">
                        <FaPhoneAlt /> Call +91 9601177701
                      </a>
                      <button
                        type="button"
                        className="oa-action-link-btn btn-ticket"
                        onClick={() => setShowTicketDrawer(true)}
                      >
                        <FaTicketAlt /> Raise Ticket
                      </button>
                    </div>
                  )}

                  <div className="oa-time">{m.time}</div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="oa-message-row ai-row">
              <div className="oa-avatar-small">
                <FaHeadset />
              </div>
              <div className="oa-bubble ai-bubble oa-typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="oa-chat-footer">
          <form
            className="oa-input-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <input
              type="text"
              className="oa-input-field"
              placeholder="Ask anything about this order..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="oa-send-btn"
              disabled={!inputValue.trim() || isLoading}
              aria-label="Send message"
            >
              <FaPaperPlane size={13} />
            </button>
          </form>
        </div>

        {/* Support Ticket Creation Sub-Drawer */}
        {showTicketDrawer && (
          <div className="oa-ticket-panel">
            <div className="oa-ticket-header">
              <div className="d-flex align-items-center gap-2">
                <FaTicketAlt color="#d4af37" />
                <h6 className="mb-0 fw-bold">Raise Support Ticket for #{orderId}</h6>
              </div>
              <button
                type="button"
                className="oa-close-btn"
                onClick={() => setShowTicketDrawer(false)}
              >
                <FaTimes size={14} />
              </button>
            </div>
            <div className="oa-ticket-body">
              {createdTicketId ? (
                <div className="text-center py-4">
                  <FaCheckCircle size={44} color="#16a34a" className="mb-3" />
                  <h6 className="fw-bold">Ticket Registered!</h6>
                  <p className="text-muted small">Ticket ID: <strong>{createdTicketId}</strong></p>
                  <p className="small text-secondary">Our executive will review your order details and get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleCreateTicket}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-dark">Issue Category</label>
                    <select
                      className="form-select form-select-sm"
                      value={ticketType}
                      onChange={(e) => setTicketType(e.target.value)}
                    >
                      <option value="Shipping">Shipping & Delivery Delay</option>
                      <option value="Damaged Item">Damaged / Broken / Leaking Product</option>
                      <option value="Wrong Item">Wrong Product or Shade Received</option>
                      <option value="Payment">Payment or Refund Discrepancy</option>
                      <option value="General">Other Order Assistance</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-dark">Describe your issue</label>
                    <textarea
                      className="form-control form-control-sm"
                      rows={4}
                      placeholder="Please share what happened so we can resolve it quickly..."
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      required
                    />
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setShowTicketDrawer(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-sm btn-dark"
                      disabled={!ticketMessage.trim() || ticketSubmitting}
                    >
                      {ticketSubmitting ? "Submitting..." : "Submit Ticket"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default OrderAssistantModal;
