import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { postAnnouncment } from "../../../api/announcementApi";

function CreateAnnouncement() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
  const [showModal, setShowModal] = useState(false);

  const onSubmit = async (data) => {
    try {
      const result = await postAnnouncment(data);
      if (result.status === 200) {
        setModalType("success");
        setModalMessage(result.message || "Announcement created successfully!");
        reset();
      } else {
        setModalType("danger");
        setModalMessage(result.message || "Failed to create announcement.");
      }
      setShowModal(true);
    } catch (error) {
      setModalType("danger");
      setModalMessage(
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
          error.message ||
          "An unexpected error occurred."
      );
      setShowModal(true);
    }
  };

  return (
    <div className="container mt-3">
      <h1 className="text-center">Create Announcement</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 w-75 mx-auto">
        {/* Title Field */}
        <div className="form-group mb-3">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            className={`form-control ${errors.title ? "is-invalid" : ""}`}
            id="title"
            placeholder="Enter announcement title"
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && (
            <div className="invalid-feedback">{errors.title.message}</div>
          )}
        </div>

        {/* Description Field */}
        <div className="form-group mb-3">
          <label htmlFor="description">Description</label>
          <textarea
            className={`form-control ${errors.description ? "is-invalid" : ""}`}
            id="description"
            placeholder="Enter announcement description"
            style={{
              minHeight: "30vh",
              overflow: "auto",
              display: "block", // Ensure it is block-level
            }}
            {...register("description", {
              required: "Description is required",
            })}
          />
          {errors.description && (
            <div className="invalid-feedback">{errors.description.message}</div>
          )}
        </div>

        <div className="text-center mt-4">
          <button type="submit" className="btn btn-primary">
            Create Announcement
          </button>
        </div>
      </form>

      {/* Modal Dialog */}
      {showModal && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
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

export default CreateAnnouncement;
