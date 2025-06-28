const dayjs = require("dayjs");
const globalError = require("../../../../../errors/global.error");
const PurchaseOrder = require("../../../../../models/company.models/purchaseOrder_and_purchaseOrderList.models/purchaseOrder");
const { sequelize } = require("../../../../../configs/database");
const {
  toUpperCase,
  trimSpace,
  toUpperCaseOrNull,
} = require("../../../../../utils/helpers/text_checker");

const newPurchaseOrderRegistration = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const {
      number,
      Customer,
      date = new Date(),
      currency_type = "INR",
    } = req.body;

    const value = {
      number: toUpperCaseOrNull(trimSpace(number)),
      customer_id: Customer.customer_id,
      currency_type,
      date: dayjs(date).format("YYYY-MM-DD"),
      added_by: req.jwtTokenDecryptData.authority[0],
      added_by_id: req.jwtTokenDecryptData.user["user_id"],
    };

    const find = await PurchaseOrder.findOne({
      where: {
        number: value.number,
        deleted:false,
      },
    });

    if (find) {
      return next(globalError(500, "Po Number Already Exist"));
    }

    const newPo = await PurchaseOrder.create(value, { transaction: t });
    if (!newPo) {
      await t.rollback();
      return next(globalError(500, "Something went wrong"));
    }
    await newPo.save();
    req.po = newPo.toJSON();
    req.t = t;
    return next();
  } catch (error) {
    await t.rollback();
    return next(globalError(500, error.message));
  }
};

module.exports = { newPurchaseOrderRegistration };
