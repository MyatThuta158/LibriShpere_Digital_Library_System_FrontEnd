import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { MembershipContext } from "./Context/MembershipContext";
import { useNavigate } from "react-router-dom";
import { createMember } from "../../api/memberApi";
import { useAuth } from "../../Authentication/Auth";
import "bootstrap/dist/css/bootstrap.min.css";
import Menu from "../Layouts/Menu";

function MemberRegister() {
  const { setUserid } = useContext(MembershipContext);
  const [message, setMessage] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(null);
  const navigate = useNavigate();
  const auth = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: "onChange" }); // validate on every change

  const password = watch("password");

  const onSubmit = async (data) => {
    // Exclude confirm_password from the data sent to the backend
    const { confirm_password, ...memberDataFields } = data;
    const memberData = new FormData();
    Object.entries(memberDataFields).forEach(([key, value]) =>
      memberData.append(key, value)
    );
    memberData.append("role", "community_member");

    try {
      const response = await createMember(memberData);

      //console.log(response);
      //const {user,status,token,}
      // If response status is 200, registration is successful.
      if (response.status === 200) {
        // Log in the user and store data in context and localStorage
        auth.loginUser(response.user, response.token);
        setUserid(response.id);

        // Save user information in localStorage
        // localStorage.setItem("user", JSON.stringify(response.user));
        // localStorage.setItem("token", response.token);

        setRegistrationSuccess(true);
        setMessage(
          "Registration successful! Do you want to subscribe to our membership?"
        );
      }
    } catch (error) {
      // Handle Axios errors when the response status is 422
      if (error.response && error.response.status === 422) {
        const errorsFromResponse = error.response.data.errors;
        if (errorsFromResponse && errorsFromResponse.email) {
          setRegistrationSuccess(false);
          setMessage(errorsFromResponse.email[0] || "Email already exists.");
        } else {
          setRegistrationSuccess(false);
          setMessage(
            "Registration failed due to validation errors. Please try again."
          );
        }
      } else {
        setRegistrationSuccess(false);
        setMessage("Registration failed. Please try again.");
        console.error(error);
      }
    }
  };

  return (
    <div>
      {/* <Menu /> */}
      {/* Inline CSS for hover effect */}
      <style>
        {`
          .btn.bg-light-subtle:hover {
            color: #4e73df !important;
          }
        `}
      </style>
      <div className="container mt-5 mt-md-5 mb-5">
        <div className="row justify-content-center align-items-center">
          <div className="col-lg-10">
            <div className="card shadow-lg border-0 rounded-3 overflow-hidden">
              <div className="row g-0">
                <div className="col-md-5 d-none d-md-block">
                  <img
                    src="../Customer/memberRegister.jpg"
                    alt="Registration"
                    className="img-fluid w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div
                  className="col-md-7 p-4 h-75 text-white"
                  style={{ background: "#4e73df" }}
                >
                  <h3 className="mb-4 text-center text-white fw-bold">
                    User Registration
                  </h3>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Row 1: Name and Email */}
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Name</label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("name", {
                            required: "Name is required",
                          })}
                          placeholder="Please enter Name"
                        />
                        {errors.name && (
                          <span className="text-danger">
                            {errors.name.message}
                          </span>
                        )}
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          {...register("email", {
                            required: "Email is required",
                          })}
                          placeholder="Please enter Email"
                        />
                        {errors.email && (
                          <span className="text-danger">
                            {errors.email.message}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Row 2: Password and Confirm Password */}
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Password</label>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Please enter Password"
                          {...register("password", {
                            required: "Password is required",
                            minLength: {
                              value: 6,
                              message: "Password must be at least 6 characters",
                            },
                            pattern: {
                              // At least one letter, one number and one special character
                              value:
                                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                              message:
                                "Password must contain at least one letter, one number, and one special character",
                            },
                          })}
                        />
                        {errors.password && (
                          <span className="text-danger">
                            {errors.password.message}
                          </span>
                        )}
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Confirm Password</label>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Please enter Confirm password"
                          {...register("confirm_password", {
                            required: "Please confirm your password",
                            validate: (value) =>
                              value === password || "Passwords do not match",
                          })}
                        />
                        {errors.confirm_password && (
                          <span className="text-danger">
                            {errors.confirm_password.message}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Row 3: Phone Number and Gender */}
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Phone Number</label>
                        <input
                          type="tel"
                          className="form-control"
                          placeholder="Please enter Phone Number"
                          {...register("phone_number", {
                            required: "Phone number is required",
                          })}
                        />
                        {errors.phone_number && (
                          <span className="text-danger">
                            {errors.phone_number.message}
                          </span>
                        )}
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Gender</label>
                        <select
                          className="form-select"
                          {...register("gender", {
                            required: "Gender is required",
                          })}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                        {errors.gender && (
                          <span className="text-danger">
                            {errors.gender.message}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Row 4: Date of Birth */}
                    <div className="row">
                      <div className="col-md-12 mb-3">
                        <label className="form-label">Date of Birth</label>
                        <input
                          type="date"
                          className="form-control"
                          {...register("DateOfBirth", {
                            required: "Date of birth is required",
                          })}
                        />
                        {errors.DateOfBirth && (
                          <span className="text-danger">
                            {errors.DateOfBirth.message}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="d-grid">
                      <button type="submit" className="btn bg-light-subtle">
                        Register
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Dialog */}
        {message && (
          <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            tabIndex="-1"
            aria-labelledby="messageModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="messageModalLabel">
                    {registrationSuccess ? "Subscription" : "Error"}
                  </h5>
                  {/* <button
                    type="button"
                    className="btn-close"
                    onClick={() => setMessage("")}
                  ></button> */}
                </div>
                <div className="modal-body">{message}</div>
                <div className="modal-footer">
                  {registrationSuccess ? (
                    <>
                      <button
                        className="btn btn-primary"
                        onClick={() => navigate("/Membership")}
                      >
                        Yes
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => navigate("/")}
                      >
                        No
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setMessage("")}
                    >
                      Close
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MemberRegister;
