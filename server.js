import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";
import pg from "pg";

dotenv.config();

const { Pool } = pg;

const app = express();
const PORT = process.env.PORT || 4242;

const secretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const databaseUrl = process.env.DATABASE_URL;

if (!secretKey) {
  console.error("❌ STRIPE_SECRET_KEY is missing!");
  process.exit(1);
}

if (!webhookSecret) {
  console.error("❌ STRIPE_WEBHOOK_SECRET is missing!");
  process.exit(1);
}

if (!databaseUrl) {
  console.error("❌ DATABASE_URL is missing!");
  process.exit(1);
}

const stripeMode = secretKey.startsWith("sk_live_")
  ? "LIVE"
  : secretKey.startsWith("sk_test_")
  ? "TEST"
  : "UNKNOWN";

console.log(`🔐 STRIPE MODE: ${stripeMode}`);

const stripe = new Stripe(secretKey);

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: databaseUrl.includes("localhost")
    ? false
    : { rejectUnauthorized: false },
});

// =====================================================
// PRODUCT CATALOG
// Server-side prices are used.
// Customer cannot change price from frontend.
// =====================================================

const PRODUCTS = [
  { id: 1, name: "Floor Cleaner", price: 12.99 },
  { id: 2, name: "Glass Cleaner", price: 8.99 },
  { id: 3, name: "Disinfectant", price: 10.99 },
  { id: 4, name: "Window Cleaning Kit", price: 19.99 },
  { id: 5, name: "Microfiber Flat Mop", price: 24.99 },
  { id: 6, name: "Chenille Mop Slippers", price: 9.99 },
  { id: 7, name: "360° Spin Mop Bucket Set", price: 39.99 },
  { id: 8, name: "Multi Purpose Cleaner Spray", price: 10.99 },
  { id: 9, name: "Microfiber Cleaning Cloths", price: 9.99 },
  { id: 10, name: "Telescopic Window Cleaning Brush", price: 18.99 },
  { id: 11, name: "Universal Disinfectant Wipes", price: 2.01 },
  { id: 12, name: "Kennel Disinfectant 5L", price: 14.99 },
  { id: 13, name: "Dr. Beckmann Stain Removers", price: 2.99 },
  { id: 14, name: "Triangle Microfiber Mop", price: 22.99 },
  { id: 15, name: "Car Windscreen Cleaning Brush", price: 11.99 },
  { id: 16, name: "Professional Window Squeegee", price: 12.99 },
  { id: 17, name: "Elbow Grease Scrubbing Pads", price: 9.99 },
  { id: 18, name: "Silicone Bottle Cleaning Brush", price: 8.99 },
  { id: 19, name: "Fairy Professional Washing Up Liquid", price: 12.99 },
  { id: 20, name: "Fairy Lemon Cleaning Wipes", price: 9.99 },
];

// =====================================================
// DATABASE SETUP
// =====================================================

async function setupDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      price NUMERIC(10,2) NOT NULL,
      stock INTEGER NOT NULL DEFAULT 20,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS orders (
      id BIGSERIAL PRIMARY KEY,
      stripe_session_id TEXT UNIQUE NOT NULL,
      stripe_payment_intent_id TEXT,
      customer_name TEXT,
      customer_email TEXT,
      customer_phone TEXT,
      customer_address TEXT,
      customer_city TEXT,
      customer_postcode TEXT,
      customer_country TEXT,
      total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'gbp',
      payment_status TEXT NOT NULL DEFAULT 'paid',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id BIGSERIAL PRIMARY KEY,
      order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER,
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price NUMERIC(10,2) NOT NULL,
      total_price NUMERIC(10,2) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS stripe_events (
      id TEXT PRIMARY KEY,
      event_type TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_orders_created_at
      ON orders(created_at);

    CREATE INDEX IF NOT EXISTS idx_order_items_product_id
      ON order_items(product_id);
  `);

  // Add missing products without resetting existing stock.
  for (const product of PRODUCTS) {
    await pool.query(
      `
      INSERT INTO products (id, name, price, stock)
      VALUES ($1, $2, $3, 20)
      ON CONFLICT (id)
      DO UPDATE SET
        name = EXCLUDED.name,
        price = EXCLUDED.price,
        updated_at = NOW()
      `,
      [product.id, product.name, product.price]
    );
  }

  console.log("✅ Database ready");
}

// =====================================================
// HELPER
// =====================================================

function getLondonDate(offsetDays = 0) {
  const now = new Date();

  const london = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const year = Number(london.find((x) => x.type === "year").value);
  const month = Number(london.find((x) => x.type === "month").value);
  const day = Number(london.find((x) => x.type === "day").value);

  const date = new Date(
    Date.UTC(year, month - 1, day + offsetDays)
  );

  return date.toISOString().slice(0, 10);
}

// =====================================================
// WEBHOOK
// MUST COME BEFORE express.json()
// =====================================================

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const signature = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error(
        "❌ Webhook signature error:",
        err.message
      );

      return res
        .status(400)
        .send(`Webhook Error: ${err.message}`);
    }

    console.log(
      "✅ Stripe webhook received:",
      event.type
    );

    // =================================================
    // SUCCESSFUL PAYMENT
    // =================================================

    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      const session = event.data.object;

      if (
        event.type === "checkout.session.completed" &&
        session.payment_status !== "paid"
      ) {
        console.log(
          "⚠️ Checkout completed but payment not paid yet:",
          session.payment_status
        );

        return res.json({ received: true });
      }

      const client = await pool.connect();

      try {
        await client.query("BEGIN");

        // ---------------------------------------------
        // Prevent duplicate webhook processing
        // ---------------------------------------------

        const eventResult = await client.query(
          `
          INSERT INTO stripe_events (id, event_type)
          VALUES ($1, $2)
          ON CONFLICT (id) DO NOTHING
          RETURNING id
          `,
          [event.id, event.type]
        );

        if (eventResult.rowCount === 0) {
          await client.query("ROLLBACK");

          console.log(
            "ℹ️ Duplicate Stripe event ignored:",
            event.id
          );

          return res.json({
            received: true,
            duplicate: true,
          });
        }

        // ---------------------------------------------
        // Check whether order already exists
        // ---------------------------------------------

        const existingOrder = await client.query(
          `
          SELECT id
          FROM orders
          WHERE stripe_session_id = $1
          `,
          [session.id]
        );

        if (existingOrder.rowCount > 0) {
          await client.query("COMMIT");

          console.log(
            "ℹ️ Order already exists:",
            session.id
          );

          return res.json({
            received: true,
            alreadyProcessed: true,
          });
        }

        // ---------------------------------------------
        // Get Stripe line items
        // ---------------------------------------------

        const lineItems =
          await stripe.checkout.sessions.listLineItems(
            session.id,
            {
              limit: 100,
            }
          );

        // ---------------------------------------------
        // Customer metadata
        // ---------------------------------------------

        const metadata = session.metadata || {};

        const customerName =
          metadata.customer_name || "";

        const customerPhone =
          metadata.customer_phone || "";

        const customerAddress =
          metadata.customer_address || "";

        const customerCity =
          metadata.customer_city || "";

        const customerPostcode =
          metadata.customer_postcode || "";

        const customerCountry =
          metadata.customer_country || "";

        // ---------------------------------------------
        // Calculate total
        // ---------------------------------------------

        const totalAmount =
          (session.amount_total || 0) / 100;

        // ---------------------------------------------
        // Create order
        // ---------------------------------------------

        const orderResult = await client.query(
          `
          INSERT INTO orders (
            stripe_session_id,
            stripe_payment_intent_id,
            customer_name,
            customer_email,
            customer_phone,
            customer_address,
            customer_city,
            customer_postcode,
            customer_country,
            total_amount,
            currency,
            payment_status
          )
          VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
          )
          RETURNING id
          `,
          [
            session.id,
            session.payment_intent || null,
            customerName,
            session.customer_details?.email ||
              session.customer_email ||
              "",
            customerPhone,
            customerAddress,
            customerCity,
            customerPostcode,
            customerCountry,
            totalAmount,
            session.currency || "gbp",
            session.payment_status || "paid",
          ]
        );

        const orderId = orderResult.rows[0].id;

        // ---------------------------------------------
        // Save products + decrease stock
        // ---------------------------------------------

        for (const item of lineItems.data) {
          const productName =
            item.description || "Unknown Product";

          const quantity =
            Number(item.quantity) || 1;

          const unitPrice =
            item.price?.unit_amount
              ? item.price.unit_amount / 100
              : 0;

          const itemTotal =
            unitPrice * quantity;

          // Try to match product by name.
          const productResult = await client.query(
            `
            SELECT id, stock
            FROM products
            WHERE LOWER(name) = LOWER($1)
            LIMIT 1
            `,
            [productName]
          );

          let productId = null;

          if (productResult.rowCount > 0) {
            productId = productResult.rows[0].id;

            // -----------------------------------------
            // ACTUAL STOCK DEDUCTION
            // -----------------------------------------

            const stockUpdate =
              await client.query(
                `
                UPDATE products
                SET
                  stock = stock - $1,
                  updated_at = NOW()
                WHERE id = $2
                  AND stock >= $1
                `,
                [quantity, productId]
              );

            if (stockUpdate.rowCount === 0) {
              throw new Error(
                `Insufficient stock for "${productName}".`
              );
            }

            console.log(
              `📦 Stock decreased: ${productName} -${quantity}`
            );
          } else {
            console.warn(
              `⚠️ Product not found in database: ${productName}`
            );
          }

          // -----------------------------------------
          // Save order item
          // -----------------------------------------

          await client.query(
            `
            INSERT INTO order_items (
              order_id,
              product_id,
              product_name,
              quantity,
              unit_price,
              total_price
            )
            VALUES ($1,$2,$3,$4,$5,$6)
            `,
            [
              orderId,
              productId,
              productName,
              quantity,
              unitPrice,
              itemTotal,
            ]
          );
        }

        await client.query("COMMIT");

        console.log(
          "💰 ORDER SAVED:",
          orderId
        );

        console.log(
          "💷 TOTAL:",
          totalAmount
        );

        console.log(
          "👤 CUSTOMER:",
          session.customer_email
        );
      } catch (err) {
        await client.query("ROLLBACK");

        console.error(
          "❌ Order processing failed:",
          err.message
        );

        return res.status(500).json({
          received: true,
          error: err.message,
        });
      } finally {
        client.release();
      }
    }

    // =================================================
    // FAILED DELAYED PAYMENT
    // =================================================

    if (
      event.type ===
      "checkout.session.async_payment_failed"
    ) {
      console.log(
        "❌ Delayed payment failed:",
        event.data.object.id
      );
    }

    res.json({
      received: true,
    });
  }
);

// =====================================================
// NORMAL REQUESTS
// =====================================================

app.use(cors());
app.use(express.json());

// =====================================================
// HOME
// =====================================================

app.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) AS orders FROM orders"
    );

    res.json({
      success: true,
      message: "Stripe Server Running",
      stripeMode,
      database: "CONNECTED",
      orders: Number(result.rows[0].orders),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// =====================================================
// CHECK STOCK
// =====================================================

app.get("/products-stock", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        price,
        stock
      FROM products
      ORDER BY id
    `);

    res.json({
      success: true,
      products: result.rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// =====================================================
// CREATE CHECKOUT SESSION
// =====================================================

app.post(
  "/create-checkout-session",
  async (req, res) => {
    try {
      const { cartItems, customer } = req.body;

      if (
        !Array.isArray(cartItems) ||
        cartItems.length === 0
      ) {
        return res.status(400).json({
          success: false,
          error: "Cart is empty",
        });
      }

      if (
        !customer ||
        !customer.email
      ) {
        return res.status(400).json({
          success: false,
          error: "Customer email is required",
        });
      }

      // -----------------------------------------------
      // Load products from DB
      // -----------------------------------------------

      const ids = cartItems
        .map((item) => Number(item.id))
        .filter(Boolean);

      if (ids.length === 0) {
        return res.status(400).json({
          success: false,
          error: "Invalid products",
        });
      }

      const result = await pool.query(
        `
        SELECT id, name, price, stock
        FROM products
        WHERE id = ANY($1::int[])
        `,
        [ids]
      );

      const dbProducts = new Map(
        result.rows.map((p) => [
          Number(p.id),
          p,
        ])
      );

      const lineItems = [];

      const checkoutItems = [];

      for (const item of cartItems) {
        const productId = Number(item.id);
        const quantity =
          Number(item.quantity) || 1;

        const product =
          dbProducts.get(productId);

        if (!product) {
          return res.status(400).json({
            success: false,
            error:
              `Product ${productId} not found`,
          });
        }

        if (quantity < 1) {
          return res.status(400).json({
            success: false,
            error:
              `Invalid quantity for ${product.name}`,
          });
        }

        if (quantity > Number(product.stock)) {
          return res.status(400).json({
            success: false,
            error:
              `${product.name} only has ${product.stock} left in stock`,
          });
        }

        // ---------------------------------------------
        // SERVER-SIDE PRICE
        // ---------------------------------------------

        lineItems.push({
          price_data: {
            currency: "gbp",

            product_data: {
              name: product.name,
            },

            unit_amount: Math.round(
              Number(product.price) * 100
            ),
          },

          quantity,
        });

        checkoutItems.push({
          id: productId,
          q: quantity,
        });
      }

      // -----------------------------------------------
      // Stripe Checkout
      // -----------------------------------------------

      const frontendUrl =
        process.env.FRONTEND_URL ||
        "https://amirahstoreltd.co.uk";

      const session =
        await stripe.checkout.sessions.create({
          mode: "payment",

          line_items: lineItems,

          customer_email: customer.email,

          customer_creation: "always",

          billing_address_collection:
            "required",

          invoice_creation: {
            enabled: true,

            invoice_data: {
              description:
                "AMIRAH STORE LIMITED - Customer Order",

              footer:
                "Thank you for shopping with AMIRAH STORE LIMITED.",
            },
          },

          metadata: {
            customer_name:
              customer.fullName || "",

            customer_phone:
              customer.phone || "",

            customer_address:
              customer.address || "",

            customer_city:
              customer.city || "",

            customer_postcode:
              customer.postcode || "",

            customer_country:
              customer.country || "",

            cart_items:
              JSON.stringify(checkoutItems),
          },

          success_url:
            `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,

          cancel_url:
            `${frontendUrl}/cancel`,
        });

      console.log(
        "✅ Checkout session created:",
        session.id
      );

      res.json({
        success: true,
        url: session.url,
      });
    } catch (err) {
      console.error(
        "❌ Stripe Error:",
        err
      );

      res.status(500).json({

        success: false,
        error: err.message,
      });
    }
  }
);

// =====================================================
// ADMIN DASHBOARD
// =====================================================

app.get("/admin", async (req, res) => {
  try {
    const today = getLondonDate(0);
    const yesterday = getLondonDate(-1);

    // Today's sales
    const salesToday = await pool.query(`
      SELECT
        COALESCE(SUM(total_amount), 0) AS sales,
        COUNT(*) AS orders
      FROM orders
      WHERE created_at >= $1::date
        AND created_at < ($1::date + INTERVAL '1 day')
    `, [today]);

    // Yesterday's sales
    const salesYesterday = await pool.query(`
      SELECT
        COALESCE(SUM(total_amount), 0) AS sales,
        COUNT(*) AS orders
      FROM orders
      WHERE created_at >= $1::date
        AND created_at < ($1::date + INTERVAL '1 day')
    `, [yesterday]);

    // Total sales
    const allSales = await pool.query(`
      SELECT
        COALESCE(SUM(total_amount), 0) AS sales,
        COUNT(*) AS orders
      FROM orders
    `);

    // Products / stock
    const products = await pool.query(`
      SELECT
        id,
        name,
        price,
        stock
      FROM products
      ORDER BY stock ASC, id ASC
    `);

    // Recent orders
    const recentOrders = await pool.query(`
      SELECT
        id,
        customer_name,
        customer_email,
        total_amount,
        currency,
        payment_status,
        created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 50
    `);

    // Top selling products
    const topProducts = await pool.query(`
      SELECT
        product_name,
        SUM(quantity)::INTEGER AS quantity_sold,
        SUM(total_price) AS revenue
      FROM order_items
      GROUP BY product_name
      ORDER BY quantity_sold DESC
      LIMIT 10
    `);

    const todaySales =
      Number(salesToday.rows[0].sales || 0);

    const yesterdaySales =
      Number(salesYesterday.rows[0].sales || 0);

    const totalSales =
      Number(allSales.rows[0].sales || 0);

    const todayOrders =
      Number(salesToday.rows[0].orders || 0);

    const yesterdayOrders =
      Number(salesYesterday.rows[0].orders || 0);

    const totalOrders =
      Number(allSales.rows[0].orders || 0);

    // Total units available
    const availableStock =
      products.rows.reduce(
        (total, product) =>
          total + Number(product.stock || 0),
        0
      );

    // Products with 5 or fewer units
    const lowStock =
      products.rows.filter(
        (product) =>
          Number(product.stock) <= 5
      );

    const html = `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<title>
AMIRAH STORE - Admin Dashboard
</title>

<meta
  name="viewport"
  content="width=device-width, initial-scale=1"
/>

<style>

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #f5f7fb;
  color: #172033;
}

header {
  background: #111827;
  color: white;
  padding: 28px 30px;
}

header h1 {
  margin: 0;
  font-size: 28px;
}

header p {
  margin: 8px 0 0;
  color: #cbd5e1;
}

.container {
  max-width: 1400px;
  margin: auto;
  padding: 25px;
}

/* DASHBOARD CARDS */

.cards {
  display: grid;

  grid-template-columns:
    repeat(
      auto-fit,
      minmax(210px, 1fr)
    );

  gap: 18px;

  margin-bottom: 25px;
}

.card {
  background: white;

  border-radius: 14px;

  padding: 22px;

  box-shadow:
    0 4px 18px rgba(0,0,0,.06);
}

.card h3 {
  margin: 0;

  color: #64748b;

  font-size: 14px;
}

.card .number {
  margin-top: 10px;

  font-size: 30px;

  font-weight: bold;
}

.card .small {
  margin-top: 6px;
}

/* SECTIONS */

.section {
  background: white;

  border-radius: 14px;

  padding: 22px;

  margin-bottom: 25px;

  box-shadow:
    0 4px 18px rgba(0,0,0,.06);
}

.section h2 {
  margin-top: 0;
}

/* TABLE */

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;

  border-collapse: collapse;
}

th,
td {
  padding: 12px;

  text-align: left;

  border-bottom:
    1px solid #e5e7eb;
}

th {
  background: #f8fafc;
}

/* STOCK */

.stock-low {
  color: #dc2626;

  font-weight: bold;
}

.stock-ok {
  color: #16a34a;

  font-weight: bold;
}

/* BADGE */

.badge {
  display: inline-block;

  padding: 5px 9px;

  border-radius: 999px;

  background: #dcfce7;

  color: #166534;

  font-size: 12px;
}

.small {
  color: #64748b;

  font-size: 13px;
}

</style>

</head>

<body>

<header>

<h1>
AMIRAH STORE LIMITED
</h1>

<p>
Sales, Orders & Inventory Dashboard
</p>

</header>

<div class="container">

<!-- ================================================= -->
<!-- DASHBOARD CARDS -->
<!-- ================================================= -->

<div class="cards">

<!-- Today's Sales -->

<div class="card">

<h3>
Today's Sales
</h3>

<div class="number">
£${todaySales.toFixed(2)}
</div>

<div class="small">
${todayOrders} orders today
</div>

</div>


<!-- Yesterday's Sales -->

<div class="card">

<h3>
Yesterday's Sales
</h3>

<div class="number">
£${yesterdaySales.toFixed(2)}
</div>

<div class="small">
${yesterdayOrders} orders yesterday
</div>

</div>


<!-- Total Sales -->

<div class="card">

<h3>
Total Sales
</h3>

<div class="number">
£${totalSales.toFixed(2)}
</div>

<div class="small">
All orders
</div>

</div>


<!-- Total Orders -->

<div class="card">

<h3>
Orders
</h3>

<div class="number">
${totalOrders}
</div>

<div class="small">
Total orders received
</div>

</div>


<!-- Available Stock -->

<div class="card">

<h3>
Available Stock
</h3>

<div class="number">
${availableStock}
</div>

<div class="small">
Total units available
</div>

</div>


<!-- Low Stock -->

<div class="card">

<h3>
Low Stock
</h3>

<div class="number">
${lowStock.length}
</div>

<div class="small">
Products with 5 or fewer left
</div>

</div>

</div>


<!-- ================================================= -->
<!-- RECENT ORDERS -->
<!-- ================================================= -->

<div class="section">

<h2>
Recent Orders
</h2>

<div class="table-wrap">

<table>

<thead>

<tr>

<th>
Order
</th>

<th>
Customer
</th>

<th>
Email
</th>

<th>
Amount
</th>

<th>
Status
</th>

<th>
Date
</th>

</tr>

</thead>

<tbody>

${
  recentOrders.rows.length === 0
    ? `
      <tr>
        <td colspan="6">
          No orders yet.
        </td>
      </tr>
    `
    :
  recentOrders.rows
    .map(
      (order) => `
<tr>

<td>
#${order.id}
</td>

<td>
${escapeHtml(
  order.customer_name ||
  "Customer"
)}
</td>

<td>
${escapeHtml(
  order.customer_email ||
  ""
)}
</td>

<td>
£${Number(
  order.total_amount
).toFixed(2)}
</td>

<td>

<span class="badge">

${escapeHtml(
  order.payment_status
)}

</span>

</td>

<td>

${new Date(
  order.created_at
).toLocaleString(
  "en-GB",
  {
    timeZone:
      "Europe/London",
  }
)}

</td>

</tr>
`
    )
    .join("")
}

</tbody>

</table>

</div>

</div>


<!-- ================================================= -->
<!-- TOP SELLING PRODUCTS -->
<!-- ================================================= -->

<div class="section">

<h2>
Top Selling Products
</h2>

<div class="table-wrap">

<table>

<thead>

<tr>

<th>
Product
</th>

<th>
Quantity Sold
</th>

<th>
Revenue
</th>

</tr>

</thead>

<tbody>

${
  topProducts.rows.length === 0
    ? `
      <tr>
        <td colspan="3">
          No sales yet.
        </td>
      </tr>
    `
    :
  topProducts.rows
    .map(
      (product) => `
<tr>

<td>
${escapeHtml(
  product.product_name
)}
</td>

<td>
${product.quantity_sold}
</td>

<td>
£${Number(
  product.revenue
).toFixed(2)}
</td>

</tr>
`
    )
    .join("")
}

</tbody>

</table>

</div>

</div>


<!-- ================================================= -->
<!-- AVAILABLE STOCK -->
<!-- ================================================= -->

<div class="section">

<h2>
Available Stock
</h2>

<div class="table-wrap">

<table>

<thead>

<tr>

<th>
ID
</th>

<th>
Product
</th>

<th>
Price
</th>

<th>
Available
</th>

</tr>

</thead>

<tbody>

${
  products.rows
    .map(
      (product) => `
<tr>

<td>
${product.id}
</td>

<td>
${escapeHtml(
  product.name
)}
</td>

<td>
£${Number(
  product.price
).toFixed(2)}
</td>

<td class="${
  Number(product.stock) <= 5
    ? "stock-low"
    : "stock-ok"
}">

${product.stock}

</td>

</tr>
`
    )
    .join("")
}

</tbody>

</table>

</div>

</div>


<!-- ================================================= -->
<!-- LOW STOCK -->
<!-- ================================================= -->

<div class="section">

<h2>
Low Stock Products
</h2>

<div class="table-wrap">

<table>

<thead>

<tr>

<th>
Product
</th>

<th>
Remaining
</th>

</tr>

</thead>

<tbody>

${
  lowStock.length === 0
    ? `
      <tr>
        <td colspan="2">
          All products have healthy stock.
        </td>
      </tr>
    `
    :
  lowStock
    .map(
      (product) => `
<tr>

<td>
${escapeHtml(
  product.name
)}
</td>

<td class="stock-low">

${product.stock}

</td>

</tr>
`
    )
    .join("")
}

</tbody>

</table>

</div>

</div>


<!-- ================================================= -->
<!-- SYSTEM STATUS -->
<!-- ================================================= -->

<div class="section">

<h2>
System Status
</h2>

<p>

<span class="badge">

Stripe ${stripeMode}

</span>

</p>

<p>

Database:
<strong>
Connected
</strong>

</p>

<p class="small">

Dashboard timezone:
Europe/London

</p>

</div>

</div>

</body>

</html>
`;

    res.send(html);

  } catch (err) {

    console.error(
      "❌ Admin dashboard error:",
      err
    );

    res.status(500).send(`
      <h1>
        Dashboard Error
      </h1>

      <pre>
${escapeHtml(
  err.message
)}
      </pre>
    `);
  }
});

// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// =====================================================
// START SERVER
// =====================================================

async function startServer() {
  try {
    await setupDatabase();

    app.listen(
      PORT,
      "0.0.0.0",
      () => {
        console.log(
          `🚀 Stripe Server Running on port ${PORT}`
        );

        console.log(
          `🌐 PORT: ${PORT}`
        );

        console.log(
          `📊 Admin: /admin`
        );

        console.log(
          `🔐 Stripe Mode: ${stripeMode}`
        );
      }
    );
  } catch (err) {
    console.error(
      "❌ Server startup failed:",
      err
    );

    process.exit(1);
  }
}

startServer();