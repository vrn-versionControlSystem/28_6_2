const {
  toUpperCase,
  toUpperCaseOrNull,
} = require("../../../../../../utils/helpers/text_checker");
const EnquiryList = require("../../../../../../models/company.models/enquiry.models/enquiryDetails.model");
const globalError = require("../../../../../../errors/global.error");
const dayjs = require("dayjs");

const newEnquiryListRegistration = async (req, res, next) => {
  const t = req.t;
  try {
    const { items = [] } = req.body;

    const { enquiry_id } = req.newEnquiry;

    const array = items.map((m) => {
      return {
        enquiry_id,
        product_id: m.Product?.product_id,
        drawing_id: m.Product?.Drawings[0].drawing_id,
        quantity: parseFloat(m.quantity),
        delivery_date: dayjs(m.delivery_date).format("YYYY-MM-DD"),
      };
    });

    const newEnquiryList = await EnquiryList.bulkCreate(array, {
      transaction: t,
    });
    if (!newEnquiryList) {
      await t.rollback();
      return next(globalError(500, "Something went wrong"));
    }

    await t.commit();
    return res.status(201).json({
      success: true,
      message: "Enquiry Successfully Created",
    });
  } catch (error) {
    await t.rollback();
    return next(globalError(500, error.message));
  }
};

module.exports = { newEnquiryListRegistration };
