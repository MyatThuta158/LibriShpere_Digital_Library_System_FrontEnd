import React from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { Outlet, useNavigate } from "react-router-dom";

function SideBar() {
  const navigate = useNavigate();
  return (
    <HelmetProvider>
      <Helmet>
        <link rel="stylesheet" type="text/css" href="/style/style111.css" />
      </Helmet>

      <div className="d-flex" style={{ minHeight: "100vh" }}>
        <aside className="bg-primary">
          <div className="sidenav position-sticky d-flex flex-column justify-content-between">
            <div className="navbar navbar-dark my-4 p-0 font-primary">
              <ul className="navbar-nav w-100">
                <li className="nav-item active">
                  <a
                    className="nav-link text-white px-0 pt-0"
                    onClick={() => navigate("/Community/posts")}
                  >
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link text-white px-0"
                    onClick={() => navigate("/Community/posts/postengagement")}
                  >
                    Post Engagement
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link text-white px-0"
                    onClick={() => navigate("/Community/useruploadedpost")}
                  >
                    Profile
                  </a>
                </li>

                {/* <li className="nav-item mt-3">
                  <select
                    className="custom-select bg-transparent rounded-0 text-white shadow-none"
                    id="pick-lang"
                    defaultValue="en"
                  >
                    <option value="en">English</option>
                    <option value="fr">French</option>
                  </select>
                </li> */}
              </ul>
            </div>

            <ul className="list-inline nml-2">
              <li className="list-inline-item">
                <a href="#!" className="text-white text-red-onHover pr-2">
                  <span className="fab fa-twitter"></span>
                </a>
              </li>
              <li className="list-inline-item">
                <a href="#!" className="text-white text-red-onHover p-2">
                  <span className="fab fa-facebook-f"></span>
                </a>
              </li>
              <li className="list-inline-item">
                <a href="#!" className="text-white text-red-onHover p-2">
                  <span className="fab fa-instagram"></span>
                </a>
              </li>
              <li className="list-inline-item">
                <a href="#!" className="text-white text-red-onHover p-2">
                  <span className="fab fa-linkedin-in"></span>
                </a>
              </li>
            </ul>
          </div>
        </aside>

        <div className="">
          <Outlet />
        </div>
      </div>
    </HelmetProvider>
  );
}

export default SideBar;
