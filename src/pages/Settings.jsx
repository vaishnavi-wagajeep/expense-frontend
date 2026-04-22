import { useState } from "react";
import axios from "axios";
import "./Settings.css";

function Settings() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const token = localStorage.getItem("token");

  // ---------------- CHANGE PASSWORD ----------------
  const changePassword = async () => {
    try {
      const res = await axios.put(
        "http://localhost:5000/user/change-password",
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert(res.data.message);
      setOldPassword("");
      setNewPassword("");

    } catch (err) {
      alert(err.response?.data?.error || "Error updating password");
    }
  };

  // ---------------- DARK MODE ----------------
  const toggleTheme = () => {
    setDarkMode(!darkMode);

    if (!darkMode) {
      document.body.style.background = "#0f172a";
      document.body.style.color = "white";
    } else {
      document.body.style.background = "#ffffff";
      document.body.style.color = "black";
    }
  };

  return (
    <div className="settings-container">

      <h2>⚙️ Settings</h2>

      {/* PASSWORD SECTION */}
      <div className="settings-card">

        <h3>🔐 Change Password</h3>

        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button onClick={changePassword}>
          Update Password
        </button>

      </div>

      {/* THEME SECTION */}
      <div className="settings-card">

        <h3>🌙 Theme</h3>

        <button onClick={toggleTheme}>
          {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>

      </div>

    </div>
  );
}

export default Settings;