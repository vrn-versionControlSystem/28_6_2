const { sequelize } = require("../../../../../../configs/database");
const { Op } = require("sequelize");
const globalError = require("../../../../../../errors/global.error");
const PoList = require("../../../../../../models/company.models/po_and_poList.models/po_list.model");
const DispatchList = require("../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_list.model");
const dayjs = require("dayjs");
const {
  toUpperCase,
  trimSpace,
} = require("../../../../../../utils/helpers/text_checker");
const path = require("path");
const fs = require("fs");

const updatePoListByPoListId = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const {
      list_status = "rejected",
      po_list_id,
      accept_delivery_date,
      accept_description,
    } = req.body;
    const value = {
      list_status,
      accept_delivery_date,
      accept_description,
    };
    const updatedPoList = await PoList.update(value, {
      where: { po_list_id },
      transaction: t,
    });
    if (updatedPoList[0] === 0) {
      await t.rollback();
      return next(globalError(404, "PO list not found"));
    }
    req.t = t;
    return next();
  } catch (error) {
    await t.rollback();
    return next(globalError(500, "Internal server error"));
  }
};

const updatePoListByPoListIdData = async (req, res, next) => {
  const t = req.t; // Use the transaction passed from the previous middleware
  try {
    console.log("1");
    const { items = [], po_id } = req.body;

    console.log("items", items);

    const incomingPoListIds = items
      .map((item) => item.po_list_id)
      .filter(Boolean);

    const POListIDs = await PoList.findAll({
      attributes: ["po_list_id"],
      where: {
        po_id,
        po_list_id: { [Op.notIn]: incomingPoListIds },
      },
      transaction: t,
      raw: true,
    });

    const DeletePOListIDS = POListIDs.map((record) => record.po_list_id);

    if (POListIDs.length > 0) {
      const dispatchListIDs = await DispatchList.findAll({
        where: {
          po_list_id: { [Op.in]: DeletePOListIDS },
        },
        transaction: t,
        raw: true,
      });

      if (dispatchListIDs.length > 0) {
        await t.rollback();
        return res.status(400).json({
          message: "Cannot delete items. You have created an Invoice for them.",
        });
      }

      await PoList.destroy({
        where: { po_list_id: { [Op.in]: DeletePOListIDS } },
        transaction: t,
      });
    }

    const newEntries = [];
    for (const item of items) {
      if (item.po_list_id) {
        await PoList.update(
          {
            project_no: toUpperCase(trimSpace(item.project_no)),
            product_id: item.Product.product_id,
            serial_number: toUpperCase(trimSpace(item.serial_number)),
            drawing_id: item?.Product?.Drawings?.find(
              (obj) => obj["revision_number"] === item.revision_number
            )?.drawing_id,
            quantity: item.quantity || 0,
            unit_price: item.unit_price || 0,
            delivery_date: dayjs(item.delivery_date).format("YYYY-MM-DD"),
            description: toUpperCase(trimSpace(item.description)),
            material_tc_verify_check: item?.material_tc_verify_check || false,
            internal_inspection_check: item?.internal_inspection_check || false,
            ndt_requirement_check: item?.ndt_requirement_check || false,
            final_inspection_check: item?.final_inspection_check || false,
            heat_treatment_check: item?.heat_treatment_check || false,
            other_check: item?.other_check || false,
            accept_description: item?.accept_description || "",
            accept_delivery_date: item?.accept_delivery_date
              ? dayjs(item.accept_delivery_date).format("YYYY-MM-DD")
              : null,

            list_status: item?.list_status,
          },
          {
            where: { po_list_id: item.po_list_id },
            transaction: t,
            logging: console.log,
          }
        );
      } else {
        newEntries.push({
          project_no: toUpperCase(trimSpace(item.project_no)),
          po_id: po_id,
          product_id: item.Product.product_id,
          serial_number: toUpperCase(trimSpace(item.serial_number)),
          drawing_id: item?.Product?.Drawings?.find(
            (obj) => obj["revision_number"] === item.revision_number
          )?.drawing_id,
          quantity: item.quantity || 0,
          unit_price: item.unit_price || 0,
          delivery_date: dayjs(item.delivery_date).format("YYYY-MM-DD"),
          description: toUpperCase(trimSpace(item.description)),
          material_tc_verify_check: item?.material_tc_verify_check || false,
          internal_inspection_check: item?.internal_inspection_check || false,
          ndt_requirement_check: item?.ndt_requirement_check || false,
          final_inspection_check: item?.final_inspection_check || false,
          heat_treatment_check: item?.heat_treatment_check || false,
          other_check: item?.other_check || false,
          accept_description: item?.accept_description || "",
          accept_delivery_date:
            dayjs(item?.accept_delivery_date).format("YYYY-MM-DD") || null,
          list_status: item.list_status,
        });
      }
    }

    if (newEntries.length > 0) {
      await PoList.bulkCreate(newEntries, { transaction: t });
    }

    return next();
  } catch (error) {
    if (!t.finished) await t.rollback();
    return res.status(500).json({ message: error.message });
  }
};

const updatePoListAttachment = async (req, res, next) => {
  try {
    const { po_list_id, fileName = "" } = req.body;
    const find = await PoList.findOne({
      where: { po_list_id },
    });

    if (!find) {
      return next(globalError(404, "PO list not found"));
    }
    let filePath = "";

    let value = {};
    if (fileName === "internal_inspection") {
      value.internal_inspection = req.file ? req.file.path : null;
      filePath = find.internal_inspection;
    }
    if (fileName === "material_tc_verify") {
      value.material_tc_verify = req.file ? req.file.path : null;
      filePath = find.material_tc_verify;
    }
    if (fileName === "ndt_requirement") {
      value.ndt_requirement = req.file ? req.file.path : null;
      filePath = find.ndt_requirement;
    }
    if (fileName === "final_inspection") {
      value.final_inspection = req.file ? req.file.path : null;
      filePath = find.final_inspection;
    }
    if (fileName === "heat_treatment") {
      value.heat_treatment = req.file ? req.file.path : null;
      filePath = find.heat_treatment;
    }
    if (fileName === "other") {
      value.other = req.file ? req.file.path : null;
      filePath = find.other;
    }

    if (filePath) {
      let relativePath = filePath.split("uploads/")[1];

      var fileUrl = path.join(
        __dirname,
        "../../../../../../uploads/" + relativePath
      );

      fs.access(fileUrl, fs.constants.F_OK, (err) => {
        if (err) {
          return res
            .status(404)
            .json({ success: false, message: "File not found" });
        }

        fs.unlink(fileUrl, async (err) => {
          if (err) {
            return next(globalError(404, "error deleting file"));
          }
        });
      });
    }

    const updatedPoList = await PoList.update(value, {
      where: { po_list_id },
    });
    if (updatedPoList[0] === 0) {
      return next(globalError(404, "PO list not found"));
    }
    return res
      .status(200)
      .json({ success: true, messgae: "uploaded successfully" });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

const DeletePoListAttachment = async (req, res, next) => {
  try {
    const { po_list_id, fileName = "" } = req.body;

    const find = await PoList.findOne({
      where: { po_list_id },
    });

    if (!find) {
      return next(globalError(404, "PO list not found"));
    }
    let filePath = "";
    let value = {};

    if (fileName === "internal_inspection") {
      filePath = find.internal_inspection;
      value.internal_inspection = null;
    }
    if (fileName === "material_tc_verify") {
      filePath = find.material_tc_verify;
      value.material_tc_verify = null;
    }
    if (fileName === "ndt_requirement") {
      filePath = find.ndt_requirement;
      value.ndt_requirement = null;
    }
    if (fileName === "final_inspection") {
      filePath = find.final_inspection;
      value.final_inspection = null;
    }
    if (fileName === "heat_treatment") {
      filePath = find.heat_treatment;
      value.heat_treatment = null;
    }
    if (fileName === "other") {
      filePath = find.other;
      value.other = null;
    }
    let relativePath = filePath.split("uploads/")[1];

    var fileUrl = path.join(
      __dirname,
      "../../../../../../uploads/" + relativePath
    );

    fs.access(fileUrl, fs.constants.F_OK, (err) => {
      if (err) {
        return res
          .status(404)
          .json({ success: false, message: "File not found" });
      }

      fs.unlink(fileUrl, async (err) => {
        if (err) {
          return next(globalError(404, "error deleting file"));
        }
        const update = await PoList.update(value, {
          where: { po_list_id },
        });
        if (update[0] === 0) {
          return next(globalError(404, "error updating Path"));
        }

        return res
          .status(200)
          .json({ success: true, message: "File deleted successfully" });
      });
    });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

const updateActualDate = async (req, res, next) => {
  // const t = await sequelize.transaction();
  try {
    const {
      po_list_id,
      actual_raw_date,
      actual_machine_date,
      actual_quality_date,
    } = req.body;
    console.log("req.body", req.body);

    const value = {
      actual_raw_date: actual_raw_date,
      actual_machine_date: actual_machine_date,
      actual_quality_date: actual_quality_date,
    };

    console.log("value", value);

    const updatedPoList = await PoList.update(value, {
      where: { po_list_id },
      // transaction: t,
    });

    const poList = await PoList.findAndCountAll({
      where: { po_list_id },
      // transaction: t,
    });

    if (updatedPoList[0] === 0) {
      return next(globalError(404, "PO list not found"));
    }
    return res
      .status(200)
      .json({ success: true, messgae: "uploaded successfully" });
    // req.t = t;
    // return next();
  } catch (error) {
    // await t.rollback();
    return next(globalError(500, "Internal server error"));
  }
};

module.exports = {
  updatePoListByPoListId,
  updatePoListByPoListIdData,
  updatePoListAttachment,
  DeletePoListAttachment,
  updateActualDate,
};
