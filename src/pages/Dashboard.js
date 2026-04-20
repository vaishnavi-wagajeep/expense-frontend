import { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import {
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
} from 'chart.js';

import { Bar, Line } from 'react-chartjs-2';


import './Dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
);


function Dashboard() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem('token');

      try {
        const res = await axios.get('http://localhost:5000/expenses', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setExpenses(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchExpenses();
  }, []);

  // 🔢 Total Expense
  const total = expenses.reduce(
    (sum, exp) => sum + parseFloat(exp.Amount || 0),
    0
  );

  // 📊 Group by Category
  const categoryData = {};
  expenses.forEach((exp) => {
    if (!exp.Category) return;

    if (!categoryData[exp.Category]) {
      categoryData[exp.Category] = 0;
    }
    categoryData[exp.Category] += parseFloat(exp.Amount);
  });

  const pieData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
      },
    ],
  };

  return (
    <div className="dashboard-wrapper">

      {/* HEADER */}
      <div className="dashboard-header">
        <h2>Dashboard</h2>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
        >
          Logout
        </button>
      </div>

      {/* STATS */}
      <div className="stats-grid">

        <div className="stat-card">
          <h4>Total Expense</h4>
          <p>₹{total}</p>
        </div>

        <div className="stat-card">
          <h4>Categories</h4>
          <p>{Object.keys(categoryData).length}</p>
        </div>

        <div className="stat-card">
          <h4>Total Entries</h4>
          <p>{expenses.length}</p>
        </div>

      </div>

      {/* CHART */}
      <div className="chart-card">
        <h3>Expense Distribution</h3>

        {expenses.length > 0 ? (
          <Pie data={pieData} />
        ) : (
          <p>No data available</p>
        )}
      </div>

      {/* LIST */}
      <div className="list-card">
        <h3>Recent Expenses</h3>

        {expenses.length === 0 ? (
          <p>No expenses found</p>
        ) : (
          expenses.map((exp) => (
            <div key={exp.ExpenseID} className="expense-item">
              <div>
                <strong>{exp.Category}</strong>
                <p>{new Date(exp.Date).toLocaleDateString()}</p>
              </div>

              <span>₹{exp.Amount}</span>
            </div>
          ))
        )}

        {/* MONTHLY BAR CHART */}
<div className="chart-card">
  <h3>Monthly Expenses</h3>
  <Bar data={barData} />
</div>

{/* YEARLY LINE CHART */}
<div className="chart-card">
  <h3>Yearly Trend</h3>
  <Line data={lineData} />
</div>

      </div>

    </div>
  );
}

// 📊 Monthly Data
const monthlyData = new Array(12).fill(0);

expenses.forEach((exp) => {
  const date = new Date(exp.Date);
  const month = date.getMonth(); // 0-11
  monthlyData[month] += parseFloat(exp.Amount);
});

const barData = {
  labels: [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ],
  datasets: [
    {
      label: "Monthly Expenses",
      data: monthlyData,
    },
  ],
};

// 📈 Yearly Data
const yearlyMap = {};

expenses.forEach((exp) => {
  const year = new Date(exp.Date).getFullYear();

  if (!yearlyMap[year]) yearlyMap[year] = 0;

  yearlyMap[year] += parseFloat(exp.Amount);
});

const lineData = {
  labels: Object.keys(yearlyMap),
  datasets: [
    {
      label: "Yearly Expenses",
      data: Object.values(yearlyMap),
    },
  ],
};


export default Dashboard;
