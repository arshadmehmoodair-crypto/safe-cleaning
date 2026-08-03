import { useState } from "react";

function ContactForm() {
  const [name, setName] = useState("");

  return (
    <section style={{ padding: "60px", textAlign: "center" }}>
      <h2>Contact Form</h2>

      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <h3>Hello, {name}</h3>
    </section>
  );
}

export default ContactForm;