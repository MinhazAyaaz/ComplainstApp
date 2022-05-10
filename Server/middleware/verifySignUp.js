const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;//importing the tables
const { check, validationResult, matchedData } = require("express-validator");
var passwordValidator = require('password-validator');
//checks if a user with the same email and userid exists 
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
//checks if a valid role has been selected 
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
//checks if the id is valid 
checkId = (req, res, next) => {

  let textid = req.body.nsuid;
  let lengthid= textid.length;
  //checks if nsuid is number only
  if(isNaN(req.body.nsuid)) res.status(601).send({message:"Illegal ID, ID needs to be a number "})
 ///checks if the length of the id is 10 characters 
  else if(!(lengthid==10))
  {
    res.sendStatus(709).send({message:"ID must be 10 characters long"})
  }
  next();
};
//checks if the name is valid 
checkname = (req, res, next) => {
  
  let nameid=req.body.name;
  let namelength=nameid.length
  //name is a required field 
  if(req.body.name == null){
    res.sendStatus(419).send({message:"Name is required"})
  }
  //name can be max 30 characters 
  else if((namelength>=30))
  {
    res.sendStatus(723).send({message:"Name size is too large"})
  }
  
  next();
};
//validates the email format is okay
const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};
//checks overall email validity
checkemail = (req, res, next) => {
  
  let emailid=req.body.email;
  let emaillength=emailid.length;
//calls to check if email is sth@dsth.com
  if(!(validateEmail(req.body.email)))
  {
    res.sendStatus(700).send({message:"Invalid email"})

  }
  //email cannot be more than 255 characters 
  else if((emaillength>255))
  {
    res.sendStatus(756).send({message:"Email is too large"})
  }
 
  
  next();
};
//checks if password is min 8 characters and a max of 100 and has 1 upper and lowercase 
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
//role is a required field 
checkrole  = (req, res, next) => {
  
  
  if((req.body.roles)=="")
  {
    res.sendStatus(585).send({message:"Role required"})

  }
 
  
  next();
};

//imports all the functions 
const verifySignUp = {
   
  checkDuplicateNsuidOrEmail: checkDuplicateNsuidOrEmail,
  checkRolesExisted: checkRolesExisted,
  checkId: checkId,
  checkname:checkname,
  checkpassword:checkpassword,
  
  checkrole:checkrole
 
};
module.exports = verifySignUp;