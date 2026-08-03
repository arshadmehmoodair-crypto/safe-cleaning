import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const total = cartItems.reduce((sum, item) => {
    return (
      sum +
      Number(item.price.replace("£", "")) * item.quantity
    );
  }, 0);

  if (cartItems.length === 0) {
    return (
      <section className="cart-page">
        <h2>Shopping Cart</h2>

        <div className="empty-cart">
          <h3>🛒 Your cart is empty</h3>

          <p>
            Browse our products and add your favourite items.
          </p>

          <Link to="/products">
            <button className="continue-btn">
              Continue Shopping
            </button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page">

      <h2>Shopping Cart</h2>

      <div className="cart-container">

        <div className="cart-items">

          {cartItems.map((item) => (

            <div key={item.id} className="cart-card">

              <img
                src={item.image}
                alt={item.name}
                className="cart-image"
              />

              <div className="cart-info">

                <h3>{item.name}</h3>

                <p className="cart-price">
                  {item.price}
                </p>

                <div className="quantity-box">

                  <button
                    onClick={() => decreaseQuantity(item.id)}
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() => increaseQuantity(item.id)}
                  >
                    +
                  </button>

                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>

              </div>

            </div>

          ))}

        </div>

        <div className="order-summary">

          <h3>Order Summary</h3>

          <p>Total Items: {cartItems.length}</p>

          <h2>£{total.toFixed(2)}</h2>

          <Link to="/checkout">
            <button className="checkout-btn">
              Proceed to Checkout
            </button>
          </Link>

        </div>

      </div>

    </section>
  );
}

export default Cart;