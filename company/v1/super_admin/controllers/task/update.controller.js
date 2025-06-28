const { sequelize } = require("../../../../../configs/database");
const globalError = require("../../../../../errors/global.error");
const Task = require("../../../../../models/company.models/Task.models/task.model");

const updateTask = async (req, res, next) => {
  try {
    const {
      task,
      description,
      priority,
      task_status,
      status,
      assigned_to,
      date,
      task_id,
    } = req.body;

    const existingTask = await Task.findByPk(task_id);

    if (!existingTask) {
      return next(globalError(404, "Task not found"));
    }

    const updatedValues = {
      ...(task && { task }),
      ...(description && { description }),
      ...(priority && { priority }),
      ...(task_status && { task_status }),
      ...(status && { status }),
      ...(assigned_to && { assigned_to }),
      ...(date && { date }),
    };

    const updatedTask = await Task.update(updatedValues, {
      where: {
        task_id,
      },
    });

    if (updateTask[0] === 0) {
      return next(globalError(400, "Task Not Updated"));
    }

    return res.status(200).json({
      success: true,
      message: "Task Updated Successfully",
      data: updatedTask,
    });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = { updateTask };
