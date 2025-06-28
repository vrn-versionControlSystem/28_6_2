const Stock = require("../../../../../models/company.models/stock.models/stock");
const globalError = require("../../../../../errors/global.error");

const deleteStockByStockId = async (req, res, next) => {
  try {
    const { stock_id } = req.body;
    const value = {
      stock_deleted: true,
    };
    const deletedStock = await Stock.update(value, {
      where: {
        stock_id,
      },
    });
    if (deletedStock[0] === 0) {
      return next(globalError(404, "Stock not deleted"));
    }
    return res
      .status(200)
      .json({ success: true, message: "Stock successfully deleted" });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = { deleteStockByStockId };
