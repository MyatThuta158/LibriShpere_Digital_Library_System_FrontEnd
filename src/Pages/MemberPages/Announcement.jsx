import React, { useState, useEffect } from "react";
import { getAnnouncements } from "../../api/announcementApi"; // adjust the path as needed

function Announcement() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    getAnnouncements()
      .then((response) => {
        setAnnouncements(response.data);
      })
      .catch((error) => {
        console.error("Error fetching announcements:", error);
      });
  }, []);

  return (
    <div className="container my-4">
      <h2 className="mb-4 text-center fw-bold">Announcements</h2>
      {announcements.map((announcement) => (
        <div
          key={announcement.id}
          className="card mb-3 text-white"
          style={{ backgroundColor: "#4e73df" }}
        >
          <div className="card-header  text-white ">
            <h5 className="mb-0 text-white">{announcement.title}</h5>
          </div>
          <div className="card-body" style={{ backgroundColor: "#4e73df" }}>
            <p className="card-text">{announcement.description}</p>
          </div>
          <div className="card-footer  text-white">
            Posted by on{" "}
            {new Date(announcement.created_at).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Announcement;
