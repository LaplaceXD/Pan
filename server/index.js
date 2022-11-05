require("dotenv").config();

const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);

app.use(express.json());

app.get("/", (_, res) => {
  const hello = {
    status: "OK",
    message: "Hello",
  };

  res.status(200).send(hello);
});

app.get("*", (_, res) => {
  const notFound = {
    status: 404,
    message: "Resource not found!",
  };

  res.status(404).send(notFound);
});

const port = process.env["PORT"] || 3000;
server.listen(port, () => {
  console.log("Listening on port ", port);
});

module.exports = server;
