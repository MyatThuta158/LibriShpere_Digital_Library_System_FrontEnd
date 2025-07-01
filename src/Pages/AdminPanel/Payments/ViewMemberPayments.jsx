import React, { useEffect, useState } from "react";
import { viewMemberpayment } from "../../../api/subscriptionApi";
import { useNavigate } from "react-router-dom";

const ViewMemberPayments = () => {
  const [payments, setPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState(""); // empty means no filter
  const navigate = useNavigate();

  const fetchPayments = async (page = 1, status = statusFilter) => {
    try {
      const response = await viewMemberpayment(status, page);
      if (response && response.status === 200) {
        setPayments(
          response.data.data.map((payment, index) => ({
            id: (page - 1) * 3 + (index + 1),
            sid: payment.sid,
            date: payment.payment_date || "N/A",
            name: payment.name,
            email: payment.email || "N/A",
            serviceType: payment.payment_type || "N/A",
            status: payment.status || "pending",
            image: payment.memberpic || "/Customer/pic.jpg",
            statusClass:
              payment.status === "pending"
                ? "bg-yellow-200 text-yellow-800"
                : payment.status === "Approved"
                ? "bg-green-200 text-green-800"
                : payment.status === "Rejected"
                ? "bg-red-200 text-red-800"
                : payment.status === "Resubmit"
                ? "bg-blue-200 text-blue-800"
                : "bg-gray-200 text-gray-800",
          }))
        );
        setCurrentPage(response.data.current_page);
        setLastPage(response.data.last_page);
      }
    } catch (error) {
      console.error("Error fetching payment data:", error);
    }
  };

  useEffect(() => {
    fetchPayments(currentPage, statusFilter);
  }, [currentPage, statusFilter]);

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Invoices</h2>
      <p className="text-gray-500 mb-6 w-75">Payment History</p>

      {/* Filter Drop-down */}
      <div className="mb-4">
        <label className="me-2 font-medium">Filter by status:</label>
        <select
          className="form-select w-auto d-inline-block"
          value={statusFilter}
          onChange={handleFilterChange}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Resubmit">Resubmit</option>
        </select>
      </div>

      {/* Display message when Resubmit filter is applied but no payments are found */}
      {statusFilter === "Resubmit" && payments.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          There are no resubmit subscription currently
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full w-100 px-5 mx-auto bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">ID Invoice</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Member</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Payment Type</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-200">
                  <td className="px-4 py-3">{`#${payment.id}`}</td>
                  <td className="px-4 py-3">{payment.date}</td>
                  <td className="px-4 py-3 flex items-center">
                    {/* <img
                      src={payment.image}
                      alt="Profile"
                      style={{ width: "5vw", height: "10vh" }}
                      className="rounded-full mr-3"
                    /> */}
                    <div>
                      <p className="font-medium text-center">{payment.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">{payment.email}</td>
                  <td className="px-4 py-3">{payment.serviceType}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 badge rounded-full text-sm ${
                        payment.status === "pending"
                          ? "text-bg-warning"
                          : payment.status === "Approved"
                          ? "text-bg-success"
                          : payment.status === "Rejected"
                          ? "text-bg-danger"
                          : payment.status === "Resubmit"
                          ? "text-bg-info"
                          : "text-bg-secondary"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {payment.status === "Rejected" ? (
                      <button
                        className="btn btn-danger px-4"
                        onClick={() =>
                          navigate(`/Admin/DetailPayments/${payment.sid}`)
                        }
                      >
                        Reject Detail
                      </button>
                    ) : payment.status === "Approved" ? (
                      <button
                        className="btn btn-success px-4"
                        onClick={() =>
                          navigate(`/Admin/DetailPayments/${payment.sid}`)
                        }
                      >
                        Accept Detail
                      </button>
                    ) : payment.status === "Resubmit" ? (
                      <button
                        className="btn btn-info px-4"
                        onClick={() =>
                          navigate(`/Admin/DetailPayments/${payment.sid}`)
                        }
                      >
                        Resubmit Detail
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary px-4"
                        onClick={() =>
                          navigate(`/Admin/DetailPayments/${payment.sid}`)
                        }
                      >
                        Detail
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div
        className="flex mx-auto justify-center mt-4"
        style={{ width: "30%" }}
      >
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 mx-1">{`Page ${currentPage} of ${lastPage}`}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, lastPage))}
          disabled={currentPage === lastPage}
          className="px-4 py-2 mx-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ViewMemberPayments;
