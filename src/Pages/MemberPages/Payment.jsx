import React, { useEffect, useState, useContext } from "react";
import Menu from "../Layouts/Menu";
import { useForm } from "react-hook-form";
import { MembershipContext } from "./Context/MembershipContext";
import { getPayment } from "../../api/paymenttypeApi";
import { changeRole, createMember } from "../../api/memberApi";
import { createSubscription } from "../../api/subscriptionApi";
import { useNavigate } from "react-router-dom";
import IsSystemUser from "../../CustomHook/IsSystemUser";
import { Modal, Button } from "react-bootstrap";

function Payment() {
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [selectedPaymentType, setSelectedPaymentType] = useState(null);
  const baseUrl = import.meta.env.VITE_API_URL;
  const { userId, membershipPlan } = useContext(MembershipContext);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    getPayment()
      .then((data) => {
        setPaymentTypes(data.data);
      })
      .catch((error) => {
        console.error("Error fetching payment types:", error);
      });
  }, []);

  const onSelectPayment = (paymentType) => {
    setSelectedPaymentType(paymentType);
  };

  const onCancel = () => {
    setSelectedPaymentType(null);
  };

  const handleModalOk = () => {
    setMessage(null);
    navigate("/library/home");
  };

  const onSubmit = (data) => {
    const memberRegister = async () => {
      const getStorageId = JSON.parse(localStorage.getItem("user"));
      const idMember = getStorageId.id;
      const memberId = userId ? userId : idMember;

      const subscription = new FormData();

      // Get current date for MemberStartDate
      const currentDate = new Date();
      const formattedStartDate = currentDate.toISOString().split("T")[0];

      // Calculate MemberEndDate by adding membershipPlan duration (in months)
      const endDate = new Date(currentDate);
      endDate.setMonth(endDate.getMonth() + parseInt(membershipPlan.duration));
      const formattedEndDate = endDate.toISOString().split("T")[0];

      subscription.append("users_id", idMember);
      subscription.append("membership_plans_id", membershipPlan.id);
      subscription.append("payment_types_id", selectedPaymentType.id);
      subscription.append("users_id", memberId);
      subscription.append("PaymentScreenShot", data.PaymentScreenShot[0]); // File input
      subscription.append("PaymentAccountName", data.PaymentAccountName);
      subscription.append("PaymentAccountNumber", data.PaymentAccountNumber);
      subscription.append("PaymentDate", formattedStartDate);
      subscription.append("MemberstartDate", formattedStartDate);
      subscription.append("MemberEndDate", formattedEndDate);

      const res = await createSubscription(subscription);

      console.log("payment res", res.error);

      if (res.status === 200) {
        // Update local storage with new role "member"
        const localUser = JSON.parse(localStorage.getItem("user"));
        localUser.role = "member";
        localStorage.setItem("user", JSON.stringify(localUser));

        console.log("payment user".localUser);

        // Show success modal
        setMessage("Payment submission successful!");
        console.log("User role updated successfully!");
      } else {
        console.error("Failed to update user role");
      }
    };

    memberRegister();
  };

  return (
    <div>
      <div className="container py-5">
        {/* Payment Type Cards */}
        {!selectedPaymentType && (
          <div className="row">
            {paymentTypes.map((paymentType, index) => (
              <div
                key={index}
                className="col-12 col-sm-6 col-md-4 mb-4"
                onClick={() => onSelectPayment(paymentType)}
              >
                <div
                  className="card h-100 shadow-sm border-0"
                  style={{ cursor: "pointer", background: "#4e73df" }}
                >
                  <div className="card-body text-center">
                    {paymentType.BankLogo && (
                      <img
                        src={`${baseUrl}storage/${paymentType.BankLogo}`}
                        alt="Bank Logo"
                        className="img-fluid mb-3 border border-white"
                        style={{
                          height: "8vh",
                          width: "9vw",
                          objectFit: "cover",
                        }}
                      />
                    )}
                    <h5 className="card-title text-white fw-bold">
                      {paymentType.PaymentTypeName}
                    </h5>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Payment Details */}
        {selectedPaymentType && (
          <div className="row">
            <div className="col-12 col-md-8 offset-md-2">
              <div
                className="card p-4 mb-4 border border-white text-white"
                style={{ background: "#4e73df" }}
              >
                <div className="card-body">
                  <h3 className="text-center text-white fw-bold">
                    Payment Details
                  </h3>
                  <p>
                    <strong>Account Name:</strong>{" "}
                    {selectedPaymentType.AccountName}
                  </p>
                  <p>
                    <strong>Account Number:</strong>{" "}
                    {selectedPaymentType.AccountNumber}
                  </p>
                  <p>
                    <strong>Bank Name:</strong> {selectedPaymentType.BankName}
                  </p>
                  {selectedPaymentType.QR_Scan && (
                    <div className="text-center">
                      <p>
                        <strong>QR Code:</strong>
                      </p>
                      <img
                        src={`${baseUrl}storage/${selectedPaymentType.QR_Scan}`}
                        alt="QR Code"
                        className="img-fluid"
                        style={{ maxWidth: "200px" }}
                      />
                    </div>
                  )}
                  <div className="text-center mt-3">
                    <button className="btn btn-danger" onClick={onCancel}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Submission Form */}
        {selectedPaymentType && (
          <div className="row">
            <div className="col-12 col-md-8 offset-md-2">
              <h3 className="mb-4">Submit Your Payment</h3>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label htmlFor="PaymentScreenShot" className="form-label">
                    Payment Screenshot
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="PaymentScreenShot"
                    {...register("PaymentScreenShot", {
                      required: "Screenshot is required",
                    })}
                  />
                  {errors.PaymentScreenShot && (
                    <span className="text-danger">
                      {errors.PaymentScreenShot.message}
                    </span>
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
                    <span className="text-danger">
                      {errors.PaymentAccountName.message}
                    </span>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="PaymentAccountNumber" className="form-label">
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
                    <span className="text-danger">
                      {errors.PaymentAccountNumber.message}
                    </span>
                  )}
                </div>

                <button type="submit" className="btn btn-primary">
                  Submit Payment
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Success Message Modal */}
        {message && (
          <Modal show={true} onHide={handleModalOk} centered>
            <Modal.Header closeButton>
              <Modal.Title>Payment Successful</Modal.Title>
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
    </div>
  );
}

export default Payment;
