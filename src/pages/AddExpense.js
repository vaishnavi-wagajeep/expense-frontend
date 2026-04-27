import { useState, useEffect } from "react";
import axios from "axios";
import "./AddExpense.css";

const CATEGORIES = [
  { value: "Food", label: "Food", icon: "🍔" },
  { value: "Transport", label: "Transport", icon: "🚕" },
  { value: "Shopping", label: "Shopping", icon: "🛍" },
  { value: "Bills", label: "Bills", icon: "💡" },
  { value: "Rent", label: "Rent", icon: "🏠" },
  { value: "Entertainment", label: "Entertainment", icon: "🎮" },
];

const FEATURES = [
  { icon: "🤖", color: "icon-purple", text: "AI auto-detects category from your notes" },
  { icon: "📊", color: "icon-cyan", text: "Real-time insights on your spending" },
  { icon: "🔒", color: "icon-green", text: "Your data is private and secure" },
];

function AddExpense() {
  const [form, setForm] = useState({
    category: "",
    amount: "",
    date: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [monthTotal, setMonthTotal] = useState(0);
  const [entryCount, setEntryCount] = useState(0);
  const [topCategory, setTopCategory] = useState("—");

  const token = localStorage.getItem("token");

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data || [];

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      let total = 0;
      let count = 0;
      let categoryMap = {};

      data.forEach((e) => {
        // ✅ SAFE DATE FIX (timezone-proof)
        if (!e.Date) return;

        const d = new Date(`${e.Date}T00:00:00`);

        // extra safety check
        if (isNaN(d)) return;

        if (
          d.getMonth() === currentMonth &&
          d.getFullYear() === currentYear
        ) {
          total += Number(e.Amount);
          count++;

          const cat = e.Category || "Other";
          categoryMap[cat] = (categoryMap[cat] || 0) + 1;
        }
      });

      let top = "—";
      let max = 0;

      Object.entries(categoryMap).forEach(([cat, val]) => {
        if (val > max) {
          max = val;
          top = cat;
        }
      });

      setMonthTotal(total);
      setEntryCount(count);
      setTopCategory(top);
    } catch (err) {
      console.error("Stats error:", err);
    }
  };

  useEffect(() => {
    if (token) fetchStats();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.amount || !form.date) {
      setError("Amount and Date are required.");
      return;
    }

    if (!token) {
      setError("Please log in first.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/expenses/add",
        {
          Category: form.category || undefined,
          Amount: form.amount,
          Date: form.date,
          Notes: form.notes,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess(res.data.message || "Expense added!");

      setForm({
        category: "",
        amount: "",
        date: "",
        notes: "",
      });

      fetchStats();
    } catch (err) {
      setError(err?.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const selectedCatIcon =
    CATEGORIES.find((c) => c.value === form.category)?.icon || "📂";

  return (
    <div className="expense-wrapper">

      {/* LEFT */}
      <div className="expense-left">
        <div className="left-content">

          <div className="left-eyebrow">
            <span className="left-eyebrow-dot"></span>
            AI-Powered Tracking
          </div>

          <h1>
            Track Your <br />
            <em>Expenses</em>
          </h1>

          <p>
            Smart tracking with AI insights.
            <br />
            Stay in control of your money.
          </p>

          <div className="left-stats">
            <div className="left-stat">
              <div className="left-stat-value">₹{monthTotal.toFixed(0)}</div>
              <div className="left-stat-label">This Month</div>
            </div>

            <div className="left-stat">
              <div className="left-stat-value">{entryCount}</div>
              <div className="left-stat-label">Entries</div>
            </div>

            <div className="left-stat">
              <div className="left-stat-value">{topCategory}</div>
              <div className="left-stat-label">Top Category</div>
            </div>
          </div>

          <div className="left-features">
            {FEATURES.map((f, i) => (
              <div className="left-feature" key={i}>
                <div className={`left-feature-icon ${f.color}`}>
                  {f.icon}
                </div>
                {f.text}
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* RIGHT */}
      <div className="expense-right">
        <div className="expense-card">

          <div className="card-header">
            <h2>Add Expense</h2>
            <p>Fill in the details below.</p>
          </div>

          {error && <div className="error-banner">⚠ {error}</div>}

          <form onSubmit={handleSubmit}>

            <div className="field floating">
              <div className="field-wrap">
                <span className="field-icon">{selectedCatIcon}</span>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="expense-select"
                  style={{
                    backgroundColor: "#0f172a",
                    color: "white",
                    WebkitTextFillColor: "white",
                  }}
                >
                  <option value="" disabled>
                    Select Category
                  </option>

                  {CATEGORIES.map((c) => (
                    <option
                      key={c.value}
                      value={c.value}
                      style={{ backgroundColor: "#0f172a", color: "white" }}
                    >
                      {c.icon} {c.label}
                    </option>
                  ))}
                </select>

                <label>Category</label>
              </div>
            </div>

            <div className="field floating">
              <div className="field-wrap">
                <span className="field-icon">₹</span>
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  required
                />
                <label>Amount</label>
              </div>
            </div>

            <div className="field floating">
              <div className="field-wrap">
                <span className="field-icon">📅</span>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
                <label>Date</label>
              </div>
            </div>

            <div className="field-divider" />

            <div className="field floating">
              <div className="field-wrap no-icon">
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                />
                <label>Notes</label>
              </div>
            </div>

            <button className="expense-btn" disabled={loading}>
              {loading ? "Adding…" : "Add Expense →"}
            </button>

          </form>
        </div>
      </div>

      {success && <div className="toast success">✓ {success}</div>}
    </div>
  );
}

export default AddExpense;
