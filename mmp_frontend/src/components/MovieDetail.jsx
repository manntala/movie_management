import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { Modal, Button, Spinner } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import "../css/MovieDetail.css";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

async function fetchMovieThumbnail(title) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(title)}&api_key=${TMDB_API_KEY}`
    );
    const data = await res.json();
    const movie = data.results?.[0];
    return movie?.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "/default-thumbnail.jpg";
  } catch (err) {
    console.error("TMDb fetch error:", err);
    return "/default-thumbnail.jpg";
  }
}

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    API.get(`/movies/${id}/`)
      .then(async (res) => {
        const data = res.data;
        if (!data.thumbnail_url) {
          const fallback = await fetchMovieThumbnail(data.title);
          data.thumbnail_url = fallback;
        }
        setMovie(data);
      })
      .catch(console.error);
  }, [id]);

  const confirmDelete = () => {
    if (!user) return;
    setIsDeleting(true);
    API.delete(`/movies/${id}/`)
      .then(() => navigate("/"))
      .catch(() => setIsDeleting(false));
  };

  if (!movie) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="movie-detail-page">
      <div
        className="movie-blurred-background"
        style={{ backgroundImage: `url(${movie.thumbnail_url})` }}
      ></div>

      <div className="container py-5 position-relative" style={{ zIndex: 2 }}>
        <div className="row g-4 bg-white bg-opacity-75 rounded shadow p-4 mx-auto movie-card-container">
          <div className="col-md-4 text-center">
            <img
              src={movie.thumbnail_url}
              alt="Thumbnail"
              className="img-fluid rounded shadow"
            />
          </div>

          <div className="col-md-8 d-flex flex-column justify-content-between">
            <div>
              <h2 className="fw-bold text-dark text-capitalize">{movie.title}</h2>
              <p className="mb-2">
                <strong>Description:</strong> {movie.description}
              </p>
              <p className="mb-0">
                <strong>Uploaded:</strong>{" "}
                {new Date(movie.date_added).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {user && (
              <div className="d-flex justify-content-end mt-4">
                <Link to={`/edit/${movie.id}`} className="btn btn-light me-3">
                  Edit
                </Link>
                <Button variant="secondary" onClick={() => setShowConfirm(true)}>
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 mx-auto movie-card-container">
          <video width="100%" height="auto" controls className="rounded shadow w-100">
            <source src={movie.video_file} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{movie.title}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              "Yes, Delete"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
