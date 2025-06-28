const { Op } = require("sequelize");
const Machine = require("../../../../../../models/company.models/machine.models/machine.model");
const globalError = require("../../../../../../errors/global.error");

const deleteMachine = async (req, res, next) => {
  try {
    const { machine_id } = req.body;
    const deletedMachine = await Machine.update(
      { deleted: true },
      {
        where: {
          machine_id,
        },
      }
    );
    if (deletedMachine[0] === 0) {
      return res.status(400).json({ message: "Machine not deleted" });
    }
    res
      .status(200)
      .json({ message: "Machine deleted successfully", success: true });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = {
  deleteMachine,
};
