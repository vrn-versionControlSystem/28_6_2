const { sequelize } = require("../../../../../../configs/database");
const globalError = require("../../../../../../errors/global.error");
const { emitEvent } = require("../../../../../../socket/event/emit");
const TaskChat = require("../../../../../../models/company.models/taskChat.models/taskChat.model");

const newChatRegistration = async (req, res, next) => {
  try {
    const { task_id, receiver_id, message } = req.body;
    const value = {
      task_id,
      sender_id: req.jwtTokenDecryptData.user["user_id"],
      receiver_id,
      message,
    };
    const tasks = await TaskChat.create(value);
    if (!tasks) {
      return next(globalError(500, "Something went wrong"));
    }
    await emitEvent(
      "Reply",
      {
        data: {
          ...tasks,
          target: req.jwtTokenDecryptData.user["name"],
          description:
            message.split(" ").length > 8
              ? words.slice(0, 8).join(" ") + " ..."
              : message,
          date: "",
          image: "",
          type: 0,
          location: "",
          locationLabel: "",
          status: "",
          readed: false,
        },
      },
      "chat",
      receiver_id
    );
    return res.status(200).json({
      success: true,
      message: "Message Saved Successfully",
    });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = { newChatRegistration };
