const request = require("supertest");
const { response } = require("./server");
const app = require('./server');

var token = null;

describe("Testing /login endpoint", () => {

  it("User not found!", async () => {
    await request(app)
      .post("/login")
      .set('Content-Type',  'application/json')
      .send({ nsuid: "1931671642", password: "minhazabedin1" })
      .expect("Content-Type", /json/)
      .expect(404)
  });

  it("Password is Invalid!", async () => {
    await request(app)
      .post("/login")
      .set('Content-Type',  'application/json')
      .send({ nsuid: "1931672642", password: "minhaz" })
      .expect("Content-Type", /json/)
      .expect(401)
  });

  it("User not verified!", async () => {
    await request(app)
      .post("/login")
      .set('Content-Type',  'application/json')
      .send({ nsuid: "1931672642", password: "minhaz" })
      .expect("Content-Type", /json/)
      .expect(512)
  });

  it("Login successful!", async () => {
   await request(app)
     .post("/login")
     .set('Content-Type',  'application/json')
     .send({ nsuid: "1931672642", password: "minhazabedin1" })
     .expect("Content-Type", /json/)
     .expect(200)
     .expect(function(res) {
      token = res.body.accessToken;
      console.log(token)
    })
 });
});


describe("Testing /users endpoint", () => {
  it("Retrieve all users", async () => {
    await request(app)
      .get("/users")
      .set('x-access-token',token)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(function(res) {
        console.log(res.body)
      })
  });

  it("Error retrieving users, No authentication", async () => {
    await request(app)
      .get("/users")
      .expect("Content-Type", /json/)
      .expect(403)
      .expect(function(res) {
        console.log(res.body)
      })
  });
});

describe("Testing /getcomplaints/filed endpoint", () => {
  it("Successfully retrieved all filed complaints!", async () => {
    await request(app)
      .get("/getcomplaints/filed ")
      .send({tokenid: token})
      .set('x-access-token',token)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(function(res) {
        console.log(res.body)
      })
  });

  it("Could not retrieve all filed complaints!", async () => {
    await request(app)
      .get("/getcomplaints/filed")
      .expect("Content-Type", /json/)
      .expect(500)
      .expect(function(res) {
        console.log(res.body)
      })
  });
});

describe("Testing /getcomplaints/completed endpoint", () => {
  it("Successfully retrieved all completed complaints!", async () => {
    await request(app)
      .get("/getcomplaints/completed ")
      .send({against: "1931672642"})
      .set('x-access-token',token)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(function(res) {
        console.log(res.body)
      })
  });

  it("Could not retrieve all completed complaints!", async () => {
    await request(app)
      .get("/getcomplaints/completed")
      .expect("Content-Type", /json/)
      .expect(500)
      .expect(function(res) {
        console.log(res.body)
      })
  });
});

describe("Testing Signup Endpoint", () => {
  it("Sign Up is successful!", async () => {
    await request(app)
      .post("/signup")
      .set('Content-Type',  'application/json')
      .send({ nsuid: "2311672642", email: "2311672642@gmail.com",password: "12345",name:"TestBot1"})
      .expect("Content-Type", /json/)
      .expect(200)
  });

  it("Failed! Username is already in use", async () => {
    await request(app)
      .post("/signup")
      .send({ nsuid: "1931672642", email: "minhazabedin1@gmail.com",password: "minhazabedin1",name:"Minhazul Abedin Ayaaz"})
      .expect("Content-Type", /json/)
      .expect(400)
  });

  it("Failed! Email already in use", async () => {
   await request(app)
     .post("/signup")
     .set('Content-Type',  'application/json')
     .send({ nsuid: "1931672642", email: "minhazabedin1@gmail.com",password: "minhazabedin1",name:"Minhazul Abedin Ayaaz"})
     .expect("Content-Type", /json/)
     .expect(400)
 });


// it("Confirmation Email was sent", async () => {
//   await request(app)
//     .post("/signup")
//     .set('Content-Type',  'application/json')
//     .send({ nsuid: "1931672642", password: "minhaz" })
//     .expect("Content-Type", /json/)
//     .expect(512)
// });

// it("Role has not been selected", async () => {
//   await request(app)
//     .post("/signup")
//     .set('Content-Type',  'application/json')
//     .send({ nsuid: "1931672642", email: "minhazabedin1@gmail.com",password: "minhazabedin1",name:"Minhazul Abedin Ayaaz"})
//     .expect("Content-Type", /json/)
//     .expect(512)
// });

// it("NSU has not been scanned", async () => {
//   await request(app)
//     .post("/signup")
//     .set('Content-Type',  'application/json')
//     .send({ nsuid: "1931672642", email: "minhazabedin1@gmail.com",password: "minhazabedin1",name:"Minhazul Abedin Ayaaz"})
//     .expect("Content-Type", /json/)
//     .expect(512)
// });

});

describe("Testing Create Complaint end point", () => {
  it("Empty Content Test", async () => {
    await request(app)
      .get("/createcomplaint")
      .set('x-access-token',token)
      .expect("Content-Type", /json/)
      .expect(400)
      .expect(function(res) {
        console.log(res.body)
      })
  });

  it("Complaint successfully created!", async () => {
    await request(app)
      .get("/createcomplaint")
      .set('x-access-token',token)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(function(res) {
        console.log(res.body)
      })
  });

  it("Complaint did not post!", async () => {
    await request(app)
      .get("/createcomplaint")
      .set('x-access-token',token)
      .expect("Content-Type", /json/)
      .expect(500)
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