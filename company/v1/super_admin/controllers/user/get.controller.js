const { Op } = require("sequelize");
const User = require("../../../../../models/user.model");
const globalError = require("../../../../../errors/global.error");

const getAllUsersOfIndividualCompanyWithPagination = async (req, res, next) => {
  try {
    const user_id = req.jwtTokenDecryptData.user["user_id"];

    console.log("user_ids", user_id);
    const { pageIndex = 1, pageSize = 10, query = "", type = "" } = req.body;
    const condition = {
      [Op.and]: [{ deleted: false }, { user_id: { [Op.not]: user_id } }],
    };
    if (type) {
      condition[Op.and].push({ type: type });
    }

    if (query) {
      condition[Op.and].push({
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${query}%`,
            },
          },
          {
            email: {
              [Op.like]: `%${query}%`,
            },
          },
        ],
      });
    }

    const users = await User.findAndCountAll({
      where: { ...condition },
      limit: pageSize,
      offset: (pageIndex - 1) * pageSize,
      attributes: [
        "user_id",
        "name",
        "mobile",
        "status",
        "password",
        "type",
        "email",
        "createdAt",
      ],
    });

    return res
      .status(200)
      .json({ success: true, total: users.count, data: users.rows });
  } catch (error) {
    next(globalError(500, "Internal server error"));
  }
};

const getAllUsersASOption = async (req, res, next) => {
  try {
    const user_id = req.jwtTokenDecryptData.user["user_id"];
    const condition = {
      [Op.and]: [{ deleted: false }, { user_id: { [Op.not]: user_id } }],
    };
    const users = await User.findAll({
      where: { ...condition },
      attributes: ["user_id", "name"],
      raw: true,
    });

    if (users.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    let data = users.map((m) => {
      return {
        label: m.name,
        value: m.user_id,
      };
    });
    return res.status(200).json({ success: true, data: data });
  } catch (error) {
    next(globalError(500, "Internal server error"));
  }
};

const getPasswordOfUser = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const user = await User.findOne({
      where: { user_id: userId, deleted: false },
      attributes: [
        "user_id",
        "name",
        "mobile",
        "status",
        "password",
        "type",
        "email",
        "createdAt",
      ],
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(globalError(500, "Internal server error"));
  }
};

module.exports = {
  getAllUsersASOption,
  getAllUsersOfIndividualCompanyWithPagination,
  getPasswordOfUser,
};
