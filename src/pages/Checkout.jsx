import { useState } from "react";
import { useCart } from "../context/CartContext";
import axios from "axios";

function Checkout() {
  const { cartItems } = useCart();

  const [loading, setLoading] = useState(false);

  const [customer, setCustomer] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postcode: "",
    country: "",
  });

  const total = cartItems.reduce((sum, item) => {
    return (
      sum +
      parseFloat(item.price.replace("£", "")) * item.quantity
    );
  }, 0);

  const handleChange = (e) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://safe-cleaning-1.onrender.com/create-checkout-session",
        {
          cartItems,
          customer,
        }
      );

      if (response.data.success && response.data.url) {
        window.location.href = response.data.url;
        return;
      }

      alert("Unable to create Stripe Checkout Session.");
    } catch (err) {
      console.error(err);

      if (err.response) {
        alert(
          err.response.data.error ||
            "Payment could not be started."
        );
      } else {
        alert("Unable to connect to payment server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="checkout-page">
      <h2>Secure Checkout</h2>

      <div className="checkout-container">
        <div className="checkout-form">
          <h3>Shipping Information</h3>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={customer.fullName}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={customer.email}
              onChange={handleChange}
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={customer.phone}
              onChange={handleChange}
              required
            />

            <textarea
              name="address"
              rows="4"
              placeholder="Delivery Address"
              value={customer.address}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={customer.city}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="postcode"
              placeholder="Postcode"
              value={customer.postcode}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="country"
              placeholder="Country"
              value={customer.country}
              onChange={handleChange}
              required
            />

            <button
              className="checkout-btn"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Redirecting..."
                : "Proceed to Payment"}
            </button>
          </form>
        </div>

        <div className="summary-box">
          <h3>Order Summary</h3>

          {cartItems.map((item) => (
            <div
              key={item.id}
              className="summary-item"
            >
              <span>
                {item.name} × {item.quantity}
              </span>

              <strong>
                £
                {(
                  parseFloat(
                    item.price.replace("£", "")
                  ) * item.quantity
                ).toFixed(2)}
              </strong>
            </div>
          ))}

          <hr />

          <h2>Total</h2>

          <h1>£{total.toFixed(2)}</h1>

          <div className="secure-box">
            🔒 Secure Stripe Checkout
          </div>
        </div>
      </div>
    </section>
  );
}

export default Checkout;