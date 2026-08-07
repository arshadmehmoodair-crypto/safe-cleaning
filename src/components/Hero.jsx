import { Link } from "react-router-dom";
import hero from "../assets/hero.png";

function Hero() {
  return (
    <section
      className="hero"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(${hero})`,
      }}
    >
      <div className="hero-content">
        <span className="hero-tag">
          Trusted Cleaning & Maintenance Solutions
        </span>

        <h1>
          Professional Cleaning Products for Every Environment
        </h1>

        <p>
          AMIRAH STORE LIMITED supplies premium-quality
          cleaning and maintenance products for homes, offices, schools,
          hospitals and commercial businesses across the United Kingdom.
        </p>

        <div className="hero-buttons">
          <Link to="/products">
            <button className="shop">
              Shop Now
            </button>
          </Link>

          <Link to="/contact">
            <button className="contact">
              Contact Us
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;