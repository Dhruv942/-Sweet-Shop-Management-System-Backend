import request from "supertest";
import app from "../../index";
import { User } from "../../models/user.model";

beforeEach(async () => {
  await User.deleteMany({});
});

describe("Auth API - Login", () => {
  it("should login user with valid credentials and return JWT token", async () => {
    await request(app).post("/api/auth/register").send({
      email: "login@test.com",
      password: "password123",
    });

    const response = await request(app).post("/api/auth/login").send({
      email: "login@test.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(response.body).toHaveProperty("token");
    expect(response.body.user.email).toBe("login@test.com");
    expect(response.body.user.password).toBeUndefined();
  });

  it("should fail login with wrong password", async () => {
    await request(app).post("/api/auth/register").send({
      email: "wrongpass@test.com",
      password: "password123",
    });

    const response = await request(app).post("/api/auth/login").send({
      email: "wrongpass@test.com",
      password: "wrongpassword",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");
  });

  it("should fail login for non-existing user", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "nouser@test.com",
      password: "password123",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");
  });
});
