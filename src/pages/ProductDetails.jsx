import { useParams, Link } from "react-router-dom";
import products from "../data/products";
import { useCart } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  if (!product) {
    return (
      <section className="products">
        <h2>Product Not Found</h2>

        <Link to="/products">
          <button className="view-btn">
            Back to Products
          </button>
        </Link>
      </section>
    );
  }

  return (
    <section className="products">
      <div className="details-container">

        <div className="details-image">
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
          />
        </div>

        <div className="details-content">

          <span className="product-category">
            {product.category}
          </span>

          <h2>{product.name}</h2>

          <div className="rating">
            ⭐⭐⭐⭐⭐ <span>(5.0 Customer Rating)</span>
          </div>

          <h1 className="price">
            {product.price}
          </h1>

          <p>
            {product.description}
          </p>

          <h3>Product Features</h3>

          <ul className="feature-list">
            {product.features.map((feature, index) => (
              <li key={index}>
                ✅ {feature}
              </li>
            ))}
          </ul>

          <div className="details-buttons">

            <button
              className="cart-btn"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>

            <Link to="/products">
              <button className="view-btn">
                Back to Products
              </button>
            </Link>

          </div>

          <div className="shipping-info">
            🚚 Free UK Delivery <br />
            🔒 Secure Checkout <br />
            ↩️ 30 Days Return Policy
          </div>

        </div>

      </div>
    </section>
  );
}

export default ProductDetails;