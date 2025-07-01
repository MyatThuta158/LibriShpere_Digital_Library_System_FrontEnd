import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import { detail, streamVideo } from "../../../../api/resourceApi";

const VideoViewer = ({ fileId }) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef();

  // Fetch video details and streaming URL on mount
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const fileDetail = await detail(fileId);
        console.log("Video file detail:", fileDetail);
        const videoUrl = streamVideo(fileId);
        setVideoUrl(videoUrl);
      } catch (error) {
        console.error("Error fetching the video:", error);
      }
    };
    fetchVideo();
  }, [fileId]);

  // Check viewport width for responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Inline style objects
  const styles = {
    videoViewer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 15px",
    },
    videoHeader: {
      width: "100%",
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 0",
      borderBottom: "1px solid #ddd",
      textAlign: isMobile ? "center" : "left",
    },
    logo: {
      fontSize: "1.5em",
      fontWeight: "bold",
    },
    videoNav: {
      display: "flex",
      alignItems: "center",
      marginTop: isMobile ? "10px" : "0",
    },
    navLink: {
      marginLeft: "15px",
      textDecoration: "none",
      color: "#333",
    },
    videoContainer: {
      width: "80vw",
      height: "80vh",
      position: "relative",
      // paddingTop: "56.25%", // 16:9 aspect ratio
      margin: "20px 0",
      backgroundColor: "#000",
    },
    videoContent: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    },
    loading: {
      color: "#fff",
      textAlign: "center",
      padding: "20px",
    },
    videoDescription: {
      width: "100%",
      padding: "15px",
    },
    videoFooter: {
      width: "100%",
      textAlign: "center",
      padding: "15px 0",
      borderTop: "1px solid #ddd",
      marginTop: "20px",
      fontSize: "0.9em",
      color: "#666",
    },
  };

  return (
    <div style={styles.videoViewer}>
      <div style={styles.videoContainer} ref={containerRef}>
        {videoUrl ? (
          <ReactPlayer
            url={`http://127.0.0.1:8000/streamVideo/${fileId}?nocache=${Date.now()}`}
            playing={isPlaying}
            controls
            width="100%"
            height="100%"
            volume={volume}
            config={{
              file: {
                attributes: {
                  controlsList: "nodownload",
                  onContextMenu: (e) => e.preventDefault(),
                },
              },
            }}
          />
        ) : (
          <p style={styles.loading}>Loading video...</p>
        )}
      </div>
    </div>
  );
};

export default VideoViewer;
