import { useState } from 'react';
import axios from 'axios';
import './AddExpense.css';

function AddExpense() {
  const [form, setForm] = useState({
    category: '',
    amount: '',
    date: '',
    notes: ''
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.category || !form.amount || !form.date) {
      alert("Please fill all required fields");
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/expenses/add',   // ✅ FIXED ROUTE
        {
          Category: form.category,          // ✅ FIXED FIELD NAMES
          Amount: form.amount,
          Date: form.date,
          Notes: form.notes
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert(res.data.message || "Expense added successfully!");

      // ✅ Reset form
      setForm({
        category: '',
        amount: '',
        date: '',
        notes: ''
      });

    } catch (err) {
      console.log("FULL ERROR:", err);
      console.log("BACKEND ERROR:", err.response?.data);

      alert(err?.response?.data?.error || "Error adding expense");
    }
  };

  return (
    <div className="expense-wrapper">
      <div className="expense-card">
        <h2>Add Expense</h2>

        <form onSubmit={handleSubmit}>

          {/* CATEGORY */}
          <div className="input-group">
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="dropdown"
            >
              <option value="">Select Category</option>
              <option value="Food">🍔 Food</option>
              <option value="Travel">🚕 Travel</option>
              <option value="Shopping">🛍 Shopping</option>
              <option value="Bills">💡 Bills</option>
              <option value="Rent">🏠 Rent</option>
              <option value="Entertainment">🎮 Entertainment</option>
            </select>
          </div>

          {/* AMOUNT */}
          <div className="input-group">
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={form.amount}
              onChange={handleChange}
            />
          </div>

          {/* DATE */}
          <div className="input-group">
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
          </div>

          {/* NOTES */}
          <div className="input-group">
            <input
              type="text"
              name="notes"
              placeholder="Notes"
              value={form.notes}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="expense-btn">
            Add Expense
          </button>

        </form>
      </div>
    </div>
  );
}

export default AddExpense;