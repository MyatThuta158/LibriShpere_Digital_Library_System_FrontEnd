import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllMembership, deleteMembership } from "../../../api/membershipApi";

function AllMembershipPlan() {
  const [membershipPlans, setMembershipPlans] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const navigate = useNavigate();

  // Fetch paginated data (ensuring 5 items per page via API configuration)
  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const response = await getAllMembership(page);
      setMembershipPlans(response.data);
      setCurrentPage(response.current_page);
      setLastPage(response.last_page);
    } catch (error) {
      console.error("Error fetching membership plans", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  // Navigate to update page
  const handleUpdate = (id) => {
    navigate(`/Admin/UpdateMemberships/${id}`);
  };

  // Trigger delete confirmation modal
  const confirmDeleteMembership = (id) => {
    setDeleteId(id);
    setConfirmDelete(true);
  };

  // Delete membership plan and refresh data
  const deleteMembershipPlanItem = async () => {
    try {
      const response = await deleteMembership(deleteId);
      console.log(response);
      if (response.status === 200) {
        fetchData(currentPage);
        setDeleteSuccess(true);
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
    setDeleteId(null);
  };

  // Change page handler
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= lastPage) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Subscription Plans</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table className="table table-striped">
            <thead className="thead-dark">
              <tr>
                <th>ID</th>
                <th>Plan Name</th>
                <th>Duration</th>
                <th>Price</th>
                {/* <th>Description</th> */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {membershipPlans.map((plan) => (
                <tr key={plan.id}>
                  <td>{plan.id}</td>
                  <td>{plan.PlanName}</td>
                  <td>
                    {plan.Duration} {plan.Duration > 1 ? "Months" : "Month"}
                  </td>

                  <td>${plan.Price}</td>
                  {/* <td>{plan.Description}</td> */}
                  <td>
                    {/* Update button */}
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleUpdate(plan.id)}
                    >
                      Update
                    </button>
                    {/* Delete button placed beside the update button */}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => confirmDeleteMembership(plan.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <nav>
            <ul className="justify-content-center pagination">
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
              {Array.from({ length: lastPage }, (_, index) => (
                <li
                  key={index}
                  className={`page-item ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
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

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div
          className="modal"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setConfirmDelete(false);
                    setDeleteId(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this membership plan?</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setConfirmDelete(false);
                    setDeleteId(null);
                  }}
                >
                  No
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    setConfirmDelete(false);
                    deleteMembershipPlanItem();
                  }}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Success Modal */}
      {deleteSuccess && (
        <div
          className="modal"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Success</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setDeleteSuccess(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Subscription plan deleted successfully.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setDeleteSuccess(false)}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllMembershipPlan;
