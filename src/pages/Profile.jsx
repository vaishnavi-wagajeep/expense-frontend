import { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState({ Name: "", Email: "", Budget: "" });
  const [status, setStatus] = useState("idle");
  const [touched, setTouched] = useState(false);

  const token = localStorage.getItem("token");

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
    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setTouched(true);
    if (status === "success" || status === "error") setStatus("idle");
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
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      console.log(err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const initials = profile.Name
    ? profile.Name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  const spent = 31200; // temporary (you can make dynamic later)
  const percent = profile.Budget ? (spent / profile.Budget) * 100 : 0;

  return (
    <div className="profile-page">
      <div className="profile-container">

        {/* HEADER */}
        <h1 className="title">Your Profile</h1>
        <p className="subtitle">
          Manage your personal details and monthly budget
        </p>

        {/* HERO CARD */}
        <div className="card hero-card">
          <div className="hero-left">
            <div className="avatar">{initials}</div>
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
              <p>Spent so far</p>
              <h3>₹{spent}</h3>
            </div>
          </div>
        </div>

        {/* GRID SECTION */}
        <div className="grid">

          {/* PERSONAL INFO */}
          <div className="card">
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
          </div>

          {/* BUDGET */}
          <div className="card">
            <h3>Monthly Budget</h3>

            <input
              type="number"
              name="Budget"
              value={profile.Budget || ""}
              onChange={handleChange}
            />

            <div className="progress">
              <div
                className="progress-bar"
                style={{ width: `${percent}%` }}
              ></div>
            </div>

            <p className="progress-text">
              ₹{spent} spent • {Math.round(percent)}% used
            </p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
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

        {/* STATUS MESSAGE */}
        {status === "success" && (
          <p className="success-msg">Profile updated successfully</p>
        )}
        {status === "error" && (
          <p className="error-msg">Update failed. Try again.</p>
        )}

        {/* DANGER ZONE */}
      

      </div>
    </div>
  );
}

export default Profile;
