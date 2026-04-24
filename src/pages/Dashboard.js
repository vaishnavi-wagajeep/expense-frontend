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

const categoryColors = {
  Food:          "#4ade80",
  Transport:     "#38bdf8",
  Shopping:      "#facc15",
  Bills:         "#f87171",
  Entertainment: "#a78bfa",
  Rent:          "#22d3ee",
  Other:         "#64748b"
};

const categoryIcons = {
  Food:          "🍔",
  Transport:     "🚕",
  Shopping:      "🛍",
  Bills:         "💡",
  Entertainment: "🎮",
  Rent:          "🏠",
  Other:         "📦"
};

const PIE_COLORS = [
  "#8b5cf6", "#22d3ee", "#4ade80",
  "#facc15", "#f87171", "#38bdf8", "#a78bfa"
];

const MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

function Dashboard() {
  const [expenses,      setExpenses]      = useState([]);
  const [insights,      setInsights]      = useState([]);
  const [showAlert,     setShowAlert]     = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear,  setSelectedYear]  = useState(new Date().getFullYear());
  const [budget, setBudget] = useState(0);

  // ── FETCH ──────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      try {
        const [expRes, insRes, profileRes] = await Promise.all([
          axios.get(
            `http://localhost:5000/expenses?month=${selectedMonth}&year=${selectedYear}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.get(
            `http://localhost:5000/insights`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.get(
            `http://localhost:5000/user/profile`,
            { headers: { Authorization: `Bearer ${token}` } }
          )
        ]);
        setExpenses(expRes.data);
        setInsights(insRes.data.insights || []);
        setBudget(Number(profileRes.data.Budget) || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedMonth, selectedYear]);

  // ── DERIVED DATA ───────────────────────────────────────
  const total = expenses.reduce((sum, e) => sum + (Number(e.Amount) || 0), 0);

  const categoryData = {};
  expenses.forEach((e) => {
    const cat = e.Category || "Other";
    categoryData[cat] = (categoryData[cat] || 0) + (Number(e.Amount) || 0);
  });

  const chartLabels = Object.keys(categoryData);
  const chartValues = Object.values(categoryData);

  const percentage = budget > 0 ? (total / budget) * 100 : 0;

  useEffect(() => {
    if (percentage >= 80 && !showAlert) setShowAlert(true);
  }, [percentage]);

  const progressColor = () => {
    if (percentage < 50) return "#4ade80";
    if (percentage < 80) return "#facc15";
    return "#f87171";
  };

  // ── RENDER ─────────────────────────────────────────────
  return (
    <div className="dashboard-layout">

      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <h2 className="logo">
          <span>ExpenseX</span>
        </h2>
        <nav>
          <a href="/dashboard" className="active">📊 Dashboard</a>
          <a href="/add-expense">➕ Add Expense</a>
        </nav>
      </aside>

      <main className="dashboard-content">

        {/* ── ALERT ── */}
        {showAlert && (
          <div className="alert-popup">
            <div className="alert-box">
              <h3>{percentage >= 100 ? "🚨 Budget Exceeded!" : "⚠️ Warning"}</h3>
              <p>
                {percentage >= 100
                  ? "You have crossed your budget limit!"
                  : "You've used more than 80% of your budget."}
              </p>
              <button onClick={() => setShowAlert(false)}>Got it</button>
            </div>
          </div>
        )}

        {/* ── HEADER ── */}
        <div className="dashboard-header">
          <h2 className="gradient-text">Dashboard Overview</h2>
          <p className="subtext">Track your spending insights</p>

          <div className="month-selector">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {MONTHS.map((m, i) => (
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

        {loading ? (
          <div className="empty-state">Loading…</div>
        ) : (
          <>
            {/* ── STAT CARDS ── */}
            <p className="section-label">Overview</p>
            <div className="stats-grid">
              <div className="stat-card">
                <h4>Total Expense</h4>
                <p>₹{total.toLocaleString('en-IN')}</p>
              </div>
              <div className="stat-card">
                <h4>Total Entries</h4>
                <p>{expenses.length}</p>
              </div>
              <div className="stat-card">
                <h4>Avg / Day</h4>
                <p>₹{new Date(selectedYear, selectedMonth, 0).getDate() > 0
                  ? Math.round(total / new Date(selectedYear, selectedMonth, 0).getDate()).toLocaleString('en-IN')
                  : 0}
                </p>
              </div>
              <div className="stat-card">
                <h4>Remaining Budget</h4>
                <p>₹{Math.max(budget - total, 0).toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* ── INSIGHTS ── */}
            <p className="section-label">Smart Insights</p>
            <div className="insights-card">
              <h3>💡 Insights</h3>
              {insights.length === 0 ? (
                <p className="empty-state">No insights available</p>
              ) : (
                insights.map((ins, i) => (
                  <div key={i} className="insight-item">{ins}</div>
                ))
              )}
            </div>

            {/* ── BUDGET ── */}
            <p className="section-label">Budget</p>
            <div className="budget-card">
              <h3>Monthly Budget</h3>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="budget-input"
              />
              <div className="budget-meta">
                <span className="budget-used">
                  Used ₹{total.toLocaleString('en-IN')} of ₹{budget.toLocaleString('en-IN')}
                </span>
                <span
                  className="budget-pct"
                  style={{ color: progressColor() }}
                >
                  {percentage.toFixed(1)}%
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.min(percentage, 100)}%`,
                    background: progressColor()
                  }}
                />
              </div>
            </div>

            {/* ── GRID ── */}
            <p className="section-label">Breakdown</p>
            <div className="dashboard-grid">

              {/* PIE CHART */}
              <div className="chart-card">
                <h3>Expense Distribution</h3>
                {chartLabels.length > 0 ? (
                  <div className="chart-wrapper">
                    <Pie
                      data={{
                        labels: chartLabels,
                        datasets: [{
                          data: chartValues,
                          backgroundColor: PIE_COLORS,
                          borderWidth: 0,
                          hoverOffset: 8
                        }]
                      }}
                      options={{
                        plugins: {
                          legend: {
                            position: 'bottom',
                            labels: {
                              color: '#94a3b8',
                              font: { size: 12, family: 'DM Sans' },
                              padding: 14,
                              boxWidth: 10,
                              boxHeight: 10,
                              borderRadius: 3
                            }
                          },
                          tooltip: {
                            callbacks: {
                              label: (ctx) =>
                                ` ₹${Number(ctx.raw).toLocaleString('en-IN')} (${((ctx.raw / total) * 100).toFixed(1)}%)`
                            }
                          }
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="empty-state">No data for selected month</div>
                )}
              </div>

              {/* RECENT EXPENSES */}
              <div className="chart-card">
                <h3>Recent Expenses</h3>
                {expenses.length === 0 ? (
                  <div className="empty-state">No expenses recorded</div>
                ) : (
                  expenses.slice(0, 6).map((e, i) => (
                    <div key={i} className="expense-row">
                      <span
                        className="category-badge"
                        style={{ backgroundColor: categoryColors[e.Category] || "#64748b" }}
                      >
                        {categoryIcons[e.Category] || "📦"} {e.Category || "Other"}
                      </span>
                      <strong>₹{Number(e.Amount).toLocaleString('en-IN')}</strong>
                    </div>
                  ))
                )}
              </div>

            </div>
          </>
        )}

      </main>
    </div>
  );
}

export default Dashboard;
