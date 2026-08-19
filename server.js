import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4242;

app.use(cors());
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.get("/", (req, res) => {
  res.send("Stripe Server Running");
});

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { cartItems, customer } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Cart is empty",
      });
    }

    if (!customer || !customer.email) {
      return res.status(400).json({
        success: false,
        error: "Customer email is required",
      });
    }

    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "gbp",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(
          parseFloat(item.price.replace("£", "")) * 100
        ),
      },
      quantity: item.quantity,
    }));

    const frontendUrl =
      process.env.FRONTEND_URL || "http://localhost:5173";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: lineItems,

      customer_email: customer.email,

      customer_creation: "always",

      billing_address_collection: "required",

      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: "AMIRAH STORE LIMITED - Customer Order",
          footer: "Thank you for shopping with AMIRAH STORE LIMITED.",
        },
      },

      metadata: {
        customer_name: customer.fullName || "",
        customer_phone: customer.phone || "",
        customer_address: customer.address || "",
        customer_city: customer.city || "",
        customer_postcode: customer.postcode || "",
        customer_country: customer.country || "",
      },

      success_url: `${frontendUrl}/success`,
      cancel_url: `${frontendUrl}/cancel`,
    });

    res.json({
      success: true,
      url: session.url,
    });
  } catch (err) {
    console.error("Stripe Error:", err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Stripe Server Running on port ${PORT}`);
});