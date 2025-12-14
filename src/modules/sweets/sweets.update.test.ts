import request from "supertest";
import app from "../../index";
import { User } from "../../models/user.model";
import { Sweet } from "../../models/sweet.model";

let token: string;

beforeEach(async () => {
  await User.deleteMany({});
  await Sweet.deleteMany({});

  const res = await request(app).post("/api/auth/register").send({
    email: "update@sweets.com",
    password: "password123",
  });

  token = res.body.token;
});

describe("PUT /api/sweets/:id", () => {
  it("should update a sweet when user is authenticated", async () => {
    const sweet = await Sweet.create({
      name: "Kaju Katli",
      category: "Indian",
      price: 500,
      quantityInStock: 20,
      image: "https://example.com/kaju-katli.jpg",
    });

    const response = await request(app)
      .put(`/api/sweets/${sweet._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Kaju Katli Updated",
        category: "Indian",
        price: 600,
        quantity: 25,
        image: "https://example.com/kaju-katli-updated.jpg",
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Kaju Katli Updated");
    expect(response.body.category).toBe("Indian");
    expect(response.body.price).toBe(600);
    expect(response.body.quantity).toBe(25);
    expect(response.body.image).toBe(
      "https://example.com/kaju-katli-updated.jpg"
    );
  });

  it("should fail if user is not authenticated", async () => {
    const sweet = await Sweet.create({
      name: "Gulab Jamun",
      category: "Indian",
      price: 300,
      quantityInStock: 15,
      image: "https://example.com/gulab-jamun.jpg",
    });

    const response = await request(app).put(`/api/sweets/${sweet._id}`).send({
      name: "Gulab Jamun Updated",
      price: 350,
    });

    expect(response.status).toBe(401);
  });

  it("should fail if sweet id is invalid", async () => {
    const response = await request(app)
      .put("/api/sweets/invalid-id")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Sweet",
        price: 100,
      });

    expect(response.status).toBe(404);
  });

  it("should fail if price is negative", async () => {
    const sweet = await Sweet.create({
      name: "Barfi",
      category: "Indian",
      price: 400,
      quantityInStock: 30,
      image: "https://example.com/barfi.jpg",
    });

    const response = await request(app)
      .put(`/api/sweets/${sweet._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        price: -100,
      });

    expect(response.status).toBe(400);
  });

  it("should fail if quantity is negative", async () => {
    const sweet = await Sweet.create({
      name: "Ladoo",
      category: "Indian",
      price: 200,
      quantityInStock: 40,
      image: "https://example.com/ladoo.jpg",
    });

    const response = await request(app)
      .put(`/api/sweets/${sweet._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        quantity: -10,
      });

    expect(response.status).toBe(400);
  });

  it("should allow partial update - only price", async () => {
    const sweet = await Sweet.create({
      name: "Rasgulla",
      category: "Indian",
      price: 250,
      quantityInStock: 50,
      image: "https://example.com/rasgulla.jpg",
    });

    const response = await request(app)
      .put(`/api/sweets/${sweet._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        price: 300,
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Rasgulla");
    expect(response.body.price).toBe(300);
    expect(response.body.quantity).toBe(50);
  });

  it("should allow partial update - only quantity", async () => {
    const sweet = await Sweet.create({
      name: "Jalebi",
      category: "Indian",
      price: 150,
      quantityInStock: 60,
      image: "https://example.com/jalebi.jpg",
    });

    const response = await request(app)
      .put(`/api/sweets/${sweet._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        quantity: 75,
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Jalebi");
    expect(response.body.price).toBe(150);
    expect(response.body.quantity).toBe(75);
  });

  it("should allow partial update - only name", async () => {
    const sweet = await Sweet.create({
      name: "Halwa",
      category: "Indian",
      price: 350,
      quantityInStock: 35,
      image: "https://example.com/halwa.jpg",
    });

    const response = await request(app)
      .put(`/api/sweets/${sweet._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Halwa Updated",
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Halwa Updated");
    expect(response.body.price).toBe(350);
    expect(response.body.quantity).toBe(35);
  });
});
