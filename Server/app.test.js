const request = require("supertest");
const app = require("./server");

describe("Get all complaints", () => {
  it("Should get all complants", async () => {
    await request(app)
      .get("/getcomplaints/filed")
      .expect("Content-Type", /json/)
      .expect(201);
  });
});


// describe("Test example", () => {
//   test("GET /", (done) => {
//     request(app)
//       .get("/")
//       .expect("Content-Type", /json/)
//       .expect(200)
//       .expect((res) => {
//         res.body.data.length = 1;
//       })
//       .end((err, res) => {
//         if (err) return done(err);
//         return done();
//       });
//   });

//   test("POST /send", (done) => {
//     request(app)
//       .post("/send")
//       .expect("Content-Type", /json/)
//       .send({
//         email: "francisco@example.com",
//       })
//       .expect(201)
//       .expect((res) => {
//         res.body.data.length = 2;
//       })
//       .end((err, res) => {
//         if (err) return done(err);
//         elementId = res.body.data[1].id;
//         return done();
//       });
//   });

//   test("PUT /update/:id", (done) => {
//     request(app)
//       .put(`/update/${elementId}`)
//       .expect("Content-Type", /json/)
//       .send({
//         email: "mendes@example.com",
//       })
//       .expect(200)
//       .expect((res) => {
//         res.body.data.length = 2;
//       })
//       .end((err, res) => {
//         if (err) return done(err);
//         return done();
//       });
//   });

//   test("DELETE /destroy/:id", (done) => {
//     request(app)
//       .delete(`/destroy/${elementId}`)
//       .expect("Content-Type", /json/)
//       .expect(200)
//       .expect((res) => {
//         res.body.data.length = 1;
//       })
//       .end((err, res) => {
//         if (err) return done(err);
//         return done();
//       });
//   });
// });