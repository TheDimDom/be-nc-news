const { readTopics, readEndpoints } = require("./news.models.js");
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

module.exports = {
  getTopics,
  getEndpoints,
};
