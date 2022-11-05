require("dotenv").config();

const express = require("express");
const http = require("http");

const album = require("./modules/controllers/album.controller");

const app = express();
const server = http.createServer(app);

app.use(express.json());

app.get("/api/v1/", (_, res) => {
  const hello = {
    status: "OK",
    message: "Hello",
  };

  res.status(200).send(hello);
});

app.use("/api/v1/album", album);

app.get("*", (_, res) => {
  const notFound = {
    message: "Page not found!",
    status: "404",
  };

  res.status(404).send(notFound);
});

const port = process.env["PORT"] || 3000;
server.listen(port, () => {
  console.log("Listening on port ", port);
});

module.exports = server;
