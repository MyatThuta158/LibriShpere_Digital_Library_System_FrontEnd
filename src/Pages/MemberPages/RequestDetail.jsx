import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminRequests } from "../../api/requestresourceApi";

function RequestDetail() {
  const { id } = useParams();

  console.log({ id });
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);

  useEffect(() => {
    // Fetch the request data once on mount
    const fetchRequest = async () => {
      try {
        const response = await adminRequests(id);
        if (response.data.length > 0) {
          setRequest(response.data[0]);
        } else {
          setRequest(null);
        }
      } catch (error) {
        console.error("Error fetching request:", error);
        setRequest(null);
      }
    };

    fetchRequest();
  }, [id]); // runs when `id` changes :contentReference[oaicite:0]{index=0} :contentReference[oaicite:1]{index=1}

  if (!request) {
    return (
      <div className="container py-5 text-center">
        <p>No request data available.</p>
        <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container text-black py-4">
      <button className="btn btn-link mb-3" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="card shadow-sm">
        <img
          src={`http://127.0.0.1:8000/storage/${request.Resource_Photo}`}
          className="card-img-top"
          alt={request.Title}
          style={{ maxHeight: "40vh", objectFit: "cover" }}
        />

        <div className="card-body">
          <h5 className="card-title">{request.Title}</h5>
          <p className="card-text">
            <strong>Author:</strong> {request.Author}
          </p>
          <p className="card-text">
            <strong>ISBN:</strong> {request.ISBN}
          </p>
          <p className="card-text">
            <strong>Language:</strong> {request.Language}
          </p>
          <p className="card-text">
            <strong>Published Year:</strong> {request.PublishYear}
          </p>

          <hr />

          <h6>Admin Comment</h6>
          {request.Admin_Comment ? (
            <p className="border p-3 rounded bg-light">
              {request.Admin_Comment}
            </p>
          ) : (
            <p className="text-muted">No comment provided.</p>
          )}

          <p className="text-end text-secondary small">
            Requested on: {new Date(request.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default RequestDetail;
