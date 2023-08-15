const express = require("express");
const app = express();
const { getTopics, getEndpoints, getArticleId } = require("./news.controllers");

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.use((err, request, response, next) => {
  response.status(500).send({ msg: "err" });
});

module.exports = app;
