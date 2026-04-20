import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import { FcGoogle } from "react-icons/fc";


function getStrength(password) {
  if (!password) return null;
  if (password.length < 6) return { level: 1, label: 'Weak', color: '#ef4444' };
  if (password.length < 10) return { level: 2, label: 'Medium', color: '#f59e0b' };
  return { level: 3, label: 'Strong', color: '#22c55e' };
}

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.includes('@')) newErrors.email = 'Enter a valid email address';
    if (form.password.length < 6) newErrors.password = 'Minimum 6 characters required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate() || loading) return;

    setLoading(true);
    setServerError('');

    try {
      await axios.post('http://localhost:5000/auth/signup', form);
      navigate('/login');
    } catch (err) {
      setServerError(err?.response?.data?.error || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const strength = getStrength(form.password);

  return (
    <div
      className="signup-wrapper signup-page"
      style={{ backgroundImage: "url('/sign_up1.jpg')" }}
    >
      <div className="card-container">
        <form onSubmit={handleSubmit} className="signup-card" noValidate>

          <h2>Create Account</h2>
          <p className="subtitle">Start your journey today</p>

          {serverError && (
            <div className="server-error">{serverError}</div>
          )}

          {/* NAME */}
          <div className="field-wrap">
            <div className="input-group">
              <span className="icon">👤</span>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className={errors.name ? 'error-border' : ''}
              />
            </div>
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          {/* EMAIL */}
          <div className="field-wrap">
            <div className="input-group">
              <span className="icon">📧</span>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className={errors.email ? 'error-border' : ''}
              />
            </div>
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          {/* PASSWORD */}
          <div className="field-wrap">
            <div className="input-group password-group">
              <span className="icon">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className={errors.password ? 'error-border' : ''}
              />

              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>

            {strength && (
              <>
                <div className="strength-bar">
                  <span style={{ background: strength.level >= 1 ? strength.color : undefined }} />
                  <span style={{ background: strength.level >= 2 ? strength.color : undefined }} />
                  <span style={{ background: strength.level >= 3 ? strength.color : undefined }} />
                </div>
                <p className="strength-label" style={{ color: strength.color }}>
                  {strength.label} password
                </p>
              </>
            )}

            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="signup-btn"
            disabled={loading}
          >
            {loading ? 'Creating account…' : 'Sign Up'}
          </button>

          <div className="divider">or</div>

          {/* GOOGLE BUTTON */}
          <button className="google-btn">
  <FcGoogle size={20} />
  Continue with Google
</button>

          <p className="switch-text">
            Already have an account?{' '}
            <span onClick={() => navigate('/login')}>
              Login
            </span>
          </p>

        </form>
      </div>
    </div>
  );
}

export default Signup;