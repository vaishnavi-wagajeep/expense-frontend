import { useState } from "react";
import axios from "axios";
import "./ResetPassword.css";

function ResetPassword() {
  const [form, setForm] = useState({
    email: "",
    newPassword: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleResetPassword = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/auth/reset-password",
        form
      );

      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <div className="reset-wrapper">
      <div className="reset-card">

        <h2>Reset Password</h2>

        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={form.newPassword}
          onChange={handleChange}
        />

        <button onClick={handleResetPassword}>
          Reset Password
        </button>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default ResetPassword;
