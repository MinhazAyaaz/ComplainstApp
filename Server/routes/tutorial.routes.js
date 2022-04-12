module.exports = app => {
    const tutorials = require("../controllers/tutorial.controller.js");
    const users = require("../controllers/tutorial.controller.js");
    const { authJwt } = require("../middleware");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/createcomplaint",[authJwt.verifyToken], tutorials.create);
    router.post("/createcomplaintadmin",[authJwt.verifyToken], tutorials.create2);
   
  
    // Retrieve all Tutorials
    router.get("/getcomplaint/received", [authJwt.verifyToken],tutorials.findAll);
  
    // Retrieve all published Tutorials
    router.get("/getcomplaint/filed", [authJwt.verifyToken],tutorials.findAll2);
  
    // Retrieve a single Tutorial with id
    router.get("/:id", tutorials.findOne);
  
    // Update a Tutorial with id
    router.put("/updatecompstat", tutorials.updatecompstatus);
  
    // Delete a Tutorial with id
    router.delete("/:id", tutorials.delete);
  
    // Delete all Tutorials
    router.delete("/deletecomplaint", tutorials.deleteAll);
  
    app.use('/', router);
  };