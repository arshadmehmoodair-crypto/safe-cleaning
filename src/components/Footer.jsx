
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h2>MARIYA RAA SADDI LTD</h2>
          <p>
            We supply high-quality cleaning products for
            homes, offices and commercial businesses
            across the United Kingdom.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-section">
          <h3>Customer Information</h3>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms">Terms &amp; Conditions</Link>
          <Link to="/shipping-policy">Shipping Policy</Link>
          <Link to="/returns-policy">Returns Policy</Link>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>

          <p>
            📍 Flat 4, 1 Wantage Road,
            <br />
            Reading, Berkshire,
            <br />
            United Kingdom,
            <br />
            RG30 2SH
          </p>

          <p>📞 +447848163522</p>

          <p>
            📦 Return Address:
            <br />
            Please contact us before returning an item.
          </p>

          <p>
            📧 Business Email
            <br />
            <a href="mailto:mariyasaddiqueuk@gmail.com">
              mariyasaddiqueuk@gmail.com
            </a>
          </p>
        </div>
      </div>

      <hr />

      <div className="footer-bottom">
        <p>
          © 2026 MARIYA RAA SADDI LTD. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
