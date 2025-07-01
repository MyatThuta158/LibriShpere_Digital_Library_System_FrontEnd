import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { createPayment } from "../../../api/paymenttypeApi";

function AddPayment_Type() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Modal state for dialog message box
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
  const [showModal, setShowModal] = useState(false);

  const onSubmit = (data) => {
    const submit = async () => {
      // Create a FormData object to handle file uploads
      const formData = new FormData();

      // Append text inputs
      formData.append("PaymentTypeName", data.PaymentTypeName);
      formData.append("AccountName", data.AccountName);
      formData.append("AccountNumber", data.AccountNumber);
      formData.append("BankName", data.BankName);

      // Append file inputs
      if (data.QR_Scan && data.QR_Scan[0]) {
        formData.append("QR_Scan", data.QR_Scan[0]);
      }
      if (data.BankLogo && data.BankLogo[0]) {
        formData.append("BankLogo", data.BankLogo[0]);
      }

      try {
        // Call the API with the form data
        const response = await createPayment(formData);
        console.log(response.message);

        if (response.status === 200) {
          setModalType("success");
          setModalMessage(
            response.message || "Payment type created successfully."
          );
          reset();
        } else {
          setModalType("danger");
          setModalMessage(
            response.message ||
              "An error occurred while creating the payment type."
          );
        }
        setShowModal(true);
      } catch (error) {
        setModalType("danger");
        setModalMessage(error.message || "An unexpected error occurred.");
        setShowModal(true);
      }
    };

    submit();
  };

  return (
    <div className="container w-75 mx-auto mt-5">
      <h2 className="text-center mb-4">Payment Type Form</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Row 1: Payment Type Name & Account Name */}
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="paymentTypeName">Payment Type Name</label>
            <input
              type="text"
              className={`form-control ${
                errors.PaymentTypeName ? "is-invalid" : ""
              }`}
              id="paymentTypeName"
              {...register("PaymentTypeName", {
                required: "Payment Type Name is required",
              })}
              placeholder="Enter the payment type name."
            />
            {errors.PaymentTypeName && (
              <div className="invalid-feedback">
                {errors.PaymentTypeName.message}
              </div>
            )}
          </div>

          <div className="form-group col-md-6">
            <label htmlFor="accountName">Account Name</label>
            <input
              type="text"
              className={`form-control ${
                errors.AccountName ? "is-invalid" : ""
              }`}
              id="accountName"
              {...register("AccountName", {
                required: "Account Name is required",
              })}
              placeholder="Enter the account name."
            />
            {errors.AccountName && (
              <div className="invalid-feedback">
                {errors.AccountName.message}
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Account Number & Bank Name */}
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="accountNumber">Account Number</label>
            <input
              type="text"
              className={`form-control ${
                errors.AccountNumber ? "is-invalid" : ""
              }`}
              id="accountNumber"
              {...register("AccountNumber", {
                required: "Account Number is required",
              })}
              placeholder="Enter the account number."
            />
            {errors.AccountNumber && (
              <div className="invalid-feedback">
                {errors.AccountNumber.message}
              </div>
            )}
          </div>

          <div className="form-group col-md-6">
            <label htmlFor="bankName">Bank Name</label>
            <input
              type="text"
              className={`form-control ${errors.BankName ? "is-invalid" : ""}`}
              id="bankName"
              {...register("BankName", { required: "Bank Name is required" })}
              placeholder="Enter the bank name."
            />
            {errors.BankName && (
              <div className="invalid-feedback">{errors.BankName.message}</div>
            )}
          </div>
        </div>

        {/* Row 3: QR Code Image & Bank Logo Image */}
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="qrScan">QR Code Image</label>
            <input
              type="file"
              className={`form-control ${errors.QR_Scan ? "is-invalid" : ""}`}
              id="qrScan"
              {...register("QR_Scan", {
                required: "QR Code Image is required",
              })}
            />
            {errors.QR_Scan && (
              <div className="invalid-feedback">{errors.QR_Scan.message}</div>
            )}
          </div>

          <div className="form-group col-md-6">
            <label htmlFor="bankLogo">Bank Logo Image</label>
            <input
              type="file"
              className={`form-control ${errors.BankLogo ? "is-invalid" : ""}`}
              id="bankLogo"
              {...register("BankLogo", {
                required: "Bank Logo is required",
              })}
            />
            {errors.BankLogo && (
              <div className="invalid-feedback">{errors.BankLogo.message}</div>
            )}
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </form>

      {/* Modal Dialog Box */}
      {showModal && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className={`modal-header `}>
                <h5 className="modal-title">
                  {modalType === "success" ? "Success" : "Error"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>{modalMessage}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddPayment_Type;
