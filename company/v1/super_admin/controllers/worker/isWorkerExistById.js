const globalError = require("../../../../../errors/global.error");
const Worker = require("../../../../../models/company.models/worker.models/worker");

const isWorkerExistsById = async (req, res, next) => {
  try {
    const { worker_id } = req.body;
    const isWorkerExist = await Worker.findOne({
      where: {
        worker_id,
      },
    });
    if (!isWorkerExist) {
      return next(globalError(406, "Vendor not found"));
    }
    req.worker = isWorkerExist.toJSON();
    return next();
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = { isWorkerExistsById };
