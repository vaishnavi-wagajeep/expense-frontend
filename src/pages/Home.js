import { Link } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';
import './Home.css';

function Home() {

  /* ANIMATION VARIANTS */
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const stagger = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="home-container">

      <div className="bg-glow"></div>
      <div className="bg-grid"></div>

      {/* HERO */}
      <section className="hero">

        {/* LEFT */}
        <motion.div
          className="hero-left"
          variants={stagger}
          initial="hidden"
          animate="show"
        >

          <motion.h1 variants={fadeUp} className="hero-title">
            Manage Your <br /> <span>Money Smartly</span>
          </motion.h1>

          <motion.div variants={fadeUp} className="typing-text">
            <TypeAnimation
              sequence={[
                'Track Expenses 📊',
                2000,
                'Save More 💰',
                2000,
                'Stay in Control 🎯',
                2000,
                'Build Better Habits 🚀',
                2000,
              ]}
              speed={25}
              repeat={Infinity}
            />
          </motion.div>

          <motion.p variants={fadeUp} className="hero-subtext">
            Take full control of your finances with real-time insights, smart budgeting,
            and powerful analytics — all in one place.
          </motion.p>

          <motion.div variants={fadeUp} className="hero-buttons">
            <Link to="/signup" className="btn primary">
              Get Started →
            </Link>
            <Link to="/login" className="btn secondary">
              Login
            </Link>
          </motion.div>

          <motion.p variants={fadeUp} className="trust-text">
            ⭐ Trusted by 10,000+ users worldwide
          </motion.p>

        </motion.div>

        {/* RIGHT */}
        <motion.div
          className="hero-right"
          initial="hidden"
          animate="show"
          variants={stagger}
        >

          <motion.div variants={scaleIn} className="mock-card main-card glass">
            <div className="card-header">
              <span>💳</span>
              <h3>Monthly Spending</h3>
            </div>
            <p className="amount">₹12,450</p>
            <span className="growth positive">+12.5% ↑ vs last month</span>
          </motion.div>

          <motion.div variants={scaleIn} className="mock-card small-card glass">
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
          </motion.div>

        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="features">

        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          Everything You Need in One Place
        </motion.h2>

        <motion.div
          className="feature-grid"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {[
            { icon: "📊", title: "Dashboard" },
            { icon: "📅", title: "Monthly Reports" },
            { icon: "📈", title: "Yearly Insights" },
            { icon: "💰", title: "Budget Planner" },
            { icon: "🎯", title: "Savings Goals" },
            { icon: "⚙️", title: "Admin Control" }
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ scale: 1.05 }}
              className="feature-card glass"
            >
              <div className="feature-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>Powerful tools to manage your finances efficiently.</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="cta">
        <motion.div
          className="cta-content glass"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2>Take Control of Your Finances Today</h2>
          <p className="cta-subtext">
            Join thousands of users managing their money smarter.
          </p>
          <Link to="/signup" className="btn primary big">
            Create Free Account →
          </Link>
        </motion.div>
      </section>

    </div>
  );
}

export default Home;