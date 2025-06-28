const { Op } = require("sequelize");
const globalError = require("../../../../../../errors/global.error");
const WorkerLedger = require("../../../../../../models/company.models/worker.models/workerLedger");

const fetchAllLedgerByWorkerIdAndAuthority = async (req, res, next) => {
  try {
    const {
      pageIndex = 1,
      pageSize = 10,
      status = null,
      worker_id,
      startDate,
      endDate,
    } = req.body;

    if (
      req?.jwtTokenDecryptData?.authority?.includes("admin") ||
      req?.jwtTokenDecryptData?.authority.includes("super-admin")
    ) {
      let StartDate = new Date(startDate);
      let EndDate = new Date(endDate);

      let options = {
        where: {
          worker_id: Number(worker_id),
          created_at: {
            [Op.between]: [StartDate, EndDate],
          },
        },
        order: [["created_at", "DESC"]],
        limit: +pageSize,
        offset: (+pageIndex - 1) * +pageSize,
      };
      if (status) {
        options.where.type = status;
      }

      const { count, rows: ledger } = await WorkerLedger.findAndCountAll(
        options
      );

      if (count === 0) {
        return res.status(200).json({
          success: true,
          total: 0,
          data: [],
          message: "Worker Ledger not Created",
        });
      }

      return res
        .status(200)
        .json({ success: true, total: count, data: ledger });
    } else {
      return next(globalError(401, "You are not authenticated"));
    }
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = { fetchAllLedgerByWorkerIdAndAuthority };
