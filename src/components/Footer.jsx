import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Company */}

        <div className="footer-section">
          <h2>AMIRAH AMIRAH STORE LIMITED</h2>

          <p>
            We supply high-quality cleaning products for homes,
            offices and commercial businesses across the United Kingdom.
          </p>
        </div>

        {/* Quick Links */}

        <div className="footer-section">

          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>

        </div>

        {/* Policies */}

        <div className="footer-section">

          <h3>Customer Information</h3>

          <Link to="/privacy-policy">
            Privacy Policy
          </Link>

          <Link to="/terms">
            Terms & Conditions
          </Link>

          <Link to="/shipping-policy">
            Shipping Policy
          </Link>

          <Link to="/returns-policy">
            Returns Policy
          </Link>

        </div>

        {/* Contact */}

        <div className="footer-section">

          <h3>Contact Us</h3>

          <p>
            📍 115 Wantage Road,
            <br />
            Reading,
            <br />
            Berkshire,
            <br />
            RG30 2SN,
            <br />
            United Kingdom
          </p>

          <p>
            📞 +44 7577 315486
          </p>

          <p>
            📦 Return Address:
            <br />
            Same as Business Address
          </p>

          <p>
            📧 Business Email
            <br />
            support@amirahstoreltd.co.uk
          </p>

        </div>

      </div>

      <hr />

      <div className="footer-bottom">

        <p>
          © 2026 AMIRAH AMIRAH STORE LIMITED. All Rights Reserved.
        </p>

      </div>
    </footer>
  );
}

export default Footer;