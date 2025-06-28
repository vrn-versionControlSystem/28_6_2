const { sequelize } = require("../../../../../../configs/database");
const { Op } = require("sequelize");
const globalError = require("../../../../../../errors/global.error");
const { getConnectedUsers } = require("../../../../../../socket/authenticate");
const TaskChat = require("../../../../../../models/company.models/taskChat.models/taskChat.model");
const User = require("../../../../../../models/user.model");

const getAllChatsByTaskID = async (req, res, next) => {
  try {
    const { task_id } = req.body;
    const condition = {
      [Op.and]: [{ deleted: false }, { task_id }],
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

    const tasks = await TaskChat.findAll({
      where: { ...condition },
      attributes: [
        "task_id",
        "sender_id",
        "receiver_id",
        "message",
        "createdAt",
      ],
      include: [
        { model: User, as: "Sender", attributes: ["name"] },
        { model: User, as: "Receiver", attributes: ["name"] },
      ],
      raw: true,
      order: [["createdAt"]],
    });

    if (tasks.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    return res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    next(globalError(500, error.message));
  }
};

const checkUserIsOnlineOrNot = async (req, res, next) => {
  try {
    const { user_id } = req.body;

    let userIDs = Object.keys(getConnectedUsers);

    if (userIDs.length == 0) {
      return res.status(200).json({ success: true, user: "Offline" });
    }
    let found = userIDs.includes(user_id);
    return res
      .status(200)
      .json({ success: true, data: found ? "Online" : "Offline" });
  } catch (error) {
    next(globalError(500, error.message));
  }
};

module.exports = { getAllChatsByTaskID, checkUserIsOnlineOrNot };
