const path = require("path");
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({ origin: true }));

// app.use("/auth", require("./auth"));
app.get("/hello-world", (req, res) => {
  return res.status(200).send("Hello World!");
});
app.use("/api", require("./api"));

// static file-serving middleware
app.use(express.static(path.join(__dirname, "..", "public")));

// any remaining requests with an extension (.js, .css, etc.) send 404
app.use((req, res, next) => {
  if (path.extname(req.path).length) {
    const err = new Error("Not found");
    err.status = 404;
    return next(err);
  } else {
    return next();
  }
});

// error handling endware
app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || "Internal server error.");
});

exports.app = functions.https.onRequest(app);
