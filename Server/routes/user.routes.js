const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);//hasnt been used

  app.get(
    "/api/test/user",//hasnt been used
    [authJwt.verifyToken],
    controller.userBoard
  );

  app.get(
    "/api/test/mod",//hasnt been used
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );
  
  app.get(
    "/api/test/admin",//hasnt been used
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
 
};