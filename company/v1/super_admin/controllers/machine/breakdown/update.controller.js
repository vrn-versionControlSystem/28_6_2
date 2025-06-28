const { Op } = require("sequelize");
const BreakDown = require("../../../../../../models/company.models/machine.models/breakdown.model");
const globalError = require("../../../../../../errors/global.error");

const updateBreakdown = async (req, res, next) => {
  try {
    const { breakdown_id } = req.body;
    const {
      breakdown_date,
      breakdown_time,
      machine_no,
      machine_problem,
      action_taken,
      maintenance,
      cost,
      responsible_person,
      spare_consumed,
      spare_cost,
      complete_date,
      complete_time,
      total_downtime,
      machine_id,
      remarks,
    } = req.body;
    const breakdown = await BreakDown.update(
      {
        breakdown_date,
        breakdown_time,
        machine_no,
        machine_problem,
        action_taken,
        maintenance,
        cost,
        responsible_person,
        spare_consumed,
        spare_cost,
        complete_date,
        complete_time,
        total_downtime,
        machine_id,
        remarks,
      },
      {
        where: {
          breakdown_id: breakdown_id,
        },
      }
    );
    if (breakdown[0] === 0) {
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
  updateBreakdown,
};
