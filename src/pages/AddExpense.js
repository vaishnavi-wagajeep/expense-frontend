import { useState } from "react";
import axios from "axios";
import "./AddExpense.css";

const CATEGORIES = [
  { value: "Food",          label: "Food",          icon: "🍔" },
  { value: "Transport",     label: "Transport",     icon: "🚕" },
  { value: "Shopping",      label: "Shopping",      icon: "🛍" },
  { value: "Bills",         label: "Bills",         icon: "💡" },
  { value: "Rent",          label: "Rent",          icon: "🏠" },
  { value: "Entertainment", label: "Entertainment", icon: "🎮" },
];

const FEATURES = [
  { icon: "🤖", color: "icon-purple", text: "AI auto-detects category from your notes" },
  { icon: "📊", color: "icon-cyan",   text: "Real-time insights on your spending"      },
  { icon: "🔒", color: "icon-green",  text: "Your data is private and secure"          },
];

function AddExpense() {
  const [form,    setForm]    = useState({ category: "", amount: "", date: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error)   setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    if (!form.amount || !form.date) {
      setError("Amount and Date are required.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) { setError("Please log in first."); return; }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/expenses/add",
        { Category: form.category || undefined, Amount: form.amount, Date: form.date, Notes: form.notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(res.data.message || "Expense added successfully!");
      setForm({ category: "", amount: "", date: "", notes: "" });
    } catch (err) {
      setError(err?.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const selectedCatIcon = CATEGORIES.find(c => c.value === form.category)?.icon || "📂";

  return (
    <div className="expense-wrapper">

      {/* ══ LEFT HERO ══ */}
      <div className="expense-left">
        <div className="left-content">

          <div className="left-eyebrow">
            <span className="left-eyebrow-dot"></span>
            AI-Powered Tracking
          </div>

          <h1>Track Your<br /><em>Expenses</em></h1>

          <p>
            Smart tracking with AI insights.<br />
            Stay in control of your money.
          </p>

          {/* mini stats */}
          <div className="left-stats">
            <div className="left-stat">
              <div className="left-stat-value">₹0</div>
              <div className="left-stat-label">This Month</div>
            </div>
            <div className="left-stat">
              <div className="left-stat-value">0</div>
              <div className="left-stat-label">Entries</div>
            </div>
            <div className="left-stat">
              <div className="left-stat-value">—</div>
              <div className="left-stat-label">Top Category</div>
            </div>
          </div>

          <div className="left-features">
            {FEATURES.map((f, i) => (
              <div className="left-feature" key={i}>
                <div className={`left-feature-icon ${f.color}`}>{f.icon}</div>
                {f.text}
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ══ RIGHT FORM ══ */}
      <div className="expense-right">
        <div className="expense-card">

          <div className="card-header">
            <h2>Add Expense</h2>
            <p>Fill in the details below to log a new entry.</p>
          </div>

          {error   && <div className="error-banner">⚠ {error}</div>}
          {success && <div className="success-toast">✓ {success}</div>}

          <form onSubmit={handleSubmit} noValidate>

            <div className="field">
              <label className="field-label">Category</label>
              <div className="field-wrap">
                <span className="field-icon">{selectedCatIcon}</span>
                <select name="category" value={form.category} onChange={handleChange}>
                  <option value="">Auto-detect from notes</option>
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
                  ))}
                </select>
                <span className="select-arrow">▾</span>
              </div>
            </div>

            <div className="field">
              <label className="field-label">Amount (₹)</label>
              <div className="field-wrap">
                <span className="field-icon">₹</span>
                <input
                  type="number" name="amount" placeholder="0.00"
                  value={form.amount} onChange={handleChange}
                  min="0" step="0.01"
                />
              </div>
            </div>

            <div className="field">
              <label className="field-label">Date</label>
              <div className="field-wrap">
                <span className="field-icon">📅</span>
                <input type="date" name="date" value={form.date} onChange={handleChange} />
              </div>
            </div>

            <div className="field-divider" />

            <div className="field">
              <label className="field-label">
                Notes <span className="optional">(optional)</span>
              </label>
              <div className="field-wrap no-icon">
                <textarea
                  name="notes"
                  placeholder="e.g. Lunch with team, electricity bill…"
                  value={form.notes}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="expense-btn" disabled={loading}>
              {loading ? "Adding…" : "Add Expense →"}
            </button>

          </form>
        </div>
      </div>

    </div>
  );
}

export default AddExpense;
