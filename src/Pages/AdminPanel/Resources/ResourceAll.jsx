import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css"; // Import annotation styles

// Set up the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

function ResourceAll() {
  const [fileUrl, setFileUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // PDF file in the "public" folder
    setFileUrl(
      `http://127.0.0.1:8000/test_files/Jon_Gordon_The_Power_of_a_Positive_Team_Proven_Principles_and_Practices.pdf`
    );
  }, []);

  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, numPages));
  };

  return (
    <div>
      {fileUrl ? (
        <div>
          {/* Display the PDF */}
          <Document file={fileUrl} onLoadSuccess={onLoadSuccess}>
            <Page pageNumber={currentPage} />
          </Document>

          {/* Pagination Controls */}
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <button onClick={goToPreviousPage} disabled={currentPage === 1}>
              Previous
            </button>
            <span style={{ margin: "0 10px" }}>
              Page {currentPage} of {numPages}
            </span>
            <button onClick={goToNextPage} disabled={currentPage === numPages}>
              Next
            </button>
          </div>
        </div>
      ) : (
        <p>Loading document...</p>
      )}
    </div>
  );
}

export default ResourceAll;

///////////////////////////

// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import ePub from "epubjs"; // Import the epub.js library

// function ResourceDetail() {
//   const { id } = useParams(); // Get the resource ID from the URL
//   const [book, setBook] = useState(null); // State to hold the book object

//   useEffect(() => {
//     const fetchFile = async () => {
//       try {
//         // Assuming you're fetching the EPUB file URL based on the resource ID
//         const response = await fetch(
//           `http://127.0.0.1:8000/file/zPYCKdNwUjwWhRxlVLeCcIMUEdWDl0i1MZA5x8V0.epub`
//         );
//         const blob = await response.blob();
//         const url = URL.createObjectURL(blob); // Create a URL for the blob

//         // Load the EPUB file using epub.js
//         const epubBook = ePub(url);

//         // Set the book in the state
//         setBook(epubBook);
//       } catch (error) {
//         console.error("Error fetching the EPUB file:", error);
//       }
//     };

//     fetchFile();
//   }, [id]);

//   useEffect(() => {
//     if (book) {
//       // Render the EPUB file when the book is loaded
//       const rendition = book.renderTo("viewer", {
//         width: "100%",
//         height: "600px", // Set the height as per your requirement
//       });

//       book.ready.then(() => {
//         rendition.display(); // Display the first chapter
//       });
//     }
//   }, [book]);

//   return (
//     <div>
//       <div id="viewer" style={{ width: "100%", height: "600px" }}></div>
//       {!book && <p>Loading EPUB file...</p>}
//     </div>
//   );
// }

//export default ResourceDetail;
