function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="contact-container">

        <h2>Contact Us</h2>

        <p className="contact-intro">
          We're here to help. If you have any questions about our products,
          orders or delivery, please get in touch with our team.
        </p>

        <div className="contact-grid">

          <div className="contact-card">
            <h3>📞 Phone</h3>
            <p>+44 7577 315486</p>
          </div>

          <div className="contact-card">
            <h3>📧 Business Email</h3>
            <p>support@amirahstoreltd.co.uk</p>
          </div>

          <div className="contact-card">
            <h3>📍 Business Address</h3>

            <p>
              115 Wantage Road
              <br />
              Reading
              <br />
              Berkshire
              <br />
              RG30 2SN
              <br />
              United Kingdom
            </p>
          </div>

          <div className="contact-card">
            <h3>🔄 Return Address</h3>

            <p>
              Same as Business Address
            </p>
          </div>

          <div className="contact-card">
            <h3>🕒 Business Hours</h3>

            <p>Monday – Friday</p>
            <p>9:00 AM – 6:00 PM</p>

            <br />

            <p>Saturday</p>
            <p>10:00 AM – 4:00 PM</p>

            <br />

            <p>Sunday</p>
            <p>Closed</p>
          </div>

          <div className="contact-card">
            <h3>🏢 Company</h3>

            <p>
              AMIRAH STORE LIMITED
            </p>
          </div>

        </div>

        <button className="contact-btn">
          Call Our Team
        </button>

      </div>
    </section>
  );
}

export default Contact;