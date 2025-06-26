import MovieCard from "../components/MovieCard";
import { useState, useEffect } from "react";
import { getAllMovies } from "../services/api";
import "../css/Home.css";
import SearchOverlay from "../components/SearchOverlay";
import { CATEGORY_CHOICES } from "../constants/categories";

const MOVIES_PER_PAGE = 14;

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [movies, setMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadPopularMovies = async () => {
      try {
        const popularMovies = await getAllMovies();
        const uniqueCategories = [
          ...new Set(popularMovies.map((m) => m.category || "Uncategorized")),
        ];
        setCategories(["All", ...uniqueCategories]);
        setAllMovies(popularMovies);
        setMovies(popularMovies);
      } catch (err) {
        setError("Failed to load movies...");
      } finally {
        setLoading(false);
      }
    };
    loadPopularMovies();
  }, []);

  // Filter movies by search and category
  useEffect(() => {
    let filtered = allMovies;
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (m) => (m.category || "Uncategorized") === selectedCategory
      );
    }
    if (searchQuery.trim() !== "") {
      const trimmed = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.title.toLowerCase().includes(trimmed) ||
          m.description.toLowerCase().includes(trimmed)
      );
    }
    setMovies(filtered);
    setCurrentPage(1); // Reset to first page on filter/search change
  }, [searchQuery, selectedCategory, allMovies]);

  // Pagination logic
  const totalPages = Math.ceil(movies.length / MOVIES_PER_PAGE);
  const paginatedMovies = movies.slice(
    (currentPage - 1) * MOVIES_PER_PAGE,
    currentPage * MOVIES_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <div className="home">
      <div className="search-overlay-wrapper">
        <SearchOverlay movie={paginatedMovies[0]} />
        <form onSubmit={handleSearch} className="search-form d-flex gap-2">
          <input
            type="text"
            placeholder="Search for movies..."
            className="search-input"
            value={searchQuery}
            onChange={handleInputChange}
          />
          <select
            className="form-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
            style={{ maxWidth: 140 }}
          >
            <option value="All">All</option>
            {CATEGORY_CHOICES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          <button type="submit" className="search-button" style={{ width: 140 }}>
            Search
          </button>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Loading movies...</p>
        </div>
      ) : (
        <>
          <div className="movies-grid">
            {paginatedMovies.map((movie) => (
              <MovieCard movie={movie} key={movie.id} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="pagination d-flex justify-content-center mt-4 py-4">
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx + 1}
                  className={`btn btn-sm mx-1 ${currentPage === idx + 1 ? "btn-danger" : "btn-outline-danger"}`}
                  onClick={() => handlePageChange(idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Home;