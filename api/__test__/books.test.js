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

describe('users', () => {
  const userExample = {
    email: "felipe@gmail.com",
    password: "12345678",
    username: "felipe"
  };  

  test("should register the user", async () => {
    const response = await supertest(app)
      .post(`/api/register`)
      .send(userExample);
    expect(response.statusCode).toBe(201);
  });

  test("should login the user", async () => {
    const { email, password} = userExample;
    const response = await supertest(app).post("/api/login")
      .send({ email, password });
    token = response.body.token;
    expect(response.statusCode).toBe(200);
  });

  test('should return 404 for email not found', async() => {
    const response = await supertest(app).post("/api/login")
      .send({ email: 'notfound@gmail.com', password: '123456' });
    expect(response.statusCode).toBe(404);
  });

})

describe("Books", () => {

  beforeAll(async () => {
    const user = {
      email: "admin@gmail.com",
      password: "12345678",
      username: "admin"
    };

    await supertest(app).post(`/api/register`).send(user);

    const { email, password} = user;
    const result = await supertest(app).post("/api/login").send({ email, password });
    token = result.body.token;
  });

  // User mock for register and login tests
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

  test('should upload a book cover', async () => {
    const { body: newBook } = await createBook();

    const response = await supertest(app).post(`/api/books/${newBook._id}/upload`)
      .set('Authorization', `Bearer ${token}`)
      .attach('image', __dirname + '/assets/azulejo.jpg');
    
    expect(response.statusCode).toBe(204);
  })

  afterAll(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.remove();
    }
  });
});
