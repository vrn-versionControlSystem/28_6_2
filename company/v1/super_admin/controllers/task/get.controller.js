const { sequelize } = require("../../../../../configs/database");
const { Op } = require("sequelize");
const globalError = require("../../../../../errors/global.error");
const Task = require("../../../../../models/company.models/Task.models/task.model");
const User = require("../../../../../models/user.model");

const getAllTasks = async (req, res, next) => {
  try {
    const { pageIndex = 1, pageSize = 10, query = "", type = "" } = req.body;
    const condition = {
      [Op.and]: [{ deleted: false }],
    };
    // if (type) {
    //   condition[Op.and].push({ type: type });
    // }

    // if (query) {
    //   condition[Op.and].push({
    //     [Op.or]: [
    //       {
    //         name: {
    //           [Op.like]: `%${query}%`,
    //         },
    //       },
    //       {
    //         customer_code: {
    //           [Op.like]: `%${query}%`,
    //         },
    //       },
    //     ],
    //   });
    // }

    // if (req.jwtTokenDecryptData.authority[0] !== "super-admin") {
    //   condition[Op.and].push({
    //     assigned_to: req.jwtTokenDecryptData.user["user_id"],
    //   });
    // }

    if (req.jwtTokenDecryptData.authority[0] !== "super-admin") {
      condition[Op.and].push({
        [Op.or]: [
          { assigned_to: req.jwtTokenDecryptData.user["user_id"] },
          { assigned_by: req.jwtTokenDecryptData.user["user_id"] },
        ],
      });
    }

    const tasks = await Task.findAndCountAll({
      where: { ...condition },
      limit: pageSize,
      offset: (pageIndex - 1) * pageSize,
      attributes: [
        "task_id",
        "task",
        "priority",
        "task_status",
        "status",
        "assigned_by",
        "assigned_to",
        "description",
      ],
      include: [
        { model: User, as: "AssignedBy", attributes: ["name"] },
        { model: User, as: "AssignedTo", attributes: ["name"] },
      ],
      raw: true,
    });

    if (tasks.rows.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    return res
      .status(200)
      .json({ success: true, total: tasks.count, data: tasks.rows });
  } catch (error) {
    next(globalError(500, error.message));
  }
};

module.exports = { getAllTasks };
