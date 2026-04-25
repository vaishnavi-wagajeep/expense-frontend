import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/auth/login', form);

      localStorage.setItem('token', res.data.token);

      // ❌ remove alert (if you don’t want popup)
      // alert("Login successful");

      // ✅ smooth redirect to HOME page
      navigate('/');
    } catch (err) {
      alert(err?.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" style={{ backgroundImage: "url('/login_bg.jpg')" }}>

      <div className="login-card">
        <div className="card-accent" />

        <div className="brand">
          <div className="brand-icon">💰</div>
          <span className="brand-name">Expense<span>Tracker</span></span>
        </div>

        <div className="card-header">
          <h1>Welcome back 👋</h1>
          <p>Sign in to continue managing your expenses</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>

          <div className="field-group">
            <label className="field-label">Email Address</label>
            <div className="input-wrap">
              <span className="input-icon">✉️</span>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="field-input"
              />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Password</label>
            <div className="input-wrap">
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                className="field-input"
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="remember-label" onClick={() => setRemember(!remember)}>
              <div className={`checkbox ${remember ? 'checked' : ''}`}>✓</div>
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot-link">Forgot password?</a>
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Sign In'}
          </button>
        </form>

        <div className="divider"><span>or</span></div>

        <button type="button" className="btn-google">
          Continue with Google
        </button>

        <p className="signup-text">
          Don't have an account? <a href="/signup">Sign up free</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
