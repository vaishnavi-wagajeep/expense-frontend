import { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  // ✅ MONTH + YEAR SELECTOR
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // ✅ BUDGET
  const [budget, setBudget] = useState(() => {
    return localStorage.getItem("budget")
      ? parseFloat(localStorage.getItem("budget"))
      : 10000;
  });

  // ✅ FETCH EXPENSES BASED ON MONTH
  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem('token');

      try {
        const res = await axios.get(
          `http://localhost:5000/expenses?month=${selectedMonth}&year=${selectedYear}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setExpenses(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchExpenses();
  }, [selectedMonth, selectedYear]);

  // ✅ SAVE BUDGET
  useEffect(() => {
    localStorage.setItem("budget", budget);
  }, [budget]);

  // ✅ TOTAL
  const total = expenses.reduce(
    (sum, exp) => sum + (parseFloat(exp.Amount) || 0),
    0
  );

  // ✅ CATEGORY GROUPING
  const categoryData = {};
  expenses.forEach((exp) => {
    const category = exp.Category;
    const amount = parseFloat(exp.Amount) || 0;

    if (!categoryData[category]) {
      categoryData[category] = 0;
    }

    categoryData[category] += amount;
  });

  // ✅ BUDGET LOGIC
  const percentage = budget > 0 ? (total / budget) * 100 : 0;
  useEffect(() => {
  if (percentage >= 80) {
    setShowAlert(true);
  }
}, [percentage]);

  const getColor = () => {
    if (percentage < 50) return "#22c55e";
    if (percentage < 80) return "#facc15";
    return "#ef4444";
  };

  return (
    <div className="dashboard-layout">

      <aside className="sidebar">
        <h2 className="logo">💰 ExpenseX</h2>

        <nav>
          <a href="/dashboard">Dashboard</a>
          <a href="/add-expense">Add Expense</a>
        </nav>
      </aside>

      <main className="dashboard-content">
        {showAlert && (
  <div className="alert-popup">
    <div className="alert-box">

      <h3>
        {percentage >= 100 ? "🚨 Budget Exceeded!" : "⚠️ Warning"}
      </h3>

      <p>
        {percentage >= 100
          ? "You have crossed your budget limit!"
          : "You have used more than 80% of your budget."}
      </p>

      <button onClick={() => setShowAlert(false)}>
        OK
      </button>

    </div>
  </div>
)}

        {/* HEADER */}
        <div className="dashboard-header">
          <h2 className="gradient-text">Dashboard Overview</h2>
          <p className="subtext">Track your spending insights</p>

          {/* ✅ MONTH SELECTOR */}
          <div className="month-selector">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {[
                "Jan","Feb","Mar","Apr","May","Jun",
                "Jul","Aug","Sep","Oct","Nov","Dec"
              ].map((m, i) => (
                <option key={i} value={i}>{m}</option>
              ))}
            </select>

            <input
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            />
          </div>
        </div>

        {/* STATS */}
        <div className="stats-grid">
          <div className="stat-card glass">
            <h4>Total Expense</h4>
            <p>₹{total}</p>
          </div>

          <div className="stat-card glass">
            <h4>Total Entries</h4>
            <p>{expenses.length}</p>
          </div>
        </div>

        {/* BUDGET */}
        <div className="budget-card">
          <h3>Monthly Budget</h3>

          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="budget-input"
          />

          <p className="budget-used">
            Used: ₹{total} ({percentage.toFixed(1)}%)
          </p>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${Math.min(percentage, 100)}%`,
                background: getColor()
              }}
            ></div>
          </div>

          {percentage > 100 && (
            <p className="warning">⚠️ Budget exceeded!</p>
          )}
        </div>

        {/* GRID */}
        <div className="dashboard-grid">

          {/* PIE CHART */}
          <div className="chart-card glass">
            <h3>Expense Distribution</h3>

            {expenses.length > 0 ? (
              <div className="chart-wrapper">
                <Pie
                  data={{
                    labels: Object.keys(categoryData),
                    datasets: [
                      {
                        data: Object.values(categoryData),
                        backgroundColor: [
                          "#7c3aed",
                          "#22d3ee",
                          "#4ade80",
                          "#facc15",
                          "#fb7185",
                          "#6366f1"
                        ],
                        borderWidth: 0
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "60%",
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: {
                          color: "white"
                        }
                      }
                    }
                  }}
                />
              </div>
            ) : (
              <div className="empty-state">
                <h4>No Data for Selected Month</h4>
              </div>
            )}
          </div>

          {/* RECENT */}
          <div className="chart-card glass">
            <h3>Recent Expenses</h3>

            {expenses.length === 0 ? (
              <div className="empty-state">No expenses found</div>
            ) : (
              expenses.slice(0, 5).map((e, i) => (
                <div key={i} className="expense-row">
                  <span>{e.Category}</span>
                  <strong>₹{e.Amount}</strong>
                </div>
              ))
            )}
          </div>

        </div>

      </main>
    </div>
  );
}

export default Dashboard;