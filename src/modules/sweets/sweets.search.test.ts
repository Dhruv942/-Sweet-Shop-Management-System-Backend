import request from "supertest";
import app from "../../index";
import { User } from "../../models/user.model";
import { Sweet } from "../../models/sweet.model";

let token: string;

beforeEach(async () => {
  await User.deleteMany({});
  await Sweet.deleteMany({});

  const res = await request(app).post("/api/auth/register").send({
    email: "search@sweets.com",
    password: "password123",
  });

  token = res.body.token;
});

describe("GET /api/sweets/search", () => {
  it("should return empty list when no sweets exist", async () => {
    const response = await request(app)
      .get("/api/sweets/search")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });

  it("should return list of sweets when search query is provided", async () => {
    await Sweet.create([
      {
        name: "Kaju Katli",
        category: "Indian",
        price: 500,
        quantityInStock: 20,
        image: "https://example.com/kaju-katli.jpg",
      },
      {
        name: "Gulab Jamun",
        category: "Indian",
        price: 300,
        quantityInStock: 15,
        image: "https://example.com/gulab-jamun.jpg",
      },
    ]);

    const response = await request(app)
      .get("/api/sweets/search?query=kaju")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toHaveProperty("name");
    expect(response.body[0]).toHaveProperty("category");
    expect(response.body[0]).toHaveProperty("price");
    expect(response.body[0]).toHaveProperty("quantity");
    expect(response.body[0]).toHaveProperty("image");
  });

  it("should return list of sweets when searched by price", async () => {
    await Sweet.create([
      {
        name: "Kaju Katli",
        category: "Indian",
        price: 500,
        quantityInStock: 20,
        image: "https://example.com/kaju-katli.jpg",
      },
      {
        name: "Gulab Jamun",
        category: "Indian",
        price: 300,
        quantityInStock: 15,
        image: "https://example.com/gulab-jamun.jpg",
      },
      {
        name: "Barfi",
        category: "Indian",
        price: 500,
        quantityInStock: 25,
        image: "https://example.com/barfi.jpg",
      },
    ]);

    const response = await request(app)
      .get("/api/sweets/search?query=500")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
    expect(response.body[0].price).toBe(500);
    expect(response.body[1].price).toBe(500);
  });
});
