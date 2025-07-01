// import React, { useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import axios from "axios";
// import { useAuth } from "../Authentication/Auth";
// import { useNavigate } from "react-router-dom";
// import Menu from "./Layouts/Menu";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const auth = useAuth();
//   const navigate = useNavigate();

//   // State for modal dialog (used for both success and failure)
//   const [showModal, setShowModal] = useState(false);
//   const [modalMessage, setModalMessage] = useState("");
//   const [redirectRoute, setRedirectRoute] = useState("");
//   const [modalTitle, setModalTitle] = useState("Login Status");

//   const handleModalClose = () => {
//     setShowModal(false);
//     // Redirect only if a route is provided (successful login)
//     if (redirectRoute) {
//       navigate(redirectRoute, { replace: true });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post(
//         "http://127.0.0.1:8000/admin/login",
//         { email, password },
//         {
//           withCredentials: true,
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       // Extract response data
//       const { message, user, token, role } = response.data;

//       // Set the authentication context.
//       auth.loginUser(user, token);
//       console.log("login role", role);

//       // Determine the redirect route based on user role.
//       let route = "";
//       if (role === "admin") {
//         route = "/Admin/ViewAuthors";
//       } else if (role === "community_member") {
//         route = "/community/posts";
//       } else {
//         route = "/library/home";
//       }

//       // Set modal state for a successful login.
//       setModalTitle("Login Successful");
//       setModalMessage(message);
//       setRedirectRoute(route);
//       setShowModal(true);
//     } catch (error) {
//       console.error(error.response?.data || error.message);
//       // Set modal state for a failed login.
//       setModalTitle("Login Failed");
//       setModalMessage("Invalid login credential");
//       setRedirectRoute(""); // No redirection on error.
//       setShowModal(true);
//     }
//   };

//   return (
//     <div
//       className="d-flex justify-content-center align-items-center vh-100"
//       style={{
//         backgroundImage: "url('/Customer/homeBg.jpg')",
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       <div style={{ overflow: "hidden", zIndex: "1000" }}>{/* <Menu /> */}</div>
//       <div className="card p-4 shadow" style={{ width: "400px" }}>
//         <h2 className="text-center mb-4">Login</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label htmlFor="email" className="form-label">
//               Email address
//             </label>
//             <input
//               type="email"
//               id="email"
//               className="form-control"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               autoComplete="email"
//             />
//           </div>
//           <div className="mb-3">
//             <label htmlFor="password" className="form-label">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               className="form-control"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               autoComplete="current-password"
//             />
//           </div>
//           <button type="submit" className="btn btn-primary w-100">
//             Login
//           </button>
//         </form>
//       </div>

//       {/* Bootstrap Modal for displaying login messages */}
//       {showModal && (
//         <>
//           <div className="modal fade show" style={{ display: "block" }}>
//             <div className="modal-dialog bg-white">
//               <div
//                 className="modal-content"
//                 style={{
//                   background:
//                     "url('https://via.placeholder.com/400x300') no-repeat center center",
//                   backgroundSize: "cover",
//                   color: "#fff",
//                 }}
//               >
//                 <div className="modal-header">
//                   <h5 className="modal-title">{modalTitle}</h5>
//                   <button
//                     type="button"
//                     className="btn-close"
//                     onClick={handleModalClose}
//                   ></button>
//                 </div>
//                 <div className="modal-body">
//                   <p className="text-black">{modalMessage}</p>
//                 </div>
//                 <div className="modal-footer">
//                   <button
//                     type="button"
//                     className="btn btn-primary"
//                     onClick={handleModalClose}
//                   >
//                     OK
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* Modal Backdrop */}
//           <div className="modal-backdrop fade show"></div>
//         </>
//       )}
//     </div>
//   );
// }

// export default Login;
// src/Pages/Login.jsx
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useAuth } from "../Authentication/Auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in and not expired
  useEffect(() => {
    const token = localStorage.getItem("token"); // get token :contentReference[oaicite:13]{index=13}
    const loginTime = localStorage.getItem("loginTime"); // get login time :contentReference[oaicite:14]{index=14}
    if (token && loginTime) {
      const elapsed = Date.now() - Number(loginTime); // compute elapsed ms :contentReference[oaicite:15]{index=15}
      const oneDayMs = 24 * 60 * 60 * 1000;
      if (elapsed <= oneDayMs && auth.user) {
        // route based on role
        const role = auth.user.role;
        if (role === "librarian") {
          navigate("/Admin/LibrarianDashboard", { replace: true });
        } else if (role === "manager") {
          navigate("/Admin/ManagerDashboard", { replace: true });
        } else if (role === "community_member") {
          navigate("/community/posts", { replace: true });
        } else {
          navigate("/library/home", { replace: true });
        }
      }
    }
  }, [auth.user, navigate]);

  // Existing form & modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [redirectRoute, setRedirectRoute] = useState("");
  const [modalTitle, setModalTitle] = useState("Login Status");

  const handleModalClose = () => {
    setShowModal(false);
    if (redirectRoute) {
      navigate(redirectRoute, { replace: true }); // programmatic nav :contentReference[oaicite:16]{index=16}
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/admin/login",
        { email, password },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      const { message, user, token, role } = response.data;
      auth.loginUser(user, token); // stores user, token, loginTime
      let route = "";
      if (role === "admin") {
        route = "/Admin/ViewAuthors";
      } else if (role === "community_member") {
        route = "/community/posts";
      } else {
        route = "/library/home";
      }
      setModalTitle("Login Successful");
      setModalMessage(message);
      setRedirectRoute(route);
      setShowModal(true);
    } catch (error) {
      console.error(error.response?.data || error.message);
      setModalTitle("Login Failed");
      setModalMessage("Invalid login credential");
      setRedirectRoute("");
      setShowModal(true);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: "url('/Customer/homeBg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div style={{ overflow: "hidden", zIndex: "1000" }}></div>
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>

      {showModal && (
        <>
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog bg-white">
              <div
                className="modal-content"
                style={{
                  background:
                    "url('https://via.placeholder.com/400x300') no-repeat center center",
                  backgroundSize: "cover",
                  color: "#fff",
                }}
              >
                <div className="modal-header">
                  <h5 className="modal-title">{modalTitle}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleModalClose}
                  ></button>
                </div>
                <div className="modal-body">
                  <p className="text-black">{modalMessage}</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleModalClose}
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}

export default Login;
