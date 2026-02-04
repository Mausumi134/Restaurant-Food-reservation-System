import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const HeroSection = () => {
  return (
    <section className="heroSection" id="heroSection">
      <Navbar />
      <div className="heroContent">
        <h1>Welcome to Our Restaurant FOODLICKS</h1>
        <p>Discover exquisite flavors from around the world.</p>
        <div className="hero-buttons">
          <Link to="/menuitems" className="btn btn-primary btn-lg me-3">
            Start Ordering
          </Link>
          <a href="#reservation" className="btn btn-outline-light btn-lg">
            Make Reservation
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
