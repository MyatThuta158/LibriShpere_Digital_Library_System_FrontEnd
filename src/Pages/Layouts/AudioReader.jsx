import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function AudioReader() {
  const { file } = useParams(); // e.g., from a route like /audio/:file
  const navigate = useNavigate();

  // Construct the audio file URL – adjust the path based on your storage setup.
  const audioUrl = file ? `/path/to/audios/${file}` : "";

  const [fileExists, setFileExists] = useState(true);

  useEffect(() => {
    if (audioUrl) {
      // Check if the audio file exists using a HEAD request.
      fetch(audioUrl, { method: "HEAD" })
        .then((res) => {
          if (!res.ok) {
            throw new Error("File not found");
          }
        })
        .catch((err) => {
          alert("Audio file not found. Returning to the previous page.");
          setFileExists(false);
          navigate(-1);
        });
    }
  }, [audioUrl, navigate]);

  // If no valid audio file is provided or the file doesn't exist, render nothing.
  if (!audioUrl || !fileExists) {
    return null;
  }

  return (
    <div
      style={{ textAlign: "center", marginTop: "20px" }}
      // Disable right-click to deter downloads.
      onContextMenu={(e) => e.preventDefault()}
    >
      <audio controls controlsList="nodownload" style={{ width: "100%" }}>
        <source src={audioUrl} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

export default AudioReader;
