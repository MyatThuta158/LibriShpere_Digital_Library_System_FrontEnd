import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  detailInfoPayment,
  changeStatus,
  cancelSubscripiton,
} from "../../../api/subscriptionApi";

function DetailMemberPayment() {
  const { id } = useParams(); // Get subscription ID from URL
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    detailInfoPayment(id).then((res) => {
      setData(res.data);
    });

    console.log(data);
  }, [id]);

  // Generic function to handle status change (for Approve/Reject)
  const handleStatusChange = async (status, additionalPayload = {}) => {
    setLoading(true);
    const payload = { payment_status: status, ...additionalPayload };
    try {
      const res = await changeStatus(id, payload);
      console.log(res);
      if (res.status === 200) {
        setSuccessMessage(`Payment status updated to ${status}`);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setErrorMessage("Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle subscription cancellation
  const handleCancelClick = () => {
    setLoading(true);
    cancelSubscripiton(id)
      .then((res) => {
        console.log(res);
        setSuccessMessage("Subscription cancelled successfully");
      })
      .catch((error) => {
        console.error("Error cancelling subscription:", error);
        setErrorMessage("Failed to cancel subscription.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // When Reject button is clicked, show the reject modal
  const handleRejectClick = () => {
    setShowRejectModal(true);
  };

  // When the admin submits the reject modal, validate and call the API
  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) {
      alert("Rejection reason is required");
      return;
    }
    setShowRejectModal(false);
    handleStatusChange("Rejected", { notification_description: rejectReason });
    // Clear the rejection reason after submission
    setRejectReason("");
  };

  // For Approved, directly update the status
  const handleApproveClick = () => {
    handleStatusChange("Approved");
  };

  // Close success modal and navigate back
  const closeSuccessModal = () => {
    setSuccessMessage("");
    navigate(-1);
  };

  // Close error modal
  const closeErrorModal = () => {
    setErrorMessage("");
  };

  if (!data) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Subscription & Payment Details</h2>
      <div className="row">
        {/* User Information */}
        <div className="col-md-6">
          <div className="card shadow-lg mb-4">
            <div className="card-header bg-primary text-white">
              Member Information
            </div>
            <div className="card-body">
              <p>
                <strong>Name:</strong> {data.user.name}
              </p>
              <p>
                <strong>Email:</strong> {data.user.email}
              </p>
              <p>
                <strong>Phone:</strong> {data.user.phone_number || "N/A"}
              </p>
              {data.user.profile_pic ? (
                <img
                  src={data.user.profile_pic}
                  alt="Profile"
                  className="img-fluid rounded"
                  style={{ maxWidth: "100px" }}
                />
              ) : (
                <p className="text-muted">No Profile Picture</p>
              )}
            </div>
          </div>

          {/* Subscription Details */}
          <div className="card shadow-lg">
            <div className="card-header bg-dark text-white">
              Subscription Details
            </div>
            <div className="card-body">
              <p>
                <strong>Subscription ID:</strong> {data.subscription_id}
              </p>
              <p>
                <strong>Membership Plan ID:</strong> {data.membership_plan_id}
              </p>
              <p>
                <strong>Member Start Date:</strong> {data.member_start_date}
              </p>
              <p>
                <strong>Member End Date:</strong> {data.member_end_date}
              </p>
              {/* Conditionally render the button group if payment status is not Rejected or Approved */}
              {!(
                data.payment.payment_status === "Rejected" ||
                data.payment.payment_status === "Approved"
              ) && (
                <div className="d-flex flex-wrap gap-2">
                  <button
                    className="btn btn-success"
                    onClick={handleApproveClick}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Accept"}
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleRejectClick}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Reject"}
                  </button>
                  <button
                    className="btn btn-warning"
                    onClick={handleCancelClick}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Cancel"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="col-md-6">
          <div className="card shadow-lg mb-4">
            <div className="card-header bg-success text-white">
              Payment Information
            </div>
            <div className="card-body">
              <p>
                <strong>Payment Type:</strong> {data.payment.payment_type}
              </p>
              <p>
                <strong>Account Name:</strong>{" "}
                {data.payment.payment_account_name}
              </p>
              <p>
                <strong>Account Number:</strong>{" "}
                {data.payment.payment_account_number}
              </p>
              <p>
                <strong>Payment Date:</strong> {data.payment.payment_date}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`badge ${
                    data.payment.payment_status === "Pending"
                      ? "bg-warning text-dark"
                      : data.payment.payment_status === "Approved"
                      ? "bg-success"
                      : "bg-danger"
                  }`}
                >
                  {data.payment.payment_status}
                </span>
              </p>
              {data.payment.payment_screenshot && (
                <div>
                  <strong>Payment Screenshot:</strong>
                  <img
                    src={`http://127.0.0.1:8000/storage/${data.payment.payment_screenshot}`}
                    alt="Payment Screenshot"
                    className="img-fluid d-block rounded mt-2"
                    style={{ maxWidth: "100%", height: "30vh" }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bootstrap Modal for Rejection Reason */}
      <div
        className={`modal fade ${showRejectModal ? "show" : ""}`}
        style={{ display: showRejectModal ? "block" : "none" }}
        tabIndex="-1"
        role="dialog"
        aria-hidden={!showRejectModal}
      >
        <div className="modal-dialog" role="document" style={{ zIndex: 1050 }}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Enter Rejection Reason</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowRejectModal(false)}
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <textarea
                className="form-control"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter reason here..."
                rows={3}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleRejectSubmit}
                disabled={loading}
              >
                {loading ? "Processing..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {showRejectModal && (
        <div
          className="modal-backdrop fade show"
          style={{ zIndex: 1040 }}
        ></div>
      )}

      {/* Success Message Modal */}
      {successMessage && (
        <>
          <div
            className="modal fade show"
            style={{ display: "block" }}
            tabIndex="-1"
            role="dialog"
            aria-hidden="false"
          >
            <div className="modal-dialog" style={{ zIndex: 1050 }}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Success</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeSuccessModal}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <p>{successMessage}</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={closeSuccessModal}
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1040 }}
          ></div>
        </>
      )}

      {/* Error Message Modal */}
      {errorMessage && (
        <>
          <div
            className="modal fade show"
            style={{ display: "block" }}
            tabIndex="-1"
            role="dialog"
            aria-hidden="false"
          >
            <div className="modal-dialog" style={{ zIndex: 1050 }}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Error</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeErrorModal}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <p>{errorMessage}</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={closeErrorModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1040 }}
          ></div>
        </>
      )}
    </div>
  );
}

export default DetailMemberPayment;
