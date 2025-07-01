import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  detail,
  incrementView,
  deleteResource,
} from "../../../api/resourceApi";
import { resourceReviews, deleteReview } from "../../../api/reviewApi";
import { FaStar, FaTrash } from "react-icons/fa";

function ResourceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL;

  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);

  const [reviews, setReviews] = useState([]);
  const [role, setRole] = useState(null);
  const [userid, setUserid] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Load user info
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUserid(parsed.id);
      setRole(parsed.role);
    }
  }, []);

  // Fetch resource & increment view
  useEffect(() => {
    const getResource = async () => {
      try {
        const res = await detail(id);
        setResource(res.data);
        try {
          await incrementView(id);
        } catch {}
        await fetchReviews();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getResource();
  }, [id]);

  const fetchReviews = async () => {
    try {
      const rr = await resourceReviews(id);
      setReviews(rr.reviews);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete review handler
  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      setModalMessage("Review deleted successfully!");
      setModalType("success");
      setShowModal(true);
    } catch {
      setModalMessage("Failed to delete review.");
      setModalType("error");
      setShowModal(true);
    }
  };

  // Delete resource confirmation
  const promptDeleteResource = () => setShowDeleteConfirm(true);
  const cancelDelete = () => setShowDeleteConfirm(false);

  const confirmDeleteResource = async () => {
    try {
      await deleteResource(id);

      // Show success modal
      setShowSuccessModal(true);
      setShowDeleteConfirm(false);

      // After 6s, hide and navigate back
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate(-1);
      }, 6000);
    } catch {
      setModalMessage("Failed to delete resource. Please try again.");
      setModalType("error");
      setShowModal(true);
      setShowDeleteConfirm(false);
    }
  };

  const closeModal = () => setShowModal(false);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!resource)
    return <div className="text-center mt-5">Resource not found</div>;

  return (
    <div>
      {/* Back arrow */}
      <span
        onClick={() => navigate(-1)}
        className="ms-2"
        style={{ cursor: "pointer" }}
      >
        {/* SVG arrow here */}
      </span>

      {/* Resource Detail */}
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-4">
            <img
              src={`${baseUrl}storage/${resource.cover_photo}`}
              alt={resource.name}
              className="img-fluid rounded shadow"
              style={{ height: "450px", objectFit: "cover" }}
            />
          </div>
          <div className="col-md-8">
            <h2 className="fw-bold">{resource.name}</h2>
            <p className="text-muted">By Author: {resource.author.name}</p>
            <div className="d-flex align-items-center mb-3">
              <span className="ms-2 text-primary">
                {reviews.length} Review(s)
              </span>
            </div>
            <p className="w-75 text-justify">{resource.Description}</p>
            <p className="fw-bold">Publish Date: {resource.publish_date}</p>

            <div className="d-flex gap-3 mt-3">
              <button
                className="btn btn-warning"
                onClick={() => navigate(`/Admin/updateResource/${id}`)}
              >
                {/* Pencil SVG */}
                Edit
              </button>
              <button className="btn btn-danger" onClick={promptDeleteResource}>
                {/* Trash SVG */}
                Delete
              </button>
            </div>

            <button
              className="mt-3 btn btn-primary px-4 py-2"
              style={{ borderRadius: "10px" }}
              onClick={() => navigate(`/Admin/ReadResource/${id}`)}
            >
              View Resource
            </button>
          </div>
        </div>
      </div>

      <hr />

      {/* Reviews */}
      <div className="container">
        <h3>User Reviews</h3>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="p-3 border rounded mb-2 d-flex">
              <img
                src={
                  review.profile_pic
                    ? `${baseUrl}storage/${review.profile_pic}`
                    : "/Customer/pic.jpg"
                }
                alt={review.user_name}
                className="rounded-circle"
                style={{ width: "50px", height: "50px", objectFit: "cover" }}
              />
              <div className="ms-3 flex-grow-1">
                <div className="d-flex align-items-center">
                  <p className="fw-bold mb-0">{review.user_name}</p>
                  <FaTrash
                    className="ms-auto cursor-pointer"
                    onClick={() => handleDeleteReview(review.id)}
                  />
                </div>
                <div className="d-flex">
                  {[...Array(5)].map((_, j) => (
                    <FaStar
                      key={j}
                      className={
                        j < review.ReviewStar
                          ? "text-warning"
                          : "text-secondary"
                      }
                    />
                  ))}
                </div>
                <p>{review.ReviewMessage}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>

      {/* Generic success/error modal for review deletion */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div
                className={`modal-header ${
                  modalType === "success" ? "bg-success" : "bg-danger"
                } text-white`}
              >
                <h5 className="modal-title">
                  {modalType === "success" ? "Success" : "Error"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <p>{modalMessage}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm-delete modal */}
      {showDeleteConfirm && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-dark">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={cancelDelete}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this resource?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={cancelDelete}>
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={confirmDeleteResource}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auto-dismiss success modal */}
      {showSuccessModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Success</h5>
              </div>
              <div className="modal-body">
                <p>Resource deleted successfully!</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResourceDetail;
