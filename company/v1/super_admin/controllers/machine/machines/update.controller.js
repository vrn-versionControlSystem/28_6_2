const { Op } = require("sequelize");
const Machine = require("../../../../../../models/company.models/machine.models/machine.model");
const globalError = require("../../../../../../errors/global.error");

const updateMachine = async (req, res, next) => {
  try {
    const {
      machine_name,
      machine_type,
      machine_model,
      machine_description,
      company_name,
      machine_id,
    } = req.body;
    const machine = await Machine.update(
      {
        machine_name,
        machine_type,
        machine_model,
        machine_description,
        company_name,
      },
      {
        where: {
          machine_id: machine_id,
        },
      }
    );
    if (machine[0] === 0) {
      return next(globalError(400, "something went wrong"));
    }
    return res
      .status(200)
      .json({ sucess: true, message: "successfully updated", data: value });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = {
  updateMachine,
};
