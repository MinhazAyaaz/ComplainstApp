const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;
const { check, validationResult, matchedData } = require("express-validator");
var passwordValidator = require('password-validator');
checkDuplicateNsuidOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    where: {
      nsuid: req.body.nsuid
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: "Failed! Username is already in use!"
      });
      return;
    }
    // Email
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        res.status(403).send({
          message: "Failed! Email is already in use!"
        });
        return;
      }
      next();
    });
  });
};
checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(407).send({
          message: "Failed! Role does not exist = " + req.body.roles[i]
        });
        return;
      }
    }
   
  
  }

  next();
};
checkId = (req, res, next) => {
  
  if(isNaN(req.body.nsuid)) res.status(601).send({message:"Illegal ID "})
  

  next();
};

checkname = (req, res, next) => {
  
  if(req.body.name == ''){
    res.sendStatus(419).send({message:"Name is required"})
  }
  
  next();
};





checkpassword = (req, res, next) => {
  
  var schema = new passwordValidator();
  schema
  .is().min(8)
  .is().max(100)
  .has().uppercase()
  .has().lowercase();
  if(!(schema.validate(req.body.password)))
  {
    res.sendStatus(560).send({message:"Password should be combination of one uppercase , one lower case and must be 8 digits long"})

  }
 
  
  next();
};
checkrole  = (req, res, next) => {
  
  
  if((req.body.roles)=="")
  {
    res.sendStatus(585).send({message:"Role required"})

  }
 
  
  next();
};


const verifySignUp = {
   
  checkDuplicateNsuidOrEmail: checkDuplicateNsuidOrEmail,
  checkRolesExisted: checkRolesExisted,
  checkId: checkId,
  checkname:checkname,
  checkpassword:checkpassword,
 
  checkrole:checkrole
 
};
module.exports = verifySignUp;