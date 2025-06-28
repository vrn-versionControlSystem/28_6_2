const { sequelize } = require("../../../../../configs/database");
const globalError = require("../../../../../errors/global.error");
const Task = require("../../../../../models/company.models/Task.models/task.model");

const deleteTask = async (req, res, next) => {
  try {
    const { task_id } = req.body;
    const value = {
      deleted: true,
    };
    const deleteTask = await Task.update(value, {
      where: {
        task_id,
      },
    });
    if (deleteTask[0] == 0) {
      return next(globalError(500, "Task Not Deleted"));
    }

    return res.status(200).json({
      success: true,
      message: "Task Deleted Successfully",
    });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = { deleteTask };
