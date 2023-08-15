const db = require("./db/connection.js");
const format = require("pg-format");
const endpointsJson = require("./endpoints.json");

const readTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
};

const readEndpoints = () => {
  return Promise.resolve(endpointsJson);
};

module.exports = { readTopics, readEndpoints };
