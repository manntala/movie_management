import "../css/SearchOverlay.css";

function SearchOverlay({ movie }) {
  if (!movie) return null;

  return (
    <div className="search-overlay">
      <div className="overlay-bg" style={{ backgroundImage: `url(${movie.thumbnail_url})` }}></div>
      <div className="overlay-content">
        <h2 className="overlay-title text-capitalize">{movie.title}</h2>
        <p className="overlay-year">({new Date(movie.date_added).getFullYear()})</p>
      </div>
    </div>
  );
}

export default SearchOverlay;
