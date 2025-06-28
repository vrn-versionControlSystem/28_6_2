const globalError = require("../../../../../../errors/global.error");
const Enquiry = require("../../../../../../models/company.models/enquiry.models/enquiryMaster");
const EnquiryList = require("../../../../../../models/company.models/enquiry.models/enquiryDetails.model");

const getAllEnquiryListByEnquiryId = async (req, res, next) => {
  try {
    const { enquiry_id } = req.body;
    const enquiry = await Enquiry.findOne({
      where: { enquiry_id: enquiry_id },
    });

    if (!enquiry) {
      return next(globalError(404, "Enquiry not found"));
    } else {
      const { count, rows: enquiryList } = await EnquiryList.findAndCountAll({
        where: { enquiry_id: enquiry_id },
      });

      if (enquiryList[0] === 0) {
        return next(globalError(404, "EnquiryList not found"));
      }
      const datas = enquiryList.map((m) => {
        const { ...otherData } = m.toJSON();
        return otherData;
      });
      return res.status(200).json({
        success: true,
        data: { ...enquiry.toJSON(), enquiryList: datas },
      });
    }
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = { getAllEnquiryListByEnquiryId };
