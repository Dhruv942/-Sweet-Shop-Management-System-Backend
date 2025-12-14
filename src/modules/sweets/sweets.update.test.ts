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
});
