function Cancel() {
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
        <h2>❌ Payment Cancelled</h2>

        <p>
          Your payment was cancelled.
        </p>

        <p>
          You can return to checkout and try again.
        </p>
      </div>
    </section>
  );
}

export default Cancel;