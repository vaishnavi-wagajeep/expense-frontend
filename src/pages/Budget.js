import { useState, useEffect } from "react";
import axios from "axios";
import "./Budget.css";

function Budget() {
  const [amount, setAmount] = useState("");
  const [budget, setBudget] = useState(null);
  const [spent, setSpent] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchBudget = async () => {
    const res = await axios.get(`http://localhost:5000/budget/get-budget/${user.id}`);
    setBudget(res.data);
  };

  const handleSetBudget = async () => {
    const date = new Date();

    await axios.post("http://localhost:5000/budget/set-budget", {
      userId: user.id,
      amount,
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    });

    fetchBudget();
  };

  useEffect(() => {
    fetchBudget();
  }, []);

  const remaining = budget ? budget.Amount - spent : 0;
  const percent = budget ? (spent / budget.Amount) * 100 : 0;

  return (
    <div className="budget-wrapper">
      <div className="budget-card">

        <h2>Monthly Budget</h2>

        <input
          type="number"
          placeholder="Enter budget"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button onClick={handleSetBudget}>Set Budget</button>

        {budget && (
          <>
            <div className="budget-info">
              <p>Total Budget: ₹{budget.Amount}</p>
              <p>Spent: ₹{spent}</p>
              <p>Remaining: ₹{remaining}</p>
            </div>

            <div className="progress-bar">
              <div
                className="progress"
                style={{ width: `${percent}%` }}
              ></div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default Budget;
