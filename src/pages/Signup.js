import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

function getStrength(password) {
  if (!password) return null;
  if (password.length < 6) return { level: 1, label: 'Weak', color: '#ef4444' };
  if (password.length < 10) return { level: 2, label: 'Medium', color: '#f59e0b' };
  return { level: 3, label: 'Strong', color: '#22c55e' };
}

const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <polyline points="2,4 12,13 22,4"/>
  </svg>
);

const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const IconEye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const IconEyeOff = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.3 0 6.2 1.1 8.5 3.2l6.4-6.4C34.9 2.8 29.8.5 24 .5 14.8.5 6.9 6 3.2 14.1l7.5 5.8C12.5 13.5 17.8 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17z"/>
    <path fill="#FBBC05" d="M10.7 28.5c-.5-1.5-.8-3.2-.8-5s.3-3.4.8-5l-7.5-5.8C1.2 16.1 0 20 0 24s1.2 7.9 3.2 11.3l7.5-5.8z"/>
    <path fill="#34A853" d="M24 47.5c5.8 0 10.7-1.9 14.3-5.1l-7.5-5.8c-2 1.4-4.4 2.2-6.8 2.2-6.2 0-11.5-4-13.3-9.5l-7.5 5.8C6.9 42 14.8 47.5 24 47.5z"/>
  </svg>
);

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
    <div className="signup-wrapper" style={{ backgroundImage: "url('/sign_up1.jpg')" }}>
      <div className="card-container">
        <form onSubmit={handleSubmit} className="signup-card" noValidate>

          <div className="card-header">
            <div className="logo-mark">
              <IconUser />
            </div>
            <h2>Create account</h2>
            <p className="subtitle">Start your journey today</p>
          </div>

          {serverError && (
            <div className="server-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {serverError}
            </div>
          )}

          {/* NAME */}
          <div className="field-wrap">
            <div className={`input-group ${errors.name ? 'has-error' : ''}`}>
              <span className="icon"><IconUser /></span>
              <input
                type="text"
                name="name"
                placeholder="Full name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          {/* EMAIL */}
          <div className="field-wrap">
            <div className={`input-group ${errors.email ? 'has-error' : ''}`}>
              <span className="icon"><IconMail /></span>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          {/* PASSWORD */}
          <div className="field-wrap">
            <div className={`input-group password-group ${errors.password ? 'has-error' : ''}`}>
              <span className="icon"><IconLock /></span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>

            {strength && (
              <div className="strength-container">
                <div className="strength-bar">
                  <span className={`bar-segment ${strength.level >= 1 ? 'active' : ''}`} style={{ background: strength.level >= 1 ? strength.color : undefined }} />
                  <span className={`bar-segment ${strength.level >= 2 ? 'active' : ''}`} style={{ background: strength.level >= 2 ? strength.color : undefined }} />
                  <span className={`bar-segment ${strength.level >= 3 ? 'active' : ''}`} style={{ background: strength.level >= 3 ? strength.color : undefined }} />
                </div>
                <p className="strength-label" style={{ color: strength.color }}>
                  {strength.label}
                </p>
              </div>
            )}

            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          {/* SUBMIT */}
          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" />
                Creating account…
              </>
            ) : 'Create account'}
          </button>

          <div className="divider"><span>or continue with</span></div>

          {/* GOOGLE */}
          <button type="button" className="google-btn">
            <GoogleIcon />
            Continue with Google
          </button>

          <p className="switch-text">
            Already have an account?{' '}
            <span onClick={() => navigate('/login')}>Sign in</span>
          </p>

        </form>
      </div>
    </div>
  );
}

export default Signup;