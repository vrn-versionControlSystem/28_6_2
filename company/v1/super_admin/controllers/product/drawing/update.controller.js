const { sequelize } = require("../../../../../../configs/database");
const globalError = require("../../../../../../errors/global.error");
const Drawing = require("../../../../../../models/company.models/product.models/drawing.model");
const {
  toUpperCase,
  trimSpace,
  toUpperCaseOrNull,
} = require("../../../../../../utils/helpers/text_checker");

const deleteDrawingByDrawingId = async (req, res, next) => {
  try {
    const { drawing_id } = req.body;
    const value = {
      deleted: true,
    };
    const deleteDrawing = await Drawing.update(value, {
      where: { drawing_id },
    });
    if (deleteDrawing[0] === 0) {
      return next(globalError(404, "Drawing not found"));
    }
    return res
      .status(200)
      .json({ success: true, message: "Drawing successfully deleted" });
  } catch (error) {
    return next(globalError(500, "Internal server error"));
  }
};

const updateDrawingByDrawingId = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const {
      revision_number,
      raw_weight,
      finish_weight,
      product_id = "",
      drawing_id = "",
    } = req.body;

    const {
      raw_attachment = [],
      process_attachment = [],
      finish_attachment = [],
    } = req.files;

    if (!drawing_id) {
      await t.rollback();
      return next(globalError(400, "Drawing ID is required"));
    }

    const existingDrawing = await Drawing.findOne({
      where: { drawing_id },
    });

    if (!existingDrawing) {
      await t.rollback();
      return next(globalError(404, "Drawing not found"));
    }

    const updatedData = {
      revision_number: revision_number || existingDrawing.revision_number,
      raw_weight: raw_weight || existingDrawing.raw_weight,
      finish_weight: finish_weight || existingDrawing.finish_weight,
      raw_attachment_path:
        raw_attachment.length > 0
          ? raw_attachment[0].path
          : existingDrawing.raw_attachment_path,
      process_attachment_path:
        process_attachment.length > 0
          ? process_attachment[0].path
          : existingDrawing.process_attachment_path,
      finish_attachment_path:
        finish_attachment.length > 0
          ? finish_attachment[0].path
          : existingDrawing.finish_attachment_path,
    };

    await Drawing.update(updatedData, {
      where: { drawing_id },
      transaction: t,
    });

    req.t = t;
    req.values = { finish_weight, drawing_id };
    return next();
  } catch (error) {
    await t.rollback();
    return next(globalError(500, error.message));
  }
};

const updateFinishWeightInDispatchList = async (req, res, next) => {
  const t = req.t;
  try {
    const { finish_weight, drawing_id } = req.values;

    const query = `
    UPDATE dispatch_lists AS d
    JOIN po_lists AS p
    ON d.po_list_id = p.po_list_id
    SET d.item_weight = ?
    WHERE p.drawing_id = ?;
`;

    await sequelize.query(query, {
      replacements: [finish_weight, drawing_id],
      transaction: t,
    });

    await t.commit();
    return res
      .status(200)
      .json({ success: true, message: "Drawing successfully updated" });
  } catch (error) {
    await t.rollback();
    return next(globalError(500, error.message));
  }
};

module.exports = {
  deleteDrawingByDrawingId,
  updateDrawingByDrawingId,
  updateFinishWeightInDispatchList,
};
