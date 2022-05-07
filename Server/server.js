const bcrypt = require('bcryptjs')
const mysql = require('mysql')
const fileUpload = require('express-fileupload');
const jwt = require('jsonwebtoken')
const express = require("express");
// const bodyParser = require("body-parser"); /* deprecated */
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:5001"
};

app.use(fileUpload())
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());  /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));   /* bodyParser.urlencoded() is deprecated */

const db = require("./models");

require('./routes/auth.routes.js')(app);
require('./routes/user.routes')(app);
require("./routes/comment.routes")(app);
require("./routes/tutorial.routes")(app);

// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });
const Role = db.role;
db.sequelize.sync()
// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Db');
//   initial();
// }); 

// simple route
app.get("/api", (req, res) => {
  res.json({"users": ["userOne", "userTwo", "userThree"]});
});


function initial() {
  Role.create({
    id: 1,
    name: "user"
  });
 
  Role.create({
    id: 2,
    name: "moderator"
  });
 
  Role.create({
    id: 3,
    name: "admin"
  });
}
// set port, listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = app;