const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());

// Allow requests from React frontend (adjust origin as needed)
app.use(cors({ origin: "*" }));

let customers = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com" },
  { id: 2, name: "Bob Singh", email: "bob@example.com" }
];

let products = [
  { id: 1, name: "Wireless Mouse", price: 999.0, stock: 50 },
  { id: 2, name: "Mechanical Keyboard", price: 3499.0, stock: 20 }
];

let sales = [
  { id: 1, customerId: 1, items: [{ productId: 1, qty: 2 }], total: 1998.0, timestamp: new Date().toISOString() }
];

const nextId = (arr) => (arr.length ? Math.max(...arr.map((x) => x.id)) + 1 : 1);

app.get("/api", (req, res) => {
  res.json({ message: "Hello, Azure!" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// --- Customers ---
app.get("/api/customers", (req, res) => res.json(customers));
app.get("/api/customers/:id", (req, res) => {
  const c = customers.find((x) => x.id === Number(req.params.id));
  if (!c) return res.status(404).json({ error: "Not found" });
  res.json(c);
});
app.post("/api/customers", (req, res) => {
  const { name, email } = req.body || {};
  if (!name || !email) return res.status(400).json({ error: "name and email required" });
  const c = { id: nextId(customers), name, email };
  customers.push(c);
  res.status(201).json(c);
});

// --- Products ---
app.get("/api/products", (req, res) => res.json(products));
app.get("/api/products/:id", (req, res) => {
  const p = products.find((x) => x.id === Number(req.params.id));
  if (!p) return res.status(404).json({ error: "Not found" });
  res.json(p);
});
app.post("/api/products", (req, res) => {
  const { name, price, stock } = req.body || {};
  if (!name || typeof price !== "number" || typeof stock !== "number") {
    return res.status(400).json({ error: "name, price, stock required" });
  }
  const p = { id: nextId(products), name, price, stock };
  products.push(p);
  res.status(201).json(p);
});

// --- Sales ---
app.get("/api/sales", (req, res) => res.json(sales));
app.post("/api/sales", (req, res) => {
  const { customerId, items } = req.body || {};
  if (!customerId || !Array.isArray(items) || !items.length) return res.status(400).json({ error: "customerId and items required" });

  const customer = customers.find((c) => c.id === Number(customerId));
  if (!customer) return res.status(400).json({ error: "Invalid customerId" });

  let total = 0;
  for (const it of items) {
    const prod = products.find((p) => p.id === Number(it.productId));
    if (!prod) return res.status(400).json({ error: `Invalid productId ${it.productId}` });
    if (prod.stock < it.qty) return res.status(400).json({ error: `Insufficient stock for productId ${it.productId}` });
    total += prod.price * it.qty;
    prod.stock -= it.qty;
  }

  const s = { id: nextId(sales), customerId: Number(customerId), items, total, timestamp: new Date().toISOString() };
  sales.push(s);
  res.status(201).json(s);
});

const port = process.env.PORT || 5000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on ${port}`);
});

