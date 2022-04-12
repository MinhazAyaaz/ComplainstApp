const { verifySignUp } = require("../middleware");
const controller = require("../controllers/comments.controller");
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
    "/createComment",
    [authJwt.verifyToken] ,
    controller.createComment
  );
  

  app.get(
    "/fetchComment",
    [authJwt.verifyToken] ,
    controller.fetchComments
  );

 
};