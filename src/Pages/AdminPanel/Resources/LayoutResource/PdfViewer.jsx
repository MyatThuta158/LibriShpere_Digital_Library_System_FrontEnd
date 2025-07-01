// PdfViewer.jsx
import React, { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { detail, fetchFile } from "../../../../api/resourceApi";

// Set the workerSrc for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfViewer = ({ fileId }) => {
  const [pdfData, setPdfData] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [pageWidth, setPageWidth] = useState(null);
  const containerRef = useRef();

  useEffect(() => {
    // Fetch the PDF details and file when the component mounts
    const fetchPdf = async () => {
      try {
        const fileDetail = await detail(fileId);
        console.log("File detail:", fileDetail);
        const data = await fetchFile(fileId);
        setPdfData(data);
      } catch (error) {
        console.error("Error fetching the PDF:", error);
      }
    };

    fetchPdf();
  }, [fileId]);

  // Update the page width dynamically and handle window resize
  useEffect(() => {
    const updatePageWidth = () => {
      if (containerRef.current) {
        setPageWidth(containerRef.current.clientWidth);
      }
    };

    updatePageWidth();
    window.addEventListener("resize", updatePageWidth);
    return () => window.removeEventListener("resize", updatePageWidth);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const changePage = (offset) => {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  };

  const zoomIn = () => setZoom((prevZoom) => prevZoom + 0.2);
  const zoomOut = () =>
    setZoom((prevZoom) => (prevZoom - 0.2 >= 0.5 ? prevZoom - 0.2 : prevZoom));

  return (
    <div
      style={{
        height: "100vh", // Full viewport height
        display: "flex",
        justifyContent: "center",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          height: "100%",
          background: "#fff",
          boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Fixed Toolbar */}
        <div
          style={{
            flexShrink: 0,
            padding: "10px 15px",
            borderBottom: "1px solid #ddd",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#fafafa",
            zIndex: 1, // ensure it stays on top
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              type="button"
              disabled={pageNumber <= 1}
              onClick={() => changePage(-1)}
              style={{ marginRight: "10px" }}
            >
              Previous
            </button>
            <span>
              Page {pageNumber} of {numPages}
            </span>
            <button
              type="button"
              disabled={pageNumber >= numPages}
              onClick={() => changePage(1)}
              style={{ marginLeft: "10px" }}
            >
              Next
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <button onClick={zoomOut} style={{ marginRight: "10px" }}>
              -
            </button>
            <span>{Math.round(zoom * 100)}%</span>
            <button onClick={zoomIn} style={{ marginLeft: "10px" }}>
              +
            </button>
          </div>
        </div>
        {/* Scrollable PDF Viewer */}
        <div
          ref={containerRef}
          style={{
            flex: 1,
            overflow: "auto",
            padding: "10px",
          }}
        >
          {pdfData ? (
            <Document
              file={pdfData}
              onLoadSuccess={onDocumentLoadSuccess}
              loading="Loading PDF..."
            >
              {pageWidth && (
                <Page
                  pageNumber={pageNumber}
                  width={pageWidth * zoom}
                  loading=""
                />
              )}
            </Document>
          ) : (
            <p style={{ padding: "20px", textAlign: "center" }}>
              Loading PDF...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
