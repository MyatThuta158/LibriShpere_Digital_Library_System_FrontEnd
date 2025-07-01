import React, { useState, useEffect } from "react";
import { showAdmin, updateAdmin, resetPassword } from "../../../api/adminApi"; // Adjust the import path as needed

const AdminProfile = () => {
  const [adminData, setAdminData] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showResetSuccessDialog, setShowResetSuccessDialog] = useState(false);
  const [globalError, setGlobalError] = useState("");

  // Errors for each input field (used for both modals)
  const [errors, setErrors] = useState({});

  // Form state for updating profile
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  // profilePicture stores the file object; preview stores a URL for preview
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState("");

  // Form state for resetting password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [flag, setFlag] = useState(false);

  // Helper: Validate that password is at least 8 characters long,
  // has at least one letter, one number, and one special character.
  const validatePassword = (password) => {
    const pattern =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return pattern.test(password);
  };

  // Load admin data from localStorage on mount
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    if (data) {
      setAdminData(data);
      setName(data.Name);
      setEmail(data.Email);
      setGender(data.Gender);
      setPhoneNumber(data.PhoneNumber);
      setProfilePicturePreview(data.ProfilePicture);
    }
  }, [flag]);

  // Helper function to clear reset password inputs
  const clearResetPasswordFields = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setGlobalError("");
  };

  // Handle update profile form submission
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setGlobalError("");
    setErrors({});

    // Validate required fields locally
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    if (!gender.trim()) newErrors.gender = "Gender is required.";
    if (!phoneNumber.trim())
      newErrors.phoneNumber = "Phone Number is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Create a FormData object and append fields
    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Email", email);
    formData.append("Gender", gender);
    formData.append("PhoneNumber", phoneNumber);
    if (profilePicture) {
      formData.append("PicImg", profilePicture);
    }

    try {
      await updateAdmin(formData);
      // After updating, fetch the updated admin data
      const updatedAdminResponse = await showAdmin();
      const updatedAdminData = updatedAdminResponse.data;

      // Update state and local storage with returned data
      setAdminData(updatedAdminData);
      localStorage.setItem("user", JSON.stringify(updatedAdminData));

      setShowUpdateModal(false);
      setFlag(true);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Error updating admin:", error);
      // Check if the error is due to a validation error from the backend for Email field.
      if (
        error.response &&
        error.response.status === 422 &&
        error.response.data.errors &&
        error.response.data.errors.Email
      ) {
        // Set the global error to the custom "Email already existed" message.
        setGlobalError(error.response.data.errors.Email[0]);
      } else {
        setGlobalError("Error updating profile. Please try again later.");
      }
    }
  };

  // Handle reset password form submission
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setGlobalError("");

    // Check if new password and confirm password match
    if (newPassword !== confirmNewPassword) {
      setGlobalError("New password and confirm password do not match.");
      return;
    }

    // Check if new password meets the criteria
    if (!validatePassword(newPassword)) {
      setGlobalError(
        "Password must be at least 8 characters long, include at least one letter, one number, and one special character."
      );
      return;
    }

    // Prepare data for API call
    const data = {
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: confirmNewPassword,
    };

    try {
      const response = await resetPassword(data);

      // If the request is successful, show the reset success dialog and clear fields
      if (response.status === 200) {
        setShowResetModal(false);
        setShowResetSuccessDialog(true);
        clearResetPasswordFields();
      } else {
        // On error, display the error message from the backend and keep the modal open
        setGlobalError(response.message || "Failed to change password.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setGlobalError(
        error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred."
      );
    }
  };

  // Real-time validation for new password input
  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);

    // Optionally clear global error if the user corrects the value
    if (globalError && validatePassword(value)) {
      setGlobalError("");
    }
  };

  if (!adminData) {
    return (
      <div className="container my-5">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      {/* Profile Card */}
      <div className="card shadow mx-auto" style={{ maxWidth: "600px" }}>
        <div className="card-header text-center">
          <h4>Admin Profile</h4>
        </div>
        <div className="card-body">
          <div className="d-flex align-items-center mb-3">
            <img
              src={
                profilePicturePreview
                  ? `http://127.0.0.1:8000/storage/${profilePicturePreview}`
                  : "/Customer/pic.jpg"
              }
              alt="Profile"
              className="rounded-circle me-3"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
            <div>
              <h5 className="mb-0">{name}</h5>
              <small className="text-muted">{adminData.role}</small>
            </div>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <strong>Email:</strong> {email}
            </li>
            <li className="list-group-item">
              <strong>Gender:</strong> {gender}
            </li>
            <li className="list-group-item">
              <strong>Phone Number:</strong> {phoneNumber}
            </li>
          </ul>
        </div>
        <div className="d-flex card-footer justify-content-end">
          <button
            type="button"
            className="btn btn-primary me-2"
            onClick={() => {
              setErrors({});
              setGlobalError("");
              setShowUpdateModal(true);
            }}
          >
            Update Profile
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              clearResetPasswordFields();
              setShowResetModal(true);
            }}
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Update Profile Modal */}
      {showUpdateModal && (
        <div className="d-block modal fade show" tabIndex="-1">
          <div className="modal-dialog">
            <form onSubmit={handleUpdateSubmit}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Update Profile</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setErrors({});
                      setGlobalError("");
                      setShowUpdateModal(false);
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  {globalError && (
                    <div className="alert alert-warning" role="alert">
                      {globalError}
                    </div>
                  )}
                  <div className="mb-3">
                    <label htmlFor="adminName" className="form-label">
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="adminName"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && (
                      <div className="text-danger small">{errors.name}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="adminEmail" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="adminEmail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && (
                      <div className="text-danger small">{errors.email}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="adminGender" className="form-label">
                      Gender
                    </label>
                    <select
                      className="form-select"
                      id="adminGender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="">Select Gender</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                    </select>
                    {errors.gender && (
                      <div className="text-danger small">{errors.gender}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="adminPhone" className="form-label">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="adminPhone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    {errors.phoneNumber && (
                      <div className="text-danger small">
                        {errors.phoneNumber}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="adminProfilePicture" className="form-label">
                      Profile Picture
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id="adminProfilePicture"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setProfilePicture(file);
                          setProfilePicturePreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setErrors({});
                      setGlobalError("");
                      setShowUpdateModal(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="d-block modal fade show" tabIndex="-1">
          <div className="modal-dialog">
            <form onSubmit={handleResetSubmit}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Change Password</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      clearResetPasswordFields();
                      setShowResetModal(false);
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  {globalError && (
                    <div className="alert alert-warning" role="alert">
                      {globalError}
                    </div>
                  )}
                  <div className="mb-3">
                    <label htmlFor="currentPassword" className="form-label">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="currentPassword"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="newPassword"
                      value={newPassword}
                      onChange={handleNewPasswordChange}
                    />
                    {newPassword.length > 0 &&
                      !validatePassword(newPassword) && (
                        <div className="text-danger small">
                          Password must be at least 8 characters long, include
                          at least one letter, one number, and one special
                          character.
                        </div>
                      )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="confirmNewPassword" className="form-label">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmNewPassword"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      clearResetPasswordFields();
                      setShowResetModal(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Change Password
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Success Dialog Modal */}
      {showSuccessDialog && (
        <div className="d-block modal fade show" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Success</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowSuccessDialog(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Your profile has been updated successfully!</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowSuccessDialog(false)}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Success Dialog Modal */}
      {showResetSuccessDialog && (
        <div className="d-block modal fade show" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Success</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowResetSuccessDialog(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Password change successfully!</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowResetSuccessDialog(false)}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
