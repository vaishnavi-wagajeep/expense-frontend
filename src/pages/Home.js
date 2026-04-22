import { Link } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import './Home.css';

function Home() {
  return (
    <div className="home-container">

      {/* BACKGROUND EFFECT */}
      <div className="bg-glow"></div>

      {/* HERO SECTION */}
      <section className="hero container">

        {/* LEFT SIDE */}
        <div className="hero-left">

          <h1>
            Manage Your Money
            <br />

            {/* FIXED typing text */}
            <span className="typing-text">
              <TypeAnimation
                sequence={[
                  'Smartly 💡',
                  2500,
                  'Track Expenses 📊',
                  2500,
                  'Save More 💰',
                  2500,
                  'Stay in Control 🎯',
                  2500,
                ]}
                speed={18}
                deletionSpeed={35}
                repeat={Infinity}
                cursor={true}
              />
            </span>
          </h1>

          <p>
            Track expenses, analyze reports, plan budgets, and achieve your financial goals with clarity and control.
          </p>

          <div className="hero-buttons">
            <Link to="/signup" className="btn primary">
              Get Started
            </Link>
            <Link to="/login" className="btn secondary">
              Login
            </Link>
          </div>

          <p className="trust-text">
            Trusted by 10,000+ users
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="hero-right">

          {/* MAIN CARD */}
          <div className="mock-card main-card">
            <div className="card-header">
              <span>💳</span>
              <h3>Monthly Spending</h3>
            </div>

            <p className="amount">₹12,450</p>

            <span className="growth positive">
              +12.5% ↑ vs last month
            </span>
          </div>

          {/* SMALL CARD */}
          <div className="mock-card small-card">
            <div className="expense-row">
              <span>🍔 Food</span>
              <span>₹4,200</span>
            </div>

            <div className="expense-row">
              <span>🚕 Travel</span>
              <span>₹2,800</span>
            </div>

            <div className="expense-row">
              <span>🛍️ Shopping</span>
              <span>₹3,150</span>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="features">

        <h2>Everything You Need in One Place</h2>

        <div className="feature-grid">
          {[
            { icon: "📊", title: "Dashboard" },
            { icon: "📅", title: "Monthly Reports" },
            { icon: "📈", title: "Yearly Insights" },
            { icon: "💰", title: "Budget Planner" },
            { icon: "🎯", title: "Savings Goals" },
            { icon: "⚙️", title: "Admin Control" }
          ].map((item, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>Powerful tools to manage your finances efficiently.</p>
            </div>
          ))}
        </div>

      </section>

      {/* CTA */}
     <section className="cta">
  <div className="cta-content">
    <h2>Take Control of Your Finances Today</h2>

    <p className="cta-subtext">
      Join thousands of users managing their money smarter.
    </p>

    <Link to="/signup" className="btn primary big">
      Create Free Account
    </Link>
  </div>
</section>

    </div>
  );
}

export default Home;