import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import Signup from './pages/Signup';
import Login from './pages/Login';
import AddExpense from './pages/AddExpense';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);


function Home() {
  return <h2>Home Page</h2>;
}

// ✅ UPDATED DASHBOARD
function Dashboard() {
  const [expenses, setExpenses] = useState([]);

  // Group expenses by category
const categoryData = {};

expenses.forEach((exp) => {
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

  return (
    <div>
      <h2>Dashboard</h2>

      <h3>Your Expenses:</h3>
      <h3>Expense Distribution</h3>

{expenses.length > 0 && <Pie data={pieData} />}


      {expenses.length === 0 ? (
        <p>No expenses found</p>
      ) : (
        expenses.map((exp) => (
          <div key={exp.ExpenseID}>
            <p>
             {exp.Category} - ₹{exp.Amount} - {new Date(exp.Date).toLocaleDateString()}

            </p>
          </div>
        ))
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-expense" element={<AddExpense />} />
      </Routes>
    </Router>
  );
}

export default App;
