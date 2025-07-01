import React, { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import { useParams, useNavigate } from "react-router-dom";

function PdfReader() {
  const { file } = useParams(); // Expecting a route like /pdf/:file
  const navigate = useNavigate();

  // Construct the PDF URL – adjust the path according to your file storage setup.
  const pdfUrl = file ? `/path/to/pdfs/${file}` : "";

  const [numPages, setNumPages] = useState(null);
  const [fileExists, setFileExists] = useState(true);

  useEffect(() => {
    if (pdfUrl) {
      // Check if the PDF file exists using a HEAD request.
      fetch(pdfUrl, { method: "HEAD" })
        .then((res) => {
          if (!res.ok) {
            throw new Error("File not found");
          }
        })
        .catch((err) => {
          alert("PDF file not found. Returning to the previous page.");
          setFileExists(false);
          navigate(-1);
        });
    }
  }, [pdfUrl, navigate]);

  // Callback when the PDF document loads successfully.
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // If no PDF URL is provided or the file doesn't exist, render nothing.
  if (!pdfUrl || !fileExists) {
    return null;
  }

  return (
    <div
      style={{ height: "100vh", overflowY: "auto" }}
      // Prevent right-click to deter downloading.
      onContextMenu={(e) => e.preventDefault()}
    >
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={() => {
          alert("Error loading PDF file. Returning to the previous page.");
          navigate(-1);
        }}
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} />
        ))}
      </Document>
    </div>
  );
}

export default PdfReader;
