const InWardDetail = require("../../../../../../models/company.models/inwardMaster.models/inwardDetail.model");
const globalError = require("../../../../../../errors/global.error");
const { sequelize } = require("../../../../../../configs/database");
const path = require("path");
const fs = require("fs");

// const up=require("../../../../../../uploads")

const newInwardDetailRegistration = async (req, res, next) => {
  const t = req.t;
  try {
    console.log("2");
    const { items } = req.body;

    const value = items.map((m) => {
      return {
        product_id: m.Product?.product_id,
        ordered_quantity: m.quantity,
        actual_quantity: Number(m.actual_quantity),
        purchase_order_list_id: m.purchase_order_list_id,
        rejected_quantity: Number(m.rejected_quantity),
        inward_id: req.NewInward.inward_id,
        comments: m.comments,
        material_tc: m.material_tc,
        inward_inspection: m.inward_inspection,
        invoice: m.invoice,
        heat_treatment: m.heat_treatment,
        added_by: req.jwtTokenDecryptData.authority[0],
        added_by_id: req.jwtTokenDecryptData.user["user_id"],
      };
    });

    const newinwarddetail = await InWardDetail.bulkCreate(value, {
      transaction: t,
    });
    if (!newinwarddetail) {
      await t.rollback();
      return next(globalError(500, "Something went wrong"));
    }
    req.t = t;
    return next();
  } catch (error) {
    await t.rollback();
    return next(globalError(500, error.message));
  }
};

const uploadNewInwardAttachment = async (req, res, next) => {
  try {
    const { filePath = "" } = req.body;

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
            return next(globalError(404, "Error deleting file"));
          }

          return res
            .status(200)
            .json({ success: true, message: "File Deleted Successfully" });
        });
      });

      return;
    }

    if (req.file) {
      return res.status(200).json({
        success: true,
        message: "File uploaded successfully",
        path: req.file.path,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "File Not Uploaded" });
    }
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = { newInwardDetailRegistration, uploadNewInwardAttachment };
