import "./css/App.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from "./pages/Home";
import MovieDetail from "./components/MovieDetail";
import MovieForm from "./components/MovieForm";
import Login from "./components/Login";
import { Routes, Route } from "react-router-dom";
import { MovieProvider } from "./contexts/MovieContext";
import NavBar from "./components/NavBar";
import PrivateRoute from "./components/PrivateRoute";
import Register from "./components/Register";
import Footer from "./components/Footer";

function App() {
  return (
    <MovieProvider>
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/create"
            element={
              <PrivateRoute>
                <MovieForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <PrivateRoute>
                <MovieForm />
              </PrivateRoute>
            }
          />
        </Routes>
        <Footer />
      </main>
    </MovieProvider>
  );
}

export default App;
