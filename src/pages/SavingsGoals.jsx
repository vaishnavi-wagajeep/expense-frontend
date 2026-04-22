import { useEffect, useState } from 'react';
import axios from 'axios';

function SavingsGoals() {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({
    title: '',
    targetAmount: '',
    deadline: ''
  });

  const token = localStorage.getItem('token');

  // FETCH GOALS
  useEffect(() => {
    const fetchGoals = async () => {
      const res = await axios.get('http://localhost:5000/goals', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setGoals(res.data);
    };

    fetchGoals();
  }, []);

  // ADD GOAL
  const addGoal = async () => {
    await axios.post('http://localhost:5000/goals/add', form, {
      headers: { Authorization: `Bearer ${token}` }
    });

    window.location.reload();
  };

  // UPDATE STATUS
  const markComplete = async (id) => {
    await axios.put(`http://localhost:5000/goals/${id}`,
      { status: "completed" },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    window.location.reload();
  };

  // DELETE
  const deleteGoal = async (id) => {
    await axios.delete(`http://localhost:5000/goals/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    window.location.reload();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Savings Goals 🎯</h2>

      {/* FORM */}
      <div>
        <input
          placeholder="Title"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          type="number"
          placeholder="Target Amount"
          onChange={(e) => setForm({ ...form, targetAmount: e.target.value })}
        />
        <input
          type="date"
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
        />

        <button onClick={addGoal}>Add Goal</button>
      </div>

      {/* LIST */}
      <div>
        {goals.map((g) => (
          <div key={g.GoalID} style={{ marginTop: "10px" }}>
            <h3>{g.Title}</h3>
            <p>Target: ₹{g.TargetAmount}</p>
            <p>Status: {g.Status}</p>

            <button onClick={() => markComplete(g.GoalID)}>
              Mark Complete
            </button>

            <button onClick={() => deleteGoal(g.GoalID)}>
              Delete
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}

export default SavingsGoals;