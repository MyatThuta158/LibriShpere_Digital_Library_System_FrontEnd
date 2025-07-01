import React, { useEffect, useState } from "react";
import Menu from "../Layouts/Menu";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { getResources } from "../../api/resourceApi";
import { Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Home1() {
  const [resource, setResource] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResource = async () => {
      const resResource = await getResources();

      setResource(resResource.data);
    };

    fetchResource();
  });

  const faqData = [
    {
      question: "How do I create an account and get my digital library card?",
      answer:
        'Click the "Sign Up" button at the top right, complete the registration form with your details, and verify your email. Your digital library card will appear instantly in your profile, granting you access to all member services.',
    },
    {
      question: "How can I find the books or articles I need?",
      answer:
        "Use the search bar at the top to enter keywords, titles, or authors. Apply filters like format, publication date, and subject on the results page to narrow down your search.",
    },
    {
      question: "What is the borrowing limit and how do I renew items?",
      answer:
        'Each member can borrow up to 5 e-books and 3 audiobooks at a time for a loan period of 21 days. To renew, go to "My Loans" and select "Renew" if no one else is waiting for that item.',
    },
    {
      question: "Can I download books for offline reading?",
      answer:
        'Yes. Available e-books and audiobooks have a "Download" button on their details page. Tap it to save the file for offline access in our mobile app or desktop reader.',
    },
    {
      question: "What accessibility features are supported?",
      answer:
        'We offer adjustable font sizes, high-contrast mode, text-to-speech playback, and screen-reader compatibility throughout the site. Visit "Accessibility Options" in your profile to customize your experience.',
    },
  ];

  const [activeIndex, setActiveIndex] = useState(null);
  const toggle = (index) =>
    setActiveIndex(activeIndex === index ? null : index);
  return (
    <HelmetProvider>
      <Helmet>
        <link rel="stylesheet" href="/style/main.css" />
      </Helmet>
      <div style={{ overflow: "hidden" }}>
        <section id="hero" className="hero section dark-background">
          <img src="../Customer/homeBg1.jpg" alt="" data-aos="fade-in" />

          <div className="container d-flex flex-column align-items-center">
            <h2 data-aos="fade-up" data-aos-delay="100">
              READ. LEARN. ACCESS.
            </h2>
            <p data-aos="fade-up" data-aos-delay="200">
              LibriSphere gives you access to eBooks, historical books, old and
              rare videos and source of legendary videos.
            </p>
            <div
              className="d-flex mt-4"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <a
                href="#about"
                className="btn-get-started"
                onClick={() => navigate("/Membership")}
              >
                Start Membership
              </a>
              {/* <a
                href="https://www.youtube.com/watch?v=Y7f98aduVJ8"
                className="glightbox btn-watch-video d-flex align-items-center"
              >
                <i className="bi bi-play-circle"></i>
                <span>Watch Video</span>
              </a> */}
            </div>
          </div>
        </section>

        <section id="stats" className="stats section light-background">
          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="row gy-4">
              <div className="col-lg-3  col-md-6">
                <div className="stats-item d-flex bg-warning text-white justify-content-center  align-items-center w-100 h-100">
                  <div className="">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="46"
                      height="46"
                      fill="currentColor"
                      className="bi text-center mx-auto w-100 bi-book-half"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8.5 2.687c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783" />
                    </svg>
                    <div>
                      <span
                        data-purecounter-start="0"
                        data-purecounter-end="232"
                        data-purecounter-duration="1"
                        className="purecounter text-center text-white"
                      >
                        2554
                      </span>
                      <p className="text-center">EBooks</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="stats-item d-flex bg-primary text-white justify-content-center  align-items-center w-100 h-100">
                  <div className="">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="46"
                      height="46"
                      fill="currentColor"
                      className="bi text-center mx-auto w-100 bi-book-half"
                      viewBox="0 0 16 16"
                    >
                      <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm4 0v6h8V1zm8 8H4v6h8zM1 1v2h2V1zm2 3H1v2h2zM1 7v2h2V7zm2 3H1v2h2zm-2 3v2h2v-2zM15 1h-2v2h2zm-2 3v2h2V4zm2 3h-2v2h2zm-2 3v2h2v-2zm2 3h-2v2h2z" />
                    </svg>
                    <div>
                      <span
                        data-purecounter-start="0"
                        data-purecounter-end="232"
                        data-purecounter-duration="1"
                        className="purecounter text-center text-white"
                      >
                        1000+
                      </span>
                      <p className="text-center">Videos</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="stats-item d-flex bg-danger text-white justify-content-center  align-items-center w-100 h-100">
                  <div className="">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="46"
                      height="46"
                      fill="currentColor"
                      className="bi text-center mx-auto w-100 bi-book-half"
                      viewBox="0 0 16 16"
                    >
                      <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M11 6.64v1.75l-2 .5v3.61c0 .495-.301.883-.662 1.123C7.974 13.866 7.499 14 7 14s-.974-.134-1.338-.377C5.302 13.383 5 12.995 5 12.5s.301-.883.662-1.123C6.026 11.134 6.501 11 7 11c.356 0 .7.068 1 .196V6.89a1 1 0 0 1 .757-.97l1-.25A1 1 0 0 1 11 6.64" />
                    </svg>
                    <div>
                      <span
                        data-purecounter-start="0"
                        data-purecounter-end="232"
                        data-purecounter-duration="1"
                        className="purecounter text-center text-white"
                      >
                        1000+
                      </span>
                      <p className="text-center">Videos</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="stats-item d-flex bg-info text-white justify-content-center  align-items-center w-100 h-100">
                  <div className="">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="46"
                      height="46"
                      fill="currentColor"
                      className="bi text-center mx-auto w-100 bi-book-half"
                      viewBox="0 0 16 16"
                    >
                      <path d="M0 2.5A1.5 1.5 0 0 1 1.5 1h11A1.5 1.5 0 0 1 14 2.5v10.528c0 .3-.05.654-.238.972h.738a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 1 1 0v9a1.5 1.5 0 0 1-1.5 1.5H1.497A1.497 1.497 0 0 1 0 13.5zM12 14c.37 0 .654-.211.853-.441.092-.106.147-.279.147-.531V2.5a.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0-.5.5v11c0 .278.223.5.497.5z" />
                      <path d="M2 3h10v2H2zm0 3h4v3H2zm0 4h4v1H2zm0 2h4v1H2zm5-6h2v1H7zm3 0h2v1h-2zM7 8h2v1H7zm3 0h2v1h-2zm-3 2h2v1H7zm3 0h2v1h-2zm-3 2h2v1H7zm3 0h2v1h-2z" />
                    </svg>
                    <div>
                      <span
                        data-purecounter-start="0"
                        data-purecounter-end="232"
                        data-purecounter-duration="1"
                        className="purecounter text-center text-white"
                      >
                        4000+
                      </span>
                      <p className="text-center">Newspaper</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="tab-pane mt-5 " id="features-tab-3">
          <div className="row">
            <div className="col-lg-6 order-2 order-lg-1 mt-3 mt-lg-0">
              <h3 className="text-danger text-uppercase text-center text-bolder">
                Welcome to the LibriSphere
              </h3>
              <div
                className=" bg-info text-info mx-auto"
                style={{ width: "20vw", height: "1px" }}
              >
                -
              </div>
              <p className="mt-4 text-justify w-75 mx-auto">
                LibriSphere is a prominent digital library in Myanmar that was
                founded by a group of young entrepreneurs in 2020. Formerly,
                LibriSphere is founded under the name of “READ e-books
                collection” and that name was changed in 2021 in order to
                recognize more for readers. This shift marks the library to
                become known not only as Myanmar’s first digital library but
                also as a vast digital resource for international readers to
                make entrainment and research. LibriSphere is offering vast of
                digital resources such as books, research paper, newspaper and
                more for entertainment and academic purpose. Due to the digital
                edge, people want to read books through mobile devices and some
                resources can only have digital copies to make research and
                more. Therefore, the library is prominent quickly and there can
                attract readers not only for local but also for international.
                Therefore, there are two thousand active library members
                currently and member based are became larger and larger during
                four years due to diverse collection of digital resources.
              </p>
            </div>
            <div
              className="col-lg-6 order-1 order-lg-2 text-center"
              style={{ width: "45vw", height: "60%" }}
            >
              <img
                src="../Customer/about1.jpg"
                alt=""
                className="img-fluid"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        </div>

        <section id="services" className="services section">
          <div className="container section-title" data-aos="fade-up">
            <h2>Services</h2>
            <span>
              Here is our current services and we offer four main services to
              readers and members all over the world.
            </span>
          </div>

          <div className="container">
            <div className="row gy-4">
              <div
                className="col-lg-6 "
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <div className="service-item d-flex">
                  <div className="icon flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="56"
                      height="56"
                      fill="currentColor"
                      className="bi bi-book"
                      viewBox="0 0 16 16"
                    >
                      <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="title">
                      <a
                        href="services-details.html"
                        className="stretched-link"
                      >
                        Digital Library
                      </a>
                    </h4>
                    <p className="description">
                      we provide digital access for every reader from different
                      countries all over the world.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="col-lg-6 "
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="service-item d-flex">
                  <div className="icon flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="56"
                      height="56"
                      fill="currentColor"
                      className="bi bi-journal"
                      viewBox="0 0 16 16"
                    >
                      <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2" />
                      <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="title">
                      <a
                        href="services-details.html"
                        className="stretched-link"
                      >
                        Latest Ebooks
                      </a>
                    </h4>
                    <p className="description">
                      We also offer latest ebooks to all of library member.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="col-lg-6 "
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <div className="service-item d-flex">
                  <div className="icon flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="56"
                      height="56"
                      fill="currentColor"
                      className="bi bi-clock-history"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976q.576.129 1.126.342zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .979.654l-.615.789a7 7 0 0 0-.418-.302zm1.834 1.79a7 7 0 0 0-.653-.796l.724-.69q.406.429.747.91zm.744 1.352a7 7 0 0 0-.214-.468l.893-.45a8 8 0 0 1 .45 1.088l-.95.313a7 7 0 0 0-.179-.483m.53 2.507a7 7 0 0 0-.1-1.025l.985-.17q.1.58.116 1.17zm-.131 1.538q.05-.254.081-.51l.993.123a8 8 0 0 1-.23 1.155l-.964-.267q.069-.247.12-.501m-.952 2.379q.276-.436.486-.908l.914.405q-.24.54-.555 1.038zm-.964 1.205q.183-.183.35-.378l.758.653a8 8 0 0 1-.401.432z" />
                      <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0z" />
                      <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="title">
                      <a
                        href="services-details.html"
                        className="stretched-link"
                      >
                        Historical digital resource
                      </a>
                    </h4>
                    <p className="description">
                      We store and provide the historical books, videos and
                      audio to all the members.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="col-lg-6 "
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <div className="service-item d-flex">
                  <div className="icon flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="56"
                      height="56"
                      fill="currentColor"
                      className="bi bi-globe"
                      viewBox="0 0 16 16"
                    >
                      <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="title">
                      <a
                        href="services-details.html"
                        className="stretched-link"
                      >
                        Community
                      </a>
                    </h4>
                    <p className="description">
                      We also have the community and all people can join to
                      discuss about knowledge.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="features section">
          <div className="container section-title" data-aos="fade-up">
            <h2>Our Library Features</h2>
            <span>
              We have special features that other libraries don't have.
            </span>
          </div>

          <div className="container">
            <div className="row gy-4 align-items-stretch justify-content-between features-item ">
              <div
                className="col-lg-6 d-flex align-items-center features-img-bg"
                data-aos="zoom-out"
              >
                <img src="/Customer/homeBg.jpg" className="img-fluid" alt="" />
              </div>
              <div
                className="col-lg-5 d-flex justify-content-center flex-column"
                data-aos="fade-up"
              >
                <p>
                  Digital library member-side features encompass a comprehensive
                  suite of functionalities designed to enhance user engagement,
                  streamline information discovery, and facilitate personalized
                  access to digital resources. Members can register and manage
                  their profiles through secure authentication mechanisms,
                  including instant digital cards and multi-factor verification
                  Overdrive's Resource Center . They benefit from robust search
                  and discovery tools with full-text, faceted, and advanced
                  Boolean search capabilities Digital Commons Informa TechTarget
                  , as well as 24/7 remote access to a vast array of multimedia
                  content, with support for simultaneous users and offline
                  downloads
                </p>
                <ul>
                  <li>
                    <i className="bi bi-check"></i>{" "}
                    <span>
                      Faceted Browsing and Metadata Filters: Users refine
                      results by author, subject, date, format, and other
                      metadata facets, enabling precise discovery tailored to
                      research needs
                    </span>
                  </li>
                  <li>
                    <i className="bi bi-check"></i>
                    <span>
                      {" "}
                      24/7 Remote Access: Digital libraries eliminate physical
                      boundaries, granting continuous access to resources from
                      any location with Internet connectivity
                    </span>
                  </li>
                </ul>
                <a
                  className="btn btn-get-started align-self-start"
                  onClick={() => navigate("/UserRegister")}
                >
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="container section-title" data-aos="fade-up">
          <h2>Our Resources</h2>
          <span>
            Explore our collection of digital resources and publications
          </span>
        </div>
        <section
          id=""
          className=" "
          style={{
            background:
              "linear-gradient(rgba(255,255,255,0.6), rgba(255,255,255,0.6)), url('/Customer/memberRegister.jpg')",
            backgroundAttachment: "fixed",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="container ">
            <h2
              className="text-left font-bolder text-uppercase"
              style={{ fontWeight: "bolder" }}
            >
              Latest Digital Resources
            </h2>
            <Row className="g-1">
              {resource.map((resource) => (
                <Col key={resource.id} xs={12} sm={6} md={3} lg={3}>
                  {" "}
                  {/* Changed to 3 columns for 4 items per row */}
                  <div
                    className="position-relative"
                    onMouseEnter={() => setHoveredItem(resource.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <Card className="h-100 shadow-lg border-0 overflow-hidden">
                      <div className="card-image-container">
                        <Card.Img
                          variant="top"
                          src={`http://127.0.0.1:8000/storage/${resource.cover_photo}`}
                          className="card-image"
                        />
                      </div>

                      <Card.Body className="position-relative bg-dark text-light p-4">
                        <Card.Title className="mb-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted text-white">
                              {resource.publish_date}
                            </small>
                          </div>
                          <h2 className="mt-2 text-uppercase text-white fs-5">
                            {resource.name}
                          </h2>
                        </Card.Title>

                        {hoveredItem === resource.id && (
                          <div className="hover-overlay p-3">
                            <div className="hover-content">
                              <p className="text-muted mb-2">
                                ISBN: {resource.ISBN}
                              </p>
                              <p className="small">{resource.Description}</p>
                            </div>
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        <style>{`
          .card-image-container {
            height: 300px;
            overflow: hidden;
            position: relative;
          }
          
          .card-image {
            height: 100%;
            width: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }
          
          .hover-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            opacity: 0;
            animation: fadeIn 0.3s forwards;
          }
          
          .hover-content {
            position: relative;
            z-index: 2;
            height: 100%;
            overflow-y: auto;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          .card:hover .card-image {
            transform: scale(1.05);
          }
        `}</style>

        {/* <section id="pricing" className="pricing section">
          <div className="container section-title" data-aos="fade-up">
            <h2>Subscription Plans</h2>
            <span>
              Necessitatibus eius consequatur ex aliquid fuga eum quidem sint
              consectetur velit
            </span>
          </div>

          <div className="container" data-aos="zoom-in" data-aos-delay="100">
            <div className="row g-4">
              <div className="col-lg-4">
                <div className="pricing-item">
                  <h3>Free Plan</h3>
                  <div className="icon">
                    <i className="bi bi-box"></i>
                  </div>
                  <h4>
                    <sup>$</sup>0<span> / month</span>
                  </h4>
                  <ul>
                    <li>
                      <i className="bi bi-check"></i>{" "}
                      <span className="text-center">
                        Lorem ipsum is a nonsensical Latin text used to fill
                        empty spaces in graphic design, publishing, and web
                        development. It is derived from a 1st-century BC text by
                        Cicero, and has been popularized by Letraset, PageMaker,
                        and other software.
                      </span>
                    </li>
                  </ul>
                  <div className="text-center">
                    <a href="#" className="buy-btn">
                      Buy Now
                    </a>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="pricing-item featured">
                  <h3>Business Plan</h3>
                  <div className="icon">
                    <i className="bi bi-rocket"></i>
                  </div>

                  <h4>
                    <sup>$</sup>29<span> / month</span>
                  </h4>
                  <ul>
                    <li>
                      <i className="bi bi-check"></i>{" "}
                      <span className="text-center">
                        Lorem ipsum is a nonsensical Latin text used to fill
                        empty spaces in graphic design, publishing, and web
                        development. It is derived from a 1st-century BC text by
                        Cicero, and has been popularized by Letraset, PageMaker,
                        and other software.
                      </span>
                    </li>
                  </ul>
                  <div className="text-center">
                    <a href="#" className="buy-btn">
                      Buy Now
                    </a>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="pricing-item">
                  <h3>Developer Plan</h3>
                  <div className="icon">
                    <i className="bi bi-send"></i>
                  </div>
                  <h4>
                    <sup>$</sup>49<span> / month</span>
                  </h4>
                  <ul>
                    <li>
                      <i className="bi bi-check"></i>{" "}
                      <span className="text-center">
                        Lorem ipsum is a nonsensical Latin text used to fill
                        empty spaces in graphic design, publishing, and web
                        development. It is derived from a 1st-century BC text by
                        Cicero, and has been popularized by Letraset, PageMaker,
                        and other software.
                      </span>
                    </li>
                  </ul>
                  <div className="text-center">
                    <a href="#" className="buy-btn">
                      Buy Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        {/* Section Title */}

        {/* End Section Title */}

        <section id="team" className="team section light-background">
          <div className="container section-title" data-aos="fade-up">
            <h2>Member Reviews</h2>
            <span>Here is our user reviews</span>
          </div>

          <div className="container">
            <div className="row gy-5">
              <div
                className="col-lg-4 col-md-6 member"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <div className="member-img">
                  <img src="/Customer/pic.jpg" className="img-fluid" alt="" />
                  <div className="social">
                    <a href="#">
                      <i className="bi bi-twitter-x"></i>
                    </a>
                    <a href="#">
                      <i className="bi bi-facebook"></i>
                    </a>
                    <a href="#">
                      <i className="bi bi-instagram"></i>
                    </a>
                    <a href="#">
                      <i className="bi bi-linkedin"></i>
                    </a>
                  </div>
                </div>
                <div className=" text-center">
                  <h4>Walter White</h4>
                  <span>1 year member</span>
                  <p>
                    The library is amazing and the digital resources are too
                    much that I cannot read.
                  </p>
                </div>
              </div>

              <div
                className="col-lg-4 col-md-6 member"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="member-img">
                  <img src="/Customer/pic.jpg" className="img-fluid" alt="" />
                  <div className="social">
                    <a href="#">
                      <i className="bi bi-twitter-x"></i>
                    </a>
                    <a href="#">
                      <i className="bi bi-facebook"></i>
                    </a>
                    <a href="#">
                      <i className="bi bi-instagram"></i>
                    </a>
                    <a href="#">
                      <i className="bi bi-linkedin"></i>
                    </a>
                  </div>
                </div>
                <div className=" text-center">
                  <h4>Sarah Jhonson</h4>
                  <span>3 year member</span>
                  <p>
                    Very happy I started using LibriSphere! It's another great
                    reason to have a library card. My only complaint is that I
                    have notifications turned on for when a hold is ready, but
                    they don't seem to work. I had a hold lapse and had to wait
                    another couple weeks for the book because of this. Other
                    notifications (like loan expiring) are working properly.
                  </p>
                </div>
              </div>

              <div
                className="col-lg-4 col-md-6 member"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <div className="member-img">
                  <img src="/Customer/pic.jpg" className="img-fluid" alt="" />
                  <div className="social">
                    <a href="#">
                      <i className="bi bi-twitter-x"></i>
                    </a>
                    <a href="#">
                      <i className="bi bi-facebook"></i>
                    </a>
                    <a href="#">
                      <i className="bi bi-instagram"></i>
                    </a>
                    <a href="#">
                      <i className="bi bi-linkedin"></i>
                    </a>
                  </div>
                </div>
                <div className="text-center">
                  <h4>William Anderson</h4>
                  <span>5 year member</span>
                  <p>
                    I have always extolled the virtues of public libraries and
                    now that I can carry the library with me on my iPad, I tell
                    everyone I know about LibriSphere.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="faq" className="faq section">
          <div className="container">
            <div className="row gy-4">
              {/* Intro column */}
              <div className="col-lg-4" data-aos="fade-up" data-aos-delay="100">
                <div className="content px-xl-5">
                  <h3>
                    <span>Frequently Asked </span>
                    <strong>Questions</strong>
                  </h3>
                  <p>
                    Discover common queries from our members. Click a question
                    to expand and read the full answer.
                  </p>
                </div>
              </div>

              {/* Accordion column */}
              <div className="col-lg-8" data-aos="fade-up" data-aos-delay="200">
                <div className="accordion" id="faqAccordion">
                  {faqData.map((item, index) => (
                    <div className="accordion-item" key={index}>
                      <h2 className="accordion-header" id={`heading${index}`}>
                        <button
                          className={`accordion-button ${
                            activeIndex === index ? "" : "collapsed"
                          }`}
                          type="button"
                          onClick={() => toggle(index)}
                          aria-expanded={activeIndex === index}
                          aria-controls={`collapse${index}`}
                        >
                          {item.question}
                        </button>
                      </h2>
                      <div
                        id={`collapse${index}`}
                        className={`accordion-collapse collapse ${
                          activeIndex === index ? "show" : ""
                        }`}
                        aria-labelledby={`heading${index}`}
                        data-bs-parent="#faqAccordion"
                      >
                        <div className="accordion-body">{item.answer}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </HelmetProvider>
  );
}

export default Home1;
