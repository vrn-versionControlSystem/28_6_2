const { Op } = require("sequelize");
const Category = require("../../../../../../models/company.models/product.models/category.model");
const globalError = require("../../../../../../errors/global.error");
const { sequelize } = require("../../../../../../configs/database");

const getAllCategoryWithPagination = async (req, res, next) => {
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
            name: {
              [Op.like]: `%${query}%`,
            },
          },
        ],
      });
    }

    const category = await Category.findAndCountAll({
      where: { ...condition },
      limit: pageSize,
      offset: (pageIndex - 1) * pageSize,
      attributes: ["name", "status", "category_id"],
    });
    return res
      .status(200)
      .json({ success: true, total: category.count, data: category.rows });
  } catch (error) {
    next(globalError(500, "Internal server error"));
  }
};

const getAllCategory = async (req, res, next) => {
  try {
    const condition = {
      [Op.and]: [{ deleted: false }, { status: true }],
    };

    const category = await Category.findAll({
      where: { ...condition },
      attributes: ["name", "status", "category_id"],
    });
    return res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(globalError(500, "Internal server error"));
  }
};

const getCategoryStatisticData = async (req, res, next) => {
  try {
    const count = await Category.findOne({
      attributes: [[sequelize.fn("COUNT", sequelize.literal("*")), "total"]],
    });
    req.category = count.toJSON().total;
    return next();
  } catch (error) {
    return next(globalError(500, "Internal server error"));
  }
};

module.exports = {
  getAllCategory,
  getCategoryStatisticData,
  getAllCategoryWithPagination,
};
