import { useState } from "react";
import ProductCard from "./ProductCard";
import products from "../data/products";

function Products() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="products" id="products">
      <h2>Our Products</h2>

      <p className="products-subtitle">
        Discover our range of premium cleaning and maintenance products
        designed for homes, offices and commercial environments.
      </p>

      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="category-buttons">
        <button
          className={category === "All" ? "active-category" : ""}
          onClick={() => setCategory("All")}
        >
          All Products
        </button>

        <button
          className={category === "Floor Cleaners" ? "active-category" : ""}
          onClick={() => setCategory("Floor Cleaners")}
        >
          Floor Cleaners
        </button>

        <button
          className={category === "Glass Cleaners" ? "active-category" : ""}
          onClick={() => setCategory("Glass Cleaners")}
        >
          Glass Cleaners
        </button>

        <button
          className={category === "Disinfectants" ? "active-category" : ""}
          onClick={() => setCategory("Disinfectants")}
        >
          Disinfectants
        </button>

        <button
          className={category === "Cleaning Kits" ? "active-category" : ""}
          onClick={() => setCategory("Cleaning Kits")}
        >
          Cleaning Kits
        </button>

        <button
          className={category === "Cleaning Tools" ? "active-category" : ""}
          onClick={() => setCategory("Cleaning Tools")}
        >
          Cleaning Tools
        </button>

        <button
          className={category === "Cleaning Accessories" ? "active-category" : ""}
          onClick={() => setCategory("Cleaning Accessories")}
        >
          Cleaning Accessories
        </button>

        <button
          className={category === "Window Cleaning" ? "active-category" : ""}
          onClick={() => setCategory("Window Cleaning")}
        >
          Window Cleaning
        </button>

        <button
          className={category === "Kitchen Cleaners" ? "active-category" : ""}
          onClick={() => setCategory("Kitchen Cleaners")}
        >
          Kitchen Cleaners
        </button>

        <button
          className={category === "Laundry Care" ? "active-category" : ""}
          onClick={() => setCategory("Laundry Care")}
        >
          Laundry Care
        </button>

        <button
          className={category === "Car Care" ? "active-category" : ""}
          onClick={() => setCategory("Car Care")}
        >
          Car Care
        </button>

        <button
          className={category === "Cleaning Wipes" ? "active-category" : ""}
          onClick={() => setCategory("Cleaning Wipes")}
        >
          Cleaning Wipes
        </button>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <h3>No products found.</h3>
          <p>Try searching with another keyword.</p>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              image={product.image}
              name={product.name}
              description={product.description}
              price={product.price}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Products;