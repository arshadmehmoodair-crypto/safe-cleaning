function Success() {
  return (
    <section className="products">
      <div
        className="card"
        style={{
          maxWidth: "600px",
          margin: "50px auto",
          textAlign: "center",
        }}
      >
        <h2>✅ Payment Successful</h2>

        <p>
          Thank you for your order. Your payment has been received
          successfully.
        </p>

        <p>
          We will contact you soon regarding delivery.
        </p>
      </div>
    </section>
  );
}

export default Success;