const { Op } = require("sequelize");
const MaterialGrade = require("../../../../../../models/company.models/product.models/material_grade.model");
const { sequelize } = require("../../../../../../configs/database");
const globalError = require("../../../../../../errors/global.error");

const getAllMaterialGradeWithPagination = async (req, res, next) => {
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
              [Op.like]: `%${query}%`,
            },
          },
        ],
      });
    }

    const materialGrade = await MaterialGrade.findAndCountAll({
      where: { ...condition },
      limit: pageSize,
      offset: (pageIndex - 1) * pageSize,
      attributes: ["number", "status", "material_grade_id", "createdAt"],
    });
    return res
      .status(200)
      .json({
        success: true,
        total: materialGrade.count,
        data: materialGrade.rows,
      });
  } catch (error) {
    next(globalError(500, "Internal server error"));
  }
};

const getAllMaterialGrade = async (req, res, next) => {
  try {
    const condition = {
      [Op.and]: [{ deleted: false }],
    };

    const materialGrade = await MaterialGrade.findAll({
      where: { ...condition },
      attributes: ["number", "status", "material_grade_id", "createdAt"],
    });
    return res.status(200).json({ success: true, data: materialGrade });
  } catch (error) {
    next(globalError(500, "Internal server error"));
  }
};

const getAllMaterialGradeASOption = async (req, res, next) => {
  try {
    const condition = {
      [Op.and]: [{ deleted: false }],
    };

    const materialGrade = await MaterialGrade.findAll({
      where: { ...condition },
      attributes: ["number", "material_grade_id"],
    });

    const arr = materialGrade.map((b) => {
      return { label: b.number, value: b.material_grade_id };
    });
    return res.status(200).json({ success: true, data: arr });
  } catch (error) {
    next(globalError(500, "Internal server error"));
  }
};

const getMaterialStatisticData = async (req, res, next) => {
  try {
    const count = await MaterialGrade.findOne({
      attributes: [[sequelize.fn("COUNT", sequelize.literal("*")), "total"]],
    });
    req.material = count.toJSON().total;
    return next();
  } catch (error) {
    return next(globalError(500, "Internal server error"));
  }
};

module.exports = {
  getAllMaterialGrade,
  getMaterialStatisticData,
  getAllMaterialGradeWithPagination,
  getAllMaterialGradeASOption,
};
