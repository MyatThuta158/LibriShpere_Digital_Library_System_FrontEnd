import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import {
  getMembershipPlan,
  updateMembershipPlan,
} from "../../../api/membershipApi";

function UpdateMembershipPlan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const [loading, setLoading] = useState(true);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
  const [showModal, setShowModal] = useState(false);

  // Fetch the membership plan data and prefill form values
  useEffect(() => {
    async function fetchMembershipPlan() {
      try {
        const response = await getMembershipPlan(id);
        if (response.status === 200) {
          const data = response.data;
          setValue("PlanName", data.PlanName);
          // Ensure Duration is a number for the select options
          setValue("Duration", Number(data.Duration));
          setValue("Price", data.Price);
          setValue("Description", data.Description);
        } else {
          setModalType("danger");
          setModalMessage("Unable to fetch Subscription plan data.");
          setShowModal(true);
        }
      } catch (error) {
        setModalType("danger");
        setModalMessage(
          "An error occurred while fetching Subscription plan data."
        );
        setShowModal(true);
      } finally {
        setLoading(false);
      }
    }
    fetchMembershipPlan();
  }, [id, setValue]);

  const onSubmit = (data) => {
    const submit = async () => {
      const formData = new FormData();
      formData.append("PlanName", data.PlanName);
      formData.append("Duration", data.Duration);
      formData.append("Price", data.Price);
      formData.append("Description", data.Description);

      try {
        const response = await updateMembershipPlan(id, formData);
        if (response.status === 200) {
          setModalType("success");
          setModalMessage(
            response.message || "Subscription plan updated successfully."
          );
          setShowModal(true);
        } else {
          setModalType("danger");
          setModalMessage(
            response.message || "Failed to update Subscription plan."
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

  // Close modal and if update was successful, navigate back
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
    <div className="container w-75 mt-5 mx-auto">
      <h2 className="text-center mb-4">Update Subscription Plan Form</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Row 1: Plan Name & Duration */}
        <div className="form-row">
          <div className="col-md-6 form-group">
            <label htmlFor="planName">Plan Name</label>
            <input
              type="text"
              id="planName"
              placeholder="Enter the plan name."
              className={`form-control ${errors.PlanName ? "is-invalid" : ""}`}
              {...register("PlanName", { required: "Plan Name is required" })}
            />
            {errors.PlanName && (
              <div className="invalid-feedback">{errors.PlanName.message}</div>
            )}
          </div>

          <div className="col-md-6 form-group">
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
          <div className="col-md-6 form-group">
            <label htmlFor="price">Price ($)</label>
            <input
              type="number"
              step="0.01"
              id="price"
              placeholder="Enter the price."
              className={`form-control ${errors.Price ? "is-invalid" : ""}`}
              {...register("Price", { required: "Price is required" })}
            />
            {errors.Price && (
              <div className="invalid-feedback">{errors.Price.message}</div>
            )}
          </div>

          <div className="col-md-6 form-group">
            <label htmlFor="description">Description</label>
            <textarea
              className={`form-control ${
                errors.Description ? "is-invalid" : ""
              }`}
              id="description"
              placeholder="Enter a brief description of the plan."
              rows="3"
              {...register("Description", {
                required: "Description is required",
              })}
            ></textarea>
            {errors.Description && (
              <div className="invalid-feedback">
                {errors.Description.message}
              </div>
            )}
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          Update Subscription
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
  );
}

export default UpdateMembershipPlan;
