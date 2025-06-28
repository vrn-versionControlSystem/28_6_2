const { Op, where } = require("sequelize");
const globalError = require("../../../../../../errors/global.error");
const Drawing = require("../../../../../../models/company.models/product.models/drawing.model");
const Product = require("../../../../../../models/company.models/product.models/product.model");
const Category = require("../../../../../../models/company.models/product.models/category.model");
const MaterialGrade = require("../../../../../../models/company.models/product.models/material_grade.model");
const Pattern = require("../../../../../../models/company.models/product.models/pattern.model");

const getAllDrawingByProductId = async (req, res, next) => {
  try {
    const { product_id } = req.body;
    const condition = {
      [Op.and]: [{ deleted: false }, { product_id }],
    };

    const drawings = await Product.findOne({
      where: {
        ...condition,
      },
      attributes: [
        "product_id",
        "name",
        "drawing_number",
        "item_code",
        "row_code",
        "pump_model",
        "product_code",
        "unit_measurement",
        "hsn_code",
        "description",
        "standard_lead_time",
        "standard_lead_time_type",
        "createdAt",
      ],
      include: [
        {
          model: Drawing,
          required: false,
          where: {
            deleted: false,
          },
          attributes: [
            "drawing_id",
            "revision_number",
            "raw_attachment_path",
            "finish_attachment_path",
            "process_attachment_path",
            "raw_weight",
            "finish_weight",
            "status",
            "createdAt",
          ],
        },
        {
          model: Category,
          required: true,
          attributes: ["category_id", "name"],
        },
        {
          model: MaterialGrade,
          required: true,
          attributes: ["material_grade_id", "number"],
        },
        {
          model: Pattern,
          required: true,
          attributes: ["pattern_id", "number"],
        },
      ],
    });
    return res.status(200).json({ success: true, data: drawings });
  } catch (error) {
    next(globalError(500, "Internal server error"));
  }
};

const getAllDrawingAsOption = async (req, res, next) => {
  try {
    const condition = {
      [Op.and]: [{ deleted: false }],
    };

    const drawings = await Drawing.findAll({
      where: {
        ...condition,
      },
      attributes: ["revision_number"],
    });

    const uniqueDrawings = Array.from(
      new Set(drawings.map((drawing) => drawing.revision_number))
    ).map((revision_number) => {
      return {
        label: revision_number,
        value: revision_number,
      };
    });

    return res.status(200).json({ success: true, data: uniqueDrawings });
  } catch (error) {
    next(globalError(500, "Internal server error"));
  }
};

module.exports = { getAllDrawingByProductId, getAllDrawingAsOption };
