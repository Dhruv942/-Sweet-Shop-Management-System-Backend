import request from "supertest";
import app from "../../index";

describe("Auth API - Register", () => {
  it("should register a new user with email and password", async () => {
    const response = await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User registered successfully");
    expect(response.body.user.id).toBeDefined();
    expect(response.body.user).toBeDefined();
    expect(response.body.user.email).toBe("test@example.com");
    expect(response.body.user.password).toBeUndefined();
  });
});
