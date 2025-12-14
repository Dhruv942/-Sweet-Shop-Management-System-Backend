import request from "supertest";
import app from "../../index";
import { User } from "../../models/user.model";
import { Sweet } from "../../models/sweet.model";

let adminToken: string;
let userToken: string;

beforeEach(async () => {
  await User.deleteMany({});
  await Sweet.deleteMany({});

  const adminRes = await request(app).post("/api/auth/register").send({
    email: process.env.ADMIN_EMAIL || "admin@example.com",
    password: process.env.ADMIN_PASSWORD || "admin123",
  });

  adminToken = adminRes.body.token;

  const userRes = await request(app).post("/api/auth/register").send({
    email: "user@delete.com",
    password: "password123",
  });

  userToken = userRes.body.token;
});

describe("DELETE /api/sweets/:id", () => {
  it("should delete a sweet when admin is authenticated", async () => {
    const sweet = await Sweet.create({
      name: "Kaju Katli",
      category: "Indian",
      price: 500,
      quantityInStock: 20,
      image: "https://example.com/kaju-katli.jpg",
    });

    const response = await request(app)
      .delete(`/api/sweets/${sweet._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Sweet deleted successfully");

    const deletedSweet = await Sweet.findById(sweet._id);
    expect(deletedSweet).toBeNull();
  });

  it("should fail if user is not authenticated", async () => {
    const sweet = await Sweet.create({
      name: "Gulab Jamun",
      category: "Indian",
      price: 300,
      quantityInStock: 15,
      image: "https://example.com/gulab-jamun.jpg",
    });

    const response = await request(app).delete(`/api/sweets/${sweet._id}`);

    expect(response.status).toBe(401);
  });

  it("should fail if regular user tries to delete", async () => {
    const sweet = await Sweet.create({
      name: "Barfi",
      category: "Indian",
      price: 400,
      quantityInStock: 30,
      image: "https://example.com/barfi.jpg",
    });

    const response = await request(app)
      .delete(`/api/sweets/${sweet._id}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Only admin can delete sweets");
  });

  it("should fail if sweet id is invalid", async () => {
    const response = await request(app)
      .delete("/api/sweets/invalid-id")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
  });

  it("should fail if sweet does not exist", async () => {
    const fakeId = "507f1f77bcf86cd799439011";
    const response = await request(app)
      .delete(`/api/sweets/${fakeId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
  });
});

