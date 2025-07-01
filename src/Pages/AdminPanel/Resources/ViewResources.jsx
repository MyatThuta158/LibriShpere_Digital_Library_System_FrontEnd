import React, { useEffect, useState } from "react";
import { Spinner, Alert, Modal, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import Pagination from "../../Layouts/Pagination";
import { fetchResource } from "../../../api/resourceApi";

// Helper for advanced filtering
function matchesAdvanced(resource, criteria) {
  const nameMatch =
    !criteria.name ||
    (resource.name &&
      resource.name.toLowerCase().includes(criteria.name.toLowerCase()));

  const isbnMatch =
    !criteria.isbn ||
    (resource.ISBN &&
      resource.ISBN.toLowerCase().includes(criteria.isbn.toLowerCase()));

  const authorMatch =
    !criteria.author ||
    (resource.author &&
      resource.author.name
        .toLowerCase()
        .includes(criteria.author.toLowerCase()));

  const dateMatch =
    !criteria.date ||
    (resource.publish_date &&
      resource.publish_date.substring(0, 10) === criteria.date);

  return nameMatch && isbnMatch && authorMatch && dateMatch;
}

export default function ViewResources() {
  // API data
  const [resources, setResources] = useState([]);
  const [genres, setGenres] = useState([]);
  const [resourceTypes, setResourceTypes] = useState([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Basic search & filters
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [sortOption, setSortOption] = useState("newest");

  // Advanced search modal
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advancedCriteria, setAdvancedCriteria] = useState({
    name: "",
    isbn: "",
    author: "",
    date: "",
  });
  const [appliedAdvanced, setAppliedAdvanced] = useState({
    name: "",
    isbn: "",
    author: "",
    date: "",
  });

  // Base API URL
  const baseUrl = import.meta.env.VITE_API_URL;

  // Fetch API data
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchResource();
        setResources(res.resources || []);
        setGenres(res.genres || []);
        setResourceTypes(res.resourceTypes || []);
        setError("");
      } catch (e) {
        console.error(e);
        setError("Failed to load resources.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Reset all filters
  const resetFilters = () => {
    setAppliedSearch("");
    setSearchQuery("");
    setSelectedGenre("all");
    setSelectedType("all");
    setSortOption("newest");
    setAppliedAdvanced({ name: "", isbn: "", author: "", date: "" });
    setCurrentPage(1);
  };

  // Apply basic search
  const applySearch = () => {
    setAppliedSearch(searchQuery);
    setCurrentPage(1);
  };

  // Advanced handlers
  const handleAdvChange = (e) => {
    const { name, value } = e.target;
    setAdvancedCriteria((prev) => ({ ...prev, [name]: value }));
  };
  const submitAdvanced = (e) => {
    e.preventDefault();
    setAppliedAdvanced(advancedCriteria);
    setShowAdvanced(false);
    setAdvancedCriteria({ name: "", isbn: "", author: "", date: "" });
    setCurrentPage(1);
  };

  // Combine filters
  const filtered = resources.filter((r) => {
    if (
      selectedGenre !== "all" &&
      !r.genre?.some((g) => g.id === Number(selectedGenre))
    )
      return false;
    if (selectedType !== "all" && r.resource_typeId !== Number(selectedType))
      return false;
    if (
      appliedSearch &&
      !r.name?.toLowerCase().includes(appliedSearch.toLowerCase())
    )
      return false;
    if (!matchesAdvanced(r, appliedAdvanced)) return false;
    return true;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortOption === "newest")
      return new Date(b.publish_date) - new Date(a.publish_date);
    if (sortOption === "oldest")
      return new Date(a.publish_date) - new Date(b.publish_date);
    if (sortOption === "title") return a.name.localeCompare(b.name);
    return 0;
  });

  // Pagination
  const pageCount = Math.ceil(sorted.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const current = sorted.slice(start, start + itemsPerPage);

  return (
    <div className="container">
      <h1 className="text-center mb-4">Digital Library Resources</h1>

      {/* Search & Filters */}
      <div className="row mb-3">
        <div className="col-md-4">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn btn-primary" onClick={applySearch}>
              Search
            </button>
            {searchQuery && (
              <button
                className="btn btn-outline-secondary"
                onClick={() => {
                  setSearchQuery("");
                  setAppliedSearch("");
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="all">All Genres</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">All Types</option>
            {resourceTypes.map((rt) => (
              <option key={rt.id} value={rt.id}>
                {rt.TypeName}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Title A–Z</option>
          </select>
        </div>
        <div className="col-md-2 text-end">
          <Button variant="link" onClick={() => setShowAdvanced(true)}>
            Advanced
          </Button>
          <Button variant="secondary" onClick={resetFilters}>
            Reset
          </Button>
        </div>
      </div>

      {/* Advanced Search Modal */}
      <Modal show={showAdvanced} onHide={() => setShowAdvanced(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Advanced Search</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitAdvanced}>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                value={advancedCriteria.name}
                onChange={handleAdvChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>ISBN</Form.Label>
              <Form.Control
                name="isbn"
                value={advancedCriteria.isbn}
                onChange={handleAdvChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Author</Form.Label>
              <Form.Control
                name="author"
                value={advancedCriteria.author}
                onChange={handleAdvChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Publish Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={advancedCriteria.date}
                onChange={handleAdvChange}
              />
            </Form.Group>
            <Button type="submit">Apply</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Resource Cards with design */}
      {loading ? (
        <div className="text-center p-5">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          {current.length ? (
            <div className="row">
              {current.map((r) => (
                <div key={r.id} className="col-sm-6 col-md-4 col-lg-3 mb-4">
                  <div className="card h-100">
                    <img
                      src={`${baseUrl}storage/${r.cover_photo}`}
                      className="card-img-top"
                      style={{ height: "30vh", objectFit: "cover" }}
                      alt={r.name}
                      onError={(e) => {
                        e.target.src = "/placeholder-book.jpg";
                      }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{r.name}</h5>
                      <Link
                        to={`/Admin/DetailResource/${r.id}`}
                        className="btn btn-outline-primary mt-auto"
                      >
                        Details <i className="bi bi-arrow-right ms-2"></i>
                      </Link>
                    </div>
                    <div className="card-footer text-muted small">
                      {resourceTypes.length > 0 &&
                        resourceTypes
                          .find((rt) => rt.id === r.resource_typeId)
                          ?.TypeName.toUpperCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <h4 className="text-center">No resources found</h4>
          )}
          {/* Pagination */}
          <div className="d-flex justify-content-center mt-4">
            <Pagination
              count={pageCount}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}
    </div>
  );
}
