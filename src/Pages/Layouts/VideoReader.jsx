import React from "react";
import { useParams, useNavigate } from "react-router-dom";

function VideoReader() {
  const { file } = useParams(); // e.g., from a route like /video/:file
  const navigate = useNavigate();

  // Construct the video source URL.
  const videoSrc = file ? `/path/to/videos/${file}` : "";

  // Handle error event on video (e.g., file not found)
  const handleVideoError = () => {
    // Show a message box to the user.
    alert("Video file not found. Returning to the previous page.");
    // Navigate back to the previous page.
    navigate(-1);
  };

  return (
    <div>
      {videoSrc ? (
        <video
          width="100%"
          height="auto"
          controls
          // Prevent the download option
          controlsList="nodownload"
          // Disable right-click context menu on the video element
          onContextMenu={(e) => e.preventDefault()}
          // When the video source cannot be loaded, trigger the error handler
          onError={handleVideoError}
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div>
          <p>No video file provided.</p>
          <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
      )}
    </div>
  );
}

export default VideoReader;
