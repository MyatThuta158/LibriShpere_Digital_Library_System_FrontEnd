import React, { useEffect, useState } from "react";
import { getResources } from "../../api/resourceApi"; // Adjust the import path as necessary
import Menu from "../Layouts/Menu";
import { HelmetProvider, Helmet } from "react-helmet-async";

function Home() {
  const [resource, setResource] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const resResource = await getResources();
      setResource(resResource.data);
    }
    fetchData();
  }, []);

  console.log(resource);

  return (
    <HelmetProvider>
      <Helmet>
        <link rel="stylesheet" href="/style/style.css" />
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
              <a href="#about" className="btn-get-started">
                Start Membership
              </a>
              <a
                href="https://www.youtube.com/watch?v=Y7f98aduVJ8"
                className="glightbox btn-watch-video d-flex align-items-center"
              >
                <i className="bi bi-play-circle"></i>
                <span>Watch Video</span>
              </a>
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
                Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis
                aute irure dolor in reprehenderit in voluptate velit esse cillum
                dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt
                mollit anim id est laborumLorem ipsum dolor sit amet,
                consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit
                in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit anim id est laborumLorem ipsum dolor
                sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
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

        {/* This start latest book */}
        <section className="category-filter section-padding">
          {/* Title & Description */}
          <div className="container">
            <div className="center-content">
              <h2 className="section-title">Check Out The New Releases</h2>
              <span className="underline center"></span>
              <p className="lead">
                The standard chunk of Lorem Ipsum used since the 1500s is
                reproduced below for those interested.
              </p>
            </div>
          </div>

          {/* List of Resources */}
          <div id="category-filter">
            <ul className="category-list">
              {resource &&
                resource.map((item) => (
                  <li key={item.id} className="category-item">
                    <figure>
                      {/* 
                  If your cover_photo is stored in something like 
                  /public/userimg/... you might do:
                  src={`/${item.cover_photo}`} 
                  Or fetch from an absolute URL if your API returns one.
                */}
                      <img
                        src={`http://127.0.0.1:8000/public/${item.cover_photo}`}
                        alt={item.name}
                        /* fallback if image not found: */
                        onError={(e) => {
                          e.target.src = "images/placeholder.jpg";
                        }}
                      />
                      <figcaption className="bg-blue">
                        <div className="info-block">
                          <h4>{item.name}</h4>
                          <span className="author">
                            <strong>ISBN:</strong> {item.ISBN}
                          </span>
                          {/* Show publish date, code, or other fields as needed */}
                          <span className="author">
                            <strong>Code:</strong> {item.code}
                          </span>

                          {/* Example rating placeholder */}
                          <div className="rating">
                            <span>☆</span>
                            <span>☆</span>
                            <span>☆</span>
                            <span>☆</span>
                            <span>☆</span>
                          </div>

                          <p>{item.Description}</p>

                          <a href="#">
                            Read More <i className="fa fa-long-arrow-right"></i>
                          </a>
                          <ol>
                            <li>
                              <a href="#">
                                <i className="fa fa-shopping-cart"></i>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                <i className="fa fa-heart"></i>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                <i className="fa fa-envelope"></i>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                <i className="fa fa-share-alt"></i>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                <i className="fa fa-search"></i>
                              </a>
                            </li>
                          </ol>
                        </div>
                      </figcaption>
                    </figure>
                  </li>
                ))}
            </ul>
            <div className="clearfix"></div>
          </div>

          {/* Facts Counter (optional) */}
          <div className="container">
            <div className="fun-stuff">
              <div className="facts-counter">
                <ul>
                  <li className="col-sm-3">
                    <div className="fact-item icon-ebooks">
                      <div className="fact-icon">
                        <img src="images/icon-ebooks.png" alt="" />
                      </div>
                      <span>
                        eBooks<strong className="fact-counter">45780</strong>
                      </span>
                    </div>
                  </li>
                  <li className="col-sm-3">
                    <div className="fact-item icon-eaudio">
                      <div className="fact-icon">
                        <img src="images/icon-eaudio.png" alt="" />
                      </div>
                      <span>
                        eAudio<strong className="fact-counter">32450</strong>
                      </span>
                    </div>
                  </li>
                  <li className="col-sm-3">
                    <div className="fact-item icon-magazine">
                      <div className="fact-icon">
                        <img src="images/icon-magazine.png" alt="" />
                      </div>
                      <span>
                        Magazine<strong className="fact-counter">14450</strong>
                      </span>
                    </div>
                  </li>
                  <li className="col-sm-3">
                    <div className="fact-item icon-videos">
                      <div className="fact-icon">
                        <img src="images/icon-videos.png" alt="" />
                      </div>
                      <span>
                        Videos<strong className="fact-counter">32450</strong>
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* This end of latest book */}

        {/* <!-- Start: Our Community Section --> */}
        <section className="community-testimonial">
          <div className="container">
            <div className="text-center">
              <h2 className="section-title">Words From our Community</h2>
              <span className="underline center"></span>
              <p className="lead">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
            <div className="owl-carousel">
              <div className="single-testimonial-box">
                <div className="top-portion">
                  <img src="" alt="Testimonial Image" />
                  <div className="user-comment">
                    <div className="arrow-left"></div>
                    <blockquote cite="#">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Praesent urna magna, rhoncus eget commodo et, dignissim
                      non nulla. Sed sit amet vestibulum ex. Donec dolor velit
                    </blockquote>
                  </div>
                  <div className="clear"></div>
                </div>
                <div className="bottom-portion">
                  <a href="#" className="author">
                    Maria B (<small>Student )</small>
                  </a>
                  <div className="social-share-links">
                    <ul>
                      <li>
                        <a href="#">
                          <i className="fa fa-linkedin" aria-hidden="true"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fa fa-facebook" aria-hidden="true"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fa fa-twitter" aria-hidden="true"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fa fa-skype" aria-hidden="true"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i
                            className="fa fa-google-plus"
                            aria-hidden="true"
                          ></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="clearfix"></div>
                </div>
                <div className="clearfix"></div>
              </div>
              <div className="single-testimonial-box">
                <div className="top-portion">
                  <img src="/Customer/about1.jpg" alt="Testimonial Image" />
                  <div className="user-comment">
                    <div className="arrow-left"></div>
                    <blockquote cite="#">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Praesent urna magna, rhoncus eget commodo et, dignissim
                      non nulla. Sed sit amet vestibulum ex. Donec dolor velit
                    </blockquote>
                  </div>
                  <div className="clear"></div>
                </div>
                <div className="bottom-portion">
                  <a href="#" className="author">
                    Adrey Pachai (<small>Student )</small>
                  </a>
                  <div className="social-share-links">
                    <ul>
                      <li>
                        <a href="#">
                          <i className="fa fa-linkedin" aria-hidden="true"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fa fa-facebook" aria-hidden="true"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fa fa-twitter" aria-hidden="true"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fa fa-skype" aria-hidden="true"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i
                            className="fa fa-google-plus"
                            aria-hidden="true"
                          ></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="clearfix"></div>
                </div>
                <div className="clearfix"></div>
              </div>
              <div className="single-testimonial-box">
                <div className="top-portion">
                  <img
                    src="images/home-testimonial-01.jpg"
                    alt="Testimonial Image"
                  />
                  <div className="user-comment">
                    <div className="arrow-left"></div>
                    <blockquote cite="#">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Praesent urna magna, rhoncus eget commodo et, dignissim
                      non nulla. Sed sit amet vestibulum ex. Donec dolor velit
                    </blockquote>
                  </div>
                  <div className="clear"></div>
                </div>
                <div className="bottom-portion">
                  <a href="#" className="author">
                    Adrey Pachai (<small>Student )</small>
                  </a>
                  <div className="social-share-links">
                    <ul>
                      <li>
                        <a href="#">
                          <i className="fa fa-linkedin" aria-hidden="true"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fa fa-facebook" aria-hidden="true"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fa fa-twitter" aria-hidden="true"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fa fa-skype" aria-hidden="true"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i
                            className="fa fa-google-plus"
                            aria-hidden="true"
                          ></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="clearfix"></div>
                </div>
                <div className="clearfix"></div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="services-2"
          className="services-2 section bg-primary-subtle mt-5"
        >
          <div className="container section-title" data-aos="fade-up">
            <h2>Services</h2>
            <p>CHECK OUR SERVICES</p>
          </div>

          <div className="container w-100">
            <div className="row gy-4">
              <div className="col-md-6" data-aos="fade-up" data-aos-delay="100">
                <div className="service-item d-flex position-relative h-100">
                  <i className="bi bi-briefcase icon flex-shrink-0"></i>
                  <div>
                    <h4 className="title  text-center">
                      <a href="#" className="stretched-link">
                        Lorem Ipsum
                      </a>
                    </h4>
                    <p className="description">
                      Voluptatum deleniti atque corrupti quos dolores et quas
                      molestias excepturi sint occaecati cupiditate non
                      provident Voluptatum deleniti atque corrupti quos dolores
                      et quas molestias excepturi sint occaecati cupiditate non
                      provident Voluptatum deleniti atque corrupti quos dolores
                      et quas molestias excepturi sint occaecati cupiditate non
                      providentVoluptatum deleniti atque corrupti quos dolores
                      et quas molestias excepturi sint occaecati cupiditate non
                      providentVoluptatum deleniti atque corrupti quos dolores
                      et quas molestias excepturi sint occaecati cupiditate non
                      provident
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="col-md-6"
                data-aos="fade-up"
                style={{ height: "40vh" }}
                data-aos-delay="200"
              >
                <div className="service-item d-flex position-relative h-100">
                  <i className="bi bi-card-checklist icon flex-shrink-0"></i>
                  <div>
                    <h4 className="title text-center">
                      <a href="#" className="stretched-link">
                        Dolor Sitema
                      </a>
                    </h4>
                    <p className="description">
                      Minim veniam, quis nostrud exercitation ullamco laboris
                      nisi ut aliquip ex ea commodo consequat tarad limino ata
                      Minim veniam, quis nostrud exercitation ullamco laboris
                      nisi ut aliquip ex ea commodo consequat tarad limino
                      ataMinim veniam, quis nostrud exercitation ullamco laboris
                      nisi ut aliquip ex ea commodo consequat tarad limino
                      ataMinim veniam, quis nostrud exercitation ullamco laboris
                      nisi ut aliquip ex ea commodo consequat tarad limino ata
                      Minim veniam, quis nostrud exercitation ullamco laboris
                      nisi ut aliquip ex ea commodo consequat tarad limino
                      ataMinim veniam, quis nostrud exercitation ullamco laboris
                      nisi ut aliquip ex ea commodo consequat tarad limino ata
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6" data-aos="fade-up" data-aos-delay="300">
                <div className="service-item d-flex position-relative h-100">
                  <i className="bi bi-bar-chart icon flex-shrink-0"></i>
                  <div>
                    <h4 className="title  text-center">
                      <a href="#" className="stretched-link">
                        Sed ut perspiciatis
                      </a>
                    </h4>
                    <p className="description">
                      Duis aute irure dolor in reprehenderit in voluptate velit
                      esse cillum dolore eu fugiat nulla pariaturVoluptatum
                      deleniti atque corrupti quos dolores et quas molestias
                      excepturi sint occaecati cupiditate non
                      providentVoluptatum deleniti atque corrupti quos dolores
                      et quas molestias excepturi sint occaecati cupiditate non
                      providentVoluptatum deleniti atque corrupti quos dolores
                      et quas molestias excepturi sint occaecati cupiditate non
                      providentVoluptatum deleniti atque corrupti quos dolores
                      et quas molestias excepturi sint occaecati cupiditate non
                      provident
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="col-md-6"
                style={{ height: "40vh" }}
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <div className="service-item d-flex position-relative h-100">
                  <i className="bi bi-binoculars icon flex-shrink-0"></i>
                  <div>
                    <h4 className="title text-center">
                      <a href="#" className="stretched-link">
                        Magni Dolores
                      </a>
                    </h4>
                    <p className="description">
                      Excepteur sint occaecat cupidatat non proident, sunt in
                      culpa qui officia deserunt mollit anim id est
                      laborumVoluptatum deleniti atque corrupti quos dolores et
                      quas molestias excepturi sint occaecati cupiditate non
                      providentVoluptatum deleniti atque corrupti quos dolores
                      et quas molestias excepturi sint occaecati cupiditate non
                      providentVoluptatum deleniti atque corrupti quos dolores
                      et quas molestias excepturi sint occaecati cupiditate non
                      providentVoluptatum deleniti atque corrupti quos dolores
                      et quas molestias excepturi sint occaecati cupiditate non
                      providentVoluptatum deleniti atque corrupti quos dolores
                      et quas molestias excepturi sint occaecati cupiditate non
                      provident
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="contact section">
          <div className="container section-title" data-aos="fade-up">
            <h2>Contact</h2>
            <p className="text-primary">Our contact information</p>
          </div>

          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="row gy-4">
              <div className="col-lg-6 ">
                <div className="row gy-4">
                  <div className="col-lg-12">
                    <div
                      className="info-item d-flex flex-column justify-content-center align-items-center"
                      data-aos="fade-up"
                      data-aos-delay="200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="46"
                        height="46"
                        fill="currentColor"
                        className="bi text-primary bi-geo-alt-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
                      </svg>
                      <h3>Address</h3>
                      <p>A108 Adam Street, New York, NY 535022</p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div
                      className="info-item d-flex flex-column justify-content-center align-items-center"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="46"
                        height="46"
                        fill="currentColor"
                        className="bi text-primary bi-telephone-fill"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"
                        />
                      </svg>
                      <h3>Call Us</h3>
                      <p>+1 5589 55488 55</p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div
                      className="info-item d-flex flex-column justify-content-center align-items-center"
                      data-aos="fade-up"
                      data-aos-delay="400"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="46"
                        height="46"
                        fill="currentColor"
                        className="bi text-primary bi-envelope-open"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8.47 1.318a1 1 0 0 0-.94 0l-6 3.2A1 1 0 0 0 1 5.4v.817l5.75 3.45L8 8.917l1.25.75L15 6.217V5.4a1 1 0 0 0-.53-.882zM15 7.383l-4.778 2.867L15 13.117zm-.035 6.88L8 10.082l-6.965 4.18A1 1 0 0 0 2 15h12a1 1 0 0 0 .965-.738ZM1 13.116l4.778-2.867L1 7.383v5.734ZM7.059.435a2 2 0 0 1 1.882 0l6 3.2A2 2 0 0 1 16 5.4V14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5.4a2 2 0 0 1 1.059-1.765z" />
                      </svg>
                      <h3>Email Us</h3>
                      <p>info@example.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <form
                  action="forms/contact.php"
                  method="post"
                  className="php-email-form"
                  data-aos="fade-up"
                  data-aos-delay="500"
                >
                  <div className="row gy-4">
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Your Name"
                        required=""
                      />
                    </div>

                    <div className="col-md-6 ">
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        placeholder="Your Email"
                        required=""
                      />
                    </div>

                    <div className="col-md-12">
                      <input
                        type="text"
                        className="form-control"
                        name="subject"
                        placeholder="Subject"
                        required
                      />
                    </div>

                    <div className="col-md-12">
                      <textarea
                        className="form-control"
                        name="message"
                        rows="4"
                        placeholder="Message"
                        required=""
                      ></textarea>
                    </div>

                    <div className="col-md-12 text-center">
                      <div className="loading">Loading</div>
                      <div className="error-message"></div>
                      <div className="sent-message">
                        Your message has been sent. Thank you!
                      </div>

                      <button type="submit">Send Message</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        <footer id="footer" className="footer bg-primary text-white">
          <div className="container footer-top">
            <div className="row gy-4">
              <div className="col-lg-4 col-md-6 footer-about">
                <a href="index.html" className="logo d-flex align-items-center">
                  <span className="sitename text-white">LibriSphere</span>
                </a>
                <div className="footer-contact pt-3">
                  <p>A108 Adam Street</p>
                  <p>New York, NY 535022</p>
                  <p className="mt-3">
                    <strong>Phone:</strong> <span>+1 5589 55488 55</span>
                  </p>
                  <p>
                    <strong>Email:</strong> <span>info@example.com</span>
                  </p>
                </div>
                <div className="social-links text-white d-flex mt-4">
                  <a href="">
                    <i className="bi bi-twitter-x"></i>
                  </a>
                  <a href="">
                    <i className="bi bi-facebook"></i>
                  </a>
                  <a href="">
                    <i className="bi bi-instagram"></i>
                  </a>
                  <a href="">
                    <i className="bi bi-linkedin"></i>
                  </a>
                </div>
              </div>

              <div className="col-lg-2 col-md-3 footer-links text-white">
                <h4 className="text-white">Useful Links</h4>
                <ul>
                  <li>
                    <i className="bi bi-chevron-right"></i>{" "}
                    <a href="#" className="text-white">
                      Home
                    </a>
                  </li>
                  <li>
                    <i className="bi bi-chevron-right"></i>{" "}
                    <a href="#" className="text-white">
                      About us
                    </a>
                  </li>
                  <li>
                    <i className="bi bi-chevron-right"></i>{" "}
                    <a href="#" className="text-white">
                      Services
                    </a>
                  </li>
                  <li>
                    <i className="bi bi-chevron-right"></i>{" "}
                    <a href="#" className="text-white">
                      Terms of service
                    </a>
                  </li>
                  <li>
                    <i className="bi bi-chevron-right"></i>{" "}
                    <a href="#" className="text-white">
                      Privacy policy
                    </a>
                  </li>
                </ul>
              </div>

              <div className="col-lg-2 col-md-3 footer-links">
                <h4 className="text-white">Our Services</h4>
                <ul>
                  <li>
                    <i className="bi bi-chevron-right"></i>{" "}
                    <a href="#" className="text-white">
                      Web Design
                    </a>
                  </li>
                  <li>
                    <i className="bi bi-chevron-right"></i>{" "}
                    <a href="#" className="text-white">
                      Web Development
                    </a>
                  </li>
                  <li>
                    <i className="bi bi-chevron-right"></i>{" "}
                    <a href="#" className="text-white">
                      Product Management
                    </a>
                  </li>
                  <li>
                    <i className="bi bi-chevron-right"></i>{" "}
                    <a href="#" className="text-white">
                      Marketing
                    </a>
                  </li>
                  <li>
                    <i className="bi bi-chevron-right"></i>{" "}
                    <a href="#" className="text-white">
                      Graphic Design
                    </a>
                  </li>
                </ul>
              </div>

              <div className="col-lg-4 col-md-12 footer-newsletter">
                <h4 className="text-white">Our Newsletter</h4>
                <p className="text-white">
                  Subscribe to our newsletter and receive the latest news about
                  our products and services!
                </p>
                <form
                  action="forms/newsletter.php"
                  method="post"
                  className="php-email-form"
                >
                  <div className="newsletter-form">
                    <input type="email" name="email" />
                    <input type="submit" value="Subscribe" />
                  </div>
                  <div className="loading">Loading</div>
                  <div className="error-message"></div>
                  <div className="sent-message">
                    Your subscription request has been sent. Thank you!
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="container copyright text-center mt-4">
            <p>
              © <span>Copyright</span>{" "}
              <strong className="px-1 sitename">LibriSphere</strong>{" "}
              <span>All Rights Reserved</span>
            </p>
          </div>
        </footer>
      </div>
    </HelmetProvider>
  );
}

export default Home;
