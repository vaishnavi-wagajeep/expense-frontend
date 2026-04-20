import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <h1>Manage Your Money Smartly</h1>
          <p>
            Track expenses, analyze reports, plan budgets, and achieve your savings goals.
          </p>

          <div className="hero-buttons">
            <Link to="/signup" className="btn primary">Get Started</Link>
            <Link to="/login" className="btn secondary">Login</Link>
          </div>
        </div>

        <div className="hero-right">
          <div className="mock-card">
            <h3>Monthly Spending</h3>
            <p>₹12,450</p>
          </div>
          <div className="mock-card small">
            <p>Food: ₹4,200</p>
            <p>Travel: ₹2,800</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <h2>Everything You Need in One Place</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>📊 Dashboard</h3>
            <p>Visual overview of all your expenses.</p>
          </div>

          <div className="feature-card">
            <h3>📅 Monthly Reports</h3>
            <p>Analyze spending with bar charts.</p>
          </div>

          <div className="feature-card">
            <h3>📈 Yearly Insights</h3>
            <p>Track trends with line graphs.</p>
          </div>

          <div className="feature-card">
            <h3>💰 Budget Planner</h3>
            <p>Set and manage monthly budgets.</p>
          </div>

          <div className="feature-card">
            <h3>🎯 Savings Goals</h3>
            <p>Track your financial goals easily.</p>
          </div>

          <div className="feature-card">
            <h3>⚙️ Admin Control</h3>
            <p>Manage users and system settings.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Start Managing Your Money Today</h2>
        <Link to="/signup" className="btn primary big">
          Create Free Account
        </Link>
      </section>

    </div>
  );
}

export default Home;