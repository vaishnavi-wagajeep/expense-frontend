import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Signup from './pages/Signup';
import Login from './pages/Login';
import AddExpense from './pages/AddExpense';
import Navbar from './pages/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

/* ================= LAYOUT ================= */
function Layout() {
  const location = useLocation();

  // Hide navbar on these routes
  const hideNavbarRoutes = ['/login', '/signup', '/dashboard'];

  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-expense" element={<AddExpense />} />
      </Routes>
    </>
  );
}

/* ================= APP ================= */
function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;