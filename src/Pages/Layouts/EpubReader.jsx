import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ReactReader } from "react-reader";

function EpubReader() {
  const { file } = useParams(); // e.g. route: /epub/:file
  const navigate = useNavigate();

  // Construct the EPUB file URL. Adjust the path as needed.
  const epubUrl = file ? `/path/to/epubs/${file}` : "";

  const [location, setLocation] = useState(null);
  const [fileExists, setFileExists] = useState(true);

  useEffect(() => {
    if (epubUrl) {
      // Check if the EPUB file exists by sending a HEAD request
      fetch(epubUrl, { method: "HEAD" })
        .then((res) => {
          if (!res.ok) {
            throw new Error("File not found");
          }
        })
        .catch((err) => {
          alert("EPUB file not found. Returning to the previous page.");
          setFileExists(false);
          navigate(-1);
        });
    }
  }, [epubUrl, navigate]);

  // If no EPUB URL is provided or the file does not exist, render nothing.
  if (!epubUrl || !fileExists) {
    return null;
  }

  return (
    <div
      style={{ position: "relative", height: "100vh" }}
      // Disable right-click to help deter downloading
      onContextMenu={(e) => e.preventDefault()}
    >
      <ReactReader
        url={epubUrl}
        title="Epub Book"
        location={location}
        locationChanged={setLocation}
      />
    </div>
  );
}

export default EpubReader;
