const supertest = require("supertest");
const app = require("../config/express");

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