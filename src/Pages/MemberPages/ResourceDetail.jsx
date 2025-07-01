import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { detail, incrementView } from "../../api/resourceApi";
import axios from "axios";
import { FaStar, FaEdit, FaTrash } from "react-icons/fa";
import {
  resourceReviews,
  updateReview,
  deleteReview,
} from "../../api/reviewApi";
import { AbilityContext } from "../../Authentication/PermissionForUser";

function ResourceDetail() {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [role, setRole] = useState(null);
  const [userid, setUserid] = useState(0);
  const [newReview, setNewReview] = useState({
    ReviewStar: 0,
    ReviewMessage: "",
  });
  const [hoverStar, setHoverStar] = useState(null);
  const [editingReviewId, setEditingReviewId] = useState(null); // ← null initial :contentReference[oaicite:3]{index=3}
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
  const baseUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const ability = useContext(AbilityContext);

  // load user info once
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const u = JSON.parse(stored);
      setUserid(u.id);
      setRole(u.role);
    }
  }, []);

  // fetch resource & reviews
  useEffect(() => {
    const getResource = async () => {
      try {
        const resp = await detail(id);
        setResource(resp.data);
        //console.log(resp.data); // comma syntax :contentReference[oaicite:2]{index=2}
        await fetchReviews(); // initial fetch :contentReference[oaicite:4]{index=4}
      } catch (err) {
        console.error("Error fetching resource:", err);
      } finally {
        setLoading(false);
      }
    };
    getResource();
  }, [id]);

  const fetchReviews = async () => {
    try {
      const res = await resourceReviews(id);
      setReviews(res.reviews); // full objects with user_name, profile_pic
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  const handleEditReview = (r) => {
    setNewReview({
      ReviewStar: r.ReviewStar,
      ReviewMessage: r.ReviewMessage,
    });
    setEditingReviewId(r.id);
    setErrorMessage("");
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setNewReview({ ReviewStar: 0, ReviewMessage: "" });
    setErrorMessage("");
  };

  const incrementViewCount = async (rid) => {
    const res = await incrementView(rid);
    console.log("count", res); // comma syntax :contentReference[oaicite:5]{index=5}
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      setModalMessage("Review deleted successfully!");
      setModalType("success");
      setShowModal(true);
    } catch (err) {
      console.error("Error deleting review:", err);
      setModalMessage("Failed to delete review. Please try again.");
      setModalType("error");
      setShowModal(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (newReview.ReviewMessage.trim() === "") {
      setErrorMessage("Please enter review");
      return;
    }

    if (editingReviewId) {
      // --- UPDATE existing ---
      try {
        const payload = {
          reviewid: editingReviewId,
          resource_id: id,
          user_id: userid,
          ReviewStar: newReview.ReviewStar,
          ReviewMessage: newReview.ReviewMessage,
        };
        await updateReview(editingReviewId, payload);
        await fetchReviews(); // ← refetch after mutation :contentReference[oaicite:6]{index=6}
        setEditingReviewId(null);
        setNewReview({ ReviewStar: 0, ReviewMessage: "" });
        setModalMessage("Review updated successfully!");
        setModalType("success");
        setShowModal(true);
      } catch (err) {
        console.error("Error updating review:", err);
        setModalMessage("Failed to update review. Please try again.");
        setModalType("error");
        setShowModal(true);
      }
    } else {
      // --- ADD new ---
      try {
        const resp = await axios.post(`${baseUrl}Reviews/Add`, {
          resource_id: id,
          user_id: userid,
          ReviewStar: newReview.ReviewStar,
          ReviewMessage: newReview.ReviewMessage,
        });
        // hydrate with user info client-side to avoid extra fetch :contentReference[oaicite:7]{index=7}
        const stored = JSON.parse(localStorage.getItem("user"));
        const hydrated = {
          ...resp.data.review,
          user_name: stored.name,
          profile_pic: stored.profile_pic,
        };
        setReviews((prev) => [...prev, hydrated]);
        setNewReview({ ReviewStar: 0, ReviewMessage: "" });
        setModalMessage("Review added successfully!");
        setModalType("success");
        setShowModal(true);
      } catch (err) {
        console.error("Error submitting review:", err);
        setModalMessage("Failed to add review. Please try again.");
        setModalType("error");
        setShowModal(true);
      }
    }
  };

  const closeModal = () => setShowModal(false);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!resource)
    return <div className="text-center mt-5">Resource not found</div>;

  return (
    <div className="container" style={{ marginTop: "5%" }}>
      <div className="row">
        <div className="col-md-4">
          <img
            src={`${baseUrl}storage/${resource.cover_photo}`}
            className="img-fluid rounded shadow"
            alt={resource.name}
            style={{ height: "450px", objectFit: "cover" }}
          />
        </div>
        <div className="col-md-8">
          <h2 className="fw-bold">{resource.name}</h2>
          <p className="text-muted">By Author Name: {resource.author.name}</p>
          <div className="d-flex align-items-center mb-3">
            <span className="ms-2 text-primary">
              {reviews.length} Review(s)
            </span>
          </div>
          <p className="w-75 text-justify">{resource.Description}</p>
          <p className="fw-bold">Publish Date: {resource.publish_date}</p>
          <div
            onClick={() => {
              navigate(`/library/ReadResource/${id}`);
              incrementViewCount(id);
            }}
            className="btn btn-dark mt-3"
          >
            Read Resource
          </div>
        </div>
      </div>

      <hr />

      <div>
        <h3>User Reviews</h3>

        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="p-3 border rounded mb-2 d-flex">
              {" "}
              {/* avoid key=index :contentReference[oaicite:8]{index=8} */}
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
                  {review.user_id === userid &&
                    role !== "manager" &&
                    role !== "librarian" && (
                      <div className="ms-auto d-flex">
                        <FaEdit
                          className="cursor-pointer me-2"
                          onClick={() => handleEditReview(review)}
                        />
                        <FaTrash
                          className="cursor-pointer"
                          onClick={() => handleDeleteReview(review.id)}
                        />
                      </div>
                    )}
                  {(role === "manager" || role === "librarian") && (
                    <FaTrash
                      className="cursor-pointer ms-auto"
                      onClick={() => handleDeleteReview(review.id)}
                    />
                  )}
                </div>
                <div className="d-flex">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        i < review.ReviewStar
                          ? "text-warning"
                          : "text-secondary"
                      }
                    />
                  ))}
                </div>
                <p>{review.ReviewMessage}</p>
                <small className="text-muted">
                  Created on: {new Date(review.created_at).toLocaleString()}
                </small>
              </div>
            </div>
          ))
        ) : (
          <p>No reviews yet. Be the first to review this resource!</p>
        )}

        {ability.can("add", "review") && (
          <div className="mt-4">
            <h4>{editingReviewId ? "Edit Your Review" : "Leave a Review"}</h4>
            <form onSubmit={handleSubmit}>
              <div className="d-flex">
                {[...Array(5)].map((_, i) => {
                  const val = i + 1;
                  return (
                    <FaStar
                      key={i}
                      className={`cursor-pointer ${
                        val <= (hoverStar || newReview.ReviewStar)
                          ? "text-warning"
                          : "text-secondary"
                      }`}
                      onClick={() =>
                        setNewReview({ ...newReview, ReviewStar: val })
                      }
                      onMouseEnter={() => setHoverStar(val)}
                      onMouseLeave={() => setHoverStar(null)}
                    />
                  );
                })}
              </div>
              <textarea
                className="form-control mt-2 mb-2"
                placeholder="Write your review here..."
                style={{ height: "20vh" }}
                value={newReview.ReviewMessage}
                onChange={(e) =>
                  setNewReview({ ...newReview, ReviewMessage: e.target.value })
                }
              />
              {errorMessage && (
                <p className="text-danger mt-2">{errorMessage}</p>
              )}
              <div className="d-flex">
                <button type="submit" className="btn btn-primary">
                  {editingReviewId ? "Update Review" : "Submit Review"}
                </button>
                {editingReviewId && (
                  <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>

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
                  modalType === "success" ? "bg-primary" : "bg-danger"
                } text-white`}
              >
                <h5 className="modal-title">
                  {modalType === "success" ? "Success" : "Error"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                />
              </div>
              <div className="modal-body">
                <p>{modalMessage}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
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

export default ResourceDetail;
