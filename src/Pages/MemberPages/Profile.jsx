import React, { useState, useEffect } from "react";
import Menu from "../Layouts/Menu";
import { useForm } from "react-hook-form";
import { updatePfinfo, updatePfpic } from "../../api/memberApi"; // Added updatePfpic import

function Profile() {
  const [user, setUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [profilePicFile, setProfilePicFile] = useState(null); // state for selected file
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // state for success modal
  const [successMessage, setSuccessMessage] = useState(""); // state for success message

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Load user data from localStorage on component mount and prepopulate form fields
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      reset({
        name: parsedUser.name || "",
        email: parsedUser.email || "",
        gender: parsedUser.gender || "",
        DateOfBirth: parsedUser.DateOfBirth || "",
        phone_number: parsedUser.phone_number || "",
      });
    }
  }, [reset]);

  if (!user) {
    return <div>Loading profile...</div>;
  }

  const profileImageUrl = user.ProfilePicture
    ? `http://127.0.0.1:8000/storage/${user.ProfilePicture}`
    : `/Customer/pic.jpg`;

  // Handlers for opening/closing modals
  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);
  const openPhotoModal = () => setIsPhotoModalOpen(true);
  const closePhotoModal = () => setIsPhotoModalOpen(false);

  // onSubmit will be called when the profile info form is submitted
  const onSubmit = async (data) => {
    try {
      const response = await updatePfinfo(data, user.id);
      // Merge updated fields into the existing user state
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      closeEditModal();
      // Show success modal with message for profile info update
      setSuccessMessage("Profile info updated successfully!");
      setIsSuccessModalOpen(true);
      console.log(response.status);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  // Handler for file input change in Photo Modal
  const handleFileChange = (e) => {
    setProfilePicFile(e.target.files[0]);
  };

  // Handler for uploading profile picture
  const handlePhotoUpload = async () => {
    if (!profilePicFile) return;
    const formData = new FormData();
    formData.append("ProfilePic", profilePicFile);

    try {
      const response = await updatePfpic(formData, user.id);
      // Assuming the response returns the updated picture path in response.ProfilePic
      const updatedUser = { ...user, ProfilePicture: response.ProfilePic };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      closePhotoModal();
      // Show success modal with message for profile picture update
      setSuccessMessage("Profile picture updated successfully!");
      setIsSuccessModalOpen(true);
      console.log(response);
    } catch (error) {
      console.error("Failed to update profile picture:", error);
    }
  };

  return (
    <div>
      {/* <Menu /> */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          padding: "1rem",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            padding: "2rem",
            borderRadius: "10px",
            textAlign: "center",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            maxWidth: "400px",
            width: "90%",
          }}
        >
          {/* Profile Image */}
          <img
            src={profileImageUrl}
            alt={user.name}
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: "0%",
            }}
          />
          <div>
            <button
              className="btn btn-white border border-1 rounded-pill"
              onClick={openPhotoModal}
            >
              Change Photo
            </button>
          </div>

          {/* Profile Details */}
          <h2>{user.name}</h2>
          <p style={{ color: "#666", marginBottom: "1rem" }}>{user.email}</p>
          <div>
            <p>
              <strong>Phone:</strong> {user.phone_number}
            </p>
            <p>
              <strong>Date of Birth:</strong> {user.DateOfBirth}
            </p>
            <p>
              <strong>Gender:</strong> {user.gender}
            </p>

            <div className="d-flex justify-content-center">
              <button className="btn btn-primary w-50" onClick={openEditModal}>
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1rem",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "10px",
              width: "100%",
              maxWidth: "400px",
              textAlign: "center",
            }}
          >
            <h3>Edit Profile</h3>
            {/* The form is controlled by react-hook-form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className="form-control my-2"
                placeholder="Name"
              />
              {errors.name && (
                <span style={{ color: "red" }}>{errors.name.message}</span>
              )}

              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="form-control my-2"
                placeholder="Email"
              />
              {errors.email && (
                <span style={{ color: "red" }}>{errors.email.message}</span>
              )}

              <select
                {...register("gender", { required: "Gender is required" })}
                className="form-control my-2"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors.gender && (
                <span style={{ color: "red" }}>{errors.gender.message}</span>
              )}

              <input
                type="date"
                {...register("DateOfBirth")}
                className="form-control my-2"
                placeholder="Date of Birth"
              />
              <input
                type="text"
                {...register("phone_number")}
                className="form-control my-2"
                placeholder="Phone Number"
              />
              <div className="d-flex justify-content-between mt-3">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeEditModal}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Profile Photo Modal */}
      {isPhotoModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1rem",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "10px",
              width: "100%",
              maxWidth: "400px",
              textAlign: "center",
            }}
          >
            <h3>Update Profile Picture</h3>
            <input
              type="file"
              className="form-control my-2"
              onChange={handleFileChange} // Added file change handler
            />
            <div className="d-flex justify-content-between mt-3">
              <button className="btn btn-secondary" onClick={closePhotoModal}>
                Cancel
              </button>
              <button className="btn btn-success" onClick={handlePhotoUpload}>
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message Modal */}
      {isSuccessModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1rem",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "10px",
              width: "100%",
              maxWidth: "400px",
              textAlign: "center",
            }}
          >
            <h3>Success</h3>
            <p>{successMessage}</p>
            <button
              className="btn btn-success"
              onClick={() => setIsSuccessModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
