process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");

let data = [
  { name: "item1", price: 1 },
  { name: "item2", price: 2 },
  { name: "item3", price: 3 },
];

beforeEach(() => {
  data.forEach((item) => items.push(item));
});

afterEach(() => {
  items.length = 0;
});

// GET Routes
describe("GET /items", () => {
  test("Gets a list of all items", async () => {
    const resp = await request(app).get("/items");

    expect(resp.statusCode).toBe(200);
    expect(resp.body.items).toEqual(data);
  });
});

describe("GET /items/:name", () => {
  test("Gets a single cat", async () => {
    const resp = await request(app).get(`/items/${data[1].name}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.foundItem).toEqual(data[1]);
  });

  test("Responds with 404 if not found", async () => {
    const resp = await request(app).get(`/items/invalid`);
    expect(resp.statusCode).toBe(404);
    console.log(resp.body);
  });
});

// POST route
describe("POST /items", () => {
  test("Creates a new item", async () => {
    const resp = await request(app).post("/items").send({
      name: "item4",
      price: 4,
    });
    expect(resp.statusCode).toBe(201);
    expect(resp.body.added).toEqual({ name: "item4", price: 4 });
  });
});

// PACTH route
describe("PATCH /items/:name", () => {
  test("Updates a single item", async () => {
    const resp = await request(app)
      .patch(`/items/${data[0].name}`)
      .send({ name: "itemUpdated", price: 100 });
    expect(resp.statusCode).toBe(200);
    expect(resp.body.updated).toEqual({ name: "itemUpdated", price: 100 });
  });
});

// DELETE route
describe("DELETE /items/:name", () => {
  test("Deletes a single item", async () => {
    const resp = await request(app).delete(`/items/${data[2].name}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ message: "Deleted" });
  });
});
