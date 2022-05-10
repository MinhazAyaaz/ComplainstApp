const verifyComplaints = require("../middleware/verifyComplaints.js");

module.exports = app => {
    const tutorials = require("../controllers/tutorial.controller.js");
    const users = require("../controllers/tutorial.controller.js");
    const { authJwt } = require("../middleware");
  
    var router = require("express").Router();
  
    // Create a new complaint
    router.post("/createcomplaint",
    [authJwt.verifyToken], [verifyComplaints.checktitle,verifyComplaints.checkbody],
    tutorials.create);
    router.post("/createcomplaintadmin",
    [authJwt.verifyToken], [verifyComplaints.checktitle,verifyComplaints.checkbody],
    tutorials.create2);
   
    //update complaints Labib
    router.post("/editcomplaint",[authJwt.verifyToken], tutorials.update);
    router.get("/getcomplaintVersions", [authJwt.verifyToken],tutorials.findVersions)
  
    // Retrieve all complaints 
    router.get("/getcomplaint/received", [authJwt.verifyToken],tutorials.findAll);
    router.get("/getcomplaint/all", [authJwt.verifyToken],tutorials.findAll4);
  
    router.get("/getcomplaint/filed", [authJwt.verifyToken],tutorials.findAll2);
  
    // Retrieve all complaints to review
    router.get("/getcomplaint/review", [authJwt.verifyToken],tutorials.findAll3);
  

  
    // Update a complaint status 
    router.put("/updatecompstat", tutorials.updatecompstatus);
  
  
  
    // Delete all complaints hasnt been used 
    router.delete("/deletecomplaint", tutorials.deleteAll);
  
    app.use('/', router);
  };