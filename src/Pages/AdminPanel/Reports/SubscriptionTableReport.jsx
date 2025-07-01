import React, { useState, useEffect } from "react";
import { SubscriptionTableReport as fetchSubs } from "../../../api/reportApi";

// --- Pagination Helper (in the same file) ---
const DOTS = "DOTS";

function getPaginationRange({
  totalCount,
  pageSize,
  siblingCount = 1,
  currentPage,
}) {
  const totalPageCount = Math.ceil(totalCount / pageSize);
  const totalPageNumbers = siblingCount * 2 + 5;

  // No need for dots if the number of pages is small
  if (totalPageNumbers >= totalPageCount) {
    return Array.from({ length: totalPageCount }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(
    currentPage + siblingCount,
    totalPageCount
  );

  const showLeftDots = leftSiblingIndex > 2;
  const showRightDots = rightSiblingIndex < totalPageCount - 2;

  const pages = [];

  if (!showLeftDots && showRightDots) {
    // No left dots, but show right dots
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    pages.push(...leftRange, DOTS, totalPageCount);
  } else if (showLeftDots && !showRightDots) {
    // Show left dots, no right dots
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPageCount - rightItemCount + 1 + i
    );
    pages.push(1, DOTS, ...rightRange);
  } else if (showLeftDots && showRightDots) {
    // Both sides have dots
    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i
    );
    pages.push(1, DOTS, ...middleRange, DOTS, totalPageCount);
  }

  return pages;
}

// --- Main Component ---
const SubscriptionTableReport = () => {
  // --- Filter state ---
  const [period, setPeriod] = useState("7_days");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  // --- Data & pagination meta state ---
  const [rows, setRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0); // total items from API
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Fetch data on filter or page change ---
  useEffect(() => {
    setLoading(true);
    setError(null);

    const yParam = period === "monthly" || period === "yearly" ? year : null;
    const mParam = period === "monthly" ? month : null;

    fetchSubs(period, yParam, mParam, currentPage)
      .then((response) => {
        setRows(response.data);
        setCurrentPage(response.current_page);
        setLastPage(response.last_page);
        setTotalCount(response.total); // assume API returns total count
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load subscriptions");
        setLoading(false);
      });
  }, [period, year, month, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  // --- Pagination range config ---
  const pageSize = Math.ceil(totalCount / lastPage) || 10; // derive pageSize if needed
  const paginationRange = getPaginationRange({
    totalCount,
    pageSize,
    siblingCount: 1,
    currentPage,
  });

  return (
    <div className="container-fluid py-3">
      <h2 className="text-center mb-4">Subscription Table Report</h2>

      {/* Filters */}
      <div className="d-flex flex-wrap justify-content-center mb-3 gap-2">
        <select
          className="form-select w-auto"
          value={period}
          onChange={(e) => {
            setPeriod(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="7_days">Last 7 Days</option>
          <option value="14_days">Last 14 Days</option>
          <option value="28_days">Last 28 Days</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>

        {period === "monthly" && (
          <>
            <select
              className="form-select w-auto"
              value={year}
              onChange={(e) => {
                setYear(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {[...Array(5)].map((_, i) => {
                const y = new Date().getFullYear() - i;
                return (
                  <option key={y} value={y}>
                    {y}
                  </option>
                );
              })}
            </select>
            <select
              className="form-select w-auto"
              value={month}
              onChange={(e) => {
                setMonth(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {new Date(0, m - 1).toLocaleString("default", {
                    month: "long",
                  })}
                </option>
              ))}
            </select>
          </>
        )}

        {period === "yearly" && (
          <select
            className="form-select w-auto"
            value={year}
            onChange={(e) => {
              setYear(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {[...Array(5)].map((_, i) => {
              const y = new Date().getFullYear() - i;
              return (
                <option key={y} value={y}>
                  {y}
                </option>
              );
            })}
          </select>
        )}
      </div>

      {loading && <p className="text-center">Loading…</p>}
      {error && <p className="text-danger text-center">{error}</p>}

      {!loading && !error && (
        <>
          <div className="table-responsive" style={{ maxHeight: "60vh" }}>
            <table className="table table-striped table-bordered">
              <thead
                className="table-dark"
                style={{ position: "sticky", top: 0, zIndex: 1 }}
              >
                <tr>
                  {/* <th>ID</th> */}
                  <th>User</th>
                  <th>Plan</th>
                  <th>Subscribe Date</th>
                  <th>Payment Status</th>
                  <th>Subscription Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((sub) => (
                  <tr key={sub.id}>
                    {/* <td>{sub.id}</td> */}
                    <td>
                      {sub.user.name} ({sub.user.email})
                    </td>
                    <td>{sub.membership_plan.PlanName}</td>
                    <td>{sub.PaymentDate}</td>
                    <td>{sub.PaymentStatus}</td>
                    <td>{sub.SubscriptionStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Collapsed Pagination */}
          <nav>
            <ul className="pagination justify-content-center mt-3">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </button>
              </li>

              {paginationRange.map((page, idx) =>
                page === DOTS ? (
                  <li key={idx} className="page-item disabled">
                    <span className="page-link">…</span>
                  </li>
                ) : (
                  <li
                    key={idx}
                    className={`page-item ${
                      page === currentPage ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  </li>
                )
              )}

              <li
                className={`page-item ${
                  currentPage === lastPage ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </>
      )}
    </div>
  );
};

export default SubscriptionTableReport;
