const globalError = require("../../../../../../../errors/global.error");
const DispatchList = require("../../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_list.model");

const deleteDispatchListByDispatchListId = async (req, res, next) => {
  try {
    const { dispatch_list_id } = req.body;

    const result = await DispatchList.destroy({
      where: { dispatch_list_id },
    });

    if (result === 0) {
      return next(globalError(404, "Dispatch item not found"));
    }

    return res
      .status(200)
      .json({ success: true, message: "Dispatch item successfully deleted" });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = { deleteDispatchListByDispatchListId };
