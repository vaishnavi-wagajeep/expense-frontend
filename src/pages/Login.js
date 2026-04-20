import { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login() {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/auth/login', form);
      localStorage.setItem('token', res.data.token);

      alert("Login successful");
      window.location.href = "/dashboard";
    } catch (err) {
      alert(err?.response?.data?.message || "Server error");
    }
  };

  return (
    <div
      className="login-wrapper"
      style={{
        backgroundImage: "url('/login_new.jpg')"
      }}
    >
      <div className="overlay">

        <div className="card-container">
          <form className="login-card premium" onSubmit={handleSubmit}>

            <h2>Welcome Back 👋</h2>
            <p className="subtitle">
              Login to continue managing your expenses
            </p>

            {/* EMAIL */}
            <div className="input-group">
              <span className="icon">📧</span>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="input-group">
              <span className="icon">🔒</span>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="options">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <a href="#">Forgot password?</a>
            </div>

            <button type="submit" className="login-btn">Login</button>

            <div className="divider">or</div>

            <button type="button" className="google-btn">
              Continue with Google
            </button>

            <p className="switch-text">
              Don't have an account? <a href="/signup">Sign up</a>
            </p>

          </form>
        </div>

      </div>
    </div>
  );
}

export default Login;