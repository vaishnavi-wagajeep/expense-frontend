import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Signup from './pages/Signup';
import Login from './pages/Login';
import AddExpense from './pages/AddExpense';
import Navbar from './pages/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import SavingsGoals from './pages/SavingsGoals';
import Report from './pages/Report';
import AIChat from "./pages/AIChat";
import Profile from './pages/Profile';
import { Toaster } from "react-hot-toast";
import Settings from './pages/Settings';
import ResetPassword from "./pages/ResetPassword";

<Route path="/reset-password" element={<ResetPassword />} />


/* ================= LAYOUT ================= */
function Layout() {
  const location = useLocation();

  const hideNavbarRoutes = ['/login', '/signup'];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      <Toaster position="top-right" />
      {!hideNavbar && <Navbar />}

      {/* Push page content below the fixed navbar (68px tall) */}
      <div style={{ paddingTop: hideNavbar ? 0 : '68px' }}>
        <Routes>
          <Route path="/"            element={<Home />} />
          <Route path="/login"       element={<Login />} />
          <Route path="/signup"      element={<Signup />} />
          <Route path="/dashboard"   element={<Dashboard />} />
          <Route path="/add-expense" element={<AddExpense />} />
          <Route path="/goals"       element={<SavingsGoals />} />
          <Route path="/report"      element={<Report />} />
          <Route path="/ai"          element={<AIChat />} />
          <Route path="/profile"     element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </div>
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