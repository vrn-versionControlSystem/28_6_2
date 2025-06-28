const {
  toUpperCase,
  toUpperCaseOrNull,
} = require("../../../../../../utils/helpers/text_checker");
const EnquiryList = require("../../../../../../models/company.models/enquiry.models/enquiryDetails.model");
const globalError = require("../../../../../../errors/global.error");
const dayjs = require("dayjs");

const updateEnquiryList = async (req, res, next) => {
  const t = req.t;
  try {
    const { items = [] } = req.body;

    let enquiry_id = req.enquiry_id;
    const Ids = items.map((m) => m.enquiry_id);

    const del = await EnquiryList.destroy({
      where: {
        enquiry_id: Ids,
      },
      transaction: t,
    });

    if (del === 0) {
      await t.rollback();
      return next(globalError(500, "Enquiry Not Updated"));
    }

    const array = items.map((m) => {
      return {
        enquiry_id,
        product_id: m.Product?.product_id,
        drawing_id: m.Product?.Drawings[0].drawing_id,
        quantity: parseFloat(m.quantity),
        delivery_date: dayjs(m.delivery_date).format("YYYY-MM-DD"),
      };
    });

    const updateEnquiryList = await EnquiryList.bulkCreate(array, {
      transaction: t,
    });
    if (!updateEnquiryList) {
      await t.rollback();
      return next(globalError(500, "Enquiry Not Updated"));
    }

    await t.commit();
    return res.status(201).json({
      success: true,
      message: "Enquiry Updated Created",
    });
  } catch (error) {
    await t.rollback();
    return next(globalError(500, error.message));
  }
};

module.exports = { updateEnquiryList };
