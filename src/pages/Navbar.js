import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; // import CSS

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <h3 className="logo">Expense Tracker 💰</h3>

      <div className="nav-links">
        {token ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/add-expense">Add Expense</Link>
            <button className="btn logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn login">Login</Link>
            <Link to="/signup" className="btn signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;