import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductCard({
  id,
  image,
  name,
  description,
  price,
  stock,
}) {
  const { addToCart } = useCart();

  const isOutOfStock = stock <= 0;

  return (
    <div className="product-card">
      <div className="card-image">
        <img src={image} alt={name} />

        <span className="product-badge">
          Best Seller
        </span>
      </div>

      <div className="card-content">
        <h3>{name}</h3>

        <div className="rating">
          ⭐⭐⭐⭐⭐ <span>(5.0)</span>
        </div>

        <p>{description}</p>

        <h4 className="price">{price}</h4>

        {/* Stock Information */}
        {isOutOfStock ? (
          <p className="stock out-of-stock">
            Out of Stock
          </p>
        ) : (
          <p className="stock">
            Only {stock} left
          </p>
        )}

        <div className="card-buttons">
          <Link to={`/products/${id}`}>
            <button className="view-btn">
              View Details
            </button>
          </Link>

          <button
            className="cart-btn"
            disabled={isOutOfStock}
            onClick={() =>
              addToCart({
                id,
                image,
                name,
                description,
                price,
                stock,
              })
            }
          >
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;