import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  showAnnouncement,
  updateAnnouncement,
} from "../../../api/announcementApi";

function DetailAnnouncement() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Initial announcement state with title and description fields.
  const initialValue = { title: "", description: "" };
  const [announcement, setAnnouncement] = useState(initialValue);

  // Controls if the form is in editing mode.
  const [isEditing, setIsEditing] = useState(false);

  // For success and error messages (displayed as modals).
  const [message, setMessage] = useState(""); // success message
  const [error, setError] = useState(""); // error message

  // For client-side input validation errors.
  const [inputErrors, setInputErrors] = useState({});

  // Fetch the announcement detail when the component mounts.
  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await showAnnouncement(id);

        console.log(response);
        if (response.status === 200) {
          setAnnouncement(response.data);
        } else {
          setError(response.data.error || "Error fetching announcement.");
        }
      } catch (err) {
        setError("Error fetching announcement.");
      }
    };
    fetchAnnouncement();
  }, [id]);

  // Handle changes to form inputs.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAnnouncement((prev) => ({ ...prev, [name]: value }));
    if (value.trim()) {
      setInputErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate inputs and submit the update.
  const handleSubmit = async (e) => {
    e.preventDefault();

    let errors = {};
    if (!announcement.title.trim()) {
      errors.title = "Title is required.";
    }
    if (!announcement.description.trim()) {
      errors.description = "Description is required.";
    }
    if (Object.keys(errors).length > 0) {
      setInputErrors(errors);
      return;
    }

    try {
      const response = await updateAnnouncement(id, announcement);
      if (response.status === 200) {
        setMessage(response.message || "Announcement updated successfully!");
        setIsEditing(false);
      } else {
        setError(response.message || "Update failed.");
      }
    } catch (err) {
      setError("Error updating announcement.");
    }
  };

  return (
    <div>
      {/* Back Arrow */}
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
      <h1 className="text-center">Announcement Detail</h1>

      <div className="container d-flex justify-content-center">
        <form className="form-group w-50" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              value={announcement.title}
              onChange={handleInputChange}
              className={`form-control ${
                inputErrors.title ? "is-invalid" : ""
              }`}
              disabled={!isEditing}
            />
            {inputErrors.title && (
              <div className="invalid-feedback">{inputErrors.title}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              id="description"
              value={announcement.description}
              onChange={handleInputChange}
              className={`form-control ${
                inputErrors.description ? "is-invalid" : ""
              }`}
              disabled={!isEditing}
              style={{ minHeight: "30vh", overflow: "auto", display: "block" }}
            ></textarea>
            {inputErrors.description && (
              <div className="invalid-feedback">{inputErrors.description}</div>
            )}
          </div>
          {/* Toggle between Edit mode and Save/Cancel buttons */}
          {isEditing ? (
            <div className="d-flex">
              <button type="submit" className="btn btn-primary">
                Save Update
              </button>
              <button
                type="button"
                className="btn btn-secondary ms-1"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              Edit Announcement
            </button>
          )}
        </form>
      </div>

      {/* Success Message Modal */}
      {message && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
          aria-labelledby="messageModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="messageModalLabel">
                  Success
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setMessage("");
                    navigate(-1);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p>{message}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setMessage("");
                    navigate(-1);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message Modal */}
      {error && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
          aria-labelledby="errorModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="errorModalLabel">
                  Error
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setError("")}
                ></button>
              </div>
              <div className="modal-body">
                <p>{error}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => setError("")}
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

export default DetailAnnouncement;
