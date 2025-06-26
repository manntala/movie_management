import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

export default function MovieList() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    API.get("/movies/").then((res) => setMovies(res.data)).catch(console.error);
  }, []);

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold">🎬 Movie Library</h2>
        <Link to="/create" className="btn btn-primary">+ Add Movie</Link>
      </div>

      <div className="row">
        {movies.map((movie) => (
          <div key={movie.id} className="col-md-4 mb-4">
            <div className="card h-100 p-3">
              <h5 className="text-dark">{movie.title}</h5>
              <p className="text-muted">
                <small>Added: {new Date(movie.date_added).toLocaleDateString()}</small>
              </p>
              <Link to={`/movies/${movie.id}`} className="btn btn-outline-primary mt-auto">View Details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
