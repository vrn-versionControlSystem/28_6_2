const { Op } = require("sequelize");
const BreakDown = require("../../../../../../models/company.models/machine.models/breakdown.model");
const globalError = require("../../../../../../errors/global.error");

const getBreakdown = async (req, res, next) => {
  try {
    const { pageIndex = 1, pageSize = 10, query = "" } = req.body;

    const { count, rows: breakdown } = await BreakDown.findAndCountAll({
      where: { deleted: false },
      limit: +pageSize,
      offset: (+pageIndex - 1) * +pageSize,
    });
    if (count === 0) {
      return res.status(200).json({ sucess: true, total: 0, data: [] });
    }
    const data = breakdown.map((breakdown) => {
      const { deleted, ...otherData } = breakdown.toJSON();
      return otherData;
    });
    return res.status(200).json({ sucess: true, total: count, data: data });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = {
  getBreakdown,
};
