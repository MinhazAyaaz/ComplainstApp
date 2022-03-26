const request = require("supertest");
const { response } = require("./server");
const app = require('./server');

var token = null;

describe("Testing Login POST", () => {
 it("Should post login", async () => {
   await request(app)
     .post("/login")
     .set('Content-Type',  'application/json')
     .send({ nsuid: "1931672642", password: "minhazabedin1" })
     .expect("Content-Type", /json/)
     .expect(200)
     .expect(function(res) {
      console.log(res.body.accessToken)
      token = res.body.accessToken;
    })
 });
});

describe("Get all users", () => {
  it("Should get all users", async () => {
    await request(app)
      .get("/users")
      .set('x-access-token',token)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(function(res) {
        console.log(res.body)
      })
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