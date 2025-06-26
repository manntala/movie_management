const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY; // Store in .env

export async function fetchMovieThumbnail(title) {
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
