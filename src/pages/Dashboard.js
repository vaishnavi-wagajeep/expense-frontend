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

// ✅ CATEGORY COLORS + ICONS
const categoryColors = {
Food: "#22c55e",
Transport: "#3b82f6",
Shopping: "#f59e0b",
Bills: "#ef4444",
Entertainment: "#8b5cf6",
Rent: "#06b6d4",
Other: "#6b7280"
};

const categoryIcons = {
Food: "🍔",
Transport: "🚕",
Shopping: "🛍",
Bills: "💡",
Entertainment: "🎮",
Rent: "🏠",
Other: "📦"
};

function Dashboard() {
const [expenses, setExpenses] = useState([]);
const [insights, setInsights] = useState([]);
const [showAlert, setShowAlert] = useState(false);
const [loading, setLoading] = useState(false);

const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

const [budget, setBudget] = useState(10000);

// ---------------- FETCH EXPENSES + INSIGHTS ----------------
useEffect(() => {
const fetchData = async () => {
setLoading(true);
const token = localStorage.getItem('token');


  try {
    // ✅ EXPENSES
    const expRes = await axios.get(
      `http://localhost:5000/expenses?month=${selectedMonth}&year=${selectedYear}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    setExpenses(expRes.data);

    // ✅ INSIGHTS
    const insRes = await axios.get(
      `http://localhost:5000/insights`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    setInsights(insRes.data.insights || []);

  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};

fetchData();


}, [selectedMonth, selectedYear]);

// ---------------- TOTAL ----------------
const total = expenses.reduce(
(sum, exp) => sum + (Number(exp.Amount) || 0),
0
);

// ---------------- CATEGORY GROUPING ----------------
const categoryData = {};
expenses.forEach((exp) => {
const category = exp.Category || "Other";
const amount = Number(exp.Amount) || 0;
categoryData[category] = (categoryData[category] || 0) + amount;
});

const chartLabels = Object.keys(categoryData);
const chartValues = Object.values(categoryData);

// ---------------- BUDGET ----------------
const percentage = budget > 0 ? (total / budget) * 100 : 0;

useEffect(() => {
if (percentage >= 80 && !showAlert) {
setShowAlert(true);
}
}, [percentage]);

const getColor = () => {
if (percentage < 50) return "#22c55e";
if (percentage < 80) return "#facc15";
return "#ef4444";
};

return ( <div className="dashboard-layout">


  {/* SIDEBAR */}
  <aside className="sidebar">
    <h2 className="logo">💰 ExpenseX</h2>
    <nav>
      <a href="/dashboard">Dashboard</a>
      <a href="/add-expense">Add Expense</a>
    </nav>
  </aside>

  <main className="dashboard-content">

    {/* ALERT */}
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
          <button onClick={() => setShowAlert(false)}>OK</button>
        </div>
      </div>
    )}

    {/* HEADER */}
    <div className="dashboard-header">
      <h2 className="gradient-text">Dashboard Overview</h2>
      <p className="subtext">Track your spending insights</p>

      <div className="month-selector">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
        >
          {[
            "Jan","Feb","Mar","Apr","May","Jun",
            "Jul","Aug","Sep","Oct","Nov","Dec"
          ].map((m, i) => (
            <option key={i} value={i + 1}>{m}</option>
          ))}
        </select>

        <input
          type="number"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        />
      </div>
    </div>

    {/* LOADING */}
    {loading ? (
      <div className="empty-state">Loading...</div>
    ) : (
      <>
        {/* 🔥 INSIGHTS */}
        <div className="insights-card">
          <h3>💡 Smart Insights</h3>

          {insights.length === 0 ? (
            <p>No insights available</p>
          ) : (
            insights.map((ins, i) => (
              <div key={i} className="insight-item">
                {ins}
              </div>
            ))
          )}
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
            />
          </div>
        </div>

        {/* GRID */}
        <div className="dashboard-grid">

          {/* PIE CHART */}
          <div className="chart-card glass">
            <h3>Expense Distribution</h3>

            {chartLabels.length > 0 ? (
              <div className="chart-wrapper">
                <Pie
                  data={{
                    labels: chartLabels,
                    datasets: [{
                      data: chartValues,
                      backgroundColor: [
                        "#7c3aed","#22d3ee","#4ade80",
                        "#facc15","#fb7185","#6366f1"
                      ],
                      borderWidth: 0
                    }]
                  }}
                />
              </div>
            ) : (
              <div className="empty-state">
                No Data for Selected Month
              </div>
            )}
          </div>

          {/* RECENT */}
          <div className="chart-card glass">
            <h3>Recent Expenses</h3>

            {expenses.slice(0, 5).map((e, i) => (
              <div key={i} className="expense-row">
                <span
                  className="category-badge"
                  style={{
                    backgroundColor: categoryColors[e.Category] || "#6b7280"
                  }}
                >
                  {categoryIcons[e.Category] || "📦"} {e.Category || "Other"}
                </span>
                <strong>₹{e.Amount}</strong>
              </div>
            ))}
          </div>

        </div>
      </>
    )}

  </main>
</div>


);
}

export default Dashboard;
