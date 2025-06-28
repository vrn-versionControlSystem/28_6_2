const globalError = require("../../../../../errors/global.error");
const WorkerAttedance = require("../../../../../models/company.models/worker.models/workerAttendance");

const isAttendanceAlreadyMarked = async (req, res, next) => {
  try {
    const { worker_id, date } = req.body;

    const worker = await WorkerAttedance.findAll({
      where: {
        worker_id: +worker_id,
        date: date,
      },
    });
    console.log(worker);

    if (worker) {
      return next(globalError(406, "Attendance Already Marked"));
    } else {
      return next();
    }
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = { isAttendanceAlreadyMarked };
