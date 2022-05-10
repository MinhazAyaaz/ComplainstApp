//creating complaints versions table(not used)
module.exports = (sequelize, Sequelize) => {
    const complaintVersions = sequelize.define("complaintVersions", {
      complaintid: {
        type: Sequelize.INTEGER
      },
      version: {
        type: Sequelize.INTEGER,
        
      },
      body: {
        type: Sequelize.STRING
      }
    });
  
    return complaintVersions;

  };

  