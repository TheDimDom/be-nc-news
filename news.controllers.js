const { readTopics } = require("./news.models.js");

function getTopics(request, response, next) {
  const { slug } = request.query;
  const { description } = request.params;
  readTopics(slug, description)
    .then((topics) => {
      response.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  getTopics,
};
