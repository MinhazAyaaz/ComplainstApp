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
      res.status(441).send({
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
        res.status(448).send({
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
        res.status(457).send({
          message: "Failed! Role does not exist = " + req.body.roles[i]
        });
        return;
      }
    }
   
  
  }

  next();
};
checkId = (req, res, next) => {

  let textid = req.body.nsuid;
  let lengthid= textid.length;
  
  if(isNaN(req.body.nsuid)) res.status(601).send({message:"Illegal ID, ID needs to be a number "})
  else if(!(lengthid==10))
  {
    res.sendStatus(709).send({message:"ID must be 10 characters long"})
  }
  next();
};

checkname = (req, res, next) => {
  
  let nameid=req.body.name;
  let namelength=nameid.length
  
  if(req.body.name == null){
    res.sendStatus(419).send({message:"Name is required"})
  }
  else if((namelength>=30))
  {
    res.sendStatus(723).send({message:"Name size is too large"})
  }
  
  next();
};
const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};
checkemail = (req, res, next) => {
  
  let emailid=req.body.email;
  let emaillength=emailid.length;

  if(!(validateEmail(req.body.email)))
  {
    res.sendStatus(700).send({message:"Invalid email"})

  }
  else if((emaillength>255))
  {
    res.sendStatus(756).send({message:"Email is too large"})
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