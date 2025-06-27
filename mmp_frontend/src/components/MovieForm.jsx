import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import "../css/MovieForm.css";
import { CATEGORY_CHOICES } from "../constants/categories";

export default function MovieForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: "",
    description: "",
    video_file: null,
    thumbnail_url: "",
    category: "",
  });
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isEdit) {
      API.get(`/movies/${id}/`).then((res) => {
        setForm({ ...res.data, video_file: null });
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value && key !== "thumbnail_url") {
        data.append(key, value);
      }
    });

    setUploading(true);
    setProgress(0);

    const config = {
      onUploadProgress: (e) => {
        if (e.total) {
          const percent = Math.round((e.loaded * 100) / e.total);
          setProgress(percent);
        }
      },
    };

    const request = isEdit
      ? API.patch(`/movies/${id}/`, data, config)
      : API.post("/movies/", data, config);

    request
      .then(() => {
        setProgress(100);
        setTimeout(() => {
          setUploading(false);
          navigate("/"); // ✅ Redirect to home after success
        }, 1000);
      })
      .catch(() => {
        setUploading(false);
        alert("An error occurred during upload. Please try again.");
      });
  };

  const handleCancel = () => navigate("/");

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark px-3 form-page-wrapper">
      <div className="bg-white p-4 p-md-5 rounded shadow w-100" style={{ maxWidth: "960px" }}>
        <h2 className="fw-bold text-dark text-center mb-4">
          {isEdit ? "Edit Movie" : "Uploading your movie"}
        </h2>

        {uploading ? (
          <div className="text-center py-5">
            <div className="mb-3">Uploading... {progress}%</div>
            <div className="progress" style={{ height: "30px" }}>
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                role="progressbar"
                style={{ width: `${progress}%`, fontWeight: "bold", fontSize: "1.2rem" }}
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {progress}%
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                name="title"
                className="form-control"
                value={form.title}
                onChange={handleChange}
                required={!isEdit}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-control"
                rows="4"
                value={form.description}
                onChange={handleChange}
                required={!isEdit}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Category</label>
              <select
                name="category"
                className="form-control"
                value={form.category || ""}
                onChange={handleChange}
                required={!isEdit}
              >
                <option value="">Select a category</option>
                {CATEGORY_CHOICES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4 py-4">
              <label className="form-label">Video File</label>
              <input
                name="video_file"
                className="form-control"
                type="file"
                accept="video/*"
                onChange={handleChange}
              />
            </div>

            <div className="d-flex justify-content-between">
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-secondary btn-sm w-40"
              >
                Cancel
              </button>

              <button type="submit" className="btn search-button btn-sm px-4 p-3 w-40">
                {isEdit ? "Update" : "Add"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}