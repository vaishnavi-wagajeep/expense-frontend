import { useEffect, useState } from "react";
import axios from "axios";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
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

function Report() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // ================= FETCH DATA =================
  useEffect(() => {
    if (!token) {
      setError("User not logged in");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const [monthlyRes, yearlyRes] = await Promise.all([
          axios.get(
            `http://localhost:5000/report/monthly?year=${year}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.get(
            `http://localhost:5000/report/yearly`,
            { headers: { Authorization: `Bearer ${token}` } }
          )
        ]);

        setMonthlyData(monthlyRes.data || []);
        setYearlyData(yearlyRes.data || []);
      } catch (err) {
        console.log(err);
        setError("Failed to load report data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year]);

  // ================= PDF DOWNLOAD =================
  const downloadPDF = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/report/pdf",
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "expense-report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.log(err);
      alert("PDF download failed");
    }
  };

  // ================= CHART DATA =================
  const monthlyChart = {
    labels: monthlyData.map((d) =>
      new Date(0, d.month - 1).toLocaleString("default", { month: "short" })
    ),
    datasets: [
      {
        label: "Monthly Expense",
        data: monthlyData.map((d) => d.total),
        backgroundColor: "#7c3aed"
      }
    ]
  };

  const yearlyChart = {
    labels: yearlyData.map((d) => d.year),
    datasets: [
      {
        label: "Yearly Expense",
        data: yearlyData.map((d) => d.total),
        backgroundColor: "#22c55e"
      }
    ]
  };

  return (
    <div style={{
      padding: "20px",
      background: "#0f172a",
      minHeight: "100vh",
      color: "white"
    }}>

      <h1>📊 Expense Reports</h1>

      {/* YEAR SELECTOR */}
      <div style={{ marginBottom: "20px" }}>
        <label>Select Year: </label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        />
      </div>

      {/* PDF BUTTON */}
      <button
        onClick={downloadPDF}
        style={{
          padding: "10px 15px",
          marginBottom: "20px",
          background: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        📄 Download PDF Report
      </button>

      {/* ERROR */}
      {error && (
        <p style={{ color: "red" }}>{error}</p>
      )}

      {/* LOADING */}
      {loading ? (
        <p>Loading reports...</p>
      ) : (
        <>
          {/* MONTHLY */}
          <div style={{ width: "600px", marginBottom: "50px" }}>
            <h2>Monthly Report</h2>

            {monthlyData.length === 0 ? (
              <p>No monthly data</p>
            ) : (
              <Bar data={monthlyChart} />
            )}
          </div>

          {/* YEARLY */}
          <div style={{ width: "600px" }}>
            <h2>Yearly Report</h2>

            {yearlyData.length === 0 ? (
              <p>No yearly data</p>
            ) : (
              <Bar data={yearlyChart} />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Report;