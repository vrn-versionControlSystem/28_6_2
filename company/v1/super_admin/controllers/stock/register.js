const Stocks = require("../../../../../models/company.models/stock.models/stocks");
const globalError = require("../../../../../errors/global.error");
const dayjs = require("dayjs");

const newStockRegistration = async (req, res, next) => {
  try {
    const {
      product_id,
      stock_cost,
      stock_quantity,
      stock_expiry_date,
      stock_storage_location,
      stock_entry_date,
    } = req.body;

    const value = {
      product_id,
      stock_cost,
      stock_quantity,
      stock_expiry_date,
      stock_storage_location,
      stock_entry_date,
    };

    const stock = await Stocks.create(value);

    if (!stock) {
      return next(globalError(500, "Something went wrong"));
    }

    const { stock_deleted, ...createdStock } = stock.toJSON();

    return res.status(201).json({
      success: true,
      data: createdStock,
      message: "Stock successfully created",
    });
  } catch (error) {
    next(globalError(500, error.message));
  }
};

const newStockInwardRegistration = async (req, res, next) => {
  const t = req.t;
  try {
    console.log("3");
    const { items } = req.body;

    for (const item of items) {
      const { Product, actual_quantity } = item;

      const productId = Product?.product_id;
      const actualQuantity = Number(actual_quantity);
      const addedBy = req.jwtTokenDecryptData.authority[0];
      const addedById = req.jwtTokenDecryptData.user["user_id"];

      const existingStock = await Stocks.findOne({
        where: { product_id: productId },
        transaction: t,
      });

      if (!existingStock) {
        const value = {
          product_id: productId,
          date: dayjs().format("YYYY-MM-DD"),
          opening_stock: actualQuantity,
          current_stock: actualQuantity,
          closing_stock: 0,
          inward_stock: actualQuantity,
        };

        const newStock = await Stocks.create(value, { transaction: t });

        if (!newStock) {
          await t.rollback();
          return next(globalError(400, "Not Added In stock"));
        }
      } else {
        const updatedCurrentStock =
          Number(existingStock.current_stock) +
          actualQuantity +
          Number(existingStock.production) -
          Number(existingStock.dispatched);

        const updateStock = await Stocks.update(
          {
            current_stock: updatedCurrentStock,
            inward_stock: Number(existingStock.inward_stock) + actualQuantity,
            added_by: addedBy,
            added_by_id: addedById,
          },
          {
            where: {
              stock_id: existingStock.stock_id,
            },
            transaction: t,
          }
        );

        if (updateStock[0] === 0) {
          await t.rollback();
          return res
            .status(404)
            .json({ success: false, message: "Stock Not Updated" });
        }
      }
    }

    req.t = t;
    return next();
  } catch (error) {
    await t.rollback();
    next(globalError(500, error.message));
  }
};

module.exports = { newStockRegistration, newStockInwardRegistration };
