import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { resubmitSubShow, changeStatus } from "../../../api/subscriptionApi";

function ResubmitPayment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setLoading(true);
    resubmitSubShow(id)
      .then((res) => {
        if (res.status === 200) {
          setData(res.data);
        } else {
          setError("Failed to fetch subscription details");
        }
      })
      .catch((err) => {
        console.error("Error fetching subscription details:", err);
        setError("Error fetching subscription details");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleStatusChange = async (status, additionalPayload = {}) => {
    setLoading(true);
    const payload = { payment_status: status, ...additionalPayload };
    try {
      const res = await changeStatus(id, payload);
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

  const handleRejectClick = () => {
    setShowRejectModal(true);
  };

  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) {
      alert("Rejection reason is required");
      return;
    }
    setShowRejectModal(false);
    handleStatusChange("Rejected", { notification_description: rejectReason });
    setRejectReason("");
  };

  const handleApproveClick = () => {
    handleStatusChange("Approved");
  };

  const closeSuccessModal = () => {
    setSuccessMessage("");
    navigate(-1);
  };

  const closeErrorModal = () => {
    setErrorMessage("");
  };

  if (loading && !data) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Resubmit Payment Details</h2>

      <div className="row g-4">
        {/* Left Side: Member Information */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white border-bottom">
              <h5 className="mb-0">Member Information</h5>
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
                <div className="text-center">
                  <img
                    src={data.user.profile_pic}
                    alt="Profile"
                    className="img-fluid rounded mb-2"
                    style={{ maxWidth: "100px" }}
                  />
                </div>
              ) : (
                <p className="text-muted">No Profile Picture</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Payment Information */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white border-bottom">
              <h5 className="mb-0">Payment Information</h5>
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
                  <strong className="d-block">Payment Screenshot:</strong>
                  <img
                    src={`http://127.0.0.1:8000/storage/${data.payment.payment_screenshot}`}
                    alt="Payment Screenshot"
                    className="img-fluid rounded mt-2"
                    style={{ maxWidth: "100%", height: "20vh" }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Details Section */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-secondary text-white border-bottom">
              <h5 className="mb-0">Subscription Details</h5>
            </div>
            <div className="card-body">
              <p>
                <strong>Subscription ID:</strong> {data.subscription_id}
              </p>
              <p>
                <strong>Membership Plan:</strong>{" "}
                {data.membership_plan.PlanName}
              </p>
              <p>
                <strong>Member Start Date:</strong> {data.member_start_date}
              </p>
              <p>
                <strong>Member End Date:</strong> {data.member_end_date}
              </p>
              <div className="mt-3 d-flex gap-2">
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Rejection Reason */}
      <div
        className={`modal fade ${showRejectModal ? "show" : ""}`}
        style={{ display: showRejectModal ? "block" : "none" }}
        tabIndex="-1"
        role="dialog"
        aria-hidden={!showRejectModal}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          role="document"
          style={{ zIndex: 1050 }}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Enter Rejection Reason</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowRejectModal(false)}
                aria-label="Close"
              ></button>
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
            <div
              className="modal-dialog modal-dialog-centered"
              style={{ zIndex: 1050 }}
            >
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
            <div
              className="modal-dialog modal-dialog-centered"
              style={{ zIndex: 1050 }}
            >
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

export default ResubmitPayment;
