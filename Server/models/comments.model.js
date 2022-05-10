//creating the comments table
module.exports = (sequelize, Sequelize) => {
    const Comments = sequelize.define("comments", {
      commentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      comment: {
        type: Sequelize.STRING
      },
      user: {
        type: Sequelize.STRING
      }
    });
  
    return Comments;

  };

  