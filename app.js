const express = require("express");
const app = express();
const {
  getTopics,
  getEndpoints,
  getArticleById,
  getAllArticles,
  getCommentsByArticleId
} = require("./news.controllers");
const { handle400s, handleCustomErrors } = require("./error.controllers.js");


app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getAllArticles)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.use(handle400s);

app.use(handleCustomErrors)

app.use((err, request, response, next) => {
  response.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
