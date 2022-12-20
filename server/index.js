require("dotenv").config();
process.env["NODE_CONFIG_DIR"] = require("path").join(__dirname, "config/");

const config = require("config");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const express = require("express");
require("express-async-errors");
const http = require("http");

const authRoutes = require("./src/routes/auth.route");
const orderRoutes = require("./src/routes/order.route");
const categoryRoutes = require("./src/routes/categories.route");
const stockRoutes = require("./src/routes/stock.route");
const employeeRoutes = require("./src/routes/employee.route");
const supplierRoutes = require("./src/routes/supplier.route");
const productRoutes = require("./src/routes/product.route");

const { error } = require("./src/middleware");

const app = express();
const server = http.createServer(app);

app.use(cors({ ...config.get("cors") }));
app.use(helmet());
app.use(compression());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (_, res) => {
  res.status(200).send({ message: "Hello World!" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/employees", employeeRoutes);
app.use("/api/v1/suppliers", supplierRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/stock", stockRoutes);

app.use("*", (_, res) => {
  res.status(404).send({ message: "Resource not found!" });
});

app.use(error);

process.on("uncaughtException", (error) => {
  console.log("[UNCAUGHT EXCEPTION]", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.log("[UNHANDLED REJECTION - REASON]", reason);
  console.log("[UNHANDLED REJECTION - PROMISE]", promise);
  process.exit(1);
});

const port = process.env["PORT"] || 3000;
server.listen(port, () => {
  console.log("Listening on port ", port);
});

module.exports = server;
