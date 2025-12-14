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
        image: "https://example.com/kaju-katli.jpg",
      });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe("Kaju Katli");
    expect(response.body.category).toBe("Indian");
    expect(response.body.price).toBe(500);
    expect(response.body.quantity).toBe(20);
    expect(response.body.image).toBe("https://example.com/kaju-katli.jpg");
  });

  it("should fail if user is not authenticated", async () => {
    const response = await request(app).post("/api/sweets").send({
      name: "Gulab Jamun",
      category: "Indian",
      price: 300,
      quantity: 10,
      image: "https://example.com/gulab-jamun.jpg",
    });

    expect(response.status).toBe(401);
  });

  it("should fail if price or quantity is negative", async () => {
    const response = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "Barfi",
        category: "Indian",
        price: -100,
        quantity: -5,
        image: "https://example.com/barfi.jpg",
      });

    expect(response.status).toBe(400);
  });

  it("should not allow creating sweet with same name twice", async () => {
    const payload = {
      name: "Kaju Katli",
      category: "Indian",
      price: 500,
      quantity: 20,
      image: "https://example.com/kaju-katli.jpg",
    };

    await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${userToken}`)
      .send(payload);

    const response = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${userToken}`)
      .send(payload);

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("Sweet already exists");
  });

  it("should not allow creating sweet with same name and same category", async () => {
    await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "Gulab Jamun",
        category: "Indian",
        price: 300,
        quantity: 10,
        image: "https://example.com/gulab-jamun.jpg",
      });

    const response = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "Gulab Jamun",
        category: "Indian",
        price: 350,
        quantity: 15,
        image: "https://example.com/gulab-jamun2.jpg",
      });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("Sweet already exists");
  });
});
