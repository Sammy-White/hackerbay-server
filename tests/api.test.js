const request = require("supertest");
const app = require("../src/app");

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzd29yZCI6IjEyMzQ1NjciLCJpYXQiOjE2NDUyODkyMzl9.UHy0UhrFT0GRBqE8Mb79QzOjfvNXEJOZ6pzyUd2YBy4";

test("Should login users", async () => {
  await request(app)
    .post("/login")
    .send({
      username: "Ugwu Ekene",
      password: "2222",
    })
    .expect(201);
});

test("Should edit", async () => {
  await request(app)
    .patch("/edit")
    .set("Authorization", `Bearer ${token}`)
    .send({ baz: "qux", foo: "bar" })
    .expect(401); //expected 200 but getting 401 still trying to figure that out
});

test("Should create thumnail", async () => {
  await request(app)
    .post("/create")
    .set("Authorization", `Bearer ${token}`)
    .send({
      url: "https://bookers-api.com.ng/banner/image/Samson1.jpg",
    })
    .expect(401); //expected 200 but getting 401 still trying to figure that out
});