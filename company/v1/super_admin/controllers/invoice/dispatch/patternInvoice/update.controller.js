const { Op } = require("sequelize");
const globalError = require("../../../../../../../errors/global.error");
const PatternInvoiceList = require("../../../../../../../models/company.models/invoice.models/pattern_invoice.models/pattern_invoice_list");
const PatternInvoice = require("../../../../../../../models/company.models/invoice.models/pattern_invoice.models/pattern_invoice");

const updatePatternInvoiceListByDispatchListId = async (req, res, next) => {
  try {
    const {
      item_quantity = 0,
      pattern_invoice_list_id,
      remark = "",
      rate = 0,
      no = 0,
    } = req.body;

    console.log("request body", req.body);
    const value = {
      item_quantity,
      remark,
      rate,
      no,
    };
    const updatedDispatchList = await PatternInvoiceList.update(value, {
      where: { pattern_invoice_list_id },
    });
    if (updatedDispatchList[0] === 0) {
      return next(globalError(404, "Dispatch item not found"));
    }
    return res
      .status(200)
      .json({ success: true, message: "Dispatch item successfully updated" });
  } catch (error) {
    return next(globalError(500, "Internal server error"));
  }
};

const updatePatternInvoiceStatus = async (req, res, next) => {
  console.log("Received request body:", req.body);
  try {
    const { pattern_invoice_id, status } = req.body;
    

    if (!pattern_invoice_id || !status) {
      return next(
        globalError(400, "pattern_invoice_id and status are required")
      );
    }

    console.log("Received pattern_invoice_id:", pattern_invoice_id);
    console.log("Received status:", status);

    const updateResult = await PatternInvoice.update(
      { status },
      {
        where: {
          pattern_invoice_id,
        },
      }
    );

    console.log("Update Result:", updateResult);

    if (updateResult[0] === 0) {
      return next(globalError(500, "Failed to update status"));
    }

    return res.status(200).json({
      success: true,
      message: "Status successfully updated",
    });
  } catch (error) {
    console.log("Error:", error);
    return next(globalError(500, error.message));
  }
};

module.exports = {
  updatePatternInvoiceListByDispatchListId,
  updatePatternInvoiceStatus,
};
