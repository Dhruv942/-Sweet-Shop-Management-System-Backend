import request from "supertest";
import app from "../../index";
import { User } from "../../models/user.model";
import { Sweet } from "../../models/sweet.model";

let adminToken: string;
let userToken: string;

beforeEach(async () => {
  await User.deleteMany({});
  await Sweet.deleteMany({});

  const adminRes = await request(app)
    .post("/api/auth/register")
    .send({
      email: process.env.ADMIN_EMAIL || "admin@example.com",
      password: process.env.ADMIN_PASSWORD || "admin123",
    });

  adminToken = adminRes.body.token;

  const userRes = await request(app).post("/api/auth/register").send({
    email: "user@restock.com",
    password: "password123",
  });

  userToken = userRes.body.token;
});

describe("POST /api/sweets/:id/restock", () => {
  it("should restock a sweet and increase quantity when admin is authenticated", async () => {
    const sweet = await Sweet.create({
      name: "Kaju Katli",
      category: "Indian",
      price: 500,
      quantityInStock: 20,
      image: "https://example.com/kaju-katli.jpg",
    });

    const response = await request(app)
      .post(`/api/sweets/${sweet._id}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        quantity: 10,
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Restock successful");
    expect(response.body.sweet.quantity).toBe(30);

    const updatedSweet = await Sweet.findById(sweet._id);
    expect(updatedSweet?.quantityInStock).toBe(30);
  });

  it("should fail if user is not authenticated", async () => {
    const sweet = await Sweet.create({
      name: "Gulab Jamun",
      category: "Indian",
      price: 300,
      quantityInStock: 15,
      image: "https://example.com/gulab-jamun.jpg",
    });

    const response = await request(app)
      .post(`/api/sweets/${sweet._id}/restock`)
      .send({
        quantity: 5,
      });

    expect(response.status).toBe(401);
  });

  it("should fail if regular user tries to restock", async () => {
    const sweet = await Sweet.create({
      name: "Barfi",
      category: "Indian",
      price: 400,
      quantityInStock: 30,
      image: "https://example.com/barfi.jpg",
    });

    const response = await request(app)
      .post(`/api/sweets/${sweet._id}/restock`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        quantity: 10,
      });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Only admin can restock sweets");
  });

  it("should fail if sweet id is invalid", async () => {
    const response = await request(app)
      .post("/api/sweets/invalid-id/restock")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        quantity: 10,
      });

    expect(response.status).toBe(404);
  });

  it("should fail if sweet does not exist", async () => {
    const fakeId = "507f1f77bcf86cd799439011";
    const response = await request(app)
      .post(`/api/sweets/${fakeId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        quantity: 10,
      });

    expect(response.status).toBe(404);
  });

  it("should fail if quantity is not provided", async () => {
    const sweet = await Sweet.create({
      name: "Ladoo",
      category: "Indian",
      price: 200,
      quantityInStock: 40,
      image: "https://example.com/ladoo.jpg",
    });

    const response = await request(app)
      .post(`/api/sweets/${sweet._id}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    expect(response.status).toBe(400);
  });

  it("should fail if quantity is negative", async () => {
    const sweet = await Sweet.create({
      name: "Rasgulla",
      category: "Indian",
      price: 250,
      quantityInStock: 50,
      image: "https://example.com/rasgulla.jpg",
    });

    const response = await request(app)
      .post(`/api/sweets/${sweet._id}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        quantity: -10,
      });

    expect(response.status).toBe(400);
  });

  it("should fail if quantity is zero", async () => {
    const sweet = await Sweet.create({
      name: "Jalebi",
      category: "Indian",
      price: 150,
      quantityInStock: 60,
      image: "https://example.com/jalebi.jpg",
    });

    const response = await request(app)
      .post(`/api/sweets/${sweet._id}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        quantity: 0,
      });

    expect(response.status).toBe(400);
  });

  it("should allow restocking multiple times", async () => {
    const sweet = await Sweet.create({
      name: "Halwa",
      category: "Indian",
      price: 350,
      quantityInStock: 10,
      image: "https://example.com/halwa.jpg",
    });

    await request(app)
      .post(`/api/sweets/${sweet._id}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        quantity: 5,
      });

    const response = await request(app)
      .post(`/api/sweets/${sweet._id}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        quantity: 10,
      });

    expect(response.status).toBe(200);
    expect(response.body.sweet.quantity).toBe(25);

    const updatedSweet = await Sweet.findById(sweet._id);
    expect(updatedSweet?.quantityInStock).toBe(25);
  });
});
