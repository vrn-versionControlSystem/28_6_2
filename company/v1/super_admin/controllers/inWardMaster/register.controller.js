const InWardMaster = require("../../../../../models/company.models/inwardMaster.models/inwardMaster.model");
const globalError = require("../../../../../errors/global.error");
const dayjs = require("dayjs");
const { sequelize } = require("../../../../../configs/database");

const newInwardRegistration = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const {
      purchase_order_id,
      Customer,
      inward_date,
      inward_no,
      bill_no,
      bill_date,
      challan_no,
      challan_date,
    } = req.body;
    const value = {
      purchase_order_id,

      customer_id: Customer?.customer_id,
      inward_no,
      bill_no,
      bill_date: dayjs(bill_date).format("YYYY-MM-DD"),
      challan_no,
      challan_date: dayjs(challan_date).format("YYYY-MM-DD"),
      inward_date: dayjs(inward_date).format("YYYY-MM-DD"),
      added_by: req.jwtTokenDecryptData.authority[0],
      added_by_id: req.jwtTokenDecryptData.user["user_id"],
    };

    const newinward = await InWardMaster.create(value, { transaction: t });
    if (!newinward) {
      await t.rollback();
      return next(globalError(500, "Something went wrong"));
    }
    req.NewInward = newinward.toJSON();
    req.t = t;
    return next();
  } catch (error) {
    await t.rollback();
    return next(globalError(500, error.message));
  }
};

module.exports = { newInwardRegistration };
