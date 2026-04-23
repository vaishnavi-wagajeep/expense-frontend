import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./AIChat.css";

const formatTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function AIChat() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "👋 Hi! Ask me about your expenses", time: formatTime() }
  ]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const chatEndRef = useRef(null);

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

  const suggestions = [
    "Where do I spend most?",
    "How can I save money?",
    "Show total expenses",
    "What is my average spending?",
    "Top category analysis",
  ];

  return (
    <>
      {/* ── FULL-PAGE BACKGROUND LAYER ── */}
      {/* This sits behind everything, independent of any parent styles */}
      <div className="ai-bg-layer" aria-hidden="true" />

      {/* ── SIDEBAR TOGGLE ── */}
      <button
        className="toggle-btn"
        onClick={() => setSidebarOpen(o => !o)}
        aria-label="Toggle sidebar"
      >
        ☰
      </button>

      {/* ── SIDEBAR ── */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <span className="sidebar-title">Conversations</span>
        </div>
        <div className="sidebar-empty">
          <div className="sidebar-empty-icon">💬</div>
          <p>Your chat history<br />will appear here</p>
        </div>
        <button className="sidebar-new-btn" onClick={() => setMessages([
          { role: "bot", text: "👋 Hi! Ask me about your expenses", time: formatTime() }
        ])}>
          + New Chat
        </button>
      </aside>

      {/* ── MAIN PAGE ── */}
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

        {/* SUGGESTIONS */}
        <div className="suggestion-box">
          {suggestions.map((s, i) => (
            <button key={i} className="suggestion-btn" onClick={() => sendMessage(s)}>
              {s}
            </button>
          ))}
        </div>

        {/* CHAT WINDOW */}
        <div className="chat-window">

          {/* Window chrome bar */}
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

          {/* Messages */}
          <div className="chat-inner">
            <div className="chat-date-sep"><span>Today</span></div>

            {messages.map((msg, i) => (
              <div key={i} className={`message-row ${msg.role}`}>
                {msg.role === "bot" && (
                  <div className="avatar bot-avatar">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="#C19434" strokeWidth="1.5"/>
                      <path d="M8 12h8M12 8v8" stroke="#C19434" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                )}
                <div className="bubble-wrap">
                  <div className={`bubble ${msg.role}`}>{msg.text}</div>
                  {msg.time && <span className="bubble-time">{msg.time}</span>}
                </div>
                {msg.role === "user" && (
                  <div className="avatar user-avatar">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="8" r="4" stroke="#C19434" strokeWidth="1.5"/>
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#C19434" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="message-row bot">
                <div className="avatar bot-avatar">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#C19434" strokeWidth="1.5"/>
                    <path d="M8 12h8M12 8v8" stroke="#C19434" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="bubble-wrap">
                  <div className="bubble bot typing">
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
            <button className="send-btn" onClick={() => sendMessage()}>
              <span>Send</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <div className="input-footer">
            <span className="input-hint">Press <kbd>↵ Enter</kbd> to send</span>
            <span className="input-footer-spacer" />
            <span className="input-model-tag">claude-3 · finance</span>
          </div>
        </div>

      </main>
    </>
  );
}
