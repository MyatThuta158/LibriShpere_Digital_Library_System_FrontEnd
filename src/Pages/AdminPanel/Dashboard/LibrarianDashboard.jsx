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
import { useNavigate } from "react-router-dom";
import { getLibrarian } from "../../../api/dashboardApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function LibrarianDashboard() {
  const [dashboardData, setDashboardData] = useState({
    pendingSubscriptions: 0,
    totalUsers: 0,
    totalResources: 0,
    pendingBookRequests: 0,
    subscriptions: [],
    topResources: [],
    allResourcesByViews: [],
  });
  const [statusFilter, setStatusFilter] = useState("");
  const [currentSubPage, setCurrentSubPage] = useState(1);
  const [currentResPage, setCurrentResPage] = useState(1);
  const itemsPerPage = 3;
  const resPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    getLibrarian()
      .then((data) => setDashboardData(data))
      .catch((err) => console.error("Error fetching dashboard:", err));
  }, []);

  // Subscription filtering & pagination
  const filteredSubscriptions = dashboardData.subscriptions.filter((sub) =>
    statusFilter
      ? sub.PaymentStatus.toLowerCase() === statusFilter.toLowerCase()
      : true
  );
  const totalSubPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);
  const currentSubscriptions = filteredSubscriptions.slice(
    (currentSubPage - 1) * itemsPerPage,
    currentSubPage * itemsPerPage
  );

  // Resources pagination
  const totalResPages = Math.ceil(
    dashboardData.allResourcesByViews.length / resPerPage
  );
  const currentResources = dashboardData.allResourcesByViews.slice(
    (currentResPage - 1) * resPerPage,
    currentResPage * resPerPage
  );

  // Chart configuration
  const chartData = {
    labels: dashboardData.topResources.map((r) => r.name),
    datasets: [
      {
        label: "Views",
        data: dashboardData.topResources.map((r) => r.MemberViewCount),
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Top 10 Resource Views" },
    },
  };

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentSubPage(1);
  };

  const handleAction = (sub) => {
    const base = "/Admin";
    const routes = {
      Rejected: `/Admin/DetailPayments/${sub.id}`,
      Approved: `/Admin/DetailPayments/${sub.id}`,
      Resubmit: `/Admin/DetailPayments/${sub.id}`,
      default: `/Admin/DetailPayments/${sub.id}`,
    };
    navigate(routes[sub.PaymentStatus] || routes.default);
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Librarian Dashboard</h2>
      {/* Stats Cards */}
      <div className="row mb-4">
        {[
          {
            label: "Pending Subs",
            value: dashboardData.pendingSubscriptions,
            color: "warning",
          },
          {
            label: "Total Users",
            value: dashboardData.totalUsers,
            color: "primary",
          },
          {
            label: "Resources",
            value: dashboardData.totalResources,
            color: "info",
          },
          {
            label: "Book Requests",
            value: dashboardData.pendingBookRequests,
            color: "success",
          },
        ].map(({ label, value, color }) => (
          <div key={label} className="col-6 col-md-3 mb-3">
            <div className={`card text-white bg-${color} h-100`}>
              <div className="card-body">
                <h5 className="card-title">{label}</h5>
                <p className="card-text display-6">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Subscription Table & Filter */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex mb-2 align-items-center">
            <label className="me-2">Filter Subs:</label>
            <select
              className="form-select w-auto"
              value={statusFilter}
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Resubmit">Resubmit</option>
              <option value="active">Active</option>
            </select>
          </div>
          {filteredSubscriptions.length === 0 ? (
            <p className="text-center text-muted py-4">
              {statusFilter
                ? `No subscriptions for "${statusFilter}"`
                : "No subscriptions found."}
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th># Invoice</th>
                    <th>Date</th>
                    <th>Member</th>
                    <th>Email</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentSubscriptions.map((sub) => (
                    <tr key={sub.id}>
                      <td>#{sub.id}</td>
                      <td>{sub.PaymentDate || "N/A"}</td>
                      <td className="d-flex align-items-center">
                        <img
                          src={
                            sub.user?.ProfilePic
                              ? `http://127.0.0.1:8000/storage/${sub.user.ProfilePic}`
                              : "/Customer/pic.jpg"
                          }
                          alt="Profile"
                          className="rounded-circle me-2"
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                          }}
                        />
                        {sub.user?.name}
                      </td>
                      <td>{sub.user?.email || "N/A"}</td>
                      <td>{sub.payment_type?.PaymentTypeName || "N/A"}</td>
                      <td>
                        <span className={`badge bg-primary`}>
                          {sub.PaymentStatus}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleAction(sub)}
                        >
                          View Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* Subscription Pagination */}
          <nav className="d-flex justify-content-center mt-2">
            <ul className="pagination">
              <li
                className={`page-item ${
                  currentSubPage === 1 ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentSubPage((p) => Math.max(p - 1, 1))}
                >
                  &laquo;
                </button>
              </li>
              <li className="page-item disabled">
                <span className="page-link">
                  {currentSubPage} / {totalSubPages}
                </span>
              </li>
              <li
                className={`page-item ${
                  currentSubPage === totalSubPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() =>
                    setCurrentSubPage((p) => Math.min(p + 1, totalSubPages))
                  }
                >
                  &raquo;
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Chart and All Resources Table */}
      <div className="row">
        <div className="col-lg-6 mb-4">
          <div className="card p-3 h-100">
            <Bar options={chartOptions} data={chartData} />
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card p-3">
            <h5>All Resources by Views</h5>
            <div className="table-responsive">
              <table className="table table-sm table-striped align-middle">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Views</th>
                  </tr>
                </thead>
                <tbody>
                  {currentResources.map((res, idx) => (
                    <tr key={res.id}>
                      <td>{(currentResPage - 1) * resPerPage + idx + 1}</td>
                      <td>{res.name}</td>
                      <td>{res.MemberViewCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <nav className="d-flex justify-content-center mt-2">
              <ul className="pagination">
                <li
                  className={`page-item ${
                    currentResPage === 1 ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentResPage((p) => Math.max(p - 1, 1))}
                  >
                    Prev
                  </button>
                </li>
                <li className="page-item disabled">
                  <span className="page-link">
                    {currentResPage} / {totalResPages}
                  </span>
                </li>
                <li
                  className={`page-item ${
                    currentResPage === totalResPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      setCurrentResPage((p) => Math.min(p + 1, totalResPages))
                    }
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LibrarianDashboard;
