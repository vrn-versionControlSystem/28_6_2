const { Op } = require("sequelize");
const Machine = require("../../../../../../models/company.models/machine.models/machine.model");
const globalError = require("../../../../../../errors/global.error");

const getMachine = async (req, res, next) => {
  try {
    const { pageIndex = 1, pageSize = 10, query = "" } = req.body;

    const { count, rows: machine } = await Machine.findAndCountAll({
      where: { deleted: false },
      limit: +pageSize,
      offset: (+pageIndex - 1) * +pageSize,
    });
    if (count === 0) {
      return res.status(200).json({ sucess: true, total: 0, data: [] });
    }
    const data = machine.map((machine) => {
      const { deleted, ...otherData } = machine.toJSON();
      return otherData;
    });
    return res.status(200).json({ sucess: true, total: count, data: data });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = {
  getMachine,
};
