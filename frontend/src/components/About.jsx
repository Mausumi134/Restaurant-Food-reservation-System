import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineArrowRight } from "react-icons/hi";

const About = () => {
  return (
    <>
      <section className="about" id="about">
        <div className="container">
          <div className="banner">
            <div className="top">
              <h1 className="heading">ABOUT US</h1>
              <p>The only thing we're serious about is food.</p>
            </div>
            <p className="mid">
            Foodlicks isn't just a dining spot; 
            it's a haven where flavors dance and memories are made. 
            Each dish is a masterpiece, meticulously crafted to delight the senses and ignite the palate. 
            Here, in our cozy space, strangers become friends over shared meals, and every visit leaves a lasting impression. 
            Join us at Foodlicks, where every bite tells a story of passion and culinary excellence.
            </p>
            <Link to={"/menuitems"}>
              Explore Menu{" "}
              <span>
                <HiOutlineArrowRight />
              </span>
            </Link>
          </div>
          <div className="banner">
            <img src="about.png" alt="about" />
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
