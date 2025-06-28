const globalError = require("../../../../../errors/global.error");
const PurchaseOrder = require("../../../../../models/company.models/purchaseOrder_and_purchaseOrderList.models/purchaseOrder");
const {
  trimSpace,
  toUpperCaseOrNull,
} = require("../../../../../utils/helpers/text_checker");

const isPurchaseOrdernumberExist = async (req, res, next) => {
  try {
    const { number } = req.body;

    const find = await PurchaseOrder.findOne({
      where: {
        number: toUpperCaseOrNull(trimSpace(number)),
        deleted: false,
      },
    });

    if (find) {
      return next(globalError(500, "Po Number Already Exist"));
    }

    return res.status(200).json({ success: true, message: "PO Number Unique" });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = { isPurchaseOrdernumberExist };
