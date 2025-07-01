import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { deletePayment, allPaymentTypes } from "../../../api/paymenttypeApi";

function AllPayment_Types() {
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const navigate = useNavigate();

  // Function to fetch paginated data
  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const response = await allPaymentTypes(page);
      // Adjusted for the expected API response structure:
      setPaymentTypes(response.data); // the array of payment types
      setCurrentPage(response.current_page);
      setLastPage(response.last_page);
    } catch (error) {
      console.error("Error fetching payment types", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  // Trigger the confirm delete modal
  const confirmDeletePayment = (id) => {
    setDeleteId(id);
    setConfirmDelete(true);
  };

  // Delete a payment type and refresh the data
  const deletePaymentItem = async () => {
    try {
      const response = await deletePayment(deleteId);
      if (response.status === 200) {
        fetchData(currentPage);
        setDeleteSuccess(true); // show success modal
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
    setDeleteId(null);
  };

  // Navigate to the update page for a payment type
  const handleUpdate = (id) => {
    navigate(`/Admin/UpdatePaymentTypes/${id}`);
  };

  // Handler for changing pages
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Payment Types</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table className="table table-striped">
            <thead className="thead-dark">
              <tr>
                <th>ID</th>
                <th>Payment Type Name</th>
                <th>Account Name</th>
                <th>Account Number</th>
                <th>Bank Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paymentTypes.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.id}</td>
                  <td>{payment.PaymentTypeName}</td>
                  <td>{payment.AccountName}</td>
                  <td>{payment.AccountNumber}</td>
                  <td>{payment.BankName}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => handleUpdate(payment.id)}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => confirmDeletePayment(payment.id)}
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
        <div className="modal" style={{ display: "block" }}>
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
                <p>Are you sure you want to delete this payment type?</p>
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
                    deletePaymentItem();
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
                <p>Payment type deleted successfully.</p>
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

export default AllPayment_Types;
