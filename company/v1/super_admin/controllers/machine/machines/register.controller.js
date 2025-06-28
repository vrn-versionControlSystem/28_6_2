const { Op } = require("sequelize");
const Machine = require("../../../../../../models/company.models/machine.models/machine.model");
const globalError = require("../../../../../../errors/global.error");

const createMachine = async (req, res, next) => {
  try {
    const {
      machine_name,
      machine_type,
      machine_model,
      machine_description,
      company_name,
    } = req.body;

    const value = {
      added_by: req.jwtTokenDecryptData.authority[0],
      added_by_id: req.jwtTokenDecryptData.user["user_id"],
      machine_name,
      machine_type,
      machine_model,
      machine_description,
      company_name,
    };

    const machine = await Machine.create(value);

    if (!machine) {
      return next(globalError(500, "Something went wrong"));
    }
    res.status(200).json({
      success: true,
      message: "Successfully Created",
      data: machine.toJSON(),
    });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = {
  createMachine,
};
