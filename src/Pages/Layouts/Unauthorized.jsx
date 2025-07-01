import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const AccessDenied = () => {
  const navigate = useNavigate();
  return (
    <HelmetProvider>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Access Denied</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="stylesheet"
          href="https://www.w3schools.com/w3css/4/w3.css"
        />
      </Helmet>

      <style>{`
        body {
          background-color: black;
          color: white;
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
        }
        h1 {
          color: red;
        }
        h6 {
          color: red;
          text-decoration: underline;
        }
      `}</style>

      <div className="w3-display-middle">
        <h1 className="w3-jumbo w3-animate-top w3-center">
          <code>Access Denied</code>
        </h1>
        <hr
          className="w3-border-white w3-animate-left"
          style={{ margin: "auto", width: "50%" }}
        />
        <h3 className="w3-center w3-animate-right">
          You don't have permission to view this site.
        </h3>
        <h3 className="w3-center w3-animate-zoom">🚫🚫🚫🚫</h3>
        <h6 className="w3-center w3-animate-zoom">error code:403 forbidden</h6>
        <span
          onClick={() => navigate("/")}
          className="text-center mx-auto d-flex justify-content-center"
          style={{ cursor: "pointer" }}
        >
          Go Back
        </span>
      </div>
    </HelmetProvider>
  );
};

export default AccessDenied;
