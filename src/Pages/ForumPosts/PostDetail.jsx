import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSinglePosts, updatePost } from "../../api/forumpostApi";
import {
  uploadDiscussion,
  showAlldiscussions,
  updateComments,
  deleteDiscussion,
} from "../../api/discussionApi";
import {
  postVote,
  viewVote,
  updateVote,
  getVoters,
  deleteVote,
} from "../../api/voteApi";
import { deletePosts } from "../../api/forumpostApi";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Slider from "react-slick";
import VoterLists from "./Layout/VoterLists";
import { Modal, Button } from "react-bootstrap";
import { Can } from "@casl/react";
import { AbilityContext } from "../../Authentication/PermissionForUser";

// Custom arrow components for the slider.
const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        right: "10px",
        zIndex: 2,
        width: "30px",
        height: "30px",
        background: "rgba(0,0,0,0.5)",
        borderRadius: "50%",
        padding: "5px",
      }}
      onClick={onClick}
    />
  );
};

const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        left: "10px",
        zIndex: 2,
        width: "30px",
        height: "30px",
        background: "rgba(0,0,0,0.5)",
        borderRadius: "50%",
        padding: "5px",
      }}
      onClick={onClick}
    />
  );
};

// Helper component to display an image with fallback in case of error.
function ImageWithFallback({ src, alt, style, ...props }) {
  const [error, setError] = useState(false);
  if (error || !src) return null;
  return (
    <img
      src={src}
      alt={alt}
      style={style}
      onError={() => setError(true)}
      {...props}
    />
  );
}

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [flag, setFlag] = useState(false);

  // Vote states
  const [userVote, setUserVote] = useState(null);
  const [voteCounts, setVoteCounts] = useState({ upvotes: 0, downvotes: 0 });
  const [voters, setVoters] = useState([]);
  const [showVoterPopup, setShowVoterPopup] = useState(false);

  // States for editing comments
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");

  // States for delete modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [showPostDeleteModal, setShowPostDeleteModal] = useState(false);

  const [updateValidationError, setUpdateValidationError] = useState("");
  const [updateDialogVisible, setUpdateDialogVisible] = useState(false);

  // States for update post modal
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    Title: "",
    Description: "",
    Photo1: null,
    Photo2: null,
    Photo3: null,
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Retrieve stored user (for demonstration, from localStorage)
  const storedUser = JSON.parse(localStorage.getItem("user"));

  // Get ability from CASL context
  const ability = useContext(AbilityContext);

  // Fetch post data.
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getSinglePosts(id);
        setPost(response.data);
        // Pre-fill update form with current post data.
        setUpdateForm({
          Title: response.data.Title,
          Description: response.data.Description,
          Photo1: null,
          Photo2: null,
          Photo3: null,
        });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  // Fetch discussions (comments) for the post.
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await showAlldiscussions(id);
        setComments(res.discussions || []);

        console.log(comments);
      } catch (err) {
        console.error("Error fetching discussions:", err);
      }
    };
    fetchComments();
  }, [id, flag]);

  console.log(storedUser);

  // Fetch vote counts.
  const updateVoteCounts = async () => {
    try {
      const data = await viewVote(id);
      setVoteCounts(data);
    } catch (err) {
      console.error("Error fetching vote counts:", err);
    }
  };

  // Fetch all votes and set both the voters list and the current user's vote.
  const updateVotes = async () => {
    try {
      const votersData = await getVoters(id);
      const votesArray = votersData.voters;
      setVoters(votesArray);
      if (storedUser) {
        const currentUserVote = votesArray.find(
          (vote) => vote.user.id === storedUser.id
        );
        setUserVote(currentUserVote || null);
      }
    } catch (err) {
      console.error("Error fetching votes:", err);
    }
  };

  useEffect(() => {
    updateVoteCounts();
    updateVotes();
  }, [id]);

  // Handle discussion (comment) submission.
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;
    try {
      const data = {
        ForumPostId: id,
        Content: newComment,
        UserId: storedUser.id,
      };
      await uploadDiscussion(data);
      setFlag((prev) => !prev);
      setNewComment("");
    } catch (err) {
      console.error("Error uploading discussion:", err);
    }
  };

  // Handle vote actions.
  const handleVote = async (voteTypeId) => {
    if (!storedUser) return;
    if (userVote) {
      if (userVote.vote_type_id === voteTypeId) {
        try {
          await deleteVote({ user_id: storedUser.id, ForumPostId: id });
          setUserVote(null);
          updateVoteCounts();
          updateVotes();
        } catch (err) {
          console.error("Error removing vote:", err);
        }
        return;
      } else {
        try {
          const response = await updateVote({
            user_id: storedUser.id,
            ForumPostId: id,
            vote_type_id: voteTypeId,
          });
          setUserVote(response.vote);
          await updateVoteCounts();
          await updateVotes();
        } catch (err) {
          console.error("Error updating vote:", err);
        }
      }
    } else {
      try {
        const response = await postVote({
          user_id: storedUser.id,
          ForumPostId: id,
          vote_type_id: voteTypeId,
        });
        setUserVote(response.vote);
        await updateVoteCounts();
        await updateVotes();
      } catch (err) {
        console.error("Error posting vote:", err);
      }
    }
  };

  // Handle editing a comment.
  const handleEditClick = (comment) => {
    if (storedUser && comment.user.id === storedUser.id) {
      setEditingCommentId(comment.id);
      setEditingCommentContent(comment.Content);
    }
  };

  const handleUpdateComment = async () => {
    if (editingCommentContent.trim() === "") return;
    try {
      const data = { Content: editingCommentContent };
      await updateComments(data, editingCommentId);
      setFlag((prev) => !prev);
      setEditingCommentId(null);
      setEditingCommentContent("");
    } catch (err) {
      console.error("Error updating comment:", err);
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingCommentContent("");
  };

  // Open delete modal and store the comment to delete.
  const openDeleteModal = (comment) => {
    setCommentToDelete(comment);
    setShowDeleteModal(true);
  };

  // Confirm deletion in the modal.
  const confirmDelete = async () => {
    try {
      await deleteDiscussion(commentToDelete.id);
      setFlag((prev) => !prev);
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
    setShowDeleteModal(false);
    setCommentToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCommentToDelete(null);
  };

  // Open update modal instead of navigating to a separate edit page.
  const handlePostEdit = () => {
    setShowUpdateModal(true);
  };

  // Handle post deletion.
  const handlePostDelete = () => {
    setShowPostDeleteModal(true);
  };

  const confirmPostDelete = () => {
    deletePosts(id)
      .then((res) => {
        console.log("Deleted post:", res);
        navigate(-1);
      })
      .catch((err) => {
        console.error("Error deleting post:", err);
      })
      .finally(() => {
        setShowPostDeleteModal(false);
      });
  };

  const cancelPostDelete = () => {
    setShowPostDeleteModal(false);
  };

  const handleDialogClose = () => {
    // Refetch latest post data
    getSinglePosts(id)
      .then((response) => {
        setPost(response.data);
      })
      .catch((err) => console.error("Error refreshing post:", err));
    setUpdateDialogVisible(false);
    setShowUpdateModal(false);
  };

  // --- Handlers for Update Post Modal ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm((prev) => ({ ...prev, [name]: value }));
    // Clear the error if the Title field is not empty
    if (name === "Title" && value.trim() !== "") {
      setUpdateValidationError("");
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setUpdateForm((prev) => ({ ...prev, [name]: files[0] }));
  };

  // Using promise-based updatePost function.
  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    // Validate Title and Description
    if (
      updateForm.Title.trim() === "" ||
      updateForm.Description.trim() === ""
    ) {
      setUpdateValidationError("Please Enter information");
      return;
    }
    setUpdateValidationError(""); // Clear any previous errors

    const formData = new FormData();
    formData.append("Title", updateForm.Title);
    formData.append("Description", updateForm.Description);
    if (updateForm.Photo1) formData.append("Photo1", updateForm.Photo1);
    if (updateForm.Photo2) formData.append("Photo2", updateForm.Photo2);
    if (updateForm.Photo3) formData.append("Photo3", updateForm.Photo3);

    updatePost(formData, id)
      .then((res) => {
        // Show update success dialog
        setUpdateDialogVisible(true);
      })
      .catch((err) => {
        console.error("Error updating post:", err);
      });
  };

  if (loading) return <div>Loading post...</div>;
  if (error) return <div>Error loading post: {error.message}</div>;

  // Collect photos if available.
  const photos = [];
  if (post.Photo1) photos.push(post.Photo1);
  if (post.Photo2) photos.push(post.Photo2);
  if (post.Photo3) photos.push(post.Photo3);

  const formattedDate = new Date(post.created_at).toLocaleDateString();

  // Slider settings.
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  // Click handler to open the image in a new tab.
  const handleImageClick = (photo) => {
    window.open(`http://127.0.0.1:8000/storage/${photo}`, "_blank");
  };

  return (
    <HelmetProvider>
      <Helmet>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />
        {/* Bootstrap CSS */}
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
        />
      </Helmet>

      <div className="container-fluid bg-light min-vh-100 post-detail-page">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 p-3">
            <div
              className="card my-3"
              style={{
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              }}
            >
              {photos.length > 0 && (
                <div className="overflow-hidden" style={{ maxHeight: "400px" }}>
                  <Slider {...sliderSettings}>
                    {photos.map((photo, index) => (
                      <div
                        key={index}
                        onClick={() => handleImageClick(photo)}
                        style={{ cursor: "pointer" }}
                      >
                        <ImageWithFallback
                          className="w-100 img-fluid"
                          style={{
                            maxHeight: "400px",
                            objectFit: "contain",
                          }}
                          src={`http://127.0.0.1:8000/storage/${photo}`}
                          alt={`${post.Title} - Slide ${index + 1}`}
                        />
                      </div>
                    ))}
                  </Slider>
                </div>
              )}

              <div className="d-flex align-items-center p-3 border-bottom">
                <ImageWithFallback
                  className="rounded-circle mr-3"
                  style={{ width: "50px", height: "50px" }}
                  src={
                    post.user?.ProfilePic
                      ? `http://127.0.0.1:8000/storage/${post.user.ProfilePic}`
                      : "/Customer/pic.jpg"
                  }
                  alt="User Avatar"
                />
                <div className="ml-2">
                  <div className="font-weight-bold h5 mb-0">
                    {post.user?.name || "Unknown"}
                  </div>
                  <div className="text-muted" style={{ fontSize: "14px" }}>
                    {formattedDate}
                  </div>
                </div>
                {storedUser && post.UserId === storedUser.id && (
                  <div className="ml-auto d-flex">
                    <button
                      onClick={handlePostEdit}
                      style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        fontSize: "16px",
                        color: "#007bff",
                        marginRight: "8px",
                      }}
                      title="Edit Post"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-pencil-square"
                        viewBox="0 0 16 16"
                      >
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                        <path
                          fillRule="evenodd"
                          d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                        />
                      </svg>
                    </button>

                    <button
                      onClick={handlePostDelete}
                      style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        fontSize: "16px",
                        color: "#dc3545",
                      }}
                      title="Delete Post"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-trash3-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              <div className="p-3 border-bottom">
                <h2 className="h4 mb-0">{post.Title}</h2>
              </div>

              <div className="p-3">
                <p
                  className="mb-0"
                  style={{
                    lineHeight: "1.6",
                    fontSize: "16px",
                    color: "#333",
                  }}
                >
                  {post.Description}
                </p>
              </div>

              <div className="d-flex flex-column align-items-center p-3 border-top">
                {ability.can("vote", "votes") && (
                  <div className="d-flex justify-content-around w-100 mb-2">
                    <button
                      style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        fontSize: "16px",
                        color:
                          userVote && userVote.vote_type_id === 1
                            ? "blue"
                            : "#555",
                      }}
                      onClick={() => handleVote(1)}
                    >
                      <i className="fas fa-arrow-up"></i> Upvote (
                      {voteCounts.upvotes})
                    </button>
                    <button
                      style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        fontSize: "16px",
                        color:
                          userVote && userVote.vote_type_id === 2
                            ? "red"
                            : "#555",
                      }}
                      onClick={() => handleVote(2)}
                    >
                      <i className="fas fa-arrow-down"></i> Downvote (
                      {voteCounts.downvotes})
                    </button>
                  </div>
                )}
                <div
                  className="text-secondary"
                  style={{ fontSize: "14px", cursor: "pointer" }}
                  onClick={() => setShowVoterPopup(true)}
                  title="Click to view voter list"
                >
                  Voters:{" "}
                  {voters && voters.length > 0
                    ? voters.map((vote) => vote.user.name).join(", ")
                    : "No voters yet."}
                </div>
              </div>

              <div className="p-3 border-top">
                <div className="h5 font-weight-bold mb-3">Discussions</div>
                <div
                  className="h-100"
                  style={{ maxHeight: "300px", overflowY: "auto" }}
                >
                  {comments && comments.length > 0 ? (
                    comments.map((comment, index) => (
                      <div
                        key={index}
                        className="d-flex align-items-center mb-3"
                      >
                        <ImageWithFallback
                          className="rounded-circle mr-2"
                          style={{ width: "40px", height: "40px" }}
                          src={
                            comment.user?.ProfilePic
                              ? `http://127.0.0.1:8000/storage/${comment.user.ProfilePic}`
                              : "/Customer/pic.jpg"
                          }
                          alt="Comment User Avatar"
                        />
                        <div className="flex-grow-1">
                          <div
                            className="font-weight-bold"
                            style={{ fontSize: "16px" }}
                          >
                            {comment.user?.name || "Unknown"}
                          </div>
                          {editingCommentId === comment.id ? (
                            <div className="d-flex flex-column mt-2">
                              <textarea
                                value={editingCommentContent}
                                onChange={(e) =>
                                  setEditingCommentContent(e.target.value)
                                }
                                className="form-control"
                              />
                              <div className="mt-2">
                                <button
                                  onClick={handleUpdateComment}
                                  className="btn btn-success btn-sm mr-2"
                                >
                                  Update
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="btn btn-danger btn-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div
                                style={{
                                  fontSize: "14px",
                                  color: "#555",
                                }}
                              >
                                {comment.Content}
                              </div>
                              <div
                                style={{
                                  fontSize: "12px",
                                  color: "#888",
                                }}
                              >
                                {new Date(comment.created_at).toLocaleString()}
                              </div>
                            </>
                          )}
                        </div>
                        {storedUser && editingCommentId !== comment.id && (
                          <div className="d-flex">
                            {comment.user?.id === storedUser.id &&
                              ability.can("update", "discussion") && (
                                <button
                                  onClick={() => handleEditClick(comment)}
                                  style={{
                                    border: "none",
                                    background: "none",
                                    cursor: "pointer",
                                    fontSize: "16px",
                                    color: "#007bff",
                                    marginLeft: "8px",
                                  }}
                                  title="Edit Comment"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-pencil-square"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                    <path
                                      fillRule="evenodd"
                                      d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                                    />
                                  </svg>
                                </button>
                              )}
                            {(comment.user?.id === storedUser.id ||
                              storedUser.role === "manager" ||
                              storedUser.role === "librarian") && (
                              <button
                                onClick={() => openDeleteModal(comment)}
                                style={{
                                  border: "none",
                                  background: "none",
                                  cursor: "pointer",
                                  fontSize: "16px",
                                  marginLeft: "8px",
                                }}
                                title="Delete Comment"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-trash"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1 1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                </svg>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div>No comments yet.</div>
                  )}
                </div>

                <form
                  className="d-flex align-items-center mt-3"
                  onSubmit={handleCommentSubmit}
                >
                  <textarea
                    placeholder="Add a comment..."
                    className="form-control"
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                    }}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button className="btn btn-primary ml-2" type="submit">
                    Post
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Post Modal */}
      {showUpdateModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContainer}>
            <div style={styles.modalHeader}>
              <span style={styles.modalHeaderTitle}>Update Post</span>
              <button
                style={styles.modalCloseButton}
                onClick={() => setShowUpdateModal(false)}
              >
                &times;
              </button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.modalUserSection}>
                <img
                  src={
                    storedUser && storedUser.ProfilePic
                      ? `http://127.0.0.1:8000/storage/${storedUser.ProfilePic}`
                      : "/Customer/pic.jpg"
                  }
                  alt="User Avatar"
                  style={styles.modalUserAvatar}
                />
                <textarea
                  style={styles.modalTextArea}
                  placeholder={`What's on your mind, ${storedUser?.name}?`}
                  name="Description"
                  value={updateForm.Description}
                  onChange={handleInputChange}
                />
              </div>
              {updateForm.Description.trim() === "" && (
                <div style={{ color: "red", marginTop: "4px" }}>
                  Please Enter information
                </div>
              )}

              <div style={{ marginBottom: "16px" }}>
                <input
                  type="text"
                  placeholder="Title (optional)"
                  name="Title"
                  value={updateForm.Title}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "1rem",
                  }}
                />
                {updateValidationError && (
                  <div style={{ color: "red", marginTop: "4px" }}>
                    {updateValidationError}
                  </div>
                )}
              </div>
              <div style={styles.fileInputGroup}>
                <label style={styles.fileInputLabel}>Upload Photo 1</label>
                <input
                  type="file"
                  name="Photo1"
                  accept="image/*"
                  style={styles.fileInput}
                  onChange={handleFileChange}
                />
              </div>
              <div style={styles.fileInputGroup}>
                <label style={styles.fileInputLabel}>Upload Photo 2</label>
                <input
                  type="file"
                  name="Photo2"
                  accept="image/*"
                  style={styles.fileInput}
                  onChange={handleFileChange}
                />
              </div>
              <div style={styles.fileInputGroup}>
                <label style={styles.fileInputLabel}>Upload Photo 3</label>
                <input
                  type="file"
                  name="Photo3"
                  accept="image/*"
                  style={styles.fileInput}
                  onChange={handleFileChange}
                />
              </div>
              {updateSuccess && (
                <div
                  style={{
                    color: "green",
                    marginTop: "8px",
                    fontWeight: "bold",
                  }}
                >
                  Post updated successfully!
                </div>
              )}
              <div style={styles.modalFooter}>
                <button
                  style={styles.modalFooterButton}
                  onClick={handleUpdateSubmit}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal for Comments */}
      <Modal show={showDeleteModal} onHide={cancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this discussion?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal for Post */}
      <Modal show={showPostDeleteModal} onHide={cancelPostDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Post Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this post?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelPostDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmPostDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {showVoterPopup && (
        <VoterLists
          id={id}
          onClose={() => setShowVoterPopup(false)}
          show={showVoterPopup}
        />
      )}

      {updateDialogVisible && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center",
              width: "300px",
            }}
          >
            <p>Post updated successfully!</p>
            <button className="btn btn-primary" onClick={handleDialogClose}>
              Close
            </button>
          </div>
        </div>
      )}
    </HelmetProvider>
  );
}

// Inline styles for the update modal.
const styles = {
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1050,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    width: "90%",
    maxWidth: "500px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    padding: "16px",
    borderBottom: "1px solid #ddd",
  },
  modalHeaderTitle: {
    fontSize: "1.25rem",
    fontWeight: "bold",
  },
  modalCloseButton: {
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
  },
  modalBody: {
    padding: "16px",
  },
  modalUserSection: {
    display: "flex",
    alignItems: "center",
    marginBottom: "16px",
  },
  modalUserAvatar: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    marginRight: "12px",
  },
  modalTextArea: {
    flex: 1,
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    minHeight: "80px",
    fontSize: "1rem",
  },
  fileInputGroup: {
    marginBottom: "12px",
  },
  fileInputLabel: {
    display: "block",
    marginBottom: "4px",
    fontWeight: "bold",
  },
  fileInput: {
    width: "100%",
  },
  modalFooter: {
    textAlign: "right",
    paddingTop: "12px",
  },
  modalFooterButton: {
    padding: "8px 16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default PostDetail;
