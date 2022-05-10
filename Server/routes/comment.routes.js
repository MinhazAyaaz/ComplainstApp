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
  
//create a new comment
  app.post(
    "/createComment",
    [authJwt.verifyToken] ,
    controller.createComment
  );
  
//fetch comments of a particular comp
  app.get(
    "/fetchComment",
    [authJwt.verifyToken] ,
    controller.fetchComments
  );
//fetch the number of comments made
  app.get(
    "/fetchCommentCount",
    [authJwt.verifyToken] ,
    controller.fetchCommentCount
  );

 
};