import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { getEachPayment, updatePaymentType } from "../../../api/paymenttypeApi";

function UpdatePayment_Type() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [loading, setLoading] = useState(true);
  // States for modal dialog
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
  const [showModal, setShowModal] = useState(false);
  // States to display file names or placeholder text
  const [qrFileName, setQrFileName] = useState("Enter for QR code update");
  const [bankLogoFileName, setBankLogoFileName] = useState(
    "Enter for Bank Logo update"
  );

  useEffect(() => {
    async function fetchPayment() {
      try {
        const response = await getEachPayment(id);
        if (response.status === 200) {
          const data = response.data;
          setValue("PaymentTypeName", data.PaymentTypeName);
          setValue("AccountName", data.AccountName);
          setValue("AccountNumber", data.AccountNumber);
          setValue("BankName", data.BankName);
        } else {
          setModalType("danger");
          setModalMessage("Unable to fetch payment type data.");
          setShowModal(true);
        }
      } catch (error) {
        setModalType("danger");
        setModalMessage("An error occurred while fetching payment type data.");
        setShowModal(true);
      } finally {
        setLoading(false);
      }
    }
    fetchPayment();
  }, [id, setValue]);

  const onSubmit = (data) => {
    const submit = async () => {
      const formData = new FormData();
      formData.append("PaymentTypeName", data.PaymentTypeName);
      formData.append("AccountName", data.AccountName);
      formData.append("AccountNumber", data.AccountNumber);
      formData.append("BankName", data.BankName);

      if (data.QR_Scan && data.QR_Scan[0]) {
        formData.append("QR_Scan", data.QR_Scan[0]);
      }
      if (data.BankLogo && data.BankLogo[0]) {
        formData.append("BankLogo", data.BankLogo[0]);
      }

      try {
        const response = await updatePaymentType(id, formData);
        console.log(response);
        if (response.status === 200) {
          setModalType("success");
          setModalMessage(
            response.message || "Payment type updated successfully."
          );
          setShowModal(true);
          // Removed automatic navigation; now handled in the modal close
        } else {
          setModalType("danger");
          setModalMessage(
            response.message ||
              "An error occurred while updating the payment type."
          );
          setShowModal(true);
        }
      } catch (error) {
        setModalType("danger");
        setModalMessage(error.message || "An unexpected error occurred.");
        setShowModal(true);
      }
    };

    submit();
  };

  // Handler for closing modal: navigate back only on success
  const handleCloseModal = () => {
    setShowModal(false);
    if (modalType === "success") {
      navigate(-1);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div onClick={() => navigate(-1)} style={{ cursor: "pointer" }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="46"
          height="46"
          fill="currentColor"
          className="bi bi-arrow-left-short"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5"
          />
        </svg>
      </div>

      <div className="container w-75 mx-auto mt-5">
        <h2 className="text-center mb-4">Update Payment Type Form</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="paymentTypeName">Payment Type Name</label>
              <input
                type="text"
                id="paymentTypeName"
                placeholder="Enter the payment type name."
                className={`form-control ${
                  errors.PaymentTypeName ? "is-invalid" : ""
                }`}
                {...register("PaymentTypeName", {
                  required: "Payment Type Name is required",
                })}
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
                id="accountName"
                placeholder="Enter the account name."
                className={`form-control ${
                  errors.AccountName ? "is-invalid" : ""
                }`}
                {...register("AccountName", {
                  required: "Account Name is required",
                })}
              />
              {errors.AccountName && (
                <div className="invalid-feedback">
                  {errors.AccountName.message}
                </div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="accountNumber">Account Number</label>
              <input
                type="text"
                id="accountNumber"
                placeholder="Enter the account number."
                className={`form-control ${
                  errors.AccountNumber ? "is-invalid" : ""
                }`}
                {...register("AccountNumber", {
                  required: "Account Number is required",
                })}
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
                id="bankName"
                placeholder="Enter the bank name."
                className={`form-control ${
                  errors.BankName ? "is-invalid" : ""
                }`}
                {...register("BankName", { required: "Bank Name is required" })}
              />
              {errors.BankName && (
                <div className="invalid-feedback">
                  {errors.BankName.message}
                </div>
              )}
            </div>
          </div>

          <div className="form-row">
            {/* Custom File Input for QR Code Image */}
            <div className="form-group col-md-6">
              <label htmlFor="qrScan">QR Code Image</label>
              <div className="custom-file">
                <input
                  type="file"
                  id="qrScan"
                  style={{ cursor: "pointer" }}
                  className={`custom-file-input ${
                    errors.QR_Scan ? "is-invalid" : ""
                  }`}
                  {...register("QR_Scan")}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setQrFileName(e.target.files[0].name);
                    } else {
                      setQrFileName("Enter for QR code update");
                    }
                  }}
                />
                <label className="custom-file-label" htmlFor="qrScan">
                  {qrFileName}
                </label>
              </div>
            </div>

            {/* Custom File Input for Bank Logo Image */}
            <div className="form-group col-md-6">
              <label htmlFor="bankLogo">Bank Logo Image</label>
              <div className="custom-file">
                <input
                  type="file"
                  id="bankLogo"
                  style={{ cursor: "pointer" }}
                  className={`custom-file-input ${
                    errors.BankLogo ? "is-invalid" : ""
                  }`}
                  {...register("BankLogo")}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setBankLogoFileName(e.target.files[0].name);
                    } else {
                      setBankLogoFileName("Enter for Bank Logo update");
                    }
                  }}
                />
                <label className="custom-file-label" htmlFor="bankLogo">
                  {bankLogoFileName}
                </label>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block w-25">
            Update Payment Type
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
                <div className="modal-header">
                  <h5 className="modal-title">
                    {modalType === "success" ? "Success" : "Error"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>{modalMessage}</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UpdatePayment_Type;
