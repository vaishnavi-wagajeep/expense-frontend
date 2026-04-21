import { Link } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import './Home.css';

function Home() {
  return (
    <div className="home-container">

      {/* BACKGROUND EFFECT */}
      <div className="bg-glow"></div>

      {/* HERO */}
      <section className="hero container">
        <div className="hero-left">

          <h1>
            Manage Your Money <br />

            <span className="typing-text">
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
    cursor={false}  // we’ll use custom cursor
  />
</span>
</span>
            
          </h1>

          <p>
            Track expenses, analyze reports, plan budgets, and achieve your financial goals with clarity and control.
          </p>

          <div className="hero-buttons">
            <Link to="/signup" className="btn primary">Get Started</Link>
            <Link to="/login" className="btn secondary">Login</Link>
          </div>

          {/* TRUST TEXT */}
          <p className="trust-text">Trusted by 10,000+ users</p>
        </div>

        <div className="hero-right">
          <div className="mock-card main-card">
            <h3>Monthly Spending</h3>
            <p>₹12,450</p>
          </div>

          <div className="mock-card small-card">
            <p>🍔 Food: ₹4,200</p>
            <p>🚕 Travel: ₹2,800</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <h2>Everything You Need in One Place</h2>

        <div className="feature-grid">
          {[
            "📊 Dashboard",
            "📅 Monthly Reports",
            "📈 Yearly Insights",
            "💰 Budget Planner",
            "🎯 Savings Goals",
            "⚙️ Admin Control"
          ].map((item, i) => (
            <div key={i} className="feature-card">
              <h3>{item}</h3>
              <p>Powerful tools to manage your finances efficiently.</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Take Control of Your Finances Today</h2>
        <Link to="/signup" className="btn primary big">
          Create Free Account
        </Link>
      </section>

    </div>
  );
}

export default Home;