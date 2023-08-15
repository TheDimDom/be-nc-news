const { readTopics, readArticleById } = require("./news.models.js");
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

  if (isNaN(article_id) || article_id <= 0) {
    return next({ status: 400, msg: "Bad request" });
  }
  readArticleById(article_id)
    .then((article) => {
      if (!article) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      response.status(200).send(article);
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  getTopics,
  getEndpoints,
  getArticleById,
};
