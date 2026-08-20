import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  function addToCart(product) {
    const existingProduct = cartItems.find(
      (item) => item.id === product.id
    );

    // Check stock before adding
    if (existingProduct) {
      if (existingProduct.quantity >= product.stock) {
        toast.error(
          `Sorry, only ${product.stock} available.`
        );
        return;
      }

      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      );

      toast.success("Quantity updated successfully!");
    } else {
      if (product.stock <= 0) {
        toast.error("This product is out of stock.");
        return;
      }

      setCartItems([
        ...cartItems,
        {
          ...product,
          quantity: 1,
        },
      ]);

      toast.success("Product added to cart!");
    }
  }

  function removeFromCart(id) {
    setCartItems(
      cartItems.filter((item) => item.id !== id)
    );

    toast.error("Product removed from cart.");
  }

  function increaseQuantity(id) {
    const item = cartItems.find(
      (item) => item.id === id
    );

    if (!item) return;

    if (item.quantity >= item.stock) {
      toast.error(
        `Only ${item.stock} available in stock.`
      );
      return;
    }

    setCartItems(
      cartItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );

    toast.info("Quantity increased.");
  }

  function decreaseQuantity(id) {
    const item = cartItems.find(
      (item) => item.id === id
    );

    if (!item) return;

    setCartItems(
      cartItems
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );

    if (item.quantity === 1) {
      toast.error("Product removed from cart.");
    } else {
      toast.info("Quantity decreased.");
    }
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}