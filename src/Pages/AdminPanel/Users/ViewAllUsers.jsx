import React, { useEffect, useState } from "react";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { getallUser, resetPassword } from "../../../api/memberApi"; // Adjust the import path as needed

function ViewAllUsers() {
  const [initialUsers, setInitialUsers] = useState([]); // holds the full user list
  const [users, setUsers] = useState([]); // holds the filtered user list
  const [message, setMessage] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of rows per page
  const navigate = useNavigate();

  // State for reset password modal and alerts
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState("");

  // Fetch all users on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getallUser();
        console.log(userData);
        // Assuming your API returns an object with a property "users"
        const sortedData = _.sortBy(userData.users, ["name"]);
        setUsers(sortedData);
        setInitialUsers(sortedData);
      } catch (err) {
        setMessage(err.toString());
      }
    };

    fetchData();
  }, []);

  // Filter users by email whenever the search value changes
  useEffect(() => {
    if (searchValue) {
      const filteredUsers = initialUsers.filter((user) =>
        user.email.toLowerCase().includes(searchValue.toLowerCase())
      );
      setUsers(filteredUsers);
      setCurrentPage(1); // Reset to first page when search changes
    } else {
      setUsers(initialUsers);
    }
  }, [searchValue, initialUsers]);

  // Calculate pagination indices
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  // Compute pagination buttons with a maximum number to display
  const maxPageButtons = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  let endPage = startPage + maxPageButtons - 1;
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // Handler for page changes
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Open reset modal for a specific user
  const handleResetClick = (user) => {
    setSelectedUser(user);
    setNewPassword("");
    setResetError("");
    setShowResetModal(true);
  };

  // Submit new password for reset
  const handleResetSubmit = async () => {
    try {
      // The API expects new_password in the request data
      const data = { new_password: newPassword };
      await resetPassword(selectedUser.id, data);
      setShowResetModal(false);
      setResetSuccess(true);
      // Optionally, auto-hide success alert after a few seconds:
      setTimeout(() => setResetSuccess(false), 3000);
    } catch (error) {
      setResetError("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="container-fluid h-100">
      <h1 className="text-center fs-2 text-bolder">All Users</h1>

      {/* Success Alert */}
      {resetSuccess && (
        <div
          className="alert alert-success alert-dismissible fade show"
          role="alert"
        >
          Password reset successfully!
          <button
            type="button"
            className="close"
            onClick={() => setResetSuccess(false)}
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )}

      {/* Error Alert */}
      {resetError && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          {resetError}
          <button
            type="button"
            className="close"
            onClick={() => setResetError("")}
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )}

      {/* Search form for filtering users by email */}
      <div className="d-flex w-100 justify-content-center my-3">
        <div className="input-group w-50">
          <span
            className="input-group-text bg-white border-end-0"
            style={{ borderRadius: "8px 0 0 8px" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-search"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search Users by Email..."
            className="form-control border-start-0"
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ borderRadius: "0 8px 8px 0" }}
          />
        </div>
      </div>

      {users && users.length > 0 ? (
        <>
          <div
            className="table-responsive"
            style={{ overflowY: "auto", height: "47vh" }}
          >
            <table className="table table-striped table-bordered">
              <thead
                className="thead-dark"
                style={{ position: "sticky", top: "0" }}
              >
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
                  <tr key={user.id || index}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone_number}</td>
                    <td>
                      <button
                        className="btn btn-warning mx-2"
                        style={{ borderRadius: "8px" }}
                        onClick={() => handleResetClick(user)}
                      >
                        Reset Password
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          <nav>
            <ul className="pagination justify-content-center">
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
              {pageNumbers.map((pageNumber) => (
                <li
                  key={pageNumber}
                  className={`page-item ${
                    currentPage === pageNumber ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
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
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </>
      ) : (
        <h1 className="text-center fs-2 text-bolder">No Users Data</h1>
      )}

      {message && <div className="alert alert-danger">{message}</div>}

      {/* Reset Password Modal */}
      {showResetModal && selectedUser && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Reset Password for {selectedUser.name}
                </h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowResetModal(false)}
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowResetModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleResetSubmit}
                >
                  Reset Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewAllUsers;
