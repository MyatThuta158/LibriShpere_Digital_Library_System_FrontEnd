import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import {
  getResubmit,
  resubmitSubscription,
  cancelSubscripiton,
} from "../../api/subscriptionApi";
import Menu from "../Layouts/Menu";

function ResubmitPayment() {
  const { id } = useParams();
  const [subscription, setSubscription] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    getResubmit(id)
      .then((data) => {
        setSubscription(data.data);
        reset({
          PaymentAccountName: data.data.payment.payment_account_name,
          PaymentAccountNumber: data.data.payment.payment_account_number,
          PaymentDate: data.data.payment.payment_date,
        });
      })
      .catch((error) => {
        console.error("Error fetching subscription details:", error);
      });
  }, [id, reset]);

  const onSubmit = (formData) => {
    const submissionData = new FormData();
    if (formData.PaymentScreenShot && formData.PaymentScreenShot[0]) {
      submissionData.append("PaymentScreenShot", formData.PaymentScreenShot[0]);
    }
    submissionData.append("PaymentAccountName", formData.PaymentAccountName);
    submissionData.append(
      "PaymentAccountNumber",
      formData.PaymentAccountNumber
    );
    submissionData.append("PaymentDate", formData.PaymentDate);

    resubmitSubscription(id, submissionData)
      .then((res) => {
        if (res.status === 200) {
          setMessage("Subscription updated successfully.");
        }
      })
      .catch((error) => {
        console.error("Error updating subscription:", error);
      });
  };

  const handleCancelPayment = () => {
    // Call the cancel subscription API with the subscription id
    cancelSubscripiton(id)
      .then((res) => {
        // Assuming the API returns a 200 status for successful cancelation.
        setMessage("Subscription canceled successfully.");
      })
      .catch((error) => {
        console.error("Error canceling subscription:", error);
      });
  };

  const handleModalOk = () => {
    setMessage(null);
    navigate("/library/home");
  };

  if (!subscription) return <div className="text-center mt-5">Loading...</div>;

  const baseUrl = import.meta.env.VITE_API_URL;

  return (
    <div>
      <div className="container my-5">
        <h2 className="mb-4 text-center">Resubmit Your Payment</h2>
        {/* First Row: Three Cards */}
        <div className="row">
          {/* Payment Information Card */}
          <div className="col-12 col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-header bg-primary text-white">
                <h5 className="card-title mb-0">
                  Your Subscription Information
                </h5>
              </div>
              <div className="card-body">
                <p>
                  <strong>Payment Date:</strong>{" "}
                  {subscription.payment.payment_date}
                </p>
                <p>
                  <strong>Account Name:</strong>{" "}
                  {subscription.payment.payment_account_name}
                </p>
                <p>
                  <strong>Account Number:</strong>{" "}
                  {subscription.payment.payment_account_number}
                </p>
                <p>
                  <strong>Payment Date:</strong>{" "}
                  {subscription.payment.payment_date}
                </p>
                <p>
                  <strong>Subscribed plan:</strong>{" "}
                  {subscription.membership.PlanName}
                </p>
                <p>
                  <strong>Subscription Price:</strong> $
                  {subscription.membership.Price}
                </p>
                <p>
                  <strong>Subscription Duration:</strong>{" "}
                  {subscription.membership.Duration}{" "}
                  {subscription.membership.Duration > 1 ? "months" : "month"}
                </p>
              </div>
            </div>
          </div>
          {/* Payment Type Card */}
          <div className="col-12 col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-header bg-info text-white">
                <h5 className="card-title mb-0">Payment Type</h5>
              </div>
              <div className="card-body text-center">
                <p className="mb-2">
                  <strong>Payment type:</strong>{" "}
                  {subscription.payment_type.PaymentTypeName}
                </p>
                <p>
                  <strong>Payment Account Name:</strong>{" "}
                  {subscription.payment_type.AccountName}
                </p>
                <p>
                  <strong>Payment Account Number:</strong>{" "}
                  {subscription.payment_type.AccountNumber}
                </p>
                {subscription.payment_type.QR_Scan ? (
                  <img
                    src={`http://127.0.0.1:8000/storage/${subscription.payment_type.QR_Scan}`}
                    alt="QR Scan"
                    className="img-fluid rounded"
                    style={{ maxWidth: "150px" }}
                  />
                ) : (
                  <p>No QR Code available</p>
                )}
              </div>
            </div>
          </div>
          {/* Notification Card */}
          <div className="col-12 col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-header bg-danger text-dark">
                <h5 className="card-title mb-0">Reject Reason</h5>
              </div>
              <div className="card-body">
                {subscription.latest_notification ? (
                  <>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span className="badge bg-danger text-white">
                        {subscription.payment.payment_status}
                      </span>
                    </p>
                    <p>
                      <strong>Description:</strong>{" "}
                      {subscription.latest_notification.description}
                    </p>
                    <p className="text-warning">
                      Currently you cannot access the digital library until you
                      submit the payment again.
                    </p>
                  </>
                ) : (
                  <p>No notifications available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Second Row: Payment Submit Form */}
        <div className="row">
          <div className="col-12 col-md-12 ">
            <div className="card shadow-sm">
              <div className="card-header bg-secondary text-white">
                <h5 className="card-title mb-0">Update Payment Information</h5>
              </div>
              <div className="card-body">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  encType="multipart/form-data"
                >
                  <div className="mb-3">
                    <label htmlFor="PaymentScreenShot" className="form-label">
                      Payment Screenshot
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id="PaymentScreenShot"
                      {...register("PaymentScreenShot", {
                        required: "Payment screenshot is required",
                      })}
                    />
                    {errors.PaymentScreenShot && (
                      <small className="text-danger">
                        {errors.PaymentScreenShot.message}
                      </small>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="PaymentAccountName" className="form-label">
                      Account Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="PaymentAccountName"
                      {...register("PaymentAccountName", {
                        required: "Account Name is required",
                      })}
                    />
                    {errors.PaymentAccountName && (
                      <small className="text-danger">
                        {errors.PaymentAccountName.message}
                      </small>
                    )}
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="PaymentAccountNumber"
                      className="form-label"
                    >
                      Account Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="PaymentAccountNumber"
                      {...register("PaymentAccountNumber", {
                        required: "Account Number is required",
                      })}
                    />
                    {errors.PaymentAccountNumber && (
                      <small className="text-danger">
                        {errors.PaymentAccountNumber.message}
                      </small>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="PaymentDate" className="form-label">
                      Payment Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="PaymentDate"
                      {...register("PaymentDate", {
                        required: "Payment Date is required",
                      })}
                    />
                    {errors.PaymentDate && (
                      <small className="text-danger">
                        {errors.PaymentDate.message}
                      </small>
                    )}
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary">
                      Resubmit Payment
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={handleCancelPayment}
                    >
                      Cancel Payment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {message && (
        <Modal show={true} onHide={handleModalOk} centered>
          <Modal.Header closeButton>
            <Modal.Title>Payment Updated</Modal.Title>
          </Modal.Header>
          <Modal.Body>{message}</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleModalOk}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default ResubmitPayment;
