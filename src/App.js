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
import toast from "react-hot-toast";

toast.success("Expense added!");
toast.error("Something went wrong");

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
        <Route path="/goals" element={<SavingsGoals />} />
        <Route path="/report" element={<Report />} />
        <Route path="/ai" element={<AIChat />} />
        <Route path="/profile" element={<Profile />} />
        

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