const { Op } = require("sequelize");
const Conditions = require("../../../../../models/company.models/note.models/condition.model");
const globalError = require("../../../../../errors/global.error");

const getAllConditionsWithPagination = async (req, res, next) => {
  try {
    const { pageIndex = 1, pageSize = 10, query = "", type = "po" } = req.body;
    const condition = {
      [Op.and]: [{ deleted: false }, { type: type }],
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

    const conditions = await Conditions.findAndCountAll({
      where: { ...condition },
      limit: pageSize,
      offset: (pageIndex - 1) * pageSize,
      attributes: ["condition_id", "condition", "name"],
    });

    if (conditions.rows.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }
    arr = conditions.rows.map((m) => {
      const { condition_id, condition, name } = m.toJSON();
      return { name, condition_id, condition };
    });
    return res
      .status(200)
      .json({ success: true, total: conditions.count, data: arr });
  } catch (error) {
    next(globalError(500, error.message));
  }
};

const getAllConditions = async (req, res, next) => {
  try {
    const condition = {
      [Op.and]: [{ deleted: false }, { type: req.body.type }],
    };

    const conditions = await Conditions.findAll({
      where: { ...condition },
      attributes: ["condition_id", "condition", "name"],
    });

    if (conditions.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }
    arr = conditions.map((m) => {
      const { condition_id, condition, name } = m.toJSON();
      return { name, condition_id, condition };
    });
    return res.status(200).json({ success: true, data: arr });
  } catch (error) {
    next(globalError(500, error.message));
  }
};

module.exports = {
  getAllConditionsWithPagination,
  getAllConditions,
};
