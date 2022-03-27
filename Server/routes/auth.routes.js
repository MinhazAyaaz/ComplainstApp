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
  app.post(
    "/signup",
    [
      verifySignUp.checkDuplicateNsuidOrEmail,
      verifySignUp.checkRolesExisted, verifySignUp.checkId,
      verifySignUp.checkname,verifySignUp.checkpassword,verifySignUp.checkemail
      
      
    ],
    controller.signup
  );
  app.post("/login",   [
   verifySignUp.checkId,verifySignUp.checkpassword
    
    
  ],controller.signin);
  app.post(
    "/Gsignup",
    controller.Gsignup
  );
  app.get(
    "/users",
    [authJwt.verifyToken] ,
    controller.findAll
  );
  app.get(
    "/confirmation/:token",
    controller.update
  );
  app.post(
    "/uploadId",
    controller.uploadId
  );
};