const { Op } = require("sequelize");
const BreakDown = require("../../../../../../models/company.models/machine.models/breakdown.model");
const globalError = require("../../../../../../errors/global.error");

const createBreakdown = async (req, res, next) => {
  try {
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
      remarks,
      machine_id,
    } = req.body;

    const value = {
      added_by: req.jwtTokenDecryptData.authority[0],
      added_by_id: req.jwtTokenDecryptData.user["user_id"],
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
      remarks,
      machine_id,
    };

    const breakdown = await BreakDown.create(value);

    if (!breakdown) {
      return next(globalError(500, "Something went wrong"));
    }
    res.status(200).json({
      success: true,
      message: "Successfully Created",
      data: breakdown.toJSON(),
    });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = {
  createBreakdown,
};
