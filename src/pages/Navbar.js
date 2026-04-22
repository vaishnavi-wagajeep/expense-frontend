import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';


function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    

        <div className="navbar-wrapper">
  <nav className="navbar container">

        {/* LOGO */}
        <h2 className="logo">
          Expense <span>Tracker</span>
        </h2>

        {/* CENTER LINKS */}
        <div className="nav-center">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/about">About</Link>
          <Link to="/report">Reports</Link>
          <Link to="/ai">AI Assistant</Link>
        </div>

        {/* ACTIONS */}
        <div className="nav-actions">
          {token ? (
            <>
              <Link to="/add-expense" className="btn neon">
                + Add
              </Link>

              <button onClick={handleLogout} className="btn ghost">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn ghost">
                Login
              </Link>

              <Link to="/signup" className="btn neon">
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