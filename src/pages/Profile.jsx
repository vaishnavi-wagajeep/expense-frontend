import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState({ Name: "", Email: "", Budget: "" });
  const [spent, setSpent] = useState(0);
  const [status, setStatus] = useState("idle");
  const [touched, setTouched] = useState(false);

  const token = localStorage.getItem("token");

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.log("Profile fetch error:", err);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  /* ================= FETCH SPENT ================= */
  useEffect(() => {
    const fetchSpent = async () => {
      try {
        const res = await axios.get("http://localhost:5000/expenses/total", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSpent(res.data.total);
      } catch (err) {
        console.log("Spent fetch error:", err);
      }
    };

    if (token) fetchSpent();
  }, [token]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setTouched(true);
    if (status !== "idle") setStatus("idle");
  };

  const updateProfile = async () => {
    setStatus("loading");
    try {
      await axios.put(
        "http://localhost:5000/user/profile",
        { name: profile.Name, budget: profile.Budget },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStatus("success");
      setTouched(false);

      // Refresh spent after update
      try {
        const res = await axios.get("http://localhost:5000/expenses/total", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSpent(res.data.total);
      } catch {}

      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  /* ================= DERIVED DATA ================= */
  const initials = profile.Name
    ? profile.Name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  const percent = profile.Budget
    ? (spent / profile.Budget) * 100
    : 0;

  const safePercent = Math.min(percent, 100);

  const getColor = () => {
    if (percent < 60) return "#22c55e";
    if (percent < 90) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="profile-page">
      <motion.div
        className="profile-container"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >

        {/* HEADER */}
        <h1 className="title">Your Profile</h1>
        <p className="subtitle">
          Manage your personal details and monthly budget
        </p>

        {/* HERO CARD */}
        <motion.div className="card hero-card" whileHover={{ scale: 1.01 }}>
          <div className="hero-left">

            {/* AVATAR */}
            <div className="avatar">
              {initials}
              <span className="avatar-dot"></span>
            </div>

            <div>
              <h2>{profile.Name || "—"}</h2>
              <p>{profile.Email || "—"}</p>
              <span className="status">Active</span>
            </div>
          </div>

          <div className="hero-right">
            <div className="budget-box">
              <p>Monthly Budget</p>
              <h3>₹{profile.Budget || 0}</h3>
            </div>
            <div className="budget-box">
              <p>Spent</p>
              <h3>₹{spent}</h3>
            </div>
          </div>
        </motion.div>

        {/* GRID */}
        <div className="grid">

          {/* PERSONAL */}
          <motion.div className="card" whileHover={{ y: -5 }}>
            <h3>Personal Info</h3>

            <input
              type="text"
              name="Name"
              value={profile.Name || ""}
              onChange={handleChange}
              placeholder="Full Name"
            />

            <input
              type="email"
              value={profile.Email || ""}
              disabled
            />
          </motion.div>

          {/* BUDGET */}
          <motion.div className="card" whileHover={{ y: -5 }}>
            <h3>Monthly Budget</h3>

            <input
              type="number"
              name="Budget"
              value={profile.Budget || ""}
              onChange={handleChange}
            />

            <div className="progress">
              <motion.div
                className="progress-bar"
                initial={{ width: 0 }}
                animate={{ width: `${safePercent}%` }}
                transition={{ duration: 1 }}
                style={{ background: getColor() }}
              />
            </div>

            <p className="progress-text">
              ₹{spent} spent • {Math.round(percent)}% used
            </p>
          </motion.div>
        </div>

        {/* ACTIONS */}
        <div className="actions">
          <button
            className="save"
            onClick={updateProfile}
            disabled={status === "loading"}
          >
            {status === "loading" ? "Saving..." : "Save Changes"}
          </button>

          <button className="cancel">Cancel</button>
        </div>

        {/* STATUS */}
        {status === "success" && (
          <p className="success-msg">Profile updated successfully</p>
        )}
        {status === "error" && (
          <p className="error-msg">Update failed. Try again.</p>
        )}

      </motion.div>
    </div>
  );
}

export default Profile;