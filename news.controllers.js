const {
  readTopics,
  readArticleById,
  readAllArticles,
  readCommentsByArticleId,
  createComment,
  readUsers,
  deleteCommentByCommentId,
  updateArticleVotes,
} = require("./news.models.js");
const endpointsJson = require("./endpoints.json");

function getTopics(request, response, next) {
  readTopics()
    .then((topics) => {
      response.status(200).send(topics);
    })
    .catch((err) => {
      next(err);
    });
}

function getEndpoints(request, response, next) {
  return Promise.resolve(endpointsJson)
    .then((endpoints) => {
      response.status(200).send(endpoints);
    })
    .catch((err) => {
      next(err);
    });
}

function getArticleById(request, response, next) {
  const { article_id } = request.params;
  readArticleById(article_id)
    .then((article) => {
      response.status(200).send(article);
    })
    .catch((err) => {
      next(err);
    });
}

function getAllArticles(request, response, next) {
  readAllArticles()
    .then((articles) => {
      response.status(200).send(articles);
    })
    .catch((err) => {
      next(err);
    });
}

function postNewComment(request, response, next) {
  const { article_id } = request.params;
  const { username, body } = request.body;
  createComment(article_id, username, body)
    .then((comment) => {
      response.status(201).send(comment);
    })
    .catch((err) => {
      next(err);
    });
}
function getCommentsByArticleId(request, response, next) {
  const { article_id } = request.params;
  const { inc_votes } = request.body;
  readCommentsByArticleId(article_id, inc_votes)
    .then((comments) => {
      response.status(200).send(comments);
    })
    .catch((err) => {
      next(err);
    });
}

function updateArticle(request, response, next) {
  const { article_id } = request.params;
  const { inc_votes } = request.body;
  updateArticleVotes(article_id, inc_votes)
    .then((updatedArticle) => {
      response.status(200).send(updatedArticle);
    })
    .catch((err) => {
      next(err);
    });
}

function deleteComment(request, response, next) {
  const { comment_id } = request.params;
  deleteCommentByCommentId(comment_id)
    .then(() => {
      response.status(204).send({});
    })
    .catch((err) => {
      next(err);
    });
}

function getUsers(request, response, next) {
  readUsers().then((users) => {
    response.status(200).send(users);
  });
}

module.exports = {
  getTopics,
  getEndpoints,
  getArticleById,
  getAllArticles,
  postNewComment,
  getCommentsByArticleId,
  getUsers,
  deleteComment,
  updateArticle,
};
