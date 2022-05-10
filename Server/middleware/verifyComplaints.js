const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;
const Tutorial = db.tutorials;
//checks that title field is required 
checktitle = (req, res, next) => {
  
    let titleid=req.body.title;
    let titlelength=titleid.length;
    if((titlelength>40))//max length of title cant be more than 40
    {
      res.sendStatus(761).send({message:"Title too large"})
    }
   
   
    
    next();
  };
  //body is a required field 
  checkbody = (req, res, next) => {
  
    let bodyid=req.body.body;
    let bodylength=bodyid.length;
    if((bodylength>5000))//max length of body cannot be more than 5000
    {
      res.sendStatus(762).send({message:"Body too large.Max 5000 characters"})
    }
   
   
    
    next();
  };
  
  
  
  
  
  
  
  const verifyComplaints = {
     
    checktitle: checktitle,
    checkbody: checkbody
   
   
  };
  module.exports = verifyComplaints;