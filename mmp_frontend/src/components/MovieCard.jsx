import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/MovieCard.css";

function toTitleCase(str) {
  return str
    ?.toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
  });
}

function MovieCard({ movie }) {
  const posterUrl = movie.thumbnail_url || "/default-thumbnail.jpg";
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movies/${movie.id}`);
  };

  return (
    <div className="movie-card" onClick={handleClick} style={{ cursor: "pointer" }}>
      <div className="movie-poster">
        <img src={posterUrl} alt={movie.title || "Movie Poster"} />
        <div className="movie-overlay">
          <div className="movie-info">
            <h3>{toTitleCase(movie.title)}</h3>
            <h4 className="text-light">({formatDate(movie.date_added)})</h4>
            <p>{movie.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
