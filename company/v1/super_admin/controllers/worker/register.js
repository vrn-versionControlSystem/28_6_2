const globalError = require("../../../../../errors/global.error");
const Worker = require("../../../../../models/company.models/worker.models/worker");

const newWorkerRegistration = async (req, res, next) => {
  try {
    const {
      worker_name,
      worker_mobile,
      worker_address,
      worker_adhaar,
      worker_pan,
      worker_dob,
      worker_image,
      worker_blood_group,
    } = req.body;
    const value = {
      worker_name,
      worker_mobile,
      worker_address,
      worker_adhaar,
      worker_pan,
      worker_dob,
      worker_image,
      worker_blood_group,
    };
    const worker = await Worker.create(value);
    if (!worker) {
      return next(globalError(500, "Something went wrong"));
    }
    await worker.save();
    const { worker_deleted, ...createdWorker } = worker.toJSON();
    return res.status(201).json({
      success: true,
      data: createdWorker,
      message: `Worker successfully created`,
    });
  } catch (error) {
    next(globalError(500, error.message));
  }
};

module.exports = { newWorkerRegistration };
