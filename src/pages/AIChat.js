import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./AIChat.css";

const formatTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const fmt = (n) =>
  "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

export default function AIChat() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "👋 Hi! Ask me about your expenses", time: formatTime() }
  ]);
  const [input, setInput]                   = useState("");
  const [loading, setLoading]               = useState(false);
  const [sidebarOpen, setSidebarOpen]       = useState(false);
  const [activeChip, setActiveChip]         = useState(null);
  const [summary, setSummary]               = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const chatEndRef = useRef(null);

  // ── Fetch real summary data on mount ──
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get("http://localhost:5000/expenses/summary", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setSummary(res.data);
      } catch (err) {
        console.error("Summary fetch error:", err);
      } finally {
        setSummaryLoading(false);
      }
    };
    fetchSummary();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (msg) => {
    const text = msg || input;
    if (!text.trim()) return;
    setMessages(p => [...p, { role: "user", text, time: formatTime() }]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/ai/chat",
        { message: text },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      const reply = res.data.reply;
      let i = 0;
      const replyTime = formatTime();
      const iv = setInterval(() => {
        i++;
        setMessages(p => {
          const last = p[p.length - 1];
          const next = { role: "bot", text: reply.slice(0, i), typing: true, time: replyTime };
          return last?.typing ? [...p.slice(0, -1), next] : [...p, next];
        });
        if (i >= reply.length) {
          clearInterval(iv);
          setMessages(p => {
            const last = { ...p[p.length - 1] };
            delete last.typing;
            return [...p.slice(0, -1), last];
          });
        }
      }, 20);
    } catch {
      setMessages(p => [...p, { role: "bot", text: "⚠️ Something went wrong. Please try again.", time: formatTime() }]);
    }
    setLoading(false);
  };

  const handleChip = (s, i) => {
    setActiveChip(i);
    sendMessage(s);
  };

  const suggestions = [
    "Where do I spend most?",
    "How can I save money?",
    "Show total expenses",
    "What is my average spending?",
    "Top category analysis",
  ];

  // Build cards from real API data
  const summaryCards = summary
    ? [
        {
          label: "Total this month",
          value: fmt(summary.totalThisMonth),
          sub: summary.momDirection === "up"
            ? `▲ ${summary.momPercent}% vs last month`
            : `▼ ${summary.momPercent}% vs last month`,
          subColor: summary.momDirection === "up" ? "#E24B4A" : "#1D9E75",
        },
        {
          label: "Biggest category",
          value: summary.biggestCategory || "N/A",
          sub: summary.biggestCategory
            ? fmt(summary.biggestCategoryAmount) + " spent"
            : "No data yet",
          subColor: "#888780",
        },
        {
          label: "Budget used",
          value: `${summary.budgetUsedPercent}%`,
          sub: fmt(summary.budgetRemaining) + " remaining",
          subColor: summary.budgetUsedPercent > 80 ? "#E24B4A" : "#BA7517",
          progress: summary.budgetUsedPercent,
        },
        {
          label: "Budget remaining",
          value: fmt(summary.budgetRemaining),
          sub: summary.budgetUsedPercent < 100 ? "Within budget ✓" : "Budget exceeded!",
          subColor: summary.budgetUsedPercent < 100 ? "#1D9E75" : "#E24B4A",
        },
      ]
    : [];

  const userName = localStorage.getItem("userName") || "";
  const initials = userName
    ? userName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "ME";

  return (
    <>
      <div className="ai-bg-layer" aria-hidden="true" />

      <button
        className="toggle-btn"
        onClick={() => setSidebarOpen(o => !o)}
        aria-label="Toggle sidebar"
      >
        ☰
      </button>

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <span className="sidebar-title">Conversations</span>
        </div>
        <div className="sidebar-empty">
          <div className="sidebar-empty-icon">💬</div>
          <p>Your chat history<br />will appear here</p>
        </div>
        <button
          className="sidebar-new-btn"
          onClick={() => {
            setMessages([{ role: "bot", text: "👋 Hi! Ask me about your expenses", time: formatTime() }]);
            setActiveChip(null);
          }}
        >
          + New Chat
        </button>
      </aside>

      <main className="ai-page">

        {/* HEADER */}
        <header className="ai-header">
          <div className="ai-header-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#C19434" strokeWidth="1.5"/>
              <path d="M8 12h8M12 8v8" stroke="#C19434" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="ai-header-text">
            <h2>AI Finance Assistant</h2>
            <p>Powered by Claude · Your personal finance AI</p>
          </div>
          <div className="ai-header-right">
            <div className="ai-status">
              <span className="ai-status-dot" />
              <span className="ai-status-label">Online</span>
            </div>
          </div>
        </header>

        {/* SUMMARY CARDS — skeleton while loading, real data after */}
        <div className="summary-cards">
          {summaryLoading
            ? Array(4).fill(0).map((_, i) => (
                <div className="summary-card skeleton" key={i}>
                  <span className="summary-card-label skeleton-line short" />
                  <span className="summary-card-value skeleton-line" />
                  <span className="summary-card-sub skeleton-line short" />
                </div>
              ))
            : summaryCards.map((card, i) => (
                <div className="summary-card" key={i}>
                  <span className="summary-card-label">{card.label}</span>
                  <span className="summary-card-value">{card.value}</span>
                  {card.progress !== undefined && (
                    <div className="summary-progress-bar">
                      <div
                        className="summary-progress-fill"
                        style={{
                          width: `${card.progress}%`,
                          background: card.progress > 80 ? "#E24B4A" : "#BA7517"
                        }}
                      />
                    </div>
                  )}
                  <span className="summary-card-sub" style={{ color: card.subColor }}>
                    {card.sub}
                  </span>
                </div>
              ))
          }
        </div>

        {/* SUGGESTION CHIPS */}
        <div className="suggestion-box">
          {suggestions.map((s, i) => (
            <button
              key={i}
              className={`suggestion-btn ${activeChip === i ? "active" : ""}`}
              onClick={() => handleChip(s, i)}
            >
              {s}
            </button>
          ))}
        </div>

        {/* CHAT WINDOW */}
        <div className="chat-window">
          <div className="chat-chrome">
            <div className="chrome-dots">
              <span className="cdot cdot-red" />
              <span className="cdot cdot-yellow" />
              <span className="cdot cdot-green" />
            </div>
            <span className="chrome-title">finance.ai — chat session</span>
            <div className="chrome-badge">
              <span className="live-dot" />
              LIVE
            </div>
          </div>

          <div className="chat-inner">
            <div className="chat-date-sep"><span>Today</span></div>

            {messages.map((msg, i) => (
              <div key={i} className={`message-row ${msg.role}`}>
                {msg.role === "bot" && (
                  <div className="avatar bot-avatar" title="AI Assistant">AI</div>
                )}
                <div className="bubble-wrap">
                  <div className={`bubble ${msg.role}`}>{msg.text}</div>
                  {msg.time && <span className="bubble-time">{msg.time}</span>}
                </div>
                {msg.role === "user" && (
                  <div className="avatar user-avatar" title={userName || "You"}>
                    {initials}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="message-row bot">
                <div className="avatar bot-avatar">AI</div>
                <div className="bubble-wrap">
                  <div className="bubble bot typing-indicator">
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* INPUT */}
        <div className="input-shell">
          <div className="input-row">
            <div className="input-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                  stroke="#4A5878" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask something about your finances…"
              onKeyDown={e => e.key === "Enter" && sendMessage()}
            />
            <div className="input-kbd-hint">⌘↵</div>
            <button
              className={`send-btn ${loading ? "disabled" : ""}`}
              onClick={() => sendMessage()}
              disabled={loading}
            >
              <span>Send</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <div className="input-footer">
            <span className="input-model-tag">claude-3 · finance</span>
          </div>
        </div>

      </main>
    </>
  );
}
