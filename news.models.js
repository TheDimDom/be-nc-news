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
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else {
        return rows[0];
      }
    });
};

const readAllArticles = () => {
  return db
    .query(
      `
      SELECT 
        articles.author,
        articles.title,
        articles.article_id,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COUNT(comments.comment_id) AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC;
    `
    )
    .then(({ rows }) => {
      return rows;
    });
};

const createComment = (article_id, username, body) => {
  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article Not Found" });
      } else {
        return db.query(
          "INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *",
          [article_id, username, body]
        );
      }
    })
    .then(({ rows }) => {
      const addedComment = {
        comment_id: rows[0].comment_id,
        author: rows[0].author,
        body: rows[0].body,
        article_id: rows[0].article_id,
        created_at: rows[0].created_at,
        votes: rows[0].votes,
      };
      return addedComment;
    });
};


module.exports = {
  readTopics,
  readArticleById,
  readAllArticles,
  createComment,
};
