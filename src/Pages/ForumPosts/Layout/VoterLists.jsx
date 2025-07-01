import React, { useEffect, useState } from "react";
import { getVoters } from "../../../api/voteApi"; // Adjust the path as needed

function VoterLists({ id, onClose, show }) {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // "all", "upvote", "downvote"
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const response = await getVoters(id);
        setVoters(response.voters || []);
        console.log(voters);
      } catch (err) {
        console.error(err);
        setError("Failed to load voters.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVoters();
    }
  }, [id]);

  if (!show) return null;

  // Filter voters based on active tab selection.
  let filteredVoters = [];
  if (activeTab === "all") {
    filteredVoters = voters;
  } else if (activeTab === "upvote") {
    filteredVoters = voters.filter((vote) => vote.vote_type_id === 1);
    console.log(filteredVoters);
  } else if (activeTab === "downvote") {
    filteredVoters = voters.filter((vote) => vote.vote_type_id === 2);
  }

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop fade show"></div>
      {/* Modal */}
      <div
        className="modal fade show"
        style={{ display: "block" }}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="voterListModalLabel"
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="voterListModalLabel">
                Voter List
              </h5>
              <button
                type="button"
                className="close"
                onClick={onClose}
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {/* Tabs for filtering */}
              <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "all" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("all")}
                  >
                    All
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "upvote" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("upvote")}
                  >
                    Upvote
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "downvote" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("downvote")}
                  >
                    Downvote
                  </button>
                </li>
              </ul>

              {loading && <p>Loading...</p>}
              {error && <p className="text-danger">{error}</p>}
              {!loading && !error && (
                <>
                  {filteredVoters.length > 0 ? (
                    <ul className="list-group">
                      {filteredVoters.map((vote, index) => (
                        <li
                          key={index}
                          className="list-group-item d-flex align-items-center"
                        >
                          <img
                            src={
                              vote.user.ProfilePic
                                ? `http://127.0.0.1:8000/storage/${vote.user.ProfilePic}`
                                : "/Customer/pic.jpg"
                            }
                            alt={vote.user.name}
                            className="rounded-circle mr-3"
                            style={{ width: "40px", height: "40px" }}
                          />
                          <span>{vote.user.name}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No voters found for this category.</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VoterLists;
