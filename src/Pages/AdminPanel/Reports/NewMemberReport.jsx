import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

// Import Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { MemberReport } from "../../../api/reportApi";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const NewMemberReport = () => {
  // Main report type can be: "weekly", "monthly", "yearly", or "12_months"
  const [reportType, setReportType] = useState("12_months");

  // Additional state for weekly, monthly, and yearly options
  const [weeklyPeriod, setWeeklyPeriod] = useState("7_days");
  const [monthlyYear, setMonthlyYear] = useState(new Date().getFullYear());
  const [monthlyMonth, setMonthlyMonth] = useState(new Date().getMonth() + 1); // getMonth() is 0-indexed
  const [yearlyYear, setYearlyYear] = useState(new Date().getFullYear());

  // State to hold chart data
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  // Build parameters for the API call based on current selections
  const buildParams = () => {
    let params = { period: "12_months", year: null, month: null }; // Default

    if (reportType === "weekly") {
      params.period = weeklyPeriod;
    } else if (reportType === "monthly") {
      params.period = "monthly";
      params.year = monthlyYear;
      params.month = monthlyMonth;
    } else if (reportType === "yearly") {
      params.period = "yearly";
      params.year = yearlyYear;
    }

    return params;
  };

  // Async function to fetch report data from the backend
  const fetchReportData = async () => {
    try {
      const { period, year, month } = buildParams();
      const data = await MemberReport(period, year, month);

      let labels = data.labels || [];
      let counts = data.counts || [];

      setChartData({
        labels,
        datasets: [
          {
            label: "New Members",
            data: counts,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching new member data:", error);
    }
  };

  // Fetch data whenever any option changes
  useEffect(() => {
    fetchReportData();
  }, [reportType, weeklyPeriod, monthlyYear, monthlyMonth, yearlyYear]);

  // Create an array of the last 5 years for selection
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // Array of month options
  const monthOptions = [
    { value: 1, name: "January" },
    { value: 2, name: "February" },
    { value: 3, name: "March" },
    { value: 4, name: "April" },
    { value: 5, name: "May" },
    { value: 6, name: "June" },
    { value: 7, name: "July" },
    { value: 8, name: "August" },
    { value: 9, name: "September" },
    { value: 10, name: "October" },
    { value: 11, name: "November" },
    { value: 12, name: "December" },
  ];

  return (
    <div>
      <h2>New User Report</h2>

      {/* Main Report Type Selection */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="report-type-select" style={{ marginRight: "10px" }}>
          Select Report Type:
        </label>
        <select
          id="report-type-select"
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
          <option value="12_months">Last 12 Months</option>
        </select>
      </div>

      {/* Weekly Selection: Only show when "Weekly" is selected */}
      {reportType === "weekly" && (
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="weekly-select" style={{ marginRight: "10px" }}>
            Select Weekly Option:
          </label>
          <select
            id="weekly-select"
            value={weeklyPeriod}
            onChange={(e) => setWeeklyPeriod(e.target.value)}
          >
            <option value="7_days">Last 7 Days</option>
            <option value="14_days">Last 14 Days</option>
            <option value="28_days">Last 28 Days</option>
          </select>
        </div>
      )}

      {/* Monthly Selection: Only show when "Monthly" is selected */}
      {reportType === "monthly" && (
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="monthly-year-select" style={{ marginRight: "10px" }}>
            Select Year:
          </label>
          <select
            id="monthly-year-select"
            value={monthlyYear}
            onChange={(e) => setMonthlyYear(e.target.value)}
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <label
            htmlFor="monthly-month-select"
            style={{ marginLeft: "20px", marginRight: "10px" }}
          >
            Select Month:
          </label>
          <select
            id="monthly-month-select"
            value={monthlyMonth}
            onChange={(e) => setMonthlyMonth(e.target.value)}
          >
            {monthOptions.map((month) => (
              <option key={month.value} value={month.value}>
                {month.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Yearly Selection: Only show when "Yearly" is selected */}
      {reportType === "yearly" && (
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="yearly-year-select" style={{ marginRight: "10px" }}>
            Select Year:
          </label>
          <select
            id="yearly-year-select"
            value={yearlyYear}
            onChange={(e) => setYearlyYear(e.target.value)}
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="" style={{ height: "60vh", width: "100vw" }}>
        <Bar data={chartData} options={{ responsive: true }} />
      </div>
    </div>
  );
};

export default NewMemberReport;
