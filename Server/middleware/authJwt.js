const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;//connects to tables 
//verifies that a jwt token is there 
verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(435).send({
      message: "No token provided!"
    });
  }
  //verifies if the jwt token is a valid token 
  jwt.verify(token, config.secret, (err, decoded) => {
      
    if (err) {
      return res.status(434).send({
        message: "Unauthorized!"

      });
    }
    console.log("hello");
    req.decoded=decoded;
    req.userId = decoded.id;
    
    
    next();
  });
};
//checks for the admin role (not used)
isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }
      res.status(439).send({
        message: "Require Admin Role!"
      });
      return;
    });
  });
};
//checks for the moderator role not used 
isModerator = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          next();
          return;
        }
      }
      res.status(438).send({
        message: "Require Moderator Role!"
      });
    });
  });
};
//checks for the admin or moderator role not used 
isModeratorOrAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          next();
          return;
        }
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }
      res.status(433).send({
        message: "Require Moderator or Admin Role!"
      });
    });
  });
};
//imports all the functions
const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isModerator: isModerator,
  isModeratorOrAdmin: isModeratorOrAdmin
};
module.exports = authJwt;