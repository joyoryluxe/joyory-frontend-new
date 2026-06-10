/**
 * BeautyConcierge.jsx
 * Joyory AI Beauty Concierge — floating chat widget
 * Connects to: POST /api/user/beauty-concierge/chat
 *              GET  /api/user/beauty-concierge/history
 *              DEL  /api/user/beauty-concierge/history
 */
import React, { useState, useEffect, useRef, useCallback, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import {
  sendChatMessage,
  getChatHistory,
  clearChatHistory,
} from "../api/beautyConciergeApi.js";
import "../styles/BeautyConcierge.css";
import LogoImg from "../assets/Logo.png";

/* ─── Icons (inline SVG to avoid extra deps) ────────────────────────────── */
const IconWand = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 4V2" /><path d="M15 16v-2" /><path d="M8 9h2" /><path d="M20 9h2" /><path d="M17.8 11.8L19 13" /><path d="M15 9h0" /><path d="M17.8 6.2L19 5" /><path d="M3 21l9-9" /><path d="M12.2 6.2L11 5" /></svg>;
const IconClose = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
const IconSend = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 2L11 13" /><path d="M22 2L15 22 11 13 2 9l20-7z" fill="currentColor" /></svg>;
const IconTrash = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" /></svg>;
const IconChat = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>;
const IconHistory = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-5.98" /></svg>;
const IconSpark = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
const IconBag = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>;
const IconAlert = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>;

/* ─── Starter Prompts ────────────────────────────────────────────────────── */
const STARTERS = [
  { icon: "✨", text: "Best serum for glowing skin?" },
  { icon: "💧", text: "Recommend moisturiser for oily skin" },
  { icon: "💄", text: "Top lipstick shades this season?" },
  { icon: "🛡️", text: "Sunscreen for sensitive skin under ₹500" },
  { icon: "🌿", text: "Products with hyaluronic acid" },
];

/* ─── Discover Topics ────────────────────────────────────────────────────── */
const TOPICS = [
  { icon: "🧴", label: "Skincare Routine", desc: "AM/PM routine builder", q: "Build me a daily skincare routine for combination skin" },
  { icon: "💋", label: "Lip Care", desc: "Lip balms, liners & more", q: "Best lip care products for dry, chapped lips" },
  { icon: "👁️", label: "Eye Makeup", desc: "Eyeliner, mascara, shadows", q: "Recommend eye makeup products for beginners" },
  { icon: "☀️", label: "Sun Protection", desc: "SPF picks for India", q: "Best sunscreen for Indian skin in summer" },
  { icon: "💆", label: "Anti-Aging", desc: "Serums & treatments", q: "Anti-aging skincare recommendations for 30s" },
  { icon: "🌸", label: "Sensitive Skin", desc: "Gentle, fragrance-free", q: "Recommend gentle products for sensitive skin" },
];

/* ─── Markdown-lite renderer ─────────────────────────────────────────────── */
function renderMarkdown(text) {
  if (!text) return "";
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, '<code style="background:rgba(232,66,122,0.15);padding:1px 5px;border-radius:4px;font-size:12px;">$1</code>')
    .replace(/\n/g, "<br>");
}

/* ─── Format time ────────────────────────────────────────────────────────── */
function fmtTime(date) {
  const d = date ? new Date(date) : new Date();
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

/* ─── Product Card ───────────────────────────────────────────────────────── */
function ProductCard({ product, onClick }) {
  const hasDiscount = product.discountedPrice && product.discountedPrice < product.price;
  return (
    <div className="bc-prod-card" onClick={() => onClick(product)}>
      {product.image
        ? <img className="bc-prod-img" src={product.image} alt={product.name} onError={e => { e.target.style.display = "none"; }} />
        : <div className="bc-prod-img-placeholder">🧴</div>
      }
      <div className="bc-prod-body">
        <div className="bc-prod-name">{product.name}</div>
        <div>
          <span className="bc-prod-price">
            ₹{hasDiscount ? product.discountedPrice : product.price}
          </span>
          {hasDiscount && (
            <span className="bc-prod-original">₹{product.price}</span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════════════════ */
export default function BeautyConcierge() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const hideFab = ["/login", "/signup", "/affiliatelogin", "/affiliatesignup"].includes(
    location.pathname.toLowerCase()
  );

  if (hideFab) return null;

  /* ── state ── */
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [activeTab, setActiveTab] = useState("chat"); // "chat" | "discover" | "history"
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [sending, setSending] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [histLoading, setHistLoading] = useState(false);
  const [histLoaded, setHistLoaded] = useState(false);
  const [unread, setUnread] = useState(0);

  /* ── refs ── */
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const windowRef = useRef(null);
  const isLoggedIn = user && !user.guest;

  /* ── scroll to bottom ── */
  const scrollBottom = useCallback(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 60);
  }, []);

  useEffect(() => { scrollBottom(); }, [messages, scrollBottom]);

  /* ── load history on open ── */
  useEffect(() => {
    if (open && !histLoaded) {
      loadHistory();
    }
  }, [open]); // eslint-disable-line

  /* ── keyboard shortcut: Escape to close ── */
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape" && open) handleClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  /* ── Load history ── */
  async function loadHistory() {
    setHistLoading(true);
    try {
      const { data } = await getChatHistory(isLoggedIn ? null : sessionId);
      if (data.success && data.messages?.length) {
        const mapped = data.messages.map((m) => ({
          id: m._id || Math.random().toString(36),
          from: m.role === "user" ? "user" : "bot",
          text: m.content,
          products: m.recommendedProducts || [],
          time: m.createdAt,
        }));
        setMessages(mapped);
        setHistLoaded(true);
      } else {
        // Show welcome message
        setMessages([{
          id: "welcome",
          from: "bot",
          text: null,
          isWelcome: true,
          time: new Date(),
        }]);
        setHistLoaded(true);
      }
    } catch {
      setMessages([{
        id: "welcome",
        from: "bot",
        text: null,
        isWelcome: true,
        time: new Date(),
      }]);
      setHistLoaded(true);
    }
    setHistLoading(false);
  }

  /* ── Open ── */
  function handleOpen() {
    setOpen(true);
    setClosing(false);
    setUnread(0);
    // Focus textarea after animation
    setTimeout(() => textareaRef.current?.focus(), 350);
  }

  /* ── Close ── */
  function handleClose() {
    setClosing(true);
    setTimeout(() => { setOpen(false); setClosing(false); }, 220);
  }

  /* ── Toggle ── */
  function toggle() {
    open ? handleClose() : handleOpen();
  }

  /* ── Send Message ── */
  async function sendMessage(text) {
    const trimmed = (text || inputVal).trim();
    if (!trimmed || sending) return;

    // Remove welcome screen if present
    setMessages(prev => prev.filter(m => !m.isWelcome));

    // Add user message
    const userMsg = { id: Date.now().toString(), from: "user", text: trimmed, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputVal("");
    setSending(true);

    // Add typing indicator
    const typingId = "typing-" + Date.now();
    setMessages(prev => [...prev, { id: typingId, from: "bot", isTyping: true }]);

    try {
      const { data } = await sendChatMessage(trimmed, isLoggedIn ? null : sessionId);

      // Remove typing indicator
      setMessages(prev => prev.filter(m => m.id !== typingId));

      if (data.success) {
        if (data.sessionId && !sessionId) setSessionId(data.sessionId);

        const botMsg = {
          id: "bot-" + Date.now(),
          from: "bot",
          text: data.reply,
          products: data.recommendedProducts || [],
          time: new Date(),
        };
        setMessages(prev => [...prev, botMsg]);

        // If chat closed, show unread badge
        if (!open) setUnread(u => u + 1);
      } else {
        throw new Error(data.message || "Something went wrong");
      }
    } catch (err) {
      setMessages(prev => prev.filter(m => m.id !== typingId));
      setMessages(prev => [
        ...prev,
        {
          id: "err-" + Date.now(),
          from: "bot",
          isError: true,
          text: err?.response?.data?.message || "Oops! Something went wrong. Please try again 🙏",
          time: new Date(),
        },
      ]);
    } finally {
      setSending(false);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }

  /* ── Clear History ── */
  async function handleClearHistory() {
    try {
      await clearChatHistory(isLoggedIn ? null : sessionId);
      setMessages([{ id: "welcome", from: "bot", isWelcome: true, time: new Date() }]);
      setHistLoaded(false);
    } catch {/* silent */ }
  }

  /* ── Navigate to product ── */
  function onProductClick(product) {
    if (product.slug) {
      handleClose();
      navigate(`/product/${product.slug}`);
    }
  }

  /* ── Auto-resize textarea ── */
  function handleInput(e) {
    setInputVal(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 90) + "px";
  }

  /* ── Send on Enter (Shift+Enter = newline) ── */
  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  /* ── Tab switch ── */
  function switchTab(tab) {
    setActiveTab(tab);
    if (tab === "history" && !histLoaded) loadHistory();
  }

  /* ─────────────────────────────────────────────────────────────────────── */
  return (
    <>
      {/* ── Floating Action Button ── */}
      <button
        className="bc-fab"
        onClick={toggle}
        aria-label="Open Beauty Concierge"
        id="beauty-concierge-fab"
      >
        {open ? <IconClose /> : <IconWand />}
        {!open && unread > 0 && (
          <span className="bc-fab-badge">{unread > 9 ? "9+" : unread}</span>
        )}
      </button>

      {/* ── Chat Window ── */}
      {open && (
        <div
          className={`bc-window${closing ? " bc-closing" : ""}`}
          ref={windowRef}
          id="beauty-concierge-window"
        >
          {/* Header */}
          <div className="bc-header">
            <div className="bc-avatar">
              <img src={LogoImg} className="bc-logo-img" alt="Joyory Logo" />
              <span className="bc-online-dot" />
            </div>
            <div className="bc-header-info">
              <div className="bc-header-name">Joyory Beauty Concierge</div>
              <div className="bc-header-status">● Online · AI-powered</div>
            </div>
            <div className="bc-header-actions">
              <button
                className="bc-icon-btn"
                onClick={handleClearHistory}
                title="Clear chat"
                aria-label="Clear chat history"
              >
                <IconTrash />
              </button>
              <button
                className="bc-icon-btn"
                onClick={handleClose}
                aria-label="Close chat"
              >
                <IconClose />
              </button>
            </div>
          </div>

          {/* Gradient glow line */}
          <div className="bc-header-glow" />

          {/* Tab Bar */}
          <div className="bc-tabs" role="tablist">
            <button
              role="tab"
              className={`bc-tab${activeTab === "chat" ? " active" : ""}`}
              onClick={() => switchTab("chat")}
              id="bc-tab-chat"
            >
              <IconChat />
              Chat
            </button>
            <button
              role="tab"
              className={`bc-tab${activeTab === "discover" ? " active" : ""}`}
              onClick={() => switchTab("discover")}
              id="bc-tab-discover"
            >
              <IconSpark />
              Discover
            </button>
            <button
              role="tab"
              className={`bc-tab${activeTab === "history" ? " active" : ""}`}
              onClick={() => switchTab("history")}
              id="bc-tab-history"
            >
              <IconHistory />
              History
            </button>
          </div>

          {/* ══ CHAT TAB ══════════════════════════════════════════════════ */}
          {activeTab === "chat" && (
            <>
              <div className="bc-messages" role="log" aria-live="polite" id="bc-messages-area">
                {histLoading ? (
                  /* Skeleton loading */
                  [1, 2, 3].map(i => (
                    <div key={i} className="bc-msg-row">
                      <div className="bc-msg-avatar" />
                      <div className="bc-skeleton" style={{ height: 40, width: `${50 + i * 15}%`, borderRadius: 14 }} />
                    </div>
                  ))
                ) : messages.length === 0 || (messages.length === 1 && messages[0]?.isWelcome) ? (
                  /* Welcome screen */
                  <div className="bc-welcome">
                    <div className="bc-welcome-icon">
                      <img src={LogoImg} className="bc-welcome-logo" alt="Joyory Logo" />
                    </div>
                    <h3>Your Beauty Expert is Here!</h3>
                    <p>
                      Ask me anything — product recommendations, skincare routines,
                      shade matching, or beauty tips tailored just for you.
                    </p>
                    <div className="bc-starter-chips">
                      {STARTERS.map((s, i) => (
                        <button
                          key={i}
                          className="bc-starter-chip"
                          onClick={() => sendMessage(s.text)}
                          id={`bc-starter-${i}`}
                        >
                          <span className="bc-starter-chip-icon">{s.icon}</span>
                          {s.text}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Message list */
                  messages.map((msg) => (
                    <MessageRow
                      key={msg.id}
                      msg={msg}
                      onProductClick={onProductClick}
                      onQuickSend={sendMessage}
                    />
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Char count hint */}
              {inputVal.length > 700 && (
                <div className="bc-char-count">
                  {inputVal.length} / 1000
                </div>
              )}

              {/* Input bar */}
              <div className="bc-input-bar">
                <div className="bc-input-wrap">
                  <textarea
                    ref={textareaRef}
                    className="bc-textarea"
                    value={inputVal}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about skincare, makeup, routines…"
                    maxLength={1000}
                    rows={1}
                    disabled={sending}
                    id="bc-message-input"
                    aria-label="Type your message"
                  />
                </div>
                <button
                  className="bc-send-btn"
                  onClick={() => sendMessage()}
                  disabled={!inputVal.trim() || sending}
                  aria-label="Send message"
                  id="bc-send-btn"
                >
                  {sending ? <span className="bc-spinner" /> : <IconSend />}
                </button>
              </div>
            </>
          )}

          {/* ══ DISCOVER TAB ══════════════════════════════════════════════ */}
          {activeTab === "discover" && (
            <div className="bc-discover-tab">
              <div className="bc-discover-section-title">✨ Explore Topics</div>
              <div className="bc-topic-grid">
                {TOPICS.map((t, i) => (
                  <button
                    key={i}
                    className="bc-topic-card"
                    id={`bc-topic-${i}`}
                    onClick={() => {
                      switchTab("chat");
                      sendMessage(t.q);
                    }}
                  >
                    <span className="bc-topic-icon">{t.icon}</span>
                    <div className="bc-topic-label">{t.label}</div>
                    <div className="bc-topic-desc">{t.desc}</div>
                  </button>
                ))}
              </div>

              <div className="bc-discover-section-title" style={{ marginTop: 4 }}>💡 Quick Starters</div>
              <div className="bc-quick-replies" style={{ flexDirection: "column", gap: 8 }}>
                {STARTERS.map((s, i) => (
                  <button
                    key={i}
                    className="bc-starter-chip"
                    style={{ maxWidth: "100%" }}
                    onClick={() => {
                      switchTab("chat");
                      sendMessage(s.text);
                    }}
                    id={`bc-discover-starter-${i}`}
                  >
                    <span className="bc-starter-chip-icon">{s.icon}</span>
                    {s.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ══ HISTORY TAB ═══════════════════════════════════════════════ */}
          {activeTab === "history" && (
            <div className="bc-history-tab">
              {histLoading ? (
                [1, 2, 3, 4].map(i => (
                  <div key={i} className="bc-skeleton" style={{ height: 44, marginBottom: 8, borderRadius: 10 }} />
                ))
              ) : messages.filter(m => !m.isWelcome && !m.isTyping).length === 0 ? (
                <div className="bc-history-empty">
                  <span>💬</span>
                  <p style={{ color: "var(--bc-muted)", fontSize: 13, textAlign: "center" }}>
                    No conversation history yet.<br />Start chatting to see messages here!
                  </p>
                  <button
                    className="bc-qr-btn"
                    onClick={() => switchTab("chat")}
                    id="bc-history-start-chat"
                  >
                    Start a conversation →
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
                    <button
                      className="bc-clear-btn"
                      onClick={handleClearHistory}
                      id="bc-clear-history-btn"
                    >
                      Clear History
                    </button>
                  </div>
                  {messages.filter(m => !m.isWelcome && !m.isTyping).map(msg => (
                    <div
                      key={msg.id}
                      style={{
                        padding: "9px 12px",
                        borderRadius: 12,
                        marginBottom: 6,
                        background: msg.from === "user"
                          ? "linear-gradient(135deg,rgba(232,66,122,0.12),rgba(155,39,175,0.12))"
                          : "var(--bc-card)",
                        border: "1px solid var(--bc-border)",
                        fontSize: 12,
                        color: "var(--bc-text)",
                        lineHeight: 1.5,
                      }}
                    >
                      <div style={{ fontSize: 10, color: "var(--bc-muted)", marginBottom: 4, fontWeight: 600 }}>
                        {msg.from === "user" ? "👤 You" : "💎 Concierge"} · {fmtTime(msg.time)}
                      </div>
                      {msg.text?.slice(0, 100)}{msg.text?.length > 100 ? "…" : ""}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MESSAGE ROW
   ══════════════════════════════════════════════════════════════════════════ */
function MessageRow({ msg, onProductClick, onQuickSend }) {
  if (msg.isTyping) {
    return (
      <div className="bc-msg-row">
        <div className="bc-msg-avatar">
          <img src={LogoImg} className="bc-logo-img" alt="Joyory Logo" />
        </div>
        <div className="bc-typing">
          <div className="bc-typing-dot" />
          <div className="bc-typing-dot" />
          <div className="bc-typing-dot" />
        </div>
      </div>
    );
  }

  if (msg.isWelcome) return null; // rendered via welcome screen

  if (msg.isError) {
    return (
      <div className="bc-msg-row">
        <div className="bc-msg-avatar">
          <img src={LogoImg} className="bc-logo-img" alt="Joyory Logo" />
        </div>
        <div style={{ maxWidth: "80%" }}>
          <div className="bc-error-bubble">
            <IconAlert />
            {msg.text}
          </div>
          <div className="bc-bubble-time">{fmtTime(msg.time)}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bc-msg-row${msg.from === "user" ? " user" : ""}`}>
      {msg.from === "bot" && (
        <div className="bc-msg-avatar">
          <img src={LogoImg} className="bc-logo-img" alt="Joyory Logo" />
        </div>
      )}

      <div style={{ maxWidth: "80%", minWidth: 0 }}>
        {/* Bubble */}
        <div
          className={`bc-bubble ${msg.from}`}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }}
        />

        {/* Timestamp */}
        <div className="bc-bubble-time" style={{ textAlign: msg.from === "user" ? "right" : "left" }}>
          {fmtTime(msg.time)}
        </div>

        {/* Product Cards */}
        {msg.from === "bot" && msg.products?.length > 0 && (
          <div className="bc-products-row" id={`bc-products-${msg.id}`}>
            {msg.products.map((p, i) => (
              <ProductCard key={p.productId || i} product={p} onClick={onProductClick} />
            ))}
          </div>
        )}

        {/* Quick follow-up suggestions (for bot messages) */}
        {msg.from === "bot" && !msg.products?.length && msg.text && (
          <QuickReplies text={msg.text} onSend={onQuickSend} />
        )}
      </div>

      {msg.from === "user" && (
        <div className="bc-msg-avatar" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
          👤
        </div>
      )}
    </div>
  );
}

/* ── Quick Replies extractor ── */
function QuickReplies({ text, onSend }) {
  const [shown, setShown] = useState(false);

  // Only show follow-up chips on the last bot message (debounce via mount effect)
  useEffect(() => {
    const timer = setTimeout(() => setShown(true), 400);
    return () => clearTimeout(timer);
  }, []);

  if (!shown) return null;

  // Extract potential follow-ups from common patterns in the AI response
  const suggestions = [];
  if (text.toLowerCase().includes("serum") || text.toLowerCase().includes("moisturi")) {
    suggestions.push("Tell me more about ingredients");
  }
  if (text.toLowerCase().includes("₹") || text.toLowerCase().includes("price")) {
    suggestions.push("Show me budget options under ₹500");
  }
  if (text.toLowerCase().includes("skin")) {
    suggestions.push("What's good for sensitive skin?");
  }
  if (!suggestions.length) return null;

  return (
    <div className="bc-quick-replies">
      {suggestions.slice(0, 2).map((s, i) => (
        <button
          key={i}
          className="bc-qr-btn"
          onClick={() => onSend(s)}
          id={`bc-qr-${i}-${Date.now()}`}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
