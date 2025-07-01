import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAnnouncements,
  deleteAnnouncement,
} from "../../../api/announcementApi";
import _ from "lodash";

function ShowAnnouncment() {
  const [initialAnnouncements, setInitialAnnouncements] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [changeState, setChangeState] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Updated to show 5 rows per page

  // Function to fetch all announcements
  const getAllData = async () => {
    try {
      const dataResult = await getAnnouncements();
      console.log(dataResult);
      return dataResult.data;
    } catch (err) {
      setMessage(err);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllData();
      // Optional: sort data by created date or title
      const sortedData = _.sortBy(data, ["created_at"]);
      setAnnouncements(sortedData);
      setInitialAnnouncements(sortedData);
    };
    fetchData();
  }, [changeState]);

  // Filter announcements by search value (if needed)
  useEffect(() => {
    if (searchValue) {
      const searchResult = initialAnnouncements.filter((announcement) =>
        announcement.title.toLowerCase().startsWith(searchValue.toLowerCase())
      );
      setAnnouncements(searchResult);
      setCurrentPage(1);
    } else {
      setAnnouncements(initialAnnouncements);
    }
  }, [searchValue, initialAnnouncements]);

  // Function to delete an announcement
  const deleteAnnouncementItem = async () => {
    try {
      const result = await deleteAnnouncement(deleteId);
      if (result.status === 200) {
        setAnnouncements(announcements.filter((item) => item.id !== deleteId));
        setDeleteId(null);
        setChangeState(!changeState);
        setDeleteSuccess(true);
      } else {
        setMessage(result.data);
      }
    } catch (err) {
      setMessage(err);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAnnouncements = announcements.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(announcements.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <div className="container-fluid h-100">
        <h1 className="text-center fs-2 text-bolder">All Announcements</h1>

        {/* Search Form */}
        {/* <div className="d-flex w-100 justify-content-center my-3">
          <div className="input-group w-50">
            <span
              className="input-group-text bg-white border-end-0"
              style={{ borderRadius: "8px 0 0 8px" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-search"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search Announcements..."
              className="form-control border-start-0"
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ borderRadius: "0 8px 8px 0" }}
            />
          </div>
        </div> */}

        {announcements && announcements.length > 0 ? (
          <>
            <div
              className="table-responsive"
              style={{ overflowY: "auto", height: "auto" }}
            >
              <table className="table table-striped table-bordered">
                <thead
                  className="thead-dark"
                  style={{ position: "sticky", top: "0" }}
                >
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Created Date</th>
                    <th>Created By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAnnouncements.map((announcement) => (
                    <tr key={announcement.id}>
                      <td>{announcement.id}</td>
                      <td>{announcement.title}</td>
                      <td>
                        {new Date(announcement.created_at).toLocaleDateString()}
                      </td>
                      <td>{announcement.admin && announcement.admin.Name}</td>
                      <td>
                        <button
                          className="btn btn-primary mx-2"
                          style={{ borderRadius: "8px" }}
                          onClick={() =>
                            navigate(
                              `/Admin/ViewAnnouncementDetail/${announcement.id}`
                            )
                          }
                        >
                          Detail
                        </button>
                        <button
                          className="btn btn-danger mx-2"
                          style={{ borderRadius: "8px" }}
                          onClick={() => {
                            setDeleteId(announcement.id);
                            setConfirmDelete(true);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <nav>
              <ul className="pagination justify-content-center">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, index) => (
                  <li
                    key={index}
                    className={`page-item ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </>
        ) : (
          <h1 className="text-center fs-2 text-bolder">
            No Announcements Data
          </h1>
        )}
      </div>

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="modal" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setConfirmDelete(false);
                    setDeleteId(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this announcement?</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setConfirmDelete(false);
                    setDeleteId(null);
                  }}
                >
                  No
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    setConfirmDelete(false);
                    deleteAnnouncementItem();
                  }}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Success Modal */}
      {deleteSuccess && (
        <div className="modal" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Success</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setDeleteSuccess(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Announcement deleted successfully.</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  onClick={() => setDeleteSuccess(false)}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShowAnnouncment;
