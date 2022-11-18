require("dotenv").config();

const helmet = require("helmet");
const cors = require("cors");
const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(helmet());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (_, res) => {
  res.status(200).send({ error: false, status: 200, message: "Hello World!" });
});

app.use("*", (_, res) => {
  res.status(404).send({ error: true, status: 404, message: "Resource not found!" });
});

const port = process.env["PORT"] || 3000;
server.listen(port, () => {
  console.log("Listening on port ", port);
});

module.exports = server;
