import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { showAuthors, updateAuthors } from "../../../api/authorsApi";

function UpdateAuthors() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  let { name } = location.state || {};

  // Initial value for author
  const initialValue = { name: "" };
  const [author, setAuthor] = useState(initialValue);
  const [message, setMessage] = useState(""); // for success messages
  const [error, setError] = useState(""); // for error messages
  const [inputError, setInputError] = useState(""); // for client-side input validation

  // Set initial author value from location state if available
  useEffect(() => {
    if (name) {
      setAuthor((prev) => ({ ...prev, name }));
    }
  }, [name]);

  // Fetch author data based on id
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await showAuthors(id);
        setAuthor(response.data);
      } catch (err) {
        console.error(err);
        setError("Error fetching author data.");
      }
    };
    fetchData();
  }, [id]);

  // Handle input changes and clear input validation error if valid input is provided
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAuthor((prevAuthor) => ({
      ...prevAuthor,
      [name]: value,
    }));
    if (value.trim()) {
      setInputError("");
    }
  };

  // Handle update submit with client-side validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate that the name is not empty
    if (!author.name.trim()) {
      setInputError("Name is required.");
      return;
    }
    // Clear any previous input error
    setInputError("");

    try {
      const response = await updateAuthors(id, author);
      // Assuming response.message contains the success message
      if (response.status === 200) {
        setMessage(response.message);
      } else {
        setError(response.message);
      }
    } catch (err) {
      console.error(err);
      setError("Error updating author.");
    }
  };

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
      <h1 className="text-center">Update Authors</h1>

      <div className="container d-flex justify-content-center">
        <form className="form-group w-50" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={author.name}
            className={`form-control w-100 ${inputError ? "is-invalid" : ""}`}
            onChange={handleInputChange}
          />
          {inputError && <div className="invalid-feedback">{inputError}</div>}
          <button type="submit" className="btn btn-primary mx-auto mt-2">
            Update Author
          </button>
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
                    navigate("/Admin/ViewAuthors");
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
                    navigate("/Admin/ViewAuthors");
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

export default UpdateAuthors;
