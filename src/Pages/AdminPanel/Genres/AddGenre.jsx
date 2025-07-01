import React, { useState } from "react";
import { createGenre } from "../../../api/genresAPI";

function AddGenre() {
  // Initial genre state
  const initial = { genre_name: "" };

  // State for the genre data, success message, and error message
  const [genre, setGenre] = useState(initial);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Update genre state when input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Clear error when the user starts typing
    if (error) setError("");
    setGenre({ ...genre, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input: if empty, set error message and stop submission
    if (!genre.genre_name.trim()) {
      setError("Genre name is required");
      return;
    }

    // Clear any previous error message before proceeding
    setError("");

    try {
      // Call API to create the genre
      let result = await createGenre(genre);

      // Display success message from the API (or fallback message)
      setMessage(result.message || "Genre added successfully");

      // Reset form
      setGenre(initial);
    } catch (err) {
      console.error(err);
      setMessage("There was an error saving the genre");
    }
  };

  return (
    <div>
      <h1 className="text-center">Add Genre</h1>
      <div className="container d-flex justify-content-center">
        <form className="form-group w-50" onSubmit={handleSubmit}>
          <input
            type="text"
            name="genre_name"
            value={genre.genre_name}
            placeholder="Enter genre name"
            className={`form-control w-100 ${error ? "is-invalid" : ""}`}
            onChange={handleInputChange}
          />
          {/* Show error message below the input */}
          {error && <div className="invalid-feedback d-block">{error}</div>}
          <button type="submit" className="btn btn-primary mx-auto mt-2">
            Add Genre
          </button>
        </form>

        {/* Modal for displaying success or error messages */}
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
                    Message
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setMessage("")}
                  ></button>
                </div>
                <div className="modal-body">{message}</div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setMessage("")}
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

export default AddGenre;
