const dayjs = require("dayjs");
const {
  toUpperCase,
  trimSpace,
  toUpperCaseOrNull,
} = require("../../../../../utils/helpers/text_checker");
const globalError = require("../../../../../errors/global.error");
const Po = require("../../../../../models/company.models/po_and_poList.models/po.model");
const { sequelize } = require("../../../../../configs/database");

const newPoRegistration = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const {
      number,
      Customer,
      date = new Date(),
      currency_type = "INR",
      Condition,
      Note,
      note = "",
    } = req.body;

    const value = {
      number: toUpperCaseOrNull(trimSpace(number)),
      customer_id: Customer.customer_id,
      currency_type,
      condition_id: Condition.condition_id,
      note_id: Note.note_id,
      date: dayjs(date).format("YYYY-MM-DD"),
      note,
      added_by: req.jwtTokenDecryptData.authority[0],
      added_by_id: req.jwtTokenDecryptData.user["user_id"],
    };

    const newPo = await Po.create(value, { transaction: t });
    if (!newPo) {
      await t.rollback();
      return next(globalError(500, "Something went wrong"));
    }
    req.po = newPo.toJSON();
    req.t = t;
    return next();
  } catch (error) {
    await t.rollback();
    return next(globalError(500, "Something went wrong"));
  }
};

module.exports = { newPoRegistration };
