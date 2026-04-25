import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profile, setProfile] = useState({ Name: '', Email: '' });
  const dropdownRef = useRef(null);

  // ✅ LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem('token');
    setProfile({ Name: '', Email: '' });
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  // Fetch user profile
  useEffect(() => {
    if (!token) return;
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.log('Navbar profile fetch error:', err);
      }
    };
    fetchProfile();
  }, [token]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Avatar initials
  const initials = profile.Name
    ? profile.Name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div className="navbar-wrapper">
      <nav className="navbar container">

        {/* LOGO */}
        <h2 className="logo">
          Expense <span>Tracker</span>
        </h2>

        {/* CENTER LINKS */}
        <div className="nav-center">
          <Link to="/" className={isActive('/') ? 'active' : ''}>Home</Link>
          <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>Dashboard</Link>
          <Link to="/report" className={isActive('/report') ? 'active' : ''}>Reports</Link>
          <Link to="/ai" className={isActive('/ai') ? 'active' : ''}>AI Assistant</Link>
        </div>

        {/* ACTIONS */}
        <div className="nav-actions">
          {token ? (
            <>
              <Link to="/add-expense" className="btn add-btn">
                + Add
              </Link>

              {/* PROFILE */}
              <div className="profile-wrapper" ref={dropdownRef}>
                <div
                  className="profile-avatar"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span>{initials}</span>
                </div>

                {dropdownOpen && (
                  <div className="profile-dropdown">

                    {/* HEADER */}
                    <div className="dropdown-header">
                      <div className="dropdown-avatar">{initials}</div>
                      <div>
                        <p className="dropdown-name">{profile.Name || '—'}</p>
                        <p className="dropdown-email">{profile.Email || '—'}</p>
                      </div>
                    </div>

                    <hr className="dropdown-divider" />

                    {/* EDIT PROFILE */}
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      👤 Edit Profile
                    </Link>

                    {/* RESET PASSWORD */}
                    <Link
                      to="/reset-password"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      ♻️ Reset Password
                    </Link>

                    <hr className="dropdown-divider" />

                    {/* 🚪 LOGOUT */}
                    <button
                      className="dropdown-item logout-item"
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                    >
                      🚪 Logout
                    </button>

                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn ghost">
                Login
              </Link>
              <Link to="/signup" className="btn primary">
                Sign Up →
              </Link>
            </>
          )}
        </div>

      </nav>
    </div>
  );
}

export default Navbar;
