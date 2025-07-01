import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Menu from "../Layouts/Menu";
import {
  changeNotiStatus,
  createRequest,
  viewRequests,
} from "../../api/requestresourceApi";
import { useNavigate } from "react-router-dom";

function RequestResources() {
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [requestResource, setRequestresource] = useState([]);
  const baseUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const memberId = user.id;

  // Function to fetch request resources
  const fetchRequestResources = async () => {
    try {
      const requestLists = await viewRequests(memberId);
      setRequestresource(requestLists.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  // Fetch requests when component mounts
  useEffect(() => {
    fetchRequestResources();
    // console.log(requestResource[0].Admin_Comment);
  }, [memberId]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("user_id", memberId);
    formData.append("Title", data.Title);
    formData.append("ISBN", data.ISBN || "");
    formData.append("Author", data.Author || "");
    formData.append("Language", data.Language);
    formData.append("PublishYear", data.PublishYear || "");

    if (selectedFile) {
      formData.append("Resource_Photo", selectedFile);
    }

    try {
      let res = await createRequest(formData);

      if (res.status === 200) {
        setMessage("Digital resource request submitted successfully!");
        setMessageType("success");
        reset();
        setSelectedFile(null);
        setShowModal(false);
        // Re-fetch the list of requests after a successful submission
        fetchRequestResources();
      } else {
        setMessage("Failed to submit book request.");
        setMessageType("error");
      }
    } catch (error) {
      console.log(error);
      setMessage("An error occurred. Please try again.");
      setMessageType("error");
    }
  };

  const changeStatus = async (id) => {
    const status = { NotificationStatus: "Watched" };
    const res = await changeNotiStatus(id, status);
    console.log(res.message);
  };

  return (
    <div>
      {/* <Menu /> */}
      <div className="container h-100 text-light" style={{ marginTop: "15vh" }}>
        {message && (
          <div
            className={`alert ${
              messageType === "success" ? "alert-success" : "alert-danger"
            } alert-dismissible fade show`}
            role="alert"
          >
            {message}
            <button
              type="button"
              className="btn-close"
              onClick={() => setMessage("")}
            ></button>
          </div>
        )}

        <div className="d-flex align-items-center mb-3">
          <a href="#" className="text-light text-decoration-none me-2">
            &larr;
          </a>
          <h5 className="mb-1">Book Requests</h5>
        </div>

        <div className="border text-black p-3 rounded">
          <p className="mb-2">Here you can create a book request</p>
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            New request
          </button>
        </div>

        <div className="mt-3">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <a className="nav-link active text-black" href="#">
                My requests
              </a>
            </li>
          </ul>
        </div>

        <div className="p-3 mt-2 rounded">
          <div className="space-y">
            {requestResource && requestResource.length > 0 ? (
              requestResource.map((request) => (
                <div
                  key={request.id}
                  className="d-flex my-2 text-white p-3 rounded-lg shadow-lg align-items-center"
                  style={{
                    width: "100%",
                    backgroundColor: "#4e73df",
                  }}
                >
                  <img
                    src={
                      request.Resource_Photo
                        ? `http://127.0.0.1:8000/storage/${request.Resource_Photo}`
                        : "/Customer/bookrequest.jpg"
                    }
                    alt="Book Cover"
                    className="rounded-lg shadow-lg"
                    style={{
                      width: "20%",
                      height: "15vh",
                      objectFit: "contain",
                    }}
                  />
                  <div className="ml-4 flex flex-column justify-content-between w-100">
                    <div className="container d-flex justify-content-between">
                      <div>
                        <h2 className="text-lg text-white font-semibold mb-1">
                          <span className="text-gray-400">Title:</span>{" "}
                          {request.Title}
                        </h2>
                        <p className="text-sm text-gray-400">
                          Language:{" "}
                          <span className="text-white">{request.Language}</span>
                        </p>
                      </div>
                      <div className="d-flex">
                        {request.AdminComment && (
                          <span className="badge h-25 bg-danger">New</span>
                        )}
                      </div>
                    </div>
                    <div
                      className="d-flex justify-content-between float-end"
                      style={{ width: "100%" }}
                    >
                      <div className="ms-3 w-100 d-flex justify-content-between">
                        <div>
                          {request.Admin_Comment && (
                            <button
                              onClick={() => {
                                changeStatus(request.id);
                                navigate(
                                  `/library/resource/request/${request.id}`
                                );
                              }}
                              className="btn px-5 btn-warning"
                            >
                              View Response
                            </button>
                          )}
                        </div>
                        <div className="d-flex">
                          <span className="text-right text-white me-2">
                            Date:
                          </span>
                          <span className="text-right d-block text-white">
                            {request.created_at.split("T")[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400">
                No books for tracking.{" "}
                <a
                  href="#"
                  className="text-blue-400 hover:underline"
                  onClick={() => setShowModal(true)}
                >
                  Create a new request
                </a>
                .
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Request</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-3">
                    <label>Title</label>
                    <input
                      type="text"
                      className="form-control"
                      {...register("Title", { required: "Title is required" })}
                    />
                    {errors.Title && (
                      <p className="text-danger">{errors.Title.message}</p>
                    )}
                  </div>
                  <div className="mb-3">
                    <label>Enter ISBN (10 or 13 numbers)</label>
                    <input
                      type="text"
                      className="form-control"
                      {...register("ISBN")}
                    />
                  </div>
                  <div className="mb-3">
                    <label>Author</label>
                    <input
                      type="text"
                      className="form-control"
                      {...register("Author", {
                        required: "Author is required",
                      })}
                    />
                    {errors.Author && (
                      <p className="text-danger">{errors.Author.message}</p>
                    )}
                  </div>
                  <div className="mb-3">
                    <label>Language</label>
                    <input
                      type="text"
                      className="form-control"
                      {...register("Language", {
                        required: "Language is required",
                      })}
                    />
                    {errors.Language && (
                      <p className="text-danger">{errors.Language.message}</p>
                    )}
                  </div>
                  <div className="mb-3">
                    <label>Year (optional)</label>
                    <input
                      type="text"
                      className="form-control"
                      {...register("PublishYear")}
                    />
                  </div>
                  <div className="mb-3">
                    <label>Upload Book Cover (optional)</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {selectedFile && (
                      <p className="text-success">
                        Selected file: {selectedFile.name}
                      </p>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RequestResources;
