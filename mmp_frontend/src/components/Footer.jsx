import React from "react";
import {
  FaLinkedin,
  FaEnvelope,
  FaFacebookF,
  FaTwitter,
  FaGoogle,
  FaInstagram,
  FaGithub,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="text-center bg-dark mt-auto">
      <div className="container pt-2 bg-dark">
        {/* Section: Social media */}
        <section className="mb-4">
          <a href="#!" className="btn btn-link btn-floating btn-lg text-light m-1">
            <FaFacebookF />
          </a>

          <a href="#!" className="btn btn-link btn-floating btn-lg text-light m-1">
            <FaTwitter />
          </a>

          <a href="#!" className="btn btn-link btn-floating btn-lg text-light m-1">
            <FaGoogle />
          </a>

          <a href="#!" className="btn btn-link btn-floating btn-lg text-light m-1">
            <FaInstagram />
          </a>

          <a
            href="https://www.linkedin.com/in/manntala/"
            className="btn btn-link btn-floating btn-lg text-light m-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin />
          </a>

          <a
            href="mailto:manny.talaroc@gmail.com"
            className="btn btn-link btn-floating btn-lg text-light m-1"
          >
            <FaEnvelope />
          </a>

          <a href="https://github.com/manntala" className="btn btn-link btn-floating btn-lg text-light m-1">
            <FaGithub />
          </a>
        </section>
      </div>

      {/* Copyright */}
      <div className="text-center p-3 bg-dark text-light">
        © {new Date().getFullYear()} by{" "}
        <a
          className="text-light"
          href="https://www.linkedin.com/in/manntala/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Manny Talaroc
        </a>
      </div>
    </footer>
  );
}
