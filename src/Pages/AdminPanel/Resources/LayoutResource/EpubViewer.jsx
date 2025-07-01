import React, { useState, useEffect, useRef } from "react";
import { ReactReader } from "react-reader";
import { fetchFile } from "../../../../api/resourceApi";

const EpubViewer = ({ fileId }) => {
  const [epubData, setEpubData] = useState(null);
  const [location, setLocation] = useState(null); // ← null initial
  const [zoom, setZoom] = useState(1);
  const viewerRef = useRef(null);

  useEffect(() => {
    const fetchEpub = async () => {
      try {
        const data = await fetchFile(fileId);
        setEpubData(data);
      } catch (err) {
        console.error("Error fetching EPUB:", err);
      }
    };
    fetchEpub();
  }, [fileId]);

  const zoomIn = () => setZoom((z) => Math.min(z + 0.2, 2));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.5));

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        background: "#f5f5f5",
        padding: 10,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 800,
          height: "100%",
          background: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          borderRadius: 8,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Toolbar */}
        <div
          style={{
            padding: "10px 15px",
            borderBottom: "1px solid #ddd",
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "#fafafa",
          }}
        >
          <div>
            <button
              onClick={() => viewerRef.current?.prevPage()}
              style={{ marginRight: 10 }}
            >
              Previous
            </button>
            <button onClick={() => viewerRef.current?.nextPage()}>Next</button>
          </div>
          <div>
            <button onClick={zoomOut} style={{ marginRight: 10 }}>
              -
            </button>
            <span>{Math.round(zoom * 100)}%</span>
            <button onClick={zoomIn} style={{ marginLeft: 10 }}>
              +
            </button>
          </div>
        </div>

        {/* EPUB Container */}
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            position: "relative",
            transform: `scale(${zoom})`,
            transformOrigin: "0 0",
            width: `${100 / zoom}%`,
            height: `${100 / zoom}%`,
          }}
        >
          {epubData ? (
            <ReactReader
              ref={viewerRef}
              url={epubData}
              location={location}
              locationChanged={setLocation}
              showToc={false}
              getRendition={(rendition) => {
                const spine_get = rendition.book.spine.get.bind(
                  rendition.book.spine
                );
                rendition.book.spine.get = function (target) {
                  let sec = spine_get(target);
                  if (!sec) {
                    sec = spine_get(undefined);
                  }
                  return sec;
                };
              }}
              styles={{
                container: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                },
              }}
            />
          ) : (
            <div
              style={{
                padding: 20,
                textAlign: "center",
                position: "absolute",
                width: "100%",
                height: "100%",
              }}
            >
              Loading EPUB...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EpubViewer;
