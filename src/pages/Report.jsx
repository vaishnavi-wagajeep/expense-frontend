import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import CountUp from "react-countup";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import "./Report.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

/* ========================= FORMATTER ========================= */
const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(Number(amount));
};

function Report() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());

  const containerRef = useRef();
  const token = localStorage.getItem("token");

  /* ========================= FETCH ========================= */
  const fetchData = useCallback(async () => {
    try {
      const [m, y] = await Promise.all([
        axios.get(`http://localhost:5000/report/monthly?year=${year}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`http://localhost:5000/report/yearly`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setMonthlyData(m.data || []);
      setYearlyData(y.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }, [year, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* 🔥 Auto-refresh every 5 sec */
  useEffect(() => {
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  /* ========================= CALCULATIONS ========================= */
  const totalMonthly = monthlyData.reduce((s, d) => s + Number(d.total), 0);
  const totalYearly = yearlyData.reduce((s, d) => s + Number(d.total), 0);

  const peakMonth = monthlyData.reduce(
    (max, curr) => (curr.total > max.total ? curr : max),
    { total: 0 }
  );

  const avgMonth = monthlyData.length
    ? totalMonthly / monthlyData.length
    : 0;

  const prevYear = year - 1;
  const prevYearData = yearlyData.find((y) => y.year === prevYear);
  const currentYearData = yearlyData.find((y) => y.year === year);

  const growth =
    prevYearData && currentYearData && prevYearData.total !== 0
      ? ((currentYearData.total - prevYearData.total) /
          prevYearData.total) *
        100
      : 0;

  /* ========================= INSIGHT ========================= */
  const generateInsight = () => {
    if (!monthlyData.length) return "No insights available";

    const highest = monthlyData.reduce((a, b) =>
      a.total > b.total ? a : b
    );
    const lowest = monthlyData.reduce((a, b) =>
      a.total < b.total ? a : b
    );

    return `You spent the most in ${new Date(
      0,
      highest.month - 1
    ).toLocaleString("default", {
      month: "long",
    })} (${formatCurrency(highest.total)}) and the least in ${new Date(
      0,
      lowest.month - 1
    ).toLocaleString("default", { month: "long" })}.`;
  };

  /* ========================= PDF ========================= */
  const downloadPDF = async () => {
    const canvas = await html2canvas(containerRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const width = 210;
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("expense-report.pdf");
  };

  /* ========================= CHART OPTIONS ========================= */
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: "#6b7c93" },
        grid: { display: false },
      },
      y: {
        ticks: {
          color: "#6b7c93",
          callback: (v) => `₹${v}`,
        },
        grid: {
          color: "rgba(255,255,255,0.05)",
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => formatCurrency(ctx.parsed.y),
        },
      },
    },
  };

  const gradient = (ctx, c1, c2) => {
    const { chart } = ctx;
    const { ctx: c, chartArea } = chart;
    if (!chartArea) return c1;

    const g = c.createLinearGradient(0, 0, 0, chartArea.bottom);
    g.addColorStop(0, c1);
    g.addColorStop(1, c2);
    return g;
  };

  /* ========================= CHART DATA ========================= */
  const monthlyChart = {
    labels: monthlyData.map((d) =>
      new Date(0, d.month - 1).toLocaleString("default", {
        month: "short",
      })
    ),
    datasets: [
      {
        data: monthlyData.map((d) => d.total),
        backgroundColor: (ctx) =>
          gradient(ctx, "#00d4aa", "#4f8ef7"),
        borderRadius: 10,
        barPercentage: 0.6,
      },
    ],
  };

  const yearlyChart = {
    labels: yearlyData.map((d) => d.year),
    datasets: [
      {
        data: yearlyData.map((d) => d.total),
        backgroundColor: (ctx) =>
          gradient(ctx, "#4f8ef7", "#00d4aa"),
        borderRadius: 10,
        barPercentage: 0.6,
      },
    ],
  };

  /* ========================= UI ========================= */
  return (
    <div className="rp-page">
      <div className="rp-container" ref={containerRef}>
        <h1 className="rp-title">Expense Reports</h1>

        {/* STATS */}
        <div className="rp-stats">
          <div className="rp-stat-card">
            <p>This Year</p>
            <div className="rp-stat-value">
              <CountUp end={totalMonthly} prefix="₹" duration={1.5} />
            </div>
          </div>

          <div className="rp-stat-card">
            <p>All-Time</p>
            <div className="rp-stat-value">
              <CountUp end={totalYearly} prefix="₹" duration={1.5} />
            </div>
          </div>

          <div className="rp-stat-card">
            <p>Peak Month</p>
            <div className="rp-stat-value">
              {peakMonth.month
                ? new Date(0, peakMonth.month - 1).toLocaleString("default", { month: "short" })
                : "—"}
            </div>
          </div>

          <div className="rp-stat-card">
            <p>Avg / Month</p>
            <div className="rp-stat-value">
              <CountUp end={avgMonth} prefix="₹" duration={1.5} />
            </div>
          </div>
        </div>

        {/* GROWTH */}
        <div className={`rp-growth ${growth >= 0 ? "up" : "down"}`}>
          {growth >= 0 ? "▲" : "▼"} {Math.abs(growth).toFixed(1)}% vs last year
        </div>

        {/* INSIGHT */}
        <div className="rp-insight">💡 {generateInsight()}</div>

        {/* CHARTS */}
        <div className="rp-charts">
          <div className="rp-chart-card">
            <Bar data={monthlyChart} options={chartOptions} />
          </div>

          <div className="rp-chart-card">
            <Bar data={yearlyChart} options={chartOptions} />
          </div>
        </div>

        {/* BUTTON */}
        <button className="rp-btn" onClick={downloadPDF}>
          Export PDF
        </button>
      </div>
    </div>
  );
}

export default Report;