import React from "react";
import Navbar from "./Navbar";

const HeroSection = () => {
  return (
    <section className="heroSection" id="heroSection">
      <Navbar />
      <div className="heroContent">
      <h1>Welcome to Our Restaurant FOODLICKS</h1>
        <p>Discover exquisite flavors from around the world.</p>
      </div>
      
    </section>
  );
};

export default HeroSection;
