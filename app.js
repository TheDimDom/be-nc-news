const express = require("express");
const cors = require('cors');
const app = express();
const {
  getTopics,
  getEndpoints,
  getArticleById,
  getAllArticles,
  getCommentsByArticleId,
  postNewComment,
  getUsers,
  deleteComment,
  updateArticle,
} = require("./news.controllers");
const { handle400s, handleCustomErrors } = require("./error.controllers.js");

app.use(cors());

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postNewComment);

app.patch("/api/articles/:article_id", updateArticle);

app.delete("/api/comments/:comment_id", deleteComment)

app.get("/api/users", getUsers);

app.use(handle400s);

app.use(handleCustomErrors);

app.use((err, request, response, next) => {
  response.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
