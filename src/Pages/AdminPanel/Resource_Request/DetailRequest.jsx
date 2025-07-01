import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addComments, adminRequests } from "../../../api/requestresourceApi";

function Detaildata() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [adminComment, setAdminComment] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await adminRequests(id);
        if (response.data.length > 0) {
          setData(response.data[0]);
          setAdminComment(response.data[0].Admin_Comment || "");
        } else {
          setData(null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setData(null);
      }
    };

    getData();
  }, [id]);

  const handleSaveComment = async () => {
    try {
      const res = await addComments(id, { Admin_Comment: adminComment });
      console.log(res.message);
      // Show modal on successful save
      setShowModal(true);
    } catch (error) {
      console.error("Error saving comment:", error);
      alert("Failed to save comment.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate(-1); // Navigate back to previous page
  };

  if (!data) {
    return <p className="text-center py-4">No data available</p>;
  }

  return (
    <div className="container text-black py-2">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="border border-black-3 shadow-sm p-3 rounded">
            <img
              src={`http://127.0.0.1:8000/storage/${data.Resource_Photo}`}
              className="img-fluid w-100 rounded"
              alt={data.Title}
              style={{ maxHeight: "40vh", objectFit: "cover" }}
            />
            <div className="mt-3">
              <p>
                <strong>Title:</strong> {data.Title}
              </p>
              <p>
                <strong>ISBN:</strong> {data.ISBN}
              </p>
              <p className="text-dark">
                <strong>Author:</strong> {data.Author}
              </p>
              <p>
                <strong>Language:</strong> {data.Language}
              </p>
              <p>
                <strong>Published Year:</strong> {data.PublishYear}
              </p>
              {data.Admin_Comment && (
                <p className="text-muted">
                  <strong>Admin Comment:</strong> {data.Admin_Comment}
                </p>
              )}
              <p className="text-end text-secondary small">
                Requested on: {new Date(data.created_at).toLocaleDateString()}
              </p>
              <div className="mt-3">
                <label htmlFor="adminComment" className="form-label">
                  <strong>Admin Comment:</strong>
                </label>
                <textarea
                  id="adminComment"
                  className="form-control"
                  rows="3"
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                ></textarea>
                <button
                  className="btn btn-primary mt-2"
                  onClick={handleSaveComment}
                >
                  Save Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Section */}
      {showModal && (
        <>
          {/* Backdrop rendered first */}
          <div className="modal-backdrop fade show"></div>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            style={{ zIndex: 1050 }}
          >
            <div
              className="modal-dialog modal-dialog-centered"
              role="document"
              style={{ pointerEvents: "auto" }}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Success</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseModal}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Comment saved successfully!</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Detaildata;
