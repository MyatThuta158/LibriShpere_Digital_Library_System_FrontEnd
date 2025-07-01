import React, { useEffect, useState } from "react";
import { Spinner, Alert, Modal, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { fetchResource } from "../../api/resourceApi";

// A helper function that checks advanced criteria against a resource.
// For ISBN and Author, if the property does not exist, the criterion is ignored.
function matchesAdvanced(resource, criteria) {
  // Resource Name: require a partial, case-insensitive match.
  const resourceNameMatch =
    criteria.resourceName.trim() === "" ||
    (resource.name &&
      resource.name
        .toLowerCase()
        .includes(criteria.resourceName.toLowerCase()));

  // ISBN: if criteria is provided and the resource has an ISBN, match on it.
  // Otherwise, if resource.ISBN is undefined, ignore this criterion.
  const isbnMatch =
    criteria.isbn.trim() === "" ||
    (resource.hasOwnProperty("ISBN")
      ? resource.ISBN &&
        resource.ISBN.toLowerCase().includes(criteria.isbn.toLowerCase())
      : true);

  // Author: if criteria is provided and the resource has an author, match on author.name.
  // Otherwise, ignore.
  const authorMatch =
    criteria.author.trim() === "" ||
    (resource.author && resource.author.name
      ? resource.author.name
          .toLowerCase()
          .includes(criteria.author.toLowerCase())
      : true);

  // Publish Date: compare YYYY-MM-DD (assuming resource.publish_date may contain extra time info)
  const dateMatch =
    criteria.date.trim() === "" ||
    (resource.publish_date &&
      resource.publish_date.substring(0, 10) === criteria.date);

  return resourceNameMatch && isbnMatch && authorMatch && dateMatch;
}

function ResourceDisplay() {
  // API data state
  const [resources, setResources] = useState([]);
  const [genres, setGenres] = useState([]);
  const [resourceTypes, setResourceTypes] = useState([]);

  // Basic search and sort states
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedResourceType, setSelectedResourceType] = useState("all");
  const [sortOption, setSortOption] = useState("newest");

  // Advanced search states:
  // - advancedCriteria holds the current modal input values.
  // - appliedAdvancedCriteria is used when filtering.
  const [advancedCriteria, setAdvancedCriteria] = useState({
    resourceName: "",
    isbn: "",
    author: "",
    date: "",
  });
  const [appliedAdvancedCriteria, setAppliedAdvancedCriteria] = useState({
    resourceName: "",
    isbn: "",
    author: "",
    date: "",
  });
  const [showAdvancedModal, setShowAdvancedModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const baseUrl = import.meta.env.VITE_API_URL;

  // Fetch data from API on mount
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await fetchResource();
      setResources(result.resources || []);
      setGenres(result.genres || []);
      setResourceTypes(result.resourceTypes || []);
      setError("");
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Reset all filters to their default state
  const resetFilters = () => {
    setSelectedGenre("all");
    setSelectedResourceType("all");
    setSortOption("newest");
    setAdvancedCriteria({ resourceName: "", isbn: "", author: "", date: "" });
    setAppliedAdvancedCriteria({
      resourceName: "",
      isbn: "",
      author: "",
      date: "",
    });
    setAppliedSearch("");
    setSearchQuery("");
  };

  // Filter resources using basic filters and then the advanced criteria.
  // Note that basic search filters by resource.name.
  const filteredResources = resources.filter((resource) => {
    // Filter by genre if a genre is selected.
    if (selectedGenre !== "all") {
      const genreIds = resource.genre.map((g) => g.id);
      if (!genreIds.includes(Number(selectedGenre))) return false;
    }
    // Filter by resource type (here we use resource_typeId since our resource object uses that).
    if (selectedResourceType !== "all") {
      if (resource.resource_typeId !== Number(selectedResourceType))
        return false;
    }
    // Basic search (by resource name).
    if (
      appliedSearch.trim() !== "" &&
      !(
        resource.name &&
        resource.name.toLowerCase().includes(appliedSearch.toLowerCase())
      )
    ) {
      return false;
    }
    // Advanced search using our helper function.
    if (!matchesAdvanced(resource, appliedAdvancedCriteria)) {
      return false;
    }
    return true;
  });

  // Sort the filtered resources.
  const sortedResources = [...filteredResources].sort((a, b) => {
    if (sortOption === "newest") {
      return new Date(b.publish_date) - new Date(a.publish_date);
    }
    if (sortOption === "oldest") {
      return new Date(a.publish_date) - new Date(b.publish_date);
    }
    if (sortOption === "title") {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  // Basic search handler – update the applied search without clearing the visible input.
  const handleBasicSearch = () => {
    setAppliedSearch(searchQuery);
  };

  // Advanced search input change handler.
  const handleAdvancedSearchChange = (e) => {
    const { name, value } = e.target;
    setAdvancedCriteria((prev) => ({ ...prev, [name]: value }));
  };

  // Advanced search submit: update appliedAdvancedCriteria and close the modal.
  const handleAdvancedSearchSubmit = (e) => {
    e.preventDefault();
    setAppliedAdvancedCriteria({ ...advancedCriteria });
    setShowAdvancedModal(false);
    // Optionally clear the modal inputs:
    setAdvancedCriteria({ resourceName: "", isbn: "", author: "", date: "" });
  };

  return (
    <>
      {/* Banner Section with Background Image */}
      <section
        style={{
          backgroundImage: 'url("/Customer/Resource.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          height: "300px",
          color: "white",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
          }}
        >
          <div className="container h-100 d-flex flex-column justify-content-center align-items-center">
            <h1 className="mb-2 text-white">Digital Library Resources</h1>
            <p className="mb-4">Explore our collection of digital materials</p>
            {/* Search bar and selection options */}
            <div className="w-100" style={{ maxWidth: "600px" }}>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleBasicSearch}
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
                </button>
                {/* Clear button for basic search */}
                {searchQuery && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setAppliedSearch("");
                    }}
                  >
                    X
                  </button>
                )}
              </div>
              <div className="row mb-2">
                <div className="col">
                  <select
                    className="form-select"
                    value={selectedResourceType}
                    onChange={(e) => setSelectedResourceType(e.target.value)}
                  >
                    <option value="all">All Resource Types</option>
                    {resourceTypes.map((rt) => (
                      <option key={rt.id} value={rt.id}>
                        {rt.TypeName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col">
                  <select
                    className="form-select"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="title">Title A-Z</option>
                  </select>
                </div>
              </div>
              {/* Advanced Search Modal Trigger */}
              <div className="text-end mb-2">
                <Button
                  variant="link"
                  onClick={() => setShowAdvancedModal(true)}
                >
                  Advanced Search
                </Button>
              </div>
              {/* Reset Filters Button */}
              <div className="text-center ">
                <Button variant="primary" onClick={resetFilters}>
                  Show All Resources
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Search Modal */}
      <Modal
        show={showAdvancedModal}
        onHide={() => setShowAdvancedModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Advanced Search</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAdvancedSearchSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Resource Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter resource name"
                name="resourceName"
                value={advancedCriteria.resourceName}
                onChange={handleAdvancedSearchChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>ISBN</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter ISBN"
                name="isbn"
                value={advancedCriteria.isbn}
                onChange={handleAdvancedSearchChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Author Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter author name"
                name="author"
                value={advancedCriteria.author}
                onChange={handleAdvancedSearchChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Publish Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={advancedCriteria.date}
                onChange={handleAdvancedSearchChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Search
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Main Content: Resource Listing */}
      <div className="container my-4">
        <div className="row">
          {/* Genre Sidebar */}
          <div className="col-md-3 mb-4">
            <h5>Genres</h5>
            <button
              className={`btn ${
                selectedGenre === "all" ? "btn-primary" : "btn-outline-primary"
              } mb-2 w-100`}
              onClick={() => setSelectedGenre("all")}
            >
              Show All
            </button>
            {genres.map((genre) => (
              <button
                key={genre.id}
                className={`btn ${
                  selectedGenre === String(genre.id)
                    ? "btn-primary"
                    : "btn-outline-primary"
                } mb-2 w-100`}
                onClick={() => setSelectedGenre(String(genre.id))}
              >
                {genre.name}
              </button>
            ))}
          </div>

          {/* Resource Cards */}
          <div className="col-md-9">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : error ? (
              <Alert variant="danger">{error}</Alert>
            ) : sortedResources.length > 0 ? (
              <div className="row">
                {sortedResources.map((resource) => (
                  <div
                    key={resource.id}
                    className="col-sm-6 col-md-4 col-lg-3 mb-4"
                  >
                    <div className="card h-100">
                      <img
                        src={`${baseUrl}storage/${resource.cover_photo}`}
                        className="card-img-top"
                        style={{ height: "30vh", objectFit: "cover" }}
                        alt={resource.name}
                        onError={(e) => {
                          e.target.src = "/placeholder-book.jpg";
                        }}
                      />
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{resource.name}</h5>
                        <Link
                          to={`/library/resource/${resource.id}`}
                          className="btn btn-outline-primary mt-auto"
                        >
                          Details <i className="bi bi-arrow-right ms-2"></i>
                        </Link>
                      </div>
                      <div className="card-footer text-muted small">
                        {resourceTypes.length &&
                          resourceTypes
                            .find((rt) => rt.id === resource.resource_typeId)
                            ?.TypeName?.toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <h4>No resources found</h4>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ResourceDisplay;
