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

    try {
      const res = await axios.post(
        'http://localhost:5000/expenses/add',
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert(res.data.message);

    } catch (err) {
      console.log("FRONTEND ERROR:", err.response?.data || err);
      alert(err?.response?.data?.error || "Error adding expense");
    }
  };

  return (
    <div className="expense-wrapper">
      <div className="expense-card">
        <h2>Add Expense</h2>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <input
              type="text"
              name="category"
              placeholder="Category"
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <input
              type="date"
              name="date"
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <input
              type="text"
              name="notes"
              placeholder="Notes"
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
