import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { createMembership } from "../../../api/membershipApi";

function AddMembershipPlan() {
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

  // Helper to ensure we always have a string message
  const getMessageString = (msg) => {
    return typeof msg === "object" ? JSON.stringify(msg) : msg;
  };

  const onSubmit = (data) => {
    // Ensure that duration is a number before sending to API
    data.Duration = Number(data.Duration);

    const submit = async () => {
      try {
        const response = await createMembership(data);
        if (response.status === 200) {
          setModalType("success");
          setModalMessage(
            getMessageString(response.message) ||
              "Subscription plan created successfully."
          );
          reset();
        } else {
          setModalType("danger");
          setModalMessage(
            getMessageString(response.message) ||
              "Failed to create Subscription plan. Please try again."
          );
        }
        setShowModal(true);
      } catch (error) {
        setModalType("danger");
        setModalMessage(
          getMessageString(error.message) ||
            "An unexpected error occurred. Please try again."
        );
        setShowModal(true);
      }
    };

    submit();
  };

  return (
    <div className="container w-75 mx-auto mt-5">
      <h2 className="text-center mb-4">Subscription Plan Form</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Row 1: Plan Name & Duration */}
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="planName">Plan Name</label>
            <input
              type="text"
              className={`form-control ${errors.PlanName ? "is-invalid" : ""}`}
              id="planName"
              {...register("PlanName", { required: "Plan Name is required" })}
              placeholder="Enter the plan name."
            />
            {errors.PlanName && (
              <div className="invalid-feedback">{errors.PlanName.message}</div>
            )}
          </div>

          <div className="form-group col-md-6">
            <label htmlFor="duration">Duration</label>
            <select
              className={`form-control ${errors.Duration ? "is-invalid" : ""}`}
              id="duration"
              defaultValue=""
              {...register("Duration", { required: "Select Duration" })}
            >
              <option value="" disabled>
                Select Duration
              </option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month}>
                  {month} {month === 1 ? "Month" : "Months"}
                </option>
              ))}
            </select>
            {errors.Duration && (
              <div className="invalid-feedback">{errors.Duration.message}</div>
            )}
          </div>
        </div>

        {/* Row 2: Price & Description */}
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="price">Price ($)</label>
            <input
              type="number"
              className={`form-control ${errors.Price ? "is-invalid" : ""}`}
              id="price"
              {...register("Price", { required: "Price is required" })}
              step="0.01"
              placeholder="Enter the price in decimal format."
            />
            {errors.Price && (
              <div className="invalid-feedback">{errors.Price.message}</div>
            )}
          </div>

          <div className="form-group col-md-6">
            <label htmlFor="description">Description</label>
            <textarea
              className={`form-control ${
                errors.Description ? "is-invalid" : ""
              }`}
              id="description"
              {...register("Description", {
                required: "Description is required",
              })}
              rows="3"
              placeholder="Enter a brief description of the plan."
            ></textarea>
            {errors.Description && (
              <div className="invalid-feedback">
                {errors.Description.message}
              </div>
            )}
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          Save Subscription
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

export default AddMembershipPlan;
