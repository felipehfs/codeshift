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

     test("should reset the password", async () => {
      const user = { 
        email: 'evandro@gmail.com', 
        password: '123456789', 
        username: 'evandro'
      };
      await supertest(app).post('/api/register').send(user);
      const response = await supertest(app)
        .post(`/api/users/reset`).send({
          email: user.email,
          oldPassword: user.password,
          newPassword: '12233334444'
        });
      expect(response.statusCode).toBe(204);
    }) 
  
    test('should return 404 for email not found', async() => {
      const response = await supertest(app).post("/api/login")
        .send({ email: 'notfound@gmail.com', password: '123456' });
      expect(response.statusCode).toBe(404);
    });
  
    test("should email be unique", async () => {
      const userCredentials = {
        email: 'felipehfsouza@gmail.com',
        username: 'felipehfs',
        password: '12345678'
      };

      await supertest(app).post("/api/register")
        .send(userCredentials);
      
      const response = await supertest(app).post('/api/register')
        .send(userCredentials);

      expect(response.statusCode).toBe(400);
    });
  })