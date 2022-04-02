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
      verifySignUp.checkId,
      verifySignUp.checkname,verifySignUp.checkemail,verifySignUp.checkpassword,verifySignUp.checkrole
    ],
    controller.signup
  );

  app.post("/login",   [
   verifySignUp.checkId,
  ],controller.login);

  app.post(
    "/Gsignup",
    controller.GoogleSignup
  );

  app.get(
    "/users",
    [authJwt.verifyToken] ,
    controller.findAll
  );

  app.get(
    "/againstusers",
    [authJwt.verifyToken] ,
    controller.findUserToComplainAgainst
  );
  app.get(
    "/idStatus",
    [authJwt.verifyToken] ,
    controller.findID
  );

  app.get(
    "/confirmation/:token",
    controller.update
  );

  app.post(
    "/uploadId",
    [authJwt.verifyToken],
    controller.uploadId
  );
};