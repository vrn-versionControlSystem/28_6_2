const Stocks = require("../../../../../models/company.models/stock.models/stocks");
const { Op } = require("sequelize");
const globalError = require("../../../../../errors/global.error");
const Product = require("../../../../../models/company.models/product.models/product.model");
const Category = require("../../../../../models/company.models/product.models/category.model");

const getAllStock = async (req, res, next) => {
  try {
    const { pageIndex = 1, pageSize = 10, query = "", status = "" } = req.query;

    const condition = {
      [Op.and]: [{ deleted: false }],
    };

    const stock = await Stocks.findAndCountAll({
      where: {
        ...condition,
      },
      include: [
        {
          model: Product,
          attributes: [
            "name",
            "product_id",
            "item_code",
            "product_code",
            "row_code",
          ],
          where: {
            [Op.or]: [
              {
                name: {
                  [Op.like]: `%${query}%`,
                },
              },
            ],
          },
          include: [
            {
              model: Category,
              attributes: ["name"],
            },
          ],
        },
      ],
      limit: +pageSize,
      offset: (+pageIndex - 1) * +pageSize,
    });

    if (stock?.rows.length === 0) {
      return res.status(200).json({
        success: true,
        total: 0,
        data: [],
        message: "Stock not Created",
      });
    }
    const data = stock?.rows.map((obj) => {
      const { stock_deleted, ...otherData } = obj.toJSON();
      return otherData;
    });
    return res.status(200).json({ success: true, total: stock.count, data });
  } catch (error) {
    next(globalError(500, error.message));
  }
};

const getAllStockData = async (req, res, next) => {
  try {
    const condition = {
      [Op.and]: [{ deleted: false }],
    };

    const stock = await Stocks.findAndCountAll({
      where: {
        ...condition,
      },
      include: [
        {
          model: Product,
          attributes: [
            "name",
            "product_id",
            "item_code",
            "product_code",
            "row_code",
          ],
          include: [
            {
              model: Category,
              attributes: ["name"],
            },
          ],
        },
      ],
    });

    if (stock?.rows.length === 0) {
      return res.status(200).json({
        success: true,
        total: 0,
        data: [],
        message: "Stock not Created",
      });
    }
    const data = stock?.rows.map((obj) => {
      const { stock_deleted, ...otherData } = obj.toJSON();
      return otherData;
    });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(globalError(500, error.message));
  }
};

module.exports = {
  getAllStock,
  getAllStockData,
};
