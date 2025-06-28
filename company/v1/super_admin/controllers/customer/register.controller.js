const { sequelize } = require("../../../../../configs/database");
const globalError = require("../../../../../errors/global.error");
const Customer = require("../../../../../models/company.models/customer.models/customer.model");
const {
  toUpperCase,
  trimSpace,
  toUpperCaseOrNull,
  toLowerCaseOrNull,
} = require("../../../../../utils/helpers/text_checker");

const newCustomerRegistration = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { name, vender_code, phone, mobile, pan, gst_no, email, type, code } =
      req.body;

    const cleanedCustomer = toUpperCase(trimSpace(name));
    console.log("cleanedCustomer", cleanedCustomer);

    const existingCustomer = await Customer.findOne({
      where: {
        name: cleanedCustomer,
      },
    });
    console.log("existingCustomer", existingCustomer);

    if (existingCustomer) {
      return next(globalError(409, "Customer already exist"));
    }

    const value = {
      name: toUpperCase(trimSpace(name)),
      vender_code: toUpperCaseOrNull(trimSpace(vender_code)),
      mobile,
      phone,
      gst_no: toUpperCaseOrNull(trimSpace(gst_no))?.split(" ").join(""),
      pan: toUpperCaseOrNull(trimSpace(pan))?.split(" ").join(""),
      email: toLowerCaseOrNull(trimSpace(email))?.split(" ").join(""),
      type,
      customer_code: toUpperCaseOrNull(trimSpace(code)),
      added_by: req.jwtTokenDecryptData.authority[0],
      added_by_id: req.jwtTokenDecryptData.user["user_id"],
    };

    const customer = await Customer.create(value, {
      transaction: t,
    });
    if (!customer) {
      await t.rollback();
      return next(globalError(500, "Something went wrong"));
    }
    req.customer = customer.toJSON();
    req.t = t;
    return next();
  } catch (error) {
    await t.rollback();
    return next(globalError(500, error.message));
  }
};

module.exports = { newCustomerRegistration };
