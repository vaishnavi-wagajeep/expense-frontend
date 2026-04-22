import { useState } from "react";
import axios from "axios";
import "./AddExpense.css";

function AddExpense() {
  const [form, setForm] = useState({
    category: "",
    amount: "",
    date: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.amount || !form.date) {
      setError("Amount and Date are required");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first");
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message || "Expense added!");

      setForm({
        category: "",
        amount: "",
        date: "",
        notes: "",
      });
    } catch (err) {
      setError(err?.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      
      {/* LEFT SIDE */}
      <div className="left">
        <h1>Track Your Expenses 💸</h1>
        <p>
          Smart tracking with AI insights.  
          Stay in control of your money.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="right">
        <div className="expense-card">
          <h2>Add Expense</h2>

          {error && <p className="error-text">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option value="">Auto Detect Category</option>
                <option value="Food">🍔 Food</option>
                <option value="Transport">🚕 Transport</option>
                <option value="Shopping">🛍 Shopping</option>
                <option value="Bills">💡 Bills</option>
                <option value="Rent">🏠 Rent</option>
                <option value="Entertainment">🎮 Entertainment</option>
              </select>
            </div>

            <div className="input-group">
              <input
                type="number"
                name="amount"
                placeholder="💰 Amount"
                value={form.amount}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <input
                type="text"
                name="notes"
                placeholder="📝 Notes"
                value={form.notes}
                onChange={handleChange}
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Expense"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddExpense;