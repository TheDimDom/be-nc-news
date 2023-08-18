const app = require("../app.js");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const connection = require("../db/connection.js");
const jsonEndpoints = require("../endpoints.json");
const { readAllArticles } = require("../news.models");
const jestSorted = require("jest-sorted");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return connection.end();
});

describe("/api/topics", () => {
  test("200: /api/topics GET request", () => {
    return request(app).get("/api/topics").expect(200);
  });
  test("200: check that objects in array have correct properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const topics = response.body;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
});

describe("/api", () => {
  test("200: /api returns the correct JSON file", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(jsonEndpoints);
      });
  });
});

describe("api/articles/:article_id", () => {
  test("200: making sure it returns an article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((article) => {
        expect(article.body).toHaveProperty(["author"]);
        expect(article.body).toHaveProperty(["title"]);
        expect(article.body).toHaveProperty(["article_id"]);
        expect(article.body).toHaveProperty(["body"]);
        expect(article.body).toHaveProperty(["topic"]);
        expect(article.body).toHaveProperty(["created_at"]);
        expect(article.body).toHaveProperty(["votes"]);
        expect(article.body).toHaveProperty(["article_img_url"]);
      });
  });
  test("200: making sure it returns the correct article", () => {
    const articleId = 1;
    return request(app)
      .get(`/api/articles/${articleId}`)
      .expect(200)
      .then((article) => {
        expect(article.body.article_id).toBe(articleId);
      });
  });

  test("404: checks for bad request with article_id = 5000", () => {
    return request(app)
      .get("/api/articles/5000")
      .expect(404)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Not Found" });
      });
  });

  test("400: wrong data type", () => {
    return request(app)
      .get("/api/articles/hello")
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Bad Request" });
      });
  });
});

describe("/api/articles", () => {
  test("200: returns articles ordered by created_at in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body;
        expect(articles.length).toBeGreaterThan(0);
        expect(articles).toBeSorted({ descending: true });
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: adds a comment to an article", () => {
    const newComment = {
      username: "icellusedkars",
      body: "This is a test comment.",
    };
    const articleId = 1;
    return request(app)
      .post(`/api/articles/${articleId}/comments`)
      .send(newComment)
      .expect(201)
      .then((response) => {
        const addedComment = response.body;
        expect(addedComment).toHaveProperty("comment_id");
        expect(addedComment).toHaveProperty("author", newComment.username);
        expect(addedComment).toHaveProperty("body", newComment.body);
        expect(addedComment).toHaveProperty("article_id", 1);
        expect(addedComment).toHaveProperty("created_at");
        expect(addedComment).toHaveProperty("votes", 0);
      });
  });
  test("201: ignores extra property", () => {
    const newComment = {
      username: "icellusedkars",
      body: "This is a test comment.",
      foo: "Unnecessary Property",
    };
    const articleId = 1;
    return request(app)
      .post(`/api/articles/${articleId}/comments`)
      .send(newComment)
      .expect(201)
      .then((response) => {
        const addedComment = response.body;
        expect(addedComment).not.toHaveProperty("foo");
      });
  });
  test("400: wrong data type", () => {
    const articleId = "hello";
    return request(app)
      .post(`/api/articles/${articleId}/comments`)
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Bad Request" });
      });
  });
  test("400: missing required fields", () => {
    const newComment = {
      username: "",
      body: "",
    };
    const articleId = 1;
    return request(app)
      .post(`/api/articles/${articleId}/comments`)
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Bad Request" });
      });
  });
  test("401: uses incorrect username", () => {
    const newComment = {
      username: "testuser",
      body: "This is a test comment.",
    };
    const articleId = 1;
    return request(app)
      .post(`/api/articles/${articleId}/comments`)
      .send(newComment)
      .expect(401)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Unauthorised User" });
      });
  });
  test("400: uses incorrect username", () => {
    const newComment = {
      username: "testuser",
    };
    const articleId = 1;
    return request(app)
      .post(`/api/articles/${articleId}/comments`)
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Bad Request" });
      });
  });
  test("404: checks for bad request with article_id = 5000", () => {
    const newComment = {
      username: "icellusedkars",
      body: "This is a test comment.",
    };

    const articleId = 5000;
    return request(app)
      .post(`/api/articles/${articleId}/comments`)
      .send(newComment);
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("200: check length and comment property", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body;
        expect(comments.length).toBeGreaterThan(0);
        expect(comments).toBeSorted({ descending: true });
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment.article_id).toBe(1);
        });
      });
  });
  test("200: returns empty array if no comment", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body;
        expect(comments).toEqual([]);
      });
  });
  test("404: checks for bad request with article_id = 5000", () => {
    return request(app)
      .get("/api/articles/5000/comments")
      .expect(404)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Not Found" });
      });
  });
  test("400: wrong data type", () => {
    return request(app)
      .get("/api/articles/hello/comments")
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Bad Request" });
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("200: updates article votes and responds with updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 5 })
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty("votes", 105);
      });
  });
  test("200: updates article votes and responds with updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -5 })
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty("votes", 95);
      });
  });
  test("200: ignores additional key", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -5, foo: 10 })
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty("votes", 95);
      });
  });
  test("200: responds with original vote value when passed 0", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 0 })
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty("votes", 100);
      });
  });
  test("400: wrong inc_votes data type", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "hello" })
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Invalid inc_votes value" });
      });
  });
  test("400: wrong article_id data type", () => {
    return request(app)
      .patch("/api/articles/hello")
      .send({ inc_votes: 10 })
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Bad Request" });
      });
  });
  test("400: checks for relevant key", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Bad Request" });
      });
  });
  test("404: checks for bad request with article_id = 5000", () => {
    return request(app)
      .patch("/api/articles/5000")
      .send({ inc_votes: 10 })
      .expect(404)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Not Found" });
      });
  });
});
