const { Op } = require("sequelize");
const Pattern = require("../../../../../../models/company.models/product.models/pattern.model");
const Customer = require("../../../../../../models/company.models/customer.models/customer.model");
const globalError = require("../../../../../../errors/global.error");
const { sequelize } = require("../../../../../../configs/database");
const { trimSpace } = require("../../../../../../utils/helpers/text_checker");

const getAllPatternWithPagination = async (req, res, next) => {
  try {
    const { pageIndex = 1, pageSize = 10, query = "", status = "" } = req.body;
    const condition = {
      [Op.and]: [{ deleted: false }],
    };

    if (status === true) {
      condition[Op.and].push({ status: true });
    } else if (status === false) {
      condition[Op.and].push({ status: false });
    }

    if (query) {
      condition[Op.and].push({
        [Op.or]: [
          {
            number: {
              [Op.like]: `%${trimSpace(query)?.split(" ").join("")}%`,
            },
          },
        ],
      });
    }

    const patterns = await Pattern.findAndCountAll({
      where: { ...condition },
      include: [
        {
          model: Customer,
          attributes: ["name", "customer_id"],
        },
      ],
      limit: pageSize,
      offset: (pageIndex - 1) * pageSize,
    });
    return res
      .status(200)
      .json({ success: true, total: patterns.count, data: patterns.rows });
  } catch (error) {
    next(globalError(500, "Internal server error"));
  }
};

const getAllPattern = async (req, res, next) => {
  try {
    const condition = {
      [Op.and]: [{ deleted: false }],
    };

    const patterns = await Pattern.findAll({
      where: { ...condition },
    });
    return res.status(200).json({ success: true, data: patterns });
  } catch (error) {
    next(globalError(500, "Internal server error"));
  }
};

const getPatternStatisticData = async (req, res, next) => {
  try {
    const count = await Pattern.findOne({
      attributes: [[sequelize.fn("COUNT", sequelize.literal("*")), "total"]],
    });
    req.pattern = count.toJSON().total;
    return next();
  } catch (error) {
    return next(globalError(500, "Internal server error"));
  }
};

module.exports = {
  getAllPattern,
  getPatternStatisticData,
  getAllPatternWithPagination,
};
