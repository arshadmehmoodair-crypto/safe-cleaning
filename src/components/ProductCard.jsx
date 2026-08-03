import { Link } from "react-router-dom";

function ProductCard({
  id,
  image,
  name,
  description,
  price,
}) {
  return (
    <div className="card">
      <div className="image-wrapper">
        <img
          src={image}
          alt={name}
          className="product-image"
        />

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

        <div className="card-buttons">
          <Link to={`/products/${id}`}>
            <button className="view-btn">
              View Details
            </button>
          </Link>

          <button className="cart-btn">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;