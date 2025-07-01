import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { createAdmin } from "../../../api/adminApi";

function RegisterAdmin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const fileInput = useRef(null);
  const [imgfile, setImgfile] = useState(null); // To store the selected image file
  const [img, setImg] = useState(null); // For previewing the image

  // Modal state for dialog messages
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
  const [showModal, setShowModal] = useState(false);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("Name", data.name);
      formData.append("Email", data.email);
      formData.append("Password", data.password);
      formData.append("role", data.role);
      formData.append("phone_number", data.phone_number);
      formData.append("Gender", data.gender);

      // Append the image file only if the user has selected one.
      if (imgfile) {
        formData.append("PicImg", imgfile);
      }

      // Attempt to create the admin.
      const result = await createAdmin(formData);

      // If the call is successful:
      if (result.status === 200) {
        setModalType("success");
        setModalMessage(result.message || "Admin registered successfully.");
        reset();
        setImg(null);
        setImgfile(null);
      }
      setShowModal(true);
    } catch (error) {
      // Check if error.response exists (axios error handling)
      if (error.response && error.response.status === 422) {
        // Try to get the email error message from the response.
        const emailError =
          error.response.data.errors && error.response.data.errors.Email
            ? error.response.data.errors.Email[0]
            : null;
        setModalType("danger");
        setModalMessage(
          emailError ||
            error.response.data.message ||
            "Registration failed. Please try again."
        );
      } else {
        setModalType("danger");
        setModalMessage(error.message || "An unexpected error occurred.");
      }
      setShowModal(true);
    }
  };

  // Trigger file input click when image selection box is clicked.
  const handleImageClick = () => {
    fileInput.current.click();
  };

  // Handle image file selection.
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgfile(file);
      setImg(URL.createObjectURL(file));
    }
  };

  return (
    <div className="container mt-3">
      <h1 className="text-center">Register Admin</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 w-75 mx-auto">
        {/* Image Selection Box */}
        <div className="form-group text-center mb-3">
          <label>Profile Picture</label>
          <div
            onClick={handleImageClick}
            style={{
              cursor: "pointer",
              border: "2px dashed #ccc",
              borderRadius: "10px",
              padding: "20px",
              position: "relative",
              width: "150px",
              height: "150px",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={img ? img : "/Customer/pic.jpg"}
              alt="Profile"
              style={{
                borderRadius: "50%",
                width: "100px",
                height: "100px",
                objectFit: "cover",
              }}
            />
            <div
              style={{
                display: img ? "none" : "block",
                position: "absolute",
                bottom: "0px",
                width: "100%",
                textAlign: "center",
                color: "#666",
                fontWeight: "bold",
              }}
            >
              Select Profile Image
            </div>
          </div>
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInput}
            style={{ display: "none" }}
            onChange={handleImageChange}
            accept="image/*"
          />
        </div>

        {/* Form Fields */}
        <div className="form-row">
          {/* Name */}
          <div className="form-group col-md-6 mb-3">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              id="name"
              placeholder="Enter name"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name.message}</div>
            )}
          </div>

          {/* Email */}
          <div className="form-group col-md-6 mb-3">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              id="email"
              placeholder="Enter email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email.message}</div>
            )}
          </div>
        </div>

        <div className="form-row">
          {/* Password */}
          <div className="form-group col-md-6 mb-3">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              id="password"
              placeholder="Enter password"
              autoComplete="new-password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password.message}</div>
            )}
          </div>

          {/* Phone Number */}
          <div className="form-group col-md-6 mb-3">
            <label htmlFor="phone_number">Phone Number</label>
            <input
              type="text"
              className={`form-control ${
                errors.phone_number ? "is-invalid" : ""
              }`}
              id="phone_number"
              placeholder="Enter phone number"
              {...register("phone_number", {
                required: "Phone number is required",
              })}
            />
            {errors.phone_number && (
              <div className="invalid-feedback">
                {errors.phone_number.message}
              </div>
            )}
          </div>
        </div>

        <div className="form-row">
          {/* Gender */}
          <div className="form-group col-md-6 mb-3">
            <label htmlFor="gender">Gender</label>
            <select
              className={`form-control ${errors.gender ? "is-invalid" : ""}`}
              id="gender"
              defaultValue=""
              {...register("gender", { required: "Gender is required" })}
            >
              <option value="" disabled>
                Select a gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {errors.gender && (
              <div className="invalid-feedback">{errors.gender.message}</div>
            )}
          </div>

          {/* Role */}
          <div className="form-group col-md-6 mb-3">
            <label htmlFor="role">Role</label>
            <select
              className={`form-control ${errors.role ? "is-invalid" : ""}`}
              id="role"
              defaultValue=""
              {...register("role", { required: "Role is required" })}
            >
              <option value="" disabled>
                Select a role
              </option>
              <option value="manager">Manager</option>
              <option value="librarian">Librarian</option>
            </select>
            {errors.role && (
              <div className="invalid-feedback">{errors.role.message}</div>
            )}
          </div>
        </div>

        <div className="text-center mt-4">
          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </div>
      </form>

      {/* Modal Dialog Box */}
      {showModal && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalType === "success" ? "Success" : "Error"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>{modalMessage}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowModal(false)}
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

export default RegisterAdmin;
