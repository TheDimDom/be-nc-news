const db = require("./db/connection.js");

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

const validTopics = ["mitch", "cats", "paper"];

const validSortColumns = [
  "author",
  "title",
  "article_id",
  "topic",
  "created_at",
  "votes",
];

const readAllArticles = (topic, sort_by = "created_at", order = "desc") => {
  if (!validSortColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort_by column" });
  }
  if (!["asc", "desc"].includes(order)) {
    return Promise.reject({
      status: 400,
      msg: "Order must be 'asc' or 'desc'",
    });
  }
  if (topic) {
    return db.query(
      "SELECT * FROM articles WHERE topic = $1 ORDER BY " +
        sort_by +
        " " +
        order,
      [topic]
    );
  }
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
      ORDER BY ` +
        sort_by +
        ` ` +
        order +
        `;
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
      return rows[0];
    });
};

const readCommentsByArticleId = (article_id) => {
  return db
    .query(
      "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC",
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return db
          .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
          .then(({ rows: articleRows }) => {
            if (articleRows.length === 0) {
              return Promise.reject({ status: 404, msg: "Not Found" });
            } else {
              return [];
            }
          });
      } else {
        return rows;
      }
    });
};

const deleteCommentByCommentId = (comment_id) => {
  return db
    .query("SELECT * FROM comments WHERE comment_id =$1", [comment_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return db
        .query("DELETE FROM comments WHERE comment_id = $1", [comment_id])
        .then(() => {
          return Promise.resolve({ status: 204 });
        });
    });
};

const updateArticleVotes = (article_id, inc_votes) => {
  if (inc_votes === undefined) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  } else {
    if (typeof inc_votes !== "number") {
      return Promise.reject({ status: 400, msg: "Invalid inc_votes value" });
    }
    return db
      .query(
        "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *",
        [inc_votes, article_id]
      )
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ status: 404, msg: "Article Not Found" });
        }
        return rows[0];
      });
  }
};

const readUsers = () => {
  return db.query("SELECT * FROM users").then(({ rows }) => {
    return rows;
  });
};

module.exports = {
  readTopics,
  readArticleById,
  readAllArticles,
  createComment,
  readCommentsByArticleId,
  readUsers,
  deleteCommentByCommentId,
  updateArticleVotes,
};
