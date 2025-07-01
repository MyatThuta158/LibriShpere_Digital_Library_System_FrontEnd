import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { TotalFinancialReport } from "../../../api/reportApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function TotalRevenueReport() {
  // State for report type and filters.
  const [reportType, setReportType] = useState("12_months");
  const [weeklyPeriod, setWeeklyPeriod] = useState("7_days");
  const [monthlyYear, setMonthlyYear] = useState(new Date().getFullYear());
  const [monthlyMonth, setMonthlyMonth] = useState(new Date().getMonth() + 1);
  const [yearlyYear, setYearlyYear] = useState(new Date().getFullYear());
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  // Build query parameters for the API call.
  const buildParams = () => {
    let params = { period: reportType, year: null, month: null };
    if (reportType === "weekly") {
      params.period = weeklyPeriod;
    }
    if (reportType === "monthly") {
      params.year = monthlyYear;
      params.month = monthlyMonth;
    }
    if (reportType === "yearly") {
      params.year = yearlyYear;
    }
    return params;
  };

  const fetchReportData = async () => {
    try {
      const { period, year, month } = buildParams();
      const response = await TotalFinancialReport(period, year, month);
      const data = response;

      console.log(data);

      if (!data || data.length === 0) {
        setChartData({ labels: [], datasets: [] });
        return;
      }

      // Decide which label key to use based on the report type.
      const labelKey =
        reportType === "yearly" || reportType === "12_months"
          ? "PaymentMonth"
          : "PaymentDate";

      // Get the x-axis labels from the API response.
      const labels = data.map((entry) => entry[labelKey]);

      // Build a single dataset for revenue where each data point is the revenue for that day/month.
      const revenueData = data.map((entry) => entry.total);

      const dataset = {
        label: "Revenue",
        data: revenueData,
        backgroundColor: "#36A2EB",
        borderColor: "#36A2EB",
        borderWidth: 1,
      };

      setChartData({ labels, datasets: [dataset] });
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    }
  };

  // Fetch data whenever the selection states change.
  useEffect(() => {
    fetchReportData();
  }, [reportType, weeklyPeriod, monthlyYear, monthlyMonth, yearlyYear]);

  return (
    <div>
      <h2>Revenue Report</h2>
      <div>
        <label>Select Report Type: </label>
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
          <option value="12_months">Last 12 Months</option>
        </select>
      </div>
      {reportType === "weekly" && (
        <div>
          <label>Select Weekly Option: </label>
          <select
            value={weeklyPeriod}
            onChange={(e) => setWeeklyPeriod(e.target.value)}
          >
            <option value="7_days">Last 7 Days</option>
            <option value="14_days">Last 14 Days</option>
            <option value="28_days">Last 28 Days</option>
          </select>
        </div>
      )}
      {reportType === "monthly" && (
        <div>
          <label>Select Year: </label>
          <select
            value={monthlyYear}
            onChange={(e) => setMonthlyYear(e.target.value)}
          >
            {[...Array(5)].map((_, i) => {
              const yearVal = new Date().getFullYear() - i;
              return (
                <option key={i} value={yearVal}>
                  {yearVal}
                </option>
              );
            })}
          </select>
          <label>Select Month: </label>
          <select
            value={monthlyMonth}
            onChange={(e) => setMonthlyMonth(e.target.value)}
          >
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i + 1}>
                {new Date(0, i).toLocaleString("en", { month: "long" })}
              </option>
            ))}
          </select>
        </div>
      )}
      {reportType === "yearly" && (
        <div>
          <label>Select Year: </label>
          <select
            value={yearlyYear}
            onChange={(e) => setYearlyYear(e.target.value)}
          >
            {[...Array(5)].map((_, i) => {
              const yearVal = new Date().getFullYear() - i;
              return (
                <option key={i} value={yearVal}>
                  {yearVal}
                </option>
              );
            })}
          </select>
        </div>
      )}
      <div style={{ height: "60vh", width: "100vw" }}>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: "Revenue Report" },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    let label = context.dataset.label || "";
                    if (label) {
                      label += ": ";
                    }
                    if (context.parsed.y !== null) {
                      label += "$" + context.parsed.y;
                    }
                    return label;
                  },
                },
              },
            },
            scales: {
              y: {
                ticks: {
                  callback: function (value) {
                    return "$" + value;
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default TotalRevenueReport;
