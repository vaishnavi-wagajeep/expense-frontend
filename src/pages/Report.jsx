import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

/* ─────────────────────────────────────────
   Inline styles — no external CSS needed.
   Drop Report.css import if using this file.
───────────────────────────────────────── */

const S = {
  /* Page shell */
  page: {
    minHeight: "100vh",
    background: "#080c14",
    fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
    color: "#e8edf5",
    position: "relative",
    overflow: "hidden",
  },

  /* Ambient background blobs */
  blob1: {
    position: "fixed",
    top: "-180px",
    right: "-120px",
    width: "520px",
    height: "520px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(0,212,170,0.07) 0%, transparent 70%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  blob2: {
    position: "fixed",
    bottom: "-200px",
    left: "-100px",
    width: "480px",
    height: "480px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(79,142,247,0.07) 0%, transparent 70%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  noiseOverlay: {
    position: "fixed",
    inset: 0,
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
    backgroundRepeat: "repeat",
    backgroundSize: "180px",
    pointerEvents: "none",
    zIndex: 0,
    opacity: 0.6,
  },

  /* Main content wrapper */
  container: {
    position: "relative",
    zIndex: 1,
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 32px 64px",
  },

  /* ── HEADER ── */
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: "44px",
    flexWrap: "wrap",
    gap: "24px",
  },
  headerLeft: { display: "flex", flexDirection: "column", gap: "6px" },
  eyebrow: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#00d4aa",
    marginBottom: "4px",
  },
  eyebrowDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#00d4aa",
    boxShadow: "0 0 8px #00d4aa",
    animation: "pulse 2s ease-in-out infinite",
  },
  title: {
    fontSize: "32px",
    fontWeight: 700,
    letterSpacing: "-0.03em",
    color: "#f0f5ff",
    margin: 0,
    lineHeight: 1.1,
  },
  subtitle: {
    fontSize: "14px",
    color: "#5a6b82",
    margin: "6px 0 0",
    letterSpacing: "0.01em",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexShrink: 0,
  },

  /* Year picker */
  yearWrap: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    padding: "8px 14px",
    backdropFilter: "blur(12px)",
  },
  yearLabel: { fontSize: "12px", color: "#5a6b82", fontWeight: 500 },
  yearInput: {
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#f0f5ff",
    fontSize: "14px",
    fontWeight: 600,
    width: "52px",
    textAlign: "right",
    fontFamily: "'DM Mono', monospace",
  },

  /* PDF button */
  pdfBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(0,212,170,0.1)",
    border: "1px solid rgba(0,212,170,0.3)",
    borderRadius: "10px",
    padding: "9px 18px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#00d4aa",
    cursor: "pointer",
    letterSpacing: "0.01em",
    transition: "all 0.2s ease",
    backdropFilter: "blur(12px)",
  },

  /* ── STAT CARDS ── */
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
    marginBottom: "28px",
  },
  statCard: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "14px",
    padding: "20px 22px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    backdropFilter: "blur(20px)",
    transition: "border-color 0.2s ease, transform 0.2s ease",
    cursor: "default",
    position: "relative",
    overflow: "hidden",
  },
  statCardAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "1px",
  },
  statIconWrap: {
    width: "36px",
    height: "36px",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    flexShrink: 0,
  },
  statLabel: {
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#4a5a72",
    marginBottom: "4px",
  },
  statValue: {
    fontSize: "22px",
    fontWeight: 700,
    letterSpacing: "-0.02em",
    color: "#eef2ff",
    fontFamily: "'DM Mono', monospace",
  },
  statSub: {
    fontSize: "11px",
    color: "#4a5a72",
    marginTop: "1px",
  },

  /* ── CHART CARDS ── */
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(440px, 1fr))",
    gap: "20px",
  },
  chartCard: {
    background: "rgba(255,255,255,0.025)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "16px",
    padding: "24px 26px",
    backdropFilter: "blur(20px)",
  },
  chartHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: "22px",
  },
  chartTitle: {
    fontSize: "15px",
    fontWeight: 600,
    color: "#c8d4e8",
    letterSpacing: "-0.01em",
    margin: 0,
  },
  chartSub: {
    fontSize: "12px",
    color: "#3d4f63",
    marginTop: "3px",
    letterSpacing: "0.01em",
  },
  legendChip: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "99px",
    padding: "4px 10px",
    fontSize: "11px",
    fontWeight: 500,
    color: "#6a7f9a",
  },
  legendDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  chartBody: {
    position: "relative",
    height: "240px",
  },

  /* ── DIVIDER ── */
  divider: {
    height: "1px",
    background: "rgba(255,255,255,0.05)",
    margin: "6px 0 28px",
  },

  /* ── ERROR / LOADING / EMPTY ── */
  error: {
    background: "rgba(244,63,94,0.08)",
    border: "1px solid rgba(244,63,94,0.2)",
    borderRadius: "10px",
    padding: "12px 16px",
    fontSize: "13px",
    color: "#f87191",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  loading: {
    textAlign: "center",
    padding: "80px 0",
    color: "#4a5a72",
    fontSize: "14px",
  },
  empty: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "200px",
    fontSize: "13px",
    color: "#3d4f63",
    letterSpacing: "0.02em",
  },

  spinner: {
    width: "14px",
    height: "14px",
    border: "2px solid rgba(0,212,170,0.3)",
    borderTop: "2px solid #00d4aa",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    display: "inline-block",
  },
};

/* Stat card accent colors */
const STAT_META = [
  {
    accentColor: "#00d4aa",
    iconBg: "rgba(0,212,170,0.1)",
    iconColor: "#00d4aa",
    icon: "↗",
    label: "This Year",
    sub: "total spending",
  },
  {
    accentColor: "#4f8ef7",
    iconBg: "rgba(79,142,247,0.1)",
    iconColor: "#4f8ef7",
    icon: "∑",
    label: "All-Time",
    sub: "cumulative total",
  },
  {
    accentColor: "#fbbf24",
    iconBg: "rgba(251,191,36,0.1)",
    iconColor: "#fbbf24",
    icon: "▲",
    label: "Peak Month",
    sub: "highest spend",
  },
  {
    accentColor: "#f43f5e",
    iconBg: "rgba(244,63,94,0.1)",
    iconColor: "#f43f5e",
    icon: "~",
    label: "Avg / Month",
    sub: "monthly average",
  },
];

const KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .rp-fadein { animation: fadeUp 0.5s ease both; }
  .rp-stat-hover:hover {
    border-color: rgba(255,255,255,0.14) !important;
    transform: translateY(-2px);
  }
  .rp-pdf-hover:hover {
    background: rgba(0,212,170,0.18) !important;
    border-color: rgba(0,212,170,0.5) !important;
  }
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
`;

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#0d1421",
      titleColor: "#c8d4e8",
      bodyColor: "#5a6b82",
      borderColor: "rgba(255,255,255,0.1)",
      borderWidth: 1,
      padding: 14,
      cornerRadius: 8,
      titleFont: { family: "'DM Sans'", weight: "600", size: 12 },
      bodyFont: { family: "'DM Mono'", size: 13 },
      callbacks: {
        label: (ctx) => ` ₹${ctx.parsed.y.toLocaleString()}`,
      },
    },
  },
  scales: {
    x: {
      grid: { color: "rgba(255,255,255,0.03)", drawBorder: false },
      border: { display: false },
      ticks: {
        color: "#3d4f63",
        font: { size: 11, family: "'DM Sans'", weight: "500" },
      },
    },
    y: {
      grid: { color: "rgba(255,255,255,0.04)", drawBorder: false },
      border: { display: false },
      ticks: {
        color: "#3d4f63",
        font: { size: 11, family: "'DM Mono'" },
        callback: (v) => `₹${v >= 1000 ? (v / 1000).toFixed(0) + "k" : v}`,
      },
    },
  },
};

/* ─────────────────────────────────────────
   COMPONENT
───────────────────────────────────────── */
function Report() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [hovered, setHovered] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) { setError("User not logged in"); return; }
    const fetchData = async () => {
      setLoading(true); setError("");
      try {
        const [monthlyRes, yearlyRes] = await Promise.all([
          axios.get(`http://localhost:5000/report/monthly?year=${year}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:5000/report/yearly`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setMonthlyData(monthlyRes.data || []);
        setYearlyData(yearlyRes.data || []);
      } catch {
        setError("Failed to load report data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [year]);

  const downloadPDF = async () => {
    setDownloading(true);
    try {
      const res = await axios.get("http://localhost:5000/report/pdf", {
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.setAttribute("download", "expense-report.pdf");
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      alert("PDF download failed");
    } finally {
      setDownloading(false);
    }
  };

  const totalMonthly = monthlyData.reduce((s, d) => s + d.total, 0);
  const totalYearly = yearlyData.reduce((s, d) => s + d.total, 0);
  const peakMonth = monthlyData.length
    ? monthlyData.reduce((a, b) => (a.total > b.total ? a : b))
    : null;
  const avgMonth = monthlyData.length
    ? Math.round(totalMonthly / monthlyData.length)
    : null;

  const statValues = [
    `₹${totalMonthly.toLocaleString()}`,
    `₹${totalYearly.toLocaleString()}`,
    peakMonth
      ? `${new Date(0, peakMonth.month - 1).toLocaleString("default", { month: "short" })} · ₹${peakMonth.total.toLocaleString()}`
      : "—",
    avgMonth ? `₹${avgMonth.toLocaleString()}` : "—",
  ];

  const monthlyChart = {
    labels: monthlyData.map((d) =>
      new Date(0, d.month - 1).toLocaleString("default", { month: "short" })
    ),
    datasets: [
      {
        data: monthlyData.map((d) => d.total),
        backgroundColor: (ctx) => {
          const chart = ctx.chart;
          const { ctx: c, chartArea } = chart;
          if (!chartArea) return "rgba(0,212,170,0.6)";
          const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(0,212,170,0.85)");
          gradient.addColorStop(1, "rgba(0,212,170,0.2)");
          return gradient;
        },
        hoverBackgroundColor: "#00d4aa",
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const yearlyChart = {
    labels: yearlyData.map((d) => d.year),
    datasets: [
      {
        data: yearlyData.map((d) => d.total),
        backgroundColor: (ctx) => {
          const chart = ctx.chart;
          const { ctx: c, chartArea } = chart;
          if (!chartArea) return "rgba(79,142,247,0.6)";
          const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(79,142,247,0.85)");
          gradient.addColorStop(1, "rgba(79,142,247,0.2)");
          return gradient;
        },
        hoverBackgroundColor: "#4f8ef7",
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div style={S.page}>
        {/* Background effects */}
        <div style={S.blob1} />
        <div style={S.blob2} />
        <div style={S.noiseOverlay} />

        <div style={S.container}>

          {/* ── HEADER ── */}
          <div style={S.header} className="rp-fadein">
            <div style={S.headerLeft}>
              <div style={S.eyebrow}>
                <span style={S.eyebrowDot} />
                Analytics
              </div>
              <h1 style={S.title}>Expense Reports</h1>
              <p style={S.subtitle}>
                Track spending patterns across months and years
              </p>
            </div>

            <div style={S.headerRight}>
              <div style={S.yearWrap}>
                <span style={S.yearLabel}>Year</span>
                <input
                  type="number"
                  style={S.yearInput}
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  min="2000"
                  max="2099"
                />
              </div>
              <button
                style={S.pdfBtn}
                className="rp-pdf-hover"
                onClick={downloadPDF}
                disabled={downloading}
              >
                {downloading ? (
                  <span style={S.spinner} />
                ) : (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 12h10M8 2v8M5 7l3 3 3-3" stroke="#00d4aa" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {downloading ? "Generating…" : "Export PDF"}
              </button>
            </div>
          </div>

          {/* ── STAT CARDS ── */}
          <div style={S.statsGrid}>
            {STAT_META.map((m, i) => (
              <div
                key={i}
                style={{
                  ...S.statCard,
                  animationDelay: `${i * 80}ms`,
                  borderColor:
                    hovered === i
                      ? "rgba(255,255,255,0.12)"
                      : "rgba(255,255,255,0.07)",
                  transform: hovered === i ? "translateY(-2px)" : "none",
                  transition: "all 0.22s ease",
                }}
                className="rp-fadein"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Top accent line */}
                <div
                  style={{
                    ...S.statCardAccent,
                    background: `linear-gradient(90deg, ${m.accentColor}55 0%, transparent 100%)`,
                    opacity: hovered === i ? 1 : 0,
                    transition: "opacity 0.22s ease",
                  }}
                />

                <div
                  style={{
                    ...S.statIconWrap,
                    background: m.iconBg,
                    color: m.iconColor,
                    fontSize: "14px",
                    fontWeight: 700,
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  {m.icon}
                </div>

                <div>
                  <div style={S.statLabel}>{m.label}</div>
                  <div
                    style={{
                      ...S.statValue,
                      color: hovered === i ? m.iconColor : "#eef2ff",
                      transition: "color 0.22s ease",
                    }}
                  >
                    {loading ? (
                      <span style={{ opacity: 0.3 }}>—</span>
                    ) : (
                      statValues[i]
                    )}
                  </div>
                  <div style={S.statSub}>{m.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={S.divider} />

          {/* ── ERROR ── */}
          {error && (
            <div style={S.error}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="#f87191" strokeWidth="1.4"/>
                <path d="M8 5v3.5M8 10.5v.5" stroke="#f87191" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
              {error}
            </div>
          )}

          {/* ── CHARTS ── */}
          {loading ? (
            <div style={S.loading}>
              <div
                style={{
                  ...S.spinner,
                  width: "24px",
                  height: "24px",
                  border: "2px solid rgba(0,212,170,0.15)",
                  borderTop: "2px solid #00d4aa",
                  margin: "0 auto 16px",
                }}
              />
              <p>Loading analytics…</p>
            </div>
          ) : (
            <div style={S.chartsGrid}>
              {/* Monthly chart */}
              <div style={S.chartCard} className="rp-fadein" style={{ ...S.chartCard, animationDelay: "200ms" }}>
                <div style={S.chartHeader}>
                  <div>
                    <p style={S.chartTitle}>Monthly Breakdown</p>
                    <p style={S.chartSub}>{year} — expense by month</p>
                  </div>
                  <div style={S.legendChip}>
                    <span style={{ ...S.legendDot, background: "#00d4aa" }} />
                    Monthly
                  </div>
                </div>
                <div style={S.chartBody}>
                  {monthlyData.length === 0 ? (
                    <div style={S.empty}>No data for {year}</div>
                  ) : (
                    <Bar data={monthlyChart} options={chartOptions} />
                  )}
                </div>
              </div>

              {/* Yearly chart */}
              <div style={{ ...S.chartCard, animationDelay: "320ms" }} className="rp-fadein">
                <div style={S.chartHeader}>
                  <div>
                    <p style={S.chartTitle}>Yearly Overview</p>
                    <p style={S.chartSub}>All-time — expense by year</p>
                  </div>
                  <div style={S.legendChip}>
                    <span style={{ ...S.legendDot, background: "#4f8ef7" }} />
                    Yearly
                  </div>
                </div>
                <div style={S.chartBody}>
                  {yearlyData.length === 0 ? (
                    <div style={S.empty}>No yearly data available</div>
                  ) : (
                    <Bar data={yearlyChart} options={chartOptions} />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Report;