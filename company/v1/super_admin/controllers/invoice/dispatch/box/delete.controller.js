const globalError = require("../../../../../../../errors/global.error");
const DispatchBox = require("../../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_box_list");

const deleteDispatchBoxInvoice = async (req, res, next) => {
  try {
    const { dispatch_box_list_id } = req.body;

    const deleteDispatchBox = await DispatchBox.destroy({
      where: {
        dispatch_box_list_id,
      },
    });
    if (!deleteDispatchBox) {
      return next(globalError(500, "Box Not Deleted"));
    }

    return res.status(200).json({
      success: true,
      message: "Box Deleted Successfully",
    });
  } catch (error) {
    return next(globalError(500, "Some Error Occured"));
  }
};

module.exports = {
  deleteDispatchBoxInvoice,
};
