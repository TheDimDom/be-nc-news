const db = require("./db/connection.js");
const format = require("pg-format");

const readTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
};

const readArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      return rows[0];
    });
};

module.exports = { readTopics, readArticleById };
