const Enquiry = require("../../../../../models/company.models/enquiry.models/enquiryMaster");
const EnquiryList = require("../../../../../models/company.models/enquiry.models/enquiryDetails.model");
const globalError = require("../../../../../errors/global.error");
const { sequelize } = require("../../../../../configs/database");

const deleteEnquiry = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { enquiry_id } = req.body;

    await EnquiryList.destroy({
      where: enquiry_id,
      transaction: t,
    });

    await Enquiry.destroy({
      where: enquiry_id,
      transaction: t,
    });

    await t.commit();
    return res
      .status(200)
      .json({ success: true, message: "Enquiry successfully deleted" });
  } catch (error) {
    await t.rollback();
    return next(globalError(500, error.message));
  }
};

module.exports = { deleteEnquiry };
