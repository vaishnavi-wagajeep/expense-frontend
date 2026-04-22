import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./AIChat.css";

function AIChat() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "👋 Hi! Ask me about your expenses" }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ---------------- SEND MESSAGE ----------------
  const sendMessage = async (msg) => {
    const messageToSend = msg || input;
    if (!messageToSend.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: messageToSend }]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/ai/chat",
        { message: messageToSend },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setMessages((prev) => [
        ...prev,
        { role: "bot", text: res.data.reply }
      ]);

    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Error getting response" }
      ]);
    }

    setLoading(false);
  };

  // ---------------- QUICK SUGGESTIONS ----------------
  const suggestions = [
    "Where do I spend most?",
    "How can I save money?",
    "Show total expenses",
    "What is my average spending?",
    "Top category analysis"
  ];

  return (
    <div className="ai-page">

      {/* HEADER */}
      <div className="ai-header">
        <h2>💬 AI Finance Assistant</h2>
        <p>Smart insights about your expenses</p>
      </div>

      {/* SUGGESTION BUTTONS */}
      <div className="suggestion-box">
        {suggestions.map((s, i) => (
          <button
            key={i}
            className="suggestion-btn"
            onClick={() => sendMessage(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {/* CHAT BOX */}
      <div className="chat-box-premium">

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`bubble ${msg.role === "user" ? "user" : "bot"}`}
          >
            {msg.text}
          </div>
        ))}

        {loading && <div className="bubble bot">typing...</div>}

        <div ref={chatEndRef} />
      </div>

      {/* INPUT */}
      <div className="chat-input-premium">

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button onClick={() => sendMessage()}>
          Send 🚀
        </button>

      </div>

    </div>
  );
}

export default AIChat;