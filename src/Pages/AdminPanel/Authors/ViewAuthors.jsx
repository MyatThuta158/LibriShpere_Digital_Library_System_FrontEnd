import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthors, deleteAuthors } from "../../../api/authorsApi";
import _ from "lodash";

function ViewAuthors() {
  const [initialAuthors, setInitialAuthors] = useState([]);
  const [authors, setAuthors] = useState([]); // store author data
  const [message, setMessage] = useState(""); // for messages
  const navigate = useNavigate(); // for page navigation
  const [deleteId, setDeleteId] = useState(null); // store id to be deleted
  const [confirmDelete, setConfirmDelete] = useState(false); // toggle confirm modal
  const [deleteSuccess, setDeleteSuccess] = useState(false); // toggle success dialog
  const [changeState, setChangeState] = useState(false); // to trigger refresh
  const [searchValue, setSearchvalue] = useState(""); // for search value

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // 5 rows per page

  // Function to get all authors data from the database
  const getAlldata = async () => {
    const dataResult = await getAuthors();
    const data = dataResult.data;
    return data;
  };

  useEffect(() => {
    // Fetch data from the database
    const fetchData = async () => {
      try {
        const authorData = await getAlldata();
        const data = _.sortBy(authorData, ["name"]);
        setAuthors(data);
        setInitialAuthors(data);
      } catch (err) {
        setMessage(err);
      }
    };

    fetchData();
  }, [changeState]);

  // Search process: now only shows authors whose names start with the search parameter.
  useEffect(() => {
    if (searchValue) {
      let searchResult = initialAuthors.filter((author) =>
        author.name.toLowerCase().startsWith(searchValue.toLowerCase())
      );
      setAuthors(searchResult);
      setCurrentPage(1); // reset to first page on new search
    } else {
      setAuthors(initialAuthors);
    }
  }, [searchValue, initialAuthors]);

  // Delete author function
  const deleteAuthor = async () => {
    try {
      const result = await deleteAuthors(deleteId);
      if (result.status === 200) {
        // Remove the deleted author from the list and update state
        setAuthors(authors.filter((author) => author.id !== deleteId));
        setDeleteId(null);
        setChangeState(!changeState);
        // Show success dialog
        setDeleteSuccess(true);
      } else {
        setMessage(result.data);
      }
    } catch (err) {
      setMessage(err);
    }
  };

  // Calculate pagination indices
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAuthors = authors.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(authors.length / itemsPerPage);

  // Handler for page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <div className="container-fluid h-100">
        <h1 className="text-center fs-2 text-bolder">All Authors</h1>

        {/* Redesigned Search form */}
        <div className="d-flex w-100 justify-content-center my-3">
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
              placeholder="Search Authors..."
              className="form-control border-start-0"
              onChange={(e) => setSearchvalue(e.target.value)}
              style={{ borderRadius: "0 8px 8px 0" }}
            />
          </div>
        </div>

        {authors && authors.length > 0 ? (
          <>
            <div
              className="table-responsive"
              style={{ overflowY: "auto", height: "47vh" }}
            >
              <table className="table table-striped table-bordered">
                <thead
                  className="thead-dark"
                  style={{ position: "sticky", top: "0" }}
                >
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAuthors.map((author) => (
                    <tr key={author.id}>
                      <td>{author.id}</td>
                      <td>{author.name}</td>
                      <td>
                        <button
                          className="btn btn-primary mx-2"
                          style={{ borderRadius: "8px" }}
                          onClick={() => {
                            navigate(`/Admin/UpdateAuthors/${author.id}`, {
                              state: { name: author.name },
                            });
                          }}
                        >
                          Update
                        </button>
                        <button
                          className="btn btn-danger mx-2"
                          style={{ borderRadius: "8px" }}
                          onClick={() => {
                            setDeleteId(author.id);
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
          <h1 className="text-center fs-2 text-bolder">No Authors Data</h1>
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
                <p>Are you sure you want to delete this author?</p>
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
                    deleteAuthor();
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
                <p>Author deleted successfully.</p>
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

export default ViewAuthors;
