import request from "supertest";
import app from "../../index";
import { User } from "../../models/user.model";
import { Sweet } from "../../models/sweet.model";

let userToken: string;

beforeEach(async () => {
  await User.deleteMany({});
  await Sweet.deleteMany({});

  const res = await request(app).post("/api/auth/register").send({
    email: "purchase@test.com",
    password: "password123",
  });

  userToken = res.body.token;
});

describe("POST /api/sweets/:id/purchase", () => {
  it("should purchase a sweet and decrease quantity when user is authenticated", async () => {
    const sweet = await Sweet.create({
      name: "Kaju Katli",
      category: "Indian",
      price: 500,
      quantityInStock: 20,
      image: "https://example.com/kaju-katli.jpg",
    });

    const response = await request(app)
      .post(`/api/sweets/${sweet._id}/purchase`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        quantity: 5,
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Purchase successful");
    expect(response.body.sweet.quantity).toBe(15);

    const updatedSweet = await Sweet.findById(sweet._id);
    expect(updatedSweet?.quantityInStock).toBe(15);
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
      .post(`/api/sweets/${sweet._id}/purchase`)
      .send({
        quantity: 3,
      });

    expect(response.status).toBe(401);
  });

  it("should fail if sweet id is invalid", async () => {
    const response = await request(app)
      .post("/api/sweets/invalid-id/purchase")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        quantity: 5,
      });

    expect(response.status).toBe(404);
  });

  it("should fail if sweet does not exist", async () => {
    const fakeId = "507f1f77bcf86cd799439011";
    const response = await request(app)
      .post(`/api/sweets/${fakeId}/purchase`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        quantity: 5,
      });

    expect(response.status).toBe(404);
  });

  it("should fail if quantity is not provided", async () => {
    const sweet = await Sweet.create({
      name: "Barfi",
      category: "Indian",
      price: 400,
      quantityInStock: 30,
      image: "https://example.com/barfi.jpg",
    });

    const response = await request(app)
      .post(`/api/sweets/${sweet._id}/purchase`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({});

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
      .post(`/api/sweets/${sweet._id}/purchase`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        quantity: -5,
      });

    expect(response.status).toBe(400);
  });

  it("should fail if quantity exceeds available stock", async () => {
    const sweet = await Sweet.create({
      name: "Rasgulla",
      category: "Indian",
      price: 250,
      quantityInStock: 10,
      image: "https://example.com/rasgulla.jpg",
    });

    const response = await request(app)
      .post(`/api/sweets/${sweet._id}/purchase`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        quantity: 15,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Insufficient stock");
  });

  it("should allow purchasing all available stock", async () => {
    const sweet = await Sweet.create({
      name: "Jalebi",
      category: "Indian",
      price: 150,
      quantityInStock: 5,
      image: "https://example.com/jalebi.jpg",
    });

    const response = await request(app)
      .post(`/api/sweets/${sweet._id}/purchase`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        quantity: 5,
      });

    expect(response.status).toBe(200);
    expect(response.body.sweet.quantity).toBe(0);

    const updatedSweet = await Sweet.findById(sweet._id);
    expect(updatedSweet?.quantityInStock).toBe(0);
  });
});
