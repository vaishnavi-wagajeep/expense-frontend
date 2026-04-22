import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

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
          <Link to="/about" className={isActive('/about') ? 'active' : ''}>About</Link>
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

              <button onClick={handleLogout} className="btn logout-btn">
                Logout
              </button>
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