import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { showUseruploadedPost } from "../../api/forumpostApi";
import { getSubscriptionDate } from "../../api/subscriptionApi";
import {
  updatePfinfo,
  resetUserPassword,
  getUserInfo,
} from "../../api/memberApi";

function UserPostsDisplay() {
  const [userPosts, setUserPosts] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // State for modals and forms
  const [showUpdateProfileModal, setShowUpdateProfileModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  // State for update form data and client-side form errors
  const [updateFormData, setUpdateFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    DateOfBirth: "",
    ProfilePic: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // Retrieve user from local storage
  const user = JSON.parse(localStorage.getItem("user"));

  // Function to fetch user info and posts (for initial load)
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getUserInfo(user.id);
      if (response && response.user) {
        setUserInfo(response.user);
        setUpdateFormData({
          name: response.user.name || "",
          email: response.user.email || "",
          phone_number: response.user.phone_number || "",
          DateOfBirth: response.user.DateOfBirth || "",
          ProfilePic: "", // Leave empty; file uploads handled separately.
        });
      }
    } catch (error) {
      console.error("Error fetching user info", error);
    }

    if (userInfo && userInfo.role === "member") {
      try {
        const subscriptionResponse = await getSubscriptionDate(user.id);
        setSubscriptionInfo(subscriptionResponse.data);
      } catch (error) {
        console.error("Error fetching subscription data", error);
      }
    }

    try {
      const postsResponse = await showUseruploadedPost(user.id);
      if (postsResponse.success) {
        setUserPosts(postsResponse.data);
      } else {
        setUserPosts([]);
      }
    } catch (err) {
      setUserPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch on component mount.
  useEffect(() => {
    if (user && user.id) {
      fetchData();
    }
  }, [user.id]);

  // Helper function to render truncated text with a clickable "see more" link.
  const renderTruncatedText = (text, postId, wordLimit = 20) => {
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return (
      <>
        {words.slice(0, wordLimit).join(" ")}{" "}
        <Link to={`/community/postdetail/${postId}`} style={{ color: "blue" }}>
          see more
        </Link>
      </>
    );
  };

  // Open update profile modal.
  const handleProfileUpdate = () => {
    setFormErrors({});
    setShowUpdateProfileModal(true);
  };

  // Open reset password modal.
  const handleResetPasswordClick = () => {
    setPasswordError("");
    setCurrentPassword("");
    setNewPassword("");
    setShowResetPasswordModal(true);
  };

  // Handle reset password submission.
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setPasswordError("Please enter both your current and new password.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      return;
    }
    const letterRegex = /[A-Za-z]/;
    const numberRegex = /[0-9]/;
    const specialCharRegex = /[@$!%*#?&]/;
    if (
      !letterRegex.test(newPassword) ||
      !numberRegex.test(newPassword) ||
      !specialCharRegex.test(newPassword)
    ) {
      setPasswordError(
        "Password must contain at least one letter, one number, and one special character."
      );
      return;
    }
    try {
      const response = await resetUserPassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setPasswordError("");
      if (response.message) {
        setResetSuccess(true);
        setTimeout(() => {
          setResetSuccess(false);
          setShowResetPasswordModal(false);
        }, 2000);
      }
    } catch (error) {
      setPasswordError(
        error.response?.data?.message ||
          "There was an error resetting your password."
      );
    }
  };

  // Handle update profile submission.
  const handleUpdateProfileSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    const errors = {};
    if (!updateFormData.name.trim()) errors.name = "Name is required.";
    if (!updateFormData.email.trim()) errors.email = "Email is required.";
    if (!updateFormData.phone_number.trim())
      errors.phone_number = "Phone number is required.";
    if (!updateFormData.DateOfBirth)
      errors.DateOfBirth = "Date of Birth is required.";
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    try {
      let formData;
      if (updateFormData.ProfilePic instanceof File) {
        formData = new FormData();
        formData.append("name", updateFormData.name);
        formData.append("email", updateFormData.email);
        formData.append("phone_number", updateFormData.phone_number);
        formData.append("DateOfBirth", updateFormData.DateOfBirth);
        formData.append("ProfilePic", updateFormData.ProfilePic);
      } else {
        formData = {
          name: updateFormData.name,
          email: updateFormData.email,
          phone_number: updateFormData.phone_number,
          DateOfBirth: updateFormData.DateOfBirth,
        };
      }
      // Call the API to update the profile.
      const response = await updatePfinfo(formData, user.id);
      if (response.user) {
        setUserInfo(response.user);
        // Update local storage.
        const localStorageUser = JSON.parse(localStorage.getItem("user")) || {};
        if (
          updateFormData.ProfilePic instanceof File &&
          response.user.ProfilePic
        ) {
          localStorageUser.ProfilePic = response.user.ProfilePic;
        }
        localStorageUser.name = response.user.name;
        localStorageUser.email = response.user.email;
        localStorageUser.phone_number = response.user.phone_number;
        localStorageUser.DateOfBirth = response.user.DateOfBirth;
        localStorageUser.role = response.user.role;
        localStorageUser.gender = response.user.gender;
        localStorageUser.updated_at = response.user.updated_at;
        localStorage.setItem("user", JSON.stringify(localStorageUser));
      }
      // Close the update modal and show the success dialog.
      setShowUpdateProfileModal(false);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Render the user profile card.
  const renderProfileCard = () => {
    if (!userInfo) return null;
    return (
      <div className="card shadow mx-auto mb-4" style={{ maxWidth: "600px" }}>
        <div className="card-header text-center">
          <h4>User Profile</h4>
        </div>
        <div className="card-body">
          <div className="d-flex align-items-center mb-3">
            <img
              src={
                userInfo.ProfilePic
                  ? `http://127.0.0.1:8000/storage/${userInfo.ProfilePic}`
                  : "/Customer/pic.jpg"
              }
              alt="Profile"
              className="rounded-circle me-3"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
            <div>
              <h5 className="mb-0">{userInfo.name}</h5>
              <small className="text-muted">{userInfo.role}</small>
            </div>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <strong>Email:</strong> {userInfo.email}
            </li>
            <li className="list-group-item">
              <strong>Phone:</strong> {userInfo.phone_number}
            </li>
            <li className="list-group-item">
              <strong>DOB:</strong> {userInfo.DateOfBirth}
            </li>
          </ul>
        </div>
        <div className="card-footer d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-secondary me-2"
            onClick={handleResetPasswordClick}
          >
            Reset Password
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleProfileUpdate}
          >
            Update Profile
          </button>
        </div>
      </div>
    );
  };

  // Render the subscription information card.
  const renderSubscriptionCard = () => {
    if (!subscriptionInfo) return null;
    return (
      <div className="card shadow mx-auto mb-4" style={{ maxWidth: "600px" }}>
        <div className="card-header text-center">
          <h4>Subscription Details</h4>
        </div>
        <div className="card-body text-center">
          <p className="card-text">
            <strong>Subscription ID:</strong> {subscriptionInfo.subscription_id}
            <br />
            <strong>Membership Plan:</strong>{" "}
            {subscriptionInfo.membership_plan_name} <br />
            <strong>Start Date:</strong> {subscriptionInfo.subscribed_date}{" "}
            <br />
            <strong>End Date:</strong> {subscriptionInfo.subscription_end_date}{" "}
            <br />
            <strong>Days Left:</strong> {subscriptionInfo.days_left}{" "}
            {subscriptionInfo.days_left > 0 ? "days" : "day"}
          </p>
        </div>
      </div>
    );
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container my-5">
      {renderProfileCard()}
      {userInfo && userInfo.role === "member" && renderSubscriptionCard()}
      <div className="row">
        {userPosts.length > 0 ? (
          userPosts.map((post) => (
            <div key={post.ForumPostId} className="col-md-6 mb-4">
              <div className="card h-100 shadow">
                <div className="card-body">
                  <h5 className="card-title">{post.Title}</h5>
                  <p className="card-text">
                    {renderTruncatedText(post.Description, post.ForumPostId)}
                  </p>
                  <small className="text-muted">
                    Posted on: {new Date(post.created_at).toLocaleDateString()}
                  </small>
                </div>
                <div className="card-footer d-flex justify-content-between align-items-center">
                  <div>
                    <span className="me-3">
                      <i className="fas fa-thumbs-up"></i> Upvotes:{" "}
                      {
                        post.votes.filter(
                          (vote) =>
                            vote.vote_type &&
                            vote.vote_type.VoteType.toLowerCase() === "upvote"
                        ).length
                      }
                    </span>
                    <span className="me-3">
                      <i className="fas fa-thumbs-down"></i> Downvotes:{" "}
                      {
                        post.votes.filter(
                          (vote) =>
                            vote.vote_type &&
                            vote.vote_type.VoteType.toLowerCase() === "downvote"
                        ).length
                      }
                    </span>
                    <span className="me-3">
                      <i className="fas fa-comments"></i> Discussions:{" "}
                      {post.discussions_count || 0}
                    </span>
                  </div>
                  <div className="text-end">
                    <Link
                      to={`/community/postdetail/${post.ForumPostId}`}
                      className="btn btn-primary"
                    >
                      Detail
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <h5>No uploaded posts</h5>
          </div>
        )}
      </div>

      {/* Reset Password Modal */}
      {showResetPasswordModal && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <div className="modal-content p-4">
              <h5 className="mb-3">Reset Password</h5>
              <form onSubmit={handleResetPasswordSubmit}>
                <div className="mb-3">
                  <label>Current Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      if (passwordError) setPasswordError("");
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label>New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (passwordError) setPasswordError("");
                    }}
                  />
                </div>
                {passwordError && (
                  <div className="text-danger mb-3">{passwordError}</div>
                )}
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={() => setShowResetPasswordModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </form>
              {resetSuccess && (
                <div className="alert alert-success mt-3">
                  Password updated successfully!
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Update Profile Modal */}
      {showUpdateProfileModal && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <div className="modal-content p-4">
              <h5 className="mb-3">Update Profile</h5>
              <form onSubmit={handleUpdateProfileSubmit}>
                <div className="mb-3">
                  <label>Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={updateFormData.name}
                    onChange={(e) =>
                      setUpdateFormData({
                        ...updateFormData,
                        name: e.target.value,
                      })
                    }
                  />
                  {formErrors.name && (
                    <div className="text-danger">{formErrors.name}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={updateFormData.email}
                    onChange={(e) =>
                      setUpdateFormData({
                        ...updateFormData,
                        email: e.target.value,
                      })
                    }
                  />
                  {formErrors.email && (
                    <div className="text-danger">{formErrors.email}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label>Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    value={updateFormData.phone_number}
                    onChange={(e) =>
                      setUpdateFormData({
                        ...updateFormData,
                        phone_number: e.target.value,
                      })
                    }
                  />
                  {formErrors.phone_number && (
                    <div className="text-danger">{formErrors.phone_number}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    className="form-control"
                    value={updateFormData.DateOfBirth}
                    onChange={(e) =>
                      setUpdateFormData({
                        ...updateFormData,
                        DateOfBirth: e.target.value,
                      })
                    }
                  />
                  {formErrors.DateOfBirth && (
                    <div className="text-danger">{formErrors.DateOfBirth}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label>Profile Picture</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) =>
                      setUpdateFormData({
                        ...updateFormData,
                        ProfilePic: e.target.files[0],
                      })
                    }
                  />
                  {formErrors.ProfilePic && (
                    <div className="text-danger">{formErrors.ProfilePic}</div>
                  )}
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={() => setShowUpdateProfileModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Success Dialog Modal */}
      {showSuccessDialog && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <div className="modal-content p-4">
              <h5 className="mb-3">Profile Updated Successfully!</h5>
              <p>Your user information has been updated.</p>
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => window.location.reload()}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Simple modal CSS */}
      <style>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1050;
        }
        .modal-dialog {
          background: #fff;
          border-radius: 5px;
          max-width: 500px;
          width: 100%;
        }
      `}</style>
    </div>
  );
}

export default UserPostsDisplay;
