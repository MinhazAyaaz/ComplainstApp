module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        nsuid: {
            type: Sequelize.STRING,
            primaryKey: true
          },
          name: {
            type: Sequelize.STRING
          },
        email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      verified: {
        type: Sequelize.STRING
      },
      idscan: {
        type: Sequelize.STRING
      },
      photo: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.STRING
      }
    });
    return User;
  };