const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
const globalError = require("../../../../../errors/global.error");
const Product = require("../../../../../models/company.models/product.models/product.model");
const Pattern = require("../../../../../models/company.models/product.models/pattern.model");
const Category = require("../../../../../models/company.models/product.models/category.model");
const MaterialGrade = require("../../../../../models/company.models/product.models/material_grade.model");
const Drawing = require("../../../../../models/company.models/product.models/drawing.model");
const PdfAttachment = require("../../../../../models/company.models/pdfAttachment.model");
const { sequelize } = require("../../../../../configs/database");
const {
  toUpperCase,
  trimSpace,
  toUpperCaseOrNull,
} = require("../../../../../utils/helpers/text_checker");

const getAllProductsWithPagination = async (req, res, next) => {
  try {
    const { pageIndex = 1, pageSize = 10, query = "", status = "" } = req.body;

    console.log("query", query);

    const condition = {
      [Op.and]: [{ deleted: false }],
    };

    if (query) {
      condition[Op.and].push({
        [Op.or]: [
          {
            product_code: {
              [Op.like]: `%${trimSpace(query)}%`,
            },
          },
          {
            item_code: {
              [Op.like]: `%${trimSpace(query)}%`,
            },
          },
          {
            name: {
              [Op.like]: `%${trimSpace(query)}%`,
            },
          },
          { "$Product.name$": { [Op.like]: `%${query}%` } },
        ],
      });
    }

    const products = await Product.findAndCountAll({
      where: { ...condition },
      limit: pageSize,
      offset: (pageIndex - 1) * pageSize,
      attributes: [
        "drawing_number",
        "product_id",
        "name",
        "item_code",
        "row_code",
        "pump_model",
        "product_code",
        "unit_measurement",
        "hsn_code",
        "description",
        "standard_lead_time",
        "standard_lead_time_type",
        "raw_lead_time",
        "raw_lead_time_type",
        "machine_lead_time",
        "machine_lead_time_type",
        "quality_lead_time",
        "quality_lead_time_type",
        "createdAt",
      ],

      include: [
        {
          model: Pattern,
          attributes: [
            "pattern_id",
            "number",
            "status",
            "availability",
            "description",
          ],
        },
        {
          model: Category,
          attributes: ["category_id", "name", "status"],
        },
        {
          model: MaterialGrade,
          attributes: ["material_grade_id", "number", "status"],
        },
      ],
    });

    console.log("products", products);
    return res
      .status(200)
      .json({ success: true, total: products.count, data: products.rows });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

const getProductDetailsByProductId = async (req, res, next) => {
  try {
    const { product_id } = req.body;
    const condition = {
      [Op.and]: [{ deleted: false }, { product_id }],
    };

    const product = await Product.findOne({
      where: { ...condition },
      attributes: [
        "drawing_number",
        "product_id",
        "pattern_id",
        "category_id",
        "material_grade_id",
        "name",
        "item_code",
        "row_code",
        "pump_model",
        "product_code",
        "unit_measurement",
        "hsn_code",
        "description",
        "standard_lead_time",
        "raw_lead_time",
        "machine_lead_time",
        "quality_lead_time",
        "standard_lead_time_type",
        "raw_lead_time_type",
        "machine_lead_time_type",
        "quality_lead_time_type",
        "createdAt",
      ],
    });

    if (!product) {
      return next(globalError(200, "Product not found"));
    }
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.log("ji");
    return next(globalError(500, error.message));
  }
};

const getProductByCategoryId = async (req, res, next) => {
  try {
    const { category_id } = req.body;
    const condition = {
      [Op.and]: [{ deleted: false }, { category_id }],
    };

    const product = await Product.findAll({
      where: { ...condition },
      attributes: [
        "product_id",
        "drawing_number",
        "name",
        "item_code",
        "row_code",
        "pump_model",
        "product_code",
        "unit_measurement",
        "standard_lead_time",
        "standard_lead_time_type",
        "material_grade_id",
      ],
      include: [
        {
          model: MaterialGrade,
          attributes: ["number"],
        },
        {
          model: Drawing,
        },
      ],
    });
    if (!product) {
      return next(globalError(200, "Product not found"));
    }
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.log("ji");
    return next(globalError(500, error.message));
  }
};

const getAllProductsWithDrawing = async (req, res, next) => {
  try {
    const condition = {
      [Op.and]: [{ deleted: false }],
    };

    const product = await Product.findAll({
      where: { ...condition },
      attributes: [
        "product_id",
        "drawing_number",
        "name",
        "item_code",
        "row_code",
        "pump_model",
        "product_code",
        "unit_measurement",
        "standard_lead_time",
        "standard_lead_time_type",
      ],
      include: [
        {
          model: Drawing,
          where: { deleted: false },
          attributes: ["drawing_id", "revision_number"],
          required: true,
        },
      ],
    });
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    return next(globalError(500, "Internal server error"));
  }
};

const getAllProductsCodeAsOption = async (req, res, next) => {
  try {
    const condition = {
      [Op.and]: [{ deleted: false }],
    };

    const products = await Product.findAll({
      where: { ...condition },
      attributes: ["product_code", "product_id"],
    });

    const data = products?.map((obj) => {
      let { product_code, product_id } = obj.toJSON();
      return { label: product_code, value: product_id };
    });
    return res.status(200).json({ success: true, data: data });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

const getAllProductsItemCodeAsOption = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      attributes: ["item_code", "product_id"],
    });

    const data = products?.map((obj) => {
      let { item_code, product_id } = obj.toJSON();
      return { label: item_code, value: item_code };
    });
    return res.status(200).json({ success: true, data: data });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

const getAllProductsAsOption = async (req, res, next) => {
  try {
    const {
      project_no = "",
      DeliveryStatus = "0",
      number = "",
      serial_number = "",
    } = req.body;
    let que = `
    SELECT product_name,item_code,drawing_number,product_id,material_grade,revision_number FROM view_masterproductplaner
    WHERE 1 ${project_no ? " AND project_no = :project_no" : " "}  ${
      number ? " AND number = :number" : " "
    } ${serial_number ? " AND serial_number= :serial_number" : " "} 
    AND pending_quantity ${DeliveryStatus === "0" ? "> 0" : "= 0"}
`;

    let replacements = { project_no, number, serial_number };

    // if (DeliveryStatus !== "0") {
    //   replacements.DeliveryStatus = DeliveryStatus;
    // }

    const result = await sequelize.query(que, {
      replacements: replacements,
    });

    const uniqueProducts = Array.from(
      new Map(
        result.flat().map((product) => [product.product_id, product])
      ).values()
    );

    if (uniqueProducts.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const data = [
      { label: "All Products", value: "" },
      ...uniqueProducts.map((product) => ({
        label: `${product.product_name} \n ${product.item_code} \n ${product.drawing_number} /n ${product.revision_number} \n ${product.material_grade}`,
        value: product.product_id,
      })),
    ];

    return res.status(200).json({ success: true, data: data });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

const downloadDrawingByDrawingId = async (req, res, next) => {
  try {
    const { pdf_attachment_id } = req.body;

    const pdf = await PdfAttachment.findByPk(pdf_attachment_id);

    if (!pdf) {
      return next(globalError(404, "PDF attachment not found"));
    }

    const pdfData = pdf.content;
    const mimeType = pdf.mime_type;
    const name = pdf.field_name;

    console.log(pdf_attachment_id);

    res.setHeader("Content-Disposition", `attachment; filename=${name}`);
    res.setHeader("Content-Type", mimeType);

    res.status(200).send(pdfData);
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = {
  getAllProductsWithPagination,
  getProductDetailsByProductId,
  getAllProductsWithDrawing,
  getAllProductsCodeAsOption,
  downloadDrawingByDrawingId,
  getProductByCategoryId,
  getAllProductsItemCodeAsOption,
  getAllProductsAsOption,
};
