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
import { getManager } from "../../../api/dashboardApi";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ManagerDashboard() {
  // Dashboard data state
  const [data, setData] = useState({
    librarianCount: 0,
    totalMembers: 0,
    totalCommunityMember: 0,
    currentMonthRevenue: 0,
    planRevenues: [],
    topForumPosts: [],
    predictions: [],
  });

  // Pagination state (one row of 3 posts per page)
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;

  useEffect(() => {
    getManager()
      .then((res) => setData(res))
      .catch((err) => console.error("Error fetching manager data:", err));
  }, []);

  // 1) Prepare Plan Revenues Bar Chart with colors
  const planLabels = data.planRevenues.map((p) => p.PlanName);
  const revenue7 = data.planRevenues.map((p) => parseFloat(p["7_days"]));
  const revenue14 = data.planRevenues.map((p) => parseFloat(p["14_days"]));
  const revenue28 = data.planRevenues.map((p) => parseFloat(p["28_days"]));
  const planChartData = {
    labels: planLabels,
    datasets: [
      {
        label: "7 Days",
        data: revenue7,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "14 Days",
        data: revenue14,
        backgroundColor: "rgba(255, 206, 86, 0.6)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 1,
      },
      {
        label: "28 Days",
        data: revenue28,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };
  const planChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: true, text: "Subscription Plan Revenues" },
      legend: { position: "top" },
    },
  };

  // 2) Determine latest prediction date and prepare bar chart
  const latestDate = data.predictions.reduce((latest, curr) => {
    const d = new Date(curr.PredictedDate);
    return d > latest ? d : latest;
  }, new Date(0));
  const latestData = data.predictions.filter(
    (p) => new Date(p.PredictedDate).getTime() === latestDate.getTime()
  );
  const predLabels = latestData.map((p) => p.SubscriptionPlanName);
  const pred7 = latestData.map((p) => parseFloat(p["7DaysReport"]));
  const pred14 = latestData.map((p) => parseFloat(p["14DaysReport"]));
  const pred28 = latestData.map((p) => parseFloat(p["28DaysReport"]));
  const predChartData = {
    labels: predLabels,
    datasets: [
      {
        label: "7‑Day Report",
        data: pred7,
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
      {
        label: "14‑Day Report",
        data: pred14,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "28‑Day Report",
        data: pred28,
        backgroundColor: "rgba(255, 159, 64, 0.6)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };
  const predChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,

        text: `Subscription Plan Revenues prediction. Latest Predictions: ${latestDate.toLocaleDateString()}`,
      },
      legend: { position: "top" },
    },
  };

  // 3) Pagination logic: slice current page of posts
  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentPosts = data.topForumPosts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(data.topForumPosts.length / postsPerPage);

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Manager Dashboard</h2>

      {/* Top Stats */}
      <div className="row mb-4">
        {[
          { label: "Librarians", value: data.librarianCount, color: "primary" },
          { label: "Members", value: data.totalMembers, color: "success" },
          {
            label: "Community Members",
            value: data.totalCommunityMember,
            color: "info",
          },
          {
            label: "Revenue (This Month)",
            value: `$ ${data.currentMonthRevenue}`,
            color: "warning",
          },
        ].map(({ label, value, color }) => (
          <div key={label} className="col-6 col-md-3 mb-3">
            <div className={`card text-white bg-${color} h-100`}>
              <div className="card-body text-center">
                <h5 className="card-title">{label}</h5>
                <p className="card-text display-6">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="row mb-4">
        {/* Plan Revenues Chart */}
        <div className="col-md-6">
          <div
            className="card p-3"
            style={{ height: 400, position: "relative" }}
          >
            <Bar data={planChartData} options={planChartOptions} />
          </div>
        </div>
        {/* Predictions Chart with latest date in title */}
        <div className="col-md-6">
          <div
            className="card p-3"
            style={{ height: 400, position: "relative" }}
          >
            <Bar data={predChartData} options={predChartOptions} />
          </div>
        </div>
      </div>

      {/* Forum Posts: one row per page */}
      <div className="row row-cols-1 row-cols-md-3 g-3 mb-3">
        {currentPosts.map((post) => (
          <div key={post.ForumPostId} className="col">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{post.Title}</h5>
                <p className="card-text">{post.Description}</p>
              </div>
              <div className="card-footer text-muted">
                Views: {post.PostViews} &nbsp;|&nbsp; by {post.user.name}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Previous
            </button>
          </li>
          {[...Array(totalPages)].map((_, idx) => (
            <li
              key={idx + 1}
              className={`page-item ${currentPage === idx + 1 ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </button>
            </li>
          ))}
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
