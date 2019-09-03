const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../config/express");
let token = null;

async function createBook() {
  const creationRequest = await supertest(app)
    .post("/api/books")
    .send({
      name: "teste$56",
      isbn: "fserereuirea-11102",
      slugs: ["aa", "bb"],
      price: 18.32,
      quantity: 6
    })
    .set("Authorization", `Bearer ${token}`);
  return creationRequest;
}

describe("App", () => {
  test("should register the user", async () => {
    const response = await supertest(app)
      .post(`/api/register`)
      .send({
        email: "felipe@gmail.com",
        password: "12345678",
        username: "felipe"
      });
    expect(response.statusCode).toBe(201);
  });

  test("should login the user", async () => {
    const response = await supertest(app)
      .post("/api/login")
      .send({ email: "felipe@gmail.com", password: "12345678" });
    token = response.body.token;
    expect(response.statusCode).toBe(200);
  });

  test("only authorizated user can see books", async () => {
    const response = await supertest(app).get("/api/books");
    expect(response.statusCode).toBe(401);
  });

  test("should list all book", async () => {
    const response = await supertest(app)
      .get("/api/books")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });

  test("only authorizated user can create books", async () => {
    const response = await supertest(app).post("/api/books");
    expect(response.statusCode).toBe(401);
  });

  test("should insert new book", async () => {
    const response = await createBook();
    expect(response.statusCode).toBe(201);
  });

  test("should update book", async () => {
    const { body: newBook } = await createBook();

    const response = await supertest(app)
      .put(`/api/books/${newBook._id}`)
      .send({
        name: "teste$56& updated",
        isbn: "fserer#uirea-11102",
        slugs: ["aa", "bb"],
        price: 18.32,
        quantity: 6
      })
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });

  test("only authorizated user can update the books", async () => {
    const { body: newBook } = await createBook();
    const response = await supertest(app).put(`/api/books/${newBook._id}`);
    expect(response.statusCode).toBe(401);
  });

  test("should remove a book", async () => {
    const { body: newBook } = await createBook();

    const response = await supertest(app)
      .delete(`/api/books/${newBook._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(204);
  });

  test("only authorizated user can update the books", async () => {
    const { body: newBook } = await createBook();
    const response = await supertest(app).put(`/api/books/${newBook._id}`);
    expect(response.statusCode).toBe(401);
  });

  afterAll(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.remove();
    }
  });
});
