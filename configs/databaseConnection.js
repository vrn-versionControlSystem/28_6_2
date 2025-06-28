const { sequelize } = require("./database");

const dbConnection = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: false, force: false });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = { dbConnection };
