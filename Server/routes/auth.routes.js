const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const { authJwt } = require("../middleware");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  //signup posting to db new user creation
  app.post(
    "/signup",
    [
      verifySignUp.checkDuplicateNsuidOrEmail,
      verifySignUp.checkId,
      verifySignUp.checkname,verifySignUp.checkpassword,verifySignUp.checkrole
    ],
    controller.signup
  );
//logging new user
  app.post("/login",   [
   verifySignUp.checkId,
  ],controller.login);
//using google login
  app.post(
    "/Gsignup",
    controller.GoogleSignup
  );
  //using google login on mobile
  app.post(
    "/GsignupMobile",
    controller.GoogleSignup
  );
//finding list of all users of the system
  app.get(
    "/users",
    [authJwt.verifyToken] ,
    controller.findAll
  );
//finding a specific user
  app.get(
    "/user",
    [authJwt.verifyToken] ,
    controller.findUser
  );
//finding list of all users except the user logged in 
  app.get(
    "/otherUser",
    [authJwt.verifyToken] ,
    controller.findOtherUser
  );

  app.get(
    "/reviewers",
    [authJwt.verifyToken] ,
    controller.findReviewers
  );
//finding list of users with reviewer 
  app.get(
    "/reviewerOne",
    [authJwt.verifyToken] ,
    controller.findReviewerOne
  );
//finding the review who can be reviewers of a certain comp
  app.get(
    "/reviewertoreview",
    [authJwt.verifyToken] ,
    controller.findReviewerToReview
  );
//list of all users and their status 
  app.get(
    "/userswithstatus",
    [authJwt.verifyToken] ,
    controller.findUserWithStatus
  );
//finding list of users to complaint against 
  app.get(
    "/againstusers",
    [authJwt.verifyToken] ,
    controller.findUserToComplainAgainst
  );
//find all users 
  app.get(
    "/findAll",
    [authJwt.verifyToken] ,
    controller.findAll
  );
  //disbale a account done by admin
  app.put(
    "/disableaccount",[authJwt.verifyToken] ,
    
    controller.updatedeactiavtionstatus
  );
//finding out if id is uploaded
  app.get(
    "/idStatus",
    [authJwt.verifyToken] ,
    controller.findID
  );
//finds the users role 
  app.get(
    "/roleStatus",
    [authJwt.verifyToken] ,
    controller.findRole
  );
//not used
  app.get(
    "/confirmation/:token",
    controller.update
  );
//uploading id to db not used
  app.post(
    "/uploadId",
    [authJwt.verifyToken],
    controller.uploadId
  );
//uploading url of image to db
  app.put(
    "/uploadstuff",    [authJwt.verifyToken] ,
    controller.updatetest
  );
  //updating user status NOT USED
  app.put(
    "/updateStatus",    [authJwt.verifyToken] ,
    controller.updateStatus
  );
  //setting profile picture 
  app.put(
    "/uploadprofilepic",    [authJwt.verifyToken] ,
    controller.setprofilepic
  );


};