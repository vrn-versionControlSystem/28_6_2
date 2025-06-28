const { sequelize } = require("../../../../../configs/database");
const globalError = require("../../../../../errors/global.error");
const DispatchList = require("../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_list.model");
const Po = require("../../../../../models/company.models/po_and_poList.models/po.model");
const dayjs = require("dayjs");

const DeletePo = async (req, res, next) => {
  try {
    const { po_id } = req.body;
    value = { deleted: true };

    const dispatchExists = await DispatchList.findOne({
      where: { po_id },
    });

    if (dispatchExists) {
      return next(
        globalError(
          400,
          "Hold on! This Order is already tied to an Invoice. Please remove the Invoice first before deleting the Order."
        )
      );
    }

    const PoDeleted = await Po.destroy({
      where: {
        po_id,
      },
    });

    if (PoDeleted[0] === 0) {
      return next(globalError(500, "Not Deleted"));
    }

    return res
      .status(200)
      .json({ success: true, message: "Order Deleted Successfully" });
  } catch (error) {
    return next(globalError(500, "Internal server error"));
  }
};

module.exports = { DeletePo };
