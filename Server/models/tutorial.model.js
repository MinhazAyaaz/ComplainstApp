module.exports = (sequelize, Sequelize) => {
    const Tutorial = sequelize.define("complaints", {
      complaintid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
  
    return Tutorial;

  };

  