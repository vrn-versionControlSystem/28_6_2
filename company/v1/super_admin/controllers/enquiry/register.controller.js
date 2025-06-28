const Enquiry = require("../../../../../models/company.models/enquiry.models/enquiryMaster");
const globalError = require("../../../../../errors/global.error");
const { sequelize } = require("../../../../../configs/database");

const newEnquiryRegistration = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const {
      customer_id,
      enquiry_date,
      enquiry_type,
      enq_number,
      poc_name,
      poc_contact,
    } = req.body;
    const value = {
      customer_id,
      enquiry_date,
      enquiry_type,
      enq_number: enq_number.replace(/\s+/g, "").toUpperCase(),
      poc_name: poc_name.toUpperCase(),
      poc_contact,
      added_by: req.jwtTokenDecryptData.authority[0],
      added_by_id: req.jwtTokenDecryptData.user["user_id"],
    };

    const find = await Enquiry.findOne({
      where: {
        enq_number: value.enq_number,
        deleted: false,
      },
      transaction: t,
    });

    if (find) {
      return next(globalError(500, "Enquiry Number Already Exist"));
    }

    const newEnquiry = await Enquiry.create(value, { transaction: t });
    if (!newEnquiry) {
      await t.rollback();
      return next(globalError(500, "Something went wrong"));
    }
    req.newEnquiry = newEnquiry.toJSON();
    req.t = t;
    return next();
  } catch (error) {
    await t.rollback();
    return next(globalError(500, error.message));
  }
};

module.exports = { newEnquiryRegistration };
