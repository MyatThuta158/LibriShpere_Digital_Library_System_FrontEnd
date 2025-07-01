import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { showGenre, updateGenre } from "../../../api/genresAPI";

function UpdateGenre() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  let { name } = location.state || {};

  // Initial value for genre
  const initialValue = { name: "" };
  const [genre, setGenre] = useState(initialValue);
  const [message, setMessage] = useState(""); // for success messages
  const [error, setError] = useState(""); // for error messages
  const [inputError, setInputError] = useState(""); // for client-side input validation

  // Set initial genre value from location state if available
  useEffect(() => {
    if (name) {
      setGenre((prev) => ({ ...prev, name }));
    }
  }, [name]);

  // Fetch genre data based on id
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await showGenre(id);
        setGenre(response.data);
      } catch (err) {
        console.error(err);
        setError("Error fetching genre data.");
      }
    };
    fetchData();
  }, [id]);

  // Handle input changes and clear validation error if valid
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGenre((prevGenre) => ({
      ...prevGenre,
      [name]: value,
    }));
    if (value.trim()) {
      setInputError("");
    }
  };

  // Handle update submit with validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!genre.name.trim()) {
      setInputError("Name is required.");
      return;
    }
    setInputError("");
    try {
      const response = await updateGenre(id, genre);
      if (response.status === 200) {
        setMessage(response.message);
      } else {
        setError(response.message);
      }
    } catch (err) {
      console.error(err);
      setError("Error updating genre.");
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
      <h1 className="text-center">Update Genre</h1>

      <div className="container d-flex justify-content-center">
        <form className="form-group w-50" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={genre.name}
            className={`form-control w-100 ${inputError ? "is-invalid" : ""}`}
            onChange={handleInputChange}
          />
          {inputError && <div className="invalid-feedback">{inputError}</div>}
          <button type="submit" className="btn btn-primary mx-auto mt-2">
            Update Genre
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
                    navigate("/Admin/ViewGenre");
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
                    navigate("/Admin/ViewGenre");
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

export default UpdateGenre;
