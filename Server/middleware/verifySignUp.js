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
  else 
  {
    if(req.body.roles=='')
    {
      res.status(415).send({
        message: "Role is required"
      });
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
function validateEmail(email) { 
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if(re.test(email)){
      //Email valid. 
      if(email.indexOf("@northsouth.edu", email.length - "@northsouth.edu".length) !== -1){
          //VALID
          return true;
      }
  }
}
checkemail = (req, res, next) => {
  
  
  if(!(validateEmail(req.body.email)))
  {
    res.sendStatus(700).send({message:"Invalid email"})

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



const verifySignUp = {
   
  checkDuplicateNsuidOrEmail: checkDuplicateNsuidOrEmail,
  checkRolesExisted: checkRolesExisted,
  checkId: checkId,
  checkname:checkname,
  checkpassword:checkpassword,
  checkemail: checkemail
 
};
module.exports = verifySignUp;