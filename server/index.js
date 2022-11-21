require("dotenv").config();

const helmet = require("helmet");
const cors = require("cors");
const express = require("express");
require("express-async-errors");
const http = require("http");

const authRoutes = require("./src/routes/auth.route");
const employeeRoutes = require("./src/routes/employee.route");
const { error } = require("./middleware");

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Authorization,Content-Type",
    origin: "http://localhost:5173",
  })
);
app.use(helmet());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (_, res) => {
  res.status(200).send({ message: "Hello World!" });
});

app.use("/api/v1", authRoutes);
app.use("/api/v1/employees", employeeRoutes);

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
