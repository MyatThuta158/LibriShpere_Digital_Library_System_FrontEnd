import React, { useEffect, useRef, useState } from "react";
import Resumable from "resumablejs";
import { getAuthors } from "../../../api/authorsApi";
import { getGenres } from "../../../api/genresAPI";
import { getType } from "../../../api/resourcetypeApi";
import { useForm, Controller } from "react-hook-form";
import { createResource } from "../../../api/resourceApi";

function AddResources() {
  // State declarations
  const [author, setAuthor] = useState([]);
  const [genre, setGenre] = useState([]);
  const [resourceTypes, setResourceTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [searchAuthor, setSearchAuthor] = useState("");
  const [filterAuthor, setFilterAuthor] = useState([]);
  const [status, setStatus] = useState(false);
  const [selectValue, setSelectValue] = useState({});
  const [flag, setFlag] = useState(false);
  const [authorname, setAuthorname] = useState("");
  const [genreSelectvalue, setGenreSelectvalue] = useState([]);
  const [input, setInput] = useState("");
  const [genreFlag, setGenreflag] = useState(false);
  const [available, setAvailable] = useState(false);
  const [genreValue, setGenrevalue] = useState([]);
  const [img, setImg] = useState();
  const [uploadedFilePath, setUploadedFilePath] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [chunkedFileName, setChunkedFileName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const fileInput = useRef(null);
  const fileChunkRef = useRef(null);
  const token = localStorage.getItem("token");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
    reset,
    resetField,
    setError,
    clearErrors,
  } = useForm();

  // Resumable.js setup
  useEffect(() => {
    const r = new Resumable({
      target: "http://127.0.0.1:8000/upload-chunk",
      chunkSize: 1 * 1024 * 1024,
      simultaneousUploads: 3,
      query: { token },
      headers: { Authorization: `Bearer ${token}` },
      testChunks: false,
      throttleProgressCallbacks: 1,
    });
    fileChunkRef.current = r;
    const fileElem = document.getElementById("resumable-file-input");
    if (fileElem) r.assignBrowse(fileElem);

    r.on("fileAdded", (file) => {
      // <-- grab the filename here
      setChunkedFileName(file.fileName);
      r.upload();
    });

    r.on("fileProgress", (file) =>
      setUploadProgress(Math.floor(file.progress() * 100))
    );
    r.on("fileSuccess", (file, message) => {
      try {
        const res = JSON.parse(message);
        setUploadedFilePath(res.filePath);
        clearErrors("file");
      } catch (err) {
        console.error(err);
      }
    });
  }, [token]);

  // Fetch initial data
  useEffect(() => {
    (async () => {
      setAuthor((await getAuthors()).data);
      setGenre((await getGenres()).data);
      setResourceTypes((await getType()).data);
    })();
  }, []);

  // Author search effect
  useEffect(() => {
    if (searchAuthor) {
      const filteredData = author.filter((a) =>
        a.name.toLowerCase().includes(searchAuthor.toLowerCase())
      );
      if (filteredData.length > 0) {
        setFilterAuthor(filteredData);
        setStatus(true);
        setFlag(false);
      } else setFlag(true);
    } else {
      setFilterAuthor([]);
      setStatus(false);
      setFlag(false);
    }
  }, [searchAuthor, author]);

  // Add this effect to sync uploadedFilePath with form's "file" field
  useEffect(() => {
    setValue("file", uploadedFilePath);
    if (uploadedFilePath) clearErrors("file");
  }, [uploadedFilePath, setValue, clearErrors]);
  // Author selection handler
  const handleSelectAuthor = (a) => {
    setSelectValue(a);
    setAuthorname(a.name);
    setStatus(false);
    clearErrors("author");
  };

  // Genre selection handler
  const handleSelectGenre = (g) => {
    setGenreSelectvalue((prev) => (prev.includes(g) ? prev : [...prev, g]));
    setInput("");
    setGenreflag(false);
    setGenrevalue([]);
    clearErrors("genre");
  };

  // Genre filtering
  const filterGenre = (q) => {
    if (q) {
      const fd = genre.filter((g) =>
        g.name.toLowerCase().includes(q.toLowerCase())
      );
      if (fd.length > 0) {
        setGenrevalue(fd);
        setGenreflag(true);
        setAvailable(false);
      } else {
        setGenreflag(false);
        setAvailable(true);
      }
    } else {
      setGenrevalue([]);
      setGenreflag(false);
      setAvailable(false);
    }
  };

  // Remove genre
  const elimateGenre = (g) => () => {
    setGenreSelectvalue((prev) => prev.filter((x) => x !== g));
    if (genreSelectvalue.length === 1) {
      setError("genre", {
        type: "manual",
        message: "Please select at least one genre",
      });
    }
  };

  // Form submission
  const onSubmit = async (data) => {
    // console.log("gernvalue", genreSelectvalue.length);
    let isValid = true;
    if (uploadProgress > 0) {
      clearErrors("file");
    }

    if (!data.file) {
      setError("file", {
        type: "manual",
        message: "File upload is required",
      });
      return;
    }
    // Validate author
    if (!selectValue.id) {
      setError("author", {
        type: "manual",
        message: "Please select an author",
      });
      isValid = false;
    }

    console.log("gernvalue", genreSelectvalue.length);

    // Validate genre
    if (genreSelectvalue.length < 0) {
      setError("genre", {
        type: "manual",
        message: "Please select at least one genre",
      });
      isValid = false;
    }

    if (!isValid) return;

    if (!uploadedFilePath) {
      alert("Please wait until the file upload completes.");
      return;
    }

    const formData = new FormData();
    formData.append("code", data.code);
    formData.append("name", data.name);
    formData.append("date", data.date);
    formData.append("Description", data.desc);
    formData.append("author", selectValue.id);
    formData.append("genre", JSON.stringify(genreSelectvalue.map((g) => g.id)));
    formData.append("Photo", data.Photo[0]);
    formData.append("file", uploadedFilePath);
    formData.append("ISBN", data.ISBN ?? "");
    formData.append("resourceType", selectedType);

    try {
      const result = await createResource(formData);
      if (result.status === 200) setShowModal(true);
    } catch (e) {
      console.log(e);
    }
  };

  // Modal close handler
  const handleCloseModal = () => {
    setShowModal(false);
    reset();
    setUploadProgress(0);
    setAuthorname("");
    setGenreSelectvalue([]);
    setSelectValue({});
    setImg("");
    setChunkedFileName("");
    setUploadedFilePath("");
    setSelectedType("");
    clearErrors();
  };
  return (
    <div>
      <div className="container-fluid">
        <h1 className="text-center">Add Resources</h1>
        <div className="row">
          <form
            className="col-md-12"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Code & Name */}
            <div className="d-flex justify-content-center">
              <div className="form-group col-md-6">
                <label>Code</label>
                <input
                  type="text"
                  {...register("code", { required: "Code is required" })}
                  className={`form-control ${errors.code ? "is-invalid" : ""}`}
                />
                {errors.code && (
                  <div className="invalid-feedback">{errors.code.message}</div>
                )}
              </div>
              <div className="form-group col-md-6">
                <label>Name</label>
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                />
                {errors.name && (
                  <div className="invalid-feedback">{errors.name.message}</div>
                )}
              </div>
            </div>

            {/* Publish Date, Resource Type & File Upload */}
            <div className="d-flex justify-content-center">
              <div className="form-group col-md-4">
                <label>Publish Date</label>
                <input
                  type="date"
                  {...register("date", {
                    required: "Publish date is required",
                  })}
                  className={`form-control ${errors.date ? "is-invalid" : ""}`}
                />
                {errors.date && (
                  <div className="invalid-feedback">{errors.date.message}</div>
                )}
              </div>
              <div className="form-group col-md-4">
                <label>Resource Type</label>
                <Controller
                  name="resourceType"
                  control={control}
                  rules={{ required: "Resource type is required" }}
                  render={({ field, fieldState }) => (
                    <>
                      <select
                        {...field}
                        className={`form-control ${
                          fieldState.error ? "is-invalid" : ""
                        }`}
                        value={field.value || ""} // keep it controlled
                        onChange={(e) => {
                          field.onChange(e); // tell RHF
                          setSelectedType(e.target.value); // optional local state
                        }}
                      >
                        <option value="">Select Resource Type</option>
                        {resourceTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.TypeName}
                          </option>
                        ))}
                      </select>
                      {fieldState.error && (
                        <div className="invalid-feedback">
                          {fieldState.error.message}
                        </div>
                      )}
                    </>
                  )}
                />
              </div>
              <Controller
                name="file"
                control={control}
                rules={{
                  required: "Please upload a file before submitting",
                  validate: (value) =>
                    value !== "" ||
                    "Please wait for the upload to finish before submitting",
                }}
                render={({ fieldState }) => (
                  <>
                    {fieldState.error && (
                      <div className="invalid-feedback d-block">
                        {fieldState.error.message}
                      </div>
                    )}
                  </>
                )}
              />

              {/* File Upload Section - Updated */}
              <div className="form-group col-md-4">
                <label>File (Chunked Upload)</label>
                <div className="input-group">
                  <input
                    type="text"
                    className={`form-control ${
                      errors.file ? "is-invalid" : ""
                    }`}
                    placeholder="Select file..."
                    value={chunkedFileName}
                    readOnly
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() =>
                      document.getElementById("resumable-file-input").click()
                    }
                  >
                    Browse
                  </button>
                  <input
                    type="file"
                    id="resumable-file-input"
                    className="d-none"
                  />
                </div>

                {/* Progress and Error Display */}
                {uploadProgress > 0 && (
                  <div className="mt-2">Upload Progress: {uploadProgress}%</div>
                )}
                {/* {errors.file && (
                  <div className="text-danger small mt-1">
                    {errors.file.message}
                  </div>
                )} */}
              </div>
            </div>

            {/* Author & Genre Selection */}
            <div className="d-flex justify-content-center">
              <div
                className="form-group col-md-6"
                style={{ position: "relative" }}
              >
                <label htmlFor="authorInput">Author</label>
                <Controller
                  name="author"
                  control={control}
                  rules={{ required: "Please select an author" }}
                  render={({ field, fieldState }) => (
                    <>
                      <input
                        {...field}
                        id="authorInput"
                        className={`form-control ${
                          fieldState.error ? "is-invalid" : ""
                        }`}
                        value={authorname}
                        onChange={(e) => {
                          field.onChange(e);
                          setSearchAuthor(e.target.value);
                          setAuthorname(e.target.value);
                          if (!e.target.value) clearErrors("author");
                        }}
                      />
                      {fieldState.error && (
                        <div className="invalid-feedback d-block">
                          {fieldState.error.message}
                        </div>
                      )}
                    </>
                  )}
                />

                {authorname && (
                  <span
                    className="position-absolute end-0 top-50 translate-middle-y me-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setSearchAuthor("");
                      setSelectValue({});
                      setAuthorname("");
                      clearErrors("author");
                    }}
                  >
                    ×
                  </span>
                )}
                {status && filterAuthor.length > 0 && (
                  <ul className="list-group position-absolute w-100 z-3">
                    {filterAuthor.map((author) => (
                      <li
                        key={author.id}
                        className="list-group-item list-group-item-action"
                        onClick={() => handleSelectAuthor(author)}
                        style={{ cursor: "pointer" }}
                      >
                        {author.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <input
                type="hidden"
                {...register("genre", {
                  validate: () =>
                    genreSelectvalue.length > 0 ||
                    "Please select at least one genre",
                })}
              />

              <div
                className="form-group col-md-6"
                style={{ position: "relative" }}
              >
                <label htmlFor="genreInput">Genre</label>
                <div className="input-group flex-wrap has-validation">
                  <input
                    type="text"
                    id="genreInput"
                    className={`form-control ${
                      errors.genre ? "is-invalid" : ""
                    }`}
                    value={input}
                    onChange={(e) => {
                      filterGenre(e.target.value);
                      setInput(e.target.value);
                      clearErrors("genre"); // clear any previous error as soon as they type
                    }}
                    onBlur={() => setTimeout(() => setGenreflag(false), 200)}
                  />
                  {errors.genre && (
                    <div className="invalid-feedback d-block">
                      {errors.genre.message}
                    </div>
                  )}
                </div>

                {genreFlag && genreValue.length > 0 && (
                  <ul className="list-group position-absolute w-100 z-3">
                    {genreValue.map((genreItem) => (
                      <li
                        key={genreItem.id}
                        className="list-group-item list-group-item-action d-flex justify-content-between"
                        onClick={() => handleSelectGenre(genreItem)}
                        style={{ cursor: "pointer" }}
                      >
                        {genreItem.name}
                        <button className="btn btn-sm btn-primary">Add</button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="d-flex flex-wrap gap-1 mt-2">
                  {genreSelectvalue.map((genreItem) => (
                    <span
                      key={genreItem.id}
                      className="badge bg-primary d-flex align-items-center gap-1"
                    >
                      {genreItem.name}
                      <button
                        type="button"
                        className="btn btn-sm p-0 text-white"
                        onClick={() => {
                          setGenreSelectvalue((prev) =>
                            prev.filter((x) => x !== genreItem)
                          );
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Cover Photo & ISBN */}
            <div className="d-flex justify-content-center">
              {/* Cover Photo Input */}
              <div className="form-group col-md-6">
                <label>Cover Photo</label>
                <Controller
                  name="Photo"
                  control={control}
                  rules={{ required: "Cover photo is required" }}
                  render={({ field, fieldState }) => (
                    <div>
                      <input
                        type="file"
                        className={`form-control ${
                          fieldState.error ? "is-invalid" : ""
                        }`}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          field.onChange(e.target.files);
                          setImg(file ? URL.createObjectURL(file) : null);
                          clearErrors("Photo");
                        }}
                      />
                      {fieldState.error && (
                        <div className="invalid-feedback">
                          {fieldState.error.message}
                        </div>
                      )}
                    </div>
                  )}
                />
                {img && (
                  <>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm mt-2"
                      onClick={() => {
                        setImg(null);
                        resetField("Photo"); // Reset the form field
                      }}
                    >
                      Remove Image
                    </button>
                    <img
                      src={img}
                      className="img-thumbnail mt-2"
                      style={{ height: "200px" }}
                    />
                  </>
                )}
              </div>
              <div className="form-group col-md-6">
                <label>ISBN</label>
                <input
                  type="text"
                  {...register("ISBN", { required: "ISBN is required" })}
                  className={`form-control ${errors.ISBN ? "is-invalid" : ""}`}
                />
                {errors.ISBN && (
                  <div className="invalid-feedback">{errors.ISBN.message}</div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label>Description</label>
              <textarea
                {...register("desc", { required: "Description is required" })}
                className={`form-control ${errors.desc ? "is-invalid" : ""}`}
                style={{ height: "30vh" }}
              />
              {errors.desc && (
                <div className="invalid-feedback">{errors.desc.message}</div>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-3">
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Submission Successful</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <p>Your resource has been submitted successfully.</p>
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
      )}
    </div>
  );
}

export default AddResources;
