import React, { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { detail } from "../../../api/resourceApi";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useNavigate, useParams } from "react-router-dom";
import EpubViewer from "./LayoutResource/EpubViewer"; // Adjust the path as necessary
import PdfViewer from "./LayoutResource/PdfViewer";
import VideoViewer from "./LayoutResource/VideoViewer";

// Set the workerSrc for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ReadResource = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const containerRef = useRef();
  const [fileType, setFiletype] = useState("");
  const [resourceId, setResourceid] = useState();

  const getFileType = (filePath) => {
    // Ensure filePath is defined and a string
    if (filePath && typeof filePath === "string") {
      // Split the filePath on periods and get the last segment
      return filePath.split(".").pop().toLowerCase();
    }
    return "";
  };

  useEffect(() => {
    // Fetch the PDF when the component mounts using the api function
    const fetchPdf = async () => {
      try {
        const file = await detail(id);
        console.log(file);

        const type = getFileType(file.data.file);

        console.log(type);

        setFiletype(type);
        setResourceid(file.data.id);

        //   const data = await fetchPdfFile(4);
      } catch (error) {
        console.error("Error fetching the PDF:", error);
      }
    };

    fetchPdf();
  }, []);

  console.log(fileType);

  return (
    <div
      ref={containerRef}
      className="bg-white"
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",

        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <span
        onClick={() => navigate(-1)}
        className="ms-5"
        style={{ cursor: "pointer" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          fill="currentColor"
          className="bi bi-arrow-left me-5"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
          />
        </svg>
      </span>
      {(() => {
        //console.log(fileType);
        switch (fileType) {
          case "pdf":
            // Pass a unique identifier or fileId so that PdfViewer can fetch the correct file.
            return <PdfViewer fileId={id} />;
          // Uncomment and implement this case if needed in the future
          case "epub":
            return <EpubViewer fileId={id} />;
          // Uncomment and implement these cases if needed in the future
          // case "mp3":
          // case "wav":
          //   return <AudioPlayer file={resource.file} />;
          case "mp4":
          case "webm":
            return <VideoViewer fileId={id} />;
          default:
            return <p>Unsupported file type: {fileType}</p>;
        }
      })()}
    </div>
  );
};

export default ReadResource;
