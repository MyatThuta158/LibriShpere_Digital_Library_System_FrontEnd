import React, { useEffect, useState } from "react";
import { getAdmin, deleteAdmin as deleteAdminApi } from "../../../api/adminApi";

function ViewAdmins() {
  const [managers, setManagers] = useState([]);
  const [librarians, setLibrarians] = useState([]);
  const [managerPageCount, setManagerPageCount] = useState(0);
  const [librarianPageCount, setLibrarianPageCount] = useState(0);
  const [currentManagerPage, setCurrentManagerPage] = useState(1);
  const [currentLibrarianPage, setCurrentLibrarianPage] = useState(1);
  const [adminid, setAdminid] = useState(null);
  const [flag, setFlag] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  // Example: Retrieve the logged in admin id from localStorage
  // Adjust this part based on how your app stores authentication info.
  const user = JSON.parse(localStorage.getItem("user"));

  const loggedInAdminId = parseInt(user.id);
  console.log(loggedInAdminId);

  // Fetch data for both managers and librarians
  useEffect(() => {
    const fetchData = async () => {
      try {
        const adminsData = await getAdmin(
          currentManagerPage,
          currentLibrarianPage
        );

        // IMPORTANT: Access .data.managers and .data.librarians
        setManagers(adminsData.data.managers?.data || []);
        setLibrarians(adminsData.data.librarians?.data || []);
        setManagerPageCount(adminsData.data.managers?.last_page || 0);
        setLibrarianPageCount(adminsData.data.librarians?.last_page || 0);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, [currentManagerPage, currentLibrarianPage, flag]);

  const handleDeleteAdmin = async () => {
    try {
      const result = await deleteAdminApi(adminid);
      if (result.status === 200) {
        setDeleteSuccess(true);
        setFlag(!flag);
      }
      console.log(result.message);
    } catch (e) {
      console.log(e);
    }
    setAdminid(null);
    setConfirmDelete(false);
  };

  const cancelDelete = () => {
    setAdminid(null);
    setConfirmDelete(false);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">All Admins</h2>
      <div className="container-fluid">
        {/* Managers Table */}
        <h3>Managers</h3>
        <table className="table table-striped">
          <thead className="thead-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {managers.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.id}</td>
                <td>{admin.Name}</td>
                <td>{admin.Email}</td>
                <td>
                  <span
                    className={`badge ${
                      admin.role === "manager"
                        ? "text-bg-primary"
                        : "text-bg-warning"
                    }`}
                  >
                    {admin.role}
                  </span>
                </td>
                <td>
                  {/* Show delete button only if the admin id doesn't match the logged in admin's id */}
                  {admin.id !== loggedInAdminId && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        setAdminid(admin.id);
                        setConfirmDelete(true);
                      }}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Managers Pagination */}
        <nav>
          <ul className="justify-content-center pagination">
            <li
              className={`page-item ${
                currentManagerPage === 1 ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentManagerPage(currentManagerPage - 1)}
              >
                Previous
              </button>
            </li>
            {Array.from({ length: managerPageCount }, (_, index) => (
              <li
                key={index}
                className={`page-item ${
                  currentManagerPage === index + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentManagerPage(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                currentManagerPage === managerPageCount ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentManagerPage(currentManagerPage + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>

        {/* Librarians Table */}
        <h3>Librarians</h3>
        <table className="table table-striped">
          <thead className="thead-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {librarians.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.id}</td>
                <td>{admin.Name}</td>
                <td>{admin.Email}</td>
                <td>
                  <span
                    className={`badge ${
                      admin.role === "librarian"
                        ? "text-bg-warning"
                        : "text-bg-primary"
                    }`}
                  >
                    {admin.role}
                  </span>
                </td>
                <td>
                  {/* Show delete button only if the admin id doesn't match the logged in admin's id */}
                  {admin.id !== loggedInAdminId && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        setAdminid(admin.id);
                        setConfirmDelete(true);
                      }}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Librarians Pagination */}
        <nav>
          <ul className="justify-content-center pagination">
            <li
              className={`page-item ${
                currentLibrarianPage === 1 ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() =>
                  setCurrentLibrarianPage(currentLibrarianPage - 1)
                }
              >
                Previous
              </button>
            </li>
            {Array.from({ length: librarianPageCount }, (_, index) => (
              <li
                key={index}
                className={`page-item ${
                  currentLibrarianPage === index + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentLibrarianPage(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                currentLibrarianPage === librarianPageCount ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() =>
                  setCurrentLibrarianPage(currentLibrarianPage + 1)
                }
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Delete Confirmation Modal */}
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
                  onClick={cancelDelete}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this admin?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={cancelDelete}>
                  No
                </button>
                <button className="btn btn-danger" onClick={handleDeleteAdmin}>
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
                <p>Admin deleted successfully.</p>
              </div>
              <div className="modal-footer">
                <button
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

export default ViewAdmins;
