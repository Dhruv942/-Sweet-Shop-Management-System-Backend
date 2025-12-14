import request from "supertest";
import app from "../../index";
import { User } from "../../models/user.model";
import { Sweet } from "../../models/sweet.model";

let userToken: string;

beforeEach(async () => {
  await User.deleteMany({});
  await Sweet.deleteMany({});

  const res = await request(app).post("/api/auth/register").send({
    email: "user@sweets.com",
    password: "password123",
  });

  userToken = res.body.token;
});

describe("POST /api/sweets - Create Sweet", () => {
  it("should create a sweet when user is authenticated", async () => {
    const response = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "Kaju Katli",
        category: "Indian",
        price: 500,
        quantity: 20,
      });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe("Kaju Katli");
    expect(response.body.category).toBe("Indian");
    expect(response.body.price).toBe(500);
    expect(response.body.quantity).toBe(20);
  });

  it("should fail if user is not authenticated", async () => {
    const response = await request(app).post("/api/sweets").send({
      name: "Gulab Jamun",
      category: "Indian",
      price: 300,
      quantity: 10,
    });

    expect(response.status).toBe(401);
  });
});
