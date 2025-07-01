// src/Pages/About.jsx
import React from "react";

function About() {
  return (
    <div>
      {/* Hero Section */}
      <section
        className="py-5 text-white"
        style={{
          background: "url('/Customer/homeBg.jpg') center/cover no-repeat",
        }}
      >
        <div className="container text-center">
          <h1 className="display-4 text-white fw-bold">
            Welcome to LibriSphere
          </h1>
          <p className="lead mb-4">
            Connecting readers, creating communities, and preserving knowledge.
          </p>
          <a href="#mission" className="btn btn-lg btn-light">
            Our Mission
          </a>
        </div>
      </section>

      {/* Mission & Vision */}
      <section id="mission" className="py-5 bg-light">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-md-6">
              <img
                src="/logo.png"
                alt="Mission"
                className="img-fluid rounded shadow w-75 h-50"
                style={{ objectFit: "contain" }}
              />
            </div>
            <div className="col-md-6">
              <h2 className="fw-bold mb-3">Our Mission &amp; Vision</h2>
              <p className="mb-3">
                At LibriSphere, we believe knowledge is most powerful when
                shared. Our mission is to provide seamless access to digital and
                physical resources, foster vibrant discussion forums, and
                empower every reader to discover new worlds.
              </p>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <i className="bi bi-check2-circle text-primary me-2"></i>{" "}
                  Universal access to information
                </li>
                <li className="mb-2">
                  <i className="bi bi-check2-circle text-primary me-2"></i>{" "}
                  Community-driven recommendations
                </li>
                <li className="mb-2">
                  <i className="bi bi-check2-circle text-primary me-2"></i>{" "}
                  Preservation of cultural heritage
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-5">
        <div className="container text-center">
          <h2 className="fw-bold mb-5">Core Features</h2>
          <div className="row row-cols-1 row-cols-md-3 g-4">
            <div className="col">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="46"
                    height="46"
                    fill="currentColor"
                    className="bi bi-card-checklist text-primary"
                    viewBox="0 0 16 16"
                  >
                    <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z" />
                    <path d="M7 5.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0M7 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0" />
                  </svg>
                  <h5 className="card-title">Extensive Catalog</h5>
                  <p className="card-text">
                    Thousands of e-books, audiobooks, and research papers at
                    your fingertips.
                  </p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="46"
                    height="46"
                    fill="currentColor"
                    className="bi bi-book text-primary"
                    viewBox="0 0 16 16"
                  >
                    <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783" />
                  </svg>
                  <h5 className="card-title">Reader Communities</h5>
                  <p className="card-text">
                    Join book clubs, engage in discussions, and share your
                    reviews globally.
                  </p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="46"
                    height="46"
                    fill="currentColor"
                    className="bi bi-person-video3 text-primary"
                    viewBox="0 0 16 16"
                  >
                    <path d="M14 9.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0m-6 5.7c0 .8.8.8.8.8h6.4s.8 0 .8-.8-.8-3.2-4-3.2-4 2.4-4 3.2" />
                    <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h5.243c.122-.326.295-.668.526-1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v7.81c.353.23.656.496.91.783Q16 12.312 16 12V4a2 2 0 0 0-2-2z" />
                  </svg>
                  <h5 className="card-title">Personalized Insights</h5>
                  <p className="card-text">
                    Get recommendations and reading statistics powered by smart
                    analytics.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Elegant Showcase Image */}
      <section className="py-5 bg-light">
        <div className="container">
          <img
            src="/Customer/homeBg.jpg"
            alt="Elegant Library Interior"
            className="img-fluid rounded shadow-lg"
          />
        </div>
      </section>

      {/* Timeline / History */}
      <section className="py-5">
        <div className="container">
          <h2 className="fw-bold text-center mb-5">Our Journey</h2>
          <div className="row g-4">
            <div className="col-md-4 text-center">
              <div className="p-4 border rounded shadow-sm h-100">
                <h5 className="text-primary">2020</h5>
                <p>Founded as a small community library with 2,000 books.</p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="p-4 border rounded shadow-sm h-100">
                <h5 className="text-primary">2023</h5>
                <p>
                  Launched our first digital archive and public computer lab.
                </p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="p-4 border rounded shadow-sm h-100">
                <h5 className="text-primary">2025</h5>
                <p>
                  Expanded globally with LibriSphere platform featuring
                  AI-driven recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
