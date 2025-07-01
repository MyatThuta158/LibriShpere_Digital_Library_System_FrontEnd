import React, { useEffect, useState, useRef } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import InfiniteScroll from "react-infinite-scroll-component";
import { getPosts, uploadPost } from "../../api/forumpostApi";
import { useNavigate } from "react-router-dom";

function PostsFeed() {
  // All posts fetched from the backend.
  const [allPosts, setAllPosts] = useState([]);
  // Posts currently rendered in infinite scroll.
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [refreshCount, setRefreshCount] = useState(0);
  // Modal state for creating a post.
  const [showModal, setShowModal] = useState(false);
  const [postForm, setPostForm] = useState({
    Title: "",
    Description: "",
    Photo1: null,
    Photo2: null,
    Photo3: null,
  });
  // Upload status messages.
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");

  // New state for the success dialog box.
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Error states for text inputs.
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  // State for the search query.
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  // We'll use a ref to track our current index in allPosts.
  const currentIndexRef = useRef(0);
  // Define the number of posts to load per batch.
  const batchSize = 10;

  const userStorage = JSON.parse(localStorage.getItem("user") || "{}");
  // Simulated current user; replace with actual auth data as needed.
  const currentUser = userStorage;

  // Forbidden keywords list.
  const forbiddenKeywords = ["$", "sales", "cash on delivery", "COD", "price"];

  // Helper function to check if text contains forbidden keywords (case-insensitive).
  const containsForbiddenKeywords = (text) => {
    if (!text) return false;
    return forbiddenKeywords.some((keyword) =>
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  // Fetch posts from the backend when the component mounts or refreshCount changes.
  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshCount]);

  const fetchPosts = async () => {
    try {
      const response = await getPosts();
      if (response.success) {
        setAllPosts(response.data);
        // Set initial batch of posts from the beginning of the list.
        const initialPosts = response.data.slice(0, batchSize);
        setDisplayedPosts(initialPosts);
        // Update our pointer using modulo (in case there are fewer posts than batchSize).
        currentIndexRef.current = batchSize % response.data.length;
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // Function to load more posts (cycling through allPosts).
  const loadMorePosts = () => {
    if (allPosts.length === 0) return;
    let newPosts = [];
    for (let i = 0; i < batchSize; i++) {
      newPosts.push(allPosts[currentIndexRef.current]);
      // Cycle the index using modulo arithmetic.
      currentIndexRef.current = (currentIndexRef.current + 1) % allPosts.length;
    }
    setDisplayedPosts((prevPosts) => [...prevPosts, ...newPosts]);
  };

  // Modal handlers.
  const openModal = () => {
    setUploadMessage("");
    setUploadError("");
    setTitleError("");
    setDescriptionError("");
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostForm((prev) => ({ ...prev, [name]: value }));
    // Clear error messages as the user enters text.
    if (name === "Title" && value.trim()) {
      setTitleError("");
    }
    if (name === "Description" && value.trim()) {
      setDescriptionError("");
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setPostForm((prev) => ({ ...prev, [name]: files[0] }));
  };

  // Retrieve user info from local storage (if needed).
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.id || 1; // Fallback to 1 if user not in local storage

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setUploadMessage("");
    setUploadError("");

    // Validate empty fields and set error messages under the related inputs.
    let valid = true;
    if (!postForm.Title.trim()) {
      setTitleError("Please enter information");
      valid = false;
    } else {
      setTitleError("");
    }
    if (!postForm.Description.trim()) {
      setDescriptionError("Please enter information");
      valid = false;
    } else {
      setDescriptionError("");
    }
    if (!valid) return;

    // Check for forbidden keywords in Title and Description.
    if (
      containsForbiddenKeywords(postForm.Title) ||
      containsForbiddenKeywords(postForm.Description)
    ) {
      setUploadError("Your post does not match our community standard");
      return;
    }

    const formData = new FormData();
    formData.append("UserId", userId);
    formData.append("Title", postForm.Title);
    formData.append("Description", postForm.Description);
    if (postForm.Photo1) formData.append("Photo1", postForm.Photo1);
    if (postForm.Photo2) formData.append("Photo2", postForm.Photo2);
    if (postForm.Photo3) formData.append("Photo3", postForm.Photo3);

    try {
      const response = await uploadPost(formData);
      if (response.success) {
        // Instead of auto-dismissing the dialog, show it until the user clicks "Close".
        setShowSuccessDialog(true);

        // Reset form state.
        setPostForm({
          Title: "",
          Description: "",
          Photo1: null,
          Photo2: null,
          Photo3: null,
        });
      } else {
        setUploadError("Failed to upload post.");
      }
    } catch (error) {
      console.error("Error uploading post:", error);
      setUploadError("Error uploading post.");
    }
  };

  // Handler for closing the success dialog.
  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
    // Trigger refresh to fetch posts data after closing the dialog.
    setRefreshCount((prev) => prev + 1);
    // Optionally, close the modal as well.
    closeModal();
  };

  const baseStorageUrl = "http://127.0.0.1:8000/storage";

  const styles = {
    pageSection: {
      display: "flex",
      background: "#f0f2f5",
      minHeight: "100vh",
    },
    mainContent: {
      flex: 1,
      padding: "20px",
      marginLeft: "20px",
    },
    container: {
      maxWidth: "800px",
      margin: "0 auto",
    },
    createPostButton: {
      width: "100%",
      padding: "14px 20px",
      background: "#fff",
      borderRadius: "8px",
      boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
      border: "1px solid #ddd",
      cursor: "pointer",
      marginBottom: "20px",
      textAlign: "left",
      fontSize: "1rem",
      color: "#65676b",
      display: "flex",
      alignItems: "center",
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      padding: "20px",
    },
    modalContainer: {
      background: "#fff",
      borderRadius: "10px",
      width: "100%",
      maxWidth: "600px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
      overflow: "hidden",
    },
    modalHeader: {
      padding: "16px",
      borderBottom: "1px solid #ddd",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    modalHeaderTitle: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      color: "#050505",
    },
    modalCloseButton: {
      background: "none",
      border: "none",
      fontSize: "1.5rem",
      cursor: "pointer",
      color: "#65676b",
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
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      objectFit: "cover",
      marginRight: "10px",
    },
    modalTextArea: {
      width: "100%",
      border: "none",
      resize: "none",
      fontSize: "1rem",
      outline: "none",
    },
    fileInputGroup: {
      marginBottom: "16px",
    },
    fileInputLabel: {
      display: "block",
      marginBottom: "8px",
      fontWeight: "600",
      color: "#555",
    },
    fileInput: {
      width: "100%",
      padding: "8px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      fontSize: "1rem",
    },
    modalFooter: {
      padding: "16px",
      borderTop: "1px solid #ddd",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    modalFooterButton: {
      background: "#1877f2",
      border: "none",
      color: "#fff",
      padding: "10px 20px",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
    },
    postCard: {
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      marginBottom: "20px",
      overflow: "hidden",
      border: "1px solid #ddd",
    },
    postHeader: {
      display: "flex",
      alignItems: "center",
      padding: "16px",
    },
    avatar: {
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      marginRight: "10px",
      objectFit: "cover",
    },
    userInfo: {
      display: "flex",
      flexDirection: "column",
    },
    userName: {
      fontWeight: "bold",
      fontSize: "1rem",
      marginBottom: "4px",
    },
    date: {
      fontSize: "0.8rem",
      color: "#666",
    },
    bannerImage: {
      width: "100%",
      height: "300px",
      objectFit: "contain",
      backgroundColor: "#f0f0f0",
    },
    postContent: {
      padding: "16px",
    },
    postTitle: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      marginBottom: "8px",
      cursor: "pointer",
    },
    postDescription: {
      fontSize: "1rem",
      lineHeight: "1.5",
      color: "#555",
      marginBottom: "16px",
    },
    readMore: {
      fontSize: "0.9rem",
      color: "#1877f2",
      cursor: "pointer",
      textDecoration: "none",
      fontWeight: "bold",
    },
    messageSuccess: {
      color: "green",
      marginBottom: "16px",
      fontWeight: "bold",
    },
    messageError: {
      color: "red",
      marginBottom: "16px",
      fontWeight: "bold",
    },
    searchBarContainer: {
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
    },
    searchInput: {
      padding: "10px",
      flex: "1",
      borderRadius: "4px",
      border: "1px solid #ccc",
    },
    clearButton: {
      marginLeft: "10px",
      padding: "10px",
      borderRadius: "4px",
      border: "none",
      background: "#1877f2",
      color: "#fff",
      cursor: "pointer",
    },
    sliderContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      marginBottom: "10px",
    },
    sliderButton: {
      position: "absolute",
      background: "#1877f2",
      color: "#fff",
      border: "none",
      padding: "8px 12px",
      borderRadius: "4px",
      cursor: "pointer",
      top: "50%",
      transform: "translateY(-50%)",
    },
    sliderButtonLeft: {
      left: "0",
    },
    sliderButtonRight: {
      right: "0",
    },
    // Styles for the success dialog box.
    successDialogOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2000,
    },
    successDialogContainer: {
      background: "#fff",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      textAlign: "center",
    },
    successDialogButton: {
      marginTop: "10px",
      padding: "8px 16px",
      background: "#1877f2",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
  };

  // Inline component for image slider functionality.
  const ImageSlider = ({ post }) => {
    const initialImages = [];
    if (post.Photo1) initialImages.push(`${baseStorageUrl}/${post.Photo1}`);
    if (post.Photo2) initialImages.push(`${baseStorageUrl}/${post.Photo2}`);
    if (post.Photo3) initialImages.push(`${baseStorageUrl}/${post.Photo3}`);

    const [validImages, setValidImages] = useState(initialImages);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Handle image load errors by removing the failed image.
    const handleImageError = (index) => {
      setValidImages((prevImages) => {
        const updated = [...prevImages];
        updated.splice(index, 1);
        return updated;
      });
      setCurrentIndex(0);
    };

    if (validImages.length === 0) return null;

    if (validImages.length === 1) {
      return (
        <img
          src={validImages[0]}
          alt={post.Title}
          style={styles.bannerImage}
          onError={() => handleImageError(0)}
        />
      );
    }

    return (
      <div style={styles.sliderContainer}>
        {validImages.length > 1 && (
          <button
            onClick={() =>
              setCurrentIndex(
                (prev) => (prev - 1 + validImages.length) % validImages.length
              )
            }
            style={{ ...styles.sliderButton, ...styles.sliderButtonLeft }}
          >
            &#10094;
          </button>
        )}
        <img
          src={validImages[currentIndex]}
          alt={post.Title}
          style={styles.bannerImage}
          onError={() => handleImageError(currentIndex)}
        />
        {validImages.length > 1 && (
          <button
            onClick={() =>
              setCurrentIndex((prev) => (prev + 1) % validImages.length)
            }
            style={{ ...styles.sliderButton, ...styles.sliderButtonRight }}
          >
            &#10095;
          </button>
        )}
      </div>
    );
  };

  // Function to truncate post descriptions.
  const truncateDescription = (description, postId) => {
    const words = description.split(" ");
    if (words.length > 20) {
      return (
        <>
          {words.slice(0, 20).join(" ")}...{" "}
          <span
            style={styles.readMore}
            onClick={() => navigate(`/community/postdetail/${postId}`)}
          >
            See More
          </span>
        </>
      );
    }
    return description;
  };

  // Compute filtered posts based on the search query.
  const filteredPosts = searchQuery
    ? allPosts.filter((post) =>
        post.Title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  return (
    <HelmetProvider>
      <div>
        {/* Success dialog box */}
        {showSuccessDialog && (
          <div style={styles.successDialogOverlay}>
            <div style={styles.successDialogContainer}>
              <h3>Post uploaded successfully!</h3>
              <button
                style={styles.successDialogButton}
                onClick={handleCloseSuccessDialog}
              >
                Close
              </button>
            </div>
          </div>
        )}
        <section style={styles.pageSection}>
          <div style={styles.mainContent} className="main-content">
            <div style={styles.container} className="container">
              {/* Search Bar */}
              <div style={styles.searchBarContainer}>
                <input
                  type="text"
                  placeholder="Search posts by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={styles.searchInput}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    style={styles.clearButton}
                  >
                    Clear
                  </button>
                )}
              </div>
              {/* Create Post Button */}
              <div style={styles.createPostButton} onClick={openModal}>
                <img
                  src={
                    currentUser.ProfilePic
                      ? `http://127.0.0.1:8000/storage/${currentUser.ProfilePic}`
                      : "/Customer/pic.jpg"
                  }
                  alt="User Avatar"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    marginRight: "10px",
                    objectFit: "cover",
                  }}
                />
                What's on your mind, {currentUser.name}?
              </div>
              {/* Modal for Creating a Post */}
              {showModal && (
                <div style={styles.modalOverlay}>
                  <div style={styles.modalContainer}>
                    <div style={styles.modalHeader}>
                      <span style={styles.modalHeaderTitle}>Create Post</span>
                      <button
                        style={styles.modalCloseButton}
                        onClick={closeModal}
                      >
                        &times;
                      </button>
                    </div>
                    <div style={styles.modalBody}>
                      <div style={styles.modalUserSection}>
                        <img
                          src={
                            currentUser.ProfilePic
                              ? `${baseStorageUrl}/${currentUser.ProfilePic}`
                              : "/Customer/pic.jpg"
                          }
                          alt="User Avatar"
                          style={styles.modalUserAvatar}
                        />
                        <textarea
                          style={styles.modalTextArea}
                          placeholder={`What's on your mind, ${currentUser.name}?`}
                          name="Description"
                          value={postForm.Description}
                          onChange={handleInputChange}
                        />
                      </div>
                      {/* Display Description Error */}
                      {descriptionError && (
                        <div
                          style={{
                            color: "red",
                            fontSize: "0.8rem",
                            marginTop: "4px",
                          }}
                        >
                          {descriptionError}
                        </div>
                      )}
                      {/* Title Input */}
                      <div style={{ marginBottom: "16px" }}>
                        <input
                          type="text"
                          placeholder="Title (optional)"
                          name="Title"
                          value={postForm.Title}
                          onChange={handleInputChange}
                          style={{
                            width: "100%",
                            padding: "10px",
                            border: "1px solid #ddd",
                            borderRadius: "6px",
                            fontSize: "1rem",
                          }}
                        />
                        {/* Display Title Error */}
                        {titleError && (
                          <div
                            style={{
                              color: "red",
                              fontSize: "0.8rem",
                              marginTop: "4px",
                            }}
                          >
                            {titleError}
                          </div>
                        )}
                      </div>
                      {/* File Inputs */}
                      <div style={styles.fileInputGroup}>
                        <label style={styles.fileInputLabel}>
                          Upload Photo 1
                        </label>
                        <input
                          type="file"
                          name="Photo1"
                          accept="image/*"
                          style={styles.fileInput}
                          onChange={handleFileChange}
                        />
                      </div>
                      <div style={styles.fileInputGroup}>
                        <label style={styles.fileInputLabel}>
                          Upload Photo 2
                        </label>
                        <input
                          type="file"
                          name="Photo2"
                          accept="image/*"
                          style={styles.fileInput}
                          onChange={handleFileChange}
                        />
                      </div>
                      <div style={styles.fileInputGroup}>
                        <label style={styles.fileInputLabel}>
                          Upload Photo 3
                        </label>
                        <input
                          type="file"
                          name="Photo3"
                          accept="image/*"
                          style={styles.fileInput}
                          onChange={handleFileChange}
                        />
                      </div>
                      {/* Display Upload Status Messages */}
                      {uploadMessage && (
                        <div style={styles.messageSuccess}>{uploadMessage}</div>
                      )}
                      {uploadError && (
                        <div style={styles.messageError}>{uploadError}</div>
                      )}
                      <div style={styles.modalFooter}>
                        <button
                          style={styles.modalFooterButton}
                          onClick={handleFormSubmit}
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Display posts: either filtered or infinite scroll */}
              {searchQuery ? (
                filteredPosts.map((post, index) => (
                  <div
                    key={`${post.ForumPostId}-${index}`}
                    style={styles.postCard}
                  >
                    <div style={styles.postHeader}>
                      <img
                        src={
                          post.user.ProfilePic
                            ? `${baseStorageUrl}/${post.user.ProfilePic}`
                            : "/Customer/pic.jpg"
                        }
                        alt="User Avatar"
                        style={styles.avatar}
                      />
                      <div style={styles.userInfo}>
                        <div style={styles.userName}>
                          {post.user.name || "Anonymous"}
                        </div>
                        <div style={styles.date}>
                          {new Date(post.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {/* Inline image slider */}
                    <ImageSlider post={post} />
                    <div style={styles.postContent}>
                      <h2
                        style={styles.postTitle}
                        onClick={() =>
                          navigate(`/community/postdetail/${post.ForumPostId}`)
                        }
                      >
                        {post.Title}
                      </h2>
                      <p style={styles.postDescription}>
                        {truncateDescription(
                          post.Description,
                          post.ForumPostId
                        )}
                      </p>
                    </div>
                    <div style={{ padding: "0 16px 16px" }}>
                      <span
                        style={styles.readMore}
                        onClick={() =>
                          navigate(`/community/postdetail/${post.ForumPostId}`)
                        }
                      >
                        Read More →
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <InfiniteScroll
                  dataLength={displayedPosts.length}
                  next={loadMorePosts}
                  hasMore={true} // Always true so it loops endlessly.
                  loader={<h4>Loading...</h4>}
                >
                  {displayedPosts.map((post, index) => (
                    <div
                      key={`${post.ForumPostId}-${index}`}
                      style={styles.postCard}
                    >
                      <div style={styles.postHeader}>
                        <img
                          src={
                            post.user.ProfilePic
                              ? `${baseStorageUrl}/${post.user.ProfilePic}`
                              : "/Customer/pic.jpg"
                          }
                          alt="User Avatar"
                          style={styles.avatar}
                        />
                        <div style={styles.userInfo}>
                          <div style={styles.userName}>
                            {post.user.name || "Anonymous"}
                          </div>
                          <div style={styles.date}>
                            {new Date(post.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      {/* Inline image slider */}
                      <ImageSlider post={post} />
                      <div style={styles.postContent}>
                        <h2
                          style={styles.postTitle}
                          onClick={() =>
                            navigate(
                              `/community/postdetail/${post.ForumPostId}`
                            )
                          }
                        >
                          {post.Title}
                        </h2>
                        <p style={styles.postDescription}>
                          {truncateDescription(
                            post.Description,
                            post.ForumPostId
                          )}
                        </p>
                      </div>
                      <div style={{ padding: "0 16px 16px" }}>
                        <span
                          style={styles.readMore}
                          onClick={() =>
                            navigate(
                              `/community/postdetail/${post.ForumPostId}`
                            )
                          }
                        >
                          Read More →
                        </span>
                      </div>
                    </div>
                  ))}
                </InfiniteScroll>
              )}
            </div>
          </div>
        </section>
      </div>
    </HelmetProvider>
  );
}

export default PostsFeed;
