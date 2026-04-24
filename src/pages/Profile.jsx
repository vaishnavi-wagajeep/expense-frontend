import { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState({ Name: "", Email: "", Budget: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
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

  /* Avatar initials */
  const initials = profile.Name
    ? profile.Name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <div className="pf-page">
      <div className="pf-container">

        {/* ── HEADER ── */}
        <div className="pf-header">
          <div className="pf-eyebrow">
            <span className="pf-eyebrow-dot" />
            Account
          </div>
          <h1 className="pf-title">Your Profile</h1>
          <p className="pf-subtitle">Manage your personal details and monthly budget</p>
        </div>

        {/* ── CARD ── */}
        <div className="pf-card">

          {/* Avatar strip */}
          <div className="pf-avatar-row">
            <div className="pf-avatar">
              <span className="pf-avatar-initials">{initials}</span>
              <span className="pf-avatar-ring" />
            </div>
            <div className="pf-avatar-meta">
              <p className="pf-avatar-name">{profile.Name || "—"}</p>
              <p className="pf-avatar-email">{profile.Email || "—"}</p>
            </div>
          </div>

          <div className="pf-divider" />

          {/* Fields */}
          <div className="pf-fields">

            <div className="pf-field">
              <label className="pf-label">
                Full Name
              </label>
              <div className="pf-input-wrap">
                <svg className="pf-input-icon" width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
                <input
                  className="pf-input"
                  name="Name"
                  value={profile.Name || ""}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="pf-field">
              <label className="pf-label">
                Email Address
                <span className="pf-badge">Read only</span>
              </label>
              <div className="pf-input-wrap pf-input-wrap--disabled">
                <svg className="pf-input-icon" width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M1 6l7 4 7-4" stroke="currentColor" strokeWidth="1.4"/>
                </svg>
                <input
                  className="pf-input pf-input--disabled"
                  value={profile.Email || ""}
                  disabled
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="pf-field">
              <label className="pf-label">
                Monthly Budget
              </label>
              <div className="pf-input-wrap">
                <span className="pf-input-icon pf-rupee">₹</span>
                <input
                  className="pf-input pf-input--mono"
                  name="Budget"
                  type="number"
                  value={profile.Budget || ""}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                />
              </div>
              <p className="pf-hint">Used to calculate your spending progress on the dashboard</p>
            </div>

          </div>

          <div className="pf-divider" />

          {/* Footer / action row */}
          <div className="pf-footer">
            {/* Status message */}
            <div className={`pf-status pf-status--${status}`}>
              {status === "success" && (
                <>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="#00d4aa" strokeWidth="1.4"/>
                    <path d="M5 8l2 2 4-4" stroke="#00d4aa" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Profile updated successfully
                </>
              )}
              {status === "error" && (
                <>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="#f43f5e" strokeWidth="1.4"/>
                    <path d="M8 5v3.5M8 10.5v.5" stroke="#f43f5e" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                  Update failed — please try again
                </>
              )}
            </div>

            <button
              className={`pf-btn ${status === "loading" ? "pf-btn--loading" : ""} ${!touched ? "pf-btn--dim" : ""}`}
              onClick={updateProfile}
              disabled={status === "loading"}
            >
              {status === "loading" ? (
                <>
                  <span className="pf-spinner" />
                  Saving…
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <path d="M2 14V10.5L10.5 2 14 5.5 5.5 14H2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                    <path d="M9 3.5l3.5 3.5" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;