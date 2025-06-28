const { sequelize } = require("../../../../../configs/database");
const globalError = require("../../../../../errors/global.error");
const Task = require("../../../../../models/company.models/Task.models/task.model");
const { emitEvent } = require("../../../../../socket/event/emit");

const newTaskRegistration = async (req, res, next) => {
  try {
    const {
      task,
      description,
      priority = "high",
      task_status = "pending",
      status = "active",
      assigned_to,
      date,
    } = req.body;
    const value = {
      task,
      description,
      priority,
      task_status,
      status,
      assigned_by: req.jwtTokenDecryptData.user["user_id"],
      assigned_to,
      date,
      added_by: req.jwtTokenDecryptData.authority[0],
      added_by_id: req.jwtTokenDecryptData.user["user_id"],
    };
    const tasks = await Task.create(value);
    if (!tasks) {
      return next(globalError(500, "Something went wrong"));
    }

    // {
    //   id: "e55adc24-1803-4ffd-b653-09be273f8df5",
    //   target: "Jennifer Ruiz",
    //   description: "mentioned your in comment.",
    //   date: "2 days ago",
    //   image: "thumb-4.jpg",
    //   type: 0,
    //   location: "",
    //   locationLabel: "",
    //   status: "",
    //   readed: true,
    // }
    await emitEvent(
      "New Task",
      {
        data: {
          target: req.jwtTokenDecryptData.user["name"],
          description: `You got a new task`,
          date: "",
          image: "",
          type: 0,
          location: "",
          locationLabel: "",
          status: "",
          readed: false,
        },
      },
      "Task",
      assigned_to
    );
    return res.status(200).json({
      success: true,
      message: "Task Added Successfully",
      data: {
        task,
        description,
        priority,
        task_status,
        status,
        assigned_by: req.jwtTokenDecryptData.user["user_id"],
        assigned_to,
        date,
      },
    });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = { newTaskRegistration };
