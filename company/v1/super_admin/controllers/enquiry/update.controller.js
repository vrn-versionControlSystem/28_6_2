const Enquiry = require("../../../../../models/company.models/enquiry.models/enquiryMaster");
const globalError = require("../../../../../errors/global.error");
const { sequelize } = require("../../../../../configs/database");

const updateEnquiry = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const {
      customer_id,
      enquiry_date,
      enquiry_type,
      enq_number,
      poc_name,
      poc_contact,
      enquiry_id,
    } = req.body;
    const value = {
      customer_id,
      enquiry_date,
      enquiry_type,
      enq_number,
      poc_name: poc_name.toUpperCase(),
      poc_contact,
    };

    const updateEnquiry = await Enquiry.update(value, {
      where: {
        enquiry_id,
      },
      transaction: t,
    });
    if (updateEnquiry[0] === 0) {
      await t.rollback();
      return next(globalError(500, "Enquiry Not Updated"));
    }
    req.enquiry_id = enquiry_id;
    req.t = t;
    return next();
  } catch (error) {
    await t.rollback();
    return next(globalError(500, error.message));
  }
};

module.exports = { updateEnquiry };
