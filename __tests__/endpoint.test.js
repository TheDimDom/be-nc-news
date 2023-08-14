const app = require("../app.js");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const connection = require("../db/connection.js");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return connection.end();
});

describe("testing get requests", () => {
  test("200: /api/topics", () => {
    return request(app).get("/api/topics").expect(200);
  });
});
