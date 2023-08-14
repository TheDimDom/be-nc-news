const express = require("express");
const app = express();
const { getTopics } = require("./news.controllers");


app.get("/api/topics", getTopics);

app.use((err, request, response, next) => {
  response.status(500).send({ msg: "err" });
});

module.exports = app;
