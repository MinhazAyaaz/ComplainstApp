//Defining the complain history table  
module.exports = (sequelize, Sequelize) => {
    const ComplaintHistory = sequelize.define("complaintHistory", {
    
      complaintVersion: {
        type: Sequelize.DECIMAL(4, 2),
        primaryKey: true,
        // autoIncrement:true
        
      },
      // complaintid: {
      //   type: Sequelize.INTEGER

      // },
      date:{
        type: Sequelize.DATE,
        
      },
      title: {
        type: Sequelize.STRING
      },
      against: {
        type: Sequelize.STRING
      },
      createdby: {
        type: Sequelize.STRING
      },
      body: {
        type: Sequelize.STRING
      },
      reviewer: {
        type: Sequelize.STRING
      },
      category: {
        type: Sequelize.STRING
      },
      
      status: {
        type: Sequelize.BOOLEAN
      }
    });
  
    return ComplaintHistory;

  };

  