const Stock = require("../../../../../models/company.models/stock.models/stock");
const globalError = require("../../../../../errors/global.error");

const updateStockDetailsByStockId = async (req, res, next) => {
  try {
    const {
      product_id,
      stock_cost,
      stock_status,
      stock_quantity,
      stock_expiry_date,
      stock_storage_location,
      stock_entry_date,
      stock_id,
    } = req.body;

    const value = {
      product_id,
      stock_cost,
      stock_status,
      stock_quantity,
      stock_expiry_date,
      stock_storage_location,
      stock_entry_date,
    };

    const stock = await Stock.update(value, {
      where: {
        stock_id: Number(stock_id),
      },
    });

    if (stock[0] === 0) {
      return next(globalError(404, "Stock not found"));
    }
    return res
      .status(200)
      .json({ success: true, message: "Stock successfully updated" });
  } catch (error) {
    next(globalError(500, error));
  }
};

module.exports = { updateStockDetailsByStockId };
