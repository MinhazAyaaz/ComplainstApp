const request = require("supertest");
const app = require('./server');

describe("Testing /api", () => {

   var token = null;

   beforeEach(async () => {
    request(app)
      .post('/user/token')
      .send({ id: "1931461642", password: "$2b$10$Bl3/Qbhw58E1QJQ7tEw.veni5bvfD/mjXlpb2YyiUEdZ/E3JrYdTW" })
      .end(function(err, res) {
        token = res.body.token; // Or something    
      });
  });

  it("Should get response", async () => {
    await request(app)
      .get("/api")
      .set('Authorization', 'Bearer ' + token)
      .expect("Content-Type", /json/)
      .expect(200);
  });
});

describe("Get all users", () => {

  var token = null;
   beforeEach(async () => {
    request(app)
      .post('/login')
      .send({ id: "1931461642", password: "$2b$10$Bl3/Qbhw58E1QJQ7tEw.veni5bvfD/mjXlpb2YyiUEdZ/E3JrYdTW" })
      .end(function(err, res) {
        token = res.body.data.token;
      });
  });

  it("Should get all users", async () => {
    await request(app)
      .get("/users")
      .set('Authorization', 'Bearer ' + token)
      .expect("Content-Type", /json/)
      .expect(200);
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

// function loginUser(auth) {
//   return function(done) {
//       request
//           .post('/login')
//           .send({
//               email: 'emon331@gmail.com',
//               password: '$2b$10$Bl3/Qbhw58E1QJQ7tEw.veni5bvfD/mjXlpb2YyiUEdZ/E3JrYdTW'
//           })
//           .expect(502)
//           .end(onResponse);

//       function onResponse(err, res) {
//           auth.token = res.body.token;
//           return done();
//       }
//   };
// }