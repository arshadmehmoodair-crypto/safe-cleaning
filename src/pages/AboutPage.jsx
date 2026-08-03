function AboutPage() {
  return (
    <section className="products">
      <h2>About Us</h2>

      <div className="card" style={{ maxWidth: "900px", margin: "40px auto" }}>
        <h3>SAFE CLEANING AND MAINTENANCE LIMITED</h3>

        <p>
          SAFE CLEANING AND MAINTENANCE LIMITED supplies professional cleaning
          products and maintenance solutions for homes, offices and commercial
          businesses across the United Kingdom.
        </p>

        <h3>Our Mission</h3>

        <p>
          We are committed to providing high-quality cleaning products with
          excellent customer service, competitive pricing and reliable UK
          delivery.
        </p>

        <h3>Why Choose Us?</h3>

        <ul style={{ textAlign: "left", lineHeight: "2" }}>
          <li>✔ Professional quality products</li>
          <li>✔ Reliable customer support</li>
          <li>✔ Competitive UK pricing</li>
          <li>✔ Fast delivery</li>
          <li>✔ Trusted cleaning solutions</li>
        </ul>
      </div>
    </section>
  );
}

export default AboutPage;