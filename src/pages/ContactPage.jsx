import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

function ContactPage() {
  const form = useRef();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const sendEmail = (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    emailjs
      .sendForm(
        "service_g53hzj8",
        "template_bi0b2c1",
        form.current,
        "LQ22w6s-Rsz2mYEwy"
      )
      .then(
        () => {
          setMessage("✅ Message sent successfully!");
          form.current.reset();
          setLoading(false);
        },
        (error) => {
          console.error(error);

          setMessage("❌ Failed to send message. Please try again.");
          setLoading(false);
        }
      );
  };

  return (
    <section className="products">
      <h2>Contact Us</h2>

      <div
        className="card"
        style={{
          maxWidth: "700px",
          margin: "40px auto",
        }}
      >
        <h3>SAFE CLEANING AND MAINTENANCE LIMITED</h3>

        <p>
          We'd love to hear from you. If you have any questions about our
          products or services, please get in touch.
        </p>

        <p>
          <strong>Email:</strong> info@safecleaning.co.uk
        </p>

        <p>
          <strong>Phone:</strong> +44 1234 567890
        </p>

        <form ref={form} onSubmit={sendEmail}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
            }}
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
            }}
          />

          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            required
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
            }}
          ></textarea>

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>

          {message && (
            <p
              style={{
                marginTop: "20px",
                fontWeight: "bold",
              }}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

export default ContactPage;